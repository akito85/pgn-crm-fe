import React, { useState, useEffect, useRef } from "react";
import { Spin, Input, Tooltip, Space, Checkbox, Alert } from "antd";
import { FilterOutlined, WarningOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import {
  downloadProductClass,
  getAllProductClassPaginate,
  getDetailProductClass,
  inactiveProductClass,
} from "../../../../redux/slices/product_promo/ProductClass/ProductClassSlice";
import SVGIcon from "../../../../assets/Icon/index";
import ButtonComponent from "../../../../components/ButtonComponent";
import BaseContainer from "../../../../components/BaseContainer";
import {
  ModalConfirm,
  ModalError,
} from "../../../../components/Modal/ModalPopUp";
import ProductClassDetail from "./ProductClassDetail";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn } from "../../../../utils";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";

const ProductClassView = () => {
  // Selector
  const { data, data_detail, loading } = useSelector(
    (state) => state.productClass,
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data?.result;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [modalDetail, setModalDetail] = useState(false);
  const [chooseId, setChooseId] = useState("");
  const [modalInactive, setModalInactive] = useState(false);
  const [activeOrInactive, setActiveOrInactive] = useState("");
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

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
      getAllProductClassPaginate({ search: tempSearch, sort, page, pageSize }),
    );
  }, [search, sort, page, pageSize]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Product & Promo",
    },
    {
      path: PRODUCT_PROMO_ROUTES.VIEW_PRODUCT_CLASS,
      breadcrumbName: "Product Class",
    },
  ];

  // Search Column Table
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
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
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
        setTimeout(() => searchInput.current?.select(), 100);
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

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
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
    dispatch(
      downloadProductClass({ search: tempSearch, page, pageSize, sort }),
    );
  };

  // Handle Confirmation Active/Inactive
  const handleActiveOrInactive = (record) => {
    setModalInactive(true);
    setChooseId(record?.productClassId);
    setActiveOrInactive(record?.status);
  };

  // handle Active/Inactive
  const handleOk = () => {
    dispatch(
      inactiveProductClass({
        id: chooseId,
        activeOrInactive:
          activeOrInactive === "ACTIVE" ? "Inactivated" : "Activated",
      }),
    )
      .unwrap()
      .then(() => {
        setModalInactive(false);
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
          getAllProductClassPaginate({
            page,
            pageSize,
            search: tempSearch,
            sort,
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

  // Column
  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      sorter: true,
      title: "NAME",
      dataIndex: "name",
      key: "name",
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
      sorter: true,
      title: "DESCRIPTION",
      dataIndex: "description",
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

      // render: (text) => {
      //   if (searchedColumn === "description") {
      //     return (
      //       <Tooltip placement="topLeft" title={text}>
      //         <Highlighter
      //           highlightStyle={{
      //             backgroundColor: "#ffc069",
      //             padding: 0,
      //           }}
      //           searchWords={[searchText]}
      //           autoEscape
      //           textToHighlight={text ? text.toString() : ""}
      //         />
      //       </Tooltip>
      //     );
      //   } else {
      //     if (text) {
      //       return (
      //         <Tooltip placement="topLeft" title={text}>
      //           {text}
      //         </Tooltip>
      //       );
      //     }
      //     return "";
      //   }
      // },
    },
    {
      sorter: true,
      title: "STATUS",
      dataIndex: "status",
      fixed: "right",
      width: 160,
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
          case "WAITING_FOR_APPROVAL":
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
              searchedColumn,
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
    //   dataIndex: "productClassId",
    //   width: 120,
    //   align: "center",
    //   fixed: "right",
    //   render: (id, record) => {
    //     return (
    //       <div className="flex w-full justify-center gap-6">
    //         <Tooltip title="Detail">
    //           <div className="pt-1">
    //             <SVGIcon
    //               name="IconDetail"
    //               width={24}
    //               onClick={() => {
    //                 dispatch(getDetailProductClass(id));
    //                 setModalDetail(true);
    //               }}
    //             />
    //           </div>
    //         </Tooltip>

    //         <Tooltip title="Update">
    //           <div className="pt-1">
    //             {record.status === "ACTIVE" ? (
    //               <Link
    //                 to={PRODUCT_PROMO_ROUTES.UPDATE_PRODUCT_CLASS}
    //                 state={{ id: id }}
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

    //         <Tooltip
    //           title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}
    //         >
    //           <div className="pt-1">
    //             <Checkbox
    //               onClick={() => {
    //                 handleActiveOrInactive(record);
    //               }}
    //               checked={record.status !== "ACTIVE"}
    //             />
    //           </div>
    //         </Tooltip>
    //       </div>
    //     );
    //   },
    // },
  ];

  const itemsActionView = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonDownload" width={24} />}
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
        <NavLink to={PRODUCT_PROMO_ROUTES.CREATE_PRODUCT_CLASS}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create Product Class
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
                  dispatch(getDetailProductClass(record?.productClassId));
                  setModalDetail(true);
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
        const render =
          data_length > 3 ? (
            <ButtonComponent
              icon={<SVGIcon name="IconEdit" color="#0075bf" width={24} />}
              border={false}
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
                  color={record?.status !== "INACTIVE" ? "#ACC424" : "#8D91A0"}
                  className={
                    record?.status === "INACTIVE" ? "disabled" : undefined
                  }
                />
              </div>
            </Tooltip>
          );

        return record?.status !== "INACTIVE" ? (
          <Link
            to={PRODUCT_PROMO_ROUTES.UPDATE_PRODUCT_CLASS}
            state={{ id: record?.productClassId }}
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

        {/* <div className="w-full flex justify-end gap-[20px]">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonDownload" width={24} />}
            type="submit"
            onClick={handleDownload}
          >
            Download List
          </ButtonComponent>

          <NavLink to={PRODUCT_PROMO_ROUTES.CREATE_PRODUCT_CLASS}>
            <ButtonComponent
              icon={<SVGIcon name="IconButtonCreate" width={24} />}
              type="submit"
            >
              Create Product Class
            </ButtonComponent>
          </NavLink>
        </div> */}
        <Toolbar items={itemsActionView} />

        <BaseContainer header={"product class list"}>
          <div className="w-full">
            <TablePaginationNew
              dataSource={dataSource}
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
              onShowSizeChange={handleChange}
              tableScrolled={{
                x: 1000,
                y: 300,
              }}
              onSort={onSort}
              totalData={data?.page?.totalElements || 0}
            />
          </div>
        </BaseContainer>

        {/* Modal Detail */}
        <ProductClassDetail
          data_detail={data_detail}
          openModal={modalDetail}
          closeModal={() => setModalDetail(false)}
        />

        {/* Modal Confirmation Inactive */}
        <ModalConfirm
          isOpen={modalInactive}
          handleCancel={() => setModalInactive(false)}
          handleOk={handleOk}
          width={activeOrInactive === "ACTIVE" ? 600 : 400}
          useOk={true}
        >
          <div className="flex justify-center gap-[20px] mt-6">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className={"text-[18px] font-bold"}>
              {`Are you sure want to ${
                activeOrInactive === "ACTIVE" ? "inactivate" : "activate"
              } ?`}
            </p>
          </div>
          {activeOrInactive === "ACTIVE" ? (
            <Alert
              message="Warning! if you inactivate this data, it can't be used."
              type={"error"}
            />
          ) : null}
        </ModalConfirm>

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

export default ProductClassView;
