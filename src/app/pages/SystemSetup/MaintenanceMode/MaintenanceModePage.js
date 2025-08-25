import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Form, Switch, Tooltip } from "antd";
import { columns } from "./Table/TableMaintenanceMode";
import { getMaintenanceMode } from "../../../../redux/slices/system_setup/maintenanceMode";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import TablePagination from "../../../../components/TablePagination";
import Toolbar from "../../../../components/Toolbar";
import ModalDetailMaintenanceMode from "./Modal/ModalDetailMaintenanceMode";
import ModalConfirmationTurnOnOff from "./Modal/ModalConfirmationTurnOnOff";
import SVGIcon from "../../../../assets/Icon/index";

const MaintenanceModePage = () => {
  // Selector
  const { loading, data_MaintenanceMode } = useSelector(
    (state) => state.maintenanceMode
  );

  // Declaration
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalTurnOnOff, setModalTurnOnOff] = useState(false);
  const [bodyData, setBodyData] = useState({});
  const [switchValue, setSwitchValue] = useState(false);

  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Maintenance Mode",
    },
  ];

  // Use Effect
  useEffect(() => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(getMaintenanceMode({ search: reqSearch, page, pageSize, sort }));
  }, [dispatch, search, page, pageSize, sort]);

  useEffect(() => {
    const hasActiveData = data_MaintenanceMode?.result?.some(
      (item) => item?.status === "ACTIVE"
    );
    setSwitchValue(hasActiveData);
  }, [data_MaintenanceMode]);

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

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

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleSwitchChange = (value) => {
    // setSwitchValue(value);
    if (value === false) {
      setBodyData(
        data_MaintenanceMode?.result
          ?.filter((item) => item?.status === "ACTIVE")
          ?.map((item) => ({ ...item, value: value }))[0]
      );
    } else {
      setBodyData({ value: value });
    }
    setModalTurnOnOff(true);
  };

  const handleReset = () => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(getMaintenanceMode({ search: reqSearch, page, pageSize, sort }));
  };

  const handleOpenDetail = (val) => {
    setModalConfirm(true);
    setBodyData(val);
  };

  const handleCancel = () => {
    setModalTurnOnOff(false);
  };

  const itemActions = [
    // toolbar items
    {
      action: "Create",
      render: (
        <div
          className={"w-full flex justify-end"}
          style={{ marginBottom: "20px" }}
        >
          <Switch
            checked={switchValue}
            onChange={handleSwitchChange}
            checkedChildren="Turn on"
            unCheckedChildren="Turn off"
          />
        </div>
      ),
    },

    // column action
    {
      action: "View",
      type: 'table',
      render: (record, data_length) => {
        return (
          <div onClick={() => handleOpenDetail(record)}>
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon name="IconDetail" width={24} />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ];
  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <BaseContainer header={"MAINTENANCE MODE"}>
          <Toolbar items={itemActions} />
          <div className={"w-full"}>
            <TablePagination
              dataSource={data_MaintenanceMode?.result}
              columns={[
                ...columns(
                  search,
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch
                ),
                ...useColumnActionPermission(["view"], itemActions),
              ]}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={data_MaintenanceMode?.page?.totalElements || 0}
              onSort={onSort}
              tableScrolled={{ y: 500, x: 1300 }}
            />
          </div>
        </BaseContainer>


        {/* Modal Confirmation */}
        <ModalDetailMaintenanceMode
          isOpen={modalConfirm}
          data={bodyData}
          handleCancel={() => setModalConfirm(false)}
        />


        {/* Modal Confirmation Turn On/Turn Off */}
        <ModalConfirmationTurnOnOff
          isOpen={modalTurnOnOff}
          handleCancel={() => handleCancel()}
          handleReset={() => handleReset()}
          switchValue={switchValue}
          bodyData={bodyData}
          setBodyData={setBodyData}
          setSwitchValue={setSwitchValue}
        />


      </Spin>
    </LayoutMenu>
  );
};

export default MaintenanceModePage;
