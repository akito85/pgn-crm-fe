import React, { useEffect, useState, useRef, useMemo } from "react";
import { Form, Spin, Tooltip } from "antd";
import { PlusOutlined, WarningOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import BaseContainer from "../../../../../../components/BaseContainer";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import DetailEquipment from "./DetailEquipment";
import EquipmentForm from "./Form/EquipmentForm";
import {
  getDetailEquipment,
  getListEqupment,
  createEqupment,
  deleteEquipment,
} from "../../../../../../redux/slices/account_management/detailAccount/equpmentSlice";
import { ModalConfirm } from "../../../../../../components/Modal/ModalPopUp";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";
import { useColumnActionPermissionAccount } from "../../../ComponentAccount/ColumnActionPermissionAccount";
import ToolbarAccount from "../../../ComponentAccount/ToolbarAccount";
import { useLocation } from "react-router-dom";
import NxTable from "../../../../../../components/Nx/NxTable";
import { nxApplyFixedColumns } from "../../../../../../utils/Nx/nxApplyFixedColumns";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../../../../../components/Nx/NxCardContainer";
import { nxGetAccountActions } from "../../../../../../components/Nx/NxGetAccountActions";

const columns = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
) => {
  return [
    {
      key: "no",
      title: "NO",
      align: "center",
      dataIndex: "no",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      key: "name",
      title: "NAME",
      dataIndex: "name",
      width: 200,
      sorter: true,
      filteredValue: [search?.name] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "name",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    },
    {
      key: "typeEquipment",
      title: "TYPE",
      dataIndex: "typeEquipment",
      width: 200,
      sorter: true,
      filteredValue: [search?.typeEquipment] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "typeEquipment",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    },
    {
      key: "brand",
      title: "BRAND",
      dataIndex: "brand",
      width: 200,
      sorter: true,
      filteredValue: [search?.brand] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "brand",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    },
    {
      key: "qtyValue",
      title: "QUANTITY",
      dataIndex: "qtyValue",
      align: "right",
      sorter: true,
      filteredValue: [search?.qtyValue] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "qtyValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    },
    {
      key: "capValue",
      title: "CAPACITY",
      dataIndex: "capValue",
      align: "right",
      sorter: true,
      filteredValue: [search?.capValue] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "capValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    },
    {
      key: "conValue",
      title: "ENERGY CONSUMPTION",
      dataIndex: "conValue",
      align: "right",
      sorter: true,
      filteredValue: [search?.conValue] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "conValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    },
    {
      key: "gasConvValue",
      title: "GAS CONVERSION/MONTH",
      dataIndex: "gasConvValue",
      align: "right",
      sorter: true,
      filteredValue: [search?.gasConvValue] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "gasConvValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    },
    {
      key: "noh",
      title: "OPERATIOIN HOURS/DAY",
      dataIndex: "noh",
      align: "right",
      sorter: true,
      filteredValue: [search?.noh] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "noh",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    },
    {
      key: "nod",
      title: "OPERATIOIN DAYS/WEEK",
      dataIndex: "nod",
      align: "right",
      sorter: true,
      filteredValue: [search?.nod] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "nod",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    },
    {
      key: "isDualFuel",
      title: "DUAL FUEL",
      dataIndex: "isDualFuel",
      sorter: true,
      filteredValue: [search?.isDualFuel] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "isDualFuel",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    },
    {
      key: "fuelType1",
      title: "FUEL TYPE 1",
      dataIndex: "fuelType1",
      sorter: true,
      filteredValue: [search?.fuelType1] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "fuelType1",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    },
    {
      key: "fuelType2",
      title: "FUEL TYPE 2",
      dataIndex: "fuelType2",
      sorter: true,
      filteredValue: [search?.fuelType2] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "fuelType2",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    },
    {
      key: "description",
      title: "DESCRIPTION",
      dataIndex: "description",
      sorter: true,
      filteredValue: [search?.description] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    },
  ];
};

const EquipmentPage = ({ idAccount, idCustomer }) => {
  const dispatch = useDispatch();
  const {
    list_equipment,
    pagination_equipment,
    loading,
    data_detail,
  } = useSelector(
    (state) => state.accountEquipment
  );

  const { access_account } = useSelector(
    (state) => state.accountManagement
  );
  const [form] = Form.useForm();

  const [page, setPage] = useState(1);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [modalDetail, setModalDetail] = useState(false);
  const [modalCreateUpdate, setModalCreateUpdate] = useState(false);
  const [type, setType] = useState("");
  const [idEquipment, setIdEquipment] = useState("");
  const [body, setBody] = useState({});
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const location = useLocation();

  const [loadMoreSize] = useState(20);

  const currentData = useMemo(() => {
    if (!Array.isArray(list_equipment)) return [];

    return list_equipment.map(item => ({
      ...item,
      statusApproval: item?.statusApproval ?? "DRAFT",
    }));
  }, [list_equipment]);
  const currentPagination = pagination_equipment;
  
  const hashMore = currentData.length < (currentPagination?.totalElements || 0);

  useEffect(() => {
    if(location?.pathname.includes('account-standard')) {
      dispatch(getGrantedAccessAccount('/account-management/account-standard/equipment'))
    }else{
      dispatch(getGrantedAccessAccount('/account-management/account-onetime/equipment'))
    }
  }, [dispatch])

  useEffect(() => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(
      getListEqupment({
        id: idAccount,
        search: reqSearch,
        sort,
        page,
        pageSize: loadMoreSize,
        isLoadMore: false,
      })
    );
  }, [search, sort]);

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

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = currentPagination?.totalPages || 0;
    const reqSearch = encodeURIComponent(JSON.stringify(search));

    if (nextPage <= totalPages) {
      await dispatch(
        getListEqupment({
          id: idAccount,
          search: reqSearch,
          sort,
          page: nextPage,
          pageSize: loadMoreSize,
          isLoadMore: true,
        })
      );
      setPage(nextPage);
    }
  }

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleSave = () => {
    dispatch(createEqupment(body?.body))
    .unwrap()
    .then(() => {
      form.resetFields();
      setOpenConfirmation(false);
      const reqSearch = encodeURIComponent(JSON.stringify(search));
      dispatch(
        getListEqupment({
          id: idAccount,
          search: reqSearch,
          sort,
          page,
          pageSize: loadMoreSize,
        })
      );
    })  
    .catch((err) => {
      console.log(err)
      return;
    });
}
  const handleDetail = async (r) => {
    setModalDetail(true);
    dispatch(getDetailEquipment({ id: r }));
  };

  const handleDelete = (id) => {
    setOpenModalDelete(true);
    setIdEquipment(id);
  }
  const handleConfirmModalDelete = () => {
    setOpenModalDelete(false);
    dispatch(deleteEquipment({ id: idEquipment }))
    .unwrap()
    .then(() => {
      form.resetFields();
      setOpenConfirmation(false);
      const reqSearch = encodeURIComponent(JSON.stringify(search));
      dispatch(
        getListEqupment({
          id: idAccount,
          search: reqSearch,
          sort,
          page,
          pageSize: loadMoreSize,
        })
      );
    })  
    .catch((err) => {
      console.log(err)
      return;
    });
  };
  const handleCloseModalDelete = () => {
    setOpenModalDelete(false);
    setIdEquipment("");
  };  

  const itemActions = nxGetAccountActions({
    handleCreate: () => {
      setModalCreateUpdate(true);
      setType("create");
    },
    handleView: ({ id }) => {
      handleDetail(id);
    },
    handleUpdate: ({ id }) => {
      setModalCreateUpdate(true);
      setType("update");
      setIdEquipment(id);
      dispatch(getDetailEquipment({ id }));
    },
    handleDelete: ({ id }) => {
      handleDelete(id);
    },
  })
  // const itemActions = [
  //   //action toolbar
  //   {
  //     action: 'Create',
  //     render: (
  //       <ButtonComponent
  //         icon={<PlusOutlined style={{ fontSize: "20px" }} />}
  //         type="submit"
  //         onClick={() => {
  //           setModalCreateUpdate(true);
  //           setType("create");
  //         }}
  //       >
  //         Create
  //       </ButtonComponent>
  //     )
  //   },

  //   // Column Action Table
  //   {
  //     action: "View",
  //     type: "table",
  //     render: (record) => {
  //       return (
  //         <Tooltip
  //           title="Detail"
  //           onClick={() => {
  //             handleDetail(record);
  //           }}
  //         >
  //           <div className="flex items-center h-full">
  //             <SVGIcon
  //               name="IconDetail"
  //               color={"#0075bf"}
  //               width={20}
  //             />
  //           </div>
  //         </Tooltip>
  //       )
  //     }
  //   },
  //   {
  //     action: "Update",
  //     type: "table",
  //     render: (record) => {
  //       return (
  //         <Tooltip title="Update">
  //           <div className={`flex items-center h-full`}>
  //             <SVGIcon
  //               name="IconEdit"
  //               width={20}
  //               onClick={() => {
  //                 setModalCreateUpdate(true);
  //                 setType("update");
  //                 setIdEquipment(record?.id);
  //                 dispatch(getDetailEquipment({ id: record?.id }));
  //               }}
  //             />
  //           </div>
  //         </Tooltip>
  //       )
  //     }
  //   },
  //   {
  //     action: "Hapus",
  //     type: "table",
  //     render: (record) => {
  //       return (
  //         <Tooltip title="Delete">
  //           <div className="flex items-center h-full">
  //             <SVGIcon
  //               name="IconDelete"
  //               width={20}
  //               onClick={() => handleDelete(record?.id)}
  //             />
  //           </div>
  //         </Tooltip>
  //       )
  //     }
  //   },
  // ];

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["action"],
    left: [],
  }));

  const actionCols = useColumnActionPermissionAccount(
    ["View", "Update", "Delete"],
    itemActions,
    access_account
  ).map((col) => ({
    ...col,
    width: 70,
    align: "center",
  }));

  const baseColumns = useMemo(() =>
    columns(
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ), [search, searchText, searchedColumn]
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns, actionCols]);

  const processedColumns = useMemo(() => {
    return nxApplyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }))
  }, [allColumns]);

  return (
    <>
      <Spin spinning={loading}>
        <NxCardContainer header={"EQUIPMEENT LIST"}>
          <NxBaseContainer border>
            <div className="flex w-full justify-end gap-3 mb-5">
              <ToolbarAccount items={itemActions} advancedAccess={access_account} />
            </div>
            <NxTable
              idTable={"table-equipment-account-management"}
              dataSource={currentData}
              totalData={currentPagination?.totalElements}
              current={page}
              tableScrolled={{ y: 525, x: currentData.length ? "max-content" : "100%" }}
              onSort={onSort}
              columns={processedColumns}
              usePagination={false}
              useInfiniteScroll={true}
              hashMore={hashMore}
              onLoadMore={handleLoadMore}
              loadMoreThreshold={20}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              columnDefinitions={columnDefinitions}
              loading={loading}
            />
          </NxBaseContainer>
        </NxCardContainer>
        <EquipmentForm
          type={type}
          dispatch={dispatch}
          isOpen={modalCreateUpdate}
          setIsOpen={setModalCreateUpdate}
          idAccount={idAccount}
          idEquipment={idEquipment}
          body={body}
          setBody={setBody}
          handleSave={handleSave}
          openConfirmation={openConfirmation}
          setOpenConfirmation={setOpenConfirmation}
          form={form}
        />
        <DetailEquipment
          isOpen={modalDetail}
          setIsOpen={setModalDetail}
          dataDetail={data_detail}
        />

        {/* Modal Delete */}
        <ModalConfirm
          isOpen={openModalDelete}
          handleCancel={handleCloseModalDelete}
          handleOk={handleConfirmModalDelete}
          width={500}
        >
          <div className="flex justify-center gap-[20px] mt-6">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className={"text-[18px] font-bold"}>
              Are you sure want to delete equipment ?
            </p>
          </div>
          {/* <Alert
            message="Warning! your data will deleted permanently"
            type={"error"}
          /> */}
        </ModalConfirm>
      </Spin>
    </>
  );
};

export default EquipmentPage;
