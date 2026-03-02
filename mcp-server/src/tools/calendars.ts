import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ghlRequest, getLocationId } from "../client.js";

export const calendarTools: Tool[] = [
  {
    name: "calendar_list_slots",
    description:
      "Get available time slots for a calendar within a date range. Use this to find open booking times.",
    inputSchema: {
      type: "object" as const,
      properties: {
        calendarId: { type: "string", description: "The calendar ID" },
        startDate: {
          type: "string",
          description: "Start date in epoch ms or ISO 8601",
        },
        endDate: {
          type: "string",
          description: "End date in epoch ms or ISO 8601",
        },
        timezone: {
          type: "string",
          description: "Timezone (e.g. Europe/Madrid). Defaults to location timezone.",
        },
      },
      required: ["calendarId", "startDate", "endDate"],
    },
  },
  {
    name: "calendar_book",
    description:
      "Book an appointment for a contact on a specific calendar slot.",
    inputSchema: {
      type: "object" as const,
      properties: {
        calendarId: { type: "string", description: "The calendar ID" },
        contactId: { type: "string", description: "The contact to book for" },
        startTime: {
          type: "string",
          description: "Appointment start time (ISO 8601)",
        },
        endTime: {
          type: "string",
          description: "Appointment end time (ISO 8601)",
        },
        title: { type: "string", description: "Appointment title" },
        notes: { type: "string", description: "Additional notes" },
      },
      required: ["calendarId", "contactId", "startTime", "endTime"],
    },
  },
  {
    name: "calendar_cancel",
    description: "Cancel an existing appointment by event ID.",
    inputSchema: {
      type: "object" as const,
      properties: {
        eventId: { type: "string", description: "The calendar event ID to cancel" },
      },
      required: ["eventId"],
    },
  },
  {
    name: "calendar_get_appointment",
    description: "Get details of a specific appointment/event.",
    inputSchema: {
      type: "object" as const,
      properties: {
        eventId: { type: "string", description: "The calendar event ID" },
      },
      required: ["eventId"],
    },
  },
];

export async function handleCalendarTool(
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  const locationId = getLocationId();

  switch (name) {
    case "calendar_list_slots":
      return ghlRequest({
        method: "GET",
        path: `/calendars/${args.calendarId}/free-slots`,
        query: {
          startDate: args.startDate as string,
          endDate: args.endDate as string,
          timezone: args.timezone as string,
        },
      });

    case "calendar_book":
      return ghlRequest({
        method: "POST",
        path: "/calendars/events/appointments",
        body: {
          calendarId: args.calendarId,
          locationId,
          contactId: args.contactId,
          startTime: args.startTime,
          endTime: args.endTime,
          title: args.title || "Appointment",
          appointmentStatus: "confirmed",
          notes: args.notes,
        },
      });

    case "calendar_cancel":
      return ghlRequest({
        method: "DELETE",
        path: `/calendars/events/appointments/${args.eventId}`,
      });

    case "calendar_get_appointment":
      return ghlRequest({
        method: "GET",
        path: `/calendars/events/appointments/${args.eventId}`,
      });

    default:
      throw new Error(`Unknown calendar tool: ${name}`);
  }
}
