import React, { useState } from "react";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import BaseContainer from "../../../../../components/BaseContainer";
import TableRBI from "../../../../../components/TableRBI";
import { getHistoryPaymentWarrantyColumns, getInvoiceInformationColumns } from "./HistoryColumns";
import dummyData from "../../../../../redux/slices/receipt_collection/temp_hardcoded_json/history/get-history-list.json"; // Direct import for now as per instructions to just make dummy data

const ListHistoryPaymentWarranty = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [data, setData] = useState(dummyData?.data?.result || []);

    const columns = getHistoryPaymentWarrantyColumns({
        page,
        pageSize,
    });

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

    const onChangePage = (page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
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
        <LayoutMenu>
            <BreadCrumb routes={routes} />
            <BaseContainer header="PAYMENT WARRANTY HISTORY LIST">
                <TableRBI
                    columns={columns}
                    dataSource={data.map((item, index) => ({ ...item, key: index }))}
                    pagination={false} // Client-side pagination logic if needed, but for now just showing list
                    current={page}
                    pageSize={pageSize}
                    totalData={dummyData?.data?.page?.totalElements || 0}
                    onChange={onChangePage}
                    onSizeChanger={onChangePage}
                    expandable={{
                        expandedRowRender,
                        rowExpandable: (record) => record.invoiceList && record.invoiceList.length > 0,
                    }}
                    tableScrolled={{ x: 2000 }}
                />
            </BaseContainer>
        </LayoutMenu>
    );
};

export default ListHistoryPaymentWarranty;
