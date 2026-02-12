import {
  LeftOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Alert, Form, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import {
  ModalConfirm,
  ModalError,
  ModalSuccess,
} from "../../../../../components/Modal/ModalPopUp";
import RadioTabs from "../../../../../components/RadioTabs";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import {
  createMasterBank,
  createValidasiBank,
  getAllApprovalList,
  getAllBankNotBranch,
  getBankDetail,
  getContryContact,
  getInputType,
  getInputTypeContact,
  getJobContact,
  getListApprovalById,
  getListCategory,
  getPositionContact,
  getZoneContact,
} from "../../../../../redux/slices/receipt_collection/bankSlice";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import BankCreate from "./BankCreate";
import SVGIcon from "../../../../../assets/Icon/index";
import ContentModalConfirmBank from "./ContentModalConfirmBank";
import ContactListCreate from "./ContactListCreate";
import TablePagination from "../../../../../components/TablePagination";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import {
  showModalError,
  showModalSuccess,
} from "../../../../../redux/slices/general_slice";
import { bytesConverter } from "../../../../../utils/bytesConverter";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import { configApp } from "../../../../../constants/configApp";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import { intToNPWP } from "../../../../../utils/npwp";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";

const BankForm = ({ type }) => {
  const {
    dataListAppHierId,
    dataListAppHierDetail,
    dataBankNotBranch,
    loading,
    data_job,
    data_position,
    data_inputType,
    data_contactType,
    data_detail,
    data_countryZone,
    data_countryCode,
  } = useSelector((state) => state.bank);

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const location = useLocation();
  const id = location?.state?.id;
  const [codeBank, setCodeBank] = useState("");
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [modalConfirm, setModalConfirm] = useState(false);
  const [tableDatas, setTableDatas] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [modalBack, setModalBack] = useState(false);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [forceObj, setForceObj] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const searchInput = useRef(null);
  const [selectBranch, setSelectBranch] = useState("");
  const [isPage, setIsPage] = useState(false);
  const [kirimBody, setKirimBody] = useState();
  const [loadingForm, setLoadingForm] = useState(loading);
  const [bankId, setBankId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [emptyValueValidate, setEmptyValueValidate] = useState(false);
  const [modalValidate, setModalValidate] = useState(false);
  const [modalCheckPrimaryExist, setModalCheckPrimaryExist] = useState(false);
  const [typeValidation, setTypeValidation] = useState(true);
  const [modalSuccess, setModalSuccess] = useState(false);

  // Contact Information
  const [contactObj, setContactObj] = useState({});
  const [contactTable, setContactTable] = useState([]);
  const [prefix1, setPrefix1] = useState({});
  const [prefix2, setPrefix2] = useState({});
  const [suffix, setSuffix] = useState({});
  const [value, setValue] = useState({});
  const [keyModal, setKeyModal] = useState();
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [dataTableDetail, setDataTableDetail] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  // const [disabledCheck, setDisabledCheck] = useState(false);

  const deleteNumber62 = (numb) => {
    let numbWithout62 = numb?.replace(/62/g, "");
    let result = parseInt(numbWithout62);
    return result;
  };

  // Handler Info Obj Contact Informatiion
  const handleContactObj = (e, type) => {
    let result;
    switch (type) {
      case "description1":
      case "description2":
      case "description3":
      case "description4":
      case "additionalNote1":
      case "additionalNote2":
      case "additionalNote3":
      case "additionalNote4":
        result = e.target.value;
        break;
      default:
        result = e;
        break;
    }

    setContactObj((prevState) => ({
      ...prevState,
      [type]: result,
    }));

    const index = type?.includes("description")
      ? parseInt(type?.slice(-1)) - 1
      : -1;

    if (index !== -1) {
      setContactTable((prevState) => {
        let tempTable = [...prevState];

        tempTable[index] = {
          ...tempTable[index],
          description: result,
        };
        return tempTable;
      });
    }

    const indexAN = type?.includes("additionalNote")
      ? parseInt(type?.slice(-1)) - 1
      : -1;

    if (indexAN !== -1) {
      setContactTable((prevState) => {
        let tempTable = [...prevState];

        tempTable[indexAN] = {
          ...tempTable[indexAN],
          additionalNote: result,
        };
        return tempTable;
      });
    }

    const indexAC = type?.includes("contactAddress")
      ? parseInt(type?.slice(-1)) - 1
      : -1;

    if (indexAC !== -1) {
      setContactTable((prevState) => {
        let tempTable = [...prevState];

        tempTable[indexAC] = {
          ...tempTable[indexAC],
          contactAddress: result,
        };
        return tempTable;
      });
    }

    return result;
  };

  // Define tabData before using it in useState
  const [tabData, setTabData] = useState([
    {
      value: "Bank",
      paramValue: [
        "bankCode",
        "bankName",
        "bankShortName",
        "branchName",
        "phoneNumber",
        "email",
        "address",
      ],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

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

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleChangePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  useEffect(() => {
    if (id) {
      dispatch(getBankDetail(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getAllApprovalList());
    dispatch(getAllBankNotBranch());
    dispatch(getPositionContact());
    dispatch(getJobContact());
    dispatch(getInputType());
    dispatch(getInputTypeContact());
    dispatch(getZoneContact());
    dispatch(getContryContact());
  }, [dispatch]);

  useEffect(() => {
    if (type === "update" && data_detail && data_detail?.bank) {
      setIsPage(data_detail?.bank?.isBranch);
    }
  }, [type, data_detail]);

  // useEffect(() => {
  //   if (data_detail && data_detail?.bank?.status === "ACTIVE" && "INACTIVE") {
  //     setDisabledCheck(true);
  //     setIsPage(data_detail?.bank?.isBranch);
  //   }
  // }, [data_detail]);

  useEffect(() => {
    if (
      codeBank !== ""
      // && type !== "update"
    ) {
      const findNameBank = dataBankNotBranch
        .filter((a) => a.bankCode === codeBank)
        ?.find((b) => b.bankName)?.bankName;
      const findShortBankName = dataBankNotBranch
        .filter((a) => a.bankCode === codeBank)
        ?.find((b) => b.bankShortName)?.bankShortName;
      const findBankCode = dataBankNotBranch
        .filter((a) => a.bankCode === codeBank)
        ?.find((b) => b.bankCode)?.bankCode;

      form.setFieldsValue({
        bankName: findNameBank,
        bankShortName: findShortBankName,
        bankCode: findBankCode,
      });
    }
  }, [codeBank]);

  useEffect(() => {
    if (isPage === false && type !== "update") {
      // Clear the fields when isPage is false
      form.setFieldsValue({
        bankName: "",
        bankShortName: "",
        bankCode: "",
      });
      setCodeBank("");
    } else {
      if (isPage === true && type !== "update") {
        form.setFieldsValue({
          bankName: "",
          bankShortName: "",
          bankCode: "",
        });
      }
    }
    if (isPage === false && type !== "update") {
      // Clear the fields when isPage is false
      form.setFieldsValue({
        bankName: "",
        bankShortName: "",
        bankCode: "",
      });
      setCodeBank("");
    }
  }, [isPage]);

  useEffect(() => {
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getListApprovalById({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  useEffect(() => {
    if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
      const data = dataListAppHierDetail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setAppHierDataDetail(data);
    } else {
      setAppHierDataDetail([]);
    }
  }, [dataListAppHierDetail]);

  useEffect(() => {
    if (
      formValue.approvalHierarchy &&
      !appHierOptions
        .map((item) => item.value)
        .includes(formValue.approvalHierarchy)
    ) {
      form.setFieldsValue({ approvalHierarchy: null });
      setSelectedHierarchy(null);
    }
  }, [formValue, appHierOptions, form]);

  useEffect(() => {
    if (id) {
      const formValues = {
        id: data_detail?.bank?.id,
        bankName: data_detail?.bank?.bankName,
        bankCode: data_detail?.bank?.bankCode,
        bankShortName: data_detail?.bank?.bankShortName,
        npwp: intToNPWP(data_detail?.bank?.npwp),
        phoneNumber: deleteNumber62(data_detail?.bank?.phoneNumber),
        email: data_detail?.bank?.email,
        address: data_detail?.bank?.address,
        description: data_detail?.bank?.description,
        apphierId: data_detail?.bank?.appHierId,
        branchName: isPage === true ? data_detail?.bank?.branchName : null,
        isBranch: data_detail?.bank?.isBranch,
      };
      setSelectedHierarchy(data_detail?.bank?.appHierId);
      setListDataAttachment(
        (data_detail?.attachmentDtoList || []).map((attachData) => ({
          ...attachData,
          fileSize: bytesConverter(attachData.fileSize || 0),
          dataType: "exist",
        }))
      );
      form.setFieldsValue(formValues);
      if (
        data_detail?.bank?.bankContacts &&
        data_detail?.bank?.bankContacts?.length > 0
      ) {
        const data = data_detail?.bank?.bankContacts?.map((item, index) => {
          const bankContacts = item?.contactDetails || []; // Ensure bankContacts is an array
          const contactDetails = bankContacts?.map((detail, detailIndex) => {
            setPrefix1((prevState) => {
              return {
                ...prevState,
                [`${index + 1}~${detailIndex + 1}`]: detail?.prefix1,
              };
            });
            // if (detail?.inputType === 748 || detail?.inputType === 751) {
            //   dispatch(getZoneContact({ id: detail?.prefix1 }));
            // }
            setPrefix2((prevState) => {
              return {
                ...prevState,
                [`${index + 1}~${detailIndex + 1}`]: detail?.prefix2,
              };
            });
            setSuffix((prevState) => {
              return {
                ...prevState,
                [`${index + 1}~${detailIndex + 1}`]: detail?.suffix,
              };
            });
            setValue((prevState) => {
              return {
                ...prevState,
                [`${index + 1}~${detailIndex + 1}`]: detail?.value,
              };
            });
            return {
              ...detail,
              key: detailIndex + 1,
              dataType: "exist",
            };
          });
          return {
            ...item,
            key: index + 1,
            contactDetails,
          };
        });
        setDataSource(data);
      } else {
        setDataSource([]);
        // setPrefix1("");
        // setPrefix2("");
        // setSuffix("");
      }
    }
  }, [data_detail]);

  const handleCancelModalConfirm = () => {
    setModalConfirm(false);
    setValue(tabData[0].value);
  };
  const [valuePage, setValuePage] = useState(tabData[0].value);

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setSelectedHierarchy("");
      setListDataAttachment([]);
      setDataSource([]);
    } else {
      dispatch(getBankDetail(id));
    }
  };
  const onChange = (e) => {
    setValuePage(e.target.value);
  };

  // Validation Button Back
  const handleBack = () => {
    if (
      form.getFieldValue() === null ||
      Object.keys(form.getFieldValue()).length === 0
    ) {
      navigate(-1);
    } else {
      setModalBack(true);
    }
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
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_MASTER_BANK,
      breadcrumbName: "Bank",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.CREATE_MASTER_BANK,
      breadcrumbName: `${type === "create" ? "Create" : "Update"}`,
    },
  ];

  const onSortDetail = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  const handleSearchData = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  const getCountryZoneName = (val) => {
    const countryZoneName =
      data_countryZone && data_countryZone?.filter((item) => item?.Id === val);
    if (countryZoneName === undefined) {
      return "";
    }
    if (countryZoneName.length !== 0) {
      return `(${countryZoneName[0].text})`;
    }
  };

  const getCountryCodeName = (val) => {
    const countryCodeName =
      data_countryCode && data_countryCode?.filter((item) => item?.id === val);
    if (countryCodeName === undefined) {
      return "";
    }
    if (countryCodeName.length !== 0) {
      return `(${countryCodeName[0].name})`;
    }
  };

  //paging table contact list paling depan
  const paginationTableConfirm = (typeData = "data") => {
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
    const fix = result.slice((page - 1) * pageSize, page * pageSize);
    return typeData === "data" ? fix : result.length;
  };

  const columnConfirm = (
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => {}
  ) => [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CONTACT NAME",
      dataIndex: "contactName",
      sorter: (a, b) => a?.contactName?.localeCompare(b?.contactName),
      ...getColumnSearchPropsPaging(
        "contactName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        searchedColumn === "contactName" ? (
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
        ),
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
  ];

  const expandedRowRender = (record) => {
    // const dataExpanded = record?.contactDetails;
    const dataExpanded = record?.contactDetails?.map((item, index) => ({
      ...item,
      key: index,
    }));
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
        sorter: true,
        ...getColumnSearchPropsPaging("inputType"),
        render: (inpuType) => (
          <span>
            {data_inputType &&
              data_inputType
                .filter((a) => a.id === inpuType)
                .find((b) => b.name)?.name}
          </span>
        ),
      },
      {
        title: "VALUE",
        dataIndex: "value",
        ...getColumnSearchPropsPaging("value"),
        render: (_, record) => {
          if (record.fullValue) {
            return <span>{record.fullValue}</span>;
          }
          if (record.type === 741) {
            if (record.inputType === 748) {
              return (
                <span>{`${getCountryCodeName(
                  record?.prefix1
                )} ${getCountryZoneName(record?.prefix2)} - ${record.value}
                ${
                  record.suffix ? "Ext " + record.suffix : ""
                  // suffix[`${record.row}~${record.key}`] ? suffix[`${record.row}~${record.key}`] : ""
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
          if (record.type === 746) {
            return (
              <span>{`${getCountryCodeName(record?.prefix1)} - ${
                record.value
              }`}</span>
            );
          }
          if (record.type === 747) {
            return (
              <span>{`${getCountryCodeName(record?.prefix1)} - ${
                record.value
              }`}</span>
            );
          }
          if (record.type === 745) {
            const suffix =
              record.suffix === "" ? (
                <span>{`${getCountryCodeName(record?.prefix1)} - ${
                  record.value
                }`}</span>
              ) : (
                <span>{`${getCountryCodeName(
                  record?.prefix1
                )} ${getCountryZoneName(record?.prefix2)} - ${record.value}
                ${
                  record.suffix ? "Ext " + record.suffix : ""
                  // suffix[`${record.row}~${record.key}`] ? suffix[`${record.row}~${record.key}`] : ""
                }
                `}</span>
              );
          } else {
            return <span>{record.value}</span>;
          }
        },
      },
    ];

    return (
      <div>
        <TablePagination
          useSelect={false}
          usePagination={false}
          onSort={onSort}
          dataSource={dataExpanded}
          columns={column}
        />
      </div>
    );
  };

  //handle Error
  const handleError = ({ values, errorFields, outOfDate }) => {
    setTabData((prevState) => {
      const res = prevState.map((item) => {
        if (!item.paramValue || item.paramValue.length < 0) {
          return {
            value: item.value,
            paramValue: item.paramValue,
          };
        }
        const errorBadge = errorFields.reduce(
          (current, next) =>
            item.paramValue.includes(next.name[0]) ? current + 1 : current,
          0
        );
        return {
          value: item.value,
          paramValue: item.paramValue,
          errorBadge,
        };
      });
      return res;
    });
  };

  const handleSubmitForm = (formValue) => {
    if (dataSource?.length === 0) {
      const errorBody = {
        title: "Attention",
        description: `Please input contact list.`,
      };
      setTabData([
        {
          value: "Bank",
          paramValue: [
            "bankCode",
            "bankName",
            "bankShortName",
            "branchName",
            "phoneNumber",
            "email",
            "address",
          ],
        },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
      ]);
      dispatch(showModalError(errorBody));
    } else {
      const dataValue = {
        address: formValue.address,
        bankCode: formValue.bankCode,
        bankName: formValue.bankName,
        bankShortName: formValue.bankShortName,
        email: formValue.email,
        npwp: formValue.npwp.replace(/[^a-zA-Z0-9]/g, ""),
        phoneNumber: `62${formValue.phoneNumber}`,
        appHierId: formValue?.apphierId,
        // bankContacts: type === "update" ? bankContact : bankContact,
        bankContacts: dataSource,
        branchName: isPage === true ? formValue?.branchName : null,
        isBranch: isPage || null,
      };
      setKirimBody(dataValue);
      setTabData([
        {
          value: "Bank",
          paramValue: [
            "bankCode",
            "bankName",
            "bankShortName",
            "branchName",
            "phoneNumber",
            "email",
            "address",
          ],
        },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
      ]);
      const bodyValidasiUpdate = {
        ...dataValue,
        id: data_detail?.bank?.id,
      };
      if (type !== "update") {
        dispatch(createValidasiBank(dataValue))
          .unwrap()
          .then(async (data) => {
            const sukses = data?.success;
            if (sukses === false) {
              setModalConfirm(false);
            }
            setModalConfirm(true);
          });
      }
      dispatch(createValidasiBank(bodyValidasiUpdate))
        .unwrap()
        .then(async (data) => {
          const sukses = data?.success;
          if (sukses === false) {
            setModalConfirm(false);
          }
          setModalConfirm(true);
        });
    }
  };

  console.log(kirimBody);
  
  const handleProcessModalConfirm = async () => {
    const successMessageCreate = {
      title: "Successful",
      description: `Your data has been submitted`,
      return: true,
    };

    const successMessageUpdate = {
      title: "Successful",
      description: `Your data has been submitted`,
      return: true,
    };
    const body = {
      ...kirimBody,
      bankContacts: kirimBody.bankContacts?.map((item) => {
        return {
          ...item,
          contactDetails: item?.contactDetails?.map((item2) => {
            let temp = { ...item2 };
            delete temp.dataType;
            return temp;
          }),
        };
      }),
    };

    if (type !== "update") {
      dispatch(createMasterBank(kirimBody))
        .unwrap()
        .then(async (data) => {
          let bankId = data.id;
          setLoadingForm(true);
          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = listDataAttachment[icon];
            const body = {
              files: element.file,
              fileCategoryId: element.fileCategoryId,
              referensiId: bankId,
              category: "BANK",
            };
            const response = await receiptCollectionHttpService.uploadImage(
              `/v1/dbs/api/attachment/upload/v1`,
              body
            );
          }
          setLoadingForm(false);
          setBankId(bankId);
          handleCancelModalConfirm();
          handleClear();
          dispatch(showModalSuccess(successMessageCreate));
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            const body = {
              title: "Failed",
              description: `Your data was not created. ${message}`,
            };
            dispatch(showModalError(body));
          }
        });
    } else {
      const bodyUpdate = {
        ...body,
        id: data_detail?.bank?.id,
      };
      dispatch(createMasterBank(bodyUpdate))
        .unwrap()
        .then(async () => {
          setLoadingForm(true);
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist"
          );
          for (let icon = 0; icon < filterDataAttach.length; icon++) {
            const element = filterDataAttach[icon];
            const body = {
              referensiId: data_detail?.bank?.id,
              files: element.file,
              category: "BANK",
              fileCategoryId: element.fileCategoryId,
            };
            const response = await receiptCollectionHttpService.uploadImage(
              `/v1/dbs/api/attachment/upload/v1`,
              body
            );
          }
          setLoadingForm(false);
          setBankId(bankId);
          handleCancelModalConfirm();
          form.resetFields();
          setSelectedHierarchy("");
          setListDataAttachment([]);
          dispatch(showModalSuccess(successMessageUpdate));
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            const body = {
              title: "Failed",
              description: `Your data was not updated. ${message}`,
            };
            dispatch(showModalError(body));
          }
        });
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

  console.log(data_inputType);
  
  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Spin spinning={loadingForm}>
        <RadioTabs
          data={tabData}
          onChange={onChange}
          currentPosition={valuePage}
        />
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmitForm}
          onFinishFailed={handleError}
        >
          <div
            style={{
              display: valuePage !== tabData[0].value ? "none" : undefined,
            }}
          >
            <BankCreate
              dataBank={dataBankNotBranch}
              form={form}
              isPage={isPage}
              setIsPage={setIsPage}
              data_detail={data_detail}
              codeBank={codeBank}
              setCodeBank={setCodeBank}
              // disabledDraf={disabledCheck}
            />
            <ContactListCreate
              handleSearchData={handleSearchData}
              data_detail={data_detail}
              data_job={data_job}
              data_position={data_position}
              onSortDetail={onSortDetail}
              dataSource={dataSource}
              setDataSource={setDataSource}
              // filterDataByPage={filterDataByPage()}
              codeBank={codeBank}
              setCodeBank={setCodeBank}
              getColumnSearchProps={getColumnSearchPropsPaging}
              onSort={onSort}
              handleContactObj={handleContactObj}
              contactObj={contactObj}
              contactTable={contactTable}
              setContactTable={setContactTable}
              id={id}
              prefix1={prefix1}
              setPrefix1={setPrefix1}
              prefix2={prefix2}
              setPrefix2={setPrefix2}
              suffix={suffix}
              setSuffix={setSuffix}
              value={value}
              setValue={setValue}
              keyModal={keyModal}
              setKeyModal={setKeyModal}
              data_contactType={data_contactType}
              data_countryZone={data_countryZone}
              data_inputType={data_inputType?.data}
              data_countryCode={data_countryCode}
              pageContact={page}
              pageSizeContact={pageSize}
              setEmptyValueValidate={setEmptyValueValidate}
              setModalValidate={setModalValidate}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          </div>
          <div
            style={{
              display: valuePage !== tabData[1].value ? "none" : undefined,
            }}
          >
            <BaseContainer header={"APPROVAL INFORMATION"}>
              <ApprovalComponentGeneral
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </BaseContainer>
          </div>
          <div
            style={{
              display: valuePage !== tabData[2].value ? "none" : undefined,
            }}
          >
            <BaseContainer header={"ATTACHMENT INFORMATION"}>
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                dispatch={dispatch}
                getAPICategory={getListCategory}
                typeSelector="bank"
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
                //  getAPIGuard={getConfigFileR}
                typeRBI={"data"}
                //  mandatory={true}
              />
            </BaseContainer>
          </div>
          <div className="flex w-full justify-between align-middle my-3 gap-5">
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
            <div className="flex align-middle gap-3">
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
                onClick={handleClear}
              >
                {type === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              <ButtonComponent
                htmlType="submit"
                type="submit"
                // onClick={() => setModalConfirm(true)}
                // disabled={disableSubmit}
              >
                Save & Submit
              </ButtonComponent>
            </div>
          </div>
        </Form>

        <ModalCustom
          isOpen={modalConfirm}
          handleCancel={handleCancelModalConfirm}
          header={"Confirmation"}
          width={1000}
          type={"confirmation"}
          footer={
            <div className="w-full flex justify-end gap-5 p-4">
              <ButtonComponent
                onClick={handleCancelModalConfirm}
                type="default"
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                type="submit"
                onClick={() =>handleProcessModalConfirm()}
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <ContentModalConfirmBank
            type={type}
            data={kirimBody}
            dataBank={dataBankNotBranch}
            // data_job={data_job}
            // data_position={data_position}
            tabData={tabData}
            dataTable={paginationTableConfirm("data")}
            totalData={paginationTableConfirm("lenght")}
            handleChange={setDataSource}
            listDataAttachment={listDataAttachment}
            columns={columnConfirm(
              page,
              pageSize,
              searchInput,
              searchedColumn,
              searchText,
              handleSearch
            )}
            expandedRowRender={expandedRowRender}
            current={page}
            pageSize={pageSize}
            onSort={onSortDetail}
            isBranch={isPage}
            listDataDetail={tableDatas}
            listDataAppHierDetail={appHierDataDetail}
            dataOption={appHierOptions}
            selectedHierarchy={selectedHierarchy}
          />
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
              handleSubmitForm();
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
              <p className="pl-[70px]">{`Your data has been ${
                type === "created" ? "created" : "updated"
              }`}</p>
            </div>
          </ModalSuccess>
        ) : null}
      </Spin>
    </LayoutMenu>
  );
};

export default BankForm;
