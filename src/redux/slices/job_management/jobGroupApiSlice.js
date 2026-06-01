import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { configApp } from "../../../constants/configApp";

const JOB_GROUP_BASE = `${configApp.JOB_SERVICE}/v1/api/job-group`;

const getAuthHeaders = () => {
  const token = JSON.parse(
    localStorage.getItem("token") || sessionStorage.getItem("token") || "{}"
  );
  return { Authorization: token?.accessToken };
};

/** Map backend JobGroupResponse → frontend shape */
const toFrontend = (g) => ({
  id:            g.id,
  name:          g.name,
  code:          g.code,
  description:   g.description,
  isActive:      g.isActive,
  jobCount:      g.jobCount,
  createdBy:     g.createdBy,
  createdAt:     g.createdAt,
  updatedBy:     g.updatedBy,
  updatedAt:     g.updatedAt,
  accessGroupId: g.accessGroupId,
});

export const jobGroupApiSlice = createApi({
  reducerPath: "jobGroupApi",
  baseQuery: fetchBaseQuery({
    baseUrl: JOB_GROUP_BASE,
    prepareHeaders: (headers) => {
      const token = JSON.parse(
        localStorage.getItem("token") || sessionStorage.getItem("token") || "{}"
      );
      if (token?.accessToken) {
        headers.set("Authorization", token.accessToken);
      }
      return headers;
    },
  }),
  tagTypes: ["JobGroup"],
  endpoints: (builder) => ({

    /** GET /v1/api/job-group/{id} */
    getJobGroupById: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (res) => toFrontend(res),
      providesTags: (_result, _err, id) => [{ type: "JobGroup", id }],
    }),

    /** POST /v1/api/job-group/create */
    createJobGroup: builder.mutation({
      query: (data) => ({
        url: "/create",
        method: "POST",
        body: {
          groupName:     data.name,
          groupCode:     data.code,
          description:   data.description,
          isActive:      data.isActive ?? "Y",
          accessGroupId: data.accessGroupId ?? null,
          groupType:     data.groupType ?? "UNRELATED",
          jobIds:        data.jobIds ?? [],
        },
      }),
      invalidatesTags: ["JobGroup"],
    }),

    /** PUT /v1/api/job-group/{id} */
    updateJobGroup: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: {
          groupName:     data.name,
          groupCode:     data.code,
          description:   data.description,
          isActive:      data.isActive ?? "Y",
          accessGroupId: data.accessGroupId ?? null,
          groupType:     data.groupType ?? "UNRELATED",
          jobIds:        data.jobIds ?? [],
        },
      }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "JobGroup", id }],
    }),

    /** DELETE /v1/api/job-group/{id} */
    deleteJobGroup: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["JobGroup"],
    }),

    /**
     * POST /v1/api/job-group (paged list for selectors).
     * Shaped for useModalInfiniteData: { result, currentPage, totalPages }.
     * Keeps groupType/chainId (dropped by toFrontend) so callers can constrain
     * the run-trigger matrix per group type.
     */
    getJobGroupsPaged: builder.query({
      query: ({ page = 0, size = 20, keyword } = {}) => ({
        url: "",
        method: "POST",
        body: { page, size, keyword },
      }),
      transformResponse: (res) => ({
        result: (res?.content ?? []).map((g) => ({
          id:          g.id,
          name:        g.name,
          code:        g.code,
          description: g.description,
          isActive:    g.isActive,
          jobCount:    g.jobCount,
          groupType:   g.groupType,
          chainId:     g.chainId,
        })),
        currentPage:   res?.page ?? 0,
        totalPages:    res?.totalPages ?? 0,
        totalElements: res?.totalElements ?? 0,
      }),
      providesTags: [{ type: "JobGroup", id: "LIST" }],
    }),

    /** POST /v1/api/job-group/{id}/run */
    runJobGroup: builder.mutation({
      query: ({ id, body }) => ({
        url: `/${id}/run`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["JobGroup"],
    }),
  }),
});

export const {
  useGetJobGroupByIdQuery,
  useGetJobGroupsPagedQuery,
  useCreateJobGroupMutation,
  useUpdateJobGroupMutation,
  useDeleteJobGroupMutation,
  useRunJobGroupMutation,
} = jobGroupApiSlice;
