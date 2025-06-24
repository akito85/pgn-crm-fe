import { Input } from "antd";
import InputLabel from "./InputLabel";

const InputGroupComponent = (props) => {
	const { children, label, mandatory } = props;

	return (
		<div>
			<InputLabel text={label} mandatory={mandatory}></InputLabel>
			<Input.Group compact>{children}</Input.Group>
		</div>
	);
};

export default InputGroupComponent;
