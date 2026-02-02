const SUPABASE_URL = "https://iijaqloachmqgkqwpphn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpamFxbG9hY2htcWdrcXdwcGhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMzY5OTgsImV4cCI6MjA4NTYxMjk5OH0.qyB4V0MO8orfVa-3gwrBCmadodU-g-Zilz_zFj84UnE";

export interface ChatApiResponse {
  response: string;
  threadId: string;
  citations?: Array<{
    source: string;
    page?: string | number;
    section?: string;
    excerpt: string;
  }>;
  out_of_scope?: boolean;
}

export interface ChatApiError {
  error: string;
  message?: string;
}

export async function sendChatMessage(
  message: string,
  threadId: string | null
): Promise<ChatApiResponse> {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/chat-assistant`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        message: message.trim(),
        threadId: threadId || null,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || errorData.error || `Erro HTTP: ${response.status}`
    );
  }

  const data = await response.json();
  return data;
}

// LocalStorage helpers for threadId persistence
const THREAD_ID_KEY = 'manual-veicular-thread-id';

export function getPersistedThreadId(): string | null {
  try {
    return localStorage.getItem(THREAD_ID_KEY);
  } catch {
    return null;
  }
}

export function persistThreadId(threadId: string | null): void {
  try {
    if (threadId) {
      localStorage.setItem(THREAD_ID_KEY, threadId);
    } else {
      localStorage.removeItem(THREAD_ID_KEY);
    }
  } catch {
    // localStorage not available
  }
}
