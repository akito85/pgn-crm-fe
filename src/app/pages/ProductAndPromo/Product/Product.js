import React, { useEffect, useRef, useState } from "react";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { Checkbox, Popover, Spin, Switch, Tooltip } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import ButtonComponent from "../../../../components/ButtonComponent";
import { MoreOutlined } from "@ant-design/icons";
import { Link, NavLink } from "react-router-dom";
import SVGIcon from "../../../../assets/Icon/index";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Highlighter from "react-highlight-words";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import ModalInactivateWithHierarchy from "../../../../components/Modal/ModalInactivateWithHierarchy";
import StatusComponent from "../../../../components/StatusComponent";
import ModalWarningConfirmation from "../../../../components/Modal/ModalWarningConfirmation";
import {
  downloadProduct,
  getAllProductPaginate,
  inactiveProduct,
  lockProduct,
  getListAppHierInactive,
  getListAppHierDetailInactive,
  getApprovalHistoryProduct,
} from "../../../../redux/slices/product_promo/product";
import {
  getColumnSearchPropsPaging,
  getColumnSearchPropsUseFilteredValue,
} from "../../../../utils/getColumnSearchProps";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import BaseContainer from "../../../../components/BaseContainer";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import { hasValue, renderColumn, renderDateColumn } from "../../../../utils";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";

const columns = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleApprovalHistory = () => {},
  handleOpenModalInactivate = () => {},
  handleOpenModalLock = () => {},
  dataUser = {},
) => {
  return [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "LATEST VERSION",
      width: 240,
      sorter: true,
      align: "right",
      dataIndex: "lastVersion",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "lastVersion",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "lastVersion",
          hasValue(search["lastVersion"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "PRODUCT NAME",
      width: 240,
      sorter: true,
      dataIndex: "productName",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "productName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "productName",
          hasValue(search["productName"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "PRODUCT TYPE",
      width: 240,
      sorter: true,
      dataIndex: "productTypeName",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "productTypeName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "productTypeName",
          hasValue(search["productTypeName"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "SERVICE TYPE",
      width: 240,
      sorter: true,
      dataIndex: "serviceTypeName",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "serviceTypeName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "serviceTypeName",
          hasValue(search["serviceTypeName"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "PRODUCT CLASS",
      width: 240,
      sorter: true,
      dataIndex: "productClassName",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "productClassName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "productClassName",
          hasValue(search["productClassName"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "PRICING",
      width: 240,
      sorter: true,
      dataIndex: "pricing",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "pricing",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "pricing",
          hasValue(search["pricing"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "LOCKED BY",
      width: 240,
      sorter: true,
      dataIndex: "lockedBy",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "lockedBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "lockedBy",
          hasValue(search["lockedBy"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "MAKER POSITION",
      width: 240,
      sorter: true,
      dataIndex: "makerPosition",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "makerPosition",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "makerPosition",
          hasValue(search["makerPosition"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "START DATE",
      width: 200,
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
      width: 200,
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
      title: "DESCRIPTION",
      width: 320,
      sorter: true,
      dataIndex: "productDescription",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "productDescription",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "productDescription",
          hasValue(search["productDescription"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "STATUS",
      width: 160,
      sorter: true,
      fixed: "right",
      dataIndex: "status",
      key: "status",
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
              search,
            )
          : text;
      },
    },
    {
      title: "STATUS APPROVAL",
      width: 240,
      sorter: true,
      fixed: "right",
      dataIndex: "approvalStatus",
      key: "approvalStatus",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "approvalStatus",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (approvalStatus) => {
        let text;
        switch (approvalStatus) {
          case "WAITING APPROVAL":
          case "WAITING_FOR_APPROVAL":
          case "WAITING_APPROVAL":
          case "WAITING FOR APPROVAL":
            text = "Waiting Approval";
            break;
          default:
            text = approvalStatus
              ? approvalStatus.charAt(0).toUpperCase() +
                approvalStatus.slice(1).toLowerCase()
              : approvalStatus;
            break;
        }
        return text
          ? renderColumn(
              "approvalStatus",
              hasValue(search["approvalStatus"]),
              searchText,
              text,
              false,
              "status",
              search,
            )
          : text;
      },
    },
    // {
    //   title: "ACTION",
    //   align: "center",
    //   width: 120,
    //   fixed: "right",
    //   render: (v, r, i) => {
    //     const statusLock = r.lockStatus === "Y";
    //     const username = dataUser?.data?.username;
    //     return (
    //       <div className="flex justify-center align-middle gap-2">
    //         <Popover
    //           content={
    //             <div>
    //               {r.status !== "INACTIVE" &&
    //               (!r.lockedBy || r.lockedBy === username) ? (
    //                 <ButtonComponent
    //                   icon={
    //                     <Switch
    //                       className="inactive-check"
    //                       checked={statusLock}
    //                     />
    //                   }
    //                   border={false}
    //                   onClick={() => handleOpenModalLock(r)}
    //                 >
    //                   <span className={"text-black"}>
    //                     {statusLock ? "Unlock" : "Lock"}
    //                   </span>
    //                 </ButtonComponent>
    //               ) : (
    //                 <ButtonComponent
    //                   icon={
    //                     <Switch
    //                       className="inactive-check"
    //                       checked={statusLock}
    //                       disabled={true}
    //                     />
    //                   }
    //                   border={false}
    //                   disabled={true}
    //                 >
    //                   <span className={"text-black"}>
    //                     {statusLock ? "Unlock" : "Lock"}
    //                   </span>
    //                 </ButtonComponent>
    //               )}
    //               <ButtonComponent
    //                 icon={
    //                   <Checkbox
    //                     className="inactive-check"
    //                     checked={!(r.status === "ACTIVE")}
    //                     disabled={
    //                       !(
    //                         r.status === "ACTIVE" &&
    //                         r.approvalStatus !== "WAITING FOR APPROVAL"
    //                       )
    //                     }
    //                   />
    //                 }
    //                 border={false}
    //                 onClick={
    //                   r.status === "ACTIVE" &&
    //                   r.approvalStatus !== "WAITING FOR APPROVAL"
    //                     ? () => handleOpenModalInactivate(r)
    //                     : undefined
    //                 }
    //                 disabled={
    //                   !(
    //                     r.status === "ACTIVE" &&
    //                     r.approvalStatus !== "WAITING FOR APPROVAL"
    //                   )
    //                 }
    //               >
    //                 <span className={"text-black"}>
    //                   {r.status === "ACTIVE" ? "Inactivate" : "Activate"}
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
    //           <Link
    //             to={PRODUCT_PROMO_ROUTES.DETAIL_PRODUCT}
    //             state={{ id: r?.id }}
    //           >
    //             <SVGIcon name="IconDetail" width={24} />
    //           </Link>
    //         </Tooltip>
    //       </div>
    //     );
    //   },
    //   key: "action",
    // },
  ];
};
// Breadcrumbs
const routes = [
  {
    path: "",
    breadcrumbName: "Product & Promo",
  },
  {
    path: PRODUCT_PROMO_ROUTES.VIEW_PRODUCT,
    breadcrumbName: "Product",
  },
];

const itemsActionView = (
  handleOpenModalInactivate = () => {},
  handleApprovalHistory = () => {},
  handleOpenModalLock = () => {},
  handleDownload = () => {},
  dataUser = {},
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
      <NavLink
        to={PRODUCT_PROMO_ROUTES.CREATE_PRODUCT}
        state={{ prevPage: "table-product" }}
      >
        <ButtonComponent
          icon={<SVGIcon name="IconButtonCreate" width={24} />}
          type="submit"
        >
          Create Product
        </ButtonComponent>
      </NavLink>
    ),
  },
  //table
  //last placement for outside popover
  {
    action: "view",
    type: "table",
    render: (record, data_length) => {
      return (
        <Tooltip title="Detail">
          <Link
            to={PRODUCT_PROMO_ROUTES.DETAIL_PRODUCT}
            state={{ id: record?.id }}
          >
            <SVGIcon name="IconDetail" width={24} />
          </Link>
        </Tooltip>
      );
    },
  },
  {
    action: "Lock",
    type: "table",
    render: (record, data_length) => {
      const isEditable =
        record.status !== "INACTIVE" &&
        (!record.lockedBy || record.lockedBy === dataUser?.data?.username);

      return (
        <ButtonComponent
          icon={
            <Switch
              className="inactive-check"
              checked={record?.lockStatus === "Y"}
              // disabled={isEditable}
            />
          }
          border={false}
          disabled={!isEditable}
          onClick={() => handleOpenModalLock(record)}
        >
          <span className={"text-black"}>
            {record?.lockStatus === "Y" && data_length > 3 ? "Unlock" : "Lock"}
          </span>
        </ButtonComponent>
      );
    },
  },
  {
    action: "Activate",
    type: "table",
    render: (record, data_length) => {
      const isActivateOrInactivate =
        (record.approvalStatus === "APPROVED" && record.status === "ACTIVE") ||
        (record.approvalStatus === "DRAFT" && record.status === "ACTIVE") ||
        (record.approvalStatus === "REJECTED" && record.status === "ACTIVE");

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
          onClick={() => handleOpenModalInactivate(record)}
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
              onClick={() => handleOpenModalInactivate(record)}
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
];
const Product = () => {
  const dispatch = useDispatch();
  const {
    dataProduct,
    loadingProduct = false,
    dataApprovalHistoryProduct = {},
  } = useSelector((state) => state.product);
  const searchInput = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [openModalInactivate, setOpenModalInactivate] = useState(false);
  const [dataInactivate, setDataInactivate] = useState({});
  const [openModalLock, setOpenModalLock] = useState(false);
  const [dataLock, setDataLock] = useState({});
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const { data: dataUser = {} } = useSelector((state) => state.profile);

  useEffect(() => {
    // let tempSearch = "";
    // for (const dataIndex in search) {
    //   if (Object.hasOwnProperty.call(search, dataIndex)) {
    //     const tempSearchText = search[dataIndex];
    //     if (tempSearchText) {
    //       tempSearch += `${dataIndex}~${tempSearchText},`;
    //     }
    //   }
    // }
    // tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      getAllProductPaginate({
        page,
        pageSize,
        search: encodeURIComponent(JSON.stringify(search)),
        sort,
      }),
    );
  }, [dispatch, page, pageSize, search, sort]);

  useEffect(() => {
    if (dataApprovalHistoryProduct?.dataApprover) {
      const temp = {
        dataApprover:
          dataApprovalHistoryProduct?.dataApprover?.INACTIVE_PRODUCT || [],
        dataHistory:
          dataApprovalHistoryProduct?.dataHistory?.INACTIVE_PRODUCT || [],
      };
      setDataApprovalHistory(temp);
    } else {
      setDataApprovalHistory({});
    }
  }, [dataApprovalHistoryProduct]);

  useEffect(() => {
    if (dataProduct) {
      let result = dataProduct?.result || [];
      const totalData = dataProduct?.page?.totalElements || 0;
      setDataTable(result);
      setTotalElement(totalData);
    }
  }, [dataProduct]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };
  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };
  const handleApprovalHistory = (data) => {
    dispatch(getApprovalHistoryProduct(data.id));
    setOpenModalHistory(true);
  };
  const handleOpenModalInactivate = (data) => {
    setDataInactivate(data);
    setOpenModalInactivate(true);
  };
  const handleCancelModalInactivate = () => {
    setDataInactivate({});
    setOpenModalInactivate(false);
  };
  const handleSubmitModalInactivate = (res, handleClear) => {
    const data = {
      id: dataInactivate.id, //Product Id
      apphierId: res.approvalHierarchy,
      description: res.remark,
    };
    // console.log(res);
    dispatch(inactiveProduct({ data }))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancelModalInactivate();
        // let tempSearch = "";
        // for (const dataIndex in search) {
        //   if (Object.hasOwnProperty.call(search, dataIndex)) {
        //     const tempSearchText = search[dataIndex];
        //     if (tempSearchText) {
        //       tempSearch += `${dataIndex}~${tempSearchText},`;
        //     }
        //   }
        // }
        // tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
        dispatch(
          getAllProductPaginate({
            page,
            pageSize,
            sort,
            search: encodeURIComponent(JSON.stringify(search)),
          }),
        );
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          // console.log(error);
          setBodyError({
            body: { ...res },
            type: "INACTIVE",
            handleClear,
            message,
          });
          setModalError(true);
        }
      });
  };
  const handleOpenModalLock = (data) => {
    setDataLock(data);
    setOpenModalLock(true);
  };
  const handleCancelModalLock = () => {
    setDataLock({});
    setOpenModalLock(false);
  };
  const handleSubmitModalLock = (res, handleClear) => {
    const data = {
      refId: dataLock.id, //ID Product
      lockType: dataLock?.lockStatus === "Y" ? "UNLOCK" : "LOCK", //LOCK, UNLOCK
      description: res.remark,
    };
    // console.log(res, data);
    dispatch(lockProduct({ data }))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancelModalLock();
        // let tempSearch = "";
        // for (const dataIndex in search) {
        //   if (Object.hasOwnProperty.call(search, dataIndex)) {
        //     const tempSearchText = search[dataIndex];
        //     if (tempSearchText) {
        //       tempSearch += `${dataIndex}~${tempSearchText},`;
        //     }
        //   }
        // }
        // tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
        dispatch(
          getAllProductPaginate({
            page,
            pageSize,
            sort,
            search: encodeURIComponent(JSON.stringify(search)),
          }),
        );
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          // console.log(error);
          setBodyError({
            body: { ...res },
            type: data.lockType,
            handleClear,
            message,
          });
          setModalError(true);
        }
      });
  };
  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };
  const handleRetry = () => {
    switch (bodyError.type) {
      case "LOCK":
      case "UNLOCK":
        handleSubmitModalLock(bodyError.body, bodyError.handleClear);
        break;
      case "INACTIVE":
        handleSubmitModalInactivate(bodyError.body, bodyError.handleClear);
        break;
      default:
        break;
    }
    setModalError(false);
    setBodyError({});
  };

  const handleDownload = () => {
    // let tempSearch = "";
    // for (const dataIndex in search) {
    //   if (Object.hasOwnProperty.call(search, dataIndex)) {
    //     const tempSearchText = search[dataIndex];
    //     if (tempSearchText) {
    //       tempSearch += `${dataIndex}~${tempSearchText},`;
    //     }
    //   }
    // }
    // tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      downloadProduct({
        page,
        pageSize,
        search: encodeURIComponent(JSON.stringify(search)),
        sort,
      }),
    );
  };

  const renderType = () => {
    let text = "";
    if (bodyError.type) {
      switch (bodyError.type) {
        case "UNLOCK":
          text = "unlocked";
          break;
        case "LOCK":
          text = "locked";
          break;
        case "INACTIVE":
          text = "submitted";
          break;
        default:
          break;
      }
    }
    return text;
  };
  return (
    <LayoutMenu>
      <Spin
        spinning={loadingProduct || false}
        className={"w-full top-20"}
        tip={"Loading..."}
      >
        <BreadCrumb routes={routes} />
        <div className="flex flex-col w-full">
          {/* <div className="flex w-full justify-end gap-2">
            <ButtonComponent
              icon={<SVGIcon name="IconButtonDownload" width={24} />}
              type="submit"
              onClick={handleDownload}
            >
              Download List
            </ButtonComponent>
            <NavLink
              to={PRODUCT_PROMO_ROUTES.CREATE_PRODUCT}
              state={{ prevPage: "table-product" }}
            >
              <ButtonComponent
                icon={<SVGIcon name="IconButtonCreate" width={24} />}
                type="submit"
              >
                Create Product
              </ButtonComponent>
            </NavLink>
          </div> */}
          <Toolbar
            items={itemsActionView(
              handleOpenModalInactivate,
              handleApprovalHistory,
              handleOpenModalLock,
              handleDownload,
              dataUser,
            )}
          />
          <BaseContainer header={"Product List"}>
            <TablePaginationNew
              dataSource={dataTable}
              totalData={totalElements}
              current={page}
              pageSize={pageSize}
              tableScrolled={{ y: 525, x: 2300 }}
              onChange={handleChangeSize}
              onSort={onSort}
              columns={[
                ...columns(
                  search,
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch,
                  handleApprovalHistory,
                  handleOpenModalInactivate,
                  handleOpenModalLock,
                  dataUser,
                ),
                ...useColumnActionPermission(
                  ["view", "Lock", "Activate", "History"],
                  itemsActionView(
                    handleOpenModalInactivate,
                    handleApprovalHistory,
                    handleOpenModalLock,
                    handleDownload,
                    dataUser,
                  ),
                ),
              ]}
            />
          </BaseContainer>
        </div>
        <ModalHistory
          isOpen={openModalHistory && dataApprovalHistory}
          handleClose={() => setOpenModalHistory(false)}
          header={"Inactive Approval History"}
          width={850}
          dataApprover={dataApprovalHistory?.dataApprover}
          dataHistory={dataApprovalHistory?.dataHistory}
        />
        <ModalInactivateWithHierarchy
          dispatch={dispatch}
          getAPIOption={getListAppHierInactive}
          getAPIDetail={getListAppHierDetailInactive}
          selector="product"
          alertMessage={`Are you sure you want to inactivate Product named ${
            dataInactivate?.productName || ""
          }?`}
          openModalInactivate={openModalInactivate}
          handleCloseModalInactivate={handleCancelModalInactivate}
          onFinish={handleSubmitModalInactivate}
        />
        <ModalWarningConfirmation
          header={`${
            dataLock?.lockStatus === "Y" ? "Unlock" : "Lock"
          } Information`}
          alertMessage={`Are you sure you want to ${
            dataLock?.lockStatus === "Y" ? "Unlock" : "Lock"
          } Product named ${dataLock?.productName || ""}?`}
          openModal={openModalLock}
          handleClose={handleCancelModalLock}
          onFinish={handleSubmitModalLock}
        />

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
            <p className="pl-[70px]">{`Your data was not ${renderType()}, ${
              bodyError.message
            }.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </LayoutMenu>
  );
};

export default Product;
