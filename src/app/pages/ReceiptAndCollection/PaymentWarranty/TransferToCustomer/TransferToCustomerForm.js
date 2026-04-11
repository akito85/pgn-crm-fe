import { useEffect } from "react";
import { Form, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import CardContainerNoBorder from "../../../../../components/CardContainerNoBorder";
import { formMessageRequired } from "../../../../../utils";
import SelectComponent from "../../../../../components/SelectComponent";
import DateComponent from "../../../../../components/DateComponent";
import InputComponent from "../../../../../components/InputComponent";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { getDDLDeductionPeriod, getListFromCustomer } from "../../../../../redux/slices/receipt_collection/transferToCustomer";
import { TRANSFER_CATEGORY } from "../../../../../constants/transferToCustomer";

import SubSectionCard from "../../../../../components/SubSectionCard";

const TransferToCustomerForm = ({ form, onSearchWarranty }) => {
    const dispatch = useDispatch();
    const { listFromCustomer } = useSelector((state) => state.transferToCustomer);

    useEffect(() => {
        dispatch(getListFromCustomer());
    }, [dispatch]);

    const handleFromCustomerChange = (value) => {
        const dataList = listFromCustomer?.result || listFromCustomer || [];
        const selected = dataList.find(item => 
            item.fromCustomerId === value || 
            item.customerId === value ||
            item.customerNumber === value
        );
        if (selected) {
            form.setFieldsValue({
                fromCustomerNumber: selected.customerNumber || selected.fromCustomerNumber,
                fromCustomerName: selected.customerName || selected.fromCustomerName,
                areaCode: selected.areaCode || selected.costCenter,
                fromAccountId: selected.accountId || selected.fromAccountId,
            });
        }
    };

    return (
        <div className="flex flex-col gap-8">
            {/* SECTION 1: TRANSFER TO CUSTOMER INFORMATION */}
            <CardContainerNoBorder 
                header={"TRANSFER TO CUSTOMER INFORMATION"}
                collapsible={true}
            >
                <div className="mx-2 mb-4 mt-4">
                    <SubSectionCard>
                        <Row gutter={[24, 0]}>
                            <Col span={6}>
                                <Form.Item
                                    label="From Customer Number"
                                    name="fromCustomerId"
                                    rules={formMessageRequired("From Customer Number")}
                                >
                                    <SelectComponent
                                        placeholder="Select From Customer Number"
                                        options={(listFromCustomer?.result || listFromCustomer || []).map(item => ({ 
                                            label: item.customerNumber || item.customerId || item.fromCustomerId, 
                                            value: item.customerId !== undefined && item.customerId !== null ? item.customerId : (item.fromCustomerId || item.customerNumber) 
                                        }))}
                                        onChange={handleFromCustomerChange}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label="From Customer Name"
                                    name="fromCustomerName"
                                    rules={formMessageRequired("From Customer Name")}
                                >
                                    <InputComponent disabled />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label="Area Code"
                                    name="areaCode"
                                    rules={formMessageRequired("Area Code")}
                                >
                                    <InputComponent disabled />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label="Category"
                                    name="category"
                                    rules={formMessageRequired("Category")}
                                >
                                    <SelectComponent
                                        placeholder="Select category"
                                        options={TRANSFER_CATEGORY}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Description"
                                    name="description"
                                    rules={formMessageRequired("Description")}
                                >
                                    <InputComponent
                                        type="textarea"
                                        placeholder="Type..."
                                        rows={4}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </SubSectionCard>
                </div>
            </CardContainerNoBorder>

            {/* SECTION 2: GUARANTEE INFORMATION */}
            <CardContainerNoBorder 
                collapsible={true}
                header="GUARANTEE INFORMATION"
            >
                <div className="flex flex-col gap-4 mt-2">
                    <div className="flex justify-end pr-2">
                        <ButtonComponent type="primary" onClick={onSearchWarranty}>
                            Search Guarantee
                        </ButtonComponent>
                    </div>
                    
                    <div className="mx-2 mb-4">
                        <SubSectionCard>
                            <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                                {/* Row 1 */}
                                <Form.Item label="Payment Guarantee Code" name="paymentWarrantyCode" rules={formMessageRequired("Payment Guarantee Code")}>
                                    <InputComponent placeholder="Type Payment Guarantee Code" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>
                                <Form.Item label="Cost Center" name="warrantyAreaCode" rules={formMessageRequired("Cost Center")}>
                                    <InputComponent placeholder="Type Cost Center" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>
                                <Form.Item label="Account Number" name="accountNumber" rules={formMessageRequired("Account Number")}>
                                    <InputComponent placeholder="Type Account Number" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>
                                <Form.Item label="Account Name" name="accountName" rules={formMessageRequired("Account Name")}>
                                    <InputComponent placeholder="Type Account Name" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>

                                {/* Row 2 */}
                                <Form.Item label="Customer Number" name="customerId" rules={formMessageRequired("Customer Number")}>
                                    <InputComponent placeholder="Type Customer Number" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>
                                <Form.Item label="Customer Name" name="customerName" rules={formMessageRequired("Customer Name")}>
                                    <InputComponent placeholder="Type Customer Name" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>
                                <Form.Item label="Customer Segment" name="customerSegment" rules={formMessageRequired("Customer Segment")}>
                                    <InputComponent placeholder="Type Customer Segment" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>
                                <Form.Item label="Customer Group" name="customerGroup" rules={formMessageRequired("Customer Group")}>
                                    <InputComponent placeholder="Type Customer Group" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>

                                {/* Row 3 */}
                                <Form.Item label="Type" name="type" rules={formMessageRequired("Type")}>
                                    <InputComponent placeholder="Type..." disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>
                                <Form.Item label="Document Number" name="documentNumber" rules={formMessageRequired("Document Number")}>
                                    <InputComponent placeholder="Type Document Number" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>
                                <Form.Item label="Document Date" name="mutationDate" rules={formMessageRequired("Document Date")}>
                                    <DateComponent placeholder="Select Mutation Date" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>
                                <Form.Item label="Issuer" name="publisher" rules={formMessageRequired("Issuer")}>
                                    <InputComponent placeholder="Type Issuer" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>

                                {/* Row 4 */}
                                <Form.Item label="Issuer Branch" name="issuerBranch" rules={formMessageRequired("Issuer Branch")}>
                                    <InputComponent placeholder="Type Issuer Branch" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>
                                <Form.Item label="Currency" name="currency" rules={formMessageRequired("Currency")}>
                                    <InputComponent placeholder="Type Currency" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>
                                <Form.Item label="Balance Amount" name="balance" rules={formMessageRequired("Balance Amount")}>
                                    <InputComponent placeholder="Type Balance Amount" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>
                                <Form.Item label="Rate Type" name="rateType" rules={formMessageRequired("Rate Type")}>
                                    <InputComponent placeholder="Type Rate Type" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>

                                {/* Row 5 */}
                                <Form.Item label="Rate Date" name="rateDate" rules={formMessageRequired("Rate Date")}>
                                    <DateComponent placeholder="Select Rate Date" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>
                                <Form.Item label="Rate" name="rate" rules={formMessageRequired("Rate")}>
                                    <InputComponent placeholder="Type Rate" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>
                                <Form.Item label="EQV Balance Amount" name="equivalent" rules={formMessageRequired("EQV Balance Amount")}>
                                    <InputComponent placeholder="Type EQV Balance Amount" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>
                                <Form.Item label="Reff. Start Date" name="effectiveDate" rules={formMessageRequired("Reff. Start Date")}>
                                    <DateComponent placeholder="Select Reff. Start Date" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>

                                {/* Row 6 */}
                                <Form.Item label="Reff. End Date" name="expiringDate" rules={formMessageRequired("Reff. End Date")}>
                                    <DateComponent placeholder="Select Reff. End Date" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>
                                <Form.Item label="Claim Period" name="endDateClaim" rules={formMessageRequired("Claim Period")}>
                                    <DateComponent placeholder="Select Claim Period" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>
                                <Form.Item label="Account Type" name="accountType" rules={formMessageRequired("Account Type")}>
                                    <InputComponent placeholder="Type Account Type" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>
                                <Form.Item label="Classification Type" name="classificationType" rules={formMessageRequired("Classification Type")}>
                                    <InputComponent placeholder="Type Classification Type" disabled className="!border-[#D9D9D9] !bg-[#F0F2F5] !rounded-lg" />
                                </Form.Item>
                            </div>
                        </SubSectionCard>
                    </div>
                </div>
            </CardContainerNoBorder>
        </div>
    );
};

export default TransferToCustomerForm;
