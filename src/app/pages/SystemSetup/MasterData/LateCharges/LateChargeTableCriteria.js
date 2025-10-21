import { Form, Input, Select, Table, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import { columnsTableCriteria } from "./columnTableCriteria";
import { useDispatch, useSelector } from "react-redux";
import {
  getCountryList,
  getProvinceList,
  getCityList,
  getCostCenterList,
  getSorList,
  getDistrictList,
  getSubDistrictList,
  getAccountNumberList,
  getClassificationTypeList,
  getAccountSegment,
  getSATypeList,
  getAccountCategoryList,
  getAccountGroupList,
  getAccountTypeList,
} from "../../../../../redux/slices/account_management/MasterData/late_charges";
import DateComponent from "../../../../../components/DateComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../../components/Card/CardComponent";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";
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
  required,
  formTableCriteria,
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
  const handleDisableEndDate = (current) => {
    if (formTableCriteria.getFieldValue().startDate !== null) {
      return (
        moment(formTableCriteria.getFieldValue().startDate) > current ||
        moment(formTableCriteria.getFieldValue().startDate) > current
      );
    }
    return moment().add(-1, "days") >= current;
  };

  const filterOption = (input, option) =>
    option.props.children.toLowerCase().includes(input.toLowerCase());

  const getInputNode = (inputType) => {
    switch (inputType) {
      case "select":
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
      case "startDate":
        return <DateComponent />;
      case "endDate":
        return (
          <DateComponent
            disabled={formTableCriteria.getFieldValue().startDate === null}
            dateDisable={handleDisableEndDate}
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
          getValueFromEvent={(e) => {
            const value = e && e.target ? e.target.value : e;
            handleEditDataRecord(value, key, dataIndex);
            return value;
          }}
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

const LateChargeTableCriteria = ({
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
  const [modalHistory, setModalHistory] = useState(false);
  const [dataHistory, setDataHistory] = useState(false);

  useEffect(() => {
    setTotalData(data.length);
  }, [data]);

  useEffect(() => {
    if (type !== "detail" && type !== "preview") {
      dispatch(getCountryList());
      dispatch(getAccountCategoryList());
      dispatch(getSorList());
      dispatch(getCostCenterList());
      dispatch(getAccountNumberList());
      dispatch(getClassificationTypeList());
      dispatch(getAccountSegment());
      dispatch(getSATypeList());
      dispatch(getAccountTypeList());
    }
  }, [type]);

  const {
    accountCategoryList = [],
    saTypeList = [],
    accountTypeList = [],
    accountSegmentList = [],
    accountGroupTypeList = [],
    accountNumberList = [],
    classificationTypeList = [],
    sorList = [],
    costCenterList = [],
    premiseCountryList = [],
    premiseProvinceList = [],
    premiseCityList = [],
    premiseDistrictList = [],
    premiseSubdistrictList = [],
  } = useSelector((state) => state.late_charge);

  const listOption = {
    accountCategory: accountCategoryList,
    saType: saTypeList,
    accountType: accountTypeList,
    accountSegment: accountSegmentList,
    accountGroupType: accountGroupTypeList,
    accountNumber: accountNumberList,
    classificationType: classificationTypeList,
    sor: sorList,
    costCenter: costCenterList,
    premiseCountry: premiseCountryList,
    premiseProvince: premiseProvinceList,
    premiseCity: premiseCityList,
    premiseDistrict: premiseDistrictList,
    premiseSubdistrict: premiseSubdistrictList,
  };

  const handleEditDataRecord = (data, key, index) => {
    const keyName = key + index;
    setEditDataRecord((prevState) => {
      return {
        ...prevState,
        [keyName]: data,
      };
    });
    if (index === `premiseCountry`) {
      dispatch(getProvinceList(data?.value));
      formTableCriteria.resetFields([
        "premiseProvince",
        "premiseCity",
        "premiseDistrict",
        "premiseSubdistrict",
      ]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "premiseProvince"]: undefined,
          [key + "premiseCity"]: undefined,
          [key + "premiseDistrict"]: undefined,
          [key + "premiseSubdistrict"]: undefined,
        };
      });
    }
    if (index === `premiseProvince`) {
      dispatch(getCityList(data?.value));
      formTableCriteria.resetFields([
        "premiseCity",
        "premiseDistrict",
        "premiseSubdistrict",
      ]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "premiseCity"]: undefined,
          [key + "premiseDistrict"]: undefined,
          [key + "premiseSubdistrict"]: undefined,
        };
      });
    }
    if (index === `premiseCity`) {
      dispatch(getDistrictList(data?.value));
      formTableCriteria.resetFields(["premiseDistrict", "premiseSubdistrict"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "premiseDistrict"]: undefined,
          [key + "premiseSubdistrict"]: undefined,
        };
      });
    }
    if (index === `premiseDistrict`) {
      dispatch(getSubDistrictList(data?.value));
      formTableCriteria.resetFields(["premiseSubdistrict"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "premiseSubdistrict"]: undefined,
        };
      });
    }
    if (index === `accountSegment`) {
      dispatch(getAccountGroupList(data?.value));
      formTableCriteria.resetFields(["accountGroupType"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "accountGroupType"]: undefined,
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
    if (record?.premiseCountry && record?.premiseCountry?.value) {
      dispatch(getProvinceList(record?.premiseCountry?.value));
    }
    if (record?.premiseProvince && record?.premiseProvince?.value) {
      dispatch(getCityList(record?.premiseProvince?.value));
    }
    if (record?.premiseCity && record?.premiseCity?.value) {
      dispatch(getDistrictList(record?.premiseCity?.value));
    }
    if (record?.premiseDistrict && record?.premiseDistrict?.value) {
      dispatch(getSubDistrictList(record?.premiseDistrict?.value));
    }
    if (record?.accountSegment && record?.accountSegment?.value) {
      dispatch(getAccountGroupList(record?.accountSegment?.value));
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

  const handleDetailHistory = (record) => {
    setModalHistory(true);
    setDataHistory(record);
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
        width: 230,
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
                <div className="flex w-full justify-center gap-4">
                  {type === "detail" ? (
                    <Tooltip title="Detail">
                      <div className="pt-1">
                        <SVGIcon
                          name="IconDetail"
                          width={24}
                          onClick={() => handleDetailHistory(record)}
                        />
                      </div>
                    </Tooltip>
                  ) : (
                    <>
                      <Tooltip title="Update">
                        <div
                          className={`flex justify-center${
                            editingKey ? " cursor-not-allowed" : ""
                          }`}
                        >
                          <SVGIcon
                            name="IconEdit"
                            color={editingKey ? "#8D91A0" : "#ACC424"}
                            width={24}
                            onClick={
                              !editingKey ? () => edit(record) : undefined
                            }
                          />
                        </div>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <div
                          className={`flex justify-center${
                            record.typeData === "exist"
                              ? " cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <SVGIcon
                            name="IconDelete"
                            color={
                              record.typeData !== "exist"
                                ? "#D90000"
                                : "#8D91A0"
                            }
                            width={24}
                            className={
                              record.typeData === "exist"
                                ? "disabled"
                                : undefined
                            }
                            onClick={
                              record.typeData !== "exist"
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
            </div>
          );
        },
      },
    ];
    const filterCol =
      type !== "preview" ? temp : temp.filter((col) => col.title !== "ACTION");
    return filterCol.filter((col) =>
      col.title !== "NO" &&
      col.title !== "ACTION" &&
      col.title !== "START DATE" &&
      col.title !== "END DATE" &&
      col.title !== "DESCRIPTION"
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
  return dataCriteria && dataCriteria.length > 0 && dataCriteria[0] !== 255 ? (
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
                  indexValue: col.indexValue,
                  dependDataIndex: col.dependDataIndex,
                  urlIndex: col.url,
                  options: col.option,
                  required: col.required,
                  dataEditRecord: editDataRecord,
                  handleEditDataRecord: handleEditDataRecord,
                  formTableCriteria: formTableCriteria,
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
              // x: 1500,
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

      {/* Modal History Log */}
      <ModalCustom
        isOpen={modalHistory}
        handleCancel={() => {
          setModalHistory(false);
        }}
        type="detail"
        header="DETAIL INFORMATION"
        width={800}
        footer={
          <ButtonComponent
            type={"default"}
            onClick={() => {
              setModalHistory(false);
            }}
          >
            Back
          </ButtonComponent>
        }
      >
        <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
          <DetailText label="Record ID">{dataHistory.id}</DetailText>
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
      {/* End Modal History Log */}
    </div>
  ) : null;
};

export default LateChargeTableCriteria;
