import { LeftCircleFilled, RightCircleFilled } from "@ant-design/icons";
import React, { useState } from "react";
import RadioTabs from "../../../../../components/RadioTabs";
import PDIProductDetail from "./SectionProductDetail/PDIProductDetail";
import PDICalculationRule from "./SectionCalculationRule/PDICalculationRule";
import PDITargetAccountSelling from "./SectionTargetAccountSelling/PDITargetAccountSelling";
import PDIPricing from "./SectionPricing/PDIPricing";
import PDITermOfService from "./SectionPDITermOfService/PDITermOfService";
import PDIProductBundling from "./SectionProductBundling/PDIProductBundling";
import PDIEligibilityProduct from "./SectionEligibilityProduct/PDIEligibilityProduct";
import { useEffect } from "react";

const dataTabs = {
  pd: "Product Detail",
  cr: "Calculation Rule",
  tas: "Target Account Selling",
  p: "Pricing",
  tos: "Term Of Service",
  pb: "Product Bundling",
  ep: "Eligibility Product",
};
const ProductDetailInformation = ({
  section = "",
  options = [],
  handleChangeOption = () => {},
  dataProductDetail = {},
  dataProductInfo = {},
}) => {
  const [dataPDIProductDetail, setDatatPDIProductDetail] = useState([]);
  const [dataPDICalculationRule, setDataPDICalculationRule] = useState([]);
  const [
    dataTablePDITargetAccountSelling,
    setDataTablePDITargetAccountSelling,
  ] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [objTAS, setObjTAS] = useState({});
  const [objPricing, setObjPricing] = useState([]);
  const [dataTablePDITermOfService, setDataTablePDITermOfService] = useState(
    [],
  );
  const [dataTablePDIProductBundling, setDataTablePDIProductBundling] =
    useState([]);
  const [dataTablePDIEligibilityProduct, setDataTablePDIEligibilityProduct] =
    useState([]);
  useEffect(() => {
    if (dataProductDetail && dataProductDetail.id) {
      setDatatPDIProductDetail(dataProductDetail?.mproductDetail || []);
      setDataPDICalculationRule(
        dataProductDetail?.mproductCalculationRule || [],
      );
      setObjTAS(dataProductDetail?.mproductTargetAccountSelling || {});
      setCriteria(
        (
          dataProductDetail?.mproductTargetAccountSelling
            ?.mProductTargetAccountSellingCriteria || []
        ).map((item) => (item.criteria ? parseInt(item.criteria) : 0)),
      );
      setDataTablePDITargetAccountSelling(
        dataProductDetail?.mproductTargetAccountSelling?.criterias || [],
      );
      setObjPricing(dataProductDetail?.mproductPricing || {});
      setDataTablePDITermOfService(
        dataProductDetail?.mproductTermOfService || [],
      );
      setDataTablePDIEligibilityProduct(
        dataProductDetail?.religibilityProduct || [],
      );
      setDataTablePDIProductBundling(dataProductDetail?.rproductBundling || []);
    }
  }, [dataProductDetail]);
  const sliderLeft = () => {
    const slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft - 250;
  };

  const sliderRight = () => {
    const slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft + 250;
  };
  const renderSection = () => {
    switch (section) {
      case dataTabs.pd:
        return <PDIProductDetail data={dataPDIProductDetail} />;
      case dataTabs.cr:
        return <PDICalculationRule data={dataPDICalculationRule} />;
      case dataTabs.tas:
        return (
          <PDITargetAccountSelling
            data={dataTablePDITargetAccountSelling}
            dataCriteria={criteria}
            dataObject={objTAS}
          />
        );
      case dataTabs.p:
        return (
          <PDIPricing
            dataPricing={objPricing}
            dataDetailProduct={dataProductInfo}
          />
        );
      case dataTabs.tos:
        return <PDITermOfService data={dataTablePDITermOfService} />;
      case dataTabs.pb:
        return <PDIProductBundling data={dataTablePDIProductBundling} />;
      case dataTabs.ep:
        return <PDIEligibilityProduct data={dataTablePDIEligibilityProduct} />;
      default:
        return <></>;
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex justify-center items-center gap-4">
        <LeftCircleFilled width={40} onClick={sliderLeft} />
        <div
          id="slider"
          className={
            "flex gap-2 w-full h-full overflow-x-auto scroll whitespace-nowrap scroll-smooth no-scrollbar"
          }
        >
          <RadioTabs
            currentPosition={section}
            data={options}
            onChange={handleChangeOption}
          />
        </div>
        <RightCircleFilled width={40} onClick={sliderRight} />
      </div>
      {renderSection()}
    </div>
  );
};

export default ProductDetailInformation;
