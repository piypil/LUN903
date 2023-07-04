import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Input, Col, Row, Typography, Button } from 'antd';
import { message, Upload } from 'antd';
import axios from 'axios';

export function UploadFile() {
  const { Dragger } = Upload;
  const { Title } = Typography;

  const [fileList, setFileList] = useState<any[]>([]);
  const [projectName, setProjectName] = useState('');

  const handleFileChange = (info: any) => {
    setFileList(info.fileList);
  };

  const handleFileUpload = async (pdf: File) => {
    try {
      const formData = new FormData();
      formData.append('file', pdf);
      formData.append('name', projectName);

      await axios.post('http://127.0.0.1:8000/api/files/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success(`${pdf.name} файл успешно загружен.`);

    } catch (error) {
      message.error(`${pdf.name} ошибка загрузки файла.`);
      console.log(error);
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <Row>
        <Col span={8}>
          <Title level={4}>Загрузите проект</Title>
          <Input
            size="large"
            placeholder="Название проекта"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </Col>
      </Row>
      <Dragger fileList={fileList} onChange={handleFileChange} beforeUpload={() => false}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Нажмите или перетащите проект для загрузки</p>
        <p className="ant-upload-hint">При большом размере проекта загрузка может занять продолжительное время</p>
      </Dragger>
      {fileList.length > 0 && (
        <p style={{ marginTop: 16 }}>
          Загруженный файл: <strong>{fileList[0].name}</strong>
        </p>
      )}
      <Row>
        <Col span={8}>
          <Button block type="primary" onClick={() => fileList.length > 0 && handleFileUpload(fileList[0].originFileObj)}>Отправить</Button>
        </Col>
      </Row>
    </div>
  );
}