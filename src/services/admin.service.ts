import api from "@/lib/api";
import { AdminOrganization, AdminUser } from "@/types";

export const adminService = {
  async getAllOrganizations(): Promise<AdminOrganization[]> {
    const response = await api.get<AdminOrganization[]>("/admin/organizations");
    return response.data;
  },

  async getAllUsers(): Promise<AdminUser[]> {
    const response = await api.get<AdminUser[]>("/admin/users");
    return response.data;
  },

  async toggleBlockUser(userId: string, isBlocked: boolean): Promise<AdminUser> {
    const response = await api.patch<AdminUser>(`/admin/users/${userId}/block`, { isBlocked });
    return response.data;
  },

  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/admin/users/${userId}`);
    return response.data;
  },

  async deleteOrganization(organizationId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/admin/organizations/${organizationId}`);
    return response.data;
  },
};
