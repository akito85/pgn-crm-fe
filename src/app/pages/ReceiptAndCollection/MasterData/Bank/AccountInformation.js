import { WarningOutlined } from "@ant-design/icons";
import { Form, Spin, message } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumbAdvanced from "../../../../../components/BreadCrumbAdvanced";
import { FormStepper, FormFooter } from "../../../../../components/FormStepNavigation";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import {
  createAccountInformation,
  createValidasiBankAccount,
  getAllApprovalList,
  getAllGLAccount,
  getAllGLType,
  getBillingItemOptions,
  getDetailAccountInformation,
  getDisplayOptions,
  getGLAccount,
  getListApprovalById,
  getListCategory,
  getListCriteria,
  getListCurrency,
  getListEntity,
  getNomenklatur1Options,
  getNomenklatur2Options,
  getTypeList,
  getVACategoryOptions,
  updateBankAccountInfo,
  updateBankAccountNomenklatur,
  updateBankAccountGLAccounts,
  updateBankAccountCriteria,
  getParentAccountOptions,
} from "../../../../../redux/slices/receipt_collection/bankSlice";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import AttachmentSectionForm from "../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import AccountForm from "./AccountForm";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ConfirmModalBankAccount from "./ConfirmModalBankAccount";
import ButtonComponent from "../../../../../components/ButtonComponent";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import {
  showModalError,
  showModalSuccess,
} from "../../../../../redux/slices/general_slice";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";

// ID criteria "All / Semua" dari backend — digunakan di beberapa validasi
const CRITERIA_ALL_ID = 24;

const AccountInformation = ({ type, bankId }) => {
  const {
    dataEntity,
    dataCurrency,
    data_type_detail,
    data_select_criteria,
    dataListAppHierId,
    dataListAppHierDetail,
    loading,
    data_modal,
    data_list_gl,
    dataGLAccount,
    dataGLType,
    data_va_category,
    data_billing_item,
    data_parent_options,
  } = useSelector((state) => state.bank);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const id = location?.state?.id;
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();

  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [modalBack, setModalBack] = useState(false);
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [kirimBody, setKirimBody] = useState();
  const [loadingForm, setLoadingForm] = useState(loading);
  const [storedData, setStoredData] = useState(false);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const steps = [
    { title: 'ACCOUNT' },
    { title: 'APPROVAL' },
    { title: 'ATTACHMENT' },
  ];

  // Watch form fields for conditional logic
  const typeValue = Form.useWatch('type', form);
  const headerCategory = Form.useWatch('category', form);
  // null = data belum diload; string kosong = tidak ditemukan
  const typeLabel = data_type_detail?.find(t => t.id === typeValue)?.name ?? null;
  const parentRequired = typeLabel !== null && typeLabel.toLowerCase() === 'pooling';

  useEffect(() => {
    if (!parentRequired) {
      form.setFieldValue('parent', undefined);
    }
  }, [parentRequired, form]);

  useEffect(() => {
    dispatch(getListEntity());
    dispatch(getAllApprovalList());
    dispatch(getListCurrency());
    dispatch(getTypeList());
    dispatch(getListCriteria());
    dispatch(getGLAccount());
    dispatch(getAllGLAccount());
    dispatch(getAllGLType());
    dispatch(getVACategoryOptions());
    dispatch(getNomenklatur1Options());
    dispatch(getNomenklatur2Options());
    dispatch(getDisplayOptions());
    dispatch(getBillingItemOptions());
  }, [dispatch]);

  useEffect(() => {
    if (type === "create" && id) {
      dispatch(getParentAccountOptions(id));
    }
  }, [dispatch, type, id]);

  // Ekstrak ke nilai primitif agar useEffect tidak re-run setiap referensi data_modal berubah
  const bankIdFromModal = data_modal?.accountBankDto?.bankId;
  useEffect(() => {
    if (type === "update" && bankIdFromModal) {
      dispatch(getParentAccountOptions(bankIdFromModal));
    }
  }, [dispatch, type, bankIdFromModal]);

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
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getListApprovalById({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

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

  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState([]);

  // Ref digunakan agar handleUpdateAttachment bisa membaca state terkini
  // tanpa memanggil setState bersarang di dalam setState (anti-pattern React)
  const listDataAttachmentRef = useRef(listDataAttachment);
  useEffect(() => {
    listDataAttachmentRef.current = listDataAttachment;
  }, [listDataAttachment]);

  const handleUpdateAttachment = (updater) => {
    const prev = listDataAttachmentRef.current;
    const next = typeof updater === "function" ? updater(prev) : updater;

    // Undo: existing item's pendingDelete changed from true → false
    const undone = next.filter(
      (n) => n.dataType === "exist" && !n.pendingDelete &&
        prev.find((p) => p.id === n.id && p.pendingDelete)
    );
    if (undone.length > 0) {
      setListDataAttachment(next);
      setDeletedAttachmentIds((ids) =>
        ids.filter((id) => !undone.map((u) => u.id).includes(id))
      );
      return;
    }

    // Delete: existing item removed from array — keep it but mark as pending
    const removed = prev.filter(
      (item) => item.dataType === "exist" && !item.pendingDelete &&
        !next.find((n) => n.id === item.id)
    );
    if (removed.length > 0) {
      const idsToAdd = removed.map((r) => r.id).filter(Boolean);
      setListDataAttachment([...next, ...removed.map((r) => ({ ...r, pendingDelete: true }))]);
      setDeletedAttachmentIds((ids) => [...ids, ...idsToAdd]);
      return;
    }

    setListDataAttachment(next);
  };
  const [modalConfirm, setModalConfirm] = useState(false);
  const [data, setData] = useState([]);
  const [valueOrUnlimited, setValueOrUnlimited] = useState(false);
  const [listDataCriteria, setListDataCriteria] = useState([]);
  const [listDataGLAccountInfo, setListDataGLAccountInfo] = useState([]);
  const [listDataCategoryInfo, setListDataCategoryInfo] = useState([]);

  // dirty flags
  const [bankInfoDirty, setBankInfoDirty] = useState(false);
  const [glDirty, setGlDirty] = useState(false);
  const [categoryDirty, setCategoryDirty] = useState(false);
  const [criteriaDirty, setCriteriaDirty] = useState(false);
  const [updatePayloads, setUpdatePayloads] = useState({});

  const handleUpdateGL = (newData) => {
    setListDataGLAccountInfo(newData);
    if (type === "update") setGlDirty(true);
  };
  const handleUpdateCategory = (newData) => {
    setListDataCategoryInfo(newData);
    if (type === "update") setCategoryDirty(true);
  };
  const handleUpdateCriteria = (newData) => {
    setListDataCriteria(newData);
    if (type === "update") setCriteriaDirty(true);
  };

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailAccountInformation(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (id && type === "update") {
      const criteriaSelect = data_modal?.accountBankDto?.criteriaDtoList?.map(
        (item) => ({
          id: item?.criteria,
          transactionCalendarId: item?.transactionCalendarId,
        })
      );
      const mappingCriteria = (criteriaSelect ?? [])
        .map((a) => Number(a.id))
        .filter((n) => n && !isNaN(n));
      const dataCriteriaList = (
        data_modal?.accountBankDto?.criteriaDataDtoList || []
      )
        .filter((crit) => crit.allCriteria !== true)
        .map((item, index) => ({
          id: item.id,
          startDate:
            item?.startDate === null
              ? ""
              : moment(item?.startDate).format(dateFormatting.dateCapital),
          endDate:
            item?.endDate === undefined || item?.endDate === null
              ? ""
              : moment(item?.endDate).format(dateFormatting.dateCapital),
          referenceId: item.referenceId,
          budget: item.budget,
          subDistrict: item.subDistrict,
          district: item.district,
          city: item.city,
          province: item.province,
          area: item.area,
          sor: item.sor,
          industrialSector: item.industrialSector,
          product: item.product,
          gsizes: item.gsizes,
          customerSegment: item.customerSegment,
          accountGroup: item.accountGroup,
          accountClass: item.accountClass,
          accountCategory: item.accountCategory,
          customer: item.customer,
          key: index + 1,
          type: "exist",
        }));

      const dataAttachment = (data_modal?.attachmentDtoList || []).map(
        (item) => ({
          id: item.id,
          size: item.size,
          fileName: item.fileName,
          fileSize: item.fileSize,
          fileType: item.fileType,
          fileCategoryId: item.fileCategoryId,
          fileCategoryName: item.fileCategoryName,
          pathFile: item.pathFile,
          urlFile1: item.urlFile1,
          urlFile2: item.urlFile2,
          uploadBy: item.createdBy,
          uploadDate: item.createdDate
            ? moment(item.createdDate).format("DD MMM YYYY")
            : "",
          dataType: "exist",
        })
      );

      setSelectedHierarchy(data_modal?.accountBankDto?.appHierId);
      form.setFieldsValue({
        accountNumber: data_modal?.accountBankDto?.accountNumber,
        accountName: data_modal?.accountBankDto?.accountName,
        startDate: data_modal?.accountBankDto?.startDate
          ? moment(data_modal?.accountBankDto?.startDate).clone()
          : "",
        endDate: data_modal?.accountBankDto?.endDate
          ? moment(data_modal?.accountBankDto?.endDate).clone()
          : "",
        currency: data_modal?.accountBankDto?.currency?.id,
        description: data_modal?.accountBankDto?.description,
        entity: data_modal?.accountBankDto?.entity?.id,
        type: data_modal?.accountBankDto?.type?.id,
        category: data_modal?.accountBankDto?.category,
        parent: data_modal?.accountBankDto?.parentId || null,
        transCriteria: mappingCriteria,
        apphierId: data_modal?.accountBankDto?.appHierId,
        criteria: mappingCriteria,
      });
      setListDataAttachment(dataAttachment);
      setListDataCriteria(dataCriteriaList);
      setCriteriaValues(mappingCriteria);

      // hydrate GL Account Information table
      const glTypeOpts = (dataGLType || []).map((t) => ({ value: t.id, label: t.name }));
      const glAccountOpts = (dataGLAccount || []).map((a) => ({
        value: a.id,
        label: a.accountNumber ?? a.name ?? "",
        description: a.description ?? a.accountDescription ?? a.desc ?? "",
      }));
      const dataGLList = (
        data_modal?.accountBankDto?.glAccountDataDtoList || []
      ).map((item, index) => {
        const typeLabel = glTypeOpts.find((o) => String(o.value) === String(item.typeId))?.label ?? null;
        const glAcc = glAccountOpts.find((o) => String(o.value) === String(item.glAccountId));
        return {
          id: item.id,
          key: index + 1,
          type: item.typeId ? { value: item.typeId, label: typeLabel } : null,
          glAccountNumber: item.glAccountId ? { value: item.glAccountId, label: glAcc?.label ?? null } : null,
          glAccountDescription: glAcc?.description ?? "",
          description: item.description || "",
          flag: 2,
        };
      });
      setListDataGLAccountInfo(dataGLList);

      // hydrate Category Information table
      const vaCatOpts = (data_va_category || []).map((c) => ({ value: c.id ?? c.Id, label: c.name ?? c.text ?? "" }));
      const billingOpts = (data_billing_item || []).map((b) => ({ value: b.id ?? b.Id, label: b.name ?? b.text ?? "" }));
      const dataCategoryList = (
        data_modal?.accountBankDto?.categoryDataDtoList || []
      ).map((item, index) => {
        const catLabel = vaCatOpts.find((o) => String(o.value) === String(item.categoryId))?.label ?? null;
        return {
          id: item.id,
          key: index + 1,
          category: item.categoryId ? { value: item.categoryId, label: catLabel } : null,
          totalDigit: item.totalDigit ? String(item.totalDigit) : "",
          staticCode: item.staticCode || "",
          nomenklatur1: item.nomenklatur1 ? { value: item.nomenklatur1, label: item.nomenklatur1 } : null,
          nomenklatur2: item.nomenklatur2 ? { value: item.nomenklatur2, label: item.nomenklatur2 } : null,
          display: item.display ? { value: item.display, label: item.display } : null,
          details: (item.billingItemIds || []).map((bid, bidIndex) => {
            const billingLabel = billingOpts.find((o) => String(o.value) === String(bid))?.label ?? String(bid);
            return { key: bidIndex + 1, billingItem: { value: bid, label: billingLabel } };
          }),
          flag: 2,
        };
      });
      setListDataCategoryInfo(dataCategoryList);
    }
  }, [id, data_modal, form, type, dataGLAccount, dataGLType, data_va_category, data_billing_item]);

  const routes = (id) => [
    { path: "", breadcrumbName: "System Setup" },
    { path: "", breadcrumbName: "Master Data" },
    { path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_MASTER_BANK, breadcrumbName: "Bank" },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.DETAIL_MASTER_BANK,
      breadcrumbName: "Detail Bank",
      state: { id },
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.CREATE_ACCOUNT_INFORMATION,
      breadcrumbName: `${type === "update" ? "Update" : "Create"} Bank Account`,
    },
  ];

  const handleNext = async () => {
    if (currentStepIndex === 0) {
      try {
        await form.validateFields([
          'accountNumber', 'accountName', 'currency', 'entity',
          'type', 'category', 'criteria', 'startDate',
        ]);
        if (parentRequired) {
          await form.validateFields(['parent']);
        }
        setCurrentStepIndex(1);
      } catch {
        message.error("Mohon lengkapi data mandatori di Step 1");
      }
    } else if (currentStepIndex === 1) {
      if (!selectedHierarchy) {
        message.error("Approval Information wajib diisi sebelum lanjut!");
        return;
      }
      setCurrentStepIndex(2);
    }
    // currentStepIndex === 2 (Attachment) adalah step terakhir — tidak ada next
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };

  const handleClear = () => {
    if (type === "update") {
      // Reset: re-fetch data asli dari API; useEffect akan mengisi ulang semua field
      dispatch(getDetailAccountInformation(id));
      setBankInfoDirty(false);
      setGlDirty(false);
      setCategoryDirty(false);
      setCriteriaDirty(false);
      setDeletedAttachmentIds([]);
    } else {
      // Clear: wipe semua form fields, tabel, dan state tambahan
      form.resetFields();
      setCriteriaValues([]);
      setSelectedHierarchy(undefined);
      setListDataGLAccountInfo([]);
      setListDataCategoryInfo([]);
      setListDataCriteria([]);
      setListDataAttachment([]);
    }
    setCurrentStepIndex(0);
  };

  const handleCancelModalConfirm = () => {
    setModalConfirm(false);
  };

  const handleSubmitForm = (formValue) => {
    let errorBody = {};
    if (listDataCategoryInfo.length === 0) {
      errorBody = {
        title: "Failed",
        description: "Category Information wajib diisi. Silahkan menambahkan minimal 1 data.",
      };
      dispatch(showModalError(errorBody));
    } else if (listDataGLAccountInfo.length === 0) {
      errorBody = {
        title: "Failed",
        description: "GL Account Information wajib diisi. Silahkan menambahkan minimal 1 data.",
      };
      dispatch(showModalError(errorBody));
    } else if (listDataCriteria.length === 0 && !formValue.criteria.includes(CRITERIA_ALL_ID)) {
      errorBody = {
        title: "Failed",
        description: "Criteria Information wajib diisi. Silahkan menambahkan minimal 1 data.",
      };
      dispatch(showModalError(errorBody));
    } else if (storedData) {
      errorBody = {
        title: "Failed",
        description: "Please save data table inline before submit. Please try again.",
      };
      dispatch(showModalError(errorBody));
    } else {
      let dataCriteriaObject = listDataCriteria.map((item) => ({
        startDate: moment(item.startDate).format(dateFormatting.date),
        endDate: item?.endDate ? moment(item.endDate).format(dateFormatting.date) : null,
        id: null,
        referenceId: null,
        customer: item.customer?.value || null,
        budget: item.budget?.value || null,
        subDistrict: item.subDistrict?.value || null,
        district: item.district?.value || null,
        city: item.city?.value || null,
        province: item.province?.value || null,
        area: item.area?.value || null,
        sor: item.sor?.value || null,
        industrialSector: item.industrialSector?.value || null,
        gsizes: item.gsizes?.value || null,
        customerSegment: item.customerSegment?.value || null,
        accountGroup: item.accountGroup?.value || null,
        serviceType: item.serviceType?.value || null,
        accountCategory: item.accountCategory?.value || null,
        allCriteria: item.all?.value || null,
      }));

      let dataGLObject = listDataGLAccountInfo.map((item) => ({
        id: item?.id || null,
        typeId: item.type?.value || null,
        glAccountId: item.glAccountNumber?.value || null,
        glAccountDescription: item.glAccountDescription || null,
        description: item.description || null,
        flag: item.flag || null,
      }));

      let dataCategoryObject = listDataCategoryInfo.map((item) => ({
        id: item?.id || null,
        categoryId: item.category?.value || null,
        totalDigit: item.totalDigit ? parseInt(item.totalDigit) : null,
        staticCode: item.staticCode || null,
        nomenklatur1: item.nomenklatur1?.label || null,
        nomenklatur2: item.nomenklatur2?.label || null,
        display: item.display?.label || null,
        billingItemIds: Array.isArray(item.details)
          ? item.details.map((d) => d?.billingItem?.value ?? d?.billingItem).filter(Boolean)
          : [],
        flag: item.flag || null,
      }));

      const startDate = moment(formValue?.startDate).format("DD MMM YYYY");
      const endDate = formValue?.endDate
        ? moment(formValue?.endDate).format("DD MMM YYYY")
        : null;

      const dataValue = {
        accountNumber: formValue?.accountNumber,
        accountName: formValue?.accountName,
        bankId: id,
        currencyId: formValue?.currency,
        entityId: formValue?.entity,
        typeId: formValue?.type,
        category: formValue?.category,
        parentId: formValue?.parent || null,
        startDate,
        endDate,
        description: formValue?.description,
        appHierId: selectedHierarchy,
        glAccountDataDtoList: dataGLObject,
        categoryDataDtoList: dataCategoryObject,
        criteriaIdList: formValue?.criteria,
        criteriaDataDtoList: dataCriteriaObject,
      };
      setKirimBody(dataValue);

      if (type === "create") {
        dispatch(createValidasiBankAccount(dataValue))
          .unwrap()
          .then(async (data) => {
            const sukses = data?.success;
            if (sukses === false) {
              setModalConfirm(false);
            }
            setModalConfirm(true);
          });
      } else if (type === "update") {
        const bankInfoPayload = {
          id,
          accountNumber: formValue?.accountNumber,
          accountName: formValue?.accountName,
          currencyId: formValue?.currency,
          entityId: formValue?.entity,
          typeId: formValue?.type,
          category: formValue?.category,
          parentId: formValue?.parent || null,
          startDate,
          endDate,
          description: formValue?.description,
          appHierId: selectedHierarchy,
        };
        const criteriaPayload = {
          criteriaDtoList: (formValue?.criteria || []).map((criteriaId) => ({ criteria: criteriaId })),
          criteriaDataDtoList: dataCriteriaObject.map((item) => ({ ...item, id: item.id || null })),
        };
        setUpdatePayloads({
          bankInfo: bankInfoPayload,
          glAccounts: dataGLObject,
          nomenklatur: dataCategoryObject,
          criteria: criteriaPayload,
        });
        setModalConfirm(true);
      }
    }
  };

  const handleError = ({ errorFields }) => {
    if (errorFields?.length > 0) {
      message.error("Mohon lengkapi data mandatori");
    }
  };

  const handleProcessModalConfirm = async () => {
    setModalConfirm(false);
    setLoadingForm(true);
    const successMessage = {
      title: "Successfull",
      description: "Your data has been submitted",
      return: true,
    };

    if (type === "update") {
      try {
        const calls = [];
        if (bankInfoDirty) calls.push(dispatch(updateBankAccountInfo({ id, data: updatePayloads.bankInfo })).unwrap());
        if (glDirty) calls.push(dispatch(updateBankAccountGLAccounts({ id, data: updatePayloads.glAccounts })).unwrap());
        if (categoryDirty) calls.push(dispatch(updateBankAccountNomenklatur({ id, data: updatePayloads.nomenklatur })).unwrap());
        if (criteriaDirty) calls.push(dispatch(updateBankAccountCriteria({ id, data: updatePayloads.criteria })).unwrap());
        // Upload new attachments
        const newAttachments = listDataAttachment.filter((item) => item.dataType !== "exist");
        for (const element of newAttachments) {
          calls.push(
            receiptCollectionHttpService.uploadImage(`/v1/dbs/api/attachment/upload/v1`, {
              files: element.file,
              fileCategoryId: element.fileCategoryId,
              referensiId: id,
              category: "BANK ACCOUNT",
            })
          );
        }
        if (calls.length === 0 && deletedAttachmentIds.length === 0) {
          dispatch(showModalError({ title: "No Changes", description: "No changes detected to save." }));
          return;
        }
        await Promise.all(calls);
        // Delete removed existing attachments — silently skip if endpoint not yet available
        for (const attachId of deletedAttachmentIds) {
          try {
            await receiptCollectionHttpService.deleteData(`/v1/dbs/api/attachment/delete/${attachId}`);
          } catch {
            // endpoint not yet implemented; skip
          }
        }
        // Remove pending-delete rows from the displayed list
        setListDataAttachment((prev) => prev.filter((item) => !item.pendingDelete));
        dispatch(showModalSuccess(successMessage));
        setBankInfoDirty(false);
        setGlDirty(false);
        setCategoryDirty(false);
        setCriteriaDirty(false);
        setDeletedAttachmentIds([]);
      } catch (error) {
        // errors already shown by individual thunks
      } finally {
        setLoadingForm(false);
      }
      return;
    }

    // create flow
    let temp = { ...kirimBody };
    if ((temp.criteriaIdList || []).includes(CRITERIA_ALL_ID)) {
      temp = { ...temp, criteriaDataDtoList: [{ allCriteria: true }] };
    }
    dispatch(createAccountInformation(temp))
      .unwrap()
      .then(async (data) => {
        let createdId = data.id;
        for (let icon = 0; icon < listDataAttachment.length; icon++) {
          const element = listDataAttachment[icon];
          const body = {
            files: element.file,
            fileCategoryId: element.fileCategoryId,
            referensiId: createdId,
            category: "BANK ACCOUNT",
          };
          await receiptCollectionHttpService.uploadImage(
            `/v1/dbs/api/attachment/upload/v1`,
            body
          );
        }
        handleCancelModalConfirm();
        handleClear();
        dispatch(showModalSuccess(successMessage));
      })
      .catch((error) => {
        if (Math.floor((error.response?.data?.code || 0) / 100) === 5) {
          const msg =
            (error.response?.data?.message) ||
            error.message ||
            error.toString();
          dispatch(showModalError(msg));
        }
      })
      .finally(() => {
        setLoadingForm(false);
      });
  };

  const handleSelectCriteria = useCallback(
    (value) => {
      let res = [...criteriaValues, value];
      if (res.includes(13)) res.push(14);
      if (res.includes(14)) res.push(39);
      if (res.includes(39)) res.push(15);
      if (res.includes(20)) res.push(19);
      let outputArray = res.filter((item, index) => res.indexOf(item) === index);
      outputArray = outputArray.includes(CRITERIA_ALL_ID) ? [CRITERIA_ALL_ID] : outputArray;
      setCriteriaValues(outputArray);
      form.setFieldsValue({ criteria: outputArray });
      if (type === "update") setCriteriaDirty(true);
    },
    [criteriaValues, form, type]
  );

  const handleDeselectCriteria = useCallback(
    (value) => {
      let res = criteriaValues.filter((item) => item !== value);
      if (!res.includes(15)) res = res.filter((item) => item !== 39);
      if (!res.includes(39)) res = res.filter((item) => item !== 14);
      if (!res.includes(14)) res = res.filter((item) => item !== 13);
      if (!res.includes(19)) res = res.filter((item) => item !== 20);
      let outputArray = res.filter((item, index) => res.indexOf(item) === index);
      outputArray = outputArray.includes(CRITERIA_ALL_ID) ? [CRITERIA_ALL_ID] : outputArray;
      setCriteriaValues(outputArray);
      form.setFieldsValue({ criteria: outputArray });
      if (type === "update") setCriteriaDirty(true);
    },
    [criteriaValues, form, type]
  );

  const handleClearCriteria = () => {
    setCriteriaValues([]);
  };

  return (
    <>
      <BreadCrumbAdvanced routes={routes(id)} />
      <Spin spinning={loading || loadingForm}>
        <div className="mb-5">
          <FormStepper
            steps={steps}
            current={currentStepIndex}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmitForm}
          onFinishFailed={handleError}
          onValuesChange={() => { if (type === "update") setBankInfoDirty(true); }}
        >
          <div className={`${currentStepIndex !== 0 ? "hidden" : ""}`}>
            <AccountForm
              data_select_criteria={data_select_criteria}
              dataEntity={dataEntity}
              typeData={data_type_detail}
              dataCurrency={dataCurrency}
              form={form}
              criteriaValues={criteriaValues}
              setCriteriaValues={setCriteriaValues}
              handleSelectCriteria={handleSelectCriteria}
              handleDeselectCriteria={handleDeselectCriteria}
              handleClearCriteria={handleClearCriteria}
              type={"create"}
              setData={setData}
              data={data}
              setValueOrUnlimited={setValueOrUnlimited}
              valueOrUnlimited={valueOrUnlimited}
              listDataCriteria={listDataCriteria}
              setListDataCriteria={type === "update" ? handleUpdateCriteria : setListDataCriteria}
              formValue={formValue}
              storedData={storedData}
              setStoredData={setStoredData}
              listDataGLAccountInfo={listDataGLAccountInfo}
              setListDataGLAccountInfo={type === "update" ? handleUpdateGL : setListDataGLAccountInfo}
              listDataCategoryInfo={listDataCategoryInfo}
              setListDataCategoryInfo={type === "update" ? handleUpdateCategory : setListDataCategoryInfo}
              parentRequired={parentRequired}
              headerCategory={headerCategory}
              parentOptions={data_parent_options}
            />
          </div>
          <div className={`${currentStepIndex !== 1 ? "hidden" : ""}`}>
            <BaseContainer header={"APPROVAL INFORMATION"}>
              <ApprovalComponentGeneral
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </BaseContainer>
          </div>
          <div className={`${currentStepIndex !== 2 ? "hidden" : ""}`}>
            <BaseContainer header={"ATTACHMENT INFORMATION"}>
              <AttachmentSectionForm
                type={type}
                data={listDataAttachment}
                updateData={type === "update" ? handleUpdateAttachment : setListDataAttachment}
                typeSelector="bank"
                dispatch={dispatch}
                getAPICategory={getListCategory}
                canDeleteExisting={type === "update"}
              />
            </BaseContainer>
          </div>

          <FormFooter
            current={currentStepIndex}
            totalSteps={steps.length}
            onPrev={handlePrev}
            onNext={handleNext}
            onCancel={() => setModalBack(true)}
            onClear={handleClear}
            onSubmit={() => form.submit()}
            type={type}
          />
        </Form>

        <ModalCustom
          isOpen={modalConfirm}
          handleCancel={handleCancelModalConfirm}
          header={"Confirmation"}
          width={1000}
          type={"confirmation"}
          footer={
            <div className="w-full flex justify-end gap-5 p-4">
              <ButtonComponent onClick={handleCancelModalConfirm} type="default">
                Cancel
              </ButtonComponent>
              <ButtonComponent type="submit" onClick={handleProcessModalConfirm}>
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <ConfirmModalBankAccount
            data={formValue}
            listDataCriteria={listDataCriteria}
            criteriaValues={criteriaValues}
            apiCriteria={data_select_criteria}
            listDataAttachment={listDataAttachment}
            dataType={data_type_detail}
            data_entity={dataEntity}
            dataOption={appHierOptions}
            data_currency={dataCurrency}
            selectedHierarchy={selectedHierarchy}
            listDataAppHierDetail={appHierDataDetail}
            listDataGLAccountInfo={listDataGLAccountInfo}
            listDataCategoryInfo={listDataCategoryInfo}
            parentOptions={data_parent_options}
          />
        </ModalCustom>

        <ModalConfirm
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
          width={400}
        >
          <div className="flex justify-center mt-5 gap-[20px]">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className="text-[18px] font-bold">
              Are you sure you want to back?
            </p>
          </div>
        </ModalConfirm>
      </Spin>
    </>
  );
};

export default AccountInformation;
