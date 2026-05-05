import React, { useEffect } from "react";
import { Form, Row, Col, Select, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import CardContainerNoBorder from "../../../../../../components/CardContainerNoBorder";
import InputComponent from "../../../../../../components/InputComponent";
import DateComponent from "../../../../../../components/DateComponent";
import SubSectionCard from "../../../../../../components/SubSectionCard";
import { getRestructureTypes, getRestructureSources } from "../../../../../../redux/slices/receipt_collection/restructure";
import { CUSTOMER_STATUS } from "../../../../../../constants/restructure";

const { TextArea } = Input;

const PaymentPlanInfoSection = ({ form, onPlanInfoChange }) => {
  const dispatch = useDispatch();
  const { restructureTypes, restructureSources } = useSelector((state) => state.restructure);
  const [localPlan, setLocalPlan] = React.useState({ type: null, tenor: null, startPeriod: null });

  useEffect(() => {
    dispatch(getRestructureTypes());
    dispatch(getRestructureSources());
  }, [dispatch]);

  useEffect(() => {
    if (restructureSources && restructureSources.length > 0 && !form.getFieldValue("source")) {
      form.setFieldsValue({ source: restructureSources[0].key });
    }
  }, [restructureSources, form]);

  const handleChange = (field, value) => {
    const updated = { ...localPlan, [field]: value };
    setLocalPlan(updated);
    if (onPlanInfoChange) onPlanInfoChange(updated);
  };

  const accountStatus = Form.useWatch("accountStatus", form);
  const isInactive = accountStatus && accountStatus.toUpperCase() === CUSTOMER_STATUS.INACTIVE;

  const tenorRules = [
    { required: true, message: "Please input/select Tenor" },
    {
      validator: (_, value) => {
        const val = Number(value);
        if (isNaN(val) || val <= 0) {
          return Promise.reject("Tenor must be greater than 0");
        }
        if (isInactive) {
          if (val > 60) {
            return Promise.reject("Tenor maximum is 60 months for inactive customers");
          }
        } else {
          if (val > 12) {
            return Promise.reject("Tenor maximum is 12 months for active customers");
          }
        }
        return Promise.resolve();
      }
    }
  ];

  const typeOptions = restructureTypes?.map(t => ({ label: t.value, value: t.key })) || [];
  const sourceOptions = restructureSources?.map(s => ({ label: s.value, value: s.key })) || [];

  return (
    <CardContainerNoBorder header="PAYMENT PLAN INFORMATION" collapsible={true}>
      <SubSectionCard>
        <Row gutter={[16, 16]}>
          <Col style={{ width: "20%" }}>
              <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select Type"
                    options={typeOptions}
                    onChange={(val) => handleChange("type", val)}
                  />
              </Form.Item>
          </Col>
          <Col style={{ width: "20%" }}>
              <Form.Item name="tenor" label="Tenor" rules={tenorRules}>
                  {isInactive ? (
                      <Input
                        type="number"
                        placeholder="Enter Tenor (Max 60)"
                        min={1}
                        max={60}
                        onChange={(e) => handleChange("tenor", e.target.value ? Number(e.target.value) : null)}
                      />
                  ) : (
                      <Select
                        placeholder="Select Tenor"
                        options={Array.from({ length: 12 }, (_, i) => ({ label: `${i + 1} Month${i > 0 ? "s" : ""}`, value: i + 1 }))}
                        onChange={(val) => handleChange("tenor", val)}
                      />
                  )}
              </Form.Item>
          </Col>
          <Col style={{ width: "20%" }}>
              <Form.Item name="startPeriod" label="Start Period" rules={[{ required: true }]}>
                  <DateComponent
                    picker="month"
                    placeholder="Select Month"
                    format="MMM YYYY"
                    onChange={(val) => handleChange("startPeriod", val)}
                  />
              </Form.Item>
          </Col>
          <Col style={{ width: "20%" }}>
              <Form.Item name="source" label="Source">
                  <Select
                    placeholder="Select Source"
                    options={sourceOptions}
                  />
              </Form.Item>
          </Col>
          <Col style={{ width: "20%" }}>
              <Form.Item name="requestDate" label="Request Date">
                  <DateComponent placeholder="Select Date" />
              </Form.Item>
          </Col>

          <Col span={24}>
              <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                  <TextArea rows={4} placeholder="Description" />
              </Form.Item>
          </Col>
        </Row>
      </SubSectionCard>
    </CardContainerNoBorder>
  );
};

export default PaymentPlanInfoSection;
