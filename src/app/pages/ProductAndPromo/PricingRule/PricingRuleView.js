import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { Input, Tooltip, Spin, Checkbox, DatePicker } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import SVGIcon from "../../../../assets/Icon/index";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import {
  downloadPricingRule,
  getAllPricingRulePaginate,
  getApprovalHistory,
  inactivePricingRule,
  getListAppHier,
  getListAppHierDetail,
} from "../../../../redux/slices/product_promo/PricingRule/PricingRuleSlice";
import Highlighter from "react-highlight-words";
import { FilterOutlined } from "@ant-design/icons";
import moment from "moment";
import BaseContainer from "../../../../components/BaseContainer";
import {
  ModalInactiveErrorPricingRule,
  ModalInactiveSuccessPricingRule,
} from "./Modal/ModalInactivePricingRule";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import {
  dateFormatting,
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../utils";
import ModalInactivateWithHierarchy from "../../../../components/Modal/ModalInactivateWithHierarchy";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";

const objType = {
  PRICING_RULE: "Create",
  INACTIVE_PRICING_RULE: "Inactive",
};
const PricingRuleView = () => {
  // Selector
  const { data, loading, data_approval_history } = useSelector(
    (state) => state.pricingRule,
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data?.result;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [chooseId, setChooseId] = useState({});
  const [modalInactive, setModalInactive] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});

  // Use Effect
  useEffect(() => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      getAllPricingRulePaginate({ search: tempSearch, page, pageSize, sort }),
    );
  }, [dispatch, search, page, pageSize, sort]);

  // console.log(dataApprovalHistory);

  useEffect(() => {
    if (data_approval_history?.dataApprover) {
      const temp = {
        dataApprover: {
          create: data_approval_history?.dataApprover?.PRICING_RULE || [],
          inactive:
            data_approval_history?.dataApprover?.INACTIVE_PRICING_RULE || [],
        },
        dataHistory: {
          create: data_approval_history?.dataHistory?.PRICING_RULE || [],
          inactive:
            data_approval_history?.dataHistory?.INACTIVE_PRICING_RULE || [],
        },
      };
      setDataApprovalHistory(temp);
    } else {
      setDataApprovalHistory({});
    }
  }, [data_approval_history]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Product & Promo",
    },
    {
      path: PRODUCT_PROMO_ROUTES.VIEW_PRICING_RULE,
      breadcrumbName: "Pricing Rule",
    },
  ];

  // Search Column Table
  const getColumnSearchProps = (dataIndex, type) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const onDataChange = (value, dateString) => {
        setSelectedKeys(dateString ? [dateString] : []);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };
      return (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {type === "date" ? (
            <DatePicker onChange={onDataChange} />
          ) : (
            <Input
              ref={searchInput}
              placeholder={`Search`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => {
                handleSearch(selectedKeys, confirm, dataIndex);
              }}
              style={{
                marginBottom: 8,
                display: "block",
              }}
            />
          )}
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    // onFilter: (value, record) =>
    //   record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 5000);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={
            type === "date"
              ? moment([searchText]).format(dateFormatting.dateFormal)
              : [searchText]
          }
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  // Function Search Column
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

  // Function Change Pagination
  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  // Column
  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "PRICING RULE NAME",
      dataIndex: "name",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "name",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "name",
          hasValue(search["name"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      align: "center",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
      ),
      render: (text) =>
        renderDateColumn(
          "startDate",
          hasValue(search["startDate"]),
          searchText,
          text,
          "date",
          search,
        ),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      align: "center",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
      ),
      render: (text) =>
        renderDateColumn(
          "endDate",
          hasValue(search["endDate"]),
          searchText,
          text,
          "date",
          search,
        ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      align: "left",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "description",
          hasValue(search["description"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      fixed: "right",
      width: 160,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (index) => {
        let text;
        switch (index) {
          case "WAITING APPROVAL":
          case "WAITING_FOR_APPROVAL":
          case "WAITING_APPROVAL":
          case "WAITING FOR APPROVAL":
            text = "Waiting Approval";
            break;
          default:
            text = index
              ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
              : index;
            break;
        }
        return text
          ? renderColumn(
              "status",
              hasValue(search["status"]),
              searchText,
              text,
              false,
              "status",
              search,
            )
          : text;
      },
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "approvalStatus",
      fixed: "right",
      width: 240,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "statusApproval",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (statusApproval) => {
        let text;
        switch (statusApproval) {
          case "WAITING APPROVAL":
          case "WAITING_FOR_APPROVAL":
          case "WAITING_APPROVAL":
          case "WAITING FOR APPROVAL":
            text = "Waiting Approval";
            break;
          default:
            text = statusApproval
              ? statusApproval.charAt(0).toUpperCase() +
                statusApproval.slice(1).toLowerCase()
              : statusApproval;
            break;
        }
        return text
          ? renderColumn(
              "statusApproval",
              hasValue(search["statusApproval"]),
              searchText,
              text,
              false,
              "status",
              search,
            )
          : text;
      },
    },
    // {
    //   title: "ACTION",
    //   dataIndex: "pricingRuleId",
    //   fixed: "right",
    //   width: "12%",
    //   align: "center",
    //   render: (id, record) => {
    //     return (
    //       <Space>
    //         <Popover
    //           trigger={"click"}
    //           placement="bottomRight"
    //           content={
    //             <Space direction="vertical">
    //               {record.approvalStatus !== "WAITING FOR APPROVAL" &&
    //               record.status !== "INACTIVE" ? (
    //                 <Link
    //                   to={PRODUCT_PROMO_ROUTES.UPDATE_PRICING_RULE}
    //                   state={{
    //                     id: id,
    //                     statusPricingRule: record.status,
    //                     statusApprovalPricingRule: record.approvalStatus,
    //                   }}
    //                 >
    //                   <ButtonComponent
    //                     icon={
    //                       <SVGIcon
    //                         name="IconEdit"
    //                         color={"#0075bf"}
    //                         width={24}
    //                       />
    //                     }
    //                     border={false}
    //                   >
    //                     <span className={"text-black"}> Update</span>
    //                   </ButtonComponent>
    //                 </Link>
    //               ) : (
    //                 <ButtonComponent
    //                   icon={
    //                     <SVGIcon name="IconEdit" color={"#8D91A0"} width={24} />
    //                   }
    //                   border={false}
    //                   disabled={true}
    //                 >
    //                   <span className={"text-black"}> Update</span>
    //                 </ButtonComponent>
    //               )}
    //               <ButtonComponent
    //                 icon={
    //                   <Checkbox
    //                     className="inactive-check"
    //                     checked={!(record.status === "ACTIVE")}
    //                     disabled={
    //                       !(
    //                         record.status === "ACTIVE" &&
    //                         record.approvalStatus !== "WAITING FOR APPROVAL"
    //                       )
    //                     }
    //                   />
    //                 }
    //                 border={false}
    //                 onClick={
    //                   record.status === "ACTIVE" &&
    //                   record.approvalStatus !== "WAITING FOR APPROVAL"
    //                     ? () => handleActiveOrInactive(record)
    //                     : undefined
    //                 }
    //               >
    //                 <span className={"text-black"}>
    //                   {record.status === "ACTIVE" ? "Inactivate" : "Activate"}
    //                 </span>
    //               </ButtonComponent>
    //               <ButtonComponent
    //                 icon={
    //                   <SVGIcon
    //                     name="IconLogHistory"
    //                     color={"#0075bf"}
    //                     width={24}
    //                   />
    //                 }
    //                 border={false}
    //                 onClick={() => handleApprovalHistory(id)}
    //               >
    //                 <span className={"text-black"}>Approval History</span>
    //               </ButtonComponent>
    //             </Space>
    //           }
    //         >
    //           <ButtonComponent
    //             icon={<MoreOutlined style={{ fontSize: "24px" }} />}
    //             border={false}
    //           />
    //         </Popover>
    //         <Tooltip title="Detail">
    //           <Link
    //             to={PRODUCT_PROMO_ROUTES.DETAIL_PRICING_RULE}
    //             state={{ id: id }}
    //           >
    //             <ButtonComponent
    //               icon={<SVGIcon name="IconDetail" width={24} />}
    //               border={false}
    //             />
    //           </Link>
    //         </Tooltip>
    //       </Space>
    //     );
    //   },
    // },
  ];

  // Handle Confirmation Active/Inactive
  const handleActiveOrInactive = (record) => {
    setModalConfirm(true);
    setChooseId(record);
  };

  // Handle Download
  const handleDownload = () => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(downloadPricingRule({ search: tempSearch, page, pageSize, sort }));
  };

  // Handle Cancel Modal Confirmation Inactive
  const handleCancel = () => {
    setChooseId({});
    setModalConfirm(false);
  };

  // handle Active/Inactive
  const handleOk = (res, handleClear) => {
    const dataValue = {
      pricingRuleId: chooseId.pricingRuleId,
      appHierId: res.approvalHierarchy,
      description: res.remark,
      name: chooseId.name,
    };
    dispatch(inactivePricingRule(dataValue))
      .unwrap()
      .then(() => {
        // setModalInactive(true);
        handleClear();
        handleCancel();
        let tempSearch = "";
        for (const dataIndex in search) {
          if (Object.hasOwnProperty.call(search, dataIndex)) {
            const tempSearchText = search[dataIndex];
            if (tempSearchText) {
              tempSearch += `${dataIndex}~${tempSearchText},`;
            }
          }
        }
        tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
        dispatch(
          getAllPricingRulePaginate({
            search: tempSearch,
            page,
            pageSize,
            sort,
          }),
        );
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setBodyError({ body: { ...res }, handleClear, message });
          setModalError(true);
        }
      });
  };

  // Handle Approval History
  const handleApprovalHistory = (id) => {
    dispatch(getApprovalHistory(id));
    setModalApprovalHistory(true);
  };

  const itemsActionView = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonDownload" width={24} />}
          type="submit"
          onClick={() => handleDownload()}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={PRODUCT_PROMO_ROUTES.CREATE_PRICING_RULE}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create Pricing Rule
          </ButtonComponent>
        </NavLink>
      ),
    },
    //table
    {
      action: "view",
      type: "table",
      render: (record, data_length) => {
        return (
          <Tooltip title="Detail">
            <Link
              to={PRODUCT_PROMO_ROUTES.DETAIL_PRICING_RULE}
              state={{ id: record?.pricingRuleId }}
            >
              <ButtonComponent
                icon={<SVGIcon name="IconDetail" width={24} />}
                border={false}
              />
            </Link>
          </Tooltip>
        );
      },
    },
    {
      action: "Update",
      type: "table",
      render: (record, data_length) => {
        const isEditable =
          record.approvalStatus === "DRAFT" ||
          record.approvalStatus === "REJECTED" ||
          (record.status === "ACTIVE" && record.approvalStatus === "APPROVED");

        const render =
          data_length > 3 ? (
            <ButtonComponent
              icon={<SVGIcon name="IconEdit" color="#0075bf" width={24} />}
              border={false}
              disabled={!isEditable}
            >
              {data_length > 3 && (
                <span className="text-black ml-3"> Update</span>
              )}
            </ButtonComponent>
          ) : (
            <Tooltip title="Update">
              <div className="pt-1">
                <SVGIcon
                  name="IconEdit"
                  width={24}
                  color={!isEditable ? "#8D91A0" : "#ACC424"}
                  className={!isEditable ? "cursor-not-allowed" : undefined}
                />
              </div>
            </Tooltip>
          );

        return isEditable ? (
          <Link
            to={PRODUCT_PROMO_ROUTES.UPDATE_PRICING_RULE}
            state={{
              id: record?.pricingRuleId,
              statusPricingRule: record.status,
              statusApprovalPricingRule: record.approvalStatus,
            }}
          >
            {render}
          </Link>
        ) : (
          render
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data_length) => {
        const isActivateOrInactivate =
          (record?.approvalStatus === "APPROVED" &&
            record?.status === "ACTIVE") ||
          (record?.approvalStatus === "DRAFT" && record?.status === "ACTIVE") ||
          (record?.approvalStatus === "REJECTED" &&
            record?.status === "ACTIVE");

        return data_length > 3 ? (
          <ButtonComponent
            icon={
              <Checkbox
                className="inactive-check"
                disabled={record?.status === "ACTIVE" ? false : true}
                checked={record?.status === "ACTIVE" ? false : true}
              />
            }
            border={false}
            disabled={!isActivateOrInactivate}
            onClick={() => handleActiveOrInactive(record)}
          >
            <span className="text-black ml-5">
              {record?.status !== "ACTIVE" ? "Activate" : "Inactivate"}
            </span>
          </ButtonComponent>
        ) : (
          <Tooltip
            title={record?.status === "ACTIVE" ? "Inactivate" : "Activate"}
          >
            <div className="pt-1">
              <Checkbox
                className="inactive-check"
                onClick={() => handleActiveOrInactive(record)}
                disabled={record?.status === "ACTIVE" ? false : true}
                checked={record?.status === "ACTIVE" ? false : true}
              />
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "History",
      type: "table",
      render: (record, data_length) => {
        return data_length > 3 ? (
          <ButtonComponent
            icon={
              <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
            }
            border={false}
            onClick={() => handleApprovalHistory(record?.pricingRuleId)}
          >
            <span className={"text-black ml-3"}>Approval History</span>
          </ButtonComponent>
        ) : (
          <Tooltip title="Approval History">
            <div className="pt-1">
              <SVGIcon
                name="IconLogHistory"
                color={"#0075bf"}
                width={24}
                onClick={() => handleApprovalHistory(record?.id)}
              />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  const handleOptions = () => {
    const data = dataApprovalHistory?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };
  const handleRetry = () => {
    handleOk(bodyError.body, bodyError.handleClear);
    setModalError(false);
    setBodyError({});
  };

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        {/* <div className="w-full flex justify-end gap-[20px]">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonDownload" width={24} />}
            type="submit"
            onClick={() => handleDownload()}
          >
            Download List
          </ButtonComponent>

          <NavLink to={PRODUCT_PROMO_ROUTES.CREATE_PRICING_RULE}>
            <ButtonComponent
              icon={<SVGIcon name="IconButtonCreate" width={24} />}
              type="submit"
            >
              Create Pricing Rule
            </ButtonComponent>
          </NavLink>
        </div> */}
        <Toolbar items={itemsActionView} />
        <BaseContainer header={"pricing rule list"}>
          <div className="w-full">
            <TablePaginationNew
              dataSource={dataSource}
              columns={[
                ...columns,
                ...useColumnActionPermission(
                  ["view", "Update", "Activate", "History"],
                  itemsActionView,
                ),
              ]}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onShowSizeChange={handleChange}
              totalData={data?.page?.totalElements || 0}
              onSort={onSort}
              tableScrolled={{
                x: 1800,
                y: 300,
              }}
            />
          </div>
        </BaseContainer>

        {/* Modal Confirmation Active/Inactive */}
        {/* <ModalInactivePricingRule
          isOpen={modalConfirm}
          handleCancel={handleCancel}
          handleOk={handleOk}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        >
          <Form layout="vertical" form={form}>
            <Form.Item
              label="Approval Hierarchy"
              name="appHierId"
              rules={[
                {
                  required: true,
                  message: "Please input your Approval Hierarchy!",
                },
              ]}
            >
              <Select
                allowClear
                onChange={(e) => handleSelect(e)}
                style={{
                  width: 300,
                }}
              >
                {data_approval &&
                  data_approval.map((ta, index) => (
                    <Select.Option value={ta.appHierId} key={index}>
                      {ta.approvalName}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Form>
        </ModalInactivePricingRule> */}

        <ModalInactivateWithHierarchy
          selector={"pricingRule"}
          dispatch={dispatch}
          getAPIOption={getListAppHier}
          getAPIDetail={getListAppHierDetail}
          alertMessage={`Are you sure you want to inactivate Pricing Rule named ${
            chooseId?.name || ""
          }?`}
          openModalInactivate={modalConfirm}
          handleCloseModalInactivate={handleCancel}
          onFinish={handleOk}
        />

        {/* Modal Success Inactive */}
        <ModalInactiveSuccessPricingRule
          isOpen={modalInactive}
          handleOk={() => setModalInactive(false)}
          handleCancel={() => setModalInactive(false)}
        />

        {/* Modal Error Inactive */}
        <ModalInactiveErrorPricingRule
          isOpen={modalError}
          handleOk={handleRetry}
          handleCancel={handleCloseModalError}
        />

        {/* Modal Approval History */}
        <ModalHistory
          isOpen={modalApprovalHistory && dataApprovalHistory}
          handleClose={() => setModalApprovalHistory(false)}
          header={"Approval History"}
          width={850}
          tabOptions={handleOptions()}
          dataApprover={dataApprovalHistory?.dataApprover}
          dataHistory={dataApprovalHistory?.dataHistory}
        />
      </Spin>
    </LayoutMenu>
  );
};

export default PricingRuleView;
