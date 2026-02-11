import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../../utils/getColumnSearchProps";
import { getCurrentRaw } from "../../../../../../../redux/slices/account_management/detailAccount/RawMaterialDistributionSlice";
import { dateFormatting, renderColumn } from "../../../../../../../utils";
import moment from "moment";
import NxTable from '../../../../../../../components/Nx/NxTable'
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import { NavLink } from "react-router-dom";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../../assets/Icon/index";
import Toolbar from "../../../../../../../components/Toolbar";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxDetailText from "../../../../../../../components/Nx/NxDetailText";
import { sorterFunction } from "../../../../../../../utils/sorterFunction";
import { nxApplyFixedColumns } from "../../../../../../../utils/Nx/nxApplyFixedColumns";

const columns = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
) => {
  return [
    {
      key: "no",
      title: "NO",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      key: "country",
      title: "COUNTRY",
      dataIndex: "country",
      width: 150,
      sorter: (a, b) => sorterFunction("country", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "country",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        return renderColumn('country', searchedColumn, searchText, text, false, 'input', search)
      }
    },
    {
      key: "percentage",
      title: "PERCENTAGE (%)",
      dataIndex: "percentage",
      align: "right",
      sorter: true,
      width: 150,
      sorter: (a, b) => sorterFunction("percentage", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "percentage",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        return renderColumn('percentage', searchedColumn, searchText, text, false, 'input', search)
      },
    },
  ];
};

const CurrentRawMaterialSource = ({ id, idCustomer }) => {
  const itemGrantAccess = [
    {
      action: "Create",
      render: (
        <NavLink
          to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_RAW_MATERIAL_SOURCE}
          state={{
            accountId: id,
            idCustomer: idCustomer,
          }}
        >
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create
          </ButtonComponent>
        </NavLink>
      ),
    }
  ];
  
  // Selector
  const { data_current } = useSelector((state) => state.rawMaterialSource);

  const listData = data_current?.srcDistDtl || [];

  const dataSourceWithKeys = useMemo(() => {
    if (!listData?.length) return [];

    return listData.map((item, index) => ({
      ...item,
      key: `raw-material-source-current-${item.id || index}`,
    }));
  }, [listData]);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});

  // Use Effect
  useEffect(() => {
    dispatch(getCurrentRaw(id));
  }, [dispatch]);

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: [],
    left: [],
  }));

  const baseColumns = useMemo(() =>
    columns(
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ), [search, searchText, searchedColumn]
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns]);
  
  const processedColumns = useMemo(() => {
    return nxApplyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns, fixedColumns]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <NxBaseContainer border header={"RAW MATERIAL SOURCE INFORMATION"}>
          <div className="w-full grid grid-cols-3 gap-4">
            <NxDetailText label={"Effective Date"}>
              {data_current?.effectiveDate
                ? moment(data_current.effectiveDate).format(dateFormatting.date)
                : ""}
            </NxDetailText>
            <NxDetailText label={"Local (%)"}>{data_current?.value1}</NxDetailText>
            <NxDetailText label={"Import (%)"}>{data_current?.value2}</NxDetailText>
            <div className="col-span-3">
              <NxDetailText label={"Description"}>
                {data_current?.description}
              </NxDetailText>
            </div>
          </div>
        </NxBaseContainer>
        <NxBaseContainer border header={"RAW MATERIAL SOURCE DETAIL"}>
          <div className="flex flex-col gap-y-4">
            <Toolbar items={itemGrantAccess} type="detail" />

            <NxTable
              idTable="table-current-raw-material-source"
              dataSource={dataSourceWithKeys}
              tableScrolled={{ y: 400, x: dataSourceWithKeys?.length ? "max-content" : "100%" }}
              columns={processedColumns}
              usePagination={false}
              useInfiniteScroll={false}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              columnDefinitions={columnDefinitions}
              showAdvanceSearch={false}
            />
          </div>
        </NxBaseContainer>
      </div>
    </>
  );
};

export default CurrentRawMaterialSource;
