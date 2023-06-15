import React, { useState } from 'react';
import { Col, Row } from 'antd';
import UploadProject from './Upload';

export default function ClientDashboard() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (pdf: File) => {
    setUploadedFile(pdf);
  };

  return (
    <div>
      <Row>
        <Col span={8}>
          <UploadProject onFileUpload={handleFileUpload} />
        </Col>
      </Row>
    </div>
  );
}
