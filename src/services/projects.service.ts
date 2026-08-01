import api from "@/lib/api";

export interface Project {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  url?: string;
  createdAt: string;
  maintenanceMode: boolean;
  maintenanceStart?: string | null;
  maintenanceEnd?: string | null;
}

export interface CreateProjectInput {
  name: string;
  slug?: string;
  description?: string;
  url?: string;
}

export interface MaintenanceWindowInput {
  maintenanceMode?: boolean;
  maintenanceStart?: string | null;
  maintenanceEnd?: string | null;
}

export interface MaintenanceState {
  id: string;
  name: string;
  maintenanceMode: boolean;
  maintenanceStart: string | null;
  maintenanceEnd: string | null;
  isCurrentlyInMaintenance: boolean;
  isScheduledWindowActive: boolean;
}

export const projectsService = {
  async getAllProjects(): Promise<Project[]> {
    const response = await api.get<{ projects: Project[] } | Project[]>("/projects");
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return (response.data as any).projects || [];
  },

  async getProjectById(id: string): Promise<Project> {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  async createProject(data: CreateProjectInput): Promise<Project> {
    const response = await api.post<Project>("/projects", data);
    return response.data;
  },

  async getPublicStatus(slug: string) {
    const response = await api.get(`/projects/public/${slug}/status`);
    return response.data;
  },

  async subscribeToStatusUpdates(slug: string, email: string) {
    const response = await api.post(`/projects/public/${slug}/subscribe`, { email });
    return response.data;
  },

  async getMaintenanceState(projectId: string): Promise<MaintenanceState> {
    const response = await api.get<MaintenanceState>(`/projects/${projectId}/maintenance`);
    return response.data;
  },

  async updateMaintenanceWindow(
    projectId: string,
    payload: MaintenanceWindowInput
  ): Promise<{ success: boolean; project: MaintenanceState; message: string }> {
    const response = await api.patch(`/projects/${projectId}/maintenance`, payload);
    return response.data;
  },

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },

  async updateProject(id: string, data: Partial<CreateProjectInput>): Promise<Project> {
    const response = await api.patch<Project>(`/projects/${id}`, data);
    return response.data;
  },
};

