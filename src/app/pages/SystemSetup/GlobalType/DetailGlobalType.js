import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getDetailGlobalTypeValue,
  getViewDetailGlobalType,
} from "../../../../redux/slices/system_setup/globalTypes";
import { Spin, Tooltip } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import BaseContainer from "../../../../components/BaseContainer";
import DetailText from "../../../../components/DetailText";
import moment from "moment";
import { dateFormatting, hasValue, renderColumn, renderDateConverter, toTitleCase } from "../../../../utils";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import { LeftOutlined } from "@ant-design/icons";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../components/Card/CardComponent";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import { getColumnSearchProps } from "../../../../utils/getColumnSearchProps";
import TablePaginationNew from "../../../../components/TablePaginationNew";

const DetailGlobalType = () => {
  // Selector
  const { data_detail, data_detail_value, loading } = useSelector(
    (state) => state.globalTypes
  );
  const { bodyError } = useSelector(state => state?.general)
  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const id = useLocation().state.id;
  const searchInput = useRef(null);

  // State
  const [currentTable, setCurrentTable] = useState(1);
  const [pageTable, setPageTable] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [body, setBody] = useState({});

  // Use Effect
  useEffect(() => {
    dispatch(getViewDetailGlobalType(id));
  }, [id]);

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setCurrentTable(1);
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
      path: SYSTEM_SETUP_ROUTES.VIEW_GLOBAL_TYPE,
      breadcrumbName: "Global Type",
    },
    {
      path: SYSTEM_SETUP_ROUTES.DETAIL_GLOBAL_TYPE,
      breadcrumbName: "Detail Global Type",
    },
  ];

  const handleDetail = async (id) => {
    try {
      setBody(id)
      await dispatch(getDetailGlobalTypeValue(id))?.unwrap();
      setOpenModal(true);
    } catch {
      setOpenModal(false);
    }
  }

  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) =>
        (currentTable - 1) * pageTable + index + 1,
    },
    {
      title: "DISPLAY TEXT",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name?.localeCompare(b.name),
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchProps(
        "name",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('name', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "VALUE",
      dataIndex: "glbValue",
      key: "glbValue",
      sorter: (a, b) => a.glbValue?.localeCompare(b.glbValue),
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchProps(
        "glbValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('glbValue', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "ORDER",
      dataIndex: "glbOrder",
      align: "right",
      key: "glbOrder",
      width: 150,
      sorter: (a, b) => (a?.glbOrder || 0) - (b?.glbOrder || 0),
      ...getColumnSearchProps(
        "glbOrder",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('glbOrder', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "PARENT GROUP",
      dataIndex: "parentGroupName",
      key: "parentGroupName",
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) =>
        a.parentGroupName?.localeCompare(b.parentGroupName) || 0,
      ...getColumnSearchProps(
        "parentGroupName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('parentGroupName', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "PARENT VALUE",
      dataIndex: "parentValueName",
      key: "parentValueName",
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) =>
        a.parentValueName?.localeCompare(b.parentValueName) || 0,
      ...getColumnSearchProps(
        "parentName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('parentValueName', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description?.localeCompare(b.description),
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchProps(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('description', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      fixed: "right",
      width: 120,
      sorter: (a, b) => a.status?.localeCompare(b.status),
      ...getColumnSearchProps(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'status'
      ),
      render: (text) => renderColumn('status', searchedColumn, searchText, text, false, 'status', search)
    },
    {
      title: "ACTION",
      dataIndex: "glbTypeValId",
      fixed: "right",
      align: "center",
      width: 120,
      render: (id) => {
        return (
          <Tooltip title="Detail">
            <span
              className="flex justify-center"
              onClick={() => handleDetail(id)}
            >
              <SVGIcon name="IconDetail" width={24} />
            </span>
          </Tooltip>
        );
      },
    },
  ];

  // Function Table
  const paginationTable = (typeData = "data") => {
    let result = [...(data_detail?.data?.vwRGlobaltypeValue || [])];
    if (searchedColumn) {
      const fixSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        return item[searchedColumn]?.toLowerCase().includes(fixSearchText);
      });
    }
    const fix = result.slice(
      (currentTable - 1) * pageTable,
      currentTable * pageTable
    );
    return typeData === "data" ? fix : result.length;
  };

  // Pagination
  const handlePagination = (pageChange, pageSizeChange) => {
    const tempPage = pageTable !== pageSizeChange ? 1 : pageChange;
    setCurrentTable(tempPage);
    setPageTable(pageSizeChange);
  };

  const handleRetry = () => {
    try {
      handleCancelTryAgain()
      if (bodyError?.action === 'GET_DETAIL_GLOBAL_TYPE_VALUE') {
        dispatch(getDetailGlobalTypeValue(body))
      }
      dispatch(getDetailGlobalTypeValue(id));
    } catch (error) {
      dispatch(getDetailGlobalTypeValue(id));
    }
  }

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry)
  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <BaseContainer header={"global type information"}>
          <div className="w-full grid grid-cols-4">
            <DetailText label="Group Name">
              {data_detail?.data?.groupName}
            </DetailText>
            <DetailText label="Sort By">{data_detail?.data?.sortBy}</DetailText>
            {/* <DetailText label="Status">{data_detail?.data?.status}</DetailText> */}
            <DetailText label="Description">
              {data_detail?.data?.desc}
            </DetailText>
          </div>
        </BaseContainer>

        <BaseContainer header={"history log information"}>
          <div className="w-full grid grid-cols-5">
            <DetailText label="Record Id">
              {data_detail?.data?.glbTypeId}
            </DetailText>
            <DetailText label="Created Date">
              {hasValue(data_detail?.data?.createdDate) && renderDateConverter(data_detail?.data?.createdDate, 'datetime')}
            </DetailText>
            <DetailText label={"Created By"}>
              {data_detail?.data?.createdBy}
            </DetailText>
            <DetailText label={"Updated Date"}>
              {hasValue(data_detail?.data?.updatedDate) && renderDateConverter(data_detail?.data?.updatedDate, 'datetime')}
            </DetailText>
            <DetailText label={"Updated By"}>
              {data_detail?.data?.updatedBy}
            </DetailText>
          </div>
        </BaseContainer>

        <BaseContainer header={"global type value information"}>
          <div className="w-full">
            <TablePaginationNew
              type="FE"
              // loading={loading}
              dataSource={data_detail?.data?.vwRGlobaltypeValue}
              // totalData={paginationTable("length")}
              current={currentTable}
              pageSize={pageTable}
              onChange={handlePagination}
              onSizeChanger={handlePagination}
              columns={columns}
              tableScrolled={{ x: 1700, y: 525 }}
            />
          </div>
        </BaseContainer>

        <div className="mt-[30px]">
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

        <ModalCustom
          isOpen={openModal}
          handleCancel={() => setOpenModal(false)}
          type="detail"
          header="Detail Global Type Value"
          width={1000}
          footer={
            <ButtonComponent
              border={true}
              onClick={() => setOpenModal(false)}
            >
              Back
            </ButtonComponent>
          }
        >
          <Spin spinning={loading}>
            <CardComponent header={"GLOBAL TYPE VALUE INFORMATION"} cols={4}>
              <DetailText label="Display Text">{data_detail_value?.name}</DetailText>
              <DetailText label="Value">{data_detail_value?.glbValue}</DetailText>
              <DetailText label="Order">{data_detail_value?.glbOrder}</DetailText>
              <DetailText label="Description">
                {data_detail_value?.description}
              </DetailText>
              <DetailText label="Parent Group">
                {data_detail_value?.parentGroup}
              </DetailText>
              <DetailText label="Parent Value">
                {data_detail_value?.parentValue}
              </DetailText>
              <DetailText label="Status">{toTitleCase(data_detail_value?.status)}</DetailText>
            </CardComponent>

            <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
              <DetailText label="Record Id">
                {data_detail_value?.glbTypeValId}
              </DetailText>
              <DetailText label="Created Date">
                {data_detail_value?.createdDate
                  ? moment(data_detail_value.createdDate).format(
                    dateFormatting.dateTime
                  )
                  : ""}
              </DetailText>
              <DetailText label="Created By">
                {data_detail_value?.createdBy}
              </DetailText>
              <DetailText label="Updated Date">
                {data_detail_value?.updatedDate
                  ? moment(data_detail_value.updatedDate).format(
                    dateFormatting.dateTime
                  )
                  : ""}
              </DetailText>
              <DetailText label="Updated By">
                {data_detail_value?.updatedBy}
              </DetailText>
            </CardComponent>
          </Spin>
        </ModalCustom>
      </Spin>

      {renderModal()}
    </LayoutMenu>
  );
};

export default DetailGlobalType;
