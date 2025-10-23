import { Spin } from 'antd';
import React from 'react';

const SuspenseComponent = () => {
    return (
        <div className="flex justify-center items-center min-h-screen w-full">
            <Spin />
        </div>
    );
}

export default SuspenseComponent;
