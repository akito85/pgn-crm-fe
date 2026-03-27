import { useEffect, useMemo, useRef, useState } from "react";
import { Form, Button } from "antd";
import InputComponent from "../../../../../../../../../components/InputComponent";
import {
  dateFormatting,
  requiredMessage
} from "../../../../../../../../../utils";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import NxModal from "../../../../../../../../../components/Nx/NxModal";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../../../../../../components/Nx/NxTable";
import NxDetailText from "../../../../../../../../../components/Nx/NxDetailText";
import NxDate from "../../../../../../../../../components/Nx/NxDatePicker";
import { getMdAccountStandard } from "../../../../../../../../../redux/slices/account_management/detailAccount/MultiDestinationSlice";
import { getAccountStandardColumns } from "./getAccountStandardColumns";

export default function InfoMultiDestination({
  accountId,
  setAccount,
  form,
  isUpdate,
  isDraft,
  formView = true
}) {
  const account = Form.useWatch("account", form);
  const accountSor = Form.useWatch("accountSor", form);
  const accountCostCenter = Form.useWatch("accountCostCenter", form);
  const meterReadingCode = Form.useWatch("meterReadingCode", form);
  const accountSegment = Form.useWatch("accountSegment", form);
  const accountGroupType = Form.useWatch("accountGroupType", form);
  const accountType = Form.useWatch("accountType", form);
  const premiseAddress = Form.useWatch("premiseAddress", form);
  const subDistrict = Form.useWatch("subDistrict", form);
  const district = Form.useWatch("district", form);
  const city = Form.useWatch("city", form);
  const province = Form.useWatch("province", form);
  const country = Form.useWatch("country", form);
  const longitude = Form.useWatch("longitude", form);
  const latitude = Form.useWatch("latitude", form);
  const startDate = Form.useWatch("startDate", form);
  const endDate = Form.useWatch("endDate", form);
  const description = Form.useWatch("description", form);
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [filters, setFilters] = useState([]);
  const [filterRules, setFilterRules] = useState([]);

  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  const [isOpen, setIsOpen] = useState(false);

  const { list_mdAccountStandard, pagination_mdAccountStandard, loading_listMdAccountStandard } = useSelector(
    (state) => state.multiDestination
  );

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
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
        [dataIndex]: selectedKeys[0]
      };
    });
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPage = pagination_mdAccountStandard?.totalPage || 0;

    if (nextPage <= totalPage) {
      const body = {
        searchs: search,
        page: nextPage,
        size: loadMoreSize,
        sort,
        filters,
        filterRules,
      }

      await dispatch(
        getMdAccountStandard({
          body,
          isLoadMore: true,
          id: accountId
        })
      ).unwrap();
    }
    setPage(nextPage);
  };

  useEffect(() => {
    if (formView) {
      const body = {
        page,
        size: loadMoreSize,
        sort,
        searchs: search,
        filters,
        filterRules,
      }

      dispatch(
        getMdAccountStandard({
          body,
          id: accountId,
          isLoadMore: false
        })
      );
    }
  }, [sort, search, filters, filterRules]);

  const baseColumns = useMemo(
    () =>
      getAccountStandardColumns(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        setAccount,
        setIsOpen
      ),
    [search, searchText, searchedColumn]
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title
    }));
    return columnsWithKeys;
  }, [baseColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title
    }));
  }, [allColumns]);

  const currentData = useMemo(
    () => list_mdAccountStandard,
    [list_mdAccountStandard]
  );

  const hasMore =
    currentData.length < (pagination_mdAccountStandard?.totalElement || 0);

  const dataSourceWithKeys = useMemo(() => {
    if (!currentData || currentData.length === 0) return [];

    return currentData.map((item, index) => ({
      ...item,
      key: `${item.id}-${index}`
    }));
  }, [currentData]);

  if (!formView) {
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="w-full grid grid-cols-3 gap-4">
          <NxDetailText label="Account">{account}</NxDetailText>
          <NxDetailText label="Account SOR">{accountSor}</NxDetailText>
          <NxDetailText label="Account Cost Center">
            {accountCostCenter}
          </NxDetailText>
          <NxDetailText label="Meter Reading Code">
            {meterReadingCode}
          </NxDetailText>
          <NxDetailText label="Account Segment">{accountSegment}</NxDetailText>
          <NxDetailText label="Account Group Type">
            {accountGroupType}
          </NxDetailText>
          <NxDetailText label="Account Type">{accountType}</NxDetailText>
          <NxDetailText label="Premise Address">{premiseAddress}</NxDetailText>
          <NxDetailText label="Subdistrict">{subDistrict}</NxDetailText>
          <NxDetailText label="District">{district}</NxDetailText>
          <NxDetailText label="City">{city}</NxDetailText>
          <NxDetailText label="Province">{province}</NxDetailText>
          <NxDetailText label="Country">{country}</NxDetailText>
          <NxDetailText label="Longitude">{longitude}</NxDetailText>
          <NxDetailText label="Latitude">{latitude}</NxDetailText>
          <NxDetailText label="Start Date">
            {NxDate.formatDate(startDate, dateFormatting.date)}
          </NxDetailText>
          <NxDetailText label="End Date">
            {NxDate.formatDate(endDate, dateFormatting.date)}
          </NxDetailText>
        </div>
        <div className="w-full">
          <NxDetailText label="Description">{description}</NxDetailText>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="w-full grid grid-cols-3 gap-4">
        <Form.Item label={"Account"} required className="no-margin-form">
          <div className="flex gap-x-1">
            <Form.Item
              key="account"
              name={"account"}
              rules={[
                {
                  message: requiredMessage("Account"),
                  required: true
                }
              ]}
              noStyle
            >
              <InputComponent disabled />
            </Form.Item>
            <Button
              type="submit"
              onClick={() => {
                setIsOpen(true);
              }}
              className="w-[120px]"
              disabled={!isDraft && isUpdate}
            >
              Select
            </Button>
          </div>
        </Form.Item>

        <Form.Item
          key="accountSor"
          name={"accountSor"}
          label={"Account SOR"}
          className="no-margin-form"
        >
          <InputComponent disabled />
        </Form.Item>

        <Form.Item
          key="accountCostCenter"
          name={"accountCostCenter"}
          label={"Account Cost Center"}
          className="no-margin-form"
        >
          <InputComponent disabled />
        </Form.Item>

        <Form.Item
          key="meterReadingCode"
          name={"meterReadingCode"}
          label={"Meter Reading Code"}
          className="no-margin-form"
        >
          <InputComponent disabled />
        </Form.Item>

        <Form.Item
          key="accountSegment"
          name={"accountSegment"}
          label={"Account Segment"}
          className="no-margin-form"
        >
          <InputComponent disabled />
        </Form.Item>

        <Form.Item
          key="accountGroupType"
          name={"accountGroupType"}
          label={"Account Group Type"}
          className="no-margin-form"
        >
          <InputComponent disabled />
        </Form.Item>

        <Form.Item
          key="accountType"
          name={"accountType"}
          label={"Account Type"}
          className="no-margin-form"
        >
          <InputComponent disabled />
        </Form.Item>

        <Form.Item
          key="premiseAddress"
          name={"premiseAddress"}
          label={"Premise Address"}
          className="no-margin-form"
        >
          <InputComponent disabled />
        </Form.Item>

        <Form.Item
          key="subDistrict"
          name={"subDistrict"}
          label={"Subdistrict"}
          className="no-margin-form"
        >
          <InputComponent disabled />
        </Form.Item>

        <Form.Item
          key="district"
          name={"district"}
          label={"District"}
          className="no-margin-form"
        >
          <InputComponent disabled />
        </Form.Item>

        <Form.Item
          key="city"
          name={"city"}
          label={"City"}
          className="no-margin-form"
        >
          <InputComponent disabled />
        </Form.Item>

        <Form.Item
          key="province"
          name={"province"}
          label={"Province"}
          className="no-margin-form"
        >
          <InputComponent disabled />
        </Form.Item>

        <Form.Item
          key="country"
          name={"country"}
          label={"Country"}
          className="no-margin-form"
        >
          <InputComponent disabled />
        </Form.Item>

        <Form.Item
          key="longitude"
          name={"longitude"}
          label={"Longitude"}
          className="no-margin-form"
        >
          <InputComponent disabled />
        </Form.Item>

        <Form.Item
          key="latitude"
          name={"latitude"}
          label={"Latitude"}
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
              required: true
            }
          ]}
          className="no-margin-form"
          getValueProps={(value) => ({
            value: value && moment(value, dateFormatting.dateForm)
          })}
        >
          <NxDate disabled={!isDraft && isUpdate} />
        </Form.Item>

        <Form.Item
          key="endDate"
          name={"endDate"}
          label={"End Date"}
          className="no-margin-form"
          getValueProps={(value) => ({
            value: value && moment(value, dateFormatting.dateForm)
          })}
        >
          <NxDate disabled={!isDraft && isUpdate} />
        </Form.Item>
      </div>

      <div className="w-full">
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
            disabled={!isDraft && isUpdate}
          />
        </Form.Item>
      </div>

      <NxModal
        isOpen={isOpen}
        handleCancel={handleCancel}
        title={"CHOOSE ACCOUNT"}
        width={1100}
        type={"confirmation"}
        footer={[
          <Button key="close" onClick={handleClose}>
            Close
          </Button>
        ]}
      >
        <div className="p-4">
          <NxBaseContainer border>
            <NxTable
              idTable="multi-destination-account-standard"
              dataSource={dataSourceWithKeys}
              totalData={pagination_mdAccountStandard.totalElement || 0}
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
              loading={loading_listMdAccountStandard}
            />
          </NxBaseContainer>
        </div>
      </NxModal>
    </div>
  );
}
