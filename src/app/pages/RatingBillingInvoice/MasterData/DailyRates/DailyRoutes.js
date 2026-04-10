import React, { useEffect, useState } from "react";
import BreadCrumb from "../../../../../components/BreadCrumb";
import RadioTabs from "../../../../../components/RadioTabs";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import DailyRateView from "./DailyRates/DailyRateView";
import RateTypeView from "./RatesType/RateTypeView";
import { usePrevLocContext } from "../../../../../utils/usePrevLoc";
import { useDispatch } from "react-redux";

const DailyRoutes = () => {
  const dispatch = useDispatch();
  const [pageDaily, setPageDaily] = useState(1);
  const [pageRate, setPageRate] = useState(1);
  const [pageSizeDaily, setPageSizeDaily] = useState(10);
  const [pageSizeRate, setPageSizeRate] = useState(10);
  const [searchedColumnDaily, setSearchedColumnDaily] = useState("");
  const [searchTextDaily, setSearchTextDaily] = useState("");
  const [searchedColumnRate, setSearchedColumnRate] = useState("");
  const [searchTextRate, setSearchTextRate] = useState("");
  const [sortDaily, setSortDaily] = useState("");
  const [searchDaily, setSearchDaily] = useState({});
  const [sortRate, setSortRate] = useState("");
  const [searchRate, setSearchRate] = useState({});
  const [totalElementsDaily, setTotalElementsDaily] = useState(0);
  const [totalElementsRate, setTotalElementsRate] = useState(0);
  const [segmentedPage, setSegmentedPage] = useState(null);

  const listSegmentedPage = [{ value: "Daily Rate" }, { value: "Rate Type" }];

  //path radio type
  const { path } = usePrevLocContext();
  useEffect(() => {
    if (path && path.pathname?.includes("/system-setup/rate-type")) {
      setSegmentedPage(listSegmentedPage[1].value);
    } else {
      setSegmentedPage(listSegmentedPage[0].value);
    }
  }, [path]);

  useEffect(() => {
    if (segmentedPage === listSegmentedPage[0].value) {
      setPageDaily(1);
      setPageSizeDaily(10);
      setSearchDaily({});
      setSearchTextDaily("");
      setSearchedColumnDaily("");
      setTotalElementsDaily(0);
    } else {
      setPageRate(1);
      setPageSizeRate(10);
      setSearchRate({});
      setSearchTextRate("");
      setSearchedColumnRate("");
      setTotalElementsRate(0);
    }
  }, [segmentedPage]);

  const handleSegmentedPage = (e) => {
    setSegmentedPage(e.target.value);
  };

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: RBI_ROUTES.DAILY_RATE_VIEW,
      breadcrumbName: `${segmentedPage}`,
    },
  ];

  return (
    <>
      {/* <Spin> */}
      <BreadCrumb routes={routes} />
      <div className="pt-[20px]">
        <RadioTabs
          data={listSegmentedPage}
          onChange={handleSegmentedPage}
          currentPosition={segmentedPage}
        />
      </div>

      <div className={"w-full"}>
        {segmentedPage === listSegmentedPage[0].value ? (
          <DailyRateView
            dispatch={dispatch}
            page={pageDaily}
            pageSize={pageSizeDaily}
            totalElements={totalElementsDaily}
            search={searchDaily}
            sort={sortDaily}
            searchText={searchTextDaily}
            searchedColumn={searchedColumnDaily}
            setPage={setPageDaily}
            setPageSize={setPageSizeDaily}
            setTotalElements={setTotalElementsDaily}
            setSearchText={setSearchTextDaily}
            setSearchedColumn={setSearchedColumnDaily}
            setSearch={setSearchDaily}
            setSort={setSortDaily}
          />
        ) : (
          <RateTypeView
            dispatch={dispatch}
            page={pageRate}
            pageSize={pageSizeRate}
            totalElements={totalElementsRate}
            search={searchRate}
            sort={sortRate}
            searchText={searchTextRate}
            searchedColumn={searchedColumnRate}
            setPage={setPageRate}
            setPageSize={setPageSizeRate}
            setTotalElements={setTotalElementsRate}
            setSearchText={setSearchTextRate}
            setSearchedColumn={setSearchedColumnRate}
            setSearch={setSearchRate}
            setSort={setSortRate}
          />
        )}
      </div>
      {/* </Spin> */}
    </>
  );
};

export default DailyRoutes;
