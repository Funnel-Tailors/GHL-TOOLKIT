import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ghlRequest, getLocationId } from "../client.js";

export const webhookTools: Tool[] = [
  {
    name: "webhook_create",
    description:
      "Register a new webhook to receive events from GHL (contact created, opportunity changed, appointment booked, etc.)",
    inputSchema: {
      type: "object" as const,
      properties: {
        url: {
          type: "string",
          description: "URL to receive webhook POST requests",
        },
        events: {
          type: "array",
          items: { type: "string" },
          description:
            "Events to listen for: ContactCreate, ContactUpdate, ContactDelete, ContactTagUpdate, OpportunityCreate, OpportunityStatusUpdate, OpportunityStageUpdate, AppointmentCreate, AppointmentUpdate, AppointmentDelete, TaskCreate, TaskComplete, InvoiceCreate, InvoiceUpdate, InvoicePaid",
        },
      },
      required: ["url", "events"],
    },
  },
  {
    name: "webhook_list",
    description: "List all registered webhooks for the current location.",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "webhook_delete",
    description: "Delete/unregister a webhook by its ID.",
    inputSchema: {
      type: "object" as const,
      properties: {
        webhookId: { type: "string", description: "The webhook ID to delete" },
      },
      required: ["webhookId"],
    },
  },
];

export async function handleWebhookTool(
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  const locationId = getLocationId();

  switch (name) {
    case "webhook_create":
      return ghlRequest({
        method: "POST",
        path: "/webhooks/",
        body: {
          url: args.url,
          events: args.events,
          locationId,
        },
      });

    case "webhook_list":
      return ghlRequest({
        method: "GET",
        path: "/webhooks/",
        query: { locationId },
      });

    case "webhook_delete":
      return ghlRequest({
        method: "DELETE",
        path: `/webhooks/${args.webhookId}`,
      });

    default:
      throw new Error(`Unknown webhook tool: ${name}`);
  }
}
