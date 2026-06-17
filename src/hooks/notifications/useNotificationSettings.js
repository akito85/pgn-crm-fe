import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import notificationApi from "../../services/notificationApi";

export const notificationSettingsKeys = {
  all: ["notificationSettings"],
  user: ["notificationSettings", "user"],
  global: ["notificationSettings", "global"],
};

// ─── User settings ────────────────────────────────────────────────────────────

export function useNotificationUserSettings() {
  return useQuery({
    queryKey: notificationSettingsKeys.user,
    queryFn: async () => {
      const res = await notificationApi.getNotificationSettings();
      return res?.data ?? res ?? null;
    },
  });
}

export function useUpdateNotificationUserSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (settings) => notificationApi.updateNotificationSettings(settings),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationSettingsKeys.user }),
  });
}

// ─── Global settings ─────────────────────────────────────────────────────────

export function useGlobalNotificationSettings() {
  return useQuery({
    queryKey: notificationSettingsKeys.global,
    queryFn: async () => {
      const res = await notificationApi.getGlobalSettings();
      return res?.data ?? res ?? null;
    },
  });
}

export function useUpdateGlobalNotificationSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (settings) => notificationApi.updateGlobalSettings(settings),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationSettingsKeys.global }),
  });
}
