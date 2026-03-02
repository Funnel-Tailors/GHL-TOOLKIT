import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ghlRequest, getLocationId } from "../client.js";

export const conversationTools: Tool[] = [
  {
    name: "conversation_send_sms",
    description: "Send an SMS message to a contact.",
    inputSchema: {
      type: "object" as const,
      properties: {
        contactId: { type: "string", description: "The contact ID to message" },
        message: { type: "string", description: "SMS message text" },
      },
      required: ["contactId", "message"],
    },
  },
  {
    name: "conversation_send_email",
    description: "Send an email to a contact.",
    inputSchema: {
      type: "object" as const,
      properties: {
        contactId: { type: "string", description: "The contact ID to email" },
        subject: { type: "string", description: "Email subject line" },
        body: {
          type: "string",
          description: "Email body (HTML supported)",
        },
        emailFrom: {
          type: "string",
          description: "Sender email (must be verified in GHL)",
        },
      },
      required: ["contactId", "subject", "body"],
    },
  },
  {
    name: "conversation_list",
    description: "List conversations for a contact or the entire location.",
    inputSchema: {
      type: "object" as const,
      properties: {
        contactId: {
          type: "string",
          description: "Filter by contact ID (optional)",
        },
        limit: {
          type: "number",
          description: "Max results (default 20)",
        },
      },
      required: [],
    },
  },
];

export async function handleConversationTool(
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  const locationId = getLocationId();

  switch (name) {
    case "conversation_send_sms":
      return ghlRequest({
        method: "POST",
        path: "/conversations/messages",
        body: {
          type: "SMS",
          contactId: args.contactId,
          message: args.message,
          locationId,
        },
      });

    case "conversation_send_email":
      return ghlRequest({
        method: "POST",
        path: "/conversations/messages",
        body: {
          type: "Email",
          contactId: args.contactId,
          subject: args.subject,
          body: args.body,
          emailFrom: args.emailFrom,
          locationId,
        },
      });

    case "conversation_list":
      return ghlRequest({
        method: "GET",
        path: "/conversations/",
        query: {
          locationId,
          contactId: args.contactId as string,
          limit: (args.limit as number) || 20,
        },
      });

    default:
      throw new Error(`Unknown conversation tool: ${name}`);
  }
}
