import moment from "moment";
import { dateFormatting, toTitleCase } from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../../components/StatusComponent";

/**
 * Get Service Agreement column definitions for NxTable
 */
const getServiceAgreementColumns = (
    search,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch,
    includeStatus = true,
) => [
    {
        key: "no",
        title: "NO",
        align: "center",
        dataIndex: "no",
        width: 50,
        render: (_, __, index) => index + 1,
    },
    {
        key: "saNumber",
        title: "SA NUMBER",
        dataIndex: "saNumber",
        width: 150,
        sorter: true,
        filteredValue: [search?.saNumber] || null,
        ...getColumnSearchPropsUseFilteredValue(
            search,
            "saNumber",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            true
        ),
    },
    {
        key: "saReference",
        title: "SA REFERENCE",
        dataIndex: "saReference",
        width: 180,
        sorter: true,
        filteredValue: [search?.saReference] || null,
        ...getColumnSearchPropsUseFilteredValue(
            search,
            "saReference",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            true
        ),
    },
    {
        key: "saServiceType",
        title: "SERVICE TYPE",
        dataIndex: "saServiceType",
        width: 140,
        sorter: true,
        filteredValue: [search?.saServiceType] || null,
        ...getColumnSearchPropsUseFilteredValue(
            search,
            "saServiceType",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            true
        ),
        render: (text) => text?.value || "-",
    },
    {
        key: "saType",
        title: "TYPE",
        dataIndex: "saType",
        width: 100,
        sorter: true,
        filteredValue: [search?.saType] || null,
        ...getColumnSearchPropsUseFilteredValue(
            search,
            "saType",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            true
        ),
        render: (text) => text?.value || "-",
    },
    {
        key: "pjbgType",
        title: "PJBG TYPE",
        dataIndex: "pjbgType",
        width: 120,
        sorter: true,
        filteredValue: [search?.pjbgType] || null,
        ...getColumnSearchPropsUseFilteredValue(
            search,
            "pjbgType",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            true
        ),
        render: (text) => text?.value || "-",
    },
    {
        key: "saDate",
        title: "SA DATE",
        dataIndex: "saDate",
        width: 120,
        align: "center",
        sorter: true,
        filteredValue: [search?.saDate] || null,
        ...getColumnSearchPropsUseFilteredValue(
            search,
            "saDate",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            true,
            "date"
        ),
        render: (date) => date ? moment(date, "DD-MM-YYYY").format(dateFormatting.date) : "-",
    },
    {
        key: "startDate",
        title: "START DATE",
        dataIndex: "startDate",
        width: 120,
        align: "center",
        sorter: true,
        filteredValue: [search?.startDate] || null,
        ...getColumnSearchPropsUseFilteredValue(
            search,
            "startDate",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            true,
            "date"
        ),
        render: (date) => date ? moment(date, "DD-MM-YYYY").format(dateFormatting.date) : "-",
    },
    {
        key: "endDate",
        title: "END DATE",
        dataIndex: "endDate",
        width: 120,
        align: "center",
        sorter: true,
        filteredValue: [search?.endDate] || null,
        ...getColumnSearchPropsUseFilteredValue(
            search,
            "endDate",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            true,
            "date"
        ),
        render: (date) => date ? moment(date, "DD-MM-YYYY").format(dateFormatting.date) : "-",
    },
    {
        key: "commitmentDate",
        title: "COMMITMENT DATE",
        dataIndex: "commitmentDate",
        width: 150,
        align: "center",
        sorter: true,
        filteredValue: [search?.commitmentDate] || null,
        ...getColumnSearchPropsUseFilteredValue(
            search,
            "commitmentDate",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            true,
            "date"
        ),
        render: (date) => date ? moment(date, "DD-MM-YYYY").format(dateFormatting.date) : "-",
    },
    {
        key: "billingCycle",
        title: "BILLING CYCLE",
        dataIndex: "billingCycle",
        width: 130,
        sorter: true,
        filteredValue: [search?.billingCycle] || null,
        ...getColumnSearchPropsUseFilteredValue(
            search,
            "billingCycle",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            true
        ),
        render: (text) => text?.value || "-",
    },
    {
        key: "termsOfPaymentName",
        title: "TERM OF PAYMENT",
        dataIndex: "termsOfPaymentName",
        width: 150,
        align: "center",
        sorter: true,
        filteredValue: [search?.termsOfPaymentName] || null,
        ...getColumnSearchPropsUseFilteredValue(
            search,
            "termsOfPaymentName",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            true
        ),
        render: (text) => text?.value || "-",
    },
    {
        key: "invoiceTemplate",
        title: "INVOICE TEMPLATE",
        dataIndex: "invoiceTemplate",
        width: 150,
        sorter: true,
        filteredValue: [search?.invoiceTemplate] || null,
        ...getColumnSearchPropsUseFilteredValue(
            search,
            "invoiceTemplate",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            true
        ),
        render: (text) => text?.value || "-",
    },
    {
        key: "gasInPlanDate",
        title: "GAS IN PLAN DATE",
        dataIndex: "gasInPlanDate",
        width: 150,
        align: "center",
        sorter: true,
        filteredValue: [search?.gasInPlanDate] || null,
        ...getColumnSearchPropsUseFilteredValue(
            search,
            "gasInPlanDate",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            true,
            "date"
        ),
        render: (date) => date ? moment(date, "DD-MM-YYYY").format(dateFormatting.date) : "-",
    },
    {
        key: "alreadyGasIn",
        title: "ALREADY GAS IN",
        dataIndex: "alreadyGasIn",
        width: 130,
        sorter: true,
        filteredValue: [search?.alreadyGasIn] || null,
        ...getColumnSearchPropsUseFilteredValue(
            search,
            "alreadyGasIn",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            true
        ),
        render: (text) => text?.value || "No",
    },
    includeStatus && {
        key: "approvalStatus",
        title: "STATUS APPROVAL",
        dataIndex: "approvalStatus",
        width: 170,
        sorter: true,
        align: "center",
        filteredValue: [search?.approvalStatus] || null,
        ...getColumnSearchPropsUseFilteredValue(
            search,
            "approvalStatus",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            true
        ),
        render: (status) => {
            const displayText = {
                "APPROVED": "Approved",
                "WAITING APPROVAL": "Waiting Approval",
                "PENDING": "Pending",
                "REJECTED": "Rejected",
                "DRAFT": "Draft",
            };
            return (
                <div className="flex justify-center">
                    <StatusComponent colour={status?.toLowerCase()} size="small">
                        {displayText[status] || toTitleCase(String(status || "")) || "-"}
                    </StatusComponent>
                </div>
            );
        },
    },
    includeStatus && {
        key: "status",
        title: "STATUS",
        dataIndex: "status",
        width: 120,
        sorter: true,
        align: "center",
        filteredValue: [search?.status] || null,
        ...getColumnSearchPropsUseFilteredValue(
            search,
            "status",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            true
        ),
        render: (status) => {
            const displayText = {
                "ACTIVE": "Active",
                "INACTIVE": "Inactive",
                "DRAFT": "Draft",
            };
            return (
                <div className="flex justify-center">
                    <StatusComponent colour={status?.toLowerCase()} size="small">
                        {displayText[status] || toTitleCase(String(status || "")) || "-"}
                    </StatusComponent>
                </div>
            );
        },
    },
].filter(Boolean);

export { getServiceAgreementColumns };
