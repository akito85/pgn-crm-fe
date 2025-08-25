import React, { useEffect, useMemo, useState } from "react";
import LayoutMenu from "../../../../../../components/SidebarMenu/LayoutMenu";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Spin } from "antd";
import {
  approvalCreateTaxImplicationRule,
  approvalInactiveTaxImplicationRule,
  getDetailDraftTaxImplicationRule,
  getDetailTaxImplication,
  getDetailTaxImplicationRule,
  getListCategory,
  getTransactionCode,
} from "../../../../../../redux/slices/account_management/MasterData/tax_implication";
import BreadCrumbAdvanced from "../../../../../../components/BreadCrumbAdvanced";
import moment from "moment";
import { dateFormatting, requiredMessage } from "../../../../../../utils";
import BaseContainer from "../../../../../../components/BaseContainer";
import RadioTabs from "../../../../../../components/RadioTabs";
import DetailText from "../../../../../../components/DetailText";
import AttachmentSectionForm from "../../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import accountManagementService from "../../../../../../redux/services/account_management/accountManagementService";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";
import InputComponent from "../../../../../../components/InputComponent";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import SVGIcon from "../../../../../../assets/Icon/index";
import { bytesConverter } from "../../../../../../utils/bytesConverter";
import LayoutDetailTaxImplicationRule from "./LayoutDetailTaxImplicationRule";
import { AttachmentDetail } from "./AttachmentDetail";

const routes = (id) => {
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
      breadcrumbName: "Detail Tax Implication Rule",
    },
  ];
}

const type = "detail";

const DetailTaxImplicationRule = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id, taxImplicationId } = location?.state || {};
  const [form] = Form.useForm();
  const [listDataDetailFormula, setListDataDetailFormula] = useState([]);
  const [listDataDetailCondition, setListDataDetailCondition] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [listDataDraftAttachment, setListDataDraftAttachment] = useState([]);
  const [listSectionInfo, setListSectionInfo] = useState([
    { value: "Tax Implication Rule" },
    { value: "Attachment" },
  ]);
  const [typeTaxImplicationInfo, setTypeTaxImplicationInfo] = useState(
    listSectionInfo[0].value
  );

  // Redux
  const {
    data_detail = {},
    data_detail_tax_implication_rule = {},
    data_detail_draft_tax_implication_rule = {},
    loading = false,
    transactionCodeData
  } = useSelector((state) => state.tax_implication);

  const [modalConfirm, setModalConfirm] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");
  const [remark, setRemark] = useState("");
  const [dataLogInformation, setDataLogInformation] = useState({});
  const [dataTaxImplicationRule, setDataTaxImplicationRule] = useState({});
  const [dataDraftTaxImplicationRule, setDataDraftTaxImplicationRule] = useState({});
  const [dataTaxImplication, setDataTaxImplication] = useState({});
  const [bodyApproval, setBodyApproval] = useState({
    isApprover: false,
    tappId: null,
    approvalDetail: null,
    approvalType: null,
  });

  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const showButtonApproval = useMemo(
    () => bodyApproval.isApprover !== null && bodyApproval.isApprover,
    [bodyApproval]
  );

  useEffect(() => {
    dispatch(getTransactionCode());
    if (taxImplicationId) {
      dispatch(getDetailTaxImplication(taxImplicationId));
    }
  }, [dispatch, taxImplicationId]);

  useEffect(() => {
    if (id) {
      dispatch(getDetailDraftTaxImplicationRule(id));
      dispatch(getDetailTaxImplicationRule(id));
    }
  }, [dispatch, id]);

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
        isRuleActive: data_detail?.isRuleActive,
        createdDate: data_detail?.historyLog.createdDate,
        createdBy: data_detail?.historyLog.createdBy,
        updatedDate: data_detail?.historyLog.updatedDate,
        updatedBy: data_detail?.historyLog.updatedBy,
      };
      setDataTaxImplication(obj);
    }
  }, [taxImplicationId, data_detail]);



  useEffect(() => {
    if (
      id &&
      data_detail_draft_tax_implication_rule?.taxImplicationRuleId === id &&
      data_detail_draft_tax_implication_rule?.taxImplicationRuleId ===
      data_detail_tax_implication_rule?.taxImplicationRuleId &&
      data_detail_tax_implication_rule &&
      (!data_detail_tax_implication_rule.approvalType ||
        data_detail_tax_implication_rule.approvalType !==
        "INACTIVE_TAX_IMPLICATION_RULE")
    ) {
      const obj = {
        description: data_detail_draft_tax_implication_rule.description,
      };
      setDataDraftTaxImplicationRule(obj);
      setListDataDraftAttachment(
        (data_detail_draft_tax_implication_rule?.attachments || []).map(
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
      setListSectionInfo([{ value: "Tax Implication Rule" }, { value: "Draft" }, { value: "Attachment" }]);
    }
  }, [id, data_detail_tax_implication_rule, data_detail_draft_tax_implication_rule]);

  useEffect(() => {
    if (data_detail_tax_implication_rule?.taxImplicationRuleId === id) {
      const indexStatus = data_detail_tax_implication_rule.status;
      const status = indexStatus
        ? indexStatus.charAt(0).toUpperCase() +
        indexStatus.slice(1).toLowerCase()
        : indexStatus;
      const indexStatusApproval = data_detail_tax_implication_rule.approvalStatus;
      let approvalStatus;
      if (indexStatusApproval === "WAITING_APPROVAL") {
        approvalStatus = "Waiting Approval";
      } else {
        approvalStatus = indexStatusApproval
          ? indexStatusApproval.charAt(0).toUpperCase() +
          indexStatusApproval.slice(1).toLowerCase()
          : indexStatusApproval;
      }
      setDataLogInformation({
        taxImplicationRuleId: data_detail_tax_implication_rule.taxImplicationRuleId,
        createdDate: moment(data_detail_tax_implication_rule.createdDate).format(
          dateFormatting.dateTime
        ),
        createdBy: data_detail_tax_implication_rule.createdBy,
        updatedDate: data_detail_tax_implication_rule.updatedDate
          ? moment(data_detail_tax_implication_rule.updatedDate).format(
            dateFormatting.dateTime
          )
          : "",
        updatedBy: data_detail_tax_implication_rule.updatedBy,
      });
      const obj = {
        status,
        approvalStatus,
        description: data_detail_tax_implication_rule.description,
        documentNumber: data_detail_tax_implication_rule.documentNumber,
        startDate: data_detail_tax_implication_rule.startDate,
        endDate: data_detail_tax_implication_rule.endDate,
        implicationType: data_detail_tax_implication_rule.implicationType.name,
        isVatInv: data_detail_tax_implication_rule.isVatInv === "Y" ? "Yes" : "No",
        isGunggung: data_detail_tax_implication_rule.isGunggung === "Y" ? "Yes" : "No",
        transCode: data_detail_tax_implication_rule.transCodeName,
      };
      setDataTaxImplicationRule(obj);
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
      setListDataDetailCondition(
        (data_detail_tax_implication_rule?.listRuleCondition || []).map(
          (item, index) => ({
            key: index + 1 + "",
            taxImplicationRuleConditionId: item.id,
            taxImplicationRuleId: item.taxImplicationRuleId,
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
            value: item.value,
            typeData: "exist",
          })
        )
      );
      setListDataDetailFormula(
        (data_detail_tax_implication_rule?.listRuleFormula || []).map(
          (item, index) => ({
            key: index + 1 + "",
            taxImplicationRuleFormulaId: item.id,
            taxImplicationRuleId: item.taxImplicationRuleId,
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
            value: item.value,
            typeData: "exist",
          })
        )
      );
      setBodyApproval({
        isApprover: data_detail_tax_implication_rule.isApprover,
        tappId: data_detail_tax_implication_rule.tAppId,
        approvalDetail: data_detail_tax_implication_rule.approvalDetail,
        approvalType: data_detail_tax_implication_rule.approvalType,
      });
    }
  }, [id, data_detail_tax_implication_rule]);

  const handleTaxImplicationInfo = (e) => {
    const temp = e.target.value;
    setTypeTaxImplicationInfo(temp);
  };

  const handleModalConfirmation = (type) => {
    setModalConfirm(true);
    setApproveOrReject(type);
  };

  const handleCloseModalApproveReject = () => {
    // setRemark("");
    setModalConfirm(false);
    // form.resetFields();
  };

  const handleConfirm = (formValue, handleClear) => {
    const obj = {
      taxImplicationRuleId: id,
      description: formValue.remark,
      approvalId: bodyApproval.tappId,
      action: approveOrReject === "Approve" ? "APPROVE" : "REJECT",
    };

    if (bodyApproval.approvalType === "INACTIVE_TAX_IMPLICATION_RULE") {
      dispatch(approvalInactiveTaxImplicationRule(obj))
        .unwrap()
        .then((res) => {
          handleClear();
          handleCloseModalApproveReject();
        })
        .catch((error) => {
          if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
            const message =
              error?.response?.data?.message ||
              error?.message ||
              error?.toString();
            setBodyError({ message, formValue });
            setModalError(true);
          }
        });
    } else {
      dispatch(approvalCreateTaxImplicationRule(obj))
        .unwrap()
        .then((res) => {
          handleCloseModalApproveReject();
        })
        .catch((error) => {
          if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
            const message =
              error?.response?.data?.message ||
              error?.message ||
              error?.toString();
            setBodyError({ message, formValue });
            setModalError(true);
          }
        });
    }
  };

  const handleTaxImplicationRuleInfo = (e) => {
    const temp = e.target.value;
    setTypeTaxImplicationInfo(temp);
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };
  const handleRetry = () => {
    handleConfirm(bodyError.formValue);
    setModalError(false);
    setBodyError({});
  };


  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumbAdvanced routes={routes(taxImplicationId || data_detail_tax_implication_rule?.taxImplicationId)} />
        <div className="flex flex-col">

          {/* Tax Implication Information */}
          <BaseContainer header={"tax implication information"}>
            <div className="grid grid-cols-3 gap-2">
              <DetailText label={"Tax Implication Name"}>
                {data_detail?.name}
              </DetailText>
              <DetailText label={"Category"}>
                {data_detail?.category.name}
              </DetailText>
              <DetailText label={"Service Type"}>
                {data_detail?.serviceType?.name}
              </DetailText>
              <div className="col-span-3">
                <DetailText label={"Criteria"}>
                  {(data_detail?.criteria || [])?.reduce(
                    (prev, current, index) =>
                      prev + `${index === 0 ? current.label : ", " + current.label} `,
                    ""
                  )}
                </DetailText>
              </div>
              <div className="col-span-3">
                <DetailText label={"Description"}>
                  {data_detail?.description}
                </DetailText>
              </div>
            </div>
          </BaseContainer>

          {/* Card Information Request */}
          {bodyApproval.isApprover && bodyApproval.approvalType ? (
            <BaseContainer
              header={`${(bodyApproval.approvalDetail.remarks || "").split(" ")[0]
                } REQUEST INFORMATION`}
            >
              <div className="grid grid-cols-4 w-full">
                <DetailText label={"Requested Date"}>
                  {bodyApproval.approvalDetail.requestedDate
                    ? moment(bodyApproval.approvalDetail.requestedDate).format(
                      dateFormatting.dateTime
                    )
                    : ""}
                </DetailText>
                <DetailText label={"Requested By"}>
                  {bodyApproval.approvalDetail.requestedBy}
                </DetailText>
                <DetailText label={"Remark"}>
                  {bodyApproval.approvalDetail.remarks}
                </DetailText>
              </div>
            </BaseContainer>
          ) : null}

          {/* Tabs */}
          <div className="my-4">
            <RadioTabs
              data={listSectionInfo}
              onChange={handleTaxImplicationRuleInfo}
              currentPosition={typeTaxImplicationInfo}
            />
          </div>

          {/* Content Tab */}
          {typeTaxImplicationInfo === "Tax Implication Rule" && (
            <LayoutDetailTaxImplicationRule
              key={"detail"}
              dataTaxImplicationRule={dataTaxImplicationRule}
              dispatch={dispatch}
              listDataAttachment={listDataAttachment}
              setListDataAttachment={setListDataAttachment}
              listDataDetailCondition={listDataDetailCondition}
              setListDataDetailCondition={setListDataDetailCondition}
              listDataDetailFormula={listDataDetailFormula}
              setListDataDetailFormula={setListDataDetailFormula}
              type={type}
              dataLogInformation={dataLogInformation}
              description={dataTaxImplicationRule?.description || ""}
              dataOverrideRule={data_detail_tax_implication_rule}
              transactionCodeData={transactionCodeData}
            />
          )}
          {typeTaxImplicationInfo === "Draft" && (
            <LayoutDetailTaxImplicationRule
              key={"draft"}
              dataTaxImplicationRule={dataTaxImplicationRule}
              dispatch={dispatch}
              listDataAttachment={listDataDraftAttachment}
              setListDataAttachment={setListDataDraftAttachment}
              listDataDetailCondition={listDataDetailCondition}
              setListDataDetailCondition={setListDataDetailCondition}
              listDataDetailFormula={listDataDetailFormula}
              setListDataDetailFormula={setListDataDetailFormula}
              type={type}
              dataLogInformation={dataLogInformation}
              description={dataDraftTaxImplicationRule?.description || ""}
              dataOverrideRule={data_detail_draft_tax_implication_rule}
              transactionCodeData={transactionCodeData}
            />
          )}
          {typeTaxImplicationInfo === "Attachment" && (
            <AttachmentDetail
              type={type}
              listDataAttachment={listDataAttachment}
              updateData={setListDataAttachment}
              dispatch={dispatch}
            />
          )}

          <div
            className={`flex w-full${showButtonApproval ? " justify-between" : ""
              } align-middle my-3`}
          >
            <ButtonComponent
              type={"submit"}
              onClick={() => navigate(-1)}
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
            {showButtonApproval ? (
              <div className="flex align-middle gap-3">
                <ButtonComponent
                  type="reject"
                  onClick={() => handleModalConfirmation("Reject")}
                >
                  Reject
                </ButtonComponent>
                <ButtonComponent
                  type="approve"
                  onClick={() => handleModalConfirmation("Approve")}
                >
                  Approve
                </ButtonComponent>
              </div>
            ) : null}
          </div>
        </div>

        {/* Modal Approve/Reject*/}
        {/* <ModalApproveOrReject
          isOpen={modalConfirm}
          header={`${approveOrReject} information`}
          message={`Are you sure you want to ${approveOrReject} Tax Implication Rule ${data_detail?.name} - ${data_detail_tax_implication_rule?.documentNumber}?`}
          width={1000}
          handleCancel={handleCloseModalApproveReject}
          footer={
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent
                type={"default"}
                onClick={handleCloseModalApproveReject}
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                form={"formApproveRejcet"}
                type={"submit"}
                htmlType={"submit"}
                border={false}
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <Form form={form} name="formApproveRejcet" layout={"vertical"} onFinish={handleConfirm}>
            <Form.Item
              label={"Remark"}
              name={"remark"}
              rules={[{ message: requiredMessage("Remark"), required: true }]}
            >
              <InputComponent
                rows={1}
                placeholder="Type your remark"
                type="textarea"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </Form.Item>
          </Form>
        </ModalApproveOrReject> */}

        <ModalApproveOrReject
          isOpen={modalConfirm}
          handleCloseModal={handleCloseModalApproveReject}
          onFinish={handleConfirm}
          header={approveOrReject}
          menu={"Tax Implciation Rule"}
          named={`${data_detail?.name} - ${data_detail_tax_implication_rule?.documentNumber}`}
          // customMessage={`Are you sure you want to ${approveOrReject} Late Charge Rule with document number ${data_detail_tax_implication_rule?.documentNumber}?`}
          approveOrReject={approveOrReject}
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
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your data was not ${approveOrReject === "Approve" ? "approved" : "rejected"
              } ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>

      </Spin>
    </LayoutMenu>
  )
}

export default DetailTaxImplicationRule