import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ghlRequest, getLocationId } from "../client.js";

export const contactTools: Tool[] = [
  {
    name: "contacts_search",
    description:
      "Search contacts in GHL by query (name, email, phone). Returns matching contacts with their custom fields and tags.",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "Search term (name, email, or phone number)",
        },
        limit: {
          type: "number",
          description: "Max results to return (default 20, max 100)",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "contacts_create",
    description:
      "Create a new contact in GHL with name, email, phone, tags, and custom fields. Returns the created contact.",
    inputSchema: {
      type: "object" as const,
      properties: {
        firstName: { type: "string", description: "First name" },
        lastName: { type: "string", description: "Last name" },
        email: { type: "string", description: "Email address" },
        phone: { type: "string", description: "Phone number (with country code)" },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Tags to assign",
        },
        customFields: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              field_value: { type: "string" },
            },
          },
          description: "Custom field values [{id, field_value}]",
        },
        source: { type: "string", description: "Lead source identifier" },
      },
      required: [],
    },
  },
  {
    name: "contacts_get",
    description:
      "Get a single contact by ID with all their data: custom fields, tags, notes, etc.",
    inputSchema: {
      type: "object" as const,
      properties: {
        contactId: { type: "string", description: "The contact ID" },
      },
      required: ["contactId"],
    },
  },
  {
    name: "contacts_update",
    description:
      "Update a contact's fields (name, email, phone, tags, custom fields, etc.)",
    inputSchema: {
      type: "object" as const,
      properties: {
        contactId: { type: "string", description: "The contact ID to update" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Replace all tags with these",
        },
        customFields: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              field_value: { type: "string" },
            },
          },
          description: "Custom field values to update",
        },
      },
      required: ["contactId"],
    },
  },
  {
    name: "contacts_delete",
    description: "Delete a contact by ID. This is irreversible.",
    inputSchema: {
      type: "object" as const,
      properties: {
        contactId: { type: "string", description: "The contact ID to delete" },
      },
      required: ["contactId"],
    },
  },
  {
    name: "contacts_add_tags",
    description: "Add one or more tags to a contact without removing existing tags.",
    inputSchema: {
      type: "object" as const,
      properties: {
        contactId: { type: "string", description: "The contact ID" },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Tags to add",
        },
      },
      required: ["contactId", "tags"],
    },
  },
  {
    name: "contacts_remove_tags",
    description: "Remove specific tags from a contact.",
    inputSchema: {
      type: "object" as const,
      properties: {
        contactId: { type: "string", description: "The contact ID" },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Tags to remove",
        },
      },
      required: ["contactId", "tags"],
    },
  },
  {
    name: "contacts_add_note",
    description: "Add a note to a contact's record.",
    inputSchema: {
      type: "object" as const,
      properties: {
        contactId: { type: "string", description: "The contact ID" },
        body: { type: "string", description: "Note content" },
      },
      required: ["contactId", "body"],
    },
  },
];

export async function handleContactTool(
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  const locationId = getLocationId();

  switch (name) {
    case "contacts_search":
      return ghlRequest({
        method: "GET",
        path: "/contacts/",
        query: {
          locationId,
          query: args.query as string,
          limit: (args.limit as number) || 20,
        },
      });

    case "contacts_create":
      return ghlRequest({
        method: "POST",
        path: "/contacts/",
        body: {
          locationId,
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          phone: args.phone,
          tags: args.tags,
          customFields: args.customFields,
          source: args.source,
        },
      });

    case "contacts_get":
      return ghlRequest({
        method: "GET",
        path: `/contacts/${args.contactId}`,
      });

    case "contacts_update": {
      const { contactId, ...fields } = args;
      return ghlRequest({
        method: "PUT",
        path: `/contacts/${contactId}`,
        body: fields as Record<string, unknown>,
      });
    }

    case "contacts_delete":
      return ghlRequest({
        method: "DELETE",
        path: `/contacts/${args.contactId}`,
      });

    case "contacts_add_tags":
      return ghlRequest({
        method: "POST",
        path: `/contacts/${args.contactId}/tags`,
        body: { tags: args.tags },
      });

    case "contacts_remove_tags":
      return ghlRequest({
        method: "DELETE",
        path: `/contacts/${args.contactId}/tags`,
        body: { tags: args.tags },
      });

    case "contacts_add_note":
      return ghlRequest({
        method: "POST",
        path: `/contacts/${args.contactId}/notes`,
        body: { body: args.body, userId: locationId },
      });

    default:
      throw new Error(`Unknown contact tool: ${name}`);
  }
}
