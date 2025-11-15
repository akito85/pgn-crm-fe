import ViewGracePeriod from "../../app/pages/DebtAndCollection/GracePeriod/ViewGracePeriod";
import ListDetailGracePeriod from "../../app/pages/DebtAndCollection/GracePeriod/DetailGracePeriod";
import FormGracePeriod from "../../app/pages/DebtAndCollection/GracePeriod/FormGracePeriod";

import ViewActivityName from "../../app/pages/DebtAndCollection/ActivityName/ViewActivityName";
import DetailActivityName from "../../app/pages/DebtAndCollection/ActivityName/DetailActivityName";
import FormActivityName from "../../app/pages/DebtAndCollection/ActivityName/FormActivityName";

import ViewTemplateReminding from "../../app/pages/DebtAndCollection/TemplateReminding/ViewTemplateReminding";
import ListDetailTemplateReminding from "../../app/pages/DebtAndCollection/TemplateReminding/DetailTemplateReminding";
import FormTemplateReminding from "../../app/pages/DebtAndCollection/TemplateReminding/FormTemplateReminding";

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

};
