import { Form, Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import DateComponent from "../../../../../../../components/DateComponent";
import InputComponent from "../../../../../../../components/InputComponent";
import SelectComponent from "../../../../../../../components/SelectComponent";
import NxPanel from "../../../../../../../components/Nx/NxPanel";
import {
  getRelationshipCategory,
  getRelationshipType,
} from "../../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import { requiredMessage } from "../../../../../../../utils";
import ModalChooseRelated from "./ModalChooseRelated";

const RelationshipInformation = ({
  form,
  relationshipObj = {},
  handleRelationshipObj = () => { },
  className = "",
  initialRelationshipType = null,
  initialRelationshipCategory = null,
  onRelatedDetailChange = () => { },
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const idAccount = location?.state?.idAccount;

  const [modalChoose, setModalChoose] = useState(false);
  const [selectedRelationType, setSelectedRelationType] = useState(null);
  const [selectedRelationCategory, setSelectedRelationCategory] = useState(null);

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

  // Set selected values from initial props (for update mode)
  useEffect(() => {
    if (initialRelationshipType && data_relationshipType?.length > 0) {
      const typeObj = data_relationshipType.find(t => t.id === initialRelationshipType);
      setSelectedRelationType(typeObj?.text || initialRelationshipType);
    }
  }, [initialRelationshipType, data_relationshipType]);

  useEffect(() => {
    if (initialRelationshipCategory && data_relationshipCategory?.length > 0) {
      const catObj = data_relationshipCategory.find(c => c.id === initialRelationshipCategory);
      setSelectedRelationCategory(catObj?.text || initialRelationshipCategory);
    }
  }, [initialRelationshipCategory, data_relationshipCategory]);

  return (
    <div className={className}>
      <NxPanel title={"RELATIONSHIP INFORMATION"} removeBottomMargin>
        <div className="w-full grid grid-cols-3 gap-4">
          {/* Row 1 - Col 1: Relationship Type */}
          <Form.Item
            name="relationshipType"
            rules={[
              { message: requiredMessage("Relationship Type"), required: true },
            ]}
            className="no-margin-form"
          >
            <SelectComponent
              mandatory
              label="Relationship Type"
              loading={loadingType}
              onChange={(val) => {
                const selectedType = data_relationshipType?.find(item => item.id === val);
                setSelectedRelationType(selectedType?.text || null);
                handleRelationshipObj(val, "relationshipType");
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
            rules={[
              {
                message: requiredMessage("Relationship Category"),
                required: true,
              },
            ]}
            className="no-margin-form"
          >
            <SelectComponent
              mandatory
              label="Relationship Category"
              loading={loadingCategory}
              onChange={(val) => {
                const selectedCategory = data_relationshipCategory?.find(item => item.id === val);
                setSelectedRelationCategory(selectedCategory?.text || null);
                handleRelationshipObj(val, "relationshipCategory");
              }}
            >
              {data_relationshipCategory?.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.text}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          {/* Row 1 - Col 3: Related Name with Select Button */}
          <div className="flex gap-2 items-end">
            <Form.Item
              name="relatedName"
              rules={[
                { message: requiredMessage("Related Name"), required: true },
              ]}
              className="flex-1 no-margin-form"
            >
              <InputComponent
                label="Related Name"
                mandatory
                disabled
              />
            </Form.Item>
            <ButtonComponent
              type="submit"
              onClick={() => setModalChoose(true)}
              size="small"
              disabled={!selectedRelationType || !selectedRelationCategory}
            >
              Select
            </ButtonComponent>
          </div>

          {/* Row 2 - Col 1: Related Number */}
          <Form.Item
            name="relatedNumber"
            rules={[
              { message: requiredMessage("Related Number"), required: true },
            ]}
            className="no-margin-form"
          >
            <InputComponent
              label="Related Number"
              mandatory
              disabled
            />
          </Form.Item>

          {/* Row 2 - Col 2: Start Date */}
          <Form.Item
            name="startDate"
            rules={[{ message: requiredMessage("Start Date"), required: true }]}
            className="no-margin-form"
          >
            <DateComponent
              mandatory
              label="Start Date"
              onChange={(val) => handleRelationshipObj(val, "startDate")}
            />
          </Form.Item>

          {/* Row 2 - Col 3: End Date */}
          <Form.Item
            name="endDate"
            rules={[{ message: requiredMessage("End Date"), required: false }]}
            className="no-margin-form"
          >
            <DateComponent
              label="End Date"
              onChange={(val) => handleRelationshipObj(val, "endDate")}
            />
          </Form.Item>
        </div>

        {/* Description - Full width */}
        <div className="w-full my-5">
          <Form.Item
            name="description"
            rules={[{ message: requiredMessage("Description"), required: false }]}
            className="no-margin-form"
          >
            <InputComponent
              label="Description"
              type="textarea"
              onChange={(e) => handleRelationshipObj(e.target.value, "description")}
            />
          </Form.Item>
        </div>
        {/* Modal Choose Related */}
        <ModalChooseRelated
          isOpen={modalChoose}
          idAccount={idAccount}
          relationshipType={selectedRelationType}
          relationshipCategory={selectedRelationCategory}
          handleCancel={() => setModalChoose(false)}
          handleSelect={(selected) => {
            // Handle different data structure based on source
            const isCustomer = selected.source === "CUSTOMER";
            const displayName = isCustomer ? selected.customerName : selected.accountName;
            const displayNumber = isCustomer ? selected.customerNumber : selected.accountNumber;

            form.setFieldsValue({
              relatedName: displayName,
              relatedNumber: displayNumber,
            });

            handleRelationshipObj(displayName, "relatedName");
            handleRelationshipObj(displayNumber, "relatedNumber");
            handleRelationshipObj(selected.relatedObjectId, "relatedObjectId");
            handleRelationshipObj(displayName, "objectName");
            handleRelationshipObj(displayNumber, "objectValue");

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
      </NxPanel>
    </div>
  );
};

export default RelationshipInformation;
