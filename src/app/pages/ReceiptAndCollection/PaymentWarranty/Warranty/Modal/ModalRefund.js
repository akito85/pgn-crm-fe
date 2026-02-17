// VERIFICATION_TAG: 2026-02-17-001
import React, { useRef, useState, useEffect, useMemo } from "react";
import moment from "moment";
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
import { columnsRefundInfo } from "./Table/TableRefundInfo";
import { columnsAttachmentInfo } from "./Table/TableAttachmentInfo";

// Redux / Service
import { configApp } from "../../../../../../constants/configApp";
import receiptCollectionHttpService from "../../../../../../redux/services/receiptCollectionHttpService";
import {
  getAllCustomerInfoPaginate,
  getAllWarrantyInfoPaginate,
  getAllRefundInfoPaginate,
  getAllAttachmentInfoPaginate,
  getAllApprovalList,
  getListApprovalById,
  getListCategory,
  submitWarrantyRequest,
} from "../../../../../../redux/slices/receipt_collection/warranty";

import { FormStepper, FormFooter } from "../../../../../../components/FormStepNavigation";
import ApprovalSectionForm from "../../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";

const ModalRefund = ({
  isOpen,
  handleBack = () => {},
  handleRefresh = () => {},
  handleOpenModal = () => {},
  selectedRow = null,
}) => {
  // Selector
  const {
    data_customer_info,
    data_warranty_info,
    data_refund_info,
    data_attachment_info,
    dataListAppHierId,
    dataListAppHierDetail,
    loading,
  } = useSelector((state) => state.warranty);

  // Declaration
  const containerRef = useRef(null);
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const dataSourceCustomerInfo = data_customer_info?.result || [];
  const dataSourceWarrantyInfo = data_warranty_info?.result || [];
  const dataSourceRefundInfo = data_refund_info?.result || [];
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
      title: "Customer Information",
      key: "customerInfo",
    },
    {
      title: "Warranty Information",
      key: "warrantyInfo",
    },
    {
      title: "Refund Information",
      key: "refundInfo",
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

  // Button Next
  const next = () => {
    if (current === 0 && selectedCustomerInfoRowKeys.length === 0) {
      return message.warning("Please select Customer Information!");
    }
    if (current === 1 && selectedWarrantyInfoRowKeys.length === 0) {
      return message.warning("Please select Warranty Information!");
    }
    if (current === 2) {
      if (!remarkRefundInformation) {
        return message.warning("Please input your Remark!");
      }
      const isTableIncomplete = dataSourceRefundInfoWithKeys.some(
        (item) => !refundAmountData[item.key] || !refundDateData[item.key]
      );
      if (isTableIncomplete) {
        return message.warning("Please input Refund Amount and Refund Date for all items!");
      }
    }
    if (current === 3 && !selectedHierarchy) {
      return message.warning("Please select Approval Hierarchy!");
    }
    setCurrent(current + 1);
  };

  // Button Previous
  const prev = () => {
    setCurrent(current - 1);
  };

  const clearAllState = (preSelectedRow) => {
    setSelectedCustomerInfoRowKeys([]);
    setDataCustomerInfoSelect([]);
    
    if (preSelectedRow) {
      const rowKey = preSelectedRow.billingCode || preSelectedRow.invoiceNumber || preSelectedRow.id;
      setSelectedWarrantyInfoRowKeys([rowKey]);
      setDataWarrantyInfoSelect([{ ...preSelectedRow, key: rowKey }]);
      setCurrent(0); // Start at Step 1 (Customer Info selection)
    } else {
      setSelectedWarrantyInfoRowKeys([]);
      setDataWarrantyInfoSelect([]);
      setCurrent(0);
    }

    setRefundAmountData({});
    setRefundDateData({});
    setRemarkRefundInformation("");
    setListDataAttachment([]);
    setSelectedHierarchy(null);
    setApprovalName("-");
    setSearch({});
    setPage(1);
    setSort("");
    setSearchText("");
    setSearchedColumn("");
    setValuePage("Customer");
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
    { key: "Customer", label: "Cust. Info" },
    { key: "Refund", label: "Refund Info" },
    { key: "Approval", label: "Approval" },
    { key: "Attachment", label: "Attachment" },
  ];
  const [valuePage, setValuePage] = useState("Customer");
  const onChange = (key) => {
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
      // 1. Upload new attachments first to get their IDs
      const newAttachments = listDataAttachment.filter(item => item.dataType !== "exist");
      const attachmentIds = (listDataAttachment.filter(item => item.dataType === "exist") || []).map(item => item.id);
      
      for (const element of newAttachments) {
        const uploadBody = {
          // referensiId: null, // No reference ID yet as per new unified submit flow
          files: element.file,
          category: "PAYMENT_WARRANTY",
          fileCategoryId: element.fileCategoryId,
        };
        const uploadRes = await receiptCollectionHttpService.uploadImage(`/v1/dbs/api/attachment/upload/v1`, uploadBody);
        if (uploadRes?.data?.id) {
          attachmentIds.push(uploadRes.data.id);
        }
      }

      // 2. Prepare unified submission body
      const submitBody = {
        warrantyTransTypeId: 12, // 12 = Refund
        appHierId: selectedHierarchy,
        customerId: dataCustomerInfoSelect[0]?.id,
        items: dataWarrantyInfoSelect.map((item, index) => ({
          payWarrantyId: item.id,
          amount: refundAmountData[dataSourceRefundInfoWithKeys[index]?.key] || 0,
          currency: item.currency || "IDR",
          refundDate: refundDateData[dataSourceRefundInfoWithKeys[index]?.key] 
            ? moment(refundDateData[dataSourceRefundInfoWithKeys[index]?.key]).format("YYYY-MM-DDTHH:mm:ss") 
            : null,
        })),
        attachmentIds: attachmentIds,
        remark: remarkRefundInformation,
      };

      // 3. Dispatch the unified thunk
      await dispatch(submitWarrantyRequest({ body: submitBody })).unwrap();

      // 4. Cleanup and close
      handleRefresh();
      handleBack();
      clearAllState();
      setLoadingSave(false);
    } catch (error) {
      setLoadingSave(false);
      const message = error?.response?.data?.message || error?.message || error?.toString();
      setBodyError({ message, type: "requested" });
      setModalError(true);
    }
  };


  // Customer Information Step
  useEffect(() => {
    if (isOpen && current === 0) {
      const finalSearch = Object.keys(search).length > 0 
        ? Object.entries(search)
            .filter(([_, value]) => value !== undefined && value !== "")
            .map(([key, value]) => `${key}~${value}`)
            .join("|") 
        : "";
      dispatch(
        getAllCustomerInfoPaginate({
          search: finalSearch,
          page,
          pageSize,
          sort,
        })
      );
    }
  }, [dispatch, isOpen, search, page, pageSize, sort, current]);

  // Warranty Information Step
  useEffect(() => {
    if (isOpen && current === 1) {
      // NOTE: For Refund, we currently don't filter warranties by the selected customer Number.
      // Customer selection is done in Step 1, but Warranty selection in Step 2 fetches all available warranties.
      // This is as per current requirement, but might change in the future (e.g., adding back customerNumber filter).
      
      let finalSearch = "";
      if (Object.keys(search).length > 0) {
        finalSearch = Object.entries(search)
          .filter(([_, value]) => value !== undefined && value !== "")
          .map(([key, value]) => `${key}~${value}`)
          .join("|");
      }

      dispatch(
        getAllWarrantyInfoPaginate({
          search: finalSearch,
          page,
          pageSize,
          sort,
          transTypeName: "REFUND",
        })
      );
    }
  }, [dispatch, isOpen, search, page, pageSize, sort, current]);

  useEffect(() => {
    if (isOpen && current === 3) {
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

  // Refund Information Step
  const [refundAmountData, setRefundAmountData] = useState({});
  const handleRefundAmountChange = (value, recordKey) => {
    setRefundAmountData(prev => ({ ...prev, [recordKey]: value }));
  };

  const [refundDateData, setRefundDateData] = useState({});
  const handleRefundDateChange = (value, recordKey) => {
    setRefundDateData(prev => ({ ...prev, [recordKey]: value }));
  };

  const [remarkRefundInformation, setRemarkRefundInformation] = useState("");

  const [fixedRefundColumns, setFixedRefundColumns] = useState({
    left: ["no"],
    right: ["date", "refundAmount"] 
  });

  // Removed useEffect for getAllRefundInfoPaginate as we use dataWarrantyInfoSelect

  const dataSourceRefundInfoWithKeys = useMemo(() => {
    return dataWarrantyInfoSelect?.map((item, index) => ({
      ...item,
      key: index + 1,
    }));
  }, [dataWarrantyInfoSelect]);
  
  const baseColumnsRefundInfo = useMemo(
    () =>
      columnsRefundInfo(
        1,
        1000,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        refundAmountData,
        handleRefundAmountChange,
        refundDateData,
        handleRefundDateChange,
        false
      ),
    [searchedColumn, searchText, refundAmountData, refundDateData]
  );

  const baseColumnsRefundInfoConfirmation = useMemo(
    () =>
      columnsRefundInfo(
        1,
        1000,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        refundAmountData,
        handleRefundAmountChange,
        refundDateData,
        handleRefundDateChange,
        true
      ),
    [searchedColumn, searchText, refundAmountData, refundDateData]
  );

  const processedColumnsRefundInfoConfirmation = useMemo(() => {
    const columnsWithKeys = baseColumnsRefundInfoConfirmation.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumnsRefundInfoConfirmation]);

  const allColumnsRefundInfo = useMemo(() => {
    return baseColumnsRefundInfo.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumnsRefundInfo]);

  const processedColumnsRefundInfo = useMemo(() => {
    return allColumnsRefundInfo;
  }, [allColumnsRefundInfo]);

  const columnDefinitionsRefundInfo = useMemo(() => {
    return allColumnsRefundInfo.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumnsRefundInfo]);

  // Attachment Information Step
  const [listDataAttachment, setListDataAttachment] = useState([]);
  
  // Removed useEffect for getAllAttachmentInfoPaginate

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
        header="Warranty Refund"
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
          {/* STEP 1: CUSTOMER INFORMATION */}
          <div className={`steps-content my-[30px] ${ current !== 0 ? "hidden" : "" }`} >
            <div className="w-full grid grid-cols-1 gap-x-4">
              <p className="text-primary uppercase font-bold mb-4">
                CUSTOMER INFORMATION
              </p>

              <TableRBI
                dataSource={dataSourceCustomerInfoWithKeys}
                columns={processedColumnsCustomerInfo}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                onSizeChanger={handleChange}
                totalData={data_customer_info?.page?.totalElements || 0}
                tableScrolled={{ y: 525, x: 1000 }}
                onSort={onSort}
                columnDefinitions={columnDefinitionsCustomerInfo}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={loading}
                showExport={false}
                rowSelection={rowSelectionCustomerInfo}
              />
            </div>
          </div>

          {/* STEP 2: WARRANTY INFORMATION */}
          <div className={`steps-content my-[30px] ${ current !== 1 ? "hidden" : "" }`} >
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
                totalData={selectedRow ? 1 : (data_warranty_info?.page?.totalElements || 0)}
                tableScrolled={{ y: 525, x: 1000 }}
                onSort={onSort}
                columnDefinitions={columnDefinitionsWarrantyInfo}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={loading}
                showExport={false}
                rowSelection={rowSelectionWarrantyInfo}
              />
            </div>
          </div>
          {/* STEP 3: REFUND INFORMATION */}
          <div className={`steps-content my-[30px] ${ current !== 2 ? "hidden" : "" }`} >
            <div className="w-full grid grid-cols-1 gap-x-4 mb-8">
              <p className="text-primary uppercase font-bold mb-4">
                REFUND INFORMATION
              </p>

              <TableRBI
                dataSource={dataSourceRefundInfoWithKeys}
                columns={processedColumnsRefundInfo}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                onSizeChanger={handleChange}
                totalData={data_refund_info?.page?.totalElements || 0}
                tableScrolled={{ y: 525, x: 1000 }}
                onSort={onSort}
                columnDefinitions={columnDefinitionsRefundInfo}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={loading}
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
                    value={remarkRefundInformation}
                    onChange={(e) => setRemarkRefundInformation(e.target.value)}
                    placeholder={"Type your remark"}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          {/* STEP 4: APPROVAL */}
          <div className={`steps-content my-[30px] ${ current !== 3 ? "hidden" : "" }`} >
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

          {/* STEP 5: ATTACHMENT INFORMATION */}
          <div className={`steps-content my-[30px] ${ current !== 4 ? "hidden" : "" }`} >
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

          {/* STEP 6: CONFIRMATION */}
          <div className={`steps-content my-[30px] ${ current !== 5 ? "hidden" : "" }`} >
            <div className="w-full grid grid-cols-1 gap-x-4">
              <Tabs activeKey={valuePage} onChange={setValuePage} items={tabItems} className="mb-4" />
              
              <div style={{ display: valuePage !== "Customer" ? "none" : undefined }}>
                <div className="w-full grid grid-cols-1 gap-[30px]">
                  <p className="text-primary uppercase font-bold my-4">
                    CUSTOMER INFORMATION
                  </p>
                  <TableRBI
                    dataSource={dataCustomerInfoSelect}
                    columns={processedColumnsCustomerInfo}
                    current={page}
                    pageSize={pageSize}
                    onChange={handleChange}
                    onSizeChanger={handleChange}
                    totalData={dataCustomerInfoSelect.length || 0}
                    tableScrolled={{ y: 525, x: 1000 }}
                    onSort={onSort}
                    columnDefinitions={columnDefinitionsCustomerInfo}
                    fixedColumns={fixedColumns}
                    setFixedColumns={setFixedColumns}
                    loading={false}
                  />
                </div>
              </div>

              <div style={{ display: valuePage !== "Refund" ? "none" : undefined }}>
                <div className="w-full grid grid-cols-1 gap-[30px]">
                  <p className="text-primary uppercase font-bold my-4">
                    REFUND INFORMATION
                  </p>
                  <TableRBI
                    dataSource={dataSourceRefundInfoWithKeys}
                    columns={processedColumnsRefundInfoConfirmation}
                    current={page}
                    pageSize={pageSize}
                    onChange={handleChange}
                    onSizeChanger={handleChange}
                    totalData={dataSourceRefundInfoWithKeys.length || 0}
                    tableScrolled={{ y: 525, x: 1000 }}
                    onSort={onSort}
                    columnDefinitions={columnDefinitionsRefundInfo}
                    fixedColumns={fixedRefundColumns}
                    setFixedColumns={setFixedRefundColumns}
                    loading={false}
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

export default ModalRefund;