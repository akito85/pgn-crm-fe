import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Tooltip, Checkbox } from "antd";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { PRODUCT_PROMO_ROUTES } from "../../../../../routes/product_promo/pp_routes";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";

export const TablePromoView = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {}
  // handleApprovalHistory = () => {},
  // handleInactive = () => {}
) => [
  {
    title: "NO",
    width: 60,
    align: "center",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "NAME",
    dataIndex: "name",
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "name",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "name",
        hasValue(search["name"]),
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "PROMO TYPE",
    dataIndex: "typeName",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "typeName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "typeName",
        hasValue(search["typeName"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "PROMO CATEGORY",
    dataIndex: "categoryName",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "categoryName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "categoryName",
        hasValue(search["categoryName"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CRITERIA",
    dataIndex: "criterias",
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "criterias",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "criterias",
        hasValue(search["criterias"]),
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
      "date"
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
      "date"
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
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "description",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
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
    width: 160,
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
    render: (index) => {
      let text;
      switch (index) {
        case "WAITING APPROVAL":
        case "WAITING_FOR_APPROVAL":
        case "WAITING_APPROVAL":
          text = "Waiting Approval";
          break;
        default:
          text = index
            ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
            : index;
          break;
      }
      return text
        ? renderColumn(
            "status",
            hasValue(search["status"]),
            searchText,
            text,
            false,
            "status",
            search
          )
        : text;
    },
  },
  {
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    fixed: "right",
    width: 240,
    sorter: true,
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
            ? statusApproval.charAt(0).toUpperCase() +
              statusApproval.slice(1).toLowerCase()
            : statusApproval;
          break;
      }
      return text
        ? renderColumn(
            "statusApproval",
            hasValue(search["statusApproval"]),
            searchText,
            text,
            false,
            "status",
            search
          )
        : text;
    },
  },
  // {
  //   title: "ACTION",
  //   dataIndex: "action",
  //   fixed: "right",
  //   align: "center",
  //   dataIndex: "id",
  //   width: 100,
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
  //                 to={PRODUCT_PROMO_ROUTES.UPDATE_PROMO_DISCOUNT}
  //                 state={{
  //                   id: record.id,
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
  //           to={PRODUCT_PROMO_ROUTES.DETAIL_PROMO_DISCOUNT}
  //           state={{ id: record.id }}
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

export const itemsActionView = (
  handleInactive = () => {},
  handleApprovalHistory = () => {},
  handleDownload = () => {}
) => [
  {
    action: "Download",
    render: (
      <ButtonComponent
        icon={<SVGIcon name="IconButtonDownload" width={24} />}
        type="submit"
        onClick={handleDownload}
      >
        Download List
      </ButtonComponent>
    ),
  },
  {
    action: "Create",
    render: (
      <NavLink to={PRODUCT_PROMO_ROUTES.CREATE_PROMO_DISCOUNT}>
        <ButtonComponent
          icon={<SVGIcon name="IconButtonCreate" width={24} />}
          type="submit"
        >
          Create Promo
        </ButtonComponent>
      </NavLink>
    ),
  },
  //table
  {
    action: "view",
    type: "table",
    render: (record, data_length) => {
      return (
        <Tooltip title="Detail">
          <Link
            to={PRODUCT_PROMO_ROUTES.DETAIL_PROMO_DISCOUNT}
            state={{ id: record.id }}
          >
            <div className="pt-1">
              <SVGIcon name="IconDetail" width={24} />
            </div>
          </Link>
        </Tooltip>
      );
    },
  },
  {
    action: "Update",
    type: "table",
    render: (record, data_length) => {
      const isEditable =
        record.statusApproval === "DRAFT" ||
        record.statusApproval === "REJECTED" ||
        (record.status === "ACTIVE" && record.statusApproval === "APPROVED");

      const render =
        data_length > 3 ? (
          <ButtonComponent
            icon={<SVGIcon name="IconEdit" color="#0075bf" width={24} />}
            border={false}
            disabled={!isEditable}
          >
            {data_length > 3 && (
              <span className="text-black ml-3"> Update</span>
            )}
          </ButtonComponent>
        ) : (
          <Tooltip title="Update">
            <div className="pt-1">
              <SVGIcon
                name="IconEdit"
                width={24}
                color={!isEditable ? "#8D91A0" : "#ACC424"}
                className={!isEditable ? "cursor-not-allowed" : undefined}
              />
            </div>
          </Tooltip>
        );

      return isEditable ? (
        <Link
          to={PRODUCT_PROMO_ROUTES.UPDATE_PROMO_DISCOUNT}
          state={{
            id: record.id,
          }}
        >
          {render}
        </Link>
      ) : (
        render
      );
    },
  },
  {
    action: "Activate",
    type: "table",
    render: (record, data_length) => {
      const isActivateOrInactivate =
        (record.statusApproval === "APPROVED" && record.status === "ACTIVE") ||
        (record.statusApproval === "DRAFT" && record.status === "ACTIVE") ||
        (record.statusApproval === "REJECTED" && record.status === "ACTIVE");

      return data_length > 3 ? (
        <ButtonComponent
          icon={
            <Checkbox
              className="inactive-check"
              disabled={record?.status === "ACTIVE" ? false : true}
              checked={record?.status === "ACTIVE" ? false : true}
            />
          }
          border={false}
          disabled={!isActivateOrInactivate}
          onClick={() => handleInactive(record)}
        >
          <span className="text-black ml-5">
            {record?.status !== "ACTIVE" ? "Activate" : "Inactivate"}
          </span>
        </ButtonComponent>
      ) : (
        <Tooltip
          title={record?.status === "ACTIVE" ? "Inactivate" : "Activate"}
        >
          <div className="pt-1">
            <Checkbox
              className="inactive-check"
              onClick={() => handleInactive(record)}
              disabled={record?.status === "ACTIVE" ? false : true}
              checked={record?.status === "ACTIVE" ? false : true}
            />
          </div>
        </Tooltip>
      );
    },
  },
  {
    action: "History",
    type: "table",
    render: (record, data_length) => {
      return data_length > 3 ? (
        <ButtonComponent
          icon={<SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />}
          border={false}
          onClick={() => handleApprovalHistory(record?.id)}
        >
          <span className={"text-black ml-3"}>Approval History</span>
        </ButtonComponent>
      ) : (
        <Tooltip title="Approval History">
          <div className="pt-1">
            <SVGIcon
              name="IconLogHistory"
              color={"#0075bf"}
              width={24}
              onClick={() => handleApprovalHistory(record?.id)}
            />
          </div>
        </Tooltip>
      );
    },
  },
  //last placement for outside popover
];
