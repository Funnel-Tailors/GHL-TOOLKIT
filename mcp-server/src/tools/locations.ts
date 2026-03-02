import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ghlRequest, getLocationId } from "../client.js";

export const locationTools: Tool[] = [
  {
    name: "location_get",
    description:
      "Get detailed information about the current GHL location/sub-account (name, email, timezone, address, etc.)",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "location_tags",
    description: "List all tags available in the current GHL location.",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
];

export async function handleLocationTool(
  name: string,
  _args: Record<string, unknown>
): Promise<unknown> {
  const locationId = getLocationId();

  switch (name) {
    case "location_get":
      return ghlRequest({
        method: "GET",
        path: `/locations/${locationId}`,
      });

    case "location_tags":
      return ghlRequest({
        method: "GET",
        path: `/locations/${locationId}/tags`,
      });

    default:
      throw new Error(`Unknown location tool: ${name}`);
  }
}
