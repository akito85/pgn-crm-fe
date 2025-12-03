import React, { useState } from "react";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import { Spin } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { NavLink } from "react-router-dom";
import BaseContainer from "../../../../components/BaseContainer";
import { useDispatch, useSelector } from "react-redux";
import SVGIcon from "../../../../assets/Icon/index";
import { useEffect } from "react";
import { downloadPricing } from "../../../../redux/slices/product_promo/pricing";
import PricingTable from "./PricingTable";
import RadioTabs from "../../../../components/RadioTabs";
import PricingAdjustTable from "../PricingAdjustment/PricingAdjustTable";
import {
  downloadPriceAdjust,
  getGrantedAccessPriceAdjust,
} from "../../../../redux/slices/product_promo/pricingAdjust";
import { usePrevLocContext } from "../../../../utils/usePrevLoc";
import Toolbar from "../../../../components/Toolbar";
import ToolbarDynamic from "../UtilsProduct/ToolbarDynamic";
// Breadcrumbs
const routes = (segmentedPage) => [
  {
    path: "",
    breadcrumbName: "Product & Promo",
  },
  {
    path: PRODUCT_PROMO_ROUTES.VIEW_PRICING,
    breadcrumbName: segmentedPage,
  },
];

const listSegmentedPage = [
  { value: "Pricing" },
  { value: "Pricing Adjustment" },
];
const Pricing = () => {
  const dispatch = useDispatch();
  const [segmentedPage, setSegmentedPage] = useState(null);
  const { loadingPricing } = useSelector((state) => state.pricing);
  const { loadingPricingAdjust } = useSelector((state) => state.pricingAdjust);
  const [pagePricing, setPagePricing] = useState(1);
  const [pageSizePricing, setPageSizePricing] = useState(10);
  const [totalElementsPricing, setTotalElementPricing] = useState(0);
  const [searchedColumnPricing, setSearchedColumnPricing] = useState("");
  const [searchTextPricing, setSearchTextPricing] = useState("");
  const [sortPricing, setSortPricing] = useState("");
  const [searchPricing, setSearchPricing] = useState({});
  const [pagePriceAdjust, setPagePriceAdjust] = useState(1);
  const [pageSizePriceAdjust, setPageSizePriceAdjust] = useState(10);
  const [totalElementsPriceAdjust, setTotalElementPriceAdjust] = useState(0);
  const [searchedColumnPriceAdjust, setSearchedColumnPriceAdjust] =
    useState("");
  const [searchTextPriceAdjust, setSearchTextPriceAdjust] = useState("");
  const [sortPriceAdjust, setSortPriceAdjust] = useState("");
  const [searchPriceAdjust, setSearchPriceAdjust] = useState({});
  const isLoading = loadingPricing || loadingPricingAdjust;
  const { path } = usePrevLocContext();

  useEffect(() => {
    if (path && path?.pathname?.includes("/product-promo/pricing-adjust")) {
      setSegmentedPage(listSegmentedPage[1].value);
    } else {
      setSegmentedPage(listSegmentedPage[0].value);
    }
  }, [path]);

  useEffect(() => {
    if (segmentedPage === listSegmentedPage[0].value) {
      setPagePriceAdjust(1);
      setPageSizePriceAdjust(10);
      setSearchPriceAdjust({});
      setSearchTextPriceAdjust("");
      setSearchedColumnPriceAdjust("");
      setTotalElementPriceAdjust(0);
    } else {
      dispatch(getGrantedAccessPriceAdjust("/product-promo/pricing-adjust"));
      setPagePricing(1);
      setPageSizePricing(10);
      setSearchPricing({});
      setSearchTextPricing("");
      setSearchedColumnPricing("");
      setTotalElementPricing(0);
    }
  }, [dispatch, segmentedPage]);

  const handleSegmentedPage = (e) => {
    setSegmentedPage(e.target.value);
  };

  const handleDownload = () => {
    if (segmentedPage === listSegmentedPage[0].value) {
      // let tempSearch = "";
      // for (const dataIndex in searchPricing) {
      //   if (Object.hasOwnProperty.call(searchPricing, dataIndex)) {
      //     const tempSearchText = searchPricing[dataIndex];
      //     if (tempSearchText) {
      //       tempSearch += `${dataIndex}~${tempSearchText},`;
      //     }
      //   }
      // }
      // tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
      dispatch(
        downloadPricing({
          page: pagePricing,
          pageSize: pageSizePricing,
          search: encodeURIComponent(JSON.stringify(searchPricing)),
          sort: sortPricing,
        }),
      );
    } else {
      // let tempSearch = "";
      // for (const dataIndex in searchPriceAdjust) {
      //   if (Object.hasOwnProperty.call(searchPriceAdjust, dataIndex)) {
      //     const tempSearchText = searchPriceAdjust[dataIndex];
      //     if (tempSearchText) {
      //       tempSearch += `${dataIndex}~${tempSearchText},`;
      //     }
      //   }
      // }
      // tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
      dispatch(
        downloadPriceAdjust({
          page: pagePriceAdjust,
          pageSize: pageSizePriceAdjust,
          search: encodeURIComponent(JSON.stringify(searchPriceAdjust)),
          sort: sortPriceAdjust,
        }),
      );
    }
  };

  const itemsActionView = (page) => {
    return [
      {
        action: "Download",
        render: (
          <ButtonComponent
            icon={<SVGIcon name="IconButtonDownload" width={24} />}
            type="submit"
            onClick={handleDownload}
          >
            Download List
          </ButtonComponent>
        ),
      },
      page === listSegmentedPage[0].value
        ? {
            action: "Create",
            render: (
              <NavLink to={PRODUCT_PROMO_ROUTES.CREATE_PRICING}>
                <ButtonComponent
                  icon={<SVGIcon name="IconButtonCreate" width={24} />}
                  type="submit"
                >
                  Create Pricing
                </ButtonComponent>
              </NavLink>
            ),
          }
        : null,
    ];
  };

  return (
    <LayoutMenu>
      <Spin spinning={isLoading} className={"w-full top-20"} tip={"Loading..."}>
        <BreadCrumb routes={routes(segmentedPage)} />

        {segmentedPage === listSegmentedPage[0].value ? (
          <Toolbar items={itemsActionView(segmentedPage)} />
        ) : (
          <ToolbarDynamic
            items={itemsActionView(segmentedPage)}
            selector={"pricingAdjust"}
            url={"/product-promo/pricing-adjust"}
          />
        )}
        {/* <div className="flex w-full justify-end gap-x-2">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonDownload" width={24} />}
            type="submit"
            onClick={handleDownload}
          >
            Download List
          </ButtonComponent>
          {segmentedPage === listSegmentedPage[0].value ? (
            <NavLink to={PRODUCT_PROMO_ROUTES.CREATE_PRICING}>
              <ButtonComponent
                icon={<SVGIcon name="IconButtonCreate" width={24} />}
                type="submit"
              >
                Create Pricing
              </ButtonComponent>
            </NavLink>
          ) : null}
        </div> */}
        <div className="pt-[20px]">
          <RadioTabs
            data={listSegmentedPage}
            onChange={handleSegmentedPage}
            currentPosition={segmentedPage}
          />
        </div>
        <BaseContainer
          header={`${
            segmentedPage === listSegmentedPage[0].value
              ? "PRICING"
              : "PRICING ADJUSTMENT"
          } LIST`}
        >
          <div className={"w-full"}>
            {segmentedPage === listSegmentedPage[0].value ? (
              <PricingTable
                dispatch={dispatch}
                page={pagePricing}
                pageSize={pageSizePricing}
                totalElements={totalElementsPricing}
                search={searchPricing}
                sort={sortPricing}
                searchText={searchTextPricing}
                searchedColumn={searchedColumnPricing}
                updatePage={setPagePricing}
                updatePageSize={setPageSizePricing}
                updateTotalElements={setTotalElementPricing}
                updateSearchText={setSearchTextPricing}
                updateSearchedColumn={setSearchedColumnPricing}
                updateSearch={setSearchPricing}
                updateSort={setSortPricing}
              />
            ) : (
              <PricingAdjustTable
                dispatch={dispatch}
                page={pagePriceAdjust}
                pageSize={pageSizePriceAdjust}
                totalElements={totalElementsPriceAdjust}
                search={searchPriceAdjust}
                sort={sortPriceAdjust}
                searchText={searchTextPriceAdjust}
                searchedColumn={searchedColumnPriceAdjust}
                updatePage={setPagePriceAdjust}
                updatePageSize={setPageSizePriceAdjust}
                updateTotalElements={setTotalElementPriceAdjust}
                updateSearchText={setSearchTextPriceAdjust}
                updateSearchedColumn={setSearchedColumnPriceAdjust}
                updateSearch={setSearchPriceAdjust}
                updateSort={setSortPriceAdjust}
              />
            )}
          </div>
        </BaseContainer>
      </Spin>
    </LayoutMenu>
  );
};

export default Pricing;
