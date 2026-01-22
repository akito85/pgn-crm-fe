import React, { useEffect, Fragment, useState, useRef, useCallback } from "react";
import { Form } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { dateFormatting, hasValue } from "../../../../../../utils";
import CreateAndUpdatePOSDetail from "./CreateAndUpdatePOSDetail";
import {
  getCalculate,
  getCalculateBilling,
} from "../../../../../../redux/slices/rating_billing_invoice/PointOfSales";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../../utils/Icon";
import { columnsTablePOSDetailInfo } from "../../Table/TablePOSDetailInfo";
import TablePaginationNewTablePOS from "../../Table/TablePaginationNewTablePOS";

// Filter Table
const onFilter = (dataIndex, value, record) => {
  const fixSearchText = value?.toLowerCase();
  switch (dataIndex) {
    case "price":
    case "quantity":
    case "amount":
    case "amountEqvIdr":
    case "amountEqvUsd":
    case "eqvIdr":
    case "discount":
    case "total":
    case "totalEqvIdr":
    case "totalEqvUsd":
      const tempValue = record[dataIndex]
        ? (record[dataIndex] + "").split(".")
        : [];
      const thousandSeparator = ".";
      const decimalSeparator = ",";
      const descimal = tempValue[1]
        ? `${decimalSeparator}${tempValue[1]}`
        : `${decimalSeparator}00`;
      const format =
        tempValue.length > 0
          ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
            descimal
          : "";
      return format.toLowerCase().includes(fixSearchText);

    default:
      return record[dataIndex]?.toLowerCase().includes(fixSearchText);
  }
};

// Sorting Table
const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "price":
      case "quantity":
      case "amount":
      case "amountEqvIdr":
      case "amountEqvUsd":
      case "eqvIdr":
      case "discount":
      case "total":
      case "totalEqvIdr":
      case "totalEqvUsd":
        return obj[fieldSort] ? (obj[fieldSort] || 0)?.toString()?.toLowerCase() : "0" ;
      default:
        return obj[fieldSort]?.toLowerCase();
    }
  };

  let fa = handleDataSort(a);
  let fb = handleDataSort(b);

  const handleCompare = (a, b) => {
    switch (fieldSort) {
      case "price":
      case "quantity":
      case "amount":
      case "amountEqvIdr":
      case "amountEqvUsd":
      case "eqvIdr":
      case "discount":
      case "total":
      case "totalEqvIdr":
      case "totalEqvUsd":
        return Math.sign(parseInt(a) - parseInt(b));
      default:
        return a.localeCompare(b);
    }
  };

  return handleCompare(fa, fb);
};

const PointOfSalesPageDetailPOS = ({
  data = [],
  setData = () => {},
  dispatch = () => {},
  dataType = [],
  dataItemBilling = [],
  dataItemProduct = [],
  dataMissing = [],
  dataPriority = [],
  currency,
  transactionDate,
  accountNumber,
  idPos,
}) => {
  const { data_calculate, loading } = useSelector((state) => state.pointOfSales);

  //declare
  const [formCreate] = Form.useForm();
  const searchInput = useRef(null);

  // Use State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});

  const [posNumber, setPosNumber] = useState();
  const [posDetailId, setPosDetailId] = useState();

  const [modalValidate, setModalValidate] = useState(false);
  const [dataTableTax, setDataTableTax] = useState([]);
  const [type, setType] = useState(false);
  const [quantity, setQuantity] = useState(null);
  const [amount, setAmount] = useState(null);
  const [item, setItem] = useState();
  const [isUpdate, setIsUpdate] = useState({
    type: false,
    index: 0,
    item: 0,
  });

  //modal
  const [modalCreate, setModalCreate] = useState(false);
  const [dataItemFilter, setDataItemFilter] = useState([]);
  const [dataTemp, setDataTemp] = useState([]);

  useEffect(() => {
    setDataTemp(data);
  }, [data]);

  //useEffect for product
  useEffect(() => {
    if (type === 2144 && hasValue(item)) {
      const requestData = {
        account: dataPriority[0]?.data,
        itemId: item,
        qty: hasValue(quantity) || quantity > 0 ? parseInt(quantity) : null,
        transactionDate: moment(dataPriority[2]?.data).format(
          dateFormatting.dateFormal
        ),
      };
      dispatch(getCalculate({ ...requestData }));
      formCreate.resetFields([
        "price",
        "reference",
        "uom",
        "currency",
        "amountEqvUsd",
        "amountEqvIdr",
        "eqvIdrTaxPurpose",
        "discount",
        "total",
        "totalEqvUsd",
        "totalEqvIdr",
        "amount",
      ]);
    }
  }, [dispatch, item, quantity, dataPriority, formCreate, type]);

  //useEffect for billing
  useEffect(() => {
    if (type === 2145 && item && amount && amount > 0) {
      const requestData = {
        currency: dataPriority[1]?.data,
        itemCode: item,
        amount: parseInt(amount),
        transactionDate: moment(dataPriority[2]?.data).format(
          dateFormatting.dateFormal
        ),
      };
      dispatch(getCalculateBilling({ ...requestData }));
      formCreate.resetFields([
        "reference",
        "uom",
        "currency",
        "amountEqvUsd",
        "amountEqvIdr",
        "eqvIdrTaxPurpose",
        "discount",
        "total",
        "totalEqvUsd",
        "totalEqvIdr",
        "amount",
      ]);
    }
  }, [dispatch, amount, item, dataPriority, formCreate, type]);

  console.log(data, "data");
  
  useEffect(() => {
    if (data_calculate) {
      if (type === 2144) {
        console.log(hasValue(data_calculate?.priceInformation?.discount), data_calculate?.priceInformation?.discount);
        console.log(hasValue(data_calculate?.priceInformation?.discount) && data_calculate?.priceInformation?.discount);
        
        //product case
        formCreate.setFieldsValue({
          price: data_calculate?.priceInformation?.price || null,
          amount:
            hasValue(quantity) && data_calculate?.priceInformation?.amount
              ? data_calculate?.priceInformation?.amount
              : null,
          reference:
            hasValue(quantity) &&
            data_calculate?.priceInformation?.referenceName
              ? data_calculate?.priceInformation?.referenceName
              : null,
          uom: data_calculate?.priceInformation?.uom || null,
          currency: data_calculate?.priceInformation?.currency || null,
          amountEqvUsd:
            hasValue(quantity) && data_calculate?.priceInformation?.amountEqvUsd
              ? Number(
                  data_calculate?.priceInformation?.amountEqvUsd.toFixed(2)
                )
              : null,
          amountEqvIdr:
            hasValue(quantity) && data_calculate?.priceInformation?.amountEqvIdr
              ? data_calculate?.priceInformation?.amountEqvIdr
              : null,
          eqvIdrTaxPurpose:
            hasValue(quantity) && data_calculate?.priceInformation?.eqvIdr
              ? data_calculate?.priceInformation?.eqvIdr
              : null,
          discount:
            hasValue(quantity) &&
            data_calculate?.priceInformation?.discount >= 0
              ? data_calculate?.priceInformation?.discount
              : null,
          total:
            hasValue(quantity) && data_calculate?.priceInformation?.total
              ? data_calculate?.priceInformation?.total
              : null,
          totalEqvUsd:
            hasValue(quantity) && data_calculate?.priceInformation?.totalEqvUsd
              ? data_calculate?.priceInformation?.totalEqvUsd.toFixed(2)
              : null,
          totalEqvIdr:
            hasValue(quantity) && data_calculate?.priceInformation?.totalEqvIdr
              ? data_calculate?.priceInformation?.totalEqvIdr
              : null,
        });
      } else {
        formCreate.setFieldsValue({
          amount: data_calculate?.priceInformation?.amount || null,
          reference: data_calculate?.priceInformation?.referenceName || null,
          uom: data_calculate?.priceInformation?.uom || null,
          currency: data_calculate?.priceInformation?.currency || null,
          amountEqvUsd: data_calculate?.priceInformation?.amountEqvUsd
            ? Number(data_calculate?.priceInformation?.amountEqvUsd.toFixed(2))
            : null,
          amountEqvIdr: data_calculate?.priceInformation?.amountEqvIdr || null,
          eqvIdrTaxPurpose: data_calculate?.priceInformation?.eqvIdr || null,
          discount: data_calculate?.priceInformation?.discount || null,
          total: data_calculate?.priceInformation?.total || null,
          totalEqvUsd: data_calculate?.priceInformation?.totalEqvUsd
            ? data_calculate?.priceInformation?.totalEqvUsd.toFixed(2)
            : null,
          totalEqvIdr: data_calculate?.priceInformation?.totalEqvIdr || null,
        });
      }
      setDataTableTax([
        ...(data_calculate?.taxInformation || [])?.map((taxData) => {
          const temp = {
            ...taxData,
            amount: Number(taxData?.amount.toFixed(2)),
            typeId: taxData?.type,
            type: taxData?.typeName,
            totalEqvUsd: Number(taxData?.totalEqvUsd.toFixed(2)),
            amountEqvUsd: Number(taxData?.amountEqvUsd.toFixed(2)),
            eqvIdr: taxData?.eqvIdr,
            total: Number(taxData?.total.toFixed(2)),
            item: taxData?.itemName,
            itemId: taxData?.item,
            dataType: "exist",
          };
          delete temp?.itemName;
          return temp;
        }),
      ]);
    }
  }, [data_calculate, formCreate, quantity, type]);

  //reset for every changes on data Table or filter
  useEffect(() => {
    if (data.length > 0 || (type && type !== undefined)) {
      const tempItem = data
        .filter((item) => item.typeId === type)
        .map((item) => ({
          id: isNaN(item.itemId) ? item.itemId : parseInt(item.itemId),
          name:
            type === 2144
              ? dataItemProduct?.find(
                  (productData) =>
                    productData?.id ===
                    (isNaN(item.itemId) ? item.itemId : parseInt(item.itemId))
                )?.name
              : dataItemBilling?.find((billingData) => billingData?.id === item.itemId)?.name,
        }));

      const temp = (type === 2144 ? dataItemProduct : dataItemBilling)
        .filter((itemData) => !tempItem.some((item) => item.name === itemData?.name))
        .map((item) => ({ id: item.id, name: item.name }));

      if (isUpdate.type) {
        setDataItemFilter([
          ...temp,
          ...tempItem
            ?.filter(
              (itemData) =>
                itemData?.id ===
                (isNaN(isUpdate?.item)
                  ? isUpdate?.item
                  : parseInt(isUpdate?.item))
            )
            .map((item) => ({ id: item.id, name: item.name })),
        ]);
      } else {
        setDataItemFilter(temp);
      }
    } else {
      setDataItemFilter([]);
    }
  }, [data, type, isUpdate, dataItemBilling, dataItemProduct]);

  //for handling data from API if existing to dataTable
  const handleTypeChanges = useCallback((e) => {
    formCreate.resetFields([
      "quantity",
      "item",
      "price",
      "reference",
      "uom",
      "currency",
      "amountEqvUsd",
      "amountEqvIdr",
      "eqvIdrTaxPurpose",
      "discount",
      "total",
      "totalEqvUsd",
      "totalEqvIdr",
      "amount",
    ]);
    if (e === 2144) {
      setQuantity(null);
      setItem(null);
      setAmount();
    } else if (e === 2145) {
      formCreate.setFieldsValue({
        quantity: 1,
      });
      setQuantity(1);
      setItem(null);
      setAmount();
    }
    setDataTableTax([]);
    setType(e);
  }, [formCreate]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
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
  };

  // Handle Change Page
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onFinish = (e, typeAction = "") => {
    if (isUpdate.type || typeAction === "priorityChanges") {
      const updatedData = {
        posNumber: posNumber === undefined ? null : posNumber,
        posDetailId: posDetailId === undefined ? null : posDetailId,
        typeId: e?.type,
        typeValueName: data_calculate?.priceInformation?.typeValueName || null,
        type: dataType?.find((typeData) => typeData?.Id === e?.type)?.text,
        item:
          e?.type === 2145
            ? dataItemBilling?.find((billingData) => billingData?.id === e?.item)?.name
            : dataItemProduct?.find((productData) => productData?.id === e?.item)?.name,
        itemId: e?.item,
        price: e?.price,
        reference: e?.reference,
        quantity: e?.quantity,
        uom: e?.uom,
        currency: e?.currency,
        amount: e?.amount,
        discount: e?.discount || 0,
        total: e?.total,
        amountEqvIdr: e?.amountEqvIdr,
        amountEqvUsd: e?.amountEqvUsd,
        eqvIdr: e?.eqvIdrTaxPurpose || 0,
        totalEqvUsd: e?.totalEqvUsd,
        totalEqvIdr: e?.totalEqvIdr,
        remark: e?.remark,
      };
      setData((prevData) => {
        const newData = [...(prevData || [])];
        newData[isUpdate.index] = updatedData;
        if (e?.type === 2144) {
          const temp = newData.filter(
            (dataItem) =>
              !dataItem.reference ||
              (dataItem.reference &&
                dataItem.reference !==
                  (isNaN(isUpdate.item)
                    ? isUpdate.item
                    : parseInt(isUpdate.item)))
          );
          const tempAllNewData = [
            ...temp.slice(0, isUpdate.index + 1),
            ...(dataTableTax || []),
            ...temp.slice(isUpdate.index + 1),
          ];

          return tempAllNewData.map((dataItem, index) => ({
            ...dataItem,
            lineNumber: index + 1,
          }));
        } else {
          return newData
            .filter(
              (dataItem) =>
                dataItem.reference !==
                (isNaN(isUpdate.item) ? isUpdate.item : parseInt(isUpdate.item))
            )
            .map((dataItem, index) => ({ ...dataItem, lineNumber: index + 1 }));
        }
      });
    } else {
      //create
      const newData = {
        typeId: e?.type,
        type: dataType?.find((typeData) => typeData?.Id === e?.type)?.text,
        typeValueName: data_calculate?.priceInformation?.typeValueName || null,
        itemId: e?.item,
        item:
          e?.type === 2145
            ? dataItemBilling?.find((billingData) => billingData?.id === e?.item)?.name
            : dataItemProduct?.find((productData) => productData?.id === e?.item)?.name,
        price: e?.price,
        reference: e?.reference,
        quantity: e?.quantity,
        uom: e?.uom,
        currency: e?.currency,
        amount: e?.amount,
        discount: e?.discount || 0,
        amountEqvIdr: e?.amountEqvIdr,
        amountEqvUsd: e?.amountEqvUsd,
        total: e?.total,
        eqvIdr: e?.eqvIdrTaxPurpose || 0,
        totalEqvUsd: e?.totalEqvUsd,
        totalEqvIdr: e?.totalEqvIdr,
        remark: e?.remark,
      };
      setData((prevData) => {
        const temp = [
          ...(prevData || []),
          newData || {},
          ...(e?.type === 2144 ? dataTableTax : []),
        ];
        return temp.map((dataItem, index) => ({ ...dataItem, lineNumber: index + 1 }));
      });
    }
    setModalCreate(false);
    formCreate.resetFields();
    setType();
    setItem();
    setQuantity();
    setIsUpdate(false);
    setDataItemFilter([]);
  };

  const handleDelete = (r) => {
    const temp = data.filter(
      (dataItem) => dataItem.item !== r?.item && dataItem.reference !== parseInt(r?.itemId)
    );
    setData(temp);
  };

  const debounce = (func, delay) => {
    let timerId;
    return function (...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  // Debounced version of the function you want to execute on input change
  const handleInputChange = debounce((value, inputType) => {
    if (inputType === "quantity") {
      setQuantity(value);
    } else {
      setAmount(value);
    }
  }, 500);

  // Event handler for Input component with getValueFromEvent
  const onInputChange = (e, inputType) => {
    let result;
    switch (inputType) {
      case "amount":
        result = e.floatValue || 0;
        break;
      default:
        result = e.target.value || null;
        break;
    }
    handleInputChange(result, inputType);
  };

  const handleCancel = () => {
    setModalCreate(false);
    setDataItemFilter([]);
    formCreate.resetFields();
    setType(null);
    setItem(null);
    setQuantity(null);
    setDataTableTax([]);
    setIsUpdate({ type: false, index: null, item: null });
  };

  const handleUpdate = (e, index) => {
    setIsUpdate({
      type: true,
      index: index,
      item: isNaN(e?.itemId) ? e?.itemId : parseInt(e?.itemId),
    });

    setPosDetailId(e?.posDetailId);
    setPosNumber(e?.posNumber);
    formCreate.setFieldsValue({
      ...e,
      type: e?.typeId,
      eqvIdrTaxPurpose: e?.eqvIdr,
      item: isNaN(e?.itemId) ? e?.itemId : parseInt(e?.itemId),
    });
    setQuantity(e?.quantity);
    setItem(
      e?.typeId === 2144
        ? dataItemProduct?.find((productData) => productData?.id === parseInt(e?.itemId))?.id
        : dataItemBilling?.find((billingData) => billingData?.id === e?.itemId)?.id
    );
    setType(e?.typeId);

    const tempTax = data.filter((dataItem) => dataItem.reference === e?.itemId);
    setDataTableTax(tempTax);
    setModalCreate(true);
  };

  return (
    <Fragment>
      {idPos ? (
        <div className="flex align-middle gap-2">
          <p className="text-[15px] font-semibold text-text-color-semibold">
            Pos Number:
          </p>
          <p className="text-[15px] font-semibold text-primary">{idPos}</p>
        </div>
      ) : null}
      <div className={"w-full flex justify-end mb-5"}>
        <ButtonComponent
          onClick={() => {
            if (dataMissing.length < 1) {
              setModalCreate(true);
            } else {
              setModalValidate(true);
            }
          }}
          type={"submit"}
          border={false}
          icon={<PlusOutlined style={{ fontSize: "24px" }} />}
        >
          Create
        </ButtonComponent>
      </div>

      <div className={"w-full mt-5"}>
        <TablePaginationNewTablePOS
          type="FE"
          dataSource={data}
          totalData={data.length}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          tableScrolled={{
            x: 5000,
            y: 300,
          }}
          setData={setDataTemp}
          columns={columnsTablePOSDetailInfo(
            search,
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            handleUpdate,
            handleDelete,
            onFilter,
            sorter,
            dataTemp,
            "editable"
          )}
        />
      </div>

      {/* modal create */}
      <ModalCustom
        isOpen={modalCreate}
        type={"confirmation"}
        header={`${isUpdate?.type ? "Update" : "Create"} Point Of Sales`}
        width={1200}
        handleCancel={() => {
          handleCancel();
        }}
        footer={
          <div className={"w-full flex justify-end"}>
            <div className="w-full flex justify-end gap-5">
              <ButtonComponent
                type={"default"}
                onClick={() => {
                  handleCancel();
                }}
                disabled={loading}
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                form={"formCreate"}
                type={"submit"}
                htmlType="submit"
                loading={loading}
                disabled={loading}
              >
                Save
              </ButtonComponent>
            </div>
          </div>
        }
      >
        <Form
          id="formCreate"
          layout="vertical"
          form={formCreate}
          onFinish={onFinish}
        >
          <CreateAndUpdatePOSDetail
            data={dataTableTax}
            dispatch={dispatch}
            setData={setDataTableTax}
            type={type}
            setType={handleTypeChanges}
            quantity={quantity}
            setQuantity={setQuantity}
            setItem={setItem}
            item={item}
            onInputChange={onInputChange}
            dataItem={dataItemFilter}
            dataType={dataType}
            loading={loading}
          />
        </Form>
      </ModalCustom>

      <ModalError
        isOpen={modalValidate}
        handleOk={() => setModalValidate(false)}
        handleCancel={() => setModalValidate(false)}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {IconModal["icon_error_default"]}
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">
            {`You can't create Point of Sales Details. Please fill out the ${
              dataMissing?.map((missingData) => missingData?.name).join(", ") || ""
            } field first.`}
          </p>
        </div>
      </ModalError>
    </Fragment>
  );
};

export default PointOfSalesPageDetailPOS;