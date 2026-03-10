import { useEffect, useMemo, useRef, useState } from "react";
import { Form, Button, Input } from "antd";
import InputComponent from "../../../../../../../../../../components/InputComponent";
import { dateFormatting, requiredMessage } from "../../../../../../../../../../utils";
import { getIrAccountStandard } from "../../../../../../../../../../redux/slices/account_management/detailAccount/InvoiceRelationSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAccountStandardColumns } from "./getAccountStandardColumns";
import NxTable from "../../../../../../../../../../components/Nx/NxTable";
import NxModal from "../../../../../../../../../../components/Nx/NxModal";
import NxBaseContainer from "../../../../../../../../../../components/Nx/NxBaseContainer";
import NxDetailText from "../../../../../../../../../../components/Nx/NxDetailText";
import NxDate from "../../../../../../../../../../components/Nx/NxDatePicker";
import moment from "moment";

export default function InfoInvoiceRelation({
  setAccount,
  accountId,
  isUpdate,
  isDraft,
  form,
  formView = true,
}) {
  const dispatch = useDispatch();

  const accountNumber = Form.useWatch("accountNumber", form);
  const accountName = Form.useWatch("accountName", form);
  const startDate = Form.useWatch("startDate", form);
  const endDate = Form.useWatch("endDate", form);
  const description = Form.useWatch("description", form);

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
  
  const { list_irAccountStandard, pagination_irAccountStandard } = useSelector(
    (state) => state.invoiceRelation
  );

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
    const totalPages = pagination_irAccountStandard?.totalPages || 0;

    if (nextPage <= totalPages) {
      await dispatch(
        getIrAccountStandard({
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
    if (formView)
      dispatch(getIrAccountStandard({
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
  
  const currentData = useMemo(() => list_irAccountStandard, [list_irAccountStandard]);
  
  const hasMore = currentData.length < (pagination_irAccountStandard?.totalElements || 0);

  const dataSourceWithKeys = useMemo(() => {
    if (!currentData || currentData.length === 0) return [];

    return currentData.map((item, index) => ({
      ...item,
      key: `${item.id}-${index}`,
    }));
  }, [currentData]);
  
  if (!formView) {
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="w-full grid grid-cols-3 gap-4">
          <NxDetailText label="Account Number">{accountNumber}</NxDetailText>
          <NxDetailText label="Account Name">{accountName}</NxDetailText>
          <NxDetailText label="Start Date">{NxDate.formatDate(startDate, "DD MMM YYYY")}</NxDetailText>
          <NxDetailText label="End Date">{NxDate.formatDate(endDate, "DD MMM YYYY")}</NxDetailText>
        </div>
        <div className="w-full">
          <NxDetailText label="Description">{description}</NxDetailText>
        </div>
      </div>
    );
  }

  return(
    <div className="flex flex-col gap-y-4">
      <div className="w-full grid grid-cols-3 gap-4">
        <div className="flex gap-2 items-end">
          <Form.Item
            label={"Account Number"}
            required
            className="no-margin-form"
          >
            <div className="flex gap-x-1">
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
                type="submit"
                className="w-[120px]"
                onClick={() => {
                  setIsOpen(true)
                }}
                disabled={!isDraft && isUpdate}
              >
                Select
              </Button>
            </div>
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
          key="startDate"
          name={"startDate"}
          label={"Start Date"}
          rules={[
            {
              message: requiredMessage("Start Date"),
              required: true,
            },
          ]}
          getValueProps={(value) => ({ value: value && moment(value, dateFormatting.dateFormal)})}
          className="no-margin-form"
        >
          <NxDate disabled={!isDraft && isUpdate} />
        </Form.Item>

        <Form.Item
          key="endDate"
          name={"endDate"}
          label={"End Date"}
          getValueProps={(value) => ({ value: value && moment(value, dateFormatting.dateFormal)})}
          className="no-margin-form"
        >
          <NxDate />
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
            disabled={!isDraft && isUpdate}
            type={"textarea"}
            rows={4}
            maxLength={255}
          />
        </Form.Item>
      </div>

      <NxModal
        isOpen={isOpen}
        handleCancel={handleCancel}
        header={"CHOOSE ACCOUNT"}
        width={1100}
        type={"confirmation"}
        footer={[
          <Button key="close" onClick={handleClose}>
            Close
          </Button>,
        ]}
      >
        <div className="p-4">
          <NxBaseContainer border>
            <NxTable
              idTable="invoice-relation-account-standard"
              dataSource={dataSourceWithKeys}
              totalData={pagination_irAccountStandard.totalElements || 0}
              current={page}
              tableScrolled={{ x: 3000 }}
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
