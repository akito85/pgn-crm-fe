import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { configApp } from "../../constants/configApp";
import { tokenHeader } from "../../utils/tokenHeader";

/**
 * TanStack Query hooks for Job Execution management.
 *
 * Replaces the Redux createAsyncThunk data layer (jobExecutionSlice) for the
 * execution list page: caching, request dedupe, refetch-on-mutation via cache
 * invalidation, and live polling driven by refetchInterval while any run is
 * non-terminal (instead of a hand-rolled setInterval).
 */

const EXEC_BASE = `${configApp.JOB_SERVICE}/v1/api/job/executions`;

const headers = () => tokenHeader();

const NON_TERMINAL = new Set(["PENDING", "SCHEDULED", "PROCESSING", "ON_HOLD", "SUSPENDED"]);

export const executionKeys = {
  all: ["jobExecutions"],
  list: (params) => ["jobExecutions", "list", params],
  detail: (id) => ["jobExecutions", "detail", id],
  logs: (id) => ["jobExecutions", "logs", id],
};

// ─── List (with live polling while runs are active) ───────────────────────────

export function useExecutionsList({ search = "", page = 1, pageSize = 30, sort = "", pollMs = 5000 } = {}) {
  return useQuery({
    queryKey: executionKeys.list({ search, page, pageSize, sort }),
    queryFn: async () => {
      const url = `${EXEC_BASE}/search?page=${page - 1}&size=${pageSize}`;
      const res = await axios.post(url, { search, sort }, { headers: headers() });
      return res?.data ?? { content: [], totalElements: 0, totalPages: 0 };
    },
    placeholderData: (prev) => prev,
    // Poll only while a returned row is still in a non-terminal state.
    refetchInterval: (query) => {
      const rows = query?.state?.data?.content ?? [];
      const anyRunning = rows.some((r) => r && NON_TERMINAL.has(r.status));
      return anyRunning ? pollMs : false;
    },
  });
}

// ─── Global status statistics ────────────────────────────────────────────────

export function useExecutionStats({ pollMs = 10000 } = {}) {
  return useQuery({
    queryKey: ["jobStats", "executions"],
    queryFn: async () => {
      const res = await axios.get(`${EXEC_BASE}/stats`, { headers: headers() });
      return res?.data ?? {};
    },
    refetchInterval: pollMs,
  });
}

// ─── Detail & Logs ────────────────────────────────────────────────────────────

export function useExecutionDetail(executionId) {
  return useQuery({
    queryKey: executionKeys.detail(executionId),
    queryFn: async () => {
      const res = await axios.get(`${EXEC_BASE}/${executionId}`, { headers: headers() });
      return res?.data ?? null;
    },
    enabled: executionId !== null && executionId !== undefined,
  });
}

export function useExecutionLogs(executionId, enabled = false) {
  return useQuery({
    queryKey: executionKeys.logs(executionId),
    queryFn: async () => {
      try {
        const res = await axios.get(`${EXEC_BASE}/${executionId}/logs`, { headers: headers() });
        return res?.data ?? [];
      } catch {
        // Logs are optional — return empty if the endpoint is unavailable.
        return [];
      }
    },
    enabled: enabled && executionId !== null && executionId !== undefined,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useStartExecution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => axios.post(EXEC_BASE, body, { headers: headers() }).then((r) => r?.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: executionKeys.all }),
  });
}

function useExecutionAction(action) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (executionId) =>
      axios.post(`${EXEC_BASE}/${executionId}/${action}`, {}, { headers: headers() }).then((r) => r?.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: executionKeys.all }),
  });
}

export const useStopExecution    = () => useExecutionAction("stop");
export const useCancelExecution  = () => useExecutionAction("cancel");
export const useHoldExecution    = () => useExecutionAction("hold");
export const useSuspendExecution = () => useExecutionAction("suspend");
export const useRestartExecution = () => useExecutionAction("restart");
