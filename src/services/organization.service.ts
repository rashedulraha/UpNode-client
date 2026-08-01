import api from "@/lib/api";
import { Member, InviteMemberPayload, MemberRole } from "@/types";

export interface UserOrganization {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  memberRole: MemberRole;
  _count: { members: number; projects: number };
}

export const organizationService = {
  async getMembers(): Promise<Member[]> {
    const response = await api.get<Member[]>("/organization/members");
    return response.data;
  },

  async inviteMember(data: InviteMemberPayload): Promise<Member> {
    const response = await api.post<Member>("/organization/members/invite", data);
    return response.data;
  },

  async updateMemberRole(memberId: string, role: MemberRole): Promise<Member> {
    const response = await api.patch<Member>(`/organization/members/${memberId}`, { role });
    return response.data;
  },

  async removeMember(memberId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/organization/members/${memberId}`);
    return response.data;
  },

  async createOrganization(name: string): Promise<{ id: string; name: string; slug: string }> {
    const response = await api.post<{ id: string; name: string; slug: string }>("/organization/create", { name });
    return response.data;
  },

  async getUserOrganizations(): Promise<UserOrganization[]> {
    const response = await api.get<UserOrganization[]>("/organization/my");
    return response.data;
  },
};
