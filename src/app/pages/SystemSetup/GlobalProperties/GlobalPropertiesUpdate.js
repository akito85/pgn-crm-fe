import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Spin, Form, Checkbox, Select, Input } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import {
  getGlobalPropertiesDetail,
  getDataType,
  inactiveGlobalProperties,
  updateGlobalProperties,
  getAllTypeGlobalProperties,
} from "../../../../redux/slices/system_setup/globalProperties";
import BaseContainer from "../../../../components/BaseContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import {
  LeftOutlined,
  WarningOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import SVGIcon from "../../../../assets/Icon/index";
import StatusComponent from "../../../../components/StatusComponent";
import {
  ModalAttention,
  ModalConfirm,
} from "../../../../components/Modal/ModalPopUp";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import TablePagination from "../../../../components/TablePagination";
import DetailText from "../../../../components/DetailText";
import Highlighter from "react-highlight-words";
import InputComponent from "../../../../components/InputComponent";
import TableInlineGlobalProperties from "./TableInlineGlobalProperties";
import { formMessageRequired, toTitleCase } from "../../../../utils";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import userHttpService from "../../../../redux/services/userHttpService";
import { validateCreateUpdate } from "../../../../redux/slices/general_slice";

const GlobalPropertiesUpdate = () => {
  // Selector
  const {
    loading,
    data_detail,
    data_Type_Detail,
    data_Type = [],
  } = useSelector((state) => state.globalProperties);
  const { bodyError: error, isLoading } = useSelector(state => state?.general);

  // Declaration
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;
  const propertiesItemData =
    data_detail?.vwRGlobalPropertiesDtls?.map((item, index) => {
      return {
        key: index + 1,
        id: item.gpDetailId,
        keyName: item.gpdKey,
        value: item.gpdVal,
        dataType: item.dataType,
        status: item.status,
        encrypt: item.isEncrypt,
      };
    }) || [];
  const dataTypeSelect = data_Type_Detail?.map((item) => {
    return {
      value: item.value,
      label: item.name,
    };
  });

  // State
  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState({});
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [modalActiveOrInactive, setModalActiveOrInactive] = useState(false);
  const [activeOrInactive, setActiveOrInactive] = useState();
  const [page, setPage] = useState(1);
  const [pageConfirm, setPageConfirm] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizeConfirm, setPageSizeConfirm] = useState(10);
  const [itemId, setItemId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [search, setSearch] = useState("");
  const [selectedData, setSelectedData] = useState({});
  const [globalPropertiesItemIsNull, setGlobalPropertiesItemIsNull] =
    useState(false);
  const [insertedTable, setInsertedTable] = useState(false);
  const [dataType, setDataType] = useState('');
  const [maxLength, setMaxLength] = useState(255);
  const [payload, setPayload] = useState({});

  // Use Effect
  useEffect(() => {
    dispatch(getGlobalPropertiesDetail(id));
  }, [id]);
  useEffect(() => {
    dispatch(getAllTypeGlobalProperties());
    dispatch(getDataType());
  }, []);

  useEffect(() => {
    if (data_detail?.gpId) {
      form.setFieldsValue({
        type: data_detail?.gpTypeValue,
        name: data_detail?.name,
        desc: data_detail?.desc,
      });
      setTableData(propertiesItemData);
    }
  }, [id, form, data_detail]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_GLOBAL_PROPERTIES,
      breadcrumbName: "Global Properties",
    },
    {
      path: SYSTEM_SETUP_ROUTES.UPDATE_GLOBAL_PROPERTIES,
      breadcrumbName: "Update Global Properties",
    },
  ];

  // handle search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch(
      selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`
    );
  };

  // get search props
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search`}
          value={selectedKeys[0]}
          onFocus={
            dataIndex !== searchedColumn
              ? () => {
                setSelectedKeys([]);
              }
              : undefined
          }
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
      </div>
    ),
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color:
            filtered && dataIndex === searchedColumn ? "#1890ff" : undefined,
        }}
      />
    ),
    // onFilter: (value, record) =>
    //   record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleChangeDataType = (e) => {

    setDataType(e)
    if (e === "BOOL") {
      setMaxLength(1);
    } else {
      setMaxLength(255)
    }
  };
  const renderRules = (rule, dataIndex) => {
    if (rule === "INT") {
      return [
        ...formMessageRequired(dataIndex),
        { pattern: /^\d+$/, message: 'value only number' }

      ]
    } else if (rule === "BOOL") {
      return [
        ...formMessageRequired(dataIndex),
        { pattern: /[YyNn]/, message: 'Please enter with Y/N' },
        { max: maxLength, message: `Your input not valid. Max length ${maxLength}` }

      ]
    } else {
      return [
        ...formMessageRequired(dataIndex),
      ]
    }
  };

  const renderOnInput = (type, e) => {
    if (type === 'INT') {
      return e.target.value = e.target.value.replace(/\D/g, "");
    } else if (type === 'BOOL') {
      return e.target.value = e.target.value.replace(/[^YyNn]/g, "");
    } else {
      return e.target.value
    }
  }
  // Column Properties Item
  const column = [
    {
      title: "NO",
      dataIndex: "no",
      align: "center",
      width: "5%",
      render: (text, object, index) => {
        return modalConfirm === true
          ? (pageConfirm - 1) * pageSizeConfirm + index + 1
          : (page - 1) * pageSize + index + 1;
      },
    },
    {
      title: "KEY",
      dataIndex: "keyName",
      editable: true,
      required: true,
      inputType: "input_regex",
      rules: formMessageRequired('Key'),
      onInput: (e) => (e.target.value = e.target.value.toUpperCase()),
      key: "keyName",
      sorter: (a, b) => a.keyName?.localeCompare(b.keyName),
      ...getColumnSearchProps("keyName"),
    },
    {
      title: "VALUE",
      dataIndex: "value",
      editable: true,
      inputType: "input_password",
      key: "value",
      maxLength: maxLength,
      onInput: (e) => renderOnInput(dataType, e),
      rules: renderRules(dataType, 'Value'),
      sorter: (a, b) => a.value?.localeCompare(b.value),
      ...getColumnSearchProps("value"),
      render: (value, values) => {
        const { encrypt } = values;
        return (
          <p style={{ margin: 0 }}>
            {encrypt ? "*".repeat(value.length) : value}
          </p>
        );
      },
    },
    {
      title: "DATA TYPE",
      dataIndex: "dataType",
      editable: true,
      inputType: "select",
      align: "center",
      key: "dataType",
      required: true,
      onClick: (e) => handleChangeDataType(e),
      rules: formMessageRequired('Data Type'),
      sorter: (a, b) => {
        const aName =
          (data_Type_Detail &&
            data_Type_Detail
              .filter((item) => item.value === a.dataType)
              .find((item2) => item2.name)?.name) ||
          "";
        const bName =
          (data_Type_Detail &&
            data_Type_Detail
              .filter((item) => item.value === b.dataType)
              .find((item2) => item2.name)?.name) ||
          "";
        return aName.localeCompare(bName);
      },
      ...getColumnSearchProps("dataType"),
      options: dataTypeSelect,
      render: (dataType) => (
        <span>
          {data_Type_Detail &&
            data_Type_Detail
              .filter((a) => a.value === dataType)
              .find((b) => b.name)?.name}
        </span>
      ),
    },
    {
      title: "isEncrypt",
      dataIndex: "encrypt",
      editable: true,
      align: "center",
      inputType: "checkbox",
      value: "encrypt",
      render: (encrypt) => (
        <Checkbox className="action-checkbox" checked={encrypt} />
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      fixed: 'right',
      width: 120,
      sorter: (a, b) => a.status?.localeCompare(b.status),
      ...getColumnSearchProps("status"),
      render: (status) => (
        <div className={" flex justify-center"}>
          <StatusComponent colour={status}>{toTitleCase(status)}</StatusComponent>
        </div>
      ),
    },
  ];

  // Handle Confirmation
  const handleSave = async (formValue) => {
    try {
      let body;
      let validateValueObj;
      const modifiedArray = tableData.map((obj) => {
        const { key, ...rest } = obj;
        return {
          ...rest,
          id: rest.id || null,
          status: rest.status || null,
        };
      });
      const dataValue = {
        id: data_detail?.gpId,
        ...formValue,
        keyVal: modifiedArray,
      };
      body = dataValue
      setData(dataValue);
      if (tableData?.length === 0) {
        setModalConfirm(false);
        setGlobalPropertiesItemIsNull(true);
      } else {
        validateValueObj = { body: body, services: userHttpService, endPoint: '/v1/dbs/api/globalproperties/validate-update', type: 'update' }
        setPayload({
          body: body,
          validateValue: validateValueObj
        })
        await dispatch(validateCreateUpdate(validateValueObj))?.unwrap();
        setModalConfirm(true);
      }
    } catch (error) {
      setModalConfirm(false);
    }
  };

  const TypeConf = data_Type
    ?.filter((a) => a.value === data.type)
    .find((v) => v.name)?.name;

  // Validation Button Back
  const handleBack = () => {
    if (data === null || Object.keys(data).length === 0) {
      navigate(-1);
    } else {
      setModalBack(true);
    }
  };

  // Handle Active/Inactive
  const handleActiveOrInactive = (record) => {
    setModalActiveOrInactive(true);
    setSelectedData({ id: record });
    setActiveOrInactive("ACTIVE");
  };

  // Handle Confirm
  const handleConfirm = async () => {
    try {
      setModalConfirm(false);
      const bodyFinal = {
        ...data,
        keyVal: data?.keyVal?.map((a) => {
          return {
            ...a,
            id: a.id || null,
            status: a.status || null,
          };
        }),
      };
      const successBody = {
        title: `Successful`,
        description: "Your data has been updated.",
      };
      // setPayload({ body: bodyFinal, responseSuccess: successBody })
      await dispatch(
        updateGlobalProperties({ body: payload?.body, responseSuccess: successBody })
      )?.unwrap()

    } catch (error) {
      handleCloseModalError()
      setModalConfirm(false);
    }
  };

  // Handle Active/Inactive Request
  const handleOk = async (record) => {
    try {
      handleCloseModalError()
      setPayload({ id: record.id, statusData: activeOrInactive })
      await dispatch(inactiveGlobalProperties({ id: record.id, statusData: activeOrInactive }))?.unwrap()
      await dispatch(getGlobalPropertiesDetail(id))?.unwrap();
    } catch (error) {
      handleCloseModalError()
    }
  };

  const handleReset = () => {
    dispatch(getGlobalPropertiesDetail(id));
    dispatch(getDataType());
  };

  // handle cahnge page
  const handleChangePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };
  const handleChangeConfirm = (page, pageSize) => {
    setPageConfirm(page);
    setPageSizeConfirm(pageSize);
  };

  // handle pagination
  const paginationTableConfirm = (page, pageSize) => {
    return tableData?.slice((page - 1) * pageSize, page * pageSize);
  };

  const handleCloseModalError = () => {
    setModalActiveOrInactive(false);
  };


  const handleRetry = () => {
    handleCancelTryAgain();
    handleCloseModalError()
    if (error.action === "UPDATE_GLOBAL_PROPERTIES") {
      dispatch(updateGlobalProperties(payload))
    } else if (error?.action === 'INACTIVE_GLOBAL_PROPERTIES') {
      dispatch(inactiveGlobalProperties(payload));
    } else if (error?.action === 'GET_GLOBAL_PROPERTIES_DETAIL') {
      dispatch(getGlobalPropertiesDetail(id))
    } else {
      dispatch(getAllTypeGlobalProperties());
      dispatch(getDataType());
    }
  };

  const handleValidate = (values, _) => {
    let valid = true;
    const tempDataType = values?.dataType || "";
    const tempDataValue = values?.value || "";
    // console.log("masuk", tempDataType, tempDataValue);
    switch (tempDataType) {
      case "INT":
        let isnum = tempDataValue ? /^\d+$/.test(tempDataValue) : false;
        valid = isnum;
        break;
      case "BOOL":
        let tempBool = tempDataValue
          ? tempDataValue === "Y" || tempDataValue === "N" || tempDataValue === "y" || tempDataValue === "n"
          : false;
        valid = tempBool;
        break;
      default:
        break;
    }
    return valid;
  };

  const paginationTable = (typeData = "data") => {
    let result = [...tableData];
    if (searchedColumn) {
      const fixSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        if (searchedColumn === "dataType") {
          const data = item[searchedColumn] || "";
          const aName =
            (data_Type_Detail &&
              data_Type_Detail
                .filter((item) => item.value === data)
                .find((item2) => item2.name)?.name) ||
            "";
          return aName.toLowerCase().includes(fixSearchText);
        }
        return item[searchedColumn]?.toLowerCase().includes(fixSearchText);
      });
    }
    return typeData === "data" ? result : result.length;
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry)


  return (
    <Spin spinning={loading || isLoading}>
      <BreadCrumb routes={routes} />

      <Form layout="vertical" form={form} onFinish={handleSave}>
        <BaseContainer header={"global properties information"}>
          <div className="w-full grid grid-cols-2 gap-2">
            <Form.Item label={"Type"} name={"type"}>
              <Select disabled>
                {data_Type &&
                  data_Type.map((ta, index) => (
                    <Select.Option value={ta.value} key={index}>
                      {ta.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item label={"Properties Name"} name={"name"}>
              <Input
                disabled
                onInput={(e) =>
                  (e.target.value = e.target.value.trimStart())
                } />
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
                <InputComponent type="textarea" />
              </Form.Item>
            </div>
          </div>
        </BaseContainer>

        <div className="w-full">
          <TableInlineGlobalProperties
            header={"global properties item information"}
            tableData={paginationTable("data")}
            useSelect={true}
            usePagination={true}
            onDataChange={setTableData}
            current={page}
            pageSize={pageSize}
            onChangePage={handleChangePage}
            onSizeChanger={handleChangePage}
            cols={column}
            regex={{
              pattern: new RegExp("^(?:[dA-Z0-9-_]+)$"),
              message: "Please check your input!",
            }}
            required={{ required: true, message: "Please input your" }}
            scrollTable={{
              x: 1500,
              y: 300,
            }}
            actionButton={["update", "delete", "inactive"]}
            totalData={paginationTable("length")}
            onInactive={handleActiveOrInactive}
            checkInputBy={"keyName"}
            checkNameColumn={"KEY"}
            handleValidate={handleValidate}
            messageValidate="Make sure input Value column"
            actionFix={true}
            setInserted={setInsertedTable}
            setRule={setDataType}
            setMaxLenght={setMaxLength}
          />
        </div>

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
            disabled={insertedTable}
          >
            Back
          </ButtonComponent>

          <div className={"w-full flex justify-end gap-5"}>
            <Form.Item>
              <ButtonComponent
                icon={<SVGIcon name={`IconButtonReset`} width={24} />}
                type="submit"
                onClick={handleReset}
                disabled={insertedTable}
              >
                Reset
              </ButtonComponent>
            </Form.Item>
            <Form.Item>
              <ButtonComponent type="submit" htmlType={"submit"} disabled={insertedTable}>
                Save
              </ButtonComponent>
            </Form.Item>
          </div>
        </div>
      </Form>

      {/* Modal Confirmation */}
      <ModalCustom
        isOpen={modalConfirm}
        type={"confirmation"}
        header={"CONFIRMATION"}
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
          <span className="text-primary uppercase font-bold">
            global properties information
          </span>

          <div className="grid grid-cols-2 gap-5 pt-[30px]">
            <DetailText label="Type">{TypeConf}</DetailText>
            <DetailText label="Properties Name">{data.name}</DetailText>
            <div className="w-full col-span-2">
              <DetailText label="Description">{data.desc}</DetailText>
            </div>

            <span className="text-primary uppercase font-bold">
              properties item information
            </span>

            <div className="col-span-2 pt-[30px]">
              <TablePagination
                columns={column}
                pageSize={pageSizeConfirm}
                current={pageConfirm}
                dataSource={paginationTableConfirm(
                  pageConfirm,
                  pageSizeConfirm
                )}
                totalData={data?.keyVal?.length}
                onChange={handleChangeConfirm}
                onSizeChanger={handleChangePage}
              />
            </div>
          </div>
        </div>
      </ModalCustom>

      {/* Modal Confirmation Active/Inactive */}
      <ModalConfirm
        isOpen={modalActiveOrInactive}
        handleCancel={() => setModalActiveOrInactive(false)}
        handleOk={() => handleOk(selectedData)}
        width={activeOrInactive === "ACTIVE" ? 500 : 400}
      >
        <div className="w-full flex flex-col mt-10 justify-end">
          <div className={"w-full flex flex-row items-center px-10"}>
            <WarningOutlined
              style={{ color: "red" }}
              className={"text-4xl"}
            />
            <span className={"text-lg text-black font-bold h-auto mx-auto"}>
              {`Are you sure want to ${activeOrInactive === "ACTIVE" ? "inactivate" : "activate"
                }?`}
            </span>
          </div>
        </div>
      </ModalConfirm>

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
      <ModalAttention
        isOpen={globalPropertiesItemIsNull}
        handleCancel={() => setGlobalPropertiesItemIsNull(false)}
        handleOk={() => setGlobalPropertiesItemIsNull(false)}
        textList={"global properties item"}
      />

      {/* render try again */}
      {renderModal()}
    </Spin>
  );
};

export default GlobalPropertiesUpdate;
