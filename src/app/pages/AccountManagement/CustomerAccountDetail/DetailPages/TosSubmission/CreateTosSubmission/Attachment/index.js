import React, { useState, useRef, useEffect } from "react";
import moment from "moment";

import { useDispatch, useSelector } from "react-redux";
import { Input, Tooltip } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

import { bytesConverter } from "../../../../../../../../utils/bytesConverter";
import { previewFileAttachment } from "../../../../../../../../utils/previewFileAttachment";
import BaseContainer from "../../../../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../../../../components/ButtonComponent";
import ModalAttachment from "./ModalAttachment";
import TablePagination from "../../../../../../../../components/TablePagination";
import { getSelectCategory } from "../../../../../../../../redux/slices/product_promo/PricingRule/PricingRuleSlice";

const getColumnSearchProps = (
  dataIndex,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  excludeRender = false,
  onFilter = (value, record) =>
    record[dataIndex]?.toString()?.toLowerCase()?.includes(value.toLowerCase()),
) => {
  let obj = {
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
    onFilter: onFilter,
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
        text || ""
      ),
  };
  if (excludeRender) {
    delete obj.render;
  }
  return obj;
};

const columnAttachment = (
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleDelete = () => {},
  previewFileAttachment = () => {},
  previewFile = () => {},
  type,
) => {
  const res = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
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
        handleSearch,
      ),
    },
    {
      sorter: true,
      title: "FILE NAME",
      dataIndex: "fileName",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchProps(
        "fileName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (filename) => (
        <Tooltip placement="topLeft" title={filename}>
          {filename}
        </Tooltip>
      ),
    },
    {
      sorter: true,
      title: "UPLOAD BY",
      dataIndex: "uploadBy",
      ...getColumnSearchProps(
        "uploadBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      sorter: true,
      title: "UPLOADED DATE",
      dataIndex: "uploadDate",
      ...getColumnSearchProps(
        "uploadDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      sorter: true,
      title: "FILE SIZE",
      align: "center",
      dataIndex: "fileSize",
      ...getColumnSearchProps(
        "fileSize",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (fileSize, r, i) => (
        <span>{r?.type === "new" ? fileSize : bytesConverter(fileSize)}</span>
      ),
    },
    // {
    //   title: "ACTION",
    //   align: "center",
    //   width: 120,
    //   fixed: "right",
    //   render: (v, r, i) => {
    //     return (
    //       <div className="flex w-full justify-center gap-6">
    //         <Tooltip title="Preview">
    //           <EyeOutlined
    //             onClick={
    //               r.type !== "exist"
    //                 ? () => previewFileAttachment(r.base64)
    //                 : () => previewFile(r.urlFile1)
    //             }
    //             style={{ fontSize: "24px", color: "#0075bf" }}
    //           />
    //         </Tooltip>

    //         <Tooltip title="Delete">
    //           <SVGIcon
    //             name="IconDelete"
    //             width={24}
    //             className={
    //               r.type === "exist" ? "disabled cursor-not-allowed" : undefined
    //             }
    //             onClick={r.type !== "exist" ? () => handleDelete(r) : undefined}
    //           />
    //         </Tooltip>
    //       </div>
    //     );
    //   },
    //   key: "action",
    // },
  ];
  return type !== "detail"
    ? res.filter(
        (column) =>
          column.dataIndex !== "uploadBy" && column.dataIndex !== "uploadDate",
      )
    : res;
};

const Attachment = ({ data = [], updateData = () => {}, type }) => {
  // Declaration
  const searchInput = useRef(null);
  const dispatch = useDispatch();

  // State
  const [modalUpload, setModalUpload] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");

  // Selector
  const { data_category } = useSelector((state) => state.pricingRule);

  // Use Effect
  useEffect(() => {
    dispatch(getSelectCategory());
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
  };

  const handleChangeAttachment = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // const handleDelete = (record) => {
  //   updateData((prevState) => {
  //     const temp = prevState.filter((detail) => detail.key !== record.key);
  //     return temp;
  //   });
  // };

  const filterDataByPage = () => {
    let result = [...data];
    if (searchedColumn) {
      result = result.filter((item) => {
        return item[searchedColumn]?.includes(searchText);
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

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  const previewFile = (urlFile) => {
    window.open("http://" + urlFile);
  };

  return (
    <BaseContainer header={"Attachment Information"}>
      <div className="flex flex-col w-full gap-2">
        {type !== "detail" ? (
          <div>
            <p className="text-[13px] mb-0 text-dg-grey-dark">Attach File:*</p>
            <div className="flex flex-row gap-2 items-center">
              <ButtonComponent
                fontSizeClassname="text-[11px]"
                size="small"
                type="default"
                onClick={() => setModalUpload(true)}
              >
                Choose File
              </ButtonComponent>
              <p className="text-[11px] text-dg-grey-dark mb-0">
                No file choosen
              </p>
            </div>
          </div>
        ) : null}

        <div className="pt-[30px]">
          <TablePagination
            dataSource={filterDataByPage()}
            totalData={data?.length}
            current={page}
            pageSize={pageSize}
            onChange={handleChangeAttachment}
            onSizeChanger={handleChangeAttachment}
            columns={columnAttachment(
              searchInput,
              searchedColumn,
              searchText,
              handleSearch,
              // handleDelete,
              previewFileAttachment,
              previewFile,
              type,
            )}
            onSort={onSort}
          />
        </div>
      </div>

      <ModalAttachment
        openUpload={modalUpload}
        updateData={updateData}
        categoryOptions={data_category}
        handleCancel={() => setModalUpload(false)}
        withLink
      />
    </BaseContainer>
  );
};

export default Attachment;
