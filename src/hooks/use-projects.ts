"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsService, Project } from "@/services/projects.service";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => projectsService.getAllProjects(),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; description?: string; url?: string }) =>
      projectsService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
