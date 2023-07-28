import React, { useState } from 'react';
import { Button, Form, Input, message, Space } from 'antd';

interface FormValues {
  url: string;
  projectName: string; 
}

export function ScanURL() {
  const [form] = Form.useForm();
  const [projectName, setProjectName] = useState('');

  const onFinish = async (values: FormValues) => {
    const { url, projectName } = values;
    try {
      const response = await fetch('http://localhost:8000/api/scan-url/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, projectName }),
      });
      const data = await response.json();
      if (response.ok) {
        message.success(data.message || 'Scan started successfully!');
      } else {
        message.error(data.error || 'Error starting scan.');
      }
    } catch (error) {
      message.error('Error starting scan.');
    }
  };

  const onFinishFailed = () => {
    message.error('Submit failed!');
  };

  const onFill = () => {
    form.setFieldsValue({
      url: 'https://target.com/',
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        name="url"
        label="URL"
        rules={[{ required: true, type: 'url', warningOnly: true }, { type: 'string', min: 6 }]}
      >
        <Input placeholder="Input target" />
      </Form.Item>
      <Form.Item
        name="projectName"
        label="Project Name"
        rules={[{ required: true, message: 'Please enter project name.' }]}
      >
        <Input placeholder="Enter project name" onChange={(e) => setProjectName(e.target.value)} />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={onFill}>
            Example
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
