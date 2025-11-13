import React, { useMemo, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";
import RadioTabs from "../../../../../components/RadioTabs";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import { Form, Spin, Steps } from "antd";
import InputComponent from "../../../../../components/InputComponent";
import {
  getDetailCalculationResult,
  getDetailCalculationResultNoPaging,
  recalculateData,
  retryData,
} from "../../../../../redux/slices/rating_billing_invoice/calculation";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import { columnsRecalculate } from "./Table/TableRecalculate";
import { columnsCalculation } from "./Table/TableCalculation";

const DetailInformation = ({ data, tabHeader }) => {
  // Selector
  const {
    list_calculation_result,
    list_calculation_no_paging,
    loading,
    loadingModal,
  } = useSelector((state) => state.rbi_calculation);

  // Declaration
  const [form] = Form.useForm();
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const searchInputCal = useRef(null);

  // state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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

  const [segmentedPage, setSegmentedPage] = useState("");
  const [tabData, setTabData] = useState([
    { value: "Rating Result" },
    { value: "Billing Result" },
  ]);

  // use Effect
  useEffect(() => {
    if (
      tabHeader === "Calculation Information" &&
      data?.calCode &&
      segmentedPage
    ) {
      let tempSearch = "";
      for (const dataIndex in search) {
        if (Object.hasOwnProperty.call(search, dataIndex)) {
          const tempSearchText = search[dataIndex];
          if (tempSearchText) {
            tempSearch += `${dataIndex}~${tempSearchText},`;
          }
        }
      }
      tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
      const reqSearch = encodeURIComponent(JSON.stringify(search));
      dispatch(
        getDetailCalculationResult({
          calCode: data?.calCode,
          calType: segmentedPage === "Rating Result" ? 621 : 623,
          page,
          pageSize,
          sort,
          search: reqSearch,
        })
      );
    }
  }, [segmentedPage, dispatch, data, page, pageSize, search, sort, tabHeader]);

  useEffect(() => {
    if (
      tabHeader === "Calculation Information" &&
      data?.calCode &&
      segmentedPage
    ) {
      dispatch(
        getDetailCalculationResultNoPaging({
          calCode: data?.calCode,
          calType: segmentedPage === "Rating Result" ? 621 : 623,
        })
      );
    }
  }, [dispatch, segmentedPage, data]);

  useEffect(() => {
    if (data?.calType === 621) {
      setSegmentedPage("Rating Result");
      setTabData([{ value: "Rating Result" }]);
    } else if (data?.calType === 623) {
      setSegmentedPage("Billing Result");
      setTabData([{ value: "Billing Result" }]);
    } else {
      setSegmentedPage("Rating Result");
      setTabData([{ value: "Rating Result" }, { value: "Billing Result" }]);
    }
  }, [data]);

  //handleTab
  const handleSegmentedPage = (e) => {
    setSegmentedPage((prevState) => {
      const tempValue = e.target.value;
      if (tempValue !== prevState) {
        setPage(1);
        setPageSize(10);
        setSearch({});
        setSort("");
      }
      return tempValue;
    });
  };

  const tempTabs = useMemo(
    () => <RadioTabs data={tabData} onChange={handleSegmentedPage} />,
    [segmentedPage, handleSegmentedPage, tabData]
  );

  const renderSection = (segmentedPage) => {
    switch (segmentedPage) {
      case "Rating Result":
        return (
          <>
            <div className={"w-full flex justify-end gap-2 my-2"}>
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
            <div className="my-10">
              <TablePaginationNew
                columns={columnsCalculation(
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch,
                  search
                )}
                dataSource={list_calculation_result?.result}
                totalData={list_calculation_result?.page?.totalElements || 0}
                current={page}
                pageSize={pageSize}
                onChange={handleChangePage}
                tableScrolled={{ x: 2000, y: 600 }}
                onSort={onSort}
              />
            </div>
          </>
        );
      case "Billing Result":
        return (
          <>
            <div className={"w-full flex justify-end gap-2 my-2"}>
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
            <div className="my-10">
              <TablePaginationNew
                columns={columnsCalculation(
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch,
                  search
                )}
                dataSource={list_calculation_result?.result}
                totalData={list_calculation_result?.page?.totalElements || 0}
                current={page}
                pageSize={pageSize}
                onChange={handleChangePage}
                tableScrolled={{ x: 2000, y: 600 }}
                onSort={onSort}
              />
            </div>
          </>
        );
      default:
        return <></>;
    }
  };

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
        setPage(1);
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

  // change table pagination
  const handleChangePage = (page, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : page;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

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
    handleResetFilter()
  };

  const handleButtonNext = () => {
    next();
    scrollRightHandler();
    setPageCal(1);
    setPageSizeCal(10);
    setSearchTextCal("");
    setSearchedColumnCal("");
    handleResetFilter()
  };

  const handleResetFilter = () => {
    setPageCal(1);
    setPageSizeCal(10);
    setSearchedColumnCal("")
    setSearchTextCal("");
    setSearchRecalculate({})
  }

  const filterDataByPage = (data = [], type = "data") => {
    let result = [...data]?.map((item, index) => ({
      ...item,
      isTry: item?.isTry?.toString(),
      key: index + 1,
    }));

    return type === "data" ? result : result.length;
  };


  const steps = () => {
    let temp = [
      {
        title: "Choose Customer",
        content: (
          <>
            <p className="text-primary text-xs font-bold uppercase py-[20px] gap-5">
              CUSTOMER INFORMATION
            </p>
            {modalRecalculateRating ? (
              <div>
                <TablePaginationNew
                  type="FE"
                  dataSource={filterDataByPage(
                    (list_calculation_no_paging || []).filter(
                      (item) => item.calType !== 624 && !item.isTry
                    )?.map(item => {
                      return Object.fromEntries(
                        Object.entries(item).map(([key, value]) => [key, value === null ? "" : value])
                      );
                    }),
                    "data"
                  )}
                  columns={columnsRecalculate(
                    pageCal,
                    pageSizeCal,
                    searchInputCal,
                    searchedColumnCal,
                    searchTextCal,
                    handleSearchRecalculate,
                    searchRecalculate
                  )}
                  current={pageCal}
                  pageSize={pageSizeCal}
                  totalData={filterDataByPage(
                    (list_calculation_no_paging || []).filter(
                      (item) => item.calType !== 624 && !item.isTry
                    ),
                    "length"
                  )}
                  tableScrolled={{
                    x: 2500,
                    y: 525,
                  }}
                  rowSelection={rowSelection}
                  onChange={handleChangePageCal}
                />
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
            <p className="text-primary text-xs font-bold uppercase py-[20px] gap-5">
              CONFIRMATION
            </p>
            <div>
              <TablePaginationNew
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
                current={pageCal}
                pageSize={pageSizeCal}
                totalData={filterDataByPage(tableSelected, "length") || 0}
                tableScrolled={{ x: 2000, y: 525 }}
              />
              <div className={"mt-4"}>
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
    handleResetFilter()
  };

  const clearRetry = () => {
    form.resetFields();
    setOpenRetry(false);
  };

  console.log(tableSelected);

  const handleSave = () => {


    const accNumb = tableSelected?.map((item) => {
      return item?.accNumb;
    });

    const body = {
      accNumb: accNumb,
      calCode: data?.calCode,
      calType: segmentedPage === "Rating Result" ? 621 : 623,
      remark: forceObj?.remark,
      resultId: tableSelected?.filter(item => keyTableSelected?.includes(item?.key))?.map(item => item?.resultId),
    };
    dispatch(recalculateData(body))
      .unwrap()
      .then(() => {
        const reqSearch = encodeURIComponent(JSON.stringify(search));
        dispatch(
          getDetailCalculationResult({
            calCode: data?.calCode,
            calType: segmentedPage === "Rating Result" ? 621 : 623,
            page,
            pageSize,
            sort,
            search: reqSearch,
          })
        );
        dispatch(
          getDetailCalculationResultNoPaging({
            calCode: data?.calCode,
            calType: segmentedPage === "Rating Result" ? 621 : 623,
          })
        );
        handleClear();
      });
  };

  const handleRetry = (res, handleClear) => {
    setOpenRetry(false);
    const body = {
      calCode: data?.calCode,
      calType: segmentedPage === "Rating Result" ? 621 : 623,
      remark: res.remark,
    };
    dispatch(retryData(body))
      .unwrap()
      .then(() => {
        let tempSearch = "";
        for (const dataIndex in search) {
          if (Object.hasOwnProperty.call(search, dataIndex)) {
            const tempSearchText = search[dataIndex];
            if (tempSearchText) {
              tempSearch += `${dataIndex}~${tempSearchText},`;
            }
          }
        }
        tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
        const reqSearch = encodeURIComponent(JSON.stringify(search));
        dispatch(
          getDetailCalculationResult({
            calCode: data?.calCode,
            calType: segmentedPage === "Rating Result" ? 621 : 623,
            page,
            pageSize,
            sort,
            search: reqSearch,
          })
        );
        clearRetry();
        handleClear()
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

  return (
    <>
      <Spin spinning={loadingModal}>
        <BaseContainer header={"Calculation Information"}>
          <div className={"w-full grid grid-cols-4 gap-2"}>
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
            <DetailText label={"Status"}>
              {renderStatus(data?.status)}
            </DetailText>
          </div>
        </BaseContainer>

        <BaseContainer header={"parameter information"}>
          <div className={"w-full grid grid-cols-4 gap-2"}>
            <DetailText label={"Service Type"}>{data?.serviceType}</DetailText>
            <DetailText label={"SOR"}>{data?.sor}</DetailText>
            <DetailText label={"Cost Center"}>{data?.costCenter}</DetailText>
            <DetailText label={"Meter Reading Code"}>
              {data?.mreadingCode}
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
        </BaseContainer>

        <BaseContainer header={"schedule information"}>
          <div className={"w-full grid grid-cols-4"}>
            <DetailText label={"Type"}>{data?.scheduleType}</DetailText>
            <div className="col-span-3">
              <DetailText label={"Remark"}>{data?.remark}</DetailText>
            </div>
          </div>
        </BaseContainer>

        <BaseContainer header={"calculation result"}>
          {tempTabs}

          {renderSection(segmentedPage)}
        </BaseContainer>

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
            <div className="flex justify-end gap-5">
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
                        fontSize: 15, // Ubah ukuran ikon sesuai kebutuhan
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
                        fontSize: 15, // Ubah ukuran ikon sesuai kebutuhan
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
