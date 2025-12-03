import React, { useEffect, useRef, useState } from "react";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { useSelector, useDispatch } from "react-redux";
import BaseContainer from "../../../../components/BaseContainer";
import { Spin, Input, Tooltip, Checkbox } from "antd";
import ButtonComponent from "../../../../components/ButtonComponent";
import {
  DownloadOutlined,
  PlusOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { NavLink, Link } from "react-router-dom";
import Highlighter from "react-highlight-words";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import SVGIcon from "../../../../assets/Icon/index";
import {
  downloadTOS,
  getAllTosPaginate,
  inactiveTos,
} from "../../../../redux/slices/product_promo/tos";
import TermOfServiceDetail from "./Modal/TermOfServiceDetail";
import TermOfServiceInactive from "./Modal/TermOfServiceInactive";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn } from "../../../../utils";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";

const TermOfServiceView = () => {
  // Selector
  const { data, loading } = useSelector((state) => state.tos);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [modalInactive, setModalInactive] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
  const [chooseId, setChooseId] = useState("");
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  // Use Effect
  useEffect(() => {
    // let tempSearch = "";
    // for (const dataIndex in search) {
    //   if (Object.hasOwnProperty.call(search, dataIndex)) {
    //     const tempSearchText = search[dataIndex];
    //     if (tempSearchText) {
    //       tempSearch += `${dataIndex}~${tempSearchText},`;
    //     }
    //   }
    // }
    // tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      getAllTosPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        sort,
        page,
        pageSize,
      }),
    );
  }, [search, sort, page, pageSize]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Product & Promo",
    },
    {
      path: PRODUCT_PROMO_ROUTES.VIEW_TOS_NEWS,
      breadcrumbName: "Terms Of Service",
    },
  ];

  // Search Column
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
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
      </div>
    ),
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    // onFilter: (value, record) =>
    //   record[dataIndex]
    //     ?.toString()
    //     ?.toLowerCase()
    //     ?.includes(value.toLowerCase()),
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
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

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

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const columns = [
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
      title: "ATTRIBUTE",
      dataIndex: "attributes",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "attributes",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "attributes",
          hasValue(search["attributes"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),
      // render: (text) =>
      //   searchedColumn === "attributes" ? (
      //     <Highlighter
      //       highlightStyle={{
      //         backgroundColor: "#ffc069",
      //         padding: 0,
      //       }}
      //       searchWords={[searchText]}
      //       autoEscape
      //       textToHighlight={text ? text.toString() : ""}
      //     />
      //   ) : text ? (
      //     <Tooltip placement="topLeft" title={text}>
      //       {text}
      //     </Tooltip>
      //   ) : (
      //     ""
      //   ),
    },
    {
      title: "CRITERIA",
      dataIndex: "criterias",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "criterias",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "criterias",
          hasValue(search["criterias"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),
      // render: (text) =>
      //   searchedColumn === "criterias" ? (
      //     <Highlighter
      //       highlightStyle={{
      //         backgroundColor: "#ffc069",
      //         padding: 0,
      //       }}
      //       searchWords={[searchText]}
      //       autoEscape
      //       textToHighlight={text ? text.toString() : ""}
      //     />
      //   ) : text ? (
      //     <Tooltip placement="topLeft" title={text}>
      //       {text}
      //     </Tooltip>
      //   ) : (
      //     ""
      //   ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
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
      // render: (text) =>
      //   searchedColumn === "description" ? (
      //     <Highlighter
      //       highlightStyle={{
      //         backgroundColor: "#ffc069",
      //         padding: 0,
      //       }}
      //       searchWords={[searchText]}
      //       autoEscape
      //       textToHighlight={text ? text.toString() : ""}
      //     />
      //   ) : text ? (
      //     <Tooltip placement="topLeft" title={text}>
      //       {text}
      //     </Tooltip>
      //   ) : (
      //     ""
      //   ),
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

    // {
    //   title: "ACTION",
    //   dataIndex: "id",
    //   align: "center",
    //   width: 150,
    //   fixed: "right",
    //   render: (id, record, index) => {
    //     return (
    //       <div className="flex w-full justify-center gap-6">
    //         <Tooltip title="Detail">
    //           <div className="pt-1">
    //             <SVGIcon
    //               name="IconDetail"
    //               width={24}
    //               onClick={() => {
    //                 handleDetail(id);
    //               }}
    //             />
    //           </div>
    //         </Tooltip>

    //         <Tooltip title="Update">
    //           <div className="pt-1">
    //             {record.status === "ACTIVE" ? (
    //               <Link
    //                 to={PRODUCT_PROMO_ROUTES.UPDATE_TERM_OF_SERVICE}
    //                 state={{ id: id, status: record?.approvalStatus }}
    //               >
    //                 <SVGIcon name="IconEdit" width={24} />
    //               </Link>
    //             ) : (
    //               <div
    //                 className={
    //                   record.status === "INACTIVE" ? "cursor-not-allowed" : ""
    //                 }
    //               >
    //                 <SVGIcon
    //                   name="IconEdit"
    //                   width={24}
    //                   color={
    //                     record.status !== "INACTIVE" ? "#ACC424" : "#8D91A0"
    //                   }
    //                   className={
    //                     record.status === "INACTIVE" ? "disabled" : undefined
    //                   }
    //                 />
    //               </div>
    //             )}
    //           </div>
    //         </Tooltip>

    //         <Tooltip title={"Inactivate"}>
    //           <div className="pt-1">
    //             <Checkbox
    //               onClick={() => {
    //                 handleInactive(id);
    //               }}
    //               disabled={record.status === "ACTIVE" ? false : true}
    //               checked={record.status === "ACTIVE" ? false : true}
    //             />
    //           </div>
    //         </Tooltip>
    //       </div>
    //     );
    //   },
    // },
  ];

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Handle Confirmation Inactive
  const handleInactive = (id) => {
    setModalInactive(true);
    setChooseId(id);
  };

  // Handle Modal Detail
  const handleDetail = (id) => {
    setModalDetail(true);
    setChooseId(id);
  };

  // Handle Download
  const handleDownload = () => {
    // let tempSearch = "";
    // for (const dataIndex in search) {
    //   if (Object.hasOwnProperty.call(search, dataIndex)) {
    //     const tempSearchText = search[dataIndex];
    //     if (tempSearchText) {
    //       tempSearch += `${dataIndex}~${tempSearchText},`;
    //     }
    //   }
    // }
    // tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      downloadTOS({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      }),
    );
  };

  // handle Active/Inactive
  const handleOk = () => {
    dispatch(inactiveTos({ id: chooseId }))
      .unwrap()
      .then(() => {
        setModalInactive(false);
        // let tempSearch = "";
        // for (const dataIndex in search) {
        //   if (Object.hasOwnProperty.call(search, dataIndex)) {
        //     const tempSearchText = search[dataIndex];
        //     if (tempSearchText) {
        //       tempSearch += `${dataIndex}~${tempSearchText},`;
        //     }
        //   }
        // }
        // tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
        dispatch(
          getAllTosPaginate({
            search: encodeURIComponent(JSON.stringify(search)),
            sort,
            page,
            pageSize,
          }),
        );
      })
      .catch((error) => {
        if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            error?.toString();
          setBodyError({ message });
          setModalError(true);
        }
      });
  };

  const itemsActionView = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
          type="submit"
          onClick={handleDownload}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink
          to={PRODUCT_PROMO_ROUTES.CREATE_TERM_OF_SERVICE}
          state={{ x: 1 }}
        >
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Create Terms Of Service
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
            <div className="pt-1">
              <SVGIcon
                name="IconDetail"
                width={24}
                onClick={() => {
                  handleDetail(record?.id);
                }}
              />
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "Update",
      type: "table",
      render: (record, data_length) => {
        const isEditable = record?.status === "ACTIVE";

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
                <div
                  className={
                    record?.status === "INACTIVE" ? "cursor-not-allowed" : ""
                  }
                >
                  <SVGIcon
                    name="IconEdit"
                    width={24}
                    color={
                      record?.status !== "INACTIVE" ? "#ACC424" : "#8D91A0"
                    }
                    className={
                      record?.status === "INACTIVE" ? "disabled" : undefined
                    }
                  />
                </div>
              </div>
            </Tooltip>
          );

        return isEditable ? (
          <Link
            to={PRODUCT_PROMO_ROUTES.UPDATE_TERM_OF_SERVICE}
            state={{ id: record?.id, status: record?.approvalStatus }}
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
        const isActivateOrInactivate = record?.status === "ACTIVE";

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
            onClick={() => handleInactive(record?.id)}
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
                onClick={() => {
                  handleInactive(record?.id);
                }}
                disabled={record?.status === "ACTIVE" ? false : true}
                checked={record?.status === "ACTIVE" ? false : true}
              />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };
  const handleRetry = () => {
    handleOk();
    setModalError(false);
    setBodyError({});
  };

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        {/* <div className="flex w-full justify-end gap-3">
          <ButtonComponent
            icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
            type="submit"
            onClick={handleDownload}
          >
            Download List
          </ButtonComponent>
          <NavLink
            to={PRODUCT_PROMO_ROUTES.CREATE_TERM_OF_SERVICE}
            state={{ x: 1 }}
          >
            <ButtonComponent
              icon={<PlusOutlined style={{ fontSize: "24px" }} />}
              type="submit"
            >
              Create Terms Of Service
            </ButtonComponent>
          </NavLink>
        </div> */}
        <Toolbar items={itemsActionView} />
        <BaseContainer header={"TERMS OF SERVICE INFORMATION"}>
          <div className={"w-full"}>
            <TablePaginationNew
              dataSource={data?.result}
              columns={[
                ...columns,
                ...useColumnActionPermission(
                  ["view", "Update", "Activate"],
                  itemsActionView,
                ),
              ]}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              onSort={onSort}
              totalData={data?.page?.totalElements || 0}
              tableScrolled={{ y: 525, x: 1800 }}
            />
          </div>
        </BaseContainer>

        {/* Modal Detail TOS */}
        {chooseId !== "" ? (
          <TermOfServiceDetail
            openModal={modalDetail}
            closeModal={() => {
              setChooseId("");
              setModalDetail(false);
            }}
            id={chooseId}
          />
        ) : null}

        {/* Modal Detail Inactivate */}
        <TermOfServiceInactive
          isOpen={modalInactive}
          handleCancel={() => setModalInactive(false)}
          handleOk={() => handleOk()}
        />

        {/** Modal Retry */}
        <ModalError
          isOpen={modalError}
          handleOk={handleRetry}
          handleCancel={handleCloseModalError}
          customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your data was not inactivated. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </LayoutMenu>
  );
};

export default TermOfServiceView;
