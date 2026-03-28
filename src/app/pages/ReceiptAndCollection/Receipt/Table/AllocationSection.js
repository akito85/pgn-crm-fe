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
import { Spin, Form, Button, Tabs } from "antd";
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
import InputComponent from "../../../../../components/InputComponent";
import { FormStepper } from "../../../../../components/FormStepNavigation";
import TableRBI from "../../../../../components/TableRBI";

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

  // Fungsi untuk update amount tiap baris
  const handleEditAmount = (rowKey, newValue) => {
    // 1. Update data di tabel modal
    setDataRecomendation((prev) =>
      prev.map((item) =>
        item.key === rowKey ? { ...item, allocationAmount: Number(newValue) || 0 } : item
      )
    );

    // 2. Update data di tabel utama (HANYA kalau barisnya ada)
    setDataTable((prev) => {
      // Cek dulu, apakah row ini ada di tabel utama?
      const isExist = prev.some((item) => item.key === rowKey);
      
      // Kalau nggak ada (artinya kita lagi ngedit di dalam modal),
      // STOP di sini. Jangan return array baru biar useEffect nggak ke-trigger & nge-reset datanya!
      if (!isExist) return prev; 

      // Kalau ada, baru update angkanya
      return prev.map((item) =>
        item.key === rowKey ? { ...item, allocationAmount: Number(newValue) || 0 } : item
      );
    });
  };

  useEffect(() => {
    if (openModalAllocation && selectDataTable?.length > 0) {
      const newTotal = selectDataTable.reduce((total, row) => total + (row.allocationAmount || 0), 0);
      setTotalAllocationAmount(newTotal);
    }
  }, [selectDataTable, openModalAllocation]);

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
      try {
        // Validate specific fields from the Receipt form (tab 1)
        await form.validateFields([
          "miscellaneous", "accNumber", "cusNumber", "cusName", "accountName", 
          "segment", "accountGroupType", "accountType", "sor", "costCenterCode", 
          "costCenterName", "receiptCode", "receiptChannel", "paymentType", 
          "paymentGateway", "collectingAgent", "deliveryChannel", "method", 
          "bank", "receiptDate", "currency", "amount", "rateType", "rateDate", 
          "rateAmount", "convertedCurrency", "eqAmount", "description",
          "registrationNumber", "customerType", "partner"
        ]);
      } catch (err) {
        // If validation fails, show the exact fields
        if (err?.errorFields?.length > 0) {
          const failingFields = err.errorFields.map(f => f.name.join('.')).join(', ');
          console.log("Validation Error Fields:", err.errorFields);
          const errorBody = {
            title: "Alert",
            description: `Please input all mandatory form values! Missing: ${failingFields}`,
          };
          dispatch(showModalError(errorBody));
          return;
        }
      }

      if (hasValue(amount) === false || parsedAmount === 0) {
        const errorBody = {
          title: "Alert",
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
            accountNumberSelected: accountNumberSelected?.split(" - ")[0],
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
  const steps = [
    { title: "CHOOSE ALLOCATION" },
    { title: "APPROVAL" },
    { title: "ATTACHMENT" },
    { title: "CONFIRMATION" },
  ];

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-end">
        <ButtonComponent
          type={"submit"}
          icon={<SVGIcon name="IconButtonCreate" width={24} />}
          onClick={handleOpenModalAllocation}
          disabled={isInsert || rateAmountValue === 0}
        >
          Create
        </ButtonComponent>
      </div>

      <div className="w-full">
        <TableRBI
          columns={columnAllocation(
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            undefined,
            () => setOpenModalAllocation(true), // This is "Update" in main view? Usually it should open edit modal.
            (key) => {
              const newData = dataTable.filter((item) => item.key !== key);
              setDataTable(newData);
            }
          )}
          current={page}
          pageSize={pageSize}
          dataSource={updatePagination(
            dataTable,
            "data",
            searchedColumn,
            searchText,
            page,
            pageSize,
            typeColumn
          )}
          totalData={updatePagination(
            dataTable,
            "length",
            searchedColumn,
            searchText,
            page,
            pageSize,
            typeColumn
          )}
          tableScrolled={{ x: 1500, y: 500 }}
          onChange={(p, s) => {
            setPage(p);
            setPageSize(s);
          }}
          actionFix={true}
        />
      </div>

      <div className="w-full flex flex-col items-end text-sm text-[#4B465C] opacity-80">
        {totalAllocationAmount > parsedAmount && (
          <span className="text-red-800">
            Total amount of selected item has been exceeded Total available
            amount. Please select other item.
          </span>
        )}
        <div className="flex gap-4 mt-2">
          <span>
            Total Amount :{" "}
            <strong>
              {totalAllocationAmount?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
          </span>
          <span>
            Balance :{" "}
            <strong>
              {balance === 0
                ? 0
                : balance?.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
            </strong>
          </span>
        </div>
      </div>
      <ModalCustom
        isOpen={openModalAllocation}
        handleCancel={handleCancel}
        type={"confirmation"}
        header={"CREATE ALLOCATION"}
        width={1200}
        footer={null}
      >
        <div className="w-full gap-5">
          <FormStepper
            steps={steps}
            current={currentStep}
            onPrev={handlePrev}
            onNext={handleNext}
          />

          <Form layout="vertical" className="mt-3" form={modalForm}>
            <Spin spinning={loading}>
              {/* Step 1: Allocation Information */}
              <div style={{ display: currentStep === 0 ? "block" : "none" }}>
                <p className="text-primary text-xl font-semibold uppercase py-[20px] gap-5">
                  ALLOCATION LIST
                </p>
                <div className="my-5">
                  <TableRBI
                    columns={columnRecommendation(
                      pageChoose,
                      pageSizeChoose,
                      searchInput,
                      searchedColumnChoose,
                      searchTextChoose,
                      handleSearchModal,
                      undefined,
                      handleEditAmount
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
                    tableScrolled={{ x: 1800, y: 500 }}
                    onChange={handleChange}
                    rowSelection={rowSelection}
                    onSizeChanger={handleChange}
                    actionFix={true}
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
                  <Tabs
                    activeKey={confirmationTab || "Allocation"}
                    onChange={(key) => setConfirmationTab(key)}
                    items={[
                      { label: "Allocation", key: "Allocation" },
                      { label: "Approval", key: "Approval" },
                      { label: "Attachment", key: "Attachment" },
                    ]}
                  />
                  <div className="flex flex-col gap-4">


                    {/* Allocation Info Tab */}
                    {(confirmationTab === "Allocation" || !confirmationTab) && (
                      <>
                        <TableRBI
                          columns={columnRecommendation(
                            pageChoose,
                            pageSizeChoose,
                            searchInput,
                            searchedColumnChoose,
                            searchTextChoose,
                            handleSearchModal,
                            undefined,
                            handleEditAmount,
                            true
                          )}
                          dataSource={selectDataTable}
                          usePagination={false}
                          tableScrolled={{ x: 1800, y: 300 }}
                        />
                        {/* <DetailText label={"Remark"}>
                          {forceObj?.remark}
                        </DetailText>
                        <div className="mt-2">
                          <strong>Total Amount:</strong>{" "}
                          {totalAllocationAmount?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </div> */}
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

        {/* Custom Footer without Clear Data and Save as Draft */}
        <div className="bg-white rounded-lg border border-[#D6E1F0] p-4 mt-6">
          <div className="flex w-full justify-between items-center">
            <ButtonComponent
              onClick={handleCancel}
              className="!border-[#0075BF] !text-[#0075BF]"
            >
              Cancel
            </ButtonComponent>
            <div className="flex items-center gap-3">
              <Button
                disabled={currentStep === 0}
                onClick={handlePrev}
                style={{
                  backgroundColor: currentStep === 0 ? "#E0E3E9" : "#fff",
                  borderColor: currentStep === 0 ? "#E0E3E9" : "#DADDE5",
                  color: currentStep === 0 ? "#BFC4D0" : "#4B465C",
                  borderRadius: "6px",
                  height: "32px",
                  fontSize: "12px",
                  border: "1px solid #DADDE5",
                }}
              >
                Previous
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button
                  key="btn-next"
                  htmlType="button"
                  onClick={handleNext}
                  type="primary"
                  disabled={
                    (currentStep === 0 &&
                      (selectDataTable.length === 0 || !forceObj.remark)) ||
                    (currentStep === 1 && !forceObj.approvalHierarchy)
                  }
                  style={{
                    backgroundColor: "#0075BF",
                    borderColor: "#0075BF",
                    color: "#fff",
                    borderRadius: "6px",
                    height: "32px",
                    fontSize: "12px",
                  }}
                >
                  Next
                </Button>
              ) : (
                  <Button
                    key="btn-confirm"
                    htmlType="button"
                    onClick={handleSaveDataTable}
                    type="primary"
                    style={{
                      backgroundColor: "#28a745",
                      borderColor: "#28a745",
                      color: "#fff",
                      borderRadius: "6px",
                      height: "32px",
                      fontSize: "12px",
                    }}
                  >
                    Confirm
                  </Button>
              )}
            </div>
          </div>
        </div>
      </ModalCustom>
    </div>
  );
};

export default AllocationSection;
