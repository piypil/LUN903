import React from 'react';
import { List, Typography } from 'antd';
import { Link } from "react-router-dom";

const { Text } = Typography;

const GuidesList: React.FC = () => {
  const guides = [
    { title: 'Руководство 1', path: '/guide1' },
    { title: 'Руководство 2', path: '/guide2' },
    { title: 'Руководство 3', path: '/guide3' },
  ];

  return (
    <List
      dataSource={guides}
      renderItem={item => (
        <List.Item>
          <Link to={item.path}>
            <Text>{item.title}</Text>
          </Link>
        </List.Item>
      )}
    />
  );
};

export default GuidesList;
