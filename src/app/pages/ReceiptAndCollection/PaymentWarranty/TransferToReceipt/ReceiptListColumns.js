import { Tooltip } from "antd";
import SVGIcon from "../../../../../assets/Icon/index";

export const getReceiptListColumns = ({
    page = 1,
    pageSize = 10,
    onDelete = () => { },
    actionType = "none", // 'delete', 'disabled', 'none'
}) => {
    const columns = [
        {
            title: "NO",
            dataIndex: "no",
            key: "no",
            width: 50,
            render: (text, record, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "RECEIPT DATA",
            dataIndex: "receiptData",
            key: "receiptData",
            width: 150,
        },
        {
            title: "RECEIPT ID",
            dataIndex: "receiptId",
            key: "receiptId",
            width: 150,
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
            title: "ACCOUNT NUMBER",
            dataIndex: "accountNumber",
            key: "accountNumber",
            width: 150,
        },
        {
            title: "TYPE",
            dataIndex: "type",
            key: "type",
            width: 100,
        },
        {
            title: "CUR",
            dataIndex: "currency",
            key: "currency",
            width: 80,
        },
        {
            title: "AMOUNT",
            dataIndex: "amount",
            key: "amount",
            width: 150,
            render: (value) => (value ? value.toLocaleString("id-ID") : 0),
            align: "right",
        },
        {
            title: "REMARK",
            dataIndex: "remark",
            key: "remark",
            width: 200,
        },
        {
            title: "EGL",
            dataIndex: "egl",
            key: "egl",
            width: 100,
        },
        {
            title: "STATUS",
            dataIndex: "status",
            key: "status",
            width: 100,
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
                                onClick={() => onDelete(record)}
                            />
                        </div>
                    </Tooltip>
                );
            },
        });
    }

    return columns;
};
