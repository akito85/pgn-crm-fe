import { Select } from "antd";
import "./NxSelect.css";

/**
 * Height-matched antd v4 Select. Renders no label (drops into Form.Item or a
 * hand-rolled label block). Pass `options` or children. Single-mode selector is
 * pinned to 32px so it lines up with InputComponent.
 */
const NxSelect = ({ className = "", style, getPopupContainer, ...rest }) => (
  <Select
    className={`nx-select ${className}`.trim()}
    style={{ width: "100%", ...style }}
    // keep the dropdown anchored to its field so it scrolls inside modals
    getPopupContainer={getPopupContainer || ((trigger) => trigger.parentNode)}
    {...rest}
  />
);

export default NxSelect;
