import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tooltip } from "antd";
import { NavLink, Link } from "react-router-dom";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";

// Routes
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../routes/DebtAndCollection/rc_routes";

// Global Custom Components
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import TableRBI from "../../../../components/TableRBI";
import CardContainer from "../../../../components/CardContainer";
import Toolbar from "../../../../components/Toolbar";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";

// Column Configuration
import { getWriteOffColumns } from "./WriteOffColumns";

// Redux
import { getWriteOffList, downloadWriteOffList } from "../../../../redux/slices/debt_and_collection/writeOff";

const ViewWriteOff = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.writeOff);
  const searchInput = useRef(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});

  const routes = [
    {
      path: "",
      breadcrumbName: "Bad Debt & Collection",
    },
    {
      path: DEBT_AND_COLLECTION_ROUTES.VIEW_WRITE_OFF,
      breadcrumbName: "Write Off",
    },
  ];

  useEffect(() => {
    dispatch(getWriteOffList({ page, pageSize, search: encodeURIComponent(JSON.stringify(search)) }));
  }, [dispatch, page, pageSize, search]);

  const handleChangePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleDownload = () => {
    dispatch(downloadWriteOffList({ page, pageSize, search: encodeURIComponent(JSON.stringify(search)) }));
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
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

  const itemActions = [
    {
      action: "Create",
      render: (
        <NavLink to={DEBT_AND_COLLECTION_ROUTES.CREATE_WRITE_OFF}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create Write Off
          </ButtonComponent>
        </NavLink>
      ),
    },

    // column action
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Tooltip title={"Detail"}>
            <Link
              // Ensure this route exists or use a placeholder if DETAIL_WRITE_OFF is not yet defined
              to={`${DEBT_AND_COLLECTION_ROUTES.DETAIL_WRITE_OFF}`}
              state={{ id: record?.id }}
            >
              <EyeOutlined />
            </Link>
          </Tooltip>
        );
      },
    },
    {
      action: "Delete",
      type: "table",
      render: (record) => {
        return (
          <Tooltip title={"Delete"}>
            <div onClick={() => console.log('Delete', record)} style={{ cursor: 'pointer' }}>
              <SVGIcon name="IconDelete" width={24} />
            </div>
          </Tooltip>
        );
      },
    }
  ];

  const actionCols = useColumnActionPermission(
    ["view", "delete"],
    itemActions
  );

  const baseColumns = useMemo(() => {
    return getWriteOffColumns({
      page,
      pageSize,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    });
  }, [
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
    search,
  ]);

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <CardContainer header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold">WRITE OFF LIST</p>
            <div className="flex gap-2">
              <Toolbar items={itemActions} />
            </div>
          </div>
        }>
          <TableRBI
            columns={[...baseColumns, ...actionCols]}
            dataSource={data?.result?.map((item, index) => ({ ...item, key: index })) || []}
            showExport={true}
            handleDownload={handleDownload}
            current={page}
            pageSize={pageSize}
            onChange={handleChangePage}
            onSizeChanger={handleChangePage}
            totalData={data?.page?.totalElements || 0}
            tableScrolled={{ x: 2000 }}
          />
        </CardContainer>
      </Spin>
    </LayoutMenu>
  );
};

export default ViewWriteOff;
