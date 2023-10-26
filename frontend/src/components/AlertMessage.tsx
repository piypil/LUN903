import { Alert, Space } from 'antd';

interface AlertMessageProps {
  showSuccessMessage: boolean;
}

export function AlertMessage({ showSuccessMessage }: AlertMessageProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      {showSuccessMessage && (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="Готово"
            description="Файл успешно загружен."
            type="success"
            showIcon
          />
        </Space>
      )}
    </div>
  );
}
