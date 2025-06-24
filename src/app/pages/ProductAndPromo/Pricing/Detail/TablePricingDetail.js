import React, { useEffect, useRef, useState } from "react";
import { getColumnSearchProps } from "../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../components/StatusComponent";
import { Popover, Tooltip } from "antd";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import { Link } from "react-router-dom";
import { MoreOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { PRODUCT_PROMO_ROUTES } from "../../../../../routes/product_promo/pp_routes";
import TablePagination from "../../../../../components/TablePagination";
import Highlighter from "react-highlight-words";

const columns = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  updateSelectedData = () => {},
  selectPriceCodeAdjust
) => {
  const result = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CURRENCY",
      width: 160,
      sorter: true,
      dataIndex: "currency",
      ...getColumnSearchProps(
        "currency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "VALUE",
      width: 160,
      align: "right",
      sorter: true,
      dataIndex: "value",
      ...getColumnSearchProps(
        "value",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "UOM",
      width: 120,
      sorter: true,
      dataIndex: "uom",
      ...getColumnSearchProps(
        "uom",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "START DATE",
      width: 160,
      align: "center",
      sorter: true,
      dataIndex: "startDate",
      ...getColumnSearchProps(
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "END DATE",
      width: 160,
      align: "center",
      sorter: true,
      dataIndex: "endDate",
      ...getColumnSearchProps(
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "STATUS",
      width: 160,
      render: (index, record) => {
        const endDate = record?.endDate;
        const status = endDate
          ? moment(endDate, "DD MMM YYYY").diff(moment().add(-1, "days")) >= 0
            ? "ACTIVE"
            : "INACTIVE"
          : "ACTIVE";
        return (
          <div className={" flex justify-center"}>
            <StatusComponent colour={status}>{status}</StatusComponent>
          </div>
        );
      },
    },
    {
      title: "DESCRIPTIONS",
      width: 180,
      sorter: true,
      dataIndex: "description",
      ...getColumnSearchProps(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "description" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          "-"
        ),
    },
    {
      title: "ACTION",
      width: 120,
      align: "center",
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex justify-center align-middle gap-2">
            {selectPriceCodeAdjust === undefined ? (
              <Popover
                content={
                  <div>
                    <ButtonComponent
                      icon={<SVGIcon name="IconDetail" width={24} />}
                      border={false}
                      onClick={() => updateSelectedData(r)}
                    >
                      <span className={"text-black"}>Detail</span>
                    </ButtonComponent>
                    <Link
                      to={PRODUCT_PROMO_ROUTES.CREATE_PRICING_ADJUSTMENT}
                      state={{ id: r.priceCode, prevPage: "detail-pricing" }}
                    >
                      <ButtonComponent
                        icon={
                          <SVGIcon
                            name="IconActionCreate"
                            color={"#0075bf"}
                            width={24}
                          />
                        }
                        border={false}
                      >
                        <span className={"text-black"}>
                          Create Price Adjusment
                        </span>
                      </ButtonComponent>
                    </Link>
                    <ButtonComponent
                      icon={
                        <SVGIcon
                          name="IconCalendarEvent"
                          color={"#0075bf"}
                          width={24}
                        />
                      }
                      border={false}
                    >
                      <span className={"text-black"}>End Date History</span>
                    </ButtonComponent>
                  </div>
                }
                trigger={"click"}
                placement="bottomRight"
              >
                <ButtonComponent icon={<MoreOutlined />} border={false} />
              </Popover>
            ) : (
              <Tooltip title="Choose Detail">
                <span className="flex justify-center">
                  <PlusCircleOutlined
                    width={24}
                    onClick={() => selectPriceCodeAdjust(r)}
                    style={{ color: "#0075bf" }}
                  />
                </span>
              </Tooltip>
            )}
          </div>
        );
      },
      key: "action",
    },
  ];

  return selectPriceCodeAdjust === undefined
    ? result
    : result.filter((col) => col.title !== "STATUS");
};
const TablePricingDetail = ({
  id = 0,
  getAPI = () => {},
  selector = "pricing",
  updateSelectedData = () => {},
  selectPriceCodeAdjust,
}) => {
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const { dataListPricingDetail } = useSelector((state) => state[selector]);
  useEffect(() => {
    if (id !== 0) {
      dispatch(getAPI({ id, page, pageSize, search, sort }));
    }
  }, [id, page, pageSize, search, sort]);

  useEffect(() => {
    if (dataListPricingDetail && dataListPricingDetail.result) {
      const data = (dataListPricingDetail.result || []).map((priceData) => ({
        ...priceData,
        currency: priceData.currency,
        uom: priceData.uom,
        startDate: priceData.startDate
          ? moment(priceData.startDate, "DD-MM-YYYY").format("DD MMM YYYY")
          : undefined,
        endDate: priceData.endDate
          ? moment(priceData.endDate, "DD-MM-YYYY").format("DD MMM YYYY")
          : undefined,
        type: "exist",
      }));
      const totalData = dataListPricingDetail.page.totalElements;
      setDataTable(data);
      setTotalElement(totalData);
    }
  }, [dataListPricingDetail]);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch(selectedKeys[0] ? `${dataIndex}~${selectedKeys[0]}` : "");
  };
  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };
  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };
  return (
    <div className="flex flex-col w-full gap-3">
      <TablePagination
        dataSource={dataTable}
        totalData={totalElements}
        current={page}
        pageSize={pageSize}
        tableScrolled={{ y: 300, x: 1500 }}
        onChange={handleChangeSize}
        onSort={onSort}
        columns={columns(
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          updateSelectedData,
          selectPriceCodeAdjust
        )}
      />
    </div>
  );
};

export default TablePricingDetail;
