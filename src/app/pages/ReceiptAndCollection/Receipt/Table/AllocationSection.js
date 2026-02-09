import React, { useEffect, useRef, useState } from "react";
import TableInlineAllocation from "./TableInlineAllocation";
import { columnAllocation } from "./ColumnAllocation";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import moment from "moment";
import {
  dateFormatting,
  formMessageRequired,
  hasValue,
} from "../../../../../utils";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import TablePagination from "../../../../../components/TablePagination";
import { Spin, Steps, Form, Input, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import RadioTabs from "../../../../../components/RadioTabs";
import DetailText from "../../../../../components/DetailText";
import AttachmentSectionForm from "../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import { getAllocationRecomendationList } from "../../../../../redux/slices/receipt_collection/receipt";
import { showModalError } from "../../../../../redux/slices/general_slice";
import { columnRecommendation } from "./ColumnRecomendation";
import { updatePagination } from "../../../../../utils/updatePagination";
import ApprovalSectionForm from "../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import {
  getAllApprovalList,
  getListApprovalById,
  getListCategory,
} from "../../../../../redux/slices/receipt_collection/electrionicBank";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import InputComponent from "../../../../../components/InputComponent";

const AllocationSection = ({
  dataTable,
  setDataTable = () => {},
  setIsInsert = () => {},
  isInsert,
  amount,
  totalAllocationAmount,
  setTotalAllocationAmount = () => {},
  accountNumberSelected,
  rateAmountValue,
  formValues,
  form,
  currencyId,
}) => {
  console.log("🚀 ~ formValues:", formValues);
  const {
    loading,
    data_table_allocation,
    data_selected_allocation,
    data_recomendation_allocation,
  } = useSelector((state) => state?.receipt);
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  // state
  const [page, setPage] = useState(1);
  const [pageChoose, setPageChoose] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizeChoose, setPageSizeChoose] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchedColumnChoose, setSearchedColumnChoose] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchTextChoose, setSearchTextChoose] = useState("");

  const [openModalAllocation, setOpenModalAllocation] = useState(false);
  const [selectDataTable, setSelectDataTable] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataRecomendation, setDataRecomendation] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [typeColumn, setTypeColumn] = useState("");

  // New States for Wizard
  const [currentStep, setCurrentStep] = useState(0);
  const [confirmationTab, setConfirmationTab] = useState("Allocation");
  const [forceObj, setForceObj] = useState({});
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const { dataListAppHierId, dataListAppHierDetail } = useSelector(
    (state) => state.electronic,
  );

  // Load Approval Hierarchy List
  useEffect(() => {
    dispatch(getAllApprovalList());
  }, []);

  // Set Approval Options
  useEffect(() => {
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);

  // Load Approval Detail when hierarchy selected
  useEffect(() => {
    if (forceObj.approvalHierarchy) {
      dispatch(getListApprovalById(forceObj.approvalHierarchy));
    }
  }, [forceObj]);

  // Set Approval Detail Data
  useEffect(() => {
    if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
      const data = dataListAppHierDetail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setAppHierDataDetail(data);
    } else {
      setAppHierDataDetail([]);
    }
  }, [dataListAppHierDetail]);

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

    // Manual sync for form validation
    if (type === "approvalHierarchy") {
      modalForm.setFieldsValue({ approvalHierarchy: result });
    }

    return result;
  };
  // helper to parse formatted amount
  const parseAmount = (val) => {
    if (typeof val === "number") return val;
    // Remove dots (thousand separators) and replace comma with dot (decimal)
    const normalized = val?.toString()?.replace(/\./g, "").replace(/,/g, ".");
    return parseFloat(normalized);
  };

  const parsedAmount = parseAmount(amount);
  const balance = parsedAmount - totalAllocationAmount;
  // use effec
  const [modalForm] = Form.useForm();

  useEffect(() => {
    if (data_recomendation_allocation) {
      if (dataTable?.length > 0) {
        // const updatedDataRecomendation = dataRecomendation.map(recommendation => {
        //     const matchingDataRow = dataTable.find(dataRow => dataRow.key === recommendation.key);
        //     if (matchingDataRow) {
        //         return {
        //             ...recommendation,
        //             allocationAmount: matchingDataRow.allocationAmount,
        //             allocationStatus: matchingDataRow?.allocationStatus
        //         };
        //     }
        //     return recommendation;
        // });
        // setDataRecomendation(updatedDataRecomendation);
        setDataRecomendation(
          dataRecomendation.filter(
            (item) => !dataTable.some((obj) => obj.key === item.key),
          ),
        );
      } else {
        setDataRecomendation(
          data_recomendation_allocation
            ?.filter(
              (item) =>
                item?.billingItemAmount !== 0 &&
                (item?.allocationStatus === "Unpaid" ||
                  item?.allocationStatus === "Partially Paid"),
            )
            ?.map((item) => ({
              ...item,
              key: item?.id,
              billingPeriod: moment(item?.billingPeriod)?.format(
                dateFormatting?.datePeriod,
              ),
              createdDate: moment(item.createdDate).format(
                dateFormatting?.dateTime,
              ),
            })),
        );
      }
    }
  }, [data_recomendation_allocation, dataTable]);

  // set selected row by balance
  useEffect(() => {
    if (dataRecomendation && dataTable?.length === 0) {
      setSelectedRowKeys(dataRecomendation?.map((item) => item?.key));
    }
  }, [dataRecomendation]);

  // count total amount
  useEffect(() => {
    if (dataTable?.length > 0) {
      setTotalAllocationAmount(
        dataTable?.reduce((total, row) => total + row.allocationAmount, 0),
      );
    } else {
      setTotalAllocationAmount(0);
    }
  }, [dataTable]);

  // update table selected data
  useEffect(() => {
    if (openModalAllocation) {
      setSelectDataTable(
        dataRecomendation?.filter((item) =>
          selectedRowKeys?.includes(item?.key),
        ),
      );
    }
  }, [selectedRowKeys, openModalAllocation, dataRecomendation]);

  // handle search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    switch (dataIndex) {
      case "billingItemAmount":
      case "allocationAmount":
      case "billingItemBalance":
      case "equivalentAmount":
        setTypeColumn("number");
        setSearchText(selectedKeys[0]);
        break;
      case "createdDate":
        setTypeColumn("datetime");
        setSearchText(
          moment(selectedKeys[0])?.format(dateFormatting?.dateTime),
        );
        break;
      case "billingPeriod":
        setTypeColumn("datePeriod");
        setSearchText(
          moment(selectedKeys[0])?.format(dateFormatting?.datePeriod),
        );
        break;
      default:
        setTypeColumn("string");
        setSearchText(selectedKeys[0]);
        break;
    }
    confirm();
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

  // handle search
  const handleSearchModal = (selectedKeys, confirm, dataIndex) => {
    switch (dataIndex) {
      case "billingItemAmount":
      case "allocationAmount":
      case "billingItemBalance":
      case "equivalentAmount":
        setTypeColumn("number");
        setSearchTextChoose(selectedKeys[0]);
        break;
      case "createdDate":
        setTypeColumn("datetime");
        setSearchTextChoose(
          moment(selectedKeys[0])?.format(dateFormatting?.dateTime),
        );
        break;
      case "billingPeriod":
        setTypeColumn("datePeriod");
        setSearchTextChoose(
          moment(selectedKeys[0])?.format(dateFormatting?.datePeriod),
        );
        break;
      default:
        setTypeColumn("string");
        setSearchTextChoose(selectedKeys[0]);
        break;
    }
    confirm();
    setSearchedColumnChoose(selectedKeys[0] ? dataIndex : "");
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

  // filtered column
  const filteredColumns = columnAllocation(
    pageChoose,
    pageSizeChoose,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch,
  )?.filter(
    (item) =>
      item?.dataIndex !== "allocationCode" &&
      item?.dataIndex !== "allocationNumber" &&
      item?.dataIndex !== "allocationDate",
  );

  // handle open modal allocation
  const handleOpen = () => {};

  // handle close modal allocation
  const handleCancel = () => {
    if (totalAllocationAmount > parsedAmount) {
      setSelectedRowKeys([]);
      setSelectDataTable([]);
      setTotalAllocationAmount(0);
    }
    setOpenModalAllocation(false);
    setPageChoose(1);
    setPageSizeChoose(10);
    setSearchTextChoose("");
    setSearchedColumnChoose("");

    // Reset Wizard State
    setCurrentStep(0);
    setForceObj({});
    setListDataAttachment([]);
    setConfirmationTab("Allocation");
    modalForm.resetFields();
  };

  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  // const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
  // const updatedSelectedRows = [...selectDataTable, ...newSelectedRows];
  // console.log(updatedSelectedRows, ' update');
  // const uniqueSelectedRows = Array.from(new Set(updatedSelectedRows.map(row => row.key)))
  //     .map(key => updatedSelectedRows.find(row => row.key === key));
  // setSelectDataTable(uniqueSelectedRows);
  // const totalAmount = uniqueSelectedRows.reduce((total, row) => total + row.allocationAmount, 0);
  // setTotalAllocationAmount(totalAmount);
  // setSelectedRowKeys(updatedSelectedRows?.map(item => item?.key));
  // console.log(selectedRowKeys, ' selected');
  // console.log(newSelectedRowKeys, ' new selected');
  // setSelectedRowKeys(prevState => [...prevState, ...newSelectedRowKeys]);
  // setSelectDataTable(dataRecomendation?.filter(item => selectedRowKeys?.includes(item?.key)))
  // };

  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    onChange: onSelectChange,
    // selections: [
    //     Table.SELECTION_ALL,
    //     Table.SELECTION_INVERT,
    //     Table.SELECTION_NONE
    // ]
  };

  // handle change choose pagination
  const handleChange = (pageChange, pageSizeChange) => {
    setPageChoose(pageSizeChoose !== pageSizeChange ? 1 : pageChange);
    setPageSizeChoose(pageSizeChange);
    // setSelectedRowKeys([]);
    // setSelectDataTable([]);
  };

  const { userData } = useSelector((state) => state.auth);

  // handle save data table
  const handleSaveDataTable = () => {
    if (totalAllocationAmount > parsedAmount) {
    } else {
      // dispatch(setDataAllocation(selectDataTable));
      // Merge new data (Approval, Remark, Attachment) into the selected rows
      // Note: Since these are technically "header" info for the allocation SET,
      // we might need to attach them to EACH row, or the backend expects them differently.
      // Based on typical table-inline patterns, we'll attach them to the objects.

      const enrichedData = selectDataTable.map((row) => ({
        ...row,
        remark: forceObj.remark,
        approvalHierarchyId: forceObj.approvalHierarchy,
        attachments: listDataAttachment,
        createdBy: userData?.userName,
      }));

      setDataTable((prev) => [...prev, ...enrichedData]);

      // handleCancel();
      setOpenModalAllocation(false);
      setPageChoose(1);
      setPageSizeChoose(10);
      setCurrentStep(0);
      setForceObj({});
      setListDataAttachment([]);
      modalForm.resetFields();
    }
  };

  const handleOpenModalAllocation = async () => {
    try {
      const { apphierId, receiptCode, refrence, isMisc, ...keys } =
        form?.getFieldsValue();

      const checkValues = Object.values(keys).every((value) => {
        return value !== undefined && value !== null && value !== "";
      });
      // setSelectedRowKeys([]);
      // setSelectDataTable([]);
      console.log(checkValues);
      if (checkValues === false) {
        const errorBody = {
          title: "Failed",
          description: `Please input values!`,
        };
        dispatch(showModalError(errorBody));
      } else if (hasValue(amount) === false || parsedAmount === 0) {
        const errorBody = {
          title: "Failed",
          description: `Please input amount!`,
        };
        dispatch(showModalError(errorBody));
      } else {
        await dispatch(
          getAllocationRecomendationList({
            search: encodeURIComponent(JSON?.stringify(search)),
            pageChoose,
            pageSizeChoose,
            sort: sort,
            accountNumberSelected,
            balance: balance,
            currencyId: formValues?.currency,
            rateAmount: rateAmountValue,
          }),
        )?.unwrap();
        setOpenModalAllocation(true);
      }
    } catch (error) {
      setOpenModalAllocation(false);
    }
  };

  // handle sort
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  return (
    <div className="w-full items-end flex flex-col gap-5">
      <ButtonComponent
        type={"submit"}
        icon={<SVGIcon name="IconButtonCreate" width={24} />}
        onClick={handleOpenModalAllocation}
        disabled={isInsert || rateAmountValue === 0}
      >
        Create
      </ButtonComponent>
      <div className="w-full">
        <TableInlineAllocation
          cols={columnAllocation(
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
          )}
          current={page}
          pageSize={pageSize}
          scrollTable={{ x: 3500, y: 500 }}
          actionFix={true}
          tableData={updatePagination(
            dataTable,
            "data",
            searchedColumn,
            searchText,
            pageChoose,
            pageSizeChoose,
            typeColumn,
          )}
          setInserted={setIsInsert}
          onDataChange={setDataTable}
          totalData={updatePagination(
            dataTable,
            "length",
            searchedColumn,
            searchText,
            pageChoose,
            pageSizeChoose,
            typeColumn,
          )}
          setUpdateSelectDataTable={setSelectDataTable}
          setUpdateSelectRowKeys={setSelectedRowKeys}
          setUpdateTotalAmount={setTotalAllocationAmount}
          rateAmount={rateAmountValue}
          currency={currencyId}
          // onSort={onSort}
          // dispatcher={dispatch}
        />
      </div>
      <div className="w-full flex flex-col">
        {totalAllocationAmount > parsedAmount && (
          <span className="text-red-800">
            Total amount of selected item has been exceeded Total available
            amount. Please select other item.
          </span>
        )}
        <span>
          {" "}
          Total Amount :{" "}
          {totalAllocationAmount?.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
        <span>
          {" "}
          Balance :{" "}
          {balance === 0
            ? 0
            : balance?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
        </span>
      </div>
      <ModalCustom
        isOpen={openModalAllocation}
        handleCancel={handleCancel}
        type={"confirmation"}
        header={"Choose Allocation"}
        width={1200}
        footer={
          <div className="flex justify-end gap-5">
            <ButtonComponent type={"default"} onClick={handleCancel}>
              Back
            </ButtonComponent>
            {currentStep > 0 ? (
              <ButtonComponent
                type={"submit"}
                onClick={() => setCurrentStep(currentStep - 1)}
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

            {currentStep < 3 && ( // 3 is index of Confirmation step
              <ButtonComponent
                type={"submit"}
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={
                  (currentStep === 0 &&
                    (selectDataTable.length === 0 || !forceObj.remark)) || // Step 1: Selection + Remark
                  (currentStep === 1 && !forceObj.approvalHierarchy) // Step 2: Approval
                  // Step 3 (Attachment) is optional? Usually yes, or check listDataAttachment.length === 0
                }
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
            {currentStep === 3 && (
              <ButtonComponent
                type={"submit"}
                htmlType={"submit"}
                onClick={handleSaveDataTable}
              >
                Confirm
              </ButtonComponent>
            )}
          </div>
        }
      >
        <div className="w-full gap-5">
          <div className="overflow-x-scroll scrollStepsCstm gap-5">
            <Steps
              current={currentStep}
              items={[
                { title: "Allocation Information" },
                { title: "Approval Information" },
                { title: "Attachment Information" },
                { title: "Confirmation" },
              ]}
              labelPlacement="vertical"
            />
          </div>

          <Form layout="vertical" className="mt-3" form={modalForm}>
            <Spin spinning={loading}>
              {/* Step 1: Allocation Information */}
              <div style={{ display: currentStep === 0 ? "block" : "none" }}>
                <p className="text-primary text-xl font-semibold uppercase py-[20px] gap-5">
                  RECEIPT ON BANK STATEMENT
                </p>
                <div className="my-5">
                  <TablePagination
                    columns={columnRecommendation(
                      pageChoose,
                      pageSizeChoose,
                      searchInput,
                      searchedColumnChoose,
                      searchTextChoose,
                      handleSearchModal,
                    )}
                    current={pageChoose}
                    pageSize={pageSizeChoose}
                    dataSource={updatePagination(
                      dataRecomendation,
                      "data",
                      searchedColumnChoose,
                      searchTextChoose,
                      pageChoose,
                      pageSizeChoose,
                      typeColumn,
                    )}
                    totalData={updatePagination(
                      dataRecomendation,
                      "length",
                      searchedColumnChoose,
                      searchTextChoose,
                      pageChoose,
                      pageSizeChoose,
                      typeColumn,
                    )}
                    tableScrolled={{ x: 3500, y: 500 }}
                    onChange={handleChange}
                    rowSelection={rowSelection}
                    onSizeChanger={handleChange}
                  />
                </div>
                {totalAllocationAmount > parsedAmount && (
                  <span className="text-red-800">
                    Total amount of selected item has been exceeded Total
                    available amount. Please select other item.
                  </span>
                )}
                <div className="mt-4">
                  <Form.Item
                    label={"Remark"}
                    required
                    validateStatus={!forceObj.remark ? "error" : "success"}
                    help={!forceObj.remark ? "Please input your Remark!" : null}
                  >
                    <InputComponent
                      rows={5}
                      type="textarea"
                      value={forceObj.remark}
                      onChange={(e) => handleForceObj(e, "remark")}
                    />
                  </Form.Item>
                </div>
              </div>

              {/* Step 2: Approval Information */}
              <div style={{ display: currentStep === 1 ? "block" : "none" }}>
                <div className="my-5 gap-5">
                  <ApprovalSectionForm
                    dataTable={appHierDataDetail}
                    dataOption={appHierOptions}
                    selectedHierarchy={forceObj.approvalHierarchy}
                    updateSelectedHierarchy={(e) =>
                      handleForceObj(e, "approvalHierarchy")
                    }
                  />
                </div>
              </div>

              {/* Step 3: Attachment Information */}
              <div style={{ display: currentStep === 2 ? "block" : "none" }}>
                <div className="my-5 gap-5">
                  <AttachmentComponent
                    data={listDataAttachment}
                    updateData={setListDataAttachment}
                    typeSelector="electronic"
                    dispatch={dispatch}
                    getAPICategory={getListCategory}
                    service={receiptCollectionHttpService}
                    configApplication={configApp.PAYMENT_SERVICE}
                    typeRBI={"data"}
                  />
                </div>
              </div>

              {/* Step 4: Confirmation */}
              <div style={{ display: currentStep === 3 ? "block" : "none" }}>
                <div className="flex flex-col gap-4">
                  <RadioTabs
                    data={[
                      { value: "Allocation" },
                      { value: "Approval" },
                      { value: "Attachment" },
                    ]}
                    onChange={(e) => setConfirmationTab(e.target.value)}
                    currentPosition={confirmationTab || "Allocation"}
                  />
                  <div className="flex flex-col gap-4">
                    <div className="text-primary text-sm font-bold uppercase">
                      {`${confirmationTab || "Allocation"} INFORMATION`}
                    </div>

                    {/* Allocation Info Tab */}
                    {(confirmationTab === "Allocation" || !confirmationTab) && (
                      <>
                        <TablePagination
                          columns={columnRecommendation(
                            pageChoose,
                            pageSizeChoose,
                            searchInput,
                            searchedColumnChoose,
                            searchTextChoose,
                            handleSearchModal,
                          )}
                          dataSource={selectDataTable}
                          usePagination={false}
                          tableScrolled={{ x: 3500, y: 300 }}
                        />
                        <DetailText label={"Remark"}>
                          {forceObj?.remark}
                        </DetailText>
                        <div className="mt-2">
                          <strong>Total Amount:</strong>{" "}
                          {totalAllocationAmount?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                      </>
                    )}

                    {/* Approval Info Tab */}
                    {confirmationTab === "Approval" && (
                      <ApprovalSectionForm
                        showSelect={false}
                        disableSelect={true}
                        approvalName={
                          (appHierOptions || []).filter(
                            (data) => data.value === forceObj.approvalHierarchy,
                          )?.[0]?.name || ""
                        }
                        dataTable={appHierDataDetail}
                        selectedHierarchy
                      />
                    )}

                    {/* Attachment Info Tab */}
                    {confirmationTab === "Attachment" && (
                      <AttachmentSectionForm
                        type={"preview"}
                        data={listDataAttachment}
                      />
                    )}
                  </div>
                </div>
              </div>
            </Spin>
          </Form>
        </div>
      </ModalCustom>
    </div>
  );
};

export default AllocationSection;
