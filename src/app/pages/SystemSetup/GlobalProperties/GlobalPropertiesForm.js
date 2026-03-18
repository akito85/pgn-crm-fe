import React, { useState, useEffect } from "react";
import { Form, Spin, Select, Input, Checkbox } from "antd";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import {
  createGlobalProperties,
  getAllTypeGlobalProperties,
  getDataType,
} from "../../../../redux/slices/system_setup/globalProperties";
import ButtonComponent from "../../../../components/ButtonComponent";
import {
  FilterOutlined,
  LeftOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import SVGIcon from "../../../../assets/Icon/index";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import DetailText from "../../../../components/DetailText";
import TablePagination from "../../../../components/TablePagination";
import {
  ModalAttention,
  ModalConfirm,
} from "../../../../components/Modal/ModalPopUp";
import { useRef } from "react";
import Highlighter from "react-highlight-words";
import InputComponent from "../../../../components/InputComponent";
import SelectComponent from "../../../../components/SelectComponent";
import TableInlineGlobalProperties from "./TableInlineGlobalProperties";
import { formMessageRequired } from "../../../../utils";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import userHttpService from "../../../../redux/services/userHttpService";
import { validateCreateUpdate } from "../../../../redux/slices/general_slice";

const GlobalPropertiesForm = () => {
  // Selector
  const { loading, data_Type, data_Type_Detail } = useSelector(
    (state) => state.globalProperties
  );
  const { bodyError: error, isLoading } = useSelector(state => state?.general);

  // Declaration
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
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
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageConfirm, setPageConfirm] = useState(1);
  const [pageSizeConfirm, setPageSizeConfirm] = useState(10);
  const [globalPropertiesItemIsNull, setGlobalPropertiesItemIsNull] =
    useState(false);
  // const [bodyError, setBodyError] = useState({});
  const [insertedTable, setInsertedTable] = useState(false);
  const [dataType, setDataType] = useState('');
  const [maxLength, setMaxLength] = useState(255);
  const [payload, setPayload] = useState({});
  // useEffect
  useEffect(() => {
    dispatch(getAllTypeGlobalProperties());
    dispatch(getDataType());
  }, []);

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
      path: SYSTEM_SETUP_ROUTES.CREATE_GLOBAL_PROPERTIES,
      breadcrumbName: "Create Global Properties",
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
    // onFilter: (value, record) => {
    //   if (dataIndex === "dataType") {
    //     const data = record[dataIndex] || "";
    //     const aName =
    //       (data_Type_Detail &&
    //         data_Type_Detail
    //           .filter((item) => item.value === data)
    //           .find((item2) => item2.name)?.name) ||
    //       "";
    //     return aName.toLowerCase().includes(value.toLowerCase());
    //   }
    //   return record[dataIndex]
    //     ?.toString()
    //     .toLowerCase()
    //     .includes(value.toLowerCase());
    // },
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
        ...formMessageRequired('value'),
        { pattern: /^\d+$/, message: 'value only number' }

      ]
    } else if (rule === "BOOL") {
      return [
        ...formMessageRequired('value'),
        { pattern: /[YyNn]/, message: 'Please enter with Y/N' },
        { max: maxLength, message: `Your input not valid. Max length ${maxLength}` }
      ]
    } else {
      return [
        ...formMessageRequired('value'),
        { pattern: /^[^\s]+$/, message: 'Username contains space' }
      ]
    }
  }

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
      inputType: "input_regex",
      onInput: (e) => (e.target.value = e.target.value.toUpperCase()),
      editable: true,
      key: "keyName",
      required: true,
      rules: formMessageRequired('Key'),
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
      render: (encrypt) => (
        <Checkbox className="action-checkbox" checked={encrypt} />
      ),
    },
  ];

  // handle Confirm
  const handleConfirm = async () => {
    try {
      setModalConfirm(false);
      const successBody = {
        title: `Successful`,
        description: "Your data has been created.",
      };
      setPayload({ body: data, responseSuccess: successBody })
      await dispatch(
        createGlobalProperties({ body: payload?.body, responseSuccess: successBody })
      )?.unwrap()
    } catch (error) {
      handleCloseModalError()
    }

  };

  // Handle Confirmation
  const handleSave = async (formValue) => {
    try {
      let body;
      let validateValueObj;
      const modifiedArray = tableData.map((obj) => {
        const { key, ...rest } = obj;
        return rest;
      });
      if (tableData.length === 0) {
        setModalConfirm(false);
        setGlobalPropertiesItemIsNull(true);
      } else {
        body = {
          ...formValue,
          keyVal: modifiedArray
        }
        validateValueObj = { body: body, services: userHttpService, endPoint: '/v1/dbs/api/globalproperties/validate-create', type: 'create' }
        setPayload({
          body: body,
          validateValue: validateValueObj
        })
        setData(body);
        await dispatch(validateCreateUpdate(validateValueObj))?.unwrap()
        setModalConfirm(true);
      }
    } catch (error) {
      setModalConfirm(false);
    }
  };

  // Find data from data type
  const TypeConf = data_Type
    ?.filter((a) => a.value === data.type)[0]?.name

  // Validation Button Back
  const handleBack = () => {
    if (
      (data === null && form.getFieldValue() === null) ||
      (Object.keys(data).length === 0 &&
        Object.keys(form.getFieldValue()).length === 0)
    ) {
      navigate(-1);
    } else {
      setModalBack(true);
    }
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

  const paginationTableConfirm = (page, pageSize) => {
    return tableData?.slice((page - 1) * pageSize, page * pageSize);
  };

  const handleCloseModalError = () => {
    form.resetFields();
    setModalConfirm(false);
  };


  const handleRetry = () => {
    handleCancelTryAgain()
    if (error?.action === "CREATE_GLOBAL_PROPERTIES") {
      dispatch(createGlobalProperties(payload?.body))
    } else {
      dispatch(validateCreateUpdate(payload?.validateValue))
    }
  };

  const handleValidate = (values, _) => {
    let valid = true;
    const tempDataType = values?.dataType || "";
    const tempDataValue = values?.value || "";
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
    <LayoutMenu>
      <Spin spinning={loading || isLoading}>
        <BreadCrumb routes={routes} />

        <Form layout="vertical" form={form} onFinish={handleSave}>
          <BaseContainer header={"global properties information"}>
            <div className="w-full grid grid-cols-2 gap-2">
              <Form.Item
                label={"Type"}
                name={"type"}
                rules={[{ required: true, message: "Please input your Type!" }]}
              >
                <SelectComponent>
                  {data_Type &&
                    data_Type.map((ta, index) => (
                      <Select.Option value={ta.value} key={index}>
                        {ta.name}
                      </Select.Option>
                    ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item
                label={"Properties Name"}
                name={"name"}
                rules={[
                  {
                    required: true,
                    message: "Please input your Properties Name!",
                  },
                ]}
              >
                <Input
                  onInput={(e) =>
                    (e.target.value = e.target.value.trimStart())
                  }
                />
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
              x: 1000,
              y: 300,
            }}
            actionButton={["update", "delete"]}
            totalData={paginationTable("length")}
            checkInputBy={"keyName"}
            checkNameColumn={"KEY"}
            handleValidate={handleValidate}
            messageValidate="Make sure input Value column"
            actionFix={true}
            setInserted={setInsertedTable}
            setRule={setDataType}
            setMaxLenght={setMaxLength}
          />

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
                  icon={<SVGIcon name="IconButtonClear" width={24} />}
                  type="submit"
                  onClick={() => {
                    form.resetFields();
                    setTableData([]);
                  }}
                  disabled={insertedTable}
                >
                  Clear
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

        {/* Modal Confirmation*/}
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

        {/* Modal Back*/}
        <ModalConfirm
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
          width={400}
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
        {/** Modal Retry */}
        {renderModal()}
      </Spin>
    </LayoutMenu>
  );
};

export default GlobalPropertiesForm;
