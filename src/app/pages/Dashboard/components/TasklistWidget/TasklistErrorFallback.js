import React from "react";
import { Button, Result } from "antd";

const TasklistErrorFallback = ({ error, onRetry }) => {
  const errorMessage = error?.data?.message || error?.message || "Failed to load tasklist";
  const errorCode = error?.status || error?.code || "UNKNOWN";

  return (
    <Result
      status="error"
      title="Failed to Load Tasklist"
      subTitle={`${errorMessage} (Code: ${errorCode})`}
      extra={[
        <Button type="primary" key="retry" onClick={onRetry}>
          Retry
        </Button>,
      ]}
    />
  );
};

export default TasklistErrorFallback;
