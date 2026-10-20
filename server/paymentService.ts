import { eventBus } from './eventBus.ts';
import { bookingService } from './bookingService.ts';

export type PaymentChannel = 'VIETQR' | 'MOMO' | 'VNPAY' | 'ZALOPAY' | 'CREDIT_CARD';

export interface PaymentTransaction {
  transactionId: string;
  bookingId: string;
  amountVnd: number;
  channel: PaymentChannel;
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
  completedAt?: string;
}

class PaymentService {
  private transactions: Map<string, PaymentTransaction> = new Map();

  constructor() {
    // Listen for booking cancellation or updates if needed
  }

  public initiatePayment(data: {
    bookingId: string;
    amountVnd: number;
    channel: PaymentChannel;
  }): PaymentTransaction {
    const booking = bookingService.getBookingById(data.bookingId);
    if (!booking) {
      throw new Error(`Booking ${data.bookingId} not found`);
    }

    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const transferDescription = `LINHUNG ${data.bookingId.replace('LU-BKG-', '')}`;

    // Cryptographic signature simulation (HMAC-SHA256 fingerprint)
    const signature = `sha256_${Buffer.from(`${transactionId}:${data.bookingId}:${data.amountVnd}:${data.channel}`).toString('base64').substring(0, 32)}`;

    let qrData = '';
    let bankAccountInfo: PaymentTransaction['bankAccountInfo'] = undefined;

    if (data.channel === 'VIETQR') {
      bankAccountInfo = {
        bankName: 'Vietcombank Đà Nẵng (VCB)',
        accountNumber: '1029384756',
        accountName: 'BQL DI TICH CHUA LINH UNG SON TRA',
        transferDescription
      };
      // Standard VietQR URL format used across Vietnamese banking apps
      qrData = `https://api.vietqr.io/image/970436-1029384756-compact.png?amount=${data.amountVnd}&addInfo=${encodeURIComponent(transferDescription)}&accountName=${encodeURIComponent(bankAccountInfo.accountName)}`;
    } else if (data.channel === 'MOMO') {
      qrData = `2|99|0905123456|BQL CHUA LINH UNG||0|0|${data.amountVnd}|${transferDescription}|transfer_p2p`;
    } else if (data.channel === 'VNPAY') {
      qrData = `00020101021238540010A00000072701240006970436011010293847560208QRIBFTTA5303704540${data.amountVnd}5802VN5925BQL CHUA LINH UNG SON TRA6007DA NANG62190815${transferDescription}6304`;
    } else if (data.channel === 'ZALOPAY') {
      qrData = `zalopay://pay?amount=${data.amountVnd}&desc=${encodeURIComponent(transferDescription)}&app_id=2554`;
    }

    const transaction: PaymentTransaction = {
      transactionId,
      bookingId: data.bookingId,
      amountVnd: data.amountVnd,
      channel: data.channel,
      status: 'PENDING',
      qrData,
      bankAccountInfo,
      signature,
      createdAt: new Date().toISOString()
    };

    this.transactions.set(transactionId, transaction);

    eventBus.publish('PaymentService', 'PAYMENT_INITIATED', {
      transactionId,
      bookingId: data.bookingId,
      channel: data.channel,
      amountVnd: data.amountVnd
    }, {
      targetService: 'BookingService',
      latencyMs: 16
    });

    return transaction;
  }

  public confirmPayment(transactionId: string): PaymentTransaction {
    const tx = this.transactions.get(transactionId);
    if (!tx) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    tx.status = 'SUCCESS';
    tx.completedAt = new Date().toISOString();
    this.transactions.set(transactionId, tx);

    // Update Booking status
    bookingService.updateBookingStatus(tx.bookingId, 'PAID', tx.channel);

    // Publish event across the microservice mesh
    eventBus.publish('PaymentService', 'PAYMENT_COMPLETED', {
      transactionId: tx.transactionId,
      bookingId: tx.bookingId,
      amountVnd: tx.amountVnd,
      channel: tx.channel,
      signature: tx.signature
    }, {
      targetService: 'BookingService',
      latencyMs: 22
    });

    return tx;
  }

  public getTransaction(transactionId: string): PaymentTransaction | null {
    return this.transactions.get(transactionId) || null;
  }

  public verifyWebhook(payload: {
    transactionId: string;
    bookingId: string;
    amount: number;
    signature: string;
  }): boolean {
    const tx = this.transactions.get(payload.transactionId);
    if (!tx) return false;
    return tx.bookingId === payload.bookingId && tx.amountVnd === payload.amount;
  }
}

export const paymentService = new PaymentService();
