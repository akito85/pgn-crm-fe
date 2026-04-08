import React, { useEffect, useState, useMemo, useCallback } from "react";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import BreadCrumb from "../../../../../components/BreadCrumb";
import BaseContainer from "../../../../../components/BaseContainer";
import TableRBI from "../../../../../components/TableRBI";
import { getHistoryPaymentWarrantyColumns, getInvoiceInformationColumns } from "./HistoryColumns";
import {
    getHistoryPaymentWarrantyListPaginate,
    downloadHistoryPaymentWarranty
} from "../../../../../redux/slices/receipt_collection/historyWarranty";
import { Spin } from "antd";

const ListHistoryPaymentWarranty = () => {
    const dispatch = useDispatch();
    const { loading, data } = useSelector((state) => state.historyWarranty);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [dataSource, setDataSource] = useState([]);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [search, setSearch] = useState({});

    useEffect(() => {
        dispatch(getHistoryPaymentWarrantyListPaginate({ 
            page, 
            pageSize,
            search: encodeURIComponent(JSON.stringify(search))
        }));
    }, [dispatch, page, pageSize, search]);

    useEffect(() => {
        if (data?.result) {
            setDataSource(data.result);
        }
    }, [data]);

    const columns = useMemo(() => {
        return getHistoryPaymentWarrantyColumns({
            page,
            pageSize,
        });
    }, [page, pageSize]);

    const routes = [
        {
            path: "",
            breadcrumbName: "Receipt & Collection",
        },
        {
            path: "",
            breadcrumbName: "Payment Warranty",
        },
        {
            path: "",
            breadcrumbName: "History",
        },
    ];

    const onChangePage = (pageChange, pageSizeChange) => {
        setPage(pageChange);
        setPageSize(pageSizeChange);
    };

    const handleDownload = () => {
        dispatch(downloadHistoryPaymentWarranty({ 
            page, 
            pageSize,
            search: encodeURIComponent(JSON.stringify(search))
        }));
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(selectedKeys[0] ? dataIndex : "");
        const shouldResetPage = search[dataIndex] !== selectedKeys[0];
        setSearch((prevState) => {
            const nextState = { ...prevState };
            nextState[dataIndex] = selectedKeys[0];
            return nextState;
        });
        if (shouldResetPage) {
            setPage(1);
        }
    };

    const handleGlobalSearch = useCallback(
        debounce((value) => {
            setSearchText(value);
            setSearchedColumn(value ? "all" : "");
            setSearch((prevState) => {
                const nextState = { ...prevState };
                if (value) {
                    nextState.all = value;
                } else {
                    delete nextState.all;
                }
                return nextState;
            });
            setPage(1);
        }, 500),
        []
    );

    useEffect(() => {
        return () => {
            handleGlobalSearch.cancel();
        };
    }, [handleGlobalSearch]);

    const handleAdvanceSearch = (searchData) => {
        setSearch((prevState) => {
            setPage(1);
            return {
                ...prevState,
                advanceSearch: searchData
            };
        });
    };

    const expandedRowRender = (record) => {
        const columnsInvoice = getInvoiceInformationColumns();
        return (
            <div className="p-4 bg-gray-50">
                <h5 className="mb-2 font-bold">INVOICE INFORMATION</h5>
                <TableRBI
                    columns={columnsInvoice}
                    dataSource={record.invoiceList || []}
                    pagination={false}
                    usePagination={false}
                    showAdvanceSearch={false}
                    showSearchBar={false}
                    useSelect={false}
                />
            </div>
        );
    };

    return (
        <>
            <Spin spinning={loading}>
                <BreadCrumb routes={routes} />
                <BaseContainer header="PAYMENT WARRANTY HISTORY LIST">
                    <TableRBI
                        columns={columns}
                        dataSource={dataSource.map((item, index) => ({ ...item, key: index }))}
                        pagination={false}
                        current={page}
                        pageSize={pageSize}
                        totalData={data?.page?.totalElements || 0}
                        onChange={onChangePage}
                        onSizeChanger={onChangePage}
                        expandable={{
                            expandedRowRender,
                            rowExpandable: (record) => record.invoiceList && record.invoiceList.length > 0,
                        }}
                        tableScrolled={{ x: 2000 }}
                        showExport={true}
                        showSearchBar={true}
                        showAdvanceSearch={true}
                        onSearch={(e) => handleGlobalSearch(e.target.value)}
                        onAdvanceSearch={handleAdvanceSearch}
                        handleDownload={handleDownload}
                    />
                </BaseContainer>
            </Spin>
        </>
    );
};

export default ListHistoryPaymentWarranty;
