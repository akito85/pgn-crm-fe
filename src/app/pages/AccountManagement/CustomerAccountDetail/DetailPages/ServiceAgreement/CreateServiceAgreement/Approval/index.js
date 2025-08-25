import React,{useState, useEffect, useRef} from 'react'
import { useDispatch, useSelector } from "react-redux";

import BaseContainer from '../../../../../../../../components/BaseContainer'
import TablePagination from '../../../../../../../../components/TablePagination'
import { Form, Input, Select, Spin } from 'antd';
import SelectComponent from '../../../../../../../../components/SelectComponent';
import { getListApprovalById } from "../../../../../../../../redux/slices/product_promo/PricingRule/PricingRuleSlice";
import { FilterOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const expandedRowRender = (record) => {
  const dataExpand = record?.employeeDetail
  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: 'EMPLOYEE',
      dataIndex: 'employeeName',
    }
  ];
  return (
    <div className="flex flex-col py-4 pr-4 pl-[48px]">
      <p className="text-primary text-xs font-bold uppercase">
        {"EMPLOYEE INFORMATION"}
      </p>
      <TablePagination
        useSelect={false}
        usePagination={false}
        dataSource={dataExpand}
        columns={columns}
      />
    </div>
  )
};

const Approval = ({
  dataApprovalList,
  dataDetailApproval,
  handleDetailApproval,
  setAppHierDataDetail,
  appHierDataDetail=[],
  handleSaApprovalObj,
  saApprovalObj,
  loading,
  form
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [boolean, setBoolean] = useState(false);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const isApprovalId = form.getFieldsValue('appHierId')

  useEffect(() => {
    const data = dataDetailApproval?.map((a, index) => ({
      ...a,
      key: index + 1,
      employeeDetail: a?.employeeDetail?.map((b, index) => ({
        ...b,
        key: index + 1,
      })),
    }));
    setAppHierDataDetail(data);
  }, [dataDetailApproval])


  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: 'HIERARCHY',
      dataIndex: 'hierarchy',
    },
    {
      title: 'POSITION',
      dataIndex: 'position',
    }
  ];
  const dataSource = []
  for (let i = 0; i < 10; ++i) {
    dataSource.push({
      key: i+1,
      hierarchy: "Submiter",
      position: "CM Bogor 1",
      dataDetail: [
        {
          employee: `Karyawan ${i+1}`
        },
        {
          employee: `Karyawan ${i+2}`
        },
        {
          employee: `Karyawan ${i+3}`
        }
      ]
    });
  }

  //  Handle Select Approval Hierarchy
  const handleSelect = (e) => {
    // dispatch(getListApprovalById(e));
    setBoolean(true);
  };

  const getColumnSearchProps = (
    dataIndex,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch
  ) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
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
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
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
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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

  const columnApprovalData = (
    searchInput,
    searchedColumn,
    searchText,
    handleSearch
  ) => {
    return [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        title: "HIERARCHY",
        dataIndex: "approvalLevel",
        ...getColumnSearchProps(
          "approvalLevel",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        title: "POSITION",
        dataIndex: "position",
        ...getColumnSearchProps(
          "position",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
    ];
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  
  return (
    <div>
      <div className="pt-8 pb-4"><h3 className="text-primary text-xs font-bold uppercase">APPROVAL</h3></div>
      <div className="w-full grid grid-cols-1 gap-2">
        <div className="w-1/3">
          <Form.Item
            label={"Approval Hierarchy"}
            name={"appHierId"}
            getValueFromEvent={(e) =>handleSaApprovalObj(e, "appHierId")}
            rules={[
              {
                message: "Please input your Approval Hierarchy",
                required: true,
              },
            ]}
            className='pb-6'
          >
            <SelectComponent onChange={(e)=>handleDetailApproval(e)}>
              {dataApprovalList?.map((data, index) => (
                <Select.Option key={index} value={data?.appHierId}>
                  {data?.approvalName}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
        </div>
      </div>

      {/* Table */}
      <Spin spinning={loading}>
        {isApprovalId && isApprovalId.appHierId !== undefined && (
          <div className='py-3 mb-6'>
            <TablePagination
              useSelect={false}
              usePagination={false}
              dataSource={appHierDataDetail}
              columns={columnApprovalData(
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
              )}
              expandable={{
                expandedRowRender,
              }}
            />
          </div>
        )}
      </Spin>
    </div>
  )
}

export default Approval