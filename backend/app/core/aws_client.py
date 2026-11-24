"""
AWS client with graceful fallback for S3, SNS, and CloudWatch.
If AWS credentials are not configured, all methods log a warning
and return demo/mock responses instead of raising exceptions.
"""
import logging
import uuid
from datetime import datetime, timezone
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)

# Lazily initialized boto3 clients
_s3_client = None
_sns_client = None
_cloudwatch_client = None
_aws_available = None


def _check_aws_available() -> bool:
    """Check if AWS credentials are configured."""
    global _aws_available
    if _aws_available is not None:
        return _aws_available

    if not settings.AWS_ACCESS_KEY_ID or not settings.AWS_SECRET_ACCESS_KEY:
        logger.warning("AWS credentials not configured. Running in demo mode for AWS services.")
        _aws_available = False
        return False

    _aws_available = True
    return True


def _get_s3_client():
    """Lazily initialize and return the S3 client."""
    global _s3_client
    if _s3_client is None:
        try:
            import boto3
            _s3_client = boto3.client(
                "s3",
                region_name=settings.AWS_REGION,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            )
        except Exception as e:
            logger.error(f"Failed to initialize S3 client: {e}")
            return None
    return _s3_client


def _get_sns_client():
    """Lazily initialize and return the SNS client."""
    global _sns_client
    if _sns_client is None:
        try:
            import boto3
            _sns_client = boto3.client(
                "sns",
                region_name=settings.AWS_REGION,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            )
        except Exception as e:
            logger.error(f"Failed to initialize SNS client: {e}")
            return None
    return _sns_client


def _get_cloudwatch_client():
    """Lazily initialize and return the CloudWatch Logs client."""
    global _cloudwatch_client
    if _cloudwatch_client is None:
        try:
            import boto3
            _cloudwatch_client = boto3.client(
                "logs",
                region_name=settings.AWS_REGION,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            )
        except Exception as e:
            logger.error(f"Failed to initialize CloudWatch client: {e}")
            return None
    return _cloudwatch_client


def upload_to_s3(
    file_bytes: bytes,
    key: str,
    content_type: str = "application/octet-stream",
) -> str:
    """
    Upload a file to S3 and return its public URL.

    Args:
        file_bytes: Raw file bytes to upload.
        key: S3 object key (path within bucket).
        content_type: MIME type of the file.

    Returns:
        Public URL of the uploaded file, or a demo URL if AWS not configured.
    """
    if not _check_aws_available():
        demo_url = f"https://demo-storage.queuemind.ai/{key}"
        logger.info(f"[DEMO] S3 upload simulated. Demo URL: {demo_url}")
        return demo_url

    try:
        client = _get_s3_client()
        if not client:
            return f"https://demo-storage.queuemind.ai/{key}"

        client.put_object(
            Bucket=settings.AWS_S3_BUCKET,
            Key=key,
            Body=file_bytes,
            ContentType=content_type,
        )

        url = f"https://{settings.AWS_S3_BUCKET}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"
        logger.info(f"File uploaded to S3: {url}")
        return url

    except Exception as e:
        logger.error(f"S3 upload failed for key={key}: {e}")
        return f"https://demo-storage.queuemind.ai/{key}"


def generate_s3_key(prefix: str, filename: str) -> str:
    """Generate a unique S3 key with timestamp and UUID."""
    timestamp = datetime.now(timezone.utc).strftime("%Y/%m/%d")
    unique_id = str(uuid.uuid4())[:8]
    return f"{prefix}/{timestamp}/{unique_id}_{filename}"


def send_sns_notification(subject: str, message: str) -> bool:
    """
    Send an SNS notification.

    Args:
        subject: Notification subject.
        message: Notification body.

    Returns:
        True if sent successfully, False otherwise.
    """
    if not _check_aws_available():
        logger.info(f"[DEMO] SNS notification simulated. Subject: {subject} | Message: {message}")
        return True

    if not settings.AWS_SNS_TOPIC_ARN:
        logger.warning("AWS_SNS_TOPIC_ARN not configured. Skipping SNS notification.")
        return False

    try:
        client = _get_sns_client()
        if not client:
            return False

        response = client.publish(
            TopicArn=settings.AWS_SNS_TOPIC_ARN,
            Subject=subject[:100],  # SNS subject max 100 chars
            Message=message,
        )
        logger.info(f"SNS notification sent. MessageId: {response.get('MessageId')}")
        return True

    except Exception as e:
        logger.error(f"SNS notification failed: {e}")
        return False


def log_to_cloudwatch(log_group: str, message: str, log_stream: Optional[str] = None) -> bool:
    """
    Send a log event to AWS CloudWatch Logs.

    Args:
        log_group: CloudWatch log group name.
        message: Log message string.
        log_stream: Optional log stream name. Defaults to current date.

    Returns:
        True if logged successfully, False otherwise.
    """
    if not _check_aws_available():
        logger.debug(f"[DEMO] CloudWatch log simulated. Group={log_group} | {message}")
        return True

    if log_stream is None:
        log_stream = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    try:
        client = _get_cloudwatch_client()
        if not client:
            return False

        timestamp_ms = int(datetime.now(timezone.utc).timestamp() * 1000)

        # Ensure log group exists
        try:
            client.create_log_group(logGroupName=log_group)
        except client.exceptions.ResourceAlreadyExistsException:
            pass

        # Ensure log stream exists
        try:
            client.create_log_stream(logGroupName=log_group, logStreamName=log_stream)
        except client.exceptions.ResourceAlreadyExistsException:
            pass

        client.put_log_events(
            logGroupName=log_group,
            logStreamName=log_stream,
            logEvents=[{"timestamp": timestamp_ms, "message": message}],
        )
        return True

    except Exception as e:
        logger.error(f"CloudWatch logging failed: {e}")
        return False


def get_presigned_upload_url(key: str, content_type: str, expires_in: int = 3600) -> Optional[str]:
    """
    Generate a presigned URL for direct-to-S3 file upload.

    Args:
        key: S3 object key.
        content_type: Expected MIME type of the upload.
        expires_in: URL expiry in seconds (default 1 hour).

    Returns:
        Presigned URL string, or None if AWS not available.
    """
    if not _check_aws_available():
        logger.info(f"[DEMO] Presigned URL generation simulated for key={key}")
        return None

    try:
        client = _get_s3_client()
        if not client:
            return None

        url = client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": settings.AWS_S3_BUCKET,
                "Key": key,
                "ContentType": content_type,
            },
            ExpiresIn=expires_in,
        )
        return url

    except Exception as e:
        logger.error(f"Failed to generate presigned URL: {e}")
        return None
