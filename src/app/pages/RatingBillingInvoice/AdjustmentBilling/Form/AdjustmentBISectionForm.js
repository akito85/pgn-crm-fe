import React, { useState, useRef, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Form, InputNumber } from "antd";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { columnsTableABI } from "../Table/TableAdjustmentBIllingItem";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import SelectComponent from "../../../../../components/SelectComponent";
import InputComponent from "../../../../../components/InputComponent";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import {
  getListDetailType,
  getListItem,
  getInvoiceInformation,
  getInvoiceBillingItemList,
} from "../../../../../redux/slices/rating_billing_invoice/adjustmentBilling";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import CardComponent from "../../../../../components/Card/CardComponent";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";
import moment from "moment";
import TableRBI from "../../../../../components/TableRBI";

const AdjustmentBISectionForm = ({
  children,
  type,
  listDataABI = [],
  setListDataABI,
  invoiceNumber,
  dataInvoice,
  adjustmentId,
  showAction,
  showCreateButtonInHeader = false,
  onCreateClick,
}) => {
  // Selector
  const { dataListItem, dataDetailType, dataInvoiceInfo, dataBillingItemList } = useSelector(
    (state) => state.adjustmentBilling
  );

  // Declaration
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const [formDetail] = Form.useForm();

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [description, setDescription] = useState("");
  const [typeModal, setTypeModal] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalValidation, setModalValidation] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const [keyTable, setKeyTable] = useState();
  const [dataItem, setDataItem] = useState();
  const [adjustmentAmount, setAdjustmentAmount] = useState(0);
  const [typeBI, setTypeBI] = useState();
  const [modalHistory, setModalHistory] = useState(false);
  const [dataHistory, setDataHistory] = useState({});

  // Use Effect
  useEffect(() => {
    dispatch(getListDetailType());
  }, [dispatch]);

  useEffect(() => {
    if (dataInvoice?.billingCode) {
      dispatch(getListItem(dataInvoice?.billingCode));
    }
  }, [dispatch, dataInvoice?.billingCode]);

  // Fetch invoice information when invoiceNumber changes
  useEffect(() => {
    if (invoiceNumber && type !== "detail" && type !== "show") {
      dispatch(getInvoiceInformation(invoiceNumber));
    }
  }, [dispatch, invoiceNumber, type]);

  // Fetch billing item list when billingNumber is available
  useEffect(() => {
    if (dataInvoiceInfo?.billingNumber && type !== "detail" && type !== "show") {
      dispatch(getInvoiceBillingItemList(dataInvoiceInfo?.billingNumber));
    }
  }, [dispatch, dataInvoiceInfo?.billingNumber, type]);

  useEffect(() => {
    if (dataItem) {
      const dataListItemDetail = dataListItem?.data?.find(
        (a) => a.billingItem === dataItem
      );

      formDetail.setFieldsValue({
        price: dataListItemDetail?.price,
        uom: dataListItemDetail?.uom,
        totalAmount: dataListItemDetail?.totalAmount,
        currency: dataListItemDetail?.currency,
        amount: dataListItemDetail?.amount,
        totalAmountEqvIdr: dataListItemDetail?.totalAmountEqvIdr,
        totalAmountEqvUsd: dataListItemDetail?.totalAmountEqvUsd,
      });
    } else {
      formDetail.resetFields([
        "price",
        "uom",
        "currency",
        "amount",
        "totalAmount",
        "totalAmountEqvIdr",
        "totalAmountEqvUsd",
      ]);
    }
  }, [dataItem, formDetail]);

  // Calculation Total Amount
  useEffect(() => {
    let newTotalAmount = formDetail.getFieldValue().amount;
    let currency = formDetail.getFieldValue().currency;
    const dataListItemDetail = dataListItem?.data?.find(
      (a) => a.billingItem === dataItem
    );

    if (adjustmentAmount) {
      if (typeBI === 2345) {
        newTotalAmount += adjustmentAmount;
      }
      if (typeBI === 2344) {
        newTotalAmount -= adjustmentAmount;
      }
    }

    // Calculation Total Amount = Total Amount Eqv IDR/USD based on Currency
    if (currency === "IDR") {
      formDetail.setFieldsValue({
        totalAmountEqvIdr: newTotalAmount,
        totalAmountEqvUsd: newTotalAmount / dataListItemDetail?.rate,
      });
    }
    if (currency === "USD") {
      formDetail.setFieldsValue({
        totalAmountEqvUsd: newTotalAmount,
        totalAmountEqvIdr: newTotalAmount * dataListItemDetail?.rate,
      });
    }

    formDetail.setFieldsValue({
      totalAmount: newTotalAmount,
    });
  }, [adjustmentAmount, typeBI, formDetail, dataListItem?.data, dataItem]);

  // Set Value Form Update
  useEffect(() => {
    if (typeModal === "update") {
      formDetail.setFieldsValue({
        item: dataUpdate.item,
        quantity: dataUpdate.quantity,
        price: dataUpdate.price,
        uom: dataUpdate.uom,
        currency: dataUpdate.currency,
        amount: dataUpdate.amount,
        adjustmentAmount: dataUpdate.adjustmentAmount,
        totalAmount: dataUpdate.totalAmount,
        totalAmountEqvIdr: dataUpdate.totalAmountEqvIdr,
        totalAmountEqvUsd: dataUpdate.totalAmountEqvUsd,
        remark: dataUpdate.remark,
        type: dataUpdate.type,
      });
    }
  }, [typeModal, formDetail]);

  // Handle Change Table
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
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

  // Filter Table
  const onFilter = (dataIndex, value, record) => {
    const fixSearchText = value?.toLowerCase();
    switch (dataIndex) {
      case "price":
      case "amount":
      case "adjustmentAmount":
      case "totalAmount":
      case "totalAmountEqvIdr":
      case "totalAmountEqvUsd":
      case "quantity":
        const tempValue = record[dataIndex]
          ? (record[dataIndex] + "").split(".")
          : [];
        const thousandSeparator = ",";
        const decimalSeparator = ".";
        const descimal = tempValue[1]
          ? `${decimalSeparator}${tempValue[1]}`
          : `${decimalSeparator}00`;
        const format =
          tempValue.length > 0
            ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
              descimal
            : "";
        return format.toLowerCase().includes(fixSearchText);

      case "type":
        const tempValueType = record[dataIndex] || 0;
        const typeName = dataDetailType
          ?.filter((item) => item?.id === tempValueType)
          .map((name) => name?.name)
          .shift();
        return (typeName || "").toLowerCase().includes(fixSearchText);

      default:
        return record[dataIndex]?.toLowerCase().includes(fixSearchText);
    }
  };

  // Sorting Table
  const sorter = (fieldSort, a, b) => {
    const handleDataSort = (obj) => {
      switch (fieldSort) {
        case "price":
        case "amount":
        case "adjustmentAmount":
        case "totalAmount":
        case "totalAmountEqvIdr":
        case "totalAmountEqvUsd":
        case "quantity":
          const tempValue = obj[fieldSort]
            ? (obj[fieldSort] + "").split(".")
            : [];
          const thousandSeparator = ",";
          const decimalSeparator = ".";
          const descimal = tempValue[1]
            ? `${decimalSeparator}${tempValue[1]}`
            : `${decimalSeparator}00`;
          const format =
            tempValue.length > 0
              ? tempValue[0].replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  thousandSeparator
                ) + descimal
              : "";
          return format.toLowerCase();

        case "type":
          const valueType = obj[fieldSort];
          const typeName = dataDetailType
            ?.filter((item) => item?.id === valueType)
            .map((name) => name?.name)
            .shift();
          const tempSort = obj[fieldSort] ? typeName : "";
          return tempSort.toLowerCase();

        default:
          return obj[fieldSort]?.toLowerCase();
      }
    };
    let fa = handleDataSort(a);
    let fb = handleDataSort(b);
    return fa.localeCompare(fb);
  };

  // Function Filter Columns
  const filterColumns = (data = []) => {
    return type === "detail"
      ? data.filter((item) => item.title !== "ACTION")
      : data;
  };

  // Delete Row
  const handleDelete = useCallback(
    (r) => {
      setListDataABI((prevState) => prevState.filter((e) => e.key !== r.key));
    },
    [listDataABI]
  );

  // Handle Cancel Modal
  const handleCancelModal = () => {
    formDetail.resetFields();
    setOpenModal(false);
    setTypeModal("");
    setDataItem();
    setAdjustmentAmount(0);
  };

  const onChangeItem = (e) => {
    setDataItem(e || null);
    return e;
  };

  const onChangeAdjustmentAmount = (e) => {
    setAdjustmentAmount(e.floatValue || null);
    return e.floatValue;
  };

  const dataBillingItem =
    listDataABI?.length > 0 ? listDataABI?.map((item) => item?.item) : [];

  // console.log(dataBillingItem);

  const filterBillingItem = () => {
    return dataBillingItem.length > 0
      ? dataListItem?.data?.filter(
          (a) => !dataBillingItem?.includes(a.billingItem)
        )
      : dataListItem?.data;
  };

  // Handle Add Value to Array
  const handleAdd = (formValue) => {
    const findDataItem = dataListItem?.data?.find(
      (item) => item.billingItem === formValue?.item
    )?.billingItemCode;

    if (typeModal === "create") {
      const newData = [...listDataABI];

      const dataValue = {
        adjustmentId: type === "update" ? adjustmentId : null,
        key: listDataABI.length + 1,
        itemCode: findDataItem,
        ...formValue,
      };

      newData.push(dataValue);
      setListDataABI(newData);
      setOpenModal(false);
      formDetail.resetFields();
      setTypeModal("");
    } else {
      const dataValue = {
        adjustmentId: type === "update" ? dataUpdate.adjustmentId : null,
        id: type === "update" ? dataUpdate?.id : undefined,
        key: keyTable,
        itemCode: findDataItem,
        ...formValue,
      };
      // const dataValue = { ...formValue, key: keyTable };
      const findIndex = listDataABI.findIndex((item) => item?.key === keyTable);
      const newData = [...listDataABI];
      const item = newData[findIndex];
      const updatedRow = { ...item, ...dataValue };
      newData.splice(findIndex, 1, updatedRow);
      setListDataABI(newData);
      setOpenModal(false);
      formDetail.resetFields();
      setTypeModal("");
    }
  };

  // Handle Update
  const handleUpdate = (r) => {
    setDataItem(r?.item);
    setDataUpdate(r);
    setKeyTable(r?.key);
    setTypeModal("update");
    setOpenModal(true);
  };

  // onChange Type
  const onChangeType = (e) => {
    setTypeBI(e || undefined);
    return e;
  };

  const handleDetail = (r) => {
    setModalHistory(true);
    setDataHistory({
      recordId: r?.adjustmentId,
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

  const handleCreateClick = useCallback(() => {
    if (invoiceNumber === undefined) {
      setModalValidation(true);
      return;
    }

    // Check if billing item list is available
    if (!dataBillingItemList || dataBillingItemList.length === 0) {
      setModalValidation(true);
      return;
    }

    // Get the first billing item from the API response
    const firstBillingItem = dataBillingItemList[0];

    // Create new row with data from first billing item
    const newRow = {
      key: listDataABI.length + 1,
      adjustmentId: type === "update" ? adjustmentId : null,
      itemCode: firstBillingItem?.billingItemCode || firstBillingItem?.itemCode,
      item: firstBillingItem?.billingItem || firstBillingItem?.item,
      quantity: firstBillingItem?.quantity || 0,
      price: firstBillingItem?.price || 0,
      uom: firstBillingItem?.uom || "",
      currency: firstBillingItem?.currency || "",
      priceCode: firstBillingItem?.priceCode || "Value",
      amount: firstBillingItem?.amount || 0,
      adjustmentAmount: 0,
      totalAmount: firstBillingItem?.amount || 0,
      totalAmountEqvIdr: firstBillingItem?.totalAmountEqvIdr || 0,
      totalAmountEqvUsd: firstBillingItem?.totalAmountEqvUsd || 0,
      type: null,
      remark: "",
      typeBasis: firstBillingItem?.typeBasis || "Debit",
      discountAmount: firstBillingItem?.discountAmount || 0,
    };

    // Add the new row to the table
    setListDataABI((prevData) => [...prevData, newRow]);
  }, [invoiceNumber, dataBillingItemList, listDataABI, type, adjustmentId, setListDataABI]);

  // Expose handleCreateClick to parent via onCreateClick callback
  useEffect(() => {
    if (onCreateClick && showCreateButtonInHeader) {
      onCreateClick(handleCreateClick);
    }
  }, [onCreateClick, showCreateButtonInHeader, handleCreateClick]);

  return (
    <div>
      {!showCreateButtonInHeader && type !== "detail" && type !== "show" ? (
        <div className="w-full flex justify-end mb-3">
          <ButtonComponent
            type={"submit"}
            onClick={handleCreateClick}
            icon={<SVGIcon name="IconButtonCreate" width={20} />}
          >
            Create
          </ButtonComponent>
        </div>
      ) : null}

      {children}

      <div className="w-full">
        <TableRBI
          type="FE"
          useInfiniteScroll
          dataSource={listDataABI}
          totalData={listDataABI.length}
          current={page}
          pageSize={pageSize}
          tableScrolled={{
            x: 3000,
            y: 300,
          }}
          onChange={handleChange}
          columns={filterColumns(
            columnsTableABI(
              page,
              pageSize,
              searchInput,
              searchedColumn,
              searchText,
              dataDetailType,
              handleSearch,
              handleUpdate,
              handleDelete,
              onFilter,
              sorter,
              handleDetail,
              showAction
            )
          )}
        />
      </div>

      {/* Modal Value*/}
      <ModalCustom
        isOpen={openModal}
        type="confirmation"
        header="ADJUSTMENT BILLING ITEM DETAIL"
        width={1000}
        handleOk={handleAdd}
        handleCancel={handleCancelModal}
        footer={
          <div className={"w-full flex justify-end gap-5"}>
            <Form.Item>
              <ButtonComponent type="default" onClick={handleCancelModal}>
                Cancel
              </ButtonComponent>
            </Form.Item>
            <Form.Item>
              <ButtonComponent
                type="submit"
                htmlType={"submit"}
                form={"formDetail"}
              >
                Save
              </ButtonComponent>
            </Form.Item>
          </div>
        }
      >
        <Form
          id={"formDetail"}
          layout="vertical"
          form={formDetail}
          onFinish={handleAdd}
        >
          <div className="w-full grid grid-cols-4 gap-4">
            <Form.Item
              label="Item"
              name="item"
              rules={[
                {
                  required: true,
                  message: "Please input your Item!",
                },
              ]}
            >
              <SelectComponent onChange={onChangeItem}>
                {dataListItem?.data &&
                  filterBillingItem()?.map((data, index) => (
                    <Select.Option key={index} value={data.billingItem}>
                      {data.billingItem}
                    </Select.Option>
                  ))}
              </SelectComponent>
            </Form.Item>

            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[
                {
                  required: true,
                  message: "Please input your Quantity!",
                },
              ]}
            >
              <InputNumber
                type="number"
                controls={false}
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>

            <Form.Item
              label={"Price"}
              name={"price"}
              rules={[
                {
                  required: true,
                  message: "Please input your Price!",
                },
              ]}
              getValueFromEvent={(e) => {
                return e.floatValue;
              }}
            >
              <InputComponent
                decimalScale={2}
                thousandSeparator={","}
                decimalSeparator={"."}
                type="numeric"
                fixedDecimalScale={true}
              />
            </Form.Item>

            <Form.Item label="UOM" name="uom">
              <InputComponent disabled={true} />
            </Form.Item>

            <Form.Item label="Currency" name="currency">
              <InputComponent disabled={true} />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[
                {
                  required: true,
                  message: "Please input your Type!",
                },
              ]}
            >
              <SelectComponent onChange={onChangeType}>
                {dataDetailType &&
                  dataDetailType?.map((data, index) => (
                    <Select.Option key={index} value={data.id}>
                      {data.name}
                    </Select.Option>
                  ))}
              </SelectComponent>
            </Form.Item>

            <Form.Item
              label={"Original Amount"}
              name={"amount"}
              getValueFromEvent={(e) => {
                return e.floatValue;
              }}
            >
              <InputComponent
                decimalScale={2}
                thousandSeparator={","}
                decimalSeparator={"."}
                type="numeric"
                disabled={true}
                fixedDecimalScale={true}
              />
            </Form.Item>

            <Form.Item
              label={"Adjustment"}
              name={"adjustmentAmount"}
              rules={[
                {
                  required: true,
                  message: "Please input your Adjustment!",
                },
              ]}
              getValueFromEvent={onChangeAdjustmentAmount}
            >
              <InputComponent
                decimalScale={2}
                thousandSeparator={","}
                decimalSeparator={"."}
                type="numeric"
                onChange={onChangeAdjustmentAmount}
              />
            </Form.Item>

            <Form.Item
              label={"Total Amount"}
              name={"totalAmount"}
              getValueFromEvent={(e) => {
                return e.floatValue;
              }}
            >
              <InputComponent
                decimalScale={2}
                thousandSeparator={","}
                decimalSeparator={"."}
                type="numeric"
                disabled={true}
                fixedDecimalScale={true}
                allowNegative={true}
              />
            </Form.Item>

            <Form.Item
              label={"Total Amount EQV IDR"}
              name={"totalAmountEqvIdr"}
              getValueFromEvent={(e) => {
                return e.floatValue;
              }}
            >
              <InputComponent
                decimalScale={2}
                thousandSeparator={","}
                decimalSeparator={"."}
                type="numeric"
                disabled={true}
                fixedDecimalScale={true}
                allowNegative={true}
              />
            </Form.Item>

            <Form.Item
              label={"Total Amount EQV USD"}
              name={"totalAmountEqvUsd"}
              getValueFromEvent={(e) => {
                return e.floatValue;
              }}
            >
              <InputComponent
                decimalScale={2}
                thousandSeparator={","}
                decimalSeparator={"."}
                type="numeric"
                disabled={true}
                fixedDecimalScale={true}
                allowNegative={true}
              />
            </Form.Item>

            <Form.Item></Form.Item>

            <div className="col-span-4">
              <Form.Item name={"remark"} className="w-full" label={"Remark"}>
                <InputComponent
                  type="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </ModalCustom>

      {/* Modal Validation */}
      <ModalError
        isOpen={modalValidation}
        handleOk={() => setModalValidation(false)}
        handleCancel={() => setModalValidation(false)}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{`You can't create Adjustment Billing Item. Please fill out the Invoice Number.`}</p>
        </div>
      </ModalError>

      {/* Modal History Log */}
      <ModalCustom
        isOpen={modalHistory}
        handleCancel={closeModalHistory}
        type="detail"
        header="DETAIL INFORMATION"
        width={900}
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
    </div>
  );
};

export default AdjustmentBISectionForm;
