
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../../utils";

export const GeneralTemplateTableView = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => { },
  handleApprovalHistory = () => { },
  handleOpenModalInactivate = () => { }
) => [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "NAME",
      dataIndex: "templateName",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "templateName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('templateName', hasValue(search['templateName']), searchText, text, false, 'input', search)
    },
    {
      title: "TEMPLATE TYPE",
      dataIndex: "templateType",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "templateType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('templateType', hasValue(search['templateType']), searchText, text, false, 'input', search)
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      sorter: true,
      align: "center",
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
      dataIndex: "endDate",
      sorter: true,
      align: "center",
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
      sorter: true,
      align: "left",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => renderColumn('description', hasValue(search['description']), searchText, text, true, 'input', search)
    },
    {
      title: "STATUS",
      dataIndex: "status",
      fixed: "right",
      width: 150,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('status', hasValue(search['status']), searchText, text, false, 'status', search)
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      sorter: true,
      fixed: "right",
      width: 200,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "statusApproval",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (statusApproval) => {
        let text;
        switch (statusApproval) {
          case "WAITING APPROVAL":
          case "WAITING_FOR_APPROVAL":
          case "WAITING_APPROVAL":
            text = "Waiting Approval";
            break;
          default:
            text = statusApproval
              ? statusApproval.charAt(0).toUpperCase() + statusApproval.slice(1).toLowerCase()
              : statusApproval;
            break;
        }
        return renderColumn('statusApproval', hasValue(search['statusApproval']), searchText, text, false, 'status', search)
      }
    },
  ];


export default GeneralTemplateTableView;
