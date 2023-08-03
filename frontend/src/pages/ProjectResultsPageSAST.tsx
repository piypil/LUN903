import React, { useEffect, useState, useRef } from 'react';
import { Typography, Row, Col, Tabs, Descriptions, Tag } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { classname } from '@uiw/codemirror-extensions-classname';
import { langs } from '@uiw/codemirror-extensions-langs';
import LayoutMenu from '../layouts/LayoutMenu';

const { Title } = Typography;
const { TabPane } = Tabs;
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const codeContainerRef = useRef<HTMLDivElement>(null);

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

  const categories = Array.from(new Set(vulnerabilities.map((vuln) => vuln.test_name)));

  return (
    <div>
      <LayoutMenu>
        <Title level={2}>{projectName}</Title>
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <div className="code-container" style={{ height: '100vh', overflowY: 'auto' }} ref={codeContainerRef}>
              {selectedVulnerability && (
                <CodeMirror value={code} extensions={[themeDemo, classnameExt, langs.python()]} />
              )}
            </div>
          </Col>
          <Col span={8}>
            <Tabs
              tabPosition="left"
              style={{ height: '100vh', overflowY: 'auto' }}
              activeKey={selectedCategory || 'default'}
              onChange={(key) => setSelectedCategory(key)}
            >
              {categories.map((category) => (
                <TabPane tab={category} key={category}>
                  <div>
                    {vulnerabilities
                      .filter((vuln) => vuln.test_name === category)
                      .map((vuln) => (
                        <div
                          key={vuln.test_name}
                          className={`vulnerability-block ${
                            selectedVulnerability === vuln ? 'selected' : ''
                          }`}
                          onClick={() => handleRowClick(vuln)}
                        >
                          <h3>{vuln.test_name}</h3>
                          <p>{vuln.issue_text}</p>
                          {selectedVulnerability === vuln && (
                            <Descriptions bordered column={1}>
                              <Descriptions.Item label="CWE">
                                <a href={vuln.issue_cwe.link} target="_blank" rel="noopener noreferrer">
                                  {vuln.issue_cwe.id}
                                </a>
                              </Descriptions.Item>
                              <Descriptions.Item label="Severity">
                                <Tag color={getColor(vuln.issue_severity)}>
                                  {vuln.issue_severity}
                                </Tag>
                              </Descriptions.Item>
                              <Descriptions.Item label="Confidence">
                                <Tag color={getColor(vuln.issue_confidence)}>
                                  {vuln.issue_confidence}
                                </Tag>
                              </Descriptions.Item>
                            </Descriptions>
                          )}
                        </div>
                      ))}
                  </div>
                </TabPane>
              ))}
            </Tabs>
          </Col>
        </Row>
      </LayoutMenu>
    </div>
  );
};

export default ProjectResultsPageSAST;
