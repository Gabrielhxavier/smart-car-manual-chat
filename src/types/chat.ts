export interface Citation {
  source: string;
  page?: string | number;
  section?: string;
  excerpt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  outOfScope?: boolean;
}

export interface ChatResponse {
  answer: string;
  citations: Citation[];
  out_of_scope: boolean;
  threadId: string;
}
