import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ghlRequest, getLocationId } from "../client.js";

export const customFieldTools: Tool[] = [
  {
    name: "fields_list",
    description:
      "List all custom fields configured in the GHL location. Returns field names, keys, data types, and IDs.",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "fields_create",
    description:
      "Create a new custom field in the GHL location. Used to add fields like lead_score, qualification_status, etc.",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Display name of the field" },
        dataType: {
          type: "string",
          description:
            'Field type: TEXT, LARGE_TEXT, NUMERICAL, PHONE, MONETORY, CHECKBOX, SINGLE_OPTIONS, MULTIPLE_OPTIONS, FLOAT, DATE, TEXTBOX_LIST, FILE_UPLOAD, SIGNATURE',
        },
        placeholder: { type: "string", description: "Placeholder text" },
        options: {
          type: "array",
          items: { type: "string" },
          description: "Options for SINGLE_OPTIONS or MULTIPLE_OPTIONS type",
        },
        position: {
          type: "number",
          description: "Position/order of the field",
        },
      },
      required: ["name", "dataType"],
    },
  },
  {
    name: "fields_update",
    description: "Update an existing custom field's name, placeholder, or options.",
    inputSchema: {
      type: "object" as const,
      properties: {
        fieldId: { type: "string", description: "The custom field ID" },
        name: { type: "string", description: "New display name" },
        placeholder: { type: "string" },
        options: {
          type: "array",
          items: { type: "string" },
          description: "New options for select fields",
        },
      },
      required: ["fieldId"],
    },
  },
  {
    name: "fields_delete",
    description: "Delete a custom field from the location. This is irreversible.",
    inputSchema: {
      type: "object" as const,
      properties: {
        fieldId: { type: "string", description: "The custom field ID to delete" },
      },
      required: ["fieldId"],
    },
  },
];

export async function handleCustomFieldTool(
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  const locationId = getLocationId();

  switch (name) {
    case "fields_list":
      return ghlRequest({
        method: "GET",
        path: `/locations/${locationId}/customFields`,
      });

    case "fields_create":
      return ghlRequest({
        method: "POST",
        path: `/locations/${locationId}/customFields`,
        body: {
          name: args.name,
          dataType: args.dataType,
          placeholder: args.placeholder,
          options: args.options,
          position: args.position,
        },
      });

    case "fields_update": {
      const { fieldId, ...fields } = args;
      return ghlRequest({
        method: "PUT",
        path: `/locations/${locationId}/customFields/${fieldId}`,
        body: fields as Record<string, unknown>,
      });
    }

    case "fields_delete":
      return ghlRequest({
        method: "DELETE",
        path: `/locations/${locationId}/customFields/${args.fieldId}`,
      });

    default:
      throw new Error(`Unknown custom field tool: ${name}`);
  }
}
