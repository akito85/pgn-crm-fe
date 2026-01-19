import moment from "moment";
import { Fragment, useState } from "react";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import DetailText from "../../../../../components/DetailText";
import RadioTabs from "../../../../../components/RadioTabs";
import AttachmentSectionForm from "../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import TableRBI from "../../../../../components/TableRBI";
import SVGIcon from "../../../../../assets/Icon/index";

const ContentModalConfirm = ({
    data,
    listDataAttachment = [],
    listDataAppHierDetail = [],
    tabData = [],
    dataOption,
    selectedHierarchy,
    customerList = [],
}) => {
    const [valuePage, setValuePage] = useState(tabData[0].value);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const handlePageChange = (page) => {
        setPage(page);
    };

    const handleSizeChange = (current, size) => {
        setPage(1);
        setPageSize(size);
    };

    const columnsCustomer = [
        {
            title: "NO",
            dataIndex: "no",
            key: "no",
            width: 50,
            render: (text, record, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "CUSTOMER",
            dataIndex: "customer",
            key: "customer",
            width: 150,
        },
        {
            title: "AREA CODE",
            dataIndex: "areaCode",
            key: "areaCode",
            width: 100,
        },
        {
            title: "FROM CUSTOMER NAME",
            dataIndex: "fromCustomerName",
            key: "fromCustomerName",
            width: 200,
        },
        {
            title: "CURRENCY",
            dataIndex: "currency",
            key: "currency",
            width: 80,
        },
        {
            title: "AMOUNT",
            dataIndex: "amount",
            key: "amount",
            width: 150,
            render: (value) => value ? value.toLocaleString("id-ID") : 0,
            align: "right",
        },
        {
            title: "ACTION",
            key: "action",
            width: 80,
            align: "center",
            fixed: "right",
            render: (text, record) => (
                <div style={{ display: "flex", justifyContent: "center", opacity: 0.5, cursor: "not-allowed" }}>
                    <SVGIcon
                        name="IconDelete"
                        width={24}
                    />
                </div>
            ),
        },
    ];

    const showSection = () => {
        switch (valuePage) {
            case tabData[0].value:
                return (
                    <div className="flex flex-col gap-5 w-full">
                        <div>
                            <div className="text-primary text-xs font-bold uppercase mb-3">
                                TRANSFER INFORMATION
                            </div>
                            <div className="grid grid-cols-3 w-full gap-5">
                                <DetailText label={"From Customer ID"}>
                                    {data?.fromCustomerId}
                                </DetailText>
                                <DetailText label={"From Customer Name"}>
                                    {data?.fromCustomerName}
                                </DetailText>
                                <DetailText label={"Area Code"}>
                                    {data?.areaCode}
                                </DetailText>
                            </div>
                        </div>

                        <div>
                            <div className="text-primary text-xs font-bold uppercase mb-3">
                                WARRANTY INFORMATION
                            </div>
                            <div className="grid grid-cols-3 w-full gap-5">
                                <DetailText label={"Payment Warranty Code"}>
                                    {data?.paymentWarrantyCode}
                                </DetailText>
                                <DetailText label={"Area Code"}>
                                    {data?.warrantyAreaCode}
                                </DetailText>
                                <DetailText label={"Area Name"}>
                                    {data?.areaName}
                                </DetailText>

                                <DetailText label={"Customer ID"}>
                                    {data?.customerId}
                                </DetailText>
                                <DetailText label={"Customer Name"}>
                                    {data?.customerName}
                                </DetailText>
                                <DetailText label={"Customer Segment"}>
                                    {data?.customerSegment}
                                </DetailText>

                                <DetailText label={"Customer Group"}>
                                    {data?.customerGroup}
                                </DetailText>
                                <DetailText label={"Type"}>
                                    {data?.type}
                                </DetailText>
                                <DetailText label={"Penerbit"}>
                                    {data?.publisher}
                                </DetailText>

                                <DetailText label={"Currency"}>
                                    {data?.currency}
                                </DetailText>
                                <DetailText label={"Ballance"}>
                                    {data?.balance}
                                </DetailText>
                                <DetailText label={"Rate"}>
                                    {data?.rate}
                                </DetailText>

                                <DetailText label={"Rate Date"}>
                                    {data?.rateDate}
                                </DetailText>
                                <DetailText label={"Equivalent"}>
                                    {data?.equivalent}
                                </DetailText>
                                <DetailText label={"Document Number"}>
                                    {data?.documentNumber}
                                </DetailText>

                                <DetailText label={"Mutation Date"}>
                                    {data?.mutationDate}
                                </DetailText>
                                <DetailText label={"Effective Date"}>
                                    {data?.effectiveDate}
                                </DetailText>
                                <DetailText label={"Expiring Date"}>
                                    {data?.expiringDate}
                                </DetailText>

                                <DetailText label={"End Date Claim"}>
                                    {data?.endDateClaim}
                                </DetailText>
                            </div>
                        </div>

                        <div>
                            <div className="text-primary text-xs font-bold uppercase mb-3">
                                TO CUSTOMER LIST INFORMATION
                            </div>
                            <TableRBI
                                columns={columnsCustomer}
                                dataSource={customerList.slice((page - 1) * pageSize, page * pageSize)}
                                pagination={false}
                                tableScrolled={{ x: 1000 }}
                                totalData={customerList?.length || 0}
                                current={page}
                                pageSize={pageSize}
                                onChange={handlePageChange}
                                onSizeChanger={handleSizeChange}
                            />
                        </div>
                    </div>
                );
            case tabData[1].value:
                return (
                    <ApprovalComponentGeneral
                        showSelect={false}
                        disableSelect={true}
                        approvalName={
                            (dataOption || []).filter(
                                (data) => data.value === selectedHierarchy
                            )?.[0].name || ""
                        }
                        dataTable={listDataAppHierDetail}
                        selectedHierarchy
                    />
                );
            case tabData[2].value:
                return (
                    <AttachmentSectionForm type={"preview"} data={listDataAttachment} />
                );
            default:
                return <Fragment></Fragment>;
        }
    };
    const handleMethod = (e) => {
        setValuePage(e.target.value);
    };

    return (
        <div className="flex flex-col gap-4">
            <RadioTabs data={tabData} onChange={handleMethod} />
            <div className="flex flex-col gap-4">
                {showSection()}
            </div>
        </div>
    );
};

export default ContentModalConfirm;
