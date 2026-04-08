import moment from "moment";
import { getColumnSearchProps } from "../../../../../../utils/getColumnSearchProps";

export const columnsApprovalGLAccount = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
) => {
  const columnsBase = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      width: 50,
      fixed: "left",
      render: (text, record, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "GL Account",
      dataIndex: "glAccount",
      key: "glAccount",
      width: 150,
      sorter: true,
      ...getColumnSearchProps(
        "glAccount",
        searchInput,
        handleSearch,
        searchedColumn,
        searchText
      ),
    },
    {
      title: "GL Account Description",
      dataIndex: "glAccountDesc",
      key: "glAccountDesc",
      width: 250,
      sorter: true,
      ...getColumnSearchProps(
        "glAccountDesc",
        searchInput,
        handleSearch,
        searchedColumn,
        searchText
      ),
    },
    {
      title: "Description",
      dataIndex: "reference",
      key: "reference",
      width: 200,
      sorter: true,
      ...getColumnSearchProps(
        "reference",
        searchInput,
        handleSearch,
        searchedColumn,
        searchText
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 150,
      sorter: true,
      render: (text) => {
        const categoryMap = {
          GL_ACCOUNT: "GL Account",
          INACTIVE_GL_ACCOUNT: "Inactive GL Account",
        };
        return categoryMap[text] || text || "-";
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      sorter: true,
    },
    {
      title: "Approval Status",
      dataIndex: "approvalStatus",
      key: "approvalStatus",
      width: 150,
      sorter: true,
      render: (text) => {
        const statusMap = {
          WAITING_APPROVAL: "Waiting Approval",
          APPROVED: "Approved",
          REJECTED: "Rejected",
        };
        return statusMap[text] || text || "-";
      },
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 150,
      sorter: true,
      ...getColumnSearchProps(
        "createdBy",
        searchInput,
        handleSearch,
        searchedColumn,
        searchText
      ),
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      width: 180,
      sorter: true,
      render: (text) =>
        text ? moment(text).format("DD MMM YYYY HH:mm:ss") : "-",
    },
    {
      title: "Updated By",
      dataIndex: "updatedBy",
      key: "updatedBy",
      width: 150,
      sorter: true,
      ...getColumnSearchProps(
        "updatedBy",
        searchInput,
        handleSearch,
        searchedColumn,
        searchText
      ),
    },
    {
      title: "Updated Date",
      dataIndex: "updatedDate",
      key: "updatedDate",
      width: 180,
      sorter: true,
      render: (text) =>
        text ? moment(text).format("DD MMM YYYY HH:mm:ss") : "-",
    },
  ];

  return columnsBase;
};
