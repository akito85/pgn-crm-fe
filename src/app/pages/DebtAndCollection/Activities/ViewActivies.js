import  { useEffect, useRef, useState } from "react";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { Spin,  Tooltip } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { Link, NavLink } from "react-router-dom";
import SVGIcon from "../../../../assets/Icon/index";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllAccountPaginate,getAllActivityByAccountNumePaginate
} from "../../../../redux/slices/debt_and_collection/activities";
import BaseContainer from "../../../../components/BaseContainer";
import TablePayment from "../../../../components/TablePayment";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../routes/DebtAndCollection/rc_routes";
import { columnsAccount } from "./ColumnAccount";
import { columnsActivities } from "./ColumnActivities";
import { ModalConfirm } from '../../../../components/Modal/ModalPopUp';
import { WarningOutlined } from '@ant-design/icons'
import RadioTabs from "../../../../components/RadioTabs";
import TablePaginationNew from "../../../../components/TablePaginationNew";

// Breadcrumbs
const routes = [
  {
    path: "",
    breadcrumbName: "Debt & Collection",
  },
  {
    path: DEBT_AND_COLLECTION_ROUTES.VIEW_ACTIVITIES,
    breadcrumbName: "Activities",
  },
];


const ViewActivityAction = () => {
  const dispatch = useDispatch();
  // const fullState = useSelector((state) => state);
  // console.log("🌐 Full Redux State:", fullState);

  const {
    dataAccount,
    dataActivities,
    loading = false
  } = useSelector((state) => state.activities);



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
  const [selectedAccountNum, setSelectedAccountNum] = useState(null);
  const [tabHeader, setTabHeader] = useState("Activity Information");

  // table activities
  const [dataTableActivies, setDataTableActivites] = useState([]);
  const [totalElementsActivities, setTotalElementActivities] = useState(0);
  const [pageActivities, setPageActivities] = useState(1);
  const [pageSizeActivities, setPageSizeActivities] = useState(10);
  const [searchedColumnActivities, setSearchedColumnActivities] = useState("");
  const [searchTextActivities, setSearchTextActivities] = useState("");
  const [searchActivities, setSearchActivities] = useState({});
  const [sortActivities, setSortActivities] = useState("");



  const handleOpenDelete = (r) => {
    setOpenModalDelete(true)
    setIdSelected(r)
  }

  const handleConfirmModalDelete = () => {
    setOpenModalDelete(false);
    // dispatch(deleteActivityAction({ id: idSelected }))
    // .unwrap()
    // .then((data) => {
    //   dispatch(
    //     getAllAccountPaginate({
    //       page,
    //       pageSize,
    //       search: encodeURIComponent(JSON.stringify(search)),
    //       sort,
    //     })
    //   );
    // })  
    // .catch((err) => {
    //   console.log(err)
    //   return;
    // });
  };

  const itemsActionView = () => [
    {
      action: "Create",
      render: (
        <NavLink
          to={DEBT_AND_COLLECTION_ROUTES.CREATE_ACTIVITIES}
          state={{ prevPage: "table-activites", accountNum: selectedAccountNum}}
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
              to={DEBT_AND_COLLECTION_ROUTES.DETAIL_ACTIVITIES}
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
                to={DEBT_AND_COLLECTION_ROUTES.UPDATE_ACTIVITIES}
                state={{ id: record?.id , accountNum: selectedAccountNum }}
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
      {
        action: "Download",
        type: "table",
        render: (record, data) => {
          return (
            <Tooltip title="Download Evidence">
              <div className="pt-1">
                <SVGIcon
                  name="IconDownload"
                  width={24}
                  onClick={() => handleDownload(record?.id)}
                />
              </div>
            </Tooltip>
          )
        }
      },
  ];

  const itemsActionViewAccount = () => [
    //table
    //last placement for outside popover
    {
      action: "view",
      type: "table",
      render: (record, data_length) => {
        return (
          <Tooltip title="Detail">
            <Link
              to={DEBT_AND_COLLECTION_ROUTES.DETAIL_ACTIVITIES}
              state={{ id: record?.mpMActivityResultOptId }}
            >
              <SVGIcon name="IconDetail" width={24} />
            </Link>
          </Tooltip>
        );
      },
    },
  ];

  const handleDownload = (id) => {
    console.log("Download clicked for ID:", id);
    // Implement download logic here
  }

  useEffect(() => {
    dispatch(
      getAllAccountPaginate({
        page,
        pageSize,
        search: encodeURIComponent(JSON.stringify(search)),
        sort,
      })
    );
  }, [dispatch, page, pageSize, search, sort]);

  useEffect(() => {
    if (dataAccount) {
      let result = dataAccount?.result || [];
      const totalData = dataAccount?.page?.totalElements || 0;
      setDataTable(result);
      console.log("dataAccount result", result);
      // setDataTable(dataAccount);
      setTotalElement(totalData);
    }
  }, [dataAccount]);

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

  const handleClickAccountRow = (record) => {
    console.log("Parent Row Clicked:", record);
    setSelectedAccountNum(record.accountNum); 
    dispatch(
      getAllActivityByAccountNumePaginate({
        accountNum: record.accountNum,
        page: pageActivities,
        pageSize: pageSizeActivities,
        search: encodeURIComponent(JSON.stringify(searchActivities)),
        sort: sortActivities,
      })
    );
  };

  useEffect(() => {
    if (dataActivities) {
      let result = dataActivities?.result || [];
      const totalData = dataActivities?.page?.totalElements || 0;
      setDataTableActivites(result);
      console.log("dataActivities result", result);
      // setDataTable(dataAccount);
      setTotalElementActivities(totalData);
    }
  }, [dataActivities]);

  const handleSearchActivities = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextActivities(selectedKeys[0]);
    setSearchedColumnActivities(dataIndex);
    setSearchActivities((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPageActivities(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };
  const handleChangeSizeActivities = (pageChange, pageSizeChange) => {
    const tempPage = pageSizeActivities !== pageSizeChange ? 1 : pageChange;
    setPageActivities(tempPage);
    setPageSizeActivities(pageSizeChange);
  };

  // data tabs
  const tabs = [
    { value: "Activity Information" },
    { value: "Upload Activities" },
  ];

  // onchange tabs
  const changeTab = (e) => {
    setTabHeader((prevState) => {
      const tempTab = e.target.value;
      if (prevState !== tempTab) {
        setPage(1);
        setPageSize(10);
        setSearch({});
        setSort("");
        setSearchText("");
        setSearchedColumn("");
      }
      return tempTab;
    });
  };

  const permissionsAccount = useColumnActionPermission(
                [],
                itemsActionViewAccount(
                  dataUser,
                )
              )

  const permissions = useColumnActionPermission(
                ["view", "Update", "Hapus", "Download"],
                itemsActionView(
                  dataUser,
                )
              )

  

  
  

  

  return (
    <LayoutMenu>
      <Spin
        spinning={loading || false}
        className={"w-full top-20"}
        tip={"Loading..."}
      >
        <BreadCrumb routes={routes} />
        <div className="flex flex-col w-full">
          <BaseContainer header={"Account"}>
            <TablePayment
              dataSource={dataTable}
              totalData={totalElements}
              current={page}
              pageSize={pageSize}
              tableScrolled={{ y: 525, x: 2300 }}
              onChange={handleChangeSize}
              onSort={onSort}
              columns={[...columnsAccount(
                search,
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                handleOpenDelete,
                dataUser
              ),...permissionsAccount]}
              useFixColumn={true}
              defaultFixedColumns={{
                no: "left",
                action: "right",
              }}
              onRowClicked={(row) => handleClickAccountRow(row)}
            />

            {selectedAccountNum && (
              <div className="mt-6 border rounded-lg p-4 bg-white shadow-sm">

                <RadioTabs
                  data={tabs}
                  onChange={changeTab}
                  currentPosition={tabHeader}
                />
                <div className="my-5">

                {/* Tab Content */}
                {tabHeader === "Activity Information" && (
                  
                  <>
                    <Toolbar
                      items={itemsActionView(
                        dataUser,
                      )}
                    />
                    <div className="my-3">
                      <TablePaginationNew
                        dataSource={dataTableActivies}
                        totalData={totalElementsActivities}
                        current={pageActivities}
                        pageSize={pageSizeActivities}
                        tableScrolled={{ y: 525, x: 2300 }}
                        onChange={handleChangeSizeActivities}
                        onSort={onSort}
                        columns={[...columnsActivities(
                          search,
                          pageActivities,
                          pageSizeActivities,
                          searchInput,
                          searchedColumnActivities,
                          searchTextActivities,
                          handleSearchActivities,
                          handleOpenDelete,
                          dataUser
                        ), ...permissions]}
                        useFixColumn={true}
                        defaultFixedColumns={{
                          no: "left",
                          action: "right",
                        }}
                      />
                    </div>
                  </>
                )}

                {tabHeader === "Upload Activities" && (
                  <div className="p-4 border rounded bg-gray-50">
                    <p className="mb-2">Upload Document</p>
                    <input type="file" />
                  </div>
                )}
                </div>

              </div>
            )}

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
    </LayoutMenu>
  );
};

export default ViewActivityAction;
