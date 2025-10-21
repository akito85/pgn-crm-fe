import { Form, Select, Spin } from "antd";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import InputComponent from "../../../../../components/InputComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../assets/Icon/index";
import SelectComponent from "../../../../../components/SelectComponent";
import {
  formMessageRequired,
  hasValue,
  renderColumn,
} from "../../../../../utils";
import {
  createContact,
  getDetailContact,
  getInputType,
  getListJob,
  getListPosition,
  resetDataDetail,
  updateContact,
  getContactType,
  getCountryCode,
  getCountryZone,
} from "../../../../../redux/slices/account_management/MasterData/contact_slice";
import { getColumnSearchProps } from "../../../../../utils/getColumnSearchProps";
import DetailText from "../../../../../components/DetailText";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import TablePagination from "../../../../../components/TablePagination";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import {
  clearBodyMessage,
  showModalError,
  validateCreateUpdate,
} from "../../../../../redux/slices/general_slice";
import ModalBack from "../../../../../components/Modal/ModalBack";
import { onInputUpperCase } from "../../../AccountManagement/Utils";
import accountManagementService from "../../../../../redux/services/account_management/accountManagementService";
import TableContact from "../../../../../components/Table/Contact/TableContact";
import { sorterFunction } from "../../../../../utils/sorterFunction";

const FormContact = ({ type }) => {
  const {
    loading,
    data_job,
    data_position,
    data_detail,
    data_contactType,
    data_inputType,
    data_country_code,
    data_country_zone,
    temp_country_zone,
  } = useSelector((state) => state.contact);

  const { bodyError, isLoading } = useSelector((state) => state?.general);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [formContact] = Form.useForm();
  // use state
  const [modalBack, setModalBack] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [body, setBody] = useState({});
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumnInlane, setSearchedColumnInlane] = useState("");
  const [searchTextInlane, setSearchTextInlane] = useState("");
  const [search, setSearch] = useState({});
  const searchInput = useRef(null);
  const [modalError, setModalError] = useState(false);
  const [inputTypeRow, setInputTypeRow] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [uniqueCountryZone, setUniqueCountryZone] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);
  const [bodySend, setBodySend] = useState({});
  // handle change country zone
  const dispatchCountryZone = useCallback(
    (e) => {
      dispatch(getCountryZone(e));
    },
    [dispatch],
  );

  // assert data
  const assert = useCallback(
    (data) => {
      if (data) {
        form.setFieldsValue({
          firstName: data?.firstName,
          middleName: data?.middleName,
          lastName: data?.lastName,
          jobId: data?.jobId,
          positionId: data?.positionId,
        });
        setDataTable(
          data?.contactDetail?.map((item, index) => {
            if (hasValue(item?.prefix1)) {
              dispatchCountryZone(item?.prefix1);
            }
            return {
              key: (index + 1).toString(),
              type: item?.type,
              inputType: item?.inputType,
              contactDetailId: item?.contactDetailId,
              prefix_1: hasValue(item?.valueDetail?.prefix1)
                ? item?.valueDetail?.prefix1
                : null,
              prefix_2: hasValue(item?.valueDetail?.prefix2)
                ? item?.valueDetail?.prefix2
                : null,
              sufix: hasValue(item?.valueDetail?.sufix)
                ? item?.valueDetail?.sufix
                : null,
              value: hasValue(item?.valueDetail?.value)
                ? item?.valueDetail?.value
                : null,
              fullValue: item?.fullValue,
              values: [
                {
                  prefix_1: hasValue(item?.valueDetail?.prefix1)
                    ? item?.valueDetail?.prefix1
                    : null,
                  prefix_2: hasValue(item?.valueDetail?.prefix2)
                    ? item?.valueDetail?.prefix2
                    : null,
                  sufix: hasValue(item?.valueDetail?.sufix)
                    ? item?.valueDetail?.sufix
                    : null,
                  value: hasValue(item?.valueDetail?.value)
                    ? item?.valueDetail?.value
                    : null,
                },
              ],
            };
          }),
        );
      }
    },
    [form, dispatchCountryZone],
  );

  // use effect
  useEffect(() => {
    dispatch(resetDataDetail());
    dispatch(getListJob());
    dispatch(getListPosition());
    dispatch(getContactType());
    dispatch(getInputType());
    dispatch(getCountryCode());
    if (location?.state?.id) {
      dispatch(getDetailContact(location?.state?.id));
    }
  }, [dispatch, location]);

  // asserting data
  useEffect(() => {
    if (data_detail && type === "update") {
      assert(data_detail);
    }
  }, [data_detail, assert, type]);

  // trigger modal try again
  useEffect(() => {
    if (bodyError?.response?.data?.code === 500) {
      setModalError(true);
    }
  }, [bodyError]);

  // handle duplicate country zone ddl
  useEffect(() => {
    if (temp_country_zone?.length > 0) {
      const tempObject = {};
      temp_country_zone.forEach((item) => {
        tempObject[item.id] = item;
      });
      const uniqueArray = Object.values(tempObject);

      setUniqueCountryZone(uniqueArray);
    }
  }, [temp_country_zone]);

  // handle cancel
  const handleCancel = () => {
    setOpenConfirmation(false);
    setModalBack(false);
  };

  // handle confirmation
  const handleFinish = async (formValue) => {
    try {
      let validateValueObj;
      if (dataTable?.length === 0) {
        const errorBody = {
          title: "Attention",
          description: `Your data was not created. Please input your contact detail. Please try again.`,
        };
        dispatch(showModalError(errorBody));
      } else {
        // concating contact name
        const contactNameValue = `${formValue.firstName.trim()}${
          formValue.middleName ? ` ${formValue.middleName.trim()}` : ""
        }${formValue.lastName ? ` ${formValue.lastName.trim()}` : ""}`;

        let bodyByTypeForm;
        if (type === "create") {
          bodyByTypeForm = {
            ...formValue,
            contactName: contactNameValue,
            viewDetails: dataTable?.map((item, index) => {
              return {
                type: item?.type?.value,
                inputType: item?.inputType?.value,
                value: hasValue(item?.values[0]?.value)
                  ? item?.values[0]?.value
                  : null,
                prefix1: hasValue(item?.values[0]?.prefix_1?.value)
                  ? item?.values[0]?.prefix_1?.value
                  : null,
                prefix2: hasValue(item?.values[0]?.prefix_2?.value)
                  ? item?.values[0]?.prefix_2?.value
                  : null,
                sufix: hasValue(item?.values[0]?.sufix)
                  ? item?.values[0]?.sufix
                  : null,
              };
            }),
          };
          validateValueObj = {
            body: bodyByTypeForm,
            services: accountManagementService,
            endPoint: "/v1/dbs/api/contact/validate-create",
            type,
          };
          // set data body to send create
          setBodySend(bodyByTypeForm);
        } else {
          bodyByTypeForm = {
            ...formValue,
            contactId: location?.state?.id,
            contactName: contactNameValue,
            viewDetails: dataTable?.map((item, index) => {
              return {
                contactDetailId: hasValue(item?.contactDetailId)
                  ? item?.contactDetailId
                  : null,
                type: item?.type?.value,
                inputType: item?.inputType?.value,
                value: hasValue(item?.values[0]?.value)
                  ? item?.values[0]?.value
                  : null,
                prefix1: hasValue(item?.values[0]?.prefix_1?.value)
                  ? item?.values[0]?.prefix_1?.value
                  : null,
                prefix2: hasValue(item?.values[0]?.prefix_2?.value)
                  ? item?.values[0]?.prefix_2?.value
                  : null,
                sufix: hasValue(item?.values[0]?.sufix)
                  ? item?.values[0]?.sufix
                  : null,
              };
            }),
          };

          validateValueObj = {
            body: bodyByTypeForm,
            services: accountManagementService,
            endPoint: "/v1/dbs/api/contact/validate-update",
            type,
          };
          // set data body to send update
          setBodySend(bodyByTypeForm);
        }
        await dispatch(validateCreateUpdate(validateValueObj))?.unwrap();
        setOpenConfirmation(true);
        setBody({
          body: bodyByTypeForm,
          displayDataTableConfirm: dataTable,
          validateValue: validateValueObj,
        });
      }
    } catch (error) {
      setOpenConfirmation(false);
    }
  };

  // handle save
  const handleSave = async () => {
    try {
      if (type === "create") {
        await dispatch(createContact(bodySend))?.unwrap();
      } else {
        await dispatch(updateContact(bodySend))?.unwrap();
      }
      dispatch(resetDataDetail());
      setOpenConfirmation(false);
    } catch (error) {
      setOpenConfirmation(false);
      console.log(error);
    }
  };

  // handle reset
  const handleReset = () => {
    if (type === "create") {
      form.resetFields();
      setDataTable([]);
    } else {
      assert(data_detail);
    }
  };

  // options
  const dataContactType = data_contactType?.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  const dataCountryZone = uniqueCountryZone?.map((item) => {
    return {
      value: item.id,
      label: item.text,
    };
  });

  const dataCountryCode = data_country_code?.map((item) => {
    return {
      key: item?.code,
      value: item.id,
      label: item.name,
    };
  });

  const dataInputType = data_inputType?.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  // render data options
  const renderDataOptions = useCallback(
    (dataOptions) => {
      const obj = {
        741: [748, 749], // phone = phone, mobile phone
        743: [750], // email = email
        742: [750], // pgn mobile (email) = email
        746: [749], // Whatsapp = mobile phone
        747: [749], // pgn mobile (phone) = mobile phone
        745: [751], // fax = fax
        744: [752], // url = free
      };
      return dataOptions?.filter((a) => obj[selectedType]?.includes(a.value));
    },
    [selectedType],
  );

  // handle change type
  const handleChangeType = useCallback(
    (e) => {
      setSelectedType(e?.value);

      if (e?.value === 744) {
        formContact?.setFieldsValue({
          inputType: dataInputType?.find((item) => item?.value === 752),
        });
      } else if (e?.value === 743 || e?.value === 742) {
        formContact?.setFieldsValue({
          inputType: dataInputType?.find((item) => item?.value === 750),
        });
      } else if (e?.value === 747 || e?.value === 746) {
        formContact?.setFieldsValue({
          inputType: dataInputType?.find((item) => item?.value === 749),
        });
      } else if (e?.value === 745) {
        formContact?.setFieldsValue({
          inputType: dataInputType?.find((item) => item?.value === 751),
        });
      } else if (e?.value === 741) {
        formContact?.setFieldsValue({
          inputType: dataInputType?.find((item) => item?.value === 748),
        });
      } else {
        formContact?.resetFields(["inputType"]);
      }
      formContact?.resetFields([
        ["values", 0, "prefix_1"],
        ["values", 0, "prefix_2"],
        ["values", 0, "sufix"],
        ["values", 0, "value"],
      ]);
    },
    [dataInputType, formContact],
  );

  // handle change input type
  const handleChangeInputType = useCallback(
    (e) => {
      formContact?.setFieldsValue({
        values: [
          {
            prefix_1: undefined,
            prefix_2: undefined,
            sufix: undefined,
            values: undefined,
          },
        ],
      });
      setInputTypeRow(e?.value);
    },
    [formContact],
  );

  // handle change
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // handle confirm retry
  const handleConfirm = () => {
    if (
      bodyError?.action === "UPDATE_CONTACT" ||
      bodyError?.action === "CREATE_CONTACT"
    ) {
      handleSave();
    } else {
      dispatch(getDetailContact(location?.state?.id));
    }
  };

  // handle retry
  const handleRetry = () => {
    handleConfirm();
    setModalError(false);
    dispatch(clearBodyMessage());
  };

  // handle close modal
  const handleCloseModalError = () => {
    setModalError(false);
    dispatch(clearBodyMessage());
    // setBodyError({});
  };
  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_CONTACT,
      breadcrumbName: "Contact",
    },
    {
      path: "",
      breadcrumbName: type === "update" ? "Update Contact" : "Create Contact",
    },
  ];

  const handleDispatcher = useCallback(
    (e) => {
      if (inputTypeRow) {
        return {
          dispatchCountry: "lala",
          dispatchCountryCode: "country code",
        };
      } else {
        return {
          dispatchCountry: "lala",
          dispatchCountryCode: "country code",
        };
      }
    },
    [inputTypeRow],
  );

  const editRecords = useCallback(
    (record) => {
      setSelectedType(record?.type?.value);
      if (
        record?.inputType?.value === 748 ||
        record?.inputType?.value === 751
      ) {
        if (
          hasValue(record?.prefix_1?.value) &&
          record?.hasOwnProperty("prefix_2")
        ) {
          dispatch(getCountryZone(record?.prefix_1?.value));
        }
      }
    },
    [dispatch],
  );

  const changePrefix = useCallback(
    (record, formValue, value, prefix) => {
      if (prefix[1] === "prefix_1") {
        formContact?.resetFields([
          ["values", 0, "prefix_2"],
          ["values", 0, "sufix"],
          ["values", 0, "value"],
        ]);
        hasValue(value?.value) && dispatch(getCountryZone(value?.value));
      } else {
        formContact?.resetFields([
          ["values", 0, "sufix"],
          ["values", 0, "value"],
        ]);
      }
    },
    [dispatch, formContact],
  );

  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextInlane(selectedKeys[0]);
    setSearchedColumnInlane(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  }, []);

  const columnContact = useMemo(() => {
    return [
      {
        title: "NO",
        dataIndex: "no",
        align: "center",
        width: 60,
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "TYPE",
        dataIndex: "type",
        editable: true,
        sorter: (a, b) =>
          sorterFunction("type", a?.type?.label, b?.type?.label, "select"),
        inputType: "select",
        align: "left",
        required: true,
        width: 250,
        onClick: (e) => handleChangeType(e),
        options: dataContactType,
        rules: formMessageRequired("Type"),
        ...getColumnSearchProps(
          "type",
          searchInput,
          searchedColumnInlane,
          searchTextInlane,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "type",
            searchedColumnInlane,
            searchTextInlane,
            text?.label,
            false,
            "input",
            search,
          ),
      },
      {
        title: "INPUT TYPE",
        dataIndex: "inputType",
        editable: true,
        sorter: (a, b) =>
          sorterFunction(
            "inputType",
            a?.inputType?.label,
            b?.inputType?.label,
            "select",
          ),
        inputType: "select",
        align: "left",
        required: true,
        width: 200,
        onClick: (e) => handleChangeInputType(e),
        options: renderDataOptions(dataInputType),
        rules: formMessageRequired("Input Type"),
        ...getColumnSearchProps(
          "inputType",
          searchInput,
          searchedColumnInlane,
          searchTextInlane,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "inputType",
            searchedColumnInlane,
            searchTextInlane,
            text?.label,
            false,
            "input",
            search,
          ),
      },
      {
        title: "VALUE",
        dataIndex: "value",
        inputType: "input",
        editable: true,
        sorter: true,
        required: true,
        options: {
          country_code: dataCountryCode,
          country_zone: data_country_zone?.map((item) => ({
            value: item.id,
            label: item.text,
          })),
        },
        onClick: (e) => handleDispatcher(e),
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchProps(
          "value",
          searchInput,
          searchedColumnInlane,
          searchTextInlane,
          handleSearch,
          true,
          "contact",
        ),
        render: (text, record, id) => {
          return renderColumn(
            "value",
            searchedColumnInlane,
            searchTextInlane,
            record?.fullValue,
            true,
            "input",
            search,
          );
        },
      },
    ];
  }, [
    dataContactType,
    dataCountryCode,
    dataInputType,
    data_country_zone,
    handleChangeInputType,
    handleChangeType,
    handleDispatcher,
    handleSearch,
    page,
    pageSize,
    renderDataOptions,
    search,
    searchTextInlane,
    searchedColumnInlane,
  ]);

  return (
    <LayoutMenu>
      <Spin spinning={loading || isLoading}>
        <BreadCrumb routes={routes} />
        <Form form={form} layout={"vertical"} onFinish={handleFinish}>
          <BaseContainer header={"contact information"}>
            <div className="w-full grid grid-cols-3 gap-5">
              <Form.Item
                label={"First Name"}
                name={"firstName"}
                rules={formMessageRequired("First Name")}
              >
                <InputComponent onInput={onInputUpperCase} />
              </Form.Item>
              <Form.Item label={"Middle Name"} name={"middleName"}>
                <InputComponent onInput={onInputUpperCase} />
              </Form.Item>
              <Form.Item label={"Last Name"} name={"lastName"}>
                <InputComponent onInput={onInputUpperCase} />
              </Form.Item>
            </div>
            <div className="w-full grid grid-cols-3 gap-5">
              <Form.Item label={"Job"} name={"jobId"}>
                <SelectComponent>
                  {data_job?.map((item) => (
                    <Select.Option value={item?.value}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item label={"Position"} name={"positionId"}>
                <SelectComponent>
                  {data_position?.map((item) => (
                    <Select.Option value={item?.value}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>
            </div>
            <div>
              <div className="text-primary text-xs font-bold uppercase pt-6">
                Contact detail
              </div>
              <TableContact
                dataTable={dataTable}
                setDataTable={setDataTable}
                cols={columnContact}
                page={page}
                pageSize={pageSize}
                actionButtons={["delete", "update"]}
                form={formContact}
                editRecords={editRecords}
                changePrefix={changePrefix}
                onChangePage={handleChange}
                onSizeChanger={handleChange}
                isStored={setDisabledButton}
              />
            </div>
          </BaseContainer>
          <div className="w-full my-5 flex gap-5">
            <ButtonComponent
              disabled={disabledButton}
              icon={
                <LeftOutlined style={{ fontSize: "24px", color: "#fff" }} />
              }
              type="submit"
              onClick={() => setModalBack(true)}
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
                <ButtonComponent
                  type="submit"
                  htmlType={"submit"}
                  disabled={disabledButton}
                >
                  Save
                </ButtonComponent>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Spin>
      <ModalCustom
        isOpen={openConfirmation}
        handleCancel={handleCancel}
        type={"confirmation"}
        width={900}
        header={"confirmation"}
        footer={[
          <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
            <ButtonComponent onClick={handleCancel} type="default">
              Cancel
            </ButtonComponent>
            <ButtonComponent onClick={handleSave} type={"submit"}>
              Confirm
            </ButtonComponent>
          </div>,
        ]}
      >
        <div>
          <div className="text-primary text-xs font-bold uppercase py-4">
            Contact Inforamtion
          </div>
          <div className="w-full grid grid-cols-3">
            <DetailText label={"First Name"}>
              {body?.body?.firstName}
            </DetailText>
            <DetailText label={"Middle Name"}>
              {body?.body?.middleName}
            </DetailText>
            <DetailText label={"Last Name"}>{body?.body?.lastName}</DetailText>
          </div>
          <div className="w-full grid grid-cols-3">
            <DetailText label={"Job"}>
              {
                data_job?.filter((item) => item?.value === body?.body?.jobId)[0]
                  ?.name
              }
            </DetailText>
            <DetailText label={"Position"}>
              {
                data_position?.filter(
                  (item) => item?.value === body?.body?.positionId,
                )[0]?.name
              }
            </DetailText>
          </div>
          <div className="text-primary text-xs font-bold uppercase py-4">
            Contact Detail
          </div>
          <div className="w-full">
            <TablePagination
              columns={columnContact}
              dataSource={body?.displayDataTableConfirm}
              pageSize={10}
              current={1}
              totalData={body?.body?.viewDetails?.length}
            />
          </div>
        </div>
      </ModalCustom>

      {/** Modal Retry */}
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

      {/* Modal Back */}
      <ModalBack
        isOpen={modalBack}
        handleCancel={() => setModalBack(false)}
        handleOk={() => navigate(-1)}
      />
    </LayoutMenu>
  );
};

export default FormContact;
