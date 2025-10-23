import React, { useCallback, useEffect, useRef, useState } from "react";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { useSelector, useDispatch } from "react-redux";
import BaseContainer from "../../../../components/BaseContainer";
import {
  Alert,
  Button,
  Checkbox,
  Form,
  Image,
  Input,
  InputNumber,
  Spin,
  Tooltip,
  Upload,
} from "antd";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import ButtonComponent from "../../../../components/ButtonComponent";
import {
  ExclamationCircleOutlined,
  FilterOutlined,
  LeftOutlined,
  PlusOutlined,
  UploadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import SVGIcon from "../../../../assets/Icon/index";
import TextArea from "antd/lib/input/TextArea";
import TableInline from "../../../../components/Table/TableInline";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import EntityConfirmationLayout from "./EntityConfirmationLayout";
import { getBase64 } from "../../../../utils/getBase64";
import {
  checkAllowingFile,
  createEntity,
  getDetailEntity,
  getDetailTaxEntity,
  inactiveTax,
  updateEntity,
} from "../../../../redux/slices/system_setup/entity";
import moment from "moment";
import TaxIdentifierDetail from "./TaxIdentifierDetail";
import StatusComponent from "../../../../components/StatusComponent";
import {
  ModalAttention,
  ModalConfirm,
  ModalError,
} from "../../../../components/Modal/ModalPopUp";
import TableInlineCreateAndUpdate from "../../../../components/Table/TableInlineCreateAndUpdate";
import { dateFormat, dateFormatting, formMessageRequired, hasValue, toTitleCase } from "../../../../utils";
import { intToNPWP } from "../../../../utils/npwp";
import Highlighter from "react-highlight-words";
import InputComponent from "../../../../components/InputComponent";
import { useDynamicTableInlineHooks } from "../../../../components/Table/useDynamicTableInlineHooks";
import TableInlineEntity from "../../../../components/Table/TableInlineEntity";
import { clearBodyMessage, showModalError, validateCreateUpdate } from "../../../../redux/slices/general_slice";
import { getColumnSearchProps } from "../../../../utils/getColumnSearchProps";
import userHttpService from "../../../../redux/services/userHttpService";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";


const EntityForm = (props) => {
  const { type } = props;
  const {
    data_detail: data_detail,
    loading,
    data_tax,
    allow_file
  } = useSelector((state) => state.entity);
  const { bodyError, isLoading } = useSelector((state) => state?.general);

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [modalType, setModalType] = useState("");
  const [inactiveData, setInactiveData] = useState();
  const [idTax, setIdTax] = useState("");
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [messageValidate, setMessageValidate] = useState("");
  const [payload, setPayload] = useState({})


  const taxData = (data_detail?.data?.taxIdentifierList || []).map(
    (item, index) => {
      return {
        key: (index + 1).toString(),
        id: item.taxId,
        isMain: item.isMain,
        status: item.status,
        startDate: moment(item.startDate).clone(),
        endDate: item.endDate !== null ? moment(item.endDate).clone() : null,
        taxNumber: item.taxNumber,
        description: item.remark,
      };
    }
  );
  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState({});
  const [fileList, setFileList] = useState([]);
  const [base64Image, setBase64Image] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [fileName, setFileName] = useState("");
  const location = useLocation();
  const id = location?.state?.id;
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  // const [selectedData, setSelectedData] = useState({});
  const [editingCell, setIsEditingCell] = useState(false);
  const [validateFile, setValidateFile] = useState(false);
  const [acceptExtension, setAcceptExtension] = useState("");
  const [disabledButton, setDisabledButton] = useState(false);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  useEffect(() => {
    dispatch(checkAllowingFile());
    if (id) {
      dispatch(getDetailEntity(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id) {
      form.setFieldsValue({
        name: data_detail?.data.entityName,
        code: data_detail?.data.entityCode,
        email: data_detail?.data?.email,
        address: data_detail?.data?.address,
        phone: data_detail?.data?.phone?.substring(2),
        fax: data_detail?.data?.fax?.substring(2),
        description: data_detail?.data?.description,
        logo: data_detail?.data?.logo,
        urlImage: data_detail?.data?.urlLogo2,
      });
      setTableData(taxData);
      setMessageValidate("");
    }
    setAcceptExtension(allow_file?.data?.fileExt?.toLowerCase()?.split(',')?.map(item => `.${item}`)?.join(', '))
  }, [id, form, data_detail, editingCell, allow_file]);


  // handle confirmation
  const handleConfirmation = async (formValue) => {
    try {

      const isDuplicateTax = tableData?.map((item) => item?.taxNumber);
      let message = "";
      if (tableData?.length === 0) {
        message = "Please input your tax identifier"
      } else if (
        isDuplicateTax.some(function (item, idx) {
          return isDuplicateTax.indexOf(item) !== idx;
        })
      ) {
        let findRow = isDuplicateTax.filter((item, index) => {
          let ind = isDuplicateTax.findIndex(
            (item2) => item?.taxNumber === item2?.taxNumber
          );
          return index === ind;
        });
        message = `Tax identifier: ${findRow} is already exist`;
      } else if (
        tableData
          .filter((item) => item.status === "ACTIVE" || item?.status === "INACTIVE")
          .filter((item) => item["isMain"] === true).length > 1
      ) {
        message = `There cannot be more than one or null primary`;
      } else if (
        tableData?.filter((item) => item?.status === "ACTIVE").length === 0
      ) {
        message = "There must be one tax identifier with active status";
      } else if (
        tableData
          .filter((item) => item.status === "ACTIVE")
          .filter((item) => item["isMain"] === true).length !== 1
      ) {
        message = "There cannot be more than one or null primary";
      } else if (tableData.some((item) => !item?.taxNumber || !item?.startDate)) {
        message = "Data Tax Identifier and Start Date must be filled";
      }

      if (message || tableData?.length === 0) {
        const errorBody = {
          title: "Failed",
          description: `Your data was not created. ${message}. Please try again.`,
        };
        dispatch(showModalError(errorBody));
      } else {
        let body;
        let validateValueObj;

        const modifiedArray = tableData.map((obj) => {
          const { key, ...rest } = obj;
          return {
            ...rest,
            startDate: moment(obj?.startDate).format("DD MMM YYYY"),
            endDate: obj?.endDate
              ? moment(obj?.endDate).format("DD MMM YYYY")
              : null,
          };
        });
        let image = base64Image.split(",")[1];

        if (type === 'update') {
          body = {
            ...formValue,
            id: id,
            phone: hasValue(formValue.phone) === false || formValue.phone === "-" ? null : `62${formValue.phone}`,
            fax: hasValue(formValue.fax) === false || formValue?.fax === "-" ? null : `62${formValue.fax}`,
            fileName: hasValue(fileName) ? fileName : data_detail?.data?.logo,
            logo: image,
            taxIdentifier: modifiedArray,
          }

          validateValueObj = { body: body, services: userHttpService, endPoint: '/v1/dbs/api/entity/validate-update', type }
        } else {
          body = {
            ...formValue,
            phone: hasValue(formValue?.phone) ? `62${formValue.phone}` : '',
            fax:
              hasValue(formValue?.fax)
                ? `62${formValue.fax}`
                : "",
            taxIdentifier: modifiedArray,
            logo: image,
            fileName: fileName,
          }
          validateValueObj = { body: body, services: userHttpService, endPoint: '/v1/dbs/api/entity/validate-create', type }
        }

        setPayload({
          body: body,
          validateValue: validateValueObj
        });

        await dispatch(validateCreateUpdate(validateValueObj))?.unwrap()
        const data = {
          ...formValue,
          phone: hasValue(formValue?.phone) ? `62${formValue.phone}` : '',
          fax:
            hasValue(formValue?.fax)
              ? `62${formValue.fax}`
              : "",
          taxIdentifier: modifiedArray,
          logo: image,
          fileName: fileName,
        };
        setData(data);
        setOpenModal(true);
        setModalType("confirmation");
        setMessageValidate("");
      }
    } catch (error) {
      setOpenModal(false);
      setModalType("");
      setMessageValidate("");
    }
  };
  const routes = [
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_ENTITY,
      breadcrumbName: "Entity",
    },
    {
      path: "",
      breadcrumbName: type === "create" ? "Create Entity" : "Update Entity",
    },
  ];
  const column = [
    {
      title: "NO",
      dataIndex: "no",
      width: 60,
      render: (text, object, index) => {
        return (page - 1) * pageSize + index + 1;
      },
    },
    {
      title: "TAX IDENTIFIER",
      dataIndex: "taxNumber",
      inputType: "text",
      editable: true,
      align: "left",
      sorter: (a, b) => a.taxNumber - b.taxNumber,
      required: true,
      maxLength: 16,
      onInput: (e) => (e.target.value = e.target.value.replace(/\D/g, "")),
      rules: [
        {
          required: true,
          message: "Please input your tax identifier",
        },
        {
          min: 16,
          message: "Tax identifier must be 16 characters",
        },
      ],
      ...getColumnSearchProps(
        "taxNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,

      ),
      render: (text) => intToNPWP(text),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      editable: true,
      inputType: "date",
      align: "center",
      width: 170,
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
      required: true,
      rules: [
        {
          required: true,
          message: "Please input your start date",
        },
      ],
      ...getColumnSearchProps(
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (startDate) => moment(startDate).format("DD MMM YYYY"),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      editable: true,
      inputType: "date",
      align: "center",
      width: 170,
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
      ...getColumnSearchProps(
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (endDate) =>
        endDate ? moment(endDate).format("DD MMM YYYY") : null,
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      inputType: "description",
      editable: true,
      sorter: (a, b) => a.description?.localeCompare(b.description),
      ...getColumnSearchProps(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "description" ? (
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
        ) : (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
    },
    {
      title: "PRIMARY",
      dataIndex: "isMain",
      editable: true,
      align: "center",
      inputType: "checkbox",
      width: 120,
      sorter: (a, b) => (a.isMain === b.isMain ? 0 : a.isMain ? -1 : 1),
      ...getColumnSearchProps(
        "isMain",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'boolean'
      ),
      render: (isMain) => <Checkbox checked={isMain} />,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      editable: false,
      width: 120,
      fixed: 'right',
      sorter: (a, b) => a.status?.localeCompare(b.status),
      ...getColumnSearchProps(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'status'
      ),
      render: (status, i, render) => {
        // const statusRender = i?.isMain === true ? 'ACTIVE' : 'INACTIVE'
        return (
          <div className={" flex justify-center"}>
            <StatusComponent colour={status}>{toTitleCase(status)}</StatusComponent>
          </div>
        );
      },
    },
  ];

  const columnCreate = column.filter((item) => {
    return item?.dataIndex !== "status";
  });
  const getFileExtension = (file) => {
    return file.slice((file.lastIndexOf(".") - 1 >>> 0) + 2)?.toLowerCase();
  };

  const handleChange = ({ fileList }) => {
    if (validateFile) {
      setFileList(fileList);
    } else {
      setFileList([])
    }
  };

  const handleRemove = () => {
    setFileList([]);
    setPreviewImage("");
    setFileName("");
    setBase64Image("");
  };
  const handleSave = async () => {
    try {
      if (type === "update") {
        const body = {
          ...data,
          id: id,
          phone: data.phone === "-" ? null : data.phone,
          fax: data.fax === "-" ? null : data.fax,
          fileName:
            data.fileName === "" ? data_detail?.data?.logo : data?.fileName,
          logo: data?.logo === undefined ? null : data?.logo,
        };
        // console.log(body,' in save');
        await dispatch(updateEntity(payload?.body))?.unwrap();
        setOpenModal(false);
      } else {
        // const body = {
        //   ...data,
        //   phone: data.phone === "-" ? null : data.phone,
        //   fax: data.fax === "-" ? null : data.fax,
        // };
        await dispatch(createEntity(payload?.body))?.unwrap();
        setOpenModal(false);
      }
    } catch (error) {
      setOpenModal(false);
    }
  };
  const handleDetail = (id) => {
    dispatch(getDetailTaxEntity(id));
    setOpenModal(true);
    setModalType("detail");
  };
  const handleInactive = (record) => {
    setModalType("inactive");
    setIdTax(record);
    setInactiveData(record?.status);
  };

  const handleOk = (key) => {
    const updatedTableData = tableData.map((item) => {
      if (item.id === key?.id) {
        return {
          ...item,
          status: item?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
          isMain: false,
        };
      }
      return item;
    });

    setTableData(updatedTableData);
    setModalType("");
  };

  const handleReset = () => {
    form.resetFields();
    setFileList([]);
    if (type === "create") {
      form.resetFields();
      setTableData([]);
    } else {
      setBase64Image("");
      dispatch(getDetailEntity(id));
      setFileList([]);
      setFileName("");
    }
  };
  const handleDisableDate = (current) => {
    return moment() >= current;
  };

  const handleChangePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const isValueSame = (row, status, key) => {
    if (
      tableData.filter((item) => item.taxNumber === row.taxNumber).length > 1
    ) {
      setMessageValidate("Double tax identifier");
      return false;
    }
    return true;
  };


  // handle retry
  const handleRetry = () => {
    handleCancelTryAgain()
    if (bodyError?.action === "CREATE_ENTITY") {
      dispatch(createEntity(payload?.body))
    } else if (bodyError?.action === "UPDATE_ENTITY") {
      dispatch(updateEntity(payload?.body))
    } else if (bodyError?.action === "VALIDATE_CREATE_UPDATE") {
      dispatch(validateCreateUpdate(payload?.validateValue))
    } else {
      dispatch(getDetailEntity(id))
    }
  };


  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  return (
    <LayoutMenu>
      <Spin spinning={loading || isLoading} >
        <BreadCrumb routes={routes} />
        <Form form={form} layout={"vertical"} onFinish={handleConfirmation}>
          <div className={"my-5"}>
            <BaseContainer header={"ENTITY INFORMATION"}>
              <div className="w-full flex-col justify-between">
                <div className={"w-full flex gap-4"}>
                  <Form.Item
                    label={"Entity Name"}
                    name={"name"}
                    className={"w-full"}
                    rules={formMessageRequired("Entity Name")}
                  >
                    <InputComponent disabled={editingCell} />
                  </Form.Item>
                  <Form.Item
                    label={"Entity Code"}
                    name={"code"}
                    className={"w-full"}
                    rules={formMessageRequired("Entity Code")}
                  >
                    <InputComponent
                      disabled={
                        type === "create" ||
                          form.getFieldValue("code") === null ||
                          form.getFieldValue("code") === ""
                          ? false
                          : true
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label={"Entity Email"}
                    name={"email"}
                    className={"w-full"}
                    rules={[...formMessageRequired("Email"), {
                      type: 'email',
                      message: 'The input is not valid E-mail!',
                    }]}
                  >
                    <InputComponent maxLength={50} />
                  </Form.Item>
                </div>
                <div className={"w-full flex gap-4"}>
                  <Form.Item
                    label={"Address"}
                    name={"address"}
                    className={"w-full"}
                    rules={formMessageRequired("Address")}
                  >
                    <InputComponent />
                  </Form.Item>
                  <Form.Item
                    label={"Phone Number"}
                    name={"phone"}
                    className={"w-full"}
                    rules={formMessageRequired("Phone Number")}
                  >
                    <Input
                      allowClear
                      addonBefore={"62"}
                      maxLength={11}
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/[^\d]|^0+/g, ''))
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label={"Fax Number"}
                    name={"fax"}
                    className={"w-full"}
                  >
                    <Input
                      allowClear
                      addonBefore={"62"}
                      maxLength={12}
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/[^\d]|^0+/g, ''))
                      }
                      style={{
                        borderRadius: "6px",
                        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                      }}
                    />
                  </Form.Item>
                </div>
                <div className={"w-full flex gap-4"}>
                  <Form.Item
                    label={"Description"}
                    name={"description"}
                    className={"w-full"}
                  >
                    <InputComponent type="textarea" />
                  </Form.Item>
                </div>
                <div className={"w-full flex gap-4"}>
                  <Form.Item
                    name="logo"
                    label={"Upload Logo"}
                    rules={formMessageRequired(
                      "logo",
                      fileList?.length > 0 && data_detail?.data?.logo !== null
                        ? false
                        : true
                    )}
                    className="w-full"
                  >
                    <Upload
                      fileList={fileList}
                      accept={acceptExtension}
                      listType="picture"
                      beforeUpload={async (file) => {
                        const allowed_file = allow_file?.data?.fileExt?.toLowerCase()?.split(',');
                        const file_extension = getFileExtension(file?.name);
                        const max_allowed_file = allow_file?.data?.size;
                        const fileInMb = file.size / (1024 * 1024);
                        if (allowed_file?.includes(file_extension) && fileInMb < max_allowed_file) {
                          setValidateFile(true)
                          setFileName(file?.name);
                          const base64 = await getBase64(file);
                          const regex = "";
                          setBase64Image(base64.replace(regex, ""));
                          setFileList([...fileList, { ...file, percent: 0 }]);
                        } else {
                          if (allowed_file?.includes(file_extension) === false) {
                            setValidateFile(false)
                            const errorBody = {
                              title: "Failed",
                              description: `Format file not valid`,
                            };
                            dispatch(showModalError(errorBody));
                          }
                          if (allowed_file?.includes(file_extension) === true && fileInMb > max_allowed_file) {
                            setValidateFile(false)
                            const errorBody = {
                              title: "Failed",
                              description: `File size not valid, file too large!`,
                            };
                            dispatch(showModalError(errorBody));
                          }
                        }
                        return false;
                      }}
                      onChange={handleChange}
                      onRemove={handleRemove}
                      className="flex flex-wrap justify-start items-center gap-5 w-full"
                      maxCount={1}
                    >
                      <div className="flex justify-center items-center">
                        <Button
                          icon={<UploadOutlined style={{ fontSize: "24px" }} />}
                        >
                          Choose File
                        </Button>
                        {fileList.length === 0 &&
                          data_detail?.data?.logo === null ? (
                          <span className={"text-gray-500 text-xs ml-2"}>
                            {" "}
                            No Image Choosen
                          </span>
                        ) : (
                          <span className={"text-gray-500 text-xs ml-2"}>
                            {/* {" "} */}
                            {type === "update" ? (
                              <Image
                                src={data_detail?.data?.urlLogo2}
                                width={80}
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : null}
                          </span>
                        )}
                      </div>
                    </Upload>
                  </Form.Item>
                  <Form.Item hidden name={"urlImage"} />
                </div>
              </div>
            </BaseContainer>
          </div>
          <div className={"my-5"}>
            <TableInlineEntity
              header={"TAX IDENTIFIER"}
              tableData={tableData}
              onDataChange={setTableData}
              cols={type === "create" ? columnCreate : column}
              mode={type}
              disableDate={handleDisableDate}
              scrollTable={{ x: 1500, y: 500 }}
              usePagination={true}
              useSelect={true}
              totalData={tableData?.length}
              pageSize={pageSize}
              current={page}
              onDetail={handleDetail}
              onInactive={handleInactive}
              onChangePage={handleChangePage}
              onSizeChanger={handleChangePage}
              actionButton={
                type === "create"
                  ? ["delete", "update"]
                  : ["detail", "update", "delete", "inactive"]
              }
              setIsEditingCell={setIsEditingCell}
              checkInputBy={[
                { checkInput: "taxNumber", message: "Tax Number is exist" },
                { checkInput: "isMain", message: "Primary must be one" },
              ]}
              handleValidate={isValueSame}
              setInserted={setDisabledButton}
            // messageValidate={messageValidate}
            // setMessageValidate={setMessageValidate}
            />
          </div>
          <div className={"w-full my-5 flex gap-5"}>
            <ButtonComponent
              icon={
                <LeftOutlined style={{ fontSize: "24px", color: "#fff" }} />
              }
              type="submit"
              onClick={() => setModalBack(true)}
              disabled={disabledButton}
            >
              Back
            </ButtonComponent>
            <div className={"w-full flex justify-end gap-2"}>
              <ButtonComponent
                icon={
                  <SVGIcon
                    name={
                      type === "update" ? `IconButtonReset` : `IconButtonClear`
                    }
                    width={24}
                  />
                }
                type="submit"
                onClick={handleReset}
                disabled={disabledButton}
              >
                {type === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              <Form.Item>
                <ButtonComponent type="submit" htmlType={"submit"} disabled={disabledButton}>
                  Save
                </ButtonComponent>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Spin>
      <ModalCustom
        isOpen={openModal}
        handleCancel={() => setOpenModal(false)}
        type={modalType}
        header={
          modalType === "confirmation"
            ? "CONFIRMATION"
            : "DETAIL TAX IDENTIFIER"
        }
        width={1000}
      >
        {modalType === "confirmation" ? (
          <>
            <EntityConfirmationLayout
              data={payload?.body}
              cols={type === "create" ? columnCreate : column}
              type={type}
            />
            <div className={"w-full flex justify-end my-5 gap-2"}>
              <ButtonComponent
                type={"default"}
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                type={"submit"}
                border={false}
                onClick={handleSave}
              >
                Confirm
              </ButtonComponent>
            </div>
          </>
        ) : (
          <>
            <TaxIdentifierDetail data={data_tax} />
            <div className={"w-full flex justify-end my-5 gap-2"}>
              <ButtonComponent
                icon={
                  <LeftOutlined style={{ fontSize: "24px", color: "#fff" }} />
                }
                type={"submit"}
                onClick={() => setOpenModal(false)}
                border={false}
              >
                Back
              </ButtonComponent>
            </div>
          </>
        )}
      </ModalCustom>
      <ModalConfirm
        isOpen={modalType === "inactive"}
        handleCancel={() => setModalType("")}
        handleOk={() => handleOk(idTax)}
      >
        <div className="w-full flex flex-col mt-10 justify-end">
          <div className={"w-full flex flex-row items-center px-10"}>
            <WarningOutlined style={{ color: "red" }} className={"text-4xl"} />
            <span className={"text-lg text-black font-bold h-auto mx-auto"}>
              {`Are you sure want to ${inactiveData === "ACTIVE" ? "inactivate" : "activate"
                }?`}
            </span>
          </div>
        </div>
      </ModalConfirm>

      {/* modal back */}
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
      {/** Modal Retry */}
      {renderModal()}
    </LayoutMenu>
  );
};

export default EntityForm;
