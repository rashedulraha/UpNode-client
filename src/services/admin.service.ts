import api from "@/lib/api";

export interface PlatformStats {
	totalUsers: number;
	totalOrganizations: number;
	totalAdmins: number;
	totalProjects: number;
	activeProjects: number;
	totalIncidents: number;
	paidSubscribers: number;
	monthlyRevenue: number;
	systemStatus: string;
	timestamp: string;
}

export interface PlatformUser {
	id: string;
	name: string;
	email: string;
	role: string;
	isBlocked: boolean;
	emailVerified: boolean;
	createdAt: string;
	_count: {
		members: number;
	};
}

export interface PlatformOrganization {
	id: string;
	name: string;
	slug: string;
	isSuspended: boolean;
	createdAt: string;
	adminName: string;
	adminEmail: string;
	plan: "FREE" | "PRO";
	membersCount: number;
	projectsCount: number;
}

export const adminService = {
	async getStats(): Promise<PlatformStats> {
		const response = await api.get<PlatformStats>("/super-admin/stats");
		return response.data;
	},

	async getUsers(): Promise<PlatformUser[]> {
		const response = await api.get<PlatformUser[]>("/super-admin/users");
		return response.data;
	},

	async toggleUserBlock(
		userId: string,
	): Promise<{ message: string; user: PlatformUser }> {
		const response = await api.post<{ message: string; user: PlatformUser }>(
			`/super-admin/users/${userId}/toggle-block`,
		);
		return response.data;
	},

	async getOrganizations(): Promise<PlatformOrganization[]> {
		const response = await api.get<PlatformOrganization[]>(
			"/super-admin/organizations",
		);
		return response.data;
	},

	async toggleOrganizationSuspend(
		orgId: string,
	): Promise<{ message: string; organization: PlatformOrganization }> {
		const response = await api.post<{
			message: string;
			organization: PlatformOrganization;
		}>(`/super-admin/organizations/${orgId}/toggle-suspend`);
		return response.data;
	},
};
