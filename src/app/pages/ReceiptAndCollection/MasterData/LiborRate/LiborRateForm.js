import { Input, Select, InputNumber, DatePicker, Switch } from "antd";
import { Form } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import { formMessageRequired } from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
import React, { useEffect } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getListRateSource, getListCurrency } from "../../../../../redux/slices/receipt_collection/liborRate";

const { Option } = Select;

const LiborRateForm = (props) => {
  const { form, additionalSource } = props;

  const dispatch = useDispatch();
  const { dataListRateSource, dataCurrency } = useSelector((state) => state.liborRate);

  const createNewSource = Form.useWatch("createNewSource", form);
  const startDate = Form.useWatch("startDate", form);
  const sourceId = Form.useWatch("sourceId", form);

  const disabledDate = (current) => {
    return current && current < moment(startDate).startOf('day');
  };

  const dataSourceList = React.useMemo(() => {
    let list = [...(dataListRateSource || [])];
    if (additionalSource && !list.find(item => item.id === additionalSource.id)) {
        list.push(additionalSource);
    }
    return list;
  }, [dataListRateSource, additionalSource]);

  useEffect(() => {
    dispatch(getListRateSource());
    dispatch(getListCurrency());
  }, [dispatch]);

  const selectedSource = React.useMemo(() => {
    return dataSourceList?.find((item) => item.id === sourceId);
  }, [dataSourceList, sourceId]);

  const isSourceEditable = selectedSource?.approvalStatus === "Draft";

  useEffect(() => {
    if (selectedSource) {
        form.setFieldsValue({
          sourceCode: selectedSource.sourceCode,
          sourceName: selectedSource.sourceName,
          description: selectedSource.description,
        });
    }
  }, [selectedSource, form]);

  return (
    <div className="flex flex-col gap-5">
      <BaseContainer header={"SOURCE INFORMATION"}>
        <div className="mb-5 flex items-center gap-3">
          <span className="font-semibold">Create New Source?</span>
          <Form.Item name="createNewSource" valuePropName="checked" noStyle initialValue={false}>
            <Switch checkedChildren="Yes" unCheckedChildren="No" />
          </Form.Item>
        </div>

        {createNewSource ? (
          <div className="w-full grid grid-cols-5 gap-5">
            <Form.Item
              label={"Source Code"}
              name={"sourceCodeNew"}
              rules={formMessageRequired("Source Code")}
            >
              <InputComponent placeholder="Input Source Code" maxLength={50} />
            </Form.Item>

            <Form.Item
              label={"Source Name"}
              name={"sourceNameNew"}
              rules={formMessageRequired("Source Name")}
            >
              <InputComponent placeholder="Input Source Name" maxLength={100} />
            </Form.Item>

            <Form.Item
              label={"Description"}
              name={"descriptionNew"}
              className="col-span-3"
            >
              <Input.TextArea placeholder="Input Description" maxLength={255} rows={2} />
            </Form.Item>
          </div>
        ) : (
          <div className="w-full grid grid-cols-5 gap-5">
            <Form.Item
              label={"Select Source"}
              name={"sourceId"}
              rules={formMessageRequired("Source")}
            >
              <Select placeholder="Select Existing Source" showSearch optionFilterProp="children">
                {dataSourceList?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {`[${item.sourceCode}] ${item.sourceName}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label={"Source Code"}
              name={"sourceCode"}
              rules={isSourceEditable ? formMessageRequired("Source Code") : []}
            >
              <InputComponent disabled={!isSourceEditable} placeholder="Source Code" />
            </Form.Item>
            <Form.Item
              label={"Source Name"}
              name={"sourceName"}
              rules={isSourceEditable ? formMessageRequired("Source Name") : []}
            >
              <InputComponent disabled={!isSourceEditable} placeholder="Source Name" />
            </Form.Item>
             <Form.Item
              label={"Description"}
              name={"description"}
              className="col-span-2"
            >
              <Input.TextArea disabled={!isSourceEditable} placeholder="Description" rows={1} />
            </Form.Item>
          </div>
        )}
      </BaseContainer>

      <BaseContainer header={"RATE INDEX INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-5">
          <Form.Item
            label={"Rate Index Code"}
            name={"indexCode"}
            rules={formMessageRequired("Index Code")}
          >
            <InputComponent placeholder="Input Index Code" maxLength={50} />
          </Form.Item>

          <Form.Item
            label={"Rate Index Name"}
            name={"indexName"}
            rules={formMessageRequired("Index Name")}
          >
            <InputComponent placeholder="Input Index Name" maxLength={100} />
          </Form.Item>

          <Form.Item
            label={"Tenor"}
            name={"tenorValue"}
            rules={formMessageRequired("Tenor")}
          >
            <Select placeholder="Select Tenor">
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
              <Option value="5">5</Option>
              <Option value="6">6</Option>
              <Option value="7">7</Option>
              <Option value="8">8</Option>
              <Option value="9">9</Option>
              <Option value="10">10</Option>
              <Option value="11">11</Option>
              <Option value="12">12</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={"Rate Value (%)"}
            name={"ratePercentage"}
            rules={formMessageRequired("Rate Value")}
          >
            <InputNumber
              placeholder="0.00"
              className="w-full"
              style={{ width: "100%" }}
              min={0}
              step={0.01}
            />
          </Form.Item>

          <Form.Item
            label={"Unit"}
            name={"tenorUnit"}
            rules={formMessageRequired("Unit")}
          >
            <Select placeholder="Select Unit">
              <Option value="Day">Day</Option>
              <Option value="Month">Month</Option>
              <Option value="Year">Year</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={"Currency"}
            name={"currencyCode"}
            rules={formMessageRequired("Currency")}
          >
            <Select placeholder="Select Currency" showSearch optionFilterProp="children">
              {dataCurrency?.map((item) => (
                <Option key={item.name} value={item.name}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={"Start Date"}
            name={"startDate"}
            rules={formMessageRequired("Start Date")}
          >
            <DatePicker className="w-full" format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            label={"End Date"}
            name={"endDate"}
            rules={formMessageRequired("End Date")}
          >
            <DatePicker className="w-full" format="YYYY-MM-DD" disabledDate={disabledDate} placeholder="Select End Date" />
          </Form.Item>
        </div>

        <div className="w-full grid grid-cols-1 gap-5 mt-5">
          <Form.Item
            label={"Description"}
            name={"remarks"}
            rules={formMessageRequired("Description")}
          >
            <Input.TextArea placeholder="Type here.." maxLength={255} rows={4} />
          </Form.Item>
        </div>
      </BaseContainer>
    </div>
  );
};

export default LiborRateForm;
