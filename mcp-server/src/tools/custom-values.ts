import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ghlRequest, getLocationId } from "../client.js";

export const customValueTools: Tool[] = [
  {
    name: "values_list",
    description: "List all custom values in the GHL location.",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "values_create",
    description: "Create a new custom value in the location.",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Name/key of the custom value" },
        value: { type: "string", description: "The value" },
      },
      required: ["name", "value"],
    },
  },
  {
    name: "values_update",
    description: "Update an existing custom value.",
    inputSchema: {
      type: "object" as const,
      properties: {
        valueId: { type: "string", description: "The custom value ID" },
        name: { type: "string", description: "New name" },
        value: { type: "string", description: "New value" },
      },
      required: ["valueId"],
    },
  },
];

export async function handleCustomValueTool(
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  const locationId = getLocationId();

  switch (name) {
    case "values_list":
      return ghlRequest({
        method: "GET",
        path: `/locations/${locationId}/customValues`,
      });

    case "values_create":
      return ghlRequest({
        method: "POST",
        path: `/locations/${locationId}/customValues`,
        body: { name: args.name, value: args.value },
      });

    case "values_update": {
      const { valueId, ...fields } = args;
      return ghlRequest({
        method: "PUT",
        path: `/locations/${locationId}/customValues/${valueId}`,
        body: fields as Record<string, unknown>,
      });
    }

    default:
      throw new Error(`Unknown custom value tool: ${name}`);
  }
}
