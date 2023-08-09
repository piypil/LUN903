import React, { useEffect, useState, useRef } from 'react';
import { Typography, Row, Col, Descriptions, Tag } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { classname } from '@uiw/codemirror-extensions-classname';
import { langs } from '@uiw/codemirror-extensions-langs';
import LayoutMenu from '../layouts/LayoutMenu';
import { Menu } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { useTheme } from '../components/ThemeContext';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { tokyoNightDay } from '@uiw/codemirror-theme-tokyo-night-day';

const { Title } = Typography;
const API_BASE_URL = process.env.REACT_APP_API_URL;

function getColor(priority: string) {
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
}

interface Vulnerability {
  code: string;
  filename: string;
  test_name: string;
  issue_text: string;
  line_number: number;
  issue_severity: string;
  issue_confidence: string;
  end_col_offset: number;
  issue_cwe: {
    id: number;
    link: string;
  };
}

const ProjectResultsPageSAST: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [projectName, setProjectName] = useState<string>('');
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null);
  const [code, setCode] = useState<string>('');
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const codeMirrorTheme = theme === 'dark' ? tokyoNight : tokyoNightDay;

  const lineHighlightClass = `line-highlight-${theme}`;
  const codeMirrorExtensions = [
    langs.python(),
    classname({
      add: (lineNumber: number) => {
        if (lineNumber === selectedVulnerability?.line_number) {
          return lineHighlightClass;
        }
      },
    }),
  ];

  useEffect(() => {
    Promise.all([
      axios.get(`${API_BASE_URL}/files/${projectId}/`),
      axios.get(`${API_BASE_URL}/results/${projectId}/`),
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

    if (codeContainerRef.current && record.line_number) {
      const lineNumber = record.line_number - 1;
      const lineElements = codeContainerRef.current.getElementsByClassName('CodeMirror-line');
      if (lineElements.length > lineNumber) {
        lineElements[lineNumber].scrollIntoView({ block: 'center' });
      }
    }
  };

  const fetchCode = (filePath: string) => {
    axios
      .get(`${API_BASE_URL}/code/?file_path=${filePath}`)
      .then((response) => {
        const data = response.data;
        setCode(data.code);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const categories = Array.from(new Set(vulnerabilities.map((vuln) => vuln.test_name)));

  return (
    <div className={theme === 'dark' ? 'dark-theme' : ''}>
      <LayoutMenu>
        <Title level={2}>{projectName}</Title>
        <Row gutter={[16, 16]}>
          <Col span={16}>
          <div
          className={`code-container ${theme}-theme`}
          style={{ height: '100vh', overflowY: 'auto' }}
          ref={codeContainerRef}
        >
          {selectedVulnerability && (
            <CodeMirror
              value={code}
              theme={codeMirrorTheme}
              extensions={codeMirrorExtensions}
            />
          )}
        </div>
          </Col>
          <Col span={8}>
            <Menu mode="inline" theme={theme} style={{ height: '50vh', overflowY: 'auto' }} defaultOpenKeys={categories}>
              {categories.map((category) => (
                <Menu.SubMenu key={category} title={category} icon={<AppstoreOutlined />}>
                  {vulnerabilities
                    .filter((vuln) => vuln.test_name === category)
                    .map((vuln) => (
                      <Menu.Item onClick={() => handleRowClick(vuln)}>
                        {vuln.filename}
                      </Menu.Item>
                    ))}
                </Menu.SubMenu>
              ))}
            </Menu>
            {selectedVulnerability && (
              <Card title={selectedVulnerability.test_name} style={{ width: '100%', marginTop: 10 }} className={`${theme}-theme`}>                
              <p>{selectedVulnerability.issue_text}</p>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="CWE">
                    <a href={selectedVulnerability.issue_cwe.link} target="_blank" rel="noopener noreferrer">
                      {selectedVulnerability.issue_cwe.id}
                    </a>
                  </Descriptions.Item>
                  <Descriptions.Item label="Severity">
                    <Tag color={getColor(selectedVulnerability.issue_severity)}>
                      {selectedVulnerability.issue_severity}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Confidence">
                    <Tag color={getColor(selectedVulnerability.issue_confidence)}>
                      {selectedVulnerability.issue_confidence}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}
          </Col>
        </Row>
      </LayoutMenu>
    </div>
  );   
};

export default ProjectResultsPageSAST;
