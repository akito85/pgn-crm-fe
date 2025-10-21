import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tooltip } from "antd";
import { Link, NavLink } from "react-router-dom";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import { getEceletricBankPaging } from "../../../../../redux/slices/receipt_collection/electrionicBank";
// import { getColumnSearchProps } from "../../../../../utils/getColumnSearchPropsPaging";
import { getDownloadBankStatement } from "../../../../../redux/slices/receipt_collection/bankSlice";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import Toolbar from "../../../../../components/Toolbar";

const ViewMaintainElectronicBankStatement = () => {
  // Selector
  const { data, loading } = useSelector((state) => state.electronic);
  const { bodyError } = useSelector((state) => state?.general);
  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  // // Function Search Column
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

  const columnsStatement = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "BANK NAME",
      dataIndex: "bankName",
      align: "left",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "bankName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
      ),
      render: (text) =>
        renderColumn(
          "bankName",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "BANK ACCOUNT NUMBER",
      dataIndex: "bankAccountNumber",
      align: "left",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "bankAccountNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
      ),
      render: (text) =>
        renderColumn(
          "bankAccountNumber",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "COLLECTING AGENT",
      dataIndex: "collectingAgent",
      align: "left",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "collectingAgent",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
      ),
      render: (text) =>
        renderColumn(
          "collectingAgent",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "TYPE",
      dataIndex: "paymentType",
      align: "center",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "paymentType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
      ),
      render: (text) =>
        renderColumn(
          "paymentType",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "BANK STATEMENT DATE",
      dataIndex: "bankStatementDate",
      align: "center",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "bankStatementDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
      ),
      render: (v) =>
        renderDateColumn(
          "bankStatementDate",
          searchedColumn,
          searchText,
          v,
          "date",
          search,
        ),
    },
    {
      title: "UPLOAD DATE",
      dataIndex: "uploadDate",
      align: "center",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "uploadDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "datetime",
      ),
      render: (text) =>
        renderDateColumn(
          "uploadDate",
          hasValue(search["uploadDate"]),
          searchText,
          text,
          "datetime",
          search,
        ),
    },
    {
      title: "FILENAME",
      dataIndex: "filename",
      align: "left",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "filename",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
      ),
      render: (text) =>
        renderColumn(
          "filename",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "TOTAL TRANSACTION",
      dataIndex: "totalTransaction",
      align: "center",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "totalTransaction",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
      ),
      render: (text) =>
        renderColumn(
          "totalTransaction",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "TOTAL MATCH",
      dataIndex: "totalMatch",
      align: "center",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "totalMatch",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
      ),
      render: (text) =>
        renderColumn(
          "totalMatch",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "TOTAL FORCE",
      dataIndex: "totalForce",
      align: "center",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "totalForce",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        renderColumn(
          "totalForce",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "TOTAL REVERSE",
      dataIndex: "totalReverse",
      align: "center",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "totalReverse",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "totalReverse",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "TOTAL SUNDRY",
      dataIndex: "totalSundry",
      align: "center",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "totalSundry",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "totalSundry",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "CURRENCY",
      dataIndex: "currency",
      align: "center",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "currency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        renderColumn(
          "currency",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "totalAmount",
      align: "right",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "totalAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "totalAmount",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },

    {
      title: "ERROR MESSAGE",
      dataIndex: "errorMessage",
      align: "left",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "errorMessage",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        renderColumn(
          "errorMessage",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "STATUS",
      dataIndex: "statusBankStatement",
      key: "statusBankStatement",
      width: 150,
      sorter: true,
      fixed: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "statusBankStatement",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
      ),
      render: (text) =>
        renderColumn(
          "status",
          searchedColumn,
          searchText,
          text,
          false,
          "status",
        ),
    },
  ];

  //dispatch
  const handleFetch = useCallback(() => {
    dispatch(
      getEceletricBankPaging({
        page,
        pageSize,
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
      }),
    );
  }, [dispatch, page, pageSize, search, sort]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: "",
      breadcrumbName: "Receipt Reconciliation",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_MAINTAIN_ELECTRONIC_BANK_STATEMENT,
      breadcrumbName: "Maintain Electronic Bank Statement",
    },
  ];

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

  const handleDownload = () => {
    dispatch(
      getDownloadBankStatement({
        search: encodeURIComponent(JSON.stringify(search)),
        // search: tempSearch,
        page: page,
        pageSize: pageSize,
        sort: sort,
      }),
    );
  };

  const itemActions = [
    // toolbar items
    {
      action: "Download",
      render: (
        <ButtonComponent
          onClick={handleDownload}
          type={"submit"}
          border={false}
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Upload",
      render: (
        <NavLink
          to={
            RECEIPT_AND_COLLECTION_ROUTES.UPLOAD_MAINTAIN_ELECTRONIC_BANK_STATEMENT
          }
        >
          <ButtonComponent
            icon={<UploadOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Upload
          </ButtonComponent>
        </NavLink>
      ),
    },
    // column action
    {
      action: "View",
      type: "table",
      render: (record, data_length) => {
        return (
          <Tooltip title={"Detail"}>
            <Link
              to={
                RECEIPT_AND_COLLECTION_ROUTES.DETAIL_MAINTAIN_ELECTRONIC_BANK_STATEMENT
              }
              state={{ id: record?.id }}
            >
              <SVGIcon name="IconDetail" width={24} />
            </Link>
          </Tooltip>
        );
      },
    },
  ];

  // handle retry modal error
  // handle retry modal error
  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "MAINTAIN_ELECTRONIC_BANK_STATMENT") {
        handleDownload();
        handleFetch();
      }
    } catch (error) {
      handleFetch();
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <Toolbar items={itemActions} />
        {/* <div className="w-full flex justify-end gap-[20px]">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonDownload" width={24} />}
            type="submit"
            onClick={() => {
              let tempSearch = "";
              for (const dataIndex in search) {
                if (Object.hasOwnProperty.call(search, dataIndex)) {
                  const tempSearchText = search[dataIndex];
                  if (tempSearchText) {
                    tempSearch += `${dataIndex}~${tempSearchText},`;
                  }
                }
              }
              tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
              dispatch(
                getDownloadBankStatement({
                  search: tempSearch,
                  page,
                  pageSize,
                  sort,
                })
              );
            }}
          >
            Download
          </ButtonComponent>
          <NavLink
            to={
              RECEIPT_AND_COLLECTION_ROUTES.UPLOAD_MAINTAIN_ELECTRONIC_BANK_STATEMENT
            }
          >
            <ButtonComponent
              icon={<UploadOutlined style={{ fontSize: "24px" }} />}
              type="submit"
            >
              Upload
            </ButtonComponent>
          </NavLink>
        </div> */}

        <BaseContainer header={"BANK STATEMENT LIST"}>
          <TablePaginationNew
            dataSource={data?.result}
            columns={[
              ...columnsStatement,
              ...useColumnActionPermission(["view"], itemActions),
            ]}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            onSizeChanger={handleChange}
            totalData={data?.page?.totalElements || 0}
            onSort={onSort}
            tableScrolled={{
              x: 3700,
              y: 525,
            }}
          />
        </BaseContainer>
      </Spin>
      {renderModal}
    </LayoutMenu>
  );
};

export default ViewMaintainElectronicBankStatement;
