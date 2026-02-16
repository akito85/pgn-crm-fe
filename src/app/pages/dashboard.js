import React from "react";
import { Card, Row, Col } from "antd";
import BreadCrumb from "../../components/BreadCrumb";
import LayoutMenu from "../../components/SidebarMenu/LayoutMenu";
import TasklistWidget from "./Dashboard/components/TasklistWidget/TasklistWidget";

const Dashboard = () => {

	return (
		<LayoutMenu>
			<BreadCrumb pageName={["Dashboard"]} />
			<div className="dashboard-container p-4">
				<Row gutter={[16, 16]}>
					<Col span={24}>
						<Card title="My Tasks" bordered={false}>
							<TasklistWidget />
						</Card>
					</Col>
				</Row>
			</div>
		</LayoutMenu>
	);
};

export default Dashboard;
