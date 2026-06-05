import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { WarningOutlined } from "@ant-design/icons";

import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import {
  getDataRequirementTemplatePaginate,
  deleteDataRequirementTemplate,
} from "../../../../redux/slices/system_setup/dataRequirementTemplate";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { nxGetAccountActions } from "../../../../components/Nx/NxGetAccountActions";
import NxBreadCrumb from "../../../../components/Nx/NxBreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../components/Nx/NxTable";
import NxModal from "../../../../components/Nx/NxModal";
import Toolbar from "../../../../components/Toolbar";
import { columnsDataRequirementTemplate } from "./Table/TableDataRequirementTemplate";

const DataRequirementTemplateView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchInput = useRef(null);

  const { data_list, data_pagination, loading } = useSelector(
    (state) => state.dataRequirementTemplate
  );

  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [modalDelete, setModalDelete] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const searchObject = useMemo(
    () =>
      Object.keys(search)
        .filter((key) => search[key])
        .reduce((obj, key) => {
          obj[key] = search[key];
          return obj;
        }, {}),
    [search]
  );

  const handleRefresh = useCallback(() => {
    dispatch(
      getDataRequirementTemplatePaginate({
        page: 1,
        size: 100,
        sort: sort ? [sort] : [],
        searchs: searchObject,
        isLoadMore: false,
      })
    );
    setPage(1);
  }, [dispatch, sort, searchObject]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = data_pagination?.totalPages || 0;
    if (nextPage <= totalPages) {
      await dispatch(
        getDataRequirementTemplatePaginate({
          page: nextPage,
          size: loadMoreSize,
          sort: sort ? [sort] : [],
          searchs: searchObject,
          isLoadMore: true,
        })
      ).unwrap();
      setPage(nextPage);
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) setPage(1);
      if (!selectedKeys[0]) {
        const newState = { ...prevState };
        delete newState[dataIndex];
        return newState;
      }
      return { ...prevState, [dataIndex]: selectedKeys[0] };
    });
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleDeleteConfirm = (record) => {
    setSelectedRecord(record);
    setModalDelete(true);
  };

  const handleDeleteCancel = () => {
    setSelectedRecord(null);
    setModalDelete(false);
  };

  const handleDeleteOk = () => {
    dispatch(deleteDataRequirementTemplate(selectedRecord.id))
      .unwrap()
      .then(() => {
        setModalDelete(false);
        setSelectedRecord(null);
        handleRefresh();
      })
      .catch(() => {
        setModalDelete(false);
        setSelectedRecord(null);
      });
  };

  const itemActions = nxGetAccountActions({
    handleCreate: () => navigate(SYSTEM_SETUP_ROUTES.CREATE_DATA_REQUIREMENT_TEMPLATE),
    handleView: (record) =>
      navigate(
        SYSTEM_SETUP_ROUTES.DETAIL_DATA_REQUIREMENT_TEMPLATE.replace(":id", record.id),
        { state: { id: record.id } }
      ),
    handleUpdate: (record) =>
      navigate(
        SYSTEM_SETUP_ROUTES.UPDATE_DATA_REQUIREMENT_TEMPLATE.replace(":id", record.id),
        { state: { id: record.id } }
      ),
    handleDelete: handleDeleteConfirm,
  }).filter((item) => item.action !== "Approve");

  const actionColumns = useColumnActionPermission(
    ["View", "Update", "Delete"],
    itemActions,
    "View",
    "page"
  ).map((col) => ({ ...col, width: 100, align: "center" }));

  const baseColumns = useMemo(
    () =>
      columnsDataRequirementTemplate({
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      }),
    [search, searchText, searchedColumn] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const columns = useMemo(
    () => [...baseColumns, ...actionColumns],
    [baseColumns, actionColumns]
  );

  const dataSource = useMemo(() => {
    if (!Array.isArray(data_list)) return [];
    return data_list.map((item, index) => ({
      ...item,
      key: item.id ?? index,
    }));
  }, [data_list]);

  const totalElements = data_pagination?.totalElements || 0;
  const hasMore = dataSource.length < totalElements;

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: "", breadcrumbName: "Data Requirement Template" },
  ];

  return (
    <>
      <NxBreadCrumb routes={routes} />
      <NxCardContainer header="DATA REQUIREMENT TEMPLATE LIST">
        <NxBaseContainer border>
          <Toolbar items={itemActions} />
          <NxTable
            idTable="data-requirement-template-table"
            dataSource={dataSource}
            columns={columns}
            totalData={totalElements}
            onSort={onSort}
            fixedColumns={{ left: [], right: ["action"] }}
            loading={loading}
            usePagination={false}
            useInfiniteScroll={true}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loadMoreThreshold={20}
            tableScrolled={{ x: "max-content", y: 525 }}
            onRefresh={handleRefresh}
            showRefresh={true}
          />
        </NxBaseContainer>
      </NxCardContainer>

      <NxModal
        isOpen={modalDelete}
        handleCancel={handleDeleteCancel}
        title="DELETE CONFIRMATION"
        width={500}
        footer={
          <div className="flex justify-end gap-2">
            <Button type="menu" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button type="reject" onClick={handleDeleteOk} loading={loading}>
              Delete
            </Button>
          </div>
        }
      >
        <div className="p-4">
          <NxBaseContainer border>
            <div className="flex items-start gap-3">
              <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} className="mt-1" />
              <div>
                <p className="font-semibold text-base">Are you sure want to delete it?</p>
                <p className="text-sm text-gray-500 mt-1">
                  Warning! If you delete this data, it will be permanently deleted.
                </p>
              </div>
            </div>
          </NxBaseContainer>
        </div>
      </NxModal>
    </>
  );
};

export default DataRequirementTemplateView;
