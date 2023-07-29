import React from 'react';
import { Card, Button } from 'antd';
import { UrlDetail } from '../types';

interface ResultDetailsProps {
  selectedUrlDetail: UrlDetail | null;
  onBackClick: () => void;
}

const ResultDetails: React.FC<ResultDetailsProps> = ({ selectedUrlDetail, onBackClick }) => {
  if (!selectedUrlDetail) {
    return <div>Выберите URL, чтобы увидеть подробности.</div>;
  }

  const { url, details } = selectedUrlDetail;

  return (
    <Card title={`Подробности URL: ${url}`} style={{ width: 500, marginBottom: '16px', backgroundColor: '#f0f0f0' }}>
      <ul>
        {details.map((detail, index) => (
          <li key={index}>{detail}</li>
        ))}
      </ul>
      <Button onClick={onBackClick}>Назад к общим результатам</Button>
    </Card>
  );
};

export default ResultDetails;
