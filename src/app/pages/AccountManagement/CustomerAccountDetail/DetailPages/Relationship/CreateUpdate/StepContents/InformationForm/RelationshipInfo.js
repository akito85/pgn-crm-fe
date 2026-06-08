import { Form, Select, Button } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import InputComponent from "../../../../../../../../../components/InputComponent";
import SelectComponent from "../../../../../../../../../components/SelectComponent";
import {
  getRelationshipCategories,
  getRelationshipTypes,
} from "../../../../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import {
  getStandaloneRelationshipTypes,
  getStandaloneRelationshipCategories,
} from "../../../../../../../../../redux/slices/relationship/standaloneRelationshipSlice";
import { requiredMessage } from "../../../../../../../../../utils";
import ModalChooseRelated from "./ModalChooseRelated";
import NxDetailText from "../../../../../../../../../components/Nx/NxDetailText";
import NxDate from "../../../../../../../../../components/Nx/NxDatePicker";
import ModalChooseSubjectAccount from "../../../../../../../relationship/Modal/ModalChooseSubjectAccount";
import ModalChooseSubjectCustomer from "../../../../../../../relationship/Modal/ModalChooseSubjectCustomer";
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
 * @param {boolean}  [props.isStandalone=false]        - When true, shows subject account/customer choosers.
 */
const RelationshipInfo = ({
  form,
  setRelatedDetails = () => {},
  formView = true,
  isDraft = false,
  isUpdate = false,
  isStandalone = false,
}) => {
  // --- Hooks ---
  const dispatch = useDispatch();
  const location = useLocation();
  const accountId = location?.state?.idAccount;
  const customerId = location?.state?.idCustomer;

  // --- State ---
  const [modalChoose, setModalChoose] = useState(false);
  const [modalChooseAccount, setModalChooseAccount] = useState(false);
  const [modalChooseCustomer, setModalChooseCustomer] = useState(false);

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
  // Subject chooser watched values (used only when isStandalone)
  const subjectAccountName = Form.useWatch("subjectAccountName", { form, preserve: true });
  const subjectCustomerName = Form.useWatch("subjectCustomerName", { form, preserve: true });
  const subjectAccountId = Form.useWatch("subjectAccountId", { form, preserve: true });

  // --- Redux ---
  const { list_relationshipType, list_relationshipCategory, loading_listRelationshipType, loading_listRelationshipCategory } =
    useSelector((state) => isStandalone ? state.standaloneRelationship : state.relationship);

  // --- Effects ---
  useEffect(() => {
    if (!formView) return;
    if (isStandalone) {
      // Types/categories load without accountId for standalone
      dispatch(getStandaloneRelationshipTypes());
      dispatch(getStandaloneRelationshipCategories());
    } else if (accountId) {
      dispatch(getRelationshipTypes({ accountId }));
      dispatch(getRelationshipCategories({ accountId }));
    }
  }, [dispatch, accountId, isStandalone, formView]);

  // Effective accountId for ModalChooseRelated: standalone uses subjectAccountId from form
  const effectiveAccountId = isStandalone ? subjectAccountId : accountId;
  const effectiveCustomerId = isStandalone ? null : customerId;

  if (formView)
    return (
      <>
        {/* Subject chooser fields — standalone only */}
        {isStandalone && (
          <>
            {/* Hidden fields to store subject IDs */}
            <Form.Item name="subjectAccountId" hidden><InputComponent /></Form.Item>
            <Form.Item name="subjectCustomerId" hidden><InputComponent /></Form.Item>

            <div className="w-full grid grid-cols-2 gap-4 mb-4">
              {/* Subject Account */}
              <Form.Item
                label="Account"
                required
                className="no-margin-form"
              >
                <div className="flex gap-x-1">
                  <Form.Item
                    name="subjectAccountName"
                    rules={[{ message: requiredMessage("Account"), required: true }]}
                    noStyle
                  >
                    <InputComponent disabled value={subjectAccountName || ""} />
                  </Form.Item>
                  <Button
                    type="submit"
                    onClick={() => setModalChooseAccount(true)}
                    disabled={!formView}
                    className="w-[160px]"
                  >
                    Choose Account
                  </Button>
                </div>
              </Form.Item>

              {/* Subject Customer */}
              <Form.Item
                label="Customer"
                required
                className="no-margin-form"
              >
                <div className="flex gap-x-1">
                  <Form.Item
                    name="subjectCustomerName"
                    rules={[{ message: requiredMessage("Customer"), required: true }]}
                    noStyle
                  >
                    <InputComponent disabled value={subjectCustomerName || ""} />
                  </Form.Item>
                  <Button
                    type="submit"
                    onClick={() => setModalChooseCustomer(true)}
                    disabled={!formView}
                    className="w-[170px]"
                  >
                    Choose Customer
                  </Button>
                </div>
              </Form.Item>
            </div>
          </>
        )}

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
              onChange={(_, option) => {
                form.setFieldValue("relationshipCategoryName", option.children);
                setRelatedDetails([]);
                form.resetFields(["relatedName", "relatedNumber", "formAccountId", "relatedId"]);
              }}
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
                disabled={(!isDraft && isUpdate) || !relationshipType || !relationshipCategory || (isStandalone && !effectiveAccountId)}
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
          accountId={effectiveAccountId}
          relationshipType={relationshipType}
          relationshipCategory={relationshipCategory}
          relationshipTypeName={relationshipTypeName}
          isStandalone={isStandalone}
          handleCancel={() => setModalChoose(false)}
          handleSelect={(selected) => {
            const normalizedRelationType = relationshipTypeName
              ? relationshipTypeName.trim().toUpperCase().replace(/\s+/g, "_")
              : null;

            const isAccountType =
              normalizedRelationType &&
              ["CHILD_OF", "PARENT_OF"].includes(normalizedRelationType);

            const relatedNameVal = isAccountType ? selected.accountName : selected.customerName;
            const relatedNumberVal = isAccountType ? selected.accountNumber : selected.customerNumber;
            const formAccountId = isAccountType ? effectiveAccountId : effectiveCustomerId;
            const relatedId = isAccountType ? selected.accountId : selected.customerId;

            form.setFieldsValue({
              formAccountId,
              relatedName: relatedNameVal,
              relatedNumber: relatedNumberVal,
              relatedId,
            });

            // Pass allAccount data to parent for display in RelatedDetailCard
            let relatedDetail;
            if (!isAccountType && selected.relatedDetail)
              relatedDetail = [...selected.relatedDetail];
            else
              relatedDetail = [selected];

            setRelatedDetails(relatedDetail);
          }}
        />

        {/* Subject chooser modals — standalone only */}
        {isStandalone && (
          <>
            <ModalChooseSubjectAccount
              isOpen={modalChooseAccount}
              handleCancel={() => setModalChooseAccount(false)}
              handleSelect={(record) => {
                form.setFieldsValue({
                  subjectAccountId: record.accountId || record.id,
                  subjectAccountName: record.accountName,
                  // Reset relationship-dependent fields when account changes
                  relationshipType: undefined,
                  relationshipCategory: undefined,
                  relatedName: undefined,
                  relatedNumber: undefined,
                });
                setRelatedDetails([]);
              }}
            />
            <ModalChooseSubjectCustomer
              isOpen={modalChooseCustomer}
              handleCancel={() => setModalChooseCustomer(false)}
              handleSelect={(record) => {
                form.setFieldsValue({
                  subjectCustomerId: record.customerId || record.id,
                  subjectCustomerName: record.customerName,
                });
              }}
            />
          </>
        )}
      </>
    );
  else
    return (
      <div className="flex flex-col gap-y-4">
        {isStandalone && (
          <div className="grid grid-cols-3 gap-4">
            <NxDetailText label="Account">{subjectAccountName}</NxDetailText>
            <NxDetailText label="Customer">{subjectCustomerName}</NxDetailText>
          </div>
        )}
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
