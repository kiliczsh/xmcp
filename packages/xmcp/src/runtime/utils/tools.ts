import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { ZodTypeAny } from "zod";
import { ToolFile } from "./server";
import { ToolMetadata } from "@/types/tool";

export type ZodRawShape = {
  [k: string]: ZodTypeAny;
};

/** Validates if a value is a valid Zod schema object */
function isZodRawShape(value: unknown): value is ZodRawShape {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;
  return Object.entries(obj).every(([key, val]) => {
    if (typeof key !== "string") return false;
    if (typeof val !== "object" || val === null) return false;
    if (!("parse" in val) || typeof val.parse !== "function") return false;
    return true;
  });
}

function pathToName(path: string): string {
  const fileName = path.split("/").pop() || path;
  return fileName.replace(/\.[^/.]+$/, "");
}

/** Loads tools and injects them into the server */
export function addToolsToServer(
  server: McpServer,
  toolModules: Map<string, ToolFile>
): McpServer {
  toolModules.forEach((toolModule, path) => {
    const defaultName = pathToName(path);

    const toolConfig: Required<ToolMetadata> = {
      name: defaultName,
      description: "No description provided",
      annotations: {},
    };
    let toolSchema: ZodRawShape = {};

    const { default: handler, metadata, schema } = toolModule;

    if (typeof metadata === "object" && metadata !== null) {
      Object.assign(toolConfig, metadata);
    }

    // Validate and ensure schema is properly typed
    if (isZodRawShape(schema)) {
      Object.assign(toolSchema, schema);
    } else if (schema !== undefined && schema !== null) {
      console.warn(
        `Invalid schema for tool "${toolConfig.name}" at ${path}. Expected Record<string, z.ZodType>`
      );
    }

    server.tool(
      toolConfig.name,
      toolConfig.description,
      toolSchema as any,
      toolConfig.annotations,
      handler
    );
  });

  return server;
}
