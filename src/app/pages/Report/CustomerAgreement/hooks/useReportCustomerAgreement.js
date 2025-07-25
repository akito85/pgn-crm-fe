import React, { useRef, useState, useMemo, useCallback } from 'react';
import ButtonComponent from '../../../../../components/ButtonComponent';
import { DownloadOutlined } from '@ant-design/icons';
import AgreementColumn from '../Columns/AgreementColumn';
import { useGetCustomerAgreementDownloadMutation, useGetCustomerAgreementPaginationQuery } from '../../../../../redux/slices/report/report_customer_agreement';
import { useSelector } from 'react-redux';
import { useTryAgainHooks } from '../../../../../utils/useTryAgainHooks';

const useReportCustomerAgreement = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState({});
    const [sort, setSort] = useState('');
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const encodeSearch = useMemo(() => encodeURIComponent(JSON.stringify(search)), [search]);
    const [downloadCustomerAgreement, { isLoading: loading }] = useGetCustomerAgreementDownloadMutation();
    const { data, isLoading, isFetching, refetch } = useGetCustomerAgreementPaginationQuery({
        page,
        pageSize,
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
    }, {
        refetchOnMountOrArgChange: true
    });

    const loadings = useMemo(() => isLoading || isFetching || loading, [isFetching, isLoading, loading])
    const { bodyError } = useSelector((state) => state?.general);

    const handleChange = useCallback((pageChange, pageSizeChange) => {
        setPage(pageSize !== pageSizeChange ? 1 : pageChange);
        setPageSize(pageSizeChange);
    }, [pageSize]);

    const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        setSearch((prevState) => {
            if (prevState[dataIndex] !== selectedKeys[0]) {
                setPage(1);
            }
            return {
                ...prevState,
                [dataIndex]: selectedKeys[0],
            };
        }
        );
    }, []);

    const handleDownload = useCallback(async () => {
        await downloadCustomerAgreement({
            page,
            pageSize,
            sort,
            search: encodeSearch,
        })
        refetch();
    }, [downloadCustomerAgreement, encodeSearch, page, pageSize, sort, refetch]);


    const handleRetry = async () => {
        try {
            handleCancelTryAgain();
            if (bodyError?.action === 'getCustomerDownload') {
                await handleDownload();
            }
        } catch (error) {
            console.log(error);
        }

    }

    const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);


    const onSort = useCallback((_, __, sort) => {
        const dataSort =
            sort.order !== undefined
                ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
                : "";
        setSort(dataSort);
    }, []);

    const column = useMemo(() => {
        return AgreementColumn(page, pageSize, searchInput, searchedColumn, searchText, search, handleSearch)
    }, [handleSearch, page, pageSize, searchText, searchedColumn, search]);


    const itemActions = useMemo(() => {
        return [
            {
                action: 'Download',
                render: (
                    <ButtonComponent
                        icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
                        type={"submit"}
                        onClick={handleDownload}
                    >
                        Download List
                    </ButtonComponent>

                )
            },
        ];
    }, [handleDownload])

    return {
        itemActions,
        page,
        pageSize,
        handleChange,
        loadings,
        data,
        column,
        onSort,
        renderModal
    }
}

export default useReportCustomerAgreement;
