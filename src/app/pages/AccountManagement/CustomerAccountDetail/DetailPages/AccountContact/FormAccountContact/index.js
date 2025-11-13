import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Alert, Checkbox, Form, Select, Spin } from "antd";

import LayoutMenu from "../../../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumbAdvanced from "../../../../../../../components/BreadCrumbAdvanced";
import BaseContainer from "../../../../../../../components/BaseContainer";
import HeaderDetail from "../../../HeaderDetail";
import InputComponent from "../../../../../../../components/InputComponent";
import SelectComponent from "../../../../../../../components/SelectComponent";
import TablePagination from "../../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import ModalChooseContact from "./ModalChooseContactComp";
import ModalCreateNewContact from "./ModalCreateNewContact";
import {
  getDetailContactAfterChoose,
  getDetailAccountContact,
  getJob,
  getPosition,
  getContactAddress,
  createAccountContact,
  updateAccountContact,
  getContactType,
  getInputType,
  getCountryCode,
  resetDataDetail,
} from "../../../../../../../redux/slices/account_management/detailAccount/accountContactSlice";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import DetailText from "../../../../../../../components/DetailText";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import {
  ModalConfirm,
  ModalError,
  ModalSuccess,
} from "../../../../../../../components/Modal/ModalPopUp";
import { validateCreateUpdate } from "../../../../../../../redux/slices/general_slice";
import accountManagementService from "../../../../../../../redux/services/account_management/accountManagementService";

const FormAccountAddress = ({ type }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const id = location.state?.accountId;
  const contactIdUpdate = location.state?.contactId;
  const idCustomer = location.state?.idCustomer;
  const typeAccount = location.state?.typeAccount;
  const accountContactId = location.state?.accountContactId;
  const {
    data_detail,
    data_choose_contact,
    data_job,
    data_position,
    data_contact_address = [],
    loading,
    data_contactType,
    data_inputType,
    data_country_code,
    data_country_zone = [],
  } = useSelector((state) => state.accountContact);

  // const dataDetail = data_detail?.data;
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalChooseContact, setModalChooseContact] = useState(false);
  const [modalCreateNewContact, setModalCreateNewContact] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [dataPush, setDataPush] = useState({});
  const [dataTable, setDataTable] = useState([]);
  const [keyModal, setKeyModal] = useState();
  const [dataCreateNew, setDataCreateNew] = useState({});
  const [isIdChoose, setIsIdChoose] = useState("");
  const [primary, setPrimary] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [dataDetailFinal, setDataDetailFinal] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [emptyValueValidate, setEmptyValueValidate] = useState(false);
  const [modalValidate, setModalValidate] = useState(false);
  const [modalCheckPrimaryExist, setModalCheckPrimaryExist] = useState(false);
  const [typeValidation, setTypeValidation] = useState(true);

  const [prefix1, setPrefix1] = useState({});
  const [prefix2, setPrefix2] = useState({});
  const [suffix, setSuffix] = useState({});
  const [value, setValue] = useState({});

  const [modalSuccess, setModalSuccess] = useState(false);
  const [form] = Form.useForm();

  // Get Data List Choose Contact
  useEffect(() => {
    dispatch(getJob());
    dispatch(getPosition());
    dispatch(getContactAddress(id));
    dispatch(getContactType());
    dispatch(getInputType());
    dispatch(getCountryCode());
    // dispatch(getCountryZone());
    if (type === "update") {
      dispatch(getDetailAccountContact(accountContactId))
        .unwrap()
        .then((data) => {
          setDataDetail(data);
          setDataTable(data?.contactDetail);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [dispatch, type]);

  // useEffect(() => {
  //   dispatch(getListChooseContact({ id:id, page, pageSize }));
  // }, [dispatch, page, pageSize]);

  // Set data from choose contact before submit
  useEffect(() => {
    if (data_detail) {
      if (type == "update") {
        setDataDetail(data_detail?.data);
        setPrimary(data_detail?.data?.primaryFlagValue);
        setDataTable(data_detail?.data?.contactDetail);
      } else if (type === "create" && isIdChoose !== "") {
        setDataDetail(data_detail?.data);
        setPrimary(data_detail?.data?.primaryFlagValue);
        setDataTable(data_detail?.data?.contactDetail);
      }
      // else {
      //   setDataDetail({});
      // }
    }
  }, [data_detail, type, isIdChoose]);

  useEffect(() => {
    if (dataDetail) {
      form.setFieldsValue({
        firstName: dataDetail?.firstName,
        middleName: dataDetail?.middleName,
        lastName: dataDetail?.lastName,
        jobId: dataDetail?.jobId,
        positionId: dataDetail?.positionId,
        contactAddressId: dataDetail?.contactAddressName,
        additionalNote: dataDetail?.additionalNote,
        description: dataDetail?.description,
        primaryFlag: dataDetail?.primaryFlagValue,
      });
      setPrimary(
        dataDetail?.primaryFlagValue ? dataDetail?.primaryFlagValue : primary
      );
      setDataDetailFinal(
        dataDetail?.contactDetail?.map((item) => {
          return {
            type: item.typeId,
            inputType: item.inputTypeId,
            prefix1: item.prefix1,
            prefix2: item.prefix2,
            value: item.value,
            sufix: item.sufix,
          };
        })
      );
    }
  }, [dataDetail]);

  // Populate data from create new
  useEffect(() => {
    setIsIdChoose("");
    // form.setFieldsValue({
    //   firstName: dataCreateNew?.firstName,
    //   middleName: dataCreateNew?.middleName,
    //   lastName: dataCreateNew?.lastName,
    //   jobId: dataCreateNew?.job,
    //   positionId: dataCreateNew?.position,
    // });
    setDataTable(dataCreateNew?.contactDetail || []);
    setDataDetail({
      ...dataCreateNew,
      jobId: dataCreateNew?.job,
      positionId: dataCreateNew?.position,
    });
  }, [dataCreateNew]);

  // reset form value if first enter create
  // useEffect(() => {
  //   if (id) {
  //     form.resetFields();
  //     setDataTable([]);
  //   }
  // }, []);

  // Get and populate date to form main account contact
  const getDetailContactById = (contactId) => {
    dispatch(getDetailContactAfterChoose(contactId));
    setModalChooseContact(false);
  };

  const routes = (id) => {
    return [
      {
        path: "",
        breadcrumbName: "Account",
      },
      {
        path:
          typeAccount == "standard"
            ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD
            : ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_ONETIME,
        breadcrumbName:
          typeAccount == "standard" ? "Account - Standard" : "Account - One Time",
      },
      {
        path:
          typeAccount == "standard"
            ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
            : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME,
        breadcrumbName: "Detail Account",
        state: {
					idAccount: id,
				}
      },
      {
        path:
          type === "create"
            ? ACCOUNT_MANAGEMENT_ROUTES.CREATE_ACCOUNT_CONTACT
            : ACCOUNT_MANAGEMENT_ROUTES.UPDATE_ACCOUNT_CONTACT,
        breadcrumbName: type === "create" ? "Create Contact" : "Update Contact",
      },
    ];
  }

  const getCountryCodeName = (val) => {
    const countryCodeName =
      data_country_code &&
      data_country_code?.filter((item) => item?.id === val);
    if (countryCodeName === undefined) {
      return "";
    }
    if (countryCodeName.length !== 0) {
      return `(${countryCodeName[0].text})`;
    }
  };
  const getCountryZoneName = (val) => {
    const countryZoneName =
      data_country_zone &&
      data_country_zone?.filter((item) => item?.id === val);
    if (countryZoneName === undefined) {
      return "";
    }
    if (countryZoneName.length !== 0) {
      return `(${countryZoneName[0].text})`;
    }
  };
  const getContactAddressName = (val) => {
    const contactAddressName =
      data_contact_address &&
      data_contact_address?.filter((item) => item?.addressId === val);
    if (contactAddressName === undefined) {
      return "";
    }
    if (contactAddressName.length !== 0) {
      return contactAddressName[0].fullAddress;
    }
  };

  const columns = [
    {
      title: "NO",
      width: 20,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "TYPE",
      dataIndex: "typeId",
      width: 100,
      sorter: true,
      render: (type) => (
        <span>
          {data_contactType &&
            data_contactType.filter((a) => a.id === type).find((b) => b.text)
              ?.text}
        </span>
      ),
      // ...getColumnSearchProps("srId"),
    },
    {
      title: "INPUT TYPE",
      dataIndex: "inputTypeId",
      width: 100,
      sorter: true,
      render: (inputType) => (
        <span>
          {data_inputType &&
            data_inputType.filter((a) => a.id === inputType).find((b) => b.text)
              ?.text}
        </span>
      ),
      // ...getColumnSearchProps("srId"),
    },
    {
      title: "VALUE",
      dataIndex: "value",
      width: 100,
      sorter: true,
      render: (_, record) => {
        // const tempValue = value[`${record.key}`];
        // return (
        //   <div>
        //     <div>
        //       {record?.prefix1 && `${getCountryCodeName(record?.prefix1)}-`}
        //       {record?.prefix2 && `${getCountryZoneName(record?.prefix2)}-`}
        //       {record.value}
        //       {record?.suffix && `-(${record?.suffix})`}
        //     </div>
        //   </div>
        // );
        if(record.fullValue){
          return <span>{record.fullValue}</span>
        }
        if (record.typeId === 741) {
          if (record.inputTypeId === 748) {
            return (
              <span>{`${getCountryCodeName(
                record?.prefix1
              )} ${getCountryZoneName(record?.prefix2)} - ${record.value}  
                ${
                  record.sufix ? 'Ext ' + record.sufix : ""
                  // sufix[`${record.row}~${record.key}`] ? sufix[`${record.row}~${record.key}`] : ""
                }
                `}</span>
            );
          } else {
            return (
              <span>{`${getCountryCodeName(record?.prefix1)} - ${
                record.value
              }`}</span>
            );
          }
        }
        if (record.typeId === 746) {
          return (
            <span>{`${getCountryCodeName(record?.prefix1)} - ${
              record.value
            }`}</span>
          );
        }
        if (record.typeId === 747) {
          return (
            <span>{`${getCountryCodeName(record?.prefix1)} - ${
              record.value
            }`}</span>
          );
        }
        if (record.typeId === 745) {
          return (
            <span>
              {`${getCountryCodeName(record?.prefix1)} ${getCountryZoneName(record?.prefix2)} - ${record.value} ${record.sufix ? 'Ext ' + record.sufix : ""}`}
            </span>
          );
        } else {
          return <span>{record.value}</span>;
        }
      },
      // ...getColumnSearchProps("srId"),
    },
    // {
    //   title: "ACTION",
    //   align: "center",
    //   width: 100,
    //   render: (v, r, i) => {
    //     return (
    //       <div className="flex justify-center align-middle gap-2">
    //         <Tooltip title="Detail">
    //           <SVGIcon
    //             name="IconDetail"
    //             color={"#0075bf"}
    //             width={24}
    //             // onClick={() => {
    //             //   setModalDetail(true);
    //             // }}
    //           />
    //         </Tooltip>
    //       </div>
    //     );
    //   },
    // },
  ];

  const columnsConfirmation = [
    {
      title: "NO",
      width: 20,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "TYPE",
      dataIndex: "typeId",
      width: 100,
      sorter: true,
      // ...getColumnSearchProps("srId"),
      render: (type) => (
        <span>
          {data_contactType &&
            data_contactType.filter((a) => a.id === type).find((b) => b.text)
              ?.text}
        </span>
      ),
    },
    {
      title: "INPUT TYPE",
      dataIndex: "inputTypeId",
      width: 100,
      sorter: true,
      render: (inputType) => (
        <span>
          {data_inputType &&
            data_inputType.filter((a) => a.id === inputType).find((b) => b.text)
              ?.text}
        </span>
      ),
      // ...getColumnSearchProps("srId"),
    },
    {
      title: "VALUE",
      dataIndex: "value",
      width: 100,
      sorter: true,
      // ...getColumnSearchProps("srId"),
      render: (_, record) => {
        if(record.fullValue){
          return <span>{record.fullValue}</span>
        }
        if (record.typeId === 741) {
          if (record.inputTypeId === 748) {
            return (
              <span>{`${getCountryCodeName(
                record?.prefix1
              )} ${getCountryZoneName(record?.prefix2)} - ${record.value} 
              ${
                record.sufix ? 'Ext ' + record.sufix : ""
                // sufix[`${record.row}~${record.key}`] ? sufix[`${record.row}~${record.key}`] : ""
              }
              `}</span>
            );
          } else {
            return (
              <span>{`${getCountryCodeName(record?.prefix1)} - ${
                record.value
              }`}</span>
            );
          }
        }
        if (record.typeId === 746) {
          return (
            <span>{`${getCountryCodeName(record?.prefix1)} - ${
              record.value
            }`}</span>
          );
        }
        if (record.typeId === 747) {
          return (
            <span>{`${getCountryCodeName(record?.prefix1)} - ${
              record.value
            }`}</span>
          );
        }
        if (record.typeId === 745) {
          return (
            <span>{`${getCountryCodeName(record?.prefix1)} ${getCountryZoneName(
              record?.prefix2
            )} - ${record.value} ${record.sufix ? 'Ext ' + record.sufix : ""}`}</span>
          );
        } else {
          return <span>{record.value}</span>;
        }
      },
    },
    // {
    //   title: "ACTION",
    //   align: "center",
    //   width: 100,
    //   render: (v, r, i) => {
    //     return (
    //       <div className="flex justify-center align-middle gap-2">
    //         <Tooltip title="Detail">
    //           <SVGIcon
    //             name="IconDetail"
    //             color={"#0075bf"}
    //             width={24}
    //             // onClick={() => {
    //             //   setModalDetail(true);
    //             // }}
    //           />
    //         </Tooltip>
    //       </div>
    //     );
    //   },
    // },
  ];

  // Set Data To Confirmation Modal
  const handleSave = async (formValue) => {
    let url;
    let bodyRequest;
    if (!contactIdUpdate || type === "create") {
      const body = {
        ...formValue,
        // contactName: dataDetail?.contactName,
        // contactDetail: dataDetailFinal,
        contactId: isIdChoose === "" ? null : isIdChoose,
        contactName:
          dataDetail && dataDetail?.contactName
            ? dataDetail?.contactName
            : `${dataDetail.firstName.trim()}${
                dataDetail.middleName ? ` ${dataDetail.middleName.trim()}` : ""
              }${dataDetail.lastName ? ` ${dataDetail.lastName.trim()}` : ""}`,
        // contactName: dataDetail && dataDetail?.contactName
        //   ? dataDetail?.contactName
        //   : `${dataDetail?.firstName} ${dataDetail.middleName || ""} ${dataDetail.lastName || ""}`.trim(),
        contactDetail: dataDetail?.contactDetail,
        accountId: id,
        primaryFlag: primary !== undefined ? primary : false,
      };

      // replace if value undefined tobe null
      const outputObject = {};
      for (const key in body) {
        if (body.hasOwnProperty(key)) {
          if (typeof body[key] === "undefined") {
            outputObject[key] = null;
          } else {
            outputObject[key] = body[key];
          }
        }
      }
      url = "/v1/dbs/api/account/contact/validate-create"
      bodyRequest= {...outputObject, needValidation: formValue?.primaryFlag, primaryFlag: formValue?.primaryFlag};
      setDataPush(outputObject);
    } else {
      const bodyUpdate = {
        ...formValue,
        accountId: id,
        contactId: contactIdUpdate,
        contactName: dataDetail
          ? dataDetail?.contactName
          : `${dataDetail.firstName.trim()}${
              dataDetail.middleName ? ` ${dataDetail.middleName.trim()}` : ""
            }${dataDetail.lastName ? ` ${dataDetail.lastName.trim()}` : ""}`,
        // contactName: dataDetail
        //   ? dataDetail?.contactName
        //   : `${dataCreateNew?.firstName} ${dataCreateNew.middleName || ""} ${dataCreateNew.lastName || ""}`,
        contactDetail: dataDetail
          ? dataDetail?.contactDetail
          : dataCreateNew?.contactDetail,
        primaryFlag: primary !== undefined ? primary : false,
      };
      url = "/v1/dbs/api/account/contact/validate-update"
      bodyRequest= {
        accountId: id,
        contactId: contactIdUpdate,
        description:
          formValue?.description === null || formValue?.description === undefined
            ? ""
            : formValue?.description,
        needValidation: formValue?.primaryFlag, 
        primaryFlag: formValue?.primaryFlag,
        accountContactId: accountContactId
      };
      setDataPush(bodyUpdate);
    }
    try {
      const res = await dispatch(validateCreateUpdate({ body: bodyRequest, services: accountManagementService, endPoint: url, type }))?.unwrap();
      if(res.success === false){
        setModalCheckPrimaryExist(true);
        setTypeValidation(false);
      }else{
        setTypeValidation(false);
        setModalCheckPrimaryExist(false);
        setModalConfirm(true);
      }
    } catch (error) {
      console.log(error)
    }
  };

  // Submit Data
  const handleConfirm = async () => {
    if (!contactIdUpdate) {
      let body = {
        ...dataPush,
        needValidation: typeValidation,
      };
      await dispatch(createAccountContact({ body }))
        .unwrap()
        .then((data) => {
          setModalCheckPrimaryExist(false);
          setTypeValidation(true);
          setModalSuccess(true);
          setModalConfirm(false);
        })
        .catch(() => {
          setTypeValidation(true);
          setModalConfirm(false);
        });
    } else {
      const bodyDataUpdate = {
        accountId: id,
        contactId: dataPush?.contactId,
        description:
          dataPush?.description === null || dataPush?.description === undefined
            ? ""
            : dataPush?.description,
        primaryFlag: dataPush?.primaryFlag,
        needValidation: typeValidation,
        accountContactId: accountContactId
      };
      await dispatch(updateAccountContact({ body: bodyDataUpdate }))
        .unwrap()
        .then((data) => {
          setModalCheckPrimaryExist(false);
          setTypeValidation(true);
          setModalSuccess(true);
          setModalConfirm(false);
        })
        .catch(() => {
          setTypeValidation(true);
          setModalConfirm(false);
        });
    }
  };

  const handleResetAndClear = () => {
    if (type === "create") {
      form.resetFields();
      setPrimary(false);
      setDataTable([]);
    } else {
      dispatch(getDetailAccountContact(accountContactId))
        .unwrap()
        .then((data) => {
          setDataDetail(data);
          setDataTable(data?.contactDetail);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setIsIdChoose("");
    setTypeValidation(true);
  };
  const getJobName = (val) => {
    const jobName = data_job && data_job?.filter((item) => item?.id === val);
    if (jobName === undefined) {
      return "";
    }
    if (jobName.length !== 0) {
      return jobName[0].text;
    }
  };
  const getPositionName = (val) => {
    const positionName =
      data_position && data_position?.filter((item) => item?.id === val);
    if (positionName === undefined) {
      return "";
    }
    if (positionName.length !== 0) {
      return positionName[0].text;
    }
  };

  const handleValidateWord = () => {
    if (emptyValueValidate) {
      return "Your contact detail still has missing value. Please input the missing value to save.";
    } else if (isEditing) {
      return "Your contact detail have not been saved. Please save contact detail first.";
    } else {
      return "Your contact detail is still empty. Please fill in the contact detail first.";
    }
  };

  const handleResetDataDetail = () => {
    dispatch(resetDataDetail());
  };
  return (
    <div>
      <LayoutMenu>
        <Spin spinning={loading}>
          <BreadCrumbAdvanced routes={routes(id)}/>
          <HeaderDetail
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
            dispatch={dispatch}
            idAccount={id}
            idCustomer={idCustomer}
            type={typeAccount}
          />

          <Form
            layout="vertical"
            form={form}
            onFinish={dataTable?.length > 0 ? handleSave : ""}
          >
            <BaseContainer header={"CONTACT INFORMATION"}>
              {type !== "update" && (
                <div className="flex w-full justify-end gap-x-2 pb-6">
                  <ButtonComponent
                    type="submit"
                    onClick={() => {
                      setModalChooseContact(true);
                      setKeyModal(1);
                    }}
                  >
                    Choose Contact
                  </ButtonComponent>
                </div>
              )}

              {/* SECTION CONTACT INFORMATION */}
              <div className={"grid grid-cols-3 w-full gap-x-6"}>
                <Form.Item
                  name="firstName"
                  label={"First Name"}
                  rules={[
                    {
                      required: true,
                      message: "Please input your First Name",
                    },
                  ]}
                >
                  <InputComponent disabled={true} />
                </Form.Item>
                <Form.Item name="middleName" label={"Middle Name"}>
                  <InputComponent disabled={true} />
                </Form.Item>
                <Form.Item name="lastName" label={"Last Name"}>
                  <InputComponent disabled={true} />
                </Form.Item>
                <Form.Item
                  label={"Job"}
                  name="jobId"
                  // rules={[
                  //   { required: true, message: "Please select your JOB!" },
                  // ]}
                >
                  <SelectComponent disabled={true}>
                    {data_job &&
                      data_job?.map((item, index) => (
                        <Select.Option value={item.id} key={index}>
                          {item.text}
                        </Select.Option>
                      ))}
                  </SelectComponent>
                </Form.Item>
                <Form.Item
                  label={"Position"}
                  name="positionId"
                  // rules={[
                  //   { required: true, message: "Please select your POSITION!" },
                  // ]}
                >
                  <SelectComponent disabled={true}>
                    {data_position &&
                      data_position?.map((item, index) => (
                        <Select.Option value={item.id} key={index}>
                          {item.text}
                        </Select.Option>
                      ))}
                  </SelectComponent>
                </Form.Item>
              </div>

              {/* CONTACT DETAIL */}
              <div className="pb-8">
                <p className="text-primary text-xs font-bold uppercase">
                  CONTACT DETAIL
                </p>
                <TablePagination
                  dataSource={dataTable}
                  totalData={data_detail?.data?.contactDetail?.length}
                  current={page}
                  pageSize={pageSize}
                  // onChange={handleChange}
                  // onSizeChanger={handleChangeSize}
                  tableScrolled={{ y: 525 }}
                  // onSort={onSort}
                  columns={columns}
                />
              </div>

              {/* SECTION CONTACT PURPOSE INFORMATION */}
              <div>
                <p className="text-primary text-xs font-bold uppercase">
                  CONTACT PURPOSE INFORMATION
                </p>
                <div className={"grid grid-cols-3 w-full gap-x-6"}>
                  <Form.Item
                    name="primaryFlag"
                    initialValue={primary}
                    valuePropName="checked"
                    noStyle
                  >
                    <div className="flex flex-col pt-[20px]">
                      <Checkbox
                        // disabled={type === "update"}
                        checked={primary}
                        onChange={(e) => setPrimary(e.target.checked)}
                      >
                        Primary Contact
                      </Checkbox>
                      <span className="text-[10px]">
                        Check if this contact is primary. You can only have 1
                        primary contact.
                      </span>
                    </div>
                  </Form.Item>
                  <Form.Item
                    name="contactAddressId"
                    label={"Contact Address"}
                    rules={[
                      {
                        required: contactIdUpdate ? false : true,
                        message: "Please input your Contact Address",
                      },
                    ]}
                  >
                    <SelectComponent disabled={type === "update"}>
                      {data_contact_address &&
                        data_contact_address?.map((item, index) => (
                          <Select.Option value={item.addressId} key={index}>
                            {item?.fullAddress}
                          </Select.Option>
                        ))}
                    </SelectComponent>
                  </Form.Item>
                  <Form.Item
                    name="additionalNote"
                    label={"Contact Address Additional Note"}
                  >
                    <InputComponent disabled={type === "update"} type="text" />
                  </Form.Item>
                </div>
                <div className={"grid grid-cols-1 w-full gap-x-6"}>
                  <Form.Item label="Description" name="description">
                    <InputComponent type="textarea" />
                  </Form.Item>
                </div>
              </div>
            </BaseContainer>
            <div className={"w-full my-5 flex"}>
              <div>
                <Link
                  to={
                    typeAccount === "standard"
                      ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
                      : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME
                  }
                  state={{
                    section: "Account Contact",
                    idAccount: id,
                    idCustomer: idCustomer,
                  }}
                >
                  <ButtonComponent
                    icon={
                      <LeftOutlined
                        style={{ fontSize: "24px", color: "#fff" }}
                      />
                    }
                    type="submit"
                    // onClick={() => setModalBack(true)}
                    // onClick={() => navigate(-1)}
                  >
                    Back
                  </ButtonComponent>
                </Link>
              </div>
              <div className="w-full flex justify-end gap-5">
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
                    onClick={handleResetAndClear}
                  >
                    {type === "update" ? "Reset" : "Clear"}
                  </ButtonComponent>
                </Form.Item>
                <Form.Item>
                  <ButtonComponent
                    type="submit"
                    htmlType={"submit"}
                    disabled={dataTable?.length > 0 ? false : true}
                  >
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
            header={"confirmation"}
            width={1000}
            handleCancel={() => {
              setModalConfirm(false)
              setTypeValidation(false)
            }}
            footer={
              <div className={"w-full flex justify-end gap-5"}>
                <ButtonComponent
                  type={"default"}
                  onClick={() => {
                    setModalConfirm(false)
                    setTypeValidation(false)
                  }}
                >
                  Cancel
                </ButtonComponent>
                <ButtonComponent
                  type={"submit"}
                  border={false}
                  onClick={handleConfirm}
                >
                  Confirm
                </ButtonComponent>
              </div>
            }
          >
            <div className="w-full p-5">
              <span className="text-primary uppercase font-bold">
                CONTACT INFORMATION
              </span>
              <div className="w-full grid grid-cols-3 gap-5 pt-[30px]">
                <DetailText label="First Name">
                  {dataPush?.firstName}
                </DetailText>
                <DetailText label="Middle Name">
                  {dataPush?.middleName}
                </DetailText>
                <DetailText label="Last Name">{dataPush?.lastName}</DetailText>
                <DetailText label="Job">
                  {getJobName(dataPush?.jobId)}
                </DetailText>
                <DetailText label="Position">
                  {getPositionName(dataPush?.positionId)}
                </DetailText>
              </div>

              {/* Table */}
              <div className="w-full py-6">
                <span className="text-primary uppercase font-bold mt-[30px]">
                  CONTACT DETAIL
                </span>

                <div className="w-full pt-[30px]">
                  <TablePagination
                    dataSource={dataPush?.contactDetail}
                    columns={columnsConfirmation}
                    pageSize={10}
                    current={1}
                    totalData={dataPush?.contactDetail?.length}
                  />
                </div>
              </div>

              <span className="text-primary uppercase font-bold">
                CONTACT PURPOSE INFORMATION
              </span>
              <div className="w-full grid grid-cols-3 gap-5 pt-[30px]">
                <DetailText label="Primary Contact">
                  {dataPush?.primaryFlag ? "Yes" : "No"}
                </DetailText>
                <DetailText label="Contact Address">
                  {getContactAddressName(dataPush?.contactAddressId)}
                </DetailText>
                <DetailText label="Contact Address Additional Note">
                  {dataPush?.additionalNote}
                </DetailText>
                <div className="col-span-3">
                  <DetailText label="Description">
                    {dataPush?.description}
                  </DetailText>
                </div>
              </div>
            </div>
          </ModalCustom>
          <ModalChooseContact
            type={type}
            dataChooseContact={data_choose_contact}
            data_choose_contact
            isOpen={modalChooseContact}
            setModalChooseContact={setModalChooseContact}
            getDetailContactById={getDetailContactById}
            setModalCreateNewContact={setModalCreateNewContact}
            setIsIdChoose={setIsIdChoose}
            isIdChoose={isIdChoose}
            id={id}
          />
          <ModalCreateNewContact
            isOpen={modalCreateNewContact}
            setModalCreateNewContact={setModalCreateNewContact}
            dataJob={data_job}
            dataPosition={data_position}
            dataContactType={data_contactType}
            dataInputType={data_inputType}
            dataCountryCode={data_country_code}
            dataCountryZone={data_country_zone}
            keyModal={keyModal}
            setKeyModal={setKeyModal}
            setDataCreateNew={setDataCreateNew}
            handleResetDataDetail={handleResetDataDetail}
            setModalChooseContact={setModalChooseContact}
            prefix1={prefix1}
            setPrefix1={setPrefix1}
            prefix2={prefix2}
            setPrefix2={setPrefix2}
            suffix={suffix}
            setSuffix={setSuffix}
            value={value}
            setValue={setValue}
            setIsEditing={setIsEditing}
            setEmptyValueValidate={setEmptyValueValidate}
            setModalValidate={setModalValidate}
            isEditing={isEditing}
          />
        </Spin>
        {modalValidate ? (
          <ModalError
            isOpen={modalValidate}
            handleOk={() => {
              setEmptyValueValidate(false);
              setModalValidate(false);
            }}
            handleCancel={() => {
              setEmptyValueValidate(false);
              setModalValidate(false);
            }}
            customText={"Back"}
          >
            <div className="px-5 pt-5 pb-[10px] justify-center">
              <div className="w-full flex gap-[20px]">
                <SVGIcon name="IconFailed" width={48} />
                <p className="text-[18px] font-bold">{"Failed"}</p>
              </div>
              <p className="pl-[70px]">{handleValidateWord()}</p>
            </div>
          </ModalError>
        ) : null}

        {modalCheckPrimaryExist ? (
          <ModalConfirm
            isOpen={modalCheckPrimaryExist}
            handleCancel={() => {
              setModalCheckPrimaryExist(false);
              setTypeValidation(true);
            }}
            handleOk={() => {
              setModalCheckPrimaryExist(false);
              setTypeValidation(false);
              setModalConfirm(true)
            }}
            width={700}
          >
            <div className="flex justify-center gap-[20px] mt-6">
              <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
              <p className={"text-[18px] font-bold"}>
                {`Are you sure want to ${
                  type === "create" ? "create" : "update"
                } new primary contact ?`}
              </p>
            </div>
            <Alert
              message="
            Warning! You have active primary contact, if you want to continue, the existing primary contact will be inactivated!"
              type={"error"}
            />
          </ModalConfirm>
        ) : null}

        {modalSuccess ? (
          <ModalSuccess
            isOpen={modalSuccess}
            handleOk={() => {
              setModalSuccess(false);
              navigate(-1);
            }}
            handleCancel={() => {
              setModalSuccess(false);
              navigate(-1);
            }}
            width={400}
          >
            <div className="px-8 py-8 justify-center">
              <div className="w-full flex gap-[20px]">
                <SVGIcon name="IconSuccess" width={48} />
                <p className="text-[18px] font-bold">{"Successfull"}</p>
              </div>
              <p className="pl-[70px]">{`Your data has been ${type === "create" ? "created": "updated"}`}</p>
            </div>
          </ModalSuccess>
        ) : null}
      </LayoutMenu>
    </div>
  );
};

export default FormAccountAddress;
