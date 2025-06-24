import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import SVGIcon from "../../../../assets/Icon/index";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import {
  Spin,
  Form,
  Select,
  Input,
  Pagination,
  Table,
  Space,
  Tooltip,
  Popover,
  Checkbox,
  InputNumber,
  Alert,
} from "antd";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import {
  getViewDetailGlobalType,
  getSortBy,
  getParentAndGroup,
  getDetailGlobalTypeValue,
  updateGlobalType,
  inactiveGlobalType,
} from "../../../../redux/slices/system_setup/globalTypes";
import BaseContainer from "../../../../components/BaseContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import {
  LeftOutlined,
  MoreOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import StatusComponent from "../../../../components/StatusComponent";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../components/Card/CardComponent";
import DetailText from "../../../../components/DetailText";
import moment from "moment";
import { dateFormat } from "../../../../utils";
import TablePagination from "../../../../components/TablePagination";
import {
  ModalConfirm,
  ModalError,
  ModalSuccess,
} from "../../../../components/Modal/ModalPopUp";
import InputComponent from "../../../../components/InputComponent";

const EditGlobalType = () => {
  // Selector
  const {
    loading,
    dataSortBy,
    dataParentAndGroup,
    data_detail,
    data_detail_value,
  } = useSelector((state) => state.globalTypes);

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const id = location?.state?.id;
  const [formHeader] = Form.useForm();
  const [formDetail] = Form.useForm();
  const { Option } = Select;
  let glbValueData = data_detail?.vwRGlobaltypeValue?.map((item) => {
    return {
      id: item.glbTypeValId,
      displayText: item.name,
      value: item.glbValue,
      order: item.glbOrder,
      parentGroupName: item.parentGroupName,
      parentValueName: item.parentValueName,
      parentGroup: item.parentGroup,
      parentValue: item.parentValue,
      description: item.description,
      status: item.status,
      key: item.key,
    };
  });

  // State
  const [tableData, setTableData] = useState([]);
  const [sizeTable, setSizeTable] = useState(10);
  const [currentTable, setCurrentTable] = useState(1);
  const [modalDetail, setModalDetail] = useState(false);
  const [modalGTV, setModalGTV] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalSuccessActiveOrInactive, setModalSuccessActiveOrInactive] =
    useState(false);
  const [modalErrorActiveOrInactive, setModalErrorActiveOrInactive] =
    useState(false);
  const [modalActiveOrInactive, setModalActiveOrInactive] = useState(false);
  const [parentValue, setParentValue] = useState([]);
  const [dataUpdate, setDataUpdate] = useState({});
  const [typeModal, setTypeModal] = useState("");
  const [keyTable, setKeyTable] = useState();
  const [bodyData, setBodyData] = useState({});
  const [viewTable, setViewTable] = useState("");
  const [chooseId, setChooseId] = useState("");

  // Use Effect
  useEffect(() => {
    dispatch(getViewDetailGlobalType(id));
    dispatch(getSortBy());
    dispatch(getParentAndGroup());
  }, []);

  useEffect(() => {
    if (id && data_detail) {
      formHeader.setFieldsValue({
        groupName: data_detail.groupName,
        sortBy: data_detail.sortBy,
        desc: data_detail.desc,
      });
      const glbValueData = data_detail.vwRGlobaltypeValue?.map((item) => {
        return {
          id: item.glbTypeValId,
          displayText: item.name,
          value: item.glbValue,
          order: item.glbOrder,
          parentGroupName: item.parentGroupName,
          parentValueName: item.parentValueName,
          parentGroup: item.parentGroup,
          parentValue: item.parentValue,
          description: item.description,
          status: item.status,
          key: item.key,
        };
      });
      setTableData(glbValueData || []);
    }
  }, [id, formHeader, data_detail]);

  useEffect(() => {
    if (typeModal === "create") {
      formDetail.setFieldsValue({
        groupName: formHeader.getFieldValue().groupName,
      });
      console.log("masuk create");
    }
    if (typeModal === "update") {
      formDetail.setFieldsValue({
        groupName: formHeader.getFieldValue().groupName,
        displayText: dataUpdate.displayText,
        value: dataUpdate.value,
        order: dataUpdate.order,
        parentGroup: dataUpdate.parentGroup,
        parentValue: dataUpdate.parentValue,
        description: dataUpdate.description,
      });
      console.log("masuk update");
    }
  }, [typeModal]);

  // Breadcrumbs
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
      path: SYSTEM_SETUP_ROUTES.UPDATE_GLOBAL_TYPE,
      breadcrumbName: "Update Global Type",
    },
  ];

  // Column
  const columns = [
    {
      title: "NO",
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "DISPLAY TEXT",
      dataIndex: "displayText",
    },
    {
      title: "VALUE",
      dataIndex: "value",
    },
    {
      title: "ORDER",
      dataIndex: "order",
      align: "right",
    },
    {
      title: "PARENT GROUP",
      dataIndex: "parentGroupName",
    },
    {
      title: "PARENT VALUE",
      dataIndex: "parentValueName",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      render: (status) => (
        <StatusComponent
          color={status === "ACTIVE" ? "status-active" : "status-inactive"}
        >
          {status}
        </StatusComponent>
      ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
    },
    {
      title: "ACTION",
      fixed: "right",
      align: "center",
      dataIndex: "id",
      render: (id, r, i) => {
        return (
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
                    icon={<SVGIcon name="IconDetail" width={24} />}
                    border={false}
                    onClick={() => {
                      handleDetail(id);
                    }}
                  >
                    <span className={"text-black"}>Detail</span>
                  </ButtonComponent>
                  <ButtonComponent
                    onClick={() => {
                      handleUpdate(r);
                    }}
                    icon={<SVGIcon name="IconUpdateAction" width={24} />}
                    border={false}
                  >
                    <span className={"text-black"}>Update</span>
                  </ButtonComponent>
                  {r.status === "ACTIVE" || r.status === "INACTIVE" ? (
                    <div className="flex justify-center">
                      <Checkbox
                        onClick={() => {
                          setModalActiveOrInactive(true);
                          setChooseId(id);
                        }}
                        checked={r?.status === "ACTIVE" ? true : false}
                      >
                        <span className={"text-black normal-case text-[18px]"}>
                          {r?.status}
                        </span>
                      </Checkbox>
                    </div>
                  ) : (
                    <></>
                  )}
                </Space>
              }
            >
              <ButtonComponent
                icon={<MoreOutlined style={{ fontSize: "24px" }} />}
                border={false}
              />
            </Popover>
            {r.status === "ACTIVE" || r.status === "INACTIVE" ? (
              <Tooltip title="Delete">
                <span className="flex justify-center cursor-not-allowed">
                  <SVGIcon name="IconDelete" width={24} className="disabled" />
                </span>
              </Tooltip>
            ) : (
              <Tooltip title="Delete">
                <span
                  className="flex justify-center"
                  onClick={() => {
                    handleDelete(r.key);
                  }}
                >
                  <SVGIcon name="IconDelete" width={24} />
                </span>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  // State Table
  const [displayColumn, setDisplayColumn] = useState(columns);
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);

  // Delete Row
  const handleDelete = useCallback(
    (r) => {
      setTableData((prevState) => prevState.filter((e) => e.key !== r));
    },
    [tableData]
  );

  // Handle Detail
  const handleDetail = (id) => {
    setModalDetail(true);
    dispatch(getDetailGlobalTypeValue(id));
  };

  // Handle Add Value to Array
  const handleAdd = (formValue) => {
    if (typeModal === "create") {
      // get data name of Parent Group
      const parentGroupName = dataParentAndGroup
        ?.filter((a) => a.glbTypeId === formValue.parentGroup)
        .find((b) => b.groupName)?.groupName;

      // get data name of Parent Value
      const parentValueName = parentValue?.find((a) => a.text)?.text;
      const maxId = tableData.reduce(
        (max, item) => (item.key > max ? item.key : max),
        0
      );
      const dataValue = {
        ...formValue,
        key: maxId + 1,
        parentGroupName,
        parentValueName,
        id: null,
        status: null,
      };
      console.log(dataValue, "data value");
      const newData = [...tableData, dataValue];
      setTableData(newData);
      // tableData.push([...dataValue]);
      setModalGTV(false);
      formDetail.resetFields();
    }
    if (typeModal === "update") {
      const dataValue = { ...formValue, key: keyTable };
      const findIndex = tableData.findIndex((item) => item?.key === keyTable);
      const newData = [...tableData];
      const item = newData[findIndex];
      const updatedRow = { ...item, ...dataValue };
      newData.splice(findIndex, 1, updatedRow);
      setTableData(newData);
      setModalGTV(false);
      formDetail.resetFields();
    }
    setTypeModal("");
    setViewTable("tableFilter");
  };

  // Handle Update
  const handleUpdate = (r) => {
    setTypeModal("update");
    setModalGTV(true);
    setDataUpdate(r);
    setKeyTable(r?.key);
  };

  // Handle Finish
  const handleFinish = (formValue) => {
    const modifiedArray = tableData.map((obj) => {
      const { key, ...rest } = obj;
      return rest;
    });
    const dataValue = {
      ...formValue,
      id: data_detail?.glbTypeId,
      globalTypeValue: modifiedArray,
    };
    setBodyData(dataValue);
  };

  // Pagination
  const handleChangePage = (currentTable, sizeTable) => {
    setCurrentTable(currentTable);
    setSizeTable(sizeTable);
  };

  // Function Show/Hide Column
  const handleDisplayColumn = (value) => {
    setDisplayColumn(() =>
      columns.filter((col) => {
        return !value.includes(col.title);
      })
    );
    setOptionSelectedCol(value);
  };

  // Function for Change Parent Value
  const handleChange = (e) => {
    const filterParentValue = dataParentAndGroup
      ?.filter((a) => a.glbTypeId === e)
      .find((b) => b.parentValue)?.parentValue;
    setParentValue(filterParentValue);
  };

  // Handle Reset
  const handleReset = () => {
    dispatch(getViewDetailGlobalType(id));
  };

  // Handle Back
  const handleBack = () => {
    if (bodyData === null || Object.keys(bodyData).length === 0) {
      navigate(-1);
    } else {
      setModalBack(true);
    }
  };

  // Handle Confirm
  const handleConfirm = () => {
    setModalConfirm(false);
    delete bodyData.groupName;
    bodyData.globalTypeValue?.map((e) => delete e.parentGroupName);
    bodyData.globalTypeValue?.map((e) => delete e.parentValueName);
    bodyData.globalTypeValue?.map((e) => delete e.groupName);
    dispatch(updateGlobalType(bodyData))
      .unwrap()
      .then(() => {
        setModalSuccess(true);
      })
      .catch(() => {
        setModalError(true);
      });
    console.log({ bodyData: bodyData });
  };

  // Handle Inactive/Active
  const handleActiveOrInactive = () => {
    dispatch(inactiveGlobalType(chooseId))
      .unwrap()
      .then(() => {
        setModalActiveOrInactive(false);
        setModalSuccessActiveOrInactive(true);
        dispatch(getViewDetailGlobalType(id));
      })
      .catch(() => {
        setModalActiveOrInactive(false);
        setModalErrorActiveOrInactive(true);
        dispatch(getViewDetailGlobalType(id));
      });
  };

  // Find Status Data
  const statusDetail = data_detail?.vwRGlobaltypeValue
    ?.filter((a) => a.glbTypeValId === chooseId)
    .find((v) => v.status)?.status;

  console.log(dataUpdate, "data update");

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <Form layout="vertical" form={formHeader} onFinish={handleFinish}>
          <BaseContainer header={"global type information"}>
            <div className="w-full grid grid-cols-2 gap-2">
              <Form.Item
                label="Group Name"
                name={"groupName"}
                rules={[
                  {
                    required: true,
                    message: "Please input your Group Name!",
                  },
                ]}
              >
                <Input allowClear disabled />
              </Form.Item>
              <Form.Item
                label="Sort By"
                name="sortBy"
                rules={[
                  { required: true, message: "Please input your Sort By!" },
                ]}
              >
                <Select allowClear>
                  {dataSortBy &&
                    dataSortBy.map((ta, index) => (
                      <Select.Option value={ta.value} key={index}>
                        {ta.value}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <div className="col-span-2">
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Please input your Description!",
                    },
                  ]}
                  label={"Description"}
                  name={"desc"}
                  className={"w-full"}
                >
                  <Input.TextArea
                    showCount
                    maxLength={255}
                    style={{
                      height: 120,
                    }}
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
                  setModalGTV(true);
                  setTypeModal("create");
                  setDataUpdate({});
                }}
                icon={<SVGIcon name="IconButtonCreate" width={24} />}
              >
                Create
              </ButtonComponent>
            </div>
            <div className="flex flex-col w-full">
              <div className="w-full flex mb-5 gap-2 justify-between">
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
                  total={tableData?.length}
                  current={currentTable}
                  pageSize={sizeTable}
                  onChange={handleChangePage}
                  onShowSizeChange={handleChangePage}
                  showTotal={(total, range) =>
                    `Showing ${range[0]} to ${range[1]} of ${total} records`
                  }
                />
              </div>
              <Table
                bordered
                columns={displayColumn}
                // dataSource={viewTable === "tableFilter" ? [...tableData] : tableData}
                dataSource={tableData}
                pagination={false}
                tableLayout="auto"
                scroll={{ x: 1500 }}
              />
            </div>
          </BaseContainer>

          <div className="mt-[30px] flex">
            <ButtonComponent
              type={"submit"}
              onClick={() => handleBack()}
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
                  icon={<SVGIcon name="IconButtonReset" width={24} />}
                  type="submit"
                  onClick={handleReset}
                >
                  Reset
                </ButtonComponent>
              </Form.Item>
              <Form.Item>
                <ButtonComponent
                  type="submit"
                  htmlType={"submit"}
                  onClick={() => {
                    handleFinish();
                    if (
                      formHeader.getFieldValue().groupName === undefined ||
                      formHeader.getFieldValue().sortBy === undefined ||
                      formHeader.getFieldValue().desc === undefined
                    ) {
                      setModalConfirm(false);
                    } else {
                      setModalConfirm(true);
                    }
                  }}
                >
                  Save
                </ButtonComponent>
              </Form.Item>
            </div>
          </div>
        </Form>

        {/* Modal Global Type Value */}
        <ModalCustom
          isOpen={modalGTV}
          type="confirmation"
          header="global type value"
          width={700}
          handleOk={handleAdd}
          handleCancel={() => {
            formDetail.resetFields();
            setModalGTV(false);
          }}
        >
          <Form layout="vertical" form={formDetail} onFinish={handleAdd}>
            <div className="w-full grid grid-cols-2 gap-2">
              <Form.Item label="Group Name" name="groupName">
                <Input disabled />
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
              {dataUpdate.status === "ACTIVE" ||
              dataUpdate.status === "INACTIVE" ? (
                <Form.Item
                  label="Value"
                  name="value"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Value!",
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
              ) : (
                <Form.Item
                  label="Value"
                  name="value"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Value!",
                    },
                  ]}
                >
                  <InputComponent />
                </Form.Item>
              )}
              <Form.Item label="Order" name="order">
                <InputNumber
                  controls={false}
                  type="number"
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
              <Form.Item label="Parent Group" name={"parentGroup"}>
                <Select allowClear onChange={(e) => handleChange(e)}>
                  {dataParentAndGroup &&
                    dataParentAndGroup.map((ta, index) => (
                      <Select.Option value={ta.glbTypeId} key={index}>
                        {ta.groupName}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item label="Parent Value" name="parentValue">
                <Select allowClear>
                  {parentValue &&
                    parentValue.map((ta, index) => (
                      <Select.Option value={ta.glbTypeValId} key={index}>
                        {ta.text}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <div className="col-span-2">
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Please input your Description!",
                    },
                  ]}
                  label={"Description"}
                  name={"description"}
                  className={"w-full"}
                >
                  <Input.TextArea
                    showCount
                    maxLength={255}
                    style={{
                      height: 120,
                    }}
                  />
                </Form.Item>
              </div>
            </div>
            <div className={"w-full flex justify-end gap-5"}>
              <Form.Item>
                <ButtonComponent
                  type="default"
                  onClick={() => {
                    formDetail.resetFields();
                    setModalGTV(false);
                    setTypeModal("");
                  }}
                >
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

        {/* Modal Confirmation */}
        <ModalCustom
          isOpen={modalConfirm}
          type="confirmation"
          header="confirmation"
          width={1000}
          handleCancel={() => setModalConfirm(false)}
          footer={
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent
                type={"default"}
                onClick={() => setModalConfirm(false)}
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
          <div className="w-full p-5">
            <div>
              <span className="text-primary uppercase font-bold">
                global type information
              </span>
            </div>

            <div className="grid grid-cols-2 gap-5 pt-[30px]">
              <DetailText label="Group Name">{bodyData.groupName}</DetailText>
              <DetailText label="Sort By">{bodyData.sortBy}</DetailText>
              <DetailText label="Description">{bodyData.desc}</DetailText>
            </div>

            <div className="pt-[30px]">
              <span className="text-primary uppercase font-bold">
                global type value information
              </span>
            </div>

            <div className="col-span-2 pt-[30px]">
              <TablePagination
                columns={columns.filter((item) => {
                  return item?.dataIndex !== "glbTypeValId";
                })}
                pageSize={10}
                current={1}
                dataSource={tableData}
              />
            </div>
          </div>
        </ModalCustom>

        {/* Modal Detail */}
        <ModalCustom
          isOpen={modalDetail}
          handleCancel={() => setModalDetail(false)}
          type="detail"
          header="Detail Global Type Value"
          width={800}
          footer={
            <ButtonComponent
              type={"default"}
              onClick={() => setModalDetail(false)}
            >
              Cancel
            </ButtonComponent>
          }
        >
          <CardComponent header={"GLOBAL TYPE VALUE INFORMATION"} cols={4}>
            <DetailText label="Text">
              {data_detail_value?.name ? data_detail_value.name : ""}
            </DetailText>
            <DetailText label="Value">
              {data_detail_value?.glbValue ? data_detail_value.glbValue : ""}
            </DetailText>
            <DetailText label="Order">
              {data_detail_value?.glbOrder ? data_detail_value.glbOrder : ""}
            </DetailText>
            <DetailText label="Description">
              {data_detail_value?.description
                ? data_detail_value.description
                : ""}
            </DetailText>
            <DetailText label="Parent Group">
              {data_detail_value?.parentGroup
                ? data_detail_value.parentGroup
                : ""}
            </DetailText>
            <DetailText label="Parent Value">
              {data_detail_value?.parentValue
                ? data_detail_value.parentValue
                : ""}
            </DetailText>
            <DetailText label="Status">
              {data_detail_value?.status ? data_detail_value.status : ""}
            </DetailText>
          </CardComponent>

          <CardComponent header={"HISTORY LOG INFORMATION"} cols={4}>
            <DetailText label="Created By">
              {data_detail_value?.createdBy ? data_detail_value.createdBy : ""}
            </DetailText>
            <DetailText label="Created Date">
              {data_detail_value?.createdDate
                ? moment(data_detail_value.createdDate).format(dateFormat)
                : ""}
            </DetailText>
            <DetailText label="Updated By">
              {data_detail_value?.updatedBy ? data_detail_value.updatedBy : ""}
            </DetailText>
            <DetailText label="Updated Date">
              {data_detail_value?.updatedDate
                ? moment(data_detail_value.updatedDate).format(dateFormat)
                : ""}
            </DetailText>
          </CardComponent>
        </ModalCustom>

        {/* Modal Back */}
        <ModalConfirm
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
        >
          <div className="flex justify-center mt-5 gap-[20px]">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className="text-[18px] font-bold">
              Are you sure you want to back?
            </p>
          </div>
        </ModalConfirm>

        {/* Modal Success */}
        <ModalSuccess
          isOpen={modalSuccess}
          handleOk={() => navigate(-1)}
          handleCancel={() => navigate(-1)}
        >
          <div className="px-8 py-8 justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconSuccess" width={48} />
              <p className="text-[18px] font-bold">Successful</p>
            </div>
            <p className="pl-[70px]">Your data has been updated.</p>
          </div>
        </ModalSuccess>

        {/* Modal Error */}
        <ModalError
          isOpen={modalError}
          handleOk={() => setModalError(false)}
          handleCancel={() => setModalError(false)}
        >
          <div className="px-8 py-8 justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">Failed</p>
            </div>
            <p className="pl-[70px]">
              Your data was not updated. Please try again.
            </p>
          </div>
        </ModalError>

        {/* Modal Active/Inactive */}
        <ModalConfirm
          isOpen={modalActiveOrInactive}
          handleCancel={() => setModalActiveOrInactive(false)}
          handleOk={handleActiveOrInactive}
        >
          {statusDetail === "ACTIVE" ? (
            <>
              <div className="flex justify-center gap-[20px]">
                <WarningOutlined
                  style={{ fontSize: "24px", color: "#BE3036" }}
                />
                <p className="text-[18px] font-bold">
                  Are you sure you want to inactivate?
                </p>
              </div>
              <Alert
                message="Warning! if you inactivate this data, it can’t be use."
                type={"error"}
              />
            </>
          ) : (
            <>
              <div className="flex justify-center mt-3 gap-[20px]">
                <WarningOutlined
                  style={{ fontSize: "24px", color: "#BE3036" }}
                />
                <p className="text-[18px] font-bold">
                  Are you sure you want to activate?
                </p>
              </div>
            </>
          )}
        </ModalConfirm>

        {statusDetail === "ACTIVE" && (
          <ModalSuccess
            isOpen={modalSuccessActiveOrInactive}
            handleOk={() => setModalSuccessActiveOrInactive(false)}
            handleCancel={() => setModalSuccessActiveOrInactive(false)}
          >
            <div className="px-8 py-8 justify-center">
              <div className="w-full flex gap-[20px]">
                <CheckCircleOutlined
                  style={{ fontSize: "24px", color: "#ACC424" }}
                />
                <p className="text-[18px] font-bold">Success</p>
              </div>
              <p className="pl-[70px]">Your data has been activate.</p>
            </div>
          </ModalSuccess>
        )}

        {statusDetail === "INACTIVE" && (
          <ModalSuccess
            isOpen={modalSuccessActiveOrInactive}
            handleOk={() => setModalSuccessActiveOrInactive(false)}
            handleCancel={() => setModalSuccessActiveOrInactive(false)}
          >
            <div className="px-8 py-8 justify-center">
              <div className="w-full flex gap-[20px]">
                <CloseCircleOutlined
                  style={{ fontSize: "24px", color: "#ACC424" }}
                />
                <p className="text-[18px] font-bold">Success</p>
              </div>
              <p className="pl-[70px]">Your data has been inactivate.</p>
            </div>
          </ModalSuccess>
        )}
      </Spin>
    </LayoutMenu>
  );
};

export default EditGlobalType;
