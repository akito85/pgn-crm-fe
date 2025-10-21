import React from "react";
import BaseContainer from "../../../../components/BaseContainer";
import TablePagination from "../../../../components/TablePagination";
import { useState } from "react";
import TableInline from "../../../../components/Table/TableInline";
import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllAuthType,
  getAllEmployees,
  getAllGroupAccess,
  getAllUserLevel,
  getAllUserType,
} from "../../../../redux/slices/user_management/user";
import StatusComponent from "../../../../components/StatusComponent";
import { useRef } from "react";
import { FilterOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { dateFormatting } from "../../../../utils";
import { DatePicker, Input, Select, Tooltip } from "antd";
import DynamicTableInline from "../../../../components/Table/DynamicTableInline";

const ListUserFromUpload = ({ data, onChangeData = () => {} }) => {
  const dispatch = useDispatch();
  const {
    data_user_level,
    data_group_access,
    data_user_type,
    data_auth_type,
    data_employee,
  } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  useEffect(() => {
    dispatch(getAllEmployees());
    dispatch(getAllUserLevel());
    dispatch(getAllUserType());
    dispatch(getAllAuthType());
  }, [dispatch]);
  console.log(data, " data");
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch(
      selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`,
    );
  };

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
              ? moment([searchText]).format(dateFormatting.date)
              : [searchText]
          }
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const dataEmployee = data_employee?.data?.map((item) => {
    return {
      value: item?.id,
      label: item?.name,
    };
  });
  const dataUserLevel = data_user_level?.data?.map((item) => {
    return {
      value: item.value,
      label: item.name,
    };
  });
  const dataGroupAccess = data_group_access?.data?.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
  const dataAuthType = data_auth_type?.data?.map((item) => {
    return {
      value: item.value,
      label: item.name,
    };
  });
  const dataUserType = data_user_type?.data?.map((item) => {
    return {
      value: item.value,
      label: item.type,
    };
  });

  const handleClicked = async (e) => {
    await dispatch(getAllGroupAccess(e)).unwrap();
  };

  const column = [
    {
      title: "NO",
      align: "center",
      dataIndex: "no",
      width: 60,
      editable: true,
      render: (text, object, index) => {
        return (page - 1) * pageSize + index + 1;
      },
    },
    {
      title: "USERNAME",
      dataIndex: "userName",
      align: "left",
      editable: true,
      sorter: true,
      ...getColumnSearchProps("userName"),
    },
    {
      title: "USER TYPE",
      dataIndex: "userTypeId",
      align: "left",
      inputType: "select",
      options: dataUserType,
      editable: true,
      sorter: true,
      ...getColumnSearchProps("userTypeId"),
      render: (userType) => {
        let renderValue;
        if (typeof userType === "number") {
          renderValue =
            data_user_type &&
            data_user_type?.data
              .filter((a) => a.id === userType)
              .find((b) => b.type)?.type;
        } else {
          renderValue = userType;
        }
        return <span>{renderValue}</span>;
      },
    },
    {
      title: "EMPLOYEE",
      dataIndex: "employee",
      align: "left",
      inputType: "select",
      options: dataEmployee,
      editable: true,
      sorter: true,
      ...getColumnSearchProps("employee"),
      render: (employee) => (
        <span>
          <span>
            {data_employee &&
              data_employee?.data
                .filter((a) => a.id === employee)
                .find((b) => b.name)?.name}
          </span>
        </span>
      ),
    },
    {
      title: "USER LEVEL",
      dataIndex: "userLevelId",
      align: "left",
      inputType: "select",
      options: dataUserLevel,
      editable: true,
      sorter: true,
      onClick: (e) => handleClicked(e),
      ...getColumnSearchProps("userLevelId"),
      render: (userLevel) => (
        <span>
          <span>
            {data_user_level &&
              data_user_level?.data
                .filter((a) => a.value === userLevel)
                .find((b) => b.name)?.name}
          </span>
        </span>
      ),
    },
    {
      title: "AUTH TYPE",
      dataIndex: "authTypeId",
      align: "left",
      inputType: "select",
      options: dataAuthType,
      editable: true,
      sorter: true,
      ...getColumnSearchProps("authTypeId"),
      render: (authType) => {
        return (
          <span>
            <span>
              {data_auth_type &&
                data_auth_type?.data
                  .filter((a) => a?.value === authType)
                  .find((b) => b?.name)?.name}
            </span>
          </span>
        );
      },
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      align: "left",
      editable: true,
      sorter: true,
      inputType: "date",
      ...getColumnSearchProps("startDate", "date"),
      render: (endDate) => moment(endDate).format("YYYY-MM-DD"),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      align: "left",
      editable: true,
      sorter: true,
      inputType: "date",
      ...getColumnSearchProps("endDate", "date"),
      render: (endDate) => moment(endDate).format("YYYY-MM-DD"),
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      align: "left",
      editable: true,
      sorter: true,
      ...getColumnSearchProps("email"),
    },
    {
      title: "PHONE NUMBER",
      dataIndex: "phone",
      align: "left",
      editable: true,
      inputType: "number",
      sorter: true,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "GROUP ACCESS",
      dataIndex: "groupAccess",
      inputType: "select",
      options: dataGroupAccess,
      align: "left",
      editable: true,
      sorter: true,
      ...getColumnSearchProps("groupAccess"),
      render: (groupAccess) => {
        let renderValue;
        if (typeof groupAccess === "number") {
          renderValue =
            data_group_access &&
            data_group_access?.data
              .filter((a) => a.id === groupAccess)
              .find((b) => b.name)?.name;
        } else {
          renderValue = groupAccess;
        }
        return <Select disabled defaultValue={renderValue} />;
      },
    },
    {
      title: "START DATE GA",
      dataIndex: "startDateGa",
      align: "left",
      editable: true,
      inputType: "date",
      sorter: true,
      ...getColumnSearchProps("startDateGa", "date"),
      render: (endDate) => moment(endDate).format("YYYY-MM-DD"),
    },
    {
      title: "END DATE GA",
      dataIndex: "endDateGa",
      align: "left",
      editable: true,
      inputType: "date",
      sorter: true,
      ...getColumnSearchProps("endDateGa", "date"),
      render: (endDate) => moment(endDate).format("YYYY-MM-DD"),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      align: "left",
      render: (text, record) => {
        console.log(record, " lala");
        return (
          <Tooltip
            title={record?.message?.join(", ").replace(/,/g, ",\n")}
            placement="topLeft"
          >
            <div className={" flex justify-center"}>
              <StatusComponent colour={text}>{text}</StatusComponent>
            </div>
          </Tooltip>
        );
      },
    },
  ];
  const handleChangePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  return (
    <BaseContainer header={"EMPLOYEE ASSIGNMENT"}>
      <DynamicTableInline
        // header={"EMPLOYEE ASSIGNMENT"}
        tableData={data}
        onDataChange={onChangeData}
        cols={column}
        mode={"update"}
        showCreateButton={false}
        scrollTable={{ x: 3000, y: 500 }}
        usePagination={true}
        useSelect={true}
        totalData={data?.length}
        pageSize={pageSize}
        current={page}
        onChangePage={handleChangePage}
        onSizeChanger={handleChangePage}
        actionButton={["update", "delete"]}
        useContainer={false}
      />
    </BaseContainer>
  );
};

export default ListUserFromUpload;
