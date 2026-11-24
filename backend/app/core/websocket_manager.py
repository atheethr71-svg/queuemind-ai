"""
WebSocket connection manager for real-time broadcast to all connected clients.
Supports rooms/channels for location-specific broadcasts.
"""
import asyncio
import json
import logging
from collections import defaultdict
from typing import Any, Dict, List, Optional, Set

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class ConnectionManager:
    """
    Manages WebSocket connections and provides broadcast capabilities.

    Supports:
    - Global broadcast to all connected clients
    - Room-based broadcast to clients subscribed to a specific location
    - Individual messages to specific connections
    """

    def __init__(self):
        # All active connections: websocket -> user_id mapping
        self.active_connections: Dict[WebSocket, Optional[int]] = {}
        # Location-based rooms: location_id -> set of websockets
        self.rooms: Dict[str, Set[WebSocket]] = defaultdict(set)
        # Lock for thread-safe operations
        self._lock = asyncio.Lock()

    async def connect(
        self,
        websocket: WebSocket,
        user_id: Optional[int] = None,
        location_id: Optional[str] = None,
    ) -> None:
        """Accept a new WebSocket connection and register it."""
        await websocket.accept()
        async with self._lock:
            self.active_connections[websocket] = user_id
            if location_id:
                self.rooms[str(location_id)].add(websocket)
        logger.info(
            f"WebSocket connected: user_id={user_id}, location_id={location_id}, "
            f"total_connections={len(self.active_connections)}"
        )

    async def disconnect(
        self,
        websocket: WebSocket,
        location_id: Optional[str] = None,
    ) -> None:
        """Remove a WebSocket connection from all registries."""
        async with self._lock:
            self.active_connections.pop(websocket, None)
            if location_id and str(location_id) in self.rooms:
                self.rooms[str(location_id)].discard(websocket)
                if not self.rooms[str(location_id)]:
                    del self.rooms[str(location_id)]
            else:
                # Remove from all rooms
                for room_sockets in self.rooms.values():
                    room_sockets.discard(websocket)
        logger.info(
            f"WebSocket disconnected. Remaining connections: {len(self.active_connections)}"
        )

    async def send_personal_message(
        self,
        message: Dict[str, Any],
        websocket: WebSocket,
    ) -> None:
        """Send a JSON message to a single WebSocket client."""
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.warning(f"Failed to send personal message: {e}")
            await self.disconnect(websocket)

    async def broadcast(self, message: Dict[str, Any]) -> None:
        """Broadcast a JSON message to ALL connected clients."""
        if not self.active_connections:
            return

        disconnected: List[WebSocket] = []
        connections_snapshot = list(self.active_connections.keys())

        for websocket in connections_snapshot:
            try:
                await websocket.send_json(message)
            except Exception as e:
                logger.warning(f"Broadcast failed for a connection: {e}")
                disconnected.append(websocket)

        # Clean up dead connections
        for ws in disconnected:
            await self.disconnect(ws)

    async def broadcast_to_room(
        self,
        location_id: str,
        message: Dict[str, Any],
    ) -> None:
        """
        Broadcast a JSON message to all clients in a specific location room.
        Falls back to global broadcast if location has no dedicated subscribers.
        """
        room_key = str(location_id)
        if room_key not in self.rooms or not self.rooms[room_key]:
            # Broadcast globally if no room-specific subscribers
            await self.broadcast(message)
            return

        disconnected: List[WebSocket] = []
        room_snapshot = list(self.rooms[room_key])

        for websocket in room_snapshot:
            try:
                await websocket.send_json(message)
            except Exception as e:
                logger.warning(f"Room broadcast failed: {e}")
                disconnected.append(websocket)

        for ws in disconnected:
            await self.disconnect(ws, location_id=location_id)

    async def broadcast_queue_update(
        self,
        queue_data: Dict[str, Any],
        location_id: Optional[str] = None,
    ) -> None:
        """Convenience method to broadcast queue update events."""
        message = {
            "type": "queue_update",
            "data": queue_data,
        }
        if location_id:
            await self.broadcast_to_room(location_id, message)
        else:
            await self.broadcast(message)

    async def broadcast_alert(
        self,
        alert_data: Dict[str, Any],
        location_id: Optional[str] = None,
    ) -> None:
        """Convenience method to broadcast alert events."""
        message = {
            "type": "alert",
            "data": alert_data,
        }
        if location_id:
            await self.broadcast_to_room(location_id, message)
        else:
            await self.broadcast(message)

    async def broadcast_counter_update(
        self,
        counter_data: Dict[str, Any],
        location_id: Optional[str] = None,
    ) -> None:
        """Convenience method to broadcast counter update events."""
        message = {
            "type": "counter_update",
            "data": counter_data,
        }
        if location_id:
            await self.broadcast_to_room(location_id, message)
        else:
            await self.broadcast(message)

    @property
    def connection_count(self) -> int:
        """Return the total number of active connections."""
        return len(self.active_connections)


# Global singleton instance
manager = ConnectionManager()
