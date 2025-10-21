import { DatePicker, Form, Select } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import InputComponent from "../../../../components/InputComponent";
import ButtonComponent from "../../../../components/ButtonComponent";
import SelectComponent from "../../../../components/SelectComponent";
import moment from "moment";
import { dateFormatting, hasValue } from "../../../../utils";

const ConfirmationHierarchy = ({
  dataHierarchy,
  handleCancel = () => {},
  id,
  data_detail,
  handleSave = () => {},
  type,
}) => {
  const [form] = Form.useForm();

  // useState
  const [initStatus, setInitStatus] = useState("ACTIVE");

  const assertData = useCallback(
    (data) => {
      if (data) {
        setInitStatus(data?.status);
        form.setFieldsValue({
          name: data?.name,
          saveAs: data?.status,
          startDate:
            hasValue(data?.startDate) === false || data?.startDate === "-"
              ? moment()
              : moment(data?.startDate).clone(dateFormatting?.date),
          endDate:
            hasValue(data?.endDate) === false || data?.endDate === "-"
              ? null
              : moment(data?.endDate).clone(dateFormatting?.date),
          description: data?.description,
        });
      }
    },
    [form],
  );

  // use effect
  useEffect(() => {
    if (id && data_detail) {
      assertData(data_detail);
    }
  }, [id, data_detail, assertData, type]);

  // save hierarchy
  const handleSaveHierarchy = (formValue) => {
    let payload;
    if (id && data_detail) {
      const changeArray = dataHierarchy?.map((item) => {
        const { key, ...items } = item;
        return {
          rHierId: hasValue(items?.id) ? items?.id : null,
          hierId: hasValue(items?.rHierId) ? items?.rHierId : null,
          parentId: hasValue(items?.positionParent)
            ? items?.positionParent
            : null,
          positionId: items?.positionName,
          description: hasValue(items?.remark) ? items?.remark : null,
        };
      });
      payload = {
        ...formValue,
        hierId: id,
        startDate: hasValue(formValue?.startDate)
          ? moment(formValue?.startDate)?.format(dateFormatting?.date)
          : null,
        endDate: hasValue(formValue?.endDate)
          ? moment(formValue?.endDate)?.format(dateFormatting?.date)
          : null,
        hierarchys: changeArray,
      };
    } else {
      const changeArray = dataHierarchy?.map((item) => {
        const { key, ...items } = item;
        return {
          parentId: hasValue(items?.positionParent)
            ? items?.positionParent
            : null,
          positionId: items?.positionName,
          description: hasValue(items?.remark) ? items?.remark : null,
        };
      });
      payload = {
        ...formValue,
        startDate: hasValue(formValue?.startDate)
          ? moment(formValue?.startDate)?.format(dateFormatting?.date)
          : null,
        endDate: hasValue(formValue?.endDate)
          ? moment(formValue?.endDate)?.format(dateFormatting?.date)
          : null,
        hierarchys: changeArray,
      };
    }
    handleSave(payload);
  };

  // handle disable date
  const handleDisableDate = (current) => {
    return current && current < moment().add(-1, "days");
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSaveHierarchy}>
      <Form.Item label="Hierarchy Name" name={"name"}>
        <InputComponent />
      </Form.Item>
      <Form.Item label={"Save As"} name={"saveAs"} initialValue={initStatus}>
        <SelectComponent onChange={(e) => setInitStatus(e)}>
          <Select.Option value="ACTIVE"> Active</Select.Option>
          <Select.Option value="DRAFT"> Draft</Select.Option>
        </SelectComponent>
      </Form.Item>

      {/* render content if active */}
      {initStatus === "ACTIVE" ? (
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
      ) : null}

      <Form.Item label={"Description"} name={"description"}>
        <InputComponent type="textarea" />
      </Form.Item>
      <div className={"w-full flex justify-end gap-5"}>
        <ButtonComponent type={"default"} onClick={handleCancel}>
          Cancel
        </ButtonComponent>
        <ButtonComponent type={"submit"} htmlType={"submit"}>
          Save
        </ButtonComponent>
      </div>
    </Form>
  );
};

export default ConfirmationHierarchy;
