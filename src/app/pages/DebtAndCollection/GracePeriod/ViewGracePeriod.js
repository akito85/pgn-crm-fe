import  { useEffect, useRef, useState } from "react";
import { Spin,  Tooltip } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { Link, NavLink } from "react-router-dom";
import SVGIcon from "../../../../assets/Icon/index";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllGracePeriodPaginate,deleteGracePeriod
} from "../../../../redux/slices/debt_and_collection/gracePeriod";
import BaseContainer from "../../../../components/BaseContainer";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../routes/DebtAndCollection/rc_routes";
import { columns } from "./ColumnGracePeriodView";
import { ModalConfirm } from '../../../../components/Modal/ModalPopUp';
import { WarningOutlined } from '@ant-design/icons'

// Breadcrumbs
const routes = [
  {
    path: "",
    breadcrumbName: "Debt & Collection",
  },
  {
    path: DEBT_AND_COLLECTION_ROUTES.VIEW_GRACE_PERIOD,
    breadcrumbName: "Grace Period",
  },
];


const ViewGracePeriod = () => {
  const dispatch = useDispatch();
  const {
    dataGracePeriod,
    loading = false
  } = useSelector((state) => state.gracePeriod);
  const searchInput = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [bodyError, setBodyError] = useState({});
  const { data: dataUser = {} } = useSelector((state) => state.profile);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [idSelected, setIdSelected] = useState('');

  const handleOpenDelete = (r) => {
    setOpenModalDelete(true)
    setIdSelected(r)
  }

  const handleConfirmModalDelete = () => {
    setOpenModalDelete(false);
    dispatch(deleteGracePeriod({ id: idSelected }))
    .unwrap()
    .then((data) => {
      dispatch(
        getAllGracePeriodPaginate({
          page,
          pageSize,
          search: encodeURIComponent(JSON.stringify(search)),
          sort,
        })
      );
    })  
    .catch((err) => {
      console.log(err)
      return;
    });
  };

  const itemsActionView = () => [
    {
      action: "Create",
      render: (
        <NavLink
          to={DEBT_AND_COLLECTION_ROUTES.CREATE_GRACE_PERIOD}
          state={{ prevPage: "table-product" }}
        >
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create
          </ButtonComponent>
        </NavLink>
      ),
    },
    //table
    //last placement for outside popover
    {
      action: "view",
      type: "table",
      render: (record, data_length) => {
        return (
          <Tooltip title="Detail">
            <Link
              to={DEBT_AND_COLLECTION_ROUTES.DETAIL_GRACE_PERIOD}
              state={{ id: record?.id }}
            >
              <SVGIcon name="IconDetail" width={24} />
            </Link>
          </Tooltip>
        );
      },
    },
      {
        action: "Update",
        type: "table",
        render: (record, data) => {
          return (
            <Tooltip title="Update">
              <Link
                to={DEBT_AND_COLLECTION_ROUTES.UPDATE_GRACE_PERIOD}
                state={{ id: record?.id }}
              >
                <SVGIcon
                  name="IconEdit"
                  width={24}
                />
              </Link>
            </Tooltip>
          )
        }
      },
      {
        action: "Hapus",
        type: "table",
        render: (record, data) => {
          return (
            <Tooltip title="Delete">
              <div className="pt-1">
                <SVGIcon
                  name="IconDelete"
                  width={24}
                  onClick={() => handleOpenDelete(record?.id)}
                />
              </div>
            </Tooltip>
          )
        }
      },
  ];

  useEffect(() => {
    dispatch(
      getAllGracePeriodPaginate({
        page,
        pageSize,
        search: encodeURIComponent(JSON.stringify(search)),
        sort,
      })
    );
  }, [dispatch, page, pageSize, search, sort]);

  useEffect(() => {
    if (dataGracePeriod) {
      let result = dataGracePeriod?.result || [];
      const totalData = dataGracePeriod?.page?.totalElements || 0;
      setDataTable(result);
      setTotalElement(totalData);
    }
  }, [dataGracePeriod]);

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
    <>
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
          <BaseContainer header={"Grace Period List"}>
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
                handleOpenDelete,
                dataUser
              ), ...useColumnActionPermission(
                ["view", "Update", "Hapus"],
                itemsActionView(
                  dataUser,
                )
              )]}
              useFixColumn={true}
              defaultFixedColumns={{
                no: "left",
                action: "right",
              }}
            />
          </BaseContainer>
        </div>
        
      </Spin>

      {/* Modal Delete */}
      <ModalConfirm
        isOpen={openModalDelete}
        handleCancel={()=>{
          setIdSelected('')
          setOpenModalDelete(false)
        }}
        handleOk={handleConfirmModalDelete}
        width={500}
      >
        <div className="flex justify-center gap-[20px] mt-6">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className={"text-[18px] font-bold"}>
            Are you sure want to delete?
          </p>
        </div>
      </ModalConfirm>
    </>
  );
};

export default ViewGracePeriod;
