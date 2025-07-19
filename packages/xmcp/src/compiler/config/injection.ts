import {
  getResolvedHttpConfig,
  getResolvedCorsConfig,
  getResolvedPathsConfig,
  getResolvedOAuthConfig,
} from "./utils";
import { HttpTransportConfig } from "./schemas/transport/http";

// perhaps type the variables?
export function injectHttpVariables(
  httpConfig: HttpTransportConfig | boolean,
  mode: string
) {
  const resolvedConfig = getResolvedHttpConfig(httpConfig);
  if (!resolvedConfig) return {};

  return {
    HTTP_PORT: resolvedConfig.port,
    HTTP_HOST: resolvedConfig.host,
    HTTP_BODY_SIZE_LIMIT: JSON.stringify(resolvedConfig.bodySizeLimit),
    HTTP_ENDPOINT: JSON.stringify(resolvedConfig.endpoint),
    HTTP_STATELESS: true, // eventually should be configurable for statfeul
    HTTP_DEBUG: mode === "development",
  };
}

export type HttpVariables = ReturnType<typeof injectHttpVariables>;

export function injectCorsVariables(httpConfig: HttpTransportConfig | null) {
  const corsConfig = getResolvedCorsConfig(httpConfig);

  return {
    HTTP_CORS_ORIGIN: JSON.stringify(corsConfig.origin ?? ""),
    HTTP_CORS_METHODS: JSON.stringify(corsConfig.methods ?? ""),
    HTTP_CORS_ALLOWED_HEADERS: JSON.stringify(corsConfig.allowedHeaders ?? ""),
    HTTP_CORS_EXPOSED_HEADERS: JSON.stringify(corsConfig.exposedHeaders ?? ""),
    HTTP_CORS_CREDENTIALS: corsConfig.credentials ?? false,
    HTTP_CORS_MAX_AGE: corsConfig.maxAge ?? 0,
  };
}

export type CorsVariables = ReturnType<typeof injectCorsVariables>;

export function injectOAuthVariables(userConfig: any) {
  const oauthConfig = getResolvedOAuthConfig(userConfig);

  return {
    OAUTH_CONFIG: JSON.stringify(oauthConfig),
  };
}

export type OAuthVariables = ReturnType<typeof injectOAuthVariables>;

export function injectPathsVariables(userConfig: any) {
  const pathsConfig = getResolvedPathsConfig(userConfig);

  return {
    TOOLS_PATH: JSON.stringify(pathsConfig.tools),
  };
}

export type PathsVariables = ReturnType<typeof injectPathsVariables>;

export type InjectedVariables =
  | HttpVariables
  | CorsVariables
  | OAuthVariables
  | PathsVariables;
