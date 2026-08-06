import api from "@/lib/api";
import {
	Incident,
	PaginatedIncidents,
	GetIncidentsQuery,
	CreateIncidentInput,
	UpdateIncidentInput,
} from "@/types";

export const incidentsService = {
	async getIncidents(query?: GetIncidentsQuery): Promise<PaginatedIncidents> {
		const response = await api.get<PaginatedIncidents>("/incidents", {
			params: query,
		});
		return response.data;
	},

	async getIncidentById(id: string): Promise<Incident> {
		const response = await api.get<Incident>(`/incidents/${id}`);
		return response.data;
	},

	async createIncident(data: CreateIncidentInput): Promise<Incident> {
		const response = await api.post<Incident>("/incidents", data);
		return response.data;
	},

	async updateIncident(
		id: string,
		data: UpdateIncidentInput,
	): Promise<Incident> {
		const response = await api.patch<Incident>(`/incidents/${id}`, data);
		return response.data;
	},
};
