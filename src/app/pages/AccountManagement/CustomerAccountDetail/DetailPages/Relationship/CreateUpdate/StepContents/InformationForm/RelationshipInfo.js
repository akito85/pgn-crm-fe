import { Form, Select, Input } from "antd";
import React, { useEffect, useState } from "react";
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
import NxDetailText from "../../../../../../../../../components/Nx/NxDetailText";
import NxDate from "../../../../../../../../../components/Nx/NxDatePicker";

/**
 * Relationship info step component 
 * @param {{ form: import("antd").FormInstance; values?: {relationshipType?: number; relationshipCategory?: number; relationshipName?: string; relationshipNumber?: string; relationshipTypeName?: string; relationshipCategoryName?: string; }; setRelatedDetails?: React.Dispatch<React.SetStateAction<any[]>>; formView?: boolean; }} props
 * @returns {JSX.Element}
 */
const RelationshipInfo = ({
  form,
  setRelatedDetails = () => {},
  formView = true,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const idAccount = location?.state?.idAccount;

  const [modalChoose, setModalChoose] = useState(false);

  // Initialize form field states
  const relationshipType = Form.useWatch("relationshipType", { form });
  const relationshipCategory = Form.useWatch("relationshipCategory", { form });
  const relationshipTypeName = Form.useWatch("relationshipTypeName", { form, preserve: true });
  const relationshipCategoryName = Form.useWatch("relationshipCategoryName", { form, preserve: true });
  const objectName = Form.useWatch("objectName", { form, preserve: true });
  const objectNumber = Form.useWatch("objectNumber", { form, preserve: true });
  const startDate = Form.useWatch("startDate", { form });
  const endDate = Form.useWatch("endDate", { form });
  const description = Form.useWatch("description", { form });

  // Get data from Redux store
  const { data_relationshipType, data_relationshipCategory, loadingType, loadingCategory } =
    useSelector((state) => state.relationship);

  // Fetch relationship type and category on component mount
  useEffect(() => {
    if (idAccount && formView) {
      dispatch(getRelationshipType({ idAccount }));
      dispatch(getRelationshipCategory({ idAccount }));
    }
  }, [dispatch, idAccount]);

  if (formView)
    return (
      <>
        <div className="w-full grid grid-cols-3 gap-4">
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
                form.setFieldValue("relationshipTypeName", option.children)
                setRelatedDetails([]);
                // Also clear related name/number fields
                form.resetFields(["relatedName", "relatedNumber"]);
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
              onChange={(_, option) => form.setFieldValue("relationshipCategoryName", option.children)}
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
                disabled={!relationshipType || !relationshipCategory}
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
          relationshipType={relationshipTypeName}
          relationshipCategory={relationshipCategoryName}
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
            let relatedDetail;
            if (isCustomer && selected.relatedDetail)
              relatedDetail = [...selected.relatedDetail];
            else
              relatedDetail = [selected];

            setRelatedDetails(relatedDetail);
          }}
        />
      </>
    );
  else
    return (
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-3 gap-4">
          <NxDetailText label="Relationship Type">{relationshipTypeName}</NxDetailText>
          <NxDetailText label="Relationship Category">{relationshipCategoryName}</NxDetailText>
          <NxDetailText label="Related Name">{objectName}</NxDetailText>
          <NxDetailText label="Related Number">{objectNumber}</NxDetailText>
          <NxDetailText label="Start Date">{NxDate.formatDate(startDate, "DD MMM YYYY")}</NxDetailText>
          <NxDetailText label="End Date">{NxDate.formatDate(endDate, "DD MMM YYYY")}</NxDetailText>
        </div>
        <NxDetailText label="Description">{description}</NxDetailText>
      </div>
    )
};

export default RelationshipInfo;
