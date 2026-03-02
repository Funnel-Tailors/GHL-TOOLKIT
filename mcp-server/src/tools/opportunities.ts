import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ghlRequest, getLocationId } from "../client.js";

export const opportunityTools: Tool[] = [
  {
    name: "pipeline_list",
    description:
      "List all pipelines and their stages in the GHL location. Essential for understanding the sales process.",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "opportunity_create",
    description:
      "Create a new opportunity/deal in a pipeline for a contact. Assigns them to a specific stage.",
    inputSchema: {
      type: "object" as const,
      properties: {
        pipelineId: { type: "string", description: "Pipeline ID" },
        stageId: { type: "string", description: "Initial stage ID" },
        contactId: { type: "string", description: "Contact to associate" },
        name: { type: "string", description: "Opportunity name" },
        monetaryValue: {
          type: "number",
          description: "Deal value in cents",
        },
        status: {
          type: "string",
          description: "Status: open, won, lost, abandoned",
        },
      },
      required: ["pipelineId", "stageId", "contactId", "name"],
    },
  },
  {
    name: "opportunity_update",
    description: "Update an opportunity's fields (name, value, status).",
    inputSchema: {
      type: "object" as const,
      properties: {
        opportunityId: { type: "string", description: "The opportunity ID" },
        name: { type: "string" },
        monetaryValue: { type: "number" },
        status: { type: "string", description: "open, won, lost, abandoned" },
      },
      required: ["opportunityId"],
    },
  },
  {
    name: "opportunity_move_stage",
    description:
      "Move an opportunity to a different pipeline stage. Use this for qualification progression.",
    inputSchema: {
      type: "object" as const,
      properties: {
        opportunityId: { type: "string", description: "The opportunity ID" },
        pipelineId: { type: "string", description: "Pipeline ID" },
        stageId: {
          type: "string",
          description: "Target stage ID to move to",
        },
      },
      required: ["opportunityId", "pipelineId", "stageId"],
    },
  },
  {
    name: "opportunity_search",
    description: "Search opportunities by pipeline, stage, contact, or query.",
    inputSchema: {
      type: "object" as const,
      properties: {
        pipelineId: { type: "string", description: "Filter by pipeline" },
        stageId: { type: "string", description: "Filter by stage" },
        contactId: { type: "string", description: "Filter by contact" },
        query: { type: "string", description: "Search term" },
        status: { type: "string", description: "Filter by status" },
        limit: { type: "number", description: "Max results (default 20)" },
      },
      required: [],
    },
  },
];

export async function handleOpportunityTool(
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  const locationId = getLocationId();

  switch (name) {
    case "pipeline_list":
      return ghlRequest({
        method: "GET",
        path: "/opportunities/pipelines",
        query: { locationId },
      });

    case "opportunity_create":
      return ghlRequest({
        method: "POST",
        path: "/opportunities/",
        body: {
          pipelineId: args.pipelineId,
          pipelineStageId: args.stageId,
          contactId: args.contactId,
          name: args.name,
          monetaryValue: args.monetaryValue,
          status: args.status || "open",
          locationId,
        },
      });

    case "opportunity_update": {
      const { opportunityId, ...fields } = args;
      return ghlRequest({
        method: "PUT",
        path: `/opportunities/${opportunityId}`,
        body: fields as Record<string, unknown>,
      });
    }

    case "opportunity_move_stage":
      return ghlRequest({
        method: "PUT",
        path: `/opportunities/${args.opportunityId}`,
        body: {
          pipelineId: args.pipelineId,
          pipelineStageId: args.stageId,
        },
      });

    case "opportunity_search":
      return ghlRequest({
        method: "GET",
        path: "/opportunities/search",
        query: {
          location_id: locationId,
          pipeline_id: args.pipelineId as string,
          pipeline_stage_id: args.stageId as string,
          contact_id: args.contactId as string,
          q: args.query as string,
          status: args.status as string,
          limit: (args.limit as number) || 20,
        },
      });

    default:
      throw new Error(`Unknown opportunity tool: ${name}`);
  }
}
