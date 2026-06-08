import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { configApp } from "../../../constants/configApp";
import { showModalError, validateError } from "../general_slice";
import { notificationTokenHeader } from "../../../utils/notificationTokenHeader";
import axios from "axios";
import NxDate from "../../../components/Nx/NxDatePicker";

export const tasklistSlice = createApi({
  reducerPath: "tasklistSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: configApp.NOTIFICATION_SERVICE,
  }),
  tagTypes: ["Tasklist", "TasklistCount"],
  endpoints: (builder) => ({
    getTasklistPagination: builder.query({
      queryFn: async (
        {
          page = 0,
          size = 20,
          sort = "createdAt~desc",
          filters = {},
          search = {},
        },
        api
      ) => {
        try {
          // Parse sort parameter (format: "field~order")
          const [sortBy = "createdAt", sortOrderLower = "desc"] = sort.split("~");
          const sortOrder = sortOrderLower.toUpperCase();

          // Get userId from token
          const token = JSON.parse(
            localStorage.getItem("token") || sessionStorage.getItem("token") || "{}"
          );
          const userId = token?.userId || token?.id || token?.username;

          if (!userId) {
            throw new Error("User ID not found in token");
          }

          const params = new URLSearchParams({
            userId,        // Add userId to query params
            page,
            size,
            sortBy,
            sortOrder,
          });

          // Task status: column search overrides widget-level default filter
          if (search.taskStatus) {
            params.append("taskStatus", search.taskStatus);
            // Include completed/expired if user explicitly selects those statuses
            if (search.taskStatus === "COMPLETED") {
              params.append("includeCompleted", "true");
            }
            if (search.taskStatus === "EXPIRED") {
              params.append("includeExpired", "true");
            }
          } else if (filters.status) {
            params.append("taskStatus", filters.status);
          }

          // Full-text search on task subject
          if (search.taskSubject) {
            params.append("search", search.taskSubject);
          }

          // Priority filter (exact match via min/max range)
          if (search.priority) {
            params.append("minPriority", search.priority);
            params.append("maxPriority", search.priority);
          }

          // Sender filter
          if (search.taskSender) {
            params.append("taskSender", search.taskSender);
          }

          // Created date filter — convert display format to backend ISO format
          // DatePicker sends "DD MMM YYYY HH:mm:ss", backend expects "yyyy-MM-dd'T'HH:mm:ss"
          if (search.createdAt) {
            const parsed = new Date(search.createdAt);
            if (!isNaN(parsed.getTime())) {
              // Start of day
              const startOfDay = new Date(parsed);
              startOfDay.setHours(0, 0, 0, 0);
              // End of day
              const endOfDay = new Date(parsed);
              endOfDay.setHours(23, 59, 59, 999);
              // NxDate.formatForAPI returns "YYYY-MM-DD HH:mm:ss", replace space with T for backend
              const fromStr = NxDate.formatForAPI(startOfDay, true);
              const toStr = NxDate.formatForAPI(endOfDay, true);
              if (fromStr) params.append("createdFrom", fromStr.replace(" ", "T"));
              if (toStr) params.append("createdTo", toStr.replace(" ", "T"));
            }
          }

          const url = `${configApp.NOTIFICATION_SERVICE}/v1/api/tasklist?${params.toString()}`;
          const headers = notificationTokenHeader();
          const config = { headers, withCredentials: true };

          // console.log('[TasklistSlice] Request URL:', url);
          // console.log('[TasklistSlice] Headers:', headers);
          // console.log('[TasklistSlice] UserId:', userId);

          const result = await axios.get(url, config);
          // console.log('[TasklistSlice] Success response:', result.data);
          return { data: result.data };
        } catch (error) {
          console.error('[TasklistSlice] Error details:', {
            status: error?.response?.status,
            statusText: error?.response?.statusText,
            data: error?.response?.data,
            message: error?.message,
            config: error?.config
          });

          const errorBody = {
            action: "getTasklistPagination",
            title: "Failed to load tasklist",
            description:
              error?.response?.data?.message || error?.message || "Please try again.",
            code: error?.response?.status,
            back: false,
          };
          api.dispatch(showModalError(errorBody));
          return {
            error: {
              status: error?.response?.status,
              data: error?.response?.data,
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.TASKS.map(({ TASK_ID }) => ({
                type: "Tasklist",
                id: TASK_ID,
              })),
              { type: "Tasklist", id: "LIST" },
            ]
          : [{ type: "Tasklist", id: "LIST" }],
    }),

    getTasklistDetail: builder.query({
      queryFn: async ({ taskId }, api) => {
        try {
          const url = `${configApp.NOTIFICATION_SERVICE}/v1/api/tasklist/${taskId}`;
          const headers = notificationTokenHeader();
          const config = { headers, withCredentials: true };

          const result = await axios.get(url, config);
          return { data: result.data };
        } catch (error) {
          const errorBody = {
            action: "getTasklistDetail",
            title: "Failed to load task detail",
            description:
              error?.response?.data?.message + ". Please try again.",
            code: error?.response?.status,
            back: false,
          };
          api.dispatch(showModalError(errorBody));
          return {
            error: {
              status: error?.response?.status,
              data: error?.response?.data,
            },
          };
        }
      },
      providesTags: (result, error, { taskId }) => [
        { type: "Tasklist", id: taskId },
      ],
    }),

    getTasklistCounts: builder.query({
      queryFn: async ({ userId, positionId }, api) => {
        try {
          const params = new URLSearchParams();
          if (userId) params.append("userId", userId);
          if (positionId) params.append("positionId", positionId);

          const url = `${configApp.NOTIFICATION_SERVICE}/v1/api/tasklist/count?${params.toString()}`;
          const headers = notificationTokenHeader();
          const config = { headers, withCredentials: true };

          const result = await axios.get(url, config);
          return { data: result.data };
        } catch (error) {
          const errorBody = {
            action: "getTasklistCounts",
            title: "Failed to load task counts",
            description:
              error?.response?.data?.message + ". Please try again.",
            code: error?.response?.status,
            back: false,
          };
          api.dispatch(showModalError(errorBody));
          return {
            error: {
              status: error?.response?.status,
              data: error?.response?.data,
            },
          };
        }
      },
      providesTags: [{ type: "TasklistCount", id: "COUNT" }],
    }),

    performTaskAction: builder.mutation({
      queryFn: async ({ taskId, action, remarks, actionBy }, api) => {
        try {
          const url = `${configApp.NOTIFICATION_SERVICE}/v1/api/tasklist/${taskId}/action`;
          const headers = notificationTokenHeader();
          const config = { headers, withCredentials: true };

          const body = {
            ACTION: action,
            REMARKS: remarks,
            ACTION_BY: actionBy,
          };

          const result = await axios.post(url, body, config);
          return { data: result.data };
        } catch (error) {
          const errorBody = {
            action: "performTaskAction",
            title: "Failed to perform task action",
            description:
              error?.response?.data?.message + ". Please try again.",
            code: error?.response?.status,
            back: false,
          };
          api.dispatch(showModalError(errorBody));
          return {
            error: {
              status: error?.response?.status,
              data: error?.response?.data,
            },
          };
        }
      },
      invalidatesTags: [
        { type: "Tasklist", id: "LIST" },
        { type: "TasklistCount", id: "COUNT" },
      ],
    }),

    performBatchTaskAction: builder.mutation({
      queryFn: async ({ taskIds, action, remarks, actionBy }, api) => {
        try {
          const url = `${configApp.NOTIFICATION_SERVICE}/v1/api/tasklist/batch/action`;
          const headers = notificationTokenHeader();
          const config = { headers, withCredentials: true };

          const body = {
            TASK_IDS: taskIds,
            ACTION: action,
            REMARKS: remarks,
            ACTION_BY: actionBy,
          };

          const result = await axios.post(url, body, config);
          return { data: result.data };
        } catch (error) {
          const errorBody = {
            action: "performBatchTaskAction",
            title: "Failed to perform batch action",
            description:
              error?.response?.data?.message + ". Please try again.",
            code: error?.response?.status,
            back: false,
          };
          api.dispatch(showModalError(errorBody));
          return {
            error: {
              status: error?.response?.status,
              data: error?.response?.data,
            },
          };
        }
      },
      invalidatesTags: [
        { type: "Tasklist", id: "LIST" },
        { type: "TasklistCount", id: "COUNT" },
      ],
    }),
  }),
});

export const {
  useGetTasklistPaginationQuery,
  useGetTasklistDetailQuery,
  useGetTasklistCountsQuery,
  usePerformTaskActionMutation,
  usePerformBatchTaskActionMutation,
} = tasklistSlice;
