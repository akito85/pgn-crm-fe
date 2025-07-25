import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { configApp } from '../../../constants/configApp';
import { showModalError, validateError } from '../general_slice';
import reportHttpService from '../../services/reportHttpService';

export const reportCustomerSlice = createApi({
    reducerPath: 'reportCustomerSlice',
    baseQuery: fetchBaseQuery({
        baseUrl: configApp.REPORT_SERVICE, // baseURL global
    }),
    endpoints: (builder) => ({
        getCustomerAccountAdvancedFilter: builder.mutation({
            // Ganti dari `query` ke `queryFn`
            async queryFn({ page, pageSize, sort, search, body }, api, extraOptions, baseQuery) {
                const sortParams = !sort ? 'createdDate~desc' : sort;
                const url = `/v1/dbs/api/account-report/paging-customer?searchs=${search}&page=${page}&size=${pageSize}&sort=${sortParams}`;

                try {
                    const result = await reportHttpService.updateDataWithMethodPost(url, body);
                    return { data: result.data };
                } catch (error) {
                    // Panggil validateError thunk
                    api.dispatch(validateError({
                        error,
                        action: "getCustomerAccountAdvancedFilter",
                        back: false,
                        load: false
                    }));

                    return { error: { status: error?.response?.status, data: error?.response?.data } };
                }
            },
        }),
        getCustomerAccountPagination: builder.query({
            queryFn: async ({ page, pageSize, sort, search, body }, api, extraOptions) => {
                try {
                    const sortParams = !sort ? 'createdDate~desc' : sort;
                    const url = `/v1/dbs/api/account-info/paging-customer?searchs=${search}&page=${page}&size=${pageSize}&sort=${sortParams}`;
                    const result = await reportHttpService.getPagination(url);
                    return { data: result.data };
                } catch (error) {
                    const errorBody = {

                        title: "Failed",
                        description: error?.response?.data?.message + '.Please try again.',
                        code: error?.response?.sta
                    };

                    // Panggil validateError thunk
                    api.dispatch(showModalError(errorBody));

                    return { error: { status: error?.response?.status, data: error?.response?.data } };
                }
            },
        }),
        getCustomerDownload: builder.mutation({
            async queryFn({ page, pageSize, sort, search, body }, api, extraOptions, baseQuery) {
                try {
                    const sortParams = !sort ? 'createdDate~desc' : sort;
                    const url = `/v1/dbs/api/account-report/download-customer?searchs=${search}&page=${page}&size=${pageSize}&sort=${sortParams}`;

                    const result = await reportHttpService.downloadDataAdvanced(url, body);
                    return result;

                } catch (error) {
                    api.dispatch(validateError({
                        error : error,
                        action: "getCustomerDownload",
                        back: false,
                        load: false
                    }));

                    return { error: { status: error?.response?.status, data: error?.response?.data } };
                }
            }
        })
    })

})



export const { useGetCustomerAccountAdvancedFilterMutation, useGetCustomerAccountPaginationQuery,useGetCustomerDownloadMutation } = reportCustomerSlice;