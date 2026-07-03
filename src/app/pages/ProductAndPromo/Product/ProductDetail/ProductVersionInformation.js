import React, { useEffect, useRef, useState } from "react";
import BaseContainer from "../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import { Form, Tooltip } from "antd";
import StatusComponent from "../../../../../components/StatusComponent";
import { PRODUCT_PROMO_ROUTES } from "../../../../../routes/product_promo/pp_routes";
import moment from "moment";
import { Link, NavLink } from "react-router-dom";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../utils/getColumnSearchProps";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import ModalExtendTerminate from "./ModalExtendTerminate";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import {
  extendProductVersion,
  getApprovalHistoryProductVersion,
  getDetailProduct,
  getLockHistory,
  getProductVersionList,
  releaseProduct,
  terminateProductVersion,
} from "../../../../../redux/slices/product_promo/product";
import { useDispatch, useSelector } from "react-redux";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import ToolbarDynamic from "../../UtilsProduct/ToolbarDynamic";
import { useColumnActionPermissionDynamic } from "../../UtilsProduct/useColumnActionPermissionDynamic";
import NxTable from "../../../../../components/Nx/NxTable";
import NxCardContainer from "../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer";

const onFilter = (dataIndex, value, record) => {
  const search = value.toLowerCase();
  return record[dataIndex]?.toLowerCase().includes(search);
};

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    return obj[fieldSort]?.toString().toLowerCase();
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);
  return fa.localeCompare(fb);
};

const columns = ({
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn = "",
  searchText = "",
  handleSearch = () => {},
  search,
  editableProduct = true,
  updateActiveProduct = () => {},
  handleExtendTerminate = () => {},
  handleRelease = () => {},
  handleApprovalHistory = () => {},
  idProduct = 0,
}) => {
  const result = [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "VERSION",
      key: "version",
      width: 240,
      align: "right",
      dataIndex: "version",
      filteredValue: search?.["version"] ? [search?.["version"]] : null,
      // onFilter: (value, record) => onFilter("version", value, record),
      sorter: (a, b) => sorter("version", a, b),
      // ...getColumnSearchProps(
      //   "version",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "version",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "version",
          hasValue(search["version"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "START DATE",
      key: "startDate",
      width: 240,
      align: "center",
      dataIndex: "startDate",
      filteredValue: search?.["startDate"] ? [search?.["startDate"]] : null,
      // onFilter: (value, record) => onFilter("startDate", value, record),
      sorter: (a, b) => sorter("startDate", a, b),
      // ...getColumnSearchProps(
      //   "startDate",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
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
          search
        ),
    },
    {
      title: "END DATE",
      key: "endDate",
      width: 240,
      align: "center",
      dataIndex: "endDate",
      filteredValue: search?.["endDate"] ? [search?.["endDate"]] : null,
      // onFilter: (value, record) => onFilter("endDate", value, record),
      sorter: (a, b) => sorter("endDate", a, b),
      // ...getColumnSearchProps(
      //   "endDate",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
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
          search
        ),
    },
    {
      title: "RELEASE DATE",
      key: "releaseDate",
      width: 240,
      align: "center",
      dataIndex: "releaseDate",    
      filteredValue: search?.["releaseDate"] ? [search?.["releaseDate"]] : null,
      // onFilter: (value, record) => onFilter("releaseDate", value, record),
      sorter: (a, b) => sorter("releaseDate", a, b),
      // ...getColumnSearchProps(
      //   "releaseDate",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "releaseDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) =>
        renderDateColumn(
          "releaseDate",
          hasValue(search["releaseDate"]),
          searchText,
          text,
          "date",
          search
        ),
    },
    {
      title: "DESCRIPTION",
      key: "description",
      width: 240,
      dataIndex: "description",
      filteredValue: search?.["description"] ? [search?.["description"]] : null,
      // onFilter: (value, record) => onFilter("description", value, record),
      sorter: (a, b) => sorter("description", a, b),
      // ...getColumnSearchProps(
      //   "description",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input"
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
      // render: (text) => {
      //   if (searchedColumn === "description") {
      //     return (
      //       <Tooltip placement="topLeft" title={text}>
      //         <Highlighter
      //           highlightStyle={{
      //             backgroundColor: "#ffc069",
      //             padding: 0,
      //           }}
      //           searchWords={[searchText]}
      //           autoEscape
      //           textToHighlight={text ? text.toString() : ""}
      //         />
      //       </Tooltip>
      //     );
      //   } else {
      //     if (text) {
      //       return (
      //         <Tooltip placement="topLeft" title={text}>
      //           {text}
      //         </Tooltip>
      //       );
      //     }
      //     return "";
      //   }
      // },
    },
    {
      title: "STATUS",
      key: "status",
      width: 240,
      dataIndex: "status",
      fixed: "right",
      filteredValue: search?.["status"] ? [search?.["status"]] : null,
      // onFilter: (value, record) => onFilter("status", value, record),
      sorter: (a, b) => sorter("status", a, b),
      key: "status",
      // ...getColumnSearchProps(
      //   "status",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input"
      ),
      render: (index) => {
        let text;
        switch (index) {
          case "WAITING_FOR_APPROVAL":
          case "WAITING FOR APPROVAL":
            text = "Waiting Approval";
            break;
          case "WAITING_FOR_RELEASE":
          case "WAITING FOR RELEASE":
            text = "Waiting to Release";
            break;
          default:
            text = index
              ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
              : index;
            break;
        }
        return text ? (
          <div className={" flex justify-center"}>
            <StatusComponent colour={text}>{text}</StatusComponent>
          </div>
        ) : (
          text
        );
      },
    },
    {
      title: "STATUS APPROVAL",
      key: "approvalStatus",
      width: 240,
      dataIndex: "approvalStatus",
      fixed: "right",
      filteredValue: search?.["approvalStatus"] ? [search?.["approvalStatus"]] : null,
      // onFilter: (value, record) => onFilter("approvalStatus", value, record),
      sorter: (a, b) => sorter("approvalStatus", a, b),
      key: "approvalStatus",
      // ...getColumnSearchProps(
      //   "approvalStatus",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "approvalStatus",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input"
      ),
      render: (index) => {
        let text;
        switch (index) {
          case "WAITING_FOR_APPROVAL":
          case "WAITING FOR APPROVAL":
            text = "Waiting Approval";
            break;
          case "WAITING_FOR_RELEASE":
          case "WAITING FOR RELEASE":
            text = "Waiting to Release";
            break;
          default:
            text = index
              ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
              : index;
            break;
        }
        return text ? (
          <div className={" flex justify-center"}>
            <StatusComponent colour={text}>{text}</StatusComponent>
          </div>
        ) : (
          text
        );
      },
    },
    // {
    //   title: "ACTION",
    //   width: 120,
    //   align: "center",
    //   fixed: "right",
    //   render: (v, r, i) => {
    //     return (
    //       <div className="flex justify-center align-middle gap-2">
    //         <Popover
    //           content={
    //             <div>
    //               {r.status === "DRAFT" &&
    //               (r.approvalStatus === "DRAFT" ||
    //                 r.approvalStatus === "REJECTED") &&
    //               editableProduct ? (
    //                 <NavLink
    //                   to={PRODUCT_PROMO_ROUTES.UPDATE_PRODUCT}
    //                   state={{
    //                     prevPage: "detail-product",
    //                     id: r.id,
    //                     idParent: idProduct,
    //                   }}
    //                 >
    //                   <ButtonComponent
    //                     icon={
    //                       <SVGIcon
    //                         name="IconEdit"
    //                         color={"#0075bf"}
    //                         width={24}
    //                       />
    //                     }
    //                     border={false}
    //                   >
    //                     <span className={"text-black"}>Update</span>
    //                   </ButtonComponent>
    //                 </NavLink>
    //               ) : (
    //                 <ButtonComponent
    //                   icon={
    //                     <SVGIcon name="IconEdit" color={"#8D91A0"} width={24} />
    //                   }
    //                   border={false}
    //                   disabled={true}
    //                 >
    //                   <span className={"text-black"}>Update</span>
    //                 </ButtonComponent>
    //               )}
    //               <ButtonComponent
    //                 icon={
    //                   <SVGIcon
    //                     name="IconExtend"
    //                     width={24}
    //                     color={
    //                       r.status === "ACTIVE" &&
    //                       r.approvalStatus !== "WAITING FOR APPROVAL" &&
    //                       editableProduct
    //                         ? "#0075BF"
    //                         : "#8D91A0"
    //                     }
    //                   />
    //                 }
    //                 border={false}
    //                 onClick={
    //                   r.status === "ACTIVE" &&
    //                   r.approvalStatus !== "WAITING FOR APPROVAL" &&
    //                   editableProduct
    //                     ? () => handleExtendTerminate(r, "extend")
    //                     : undefined
    //                 }
    //                 disabled={
    //                   !(
    //                     r.status === "ACTIVE" &&
    //                     r.approvalStatus !== "WAITING FOR APPROVAL" &&
    //                     editableProduct
    //                   )
    //                 }
    //               >
    //                 <span className={"text-black"}>Extend</span>
    //               </ButtonComponent>
    //               <ButtonComponent
    //                 icon={
    //                   <SVGIcon
    //                     name="IconTerminate"
    //                     width={24}
    //                     color={
    //                       ((r.status === "ACTIVE" &&
    //                         r.approvalStatus !== "WAITING FOR APPROVAL") ||
    //                         r.status === "WAITING FOR RELEASE") &&
    //                       editableProduct
    //                         ? "#0075BF"
    //                         : "#8D91A0"
    //                     }
    //                   />
    //                 }
    //                 border={false}
    //                 onClick={
    //                   ((r.status === "ACTIVE" &&
    //                     r.approvalStatus !== "WAITING FOR APPROVAL") ||
    //                     r.status === "WAITING FOR RELEASE") &&
    //                   editableProduct
    //                     ? () => handleExtendTerminate(r, "terminate")
    //                     : undefined
    //                 }
    //                 disabled={
    //                   !(
    //                     ((r.status === "ACTIVE" &&
    //                       r.approvalStatus !== "WAITING FOR APPROVAL") ||
    //                       r.status === "WAITING FOR RELEASE") &&
    //                     editableProduct
    //                   )
    //                 }
    //               >
    //                 <span className={"text-black"}>Terminate</span>
    //               </ButtonComponent>
    //               <ButtonComponent
    //                 icon={
    //                   <SVGIcon
    //                     name="IconReleaseApprover"
    //                     color={
    //                       r.status === "WAITING FOR RELEASE" && editableProduct
    //                         ? "#0075bf"
    //                         : "#8D91A0"
    //                     }
    //                     width={24}
    //                   />
    //                 }
    //                 border={false}
    //                 onClick={
    //                   r.status === "WAITING FOR RELEASE" && editableProduct
    //                     ? () => handleRelease(r)
    //                     : undefined
    //                 }
    //                 disabled={
    //                   !(r.status === "WAITING FOR RELEASE" && editableProduct)
    //                 }
    //               >
    //                 <span className={"text-black"}>Release</span>
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
    //                 onClick={() => handleApprovalHistory(r)}
    //               >
    //                 <span className={"text-black"}>Approval History</span>
    //               </ButtonComponent>
    //             </div>
    //           }
    //           trigger={"click"}
    //           placement="bottomRight"
    //         >
    //           <ButtonComponent icon={<MoreOutlined />} border={false} />
    //         </Popover>

    //         <Tooltip title="Detail">
    //           <div onClick={() => updateActiveProduct(r)}>
    //             <SVGIcon name="IconDetail" width={24} />
    //           </div>
    //         </Tooltip>
    //       </div>
    //     );
    //   },
    //   key: "action",
    // },
  ];

  return result;
};

const itemsActionView = (
  idProduct,
  editableProduct,
  dataTable,
  handleCreate = () => {},
  updateActiveProduct = () => {},
  handleExtendTerminate = () => {},
  handleRelease = () => {},
  handleApprovalHistory = () => {},
) => [
  {
    action: "Create",
    render: (
      <NavLink
      to={PRODUCT_PROMO_ROUTES.CREATE_PRODUCT}
      state={{ prevPage: "detail-product", idParent: idProduct }}
    >
      <ButtonComponent
        icon={<SVGIcon name="IconButtonCreate" width={24} />}
        type="submit"
        disabled={
          !editableProduct ||
          dataTable.some(
            (item) =>
              item.status === "DRAFT" ||
              item.status === "WAITING FOR RELEASE"
          )
        }
        onClick={handleCreate}
      >
        Create
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
          <div onClick={() => updateActiveProduct(record)}>
            <SVGIcon name="IconDetail" width={24} />
          </div>
        </Tooltip>
      );
    },
  },
  {
    action: "Update",
    type: "table",
    render: (record, data_length) => {
      const isEditable =
        record.status === "DRAFT" &&
        (record.approvalStatus === "DRAFT" ||
          record.approvalStatus === "REJECTED") &&
        editableProduct;

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
          to={PRODUCT_PROMO_ROUTES.UPDATE_PRODUCT}
          state={{
            prevPage: "detail-product",
            id: record.id,
            idParent: idProduct,
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
    action: "Extend",
    type: "table",
    render: (record, data_length) => {
      
      return data_length > 3 ? (
        <ButtonComponent
          icon={
            <SVGIcon
              name="IconExtend"
              width={24}
              color={
                record.status === "ACTIVE" &&
                record.approvalStatus !== "WAITING FOR APPROVAL" &&
                editableProduct
                  ? "#0075BF"
                  : "#8D91A0"
              }
            />
          }
          border={false}
          onClick={
            record.status === "ACTIVE" &&
            record.approvalStatus !== "WAITING FOR APPROVAL" &&
            editableProduct
              ? () => handleExtendTerminate(record, "extend")
              : undefined
          }
          disabled={
            !(
              record.status === "ACTIVE" &&
              record.approvalStatus !== "WAITING FOR APPROVAL" &&
              editableProduct
            )
          }
        >
          <span className={"text-black ml-3"}>Extend</span>
        </ButtonComponent>
      ) : (
        <Tooltip
          title={"Extend"}
        >
          <div className="pt-1">
            <SVGIcon
              name="IconExtend"
              width={24}
              onClick={() =>
                record.status === "ACTIVE" &&
                record.approvalStatus !== "WAITING FOR APPROVAL" &&
                editableProduct
                  ? handleExtendTerminate(record, "extend")
                  : undefined
              }
              className={
                !(record.status === "ACTIVE" &&
                record.approvalStatus !== "WAITING FOR APPROVAL" &&
                editableProduct)
                  ? "cursor-not-allowed"
                  : undefined
              }
              color={
                record.status === "ACTIVE" &&
                record.approvalStatus !== "WAITING FOR APPROVAL" &&
                editableProduct
                  ? "#0075BF"
                  : "#8D91A0"
              }
            />
          </div>
        </Tooltip>
      );
    },
  },
  {
    action: "Terminate",
    type: "table",
    render: (record, data_length) => {
      
      return data_length > 3 ? (
        <ButtonComponent
          icon={
            <SVGIcon
              name="IconTerminate"
              width={24}
              color={
                ((record.status === "ACTIVE" &&
                  record.approvalStatus !== "WAITING FOR APPROVAL") ||
                  record.status === "WAITING FOR RELEASE") &&
                editableProduct
                  ? "#0075BF"
                  : "#8D91A0"
              }
            />
          }
          border={false}
          onClick={
            ((record.status === "ACTIVE" &&
              record.approvalStatus !== "WAITING FOR APPROVAL") ||
              record.status === "WAITING FOR RELEASE") &&
            editableProduct
              ? () => handleExtendTerminate(record, "terminate")
              : undefined
          }
          disabled={
            !(
              ((record.status === "ACTIVE" &&
                record.approvalStatus !== "WAITING FOR APPROVAL") ||
                record.status === "WAITING FOR RELEASE") &&
              editableProduct
            )
          }
        >
          <span className={"text-black ml-3"}>Terminate</span>
        </ButtonComponent>
      ) : (
        <Tooltip title={"Terminate"}>
          <div className="pt-1">
            <SVGIcon
              name="IconTerminate"
              width={24}
              onClick={() =>
                ((record.status === "ACTIVE" &&
                  record.approvalStatus !== "WAITING FOR APPROVAL") ||
                  record.status === "WAITING FOR RELEASE") &&
                editableProduct
                  ? () => handleExtendTerminate(record, "terminate")
                  : undefined
              }
              className={
                !(
                  (record.status === "ACTIVE" &&
                    record.approvalStatus !== "WAITING FOR APPROVAL") ||
                  record.status === "WAITING FOR RELEASE"
                ) && editableProduct
                  ? "cursor-not-allowed"
                  : undefined
              }
              color={
                ((record.status === "ACTIVE" &&
                  record.approvalStatus !== "WAITING FOR APPROVAL") ||
                  record.status === "WAITING FOR RELEASE") &&
                editableProduct
                  ? "#0075BF"
                  : "#8D91A0"
              }
            />
          </div>
        </Tooltip>
      );
    },
  },
  {
    action: "Release",
    type: "table",
    render: (record, data_length) => {
      
      return data_length > 3 ? (
        <ButtonComponent
          icon={
            <SVGIcon
              name="IconReleaseApprover"
              color={
                record.status === "WAITING FOR RELEASE" && editableProduct
                  ? "#0075bf"
                  : "#8D91A0"
              }
              width={24}
            />
          }
          border={false}
          onClick={
            record.status === "WAITING FOR RELEASE" && editableProduct
              ? () => handleRelease(record)
              : undefined
          }
          disabled={
            !(record.status === "WAITING FOR RELEASE" && editableProduct)
          }
        >
          <span className={"text-black ml-3"}>Release</span>
        </ButtonComponent>
      ) : (
        <Tooltip title={"Release"}>
          <div className="pt-1">
            <SVGIcon
              name="IconReleaseApprover"
              width={24}
              onClick={() =>
                (record.status === "WAITING FOR RELEASE" && editableProduct)
                  ? () => handleExtendTerminate(record, "terminate")
                  : undefined
              }
              className={
                !(record.status === "WAITING FOR RELEASE" && editableProduct)
                  ? "cursor-not-allowed"
                  : undefined
              }
              color={
                record.status === "WAITING FOR RELEASE" && editableProduct
                  ? "#0075bf"
                  : "#8D91A0"
              }
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
          icon={
            <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
          }
          border={false}
          onClick={() => handleApprovalHistory(record)}
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
              onClick={() => handleApprovalHistory(record)}
            />
          </div>
        </Tooltip>
      );
    },
  },
  //last placement for outside popover
];
const ProductVersionInformation = ({
  idProduct = 0,
  editableProduct = true,
  dataProductVersion = [],
  dataProductInfo = {},
  updateActiveProduct = () => {},
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const searchInput = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [dataSelected, setDataSelected] = useState({});
  const [modalRelease, setModalRelease] = useState(false);
  const [modalExtendTerminate, setModalExtendTerminate] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [remark, setRemark] = useState("");
  const [extendOrTerminate, setExtendOrTerminate] = useState("extend");
  const [loadingRelease, setLoadingRelease] = useState(false);
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const { dataApprovalHistoryProductVersion } = useSelector(
    (state) => state.product
  );
  const [search, setSearch] = useState({});

  const { data: dataUser = {} } = useSelector((state) => state.profile);
  
  useEffect(() => {
    if (dataApprovalHistoryProductVersion?.dataApprover) {
      const temp = {
        dataApprover: {
          create:
            dataApprovalHistoryProductVersion?.dataApprover?.PRODUCT_VERSION ||
            [],
          extend:
            dataApprovalHistoryProductVersion?.dataApprover
              ?.EXTEND_PRODUCT_VERSION || [],
          terminate:
            dataApprovalHistoryProductVersion?.dataApprover
              ?.TERMINATE_PRODUCT_VERSION || [],
        },
        dataHistory: {
          create:
            dataApprovalHistoryProductVersion?.dataHistory?.PRODUCT_VERSION ||
            [],
          extend:
            dataApprovalHistoryProductVersion?.dataHistory
              ?.EXTEND_PRODUCT_VERSION || [],
          terminate:
            dataApprovalHistoryProductVersion?.dataHistory
              ?.TERMINATE_PRODUCT_VERSION || [],
        },
      };
      setDataApprovalHistory(temp);
    } else {
      setDataApprovalHistory({});
    }
  }, [dataApprovalHistoryProductVersion]);

  useEffect(() => {
    setDataTable(
      dataProductVersion.map((item) => ({
        ...item,
        startDate: item.startDate
          ? moment(item.startDate).format("DD MMM YYYY")
          : "",
        endDate: item.endDate ? moment(item.endDate).format("DD MMM YYYY") : "",
        releaseDate: item.releaseDate
          ? moment(item.releaseDate).format("DD MMM YYYY")
          : "",
      }))
    );
    setTotalElement(dataProductVersion.length);
  }, [dataProductVersion]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      // if (prevState[dataIndex] !== selectedKeys[0]) {
      //   setPage(1);
      // }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    })
  };
  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };
  const handleApprovalHistory = (data) => {
    dispatch(getApprovalHistoryProductVersion(data.id));
    setOpenModalHistory(true);
  };
  const handleCreate = () => {};
  const handleRelease = (record) => {
    setDataSelected(record);
    setModalRelease(true);
  };
  const handleExtendTerminate = (record, type) => {
    setDataSelected(record);
    setExtendOrTerminate(type);
    setModalExtendTerminate(true);
  };
  const handleCloseModalExtendTerminate = (handleClear) => {
    handleClear();
    setDataSelected({});
    setModalExtendTerminate(false);
  };
  const handleCloseModalRelease = () => {
    // Guard against closing while the release request is still in flight.
    if (loadingRelease) return;
    setRemark("");
    setDataSelected({});
    setModalRelease(false);
  };
  const handleConfirmRelease = (formValue, handleClear) => {
    const data = {
      productVersionId: dataSelected.id || 0, //Product Version Id
      description: formValue.remark,
    };
    setLoadingRelease(true);
    return dispatch(releaseProduct({ data }))
      .unwrap()
      .then(() => {
        handleClear();
        setRemark("");
        setDataSelected({});
        setModalRelease(false);
        dispatch(getProductVersionList({ id: idProduct }));
        dispatch(getDetailProduct({ id: idProduct }));
        dispatch(getLockHistory({ id: idProduct }));
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setBodyError({
            body: { ...formValue },
            type: "release",
            handleClear,
            message,
          });
          setModalError(true);
        }
      })
      .finally(() => {
        setLoadingRelease(false);
      });
  };
  const handleConfirmExtendTerminate = (res, handleClear) => {
    const data = {
      id: dataSelected.id || 0, //Product Version Id
      endDate: res.endDate.format("YYYY-MM-DD"),
      apphierId: res.approvalHierarchy,
      description: res.remark,
    };
    if (extendOrTerminate === "extend") {
      dispatch(extendProductVersion({ data }))
        .unwrap()
        .then(() => {
          handleCloseModalExtendTerminate(handleClear);
          dispatch(getProductVersionList({ id: idProduct }));
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            setBodyError({
              body: { ...res },
              type: "extend",
              handleClear,
              message,
            });
            setModalError(true);
          }
        });
    } else {
      dispatch(terminateProductVersion({ data }))
        .unwrap()
        .then(() => {
          handleCloseModalExtendTerminate(handleClear);
          dispatch(getProductVersionList({ id: idProduct }));
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            setBodyError({
              body: { ...res },
              type: "terminate",
              handleClear,
              message,
            });
            setModalError(true);
          }
        });
    }
  };
  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };
  const handleRetry = () => {
    if (bodyError.type) {
      switch (bodyError.type) {
        case "release":
          handleConfirmRelease(bodyError.body, bodyError.handleClear);
          break;
        case "extend":
        case "terminate":
          handleConfirmExtendTerminate(bodyError.body, bodyError.handleClear);
          break;
        default:
          break;
      }
      setModalError(false);
      setBodyError({});
    }
  };

  const handleOptions = () => {
    const data = dataApprovalHistory?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };
  // console.log(dataTable, "dataTable")
  return (
    <NxCardContainer header={"PRODUCT VERSION INFORMATION"}>
      {/* <NxBaseContainer border> */}
        <div className="flex flex-col w-full gap-3">
          {/* <div className="flex w-full justify-end">
            <NavLink
              to={PRODUCT_PROMO_ROUTES.CREATE_PRODUCT}
              state={{ prevPage: "detail-product", idParent: idProduct }}
            >
              <ButtonComponent
                icon={<SVGIcon name="IconButtonCreate" width={24} />}
                type="submit"
                disabled={
                  !editableProduct ||
                  dataTable.some(
                    (item) =>
                      item.status === "DRAFT" ||
                      item.status === "WAITING FOR RELEASE"
                  )
                }
                onClick={handleCreate}
              >
                Create
              </ButtonComponent>
            </NavLink>
          </div> */}
          <ToolbarDynamic
            items={itemsActionView(
              idProduct,
              editableProduct,
              dataTable,
              handleCreate,
              updateActiveProduct,
              handleExtendTerminate,
              handleRelease,
              handleApprovalHistory
            )}
            selector={"product"}
            url={"/product-promo/detail-product"}
          />
          <NxTable
            idTable={"product-version-information"}
            userId={dataUser?.data?.username}
            type="FE"
            dataSource={dataTable}
            totalData={totalElements}
            current={page}
            showAdvanceSearch={false}
            showSearchBar={false}
            usePagination={false}
            useInfiniteScroll={true}
            pageSize={pageSize}
            tableScrolled={{ y: 525, x: 2300 }}
            onChange={handleChangeSize}
            columns={[
              ...columns({
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                search,
                editableProduct,
                updateActiveProduct,
                handleExtendTerminate,
                handleRelease,
                handleApprovalHistory,
                idProduct,
              }),
              ...useColumnActionPermissionDynamic(
                "/product-promo/detail-product",
                "product",
                ["Update", "Extend", "Terminate", "Release", "History", "View"],
                itemsActionView(
                  idProduct,
                  editableProduct,
                  dataTable,
                  handleCreate,
                  updateActiveProduct,
                  handleExtendTerminate,
                  handleRelease,
                  handleApprovalHistory
                ),
                "view"
              ),
            ]}
          />
        </div>
        {/* Modal Release */}
        <ModalApproveOrReject
          isOpen={modalRelease}
          handleCloseModal={handleCloseModalRelease}
          onFinish={handleConfirmRelease}
          header={`Release Information`}
          approveOrReject={"Release"}
          menu={"Product Version"}
          named={`Product Version ${dataSelected?.version}`}
          loading={loadingRelease}
          // isOpen={modalRelease}
          // header={`Release Information`}
          // message={`Are you sure you want to release this Product Version?`}
          // width={1000}
          // handleCancel={handleCloseModalRelease}
          // footer={
          //   <div className={"w-full flex justify-end gap-5"}>
          //     <ButtonComponent type={"default"} onClick={handleCloseModalRelease}>
          //       Cancel
          //     </ButtonComponent>
          //     <ButtonComponent
          //       form={"formRelease"}
          //       type={"submit"}
          //       htmlType={"submit"}
          //       border={false}
          //     >
          //       Confirm
          //     </ButtonComponent>
          //   </div>
          // }
        />
        {/* <Form name="formRelease" form={form} onFinish={handleConfirmRelease}>
            <Form.Item
              name={"remark"}
              rules={[{ message: requiredMessage("Remark"), required: true }]}
            >
              <InputComponent
                rows={1}
                placeholder="Type your remark"
                type="textarea"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </Form.Item>
          </Form>
        </ModalApproveOrReject> */}

        {/** Modal Extend Terminate */}
        <ModalExtendTerminate
          type={extendOrTerminate}
          header={`${
            extendOrTerminate === "extend" ? "Extend" : "Terminate"
          } Information`}
          handleCloseModal={handleCloseModalExtendTerminate}
          handleSubmit={handleConfirmExtendTerminate}
          openModalExtendTerminate={modalExtendTerminate}
          selectedProduct={dataSelected}
          objProductVersion={dataProductInfo}
        />

        <ModalHistory
          isOpen={openModalHistory && dataApprovalHistory}
          handleClose={() => setOpenModalHistory(false)}
          header={"Approval History"}
          width={850}
          tabOptions={handleOptions()}
          dataApprover={dataApprovalHistory?.dataApprover}
          dataHistory={dataApprovalHistory?.dataHistory}
        />

        {/** Modal Retry */}
        <ModalError
          isOpen={modalError}
          handleOk={handleRetry}
          handleCancel={handleCloseModalError}
          customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your data was not ${
              bodyError.type === "release" ? "released" : "submitted"
            }. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      {/* </NxBaseContainer> */}
    </NxCardContainer>
  );
};

export default ProductVersionInformation;
