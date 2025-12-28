import React, { useMemo, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import DetailText from "../../../../../components/DetailText";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import { Form, Spin, Steps, Tabs } from "antd";
import InputComponent from "../../../../../components/InputComponent";
import moment from "moment";
import {
  getDetailCalculationResult,
  getDetailCalculationResultNoPaging,
  recalculateData,
  retryData,
  getDetailCalculationLog,
} from "../../../../../redux/slices/rating_billing_invoice/calculation";
import TableRBI from "../../../../../components/TableRBI";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import { columnsRecalculate } from "./Table/TableRecalculate";
import { columnsCalculation } from "./Table/TableCalculation";
import CardContainer from "../../../../../components/CardContainer";

const DetailInformation = ({ data, tabHeader }) => {
  // Selector
  const {
    list_calculation_result,
    list_calculation_no_paging,
    list_calculation_log,
    loading,
    loadingModal,
  } = useSelector((state) => state.rbi_calculation);

  // Declaration
  const [form] = Form.useForm();
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const searchInputCal = useRef(null);

  // state untuk infinite scroll
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20); // Load 20 data each time
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchRecalculate, setSearchRecalculate] = useState({});

  const [current, setCurrent] = useState(0);
  const [tableSelected, setTableSelected] = useState([]);
  const [keyTableSelected, setKeyTableSelected] = useState([]);
  const [forceObj, setForceObj] = useState({});
  const [openRetry, setOpenRetry] = useState(false);
  const [modalRecalculateRating, setModalRecalculateRating] = useState(false);

  const [pageCal, setPageCal] = useState(1);
  const [pageSizeCal, setPageSizeCal] = useState(10);
  const [searchTextCal, setSearchTextCal] = useState("");
  const [searchedColumnCal, setSearchedColumnCal] = useState("");

  const [activeTab, setActiveTab] = useState("rating");

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  useEffect(() => {
    dispatch(
      getDetailCalculationLog({
        calCode: data?.calCode,
        sort: "createdDate~desc",
        page: 1,
        pageSize: 1,
        search: encodeURIComponent(JSON.stringify({})),
      })
    );
  }, [tabHeader, data?.calCode, dispatch]);

  // Initial fetch dengan 100 data
  useEffect(() => {
    if (tabHeader === "Calculation Information" && data?.calCode && activeTab) {
      const reqSearch = encodeURIComponent(JSON.stringify(search));
      dispatch(
        getDetailCalculationResult({
          calCode: data?.calCode,
          calType: activeTab === "rating" ? 621 : 623,
          page: 1,
          pageSize: 100, // Initial load 100 data
          sort,
          search: reqSearch,
          isLoadMore: false,
        })
      );
      setPage(1);
    }
  }, [activeTab, dispatch, data, search, sort, tabHeader]);

  useEffect(() => {
    if (tabHeader === "Calculation Information" && data?.calCode && activeTab) {
      dispatch(
        getDetailCalculationResultNoPaging({
          calCode: data?.calCode,
          calType: activeTab === "rating" ? 621 : 623,
        })
      );
    }
  }, [dispatch, activeTab, data]);

  useEffect(() => {
    if (data?.calType === 621) {
      setActiveTab("rating");
    } else if (data?.calType === 623) {
      setActiveTab("billing");
    } else {
      setActiveTab("rating");
    }
  }, [data]);

  // Get latest calculation log data
  const latestLogData = useMemo(() => {
    return list_calculation_log?.result?.[0] || null;
  }, [list_calculation_log]);

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab((prevState) => {
      if (key !== prevState) {
        setPage(1);
        setSearch({});
        setSort("");
      }
      return key;
    });
  };

  // Prepare tab items
  const tabItems = useMemo(() => {
    const items = [];
    
    if (data?.calType !== 623) {
      items.push({
        key: "rating",
        label: "Rating Result",
      });
    }
    
    if (data?.calType !== 621) {
      items.push({
        key: "billing",
        label: "Billing Result",
      });
    }
    
    return items;
  }, [data?.calType]);

  // handle search column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      let result = selectedKeys[0];
      if (dataIndex === "isTry") {
        if (selectedKeys[0] !== undefined && selectedKeys[0] !== null) {
          const temp = selectedKeys[0].toString().toLowerCase();
          if (temp === "true") {
            result = "Y";
          } else if (temp === "false") {
            result = "N";
          } else {
            result = temp;
          }
        } else {
          result = selectedKeys[0];
        }
      }
      return {
        ...prevState,
        [dataIndex]: result,
      };
    });
  };

  const handleSearchRecalculate = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextCal(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumnCal !== tempSearchColumn) {
      setPageCal(1);
    }
    setSearchedColumnCal(tempSearchColumn);
    setSearchRecalculate((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPageCal(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  // onSort
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Load more handler untuk infinite scroll
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = list_calculation_result?.page?.totalPages || 0;

    if (nextPage <= totalPages) {
      const reqSearch = encodeURIComponent(JSON.stringify(search));
      await dispatch(
        getDetailCalculationResult({
          calCode: data?.calCode,
          calType: activeTab === "rating" ? 621 : 623,
          page: nextPage,
          pageSize: pageSize, // Load 20 more
          sort,
          search: reqSearch,
          isLoadMore: true,
        })
      );
      setPage(nextPage);
    }
  };

  // Calculate if there's more data
  const hasMore =
    (list_calculation_result?.result?.length || 0) <
    (list_calculation_result?.page?.totalElements || 0);

  // change table recalculate modal
  const handleChangePageCal = (pageCal, pageSizeChangeCal) => {
    const tempPage = pageSizeCal !== pageSizeChangeCal ? 1 : pageCal;
    setPageCal(tempPage);
    setPageSizeCal(pageSizeChangeCal);
  };

  const handleForceObj = (e, type) => {
    let result;
    switch (type) {
      case "remark":
        result = e.target.value;
        break;
      default:
        result = e;
        break;
    }
    setForceObj((prevState) => ({
      ...prevState,
      [type]: result,
    }));
    return result;
  };

  const rowSelection = {
    fixed: true,
    type: "checkbox",
    preserveSelectedRowKeys: true,
    selectedRowKeys: keyTableSelected,
    onChange: (selectedRowKeys, selectedRows) => {
      setTableSelected(selectedRows);
      setKeyTableSelected(selectedRowKeys);
    },
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };

  const scrollLeftHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 250;
    }
  };

  const handleButtonPrev = () => {
    prev();
    scrollLeftHandler();
    setPageCal(1);
    setPageSizeCal(10);
    setSearchTextCal("");
    setSearchedColumnCal("");
    handleResetFilter();
  };

  const handleButtonNext = () => {
    next();
    scrollRightHandler();
    setPageCal(1);
    setPageSizeCal(10);
    setSearchTextCal("");
    setSearchedColumnCal("");
    handleResetFilter();
  };

  const handleResetFilter = () => {
    setPageCal(1);
    setPageSizeCal(10);
    setSearchedColumnCal("");
    setSearchTextCal("");
    setSearchRecalculate({});
  };

  const filterDataByPage = (data = [], type = "data") => {
    let result = [...data]?.map((item, index) => ({
      ...item,
      isTry: item?.isTry?.toString(),
      key: index + 1,
    }));

    return type === "data" ? result : result.length;
  };

  const filterDataRecalculate = useMemo(() => {
    const filtered = (list_calculation_no_paging || [])
      .filter((item) => item.calType !== 624 && !item.isTry)
      ?.map((item) => {
        return Object.fromEntries(
          Object.entries(item).map(([key, value]) => [
            key,
            value === null ? "" : value,
          ])
        );
      });
    return filterDataByPage(filtered, "data");
  }, [list_calculation_no_paging]);

  const steps = () => {
    let temp = [
      {
        title: "Choose Customer",
        content: (
          <>
            <p className="text-primary text-xs uppercase py-2 gap-5">
              CUSTOMER INFORMATION
            </p>
            {modalRecalculateRating ? (
              <div>
                <TableRBI
                  idTable="recalculate-modal-table"
                  size="small"
                  dataSource={filterDataRecalculate}
                  columns={columnsRecalculate(
                    pageCal,
                    pageSizeCal,
                    searchInputCal,
                    searchedColumnCal,
                    searchTextCal,
                    handleSearchRecalculate,
                    searchRecalculate
                  )}
                  totalData={filterDataRecalculate.length}
                  tableScrolled={{
                    x: 2500,
                    y: 525,
                  }}
                  rowSelection={rowSelection}
                  loading={loading}
                  showExport={false}
                  usePagination={false}
                  useInfiniteScroll={false}
                />
                <div className="flex justify-end mt-2 text-sm text-gray-600">
                  Showing {filterDataRecalculate.length} rows | <span className="text-green-600 ml-1">All data showed</span>
                </div>
              </div>
            ) : null}
          </>
        ),
        disabled: tableSelected.length === 0,
      },
      {
        title: "Confirmation",
        content: (
          <div>
            <p className="text-primary text-xs uppercase py-2 gap-5">
              CONFIRMATION
            </p>
            <div>
              <TableRBI
                idTable="confirmation-modal-table"
                size="small"
                dataSource={filterDataByPage(tableSelected, "data")}
                columns={columnsRecalculate(
                  pageCal,
                  pageSizeCal,
                  searchInputCal,
                  searchedColumnCal,
                  searchTextCal,
                  handleSearchRecalculate,
                  searchRecalculate
                )}
                totalData={filterDataByPage(tableSelected, "length") || 0}
                tableScrolled={{ x: 2000, y: 525 }}
                loading={loading}
                showExport={false}
                usePagination={false}
                useInfiniteScroll={false}
              />
              <div className="flex justify-end mt-2 text-sm text-gray-600">
                Showing {filterDataByPage(tableSelected, "length")} rows | <span className="text-green-600 ml-1">All data showed</span>
              </div>
              <div className={"mt-2"}>
                <Form.Item
                  label={"Remark"}
                  name={"remark"}
                  getValueFromEvent={(e) => handleForceObj(e, "remark")}
                >
                  <InputComponent rows={1} type="textarea" />
                </Form.Item>
              </div>
            </div>
          </div>
        ),
        disabled: forceObj.remark,
      },
    ];
    return temp;
  };

  const handleClear = () => {
    setModalRecalculateRating(false);
    form.resetFields();
    setForceObj({});
    setCurrent(0);
    setKeyTableSelected([]);
    setTableSelected([]);
    handleResetFilter();
  };

  const clearRetry = () => {
    form.resetFields();
    setOpenRetry(false);
  };

  const handleSave = () => {
    const accNumb = tableSelected?.map((item) => {
      return item?.accNumb;
    });

    const body = {
      accNumb: accNumb,
      calCode: data?.calCode,
      calType: activeTab === "rating" ? 621 : 623,
      remark: forceObj?.remark,
      resultId: tableSelected
        ?.filter((item) => keyTableSelected?.includes(item?.key))
        ?.map((item) => item?.resultId),
    };
    dispatch(recalculateData(body))
      .unwrap()
      .then(() => {
        const reqSearch = encodeURIComponent(JSON.stringify(search));
        dispatch(
          getDetailCalculationResult({
            calCode: data?.calCode,
            calType: activeTab === "rating" ? 621 : 623,
            page: 1,
            pageSize: 100,
            sort,
            search: reqSearch,
            isLoadMore: false,
          })
        );
        dispatch(
          getDetailCalculationResultNoPaging({
            calCode: data?.calCode,
            calType: activeTab === "rating" ? 621 : 623,
          })
        );
        handleClear();
      });
  };

  const handleRetry = (res, handleClear) => {
    setOpenRetry(false);
    const body = {
      calCode: data?.calCode,
      calType: activeTab === "rating" ? 621 : 623,
      remark: res.remark,
    };
    dispatch(retryData(body))
      .unwrap()
      .then(() => {
        const reqSearch = encodeURIComponent(JSON.stringify(search));
        dispatch(
          getDetailCalculationResult({
            calCode: data?.calCode,
            calType: activeTab === "rating" ? 621 : 623,
            page: 1,
            pageSize: 100,
            sort,
            search: reqSearch,
            isLoadMore: false,
          })
        );
        clearRetry();
        handleClear();
      });
  };

  const renderStatus = (index) => {
    let text;
    switch (index) {
      case "INPROGRESS":
        text = "In Progress";
        break;
      default:
        text = index
          ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
          : index;
        break;
    }
    if (text) {
      return text;
    } else {
      return "";
    }
  };

  // Prepare columns dengan key yang konsisten
  const calculationColumns = useMemo(() => {
    const cols = columnsCalculation(
      page,
      pageSize,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      search
    );
    
    return cols.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [page, pageSize, searchedColumn, searchText, search]);

  const columnDefinitions = useMemo(() => {
    return calculationColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [calculationColumns]);

  return (
    <>
      <Spin spinning={loadingModal}>
        {/* Calculation Information */}
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px]">CALCULATION INFORMATION</p>
            </div>
          }
        >
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-2 sm:gap-y-1">
            <DetailText label={"Calculation Code"}>{data?.calCode}</DetailText>
            <DetailText label={"Type"}>{data?.calculationType}</DetailText>
            <DetailText label={"Billing Cycle"}>
              {data?.billingCycle}
            </DetailText>
            <DetailText label={"Billing Period"}>
              {data?.billingPeriod}
            </DetailText>

            <DetailText label={"Total Customer"}>
              {data?.totalCustomer}
            </DetailText>
            <DetailText label={"Total Success"}>
              {data?.totalSucceed}
            </DetailText>
            <DetailText label={"Total Progress"}>
              {data?.totalProgress}
            </DetailText>
            <DetailText label={"Total Failed"}>{data?.totalFailed}</DetailText>

            <DetailText label={"Generate Date"}>
              {data?.generateDate}
            </DetailText>
            <DetailText label={"Completion Date"}>
              {data?.completionDate ? moment(data.completionDate).format("DD MMM YYYY HH:mm:ss") : ""}
            </DetailText>
            <DetailText label={"Status"}>
              {renderStatus(data?.status)}
            </DetailText>
          </div>
        </CardContainer>

        {/* Parameter Information */}
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px]">PARAMETER INFORMATION</p>
            </div>
          }
        >
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2 sm:gap-y-1">
            <DetailText label={"Service Type"}>{data?.serviceType}</DetailText>
            <DetailText label={"SOR"}>{data?.sor}</DetailText>
            <DetailText label={"Cost Center"}>{data?.costCenter}</DetailText>
            <DetailText label={"Meter Reading Code"}>
              {data?.meterReadingCode}
            </DetailText>

            <DetailText label={"Account Segment"}>
              {data?.accGroupSegment}
            </DetailText>
            <DetailText label={"Account Group Type"}>
              {data?.accGroupType}
            </DetailText>
            <DetailText label={"Specific Customer"}>
              {data?.specCustacc}
            </DetailText>
          </div>
        </CardContainer>

        {/* Schedule Information */}
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px]">SCHEDULE INFORMATION</p>
            </div>
          }
        >
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2 sm:gap-y-1">
            <DetailText label={"Type"}>{data?.scheduleType}</DetailText>
            <div className="col-span-3">
              <DetailText label={"Remark"}>{data?.remark}</DetailText>
            </div>
          </div>
        </CardContainer>

        {/* Calculation Result */}
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px]">CALCULATION RESULT</p>
            </div>
          }
        >
          <div className="w-full mt-0">
            <Tabs
              activeKey={activeTab}
              items={tabItems}
              onChange={handleTabChange}
            />
          </div>

          <div className="w-full flex justify-end gap-2 mb-1">
            <ButtonComponent
              type={"submit"}
              border={false}
              icon={<SVGIcon name={"IconRatingReconculate"} width={24} />}
              onClick={() => setModalRecalculateRating(true)}
            >
              Recalculate
            </ButtonComponent>
            <ButtonComponent
              onClick={() => setOpenRetry(true)}
              type={"submit"}
              border={false}
              icon={<SVGIcon name={`IconButtonReset`} width={24} />}
            >
              Retry
            </ButtonComponent>
          </div>

          <div className="mt-1">
            <TableRBI
              idTable="calculation-result-table"
              size="small"
              columns={calculationColumns}
              dataSource={list_calculation_result?.result}
              totalData={list_calculation_result?.page?.totalElements || 0}
              tableScrolled={{ x: 2000, y: 600 }}
              onSort={onSort}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
              showExport={false}
              usePagination={false}
              useInfiniteScroll={true}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              loadMoreThreshold={20}
            />
          </div>
        </CardContainer>

        {/* History Log Information */}
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px]">HISTORY LOG INFORMATION</p>
            </div>
          }
        >
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-2 sm:gap-y-1">
            <DetailText label={"Record ID"}>
              {latestLogData?.calLogId || ""}
            </DetailText>
            <DetailText label={"Created Date"}>
              {latestLogData?.createdDate
                ? moment(latestLogData.createdDate).format(
                    "DD MMM YYYY HH:mm:ss"
                  )
                : ""}
            </DetailText>
            <DetailText label={"Created By"}>
              {latestLogData?.createdBy || ""}
            </DetailText>
            <DetailText label={"Updated Date"}>
              {latestLogData?.updatedDate
                ? moment(latestLogData.updatedDate).format(
                    "DD MMM YYYY HH:mm:ss"
                  )
                : ""}
            </DetailText>
            <DetailText label={"Updated By"}>
              {latestLogData?.updatedBy || ""}
            </DetailText>
          </div>
        </CardContainer>

        {/* retry modal */}
        <ModalApproveOrReject
          isOpen={openRetry}
          handleCloseModal={clearRetry}
          onFinish={handleRetry}
          header={"retry"}
          approveOrReject={"retry"}
          menu={"Calculation"}
          named={data?.calCode}
        />

        <ModalCustom
          isOpen={modalRecalculateRating}
          header={"RECALCULATE INFORMATION"}
          type={"confirmation"}
          handleCancel={handleClear}
          width={1200}
          footer={
            <div className="flex justify-end gap-1">
              <ButtonComponent type={"default"} onClick={handleClear}>
                Back
              </ButtonComponent>
              {current > 0 ? (
                <ButtonComponent
                  type={"submit"}
                  onClick={handleButtonPrev}
                  icon={
                    <LeftOutlined
                      style={{
                        color: "#fff",
                        fontSize: 15,
                        marginRight: 10,
                      }}
                    />
                  }
                >
                  Previous
                </ButtonComponent>
              ) : null}

              {current < steps().length - 1 && (
                <ButtonComponent
                  type={"submit"}
                  onClick={handleButtonNext}
                  disabled={steps()[current].disabled}
                >
                  <div style={{ textAlign: "center" }}>
                    <span>Next</span>
                    <RightOutlined
                      style={{
                        color: "#fff",
                        fontSize: 15,
                        marginLeft: 10,
                      }}
                    />
                  </div>
                </ButtonComponent>
              )}
              {current === steps().length - 1 && (
                <ButtonComponent
                  type={"submit"}
                  htmlType={"submit"}
                  onClick={handleSave}
                >
                  Confirm
                </ButtonComponent>
              )}
            </div>
          }
        >
          <div className="w-full gap-5">
            <div
              ref={containerRef}
              className="overflow-x-scroll scrollStepsCstm gap-5"
            >
              <Steps
                current={current}
                items={steps()}
                labelPlacement="vertical"
              />
            </div>
            <Form form={form} layout="vertical" className="mt-3">
              {steps()[current].content}
            </Form>
          </div>
        </ModalCustom>
      </Spin>
    </>
  );
};

export default DetailInformation;