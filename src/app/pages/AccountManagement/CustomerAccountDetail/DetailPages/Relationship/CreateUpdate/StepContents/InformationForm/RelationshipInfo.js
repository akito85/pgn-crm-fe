import { Form, Select, Input } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ButtonComponent from "../../../../../../../../../components/ButtonComponent";
import DateComponent from "../../../../../../../../../components/DateComponent";
import InputComponent from "../../../../../../../../../components/InputComponent";
import SelectComponent from "../../../../../../../../../components/SelectComponent";
import {
  getRelationshipCategory,
  getRelationshipType,
} from "../../../../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import { requiredMessage } from "../../../../../../../../../utils";
import ModalChooseRelated from "./ModalChooseRelated";

const RelationshipInfo = ({
  form,
  className = "",
  onRelatedDetailChange = () => { },
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const idAccount = location?.state?.idAccount;

  const [modalChoose, setModalChoose] = useState(false);
  const [selectedRTText, setSelectedRTText] = useState("")
  const [selectedRTCext, setSelectedRCText] = useState("")

  // Get data from Redux store
  const { data_relationshipType, data_relationshipCategory, loadingType, loadingCategory } =
    useSelector((state) => state.relationship);

  // Fetch relationship type and category on component mount
  useEffect(() => {
    if (idAccount) {
      dispatch(getRelationshipType({ idAccount }));
      dispatch(getRelationshipCategory({ idAccount }));
    }
  }, [dispatch, idAccount]);

  return (
    <>
      <div className="w-full grid grid-cols-3 gap-4">
        <Form.Item name={"objectId"} hidden>
          <Input />
        </Form.Item>

        {/* Row 1 - Col 1: Relationship Type */}
        <Form.Item
          name="relationshipType"
          label="Relationship Type"
          rules={[
            { message: requiredMessage("Relationship Type"), required: true },
          ]}
          className="no-margin-form"
        >
          <SelectComponent
            loading={loadingType}
            onChange={(_, option) => {
              setSelectedRTText(option.children)
              onRelatedDetailChange([]);
              // Also clear related name/number fields
              form.setFieldsValue({
                relatedName: undefined,
                relatedNumber: undefined,
              });
            }}
          >
            {data_relationshipType?.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.text}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        {/* Row 1 - Col 2: Relationship Category */}
        <Form.Item
          name="relationshipCategory"
          label="Relationship Category"
          rules={[
            {
              message: requiredMessage("Relationship Category"),
              required: true,
            },
          ]}
          className="no-margin-form"
        >
          <SelectComponent
            onChange={(_, option) => setSelectedRCText(option.children)}
            loading={loadingCategory}
          >
            {data_relationshipCategory?.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.text}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        {/* Row 1 - Col 3: Related Name with Select Button */}
        <Form.Item
          label={"Related Name"}
          required
          className="no-margin-form"
        >
          <Input.Group compact>
            <Form.Item
              name="relatedName"
              rules={[
                { message: requiredMessage("Related Name"), required: true },
              ]}
              noStyle
            >
              <InputComponent
                disabled
              />
            </Form.Item>
            <ButtonComponent
              type="submit"
              onClick={() => setModalChoose(true)}
              size="small"
              disabled={!form.getFieldValue("relationshipType") || !form.getFieldValue("relationshipCategory")}
            >
              Select
            </ButtonComponent>
          </Input.Group>
        </Form.Item>

        {/* Row 2 - Col 1: Related Number */}
        <Form.Item
          name="relatedNumber"
          label="Related Number"
          rules={[
            { message: requiredMessage("Related Number"), required: true },
          ]}
          className="no-margin-form"
        >
          <InputComponent
            disabled
          />
        </Form.Item>

        {/* Row 2 - Col 2: Start Date */}
        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ message: requiredMessage("Start Date"), required: true }]}
          className="no-margin-form"
        >
          <DateComponent />
        </Form.Item>

        {/* Row 2 - Col 3: End Date */}
        <Form.Item
          name="endDate"
          label="End Date"
          rules={[{ message: requiredMessage("End Date"), required: false }]}
          className="no-margin-form"
        >
          <DateComponent />
        </Form.Item>
      </div>

      {/* Description - Full width */}
      <div className="w-full my-5">
        <Form.Item
          name="description"
          label="Description"
          rules={[{ message: requiredMessage("Description"), required: false }]}
          className="no-margin-form"
        >
          <InputComponent
            type="textarea"
          />
        </Form.Item>
      </div>
      {/* Modal Choose Related */}
      <ModalChooseRelated
        isOpen={modalChoose}
        idAccount={idAccount}
        relationshipType={selectedRTText}
        relationshipCategory={selectedRTCext}
        handleCancel={() => setModalChoose(false)}
        handleSelect={(selected) => {
          // Handle different data structure based on source
          const isCustomer = selected.source === "CUSTOMER";
          const displayName = isCustomer ? selected.customerName : selected.accountName;
          const displayNumber = isCustomer ? selected.customerNumber : selected.accountNumber;

          form.setFieldsValue({
            relatedName: displayName,
            relatedNumber: displayNumber,
            objectId: selected.relatedObjectId,
          });

          // Pass allAccount data to parent for display in RelatedDetailCard
          let relatedDetail = undefined;
          if (isCustomer && selected.relatedDetail) {
            relatedDetail = selected.relatedDetail;
          } else {
            relatedDetail = [selected];
          }

          onRelatedDetailChange(relatedDetail);
        }}
      />
    </>
  );
};

export default RelationshipInfo;
