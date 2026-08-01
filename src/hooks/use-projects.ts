"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsService, Project, CreateProjectInput } from "@/services/projects.service";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => projectsService.getAllProjects(),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectInput) =>
      projectsService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
