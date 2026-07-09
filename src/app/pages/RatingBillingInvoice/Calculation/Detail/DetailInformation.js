import React, { useMemo, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import CollapsibleContainer from "../../../../../components/CollapsibleContainer";
import DetailLog from "./DetailLog";
import StatusComponent from "../../../../../components/StatusComponent";

const DetailInformation = ({ data }) => {
  // Selector
  const {
    list_calculation_result,
    list_calculation_no_paging,
    list_calculation_log,
    loading,
    loadingResult,
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
  const [infoActiveTab, setInfoActiveTab] = useState("list");

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
      }),
    );
  }, [data?.calCode, dispatch]);

  useEffect(() => {
    if (!data?.calCode || !data?.calType) return;

    let tab;
    if (data.calType === 621) tab = "rating";
    else if (data.calType === 623) tab = "billing";
    else if (data.calType === 624) tab = "rating & billing";
    else return;

    setActiveTab(tab);

    const calType = data.calType === 621 ? 621 : 623;
    const reqSearch = encodeURIComponent(JSON.stringify(search));

    dispatch(
      getDetailCalculationResult({
        calCode: data.calCode,
        calType,
        page: 1,
        pageSize: 100,
        sort,
        search: reqSearch,
        isLoadMore: false,
      }),
    );
    setPage(1);

    dispatch(
      getDetailCalculationResultNoPaging({
        calCode: data.calCode,
        calType,
      }),
    );
  }, [data?.calCode, data?.calType, search, sort, dispatch]);

  // Get latest calculation log data
  const latestLogData = useMemo(() => {
    return list_calculation_log?.result?.[0] || null;
  }, [list_calculation_log]);

  // Handle tab change (only used for calType 624 where tabs can be switched)
  const handleTabChange = (key) => {
    if (key === activeTab) return;
    setActiveTab(key);
    setPage(1);
    setSearch({});
    setSort("");
    const calType = key === "rating" ? 621 : 623;
    dispatch(
      getDetailCalculationResult({
        calCode: data?.calCode,
        calType,
        page: 1,
        pageSize: 100,
        sort: "",
        search: encodeURIComponent(JSON.stringify({})),
        isLoadMore: false,
      }),
    );
  };

  // Prepare tab items
  const tabItems = useMemo(() => {
    const items = [];

    if (data?.calType === 621) {
      items.push({
        key: "rating",
        label: "Rating",
      });
    }

    if (data?.calType === 623) {
      items.push({
        key: "billing",
        label: "Billing",
      });
    }

    if (data?.calType === 624) {
      items.push({
        key: "rating & billing",
        label: "Rating & Billing",
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
        }),
      );
      setPage(nextPage);
    }
  };

  // Calculate if there's more data
  const hasMore =
    (list_calculation_result?.result?.length || 0) <
    (list_calculation_result?.page?.totalElements || 0);

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
    const source = Array.isArray(list_calculation_no_paging)
      ? list_calculation_no_paging
      : list_calculation_no_paging?.result || [];
    const filtered = source
      .filter((item) => item.calType !== 624 && !item.isTry)
      ?.map((item) => {
        return Object.fromEntries(
          Object.entries(item).map(([key, value]) => [
            key,
            value === null ? "" : value,
          ]),
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
                    searchRecalculate,
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
                  Showing {filterDataRecalculate.length} rows |{" "}
                  <span className="text-green-600 ml-1">All data showed</span>
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
                  searchRecalculate,
                )}
                totalData={filterDataByPage(tableSelected, "length") || 0}
                tableScrolled={{ x: 2000, y: 525 }}
                loading={loading}
                showExport={false}
                usePagination={false}
                useInfiniteScroll={false}
              />
              <div className="flex justify-end mt-2 text-sm text-gray-600">
                Showing {filterDataByPage(tableSelected, "length")} rows |{" "}
                <span className="text-green-600 ml-1">All data showed</span>
              </div>
              <div className={"mt-2"}>
                <Form.Item
                  label={"Remark"}
                  name={"remark"}
                  required
                  rules={[{ required: true, message: "Remark is required" }]}
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

  const handleOpenRecalculateModal = () => {
    setCurrent(1);
    setModalRecalculateRating(true);
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
          }),
        );
        dispatch(
          getDetailCalculationResultNoPaging({
            calCode: data?.calCode,
            calType: activeTab === "rating" ? 621 : 623,
          }),
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
          }),
        );
        clearRetry();
        handleClear();
      });
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
      search,
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
        <div>
          {/* Card 1: CALCULATION INFORMATION with internal tabs */}
          <CardContainer
            header={
              <div className="flex -my-4 justify-between items-center">
                <p className="mt-[15px]">CALCULATION INFORMATION</p>
              </div>
            }
          >
            <Tabs
              activeKey={infoActiveTab}
              onChange={setInfoActiveTab}
              items={[
                {
                  key: "list",
                  label: "Calculation List",
                  children: (
                    <>
                      <CollapsibleContainer
                        header="INPUT PARAMETER INFORMATION"
                        border
                        defaultOpen
                      >
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-2 sm:gap-y-1 pt-2">
                          <DetailText label={"Billing Cycle"}>
                            {data?.billingCycle}
                          </DetailText>
                          <DetailText label={"Billing Period"}>
                            {data?.billingPeriod}
                          </DetailText>
                          <DetailText label={"Calculation Type"}>
                            {data?.calculationType}
                          </DetailText>
                          <DetailText label={"Service Type"}>
                            {data?.serviceType}
                          </DetailText>
                          <DetailText label={"SOR"}>{data?.sor}</DetailText>
                          <DetailText label={"Cost Center"}>
                            {data?.costCenter}
                          </DetailText>
                          <DetailText label={"Meter Reading Code"}>
                            {data?.meterReadingCode}
                          </DetailText>
                          <DetailText label={"Account Segment"}>
                            {data?.accGroupSegment}
                          </DetailText>
                          <DetailText label={"Account Group Type"}>
                            {data?.accGroupType}
                          </DetailText>
                          <DetailText label={"Status"}>
                            <StatusComponent colour={data?.status} size="small">
                              {data?.status}
                            </StatusComponent>
                          </DetailText>
                          <DetailText label={"Specific Customer Account"}>
                            {data?.specCustacc}
                          </DetailText>
                        </div>
                      </CollapsibleContainer>

                      <CollapsibleContainer
                        header="SCHEDULE INFORMATION"
                        border
                        defaultOpen
                        className="mt-2"
                      >
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2 sm:gap-y-1 pt-2">
                          <DetailText label={"Type"}>
                            {data?.scheduleType}
                          </DetailText>
                          <div className="col-span-3">
                            <DetailText label={"Remark"}>
                              {data?.remark}
                            </DetailText>
                          </div>
                        </div>
                      </CollapsibleContainer>
                    </>
                  ),
                },
                {
                  key: "log",
                  label: "Calculation Log",
                  children: (
                    <DetailLog
                      data={data}
                      tabHeader="Calculation Log"
                      showCard={false}
                    />
                  ),
                },
              ]}
            />
          </CardContainer>

          {/* Card 2: CALCULATION SUCCESS */}
          <CardContainer
            header={
              <div className="flex -my-4 justify-between items-center">
                <p className="mt-[15px]">CALCULATION SUCCESS</p>
                <ButtonComponent
                  type={"submit"}
                  border={false}
                  icon={
                    <SVGIcon
                      name={"IconRatingReconculate"}
                      style={{ fontSize: "20px" }}
                    />
                  }
                  onClick={handleOpenRecalculateModal}
                >
                  Recalculate
                </ButtonComponent>
              </div>
            }
          >
            <div className="mt-1">
              <TableRBI
                idTable="recalculate-section-table"
                size="small"
                dataSource={filterDataRecalculate}
                columns={columnsRecalculate(
                  pageCal,
                  pageSizeCal,
                  searchInputCal,
                  searchedColumnCal,
                  searchTextCal,
                  handleSearchRecalculate,
                  searchRecalculate,
                )}
                totalData={filterDataRecalculate.length}
                tableScrolled={{ x: 2000, y: 525 }}
                rowSelection={rowSelection}
                loading={loading}
                showExport={false}
                usePagination={false}
                useInfiniteScroll={true}
                hasMore={false}
                onLoadMore={() => {}}
              />
            </div>
          </CardContainer>

          {/* Card 3: CALCULATION FAILED */}
          <CardContainer
            header={
              <div className="flex -my-4 justify-between items-center">
                <p className="mt-[15px]">CALCULATION FAILED</p>

                <ButtonComponent
                  onClick={() => setOpenRetry(true)}
                  type={"submit"}
                  border={false}
                  icon={
                    <SVGIcon
                      name={`IconButtonReset`}
                      style={{ fontSize: "20px" }}
                    />
                  }
                >
                  Retry
                </ButtonComponent>
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
                loading={loadingResult}
                showExport={false}
                usePagination={false}
                useInfiniteScroll={true}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                loadMoreThreshold={20}
              />
            </div>
          </CardContainer>

          {/* Card 3: HISTORY LOG INFORMATION */}
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
                      "DD MMM YYYY HH:mm:ss",
                    )
                  : ""}
              </DetailText>
              <DetailText label={"Created By"}>
                {latestLogData?.createdBy || ""}
              </DetailText>
              <DetailText label={"Updated Date"}>
                {latestLogData?.updatedDate
                  ? moment(latestLogData.updatedDate).format(
                      "DD MMM YYYY HH:mm:ss",
                    )
                  : ""}
              </DetailText>
              <DetailText label={"Updated By"}>
                {latestLogData?.updatedBy || ""}
              </DetailText>
            </div>
          </CardContainer>
        </div>
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
              <ButtonComponent
                type={"submit"}
                htmlType={"submit"}
                onClick={handleSave}
                disabled={tableSelected.length === 0 || !forceObj.remark}
              >
                Confirm
              </ButtonComponent>
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
