import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { configApp } from "../../../constants/configApp";
import { showModalError, validateError } from "../general_slice";
import { notificationTokenHeader } from "../../../utils/notificationTokenHeader";
import axios from "axios";

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
          const params = new URLSearchParams({
            page,
            size,
            sort,
          });

          // Add filters
          if (filters.status) {
            params.append("taskStatus", filters.status);
          }

          // Add search parameters
          if (search.taskSubject) {
            params.append("search", search.taskSubject);
          }

          const url = `${configApp.NOTIFICATION_SERVICE}/v1/api/tasklist?${params.toString()}`;
          const headers = notificationTokenHeader();
          const config = { headers, withCredentials: true };

          const result = await axios.get(url, config);
          return { data: result.data };
        } catch (error) {
          const errorBody = {
            action: "getTasklistPagination",
            title: "Failed to load tasklist",
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
            action,
            remarks,
            actionBy,
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
            taskIds,
            action,
            remarks,
            actionBy,
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
