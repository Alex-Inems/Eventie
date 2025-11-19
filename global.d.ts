export {};

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => { openIframe: () => void };
    };
  }
}

interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  ref: string;
  callback: (response: PaystackResponse) => void;
  onClose: () => void;
  channels?: string[];
  metadata?: Record<string, unknown>;
}

interface PaystackResponse {
  status: string;
  reference: string;
}
