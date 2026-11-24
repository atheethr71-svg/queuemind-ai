// All TypeScript interfaces for QueueMind AI

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: string | number;
  email: string;
  full_name: string;
  role: UserRole | string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  avatar_url?: string;
}

export type UserRole = 'super_admin' | 'facility_admin' | 'operator' | 'viewer' | 'admin';

export interface AuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: UserRole;
  facility_id?: string;
}

// ─── Facility & Location ──────────────────────────────────────────────────────

export type FacilityType = 'hospital' | 'canteen' | 'clinic' | 'bank' | 'service_centre' | 'other';

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  address: string;
  admin_id: string;
  created_at: string;
  locations?: Location[];
  total_counters?: number;
  active_counters?: number;
}

export interface Location {
  id: string;
  facility_id: string;
  name: string;
  type: string;
  max_capacity: number;
  current_count?: number;
  created_at: string;
  facility?: Facility;
}

// ─── Queue & Counters ─────────────────────────────────────────────────────────

export type QueueStatus = 'active' | 'paused' | 'closed';
export type CounterStatus = 'open' | 'busy' | 'closed' | 'break';

export interface Queue {
  id: string;
  location_id: string;
  current_length: number;
  status: QueueStatus;
  created_at: string;
  updated_at: string;
  location?: Location;
  predicted_wait_minutes?: number;
}

export interface Counter {
  id: string;
  location_id: string;
  name: string;
  status: CounterStatus;
  operator_id?: string;
  operator?: User;
  avg_service_time: number; // seconds
  served_today: number;
  created_at: string;
  updated_at: string;
  location?: Location;
}

// ─── Crowd Detection ──────────────────────────────────────────────────────────

export type DensityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface CrowdDetection {
  id: string;
  location_id: string;
  image_url?: string;
  people_count: number;
  density_level: DensityLevel;
  confidence: number; // 0-1
  model_used: string;
  is_demo: boolean;
  created_at: string;
  location?: Location;
}

export interface DetectionResult {
  detection: CrowdDetection;
  bounding_boxes?: BoundingBox[];
  heatmap_url?: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  label: string;
}

// ─── Waiting Time Predictions ─────────────────────────────────────────────────

export interface WaitingTimePrediction {
  id: string;
  queue_id: string;
  predicted_minutes: number;
  confidence: number; // 0-1
  model_used: string;
  inputs_json: Record<string, unknown>;
  created_at: string;
  queue?: Queue;
}

export interface PredictionRequest {
  queue_id: string;
  current_length: number;
  active_counters: number;
  avg_service_time: number;
  time_of_day?: string;
  day_of_week?: number;
  historical_data?: number[];
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export type AlertLevel = 'info' | 'warning' | 'critical';
export type AlertType =
  | 'overcrowding'
  | 'long_wait'
  | 'counter_down'
  | 'system_error'
  | 'anomaly'
  | 'capacity_breach';

export interface Alert {
  id: string;
  location_id: string;
  type: AlertType;
  level: AlertLevel;
  message: string;
  threshold_value?: number;
  actual_value?: number;
  is_acknowledged: boolean;
  acknowledged_by?: string;
  created_at: string;
  acknowledged_at?: string;
  location?: Location;
}

// ─── AI Agent ─────────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';

export interface AgentMessage {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  tool_calls?: ToolCall[];
  tool_calls_json?: string;
  created_at: string;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}

export interface AgentConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: AgentMessage[];
  message_count?: number;
}

export interface ChatRequest {
  conversation_id?: string;
  message: string;
  context?: Record<string, unknown>;
}

export interface ChatResponse {
  conversation_id: string;
  message: AgentMessage;
  tool_calls_made?: ToolCall[];
  processing_time_ms?: number;
}

// ─── Simulation ───────────────────────────────────────────────────────────────

export interface SimulationRequest {
  location_id: string;
  current_counters: number;
  proposed_counters: number;
  expected_arrivals_per_hour: number;
  avg_service_time_seconds: number;
  simulation_duration_minutes?: number;
}

export interface SimulationResult {
  id: string;
  user_id: string;
  location_id?: string;
  current_counters: number;
  proposed_counters: number;
  current_wait: number; // minutes
  predicted_wait: number; // minutes
  time_saved: number; // minutes
  throughput_improvement: number; // percentage
  cost_per_customer_saved?: number;
  utilization_current: number; // percentage
  utilization_proposed: number; // percentage
  inputs_json: SimulationRequest;
  created_at: string;
  queue_length_over_time?: QueueTrend[];
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardOverview {
  total_people_in_queue: number;
  avg_wait_time_minutes: number;
  active_counters: number;
  total_counters: number;
  alerts_count: number;
  critical_alerts_count: number;
  served_today: number;
  peak_hour: string;
  locations_summary: LocationSummary[];
  recent_detections: CrowdDetection[];
  queue_trends: QueueTrend[];
}

export interface LocationSummary {
  location_id: string;
  location_name: string;
  facility_name: string;
  current_queue: number;
  wait_minutes: number;
  density: DensityLevel;
  active_counters: number;
  total_counters: number;
}

export interface QueueTrend {
  timestamp: string;
  queue_length: number;
  wait_minutes?: number;
  served?: number;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface AnalyticsOverview {
  date_range: { start: string; end: string };
  total_served: number;
  avg_wait_time: number;
  peak_hour: PeakHour;
  busiest_day: string;
  counter_efficiency: number; // percentage
  customer_satisfaction_score?: number;
  peak_hours: PeakHour[];
  counter_performance: CounterPerformance[];
  daily_trends: DailyTrend[];
  density_distribution: DensityDistribution[];
}

export interface PeakHour {
  hour: number;
  avg_queue_length: number;
  avg_wait_minutes: number;
  total_served: number;
  label: string; // e.g. "12:00 PM"
}

export interface CounterPerformance {
  counter_id: string;
  counter_name: string;
  served_total: number;
  avg_service_time: number;
  utilization: number; // percentage
  efficiency_score: number; // 0-100
}

export interface DailyTrend {
  date: string;
  total_served: number;
  avg_wait: number;
  peak_queue: number;
}

export interface DensityDistribution {
  level: DensityLevel;
  count: number;
  percentage: number;
}

// ─── WebSocket ────────────────────────────────────────────────────────────────

export type WSMessageType =
  | 'queue_update'
  | 'counter_update'
  | 'detection_update'
  | 'alert_new'
  | 'alert_resolved'
  | 'prediction_update'
  | 'system_status'
  | 'ping'
  | 'pong';

export interface WebSocketMessage {
  type: WSMessageType;
  payload?: unknown;
  data?: any;
  timestamp: string;
  location_id?: string;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface ApiError {
  detail: string;
  status_code: number;
  errors?: Record<string, string[]>;
}
