import { useEffect, useState, useRef, useCallback, useMemo, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Button, Checkbox, Form, Input, Select, Space, Tooltip } from "antd";
import NxTable from "../../../../components/Nx/NxTable";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";
import SVGIcon from "../../../../assets/Icon/index";
import DateComponent from "../../../../components/DateComponent";
import { NumericFormat } from "react-number-format";
import { columnsTableCriteriaPromo } from "../PromoDiscount/Table/TableCriteriaPromo";
import { hasValue } from "../../../../utils";
import { dataDependAdvanced, dataDepended, handleMappingBodyTiering } from "./UtilsAllProduct";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import NxModal from "../../../../components/Nx/NxModal";
import NxDetailText from "../../../../components/Nx/NxDetailText";
import NxDate from "../../../../components/Nx/NxDatePicker";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";

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
  startDate,
  endDate,
  requiredDate,
  indexValue,
  type,
  handleEditDataRecord = () => {},
  ...restProps
}) => {
  const dispatch = useDispatch();
  const key = record?.key || 0;

  const disabledCondition = (dependDataIndex, dataIndex, record) => {
    // Status-based field disabling for update type
    if (type === "update" && record?.status) {
      const status = record.status;
      // INACTIVE: all fields disabled (shouldn't happen since edit icon is disabled)
      if (status === "INACTIVE") {
        return true;
      }
      // ACTIVE: only endDate is editable
      if (status === "ACTIVE") {
        return dataIndex !== "endDate";
      }
      // DRAFT: all fields editable (fall through to normal logic)
    }

    return dataDependAdvanced(dependDataIndex, key, dataEditRecord);
    // ||
    // record[dataIndex]?.disabled ||
    // checkEditableUnCriteria(dataIndex, record?.dataType)
  };

  const rules = (dataIndex) => {
    let rules = [];
    if (required) {
      rules.push({
        required: required === undefined || required === false ? false : true,
        message: `Please input your ${title.toLowerCase()}!`,
      });
    } else if (dataIndex === "tiering") {
      if ((options || [])?.length > 0) {
        rules.push({
          required:
            (hasValue(dataEditRecord[key + dependDataIndex]?.value) &&
              dataEditRecord[key + dependDataIndex]?.value === 2302) ||
            dataEditRecord[key + dependDataIndex]?.value === 2301,
          message: `Please input your ${title.toLowerCase()}!`,
        });
      }
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

  const handleDisableDate = (current) => {
    const currentDate = moment(current).startOf("day"); // Ensure current is also only the day
    if (dataIndex === "endDate") {
      if (
        requiredDate &&
        hasValue(formTableCriteria.getFieldValue("startDate")) &&
        hasValue(endDate)
      ) {
        //checked start date inline and end date header
        return !(
          currentDate.isSameOrAfter(
            moment(formTableCriteria.getFieldValue("startDate"))?.startOf("day")
          ) && currentDate.isSameOrBefore(moment(endDate).startOf("day"))
        );
        // return (
        //   moment(formTableCriteria.getFieldValue("startDate")) > current ||
        //   current > moment(endDate)
        // );
      } else if (hasValue(formTableCriteria.getFieldValue("startDate"))) {
        return !(currentDate?.isSameOrAfter(
          moment(formTableCriteria.getFieldValue().startDate)?.startOf("day")
        ));
        // return moment(formTableCriteria.getFieldValue().startDate) > current; // no end date header
      } else {
        return false; //no start date value
      }
    } else if (dataIndex === "startDate") {
      const start = moment(startDate).startOf("day"); // Set startDate to the beginning of the day (00:00:00)
      if (hasValue(endDate)) {
        const end = moment(endDate).startOf("day"); // Set endDate to the beginning of the day

        return !(
          currentDate.isSameOrAfter(start) && currentDate.isSameOrBefore(end)
        );
        // return moment(current)?.isSameOrAfter(moment(startDate)) &&
        // moment(current).isSameOrBefore(moment(endDate));
      } else {
        return hasValue(startDate) ? !(currentDate?.isSameOrAfter(start)) : false;
      }
    } else {
      return moment().add(-1, "days") >= current;
    }
  };

  const getInputNode = (inputType) => {
    switch (inputType) {
      case "select":
        return (
          <Select
            showSearch
            allowClear
            optionFilterProp="children"
            labelInValue
            disabled={
              disabledCondition(dependDataIndex, dataIndex, record) ||
              dataDepended(dependDataIndex, dataIndex, record, dataEditRecord)
            }
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
            onChange={(e) => {
              formTableCriteria.resetFields(["endDate"]);
            }}
            disabled={disabledCondition(dependDataIndex, dataIndex, record)}
            dateDisable={handleDisableDate}
          />
        );

      case "endDate":
        return (
          <DateComponent
            disabled={
              (formTableCriteria.getFieldValue().startDate === null ||
               formTableCriteria.getFieldValue().startDate === undefined) ||
              (type === "update" && record?.status === "INACTIVE")
            }
            dateDisable={handleDisableDate}
          />
        );
      case "number":
        return (
          <NumericFormat
            allowNegative={false}
            className={"text-right custom-focus w-full"}
            decimalScale={2}
            fixedDecimalScale={true}
            thousandSeparator={","}
            decimalSeparator={"."}
            disabled={disabledCondition(dependDataIndex, dataIndex, record)}
            style={{
              borderRadius: "6px",
              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
              padding: "4px 12px",
              border: "1px solid  #d9d9d9",
              height: "32px",
            }}
          />
        );
      default:
        return (
          <Input
            disabled={disabledCondition(dependDataIndex, dataIndex, record)}
          />
        );
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
              ? rules(dataIndex)
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

const FunctionalCriteriaProduct = ({
  type,
  data = [],
  dataCriteria = [],
  updateData = () => {},
  storedData = false,
  setStoredData = () => {},
  // disableDate,
  startDate,
  endDate,
  columnsTable = [...(columnsTableCriteriaPromo || [])], //columns for criteria
  getApi = () => {}, //api for ddl
  selector = "product", // selector general
  fixedColumn = ["NO", "ACTION", "START DATE", "END DATE"], //if anyone need fixed column on form
  dataListExternal = {},
  checkStartDate = true, //check product has date validation
  excludeRender = null,
  showInactivate = false, // opt-in per consumer
  countryCriteriaId,
}) => {
  // Selector
  const {
    data_budget,
    data_country,
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
    data_adjustment_type,
    data_uom,
    data_from_item,
    data_tiering,
    data_product,
    data_product_version,
  } = useSelector((state) => state[selector]);
  const { data: dataUser = {} } = useSelector((state) => state.profile);

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
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  // const [filteredColumn, setFilteredColumn] = useState({})
  const [statusAction, setStatusAction] = useState("");
  const [editDataRecord, setEditDataRecord] = useState({});
  // console.log(search, searchedColumn, searchText, "search searchCol searchText")
  const [modalHistory, setModalHistory] = useState(false);
  const [modalRequired, setModalRequired] = useState(false);
  const [dataHistory, setDataHistory] = useState(false);
  const [modalValidationTable, setModalValidationTable] = useState(false);

  // Use Effect
  useEffect(() => {
    setTotalData(data.length);
  }, [data]);

  // Declare data list option
  const listOption = {
    data_budget,
    data_country,
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
    data_adjustment_type,
    data_uom,
    data_from_item,
    data_tiering,
    data_product,
    data_product_version,
    ...{ dataListExternal },
  };

  useEffect(() => {
    setSearch({});
    if(editingKey && hasValue(editingKey)){
      formTableCriteria.resetFields(["tiering", "fromItem"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [editingKey + "fromItem"]: undefined,
          [editingKey + "tiering"]: undefined,
        };
      });
    }
  }, [dataCriteria, formTableCriteria]);

  useEffect(() => {
    if (type !== "detail" && type !== "preview" && dataCriteria?.length > 0){
      [...columnsTable(
        listOption,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        search,
        storedData,
        countryCriteriaId
      )]
        ?.filter(
          (item) =>
            ([...dataCriteria]?.includes(item?.indexValue) &&
              !hasValue(item?.dependDataIndex)) ||
            fixedColumn?.includes(item?.title)
        )
        ?.forEach((element) => {
          if (
            hasValue(element?.url) && !hasValue(element?.dependDataIndex) &&
            (!hasValue(listOption[element?.dataIndexForm]) ||
              listOption[element?.dataIndexForm].length < 1)
          ) {
            dispatch(getApi?.[element?.url]());
          }
        });
    }
  },[dispatch, type, dataCriteria])

  // Handle Edit Data Record
  const handleEditDataRecord = useCallback((data, key, index) => {
    const keyName = key + index;
    const value =
      index === "description" ||
      index === "adjustmentValue" ||
      index === "maxValueUom"
        ? data.target.value
        : data;
    setEditDataRecord((prevState) => {
      return {
        ...prevState,
        [keyName]: value,
      };
    });
    if (index === "product") {
      if (dataCriteria.includes(38)) {
        dispatch(getApi?.getProductVersionList(data?.value));
      }
      formTableCriteria.resetFields(["productVersion"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "productVersion"]: undefined,
        };
      });
    }
    if (index === "country") {
      if (hasValue(countryCriteriaId) && dataCriteria.includes(countryCriteriaId)) {
        const dispatchProvinceByCountry = getApi?.getProvinceListByCountry || getApi?.getProvinceList;
        dispatch(dispatchProvinceByCountry?.(data?.value));
      }
      formTableCriteria.resetFields(["province", "city", "district", "subDistrict"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "province"]: undefined,
          [key + "city"]: undefined,
          [key + "district"]: undefined,
          [key + "subDistrict"]: undefined,
        };
      });
    }
    if (index === `province`) {
      if (dataCriteria.includes(39) || (dataCriteria.includes(28))) {
        dispatch(getApi?.getCityList(data?.value));
      }
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
      if (dataCriteria.includes(14) || (dataCriteria.includes(139))) {
        dispatch(getApi?.getDistrictList(data?.value));
      }
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
      if (dataCriteria.includes(13) || (dataCriteria.includes(27))) {
        dispatch(getApi?.getSubDistrictList(data?.value));
      }
      formTableCriteria.resetFields(["subDistrict"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "subDistrict"]: undefined,
        };
      });
    }
    if (index === `customerSegment`) {
      if (dataCriteria.includes(20) || (dataCriteria.includes(33))) {
        dispatch(getApi?.getAccountGroupList(data?.value));
      }
      formTableCriteria.resetFields(["accountGroup"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "accountGroup"]: undefined,
        };
      });
    }
    if (index === `fromItem`) {
      formTableCriteria.resetFields(["tiering"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "tiering"]: undefined,
        };
      });
      if (data?.value === 2302 || data?.value === 2301) {
        const body = handleMappingBodyTiering({
          dataCriteria: dataCriteria,
          editDataRecord: editDataRecord,
          key: key,
        })
        
        dispatch(getApi?.getTieringList(body));
      }
    }   
    // if (
    //   ([...dataCriteria]?.includes(
    //     columnsTable()?.find((item) => item?.dataIndex === index)?.indexValue
    //   ) ||
    //     dataCriteria?.includes(37))
    // ) {
      
    //   formTableCriteria.resetFields(["tiering", "fromItem"]);
    //     setEditDataRecord((prevState) => {
    //       return {
    //         ...prevState,
    //         [key + "fromItem"]: undefined,
    //         [key + "tiering"]: undefined,
    //       };
    //     });
    // }
    
    return value;
  },[dataCriteria, dispatch, editDataRecord, formTableCriteria]);

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    // const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    // if (searchedColumn !== tempSearchColumn) {
    //   setPage(1);
    // }
    // setSearchedColumn(tempSearchColumn);
    // console.log(selectedKeys, "selectedKeys");
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
    // setFilteredColumn((prevState) => {
    //   return {
    //     ...prevState,
    //     [dataIndex]: hasValue(selectedKeys[0]) ? [(selectedKeys[0])] : null,
    //   };
    // })
  };

  // Handle Change page and pageSize
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

    // check has overlapping data
    const checkOverlappingData = useCallback((formHeader, dataTable) => {
      const dataOverlap = [];
      // if (hasValue(formHeader?.endDate)) {
      dataTable?.forEach(item => {
        console.log("startDate val:", moment(item?.startDate).startOf('day') < moment(formHeader?.startDate).startOf('day'))
        console.log("endDate val:", moment(item?.endDate).startOf('day') > moment(formHeader?.endDate).startOf('day'))
        if (moment(item?.startDate).startOf('day') < moment(formHeader?.startDate).startOf('day') || moment(item?.endDate).startOf('day') > moment(formHeader?.endDate).startOf('day')) {
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

    const checkOverlappingDate = useCallback((formHeaderValue, rowValue) => {
      // if (hasValue(formHeaderValue?.endDate)) {
      if (moment(rowValue?.startDate).startOf('day') < moment(formHeaderValue?.startDate).startOf('day')) {
        return true
      } else if (hasValue(formHeaderValue?.endDate) && moment(rowValue?.endDate).startOf('day') > moment(formHeaderValue?.endDate).startOf('day')) {
        return true
      } else {
        return false
      }
      // }
    }, []);

  // Function Edit Data
  const edit = (record, field) => {
    setStoredData(true);
    setStatusAction("edit");
    formTableCriteria.setFieldsValue({
      ...record,
      startDate: record?.startDate ? moment(record.startDate) : undefined,
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
      dispatch(getApi?.getCity(record?.province?.value));
    }
    if (record?.city && record?.city?.value) {
      dispatch(getApi?.getDistrict(record?.city?.value));
    }
    if (record?.district && record?.district?.value) {
      dispatch(getApi?.getSubDistrict(record?.district?.value));
    }
    if (record?.customerSegment && record?.customerSegment?.value) {
      dispatch(getApi?.getAccountGroup(record?.customerSegment?.value));
    }
  };

  // Function Cancel Data
  const cancel = (record) => {
    if(parseInt(editingKey) > 10 && editingKey?.[editingKey?.length - 1] === "1"){
      setPage(parseInt(editingKey?.[0]));
    }
    setEditingKey("");
    if (statusAction === "add") {
      deleteRow(record);
    }
    setStatusAction("");
    setStoredData(false);
  };

  // Function Save Data
  const save = async (key) => {
    try {
      const row = await formTableCriteria.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (checkStartDate && checkOverlappingDate({ startDate: startDate, endDate: endDate }, row)) {
        formTableCriteria.setFields([
          {
            name: "startDate",
            errors: [`Overlapping date found`],
          },
          {
            name: "endDate",
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

  // Function Add Row Data
  const addRow = () => {
    if (checkStartDate && checkOverlappingData({ startDate: startDate, endDate: endDate }, data)) {
      setModalValidationTable(true)
    } else {
      setSearch({});
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
      if (
        parseInt(newRow["key"]) > 10 &&
        newRow["key"]?.[newRow["key"]?.length - 1] === "1"
      ) {
        setPage(parseInt(newRow["key"]?.[0]) + 1);
      }
      setEditingKey(newRow.key);
    }
  };

  // Function Inactivate Row
  const inactivateRow = (record) => {
    const newStatus = record.status === "INACTIVE" ? "ACTIVE" : "INACTIVE";
    updateData((prevData) =>
      prevData.map((row) =>
        row.key === record.key ? { ...row, status: newStatus } : row
      )
    );
  };

  // Function Delete Row
  const deleteRow = (record) => {
    updateData((prevState) =>
      prevState.filter((item) => item.key !== record.key)
    );
    setStoredData(false);
  };

  const handleDetailHistory = (record) => {
    setModalHistory(true);
    setDataHistory(record);
  };

  // Columns Table
  const columns = () => {
    const temp = [
      {
        title: "NO",
        key: "no",
        width: 60,
        dataIndex: "no",
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      ...columnsTable(
        listOption,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        search,
        storedData,
        countryCriteriaId
      ),
      {
        title: "ACTION",
        key: "operation",
        dataIndex: "operation",
        width: storedData ? 240 : showInactivate ? 160 : 120,
        fixed: "right",
        align: "center",
        render: (_, record) => {
          const editable = record.key === editingKey;
          const isDelete =
            // (status === "DRAFT" && statusApproval === "DRAFT") ||
            record?.dataType !== "exist";

          const statusChangedFromApproved = record?.approvedStatus !== undefined
            ? record.approvedStatus !== record.status
            : false;
          const isCurrentRecord     = record?.dataType === "exist" && !statusChangedFromApproved;
          const isUpdateDisabled    = !!editingKey || (isCurrentRecord && record?.status === "INACTIVE");
          const isDeleteEnabled     = record?.dataType !== "exist" && !editingKey;
          const isInactive          = record?.status === "INACTIVE";
          const isInactivateEnabled = !editingKey && (
            (isCurrentRecord && record?.status === "ACTIVE") ||
            (!isCurrentRecord && ["ACTIVE", "INACTIVE"].includes(record?.status))
          );

          return (
            <Space className="my-2 gap-2">
              {editable ? (
                <>
                  <Button
                    onClick={() => cancel(record)}
                    type="menu"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => save(record.key)}
                    type="submit"
                  >
                    Save
                  </Button>
                </>
              ) : (
                <div className="flex w-full justify-center gap-4">
                  {type === "detail" ? (
                    <Tooltip title="Detail">
                      <Button
                        type="table-action"
                        onClick={() => handleDetailHistory(record)}
                      >
                        <SVGIcon
                          name="IconDetail"
                          width={20}
                        />
                      </Button>
                    </Tooltip>
                  ) : (
                    <>
                      {/* Update */}
                      <Tooltip title={isUpdateDisabled ? "" : "Update"}>
                        <Button
                          type="table-action"
                          disabled={isUpdateDisabled}
                          onClick={() => edit(record)}
                        >
                          <SVGIcon name="IconEdit" width={20} />
                        </Button>
                      </Tooltip>

                      {/* Delete */}
                      <Tooltip title="Delete">
                        <Button
                          type="table-action"
                          disabled={!isDeleteEnabled}
                          onClick={() => deleteRow(record)}
                        >
                          <SVGIcon name="IconDelete" width={20} />
                        </Button>
                      </Tooltip>

                      {/* Inactivate — only rendered when showInactivate=true */}
                      {showInactivate && (
                        <Tooltip title={isInactivateEnabled ? (isInactive ? "Activate" : "Inactivate") : ""}>
                          <Checkbox
                            className="action-checkbox"
                            disabled={!isInactivateEnabled || !!editingKey}
                            checked={isInactive}
                            onClick={() => inactivateRow(record)}
                            style={{ transform: "scale(0.9)" }}
                          />
                        </Tooltip>
                      )}
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
      type !== "preview" ? temp : temp.filter((col) => col.title !== "ACTION");
    return filterCol.filter((col) =>
      ![
        "NO",
        "ACTION",
        "START DATE",
        "END DATE",
        ...(fixedColumn || []),
      ].includes(col.title)
        ? dataCriteria.includes(col.indexValue)
        : true
    );
  };

  // Fixed columns state for NxTable column settings
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: ["operation"] });

  const allColumns = useMemo(
    () =>
      columns().map((col) => ({
        ...col,
        key: col.key || col.dataIndex || col.title,
      })),
    // columns() depends on: dataCriteria, type, fixedColumn, listOption,
    // search, searchedColumn, searchText, storedData, page, pageSize
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataCriteria, type, fixedColumn, listOption, search, searchedColumn, searchText, storedData, page, pageSize]
  );

  const processedColumns = useMemo(
    () => nxApplyFixedColumns(allColumns, fixedColumns),
    [allColumns, fixedColumns]
  );

  const columnDefinitions = useMemo(
    () =>
      allColumns.map((col) => ({
        key: col.key || col.dataIndex || col.title,
        title: col.title,
      })),
    [allColumns]
  );

  // Function length column
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

  // Function Change Total Data Table
  const onChange = (_, __, ___, extra) => {
    setTotalData(extra?.currentDataSource?.length || 0);
  };

  return (
    <Fragment>
      {type !== "detail" &&
      type !== "preview" &&
      dataCriteria &&
      dataCriteria.length > 0 &&
      dataCriteria[0] !== 24 ? (
        <div className="flex w-full justify-end">
          <Button
            icon={<SVGIcon name="IconButtonCreate" width={14} />}
            type="submit"
            onClick={() => {
              if (
                !storedData &&
                (hasValue(startDate) || !checkStartDate) &&
                !(
                  dataCriteria?.includes(37) && //All
                  data?.length > 0
                ) //All must only have 1 data
              ) {
                addRow();
              } else {
                if (dataCriteria?.includes(37) && data?.length > 0) {
                  setModalRequired(true);
                } else if (!hasValue(startDate)) {
                  setModalRequired(true);
                }
              }
            }}
          >
            Create
          </Button>
        </div>
      ) : null}
      {type !== "detail" && type !== "preview" && hasValue(excludeRender)
        ? excludeRender
        : null}
      {dataCriteria && dataCriteria.length > 0 && dataCriteria[0] !== 24 ? (
        <div className="flex flex-col w-full gap-4">
          <Form form={formTableCriteria} component={false}>
            <NxTable
              idTable="functional-criteria-product-table"
              userId={dataUser?.data?.username}
              showAdvanceSearch={false}
              showSearchBar={false}
              usePagination={false}
              dataSource={data}
              columns={processedColumns.map((col) => ({
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
                  startDate: startDate,
                  handleEditDataRecord: handleEditDataRecord,
                  required: col.required,
                  endDate: endDate,
                  requiredDate:checkStartDate,
                  type: type,
                  // disableDate,
                  formTableCriteria: formTableCriteria,
                }),
              }))}
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              tableScrolled={scroll}
              usePagination={false}
              useInfiniteScroll={false}
              onSort={onChange}
              rowClassName={(record) =>
                isEditing(record) ? "editable-row" : ""
              }
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
            />
          </Form>
          {/* Modal History Log */}
          <NxModal
            isOpen={modalHistory}
            handleCancel={() => {
              setModalHistory(false);
            }}
            title="DETAIL INFORMATION"
            width={1000}
            footer={
              <div className="flex justify-end">
                <Button
                  type={"menu"}
                  onClick={() => {
                    setModalHistory(false);
                  }}
                >
                  Back
                </Button>
              </div>
            }
          >
            <div className="p-4">
              <NxBaseContainer border>
                <div className="grid grid-cols-5 gap-x-4">
                  <NxDetailText label="Record ID">{dataHistory.id}</NxDetailText>
                  <NxDetailText label="Created Date">
                    {NxDate.formatDate(dataHistory?.createdDate)}
                  </NxDetailText>
                  <NxDetailText label="Created By">
                    {dataHistory?.createdBy}
                  </NxDetailText>
                  <NxDetailText label="Updated Date">
                    {NxDate.formatDate(dataHistory?.updatedDate)}
                  </NxDetailText>
                  <NxDetailText label="Updated By">
                    {dataHistory?.updatedBy}
                  </NxDetailText>
                </div>
              </NxBaseContainer>
            </div>
          </NxModal>

          {/* modal error no startDate */}
          {ModalError ? (
            <ModalError
              isOpen={modalRequired}
              handleOk={() => setModalRequired(false)}
              handleCancel={() => setModalRequired(false)}
              // customText={"Try Again"}
            >
              <div className="px-5 pt-5 pb-[10px] justify-center">
                <div className="w-full flex gap-[20px]">
                  <SVGIcon name="IconFailed" width={48} />
                  <p className="text-[18px] font-bold">{"Failed"}</p>
                </div>
                <p className="pl-[70px]">{`You can't create criteria. ${
                  dataCriteria?.includes(37) && data?.length > 0
                    ? "Criteria All must only have 1 data!"
                    : "Please input Start Date!"
                }`}</p>
              </div>
            </ModalError>
          ) : null}
          {modalValidationTable ? (
            <ModalError
              isOpen={modalValidationTable}
              handleOk={() => setModalValidationTable(false)}
              handleCancel={() => setModalValidationTable(false)}
            >
              <div className="px-5 pt-5 pb-[10px] justify-center">
                <div className="w-full flex gap-[20px]">
                  <SVGIcon name="IconFailed" width={48} />
                  <p className="text-[18px] font-bold">{"Failed"}</p>
                </div>
                <p className="pl-[70px]">{`You can't add Criteria. Start date and end date can't be overlap`}</p>
              </div>
            </ModalError>
          ) : null}
        </div>
      ) : null}
    </Fragment>
  );
};

export default FunctionalCriteriaProduct;
