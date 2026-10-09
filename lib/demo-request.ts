export class DemoRequestError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'DemoRequestError';
  }
}

// Covers both receiving the response and reading its body.
export async function requestDemoJson<T>(url: string, init: RequestInit = {}, timeoutMs = 25000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {...init, credentials: 'same-origin', signal: controller.signal});
    if (response.redirected || !response.headers.get('content-type')?.includes('application/json')) {
      throw new DemoRequestError('Test yayınına erişim doğrulanamadı. Sayfayı yeniden açıp Vercel erişiminizi kontrol edin.', response.status);
    }
    const body = await response.json() as T & {error?: string};
    if (!response.ok) throw new DemoRequestError(body.error || `İstek tamamlanamadı (${response.status}). Lütfen yeniden deneyin.`, response.status);
    return body;
  } catch (error) {
    if (controller.signal.aborted) {
      throw new DemoRequestError('Demo verileri zamanında yüklenemedi. Lütfen yeniden deneyin.');
    }
    if (error instanceof DemoRequestError) throw error;
    throw new DemoRequestError('Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edip yeniden deneyin.');
  } finally {
    clearTimeout(timer);
  }
}
