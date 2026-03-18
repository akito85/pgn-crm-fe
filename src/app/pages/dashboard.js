import React from "react";
import { Row, Col } from "antd";
import BreadCrumb from "../../components/BreadCrumb";
import NxBaseContainer from "../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../components/Nx/NxCardContainer";
import TasklistWidget from "./Dashboard/components/TasklistWidget/TasklistWidget";

const Dashboard = () => {

	return (
		<>
			<BreadCrumb pageName={["Dashboard"]} />
			<NxCardContainer header="DASHBOARD">
				<Row gutter={[16, 16]}>
					<Col span={24}>
						<NxBaseContainer border header="MY TASK" className="overflow-hidden">
							<TasklistWidget />
						</NxBaseContainer>
					</Col>
				</Row>
			</NxCardContainer>
		</>
	);
};

export default Dashboard;
