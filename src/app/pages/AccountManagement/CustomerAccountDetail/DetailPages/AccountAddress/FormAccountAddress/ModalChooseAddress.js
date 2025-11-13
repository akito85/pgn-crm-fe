import React, { useRef } from "react";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import TablePagination from "../../../../../../../components/TablePagination";
import { FilterOutlined, PlusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { DatePicker, Input, Spin, Tooltip } from "antd";
import moment from "moment";
import Highlighter from "react-highlight-words";

import { dateFormatting } from "../../../../../../../utils";

const ModalChooseAddress = ({
  isOpen,
  dataTable,
  page,
  pageSize,
  closeModal = () => {},
  handleSelectAddress = () => {},
  modalCreateNewAddress = () => {},
  getDetailAddressById = () => {},
  dispatch,
  getListChooseAddress,
  idAccount,
  setPage,
  setPageSize,
  sort,
  setSort,
  searchedColumn,
  searchText,
  setSearchText,
  setSearchedColumn,
  setSearch,
  isIdChoose,
  setIsIdChoose,
  loading
}) => {
  const searchInput = useRef(null);

  const handleCloseModal = () => {
    closeModal((prevState) => (prevState = false));
  };
  const handleModalCreateNew = () => {
    modalCreateNewAddress((prevState) => (prevState = true));
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
    setSearchedColumn(dataIndex);
    setSearch(
      selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`
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
      title: "ADDRESS",
      dataIndex: "fullAddress",
      width: 350,
      sorter: true,
      ...getColumnSearchProps(
        "fullAddress",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (fullAddress) => (
        <Tooltip placement="topLeft" title={fullAddress}>
          <p className="overflow-hidden truncate">{fullAddress}</p>
        </Tooltip>
      ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 150,
      sorter: true,
      ellipsis: {
        showTitle: false
      },
      ...getColumnSearchProps(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (fullAddress) => (
        <Tooltip placement="topLeft" title={fullAddress}>
          <p className="overflow-hidden truncate">{fullAddress}</p>
        </Tooltip>
      ),
    },
    {
      title: "HOUSE NAME",
      dataIndex: "houseName",
      width: 250,
      sorter: true,
      ...getColumnSearchProps(
        "houseName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "STREET NAME",
      dataIndex: "streetName",
      width: 250,
      sorter: true,
      ...getColumnSearchProps(
        "streetName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    
    {
      title: "STREET NUMBER",
      dataIndex: "streetNumber",
      width: 250,
      sorter: true,
      ...getColumnSearchProps(
        "streetNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "HOUSE NUMBER",
      dataIndex: "houseNumber",
      width: 250,
      sorter: true,
      ...getColumnSearchProps(
        "houseNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "RT",
      dataIndex: "rt",
      width: 150,
      sorter: true,
      ...getColumnSearchProps(
        "rt",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "RW",
      dataIndex: "rw",
      width: 150,
      sorter: true,
      ...getColumnSearchProps(
        "rw",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "ADDITIONAL NOTE",
      dataIndex: "additionalNote",
      width: 250,
      sorter: true,
      ...getColumnSearchProps(
        "additionalNote",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "BUILDING",
      dataIndex: "building",
      width: 150,
      sorter: true,
      ...getColumnSearchProps(
        "building",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "FLOOR",
      dataIndex: "floor",
      width: 150,
      sorter: true,
      ...getColumnSearchProps(
        "floor",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "POSTAL CODE",
      dataIndex: "postalCode",
      width: 150,
      sorter: true,
      ...getColumnSearchProps(
        "postalCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "SUB DISTRICT",
      dataIndex: "subDistrict",
      width: 150,
      sorter: true,
      ...getColumnSearchProps(
        "subDistrict",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "DISTRICT",
      dataIndex: "district",
      width: 150,
      sorter: true,
      ...getColumnSearchProps(
        "district",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "CITY",
      dataIndex: "city",
      width: 300,
      sorter: true,
      ...getColumnSearchProps(
        "city",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "PROVINCE",
      dataIndex: "province",
      width: 150,
      sorter: true,
      ...getColumnSearchProps(
        "province",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "COUNTRY",
      dataIndex: "country",
      width: 150,
      sorter: true,
      ...getColumnSearchProps(
        "country",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "SOURCE",
      dataIndex: "source",
      width: 250,
      sorter: true,
      ...getColumnSearchProps(
        "source",
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
              <PlusCircleOutlined
                onClick={() => {
                  if (
                    (r.country !== null ||
                    r.province !== null ||
                    r.city !== null ||
                    r.district !== null ||
                    r.subDistrict !== null) &&
                    isIdChoose !== r?.address
                  ) {
                    setIsIdChoose(r.address);
                    getDetailAddressById(r?.address);
                  } else{
                    return ''
                  }
                }}
                style={{
                  color: "#0075BF",
                  cursor:
                    r.country === null ||
                    r.province === null ||
                    r.city === null ||
                    r.district === null ||
                    r.subDistrict === null ||
                    isIdChoose == r?.address
                      ? "not-allowed"
                      : "pointer",
                }}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
    dispatch(
      getListChooseAddress({ idAccount, page: tempPage, pageSize: pageSizeChange, sort })
    );
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  return (
    <div>
      {isOpen ? 
        <ModalCustom
          header={"CHOOSE ADDRESS"}
          isOpen={isOpen}
          type={"confirmation"}
          handleCancel={() => {
            handleCloseModal();
          }}
          width={1200}
          footer={
            <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
              <ButtonComponent onClick={handleCloseModal} type="default">
                Cancel
              </ButtonComponent>
            </div>
          }
        >
          <Spin spinning={loading}>
            <div className="flex w-full justify-end gap-x-2 pb-6">
              <ButtonComponent
                type="submit"
                onClick={() => handleModalCreateNew()}
                icon={<PlusOutlined style={{ fontSize: "24px" }} />}
              >
                Create
              </ButtonComponent>
            </div>
            <TablePagination
              dataSource={dataTable?.result}
              totalData={dataTable?.page?.totalElements}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChangeSize}
              tableScrolled={{ y: 400, x: 1300 }}
              onSort={onSort}
              columns={columns}
            />
          </Spin>
        </ModalCustom> : 
        null
      }
    </div>
  );
};

export default ModalChooseAddress;
