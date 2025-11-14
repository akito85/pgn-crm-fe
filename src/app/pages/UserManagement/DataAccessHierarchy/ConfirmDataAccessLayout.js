import { useEffect } from "react";
import ButtonComponent from "../../../../components/ButtonComponent";
import { DatePicker, Form, Select } from "antd";
import { useState } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import {
  createDataAccess,
  updateDataAccess,
} from "../../../../redux/slices/user_management/data_access";
import { dateFormatting, hasValue } from "../../../../utils";
import InputComponent from "../../../../components/InputComponent";
const { Option } = Select;

const ConfirmDataAccessLayout = ({
  data,
  handleCancel,
  typeAction,
  formValue,
  id,
  setPayload = () => {},
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isUpdateFormValue = formValue.getFieldsValue();
  const [statusSave, setStatusSave] = useState("ACTIVE");
  useEffect(() => {
    if (typeAction === "update") {
      setStatusSave(isUpdateFormValue?.saveAs);
    }
  }, [statusSave, typeAction, isUpdateFormValue]);
  const onFinnish = (formValue) => {
    const updatedData = data?.map((item) => {
      const { key, ...rest } = item;
      return rest;
    });
    const startDate = moment(formValue?.startDate).format(
      dateFormatting.dateCapital
    );
    const endDate =
      hasValue(formValue?.endDate) === false
        ? null
        : moment(formValue?.endDate).format(dateFormatting.dateCapital);
    delete formValue.startDate;
    const {
      costCenter,
      sibling,
      descriptionHierarchy,
      parent,
      saveAs,
      ...otherValues
    } = formValue;
    const valueOfBody =
      typeAction === "create" ? formValue : { id: id, ...otherValues };
    const body =
      saveAs === "DRAFT"
        ? {
            ...valueOfBody,
            hierarchy: updatedData,
            description: descriptionHierarchy,
            saveAs,
          }
        : {
            ...valueOfBody,
            hierarchy: updatedData,
            description: descriptionHierarchy,
            saveAs,
            endDate,
          };

    setPayload(body);
    if (typeAction === "create") {
      dispatch(createDataAccess(body));
    } else {
      dispatch(updateDataAccess(body));
    }
    form.resetFields();
    handleCancel();
  };

  const handleDisableDate = (current) => {
    return current && current < moment().add(-1, "days");
  };

  return (
    <Form
      form={typeAction === "create" ? form : formValue}
      onFinish={onFinnish}
      layout={"vertical"}
      handleCancel={handleCancel}
    >
      <div className="w-full flex flex-col">
        <Form.Item label={"Hierarchy Name"} name={"name"}>
          <InputComponent disabled={typeAction === "update"} />
        </Form.Item>
        <Form.Item label={"Save As"} name={"saveAs"} initialValue={statusSave}>
          <Select onChange={(e) => setStatusSave(e)}>
            <Option value="ACTIVE"> Active</Option>
            <Option value="DRAFT"> Draft</Option>
          </Select>
        </Form.Item>
        {(statusSave === "ACTIVE" ||
          isUpdateFormValue?.saveAs === "ACTIVE") && (
          <>
            <Form.Item
              label={"Start Date"}
              name={"startDate"}
              className="w-full"
              initialValue={moment()}
            >
              <DatePicker
                format={dateFormatting.dateCapital}
                className="w-full"
                disabledDate={handleDisableDate}
                disabled
              />
            </Form.Item>
            <Form.Item label={"End Date"} name={"endDate"}>
              <DatePicker
                className="w-full"
                format={dateFormatting.dateCapital}
                disabledDate={handleDisableDate}
              />
            </Form.Item>
          </>
        )}
        <Form.Item label={"Description"} name={"descriptionHierarchy"}>
          <InputComponent type="textarea" />
        </Form.Item>
        <div className="flex justify-end gap-2">
          <ButtonComponent onClick={handleCancel} type="default">
            Cancel
          </ButtonComponent>
          <ButtonComponent htmlType={"submit"} type="submit">
            Submit
          </ButtonComponent>
        </div>
      </div>
    </Form>
  );
};

export default ConfirmDataAccessLayout;
