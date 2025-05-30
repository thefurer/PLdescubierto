
export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply: string;
  error?: string;
}

export interface ContactInfo {
  tourOperator: string;
  email: string;
  website: string;
  whatsapp: string;
  location: string;
}
