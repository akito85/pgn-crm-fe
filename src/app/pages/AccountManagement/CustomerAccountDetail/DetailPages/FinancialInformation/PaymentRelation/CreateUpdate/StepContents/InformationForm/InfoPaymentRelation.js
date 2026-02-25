import { useEffect, useMemo, useRef, useState } from "react";
import { Form, Button, Input } from "antd";
import InputComponent from "../../../../../../../../../../components/InputComponent";
import { dateFormatting, requiredMessage } from "../../../../../../../../../../utils";
import moment from "moment";
import { getPrAccountStandard } from "../../../../../../../../../../redux/slices/account_management/detailAccount/PaymentRelationSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAccountStandardColumns } from "./getAccountStandardColumns";
import NxTable from "../../../../../../../../../../components/Nx/NxTable";
import NxModal from "../../../../../../../../../../components/Nx/NxModal";
import NxBaseContainer from "../../../../../../../../../../components/Nx/NxBaseContainer";
import NxDetailText from "../../../../../../../../../../components/Nx/NxDetailText";
import NxDate from "../../../../../../../../../../components/Nx/NxDatePicker";

export default function InfoPaymentRelation({
  accountId,
  setAccount,
  isUpdate,
  isDraft,
  form,
  formView = true,
}) {
  const dispatch = useDispatch();

  const accountNumber = Form.useWatch("accountNumber", form);
  const accountName = Form.useWatch("accountName", form);
  const priority = Form.useWatch("priority", form);
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

  const hasMore = currentData.length < (pagination_prAccountStandard?.totalElements || 0);

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
          <NxDetailText label="Priority">{priority}</NxDetailText>
          <NxDetailText label="Start Date">{startDate ? moment(startDate, dateFormatting.f_date).format(dateFormatting.date) : ""}</NxDetailText>
          <NxDetailText label="End Date">{endDate ? moment(endDate, dateFormatting.f_date).format(dateFormatting.date) : ""}</NxDetailText>
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
            className="no-margin-form w-full"
          >
            <Input.Group compact className="flex gap-x-1">
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
                onClick={() => {
                  setIsOpen(true)
                }}
                className="w-[120px]"
                disabled={!isDraft && isUpdate}
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
          <InputComponent disabled={!isDraft && isUpdate} />
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
          getValueProps={(value) => ({ value: value && moment(value, dateFormatting.dateForm)})}
          className="no-margin-form"
        >
          <NxDate
            disabled={!isDraft && isUpdate}
          />
        </Form.Item>

        <Form.Item
          key="endDate"
          name={"endDate"}
          label={"End Date"}
          getValueProps={(value) => ({ value: value && moment(value, dateFormatting.dateForm)})}
          className="no-margin-form"
        >
          <NxDate
            placeholder="Select date"
          />
        </Form.Item>
      </div>
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

      <NxModal
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
        <div className="p-4">
          <NxBaseContainer border>
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
          </NxBaseContainer>
        </div>
      </NxModal>
    </div>
  )
}
