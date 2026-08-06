import api from "@/lib/api";

export interface ProjectIntegrationSetting {
	id: string;
	name: string;
	slug: string | null;
	slackWebhookUrl: string | null;
	alertEmail: string | null;
}

export interface OrganizationIntegrations {
	id: string;
	name: string;
	slackWebhookUrl: string | null;
	alertEmail: string | null;
	projects: ProjectIntegrationSetting[];
}

export const integrationsService = {
	async getIntegrations(): Promise<OrganizationIntegrations> {
		const response = await api.get<OrganizationIntegrations>(
			"/organization/integrations",
		);
		return response.data;
	},

	async updateIntegrations(data: {
		slackWebhookUrl?: string | null;
		alertEmail?: string | null;
		projects?: Array<{
			id: string;
			slackWebhookUrl?: string | null;
			alertEmail?: string | null;
		}>;
	}): Promise<OrganizationIntegrations> {
		const response = await api.put<OrganizationIntegrations>(
			"/organization/integrations",
			data,
		);
		return response.data;
	},
};
