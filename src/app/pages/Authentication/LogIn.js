import React, { useState, useEffect } from "react";
import { Checkbox, Form, Input, Card, Spin, Carousel } from "antd";
import {
	ExclamationCircleFilled,
	EyeInvisibleOutlined,
	EyeTwoTone,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { bgLogin, pgnLogo } from "../../../assets/img";
import { useDispatch, useSelector } from "react-redux";
import { getEntities, login, logoutTokenExpired } from "../../../redux/slices/user_management/auth";
import {
	LoadCanvasTemplate,
	loadCaptchaEnginge,
	validateCaptcha,
} from "react-simple-captcha";
import { setUserLevel } from "../../../redux/slices/user_management/user_level_slice";
import { clearBodyMessage, hideModalError, showModalError } from "../../../redux/slices/general_slice";
import { ModalError } from "../../../components/Modal/ModalPopUp";
import { formMessageRequired } from "../../../utils";
import SelectComponent from "../../../components/SelectComponent";
import { checkLoginBackground } from "../../../redux/slices/system_setup/login_background";
import NotFound from "../../NotFound";
const LogIn = (props) => {
	const { type } = props;
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { loading, data_entities, isLoggedIn } = useSelector((state) => state.auth);
	const { data } = useSelector(state => state?.login_background);
	const { bodyError, modalError } = useSelector(
		(state) => state.general
	);
	const [form] = Form.useForm();
	const [failedCaptcha, setfailedCaptcha] = useState(false);
	const [isMaintenance, setIsMaintenance] = useState(false);
	useEffect(() => {
		if (bodyError?.code === 503) {
			setIsMaintenance(true)
		} else {
			setIsMaintenance(false)

		}
	}, [bodyError]);

	
	useEffect(() => {
		loadCaptchaEnginge(8)
		dispatch(setUserLevel(type));
		dispatch(clearBodyMessage())
		dispatch(checkLoginBackground());
		if (type === 'enduser') {
			dispatch(getEntities())
		}
	}, [dispatch, type])


	const options = data_entities?.data?.map((item) => {
		return { value: item?.id, label: item?.name }
	})
	const handleLogin = (formValue) => {
		let data;
		if (validateCaptcha(formValue.captcha)) {
			if (type === "superuser") {
				data = {
					username: formValue.username,
					password: formValue.password,
				}
				dispatch(login({ user: data, level: type, remember: formValue.remember }))
				navigate('/choose-entity')
			} else {
				data = {
					username: formValue.username,
					password: formValue.password,
					entityId: formValue.entityId
				}
				dispatch(login({ user: data, level: type, remember: formValue.remember }))
				navigate('/position')
			}
		} else {
			form.resetFields(['captcha'])
			setfailedCaptcha(true)
			dispatch(showModalError());
		}
	}
	const handleCloseModalError = () => {
		dispatch(hideModalError());
		setfailedCaptcha(false)
		if (bodyError?.return === true) {
			navigate(-1);
		} else if (bodyError?.code === 401) {
			dispatch(logoutTokenExpired());
		}
	};

	return (
		isMaintenance ?
			<NotFound type={'maintenance'} />
			:
			<>
				<Spin spinning={loading || isLoggedIn}>
					<div className="w-full h-screen flex">
						<div className={`${data?.length === 0 ? 'w-full' : 'w-2/3'} h-full`}>
							{data?.length > 0 ?
								<div className="w-full">
									<Carousel  autoplay speed={740}>
										{data?.map((item, key) => (
											<div className="flex justify-center items-center h-screen" key={key}>
												<img src={item?.urlLogo2} className={'mx-auto h-full w-full object-cover'} alt={item?.name} />
											</div>
										))}
									</Carousel>
								</div>
								:
								<div
									className="w-full bg-no-repeat bg-cover h-full"
								>
									<div className="flex justify-center items-center h-screen">
										<img src={bgLogin} className={'h-full w-full  object-cover'} alt={'login'} />
									</div>
								</div>
							}
						</div>
						<Card style={{ width: '50%', height: '100%' }}>
							<div className={"flex flex-col gap-8 "}>
								<img
									className="mx-auto mt-7 h-12 w-auto"
									src={pgnLogo}
									alt="Your Company"
								/>
								<h2 className="text-center text-base tracking-tight dark:text-[#3C6DB2]">
									Please login with your registered account
								</h2>
							</div>
							{/* form */}
							<div
								className={
									"flex flex-col justify-center items-center w-full px-11 mt-[3.62rem]"
								}
							>
								<Form
									name="normal_login"
									layout="vertical"
									initialValues={{
										remember: true,
									}}
									onFinish={handleLogin}
									className={"w-full"}
									form={form}
								>
									<Form.Item
										label={<span>Username</span>}
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
											// prefix={<IconsUser />}
											placeholder="Enter your username"
											className="bg-transparent w-full"
											style={{ borderRadius: "9px" }}
											autoComplete="off"
										/>
									</Form.Item>
									<Form.Item
										label={<span>Password</span>}
										name="password"
										rules={[
											{
												required: true,
												message: "Please input your password!",
											},
										]}
										className={"mt-9"}
									>
										<Input.Password
											placeholder="Enter your password"
											style={{ borderRadius: "5px" }}
											iconRender={(visible) =>
												visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
											}
											autoComplete="off"
										/>
									</Form.Item>
									{
										type !== "superuser" &&
										<Form.Item
											name="entityId"
											label={<span>Entity</span>}
											rules={formMessageRequired('entity')}>
											<SelectComponent
												options={options}
												placeholder={'Choose your entity'}
											/>
										</Form.Item>
									}
									<Form.Item
										label="Security Text"
										style={{ marginBottom: 0 }}
										className={"mt-9"}
									>
										<div
											className={
												"flex justify-between mt-4 w-full  item-center"
											}
										>
											<div className={"flex flex-col"}>
												<Form.Item
													name="captcha"
													rules={[
														{
															required: true,
															message: "Please input captcha!",
														},
													]}
												>
													<Input
														placeholder="Enter the shown text"
														className="bg-transparent text-base"
														style={{ borderRadius: "9px" }}
														size="large"
													/>
												</Form.Item>
												<Form.Item name={"remember"} valuePropName={"checked"}>
													<Checkbox> Remember Me</Checkbox>
												</Form.Item>
											</div>
											<div className="flex justify-end ">
												<LoadCanvasTemplate reloadText="Reload" />
											</div>
										</div>
									</Form.Item>
									<div
										className={
											"w-full flex flex-col items-center justify-center mt-5"
										}
									>
										<Form.Item className={"w-full"}>
											<button
												type="submit"
												className={
													"bg-[#3C6DB2] hover:bg-[#3663a2] text-white text-sm px-4 py-4 border rounded-lg w-full border-none cursor-pointer"
												}
											>
												<span>Login</span>
											</button>
										</Form.Item>
										<Link
											to="/forgot-password"
											state={{ type: type }}
											className=" dark:text-[#3C6DB2] cursor-pointer mb-7"
										>
											Forgot Password
										</Link>
									</div>
								</Form>
							</div>
							{/* footer card*/}
							<span className="dark:text-[#0880AE] text-[10px] flex justify-center mb-8">
								Copyrights © 2022 Astra Graphia Information Technology. All
								rights reserved
							</span>
						</Card>
					</div>
				</Spin>

				{/* modal error */}
				<ModalError
					isOpen={modalError}
					handleOk={handleCloseModalError}
					handleCancel={handleCloseModalError}
					onlyBackButton={true}
				>
					<div className={"flex px-8 py-8"}>
						<ExclamationCircleFilled
							style={{ fontSize: "24px", color: "#C81912" }}
						// className="mb-2"
						/>
						<div className="w-full flex-col">
							<div className="pl-4">
								<span className="text-xl font-bold  text-[#C81912]">
									Oops, login failed...
								</span>
							</div>
							<div className="pl-4 pt-4">
								{failedCaptcha === true ?
									<span className={"text-l"}>
										Captcha Does Not Match
									</span>
									:
									<p>{bodyError?.description}</p>
								}
							</div>
						</div>
					</div>
				</ModalError>

			</>
	)

};

export default LogIn;
