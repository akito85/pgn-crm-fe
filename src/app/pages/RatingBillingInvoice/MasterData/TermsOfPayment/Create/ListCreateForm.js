import { LeftOutlined } from "@ant-design/icons";
import { Form, Spin } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import BaseContainer from "../../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import RadioTabs from "../../../../../../components/RadioTabs";
import {
  FormStepper,
  FormFooter,
} from "../../../../../../components/FormStepNavigation";
import { configApp } from "../../../../../../constants/configApp";
import ratingBillingHttpService from "../../../../../../redux/services/ratingBillingHttpService";
import { getConfigFileRBIGeneralTemplate } from "../../../../../../redux/slices/attachmentSlice";
import {
  showModalError,
  validateCreateUpdate,
} from "../../../../../../redux/slices/general_slice";
import {
  createTOP,
  getAllApprovalList,
  getDetailDraftTOP,
  getDetailTOP,
  getListApprovalById,
  getListCategory,
  getListCriteriaTOP,
  getTopDDL,
  updateTOP,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/termsofPayment";
import { RBI_ROUTES } from "../../../../../../routes/rating_billing/rbi_routes";
import { dateFormatting, hasValue } from "../../../../../../utils";
import SVGIcon from "../../../../../../assets/Icon/index";
import { columnsTableCriteriaTOP } from "../TableCriteria/TableCriteriaTOP";
import CreateTOP from "./CreateTOP";
import ModalConfirmationTOPS from "./ModalConfirmationTOPS";
import ModalBack from "../../../../../../components/Modal/ModalBack";
import CardContainer from "../../../../../../components/CardContainer";

const ListCreateForm = ({ type }) => {
  const {
    data_type,
    dataListAppHierId,
    dataListAppHierDetail,
    loading,
    data_select_criteria,
    data_detail,
    data_detail_draft,
  } = useSelector((state) => state.top);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const location = useLocation();
  const { id } = location?.state || {};
  const status = location?.state?.status;
  const statusApproval = location?.state?.statusApproval;

  const listTypeSubmit = ["submit", "draft"];
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalBack, setModalBack] = useState(false);

  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [criteriaOptions, setCriteriaOptions] = useState([]);

  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [list, setList] = useState([]);
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [storedData, setStoredData] = useState(false);
  const [kirimBody, setKirimBody] = useState();
  const [loadingForm, setLoadingForm] = useState(loading);
  const [isC, setIsC] = useState(false);
  const [isSat, setIsSat] = useState(false);
  const [isSun, setIsSun] = useState(false);
  const [flag, setFlag] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  useEffect(() => {
    dispatch(getTopDDL());
    dispatch(getAllApprovalList());
    dispatch(getListCriteriaTOP());
  }, [dispatch]);

  //uodate
  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailTOP(id));
      dispatch(getDetailDraftTOP(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (id && type === "update" && data_detail_draft?.information?.id === id) {
      setIsC(data_detail_draft?.information?.isCalendar);
      setIsSun(data_detail_draft?.information?.isSunday);
      setIsSat(data_detail_draft?.information?.isSaturday);
    } else if (
      id &&
      type === "update" &&
      !data_detail_draft?.information?.id &&
      data_detail?.information?.id === id
    ) {
      setIsC(data_detail?.information?.isCalendar);
      setIsSun(data_detail?.information?.isSunday);
      setIsSat(data_detail?.information?.isSaturday);
    }
  }, [id, type, data_detail, data_detail_draft]);

  //handle Tab
  const STEPS = [
    { title: "TERMS OF PAYMENT", value: "Terms of Payment" },
    { title: "APPROVAL", value: "Approval" },
    { title: "ATTACHMENT", value: "Attachment" },
  ];
  const [tabData, setTabData] = useState([
    {
      value: "Terms of Payment",
      paramValue: ["name", "type", "startDate", "terms", "criteria"],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);
  const [current, setCurrent] = useState(0);
  const [valuePage, setValuePage] = useState(STEPS[0].value);

  const next = () => {
    const fieldsToValidate = tabData[current]?.paramValue;
    if (fieldsToValidate) {
      form
        .validateFields(fieldsToValidate)
        .then(() => {
          if (current === 0) {
            const formData = form.getFieldsValue();
            if (list.length === 0 && !formData?.criteria?.includes(24)) {
              dispatch(
                showModalError({
                  title: "Failed",
                  description: "Criteria Mandatory. Please insert data.",
                }),
              );
              return;
            }
          }
          if (current < STEPS.length - 1) {
            setCurrent(current + 1);
            setValuePage(STEPS[current + 1].value);
            window.scrollTo(0, 0);
          }
        })
        .catch((error) => {
          handleMandatory(setTabData, listDataAttachment, error.errorFields);
        });
    } else if (current < STEPS.length - 1) {
      setCurrent(current + 1);
      setValuePage(STEPS[current + 1].value);
      window.scrollTo(0, 0);
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setValuePage(STEPS[current - 1].value);
      window.scrollTo(0, 0);
    }
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
      path: RBI_ROUTES.TERMS_OF_PAYMENT_VIEW,
      breadcrumbName: "Terms of Payment",
    },
    {
      path: RBI_ROUTES.TERMS_OF_PAYMENT_CREATE,
      breadcrumbName: `${type === "create" ? "Create" : "Update"}`,
    },
  ];

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

  useEffect(() => {
    if (
      formValue.apphierId &&
      !appHierOptions.map((item) => item.value).includes(formValue.apphierId)
    ) {
      form.setFieldsValue({ apphierId: null });
      setSelectedHierarchy(null);
    }
  }, [formValue, appHierOptions, form]);

  //handle Error Vlaidasi
  const handleMandatory = (
    setListSectionInfo = () => {},
    listDataAttachment,
    errorFields,
  ) => {
    setListSectionInfo((prevState) => {
      const res = prevState.map((item) => {
        const errorBadge =
          item.value !== "Attachment"
            ? (errorFields || []).reduce(
                (current, next) =>
                  item.paramValue.includes(next.name[0])
                    ? current + 1
                    : current,
                0,
              )
            : listDataAttachment.length < 1
              ? 1
              : 0;
        return {
          value: item.value,
          paramValue: item.paramValue,
          errorBadge,
        };
      });
      return res;
    });
  };

  // Handle Error Tab Form
  const handleError = ({ values, errorFields, outOfDate }) => {
    handleMandatory(setTabData, listDataAttachment, errorFields);
  };

  // untuk upadate

  const asserData = useCallback(
    (data_detail) => {
      const criteria = (data_detail?.criteria || []).map((item) => {
        return {
          criteria: item?.criteria,
          termsOfPaymentId: item?.id,
        };
      });
      const mappingCriteria = criteria?.map((a) => a.criteria);
      setCriteriaValues(mappingCriteria);
      setSelectedHierarchy(data_detail?.information?.apphierId);
      const dataAttachment = (data_detail?.mattachmentLists || []).map(
        (item) => {
          return {
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
            createdBy: item.createdBy,
            createdDate: item.createdDate
              ? moment(item.createdDate).format("DD MMM YYYY")
              : "",
            dataType: "exist",
          };
        },
      );
      setListDataAttachment(dataAttachment);
      form.setFieldsValue({
        name: data_detail?.information?.name,
        startDate: moment(data_detail?.information?.startDate),
        endDate: data_detail?.information?.endDate
          ? moment(data_detail?.information?.endDate)
          : undefined,
        type: data_detail?.information?.typeId,
        terms: data_detail?.information?.term,
        isCalendar: isC,
        isSunday: isSun,
        isSaturday: isSat,
        apphierId: data_detail?.information?.apphierId,
        criteria: mappingCriteria,
        description: data_detail?.information?.description,
        isSubmit: flag,
      });
      setStartDate(moment(data_detail?.information?.startDate));
      setList(
        (data_detail?.criteriaData || [])
          .filter((data) => data?.allCriteria !== true)
          .map((item, index) => {
            let obj = { typeData: "exist", key: index + 1 };
            for (const attr in item) {
              if (typeof item[attr] === "object" && item[attr] !== null) {
                obj[attr] = {
                  label: item[attr]?.label || item[attr]?.name,
                  value: item[attr]?.value,
                };
              } else {
                obj[attr] = item[attr];
              }
            }
            return obj;
          }),
      );
    },
    [form],
  );

  const asserDataDraft = useCallback(
    (data_detail_draft, data_detail) => {
      const criteria = (data_detail?.criteria || []).map((item) => {
        return {
          criteria: item?.criteria,
          termsOfPaymentId: item?.id,
        };
      });
      const mappingCriteria = criteria?.map((a) => a.criteria);
      setCriteriaValues(mappingCriteria);
      setSelectedHierarchy(data_detail_draft?.information?.apphierId);
      const dataDraftAttachment = (data_detail?.mattachmentLists || []).map(
        (item) => {
          return {
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
            createdBy: item.createdBy,
            createdDate: item.createdDate
              ? moment(item.createdDate).format("DD MMM YYYY")
              : "",
            dataType: "exist",
          };
        },
      );
      setListDataAttachment(dataDraftAttachment);
      form.setFieldsValue({
        name: data_detail_draft?.information?.name,
        startDate: moment(data_detail_draft?.information?.startDate),
        endDate: data_detail_draft?.information?.endDate
          ? moment(data_detail_draft?.information?.endDate)
          : undefined,
        type: data_detail_draft?.information?.typeId,
        terms: data_detail_draft?.information?.term,
        isCalendar: isC,
        isSunday: isSun,
        isSaturday: isSat,
        apphierId: data_detail_draft?.information?.apphierId,
        criteria: mappingCriteria,
        description: data_detail_draft?.information?.description,
        isSubmit: flag,
      });
      setStartDate(moment(data_detail_draft?.information?.startDate));
      setList(
        (data_detail_draft?.criteriaData || [])
          .filter((data) => data?.allCriteria !== true)
          .map((item, index) => {
            let obj = { typeData: "exist", key: index + 1 };
            for (const attr in item) {
              if (typeof item[attr] === "object" && item[attr] !== null) {
                obj[attr] = {
                  label: item[attr]?.label || item[attr]?.name,
                  value: item[attr]?.value,
                };
              } else {
                obj[attr] = item[attr];
              }
            }
            return obj;
          }),
      );
    },
    [form],
  );

  useEffect(() => {
    if (
      id &&
      type === "update" &&
      data_detail_draft?.information?.id === id &&
      data_detail?.information?.id === id
    ) {
      asserDataDraft(data_detail_draft, data_detail);
    } else if (
      id &&
      type === "update" &&
      !data_detail_draft?.information?.id &&
      data_detail?.information?.id === id
    ) {
      asserData(data_detail);
    }
  }, [id, type, data_detail, data_detail_draft, asserData, asserDataDraft]);

  useEffect(() => {
    if (data_select_criteria && data_select_criteria.length > 0) {
      const tempCriterias = data_select_criteria.map((criteria) => ({
        name: criteria.text,
        value: criteria.id,
      }));
      setCriteriaOptions(tempCriterias);
    }
  }, [data_select_criteria]);
  //cancle modall
  const handleCancelModalConfirm = () => {
    setModalConfirm(false);
  };

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setSelectedHierarchy("");
      setListDataAttachment([]);
      setAppHierDataDetail([]);
      setIsC(false);
      setIsSat(false);
      setIsSun(false);
      setList([]);
      setCriteriaValues([]);
      // setAppHierOptions([]);
      setKirimBody({});
      setCurrent(0);
      setValuePage(STEPS[0].value);
      setTabData([
        {
          value: "Terms of Payment",
          paramValue: ["name", "type", "startDate", "terms", "criteria"],
        },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
      ]);
    } else {
      dispatch(getDetailTOP(id));
      dispatch(getDetailDraftTOP(id));
    }
  };

  // Validate Data before Modal
  const checkDataValidity = async (data) => {
    const url =
      type === "create"
        ? "/v1/dbs/api/rbi/top/validate-create"
        : "/v1/dbs/api/rbi/top/validate-update";

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

  const lowerCaseCheckedCriteria = (name) => {
    let nameChecked = `${name
      ?.toString()
      ?.toLowerCase()
      ?.replace(/[-\s]/g, "")}`;
    switch (nameChecked) {
      case "subdistrict":
        return "subDistrict";
      case "budgettype":
        return "budget";
      case "industrialsector":
        return "industrialSector";
      case "servicetype":
        return "serviceType";
      case "costcenter":
        return "area";
      case "customersegment":
        return "customerSegment";
      case "accountcategory":
        return "accountCategory";
      case "accountgrouptype":
        return "accountGroup";
      case "account":
        return "customer";
      default:
        return nameChecked;
    }
  };

  const hasValueCriteria = (value) => {
    if (
      value === "" ||
      value === undefined ||
      value === null ||
      value === "-" ||
      value === "Invalid date"
    ) {
      return false;
    } else if (typeof value === "object") {
      return (
        value.hasOwnProperty("value") &&
        value.value !== null &&
        value.value !== undefined &&
        value.hasOwnProperty("label") &&
        value.label !== null &&
        value.label !== undefined
      );
    } else {
      return true;
    }
  };

  const validateCriteriaFields = (
    criteriaValues,
    dataCriteria,
    listDataCriteria = [],
    setMissingColumn = () => {},
    minimumData = 0,
  ) => {
    console.log(listDataCriteria);
    console.log(criteriaValues);

    let missingColumn = [];
    const tempArray = criteriaValues.filter((item) =>
      dataCriteria?.includes(item.value),
    );
    const tempNameCriteria = tempArray.map((data) => data.name);
    listDataCriteria?.map((item) => {
      tempNameCriteria?.forEach((criteriaName) => {
        if (
          !item[lowerCaseCheckedCriteria(criteriaName)] || //no column
          !hasValueCriteria(item[lowerCaseCheckedCriteria(criteriaName)]) //no value at object
        ) {
          missingColumn.push(criteriaName);
        }
      });
    });
    const uniqueMissingColumn =
      missingColumn
        .filter((item, index) => {
          return missingColumn.indexOf(item) === index;
        })
        ?.filter((item) => item !== "All") || [];
    setMissingColumn(uniqueMissingColumn);
    return uniqueMissingColumn?.length > 0 ||
      !((listDataCriteria?.length || 0) >= minimumData)
      ? true
      : false;
  };
  // check has overlapping data
  const checkOverlappingData = useCallback((formHeader, dataTable) => {
    const headerStart = formHeader?.startDate
      ? moment(formHeader.startDate).startOf("day")
      : null;
    const headerEnd = formHeader?.endDate
      ? moment(formHeader.endDate).startOf("day")
      : null;

    const dataOverlap = dataTable?.filter((item) => {
      const itemStart = item?.startDate
        ? moment(item.startDate).startOf("day")
        : null;
      const itemEnd = item?.endDate
        ? moment(item.endDate).startOf("day")
        : null;

      if (headerStart && itemStart && itemStart.isBefore(headerStart))
        return true;
      if (headerEnd && itemEnd && itemEnd.isAfter(headerEnd)) return true;
      return false;
    });

    return (dataOverlap?.length || 0) > 0;
  }, []);

  //handle submit setelah muncul modal
  const handleSubmitForm = async (formValue) => {
    let errorBody = {};
    if (listDataAttachment.length === 0) {
      handleMandatory(setTabData, listDataAttachment);
    } else {
      const isOverlapping = checkOverlappingData(
        { startDate: formValue?.startDate, endDate: formValue?.endDate },
        list,
      );
      // It seems like handleMandatory is called regardless of the condition
      handleMandatory(setTabData, listDataAttachment);
      if (list.length === 0 && !formValue.criteria.includes(24)) {
        setCurrent(0);
        errorBody = {
          title: "Failed",
          description: "Criteria Mandatory. Please insert data.",
        };
        dispatch(showModalError(errorBody));
      } else if (storedData) {
        setCurrent(0);
        errorBody = {
          title: "Failed",
          description:
            "Please save data table inline before submit. Please try again.",
        };
        dispatch(showModalError(errorBody));
      } else if (
        validateCriteriaFields(
          criteriaOptions,
          formValue?.criteria,
          list,
          () => {},
          0,
        )
      ) {
        setCurrent(0);
        const errorBody = {
          title: "Failed",
          description: `There is missing values in table criteria. Please try again`,
        };
        dispatch(showModalError(errorBody));
      } else if (isOverlapping) {
        setCurrent(0);
        const errorBody = {
          title: "Failed",
          description: `You can't add Criteria. Start date and end date can't be overlap`,
        };
        dispatch(showModalError(errorBody));
      } else {
        // Assuming dispatch and setModalConfirm are defined somewhere

        let Object = list.map((item) => {
          return {
            id: item?.id || null,
            referenceId: item?.referenceId || null,
            startDate: item.startDate
              ? moment(item.startDate).format(dateFormatting.date)
              : null,
            endDate: item.endDate
              ? moment(item.endDate).format(dateFormatting.date)
              : null,
            customer: item.customer?.value || null,
            budget: item.budget?.value || null,
            subDistrict: item.subDistrict?.value || null,
            district: item.district?.value || null,
            city: item.city?.value || null,
            province: item.province?.value || null,
            area: item.area?.value || null,
            sor: item.sor?.value || null,
            industrialSector: item.industrialSector?.value || null,
            product: item.product?.value || null,
            gsizes: item.gsizes?.value || null,
            customerSegment: item.customerSegment?.value || null,
            accountGroup: item.accountGroup?.value || null,
            serviceType: item.serviceType?.value || null,
            accountCategory: item.accountCategory?.value || null,
            product: item.product?.value || null,
            allCriteria: item.all?.value || null,
          };
        });

        // Extracting criteriaArrayObject
        let criteriaArrayObject = formValue.criteria.map((item) => {
          const tempData =
            id && data_detail_draft?.id === id
              ? data_detail_draft?.criteria || []
              : data_detail?.criteria || [];
          const temp = tempData?.filter((a) => item === a.criteria);
          return {
            termOfPaymentCriteriaId: temp[0]?.id || null,
            criteria: item,
          };
        });

        // Filtering criteria
        const filteredCriteria = columnsTableCriteriaTOP().filter(
          (item) =>
            !formValue.criteria?.includes(item.indexValue) &&
            formValue.criteria.includes(item.indexValue) === 1,
        );

        //Modifying Object based on filtered criteria
        Object = Object.map((item) => {
          let obj = { ...item };
          filteredCriteria.forEach((criteria) => {
            obj[criteria.dataIndexForm] = null;
          });
          return obj;
        });

        const includesAll = formValue.criteria.includes(24);
        const dataValue = {
          id: type === "update" ? data_detail?.information?.id : undefined,
          name: formValue?.name,
          startDate: formValue?.startDate,
          endDate: formValue?.endDate,
          type: formValue?.type,
          term: formValue?.terms,
          isCalendar: isC,
          isSunday: isSun,
          isSaturday: isSat,
          apphierId: formValue?.apphierId,
          criterias: criteriaArrayObject,
          criteriaData: includesAll ? [{ allCriteria: true }] : Object,
          description: formValue?.description,
          isSubmit: flag,
        };

        let temp = { ...dataValue };
        if ((temp.criteriaData || [])?.includes(24)) {
          temp = {
            ...temp,
            criteriaData: [{ allCriteria: true }],
          };
        }

        const isDataValid = await checkDataValidity(temp);

        if (isDataValid) {
          setModalConfirm(true);
          setKirimBody(temp);
          setTabData([
            {
              value: "Terms of Payment",
              paramValue: ["name", "type", "startDate", "terms", "criteria"],
            },
            { value: "Approval", paramValue: ["apphierId"] },
            { value: "Attachment" },
          ]);
        } else {
          setModalConfirm(false);
        }
      }
    }
  };

  const handleProcessModalConfirm = () => {
    // let temp = { ...kirimBody };
    // console.log(temp, "temp");
    // if ((temp.criteriaData || [])?.includes(24)) {
    //   temp = {
    //     ...temp,
    //     criteriaData: [{ allCriteria: true }],
    //   };
    // }

    if (type === "create") {
      dispatch(createTOP(kirimBody))
        .unwrap()
        .then(async (data) => {
          let id = data?.termsOfPaymentId;
          setLoadingForm(true);
          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = listDataAttachment[icon];
            const body = {
              files: element.file,
              referenceId: id,
              fileCategoryId: element.fileCategoryId,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/rbi/top/create-attachment`,
              body,
            );
          }
          setLoadingForm(false);
          handleCancelModalConfirm();
          handleClear();
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            dispatch(showModalError(message));
          }
        });
    } else {
      // const body = {
      //   ...temp,
      // };
      dispatch(updateTOP(kirimBody))
        .unwrap()
        .then(async () => {
          setLoadingForm(true);
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist",
          );
          for (let icon = 0; icon < filterDataAttach.length; icon++) {
            const element = filterDataAttach[icon];
            const body = {
              files: element.file,
              referenceId: id,
              fileCategoryId: element.fileCategoryId,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/rbi/top/create-attachment`,
              body,
            );
          }
          setLoadingForm(false);
          handleCancelModalConfirm();
          handleClear();
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            dispatch(showModalError(message));
          }
        });
    }
  };

  // Function Get Data StartDate
  const handleStartDate = (value) => {
    form.resetFields(["endDate"]);
    setStartDate(value);
    return value;
  };

  // Function Get Data EndDate
  const handleEndDate = (value) => {
    setEndDate(value);
    return value;
  };

  const isDisabledDate = useMemo(() => {
    if (
      hasValue(form?.getFieldsValue()?.endDate) === true &&
      list?.map((item) => ({
        startDate: item?.startDate,
        endDate: item?.endDate,
      }))?.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }, [form, list]);

  return (
    <>
      <BreadCrumb routes={routes} />
      <Spin spinning={false}>
        <FormStepper
          steps={STEPS}
          current={current}
          onPrev={prev}
          onNext={next}
        />
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmitForm}
          onFinishFailed={handleError}
        >
          <div
            style={{
              display: valuePage !== tabData[0].value ? "none" : undefined,
            }}
          >
            <CreateTOP
              form={form}
              dataType={data_type}
              listDataCriteria={list}
              setListDataCriteria={setList}
              criteriaValues={criteriaValues}
              setCriteriaValues={setCriteriaValues}
              setStoredData={setStoredData}
              storedData={storedData}
              formValue={formValue}
              type={type}
              isSat={isSat}
              isSun={isSun}
              isC={isC}
              setIsC={setIsC}
              setIsSat={setIsSat}
              setIsSun={setIsSun}
              data_select_criteria={data_select_criteria}
              status={status}
              statusApproval={statusApproval}
              startDate={startDate}
              endDate={endDate}
              handleStartDate={handleStartDate}
              handleEndDate={handleEndDate}
              disbaledDate={isDisabledDate}
            />
          </div>

          <div
            style={{
              display: valuePage !== tabData[1].value ? "none" : undefined,
            }}
          >
            <CardContainer header={"APPROVAL INFORMATION"}>
              <ApprovalComponentGeneral
                type={type}
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </CardContainer>
          </div>

          <div
            style={{
              display: valuePage !== tabData[2].value ? "none" : undefined,
            }}
          >
            <CardContainer header={"ATTACHMENT INFORMATION"}>
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                dispatch={dispatch}
                getAPICategory={getListCategory}
                typeSelector="top"
                service={ratingBillingHttpService}
                configApplication={configApp.RATING_BILLING_SERVICE}
                getAPIGuard={getConfigFileRBIGeneralTemplate}
                typeRBI={"data"}
                mandatory={true}
              />
            </CardContainer>
          </div>

          <FormFooter
            current={current}
            totalSteps={STEPS.length}
            onPrev={prev}
            onNext={next}
            onCancel={() => setModalBack(true)}
            onClear={handleClear}
            onSaveDraft={() => {
              setFlag(false);
              setTimeout(() => form.submit(), 0);
            }}
            onSubmit={() => {
              setFlag(true);
              setTimeout(() => form.submit(), 0);
            }}
            type={type}
            disabled={storedData}
            saveDraftLabel={"Save as Draft"}
          />
        </Form>
      </Spin>

      {/* modalBack*/}
      <ModalBack
        isOpen={modalBack}
        handleCancel={() => setModalBack(false)}
        handleOk={() => navigate(-1)}
      />

      {/* Modal Confirmation */}
      <ModalCustom
        isOpen={modalConfirm}
        handleCancel={handleCancelModalConfirm}
        header={"Confirmation"}
        width={1000}
        type={"confirmation"}
        footer={
          <div className="w-full flex justify-end gap-2 p-4">
            <ButtonComponent onClick={handleCancelModalConfirm} type="default">
              Cancel
            </ButtonComponent>
            <ButtonComponent type="submit" onClick={handleProcessModalConfirm}>
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <ModalConfirmationTOPS
          data={kirimBody}
          tabData={tabData}
          listDataCriteria={list}
          criteriaValues={criteriaValues}
          apiCriteria={data_select_criteria}
          listDataAttachment={listDataAttachment}
          listDataAppHierDetail={appHierDataDetail}
          dataOption={appHierOptions}
          selectedHierarchy={selectedHierarchy}
          datatype={data_type}
        />
      </ModalCustom>
    </>
  );
};

export default ListCreateForm;
