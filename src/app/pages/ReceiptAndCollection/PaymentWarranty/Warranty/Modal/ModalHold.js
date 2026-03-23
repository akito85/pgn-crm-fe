// VERIFICATION_TAG: 2026-02-17-001
import React, { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Steps, Form, Select, Checkbox, Tooltip, message, Tabs } from "antd";
import { DownOutlined, RightOutlined, LeftOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../../assets/Icon/index";

// Utils
import { IconModal } from "../../../../../../utils/Icon";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";

// Global Custom Components
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import InputComponent from "../../../../../../components/InputComponent";
import DetailText from "../../../../../../components/DetailText";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import TableRBI from "../../../../../../components/TableRBI";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import { useColumnActionPermission } from "../../../../../../components/ColumnActionPermission";
import RadioTabs from "../../../../../../components/RadioTabs";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";

// Column Configuration
import { columnsCustomerInfo } from "./Table/TableCustomerInfo";
import { columnsWarrantyInfo } from "./Table/TableWarrantyInfo";
import { columnsHoldInfo } from "./Table/TableHoldInfo";
import { columnsAttachmentInfo } from "./Table/TableAttachmentInfo";

// Redux / Service
import { configApp, API_ENDPOINTS } from "../../../../../../constants/configApp";
import receiptCollectionHttpService from "../../../../../../redux/services/receiptCollectionHttpService";
import {
  getHoldListPaginate,
  getHoldDetailList,
  submitHold,
  getAllApprovalList,
  getListApprovalById,
  getListCategory,
} from "../../../../../../redux/slices/receipt_collection/warranty";

import { FormStepper, FormFooter } from "../../../../../../components/FormStepNavigation";
import ApprovalSectionForm from "../../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import { WARRANTY_TRANSACTION_NAMES} from "../../../../../../constants/warrantyTypes";

const ModalHold = ({
  isOpen,
  handleBack = () => {},
  handleRefresh = () => {},
  handleOpenModal = () => {},
  selectedRow = null,
}) => {
  // Selector
  const {
    dataHoldList,
    data_attachment_info,
    dataListAppHierId,
    dataListAppHierDetail,
    loadingHoldList,
  } = useSelector((state) => state.warranty);


  // Declaration
  const containerRef = useRef(null);
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const dataSourceCustomerInfo = []; // Not used anymore in this modal logic
  const dataSourceWarrantyInfo = dataHoldList?.result || [];
  const dataSourceHoldInfo = []; // Derived from selection
  const dataSourceAttachmentInfo = data_attachment_info?.result || [];

  // Global State
  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);


  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [boolean, setBoolean] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [selectedCustomerInfoRowKeys, setSelectedCustomerInfoRowKeys] = useState([]);
  const [dataCustomerInfoSelect, setDataCustomerInfoSelect] = useState([]);
  const [selectedWarrantyInfoRowKeys, setSelectedWarrantyInfoRowKeys] = useState([]);
  const [dataWarrantyInfoSelect, setDataWarrantyInfoSelect] = useState([]);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  // Approval State
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState(null);
  const [approvalName, setApprovalName] = useState("-");

  const [fixedColumns, setFixedColumns] = useState({
    left: ["no"],
    right: [] 
  });


  // Function Search API
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

  // Handle Change Page
  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // Sort Table
  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Define Wizard Step
  const steps = [
    {
      title: "Guarantee Information",
      key: "warrantyInfo",
    },
    {
      title: "Hold Information",
      key: "holdInfo",
    },
    {
      title: "Approval",
      key: "approvalInfo",
    },
    {
      title: "Attachment Information",
      key: "attachmentInfo",
    },
    {
      title: "Confirmation",
      key: "confirmation",
    },
  ];

  const next = () => {
    if (current === 0 && selectedWarrantyInfoRowKeys.length === 0) {
      return message.warning("Please select Guarantee Information!");
    }
    if (current === 1) {
      if (!remarkHoldInformation) {
        return message.warning("Please input your Remark!");
      }
    }
    if (current === 2 && !selectedHierarchy) {
      return message.warning("Please select Approval Hierarchy!");
    }
    setCurrent(current + 1);
  };

  // Button Previous
  const prev = () => {
    setCurrent(current - 1);
  };

  // Scroll Left Handler
  const scrollLeftHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 250;
    }
  };

  // Scroll Right Handler
  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };

  // Scroll Handler
  const handleScroll = () => {
    if (containerRef.current) {
      setScrollLeft(containerRef.current.scrollLeft);
    }
  };

  // Handle Next
  const handleButtonNext = () => {
    next();
    scrollRightHandler();
  };

  // Mapping Step
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  //  Handle Select Approval Hierarchy
  const handleSelect = (e) => {
    setBoolean(true);
  };

  const clearAllState = (preSelectedRow) => {
    setSelectedCustomerInfoRowKeys([]);
    setDataCustomerInfoSelect([]);
    
    if (preSelectedRow) {
      const rowKey = preSelectedRow.billingCode || preSelectedRow.invoiceNumber || preSelectedRow.id;
      setSelectedWarrantyInfoRowKeys([rowKey]);
      setDataWarrantyInfoSelect([{ ...preSelectedRow, key: rowKey }]);
      setCurrent(0); // Start at Step 1 (Guarantee Info selection)
    } else {
      setSelectedWarrantyInfoRowKeys([]);
      setDataWarrantyInfoSelect([]);
      setCurrent(0);
    }

    setRemarkHoldInformation("");
    setListDataAttachment([]);
    setSelectedHierarchy(null);
    setSearch({});
    setPage(1);
    setSort("");
    setSearchText("");
    setSearchedColumn("");
    setValuePage("Hold");
    setBoolean(false);
    form.resetFields();
  };

  useEffect(() => {
    if (isOpen) {
      clearAllState(selectedRow);
    }
  }, [isOpen, selectedRow]);

  // Handle Back Form
  const handleBackForm = () => {
    handleBack();
    clearAllState();
  };

  const tabItems = [
    { key: "Hold", label: "Hold Info" },
    { key: "Approval", label: "Approval" },
    { key: "Attachment", label: "Attachment" },
  ];
  
  const [valuePage, setValuePage] = useState("Hold");
  const onChange = (key) => { // Changed to receive key directly
    setValuePage(key);
  };

  const handleCloseModalError = () => {
    setModalError(false);
    handleOpenModal();
    setBodyError({});
  };

  const handleRetry = () => {
    handleSave();
    setModalError(false);
    setBodyError({});
  };

  const [loadingSave, setLoadingSave] = useState(false);

  // Handle Save for Modal Confirmation
  const handleSave = async (formValue) => {
    setLoadingSave(true);
    
    try {
      // 1. Prepare and submit the hold request first (before attachments)
      const submitBody = {
        type: WARRANTY_TRANSACTION_NAMES.HOLD,
        appHierId: selectedHierarchy,
        items: dataWarrantyInfoSelect.map((item) => ({
          payWarrantyId: item.id,
          amount: item.currencyBalance || 0,
          currency: item.currency || "IDR",
        })),
        remark: remarkHoldInformation,
      };

      // 2. Dispatch the specific thunk
      const submitRes = await dispatch(submitHold(submitBody)).unwrap();
      // 3. Upload new attachments per transId
      const transIds = Array.isArray(submitRes?.data?.transIds) ? submitRes.data.transIds : [];
      if (transIds.length === 0) {
        message.warning('Transaction ID tidak ditemukan, attachment tidak dapat diupload');
        setLoadingSave(false);
        return;
      }

      const newAttachments = listDataAttachment.filter(item => item.dataType !== "exist");
      if (newAttachments.length > 0) {
        for (const transId of transIds) {
          for (const element of newAttachments) {
            const uploadBody = {
              referensiId: transId, // Link attachment to the returned transaction ID
              files: element.file,
              category: "PAYMENT_WARRANTY_TRANS",
              fileCategoryId: element.fileCategoryId,
            };
            await receiptCollectionHttpService.uploadImage(API_ENDPOINTS.UPLOAD_ATTACHMENT, uploadBody);
          }
        }
      }

      // 4. Cleanup and close
      handleRefresh();
      handleBack();
      clearAllState();
      setLoadingSave(false);
    } catch (error) {
      setLoadingSave(false);
      let message = error?.response?.data?.message || error?.message || error?.toString();

      if (message && typeof message === "object") {
        if (Array.isArray(message)) {
          message = message.join(", ");
        } else {
          message = Object.values(message)
            .map((val) => (typeof val === "object" ? JSON.stringify(val) : val))
            .join(", ");
        }
      }

      setBodyError({ message, type: "requested" });
      setModalError(true);
    }
  };


  // Guarantee Information Step
  useEffect(() => {
    if (isOpen && current === 0) {
      const finalSearch = Object.keys(search).length > 0 
        ? Object.entries(search)
            .filter(([_, value]) => value !== undefined && value !== "")
            .map(([key, value]) => `${key}~${value}`)
            .join("|") 
        : "";

      dispatch(
        getHoldListPaginate({
          search: finalSearch,
          page,
          pageSize,
          sort,
        })
      );
    }
  }, [dispatch, isOpen, search, page, pageSize, sort, current]);

  useEffect(() => {
    if (isOpen && current === 2) {
      dispatch(getAllApprovalList());
    }
  }, [dispatch, isOpen, current]);

  useEffect(() => {
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);

  useEffect(() => {
    if (selectedHierarchy) {
      dispatch(getListApprovalById({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  useEffect(() => {
    if (dataListAppHierDetail?.length > 0) {
      const data = dataListAppHierDetail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail?.map((b, idx) => ({
          ...b,
          key: idx + 1,
        })) || [],
      }));
      setAppHierDataDetail(data);
    } else {
      setAppHierDataDetail([]);
    }
  }, [dataListAppHierDetail]);

  const dataSourceCustomerInfoWithKeys = useMemo(() => {
    return dataSourceCustomerInfo?.map((item, index) => ({
      ...item,
      key: index + 1,
    }));
  }, [dataSourceCustomerInfo]);
  
  const baseColumnsCustomerInfo = useMemo(
    () =>
      columnsCustomerInfo(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [page, pageSize, searchedColumn, searchText]
  );

  const allColumnsCustomerInfo = useMemo(() => {
    const columnsWithKeys = baseColumnsCustomerInfo.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumnsCustomerInfo]);

  const processedColumnsCustomerInfo = useMemo(() => {
    return applyFixedColumns(allColumnsCustomerInfo, fixedColumns);
  }, [allColumnsCustomerInfo, fixedColumns]);

  const columnDefinitionsCustomerInfo = useMemo(() => {
    return allColumnsCustomerInfo.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumnsCustomerInfo]);
  
  const onSelectChangeCustomerInfo = (newSelectedCustomerInfoRowKeys, newSelectedRow) => {
    setDataCustomerInfoSelect(newSelectedRow);
    setSelectedCustomerInfoRowKeys(newSelectedCustomerInfoRowKeys);
  };

  const rowSelectionCustomerInfo = {
    fixed: true,
    selectedRowKeys: selectedCustomerInfoRowKeys,
    onChange: onSelectChangeCustomerInfo,
  };

  const dataSourceWarrantyInfoWithKeys = useMemo(() => {
    if (selectedRow) {
      const rowKey = selectedRow.billingCode || selectedRow.invoiceNumber || selectedRow.id;
      return [{ ...selectedRow, key: rowKey }];
    }
    return dataSourceWarrantyInfo?.map((item, index) => ({
      ...item,
      key: index + 1,
    }));
  }, [dataSourceWarrantyInfo, selectedRow]);
  
  const baseColumnsWarrantyInfo = useMemo(
    () =>
      columnsWarrantyInfo(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [page, pageSize, searchedColumn, searchText]
  );

  const allColumnsWarrantyInfo = useMemo(() => {
    const columnsWithKeys = baseColumnsWarrantyInfo.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumnsWarrantyInfo]);

  const processedColumnsWarrantyInfo = useMemo(() => {
    return applyFixedColumns(allColumnsWarrantyInfo, fixedColumns);
  }, [allColumnsWarrantyInfo, fixedColumns]);

  const columnDefinitionsWarrantyInfo = useMemo(() => {
    return allColumnsWarrantyInfo.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumnsWarrantyInfo]);

  const onSelectChangeWarrantyInfo = (newSelectedWarrantyInfoRowKeys, newSelectedRow) => {
    setDataWarrantyInfoSelect(newSelectedRow);
    setSelectedWarrantyInfoRowKeys(newSelectedWarrantyInfoRowKeys);
  };

  const rowSelectionWarrantyInfo = {
    fixed: true,
    selectedRowKeys: selectedWarrantyInfoRowKeys,
    onChange: onSelectChangeWarrantyInfo,
    getCheckboxProps: (record) => ({
      disabled: !!selectedRow,
    }),
  };

  // Hold Information Step

  const [remarkHoldInformation, setRemarkHoldInformation] = useState("");

  const [fixedHoldColumns, setFixedHoldColumns] = useState({
    left: ["no"],
    right: ["holdDate", "holdAmount"] 
  });

  // Removed useEffect for getAllHoldInfoPaginate as we use dataWarrantyInfoSelect

  const dataSourceHoldInfoWithKeys = useMemo(() => {
    return dataWarrantyInfoSelect?.map((item, index) => ({
      ...item,
      key: index + 1,
    }));
  }, [dataWarrantyInfoSelect]);
  
  const baseColumnsHoldInfo = useMemo(
    () =>
      columnsHoldInfo(
        1,
        1000,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [searchedColumn, searchText]
  );

  const baseColumnsHoldInfoConfirmation = useMemo(
    () =>
      columnsHoldInfo(
        1,
        1000,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [searchedColumn, searchText]
  );

  const processedColumnsHoldInfoConfirmation = useMemo(() => {
    const columnsWithKeys = baseColumnsHoldInfoConfirmation.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return applyFixedColumns(columnsWithKeys, fixedHoldColumns);
  }, [baseColumnsHoldInfoConfirmation, fixedHoldColumns]);

  const allColumnsHoldInfo = useMemo(() => {
    const columnsWithKeys = baseColumnsHoldInfo.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumnsHoldInfo]);

  const processedColumnsHoldInfo = useMemo(() => {
    return applyFixedColumns(allColumnsHoldInfo, fixedHoldColumns);
  }, [allColumnsHoldInfo, fixedHoldColumns]);

  const columnDefinitionsHoldInfo = useMemo(() => {
    return allColumnsHoldInfo.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumnsHoldInfo]);

  // Attachment Information Step
  const [listDataAttachment, setListDataAttachment] = useState([]);
  

  const dataSourceAttachmentInfoWithKeys = useMemo(() => {
    return dataSourceAttachmentInfo?.map((item, index) => ({
      ...item,
      key: index + 1,
    }));
  }, [dataSourceAttachmentInfo]);
  
  const itemGrantAccess = [
    {
      action: "Hapus",
      type: "table",
      render: (record) => {
        const status = record.approvalStatus?.toUpperCase(); // Menggunakan 's' dan optional chaining
        const isDelete = status === "DRAFT" || status === "REJECTED";
        return (
          <Tooltip title="Delete">
            <SVGIcon
              name="IconDelete"
              width={24}
              color={isDelete ? "#D90000" : "#8D91A0"}
              className={isDelete ? undefined : "disabled cursor-not-allowed"}
              onClick={isDelete ? () => undefined : undefined}
            />
          </Tooltip>
        );
      },
    },
  ];
  
  
  const actionColsAttachmentInfo = useColumnActionPermission(
    ["view", "history", "hapus"],
    itemGrantAccess
  ).map((col) => ({
    ...col,
    width: 80,
    align: "center",
  }));

  const baseColumnsAttachmentInfo = useMemo(
    () =>
      columnsAttachmentInfo(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [page, pageSize, searchedColumn, searchText]
  );

  const allColumnsAttachmentInfo = useMemo(() => {
    const columnsWithKeys = [...baseColumnsAttachmentInfo, ...actionColsAttachmentInfo].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumnsAttachmentInfo, actionColsAttachmentInfo]);

  const processedColumnsAttachmentInfo = useMemo(() => {
    return applyFixedColumns(allColumnsAttachmentInfo, fixedColumns);
  }, [allColumnsAttachmentInfo, fixedColumns]);

  const columnDefinitionsAttachmentInfo = useMemo(() => {
    return allColumnsAttachmentInfo.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumnsAttachmentInfo]);

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type="confirmation"
        header="Guarantee Hold"
        handleCancel={handleBackForm}
        width={1000}
        footer={null}
      >
        <div className="flex flex-col gap-y-5">
          <FormStepper
            steps={steps}
            current={current}
            onPrev={prev}
            onNext={next}
            onBack={handleBackForm}
            onConfirm={handleSave}
          />
        </div>

        <Form
          layout="vertical"
          form={form}
          id={"formRequest"}
          onFinish={handleSave}
        >
          {/* STEP 1: WARRANTY INFORMATION */}
          <div className={`steps-content my-[30px] ${ current !== 0 ? "hidden" : "" }`} >
            <div className="w-full grid grid-cols-1 gap-x-4">
              <p className="text-primary uppercase font-bold mb-4">
                WARRANTY INFORMATION
              </p>

              <TableRBI
                dataSource={dataSourceWarrantyInfoWithKeys}
                columns={processedColumnsWarrantyInfo}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                onSizeChanger={handleChange}
                totalData={selectedRow ? 1 : (dataHoldList?.page?.totalElements || 0)}
                tableScrolled={{ y: 525, x: 1000 }}
                onSort={onSort}
                columnDefinitions={columnDefinitionsWarrantyInfo}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={loadingHoldList}
                showExport={false}
                rowSelection={rowSelectionWarrantyInfo}
              />
            </div>
          </div>

          {/* STEP 2: HOLD INFORMATION */}
          <div className={`steps-content my-[30px] ${ current !== 1 ? "hidden" : "" }`} >
            <div className="w-full grid grid-cols-1 gap-x-4 mb-8">
              <p className="text-primary uppercase font-bold mb-4">
                HOLD INFORMATION
              </p>

              <TableRBI
                dataSource={dataSourceHoldInfoWithKeys}
                columns={processedColumnsHoldInfo}
                current={1}
                pageSize={100} // Show all selected items
                onChange={() => {}} 
                onSizeChanger={() => {}}
                totalData={dataSourceHoldInfoWithKeys.length}
                tableScrolled={{ y: 525, x: 2000 }}
                onSort={onSort}
                columnDefinitions={columnDefinitionsHoldInfo}
                fixedColumns={fixedHoldColumns}
                setFixedColumns={setFixedHoldColumns}
                loading={loadingHoldList}
                showExport={false}
              />
              
              <div className="pt-[30px]">
                <Form.Item
                  label={"Remark"}
                  name={"remark"}
                  rules={[
                    { required: true, message: "Please input your Remark!" },
                  ]}
                >
                  <InputComponent
                    rows={6}
                    type="textarea"
                    value={remarkHoldInformation}
                    onChange={(e) => setRemarkHoldInformation(e.target.value)}
                    placeholder={"Type your remark"}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          {/* STEP 3: APPROVAL */}
          <div className={`steps-content my-[30px] ${ current !== 2 ? "hidden" : "" }`} >
             <div className="w-full grid grid-cols-1 gap-x-4">
              <p className="text-primary uppercase font-bold mb-4">
                APPROVAL INFORMATION
              </p>
              <ApprovalSectionForm
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </div>
          </div>

          {/* STEP 4: ATTACHMENT INFORMATION */}
          <div className={`steps-content my-[30px] ${ current !== 3 ? "hidden" : "" }`} >
            <div className="w-full grid grid-cols-1 gap-x-4">
              <p className="text-primary uppercase font-bold mb-4">
                ATTACHMENT INFORMATION
              </p>
              <AttachmentComponent
                data={listDataAttachment}
                updateData={setListDataAttachment}
                dispatch={dispatch}
                getAPICategory={getListCategory}
                typeSelector="warranty"
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
                typeRBI={"data"}
                mandatory={false}
              />
            </div>
          </div>

          {/* STEP 5: CONFIRMATION */}
          <div className={`steps-content my-[30px] ${ current !== 4 ? "hidden" : "" }`} >
            <div className="w-full grid grid-cols-1 gap-x-4">
              <Tabs activeKey={valuePage} onChange={setValuePage} items={tabItems} className="mb-4" />
              
              <div style={{ display: valuePage !== "Hold" ? "none" : undefined }}>
                <div className="w-full grid grid-cols-1 gap-[30px]">
                  <p className="text-primary uppercase font-bold my-4">
                    HOLD INFORMATION
                  </p>
                  <TableRBI
                    dataSource={dataSourceHoldInfoWithKeys}
                    columns={processedColumnsHoldInfoConfirmation}
                    current={1}
                    pageSize={100}
                    onChange={() => {}}
                    onSizeChanger={() => {}}
                    totalData={dataSourceHoldInfoWithKeys.length}
                    tableScrolled={{ y: 525, x: 2000 }}
                    onSort={onSort}
                    columnDefinitions={columnDefinitionsHoldInfo}
                    fixedColumns={fixedHoldColumns}
                    setFixedColumns={setFixedHoldColumns}
                    loading={false}
                    showExport={false}
                  />
                  <div>
                    <DetailText label={"Remark"}>
                      {form.getFieldValue("remark")}
                    </DetailText>
                  </div>
                </div>
              </div>

              <div style={{ display: valuePage !== "Approval" ? "none" : undefined }}>
                <div className="w-full grid grid-cols-1 gap-[30px]">
                  <p className="text-primary uppercase font-bold my-4">
                    APPROVAL INFORMATION
                  </p>
                  <ApprovalSectionForm
                    showSelect={false}
                    disableSelect={true}
                    approvalName={
                      appHierOptions.find((opt) => opt.value === selectedHierarchy)?.name
                    }
                    dataTable={appHierDataDetail}
                    selectedHierarchy={selectedHierarchy}
                  />
                </div>
              </div>

              <div style={{ display: valuePage !== "Attachment" ? "none" : undefined }}>
                <div className="w-full grid grid-cols-1 gap-[30px]">
                  <p className="text-primary uppercase font-bold my-4">
                    ATTACHMENT INFORMATION
                  </p>
                  <AttachmentComponent
                    type={"preview"}
                    data={listDataAttachment}
                    updateData={setListDataAttachment}
                    typeSelector="warranty"
                    dispatch={dispatch}
                    getAPICategory={getListCategory}
                    service={receiptCollectionHttpService}
                    configApplication={configApp.PAYMENT_SERVICE}
                    typeRBI={"data"}
                  />
                </div>
              </div>
            </div>
          </div>
            <FormFooter
              current={current}
              totalSteps={steps.length}
              onPrev={prev}
              onNext={next}
              onCancel={handleBackForm}
              onSubmit={() => form.submit()}
              useClearData={false}
              useSaveDraft={false}
            />
        </Form>
      </ModalCustom>

      {/** Modal Retry */}
      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleBack={handleCloseModalError}
        customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {bodyError.type === "inactivate"
              ? IconModal["icon_error_inactivate"]
              : IconModal["icon_error_default"]}
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{`Your data was not ${bodyError.type}. ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </div>
  );
};

export default ModalHold;