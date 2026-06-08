import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import {
  Space,
  Tooltip,
  Form,
  Input,
  Select,
  Spin,
  Popover,
  Checkbox,
} from "antd";
import SVGIcon from "../../../../assets/Icon/index.js";
import { useState } from "react";
import { useEffect } from "react";
import {
  createGlobalType,
  getDetailGlobalType,
  getDetailGlobalTypeValue,
  getParentAndGroup,
  getSortBy,
  inactiveGlobalType,
  updateGlobalType,
} from "../../../../redux/slices/system_setup/globalTypes";
import ButtonComponent from "../../../../components/ButtonComponent";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import {
  LeftOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import ConfirmationLayout from "./ConfirmationLayout";
import DetailGlobalTypeValue from "./DetailGlobalTypeValue";
import {
  ModalAttention,
  ModalConfirm,
} from "../../../../components/Modal/ModalPopUp";
import ActivationGlobalTypeValue from "./ActivationGlobalTypeValue";
import { useRef } from "react";
import Highlighter from "react-highlight-words";
import { setData } from "../../../../redux/slices/data_slice";
import InputComponent from "../../../../components/InputComponent";
import StatusComponent from "../../../../components/StatusComponent";
import SelectComponent from "../../../../components/SelectComponent";
import { showModalError, validateCreateUpdate } from "../../../../redux/slices/general_slice";
import ModalBack from "../../../../components/Modal/ModalBack";
import { formMessageRequired, toTitleCase } from "../../../../utils/index.js";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks.js";
import userHttpService from "../../../../redux/services/userHttpService.js";
import TablePaginationNew from "../../../../components/TablePaginationNew.js";
import { getColumnSearchProps } from "../../../../utils/getColumnSearchProps.js";


const GlobalTypeForm = (props) => {
  const { type } = props;
  const {
    loading,
    dataSortBy,
    dataParentAndGroup = [],
    data_detail_value,
    global_detail,
  } = useSelector((state) => state.globalTypes);

  const { bodyError: error } = useSelector(state => state?.general);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // state
  const [globalTypeForm] = Form.useForm();
  const [globalListValue] = Form.useForm();
  const [datas, setDatas] = useState([]);
  const [dataParentGroup, setDataParentGroup] = useState([]);
  const [parentValues, setParentValues] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openActivation, setOpenActivation] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedData, setSelectedData] = useState({});
  const [bodyData, setBodyData] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [search, setSearch] = useState("");
  const [globalTypeValueIsNull, setGlobalTypeValueIsNull] = useState(false);
  const [description, setDescription] = useState("");
  // const [modalError, setModalError] = useState(false);
  // const [bodyError, setBodyError] = useState({});
  const [modalBack, setModalBack] = useState(false);
  const [sortBySelected, setSortBySelected] = useState('CUSTOM_ORDER');
  const id = location?.state?.id;
  const [payload, setPayload] = useState({})


  const glbValueData =
    global_detail?.data?.vwRGlobaltypeValue?.map((item) => {
      return {
        id: item?.glbTypeValId,
        displayText: item?.name,
        value: item?.glbValue,
        order: item?.glbOrder,
        parentGroupName: item?.parentGroupName,
        parentValueName: item?.parentValueName,
        parentGroup: item?.parentGroup,
        parentValue: item?.parentValue,
        description: item?.description,
        status: item?.status,
        key: item?.key,
      };
    }) || [];
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await dispatch(getDetailGlobalType(id))?.unwrap();
      }
      await dispatch(getParentAndGroup())?.unwrap();
      await dispatch(getSortBy())?.unwrap();
    };
    fetchData();
  }, [dispatch, id]);

  useEffect(() => {
    if (type === "update" && dataParentAndGroup) {
      setDataParentGroup(
        dataParentAndGroup?.filter((item) => item?.glbTypeId !== id)
      );
    } else {
      setDataParentGroup(dataParentAndGroup);
    }
  }, [type, id, dataParentAndGroup]);

  useEffect(() => {
    if (id) {
      globalTypeForm.setFieldsValue({
        groupName: global_detail?.data?.groupName,
        sortBy: global_detail?.data?.sortByValue,
        desc: global_detail?.data?.desc,
      });
      setSortBySelected(global_detail?.data?.sortBy)
      setDatas(glbValueData);
    }
  }, [id, globalTypeForm, global_detail]);

  useEffect(() => {
    if (modalType === "create_list") {
      globalListValue.setFieldsValue({
        groupName: globalTypeForm.getFieldValue("groupName"),
      });
    }
    if (modalType === "update_list") {
      globalListValue.setFieldsValue({
        groupName: globalTypeForm.getFieldValue("groupName"),
        displayText: selectedData?.displayText,
        value: selectedData?.value,
        order: selectedData?.order,
        parentGroup: selectedData?.parentGroup,
        parentValue: selectedData?.parentValue,
        description: selectedData?.description,
      });
    }
    setDisplayColumn(columns);
  }, [modalType, selectedData, globalTypeForm, globalListValue]);

  const handleDelete = useCallback(
    (r) => {
      setDatas((prevState) => prevState.filter((e) => e.key !== r));
    },
    [datas]
  );

  // handle search
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


  const ActionRender = (props) => {
    const {
      record,
      handleDelete = () => { },
      handleUpdate = () => { },
      handleDetail = () => { },
    } = props;
    return (
      <>
        {type === "create" ? (
          <Space>
            <Tooltip title="Update">
              <span className="flex justify-center" onClick={handleUpdate}>
                <SVGIcon name="IconEdit" width={24} />
              </span>
            </Tooltip>
            <Tooltip title="Delete">
              <span className="flex justify-center" onClick={handleDelete}>
                <SVGIcon name="IconDelete" width={24} />
              </span>
            </Tooltip>
          </Space>
        ) : (
          <Space>
            <Popover
              trigger={"click"}
              placement="bottomRight"
              content={
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ display: "flex" }}
                >
                  <ButtonComponent
                    icon={
                      <SVGIcon
                        name="IconEdit"
                        color={
                          record?.status === "ACTIVE" ? "#0075bf" : "#8D91A0"
                        }
                        width={24}
                      />
                    }
                    border={false}
                    onClick={
                      record?.status === "ACTIVE" ? handleUpdate : undefined
                    }
                    disabled={record?.status !== "ACTIVE"}
                  >
                    <span className={"text-black"}>Update</span>
                  </ButtonComponent>
                  <ButtonComponent
                    icon={<SVGIcon name="IconDetail" width={24} />}
                    border={false}
                    onClick={handleDetail}
                  >
                    <span className={"text-black"}>Detail</span>
                  </ButtonComponent>

                  <ButtonComponent
                    border={false}
                    // disabled={record?.status !== "ACTIVE"}
                    icon={<Checkbox checked={record?.status !== "ACTIVE"} />}
                    onClick={
                      // record?.status === "ACTIVE"
                      //   ?
                      () => {
                        setOpenActivation(true);
                        setSelectedData(record);
                      }
                      // : undefined
                    }
                  >
                    <span className={"text-black"}>
                      {
                        record?.status === "ACTIVE" ? "Inactivate" : "Activate"
                      }</span>
                  </ButtonComponent>
                </Space>
              }
            >
              <ButtonComponent icon={<MoreOutlined width={24} />} border={false} />
            </Popover>
            <Tooltip title="Delete">
              <span
                className={`flex justify-center ${!record?.id ? "cursor-not-allowed" : "cursor-no-drop"
                  }`}
                onClick={() => {
                  !record?.id && handleDelete();
                }}
              >
                <SVGIcon
                  name="IconDelete"
                  width={24}
                  color={record?.id ? "#C0BEC6" : "#c81912"}
                />
              </span>
            </Tooltip>
          </Space>
        )}
      </>
    );
  };
  // Column
  const columns = [
    {
      title: "NO",
      align: "center",
      width: 90,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "DISPLAY TEXT",
      dataIndex: "displayText",
      key: "displayText",
      sorter: (a, b) => a.displayText?.localeCompare(b.displayText),
      ...getColumnSearchProps(
        "displayText",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "VALUE",
      dataIndex: "value",
      key: "value",
      width: 160,
      sorter: (a, b) => a.value?.localeCompare(b.value),
      ...getColumnSearchProps(
        "value",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "ORDER",
      dataIndex: "order",
      align: "right",
      key: "order",
      width: 120,
      sorter: (a, b) => a.order - b.order,
      ...getColumnSearchProps(
        "order",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "PARENT GROUP",
      dataIndex: "parentGroup",
      key: "parentGroup",
      sorter: (a, b) => {
        const aGroupName = dataParentAndGroup
          ?.filter((item) => item?.glbTypeId === a?.groupName)
          .map((name) => name?.groupName)
          .shift();
        const bGroupName = dataParentAndGroup
          ?.filter((item) => item?.glbTypeId === b?.groupName)
          .map((name) => name?.groupName)
          .shift();
        return aGroupName?.localeCompare(bGroupName);
      },
      ...getColumnSearchProps(
        "parentGroup",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) => {
        const groupName = dataParentAndGroup
          ?.filter((item) => item?.glbTypeId === text)
          .map((name) => name?.groupName)
          .shift();
        return <span>{groupName}</span>;
      },
    },
    {
      title: "PARENT VALUE",
      dataIndex: "parentValue",
      key: "parentValue",
      sorter: (a, b) => {
        const matchingEntryA = dataParentAndGroup?.find((entry) =>
          entry.parentValue.some((item) => item.glbTypeValId === a?.parentValue)
        );
        const textA =
          matchingEntryA?.parentValue.find(
            (item) => item.glbTypeValId === a?.parentValue
          ).text || "";
        const matchingEntryB = dataParentAndGroup?.find((entry) =>
          entry.parentValue.some((item) => item.glbTypeValId === b?.parentValue)
        );
        const textB =
          matchingEntryB?.parentValue.find(
            (item) => item.glbTypeValId === b?.parentValue
          ).text || "";
        return textA.localeCompare(textB);
      },
      ...getColumnSearchProps(
        "parentValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (parentValue) => {
        const matchingEntry = dataParentAndGroup?.find((entry) =>
          entry.parentValue.some((item) => item.glbTypeValId === parentValue)
        );
        const text = matchingEntry?.parentValue.find(
          (item) => item.glbTypeValId === parentValue
        ).text;
        return <span>{text}</span>;
      },
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description?.localeCompare(b.description),
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchProps(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) => {
        if (searchedColumn === "description") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      fixed: 'right',
      ...getColumnSearchProps(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        'status'
      ),
      render: (text) => (
        <div className={" flex justify-center"}>
          <StatusComponent colour={text}>{toTitleCase(text)}</StatusComponent>
        </div>
      ),
    },
    {
      title: "ACTION",
      align: "center",
      fixed: "right",
      dataIndex: "key",
      width: 150,
      render: (v, r, i) => {
        return (
          <ActionRender
            record={r}
            handleDelete={() => handleDelete(r?.key)}
            handleUpdate={() => handleUpdate(r)}
            handleDetail={() => handleDetail(r?.id)}
          />
        );
      },
    },
  ];
  const [displayColumn, setDisplayColumn] = useState([]);
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);
  const handleDisplayColumn = (value) => {
    setDisplayColumn(() =>
      columns.filter((col) => {
        return !value.includes(col.title);
      })
    );
    setOptionSelectedCol(value);
  };
  // pagination
  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const validateData = (form) => {
    let tempData = [...datas];
    if (modalType !== "create_list") {
      tempData = tempData.filter((item) => item?.key !== selectedData.key);
    }
    return tempData.every(
      (item) =>
        item?.value.toLowerCase() !== form?.value?.toLowerCase() &&
        item?.displayText.toLowerCase() !== form?.displayText?.toLowerCase()
    );
  };

  const handleListFinish = (formValue) => {
    const newDatas = [...datas];
    const { groupName, ...form } = formValue;
    if (validateData(formValue)) {
      if (modalType === "create_list") {
        const values = {
          key: datas.length + 1,
          status: "ACTIVE",
          ...form,
        };
        newDatas.push(values);
        setDatas(newDatas);
      } else {
        const dataValue = { ...form, key: selectedData?.key };
        const findIndex = datas.findIndex(
          (item) => item?.key === selectedData?.key
        );
        const item = newDatas[findIndex];
        const updatedRow = { ...item, ...dataValue };
        newDatas.splice(findIndex, 1, updatedRow);
        setDatas(newDatas);
        setOpenModal(false);
      }
      setParentValues([]);
      globalListValue.setFields([{ name: "parentValue", errors: [] }]);
      globalListValue.resetFields();
      setOpenModal(false);
    } else {
      const errorBody = {
        title: "Failed",
        description: `Your data was not created. Global type display text or value already exist. Please try again.`,
      };
      dispatch(showModalError(errorBody));
    }
  };
  const handleChangeParentGroup = (e) => {
    const parentSelected = Object.assign(
      {},
      ...dataParentAndGroup?.filter((item) => item?.glbTypeId === e)
    );
    setParentValues(parentSelected?.parentValue || []);
    if (!e) {
      globalListValue.setFields([{ name: "parentValue", errors: [] }]);
    }
    globalListValue.resetFields(["parentValue"]);
  };
  const handleUpdate = (record) => {
    setModalType("update_list");
    setOpenModal(true);
    setSelectedData(record);
    let parentSelected = {};
    if (record?.parentGroup) {
      parentSelected = Object.assign(
        {},
        ...dataParentAndGroup?.filter(
          (item) => item?.glbTypeId === record.parentGroup
        )
      );
    }
    setParentValues(parentSelected?.parentValue || []);
  };
  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_GLOBAL_TYPE,
      breadcrumbName: "Global Type",
    },
    {
      path: "",
      breadcrumbName:
        type === "create" ? "Create Global Type" : "Update Global Type",
    },
  ];

  const handleFinish = async (formValue) => {
    try {
      let body;
      let validateValueObj;
      const setGlobalTypeValue = datas.map((obj) => {
        const { key, groupName, ...rest } = obj;
        return rest;
      });
      if (type === 'update') {
        body = {
          ...formValue,
          id: id,
          globalTypeValue: setGlobalTypeValue,
        };
        validateValueObj = { body: body, services: userHttpService, endPoint: '/v1/dbs/api/globaltype/validate-update', type }
      } else {
        body = {
          ...formValue,
          globalTypeValue: setGlobalTypeValue,
        };
        validateValueObj = { body: body, services: userHttpService, endPoint: '/v1/dbs/api/globaltype/validate-create', type }
      }

      setPayload({
        body: body,
        validateValue: validateValueObj
      })
      await dispatch(validateCreateUpdate(validateValueObj))?.unwrap();
      setOpenConfirmation(true);
    } catch (error) {
      setOpenConfirmation(false)
    }
  };

  const handleConfirm = async () => {
    try {
      handleCloseModalError()
      if (type === "create") {
        await dispatch(createGlobalType(payload?.body))?.unwrap()
      } else {
        await dispatch(updateGlobalType(payload?.body))?.unwrap()
      }

    } catch (error) {

    }
  };

  const handleDetail = async (id) => {
    await dispatch(getDetailGlobalTypeValue(id)).unwrap();
    setOpenDetail(true);
  };
  const handleActiveOrInactive = async (record) => {
    try {
      handleCloseModalError()
      const updatedTableData = datas.map((item) => {
        if (item.key === record.key) {
          return {
            ...item,
            status: record?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
          };
        }
        return item;
      });
      setDatas(updatedTableData);
      setPayload({ id: record.id, statusData: record?.status })
      await dispatch(inactiveGlobalType({ id: record.id, statusData: record?.status }))?.unwrap()
      await dispatch(getDetailGlobalType(id))?.unwrap()
    } catch (error) {
      handleCloseModalError()
    }
  };

  // handle clear
  const handleClear = () => {
    if (type === "create") {
      globalTypeForm.resetFields();
      setDatas([]);
    } else {
      globalTypeForm.resetFields();
      setData([]);
      dispatch(getDetailGlobalType(id));
    }
  };

  const paginationTable = (typeData = "data") => {
    let result = [...datas];
    if (searchedColumn) {
      const fixSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        if (searchedColumn === "parentGroup") {
          const data = item[searchedColumn] || 0;
          const aGroupName = dataParentAndGroup
            ?.filter((item) => item?.glbTypeId === data)
            .map((name) => name?.groupName)
            .shift();
          return (aGroupName || "").toLowerCase().includes(fixSearchText);
        }
        if (searchedColumn === "parentValue") {
          const data = item[searchedColumn] || 0;
          const matchingEntryA = dataParentAndGroup?.find((entry) =>
            entry.parentValue.some((item) => item.glbTypeValId === data)
          );
          const textA =
            matchingEntryA?.parentValue.find(
              (item) => item.glbTypeValId === data
            ).text || "";
          return (textA || "").toLowerCase().includes(fixSearchText);
        }
        if (searchedColumn === "order") {
          return item[searchedColumn]
            ?.toString()
            .toLowerCase()
            .includes(fixSearchText);
        }
        return item[searchedColumn]?.toLowerCase().includes(fixSearchText);
      });
    }
    const fix = result.slice((page - 1) * pageSize, page * pageSize);
    return typeData === "data" ? fix : result.length;
  };

  const handleCloseModalError = () => {
    setOpenConfirmation(false);
    setSelectedData({});
    setOpenActivation(false);
  };


  const handleRetry = () => {
    handleCancelTryAgain()
    if (error?.action === "CREATE_GLOBAL_TYPE") {
      dispatch(createGlobalType(payload?.body))
    } else if (error?.action === 'UPDATE_GLOBAL_TYPE') {
      dispatch(updateGlobalType(payload?.body))
    } else if (error?.action === 'VALIDATE_CREATE_UPDATE') {
      dispatch(validateCreateUpdate(payload?.validateValue))
    } else if (error?.action === 'INACTIVE_GLOBAL_TYPE') {
      dispatch(inactiveGlobalType(payload))
    } else if (error?.action === 'GET_DETAIL_GLOBAL_TYPE') {
      dispatch(getDetailGlobalType(id))
    } else {
      dispatch(getParentAndGroup())
      dispatch(getSortBy())
    }
  }

  // handle change sort by
  const handleChangeSortBy = (e) => {
    setSortBySelected(e);
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry)
  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <Form form={globalTypeForm} layout={"vertical"} onFinish={handleFinish}>
          <BaseContainer header={"global type information"}>
            <div className="w-full grid grid-cols-2 gap-2">
              <Form.Item
                label="Group Name"
                name="groupName"
                rules={[
                  {
                    required: true,
                    message: "Please input your Group Name!",
                  },
                ]}
              >
                <Input allowClear disabled={type === "update"} onInput={(e) =>
                  (e.target.value = e.target.value.trimStart())
                } />
              </Form.Item>
              <Form.Item
                label="Sort By"
                name="sortBy"
                rules={[
                  { required: true, message: "Please input your Sort By!" },
                ]}
              >
                <SelectComponent onChange={handleChangeSortBy}>
                  {dataSortBy &&
                    dataSortBy.map((ta, index) => (
                      <Select.Option value={ta.value} key={index}>
                        {ta.name}
                      </Select.Option>
                    ))}
                </SelectComponent>
              </Form.Item>
              <div className="col-span-2">
                <Form.Item
                  label={"Description"}
                  name={"desc"}
                  className={"w-full"}
                >
                  <InputComponent
                    rows={5}
                    type="textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Item>
              </div>
            </div>
          </BaseContainer>
          <BaseContainer header={"global type value information"}>
            <div className="w-full flex justify-end mb-[30px]">
              <ButtonComponent
                type={"submit"}
                onClick={() => {
                  setModalType("create_list");
                  setOpenModal(true);
                }}
                icon={<SVGIcon name="IconButtonCreate" width={24} />}
              >
                Create
              </ButtonComponent>
            </div>
            {/* <div className={"w-full flex mb-5 gap-2 justify-between"}>
              <Select
                mode="multiple"
                placeholder="Show All Column"
                className={"w-2/6"}
                maxTagCount={3}
                onChange={handleDisplayColumn}
              >
                {columns
                  .map((col) => (
                    <Option
                      key={col.title}
                      value={col.title}
                      disabled={
                        optionSelectedCol.length > 3
                          ? optionSelectedCol.includes(col.title)
                            ? false
                            : true
                          : false
                      }
                    >
                      {col.title}
                    </Option>
                  ))
                  .splice(1)}
              </Select>
              <Pagination
                className={"pr-1"}
                showSizeChanger
                total={datas?.length}
                current={page}
                pageSize={pageSize}
                onChange={handleChangePage}
                onShowSizeChange={handleChangePage}
                showTotal={(total, range) =>
                  `Showing ${range[0]} to ${range[1]} of ${total} records`
                }
              />
            </div>
            <Table
              bordered
              dataSource={paginationTable(page, pageSize)}
              columns={displayColumn}
              pagination={false}
              tableLayout="auto"
              scroll={{ x: 1500 }}
            /> */}

            <TablePaginationNew
              type="FE"
              dataSource={datas}
              columns={columns}
              current={page}
              pageSize={pageSize}
              onChange={handleChangePage}
              onSizeChanger={handleChangePage}
              // totalData={paginationTable("length")}
              tableScrolled={{ x: 1500, y: 500 }}
            // onSort={onSort}
            />
          </BaseContainer>
          <div className="mt-[30px] flex">
            <ButtonComponent
              type={"submit"}
              onClick={() => setModalBack(true)}
              icon={
                <LeftOutlined
                  style={{
                    color: "#fff",
                    fontSize: 24,
                    justifyItems: "center",
                  }}
                />
              }
            >
              Back
            </ButtonComponent>

            <div className={"w-full flex justify-end gap-5"}>
              <Form.Item>
                <ButtonComponent
                  icon={
                    <SVGIcon
                      name={
                        type === "update"
                          ? `IconButtonReset`
                          : `IconButtonClear`
                      }
                      width={24}
                    />
                  }
                  type="submit"
                  onClick={handleClear}
                >
                  {type === "update" ? "Reset" : "Clear"}
                </ButtonComponent>
              </Form.Item>
              <Form.Item>
                <ButtonComponent type="submit" htmlType={"submit"}>
                  Save
                </ButtonComponent>
              </Form.Item>
            </div>
          </div>
        </Form>
        <ModalCustom
          isOpen={openModal}
          type="confirmation"
          header="global type value"
          width={700}
          handleCancel={() => {
            setParentValues([]);
            globalListValue.setFields([{ name: "parentValue", errors: [] }]);
            globalListValue.resetFields();
            setModalType('');
            setOpenModal(false);
          }}
        >
          <Form
            form={globalListValue}
            layout={"vertical"}
            onFinish={handleListFinish}
          >
            <div className="w-full grid grid-cols-2 gap-2">
              <Form.Item label="Group Name" name="groupName">
                <Input
                  disabled
                  defaultValue={globalTypeForm.getFieldValue("groupName")}
                />
              </Form.Item>
              <Form.Item
                label="Display Text"
                name="displayText"
                rules={[
                  {
                    required: true,
                    message: "Please input your Display Text!",
                  },
                ]}
              >
                <InputComponent />
              </Form.Item>
              <Form.Item
                label="Value"
                name="value"
                rules={[
                  {
                    required: true,
                    message: "Please input your Value!",
                  },
                  {
                    pattern: /^(?:[a-zA-Z]+(?:[A-Z][a-z]*)*|[a-zA-Z]+(?:_[a-zA-Z]+)*)$/,
                    message: 'Value must be in snake_case or camelCase!',
                  }

                ]}
              >
                <Input disabled={type === 'update' && modalType === 'update_list'} />
              </Form.Item>
              <Form.Item label="Order" name="order" rules={sortBySelected === 'CUSTOM_ORDER' && formMessageRequired('order')}>
                <InputComponent
                  controls={false}
                  type="number"
                  style={{
                    width: "100%",
                  }}
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(/[^\d]|^0+/g, ''))
                  }
                />
              </Form.Item>
              <Form.Item label="Parent Group" name="parentGroup">
                <SelectComponent onChange={(e) => handleChangeParentGroup(e)}>
                  {dataParentGroup?.length
                    ? dataParentGroup.map((ta, index) => (
                      <Select.Option value={ta.glbTypeId} key={index}>
                        {ta.groupName}
                      </Select.Option>
                    ))
                    : null}
                </SelectComponent>
              </Form.Item>
              <Form.Item
                label="Parent Value"
                name="parentValue"
                rules={
                  parentValues.length > 0
                    ? formMessageRequired("Parent Value")
                    : undefined
                }
              >
                <SelectComponent>
                  {parentValues.map((ta, index) => (
                    <Select.Option value={ta.glbTypeValId} key={index}>
                      {ta.text}
                    </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>
              <div className="col-span-2">
                <Form.Item
                  label={"Description"}
                  name={"description"}
                  className={"w-full"}
                >
                  <InputComponent rows={5} type="textarea" />
                </Form.Item>
              </div>
            </div>
            <div className={"w-full flex justify-end gap-5"}>
              <Form.Item>
                <ButtonComponent
                  type="default"
                  onClick={() => {
                    setParentValues([]);
                    globalListValue.setFields([
                      { name: "parentValue", errors: [] },
                    ]);
                    globalListValue.resetFields();
                    setOpenModal(false);
                    setModalType('')
                  }}
                >
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
        <ModalCustom
          isOpen={openConfirmation}
          type="confirmation"
          header="Confirmation"
          width={800}
          handleCancel={() => {
            setOpenConfirmation(false);
          }}
          handleOk={() => setOpenConfirmation(false)}
          footer={
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent
                type={"default"}
                onClick={() => setOpenConfirmation(false)}
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                type={"submit"}
                border={false}
                onClick={() => handleConfirm()}
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <ConfirmationLayout
            dataParentAndGroup={dataParentAndGroup}
            data={payload?.body}
          />
        </ModalCustom>
        <ModalCustom
          isOpen={openDetail}
          type="detail"
          header="DETAIL GLOBAL TYPE VALUE"
          width={1000}
          handleCancel={() => {
            setOpenConfirmation(false);
            setOpenDetail(false)
          }}
          handleOk={() => {
            setOpenConfirmation(false)
            setOpenDetail(false)
          }}
          footer={
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent
                type={"submit"}
                onClick={() => setOpenDetail(false)}
              >
                Back
              </ButtonComponent>
            </div>
          }
        >
          <DetailGlobalTypeValue data={data_detail_value} />
        </ModalCustom>
        <ModalConfirm
          isOpen={openActivation}
          handleCancel={() => setOpenActivation(false)}
          handleOk={() => handleActiveOrInactive(selectedData)}
        >
          <ActivationGlobalTypeValue selectedData={selectedData} />
        </ModalConfirm>
        <ModalAttention
          isOpen={globalTypeValueIsNull}
          handleCancel={() => setGlobalTypeValueIsNull(false)}
          handleOk={() => setGlobalTypeValueIsNull(false)}
          textList={"global type value information"}
        />
        {/* Modal Back */}
        <ModalBack
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
        />
        {/** Modal Retry */}
        {renderModal()}
      </Spin>
    </>
  );
};

export default GlobalTypeForm;
