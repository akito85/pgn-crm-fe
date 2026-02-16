import React from "react";
import { Row, Col } from "antd";
import BreadCrumb from "../../components/BreadCrumb";
import LayoutMenu from "../../components/SidebarMenu/LayoutMenu";
import NxBaseContainer from "../../components/Nx/NxBaseContainer";
import TasklistWidget from "./Dashboard/components/TasklistWidget/TasklistWidget";

const Dashboard = () => {

	return (
		<LayoutMenu>
			<BreadCrumb pageName={["Dashboard"]} />
			<div className="dashboard-container">
				<Row gutter={[16, 16]}>
					<Col span={24}>
						<NxBaseContainer header="My Tasks">
							<TasklistWidget />
						</NxBaseContainer>
					</Col>
				</Row>
			</div>
		</LayoutMenu>
	);
};

export default Dashboard;
