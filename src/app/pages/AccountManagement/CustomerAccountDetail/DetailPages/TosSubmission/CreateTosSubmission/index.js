import React, { useEffect, useState, useRef } from "react";
import { Form, Steps, Button, Spin } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LeftCircleOutlined,
  RightCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";

import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import BaseContainer from "../../../../../../../components/BaseContainer";
import LayoutMenu from "../../../../../../../components/SidebarMenu/LayoutMenu";
import HeaderDetail from "../../../HeaderDetail";
import TosInformation from "./TosInformation";
import BreadCrumbAdvanced from "../../../../../../../components/BreadCrumbAdvanced";
import SVGIcon from "../../../../../../../assets/Icon/index";
import ApprovalSectionForm from "../../../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import AttachmentSectionForm from "../../../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import { useDispatch, useSelector } from "react-redux";
import {
  createTosSubmissionBody,
  getDetailTosSubmission,
  getListAppHier,
  getListAppHierDetail,
  getListCategory,
  updateTosSubmissionBody,
  validateOverlapTos,
} from "../../../../../../../redux/slices/account_management/detailAccount/tosSubmissionSlice";
import moment from "moment";
import { bytesConverter } from "../../../../../../../utils/bytesConverter";
import ModalBack from "../../../../../../../components/Modal/ModalBack";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import ContentModalConfirm from "./ContentModalConfirm";
import { dateFormatting } from "../../../../../../../utils";
import accountManagementService from "../../../../../../../redux/services/account_management/accountManagementService";
import { useCallback } from "react";
import { ModalError } from "../../../../../../../components/Modal/ModalPopUp";
import ButtonComponent from "../../../../../../../components/ButtonComponent";

const routes = (item) => {
  return [
    {
      path: "",
      breadcrumbName: "Account Management",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD,
      breadcrumbName: "Account - Standard",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD,
      breadcrumbName: "Detail Account",
      state: {
        idAccount: item.idAccount,
      },
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_AGREEMENT,
      breadcrumbName: "Detail Service Agreement",
      state: {
        idSA: item.idSA,
        idAccount: item.idAccount,
        idCustomer: item.idCustomer,
        type: item.type,
      },
    },
    {
      path: "",
      breadcrumbName: "Create Term Of Service",
    },
  ];
};

const CreateTosSubmission = ({ typeForm }) => {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const [modalBack, setModalBack] = useState(false);
  const [current, setCurrent] = useState(0);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [typeSubmit, setTypeSubmit] = useState(1);
  const [form] = Form.useForm();
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [tosSubmissionObj, setTosSubmissionObj] = useState({});
  const [dataDetailTosSubmission, setDatatDetailTosSubmission] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [editDetail, setEditDetail] = useState(true);
  const [modalValidateOverlap, setModalValidateOverlap] = useState(false);
  const [messageValidateOverlap, setMessageValidateOverlap] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const {
    idAccount,
    idCustomer,
    type,
    id,
    idSA,
    saMainStartDate,
    saMainEndDate,
  } = location?.state || {};
  const {
    loading = false,
    dataListAppHierIdForm = [],
    dataListAppHierDetailForm = [],
    dataDetail = {},
    dataOverlap = {},
  } = useSelector((state) => state.tosSubmission);

  const isLoading = loading || loadingForm;

  const asserData = useCallback(
    (dataDetail) => {
      const approvalHierarchy = dataDetail.appHierId || 0;
      setSelectedHierarchy(approvalHierarchy);
      const body = {
        tosId: dataDetail?.saTosId,
        tosName: dataDetail?.saTosName,
        startDate: dataDetail?.startDate
          ? moment(dataDetail.startDate)
          : undefined,
        endDate: dataDetail?.endDate ? moment(dataDetail.endDate) : undefined,
        remark: dataDetail?.remark,
        approvalHierarchy,
      };
      setDatatDetailTosSubmission(
        (dataDetail?.tosSubmissionDetail || []).map((item) => {
          return {
            key: item.id,
            id: item.id,
            attribute:
              item?.attribute && item?.attributeId
                ? {
                    label: item?.attribute,
                    value: item?.attributeId,
                  }
                : null,
            value: parseInt(item?.value || ""),
            unit:
              item?.unit && item?.unitId
                ? {
                    label: item?.unit,
                    value: item?.unitId,
                  }
                : null,
            fromItem:
              item?.fromItem && item?.fromItemId
                ? {
                    label: item?.fromItem,
                    value: item?.fromItemId,
                  }
                : null,
          };
        }),
      );
      setTosSubmissionObj(body);
      form.setFieldsValue(body);
      setListDataAttachment(
        (dataDetail?.mattachments || []).map((attachData, index) => ({
          ...attachData,
          key: index + 1,
          fileSize: bytesConverter(attachData.fileSize || 0),
          dataType: "exist",
        })),
      );
    },
    [form],
  );

  useEffect(() => {
    if (typeForm === "update" && dataDetail?.saTosSubmissionId) {
      asserData(dataDetail);
    }
  }, [typeForm, dataDetail, asserData]);

  useEffect(() => {
    if (typeForm === "update" && id) {
      dispatch(getDetailTosSubmission({ id }));
    }
  }, [dispatch, typeForm, id]);

  useEffect(() => {
    const temp = dataDetailTosSubmission.some(
      (item) => item?.attribute?.value === 112,
    );
    setEditDetail(!!temp);
  }, [dataDetailTosSubmission]);

  useEffect(() => {
    dispatch(getListAppHier());
  }, [dispatch]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getListAppHierDetail({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  const handleTosSubmissionObj = (e, type) => {
    let result;
    if (type === "remark") {
      result = e.target.value;
    } else {
      result = e;
    }
    setTosSubmissionObj((prevState) => ({
      ...prevState,
      [type]: result,
    }));
    return result;
  };

  const steps = [
    {
      title: "TOS Submission Information",
      content: (
        <TosInformation
          idSA={idSA}
          editDetail={editDetail}
          type={typeForm}
          dataDetail={dataDetailTosSubmission}
          updateDataDetail={setDatatDetailTosSubmission}
          tosSubmissionObj={tosSubmissionObj}
          setTosSubmissionObj={setTosSubmissionObj}
          updateTosSubmission={handleTosSubmissionObj}
          saMainStartDate={saMainStartDate}
          saMainEndDate={saMainEndDate}
          form={form}
        />
      ),
      disabled:
        dataDetailTosSubmission.length === 0 ||
        (editDetail && dataDetailTosSubmission.some((item) => !item.value)) ||
        !tosSubmissionObj.startDate ||
        !tosSubmissionObj.endDate ||
        !tosSubmissionObj.tosId ||
        !tosSubmissionObj.tosName,
    },
    {
      title: "Approval",
      content: (
        <BaseContainer header={"APPROVAL HIERARCHY"}>
          <ApprovalSectionForm
            dataTable={dataListAppHierDetailForm}
            dataOption={dataListAppHierIdForm}
            selectedHierarchy={selectedHierarchy}
            updateSelectedHierarchy={setSelectedHierarchy}
          />
        </BaseContainer>
      ),
      disabled: !selectedHierarchy,
    },
    {
      title: "Attachment",
      content: (
        <BaseContainer header={"ATTACHMENT"}>
          <AttachmentSectionForm
            type={type}
            data={listDataAttachment}
            updateData={setListDataAttachment}
            typeSelector="tosSubmission"
            dispatch={dispatch}
            getAPICategory={getListCategory}
            mandatory={true}
          />
        </BaseContainer>
      ),
      disabled: false,
    },
  ];

  const next = () => {
    if (current === 0) {
      const body = {
        saId: idSA,
        saTosId: tosSubmissionObj.tosId,
        startDate: moment(tosSubmissionObj.startDate).format(
          dateFormatting.dateCapital,
        ),
        endDate: moment(tosSubmissionObj.endDate).format(
          dateFormatting.dateCapital,
        ),
      };
      dispatch(validateOverlapTos(body))
        .unwrap()
        .then((data) => {
          data.success === true
            ? setCurrent(current + 1)
            : setCurrent((current = 0));
        })
        .catch((er) => {
          console.log(er);
          setMessageValidateOverlap(er.data.message);
          setModalValidateOverlap(true);
          er.data.succes === false && setCurrent((current = 0));
        });
    } else {
      setCurrent(current + 1);
    }
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };
  const handleButtonNext = () => {
    next();
    scrollRightHandler();
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const scrollLeftHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 250;
    }
  };

  const preventSubmit = () => {
    let count = 0;
    const length = steps.length;
    steps.forEach((item) => {
      if (!item.disabled) {
        count++;
      }
    });
    return count !== length;
  };

  const handleSubmitForm = (value) => {
    setModalConfirm(true);
  };
  const handleCancelModalConfirm = () => {
    setModalConfirm(false);
  };
  const handleProcessModalConfirm = () => {
    const body = {
      id: typeForm === "update" ? id : undefined,
      saId: idSA,
      saTosId: tosSubmissionObj?.tosId,
      description: tosSubmissionObj?.remark,
      startDate: tosSubmissionObj?.startDate
        ? tosSubmissionObj?.startDate.format(dateFormatting.date)
        : "",
      endDate: tosSubmissionObj?.endDate
        ? tosSubmissionObj?.endDate.format(dateFormatting.date)
        : "",
      tosSubmissionDetailDtoList: dataDetailTosSubmission.map((item) => {
        return {
          id: item?.id,
          attribute: item?.attribute?.value || null,
          value: item?.value,
          unit: item?.unit?.value || null,
          fromItem: item?.fromItem?.value || null,
        };
      }),
      appHierId: selectedHierarchy,
      flag: typeSubmit, //1=draft, 2=submit
    };
    if (typeForm === "create") {
      dispatch(createTosSubmissionBody(body))
        .unwrap()
        .then(async (data) => {
          const idTosSubmission = data.id;
          setLoadingForm(true);
          for (let element of listDataAttachment) {
            const body = {
              files: element.file,
              category: element.fileCategoryId,
            };
            const response = await accountManagementService.uploadAttachment(
              `/v1/dbs/api/tossubmission/uploadAttachment/${idTosSubmission}`,
              body,
            );
          }
          setLoadingForm(false);
          handleCancelModalConfirm();
          handleClear();
        })
        .catch((error) => {
          if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
            const message =
              error?.response?.data?.message ||
              error?.message ||
              error?.toString();
            setBodyError({ message });
            setModalError(true);
          }
        });
    } else {
      dispatch(updateTosSubmissionBody(body))
        .unwrap()
        .then(async () => {
          setLoadingForm(true);
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist",
          );
          for (let element of filterDataAttach) {
            const body = {
              files: element.file,
              category: element.fileCategoryId,
            };
            const response = await accountManagementService.uploadAttachment(
              `/v1/dbs/api/tossubmission/uploadAttachment/${id}`,
              body,
            );
          }
          setLoadingForm(false);
          handleCancelModalConfirm();
          form.resetFields();
          setSelectedHierarchy(undefined);
          setDatatDetailTosSubmission([]);
          setListDataAttachment([]);
          setTosSubmissionObj({});
        })
        .catch((error) => {
          if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
            const message =
              error?.response?.data?.message ||
              error?.message ||
              error?.toString();
            setBodyError({ message });
            setModalError(true);
          }
        });
    }
  };
  const handleClear = () => {
    if (typeForm === "create") {
      form.resetFields();
      setTosSubmissionObj({});
      setListDataAttachment([]);
      setSelectedHierarchy(undefined);
      setDatatDetailTosSubmission([]);
    } else {
      asserData(dataDetail);
    }
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
        <BreadCrumbAdvanced routes={routes(location?.state)} />
        <div className="flex flex-col w-full gap-4">
          <HeaderDetail
            dispatch={dispatch}
            idAccount={idAccount}
            idCustomer={idCustomer}
            type={type}
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
          />
        </div>
        <div className="flex flex-row gap-x-6 justify-center pt-10">
          <span className="mt-[10px]">
            <LeftCircleOutlined
              style={{ fontSize: "24px", color: "#0075bf" }}
              onClick={scrollLeftHandler}
            />
          </span>
          <div ref={containerRef} className="overflow-x-scroll scrollStepsCstm">
            <Steps current={current} items={items} labelPlacement="vertical" />
          </div>
          <span className="mt-[10px]">
            <RightCircleOutlined
              style={{ fontSize: "24px", color: "#0075bf" }}
              onClick={scrollRightHandler}
            />
          </span>
        </div>
        <Form
          id="tosSubmissionForm"
          form={form}
          layout={"vertical"}
          onFinish={handleSubmitForm}
        >
          {/* Steps Contents */}

          <div className="steps-content">{steps[current].content}</div>

          {/* Section Action Steps */}
          <div className="steps-action my-8 flex w-full justify-between gap-x-2">
            <ButtonComponent
              type={"submit"}
              icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
              onClick={() => {
                setModalBack(true);
              }}
            >
              Back
            </ButtonComponent>
            <div className="flex w-full justify-end gap-x-4">
              <ButtonComponent
                icon={
                  <SVGIcon
                    name={
                      typeForm === "update"
                        ? `IconButtonReset`
                        : `IconButtonClear`
                    }
                    width={24}
                  />
                }
                type="submit"
                onClick={handleClear}
              >
                {typeForm === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              {current > 0 && (
                <ButtonComponent
                  onClick={() => {
                    prev();
                    scrollLeftHandler();
                  }}
                  type={"submit"}
                  icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
                >
                  Previous
                </ButtonComponent>
              )}
              {current < steps.length - 1 && (
                <Button
                  onClick={handleButtonNext}
                  type="primary"
                  className="ant-btn ant-btn-submit flex w-full justify-center"
                  disabled={steps[current].disabled}
                >
                  <span className="p-1 text-[18px] text-center">Next</span>
                  <RightOutlined
                    style={{
                      justifyItems: "center",
                      fontSize: "18px",
                      color: "#fff",
                    }}
                  />
                </Button>
              )}
              {current === steps.length - 1 ? (
                <>
                  <ButtonComponent
                    disabled={preventSubmit()}
                    form="tosSubmissionForm"
                    htmlType="submit"
                    type="submit"
                    onClick={() => setTypeSubmit(1)}
                  >
                    Save as Draft
                  </ButtonComponent>
                  <ButtonComponent
                    disabled={preventSubmit()}
                    form="tosSubmissionForm"
                    htmlType="submit"
                    type="submit"
                    onClick={() => setTypeSubmit(2)}
                  >
                    Save & Submit
                  </ButtonComponent>
                </>
              ) : null}
            </div>
          </div>
        </Form>
        {/** Modal Confirm */}
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
          {modalConfirm ? (
            <ContentModalConfirm
              dataTosSubmissionObj={tosSubmissionObj}
              selectedHierarchy={selectedHierarchy}
              listDataAttachment={listDataAttachment}
              listDataAppHierDetail={dataListAppHierDetailForm}
              dataDetailTosSubmission={dataDetailTosSubmission}
              listApproval={dataListAppHierIdForm}
            />
          ) : null}
        </ModalCustom>
        {/** Modal Back */}
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
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your data was not ${
              typeForm === "update" ? "updated" : "created"
            }. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>

        <ModalError
          isOpen={modalValidateOverlap}
          handleOk={() => setModalValidateOverlap(false)}
          handleCancel={() => setModalValidateOverlap(false)}
          customText={"Ok"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{messageValidateOverlap}</p>
          </div>
        </ModalError>
      </Spin>
    </LayoutMenu>
  );
};

export default CreateTosSubmission;
