import ViewGracePeriod from "../../app/pages/DebtAndCollection/GracePeriod/ViewGracePeriod";
import ListDetailGracePeriod from "../../app/pages/DebtAndCollection/GracePeriod/DetailGracePeriod";
import FormGracePeriod from "../../app/pages/DebtAndCollection/GracePeriod/FormGracePeriod";

export const DEBT_AND_COLLECTION_ELEMENTS = {
  // Grace Period
  VIEW_GRACE_PERIOD_PAGE: <ViewGracePeriod />,
  DETAIL_GRACE_PERIOD_PAGE: <ListDetailGracePeriod />,
  CREATE_GRACE_PERIOD_PAGE: <FormGracePeriod type="create" />,
  UPDATE_GRACE_PERIOD_PAGE: <FormGracePeriod type="update" />,

};
