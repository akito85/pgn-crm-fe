import React, { useState, useRef, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, Tooltip } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import moment from "moment";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import DetailText from "../../../../../components/DetailText";
import {
  dateFormatting,
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../utils";
import TablePagination from "../../../../../components/TablePagination";
import GasQualityDetail from "./GasQualityDetail/GasQualityDetail";
import { getDetailGasSource } from "../../../../../redux/slices/account_management/MasterData/gasSourceSlice";
import ButtonComponent from "../../../../../components/ButtonComponent";
import {
  getColumnSearchProps,
  getColumnSearchPropsUseFilteredValue,
  getColumnSearchPropsUseFilteredValueFE,
} from "../../../../../utils/getColumnSearchProps";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import { clearBodyMessage } from "../../../../../redux/slices/general_slice";
import SVGIcon from "../../../../../assets/Icon/index";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../../components/Card/CardComponent";
import { getGrantedAccessAccount } from "../../../../../redux/slices/account_management/accountManagement";

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      // case "value":
      //   return separatorCurrency(obj[fieldSort])?.replace(/,/g, "")
      //   // return format.toLowerCase();

      case "startDate":
      case "endDate":
        return obj[fieldSort] ? moment(obj[fieldSort]) : "";
      // return date.toLowerCase();

      default:
        return obj[fieldSort]?.toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);

  const handleCompare = (a, b) => {
    switch (fieldSort) {
      case "startDate":
      case "endDate":
        if (a && b) {
          if (a.isBefore(b)) return -1;
          if (a.isAfter(b)) return 1;
          return 0;
        }
        return 0; // Handle null cases if necessary
      // case "value":
      //   return Math.sign(parseFloat(a) - parseFloat(b))
      default:
        return a.localeCompare(b);
    }
  };
  return handleCompare(fa, fb);
};

const columns = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleModalHistory,
) => {
  return [
    {
      title: "NO",
      width: 50,
      dataIndex: "no",
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      // sorter: true,
      title: "COST CENTER",
      dataIndex: "costCenterName",
      filteredValue: search?.["costCenterName"]
        ? [search?.["costCenterName"]]
        : null,
      sorter: (a, b) => sorter("costCenterName", a, b),
      // ...getColumnSearchProps(
      //   "costCenterName",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "costCenterName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "costCenterName",
          hasValue(search["costCenterName"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "START DATE",
      // sorter: true,
      align: "center",
      dataIndex: "startDate",
      // ...getColumnSearchProps(
      //   "startDate",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true,
      //   "date"
      // ),
      // render: (text) =>
      //   searchedColumn === "startDate" ? (
      //     <Highlighter
      //       highlightStyle={{
      //         backgroundColor: "#ffc069",
      //         padding: 0,
      //       }}
      //       searchWords={[
      //         searchText
      //           ? moment(searchText, "YYYY-MM-DD").format("YYYY-MM-DD")
      //           : "",
      //       ]}
      //       autoEscape
      //       textToHighlight={text ? text.toString() : ""}
      //     />
      //   ) : (
      //     hasValue(text) && moment(text).format(dateFormatting.date)
      //   ),
      filteredValue: search?.["startDate"] ? [search?.["startDate"]] : null,
      sorter: (a, b) => sorter("startDate", a, b),
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
          search,
        ),
    },
    {
      title: "END DATE",
      // sorter: true,
      align: "center",
      dataIndex: "endDate",
      filteredValue: search?.["endDate"] ? [search?.["endDate"]] : null,
      sorter: (a, b) => sorter("endDate", a, b),
      // ...getColumnSearchProps(
      //   "endDate",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true,
      //   "date"
      // ),
      // render: (text) =>
      //   searchedColumn === "endDate" ? (
      //     <Highlighter
      //       highlightStyle={{
      //         backgroundColor: "#ffc069",
      //         padding: 0,
      //       }}
      //       searchWords={[
      //         searchText
      //           ? moment(searchText, "YYYY-MM-DD").format("YYYY-MM-DD")
      //           : "",
      //       ]}
      //       autoEscape
      //       textToHighlight={text ? text.toString() : ""}
      //     />
      //   ) : (
      //     hasValue(text) && moment(text).format(dateFormatting.date)
      //   ),
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
          search,
        ),
    },
    {
      title: "DESCRIPTION",
      // sorter: true,
      dataIndex: "description",
      // ellipsis: true,
      filteredValue: search?.["description"] ? [search?.["description"]] : null,
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
        "input",
      ),
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
      // render: (text) =>
      //   searchedColumn === "description" ? (
      //     <Highlighter
      //       highlightStyle={{
      //         backgroundColor: "#ffc069",
      //         padding: 0,
      //       }}
      //       searchWords={[searchText]}
      //       autoEscape
      //       textToHighlight={text ? text.toString() : ""}
      //     />
      //   ) : text ? (
      //     <Tooltip placement="topLeft" title={text}>
      //       {text}
      //     </Tooltip>
      //   ) : (
      //     ""
      //   ),
    },
    {
      title: "ACTION",
      width: 230,
      fixed: "right",
      render: (_, record) => {
        return (
          <div className="flex w-full justify-center my-3 gap-2">
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon
                  name="IconDetail"
                  width={24}
                  onClick={() => handleModalHistory(record)}
                />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ];
};

const DetailGasSource = () => {
  // Selector
  const { data_detail, loading } = useSelector((state) => state.gasSource);
  const { bodyError, grant_access_detail } = useSelector(
    (state) => state?.general,
  );
  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data_detail?.criteria || [];
  const location = useLocation();
  const id = location.state.id;

  // State
  const [search, setSearch] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [modalError, setModalError] = useState(false);
  const [modalHistory, setModalHistory] = useState(false);
  const [dataHistory, setDataHistory] = useState({});
  console.log(search, dataSource);

  // Use Effect
  useEffect(() => {
    if (dataSource.length > 0) {
      setTotalElement(dataSource.length);
    }
  }, [dataSource]);
  useEffect(() => {
    dispatch(getDetailGasSource(id));
    dispatch(getGrantedAccessAccount("/system-setup/gas-sources-quality"));
  }, [dispatch, id]);

  const hasAccessGasQuality = useMemo(
    () =>
      grant_access_detail?.actionList?.map((item) => item?.name?.toLowerCase()),
    [grant_access_detail],
  );

  // trigger modal try again
  useEffect(() => {
    if (
      bodyError?.response?.data?.code === 500 &&
      bodyError?.action === "GET_DETAIL_GAS_SOURCE"
    ) {
      setModalError(true);
    }
  }, [bodyError]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_GAS_SOURCE,
      breadcrumbName: "Gas Source",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.DETAIL_GAS_SOURCE,
      breadcrumbName: "Detail Gas Source",
    },
  ];

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
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

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  const filterDataByPage = () => {
    let result = [...dataSource];
    // if (searchedColumn) {
    //   result = result.filter((item) => {
    //     return item[searchedColumn]
    //       ?.toLowerCase()
    //       .includes(searchText.toLowerCase());
    //   });
    // }
    // const handleDataSort = (obj) => {
    //   switch (fieldSort) {
    //     case "startDate":
    //     case "endDate":
    //       const date = obj[fieldSort]
    //         ? moment(obj[fieldSort]).format("DD MMM YYYY")
    //         : "";
    //       return date.toString().toLowerCase();
    //     default:
    //       return obj[fieldSort].toString().toLowerCase();
    //   }
    // };
    // if (fieldSort) {
    //   result.sort((a, b) => {
    //     let fa = handleDataSort(a);
    //     let fb = handleDataSort(b);
    //     if (fa < fb) {
    //       return orderSort === "asc" ? -1 : 1;
    //     }
    //     if (fa > fb) {
    //       return orderSort === "asc" ? 1 : -1;
    //     }
    //     return 0;
    //   });
    // }
    return result.slice((page - 1) * pageSize, page * pageSize);
  };

  // confirm retry
  const handleConfirmRetry = () => {
    if (bodyError?.action === "GET_DETAIL_GAS_SOURCE") {
      dispatch(getDetailGasSource(id));
    }
    dispatch(clearBodyMessage());
  };

  // handle retry
  const handleRetry = () => {
    handleConfirmRetry();
    setModalError(false);
    dispatch(clearBodyMessage());
  };

  // handle close modal
  const handleCloseModalError = () => {
    setModalError(false);
    dispatch(clearBodyMessage());
    // setBodyError({});
  };

  const handleModalHistory = (item) => {
    setDataHistory(item);
    setModalHistory(true);
  };

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <BaseContainer header={"Gas Source Information"}>
          <div className="w- full grid grid-cols-4 gap-4">
            <DetailText label={"Calorie Code"}>
              {data_detail?.calorieCode}
            </DetailText>
            <DetailText label={"Name"}>{data_detail?.name}</DetailText>
            <DetailText label={"UOM"}>{data_detail?.uomName}</DetailText>
            <DetailText label={"Status"}>{data_detail?.status}</DetailText>
            <DetailText className="col-span-4" label={"Description"}>
              {data_detail?.description}
            </DetailText>
          </div>
        </BaseContainer>

        <BaseContainer header={"History Log Information"}>
          <div className="w- full grid grid-cols-5 gap-4">
            <DetailText label={"Record ID"}>
              {data_detail?.gasSourceId}
            </DetailText>
            <DetailText label="Created Date">
              {data_detail?.createdDate
                ? moment(data_detail.createdDate).format(
                    dateFormatting.dateTime,
                  )
                : ""}
            </DetailText>
            <DetailText label="Created By">{data_detail?.createdBy}</DetailText>
            <DetailText label="Updated Date">
              {data_detail?.updatedDate
                ? moment(data_detail.updatedDate).format(
                    dateFormatting.dateTime,
                  )
                : ""}
            </DetailText>
            <DetailText label="Updated By">{data_detail?.updatedBy}</DetailText>
          </div>
        </BaseContainer>

        <BaseContainer header={"Gas Source Criteria"}>
          <TablePagination
            dataSource={filterDataByPage()}
            totalData={totalElements}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            columns={columns(
              search,
              page,
              pageSize,
              searchInput,
              searchedColumn,
              searchText,
              handleSearch,
              handleModalHistory,
            )}
            onSort={onSort}
          />
        </BaseContainer>

        {/* Gas Quality Detail */}
        {hasAccessGasQuality?.includes("view") && (
          <GasQualityDetail
            id={id}
            uomName={data_detail?.uomName}
            dataDetail={data_detail}
            actionList={grant_access_detail}
          />
        )}

        <div className="flex mt-[30px]">
          <ButtonComponent
            type={"submit"}
            onClick={() => navigate(-1)}
            icon={
              <LeftOutlined
                style={{
                  color: "#fff",
                  fontSize: 24,
                  justifyItems: "center",
                }}
              />
            }
          >
            Back
          </ButtonComponent>
        </div>
      </Spin>
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
          <p className="pl-[70px]">
            {bodyError?.response?.data?.message?.toString()}
          </p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
      {/* Modal History Log */}
      <ModalCustom
        isOpen={modalHistory}
        handleCancel={() => {
          setModalHistory(false);
        }}
        type="detail"
        header="DETAIL INFORMATION"
        width={800}
        footer={
          <ButtonComponent
            type={"default"}
            onClick={() => {
              setModalHistory(false);
            }}
          >
            Back
          </ButtonComponent>
        }
      >
        <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
          <DetailText label="Record ID">
            {dataHistory.gasSourceCriteriaId}
          </DetailText>
          <DetailText label="Created Date">
            {dataHistory?.createdDate
              ? moment(dataHistory.createdDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Created By">{dataHistory?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {dataHistory?.updatedDate
              ? moment(dataHistory.updatedDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Updated By">{dataHistory?.updatedBy}</DetailText>
        </CardComponent>
      </ModalCustom>
      {/* End Modal History Log */}
    </LayoutMenu>
  );
};

export default DetailGasSource;
