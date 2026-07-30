"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { incidentsService } from "@/services/incidents.service";
import {
  GetIncidentsQuery,
  CreateIncidentInput,
  UpdateIncidentInput,
  Incident,
  PaginatedIncidents,
  IncidentStatus,
} from "@/types";

export function useIncidents(query?: GetIncidentsQuery) {
  return useQuery({
    queryKey: ["incidents", query],
    queryFn: () => incidentsService.getIncidents(query),
  });
}

export function useIncident(id: string | null) {
  return useQuery({
    queryKey: ["incidents", id],
    queryFn: () => (id ? incidentsService.getIncidentById(id) : null),
    enabled: !!id,
  });
}

export function useCreateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIncidentInput) => incidentsService.createIncident(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });
}

export function useUpdateIncidentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      expectedVersion,
    }: {
      id: string;
      status: IncidentStatus;
      expectedVersion: number;
    }) =>
      incidentsService.updateIncident(id, {
        status,
        expectedVersion,
      }),

    // Optimistic Update Implementation
    onMutate: async ({ id, status }) => {
      // Cancel any outgoing refetches to prevent overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["incidents", id] });
      await queryClient.cancelQueries({ queryKey: ["incidents"] });

      // Snapshot previous detail & list values
      const previousIncident = queryClient.getQueryData<Incident>(["incidents", id]);
      const previousPaginated = queryClient.getQueriesData<PaginatedIncidents>({
        queryKey: ["incidents"],
      });

      // Optimistically update detail cache
      if (previousIncident) {
        queryClient.setQueryData<Incident>(["incidents", id], {
          ...previousIncident,
          status,
          updatedAt: new Date().toISOString(),
        });
      }

      // Optimistically update list queries
      queryClient.setQueriesData<PaginatedIncidents>(
        { queryKey: ["incidents"] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: oldData.items.map((item) =>
              item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item
            ),
          };
        }
      );

      return { previousIncident, previousPaginated };
    },

    // On failure, rollback to snapshot
    onError: (err, variables, context) => {
      if (context?.previousIncident) {
        queryClient.setQueryData(["incidents", variables.id], context.previousIncident);
      }
      if (context?.previousPaginated) {
        context.previousPaginated.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    // On settled, refetch to guarantee accuracy
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["incidents", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });
}
