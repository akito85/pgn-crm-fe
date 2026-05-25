import React, { useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Spin, Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import CardContainer from "../../../../../../components/CardContainer";
import UploadRestructureLayout from "./UploadRestructureLayout";
import SVGIcon from "../../../../../../assets/Icon/index";
import { FormFooter } from "../../../../../../components/FormStepNavigation";
import { saveRestructureUpload, getDownloadTemplateRestructure } from "../../../../../../redux/slices/receipt_collection/restructure";
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../../../routes/DebtAndCollection/rc_routes";

const { confirm } = Modal;

const UploadRestructurePage = () => {
  const [uploadedData, setUploadedData] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, loading_download_template } = useSelector((state) => state.restructure);

  const isConfirmView = !!uploadedData;

  const routes = [
    { path: "", breadcrumbName: "Receipt & Collection" },
    { path: "", breadcrumbName: "Bad Debt and Collection" },
    { path: DEBT_AND_COLLECTION_ROUTES.VIEW_RESTRUCTURE, breadcrumbName: "Payment Plan" },
    { path: "", breadcrumbName: "Upload" },
  ];

  const handleDownloadTemplate = () => {
    dispatch(getDownloadTemplateRestructure());
  };

  const processSave = (validData) => {
    dispatch(saveRestructureUpload({ body: { updatesData: validData } }))
      .unwrap()
      .then(() => {
        message.success("Data saved successfully.");
        navigate(DEBT_AND_COLLECTION_ROUTES.VIEW_RESTRUCTURE);
      });
  };

  const handleSubmit = () => {
    if (!uploadedData || !uploadedData.data) return;

    const validData = uploadedData.data
      .filter(item => item.validationStatus === "VALID")
      .map(item => ({
        customerNumber: item.customerNumber,
        accountNumber: item.accountNumber,
        type: item.type,
        tenor: item.tenor,
        startPeriod: item.startPeriod ? moment(item.startPeriod).format("YYYY-MM-DD") : null,
        description: item.description,
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
    <>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <Form form={form} layout="vertical">
          <CardContainer
            header={
              <div className="flex w-full -mb-[20px]">
                <p className="w-full font-bold">
                  {isConfirmView ? "Upload Confirmation" : "Upload Payment Plan"}
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
            <UploadRestructureLayout
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
            isLoading={loading}
            disableSubmit={isNoValidData}
          />
        </Form>
      </Spin>
    </>
  );
};

export default UploadRestructurePage;
