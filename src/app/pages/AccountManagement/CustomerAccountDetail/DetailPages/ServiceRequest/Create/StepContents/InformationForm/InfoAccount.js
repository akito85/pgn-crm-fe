import { useState } from "react";

import { Form, Select } from "antd";
import InputComponent from "../../../../../../../../../components/InputComponent";
import { requiredMessage } from "../../../../../../../../../utils";
import NxCardContainer from "../../../../../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";

export default function InfoAccount(props) {
  const account = props.account
  const customer = props.customer

  return(
    <NxCardContainer header={"ACCOUNT INFORMATION"}>
      <NxBaseContainer border>
      <div className="w-full grid grid-cols-3 gap-3">
        {/* Column 1 */}
        <Form.Item
          key="srFormAccountId"
          name={"srFormAccountId"}
          label={"Account"}
          rules={[
            {
              message: requiredMessage("Account"),
              required: true,
            },
          ]}
          value="TEST"
          className="no-margin-form"
        >
          <InputComponent disabled={true} />
        </Form.Item>

        <Form.Item
          key="srFormAccountSor"
          name={"srFormAccountSor"}
          label={"Account SOR"}
          rules={[
            {
              message: requiredMessage("Account SOR"),
              required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent disabled={true} />
        </Form.Item>

        <Form.Item
          key="srFormAccountCostCenter"
          name={"srFormAccountCostCenter"}
          label={"Account Cost Center"}
          rules={[
            {
              message: requiredMessage("Account Cost Center"),
              required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent disabled={true} />
        </Form.Item>

        <Form.Item
          key="srFormMeterReadingCode"
          name={"srFormMeterReadingCode"}
          label={"Meter Reading Code"}
          rules={[
            {
              message: requiredMessage("Meter Reading Code"),
              required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent disabled={true} />
        </Form.Item>

        <Form.Item
          key="srFormAccountSegment"
          name={"srFormAccountSegment"}
          label={"Account Segment"}
          rules={[
            {
              message: requiredMessage("Account Segment"),
              required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent disabled={true} />
        </Form.Item>

        <Form.Item
          key="srFormAccountGroupType"
          name={"srFormAccountGroupType"}
          label={"Account Group Type"}
          rules={[
            {
              message: requiredMessage("Account Group Type"),
              required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent disabled={true} />
        </Form.Item>

        <Form.Item
          key="srFormAccountType"
          name={"srFormAccountType"}
          label={"Account Type"}
          rules={[
            {
              message: requiredMessage("Account Type"),
              required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent disabled={true} />
        </Form.Item>

        <Form.Item
          key="srFormPremiseAddress"
          name={"srFormPremiseAddress"}
          label={"Premise Address"}
          rules={[
            {
              message: requiredMessage("Premise Address"),
              // required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent disabled={true} />
        </Form.Item>

        <Form.Item
          key="srFormSubdistrict"
          name={"srFormSubdistrict"}
          label={"Subdistrict"}
          rules={[
            {
              message: requiredMessage("Subdistrict"),
              // required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent disabled={true} />
        </Form.Item>

        {/* Column 2 */}
        <Form.Item
          key="srFormDistrict"
          name={"srFormDistrict"}
          label={"District"}
          rules={[
            {
              message: requiredMessage("District"),
              // required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent disabled={true} />
        </Form.Item>

        <Form.Item
          key="srFormCity"
          name={"srFormCity"}
          label={"City"}
          rules={[
            {
              message: requiredMessage("City"),
              // required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent disabled={true} />
        </Form.Item>

        <Form.Item
          key="srFormCountry"
          name={"srFormCountry"}
          label={"Country"}
          rules={[
            {
              message: requiredMessage("Country"),
              // required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent disabled={true} />
        </Form.Item>

        <Form.Item
          key="srFormLatitude"
          name={"srFormLatitude"}
          label={"Latitude"}
          rules={[
            {
              message: requiredMessage("Latitude"),
              // required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent disabled={true} />
        </Form.Item>

        <Form.Item
          key="srFormLongitude"
          name={"srFormLongitude"}
          label={"Longitude"}
          rules={[
            {
              message: requiredMessage("Longitude"),
              // required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent disabled={true} />
        </Form.Item>
      </div>
      </NxBaseContainer>
    </NxCardContainer>
  )
}
