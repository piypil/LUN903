// ResultCard.tsx
import React, { useState } from 'react';
import { Card, Tag, Button, Space, Modal } from 'antd';
import { Result, Vulnerability, UrlDetail} from '../types';

interface ResultCardProps {
  key: number;
  result: Result;
  onUrlClick: (urlDetail: UrlDetail) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded((prevExpanded) => !prevExpanded);
  };

  const handleUrlClick = (url: string) => {
    setSelectedUrl(url);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Card title={result.name} style={{ width: 500, marginBottom: '16px', backgroundColor: '#f0f0f0' }}>
      <Space>
        <Button onClick={handleToggleExpand}>
          {isExpanded ? 'Скрыть детали' : 'Показать детали'}
        </Button>
      </Space>
      {isExpanded && result.vulnerabilities ? (
        <>
          {result.vulnerabilities.map((vulnerability: Vulnerability) => (
            <div key={vulnerability.id}>
              <p>{vulnerability.description}</p>
              <ul>
                {vulnerability.urls.map((url: string, index: number) => (
                  <li key={index}>
                    <p>URL: {url}</p>
                    <Button onClick={() => handleUrlClick(url)}>Подробнее</Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      ) : (
        <div>No results data available.</div>
      )}
      <Modal
        title="Дополнительная информация"
        visible={showModal}
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedUrl && (
          <p>Дополнительная информация: {selectedUrl}</p>
        )}
      </Modal>
    </Card>
  );
};

export default ResultCard;
