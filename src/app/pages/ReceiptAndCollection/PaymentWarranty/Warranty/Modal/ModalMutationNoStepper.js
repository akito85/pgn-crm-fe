import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Spin, message } from "antd";
import moment from "moment";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import MutationForm from "../Form/MutationForm";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { 
  getMutationCategoryOptions,
  getDetailMutation
} from "../../../../../../redux/slices/receipt_collection/warranty";

const ModalMutationNoStepper = ({
  isOpen,
  handleCancel = () => {},
  modalType = "create",
  selectedRecord = null,
  currencyDDL = null,
  mutationDataInfo = [],
  warrantyType = null,
  headerCurrency = null,
  rateAmount = null,
  fetchMutation = () => {},
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { loadingMutation } = useSelector((state) => state.warranty);

  useEffect(() => {
    if (isOpen) {
      if (modalType === "update" && selectedRecord) {
        if (selectedRecord.id) {
          // Fetch specific mutation data from API if it already exists (has ID)
          dispatch(getDetailMutation({ id: selectedRecord.id }))
            .unwrap()
            .then((res) => {
              const resData = res?.data || res;
              if (resData) {
                // Determine source from isManual if source is null
                const source = resData.isManual ? "Manual" : (resData.source || "Manual");
                
                form.setFieldsValue({
                  ...selectedRecord, // Keep existing data from list as fallback
                  ...resData,
                  source: source,
                  mutationNumber: resData.mutationNumber || resData.documentNumber || selectedRecord?.mutationNumber,
                  date: resData.date 
                    ? moment(resData.date) 
                    : resData.transactionDate 
                      ? moment(resData.transactionDate) 
                      : (selectedRecord?.date ? moment(selectedRecord.date) : null),
                  eqvAmount: resData.eqvAmount ?? resData.equivalentAmount ?? selectedRecord?.eqvAmount,
                  convertedCurrency: resData.convertedCurrency || resData.currency || selectedRecord?.convertedCurrency,
                  rate: rateAmount ?? resData.rate,
                });
              }
            })
            .catch((err) => {
              message.error("Failed to load mutation details");
            });
        } else {
          // Local mutation without ID
          form.setFieldsValue({
            ...selectedRecord,
            mutationNumber: selectedRecord.mutationNumber || selectedRecord.documentNumber,
            date: selectedRecord.date 
              ? moment(selectedRecord.date) 
              : selectedRecord.transactionDate 
                ? moment(selectedRecord.transactionDate) 
                : null,
            eqvAmount: selectedRecord.eqvAmount ?? selectedRecord.equivalentAmount,
            rate: rateAmount ?? selectedRecord.rate,
          });
        }
      } else {
        form.resetFields();
        if (rateAmount != null) {
          form.setFieldsValue({ rate: rateAmount });
        }
      }
    }
  }, [isOpen, modalType, selectedRecord, rateAmount, dispatch, form]);

  const handleClose = () => {
    form.resetFields();
    handleCancel();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const currencyName = values.convertedCurrency || "IDR";
      
      const mutationWithDisplay = {
        ...values,
        currency: currencyName, // For the Amount prefix mapping in columns
        convertedCurrencyName: currencyName, // For the Converted Currency column mapping
      };

      // Unique check for mutationNumber
      const isDuplicate = mutationDataInfo.some(m => 
        m.mutationNumber === values.mutationNumber && 
        (modalType === "create" || (selectedRecord && m.key !== selectedRecord.key))
      );

      if (isDuplicate) {
        message.warn("Mutation Number must be unique.");
        return;
      }

      handleClose();
      fetchMutation(mutationWithDisplay);
    } catch (error) {
      console.error("Validation error:", error);
      message.error("Please fill all required fields correctly.");
    }
  };

  return (
    <ModalCustom
      isOpen={isOpen}
      handleCancel={handleClose}
      header={`${modalType === "create" ? "CREATE" : "UPDATE"} MUTATION`}
      width={1100}
      footer={null}
      type="confirmation"
    >
      <Spin spinning={loadingMutation}>
        <div className="w-full h-full flex flex-col pt-4 gap-y-5">
            <Form layout="vertical" form={form} id="formMutationNoStepper">
                <div className="mb-[30px]">
                    <MutationForm 
                        disabled={false} 
                        currencyDDL={currencyDDL} 
                        warrantyType={warrantyType}
                        headerCurrency={headerCurrency}
                        title={null}
                    />
                </div>

                <div className="w-full">
                    <div style={{ borderTop: "1px solid #C8CDD4", marginLeft: "-16px", marginRight: "-16px", marginBottom: "24px" }} />
                    <div className="flex justify-between items-center gap-5 px-2 pb-2">
                        <ButtonComponent 
                          onClick={handleClose} 
                          type="default" 
                          className="!w-fit px-8"
                        >
                          Cancel
                        </ButtonComponent>
                        <ButtonComponent 
                            isPrimary={true} 
                            onClick={handleSubmit} 
                            className="!w-fit px-8"
                        >
                            Submit
                        </ButtonComponent>
                    </div>
                </div>
            </Form>
        </div>
      </Spin>
    </ModalCustom>
  );
};

export default ModalMutationNoStepper;
