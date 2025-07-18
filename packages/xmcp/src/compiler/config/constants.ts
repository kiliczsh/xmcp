import {
  CorsConfig,
  OauthConfig,
  AdapterConfig,
  ExperimentalConfig,
  PathsConfig,
} from ".";

/**
 * Default values for the HTTP server
 */

export const DEFAULT_HTTP_PORT = 3002;
export const DEFAULT_HTTP_HOST = "127.0.0.1";
export const DEFAULT_HTTP_BODY_SIZE_LIMIT = 1024 * 1024 * 10; // 10MB
export const DEFAULT_HTTP_ENDPOINT = "/mcp";
export const DEFAULT_HTTP_STATELESS = true;

/**
 * Default values for the tools directory
 */
export const DEFAULT_TOOLS_DIR = "src/tools";

/**
 * Default values for CORS config
 */
export const DEFAULT_CORS_CONFIG: CorsConfig = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "mcp-session-id",
    "mcp-protocol-version",
  ],
  exposedHeaders: ["Content-Type", "Authorization", "mcp-session-id"],
  credentials: true,
  maxAge: 600,
};

/**
 * Default values for Oauth config
 */
export const DEFAULT_OAUTH_CONFIG: OauthConfig = {
  endpoints: {
    authorizationUrl: "https://example.com/oauth2/authorize",
    tokenUrl: "https://example.com/oauth2/token",
    registerUrl: "https://example.com/oauth2/register",
  },
  issuerUrl: "https://example.com",
  baseUrl: "https://example.com",
  serviceDocumentationUrl: "https://example.com/oauth2/service-documentation",
  pathPrefix: "/oauth2",
  defaultScopes: ["openid", "profile", "email"],
};

/** */
