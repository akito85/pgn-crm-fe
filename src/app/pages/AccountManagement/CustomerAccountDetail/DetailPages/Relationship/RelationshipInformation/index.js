import { Form, Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import DateComponent from "../../../../../../../components/DateComponent";
import InputComponent from "../../../../../../../components/InputComponent";
import SelectComponent from "../../../../../../../components/SelectComponent";
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

  return (
    <div>
      <h3 className="text-primary text-xs font-bold uppercase pb-4 pt-0">
        RELATIONSHIP INFORMATION
      </h3>

      <div className="flex flex-col gap-3">
        {/* First Row - Type, Category & Related Name*/}
        <div className="w-full grid grid-cols-3 gap-3">
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
              }}
            >
              {data_relationshipType?.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.text}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

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

          <div className="flex gap-2">
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
            <div className="flex items-end">
              <ButtonComponent
                type="submit"
                onClick={() => setModalChoose(true)}
                size="small"
                disabled={!selectedRelationType || !selectedRelationCategory}
              >
                Select
              </ButtonComponent>
            </div>
          </div>
        </div>

        {/* Second Row - Related Name, Start Date & End Date */}
        <div className="w-full grid grid-cols-3 gap-3">
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

          <Form.Item
            name="endDate"
            rules={[{ message: requiredMessage("End Date"), required: true }]}
            className="no-margin-form"
          >
            <DateComponent
              mandatory
              label="End Date"
              onChange={(val) => handleRelationshipObj(val, "endDate")}
            />
          </Form.Item>
        </div>

        {/* Description - Full width */}
        <Form.Item
          name="description"
          rules={[{ message: requiredMessage("Description"), required: false }]}
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
          handleRelationshipObj(selected.objectId, "objectId");
          handleRelationshipObj(displayName, "objectName");
          handleRelationshipObj(displayNumber, "objectValue");
        }}
      />
    </div>
  );
};

export default RelationshipInformation;
