import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import {
  getAllPricingPaginate,
  getApprovalHistory,
  getListAppHier,
  getListAppHierDetail,
  inactivePricing,
} from "../../../../redux/slices/product_promo/pricing";
import { useRef } from "react";
import { Checkbox, Tooltip } from "antd";
import { Link } from "react-router-dom";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import ModalInactivateWithHierarchy from "../../../../components/Modal/ModalInactivateWithHierarchy";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import { hasValue, renderColumn } from "../../../../utils";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";

const columns = (
  search,
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  handleApprovalHistory,
  handleOpenModalInactivate
) => {
  return [
    {
      title: "NO",
      width: 50,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "PRICE CODE",
      //width: 160,
      sorter: true,
      dataIndex: "priceCode",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "priceCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "priceCode",
          hasValue(search["priceCode"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "PRODUCT",
      //width: 240,
      sorter: true,
      dataIndex: "product",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "product",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "product",
          hasValue(search["product"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "PRICING",
      //width: 240,
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
        true
      ),
      render: (text) =>
        renderColumn(
          "pricing",
          hasValue(search["pricing"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "MAKER POSITION",
      //width: 200,
      sorter: true,
      dataIndex: "makerPosition",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "markerPosition",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "markerPosition",
          hasValue(search["markerPosition"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "CRITERIA",
      //width: 240,
      sorter: true,
      dataIndex: "criterias",
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
          true,
          "input",
          search
        ),
    },
    {
      title: "DESCRIPTION",
      //width: 180,
      sorter: true,
      dataIndex: "priceDescription",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "priceDescription",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "priceDescription",
          hasValue(search["priceDescription"]),
          searchText,
          text,
          true,
          "input",
          search
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
      width: 240,
      sorter: true,
      fixed: "right",
      dataIndex: "statusApproval",
      key: "statusApproval",
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
    //   align: "center",
    //   width: 120,
    //   fixed: "right",
    //   render: (v, r, i) => {
    //     return (
    //       <div className="flex justify-center align-middle gap-2">
    //         <Popover
    //           content={
    //             <div>
    //               {r.statusApproval !== "WAITING_FOR_APPROVAL" &&
    //               r.status !== "INACTIVE" ? (
    //                 <Link
    //                   to={PRODUCT_PROMO_ROUTES.UPDATE_PRICING}
    //                   state={{
    //                     id: r?.id,
    //                     statusPricing: r?.status,
    //                     statusApprovalPricing: r?.statusApproval,
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
    //                 </Link>
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
    //                   <Checkbox
    //                     className="inactive-check"
    //                     checked={!(r.status === "ACTIVE")}
    //                     disabled={
    //                       !(
    //                         r.status === "ACTIVE" &&
    //                         r.statusApproval !== "WAITING_FOR_APPROVAL"
    //                       )
    //                     }
    //                   />
    //                 }
    //                 border={false}
    //                 disabled={
    //                   !(
    //                     r.status === "ACTIVE" &&
    //                     r.statusApproval !== "WAITING_FOR_APPROVAL"
    //                   )
    //                 }
    //                 onClick={
    //                   r.status === "ACTIVE" &&
    //                   r.statusApproval !== "WAITING_FOR_APPROVAL"
    //                     ? () => handleOpenModalInactivate(r)
    //                     : undefined
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
    //             to={PRODUCT_PROMO_ROUTES.DETAIL_PRICING}
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
const fileName = "myFile";
const PricingTable = ({
  dispatch,
  page = 1,
  updatePage = () => {},
  pageSize = 10,
  updatePageSize = () => {},
  totalElements = 0,
  updateTotalElements = () => {},
  searchedColumn = "",
  updateSearchedColumn = () => {},
  searchText = "",
  updateSearchText = () => {},
  sort = "",
  updateSort = () => {},
  search = "",
  updateSearch = () => {},
}) => {
  const searchInput = useRef(null);
  const { dataPricing, dataApprovalHistory } = useSelector(
    (state) => state.pricing
  );
  const [dataTable, setDataTable] = useState([]);
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [openModalInactivate, setOpenModalInactivate] = useState(false);
  const [dataInactivate, setDataInactivate] = useState({});
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});

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
      getAllPricingPaginate({
        page,
        pageSize,
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
      })
    );
  }, [dispatch, page, pageSize, sort, search]);

  useEffect(() => {
    if (dataApprovalHistory && dataApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: dataApprovalHistory?.dataApprover?.PRICING || [],
          inactive: dataApprovalHistory?.dataApprover?.INACTIVE_PRICING || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.PRICING || [],
          inactive: dataApprovalHistory?.dataHistory?.INACTIVE_PRICING || [],
        },
      };
      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  useEffect(() => {
    if (dataPricing && dataPricing.result) {
      const totalData = dataPricing.page.totalElements;
      setDataTable(dataPricing.result);
      updateTotalElements(totalData || 0);
    }
  }, [dataPricing, updateTotalElements]);

  const handleApprovalHistory = (data) => {
    dispatch(getApprovalHistory(data.id));
    setOpenModalHistory(true);
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    updateSearchText(selectedKeys[0]);
    updateSearchedColumn(dataIndex);
    updateSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        updatePage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };
  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    updatePage(tempPage);
    updatePageSize(pageSizeChange);
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
      id: dataInactivate.id,
      priceCode: dataInactivate.priceCode,
      // "status": "ACTIVE",
      appHierId: res.approvalHierarchy,
      // priceDescription: "xxx test",
      remark: res.remark,
    };
    dispatch(inactivePricing({ data }))
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
          getAllPricingPaginate({
            page,
            pageSize,
            sort,
            search: encodeURIComponent(JSON.stringify(search)),
          })
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
          setBodyError({ body: { ...res }, handleClear, message });
          setModalError(true);
        }
      });
  };
  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    updateSort(dataSort);
  };
  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };
  const handleRetry = () => {
    handleSubmitModalInactivate(bodyError.body, bodyError.handleClear);
    setModalError(false);
    setBodyError({});
  };
  const handleOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const itemsActionView = (
    handleOpenModalInactivate = () => {},
    handleApprovalHistory = () => {},
  ) => [
    //table
    //last placement for outside popover
    {
      action: "view",
      type: "table",
      render: (record, data_length) => {
        return (
          <Tooltip title="Detail">
              <Link
                to={PRODUCT_PROMO_ROUTES.DETAIL_PRICING}
                state={{ id: record?.id }}
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
          to={PRODUCT_PROMO_ROUTES.UPDATE_PRICING}
          state={{
            id: record?.id,
            statusPricing: record?.status,
            statusApprovalPricing: record?.statusApproval,
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

  return (
    <Fragment>
      <TablePaginationNew
        dataSource={dataTable}
        totalData={totalElements}
        current={page}
        pageSize={pageSize}
        tableScrolled={{ y: 525, x: 2300 }}
        onChange={handleChangeSize}
        onSort={onSort}
        columns={[...columns(
          search,
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          handleApprovalHistory,
          handleOpenModalInactivate
        ), ...useColumnActionPermission(
          ["View", "Update", "Activate", "History"],
          itemsActionView(handleOpenModalInactivate, handleApprovalHistory)
        )]}
      />
      <ModalHistory
        isOpen={openModalHistory && dataApprovalHistoryFix}
        handleClose={() => setOpenModalHistory(false)}
        header={"Approval History"}
        width={850}
        tabOptions={handleOptions()}
        dataApprover={dataApprovalHistoryFix?.dataApprover}
        dataHistory={dataApprovalHistoryFix?.dataHistory}
      />
      <ModalInactivateWithHierarchy
        dispatch={dispatch}
        getAPIOption={getListAppHier}
        getAPIDetail={getListAppHierDetail}
        alertMessage={`Are you sure you want to inactivate Pricing with Price Code ${
          dataInactivate?.priceCode || ""
        }?`}
        openModalInactivate={openModalInactivate}
        handleCloseModalInactivate={handleCancelModalInactivate}
        onFinish={handleSubmitModalInactivate}
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
          <p className="pl-[70px]">{`Your data was not submitted, ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </Fragment>
  );
};

export default PricingTable;
