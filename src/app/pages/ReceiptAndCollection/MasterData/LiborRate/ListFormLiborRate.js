import moment from "moment";
import {
  WarningOutlined,
} from "@ant-design/icons";
import { Form, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { FormStepper, FormFooter } from "../../../../../components/FormStepNavigation";
import {
  createRateIndex,
  updateRateIndex,
  saveDraftRateIndex,
  getDetailRateIndex,
  getAllApprovalList,
  getListApprovalById,
  getListCategory,
} from "../../../../../redux/slices/receipt_collection/liborRate";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import LiborRateForm from "./LiborRateForm";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import BaseContainer from "../../../../../components/BaseContainer";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ContentModalConfirm from "./ContentModalConfirm";
import {
  showModalError,
  showModalSuccess,
} from "../../../../../redux/slices/general_slice";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import { bytesConverter } from "../../../../../utils/bytesConverter";

const ListFormLiborRate = (props) => {
  const { type } = props;
  const { data_detail, dataListAppHierId, dataListAppHierDetail, loading,dataListCategory } = useSelector((state) => state.liborRate);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const location = useLocation();
  const { id } = location?.state || {};
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [loadingSave, setLoadingSave] = useState(false);
  const [current, setCurrent] = useState(0);

  const steps = [
    { title: "CREATE", value: "Rate Index" },
    { title: "APPROVAL", value: "Approval" },
    { title: "ATTACHMENT", value: "Attachment" },
  ];

  useEffect(() => {
    if (id && type === "update") {
        dispatch(getDetailRateIndex(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    dispatch(getAllApprovalList());
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
      const rateIndex = data_detail?.rateIndex || {};
      const rateSource = data_detail?.rateSource || {};
      const formattedData = {
        ...rateIndex,
        sourceCode: rateSource.sourceCode,
        sourceName: rateSource.sourceName,
        description: rateSource.description,
        apphierId: rateIndex.appHierId,
        sourceId: rateIndex.sourceId,
        startDate: rateIndex.startDate ? moment(rateIndex.startDate) : null,
        endDate: rateIndex.endDate ? moment(rateIndex.endDate) : null,
      };
      
      form.setFieldsValue(formattedData);
      setSelectedHierarchy(rateIndex?.appHierId);
      setListDataAttachment(
        (data_detail?.attachmentDtoList || []).map((attachData) => ({
          ...attachData,
          fileSize: bytesConverter(attachData.fileSize || 0),
          dataType: "exist",
        }))
      );
    }
  }, [data_detail, id, form]);

  const [tabData] = useState([
    {
      value: "Rate Index", 
      paramValue: ["indexCode", "indexName", "sourceCode", "sourceName", "description", "currencyCode", "tenorValue", "tenorUnit", "ratePercentage", "startDate", "endDate", "remarks"]
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

  const [sendBody, setSendBody] = useState();

  const next = () => {
    const fieldsToValidate = tabData[current]?.paramValue;
    if (fieldsToValidate) {
      form
        .validateFields(fieldsToValidate)
        .then(() => {
          if (current < steps.length - 1) {
            setCurrent(current + 1);
          }
        })
        .catch((error) => {
          console.log("Validation failed:", error);
        });
    } else {
      if (current < steps.length - 1) {
        setCurrent(current + 1);
      }
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const handleSubmitForm = (formValue) => {
    if (listDataAttachment.length === 0) {
        dispatch(showModalError({
          title: "Warning",
          description: "Attachment is mandatory. Please upload at least one file.",
          return: false
        }));
        return;
      }
    const dataValue = {
      ...formValue,
      appHierId: selectedHierarchy,
      sourceId: formValue.sourceId || 0,
      createNewSource: true, // Dipaksa selalu create source baru
      sourceCodeNew: formValue.sourceCode,
      sourceNameNew: formValue.sourceName,
      descriptionNew: formValue.description,
      attachmentIds: listDataAttachment.filter(a => a.dataType === 'exist').map(a => a.id)
    };
    if (id) dataValue.id = id;
    setSendBody(dataValue);
    setModalConfirm(true);
  };

  const handleSaveDraft = () => {
    const values = form.getFieldsValue();
    const dataValue = {
      ...values,
      appHierId: selectedHierarchy,
      sourceId: values.sourceId || 0,
      createNewSource: true, // Dipaksa selalu create source baru
      sourceCodeNew: values.sourceCode,
      sourceNameNew: values.sourceName,
      descriptionNew: values.description,
      id: id,
    };
    dispatch(saveDraftRateIndex(dataValue))
      .unwrap()
      .then(() => {
        navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_LIBOR_RATE);
      });
  };

  const handleBack = () => {
    if (Object.keys(form.getFieldsValue()).length === 0) {
      navigate(-1);
    } else {
      setModalBack(true);
    }
  };

  const handleClear = () => {
    form.resetFields();
    setSelectedHierarchy("");
    setListDataAttachment([]);
  };

  const handleSave = async () => {
    setLoadingSave(true);
    const successMessage = {
      title: "Successfull",
      description: `Your data has been submitted`,
      return: false,
    };

    const action = type === "update" ? updateRateIndex : createRateIndex;

    dispatch(action(sendBody))
      .unwrap()
      .then(async (res) => {
        const referensiId = res.id || id;
        const newAttachments = (listDataAttachment || []).filter(item => item.dataType !== "exist");
        
        for (const element of newAttachments) {
          const body = {
            referensiId: referensiId,
            files: element.file,
            category: "RATE_INDEX",
            fileCategoryId: element.fileCategoryId,
          };
          await receiptCollectionHttpService.uploadImage(`/v1/dbs/api/attachment/upload/v1`, body);
        }

        setModalConfirm(false);
        dispatch(showModalSuccess(successMessage));
        navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_LIBOR_RATE);
      })
      .catch((error) => {
        setLoadingSave(false);
        setModalConfirm(false);
      });
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
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_LIBOR_RATE,
      breadcrumbName: "Libor Rate",
    },
    { path: "", breadcrumbName: `${type === "create" ? "Create" : "Update"}` },
  ];

  return (
    <>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <FormStepper steps={steps} current={current} onPrev={prev} onNext={next} />
        <Form layout="vertical" form={form} onFinish={handleSubmitForm}>
          <div style={{ display: current !== 0 ? "none" : undefined }}>
            <LiborRateForm form={form} additionalSource={data_detail?.rateSource} />
          </div>
          <div style={{ display: current !== 1 ? "none" : undefined }}>
            <BaseContainer header={"APPROVAL INFORMATION"}>
              <ApprovalComponentGeneral
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </BaseContainer>
          </div>
          <div style={{ display: current !== 2 ? "none" : undefined }}>
            <BaseContainer header={"ATTACHMENT INFORMATION"}>
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                typeSelector="liborRate"
                dispatch={dispatch}
                getAPICategory={getListCategory}
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
                typeRBI={"data"}
                mandatory={true}
              />
            </BaseContainer>
          </div>
          <FormFooter
            current={current}
            totalSteps={steps.length}
            onPrev={prev}
            onNext={next}
            onCancel={handleBack}
            onClear={handleClear}
            onSaveDraft={handleSaveDraft}
            onSubmit={() => form.submit()}
            type={type}
          />
        </Form>
      </Spin>
      <ModalCustom
        isOpen={modalConfirm}
        handleCancel={() => setModalConfirm(false)}
        header={"Confirmation"}
        width={1000}
        type={"confirmation"}
        footer={
          <div className="w-full flex justify-between gap-5 p-4">
            <ButtonComponent onClick={() => setModalConfirm(false)} type="default">Cancel</ButtonComponent>
            <ButtonComponent isPrimary onClick={handleSave} loading={loadingSave}>Confirm</ButtonComponent>
          </div>
        }
      >
        <ContentModalConfirm
          data={sendBody}
          tabData={tabData}
          listDataAttachment={listDataAttachment}
          listDataAppHierDetail={appHierDataDetail}
          dataOption={appHierOptions}
          selectedHierarchy={selectedHierarchy}
        />
      </ModalCustom>

      <ModalConfirm
        isOpen={modalBack}
        handleCancel={() => setModalBack(false)}
        handleOk={() => navigate(-1)}
        width={600}
      >
        <div className="flex justify-center mt-5 gap-[20px]">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className="text-[18px] font-bold">Are you sure you want to back?</p>
        </div>
      </ModalConfirm>
    </>
  );
};

export default ListFormLiborRate;
