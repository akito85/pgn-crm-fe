import TablePaginationNew from "../../../../../../../components/TablePaginationNew";
import NxPanel from "../../../../../../../components/Nx/NxPanel";
import moment from "moment";
const RelatedDetailCard = ({
    data = [],
    className = "",
}) => {
    // Columns for Customer type (from relatedDetail)
   

    // Columns for Account type (CHILD_OF, PARENT_OF) - same as ModalChooseRelated accountColumns
    const accountColumns = [
        {
            title: "NO",
            width: 60,
            align: "center",
            render: (text, object, index) => (
                <div className="py-2.5">{index + 1}</div>
            ),
        },
        
        {
            title: "ACCOUNT NUMBER",
            dataIndex: "accountNumber",
            width: 250,
            sorter: (a, b) => (a.accountNumber || "").localeCompare(b.accountNumber || ""),
        },
        {
            title: "ACCOUNT NAME",
            dataIndex: "accountName",
            width: 200,
            sorter: (a, b) => (a.accountName || "").localeCompare(b.accountName || ""),
        },
        {
            title: "CATEGORY",
            dataIndex: "accountCategory",
            width: 120,
            sorter: (a, b) => (a.accountCategory || "").localeCompare(b.accountCategory || ""),
            render: (text) => text || "-",
        },
        {
            title: "SOR",
            dataIndex: "sor",
            width: 200,
            sorter: (a, b) => (a.sor || "").localeCompare(b.sor || ""),
            render: (text) => text || "-",
        },
        {
            title: "COST CENTER",
            dataIndex: "costCenter",
            width: 150,
            sorter: (a, b) => (a.costCenter || "").localeCompare(b.costCenter || ""),
            render: (text) => text || "-",
        },
        {
            title: "METER READING CODES",
            dataIndex: "meterReadingCode",
            width: 250,
            sorter: (a, b) => (a.meterReadingCode || "").localeCompare(b.meterReadingCode || ""),
            render: (text) => text || "-",
        },
        {
            title: "CUSTOMER MANAGEMENT",
            dataIndex: "customerManagement",
            width: 250,
            sorter: (a, b) => (a.customerManagement || "").localeCompare(b.customerManagement || ""),
            render: (text) => text || "-",
        },
        {
            title: "CLASSIFICATION TYPE",
            dataIndex: "classificationType",
            width: 250,
            sorter: (a, b) => (a.classificationType || "").localeCompare(b.classificationType || ""),
            render: (text) => text || "-",
        },
        {
            title: "SEGMENT",
            dataIndex: "accountSegment",
            width: 150,
            sorter: (a, b) => (a.accountSegment || "").localeCompare(b.accountSegment || ""),
            render: (text) => text || "-",
        },
        {
            title: "ACCOUNT GROUP TYPE",
            dataIndex: "accountGroupType",
            width: 250,
            sorter: (a, b) => (a.accountGroupType || "").localeCompare(b.accountGroupType || ""),
            render: (text) => text || "-",
        },
        {
            title: "PREMISE ADDRESS",
            dataIndex: "premiseAddress",
            width: 250,
            sorter: (a, b) => (a.premiseAddress || "").localeCompare(b.premiseAddress || ""),
            render: (text) => text || "-",
        },
        {
            title: "SUBDISTRICT",
            dataIndex: "subDistrict",
            width: 150,
            sorter: (a, b) => (a.subDistrict || "").localeCompare(b.subDistrict || ""),
            render: (text) => text || "-",
        },
        {
            title: "DISTRICT",
            dataIndex: "district",
            width: 150,
            sorter: (a, b) => (a.district || "").localeCompare(b.district || ""),
            render: (text) => text || "-",
        },
        {
            title: "CITY",
            dataIndex: "city",
            width: 150,
            sorter: (a, b) => (a.city || "").localeCompare(b.city || ""),
            render: (text) => text || "-",
        },
        {
            title: "COUNTRY",
            dataIndex: "country",
            width: 150,
            sorter: (a, b) => (a.country || "").localeCompare(b.country || ""),
            render: (text) => text || "-",
        },
        {
            title: "LONGITUDE",
            dataIndex: "longitude",
            width: 120,
            sorter: (a, b) => (a.longitude || "").localeCompare(b.longitude || ""),
            render: (text) => text || "-",
        },
        {
            title: "LATITUDE",
            dataIndex: "latitude",
            width: 120,
            sorter: (a, b) => (a.latitude || "").localeCompare(b.latitude || ""),
            render: (text) => text || "-",
        },
        {
            title: "START DATE",
            dataIndex: "startDate",
            width: 150,
            sorter: (a, b) => (a.startDate || "").localeCompare(b.startDate || ""),
            render: (text) => text ? moment(text).format("DD MMM YYYY") : "-",
        },
        {
            title: "END DATE",
            dataIndex: "endDate",
            width: 150,
            sorter: (a, b) => (a.endDate || "").localeCompare(b.endDate || ""),
            render: (text) => text ? moment(text).format("DD MMM YYYY") : "-",
        },
    ];

    // Select appropriate columns based on type
    const columns = accountColumns;

    // Don't render if no data
    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div className={className}>
            <NxPanel title={"RELATED DETAIL"} removeBottomMargin>
                <TablePaginationNew
                    usePagination={false}
                    dataSource={data}
                    columns={columns}
                    tableScrolled={{ x: 3500 }}
                    className="related-detail-table"
                    rowKey={(record, index) => `related-${record?.accountNumber || index}`}
                />
            </NxPanel>
        </div>
    );
};

export default RelatedDetailCard;
