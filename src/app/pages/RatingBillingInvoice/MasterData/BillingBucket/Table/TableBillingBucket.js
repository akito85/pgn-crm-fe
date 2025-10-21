import {
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";

export const columnsBillingBucket = (
  search,
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
) => {
  return [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "BILLING BUCKET CODE",
      dataIndex: "billingBucketCode",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingBucketCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) =>
        renderColumn(
          "billingBucketCode",
          hasValue(search["billingBucketCode"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "NAME",
      dataIndex: "billingBucketName",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingBucketName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) =>
        renderColumn(
          "billingBucketName",
          hasValue(search["billingBucketName"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "PRIORITY PERIOD",
      dataIndex: "priorityPeriod",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "priorityPeriod",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) =>
        renderColumn(
          "priorityPeriod",
          hasValue(search["priorityPeriod"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
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
        "dateCapital",
      ),
      render: (text) =>
        renderDateColumn(
          "startDate",
          hasValue(search["startDate"]),
          searchText,
          text,
          "date",
          search,
        ),
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
        "dateCapital",
      ),
      render: (text) =>
        renderDateColumn(
          "endDate",
          hasValue(search["endDate"]),
          searchText,
          text,
          "date",
          search,
        ),
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
        handleSearch,
      ),
      ellipsis: {
        showTitle: false,
      },
      sorter: true,
      render: (text) =>
        renderColumn(
          "description",
          hasValue(search["description"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),
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
      ),
      render: (index) => {
        let text;
        switch (index) {
          case "WAITING APPROVAL":
            text = "Waiting Approval";
            break;
          default:
            text = index
              ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
              : index;
            break;
        }
        return renderColumn(
          "status",
          hasValue(search["status"]),
          searchText,
          text,
          false,
          "status",
          search,
        );
      },
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      fixed: "right",
      width: 200,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "statusApproval",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
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
        return renderColumn(
          "statusApproval",
          hasValue(search["statusApproval"]),
          searchText,
          text,
          false,
          "status",
          search,
        );
      },
    },
  ];
};
