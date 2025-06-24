import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SVGIcon from "../../../../assets/Icon/index";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import {
  Form,
  Input,
  Select,
  Spin,
  Space,
  Tooltip,
  InputNumber,
  Table,
  Pagination,
} from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import TablePagination from "../../../../components/TablePagination";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import DetailText from "../../../../components/DetailText";
import {
  ModalConfirm,
  ModalError,
  ModalSuccess,
} from "../../../../components/Modal/ModalPopUp";
import { useNavigate } from "react-router-dom";
import {
  createGlobalType,
  getParentAndGroup,
  getSortBy,
} from "../../../../redux/slices/system_setup/globalTypes";
import InputComponent from "../../../../components/InputComponent";

const CreateGlobalType = () => {
  // Selector
  const { loading, dataSortBy, dataParentAndGroup } = useSelector(
    (state) => state.globalTypes
  );

  // Declaration
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formHeader] = Form.useForm();
  const [formDetail] = Form.useForm();
  const { Option } = Select;

  // State
  const [sizeTable, setSizeTable] = useState(10);
  const [currentTable, setCurrentTable] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [data, setData] = useState([]);
  const [bodyData, setBodyData] = useState({});
  const [typeModal, setTypeModal] = useState("");
  const [dataUpdate, setDataUpdate] = useState({});
  const [keyTable, setKeyTable] = useState();
  const [parentValue, setParentValue] = useState([]);

  // Use Effect
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
    }
  }, [typeModal]);

  useEffect(() => {
    dispatch(getSortBy());
    dispatch(getParentAndGroup());
  }, []);

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
      path: SYSTEM_SETUP_ROUTES.CREATE_GLOBAL_TYPE,
      breadcrumbName: "Create Global Type",
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
      dataIndex: "dataParentGroup",
    },
    {
      title: "PARENT VALUE",
      dataIndex: "dataParentValue",
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
    },
    {
      title: "ACTION",
      fixed: "right",
      align: "center",
      dataIndex: "key",
      render: (v, r, i) => {
        return (
          <Space size="middle" style={{ display: "flex" }}>
            <Tooltip title="Update">
              <span
                className="flex justify-center"
                onClick={() => {
                  handleUpdate(r);
                }}
              >
                <SVGIcon name="IconEdit" width={24} />
              </span>
            </Tooltip>
            <Tooltip title="Delete">
              <span
                className="flex justify-center"
                onClick={() => {
                  handleDelete(r);
                }}
              >
                <SVGIcon name="IconDelete" width={24} />
              </span>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  // Handle Finish
  const handleFinish = (formValue) => {
    const modifiedArray = data.map((obj) => {
      const { key, ...rest } = obj;
      return rest;
    });
    const dataValue = { ...formValue, globalTypeValue: modifiedArray };
    setBodyData(dataValue);
  };

  // Handle Add Value to Array
  const handleAdd = (formValue) => {
    if (typeModal === "create") {
      // get data name of Parent Group
      const dataParentGroup = dataParentAndGroup
        ?.filter((a) => a.glbTypeId === formValue.parentGroup)
        .find((b) => b.groupName)?.groupName;

      // get data name of Parent Value
      const dataParentValue = parentValue?.find((a) => a.text)?.text;

      const dataValue = {
        ...formValue,
        key: data.length + 1,
        dataParentGroup,
        dataParentValue,
      };
      data.push(dataValue);
      console.log(dataValue);
      setOpenModal(false);
      formDetail.resetFields();
    }
    if (typeModal === "update") {
      const dataValue = { ...formValue, key: keyTable };
      const findIndex = data.findIndex((item) => item?.key === keyTable);
      const newData = [...data];
      const item = newData[findIndex];
      const updatedRow = { ...item, ...dataValue };
      newData.splice(findIndex, 1, updatedRow);
      setData(newData);
      setOpenModal(false);
      formDetail.resetFields();
    }
    setTypeModal("");
  };

  // Function Table
  const dataTable = (page, pageSize) => {
    return data?.slice((page - 1) * pageSize, page * pageSize);
  };

  // Pagination
  const handleChangePage = (currentTable, sizeTable) => {
    setCurrentTable(currentTable);
    setSizeTable(sizeTable);
  };

  // Delete Row
  const handleDelete = (r) => {
    const x = data.filter((e) => e !== r);
    setData(x);
  };

  // State Table
  const [displayColumn, setDisplayColumn] = useState(columns);
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);

  // Function Show/Hide Column
  const handleDisplayColumn = (value) => {
    setDisplayColumn(() =>
      columns.filter((col) => {
        return !value.includes(col.title);
      })
    );
    setOptionSelectedCol(value);
  };

  // Handle Confirm
  const handleConfirm = () => {
    setModalConfirm(false);
    bodyData.globalTypeValue?.map((e) => delete e.dataParentGroup);
    bodyData.globalTypeValue?.map((e) => delete e.dataParentValue);
    dispatch(createGlobalType(bodyData))
      .unwrap()
      .then(() => {
        setModalSuccess(true);
      })
      .catch(() => {
        setModalError(true);
      });
    console.log({ bodyData: bodyData });
  };

  // Handle Update
  const handleUpdate = (r) => {
    setTypeModal("update");
    setOpenModal(true);
    setDataUpdate(r);
    setKeyTable(r?.key);
  };

  // Validation Button Back
  const handleBack = () => {
    if (
      (formHeader.getFieldValue() === null &&
        formDetail.getFieldValue() === null) ||
      (Object.keys(formHeader.getFieldValue()).length === 0 &&
        Object.keys(formDetail.getFieldValue()).length === 0)
    ) {
      navigate(-1);
    } else {
      setModalBack(true);
    }
  };

  // handle Parent Group to get Parent Value
  const handleChange = (e) => {
    const filterParentValue = dataParentAndGroup
      ?.filter((a) => a.glbTypeId === e)
      .find((b) => b.parentValue)?.parentValue;
    setParentValue(filterParentValue);
  };

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <Form layout="vertical" form={formHeader} onFinish={handleFinish}>
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
                <Input allowClear />
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
                  setOpenModal(true);
                  setTypeModal("create");
                }}
                icon={<SVGIcon name="IconButtonCreate" width={24} />}
              >
                Create
              </ButtonComponent>
            </div>
            <div className="flex flex-col w-full">
              <div className={"w-full flex mb-5 gap-2 justify-between"}>
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
                  total={data.length}
                  current={currentTable}
                  pageSize={sizeTable}
                  onChange={handleChangePage}
                  onShowSizeChange={handleChangePage}
                  showTotal={(total, range) =>
                    `Showing ${range[0]} to ${range[1]} of ${total} records`
                  }
                />
              </div>
              {/* <TablePagination
                dataSource={dataTable(currentTable, sizeTable)}
                columns={columns}
                current={currentTable}
                pageSize={sizeTable}
                onChange={handleChangePage}
                onShowSizeChange={handleChangePage}
                totalData={data?.length}
              /> */}
              <Table
                bordered
                columns={displayColumn}
                dataSource={[...data]}
                pagination={false}
                tableLayout="auto"
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
                  icon={<SVGIcon name="IconButtonClear" width={24} />}
                  type="submit"
                  onClick={() => {
                    formHeader.resetFields();
                    setData([]);
                  }}
                >
                  Clear
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
                      formHeader.getFieldValue().desc === undefined ||
                      data.length === 0
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

        {/* Modal Value*/}
        <ModalCustom
          isOpen={openModal}
          type="confirmation"
          header="global type value"
          width={700}
          handleOk={handleAdd}
          handleCancel={() => {
            formDetail.resetFields();
            setOpenModal(false);
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
              <Form.Item label="Order" name="order">
                <InputNumber
                  controls={false}
                  type="number"
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
              <Form.Item label="Parent Group" name="parentGroup">
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
                    setOpenModal(false);
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

        {/* Modal Confirmation*/}
        <ModalCustom
          isOpen={modalConfirm}
          type="confirmation"
          header="CONFIRMATION"
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
              <DetailText label="Sort BY">{bodyData.sortBy}</DetailText>
              <div className="w-full col-span-2">
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
                    return item?.dataIndex !== "key";
                  })}
                  pageSize={10}
                  current={1}
                  dataSource={[...data]}
                />
              </div>
            </div>
          </div>
        </ModalCustom>

        {/* Modal Back*/}
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

        {/* Modal Success*/}
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
            <p className="pl-[70px]">Your data has been created.</p>
          </div>
        </ModalSuccess>

        {/* Modal Error*/}
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
              Your data was not created. Please try again.
            </p>
          </div>
        </ModalError>
      </Spin>
    </LayoutMenu>
  );
};

export default CreateGlobalType;
