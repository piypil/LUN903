import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Input, Col, Row, Button, message, Upload } from 'antd';
import axios from 'axios';
import { useTheme } from '../components/ThemeContext';

const API_BASE_URL = process.env.REACT_APP_API_URL;

interface UploadFileProps {
  setShowSuccessMessage: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UploadFile({ setShowSuccessMessage }: UploadFileProps) {
  const { Dragger } = Upload;
  const { theme } = useTheme();

  const textColor = theme === 'dark' ? '#f0f0f0' : '#121920';

  const [fileList, setFileList] = useState<any[]>([]);
  const [projectName, setProjectName] = useState('');

  const handleFileChange = (info: any) => {
    setFileList(info.fileList);
  };

  const handleFileUpload = async (zip: File) => {
    try {
      const formData = new FormData();
      formData.append('file', zip);
      formData.append('name', projectName);

      await axios.post(`${API_BASE_URL}/files/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);

    } catch (error) {
      message.error(`${zip.name} ошибка загрузки файла.`);
      console.log(error);
    }
  };

  return (
    <div style={{ marginBottom: 16, color: textColor }}>
      <Row gutter={16} justify="center" align="middle">
        <Col xs={24} sm={10}>
          <Input
            placeholder="Название проекта"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            style={{ color: textColor }}
          />
        </Col>
        <Col xs={24} sm={10}>
          <Button block type="primary" onClick={() => fileList.length > 0 && handleFileUpload(fileList[0].originFileObj)}>
            Анализировать
          </Button>
        </Col>
        <Col xs={24} sm={14} style={{ padding: '8px' }}>
          <Dragger
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false}
            style={{ width: '100%', color: textColor }}
            multiple={false}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text" style={{ color: textColor }}>Кликните или перетащите файл для загрузки</p>
          </Dragger>
        </Col>
      </Row>
      <br />
    </div>
  );
}
