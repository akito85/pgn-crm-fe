import { Form, Input, Select, Table, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import { columnsTableCriteria } from "../columnTableCriteria";
import { useDispatch, useSelector } from "react-redux";
import {
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
} from "../../../../../redux/slices/product_promo/pricing";
import {
  getCustomerList,
  getCustomerSegmentList,
} from "../../../../../redux/slices/product_promo/tos";
import InputComponent from "../../../../../components/InputComponent";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  options = [],
  dependDataIndex,
  dataEditRecord,
  urlIndex,
  handleEditDataRecord = () => {},
  ...restProps
}) => {
  const key = record?.key || 0;
  const dataDepend = dependDataIndex
    ? dataEditRecord[key + dependDataIndex]
    : "";

  const filterOption = (input, option) =>
    option.props.children.toLowerCase().includes(input.toLowerCase());
  const getInputNode = (inputType) => {
    if (inputType === "select") {
      return (
        <Select
          showSearch
          optionFilterProp="children"
          filterOption={filterOption}
          labelInValue
          disabled={dependDataIndex ? !dataDepend : false}
        >
          {options.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      );
    } else {
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

const PricingDetailTableCriteria = ({
  type,
  data = [],
  dataCriteria = [],
  updateData = () => {},
  storedData = false,
  setStoredData = () => {},
}) => {
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const [formTableCriteria] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingKey, setEditingKey] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [editDataRecord, setEditDataRecord] = useState({});
  const [statusAction, setStatusAction] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const [totalData, setTotalData] = useState(0);

  useEffect(() => {
    setTotalData(data.length);
  }, [data]);

  useEffect(() => {
    if (type !== "detail" && type !== "preview") {
      dispatch(getBudgetList());
      dispatch(getProvinceList());
      dispatch(getIndustrialSectorList());
      dispatch(getAccountCategoryList());
      dispatch(getServiceTypeList());
      dispatch(getCustomerList());
      dispatch(getSorList());
      dispatch(getCostCenterList());
      dispatch(getGsizesList());
      dispatch(getCustomerSegmentList());
    }
  }, [type]);

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
    data_customer,
    data_customer_segment,
  } = useSelector((state) => state.pricing);

  // Data Select Criteria
  const budget = (data_budget || []).map((item) => {
    return {
      value: item.glbTypeValId,
      label: item.name,
    };
  });
  const province = (data_province || []).map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
  const city = (data_city || []).map((item) => {
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
  const district = (data_district || []).map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
  const subDistrict = (data_sub_district || []).map((item) => {
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
      value: item.id,
      label: item.name,
    };
  });
  const costCenter = (data_cost_center || []).map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
  const gsizes = (data_Gsizes || []).map((item) => {
    return {
      value: item.Id,
      label: item.text,
    };
  });
  const customerSegment = (data_customer_segment || []).map((item) => {
    return {
      value: item.Id,
      label: item.text,
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
    customer,
    customerSegment,
  };

  const handleEditDataRecord = (data, key, index) => {
    const keyName = key + index;
    setEditDataRecord((prevState) => {
      return {
        ...prevState,
        [keyName]: data,
      };
    });
    if (index === `provinceId`) {
      dispatch(getCityList(data?.value));
      formTableCriteria.resetFields(["cityId", "districtId", "subDistrictId"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "cityId"]: undefined,
          [key + "districtId"]: undefined,
          [key + "subDistrictId"]: undefined,
        };
      });
    }
    if (index === `cityId`) {
      dispatch(getDistrictList(data?.value));
      formTableCriteria.resetFields(["districtId", "subDistrictId"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "districtId"]: undefined,
          [key + "subDistrictId"]: undefined,
        };
      });
    }
    if (index === `districtId`) {
      dispatch(getSubDistrictList(data?.value));
      formTableCriteria.resetFields(["subDistrictId"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "subDistrictId"]: undefined,
        };
      });
    }
    if (index === `customerSegmentId`) {
      dispatch(getAccountGroupList(data?.value));
      formTableCriteria.resetFields(["accountGroupId"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "accountGroupId"]: undefined,
        };
      });
    }
    return data;
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  const handleChangeSize = (pageChange, pageSizeChange) => {
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
    if (record?.provinceId && record?.provinceId?.value) {
      dispatch(getCityList(record?.provinceId?.value));
    }
    if (record?.cityId && record?.cityId?.value) {
      dispatch(getDistrictList(record?.cityId?.value));
    }
    if (record?.districtId && record?.districtId?.value) {
      dispatch(getSubDistrictList(record?.districtId?.value));
    }
    if (record?.customerSegmentId && record?.customerSegmentId?.value) {
      dispatch(getAccountGroupList(record?.customerSegmentId?.value));
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
        const updatedRow = {
          ...item,
          ...row,
        };
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
      ...columnsTableCriteria(
        listOption,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      {
        title: "ACTION",
        width: 240,
        dataIndex: "operation",
        fixed: "right",
        render: (_, record) => {
          const editable = record.key === editingKey;
          return (
            <div className="flex w-full justify-center my-3 gap-2">
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
                <>
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
                        record.typeData === "exist" || editingKey
                          ? " cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <SVGIcon
                        name="IconDelete"
                        color={
                          record.typeData !== "exist" && !editingKey
                            ? "#D90000"
                            : "#8D91A0"
                        }
                        width={24}
                        className={
                          record.typeData === "exist" || editingKey
                            ? "disabled"
                            : undefined
                        }
                        onClick={
                          record.typeData !== "exist" && !editingKey
                            ? () => deleteRow(record)
                            : undefined
                        }
                      />
                    </div>
                  </Tooltip>
                </>
              )}
            </div>
          );
        },
      },
    ];
    const filterCol =
      type !== "detail" && type !== "preview"
        ? temp
        : temp.filter((col) => col.title !== "ACTION");
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

  const onChange = (_, __, ___, extra) => {
    setTotalData(extra?.currentDataSource?.length || 0);
  };

  return dataCriteria && dataCriteria.length > 0 && dataCriteria[0] !== 24 ? (
    <div className="flex flex-col w-full gap-4">
      {type !== "detail" && type !== "preview" ? (
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
      <div className={"relative flex flex-col w-full"}>
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
                  indexValue: col.indexValue,
                  dependDataIndex: col.dependDataIndex,
                  urlIndex: col.url,
                  options: col.option,
                  dataEditRecord: editDataRecord,
                  handleEditDataRecord: handleEditDataRecord,
                }),
              })),
            )}
            pagination={{
              position: ["topRight"],
              current: page,
              pageSize: pageSize,
              onChange: handleChangeSize,
              className: "pr-1 w-3/4",
              style: { marginLeft: "auto", marginRight: 0 },
              showSizeChanger: true,
              showTotal: (total, range) =>
                `Showing ${range[0]} to ${range[1]} of ${total} records`,
            }}
            rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
            scroll={{
              x: 1500,
              y: 300,
            }}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            onChange={onChange}
          />
        </Form>
      </div>
    </div>
  ) : null;
};

export default PricingDetailTableCriteria;
