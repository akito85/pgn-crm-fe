import React, { useRef, useState } from "react";
import DetailText from "../../../../components/DetailText";
import TablePagination from "../../../../components/TablePagination";
import { Input, Tooltip } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import StatusComponent from "../../../../components/StatusComponent";
import { toTitleCase } from "../../../../utils";

const ConfirmationLayout = (props) => {
  const { data, type, onCancel = () => {}, dataParentAndGroup } = props;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [search, setSearch] = useState("");

  const paginationTable = (typeData = "data") => {
    let result = [...(data?.globalTypeValue || [])];
    if (searchedColumn) {
      const fixSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        if (searchedColumn === "parentGroup") {
          const data = item[searchedColumn] || 0;
          const aGroupName = dataParentAndGroup
            ?.filter((item) => item?.glbTypeId === data)
            .map((name) => name?.groupName)
            .shift();
          return (aGroupName || "").toLowerCase().includes(fixSearchText);
        }
        if (searchedColumn === "parentValue") {
          const data = item[searchedColumn] || 0;
          const matchingEntryA = dataParentAndGroup?.find((entry) =>
            entry.parentValue.some((item) => item.glbTypeValId === data)
          );
          const textA =
            matchingEntryA?.parentValue.find(
              (item) => item.glbTypeValId === data
            ).text || "";
          return (textA || "").toLowerCase().includes(fixSearchText);
        }
        if (searchedColumn === "order") {
          return item[searchedColumn]
            ?.toString()
            .toLowerCase()
            .includes(fixSearchText);
        }
        return item[searchedColumn]?.toLowerCase().includes(fixSearchText);
      });
    }
    const fix = result.slice((page - 1) * pageSize, page * pageSize);
    return typeData === "data" ? fix : result.length;
  };

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // handle search
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

  // get search props
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
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
          onPressEnter={() => {
            handleSearch(selectedKeys, confirm, dataIndex);
          }}
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
  const columns = [
    {
      title: "NO",
      align: "center",
      width: 90,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "DISPLAY TEXT",
      dataIndex: "displayText",
      key: "displayText",

      sorter: (a, b) => a.displayText?.localeCompare(b.displayText),
      ...getColumnSearchProps("displayText"),
    },
    {
      title: "VALUE",
      dataIndex: "value",
      key: "value",
      width: 100,
      sorter: (a, b) => a.value?.localeCompare(b.value),
      ...getColumnSearchProps("value"),
    },
    {
      title: "ORDER",
      dataIndex: "order",
      align: "right",
      key: "order",
      width: 100,
      sorter: (a, b) => a.order - b.order,
      ...getColumnSearchProps("order"),
    },
    {
      title: "PARENT GROUP",
      dataIndex: "parentGroup",
      key: "parentGroup",
      sorter: (a, b) => {
        const aGroupName = dataParentAndGroup
          ?.filter((item) => item?.glbTypeId === a?.groupName)
          .map((name) => name?.groupName)
          .shift();
        const bGroupName = dataParentAndGroup
          ?.filter((item) => item?.glbTypeId === b?.groupName)
          .map((name) => name?.groupName)
          .shift();
        return aGroupName?.localeCompare(bGroupName);
      },
      ...getColumnSearchProps("parentGroup"),
      render: (text) => {
        const groupName = dataParentAndGroup
          ?.filter((item) => item?.glbTypeId === text)
          .map((name) => name?.groupName)
          .shift();
        return <span>{groupName}</span>;
      },
    },
    {
      title: "PARENT VALUE",
      dataIndex: "parentValue",
      key: "parentValue",
      sorter: (a, b) => {
        const matchingEntryA = dataParentAndGroup?.find((entry) =>
          entry.parentValue.some((item) => item.glbTypeValId === a?.parentValue)
        );
        const textA =
          matchingEntryA?.parentValue.find(
            (item) => item.glbTypeValId === a?.parentValue
          ).text || "";
        const matchingEntryB = dataParentAndGroup?.find((entry) =>
          entry.parentValue.some((item) => item.glbTypeValId === b?.parentValue)
        );
        const textB =
          matchingEntryB?.parentValue.find(
            (item) => item.glbTypeValId === b?.parentValue
          ).text || "";
        return textA.localeCompare(textB);
      },
      ...getColumnSearchProps("parentValue"),
      render: (parentValue) => {
        const matchingEntry = dataParentAndGroup?.find((entry) =>
          entry.parentValue.some((item) => item.glbTypeValId === parentValue)
        );
        const text = matchingEntry?.parentValue.find(
          (item) => item.glbTypeValId === parentValue
        ).text;
        return <span>{text}</span>;
      },
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      width: 270,
      sorter: (a, b) => a.description?.localeCompare(b.description),
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchProps("description"),
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text ? text : ""}
        </Tooltip>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      fixed: 'right',
      ...getColumnSearchProps("status"),
      render: (text) => (
        <div className={" flex justify-center"}>
          <StatusComponent colour={text}>{toTitleCase(text)}</StatusComponent>
        </div>
      ),
    },
  ];
  return (
    <div>
      <div>
        <span className="text-primary uppercase font-bold">
          global type information
        </span>
      </div>
      <div className="w-full grid grid-cols-3">
        <DetailText label="Group Name">{data.groupName}</DetailText>
        <DetailText label="Sort BY">{data.sortBy}</DetailText>
        <DetailText label="Description">{data.desc}</DetailText>
      </div>

      <div className="pt-[30px]">
        <span className="text-primary uppercase font-bold">
          global type value information
        </span>
      </div>
      <TablePagination
        columns={columns.filter((item) => {
          return item?.dataIndex !== "key";
        })}
        pageSize={pageSize}
        current={page}
        dataSource={paginationTable("data")}
        totalData={paginationTable("length")}
        onChange={handleChangePage}
        tableScrolled={{ y: 500, x: 1300 }}
      />
    </div>
  );
};

export default ConfirmationLayout;
