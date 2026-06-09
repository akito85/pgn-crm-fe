import React, { useEffect } from "react";
import { Form, Row, Col, Select, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import SectionCard from "../../../../../../components/SectionCard";
import InputComponent from "../../../../../../components/InputComponent";
import DateComponent from "../../../../../../components/DateComponent";
import { getEarlyRepaymentReasons } from "../../../../../../redux/slices/receipt_collection/restructure";

const { TextArea } = Input;

const ERInstallmentInfoSection = ({ form, onPlanInfoChange }) => {
    const dispatch = useDispatch();
    const { earlyRepaymentReasons } = useSelector((state) => state.restructure);
    const [localPlan, setLocalPlan] = React.useState({ type: null, tenor: null, startPeriod: null });

    useEffect(() => {
        dispatch(getEarlyRepaymentReasons());
    }, [dispatch]);

    const handleChange = (field, value) => {
        const updated = { ...localPlan, [field]: value };
        setLocalPlan(updated);
        if (onPlanInfoChange) onPlanInfoChange(updated);
    };

    const reasonOptions = earlyRepaymentReasons?.map(r => ({ label: r.value, value: r.key })) || [];

    const termOptions = [
        { label: "Date", value: "Date" },
        { label: "Month", value: "Month" }
    ];

    return (
        <SectionCard title="PAYMENT PLAN INFORMATION">
            <Row gutter={[16, 16]}>
                {/* Row 1 */}
                <Col style={{ width: "20%" }}>
                    <Form.Item name="restructureNumber" label="Payment Plan Code" rules={[{ required: true }]}>
                        <InputComponent disabled placeholder="Automatic" />
                    </Form.Item>
                </Col>
                <Col style={{ width: "20%" }}>
                    <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                        <InputComponent disabled placeholder="Automatic" />
                    </Form.Item>
                </Col>
                <Col style={{ width: "20%" }}>
                    <Form.Item name="tenor" label="Tenor" rules={[{ required: true }]}>
                        <InputComponent disabled placeholder="Select Tenor" />
                    </Form.Item>
                </Col>
                <Col style={{ width: "20%" }}>
                    <Form.Item name="startPeriod" label="Star Period" rules={[{ required: true }]}>
                        <InputComponent disabled placeholder="Select Star Period" />
                    </Form.Item>
                </Col>
                <Col style={{ width: "20%" }}>
                    <Form.Item name="source" label="Source" rules={[{ required: true }]}>
                        <InputComponent disabled placeholder="{value}" />
                    </Form.Item>
                </Col>

                {/* Row 2 */}
                <Col style={{ width: "20%" }}>
                    <Form.Item name="requestDate" label="Request Date" rules={[{ required: true }]}>
                        <InputComponent disabled placeholder="Automatic" />
                    </Form.Item>
                </Col>
                <Col style={{ width: "20%" }}>
                    <Form.Item name="earlyRepaymentDate" label="Early Payoff Date" rules={[{ required: true, message: "Early Payoff Date is required" }]}>
                        <DateComponent placeholder="Select Early Payoff Date" />
                    </Form.Item>
                </Col>
                <Col style={{ width: "20%" }}>
                    <Form.Item name="reason" label="Reason" rules={[{ required: true, message: "Reason is required" }]}>
                        <Select
                            placeholder="Select Reason"
                            options={reasonOptions}
                        />
                    </Form.Item>
                </Col>
                <Col style={{ width: "20%" }}>
                    <Form.Item label="Term of Payment" required style={{ marginBottom: 0 }}>
                        <div className="flex gap-2">
                            <Form.Item name="termOfPaymentType" noStyle initialValue="Date">
                                <Select options={termOptions} style={{ width: "90px" }} />
                            </Form.Item>
                            <Form.Item name="termOfPaymentValue" noStyle rules={[{ required: true, message: "Date is required" }]}>
                                <DateComponent placeholder="Select Date" style={{ flex: 1 }} />
                            </Form.Item>
                        </div>
                    </Form.Item>
                </Col>
                <Col style={{ width: "20%" }} />

                {/* Row 3 */}
                <Col span={24}>
                    <Form.Item name="remark" label="Remark" rules={[{ required: true }]}>
                        <TextArea rows={2} readOnly placeholder="Remark" disabled />
                    </Form.Item>
                </Col>

                {/* Row 4 */}
                <Col span={24}>
                    <Form.Item name="earlyRepaymentReason" label="Early Payoff Reason" rules={[{ required: true, message: "Early Payoff Reason is required" }]}>
                        <TextArea rows={2} placeholder="Input Reason" />
                    </Form.Item>
                </Col>
            </Row>
        </SectionCard>
    );
};

export default ERInstallmentInfoSection;
