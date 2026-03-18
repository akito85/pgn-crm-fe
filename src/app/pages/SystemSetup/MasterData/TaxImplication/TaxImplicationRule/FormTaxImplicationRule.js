import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Form, Spin, Steps, Modal } from "antd";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import BreadCrumbAdvanced from "../../../../../../components/BreadCrumbAdvanced";
import {
  createTaxImplicationRuleBody,
  getImplicationTypeList,
  getDetailDraftTaxImplicationRule,
  getDetailTaxImplication,
  getDetailTaxImplicationRule,
  getListAppHier,
  getListAppHierDetail,
  getListCategory,
  getOperatorConditionList,
  getConditionNameList,
  updateTaxImplicationRuleBody,
  checkStartDate,
  getTransactionCode
} from "../../../../../../redux/slices/account_management/MasterData/tax_implication";
import DetailText from "../../../../../../components/DetailText";
import BaseContainer from "../../../../../../components/BaseContainer";
import { showModalError, showModalSuccess } from "../../../../../../redux/slices/general_slice";
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
import TableTaxImplicationRuleFormula from "./TableTaxImplicationRuleFormula";
import moment from "moment";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import { bytesConverter } from "../../../../../../utils/bytesConverter";
import ContentModalConfirmTaxImplicationRule from "./ContentModalConfirmTaxImplicationRule";
import SelectComponent from "../../../../../../components/SelectComponent";
import TableTaxImplicationRuleOverride from "./TableTaxImplicationRuleOverride";

const routes = (type, id) => [
  {
    path: "",
    breadcrumbName: "System Setup",
  },
  {
    path: "",
    breadcrumbName: "Master Data",
  },
  {
    path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_TAX_IMPLICATION,
    breadcrumbName: "Tax Implication",
  },
  {
    path: ACCOUNT_MANAGEMENT_ROUTES.DETAIL_TAX_IMPLICATION,
    breadcrumbName: "Detail Tax Implication",
    state: {
      id: id,
    }
  },
  {
    path: "",
    breadcrumbName: `${type === "update" ? "Update Tax Implication Rule" : "Create Tax Implication Rule"
      }`,
  },
];

const listTypeSubmit = ["submit", "draft"];

const FormTaxImplicationRule = ({ type }) => {
  const [form] = Form.useForm();
  const [formInfo] = Form.useForm();
  const formValue = form.getFieldsValue();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id, taxImplicationId, from } = location?.state || {};
  const {
    data_detail = {},
    loading = false,
    dataListAppHierId = [],
    dataListAppHierDetail = [],
    data_detail_tax_implication_rule = {},
    data_detail_draft_tax_implication_rule = {},
    dataImplicationType = [],
    conditionNameList = [],
    operationConditionList = [],
    transactionCodeData
  } = useSelector((state) => state.tax_implication);

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
  const [dataTaxImplicationRule, setDataTaxImplicationRule] = useState({});
  const [dataTaxImplication, setDataTaxImplication] = useState({});
  const [modalFormTaxImpliRule, setModalFormTaxImpliRule] = useState(false);
  const [listDataDetailOverride, setListDataDetailOverride] = useState([]);
  const [tempObjDetailOverride, setempObjDetailOverride] = useState({});
  const [editingKeyOverride, setEditingKeyOverride] = useState(false);
  const [modalOverrideWarning, setModalOverrideWarning] = useState(false);
  const [modalFormTaxImpliRuleError, setModalFormTaxImpliRuleError] = useState(false);
  const [modalSuccessCreate, setModalSuccessCreate] = useState(false);
  const [isUpdateTable, setIsUpdateTable] = useState({
    type: false,
    item: null
  });
  const isLoading = loading || loadingForm;
  const containerRef = useRef(null);


  useEffect(() => {
    dispatch(getListAppHier());
    dispatch(getConditionNameList());
    dispatch(getOperatorConditionList());
    dispatch(getImplicationTypeList());
    dispatch(getTransactionCode());
  }, [dispatch]);

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailTaxImplicationRule(id));
      dispatch(getDetailDraftTaxImplicationRule(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (taxImplicationId) {
      dispatch(getDetailTaxImplication(taxImplicationId));
    }
  }, [dispatch, taxImplicationId]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getListAppHierDetail({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  // Get data Card tax implication
  useEffect(() => {
    if (data_detail?.taxImplicationId === taxImplicationId) {
      const obj = {
        taxImplicationName: data_detail?.name,
        category: data_detail?.category.name,
        serviceType: data_detail?.serviceType.name,
        description: data_detail?.description,
        criteria: (data_detail?.criteria || []).map((item) => item.value),
        criteriaName: (data_detail?.criteria || []).reduce(
          (prev, current, index) =>
            prev + `${index === 0 ? current.label : ", " + current.label} `,
          ""
        ),
        createdDate: data_detail?.historyLog.createdDate,
        createdBy: data_detail?.historyLog.createdBy,
        updatedDate: data_detail?.historyLog.updatedDate,
        updatedBy: data_detail?.historyLog.updatedBy,
      };
      setDataTaxImplication(obj);
    }
  }, [taxImplicationId, data_detail]);

  // Get Data For "UPDATE" Main
  useEffect(() => {
    if (
      type === "update" &&
      data_detail_tax_implication_rule?.taxImplicationRuleId === id
    ) {
      const obj = {
        status: data_detail_tax_implication_rule?.status,
        documentNumber: data_detail_tax_implication_rule?.documentNumber,
        gunggung: data_detail_tax_implication_rule?.isGunggung === "Y" ? true : false,
        vatInvoiceIssuance: data_detail_tax_implication_rule?.isVatInv === "Y" ? true : false,
        approvalStatus: data_detail_tax_implication_rule?.approvalStatus,
        implicationType: data_detail_tax_implication_rule?.implicationType.id,
        transactionCode: data_detail_tax_implication_rule?.transCodeName,
        description: data_detail_tax_implication_rule?.description,
        startDate: data_detail_tax_implication_rule?.startDate
          ? moment(data_detail_tax_implication_rule?.startDate, dateFormatting.date)
          : "",
        maxAmount: data_detail_tax_implication_rule?.maxAmount,
        approvalHierarchy: data_detail_tax_implication_rule?.apphierId,
      };
      form.setFieldsValue(obj);
      setDataTaxImplicationRule(obj);
      setSelectedHierarchy(obj.approvalHierarchy);
      // setListDataDetailCondition(
      setListDataDetailOverride(
        (data_detail_tax_implication_rule?.listRuleOverride || []).map(
          (item, index) => ({
            id: item.id,
            key: index + 1,
            implicationType: item.implicationType.name,
            implicationTypeId: item.implicationType.id,
            description: item.description,
            transactionCode: item.transCodeName,
            dataDetail: item.listRuleOverrideCondition.map(itemSecond => {
              return {
                id: itemSecond.id,
                conditionName: {
                  key: `${itemSecond.name.id}`,
                  label: itemSecond.name.name,
                  title: itemSecond.name.name,
                  value: itemSecond.name.id,
                },
                operator: {
                  key: `${itemSecond.operator.id}`,
                  label: itemSecond.operator.name,
                  title: itemSecond.operator.name,
                  value: itemSecond.operator.id,
                },
                value: itemSecond.value
              }
            }),
            // taxImplicationRuleId: item.taxImplicationRuleId,
            // name: {
            //   value: item?.name?.id || 0,
            //   label: item?.name?.name || "",
            // },
            // operator: {
            //   value: item?.operator?.id || 0,
            //   label: item?.operator?.name || "",
            // },
            // dataType: {
            //   value: item?.dataType?.id || 0,
            //   label: item?.dataType?.name || "",
            // },
            // value: item.value,
            typeData: "exist",
          })
        )
      );
      setListDataAttachment(
        (data_detail_tax_implication_rule?.attachments || []).map((attachData) => ({
          ...attachData,
          createdDate: attachData.createdDate
            ? moment(attachData.createdDate).format(dateFormatting.dateTime)
            : "",
          fileSize: bytesConverter(attachData.fileSize || 0),
          dataType: "exist",
        }))
      );
    }
  }, [type, id, form, data_detail_tax_implication_rule]);

  // Get Data For "UPDATE" Draft
  useEffect(() => {
    if (
      id &&
      type === "update" &&
      data_detail_draft_tax_implication_rule?.taxImplicationRuleId === id &&
      data_detail_tax_implication_rule &&
      data_detail_draft_tax_implication_rule?.taxImplicationRuleId ===
      data_detail_tax_implication_rule?.taxImplicationRuleId
    ) {
      const obj = {
        description: data_detail_draft_tax_implication_rule.description,
        approvalHierarchy: data_detail_draft_tax_implication_rule.apphierId,
      };
      form.setFieldsValue(obj);
      setDataTaxImplicationRule((prevState) => ({
        ...prevState,
        ...obj,
      }));
      setSelectedHierarchy(obj.approvalHierarchy);
      setListDataAttachment(
        (data_detail_tax_implication_rule?.attachments || []).map(
          (attachData) => ({
            ...attachData,
            createdDate: attachData.createdDate
              ? moment(attachData.createdDate).format(dateFormatting.dateTime)
              : "",
            fileSize: bytesConverter(attachData.fileSize || 0),
            dataType: "exist",
          })
        )
      );
    }
  }, [
    type,
    id,
    form,
    data_detail_tax_implication_rule,
    data_detail_draft_tax_implication_rule,
  ]);

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


  const handleTaxImplicationRuleInfoObj = (e, type) => {
    let result;
    switch (type) {
      case "description":
        result = e.target.value;
        break;
      default:
        result = e;
        break;
    }
    setDataTaxImplicationRule((prevState) => ({
      ...prevState,
      [type]: result,
    }));
    return result;
  };

  const handleCancelModalConfirm = () => {
    setModalConfirm(false);
    setIsUpdateTable({
      type: false,
      item: null
    })
  };

  const handleSubmitForm = (value) => {
    let tempAttachment = [...listDataAttachment];
    // if (
    //   type === "update" &&
    //   data_detail_tax_implication_rule?.status === "ACTIVE" &&
    //   data_detail_tax_implication_rule?.approvalStatus === "APPROVED"
    // ) {
    //   tempAttachment = tempAttachment.filter(
    //     (item) => item.dataType !== "exist"
    //   );
    // }
    if (tempAttachment.length === 0) {
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

    const tempListOverride = listDataDetailOverride.map(item => {
      return {
        id: item.id ? item.id : null,
        implicationType: item.implicationTypeId,
        transCode: item.transactionCode,
        description: item.description,
        listRuleOverrideCondition: item.dataDetail.map(itemSecond => {
          return {
            id: itemSecond.id ? itemSecond.id : null,
            name: itemSecond.conditionName.value,
            operator: itemSecond.operator.value,
            value: itemSecond.value
          }
        })
      }
    })

    const body = {
      taxImplicationId: taxImplicationId,
      taxImplicationRuleId: id,
      implicationType: dataTaxImplicationRule.implicationType,
      isVatInv: dataTaxImplicationRule.vatInvoiceIssuance || false,
      isGunggung: dataTaxImplicationRule.gunggung || false,
      transCode: dataTaxImplicationRule.transactionCode,
      description: dataTaxImplicationRule.description,
      documentNumber: dataTaxImplicationRule.documentNumber,

      startDate: dataTaxImplicationRule.startDate
        ? dataTaxImplicationRule.startDate.format(dateFormatting.dateForm)
        : "",
      appHierId: selectedHierarchy,
      isSubmit: typeSubmit === listTypeSubmit[0],
      listRuleOverride: tempListOverride,
    };
    if (id) {
      delete body.taxImplicationId;
    } else {
      delete body.taxImplicationRuleId;
    }

    if (type === "create") {
      dispatch(createTaxImplicationRuleBody(body))
        .unwrap()
        .then(async (data) => {
          const idTaxImplicationRule = data.id;
          setLoadingForm(true);
          for (let icon in listDataAttachment) {
            const element = listDataAttachment[icon];
            const body = {
              files: element.file,
              category: element.fileCategoryId,
            };
            const response = await accountManagementService.uploadAttachment(
              `/v1/dbs/api/tax-implication/create-taximplication-rule-attachment/${idTaxImplicationRule}`,
              body
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
      dispatch(updateTaxImplicationRuleBody(body))
        .unwrap()
        .then(async (data) => {
          const idTaxImplicationRule = data.id;
          setLoadingForm(true);
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist"
          );
          for (let icon in filterDataAttach) {
            const element = filterDataAttach[icon];
            const body = {
              files: element.file,
              category: element.fileCategoryId,
            };
            const response = await accountManagementService.uploadAttachment(
              `/v1/dbs/api/tax-implication/create-taximplication-rule-attachment/${idTaxImplicationRule}`,
              body
            );
          }
          const successBody = {
            title: `Successful`,
            description: `Your data has been ${typeSubmit == 'draft' ? 'updated' : 'submitted'}.`,
          };
          // setModalSuccessCreate(true);
          dispatch(showModalSuccess(successBody))
          // setModalSuccessCreate(true);
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
    let emptyKeys = []
    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined || value === "") {
        emptyKeys.push(key)

      }
    }
    return emptyKeys;
  }, []);

  const errorMessage = useCallback((key) => {
    const titleKey = (key) => {
      if (key ==='startDate') {
        return "Start Date"
      } else if (key ==='documentNumber') {
        return "Document Number"
      } else if (key === 'implicationType') {
        return "Implication Type"
      } else {
        return "Transaction Code"
      } 
    }
    for (const item of key) {
        form.setFields([
          {
            name: item,
            errors: [`Please input your ${titleKey(item)}!`],
          },
        ])
      }
  },[form])

  const handleButtonNext = () => {
    const { gunggung, description, vatInvoiceIssuance, ...requiredField } = formValue;
    const checkEmptyValues = checkAllKeysHaveValue(requiredField)

    let errorBody = {};
    switch (current) {
      case 0:
        if (checkEmptyValues?.length > 0) {
          errorMessage(checkEmptyValues);
        } else {
          const body = {
            taxImplicationId: taxImplicationId,
            startDate: moment(dataTaxImplicationRule.startDate).format(dateFormatting.dateFormal)
          }
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

  // ddl dataTransactionCode
  let dataTransactionCode = [];
  for (let i = 1; i <= 7; i++) {
    dataTransactionCode.push({
      value: `0${i}`,
      label: `0${i}`
    });
  }

  const handleAddItemOverride = (r) => {

    if (listDataDetailFormula.length === 0) {
      setModalOverrideWarning(true)
    } else {
      const dataForm = formInfo.getFieldsValue();
      const getImplicationType = (val) => {
        const implicationName = dataImplicationType && dataImplicationType?.filter((item) => item?.value === val)
        if (implicationName === undefined) {
          return ''
        }
        if (implicationName.length !== 0) {
          return implicationName[0].label
        }
      }
      if (editingKeyOverride) {
        const newData = {
          description: dataForm.descriptionOverride,
          implicationType: getImplicationType(dataForm.implicationTypeOverride),
          implicationTypeId: dataForm.implicationTypeOverride,
          transactionCode: dataForm.transactionCodeOverride,
          dataDetail: listDataDetailFormula,
        }
        const updatedData = listDataDetailOverride.map(item =>
          item.key === editingKeyOverride ? { ...item, ...newData } : item
        );
        setListDataDetailOverride(updatedData)
      } else {
        setListDataDetailOverride((prevState) => {
          let newData = {
            implicationType: getImplicationType(r?.implicationTypeOverride),
            implicationTypeId: r?.implicationTypeOverride,
            transactionCode: r?.transactionCodeOverride,
            description: r?.descriptionOverride,
            dataDetail: listDataDetailFormula,
            key: listDataDetailOverride.length + 1
          }
          return [
            ...prevState, newData
          ]
        });
      }
      setEditingKeyOverride(false)
      setListDataDetailFormula([])
      formInfo.resetFields();
      setModalFormTaxImpliRule(false);
      setIsUpdateTable({
        type: false,
        item: null
      })
    }
  }
  const handleDeleteItemOverride = (idToDelete) => {
    setListDataDetailOverride((prevData) => prevData.filter((item) => item.key !== idToDelete));
  };


  const handleUpdateItemOverride = (dataUpdate) => {

    setIsUpdateTable({
      type: true,
      item: dataUpdate
    })
    setModalFormTaxImpliRule(true);
    setEditingKeyOverride(dataUpdate?.key)
    const getConditionId = (val) => {
      const conditionId = conditionNameList && conditionNameList?.filter((item) => item?.label === val)
      if (conditionId.length !== 0) {
        return conditionId[0].value
      }
    }
    const getOperatorId = (val) => {
      const operatorId = operationConditionList && operationConditionList?.filter((item) => item?.label === val)
      if (operatorId.length !== 0) {
        return operatorId[0].value
      }
    }
    formInfo.setFieldsValue({
      implicationTypeOverride: dataUpdate?.implicationTypeId,
      transactionCodeOverride: dataUpdate?.transactionCode,
      descriptionOverride: dataUpdate?.description
    })
    const tempDetail = dataUpdate?.dataDetail.map((item) => {
      return {
        key: item.key,
        conditionName: {
          key: `${getConditionId(item.conditionName)}`,
          label: item.conditionName,
          title: item.conditionName,
          value: getConditionId(item.conditionName),
        },
        operator: {
          key: `${getOperatorId(item.operator)}`,
          label: item.operator,
          title: item.operator,
          value: getOperatorId(item.operator),
        },
        value: item?.value
      }
    })
    setListDataDetailFormula(tempDetail)
  };
  const handleOpenDate = (current) => {
    return false;
  };

  console.log(dataTaxImplicationRule, ' implication trule');

  const steps = () => {
    let data = [
      {
        title: "Tax Implication Rule Information",
        content: (
          <div className="flex flex-col gap-4">
            <BaseContainer header={"tax implication rule"}>
              <div className="grid grid-cols-3 gap-2">
                <Form.Item
                  name={"documentNumber"}
                  className={"w-full no-margin-form"}
                  rules={[
                    { message: requiredMessage("Document Number"), required: true },
                    {
                      pattern: /^[a-zA-Z0-9\-/\.\_" "]+$/,
                      message: "Invalid input. Only numbers, letters, (space), (_), (-), (/), and (.)",
                    },
                  ]}
                  getValueFromEvent={(e) =>
                    handleTaxImplicationRuleInfoObj(e.target.value, "documentNumber")
                  }
                  label={"Document Number"}
                >

                  <InputComponent
                    maxLength={50}
                    disabled={
                      type === "update" &&
                      dataTaxImplicationRule.status === "ACTIVE"
                    }
                  />
                </Form.Item>
                <Form.Item
                  // label={"VAT Invoice Issuance"}
                  className="pt-[30px]"
                  name={"vatInvoiceIssuance"}
                  getValueFromEvent={(e) =>
                    handleTaxImplicationRuleInfoObj(e.target.checked, "vatInvoiceIssuance")
                  }
                >
                  <div className="pt-[30px]">
                    <Checkbox
                      checked={dataTaxImplicationRule?.vatInvoiceIssuance}
                      disabled={
                        type === "update" &&
                        dataTaxImplicationRule.status === "ACTIVE"
                      }
                    >
                      <span className="text-[14px]">VAT Invoice Issuance</span><br />
                      <span className="text-[11px]">Check if this implication issue the value-added tax invoice (e-faktur)</span>
                    </Checkbox>
                  </div>
                </Form.Item>
                <Form.Item
                  // label={"VAT Invoice Issuance"}
                  className="pt-[30px]"
                  name={"gunggung"}
                  getValueFromEvent={(e) =>
                    handleTaxImplicationRuleInfoObj(e.target.checked, "gunggung")
                  }
                >
                  <div className="pt-[30px]">
                    <Checkbox
                      checked={dataTaxImplicationRule?.gunggung}
                      disabled={
                        type === "update" &&
                        dataTaxImplicationRule.status === "ACTIVE"
                      }
                    >
                      <span className="text-[14px]">Gunggung</span><br />
                      <span className="text-[11px]">Check if this implication value-added tax invoice (e-faktur) is gunggung</span>
                    </Checkbox>
                  </div>
                </Form.Item>
                <Form.Item
                  rules={[
                    { message: requiredMessage("Implication Type"), required: true },
                  ]}
                  label={"Implication Type"}
                  name={"implicationType"}
                  getValueFromEvent={(e) =>
                    handleTaxImplicationRuleInfoObj(e, "implicationType")
                  }
                >
                  <SelectComponent
                    options={dataImplicationType}
                    disabled={
                      type === "update" &&
                      dataTaxImplicationRule.status === "ACTIVE" ||
                      listDataDetailOverride.length > 0
                    }
                  />
                </Form.Item>
                <Form.Item
                  label={"Transaction Code"}
                  name={"transactionCode"}
                  getValueFromEvent={(e) =>
                    handleTaxImplicationRuleInfoObj(e, "transactionCode")
                  }
                  rules={[
                    { message: requiredMessage("Transaction Code"), required: true },
                  ]}
                >
                  <SelectComponent
                    options={transactionCodeData?.map(item => ({ label: item?.code, value: item?.id }))}
                    disabled={
                      type === "update" &&
                      dataTaxImplicationRule.status === "ACTIVE" ||
                      listDataDetailOverride.length > 0
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
                    handleTaxImplicationRuleInfoObj(e, "startDate")
                  }
                  label={"Start Date"}
                  required
                >
                  <DateComponent
                    dateDisable={handleOpenDate}
                    disabled={
                      type === "update" &&
                      dataTaxImplicationRule.status === "ACTIVE"
                    }
                  />
                </Form.Item>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Form.Item
                  name={"description"}
                  className="w-full"
                  getValueFromEvent={(e) =>
                    handleTaxImplicationRuleInfoObj(e, "description")
                  }
                  label={"Description"}
                >
                  <InputComponent
                    type="textarea"
                    value={dataTaxImplicationRule.description}
                  />
                </Form.Item>
              </div>
            </BaseContainer>
            <div className="drop-shadow-lg bg-white rounded-lg w-full mt-[30px] p-[20px]">
              <div className="flex flex-col gap-2 p-4">
                <div className="text-primary text-xs font-bold uppercase">
                  {"tax implication rule override"}
                </div>
                {/* Modal Create/Update Tax implication rule */}
                {
                  (dataTaxImplicationRule.status !== "ACTIVE") &&
                  <div className="flex w-full justify-end">
                    <ButtonComponent
                      icon={<SVGIcon name="IconButtonCreate" width={24} />}
                      type="submit"
                      onClick={
                        dataTaxImplicationRule.implicationType &&
                          dataTaxImplicationRule.transactionCode ?
                          () => setModalFormTaxImpliRule(true) : () => setModalFormTaxImpliRuleError(true)}
                    >
                      Create
                    </ButtonComponent>
                  </div>
                }
                <TableTaxImplicationRuleOverride
                  data={listDataDetailOverride}
                  handleDeleteItemOverride={handleDeleteItemOverride}
                  handleUpdateItemOverride={handleUpdateItemOverride}
                  typeUpdate={type}
                  dataTaxImplicationRule={dataTaxImplicationRule}
                  isUpdateTable={isUpdateTable}
                  setIsUpdateTable={setIsUpdateTable}
                  dataTransCode={transactionCodeData}
                />
                {modalFormTaxImpliRule ? (
                  <TableTaxImplicationRuleFormula
                    dataTable={listDataDetailFormula}
                    updateTable={setListDataDetailFormula}
                    dataTaxImplicationRule={dataTaxImplicationRule}
                    storedData={storedDataInline}
                    setStoredData={setStoredDataInline}
                    type={type}
                    dataTransactionCode={transactionCodeData?.map(item => ({ label: item?.code, value: item?.id }))}
                    setListDataDetailOverride={setListDataDetailOverride}
                    listDataDetailOverride={listDataDetailOverride}
                    modalFormTaxImpliRule={modalFormTaxImpliRule}
                    setModalFormTaxImpliRule={setModalFormTaxImpliRule}
                    handleAddItemOverride={handleAddItemOverride}
                    formInfo={formInfo}
                    isUpdateTable={isUpdateTable}
                  />
                ) : null}
              </div>
            </div>
          </div>
        ),
        disabled:
          !dataTaxImplicationRule.startDate ||
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
              typeSelector={"tax_implication"}
              mandatory={true}
            />
          </BaseContainer>
        ),
        disabled:
          (type === "create" && listDataAttachment.length === 0) ||
          (type === "update" &&
            dataTaxImplicationRule.status === "ACTIVE" &&
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
      setDataTaxImplicationRule({});
      setListDataAttachment([]);
      setListDataDetailCondition([]);
      setListDataDetailFormula([]);
      setSelectedHierarchy(undefined);
      setListDataDetailOverride([])
    } else {
      form.resetFields();
      dispatch(getDetailTaxImplicationRule(id));
      dispatch(getDetailDraftTaxImplicationRule(id));
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
    <Spin spinning={isLoading}>
      <BreadCrumbAdvanced routes={routes(type, taxImplicationId)} />
      <div className="flex flex-col gap-4">
        <BaseContainer header={"tax implication information"}>
          <div className="grid grid-cols-3 gap-2">
            <DetailText label={"Tax Implication Name"}>
              {dataTaxImplication?.taxImplicationName}
            </DetailText>
            <DetailText label={"Category"}>
              {dataTaxImplication?.category}
            </DetailText>
            <DetailText label={"Service Type"}>
              {dataTaxImplication?.serviceType}
            </DetailText>
            <DetailText label={"Criteria"}>
              {dataTaxImplication?.criteriaName}
            </DetailText>
            <div className="col-span-3">
              <DetailText label={"Description"}>
                {dataTaxImplication?.description}
              </DetailText>
            </div>
          </div>
        </BaseContainer>
        <Form
          id="taxImplicationRuleForm"
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
                  <Form.Item>
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
                  </Form.Item>
                )}
                {current === steps().length - 1 ? (
                  <>
                    <ButtonComponent
                      htmlType="submit"
                      type="submit"
                      onClick={() => setTypeSubmit(listTypeSubmit[1])}
                      form="taxImplicationRuleForm"
                    >
                      Save as Draft
                    </ButtonComponent>
                    <ButtonComponent
                      htmlType="submit"
                      type="submit"
                      onClick={() => setTypeSubmit(listTypeSubmit[0])}
                      form="taxImplicationRuleForm"
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
          <ContentModalConfirmTaxImplicationRule
            data={transactionCodeData}
            dataTaxImplication={dataTaxImplication}
            dataTaxImplicationRule={dataTaxImplicationRule}
            listSectionInfo={steps().map((item) => ({
              value: item.title,
            }))}
            listDataDetailCondition={listDataDetailCondition}
            listDataAttachment={listDataAttachment}
            listDataDetailFormula={listDataDetailFormula}
            listDataAppHierDetail={appHierDataDetail}
            dataOption={appHierOptions}
            selectedHierarchy={selectedHierarchy}
            listDataDetailOverride={listDataDetailOverride}
          />
        </ModalCustom>
      ) : null}

      {modalSuccessCreate ?
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
                // to={from === "create" ? ACCOUNT_MANAGEMENT_ROUTES.DETAIL_TAX_IMPLICATION : ACCOUNT_MANAGEMENT_ROUTES.VIEW_TAX_IMPLICATION}
                // state={from === "create" ? {id:taxImplicationId} : null}
                to={ACCOUNT_MANAGEMENT_ROUTES.DETAIL_TAX_IMPLICATION}
                state={{ id: taxImplicationId }}
              >
                <ButtonComponent type="submit">
                  OK
                </ButtonComponent>
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
              <p className="pl-[70px]">{`Your data has been ${typeSubmit == 'draft' ? 'created' : 'submitted'}.`}</p>
            </div>
          </div>
        </Modal> : null
      }

      {/* Modal Back */}
      <ModalBack
        isOpen={modalBack}
        handleCancel={() => setModalBack(false)}
        handleOk={() => navigate(-1)}
      />
      {/** Modal Override must one data */}
      <ModalError
        isOpen={modalOverrideWarning}
        handleOk={() => setModalOverrideWarning(false)}
        handleCancel={() => setModalOverrideWarning(false)}
        customText={"Oke"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {IconModal.icon_error_default}
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">Please fill condition at least 1 data!</p>
        </div>
      </ModalError>
      {/** Modal Override must Fill Field tax impli type and code */}
      <ModalError
        isOpen={modalFormTaxImpliRuleError}
        handleOk={() => setModalFormTaxImpliRuleError(false)}
        handleCancel={() => setModalFormTaxImpliRuleError(false)}
        customText={"Oke"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {IconModal.icon_error_default}
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">You can't create Tax Implication Rule Override. Please fill out the Implication Type and Transaction Code field first.</p>
        </div>
      </ModalError>

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
          <p className="pl-[70px]">{`Your data was not ${type === "update" ? "updated" : "created"
            }. ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </Spin>
  )
}

export default FormTaxImplicationRule