import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SectionCard from "../../../../../components/SectionCard";
import DetailText from "../../../../../components/DetailText";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import dayjs from "dayjs";
import { SyncOutlined } from "@ant-design/icons";
import { getListRateSource } from "../../../../../redux/slices/receipt_collection/liborRate";

const DetailLiborRate = (props) => {
  const { data } = props;
  const dispatch = useDispatch();
  const { dataListRateSource } = useSelector((state) => state.liborRate);
  
  const rateSource = data?.rateSource || {};
  const rateIndex = data?.rateIndex || {};
  
  const [selectedSource, setSelectedSource] = useState(null);

  useEffect(() => {
    dispatch(getListRateSource());
  }, [dispatch]);

  useEffect(() => {
    if (rateSource.id) {
      setSelectedSource(rateSource.id);
    }
  }, [rateSource]);

  const isEditable = ((rateSource.id === null || rateSource.id === 0) || (rateIndex.status === "Draft" || rateIndex.status === "Rejected")) && rateIndex.approvalStatus !== "Waiting Approval";

  const sourceOptions = React.useMemo(() => {
    let list = [...(dataListRateSource || [])];
    if (rateSource.id && !list.find(item => item.id === rateSource.id)) {
        list.push(rateSource);
    }
    return list.map(item => ({
      label: `${item.sourceName}`,
      value: item.id,
      ...item
    }));
  }, [dataListRateSource, rateSource]);

  const currentSource = sourceOptions.find(item => item.id === selectedSource) || rateSource;

  return (
    <div className="flex flex-col gap-0 p-5">
      <SectionCard title={"SOURCE"}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-5">
            <DetailText label="Code">{currentSource.sourceCode || ""}</DetailText>
            <div className="flex flex-col gap-1">
              <span className="text-[#8D91A0] text-[12px]">Source</span>
                <SelectComponent
                  disabled={!isEditable}
                  placeholder="Select Source"
                  value={selectedSource}
                  options={sourceOptions}
                  onChange={(val) => setSelectedSource(val)}
                />
            </div>
            <DetailText label="Source Name">{currentSource.description || ""}</DetailText>
          </div>
          <div className="flex justify-end mt-2">
             <ButtonComponent 
                disabled={!isEditable} 
                type="action" 
                border={true} 
                className={isEditable ? "!bg-[#0075bf] !text-white !border-none !rounded-md" : "!bg-[#E6E6E6] !text-[#A6A6A6] !border-none !rounded-md"}
              >
                Update Data <SyncOutlined className="ml-2" />
             </ButtonComponent>
          </div>
        </div>
      </SectionCard>

      <SectionCard title={"RATE INDEX"}>
        <div className="grid grid-cols-5 gap-y-5 gap-x-5">
          <DetailText label="Rate Index Code">{rateIndex.indexCode}</DetailText>
          <DetailText label="Rate Index Name">{rateIndex.indexName}</DetailText>
          <DetailText label="Tenor">{rateIndex.tenorValue}</DetailText>
          <DetailText label="Rate Value">{rateIndex.ratePercentage}</DetailText>
          <DetailText label="Unit">{rateIndex.tenorUnit}</DetailText>
          <DetailText label="Currency">{rateIndex.currencyCode}</DetailText>
          <DetailText label="Start Date">{rateIndex.startDate ? dayjs(rateIndex.startDate).format("YYYY-MM-DD") : "-"}</DetailText>
          <DetailText label="End Date">{rateIndex.endDate ? dayjs(rateIndex.endDate).format("YYYY-MM-DD") : "-"}</DetailText>
          <div className="col-span-5">
            <DetailText label="Description">{rateIndex.remarks || ""}</DetailText>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default DetailLiborRate;
