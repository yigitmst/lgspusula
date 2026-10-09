// Cloudflare already supplies request-scoped Worker bindings.
// Next's test build replaces this module with the Vercel demo adapter.
export function withDemoBindings(handler: (req: Request) => Promise<Response>) { return handler; }
