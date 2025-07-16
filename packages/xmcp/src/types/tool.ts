// packages/xmcp/src/types/tool.ts
import { z } from "zod";

export interface ToolAnnotations {
  title?: string;
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint?: boolean;
  [key: string]: any;
}

export interface ToolMetadata {
  name: string;
  description: string;
  annotations?: ToolAnnotations;
}

export interface Tool {
  type: string;
  handler: (args: any) => any;
  metadata: ToolMetadata;
  schema: Record<string, z.ZodType>;
}

export type ToolSchema = Record<
  string,
  z.ZodType<unknown, z.ZodTypeDef, unknown>
>;

export type InferSchema<T extends ToolSchema> = {
  [K in keyof T]: z.infer<T[K]>;
};
