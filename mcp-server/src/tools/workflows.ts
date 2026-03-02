import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ghlRequest, getLocationId } from "../client.js";

export const workflowTools: Tool[] = [
  {
    name: "workflow_list",
    description:
      "List all workflows in the GHL location with their status (active/draft/inactive).",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "workflow_trigger",
    description:
      "Trigger a workflow via its inbound webhook URL. Use this to start automations programmatically for a contact.",
    inputSchema: {
      type: "object" as const,
      properties: {
        webhookUrl: {
          type: "string",
          description:
            "The workflow's inbound webhook URL (found in workflow trigger settings)",
        },
        contactId: {
          type: "string",
          description: "Contact ID to run the workflow for",
        },
        data: {
          type: "object",
          description: "Additional data to pass to the workflow",
        },
      },
      required: ["webhookUrl"],
    },
  },
];

export async function handleWorkflowTool(
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  const locationId = getLocationId();

  switch (name) {
    case "workflow_list":
      return ghlRequest({
        method: "GET",
        path: "/workflows/",
        query: { locationId },
      });

    case "workflow_trigger": {
      // Workflow triggers use a direct webhook URL, not the standard API
      const response = await fetch(args.webhookUrl as string, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact_id: args.contactId,
          location_id: locationId,
          ...(args.data as Record<string, unknown>),
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Workflow trigger failed (${response.status}): ${errorBody}`
        );
      }

      return { success: true, status: response.status };
    }

    default:
      throw new Error(`Unknown workflow tool: ${name}`);
  }
}
