import { eventBus, ServiceEvent } from './eventBus.ts';

export interface ServiceHealth {
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

class MetricsService {
  private startTime = Date.now();
  private serviceCallCounts: Record<string, number> = {
    'PoiAudioService': 142,
    'NavigationService': 98,
    'BookingService': 45,
    'PaymentService': 37,
    'ChatAiService': 63,
    'CicdService': 29,
  };
  private serviceLatencies: Record<string, number[]> = {
    'PoiAudioService': [12, 15, 9, 14, 11],
    'NavigationService': [18, 22, 16, 20, 15],
    'BookingService': [25, 30, 22, 28, 24],
    'PaymentService': [45, 52, 40, 48, 44],
    'ChatAiService': [110, 140, 95, 120, 130],
    'CicdService': [15, 20, 12, 18, 14],
  };

  constructor() {
    // Listen to all events from eventBus to dynamically update metrics
    eventBus.on('*', (event: ServiceEvent) => {
      const src = event.sourceService;
      if (!this.serviceCallCounts[src]) {
        this.serviceCallCounts[src] = 0;
        this.serviceLatencies[src] = [];
      }
      this.serviceCallCounts[src]++;
      if (event.latencyMs) {
        this.serviceLatencies[src].push(event.latencyMs);
        if (this.serviceLatencies[src].length > 30) {
          this.serviceLatencies[src].shift();
        }
      }
    });
  }

  public recordServiceCall(serviceName: string, latencyMs: number) {
    if (!this.serviceCallCounts[serviceName]) {
      this.serviceCallCounts[serviceName] = 0;
      this.serviceLatencies[serviceName] = [];
    }
    this.serviceCallCounts[serviceName]++;
    this.serviceLatencies[serviceName].push(latencyMs);
    if (this.serviceLatencies[serviceName].length > 30) {
      this.serviceLatencies[serviceName].shift();
    }
  }

  public getServicesHealth(): ServiceHealth[] {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000) + 3600; // Simulated uptime

    const services = [
      {
        name: 'POI & Multilingual Audio Service',
        id: 'PoiAudioService',
        endpoint: '/api/pois',
        version: 'v2.4.1',
        dependencies: ['EventBus', 'StaticAssetsCDN'],
      },
      {
        name: 'Navigation & Anti-Lost Routing Service',
        id: 'NavigationService',
        endpoint: '/api/navigation',
        version: 'v2.1.0',
        dependencies: ['PoiAudioService', 'EventBus'],
      },
      {
        name: 'Booking & Tour Reservation Service',
        id: 'BookingService',
        endpoint: '/api/bookings',
        version: 'v3.0.2',
        dependencies: ['PaymentService', 'EventBus'],
      },
      {
        name: 'Secure Payment Gateway Service',
        id: 'PaymentService',
        endpoint: '/api/payment',
        version: 'v3.2.0',
        dependencies: ['VietQR-Hub', 'MoMo-Api', 'VNPay-SDK', 'EventBus'],
      },
      {
        name: 'Gemini AI Linh Ung Guide Service',
        id: 'ChatAiService',
        endpoint: '/api/chat',
        version: 'v1.9.5',
        dependencies: ['GoogleGenAI-SDK', 'EventBus'],
      },
      {
        name: 'CI/CD Pipeline & Orchestration Service',
        id: 'CicdService',
        endpoint: '/api/cicd',
        version: 'v4.0.0',
        dependencies: ['GitHubActions-Runner', 'DockerRegistry', 'K8sCluster'],
      },
    ];

    return services.map(s => {
      const latencies = this.serviceLatencies[s.id] || [15];
      const avgLatency = Math.round(
        latencies.reduce((a, b) => a + b, 0) / latencies.length
      );
      return {
        ...s,
        status: 'healthy' as const,
        uptimeSeconds: uptime,
        totalCalls: this.serviceCallCounts[s.id] || 50,
        avgLatencyMs: avgLatency,
        errorRatePercent: 0.04,
      };
    });
  }

  public getSystemSummary() {
    return {
      status: 'operational',
      environment: process.env.NODE_ENV || 'production',
      architecture: 'Microservices & Event-Driven Pub/Sub',
      cloudProvider: 'Google Cloud Platform (GCP) Cloud Run & GKE',
      nodeVersion: process.version,
      memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      activeServicesCount: 6,
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000) + 3600,
    };
  }
}

export const metricsService = new MetricsService();
