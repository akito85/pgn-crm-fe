import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { getListChargingMethod, getListNameProductDetail, getListPaymentType, getListUnit } from "../../../../../../../../../redux/slices/product_promo/product";
import SVGIcon from "../../../../../../../../../assets/Icon/index";
import { getColumnSearchProps } from "../../../../../../../../../utils/getColumnSearchProps";
import Highlighter from "react-highlight-words";
import { Form, Input, InputNumber, Select, Tooltip } from "antd";
import NxTable from "../../../../../../../../../components/Nx/NxTable";
import ButtonComponent from "../../../../../../../../../components/ButtonComponent";
import { getColumnSearchPropsCriteria } from "../../../../../../../ProductAndPromo/Product/columnTableCriteria";
import SelectComponent from "../../../../../../../../../components/SelectComponent";
import { hasValue } from "../../../../../../../../../utils";
import InputComponent from "../../../../../../../../../components/InputComponent";
import { getProductDetailColumns } from "../columns/getProductDetailColumns";

const onFilter = (dataIndex, value, record) => {
  const tempSearchText = value.toLowerCase();
  switch (dataIndex) {
    case "name":
    case "unit":
      return record[dataIndex]?.label.toLowerCase().includes(tempSearchText);
    default:
      return record[dataIndex]
        ?.toString()
        ?.toLowerCase()
        .includes(tempSearchText);
  }
};

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "name":
      case "unit":
        return obj[fieldSort]?.label?.toLowerCase();
      default:
        return obj[fieldSort]?.toString()?.toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);
  return fa.localeCompare(fb);
};


const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  options = [],
  required,
  dependDataIndex,
  dataEditRecord,
  urlIndex,
  handleEditDataRecord = () => { },
  dataTableDetailProduct,
  isProduct,
  ...restProps
}) => {
  const key = record?.key || 0;
  const dataDepend = dependDataIndex
    ? dataEditRecord[key + dependDataIndex]
    : "";

  // const rules = () => {
  //   let rule = [];
  //   if (required) {
  //     rule.push({
  //       ...required,
  //       message: `${required.message} ${title}!`,
  //     });
  //   }
  //   return rule.length !== 0 ? rule : undefined;
  // };
  const rules = () => {
    let rule = [];
    if (required) {
      rule.push({
        ...required,
        message: `${required.message} ${title}!`,
      });
    } else if (dataIndex === "unit") {
      rule.push({
        required: dataEditRecord[key + dependDataIndex]?.isParent,
        message: `Please input your ${title.toLowerCase()}!`,
      });
    } else if (dataIndex === "value") {
      rule.push({
        required: !dataEditRecord[key + dependDataIndex]?.isParent,
        message: `Please input your ${title.toLowerCase()}!`,
      });
    }
    return rule.length !== 0 ? rule : undefined;
  };

  const filterOption = (input, option) =>
    option.props.children.toLowerCase().includes(input.toLowerCase());

  // const dependentData = () => {
  //   if (options.length === 0) {
  //     return true;
  //   }
  //   if(options === "name"){
  //     if(dataTableDetailProduct?.versionList?.length === 0){
  //       return true;
  //     }
  //   }
  //   return !dataDepend;
  // };
  const dependentData = () => {
    if (!dataEditRecord[key + dependDataIndex]?.isParent) { //options.length === 0
      return true;
    }
    return !dataDepend;
  };
  const getInputNode = (inputType) => {
    switch (inputType) {
      case "select":
        return (
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
            labelInValue
            disabled={(dataIndex === "name" && isProduct !== 2) || hasValue(dependDataIndex) ? dependentData() : false}
          // disabled={dataTableDetailProduct?.versionList?.length > 0 ? true : false}
          >
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );
      case "number":
        return (
          <InputNumber
            type={"number"}
            controls={false}
            style={{
              width: "100%",
            }}
          />
        );
      case "description":
        return <Input.TextArea rows={1} maxLength={255} />;
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
          rules={rules()}
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
const excludeOptionName = [214, 210];


const TableProduct = ({
  dispatch,
  dataTableProduct = [], //data product detail from setDataTableProduct
  setDataTableProduct = () => { }, // for set data product
  isProduct,
  // dataFromProductVersion=[], //fetch data from api product
  dataTableDetailProduct, // for dependence useEffect
  handleSaDetailObj,
  setSaDetailObj,
  saDetailObj
}) => {
  const searchInput = useRef(null);
  const [formTable] = Form.useForm();

  const [displayData, setDisplayData] = useState([]);
  const [loadedCount, setLoadedCount] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [editingKey, setEditingKey] = useState("");
  const [storedDate, setStoredData] = useState(false);

  const isEditing = (record) => record.key === editingKey;
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [editDataRecord, setEditDataRecord] = useState({});
  const [statusAction, setStatusAction] = useState("");
  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["operation"],
    left: [],
  }));

  const {
    dataListPaymentType,
    dataListChargeMethod,
    dataListNameProductDetail = [],
    dataListUnit = [],
  } = useSelector((state) => state.product);

  const exludeExisting =
    dataTableProduct.length > 0 ? dataTableProduct.map((item) => item?.name?.value) : [];
  const listName = dataListNameProductDetail.filter(
    (item) => ![...excludeOptionName, ...exludeExisting].includes(item.value)
  );

  // useEffect(() => {
  //   if(dataFromProductVersion?.length > 0){
  //     setDataTableProduct(dataFromProductVersion)
  //   }
  // }, [dataTableDetailProduct])

  useEffect(() => {
    dispatch(getListPaymentType());
    dispatch(getListChargingMethod());
    dispatch(getListNameProductDetail());
  }, [dispatch]);

  useEffect(() => {
    if (isProduct === 2 && saDetailObj?.paymentType && saDetailObj?.chargingMethod) {
      const selectedPaymetType = dataListPaymentType?.filter(item => item.value === saDetailObj?.paymentType)[0]
      const selectedChargeMethod = dataListChargeMethod?.filter(item => item.value === saDetailObj?.chargingMethod)[0]

      setSaDetailObj(prevSaDetailObj => ({
        ...prevSaDetailObj,
        objPaymentType: {
          name: 210,
          unit: selectedPaymetType?.value,
          value: null,
          description: null,
          unitName: selectedPaymetType?.label
        },
        objChargingMethod: {
          name: 214,
          unit: selectedChargeMethod?.value,
          value: null,
          description: null,
          unitName: selectedChargeMethod?.label
        },
      }))
    }
  }, [saDetailObj?.paymentType, saDetailObj?.chargingMethod])

  // Process all data (filter, sort)
  const processedData = useMemo(() => {
    let result = [...dataTableProduct];
    if (searchedColumn) {
      const tempSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        switch (searchedColumn) {
          case "name":
          case "unit":
            return item[searchedColumn]?.label
              .toLowerCase()
              .includes(tempSearchText);
          default:
            return item[searchedColumn]?.toString()?.toLowerCase().includes(tempSearchText);
        }
      });
    }
    if (fieldSort) {
      result.sort((a, b) => {
        const handleSort = (obj) => {
          switch (fieldSort) {
            case "name":
            case "unit":
              return obj[fieldSort]?.label?.toString()?.toLowerCase() || "";
            default:
              return obj[fieldSort]?.toString()?.toLowerCase() || "";
          }
        };
        let fa = handleSort(a);
        let fb = handleSort(b);
        if (fa < fb) return orderSort === "asc" ? -1 : 1;
        if (fa > fb) return orderSort === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [dataTableProduct, searchedColumn, searchText, fieldSort, orderSort]);

  // Infinite scroll: slice processedData
  useEffect(() => {
    const sliced = processedData.slice(0, loadedCount);
    setDisplayData(sliced);
    setHasMore(loadedCount < processedData.length);
  }, [processedData, loadedCount]);

  // Handle infinite scroll load more
  const handleLoadMore = useCallback(() => {
    return new Promise((resolve) => {
      setLoadedCount((prev) => prev + 20);
      resolve();
    });
  }, []);


  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
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


  const handleEditDataRecord = (data, key, index) => {
    const keyName = key + index;
    const value = index === "description" ? data.target.value : data;
    if(index === "name") {
      formTable.resetFields(["unit","value"])
    }
    // setEditDataRecord((prevState) => {
    //   return {
    //     ...prevState,
    //     [keyName]: value,
    //   };
    // });
    setEditDataRecord((prevState) => {
      return {
        ...prevState,
        [keyName]: index === "name" ? {
          ...value,
          isParent: dataListNameProductDetail.find(
            (item) => item.value === value.value
          )?.isParent,
        }: value,
      };
    });
    if (index === `name`) {
      const temp = dataListNameProductDetail.filter(
        (item) => item.value === data?.value
      );
      if (temp.length > 0) {
        dispatch(getListUnit({ id: temp[0].id }));
        formTable.resetFields(["unit"]);
      }
    }
    return value;
  };

  const edit = (record, field) => {
    setStatusAction("edit");
    formTable.setFieldsValue(record);
    const { key, ...extraProps } = record || {};
    const tempValue = { ...extraProps };
    for (const attribute in tempValue) {
      if (Object.hasOwnProperty.call(tempValue, attribute)) {
        const tempData = tempValue[attribute];
        setEditDataRecord((prevState) => {
          return {
            ...prevState,
            [`${key}${attribute}`]:
              attribute === "name"
                ? {
                  ...tempData,
                  isParent: dataListNameProductDetail.find(
                    (item) => item.value === tempData.value
                  )?.isParent,
                }
                : tempData,
          };
        });
      }
    }
    setEditingKey(record.key);
    if (record?.name && record?.name?.value) {
      const temp = dataListNameProductDetail.filter(
        (item) => item.value === record?.name?.value
      );
      if (temp.length > 0) {
        dispatch(getListUnit({ id: temp[0].id }));
      }
    }
  };

  const cancel = (record) => {
    setStoredData(false);
    setEditingKey("");
    if (statusAction === "add") {
      deleteRow(record);
    }
    setStatusAction("");
  };

  const addRow = () => {
    formTable.resetFields();
    setStoredData(true);
    setStatusAction("add");
    const newRow = {
      key: dataTableProduct
        .reduce((current, next) => {
          const nextKey = next.key || 0;
          return current > nextKey
            ? parseInt(current) + 1
            : parseInt(nextKey) + 1;
        }, 1)
        .toString(),
    };
    setDataTableProduct((prevData) => [...prevData, newRow]);
    setEditingKey(newRow.key);
  };

  const save = async (key) => {
    try {
      const row = await formTable.validateFields();
      const newData = [...dataTableProduct];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        const updatedRow = {
          ...item,
          ...row,
        };
        newData.splice(index, 1, updatedRow);
        setDataTableProduct(newData);
        setEditingKey("");
      }
      setStoredData(false);
      setStatusAction("");
      formTable.resetFields();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const deleteRow = (record) => {
    setDataTableProduct((prevState) =>
      prevState.filter((item) => item.key !== record.key)
    );
    setStoredData(false);
  };

  // Get columns with all handlers
  const columnsConfig = useMemo(() => {
    return getProductDetailColumns({
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      listName,
      dataListUnit,
      editingKey,
      edit,
      save,
      cancel,
      deleteRow,
      isProduct,
    });
  }, [searchedColumn, searchText, listName, dataListUnit, editingKey, isProduct]);


  const [optionSelectedCol, setOptionSelectedCol] = useState([]);

  const handleDisplayColumn = (value) => {
    setOptionSelectedCol(value);
  };

  const filterColumn = (dataColumn) => {
    return dataColumn.filter((col) => {
      return !optionSelectedCol.includes(col.title);
    });
  };

  return (
    <div>
      {isProduct === 2 && (
        <div className="flex w-full justify-end">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
            onClick={!storedDate ? addRow : undefined}
          >
            Create
          </ButtonComponent>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 w-full">
        <Form.Item
          name={"paymentType"}
          rules={[{ message: "This field is required", required: true }]}
          className="no-margin-form w-full"
          // getValueFromEvent={(e) => updateBody(e, "paymentType")}
          getValueFromEvent={(e) => handleSaDetailObj(e, "paymentType")}
          label={"Payment Type"}
          required
        >
          <SelectComponent>
            {(dataListPaymentType || []).map((data, index) => (
              <Select.Option key={index} value={data.value}>
                {data.label}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>
        <Form.Item
          name={"chargingMethod"}
          rules={[{ message: "This field is required", required: true }]}
          className="no-margin-form w-full"
          // getValueFromEvent={(e) => updateBody(e, "chargingMethod")}
            getValueFromEvent={(e) =>handleSaDetailObj(e, "chargingMethod")}
          label={"Charging Method"}
          required
        >
          <SelectComponent>
            {(dataListChargeMethod || []).map((data, index) => (
              <Select.Option key={index} value={data.value}>
                {data.label}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>
      </div>
      {/* Start Pagination */}
      <div className="py-4">
      <Form form={formTable} component={false}>
				<NxTable
					idTable="product-detail-table"
					rowKey="key"
					dataSource={displayData}
          columns={filterColumn(
            columnsConfig.map((col) => ({
              ...col,
              onCell: (record) => ({
                record,
                inputType: col.inputType,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                dependDataIndex: col.dependDataIndex,
                urlIndex: col.url,
                options: col.options,
                required: col.required,
                dataEditRecord: editDataRecord,
                handleEditDataRecord: handleEditDataRecord,
                dataTableDetailProduct: dataTableDetailProduct,
                isProduct: isProduct,
              }),
            }))
          )}
          totalData={processedData.length}
          rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
          tableScrolled={{
            x: "max-content",
            y: 400,
          }}
          usePagination={false}
          useInfiniteScroll={true}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          loadMoreThreshold={2}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          columnDefinitions={columnsConfig.map((col) => ({
            key: col.key || col.dataIndex || col.title,
            title: col.title,
          }))}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          onChange={onSort}
          loading={false}
          showAdvanceSearch={false}
          showSearchBar={false}
        />
      </Form>
      </div>
    </div>
  );
};

export default TableProduct;
