import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spin, Form, Checkbox, Tooltip } from "antd";
import Highlighter from "react-highlight-words";
import { Link, NavLink, useLocation } from "react-router-dom";

import StatusComponent from "../../../../../../components/StatusComponent";
import { useState } from "react";
import TablePagination from "../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../assets/Icon/index";
import BaseContainer from "../../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import ModalDetailAccountAddress from "./ModalDetailAccountAddress";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import {
  getListDetailAccountAddress,
  activationAccountAddress,
  getDetailAddress,
} from "../../../../../../redux/slices/account_management/detailAccount/accountAddressSlice";
import { PlusOutlined } from "@ant-design/icons";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";
import { useColumnActionPermissionAccount } from "../../../ComponentAccount/ColumnActionPermissionAccount";
import ToolbarAccount from "../../../ComponentAccount/ToolbarAccount";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";

const AccountAddress = ({ id, idCustomer, type }) => {
  const dispatch = useDispatch();
  const { data, data_detail, loading } = useSelector(
    (state) => state.accountAddress,
  );
  const { access_account } = useSelector((state) => state.accountManagement);
  const dataDetail = data_detail?.data;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [modalDetail, setModalDetail] = useState(false);
  const [modalActivate, setModalActivate] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [titleActiveOrInactive, setTitleActiveOrInactive] = useState("");
  const [chooseId, setChooseId] = useState();
  const [addressName, setAddressName] = useState("");
  const [form] = Form.useForm();
  const location = useLocation();

  // Use Effect
  // useEffect(() => {
  //   dispatch(getListDetailAccountAddress({ id, search, sort, page, pageSize }));
  // }, [id, search, sort, page, pageSize]);

  useEffect(() => {
    if (location?.pathname.includes("account-standard")) {
      dispatch(
        getGrantedAccessAccount("/account-management/account-standard/address"),
      );
    } else {
      dispatch(
        getGrantedAccessAccount("/account-management/account-onetime/address"),
      );
    }
  }, [dispatch]);

  useEffect(() => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(
      getListDetailAccountAddress({
        id,
        search: reqSearch,
        sort,
        page,
        pageSize,
      }),
    );
  }, [dispatch, id, page, pageSize, search, sort]);

  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    if (!selectedKeys[0]) {
      setSearchText("");
      setSearchedColumn("");
      setSearch((prevState) => {
        if (prevState[dataIndex]) {
          setPage(1); // Reset the page only if there was a previous search
        }
        const { [dataIndex]: _, ...rest } = prevState; // Remove the current dataIndex from state
        return rest;
      });
      return;
    }

    if (dataIndex !== "primary" && dataIndex !== "premise") {
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
    } else {
      // Map "primary" and "non primary" to the required structure
      const tempSearchedText =
        selectedKeys[0] === "primary"
          ? "Y"
          : selectedKeys[0] === "non primary"
            ? "N"
            : ""; // Handle cases where selectedKeys[0] is not valid

      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
      setSearch((prevState) => {
        if (prevState[dataIndex]?.value !== tempSearchedText?.value) {
          setPage(1);
        }
        return {
          ...prevState,
          [dataIndex]: tempSearchedText,
        };
      });
    }
  };

  // Handle Confirmation Active/Inactive
  const handleActiveOrInactive = (record) => {
    setModalActivate(true);
    setTitleActiveOrInactive(
      record?.status === "ACTIVE" ? "Inactivate" : "Activate",
    );
    setChooseId(record?.accountAddressId);
  };

  // Handle submit Activate Address
  const handleConfirmActivation = async (formValue, handleClear) => {
    setModalActivate(false);
    const data = { remarks: formValue.remark, id: chooseId };
    dispatch(
      activationAccountAddress({
        body: data,
        title: titleActiveOrInactive,
      }),
    )
      .unwrap()
      .then(() => {
        // form.resetFields();
        handleClear();

        const reqSearch = encodeURIComponent(JSON.stringify(search));
        dispatch(
          getListDetailAccountAddress({
            id,
            search: reqSearch,
            sort,
            page,
            pageSize,
          }),
        );
      })
      .catch(() => {
        form.resetFields();
      });
  };

  // Handle Cancel Modal Active/Inactive
  const handleCancel = () => {
    setModalActivate(false);
    form.resetFields();
  };

  const columns = (
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => {},
  ) => {
    return [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "PRIMARY",
        dataIndex: "primary",
        width: 150,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "primary",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (index) => {
          let text;
          switch (index?.bool) {
            case true:
              text = "Primary";
              break;
            case false:
              text = "Non Primary";
              break;
            default:
              text = index
                ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
                : index;
              break;
          }
          return text ? (
            <div className={"flex justify-center"}>
              <StatusComponent colour={text}>{text}</StatusComponent>
            </div>
          ) : (
            text
          );
        },
      },
      {
        title: "ADDRESS",
        dataIndex: "fullAddress",
        width: 350,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "fullAddress",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        ellipsis: {
          showTitle: false,
        },
        // render: (fullAddress) => (
        //   <Tooltip placement="topLeft" title={fullAddress}>
        //     <p className="overflow-hidden truncate">{fullAddress}</p>
        //   </Tooltip>
        // ),
        render: (text) =>
          searchedColumn === "fullAddress" ? (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          ) : text ? (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ) : (
            ""
          ),
      },
      {
        title: "TYPE",
        dataIndex: "type",
        width: 150,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "type",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        // render: (type) => <>{type?.name}</>,
        render: (type) =>
          searchedColumn === "type" ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={type ? type?.name.toString() : ""}
            />
          ) : type ? (
            <>{type?.name}</>
          ) : (
            ""
          ),
      },
      {
        title: "BUILDING",
        dataIndex: "building",
        width: 350,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "building",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        ellipsis: {
          showTitle: false,
        },
        // render: (building) => (
        //   <Tooltip placement="topLeft" title={building}>
        //     <p>{building}</p>
        //   </Tooltip>
        // ),
        render: (text) =>
          searchedColumn === "building" ? (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          ) : text ? (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ) : (
            ""
          ),
      },
      {
        title: "FLOOR",
        dataIndex: "floor",
        width: 150,
        sorter: true,
        align: "right",
        ...getColumnSearchPropsPaging(
          "floor",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "HOUSE NAME",
        dataIndex: "houseName",
        width: 250,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "houseName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "STREET NAME",
        dataIndex: "streetName",
        width: 250,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "streetName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "BLOCK",
        dataIndex: "block",
        width: 250,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "block",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "HOUSE NUMBER",
        dataIndex: "houseNumber",
        width: 250,
        sorter: true,
        align: "right",
        ...getColumnSearchPropsPaging(
          "houseNumber",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "RT",
        dataIndex: "rt",
        width: 150,
        sorter: true,
        align: "right",
        ...getColumnSearchPropsPaging(
          "rt",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "RW",
        dataIndex: "rw",
        width: 150,
        sorter: true,
        align: "right",
        ...getColumnSearchPropsPaging(
          "rw",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "ADDITIONAL NOTE",
        dataIndex: "additionalNote",
        width: 250,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "additionalNote",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "POSTAL CODE",
        dataIndex: "postalCode",
        width: 250,
        sorter: true,
        align: "right",
        ...getColumnSearchPropsPaging(
          "postalCode",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        // render: (postalCode) => <>{postalCode?.name}</>,
        render: (postalCode) =>
          searchedColumn === "postalCode" ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={postalCode ? postalCode?.name.toString() : ""}
            />
          ) : postalCode ? (
            <>{postalCode?.name}</>
          ) : (
            ""
          ),
      },
      {
        title: "SUBDISTRICT",
        dataIndex: "subDistrict",
        width: 250,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "subDistrict",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        // render: (subDistrict) => <>{subDistrict?.name}</>,
        render: (subDistrict) =>
          searchedColumn === "subDistrict" ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={subDistrict ? subDistrict?.name.toString() : ""}
            />
          ) : subDistrict ? (
            <>{subDistrict?.name}</>
          ) : (
            ""
          ),
      },
      {
        title: "DISTRICT",
        dataIndex: "district",
        width: 250,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "district",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        // render: (district) => <>{district?.name}</>,
        render: (district) =>
          searchedColumn === "district" ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={district ? district?.name.toString() : ""}
            />
          ) : district ? (
            <>{district?.name}</>
          ) : (
            ""
          ),
      },
      {
        title: "CITY",
        dataIndex: "city",
        width: 250,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "city",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        // render: (city) => <>{city?.name}</>,
        render: (city) =>
          searchedColumn === "city" ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={city ? city?.name.toString() : ""}
            />
          ) : city ? (
            <>{city?.name}</>
          ) : (
            ""
          ),
      },
      {
        title: "PROVINCE",
        dataIndex: "province",
        width: 250,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "province",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        // render: (province) => <>{province?.name}</>,
        render: (province) =>
          searchedColumn === "province" ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={province ? province?.name.toString() : ""}
            />
          ) : province ? (
            <>{province?.name}</>
          ) : (
            ""
          ),
      },
      {
        title: "COUNTRY",
        dataIndex: "country",
        width: 250,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "country",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        // render: (country) => <>{country?.name}</>,\
        render: (country) =>
          searchedColumn === "country" ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={country ? country?.name.toString() : ""}
            />
          ) : country ? (
            <>{country?.name}</>
          ) : (
            ""
          ),
      },
      {
        title: "DESCRIPTION",
        dataIndex: "description_mAddress",
        width: 350,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "description_mAddress",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        // render: (desc) => (
        //   <Tooltip placement="topLeft" title={desc}>
        //     <p className="overflow-hidden truncate">{desc}</p>
        //   </Tooltip>
        // ),
        render: (text) =>
          searchedColumn === "description_mAddress" ? (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          ) : text ? (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ) : (
            ""
          ),
      },
      {
        title: "BUSINESS PURPOSE",
        dataIndex: "businessPurpose",
        width: 350,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "businessPurpose",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (businessPurpose) => (
          <div className={" flex justify-center"}>
            {businessPurpose?.map((item, idx) => (
              <div className="mx-1" key={idx}>
                <StatusComponent colour={"main"}>
                  {item?.name.replace("_", " ")}
                </StatusComponent>
              </div>
            ))}
          </div>
        ),
      },
      {
        title: "PREMISE",
        dataIndex: "premise",
        width: 150,
        sorter: true,
        align: "center",
        ...getColumnSearchPropsPaging(
          "premise",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        // render: (premise) => <>{premise.value}</>,
        render: (premise) =>
          searchedColumn === "premise" ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={premise ? premise?.value.toString() : ""}
            />
          ) : premise ? (
            <>{premise?.value}</>
          ) : (
            ""
          ),
      },
      {
        title: "REMARK",
        dataIndex: "description_accountAddress",
        width: 350,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "description_accountAddress",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        ellipsis: {
          showTitle: false,
        },
        // render: (desc) => (
        //   <Tooltip placement="topLeft" title={desc}>
        //     <p className="overflow-hidden truncate">{desc}</p>
        //   </Tooltip>
        // ),
        render: (text) =>
          searchedColumn === "description_accountAddress" ? (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          ) : text ? (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          ) : (
            ""
          ),
      },
      {
        title: "STATUS",
        dataIndex: "status",
        fixed: "right",
        width: 150,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "status",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (index) => {
          const text = index
            ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
            : index;
          return text ? (
            <div className={" flex justify-center"}>
              <StatusComponent colour={index}>{text}</StatusComponent>
            </div>
          ) : (
            text
          );
        },
      },
      // {
      //   title: "ACTION",
      //   align: "center",
      //   width: 150,
      //   fixed: "right",
      //   render: (v, r, i) => {
      //     return (
      //       <div className="flex w-full justify-center gap-6">
      //         <Tooltip title="Detail">
      //           <div className="pt-1">
      //             <SVGIcon
      //               name="IconDetail"
      //               color={"#0075bf"}
      //               width={24}
      //               onClick={() => {
      //                 setModalDetail(true);
      //                 dispatch(getDetailAddress(r?.accountAddressId));
      //               }}
      //             />
      //           </div>
      //         </Tooltip>
      //         <Tooltip title="Update">
      //           {r.status === "ACTIVE" ? <Link
      //             to={
      //               type === "standard" ? ACCOUNT_MANAGEMENT_ROUTES.UPDATE_ACCOUNT_ADDRESS : ACCOUNT_MANAGEMENT_ROUTES.UPDATE_ACCOUNT_ADDRESS_ONETIME
      //             }
      //             state={{
      //               accountId: id,
      //               isCreate: false,
      //               addressId: r?.addressId,
      //               idCustomer: idCustomer,
      //               type: type,
      //               accountAddressId: r.accountAddressId
      //             }}
      //             >
      //             <div
      //               className={`flex justify-center pt-1${
      //                 r.status === "INACTIVE" ? " cursor-not-allowed" : ""
      //               }`}
      //             >
      //                <SVGIcon
      //                 name="IconEdit"
      //                 width={24}
      //                 className={r.status === "INACTIVE" ? "disabled" : undefined}
      //                 color={r?.status === "INACTIVE" ? "#8D91A0" : "#ACC424"}
      //               />
      //             </div>
      //           </Link> : (
      //             <div
      //               className={`flex justify-center pt-1${
      //               r.status === "INACTIVE" ? " cursor-not-allowed" : ""
      //             }`}
      //             >
      //              <SVGIcon
      //               name="IconEdit"
      //               width={24}
      //               className={r.status === "INACTIVE" ? "disabled" : undefined}
      //               color={r?.status === "INACTIVE" ? "#8D91A0" : "#ACC424"}
      //               />
      //             </div>
      //           )}
      //         </Tooltip>
      //         <Tooltip title={r.status == "ACTIVE" ? "Inactivate" : "Activate"}>
      //           <div className="pt-1">
      //           <Checkbox
      //             onClick={() => {
      //               setModalActivate(true);
      //               handleActiveOrInactive(r);
      //               setAddressName(r.fullAddress)
      //             }}
      //             checked={r.status == "INACTIVE" ? true : false}
      //           />
      //           </div>
      //         </Tooltip>
      //       </div>
      //     );
      //   },
      // },
    ];
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const itemActions = [
    //action toolbar
    {
      action: "Create",
      render: (
        <NavLink
          to={
            type === "standard"
              ? ACCOUNT_MANAGEMENT_ROUTES.CREATE_ACCOUNT_ADDRESS
              : ACCOUNT_MANAGEMENT_ROUTES.CREATE_ACCOUNT_ADDRESS_ONETIME
          }
          state={{
            accountId: id,
            isCreate: true,
            idCustomer: idCustomer,
            type: type,
          }}
        >
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Create Address
          </ButtonComponent>
        </NavLink>
      ),
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
                  setModalDetail(true);
                  dispatch(getDetailAddress(record?.accountAddressId));
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
      render: (record, data) => {
        return (
          <Tooltip title="Update">
            {record?.status === "INACTIVE" ? (
              <div className={"cursor-not-allowed pt-1"}>
                <SVGIcon
                  name="IconEdit"
                  width={24}
                  color={"#C0BEC6"}
                  className={"cursor-not-allowed"}
                />
              </div>
            ) : (
              <Link
                to={
                  type === "standard"
                    ? ACCOUNT_MANAGEMENT_ROUTES.UPDATE_ACCOUNT_ADDRESS
                    : ACCOUNT_MANAGEMENT_ROUTES.UPDATE_ACCOUNT_ADDRESS_ONETIME
                }
                state={{
                  accountId: id,
                  isCreate: false,
                  addressId: record?.addressId,
                  idCustomer: idCustomer,
                  type: type,
                  accountAddressId: record.accountAddressId,
                }}
              >
                <div className="pt-1">
                  <SVGIcon name="IconEdit" width={24} />
                </div>
              </Link>
            )}
          </Tooltip>
        );
      },
    },

    {
      action: "Activate",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip
            title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}
          >
            <div className="pt-1">
              <Checkbox
                onClick={() => {
                  setModalActivate(true);
                  handleActiveOrInactive(record);
                  setAddressName(record.fullAddress);
                }}
                checked={record.status === "ACTIVE" ? false : true}
              />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <>
      <Spin spinning={loading}>
        <BaseContainer header={"ACCOUNT ADDRESS LIST"}>
          <div className="flex w-full justify-end gap-3 mb-5">
            <ToolbarAccount
              items={itemActions}
              advancedAccess={access_account}
            />
          </div>

          {/* <div className="flex w-full justify-end gap-3 mb-5">
            <Link
              to={type === "standard" ? ACCOUNT_MANAGEMENT_ROUTES.CREATE_ACCOUNT_ADDRESS : ACCOUNT_MANAGEMENT_ROUTES.CREATE_ACCOUNT_ADDRESS_ONETIME}
              state={{
                accountId: id,
                isCreate: true,
                idCustomer: idCustomer,
                type: type,
              }}
            >
              <ButtonComponent
                icon={
                  <SVGIcon
                    name="IconButtonCreate"
                    color={"#FFFFFF"}
                    width={24}
                  />
                }
                type="submit"
              >
                Create
              </ButtonComponent>
            </Link>
          </div> */}
          <div className={"w-full"}>
            <TablePagination
              dataSource={data?.result}
              totalData={data?.page?.totalElements}
              current={page}
              pageSize={pageSize}
              onChange={handleChangeSize}
              tableScrolled={{ y: 525, x: 1300 }}
              onSort={onSort}
              columns={[
                ...columns(
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch,
                ),
                ...useColumnActionPermissionAccount(
                  ["Activate", "View", "Update"],
                  itemActions,
                  access_account,
                ),
              ]}
            />
          </div>
        </BaseContainer>
      </Spin>

      {/* Modal Detail Address */}
      <ModalDetailAccountAddress
        isOpen={modalDetail}
        closeModal={setModalDetail}
        dataDetail={dataDetail}
      />

      {/* Modal Activate */}
      <ModalApproveOrReject
        isOpen={modalActivate}
        handleCloseModal={handleCancel}
        onFinish={handleConfirmActivation}
        header={titleActiveOrInactive}
        approveOrReject={titleActiveOrInactive}
        menu={"Address"}
        named={addressName}
      />
      {/* <ModalActivateAddress
        form={form}
        isOpen={modalActivate}
        header={titleActiveOrInactive}
        activeOrInactive={titleActiveOrInactive}
        handleCancel={() => handleCancel()}
        handleCancelFooter={() => handleCancel()}
        handleConfirmFooter={handleConfirmActivation}
      /> */}
    </>
  );
};

export default AccountAddress;
