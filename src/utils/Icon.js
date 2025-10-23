import SVGIcon from "../assets/Icon/index";

export const IconModal = {
  // Success
  icon_success_default: <SVGIcon name="IconSuccess" width={48} />,
  icon_success_delete: (
    <SVGIcon name="IconDelete" width={48} color={"#A4BE37"} />
  ),
  icon_success_inactivate: (
    <SVGIcon name="IconInactive" width={48} color={"#A4BE37"} />
  ),
  icon_success_activate: (
    <SVGIcon name="IconActiveSuccess" width={48} color={"#A4BE37"} />
  ),

  // Error
  icon_error_default: <SVGIcon name="IconFailed" width={48} />,
  icon_error_delete: <SVGIcon name="IconDelete" width={48} />,
  icon_error_inactivate: <SVGIcon name="IconInactive" width={48} />,
};
