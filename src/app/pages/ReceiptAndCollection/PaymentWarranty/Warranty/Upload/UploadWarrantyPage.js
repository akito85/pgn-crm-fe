import React, { useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Spin, Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import LayoutMenu from "../../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import CardContainer from "../../../../../../components/CardContainer";
import UploadWarrantyLayout from "./UploadWarrantyLayout";
import SVGIcon from "../../../../../../assets/Icon/index";
import { FormFooter } from "../../../../../../components/FormStepNavigation";
import { saveWarrantyUpload, getDownloadTemplate } from "../../../../../../redux/slices/receipt_collection/warranty";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../../routes/Receipt&Collection/rc_routes";

const { confirm } = Modal;

const UploadWarrantyPage = () => {
  const [uploadedData, setUploadedData] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loadingCreate, loading_download_template } = useSelector((state) => state.warranty);

  const isConfirmView = !!uploadedData;

  const routes = [
    { path: "", breadcrumbName: "Receipt & Collection" },
    { path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_WARRANTY, breadcrumbName: "Payment Guarantee" },
    { path: "", breadcrumbName: "Upload" },
  ];

  const handleDownloadTemplate = () => {
    dispatch(getDownloadTemplate());
  };

  const processSave = (validData) => {
    dispatch(saveWarrantyUpload({ body: { updatesData: validData } }))
      .unwrap()
      .then(() => {
        message.success("Data saved successfully.");
        navigate(-1);
      });
  };

  const handleSubmit = () => {
    if (!uploadedData || !uploadedData.data) return;

    const validData = uploadedData.data
      .filter(item => item.validationStatus === "VALID")
      .map(item => ({
        accountId: item.accountId,
        saNumber: item.saNumber,
        warrantyType: item.warrantyType,
        documentNumber: item.documentNumber,
        documentDate: item.documentDate ? moment(item.documentDate).format("YYYY-MM-DD") : null,
        issuerBank: item.issuerBankId,
        issuerBranch: item.issuerBranchId,
        currency: item.currency,
        rateType: item.rateType,
        rateDate: item.rateDate ? moment(item.rateDate).format("YYYY-MM-DD") : null,
        rate: item.rate,
        effectiveStartDate: item.effectiveStartDate ? moment(item.effectiveStartDate).format("YYYY-MM-DD") : null,
        effectiveEndDate: item.effectiveEndDate ? moment(item.effectiveEndDate).format("YYYY-MM-DD") : null,
        claimPeriodTermType: item.claimPeriodTermType,
        claimPeriodTermValue: parseInt(item.claimPeriodTermValue || 0),
        description: item.description,
        appHierId: null,
        attachmentIds: null,
        isDraft: true,
      }));

    if (uploadedData.totalInvalid > 0) {
      confirm({
        title: 'Warning',
        icon: <ExclamationCircleOutlined />,
        content: `There are ${uploadedData.totalInvalid} invalid records. Only the ${uploadedData.totalValid} valid records will be submitted. Do you want to continue?`,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          processSave(validData);
        },
      });
    } else {
      processSave(validData);
    }
  };

  const isNoValidData = uploadedData && uploadedData.totalValid === 0;

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Spin spinning={loadingCreate}>
        <Form form={form} layout="vertical">
          <CardContainer
            header={
              <div className="flex w-full -mb-[20px]">
                <p className="w-full font-bold">
                  {isConfirmView ? "Upload Confirmation" : "Upload Guarantee"}
                </p>
                <div className={"w-full flex justify-end"}>
                  {!isConfirmView && (
                    <ButtonComponent
                      type={"submit"}
                      loading={loading_download_template}
                      icon={<SVGIcon name="IconButtonDownload" width={24} />}
                      onClick={handleDownloadTemplate}
                    >
                      Download Template
                    </ButtonComponent>
                  )}
                </div>
              </div>
            }
          >
            <UploadWarrantyLayout
              type={isConfirmView ? "detail-confirmation" : "file-upload"}
              onDocumentUpload={(data) => setUploadedData(data)}
            />
          </CardContainer>

          <FormFooter
            onCancel={() => navigate(-1)}
            onClear={() => setUploadedData(null)}
            onSubmit={handleSubmit}
            useClearData={false}
            useSaveDraft={false}
            useNavigation={isConfirmView}
            usePrevious={false}
            useNext={false}
            useSubmit={isConfirmView}
            totalSteps={1}
            isLoading={loadingCreate}
            disableSubmit={isNoValidData}
          />
        </Form>
      </Spin>
    </LayoutMenu>
  );
};

export default UploadWarrantyPage;
