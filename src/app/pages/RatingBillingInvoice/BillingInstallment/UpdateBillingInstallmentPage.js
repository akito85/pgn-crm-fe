import React, { useState, useEffect, useMemo, useRef } from "react";
import { Form, Select, Input, DatePicker, Spin, Table, Modal, Button, Checkbox, Tooltip, Space } from "antd";
import { PlusOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Highlighter from "react-highlight-words";
import BreadCrumb from "../../../../components/BreadCrumb";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import { FormStepper, FormFooter } from "../../../../components/FormStepNavigation";
import BaseContainer from "../../../../components/BaseContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import SVGIcon from "../../../../assets/Icon/index";
import ApprovalComponentGeneral from "../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import { configApp } from "../../../../constants/configApp";
import ratingBillingHttpService from "../../../../redux/services/ratingBillingHttpService";
import {
  getDetailInstallment,
  getActiveAccounts,
  getAccountDetail,
  getInstallmentTypes,
  getInstallmentSources,
  createContact,
  getOpenItems,
  updateInstallment,
  getApprovalHierarchy,
  getApprovalHierarchyDetail,
  getAttachmentCategory,
  getAttachmentList,
  clearDetailInstallment,
  getContactType,
  getInputType,
  getCountryCode,
  getCountryZone,
  getJob,
  getPosition,
  getAllContacts,
} from "../../../../redux/slices/rating_billing_invoice/installment";
import ModalCreateNewContact from "../../AccountManagement/CustomerAccountDetail/DetailPages/AccountContact/FormAccountContact/ModalCreateNewContact";
import ModalChooseContact from "./Modal/ModalChooseContact";
import ConfirmationInstallment from "./Modal/ConfirmationInstallment";

const { TextArea } = Input;

const UpdateBillingInstallmentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [formLoaded, setFormLoaded] = useState(false);

  const { id } = location?.state || {};

  const {
    data_account,
    data_account_detail,
    data_types,
    data_sources,
    data_all_contacts,
    data_open_items,
    data_approval,
    data_approval_detail,
    data_detail,
    data_attachments,
    data_contact_type,
    data_input_type,
    data_country_code,
    data_country_zone,
    data_job,
    data_position,
    loading,
  } = useSelector((state) => state.installment || {});

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Contact modal state - new modal
  const [modalCreateNewContact, setModalCreateNewContact] = useState(false);
  const [dataCreateNew, setDataCreateNew] = useState({});
  const [prefix1, setPrefix1] = useState({});
  const [prefix2, setPrefix2] = useState({});
  const [suffix, setSuffix] = useState({});
  const [value, setValue] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [emptyValueValidate, setEmptyValueValidate] = useState(false);
  const [modalValidate, setModalValidate] = useState(false);
  const [keyModal, setKeyModal] = useState(0);

  // Open items state
  const [selectedOpenItems, setSelectedOpenItems] = useState([]);

  // Selected contacts state
  const [selectedContacts, setSelectedContacts] = useState([]);

  // Choose contact modal state
  const [modalChooseContact, setModalChooseContact] = useState(false);

  // Installment calculation state
  const [installmentDetails, setInstallmentDetails] = useState({});
  const [installmentValidationError, setInstallmentValidationError] = useState({});

  // Attachment state
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState([]);
  const [loadingForm, setLoadingForm] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [loadingSources, setLoadingSources] = useState(false);
  const [loadingAccountDetail, setLoadingAccountDetail] = useState(false);
  const [loadingOpenItems, setLoadingOpenItems] = useState(false);
  const [loadingApprovalList, setLoadingApprovalList] = useState(false);
  const [loadingApprovalDetail, setLoadingApprovalDetail] = useState(false);
  const [loadingCreateContact, setLoadingCreateContact] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [modalError, setModalError] = useState(false);

  // Confirmation modal state
  const [modalConfirmation, setModalConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState({});
  const [isSubmitAction, setIsSubmitAction] = useState(false);

  // Approval state
  const [selectedApprovalHierarchy, setSelectedApprovalHierarchy] = useState(null);
  const [approvalHierarchyList, setApprovalHierarchyList] = useState([]);
  const [approvalHierarchyOptions, setApprovalHierarchyOptions] = useState([]);

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

  const dispatchWithLoading = (action, setLoading) => {
    setLoading(true);
    return dispatch(action).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id) {
      dispatch(getDetailInstallment(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    dispatchWithLoading(getActiveAccounts(), setLoadingAccounts);
    dispatchWithLoading(getInstallmentTypes(), setLoadingTypes);
    dispatchWithLoading(getInstallmentSources(), setLoadingSources);
    dispatch(getContactType());
    dispatch(getInputType());
    dispatch(getCountryCode());
    dispatch(getJob());
    dispatch(getPosition());
    dispatchWithLoading(
      getApprovalHierarchy({
        page: 0,
        pageSize: 50,
        sort: "createdDate~desc",
      }),
      setLoadingApprovalList,
    );
  }, [dispatch]);

  useEffect(() => {
    if (data_approval && Array.isArray(data_approval)) {
      setApprovalHierarchyList(data_approval);
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
  }, [data_approval, data_detail]);

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
    if (data_detail && Object.keys(data_detail).length > 0 && !formLoaded) {
      const detail = data_detail;
      
      setSelectedAccount(detail.accountNumber);
      
      const formattedRequestDate = detail.createdDate ? moment(detail.createdDate) : null;
      const formattedStartPeriod = detail.startPeriod ? moment(detail.startPeriod, "MM-YYYY") : null;

      form.setFieldsValue({
        accountNumber: detail.accountNumber,
        installmentType: detail.installmentType || "CUSTOM",
        tenor: detail.tenor,
        startPeriod: formattedStartPeriod,
        source: detail.source,
        requestDate: formattedRequestDate,
        remark: detail.remark,
      });

      if (detail.details && detail.details.length > 0) {
        const detailsByCurrency = {};
        detail.details.forEach((d) => {
          if (!detailsByCurrency[detail.currency]) {
            detailsByCurrency[detail.currency] = [];
          }
          detailsByCurrency[detail.currency].push({
            period: d.period,
            amount: d.amount,
            billHeaderId: d.billHeaderId,
          });
        });
        setInstallmentDetails(detailsByCurrency);
      }

      if (detail.selectedOpenItems && detail.selectedOpenItems.length > 0) {
        const selectedItems = detail.selectedOpenItems.map((item) => ({
          currency: item.currency,
          billItemId: item.billingItemId,
        }));
        setSelectedOpenItems(selectedItems);
      }

      dispatch(getAccountDetail(detail.accountNumber));
      dispatch(getOpenItems(detail.accountNumber));

      if (detail.contacts && detail.contacts.length > 0) {
        setSelectedContacts(detail.contacts.map((c) => ({ ...c, key: c.contactId })));
      }

      setFormLoaded(true);
    }
  }, [data_detail, form, formLoaded, dispatch]);

  useEffect(() => {
    if (selectedOpenItems.length > 0 && data_open_items && data_open_items.length > 0) {
      setTimeout(() => {
        calculateInstallmentDetails();
      }, 100);
    }
  }, [selectedOpenItems, data_open_items]);

  useEffect(() => {
    if (formLoaded && id) {
      dispatch(
        getAttachmentList({
          installmentId: id,
          page: 0,
          pageSize: 100,
        }),
      );
    }
  }, [formLoaded, id, dispatch]);

  useEffect(() => {
    if (data_attachments && data_attachments.result && data_attachments.result.length > 0 && formLoaded) {
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
  }, [data_attachments, formLoaded]);

  const routes = [
    { path: "", breadcrumbName: "Rating & Billing" },
    { path: RBI_ROUTES.MANAGEMENT_BILLING_INSTALLMENT_VIEW, breadcrumbName: "Management Billing Installment" },
    { path: "", breadcrumbName: "Update" },
  ];

  const steps = [
    { title: "Update" },
    { title: "Approval" },
    { title: "Attachment" },
  ];

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
    filterIcon: (filtered) => <FilterOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
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

  const handleAccountChange = (value) => {
    setSelectedAccount(value);
    setSelectedContacts([]);
    setSelectedOpenItems([]);
    setInstallmentDetails({});
    setInstallmentValidationError({});
    if (value) {
      dispatchWithLoading(getAccountDetail(value), setLoadingAccountDetail);
      // fetch open items with retry if billHeaderId missing
      const fetchOpenItemsWithRetry = async (acc, retries = 1) => {
        try {
          const action = await dispatch(getOpenItems(acc));
          const payload = action?.payload || [];
          const anyMissing = (payload || []).some((group) => (group.items || []).some((it) => it.billHeaderId == null));
          if (anyMissing && retries > 0) {
            await new Promise((r) => setTimeout(r, 500));
            return fetchOpenItemsWithRetry(acc, retries - 1);
          }
          return payload;
        } catch (e) {
          return [];
        }
      };

      // perform fetch with manual loading control because fetchOpenItemsWithRetry returns a Promise
      setLoadingOpenItems(true);
      fetchOpenItemsWithRetry(value)
        .catch(() => {})
        .finally(() => setLoadingOpenItems(false));
    }
  };

  const handleTenorChange = (value) => {
    form.setFieldsValue({ tenor: value });
  };

  const handleStartPeriodChange = (date) => {
    if (date) {
      form.setFieldsValue({ startPeriod: date });
    }
  };

  const handleClear = () => {
    form.resetFields();
    setSelectedAccount(null);
    setSelectedContacts([]);
  };

  // Contact modal handlers
  const handleOpenContactModal = () => {
    setKeyModal((prev) => prev + 1);
    setModalCreateNewContact(true);
  };

  const handleOpenChooseContactModal = () => {
    setModalChooseContact(true);
  };

  const handleChooseContact = (contacts) => {
    setSelectedContacts((prev) => {
      const existingIds = new Set(prev.map((c) => c.contactId));
      const newContacts = contacts.filter((c) => !existingIds.has(c.contactId));
      return [...prev, ...newContacts];
    });
  };

  const handleRemoveContact = (contactId) => {
    setSelectedContacts((prev) => prev.filter((c) => c.contactId !== contactId));
  };

  const handleResetDataDetail = () => {
    setPrefix1({});
    setPrefix2({});
    setSuffix({});
    setValue({});
    setIsEditing(false);
    setEmptyValueValidate(false);
    setModalValidate(false);
  };

  const handleCreateContactFromModal = () => {
    if (dataCreateNew && dataCreateNew.contactDetail && dataCreateNew.contactDetail.length > 0) {
      const body = {
        firstName: dataCreateNew.firstName,
        middleName: dataCreateNew.middleName || "",
        lastName: dataCreateNew.lastName || "",
        jobId: dataCreateNew.job,
        positionId: dataCreateNew.position,
        contactAddressId: dataCreateNew.contactAddressId || null,
        additionalNote: dataCreateNew.additionalNote || "",
        primaryFlag: dataCreateNew.primaryFlag || false,
        description: dataCreateNew.description || "",
        contactDetails: dataCreateNew.contactDetail.map((cd) => ({
          type: cd.typeId,
          inputType: cd.inputTypeId,
          value: cd.value,
          prefix1: cd.prefix1,
          prefix2: cd.prefix2,
          sufix: cd.sufix,
        })),
      };
      setLoadingCreateContact(true);
      dispatch(createContact(body))
        .then((response) => {
          setModalCreateNewContact(false);
          setDataCreateNew({});
          handleResetDataDetail();
          if (response?.payload) {
            const contactDetailDtos = (dataCreateNew.contactDetail || []).map((cd) => {
              const typeName = data_contact_type?.find((t) => t.id === cd.typeId)?.text || null;
              let displayValue = cd.value || "";
              if (cd.prefix1) {
                const prefix1Name = data_country_code?.find((c) => c.id === cd.prefix1)?.text;
                if (prefix1Name) displayValue = `(${prefix1Name}) ${displayValue}`;
              }
              if (cd.prefix2) {
                const prefix2Name = data_country_zone?.find((z) => z.id === cd.prefix2)?.text;
                if (prefix2Name) displayValue = displayValue ? `(${prefix2Name}) ${displayValue}` : `(${prefix2Name})`;
              }
              if (cd.sufix) {
                displayValue = `${displayValue} Ext ${cd.sufix}`;
              }
              return {
                type: typeName,
                value: displayValue,
              };
            });
            const newContact = {
              contactId: response.payload,
              contactName: [dataCreateNew.firstName, dataCreateNew.middleName, dataCreateNew.lastName].filter(Boolean).join(" "),
              job: data_job?.find((j) => j.id === dataCreateNew.job)?.text || null,
              position: data_position?.find((p) => p.id === dataCreateNew.position)?.text || null,
              address: null,
              isPrimary: dataCreateNew.primaryFlag || false,
              contactDetails: contactDetailDtos,
            };
            setSelectedContacts((prev) => [...prev, newContact]);
          }
        })
        .finally(() => setLoadingCreateContact(false));
    }
  };

  useEffect(() => {
    if (dataCreateNew?.contactDetail && dataCreateNew.contactDetail.length > 0 && !modalCreateNewContact) {
      handleCreateContactFromModal();
    }
  }, [dataCreateNew]);

  const handleOpenItemSelect = (currency, billItemId, checked) => {
    if (checked) {
      setSelectedOpenItems((prev) => [...prev, { currency, billItemId }]);
    } else {
      setSelectedOpenItems((prev) =>
        prev.filter((item) => !(item.currency === currency && item.billItemId === billItemId)),
      );
    }
  };

  const generatePeriods = (startPeriod, tenor) => {
    const periods = [];
    let currentDate;

    if (moment.isMoment(startPeriod)) {
      currentDate = startPeriod.clone();
    } else if (startPeriod && typeof startPeriod === "string") {
      const [month, year] = startPeriod.split("-").map(Number);
      currentDate = moment(`${year}-${month}`, "YYYY-MM");
    } else {
      return periods;
    }

    for (let i = 0; i < tenor; i++) {
      periods.push(currentDate.format("MM-YYYY"));
      currentDate = currentDate.clone().add(1, "month");
    }
    return periods;
  };

  const calculateInstallmentDetails = () => {
    const values = form.getFieldsValue();
    const { installmentType, tenor, startPeriod } = values;

    if (!tenor || !startPeriod) return;

    const selectedCurrencies = [...new Set(selectedOpenItems.map((item) => item.currency))];
    const periods = generatePeriods(startPeriod, tenor);
    const newDetails = {};
    const newErrors = {};

    selectedCurrencies.forEach((currency) => {
      const currencyItems = selectedOpenItems.filter((item) => item.currency === currency);
      // find billHeaderId from first selected open item for this currency
      const firstSelected = currencyItems[0];
      const billHeaderIdForCurrency = firstSelected
        ? (data_open_items || [])
            .find((g) => g.currency === currency)?.items?.find((i) => i.billItemId === firstSelected.billItemId)
            ?.billHeaderId
        : null;
      const totalAmount = currencyItems.reduce((sum, item) => {
        const openItem = (data_open_items || []).find((g) => g.currency === currency)?.items?.find(
          (i) => i.billItemId === item.billItemId,
        );
        return sum + (openItem?.amount || 0);
      }, 0);

      if (installmentType === "AUTOMATIC") {
        const monthlyAmount = Math.floor(totalAmount / tenor);
        const lastMonthAmount = totalAmount - monthlyAmount * (tenor - 1);
        newDetails[currency] = periods.map((period, idx) => ({
          period,
          amount: idx === tenor - 1 ? lastMonthAmount : monthlyAmount,
          billHeaderId: billHeaderIdForCurrency || null,
        }));
        newErrors[currency] = null;
      } else {
        const existingDetails = installmentDetails[currency] || [];
        newDetails[currency] = periods.map((period, idx) => ({
          period,
          amount: existingDetails[idx]?.amount || 0,
          // preserve existing billHeaderId if present, otherwise use billHeaderId from selected open item
          billHeaderId: existingDetails[idx]?.billHeaderId || billHeaderIdForCurrency || null,
        }));
      }
    });

    setInstallmentDetails(newDetails);
    validateCustomAmounts(newDetails);
  };

  const validateCustomAmounts = (details) => {
    const values = form.getFieldsValue();
    const { installmentType } = values;

    if (installmentType !== "CUSTOM") {
      setInstallmentValidationError({});
      return;
    }

    const errors = {};
    const selectedCurrencies = [...new Set(selectedOpenItems.map((item) => item.currency))];

    selectedCurrencies.forEach((currency) => {
      const currencyItems = selectedOpenItems.filter((item) => item.currency === currency);
      const expectedTotal = currencyItems.reduce((sum, item) => {
        const openItem = (data_open_items || []).find((g) => g.currency === currency)?.items?.find(
          (i) => i.billItemId === item.billItemId,
        );
        return sum + (openItem?.amount || 0);
      }, 0);

      const currentTotal = (details[currency] || []).reduce((sum, item) => sum + (item.amount || 0), 0);

      if (currentTotal !== expectedTotal) {
        const diff = expectedTotal - currentTotal;
        if (diff > 0) {
          errors[currency] = `Kurang ${new Intl.NumberFormat("id-ID").format(diff)} dari total ${new Intl.NumberFormat(
            "id-ID",
          ).format(expectedTotal)}`;
        } else {
          errors[currency] = `Lebih ${new Intl.NumberFormat("id-ID").format(
            Math.abs(diff),
          )} dari total ${new Intl.NumberFormat("id-ID").format(expectedTotal)}`;
        }
      } else {
        errors[currency] = null;
      }
    });

    setInstallmentValidationError(errors);
  };

  const handleInstallmentAmountChange = (currency, index, value) => {
    setInstallmentDetails((prev) => {
      const updated = { ...prev };
      if (updated[currency]) {
        updated[currency] = updated[currency].map((item, idx) =>
          idx === index ? { ...item, amount: parseFloat(value) || 0 } : item,
        );
      }
      validateCustomAmounts(updated);
      return updated;
    });
  };

  const handleCancel = () => {
    dispatch(clearDetailInstallment());
    navigate(RBI_ROUTES.MANAGEMENT_BILLING_INSTALLMENT_VIEW);
  };

  const handleSaveDraft = () => {
    const hasErrors = Object.values(installmentValidationError).some((err) => err !== null);
    if (hasErrors) {
      return;
    }

    form
      .validateFields()
      .then((values) => {
        prepareConfirmationData(values, false);
      })
      .catch(() => {});
  };

  const handleSubmit = () => {
    const hasErrors = Object.values(installmentValidationError).some((err) => err !== null);
    if (hasErrors) {
      return;
    }

    if (!selectedApprovalHierarchy) {
      return;
    }

    form
      .validateFields()
      .then((values) => {
        prepareConfirmationData(values, true);
      })
      .catch(() => {});
  };

  const prepareConfirmationData = (values, isSubmit) => {
    const { installmentType, tenor, startPeriod } = values;
    const selectedCurrencies = [...new Set(selectedOpenItems.map((item) => item.currency))];
    
    const details = selectedCurrencies.map((currency) => {
      const currencyItems = selectedOpenItems.filter((item) => item.currency === currency);
      const totalAmount = currencyItems.reduce((sum, item) => {
        const openItem = (data_open_items || []).find((g) => g.currency === currency)?.items?.find((i) => i.billItemId === item.billItemId);
        return sum + (openItem?.amount || 0);
      }, 0);

      return {
        currency,
        totalAmount,
        items: (installmentDetails[currency] || []).map((detail) => ({
          period: detail.period,
          amount: detail.amount,
          billHeaderId: detail.billHeaderId || null,
        })),
      };
    });

    const selectedOpenItemsPayload = selectedOpenItems.map((item) => {
      const openItem = (data_open_items || []).find((g) => g.currency === item.currency)?.items?.find((i) => i.billItemId === item.billItemId);
      return {
        billingItemId: item.billItemId,
        billingItemName: openItem?.billingItemName || "",
        invoiceNumber: openItem?.invoiceNumber || "",
        billingPeriod: openItem?.billPeriod || "",
        allocatedAmount: openItem?.amount || 0,
        currency: item.currency,
      };
    });

    const selectedContactsPayload = (selectedContacts || []).map((contact) => {
      const primaryDetail = contact.contactDetails?.[0];
      return {
        contactId: contact.contactId,
        contactName: contact.contactName || "-",
        job: contact.job || "-",
        position: contact.position || "-",
        contactType: primaryDetail?.type || "-",
        contactValue: primaryDetail?.value || "-",
      };
    });

    setConfirmationData({
      accountNumber: values.accountNumber,
      accountName: data_account_detail?.accountName || "-",
      installmentType: values.installmentType,
      tenor: values.tenor,
      startPeriod: values.startPeriod ? moment(values.startPeriod).format("MM-YYYY") : "",
      source: values.source,
      requestDate: values.requestDate ? moment(values.requestDate).format("YYYY-MM-DD") : "",
      remark: values.remark || "",
      currency: details[0]?.currency || "IDR",
      openItems: selectedOpenItemsPayload,
      details: details[0]?.items || [],
      contacts: selectedContactsPayload,
    });

    setIsSubmitAction(isSubmit);
    setModalConfirmation(true);
  };

  const handleConfirmModal = () => {
    setModalConfirmation(false);
    setLoadingForm(true);

    const body = {
      accountNumber: confirmationData.accountNumber,
      installmentType: confirmationData.installmentType,
      tenor: confirmationData.tenor,
      startPeriod: confirmationData.startPeriod,
      source: confirmationData.source,
      requestDate: confirmationData.requestDate,
      remark: confirmationData.remark || "",
      isSubmit: isSubmitAction,
      appHierId: selectedApprovalHierarchy,
      contactIds: selectedContacts.map((c) => c.contactId),
      details: [
        {
          currency: confirmationData.currency,
          totalAmount: confirmationData.details.reduce((sum, item) => sum + (item.amount || 0), 0),
          items: confirmationData.details,
        },
      ],
      selectedOpenItems: confirmationData.openItems,
    };

    // Validate that all detail items include non-null billHeaderId
    const missingBillHeader = (body.details || []).some((d) => (d.items || []).some((it) => !it.billHeaderId));
    if (missingBillHeader) {
      setLoadingForm(false);
      setBodyError({ message: "Tidak dapat menyimpan: billHeaderId tidak tersedia pada beberapa periode. Pastikan open item memiliki billHeaderId." });
      setModalError(true);
      return;
    }

    dispatch(updateInstallment({ installmentId: id, body }))
      .unwrap()
      .then(async (response) => {
        const installmentId = id;

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
              formData.append("referenceId", String(installmentId));
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

  const handleNext = () => {
    form
      .validateFields(["accountNumber", "installmentType", "tenor", "startPeriod", "source", "requestDate"])
      .then(() => {
        setCurrentStep(1);
      })
      .catch(() => {});
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const accountOptions = useMemo(() => {
    return (data_account || []).map((acc) => ({
      value: acc.accountNumber,
      label: `${acc.accountNumber} - ${acc.accountName}`,
    }));
  }, [data_account]);

  const typeOptions = useMemo(() => {
    return (data_types || []).map((t) => ({
      value: t.key,
      label: t.value,
    }));
  }, [data_types]);

  const sourceOptions = useMemo(() => {
    return (data_sources || []).map((s) => ({
      value: s.key,
      label: s.value,
    }));
  }, [data_sources]);

  const tenorOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} Bulan`,
  }));

  const renderAccountInformation = () => (
    <BaseContainer header="ACCOUNT INFORMATION">
      <Spin spinning={loadingAccountDetail}>
        <div className="w-full grid grid-cols-5 gap-1">
          <Form.Item
            name="accountNumber"
            label="Account Number"
            rules={[{ required: true, message: "Field ini wajib diisi" }]}
            style={{ marginBottom: 0 }}
          >
            <Select
              showSearch
              placeholder="Pilih Account Number"
              optionFilterProp="label"
              onChange={handleAccountChange}
              options={accountOptions}
              loading={loadingAccounts}
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
          <Tooltip title={isLong ? text : ""}>
            <span>{displayText}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Primary",
      dataIndex: "isPrimary",
      key: "isPrimary",
      width: 80,
      sorter: (a, b) => (a.isPrimary === b.isPrimary ? 0 : a.isPrimary ? -1 : 1),
      ...getColumnSearchProps("isPrimary", contactSearchText, setContactSearchText, contactSearchedColumn, setContactSearchedColumn, contactSearchInput),
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
      ...getColumnSearchProps("type", contactSearchText, setContactSearchText, contactSearchedColumn, setContactSearchedColumn, contactSearchInput),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      width: 250,
      sorter: (a, b) => (a.value || "").localeCompare(b.value || ""),
      ...getColumnSearchProps("value", contactSearchText, setContactSearchText, contactSearchedColumn, setContactSearchedColumn, contactSearchInput),
    },
  ];

  const renderContactInformation = () => (
    <BaseContainer header="CONTACT INFORMATION">
      {selectedAccount && (
        <div className="flex w-full justify-end gap-x-2 pb-6">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={18} />}
            type="submit"
            border={false}
            onClick={handleOpenContactModal}
          >
            Create Contact
          </ButtonComponent>
        </div>
      )}
      {!selectedAccount ? (
        <p className="text-gray-400 text-xs">Pilih Account Number terlebih dahulu</p>
      ) : (
        <Table
          className="custom-table-small"
          columns={[...contactColumns, {
            title: "Action",
            key: "action",
            width: 80,
            align: "center",
            render: (_, record) => (
              <Button
                type="link"
                danger
                size="small"
                onClick={() => handleRemoveContact(record.contactId)}
              >
                Remove
              </Button>
            ),
          }]}
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
          name="installmentType"
          label="Type"
          rules={[{ required: true, message: "Field ini wajib diisi" }]}
          style={{ marginBottom: 0 }}
        >
          <Select placeholder="Pilih Type" options={typeOptions} loading={loadingTypes} />
        </Form.Item>

        <Form.Item
          name="tenor"
          label="Tenor"
          rules={[{ required: true, message: "Field ini wajib diisi" }]}
          style={{ marginBottom: 0 }}
        >
          <Select placeholder="Pilih Tenor" options={tenorOptions} onChange={handleTenorChange} />
        </Form.Item>

        <Form.Item
          name="startPeriod"
          label="Start Period"
          rules={[{ required: true, message: "Field ini wajib diisi" }]}
          style={{ marginBottom: 0 }}
        >
          <DatePicker
            picker="month"
            placeholder="Pilih Start Period"
            format="MM-YYYY"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="source"
          label="Source"
          rules={[{ required: true, message: "Field ini wajib diisi" }]}
          style={{ marginBottom: 0 }}
        >
          <Select placeholder="Pilih Source" options={sourceOptions} loading={loadingSources} />
        </Form.Item>

        <Form.Item
          name="requestDate"
          label="Request Date"
          rules={[{ required: true, message: "Field ini wajib diisi" }]}
          style={{ marginBottom: 0 }}
        >
          <DatePicker
            placeholder="Pilih Request Date"
            format="YYYY-MM-DD"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item name="remark" label="Remark" className="col-span-5" style={{ marginBottom: 0 }}>
          <TextArea placeholder="Optional remark" rows={3} maxLength={500} />
        </Form.Item>
      </div>
    </BaseContainer>
  );

  const openItemColumns = [
    {
      title: "",
      key: "select",
      width: 40,
      render: (_, record) => (
        <Checkbox
          checked={selectedOpenItems.some(
            (item) => item.currency === record.currency && item.billItemId === record.billItemId,
          )}
          onChange={(e) => handleOpenItemSelect(record.currency, record.billItemId, e.target.checked)}
          disabled
        />
      ),
    },
    {
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      width: 150,
      sorter: (a, b) => (a.invoiceNumber || "").localeCompare(b.invoiceNumber || ""),
      ...getColumnSearchProps("invoiceNumber", openItemSearchText, setOpenItemSearchText, openItemSearchedColumn, setOpenItemSearchedColumn, openItemSearchInput),
    },
    {
      title: "Billing Period",
      dataIndex: "billingPeriod",
      key: "billingPeriod",
      width: 120,
      sorter: (a, b) => (a.billingPeriod || "").localeCompare(b.billingPeriod || ""),
      ...getColumnSearchProps("billingPeriod", openItemSearchText, setOpenItemSearchText, openItemSearchedColumn, setOpenItemSearchedColumn, openItemSearchInput),
    },
    {
      title: "Billing Item Name",
      dataIndex: "billingItemName",
      key: "billingItemName",
      width: 200,
      sorter: (a, b) => (a.billingItemName || "").localeCompare(b.billingItemName || ""),
      ...getColumnSearchProps("billingItemName", openItemSearchText, setOpenItemSearchText, openItemSearchedColumn, setOpenItemSearchedColumn, openItemSearchInput),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      align: "right",
      sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
      ...getColumnSearchProps("amount", openItemSearchText, setOpenItemSearchText, openItemSearchedColumn, setOpenItemSearchedColumn, openItemSearchInput),
      render: (amount) => new Intl.NumberFormat("id-ID").format(amount || 0),
    },
  ];

  const renderOpenItemInformation = () => (
    <BaseContainer header="OPEN ITEM INFORMATION">
      {!selectedAccount ? (
        <p className="text-gray-400 text-xs">Pilih Account Number terlebih dahulu</p>
      ) : (data_open_items || []).length === 0 ? (
        <p className="text-gray-400 text-xs">Tidak ada open item untuk account ini</p>
      ) : (
        <div className="space-y-4">
          {(data_open_items || []).map((currencyGroup) => {
            const selectedItems = (currencyGroup.items || []).filter((item) =>
              selectedOpenItems.some(
                (sel) => sel.currency === currencyGroup.currency && sel.billItemId === item.billItemId,
              ),
            );
            const totalAmount = selectedItems.reduce((sum, item) => sum + (item.amount || 0), 0);

            return (
              <div key={currencyGroup.currency} className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-primary mb-2">Currency: {currencyGroup.currency}</p>
                <Table
                  className="custom-table-small"
                  columns={openItemColumns}
                  dataSource={(currencyGroup.items || []).map((item, idx) => ({
                    ...item,
                    key: `${currencyGroup.currency}-${item.billItemId}`,
                    currency: currencyGroup.currency,
                  }))}
                  loading={loadingOpenItems}
                  pagination={false}
                  size="small"
                  bordered={true}
                  scroll={{ y: 200 }}
                  summary={() => (
                    <Table.Summary.Row>
                      <Table.Summary.Cell colSpan={4} index={0}>
                        <strong>Total Selected</strong>
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
        </div>
      )}
    </BaseContainer>
  );

  const renderInstallmentCalculationDetail = () => {
    const values = form.getFieldsValue();
    const { installmentType, tenor } = values;
    const selectedCurrencies = [...new Set(selectedOpenItems.map((item) => item.currency))];

    return (
      <BaseContainer header="INSTALLMENT CALCULATION DETAIL">
        {!selectedAccount ? (
          <p className="text-gray-400 text-xs">Pilih Account Number terlebih dahulu</p>
        ) : selectedCurrencies.length === 0 ? (
          <p className="text-gray-400 text-xs">Pilih open item terlebih dahulu</p>
        ) : !tenor ? (
          <p className="text-gray-400 text-xs">Isi tenor terlebih dahulu</p>
        ) : (
          <div className="space-y-4">
            {selectedCurrencies.map((currency) => {
              const details = installmentDetails[currency] || [];
              const totalAmount = details.reduce((sum, item) => sum + (item.amount || 0), 0);

              const columns = [
                {
                  title: "Sequence",
                  dataIndex: "sequenceNo",
                  key: "sequenceNo",
                  width: 100,
                  align: "center",
                  ...getColumnSearchProps("sequenceNo", detailSearchText, setDetailSearchText, detailSearchedColumn, setDetailSearchedColumn, detailSearchInput),
                  render: (_, __, index) => index + 1,
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
                  width: 150,
                  align: "right",
                  sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
                  ...getColumnSearchProps("amount", detailSearchText, setDetailSearchText, detailSearchedColumn, setDetailSearchedColumn, detailSearchInput),
                  render: (amount, record, index) => {
                    if (installmentType === "AUTOMATIC") {
                      return new Intl.NumberFormat("id-ID").format(amount || 0);
                    }
                    return (
                      <Input
                        type="number"
                        value={amount || ""}
                        onChange={(e) => handleInstallmentAmountChange(currency, index, e.target.value)}
                        placeholder="0"
                        style={{ textAlign: "right" }}
                      />
                    );
                  },
                },
                {
                  title: "Status",
                  dataIndex: "status",
                  key: "status",
                  width: 120,
                  align: "center",
                  ...getColumnSearchProps("status", detailSearchText, setDetailSearchText, detailSearchedColumn, setDetailSearchedColumn, detailSearchInput),
                  render: () => (
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">Draft</span>
                  ),
                },
              ];

              return (
                <div key={currency} className="border border-gray-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-primary mb-2">Currency: {currency}</p>
                  <Table
                    className="custom-table-small"
                    columns={columns}
                    dataSource={details.map((item, idx) => ({
                      ...item,
                      key: idx,
                      sequenceNo: idx + 1,
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
                  {installmentValidationError[currency] && (
                    <p className="text-xs text-red-500 mt-2">{installmentValidationError[currency]}</p>
                  )}
                </div>
              );
            })}
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

      <ConfirmationInstallment
        isOpen={modalConfirmation}
        data={confirmationData}
        selectedHierarchy={selectedApprovalHierarchy}
        listDataAppHierDetail={data_approval_detail || []}
        listDataAttachment={listDataAttachment}
        listDataOpenItems={confirmationData.openItems || []}
        listDataDetails={confirmationData.details || []}
        listDataContacts={confirmationData.contacts || []}
        handleCancel={() => setModalConfirmation(false)}
        handleConfirm={handleConfirmModal}
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
        onValuesChange={(changedValues) => {
          if (changedValues.installmentType || changedValues.tenor || changedValues.startPeriod) {
            setTimeout(() => calculateInstallmentDetails(), 100);
          }
        }}
      >
        <div style={{ display: currentStep !== 0 ? "none" : undefined }}>
          {renderAccountInformation()}
          {renderInstallmentInformation()}
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
          disableSubmit={
            Object.values(installmentValidationError).some((err) => err !== null) ||
            (currentStep === 1 && !selectedApprovalHierarchy)
          }
        />
      </Form>

      <Spin spinning={loadingCreateContact}>
        <ModalCreateNewContact
          key={keyModal}
          isOpen={modalCreateNewContact}
          setModalCreateNewContact={setModalCreateNewContact}
          dataJob={data_job || []}
          dataPosition={data_position || []}
          dataContactType={data_contact_type || []}
          dataInputType={data_input_type || []}
          dataCountryCode={data_country_code || []}
          dataCountryZone={data_country_zone || []}
          getCountryZone={(countryId) => dispatch(getCountryZone(countryId))}
          keyModal={keyModal}
          setDataCreateNew={setDataCreateNew}
          setModalChooseContact={setModalChooseContact}
          showChooseContactAction={true}
          handleResetDataDetail={handleResetDataDetail}
          prefix1={prefix1}
          setPrefix1={setPrefix1}
          prefix2={prefix2}
          setPrefix2={setPrefix2}
          suffix={suffix}
          setSuffix={setSuffix}
          value={value}
          setValue={setValue}
          setEmptyValueValidate={setEmptyValueValidate}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          setModalValidate={setModalValidate}
        />
      </Spin>

      <ModalChooseContact
        isOpen={modalChooseContact}
        setModalChooseContact={setModalChooseContact}
        onChooseContact={handleChooseContact}
      />
    </Spin>
  );
};

export default UpdateBillingInstallmentPage;
