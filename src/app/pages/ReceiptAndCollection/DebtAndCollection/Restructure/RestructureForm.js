import { Col, DatePicker, Form, Input, InputNumber, Row, Select } from "antd";
import React from "react";
import BaseContainer from "../../../../../components/BaseContainer";
import { formMessageRequired } from "../../../../../utils";

const { Option } = Select;

const RestructureForm = ({
    form,
    listCustomer,
    listAccount,
    onCustomerChange,
    onAccountChange,
    showCustomerInfo = true,
    showRestructureInfo = true,
    disabledRestructure = false
}) => {
    return (
        <div className="flex flex-col gap-5">
            {showCustomerInfo && (
                <BaseContainer header={"CUSTOMER INFORMATION"}>
                    <Row gutter={[16, 16]} className="p-4">
                        <Col span={8}>
                            <Form.Item
                                name={"customerNumber"}
                                label={"Customer Number"}
                                rules={formMessageRequired("Customer Number")}
                            >
                                <Select
                                    placeholder="Select Customer"
                                    onChange={onCustomerChange}
                                    showSearch
                                    size="middle"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {listCustomer?.map((item) => (
                                        <Option key={item.value} value={item.value}>
                                            {item.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name={"accountNumber"}
                                label={"Account Number"}
                                rules={formMessageRequired("Account Number")}
                            >
                                <Select
                                    placeholder="Select Account"
                                    onChange={onAccountChange}
                                    showSearch
                                    size="middle"
                                    disabled={!form.getFieldValue("customerNumber")}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {listAccount?.map((item) => (
                                        <Option key={item.value} value={item.value}>
                                            {item.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name={"customerName"}
                                label={"Customer Name"}
                            >
                                <Input disabled className="bg-gray-100" size="middle" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name={"area"}
                                label={"Area"}
                            >
                                <Input disabled className="bg-gray-100" size="middle" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name={"segment"}
                                label={"Segment"}
                            >
                                <Input disabled className="bg-gray-100" size="middle" />
                            </Form.Item>
                        </Col>
                    </Row>
                </BaseContainer>
            )}



            {showRestructureInfo && (
                <BaseContainer header={"RESTRUCTURE INFORMATION"}>
                    <Row gutter={[16, 16]} className="p-4">
                        <Col span={12}>
                            <Form.Item
                                name={"totalMonth"}
                                label={"Total Month"}
                                rules={formMessageRequired("Total Month")}
                            >
                                <InputNumber
                                    type={"number"}
                                    controls={false}
                                    style={{
                                        width: "100%",
                                    }}
                                    className={disabledRestructure ? 'bg-gray-100' : ''}
                                    placeholder="Input total month"
                                    size="middle"
                                    disabled={disabledRestructure}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name={"startPeriod"}
                                label={"Start Period"}
                                rules={formMessageRequired("Start Period")}
                            >
                                <DatePicker
                                    picker="month"
                                    format="MMM YYYY"
                                    className={`w-full ${disabledRestructure ? 'bg-gray-100' : ''}`}
                                    placeholder="Select start period"
                                    size="middle"
                                    disabled={disabledRestructure}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </BaseContainer>
            )}
        </div>
    );
};

export default RestructureForm;
