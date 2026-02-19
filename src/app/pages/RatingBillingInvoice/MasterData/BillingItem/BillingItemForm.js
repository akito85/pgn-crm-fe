import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Spin } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../../components/BreadCrumb";
import BaseContainer from "../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import {
  ModalConfirm,
  ModalError,
} from "../../../../../components/Modal/ModalPopUp";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import SVGIcon from "../../../../../assets/Icon/index";
import { configApp } from "../../../../../constants/configApp";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import {
  FormStepper,
  FormFooter,
} from "../../../../../components/FormStepNavigation";
import BillingItemSectionForm from "./Form/BillingItemSectionForm";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import {
  getBillingItemCategory,
  getAvailableApproval,
  getSelectedApproval,
  getAttachmentCategory,
  getDetailMappingCategory,
  getBillType,
  createBillingItem,
  updateBillingItem,
  getBillingItemDetail,
  getBillingItemCategoryDdl,
  getConfigFileRBIBillingItem,
  getDetailDraft,
  getBillingItemTypeList,
  getBillingItemCriteriaList,
  getBillingItemCategoryList,
  generateTransactionMappingCode,
  getSpecialGLList,
  getGLAccountList,
  getClassificationTypeList,
  getAccountTypeList,
} from "../../../../../redux/slices/rating_billing_invoice/billingItem";
import MappingInformation from "./Form/tab/MappingInformation";
import DetailMappingInformation from "./Form/tab/DetailMappingInformation";
import { handleMandatory } from "./Utils/Utils";
import {
  showModalError,
  showModalSuccess,
  validateCreateUpdate,
} from "../../../../../redux/slices/general_slice";
import { dateFormatting, hasValue } from "../../../../../utils";
import moment from "moment";
import BillingItemConfirmation from "./Form/BillingItemConfirmation";
import AttachmentSectionComponent from "./Form/tab/AttachmentSectionComponent";

const BillingItemForm = (props) => {
  // Selector
  const {
    data_billingItemCategory,
    data_billType,
    dataListAppHierId,
    dataListAppHierDetail,
    detail_mapping_category,
    data_BillingItemDetail,
    data_billingItemCategoryDdl,
    data_detailDraft,
    data_typeList,
    data_criteriaList,
    data_categoryList,
    data_specialGLList,
    data_glAccountList,
    data_classificationTypeList,
    data_accountTypeList,
    loading,
  } = useSelector((state) => state.billing_item);

  // Declaration
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;

  const { type } = props;
  const [form] = Form.useForm();

  // State untuk Stepper
  const [current, setCurrent] = useState(0);

  const steps = [
    { title: "BILLING ITEM", value: "Billing Item" },
    { title: "APPROVAL", value: "Approval" },
    { title: "ATTACHMENT", value: "Attachment" },
  ];

  const [listSectionInfo, setListSectionInfo] = useState([
    {
      value: "Billing Item",
      paramValue: [
        "billingItemCategory",
        "type",
        "name",
        "billType",
        "criteria",
        "startDate",
        "endDate",
        "description",
      ],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

  const [valuePage, setValuePage] = useState(steps[0].value);

  // State lainnya
  const [openModal, setOpenModal] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [modalValidationTable, setModalValidationTable] = useState(false);

  const [detailMapping, setDetailMapping] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [startDateMap, setStartDateMap] = useState();
  const [endDateMap, setEndDateMap] = useState();
  const [modalRequired, setModalRequired] = useState(false);

  // Approval
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();

  // Billing item checkboxes
  const [checkedLateCharge, setCheckedLateCharge] = useState(false);
  const [checkedPaymentWarranty, setCheckedPaymentWarranty] = useState(false);
  const [checkedInstallmentRestructure, setCheckedInstallmentRestructure] =
    useState(false);

  // Data Map info
  const [dataTable, setdataTable] = useState([]);
  const [dataDetailTable, setdataDetailTable] = useState([]);
  const [allDataDetailTable, setAllDataDetailTable] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

  const [listDataAttachment, setListDataAttachment] = useState([]);

  const [category, setCategory] = useState("");
  const [typeSubmit, setTypeSubmit] = useState(false);

  const [loadingForm, setLoadingForm] = useState(false);
  const [dataSend, setDataSend] = useState({});

  // State untuk criteria
  const [selectedCriteria, setSelectedCriteria] = useState(null);
  const [dataCriteriaTable, setDataCriteriaTable] = useState([]);

  const isLoading = loading || loadingForm;

  // Stepper navigation handlers
  useEffect(() => {
    setValuePage(steps[current].value);
  }, [current]);

  const next = () => {
    const fieldsToValidate = listSectionInfo[current]?.paramValue;
    if (fieldsToValidate) {
      form
        .validateFields(fieldsToValidate)
        .then(() => {
          if (current < steps.length - 1) {
            setCurrent(current + 1);
          }
        })
        .catch((error) => {
          console.log("Validation failed:", error);
        });
    } else {
      if (current < steps.length - 1) {
        setCurrent(current + 1);
      }
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  // Use Effect
  useEffect(() => {
    dispatch(getBillingItemCategory());
    dispatch(getBillingItemCategoryDdl());
    dispatch(getBillType());
    dispatch(getAvailableApproval());
    dispatch(getSelectedApproval());
    dispatch(getBillingItemTypeList());
    dispatch(getBillingItemCriteriaList());
    dispatch(getBillingItemCategoryList());
    dispatch(getSpecialGLList());
    dispatch(getGLAccountList());
    dispatch(getClassificationTypeList());
    dispatch(getAccountTypeList());
  }, [dispatch]);

  useEffect(() => {
    if (type === "update" && id) {
      dispatch(getBillingItemDetail({ id }));
      dispatch(getDetailDraft({ id }));
    }
  }, [dispatch, type, id]);

  const handleDataTypeExist = (
    status,
    statusApproval,
    dataDetail,
    dataCompare,
    table = "mapping",
  ) => {
    switch (status) {
      case "ACTIVE":
        if (statusApproval === "DRAFT" && table === "mapping") {
          return dataCompare?.some(
            (item) => item?.categoryId === dataDetail?.categoryId,
          )
            ? { dataType: "exist" }
            : null;
        } else if (statusApproval === "DRAFT") {
          return dataCompare?.some((item) =>
            item?.detailMappingInfo?.some(
              (detail) => detail?.item === dataDetail?.item,
            ),
          )
            ? { dataType: "exist" }
            : null;
        } else {
          return { dataType: "exist" };
        }
      case "DRAFT":
        return null;
      default:
        return null;
    }
  };

  const handleSetDataUpdate = useCallback(
    (dataDetail, dataCompare = null) => {
      setStartDate(moment(dataDetail?.startDate));
      setSelectedHierarchy(dataDetail?.approvalHierarchy);
      form.setFieldsValue({
        ...dataDetail,
        billingItemCategory: dataDetail?.billingItemCategoryId,
        name: dataDetail?.billingItemName,
        billType: dataDetail?.billingTypeId,
        apphierId: dataDetail?.approvalHierarchy,
        startDate: dataDetail?.startDate ? moment(dataDetail?.startDate) : null,
        endDate: dataDetail?.endDate ? moment(dataDetail?.endDate) : null,
      });
      setCheckedLateCharge(dataDetail?.lateCharge);
      setCheckedPaymentWarranty(dataDetail?.paymentWarranty);
      setCheckedInstallmentRestructure(dataDetail?.installmentRestructure);
      setListDataAttachment(
        dataDetail?.attachmentDtoList
          ? (dataDetail?.attachmentDtoList || [])?.map((item) => {
              return {
                ...item,
                createdDate: moment(item.createdDate).format(
                  dateFormatting.date,
                ),
                dataType: "exist",
              };
            })
          : [],
      );
      setdataTable(
        dataDetail?.mappingInformation?.map((item, index) => {
          return {
            key: `${index + 1}`,
            rCategoryId: item.rCategoryId,
            category: item.categoryId,
            categoryName: item.category,
            startDate: item?.startDate
              ? moment(item?.startDate).format(dateFormatting.date)
              : null,
            endDate: item?.endDate
              ? moment(item?.endDate).format(dateFormatting.date)
              : null,
            description: item?.description,
            ...handleDataTypeExist(
              dataDetail?.status,
              dataDetail?.statusApproval,
              item,
              dataCompare,
            ),
          };
        }) || [],
      );
      (dataDetail?.mappingInformation || [])?.map((item) => {
        setAllDataDetailTable((prev) => {
          return {
            ...prev,
            [item.categoryId]:
              item.detailMappingInfo?.map((detail, indexDetail) => {
                return {
                  key: `${indexDetail + 1}`,
                  rMappingId: detail?.rMappingId,
                  item: detail?.item,
                  itemName: detail?.itemName,
                  startDate: detail?.startDate
                    ? moment(detail?.startDate).format(dateFormatting.date)
                    : null,
                  endDate: detail?.endDate
                    ? moment(detail?.endDate).format(dateFormatting.date)
                    : null,
                  description: detail?.description,
                  ...handleDataTypeExist(
                    dataDetail?.status,
                    dataDetail?.statusApproval,
                    detail,
                    dataCompare,
                    "detailMap",
                  ),
                };
              }) || [],
          };
        });
      });
    },
    [form],
  );

  useEffect(() => {
    if (
      type === "update" &&
      id &&
      data_BillingItemDetail &&
      data_BillingItemDetail.billingItemCode === id
    ) {
      if (
        data_BillingItemDetail?.status === "ACTIVE" &&
        data_BillingItemDetail?.statusApproval === "DRAFT" &&
        data_BillingItemDetail.billingItemCode === id
      ) {
        const body = {
          ...data_detailDraft,
          startDate: data_detailDraft.startDate,
          endDate: data_detailDraft?.endDate,
          approvalHierarchy: data_detailDraft?.approvalHierarchy,
          billingItemCategory: data_detailDraft?.billingItemCategoryId,
          name: data_detailDraft?.billingItemName,
          billType: data_detailDraft?.billingTypeId,
          apphierId: data_detailDraft?.approvalHierarchy,
          attachmentDtoList: data_BillingItemDetail?.attachmentDtoList,
          lateCharge: data_detailDraft?.lateCharge,
          paymentWarranty: data_detailDraft?.paymentWarranty,
          installmentRestructure: checkedInstallmentRestructure
            ? checkedInstallmentRestructure
            : false,
          status: data_BillingItemDetail?.status,
          statusApproval: data_BillingItemDetail?.statusApproval,
        };

        handleSetDataUpdate(body, data_BillingItemDetail?.mappingInformation);
      } else {
        handleSetDataUpdate(data_BillingItemDetail);
      }
    }
  }, [data_BillingItemDetail, type, id, handleSetDataUpdate]);

  // Approval
  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getSelectedApproval({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  // Approval detail (table)
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

  // Approval list ddl
  useEffect(() => {
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);

  const handleStartDate = (e) => {
    form.resetFields(["endDate"]);
    if (e === null || e === undefined) {
      setStartDate(e);
    } else {
      setStartDate(moment(e));
    }
  };

  const handleEndDate = (e) => {
    if (e === null || e === undefined) {
      setEndDate(e);
    } else {
      setEndDate(moment(e));
    }
  };

  const handleChangesPayment = (e) => {
    setCheckedPaymentWarranty(e.target.checked);
  };

  const handleChangesLateCharge = (e) => {
    setCheckedLateCharge(e.target.checked);
  };

  const handleChangesInstallmentRestructure = (e) => {
    setCheckedInstallmentRestructure(e.target.checked);
  };

  // Handler generate transaction mapping code saat category berubah
  const handleCategoryChange = async (categoryId) => {
    form.setFieldsValue({ transactionMappingCode: null });
    if (!categoryId) return;
    const selectedCat = data_categoryList?.find(
      (item) => item.categoryId === categoryId,
    );
    if (!selectedCat) return;
    try {
      const result = await dispatch(
        generateTransactionMappingCode({
          id: categoryId,
          prefix: selectedCat.code,
        }),
      ).unwrap();
      form.setFieldsValue({ transactionMappingCode: result });
    } catch (error) {
      console.error("Failed to generate code:", error);
    }
  };

  // Handler criteria table
  const handleChangesCriteriaTable = (e) => {
    setDataCriteriaTable(e);
  };

  const handleCheckDetailDateConflict = (data) => {
    const index = data_billingItemCategory
      ?.filter((category) => category?.name === data.categoryName)
      .find((data) => data?.id)?.id;
    let result = false;
    if ((allDataDetailTable[index]?.length || 0) > 0) {
      result = allDataDetailTable[index].some((dataDetail) => {
        if (moment(data.startDate) > moment(dataDetail.startDate)) {
          const body = {
            title: "Failed",
            description: `Detail Mapping has conflicted Date. Please try again.`,
            return: false,
          };
          dispatch(showModalError(body));
          return true;
        }
      });
      return result;
    }
    return false;
  };

  const handleChangesMapInformation = (e, newData = {}) => {
    if (!handleCheckDetailDateConflict(newData)) {
      const temp = e.map((item) => {
        return {
          ...item,
          ...(hasValue(item.categoryName)
            ? {
                category:
                  data_billingItemCategory
                    ?.filter((category) => category?.name === item.categoryName)
                    .find((item) => item?.id)?.id || item?.category,
              }
            : {}),
        };
      });

      setdataTable(temp);

      setStartDateMap(
        moment(temp?.find((item) => item.category === category)?.startDate),
      );
      setEndDateMap(
        moment(temp?.find((item) => item.category === category)?.endDate),
      );
    }
  };

  const handleChangesMapDetailInformation = (e) => {
    const temp = e.map((item) => {
      return {
        ...item,
        ...(hasValue(item.itemName)
          ? {
              item:
                detail_mapping_category
                  ?.filter((category) => category?.name === item.itemName)
                  .find((item) => item?.id)?.id || item?.item,
            }
          : {}),
      };
    });
    handleChangesCreateButtonDetail(category, "", temp);
    setdataDetailTable(temp);
  };

  const handleCheckMissingDetailMap = (data, dataDetail) => {
    return (
      dataDetail.some(
        (detail) => !data.hasOwnProperty(detail.category.toString()),
      ) || Object.keys(data).some((key) => data[key].length === 0)
    );
  };

  const handleAllMissingDetailMap = (data, dataDetail) => {
    const missingCategories = [];
    Object.keys(dataDetail).forEach((key) => {
      if (
        !data.hasOwnProperty(dataDetail[key].category) ||
        data[dataDetail[key].category].length === 0
      ) {
        missingCategories.push(dataDetail[key].category);
      }
    });

    const missingMap = missingCategories.map((item) => {
      return {
        item: parseInt(item),
        name: (data_billingItemCategory || []).find(
          (data) => data.id === parseInt(item),
        )?.name,
      };
    });

    return `Missing Detail Map for ${missingMap
      .map((item) => item.name)
      .join(", ")}`;
  };

  const handleMappingInfo = (data) => {
    return dataTable.map((item) => {
      return {
        category: item?.category,
        startDate: item?.startDate || null,
        endDate: item?.endDate || null,
        description: item?.description || null,
        detail: (data[item?.category] || []).map((detail) => {
          return {
            item: detail?.item,
            startDate: detail?.startDate || null,
            endDate: detail?.endDate || null,
          };
        }),
      };
    });
  };

  const onFinishFailed = ({ values, errorFields, outOfDate }) => {
    handleMandatory(setListSectionInfo, listDataAttachment, errorFields);
  };

  const handleChangesCreateButtonDetail = (
    oldCategory,
    newCategory,
    dataDetailTable,
  ) => {
    setAllDataDetailTable((prev) => ({
      ...prev,
      ...(oldCategory !== "" ? { [oldCategory]: dataDetailTable } : {}),
    }));
    setdataDetailTable((prevState) => {
      return newCategory !== ""
        ? allDataDetailTable[newCategory] || []
        : prevState;
    });
  };

  const handleValidateUpdate = (dataTable, bodyData, status, isValidate) => {
    if (status === "create" || isValidate) {
      return true;
    } else {
      const dataConflict = [];
      const temp =
        allDataDetailTable[
          data_billingItemCategory?.find(
            (item) => bodyData?.categoryName === item?.name,
          )?.id
        ] || [];

      temp?.forEach((item) => {
        if (
          moment(item?.startDate) < moment(bodyData?.startDate) ||
          moment(item?.endDate) > moment(bodyData?.endDate)
        ) {
          dataConflict.push(item);
        }
      });
      if (dataConflict?.length > 0) {
        setModalValidationTable(true);
      }
      return dataConflict?.length > 0 ? false : true;
    }
  };

  const handleCreate = (e) => {
    handleChangesCreateButtonDetail(category, e.category, dataDetailTable);
    if (e.category === category) {
      setDetailMapping(false);
      setCategory("");
    } else {
      dispatch(getDetailMappingCategory(e.category));
      setStartDateMap(
        moment(
          dataTable?.find((item) => item.category === e.category)?.startDate,
        ),
      );
      setEndDateMap(
        moment(
          dataTable?.find((item) => item.category === e.category)?.endDate,
        ),
      );
      setCategory(e.category);
      setDetailMapping(true);
    }
  };

  const filteringAllDataDetailTable = useCallback(() => {
    Object.keys(allDataDetailTable).forEach((key) => {
      if (!dataTable.map((data) => data.category).includes(parseInt(key))) {
        delete allDataDetailTable[key];
      }
    });
  }, [allDataDetailTable, dataTable]);

  useEffect(() => {
    filteringAllDataDetailTable();
    if (category !== "") {
      setDetailMapping(
        (dataTable || [])?.find((item) => item.category === category),
      );
    }
  }, [dataTable, category, filteringAllDataDetailTable]);

  const checkDataValidity = async (data) => {
    const url =
      type === "create"
        ? "/v1/dbs/api/billingitem/validate-create"
        : "/v1/dbs/api/billingitem/validate-update";

    try {
      await dispatch(
        validateCreateUpdate({
          body: data,
          services: ratingBillingHttpService,
          endPoint: url,
          type: type,
        }),
      )?.unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  // Helper: resolve nilai select (EditableCell menyimpan label)
  const resolveSelectLabel = (value, list, labelKey = "name") => {
    if (!value) return null;
    const found = list?.find(
      (item) => item[labelKey] === value || item.id === value,
    );
    return found ? found[labelKey] : value;
  };

  const onFinish = async (e) => {
    if (listDataAttachment.length === 0) {
      handleMandatory(setListSectionInfo, listDataAttachment);
    } else {
      handleMandatory(setListSectionInfo, listDataAttachment);
      if (dataTable.length === 0) {
        const errorBody = {
          title: "Failed",
          description: `Mapping Information is Mandatory. Please insert data.`,
        };
        dispatch(showModalError(errorBody));
      } else if (handleCheckMissingDetailMap(allDataDetailTable, dataTable)) {
        const errorBody = {
          title: "Failed",
          description: `${handleAllMissingDetailMap(
            allDataDetailTable,
            dataTable,
          )}. Please insert data.`,
        };
        dispatch(showModalError(errorBody));
      } else {
        // Resolve criteriaCode dari selectedCriteria (ID -> code)
        const criteriaCodeResolved =
          data_criteriaList?.find(
            (c) =>
              c.id === selectedCriteria || c.id === Number(selectedCriteria),
          )?.code || null;

        // Build criteria array dari dataCriteriaTable
        const criteriaPayload = dataCriteriaTable.map((item) => {
          // Resolve criteriaValue dan paramCriteriaId sekaligus
          const fromClassification = data_classificationTypeList?.find(
            (c) => c.name === item.criteriaValue || c.id === item.criteriaValue,
          );
          const fromAccount = data_accountTypeList?.find(
            (c) => c.name === item.criteriaValue || c.id === item.criteriaValue,
          );
          const criteriaSource = fromClassification || fromAccount;

          const criteriaValueResolved =
            criteriaSource?.code || item.criteriaValue || null;
          const paramCriteriaIdResolved = criteriaSource?.id || null; // ← Id dari response

          // Resolve glAccount — kirim string account number
          const glAccountResolved = (() => {
            if (!item.glAccountId) return null;
            const found = data_glAccountList?.find(
              (g) =>
                `${g.account} - ${g.name}` === item.glAccountId ||
                g.id === item.glAccountId,
            );
            return found ? found.name : item.glAccountId; // ← pakai found.name
          })();

          // Resolve specialGl — ambil glValue
          const specialGlResolved = (() => {
            if (!item.specialGlId) return null;
            const found = data_specialGLList?.find(
              (s) => s.name === item.specialGlId || s.id === item.specialGlId,
            );
            return found ? found.value : item.specialGlId;
          })();

          return {
            criteriaCode: criteriaCodeResolved,
            criteriaValue: criteriaValueResolved,
            paramCriteriaId: paramCriteriaIdResolved, // ← Id dari classification/account type
            startDate: item.startDate || null,
            endDate: item.endDate || null,
            glAccount: glAccountResolved,
            descriptionAccount: item.descriptionAccount || null,
            specialGl: specialGlResolved,
          };
        });

        // Ambil semua nilai form termasuk field yang tidak ter-render (pakai true)
        const allValues = form.getFieldsValue(true);

        const body = {
          // Field utama — sesuai dengan expected payload backend
          transactionType:
            data_typeList?.find((t) => t.id === allValues.type)?.code ||
            allValues.type,
          billingItemCategory: allValues.billingItemCategory,
          billingItemCode: allValues.transactionMappingCode,
          name: allValues.name,
          billType: allValues.billType,
          startDate: moment(allValues.startDate).format(dateFormatting.date),
          endDate: allValues.endDate
            ? moment(allValues.endDate).format(dateFormatting.date)
            : null,
          description: allValues.description,

          // Checkboxes
          lateCharge: checkedLateCharge || false,
          installment: checkedInstallmentRestructure || false,
          paymentWarranty: checkedPaymentWarranty || false,

          // Mapping info
          mappingInfo: handleMappingInfo(allDataDetailTable),

          // Criteria
          criteria: criteriaPayload,

          // Approval
          appHierId: allValues.apphierId,

          // Action
          action: typeSubmit ? "SUBMIT" : "DRAFT",
        };

        const isDataValid = await checkDataValidity(body);

        if (isDataValid) {
          setDataSend(body);
          setOpenModal(true);
        } else {
          setOpenModal(false);
        }
      }
    }
  };

  const handleDescriptionSuccess = useCallback(
    (data, type) => {
      let text = "";
      switch (type) {
        case "create":
          text = `Your data has been ${
            data.action === "DRAFT" ? "created" : "submitted"
          }.`;
          break;
        case "update":
          text = `Your data has been ${
            data.action === "DRAFT" ? "updated" : "submitted"
          }.`;
          break;
        default:
          break;
      }
      const successMessage = {
        title: "Successful",
        description: text,
      };
      dispatch(showModalSuccess(successMessage));
    },
    [dispatch],
  );

  const handleSave = (e) => {
    dispatch(type === "create" ? createBillingItem(e) : updateBillingItem(e))
      .unwrap()
      .then(async (data) => {
        const recordId =
          type === "create" ? data?.id : data_BillingItemDetail?.id;
        setLoadingForm(true);
        const filterDataAttach = listDataAttachment.filter(
          (item) => item.dataType !== "exist",
        );
        for (let icon = 0; icon < filterDataAttach.length; icon++) {
          const element = filterDataAttach[icon];
          const body = {
            files: element.file,
            referensiId: recordId,
            fileCategoryId: element.fileCategoryId,
          };
          await ratingBillingHttpService.uploadAttachment(
            `/v1/dbs/api/billingitem/attachment-upload`,
            body,
          );
        }
        setLoadingForm(false);
        handleClear("clear");
        handleDescriptionSuccess(e, type);
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error?.response &&
              error?.response?.data &&
              error?.response?.data?.message) ||
            error?.message ||
            error?.toString();
          setBodyError({ message, value: e });
          setModalError(true);
        }
      });
  };

  const handleRetry = () => {
    handleSave(bodyError?.value);
    setModalError(false);
  };

  const handleClear = (state = "") => {
    if (type === "create" || state === "clear") {
      form.resetFields();
      setAllDataDetailTable({});
      setdataTable([]);
      setdataDetailTable([]);
      setAppHierDataDetail([]);
      setAppHierOptions([]);
      setSelectedHierarchy();
      setListDataAttachment([]);
      setIsEditable(false);
      setCheckedLateCharge(false);
      setCheckedPaymentWarranty(false);
      setCheckedInstallmentRestructure(false);
      setTypeSubmit(false);
      setStartDate(null);
      setStartDateMap(null);
      setEndDate(null);
      setEndDateMap(null);
      setSelectedCriteria(null);
      setDataCriteriaTable([]);
    } else {
      setDetailMapping(false);
      setCategory("");
      if (
        data_BillingItemDetail?.status === "ACTIVE" &&
        data_BillingItemDetail?.statusApproval === "DRAFT" &&
        data_BillingItemDetail.billingItemCode === id
      ) {
        const body = {
          ...data_detailDraft,
          startDate: data_detailDraft.startDate,
          endDate: data_detailDraft?.endDate,
          approvalHierarchy: data_detailDraft?.approvalHierarchy,
          billingItemCategory: data_detailDraft?.billingItemCategoryId,
          name: data_detailDraft?.billingItemName,
          billType: data_detailDraft?.billingTypeId,
          apphierId: data_detailDraft?.approvalHierarchy,
          attachmentDtoList: data_BillingItemDetail?.attachmentDtoList,
          lateCharge: data_detailDraft?.lateCharge,
          paymentWarranty: data_detailDraft?.paymentWarranty,
          status: data_BillingItemDetail?.status,
          statusApproval: data_BillingItemDetail?.statusApproval,
        };

        handleSetDataUpdate(body, data_BillingItemDetail?.mappingInformation);
      } else {
        handleSetDataUpdate(data_BillingItemDetail);
      }
    }
    setOpenModal(false);
  };

  const handleBack = () => {
    setModalBack(true);
  };

  const handleSubmit = () => {
    setTypeSubmit(true);
    setTimeout(() => {
      form.submit();
    }, 0);
  };

  const handleSaveDraft = () => {
    setTypeSubmit(false);
    setTimeout(() => {
      form.submit();
    }, 0);
  };

  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: RBI_ROUTES.BILLING_ITEM_VIEW,
      breadcrumbName: "Billing Item",
    },
    {
      path: "",
      breadcrumbName: `${
        type === "update" ? "Update Billing Item" : "Create Billing Item"
      }`,
    },
  ];

  return (
    <LayoutMenu>
      <Spin spinning={isLoading}>
        <BreadCrumb routes={routes} />

        <FormStepper
          steps={steps}
          current={current}
          onPrev={prev}
          onNext={next}
        />

        <Form
          id={"form"}
          layout={"vertical"}
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          scrollToFirstError={true}
          onValuesChange={(changedValues) => {
            if (changedValues.criteria !== undefined) {
              setSelectedCriteria(changedValues.criteria);
              setDataCriteriaTable([]);
            }
          }}
        >
          {/* Step 1: Billing Item — pakai display:none agar field tetap ter-mount & nilai form tidak hilang */}
          <div
            style={{
              display:
                valuePage !== listSectionInfo[0].value ? "none" : undefined,
            }}
          >
            <BillingItemSectionForm
              type={type}
              dispatch={dispatch}
              statusDetail={data_BillingItemDetail?.status === "ACTIVE"}
              data_billType={data_billType}
              data_billingItemCategory={data_categoryList}
              data_glAccount={[]}
              data_typeOptions={data_typeList}
              data_criteriaOptions={data_criteriaList}
              checkedLateCharge={checkedLateCharge}
              checkedPaymentWarranty={checkedPaymentWarranty}
              checkedInstallmentRestructure={checkedInstallmentRestructure}
              onChangeLateCharge={handleChangesLateCharge}
              onChangePayment={handleChangesPayment}
              onChangeInstallmentRestructure={
                handleChangesInstallmentRestructure
              }
              startDate={startDate}
              endDate={endDate}
              handleStartDate={handleStartDate}
              mappingData={dataTable?.length || 0}
              handleEndDate={handleEndDate}
              onCategoryChange={handleCategoryChange}
            />
            <MappingInformation
              key="mappingInformation"
              dataCategoryMapList={data_billingItemCategory}
              dataTable={dataTable}
              handleCreate={handleCreate}
              handleDataMapChanges={handleChangesMapInformation}
              isEditabled={isEditable}
              setIsEditabled={setIsEditable}
              type={type}
              startDate={startDate}
              endDate={endDate}
              setModalRequired={setModalRequired}
              handleValidateUpdate={handleValidateUpdate}
              criteriaType={selectedCriteria}
              dataCriteriaTable={dataCriteriaTable}
              handleChangesCriteriaTable={handleChangesCriteriaTable}
              data_specialGLList={data_specialGLList}
              data_glAccountList={data_glAccountList}
              data_classificationTypeList={data_classificationTypeList}
              data_accountTypeList={data_accountTypeList}
              data_criteriaOptions={data_criteriaList}
            />
            {detailMapping &&
            dataTable?.length > 0 &&
            (dataTable || []).find((item) => item.category === category) ? (
              <DetailMappingInformation
                key="mappingDetailInformation"
                dataMapDetailItemList={detail_mapping_category}
                subHeader={`${
                  (data_billingItemCategory || []).find(
                    (item) => item.id === category,
                  )?.name
                }`}
                dataTable={dataDetailTable || []}
                handleDataMapChanges={handleChangesMapDetailInformation}
                setIsEditabled={setIsEditable}
                isEditabled={isEditable}
                type={type}
                startDateMappping={startDateMap}
                endDateMapping={endDateMap}
                handleValidateUpdate={handleValidateUpdate}
              />
            ) : null}
          </div>

          {/* Step 2: Approval */}
          <div
            style={{
              display:
                valuePage !== listSectionInfo[1].value ? "none" : undefined,
            }}
          >
            <BaseContainer header={"Approval Information"}>
              <ApprovalComponentGeneral
                type={type}
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </BaseContainer>
          </div>

          {/* Step 3: Attachment */}
          <div
            style={{
              display:
                valuePage !== listSectionInfo[2].value ? "none" : undefined,
            }}
          >
            <BaseContainer header={"Attachment Information"}>
              <AttachmentSectionComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                dispatch={dispatch}
                getAPICategory={getAttachmentCategory}
                typeSelector="billing_item"
                service={ratingBillingHttpService}
                configApplication={configApp.RATING_BILLING_SERVICE}
                getAPIGuard={getConfigFileRBIBillingItem}
                typeRBI={"standalone"}
                mandatory={true}
              />
            </BaseContainer>
          </div>

          <FormFooter
            current={current}
            totalSteps={steps.length}
            onPrev={prev}
            onNext={next}
            onCancel={handleBack}
            onClear={handleClear}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
            type={type}
            disabled={isEditable}
          />
        </Form>

        {/* Modal Confirmation */}
        {openModal && (
          <ModalCustom
            isOpen={openModal}
            handleCancel={() => setOpenModal(false)}
            header={"CONFIRMATION"}
            width={1200}
            type={"confirmation"}
            footer={
              <div className="w-full flex justify-end gap-5">
                <ButtonComponent
                  type={"default"}
                  onClick={() => {
                    setOpenModal(false);
                  }}
                >
                  Cancel
                </ButtonComponent>
                <ButtonComponent
                  type={"submit"}
                  onClick={() => {
                    handleSave(dataSend);
                  }}
                  disabled={isLoading}
                >
                  Confirm
                </ButtonComponent>
              </div>
            }
          >
            <BillingItemConfirmation
              dataTable={dataTable}
              allData={allDataDetailTable}
              dataAttachment={listDataAttachment}
              dataConfirm={dataSend}
              dataApproval={selectedHierarchy}
              dataApprovalTable={appHierDataDetail}
              listApproval={appHierOptions}
            />
          </ModalCustom>
        )}

        {/* Modal Error */}
        {modalError && (
          <ModalError
            isOpen={modalError}
            handleOk={handleRetry}
            handleCancel={() => {
              setModalError(false);
            }}
            customText={"Try Again"}
          >
            <div className="px-5 pt-5 pb-[10px] justify-center">
              <div className="w-full flex gap-[20px]">
                <SVGIcon name="IconFailed" width={48} />
                <p className="text-[18px] font-bold">{"Failed"}</p>
              </div>
              <p className="pl-[70px]">{`Your data was not ${
                type === "create" ? "Created." : "Updated."
              } ${bodyError?.message}`}</p>
              <p className="pl-[70px]">Please try again.</p>
            </div>
          </ModalError>
        )}

        {/* Modal Back */}
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

        {/* Modal Start Date Required */}
        <ModalError
          isOpen={modalRequired}
          handleOk={() => setModalRequired(false)}
          handleCancel={() => setModalRequired(false)}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`You can't create Mapping Information. Please fill out the start date first`}</p>
          </div>
        </ModalError>

        {/* Modal Validation Table */}
        {modalValidationTable && (
          <ModalError
            isOpen={modalValidationTable}
            handleOk={() => setModalValidationTable(false)}
            handleCancel={() => setModalValidationTable(false)}
          >
            <div className="px-5 pt-5 pb-[10px] justify-center">
              <div className="w-full flex gap-[20px]">
                <SVGIcon name="IconFailed" width={48} />
                <p className="text-[18px] font-bold">{"Failed"}</p>
              </div>
              <p className="pl-[70px]">{`You can't update Mapping Information. Start date and end date can't be overlap`}</p>
            </div>
          </ModalError>
        )}
      </Spin>
    </LayoutMenu>
  );
};

export default BillingItemForm;
