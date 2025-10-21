import { Popover, Space, Tooltip, Checkbox } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  dateFormatting,
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../../utils";
import { RBI_ROUTES } from "../../../../../../routes/rating_billing/rbi_routes";
import {
  getColumnSearchPropsPaging,
  getColumnSearchPropsUseFilteredValue,
} from "../../../../../../utils/getColumnSearchProps";
import moment from "moment";
import Highlighter from "react-highlight-words";
import SVGIcon from "../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import StatusComponent from "../../../../../../components/StatusComponent";

export const columns = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
) => [
  {
    title: "NO",
    dataIndex: "id",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "BILLING ITEM CODE",
    dataIndex: "billingItemCode",
    key: "billingItemCode",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "billingItemCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text) =>
      renderColumn(
        "billingItemCode",
        hasValue(search["billingItemCode"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "BILLING ITEM CATEGORY",
    dataIndex: "billingItemCategory",
    key: "billingItemCategory",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "billingItemCategory",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text) =>
      renderColumn(
        "billingItemCategory",
        hasValue(search["billingItemCategory"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "NAME",
    dataIndex: "billingItemName",
    key: "billingItemName",
    sorter: true,
    align: "left",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "billingItemName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text) =>
      renderColumn(
        "billingItemName",
        hasValue(search["billingItemName"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "BILL TYPE",
    dataIndex: "billingType",
    key: "billingType",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "billingType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text) =>
      renderColumn(
        "billingType",
        hasValue(search["billingType"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },

  {
    title: "GL ACCOUNT",
    dataIndex: "glAccount",
    key: "glAccount",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "glAccount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text) =>
      renderColumn(
        "glAccount",
        hasValue(search["glAccount"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "CATEGORY",
    dataIndex: "category",
    key: "category",
    sorter: true,
    align: "left",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "category",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    ellipsis: {
      showTitle: false,
    },
    render: (text) =>
      renderColumn(
        "category",
        hasValue(search["category"]),
        searchText,
        text,
        true,
        "input",
        search,
      ),
  },
  {
    title: "START DATE",
    dataIndex: "startDate",
    key: "startDate",
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
      "date",
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
    dataIndex: "endDate",
    key: "endDate",
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
      "date",
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
    title: "LATE CHARGE",
    dataIndex: "lateCharge",
    key: "lateCharge",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "lateCharge",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "PAYMENT WARRANTY",
    dataIndex: "paymentWarranty",
    key: "paymentWarranty",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "paymentWarranty",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text) =>
      renderColumn(
        "paymentWarranty",
        hasValue(search["paymentWarranty"]),
        searchText,
        text,
        false,
        "input",
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
      true,
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
      true,
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
      true,
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
  // {
  //   title: "ACTION",
  //   align: "center",
  //   width: 100,
  //   dataIndex: "id",
  //   fixed: "right",
  //   render: (id, record) => {
  //     const isEditable =
  //       record.statusApproval === "DRAFT" ||
  //       record.statusApproval === "REJECTED" ||
  //       (record.status === "ACTIVE" && record.statusApproval === "APPROVED");

  //     const isActivateOrInactivate =
  //       (record.statusApproval === "APPROVED" && record.status === "ACTIVE") ||
  //       (record.statusApproval === "DRAFT" && record.status === "ACTIVE") ||
  //       (record.statusApproval === "REJECTED" && record.status === "ACTIVE");

  //     return (
  //       <div className="flex w-full justify-center gap-4">
  //         <Popover
  //           trigger={"click"}
  //           placement="bottomRight"
  //           content={
  //             <Space direction="vertical">
  //               <Link
  //                 to={RBI_ROUTES.BILLING_ITEM_UPDATE}
  //                 state={{
  //                   id: record.billingItemCode,
  //                 }}
  //               >
  //                 <ButtonComponent
  //                   icon={
  //                     <SVGIcon name="IconEdit" color="#0075bf" width={24} />
  //                   }
  //                   border={false}
  //                   disabled={!isEditable}
  //                 >
  //                   <span className="text-black ml-3"> Update</span>
  //                 </ButtonComponent>
  //               </Link>

  //               <ButtonComponent
  //                 icon={
  //                   <Checkbox
  //                     className="inactive-check"
  //                     onClick={() => handleInactive(record)}
  //                     disabled={record.status === "ACTIVE" ? false : true}
  //                     checked={record.status === "ACTIVE" ? true : false}
  //                   />
  //                 }
  //                 border={false}
  //                 disabled={!isActivateOrInactivate}
  //                 onClick={() => handleInactive(record)}
  //               >
  //                 <span className="text-black ml-5">
  //                   {record.status !== "ACTIVE" ? "Activate" : "Inactivate"}
  //                 </span>
  //               </ButtonComponent>

  //               <ButtonComponent
  //                 icon={
  //                   <SVGIcon
  //                     name="IconLogHistory"
  //                     color={"#0075bf"}
  //                     width={24}
  //                   />
  //                 }
  //                 border={false}
  //                 onClick={() => handleApprovalHistory(id)}
  //               >
  //                 <span className={"text-black ml-3"}>Approval History</span>
  //               </ButtonComponent>
  //             </Space>
  //           }
  //         >
  //           <div className="pt-1">
  //             <MoreOutlined
  //               style={{
  //                 fontSize: "24px",
  //                 color: "#0075bf",
  //                 cursor: "pointer",
  //               }}
  //             />
  //           </div>
  //         </Popover>

  //         <Link
  //           to={RBI_ROUTES.BILLING_ITEM_DETAIL}
  //           state={{ id: record.billingItemCode }}
  //         >
  //           <Tooltip title="Detail">
  //             <div className="pt-1">
  //               <SVGIcon name="IconDetail" width={24} />
  //             </div>
  //           </Tooltip>
  //         </Link>
  //       </div>
  //     );
  //   },
  // },
];
