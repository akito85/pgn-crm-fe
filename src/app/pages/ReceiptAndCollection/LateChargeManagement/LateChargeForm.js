import React from "react";
import { Form, Row, Col, Input } from "antd";
import BaseContainer from "../../../../components/BaseContainer";
import { formMessageRequired } from "../../../../utils";
import SelectComponent from "../../../../components/SelectComponent";
import DateComponent from "../../../../components/DateComponent";
import InputComponent from "../../../../components/InputComponent";
import ButtonComponent from "../../../../components/ButtonComponent";

const { TextArea } = Input;

const LateChargeForm = ({ form, onSearchCustomer }) => {
    return (
        <div className="flex flex-col gap-4">
            {/* SECTION 1: CUSTOMER INFORMATION */}
            <BaseContainer
                header={
                    <div className="flex justify-between items-center w-full">
                        <span>CUSTOMER INFORMATION</span>
                        <ButtonComponent type="primary" onClick={onSearchCustomer}>
                            Search Customer
                        </ButtonComponent>
                    </div>
                }
            >
                <div className="grid grid-cols-3 gap-5">
                    <Form.Item
                        label={"Cost Center"}
                        name="costCenter"
                        rules={formMessageRequired("Cost Center")}
                    >
                        <InputComponent disabled />
                    </Form.Item>
                    <Form.Item
                        label={"Customer Number"}
                        name="customerNumber"
                        rules={formMessageRequired("Customer Number")}
                    >
                        <InputComponent disabled />
                    </Form.Item>
                    <Form.Item
                        label={"Customer Name"}
                        name="customerName"
                        rules={formMessageRequired("Customer Name")}
                    >
                        <InputComponent disabled />
                    </Form.Item>
                </div>
            </BaseContainer>

            {/* SECTION 2: LATE CHARGE INFORMATION */}
            <BaseContainer header={"LATE CHARGE INFORMATION"}>
                <div className="grid grid-cols-3 gap-5">
                    <Form.Item
                        label={"Period Tagihan"}
                        name="periodTagihan"
                        rules={formMessageRequired("Period Tagihan")}
                    >
                        <DateComponent picker="month" format="MMM YYYY" />
                    </Form.Item>
                    <Form.Item
                        label={"Payment Amount"}
                        name="paymentAmount"
                        rules={formMessageRequired("Payment Amount")}
                        getValueFromEvent={(e) => {
                            return e.floatValue;
                        }}
                    >
                        <InputComponent placeholder="Enter Payment Amount" type="numeric" />
                    </Form.Item>
                    <Form.Item
                        label={"Type"}
                        name="type"
                        rules={formMessageRequired("Type")}
                    >
                        <SelectComponent
                            placeholder="Select Type"
                            options={[
                                { label: "Illegal Action", value: "Illegal Action" },
                                { label: "Other", value: "Other" },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label={"Invoice No"}
                        name="invoiceNo"
                        rules={formMessageRequired("Invoice No")}
                    >
                        <InputComponent placeholder="Enter Invoice No" />
                    </Form.Item>
                    <Form.Item
                        label={"Total Days Late"}
                        name="totalDaysLate"
                        rules={formMessageRequired("Total Days Late")}
                    >
                        <InputComponent placeholder="Enter Total Days Late" type="number" />
                    </Form.Item>
                    <Form.Item
                        label={"Total Late Charge"}
                        name="totalLateCharge"
                        rules={formMessageRequired("Total Late Charge")}
                        getValueFromEvent={(e) => {
                            return e.floatValue;
                        }}
                    >
                        <InputComponent placeholder="Enter Total Late Charge" type="numeric" />
                    </Form.Item>

                    <Form.Item
                        label={"Due Date"}
                        name="dueDate"
                        rules={formMessageRequired("Due Date")}
                    >
                        <DateComponent format="DD MMM YYYY" />
                    </Form.Item>
                    <Form.Item
                        label={"Late Charge Rate"}
                        name="lateChargeRate"
                        rules={formMessageRequired("Late Charge Rate")}
                        getValueFromEvent={(e) => {
                            return e.floatValue;
                        }}
                    >
                        <InputComponent placeholder="Enter Late Charge Rate" type="numeric" />
                    </Form.Item>
                    <Form.Item
                        label={"Payment Date"}
                        name="paymentDate"
                        rules={formMessageRequired("Payment Date")}
                    >
                        <DateComponent format="DD MMM YYYY" />
                    </Form.Item>

                    <Form.Item
                        label={"Late Charge Time Unit"}
                        name="lateChargeTimeUnit"
                        rules={formMessageRequired("Late Charge Time Unit")}
                    >
                        <InputComponent placeholder="Enter Late Charge Time Unit" />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-1 mt-2">
                    <Form.Item label={"Remark"} name="remark">
                        <InputComponent type="textarea" placeholder="Enter Remark" rows={4} maxLength={255} />
                    </Form.Item>
                </div>
            </BaseContainer>
        </div>
    );
};

export default LateChargeForm;
