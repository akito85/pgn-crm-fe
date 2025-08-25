import React, { useState, useRef, useEffect } from "react";
import BaseContainer from "../../../../../components/BaseContainer";
import { Input, Tooltip } from "antd";
import Highlighter from "react-highlight-words";
import { FilterOutlined, EyeOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../assets/Icon/index";
import { useDispatch } from "react-redux";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TablePagination from "../../../../../components/TablePagination";
import ModalAttachment from "../../../../../components/Modal/ModalAttachment";

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

const columnAttachment = (
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleDelete = () => {},
  type
) => {
  const res = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "CATEGORY",
      dataIndex: "categoryName",
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
      title: "FILE NAME",
      dataIndex: "fileName",
      ...getColumnSearchProps(
        "fileName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "UPLOAD BY",
      dataIndex: "uploadBy",
      ...getColumnSearchProps(
        "uploadBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "UPLOAD DATE",
      dataIndex: "uploadDate",
      ...getColumnSearchProps(
        "uploadDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "FILE SIZE",
      dataIndex: "fileSize",
      ...getColumnSearchProps(
        "fileSize",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "ACTIONS",
      align: "center",
      width: 120,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex justify-center align-middle gap-2">
            <Tooltip title="Preview">
              <span className="flex justify-center">
                <EyeOutlined style={{ fontSize: "24px", color: "#0075bf" }} />
              </span>
            </Tooltip>
            {type !== "detail" ? (
              <Tooltip title="Delete">
                <span
                  className={`flex justify-center${
                    r.type === "exist" ? " cursor-not-allowed" : ""
                  }`}
                >
                  <SVGIcon
                    name="IconDelete"
                    width={24}
                    className={r.type === "exist" ? "disabled" : undefined}
                    onClick={
                      r.type !== "exist" ? () => handleDelete(r) : undefined
                    }
                  />
                </span>
              </Tooltip>
            ) : null}
          </div>
        );
      },
      key: "action",
    },
  ];
  return type !== "detail"
    ? res.filter(
        (column) =>
          column.dataIndex !== "uploadBy" && column.dataIndex !== "uploadDate"
      )
    : res;
};

const AttachmentPromo = (props) => {
  const { data = [], updateData = () => {}, type } = props;

  // Selector

  // Declaration
  const searchInput = useRef(null);
  const dispatch = useDispatch();

  // State
  const [modalUpload, setModalUpload] = useState(false);
  const [currentLog, setCurrentLog] = useState(1);
  const [sizeLog, setSizeLog] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  // Use Effect

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleChangeAttachment = (currentLog, sizeLog) => {
    setCurrentLog(currentLog);
    setSizeLog(sizeLog);
  };

  const updatePaginationAttachment = (page, pageSize) => {
    return data?.slice((page - 1) * pageSize, page * pageSize);
  };

  const handleDelete = (record) => {
    updateData((prevState) => {
      const temp = prevState.filter((detail) => detail.key !== record.key);
      return temp;
    });
  };

  return (
    <BaseContainer header={"Attachment Information"}>
      <div className="flex flex-col w-full gap-2">
        <p className="text-[13px] mb-0 text-dg-grey-dark">Attach File:</p>
        <div className="flex flex-row gap-2 items-center">
          <ButtonComponent
            fontSizeClassname="text-[11px]"
            size="small"
            type="default"
            onClick={() => setModalUpload(true)}
          >
            Choose File
          </ButtonComponent>
          <p className="text-[11px] text-dg-grey-dark mb-0">No file choosen</p>
        </div>

        <div className="pt-[30px]">
          <TablePagination
            dataSource={updatePaginationAttachment(currentLog, sizeLog)}
            totalData={data?.length}
            current={currentLog}
            pageSize={sizeLog}
            onChange={handleChangeAttachment}
            onSizeChanger={handleChangeAttachment}
            columns={columnAttachment(
              searchInput,
              searchedColumn,
              searchText,
              handleSearch,
              handleDelete,
              type
            )}
          />
        </div>
      </div>

      <ModalAttachment
        openUpload={modalUpload}
        updateData={updateData}
        categoryOptions={[]}
        handleCancel={() => setModalUpload(false)}
        withLink
      />
    </BaseContainer>
  );
};

export default AttachmentPromo;
