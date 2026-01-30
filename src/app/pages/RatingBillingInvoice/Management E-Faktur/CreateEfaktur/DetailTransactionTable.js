import React, { useState, useEffect } from "react";
import {
  Table,
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
  getListProductCode,
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
  minValue,
  maxValue,
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
            min={minValue !== undefined ? minValue : 0}
            max={maxValue !== undefined ? maxValue : undefined}
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
  const { dataListProductType, dataListUOM, dataListProductCode } = useSelector(
    (state) => state.efaktur
  );

  // State
  const [editingKey, setEditingKey] = useState("");
  const [statusAction, setStatusAction] = useState("");

  useEffect(() => {
    dispatch(getListProductType());
    dispatch(getListUOM());
    dispatch(getListProductCode());
  }, [dispatch]);

  const isEditing = (record) => record.key === editingKey;

  // Calculate DPP, Other DPP, VAT, PPNBM
  const calculateFields = (record) => {
    const unitPrice = parseFloat(record.unitPrice) || 0;
    const quantity = parseFloat(record.quantity) || 0;
    const vatRate = parseFloat(record.vatRate) || 0;
    const ppnbmRate = parseFloat(record.ppnbmRate) || 0;

    // DPP = Unit Price × Qty
    const dpp = unitPrice * quantity;

    // Other DPP = DPP × ((VAT Rate - 1) / VAT Rate)
    const otherDpp = vatRate > 0 ? dpp * ((vatRate - 1) / vatRate) : 0;

    // PPNBM = DPP × (PPNBM Rate / 100)
    const ppnbm = dpp * (ppnbmRate / 100);

    // VAT = Other DPP × (VAT Rate / 100)
    const vat = otherDpp * (vatRate / 100);

    return {
      dpp,
      otherDpp,
      vat,
      ppnbm,
    };
  };

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
    
      if (!row.type) {
        throw new Error("Type is required");
      }
      if (!row.productCode) {
        throw new Error("Product Code is required");
      }
      if (!row.productName) {
        throw new Error("Product Name is required");
      }
      if (!row.uom) {
        throw new Error("UOM is required");
      }
      if (row.unitPrice === undefined || row.unitPrice === null) {
        throw new Error("Unit Price is required");
      }
      if (row.quantity === undefined || row.quantity === null) {
        throw new Error("Quantity is required");
      }
      if (row.vatRate === undefined || row.vatRate === null) {
        throw new Error("VAT Rate is required");
      }

      const newData = [...listDataDetail];
      const index = newData.findIndex((item) => key === item.key);

      const calculated = calculateFields(row);
      const completeRow = {
        key,
        type: row.type,
        productCode: row.productCode,
        productName: row.productName,
        uom: row.uom,
        unitPrice: parseFloat(row.unitPrice) || 0,
        quantity: parseFloat(row.quantity) || 0,
        vatRate: parseFloat(row.vatRate) || 0,
        ppnbmRate: parseFloat(row.ppnbmRate) || 0,
        dpp: calculated.dpp,
        otherDpp: calculated.otherDpp,
        vat: calculated.vat,
        ppnbm: calculated.ppnbm,
      };

  
      if (index > -1) {
        newData.splice(index, 1, completeRow);
      } else {
        newData.push(completeRow);
      }

      setListDataDetail(newData);
      setEditingKey("");
      form.resetFields();
      setStatusAction("");
      
    } catch (errInfo) {
      console.error("Validate Failed:", errInfo);
      
      if (errInfo.errorFields && errInfo.errorFields.length > 0) {
        const missingFields = errInfo.errorFields.map(field => field.name[0]).join(", ");
        console.error(`❌ Missing required fields: ${missingFields}`);
      }
    }
  };

  const addRow = () => {
    form.resetFields();
    setStatusAction("add");
  
    const newRow = {
      key: (listDataDetail.length + 1).toString(),
      type: undefined,
      productCode: undefined,
      productName: "",
      uom: undefined,
      unitPrice: 0,
      quantity: 0,  
      vatRate: 0, 
      ppnbmRate: 0,
      dpp: 0,
      otherDpp: 0,
      vat: 0,
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
        label: item.label,
        value: item.value,
      })) || [],
      render: (value) => {
        const item = dataListProductType?.find((i) => i.value === value);
        return item?.label || value;
      },
    },
    {
      key: "productCode",
      title: "PRODUCT CODE",
      dataIndex: "productCode",
      width: 200,
      inputType: "select",
      required: true,
      options: dataListProductCode?.map((item) => ({
        label: item.label,
        value: item.value,
      })) || [],
      render: (value) => {
        const item = dataListProductCode?.find((i) => i.value === value);
        return item?.label || value;
      },
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
      width: 150,
      inputType: "select",
      required: true,
      options: dataListUOM?.map((item) => ({
        label: item.label,
        value: item.value,
      })) || [],
      render: (value) => {
        const item = dataListUOM?.find((i) => i.value === value);
        return item?.label || value;
      },
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
      render: (_, record) => {
        const calculated = calculateFields(record);
        return calculated.dpp.toLocaleString("id-ID", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      key: "otherDpp",
      title: "OTHER DPP",
      dataIndex: "otherDpp",
      width: 150,
      render: (_, record) => {
        const calculated = calculateFields(record);
        return calculated.otherDpp.toLocaleString("id-ID", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      key: "vatRate",
      title: "VAT RATE (%)",
      dataIndex: "vatRate",
      width: 120,
      inputType: "number",
      required: true,
      minValue: 1,
      maxValue: 100,
      render: (value) => `${value || 0}%`,
    },
    {
      key: "vat",
      title: "VAT",
      dataIndex: "vat",
      width: 150,
      render: (_, record) => {
        const calculated = calculateFields(record);
        return calculated.vat.toLocaleString("id-ID", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      key: "ppnbmRate",
      title: "PPNBM RATE (%)",
      dataIndex: "ppnbmRate",
      width: 150,
      inputType: "number",
      minValue: 0,
      maxValue: 100,
      render: (value) => `${value || 0}%`,
    },
    {
      key: "ppnbm",
      title: "PPNBM",
      dataIndex: "ppnbm",
      width: 150,
      render: (_, record) => {
        const calculated = calculateFields(record);
        return calculated.ppnbm.toLocaleString("id-ID", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
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
        minValue: col.minValue,
        maxValue: col.maxValue,
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
            scroll={{ x: 2400, y: 400 }}
            pagination={false}
            bordered
          />
        </Form>
      </div>
    </CardContainer>
  );
};

export default DetailTransactionTable;