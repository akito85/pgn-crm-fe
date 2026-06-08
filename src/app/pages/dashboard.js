import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Empty } from "antd";
import BreadCrumb from "../../components/BreadCrumb";
import NxBaseContainer from "../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../components/Nx/NxCardContainer";
import TasklistWidget from "./Dashboard/components/TasklistWidget/TasklistWidget";

const Dashboard = () => {
	const rawToken = useSelector((state) => state.auth?.token);
	const isEmployee = useMemo(() => {
		try {
			const t = JSON.parse(rawToken || "{}");
			return t?.userType === "Employee" && t?.userLevel !== "Super User";
		} catch {
			return false;
		}
	}, [rawToken]);

	return (
		<>
			<BreadCrumb pageName={["Dashboard"]} />
			<NxCardContainer header="DASHBOARD">
				<Row gutter={[16, 16]}>
					{isEmployee ? (
						<Col span={24}>
							<NxBaseContainer border header="MY TASK" className="overflow-hidden">
								<TasklistWidget />
							</NxBaseContainer>
						</Col>
					) : (
						<Col span={24}>
							<div style={{ padding: "48px 0", textAlign: "center" }}>
								<Empty
									image={Empty.PRESENTED_IMAGE_SIMPLE}
									description="No content available"
								/>
							</div>
						</Col>
					)}
				</Row>
			</NxCardContainer>
		</>
	);
};

export default Dashboard;
