import React, { useCallback, useEffect, useRef, useState } from "react";
import LayoutMenu from "../../../../../../components/SidebarMenu/LayoutMenu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Modal, Spin, Steps } from "antd";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import BreadCrumbAdvanced from "../../../../../../components/BreadCrumbAdvanced";
import {
  createLateChargeRuleBody,
  getDataTypeConditionList,
  getDetailDraftLateChargeRule,
  getDetailLateCharge,
  getDetailLateChargeRule,
  getListAppHier,
  getListAppHierDetail,
  getListCategory,
  getOperationFormulaList,
  getOperatorConditionList,
  getVariableNameList,
  updateLateChargeRuleBody,
  checkStartDate,
} from "../../../../../../redux/slices/account_management/MasterData/late_charges";
import DetailText from "../../../../../../components/DetailText";
import BaseContainer from "../../../../../../components/BaseContainer";
import {
  showModalError,
  showModalSuccess,
} from "../../../../../../redux/slices/general_slice";
import {
  LeftCircleOutlined,
  LeftOutlined,
  RightCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { dateFormatting, requiredMessage } from "../../../../../../utils";
import DateComponent from "../../../../../../components/DateComponent";
import ApprovalSectionForm from "../../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import AttachmentSectionForm from "../../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import accountManagementService from "../../../../../../redux/services/account_management/accountManagementService";
import InputComponent from "../../../../../../components/InputComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import ModalBack from "../../../../../../components/Modal/ModalBack";
import { IconModal } from "../../../../../../utils/Icon";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import TableLateChargeRuleCondition from "./TableLateChargeRuleCondition";
import TableLateChargeRuleFormula from "./TableLateChargeRuleFormula";
import moment from "moment";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import { bytesConverter } from "../../../../../../utils/bytesConverter";
import { getFormula } from "./util";
import ContentModalConfirmLateChargeRule from "./ContentModalConfirmLateChargeRule";

const routes = (type, id) => {
  return [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_LATE_CHARGES,
      breadcrumbName: "Late Charge",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.DETAIL_LATE_CHARGES,
      breadcrumbName: "Detail Late Charge",
      state: {
        id: id,
      },
    },
    {
      path: "",
      breadcrumbName: `${
        type === "update"
          ? "Update Late Charge Rule"
          : "Create Late Charge Rule"
      }`,
    },
  ];
};

const listTypeSubmit = ["submit", "draft"];
const FormLateChargesRule = ({ type }) => {
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id, lateChargeId, from } = location?.state || {};
  const {
    data_detail = {},
    loading = false,
    dataListAppHierId = [],
    dataListAppHierDetail = [],
    data_detail_late_charge_rule = {},
    data_detail_draft_late_charge_rule = {},
  } = useSelector((state) => state.late_charge);
  const [current, setCurrent] = useState(0);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [listDataDetailFormula, setListDataDetailFormula] = useState([]);
  const [listDataDetailCondition, setListDataDetailCondition] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [storedDataInline, setStoredDataInline] = useState(false);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [typeSubmit, setTypeSubmit] = useState(listTypeSubmit[0]);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [modalBack, setModalBack] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [dataLateChargeRule, setDataLateChargeRule] = useState({});
  const [dataLateCharge, setDataLateCharge] = useState({});
  const [modalSuccessCreate, setModalSuccessCreate] = useState(false);
  const isLoading = loading || loadingForm;
  const containerRef = useRef(null);

  useEffect(() => {
    dispatch(getListAppHier());
    dispatch(getVariableNameList());
    dispatch(getOperatorConditionList());
    dispatch(getDataTypeConditionList());
    dispatch(getOperationFormulaList());
  }, [dispatch]);

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailLateChargeRule(id));
      dispatch(getDetailDraftLateChargeRule(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (lateChargeId) {
      dispatch(getDetailLateCharge(lateChargeId));
    }
  }, [dispatch, lateChargeId]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getListAppHierDetail({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  useEffect(() => {
    if (data_detail?.lateChargeId === lateChargeId) {
      const obj = {
        lateChargeName: data_detail.lateChargeName,
        currency: data_detail.currency.name,
        description: data_detail.description,
        criteria: (data_detail.criteria || []).map((item) => item.value),
        criteriaName: (data_detail.criteria || []).reduce(
          (prev, current, index) =>
            prev + `${index === 0 ? current.label : ", " + current.label} `,
          "",
        ),
        createdDate: data_detail.historyLogInformation.createdDate,
        createdBy: data_detail.historyLogInformation.createdBy,
        updatedDate: data_detail.historyLogInformation.updatedDate,
        updatedBy: data_detail.historyLogInformation.updatedBy,
      };
      setDataLateCharge(obj);
    }
  }, [lateChargeId, data_detail]);

  useEffect(() => {
    if (
      type === "update" &&
      data_detail_late_charge_rule?.lateChargeRuleId === id
    ) {
      const obj = {
        status: data_detail_late_charge_rule.status,
        documentNumber: data_detail_late_charge_rule.documentNumber,
        approvalStatus: data_detail_late_charge_rule.approvalStatus,
        description: data_detail_late_charge_rule.description,
        startDate: data_detail_late_charge_rule.startDate
          ? moment(data_detail_late_charge_rule.startDate, dateFormatting.date)
          : "",
        maxAmount: data_detail_late_charge_rule.maxAmount,
        approvalHierarchy: data_detail_late_charge_rule.apphierId,
      };
      form.setFieldsValue(obj);
      setDataLateChargeRule(obj);
      setSelectedHierarchy(obj.approvalHierarchy);
      setListDataDetailCondition(
        (data_detail_late_charge_rule?.listRuleCondition || []).map(
          (item, index) => ({
            key: index + 1 + "",
            lateChargeRuleConditionId: item.id,
            lateChargeRuleId: item.lateChargeRuleId,
            name: {
              value: item?.name?.id || 0,
              label: item?.name?.name || "",
            },
            operator: {
              value: item?.operator?.id || 0,
              label: item?.operator?.name || "",
            },
            dataType: {
              value: item?.dataType?.id || 0,
              label: item?.dataType?.name || "",
            },
            value: item.valueReal,
            typeData: "exist",
          }),
        ),
      );
      setListDataDetailFormula(
        (data_detail_late_charge_rule?.listRuleFormula || []).map(
          (item, index) => ({
            key: index + 1 + "",
            lateChargeRuleFormulaId: item.id,
            lateChargeRuleId: item.lateChargeRuleId,
            operation: {
              value: item?.operation?.id || 0,
              label: item?.operation?.name || "",
            },
            type: {
              value: item?.type || "",
              label: item?.type || "",
            },
            variableName: {
              value: item?.variableName?.id || 0,
              label: item?.variableName?.name || "",
            },
            dataType: {
              value: item?.dataType?.id || 0,
              label: item?.dataType?.name || "",
            },
            value: item.valueReal,
            typeData: "exist",
          }),
        ),
      );
      setListDataAttachment(
        (data_detail_late_charge_rule?.attachments || []).map((attachData) => ({
          ...attachData,
          createdDate: attachData.createdDate
            ? moment(attachData.createdDate).format(dateFormatting.dateTime)
            : "",
          fileSize: bytesConverter(attachData.fileSize || 0),
          dataType: "exist",
        })),
      );
    }
  }, [type, id, form, data_detail_late_charge_rule]);

  useEffect(() => {
    if (
      id &&
      type === "update" &&
      data_detail_draft_late_charge_rule?.lateChargeRuleId === id &&
      data_detail_late_charge_rule &&
      data_detail_draft_late_charge_rule?.lateChargeRuleId ===
        data_detail_late_charge_rule?.lateChargeRuleId
    ) {
      const obj = {
        description: data_detail_draft_late_charge_rule.description,
        approvalHierarchy: data_detail_draft_late_charge_rule.apphierId,
      };
      form.setFieldsValue(obj);
      setDataLateChargeRule((prevState) => ({
        ...prevState,
        ...obj,
      }));
      setSelectedHierarchy(obj.approvalHierarchy);
      setListDataAttachment(
        (data_detail_late_charge_rule?.attachments || []).map((attachData) => ({
          ...attachData,
          createdDate: attachData.createdDate
            ? moment(attachData.createdDate).format(dateFormatting.dateTime)
            : "",
          fileSize: bytesConverter(attachData.fileSize || 0),
          dataType: "exist",
        })),
      );
    }
  }, [
    type,
    id,
    form,
    data_detail_late_charge_rule,
    data_detail_draft_late_charge_rule,
  ]);

  useEffect(() => {
    if (dataListAppHierId?.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);

  useEffect(() => {
    if (dataListAppHierDetail?.length > 0) {
      const data = dataListAppHierDetail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: (a.employeeDetail || []).map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setAppHierDataDetail(data);
    } else {
      setAppHierDataDetail([]);
    }
  }, [dataListAppHierDetail]);

  const handleCancelModalConfirm = () => {
    setModalConfirm(false);
  };

  const handleSubmitForm = (value) => {
    let tempAttachment = [...listDataAttachment];
    // if (
    //   type === "update" &&
    //   data_detail_late_charge_rule?.status === "ACTIVE" &&
    //   data_detail_late_charge_rule?.approvalStatus === "APPROVED"
    // ) {
    //   tempAttachment = tempAttachment.filter(
    //     (item) => item.dataType !== "exist"
    //   );
    // }
    if (tempAttachment.length == 0) {
      const errorBody = {
        title: "Failed",
        description: `Your data was not created. Please insert attachment.`,
        return: false,
      };
      dispatch(showModalError(errorBody));
    } else {
      setModalConfirm(true);
    }
  };

  const handleProcessModalConfirm = async () => {
    const tempListRuleFormula = listDataDetailFormula.map((item) => {
      let obj = {
        ...item,
        lateChargeRuleConditionId: item.lateChargeRuleConditionId || null,
        operation: item?.operation?.value || null,
        type: item?.type?.value || null,
        variableName: item?.variableName?.value || null,
      };
      delete obj.typeData;
      delete obj.lateChargeRuleId;
      return obj;
    });
    const tempListRuleCondition = listDataDetailCondition.map((item) => {
      let obj = {
        ...item,
        lateChargeRuleFormulaId: item.lateChargeRuleFormulaId || null,
        operator: item?.operator?.value || null,
        dataType: item?.dataType?.value || null,
        name: item?.name?.value || null,
        value:
          typeof item.value === "string" ? parseFloat(item.value) : item.value,
      };
      delete obj.typeData;
      delete obj.lateChargeRuleId;
      return obj;
    });
    const body = {
      lateChargeId: lateChargeId,
      lateChargeRuleId: type === "update" ? id : null,
      documentNumber: dataLateChargeRule.documentNumber,
      startDate: dataLateChargeRule.startDate
        ? dataLateChargeRule.startDate.format(dateFormatting.dateForm)
        : "",
      maxAmount: dataLateChargeRule.maxAmount
        ? parseFloat(dataLateChargeRule.maxAmount)
        : null,
      description: dataLateChargeRule.description,
      appHierId: selectedHierarchy,
      isSubmit: typeSubmit === listTypeSubmit[0],
      listRuleFormula: tempListRuleFormula,
      listRuleCondition: tempListRuleCondition,
    };
    if (type === "create") {
      dispatch(createLateChargeRuleBody(body))
        .unwrap()
        .then(async (data) => {
          const idLateChargeRule = data.id;
          setLoadingForm(true);
          for (let icon in listDataAttachment) {
            const element = listDataAttachment[icon];
            const body = {
              files: element.file,
              category: element.fileCategoryId,
            };
            const response = await accountManagementService.uploadAttachment(
              `/v1/dbs/api/master/late-charge/create-attachment/${idLateChargeRule}`,
              body,
            );
          }
          setModalSuccessCreate(true);
          setLoadingForm(false);
          handleCancelModalConfirm();
          handleClear();
        })
        .catch((error) => {
          if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
            const message =
              error?.response?.data?.message ||
              error?.message ||
              error.toString();
            setBodyError({ message });
            setModalError(true);
          }
        });
    } else {
      dispatch(updateLateChargeRuleBody(body))
        .unwrap()
        .then(async (data) => {
          const idLateChargeRule = data.id;
          setLoadingForm(true);
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist",
          );
          for (let icon in filterDataAttach) {
            const element = filterDataAttach[icon];
            const body = {
              files: element.file,
              category: element.fileCategoryId,
            };
            const response = await accountManagementService.uploadAttachment(
              `/v1/dbs/api/master/late-charge/create-attachment/${idLateChargeRule}`,
              body,
            );
          }
          const successBody = {
            title: `Successful`,
            description: `Your data has been ${typeSubmit === "draft" ? "updated" : "submitted"}`,
          };
          // setModalSuccessCreate(true);
          dispatch(showModalSuccess(successBody));
          setLoadingForm(false);
          handleCancelModalConfirm();
          form.resetFields();
          setSelectedHierarchy("");
          setListDataDetailCondition([]);
          setListDataDetailFormula([]);
          setListDataAttachment([]);
        })
        .catch((error) => {
          if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
            const message =
              error?.response?.data?.message ||
              error?.message ||
              error.toString();
            setBodyError({ message });
            setModalError(true);
          }
        });
    }
  };

  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };
  const scrollLeftHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 250;
    }
  };
  const handleButtonPrev = () => {
    prev();
    scrollLeftHandler();
  };

  const checkAllKeysHaveValue = useCallback((obj) => {
    let emptyKeys = [];
    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined || value === "") {
        emptyKeys.push(key);
      }
    }
    return emptyKeys;
  }, []);

  const errorMessage = useCallback(
    (key) => {
      const titleKey = (key) => {
        if (key === "startDate") {
          return "Start Date";
        } else if (key === "documentNumber") {
          return "Document Number";
        } else if (key === "implicationType") {
          return "Implication Type";
        } else {
          return "Transaction Code";
        }
      };
      for (const item of key) {
        form.setFields([
          {
            name: item,
            errors: [`Please input your ${titleKey(item)}!`],
          },
        ]);
      }
    },
    [form],
  );

  const handleButtonNext = () => {
    const { maxAmount, description, ...requiredField } = formValue;
    const checkEmptyValues = checkAllKeysHaveValue(requiredField);

    let errorBody = {};
    switch (current) {
      case 0:
        if (checkEmptyValues?.length > 0) {
          errorMessage(checkEmptyValues);
        } else if (listDataDetailFormula.length < 2) {
          errorBody = {
            title: "Failed",
            description: `Please fill late charge rule formula containing at least 2 data`,
          };
          dispatch(showModalError(errorBody));
        } else if (storedDataInline) {
          errorBody = {
            title: "Failed",
            description: `Please save data table inline before submit. Please try again.`,
          };
          dispatch(showModalError(errorBody));
        } else {
          const body = {
            lateChargeId: lateChargeId,
            startDate: moment(dataLateChargeRule.startDate).format(
              dateFormatting.dateFormal,
            ),
          };
          dispatch(checkStartDate(body))
            .unwrap()
            .then((res) => {
              if (res.success) {
                next();
                scrollRightHandler();
              } else {
                errorBody = {
                  title: "Failed",
                  description: res.message,
                };
                dispatch(showModalError(errorBody));
              }
            })
            .catch((error) => {
              if (error) {
                errorBody = {
                  title: "Failed",
                  description: error?.data?.message,
                };
                dispatch(showModalError(errorBody));
              }
            });
        }
        break;
      case 1:
        if (!selectedHierarchy) {
          // errorBody = {
          //   title: "Failed",
          //   description: `Approval Hierarchy Mandatory. Please try again.`,
          // };
          // dispatch(showModalError(errorBody));
          form.validateFields();
        } else {
          next();
          scrollRightHandler();
        }
        break;
      default:
        break;
    }
  };

  const handleLateChargeRuleInfoObj = (e, type) => {
    let result;
    switch (type) {
      case "description":
        result = e.target.value;
        break;
      default:
        result = e;
        break;
    }
    setDataLateChargeRule((prevState) => ({
      ...prevState,
      [type]: result,
    }));
    return result;
  };
  const handleOpenDate = (current) => {
    return false;
  };
  const steps = () => {
    let data = [
      {
        title: "Late Charge Rule Information",
        content: (
          <div className="flex flex-col gap-4">
            <BaseContainer header={"late charge rule"}>
              <div className="grid grid-cols-3 gap-2">
                <Form.Item
                  name={"documentNumber"}
                  className={"w-full no-margin-form"}
                  rules={[
                    {
                      message: requiredMessage("Document Number"),
                      required: true,
                    },
                    {
                      pattern: /^[a-zA-Z0-9\-/\.\_" "]+$/,
                      message:
                        "Invalid input. Only numbers, letters, (space), (_), (-), (/), and (.)",
                    },
                  ]}
                  getValueFromEvent={(e) =>
                    handleLateChargeRuleInfoObj(
                      e.target.value,
                      "documentNumber",
                    )
                  }
                  label={"Document Number"}
                >
                  <InputComponent
                    maxLength={50}
                    disabled={
                      type === "update" &&
                      dataLateChargeRule.status === "ACTIVE"
                    }
                  />
                </Form.Item>
                <Form.Item
                  name={"startDate"}
                  rules={[
                    { message: requiredMessage("Start Date"), required: true },
                  ]}
                  className="no-margin-form"
                  getValueFromEvent={(e) =>
                    handleLateChargeRuleInfoObj(e, "startDate")
                  }
                  label={"Start Date"}
                  required
                >
                  <DateComponent
                    dateDisable={handleOpenDate}
                    disabled={
                      type === "update" &&
                      dataLateChargeRule.status === "ACTIVE"
                    }
                  />
                </Form.Item>
                <Form.Item
                  name={"maxAmount"}
                  className={"w-full no-margin-form"}
                  getValueFromEvent={(e) =>
                    handleLateChargeRuleInfoObj(e.floatValue, "maxAmount")
                  }
                  label={"Late Charge Maximum Amount"}
                >
                  <InputComponent
                    decimalScale={2}
                    thousandSeparator={","}
                    decimalSeparator={"."}
                    type="numeric"
                    disabled={
                      type === "update" &&
                      dataLateChargeRule.status === "ACTIVE"
                    }
                  />
                </Form.Item>
                <div className="col-span-3">
                  <Form.Item
                    name={"description"}
                    className="w-full"
                    getValueFromEvent={(e) =>
                      handleLateChargeRuleInfoObj(e, "description")
                    }
                    label={"Description"}
                  >
                    <InputComponent
                      type="textarea"
                      value={dataLateChargeRule.description}
                    />
                  </Form.Item>
                </div>
              </div>
            </BaseContainer>
            <div className="drop-shadow-lg bg-white rounded-lg w-full mt-[30px] p-[20px]">
              <div className="flex flex-col gap-2 p-4">
                <div className="text-primary text-xs font-bold uppercase">
                  {"late charge rule detail"}
                </div>
                <TableLateChargeRuleFormula
                  dataTable={listDataDetailFormula}
                  updateTable={setListDataDetailFormula}
                  dataLateChargeRule={dataLateChargeRule}
                  storedData={storedDataInline}
                  setStoredData={setStoredDataInline}
                  type={type}
                />
              </div>
              <div className="flex flex-col gap-2 p-4">
                <div className="text-primary text-xs font-bold uppercase">
                  {"late charge rule formula"}
                </div>
                <div className="font-bold uppercase underline">
                  {getFormula(listDataDetailFormula)}
                </div>
              </div>
            </div>
            <BaseContainer header={"late charge condition"}>
              <TableLateChargeRuleCondition
                dataTable={listDataDetailCondition}
                updateTable={setListDataDetailCondition}
                dataLateChargeRule={dataLateChargeRule}
                storedData={storedDataInline}
                setStoredData={setStoredDataInline}
                type={type}
              />
            </BaseContainer>
          </div>
        ),
        disabled:
          !dataLateChargeRule.startDate ||
          listDataDetailFormula.length < 2 ||
          storedDataInline,
      },
      {
        title: "Approval Information",
        content: (
          <BaseContainer header={"approval information"}>
            <ApprovalSectionForm
              dataTable={appHierDataDetail}
              dataOption={appHierOptions}
              selectedHierarchy={selectedHierarchy}
              updateSelectedHierarchy={setSelectedHierarchy}
            />
          </BaseContainer>
        ),
        disabled: !selectedHierarchy,
      },
      {
        title: "Attachment Information",
        content: (
          <BaseContainer header={"attachment information"}>
            <AttachmentSectionForm
              type={type}
              data={listDataAttachment}
              updateData={setListDataAttachment}
              dispatch={dispatch}
              getAPICategory={getListCategory}
              service={accountManagementService}
              typeSelector={"late_charge"}
              mandatory={true}
            />
          </BaseContainer>
        ),
        disabled:
          (type === "create" && listDataAttachment.length === 0) ||
          (type === "update" &&
            dataLateChargeRule.status === "ACTIVE" &&
            listDataAttachment.filter((item) => item.dataType !== "exist")
              .length === 0),
      },
    ];
    return data;
  };

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setAppHierDataDetail([]);
      setDataLateChargeRule({});
      setListDataAttachment([]);
      setListDataDetailCondition([]);
      setListDataDetailFormula([]);
      setSelectedHierarchy(undefined);
    } else {
      form.resetFields();
      dispatch(getDetailLateChargeRule(id));
      dispatch(getDetailDraftLateChargeRule(id));
    }
    setStoredDataInline(false);
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };
  const handleRetry = () => {
    handleProcessModalConfirm();
    setModalError(false);
    setBodyError({});
  };

  return (
    <LayoutMenu>
      <Spin spinning={isLoading}>
        <BreadCrumbAdvanced routes={routes(type, lateChargeId)} />
        <div className="flex flex-col gap-4">
          <BaseContainer header={"late charge information"}>
            <div className="grid grid-cols-3 gap-2">
              <DetailText label={"Late Charge Name"}>
                {dataLateCharge.lateChargeName}
              </DetailText>
              <DetailText label={"Currency"}>
                {dataLateCharge.currency}
              </DetailText>
              <DetailText label={"Criteria"}>
                {dataLateCharge.criteriaName}
              </DetailText>
              <div className="col-span-3">
                <DetailText label={"Description"}>
                  {dataLateCharge.description}
                </DetailText>
              </div>
            </div>
          </BaseContainer>
          <Form
            id="lateChargeRuleForm"
            form={form}
            layout={"vertical"}
            onFinish={handleSubmitForm}
            // onFinishFailed={handleErrorSubmit}
            scrollToFirstError={true}
          >
            <div className="flex flex-col w-full gap-4 mt-8">
              <div className="grid grid-cols-10 gap-4 w-full">
                <span className="mt-[10px]">
                  <LeftCircleOutlined
                    style={{ fontSize: "24px", color: "#0075bf" }}
                    onClick={scrollLeftHandler}
                  />
                </span>
                <div
                  ref={containerRef}
                  className="overflow-x-scroll scrollStepsCstm col-span-8"
                >
                  <Steps
                    current={current}
                    items={steps()}
                    labelPlacement="vertical"
                  />
                </div>
                <span className="mt-[10px] flex justify-end">
                  <RightCircleOutlined
                    style={{ fontSize: "24px", color: "#0075bf" }}
                    onClick={scrollRightHandler}
                  />
                </span>
              </div>
              {steps()[current].content}
              <div className="flex w-full justify-between align-middle gap-4 mb-4">
                <ButtonComponent
                  type={"submit"}
                  onClick={() => setModalBack(true)}
                  icon={
                    <LeftOutlined
                      style={{
                        color: "#fff",
                        fontSize: 24,
                        justifyItems: "center",
                      }}
                    />
                  }
                >
                  Back
                </ButtonComponent>
                <div className="flex align-middle gap-3">
                  <ButtonComponent
                    icon={
                      <SVGIcon
                        name={
                          type === "update"
                            ? `IconButtonReset`
                            : `IconButtonClear`
                        }
                        width={24}
                      />
                    }
                    type="submit"
                    onClick={handleClear}
                  >
                    {type === "update" ? "Reset" : "Clear"}
                  </ButtonComponent>
                  {current > 0 && (
                    <ButtonComponent
                      onClick={handleButtonPrev}
                      type={"submit"}
                      disabled={storedDataInline}
                    >
                      <LeftOutlined
                        style={{
                          justifyItems: "center",
                          fontSize: 18,
                          color: "#fff",
                        }}
                      />
                      Previous
                    </ButtonComponent>
                  )}
                  {current < steps().length - 1 && (
                    <ButtonComponent
                      onClick={handleButtonNext}
                      // disabled={steps()[current].disabled}
                      type={"submit"}
                    >
                      Next
                      <RightOutlined
                        style={{
                          justifyItems: "center",
                          fontSize: 18,
                          color: "#fff",
                        }}
                      />
                    </ButtonComponent>
                  )}
                  {current === steps().length - 1 ? (
                    <>
                      <ButtonComponent
                        htmlType="submit"
                        type="submit"
                        onClick={() => setTypeSubmit(listTypeSubmit[1])}
                        form="lateChargeRuleForm"
                      >
                        Save as Draft
                      </ButtonComponent>
                      <ButtonComponent
                        htmlType="submit"
                        type="submit"
                        onClick={() => setTypeSubmit(listTypeSubmit[0])}
                        form="lateChargeRuleForm"
                      >
                        Save & Submit
                      </ButtonComponent>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </Form>
        </div>

        {/** Modal Confirm */}
        {modalConfirm ? (
          <ModalCustom
            isOpen={modalConfirm}
            handleCancel={handleCancelModalConfirm}
            header={"Confirmation"}
            width={1000}
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
            <ContentModalConfirmLateChargeRule
              dataRuleInfo={dataLateChargeRule}
              data={dataLateChargeRule}
              dataLateCharge={dataLateCharge}
              listSectionInfo={steps().map((item) => ({
                value: item.title,
              }))}
              listDataDetailCondition={listDataDetailCondition}
              listDataAttachment={listDataAttachment}
              listDataDetailFormula={listDataDetailFormula}
              listDataAppHierDetail={appHierDataDetail}
              dataOption={appHierOptions}
              selectedHierarchy={selectedHierarchy}
            />
          </ModalCustom>
        ) : null}

        {modalSuccessCreate ? (
          <Modal
            open={modalSuccessCreate}
            onCancel={() => setModalSuccessCreate(false)}
            className={"modal-custom"}
            centered={true}
            width={400}
            maskClosable={false}
            footer={
              <div className="w-full flex justify-end gap-5 p-4">
                <Link
                  // to={from === "create" ? ACCOUNT_MANAGEMENT_ROUTES.DETAIL_LATE_CHARGES : ACCOUNT_MANAGEMENT_ROUTES.VIEW_LATE_CHARGES}
                  // state={from === "create" ? {id:lateChargeId} : null}
                  to={ACCOUNT_MANAGEMENT_ROUTES.DETAIL_LATE_CHARGES}
                  state={{ id: lateChargeId }}
                >
                  <ButtonComponent type="submit">OK</ButtonComponent>
                </Link>
              </div>
            }
          >
            <div className={"flex flex-col w-full"}>
              <div className="px-5 pt-5 pb-[10px] justify-center">
                <div className="w-full flex gap-[20px]">
                  <SVGIcon name="IconSuccess" width={48} />
                  <p className="text-[18px] font-bold">Successful</p>
                </div>
                <p className="pl-[70px]">{`Your data has been ${typeSubmit === "draft" ? "created" : "submitted"}.`}</p>
              </div>
            </div>
          </Modal>
        ) : null}

        {/* Modal Back */}
        <ModalBack
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
        />
        {/** Modal Retry */}
        <ModalError
          isOpen={modalError}
          handleOk={handleRetry}
          handleCancel={handleCloseModalError}
          customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              {IconModal.icon_error_default}
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your data was not ${
              type === "update" ? "updated" : "created"
            }. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </LayoutMenu>
  );
};

export default FormLateChargesRule;
