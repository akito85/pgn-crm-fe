import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { configApp } from "../../../constants/configApp";
import { showModalError } from "../general_slice";
import axios from "axios";

const JOB_BASE = `${configApp.JOB_SERVICE}/v1/api/job/definitions`;

// ─── Field Transformers ───────────────────────────────────────────────────────

/** Map backend JobResponse → frontend-friendly shape (matches form field names) */
const toFrontend = (job) => ({
  id:            job.jobId,
  name:          job.jobName,
  code:          job.jobCode,
  type:          job.jobType,
  description:   job.description,
  executeType:   job.execType,
  handler:       job.handlerClass,
  taskQueueId:   job.taskQueueId,
  taskQueueName: job.taskQueueName,
  timeout:       job.timeoutSeconds,
  maxRetry:      job.maxRetry,
  retryPolicy:   job.retryPolicy,
  module:        job.moduleName,
  defaultInput:  job.defaultInput,
  inputSchema:   job.inputSchema,
  parentJobId:   job.parentJobId,
  status:        job.status,
  version:       job.version,
  createdBy:     job.createdBy,
  createdAt:     job.createdAt,
  updatedBy:     job.updatedBy,
  updatedAt:     job.updatedAt,
});

/** Map frontend form values → CreateJobRequest */
const toBackendCreate = (v) => ({
  jobName:       v.name,
  jobCode:       v.code,
  jobType:       v.type,
  description:   v.description,
  execType:      v.executeType,
  handlerClass:  v.handler,
  taskQueueId:   v.taskQueueId ?? null,
  timeoutSeconds: v.timeout  || 0,
  maxRetry:      v.maxRetry  || 0,
  retryPolicy:   v.retryPolicy ?? null,
  moduleName:    v.module    ?? null,
  defaultInput:  v.defaultInput ?? null,
  inputSchema:   v.inputSchema  ?? null,
  parentJobId:   v.parentJobId  ?? null,
});

/** Map frontend form values → UpdateJobRequest */
const toBackendUpdate = (v) => ({
  jobName:       v.name,
  jobType:       v.type,
  description:   v.description,
  execType:      v.executeType,
  handlerClass:  v.handler,
  taskQueueId:   v.taskQueueId ?? null,
  timeoutSeconds: v.timeout  || 0,
  maxRetry:      v.maxRetry  || 0,
  retryPolicy:   v.retryPolicy ?? null,
  moduleName:    v.module    ?? null,
  defaultInput:  v.defaultInput ?? null,
  inputSchema:   v.inputSchema  ?? null,
});

const getHeaders = () => {
  const token = JSON.parse(
    localStorage.getItem("token") || sessionStorage.getItem("token") || "{}"
  );
  return { Authorization: token?.accessToken };
};

// ─── API Slice ────────────────────────────────────────────────────────────────

export const jobApiSlice = createApi({
  reducerPath: "jobApi",
  baseQuery: fetchBaseQuery({ baseUrl: configApp.JOB_SERVICE }),
  tagTypes: ["Job"],
  endpoints: (builder) => ({

    /** POST /v1/api/job/definitions/search — paginated job list */
    searchJobs: builder.query({
      queryFn: async (
        { page = 0, size = 20, sortBy = "createdAt", sortDir = "DESC" } = {},
        api
      ) => {
        try {
          const res = await axios.post(
            `${JOB_BASE}/search`,
            { page, size, sortBy, sortDir },
            { headers: getHeaders() }
          );
          const d = res.data;
          return {
            data: {
              result:         (d.content || []).map(toFrontend),
              totalElements:  d.totalElements,
              totalPages:     d.totalPages,
              currentPage:    d.page,
              pageSize:       d.size,
            },
          };
        } catch (error) {
          api.dispatch(showModalError({
            title: "Failed to load jobs",
            description: error?.response?.data?.message ?? error?.message ?? "Unknown error",
          }));
          return { error: { status: error?.response?.status, data: error?.response?.data } };
        }
      },
      providesTags: [{ type: "Job", id: "LIST" }],
    }),

    /** GET /v1/api/job/definitions/:jobId */
    getJobById: builder.query({
      queryFn: async (jobId, api) => {
        try {
          const res = await axios.get(`${JOB_BASE}/${jobId}`, { headers: getHeaders() });
          return { data: toFrontend(res.data) };
        } catch (error) {
          api.dispatch(showModalError({
            title: "Failed to load job",
            description: error?.response?.data?.message ?? error?.message ?? "Unknown error",
          }));
          return { error: { status: error?.response?.status, data: error?.response?.data } };
        }
      },
      providesTags: (result, error, jobId) => [{ type: "Job", id: jobId }],
    }),

    /** POST /v1/api/job/definitions */
    createJob: builder.mutation({
      queryFn: async (formValues, api) => {
        try {
          const res = await axios.post(JOB_BASE, toBackendCreate(formValues), { headers: getHeaders() });
          return { data: toFrontend(res.data) };
        } catch (error) {
          api.dispatch(showModalError({
            title: "Failed to create job",
            description: error?.response?.data?.message ?? error?.message ?? "Unknown error",
          }));
          return { error: { status: error?.response?.status, data: error?.response?.data } };
        }
      },
      invalidatesTags: [{ type: "Job", id: "LIST" }],
    }),

    /** PUT /v1/api/job/definitions/:jobId */
    updateJob: builder.mutation({
      queryFn: async ({ jobId, data: formValues }, api) => {
        try {
          const res = await axios.put(
            `${JOB_BASE}/${jobId}`,
            toBackendUpdate(formValues),
            { headers: getHeaders() }
          );
          return { data: toFrontend(res.data) };
        } catch (error) {
          api.dispatch(showModalError({
            title: "Failed to update job",
            description: error?.response?.data?.message ?? error?.message ?? "Unknown error",
          }));
          return { error: { status: error?.response?.status, data: error?.response?.data } };
        }
      },
      invalidatesTags: (result, error, { jobId }) => [
        { type: "Job", id: "LIST" },
        { type: "Job", id: jobId },
      ],
    }),

    /** DELETE /v1/api/job/definitions/:jobId */
    deleteJob: builder.mutation({
      queryFn: async (jobId, api) => {
        try {
          await axios.delete(`${JOB_BASE}/${jobId}`, { headers: getHeaders() });
          return { data: jobId };
        } catch (error) {
          api.dispatch(showModalError({
            title: "Failed to delete job",
            description: error?.response?.data?.message ?? error?.message ?? "Unknown error",
          }));
          return { error: { status: error?.response?.status, data: error?.response?.data } };
        }
      },
      invalidatesTags: [{ type: "Job", id: "LIST" }],
    }),
  }),
});

export const {
  useSearchJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobApiSlice;
