import { hasValue, renderColumn, renderDateColumn } from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";

export const columnsBillingCycleList = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
) => {
  return [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "BEGIN CYCLE",
      dataIndex: "beginCycle",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "beginCycle",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('beginCycle', hasValue(search['beginCycle']), searchText, text, false, 'input', search)
    },
    {
      title: "END CYCLE",
      dataIndex: "endCycle",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "endCycle",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('endCycle', hasValue(search['endCycle']), searchText, text, false, 'input', search)
    },
    {
      title: "TIME UNIT",
      dataIndex: "timeUnit",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "timeUnit",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('timeUnit', hasValue(search['timeUnit']), searchText, text, false, 'input', search)
    },
    {
      title: "INVOICE DATE",
      dataIndex: "invoiceDate",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "invoiceDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('invoiceDate', hasValue(search['invoiceDate']), searchText, text, false, 'input', search)

    },
    {
      title: "START DATE",
      sorter: true,
      align: "center",
      dataIndex: "startDate",
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
      render: (text) => renderDateColumn('startDate', hasValue(search['startDate']), searchText, text, 'date', search)

    },
    {
      title: "END DATE",
      sorter: true,
      align: "center",
      dataIndex: "endDate",
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
      render: (text) => renderDateColumn('endDate', hasValue(search['endDate']), searchText, text, 'date', search)
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      align: "left",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      ellipsis: {
        showTitle: false,
      },
      sorter: true,
      render: (text) => renderColumn('description', hasValue(search['description']), searchText, text, true, 'input', search)
    },
    {
      title: "STATUS",
      sorter: true,
      dataIndex: "status",
      fixed: "right",
      width: 150,
      key: "status",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (index) => {
        let text;
        switch (index) {
          case "WAITING_FOR_APPROVAL":
            text = "Waiting Approval";
            break;
          default:
            text = index
              ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
              : index;
            break;
        }
        return renderColumn('status', hasValue(search['status']), searchText, text, false, 'status', search)

      },
    },
    {
      title: "STATUS APPROVAL",
      sorter: true,
      dataIndex: "statusApproval",
      fixed: "right",
      width: 200,
      key: "statusApproval",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "statusApproval",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (index) => {
        let text;
        switch (index) {
          case "WAITING_FOR_APPROVAL":
            text = "Waiting Approval";
            break;
          default:
            text = index
              ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
              : index;
            break;
        }
        return renderColumn('statusApproval', hasValue(search['statusApproval']), searchText, text, false, 'status', search)
      },
    },
  ];
};
