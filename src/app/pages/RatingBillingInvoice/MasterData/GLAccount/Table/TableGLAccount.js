import {
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";

export const columnsGLAccount = (
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
      dataIndex: "no",
      align: "center",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "GL ACCOUNT NUMBER",
      dataIndex: "glAccount",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "glAccount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "glAccount",
          hasValue(search["glAccount"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "GL ACCOUNT DESCRIPTION",
      dataIndex: "glAccountDesc",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "glAccountDesc",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "glAccountDesc",
          hasValue(search["glAccountDesc"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "SPECIAL GL",
      dataIndex: "specialGlName",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "specialGlName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text, record) => {
        const specialGlName = record?.specialGlRef?.name || text;
        return renderColumn(
          "specialGlName",
          hasValue(search["specialGlName"]),
          searchText,
          specialGlName,
          false,
          "input",
          search
        );
      },
    },
    {
      title: "REFERENCE",
      dataIndex: "reference",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "reference",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "reference",
          hasValue(search["reference"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      fixed: "right",
      width: 100,
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
      title: "STATUS APPROVAL",
      dataIndex: "approvalStatus",
      fixed: "right",
      width: 150,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "approvalStatus",
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
          "approvalStatus",
          hasValue(search["approvalStatus"]),
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
