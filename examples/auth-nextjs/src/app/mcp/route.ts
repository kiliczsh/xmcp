import { xmcpHandler } from "@xmcp/adapter";

/**
 * Verify the bearer token and return auth information
 * In a real implementation, this would validate against your auth service
 */
const verifyToken = async (req: Request, bearerToken?: string) => {
  if (!bearerToken) return undefined;

  // TODO: Replace with actual token verification logic
  // This is just an example implementation
  const isValid = bearerToken.startsWith("__TEST_VALUE__");

  if (!isValid) return undefined;

  return {
    token: bearerToken,
    scopes: ["read:messages", "write:messages"],
    clientId: "example-client",
    extra: {
      userId: "user-123",
      // Add any additional user/client information here
      permissions: ["user"],
      timestamp: new Date().toISOString(),
    },
  };
};

const options = {
  required: true,
  requiredScopes: ["read:messages"],
  resourceMetadataPath: "/.well-known/oauth-protected-resource",
};

const auth = {
  verifyToken,
  options,
};

export async function GET(request: Request) {
  return xmcpHandler(request, auth);
}

export async function POST(request: Request) {
  return xmcpHandler(request, auth);
}
