export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role?: string;
  isBlocked?: boolean;
  emailVerified: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date | string;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export type IncidentStatus =
  | "INVESTIGATING"
  | "IDENTIFIED"
  | "MONITORING"
  | "RESOLVED";
export type IncidentSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface TimelineEvent {
  id: string;
  incidentId: string;
  status: IncidentStatus;
  message: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  version: number;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  aiRootCause?: string | null;
  aiFixSuggestion?: string | null;
  project?: {
    id: string;
    name: string;
  };
  timelineEvents?: TimelineEvent[];
}

export interface GetIncidentsQuery {
  projectId?: string;
  status?: IncidentStatus;
  severity?: IncidentSeverity;
  limit?: number;
  offset?: number;
}

export interface PaginatedIncidents {
  items: Incident[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateIncidentInput {
  title: string;
  description: string;
  projectId: string;
  status?: IncidentStatus;
  severity?: IncidentSeverity;
}

export interface UpdateIncidentInput {
  title?: string;
  description?: string;
  status?: IncidentStatus;
  severity?: IncidentSeverity;
  expectedVersion: number;
}

export type SSEIncidentEvent = {
  type: "INCIDENT_CREATED" | "INCIDENT_UPDATED" | "INCIDENT_RESOLVED";
  organizationId: string;
  data: Incident;
};

export type MemberRole = "ADMIN" | "ENGINEER" | "VIEWER";

export interface Member {
  id: string;
  role: MemberRole;
  organizationId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    createdAt?: string;
  };
}

export interface InviteMemberPayload {
  email: string;
  role: MemberRole;
}

export interface PingMetric {
  id: string;
  projectId: string;
  url: string;
  statusCode: number | null;
  responseTimeMs: number;
  isUp: boolean;
  createdAt: string;
}

export type SystemStatusType =
  | "OPERATIONAL"
  | "DEGRADED_PERFORMANCE"
  | "PARTIAL_OUTAGE"
  | "MAJOR_OUTAGE";

export interface PublicProjectStatusData {
  project: {
    id: string;
    name: string;
    slug: string;
    url?: string | null;
  };
  systemStatus: SystemStatusType;
  uptimePercentage: number;
  avgLatencyMs: number;
  activeIncidents: Incident[];
  resolvedIncidents?: Incident[];
  past7DaysIncidents: Incident[];
  recentMetrics: PingMetric[];
  uptimeHistory90Days?: {
    date: string;
    isUp: boolean;
    uptimePercentage: number;
    avgLatencyMs: number;
    status: string;
  }[];
}

export interface AdminOrganization {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    members: number;
    projects: number;
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  members: {
    organization: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
}
