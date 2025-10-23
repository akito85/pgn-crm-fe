import React, { useEffect, useState, useRef } from "react";
import { Form, Spin, Tooltip } from "antd";
import { PlusOutlined, WarningOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import BaseContainer from "../../../../../../components/BaseContainer";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import { getColumnSearchPropsPaging, getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import DetailEquipment from "./DetailEquipment";
import EquipmentForm from "./Form/EquipmentForm";
import {
  getDetailEquipment,
  getListEqupment,
  getDdlBrandEquipment,
  getDdlCapacityEquipment,
  getDdlEnergyEquipment,
  getDdlGasConversionEquipment,
  getDdlNameEquipment,
  getDdlQtyEquipment,
  getDdlTypeEquipment,
  createEqupment,
  getDdlFuelTypeEquipment,
  deleteEquipment,
} from "../../../../../../redux/slices/account_management/detailAccount/equpmentSlice";
import { ModalConfirm } from "../../../../../../components/Modal/ModalPopUp";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";
import { useColumnActionPermissionAccount } from "../../../ComponentAccount/ColumnActionPermissionAccount";
import ToolbarAccount from "../../../ComponentAccount/ToolbarAccount";
import { hasValue, renderColumn } from "../../../../../../utils";
import { useLocation } from "react-router-dom";

const columns = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleDetail,
  setType,
  setModalCreateUpdate,
  setIdEquipment,
  dispatch,
  handleDelete
) => {
  return [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "NAME",
      dataIndex: "name",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "name",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn("name", hasValue(search['name']), searchText, text,false, 'input', search),

    },
    {
      title: "TYPE",
      dataIndex: "typeEquipment",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "typeEquipment",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn("typeEquipment", hasValue(search['typeEquipment']), searchText, text, false, 'input', search),
    },
    {
      title: "BRAND",
      dataIndex: "brand",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "brand",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn("brand", hasValue(search['brand']), searchText, text, false, 'input', search),
    },
    {
      title: "QUANTITY",
      dataIndex: "qtyValue",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "qtyValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn("qtyValue", hasValue(search['qtyValue']), searchText, text, false, 'input', search),
    },
    {
      title: "CAPACITY",
      dataIndex: "capValue",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "capValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn("capValue", hasValue(search['capValue']), searchText, text, false, 'input', search),
    },
    {
      title: "ENERGY CONSUMPTION",
      dataIndex: "conValue",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "conValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn("conValue", hasValue(search['conValue']), searchText, text, false, 'input', search),
    },
    {
      title: "GAS CONVERSION/MONTH",
      dataIndex: "gasConvValue",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "gasConvValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn("gasConvValue", hasValue(search['gasConvValue']), searchText, text, false, 'input', search),
    },
    {
      title: "OPERATIOIN HOURS/DAY",
      dataIndex: "noh",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "noh",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn("noh", hasValue(search['noh']), searchText, text, false, 'input', search),
    },
    {
      title: "OPERATIOIN DAYS/WEEK",
      dataIndex: "nod",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "nod",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn("nod", hasValue(search['nod']), searchText, text, false, 'input', search),
    },
    {
      title: "DUAL FUEL",
      dataIndex: "isDualFuel",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "isDualFuel",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn("isDualFuel", hasValue(search['isDualFuel']), searchText, text, false, 'input', search),
    },
    {
      title: "FUEL TYPE 1",
      dataIndex: "fuelType1",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "fuelType1",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn("fuelType1", hasValue(search['fuelType1']), searchText, text, false, 'input', search),
    },
    {
      title: "FUEL TYPE 2",
      dataIndex: "fuelType2",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "fuelType2",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn("fuelType2", hasValue(search['fuelType2']), searchText, text, false, 'input', search),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn("description", hasValue(search['description']), searchText, text, false, 'input', search),
    },
  ];
};

const EquipmentPage = ({ idAccount, idCustomer }) => {
  const dispatch = useDispatch();
  const { data, loading, data_detail } = useSelector(
    (state) => state.accountEquipment
  );
  const { access_account } = useSelector(
    (state) => state.accountManagement
  );
  const [form] = Form.useForm();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
        pageSize,
      })
    );
  }, [idAccount, search, page, pageSize, sort, dispatch]);

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
          pageSize,
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
    dispatch(getDetailEquipment({ id: r?.id }));
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
          pageSize,
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

  const itemActions = [
    //action toolbar
    {
      action: 'Create',
      render: (
        <ButtonComponent
          icon={<PlusOutlined style={{ fontSize: "24px" }} />}
          type="submit"
          onClick={() => {
            setModalCreateUpdate(true);
            setType("create");
          }}
        >
          Create
        </ButtonComponent>
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
            <div className={`flex justify-center pt-1`}>
              <SVGIcon
                name="IconEdit"
                width={24}
                onClick={() => {
                  setModalCreateUpdate(true);
                  setType("update");
                  setIdEquipment(record?.id);
                  dispatch(getDetailEquipment({ id: record?.id }));
                }}
              />
            </div>
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
                onClick={() => handleDelete(record?.id)}
              />
            </div>
          </Tooltip>
        )
      }
    },
  ];
  return (
    <>
      <Spin spinning={loading}>
        <BaseContainer header={"Equipment List"}>
          <div className="flex w-full justify-end gap-3 mb-5">
            <ToolbarAccount items={itemActions} advancedAccess={access_account} />
          </div>
          <TablePaginationNew
            dataSource={data?.result}
            totalData={data?.page?.totalElements}
            current={page}
            pageSize={pageSize}
            tableScrolled={{ y: 525, x: 2500 }}
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
                setType,
                setModalCreateUpdate,
                setIdEquipment,
                dispatch,
                handleDelete
              ),
              ...useColumnActionPermissionAccount(
                ["View", "Update", "Hapus"],
                itemActions,
                access_account
              )
            ]}
          />
        </BaseContainer>
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
