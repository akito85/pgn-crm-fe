import React, { useState, useEffect, useMemo, useRef } from "react";
import { Form, Select, Input, DatePicker, Spin, Table, Modal, Button, Space, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../components/BreadCrumb";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import { FormStepper, FormFooter } from "../../../../components/FormStepNavigation";
import BaseContainer from "../../../../components/BaseContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import SVGIcon from "../../../../assets/Icon/index";
import ApprovalComponentGeneral from "../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import ConfirmationEarlyRepayment from "./Modal/ConfirmationEarlyRepayment";
import { configApp } from "../../../../constants/configApp";
import ratingBillingHttpService from "../../../../redux/services/ratingBillingHttpService";
import {
  getDetailInstallment,
  getAccountDetail,
  getOpenItems,
  getInstallmentSources,
  getApprovalHierarchy,
  getApprovalHierarchyDetail,
  getAttachmentCategory,
  getAttachmentList,
  clearDetailInstallment,
  createEarlyRepayment,
  getEarlyRepaymentByInstallmentId,
} from "../../../../redux/slices/rating_billing_invoice/installment";

const EarlyRepaymentBillingInstallmentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const { id } = location?.state || {};

  const {
    data_account_detail,
    data_open_items,
    data_sources,
    data_approval,
    data_approval_detail,
    data_detail,
    data_attachments,
    data_early_repayment,
    loading,
  } = useSelector((state) => state.installment || {});

  const [currentStep, setCurrentStep] = useState(0);
  const [loadingForm, setLoadingForm] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [modalError, setModalError] = useState(false);

  // Read-only contacts from installment detail
  const [selectedContacts, setSelectedContacts] = useState([]);

  const [selectedApprovalHierarchy, setSelectedApprovalHierarchy] = useState(null);
  const [approvalHierarchyOptions, setApprovalHierarchyOptions] = useState([]);

  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState([]);
  const [loadingInstallmentDetail, setLoadingInstallmentDetail] = useState(false);
  const [loadingAccountDetail, setLoadingAccountDetail] = useState(false);
  const [loadingOpenItems, setLoadingOpenItems] = useState(false);
  const [loadingSources, setLoadingSources] = useState(false);
  const [loadingApprovalList, setLoadingApprovalList] = useState(false);
  const [loadingApprovalDetail, setLoadingApprovalDetail] = useState(false);
  const [loadingEarlyRepaymentDetail, setLoadingEarlyRepaymentDetail] = useState(false);

  const dispatchWithLoading = (action, setLoading) => {
    setLoading(true);
    return dispatch(action).finally(() => setLoading(false));
  };

  // Confirmation modal state
  const [modalConfirmation, setModalConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState({});
  const [isSubmitAction, setIsSubmitAction] = useState(false);
  const isReadonlyEarlyRepayment = ["WAITING_APPROVAL", "APPROVED"].includes(
    data_early_repayment?.statusApproval,
  );

  // Search state for tables
  const [contactSearchText, setContactSearchText] = useState("");
  const [contactSearchedColumn, setContactSearchedColumn] = useState("");
  const contactSearchInput = useRef(null);

  const [openItemSearchText, setOpenItemSearchText] = useState("");
  const [openItemSearchedColumn, setOpenItemSearchedColumn] = useState("");
  const openItemSearchInput = useRef(null);

  const [detailSearchText, setDetailSearchText] = useState("");
  const [detailSearchedColumn, setDetailSearchedColumn] = useState("");
  const detailSearchInput = useRef(null);

  useEffect(() => {
    if (id) {
      dispatchWithLoading(getDetailInstallment(id), setLoadingInstallmentDetail);
      dispatchWithLoading(getEarlyRepaymentByInstallmentId(id), setLoadingEarlyRepaymentDetail);
    }
  }, [id, dispatch]);

  useEffect(() => {
    dispatchWithLoading(
      getApprovalHierarchy({
        page: 0,
        pageSize: 50,
        sort: "createdDate~desc",
      }),
      setLoadingApprovalList,
    );
    dispatchWithLoading(getInstallmentSources(), setLoadingSources);
  }, [dispatch]);

  useEffect(() => {
    if (data_approval && Array.isArray(data_approval)) {
      setApprovalHierarchyOptions(
        data_approval.map((item) => ({
          value: item.appHierId,
          name: item.approvalName || `Hierarchy ${item.appHierId}`,
        })),
      );
    }
  }, [data_approval]);

  useEffect(() => {
    if (data_detail && Object.keys(data_detail).length > 0 && data_approval && data_approval.length > 0) {
      const detail = data_detail;
      if (detail.appHierId && !selectedApprovalHierarchy) {
        setSelectedApprovalHierarchy(detail.appHierId);
        form.setFieldsValue({
          apphierId: detail.appHierId,
        });
      }
    }
  }, [data_approval, data_detail, form, selectedApprovalHierarchy]);

  useEffect(() => {
    if (selectedApprovalHierarchy) {
      dispatchWithLoading(
        getApprovalHierarchyDetail(selectedApprovalHierarchy),
        setLoadingApprovalDetail,
      );
    }
  }, [selectedApprovalHierarchy, dispatch]);

  useEffect(() => {
    if (data_account_detail && Object.keys(data_account_detail).length > 0) {
      form.setFieldsValue({
        accountName: data_account_detail.accountName,
        customerNumber: data_account_detail.customerNumber,
        customerName: data_account_detail.customerName,
        accountGroupType: data_account_detail.accountGroupType,
        accountType: data_account_detail.accountType,
        classificationType: data_account_detail.classificationType,
        serviceType: data_account_detail.serviceType,
        sor: data_account_detail.sor,
        costCenter: data_account_detail.costCenter,
        accountSegment: data_account_detail.accountSegment,
        meterReadingCode: data_account_detail.meterReadingCode,
        accountRegistrationNumber: data_account_detail.accountRegistrationNumber,
        accountStatus: data_account_detail.accountStatus,
      });
    }
  }, [data_account_detail, form]);

  useEffect(() => {
    if (data_detail && Object.keys(data_detail).length > 0) {
      const detail = data_detail;

      const formattedRequestDate = detail.createdDate ? moment(detail.createdDate) : null;

      form.setFieldsValue({
        accountNumber: detail.accountNumber,
        installmentNumber: detail.installmentNumber,
        installmentType: detail.installmentType || "CUSTOM",
        tenor: detail.tenor,
        startPeriod: detail.startPeriod ? moment(detail.startPeriod, "MM-YYYY") : null,
        source: detail.source,
        requestDate: formattedRequestDate,
        remark: detail.remark,
      });

      dispatchWithLoading(getAccountDetail(detail.accountNumber), setLoadingAccountDetail);
      dispatchWithLoading(getOpenItems(detail.accountNumber), setLoadingOpenItems);

      if (detail.contacts && detail.contacts.length > 0) {
        setSelectedContacts(detail.contacts.map((c) => ({ ...c, key: c.contactId })));
      }
    }
  }, [data_detail, form, dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(
        getAttachmentList({
          installmentId: id,
          page: 0,
          pageSize: 100,
        }),
      );
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (data_attachments && data_attachments.result && data_attachments.result.length > 0) {
      const attachments = data_attachments.result.map((item) => ({
        key: item.id,
        id: item.id,
        fileName: item.fileName,
        fileType: item.fileType,
        fileSize: item.fileSize,
        fileCategoryId: item.fileCategoryId,
        fileCategoryName: item.fileCategoryName,
        pathFile: item.pathFile,
        urlFile1: item.urlFile1,
        createdDate: item.createdDate,
        createdBy: item.createdBy,
        dataType: "exist",
      }));
      setListDataAttachment(attachments);
    }
  }, [data_attachments]);

  useEffect(() => {
    if (!data_early_repayment) return;

    if (data_early_repayment.statusApproval === "APPROVED") {
      setBodyError({ message: "Early Repayment sudah di-approve dan tidak dapat diubah lagi." });
      setModalError(true);
      return;
    }

    if (data_early_repayment.repaymentId) {
      const formattedRepaymentDate = data_early_repayment.repaymentDate
        ? moment(data_early_repayment.repaymentDate)
        : moment();

      form.setFieldsValue({
        earlyRepaymentSource: data_early_repayment.source,
        earlyRepaymentRequestDate: formattedRepaymentDate,
        reason: data_early_repayment.reason,
      });
    } else {
      form.setFieldsValue({
        earlyRepaymentSource: undefined,
        earlyRepaymentRequestDate: moment(),
        reason: "",
      });
    }
  }, [data_early_repayment, form]);

  const sourceOptions = useMemo(() => {
    return (data_sources || []).map((s) => ({
      value: s.key,
      label: s.value,
    }));
  }, [data_sources]);

  const routes = [
    { path: "", breadcrumbName: "Rating & Billing" },
    { path: RBI_ROUTES.MANAGEMENT_BILLING_INSTALLMENT_VIEW, breadcrumbName: "Management Billing Installment" },
    { path: "", breadcrumbName: "Early Repayment" },
  ];

  const steps = [
    { title: "Early Repayment" },
    { title: "Approval" },
    { title: "Attachment" },
  ];

  const handleCancel = () => {
    dispatch(clearDetailInstallment());
    navigate(RBI_ROUTES.MANAGEMENT_BILLING_INSTALLMENT_VIEW);
  };

  const handleClear = () => {
    form.resetFields();
  };

  // Helper function for client-side table search
  const getColumnSearchProps = (dataIndex, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInputRef}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => {
            setSearchText(selectedKeys[0]);
            setSearchedColumn(dataIndex);
            confirm();
          }}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
              confirm();
            }}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              setSearchText("");
              setSearchedColumn("");
              clearFilters();
              confirm();
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : false,
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInputRef.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleNext = () => {
    form
      .validateFields(["earlyRepaymentSource", "earlyRepaymentRequestDate", "reason"])
      .then(() => {
        setCurrentStep(1);
      })
      .catch(() => {});
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSaveDraft = () => {
    console.log("[DEBUG] handleSaveDraft called");
    form
      .validateFields(["earlyRepaymentSource", "earlyRepaymentRequestDate", "reason"])
      .then((values) => {
        console.log("[DEBUG] form validation success", values);
        prepareConfirmationData(values, false);
      })
      .catch((err) => {
        console.log("[DEBUG] form validation failed", err);
        message.error("Mohon lengkapi field Early Repayment (Source, Request Date, Reason)");
      });
  };

  const handleSubmit = () => {
    console.log("[DEBUG] handleSubmit called, selectedApprovalHierarchy:", selectedApprovalHierarchy);
    if (!selectedApprovalHierarchy) {
      console.log("[DEBUG] No approval hierarchy selected");
      message.error("Mohon pilih Approval Hierarchy terlebih dahulu");
      return;
    }

    form
      .validateFields()
      .then((values) => {
        console.log("[DEBUG] form validation success", values);
        prepareConfirmationData(values, true);
      })
      .catch((err) => {
        console.log("[DEBUG] form validation failed", err);
        message.error("Mohon lengkapi semua field yang wajib diisi");
      });
  };

  const prepareConfirmationData = (values, isSubmit) => {
    console.log("[DEBUG] prepareConfirmationData called", { values, isSubmit });
    setConfirmationData({
      source: values.earlyRepaymentSource,
      requestDate: values.earlyRepaymentRequestDate ? moment(values.earlyRepaymentRequestDate).format("YYYY-MM-DD") : "",
      reason: values.reason,
    });

    setIsSubmitAction(isSubmit);
    setModalConfirmation(true);
    console.log("[DEBUG] modalConfirmation set to true");
  };

  const handleConfirmModal = () => {
    setModalConfirmation(false);
    setLoadingForm(true);

    const body = {
      installmentId: id,
      source: confirmationData.source,
      installmentDate: confirmationData.requestDate,
      earlyRepaymentReason: confirmationData.reason,
      appHierId: selectedApprovalHierarchy,
      isSubmit: isSubmitAction,
    };

    dispatch(
      createEarlyRepayment({
        installmentId: id,
        body: body,
      }),
    )
      .unwrap()
      .then(async (response) => {
        const repaymentId = response;

        if (deletedAttachmentIds.length > 0) {
          try {
            await ratingBillingHttpService.deleteDataWithBody(
              `/v1/dbs/api/attachment/delete-attachment`,
              { fileId: deletedAttachmentIds },
            );
          } catch (deleteError) {
            console.error("Error deleting attachments:", deleteError);
          }
        }

        const filterDataAttach = listDataAttachment.filter(
          (item) => item.dataType !== "exist"
        );

        if (filterDataAttach.length > 0) {
          try {
            for (let icon = 0; icon < filterDataAttach.length; icon++) {
              const element = filterDataAttach[icon];
              const formData = new FormData();
              formData.append("files", element.file);
              formData.append("category", element.fileCategoryId);
              formData.append("referenceId", String(repaymentId));
              await ratingBillingHttpService.uploadAttachment(
                `/v1/dbs/api/installment/upload-attachment`,
                formData,
              );
            }
          } catch (uploadError) {
            console.error("Error uploading attachments:", uploadError);
          }
        }

        setLoadingForm(false);
        dispatch(clearDetailInstallment());
        navigate(RBI_ROUTES.MANAGEMENT_BILLING_INSTALLMENT_VIEW);
      })
      .catch((error) => {
        setLoadingForm(false);
        if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setBodyError({ message });
          setModalError(true);
        }
      });
  };

  const accountOptions = useMemo(() => {
    return data_account_detail ? [{
      value: data_account_detail.accountNumber,
      label: `${data_account_detail.accountNumber} - ${data_account_detail.accountName}`,
    }] : [];
  }, [data_account_detail]);

  const renderAccountInformation = () => (
    <BaseContainer header="ACCOUNT INFORMATION">
      <Spin spinning={loadingAccountDetail || loadingInstallmentDetail}>
        <div className="w-full grid grid-cols-4 gap-1">
          <Form.Item
            name="accountNumber"
            label="Account Number"
            style={{ marginBottom: 0 }}
          >
            <Select
              showSearch
              placeholder="Pilih Account Number"
              optionFilterProp="label"
              options={accountOptions}
              disabled
            />
          </Form.Item>

          <Form.Item name="accountName" label="Account Name" style={{ marginBottom: 0 }}>
            <Input disabled placeholder="Terisi otomatis" />
          </Form.Item>

          <Form.Item name="customerNumber" label="Customer Number" style={{ marginBottom: 0 }}>
            <Input disabled placeholder="Terisi otomatis" />
          </Form.Item>

          <Form.Item name="customerName" label="Customer Name" style={{ marginBottom: 0 }}>
            <Input disabled placeholder="Terisi otomatis" />
          </Form.Item>

          <Form.Item name="accountGroupType" label="Account Group Type" style={{ marginBottom: 0 }}>
            <Input disabled placeholder="Terisi otomatis" />
          </Form.Item>

          <Form.Item name="accountType" label="Account Type" style={{ marginBottom: 0 }}>
            <Input disabled placeholder="Terisi otomatis" />
          </Form.Item>

          <Form.Item name="classificationType" label="Classification Type" style={{ marginBottom: 0 }}>
            <Input disabled placeholder="Terisi otomatis" />
          </Form.Item>

          <Form.Item name="serviceType" label="Service Type" style={{ marginBottom: 0 }}>
            <Input disabled placeholder="Terisi otomatis" />
          </Form.Item>

          <Form.Item name="sor" label="SOR" style={{ marginBottom: 0 }}>
            <Input disabled placeholder="Terisi otomatis" />
          </Form.Item>

          <Form.Item name="costCenter" label="Cost Center" style={{ marginBottom: 0 }}>
            <Input disabled placeholder="Terisi otomatis" />
          </Form.Item>

          <Form.Item name="accountSegment" label="Account Segment" style={{ marginBottom: 0 }}>
            <Input disabled placeholder="Terisi otomatis" />
          </Form.Item>

          <Form.Item name="meterReadingCode" label="Meter Reading Code" style={{ marginBottom: 0 }}>
            <Input disabled placeholder="Terisi otomatis" />
          </Form.Item>

          <Form.Item
            name="accountRegistrationNumber"
            label="Account Registration Number"
            style={{ marginBottom: 0 }}
          >
            <Input disabled placeholder="Terisi otomatis" />
          </Form.Item>

          <Form.Item name="accountStatus" label="Account Status" style={{ marginBottom: 0 }}>
            <Input disabled placeholder="Terisi otomatis" />
          </Form.Item>
        </div>
      </Spin>
    </BaseContainer>
  );

  const contactColumns = [
    {
      title: "Contact Name",
      dataIndex: "contactName",
      key: "contactName",
      width: 200,
      sorter: (a, b) => (a.contactName || "").localeCompare(b.contactName || ""),
      ...getColumnSearchProps("contactName", contactSearchText, setContactSearchText, contactSearchedColumn, setContactSearchedColumn, contactSearchInput),
    },
    {
      title: "Job",
      dataIndex: "job",
      key: "job",
      width: 150,
      sorter: (a, b) => (a.job || "").localeCompare(b.job || ""),
      ...getColumnSearchProps("job", contactSearchText, setContactSearchText, contactSearchedColumn, setContactSearchedColumn, contactSearchInput),
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      width: 150,
      sorter: (a, b) => (a.position || "").localeCompare(b.position || ""),
      ...getColumnSearchProps("position", contactSearchText, setContactSearchText, contactSearchedColumn, setContactSearchedColumn, contactSearchInput),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 250,
      sorter: (a, b) => (a.address || "").localeCompare(b.address || ""),
      ...getColumnSearchProps("address", contactSearchText, setContactSearchText, contactSearchedColumn, setContactSearchedColumn, contactSearchInput),
      render: (text) => {
        if (!text) return "-";
        const maxLength = 30;
        const isLong = text.length > maxLength;
        const displayText = isLong ? `${text.substring(0, maxLength)}...` : text;
        return (
          <span title={isLong ? text : ""}>{displayText}</span>
        );
      },
    },
    {
      title: "Primary",
      dataIndex: "isPrimary",
      key: "isPrimary",
      width: 80,
      sorter: (a, b) => (a.isPrimary === b.isPrimary ? 0 : a.isPrimary ? -1 : 1),
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.isPrimary === value,
      render: (val) => (val ? "Yes" : "No"),
    },
  ];

  const contactDetailColumns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      sorter: (a, b) => (a.type || "").localeCompare(b.type || ""),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      width: 250,
      sorter: (a, b) => (a.value || "").localeCompare(b.value || ""),
    },
  ];

  const renderContactInformation = () => (
    <BaseContainer header="CONTACT INFORMATION">
      {!data_account_detail ? (
        <p className="text-gray-400 text-xs">Pilih Account Number terlebih dahulu</p>
      ) : selectedContacts.length === 0 ? (
        <p className="text-gray-400 text-xs">Tidak ada kontak untuk installment ini</p>
      ) : (
        <Table
          className="custom-table-small"
          columns={contactColumns}
          dataSource={selectedContacts.map((item, idx) => ({
            ...item,
            key: item.contactId || idx,
          }))}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: "12px 24px", backgroundColor: "#f9f9f9" }}>
                <Table
                  className="custom-table-small"
                  columns={contactDetailColumns}
                  dataSource={(record.contactDetails || []).map((detail, dIdx) => ({
                    ...detail,
                    key: dIdx,
                  }))}
                  pagination={false}
                  size="small"
                  showHeader={true}
                  bordered={true}
                  style={{ backgroundColor: "#fff", borderRadius: 4 }}
                />
              </div>
            ),
            rowExpandable: (record) => (record.contactDetails || []).length > 0,
          }}
          pagination={false}
          size="small"
          bordered={true}
          scroll={{ y: 250 }}
        />
      )}
    </BaseContainer>
  );

  const renderInstallmentInformation = () => (
    <BaseContainer header="INSTALLMENT INFORMATION">
      <div className="w-full grid grid-cols-5 gap-1">
        <Form.Item
          name="installmentNumber"
          label="Installment Number"
          style={{ marginBottom: 0 }}
        >
          <Input disabled placeholder="Terisi otomatis" />
        </Form.Item>

        <Form.Item
          name="installmentType"
          label="Type"
          style={{ marginBottom: 0 }}
        >
          <Select disabled placeholder="Pilih Type" />
        </Form.Item>

        <Form.Item
          name="tenor"
          label="Tenor"
          style={{ marginBottom: 0 }}
        >
          <Input disabled placeholder="Terisi otomatis" />
        </Form.Item>

        <Form.Item
          name="startPeriod"
          label="Start Period"
          style={{ marginBottom: 0 }}
        >
          <DatePicker
            picker="month"
            placeholder="Pilih Start Period"
            format="MM-YYYY"
            disabled
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="source"
          label="Source"
          style={{ marginBottom: 0 }}
        >
          <Select placeholder="Pilih Source" disabled />
        </Form.Item>

        <Form.Item
          name="requestDate"
          label="Request Date"
          style={{ marginBottom: 0 }}
        >
          <DatePicker
            placeholder="Pilih Request Date"
            format="YYYY-MM-DD"
            disabled
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item name="remark" label="Remark" className="col-span-5" style={{ marginBottom: 0 }}>
          <Input.TextArea placeholder="Optional remark" rows={3} maxLength={500} disabled />
        </Form.Item>
      </div>
    </BaseContainer>
  );

  const renderEarlyRepaymentInformation = () => (
    <BaseContainer header="EARLY REPAYMENT INFORMATION">
      <div className="w-full grid grid-cols-5 gap-1">
        <Form.Item
          name="earlyRepaymentSource"
          label="Source"
          rules={[{ required: true, message: "Field ini wajib diisi" }]}
          style={{ marginBottom: 0 }}
        >
          <Select 
            placeholder="Pilih Source" 
            options={sourceOptions}
            showSearch
            optionFilterProp="label"
            loading={loadingSources}
            disabled={isReadonlyEarlyRepayment}
          />
        </Form.Item>

        <Form.Item
          name="earlyRepaymentRequestDate"
          label="Request Date"
          rules={[{ required: true, message: "Field ini wajib diisi" }]}
          style={{ marginBottom: 0 }}
        >
          <DatePicker
            placeholder="Pilih Request Date"
            format="YYYY-MM-DD"
            style={{ width: "100%" }}
            disabled={isReadonlyEarlyRepayment}
          />
        </Form.Item>

        <Form.Item
          name="reason"
          label="Reason"
          rules={[{ required: true, message: "Field ini wajib diisi" }]}
          className="col-span-2"
          style={{ marginBottom: 0 }}
        >
          <Input.TextArea
            placeholder="Masukkan alasan early repayment"
            rows={3}
            maxLength={500}
            disabled={isReadonlyEarlyRepayment}
          />
        </Form.Item>
      </div>
    </BaseContainer>
  );

  const renderOpenItemInformation = () => {
    const selectedOpenItems = data_detail?.selectedOpenItems || [];

    if (selectedOpenItems.length === 0) {
      return (
        <BaseContainer header="OPEN ITEM INFORMATION">
          <p className="text-gray-400 text-xs p-4">No open items selected</p>
        </BaseContainer>
      );
    }

    // Columns without checkbox (view only)
    const selectedOpenItemColumns = [
      {
        title: "Invoice Number",
        dataIndex: "invoiceNumber",
        key: "invoiceNumber",
        width: 150,
      },
      {
        title: "Billing Period",
        dataIndex: "billingPeriod",
        key: "billingPeriod",
        width: 120,
      },
      {
        title: "Billing Item Name",
        dataIndex: "billingItemName",
        key: "billingItemName",
        width: 200,
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        width: 150,
        align: "right",
        render: (amount) => new Intl.NumberFormat("id-ID").format(amount || 0),
      },
    ];

    return (
      <BaseContainer header="OPEN ITEM INFORMATION">
        {(data_open_items || []).map((currencyGroup) => {
          // Filter items that are selected for this currency
          const selectedItems = (currencyGroup.items || []).filter((item) =>
            selectedOpenItems.some(
              (sel) => sel.currency === currencyGroup.currency && sel.billingItemId === item.billItemId
            )
          );

          // Skip if no selected items for this currency
          if (selectedItems.length === 0) {
            return null;
          }

          const totalAmount = selectedItems.reduce((sum, item) => sum + (item.amount || 0), 0);

          return (
            <div key={currencyGroup.currency} className="border border-gray-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-primary mb-2">Currency: {currencyGroup.currency}</p>
              <Table
                className="custom-table-small"
                columns={selectedOpenItemColumns}
                dataSource={selectedItems.map((item, idx) => ({
                  ...item,
                  key: `${currencyGroup.currency}-${item.billItemId || idx}`,
                  currency: currencyGroup.currency,
                }))}
                loading={loadingOpenItems}
                pagination={false}
                size="small"
                bordered={true}
                scroll={{ y: 200 }}
                summary={() => (
                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={3} index={0}>
                      <strong>Total</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      <strong>
                        {currencyGroup.currency} {new Intl.NumberFormat("id-ID").format(totalAmount)}
                      </strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                )}
              />
            </div>
          );
        })}
      </BaseContainer>
    );
  };

  const renderInstallmentCalculationDetail = () => {
    const details = data_detail?.details || [];
    const currency = data_detail?.currency || "IDR";
    const totalAmount = data_detail?.totalAmount || 0;

    const columns = [
      {
        title: "Sequence",
        dataIndex: "sequenceNo",
        key: "sequenceNo",
        width: 100,
        align: "center",
        sorter: (a, b) => (a.sequenceNo || 0) - (b.sequenceNo || 0),
      },
      {
        title: "Period",
        dataIndex: "period",
        key: "period",
        width: 150,
        sorter: (a, b) => (a.period || "").localeCompare(b.period || ""),
        ...getColumnSearchProps("period", detailSearchText, setDetailSearchText, detailSearchedColumn, setDetailSearchedColumn, detailSearchInput),
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        width: 200,
        align: "right",
        sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
        render: (amount) => new Intl.NumberFormat("id-ID").format(amount || 0),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 120,
        sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
        filters: [
          { text: "Pending", value: "Pending" },
          { text: "Active", value: "Active" },
          { text: "Paid", value: "Paid" },
        ],
        onFilter: (value, record) => (record.status || "Pending") === value,
      },
    ];

    return (
      <BaseContainer header="INSTALLMENT CALCULATION DETAIL">
        {!data_account_detail ? (
          <p className="text-gray-400 text-xs">Pilih Account Number terlebih dahulu</p>
        ) : details.length === 0 ? (
          <p className="text-gray-400 text-xs">Tidak ada detail installment</p>
        ) : (
          <div className="space-y-4">
            <div key={currency} className="border border-gray-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-primary mb-2">Currency: {currency}</p>
              <Table
                className="custom-table-small"
                columns={columns}
                dataSource={details.map((item, idx) => ({
                  ...item,
                  key: idx,
                }))}
                pagination={false}
                size="small"
                bordered={true}
                scroll={{ y: 250 }}
                summary={() => (
                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={2} index={0}>
                      <strong>Total</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      <strong>
                        {currency} {new Intl.NumberFormat("id-ID").format(totalAmount)}
                      </strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} />
                  </Table.Summary.Row>
                )}
              />
            </div>
          </div>
        )}
      </BaseContainer>
    );
  };

  const renderApproval = () => (
    <BaseContainer header="APPROVAL INFORMATION">
      <Spin spinning={loadingApprovalList || loadingApprovalDetail}>
        <ApprovalComponentGeneral
          dataTable={data_approval_detail || []}
          dataOption={approvalHierarchyOptions}
          selectedHierarchy={selectedApprovalHierarchy}
          updateSelectedHierarchy={setSelectedApprovalHierarchy}
        />
      </Spin>
    </BaseContainer>
  );

  const handleUpdateAttachment = (updater) => {
    setListDataAttachment((prevState) => {
      const newState = typeof updater === "function" ? updater(prevState) : updater;
      const removedExistingIds = prevState
        .filter((item) => item.dataType === "exist")
        .filter((item) => !newState.find((newItem) => newItem.key === item.key))
        .map((item) => item.id);
      if (removedExistingIds.length > 0) {
        setDeletedAttachmentIds((prev) => [...prev, ...removedExistingIds]);
      }
      return newState;
    });
  };

  const renderAttachment = () => (
    <BaseContainer header="ATTACHMENT INFORMATION">
      <AttachmentComponent
        data={listDataAttachment}
        updateData={handleUpdateAttachment}
        type="update"
        typeSelector="installment"
        dispatch={dispatch}
        getAPICategory={getAttachmentCategory}
        service={ratingBillingHttpService}
        configApplication={configApp.RATING_BILLING_SERVICE}
        typeRBI="standalone"
      />
    </BaseContainer>
  );

  return (
    <Spin spinning={loading || loadingForm}>
      <style>{`
        .custom-table-small .ant-table {
          font-size: 11px !important;
        }
        .custom-table-small .ant-table-cell {
          font-size: 11px !important;
          padding: 4px 8px !important;
        }
        .custom-table-small .ant-table-thead > tr > th {
          font-size: 10px !important;
          padding: 4px 8px !important;
        }
        .custom-table-small .ant-table-tbody > tr > td {
          font-size: 11px !important;
          padding: 4px 8px !important;
        }
      `}</style>
      <BreadCrumb routes={routes} />

      <ModalError
        visible={modalError}
        handleClose={() => {
          setModalError(false);
          setBodyError({});
        }}
        errorMessage={bodyError?.message}
      />

      <ConfirmationEarlyRepayment
        visible={modalConfirmation}
        handleConfirm={handleConfirmModal}
        handleCancel={() => setModalConfirmation(false)}
        data={confirmationData}
        isSubmit={isSubmitAction}
        selectedHierarchy={selectedApprovalHierarchy}
        listDataAppHierDetail={data_approval_detail || []}
        listDataAttachment={listDataAttachment}
        dataOption={approvalHierarchyOptions}
      />

      <FormStepper
        steps={steps}
        current={currentStep}
        onPrev={handlePrev}
        onNext={() => {
          if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
          }
        }}
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={{}}
      >
        <div style={{ display: currentStep !== 0 ? "none" : undefined }}>
          {renderAccountInformation()}
          {renderInstallmentInformation()}
          {renderEarlyRepaymentInformation()}
          {renderContactInformation()}
          {renderOpenItemInformation()}
          {renderInstallmentCalculationDetail()}
        </div>

        <div style={{ display: currentStep !== 1 ? "none" : undefined }}>{renderApproval()}</div>

        <div style={{ display: currentStep !== 2 ? "none" : undefined }}>{renderAttachment()}</div>

        <FormFooter
          current={currentStep}
          totalSteps={steps.length}
          onPrev={handlePrev}
          onNext={() => {
            if (currentStep < steps.length - 1) {
              setCurrentStep((prev) => prev + 1);
            }
          }}
          onCancel={handleCancel}
          onClear={handleClear}
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmit}
          disableSaveDraft={isReadonlyEarlyRepayment}
          disableSubmit={
            isReadonlyEarlyRepayment || (currentStep === 1 && !selectedApprovalHierarchy)
          }
        />
      </Form>
    </Spin>
  );
};

export default EarlyRepaymentBillingInstallmentPage;
