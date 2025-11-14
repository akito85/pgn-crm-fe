import React,{ useState, useRef } from 'react'
import { DatePicker, Form, Input, Select } from 'antd'
import moment from "moment";
import Highlighter from "react-highlight-words";
import { useDispatch } from "react-redux";

import { dateFormatting } from "../../../../../../../utils";
import InputComponent from '../../../../../../../components/InputComponent'
import SelectComponent from '../../../../../../../components/SelectComponent'
import ButtonComponent from '../../../../../../../components/ButtonComponent'
import ModalCustom from '../../../../../../../components/Modal/ModalCustom'
import { FilterOutlined } from '@ant-design/icons';
import TableInlineAccount from './TableInlineContact';
import { getCountryZone } from '../../../../../../../redux/slices/account_management/detailAccount/accountContactSlice';
import { onInputUpperCase } from '../../../../Utils';


const ModalCreateNewContact = ({
  isOpen,
  setModalCreateNewContact,
  dataJob = [],
  dataPosition = [],
  dataContactType = [],
  dataInputType = [],
  dataCountryCode = [],
  dataCountryZone = [],
  keyModal,
  setDataCreateNew,
  setModalChooseContact,
  handleResetDataDetail,
  prefix1,
  setPrefix1,
  prefix2,
  setPrefix2,
  suffix,
  setSuffix,
  value,
  setValue,
  setEmptyValueValidate = () => {},
  setIsEditing = () => {},
  isEditing,
  setModalValidate = () => {},
}) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();

  // Table Inline
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [totalElements, setTotalElement] = useState(0);

  // const [prefix1, setPrefix1] = useState({});
  // const [prefix2, setPrefix2] = useState({});
  // const [suffix, setSuffix] = useState({});
  // const [value, setValue] = useState({});


  const [dataTableDetail, setDataTableDetail] = useState([]);
  const searchInput = useRef(null);
  const [selectDataRecord, setSelectDataRecord] = useState({});

  const dataContactTypeRes = dataContactType?.map((item) => {
    return {
      value: item.id,
      label: item.text,
    };
  });
  const dataInputTypeRes = dataInputType?.map((item) => {
    return {
      value: item.id,
      label: item.text,
    };
  });
  const dataCountryZoneRes = (dataCountryZone || [])?.map((item) => {
    return {
      value: item.id,
      label: item.text,
    };
  });

  const dataCountryCodeRes = dataCountryCode?.map((item) => {
    return {
      value: item.id,
      label: item.text,
    };
  });
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
      options: dataContactTypeRes,
      ...getColumnSearchProps("type"),
      render: (type) => (
        <span>
          {dataContactType &&
            dataContactType
              .filter((a) => a.id === type)
              .find((b) => b.text)?.text}
        </span>
      ),
    },
    {
      title: "INPUT TYPE",
      dataIndex: "inputType",
      editable: true,
      sorter: true,
      inputType: "select",
      options: dataInputTypeRes,
      ...getColumnSearchProps("inputType"),
      render: (inpuType) => (
        <span>
          {dataInputType &&
            dataInputType
              .filter((a) => a.id === inpuType)
              .find((b) => b.text)?.text}
        </span>
      ),
    },
    {
      title: "VALUE",
      dataIndex: "value",
      inputType: "input",
      editable: true,
      sorter: true,
      options: dataCountryCodeRes,
      optionsAdditional: dataCountryZoneRes,
      width: 700,
      ...getColumnSearchProps("value"),
      render: (_, record, id) => {
        const prefixName1 =
        dataCountryCode &&
        dataCountryCode.filter((a) => a.id === prefix1[`${record.key}`]).find((b) => b.text)?.text

        const prefixName2 =
          dataCountryZone &&
          dataCountryZone.filter((a) => a.id === prefix2[`${record.key}`]).find((b) => b.text)?.text;

        const tempValue = value[`${record.key}`];
        if (record.type === 741) {
          if (record.inputType === 748) {
            return (
              <span>{`(${prefixName1}) (${prefixName2}) - ${tempValue} Ext ${suffix[`${record.key}`]}`}</span>
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
          return <span>{`(${prefixName1}) (${prefixName2}) - ${tempValue} Ext ${suffix[`${record.key}`]}`} </span>;
        } else {
          return <span>{tempValue}</span>;
        }
      },
    },
  ];

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch(
      selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`
    );
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
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

  const handlePushToMainForm = (e) => {
    // handleResetDataDetail()
    if(dataTableDetail.length > 0 && !isEditing){
      const modifiedArray = dataTableDetail.map((obj, index) => {
        const tempSuffix = suffix[`${obj.key}`];
        const tempValue = value[`${obj.key}`];
        return {
          key: obj.key,
          typeId: obj.type,
          inputTypeId: obj.inputType,
          prefix1: prefix1[`${obj.key}`] || null,
          prefix2: prefix2[`${obj.key}`] || null,
          value: tempValue,
          sufix: tempSuffix ? tempSuffix.toString() : null,
        };
      });
      const dataValue = {
        firstName: e.firstName,
        middleName: e.middleName,
        lastName: e.lastName,
        job: e.job,
        position: e.position,
        contactDetail: modifiedArray,
      }
      setDataCreateNew(dataValue)
      setModalCreateNewContact(false)
      setModalChooseContact(false)
      resetDataCreateNew()
    } else {
      setModalValidate(true)
    }
  }

  const resetDataCreateNew = () => {
    setTimeout(() => {
      form.resetFields()
      setDataTableDetail([])
      setPrefix1({})
      setPrefix2({})
      setSuffix({})
      setValue({})
      setSelectDataRecord({})
    }, 1000);
  }
  const getCountryZoneByIdCountryCode = (e) => {
    if(e !== undefined){
      dispatch(getCountryZone(e))
    }
  }

  return (
    <div>
      <ModalCustom
        header={"CREATE NEW CONTACT"}
        isOpen={isOpen} 
        type={"confirmation"} 
        handleCancel={()=>{
          resetDataCreateNew()
          setModalCreateNewContact(false)
        }}
        width={1000}
        footer={
          <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
            <ButtonComponent
              onClick={()=>{
                resetDataCreateNew()
                setModalCreateNewContact(false);
              }}
              type="default"
              disabled={isEditing}
            >
              Cancel
            </ButtonComponent>
            <ButtonComponent 
              type="submit" 
              htmlType={"submit"} 
              form={"formContactNew"}
              // disabled={dataTableDetail.length > 0 ? false : true}
              // onClick={handlePushToMainForm}
            >
              Save
            </ButtonComponent>
          </div>
        }
      >
        <Form 
        layout='vertical' 
        onFinish={
          // dataTableDetail.length > 0 ? 
          handlePushToMainForm 
          // : ""
          } 
        form={form} id="formContactNew">
          <div>
            <div className='text-primary text-xs font-bold uppercase'> 
              <p>CONTACT INFORMATION</p>
            </div>

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
                <InputComponent 
                  onInput={onInputUpperCase}/>
              </Form.Item>
              <Form.Item
                name="middleName"
                label={"Middle Name"}
              >
                <InputComponent 
                  onInput={onInputUpperCase}/>
              </Form.Item>
              <Form.Item
                name="lastName"
                label={"Last Name"}
              >
                <InputComponent 
                  onInput={onInputUpperCase}/>
              </Form.Item>
              <Form.Item
                name="job"
                label={"Job"}
              >
                <SelectComponent>
                  {dataJob &&
                    dataJob?.map((data) => (
                      <Select.Option key={data.id} value={data.id}>
                        {data.text}
                      </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item
                name="position"
                label={"Position"}
              >
                <SelectComponent>
                  {dataPosition &&
                    dataPosition?.map((data) => (
                      <Select.Option key={data.id} value={data.id}>
                        {data.text}
                      </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>
            </div>

            {/* CONTACT DETAIL */}
            <div className='pb-8'>
              <p className='text-primary text-xs font-bold uppercase'>CONTACT DETAIL</p>
              <TableInlineAccount
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
                scrollTable={{ y: 525, x: 1400 }}
                setPrefix1={setPrefix1}
                setPrefix2={setPrefix2}
                setSuffix={setSuffix}
                suffix={suffix}
                setValue={setValue}
                prefix1={prefix1}
                prefix2={prefix2}
                value={value}
                keyModal={keyModal}
                dataTableDetail={dataTableDetail}
                getCountryZone={getCountryZoneByIdCountryCode}
                setEmptyValueValidate={setEmptyValueValidate}
                setIsEditing={setIsEditing}
                setModalValidate={setModalValidate}
              />
            </div>

          </div>
        </Form>
      </ModalCustom>
    </div>
  )
}

export default ModalCreateNewContact