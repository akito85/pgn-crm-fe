import React, { useCallback, useEffect, useState } from "react";
import {
  DatePicker,
  Form,
  Input,
  Pagination,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getColumnSearchProps } from "../../../../../../utils/getColumnSearchProps";
import moment from "moment";
import Highlighter from "react-highlight-words";
import { columnsTableCriteriaTOP } from "./TableCriteriaTOP";
import DateComponent from "../../../../../../components/DateComponent";
import {
  getAccountCategoryList,
  getAccountGroupList,
  getBudgetList,
  getCityList,
  getCostCenterList,
  getCustomer,
  getCustomerSegment,
  getDistrictList,
  getGsizesList,
  getIndustrialSectorList,
  getProvinceList,
  getServiceTypeList,
  getSorList,
  getSubDistrictList,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/termsofPayment";
import DetailText from "../../../../../../components/DetailText";
import { dateFormatting, hasValue } from "../../../../../../utils";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../../../components/Card/CardComponent";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import InputComponent from "../../../../../../components/InputComponent";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  options,
  required,
  dependDataIndex,
  disableDate,
  dataEditRecord,
  formTableCriteria,
  endDateHeader,
  validateStartDate,
  validateEndDate,
  handleEditDataRecord = () => { },
  ...restProps
}) => {
  const dispatch = useDispatch();
  const key = record?.key || 0;

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
    if (dataIndex === 'endDate' && hasValue(formTableCriteria.getFieldValue('startDate')) && hasValue(validateEndDate)) {
      return moment(formTableCriteria.getFieldValue('startDate')) > current || current > moment(validateEndDate).add(1, 'days')
    } else if (validateStartDate && validateEndDate) {
      const startDate = moment(validateStartDate).startOf("day");
      const endDate = moment(validateEndDate).endOf("day");
      return current.isBefore(startDate) || current.isAfter(endDate);
    } else {
      return true; // Disable all dates if start or end date is not defined
    }

    // if (validateStartDate && validateEndDate) {
    //   const startDate = moment(validateStartDate).startOf("day");
    //   const endDate = moment(validateEndDate).endOf("day");
    //   return current.isBefore(startDate) || current.isAfter(endDate);
    // }
    // return true; // Disable all dates if start or end date is not defined
  };

  // Validation Handle Start Date from Header Data
  const handleDisableDateBefore = (current) => {
    if (validateStartDate !== null) {
      return moment(validateStartDate) > current;
    }
    return moment().add(-1, "days") >= current;
  };

  const dataDepend = dependDataIndex
    ? dataEditRecord[key + dependDataIndex]
    : "";

  const getInputNode = (inputType) => {
    switch (inputType) {
      case "select":
        return (
          <Select
            showSearch
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
          rules={
            inputType !== "endDate"
              ? rules()
              : [
                {
                  validator: (_, value) =>
                    endDateValidator(
                      formTableCriteria.getFieldValue().startDate
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

const FunctionalTableCriteriaTOP = ({
  type,
  data = [],
  dataCriteria = [],
  disableDate,
  required,
  updateData = () => { },
  storedData = false,
  setStoredData = () => { },
  endDateHeader,
  status,
  statusApproval,
  showAction,
  validStartDate,
  validEndDate,
}) => {
  const searchInput = useRef(null);
  const [formTableCriteria] = Form.useForm();
  // const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [editingKey, setEditingKey] = useState("");
  // const [storedData, setStoredData] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [editDataRecord, setEditDataRecord] = useState({});
  const [statusAction, setStatusAction] = useState("");
  const [search, setSearch] = useState("");
  const [dataHistory, setDataHistory] = useState({});
  const [modalHistory, setModalHistory] = useState(false);
  const [modalValidationTable, setModalValidationTable] = useState(false);
  const isEditing = (record) => record.key === editingKey;

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
    data_customerSegment,
    data_customer,
  } = useSelector((state) => state.top);

  // Declaration
  const dispatch = useDispatch();

  // Data Select Criteria
  const budget = (data_budget || []).map((item) => {
    return {
      value: item.id,
      label: item.text,
    };
  });
  const province = (data_province || []).map((item) => {
    return {
      value: item.value,
      label: item.name,
    };
  });
  const city = (data_city || []).map((item) => {
    return {
      value: item.value,
      label: item.name,
    };
  });
  const industrialSector = (data_industrial_sector || []).map((item) => {
    return {
      value: item.id,
      label: item.text,
    };
  });
  const district = (data_district || []).map((item) => {
    return {
      value: item.value,
      label: item.name,
    };
  });
  const subDistrict = (data_sub_district || []).map((item) => {
    return {
      value: item.value,
      label: item.name,
    };
  });
  const accountCategory = (data_account_Category || []).map((item) => {
    return {
      value: item.id,
      label: item.text,
    };
  });
  const serviceType = (data_service_type || []).map((item) => {
    return {
      value: item.id,
      label: item.text,
    };
  });
  const accountGroup = (data_account_group || []).map((item) => {
    return {
      value: item.id,
      label: item.name,
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
      value: item.id,
      label: item.text,
    };
  });
  const customerSegment = (data_customerSegment || []).map((item) => {
    return {
      value: item.id,
      label: item.text,
    };
  });

  const customer = (data_customer || []).map((item) => {
    return {
      value: item.id,
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
    customer,
  };

  // useEffect=
  useEffect(() => {
    if (type !== "detail") {
      dispatch(getBudgetList());
      dispatch(getProvinceList());
      dispatch(getIndustrialSectorList());
      dispatch(getAccountCategoryList());
      dispatch(getServiceTypeList());
      dispatch(getSorList());
      dispatch(getCostCenterList());
      dispatch(getGsizesList());
      dispatch(getCustomerSegment());
      dispatch(getCustomer());
    }
  }, [type]);

  useEffect(() => {
    if (data.length > 0) {
      setTotalElement(data.length);
    }
  }, [data]);

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
    setSearch(
      selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`
    );
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  const edit = (record, field) => {
    setStoredData(true);
    setStatusAction("edit");
    formTableCriteria.setFieldsValue({
      ...record,
      startDate: moment(record.startDate),
      endDate: record.endDate ? moment(record.endDate) : undefined,
    });
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

  // Function Handle Detail
  const handleDetail = (r) => {
    setModalHistory(true);
    setDataHistory({
      recordId: r?.id,
      createdDate: r?.createdDate,
      createdBy: r?.createdBy,
      updatedDate: r?.updatedDate,
      updatedBy: r?.updatedBy,
    });
  };

  const closeModalHistory = () => {
    setModalHistory(false);
    setDataHistory({});
  };

  const checkOverlappingDate = useCallback((formHeaderValue, rowValue) => {
    // if (hasValue(formHeaderValue?.endDate)) {
    if (moment(rowValue?.startDate) < moment(formHeaderValue?.startDate)) {
      return true
    } else if (moment(rowValue?.endDate) > moment(formHeaderValue?.endDate)?.add(1, 'days') && hasValue(formHeaderValue?.endDate)) {
      return true
    } else {
      return false
    }
    // }
  }, []);

  const save = async (key) => {
    try {
      const row = await formTableCriteria.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      const isOverlappingDate = checkOverlappingDate({ startDate: validStartDate, endDate: validEndDate }, row);
      if (isOverlappingDate) {
        formTableCriteria.setFields([
          {
            name: 'startDate',
            errors: [`Overlapping date found`],
          },
          {
            name: 'endDate',
            errors: [`Overlapping date found`],
          },
        ]);
      } else {
        if (index > -1) {
          const item = newData[index];
          const dataExist = item?.type;
          let flag;
          if (dataExist !== "exist" && type === "update") {
            flag = 1;
          }
          if (dataExist === "exist" && type === "update") {
            flag = 2;
          }
          const updatedRow = { ...item, ...row, flag };
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
    // if (hasValue(formHeader?.endDate)) {
    dataTable?.forEach(item => {
      if (moment(item?.startDate) < moment(formHeader?.startDate) || moment(item?.endDate) > moment(formHeader?.endDate)?.add(1, 'days')) {
        dataOverlap?.push(item)
      }
    });

    if (dataOverlap?.length > 0) {
      return true
    } else {
      return false
    }
    // }

  }, []);


  const addRow = () => {
    const overlappingData = checkOverlappingData({ startDate: validStartDate, endDate: validEndDate }, data);

    if (overlappingData) {
      setModalValidationTable(true)
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

  const deleteRow = (record) => {
    updateData((prevState) =>
      prevState.filter((item) => item.key !== record.key)
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

      ...columnsTableCriteriaTOP(
        listOption,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        required
      ),
      {
        title: "ACTION",
        dataIndex: "operation",
        width: 240,
        fixed: "right",
        align: "center",
        render: (_, record) => {
          const editable = record.key === editingKey;
          const isDelete =
            (status === "DRAFT" && statusApproval === "DRAFT") ||
            record.type !== "exist";

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
                <div className="flex w-full justify-center gap-4">
                  {showAction === "show" ? (
                    <Tooltip title="Detail">
                      <div className="pt-1">
                        <SVGIcon
                          name="IconDetail"
                          width={24}
                          onClick={() => handleDetail(record)}
                        />
                      </div>
                    </Tooltip>
                  ) : (
                    <>
                      <Tooltip title="Update">
                        <div>
                          <SVGIcon
                            name="IconEdit"
                            color={editingKey ? "#8D91A0" : "#ACC424"}
                            className={
                              editingKey ? "cursor-not-allowed" : undefined
                            }
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
      type !== "detail" ? temp : temp.filter((col) => col.title !== "ACTION");
    return filterCol.filter((col) =>
      col.title !== "NO" &&
        col.title !== "ACTION" &&
        col.title !== "START DATE" &&
        col.title !== "END DATE"
        ? dataCriteria.includes(col.indexValue)
        : true
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
  const numRows = columns().length;

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

  return dataCriteria && dataCriteria.length > 0 && dataCriteria[0] !== 24 ? (
    <div className="flex flex-col w-full gap-4">
      {type !== "detail" && type !== "show" ? (
        <div className="flex w-full justify-end">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
            onClick={!storedData ? addRow : undefined}
            disabled={storedData}
          >
            Create
          </ButtonComponent>
        </div>
      ) : null}
      <div className={"w-full flex justify-between"}>
        <Select
          mode="multiple"
          placeholder="Show All Column"
          className={"w-2/6"}
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

        <Pagination
          total={totalElements}
          className={"pr-1"}
          showSizeChanger
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          onShowSizeChange={handleChange}
          showTotal={(total, range) =>
            `Showing ${range[0]} to ${range[1]} of ${total} records`
          }
        />
      </div>
      <Form form={formTableCriteria} component={false}>
        <div className="w-full">
          <Table
            bordered
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
                  required: col.required,
                  disableDate,
                  formTableCriteria: formTableCriteria,
                  endDateHeader: endDateHeader,
                  validateStartDate: validStartDate,
                  validateEndDate: validEndDate,
                }),
              }))
            )}
            rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            scroll={scroll}
            pagination={false}
            onChange={onSort}
          />
        </div>
      </Form>

      {/* Modal History Log */}
      <ModalCustom
        isOpen={modalHistory}
        handleCancel={closeModalHistory}
        type="detail"
        header="CRITERIA INFORMATION"
        width={800}
        footer={
          <ButtonComponent type={"default"} onClick={closeModalHistory}>
            Back
          </ButtonComponent>
        }
      >
        <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
          <DetailText label="Record ID">{dataHistory.recordId}</DetailText>
          <DetailText label="Created Date">
            {dataHistory?.createdDate
              ? moment(dataHistory.createdDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Created By">{dataHistory?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {dataHistory?.updatedDate
              ? moment(dataHistory.updatedDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Updated By">{dataHistory?.updatedBy}</DetailText>
        </CardComponent>
      </ModalCustom>

      {/* modal overlapping */}
      <ModalError
        isOpen={modalValidationTable}
        handleOk={() => setModalValidationTable(false)}
        handleCancel={() => setModalValidationTable(false)}
      // customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{`You can't add Criteria. Start date and end date can't be overlap`}</p>
        </div>
      </ModalError>
    </div>
  ) : null;
};

export default FunctionalTableCriteriaTOP;
