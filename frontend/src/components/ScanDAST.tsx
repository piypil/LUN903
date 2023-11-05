import React, { useState } from 'react';
import { Button, Form, Input, message, Space, Modal, Switch } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const API_BASE_URL = process.env.REACT_APP_API_URL;

interface FormValues {
  url: string;
  projectName: string;
}

export function ScanDAST() {
  const [form] = Form.useForm();
  const [projectName, setProjectName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const onFinish = async (values: FormValues) => {
    const { url, projectName } = values;
    try {
      const response = await fetch(`${API_BASE_URL}/scan-url/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, projectName }),
      });
      const textResponse = await response.text();
      console.log("Raw server response:", textResponse);

      const data = JSON.parse(textResponse);
      if (response.ok) {
        message.success(data.message || 'Scan started successfully!');
      } else {
        console.error("Server Response:", data); 
        message.error(data.error || 'Error starting scan.');
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      message.error('Error starting scan.');
    }
  };

  const onFinishFailed = () => {
    message.error('Submit failed!');
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        style={{ width: '45%' }}
      >
        <Form.Item
          name="url"
          rules={[{ required: true, type: 'url', warningOnly: true }, { type: 'string', min: 6 }]}
        >
          <Input placeholder="http://host.docker.internal:port" />
        </Form.Item>
        <Form.Item
          name="projectName"
          rules={[{ required: false, message: 'Please enter project name.' }]}
        >
          <Input placeholder="Название проекта" onChange={(e) => setProjectName(e.target.value)} />
        </Form.Item>
      </Form>
      <div style={{ width: '45%' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '150px' }}>AJAX Spider</span>
              <Switch />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '150px' }}>Default Spider</span>
              <Switch />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '150px' }}>Active Scan</span>
              <Switch />
            </div>
          </Space>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="primary"
              onClick={() => form.submit()}
            >
              ПУСК
            </Button>
            <Button icon={<SettingOutlined />} onClick={toggleModal} style={{ marginLeft: '8px' }}></Button>
          </div>
          <Modal
            title="Settings"
            visible={modalVisible}
            onOk={toggleModal}
            onCancel={toggleModal}
            centered
          >
          </Modal>
        </Space>
      </div>
    </div>
  );
}
