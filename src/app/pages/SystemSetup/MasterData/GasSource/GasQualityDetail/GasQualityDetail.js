import React, { useState, useRef, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import BaseContainer from "../../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import TablePagination from "../../../../../../components/TablePagination";
import {
  DatePicker,
  Input,
  Form,
  InputNumber,
  Tooltip,
  Checkbox,
  Spin,
  Alert,
} from "antd";
import { FilterOutlined, InfoCircleOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import moment from "moment";
import {
  dateFormatting,
  formMessageRequired,
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../../utils";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import InputComponent from "../../../../../../components/InputComponent";
import DateComponent from "../../../../../../components/DateComponent";
import ConfirmationLayoutDetail from "../Modal/ConfirmationLayoutDetail";
import DetailGasQuality from "../Modal/DetailGasQuality";
import {
  createGasSourceQuality,
  getDetailGasSourceQuality,
  activeOrInactiveGasSourceQuality,
  getAllGasSourceQualityPaginate,
  updateEnDateGasSourceQuality,
} from "../../../../../../redux/slices/account_management/MasterData/gasSourceSlice";
import { clearBodyMessage } from "../../../../../../redux/slices/general_slice";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import ToolbarAccount from "../../../../AccountManagement/ComponentAccount/ToolbarAccount";
import { useColumnActionPermissionAccount } from "../../../../AccountManagement/ComponentAccount/ColumnActionPermissionAccount";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";

const GasQualityDetail = ({ id, uomName, dataDetail, actionList }) => {
  // Selector
  const { loading, data_detail_quality, dataQuality } = useSelector(
    (state) => state.gasSource,
  );
  const filteredArray = useMemo(() => {
    return {
      actionList: actionList?.actionList?.filter(
        (action) =>
          action.path.includes("/system-setup/gas-sources-quality/") &&
          !action.path.includes("/system-setup/gas-sources/"),
      ),
    };
  }, [actionList]);

  const { bodyError } = useSelector((state) => state?.general);

  // Declaration
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [formActivation] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const dataSource = dataQuality;

  // State
  const [startDate, setStartDate] = useState();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [bodyData, setBodyData] = useState({});
  const [description, setDescription] = useState("");
  const [remark, setRemark] = useState("");
  const [activeOrInactive, setActiveOrInactive] = useState();
  const [modalActiveOrInactive, setModalActiveOrInactive] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
  const [chooseId, setChooseId] = useState();
  const [documentNumber, setDocumentNumber] = useState("");
  const [modalError, setModalError] = useState(false);
  const [gasQualityId, setGasQualityId] = useState("12310");
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalValidateCreate, setModalValidateCreate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const [type, setType] = useState("");

  // //Use Effect
  // useEffect(() => {
  //   dispatch(getGrantedAccessAccount('/system-setup/gas-sources-quality'))
  // }, [dispatch])

  useEffect(() => {
    dispatch(
      getAllGasSourceQualityPaginate({
        id,
        search: encodeURIComponent(JSON.stringify(search)),
        sort,
        page,
        pageSize,
      }),
    );
  }, [id, search, sort, page, pageSize, dispatch]);

  // trigger modal try again
  useEffect(() => {
    if (
      bodyError?.response?.data?.code === 500 &&
      bodyError?.action !== "GET_DETAIL_GAS_SOURCE"
    ) {
      setModalError(true);
      setModalDetail(false);
    }
  }, [bodyError]);

  // Search Column Table
  const getColumnSearchProps = (dataIndex, type) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const onDataChange = (value, dateString) => {
        setSelectedKeys(dateString ? [dateString] : []);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };
      return (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {type === "date" ? (
            <DatePicker onChange={onDataChange} />
          ) : (
            <Input
              ref={searchInput}
              placeholder={`Search`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => {
                handleSearch(selectedKeys, confirm, dataIndex);
              }}
              style={{
                marginBottom: 8,
                display: "block",
              }}
            />
          )}
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 5000);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={
            type === "date"
              ? moment([searchText]).format(dateFormatting.dateFormal)
              : [searchText]
          }
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
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

  const columnsTable = [
    {
      title: "NO",
      width: 50,
      dataIndex: "no",
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "DOCUMENT NUMBER",
      dataIndex: "documentNumber",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "documentNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "documentNumber",
          hasValue(search["documentNumber"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
      // ...getColumnSearchProps("documentNumber"),
    },
    {
      sorter: true,
      title: "START DATE",
      dataIndex: "startDate",
      align: "center",
      // ...getColumnSearchProps("startDate", "date"),
      // render: (startDate) => moment(startDate).format(dateFormatting.date),
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
      dataIndex: "endDate",
      sorter: true,
      align: "center",
      // ...getColumnSearchProps("endDate", "date"),
      // render: (endDate) => endDate ? moment(endDate).format(dateFormatting.date) : '',
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
      title: "VALUE (M3/MMBTU)",
      dataIndex: "m3",
      align: "center",
      sorter: true,
      // ...getColumnSearchProps("value"),
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "m3",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "m3",
          hasValue(search["m3"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "VALUE (BTU/SCF (GHV))",
      dataIndex: "btu",
      align: "center",
      sorter: true,
      // ...getColumnSearchProps("valueDua"),
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "btu",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "btu",
          hasValue(search["btu"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "SG",
      dataIndex: "sg",
      align: "center",
      sorter: true,
      // ...getColumnSearchProps("sg"),
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "sg",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "sg",
          hasValue(search["sg"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "N2",
      dataIndex: "n2",
      align: "center",
      sorter: true,
      // ...getColumnSearchProps("n2"),
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "n2",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "n2",
          hasValue(search["n2"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "CO2",
      dataIndex: "co2",
      align: "center",
      sorter: true,
      // ...getColumnSearchProps("co2"),
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "co2",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "co2",
          hasValue(search["co2"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      sorter: true,
      width: 280,
      ellipsis: {
        showTitle: false,
      },
      // ...getColumnSearchProps("description"),
      // render: (description) => (
      //   <Tooltip placement="topLeft" title={description}>
      //     <p className="overflow-hidden truncate">{description}</p>
      //   </Tooltip>
      // ),
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
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
      sorter: true,
      fixed: "right",
      width: 120,
      // ...getColumnSearchProps("status"),
      // render: (index) => (
      //   <div className={" flex justify-center"}>
      //     <StatusComponent colour={index}>{toTitleCase(index)}</StatusComponent>
      //   </div>
      // ),
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (index) => {
        let text;
        switch (index) {
          case "WAITING APPROVAL":
          case "WAITING_FOR_APPROVAL":
          case "WAITING_APPROVAL":
            text = "Waiting Approval";
            break;
          default:
            text = index
              ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
              : index;
            break;
        }
        return text
          ? renderColumn(
              "status",
              hasValue(search["status"]),
              searchText,
              text,
              false,
              "status",
              search,
            )
          : text;
      },
    },
    // {
    //   title: "ACTION",
    //   dataIndex: "gasSourceDetailId",
    //   fixed: "right",
    //   align: "center",
    //   render: (id, record) => {
    //     console.log(record, "apaan");
    //     return (
    //       <div className="flex w-full justify-center gap-6">
    //         <Tooltip title="Detail">
    //           <div className="pt-1">
    //             <SVGIcon
    //               name="IconDetail"
    //               width={24}
    //               onClick={() => handleDetail(id)}
    //             />
    //           </div>
    //         </Tooltip>
    //         <Tooltip title="Update">
    //           <div className="pt-1">
    //             <SVGIcon
    //               name="IconEdit"
    //               width={24}
    //               onClick={() => handleUpdate(record, id)}
    //             />
    //           </div>
    //         </Tooltip>
    //         <Tooltip title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}>
    //           <div className="pt-1">
    //             <Checkbox
    //               disabled={record.status === "INACTIVE"}
    //               onClick={() => {
    //                 handleActiveOrInactive(record);
    //               }}
    //               checked={record.status === "ACTIVE" ? false : true}
    //             />
    //           </div>
    //         </Tooltip>
    //       </div>
    //     );
    //   },
    // },
  ];

  const handleUpdate = (r, id) => {
    setDataUpdate(r);
    setType("update");
    setOpenModal(true);
    // setModalUpdate(true)
    form.setFieldsValue({
      documentNumber: r.documentNumber,
      startDate: r.startDate ? moment(r.startDate) : null,
      endDate: r.endDate ? moment(r.endDate) : null,
      m3: r.m3,
      n2: r.n2,
      sg: r.sg,
      btu: r.btu,
      co2: r.co2,
      description: r.description,
    });
  };
  const handleConfirmUpdate = () => {
    dispatch(
      updateEnDateGasSourceQuality({
        gasSourceDetailId: dataUpdate.gasSourceDetailId,
        endDate: moment(formUpdate.endDate).format(dateFormatting.date),
      }),
    )
      .unwrap()
      .then(() => {
        dispatch(
          getAllGasSourceQualityPaginate({
            id,
            search: encodeURIComponent(JSON.stringify(search)),
            sort,
            page,
            pageSize,
          }),
        );
      })
      .catch((e) => {
        console.log("🚀 ~ handleConfirmUpdate ~ e:", e);
      });
  };
  const handleCancelUpdate = () => {
    setModalUpdate(false);
  };
  const handleCreate = () => {
    setType("create");
    setOpenModal(true);
    // const isActive = dataSource.result.some(item => item.status === "ACTIVE");
    // const hasEmptyAndDate = dataSource.result.some(item => item.endDate === null);
    // hasEmptyAndDate && isActive ? setModalValidateCreate(true) : setOpenModal(true);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Validation Handle Start Date
  const handleStartDate = (value) => {
    setStartDate(value);
    return value;
  };

  // Validation Handle End Date
  const handleDisableEndDate = (current) => {
    if (startDate !== null) {
      return moment(startDate) > current;
    }
    return moment().add(-1, "days") >= current;
  };

  // Handle Detail
  const handleDetail = (id) => {
    dispatch(getDetailGasSourceQuality(id));
    setModalDetail(true);
    setGasQualityId(id);
  };

  // Handle Confirmation
  const handleSave = (formValue) => {
    setModalConfirm(true);
    const dataValue = {
      gasSourceId: id,
      documentNumber: formValue.documentNumber,
      startDate: hasValue(formValue.startDate)
        ? moment(formValue.startDate).format(dateFormatting.date)
        : null,
      endDate: hasValue(formValue.endDate)
        ? moment(formValue.endDate).format(dateFormatting.date)
        : null,
      m3: formValue.m3,
      btu: formValue.btu,
      sg: formValue.sg,
      n2: formValue.n2,
      co2: formValue.co2,
      description: formValue.description,
    };
    setBodyData(dataValue);
    setOpenModal(false);
    setModalActiveOrInactive(false);
  };

  // Handle Confirm Create
  const handleConfirmCreate = () => {
    const bodyDataUpdate = {
      gasSourceDetailId: dataUpdate.gasSourceDetailId,
      endDate: bodyData.endDate,
      startDate: bodyData?.startDate,
      description: bodyData.description,
    };
    // type === "create" ?  dispatch(createGasSourceQuality({ body: bodyData })) : dispatch(updateEnDateGasSourceQuality(bodyDataUpdate))
    const checkAction =
      type === "create"
        ? createGasSourceQuality({ body: bodyData })
        : updateEnDateGasSourceQuality(bodyDataUpdate);

    dispatch(checkAction)
      .unwrap()
      .then(() => {
        form.resetFields();
        setModalConfirm(false);
        dispatch(
          getAllGasSourceQualityPaginate({
            id,
            search: encodeURIComponent(JSON.stringify(search)),
            sort,
            page,
            pageSize,
          }),
        );
      })
      .catch(() => {
        setModalConfirm(false);
        setOpenModal(true);
      });
  };

  // Handle Confirmation Active/Inactive
  const handleActiveOrInactive = (record) => {
    setModalActiveOrInactive(true);
    setActiveOrInactive(
      record?.status === "ACTIVE" ? "Inactivate" : "Activate",
    );
    setChooseId(record?.gasSourceDetailId);
    setDocumentNumber(record?.documentNumber);
    setOpenModal(false);
    setModalConfirm(false);
  };

  // Handle Cancel Modal Active/Inactive
  const handleCancelInactive = () => {
    setModalActiveOrInactive(false);
    setRemark("");
  };

  // Handle Confirm Modal Active/Inactive
  const handleConfirmInactive = (formValue) => {
    const data = {
      gasSourceDetailId: chooseId,
      remark: formValue.remark,
    };

    dispatch(
      activeOrInactiveGasSourceQuality({
        body: data,
        activeOrInactive: activeOrInactive,
      }),
    )
      .unwrap()
      .then(() => {
        setModalActiveOrInactive(false);
        setRemark("");
        dispatch(
          getAllGasSourceQualityPaginate({
            id,
            search: encodeURIComponent(JSON.stringify(search)),
            sort,
            page,
            pageSize,
          }),
        );
        formActivation.resetFields();
      })
      .catch(() => {
        setRemark("");
      });
  };

  // Handle Cancel
  const handleCancel = () => {
    form.resetFields();
    setOpenModal(false);
  };

  const handleConfirmRetry = () => {
    if (bodyError?.action === "GET_ALL_GAS_SOURCE_QUALITY_PAGINATE") {
      dispatch(
        getAllGasSourceQualityPaginate({ id, search, sort, page, pageSize }),
      );
    } else if (bodyError?.action === "GET_DETAIL_GAS_SOURCE_QUALITY") {
      dispatch(getDetailGasSourceQuality(gasQualityId));
      setModalDetail(true);
    } else if (bodyError?.action === "CREATE_GAS_SOURCE_QUALITY") {
      dispatch(createGasSourceQuality({ body: bodyData }));
      dispatch(
        getAllGasSourceQualityPaginate({
          id,
          search: encodeURIComponent(JSON.stringify(search)),
          sort,
          page,
          pageSize,
        }),
      );
    } else {
      const setBodyRemark = {
        gasSourceDetailId: chooseId,
        remark: remark,
      };
      const setStatus = {
        activeOrInactive: activeOrInactive,
      };
      dispatch(
        activeOrInactiveGasSourceQuality({
          body: setBodyRemark,
          activeOrInactive: setStatus,
        }),
      );
      dispatch(
        getAllGasSourceQualityPaginate({
          id,
          search: encodeURIComponent(JSON.stringify(search)),
          sort,
          page,
          pageSize,
        }),
      );
    }
    dispatch(clearBodyMessage());
  };
  // handle retry
  const handleRetry = () => {
    handleConfirmRetry();
    setModalError(false);
    dispatch(clearBodyMessage());
  };

  // handle close modal
  const handleCloseModalError = () => {
    setModalError(false);
    dispatch(clearBodyMessage());
    // setBodyError({});
  };

  const itemActions = [
    //action toolbar
    {
      action: "Create",
      render: (
        <ButtonComponent
          type={"submit"}
          onClick={() => {
            handleCreate();
          }}
          icon={<SVGIcon name="IconButtonCreate" width={24} />}
          disabled={dataDetail?.status === "INACTIVE"}
        >
          Create
        </ButtonComponent>
      ),
    },

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
                onClick={() => handleDetail(record?.gasSourceDetailId)}
              />
            </div>
          </Tooltip>
        );
      },
    },

    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title="Update">
            <div className="pt-1">
              <SVGIcon
                name="IconEdit"
                width={24}
                onClick={() => handleUpdate(record, record.id)}
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
                disabled={record.status === "INACTIVE"}
                onClick={() => {
                  handleActiveOrInactive(record);
                }}
                checked={record.status === "ACTIVE" ? false : true}
              />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <div>
      <Spin spinning={loading}>
        <BaseContainer header={"Gas Quality Detail"}>
          <div className="w-full flex justify-end mb-[30px]">
            <ToolbarAccount
              items={itemActions}
              advancedAccess={filteredArray}
            />
          </div>

          <div className="w-full">
            <TablePagination
              dataSource={dataSource?.result}
              columns={[
                ...columnsTable,
                ...useColumnActionPermissionAccount(
                  ["Activate", "View", "Update"],
                  itemActions,
                  filteredArray,
                ),
              ]}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              onSort={onSort}
              totalData={dataSource?.page?.totalElements}
              tableScrolled={{
                x: 2500,
                y: 300,
              }}
            />
          </div>
        </BaseContainer>

        {/* Modal Value*/}
        <ModalCustom
          isOpen={openModal}
          type="confirmation"
          header={`${type === "create" ? "CREATE" : "UPDATE"} GAS QUALITY DETAIL`}
          width={800}
          handleCancel={handleCancel}
          footer={false}
        >
          <Form layout="vertical" form={form} onFinish={handleSave}>
            <div className="w-full grid grid-cols-3 gap-3">
              <Form.Item
                label={"Document Number"}
                name={"documentNumber"}
                rules={[
                  {
                    required: true,
                    message: "Please input your Document Number!",
                  },
                  {
                    pattern: /^[a-zA-Z0-9\-/\.]+$/,
                    message:
                      "Invalid input. Only numbers, letters, (-), (/), and (.)",
                  },
                ]}
              >
                <InputComponent disabled={type === "update"} />
              </Form.Item>
              <Form.Item
                label={"Start Date"}
                name={"startDate"}
                getValueFromEvent={handleStartDate}
                rules={[
                  {
                    required: true,
                    message: "Please input your Start Date!",
                  },
                ]}
              >
                <DatePicker
                  format={"DD MMM YYYY"}
                  className="w-full"
                  disabled={type === "update"}
                  onChange={() => form.resetFields(["endDate"])}
                />
              </Form.Item>
              <Form.Item label={"End Date"} name={"endDate"}>
                <DateComponent dateDisable={handleDisableEndDate} />
              </Form.Item>
              <Form.Item
                label={"Value (M3/MMBTU)"}
                name={"m3"}
                rules={
                  uomName === "M3/MMBTU" && [
                    {
                      required: true,
                      message: "Please input your Value (M3/MMBTU)!",
                    },
                  ]
                }
              >
                <InputNumber
                  type="number"
                  controls={false}
                  style={{
                    width: "100%",
                  }}
                  disabled={type === "update"}
                />
              </Form.Item>
              <Form.Item
                label={"Value (BTU/SCV (GHV)"}
                name={"btu"}
                rules={
                  uomName === "BTU/SCF" && [
                    {
                      required: true,
                      message: "Please input your Value ((BTU/SCV (GHV))!",
                    },
                  ]
                }
              >
                <InputNumber
                  type="number"
                  controls={false}
                  style={{
                    width: "100%",
                  }}
                  disabled={type === "update"}
                />
              </Form.Item>
              <Form.Item label={"SG"} name={"sg"}>
                <InputNumber
                  type="number"
                  controls={false}
                  style={{
                    width: "100%",
                  }}
                  disabled={type === "update"}
                />
              </Form.Item>
              <Form.Item label={"N2"} name={"n2"}>
                <InputNumber
                  type="number"
                  controls={false}
                  style={{
                    width: "100%",
                  }}
                  disabled={type === "update"}
                />
              </Form.Item>
              <Form.Item label={"CO2"} name={"co2"}>
                <InputNumber
                  type="number"
                  controls={false}
                  style={{
                    width: "100%",
                  }}
                  disabled={type === "update"}
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
            </div>
            <div className={"w-full flex justify-end gap-5"}>
              <Form.Item>
                <ButtonComponent type="default" onClick={handleCancel}>
                  Cancel
                </ButtonComponent>
              </Form.Item>
              <Form.Item>
                <ButtonComponent type="submit" htmlType={"submit"}>
                  Confirm
                </ButtonComponent>
              </Form.Item>
            </div>
          </Form>
        </ModalCustom>

        {/* Modal Confirmation*/}
        <ConfirmationLayoutDetail
          data={bodyData}
          modalConfirm={modalConfirm}
          handleCancel={() => {
            setModalConfirm(false);
            setOpenModal(true);
          }}
          handleConfirm={() => handleConfirmCreate()}
        />

        {/* Modal Detail*/}
        <DetailGasQuality
          data={data_detail_quality}
          isOpen={modalDetail}
          handleCancel={() => setModalDetail(false)}
        />

        {/* Modal Active/Inactive*/}
        {/* <ActiveAndInactiveGasQuality
          isOpen={modalActiveOrInactive}
          header={activeOrInactive}
          activeOrInactive={activeOrInactive}
          handleCancel={() => handleCancelInactive()}
          handleCancelFooter={() => handleCancelInactive()}
          handleConfirmFooter={() => handleConfirmInactive()}
          remark={remark}
          onChange={(e) => setRemark(e.target.value)}
          documentNumber={documentNumber}
        /> */}

        <ModalCustom
          isOpen={modalActiveOrInactive}
          header={`${activeOrInactive} INFORMATION`}
          width={1000}
          type={"confirmation"}
          handleCancel={handleCancelInactive}
          footer={
            <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
              <ButtonComponent onClick={handleCancelInactive} type="default">
                Cancel
              </ButtonComponent>
              <ButtonComponent
                form="inactivateForm"
                type="submit"
                htmlType="submit"
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <Form
            id="inactivateForm"
            form={formActivation}
            onFinish={handleConfirmInactive}
            layout="vertical"
          >
            <div className="flex flex-col gap-6">
              <Alert
                message={`Are you sure want to ${activeOrInactive} Gas Source Document Number ${documentNumber}?`}
                icon={<InfoCircleOutlined />}
                type={"warning"}
                showIcon
                className="inactivate-alert"
              />
              <Form.Item
                name={"remark"}
                label={"Remark"}
                rules={formMessageRequired("remark")}
                className="w-full"
              >
                <InputComponent
                  group
                  rows={1}
                  type="textarea"
                  placeholder={"Type your remark"}
                />
              </Form.Item>
            </div>
          </Form>
        </ModalCustom>
      </Spin>

      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={handleCloseModalError}
        customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">
            {bodyError?.response?.data?.message?.toString()}
          </p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>

      <ModalError
        isOpen={modalValidateCreate}
        handleOk={() => setModalValidateCreate(false)}
        handleCancel={() => setModalValidateCreate(false)}
        customText={"Close"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{"Warning"}</p>
          </div>
          <p className="pl-[70px]">
            You must fill end date of latest gas quality detail before you can
            create new gas quality detail
          </p>
        </div>
      </ModalError>

      {/* Modal Update */}
      <ModalCustom
        isOpen={modalUpdate}
        header={`UPDATE GAS QUALITY DETAIL INFORMATION`}
        width={800}
        type={"confirmation"}
        handleCancel={handleCancelUpdate}
        footer={
          <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
            <ButtonComponent onClick={handleCancelUpdate} type="default">
              Cancel
            </ButtonComponent>
            <ButtonComponent form="updateForm" type="submit" htmlType="submit">
              Save
            </ButtonComponent>
          </div>
        }
      >
        <Form
          id="updateForm"
          form={formUpdate}
          onFinish={handleConfirmUpdate}
          layout="vertical"
        >
          <div className="flex flex-col gap-6">
            <Form.Item
              name={"endDate"}
              label={"End Date"}
              rules={formMessageRequired("endDate")}
              className="w-full"
            >
              <DateComponent />
              {/* <InputComponent
                  group
                  rows={1}
                  type="textarea"
                  placeholder={"Type your remark"}
                /> */}
            </Form.Item>
          </div>
        </Form>
      </ModalCustom>
    </div>
  );
};

export default GasQualityDetail;
