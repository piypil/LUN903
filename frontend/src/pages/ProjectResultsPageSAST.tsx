import React, { useEffect, useState } from 'react';
import { Typography, Row, Col } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { classname } from '@uiw/codemirror-extensions-classname';
import { langs } from '@uiw/codemirror-extensions-langs';
import LayoutMenu from '../layouts/LayoutMenu'

const { Title } = Typography;

interface Vulnerability {
  code: string;
  filename: string;
  test_name: string;
  issue_text: string;
  line_number: number;
  end_col_offset: number;
}

const ProjectResultsPageSAST: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [projectName, setProjectName] = useState<string>('');
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null);
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:8000/api/files/${projectId}/`),
      axios.get(`http://localhost:8000/api/results/${projectId}/`),
    ])
      .then(([projectResponse, resultsResponse]) => {
        const projectData = projectResponse.data;
        const resultsData = resultsResponse.data;
        setProjectName(projectData.name);
        setVulnerabilities(resultsData[0]?.result_data?.results || []);
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

  const getColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'default';
      case 'MEDIUM':
        return 'orange';
      case 'HIGH':
        return 'red';
      default:
        return 'default';
    }
  };

  const themeDemo = EditorView.baseTheme({
    '&dark .line-color': { backgroundColor: 'orange' },
    '&light .line-color': { backgroundColor: 'orange' },
  });

  const classnameExt = classname({
    add: (lineNumber: number) => {
      if (lineNumber === selectedVulnerability?.line_number) {
        return 'line-color';
      }
    },
  });

  return (
    <div>
      <LayoutMenu>
      <Title level={2}>{projectName}</Title>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <div className="code-container">
            {selectedVulnerability && (
              <CodeMirror
                value={code}
                extensions={[themeDemo, classnameExt, langs.python()]}
              />
            )}
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
      </LayoutMenu>
    </div>
  );
};

export default ProjectResultsPageSAST;
