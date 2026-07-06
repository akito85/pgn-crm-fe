import {
  Form,
  Input,
  Select,
} from "antd";
import React, { useEffect } from "react";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import { requiredMessage } from "../../../../../../utils";
import InputComponent from "../../../../../../components/InputComponent";
import SelectComponent from "../../../../../../components/SelectComponent";
import {
  getAccountCategoryList,
  getAccountGroupList,
  getBudgetList,
  getCityList,
  getCostCenterList,
  getCountryList,
  getDistrictList,
  getGsizesList,
  getIndustrialSectorList,
  getProvinceList,
  getProvinceListByCountry,
  getServiceTypeList,
  getSorList,
  getSubDistrictList,
  getCustomerList,
  getCustomerSegment,
  getSelectCriteria,
} from "../../../../../../redux/slices/product_promo/product";
import { useSelector } from "react-redux";
import FunctionalCriteriaProduct from "../../../UtilsProduct/FunctionalCriteriaProduct";
import { columnsTableCriteriaAll } from "../../../UtilsProduct/TableCriteriaAllProduct";
import { applyLocationCriteriaCascade, applyDeselectLocationCriteriaCascade, getCriteriaIdByCode } from "../../../UtilsProduct/UtilsAllProduct";

const { TextArea } = Input;

// const onFilter = (dataIndex, value, record) => {
//   const tempSearchText = value.toLowerCase();
//   switch (dataIndex) {
//     case "startDate":
//     case "endDate":
//       const date = record[dataIndex]
//         ? moment(record[dataIndex]).format("DD MMM YYYY")
//         : "";
//       return date?.toLowerCase().includes(tempSearchText);
//     default:
//       return record[dataIndex]?.toLowerCase().includes(tempSearchText);
//   }
// };

// const sorter = (fieldSort, a, b) => {
//   const handleDataSort = (obj) => {
//     switch (fieldSort) {
//       case "startDate":
//       case "endDate":
//         const date = obj[fieldSort]
//           ? moment(obj[fieldSort]).format("DD MMM YYYY")
//           : "";
//         return date?.toLowerCase();
//       default:
//         return obj[fieldSort]?.toLowerCase();
//     }
//   };
//   let fa = handleDataSort(a);
//   let fb = handleDataSort(b);
//   return fa.localeCompare(fb);
// };

// const EditableCell = ({
//   editing,
//   dataIndex,
//   title,
//   inputType,
//   record,
//   index,
//   children,
//   options = [],
//   dependDataIndex,
//   dataEditRecord,
//   handleEditDataRecord = () => {},
//   form,
//   required,
//   ...restProps
// }) => {
//   const key = record?.key || 0;
//   const dataDepend = dependDataIndex
//     ? dataEditRecord[key + dependDataIndex]
//     : "";

//   const rules = () => {
//     let rules = [];
//     if (required) {
//       rules.push({
//         required: required === undefined || required === false ? false : true,
//         message: `Please input your ${title.toLowerCase()}!`,
//       });
//     }
//     return rules.length !== 0 ? rules : undefined;
//   };

//   const filterOption = (input, option) =>
//     option.props.children.toLowerCase().includes(input.toLowerCase());

//   // eslint-disable-next-line arrow-body-style
//   const disabledDate = (current) => {
//     if (dataIndex === "endDate") {
//       return current && current < moment(form?.getFieldValue("startDate"));
//     } else {
//       return current && current < moment().add(-1, "days");
//     }
//   };

//   const getInputNode = (inputType) => {
//     switch (inputType) {
//       case "select":
//         return (
//           <Select
//             showSearch
//             optionFilterProp="children"
//             filterOption={filterOption}
//             labelInValue
//             disabled={dependDataIndex ? !dataDepend : false}
//           >
//             {options.map((option) => (
//               <Select.Option key={option.value} value={option.value}>
//                 {option.label}
//               </Select.Option>
//             ))}
//           </Select>
//         );
//       case "textarea":
//         return <TextArea rows={1} maxLength={255} />;
//       case "date":
//         return (
//           <DatePicker
//             disabledDate={disabledDate}
//             format={"YYYY-MM-DD"}
//             style={{ width: "100%" }}
//           />
//         );
//       case "number":
//         return <NumericFormat allowNegative={false} className="text-right" />;
//       default:
//         return <Input />;
//     }
//   };
//   const inputNode = getInputNode(inputType);

//   if (
//     dataIndex === "operation" ||
//     dataIndex === "no" ||
//     dataIndex === "status"
//   ) {
//     return (
//       <td {...restProps}>
//         <div>{children}</div>
//       </td>
//     );
//   }

//   return (
//     <td {...restProps}>
//       {editing ? (
//         <Form.Item
//           name={dataIndex}
//           style={{
//             margin: 0,
//             textAlign: "left",
//           }}
//           valuePropName={"value"}
//           getValueFromEvent={(value) =>
//             handleEditDataRecord(value, key, dataIndex)
//           }
//           className="min-w-full"
//           rules={rules()}
//         >
//           {inputNode}
//         </Form.Item>
//       ) : (
//         children
//       )}
//     </td>
//   );
// };

const PDITargetAccountSellingForm = ({
  form,
  type = "form",
  data = [],
  productObj = {},
  dispatch = () => {},
  updateData = () => {},
  handleProductObj = (e, type) => {
    return e;
  },
  storedData = false,
  setStoredData = () => {},
  startDate,
  endDate,
}) => {
  // const searchInput = useRef(null);
  // const [formTableCriteria] = Form.useForm();
  // const [page, setPage] = useState(1);
  // const [pageSize, setPageSize] = useState(10);
  // const [editingKey, setEditingKey] = useState("");
  // const [searchedColumn, setSearchedColumn] = useState("");
  // const [searchText, setSearchText] = useState("");
  // const [editDataRecord, setEditDataRecord] = useState({});
  // const [statusAction, setStatusAction] = useState("");
  // const isEditing = (record) => record.key === editingKey;
  // const [totalData, setTotalData] = useState(0);
  const {
    dataListSelectCriteria = [],
    // dataCriteriaProvince = [],
    // dataCriteriaCity = [],
    // dataCriteriaCostCenter = [],
    // dataCriteriaSor = [],
    // dataCriteriaDistrict = [],
    // dataCriteriaSubDistrict = [],
    // dataCriteriaGsizes = [],
    // dataCriteriaIndustrialSector = [],
    // dataCriteriaServiceType = [],
    // dataCriteriaAccountCategory = [],
    // dataCriteriaAccountGroup = [],
    // dataCriteriaBudget = [],
    // dataCriteriaCustomerSegment = [],
    // dataCriteriaCustomer = [],
  } = useSelector((state) => state.product);

  // useEffect(() => {
  //   setTotalData(data.length);
  // }, [data]);

  const criteriaValues = productObj.tasCriteria || [];

  // useEffect(() => {
  //   if (type !== "detail" && type !== "preview") {
  //     dispatch(getBudgetList());
  //     dispatch(getProvinceList());
  //     dispatch(getIndustrialSectorList());
      // dispatch(getAccountCategoryList());
  //     dispatch(getServiceTypeList());
  //     // dispatch(getAccountGroupList());
  //     dispatch(getCustomerList());
  //     dispatch(getSorList());
  //     dispatch(getCostCenterList());
  //     dispatch(getGsizesList());
  //     dispatch(getCustomerSegment());
  //   }
  // }, [type]);

  // const listOption = {
  //   budget: dataCriteriaBudget,
  //   province: dataCriteriaProvince,
  //   city: dataCriteriaCity,
  //   district: dataCriteriaDistrict,
  //   subDistrict: dataCriteriaSubDistrict,
  //   industrialSector: dataCriteriaIndustrialSector,
  //   accountCategory: dataCriteriaAccountCategory,
  //   accountGroup: dataCriteriaAccountGroup,
  //   serviceType: dataCriteriaServiceType,
  //   sor: dataCriteriaSor,
  //   costCenter: dataCriteriaCostCenter,
  //   gsizes: dataCriteriaGsizes,
  //   customerSegment: dataCriteriaCustomerSegment,
  //   customer: dataCriteriaCustomer,
  // };

  useEffect(() => {
    dispatch(getSelectCriteria());
  }, []);

  // const handleEditDataRecord = (data, key, index) => {
  //   const keyName = key + index;
  //   const value = index === "description" ? data.target.value : data;
  //   setEditDataRecord((prevState) => {
  //     return {
  //       ...prevState,
  //       [keyName]: value,
  //     };
  //   });
  //   if (index === `province`) {
  //     dispatch(getCityList(value?.value));
  //     formTableCriteria.resetFields(["city", "district", "subDistrict"]);
  //     setEditDataRecord((prevState) => {
  //       return {
  //         ...prevState,
  //         [key + "city"]: undefined,
  //         [key + "district"]: undefined,
  //         [key + "subDistrict"]: undefined,
  //       };
  //     });
  //   }
  //   if (index === `city`) {
  //     dispatch(getDistrictList(value?.value));
  //     formTableCriteria.resetFields(["district", "subDistrict"]);
  //     setEditDataRecord((prevState) => {
  //       return {
  //         ...prevState,
  //         [key + "district"]: undefined,
  //         [key + "subDistrict"]: undefined,
  //       };
  //     });
  //   }
  //   if (index === `district`) {
  //     dispatch(getSubDistrictList(value?.value));
  //     formTableCriteria.resetFields(["subDistrict"]);
  //     setEditDataRecord((prevState) => {
  //       return {
  //         ...prevState,
  //         [key + "subDistrict"]: undefined,
  //       };
  //     });
  //   }
  //   if (index === `customerSegment`) {
  //     dispatch(getAccountGroupList(value?.value));
  //     formTableCriteria.resetFields(["accountGroup"]);
  //     setEditDataRecord((prevState) => {
  //       return {
  //         ...prevState,
  //         [key + "accountGroup"]: undefined,
  //       };
  //     });
  //   }
  //   return value;
  // };

  // const handleSearch = (selectedKeys, confirm, dataIndex) => {
  //   confirm();
  //   setSearchText(selectedKeys[0]);
  //   const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
  //   if (searchedColumn !== tempSearchColumn) {
  //     setPage(1);
  //   }
  //   setSearchedColumn(tempSearchColumn);
  // };

  // const handleChangeSize = (pageChange, pageSizeChange) => {
  //   const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
  //   setPage(tempPage);
  //   setPageSize(pageSizeChange);
  // };

  // const edit = (record, field) => {
  //   setStoredData(true);
  //   setStatusAction("edit");
  //   formTableCriteria.setFieldsValue(record);
  //   const { key, ...extraProps } = record || {};
  //   const tempValue = { ...extraProps };
  //   for (const attribute in tempValue) {
  //     if (Object.hasOwnProperty.call(tempValue, attribute)) {
  //       const tempData = tempValue[attribute];
  //       setEditDataRecord((prevState) => {
  //         return {
  //           ...prevState,
  //           [`${key}${attribute}`]: tempData,
  //         };
  //       });
  //     }
  //   }
  //   setEditingKey(record.key);
  //   if (record?.province && record?.province?.value) {
  //     dispatch(getCityList(record?.province?.value));
  //   }
  //   if (record?.city && record?.city?.value) {
  //     dispatch(getDistrictList(record?.city?.value));
  //   }
  //   if (record?.district && record?.district?.value) {
  //     dispatch(getSubDistrictList(record?.district?.value));
  //   }
  //   if (record?.customerSegment && record?.customerSegment?.value) {
  //     dispatch(getAccountGroupList(record?.customerSegment?.value));
  //   }
  // };

  // const cancel = (record) => {
  //   setStoredData(false);
  //   setEditingKey("");
  //   if (statusAction === "add") {
  //     deleteRow(record);
  //   }
  //   setStatusAction("");
  // };

  // const save = async (key) => {
  //   try {
  //     const row = await formTableCriteria.validateFields();
  //     const newData = [...data];
  //     const index = newData.findIndex((item) => key === item.key);
  //     if (index > -1) {
  //       const item = newData[index];
  //       const updatedRow = { ...item, ...row };
  //       newData.splice(index, 1, updatedRow);
  //       updateData(newData);
  //       setEditingKey("");
  //     }
  //     setStoredData(false);
  //     setStatusAction("");
  //     formTableCriteria.resetFields();
  //   } catch (errInfo) {
  //     console.log("Validate Failed:", errInfo);
  //   }
  // };

  // const addRow = () => {
  //   formTableCriteria.resetFields();
  //   setStoredData(true);
  //   setStatusAction("add");
  //   const newRow = {
  //     key: data
  //       .reduce((current, next) => {
  //         const nextKey = next.key || 0;
  //         return current > nextKey
  //           ? parseInt(current) + 1
  //           : parseInt(nextKey) + 1;
  //       }, 1)
  //       .toString(),
  //   };
  //   updateData((prevData) => [...prevData, newRow]);
  //   setEditingKey(newRow.key);
  // };

  // const deleteRow = (record) => {
  //   updateData((prevState) =>
  //     prevState.filter((item) => item.key !== record.key)
  //   );
  //   setStoredData(false);
  // };

  // const columns = () => {
  //   const temp = [
  //     {
  //       title: "NO",
  //       width: 100,
  //       dataIndex: "no",
  //       align: "center",
  //       render: (text, object, index) => (page - 1) * pageSize + index + 1,
  //     },
  //     ...columnsTableCriteria(
  //       listOption,
  //       searchInput,
  //       searchedColumn,
  //       searchText,
  //       handleSearch
  //     ),
  //     {
  //       title: "START DATE",
  //       width: 240,
  //       align: "center",
  //       dataIndex: "startDate",
  //       onFilter: (value, record) => onFilter("startDate", value, record),
  //       sorter: (a, b) => sorter("startDate", a, b),
  //       inputType: "date",
  //       require: true,
  //       ...getColumnSearchPropsPaging(
  //         "startDate",
  //         searchInput,
  //         searchedColumn,
  //         searchText,
  //         handleSearch,
  //         true
  //       ),
  //       render: (index) => {
  //         const text = index ? moment(index).format("DD MMM YYYY") : "";
  //         if (searchedColumn === "startDate") {
  //           return (
  //             <Highlighter
  //               highlightStyle={{
  //                 backgroundColor: "#ffc069",
  //                 padding: 0,
  //               }}
  //               searchWords={[searchText]}
  //               autoEscape
  //               textToHighlight={text ? text.toString() : ""}
  //             />
  //           );
  //         } else {
  //           return text || "";
  //         }
  //       },
  //     },
  //     {
  //       title: "END DATE",
  //       width: 240,
  //       align: "center",
  //       dataIndex: "endDate",
  //       onFilter: (value, record) => onFilter("endDate", value, record),
  //       sorter: (a, b) => sorter("endDate", a, b),
  //       inputType: "date",
  //       ...getColumnSearchPropsPaging(
  //         "endDate",
  //         searchInput,
  //         searchedColumn,
  //         searchText,
  //         handleSearch,
  //         true
  //       ),
  //       render: (index) => {
  //         const text = index ? moment(index).format("DD MMM YYYY") : "";
  //         if (searchedColumn === "endDate") {
  //           return (
  //             <Highlighter
  //               highlightStyle={{
  //                 backgroundColor: "#ffc069",
  //                 padding: 0,
  //               }}
  //               searchWords={[searchText]}
  //               autoEscape
  //               textToHighlight={text ? text.toString() : ""}
  //             />
  //           );
  //         } else {
  //           return text || "";
  //         }
  //       },
  //     },
  //     {
  //       title: "DESCRIPTIONS",
  //       width: 240,
  //       dataIndex: "description",
  //       onFilter: (value, record) => onFilter("description", value, record),
  //       sorter: (a, b) => sorter("description", a, b),
  //       inputType: "textarea",
  //       ...getColumnSearchPropsPaging(
  //         "description",
  //         searchInput,
  //         searchedColumn,
  //         searchText,
  //         handleSearch,
  //         true
  //       ),
  //       ellipsis: {
  //         showTitle: false,
  //       },
  //       render: (text) => {
  //         if (searchedColumn === "description") {
  //           return (
  //             <Tooltip placement="topLeft" title={text}>
  //               <Highlighter
  //                 highlightStyle={{
  //                   backgroundColor: "#ffc069",
  //                   padding: 0,
  //                 }}
  //                 searchWords={[searchText]}
  //                 autoEscape
  //                 textToHighlight={text ? text.toString() : ""}
  //               />
  //             </Tooltip>
  //           );
  //         } else {
  //           if (text) {
  //             return (
  //               <Tooltip placement="topLeft" title={text}>
  //                 {text}
  //               </Tooltip>
  //             );
  //           }
  //           return "";
  //         }
  //       },
  //     },
  //     {
  //       title: "ACTION",
  //       width: 240,
  //       fixed: "right",
  //       dataIndex: "operation",
  //       render: (_, record) => {
  //         const editable = record.key === editingKey;
  //         return (
  //           <div className="flex w-full justify-center my-3 gap-2">
  //             {editable ? (
  //               <>
  //                 <ButtonComponent
  //                   onClick={() => cancel(record)}
  //                   type="default"
  //                 >
  //                   Cancel
  //                 </ButtonComponent>
  //                 <ButtonComponent
  //                   onClick={() => save(record.key)}
  //                   type="submit"
  //                 >
  //                   Save
  //                 </ButtonComponent>
  //               </>
  //             ) : (
  //               <>
  //                 <Tooltip title="Edit">
  //                   <div
  //                     className={`flex justify-center${
  //                       editingKey ? " cursor-not-allowed" : ""
  //                     }`}
  //                   >
  //                     <SVGIcon
  //                       name="IconEdit"
  //                       color={editingKey ? "#8D91A0" : "#ACC424"}
  //                       width={24}
  //                       onClick={!editingKey ? () => edit(record) : undefined}
  //                     />
  //                   </div>
  //                 </Tooltip>
  //                 <Tooltip title="Delete">
  //                   <div
  //                     className={`flex justify-center${
  //                       record.typeData === "exist" || editingKey
  //                         ? " cursor-not-allowed"
  //                         : ""
  //                     }`}
  //                   >
  //                     <SVGIcon
  //                       name="IconDelete"
  //                       color={
  //                         record.typeData !== "exist" && !editingKey
  //                           ? "#D90000"
  //                           : "#8D91A0"
  //                       }
  //                       width={24}
  //                       className={
  //                         record.typeData === "exist" || editingKey
  //                           ? "disabled"
  //                           : undefined
  //                       }
  //                       onClick={
  //                         record.typeData !== "exist" && !editingKey
  //                           ? () => deleteRow(record)
  //                           : undefined
  //                       }
  //                     />
  //                   </div>
  //                 </Tooltip>
  //               </>
  //             )}
  //           </div>
  //         );
  //       },
  //     },
  //   ];

  //   const listExclude = [
  //     "NO",
  //     "ACTION",
  //     "START DATE",
  //     "END DATE",
  //     "DESCRIPTIONS",
  //   ];

  //   const filterCol =
  //     type !== "preview" ? temp : temp.filter((col) => col.title !== "ACTION");

  //   return filterCol.filter((col) =>
  //     !listExclude.includes(col.title)
  //       ? criteriaValues.includes(col.indexValue)
  //       : true
  //   );
  // };
  // const [optionSelectedCol, setOptionSelectedCol] = useState([]);

  // const handleDisplayColumn = (value) => {
  //   setOptionSelectedCol(value);
  // };

  // const filterColumn = (dataColumn) => {
  //   return dataColumn.filter((col) => {
  //     return !optionSelectedCol.includes(col.title);
  //   });
  // };

  const handleSelectCriteria = (value) => {
    const outputArray = applyLocationCriteriaCascade(
      [...criteriaValues, value],
      dataListSelectCriteria
    );
    handleProductObj(outputArray, "tasCriteria");
    form.setFieldsValue({
      tasCriteria: outputArray,
    });
  };

  const handleDeselectCriteria = (value) => {
    const outputArray = applyDeselectLocationCriteriaCascade(
      criteriaValues,
      value,
      dataListSelectCriteria
    );
    handleProductObj(outputArray, "tasCriteria");
    form.setFieldsValue({
      tasCriteria: outputArray,
    });
  };

  const handleClearCriteria = () => {
    handleProductObj([], "tasCriteria");
  };

  // const onChange = (_, __, ___, extra) => {
  //   setTotalData(extra?.currentDataSource?.length || 0);
  // };

  return (
    <div className="flex flex-col w-full gap-4">
      {/* {type !== "preview" ? (
        <>
          {criteriaValues[0] !== 24 ? (
            <div className="flex w-full justify-end">
              <ButtonComponent
                icon={<SVGIcon name="IconButtonCreate" width={24} />}
                type="submit"
                onClick={
                  !storedData && criteriaValues.length !== 0
                    ? addRow
                    : undefined
                }
              >
                Create
              </ButtonComponent>
            </div>
          ) : null}

          <div className="grid grid-cols-2 w-full gap-3">
            <Form.Item
              name={"tasName"}
              rules={[{ message: requiredMessage("Name"), required: true }]}
              className={"w-full no-margin-form"}
              getValueFromEvent={(e) => handleProductObj(e, "tasName")}
              label={"Name"}
              required
            >
              <InputComponent type="text" />
            </Form.Item>
            <Form.Item
              name={"tasCriteria"}
              rules={[{ message: requiredMessage("Criteria"), required: true }]}
              className={"w-full no-margin-form"}
              label={"Criteria"}
              required
            >
              <SelectComponent
                mode="multiple"
                onSelect={handleSelectCriteria}
                onDeselect={handleDeselectCriteria}
                onClear={handleClearCriteria}
              >
                {dataListSelectCriteria.map((data, index) => (
                  <Select.Option key={index} value={data.value}>
                    {data.label}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>
            <div className="col-span-2">
              <Form.Item
                name={"tasDescription"}
                className="w-full"
                getValueFromEvent={(e) => handleProductObj(e, "tasDescription")}
                label={"Description"}
              >
                <InputComponent
                  type="textarea"
                  value={productObj.description}
                />
              </Form.Item>
            </div>
          </div>
        </>
      ) : null} */}

      <FunctionalCriteriaProduct
        type={type}
        data={data || []} //data
        dataCriteria={criteriaValues || []} //ddl
        updateData={updateData}
        setStoredData={setStoredData}
        storedData={storedData}
        startDate={startDate}
        endDate={endDate}
        selector="product"
        getApi={{
          getBudgetList,
          getProvinceList,
          getProvinceListByCountry,
          getCountryList,
          getIndustrialSectorList,
          getAccountCategoryList,
          getServiceTypeList,
          getSorList,
          getCostCenterList,
          getGsizesList,
          getCustomerSegmentList: getCustomerSegment,
          getCustomerList,
          getCityList,
          getSubDistrictList,
          getAccountGroupList,
          getDistrictList,
        }}
        columnsTable={columnsTableCriteriaAll}
        idTable="tas-form-criteria-table"
        countryCriteriaId={getCriteriaIdByCode(dataListSelectCriteria, "COUNTRY")}
        // checkStartDate={false}
        excludeRender={
          <div className="grid grid-cols-2 w-full gap-3">
            <Form.Item
              name={"tasName"}
              rules={[{ message: requiredMessage("Name"), required: true }]}
              className={"w-full no-margin-form"}
              getValueFromEvent={(e) => handleProductObj(e, "tasName")}
              label={"Name"}
              required
            >
              <InputComponent type="text" />
            </Form.Item>
            <Form.Item
              name={"tasCriteria"}
              rules={[{ message: requiredMessage("Criteria"), required: true }]}
              className={"w-full no-margin-form"}
              label={"Criteria"}
              required
            >
              <SelectComponent
                mode="multiple"
                onSelect={handleSelectCriteria}
                onDeselect={handleDeselectCriteria}
                onClear={handleClearCriteria}
              >
                {dataListSelectCriteria.map((data, index) => (
                  <Select.Option key={index} value={data.value}>
                    {data.label}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>
            <div className="col-span-2">
              <Form.Item
                name={"tasDescription"}
                className="w-full"
                getValueFromEvent={(e) => handleProductObj(e, "tasDescription")}
                label={"Description"}
              >
                <InputComponent
                  type="textarea"
                  value={productObj.description}
                />
              </Form.Item>
            </div>
          </div>
        }
      />

      {/* {criteriaValues &&
      criteriaValues.length > 0 &&
      criteriaValues[0] !== 24 ? (
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
                    form: formTableCriteria,
                    inputType: col.inputType,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: isEditing(record),
                    options: col.option,
                    indexValue: col.indexValue,
                    dependDataIndex: col.dependDataIndex,
                    dataEditRecord: editDataRecord,
                    handleEditDataRecord: handleEditDataRecord,
                    required: col.require,
                  }),
                }))
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
              rowClassName={(record) =>
                isEditing(record) ? "editable-row" : ""
              }
              scroll={{ y: 300, x: 1500 }}
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              onChange={onChange}
            />
          </Form>
        </div>
      ) : null} */}
    </div>
  );
};

export default PDITargetAccountSellingForm;
