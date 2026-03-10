import { useEffect, useMemo } from "react";
import { Form, Input, InputNumber } from "antd";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../../components/BaseContainer";
import { formMessageRequired } from "../../../../../utils";
import SelectComponent from "../../../../../components/SelectComponent";
import {
  getCashBalance,
  getWarrantyCashByAccountId
} from "../../../../../redux/slices/receipt_collection/transferToReceipt";
import { getAllAccountNumberDDL } from "../../../../../redux/slices/receipt_collection/receipt";

const TransferToReceiptForm = (props) => {
  const { form } = props;
  const dispatch = useDispatch();

  // Ambil state dari Redux
  const { cashBalance, listWarrantyCash } = useSelector(
    (state) => state.transferToReceipt
  );
  // Re-use dataAccNumber dari receipt slice
  const { dataAccNumber } = useSelector((state) => state.receipt);

  useEffect(() => {
    // Ambil list Account saat komponen dimount
    dispatch(getAllAccountNumberDDL());
  }, [dispatch]);

  // Handle onChange Account (Reset warranty & balance, ambil warranty cash aktif)
  const handleAccountChange = (value) => {
    form.setFieldsValue({ payWarrantyId: undefined, amount: undefined });
    dispatch(getWarrantyCashByAccountId(value));
    // Reset cash balance at Redux state level by dispatching with invalid id or let it be handled when warranty is selected
  };

  // Handle onChange Warranty (Ambil cash balance account terkait)
  const handleWarrantyChange = (value) => {
    const accountId = form.getFieldValue("accountId");
    if (accountId) {
      dispatch(getCashBalance(accountId));
    }
  };

  // Format opsi dropdown Account
  const accountOptions = useMemo(() => {
    if (Array.isArray(dataAccNumber?.data)) {
      return dataAccNumber.data.map((item) => ({
        value: item.id,
        label: item.name || "Unknown Account",
      }));
    } else if (Array.isArray(dataAccNumber)) {
      return dataAccNumber.map((item) => ({
        value: item.id,
        label: item.name || "Unknown Account",
      }));
    }
    return [];
  }, [dataAccNumber]);

  // Format opsi dropdown Warranty
  const warrantyOptions = useMemo(() => {
    if (Array.isArray(listWarrantyCash)) {
      return listWarrantyCash.map((item) => ({
        value: item.id,
        label: item.paymentWarrantyNo,
      }));
    }
    return [];
  }, [listWarrantyCash]);

  return (
    <div>
      <BaseContainer header={"TRANSFER TO RECEIPT INFORMATION"}>
        <div className="w-full grid grid-cols-2 gap-5">
          <Form.Item
            label={"Account"}
            name={"accountId"}
            rules={formMessageRequired("Account")}
          >
            <SelectComponent
              placeholder="Select Account"
              options={accountOptions}
              onChange={handleAccountChange}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            label={"Payment Warranty"}
            name={"payWarrantyId"}
            rules={formMessageRequired("Payment Warranty")}
          >
            <SelectComponent
              placeholder="Select Payment Warranty (CASH)"
              options={warrantyOptions}
              onChange={handleWarrantyChange}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item label={"Available Cash Balance"}>
            <Input
              value={new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(cashBalance || 0)}
              disabled
              className="bg-gray-100 text-black"
            />
          </Form.Item>

          <Form.Item
            label={"Amount"}
            name={"amount"}
            rules={[
              ...formMessageRequired("Amount"),
              {
                validator: (_, value) => {
                  if (value > cashBalance) {
                    return Promise.reject(new Error("Amount cannot exceed Available Cash Balance"));
                  }
                  if (value <= 0) {
                    return Promise.reject(new Error("Amount must be greater than 0"));
                  }
                  return Promise.resolve();
                },
              }
            ]}
          >
            <InputNumber
              placeholder="Input Transfer Amount"
              className="w-full"
              style={{ width: "100%" }}
              controls={false}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            label={"Remarks"}
            name={"remarks"}
            className="col-span-2"
          >
            <Input.TextArea placeholder="Input Remarks" rows={3} />
          </Form.Item>
        </div>
      </BaseContainer>
    </div>
  );
};

export default TransferToReceiptForm;
