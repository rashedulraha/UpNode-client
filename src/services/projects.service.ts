import api from "@/lib/api";

export interface Project {
  id: string;
  name: string;
  description?: string;
  url?: string;
  createdAt: string;
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

  async createProject(data: { name: string; description?: string; url?: string }): Promise<Project> {
    const response = await api.post<Project>("/projects", data);
    return response.data;
  },
};
