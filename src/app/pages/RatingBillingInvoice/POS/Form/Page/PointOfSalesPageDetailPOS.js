import React, {
  useEffect,
  Fragment,
  useState,
  useRef,
  useCallback,
} from "react";
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
import TableRBI from "../../../../../../components/TableRBI";

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
  const numberFields = [
    "price",
    "quantity",
    "amount",
    "amountEqvIdr",
    "amountEqvUsd",
    "eqvIdr",
    "discount",
    "total",
    "totalEqvIdr",
    "totalEqvUsd",
    "totalAmount",
    "totalAmountEqv",
    "vatBasis",
    "vatBasisEqv",
    "vat",
    "vatEqv",
    "witholdingTax",
    "vatExchangeRate",
    "rate",
  ];

  const handleDataSort = (obj) => {
    if (numberFields.includes(fieldSort)) {
      return Number(obj?.[fieldSort] || 0);
    }

    return (obj?.[fieldSort] || "")?.toString()?.toLowerCase();
  };

  let fa = handleDataSort(a);
  let fb = handleDataSort(b);

  const handleCompare = (a, b) => {
    if (numberFields.includes(fieldSort)) {
      return Math.sign(a - b);
    }

    return a.localeCompare(b);
  };

  return handleCompare(fa, fb);
};

const getNormalizedId = (value) =>
  value === undefined || value === null || value === "" || isNaN(value)
    ? value
    : parseInt(value);

const buildPosDetailRow = ({
  formValue,
  priceInformation,
  currentData,
  posNumber,
  posDetailId,
  dataType,
  dataItemBilling,
  dataItemProduct,
}) => {
  const selectedItemName =
    formValue?.type === 2145
      ? dataItemBilling?.find((billingData) => billingData?.id === formValue?.item)
          ?.name
      : dataItemProduct?.find((productData) => productData?.id === formValue?.item)
          ?.name;

  return {
    posNumber: posNumber === undefined ? currentData?.posNumber ?? null : posNumber,
    posDetailId:
      posDetailId === undefined ? currentData?.posDetailId ?? null : posDetailId,
    typeId: formValue?.type,
    type:
      dataType?.find((typeData) => typeData?.Id === formValue?.type)?.text ||
      currentData?.type ||
      priceInformation?.typeName ||
      null,
    typeValueName:
      priceInformation?.typeValueName || currentData?.typeValueName || null,
    source: priceInformation?.source || currentData?.source || null,
    item: priceInformation?.item || currentData?.item || null,
    itemName:
      priceInformation?.itemName ||
      currentData?.itemName ||
      selectedItemName ||
      null,
    itemId: formValue?.item ?? currentData?.itemId ?? null,
    priceCode: priceInformation?.priceCode || currentData?.priceCode || null,
    price: formValue?.price ?? priceInformation?.price ?? currentData?.price ?? null,
    reference:
      priceInformation?.reference ?? currentData?.reference ?? formValue?.reference ?? null,
    referenceName:
      priceInformation?.referenceName || currentData?.referenceName || null,
    quantity:
      formValue?.quantity ?? priceInformation?.quantity ?? currentData?.quantity ?? null,
    uom: formValue?.uom ?? priceInformation?.uom ?? currentData?.uom ?? null,
    currency:
      formValue?.currency ?? priceInformation?.currency ?? currentData?.currency ?? null,
    amount:
      formValue?.amount ?? priceInformation?.amount ?? currentData?.amount ?? null,
    discount:
      formValue?.discount ?? priceInformation?.discount ?? currentData?.discount ?? 0,
    total:
      formValue?.total ?? priceInformation?.total ?? currentData?.total ?? null,
    totalAmount:
      priceInformation?.totalAmount ??
      formValue?.total ??
      currentData?.totalAmount ??
      currentData?.total ??
      null,
    vatBasis: priceInformation?.vatBasis ?? currentData?.vatBasis ?? null,
    vatBasisEqv:
      priceInformation?.vatBasisEqv ?? currentData?.vatBasisEqv ?? null,
    vatRate: priceInformation?.vatRate ?? currentData?.vatRate ?? null,
    vatCode: priceInformation?.vatCode ?? currentData?.vatCode ?? null,
    vat: priceInformation?.vat ?? currentData?.vat ?? null,
    vatEqv: priceInformation?.vatEqv ?? currentData?.vatEqv ?? null,
    witholdingTax:
      priceInformation?.witholdingTax ?? currentData?.witholdingTax ?? null,
    vatExchangeRateType:
      priceInformation?.vatExchangeRateType ||
      currentData?.vatExchangeRateType ||
      null,
    vatExchangeRateDate:
      priceInformation?.vatExchangeRateDate ||
      currentData?.vatExchangeRateDate ||
      null,
    vatExchangeRate:
      priceInformation?.vatExchangeRate ?? currentData?.vatExchangeRate ?? null,
    convertedCurrency:
      formValue?.convertedCurrency ||
      priceInformation?.convertedCurrency ||
      currentData?.convertedCurrency ||
      null,
    totalAmountEqv:
      formValue?.totalAmountEqv ??
      priceInformation?.totalAmountEqv ??
      currentData?.totalAmountEqv ??
      null,
    rateType: priceInformation?.rateType || currentData?.rateType || null,
    rateDate: priceInformation?.rateDate || currentData?.rateDate || null,
    rate: priceInformation?.rate ?? currentData?.rate ?? null,
    amountEqvIdr: formValue?.amountEqvIdr ?? currentData?.amountEqvIdr ?? 0,
    amountEqvUsd: formValue?.amountEqvUsd ?? currentData?.amountEqvUsd ?? 0,
    eqvIdr: formValue?.eqvIdrTaxPurpose ?? currentData?.eqvIdr ?? 0,
    totalEqvUsd: formValue?.totalEqvUsd ?? currentData?.totalEqvUsd ?? 0,
    totalEqvIdr: formValue?.totalEqvIdr ?? currentData?.totalEqvIdr ?? 0,
    remark: formValue?.remark ?? currentData?.remark ?? null,
  };
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
  dataUomCodes = [],
  data_globalCurrency = [],
  customerType = "customer",
}) => {
  const { data_calculate, loading } = useSelector(
    (state) => state.pointOfSales,
  );

  const [formCreate] = Form.useForm();
  const searchInput = useRef(null);
  const ignoreCalculate = useRef(false);

  const [modalKey, setModalKey] = useState(0);

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

  const [modalCreate, setModalCreate] = useState(false);
  const [dataItemFilter, setDataItemFilter] = useState([]);
  const [dataTemp, setDataTemp] = useState([]);
  const [billingCurrency, setBillingCurrency] = useState(null);

  useEffect(() => {
    setDataTemp(data);
  }, [data]);

  // useEffect for product
  useEffect(() => {
    if (type === 2144 && hasValue(item) && hasValue(quantity) && quantity > 0) {
      ignoreCalculate.current = false;

      const requestData = {
        headerCurrency: currency ? String(currency) : null,
        itemId: item,
        qty: parseInt(quantity),
        transactionDate: moment(dataPriority[2]?.data).format(
          dateFormatting.dateFormal,
        ),
      };

      if (customerType !== "prospective" && dataPriority[0]?.data) {
        requestData.account = dataPriority[0]?.data;
      }

      dispatch(getCalculate({ ...requestData }));
      formCreate.resetFields([
        "price",
        "reference",
        "uom",
        "currency",
        "convertedCurrency",
        "discount",
        "total",
        "totalAmountEqv",
        "amountEqvUsd",
        "amountEqvIdr",
        "eqvIdrTaxPurpose",
        "totalEqvUsd",
        "totalEqvIdr",
        "amount",
      ]);
    }
  }, [
    dispatch,
    item,
    quantity,
    dataPriority,
    formCreate,
    type,
    customerType,
    currency,
  ]);

  // useEffect for billing
  useEffect(() => {
    if (type === 2145 && item && amount && amount > 0 && billingCurrency) {
      ignoreCalculate.current = false;

      const requestData = {
        currency: billingCurrency,
        headerCurrency: currency,
        itemCode: item,
        amount: parseInt(amount),
        transactionDate: moment(dataPriority[2]?.data).format(
          dateFormatting.dateFormal,
        ),
      };

      if (customerType !== "prospective" && dataPriority[0]?.data) {
        requestData.account = dataPriority[0]?.data;
      }
      dispatch(getCalculateBilling({ ...requestData }));
      formCreate.resetFields([
        "reference",
        "uom",
        "convertedCurrency",
        "discount",
        "total",
        "totalAmountEqv",
        "amountEqvUsd",
        "amountEqvIdr",
        "eqvIdrTaxPurpose",
        "totalEqvUsd",
        "totalEqvIdr",
      ]);
    }
  }, [dispatch, amount, item, billingCurrency, dataPriority, formCreate, type]);

  useEffect(() => {
    if (ignoreCalculate.current) {
      return;
    }

    if (data_calculate) {
      if (type === 2144) {
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
          convertedCurrency:
            data_calculate?.priceInformation?.convertedCurrency || null,
          discount:
            hasValue(quantity) &&
            data_calculate?.priceInformation?.discount >= 0
              ? data_calculate?.priceInformation?.discount
              : null,
          total:
            hasValue(quantity) && data_calculate?.priceInformation?.total
              ? data_calculate?.priceInformation?.total
              : null,
          totalAmountEqv:
            hasValue(quantity) &&
            data_calculate?.priceInformation?.totalAmountEqv
              ? data_calculate?.priceInformation?.totalAmountEqv
              : null,
          amountEqvUsd: null,
          amountEqvIdr: null,
          eqvIdrTaxPurpose: null,
          totalEqvUsd: null,
          totalEqvIdr: null,
        });
      } else if (type === 2145) {
        formCreate.setFieldsValue({
          amount: data_calculate?.priceInformation?.amount || null,
          reference: data_calculate?.priceInformation?.referenceName || null,
          uom: data_calculate?.priceInformation?.uom || "LUMPSUM",
          currency: data_calculate?.priceInformation?.currency || null,
          convertedCurrency:
            data_calculate?.priceInformation?.convertedCurrency || null,
          discount: data_calculate?.priceInformation?.discount || null,
          total: data_calculate?.priceInformation?.total || null,
          totalAmountEqv:
            data_calculate?.priceInformation?.totalAmountEqv || null,
          amountEqvUsd: null,
          amountEqvIdr: null,
          eqvIdrTaxPurpose: null,
          totalEqvUsd: null,
          totalEqvIdr: null,
        });
      }

      // Set tax info hanya jika type aktif
      if (type === 2144 || type === 2145) {
        setDataTableTax([
          ...(data_calculate?.taxInformation || [])?.map((taxData) => {
            const temp = {
              ...taxData,
              amount:
                taxData?.amount != null
                  ? Number(taxData.amount.toFixed(2))
                  : 0,
              total:
                taxData?.total != null ? Number(taxData.total.toFixed(2)) : 0,
              totalAmountEqv:
                taxData?.totalAmountEqv != null
                  ? Number(taxData.totalAmountEqv.toFixed(4))
                  : 0,
              totalAmount:
                taxData?.totalAmount != null
                  ? Number(taxData.totalAmount.toFixed(2))
                  : taxData?.total != null
                    ? Number(taxData.total.toFixed(2))
                    : 0,
              typeId: taxData?.type,
              type: taxData?.typeName,
              source: taxData?.source || null,
              convertedCurrency: taxData?.convertedCurrency || null,
              reference: taxData?.reference ?? null,
              referenceName: taxData?.referenceName || null,
              quantity: taxData?.quantity ?? null,
              uom: taxData?.uom || null,
              currency: taxData?.currency || null,
              discount: taxData?.discount ?? 0,
              item: taxData?.item || null,
              itemName: taxData?.itemName || null,
              itemId:
                taxData?.itemId ?? taxData?.productId ?? getNormalizedId(taxData?.item),
              priceCode: taxData?.priceCode || null,
              vatBasis: taxData?.vatBasis ?? null,
              vatBasisEqv: taxData?.vatBasisEqv ?? null,
              vatRate: taxData?.vatRate ?? null,
              vatCode: taxData?.vatCode ?? null,
              vat: taxData?.vat ?? null,
              vatEqv: taxData?.vatEqv ?? null,
              witholdingTax: taxData?.witholdingTax ?? null,
              vatExchangeRateType: taxData?.vatExchangeRateType || null,
              vatExchangeRateDate: taxData?.vatExchangeRateDate || null,
              vatExchangeRate: taxData?.vatExchangeRate ?? null,
              rateType: taxData?.rateType || null,
              rateDate: taxData?.rateDate || null,
              rate: taxData?.rate ?? null,
              dataType: "exist",
              totalEqvUsd: 0,
              amountEqvUsd: 0,
              eqvIdr: 0,
              totalEqvIdr: 0,
              amountEqvIdr: 0,
            };
            return temp;
          }),
        ]);
      }
    }
  }, [data_calculate, formCreate, quantity, type]);

  // reset for every changes on data Table or filter
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
                    (isNaN(item.itemId) ? item.itemId : parseInt(item.itemId)),
                )?.name
              : dataItemBilling?.find(
                  (billingData) => billingData?.id === item.itemId,
                )?.name,
        }));

      const temp = (type === 2144 ? dataItemProduct : dataItemBilling)
        .filter(
          (itemData) => !tempItem.some((item) => item.name === itemData?.name),
        )
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
                  : parseInt(isUpdate?.item)),
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

  const handleTypeChanges = useCallback(
    (e) => {
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
        "convertedCurrency",
        "totalAmountEqv",
      ]);
      if (e === 2144) {
        setQuantity(null);
        setItem(null);
        setAmount();
        setBillingCurrency(null);
      } else if (e === 2145) {
        formCreate.setFieldsValue({
          quantity: 1,
          uom: "Lumpsum",
        });
        setQuantity(1);
        setItem(null);
        setAmount();
        setBillingCurrency(null);
      }
      setDataTableTax([]);
      setType(e);
    },
    [formCreate],
  );

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

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleTableChange = (_, __, ___, extra) => {
    setDataTemp(extra?.currentDataSource || []);
  };

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil((dataTemp?.length || 0) / pageSize));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataTemp, page, pageSize]);

  const paginatedData = dataTemp.slice((page - 1) * pageSize, page * pageSize);

  const onFinish = (e, typeAction = "") => {
    if (isUpdate.type || typeAction === "priorityChanges") {
      const updatedData = buildPosDetailRow({
        formValue: e,
        priceInformation: data_calculate?.priceInformation,
        currentData: data?.[isUpdate.index],
        posNumber,
        posDetailId,
        dataType,
        dataItemBilling,
        dataItemProduct,
      });
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
                    : parseInt(isUpdate.item))),
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
                (isNaN(isUpdate.item)
                  ? isUpdate.item
                  : parseInt(isUpdate.item)),
            )
            .map((dataItem, index) => ({ ...dataItem, lineNumber: index + 1 }));
        }
      });
    } else {
      const newData = buildPosDetailRow({
        formValue: e,
        priceInformation: data_calculate?.priceInformation,
        currentData: null,
        posNumber,
        posDetailId,
        dataType,
        dataItemBilling,
        dataItemProduct,
      });
      setData((prevData) => {
        const temp = [
          ...(prevData || []),
          newData || {},
          ...(e?.type === 2144 ? dataTableTax : []),
        ];
        return temp.map((dataItem, index) => ({
          ...dataItem,
          lineNumber: index + 1,
        }));
      });
    }

    handleResetAllState();
  };

  const handleDelete = (r) => {
    const currentItemId = getNormalizedId(r?.itemId);
    const temp = data.filter(
      (dataItem) =>
        getNormalizedId(dataItem.itemId) !== currentItemId &&
        getNormalizedId(dataItem.reference) !== currentItemId,
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

  const handleInputChange = debounce((value, inputType) => {
    if (inputType === "quantity") {
      setQuantity(value);
    } else {
      setAmount(value);
    }
  }, 1500);

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

  const handleResetAllState = useCallback(() => {
    setModalCreate(false);
    setDataItemFilter([]);
    formCreate.resetFields();
    setType(null);
    setItem(null);
    setQuantity(null);
    setAmount(null);
    setBillingCurrency(null);
    setDataTableTax([]);
    setIsUpdate({ type: false, index: null, item: null });
    setPosDetailId(undefined);
    setPosNumber(undefined);
    setModalKey((prev) => prev + 1);
  }, [formCreate]);

  const handleCancel = useCallback(() => {
    handleResetAllState();
  }, [handleResetAllState]);

  const handleOpenCreate = useCallback(() => {
    ignoreCalculate.current = true;

    formCreate.resetFields();
    setType(null);
    setItem(null);
    setQuantity(null);
    setAmount(null);
    setBillingCurrency(null);
    setDataTableTax([]);
    setIsUpdate({ type: false, index: null, item: null });
    setPosDetailId(undefined);
    setPosNumber(undefined);
    setDataItemFilter([]);
    setModalKey((prev) => prev + 1);
    setModalCreate(true);
  }, [formCreate]);

  const handleUpdate = (e, index) => {
    ignoreCalculate.current = false;

    formCreate.resetFields();
    setType(null);
    setItem(null);
    setQuantity(null);
    setAmount(null);
    setBillingCurrency(null);
    setDataTableTax([]);
    setModalKey((prev) => prev + 1);

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
        ? dataItemProduct?.find(
            (productData) => productData?.id === parseInt(e?.itemId),
          )?.id
        : dataItemBilling?.find((billingData) => billingData?.id === e?.itemId)
            ?.id,
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
              handleOpenCreate();
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
        <TableRBI
          idTable="table-pos-detail-info"
          dataSource={paginatedData}
          totalData={dataTemp.length}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          onSizeChanger={handleChange}
          tableScrolled={{
            x: 5000,
            y: 300,
          }}
          onSort={handleTableChange}
          showAdvanceSearch={false}
          showSearchBar={false}
          showRefresh={false}
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
            paginatedData,
            "editable",
          )}
        />
      </div>

      {/* modal create / update */}
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
            key={modalKey}
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
            dataUomCodes={dataUomCodes}
            data_globalCurrency={data_globalCurrency}
            headerCurrency={currency}
            onCurrencyChange={(val) => setBillingCurrency(val)}
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
              dataMissing?.map((missingData) => missingData?.name).join(", ") ||
              ""
            } field first.`}
          </p>
        </div>
      </ModalError>
    </Fragment>
  );
};

export default PointOfSalesPageDetailPOS;