import { LeftOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Select, Alert, Form, Spin } from "antd";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import SelectComponent from "../../../../components/SelectComponent";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import useGrantAccessHooks from "../../../../components/useGrantAccessHooks";
import {
  getAllUserPaginate,
  getAllAuthType,
  changeAuthType,
} from "../../../../redux/slices/user_management/user";
import TablePagination from "../../../../components/TablePagination";
import { useDispatch, useSelector } from "react-redux";
import { renderColumn } from "../../../../utils";
import ModalBack from "../../../../components/Modal/ModalBack";
import { requiredMessage } from "../../../../utils";
import InputComponent from "../../../../components/InputComponent";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import { getColumnSearchPropsPaging } from "../../../../utils/getColumnSearchProps";

const MaintainUser = ({ dataTable }) => {
  const { data, data_user, data_auth_type, loading } = useSelector(
    (state) => state.user
  );
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const handleCancel = () => {
    setOpenModal(false);
  };
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [body, setBody] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [search, setSearch] = useState({});
  const access = useGrantAccessHooks();
  const [sort, setSort] = useState("");
  const [modalBack, setModalBack] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataTableSelect, setDataTableSelect] = useState([]);
  const [selectedKeyDataTable, setSelecetedKeyDataTable] = useState([]);
  const [authType, setAuthType] = useState(null);
  const [tempData, setTempData] = useState([]);
  const [remark, setRemark] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [initValue, setInitValue] = useState("");

  const handleFetch = useCallback(() => {}, []);

  const routes = [
    {
      path: "",
      breadcrumbName: "User Management",
    },
    {
      path: USER_ROUTES.VIEW_USER,
      breadcrumbName: "User",
    },
    {
      path: "",
      breadcrumbName: "Change Auth Type",
    },
  ];

  useEffect(() => {
    dispatch(getAllAuthType());
  }, [dispatch]);

  useEffect(() => {
    let tempData = data?.result?.map((item, index) => ({
      ...item,
      key: index + 1,
    }));
    setTempData(tempData);
  }, [data]);

  useEffect(() => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      getAllUserPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [search, sort, page, pageSize, dispatch]);

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
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const onSelectChange = (newSelectedRowKeys, newSelectedRow) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setDataTableSelect(newSelectedRow);
    // console.log("tes: ", newSelectedRowKeys);
  };

  const rowSelection = {
    fixed: true,
    type: "checkbox",
    preserveSelectedRowKeys: true,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelecetedKeyDataTable(selectedRowKeys);
      setDataTableSelect(selectedRows);
    },
    getCheckboxProps: (record) => ({
      // disabled: existData.includes(record.id),
      // Column configuration not to be checked
      name: record.id,
    }),
  };

  const handleAuthTypeChange = (value) => {
    setAuthType({ from: value });
    setSearch({ authType: value });
    setInitValue(undefined);
    // fetchUsers(value);
  };

  const handleSaveModal = async (formValue) => {
    try {
      const body = {
        userIds: dataTableSelect.map((item) => {
          return { userId: item?.userId };
        }),
        remark: formValue.remark,
        ...authType,
      };

      setBody(body);
      await dispatch(changeAuthType(body))?.unwrap();
      // dispatch(
      //   changeAuthType({ body: { ...body, userId: location?.state.userId } })
      // );
      setModalSuccess(true);
    } catch (error) {
      // console.error("Failed to generate password link:", error);
    }
  };

  const columns = [
    {
      title: "NO",
      width: 70,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "USERNAME",
      dataIndex: "username",
      key: "username",
      align: "left",
      // width: 40,
      sorter: true,
      ...getColumnSearchPropsPaging(
        "username",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "username",
          searchedColumn,
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
      // width: 40,
      align: "left",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "email",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "email",
          searchedColumn,
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      // width: 20,
      sorter: true,
      ...getColumnSearchPropsPaging(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        "status"
      ),
      render: (text) =>
        renderColumn(
          "status",
          searchedColumn,
          searchText,
          text,
          false,
          "status",
          search
        ),
    },
    {
      title: "AUTH TYPE",
      dataIndex: "authType",
      key: "authType",
      // width: 20,
      align: "center",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "authType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "authType",
          searchedColumn,
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
  ];

  const handleRetry = () => {
    handleCancelTryAgain();
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  return (
    <div>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <BaseContainer header={"CHANGE AUTHENTICATION TYPE"}>
          <div className={"w-full flex flex-col gap-8"}>
            <div className={"w-full flex justify-end gap-3"}>
              <span>From</span>
              <div className="w-1/12">
                <SelectComponent
                  onChange={handleAuthTypeChange}
                  style={{ width: "200px" }}
                >
                  {(data_auth_type?.data || []).map((data, index) => (
                    <Select.Option value={data.value} key={index}>
                      {data.name}
                    </Select.Option>
                  ))}
                </SelectComponent>
              </div>

              <span>To</span>
              <div className="w-1/12">
                <SelectComponent
                  value={initValue}
                  onChange={(value) => {
                    setAuthType((preState) => ({ ...preState, to: value }));
                    setInitValue(value);
                  }}
                  style={{ width: "200px" }}
                >
                  {(data_auth_type?.data || [])
                    ?.filter((item) => item?.value !== authType?.from)
                    ?.map((data, index) => {
                      return (
                        <Select.Option value={data.value} key={index}>
                          {data.name}
                        </Select.Option>
                      );
                    })}
                </SelectComponent>
              </div>
            </div>
            <TablePagination
              dataSource={tempData}
              totalData={data?.page?.totalElements}
              current={page}
              pageSize={pageSize}
              tableScrolled={{ y: 525, x: 500 }}
              onChange={handleChange}
              onSizeChanger={handleChange}
              columns={columns}
              onSort={onSort}
              rowSelection={rowSelection}
            />
          </div>
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
          <div className={"w-full flex justify-end"}>
            <ButtonComponent
              type={"submit"}
              htmlType={"submit"}
              onClick={() => setOpenModal(true)}
            >
              Save
            </ButtonComponent>
          </div>
        </div>

        {/* Modal Back */}
        <ModalBack
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
        />

        {/* Modal Save */}
        <ModalCustom
          isOpen={openModal}
          handleCancel={handleCancel}
          header={"Change Auth type Confirmation"}
          width={1000}
          type={"confirmation"}
          footer={
            <div className="w-full flex justify-end gap-5 p-4">
              <ButtonComponent onClick={handleCancel}>Cancel</ButtonComponent>
              <ButtonComponent
                form="formConfirmation"
                type="submit"
                htmlType="submit"
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <Form
            id="formConfirmation"
            layout="vertical"
            form={form}
            onFinish={handleSaveModal}
          >
            <div className="flex flex-col justify-center gap-6">
              <Alert
                message={"Are you sure you want to change auth type?"}
                icon={
                  <ExclamationCircleOutlined
                    style={{ fontSize: "24px", color: "#65481C" }}
                  />
                }
                type={"warning"}
                showIcon
                className="p-0 m-0"
              />

              <Form.Item
                name={"remark"}
                label={"Remark"}
                rules={[{ message: requiredMessage("Remark"), required: true }]}
                className="w-full"
              >
                <InputComponent
                  rows={1}
                  type="textarea"
                  value={remark}
                  placeholder={"Type your remark"}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </Form.Item>
            </div>
          </Form>
        </ModalCustom>
        {/* render modal */}
        {renderModal()}
      </Spin>
    </div>
  );
};

export default MaintainUser;
