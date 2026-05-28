import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../components/StatusComponent";

export const columns = (
    page = 1,
    pageSize = 10,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => { }
) => [
        {
            key: "no",
            title: "NO",
            width: 60,
            render: (text, object, index) => (page - 1) * pageSize + index + 1,
            fixed: "left",
        },
        {
            key: "paymentPlanCode",
            title: "PAYMENT PLAN CODE",
            dataIndex: "paymentPlanCode",
            width: 180,
            align: "left",
            sorter: (a, b) => a?.paymentPlanCode?.localeCompare(b?.paymentPlanCode),
            ...getColumnSearchPropsPaging(
                "paymentPlanCode",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        },
        {
            key: "customerNumber",
            title: "CUSTOMER NUMBER",
            dataIndex: "customerNumber",
            width: 180,
            align: "right",
            sorter: (a, b) => a?.customerNumber?.localeCompare(b?.customerNumber),
            ...getColumnSearchPropsPaging(
                "customerNumber",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        },
        {
            key: "customerName",
            title: "CUSTOMER NAME",
            dataIndex: "customerName",
            width: 250,
            sorter: (a, b) => a?.customerName?.localeCompare(b?.customerName),
            ...getColumnSearchPropsPaging(
                "customerName",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        },
        {
            key: "accountNumber",
            title: "ACCOUNT NUMBER",
            dataIndex: "accountNumber",
            width: 180,
            align: "right",
            sorter: (a, b) => a?.accountNumber?.localeCompare(b?.accountNumber),
        },
        {
            key: "accountName",
            title: "ACCOUNT NAME",
            dataIndex: "accountName",
            width: 250,
            align: "center",
        },
        {
            key: "sor",
            title: "SOR",
            dataIndex: "sor",
            width: 150,
            align: "center",
        },
        {
            key: "costCenter",
            title: "COST CENTER",
            dataIndex: "costCenter",
            width: 200,
            align: "center",
        },
        {
            key: "accountSegment",
            title: "ACCOUNT SEGMENT",
            dataIndex: "accountSegment",
            width: 150,
            align: "center",
        },
        {
            key: "accountGroupType",
            title: "ACCOUNT GROUP TYPE",
            dataIndex: "accountGroupType",
            width: 180,
            align: "center",
        },
        {
            key: "meterReadingCode",
            title: "METER READING CODE",
            dataIndex: "meterReadingCode",
            width: 180,
            align: "center",
        },
        {
            key: "accountType",
            title: "ACCOUNT TYPE",
            dataIndex: "accountType",
            width: 150,
            align: "center",
        },
        {
            key: "sapCustId",
            title: "SAP CUST ID",
            dataIndex: "sapCustId",
            width: 150,
            align: "center",
        },
        {
            key: "accountStatus",
            title: "ACCOUNT STATUS",
            dataIndex: "accountStatus",
            width: 150,
            align: "center",
        },
        {
            key: "customerSegment",
            title: "CUSTOMER SEGMENT",
            dataIndex: "customerSegment",
            width: 150,
            align: "center",
        },
        {
            key: "corporateCustomer",
            title: "CORPORATE CUSTOMER",
            dataIndex: "corporateCustomer",
            width: 180,
            align: "center",
        },
        {
            key: "classificationType",
            title: "CLASSIFICATION TYPE",
            dataIndex: "classificationType",
            width: 180,
            align: "center",
        },
        {
            key: "serviceAgreementNumber",
            title: "SERVICE AGREEMENT NUMBER",
            dataIndex: "serviceAgreementNumber",
            width: 220,
        },
        {
            key: "serviceAgreementName",
            title: "SERVICE AGREEMENT NAME",
            dataIndex: "serviceAgreementName",
            width: 250,
        },
        {
            key: "serviceAgreementDate",
            title: "SERVICE AGREEMENT DATE",
            dataIndex: "serviceAgreementDate",
            width: 180,
        },
        {
            key: "startDate",
            title: "START DATE",
            dataIndex: "startDate",
            width: 150,
        },
        {
            key: "endDate",
            title: "END DATE",
            dataIndex: "endDate",
            width: 150,
        },
        {
            key: "minimumContract",
            title: "MINIMUM CONTRACT",
            dataIndex: "minimumContract",
            width: 180,
        },
        {
            key: "maximumContract",
            title: "MAXIMUM CONTRACT",
            dataIndex: "maximumContract",
            width: 180,
        },
        {
            key: "uom",
            title: "UOM",
            dataIndex: "uom",
            width: 100,
        },
        {
            key: "type",
            title: "TYPE",
            dataIndex: "type",
            width: 150,
        },
        {
            key: "tenor",
            title: "TENOR",
            dataIndex: "tenor",
            width: 100,
        },
        {
            key: "startPeriod",
            title: "START PERIOD",
            dataIndex: "startPeriod",
            width: 150,
        },
        {
            key: "source",
            title: "SOURCE",
            dataIndex: "source",
            width: 150,
        },
        {
            key: "requestDate",
            title: "REQUEST DATE",
            dataIndex: "requestDate",
            width: 150,
        },
        {
            key: "description",
            title: "DESCRIPTION",
            dataIndex: "description",
            width: 250,
        },
        {
            key: "status",
            title: "STATUS",
            dataIndex: "status",
            width: 150,
            align: "center",
            fixed: "right",
            render: (text) => (
                <div className="flex justify-center w-full">
                    <StatusComponent colour={text || 'none'}>{text || ""}</StatusComponent>
                </div>
            )
        },
        {
            key: "statusCustomer",
            title: "ACCOUNT STATUS",
            dataIndex: "statusCustomer",
            width: 150,
            align: "center",
            fixed: "right",
            render: (text) => (
                <div className="flex justify-center w-full">
                    <StatusComponent colour={text || 'none'}>{text || ""}</StatusComponent>
                </div>
            )
        },
        {
            key: "statusApproval",
            title: "APPROVAL STATUS",
            dataIndex: "statusApproval",
            width: 180,
            align: "center",
            fixed: "right",
            render: (text) => (
                <div className="flex justify-center w-full">
                    <StatusComponent colour={text || 'none'}>{text || ""}</StatusComponent>
                </div>
            )
        },
    ];
