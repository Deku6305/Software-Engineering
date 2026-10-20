import { EventEmitter } from 'events';

export interface ServiceEvent<T = any> {
  id: string;
  timestamp: string;
  sourceService: string;
  targetService?: string;
  eventType: string;
  payload: T;
  latencyMs?: number;
  correlationId: string;
}

class MicroserviceEventBus extends EventEmitter {
  private eventHistory: ServiceEvent[] = [];
  private readonly maxHistory = 100;

  constructor() {
    super();
    this.setMaxListeners(50);
  }

  public publish<T>(
    sourceService: string,
    eventType: string,
    payload: T,
    options?: { targetService?: string; correlationId?: string; latencyMs?: number }
  ): ServiceEvent<T> {
    const event: ServiceEvent<T> = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      sourceService,
      targetService: options?.targetService || 'broadcast',
      eventType,
      payload,
      latencyMs: options?.latencyMs ?? Math.floor(Math.random() * 8) + 2,
      correlationId: options?.correlationId || `corr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };

    // Store in ring buffer
    this.eventHistory.unshift(event);
    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory.pop();
    }

    // Emit typed event & global event
    this.emit(eventType, event);
    this.emit('*', event);

    return event;
  }

  public getRecentEvents(limit = 30): ServiceEvent[] {
    return this.eventHistory.slice(0, limit);
  }

  public clearHistory(): void {
    this.eventHistory = [];
  }
}

export const eventBus = new MicroserviceEventBus();
