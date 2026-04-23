import {
  LeftOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Form, Spin, Input } from "antd";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { FormStepper, FormFooter } from "../../../../../components/FormStepNavigation";
import SectionCard from "../../../../../components/SectionCard";
import CardContainerNoBorder from "../../../../../components/CardContainerNoBorder";
import {
  getTypeDDL,
  getPeriodDDL,
  getAllApprovalList,
  getDetailDeduction,
  getListApprovalById,
  getListCategory,
  createDeduction as saveDeduction,
} from "../../../../../redux/slices/receipt_collection/deduction";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import DeductionForm from "./DeductionForm";
import SVGIcon from "../../../../../assets/Icon/index";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import BaseContainer from "../../../../../components/BaseContainer";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ContentModalConfirm from "./ContentModalConfirm";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import {
  showModalError,
  showModalSuccess,
} from "../../../../../redux/slices/general_slice";
import { bytesConverter } from "../../../../../utils/bytesConverter";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import { configApp } from "../../../../../constants/configApp";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ModalSearchCustomer from "./ModalSearchCustomer";
import TableRBI from "../../../../../components/TableRBI";
import { getCustomerListColumns } from "./CustomerColumns";

const ListFormDeduction = (props) => {
  const { type } = props;
  const {
    data_detail,
    dataListAppHierId,
    dataListAppHierDetail,
    loading,
    loadingDetail,
    loadingType,
    loadingPeriod,
    loadingAppHier,
    dataType,
    dataPeriod,
  } = useSelector((state) => state.deduction);

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const approvalHierarchy = Form.useWatch("approvalHierarchy", form);
  const location = useLocation();
  const { id } = location?.state || {};
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [current, setCurrent] = useState(0);
  const [sendBody, setSendBody] = useState();
  const [tabData, setTabData] = useState([
    { value: "Deduction", paramValue: ["deductionPeriod", "type", "deductionDate"] },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

  const steps = [
    { title: "DEDUCTION", value: "Deduction" },
    { title: "APPROVAL", value: "Approval" },
    { title: "ATTACHMENT", value: "Attachment" },
  ];

  // Customer List State
  const [customerList, setCustomerList] = useState([]);
  const [modalSearchCustomer, setModalSearchCustomer] = useState(false);

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailDeduction(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    dispatch(getAllApprovalList());
    dispatch(getTypeDDL());
    dispatch(getPeriodDDL());
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
    if (
      approvalHierarchy &&
      !appHierOptions
        .map((item) => item.value)
        .includes(approvalHierarchy)
    ) {
      form.setFieldsValue({ approvalHierarchy: null });
      setSelectedHierarchy(null);
    }
  }, [approvalHierarchy, appHierOptions, form]);

  useEffect(() => {
    if (id && data_detail) {
      // Map details to form logic here if needed for update
    }
  }, [data_detail, id]);

  const next = () => {
    if (current === 0) {
      form.validateFields([
        "deductionPeriod",
        "type",
        "deductionDate",
        "description"
      ]).then(() => {
        setCurrent(current + 1);
      }).catch((e) => {
        // Validation handled by form UI
      });
      return;
    }
    if (current === 1) {
      if (!selectedHierarchy) {
        dispatch(showModalError({ title: "Warning", description: "Approval Hierarchy is mandatory", return: false }));
        return;
      }
      setCurrent(current + 1);
      return;
    }
    setCurrent(current + 1);
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const onBack = () => {
    setModalBack(true);
  };

  const handleSubmitForm = (formValue) => {
    const dataValue = {
      ...formValue,
      customerList: customerList
    };

    setSendBody(dataValue);
    setModalConfirm(true);
    // Logic for create/update API call would go here
  };

  const handleCancelModalConfirm = () => {
    setModalConfirm(false);
  };

  // Validation Button Back
  const handleBack = () => {
    setModalBack(true);
  };

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setSelectedHierarchy("");
      setListDataAttachment([]);
      setCustomerList([]);
      setCurrent(0);
    } else {
      // Logic for reset update
    }
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
          0
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

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: "",
      breadcrumbName: "Payment  Guarantee",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_DEDUCTION,
      breadcrumbName: "Deduction",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.CREATE_DEDUCTION,
      breadcrumbName: `${type === "create" ? "Create Deduction" : "Update Deduction"}`,
    },
  ];


  const uploadFiles = async (id) => {
    const filterDataAttach = listDataAttachment.filter(
      (item) => item.dataType !== "exist"
    );

    const failedUploads = [];

    for (let i = 0; i < filterDataAttach.length; i++) {
      const element = filterDataAttach[i];
      const body = {
        referensiId: id,
        files: element.file,
        category: "WARRANTY_DEDUCTION",
        fileCategoryId: element.fileCategoryId,
      };

      try {
        await receiptCollectionHttpService.uploadImage(
          `/v1/dbs/api/attachment/upload/v1`,
          body
        );
      } catch (error) {
        console.error(`Failed to upload file ${i + 1}:`, error);
        failedUploads.push(element);
      }
    }

    if (failedUploads.length > 0) {
      dispatch(
        showModalError({
          title: "Upload Warning",
          description: `${failedUploads.length} file(s) failed to upload. Please try again.`,
          return: false,
        })
      );
    }

    return failedUploads;
  };

  const handleSave = async () => {
    setLoadingSave(true);

    const body = {
      ...sendBody,
      appHierId: selectedHierarchy,
      type: sendBody?.type?.toString(),
      deductionPeriod: sendBody?.deductionPeriod?.toString(),
    };

    try {
      const data = await dispatch(saveDeduction(body)).unwrap();
      const id = data?.id;

      if (id) {
        await uploadFiles(id);
      }

      setModalConfirm(false);
      dispatch(
        showModalSuccess({
          title: "Successful",
          description: "Your data has been submitted",
          return: false,
        })
      );
      navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_DEDUCTION);
    } catch (error) {
      dispatch(
        showModalError({
          title: "Failed",
          description: "Failed to submit data. Please try again.",
          return: false,
        })
      );
    } finally {
      setLoadingSave(false);
    }
  };

  const handleSaveDraft = async () => {
    setLoadingDraft(true);
    const values = form.getFieldsValue();
    const body = {
      ...values,
      customerList: customerList,
      appHierId: selectedHierarchy,
      isDraft: true,
      type: values?.type?.toString(),
      deductionPeriod: values?.deductionPeriod?.toString(),
    };

    try {
      const data = await dispatch(saveDeduction(body)).unwrap();
      const id = data?.id;

      if (id) {
        await uploadFiles(id);
      }

      dispatch(
        showModalSuccess({
          title: "Successful",
          description: "Draft has been saved",
          return: false,
        })
      );
      navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_DEDUCTION);
    } catch (error) {
      dispatch(
        showModalError({
          title: "Failed",
          description: "Failed to save draft. Please try again.",
          return: false,
        })
      );
    } finally {
      setLoadingDraft(false);
    }
  };

  const handleCustomerAmountChange = (id, value) => {
    const updatedList = customerList.map(item => {
      if (item.id === id) {
        return { ...item, amount: value };
      }
      return item;
    });
    setCustomerList(updatedList);
  };

  const handleDeleteCustomer = (id) => {
    const updatedList = customerList.filter(item => item.id !== id);
    setCustomerList(updatedList);
  };

  const customerColumns = useMemo(() => {
    return getCustomerListColumns({
      actionType: "delete",
      onDelete: handleDeleteCustomer,
      amountRender: (text, record) => (
        <Input
          placeholder="Placeholder"
          value={text}
          onChange={(e) => handleCustomerAmountChange(record.id, e.target.value)}
        />
      )
    });
  }, [customerList]);

  return (
    <>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading || loadingDetail || loadingType || loadingPeriod || loadingAppHier || loadingSave || loadingDraft}>
        <FormStepper 
          steps={steps} 
          current={current} 
          onPrev={prev} 
          onNext={next} 
        />
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmitForm}
          onFinishFailed={handleError}
          preserve={true}
        >
          <CardContainerNoBorder 
            header={type === "create" ? "CREATE DEDUCTION INFORMATION" : "UPDATE DEDUCTION INFORMATION"}
            collapsible={true}
            defaultExpanded={true}
            noPadding={true}
          >
            <div
              style={{
                display: current !== 0 ? "none" : undefined,
                padding: "16px"
              }}
            >
              <SectionCard title="DEDUCTION INFORMATION">
                <DeductionForm
                  dataType={dataType}
                  dataPeriod={dataPeriod}
                  form={form}
                  isEmbedded={true}
                />
              </SectionCard>

              <SectionCard title="CUSTOMER INFORMATION">
                <div className="flex justify-end mb-4">
                  <ButtonComponent isPrimary onClick={() => setModalSearchCustomer(true)}>
                    Search Customer
                  </ButtonComponent>
                </div>
                <TableRBI
                  columns={customerColumns}
                  dataSource={customerList.map((item, index) => ({ ...item, key: item.id || index }))}
                  rowKey="key"
                  usePagination={false}
                  tableScrolled={{ x: 1700 }}
                />
              </SectionCard>
            </div>

            <div
              style={{
                display: current !== 1 ? "none" : undefined,
                padding: "16px"
              }}
            >
              <SectionCard title="APPROVAL INFORMATION">
                <ApprovalComponentGeneral
                  dataTable={appHierDataDetail}
                  dataOption={appHierOptions}
                  selectedHierarchy={selectedHierarchy}
                  updateSelectedHierarchy={setSelectedHierarchy}
                />
              </SectionCard>
            </div>

            <div
              style={{
                display: current !== 2 ? "none" : undefined,
                padding: "16px"
              }}
            >
              <SectionCard title="ATTACHMENT INFORMATION">
                <AttachmentComponent
                  type={type}
                  data={listDataAttachment}
                  updateData={setListDataAttachment}
                  typeSelector="deduction"
                  dispatch={dispatch}
                  getAPICategory={getListCategory}
                  service={receiptCollectionHttpService}
                  configApplication={configApp.PAYMENT_SERVICE}
                  typeRBI={"data"}
                />
              </SectionCard>
            </div>
          </CardContainerNoBorder>

          <FormFooter
            current={current}
            totalSteps={steps.length}
            onPrev={prev}
            onNext={next}
            onCancel={onBack}
            onClear={handleClear}
            onSaveDraft={handleSaveDraft}
            onSubmit={() => form.submit()}
            type={type}
          />
        </Form>
      </Spin>
      <ModalCustom
        isOpen={modalConfirm}
        handleCancel={handleCancelModalConfirm}
        header={"Confirmation"}
        width={1000}
        type={"confirmation"}
        footer={
          <div className="w-full flex justify-end gap-5 p-4">
            <ButtonComponent onClick={handleCancelModalConfirm} type="default">
              Cancel
            </ButtonComponent>
            <ButtonComponent 
              className="!bg-[#28a745] !border-[#28a745] hover:!bg-[#218838]"
              isPrimary 
              onClick={handleSave}
              loading={loadingSave}
            >
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <div className="p-4">
          <ContentModalConfirm
            data={sendBody}
            listDataAttachment={listDataAttachment}
            listDataAppHierDetail={appHierDataDetail}
            tabData={tabData}
            dataOption={appHierOptions}
            selectedHierarchy={selectedHierarchy}
            typeSelector="deduction"
          />
        </div>
      </ModalCustom>

      {/* Modal Back*/}
      <ModalConfirm
        isOpen={modalBack}
        handleCancel={() => setModalBack(false)}
        handleOk={() => navigate(-1)}
        width={600}
      >
        <div className="flex justify-center mt-5 gap-[20px]">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className="text-[18px] font-bold">
            Are you sure you want to back?
          </p>
        </div>
      </ModalConfirm>

      <ModalSearchCustomer
        isOpen={modalSearchCustomer}
        onClose={() => setModalSearchCustomer(false)}
        onConfirm={(selectedRecords) => {
          // Avoid duplicates
          const uniqueRecords = selectedRecords.filter(record => !customerList.some(existing => existing.id === record.id));
          setCustomerList([...customerList, ...uniqueRecords]);
        }}
      />

    </>
  );
};

export default ListFormDeduction;
