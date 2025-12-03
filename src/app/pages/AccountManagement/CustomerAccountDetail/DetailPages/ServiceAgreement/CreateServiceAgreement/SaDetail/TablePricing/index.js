import React, { useState, useRef, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

import ButtonComponent from "../../../../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../../../../assets/Icon/index";
import { Select, Form, InputNumber } from "antd";
import ModalCustom from "../../../../../../../../../components/Modal/ModalCustom";
import SelectComponent from "../../../../../../../../../components/SelectComponent";
import InputComponent from "../../../../../../../../../components/InputComponent";
import { columnsDetail } from "../TablePricing/TableDetail";
import TablePagination from "../../../../../../../../../components/TablePagination";
import { showModalError } from "../../../../../../../../../redux/slices/general_slice";
import { hasValue } from "../../../../../../../../../utils";

function filterData(array, filters) {
  return array.filter((item) => {
    let res = true;
    for (const key in filters) {
      if (filters.hasOwnProperty(key)) {
        const fixSearchText =
          key === "min" || key === "maximumName"
            ? filters[key]?.replace(/,/g, "")?.toLowerCase()
            : filters[key]?.toLowerCase();
        if (key === "value") {
          let temp;
          if (typeof item[key] === "number") {
            const dataTemp = new Intl.NumberFormat("de-DE", {
              style: "currency",
              currency: "EUR",
            }).format(item[key]);
            temp = dataTemp.slice(0, dataTemp.length - 2);
          } else {
            temp = item[key];
          }
          res = res ? temp?.toLowerCase()?.includes(fixSearchText) : res;
        } else {
          res = res
            ? item[key]?.toString()?.toLowerCase().includes(fixSearchText)
            : res;
        }
      }
    }
    return res;
  });
}

const TablePricing = ({
  setData = () => {},
  data = [],
  setValueOrUnlimited = () => {},
  valueOrUnlimited,
  type,
  isProduct,
  dataFromApi, //for custom table
  ddlPriceCode,
  dataMapPricing = [],
  isCustomTiering,
  idCreateFrom,
}) => {
  // Declaration
  const searchInput = useRef(null);
  const [formDetail] = Form.useForm();
  const minimums = new Set();
  const dispatch = useDispatch();
  // State
  const [dataTable, setDataTable] = useState([]);
  const [totalElement, setTotalElement] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [PDselect, setPDselect] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [description, setDescription] = useState("");
  const [typeModal, setTypeModal] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const [keyTable, setKeyTable] = useState();
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [minimum, setMinimum] = useState(0);

  // useEffect(() => {
  // 	if (dataMapPricing.length !== 0) {
  // 		setData(dataMapPricing);
  // 	}
  // }, [dataFromApi]);

  useEffect(() => {
    let result = [...data];
    result = filterData(result, search);
    const handleDataSort = (obj, field) => {
      if (field === "value") {
        let temp;
        if (typeof obj[field] === "number") {
          const dataTemp = new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
          }).format(obj[field]);
          temp = dataTemp.slice(0, dataTemp.length - 2);
        } else {
          temp = obj[field];
        }
        return temp?.toLowerCase();
      } else {
        return obj[field]?.toString()?.toLowerCase();
      }
    };
    if (sort) {
      const splitSort = sort.split("~");
      result.sort((a, b) => {
        let fa = handleDataSort(a, splitSort[0]);
        let fb = handleDataSort(b, splitSort[0]);
        if (fa < fb) {
          return splitSort[1] === "asc" ? -1 : 1;
        }
        if (fa > fb) {
          return splitSort[1] === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    let map = new Map();
    for (let item of result) {
      map.set(
        `${item["priceCodeName"]}~${item["min"]}~${item["maximumName"]}`,
        item,
      );
    }
    let iteratorValues = map.values();
    let uniquePriceCode = [...iteratorValues];
    setTotalElement(uniquePriceCode.length);
    const dataFilter = uniquePriceCode
      .slice((page - 1) * pageSize, page * pageSize)
      // .map((item) => item.priceCodeName);
      .map(
        (item) =>
          `${item["priceCodeName"]}~${item["min"]}~${item["maximumName"]}`,
      );
    const dataFix = result.filter((item) =>
      // dataFilter.includes(item.priceCodeName)
      dataFilter.includes(
        `${item["priceCodeName"]}~${item["min"]}~${item["maximumName"]}`,
      ),
    );

    /** Function Merge Table */
    const uniquePriceCode2 = new Set();
    let pageNo = 0;
    let pageNumber = 0;
    const mergedData = dataFix.map((rowData, index) => {
      const updatedRowsData = { ...rowData };
      if (index !== 0 && index % pageSize === 0) {
        uniquePriceCode2.clear();
        pageNo += 1;
      }
      if (
        uniquePriceCode2.has(
          `${rowData.priceCode}~${rowData.min}~${rowData.maximumName}`,
        )
      ) {
        updatedRowsData.rowSpan = 0;
      } else {
        // const occurCount = dataFix
        // 	.slice(pageNo * pageSize, (pageNo + 1) * pageSize)
        // 	.filter((data) =>
        // 		data.priceCode === rowData.priceCode &&
        // 		data.min === rowData.min &&
        // 		data.maximumName === rowData.maximumName
        // 	).length;
        const occurCount = dataFix.filter(
          (data) =>
            data.priceCode === rowData.priceCode &&
            data.min === rowData.min &&
            data.maximumName === rowData.maximumName,
        ).length;
        updatedRowsData.rowSpan = Math.min(pageSize, occurCount);
        updatedRowsData.number = pageNumber;
        uniquePriceCode2.add(
          `${rowData.priceCode}~${rowData.min}~${rowData.maximumName}`,
        );
        pageNumber++;
      }
      return updatedRowsData;
    });
    setDataTable(mergedData);
  }, [data, page, pageSize, sort, search]);

  useEffect(() => {
    if (PDselect !== 0) {
      // Function for find Price Detail
      const findPriceDetail = ddlPriceCode
        ?.filter((a) => a.id === PDselect)?.[0]
        ?.mpricingDetail?.reduce(
          (current, next) =>
            current + `, ${next.value}/${next.currency}/${next.uom}`,
          "",
        );

      const findAdjustmentDetail = ddlPriceCode?.filter(
        (a) => a.id === PDselect,
      )?.[0];

      const adjustmentOne = findAdjustmentDetail?.mpricingDetail[0]?.adjustment;
      const adjustmentTwo = findAdjustmentDetail?.mpricingDetail[1]?.adjustment;

      const mergedAdjustmentText =
        `${adjustmentOne?.adjustmentText || ""} - ${adjustmentTwo?.adjustmentText || ""}`.trim();

      formDetail.setFieldsValue({
        priceDetail:
          findPriceDetail !== undefined ? findPriceDetail.slice(2) : null,
        priceAdjustmentDetail: mergedAdjustmentText,
      });
    }
  }, [PDselect]);

  useEffect(() => {
    if (typeModal === "update") {
      const findPriceDetail = ddlPriceCode
        ?.filter((a) => a.id === dataUpdate?.priceCode)?.[0]
        ?.mpricingDetail?.reduce(
          (current, next) =>
            current + `, ${next.value}/${next.currency}/${next.uom}`,
          "",
        );

      setPDselect(dataUpdate.priceCode);
      formDetail.setFieldsValue({
        priceCode: dataUpdate.priceCodeName,
        priceDetail:
          findPriceDetail !== undefined ? findPriceDetail.slice(2) : null,
        min: dataUpdate.min,
        max: dataUpdate.max,
        description: dataUpdate.description,
      });
    }
  }, [typeModal]);

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      let tempData = {
        ...prevState,
      };

      if (selectedKeys[0]) {
        tempData[dataIndex] = selectedKeys[0];
      } else {
        delete tempData[dataIndex];
      }
      return tempData;
    });
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const safetyConflict = (value) => {
    let valid = true;
    let tempData = [...data];
    if (typeModal === "update") {
      tempData = tempData.filter(
        (item) =>
          `${item["priceCodeName"]}~${item["min"]}~${item["maximumName"]}` !==
          `${dataUpdate["priceCodeName"]}~${dataUpdate["min"]}~${dataUpdate["maximumName"]}`,
      );
    }
    tempData.forEach((item) => {
      const startData = item.min;
      const endData = item.max !== null ? item.max : undefined;
      const startValue = value.min;
      const endValue = valueOrUnlimited ? undefined : value.max;
      if (
        startData <= startValue &&
        ((!!endData && startValue <= endData) || !endData)
      ) {
        valid = false; // b starts in a
      }
      if (
        ((!!endValue && startData <= endValue) || !endValue) &&
        !!endData &&
        !!endValue &&
        endValue <= endData
      ) {
        valid = false; // b ends in a
      }
      if (
        startValue < startData &&
        ((!!endData && !!endValue && endData < endValue) ||
          (!endData && !!endValue && endValue >= startData) ||
          (!!endData && !endValue && true))
      ) {
        valid = false; // a in b
      }
    });
    return valid;
  };

  // Handle Add Value to Array
  const handleAdd = (formValue) => {
    if (safetyConflict(formValue)) {
      if (typeModal === "create") {
        let dataLength = data.length;
        const obj = ddlPriceCode?.filter((a) => a.id === PDselect)[0];
        const result = obj?.mpricingDetail?.map((b) => {
          const flag1 = type === "update" ? 1 : undefined;
          const temp = {
            ...b,
            currency: b.currency,
            uom: b.uomName,
            priceCode: PDselect,
            priceCodeName: obj?.priceCode,
            priceDetail: formValue.priceDetail,
            min: formValue.min,
            max: valueOrUnlimited === true ? null : formValue.max,
            maximumName:
              valueOrUnlimited === true ? "Unlimited" : formValue.max,
            description: formValue.description,
            key: dataLength + 1,
            lineNumber: dataLength + 1,
            unlimited: valueOrUnlimited,
            flag: flag1,
            adjustment: b?.adjustment?.adjustmentText
              ? b?.adjustment?.adjustmentText
              : null,
            adjustmentId: b?.adjustment?.priceAdjustmentDetailId
              ? b?.adjustment?.priceAdjustmentDetailId
              : null,
          };
          dataLength++;
          return temp;
        });
        setData((prevState) => [...prevState, ...result]);
        handleCancelModal();
      }
      if (typeModal === "update") {
        const flag2 = dataUpdate.type === "exist" ? 2 : 1;
        if (dataUpdate.priceCodeName === formValue.priceCode) {
          const obj = data?.findIndex(
            (a) =>
              `${a["priceCodeName"]}~${a["min"]}~${a["maximumName"]}` ===
              `${dataUpdate["priceCodeName"]}~${dataUpdate["min"]}~${dataUpdate["maximumName"]}`,
          );
          let indexArray = [obj];
          if (
            data[obj + 1] !== undefined &&
            `${data[obj]["priceCodeName"]}~${data[obj]["min"]}~${data[obj]["maximumName"]}` ===
              `${data[obj + 1]["priceCodeName"]}~${data[obj + 1]["min"]}~${
                data[obj + 1]["maximumName"]
              }`
          ) {
            indexArray.push(obj + 1);
          }
          let temp = [...data];
          indexArray.forEach((element) => {
            temp[element] = {
              ...temp[element],
              pricingRuleDetailId: dataUpdate.pricingRuleDetailId,
              min: formValue.min,
              max: valueOrUnlimited === true ? null : formValue.max,
              maximumName:
                valueOrUnlimited === true ? "Unlimited" : formValue.max,
              description: formValue.description,
              unlimited: valueOrUnlimited,
              flag: flag2,
            };
          });
          setData(temp);
        } else {
          let temp = [...data];
          temp = temp.filter(
            (a) =>
              `${a["priceCodeName"]}~${a["min"]}~${a["maximumName"]}` !==
              `${dataUpdate["priceCodeName"]}~${dataUpdate["min"]}~${dataUpdate["maximumName"]}`,
          );
          let dataLength = temp.length;
          const obj = ddlPriceCode?.filter((a) => a.id === PDselect)[0];
          const result = obj?.mpricingDetail?.map((b) => {
            const dataDetail = {
              ...b,
              currency: b.currency,
              uom: b.uomName,
              pricingRuleDetailId: dataUpdate.pricingRuleDetailId, // data pricingRuleDetailId
              priceCode: PDselect,
              priceCodeName: obj?.priceCode,
              priceDetail: formValue.priceDetail,
              min: formValue.min,
              max: valueOrUnlimited === true ? null : formValue.max,
              maximumName:
                valueOrUnlimited === true ? "Unlimited" : formValue.maximum,
              description: formValue.description,
              key: dataLength + 1,
              lineNumber: dataLength + 1,
              unlimited: valueOrUnlimited,
              flag: flag2,
            };
            dataLength++;
            return dataDetail;
          });
          setData([...temp, ...result]);
        }
        setOpenModal(false);
        formDetail.resetFields();
      }
      handleCancelModal();
    } else {
      const errorBody = {
        title: "Failed",
        description: `Your data is conflict. Please try again.`,
      };
      dispatch(showModalError(errorBody));
    }
  };

  // Delete Row
  // const handleDelete = useCallback(
  // 	(id, max, min) => {
  // 		console.log(id, max, min);
  // 		setData((prevState) =>
  // 			prevState.filter((e) => e.priceCode !== id)
  // 		);
  // 	},
  // 	[data]
  // );
  const handleDelete = useCallback(
    (id, max, min) => {
      setData((prevState) =>
        prevState.filter(
          (e) => `${e.priceCode}~${e.max}~${e.min}` !== `${id}~${max}~${min}`,
        ),
      );
    },
    [data],
  );
  // handle two Price Detail
  const handlePriceDetail = (value) => {
    setPDselect(value);
    return value;
  };

  // Handle Update
  const handleUpdate = (r) => {
    setDataUpdate(r);
    setKeyTable(r?.key);
    setValueOrUnlimited(r.unlimited);
    setTypeModal("update");
    setOpenModal(true);
  };

  const onChangeSelect = (e) => {
    if (e === true) {
      formDetail.setFieldsValue({
        max: null,
      });
    }
    setValueOrUnlimited(e);
  };

  // Maximum Pricing Rule
  const selectBefore = (
    <Select
      onChange={onChangeSelect}
      value={valueOrUnlimited}
      defaultValue={false}
    >
      <Select.Option value={false}>Value</Select.Option>
      <Select.Option value={true}>Unlimited</Select.Option>
    </Select>
  );

  const dataPriceCode =
    data?.length > 0 ? data?.map((item) => item.priceCodeName) : [];

  const filterPriceCode = () => {
    return dataPriceCode.length > 0
      ? ddlPriceCode?.filter((a) => !dataPriceCode?.includes(a.priceCode))
      : ddlPriceCode;
  };

  const onSort = (_, __, sort) => {
    if (sort.order) {
      const order = sort.order === "ascend" ? "asc" : "desc";
      setFieldSort(sort.field);
      setOrderSort(order);
      setSort(`${sort.field}~${order}`);
    } else {
      setFieldSort("");
      setOrderSort("");
      setSort("");
    }
  };

  const filterColumns = (data = []) => {
    return idCreateFrom === 2 || (isCustomTiering && idCreateFrom === 1)
      ? data
      : data.filter((item) => item.title !== "ACTION");
  };
  const handleCancelModal = () => {
    formDetail.resetFields();
    setOpenModal(false);
    setValueOrUnlimited(false);
    setTypeModal("");
    setPDselect(0);
    setMinimum(0);
  };
  const handleMinimum = (e) => {
    setMinimum(e);
  };
  return (
    <div>
      {isCustomTiering ? (
        <div className="w-full flex justify-end mb-[30px]">
          <ButtonComponent
            type={"submit"}
            onClick={() => {
              setOpenModal(true);
              setTypeModal("create");
              setDataUpdate([]);
            }}
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
          >
            Create
          </ButtonComponent>
        </div>
      ) : null}

      <div className="w-full">
        <TablePagination
          dataSource={dataTable?.map((item) => ({
            ...item,
            max:
              item?.max === 0 || hasValue(item?.max) === false
                ? "Unlimited"
                : item?.max,
          }))}
          totalData={totalElement}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          columns={filterColumns(
            columnsDetail(
              search,
              page,
              pageSize,
              searchInput,
              searchedColumn,
              searchText,
              handleSearch,
              handleDelete,
              handleUpdate,
              data,
              minimums,
              isCustomTiering,
            ),
          )}
          tableScrolled={{
            x: 1500,
            y: 300,
          }}
          onSort={onSort}
        />
      </div>

      {/* Modal Value*/}
      <ModalCustom
        isOpen={openModal}
        type="confirmation"
        header="PRICING RULE DETAIL"
        width={700}
        handleOk={() => handleAdd()}
        // handleCancel={() => {
        //   formDetail.resetFields();
        //   setOpenModal(false);
        // }}
        handleCancel={handleCancelModal}
        footer={false}
      >
        <Form layout="vertical" form={formDetail} onFinish={handleAdd}>
          <div className="w-full grid grid-cols-2 gap-2">
            <Form.Item
              label="Price Code"
              name="priceCode"
              getValueFromEvent={handlePriceDetail}
              rules={[
                {
                  required: true,
                  message: "Please input your Price Code!",
                },
              ]}
            >
              <SelectComponent>
                {ddlPriceCode &&
                  ddlPriceCode?.map((data) => (
                    <Select.Option key={data.id} value={data.id}>
                      {data.priceCode}
                    </Select.Option>
                  ))}
              </SelectComponent>
            </Form.Item>
            <Form.Item label="Price Detail" name="priceDetail">
              <InputComponent disabled />
            </Form.Item>
            <Form.Item
              label="Minimum"
              name="min"
              rules={[
                {
                  required: true,
                  message: "Please input your Minimum!",
                },
              ]}
            >
              <InputNumber
                type="number"
                controls={false}
                style={{
                  width: "100%",
                }}
                onChange={handleMinimum}
              />
            </Form.Item>
            <Form.Item
              label="Maximum"
              name="max"
              rules={[
                ...(valueOrUnlimited === false
                  ? [
                      {
                        required: true,
                        message: "Please input your Maximum!",
                      },
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          // from 'getFieldValue("fieldName")' we can get the current value of that field.
                          if (value < minimum) {
                            // value = currentValue of this field. with that we can do validations with other values in form fields
                            return Promise.reject(
                              "Maximum must be greater than Minimum",
                            ); // The validator should always return a promise on both success and error
                          } else if (value === minimum) {
                            return Promise.reject(
                              "Maximmum cannot be same as Minimum",
                            );
                          } else {
                            return Promise.resolve();
                          }
                        },
                      }),
                    ]
                  : [
                      {
                        required: false,
                      },
                    ]),
              ]}
            >
              <InputNumber
                addonBefore={selectBefore}
                type="number"
                controls={false}
                style={{
                  width: "100%",
                }}
                disabled={valueOrUnlimited === true ? true : false}
              />
            </Form.Item>
            <Form.Item
              label="Price Adjustment Detail"
              name="priceAdjustmentDetail"
            >
              <InputComponent disabled />
            </Form.Item>
            <div className="col-span-2">
              <Form.Item
                label={"Description"}
                name={"description"}
                className={"w-full"}
              >
                <InputComponent
                  type="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Item>
            </div>
          </div>
          <div className={"w-full flex justify-end gap-5"}>
            <Form.Item>
              <ButtonComponent type="default" onClick={handleCancelModal}>
                Cancel
              </ButtonComponent>
            </Form.Item>
            <Form.Item>
              <ButtonComponent type="submit" htmlType={"submit"}>
                Save
              </ButtonComponent>
            </Form.Item>
          </div>
        </Form>
      </ModalCustom>
    </div>
  );
};

export default TablePricing;
