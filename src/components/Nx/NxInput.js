import { Input } from "antd";

// Standard-styled antd Input/TextArea: rounded 6px + subtle shadow, matching
// NxSelect so inputs and selects line up at 32px. Spreads props through so antd
// Form.Item binding (value/onChange injection) is untouched.
const baseStyle = {
  borderRadius: "6px",
  boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
};

export const NxTextArea = ({ style, ...rest }) => (
  <Input.TextArea style={{ ...baseStyle, ...style }} {...rest} />
);

const NxInput = ({ style, ...rest }) => (
  <Input style={{ ...baseStyle, ...style }} {...rest} />
);

export default NxInput;
