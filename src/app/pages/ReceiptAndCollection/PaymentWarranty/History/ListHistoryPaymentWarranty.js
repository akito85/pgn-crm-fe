import React, { useEffect, useState, useMemo } from "react";
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

    useEffect(() => {
        dispatch(getHistoryPaymentWarrantyListPaginate({ page, pageSize }));
    }, [dispatch, page, pageSize]);

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
        dispatch(downloadHistoryPaymentWarranty({ page, pageSize }));
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
        <div>
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
                        handleDownload={handleDownload}
                    />
                </BaseContainer>
            </Spin>
        </div>
    );
};

export default ListHistoryPaymentWarranty;
