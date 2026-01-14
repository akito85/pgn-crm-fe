import { Tooltip } from "antd";
import SVGIcon from "../../../../assets/Icon/index";

export const getCustomerListColumns = ({
    page = 1,
    pageSize = 10,
    onSelect = () => { },
    actionType = "none", // 'select', 'delete', 'disabled', 'none'
}) => {
    const columns = [
        { title: "NO", width: 60, render: (_, __, index) => (page - 1) * pageSize + index + 1, },
        { title: "SOR", dataIndex: "sor", width: 100, },
        { title: "COST CENTER", dataIndex: "costCenter", width: 180, },
        { title: "CUSTOMER NUMBER", dataIndex: "customerNumber", width: 150, },
        { title: "CUSTOMER NAME", dataIndex: "customerName", width: 250, },
        { title: "CUSTOMER SEGMENT", dataIndex: "customerSegment", width: 150, },
        { title: "CUSTOMER GROUP", dataIndex: "customerGroup", width: 150, },
    ];

    if (actionType !== "none") {
        columns.push({
            title: "ACTION",
            key: "action",
            width: 80,
            align: "center",
            fixed: "right",
            render: (text, record) => {
                if (actionType === "select") {
                    return (
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <SVGIcon
                                name="IconPlusCircle"
                                width={24}
                                onClick={() => onSelect(record)}
                                style={{ cursor: "pointer" }}
                            />
                        </div>
                    );
                }
                return null;
            },
        });
    }

    return columns;
};
