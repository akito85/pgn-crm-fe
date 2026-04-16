import { Form, Select, Input, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import DateComponent from "../../../../../../../../../components/DateComponent";
import InputComponent from "../../../../../../../../../components/InputComponent";
import SelectComponent from "../../../../../../../../../components/SelectComponent";
import {
  getRelationshipCategories,
  getRelationshipTypes,
} from "../../../../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import { requiredMessage } from "../../../../../../../../../utils";
import ModalChooseRelated from "./ModalChooseRelated";
import NxDetailText from "../../../../../../../../../components/Nx/NxDetailText";
import NxDate from "../../../../../../../../../components/Nx/NxDatePicker";
import moment from "moment";

/**
 * Relationship information step — renders editable form or read-only detail view.
 *
 * @param {object}   props
 * @param {object}   props.form                        - Ant Design Form instance.
 * @param {Function} [props.setRelatedDetails=()=>{}]  - Updates parent related-detail list.
 * @param {boolean}  [props.formView=true]             - true = editable form, false = read-only view.
 * @param {boolean}  [props.isDraft=false]             - Whether the record is a draft.
 * @param {boolean}  [props.isUpdate=false]            - Whether the form is in update mode.
 */
const RelationshipInfo = ({
  form,
  setRelatedDetails = () => {},
  formView = true,
  isDraft = false,
  isUpdate = false,
}) => {
  // --- Hooks ---
  const dispatch = useDispatch();
  const location = useLocation();
  const accountId = location?.state?.idAccount;
  const customerId = location?.state?.idCustomer;

  // --- State ---
  const [modalChoose, setModalChoose] = useState(false);

  // --- Form state ---
  const relationshipType = Form.useWatch("relationshipType", { form });
  const relationshipCategory = Form.useWatch("relationshipCategory", { form });
  const relationshipTypeName = Form.useWatch("relationshipTypeName", { form, preserve: true });
  const relationshipCategoryName = Form.useWatch("relationshipCategoryName", { form, preserve: true });
  const relatedName = Form.useWatch("relatedName", { form, preserve: true });
  const relatedNumber = Form.useWatch("relatedNumber", { form, preserve: true });
  const startDate = Form.useWatch("startDate", { form });
  const endDate = Form.useWatch("endDate", { form });
  const description = Form.useWatch("description", { form });

  // --- Redux ---
  const { list_relationshipType, list_relationshipCategory, loading_listRelationshipType, loading_listRelationshipCategory } =
    useSelector((state) => state.relationship);

  // --- Effects ---
  useEffect(() => {
    if (accountId && formView) {
      dispatch(getRelationshipTypes({ accountId }));
      dispatch(getRelationshipCategories({ accountId }));
    }
  }, [dispatch, accountId]);

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
              disabled={!isDraft && isUpdate}
              loading={loading_listRelationshipType}
              onChange={(_, option) => {
                form.setFieldValue("relationshipTypeName", option.children)
                setRelatedDetails([]);
                // Also clear related name/number fields
                form.resetFields(["relatedName", "relatedNumber", "formAccountId", "relatedId"]);
              }}
            >
              {list_relationshipType?.map((item) => (
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
              disabled={!isDraft && isUpdate}
              onChange={(_, option) => form.setFieldValue("relationshipCategoryName", option.children)}
              loading={loading_listRelationshipCategory}
            >
              {list_relationshipCategory?.map((item) => (
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
            <div className="flex gap-x-1">
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
              <Button
                type="submit"
                onClick={() => setModalChoose(true)}
                disabled={(!isDraft && isUpdate) || !relationshipType || !relationshipCategory}
                className="w-[120px]"
              >
                Select
              </Button>
            </div>
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
            getValueProps={(value) => ({ value: value && moment(value)})}
            className="no-margin-form"
          >
            <NxDate
              disabled={!isDraft && isUpdate}
              onChange={date => {
                if (date && endDate && date.isAfter(endDate, "day"))
                  form.resetFields(["endDate"])
              }}
            />
          </Form.Item>

          {/* Row 2 - Col 3: End Date */}
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ message: requiredMessage("End Date"), required: false }]}
            getValueProps={(value) => ({ value: value && moment(value)})}
            className="no-margin-form"
          >
            <NxDate
              dateDisable={(current) => {
                if (!moment.isMoment(current)) return false;
                return current.isBefore(startDate, "day");
              }}
            />
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
              disabled={!isDraft && isUpdate}
            />
          </Form.Item>
        </div>
        {/* Modal Choose Related */}
        <ModalChooseRelated
          isOpen={modalChoose}
          accountId={accountId}
          relationshipType={relationshipType}
          relationshipCategory={relationshipCategory}
          relationshipTypeName={relationshipTypeName}
          handleCancel={() => setModalChoose(false)}
          handleSelect={(selected) => {
            // Handle different data structure based on source
            const isCustomer = selected.source === "CUSTOMER";

            const relatedName = isCustomer ? selected.customerName : selected.accountName;
            const relatedNumber = isCustomer ? selected.customerNumber : selected.accountNumber;
            const formAccountId = isCustomer ? customerId : accountId;
            const relatedId = isCustomer ? selected.customerId : selected.accountId;

            form.setFieldsValue({
              formAccountId,
              relatedName,
              relatedNumber,
              relatedId,
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
          <NxDetailText label="Related Name">{relatedName}</NxDetailText>
          <NxDetailText label="Related Number">{relatedNumber}</NxDetailText>
          <NxDetailText label="Start Date">{NxDate.formatDate(startDate, "DD MMM YYYY")}</NxDetailText>
          <NxDetailText label="End Date">{NxDate.formatDate(endDate, "DD MMM YYYY")}</NxDetailText>
        </div>
        <NxDetailText label="Description">{description}</NxDetailText>
      </div>
    )
};

export default RelationshipInfo;
