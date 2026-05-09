import React from "react";
import IconAccountManagement from "./IconAccountManagement";
import IconActionCreate from "./IconActionCreate";
import IconActionDropdown from "./IconActionDropdown";
import IconAlertCicrle from "./IconAlertCircle";
import IconAlertTriangle from "./IconAlertTriangle";
import IconApprove from "./IconApprove";
import IconArrowNarrowLeft from "./IconArrowNarrowLeft";
import IconBilling from "./IconBilling";
import IconCalendarEvent from "./IconCalendarEvent";
import IconClear from "./IconClear";
import IconCross from "./IconCross";
import IconDelete from "./IconDelete";
import IconDetail from "./IconDetail";
import IconDownload from "./IconDownload";
import IconDropdown from "./IconDropdown";
import IconEarlyRepayment from "./IconEarlyRepayment";
import IconEdit from "./IconEdit";
import IconEditTable from "./IconEditTable";
import IconEraserTable from "./IconEraserTable";
import IconEye from "./IconEye";
import IconEyeOff from "./IconEyeOff";
import IconFilter from "./IconFilter";
import IconHome from "./IconHome";
import IconInactive from "./IconInactive";
import IconInvoice from "./IconInvoice";
import IconLock from "./IconLock";
import IconLogHistory from "./IconLogHistory";
import IconPayment from "./IconPayment";
import IconProduct from "./IconProduct";
import IconRating from "./IconRating";
import IconReject from "./IconReject";
import IconReport from "./IconReport";
import IconRequestApproval from "./IconRequestApproval";
import IconSorting from "./IconSorting";
import IconSuccess from "./IconSuccess";
import IconSupport from "./IconSupport";
import IconSystemSetup from "./IconSystemSetup";
import IconUndo from "./IconUndo";
import IconUnlock from "./IconUnlock";
import IconUpload from "./IconUpload";
import IconUserManagement from "./IconUserManagement";
import IconButtonBack from "./IconButtonBack";
import IconButtonClear from "./IconButtonClear";
import IconButtonCreate from "./IconButtonCreate";
import IconButtonDownload from "./IconButtonDownload";
import IconButtonReset from "./IconButtonReset";
import IconSwapPosition from "./IconSwapPosition";
import IconUpdateAction from "./IconUpdateAction";
import IconFailed from "./IconFailed";
import IconSubmitApprover from "./IconSubmitApprover";
import IconReleaseApprover from "./IconReleaseApprover";
import IconClip from "./IconClip";
import IconExtend from "./IconExtend";
import IconTerminate from "./IconTerminate";
import IconUploadAttachment from "./IconUploadAttachment";
import IconRevers from "./IconRevers";
import IconTransfer from "./IconTransfer";
import IconRefund from "./IconRefund";
import IconHold from "./IconHold";
import IconSend from "./IconSend";
import IconPaymentOpen from "./IconPaymentOpen";
import IconPaymentClose from "./IconPaymentClose";
import IconActiveSuccess from "./IconActiveSuccess";
import IconReGenerate from "./IconReGenerate";
import IconRatingRecalculate from "./IconRatingRecalculate";
import IconMonitoring from './IconMonitoring';
import IconPlusCircle from "./IconPlusCircle";
import IconJobList from "./IconJobList";
import IconJobGroup from "./IconJobGroup";
import IconJobExecution from "./IconJobExecution";
import IconExpire from "./IconExpire";
import IconSquareX from "./IconSquareX";
import IconSquareCheck from "./IconSquareCheck";
import IconTripleDot from "./IconTripleDot";
import IconChevronLeft from "./IconChevronLeft";
import IconChevronDown from "./IconChevronDown";
import IconAddTable from "./IconAddTable";
import IconRePlan from "./IconRePlan";
import { FileOutlined } from "@ant-design/icons";

const Icon = (props) => {
  const { color = "#000000" } = props;
  // Pass color to all icons
  const iconProps = { ...props, color };

  switch (props.name) {
    case "IconAccountManagement":
      return <IconAccountManagement {...props} />;
    case "IconActionCreate":
      return <IconActionCreate {...props} />;
    case "IconActionDropdown":
      return <IconActionDropdown {...props} />;
    case "IconAlertCircle":
      return <IconAlertCicrle {...props} />;
    case "IconAlertTriangle":
      return <IconAlertTriangle {...props} />;
    case "IconApprove":
      return <IconApprove {...props} />;
    case "IconArrowNarrowLeft":
      return <IconArrowNarrowLeft {...props} />;
    case "IconBilling":
      return <IconBilling {...props} />;
    case "IconCalendar":       // alias — menu management uses "IconCalendar", component is IconCalendarEvent
    case "IconCalendarEvent":
      return <IconCalendarEvent {...props} />;
    case "IconClear":
      return <IconClear {...props} />;
    case "IconCross":
      return <IconCross {...props} />;
    case "IconDelete":
      return <IconDelete {...props} />;
    case "IconDetail":
      return <IconDetail {...props} />;
    case "IconDownload":
      return <IconDownload {...props} />;
    case "IconDropdown":
      return <IconDropdown {...props} />;
    case "IconEdit":
      return <IconEdit {...props} />;
    case "IconEditTable":
      return <IconEditTable {...props} />;
    case "IconEraserTable":
      return <IconEraserTable {...props} />;
    case "IconEye":
      return <IconEye {...props} />;
    case "IconEyeOff":
      return <IconEyeOff {...props} />;
    case "IconFilter":
      return <IconFilter {...props} />;
    case "IconHome":
      return <IconHome {...props} />;
    case "IconInactive":
      return <IconInactive {...props} />;
    case "IconInvoice":
      return <IconInvoice {...props} />;
    case "IconLock":
      return <IconLock {...props} />;
    case "IconLogHistory":
      return <IconLogHistory {...props} />;
    case "IconReceipt":
      return <IconPayment {...props} />;
    case "IconProduct":
      return <IconProduct {...props} />;
    case "IconRating":
      return <IconRating {...props} />;
    case "IconReject":
      return <IconReject {...props} />;
    case "IconReport":
      return <IconReport {...props} />;
    case "IconRequestApproval":
      return <IconRequestApproval {...props} />;
    case "IconSorting":
      return <IconSorting {...props} />;
    case "IconSuccess":
      return <IconSuccess {...props} />;
    case "IconSupport":
      return <IconSupport {...props} />;
    case "IconSystemSetup":
      return <IconSystemSetup {...props} />;
    case "IconUndo":
      return <IconUndo {...props} />;
    case "IconUnlock":
      return <IconUnlock {...props} />;
    case "IconUpload":
      return <IconUpload {...props} />;
    case "IconUserManagement":
      return <IconUserManagement {...props} />;
    case "IconButtonBack":
      return <IconButtonBack {...props} />;
    case "IconButtonClear":
      return <IconButtonClear {...props} />;
    case "IconButtonCreate":
      return <IconButtonCreate {...props} />;
    case "IconButtonDownload":
      return <IconButtonDownload {...props} />;
    case "IconButtonReset":
      return <IconButtonReset {...props} />;
    case "IconSwapPosition":
      return <IconSwapPosition {...props} />;
    case "IconUpdateAction":
      return <IconUpdateAction {...props} />;
    case "IconFailed":
      return <IconFailed {...props} />;
    case "IconSubmitApprover":
      return <IconSubmitApprover {...props} />;
    case "IconReleaseApprover":
      return <IconReleaseApprover {...props} />;
    case "IconClip":
      return <IconClip {...props} />;
    case "IconExtend":
      return <IconExtend {...props} />;
    case "IconTerminate":
      return <IconTerminate {...props} />;
    case "IconUploadAttachment":
      return <IconUploadAttachment {...props} />;
    case "IconRevers":
      return <IconRevers {...props} />;
    case "IconTransfer":
      return <IconTransfer {...props} />;
    case "IconRefund":
      return <IconRefund {...props} />;
    case "IconHold":
      return <IconHold {...props} />;
    case "IconSend":
      return <IconSend {...props} />;
    case "IconPaymentOpen":
      return <IconPaymentOpen {...props} />;
    case "IconPaymentClose":
      return <IconPaymentClose {...props} />;
    case "IconActiveSuccess":
      return <IconActiveSuccess {...props} />;
    case "IconReGenerate":
      return <IconReGenerate {...props} />;
    case "IconRatingReconculate":
      return <IconRatingRecalculate {...props} />;
    case "IconMonitoringSession":
      return <IconMonitoring {...props} />;
    case "IconPlusCircle":
      return <IconPlusCircle {...props} />;
    case "IconReporting":
      return <FileOutlined {...props} style={{ color: "#4B465C" }} />;
    case "IconJobList":
      return <IconJobList {...props} />;
    case "IconJobGroup":
      return <IconJobGroup {...props} />;
    case "IconJobExecution":
      return <IconJobExecution {...props} />;
    case "IconExpire":
      return <IconExpire {...props} />
    case "IconSquareX":
      return <IconSquareX {...props} />
    case "IconSquareCheck":
      return <IconSquareCheck {...props} />
    case "IconTripleDot":
      return <IconTripleDot {...props} />;
    case "IconChevronLeft":
      return <IconChevronLeft {...props} />;
    case "IconChevronDown":
      return <IconChevronDown {...props} />;
    case "IconAddTable":
      return <IconAddTable {...props} />;
    case "IconEarlyRepayment":
      return <IconEarlyRepayment {...iconProps} />;
    case "IconRePlan":
      return <IconRePlan {...iconProps} />;
    default:
      return;
  }
};

export default Icon;
