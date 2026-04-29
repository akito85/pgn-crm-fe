import { LeftOutlined } from "@ant-design/icons";
import {
  ModalError,
} from "../../../../../../components/Modal/ModalPopUp";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { Form, Spin, Tabs } from "antd";
import RadioTabs from "../../../../../../components/RadioTabs";
import BreadCrumb from "../../../../../../components/BreadCrumb";
import { useCallback, useEffect, useState } from "react";
import { RBI_ROUTES } from "../../../../../../routes/rating_billing/rbi_routes";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import SVGIcon from "../../../../../../assets/Icon/index";
import BaseContainer from "../../../../../../components/BaseContainer";
import CardContainer from "../../../../../../components/CardContainer";
import CollapsibleContainer from "../../../../../../components/CollapsibleContainer";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";
import { dateFormatting } from "../../../../../../utils";
import GeneralTemplateDetailForm from "../Form/GeneralTemplateDetailForm";
import GeneralTempalteAttachment from "../Form/GeneralTemplateAttachment";
import {
  approveActivateGeneralTemplate,
  approveGeneralTemplate,
  approveInactiveGeneralTemplate,
  getDetailDraftGeneralTemplate,
  getDetailGeneralTemplate,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/general_template";
import GeneralTemplateDetailDraft from "../Form/GeneralTemplateDetailDraft";
import moment from "moment";
import DetailText from "../../../../../../components/DetailText";
import { renderDateTime } from "../Utils/Utils";

const GeneralTemplateDetail = () => {
  // Selector
  const { data_detail, data_detail_draft, loading } = useSelector(
    (state) => state.general_template
  );

  //declare
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const id = location.state?.id;

  useEffect(() => {
    if (id) {
      dispatch(getDetailGeneralTemplate(id));
      dispatch(getDetailDraftGeneralTemplate(id));
    }
  }, [dispatch, id]);

  //state data
  const [dataAttachment, setDataAttachment] = useState([]);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [typeSubmit, setTypeSubmit] = useState(false);

  //state modal
  const [modalBack, setModalBack] = useState(false);
  const [modalError, setModalError] = useState(false);

  //state retry
  // const [modalRetry, setModalRetry] = useState(false);
  const [bodyError, setBodyError] = useState({});

  const [generalTemplateDetailPage, setGeneralTemplateDetailPage] = useState([
    { value: "General Template" },
    // { value: "Draft" }, //comment this one
    { value: "Attachment" },
  ]);

  //state header
  const [tabHeader, setTabHeader] = useState(
    generalTemplateDetailPage[0].value
  );

  const handleSetData = useCallback((data) => {
    setDataAttachment([
      ...(data?.attachment || []).map((item) => {
        return {
          ...item,
          createdDate: moment(item.createdDate).format(dateFormatting.date),
          // uploadBy: item.createdBy,
          // uploadDate: moment(item.createdDate).format(dateFormatting.date),
          // fileSize: bytesConverter(item.fileSize || 0),
          dataType: "exist",
        };
      }),
    ]);
  }, []);

  //use Effect
  useEffect(() => {
    if (id && data_detail && id === data_detail.templateId) {
      handleSetData(data_detail);
      if (
        data_detail_draft &&
        data_detail_draft.templateId &&
        data_detail.templateId === data_detail_draft.templateId &&
        (data_detail?.statusApproval !== "APPROVED")
      ) {
        setGeneralTemplateDetailPage([
          { value: "General Template" },
          { value: "Draft" },
          { value: "Attachment" },
        ]);
      } else {
        setGeneralTemplateDetailPage([
          { value: "General Template" },
          // { value: "Draft" },
          { value: "Attachment" },
        ]);
      }
    }
  }, [data_detail, data_detail_draft, id, handleSetData]);

  const handleTabHeader = (key) => {
    setTabHeader(key);
  };

  const renderSection = () => {
    switch (tabHeader) {
      case generalTemplateDetailPage[0].value:
        return (
          <GeneralTemplateDetailForm
            data={data_detail}
            type={true}
            dispatch={dispatch}
            data_templateType={
              data_detail?.fileTemplate
                ? [
                  {
                    ...data_detail?.fileTemplate,
                    dataType: "exist",
                  },
                ]
                : []
            }
          />
        );
      case "Draft":
        return (
          <GeneralTemplateDetailDraft
            data={{
              ...data_detail_draft,
              createdDate: data_detail?.createdDate,
              updatedDate: data_detail?.updatedDate,
              createdBy: data_detail?.createdBy,
              updatedBy: data_detail?.updatedBy,
              status: data_detail?.status,
              statusApproval: data_detail?.statusApproval,
            }}
            status={data_detail?.status}
            dispatch={dispatch}
            data_templateType={
              data_detail_draft?.fileTemplate
                ? [
                  {
                    ...data_detail_draft?.fileTemplate,
                    dataType: "exist",
                  },
                ]
                : []
            }
          />
        );
      case "Attachment":
        return (
          <CollapsibleContainer header={"ATTACHMENT INFORMATION"}>
            <GeneralTempalteAttachment
              dispatch={dispatch}
              dataAttachment={dataAttachment}
              setDataAttachment={setDataAttachment}
              type={"detail"}
            />
          </CollapsibleContainer>
        );
      default:
        return <></>;
    }
  };

  const onFinish = (e, handleClear = () => { }) => {
    const approvalType =
      data_detail?.approvalType ||
      data_detail?.inactiveApproval?.approvalType ||
      data_detail?.activateApproval?.approvalType ||
      data_detail?.activatedApproval?.approvalType;

    const data = {
      templateId: id,
      description: e?.remark,
      apphierId: data_detail?.tappId ? data_detail?.tappId : null,
      action: typeSubmit ? "APPROVE" : "REJECT",
    };

    const approveAction =
      approvalType === "ACTIVATED_GENERAL_TEMPLATE"
        ? approveActivateGeneralTemplate(data)
        : approvalType === "INACTIVE_GENERAL_TEMPLATE" ||
          data_detail?.inactiveApproval?.isInactive
          ? approveInactiveGeneralTemplate(data)
          : approveGeneralTemplate(data);

    dispatch(
      approveAction
    )
      .unwrap()
      .then(async (data) => {
        handleClear();
        handleCloseModalApproveReject();
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
    onFinish(bodyError.value);
    setModalError(false);
    setBodyError({});
  };

  const handleCloseModalApproveReject = () => {
    setTypeSubmit(false);
    setModalConfirm(false);
  };

  const handleModalConfirmation = (type) => {
    setModalConfirm(true);
    setTypeSubmit(type);
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
      path: RBI_ROUTES.GENEREAL_TEMPLATE_VIEW,
      breadcrumbName: "General Template",
    },
    {
      path: "",
      breadcrumbName: "Detail General Template",
    },
  ];

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <CardContainer
          header={"GENERAL TEMPLATE DETAIL"}
          type={"tabs"}
          element={
            <>
              {data_detail?.inactiveApproval?.isInactive &&
              data_detail?.isApprover ? (
                <div className="mb-3">
                  <BaseContainer header={"Inactive Request Information"}>
                    <div className="w-full grid grid-cols-4 gap-5">
                      <DetailText label="Requested Date">
                        {renderDateTime(data_detail?.inactiveApproval?.requestDate)}
                      </DetailText>
                      <DetailText label="Requested By">
                        {data_detail?.inactiveApproval?.requestBy}
                      </DetailText>
                      <DetailText label="Remark">
                        {data_detail?.inactiveApproval?.remark}
                      </DetailText>
                    </div>
                  </BaseContainer>
                </div>
              ) : null}
              {(data_detail?.isApprover || data_detail?.inactiveApproval?.isInactive) &&
                (data_detail?.approvalType === "INACTIVE_GENERAL_TEMPLATE" ||
                  data_detail?.inactiveApproval?.isInactive) ? (
                <div className="mb-3">
                  <BaseContainer header={"Inactive Request Information"}>
                    <div className="w-full grid grid-cols-4 gap-5">
                      <DetailText label="Requested Date">
                        {renderDateTime(data_detail?.inactiveApproval?.requestDate)}
                      </DetailText>
                      <DetailText label="Requested By">
                        {data_detail?.inactiveApproval?.requestBy}
                      </DetailText>
                      <DetailText label="Remark">
                        {data_detail?.inactiveApproval?.remark}
                      </DetailText>
                    </div>
                  </BaseContainer>
                </div>
              ) : null}

              {(data_detail?.isApprover ||
                data_detail?.activateApproval?.isActivated ||
                data_detail?.activatedApproval?.isActivated) &&
                data_detail?.approvalType === "ACTIVATED_GENERAL_TEMPLATE" ? (
                <div className="mb-3">
                  <BaseContainer header={"Activate Request Information"}>
                    <div className="w-full grid grid-cols-4 gap-5">
                      <DetailText label="Requested Date">
                        {renderDateTime(
                          data_detail?.activateApproval?.requestDate ||
                          data_detail?.activatedApproval?.requestDate
                        )}
                      </DetailText>
                      <DetailText label="Requested By">
                        {data_detail?.activateApproval?.requestBy ||
                          data_detail?.activatedApproval?.requestBy}
                      </DetailText>
                      <DetailText label="Remark">
                        {data_detail?.activateApproval?.remark ||
                          data_detail?.activatedApproval?.remark}
                      </DetailText>
                    </div>
                  </BaseContainer>
                </div>
              ) : null}
              <Tabs
                activeKey={tabHeader}
                onChange={handleTabHeader}
                items={generalTemplateDetailPage.map((item) => ({
                  key: item.value,
                  label: item.value,
                  children: null,
                }))}
                className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-nav]:my-0 [&_.ant-tabs-nav]:pt-0 -mt-0"
              />
              <div className={"w-full [&>div]:!mt-[2px]"}>{renderSection()}</div>
            </>
          }
        />

        <CardContainer header={"HISTORY LOG INFORMATION"}>
          <div className="w-full grid grid-cols-5 gap-5">
            <DetailText label="Record ID">{data_detail?.templateId}</DetailText>
            <DetailText label="Created Date">
              {renderDateTime(data_detail?.createdDate)}
            </DetailText>
            <DetailText label="Created By">{data_detail?.createdBy}</DetailText>
            <DetailText label="Update Date">
              {renderDateTime(data_detail?.updatedDate)}
            </DetailText>
            <DetailText label="Updated By">{data_detail?.updatedBy}</DetailText>
          </div>
        </CardContainer>

        <div className={"w-full flex justify-between mt-10"}>
          <div className=" flex">
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
          </div>

          {/* btn approve or reject shown */}
          {data_detail?.isApprover &&
            (data_detail?.statusApproval === "WAITING_APPROVAL" ||
              data_detail?.statusApproval === "WAITING APPROVAL") ? (
            <div className="flex align-middle gap-3">
              <ButtonComponent
                type="reject"
                onClick={() => handleModalConfirmation(false)}
              >
                Reject
              </ButtonComponent>
              <ButtonComponent
                type="approve"
                onClick={() => handleModalConfirmation(true)}
              >
                Approve
              </ButtonComponent>
            </div>
          ) : null}
        </div>

        {/* modal confirm */}
        {modalConfirm ? (
          <ModalApproveOrReject
            isOpen={modalConfirm}
            handleCloseModal={handleCloseModalApproveReject}
            onFinish={onFinish}
            header={`${typeSubmit ? "Approved" : "Reject"}`}
            approveOrReject={typeSubmit ? "Approved" : "Reject"}
            menu={"General Template"}
            named={`${data_detail?.templateName}`}
          // message={`Are you sure you want to ${
          //   typeSubmit ? "Approved" : "Reject"
          // } this General Template with the name ${data_detail.templateName}?`}
          // width={1000}
          // handleCloseCancel={handleCloseModalApproveReject}
          // footer={
          //   <div className={"w-full flex justify-end gap-5"}>
          //     <ButtonComponent
          //       type={"default"}
          //       onClick={handleCloseModalApproveReject}
          //     >
          //       Cancel
          //     </ButtonComponent>
          //     <ButtonComponent
          //       form={"form"}
          //       type={"submit"}
          //       htmlType={"submit"}
          //       border={false}
          //     >
          //       Confirm
          //     </ButtonComponent>
          //   </div>
          // }
          />
          //   <Form
          //     id={"form"}
          //     layout={"vertical"}
          //     form={form}
          //     onFinish={onFinish}
          //   >
          //     <Form.Item
          //       name={"remark"}
          //       label={"Remark"}
          //       rules={[{ message: requiredMessage("Remark"), required: true }]}
          //     >
          //       <InputComponent
          //         rows={1}
          //         placeholder="Type your remark"
          //         type="textarea"
          //       />
          //     </Form.Item>
          //   </Form>
          // </ModalApproveOrReject>
        ) : null}

        {/* Modal Retry */}
        {modalError ? (
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
              <p className="pl-[70px]">{`${bodyError?.message}. Please try again.`}</p>
              <p className="pl-[70px]">Please try again.</p>
            </div>
          </ModalError>
        ) : null}
      </Spin>
    </>
  );
};

export default GeneralTemplateDetail;
