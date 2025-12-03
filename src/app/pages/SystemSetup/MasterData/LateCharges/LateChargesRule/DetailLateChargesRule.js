import React, { useEffect, useMemo, useState } from "react";
import LayoutMenu from "../../../../../../components/SidebarMenu/LayoutMenu";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Spin } from "antd";
import {
  approvalCreateLateChargeRule,
  approvalInactiveLateChargeRule,
  getDetailDraftLateChargeRule,
  getDetailLateCharge,
  getDetailLateChargeRule,
} from "../../../../../../redux/slices/account_management/MasterData/late_charges";
import BreadCrumbAdvanced from "../../../../../../components/BreadCrumbAdvanced";
import moment from "moment";
import { dateFormatting } from "../../../../../../utils";
import BaseContainer from "../../../../../../components/BaseContainer";
import RadioTabs from "../../../../../../components/RadioTabs";
import DetailText from "../../../../../../components/DetailText";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import SVGIcon from "../../../../../../assets/Icon/index";
import { bytesConverter } from "../../../../../../utils/bytesConverter";
import LayoutDetailLateChargeRule from "./LayoutDetailLateChargeRule";
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
      breadcrumbName: "Detail Late Charge Rule",
    },
  ];
};

const type = "detail";
const DetailLateChargesRule = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id, lateChargeId } = location?.state || {};
  const [form] = Form.useForm();
  const [listDataDetailFormula, setListDataDetailFormula] = useState([]);
  const [listDataDetailCondition, setListDataDetailCondition] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [listDataDraftAttachment, setListDataDraftAttachment] = useState([]);
  const [listSectionInfo, setListSectionInfo] = useState([
    { value: "Late Charge Rule" },
    { value: "Attachment" },
  ]);
  const [typeLateChargeInfo, setTypeLateChargeInfo] = useState(
    listSectionInfo[0].value,
  );
  const {
    data_detail = {},
    data_detail_late_charge_rule = {},
    data_detail_draft_late_charge_rule = {},
    loading = false,
  } = useSelector((state) => state.late_charge);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");
  const [remark, setRemark] = useState("");
  const [dataLogInformation, setDataLogInformation] = useState({});
  const [dataLateChargeRule, setDataLateChargeRule] = useState({});
  const [dataDraftLateChargeRule, setDataDraftLateChargeRule] = useState({});
  const [dataLateCharge, setDataLateCharge] = useState({});
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
    [bodyApproval],
  );

  useEffect(() => {
    if (lateChargeId) {
      dispatch(getDetailLateCharge(lateChargeId));
    }
  }, [dispatch, lateChargeId]);

  useEffect(() => {
    if (id) {
      dispatch(getDetailDraftLateChargeRule(id));
      dispatch(getDetailLateChargeRule(id));
    }
  }, [dispatch, id]);

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
      id &&
      data_detail_draft_late_charge_rule?.lateChargeRuleId === id &&
      data_detail_draft_late_charge_rule?.lateChargeRuleId ===
        data_detail_late_charge_rule?.lateChargeRuleId &&
      data_detail_late_charge_rule &&
      (!data_detail_late_charge_rule.approvalType ||
        data_detail_late_charge_rule.approvalType !==
          "INACTIVE_LATE_CHARGE_RULE")
    ) {
      const obj = {
        description: data_detail_draft_late_charge_rule.description,
      };
      setDataDraftLateChargeRule(obj);
      setListDataDraftAttachment(
        (data_detail_draft_late_charge_rule?.attachments || []).map(
          (attachData) => ({
            ...attachData,
            createdDate: attachData.createdDate
              ? moment(attachData.createdDate).format(dateFormatting.dateTime)
              : "",
            fileSize: bytesConverter(attachData.fileSize || 0),
            dataType: "exist",
          }),
        ),
      );
      setListSectionInfo([
        { value: "Late Charge Rule" },
        { value: "Draft" },
        { value: "Attachment" },
      ]);
    }
  }, [id, data_detail_late_charge_rule, data_detail_draft_late_charge_rule]);

  useEffect(() => {
    if (data_detail_late_charge_rule?.lateChargeRuleId === id) {
      const indexStatus = data_detail_late_charge_rule.status;
      const status = indexStatus
        ? indexStatus.charAt(0).toUpperCase() +
          indexStatus.slice(1).toLowerCase()
        : indexStatus;
      const indexStatusApproval = data_detail_late_charge_rule.approvalStatus;
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
        lateChargeRuleId: data_detail_late_charge_rule?.lateChargeRuleId,
        createdDate: moment(data_detail_late_charge_rule.createdDate).format(
          dateFormatting.dateTime,
        ),
        createdBy: data_detail_late_charge_rule.createdBy,
        updatedDate: data_detail_late_charge_rule.updatedDate
          ? moment(data_detail_late_charge_rule.updatedDate).format(
              dateFormatting.dateTime,
            )
          : "",
        updatedBy: data_detail_late_charge_rule.updatedBy,
      });
      const obj = {
        status,
        approvalStatus,
        description: data_detail_late_charge_rule.description,
        startDate: data_detail_late_charge_rule.startDate,
        endDate: data_detail_late_charge_rule.endDate,
        maxAmount: data_detail_late_charge_rule.maxAmount,
        documentNumber: data_detail_late_charge_rule.documentNumber,
      };
      setDataLateChargeRule(obj);
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
            value: item.value,
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
            value: item.value,
            typeData: "exist",
          }),
        ),
      );
      setBodyApproval({
        isApprover: data_detail_late_charge_rule.isApprover,
        tappId: data_detail_late_charge_rule.tAppId,
        approvalDetail: data_detail_late_charge_rule.approvalDetail,
        approvalType: data_detail_late_charge_rule.approvalType,
      });
    }
  }, [id, data_detail_late_charge_rule]);

  const handleLateChargeRuleInfo = (e) => {
    const temp = e.target.value;
    setTypeLateChargeInfo(temp);
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
      lateChargeRuleId: id,
      description: formValue.remark,
      approvalId: bodyApproval.tappId,
      action: approveOrReject === "Approve" ? "APPROVE" : "REJECT",
    };

    if (bodyApproval.approvalType === "INACTIVE_LATE_CHARGE_RULE") {
      dispatch(approvalInactiveLateChargeRule(obj))
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
      dispatch(approvalCreateLateChargeRule(obj))
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
        <BreadCrumbAdvanced routes={routes(lateChargeId)} />
        <div className="flex flex-col">
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
          {bodyApproval.isApprover &&
          bodyApproval.approvalType === "INACTIVE_LATE_CHARGE_RULE" ? (
            <BaseContainer header={`INACTIVE REQUEST INFORMATION`}>
              <div className="grid grid-cols-4 w-full">
                <DetailText label={"Requested Date"}>
                  {bodyApproval.approvalDetail.requestedDate
                    ? moment(bodyApproval.approvalDetail.requestedDate).format(
                        dateFormatting.dateTime,
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
          <div className="my-4">
            <RadioTabs
              data={listSectionInfo}
              onChange={handleLateChargeRuleInfo}
              currentPosition={typeLateChargeInfo}
            />
          </div>
          {typeLateChargeInfo === "Late Charge Rule" && (
            <LayoutDetailLateChargeRule
              key={"detail"}
              dataLateChargeRule={dataLateChargeRule}
              dispatch={dispatch}
              listDataAttachment={listDataAttachment}
              setListDataAttachment={setListDataAttachment}
              listDataDetailCondition={listDataDetailCondition}
              setListDataDetailCondition={setListDataDetailCondition}
              listDataDetailFormula={listDataDetailFormula}
              setListDataDetailFormula={setListDataDetailFormula}
              type={type}
              dataLogInformation={dataLogInformation}
              description={dataLateChargeRule.description || ""}
            />
          )}
          {typeLateChargeInfo === "Draft" && (
            <LayoutDetailLateChargeRule
              key={"draft"}
              dataLateChargeRule={dataLateChargeRule}
              dispatch={dispatch}
              listDataAttachment={listDataDraftAttachment}
              setListDataAttachment={setListDataDraftAttachment}
              listDataDetailCondition={listDataDetailCondition}
              setListDataDetailCondition={setListDataDetailCondition}
              listDataDetailFormula={listDataDetailFormula}
              setListDataDetailFormula={setListDataDetailFormula}
              type={type}
              dataLogInformation={dataLogInformation}
              description={dataDraftLateChargeRule.description || ""}
            />
          )}
          {typeLateChargeInfo === "Attachment" && (
            <AttachmentDetail
              type={type}
              listDataAttachment={listDataAttachment}
              updateData={setListDataAttachment}
              dispatch={dispatch}
            />
          )}

          <div
            className={`flex w-full${
              showButtonApproval ? " justify-between" : ""
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
          // message={`Are you sure you want to ${approveOrReject} late charge rule ${data_detail?.lateChargeName} - ${data_detail_late_charge_rule?.documentNumber}?`}
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
          <Form form={form} name="formApproveRejcet" onFinish={handleConfirm} layout="vertical">
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
          approveOrReject={approveOrReject}
          menu={"Late Charge Rule"}
          named={`${data_detail?.lateChargeName} - ${data_detail_late_charge_rule?.documentNumber}`}
          // customMessage={`Are you sure you want to ${approveOrReject} Late Charge Rule with document number ${data_detail_late_charge_rule?.documentNumber}?`}
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
            <p className="pl-[70px]">{`Your data was not ${
              approveOrReject === "Approve" ? "approved" : "rejected"
            } ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </LayoutMenu>
  );
};

export default DetailLateChargesRule;
