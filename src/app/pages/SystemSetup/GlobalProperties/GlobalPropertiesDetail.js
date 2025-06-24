import React, { useEffect, useState } from "react";
import { Spin, Input } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import {
  getGlobalPropertiesDetail,

} from "../../../../redux/slices/system_setup/globalProperties";
import BaseContainer from "../../../../components/BaseContainer";
import DetailText from "../../../../components/DetailText";
import { dateFormat, hasValue, renderColumn, toTitleCase } from "../../../../utils";
import moment from "moment";
import TablePagination from "../../../../components/TablePagination";
import StatusComponent from "../../../../components/StatusComponent";
import ButtonComponent from "../../../../components/ButtonComponent";
import { FilterOutlined, LeftOutlined } from "@ant-design/icons";
import { useRef } from "react";
import Highlighter from "react-highlight-words";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks.js";
import { getColumnSearchProps } from "../../../../utils/getColumnSearchProps.js";
import TablePaginationNew from "../../../../components/TablePaginationNew.js";
import { sorterFunction } from "../../../../utils/sorterFunction.js";


const GlobalPropertiesDetail = () => {
  // Selector
  const { data_detail, loading } = useSelector(
    (state) => state.globalProperties
  );
  const { bodyError } = useSelector((state) => state?.general);

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const id = useLocation().state.id;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  // Use Effect
  useEffect(() => {
    dispatch(getGlobalPropertiesDetail(id));
  }, [id, dispatch]);


  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
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
  };


  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_GLOBAL_PROPERTIES,
      breadcrumbName: "Global Properties",
    },
    {
      path: SYSTEM_SETUP_ROUTES.DETAIL_GLOBAL_PROPERTIES,
      breadcrumbName: "Detail Global Properties",
    },
  ];

  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "KEY",
      dataIndex: "gpdKey",
      sorter: (a, b) => sorterFunction('gpdKey', a, b),
      ...getColumnSearchProps(
        "gpdKey",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('gpdKey', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "VALUE",
      dataIndex: "gpdVal",
      align: "left",
      sorter: (a, b) => sorterFunction('gpdVal', a,b),
      ...getColumnSearchProps(
        "gpdVal",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text, record) => {
        if (record?.isEncrypt === true) {
          return renderColumn('gpdVal', searchedColumn, searchText, "*"?.repeat(text?.length), false, 'input', search)
        } else {
          return renderColumn('gpdVal', searchedColumn, searchText, text, false, 'input', search)
        }
      },
    },
    {
      title: "DATA TYPE",
      dataIndex: "dataTypeName",
      align: "left",
      width: 220,
      sorter: (a, b) => sorterFunction('dataTypeName', a, b),
      ...getColumnSearchProps(
        "dataTypeName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('dataTypeName', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "STATUS",
      dataIndex: "status",
      width: 120,
      fixed: "right",
      sorter: (a, b) => sorterFunction('status', a, b),
      ...getColumnSearchProps(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'status'
      ),
      render: (text) => renderColumn('status', searchedColumn, searchText, toTitleCase(text), false, 'status', search)
    },
  ];

  // Pagination
  const handlePagination = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };


  // handle Retry
  const handleRetry = () => {
    handleCancelTryAgain()
    dispatch(getGlobalPropertiesDetail(id));
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry)

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <BaseContainer header={"global properties information"}>
          <div className="w-full grid grid-cols-3">
            <DetailText label={"Properties Name"}>
              {data_detail?.name}
            </DetailText>
            <DetailText label={"Type"}>{data_detail?.gpType}</DetailText>
            <DetailText label={"Status"}>{toTitleCase(data_detail?.status)}</DetailText>
          </div>
          <DetailText label={"Description"}>{data_detail?.desc}</DetailText>
        </BaseContainer>

        <BaseContainer header={"HISTORY LOG INFORMATION"}>
          <div className="grid grid-cols-5 w-full">
            <DetailText label={"Record Id"}>
              {data_detail?.gpId}
            </DetailText>
            <DetailText label={"Created Date"}>
              {data_detail?.createdDate
                ? moment(data_detail.createdDate).format(dateFormat)
                : ""}
            </DetailText>
            <DetailText label={"Created By"}>
              {data_detail?.createdBy}
            </DetailText>
            <DetailText label={"Updated Date"}>
              {data_detail?.updatedDate
                ? moment(data_detail.updatedDate).format(dateFormat)
                : ""}
            </DetailText>
            <DetailText label={"Updated By"}>
              {data_detail?.updatedBy}
            </DetailText>
          </div>
        </BaseContainer>

        <BaseContainer header={"properties item information"}>
          <div className="w-full">
            <TablePaginationNew
              type="FE"
              loading={loading}
              dataSource={data_detail?.vwRGlobalPropertiesDtls}
              // totalData={paginationTable("length")}
              current={page}
              pageSize={pageSize}
              onChange={handlePagination}
              onSizeChanger={handlePagination}
              columns={columns}
              tableScrolled={{
                x: 1000,
                y: 300,
              }}
            />
          </div>
        </BaseContainer>

        <div className="my-5">
          <ButtonComponent
            type={"submit"}
            onClick={() => navigate(-1)}
            icon={
              <LeftOutlined
                style={{
                  color: "#fff",
                  fontSize: 24,
                  justifyItems: "center",
                }}
              />
            }
          >
            Back
          </ButtonComponent>
        </div>
      </Spin>
      {renderModal()}
    </LayoutMenu>
  );
};

export default GlobalPropertiesDetail;
