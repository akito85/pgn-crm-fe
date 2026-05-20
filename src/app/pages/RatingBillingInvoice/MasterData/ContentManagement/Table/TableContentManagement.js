import moment from "moment";
import {
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";

export const columnsContentManagement = (
  search,
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => { }
) => {
  return [
    {
      title: "NO",
      key: "no",
      align: "center",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "TEMPLATE CODE",
      dataIndex: "templateCode",
      sorter: true,
      width: 180,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "templateCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "templateCode",
          hasValue(search["templateCode"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "TEMPLATE NAME",
      dataIndex: "templateName",
      sorter: true,
      width: 250,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "templateName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "templateName",
          hasValue(search["templateName"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "FORMAT TYPE",
      dataIndex: "formatType",
      sorter: true,
      width: 150,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "formatType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "formatType",
          hasValue(search["formatType"]),
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
      width: 150,
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
      title: "MEDIA CHANNEL",
      dataIndex: "mediaChannel",
      sorter: true,
      width: 150,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "mediaChannel",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "mediaChannel",
          hasValue(search["mediaChannel"]),
          searchText,
          text,
          false,
          "input",
          search
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
        hasValue(search['startDate']),
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
        hasValue(search['endDate']),
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
      width: 200,
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
          false,
          "input",
          search
        ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
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