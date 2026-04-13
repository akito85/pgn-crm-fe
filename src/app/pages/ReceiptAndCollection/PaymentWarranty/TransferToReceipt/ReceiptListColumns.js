import { Tooltip } from "antd";
import SVGIcon from "../../../../../assets/Icon/index";
import InputComponent from "../../../../../components/InputComponent";

export const getReceiptListColumns = ({
    page = 1,
    pageSize = 10,
    onDelete = () => { },
    onAmountChange = () => { },
    actionType = "none", // 'delete', 'disabled', 'none'
    category = "", // 'SPLIT' or 'TRANSFER_FULL_AMOUNT'
    isModal = false,
}) => {
    const columns = [
        {
            title: "NO",
            dataIndex: "no",
            key: "no",
            width: 50,
            fixed: "left",
            render: (text, record, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "RECEIPT ID",
            dataIndex: "receiptId",
            key: "receiptId",
            width: 150,
            fixed: "left",
        },
        {
            title: "AREA CODE",
            dataIndex: "areaCode",
            key: "areaCode",
            width: 120,
        },
        {
            title: "AREA NAME",
            dataIndex: "areaName",
            key: "areaName",
            width: 200,
        },
        {
            title: "CUSTOMER NUMBER",
            dataIndex: "customerNumber",
            key: "customerNumber",
            width: 150,
        },
        {
            title: "CUSTOMER NAME",
            dataIndex: "customerName",
            key: "customerName",
            width: 250,
        },
        {
            title: "SOURCE",
            dataIndex: "source",
            key: "source",
            width: 120,
        },
        {
            title: "TYPE",
            dataIndex: "type",
            key: "type",
            width: 120,
        },
        {
            title: "METHOD",
            dataIndex: "method",
            key: "method",
            width: 120,
        },
        {
            title: "REFERENCE NUMBER",
            dataIndex: "referenceNumber",
            key: "referenceNumber",
            width: 180,
        },
        {
            title: "RECEIPT NUMBER",
            dataIndex: "receiptNo",
            key: "receiptNo",
            width: 180,
        },
        {
            title: "RECEIPT DATE",
            dataIndex: "receiptDate",
            key: "receiptDate",
            width: 150,
        },
        {
            title: "MT940 DATE",
            dataIndex: "mt940Date",
            key: "mt940Date",
            width: 150,
        },
        {
            title: "CURRENCY",
            dataIndex: "currency",
            key: "currency",
            width: 100,
        },
        {
            title: "AMOUNT",
            dataIndex: "amount",
            key: "amount",
            width: 180,
            align: "right",
            fixed: (isModal && category === "SPLIT") ? "right" : null,
            render: (value, record) => {
                const isSplit = category === "SPLIT";
                // Show input ONLY in modal for SPLIT category
                if (isModal && isSplit) {
                    return (
                        <InputComponent
                            type="numeric"
                            placeholder="Input Amount"
                            value={value}
                            thousandSeparator=","
                            decimalSeparator="."
                            onValueChange={(val) => {
                                onAmountChange(record, val.floatValue || 0);
                            }}
                        />
                    );
                }
                return (value ? value.toLocaleString("id-ID") : 0);
            },
        },
        {
            title: "RECEIPT CHANNEL",
            dataIndex: "receiptChannel",
            key: "receiptChannel",
            width: 150,
        },
        {
            title: "BANK",
            dataIndex: "bankName",
            key: "bankName",
            width: 150,
        },
        {
            title: "COLLECTING AGENT",
            dataIndex: "collectingAgent",
            key: "collectingAgent",
            width: 180,
        },
        {
            title: "DELIVERY CHANNEL",
            dataIndex: "deliveryChannel",
            key: "deliveryChannel",
            width: 180,
        },
        {
            title: "ONLINE PAYMENT FLAG",
            dataIndex: "onlinePaymentFlag",
            key: "onlinePaymentFlag",
            width: 180,
        },
        {
            title: "RECONCILED",
            dataIndex: "reconciled",
            key: "reconciled",
            width: 120,
        },
        {
            title: "RATE TYPE",
            dataIndex: "rateType",
            key: "rateType",
            width: 120,
        },
        {
            title: "RATE",
            dataIndex: "rate",
            key: "rate",
            width: 120,
            align: "right",
            render: (value) => (value ? value.toLocaleString("id-ID") : 0),
        },
        {
            title: "CONVERTED CURRENCY",
            dataIndex: "convertedCurrency",
            key: "convertedCurrency",
            width: 180,
        },
        {
            title: "EQV AMOUNT",
            dataIndex: "eqvAmount",
            key: "eqvAmount",
            width: 150,
            align: "right",
            render: (value) => (value ? value.toLocaleString("id-ID") : 0),
        },
        {
            title: "APPROVAL STATUS",
            dataIndex: "approvalStatus",
            key: "approvalStatus",
            width: 150,
        },
        {
            title: "STATUS",
            dataIndex: "status",
            key: "status",
            width: 120,
        },
        {
            title: "REMARK",
            dataIndex: "remark",
            key: "remark",
            width: 250,
        },
        {
            title: "APPLIED AMOUNT",
            dataIndex: "appliedAmount",
            key: "appliedAmount",
            width: 150,
            align: "right",
            render: (value) => (value ? value.toLocaleString("id-ID") : 0),
        },
        {
            title: "UNAPPLIED AMOUNT",
            dataIndex: "unappliedAmount",
            key: "unappliedAmount",
            width: 150,
            align: "right",
            render: (value) => (value ? value.toLocaleString("id-ID") : 0),
        },
        {
            title: "REVERSE AMOUNT",
            dataIndex: "reverseAmount",
            key: "reverseAmount",
            width: 150,
            align: "right",
            render: (value) => (value ? value.toLocaleString("id-ID") : 0),
        },
        {
            title: "CREATED DATE",
            dataIndex: "createdDate",
            key: "createdDate",
            width: 150,
        },
        {
            title: "CREATED BY",
            dataIndex: "createdBy",
            key: "createdBy",
            width: 150,
        },
    ];

    if (actionType !== "none") {
        columns.push({
            title: "ACTION",
            key: "action",
            width: 80,
            align: "center",
            fixed: "right",
            render: (text, record) => {
                if (actionType === "disabled") {
                    return (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: 0.5,
                                cursor: "not-allowed",
                            }}
                        >
                            <SVGIcon name="IconDelete" width={24} />
                        </div>
                    );
                }
                return (
                    <Tooltip title="Delete">
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <SVGIcon
                                name="IconDelete"
                                width={24}
                                color="#FF4D4F"
                                onClick={() => onDelete(record)}
                                style={{ cursor: "pointer" }}
                            />
                        </div>
                    </Tooltip>
                );
            },
        });
    }

    return columns;
};
