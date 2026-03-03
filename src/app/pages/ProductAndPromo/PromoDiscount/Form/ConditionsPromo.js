import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Select } from "antd";
import moment from "moment";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import NxTable from "../../../../../components/Nx/NxTable";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import SelectComponent from "../../../../../components/SelectComponent";
import InputComponent from "../../../../../components/InputComponent";
import DateComponent from "../../../../../components/DateComponent";
import { showModalError } from "../../../../../redux/slices/general_slice";
import { dateFormatting, requiredMessage } from "../../../../../utils";
import { tableConditionPromo } from "../Table/TableConditionPromo";
import CardComponent from "../../../../../components/Card/CardComponent";
import DetailText from "../../../../../components/DetailText";
import { separatorCurrency } from "../../UtilsProduct/UtilsAllProduct";

const ConditionPromo = ({
  type,
  header,
  data,
  updateData = () => {},
  status,
  statusApproval,
  selector = "product",
  getApi = {},
  columnsTable = tableConditionPromo,
  setStoredData = () => {},
  storedData,
}) => {
  // Selector
  const { data_condition_name, data_condition_operator, data_condition_type } =
    useSelector((state) => state[selector]);

  // Declaration
  const [form] = Form.useForm();
  const searchInput = useRef(null);
  const dispatch = useDispatch();

  // Use State
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState("");

  const [startDate, setStartDate] = useState();
  const [descriptionDetail, setDescriptionDetail] = useState("");
  const [dataUpdate, setDataUpdate] = useState({});
  const [keyTable, setKeyTable] = useState();
  const [typeModal, setTypeModal] = useState("");
  const [modalForm, setModalForm] = useState(false);

  const [modalHistory, setModalHistory] = useState(false);
  const [dataHistory, setDataHistory] = useState(false);
  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["action"],
    left: [],
  }));

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
    if (type !== "detail" && type !== "preview") {
      dispatch(getApi?.getConditionName());
      dispatch(getApi?.getConditionOperator());
      dispatch(getApi?.getConditionType());
    }
  }, [dispatch]);

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

  const filterColumns = (data = []) => {
    return type === "preview"
      ? data.filter((item) => item.title !== "ACTION")
      : data;
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      // if (prevState[dataIndex] !== selectedKeys[0]) {
      //   setPage(1);
      // }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
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
        return record[dataIndex]
          ? moment(record[dataIndex])
          : "";
        // return date.toLowerCase().includes(fixSearchText);

      default:
        return record[dataIndex]?.toLowerCase().includes(fixSearchText);
    }
  };

  const sorter = (fieldSort, a, b) => {
    const handleDataSort = (obj) => {
      switch (fieldSort) {
        case "value":
          return separatorCurrency(obj[fieldSort])?.replace(/,/g, "")
          // return format.toLowerCase();

        case "startDate":
        case "endDate":
          return obj[fieldSort]
            ? moment(obj[fieldSort])
            : "";
          // return date.toLowerCase();

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
        case "value":
          return Math.sign(parseFloat(a) - parseFloat(b))
        default:
          return a.localeCompare(b);
      }
    }
      return handleCompare(fa, fb);
  };

  const handleCreate = () => {
    setModalForm(true);
    setTypeModal("create");
    setDataUpdate([]);
    setStoredData(true);
  };

  const handleCancelModalForm = useCallback(() => {
    setModalForm(false);
    form.resetFields();
    setStartDate();
    setTypeModal("");
    setDataUpdate({});
    setStoredData(false);
  }, [form]);

  const handleDetailHistory = (record) => {
    setModalHistory(true)
    setDataHistory(record)
    
  };

  const handleFinish = useCallback(
    (value) => {
      // If Name has changed, skip sequence validation
      if (typeModal === "update" && dataUpdate.name !== value.name) {
        listData(value);
        return;
      }

      // Check if Name has changed
      if (typeModal === "update" && dataUpdate.name === value.name) {
        // If billingItem, currency, and sequence are not changed, proceed without validation
        listData(value);
        return;
      }

      // Check if Name is already chosen with the same Operator
      const isNameChosen = data.some(
        (item) => item.name === value.name && item.operator === value.operator
      );

      if (isNameChosen) {
        // Handle error if Name with same Operator is already chosen
        const errorBody = {
          title: "Failed",
          description: `Name "${value.name}" with the same operator is already chosen. Please select a different name or a different operator.`,
        };
        dispatch(showModalError(errorBody));
        return; // Stop further execution
      }

      // Proceed with updating or adding data
      listData(value);
      setStoredData(false);
    },
    [
      dispatch,
      typeModal,
      dataUpdate,
      data,
      setModalForm,
      setTypeModal,
      showModalError,
      form,
    ]
  );

  const listData = (value) => {
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
  };

  const handleDelete = useCallback(
    (r) => {
      updateData((prevState) => prevState.filter((e) => e.key !== r.key));
    },
    [data]
  );

  const handleUpdate = (r) => {
    setStoredData(true);
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

  return (
    <div className="flex flex-col w-full gap-3">
      {type !== "detail" && type !== "preview" ? (
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

      <NxTable
        idTable="condition-promo-table"
        dataSource={data || []}
        usePagination={false}
        useInfiniteScroll={false}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        columns={filterColumns(
          columnsTable(
            type,
            1,
            data?.length || 0,
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
            handleDetailHistory,
            search,
            storedData,
          )
        )}
        tableScrolled={{ x: 1500, y: 300 }}
      />

      <ModalCustom
        isOpen={modalForm}
        header={`${header} CONDITION`}
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
                {(data_condition_name || [])?.map((val) => (
                  <Select.Option key={val.id} value={val.text}>
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
                {(data_condition_operator || [])?.map((val) => (
                  <Select.Option key={val.id} value={val.text}>
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
                {(data_condition_type || [])?.map((val) => (
                  <Select.Option key={val.id} value={val.text}>
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
                  message: requiredMessage("Please input your Start Date"),
                  required: true,
                },
              ]}
              getValueFromEvent={handleStartDate}
            >
              <DateComponent onChange={(e) => form.resetFields(["endDate"])} />
            </Form.Item>

            <Form.Item
              name={"endDate"}
              rules={[
                {
                  validator: (_, value) =>
                    (value && moment(startDate) <= moment(value)) || !value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("End date must before Start date")
                        ),
                },
              ]}
              label="End Date"
            >
              <DateComponent
                dateDisable={handleDisableEndDate}
                disabled={startDate === null}
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
    </div>
  );
};

export default ConditionPromo;
