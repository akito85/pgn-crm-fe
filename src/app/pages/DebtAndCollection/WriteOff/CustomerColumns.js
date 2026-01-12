import { Tooltip } from "antd";
import SVGIcon from "../../../../assets/Icon/index";

export const getCustomerListColumns = ({
    page = 1,
    pageSize = 10,
    onDelete = () => { },
    actionType = "none", // 'delete', 'disabled', 'none'
}) => {
    const columns = [
        { title: "NO", width: 60, render: (_, __, index) => (page - 1) * pageSize + index + 1, },
        { title: "COST CENTER", dataIndex: "costCenter", width: 180, },
        { title: "CUSTOMER NUMBER", dataIndex: "customerNumber", width: 150, },
        { title: "CUSTOMER NAME", dataIndex: "customerName", width: 250, },
        { title: "CUSTOMER SEGMENT", dataIndex: "customerSegment", width: 150, },
        { title: "CUSTOMER GROUP", dataIndex: "customerGroup", width: 150, },
        { title: "PPJ TP", dataIndex: "ppjTp", width: 150, align: "right", render: (v) => (v ? v.toLocaleString() : 0), },
        { title: "PPJ TLH", dataIndex: "ppjTlh", width: 150, align: "right", render: (v) => (v ? v.toLocaleString() : 0), },
        { title: "CONTRACT ID", dataIndex: "contractId", width: 150, },
        { title: "PERIOD", dataIndex: "period", width: 120, },
        { title: "BILL ITEM", dataIndex: "billItem", width: 120, },
        { title: "CURRENCY", dataIndex: "currency", width: 100, },
        { title: "OUTSTANDING", dataIndex: "outstanding", width: 150, align: "right", render: (v) => (v ? v.toLocaleString() : "-"), },
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
