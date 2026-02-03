import { useEffect, useMemo, useRef, useState } from "react";

import { Form, Button, Input } from "antd";

import InputComponent from "../../../../../../../../../../components/InputComponent";
import ModalCustom from "../../../../../../../../../../components/Modal/ModalCustom";
import { dateFormatting, requiredMessage } from "../../../../../../../../../../utils";

import moment from "moment";
import DateComponent from "../../../../../../../../../../components/DateComponent";
import { getPrAccountStandard } from "../../../../../../../../../../redux/slices/account_management/detailAccount/PaymentRelationSlice";
import { useDispatch, useSelector } from "react-redux";
import CardContainer from "../../../../../../../../../../components/CardContainer";
import NxTable from "../../../../../../../../../../components/Nx/NxTable";
import { getAccountStandardColumns } from "./getAccountStandardColumns";
import NxCardContainer from "../../../../../../../../../../components/Nx/NxCardContainer";

export default function InfoPaymentRelation({
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
  
  const { list_prAccountStandard, pagination_prAccountStandard } = useSelector(
    (state) => state.paymentRelation
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
    const totalPages = pagination_prAccountStandard?.totalPages || 0;

    if (nextPage <= totalPages) {
      await dispatch(
        getPrAccountStandard({
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
    dispatch(getPrAccountStandard({
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
  
  const currentData = useMemo(() => list_prAccountStandard, [list_prAccountStandard]);
  
  const currentPagination = pagination_prAccountStandard;
  const hasMore = currentData.length < (currentPagination?.totalElements || 0);

  const dataSourceWithKeys = useMemo(() => {
    if (!currentData || currentData.length === 0) return [];

    return currentData.map((item, index) => ({
      ...item,
      key: `${item.id}-${index}`,
    }));
  }, [currentData]);

  return(
    <div className={className}>
      <NxCardContainer header={"PAYMENT RELATION INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-4">
          <div className="flex gap-2 items-end">
            <Form.Item name={"objectId"} hidden>
              <Input />
            </Form.Item>

            <Form.Item
              label={"Account Number"}
              required
              className="no-margin-form"
            >
              <Input.Group compact>
                <Form.Item
                  key="accountNumber"
                  name={"accountNumber"}
                  rules={[
                    {
                      message: requiredMessage("Account Number"),
                      required: true,
                    }
                  ]}
                  noStyle
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
              </Input.Group>
            </Form.Item>
          </div>

          <Form.Item
            key="accountName"
            name={"accountName"}
            label={"Account Name"}
            className="no-margin-form"
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="priority"
            name={"priority"}
            label={"Priority"}
            rules={[
              {
                message: requiredMessage("Priority"),
                required: true,
              },
            ]}
            className="no-margin-form"
          >
            <InputComponent />
          </Form.Item>

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
            getValueProps={(dateString) => ({
              value: dateString ? moment(dateString, dateFormatting.dateForm) : null
            })}
            className="no-margin-form"
          >
            <DateComponent />
          </Form.Item>

          <Form.Item
            key="endDate"
            name={"endDate"}
            label={"End Date"}
            className="no-margin-form"
            getValueProps={(dateString) => ({
              value: dateString ? moment(dateString, dateFormatting.dateForm) : null
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
              maxLength={255}
            />
          </Form.Item>
        </div>
      </NxCardContainer>

      <ModalCustom
        isOpen={isOpen}
        handleCancel={handleCancel}
        handleOk={handleOk}
        header={"CHOOSE ACCOUNT"}
        width={1100}
        type={"confirmation"}
        footer={[
          <Button key="close" onClick={handleClose}>
            Close
          </Button>,
        ]}
      >
        <NxTable
          idTable="payment-relation-account-standard"
          dataSource={dataSourceWithKeys}
          totalData={pagination_prAccountStandard.totalElements || 0}
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
      </ModalCustom>
    </div>
  )
}
