import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip, Checkbox, Form } from "antd";
import { Fragment } from "react";
import moment from "moment";
import Highlighter from "react-highlight-words";
import { useLocation } from "react-router-dom";
import StatusComponent from "../../../../../../components/StatusComponent";
import TablePagination from "../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../assets/Icon/index";
import GasSourceDetail from "./GasSourceDetail";
import {
  dateFormatting,
  formMessageRequired,
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../../utils";
import {
  getColumnSearchProps,
  getColumnSearchPropsUseFilteredValue,
} from "../../../../../../utils/getColumnSearchProps";
import {
  getAllAccountGasSourcePaginate,
  getDetailAccountGasSource,
  InactiveAccountGasSource,
} from "../../../../../../redux/slices/account_management/detailAccount/accountGasSource";
import DateComponent from "../../../../../../components/DateComponent";
import { useColumnActionPermissionAccount } from "../../../ComponentAccount/ColumnActionPermissionAccount";
import InputComponent from "../../../../../../components/InputComponent";
import ModalActivationDynamic from "../../../../../../components/Modal/ModalActivationDynamic";

const columnsDetail = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search,
) => {
  return [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "DOCUMENT NUMBER",
      dataIndex: "documentNumber",
      sorter: true,
      ...getColumnSearchProps(
        "documentNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "START DATE",
      sorter: true,
      align: "center",
      dataIndex: "startDate",
      ...getColumnSearchProps(
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
      ),
      render: (text) =>
        searchedColumn === "startDate" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[
              searchText
                ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
                : "",
            ]}
            autoEscape
            textToHighlight={
              text ? moment(text).format(dateFormatting.date) : ""
            }
          />
        ) : (
          moment(text).format(dateFormatting.date) || ""
        ),
    },
    {
      title: "END DATE",
      sorter: true,
      align: "center",
      dataIndex: "endDate",
      ...getColumnSearchProps(
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
      ),
      render: (text) =>
        searchedColumn === "endDate" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[
              searchText
                ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
                : "",
            ]}
            autoEscape
            textToHighlight={
              text ? moment(text).format(dateFormatting.date) : ""
            }
          />
        ) : hasValue(text) ? (
          moment(text).format(dateFormatting.date)
        ) : (
          ""
        ),
    },
    {
      title: "VALUE (M3/MMBTU)",
      dataIndex: "m3",
      align: "center",
      sorter: true,
      ...getColumnSearchProps(
        "m3",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "VALUE (BTU/SCF (GHV))",
      dataIndex: "btu",
      align: "center",
      sorter: true,
      ...getColumnSearchProps(
        "btu",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "SG",
      dataIndex: "sg",
      align: "center",
      sorter: true,
      ...getColumnSearchProps(
        "sg",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "N2",
      dataIndex: "n2",
      align: "center",
      sorter: true,
      ...getColumnSearchProps(
        "n2",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "CO2",
      dataIndex: "co2",
      align: "center",
      sorter: true,
      ...getColumnSearchProps(
        "co2",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      sorter: true,
      ...getColumnSearchProps(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (status) => (
        <div className={" flex justify-center"}>
          <StatusComponent colour={status}>{status}</StatusComponent>
        </div>
      ),
    },
    {
      title: "DESCRIPTION",
      sorter: true,
      dataIndex: "description",
      ...getColumnSearchProps(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "description" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
  ];
};

const columns = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleDetail = () => {},
  handleActiveOrInactive = () => {},
  handleStartDate = () => {},
) => {
  return [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },

    {
      title: "CALORIE TYPE",
      dataIndex: "calorieType",
      align: "center",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "calorieType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "calorieType",
          hasValue(search["calorieType"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "START DATE",
      sorter: true,
      align: "center",
      dataIndex: "startDate",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
      ),
      render: (text) =>
        renderDateColumn(
          "startDate",
          hasValue(search["startDate"]),
          searchText,
          text,
          "date",
          search,
        ),
    },
    {
      title: "END DATE",
      sorter: true,
      align: "center",
      dataIndex: "endDate",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
      ),
      render: (text) =>
        renderDateColumn(
          "endDate",
          hasValue(search["endDate"]),
          searchText,
          text,
          "date",
          search,
        ),
    },
    {
      title: "REMARK",
      dataIndex: "remark",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "remark",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        renderColumn(
          "remark",
          hasValue(search["remark"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "CALORIE CODE",
      dataIndex: "calorieCode",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "calorieCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) =>
        renderColumn(
          "calorieCode",
          hasValue(search["calorieCode"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "GAS SOURCE NAME",
      dataIndex: "name",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "name",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) =>
        renderColumn(
          "name",
          hasValue(search["name"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      sorter: true,
      title: "GAS SOURCE DESCRIPTION",
      dataIndex: "description",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        renderColumn(
          "description",
          hasValue(search["description"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      fixed: "right",
      width: 140,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) =>
        renderColumn(
          "status",
          hasValue(search["status"]),
          searchText,
          text,
          false,
          "status",
          search,
        ),
    },
  ];
};

const GasSourceTable = ({ type, dataNoApi = [], accessAccount }) => {
  // Selector
  const { data, loading, data_detail } = useSelector(
    (state) => state.accountGasSource,
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const location = useLocation();
  const id = location?.state?.idAccount;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [remark, setRemark] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");

  const [chooseId, setChooseId] = useState();
  const [modalDetail, setModalDetail] = useState(false);
  const [modalActiveOrInactive, setModalActiveOrInactive] = useState(false);
  const [gasSourceRecord, setGasSourceRecord] = useState("");
  const [startDate, setStartDate] = useState();

  const [formActivation] = Form.useForm();
  // Use Effect
  useEffect(() => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(
      getAllAccountGasSourcePaginate({
        id,
        search: reqSearch,
        sort,
        page,
        pageSize,
      }),
    );
  }, [search, sort, page, pageSize, dispatch, id]);

  // Function Search No API
  const handleSearchNoApi = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
  };

  // Function Search API
  // const handleSearchApi = (selectedKeys, confirm, dataIndex) => {
  //   confirm();
  //   setSearchText(selectedKeys[0]);
  //   setSearchedColumn(dataIndex);
  //   setSearch(
  //     selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`
  //   );
  // };
  const handleSearchApi = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
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

  const onSortNoApi = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  const onSortApi = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleDetail = (id) => {
    setModalDetail(true);
    dispatch(getDetailAccountGasSource(id));
  };

  // Handle Confirmation Active/Inactive
  const handleActiveOrInactive = useCallback(
    (record) => {
      setModalActiveOrInactive(true);
      setChooseId(record?.id);
      setGasSourceRecord(record);
      formActivation?.setFieldsValue({
        endDate: hasValue(record?.endDate)
          ? moment(record?.endDate)
          : undefined,
        remark: undefined,
      });
    },
    [formActivation],
  );

  // Handle Confirm Modal Active/Inactive
  const handleConfirmActiveOrInactive = async (formValue, handleClear) => {
    try {
      const data = {
        id: chooseId,
        endDate: moment(formValue.endDate).format(dateFormatting.date),
        remark: formValue.remark,
      };
      await dispatch(InactiveAccountGasSource({ body: data }))?.unwrap();
      await dispatch(
        getAllAccountGasSourcePaginate({
          id,
          search: encodeURIComponent(JSON.stringify(search)),
          sort,
          page,
          pageSize,
        }),
      )?.unwrap();
      setModalActiveOrInactive(false);
      handleClear();
    } catch (error) {
      form.resetFields();
      formActivation?.resetFields();
    }
  };

  const filterDataByPage = () => {
    let result = [...dataNoApi];
    if (searchedColumn) {
      result = result.filter((item) => {
        return item[searchedColumn]
          ?.toString()
          ?.toLowerCase()
          ?.includes(searchText.toLowerCase());
      });
    }
    const handleDataSort = (obj) => {
      switch (fieldSort) {
        case "startDate":
        case "endDate":
          const date = obj[fieldSort]
            ? moment(obj[fieldSort]).format("DD MMM YYYY")
            : "";
          return date.toString().toLowerCase();
        default:
          return obj[fieldSort]?.toString().toLowerCase();
      }
    };
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = handleDataSort(a);
        let fb = handleDataSort(b);
        if (fa < fb) {
          return orderSort === "asc" ? -1 : 1;
        }
        if (fa > fb) {
          return orderSort === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return result.slice((page - 1) * pageSize, page * pageSize);
  };

  // Handle Cancel Modal Active/Inactive
  const handleCancelActiveOrInactive = () => {
    setGasSourceRecord({});
    setModalActiveOrInactive(false);
    form.resetFields();
    formActivation?.resetFields();
  };

  const handleStartDate = (date) => {
    setStartDate(moment(date));
  };

  const handleDisableEndDate = (current) => {
    if (startDate !== null) {
      return moment(startDate) >= current;
    }
    return moment().add(-1, "days") >= current;
  };

  const itemActions = [
    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title="Detail">
            <div className="pt-1">
              <SVGIcon
                name="IconDetail"
                width={24}
                onClick={() => handleDetail(record.id)}
              />
            </div>
          </Tooltip>
        );
      },
    },

    {
      action: "Activate",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip
            title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}
          >
            <div className="pt-1">
              <Checkbox
                onClick={() => {
                  handleActiveOrInactive(record);
                  handleStartDate(record.startDate);
                }}
                checked={record.status === "INACTIVE" ? true : false}
                disabled={record.status === "ACTIVE" ? false : true}
              />
            </div>
          </Tooltip>
        );
      },
    },
  ];
  const columnActionPermissions = useColumnActionPermissionAccount(
    ["Activate", "View", "Update"],
    itemActions,
    accessAccount,
  );

  return (
    <Fragment>
      <TablePagination
        dataSource={type === "detail" ? filterDataByPage() : data?.result}
        columns={
          type === "detail"
            ? columnsDetail(
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearchNoApi,
              )
            : [
                ...columns(
                  search,
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearchApi,
                  handleDetail,
                  handleActiveOrInactive,
                  handleStartDate,
                ),
                ...columnActionPermissions,
              ]
        }
        current={page}
        pageSize={pageSize}
        onChange={handleChange}
        onSizeChanger={handleChange}
        totalData={
          type === "detail" ? dataNoApi?.length : data?.page?.totalElements
        }
        onSort={type === "detail" ? onSortNoApi : onSortApi}
        tableScrolled={{ y: 525, x: 2300 }}
      />

      {/* Modal Active/Inactive */}
      {/* <ModalApproveOrReject
        isOpen={modalActiveOrInactive}
        handleCloseModal={handleCancelActiveOrInactive}
        onFinish={handleConfirmActiveOrInactive}
        header={'Inactivate'}
        approveOrReject={'Inactivate'}
        menu={"Gas Source"}
        named={gasSourceRecord?.name}
        children={
          <>

            <Form.Item
              label={"End Date"}
              name={"endDate"}
              rules={[
                {
                  validator: (_, value) =>
                    (value && moment(startDate) < moment(value)) || !value
                      ? Promise.resolve()
                      : Promise.reject(
                        new Error("End date must After Start date")
                      ),
                },
                {
                  required: true,
                  message: "Please input your End Date!",
                },
              ]}
              initialValue={moment(startDate)}
            >
              <DateComponent dateDisable={handleDisableEndDate} disabled={hasValue(gasSourceRecord?.endDate)} />
            </Form.Item>
            <Form.Item
              label={"Testing"}
              name={"testInput"}
              rules={formMessageRequired('testing')}
            >
              <InputComponent />
            </Form.Item>
          </>
        }
      /> */}

      <ModalActivationDynamic
        form={formActivation}
        isOpen={modalActiveOrInactive}
        handleCloseModal={handleCancelActiveOrInactive}
        onFinish={handleConfirmActiveOrInactive}
        header={"Inactivate"}
        approveOrReject={"Inactivate"}
        menu={"Gas Source"}
        named={gasSourceRecord?.name}
      >
        <>
          <Form.Item
            label={"End Date"}
            name={"endDate"}
            rules={[
              {
                validator: (_, value) =>
                  (value && moment(startDate) < moment(value)) || !value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("End date must After Start date"),
                      ),
              },
              {
                required: true,
                message: "Please input your End Date!",
              },
            ]}
          >
            <DateComponent
              dateDisable={handleDisableEndDate}
              disabled={hasValue(gasSourceRecord?.endDate)}
            />
          </Form.Item>
          <Form.Item
            name={"remark"}
            label={"Remark"}
            rules={formMessageRequired("Remark")}
            className="w-full"
          >
            <InputComponent
              group
              rows={1}
              type="textarea"
              value={remark}
              placeholder={"Type your remark"}
              onChange={(e) => setRemark(e.target.value)}
            />
          </Form.Item>
        </>
      </ModalActivationDynamic>
      {/* <GasSourceActiveOrInactive
        isOpen={modalActiveOrInactive}
        handleCancel={() => handleCancelActiveOrInactive()}
        handleCancelFooter={() => handleCancelActiveOrInactive()}
        handleConfirmFooter={() => handleConfirmActiveOrInactive()}
        remark={remark}
        form={form}
        onChange={(e) => setRemark(e.target.value)}
        startDate={startDate}
      /> */}

      {/* Modal Detail */}
      <GasSourceDetail
        data={data_detail}
        isOpen={modalDetail}
        handleCancel={() => setModalDetail(false)}
      />
    </Fragment>
  );
};

export default GasSourceTable;
