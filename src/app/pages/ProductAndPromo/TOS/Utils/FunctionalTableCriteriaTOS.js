import React, { useEffect, useState } from "react";
import { columnsTableCriteriaTOS } from "./TableCriteriaTos";
import { Form, Input, Pagination, Select, Space, Table, Tooltip } from "antd";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCustomerSegmentList,
  getProductList,
  getAccountCategoryList,
  getAccountGroupList,
  getBudgetList,
  getCityList,
  getCostCenterList,
  getDistrictList,
  getGsizesList,
  getIndustrialSectorList,
  getProvinceList,
  getServiceTypeList,
  getSorList,
  getSubDistrictList,
  getCustomerList,
} from "../../../../../redux/slices/product_promo/tos";
import moment from "moment";
import InputComponent from "../../../../../components/InputComponent";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  options,
  dependDataIndex,
  dataEditRecord,
  handleEditDataRecord = () => {},
  ...restProps
}) => {
  const dispatch = useDispatch();
  const key = record?.key || 0;

  const dataDepend = dependDataIndex
    ? dataEditRecord[key + dependDataIndex]
    : "";

  const getInputNode = (inputType) => {
    switch (inputType) {
      case "select":
        return (
          <Select
            showSearch
            allowClear
            optionFilterProp="children"
            labelInValue
            disabled={dependDataIndex ? !dataDepend : false}
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
          </Select>
        );

      default:
        return <InputComponent />;
    }
  };

  const inputNode = getInputNode(inputType);

  if (
    dataIndex === "operation" ||
    dataIndex === "no" ||
    dataIndex === "status"
  ) {
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
          valuePropName={"value"}
          getValueFromEvent={(value) =>
            handleEditDataRecord(value, key, dataIndex)
          }
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const FunctionalTableCriteriaTOS = ({
  type,
  data = [],
  dataCriteria = [],
  updateData = () => {},
  storedData = false,
  setStoredData = () => {},
}) => {
  const searchInput = useRef(null);
  const [formTableCriteria] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingKey, setEditingKey] = useState("");
  // const [storedData, setStoredData] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [editDataRecord, setEditDataRecord] = useState({});
  const [statusAction, setStatusAction] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const [totalData, setTotalData] = useState(0);

  useEffect(() => {
    setTotalData(data.length);
  }, [data]);

  // Selector
  const {
    data_budget,
    data_province,
    data_city,
    data_industrial_sector,
    data_district,
    data_sub_district,
    data_account_Category,
    data_service_type,
    data_account_group,
    data_sor,
    data_cost_center,
    data_Gsizes,
    data_product,
    data_customerSegment,
    data_customer,
  } = useSelector((state) => state.tos);

  // Declaration
  const dispatch = useDispatch();

  // Data Select Criteria
  const budget = (data_budget || []).map((item) => {
    return {
      value: item.Id,
      label: item.text,
    };
  });
  const province = (data_province?.data || []).map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
  const city = (data_city?.data || []).map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
  const industrialSector = (data_industrial_sector || []).map((item) => {
    return {
      value: item.Id,
      label: item.text,
    };
  });
  const district = (data_district?.data || []).map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
  const subDistrict = (data_sub_district?.data || []).map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
  const accountCategory = (data_account_Category || []).map((item) => {
    return {
      value: item.Id,
      label: item.text,
    };
  });
  const serviceType = (data_service_type || []).map((item) => {
    return {
      value: item.Id,
      label: item.text,
    };
  });
  const accountGroup = (data_account_group || []).map((item) => {
    return {
      value: item.Id,
      label: item.text,
    };
  });
  const sor = (data_sor || []).map((item) => {
    return {
      value: item.Id,
      label: item.name,
    };
  });
  const costCenter = (data_cost_center || []).map((item) => {
    return {
      value: item.Id,
      label: item.name,
    };
  });
  const gsizes = (data_Gsizes || []).map((item) => {
    return {
      value: item.Id,
      label: item.text,
    };
  });
  const customerSegment = (data_customerSegment || []).map((item) => {
    return {
      value: item.Id,
      label: item.text,
    };
  });
  const product = (data_product?.data || []).map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  const customer = (data_customer || []).map((item) => {
    return {
      value: item.Id,
      label: item.name,
    };
  });

  const listOption = {
    budget,
    province,
    city,
    district,
    subDistrict,
    industrialSector,
    accountCategory,
    accountGroup,
    serviceType,
    sor,
    costCenter,
    gsizes,
    customerSegment,
    product,
    customer,
  };

  // useEffect
  useEffect(() => {
    dispatch(getBudgetList());
    dispatch(getProvinceList());
    dispatch(getIndustrialSectorList());
    dispatch(getAccountCategoryList());
    dispatch(getServiceTypeList());
    dispatch(getSorList());
    dispatch(getCostCenterList());
    dispatch(getGsizesList());
    dispatch(getCustomerSegmentList());
    dispatch(getProductList());
    dispatch(getCustomerList());
  }, [dispatch]);

  const handleEditDataRecord = (data, key, index) => {
    const keyName = key + index;
    setEditDataRecord((prevState) => {
      return {
        ...prevState,
        [keyName]: data,
      };
    });
    if (index === `province`) {
      dispatch(getCityList(data?.value));
      formTableCriteria.resetFields(["city", "district", "subDistrict"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "city"]: undefined,
          [key + "district"]: undefined,
          [key + "subDistrict"]: undefined,
        };
      });
    }
    if (index === `city`) {
      dispatch(getDistrictList(data?.value));
      formTableCriteria.resetFields(["district", "subDistrict"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "district"]: undefined,
          [key + "subDistrict"]: undefined,
        };
      });
    }
    if (index === `district`) {
      dispatch(getSubDistrictList(data?.value));
      formTableCriteria.resetFields(["subDistrict"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "subDistrict"]: undefined,
        };
      });
    }
    if (index === `customerSegment`) {
      dispatch(getAccountGroupList(data?.value));
      formTableCriteria.resetFields(["accountGroup"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "accountGroup"]: undefined,
        };
      });
    }
    return data;
  };

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const edit = (record, field) => {
    setStoredData(true);
    setStatusAction("edit");
    formTableCriteria.setFieldsValue(record);
    const { key, ...extraProps } = record || {};
    const tempValue = { ...extraProps };
    for (const attribute in tempValue) {
      if (Object.hasOwnProperty.call(tempValue, attribute)) {
        const tempData = tempValue[attribute];
        setEditDataRecord((prevState) => {
          return {
            ...prevState,
            [`${key}${attribute}`]: tempData,
          };
        });
      }
    }
    setEditingKey(record.key);
    if (record?.province && record?.province?.value) {
      dispatch(getCityList(record?.province?.value));
    }
    if (record?.city && record?.city?.value) {
      dispatch(getDistrictList(record?.city?.value));
    }
    if (record?.district && record?.district?.value) {
      dispatch(getSubDistrictList(record?.district?.value));
    }
    if (record?.customerSegment && record?.customerSegment?.value) {
      dispatch(getAccountGroupList(record?.customerSegment?.value));
    }
  };

  const cancel = (record) => {
    setEditingKey("");
    if (statusAction === "add") {
      deleteRow(record);
    }
    setStatusAction("");
    setStoredData(false);
  };

  const save = async (key) => {
    try {
      const row = await formTableCriteria.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        const updatedRow = { ...item, ...row };
        newData.splice(index, 1, updatedRow);
        updateData(newData);
        setEditingKey("");
      }
      setStoredData(false);
      setStatusAction("");
      formTableCriteria.resetFields();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const addRow = () => {
    formTableCriteria.resetFields();
    setStoredData(true);
    setStatusAction("add");
    const newRow = {
      key: data
        .reduce((current, next) => {
          const nextKey = next.key || 0;
          return current > nextKey
            ? parseInt(current) + 1
            : parseInt(nextKey) + 1;
        }, 1)
        .toString(),
    };
    updateData((prevData) => [...prevData, newRow]);
    setEditingKey(newRow.key);
  };

  const deleteRow = (record) => {
    updateData((prevState) =>
      prevState.filter((item) => item.key !== record.key),
    );
    setStoredData(false);
  };

  const columns = () => {
    const temp = [
      {
        title: "NO",
        width: 60,
        dataIndex: "no",
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      ...columnsTableCriteriaTOS(
        listOption,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      {
        title: "ACTION",
        dataIndex: "operation",
        width: 240,
        fixed: "right",
        align: "center",
        render: (_, record) => {
          const editable = record.key === editingKey;
          return (
            <Space className="my-3 gap-2">
              {editable ? (
                <>
                  <ButtonComponent
                    onClick={() => cancel(record)}
                    type="default"
                  >
                    Cancel
                  </ButtonComponent>
                  <ButtonComponent
                    onClick={() => save(record.key)}
                    type="submit"
                  >
                    Save
                  </ButtonComponent>
                </>
              ) : (
                <div className="flex w-full justify-center gap-6">
                  <Tooltip title="Edit">
                    <div
                      className={`flex justify-center${
                        editingKey ? " cursor-not-allowed" : ""
                      }`}
                    >
                      <SVGIcon
                        name="IconEdit"
                        color={editingKey ? "#8D91A0" : "#ACC424"}
                        width={24}
                        onClick={!editingKey ? () => edit(record) : undefined}
                      />
                    </div>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <div
                      className={`flex justify-center${
                        record.type === "exist" || editingKey
                          ? " cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <SVGIcon
                        name="IconDelete"
                        color={
                          record.type !== "exist" && !editingKey
                            ? "#D90000"
                            : "#8D91A0"
                        }
                        width={24}
                        className={
                          record.type === "exist" || editingKey
                            ? "disabled"
                            : undefined
                        }
                        onClick={
                          record.type !== "exist" && !editingKey
                            ? () => deleteRow(record)
                            : undefined
                        }
                      />
                    </div>
                  </Tooltip>
                </div>
              )}
            </Space>
          );
        },
      },
    ];
    const filterCol =
      type !== "detail" ? temp : temp.filter((col) => col.title !== "ACTION");
    return filterCol.filter((col) =>
      col.title !== "NO" && col.title !== "ACTION"
        ? dataCriteria.includes(col.indexValue)
        : true,
    );
  };
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);

  const handleDisplayColumn = (value) => {
    setOptionSelectedCol(value);
  };

  const filterColumn = (dataColumn) => {
    return dataColumn.filter((col) => {
      return !optionSelectedCol.includes(col.title);
    });
  };

  const numColumns = 16;
  const numRows = columns()?.length;

  const maxWidth = 10000;
  const maxHeight = 300;

  const x = numColumns * 10;
  const y = numRows * 150;

  const validatedX = Math.min(x, maxWidth);
  const validatedY = Math.min(y, maxHeight);

  const scroll = {
    x: validatedX,
    y: validatedY,
  };

  const onChange = (_, __, ___, extra) => {
    setTotalData(extra?.currentDataSource?.length || 0);
  };

  return dataCriteria && dataCriteria.length > 0 && dataCriteria[0] !== 37 ? (
    <div className="flex flex-col w-full gap-4">
      {type !== "detail" ? (
        <div className="flex w-full justify-end">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
            onClick={!storedData ? addRow : undefined}
          >
            Create
          </ButtonComponent>
        </div>
      ) : null}
      <div className="relative flex flex-col w-full">
        <div
          className={`${
            totalData !== 0 ? "z-[1] absolute mt-4" : "my-4"
          } w-1/4 flex`}
        >
          <Select
            mode="multiple"
            placeholder="Show All Column"
            className={"w-full"}
            maxTagCount={3}
            onChange={handleDisplayColumn}
          >
            {columns()
              .map((col) => (
                <Select.Option
                  key={col.title}
                  value={col.title}
                  disabled={
                    optionSelectedCol.length > 3
                      ? optionSelectedCol.includes(col.title)
                        ? false
                        : true
                      : false
                  }
                >
                  {col.title}
                </Select.Option>
              ))
              .splice(1)}
          </Select>
        </div>
        <Form form={formTableCriteria} component={false}>
          <Table
            bordered
            className="w-full"
            dataSource={data}
            columns={filterColumn(
              columns().map((col) => ({
                ...col,
                onCell: (record) => ({
                  record,
                  inputType: col.inputType,
                  dataIndex: col.dataIndex,
                  title: col.title,
                  editing: isEditing(record),
                  options: col.option,
                  indexValue: col.indexValue,
                  dependDataIndex: col.dependDataIndex,
                  dataEditRecord: editDataRecord,
                  handleEditDataRecord: handleEditDataRecord,
                }),
              })),
            )}
            pagination={{
              position: ["topRight"],
              current: page,
              pageSize: pageSize,
              onChange: handleChange,
              className: "pr-1 w-3/4",
              style: { marginLeft: "auto", marginRight: 0 },
              showSizeChanger: true,
              showTotal: (total, range) =>
                `Showing ${range[0]} to ${range[1]} of ${total} records`,
            }}
            rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            scroll={scroll}
            onChange={onChange}
          />
        </Form>
      </div>
    </div>
  ) : null;
};

export default FunctionalTableCriteriaTOS;
