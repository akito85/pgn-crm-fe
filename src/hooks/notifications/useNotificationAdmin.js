import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import notificationApi from "../../services/notificationApi";

/**
 * TanStack Query hooks for the Notification admin console (templates + field
 * catalogue).
 *
 * Replaces the Redux createAsyncThunk data layer (notificationAdmin slice) for
 * the list screens: caching, request dedupe, and automatic refetch on mutation
 * via query invalidation — mirroring the Job Scheduler hooks
 * (hooks/jobManagement/useJobSchedules). The thunks remain in place for the
 * template builder; only the list screens read through these hooks.
 *
 * All requests go through notificationApi, which already attaches the
 * notification auth header.
 */

export const notificationAdminKeys = {
  all: ["notificationAdmin"],
  templates: (filter) => ["notificationAdmin", "templates", filter],
  catalog: (module) => ["notificationAdmin", "catalog", module],
  resolvers: ["notificationAdmin", "resolvers"],
};

// ─── Templates ────────────────────────────────────────────────────────────────

export function useTemplates(filter = {}) {
  // strip null/empty keys so the BE @RequestParam stays optional
  const params = Object.fromEntries(
    Object.entries(filter).filter(([, v]) => v !== null && v !== undefined && v !== "")
  );
  return useQuery({
    queryKey: notificationAdminKeys.templates(params),
    queryFn: async () => {
      const data = await notificationApi.listTemplates(params);
      return Array.isArray(data) ? data : [];
    },
    placeholderData: (prev) => prev,
  });
}

export function useSetTemplateActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }) => notificationApi.setTemplateActive(id, active),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationAdminKeys.all }),
  });
}

// ─── Field catalogue ────────────────────────────────────────────────────────

export function useCatalogFields(module = null) {
  return useQuery({
    queryKey: notificationAdminKeys.catalog(module),
    queryFn: async () => {
      const data = await notificationApi.listCatalogFields(module);
      return Array.isArray(data) ? data : [];
    },
    placeholderData: (prev) => prev,
  });
}

export function useSaveCatalogField() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (field) => notificationApi.saveCatalogField(field),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationAdminKeys.all }),
  });
}

// ─── Resolvers (guided register form) ───────────────────────────────────────

export function useResolvers() {
  return useQuery({
    queryKey: notificationAdminKeys.resolvers,
    queryFn: async () => {
      const data = await notificationApi.listResolvers();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 5 * 60 * 1000, // whitelist changes rarely; cache for 5 min
  });
}
