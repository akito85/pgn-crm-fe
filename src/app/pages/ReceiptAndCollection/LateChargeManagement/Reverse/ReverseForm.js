import React, { useEffect } from "react";
import { Form } from "antd";
import moment from "moment";
import InputComponent from "../../../../../components/InputComponent";
import DateComponent from "../../../../../components/DateComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import { formMessageRequired } from "../../../../../utils";

const ReverseForm = ({ form, record, listType = [] }) => {
    useEffect(() => {
        if (record) {
            form.setFieldsValue({
                areaCode: record.areaCode,
                areaName: record.areaName,
                customerNumber: record.customerNumber,
                customerName: record.customerName,
                type: record.type || (listType?.length > 0 ? listType[0].value : null),
                periodTagihan: record.periodTagihan ? moment(record.periodTagihan) : null,
            });
        }
    }, [record, form, listType]);

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-5">
                <Form.Item
                    label="Area Code"
                    name="areaCode"
                >
                    <InputComponent disabled />
                </Form.Item>
                <Form.Item
                    label="Area Name"
                    name="areaName"
                >
                    <InputComponent disabled />
                </Form.Item>
                <Form.Item
                    label="Customer ID"
                    name="customerNumber"
                >
                    <InputComponent disabled />
                </Form.Item>

                <Form.Item
                    label="Customer Name"
                    name="customerName"
                >
                    <InputComponent disabled />
                </Form.Item>
                <Form.Item
                    label="Type"
                    name="type"
                    rules={formMessageRequired("Type")}
                >
                    <SelectComponent
                        placeholder="Select Type"
                        options={listType}
                        disabled
                    />
                </Form.Item>
                <Form.Item
                    label="Period Tagihan"
                    name="periodTagihan"
                    rules={formMessageRequired("Period Tagihan")}
                >
                    <DateComponent picker="month" format="MMM YYYY" />
                </Form.Item>
            </div>

            <div className="grid grid-cols-1">
                <Form.Item
                    label="Remark"
                    name="remark"
                >
                    <InputComponent type="textarea" placeholder="Enter Remark" rows={4} maxLength={255} />
                </Form.Item>
            </div>
        </div>
    );
};

export default ReverseForm;
