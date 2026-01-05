import { useEffect } from "react";
import { Select, Input, InputNumber } from "antd";
import { Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../../components/BaseContainer";
import { formMessageRequired } from "../../../../../utils";
import SelectComponent from "../../../../../components/SelectComponent";
import DateComponent from "../../../../../components/DateComponent";
import { getDDLDeductionPeriod, getDDLType } from "../../../../../redux/slices/receipt_collection/transferToReceipt";

const TransferToReceiptForm = (props) => {
  const {
    dataType,
  } = props;
  const dispatch = useDispatch();
  const { ddlDeductionPeriod, ddlType } = useSelector((state) => state.transferToReceipt);

  useEffect(() => {
    dispatch(getDDLDeductionPeriod());
    dispatch(getDDLType());
  }, [dispatch]);

  return (
    <div>
      <BaseContainer header={"TRANSFER TO RECEIPT INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-5">
          <Form.Item
            label={"Deduction Period"}
            name={"deductionPeriod"}
            rules={formMessageRequired("Deduction Period")}
          >
            <SelectComponent
              placeholder="Select Deduction Period"
              options={ddlDeductionPeriod}
            />
          </Form.Item>

          <Form.Item
            label={"Type"}
            name={"type"}
            rules={formMessageRequired("Type")}
          >
            <SelectComponent placeholder="Select Type" options={ddlType}>
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Deduction Date"}
            name={"deductionDate"}
            rules={formMessageRequired("Deduction Date")}
          >
            <DateComponent
              placeholder="Select Deduction Date"
              format="DD MMM YYYY"
              allowClear
            />
          </Form.Item>
        </div>
      </BaseContainer>
    </div>
  );
};

export default TransferToReceiptForm;
