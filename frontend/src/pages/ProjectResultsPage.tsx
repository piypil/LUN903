import React, { useEffect, useState } from 'react';
import { Table, Typography, Row, Col } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const { Title } = Typography;

interface Vulnerability {
  code: string;
  filename: string;
  test_name: string;
  issue_text: string;
  line_number: number;
  end_col_offset: number;
}

const ProjectResultsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null);
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/results/${projectId}/`)
      .then((response) => {
        const data = response.data;
        setVulnerabilities(data[0]?.result_data?.results || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [projectId]);

  const handleRowClick = (record: Vulnerability) => {
    setSelectedVulnerability(record);
    fetchCode(record.filename);
  };

  const fetchCode = (filePath: string) => {
    axios
      .get(`http://localhost:8000/api/code/?file_path=${filePath}`)
      .then((response) => {
        const data = response.data;
        setCode(data.code);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <Title level={2}>Результаты проекта {projectId}</Title>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <div className="code-container">
            <SyntaxHighlighter language="python" style={atomDark} className="code">
              {selectedVulnerability ? code : ''}
            </SyntaxHighlighter>
          </div>
        </Col>
        <Col span={8}>
          {vulnerabilities.map((vulnerability, index) => (
            <div
              key={index}
              className={`vulnerability-block ${selectedVulnerability === vulnerability ? 'selected' : ''}`}
              onClick={() => handleRowClick(vulnerability)}
            >
              <h3>{vulnerability.test_name}</h3>
              <p>{vulnerability.issue_text}</p>
            </div>
          ))}
        </Col>
      </Row>
    </div>
  );
};

export default ProjectResultsPage;
