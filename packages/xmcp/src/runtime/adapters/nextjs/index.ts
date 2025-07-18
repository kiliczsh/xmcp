import {
  createMcpHandler as createVercelMcpHandler,
  experimental_withMcpAuth as withMcpAuth,
} from "@vercel/mcp-adapter";
import {
  configureServer,
  INJECTED_CONFIG,
  loadTools,
} from "@/runtime/utils/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";

// extract the types from withMcpAuth arguments for auth config
type XmcpHandlerAuth = {
  verifyToken?: Parameters<typeof withMcpAuth>[1];
  options?: Parameters<typeof withMcpAuth>[2];
};

export async function xmcpHandler(
  request: Request,
  auth?: XmcpHandlerAuth
): Promise<Response> {
  const [toolPromises, toolModules] = loadTools();

  await Promise.all(toolPromises);

  const authConfigVerifyToken = auth?.verifyToken ?? undefined;
  const authConfigOptions = auth?.options ?? undefined;

  let requestHandler: (request: Request) => Promise<Response>;

  if (authConfigVerifyToken) {
    requestHandler = withMcpAuth(
      createVercelMcpHandler((server: McpServer) => {
        configureServer(server, toolModules);
      }, INJECTED_CONFIG),
      authConfigVerifyToken,
      authConfigOptions
    );
  } else {
    requestHandler = createVercelMcpHandler((server: McpServer) => {
      configureServer(server, toolModules);
    }, INJECTED_CONFIG);
  }

  return requestHandler(request);
}
