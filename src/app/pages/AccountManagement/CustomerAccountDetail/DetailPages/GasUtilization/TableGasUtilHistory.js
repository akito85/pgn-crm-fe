import React,{ useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import { PlusOutlined, WarningOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'

import DetailGasUtilHistory from './DetailGasUtilHistory'
import { getColumnSearchPropsUseFilteredValue } from '../../../../../../utils/getColumnSearchProps'
import SVGIcon from "../../../../../../assets/Icon/index";
import ButtonComponent from '../../../../../../components/ButtonComponent'
import { ACCOUNT_MANAGEMENT_ROUTES } from '../../../../../../routes/account_management/customer_account_routes'
import { deleteGasUtilization, getDetailGasUtilization, getListGasUtilizationHistory } from '../../../../../../redux/slices/account_management/detailAccount/gasUtilizationSlice'
import { hasValue, renderColumn, renderDateColumn } from '../../../../../../utils'
import TablePagination from '../../../../../../components/TablePagination'
import { ModalConfirm } from '../../../../../../components/Modal/ModalPopUp'
import { useColumnActionPermissionAccount } from '../../../ComponentAccount/ColumnActionPermissionAccount'
import ToolbarAccount from '../../../ComponentAccount/ToolbarAccount'

const columns = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleDetail,
  handleOpenDelete,
  idCustomer,
  idAccount
) => { 
  return [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "EFFECTIVE DATE",
      dataIndex: "effectiveDate",
      width: 220,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "effectiveDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) => renderDateColumn('effectiveDate', hasValue(search['effectiveDate']), searchText, text, 'date', search)
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      // width: 150,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => renderColumn('description', hasValue(search['description']), searchText, text, true, 'input', search)
    },
  ]
}


const TableGasUtilHistory = ({idAccount, idCustomer, access}) => {
  const dispatch = useDispatch();
  const { data, loading, data_detail } = useSelector(
    (state) =>  state.accountGasUtilization
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [modalDetail, setModalDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [idSelected, setIdSelected] = useState('');

  useEffect(() => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(
      getListGasUtilizationHistory({
        id:idAccount, search: reqSearch, sort, page, pageSize
      })
    );
  }, [search, page, pageSize, sort, dispatch]);

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

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };


  const handleDetail = async (r) => { 
    dispatch(getDetailGasUtilization({id:r?.id}));
    setModalDetail(true)
    setDataDetail(r)
    // dispatch()
  }

  const handleOpenDelete = (r) => {
    setOpenModalDelete(true)
    setIdSelected(r)
  }

  const handleConfirmModalDelete = () => {
    setOpenModalDelete(false);
    dispatch(deleteGasUtilization({ id: idSelected }))
    .unwrap()
    .then((data) => {
      const reqSearch = encodeURIComponent(JSON.stringify(search));
      dispatch(
        getListGasUtilizationHistory({
          id:idAccount, search: reqSearch, sort, page, pageSize
        })
      );
    })  
    .catch((err) => {
      console.log(err)
      return;
    });
  };

  const itemActions = [
    //action toolbar
    {
      action: 'Create',
      render: (
        <NavLink
          to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_GAS_UTILIZATION}
          state={{
            accountId: idAccount,
            customerId: idCustomer,
          }}
        >
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Create
          </ButtonComponent>
        </NavLink>
      )
    },

    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title="Detail">
            <div className="pt-1">
              <SVGIcon
                name="IconDetail"
                color={"#0075bf"}
                width={24}
                onClick={() => {
                  handleDetail(record);
                }}
              />
            </div>
          </Tooltip>
        )
      }
    },
    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title="Update">
            <Link
              to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_GAS_UTILIZATION}
              state={{
                id: record?.id,
                accountId: idAccount,
                customerId: idCustomer
              }}
              >
              <div
                className={`flex justify-center pt-1`}
              > 
                <SVGIcon
                  name="IconEdit"
                  width={24}
                />
              </div>
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
  return (
    <>
      <div className="text-primary text-xs font-bold uppercase py-4">GAS UTILIZATION HISTORY LIST</div>
      <div className="flex w-full justify-end gap-3 mb-5">
        <ToolbarAccount items={itemActions} advancedAccess={access}/>
      </div>
      <TablePagination
        dataSource={data?.result}
        totalData={data?.page?.totalElements}
        current={page}
        pageSize={pageSize}
        tableScrolled={{ y: 525, x: 1100 }}
        onChange={handleChange}
        onSort={onSort}
        onSizeChanger={handleChange}
        columns={[
          ...columns(
            search,
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            handleDetail,
            handleOpenDelete,
            idCustomer,
            idAccount
          ), 
          ...useColumnActionPermissionAccount(
            ["View", "Update", "Hapus"],
            itemActions,
            access
          )
        ]}
      />

      {/* Modal Detail */}
      <DetailGasUtilHistory isOpen={modalDetail} setIsOpen={setModalDetail} dataDetail={data_detail} />

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
            Are you sure want to delete gas utilization ?
          </p>
        </div>
        {/* <Alert
          message="Warning! your data will deleted permanently"
          type={"error"}
        /> */}
      </ModalConfirm>
    </>
  )
}

export default TableGasUtilHistory