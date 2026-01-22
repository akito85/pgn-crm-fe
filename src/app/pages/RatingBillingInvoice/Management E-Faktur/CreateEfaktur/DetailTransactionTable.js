import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  InputNumber,
  Form,
  Select,
  Space,
} from "antd";
import CardContainer from "../../../../../components/CardContainer";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import { useDispatch, useSelector } from "react-redux";
import SelectComponent from "../../../../../components/SelectComponent";
import InputComponent from "../../../../../components/InputComponent";
import {
  getListProductType,
  getListUOM,
} from "../../../../../redux/slices/rating_billing_invoice/efakturSlice";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  children,
  options,
  required,
  form,
  ...restProps
}) => {
  const rules = () => {
    let rules = [];
    if (required) {
      rules.push({
        required: required === undefined || required === false ? false : true,
        message: `Please input your ${title.toLowerCase()}!`,
      });
    }
    return rules.length !== 0 ? rules : undefined;
  };

  const getInputNode = (inputType, options) => {
    switch (inputType) {
      case "text":
        return <InputComponent />;
      case "number":
        return (
          <InputNumber
            type={"number"}
            style={{ width: "100%" }}
            controls={false}
            min={0}
          />
        );
      case "select":
        return (
          <SelectComponent
            showSearch
            optionFilterProp="children"
            allowClear
            filterOption={(input, option) =>
              (option?.children ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {options?.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </SelectComponent>
        );
      default:
        return <InputComponent />;
    }
  };

  const inputNode = getInputNode(inputType, options);

  if (dataIndex === "operation" || dataIndex === "no") {
    return (
      <td {...restProps}>
        <div>{children}</div>
      </td>
    );
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={rules()}
          className={"w-full"}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const DetailTransactionTable = ({
  type,
  listDataDetail = [],
  setListDataDetail = () => {},
  efakturId,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  
  // Selector
  const { dataListProductType, dataListUOM } = useSelector(
    (state) => state.efaktur
  );

  // State
  const [editingKey, setEditingKey] = useState("");
  const [statusAction, setStatusAction] = useState("");

  useEffect(() => {
    dispatch(getListProductType());
    dispatch(getListUOM());
  }, [dispatch]);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
    setStatusAction("edit");
  };

  const cancel = () => {
    if (statusAction === "add") {
      const newData = listDataDetail.filter(
        (item) => item.key !== editingKey
      );
      setListDataDetail(newData);
    }
    setEditingKey("");
    setStatusAction("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...listDataDetail];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        const updatedRow = { ...item, ...row };
        newData.splice(index, 1, updatedRow);
        setListDataDetail(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setListDataDetail(newData);
        setEditingKey("");
      }
      
      form.resetFields();
      setStatusAction("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const addRow = () => {
    form.resetFields();
    setStatusAction("add");
    const newRow = {
      key: (listDataDetail.length + 1).toString(),
      type: undefined,
      productCode: "",
      productName: "",
      uom: undefined,
      unitPrice: 0,
      quantity: 0,
      dpp: 0,
      otherDpp: 0,
      vatRate: 0,
      vat: 0,
      ppnbmRate: 0,
      ppnbm: 0,
    };
    setListDataDetail((prevData) => [...prevData, newRow]);
    setEditingKey(newRow.key);
  };

  const deleteRow = (key) => {
    const newData = listDataDetail.filter((item) => item.key !== key);
    setListDataDetail(newData);
  };

  const columns = [
    {
      key: "no",
      title: "NO",
      dataIndex: "no",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      key: "type",
      title: "TYPE",
      dataIndex: "type",
      width: 150,
      inputType: "select",
      required: true,
      options: dataListProductType?.map((item) => ({
        label: item.name,
        value: item.id,
      })) || [],
    },
    {
      key: "productCode",
      title: "PRODUCT CODE",
      dataIndex: "productCode",
      width: 150,
      inputType: "text",
      required: true,
    },
    {
      key: "productName",
      title: "PRODUCT NAME",
      dataIndex: "productName",
      width: 200,
      inputType: "text",
      required: true,
    },
    {
      key: "uom",
      title: "UOM",
      dataIndex: "uom",
      width: 120,
      inputType: "select",
      required: true,
      options: dataListUOM?.map((item) => ({
        label: item.name,
        value: item.code,
      })) || [],
    },
    {
      key: "unitPrice",
      title: "UNIT PRICE",
      dataIndex: "unitPrice",
      width: 150,
      inputType: "number",
      required: true,
      render: (value) => (value || 0).toLocaleString("id-ID"),
    },
    {
      key: "quantity",
      title: "QUANTITY",
      dataIndex: "quantity",
      width: 120,
      inputType: "number",
      required: true,
    },
    {
      key: "dpp",
      title: "DPP",
      dataIndex: "dpp",
      width: 150,
      inputType: "number",
      required: true,
      render: (value) => (value || 0).toLocaleString("id-ID"),
    },
    {
      key: "otherDpp",
      title: "OTHER DPP",
      dataIndex: "otherDpp",
      width: 150,
      inputType: "number",
      render: (value) => (value || 0).toLocaleString("id-ID"),
    },
    {
      key: "vatRate",
      title: "VAT RATE",
      dataIndex: "vatRate",
      width: 120,
      inputType: "number",
      required: true,
      render: (value) => `${value || 0}%`,
    },
    {
      key: "vat",
      title: "VAT",
      dataIndex: "vat",
      width: 150,
      inputType: "number",
      required: true,
      render: (value) => (value || 0).toLocaleString("id-ID"),
    },
    {
      key: "ppnbmRate",
      title: "PPNBM RATE (%)",
      dataIndex: "ppnbmRate",
      width: 150,
      inputType: "number",
      render: (value) => `${value || 0}%`,
    },
    {
      key: "ppnbm",
      title: "PPNBM",
      dataIndex: "ppnbm",
      width: 150,
      inputType: "number",
      render: (value) => (value || 0).toLocaleString("id-ID"),
    },
    {
      key: "operation",
      title: "ACTION",
      dataIndex: "operation",
      fixed: "right",
      width: 150,
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        return (
          <Space className="my-2 gap-2">
            {editable ? (
              <>
                <ButtonComponent onClick={() => cancel()} type="default">
                  Cancel
                </ButtonComponent>
                <ButtonComponent onClick={() => save(record.key)} type="submit">
                  Save
                </ButtonComponent>
              </>
            ) : (
              <>
                <ButtonComponent
                  onClick={() => edit(record)}
                  disabled={editingKey !== ""}
                  icon={<SVGIcon name="IconEdit" width={24} />}
                  border={false}
                />
                <ButtonComponent
                  onClick={() => deleteRow(record.key)}
                  disabled={editingKey !== ""}
                  icon={<SVGIcon name="IconDelete" width={24} />}
                  border={false}
                />
              </>
            )}
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.inputType) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        options: col.options,
        required: col.required,
        form: form,
      }),
    };
  });

  return (
    <CardContainer subHeader={"DETAIL TRANSACTION"}>
      <div className={"w-full flex flex-col gap-4"}>
        <div className={"w-full flex justify-end"}>
          <ButtonComponent
            onClick={editingKey === "" ? addRow : undefined}
            type={"submit"}
            border={false}
            icon={<SVGIcon name="IconButtonAdd" width={24} />}
            disabled={editingKey !== ""}
          >
            Create
          </ButtonComponent>
        </div>

        <Form form={form} component={false}>
          <Table
            dataSource={listDataDetail}
            columns={mergedColumns}
            rowClassName={(record) =>
              isEditing(record) ? "editable-row" : ""
            }
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            scroll={{ x: 2200, y: 400 }}
            pagination={false}
            bordered
          />
        </Form>

        {/* Summary Section */}
        {listDataDetail.length > 0 && (
          <div className="w-full flex justify-end">
            <div className="w-1/3 bg-gray-50 p-4 rounded border">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Total Entries:</span>
                <span>{listDataDetail.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CardContainer>
  );
};

export default DetailTransactionTable;