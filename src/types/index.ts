export type SupportedLanguage = 'vi' | 'en' | 'zh' | 'ko' | 'ja' | 'fr';

export interface MonumentPoiData {
  id: string;
  code: string;
  name: string;
  titleTag: string;
  category: 'monument' | 'temple' | 'nature' | 'viewpoint' | 'relic';
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // 0-100%
    mapY: number; // 0-100%
    elevationMeters: number;
    compassBearing: number;
  };
  audioDurationSeconds: number;
  audioVoiceFile: string;
  image: string;
  brief: string;
  fullHistory: string;
  spiritualMeaning: string;
  architecturalHighlights: string[];
  visitingTips: string;
  arModelType: string;
  currentLanguage?: string;
}

export interface RouteStepData {
  stepNumber: number;
  instruction: string;
  distanceMeters: number;
  estimatedMinutes: number;
  terrainType: string;
  icon: string;
}

export interface RouteResult {
  fromPoiId: string;
  toPoiId: string;
  totalDistanceMeters: number;
  estimatedMinutes: number;
  steps: RouteStepData[];
  safetyNote: string;
}

export interface ItineraryData {
  id: string;
  name: string;
  durationText: string;
  estimatedMinutes: number;
  distanceMeters: number;
  calorieBurn: number;
  recommendedTime: string;
  poiSequence: string[];
  description: string;
  badge: string;
}

export interface TicketPackageData {
  id: string;
  name: string;
  priceVnd: number;
  originalPriceVnd?: number;
  category: string;
  includes: string[];
  durationText: string;
  badge?: string;
  image: string;
}

export interface BookingOrderData {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  visitDate: string;
  ticketId: string;
  ticketName: string;
  quantity: number;
  totalAmountVnd: number;
  paymentMethod?: string;
  status: 'PENDING_PAYMENT' | 'PAID' | 'CHECKED_IN' | 'CANCELLED';
  qrTicketCode: string;
  createdAt: string;
  paidAt?: string;
}

export interface PaymentTransactionData {
  transactionId: string;
  bookingId: string;
  amountVnd: number;
  channel: 'VIETQR' | 'MOMO' | 'VNPAY' | 'ZALOPAY' | 'CREDIT_CARD';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  qrData?: string;
  bankAccountInfo?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    transferDescription: string;
  };
  signature: string;
  createdAt: string;
}

export interface ServiceHealthData {
  name: string;
  id: string;
  status: 'healthy' | 'degraded' | 'warning';
  uptimeSeconds: number;
  totalCalls: number;
  avgLatencyMs: number;
  errorRatePercent: number;
  endpoint: string;
  version: string;
  dependencies: string[];
}

export interface ServiceEventData {
  id: string;
  timestamp: string;
  sourceService: string;
  targetService?: string;
  eventType: string;
  payload: any;
  latencyMs?: number;
  correlationId: string;
}

export interface PipelineStageData {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  durationSeconds: number;
  logs: string[];
}

export interface PipelineRunData {
  runId: string;
  commitHash: string;
  commitMessage: string;
  author: string;
  branch: string;
  startedAt: string;
  completedAt?: string;
  status: 'running' | 'success' | 'failed';
  stages: PipelineStageData[];
  environment: 'production' | 'staging' | 'canary';
}
