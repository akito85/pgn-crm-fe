import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { DatePicker, Input, Space, Tooltip } from "antd";
import Highlighter from "react-highlight-words";
import { FilterOutlined } from "@ant-design/icons";
import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";
import StatusComponent from "../../../../../../../components/StatusComponent";
import SVGIcon from "../../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import TablePagination from "../../../../../../../components/TablePagination";
import ModalDetailAccountOnetime from "../../Modal/ModalDetailAccountOnetime";
import {
  getAllCustomerOneTimePaginate,
  getDetailCustomerOneTime,
} from "../../../../../../../redux/slices/account_management/Account/accountSlice";

const CustomerIdentificationForm = ({
  handleNext = () => {},
  dispatch = () => {},
  setIdOneTime,
  setCreateOrChoose,
}) => {
  // Selector
  const { loading, data_customerOneTime, data_detailCustomerOnetime } =
    useSelector((state) => state.account);

  // Declaration
  const searchInput = useRef(null);
  const dataTable = data_customerOneTime?.result;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [dataSource, setDataSource] = useState([]);

  const [modalDetail, setModalDetail] = useState(false);

  // Use Effect
  useEffect(() => {
    dispatch(getAllCustomerOneTimePaginate({ page, pageSize, sort, search }));
  }, [page, pageSize, sort, search]);

  // Use Effect
  // useEffect(() => {
  //   dispatch(getDetailCustomerOneTime())
  // }, []);

  useEffect(() => {
    if (dataTable && dataTable?.length > 0) {
      const data = dataTable?.map((a, index) => ({
        ...a,
        key: index + 1,
        accountList: a.accountList?.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setDataSource(data);
    }
  }, [dataTable]);

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
      selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`,
    );
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

  // Column Expand One Time
  const expandedRowRender = (record) => {
    const columns = (
      searchInput,
      searchedColumn,
      searchText,
      handleSearch = () => {},
    ) => {
      return [
        {
          title: "NO",
          align: "center",
          width: 60,
          render: (text, object, index) => index + 1,
        },
        {
          title: "ACCOUNT NUMBER",
          dataIndex: "accountNumber",
          ...getColumnSearchProps(
            "accountNumber",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
          ),
        },
        {
          title: "ACCOUNT NAME",
          dataIndex: "accountName",
          ...getColumnSearchProps(
            "accountName",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
          ),
        },
        {
          title: "SEGMENT",
          dataIndex: "accountSegment",
          align: "center",
          ...getColumnSearchProps(
            "segment",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
          ),
        },
        {
          title: "GROUP TYPE",
          dataIndex: "accountGroupType",
          align: "center",
          ...getColumnSearchProps(
            "groupType",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
          ),
        },
      ];
    };
    return (
      <div>
        <p className="text-primary text-xs font-bold uppercase pt-4">
          ACCOUNT INFORMATION
        </p>
        <TablePagination
          useSelect={false}
          usePagination={false}
          dataSource={record.accountList}
          columns={columns()}
          className={"mb-4"}
          tableScrolled={{
            x: 1300,
          }}
        />
      </div>
    );
  };

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
      ...getColumnSearchProps("customerNumber"),
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      sorter: true,
      ...getColumnSearchProps("customerName"),
    },
    {
      title: "CUSTOMER TYPE",
      dataIndex: "customerType",
      sorter: true,
      align: "center",
      ...getColumnSearchProps("customerType"),
    },
    {
      title: "CUSTOMER MANAGEMENT",
      dataIndex: "customerManagement",
      sorter: true,
      ...getColumnSearchProps("customerManagement"),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      sorter: true,
      ...getColumnSearchProps("status"),
      render: (index) => (
        <div className={" flex justify-center"}>
          <StatusComponent colour={index}>{index}</StatusComponent>
        </div>
      ),
    },
    {
      title: "ACTION",
      fixed: "right",
      width: 100,
      align: "center",
      dataIndex: "customerId",
      render: (id, record) => {
        return (
          <Space>
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon
                  name="IconDetail"
                  width={24}
                  onClick={() => {
                    handleDetail(id);
                  }}
                />
              </div>
            </Tooltip>
            <Tooltip title="Add Account">
              <div className="pt-1">
                <SVGIcon
                  name="IconActionCreate"
                  width={24}
                  color={"#0075BF"}
                  onClick={() => {
                    setCreateOrChoose("choose");
                    handleNext({
                      customerTypeId: record?.customerTypeId,
                      identificationTypeId: record?.identificationTypeId,
                      identificationNumber: record?.identificationNumber,
                    });
                    setIdOneTime(id);
                  }}
                />
              </div>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const handleDetail = (id) => {
    dispatch(getDetailCustomerOneTime(id));
    setModalDetail(true);
  };

  return (
    <div>
      <p className="text-primary uppercase font-bold pt-[30px]">
        One Time Customer List
      </p>

      <div className="w-full flex justify-end pt-[30px]">
        <ButtonComponent
          icon={<SVGIcon name="IconButtonCreate" width={24} />}
          type="submit"
          onClick={() => {
            setCreateOrChoose("create");
            handleNext({
              customerTypeId: null,
              identificationTypeId: null,
              identificationNumber: null,
            });
          }}
        >
          Create
        </ButtonComponent>
      </div>

      <div className="w-full pt-[30px]">
        <TablePagination
          dataSource={dataSource}
          columns={columns}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          onSizeChanger={handleChange}
          onSort={onSort}
          totalData={data_customerOneTime?.page?.totalElements}
          tableScrolled={{
            x: 1500,
            y: 300,
          }}
          expandable={{
            expandedRowRender,
          }}
        />
      </div>

      {/* Modal Detail */}
      <ModalDetailAccountOnetime
        isOpen={modalDetail}
        handleCancel={() => setModalDetail(false)}
        data={data_detailCustomerOnetime}
        dataTable={[]}
      />
    </div>
  );
};

export default CustomerIdentificationForm;
