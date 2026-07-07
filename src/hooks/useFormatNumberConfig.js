import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGlobalFormatConfig } from "../redux/slices/globalPropSlice";

/**
 * Custom Hook — Format Number Configuration
 *
 * Fetches global format number config (IDR, USD, USAGE, TEMPERATUR,
 * TEKANAN, VOLUME, GHV, ENERGI) from the API via Redux and stores it
 * in state.globalProp.globalProp.
 *
 * Usage:
 *   - Panggil sekali di komponen induk modul Rating / Billing.
 *   - Komponen anak cukup pakai helper dari formatCurrency.js (CurrencyFormatting,
 *     UsageFormatting, dll.) — mereka baca config langsung dari Redux, tidak
 *     perlu memanggil hook ini lagi.
 *
 * @returns {{ loading: boolean, error: any, config: Object }}
 */
const useFormatNumberConfig = () => {
  const dispatch = useDispatch();

  const { globalProp: config, loading, error } = useSelector(
    (state) => state.globalProp
  );

  const isConfigEmpty = !config || Object.keys(config).length === 0;

  useEffect(() => {
    // Hanya fetch kalau config belum ada di Redux (hindari re-fetch tiap render)
    if (isConfigEmpty) {
      dispatch(getGlobalFormatConfig());
    }
  }, [dispatch, isConfigEmpty]);

  return { loading, error, config };
};

export default useFormatNumberConfig;
