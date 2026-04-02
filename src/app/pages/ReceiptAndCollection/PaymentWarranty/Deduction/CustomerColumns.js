import { Tooltip } from "antd";
import SVGIcon from "../../../../../assets/Icon/index";

export const getCustomerListColumns = ({
    page = 1,
    pageSize = 10,
    onDelete = () => { },
    actionType = "none", // 'delete', 'disabled', 'none'
    amountRender = null, // Custom render for amount column
}) => {
    const columns = [
        { 
            title: "NO", 
            width: 40, 
            align: "center",
            fixed: "left",
            render: (_, __, index) => (page - 1) * pageSize + index + 1, 
        },
        { 
            title: "ACCOUNT NUMBER", 
            dataIndex: "accountNumber", 
            width: 110, 
            fixed: "left",
        },
        { 
            title: "ACCOUNT NAME", 
            dataIndex: "accountName", 
            width: 200, 
            ellipsis: true,
        },
        { 
            title: "COST CENTER", 
            dataIndex: "costCenter", 
            width: 100, 
        },
        { 
            title: "CUSTOMER NUMBER", 
            dataIndex: "customerNumber", 
            width: 110, 
        },
        { 
            title: "CUSTOMER NAME", 
            dataIndex: "customerName", 
            width: 200, 
            ellipsis: true,
        },
        { 
            title: "CUSTOMER SEGMENT", 
            dataIndex: "customerSegment", 
            width: 110, 
        },
        { 
            title: "CUSTOMER GROUP", 
            dataIndex: "customerGroup", 
            width: 110, 
        },
        { 
            title: "TOTAL PAYMENT GUARANTEE", 
            dataIndex: "totalPaymentGuarantee", 
            width: 150, 
            align: "right",
        },
        { 
            title: "TOTAL TAX", 
            dataIndex: "totalTax", 
            width: 90, 
            align: "right",
        },
        { 
            title: "INVOICE NUMBER", 
            dataIndex: "invoiceNumber", 
            width: 110, 
        },
        { 
            title: "PERIOD", 
            dataIndex: "period", 
            width: 100, 
        },
        { 
            title: "CURRENCY", 
            dataIndex: "currency", 
            width: 70, 
            align: "center",
        },
        { 
            title: "OUTSTANDING", 
            dataIndex: "outstanding", 
            width: 110, 
            align: "right",
        },
        { 
            title: "AMOUNT", 
            dataIndex: "amount", 
            width: 110, 
            align: "right",
            render: amountRender || ((text) => text),
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
                                opacity: 0.5,
                                cursor: "not-allowed",
                                justifyContent: "center"
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
                                className="cursor-pointer"
                                name="IconDelete"
                                width={20}
                                color="#ED1C24"
                                onClick={() => onDelete(record.id)}
                            />
                        </div>
                    </Tooltip>
                );
            },
        });
    }

    return columns;
};
