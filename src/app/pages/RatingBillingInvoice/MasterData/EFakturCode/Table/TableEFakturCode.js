import {
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";

export const columnsEFakturCode = (
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
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CODE",
      dataIndex: "efakturCode",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "efakturCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "efakturCode",
          hasValue(search["efakturCode"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "efakturName",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "efakturName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "efakturName",
          hasValue(search["efakturName"]),
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
      dataIndex: "statusApproval",
      fixed: "right",
      width: 150,
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
