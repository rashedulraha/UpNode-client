import api from "@/lib/api";

export interface PlatformStats {
	totalUsers: number;
	totalOrganizations: number;
	totalProjects: number;
	totalIncidents: number;
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
};
