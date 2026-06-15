import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { configApp } from "../../../constants/configApp";
import { showModalError } from "../general_slice";
import axios from "axios";

const JOB_BASE = `${configApp.JOB_SERVICE}/v1/api/job/definitions`;

// ─── Field Transformers ───────────────────────────────────────────────────────

/** Map backend JobResponse → frontend-friendly shape (matches form field names) */
const toFrontend = (job) => {
  // Parse defaultInput to extract spSchema and spProcedure for stored procedures
  let spSchema = null, spProcedure = null;
  if (job.defaultInput) {
    try {
      const defaultInputObj = typeof job.defaultInput === 'string'
        ? JSON.parse(job.defaultInput)
        : job.defaultInput;
      spSchema = defaultInputObj?.schema;
      spProcedure = defaultInputObj?.procedureName;
    } catch (e) {
      console.warn('Failed to parse defaultInput:', e);
    }
  }

  // Parse inputSchema to extract parameters
  let parameters = [];
  if (job.inputSchema) {
    try {
      const inputSchemaObj = typeof job.inputSchema === 'string'
        ? JSON.parse(job.inputSchema)
        : job.inputSchema;
      parameters = inputSchemaObj?.parameters ?? [];
    } catch (e) {
      console.warn('Failed to parse inputSchema:', e);
    }
  }

  return {
    id:            job.jobId,
    name:          job.jobName,
    code:          job.jobCode,
    type:          job.jobType,
    description:   job.description,
    desc:          job.description,   // alias used by table columns
    executeType:   job.execType,
    execType:      job.execType,      // alias used by child table columns
    handler:       job.handlerClass,
    handlerClass:  job.handlerClass,  // alias used by child table columns
    taskQueueId:   job.taskQueueId,
    taskQueueName: job.taskQueueName,
    timeout:       job.timeoutSeconds,
    maxRetry:      job.maxRetry,
    createdDate:   job.createdAt,     // alias used by table columns
    updatedDate:   job.updatedAt,     // alias used by table columns
    module:        job.moduleName,    // alias used by table columns
    accessGroup:   job.accessGroupName ?? (job.accessGroupId ? String(job.accessGroupId) : null),
    parent:        job.parentJobId   ? String(job.parentJobId)   : null,
    retryPolicy:   job.retryPolicy,
    module:        job.moduleName,
    defaultInput:  job.defaultInput,
    inputSchema:   job.inputSchema,
    spSchema:      spSchema,
    spProcedure:   spProcedure,
    parameters:    parameters,
    parentJobId:   job.parentJobId,
    status:        job.status,
    version:       job.version,
    createdBy:     job.createdBy,
    createdAt:     job.createdAt,
    updatedBy:     job.updatedBy,
    updatedAt:     job.updatedAt,
    accessGroupId: job.accessGroupId,
    // Parsed NotificationConfigDto, so the edit form can hydrate every in-app
    // flag (standard/toast/popup/inline) faithfully via notificationConfigToSettings.
    notificationConfig: (() => {
      if (!job.notificationConfig) return null;
      try {
        return typeof job.notificationConfig === 'string'
          ? JSON.parse(job.notificationConfig)
          : job.notificationConfig;
      } catch (e) {
        return null;
      }
    })(),
    notificationSettings: (() => {
      if (!job.notificationConfig) return null;
      try {
        const nc = typeof job.notificationConfig === 'string'
          ? JSON.parse(job.notificationConfig)
          : job.notificationConfig;
        // nc.inApp is the nested { standard, toast, popup, inline } object per
        // the Notifications module's DISPLAY_TYPES vocabulary. Old rows with a
        // legacy boolean inApp deserialise as nc.inApp === true/false — fall
        // back to standard=true so we don't silently drop the user's intent.
        const inApp = typeof nc.inApp === 'object' && nc.inApp !== null
          ? nc.inApp
          : { standard: nc.inApp === true, toast: false, popup: false, inline: false };
        return {
          showInDrawer:    inApp.standard ?? false,
          showToast:       inApp.toast    ?? false,
          showAlert:       inApp.popup    ?? false,
          showInline:      inApp.inline   ?? false,
          sendViaEmail:    nc.email       ?? false,
          sendViaSMS:      nc.sms         ?? false,
          sendViaWhatsApp: nc.whatsapp    ?? false,
        };
      } catch (e) {
        return null;
      }
    })(),
  };
};

/** Map frontend form values → CreateJobRequest */
const toBackendCreate = (v) => {
  // Build defaultInput with SP metadata if procedure-based
  let defaultInput = v.defaultInput ?? null;
  if (v.executeType === "STORED_PROCEDURE" && v.spSchema && v.spProcedure) {
    defaultInput = JSON.stringify({
      schema: v.spSchema,
      procedureName: v.spProcedure,
    });
  }

  // Build inputSchema with parameters if provided
  let inputSchema = v.inputSchema ?? null;
  if (v.parameters && v.parameters.length > 0) {
    const params = v.parameters.filter(p => p.name || p.code);
    if (params.length > 0) {
      inputSchema = JSON.stringify({
        parameters: params,
      });
    }
  }

  return {
    jobName:        v.name,
    jobCode:        v.code,
    jobType:        v.type,
    description:    v.description,
    execType:       v.executeType,
    handlerClass:   v.handler,
    taskQueueId:    v.taskQueueId    ?? null,
    timeoutSeconds: v.timeout        ?? null,
    maxRetry:       v.maxRetry       || 0,
    retryPolicy:    v.retryPolicy    ?? null,
    moduleName:     v.module         ?? null,
    defaultInput:   defaultInput,
    inputSchema:    inputSchema,
    parentJobId:    v.parentJobId    ?? null,
    accessGroupId:  v.accessGroupId  ?? null,
    notificationConfig: v.notificationSettings
      ? {
          inApp: {
            standard: v.notificationSettings.showInDrawer ?? false,
            toast:    v.notificationSettings.showToast    ?? false,
            popup:    v.notificationSettings.showAlert    ?? false,
            inline:   v.notificationSettings.showInline   ?? false,
          },
          email:    v.notificationSettings.sendViaEmail    ?? false,
          sms:      v.notificationSettings.sendViaSMS      ?? false,
          whatsapp: v.notificationSettings.sendViaWhatsApp ?? false,
        }
      : null,
  };
};

/** Map frontend form values → UpdateJobRequest */
const toBackendUpdate = (v) => {
  // Build defaultInput with SP metadata if procedure-based
  let defaultInput = v.defaultInput ?? null;
  if (v.executeType === "STORED_PROCEDURE" && v.spSchema && v.spProcedure) {
    defaultInput = JSON.stringify({
      schema: v.spSchema,
      procedureName: v.spProcedure,
    });
  }

  // Build inputSchema with parameters if provided
  let inputSchema = v.inputSchema ?? null;
  if (v.parameters && v.parameters.length > 0) {
    const params = v.parameters.filter(p => p.name || p.code);
    if (params.length > 0) {
      inputSchema = JSON.stringify({
        parameters: params,
      });
    }
  }

  return {
    jobName:        v.name,
    jobType:        v.type,
    description:    v.description,
    execType:       v.executeType,
    handlerClass:   v.handler,
    taskQueueId:    v.taskQueueId    ?? null,
    timeoutSeconds: v.timeout        ?? null,
    maxRetry:       v.maxRetry       || 0,
    retryPolicy:    v.retryPolicy    ?? null,
    moduleName:     v.module         ?? null,
    defaultInput:   defaultInput,
    inputSchema:    inputSchema,
    accessGroupId:  v.accessGroupId  ?? null,
    notificationConfig: v.notificationSettings
      ? {
          inApp: {
            standard: v.notificationSettings.showInDrawer ?? false,
            toast:    v.notificationSettings.showToast    ?? false,
            popup:    v.notificationSettings.showAlert    ?? false,
            inline:   v.notificationSettings.showInline   ?? false,
          },
          email:    v.notificationSettings.sendViaEmail    ?? false,
          sms:      v.notificationSettings.sendViaSMS      ?? false,
          whatsapp: v.notificationSettings.sendViaWhatsApp ?? false,
        }
      : null,
  };
};

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
            title: "Failed to load job list",
            description: error?.response?.data?.message ?? error?.message ?? "Something went wrong while retrieving the job list. Please try again or contact support if the problem continues.",
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

    /** GET /v1/api/job/definitions/access-groups — id→name lookup */
    getAccessGroups: builder.query({
      queryFn: async (_, api) => {
        try {
          const res = await axios.get(`${JOB_BASE}/access-groups`, { headers: getHeaders() });
          return { data: res.data };
        } catch (error) {
          api.dispatch(showModalError({
            title: "Could not load job groups",
            description: "Job group names are temporarily unavailable. Group IDs may appear in the table instead. Please refresh the page or contact support if the issue persists.",
          }));
          return { error: { status: error?.response?.status, data: error?.response?.data } };
        }
      },
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
  useGetAccessGroupsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobApiSlice;
