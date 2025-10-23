import React, {useState, useEffect, useRef} from 'react'
import moment from 'moment'
import { FilterOutlined, PlusCircleOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { DatePicker, Input, Tooltip } from 'antd'

import ModalCustom from '../../../../../../../../components/Modal/ModalCustom'
import ButtonComponent from '../../../../../../../../components/ButtonComponent'
import TablePagination from '../../../../../../../../components/TablePagination'
import { dateFormatting } from '../../../../../../../../utils'

const ModalChooseProduct = ({
  modalChooseProduct,
  setModalChooseProduct,
  dataProduct,
  getProductDetailById,
  getListProduct,
  idAccount,
  serviceType,
  dispatch,
  isMain
}) => {

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState("");
  const searchInput = useRef(null);
  const [orderSort, setOrderSort] = useState("");
  const [fieldSort, setFieldSort] = useState("");

  // USE EFFECT
  useEffect(() => {
    const body = {
      idAccount: idAccount,
      serviceTypeId: serviceType,
      idProductType: isMain === "Y" ? 245 : 287
    }
    dispatch(getListProduct({body:body}))
  }, [serviceType])

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
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
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
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "PRODUCT NAME",
      dataIndex: "productName",
      width: 150,
      sorter: true,
      ...getColumnSearchProps(
        'productName',
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "PRODUCT TYPE",
      dataIndex: "productType",
      width: 150,
      sorter: true,
      ...getColumnSearchProps(
        'productType',
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "SERVICE TYPE",
      dataIndex: "serviceType",
      width: 150,
      sorter: true,
      ...getColumnSearchProps(
        'serviceType',
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "PRODUCT CLASS",
      dataIndex: "productClass",
      width: 150,
      sorter: true,
      ...getColumnSearchProps(
        'productClass',
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "ACTION",
      align: "center",
      width: 100,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex justify-center align-middle gap-2">
            <Tooltip title="Choose">
              <PlusCircleOutlined onClick={()=>getProductDetailById(r?.id)} style={{color: "#0075BF", cursor: "pointer"}}/>
            </Tooltip>
          </div>
        );
      },
    },
  ]


  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };


  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  const filterDataByPage = (typeData = "data") => {
    let result = [...dataProduct];
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
            ? moment(obj[fieldSort]).format("DD MMM YYYY")
            : "";
          return date.toString().toLowerCase();
        case "fileSize":
          return obj.size;
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
    const fix = result.slice((page - 1) * pageSize, page * pageSize);
    return typeData === "data" ? fix : result.length;
  };

  return (
    <div>
      {/* Modal Choose Product */}
      <ModalCustom
        isOpen={modalChooseProduct}
        type="confirmation"
        header={"CHOOSE PRODUCT"}
        width={1200}
        handleCancel={() => setModalChooseProduct(false)}
        footer={
          <div className={"w-full flex justify-end gap-5"}>
            <ButtonComponent
              type={"default"}
              onClick={() => setModalChooseProduct(false)}
            >
              Cancel
            </ButtonComponent>
          </div>
        }
      >
        <span className="text-primary uppercase font-bold pb-4">
          PRODUCT INFORMATION
        </span>

        <div className="w-full">
          {dataProduct && (
            <TablePagination
              dataSource={filterDataByPage("data")}
              totalData={filterDataByPage("length")}
              columns={columns}
              current={page}
              pageSize={pageSize}
              onChange={handleChangeSize}
              onSort={onSort}
              tableScrolled={{
                x: 1200,
                y: 300,
              }}
            />
          )}
        </div>
      </ModalCustom>
    </div>
  )
}

export default ModalChooseProduct