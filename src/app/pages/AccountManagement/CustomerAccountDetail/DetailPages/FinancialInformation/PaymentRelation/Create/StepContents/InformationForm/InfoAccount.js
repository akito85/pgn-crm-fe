import { Form, Select } from "antd";
import InputComponent from "../../../../../../../../../components/InputComponent";
import { requiredMessage } from "../../../../../../../../../utils";
import NxPanel from "../../../../../../../../../components/Nx/NxPanel";

export default function InfoAccount() {
  return(
    <NxPanel title={"ACCOUNT INFORMATION"}>
      <div className="w-full grid grid-cols-3 gap-3">
        {/* Column 1 */}
        <Form.Item
          key="account"
          name={"account"}
          label={"Account"}
          rules={[
            {
              message: requiredMessage("Account"),
              required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent disabled={true} />
        </Form.Item>

        <Form.Item
          key="accountSOR"
          name={"accountSOR"}
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
          key="accountCostCenter"
          name={"accountCostCenter"}
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
          key="meterReadingCode"
          name={"meterReadingCode"}
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
          key="accountSegment"
          name={"accountSegment"}
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
          key="accountGroupType"
          name={"accountGroupType"}
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
          key="accountType"
          name={"accountType"}
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
          key="premiseAddress"
          name={"premiseAddress"}
          label={"Premise Address"}
          rules={[
            {
              message: requiredMessage("Premise Address"),
              required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent disabled={true} />
        </Form.Item>

        <Form.Item
          key="subdistrict"
          name={"subdistrict"}
          label={"Subdistrict"}
          rules={[
            {
              message: requiredMessage("Subdistrict"),
              required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent disabled={true} />
        </Form.Item>

        {/* Column 2 */}
        <Form.Item
          key="district"
          name={"district"}
          label={"District"}
          rules={[
            {
              message: requiredMessage("District"),
              required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent disabled={true} />
        </Form.Item>

        <Form.Item
          key="city"
          name={"city"}
          label={"City"}
          rules={[
            {
              message: requiredMessage("City"),
              required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent disabled={true} />
        </Form.Item>

        <Form.Item
          key="country"
          name={"country"}
          label={"Country"}
          rules={[
            {
              message: requiredMessage("Country"),
              required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent disabled={true} />
        </Form.Item>

        <Form.Item
          key="latitude"
          name={"latitude"}
          label={"Latitude"}
          rules={[
            {
              message: requiredMessage("Latitude"),
              required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent disabled={true} />
        </Form.Item>

        <Form.Item
          key="longitude"
          name={"longitude"}
          label={"Longitude"}
          rules={[
            {
              message: requiredMessage("Longitude"),
              required: true,
            },
          ]}
          className="no-margin-form"
        >
          <InputComponent disabled={true} />
        </Form.Item>
      </div>
    </NxPanel>
  )
}
