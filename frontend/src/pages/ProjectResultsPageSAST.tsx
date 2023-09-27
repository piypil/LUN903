import React, { useEffect, useState, useRef } from 'react';
import { Typography, Row, Col, Descriptions, Tag, Tabs, Collapse, List, Card } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { classname } from '@uiw/codemirror-extensions-classname';
import { langs } from '@uiw/codemirror-extensions-langs';
import LayoutMenu from '../layouts/LayoutMenu';
import { Menu } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';
import { useTheme } from '../components/ThemeContext';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { githubLight } from '@uiw/codemirror-theme-github'

const { Panel } = Collapse;
const { Title } = Typography;
const { TabPane } = Tabs;
const API_BASE_URL = process.env.REACT_APP_API_URL;

function getColor(priority: string) {
  switch (priority) {
    case 'LOW':
      return 'blue';
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

interface VulnerabilitySCA {
  name: string;
  description: string;
  severity: string;
  cwes: string;
  references: {
    url: string;
    name: string;
    source: string;
  }[];
  cvssv3: {
    scope: string;
    version: string;
    baseScore: string;
    impactScore: string;

  };
  cvssAccessVector: string;
}

interface Package {
  id: string;
  url: string;
  confidence: string;
}

interface Dependency {
  md5: string;
  sha1: string;
  sha256: string;
  fileName: string;
  filePath: string;
  isVirtual: boolean;
  evidenceCollected: {
    vendorEvidence: any[];
    productEvidence: any[];
    versionEvidence: any[];
  };
  packages?: Package[];
  vulnerabilities?: VulnerabilitySCA[];

}

const DependencyCard: React.FC<{ dependency: Dependency }> = ({ dependency }) => {
  if (!dependency.vulnerabilities || dependency.vulnerabilities.length === 0) {
    return null;
  }
  return (
    <Card style={{ marginBottom: 20 }}>
      <strong>{dependency.packages?.[0]?.id}</strong>
      <Collapse>
        <Panel header="Просмотр уязвимостей" key="1">
          <List
            dataSource={dependency.vulnerabilities}
            renderItem={(vulnerability: VulnerabilitySCA) => (
              <List.Item>
                <Descriptions column={1}>
                  <Descriptions.Item label="Уязвимость">
                    {vulnerability.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Описание">
                    {vulnerability.description}
                  </Descriptions.Item>
                  <Descriptions.Item label="Критичность">
                    <Tag color={getColor(vulnerability.severity)}>
                      {vulnerability.severity}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="CWE">
                    {vulnerability.cwes}
                  </Descriptions.Item>
                  <Descriptions.Item label="CVSSv3">
                    {vulnerability.cvssv3.baseScore}
                  </Descriptions.Item>
                </Descriptions>
                <Collapse>
                  <Panel header="Ссылки" key="2">
                    {vulnerability.references && vulnerability.references.length > 0 ? (
                      vulnerability.references.slice(0, 3).map((ref, index) => (
                        <div key={index}>
                          <a href={ref.url} target="_blank" rel="noopener noreferrer">
                            {ref.name}
                          </a>
                        </div>
                      ))
                    ) : (
                      <span>Ссылки отсутствуют</span>
                    )}
                  </Panel>
                </Collapse>
              </List.Item>
            )}
          />
        </Panel>
      </Collapse>
    </Card>
  );
};

const ProjectResultsPageSAST: React.FC = () => {
  const { fileHash } = useParams<{ fileHash: string }>();
  const [projectName, setProjectName] = useState<string>('');

  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null);

  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [selectedDependency, setSelectedDependency] = useState<Dependency | null>(null);

  const [code, setCode] = useState<string>('');
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const codeMirrorTheme = theme === 'dark' ? tokyoNight : githubLight;

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
      axios.get(`${API_BASE_URL}/files/${fileHash}/`),
      axios.get(`${API_BASE_URL}/results/${fileHash}/`),
      axios.get(`${API_BASE_URL}/results-sca/${fileHash}/`),
    ])
      .then(([projectResponse, resultsResponse, scaResponse]) => {
        const projectData = projectResponse.data;
        const resultsData = resultsResponse.data;
        setProjectName(projectData.name);
        setVulnerabilities(resultsData[0]?.result_data?.results || []);
        setDependencies(scaResponse.data[0].result_data.dependencies);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [fileHash]);

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

  const shortenPathApi = (path: string): string => {
    const marker = '/lilie/';
    const parts = path.split(marker);
    if (parts.length > 1) {
      const postMarkerPart = parts[1].split('/');
      return postMarkerPart.slice(1).join('/');
    }
    return path;
  };

  const fetchCode = (filePath: string) => {
    axios
      .get(`${API_BASE_URL}/code/?file_path=${shortenPathApi(filePath)}`)
      .then((response) => {
        const data = response.data;
        setCode(data.code);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const shortenPath = (path: string): string => {
    const marker = '/lilie/project_scann/';
    const parts = path.split(marker);
    if (parts.length > 1) {
      const postMarkerPart = parts[1].split('/');
      return postMarkerPart.slice(1).join('/');
    }
    return path;
  };

  const categories = Array.from(new Set(vulnerabilities.map((vuln) => vuln.test_name)));

  return (
    <div className={theme === 'dark' ? 'dark-theme' : ''}>
      <LayoutMenu>
        <Title
          level={2}
          style={{
            color: theme === 'dark' ? '#fff' : '#000'
          }}
        >{projectName}
        </Title>
        <Tabs defaultActiveKey="1">
          <TabPane tab="SAST" key="1">
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
                <Menu mode="inline" theme={theme}
                  style={{
                    height: '50vh',
                    overflowY: 'auto',
                    background: theme === 'dark' ? '#191B26' : '#FFFFFF',
                    color: theme === 'dark' ? '#fff' : '#000',
                  }}
                  defaultOpenKeys={categories}>
                  {categories.map((category) => (
                    <Menu.SubMenu key={category} title={category} icon={<AppstoreOutlined />}>
                      {vulnerabilities
                        .filter((vuln) => vuln.test_name === category)
                        .map((vuln) => (
                          <Menu.Item onClick={() => handleRowClick(vuln)}>
                            {shortenPath(vuln.filename)}
                          </Menu.Item>
                        ))}
                    </Menu.SubMenu>
                  ))}
                </Menu>
                {selectedVulnerability && (
                  <Card title={<span style={{ color: theme === 'dark' ? '#fff' : '#000' }}>{selectedVulnerability.test_name}</span>}
                    bodyStyle={{
                      backgroundColor: theme === 'dark' ? '#191B26' : '#FFFFFF',
                      padding: '20px',
                      fontSize: '16px',
                    }}
                    style={{
                      width: '100%', marginTop: 10,
                      background: theme === 'dark' ? '#191B26' : '#ffffff',
                      color: theme === 'dark' ? '#fff' : '#000',
                    }}
                    className={`${theme}-theme`}>
                    <p>{selectedVulnerability.issue_text}</p>
                    <Descriptions
                      contentStyle={{
                        color: 'red',
                        fontWeight: 'bold',
                      }}
                      bordered
                      column={1}
                    >
                      <Descriptions.Item label="CWE"
                        style={{
                          padding: '10px',
                          fontSize: '14px',
                          borderLeft: '3px solid #ff5733',
                          backgroundColor: theme === 'dark' ? '#121920' : '#FFFFFF',
                          color: theme === 'dark' ? '#fff' : '#000',
                        }}>
                        <a href={selectedVulnerability.issue_cwe.link} target="_blank" rel="noopener noreferrer">
                          {selectedVulnerability.issue_cwe.id}
                        </a>
                      </Descriptions.Item>
                      <Descriptions.Item label="Severity"
                        style={{
                          padding: '10px',
                          fontSize: '14px',
                          borderLeft: '3px solid #ff5733',
                          backgroundColor: theme === 'dark' ? '#121920' : '#FFFFFF',
                          color: theme === 'dark' ? '#fff' : '#000',
                        }}>
                        <Tag color={getColor(selectedVulnerability.issue_severity)}>
                          {selectedVulnerability.issue_severity}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Confidence"
                        style={{
                          padding: '10px',
                          fontSize: '14px',
                          borderLeft: '3px solid #ff5733',
                          backgroundColor: theme === 'dark' ? '#121920' : '#FFFFFF',
                          color: theme === 'dark' ? '#fff' : '#000',
                        }}>
                        <Tag color={getColor(selectedVulnerability.issue_confidence)}>
                          {selectedVulnerability.issue_confidence}
                        </Tag>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                )}
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="SCA" key="2">
            <div>
              {dependencies.map((dependency) => (
                <DependencyCard key={dependency.fileName} dependency={dependency} />
              ))}
            </div>
          </TabPane>
        </Tabs>
      </LayoutMenu>
    </div>
  );
};

export default ProjectResultsPageSAST;
