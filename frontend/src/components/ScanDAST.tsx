import React, { useState } from 'react';
import { Button, Form, Input, message, Space, Modal, Switch, Upload } from 'antd';
import { SettingOutlined, UploadOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/lib/upload';
import CodeMirror from '@uiw/react-codemirror';
import { langs } from '@uiw/codemirror-extensions-langs';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const initialYamlConfig: string = "TEST";


interface FormValues {
  url: string;
  projectName: string;
  openApiFile: any;
  envParams: string;
}

export function ScanDAST() {
  const [form] = Form.useForm();
  const [projectName, setProjectName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const onFinish = async (values: FormValues) => {
    const formData = new FormData();
    // Добавление файла, если он есть
    if (fileList.length > 0) {
      formData.append('openApiFile', fileList[0].originFileObj);
    }
    // Добавление остальных значений из формы
    formData.append('url', values.url);
    formData.append('projectName', values.projectName);
    formData.append('envParams', values.envParams);
    try {
      const response = await fetch(`${API_BASE_URL}/scan-url/`, {
        method: 'POST',
        body: formData,
      });
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

  const onFileChange = (info: UploadChangeParam) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);
    setFileList(newFileList);
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
              <span style={{ width: '150px' }}>Full Scan</span>
              <Switch />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '150px' }}>Fast Scan</span>
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
          <Modal forceRender={true}
            title="Settings"
            visible={modalVisible}
            onOk={() => {
              form.validateFields().then(values => {
                onFinish(values);
                toggleModal();
              }).catch(info => {
                console.log('Validate Failed:', info);
              });
            }}
            onCancel={toggleModal}
            centered
          >
            <Form.Item name="openApiFile" label="OpenAPI Specification File">
              <Upload
                onRemove={() => setFileList([])}
                beforeUpload={() => false}
                fileList={fileList}
                onChange={onFileChange}
              >
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </Form.Item>

            <Form.Item name="envParams" label="ENV ZAP Settings">
              <CodeMirror
                value={"xnjsdfsdfds"}
              />
            </Form.Item>

          </Modal>
        </Space>
      </div >
    </div >
  );
}
