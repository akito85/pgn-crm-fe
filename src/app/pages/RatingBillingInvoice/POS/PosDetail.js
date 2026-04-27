import React, { useState } from "react";
import BaseContainer from "../../../../components/BaseContainer";
import RadioTabs from "../../../../components/RadioTabs";
import PointOfSales from "./Detail/PointOfSales";
import Promo from "./Detail/Promo";
import PointOfSalesAttachment from "./Detail/PointOfSalesAttachment";

const PosDetail = ({ id, dispatch = () => {} }) => {
  const listDetailPage = [
    { value: "Point Of Sales" },
    { value: "Promo", disabled: true },
    { value: "Attachment"},
  ];

  const [detailPage, setDetailPage] = useState(listDetailPage[0].value);

  const handleDetailPage = (e) => {
    setDetailPage(e.target.value);
  };

  const renderSection = () => {
    switch (detailPage) {
      case listDetailPage[0].value:
        return <PointOfSales id={id?.posNumber} customerType={id?.customerType} dispatch={dispatch} />;
      case listDetailPage[1].value:
        return <Promo id={id} />;
      case listDetailPage[2].value:
        return (
          <PointOfSalesAttachment 
            dispatch={dispatch}
            id={id?.id}
          />
        );
      default:
        return <PointOfSales id={id?.posNumber} dispatch={dispatch} />;
    }
  };

  return (
    <BaseContainer
      header={"POINT OF SALES DETAIL"}
      type={"tabs"}
      element={
        <RadioTabs
          data={listDetailPage}
          onChange={handleDetailPage}
          currentPosition={detailPage}
        />
      }
    >
      <div className="flex flex-col gap-3">
        <div className="flex align-middle gap-2">
          <p className="text-[15px] font-semibold text-text-color-semibold">
            Pos Number:
          </p>
          <p className="text-[15px] font-semibold text-primary">{id?.posNumber}</p>
        </div>

        <div className={"w-full"}>{renderSection()}</div>
      </div>
    </BaseContainer>
  );
};

export default PosDetail;
