import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Select } from "antd";
import moment from "moment";
import SVGIcon from "../../../../../../assets/Icon/index";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { columnsCondition } from "../Table/TableCondition";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import {
  dateFormatting,
  requiredMessage,
  hasValue,
} from "../../../../../../utils";
import SelectComponent from "../../../../../../components/SelectComponent";
import InputComponent from "../../../../../../components/InputComponent";
import DateComponent from "../../../../../../components/DateComponent";
import {
  getConditionName,
  getConditionOperator,
  getConditionType,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/taxCode";
import { showModalError } from "../../../../../../redux/slices/general_slice";
import CardComponent from "../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../components/DetailText";

const ConditionForm = ({
  type,
  data,
  updateData = () => {},
  status,
  statusApproval,
  showAction,
  validStartDate,
  validEndDate,
}) => {
  // Selector
  const { data_condition_name, data_condition_operator, data_condition_type } =
    useSelector((state) => state.tax_code);

  // Declaration
  const [form] = Form.useForm();
  const searchInput = useRef(null);
  const dispatch = useDispatch();

  // Use State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const [startDate, setStartDate] = useState();
  const [descriptionDetail, setDescriptionDetail] = useState("");
  const [dataUpdate, setDataUpdate] = useState({});
  const [dataHistory, setDataHistory] = useState({});
  const [keyTable, setKeyTable] = useState();
  const [typeModal, setTypeModal] = useState("");
  const [modalForm, setModalForm] = useState(false);
  const [modalHistory, setModalHistory] = useState(false);
  const [dataStartDate, setDataStartDate] = useState();

  // Use Effect
  useEffect(() => {
    if (typeModal === "update") {
      form.setFieldsValue({
        name: dataUpdate.name,
        operator: dataUpdate.operator,
        dataType: dataUpdate.dataType,
        value: dataUpdate.value,
        startDate: dataUpdate.startDate,
        endDate: dataUpdate.endDate,
        description: dataUpdate.description,
      });
    }
  }, [typeModal, form]);

  useEffect(() => {
    dispatch(getConditionName());
    dispatch(getConditionOperator());
    dispatch(getConditionType());
  }, [dispatch]);

  useEffect(() => {
    if (startDate === undefined || startDate === null) {
      form.resetFields(["endDate"]);
    }
  }, [form, startDate]);

  const handleStartDate = (value) => {
    setStartDate(value || undefined);
    return value;
  };

  const handleDisableEndDate = (current) => {
    if (startDate !== null) {
      return moment(startDate) > current;
    }
    return moment().add(-1, "days") >= current;
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const filterColumns = (data = []) => {
    return type === "detail" || type === "preview"
      ? data.filter((item) => item.title !== "ACTION")
      : data;
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

  const onFilter = (dataIndex, value, record) => {
    const fixSearchText = value.toLowerCase();
    switch (dataIndex) {
      case "value":
        const tempValue = record[dataIndex]
          ? (record[dataIndex] + "").split(".")
          : [];
        const thousandSeparator = ",";
        const format =
          tempValue.length > 0
            ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
            : "";
        return format.toLowerCase().includes(fixSearchText);

      case "startDate":
      case "endDate":
        const date = record[dataIndex]
          ? moment(record[dataIndex]).format("DD MMM YYYY")
          : "";
        return date.toLowerCase().includes(fixSearchText);

      default:
        return record[dataIndex]?.toLowerCase().includes(fixSearchText);
    }
  };

  const sorter = (fieldSort, a, b) => {
    const handleDataSort = (obj) => {
      switch (fieldSort) {
        case "value":
          const tempValue = obj[fieldSort]
            ? (obj[fieldSort] + "").split(".")
            : [];
          const thousandSeparator = ",";
          const format =
            tempValue.length > 0
              ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
              : "";
          return format.toLowerCase();

        case "startDate":
        case "endDate":
          const date = obj[fieldSort]
            ? moment(obj[fieldSort]).format("DD MMM YYYY")
            : "";
          return date.toLowerCase();

        default:
          return obj[fieldSort]?.toLowerCase();
      }
    };
    let fa = handleDataSort(a);
    let fb = handleDataSort(b);
    return fa.localeCompare(fb);
  };

  const handleCreate = () => {
    setModalForm(true);
    setTypeModal("create");
    setDataUpdate([]);
  };

  const handleCancelModalForm = useCallback(() => {
    setModalForm(false);
    form.resetFields();
    setStartDate();
    setTypeModal("");
    setDataUpdate({});
  }, [form]);

  const listData = useCallback(
    (value) => {
      if (typeModal === "create") {
        updateData((prevState) => {
          const key = prevState.reduce((current, next) => {
            const nextKey = next.key || 0;
            return current > nextKey
              ? parseInt(current) + 1
              : parseInt(nextKey) + 1;
          }, 1);

          const res = {
            ...value,
            name: value.name,
            operator: value.operator,
            dateType: value.dateType,
            value: value.value,
            startDate: moment(value.startDate).format("YYYY-MM-DD"),
            endDate: value.endDate
              ? moment(value.endDate).format("YYYY-MM-DD")
              : null,
            description: value.description || null,
            key,
            type: "new",
          };

          setModalForm(false);
          form.resetFields();
          setTypeModal("");
          return [...prevState, res];
        });
      } else {
        updateData((prevState) => {
          const index = prevState.findIndex(
            (detail) => detail.key === dataUpdate.key
          );

          let temp = [...prevState];

          temp[index] = {
            ...temp[index],
            name: value.name,
            operator: value.operator,
            dateType: value.dateType,
            value: value.value,
            startDate: moment(value.startDate).format("YYYY-MM-DD"),
            endDate: value.endDate
              ? moment(value.endDate).format("YYYY-MM-DD")
              : null,
            description: value.description || null,
            key: dataUpdate.key,
            type: dataUpdate.type,
          };
          return temp;
        });
      }
      handleCancelModalForm();
    },
    [
      dataUpdate.key,
      dataUpdate.type,
      form,
      handleCancelModalForm,
      typeModal,
      updateData,
    ]
  );

  const setRow = useCallback(
    (values, dataTable) => {
      let newRow = {};
      if (typeModal === "update") {
        newRow = {
          ...values,
          key: dataUpdate?.key,
        };
      } else {
        newRow = {
          ...values,
          key: dataTable?.length + 1,
        };
      }

      return newRow;
    },
    [dataUpdate, typeModal]
  );

  // check has overlapping data
  const checkOverlappingData = useCallback((formHeader, dataTable) => {
    const dataOverlap = [];
    dataTable?.forEach((item) => {
      if (
        moment(item?.startDate) < moment(formHeader?.startDate) ||
        (hasValue(formHeader?.endDate) && moment(item?.endDate) > moment(formHeader?.endDate))
      ) {
        dataOverlap?.push(item);
      }
    });

    if (dataOverlap?.length > 0) {
      return true;
    } else {
      return false;
    }
    // }
  }, []);

  const handleFinish = useCallback(
    (value) => {
      const setDataRow = setRow(value, data);

      const isNameChosen = data.some(
        (item) =>
          item.name === setDataRow.name &&
          item.operator === setDataRow.operator &&
          item?.key !== setDataRow?.key
      );

      if (isNameChosen) {
        const errorBody = {
          title: "Failed",
          description: `Name "${value.name}" with the same operator is already chosen. Please select a different name or a different operator.`,
        };
        dispatch(showModalError(errorBody));
        return;
      } else {
        // set update data table
        if (typeModal === "create") {
          updateData((prevState) => [...prevState, setDataRow]);
        } else {
          const tempData = [...data];
          const index = tempData.findIndex(
            (item) => item?.key === setDataRow?.key
          );
          if (index > -1) {
            const item = tempData[index];
            const updatedRow = { ...item, ...setDataRow };
            tempData.splice(index, 1, updatedRow);

            updateData(tempData);
          }
        }
        form.resetFields();
        setTypeModal("");
        setModalForm(false);
      }
    },
    [setRow, data, dispatch, typeModal, form, updateData]
  );

  const handleDelete = useCallback(
    (r) => {
      updateData((prevState) => prevState.filter((e) => e.key !== r.key));
    },
    [updateData]
  );

  const handleUpdate = (r) => {
    setDataUpdate({
      ...r,
      startDate: moment(r.startDate),
      endDate: r.endDate ? moment(r.endDate) : null,
    });
    setKeyTable(r?.key);
    setTypeModal("update");
    setModalForm(true);
    setStartDate(r.startDate);
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

  const handleDisableDateBetween = (current) => {
    if (!current) return false;

    const headerStartDate = validStartDate ? moment(validStartDate).startOf("day") : null;
    const headerEndDate = validEndDate ? moment(validEndDate).endOf("day") : null;

    // Disable if before local start date (from state)
    if (hasValue(startDate)) {
      if (current.isBefore(moment(startDate).startOf("day"))) {
        return true;
      }
    }

    // Disable if outside header range
    if (headerStartDate && current.isBefore(headerStartDate)) {
      return true;
    }
    if (headerEndDate && current.isAfter(headerEndDate)) {
      return true;
    }

    return false;
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

  // Validation Handle Start Date from Header Data
  const handleDisableDateBefore = (current) => {
    if (!current) return false;
    const headerStartDate = validStartDate ? moment(validStartDate).startOf("day") : null;

    if (headerStartDate) {
      return current.isBefore(headerStartDate);
    }
    return current.isBefore(moment().startOf("day"));
  };

  return (
    <div className="flex flex-col w-full gap-3">
      {type !== "detail" && type !== "preview" && type !== "show" ? (
        <div className="w-full flex justify-end">
          <ButtonComponent
            type={"submit"}
            onClick={handleCreate}
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
          >
            Create
          </ButtonComponent>
        </div>
      ) : null}

      <TablePaginationNew
        type="FE"
        dataSource={data}
        totalData={data?.length || 0}
        current={page}
        pageSize={pageSize}
        onChange={handleChange}
        columns={filterColumns(
          columnsCondition(
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            handleDelete,
            handleUpdate,
            onFilter,
            sorter,
            status,
            statusApproval,
            handleDetail,
            showAction,
            data_condition_name,
            data_condition_operator,
            data_condition_type
          )
        )}
        tableScrolled={{
          x: 1500,
          y: 300,
        }}
      />

      <ModalCustom
        isOpen={modalForm}
        header={"TAX CODE CONDITION"}
        handleCancel={handleCancelModalForm}
        width={1200}
        type={"confirmation"}
        footer={
          <div className="w-full flex justify-end gap-5 p-4">
            <ButtonComponent onClick={handleCancelModalForm} type="default">
              Cancel
            </ButtonComponent>
            <ButtonComponent
              form="conditionForm"
              type="submit"
              htmlType="submit"
            >
              Save
            </ButtonComponent>
          </div>
        }
      >
        <Form
          form={form}
          onFinish={handleFinish}
          layout="vertical"
          id="conditionForm"
        >
          <div className="w-full grid grid-cols-4 gap-4">
            <Form.Item
              label={"Name"}
              name={"name"}
              rules={[{ message: requiredMessage("Name"), required: true }]}
            >
              <SelectComponent>
                {data_condition_name.map((val) => (
                  <Select.Option key={val.id} value={val.code}>
                    {val.text}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>

            <Form.Item
              name={"operator"}
              label={"Operator"}
              rules={[{ message: requiredMessage("operator"), required: true }]}
            >
              <SelectComponent>
                {data_condition_operator.map((val) => (
                  <Select.Option key={val.id} value={val.code}>
                    {val.text}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>

            <Form.Item
              label={"Data Type"}
              name={"dataType"}
              rules={[{ message: requiredMessage("dataType"), required: true }]}
            >
              <SelectComponent>
                {data_condition_type.map((val) => (
                  <Select.Option key={val.id} value={val.code}>
                    {val.text}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>

            <Form.Item
              name={"value"}
              label={"Value"}
              rules={[{ message: requiredMessage("Value"), required: true }]}
              getValueFromEvent={(e) => {
                return e.floatValue;
              }}
            >
              <InputComponent
                decimalScale={2}
                thousandSeparator={","}
                decimalSeparator={"."}
                type="numeric"
              />
            </Form.Item>
          </div>

          <div className="w-full grid grid-cols-2 gap-4">
            <Form.Item
              label={"Start Date"}
              name={"startDate"}
              rules={[
                {
                  message: requiredMessage("Start Date"),
                  required: true,
                },
              ]}
              getValueFromEvent={handleStartDate}
            >
              <DateComponent
                dateDisable={
                  validEndDate === null || validEndDate === undefined
                    ? handleDisableDateBefore
                    : handleDisableDateBetween
                }
                disabled={validStartDate === null}
              />
            </Form.Item>

            <Form.Item
              name={"endDate"}
              rules={[
                {
                  validator: (_, value) =>
                    endDateValidator(startDate)(_, value),
                },
              ]}
              label="End Date"
            >
              <DateComponent
                dateDisable={
                  validEndDate === null || validEndDate === undefined
                    ? handleDisableDateBefore
                    : handleDisableDateBetween
                }
                disabled={startDate === null || startDate === undefined}
              />
            </Form.Item>
          </div>

          <Form.Item label={"Description"} name={"description"}>
            <InputComponent
              type="textarea"
              value={descriptionDetail}
              onChange={(e) => setDescriptionDetail(e.target.value)}
            />
          </Form.Item>
        </Form>
      </ModalCustom>

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

export default ConditionForm;
