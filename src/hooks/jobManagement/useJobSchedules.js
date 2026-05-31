import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { configApp } from "../../constants/configApp";
import { tokenHeader } from "../../utils/tokenHeader";

/**
 * TanStack Query hooks for Job Scheduler Management.
 *
 * Replaces the Redux createAsyncThunk data layer (jobScheduleSlice) for the
 * scheduler pages: caching, request dedupe, and automatic refetch on mutation
 * via query invalidation. Schedule stop actions (pause/delete) carry the
 * backend cancelInFlight flag so the UI can optionally cascade-cancel the
 * in-flight runs a schedule already spawned.
 */

const MONITOR_BASE = `${configApp.JOB_SERVICE}/v1/api/job/monitor/schedules`;
const DEFINITION_BASE = `${configApp.JOB_SERVICE}/v1/api/job/definitions/schedules`;

const headers = () => tokenHeader();

export const scheduleKeys = {
  all: ["jobSchedules"],
  list: (params) => ["jobSchedules", "list", params],
  detail: (id) => ["jobSchedules", "detail", id],
};

// ─── List ───────────────────────────────────────────────────────────────────

export function useSchedulesList({ page = 1, pageSize = 20, status, isPaused, scheduleType } = {}) {
  return useQuery({
    queryKey: scheduleKeys.list({ page, pageSize, status, isPaused, scheduleType }),
    queryFn: async () => {
      const p = new URLSearchParams();
      if (status !== null && status !== undefined) p.append("status", status);
      if (isPaused !== null && isPaused !== undefined) p.append("isPaused", isPaused);
      if (scheduleType !== null && scheduleType !== undefined) p.append("scheduleType", scheduleType);
      p.append("page", page - 1);
      p.append("size", pageSize);
      const res = await axios.get(`${MONITOR_BASE}?${p.toString()}`, { headers: headers() });
      return res?.data ?? { content: [], totalElements: 0, totalPages: 0 };
    },
    // v5: keep the previous page's data visible while the next page loads
    placeholderData: (prev) => prev,
  });
}

// ─── Detail ───────────────────────────────────────────────────────────────────

export function useScheduleDetail(scheduleId) {
  return useQuery({
    queryKey: scheduleKeys.detail(scheduleId),
    queryFn: async () => {
      const res = await axios.get(`${MONITOR_BASE}/${scheduleId}`, { headers: headers() });
      return res?.data ?? null;
    },
    enabled: scheduleId !== null && scheduleId !== undefined,
  });
}

// ─── Mutations ──────────────────────────────────────────────────────────────

export function useActivateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (scheduleId) =>
      axios
        .post(`${DEFINITION_BASE}/${scheduleId}/activate`, {}, { headers: headers() })
        .then((r) => r?.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: scheduleKeys.all }),
  });
}

export function usePauseSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ scheduleId, cancelInFlight = false }) =>
      axios
        .post(
          `${DEFINITION_BASE}/${scheduleId}/pause?cancelInFlight=${cancelInFlight}`,
          {},
          { headers: headers() }
        )
        .then((r) => r?.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: scheduleKeys.all }),
  });
}

export function useDeleteSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ scheduleId, cancelInFlight = false }) =>
      axios
        .delete(`${DEFINITION_BASE}/${scheduleId}?cancelInFlight=${cancelInFlight}`, {
          headers: headers(),
        })
        .then((r) => r?.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: scheduleKeys.all }),
  });
}

export function useUpdateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ scheduleId, payload, cancelInFlight = false }) =>
      axios
        .put(`${DEFINITION_BASE}/${scheduleId}?cancelInFlight=${cancelInFlight}`, payload, {
          headers: headers(),
        })
        .then((r) => r?.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: scheduleKeys.all });
      qc.invalidateQueries({ queryKey: ["jobExecutions"] });
      qc.invalidateQueries({ queryKey: ["jobStats"] });
    },
  });
}

export function useScheduleStats(scheduleId) {
  return useQuery({
    queryKey: ["jobStats", "schedule", scheduleId],
    queryFn: async () => {
      const res = await axios.get(`${MONITOR_BASE}/${scheduleId}/stats`, { headers: headers() });
      return res?.data ?? {};
    },
    enabled: scheduleId !== null && scheduleId !== undefined,
  });
}
