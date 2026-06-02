import {
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";

export const columnsCollectionActivities = (
  search,
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {}
) => {
  return [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: "ACTIVITIES CODE",
      dataIndex: "activitiesCode",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "activitiesCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "activitiesCode",
          hasValue(search["activitiesCode"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "ACTIVITIES NAME",
      dataIndex: "activitiesName",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "activitiesName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "activitiesName",
          hasValue(search["activitiesName"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "category",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "category",
          hasValue(search["category"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "MEDIA",
      dataIndex: "media",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "media",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "media",
          hasValue(search["media"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
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
        "dateCapital"
      ),
      render: (text) =>
        renderDateColumn(
          "startDate",
          hasValue(search["startDate"]),
          searchText,
          text,
          "date",
          search
        ),
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
        "dateCapital"
      ),
      render: (text) =>
        renderDateColumn(
          "endDate",
          hasValue(search["endDate"]),
          searchText,
          text,
          "date",
          search
        ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      align: "left",
      sorter: true,
      ellipsis: { showTitle: false },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "description",
          hasValue(search["description"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      fixed: "right",
      width: 110,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
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
          search
        );
      },
    },
    {
      title: "APPROVAL STATUS",
      dataIndex: "statusApproval",
      fixed: "right",
      width: 160,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "statusApproval",
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
        return renderColumn(
          "statusApproval",
          hasValue(search["statusApproval"]),
          searchText,
          text,
          false,
          "status",
          search
        );
      },
    },
  ];
};
