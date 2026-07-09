import { MoreOutlined } from "@ant-design/icons";
import { Checkbox, Popover, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";
import StatusComponent from "../../../../../components/StatusComponent";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import { Fragment } from "react";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import ModalInactivateWithHierarchy from "../../../../../components/Modal/ModalInactivateWithHierarchy";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import { useDispatch, useSelector } from "react-redux";
import {
  getApprovalHistory,
  getListAppHier,
  getListAppHierDetail,
  inactivePricingAdjust,
} from "../../../../../redux/slices/product_promo/pricingAdjust";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../utils/getColumnSearchProps";
import { PRODUCT_PROMO_ROUTES } from "../../../../../routes/product_promo/pp_routes";
import { Link } from "react-router-dom";
import { getPriceAdjustByIdPricingDetail } from "../../../../../redux/slices/product_promo/pricing";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import { hasValue, renderColumn } from "../../../../../utils";
import NxTable from "../../../../../components/Nx/NxTable";
const onFilter = (dataIndex, value, record) => {
  const fixSearchText = value.toLowerCase();
  return record[dataIndex]?.toLowerCase().includes(fixSearchText);
};

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    return obj[fieldSort]?.toLowerCase();
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);
  return fa.localeCompare(fb);
};
const columnPriceAdjustmenttDetail = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  search,
  handleSearch = () => {},
  handleApprovalHistory = () => {},
  handleOpenModalInactivate = () => {},
  type,
  handleDetail = () => {}
) => {
  const res = [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "PRICE ADJUSTMENT ID",
      key: "pricingAdjustmentId",
      width: 240,
      dataIndex: "pricingAdjustmentId",
      filteredValue: search?.["pricingAdjustmentId"]
      ? [search?.["pricingAdjustmentId"]]
      : null,
      // onFilter: (value, record) =>
      //   onFilter("pricingAdjustmentId", value, record),
      sorter: (a, b) => sorter("pricingAdjustmentId", a, b),
      // ...getColumnSearchPropsPaging(
      //   "pricingAdjustmentId",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "pricingAdjustmentId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input"
      ),
      render: (text) =>
        renderColumn(
          "pricingAdjustmentId",
          hasValue(search["pricingAdjustmentId"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "NAME",
      key: "name",
      width: 240,
      dataIndex: "name",
      filteredValue: search?.["name"]
      ? [search?.["name"]]
      : null,
      // onFilter: (value, record) => onFilter("name", value, record),
      sorter: (a, b) => sorter("name", a, b),
      // ...getColumnSearchPropsPaging(
      //   "name",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "name",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input"
      ),
      render: (text) =>
        renderColumn(
          "name",
          hasValue(search["name"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "CRITERIA",
      key: "criterias",
      width: 240,
      dataIndex: "criterias",
      filteredValue: search?.["criterias"]
      ? [search?.["criterias"]]
      : null,
      // onFilter: (value, record) => onFilter("criterias", value, record),
      sorter: (a, b) => sorter("criterias", a, b),
      // ...getColumnSearchPropsPaging(
      //   "criterias",
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
        "criterias",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input"
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
      // render: (text) => {
      //   if (searchedColumn === "criterias") {
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
      title: "DESCRIPTION",
      key: "description",
      width: 240,
      dataIndex: "description",
      filteredValue: search?.["description"] ? [search?.["description"]] : null,
      // onFilter: (value, record) => onFilter("description", value, record),
      sorter: (a, b) => sorter("description", a, b),
      // ...getColumnSearchPropsPaging(
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
      filteredValue: search?.["status"] ? [search?.["status"]] : null,
      // onFilter: (value, record) => onFilter("status", value, record),
      sorter: (a, b) => sorter("status", a, b),
      key: "status",
      // ...getColumnSearchPropsPaging(
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
            text = "Waiting Approval";
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
      key: "statusApproval",
      width: 240,
      dataIndex: "statusApproval",
      filteredValue: search?.["statusApproval"] ? [search?.["statusApproval"]] : null,
      // onFilter: (value, record) => onFilter("statusApproval", value, record),
      sorter: (a, b) => sorter("statusApproval", a, b),
      key: "statusApproval",
      // ...getColumnSearchPropsPaging(
      //   "statusApproval",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "statusApproval",
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
          case "WAITING FOR APPROVAL":
            text = "Waiting Approval";
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
      title: "ACTION",
      key: "action",
      align: "center",
      width: 120,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex justify-center align-middle gap-2">
            {type === "pricing" ? (
              <>
                <Popover
                  content={
                    <div>
                      {r.statusApproval !== "WAITING_FOR_APPROVAL" &&
                      r.status !== "INACTIVE" ? (
                        <Link
                          to={PRODUCT_PROMO_ROUTES.UPDATE_PRICING_ADJUSTMENT}
                          state={{
                            id: r?.id,
                            prevPage: "detail-pricing",
                            statusPriceAdjust: r?.status,
                            statusApprovalPriceAdjust: r?.statusApproval,
                          }}
                        >
                          <ButtonComponent
                            icon={
                              <SVGIcon
                                name="IconEdit"
                                color={"#0075bf"}
                                width={24}
                              />
                            }
                            border={false}
                          >
                            <span className={"text-black"}>Update</span>
                          </ButtonComponent>
                        </Link>
                      ) : (
                        <ButtonComponent
                          icon={
                            <SVGIcon
                              name="IconEdit"
                              color={"#8D91A0"}
                              width={24}
                            />
                          }
                          border={false}
                          disabled={true}
                        >
                          <span className={"text-black"}>Update</span>
                        </ButtonComponent>
                      )}
                      {r.status === "ACTIVE" &&
                      r.statusApproval !== "WAITING_FOR_APPROVAL" ? (
                        <ButtonComponent
                          icon={
                            <Checkbox
                              className="inactive-check"
                              checked={false}
                            />
                          }
                          border={false}
                          onClick={() => handleOpenModalInactivate(r)}
                        >
                          <span className={"text-black"}>Inactivate</span>
                        </ButtonComponent>
                      ) : (
                        <ButtonComponent
                          icon={
                            <Checkbox
                              className="inactive-check"
                              checked={
                                !(
                                  r.statusApproval === "WAITING_FOR_APPROVAL" &&
                                  r.status === "ACTIVE"
                                )
                              }
                              disabled={true}
                            />
                          }
                          border={false}
                          disabled={true}
                        >
                          <span className={"text-black"}>
                            {!(
                              r.statusApproval === "WAITING_FOR_APPROVAL" &&
                              r.status === "ACTIVE"
                            )
                              ? "Inactivate"
                              : "Activate"}
                          </span>
                        </ButtonComponent>
                      )}
                      <ButtonComponent
                        icon={
                          <SVGIcon
                            name="IconLogHistory"
                            color={"#0075bf"}
                            width={24}
                          />
                        }
                        border={false}
                        onClick={() => handleApprovalHistory(r)}
                      >
                        <span className={"text-black"}>Approval History</span>
                      </ButtonComponent>
                    </div>
                  }
                  trigger={"click"}
                  placement="bottomRight"
                >
                  <ButtonComponent icon={<MoreOutlined />} border={false} />
                </Popover>
                <Tooltip title="Detail">
                  <Link
                    to={PRODUCT_PROMO_ROUTES.DETAIL_PRICING_ADJUSTMENT}
                    state={{ id: r?.id }}
                  >
                    <SVGIcon name="IconDetail" width={24} />
                  </Link>
                </Tooltip>
              </>
            ) : (
              <Tooltip title="Detail">
                <span className="flex justify-center">
                  <SVGIcon
                    name="IconDetail"
                    width={24}
                    onClick={() => handleDetail(r)}
                  />
                </span>
              </Tooltip>
            )}
          </div>
        );
      },
      key: "action",
    },
  ];
  const whitelist = ["PRICE ADJUSTMENT ID", "STATUS", "STATUS APPROVAL"];
  return type === "pricing"
    ? res
    : res.filter((item) => !whitelist.includes(item.title));
};
const PricingDetailAdjustmentTable = ({
  data = [],
  dataDetail = {},
  type = "pricing",
  handleDetail = () => {},
}) => {
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [openModalInactivate, setOpenModalInactivate] = useState(false);
  const [dataInactivate, setDataInactivate] = useState({});
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const { dataApprovalHistory } = useSelector((state) => state.pricingAdjust);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [search, setSearch] = useState({});

  const { data: dataUser = {} } = useSelector((state) => state.profile);

  useEffect(() => {
    if (dataApprovalHistory && dataApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: dataApprovalHistory?.dataApprover?.PRICING_ADJUSTMENT || [],
          inactive:
            dataApprovalHistory?.dataApprover?.INACTIVE_PRICING_ADJUSTMENT ||
            [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.PRICING_ADJUSTMENT || [],
          inactive:
            dataApprovalHistory?.dataHistory?.INACTIVE_PRICING_ADJUSTMENT || [],
        },
      };
      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  const handleApprovalHistory = (data) => {
    dispatch(getApprovalHistory(data.id));
    setOpenModalHistory(true);
  };
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
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
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
      appHierId: res.approvalHierarchy,
      description: res.remark,
    };
    dispatch(inactivePricingAdjust({ data }))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancelModalInactivate();
        dispatch(getPriceAdjustByIdPricingDetail({ id: dataDetail.id }));
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setBodyError({ body: { ...res }, handleClear, message });
          setModalError(true);
        }
      });
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

  return (
    <Fragment>
      <NxTable
        idTable="pricing-adjustment-detail-table"
        userId={dataUser?.data?.username}
        showAdvanceSearch={false}
        showSearchBar={false}
        usePagination={false}
        type="FE"
        dataSource={data}
        totalData={data.length}
        current={page}
        pageSize={pageSize}
        tableScrolled={{ y: 300, x: 1500 }}
        onChange={handleChangeSize}
        columns={columnPriceAdjustmenttDetail(
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          search,
          handleSearch,
          handleApprovalHistory,
          handleOpenModalInactivate,
          type,
          handleDetail
        )}
      />
      <ModalHistory
        isOpen={openModalHistory}
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
        selector="pricingAdjust"
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
          <p className="pl-[70px]">{`Your data was not inactivate ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </Fragment>
  );
};

export default PricingDetailAdjustmentTable;
