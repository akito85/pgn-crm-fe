import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import moment from 'moment'

import NxBaseContainer from '../../../../../../../../components/Nx/NxBaseContainer'
import NxDetailText from '../../../../../../../../components/Nx/NxDetailText'
import NxTabs from '../../../../../../../../components/Nx/NxTabs'
import NxTable from '../../../../../../../../components/Nx/NxTable'
import Pricing from './Pricing'
import LateCharge from './LateCharge'
import CalculationRule from './CalculationRule'
import TermOfService from './TermOfService'
import { dateFormatting, hasValue, renderColumn } from '../../../../../../../../utils'
import TaxImplication from './TaxImplication'
import { getColumnSearchPropsUseFilteredValueFE } from '../../../../../../../../utils/getColumnSearchProps'

const ServiceAgreementDetailCompoment = ({ data, dataDraft }) => {

  // --- Payment Information Table state (NxTable infinite scroll) ---
  const searchInput = useRef(null);
  const [displayData, setDisplayData] = useState([]);
  const [loadedCount, setLoadedCount] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: [],
    left: [],
  }));
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  // --- Pricing Information tabs state ---
  const [activePricingTab, setActivePricingTab] = useState("pricing");

  // --- Hardcoded IDs for Payment Information filter ---
  const paymentTypeId = 210;
  const chargingMethodId = 214;

  const paymentType = data?.saDetail?.find(item => item.name.toLowerCase() === "payment type")?.unit ?? "-"
  const chargingMethod = data?.saDetail?.find(item => item.name.toLowerCase() === "charging method")?.unit ?? "-"

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    setSearchedColumn(tempSearchColumn);
    setSearch((prevState) => {
      let tempData = { ...prevState };
      if (selectedKeys[0]) {
        tempData[dataIndex] = selectedKeys[0];
      } else {
        delete tempData[dataIndex];
      }
      return tempData;
    });
    setLoadedCount(20);
  };

  // Processed data for NxTable (excl. Payment Type & Charging Method rows, with FE search)
  const processedData = useMemo(() => {
    let raw = (data?.saDetail || []).filter(
      item => item.name.toLowerCase() !== "payment type" && item.name.toLowerCase() !== "charging method"
    ).map(item => ({
      ...item,
      value: item.value !== null ? item.value.toString() : '',
    }));

    // Apply FE search filters
    if (Object.keys(search).length > 0) {
      raw = raw.filter(item => {
        return Object.entries(search).every(([key, val]) => {
          if (!val) return true;
          return item[key]?.toString()?.toLowerCase()?.includes(val.toLowerCase());
        });
      });
    }

    if (!fieldSort) return raw;

    return [...raw].sort((a, b) => {
      const fa = a[fieldSort]?.toString()?.toLowerCase() || "";
      const fb = b[fieldSort]?.toString()?.toLowerCase() || "";
      if (fa < fb) return orderSort === "asc" ? -1 : 1;
      if (fa > fb) return orderSort === "asc" ? 1 : -1;
      return 0;
    });
  }, [data?.saDetail, fieldSort, orderSort, search]);

  useEffect(() => {
    const sliced = processedData.slice(0, loadedCount);
    setDisplayData(sliced);
    setHasMore(loadedCount < processedData.length);
  }, [processedData, loadedCount]);

  const handleLoadMore = useCallback(() => {
    return new Promise((resolve) => {
      setLoadedCount((prev) => prev + 20);
      resolve();
    });
  }, []);

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
    setLoadedCount(20);
  };

  const columns = [
    {
      title: "NO",
      key: "no",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: "NAME",
      key: "name",
      dataIndex: "name",
      sorter: true,
      width: 150,
      filteredValue: search?.["name"] ? [search?.["name"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "name", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("name", hasValue(search["name"]), searchText, text, false, "input", search),
    },
    {
      title: "VALUE",
      key: "value",
      dataIndex: "value",
      sorter: true,
      align: "right",
      width: 150,
      filteredValue: search?.["value"] ? [search?.["value"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "value", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("value", hasValue(search["value"]), searchText, text, false, "input", search),
    },
    {
      title: "UNIT",
      key: "unit",
      dataIndex: "unit",
      sorter: true,
      width: 150,
      filteredValue: search?.["unit"] ? [search?.["unit"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "unit", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("unit", hasValue(search["unit"]), searchText, text, false, "input", search),
    },
    {
      title: "DESCRIPTION",
      key: "description",
      dataIndex: "description",
      sorter: true,
      width: 200,
      filteredValue: search?.["description"] ? [search?.["description"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "description", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("description", hasValue(search["description"]), searchText, text, false, "input", search),
    },
  ];

  return (
    <div>
      {/* SA DETAIL VIEW */}
      <>
        <div className="flex flex-col gap-y-4">
          <NxBaseContainer border={true} header={"CREATE FROM"}>
            <div className="w-full grid grid-cols-4 gap-4">
              <NxDetailText label={"Create From"}>{data?.saInfo?.isCustom === "N" ? "Product" : data?.saInfo?.isCustom === null ? "" : "Custom"}</NxDetailText>
              <NxDetailText label={"Product"}>{data?.saInfo?.productName}</NxDetailText>
            </div>
          </NxBaseContainer>
          <NxBaseContainer border={true} header={"PRODUCT INFORMATION"}>
            <div className='w-full grid grid-cols-4 gap-4'>
              {data?.saInfo?.productVersionId && (
                <>
                  <NxDetailText label={"Product Type"}>{data?.saInfo?.productType}</NxDetailText>
                </>
              )}
              <NxDetailText label={"Service Type"}>{data?.saInfo?.saServiceType}</NxDetailText>
              {data?.saInfo?.productVersionId && (
                <>
                  <NxDetailText label={"Product Class"}>{data?.saInfo?.productClass}</NxDetailText>
                  <NxDetailText label={"Product Version"}>{data?.saInfo?.productVersion}</NxDetailText>
                </>
              )}
              <NxDetailText label={"Description"}>{data?.saInfo?.productDescription || "-"}</NxDetailText>
            </div>
          </NxBaseContainer>
          <NxBaseContainer border={true} header={"PAYMENT INFORMATION"}>
            <div className="w-full grid grid-cols-2 gap-4">
              <NxDetailText label={"Payment Type"}>{paymentType}</NxDetailText>
              <NxDetailText label={"Charging Method"}>{chargingMethod}</NxDetailText>
            </div>
            <div className='w-full py-4'>
              <NxTable
                idTable="sa-detail-payment-table"
                dataSource={displayData}
                columns={columns}
                totalData={processedData.length}
                tableScrolled={{ x: "max-content", y: 400 }}
                usePagination={false}
                useInfiniteScroll={true}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                loadMoreThreshold={2}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                columnDefinitions={columns.map((col) => ({
                  key: col.key || col.dataIndex || col.title,
                  title: col.title,
                }))}
                onChange={onSort}
                loading={false}
                showAdvanceSearch={false}
                showSearchBar={false}
              />
            </div>
          </NxBaseContainer>
          <NxBaseContainer border={true} header={"PRICING INFORMATION"}>
            <NxTabs
              activeKey={activePricingTab}
              onChange={(key) => setActivePricingTab(key)}
              items={[
                {
                  key: "pricing",
                  label: "Pricing",
                  children: <Pricing data={data} />,
                },
                {
                  key: "calculationRule",
                  label: "Calculation Rule",
                  children: <CalculationRule data={data} />,
                },
                {
                  key: "tos",
                  label: "Term of Service",
                  children: <TermOfService data={data} />,
                },
                {
                  key: "lateCharge",
                  label: "Late Charge",
                  children: <LateCharge data={data} />,
                },
                {
                  key: "taxImplication",
                  label: "Tax Implication",
                  children: <TaxImplication data={data} />,
                },
              ]}
            />
          </NxBaseContainer>

        </div>
      </>

    </div>
  )
}

export default ServiceAgreementDetailCompoment