import React, { useState } from "react";
import {
  Input,
  Checkbox,
  Tooltip,
  Form,
  DatePicker,
  Spin,
  Badge,
} from "antd";
import Highlighter from "react-highlight-words";
import TablePagination from "../../../../components/TablePagination";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../routes/account_management/customer_account_routes";
import StatusComponent from "../../../../components/StatusComponent";
import ButtonComponent from "../../../../components/ButtonComponent";
import { Link } from "react-router-dom";
import SVGIcon from "../../../../assets/Icon/index";
import { FilterOutlined, DownloadOutlined } from "@ant-design/icons";
import BaseContainer from "../../../../components/BaseContainer";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadCustomer,
  getCustomerAccountAdvancedFilter,
  getGlobalSearchColumn,
  getGlobalSearchCondition,
  getGlobalSearchOperator,
  inActiveCustomer,
} from "../../../../redux/slices/account_management/Customer/customerAccount";
import moment from "moment";
import { dateFormatting } from "../../../../utils";
import { useEffect } from "react";
import { useRef } from "react";
import CustomerQuesry from "../Customer/Component/CustomerQuesry";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";

const routes = [
  {
    path: "",
    breadcrumbName: "Account",
  },
  {
    path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_CUSTOMER,
    breadcrumbName: "Customer",
  },
];

const CustomerList = () => {
  const dispatch = useDispatch();
  const { data_customer, loading } = useSelector(
    (state) => state.customerAccount
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  //declare
  const [formInactive] = Form.useForm();
  const searchInput = useRef(null);
  const [formQuery] = Form.useForm();

  //state
  const [inputFields, setInputFields] = useState([]);
  const [tempInputFields, setTempInputFields] = useState([]);
  // const [queryParam, setQueryParam] = useState(0);
  const [modalInactive, setModalInactive] = useState(false);
  const [modalQuery, setModalQuery] = useState(false);
  const [dataInactive, setDataInactive] = useState({});
  const [typeActivation, setTypeActivation] = useState(false);

  // State
  const [totalElement, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [modalError, setModalError] = useState(false);

  const [bodyError, setBodyError] = useState({});
  const [dataTable, setDataTable] = useState([]);
  const [queryChecked, setQueryChecked] = useState(false);
  const [btnQuery, setBtnQuery] = useState(false);
  const [nameNumber, setNameNumber] = useState({});

  //useEffect
  useEffect(() => {
    // dispatch(getCustomerAccount({ page, pageSize, sort, search }));
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
      getCustomerAccountAdvancedFilter({
        page,
        pageSize,
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
        body: { inputFields: tempInputFields },
      })
    );
  }, [dispatch, page, pageSize, sort, search, tempInputFields]);

  useEffect(() => {
    if (
      data_customer &&
      data_customer.result
      // && data_customer.result.length > 0
    ) {
      setTotalElement(data_customer?.page?.totalElements);
      const data = (data_customer?.result || [])?.map(
        (customer, indexCustomer) => ({
          ...customer,
          key: indexCustomer + 1,
          allAccount: (customer?.allAccount || [])?.map((account, index) => ({
            ...account,
            key: index + 1,
            parent: indexCustomer + 1,
          })),
        })
      );
      setDataTable(data);
    }
  }, [data_customer]);

  // useEffect(() => {
  //   setBtnQuery(!inputFields.length > 0);
  // }, [inputFields]);

  // Search Column Table
  const getColumnSearchProps = (dataIndex, type) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const onDataChange = (value, dateString) => {
        setSelectedKeys(dateString ? [dateString] : []);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };
      return (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {type === "date" ? (
            <DatePicker onChange={onDataChange} />
          ) : (
            <Input
              ref={searchInput}
              placeholder={`Search`}
              value={selectedKeys[0]}
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
          )}
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    // onFilter: (value, record) =>
    //   record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 5000);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={
            type === "date"
              ? moment([searchText]).format(dateFormatting.dateFormal)
              : [searchText]
          }
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

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
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleChangeSize = (pageChange, pageSizeChange) => {
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

  const handleRetry = () => {
    onFinishInactive(bodyError?.value);
    setModalError(false);
    setBodyError({});
  };

  //handle
  const onFinishInactive = (e, handleClear) => {
    //code
    const data = {
      id: dataInactive?.customerId,
      remarks: e?.remark,
    };

    setModalInactive(false);
    dispatch(inActiveCustomer({ ...data }))
      .unwrap()
      .then(() => {
        formInactive.resetFields();
        setDataInactive({});
        setModalInactive(false);
        setTypeActivation(false)
        handleClear();
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
          getCustomerAccountAdvancedFilter({
            page,
            pageSize,
            sort,
            search: tempSearch,
            body: { inputFields: tempInputFields },
          })
        );
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error?.response &&
              error?.response?.data &&
              error?.response?.data?.message) ||
            error?.message ||
            error?.toString();

          setBodyError({ message, value: e });
          setModalError(true);
        }
        formInactive.resetFields();
        setDataInactive({});
        setModalInactive(false);
        setTypeActivation(false)
        handleClear();
      });
  };

  // console.log(formInactive?.getFieldsValue());

  const handleInactive = (e) => {
    setDataInactive(e);
    setModalInactive(true);
  };


  // const handleAddQuery = () => {
  //   const newInput = { condition: "", column: "", operator: "", value: "" };
  //   setInputFields([...inputFields, newInput]);
  // };

  // const handleQueryChange = (index, query) => {
  //   const updatedInput = [...inputFields];
  //   console.log(index, "index");
  //   console.log(updatedInput[index]);
  //   console.log(query);
  //   updatedInput[index] = query; // Update the query at the specified index
  //   console.log("updatedInput", updatedInput);
  //   setInputFields(updatedInput);
  // };

  // const handleDeleteQuery = (index) => {
  //   //   //code
  //   console.log("index", index);
  //   console.log("data", inputFields);
  //   const temp = inputFields.filter((value, i) => value !== index);
  //   setInputFields(temp);
  // };

  //handle first query set static
  // useEffect(() => {
  //   if (inputFields.length > 0) {
  //     inputFields[0].condition = 0;
  //   }
  // }, [inputFields]);

  const handleFirstQuery = () => {
    const currentValues = formQuery.getFieldValue("query");

    // Update the first item in the query array with the new column value
    const updatedValues = [...currentValues];
    if (updatedValues.length > 0) {
      updatedValues[0] = { ...updatedValues[0], condition: 0 };
    }

    // Set the updated values back to the form
    formQuery.setFieldsValue({
      query: updatedValues,
    });
  };

  const onFinishQuery = (e) => {
    //code

    // const temp = e.every(
    //   (item, index) => {
    //     if (index === 0) {
    //       // Skip the check for item?.column on the first index
    //       return item?.column && item?.operator && item?.value;
    //     } else {
    //       // Check all conditions for other elements
    //       return item?.column && item?.condition && item?.operator && item?.value;
    //     }
    //   }
    // );

    // console.log(temp, "temp");
    // if (!temp) {
    //   setQueryChecked(true);
    // } else {
    // setTempInputFields(inputFields);
    setTempInputFields(e?.query);
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
      getCustomerAccountAdvancedFilter({
        page: 1,
        pageSize,
        sort,
        search: tempSearch,
        body: { inputFields: e?.query },
      })
    );
    setPage(1)
    setModalQuery(false);
    // }
  };

  const handleDownload = () => {
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
      downloadCustomer({
        page,
        pageSize,
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
        body: { inputFields: tempInputFields },
      })
    );
  };

  const renderDate = (date) => {
    if (date) {
      return moment(date).format("DD MMM YYYY");
    } else {
      return "";
    }
  };

  const handleCancelAdvanced = () => {
    setModalQuery(false);
    formQuery.setFieldsValue({ query: tempInputFields });
    // setInputFields(tempInputFields);
  };

  const expandedRowRender = (record) => {
    const columns = (
      searchInput,
      searchedColumn,
      searchText,
      handleSearch = () => { }
    ) => {
      return [
        {
          title: "NO",
          align: "center",
          width: 80,
          render: (text, object, index) => (page - 1) * pageSize + index + 1,
        },
        {
          sorter: true,
          title: "ACCOUNT NUMBER",
          dataIndex: "accountNumber",
          align: "left",
          ...getColumnSearchProps(
            "accountNumber",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          sorter: true,
          title: "ACCOUNT NAME",
          dataIndex: "accountName",
          align: "left",
          ...getColumnSearchProps(
            "accountName",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          sorter: true,
          title: "ACCOUNT REGISTRATION NUMBER",
          dataIndex: "registrationNumber",
          align: "left",
          ...getColumnSearchProps(
            "registrationNumber",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          sorter: true,
          title: "SOR",
          dataIndex: "sor",
          align: "left",
          ...getColumnSearchProps(
            "sor",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          sorter: true,
          title: "COST CENTER",
          dataIndex: "costCenter",
          align: "left",
          ...getColumnSearchProps(
            "costCenter",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          sorter: true,
          title: "METER READING CODE",
          dataIndex: "meterReadingCode",
          align: "center",
          ...getColumnSearchProps(
            "meterReadingCode",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          sorter: true,
          title: "ACCOUNT SEGMENT",
          dataIndex: "accountSegment",
          align: "center",
          ...getColumnSearchProps(
            "accountSegment",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          sorter: true,
          title: "ACCOUNT GROUP TYPE",
          dataIndex: "accountGroupType",
          align: "center",
          ...getColumnSearchProps(
            "accountGroupType",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          sorter: true,
          title: "CATEGORY",
          dataIndex: "category",
          align: "center",
          ...getColumnSearchProps(
            "category",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          sorter: true,
          title: "CLASSIFICATION TYPE",
          dataIndex: "classificationType",
          align: "center",
          ...getColumnSearchProps(
            "classificationType",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          sorter: true,
          title: "ACCOUNT TYPE",
          dataIndex: "accountType",
          align: "center",
          ...getColumnSearchProps(
            "accountType",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          sorter: true,
          title: "INDUSTRIAL SECTOR",
          dataIndex: "industrialSector",
          align: "center",
          ...getColumnSearchProps(
            "industrialSector",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          sorter: true,
          title: "BUDGET YEAR",
          dataIndex: "budgetYear",
          align: "center",
          ...getColumnSearchProps(
            "budgetYear",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          sorter: true,
          title: "BUDGET",
          dataIndex: "budget",
          align: "center",
          ...getColumnSearchProps(
            "budget",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          sorter: true,
          title: "TERITORY",
          dataIndex: "teritory",
          align: "center",
          ...getColumnSearchProps(
            "teritory",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          sorter: true,
          title: "ACCOUNT GROUP",
          dataIndex: "accountGroup",
          align: "center",
          ...getColumnSearchProps(
            "accountGroup",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          sorter: true,
          title: "PRIORITY",
          dataIndex: "priority",
          align: "center",
          ...getColumnSearchProps(
            "priority",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          sorter: true,
          title: "CORPORATE",
          dataIndex: "isCorporate",
          align: "center",
          ...getColumnSearchProps(
            "corporate",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          sorter: true,
          title: "RATING & BILLING EXCEPTION",
          dataIndex: "isException",
          align: "center",
          ...getColumnSearchProps(
            "isCxception",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          sorter: true,
          title: "CUSTOMER MANAGEMENT",
          dataIndex: "customerManagement",
          align: "center",
          ...getColumnSearchProps(
            "customerManagement",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          sorter: true,
          title: "DESCRIPTION",
          dataIndex: "accountDescription",
          align: "center",
          ellipsis: {
            showTitle: false,
          },
          ...getColumnSearchProps(
            "accountDescription",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
          render: (accountDescription) => (
            <Tooltip placement="topLeft" title={accountDescription}>
              {accountDescription}
            </Tooltip>
          ),
        },
        {
          title: "STATUS",
          dataIndex: "accountStatus",
          sorter: true,
          ...getColumnSearchProps(
            "accountStatus",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
          render: (accountStatus) => (
            <div className={"flex justify-center"}>
              <StatusComponent colour={accountStatus}>
                {accountStatus}
              </StatusComponent>
            </div>
          ),
        },
        {
          title: "ACTION",
          key: "action",
          width: 100,
          fixed: "right",
          render: (v, r, i) => {
            return (
              <div className="flex flex-row justify-center align-middle">
                <Link
                  to={
                    r?.accountGroup === "Standard"
                      ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
                      : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME
                  }
                  state={{ idAccount: r?.accountId, idCustomer: r?.customerId }}
                >
                  <Tooltip title="Detail">
                    <span className="flex justify-center">
                      <SVGIcon name="IconDetail" color={"#0075bf"} width={24} />
                    </span>
                  </Tooltip>
                </Link>
              </div>
            );
          },
        },
      ];
      // const data = [];
      // for (let i = 0; i < 3; ++i) {
      //   data.push({
      //     key: i + 1,
      //     accountNumber: `083912${i + 12}`,
      //     accountName: `Jhon ${i}`,
      //     segment: "RT",
      //     groupType: "Data",
      //   });
    };
    return (
      <div>
        <p className="text-primary text-xs font-bold uppercase">
          ACCOUNT INFORMATION
        </p>
        <TablePagination
          useSelect={false}
          usePagination={false}
          dataSource={record?.allAccount}
          columns={columns()}
          tableScrolled={{
            x: 10000,
            y: 300,
          }}
        />
      </div>
    );
  };

  function formatNPWP(npwpNumber) {
    const npwpString = npwpNumber.toString();
    const formattedNPWP = npwpString.replace(
      /(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})(\d{3})/,
      "$1.$2.$3.$4-$5.$6"
    );
    return formattedNPWP;
  }

  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      sorter: true,
      width: 250,
      ...getColumnSearchProps("customerNumber"),
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      sorter: true,
      width: 350,
      ...getColumnSearchProps("customerName"),
    },
    {
      sorter: true,
      title: "FIRST NAME",
      dataIndex: "firstName",
      width: 250,
      ...getColumnSearchProps(
        "firstName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      sorter: true,
      title: "MIDDLE NAME",
      dataIndex: "middleName",
      width: 250,
      ...getColumnSearchProps(
        "middleName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      sorter: true,
      title: "LAST NAME",
      dataIndex: "lastName",
      width: 250,
      ...getColumnSearchProps(
        "lastName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "CUSTOMER TYPE",
      dataIndex: "customerType",
      sorter: true,
      width: 200,
      ...getColumnSearchProps("customerType"),
    },
    {
      title: "IDENTIFICATION TYPE",
      dataIndex: "identificationType",
      sorter: true,
      align: "center",
      width: 250,
      ...getColumnSearchProps("identificationType"),
    },
    {
      title: "CUSTOMER IDENTIFICATION NUMBER",
      dataIndex: "customerIdentificationNumber",
      sorter: true,
      align: "left",
      width: 400,
      ...getColumnSearchProps("customerIdentificationNumber"),
      render: (val, r) => (
        // console.log("🚀 ~ file: CustomerAccountList.js:839 ~ expandedRowRender ~ val:", val)
        // console.log("🚀 ~ file: CustomerAccountList.js:839 ~ expandedRowRender ~ r:", r)
        <span>{r.identificationType === "NPWP" ? formatNPWP(val) : val}</span>
      ),
    },
    // {
    //   title: "CM",
    //   dataIndex: "customerManagement",
    //   sorter: true,
    //   width: 250,
    //   ...getColumnSearchProps("customerManagement"),
    //   ellipsis: {
    //     showTitle: false,
    //   },
    //   render: (text) => {
    //     if (searchedColumn === "customerManagement") {
    //       return (
    //         <Tooltip placement="topLeft" title={text}>
    //           <Highlighter
    //             highlightStyle={{
    //               backgroundColor: "#ffc069",
    //               padding: 0,
    //             }}
    //             searchWords={[searchText]}
    //             autoEscape
    //             textToHighlight={text ? text.toString() : ""}
    //           />
    //         </Tooltip>
    //       );
    //     } else {
    //       if (text) {
    //         return (
    //           <Tooltip placement="topLeft" title={text}>
    //             {text}
    //           </Tooltip>
    //         );
    //       }
    //       return "";
    //     }
    //   },
    // },
    {
      title: "SEARCH KEY",
      dataIndex: "searchKey",
      sorter: true,
      width: 450,
      ...getColumnSearchProps("searchKey"),
    },
    {
      title: "BIRTH/FOUNDED PLACE",
      dataIndex: "foundedBirthPlace",
      sorter: true,
      width: 250,
      ...getColumnSearchProps("foundedBirthPlace"),
    },
    {
      title: "BIRTH/FOUNDED DATE",
      dataIndex: "foundedBirthDate",
      sorter: true,
      align: "center",
      width: 250,
      ...getColumnSearchProps("foundedBirthDate"),
      render: (foundedBirthDate) => renderDate(foundedBirthDate),
    },
    {
      title: "SEX",
      dataIndex: "sex",
      sorter: true,
      width: 250,
      align: "center",
      ...getColumnSearchProps("sex"),
    },
    {
      title: "MARITAL STATUS",
      dataIndex: "maritalStatus",
      sorter: true,
      aling: "center",
      width: 250,
      ...getColumnSearchProps("maritalStatus"),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      sorter: true,
      fixed: "right",
      width: 250,
      ...getColumnSearchProps("status"),
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

  const itemActions = [
    //action toolbar
    {
      action: 'Download',
      render: (
        <ButtonComponent
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
          type={"submit"}
          onClick={handleDownload}
        >
          Download List
        </ButtonComponent>

      )
    },

    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title="Detail">
            <Link
              onClick={() => {
                // handleDetail(r?.employeeCode);
              }}
              to={ACCOUNT_MANAGEMENT_ROUTES.DETAIL_CUSTOMER}
              state={{ id: record?.customerId }}
            >
              <ButtonComponent
                icon={<SVGIcon name="IconDetail" width={24} />}
                border={false}
              ></ButtonComponent>
            </Link>
          </Tooltip>
        )
      }
    },

    {
      action: "Activate",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title={record?.status === "ACTIVE" ? "Inactive" : "Active"}>
            <div className="pt-1">
              {/* <ButtonComponent border={false}> */}
              {record.status === "INACTIVE" ? (
                <Checkbox
                  checked={true}
                  onClick={() => {
                    setTypeActivation(true);
                    handleInactive(record);
                    setNameNumber(record)
                  }}
                />
              ) : (
                <Checkbox
                  checked={false}
                  onClick={() => {
                    handleInactive(record);
                  }}
                />
              )}
              {/* </ButtonComponent> */}
            </div>
          </Tooltip>
        )
      }
    }
  ]

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <Toolbar items={itemActions} />
        {/* <div className="flex w-full justify-end gap-x-2">
          <ButtonComponent
            icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
            type={"submit"}
            onClick={handleDownload}
          >
            Download List
          </ButtonComponent>
        </div> */}
        <BaseContainer header={"CUSTOMER ACCOUNT LIST"}>
          {/* <div className="relative"> */}
          <div className={"w-full flex justify-start mb-5"}>
            <Tooltip placement="topRight">
              <Badge count={tempInputFields.length}>
                <ButtonComponent
                  onClick={() => {
                    setModalQuery(true);
                  }}
                  type={"submit"}
                  border={false}
                >
                  Filter
                </ButtonComponent>
              </Badge>
            </Tooltip>
          </div>

          <TablePagination
            dataSource={dataTable}
            totalData={totalElement}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            onSizeChanger={handleChangeSize}
            tableScrolled={{
              x: 3000,
              y: 500,
            }}
            expandable={{ expandedRowRender }}
            onSort={onSort}
            columns={[
              ...columns,
              ...useColumnActionPermission(
                ["Activate", "View", "Update"],
                itemActions
              ),
            ]}
          />
        </BaseContainer>

        {/* query */}
        <ModalCustom
          isOpen={modalQuery}
          type={"confirmation"}
          header={"QUERY"}
          width={1200}
          handleCancel={() => {
            handleCancelAdvanced();
          }}
        // footer={
        //   <div className={"w-full flex justify-between mt-5"}>
        //     <div>
        //       <ButtonComponent
        //         type={"submit"}
        //         onClick={() => handleAddQuery()}
        //         disabled={inputFields.length > 4}
        //       >
        //         Add
        //       </ButtonComponent>
        //     </div>
        //     <div className={"flex gap-3"}>
        //       <Form.Item>
        //         <ButtonComponent
        //           type="default"
        //           onClick={() => {
        //             handleCancelAdvanced();
        //           }}
        //         >
        //           Cancel
        //         </ButtonComponent>
        //       </Form.Item>
        //       <Form.Item>
        //         <ButtonComponent
        //           type="submit"
        //           htmlType={"submit"}
        //           form={"formQuery"}
        //           disabled={btnQuery || loading}
        //         >
        //           Save
        //         </ButtonComponent>
        //       </Form.Item>
        //     </div>
        //   </div>
        // }
        >
          <Form
            id="formQuery"
            layout={"vertical"}
            form={formQuery}
            onFinish={onFinishQuery}
          >
            <CustomerQuesry
              // queries={inputFields}
              // handleDeleteQuery={handleDeleteQuery}
              // handleQueryChange={handleQueryChange}
              // handleAddQuery={handleAddQuery}
              handleFirstQuery={handleFirstQuery}
              handleCancelQuery={handleCancelAdvanced}
              dispatch={dispatch}
              getApiColumn={getGlobalSearchColumn}
              getApiOperator={getGlobalSearchOperator}
              getApiCondition={getGlobalSearchCondition}
            />
          </Form>
        </ModalCustom>

        {/* inactivate */}
        {/* <ModalApproveOrReject
          isOpen={modalInactive}
          header={`${typeActivation ? ` Inactivate` : `Activate`} Customer`}
          handleCancel={() => {
            setModalInactive(false);
          }}
          message={`${
            typeActivation
              ? `Are you sure you want to Inactivate Customer ${dataInactive?.customerName}?`
              : `Are you sure you want to Activate Customer ${dataInactive?.customerName}?`
          }`}
          width={1000}
          footer={
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent
                type={"default"}
                onClick={() => setModalInactive(false)}
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                type={"submit"}
                border={false}
                form={"formInactive"}
                htmlType={"submit"}
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <Form
            id={"formInactive"}
            layout={"vertical"}
            form={formInactive}
            onFinish={onFinishInactive}
          >
            <Form.Item
              name={"remark"}
              label={"Remark"}
              rules={[{ message: requiredMessage("Remark"), required: true }]}
            >
              <InputComponent
                rows={1}
                placeholder="Type your remark"
                type="textarea"
              />
            </Form.Item>
          </Form>
        </ModalApproveOrReject> */}
        <ModalApproveOrReject
          isOpen={modalInactive}
          handleCloseModal={() => setModalInactive(false)}
          onFinish={onFinishInactive}
          header={dataInactive?.status?.toLowerCase() === 'active' ? 'Inactivate' : "Activate"}
          approveOrReject={dataInactive?.status?.toLowerCase() === 'active' ? 'Inactivate' : "Activate"}
          // menu={"Customer"}
          customMessage={`Are you sure you want to ${dataInactive?.status?.toLowerCase() === 'active' ? 'Inactivate' : "Activate"} Customer ${dataInactive.customerNumber} - ${dataInactive.customerName}?`}

        />
        {/** Modal Retry */}
        <ModalError
          isOpen={modalError}
          handleOk={handleRetry}
          handleCancel={() => {
            setModalError(false);
          }}
          customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your data was not ${typeActivation ? "Inactive" : "Created"
              }`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>

        {/* * Modal Query Error */}
        <ModalError
          isOpen={queryChecked}
          handleOk={() => setQueryChecked(false)}
          handleCancel={() => {
            setQueryChecked(false);
          }}
          customText={"Ok"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your query still has missing value`}</p>
            <p className="pl-[70px]">Please checked your input.</p>
          </div>
        </ModalError>
      </Spin>
    </LayoutMenu>
  );
};

export default CustomerList;
