import  { useEffect, useRef, useState } from "react";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { Spin } from "antd";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  getBridgePagging,downloadBridge
} from "../../../../../redux/slices/receipt_collection/bridge";
import BaseContainer from "../../../../../components/BaseContainer";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { columns } from "./Column";
import {
  DownloadOutlined,
} from "@ant-design/icons";

// Breadcrumbs
const routes = [
  {
    path: "",
    breadcrumbName: "Receipt & Collection",
  },
  {
    path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_BRIDGE,
    breadcrumbName: "Bridge",
  },
];


const ViewBridge = () => {
  const dispatch = useDispatch();
  const {
    dataBridge,
    loading = false
  } = useSelector((state) => state.bridge);
  const searchInput = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const { data: dataUser = {} } = useSelector((state) => state.profile);

  

  const handleDownload = () => {
      dispatch(
        downloadBridge({
          page,
          pageSize,
          search: encodeURIComponent(JSON.stringify(search)),
          sort,
        })
      );
    };
  

  const itemsActionView = () => [
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
  ];

  useEffect(() => {
    dispatch(
      getBridgePagging({
        page,
        pageSize,
        search: encodeURIComponent(JSON.stringify(search)),
        sort,
      })
    );
  }, [dispatch, page, pageSize, search, sort]);

  useEffect(() => {
    if (dataBridge) {
      let result = dataBridge?.result || [];
      const totalData = dataBridge?.page?.totalElements || 0;
      setDataTable(result);
      setTotalElement(totalData);
    }
  }, [dataBridge]);

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
  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };
  
  
  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  

  
  

  
  return (
    <LayoutMenu>
      <Spin
        spinning={loading || false}
        className={"w-full top-20"}
        tip={"Loading..."}
      >
        <BreadCrumb routes={routes} />
        <div className="flex flex-col w-full">
          <Toolbar
            items={itemsActionView(
              dataUser,
            )}
          />
          <BaseContainer header={"Bridge List"}>
            <TablePaginationNew
              dataSource={dataTable}
              totalData={totalElements}
              current={page}
              pageSize={pageSize}
              tableScrolled={{ y: 525, x: 2300 }}
              onChange={handleChangeSize}
              onSort={onSort}
              columns={[...columns(
                search,
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                dataUser
              ), ...useColumnActionPermission(
                ["view"],
                itemsActionView(
                  dataUser,
                )
              )]}
              useFixColumn={true}
              defaultFixedColumns={{
                no: "left",
              }}
            />
          </BaseContainer>
        </div>
        
      </Spin>
    </LayoutMenu>
  );
};

export default ViewBridge;
