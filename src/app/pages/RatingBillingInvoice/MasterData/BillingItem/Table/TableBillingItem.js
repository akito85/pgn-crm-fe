import { hasValue, renderColumn, renderDateColumn } from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";

export const columns = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => { },
) => [
    {
      key: "no",
      title: "NO",
      dataIndex: "id",
      align: "center",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "billingItemCode",
      title: "BILLING ITEM CODE",
      dataIndex: "billingItemCode",
      sorter: true,
      width: 200,
      filteredValue: [search?.billingItemCode] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingItemCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('billingItemCode', hasValue(search['billingItemCode']), searchText, text, false, 'input', search)
    },
    {
      key: "billingItemCategory",
      title: "BILLING ITEM CATEGORY",
      dataIndex: "billingItemCategory",
      sorter: true,
      align: "center",
      width: 240,
      filteredValue: [search?.billingItemCategory] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingItemCategory",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('billingItemCategory', hasValue(search['billingItemCategory']), searchText, text, false, 'input', search)
    },
    {
      key: "billingItemName",
      title: "NAME",
      dataIndex: "billingItemName",
      sorter: true,
      align: "left",
      width: 240,
      filteredValue: [search?.billingItemName] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingItemName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('billingItemName', hasValue(search['billingItemName']), searchText, text, false, 'input', search)
    },
    {
      key: "billingType",
      title: "BILL TYPE",
      dataIndex: "billingType",
      sorter: true,
      align: "center",
      width: 180,
      filteredValue: [search?.billingType] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('billingType', hasValue(search['billingType']), searchText, text, false, 'input', search)
    },
    {
      key: "glAccount",
      title: "GL ACCOUNT",
      dataIndex: "glAccount",
      sorter: true,
      align: "center",
      width: 180,
      filteredValue: [search?.glAccount] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "glAccount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('glAccount', hasValue(search['glAccount']), searchText, text, false, 'input', search)
    },
    {
      key: "category",
      title: "CATEGORY",
      dataIndex: "category",
      sorter: true,
      align: "left",
      width: 200,
      filteredValue: [search?.category] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "category",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => renderColumn('category', hasValue(search['category']), searchText, text, true, 'input', search)
    },
    {
      key: "startDate",
      title: "START DATE",
      dataIndex: "startDate",
      sorter: true,
      align: "center",
      width: 180,
      filteredValue: [search?.startDate] || null,
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
      key: "endDate",
      title: "END DATE",
      dataIndex: "endDate",
      sorter: true,
      align: "center",
      width: 180,
      filteredValue: [search?.endDate] || null,
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
      key: "lateCharge",
      title: "LATE CHARGE",
      dataIndex: "lateCharge",
      sorter: true,
      align: "center",
      width: 180,
      filteredValue: [search?.lateCharge] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "lateCharge",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('lateCharge', hasValue(search['lateCharge']), searchText, text, false, 'input', search)
    },
    {
      key: "paymentWarranty",
      title: "PAYMENT WARRANTY",
      dataIndex: "paymentWarranty",
      sorter: true,
      align: "center",
      width: 200,
      filteredValue: [search?.paymentWarranty] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "paymentWarranty",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('paymentWarranty', hasValue(search['paymentWarranty']), searchText, text, false, 'input', search)
    },
    {
      key: "description",
      title: "DESCRIPTION",
      dataIndex: "description",
      align: "left",
      width: 300,
      filteredValue: [search?.description] || null,
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
      sorter: true,
      render: (text) => renderColumn('description', hasValue(search['description']), searchText, text, true, 'input', search)
    },
    {
      key: "status",
      title: "STATUS",
      dataIndex: "status",
      width: 150,
      sorter: true,
      filteredValue: [search?.status] || null,
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
          case "WAITING APPROVAL":
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
      key: "statusApproval",
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      width: 200,
      sorter: true,
      filteredValue: [search?.statusApproval] || null,
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
          case "WAITING APPROVAL":
          case "WAITING_APPROVAL":
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