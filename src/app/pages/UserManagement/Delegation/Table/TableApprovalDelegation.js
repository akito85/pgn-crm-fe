import {  hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../components/StatusComponent";

export const approvalDelegation = (
  filteredInfo = {},
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => { },
) => {
  return [
    {
      title: "NO",
      dataIndex: "no",
      align: "center",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "FROM",
      dataIndex: "delegateFrom",
      key: "delegateFrom",
      sorter: true,
      align: "left",
      filteredValue: [filteredInfo?.delegateFrom] || null,
      ...getColumnSearchPropsUseFilteredValue(
        filteredInfo,
        "delegateFrom",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('delegateFrom', searchedColumn, searchText, text, false, 'input', filteredInfo)
    },
    {
      title: "POSITION",
      dataIndex: "positionFromDelegator",
      key: "positionFromDelegator",
      sorter: true,
      align: "left",
      filteredValue: [filteredInfo?.positionFromDelegator] || null,
      ...getColumnSearchPropsUseFilteredValue(
        filteredInfo,
        "positionFromDelegator",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => renderColumn('positionFromDelegator', searchedColumn, searchText, text, true, 'input', filteredInfo)
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      key: "startDate",
      sorter: true,
      align: "center",
      filteredValue: [filteredInfo?.startDate] || null,
      ...getColumnSearchPropsUseFilteredValue(
        filteredInfo,
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (v) => renderDateColumn('startDate', hasValue(filteredInfo['startDate']), searchText, v, 'date', filteredInfo),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      key: "endDate",
      sorter: true,
      align: "center",
      filteredValue: [filteredInfo?.endDate] || null,
      ...getColumnSearchPropsUseFilteredValue(
        filteredInfo,
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (v) => renderDateColumn('endDate', hasValue(filteredInfo['endDate']), searchText, v, 'date', filteredInfo),
    },
    {
      title: "REQUEST REMARK",
      dataIndex: "requestRemark",
      align: "left",
      filteredValue: [filteredInfo?.requestRemark] || null,
      ...getColumnSearchPropsUseFilteredValue(
        filteredInfo,
        "requestRemark",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      ellipsis: {
        showTitle: false,
      },
      sorter: true,
      render: (text) => renderColumn('requestRemark', searchedColumn, searchText, text, true, 'input', filteredInfo)
    },
    {
      title: "APPROVAL REMARK",
      dataIndex: "approvalRemark",
      align: "left",
      filteredValue: [filteredInfo?.approvalRemark] || null,
      ...getColumnSearchPropsUseFilteredValue(
        filteredInfo,
        "approvalRemark",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      ellipsis: {
        showTitle: false,
      },
      sorter: true,
      render: (text) => renderColumn('approvalRemark', searchedColumn, searchText, text, true, 'input', filteredInfo)
    },
    {
      title: "STATUS",
      dataIndex: "status",
      sorter: true,
      fixed: "right",
      width: 160,
      filteredValue: [filteredInfo?.status] || null,
      ...getColumnSearchPropsUseFilteredValue(
        filteredInfo,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (index) => {
        let text;
        switch (index) {
          case "WAITING_APPROVAL":
            text = "Waiting Approval";
            break;
          default:
            text = index
              ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
              : index;
            break;
        }
        return text ? (
          <div className={"flex justify-center"}>
            <StatusComponent colour={text}>{text}</StatusComponent>
          </div>
        ) : (
          text
        );
      },
    },
  ]
};
