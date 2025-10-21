import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spin, Form, Alert, Checkbox, Tooltip } from "antd";
import Highlighter from "react-highlight-words";
import { PlusOutlined, WarningOutlined } from "@ant-design/icons";

import StatusComponent from "../../../../../../components/StatusComponent";
import TablePagination from "../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../assets/Icon/index";
import BaseContainer from "../../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import ModalDetail from "./ModalDetail";
import ModalUpdate from "./ModalUpdate";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";
import {
  getListDetailAccountContact,
  activationAccountContact,
  getDetailAccountContact,
  getListChooseContact,
  getJob,
  getContactType,
  getPosition,
  getCountryCode,
  getContactAddress,
  getCountryZone,
  getInputType,
  getDetailContactAfterChoose,
  createAccountContact,
  updateAccountContact,
} from "../../../../../../redux/slices/account_management/detailAccount/accountContactSlice";
import { hasValue, renderColumn } from "../../../../../../utils";
import {
  getColumnSearchProps,
  getColumnSearchPropsPaging,
} from "../../../../../../utils/getColumnSearchProps";
import ToolbarAccount from "../../../ComponentAccount/ToolbarAccount";
import { useColumnActionPermissionAccount } from "../../../ComponentAccount/ColumnActionPermissionAccount";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";
import ModalContact from "../../../../../../components/Modal/Contact/ModalContact";
import { ModalConfirm } from "../../../../../../components/Modal/ModalPopUp";
import {
  clearBodyMessage,
  hideModalError,
  validateCreateUpdate,
} from "../../../../../../redux/slices/general_slice";
import accountManagementService from "../../../../../../redux/services/account_management/accountManagementService";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import DetailText from "../../../../../../components/DetailText";
import TableContact from "../../../../../../components/Table/Contact/TableContact";
import { sorterFunction } from "../../../../../../utils/sorterFunction";
import { useLocation } from "react-router-dom";

const expandedRowRender = (record) => {
  const dataExpand = record?.contactDetails;

  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: "TYPE",
      dataIndex: "typeName",
    },
    {
      title: "VALUE",
      dataIndex: "contactValue",
    },
  ];
  return (
    <div>
      <p className="text-primary text-xs font-bold uppercase">CONTACT DETAIL</p>
      <TablePagination
        useSelect={false}
        usePagination={false}
        // className="table-expand-custom"
        dataSource={dataExpand}
        columns={columns}
        tableScrolled={{
          x: 1300,
        }}
      />
    </div>
  );
};

const AccountContact = ({ id, idCustomer, type }) => {
  const dispatch = useDispatch();
  const {
    data,
    data_detail,
    loading,
    data_choose_contact,
    data_job,
    data_position,
    data_contact_address = [],
    data_contactType,
    data_inputType,
    data_country_code,
    data_country_zone = [],
  } = useSelector((state) => state.accountContact);
  const { access_account } = useSelector((state) => state.accountManagement);
  const [page, setPage] = useState(1);
  const [modalDetail, setModalDetail] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalActivate, setModalActivate] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  // const [id, setId] = useState(1);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [titleActiveOrInactive, setTitleActiveOrInactive] = useState("");
  const [chooseId, setChooseId] = useState();
  const [dataTable, setDataTable] = useState([]);
  const [accountContactId, setAccountContactId] = useState("");
  const [contactName, setContactName] = useState("");
  const [form] = Form.useForm();
  const [modalCheckPrimaryExist, setModalCheckPrimaryExist] = useState(false);
  const [body, setBody] = useState({});
  const [modalConfirm, setModalConfirm] = useState(false);
  const [typeContact, setTypeContact] = useState("default");
  const [formModal] = Form.useForm();
  const [formContact] = Form.useForm();
  const [listTableContact, setListTableContact] = useState([]);
  const [tempListContact, setTempListContact] = useState([]);
  const location = useLocation();
  // state contact global
  const [openModalContact, setOpenModalContact] = useState(false);

  const assertChoose = useCallback(
    (data) => {
      if (typeContact === "choosed") {
        formModal?.setFieldsValue({
          firstName: data?.firstName,
          middleName: data?.middleName,
          lastName: data?.lastName,
          jobId: data?.jobId,
          positionId: data?.positionId,
          isPrimary: data?.primary,
          contactAddressId: data?.contactAddressId,
          additionalNote: data?.additionalNote,
          description: data?.description,
        });
        setListTableContact(
          data?.contactDetail?.map((item, index) => {
            if (hasValue(item?.prefix1)) {
              dispatch(getCountryZone(item?.prefix1));
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
      } else {
        formModal?.setFieldsValue({
          firstName: data?.contact?.firstName,
          middleName: data?.contact?.middleName,
          lastName: data?.contact?.lastName,
          jobId: data?.contact?.jobId,
          positionId: data?.contact?.positionId,
          isPrimary: data?.primaryFlag,
          contactAddressId: data?.contactAddressId,
          additionalNote: data?.additionalNote,
          description: data?.description,
        });
        setListTableContact(
          data?.contact?.contactDetail?.map((item, index) => {
            if (hasValue(item?.prefix1)) {
              dispatch(getCountryZone(item?.prefix1));
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
    [dispatch, formModal, typeContact],
  );

  const assertCancelConfirmation = useCallback(
    (data) => {
      if (hasValue(data)) {
        formModal?.setFieldsValue({
          firstName: data?.contact?.firstName,
          middleName: data?.contact?.middleName,
          lastName: data?.contact?.lastName,
          jobId: data?.contact?.jobId,
          positionId: data?.contact?.positionId,
          isPrimary: data?.primaryFlag,
          contactAddressId: data?.contactAddressId,
          additionalNote: data?.additionalNote,
          description: data?.description,
        });
        setListTableContact(tempListContact);
      }
    },
    [formModal, tempListContact],
  );

  const conditionalChoosedByTypeContact = useCallback(
    (typeContact) => {
      if (typeContact === "choosed") {
        return data_detail?.data;
      } else {
        return data_detail;
      }
    },
    [data_detail],
  );

  useEffect(() => {
    if (modalConfirm === false) {
      if (typeContact === "choosed" || typeContact === "update") {
        assertChoose(conditionalChoosedByTypeContact(typeContact));
      } else if (typeContact === "cancel create" && hasValue(body)) {
        assertCancelConfirmation(body);
      }
    }
  }, [
    assertChoose,
    conditionalChoosedByTypeContact,
    typeContact,
    modalConfirm,
    body,
    assertCancelConfirmation,
  ]);

  useEffect(() => {
    if (location?.pathname.includes("account-standard")) {
      dispatch(
        getGrantedAccessAccount("/account-management/account-standard/contact"),
      );
    } else {
      dispatch(
        getGrantedAccessAccount("/account-management/account-onetime/contact"),
      );
    }
  }, [dispatch]);

  useEffect(() => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(
      getListDetailAccountContact({
        id,
        page,
        pageSize,
        search: reqSearch,
        sort,
      }),
    );
  }, [dispatch, id, search, sort, page, pageSize]);

  useEffect(() => {
    if (id) {
      dispatch(getJob());
      dispatch(getPosition());
      dispatch(getContactType());
      dispatch(getInputType());
      dispatch(getCountryCode());
      dispatch(getContactAddress(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (data?.result && data?.result.length > 0) {
      const dataModif = data?.result.map((a, index) => ({
        ...a,
        key: index + 1,
        contactDetail: a.contactDetail?.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setDataTable(dataModif);
    } else {
      setDataTable([]);
    }
  }, [data]);

  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // const handleSearch = (selectedKeys, confirm, dataIndex) => {
  //   confirm();
  //   setSearchText(selectedKeys[0]);
  //   setSearchedColumn(selectedKeys[0] ? dataIndex : "");
  //   setSearch((prevState) => {
  //     if (prevState[dataIndex] !== selectedKeys[0]) {
  //       setPage(1);
  //     }
  //     return {
  //       ...prevState,
  //       [dataIndex]: selectedKeys[0],
  //     };
  //   });
  // };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    if (!selectedKeys[0]) {
      setSearchText("");
      setSearchedColumn("");
      setSearch((prevState) => {
        if (prevState[dataIndex]) {
          setPage(1); // Reset the page only if there was a previous search
        }
        const { [dataIndex]: _, ...rest } = prevState; // Remove the current dataIndex from state
        return rest;
      });
      return;
    }

    if (dataIndex !== "primaryFlag") {
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
    } else {
      // Map "primary" and "non primary" to the required structure
      const tempSearchedText =
        selectedKeys[0] === "primary"
          ? "Y"
          : selectedKeys[0] === "non primary"
            ? "N"
            : ""; // Handle cases where selectedKeys[0] is not valid

      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
      setSearch((prevState) => {
        if (prevState[dataIndex]?.value !== tempSearchedText?.value) {
          setPage(1);
        }
        return {
          ...prevState,
          [dataIndex]: tempSearchedText,
        };
      });
    }
  };

  // Search Column Table
  const onSort = (_, __, sort) => {
    const dataOrder = sort.order === "ascend" ? "asc" : "desc";
    const dataSort = sort.order ? `${sort.field}~${dataOrder}` : "";
    setSort(dataSort);
  };

  // Handle Cancel Modal Active/Inactive
  const handleCancel = () => {
    setModalActivate(false);
    // setRemark("");
    form.resetFields();
  };

  // Handle Confirmation Active/Inactive
  const handleActiveOrInactive = (record) => {
    setContactName(record?.contactName);
    setModalActivate(true);
    setTitleActiveOrInactive(
      record?.status === "ACTIVE" ? "Inactivate" : "Activate",
    );
    setAccountContactId(record?.accountContactId);
    setChooseId(record?.contactId);
  };

  // Handle Confirm Modal Active/Inactive
  const handleConfirmActivation = (formValue, handleClear) => {
    setModalActivate(false);
    const data = {
      accountId: id,
      contactId: chooseId,
      remark: formValue.remark,
      accountContactId: accountContactId,
    };

    dispatch(
      activationAccountContact({
        body: data,
        title: titleActiveOrInactive,
      }),
    )
      .unwrap()
      .then(() => {
        // setRemark("");
        handleClear();
        form.resetFields();

        const reqSearch = encodeURIComponent(JSON.stringify(search));
        dispatch(
          getListDetailAccountContact({
            id,
            page,
            pageSize,
            search: reqSearch,
            sort,
          }),
        );
      })
      .catch(() => {
        // setRemark("");
        handleClear();
        form.resetFields();
      });
  };

  const columns = (
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => {},
  ) => {
    return [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "PRIMARY",
        dataIndex: "primaryFlag",
        width: 150,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "primaryFlag",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        // render: (v, r, i) => (
        //   <div className={" flex justify-center"}>
        //     {r.primaryFlagValue ? (
        //       <StatusComponent colour={"active"}>{r.primaryFlag}</StatusComponent>
        //     ) : (
        //       ""
        //     )}
        //   </div>
        // ),
        render: (data, record, index) => {
          let text;
          switch (record?.primaryFlagValue) {
            case true:
              text = "Primary";
              break;
            case false:
              text = "Non Primary";
              break;
            default:
              text = index
                ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
                : index;
              break;
          }
          return text ? (
            <div className={"flex justify-center"}>
              <StatusComponent colour={text}>{text}</StatusComponent>
            </div>
          ) : (
            text
          );
        },
      },
      {
        title: "CONTACT NAME",
        dataIndex: "contactName",
        width: 250,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "contactName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "JOB",
        dataIndex: "jobName",
        width: 150,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "jobName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "POSITION",
        dataIndex: "positionName",
        width: 150,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "positionName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "CONTACT ADDRESS",
        dataIndex: "contactAddress",
        width: 350,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "contactAddress",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        ellipsis: {
          showTitle: false,
        },
        render: (text) =>
          searchedColumn === "contactAddress" ? (
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
          ) : text ? (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ) : (
            ""
          ),
      },
      {
        title: "Contact Address Additional Note"?.toUpperCase(),
        dataIndex: "additionalNote",
        width: 340,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "additionalNote",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "DESCRIPTION",
        dataIndex: "description",
        width: 350,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "description",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
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
          ) : text ? (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ) : (
            ""
          ),
      },
      {
        title: "STATUS",
        dataIndex: "status",
        width: 140,
        fixed: "right",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "status",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (index) => {
          const text = index
            ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
            : index;
          return text ? (
            <div className={" flex justify-center"}>
              <StatusComponent colour={index}>{text}</StatusComponent>
            </div>
          ) : (
            text
          );
        },
      },
    ];
  };

  const itemActions = [
    //action toolbar
    {
      action: "Create",
      render: (
        <ButtonComponent
          onClick={() => {
            setOpenModalContact(true);
            setTypeContact("default");
          }}
          icon={<PlusOutlined style={{ fontSize: "24px" }} />}
          type="submit"
        >
          Create Contact
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
                color={"#0075bf"}
                width={24}
                onClick={() => {
                  setModalDetail(true);
                  dispatch(getDetailAccountContact(record.accountContactId));
                }}
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
                color={record?.status === "INACTIVE" ? "#8D91A0" : "#ACC424"}
                className={
                  record?.status === "INACTIVE"
                    ? "cursor-not-allowed"
                    : undefined
                }
                width={24}
                onClick={
                  record?.status === "INACTIVE"
                    ? null
                    : () => {
                        setOpenModalContact(true);
                        dispatch(
                          getDetailAccountContact(record.accountContactId),
                        );
                        setTypeContact("update");
                      }
                }
              />
            </div>
          </Tooltip>
          // <ButtonComponent
          //   onClick={() => {
          //     setOpenModalContact(true)
          //     dispatch(getDetailAccountContact(record.accountContactId));
          //     setTypeContact('update')
          //   }}
          //   icon={<SVGIcon name="IconEdit" width={24}
          //     color={record?.status === 'INACTIVE' ? "#8D91A0" : "#ACC424"}
          //   />}
          //   border={false}
          //   disabled={record?.status === 'INACTIVE'}
          // />
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

  const handleSaveContact = useCallback(
    async (formValue, tableData) => {
      try {
        let body;
        let url;
        const contactNameValue = `${formValue.firstName.trim()}${
          formValue.middleName ? ` ${formValue.middleName.trim()}` : ""
        }${formValue.lastName ? ` ${formValue.lastName.trim()}` : ""}`;

        // set contact id
        const setContactId = (data) => {
          if (typeContact === "update") {
            return data?.accountContactId;
          } else if (typeContact === "choosed") {
            return data?.data?.id;
          } else {
            return null;
          }
        };

        const setAccountContactId = (data) => {
          if (typeContact === "update") {
            return data?.accountContactId;
          } else {
            return null;
          }
        };

        if (typeContact === "update") {
          url = "/v1/dbs/api/account/contact/validate-update";
        } else {
          url = "/v1/dbs/api/account/contact/validate-create";
        }

        body = {
          accountId: id,
          accountContactId: setAccountContactId(data_detail),
          primaryFlag: hasValue(formValue?.isPrimary)
            ? formValue?.isPrimary
            : false,
          needValidation: hasValue(formValue?.isPrimary)
            ? formValue?.isPrimary
            : false,
          contactAddressId: hasValue(formValue?.contactAddressId)
            ? formValue?.contactAddressId
            : null,
          additionalNote: hasValue(formValue?.additionalNote)
            ? formValue?.additionalNote
            : null,
          description: hasValue(formValue?.description)
            ? formValue?.description
            : null,
          contact: {
            contactId: setContactId(data_detail),
            firstName: hasValue(formValue?.firstName)
              ? formValue?.firstName
              : null,
            middleName: hasValue(formValue?.middleName)
              ? formValue?.middleName
              : null,
            lastName: hasValue(formValue?.lastName)
              ? formValue?.lastName
              : null,
            contactName: contactNameValue,
            jobId: hasValue(formValue?.jobId) ? formValue?.jobId : null,
            positionId: hasValue(formValue?.positionId)
              ? formValue?.positionId
              : null,
            viewDetails: tableData?.map((item, index) => {
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
          },
          tableData: tableData,
        };

        setBody(body);
        await dispatch(
          validateCreateUpdate({
            body: body,
            services: accountManagementService,
            endPoint: url,
            type,
          }),
        )?.unwrap();
        setTempListContact(tableData);
        setModalConfirm(true);
      } catch (error) {
        if (
          error?.message ===
          "Warning! the previous primary Account Contact will be inactived"
        ) {
          dispatch(hideModalError());
          dispatch(clearBodyMessage());
          setModalCheckPrimaryExist(true);
        }
        setTypeContact("error");
        setListTableContact([]);
        formModal?.resetFields();
        formContact?.resetFields([["values", 0]]);
      }
    },
    [data_detail, dispatch, formContact, formModal, id, type, typeContact],
  );

  const handleConfirm = useCallback(async () => {
    try {
      const { tableData, ...bodyData } = body;
      if (typeContact === "update") {
        const bodyReq = {
          accountId: body?.id,
          primaryFlag: body?.primaryFlag,
          contactId: body?.contactId,
          accountContactId: body?.accountContactId,
          description: body?.description,
          additionalNote: body?.additionalNote,
          needValidation: false,
        };
        await dispatch(updateAccountContact({ body: bodyReq }))?.unwrap();
      } else {
        const bodyReq = {
          ...bodyData,
          needValidation: false,
        };
        await dispatch(createAccountContact({ body: bodyReq }))?.unwrap();
      }
      setModalConfirm(false);
      const reqSearch = encodeURIComponent(JSON.stringify(search));
      await dispatch(
        getListDetailAccountContact({
          id,
          page,
          pageSize,
          search: reqSearch,
          sort,
        }),
      )?.unwrap();
      setTypeContact("default");
      formModal?.resetFields();
      formContact?.resetFields([["values", 0]]);
      setListTableContact([]);
    } catch (error) {}
  }, [
    body,
    dispatch,
    formContact,
    formModal,
    id,
    page,
    pageSize,
    search,
    sort,
    typeContact,
  ]);

  // column contact confirmation
  const columnsConfirmation = useMemo(() => {
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
        // onClick: (e) => handleChangeType(e),
        // options: datas_option?.data_contact_type,
        // rules: formMessageRequired('Type'),
        ...getColumnSearchProps(
          "type",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "type",
            searchedColumn,
            searchText,
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
        ...getColumnSearchProps(
          "inputType",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "inputType",
            searchedColumn,
            searchText,
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
        // options: {
        //   country_code: datas_option?.data_country_code,
        //   country_zone: datas_option?.data_country_zone
        // },
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchProps(
          "value",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "contact",
        ),
        render: (text, record, id) => {
          return renderColumn(
            "value",
            searchedColumn,
            searchText,
            record?.fullValue,
            true,
            "input",
            search,
          );
        },
      },
    ];
  }, [searchedColumn, searchText, page, pageSize, search]);

  return (
    <>
      <Spin spinning={loading}>
        <BaseContainer header={"ACCOUNT CONTACT LIST"}>
          <div className="flex w-full justify-end gap-3 mb-5">
            <ToolbarAccount
              items={itemActions}
              advancedAccess={access_account}
            />
          </div>
          <div className={"w-full"}>
            <TablePagination
              dataSource={data && data?.length === 0 ? null : dataTable}
              columns={[
                ...columns(
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch,
                ),
                ...useColumnActionPermissionAccount(
                  ["Activate", "View", "Update"],
                  itemActions,
                  access_account,
                ),
              ]}
              pageSize={pageSize}
              current={page}
              expandable={{ expandedRowRender }}
              totalData={data?.page?.totalElements}
              onChange={handleChangeSize}
              onSort={onSort}
              tableScrolled={{ x: 1300 }}
            />
          </div>
        </BaseContainer>
      </Spin>

      {/* Modal Update */}
      <ModalDetail
        isOpen={modalDetail}
        closeModal={setModalDetail}
        dataDetail={data_detail}
      />

      {/* Modal Update */}
      <ModalUpdate isOpen={modalUpdate} closeModal={setModalUpdate} />

      {/* Modal Activate */}
      <ModalApproveOrReject
        isOpen={modalActivate}
        handleCloseModal={handleCancel}
        onFinish={handleConfirmActivation}
        header={titleActiveOrInactive}
        approveOrReject={titleActiveOrInactive}
        menu={"Contact"}
        named={contactName}
      />

      {/* // new contact */}
      <ModalContact
        dataTable={listTableContact}
        setDataTable={setListTableContact}
        formContact={formContact}
        formModal={formModal}
        open={openModalContact}
        setOpen={setOpenModalContact}
        module_name={"contact"}
        data_exist={{
          data_detail: data_detail,
          id: id,
        }}
        datas_option={{
          data_job: data_job?.map((item) => ({
            label: item?.text,
            value: item?.id,
          })),
          data_position: data_position?.map((item) => ({
            label: item?.text,
            value: item?.id,
          })),
          data_contact_address: data_contact_address?.map((item) => ({
            label: item?.fullAddress,
            value: item?.addressId,
            key: item?.addressId,
          })),
          data_input_type: data_inputType?.map((item) => ({
            label: item?.text,
            value: item?.id,
          })),
          data_contact_type: data_contactType?.map((item) => ({
            label: item?.text,
            value: item?.id,
            key: item?.code,
          })),
          data_country_code: data_country_code?.map((item) => ({
            label: item?.text,
            value: item?.id,
          })),
          data_country_zone: data_country_zone?.map((item) => ({
            label: item?.text,
            value: item?.id,
          })),
          data_choose_contact: data_choose_contact,
          // data_detail_choosed: conditionalChoosedByTypeContact(typeContact)
        }}
        dispatcher={{
          dispatcherCountryZone: (id) => getCountryZone(id),
        }}
        dispatcherChooseContact={{
          disptachListChoose: (page, pageSize, sort, search) =>
            dispatch(
              getListChooseContact({
                id: idCustomer,
                search: encodeURIComponent(JSON.stringify(search)),
                page,
                pageSize,
                sort,
              }),
            )?.unwrap(),
          dispatchChooseDetail: (id) => {
            dispatch(getDetailContactAfterChoose(id));
          },
        }}
        handleSaveContact={handleSaveContact}
        typeContact={typeContact}
        setTypeContact={setTypeContact}
        setTempData={setTempListContact}
      />

      <ModalConfirm
        isOpen={modalCheckPrimaryExist}
        handleCancel={() => {
          setModalCheckPrimaryExist(false);
        }}
        handleOk={() => {
          setModalCheckPrimaryExist(false);
          setModalConfirm(true);
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

      {/* modal confirm */}
      <ModalCustom
        isOpen={modalConfirm}
        type={"confirmation"}
        header={"confirmation"}
        width={1000}
        handleCancel={() => {
          if (typeContact === "default") setTypeContact("cancel create");
          setModalConfirm(false);
          setOpenModalContact(true);
        }}
        footer={
          <div className={"w-full flex justify-end gap-5"}>
            <ButtonComponent
              type={"default"}
              onClick={() => {
                if (typeContact === "default") setTypeContact("cancel create");
                setModalConfirm(false);
                setOpenModalContact(true);
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
              {body?.contact?.firstName}
            </DetailText>
            <DetailText label="Middle Name">
              {body?.contact?.middleName}
            </DetailText>
            <DetailText label="Last Name">{body?.contact?.lastName}</DetailText>
            <DetailText label="Job">
              {
                data_job?.find((item) => item?.id === body?.contact?.jobId)
                  ?.text
              }
            </DetailText>
            <DetailText label="Position">
              {
                data_position?.find(
                  (item) => item?.id === body?.contact?.positionId,
                )?.text
              }
            </DetailText>
          </div>

          {/* Table */}
          <div className="w-full py-6">
            <span className="text-primary uppercase font-bold mt-[30px]">
              CONTACT DETAIL
            </span>

            <div className="w-full pt-[30px]">
              <TableContact
                cols={columnsConfirmation}
                dataTable={body?.tableData}
                setDataTable={setDataTable}
                form={formContact}
                // editRecords={editRecord}
                actionButtons={[]}
                // changePrefix={changePrefix}
                // onChangePage={handleChange}
                // onSizeChanger={handleChange}
                page={1}
                pageSize={10}
                showButtonCreate={false}
              />
            </div>
          </div>

          <span className="text-primary uppercase font-bold">
            CONTACT PURPOSE INFORMATION
          </span>
          <div className="w-full grid grid-cols-3 gap-5 pt-[30px]">
            <DetailText label="Primary Contact">
              {body?.primaryFlag ? "Yes" : "No"}
            </DetailText>
            <DetailText label="Contact Address">
              {
                data_contact_address?.find(
                  (item) => item?.addressId === body?.contactAddressId,
                )?.fullAddress
              }
            </DetailText>
            <DetailText label="Contact Address Additional Note">
              {body?.additionalNote}
            </DetailText>
            <div className="col-span-3">
              <DetailText label="Description">{body?.description}</DetailText>
            </div>
          </div>
        </div>
      </ModalCustom>
    </>
  );
};

export default AccountContact;
