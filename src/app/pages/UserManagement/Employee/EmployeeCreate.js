import { NavLink, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { Select, Spin, Switch } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import GridLayout from "../../../../components/GridLayout";
import ButtonComponent from "../../../../components/ButtonComponent";
import InputComponent from "../../../../components/InputComponent";
import DateComponent from "../../../../components/DateComponent";
import SelectComponent from "../../../../components/SelectComponent";
import { useState } from "react";

const employeeTypeList = ["Employee Type 1", "Employee Type 2"];
const positionHeaderList = [
	"Main",
	"Job",
	"Position",
	"Start Date",
	"End Date",
];
const jobTypeList = ["Sales", "Job"];
const positionTypeList = ["Sales 1 Depok", "Position"];

const EmployeeCreate = () => {
	const navigate = useNavigate();
	const [employeeNumber, setEmpolyeeNumber] = useState("");
	const [employeeType, setEmployeeType] = useState();
	const [firstName, setFirstName] = useState();
	const [lastName, setLastName] = useState();
	const [phone, setPhone] = useState();
	const [email, setEmail] = useState();
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();
	const [description, setDescription] = useState();
	const [itemValue, setItemValue] = useState([0]);
	const [positionItem, setPositionItem] = useState([
		{
			isMain: false,
			job: "",
			position: "",
			startDate: "",
			endDate: "",
		},
	]);
	const addNewPosition = () => {
		const x = [...itemValue, 0];
		positionItem.push({
			isMain: false,
			job: "",
			position: "",
			startDate: "",
			endDate: "",
		});
		setItemValue(x);
	};
	const removeValueRow = (index) => {
		const a = itemValue.filter((e, i) => i !== index);
		const b = positionItem.filter((e, i) => i !== index);
		setItemValue(a);
		setPositionItem(b);
	};
	const previewEmployee = () => {
		console.log(positionItem);
	};
	const handleChangePosition = (att, value, indexRow) => {
		const newRecord = {
			...positionItem[indexRow],
			[att]: value,
		};
		setPositionItem((pre) => {
			return pre.map((d, ix) => {
				if (indexRow === ix) {
					return newRecord;
				} else {
					return d;
				}
			});
		});
	};
	const clearStateEC = () => {
		setItemValue([0]);
		setDescription("");
		setEmail("");
		setEmployeeType("");
		setEmpolyeeNumber("");
		setFirstName("");
		setLastName("");
		setStartDate("");
		setEndDate("");
		setPhone("");
		setPositionItem([
			{
				isMain: false,
				job: "",
				position: "",
				startDate: "",
				endDate: "",
			},
		]);
	};
	return (
		<LayoutMenu>
			<Spin spinning={false} className={"w-full top-20"} tip={"Loading..."}>
				<BreadCrumb
					pageName={["User Management", "Employee", "Create Employee"]}
				/>
				<NavLink onClick={() => navigate(-1)}>
					<div className="flex align-middle gap-x-2 mb-4">
						<ArrowLeftOutlined
							style={{ fontSize: "24px", color: "#3C6DB2" }}
						></ArrowLeftOutlined>
						<span className="text-dg-blue">Back</span>
					</div>
				</NavLink>
				<BaseContainer header={"EMPLOYEE INFORMATION"}>
					<div className="flex flex-col w-full gap-10">
						<div className={`grid grid-cols-4 w-full gap-x-10 gap-y-4`}>
							<InputComponent
								type="number"
								label={"Employee Number"}
								mandatory
								value={employeeNumber}
								onChange={(e) => setEmpolyeeNumber(e.target.value)}
							></InputComponent>
							<SelectComponent
								// type=""
								mode="multiple"
								label={"Employee Type"}
								mandatory
								value={employeeType}
								onChange={(e) => setEmployeeType(e)}
							>
								{employeeTypeList.map((e) => (
									<Select.Option value={e}>{e}</Select.Option>
								))}
							</SelectComponent>
							<InputComponent
								type="text"
								label={"First Name"}
								mandatory
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
							></InputComponent>
							<InputComponent
								type="text"
								label={"Last Name"}
								mandatory
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
							></InputComponent>
							<InputComponent
								type="text"
								label={"Phone Number"}
								mandatory
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
							></InputComponent>
							<InputComponent
								type="text"
								label={"Email"}
								mandatory
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							></InputComponent>
							<DateComponent label="Start Date" mandatory></DateComponent>
							<DateComponent label="End Date" mandatory></DateComponent>
							<InputComponent
								type="textarea"
								label={"Description"}
								mandatory
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							></InputComponent>
						</div>
					</div>
				</BaseContainer>
				<BaseContainer header={"EMPLOYEE ASSIGNMENT"}>
					<div className="flex flex-col w-full gap-10">
						<div className="flex justify-end">
							<ButtonComponent
								// icon={<PlusCircleFilled style={{ fontSize: "16px" }} />}
								onClick={() => addNewPosition()}
								type="submit"
							>
								Add Position
							</ButtonComponent>
						</div>
						<div className="grid grid-cols-10 gap-x-4 gap-y-6">
							{positionHeaderList.map((e) =>
								e === "Main" ? (
									<div className="text-left col-span-1">{e}</div>
								) : (
									<div className="text-left col-span-2">{e}</div>
								)
							)}
							<div className="col-span-1"></div>
							{positionItem.length &&
								[...itemValue].map((e, i) => (
									<>
										<div className="col-span-1">
											<Switch
												checked={positionItem[i].isMain}
												onChange={(e) => handleChangePosition("isMain", e, i)}
											></Switch>
										</div>
										<div className="col-span-2">
											<SelectComponent
												// type=""
												mandatory
												value={positionItem[i].job}
												onChange={(e) => handleChangePosition("job", e, i)}
											>
												{jobTypeList.map((e) => (
													<Select.Option value={e}>{e}</Select.Option>
												))}
											</SelectComponent>
										</div>
										<div className="col-span-2">
											<SelectComponent
												// type=""
												mandatory
												value={positionItem[i].position}
												onChange={(e) => handleChangePosition("position", e, i)}
											>
												{positionTypeList.map((e) => (
													<Select.Option value={e}>{e}</Select.Option>
												))}
											</SelectComponent>
										</div>
										<div className="col-span-2">
											<DateComponent></DateComponent>
										</div>
										<div className="col-span-2">
											<DateComponent></DateComponent>
										</div>
										{i !== 0 ? (
											<div className="col-span-1">
												<DeleteOutlined
													onClick={(e) => removeValueRow(i)}
													style={{
														fontSize: "24px",
														background: "#FF7171",
														color: "#FFFFFF",
														padding: "5px",
														borderRadius: "4px",
													}}
												/>
											</div>
										) : (
											<div className="col-span-1">
												<DeleteOutlined
													// onClick={(e) => removeValueRow(i)}
													style={{
														fontSize: "24px",
														opacity: 0,
														padding: "5px",
														borderRadius: "4px",
													}}
												/>
											</div>
										)}
									</>
								))}
						</div>

						<div className="flex justify-end">
							<ButtonComponent
								icon={<DeleteOutlined style={{ fontSize: "16px" }} />}
								onClick={() => clearStateEC()}
								type="default"
							>
								Clear
							</ButtonComponent>
							<ButtonComponent
								// icon={<PlusCircleFilled style={{ fontSize: "16px" }} />}
								onClick={() => previewEmployee()}
								type="submit"
							>
								Save
							</ButtonComponent>
						</div>
					</div>
				</BaseContainer>
			</Spin>
		</LayoutMenu>
	);
};

export default EmployeeCreate;
