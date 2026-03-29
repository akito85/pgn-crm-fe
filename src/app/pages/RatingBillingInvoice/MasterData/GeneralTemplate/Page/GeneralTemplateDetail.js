import { LeftOutlined } from "@ant-design/icons";
import {
  ModalError,
} from "../../../../../../components/Modal/ModalPopUp";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { Form, Spin } from "antd";
import RadioTabs from "../../../../../../components/RadioTabs";
import BreadCrumb from "../../../../../../components/BreadCrumb";
import { useCallback, useEffect, useState } from "react";
import { RBI_ROUTES } from "../../../../../../routes/rating_billing/rbi_routes";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import SVGIcon from "../../../../../../assets/Icon/index";
import BaseContainer from "../../../../../../components/BaseContainer";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";
import { dateFormatting } from "../../../../../../utils";
import GeneralTemplateDetailForm from "../Form/GeneralTemplateDetailForm";
import GeneralTempalteAttachment from "../Form/GeneralTemplateAttachment";
import {
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

  const handleTabHeader = (e) => {
    setTabHeader(e.target.value);
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
          <BaseContainer header={"ATTACHMENT INFORMATION"}>
            <GeneralTempalteAttachment
              dispatch={dispatch}
              dataAttachment={dataAttachment}
              setDataAttachment={setDataAttachment}
              type={"detail"}
            />
          </BaseContainer>
        );
      default:
        return <></>;
    }
  };

  const onFinish = (e, handleClear = () => {}) => {
    const data = {
      templateId: id,
      description: e?.remark,
      apphierId: data_detail?.tappId ? data_detail?.tappId : null,
      action: typeSubmit ? "APPROVE" : "REJECT",
    };
    dispatch(
      data_detail?.inactiveApproval?.isInactive
        ? approveInactiveGeneralTemplate(data)
        : approveGeneralTemplate(data)
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
        {data_detail?.inactiveApproval?.isInactive &&
        data_detail?.isApprover ? (
          <div className="mt-5">
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
        <div className="mt-5">
          <RadioTabs
            data={generalTemplateDetailPage}
            onChange={handleTabHeader}
            currentPosition={tabHeader}
          />
        </div>
        <div className={"w-full"}>{renderSection()}</div>

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
