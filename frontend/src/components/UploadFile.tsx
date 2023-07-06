import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Input, Col, Row, Button } from 'antd';
import { message, Upload } from 'antd';
import axios from 'axios';

export function UploadFile() {
  const { Dragger } = Upload;

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

      await axios.post('http://127.0.0.1:8000/api/files/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success(`${zip.name} файл успешно загружен.`);

    } catch (error) {
      message.error(`${zip.name} ошибка загрузки файла.`);
      console.log(error);
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <Row>
        <Col span={10}>
          <Input
            size="large"
            placeholder="Название проекта"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </Col>
      </Row>
      <br></br>
      <div style={{ height: '100px' }}>
        <Dragger
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false}
            style={{ width: '230px' }}
          >
          <p className="ant-upload-drag-icon">
          <InboxOutlined />
          </p>
        </Dragger>
      </div>
      <br></br>
      <Row>
        <Col span={10}>
          <Button block type="primary" onClick={() => fileList.length > 0 && handleFileUpload(fileList[0].originFileObj)}>Анализировать</Button>
        </Col>
      </Row>
    </div>
  );
}