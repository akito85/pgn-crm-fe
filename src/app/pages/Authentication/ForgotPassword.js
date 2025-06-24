import React, { useState, useEffect } from "react";
import { Form, Input, Card, Select, Spin, Alert } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { bgLogin, pgnLogo } from "../../../assets/img";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "../../../redux/slices/message";
import { ModalError, ModalSuccess } from "../../../components/Modal/ModalPopUp";
import ButtonComponent from "../../../components/ButtonComponent";
import { forgotPassword, getEntities, logoutTokenExpired } from "../../../redux/slices/user_management/auth";
import { hideModalError, hideModalSuccess } from "../../../redux/slices/general_slice";
import SVGIcon from "../../../assets/Icon/index.js";
import { formMessageRequired } from "../../../utils/index.js";
const ForgotPassword = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { data_entities, loading } = useSelector((state) => state.auth);
	const type = location?.state?.type;
	const dispatch = useDispatch();
	const [openModal, setOpenModal] = useState(false);
	const { bodyError, modalError, bodySuccess, modalSuccess } = useSelector(
		(state) => state.general
	);
	const handleCloseModalSuccess = () => {
		dispatch(hideModalSuccess());
		navigate(-1);
	};
	const handleCloseModalError = () => {
		dispatch(hideModalError());
		// if (bodyError?.return === true) {
		// 	navigate(-1);
		// } else

		if (bodyError?.code === 401) {
			dispatch(logoutTokenExpired());
		}
	};
	useEffect(() => {
		dispatch(clearMessage());
		if (type === 'enduser') {
			dispatch(getEntities()).unwrap()
		}
	}, [dispatch, type]);

	const handleUsernameEmail = async (formValue) => {
		await dispatch(forgotPassword({ type: type, body: formValue })).unwrap();
	};
	const handleCancel = () => {
		setOpenModal(false);
	};
	const options = data_entities?.data?.map((item) => {
		return {
			value: item?.id,
			label: item?.name
		}
	})
	return (
		<Spin spinning={loading}>
			<div className="w-screen h-screen grid grid-cols-12 dark:bg-dark-blue">
				<div
					className="col-span-12 flex bg-no-repeat bg-cover w-full justify-end items-center"
					style={{
						backgroundImage: `url(${bgLogin})`,
					}}
				>
					<div className={"w-full h-screen bg-transparent"}></div>
					<Card style={{ width: "50%", height: "100%" }}>
						<div className={"w-full"}>
							{/* header card */}
							<div className={"flex flex-col gap-8 "}>
								<img
									className="mx-auto mt-7 h-12 w-auto"
									src={pgnLogo}
									alt="Your Company"
								/>
							</div>

							{/* form */}
							<ButtonComponent
								type={"default"}
								icon={
									<ArrowLeftOutlined
										style={{ fontSize: "24px", color: "#3C6DB2" }}
										className={"pl-5"}
									/>
								}
								border={false}
								onClick={() => navigate(-1)}
							/>

							<h2 className="text-base tracking-tight dark:text-[#3C6DB2] ml-11">
								Forgot Password
							</h2>

							<div
								className={
									"flex flex-col justify-center items-center w-full px-11 mt-8"
								}
							>
								<Form
									name="normal_login"
									layout="vertical"
									onFinish={handleUsernameEmail}
									className={"w-full"}
								>
									<Form.Item
										label={<span>Enter your username</span>}
										name="username"
										rules={[
											{
												required: true,
												message: "Please input your username!",
											},
										]}
									>
										<Input
											size="large"
											placeholder="Username"
											className="bg-transparent w-full"
											style={{ borderRadius: "9px" }}
										/>
									</Form.Item>
									{type !== "superuser" &&
										<Form.Item
											name="entityId"
											label={<span>Entity</span>}
											rules={formMessageRequired('entity')}
										>
											<Select
												options={options}
												placeholder={'Choose your entity'}
											/>
										</Form.Item>
									}
									<div
										className={
											"w-full flex flex-col items-center justify-center mt-5"
										}
									>
										<Form.Item className={"w-full"}>
											{/* <Link to={"/forgot-password"}> */}
											<button
												type="submit"
												// onClick={handleUsernameEmail}
												className={
													"bg-[#3C6DB2] hover:bg-[#3663a2] text-white text-sm px-4 py-4 border rounded-lg w-full border-none cursor-pointer"
												}
											>
												<span>Submit</span>
											</button>
											{/* </Link> */}
										</Form.Item>
									</div>
								</Form>
							</div>
							{/* footer card*/}
							<span className="dark:text-[#0880AE] text-[10px] flex justify-center mb-8">
								Copyrights © 2022 Astra Graphia Information Technology. All rights
								reserved
							</span>
						</div>
					</Card>
				</div>

				<ModalSuccess
					isOpen={modalSuccess}
					handleOk={handleCloseModalSuccess}
					handleCancel={handleCloseModalSuccess}
					width={550}
				>
					<div className="px-8 py-8 justify-center">
						<div className="w-full flex gap-[20px]">
							<SVGIcon name="IconSuccess" width={48} />
							<p className="text-[18px] font-bold">{bodySuccess?.title}</p>
						</div>
						<p className="pl-[70px]">{bodySuccess?.description}</p>
						{bodySuccess?.alertDescription && (
							<Alert type="error" message={bodySuccess?.alertDescription} />
						)}
					</div>
				</ModalSuccess>
				<ModalError
					isOpen={modalError}
					handleOk={handleCloseModalError}
					handleCancel={handleCloseModalError}
				>
					<div className="px-5 pt-5 pb-[10px] justify-center">
						<div className="w-full flex gap-[20px]">
							<SVGIcon name="IconFailed" width={48} />
							<p className="text-[18px] font-bold">{bodyError?.title}</p>
						</div>
						<p className="pl-[70px]">{bodyError?.description}</p>
						{
							(bodyError?.data || []).map((item) => (
								<ul className="pl-[70px]">
									<li>
										{Object.values(item)[0]}
									</li>
								</ul>
							))
						}
						<p className="pl-[70px]">Please try again.</p>
					</div>
				</ModalError>
			</div>
		</Spin>
	);
};

export default ForgotPassword;
