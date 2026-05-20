import React, { useEffect, useState, useRef } from "react";
import { Form, Steps, Spin } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LeftCircleOutlined,
  RightCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";

import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import HeaderDetail from "../../../HeaderDetail";
import TosInformation from "./TosInformation";
import BreadCrumbAdvanced from "../../../../../../../components/BreadCrumbAdvanced";
import SVGIcon from "../../../../../../../assets/Icon/index";
import ApprovalSectionForm from "../../../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import Attachment from "../../ServiceAgreement/CreateServiceAgreement/Attachment";
import { useDispatch, useSelector } from "react-redux";
import {
  createTosSubmissionBody,
  getDetailTosSubmission,
  getListAppHier,
  getListAppHierDetail,
  getListCategory,
  updateTosSubmissionBody,
  validateOverlapTos
} from "../../../../../../../redux/slices/account_management/detailAccount/tosSubmissionSlice";
import moment from "moment";
import { bytesConverter } from "../../../../../../../utils/bytesConverter";
import ModalBack from "../../../../../../../components/Modal/ModalBack";
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
      state:{
        idAccount: item.idAccount,
      }
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_AGREEMENT,
      breadcrumbName: "Detail Service Agreement",
      state:{
        idSA : item.idSA,
        idAccount : item.idAccount,
        idCustomer : item.idCustomer,
        type : item.type
      }
    },
    {
      path: "",
      breadcrumbName: "Create Term Of Service",
    },
  ]
}

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
  const [messageValidateOverlap, setMessageValidateOverlap] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { idAccount, idCustomer, type, id, idSA, saMainStartDate, saMainEndDate } = location?.state || {};
  const {
    loading = false,
    dataListAppHierIdForm = [],
    dataListAppHierDetailForm = [],
    dataDetail = {},
    dataOverlap= {}
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
        endDate: dataDetail?.endDate
          ? moment(dataDetail.endDate)
          : undefined,
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
        })
      );
      setTosSubmissionObj(body);
      form.setFieldsValue(body);
      setListDataAttachment(
        (dataDetail?.mattachments || []).map((attachData, index) => ({
          ...attachData,
          key: index + 1,
          fileSize: bytesConverter(attachData.fileSize || 0),
          dataType: "exist",
        }))
      );
    },
    [form]
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
      (item) => item?.attribute?.value === 112
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
        <ApprovalSectionForm
          dataTable={dataListAppHierDetailForm}
          dataOption={dataListAppHierIdForm}
          selectedHierarchy={selectedHierarchy}
          updateSelectedHierarchy={setSelectedHierarchy}
        />
      ),
      disabled: !selectedHierarchy,
    },
    {
      title: "Attachment",
      content: (
        <Attachment
          data={listDataAttachment}
          updateData={setListDataAttachment}
          type={typeForm}
        />
      ),
      disabled: false,
    },
  ];

  const next = useCallback(() => {
    if (current === 0) {
      const body = {
        saId: idSA,
        saTosId: tosSubmissionObj.tosId,
        startDate: moment(tosSubmissionObj.startDate).format(dateFormatting.dateCapital),
        endDate: moment(tosSubmissionObj.endDate).format(dateFormatting.dateCapital)
      };

      return dispatch(validateOverlapTos(body))
        .unwrap()
        .then((data) => {
          if (data.success === true) {
            setCurrent((prev) => prev + 1);
            return true;
          }

          setCurrent(0);
          return false;
        })
        .catch((error) => {
          setMessageValidateOverlap(error?.data?.message || "Failed validate overlap data");
          setModalValidateOverlap(true);
          setCurrent(0);
          return false;
        });
    }

    setCurrent((prev) => prev + 1);
    return Promise.resolve(true);
  }, [current, dispatch, idSA, tosSubmissionObj.endDate, tosSubmissionObj.startDate, tosSubmissionObj.tosId]);

  const handleSetCurrent = (targetStep) => {
    if (targetStep === current) {
      return;
    }

    if (targetStep < current) {
      setCurrent(targetStep);
      return;
    }

    if (targetStep !== current + 1 || steps[current].disabled) {
      return;
    }

    next();
  };

  const prev = () => {
    setCurrent((prevState) => prevState - 1);
  };
  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };
  const handleButtonNext = () => {
    next().then((isSuccess) => {
      if (isSuccess) {
        scrollRightHandler();
      }
    });
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
    if (loadingForm) {
      return;
    }

    setLoadingForm(true);
    const resolveAttachmentCategoryId = (attachment) => {
      return (
        attachment?.categoryId ||
        attachment?.fileCategoryId ||
        attachment?.category?.value ||
        null
      );
    };

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
          for (let element of listDataAttachment) {
            const categoryId = resolveAttachmentCategoryId(element);
            if (!categoryId) {
              throw new Error("Attachment category is required");
            }
            const body = {
              files: element.file,
              category: categoryId,
            };
            const response = await accountManagementService.uploadAttachment(
              `/v1/dbs/api/tossubmission/uploadAttachment/${idTosSubmission}`,
              body
            );
          }
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
        })
        .finally(() => {
          setLoadingForm(false);
        });
    } else {
      dispatch(updateTosSubmissionBody(body))
        .unwrap()
        .then(async () => {
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist"
          );
          for (let element of filterDataAttach) {
            const categoryId = resolveAttachmentCategoryId(element);
            if (!categoryId) {
              throw new Error("Attachment category is required");
            }
            const body = {
              files: element.file,
              category: categoryId,
            };
            const response = await accountManagementService.uploadAttachment(
              `/v1/dbs/api/tossubmission/uploadAttachment/${id}`,
              body
            );
          }
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
        })
        .finally(() => {
          setLoadingForm(false);
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
    <>
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
        <NxBaseContainer border className="mt-8">
          <div className="flex flex-row gap-x-6 justify-center">
            <span className="mt-[10px]">
              <LeftCircleOutlined
                style={{ fontSize: "24px", color: "#0075bf" }}
                onClick={scrollLeftHandler}
              />
            </span>
            <div ref={containerRef} className="overflow-x-scroll scrollStepsCstm">
              <Steps
                current={current}
                items={items}
                labelPlacement="vertical"
                onChange={handleSetCurrent}
              />
            </div>
            <span className="mt-[10px]">
              <RightCircleOutlined
                style={{ fontSize: "24px", color: "#0075bf" }}
                onClick={scrollRightHandler}
              />
            </span>
          </div>
        </NxBaseContainer>
        <Form
          id="tosSubmissionForm"
          form={form}
          layout={"vertical"}
          onFinish={handleSubmitForm}
        >
          <div className="steps-content mt-6">{steps[current].content}</div>

          <NxBaseContainer border className="mt-6">
            <div className="steps-action flex w-full justify-between gap-x-2">
              <ButtonComponent
                type="menu"
                icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
                onClick={() => setModalBack(true)}
              >
                Cancel
              </ButtonComponent>
              <div className="flex w-full justify-end gap-x-4">
                <ButtonComponent
                  icon={
                    <SVGIcon
                      name={typeForm === "update" ? "IconButtonReset" : "IconButtonClear"}
                      width={24}
                    />
                  }
                  type="reject"
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
                    type="menu"
                    icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
                  >
                    Previous
                  </ButtonComponent>
                )}
                {current < steps.length - 1 && (
                  <ButtonComponent
                    onClick={handleButtonNext}
                    disabled={steps[current].disabled}
                    type="submit"
                    icon={<SVGIcon name="IconArrowNarrowRight" width={24} />}
                  >
                    Next
                  </ButtonComponent>
                )}
                {current === steps.length - 1 ? (
                  <>
                    <ButtonComponent
                      disabled={preventSubmit()}
                      form="tosSubmissionForm"
                      htmlType="submit"
                      type="secondary"
                      onClick={() => setTypeSubmit(1)}
                    >
                      Save as Draft
                    </ButtonComponent>
                    <ButtonComponent
                      disabled={preventSubmit()}
                      form="tosSubmissionForm"
                      htmlType="submit"
                      type="approve"
                      onClick={() => setTypeSubmit(2)}
                    >
                      Submit
                    </ButtonComponent>
                  </>
                ) : null}
              </div>
            </div>
          </NxBaseContainer>
        </Form>
        {/** Modal Confirm */}
        {modalConfirm ? (
          <ContentModalConfirm
            isOpen={modalConfirm}
            loadingSubmit={loadingForm}
            handleCancel={handleCancelModalConfirm}
            handleConfirm={handleProcessModalConfirm}
            dataTosSubmissionObj={tosSubmissionObj}
            selectedHierarchy={selectedHierarchy}
            listDataAttachment={listDataAttachment}
            listDataAppHierDetail={dataListAppHierDetailForm}
            dataDetailTosSubmission={dataDetailTosSubmission}
            listApproval={dataListAppHierIdForm}
          />
        ) : null}
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
        handleOk={()=>setModalValidateOverlap(false)}
        handleCancel={()=>setModalValidateOverlap(false)}
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
    </>
  );
};

export default CreateTosSubmission;
