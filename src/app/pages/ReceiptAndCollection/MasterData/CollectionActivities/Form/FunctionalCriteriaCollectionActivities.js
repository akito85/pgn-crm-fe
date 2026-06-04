import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Form, Select, Space, Table, Tooltip } from "antd";
import { columnsTableCriteriaCollectionActivities } from "../Table/TableCriteriaCollectionActivities";
import SVGIcon from "../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import {
  getCustomerSegment,
  getAccountGroup,
  getAccountCategory,
  getServiceType,
  getIndustrialSector,
  getBudget,
  getSor,
  getCostCenter,
  getGsizes,
  getProvince,
  getCity,
  getDistrict,
  getSubDistrict,
  getCustomerCA,
} from "../../../../../../redux/slices/debt_and_collection/collectionActivities";
import DateComponent from "../../../../../../components/DateComponent";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import InputComponent from "../../../../../../components/InputComponent";
import { hasValue } from "../../../../../../utils";

const normalizeCollectionCriteriaIds = (criteriaIds = []) => {
  const normalizedValues = (Array.isArray(criteriaIds)
    ? criteriaIds
    : [criteriaIds]
  ).map((criteriaId) => {
    const normalizedValue = Number(criteriaId);
    return Number.isNaN(normalizedValue) ? criteriaId : normalizedValue;
  });

  const uniqueValues = normalizedValues.filter(
    (value, index) => normalizedValues.indexOf(value) === index
  );

  return uniqueValues.includes(24) ? [24] : uniqueValues;
};

const normalizeCriteriaStatus = (value) =>
  (value || "").toString().trim().toUpperCase();

const getFirstCriteriaOptionValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const toCriteriaOptionNumber = (value) => {
  const normalizedValue = Number(value);
  return Number.isNaN(normalizedValue) ? null : normalizedValue;
};

const toCriteriaOptionText = (value) =>
  value === undefined || value === null || value === ""
    ? null
    : value.toString();

const normalizeCriteriaOption = (item = {}) => {
  const value = getFirstCriteriaOptionValue(
    item?.value,
    item?.id,
    item?.customerNumber,
    item?.code,
    item
  );
  const label = toCriteriaOptionText(
    getFirstCriteriaOptionValue(
      item?.label,
      item?.text,
      item?.name,
      item?.customerNumber,
      item?.code,
      value
    )
  );

  return {
    ...item,
    value,
    label,
    criteriaValueText: toCriteriaOptionText(
      getFirstCriteriaOptionValue(
        item?.criteriaValueText,
        item?.code,
        item?.customerNumber,
        item?.text,
        item?.label,
        item?.name,
        label,
        value
      )
    ),
    criteriaValueNumber: toCriteriaOptionNumber(
      getFirstCriteriaOptionValue(
        item?.criteriaValueNumber,
        item?.id,
        item?.value
      )
    ),
    criteriaValueDisplay: toCriteriaOptionText(
      getFirstCriteriaOptionValue(
        item?.criteriaValueDisplay,
        item?.text,
        item?.label,
        item?.name,
        item?.customerNumber,
        item?.code,
        label,
        value
      )
    ),
  };
};

const normalizeSelectedCriteriaValue = (selectedValue, selectedOption) => {
  if (!selectedValue) {
    return selectedValue;
  }

  if (moment.isMoment(selectedValue)) {
    return selectedValue;
  }

  if (typeof selectedValue !== "object") {
    return selectedValue;
  }

  const optionObject = Array.isArray(selectedOption)
    ? selectedOption[0]
    : selectedOption;

  return normalizeCriteriaOption({
    ...(optionObject?.rawItem || {}),
    ...(optionObject || {}),
    value: selectedValue?.value,
    label: selectedValue?.label,
  });
};

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
  required,
  formTableCriteria,
  disableDate,
  validateStartDate,
  validateEndDate,
  handleEditDataRecord = () => {},
  ...restProps
}) => {
  const key = record?.key || 0;

  const dataDepend = dependDataIndex
    ? dataEditRecord[key + dependDataIndex]
    : "";

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

  const endDateValidator = (startDate) => (_, value) => {
    const momentStartDate = moment(startDate);
    const momentEndDate = moment(value);
    if ((value && momentStartDate <= momentEndDate) || !value) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("End Date must be after Start Date"));
    }
  };

  const handleDisableDateBetween = (current) => {
    if (!current) return false;

    const headerStart = validateStartDate
      ? moment(validateStartDate).startOf("day")
      : null;
    const headerEnd = validateEndDate
      ? moment(validateEndDate).endOf("day")
      : null;
    const rowStart = formTableCriteria.getFieldValue("startDate")
      ? moment(formTableCriteria.getFieldValue("startDate")).startOf("day")
      : null;

    if (headerStart && current.isBefore(headerStart, "day")) return true;
    if (headerEnd && current.isAfter(headerEnd, "day")) return true;
    if (
      dataIndex === "endDate" &&
      rowStart &&
      current.isBefore(rowStart, "day")
    ) {
      return true;
    }

    return false;
  };

  const handleDisableDateBefore = (current) => {
    if (!current) return false;
    if (validateStartDate) {
      return current.isBefore(moment(validateStartDate).startOf("day"), "day");
    }
    return current.isBefore(moment().startOf("day"), "day");
  };

  const getInputNode = (inputType) => {
    switch (inputType) {
      case "select":
        return (
          <Select
            showSearch
            allowClear
            optionFilterProp="label"
            labelInValue
            disabled={dependDataIndex ? !dataDepend : false}
            options={options}
            filterOption={(input, option) =>
              `${option?.label ?? ""}`
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        );
      case "startDate":
        return (
          <DateComponent
            dateDisable={
              validateEndDate === null || validateEndDate === undefined
                ? handleDisableDateBefore
                : handleDisableDateBetween
            }
            disabled={validateStartDate === null}
          />
        );
      case "endDate":
        return (
          <DateComponent
            disabled={
              formTableCriteria.getFieldValue().startDate === null ||
              formTableCriteria.getFieldValue().startDate === undefined
            }
            dateDisable={
              validateEndDate === null || validateEndDate === undefined
                ? handleDisableDateBefore
                : handleDisableDateBetween
            }
          />
        );
      default:
        return <InputComponent placeholder={`Input ${title}`} />;
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
          style={{ margin: 0 }}
          valuePropName={"value"}
          getValueFromEvent={(...args) =>
            handleEditDataRecord(args[0], key, dataIndex, args[1])
          }
          rules={
            inputType !== "endDate"
              ? rules()
              : [
                  {
                    validator: (_, value) =>
                      endDateValidator(
                        formTableCriteria.getFieldValue().startDate,
                      )(_, value),
                  },
                ]
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

const FunctionalCriteriaCollectionActivities = ({
  type,
  data = [],
  dataCriteria = [],
  updateData = () => {},
  storedData = false,
  setStoredData = () => {},
  required,
  disableDate,
  status,
  statusApproval,
  showAction,
  validStartDate,
  validEndDate,
}) => {
  // selector
  const {
    data_customer_segment,
    data_account_group,
    data_account_category,
    data_service_type,
    data_industrial_sector,
    data_budget,
    data_sor,
    data_cost_center,
    data_gsizes,
    data_province,
    data_city,
    data_district,
    data_sub_district,
    data_customer_ca,
  } = useSelector((state) => state.collectionActivities);

  // Declaration
  const dispatch = useDispatch();

  const searchInput = useRef(null);
  const [formTableCriteria] = Form.useForm();
  const isEditing = (record) => record.key === editingKey;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [editingKey, setEditingKey] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [statusAction, setStatusAction] = useState("");
  const [editDataRecord, setEditDataRecord] = useState({});
  const [modalValidationTable, setModalValidationTable] = useState(false);

  // Use Effect
  useEffect(() => {
    setTotalData(data.length);
  }, [data]);

  useEffect(() => {
    if (type !== "detail" && type !== "preview") {
      dispatch(getCustomerSegment());
      dispatch(getAccountCategory());
      dispatch(getServiceType());
      dispatch(getIndustrialSector());
      dispatch(getBudget());
      dispatch(getSor());
      dispatch(getCostCenter());
      dispatch(getGsizes());
      dispatch(getProvince());
      dispatch(getCustomerCA());
    }
  }, [type, dispatch]);

  // Helper: normalize API response → { value, label } array
  const toOptions = (arr) =>
    (Array.isArray(arr) ? arr : []).map((item) => ({
      ...normalizeCriteriaOption(
        typeof item === "object" ? item : { value: item, label: item }
      ),
      rawItem: item,
    }));

  // Declare data list option
  const listOption = {
    customerSegment: toOptions(data_customer_segment),
    accountGroup: toOptions(data_account_group),
    accountCategory: toOptions(data_account_category),
    serviceType: toOptions(data_service_type),
    industrialSector: toOptions(data_industrial_sector),
    budget: toOptions(data_budget),
    sor: toOptions(data_sor),
    costCenter: toOptions(data_cost_center),
    gsizes: toOptions(data_gsizes),
    province: toOptions(data_province),
    city: toOptions(data_city),
    district: toOptions(data_district),
    subDistrict: toOptions(data_sub_district),
    customer: toOptions(data_customer_ca),
  };

  // Handle Edit Data Record (with cascading for location and account group)
  const handleEditDataRecord = (val, key, index, selectedOption) => {
    const keyName = key + index;
    const normalizedValue = normalizeSelectedCriteriaValue(val, selectedOption);
    setEditDataRecord((prevState) => {
      const next = { ...prevState, [keyName]: normalizedValue };
      // Province → City cascade
      if (index === "province") {
        dispatch(getCity(normalizedValue?.value));
        formTableCriteria.resetFields(["city", "district", "subDistrict"]);
        next[key + "city"] = undefined;
        next[key + "district"] = undefined;
        next[key + "subDistrict"] = undefined;
      }
      // City → District cascade
      if (index === "city") {
        dispatch(getDistrict(normalizedValue?.value));
        formTableCriteria.resetFields(["district", "subDistrict"]);
        next[key + "district"] = undefined;
        next[key + "subDistrict"] = undefined;
      }
      // District → Sub-District cascade
      if (index === "district") {
        dispatch(getSubDistrict(normalizedValue?.value));
        formTableCriteria.resetFields(["subDistrict"]);
        next[key + "subDistrict"] = undefined;
      }
      // Customer Segment → Account Group cascade
      if (index === "customerSegment") {
        dispatch(getAccountGroup(normalizedValue?.value));
        formTableCriteria.resetFields(["accountGroup"]);
        next[key + "accountGroup"] = undefined;
      }
      return next;
    });
    return normalizedValue;
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

  // Handle Change page and pageSize
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // Function Edit Data
  const edit = (record) => {
    setStoredData(true);
    setStatusAction("edit");
    formTableCriteria.setFieldsValue({
      ...record,
      startDate: hasValue(record?.startDate) ? moment(record.startDate) : null,
      endDate: record?.endDate ? moment(record.endDate) : undefined,
    });
    const { key, ...extraProps } = record || {};
    const tempValue = { ...extraProps };
    for (const attribute in tempValue) {
      if (Object.hasOwnProperty.call(tempValue, attribute)) {
        const tempData = tempValue[attribute];
        setEditDataRecord((prevState) => ({
          ...prevState,
          [`${key}${attribute}`]: tempData,
        }));
      }
    }
    // Load dependent dropdowns for existing values
    if (record?.province?.value) dispatch(getCity(record.province.value));
    if (record?.city?.value) dispatch(getDistrict(record.city.value));
    if (record?.district?.value) dispatch(getSubDistrict(record.district.value));
    if (record?.customerSegment?.value) dispatch(getAccountGroup(record.customerSegment.value));
    setEditingKey(record.key);
  };

  // Function Cancel Data
  const cancel = (record) => {
    setEditingKey("");
    if (statusAction === "add") {
      deleteRow(record);
    }
    setStatusAction("");
    setStoredData(false);
  };

  const checkOverlappingDate = useCallback((formHeaderValue, rowValue) => {
    if (
      moment(rowValue?.startDate).startOf("day") <
      moment(formHeaderValue?.startDate).startOf("day")
    ) {
      return true;
    } else {
      return false;
    }
  }, []);

  // Function Save Data
  const save = async (key) => {
    try {
      const row = await formTableCriteria.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      const isOverlappingDate = checkOverlappingDate(
        { startDate: validStartDate, endDate: validEndDate },
        row
      );
      if (isOverlappingDate) {
        formTableCriteria.setFields([
          {
            name: "startDate",
            errors: [`Overlapping date found`],
          },
        ]);
      } else {
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
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  // check has overlapping data
  const checkOverlappingData = useCallback((formHeader, dataTable) => {
    const dataOverlap = [];
    dataTable?.forEach((item) => {
      if (moment(item?.startDate) < moment(formHeader?.startDate)) {
        dataOverlap?.push(item);
      }
    });

    if (dataOverlap?.length > 0) {
      return true;
    } else {
      return false;
    }
  }, []);

  // Function Add Row Data
  const addRow = () => {
    const hasOverlapping = checkOverlappingData(
      { startDate: validStartDate, endDate: validEndDate },
      data
    );
    if (hasOverlapping) {
      setModalValidationTable(true);
    } else {
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
    }
  };

  // Function Delete Row
  const deleteRow = (record) => {
    updateData((prevState) =>
      prevState.filter((item) => item.key !== record.key)
    );
    setStoredData(false);
  };

  // Columns Table
  const columns = () => {
    const normalizedCriteriaIds = normalizeCollectionCriteriaIds(dataCriteria);
    const temp = [
      {
        title: "NO",
        width: 60,
        dataIndex: "no",
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      ...columnsTableCriteriaCollectionActivities(
        listOption,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      {
        title: "ACTION",
        dataIndex: "operation",
        width: 240,
        fixed: "right",
        align: "center",
        render: (_, record) => {
          const editable = record.key === editingKey;
          const normalizedStatus = normalizeCriteriaStatus(status);
          const normalizedStatusApproval = normalizeCriteriaStatus(statusApproval);
          const isDelete =
            (normalizedStatus === "DRAFT" && normalizedStatusApproval === "DRAFT") ||
            record.type !== "exist";

          return (
            <Space className="my-3 gap-2">
              {editable ? (
                <>
                  <ButtonComponent onClick={() => cancel(record)} type="default">
                    Cancel
                  </ButtonComponent>
                  <ButtonComponent onClick={() => save(record.key)} type="submit">
                    Save
                  </ButtonComponent>
                </>
              ) : (
                <div className="flex w-full justify-center gap-4">
                  {showAction === "show" ? (
                    null
                  ) : (
                    <>
                      <Tooltip title="Edit">
                        <div>
                          <SVGIcon
                            name="IconEdit"
                            color={editingKey ? "#8D91A0" : "#ACC424"}
                            className={`${
                              editingKey ? "cursor-not-allowed" : ""
                            }`}
                            width={24}
                            onClick={
                              !editingKey ? () => edit(record) : undefined
                            }
                          />
                        </div>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <div>
                          <SVGIcon
                            name="IconDelete"
                            color={
                              isDelete && !editingKey ? "#D90000" : "#8D91A0"
                            }
                            width={24}
                            className={
                              isDelete && !editingKey
                                ? undefined
                                : "disabled cursor-not-allowed"
                            }
                            onClick={
                              isDelete && !editingKey
                                ? () => deleteRow(record)
                                : undefined
                            }
                          />
                        </div>
                      </Tooltip>
                    </>
                  )}
                </div>
              )}
            </Space>
          );
        },
      },
    ];
    const filterCol =
      type !== "detail" && type !== "preview"
        ? temp
        : temp.filter((col) => col.title !== "ACTION");
        
    // Filter out columns based on what criteria is selected. 
    // If dataCriteria does not include the column's indexValue, hide it. 
    // Unless indexValue is < 0 (like NO, ACTION, START DATE)
    return filterCol.filter((col) => {
       if (col.indexValue !== undefined && col.indexValue > 0) {
           return normalizedCriteriaIds.includes(col.indexValue);
       }
       return true;
    });
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

  const normalizedCriteriaIds = normalizeCollectionCriteriaIds(dataCriteria);

  const numRows = columns()?.length;
  const scroll = {
    x: Math.max(
      columns().reduce((totalWidth, col) => totalWidth + (col.width || 150), 0),
      1200
    ),
    y: Math.min(numRows * 75, 300),
  };

  const onTableChange = (_, __, ___, extra) => {
    setTotalData(extra?.currentDataSource?.length || 0);
  };

  return (
    <>
      {normalizedCriteriaIds.length > 0 && normalizedCriteriaIds[0] !== 24 ? (
        <div className="flex flex-col w-full gap-4">
          {type !== "detail" && type !== "preview" && type !== "show" ? (
            <div className="flex w-full justify-end">
              <ButtonComponent
                disabled={storedData}
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
                      dependDataIndex: col.dependDataIndex,
                      dataEditRecord: editDataRecord,
                      handleEditDataRecord: handleEditDataRecord,
                      required: col.required,
                      disableDate,
                      formTableCriteria: formTableCriteria,
                      validateStartDate: validStartDate,
                      validateEndDate: validEndDate,
                    }),
                  }))
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
                rowClassName={(record) =>
                  isEditing(record) ? "editable-row" : ""
                }
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                scroll={scroll}
                onChange={onTableChange}
              />
            </Form>
          </div>
        </div>
      ) : null}

      <ModalError
        isOpen={modalValidationTable}
        handleOk={() => setModalValidationTable(false)}
        handleCancel={() => setModalValidationTable(false)}
        customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">Failed</p>
          </div>
          <p className="pl-[70px]">
            Start date cannot be less than Start Date Header.
          </p>
        </div>
      </ModalError>
    </>
  );
};

export default FunctionalCriteriaCollectionActivities;
