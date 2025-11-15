import ViewGracePeriod from "../../app/pages/DebtAndCollection/GracePeriod/ViewGracePeriod";
import ListDetailGracePeriod from "../../app/pages/DebtAndCollection/GracePeriod/DetailGracePeriod";
import FormGracePeriod from "../../app/pages/DebtAndCollection/GracePeriod/FormGracePeriod";

import ViewActivityName from "../../app/pages/DebtAndCollection/ActivityName/ViewActivityName";
import DetailActivityName from "../../app/pages/DebtAndCollection/ActivityName/DetailActivityName";
import FormActivityName from "../../app/pages/DebtAndCollection/ActivityName/FormActivityName";

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

};
