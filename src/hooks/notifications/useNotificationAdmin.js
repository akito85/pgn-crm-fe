import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import notificationApi from "../../services/notificationApi";

export const notificationAdminKeys = {
  all: ["notificationAdmin"],
  templates: (filter) => ["notificationAdmin", "templates", filter],
  catalog: (module) => ["notificationAdmin", "catalog", module],
  resolvers: ["notificationAdmin", "resolvers"],
  events: ["notificationAdmin", "events"],
  categoryFields: (eventCode) => ["notificationAdmin", "categoryFields", eventCode],
  template: (id) => ["notificationAdmin", "template", id],
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
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Events ─────────────────────────────────────────────────────────────────

export function useEvents() {
  return useQuery({
    queryKey: notificationAdminKeys.events,
    queryFn: async () => {
      const data = await notificationApi.listEvents();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Category fields (per event) ────────────────────────────────────────────

export function useCategoryFields(eventCode) {
  return useQuery({
    queryKey: notificationAdminKeys.categoryFields(eventCode),
    queryFn: async () => {
      const data = await notificationApi.getCategoryFields(eventCode);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!eventCode,
    placeholderData: (prev) => prev,
  });
}

// ─── Single template (builder) ───────────────────────────────────────────────

export function useTemplate(id) {
  return useQuery({
    queryKey: notificationAdminKeys.template(id),
    queryFn: () => notificationApi.getTemplate(id),
    enabled: id != null,
  });
}

// ─── Template mutations ──────────────────────────────────────────────────────

export function useSaveTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (request) => notificationApi.saveTemplate(request),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationAdminKeys.all }),
  });
}

export function useValidateTemplate() {
  return useMutation({
    mutationFn: (request) => notificationApi.validateTemplate(request),
  });
}

export function usePreviewTemplate() {
  return useMutation({
    mutationFn: ({ id, entityId }) => notificationApi.previewTemplate(id, entityId ?? null),
  });
}
