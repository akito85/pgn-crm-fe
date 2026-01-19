import { useEffect } from "react";
import { Form, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../../components/BaseContainer";
import { formMessageRequired } from "../../../../../utils";
import SelectComponent from "../../../../../components/SelectComponent";
import DateComponent from "../../../../../components/DateComponent";
import InputComponent from "../../../../../components/InputComponent";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { getDDLDeductionPeriod, getDDLType, getListFromCustomer } from "../../../../../redux/slices/receipt_collection/transferToCustomer";

const TransferToCustomerForm = ({ form, onSearchWarranty }) => {
    const dispatch = useDispatch();
    const { ddlDeductionPeriod, ddlType, listFromCustomer } = useSelector((state) => state.transferToCustomer);



    useEffect(() => {
        dispatch(getDDLDeductionPeriod());
        dispatch(getDDLType());
        dispatch(getListFromCustomer());
    }, [dispatch]);

    const handleFromCustomerChange = (value) => {
        const selected = listFromCustomer.find(item => item.fromCustomerId === value);
        if (selected) {
            form.setFieldsValue({
                fromCustomerName: selected.fromCustomerName,
                areaCode: selected.areaCode,
            });
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* SECTION 1: TRANSFER INFORMATION */}
            <BaseContainer header={"TRANSFER INFORMATION"}>
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item
                            label="From Customer ID"
                            name="fromCustomerId"
                            rules={formMessageRequired("From Customer ID")}
                        >
                            <SelectComponent
                                placeholder="Select Customer ID"
                                options={listFromCustomer.map(item => ({ label: item.fromCustomerId, value: item.fromCustomerId }))}
                                onChange={handleFromCustomerChange}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="From Customer Name"
                            name="fromCustomerName"
                            rules={formMessageRequired("From Customer Name")}
                        >
                            <InputComponent disabled />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Area Code"
                            name="areaCode"
                            rules={formMessageRequired("Area Code")}
                        >
                            <InputComponent disabled />
                        </Form.Item>
                    </Col>
                </Row>
            </BaseContainer>

            {/* SECTION 2: WARRANTY INFORMATION */}
            <BaseContainer
                header={
                    <div className="flex justify-between items-center">
                        <span>WARRANTY INFORMATION</span>
                        <ButtonComponent type="primary" onClick={onSearchWarranty}>
                            Search Warranty
                        </ButtonComponent>
                    </div>
                }
            >
                <div className="grid grid-cols-3 gap-x-6 gap-y-0">
                    <Form.Item label="Payment Warranty Code" name="paymentWarrantyCode" rules={formMessageRequired("Payment Warranty Code")}>
                        <InputComponent disabled />
                    </Form.Item>
                    <Form.Item label="Area Code" name="warrantyAreaCode" rules={formMessageRequired("Area Code")}>
                        <InputComponent disabled />
                    </Form.Item>
                    <Form.Item label="Area Name" name="areaName" rules={formMessageRequired("Area Name")}>
                        <InputComponent disabled />
                    </Form.Item>

                    <Form.Item label="Customer ID" name="customerId" rules={formMessageRequired("Customer ID")}>
                        <InputComponent disabled />
                    </Form.Item>
                    <Form.Item label="Customer Name" name="customerName" rules={formMessageRequired("Customer Name")}>
                        <InputComponent disabled />
                    </Form.Item>
                    <Form.Item label="Customer Segment" name="customerSegment" rules={formMessageRequired("Customer Segment")}>
                        <InputComponent disabled />
                    </Form.Item>

                    <Form.Item label="Customer Group" name="customerGroup" rules={formMessageRequired("Customer Group")}>
                        <InputComponent disabled />
                    </Form.Item>
                    <Form.Item label="Type" name="type" rules={formMessageRequired("Type")}>
                        <InputComponent disabled />
                    </Form.Item>
                    <Form.Item label="Penerbit" name="publisher" rules={formMessageRequired("Penerbit")}>
                        <InputComponent disabled />
                    </Form.Item>

                    <Form.Item label="Currency" name="currency" rules={formMessageRequired("Currency")}>
                        <InputComponent disabled />
                    </Form.Item>
                    <Form.Item label="Balance" name="balance" rules={formMessageRequired("Balance")}>
                        <InputComponent disabled />
                    </Form.Item>
                    <Form.Item label="Rate" name="rate" rules={formMessageRequired("Rate")}>
                        <InputComponent disabled />
                    </Form.Item>

                    <Form.Item label="Rate Date" name="rateDate" rules={formMessageRequired("Rate Date")}>
                        <InputComponent disabled />
                    </Form.Item>
                    <Form.Item label="Equivalent" name="equivalent" rules={formMessageRequired("Equivalent")}>
                        <InputComponent disabled />
                    </Form.Item>
                    <Form.Item label="Document Number" name="documentNumber" rules={formMessageRequired("Document Number")}>
                        <InputComponent disabled />
                    </Form.Item>

                    <Form.Item label="Mutation Date" name="mutationDate" rules={formMessageRequired("Mutation Date")}>
                        <InputComponent disabled />
                    </Form.Item>
                    <Form.Item label="Effective Date" name="effectiveDate" rules={formMessageRequired("Effective Date")}>
                        <InputComponent disabled />
                    </Form.Item>
                    <Form.Item label="Expiring Date" name="expiringDate" rules={formMessageRequired("Expiring Date")}>
                        <InputComponent disabled />
                    </Form.Item>

                    <Form.Item label="End Date Claim" name="endDateClaim" rules={formMessageRequired("End Date Claim")}>
                        <InputComponent disabled />
                    </Form.Item>
                </div>
            </BaseContainer>
        </div>
    );
};

export default TransferToCustomerForm;
