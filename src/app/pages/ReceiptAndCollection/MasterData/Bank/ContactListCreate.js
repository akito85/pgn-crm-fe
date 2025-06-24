import {
  DeleteOutlined,
  FilterOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { DatePicker, Form, Input, Select, Space, Spin, Tooltip } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../components/ButtonComponent";
import StatusComponent from "../../../../../components/StatusComponent";
import TablePagination from "../../../../../components/TablePagination";
import useGrantAccessHooks from "../../../../../components/useGrantAccessHooks";
import { dateFormatting, hasValue, toTitleCase } from "../../../../../utils";
import SVGIcon from "../../../../../assets/Icon/index";
import DynamicTableInlinePaymentAll from "../../DynamicTableInlinePaymentAll";
// import ModalChooseContact from "./Modal/ModalChooseContact";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import {
  getAllContactPaginate,
  getContryContact,
  getInputType,
  getInputTypeContact,
  getJobContact,
  getPositionContact,
  getZoneContact,
} from "../../../../../redux/slices/receipt_collection/bankSlice";
import DynamicTableInlineWithoutBase from "../../../../../components/Table/DynamicTableInlineWithoutBase";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import TableInlineContact from "../../../AccountManagement/CustomerAccountDetail/DetailPages/AccountContact/FormAccountContact/TableInlineContact";
import ContactTableInlane from "./Table/ContactTableInlane";
import {
  getColumnSearchProps,
  getColumnSearchPropsPaging,
} from "../../../../../utils/getColumnSearchProps";
import { showModalError } from "../../../../../redux/slices/general_slice";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import { object } from "prop-types";
import { onInputUpperCase } from "../../../AccountManagement/Utils";
import ModalContact from "../../../../../components/Modal/Contact/ModalContact";
import ModalChooseContact from "../../../../../components/Modal/Contact/ModalChooseContact";
import { getDetailContactAfterChoose, getListChooseContact } from "../../../../../redux/slices/account_management/detailAccount/accountContactSlice";

const ContactListCreate = ({
  id,
  contactTable = [],
  setContactTable,
  prefix1,
  setPrefix1,
  prefix2,
  setPrefix2,
  suffix,
  setSuffix,
  value,
  setValue,
  keyModal,
  setKeyModal,
  onSort,
  // getColumnSearchProps,
  codeBank,
  setCodeBank,
  filterDataByPage,
  onSortDetail,
  dataSource,
  setDataSource,
  data_job,
  data_position,
  data_contactType,
  data_countryZone,
  data_countryCode,
  data_inputType,
  pageContact,
  pageSizeContact,
  handleSearchData,
  setEmptyValueValidate = () => { },
  setIsEditing = () => { },
  isEditing,
  setModalValidate = () => { },
}) => {
  console.log(data_inputType);

  const { data_contact } = useSelector((state) => state.bank);
  const { data_detail } = useSelector((state) => state.accountContact);
  const dispatch = useDispatch();
  const [page, setPage] = useState([1]);
  const [pageSize, setPageSize] = useState([10]);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const access = useGrantAccessHooks();
  const [totalElements, setTotalElement] = useState(0);

  // modal contact
  const [openModalContact, setOpenModalContact] = useState(false);

  const dataContactList = (data_contact?.result || []).map((item) => {
    return {
      ...item,
      key: item?.id,
      contactDetails: (item?.contactDetails || []).map((itemDetail) => {
        return {
          ...itemDetail,
          key: itemDetail?.contactId,
        };
      }),
    };
  });
  const [pageData, setPageData] = useState([1]);
  const [pageSizeData, setPageSizeData] = useState([10]);

  //page buat choose modal
  const [pageChoose, setPageChoose] = useState([1]);
  const [pageSizeChoose, setPageSizeChoose] = useState([10]);
  const [onSortChoose, setOnSortChoose] = useState("");

  const onSortChoose1 = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setOnSortChoose(dataSort);
  };

  //state create
  const [dataTableDetail, setDataTableDetail] = useState([]);
  // const [dataSource, setDataSource] = useState([]);

  //modal contact
  const [modalChooseContact, setModalChooseContact] = useState(false);

  useEffect(() => {
    setTotalElement(dataTableDetail?.length);
  }, [dataTableDetail]);


  const dataContactType = data_contactType?.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  const dataCountryZone = data_countryZone?.map((item) => {
    return {
      value: item.id,
      label: item.text,
    };
  });

  const dataCountryCode = data_countryCode?.map((item) => {
    return {
      value: item.id,
      label: item.name,
      key: item?.code
    };
  });

  const dataInputType = data_inputType?.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  //handle table luar
  const handleChangeData = (pageChange, pageSizeChange) => {
    setPageData(pageSizeData !== pageSizeChange ? 1 : pageChange);
    setPageSizeData(pageSizeChange);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
    setSearch(
      selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`
    );
  };

  //table column contactList
  const columnBankCreate = (
    pageData,
    pageSizeData,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch,
    deleteRow = () => { }
  ) => [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) =>
          (pageData - 1) * pageSizeData + index + 1,
      },
      {
        title: "PRIMARY",
        dataIndex: "isPrimary",
        width: 150,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "isPrimary",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
        render: (v, r, i) => (
          <div className={" flex justify-center"}>
            {r.isPrimary ? (
              <StatusComponent colour={r?.isPrimary}>{toTitleCase(r.isPrimary)}</StatusComponent>
            ) : (
              ""
            )}
          </div>
        ),
      },
      {
        title: "CONTACT NAME",
        dataIndex: "contactName",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "contactName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text, record) => {
          return searchedColumn === "contactName" ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text}
            />
          ) : text ? (
            text
          ) : (
            ""
          )
        }
      },
      {
        title: "JOB TITLE",
        dataIndex: "jobId",
        sorter: true,
        align: "center",
        ...getColumnSearchPropsPaging(
          "jobId",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          searchedColumn === "jobId" ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={
                text
                  ? data_job &&
                  data_job.filter((a) => a.id === text)?.find((b) => b.name)
                    ?.name
                  : ""
              }
            />
          ) : text ? (
            <span>
              {data_job &&
                data_job.filter((a) => a.id === text)?.find((b) => b.name)?.name}
            </span>
          ) : (
            ""
          ),
      },
      {
        title: "POSITION",
        dataIndex: "positionId",
        sorter: true,
        align: "center",
        ...getColumnSearchPropsPaging(
          "positionId",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          searchedColumn === "positionId" ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={
                text
                  ? data_position &&
                  data_position
                    .filter((a) => a.id === text)
                    ?.find((b) => b.name)?.name
                  : ""
              }
            />
          ) : text ? (
            <span>
              {data_position &&
                data_position.filter((a) => a.id === text)?.find((b) => b.name)
                  ?.name}
            </span>
          ) : (
            ""
          ),
      },
      {
        title: "ACTION",
        align: "center",
        dataIndex: "key",
        width: 100,
        fixed: "right",
        render: (v, r, i) => {
          return (
            <div className="flex justify-center gap-2">
              <Tooltip title="Delete">
                <ButtonComponent
                  onClick={() => deleteRow(r?.key)}
                  icon={
                    <DeleteOutlined
                      style={{ fontSize: "24px", color: "#c81912" }}
                    />
                  }
                  border={false}
                />
              </Tooltip>
            </div>
          );
        },
      },
    ];

  //contact list setelah modal
  const expandedRowRender = (record) => {
    const column = [
      {
        title: "NO",
        align: "center",
        width: 60,
        render: (text, object, index) => index + 1,
      },
      {
        title: "TYPE",
        dataIndex: "type",
        width: 250,
        render: (type) => (
          <span>
            {data_contactType &&
              data_contactType.filter((a) => a.id === type)?.find((b) => b.name)
                ?.name}
          </span>
        ),
      },
      {
        title: "INPUT TYPE",
        dataIndex: "inputType",
        ...getColumnSearchProps("inputType"),
        render: (inpuType) => {

          return (
            <span>
              {data_inputType &&
                data_inputType
                  .filter((a) => a.id === inpuType)
                  .find((b) => b.name)?.name}
            </span>
          )
        },
      },
      {
        title: "VALUE",
        dataIndex: "value",
        // width: 350,
        render: (_, record) => {
          return <span>{record.fullValue}</span>
        },
      },
    ];

    console.log(record);

    return (
      <div>
        <TablePagination
          useSelect={false}
          usePagination={false}
          onSort={onSort}
          dataSource={record?.id ? record?.contactDetails : record?.viewDetails}
          columns={column}
        />
      </div>
    );
  };



  //paging table contact list paling depan
  const paginationTable = (typeData = "data") => {
    let result = [...dataSource];
    if (searchedColumn) {
      const fixSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        if (searchedColumn === "jobId") {
          const data = item[searchedColumn] || 0;
          const jobName = data_job
            .filter((a) => a.id === data)
            ?.find((b) => b.name)?.name;
          return (jobName || "").toLowerCase().includes(fixSearchText);
        }
        if (searchedColumn === "positionId") {
          const data = item[searchedColumn] || 0;
          const posName = data_position?.filter((a) => a?.id === data)?.[0]
            ?.name;
          return (posName || "").toLowerCase().includes(fixSearchText);
        }
        return item[searchedColumn]?.toLowerCase().includes(fixSearchText);
      });
    }
    const fix = result.slice(
      (pageData - 1) * pageSizeData,
      pageData * pageSizeData
    );
    return typeData === "data" ? fix : result.length;
  };

  //deleteRow
  const deleteRow = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataTableDetail([]);
    setDataSource(newData);
    setPrefix1("");
    setPrefix2("");
    setValue("");
    setSuffix("");
    setTypeContact('default')
  };

  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");

  const [formContact] = Form.useForm();
  const [formModal] = Form.useForm();
  const [typeContact, setTypeContact] = useState('default');
  const [listTableContact, setListTableContact] = useState([])
  const [tempListContact, setTempListContact] = useState([]);


  const assertChoose = useCallback((data) => {
    if (typeContact === 'choosed') {
      formModal?.setFieldsValue({
        firstName: data?.firstName,
        middleName: data?.middleName,
        lastName: data?.lastName,
        jobId: data?.jobId,
        positionId: data?.positionId,
        isPrimary: data?.primary,
        contactAddressId: data?.contactAddressId,
        additionalNote: data?.additionalNote,
        description: data?.description
      })
      setListTableContact(data?.contactDetail?.map((item, index) => {
        if (hasValue(item?.prefix1)) {
          dispatch(getZoneContact(item?.prefix1))
        }
        return {
          key: (index + 1).toString(),
          type: item?.type,
          inputType: item?.inputType,
          contactDetailId: item?.contactDetailId,
          prefix_1: hasValue(item?.valueDetail?.prefix1) ? item?.valueDetail?.prefix1 : null,
          prefix_2: hasValue(item?.valueDetail?.prefix2) ? item?.valueDetail?.prefix2 : null,
          sufix: hasValue(item?.valueDetail?.sufix) ? item?.valueDetail?.sufix : null,
          value: hasValue(item?.valueDetail?.value) ? item?.valueDetail?.value : null,
          fullValue: item?.fullValue,
          values: [
            {
              prefix_1: hasValue(item?.valueDetail?.prefix1) ? item?.valueDetail?.prefix1 : null,
              prefix_2: hasValue(item?.valueDetail?.prefix2) ? item?.valueDetail?.prefix2 : null,
              sufix: hasValue(item?.valueDetail?.sufix) ? item?.valueDetail?.sufix : null,
              value: hasValue(item?.valueDetail?.value) ? item?.valueDetail?.value : null,
            }
          ]
        }
      }));
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
        description: data?.description
      })
      setListTableContact(data?.contact?.contactDetail?.map((item, index) => {
        if (hasValue(item?.prefix1)) {
          dispatch(getZoneContact(item?.prefix1))
        }
        return {
          key: (index + 1).toString(),
          type: item?.type,
          inputType: item?.inputType,
          contactDetailId: item?.contactDetailId,
          prefix_1: hasValue(item?.valueDetail?.prefix1) ? item?.valueDetail?.prefix1 : null,
          prefix_2: hasValue(item?.valueDetail?.prefix2) ? item?.valueDetail?.prefix2 : null,
          sufix: hasValue(item?.valueDetail?.sufix) ? item?.valueDetail?.sufix : null,
          value: hasValue(item?.valueDetail?.value) ? item?.valueDetail?.value : null,
          fullValue: item?.fullValue,
          values: [
            {
              prefix_1: hasValue(item?.valueDetail?.prefix1) ? item?.valueDetail?.prefix1 : null,
              prefix_2: hasValue(item?.valueDetail?.prefix2) ? item?.valueDetail?.prefix2 : null,
              sufix: hasValue(item?.valueDetail?.sufix) ? item?.valueDetail?.sufix : null,
              value: hasValue(item?.valueDetail?.value) ? item?.valueDetail?.value : null,
            }
          ]
        }
      }));
    }
  }, [dispatch, formModal, typeContact])


  const assertCancelConfirmation = useCallback(data => {
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
        description: data?.description
      })
      setListTableContact(tempListContact)
    }

  }, [formModal, tempListContact])

  const conditionalChoosedByTypeContact = useCallback((typeContact) => {
    if (typeContact === 'choosed') {
      return data_detail?.data;
    } else {
      return data_detail;
    }
  }, [data_detail]);

  useEffect(() => {
    if ((typeContact === 'choosed' || typeContact === 'update')) {
      assertChoose(conditionalChoosedByTypeContact(typeContact))
    } else if (typeContact === 'cancel create') {
      // assertCancelConfirmation(body)
    }
  }, [assertChoose, conditionalChoosedByTypeContact, typeContact, assertCancelConfirmation])

  console.log(data_detail?.data?.id, typeContact);

  const handleSaveContact = useCallback((formValue, tableData) => {
    const tempDataPrimary = [...dataSource?.filter(item => item?.isPrimary === 'primary')];
    const setContactName = (record) => {
      const firstName = hasValue(record?.firstName) ? record?.firstName : ''
      const middleName = hasValue(record?.middleName) ? record?.middleName : ''
      const lastName = hasValue(record?.lastName) ? record?.lastName : ''
      return `${firstName} ${middleName} ${lastName}`;
    }

    let contactDetails = {
      ...formValue,
      contactId: hasValue(data_detail?.data?.id) && typeContact === 'choosed' ? data_detail?.data?.id : null,
      contactName: setContactName(formValue),
      isPrimary: hasValue(formValue?.isPrimary) && formValue?.isPrimary === true ? 'primary' : 'non primary',
      viewDetails: tableData?.map(item => (
        {
          type: item?.type?.value,
          inputType: item?.inputType?.value,
          value: hasValue(item?.values[0]?.value) ? item?.values[0]?.value : null,
          prefix1: hasValue(item?.values[0]?.prefix_1?.value) ? item?.values[0]?.prefix_1?.value : null,
          prefix2: hasValue(item?.values[0]?.prefix_2?.value) ? item?.values[0]?.prefix_2?.value : null,
          sufix: hasValue(item?.values[0]?.sufix) ? item?.values[0]?.sufix : null,
          fullValue: item?.fullValue
        })
      )
    }


    if (tableData?.length === 0) {
      const errorBody = {
        title: "Attention",
        description: `Your data was not created. Please input your contact detail. Please try again.`,
      };
      dispatch(showModalError(errorBody));
    } else if (tempDataPrimary?.length > 0 && formValue?.isPrimary === true) {
      setDataSource(prevState => {
        const newKey = prevState?.length + 1;
        const newArray = prevState?.map(item => ({ ...item, isPrimary: item?.isPrimary === 'primary' ? 'non primary' : item?.isPrimary }))

        const contacts = {
          ...contactDetails,
          key: newKey,
          id: null
        };
        return [...newArray, contacts]
      })
    } else {
      setDataSource(prevState => {
        const newKey = prevState?.length + 1
        let contacts;

        contacts = {
          ...contactDetails,
          key: newKey,
          id: null
        }
        return [...prevState, contacts]
      })
      setOpenModalContact(false)
    }
    setTypeContact('default')
    formContact.resetFields()
    formModal.resetFields()
  }, [dataSource, dispatch, formContact, formModal, setDataSource, typeContact, data_detail])

  console.log(dataSource);

  return (
    <div>
      {/* <DynamicTableInlinePaymentAll columns={columns} onSort={onSort} /> */}
      <Spin spinning={false}>
        <BaseContainer header={"CONTACT LIST"}>
          <div className="flex w-full justify-end gap-3 mb-5">
            <ButtonComponent
              icon={
                <SVGIcon name="IconButtonCreate" color={"#FFFFFF"} width={24} />
              }
              type="submit"
              onClick={() => {
                // setKeyModal(dataSource?.length + 1);
                // hanldeModalChoose();
                setOpenModalContact(true)
              }}
            >
              Create
            </ButtonComponent>
          </div>
          <div className="w-full">
            <TablePagination
              dataSource={paginationTable("data")}
              // dataSource={dataSource}
              totalData={paginationTable("lenght")}
              // totalData={dataSource.length}
              current={pageData}
              pageSize={pageSizeData}
              onChange={handleChangeData}
              columns={columnBankCreate(
                pageData,
                pageSizeData,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                deleteRow
              )}
              onSort={onSort}
              tableScrolled={{ y: 525, x: 1300 }}
              expandable={{
                expandedRowRender,
              }}
            />
          </div>
        </BaseContainer>



        {/* new modal contact dinamis */}
        <ModalContact
          dataTable={listTableContact}
          setDataTable={setListTableContact}
          formContact={formContact}
          formModal={formModal}
          open={openModalContact}
          setOpen={setOpenModalContact}
          module_name={'payment'}
          data_exist={{
            data_detail: data_detail,
            id: id
          }}
          datas_option={
            {
              data_job: data_job?.map(item => ({ label: item?.name, value: item?.id })),
              data_position: data_position?.map(item => ({ label: item?.name, value: item?.id })),
              // data_contact_address: data_contact_address?.map(item => ({ label: item?.fullAddress, value: item?.addressId, key: item?.addressId })),
              data_input_type: dataInputType,
              data_contact_type: dataContactType,
              data_country_code: dataCountryCode,
              data_country_zone: dataCountryZone,
              data_choose_contact: data_contact,
              // data_detail_choosed: conditionalChoosedByTypeContact(typeContact)
            }
          }
          dispatcher={{
            dispatcherCountryZone: (id) => getZoneContact(id)
          }}
          dispatcherChooseContact={
            {
              disptachListChoose: (page, pageSize, sort, search) => dispatch(getAllContactPaginate({ search: encodeURIComponent(JSON.stringify(search)), page, pageSize, sort }))?.unwrap(),
              dispatchChooseDetail: (id) => {
                dispatch(getDetailContactAfterChoose(id))
              }
            }
          }
          handleSaveContact={handleSaveContact}
          typeContact={typeContact}
          setTypeContact={setTypeContact}
          setTempData={setTempListContact}
        />
      </Spin>
    </div>
  );
};

export default ContactListCreate;
