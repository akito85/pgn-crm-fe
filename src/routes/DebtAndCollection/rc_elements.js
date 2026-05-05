import ViewGracePeriod from "../../app/pages/DebtAndCollection/GracePeriod/ViewGracePeriod";
import ListDetailGracePeriod from "../../app/pages/DebtAndCollection/GracePeriod/DetailGracePeriod";
import FormGracePeriod from "../../app/pages/DebtAndCollection/GracePeriod/FormGracePeriod";

import ViewActivityName from "../../app/pages/DebtAndCollection/ActivityName/ViewActivityName";
import DetailActivityName from "../../app/pages/DebtAndCollection/ActivityName/DetailActivityName";
import FormActivityName from "../../app/pages/DebtAndCollection/ActivityName/FormActivityName";

import ViewTemplateReminding from "../../app/pages/DebtAndCollection/TemplateReminding/ViewTemplateReminding";
import ListDetailTemplateReminding from "../../app/pages/DebtAndCollection/TemplateReminding/DetailTemplateReminding";
import FormTemplateReminding from "../../app/pages/DebtAndCollection/TemplateReminding/FormTemplateReminding";

import ViewActivityType from "../../app/pages/DebtAndCollection/ActivityType/ViewActivityType";
import DetailActivityType from "../../app/pages/DebtAndCollection/ActivityType/DetailActivityType";
import FormActivityType from "../../app/pages/DebtAndCollection/ActivityType/FormActivityType";

import ViewActivityAction from "../../app/pages/DebtAndCollection/ActivityAction/ViewActivityAction";
import DetailActivityAction from "../../app/pages/DebtAndCollection/ActivityAction/DetailActivityAction";
import FormActivityAction from "../../app/pages/DebtAndCollection/ActivityAction/FormActivityAction";

import ViewActivities from "../../app/pages/DebtAndCollection/Activities/ViewActivies";
import DetailActivities from "../../app/pages/DebtAndCollection/Activities/DetailActivies";
import FormActivities from "../../app/pages/DebtAndCollection/Activities/FormActivies";

import ViewTransactionReport from "../../app/pages/DebtAndCollection/TransactionReport/ViewTransactionReport";
import ViewActivitiesPlan from "../../app/pages/DebtAndCollection/ActivitiesPlan/ViewActivitiesPlan";
import DetailActivitiesPlan from "../../app/pages/DebtAndCollection/ActivitiesPlan/DetailActivitiesPlan";
import FormActivitiesPlan from "../../app/pages/DebtAndCollection/ActivitiesPlan/FormActivitiesPlan";

import ViewRestructure from "../../app/pages/ReceiptAndCollection/DebtAndCollection/Restructure/ViewRestructure";
import ListFormRestructure from "../../app/pages/ReceiptAndCollection/DebtAndCollection/Restructure/ListFormRestructure";
import ListDetailRestructure from "../../app/pages/ReceiptAndCollection/DebtAndCollection/Restructure/ListDetailRestructure";
import UploadRestructurePage from "../../app/pages/ReceiptAndCollection/DebtAndCollection/Restructure/Upload/UploadRestructurePage";

import ListFormEarlyRepayment from "../../app/pages/ReceiptAndCollection/DebtAndCollection/Restructure/ListFormEarlyRepayment";

import ViewOffset from "../../app/pages/ReceiptAndCollection/DebtAndCollection/Offset/ViewOffset";
import ListFormOffset from "../../app/pages/ReceiptAndCollection/DebtAndCollection/Offset/ListFormOffset";
import ListDetailOffset from "../../app/pages/ReceiptAndCollection/DebtAndCollection/Offset/ListDetailOffset";

import ViewWriteOff from "../../app/pages/ReceiptAndCollection/DebtAndCollection/WriteOff/ViewWriteOff";
import ListDetailWriteOff from "../../app/pages/ReceiptAndCollection/DebtAndCollection/WriteOff/ListDetailWriteOff";
import ListFormWriteOff from "../../app/pages/ReceiptAndCollection/DebtAndCollection/WriteOff/ListFormWriteOff";

export const DEBT_AND_COLLECTION_ELEMENTS = {
  // Grace Period
  VIEW_GRACE_PERIOD_PAGE: <ViewGracePeriod />,
  DETAIL_GRACE_PERIOD_PAGE: <ListDetailGracePeriod />,
  CREATE_GRACE_PERIOD_PAGE: <FormGracePeriod type="create" />,
  UPDATE_GRACE_PERIOD_PAGE: <FormGracePeriod type="update" />,

  // Activity Name
  VIEW_ACTIVITY_NAME_PAGE: <ViewActivityName />,
  DETAIL_ACTIVITY_NAME_PAGE: <DetailActivityName />,
  CREATE_ACTIVITY_NAME_PAGE: <FormActivityName type="create" />,
  UPDATE_ACTIVITY_NAME_PAGE: <FormActivityName type="update" />,

  // Template Reminding
  VIEW_TEMPLATE_REMINDING_PAGE: <ViewTemplateReminding />,
  DETAIL_TEMPLATE_REMINDING_PAGE: <ListDetailTemplateReminding />,
  CREATE_TEMPLATE_REMINDING_PAGE: <FormTemplateReminding type="create" />,
  UPDATE_TEMPLATE_REMINDING_PAGE: <FormTemplateReminding type="update" />,

  // Activity Type
  VIEW_ACTIVITY_TYPE_PAGE: <ViewActivityType />,
  DETAIL_ACTIVITY_TYPE_PAGE: <DetailActivityType />,
  CREATE_ACTIVITY_TYPE_PAGE: <FormActivityType type="create" />,
  UPDATE_ACTIVITY_TYPE_PAGE: <FormActivityType type="update" />,

  // Activity Action
  VIEW_ACTIVITY_ACTION_PAGE: <ViewActivityAction />,
  DETAIL_ACTIVITY_ACTION_PAGE: <DetailActivityAction />,
  CREATE_ACTIVITY_ACTION_PAGE: <FormActivityAction type="create" />,
  UPDATE_ACTIVITY_ACTION_PAGE: <FormActivityAction type="update" />,

  // Activities
  VIEW_ACTIVITIES_PAGE: <ViewActivities />,
  DETAIL_ACTIVITIES_PAGE: <DetailActivities />,
  CREATE_ACTIVITIES_PAGE: <FormActivities type="create" />,
  UPDATE_ACTIVITIES_PAGE: <FormActivities type="update" />,

  // Transaction Report
  VIEW_TRANSACTION_REPORT_PAGE: <ViewTransactionReport />,

  // Plan Activities
  VIEW_ACTIVITIES_PLAN_PAGE: <ViewActivitiesPlan />,
  DETAIL_ACTIVITIES_PLAN_PAGE: <DetailActivitiesPlan />,
  CREATE_ACTIVITIES_PLAN_PAGE: <FormActivitiesPlan type="create" />,
  UPDATE_ACTIVITIES_PLAN_PAGE: <FormActivitiesPlan type="update" />,

  // Restructure
  VIEW_RESTRUCTURE_PAGE: <ViewRestructure />,
  CREATE_RESTRUCTURE_PAGE: <ListFormRestructure type="create" />,
  UPDATE_RESTRUCTURE_PAGE: <ListFormRestructure type="update" />,
  DETAIL_RESTRUCTURE_PAGE: <ListDetailRestructure />,
  UPLOAD_RESTRUCTURE_PAGE: <UploadRestructurePage />,

  // Early Repayment
  CREATE_EARLY_REPAYMENT_PAGE: <ListFormEarlyRepayment type="create" />,

  // Offset
  VIEW_OFFSET_PAGE: <ViewOffset />,
  CREATE_OFFSET_PAGE: <ListFormOffset type="create" />,
  DETAIL_OFFSET_PAGE: <ListDetailOffset />,

  // Write Off
  VIEW_WRITE_OFF: <ViewWriteOff />,
  DETAIL_WRITE_OFF: <ListDetailWriteOff />,
  CREATE_WRITE_OFF: <ListFormWriteOff type={"create"} />,
  UPDATE_WRITE_OFF: <ListFormWriteOff type={"update"} />,
};
