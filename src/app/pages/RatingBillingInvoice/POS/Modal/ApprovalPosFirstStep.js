import React from "react";
import PosApprovalTable from "../Table/PosApprovalTable";
import { Form } from "antd";
import InputComponent from "../../../../../components/InputComponent";
import { useState } from "react";
import { useRef } from "react";
import DetailText from "../../../../../components/DetailText";
import { requiredMessage } from "../../../../../utils";

const ApprovalPosFirstStep = ({
  dataTable = [],
  rowSelection,
  type = false,
  remark,
  setRemark = () => {},
}) => {
  const searchInput = useRef(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [search, setSearch] = useState({});

  //filter data by page
  // const filterDataByPage = (typeData = "data") => {
  //   let result = [...dataTable];
  //   if (searchedColumn) {
  //     const fixSearchText = searchText.toLowerCase();
  //     result = result.filter((item) => {
  //       return item[searchedColumn]?.toLowerCase().includes(fixSearchText);
  //     });
  //   }
  //   const handleDataSort = (obj) => {
  //     return obj[fieldSort]?.toLowerCase();
  //   };
  //   if (fieldSort) {
  //     result.sort((a, b) => {
  //       let fa = handleDataSort(a);
  //       let fb = handleDataSort(b);
  //       if (fa < fb) {
  //         return sort === "asc" ? -1 : 1;
  //       }
  //       if (fa > fb) {
  //         return sort === "asc" ? 1 : -1;
  //       }
  //       return 0;
  //     });
  //   }
  //   const fix = result.slice((page - 1) * pageSize, page * pageSize);
  //   return typeData === "data" ? fix : result.length;
  // };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(dataIndex);
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

  // Handle Change Page
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // Sort Table
  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setSort("");
    }
  };

  return (
    <div className="w-full grid grid-cols-1 gap-x-4 pt-[30px]">
      <p className="text-primary uppercase font-bold">Point Of Sales List</p>
      <PosApprovalTable
        data={dataTable}
        handleChange={handleChange}
        totalElement={dataTable?.length}
        page={page}
        pageSize={pageSize}
        searchInput={searchInput}
        searchedColumn={searchedColumn}
        searchText={searchText}
        handleSearch={handleSearch}
        search={search}
        rowSelection={rowSelection || undefined}
      />

      <div className="pt-[30px]">
        {type ? (
          <DetailText label="Remark">{remark}</DetailText>
        ) : (
          <Form.Item
            label={"Remark"}
            name={"remark"}
            rules={[
              {
                required: true,
                message: requiredMessage("Remark"),
              },
            ]}
          >
            <InputComponent
              rows={1}
              type="textarea"
              placeholder={"Type your remark"}
              onChange={(e) => setRemark(e.target.value)}
            />
          </Form.Item>
        )}
      </div>
    </div>
  );
};

export default ApprovalPosFirstStep;
