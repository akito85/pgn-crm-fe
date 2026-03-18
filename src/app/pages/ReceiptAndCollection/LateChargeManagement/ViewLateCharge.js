import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tooltip } from "antd";
import { NavLink, Link } from "react-router-dom";
import { EyeOutlined, PlusCircleOutlined } from "@ant-design/icons";

// Routes
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";

// Global Custom Components
import BreadCrumb from "../../../../components/BreadCrumb";
import TableRBI from "../../../../components/TableRBI";
import CardContainer from "../../../../components/CardContainer";
import Toolbar from "../../../../components/Toolbar";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";

// Column Configuration
import { getLateChargeColumns } from "./LateChargeColumns";

// Redux
import {
  getPagingLateCharge,
  downloadLateCharge,
} from "../../../../redux/slices/receipt_collection/lateCharge";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";

const ViewLateCharge = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.late);
  const searchInput = useRef(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");

  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_LATE_CHARGE,
      breadcrumbName: "Late Charge",
    },
  ];

  useEffect(() => {
    dispatch(
      getPagingLateCharge({
        page,
        pageSize,
        search: encodeURIComponent(JSON.stringify(search)),
        sort,
      })
    );
  }, [dispatch, page, pageSize, search, sort]);

  const handleChangePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleDownload = () => {
    dispatch(
      downloadLateCharge({
        page,
        pageSize,
        search: encodeURIComponent(JSON.stringify(search)),
        sort,
      })
    );
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

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const baseColumns = useMemo(() => {
    return getLateChargeColumns(
      page,
      pageSize,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    );
  }, [page, pageSize, searchInput, searchedColumn, searchText, search]);

  const itemActions = [
    {
      action: "Create",
      render: (
        <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_LATE_CHARGE || "#"}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create Late Charge
          </ButtonComponent>
        </NavLink>
      ),
    },
    {
      action: "View",
      type: "table",
      render: (record) => (
        <Tooltip title="Detail">
          <Link
            to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_LATE_CHARGE}
            state={{ id: record?.id }}
          >
            <EyeOutlined style={{ fontSize: "24px" }} />
          </Link>
        </Tooltip>
      ),
    },
    {
      action: "Recalculate",
      type: "table",
      render: (record, data_length) => (
        data_length > 3 ? (
          <Link
            to={RECEIPT_AND_COLLECTION_ROUTES.RECALCULATE_LATE_CHARGE}
            state={{ id: record?.id, record }}
            className="w-full flex justify-start gap-4"
          >
            <PlusCircleOutlined style={{ color: "#0075bf", fontSize: "18px" }} />
            <span className="text-black">Adjustment Recalculate</span>
          </Link>
        ) : (
          <Tooltip title="Adjustment Recalculate">
            <Link
              to={RECEIPT_AND_COLLECTION_ROUTES.RECALCULATE_LATE_CHARGE}
              state={{ id: record?.id, record }}
            >
              <PlusCircleOutlined style={{ color: "#ACC424", fontSize: "18px" }} />
            </Link>
          </Tooltip>
        )
      ),
    },
    {
      action: "Replace",
      type: "table",
      render: (record, data_length) => (
        data_length > 3 ? (
          <Link
            to={RECEIPT_AND_COLLECTION_ROUTES.REPLACE_LATE_CHARGE}
            state={{ id: record?.id, record }}
            className="w-full flex justify-start gap-4"
          >
            <PlusCircleOutlined style={{ color: "#0075bf", fontSize: "18px" }} />
            <span className="text-black">Adjustment Replace</span>
          </Link>
        ) : (
          <Tooltip title="Adjustment Replace">
            <Link
              to={RECEIPT_AND_COLLECTION_ROUTES.REPLACE_LATE_CHARGE}
              state={{ id: record?.id, record }}
            >
              <PlusCircleOutlined style={{ color: "#ACC424", fontSize: "18px" }} />
            </Link>
          </Tooltip>
        )
      ),
    },
    {
      action: "Reverse",
      type: "table",
      render: (record, data_length) => (
        data_length > 3 ? (
          <Link
            to={RECEIPT_AND_COLLECTION_ROUTES.REVERSE_LATE_CHARGE}
            state={{ id: record?.id, record }}
            className="w-full flex justify-start gap-4"
          >
            <PlusCircleOutlined style={{ color: "#0075bf", fontSize: "18px" }} />
            <span className="text-black">Adjustment Reverse</span>
          </Link>
        ) : (
          <Tooltip title="Adjustment Reverse">
            <Link
              to={RECEIPT_AND_COLLECTION_ROUTES.REVERSE_LATE_CHARGE}
              state={{ id: record?.id, record }}
            >
              <PlusCircleOutlined style={{ color: "#ACC424", fontSize: "18px" }} />
            </Link>
          </Tooltip>
        )
      ),
    },
  ];

  return (
    <div>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] font-bold">LATE CHARGE MONITORING LIST</p>
              <div className="flex gap-2">
                <Toolbar items={itemActions} />
              </div>
            </div>
          }
        >
          <TableRBI
            columns={[
              ...baseColumns,
              ...useColumnActionPermission(
                ["view", "recalculate", "replace", "reverse"],
                itemActions
              ),
            ]}
            dataSource={data?.result?.map((item, index) => ({ ...item, key: index })) || []}
            showExport={true}
            handleDownload={handleDownload}
            current={page}
            pageSize={pageSize}
            onChange={handleChangePage}
            onSizeChanger={handleChangePage}
            totalData={data?.page?.totalElements || 0}
            onSort={onSort}
            tableScrolled={{ x: 2500 }}
          />
        </CardContainer>
      </Spin>
    </div>
  );
};


export default ViewLateCharge;
