import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Spin, Button, message } from "antd";
import moment from "moment";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import MutationForm from "../Form/MutationForm";
import { 
  getMutationCategoryOptions 
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
  fetchMutation = () => {},
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { loadingMutation } = useSelector((state) => state.warranty);

  useEffect(() => {
    if (isOpen) {
      dispatch(getMutationCategoryOptions());
      
      if (modalType === "update" && selectedRecord) {
        form.setFieldsValue({
          ...selectedRecord,
          date: selectedRecord.date ? moment(selectedRecord.date) : null
        });
      } else {
        form.resetFields();
      }
    }
  }, [isOpen, modalType, selectedRecord, dispatch, form]);

  const handleClose = () => {
    form.resetFields();
    handleCancel();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Resolve currency name for display in the table
      const currencyName = currencyDDL?.data?.find(c => c.id === values.convertedCurrency)?.name || "IDR";
      
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
        message.error("Mutation Number must be unique.");
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
      footer={
        <div className="flex justify-end gap-2 pb-4 px-6">
            <Button onClick={handleClose} className="rounded-md border-[#0075bf] text-[#0075bf] hover:text-[#005a94] hover:border-[#005a94]">
                Cancel
            </Button>
            <Button 
                type="primary" 
                onClick={handleSubmit} 
                className="rounded-md bg-[#28a745] border-[#28a745] hover:bg-[#218838] hover:border-[#218838]"
            >
                Submit
            </Button>
        </div>
      }
    >
      <Spin spinning={loadingMutation}>
        <div className="w-full h-full flex flex-col pt-4 gap-y-5">
            <Form layout="vertical" form={form} id="formMutationNoStepper">
                <div className="px-6 pb-6">
                    <MutationForm 
                        disabled={false} 
                        currencyDDL={currencyDDL} 
                        warrantyType={warrantyType}
                        headerCurrency={headerCurrency}
                    />
                </div>
            </Form>
        </div>
      </Spin>
    </ModalCustom>
  );
};

export default ModalMutationNoStepper;
