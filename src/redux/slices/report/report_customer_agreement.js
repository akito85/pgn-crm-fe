import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { configApp } from "../../../constants/configApp";
import { showModalError, validateError } from "../general_slice";
import reportHttpService from "../../services/reportHttpService";

export const reportCustomerAgreementSlice = createApi({
  reducerPath: "reportCustomerAgreementSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: configApp.REPORT_SERVICE, // baseURL global
  }),
  endpoints: (builder) => ({
    getCustomerAgreementPagination: builder.query({
      queryFn: async (
        { page, pageSize, sort, search, body },
        api,
        extraOptions,
      ) => {
        try {
          const sortParams = !sort ? "createdDate~desc" : sort;
          const url = `/v1/dbs/api/summary/agreement/paging-sa-agreement?searchs=${search}&page=${page}&size=${pageSize}&sort=${sortParams}`;
          const result = await reportHttpService.getPagination(url);
          return { data: result.data };
        } catch (error) {
          const errorBody = {
            title: "Failed",
            description: error?.response?.data?.message + ".Please try again.",
            code: error?.response?.sta,
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
    getCustomerAgreementDownload: builder.mutation({
      async queryFn(
        { page, pageSize, sort, search, body },
        api,
        extraOptions,
        baseQuery,
      ) {
        try {
          const sortParams = !sort ? "createdDate~desc" : sort;
          const url = `/v1/dbs/api/summary/agreement/download-sa-agreement?searchs=${search}&page=${page}&size=${pageSize}&sort=${sortParams}`;

          const result = await reportHttpService.downloadDataAdvanced(url, {});
          return result;
        } catch (error) {
          api.dispatch(
            validateError({
              error,
              action: "getCustomerAccountAdvancedFilter",
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
  useGetCustomerAccountAdvancedFilterMutation,
  useGetCustomerAgreementPaginationQuery,
  useGetCustomerAgreementDownloadMutation,
} = reportCustomerAgreementSlice;
