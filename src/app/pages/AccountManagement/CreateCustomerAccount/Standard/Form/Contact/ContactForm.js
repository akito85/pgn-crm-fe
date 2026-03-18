import React, { useState, useRef, useEffect } from "react";
import { Form, Input, Button, DatePicker, Tooltip, Select } from "antd";
import { FilterOutlined, PlusCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import Highlighter from "react-highlight-words";
import { useSelector } from "react-redux";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import { dateFormatting } from "../../../../../../../utils";
import SVGIcon from "../../../../../../../assets/Icon/index";
import SelectComponent from "../../../../../../../components/SelectComponent";
import TablePagination from "../../../../../../../components/TablePagination";
import InputComponent from "../../../../../../../components/InputComponent";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import DynamicTableInlineWithoutBase from "../../../../../../../components/Table/DynamicTableInlineWithoutBase";
import {
  checkContactExist,
  getAllContactPaginate,
  getContactType,
  getCountryCode,
  getCountryZone,
  getInputType,
  getJob,
  getPosition,
} from "../../../../../../../redux/slices/account_management/Account/accountSlice";
import { onInputUpperCase } from "../../../../Utils";
import { ModalError } from "../../../../../../../components/Modal/ModalPopUp";

const ContactForm = ({
  contactTable = [],
  setContactTable,
  dispatch = () => {},
  handleContactObj = () => {},
  dataAddress = [],
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
  customerId,
  form,
}) => {
  // Selector
  const {
    loading,
    data_contact,
    data_job,
    data_position,
    data_contactType,
    data_inputType,
    data_countryZone,
    data_countryCode,
  } = useSelector((state) => state.account);

  // Declaration
  const searchInput = useRef(null);
  const [formContact] = Form.useForm();
  const dataContactList = data_contact?.result;

  const dataContactType = (data_contactType || [])?.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  const dataCountryZone = (data_countryZone || [])?.map((item) => {
    return {
      value: item.id,
      label: item.text,
    };
  });

  const dataCountryCode = (data_countryCode || [])?.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  const dataInputType = (data_inputType || [])?.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [totalElements, setTotalElement] = useState(0);

  const [dataTableDetail, setDataTableDetail] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  const [description1, setDescription1] = useState("");
  const [description2, setDescription2] = useState("");
  const [description3, setDescription3] = useState("");
  const [description4, setDescription4] = useState("");

  const [modalChooseContact, setModalChooseContact] = useState(false);
  const [modalCreateContact, setModalCreateContact] = useState(false);
  const [selectDataRecord, setSelectDataRecord] = useState({});
  const [modalValidate, setModalValidate] = useState(false);

  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [emptyValueValidate, setEmptyValueValidate] = useState(false);
  const [isContactNewExist, setIsContactNewExist] = useState(false);
  // Use Effect
  useEffect(() => {
    setTotalElement(dataTableDetail?.length);
  }, [dataTableDetail]);

  useEffect(() => {
    dispatch(getJob());
    dispatch(getPosition());
    dispatch(getContactType());
    dispatch(getInputType());
    dispatch(getCountryCode());
    // dispatch(getCountryZone());
  }, []);

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
      getAllContactPaginate({
        customerId,
        search: tempSearch,
        page,
        pageSize,
        sort,
      })
    );
  }, [customerId, search, page, pageSize, sort]);

  useEffect(() => {
    if (dataContactList && dataContactList?.length > 0) {
      const data = dataContactList?.map((a, index) => ({
        ...a,
        key: index + 1,
        contactDetails: a.contactDetails?.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setDataSource(data);
    }
  }, [dataContactList]);

  const getCountryZoneByIdCountryCode = (e) => {
    if(e !== undefined){
      dispatch(getCountryZone(e))
    }
  }

  // console.log(contactTable, "contactTable");
  const validateContactAddress = (index) => {
    if (
      contactTable[index]// &&
      // addressObj[`businessPurpose${index + 1}`]?.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  // Validation Address Information
  const validateContactAddressForm = (index) => {

    if ( index === 1 && contactTable.length >= 1) {
      return validateContactAddress(0);
    }
    if (index === 2 && contactTable.length >= 2) {
      return validateContactAddress(1);
    }
    if (index === 3 && contactTable.length >= 3) {
      return validateContactAddress(2);
    }
    if (index === 4 && contactTable.length >= 4) {
      return validateContactAddress(3);
    } else {
      return false;
    }
  };

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
    onFilter: (value, record) => {
      let result =
        type === "date"
          ? moment(record[dataIndex])
              .format(dateFormatting.dateFormal)
              ?.toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : record[dataIndex]
              ?.toString()
              .toLowerCase()
              .includes(value.toLowerCase());
      return result;
    },
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
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
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

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const onSortDetail = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  // Column Contact Expand
  const expandedRowRender = (record) => {
    const columns = (
      searchInput,
      searchedColumn,
      searchText,
      handleSearch = () => {}
    ) => {
      return [
        {
          title: "NO",
          width: 60,
          align: "center",
          render: (text, object, index) => index + 1,
        },
        {
          title: "TYPE",
          dataIndex: "typeName",
          sorter: true,
          align: "center",
          ...getColumnSearchProps(
            "typeName",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          title: "VALUE",
          dataIndex: "fullValue",
          sorter: true,
          align: "center",
          ...getColumnSearchProps(
            "fullValue",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
      ];
    };
    return (
      <div>
        <p className="text-primary text-xs font-bold uppercase pt-4">
          CONTACT DETAIL INFORMATION
        </p>
        <TablePagination
          useSelect={false}
          usePagination={false}
          dataSource={record?.contactDetails}
          columns={columns()}
          className={"mb-4"}
        />
      </div>
    );
  };

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CONTACT NAME",
      dataIndex: "contactName",
      sorter: true,
      ...getColumnSearchProps("contactName"),
    },
    {
      title: "JOB TITLE",
      dataIndex: "jobName",
      sorter: true,
      align: "center",
      ...getColumnSearchProps("jobName"),
    },
    {
      title: "POSITION",
      dataIndex: "positionName",
      sorter: true,
      align: "center",
      ...getColumnSearchProps("positionName"),
    },
    {
      title: "SOURCE",
      dataIndex: "source",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("source"),
    },
    {
      title: "ACTION",
      align: "center",
      dataIndex: "contactId",
      width: 100,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex justify-center gap-2">
            <Tooltip title="Choose">
              <PlusCircleOutlined
                onClick={
                  !disabledPlus(r) ? () => handleChooseContact(r) : undefined
                }
                style={{
                  color: !disabledPlus(r) ? "#0075BF" : "#8D91A0",
                  cursor: !disabledPlus(r) ? "pointer" : "not-allowed",
                }}
                disabled={!disabledPlus(r) ? false : true}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const columnsDetail = [
    {
      title: "NO",
      dataIndex: "no",
      align: "center",
      width: 60,
      render: (t, r, i) => i + 1,
    },

    {
      title: "TYPE",
      dataIndex: "type",
      editable: true,
      sorter: true,
      inputType: "select",
      align: "center",
      width: 150,
      options: dataContactType,
      ...getColumnSearchProps("type"),
      render: (type) => (
        <span>
          {data_contactType &&
            data_contactType.filter((a) => a.id === type).find((b) => b.name)
              ?.name}
        </span>
      ),
    },
    {
      title: "INPUT TYPE",
      dataIndex: "inputType",
      editable: true,
      sorter: true,
      inputType: "select",
      align: "center",
      width: 150,
      options: dataInputType,
      ...getColumnSearchProps("inputType"),
      render: (inputType) => (
        <span>
          {data_inputType &&
            data_inputType.filter((a) => a.id === inputType).find((b) => b.name)
              ?.name}
        </span>
      ),
    },
    {
      title: "VALUE",
      dataIndex: "value",
      inputType: "input",
      editable: true,
      sorter: true,
      width: 700,
      options: dataCountryCode,
      optionsAdditional: dataCountryZone,
      ...getColumnSearchProps("value"),
      render: (_, record, id) => {
        // console.log(suffix, "suffix");
        // console.log(`suffix ${keyModal} ~ ${record.key}`);
        const prefixName1 =
          data_countryCode &&
          data_countryCode
            .filter((a) => a.id === prefix1[`${keyModal}~${record.key}`])
            .find((b) => b.name)?.name;

        const prefixName2 =
          data_countryZone &&
          data_countryZone
            .filter((a) => a.id === prefix2[`${keyModal}~${record.key}`])
            .find((b) => b.text)?.text;

        const tempValue = value[`${keyModal}~${record.key}`];
        // console.log(`tempValueOverviews ${tempValue} prefixName1 ${prefixName1} prefixName2 ${prefixName2} suffix ${suffix[`${keyModal}~${record.key}`]}`);
        if (record.type === 741) {
          if (record.inputType === 748) {
            return (
              <span>{`(${prefixName1}) (${prefixName2}) - ${tempValue} Ext. ${
                suffix[`${keyModal}~${record.key}`] ? suffix[`${keyModal}~${record.key}`] : ""
              }`}</span>
            );
          } else {
            return <span>{`(${prefixName1}) - ${tempValue}`}</span>;
          }
        }
        if (record.type === 746) {
          return <span>{`(${prefixName1}) - ${tempValue}`}</span>;
        }
        if (record.type === 747) {
          return <span>{`(${prefixName1}) - ${tempValue}`}</span>;
        }
        if (record.type === 745) {
          return <span>{`(${prefixName1}) (${prefixName2}) - ${tempValue} Ext. ${
            suffix[`${keyModal}~${record.key}`] ? suffix[`${keyModal}~${record.key}`] : ""
          }`}</span>;
        } else {
          return <span>{tempValue}</span>;
        }
      },
    },
  ];

  const filterDataByPage = () => {
    let result = [...dataTableDetail];
    if (searchedColumn) {
      result = result.filter((item) => {
        return item[searchedColumn]
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
      });
    }
    const handleDataSort = (obj) => {
      switch (fieldSort) {
        case "startDate":
        case "endDate":
          const date = obj[fieldSort]
            ? moment(obj[fieldSort]).format(dateFormatting.date)
            : "";
          return date.toString().toLowerCase();
        default:
          return obj[fieldSort].toString().toLowerCase();
      }
    };
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = handleDataSort(a);
        let fb = handleDataSort(b);
        if (fa < fb) {
          return orderSort === "asc" ? -1 : 1;
        }
        if (fa > fb) {
          return orderSort === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return result.slice((page - 1) * pageSize, page * pageSize);
  };

  const handleCancelModalChooseContact = () => {
    setModalChooseContact(false);
  };

  const disabledPlus = (r) => {
    const temp = contactTable.filter((item) => item.contactId === r.contactId);
    if (temp.length === 0) {
      return false;
    }
    return true;
  };

  const handleValidateWord = () => {
    if(isContactNewExist){
      return "Your contact Information has been used by other new contact. Please input another contact Information to save."
    } else if (emptyValueValidate){
      return "Your contact detail still has missing value. Please input the missing value to save."
    } else if (isEditing){
      return "Your contact detail have not been saved. Please save contact detail first." 
    } else {
      return "Your contact detail is still empty. Please fill in the contact detail first."
    }
  }

  const handleCheckContactFromOthers = (data, newObject) => {
    if (data.length > 0) {
      const matches = (data || []).map((item) => {
        let temp = {
          contactName: item.contactName || null,
          jobId: item.jobId || null,
          positionId: item.positionId || null,
        };
  
        return JSON.stringify(newObject) === JSON.stringify(temp);
      });
      if(matches.includes(true)){
        setIsContactNewExist(true);
      }
      return matches.includes(true);
    }
  
    return false;
  };

  // Handle Choose Contact
  const handleChooseContact = (record) => {
    // console.log(record, "record");
    const modifiedArray = record?.contactDetails?.map((obj, index) => {
      // console.log(`obj ${obj.key}~ keyModal ${keyModal}`, "modifierValue");
      const tempSuffix = obj.suffix;
      return {
        row: keyModal,
        key: index + 1,
        type: obj.type,
        inputType: obj.inputType,
        prefix1: obj.prefix1 || null,
        prefix2: obj.prefix2 || null,
        value: obj.fullValue,
        suffix: tempSuffix ? tempSuffix.toString() : null,
      };
    });

    const newData = [...contactTable];

    const dataValue = {
      ...record,
      jobId: parseInt(record.jobId),
      positionId: parseInt(record.positionId),
      contactDetail: modifiedArray,
      key: keyModal,
      overview: `Contact ${keyModal}`,
      primaryFlag: keyModal === 1 ? true : false,
    };
    delete dataValue.contactDetails;
    newData[keyModal - 1] = dataValue;
    handleContactObj(null, `contactAddress${keyModal}`);
    handleContactObj(null, `additionalNote${keyModal}`);
    handleContactObj(null, `description${keyModal}`);
    
    form.resetFields([`additionalNote${keyModal}`, `description${keyModal}`])
    setContactTable(newData);
    setModalChooseContact(false);
  };

  // Handle Add Value to Array
  const handleAdd = (formValue) => {
    const body = {
      contactName: `${formValue.firstName.trim()}${
        formValue.middleName ? ` ${formValue.middleName.trim()}` : ""
      }${formValue.lastName ? ` ${formValue.lastName.trim()}` : ""}`,
      jobId: formValue.jobId || null,
      positionId: formValue.positionId || null,
    };
    if (!handleCheckContactFromOthers(contactTable, body) && dataTableDetail.length > 0 && !isEditing ) {

      dispatch(
        checkContactExist(body))
          .unwrap()
          .then((data) => {
            // console.log(dataTableDetail, "dataTableDetail")
            const modifiedArray = dataTableDetail.map((obj, index) => {
              const tempSuffix = suffix[`${keyModal}~${index + 1}`];
              // console.log(`obj ${obj.key}~ index ${index + 1}`, "modifierValue");
              return {
                row: keyModal,
                key: obj.key,
                type: obj.type,
                inputType: obj.inputType,
                prefix1: prefix1[`${keyModal}~${index + 1}`] || null,
                prefix2: prefix2[`${keyModal}~${index + 1}`] || null,
                value: value[`${keyModal}~${index + 1}`],
                suffix: tempSuffix || tempSuffix === 0? tempSuffix.toString() : null,
              };
            });

            const newData = [...contactTable];
            // console.log(modifiedArray, "modifier");
            const dataValue = {
              ...formValue,
              contactDetail: modifiedArray,
              contactId: null,
              contactName: `${formValue.firstName.trim()}${
                formValue.middleName ? ` ${formValue.middleName.trim()}` : ""
              }${formValue.lastName ? ` ${formValue.lastName.trim()}` : ""}`,
              key: keyModal,
              overview: `Contact ${keyModal}`,
              primaryFlag: keyModal === 1 ? true : false,
            };

            // replace if value undefined to be null
            const outputObject = {};
            for (const key in dataValue) {
              if (dataValue.hasOwnProperty(key)) {
                if (typeof dataValue[key] === "undefined") {
                  outputObject[key] = null;
                } else {
                  outputObject[key] = dataValue[key];
                }
              }
            }

            newData[keyModal - 1] = outputObject;
            setContactTable(newData);
            handleContactObj(null, `contactAddress${keyModal}`);
            setModalCreateContact(false);
            formContact.resetFields();
            setDataTableDetail([]);
            setSelectDataRecord({});
          })
          .catch((error) => {
            if (Math.floor((error.response.data.code || 0) / 100) === 5) {
              const message =
                (error?.response &&
                  error?.response?.data &&
                  error?.response?.data?.message) ||
                error?.message ||
                error?.toString();
              // console.log(error);
              setBodyError({ message, value: formValue });

              setModalError(true);
            }
          })
    } else {
      setModalValidate(true);
    }
  };

  const handleRetry = () => {
    handleAdd(bodyError?.value);
    setModalError(false);
    setBodyError({});
  };

  useEffect(() => {
    if (Array.isArray(contactTable)) {
      for (const [index, contact] of contactTable.entries()) {
        form.setFieldValue(`contact${index+1}`, contact.contactName);
      }
    }
  }, [contactTable])

  return (
    <div>
      <span className="text-primary uppercase font-bold mt-[60px]">
        CONTACT 1 (PRIMARY CONTACT)
      </span>

      <div className="w-full grid grid-cols-3 gap-2 pt-[30px]">
        <Form.Item label={"Contact 1"} required>
          <Input.Group compact>
            <Form.Item
              name={"contact1"}
              rules={[
                {
                  required: true,
                  message: "Please input your Contact!",
                },
              ]}
              noStyle
            >
              <InputComponent
                disabled={true}
              />
            </Form.Item>
            <Button
              type="primary"
              onClick={() => {
                setKeyModal(1);
                setModalChooseContact(true);
              }}
            >
              Choose
            </Button>
          </Input.Group>
        </Form.Item>

        <Form.Item
          label="Contact Address"
          name="contactAddress1"
          rules={[
            {
              required: true,
              message: "Please input your Contact Address!",
            },
          ]}
          getValueFromEvent={(e) => handleContactObj(e, "contactAddress1")}
        >
          <SelectComponent
            disabled={!contactTable?.map((a) => a.overview)[0] ? true : false}
          >
            {dataAddress &&
              dataAddress?.map((data) => (
                <Select.Option
                  key={data.addressId === null ? data.tempId : data.addressId}
                  value={data.addressId === null ? data.tempId : data.addressId}
                >
                  {data.fullAddress}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item
          label="Contact Address Additional Note"
          name="additionalNote1"
          getValueFromEvent={(e) => handleContactObj(e, "additionalNote1")}
        >
          <InputComponent
            disabled={!contactTable?.map((a) => a.overview)[0] ? true : false}
          />
        </Form.Item>

        <div className="col-span-3">
          <Form.Item
            label={"Description"}
            name={"description1"}
            getValueFromEvent={(e) => handleContactObj(e, "description1")}
          >
            <InputComponent
              type="textarea"
              value={description1}
              onChange={(e) => setDescription1(e.target.value)}
              disabled={!contactTable?.map((a) => a.overview)[0] ? true : false}
            />
          </Form.Item>
        </div>
      </div>

      <span className="text-primary uppercase font-bold mt-[60px]">
        CONTACT 2
      </span>

      <div className="w-full grid grid-cols-3 gap-2 pt-[30px]">
        <Form.Item label={"Contact 2"}>
          <Input.Group compact>
            <Form.Item
              name={"contact2"}
              noStyle
            >
              <InputComponent
                // disabled={
                //   !contactTable?.map((a) => a.overview)[0] ? true : false
                // }
                disabled={true}
              />
            </Form.Item>
            <Button
              type="primary"
              onClick={() => {
                setKeyModal(2);
                setModalChooseContact(true);
              }}
              disabled={
                !contactTable?.map((a) => a.overview)[0] ? true : false
              }
            >
              Choose
            </Button>
          </Input.Group>
        </Form.Item>

        <Form.Item
          label="Contact Address"
          name="contactAddress2"
          getValueFromEvent={(e) => handleContactObj(e, "contactAddress2")}
          rules={[
            {
              required: validateContactAddressForm(2),
              message: "Please input your Contact Address!",
            },
          ]}
        >
          <SelectComponent
            disabled={!contactTable?.map((a) => a.overview)[1] ? true : false}
          >
            {dataAddress &&
              dataAddress?.map((data) => (
                <Select.Option
                  key={data.addressId === null ? data.tempId : data.addressId}
                  value={data.addressId === null ? data.tempId : data.addressId}
                >
                  {data.fullAddress}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item
          label="Contact Address Additional Note"
          name="additionalNote2"
          getValueFromEvent={(e) => handleContactObj(e, "additionalNote2")}
        >
          <InputComponent
            disabled={!contactTable?.map((a) => a.overview)[1] ? true : false}
          />
        </Form.Item>

        <div className="col-span-3">
          <Form.Item
            label={"Description"}
            name={"description2"}
            getValueFromEvent={(e) => handleContactObj(e, "description2")}
          >
            <InputComponent
              type="textarea"
              value={description2}
              onChange={(e) => setDescription2(e.target.value)}
              disabled={!contactTable?.map((a) => a.overview)[1] ? true : false}
            />
          </Form.Item>
        </div>
      </div>

      <span className="text-primary uppercase font-bold mt-[60px]">
        CONTACT 3
      </span>

      <div className="w-full grid grid-cols-3 gap-2 pt-[30px]">
        <Form.Item label={"Contact 3"}>
          <Input.Group compact>
            <Form.Item
              name={"contact3"}
              noStyle
            >
              <InputComponent
                // disabled={
                //   !contactTable?.map((a) => a.overview)[1] ? true : false
                // }
                disabled={true}
              />
            </Form.Item>
            <Button
              type="primary"
              onClick={() => {
                setKeyModal(3);
                setModalChooseContact(true);
              }}
              disabled={
                !contactTable?.map((a) => a.overview)[1] ? true : false
              }
            >
              Choose
            </Button>
          </Input.Group>
        </Form.Item>

        <Form.Item
          label="Contact Address"
          name="contactAddress3"
          getValueFromEvent={(e) => handleContactObj(e, "contactAddress3")}
          rules={[
            {
              required: validateContactAddressForm(3),
              message: "Please input your Contact Address!",
            },
          ]}
        >
          <SelectComponent
            disabled={!contactTable?.map((a) => a.overview)[2] ? true : false}
          >
            {dataAddress &&
              dataAddress?.map((data) => (
                <Select.Option
                  key={data.addressId === null ? data.tempId : data.addressId}
                  value={data.addressId === null ? data.tempId : data.addressId}
                >
                  {data.fullAddress}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item
          label="Contact Address Additional Note"
          name="additionalNote3"
          getValueFromEvent={(e) => handleContactObj(e, "additionalNote3")}
        >
          <InputComponent
            disabled={!contactTable?.map((a) => a.overview)[2] ? true : false}
          />
        </Form.Item>

        <div className="col-span-3">
          <Form.Item
            label={"Description"}
            name={"description3"}
            getValueFromEvent={(e) => handleContactObj(e, "description3")}
          >
            <InputComponent
              type="textarea"
              value={description3}
              onChange={(e) => setDescription3(e.target.value)}
              disabled={!contactTable?.map((a) => a.overview)[2] ? true : false}
            />
          </Form.Item>
        </div>
      </div>

      <span className="text-primary uppercase font-bold mt-[60px]">
        CONTACT 4
      </span>

      <div className="w-full grid grid-cols-3 gap-2 pt-[30px]">
        <Form.Item label={"Contact 4"}>
          <Input.Group compact>
            <Form.Item
              name={"contact4"}
              noStyle
            >
              <InputComponent
                // disabled={
                //   !contactTable?.map((a) => a.overview)[2] ? true : false
                // }
                disabled={true}
              />
            </Form.Item>
            <Button
              type="primary"
              onClick={() => {
                setKeyModal(4);
                setModalChooseContact(true);
              }}
              disabled={
                !contactTable?.map((a) => a.overview)[2] ? true : false
              }
            >
              Choose
            </Button>
          </Input.Group>
        </Form.Item>

        <Form.Item
          label="Contact Address"
          name="contactAddress4"
          getValueFromEvent={(e) => handleContactObj(e, "contactAddress4")}
          rules={[
            {
              required: validateContactAddressForm(4),
              message: "Please input your Contact Address!",
            },
          ]}
        >
          <SelectComponent
            disabled={!contactTable?.map((a) => a.overview)[3] ? true : false}
          >
            {dataAddress &&
              dataAddress?.map((data) => (
                <Select.Option
                  key={data.addressId === null ? data.tempId : data.addressId}
                  value={data.addressId === null ? data.tempId : data.addressId}
                >
                  {data.fullAddress}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item
          label="Contact Address Additional Note"
          name="additionalNote4"
          getValueFromEvent={(e) => handleContactObj(e, "additionalNote4")}
        >
          <InputComponent
            disabled={!contactTable?.map((a) => a.overview)[3] ? true : false}
          />
        </Form.Item>

        <div className="col-span-3">
          <Form.Item
            label={"Description"}
            name={"description4"}
            getValueFromEvent={(e) => handleContactObj(e, "description4")}
          >
            <InputComponent
              type="textarea"
              value={description4}
              onChange={(e) => setDescription4(e.target.value)}
              disabled={!contactTable?.map((a) => a.overview)[3] ? true : false}
            />
          </Form.Item>
        </div>
      </div>

      {/* Modal Choose Contact */}
      {modalChooseContact ? <ModalCustom
        isOpen={modalChooseContact}
        type="confirmation"
        header={"Choose Contact"}
        width={1200}
        handleCancel={handleCancelModalChooseContact}
        footer={
          <div className={"w-full flex justify-end gap-5"}>
            <ButtonComponent
              type={"default"}
              onClick={handleCancelModalChooseContact}
            >
              Cancel
            </ButtonComponent>
          </div>
        }
      >
        <span className="text-primary uppercase font-bold">
          CONTACT INFORMATION
        </span>

        <div className="w-full flex justify-end my-[30px]">
          <ButtonComponent
            type={"submit"}
            onClick={() => {
              setModalChooseContact(false);
              setModalCreateContact(true);
            }}
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
          >
            Create
          </ButtonComponent>
        </div>

        <div className="w-full">
          <TablePagination
            dataSource={dataSource}
            columns={columns}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            onSizeChanger={handleChange}
            onSort={onSort}
            totalData={data_contact?.page?.totalElements}
            tableScrolled={{
              x: 1500,
              y: 300,
            }}
            expandable={{
              expandedRowRender,
            }}
          />
        </div>
      </ModalCustom> : null}

      {/* Modal Create Contact */}
      {
      modalCreateContact ||
      !dataTableDetail.length ||
      !Object.entries(selectDataRecord).length ? (
        <ModalCustom
          isOpen={modalCreateContact}
          type="confirmation"
          header="CREATE CONTACT"
          width={1200}
          handleOk={() => handleAdd()}
          handleCancel={() => {
            formContact.resetFields();
            setSelectDataRecord({});
            setDataTableDetail([]);
            setModalCreateContact(false);
            setModalChooseContact(true);
          }}
          footer={
            <div className={"w-full flex justify-end gap-5"}>
              <Form.Item>
                <ButtonComponent
                  type="default"
                  onClick={() => {
                    setDataTableDetail([]);
                    setSelectDataRecord({});
                    formContact.resetFields();
                    setModalCreateContact(false);
                    setModalChooseContact(true);
                  }}
                >
                  Cancel
                </ButtonComponent>
              </Form.Item>
              <Form.Item>
                <ButtonComponent
                  type="submit"
                  htmlType={"submit"}
                  form={"formContact"}
                >
                  Save
                </ButtonComponent>
              </Form.Item>
            </div>
          }
        >
          <Form
            layout="vertical"
            form={formContact}
            onFinish={handleAdd}
            id={"formContact"}
            scrollToFirstError={{ behavior: "smooth", block: "center" }}
          >
            <span className="text-primary uppercase font-bold">
              CONTACT INFORMATION
            </span>

            <div className="w-full grid grid-cols-3 gap-2 pt-[30px]">
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: "Please input your First Name!",
                  },
                ]}
              >
                <InputComponent onInput={onInputUpperCase} />
              </Form.Item>
              <Form.Item label="Middle Name" name="middleName">
                <InputComponent onInput={onInputUpperCase} />
              </Form.Item>
              <Form.Item label="Last Name" name="lastName">
                <InputComponent onInput={onInputUpperCase} />
              </Form.Item>
              <Form.Item label="Job" name="jobId">
                <SelectComponent>
                  {data_job &&
                    data_job?.map((data) => (
                      <Select.Option key={data.id} value={data.id}>
                        {data.name}
                      </Select.Option>
                    ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item label="Position" name="positionId">
                <SelectComponent>
                  {data_position &&
                    data_position?.map((data) => (
                      <Select.Option key={data.id} value={data.id}>
                        {data.name}
                      </Select.Option>
                    ))}
                </SelectComponent>
              </Form.Item>
            </div>

            <span className="text-primary uppercase font-bold">
              CONTACT DETAIL INFORMATION
            </span>

            <div className="w-full">
              <DynamicTableInlineWithoutBase
                tableData={filterDataByPage()}
                onDataChange={setDataTableDetail}
                cols={columnsDetail}
                mode={"create"}
                usePagination={true}
                useSelect={true}
                totalData={totalElements}
                pageSize={pageSize}
                current={page}
                onChangePage={handleChange}
                actionButton={["update", "delete"]}
                onSort={onSortDetail}
                selectDataRecord={selectDataRecord}
                setSelectDataRecord={setSelectDataRecord}
                scrollTable={{ y: 525 }}
                setPrefix1={setPrefix1}
                setPrefix2={setPrefix2}
                setSuffix={setSuffix}
                suffix={suffix}
                setValue={setValue}
                prefix1={prefix1}
                prefix2={prefix2}
                value={value}
                keyModal={keyModal}
                getCountryZone={getCountryZoneByIdCountryCode}
                setIsEditing={setIsEditing}
                setModalValidate={setModalValidate}
                setEmptyValueValidate={setEmptyValueValidate}
              />
            </div>
          </Form>
        </ModalCustom>
      ) : null}

      { modalValidate ? <ModalError
        isOpen={modalValidate}
        handleOk={() => {          
          setEmptyValueValidate(false)
          setIsContactNewExist(false)
          setModalValidate(false)
        }}
        handleCancel={() => {          
          setEmptyValueValidate(false)
          setIsContactNewExist(false)
          setModalValidate(false)
        }}
        customText={"Back"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">
            {
              handleValidateWord()
            }
          </p>
        </div>
      </ModalError> : null}

      {modalError ? <ModalError
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
          <p className="pl-[70px]">{`Your data was not created. ${bodyError?.message}`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>: null}
    </div>
  );
};

export default ContactForm;
