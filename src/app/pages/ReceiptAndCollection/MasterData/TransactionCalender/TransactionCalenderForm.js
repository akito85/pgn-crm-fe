import {
  FilterOutlined,
  LeftOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { DatePicker, Form, Input, Spin } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import RadioTabs from "../../../../../components/RadioTabs";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import {
  dateFormatting,
  hasValue,
  renderDateConverter,
} from "../../../../../utils";
import ApprovalSectionForm from "../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import AttachmentSectionForm from "../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import ContentModalConfirmPayment from "../../ReceiptReconciliation/ContentModalConfirmPayment";
import SVGIcon from "../../../../../assets/Icon/index";
import BaseContainer from "../../../../../components/BaseContainer";
import {
  createTransactionCalender,
  createValidasiTransCal,
  getAllApprovalList,
  getAllBeginEnd,
  getCriteriaInform,
  getDetailTransaction,
  getListApprovalById,
  getListCategory,
  getListCriteria,
  getTimeUnit,
} from "../../../../../redux/slices/receipt_collection/transactionCalender";
import TransactionCalenderInfromation from "./TransactionCalenderInfromation";
import TableCriteriaInformation from "./TableCriteriaInformation";
import ConfirmModalTransactionCalender from "./Modal/ConfirmModalTransactionCalender";
import { columnsTableCriteria } from "../Bank/Table/TableCriteriaPayment";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import {
  showModalError,
  showModalSuccess,
} from "../../../../../redux/slices/general_slice";
import { bytesConverter } from "../../../../../utils/bytesConverter";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import { configApp } from "../../../../../constants/configApp";
import ModalBack from "../../../../../components/Modal/ModalBack";
import AttachmentSectionComponent from "../../../RatingBillingInvoice/MasterData/BillingItem/Form/tab/AttachmentSectionComponent";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import { constantKeys } from "../../../../../components/Criteria/constantCriteriaKey";

const TransactionCalenderForm = (props) => {
  const { type } = props;
  const {
    dataListAppHierId,
    loading,
    dataListAppHierDetail,
    data_select_criteria,
    data_time_unit,
    data_detail,
    dataEndBegin,
  } = useSelector((state) => state.cycle);

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const location = useLocation();
  const id = location?.state?.id;
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const searchInput = useRef(null);
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [valueOrUnlimited, setValueOrUnlimited] = useState(false);
  const [listDataCriteria, setListDataCriteria] = useState([]);
  const [data, setData] = useState([]);
  const [kirimBody, setKirimBody] = useState();
  const [TransactionId, setTransactionId] = useState();
  const [loadingForm, setLoadingForm] = useState(loading);
  const [storedData, setStoredData] = useState(false);
  const [criteriaOptions, setCriteriaOptions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Define tabData before using it in useState
  const [tabData, setTabData] = useState([
    {
      value: "Transaction Calendar",
      paramValue: [
        "startDate",
        "beginCycle",
        "endCycle",
        "transCriteria",
        "timeUnit",
      ],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);
  const [valuePage, setValuePage] = useState(tabData[0].value);

  //SEARCH

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch(
      selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`,
    );
  };

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleChangePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  useEffect(() => {
    if (id) {
      dispatch(getDetailTransaction(id));
    }
  }, [dispatch, id]);

  //dispatch
  useEffect(() => {
    dispatch(getListCriteria());
    dispatch(getTimeUnit());
    dispatch(getAllApprovalList());
    dispatch(getAllBeginEnd());
  }, [dispatch]);

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
    if (data_select_criteria && data_select_criteria.length > 0) {
      const tempCriterias = data_select_criteria.map((criteria) => ({
        name: criteria.name,
        value: criteria.glbTypeValId,
      }));
      setCriteriaOptions(tempCriterias);
    }
  }, [data_select_criteria]);

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
    if (id && data_detail) {
      // Data Criteria Select
      const criteriaSelect =
        data_detail?.calendarDetailDto?.criteriaDtoList?.map((item) => {
          return {
            id: item?.criteria,
            transactionCalendarId: item?.transactionCalendarId,
          };
        });

      const mappingCriteria = criteriaSelect?.map((a) => a.id);
      const dataCriteriaList = (
        data_detail?.calendarDetailDto?.criteriaDataDtoList || []
      )
        .filter((crit) => crit.allCriteria !== true)
        .map((item, index) => {
          return {
            id: item.id,
            startDate:
              item?.startDate === null
                ? moment()
                : moment(item?.startDate).clone(),
            endDate:
              item?.endDate === undefined || item?.endDate === null
                ? moment()
                : moment(item?.endDate).clone(),
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
          };
        });

      // setListDataAttachment(data_detail?.attachmentDtoList);
      setListDataAttachment(
        (data_detail?.attachmentDtoList || []).map((attachData) => ({
          ...attachData,
          fileSize: bytesConverter(attachData.fileSize || 0),
          dataType: "exist",
        })),
      );

      setSelectedHierarchy(data_detail?.calendarDetailDto?.appHierId);
      const dataTable = form.setFieldsValue({
        // nameCycle: data_detail?.calendarDetailDto?.nameCycle,
        beginCycle: data_detail?.calendarDetailDto?.beginCycle,
        endCycle: data_detail?.calendarDetailDto?.endCycle,
        timeUnit: data_detail?.calendarDetailDto?.timeUnitId,
        startDate:
          data_detail?.calendarDetailDto.startDate === null
            ? moment()
            : moment(data_detail?.calendarDetailDto?.startDate).clone(),
        endDate:
          data_detail?.calendarDetailDto.endDate === null &&
          data_detail?.calendarDetailDto.startDate
            ? ""
            : moment(data_detail?.calendarDetailDto?.endDate).clone(),
        description: data_detail?.calendarDetailDto?.description,
        transCriteria: mappingCriteria,
        apphierId: data_detail?.calendarDetailDto?.appHierId,
        criteria: mappingCriteria,
      });
      setData(dataTable);
      setListDataCriteria(dataCriteriaList);
      setCriteriaValues(mappingCriteria);
    }
  }, [id, data_detail]);

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setSelectedHierarchy("");
      setListDataAttachment([]);
      setAppHierDataDetail([]);
      setListDataCriteria([]);
      setCriteriaValues([]);
    } else {
      dispatch(getDetailTransaction(id));
      setAppHierDataDetail([]);
    }
  };
  const onChange = (e) => {
    if (storedData) {
      const errorBody = {
        title: "Failed",
        description: `Please save data table inline before submit. Please try again.`,
      };
      dispatch(showModalError(errorBody));
    } else {
      setValuePage(e.target.value);
    }
  };

  // Validation Button Back
  const handleBack = () => {
    if (
      form.getFieldValue() === null ||
      Object.keys(form.getFieldValue()).length === 0
    ) {
      navigate(-1);
    } else {
      setModalBack(true);
    }
  };

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_TRANSACTION_CALENDER,
      breadcrumbName: "Transaction Calendar",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.CREATE_TRANSACTION_CALENDER,
      breadcrumbName: `${type === "create" ? "Create" : "Update"}`,
    },
  ];

  const processData = ({
    listDataCriteria,
    bodyData,
    id,
    type,
    dateFormatting,
    data_detail,
    data_detail_draft,
    columnsTableCriteria,
  }) => {
    const mapListDataCriteria = (listDataCriteria, dateFormatting) => {
      return listDataCriteria?.map((item) => ({
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
        gsizes: item.gsizes?.value || null,
        customerSegment: item.customerSegment?.value || null,
        accountGroup: item.accountGroup?.value || null,
        serviceType: item.serviceType?.value || null,
        accountCategory: item.accountCategory?.value || null,
        allCriteria: item.all?.value || null,
      }));
    };

    const mapCriteriaArrayObject = (bodyData, data_detail) => {
      return bodyData?.criteria.map((item) => {
        let dataDefault = [];
        let tempData = [];
        if (type === "update") {
          let tempData = data_detail?.calendarDetailDto?.criteriaDtoList || [];
          dataDefault = tempData.filter((data) => data.value === item);
        } else {
          tempData = data_select_criteria.filter(
            (criteria) => criteria.id === item,
          );
        }
        return {
          id: dataDefault.length > 0 ? dataDefault[0].id : null,
          criteria: item,
          label: tempData[0]?.code || null,
          name: tempData[0]?.text || null,
        };
      });
    };

    const dataCriteriaObject = mapListDataCriteria(
      listDataCriteria,
      dateFormatting,
    );

    const criteriaArrayObject = mapCriteriaArrayObject(bodyData, data_detail);

    const includesAll = formValue.criteria.includes(24);

    const body = {
      id: type === "update" ? data_detail?.calendarDetailDto?.id : null,
      // nameCycke: formValue?.nameCycle,
      beginCycle: formValue?.beginCycle.toString(),
      endCycle: formValue?.endCycle.toString(),
      timeUnitId: formValue?.timeUnit,
      startDate: moment(formValue?.startDate).format("DD MMM YYYY"),
      endDate: formValue?.endDate
        ? moment(formValue?.endDate).format("DD MMM YYYY")
        : null,
      appHierId: formValue?.apphierId,
      criteriaDTOList: criteriaArrayObject,
      criteriaDataDTOList: includesAll
        ? [{ allCriteria: true }]
        : dataCriteriaObject,
      description: formValue?.description,
    };

    setKirimBody(body);
    return body;
  };
  // Check Validity
  const checkDataValidity = async (formValue) => {
    const body = processData({
      listDataCriteria,
      bodyData: formValue,
      id,
      type,
      dateFormatting,
      data_detail,
      columnsTableCriteria,
    });

    try {
      await dispatch(createValidasiTransCal(body))?.unwrap();
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

  const checkOverlappingData = useCallback((formHeader, dataTable) => {
    const dataOverlap = [];
    dataTable?.forEach((item) => {
      if (
        moment(item?.startDate) < moment(formHeader?.startDate) ||
        moment(item?.endDate) > moment(formHeader?.endDate)
      ) {
        dataOverlap?.push(item);
      }
    });
    if (dataOverlap?.length > 0) {
      return true;
    } else {
      return false;
    }
  }, []);

  const handleSubmitForm = async (formValue) => {
    let errorBody = {};
    console.log(formValue, "form Value");

    const hasOverlapping = checkOverlappingData(
      { startDate: formValue?.startDate, endDate: formValue?.endDate },
      listDataCriteria,
    );

    if (listDataCriteria.length === 0 && !formValue.criteria.includes(24)) {
      errorBody = {
        title: "Failed",
        description: "Criteria Mandatory. Please insert data.",
      };
      dispatch(showModalError(errorBody));
    } else if (storedData) {
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
        listDataCriteria,
        () => {},
        0,
      )
    ) {
      const errorBody = {
        title: "Failed",
        description: `There is missing values in table criteria. Please try again`,
      };
      dispatch(showModalError(errorBody));
    } else if (hasOverlapping) {
      const errorBody = {
        title: "Failed",
        description: `You can't add Criteria. Start date and enda date can't be overlap`,
      };
      dispatch(showModalError(errorBody));
    } else {
      const isDataValid = await checkDataValidity(formValue);

      if (isDataValid) {
        // setKirimBody({
        //   ...formValue,
        // });
        setModalConfirm(true);
        setTabData([
          {
            value: "Transaction Calendar",
            paramValue: [
              "startDate",
              "beginCycle",
              "endCycle",
              "criteria",
              "timeUnit",
            ],
          },
          { value: "Approval", paramValue: ["apphierId"] },
          { value: "Attachment" },
        ]);
      } else {
        setModalConfirm(false);
      }
    }
  };
  useEffect(() => {
    if (
      formValue.apphierId &&
      !appHierOptions.map((item) => item.value).includes(formValue.apphierId)
    ) {
      form.setFieldsValue({ apphierId: null });
      setSelectedHierarchy(null);
    }
  }, [formValue, appHierOptions, form]);

  //cancle modall
  const handleCancelModalConfirm = () => {
    setModalConfirm(false);
  };

  const handleProcessModalConfirm = async () => {
    const successMessageCreate = {
      title: "Successfull",
      description: `Your data has been submitted`,
      return: true,
    };

    const successMessageUpdate = {
      title: "Successfull",
      description: `Your data has been submitted`,
      return: true,
    };

    if (type === "create") {
      dispatch(createTransactionCalender(kirimBody))
        .unwrap()
        .then(async (data) => {
          let transactionCalendarId = data.id;
          setLoadingForm(true);
          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = listDataAttachment[icon];
            const body = {
              files: element.file,
              fileCategoryId: element.fileCategoryId,
              referensiId: transactionCalendarId,
              category: "TRANSACTION CALENDAR",
            };
            const response = await receiptCollectionHttpService.uploadImage(
              `/v1/dbs/api/attachment/upload/v1`,
              body,
            );
          }
          setLoadingForm(false);
          handleCancelModalConfirm();
          handleClear();
          dispatch(showModalSuccess(successMessageCreate));
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
      const body = {
        ...kirimBody,
        transactionCalendarId: data_detail?.calendarDetailDto?.id,
      };
      dispatch(createTransactionCalender(body))
        .unwrap()
        .then(async () => {
          setLoadingForm(true);
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist",
          );
          for (let icon = 0; icon < filterDataAttach.length; icon++) {
            const element = filterDataAttach[icon];
            const body = {
              referensiId: data_detail?.calendarDetailDto?.id,
              files: element.file,
              category: "TRANSACTION CALENDAR",
              fileCategoryId: element.fileCategoryId,
            };
            const response = await receiptCollectionHttpService.uploadImage(
              `/v1/dbs/api/attachment/upload/v1`,
              body,
            );
          }
          setLoadingForm(false);
          // setBankId(bankId);
          handleCancelModalConfirm();
          form.resetFields();
          setSelectedHierarchy("");
          setListDataAttachment([]);
          dispatch(showModalSuccess(successMessageUpdate));
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

  //dependensi kriteria
  const handleSelectCriteria = (value) => {
    let res = [...criteriaValues, value];
    if (res.includes(13)) {
      res.push(14);
    }
    if (res.includes(14)) {
      res.push(39);
    }
    if (res.includes(39)) {
      res.push(15);
    }
    if (res.includes(20)) {
      res.push(19);
    }
    let outputArray = res.filter((item, index) => res.indexOf(item) === index);
    outputArray = outputArray.includes(24) ? [24] : outputArray;
    setCriteriaValues(outputArray);
    form.setFieldsValue({
      criteria: outputArray,
    });
  };

  const handleDeselectCriteria = (value) => {
    let res = criteriaValues.filter((item) => item !== value);
    if (!res.includes(15)) {
      res = res.filter((item) => item !== 39);
    }
    if (!res.includes(39)) {
      res = res.filter((item) => item !== 14);
    }
    if (!res.includes(14)) {
      res = res.filter((item) => item !== 13);
    }
    if (!res.includes(19)) {
      res = res.filter((item) => item !== 20);
    }
    let outputArray = res.filter((item, index) => res.indexOf(item) === index);
    outputArray = outputArray.includes(24) ? [24] : outputArray;
    setCriteriaValues(outputArray);
    form.setFieldsValue({
      criteria: outputArray,
    });
  };

  const handleClearCriteria = () => {
    setCriteriaValues([]);
  };

  //handle Error
  const handleError = ({ values, errorFields, outOfDate }) => {
    setTabData((prevState) => {
      const res = prevState.map((item) => {
        if (!item.paramValue || item.paramValue.length < 0) {
          return {
            value: item.value,
            paramValue: item.paramValue,
          };
        }
        const errorBadge = errorFields.reduce(
          (current, next) =>
            item.paramValue.includes(next.name[0]) ? current + 1 : current,
          0,
        );
        return {
          value: item.value,
          paramValue: item.paramValue,
          errorBadge,
        };
      });
      return res;
    });
  };

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Spin spinning={loadingForm}>
        <RadioTabs
          data={tabData}
          onChange={onChange}
          currentPosition={valuePage}
        />
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmitForm}
          // onFinishFailed={handleError}
          onFinishFailed={handleError}
        >
          <div
            className={`${
              valuePage !== "Transaction Calendar" ? "hidden" : ""
            }`}
          >
            <TransactionCalenderInfromation
              //  data_detail={data_detail}
              endBeginDDL={dataEndBegin}
              id={id}
              data_select_criteria={data_select_criteria}
              form={form}
              data_time_unit={data_time_unit}
              criteriaValues={criteriaValues}
              setCriteriaValues={setCriteriaValues}
              type={"create"}
              listDataCriteria={listDataCriteria}
              setListDataCriteria={setListDataCriteria}
              formValue={formValue}
              setStoredData={setStoredData}
              storedData={storedData}
              // handleSelectCriteria={handleSelectCriteria}
              // handleDeselectCriteria={handleDeselectCriteria}
              // handleClearCriteria={handleClearCriteria}
              criteriaOptions={criteriaOptions}
            />
          </div>
          <div className={`${valuePage !== "Approval" ? "hidden" : ""}`}>
            <BaseContainer header={"APPROVAL INFORMATION"}>
              <ApprovalComponentGeneral
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </BaseContainer>
          </div>
          <div className={`${valuePage !== "Attachment" ? "hidden" : ""}`}>
            <BaseContainer header={"ATTACHMENT INFORMATION"}>
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                typeSelector="cycle"
                dispatch={dispatch}
                getAPICategory={getListCategory}
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
                typeRBI={"data"}
              />
            </BaseContainer>
          </div>
          <div className="flex w-full justify-between align-middle my-3">
            <ButtonComponent
              type={"submit"}
              onClick={() => handleBack()}
              icon={
                <LeftOutlined
                  style={{
                    color: "#fff",
                    fontSize: 24,
                    justifyItems: "center",
                  }}
                />
              }
              disabled={storedData === true ? true : false}
            >
              Back
            </ButtonComponent>
            <div className="flex align-middle gap-3">
              <ButtonComponent
                icon={
                  <SVGIcon
                    name={
                      type === "update" ? `IconButtonReset` : `IconButtonClear`
                    }
                    width={24}
                  />
                }
                type="submit"
                onClick={handleClear}
                disabled={storedData === true ? true : false}
              >
                {type === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              <ButtonComponent
                htmlType="submit"
                type="submit"
                // onClick={() => setModalConfirm(true)}
                // disabled={disableSubmit}
                disabled={storedData === true ? true : false}
              >
                Save & Submit
              </ButtonComponent>
            </div>
          </div>
        </Form>

        <ModalCustom
          isOpen={modalConfirm}
          handleCancel={handleCancelModalConfirm}
          header={"Confirmation"}
          width={850}
          type={"confirmation"}
          footer={
            <div className="w-full flex justify-end gap-5 p-4">
              <ButtonComponent
                onClick={handleCancelModalConfirm}
                type="default"
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                type="submit"
                onClick={handleProcessModalConfirm}
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <ConfirmModalTransactionCalender
            data={formValue}
            tabData={tabData}
            dataTimeUnit={data_time_unit}
            // dataTable={filterDataByPage()}
            // handleChange={setDataSource}
            listDataCriteria={listDataCriteria}
            criteriaValues={criteriaValues}
            apiCriteria={data_select_criteria}
            listDataAttachment={listDataAttachment}
            listDataAppHierDetail={appHierDataDetail}
            dataOption={appHierOptions}
            selectedHierarchy={selectedHierarchy}
          />
        </ModalCustom>

        {/* Modal Back */}
        <ModalBack
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
        />
      </Spin>
    </LayoutMenu>
  );
};

export default TransactionCalenderForm;
