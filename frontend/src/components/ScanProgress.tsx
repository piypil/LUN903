import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Steps } from 'antd';

const ScanProgress: React.FC = () => {
  return (
    <Steps
      current={1}
      items={[
        {
          title: 'Upload',
        },
        {
          title: 'Scan',
          icon: <Spin tip="Loading" size="large" indicator={<LoadingOutlined style={{ fontSize: 30, color: '#FFCF48' }} spin />}/>,
          subTitle: 'Left 00:00:08',
        },
        {
          title: 'Done',
        },
      ]}
    />

  );
};

export default ScanProgress;
