import React, { useState, useRef, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Select, Form, InputNumber } from "antd";
import moment from "moment";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import SelectComponent from "../../../../../../components/SelectComponent";
import DateComponent from "../../../../../../components/DateComponent";
import InputComponent from "../../../../../../components/InputComponent";
import {
  getListBillingItem,
  getListCurrency,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/billingBucket";
import {
  dateFormatting,
  hasValue,
  requiredMessage,
} from "../../../../../../utils";
import { columnsDetail } from "../Table/TableDetail";
import { showModalError } from "../../../../../../redux/slices/general_slice";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import DetailText from "../../../../../../components/DetailText";
import CardComponent from "../../../../../../components/Card/CardComponent";

const BillingBucketDetailSectionForm = ({
  listDataBI = [],
  setListDataBI,
  type,
  priority,
  setPriority,
  dataStartDate,
  status,
  statusApproval,
  showAction,
  validStartDate,
  validEndDate,
}) => {
  // Selector
  const { data_billing_item, data_currency } = useSelector(
    (state) => state.billing_bucket,
  );

  // Declaration
  const searchInput = useRef(null);
  const [formDetail] = Form.useForm();
  const dispatch = useDispatch();

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});

  const [startDate, setStartDate] = useState();
  const [description, setDescription] = useState("");
  const [dataUpdate, setDataUpdate] = useState({});
  const [dataHistory, setDataHistory] = useState({});
  const [keyTable, setKeyTable] = useState();
  const [typeModal, setTypeModal] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalHistory, setModalHistory] = useState(false);
  const [startDateHeader, setStartDateHeader] = useState(null);

  useEffect(() => {
    if (typeModal === "update") {
      formDetail.setFieldsValue({
        billingItem: dataUpdate.billingItem,
        currency: dataUpdate.currency,
        sequence: dataUpdate.sequence,
        startDate: dataUpdate.startDate,
        endDate: dataUpdate.endDate,
        description: dataUpdate.description,
        priority: dataUpdate.priority,
      });
    }
  }, [typeModal, formDetail]);

  useEffect(() => {
    dispatch(getListBillingItem());
    dispatch(getListCurrency());
  }, [dispatch]);

  console.log(validEndDate, validStartDate, startDate);

  const handleStartDate = (value) => {
    setStartDate(value);
    return value;
  };

  const handleDisableEndDate = (current) => {
    if (startDate !== null) {
      return moment(startDate) > current;
    }
    return moment().add(-1, "days") >= current;
  };

  const handleDisableDateBefore = (current) => {
    if (hasValue(startDate) && hasValue(validEndDate)) {
      return (
        moment(startDate) > current ||
        current > moment(validEndDate).add(1, "days")
      );
    } else if (hasValue(validStartDate) && hasValue(validEndDate) === false) {
      return moment(validStartDate) > current;
    } else if (hasValue(validStartDate) && hasValue(validEndDate)) {
      const startDate = moment(validStartDate).startOf("day");
      const endDate = moment(validEndDate).endOf("day");
      return current.isBefore(startDate) || current.isAfter(endDate);
    } else {
      return true;
    }
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

  const onFilter = (dataIndex, value, record) => {
    const fixSearchText = value.toLowerCase();
    switch (dataIndex) {
      case "billingItem":
        const tempBillingItem = record[dataIndex] || 0;
        const typeName = data_billing_item
          ?.filter((item) => item?.value === tempBillingItem)
          .map((name) => name?.name)
          .shift();
        return (typeName || "").toLowerCase().includes(fixSearchText);

      case "currency":
        const tempCurrency = record[dataIndex] || 0;
        const typeCurrency = data_currency
          ?.filter((item) => item?.id === tempCurrency)
          .map((name) => name?.text)
          .shift();
        return (typeCurrency || "").toLowerCase().includes(fixSearchText);

      case "sequence":
        const tempSequence = record[dataIndex] || 0;
        return tempSequence.toString().toLowerCase().includes(fixSearchText);

      case "startDate":
      case "endDate":
        const date = record[dataIndex]
          ? moment(record[dataIndex]).format("DD MMM YYYY")
          : "";
        return date.toLowerCase().includes(fixSearchText);

      case "priority":
        const tempPriority = record[dataIndex] === true ? "Yes" : "No";
        return tempPriority.toLowerCase().includes(fixSearchText);

      default:
        return record[dataIndex]?.toLowerCase().includes(fixSearchText);
    }
  };

  const sorter = (fieldSort, a, b) => {
    const handleDataSort = (obj) => {
      switch (fieldSort) {
        case "billingItem":
          const valueBillingItem = obj[fieldSort];
          const typeName = data_billing_item
            ?.filter((item) => item?.value === valueBillingItem)
            .map((name) => name?.name)
            .shift();
          const tempSort = obj[fieldSort] ? typeName : "";
          return tempSort.toLowerCase();

        case "currency":
          const valueCurrency = obj[fieldSort];
          const typeCurrency = data_currency
            ?.filter((item) => item?.id === valueCurrency)
            .map((name) => name?.text)
            .shift();
          const tempCurrency = obj[fieldSort] ? typeCurrency : "";
          return tempCurrency?.toLowerCase();

        case "sequence":
          const tempSequence = obj[fieldSort] || 0;
          return tempSequence.toString().toLowerCase();

        case "startDate":
        case "endDate":
          return obj[fieldSort] ? moment(obj[fieldSort]) : "";
        // return date.toLowerCase();

        case "priority":
          const tempPriority = obj[fieldSort] === true ? "Yes" : "No";
          return tempPriority.toLowerCase();
        default:
          return obj[fieldSort]?.toLowerCase();
      }
    };
    let fa = handleDataSort(a);
    let fb = handleDataSort(b);

    const handleCompare = (a, b) => {
      switch (fieldSort) {
        case "startDate":
        case "endDate":
          if (a && b) {
            if (a.isBefore(b)) return -1;
            if (a.isAfter(b)) return 1;
            return 0;
          }
          return 0; // Handle null cases if necessary

        case "sequence":
          return Math.sign(a - b);
        default:
          return a.localeCompare(b);
      }
    };

    return handleCompare(fa, fb);
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleCancelModal = useCallback(() => {
    setOpenModal(false);
    formDetail.resetFields();
    setStartDate();
    setTypeModal("");
    setDataUpdate({});
  }, [formDetail]);

  // Delete Row
  const handleDelete = useCallback(
    (r) => {
      setListDataBI((prevState) => prevState.filter((e) => e.key !== r.key));
    },
    [listDataBI],
  );

  const handleAdd = useCallback(
    (value) => {
      // Check if billingItem, currency, and sequence are unchanged, proceed without validation
      if (
        typeModal === "update" &&
        dataUpdate.billingItem === value.billingItem &&
        dataUpdate.currency === value.currency &&
        dataUpdate.sequence === value.sequence
      ) {
        updateListData(value);
        return;
      }

      // Check if only the sequence is updated
      if (
        typeModal === "update" &&
        dataUpdate.billingItem === value.billingItem &&
        dataUpdate.currency === value.currency &&
        dataUpdate.sequence !== value.sequence
      ) {
        const isDuplicateSequence = listDataBI.some(
          (item) => item.sequence === value.sequence,
        );

        if (isDuplicateSequence) {
          const errorBody = {
            title: "Failed",
            description: `Duplicate sequence value found. Please enter a unique sequence.`,
          };
          dispatch(showModalError(errorBody));
          return;
        }

        updateListData(value);
        return;
      }

      // Check if only the billingItem is updated
      if (
        typeModal === "update" &&
        dataUpdate.billingItem !== value.billingItem &&
        dataUpdate.currency === value.currency &&
        dataUpdate.sequence === value.sequence
      ) {
        const isBillingItemChosen = listDataBI.some(
          (item) =>
            item.billingItem === value.billingItem &&
            item.currency === value.currency,
        );

        if (isBillingItemChosen) {
          const errorBody = {
            title: "Failed",
            description: `Billing Item "${
              data_billing_item
                ?.filter((a) => a.value === value.billingItem)
                ?.find((v) => v.name)?.name
            }" with the same currency is already chosen. Please select a different billing item or a different currency.`,
          };
          dispatch(showModalError(errorBody));
          return;
        }

        updateListData(value);
        return;
      }

      // Check if only the currency is updated
      if (
        typeModal === "update" &&
        dataUpdate.billingItem === value.billingItem &&
        dataUpdate.currency !== value.currency &&
        dataUpdate.sequence === value.sequence
      ) {
        const isBillingItemChosen = listDataBI.some(
          (item) =>
            item.billingItem === value.billingItem &&
            item.currency === value.currency,
        );

        if (isBillingItemChosen) {
          const errorBody = {
            title: "Failed",
            description: `Billing Item "${
              data_billing_item
                ?.filter((a) => a.value === value.billingItem)
                ?.find((v) => v.name)?.name
            }" with the same currency is already chosen. Please select a different billing item or a different currency.`,
          };
          dispatch(showModalError(errorBody));
          return;
        }

        updateListData(value);
        return;
      }

      // Check for duplicate sequence values if all fields are changed
      const isDuplicateSequence = listDataBI.some(
        (item) => item.sequence === value.sequence,
      );

      if (isDuplicateSequence) {
        const errorBody = {
          title: "Failed",
          description: `Duplicate sequence value found. Please enter a unique sequence.`,
        };
        dispatch(showModalError(errorBody));
        return;
      }

      // Check if billingItem is already chosen with the same currency
      const isBillingItemChosen = listDataBI.some(
        (item) =>
          item.billingItem === value.billingItem &&
          item.currency === value.currency,
      );

      if (isBillingItemChosen) {
        const errorBody = {
          title: "Failed",
          description: `Billing Item "${
            data_billing_item
              ?.filter((a) => a.value === value.billingItem)
              ?.find((v) => v.name)?.name
          }" with the same currency is already chosen. Please select a different billing item or a different currency.`,
        };
        dispatch(showModalError(errorBody));
        return;
      }

      // Proceed with updating or adding data
      updateListData(value);
    },
    [
      dispatch,
      typeModal,
      dataUpdate,
      listDataBI,
      data_billing_item,
      priority,
      setOpenModal,
      setTypeModal,
      showModalError,
      formDetail,
    ],
  );

  const updateListData = (value) => {
    if (typeModal === "create") {
      setListDataBI((prevState) => {
        const key = prevState.reduce((current, next) => {
          const nextKey = next.key || 0;
          return current > nextKey
            ? parseInt(current) + 1
            : parseInt(nextKey) + 1;
        }, 1);

        const res = {
          ...value,
          billingItem: value.billingItem,
          currency: value.currency,
          sequence: value.sequence,
          startDate: moment(value.startDate).format("YYYY-MM-DD"),
          endDate: value.endDate
            ? moment(value.endDate).format("YYYY-MM-DD")
            : null,
          description: value.description || null,
          priority: priority ? priority : false,
          key,
          type: "new",
        };

        setOpenModal(false);
        formDetail.resetFields();
        setTypeModal("");
        return [...prevState, res];
      });
    } else {
      setListDataBI((prevState) => {
        const index = prevState.findIndex(
          (detail) => detail.key === dataUpdate.key,
        );

        let temp = [...prevState];

        temp[index] = {
          ...temp[index],
          billingItem: value.billingItem,
          currency: value.currency,
          sequence: value.sequence,
          startDate: moment(value.startDate).format("YYYY-MM-DD"),
          endDate: value.endDate
            ? moment(value.endDate).format("YYYY-MM-DD")
            : null,
          description: value.description || null,
          priority: priority ? priority : false,
          key: dataUpdate.key,
          type: dataUpdate.type,
        };
        return temp;
      });
    }
    handleCancelModal();
  };

  const handleUpdate = (r) => {
    setDataUpdate({
      ...r,
      startDate: moment(r.startDate),
      endDate: r.endDate ? moment(r.endDate) : null,
    });
    setKeyTable(r?.key);
    setTypeModal("update");
    setOpenModal(true);
    setStartDate(r.startDate);
    setPriority(r.priority);
  };

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

  const filterColumns = (data = []) => {
    return type === "detail"
      ? data.filter((item) => item.title !== "ACTION")
      : data;
  };

  return (
    <div>
      {type !== "detail" && type !== "show" ? (
        <div className="w-full flex justify-end mb-[30px]">
          <ButtonComponent
            type={"submit"}
            onClick={() => {
              if (hasValue(validStartDate)) {
                setOpenModal(true);
                setTypeModal("create");
                setDataUpdate([]);
              } else {
                const error = {
                  title: "Failed",
                  description:
                    "Can't add detail data. Please select a start date.",
                };
                dispatch(showModalError(error));
              }
            }}
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
          >
            Create
          </ButtonComponent>
        </div>
      ) : null}

      <div className="w-full">
        <TablePaginationNew
          type="FE"
          dataSource={listDataBI}
          totalData={listDataBI.length}
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
              data_currency,
              data_billing_item,
              handleSearch,
              handleUpdate,
              handleDelete,
              onFilter,
              sorter,
              status,
              statusApproval,
              handleDetail,
              showAction,
            ),
          )}
          tableScrolled={{
            x: 2000,
            y: 300,
          }}
        />
      </div>

      {/* Modal Value */}
      <ModalCustom
        isOpen={openModal}
        type="confirmation"
        header="BILLING BUCKET DETAIL INFORMATION"
        width={1000}
        handleCancel={handleCancelModal}
        footer={
          <div className={"w-full flex justify-end gap-5"}>
            <ButtonComponent onClick={handleCancelModal} type="default">
              Cancel
            </ButtonComponent>
            <Form.Item>
              <ButtonComponent
                type={"submit"}
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
          layout="vertical"
          form={formDetail}
          onFinish={handleAdd}
          id={"formDetail"}
        >
          <div className="w-full grid grid-cols-3 gap-4">
            <Form.Item
              label="Billing Item"
              name="billingItem"
              rules={[
                {
                  required: true,
                  message: "Please input your Billing Item!",
                },
              ]}
            >
              <SelectComponent>
                {data_billing_item?.map((billingItem) => (
                  <Select.Option
                    key={billingItem.value}
                    value={billingItem.value}
                  >
                    {billingItem.name}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>

            <Form.Item
              label="Currency"
              name="currency"
              rules={[
                {
                  required: true,
                  message: "Please input your Currency!",
                },
              ]}
            >
              <SelectComponent>
                {data_currency?.map((currency) => (
                  <Select.Option key={currency.id} value={currency.id}>
                    {currency.text}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>
            <Form.Item
              label="Sequence"
              name="sequence"
              rules={[
                {
                  required: true,
                  message: "Please input your Currency!",
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
              name={"startDate"}
              rules={[
                {
                  message: requiredMessage("Please input your Start Date"),
                  required: true,
                },
              ]}
              getValueFromEvent={handleStartDate}
              label={"Start Date"}
              required
            >
              <DateComponent dateDisable={handleDisableDateBefore} />
            </Form.Item>

            <Form.Item
              name={"endDate"}
              rules={[
                {
                  validator: (_, value) =>
                    (value &&
                      moment(startDate || dataStartDate) <= moment(value)) ||
                    !value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("End date must before Start date"),
                        ),
                },
              ]}
              label="End Date"
            >
              <DateComponent
                dateDisable={handleDisableDateBefore}
                disabled={startDate === null}
              />
            </Form.Item>

            <div className="col-span-3">
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

            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item
                name={"priority"}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    onChange={(r) => setPriority(r.target.checked)}
                    checked={priority ? true : false}
                  />
                  <span style={{ marginLeft: "8px" }}>Priority</span>
                </div>
                <Form.Item shouldUpdate>
                  {() => (
                    <span
                      style={{
                        color: "gray",
                        fontSize: "11px",
                        marginLeft: "0px",
                      }}
                    >
                      Click or tap this checkbox if this item needs to be
                      prioritized
                    </span>
                  )}
                </Form.Item>
              </Form.Item>
            </div>
          </div>
        </Form>
      </ModalCustom>

      {/* Modal History Log */}
      <ModalCustom
        isOpen={modalHistory}
        handleCancel={closeModalHistory}
        type="detail"
        header="DETAIL INFORMATION"
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
    </div>
  );
};

export default BillingBucketDetailSectionForm;
