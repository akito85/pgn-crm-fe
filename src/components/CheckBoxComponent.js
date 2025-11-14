import InputLabel from "./InputLabel";
import { Checkbox } from "antd";

const CheckBoxComponent = (props) => {
  const {
    label,
    children,
    className,
    checked,
    value,
    disabled,
    onChange = () => {},
  } = props;
  return (
    <div className="flex flex-col">
      {label ? <InputLabel text={label}></InputLabel> : null}
      <Checkbox
        className={`${className}`}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      >
        {children ? children : "-"}
      </Checkbox>
    </div>
  );
};

export default CheckBoxComponent;
