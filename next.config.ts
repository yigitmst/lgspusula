import type { NextConfig } from "next";
import path from "node:path";
const nextConfig: NextConfig = {
  serverExternalPackages: ["@vercel/blob"],
  outputFileTracingIncludes: {"/api/*": ["./drizzle/*.sql"]},
  webpack(config, {webpack}) {
    config.plugins.push(new webpack.NormalModuleReplacementPlugin(/^cloudflare:workers$/, path.resolve(process.cwd(), "lib/runtime/vercel-bindings.ts")));
    config.plugins.push(new webpack.NormalModuleReplacementPlugin(/[/\\]runtime[/\\]request-bindings(?:\.ts)?$/, path.resolve(process.cwd(), "lib/runtime/vercel-bindings.ts")));
    return config;
  },
};
export default nextConfig;
