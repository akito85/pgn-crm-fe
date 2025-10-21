import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { configApp } from "../../../constants/configApp";
import { showModalError, validateError } from "../general_slice";
import reportHttpService from "../../services/reportHttpService";

export const reportCustomerSlice = createApi({
  reducerPath: "reportCustomerSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: configApp.REPORT_SERVICE, // baseURL global
  }),
  endpoints: (builder) => ({
    getCustomerAccountPagination: builder.query({
      queryFn: async (
        { page, pageSize, sort, search, body },
        api,
        extraOptions,
      ) => {
        try {
          const sortParams = !sort ? "createdDate~desc" : sort;
          const url = `/v1/dbs/api/summary/account/list-account-summary?searchs=${search}&page=${page}&size=${pageSize}&sort=${sortParams}`;
          const result = await reportHttpService.getPagination(url);
          return { data: result.data };
        } catch (error) {
          const errorBody = {
            action: "getCustomerAccountPagination",
            title: "Failed",
            description: error?.response?.data?.message + ".Please try again.",
            code: error?.response?.status,
            back: false,
          };

          // Panggil validateError thunk
          api.dispatch(showModalError(errorBody));

          return {
            error: {
              status: error?.response?.status,
              data: error?.response?.data,
            },
          };
        }
      },
    }),
    getCustomerDownload: builder.mutation({
      async queryFn(
        { page, pageSize, sort, search },
        api,
        extraOptions,
        baseQuery,
      ) {
        try {
          const sortParams = !sort ? "createdDate~desc" : sort;
          const url = `/v1/dbs/api/summary/account/download-account-summary?searchs=${search}&page=${page}&size=${pageSize}&sort=${sortParams}`;

          const result = await reportHttpService.downloadDataPostMethod(url);
          return result;
        } catch (error) {
          api.dispatch(
            validateError({
              error: error,
              action: "getCustomerDownload",
              back: false,
              load: false,
            }),
          );

          return {
            error: {
              status: error?.response?.status,
              data: error?.response?.data,
            },
          };
        }
      },
    }),
  }),
});

export const {
  useGetCustomerAccountPaginationQuery,
  useGetCustomerDownloadMutation,
} = reportCustomerSlice;
