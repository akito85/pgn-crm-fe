import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGlobalFormatConfig } from "../redux/slices/globalPropSlice";

const useFormatNumberConfig = () => {
  const dispatch = useDispatch();

  const { globalProp: config, loading, error } = useSelector(
    (state) => state.globalProp
  );

  const isConfigEmpty = !config || Object.keys(config).length === 0;

  useEffect(() => {
    if (isConfigEmpty) {
      dispatch(getGlobalFormatConfig());
    }
  }, [dispatch, isConfigEmpty]);

  return { loading, error, config };
};

export default useFormatNumberConfig;
