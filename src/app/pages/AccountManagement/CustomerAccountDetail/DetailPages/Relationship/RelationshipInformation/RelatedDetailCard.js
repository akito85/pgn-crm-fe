import TablePagination from "../../../../../../../components/TablePagination";
import NxPanel from "../../../../../../../components/Nx/NxPanel";

const RelatedDetailCard = ({
    data = [],
    className = "",
}) => {
    const columns = [
        {
            title: "NO",
            align: "center",
            width: 60,
            render: (text, object, index) => (
                <div style={{ padding: "8px 0" }}>{index + 1}</div>
            ),
        },
        {
            title: () => (
                <div className="flex items-center justify-between w-full">
                    <span>ACCOUNT NUMBER</span>
                </div>
            ),
            dataIndex: "accountNumber",
            align: "left",
            sorter: (a, b) => (a.accountNumber || "").localeCompare(b.accountNumber || ""),
            render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
        },
        {
            title: () => (
                <div className="flex items-center justify-between w-full">
                    <span>ACCOUNT NAME</span>
                </div>
            ),
            dataIndex: "accountName",
            align: "left",
            sorter: (a, b) => (a.accountName || "").localeCompare(b.accountName || ""),
            render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
        },
        {
            title: () => (
                <div className="flex items-center justify-between w-full">
                    <span>ACCOUNT CATEGORY</span>
                </div>
            ),
            dataIndex: "accountCategory",
            align: "left",
            sorter: (a, b) => (a.accountCategory || "").localeCompare(b.accountCategory || ""),
            render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
        },
        {
            title: () => (
                <div className="flex items-center justify-between w-full">
                    <span>SOR</span>
                </div>
            ),
            dataIndex: "sor",
            align: "left",
            sorter: (a, b) => (a.sor || "").localeCompare(b.sor || ""),
            render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
        },
        {
            title: () => (
                <div className="flex items-center justify-between w-full">
                    <span>COST CENTER</span>
                </div>
            ),
            dataIndex: "costCenter",
            align: "left",
            sorter: (a, b) => (a.costCenter || "").localeCompare(b.costCenter || ""),
            render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
        },
        {
            title: () => (
                <div className="flex items-center justify-between w-full">
                    <span>METER READING CODE</span>
                </div>
            ),
            dataIndex: "meterReadingCode",
            align: "left",
            sorter: (a, b) => (a.meterReadingCode || "").localeCompare(b.meterReadingCode || ""),
            render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
        },
    ];

    // Don't render if no data
    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div className={className}>
            <NxPanel title={"RELATED DETAIL"} removeBottomMargin>
                <TablePagination
                    useSelect={false}
                    usePagination={false}
                    dataSource={data}
                    columns={columns}
                    className="related-detail-table"
                    rowKey={(record, index) => `related-${record?.accountNumber || index}`}
                />
            </NxPanel>
        </div>
    );
};

export default RelatedDetailCard;
