#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { contactTools, handleContactTool } from "./tools/contacts.js";
import { customFieldTools, handleCustomFieldTool } from "./tools/custom-fields.js";
import { customValueTools, handleCustomValueTool } from "./tools/custom-values.js";
import { locationTools, handleLocationTool } from "./tools/locations.js";
import { opportunityTools, handleOpportunityTool } from "./tools/opportunities.js";
import { calendarTools, handleCalendarTool } from "./tools/calendars.js";
import { workflowTools, handleWorkflowTool } from "./tools/workflows.js";
import { conversationTools, handleConversationTool } from "./tools/conversations.js";
import { webhookTools, handleWebhookTool } from "./tools/webhooks.js";

// All tools grouped by domain
const allTools = [
  ...contactTools,
  ...customFieldTools,
  ...customValueTools,
  ...locationTools,
  ...opportunityTools,
  ...calendarTools,
  ...workflowTools,
  ...conversationTools,
  ...webhookTools,
];

// Map tool names to their handlers
const toolHandlers: Record<
  string,
  (name: string, args: Record<string, unknown>) => Promise<unknown>
> = {};

for (const tool of contactTools) toolHandlers[tool.name] = handleContactTool;
for (const tool of customFieldTools) toolHandlers[tool.name] = handleCustomFieldTool;
for (const tool of customValueTools) toolHandlers[tool.name] = handleCustomValueTool;
for (const tool of locationTools) toolHandlers[tool.name] = handleLocationTool;
for (const tool of opportunityTools) toolHandlers[tool.name] = handleOpportunityTool;
for (const tool of calendarTools) toolHandlers[tool.name] = handleCalendarTool;
for (const tool of workflowTools) toolHandlers[tool.name] = handleWorkflowTool;
for (const tool of conversationTools) toolHandlers[tool.name] = handleConversationTool;
for (const tool of webhookTools) toolHandlers[tool.name] = handleWebhookTool;

// Create MCP server
const server = new Server(
  {
    name: "ghl-toolkit-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allTools,
}));

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const handler = toolHandlers[name];
  if (!handler) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Unknown tool: ${name}. Available tools: ${allTools.map((t) => t.name).join(", ")}`,
        },
      ],
      isError: true,
    };
  }

  try {
    const result = await handler(name, (args || {}) as Record<string, unknown>);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text" as const,
          text: `Error: ${message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GHL Toolkit MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
