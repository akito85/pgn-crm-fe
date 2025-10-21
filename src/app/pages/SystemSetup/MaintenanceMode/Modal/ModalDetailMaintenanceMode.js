import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dateFormatting, toTitleCase } from "../../../../../utils";
import { getMaintenanceModeDetail } from "../../../../../redux/slices/system_setup/maintenanceMode";
import moment from "moment";
import ButtonComponent from "../../../../../components/ButtonComponent";
import DetailText from "../../../../../components/DetailText";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../../components/Card/CardComponent";

const ModalDetailMaintenanceMode = ({
  isOpen,
  data,
  handleCancel = () => {},
}) => {
  // Selector
  const { detail_MaintenanceMode } = useSelector(
    (state) => state.maintenanceMode,
  );

  // Declaration
  const dispatch = useDispatch();
  const id = data?.maintenanceModeId;

  // Use Effect
  useEffect(() => {
    if (id) {
      dispatch(getMaintenanceModeDetail(id));
    }
  }, [dispatch, data]);

  return (
    <ModalCustom
      isOpen={isOpen}
      //type={"confirmation"}
      header={"MAINTENANCE DETAIL"}
      width={893}
      handleCancel={handleCancel}
      footer={
        <div className={"w-full flex justify-end gap-5"}>
          <ButtonComponent type={"default"} onClick={handleCancel}>
            Back
          </ButtonComponent>
        </div>
      }
    >
      <CardComponent cols={3}>
        <DetailText label={"Start Date"}>
          {detail_MaintenanceMode?.startDate
            ? moment(detail_MaintenanceMode?.startDate).format(
                dateFormatting.date,
              )
            : ""}
        </DetailText>
        <DetailText label={"Started By"}>
          {detail_MaintenanceMode.createdBy}
        </DetailText>
        <DetailText label={"Turn On Remark"}>
          {detail_MaintenanceMode.remarkOn}
        </DetailText>
        <DetailText label={"End Date"}>
          {detail_MaintenanceMode?.endDate
            ? moment(detail_MaintenanceMode?.endtDate).format(
                dateFormatting.date,
              )
            : ""}
        </DetailText>
        <DetailText label={"Ended By"}>
          {detail_MaintenanceMode.updatedBy}
        </DetailText>
        <DetailText label={"Turn Off Remark"}>
          {detail_MaintenanceMode.remarkOff}
        </DetailText>
        <DetailText label={"Status"}>
          {toTitleCase(detail_MaintenanceMode.status)}
        </DetailText>
      </CardComponent>
    </ModalCustom>
  );
};

export default ModalDetailMaintenanceMode;
