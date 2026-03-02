// GHL API v2 Types

export interface GHLConfig {
  apiKey: string;
  locationId: string;
  baseUrl: string;
  version: string;
}

export interface GHLContact {
  id: string;
  locationId: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  customFields?: GHLCustomFieldValue[];
  source?: string;
  dateAdded?: string;
  dateUpdated?: string;
}

export interface GHLCustomFieldValue {
  id: string;
  value: string | number | boolean | string[];
}

export interface GHLCustomField {
  id: string;
  name: string;
  fieldKey: string;
  dataType: string;
  placeholder?: string;
  position?: number;
}

export interface GHLPipeline {
  id: string;
  name: string;
  stages: GHLPipelineStage[];
  locationId: string;
}

export interface GHLPipelineStage {
  id: string;
  name: string;
  position: number;
}

export interface GHLOpportunity {
  id: string;
  name: string;
  monetaryValue?: number;
  pipelineId: string;
  pipelineStageId: string;
  status: string;
  contactId: string;
  locationId: string;
}

export interface GHLAppointment {
  id: string;
  calendarId: string;
  contactId: string;
  title?: string;
  status: string;
  startTime: string;
  endTime: string;
}

export interface GHLWorkflow {
  id: string;
  name: string;
  status: string;
  locationId: string;
}

export interface GHLConversation {
  id: string;
  contactId: string;
  locationId: string;
  type: string;
  lastMessageDate?: string;
}

export interface GHLWebhook {
  id?: string;
  url: string;
  events: string[];
  locationId?: string;
}

export interface GHLLocation {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  timezone?: string;
}

export interface GHLTag {
  id: string;
  name: string;
  locationId: string;
}

export interface GHLCustomValue {
  id: string;
  name: string;
  fieldKey: string;
  value: string;
  locationId: string;
}

export interface GHLCalendarSlot {
  startTime: string;
  endTime: string;
}

export interface GHLNote {
  id: string;
  body: string;
  contactId: string;
  dateAdded: string;
}

// API Response wrappers
export interface GHLListResponse<T> {
  [key: string]: T[] | number | string | undefined;
  meta?: any;
}

export interface GHLApiError {
  statusCode: number;
  message: string;
  error?: string;
}

// Tool input schemas
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface RequestOptions {
  method: HttpMethod;
  path: string;
  body?: Record<string, unknown>;
  query?: Record<string, string | number | boolean | undefined>;
  idempotencyKey?: string;
}
