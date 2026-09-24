import {
  MonumentPoiData,
  RouteResult,
  ItineraryData,
  TicketPackageData,
  BookingOrderData,
  PaymentTransactionData,
  ServiceHealthData,
  ServiceEventData,
  PipelineRunData,
  SupportedLanguage
} from '../types/index.ts';

class ApiClient {
  private baseUrl = '/api';

  public async getPois(lang: SupportedLanguage = 'vi'): Promise<MonumentPoiData[]> {
    try {
      const res = await fetch(`${this.baseUrl}/pois?lang=${lang}`);
      if (!res.ok) throw new Error('Failed to fetch POIs');
      const data = await res.json();
      return data.pois;
    } catch (err) {
      console.error('API getPois error:', err);
      return [];
    }
  }

  public async getPoiByQr(code: string, lang: SupportedLanguage = 'vi'): Promise<MonumentPoiData | null> {
    try {
      const res = await fetch(`${this.baseUrl}/pois/qr/${encodeURIComponent(code)}?lang=${lang}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.poi;
    } catch (err) {
      console.error('API getPoiByQr error:', err);
      return null;
    }
  }

  public async getItineraries(lang: SupportedLanguage = 'vi'): Promise<ItineraryData[]> {
    try {
      const res = await fetch(`${this.baseUrl}/navigation/itineraries?lang=${lang}`);
      if (!res.ok) throw new Error('Failed to fetch itineraries');
      const data = await res.json();
      return data.itineraries;
    } catch (err) {
      console.error('API getItineraries error:', err);
      return [];
    }
  }

  public async calculateRoute(from: string, to: string, lang: SupportedLanguage = 'vi'): Promise<RouteResult | null> {
    try {
      const res = await fetch(`${this.baseUrl}/navigation/route?from=${from}&to=${to}&lang=${lang}`);
      if (!res.ok) throw new Error('Failed to calculate route');
      const data = await res.json();
      return data.route;
    } catch (err) {
      console.error('API calculateRoute error:', err);
      return null;
    }
  }

  public async getTickets(lang: SupportedLanguage = 'vi'): Promise<TicketPackageData[]> {
    try {
      const res = await fetch(`${this.baseUrl}/tickets?lang=${lang}`);
      if (!res.ok) throw new Error('Failed to fetch tickets');
      const data = await res.json();
      return data.packages;
    } catch (err) {
      console.error('API getTickets error:', err);
      return [];
    }
  }

  public async createBooking(params: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    ticketId: string;
    quantity: number;
    visitDate: string;
  }): Promise<BookingOrderData> {
    const res = await fetch(`${this.baseUrl}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Failed to create booking');
    const data = await res.json();
    return data.order;
  }

  public async initiatePayment(params: {
    bookingId: string;
    amountVnd: number;
    channel: string;
  }): Promise<PaymentTransactionData> {
    const res = await fetch(`${this.baseUrl}/payment/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Failed to initiate payment');
    const data = await res.json();
    return data.transaction;
  }

  public async confirmPayment(transactionId: string): Promise<{ transaction: PaymentTransactionData; booking: BookingOrderData }> {
    const res = await fetch(`${this.baseUrl}/payment/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId })
    });
    if (!res.ok) throw new Error('Failed to confirm payment');
    return await res.json();
  }

  public async sendChatMessage(message: string, history: { role: 'user' | 'assistant'; content: string }[], lang: SupportedLanguage): Promise<{ reply: string; source: string }> {
    const res = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, lang })
    });
    if (!res.ok) throw new Error('Chat API failed');
    return await res.json();
  }

  public async getServicesHealth(): Promise<{ services: ServiceHealthData[]; systemSummary: any }> {
    const res = await fetch(`${this.baseUrl}/system/services`);
    if (!res.ok) throw new Error('Failed to get services health');
    return await res.json();
  }

  public async getRecentEvents(): Promise<ServiceEventData[]> {
    const res = await fetch(`${this.baseUrl}/system/events`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.events;
  }

  public async getPipelines(): Promise<PipelineRunData[]> {
    const res = await fetch(`${this.baseUrl}/cicd/pipelines`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.pipelines;
  }

  public async triggerPipeline(branch?: string, commitMessage?: string): Promise<PipelineRunData> {
    const res = await fetch(`${this.baseUrl}/cicd/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branch, commitMessage })
    });
    if (!res.ok) throw new Error('Failed to trigger pipeline');
    const data = await res.json();
    return data.pipeline;
  }
}

export const apiClient = new ApiClient();
