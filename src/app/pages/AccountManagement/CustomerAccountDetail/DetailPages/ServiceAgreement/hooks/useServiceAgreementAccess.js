import { useMemo } from "react";
import { useSelector } from "react-redux";

export const useServiceAgreementAccess = ({
  actionBasePath = "",
  excludedActionPaths = [],
}) => {
  const { access_account } = useSelector((state) => state.accountManagement);

  const filteredAccess = useMemo(() => {
    const actionList = (access_account?.actionList || []).filter((action) => {
      const isBasePathMatched = action.path.includes(actionBasePath);
      const isExcluded = excludedActionPaths.some((path) =>
        action.path.includes(path)
      );

      return isBasePathMatched && !isExcluded;
    });

    return {
      ...access_account,
      actionList,
    };
  }, [access_account, actionBasePath, excludedActionPaths]);

  return {
    accessAccount: access_account,
    filteredAccess,
  };
};
