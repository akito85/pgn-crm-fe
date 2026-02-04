import { useEffect, useMemo, useRef, useState } from "react";

import { Form, Button, Tooltip, Input, DatePicker } from "antd";

import InputComponent from "../../../../../../../../../components/InputComponent";
import NxPanel from "../../../../../../../../../components/Nx/NxPanel";
import { dateFormatting, requiredMessage } from "../../../../../../../../../utils";

import moment from "moment";
import DateComponent from "../../../../../../../../../components/DateComponent";
import { useDispatch, useSelector } from "react-redux";
// import TablePaginationNew from "../../../../../../../../../components/TablePaginationNew";
import NxModal from "../../../../../../../../../components/Nx/NxModal";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../../../../../../components/Nx/NxTable";
import { getMdAccountStandard } from "../../../../../../../../../redux/slices/account_management/detailAccount/MultiDestinationSlice";
import { getAccountStandardColumns } from "./getAccountStandardColumns";
import NxCardContainer from "../../../../../../../../../components/Nx/NxCardContainer";

export default function InfoMultiDestination({
  accountId,
  setAccount,
  className,
}) {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
                                                                                                                                                                                                                                                                                                                                      
  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  const [isOpen, setIsOpen] = useState(false);
  
  const { list_mdAccountStandard, pagination_mdAccountStandard } = useSelector(
    (state) => state.multiDestination
  );
  
  const handleOk = () => {
    console.log("ok")
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

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

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = pagination_mdAccountStandard?.totalPages || 0;

    if (nextPage <= totalPages) {
      await dispatch(
        getMdAccountStandard({
          searchs: JSON.stringify(search),
          page: nextPage,
          size: loadMoreSize,
          sort,
          isLoadMore: true,
          id: accountId,
        })
      );
    }
    setPage(nextPage);
  };

  useEffect(() => {
    dispatch(getMdAccountStandard({
      page,
      size: loadMoreSize,
      sort,
      searchs: JSON.stringify(search),
      id: accountId,
      isLoadMore: false,
    }));
  }, [ sort, search ]);

  const baseColumns = useMemo(() =>
    getAccountStandardColumns(
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      setAccount,
      setIsOpen
    ),
  [search, searchText, searchedColumn]);
  
  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);
  
  const currentData = useMemo(() => list_mdAccountStandard, [list_mdAccountStandard]);

  const hasMore = currentData.length < (pagination_mdAccountStandard?.totalElements || 0);

  useEffect(() => {
    console.log("hasMore", hasMore);
  }, [hasMore])

  const dataSourceWithKeys = useMemo(() => {
    if (!currentData || currentData.length === 0) return [];

    return currentData.map((item, index) => ({
      ...item,
      key: `${item.id}-${index}`,
    }));
  }, [currentData]);

  return(
    <div className={className}>
      <NxCardContainer header={"MULTI DESTINATION INFORMATION"} removeBottomMargin>
        <div className="w-full grid grid-cols-3 gap-4 mb-4">
          <div className="flex gap-2 items-end">
            <Form.Item name={"objectId"} hidden>
              <Input />
            </Form.Item>

            <Form.Item
              key="account"
              name={"account"}
              label={"Account"}
              className="no-margin-form"
              rules={[
                {
                  message: requiredMessage("Account"),
                  required: true,
                }
              ]}
            >
              <InputComponent disabled />
            </Form.Item>
            <Button
              type="primary"
              className="h-9 px-4 justify-center items-center"
              style={{
                backgroundColor: "#0075bf",
                borderColor: "#0075bf",
                borderRadius: "5px",
                minWidth: "112px",
              }}
              onClick={() => {
                // Add your select logic here
                setIsOpen(true)
              }}
            >
              Select
            </Button>
          </div>

          <Form.Item
            key="accountSor"
            name={"accountSor"}
            label={"Account SOR"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("Account SOR"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="accountCostCenter"
            name={"accountCostCenter"}
            label={"Account Cost Center"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("Account Cost Center"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="meterReadingCode"
            name={"meterReadingCode"}
            label={"Meter Reading Code"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("Meter Reading Code"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="accountSegment"
            name={"accountSegment"}
            label={"Account Segment"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("Account Segment"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="accountGroupType"
            name={"accountGroupType"}
            label={"Account Group Type"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("Account Group Type"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="accountType"
            name={"accountType"}
            label={"Account Type"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("Account Type"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="premiseAddress"
            name={"premiseAddress"}
            label={"Premise Address"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("Premise Address"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="subDistrict"
            name={"subDistrict"}
            label={"Subdistrict"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("Subdistrict"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="district"
            name={"district"}
            label={"District"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("District"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="city"
            name={"city"}
            label={"City"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("City"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="country"
            name={"country"}
            label={"Country"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("Country"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="longitude"
            name={"longitude"}
            label={"Longitude"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("Longitude"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="latitude"
            name={"latitude"}
            label={"Latitude"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("Latitude"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>
        </div>

        <div className="w-full grid grid-cols-3 gap-4">
          <Form.Item
            key="startDate"
            name={"startDate"}
            label={"Start Date"}
            rules={[
              {
                message: requiredMessage("Start Date"),
                required: true,
              },
            ]}
            className="no-margin-form"
            getValueProps={(dateString) => ({
              value: dateString ? moment(dateString, dateFormatting.date) : null
            })}
          >
            <DateComponent />
          </Form.Item>

          <Form.Item
            key="endDate"
            name={"endDate"}
            label={"End Date"}
            className="no-margin-form"
            getValueProps={(dateString) => ({
              value: dateString ? moment(dateString, dateFormatting.date) : null
            })}
          >
            <DateComponent />
          </Form.Item>
        </div>

        <div className="w-full my-5">
          <Form.Item
            key="description"
            name={"description"}
            label={"Description"}
            className="no-margin-form"
          >
            <InputComponent
              type={"textarea"}
              rows={4}
              placeholder="Asset meter baru PGN"
              maxLength={255}
            />
          </Form.Item>
        </div>
      </NxCardContainer>

      <NxModal
        isOpen={isOpen}
        handleCancel={handleCancel}
        handleOk={handleOk}
        header={"CHOOSE ACCOUNT"}
        width={1100}
        type={"confirmation"}
        footer={[
          <Button key="close" onClick={handleClose} type="menu">
            Close
          </Button>,
        ]}
      >
        <div className="p-4">
          <NxBaseContainer border>
            <NxTable
              idTable="multi-destination-account-standard"
              dataSource={dataSourceWithKeys}
              totalData={pagination_mdAccountStandard.totalElements || 0}
              current={page}
              tableScrolled={{ y: 525, x: 3000 }}
              onSort={onSort}
              columns={allColumns}
              usePagination={false}
              useInfiniteScroll
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              loadMoreThreshold={20}
              columnDefinitions={columnDefinitions}
            />
          </NxBaseContainer>
        </div>
      </NxModal>
    </div>
  )
}
