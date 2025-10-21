import React, { useEffect, useRef } from "react";
import { PlusOutlined, FilterOutlined } from "@ant-design/icons";
import { Spin, DatePicker, Input } from "antd";
import { useState } from "react";
import { Fragment } from "react";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import moment from "moment";
import AssignChooseAssetTable from "./AssignChooseAssetTable";
import { useSelector } from "react-redux";
import { getChooseAsset } from "../../../../../../../redux/slices/account_management/detailAccount/ServicePoint";
import Highlighter from "react-highlight-words";
import { dateFormatting } from "../../../../../../../utils";

const AssignChoosePage = ({
  handleChooseAsset = () => {},
  handleCreateAsset = () => {},
  dispatch = () => {},
}) => {
  const { data_choose_asset, loading } = useSelector(
    (state) => state.servicePoint,
  );
  //declare
  const searchInput = useRef(null);

  //state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [dataTabel, setDataTabel] = useState([]);

  //useEffect
  useEffect(() => {
    dispatch(
      getChooseAsset({
        page,
        pageSize,
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
      }),
    );
  }, [dispatch, page, pageSize, sort, search]);

  useEffect(() => {
    if (data_choose_asset && data_choose_asset?.result?.length > 0) {
      setTotalElement(data_choose_asset?.page?.totalElements);
      setDataTabel(
        data_choose_asset?.result?.map((item, index) => {
          return {
            ...item,
            id: item.id,
            assetNameValue: item?.assetName?.name,
            assetName: item?.assetName?.id,
            serialNumber: item?.serialNumber,
            typeValue: item?.type?.name,
            type: item?.type?.id,
            serviceType: item?.serviceType?.id,
            serviceTypeValue: item?.serviceType?.name,
            brand: item?.brand?.id,
            brandValue: item?.brand?.name,
            year: item?.year,
            custodyTransfer: item?.custodyTransfer,
            description: item?.description,
            settingPressure: item?.settingPressure,
            ansi: item?.ansi?.value,
            ansiValue: item?.ansi?.name,
            productName: item?.productName?.id ? item?.productName?.id : 0,
            productNameValue: item?.productName?.name
              ? item?.productName?.name
              : "",
            gsize: item?.gsize?.value,
            gsizeValue: item?.gsize?.name,
          };
        }),
      );
    }
  }, [data_choose_asset?.result]);

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
    // onFilter: (value, record) =>
    //   record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
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
    // if (dataIndex !== "custodyTransfer") {
    setSearchText(selectedKeys[0]);
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
    // } else {
    //   const tempSearchedText = "YES".includes(selectedKeys[0] || "")
    //     ? "Y"
    //     : "N";
    //   setSearchText(selectedKeys[0]);
    //   setSearchedColumn(dataIndex);
    //   // setSearch(
    //   //   selectedKeys.length === 0 ? "" : `${dataIndex}~${tempSearchedText}`
    //   // );
    //   setSearch((prevState) => {
    //     if (prevState[dataIndex] !== selectedKeys[0]) {
    //       setPage(1);
    //     }
    //     return {
    //       ...prevState,
    //       [dataIndex]: tempSearchedText,
    //     };
    //   });
    // }
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  return (
    <Spin spinning={loading}>
      <Fragment>
        <div>
          <div className={"w-full flex justify-end mb-5"}>
            <ButtonComponent
              onClick={() => {
                handleCreateAsset(true);
              }}
              type={"submit"}
              border={false}
              icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            >
              Create
            </ButtonComponent>
          </div>
          <AssignChooseAssetTable
            handleSearch={handleSearch}
            searchInput={searchInput}
            search={search}
            data={dataTabel}
            handleChange={handleChange}
            handleChangeSize={handleChangeSize}
            totalElement={totalElement}
            page={page}
            pageSize={pageSize}
            onSort={onSort}
            searchText={searchText}
            searchedColumn={searchedColumn}
            getColumnSearchProps={getColumnSearchProps}
            handleChooseAsset={handleChooseAsset}
          />
        </div>
      </Fragment>
    </Spin>
  );
};

export default AssignChoosePage;
