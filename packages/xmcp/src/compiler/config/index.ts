import { z } from "zod";
import {
  DEFAULT_HTTP_BODY_SIZE_LIMIT,
  DEFAULT_HTTP_ENDPOINT,
  DEFAULT_HTTP_HOST,
  DEFAULT_HTTP_PORT,
  DEFAULT_TOOLS_DIR,
} from "./constants";

/**
 * Cors config schema
 */
const corsConfigSchema = z.object({
  origin: z.union([z.string(), z.array(z.string()), z.boolean()]).optional(),
  methods: z.union([z.string(), z.array(z.string())]).optional(),
  allowedHeaders: z.union([z.string(), z.array(z.string())]).optional(),
  exposedHeaders: z.union([z.string(), z.array(z.string())]).optional(),
  credentials: z.boolean().optional(),
  maxAge: z.number().optional(),
});

export type CorsConfig = z.infer<typeof corsConfigSchema>;

/**
 * Oauth endpoints schema
 */
const oauthEndpointsSchema = z.object({
  authorizationUrl: z.string(),
  tokenUrl: z.string(),
  revocationUrl: z.string().optional(),
  userInfoUrl: z.string().optional(),
  registerUrl: z.string(),
});

export type OauthEndpoints = z.infer<typeof oauthEndpointsSchema>;

/**
 * Oauth config schema
 */
const oauthConfigSchema = z.object({
  endpoints: oauthEndpointsSchema,
  issuerUrl: z.string(),
  baseUrl: z.string(),
  serviceDocumentationUrl: z.string().optional(),
  pathPrefix: z.string().default("/oauth2"),
  defaultScopes: z.array(z.string()).default(["openid", "profile", "email"]),
});

export type OauthConfig = z.infer<typeof oauthConfigSchema>;

/**
 * Adapter config schema
 */
const adapterConfigSchema = z.enum(["express", "nextjs"]);

export type AdapterConfig = z.infer<typeof adapterConfigSchema>;

/**
 * Experimental features schema
 */
const experimentalConfigSchema = z.object({
  oauth: oauthConfigSchema.optional(),
  adapter: adapterConfigSchema.optional(),
});

export type ExperimentalConfig = z.infer<typeof experimentalConfigSchema>;

/**
 * Paths config schema
 */
const pathsConfigSchema = z.object({
  tools: z.string().default(DEFAULT_TOOLS_DIR),
  // TO DO add resources prompts etc
});

export type PathsConfig = z.infer<typeof pathsConfigSchema>;

/**
 * xmcp Config schema
 */
export const configSchema = z.object({
  stdio: z.boolean().optional(),
  http: z
    .union([
      z.boolean(),
      z.object({
        port: z.number().default(DEFAULT_HTTP_PORT),
        host: z.string().default(DEFAULT_HTTP_HOST),
        bodySizeLimit: z.number().default(DEFAULT_HTTP_BODY_SIZE_LIMIT),
        debug: z.boolean().default(false),
        endpoint: z.string().default(DEFAULT_HTTP_ENDPOINT),
        cors: corsConfigSchema.optional(),
      }),
    ])
    .optional(),
  experimental: experimentalConfigSchema.optional(),
  paths: pathsConfigSchema.optional().default({
    tools: DEFAULT_TOOLS_DIR,
  }),
  webpack: z.function().args(z.any()).returns(z.any()).optional(),
});

export type ConfigSchema = z.infer<typeof configSchema>;

export type InputSchema = z.input<typeof configSchema>;
export type OutputSchema = z.output<typeof configSchema>;
