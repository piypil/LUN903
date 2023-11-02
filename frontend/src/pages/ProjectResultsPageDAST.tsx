import React, { useEffect, useState } from 'react';
import { Typography, Card, Row, Col, Badge, Descriptions, Button, Collapse, List, Space, Tabs } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LayoutMenu from '../layouts/LayoutMenu';
import { useTheme } from '../components/ThemeContext';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { TabPane } = Tabs;


const API_BASE_URL = process.env.REACT_APP_API_URL;

interface Rule {
  id: string;
  name: string;
  fullDescription: {
    text: string;
  };
  defaultConfiguration: {
    level: string;
  };
  shortDescription: {
    text: string;
  }
  properties: {
    solution?: {
      text: string;
    };
    confidence?: string;
    references?: string[];
  };
}


interface Location {
  properties?: {
    attack?: string;
  };
  physicalLocation: {
    region: {
      snippet?: {
        text: string;
      };
      startLine: number;
    };
    artifactLocation: {
      uri: string;
    };
  };
}

interface ReportResult {
  level: string;
  ruleId: string;
  message: {
    text: string;
  };
  locations: Location[];
  webRequest: {
    body: any;
    method: string;
    target: string;
    headers: Record<string, string>;
    version: string;
    protocol: string;
  };
  webResponse: {
    body: {
      text: string;
    };
    headers: Record<string, string>;
    version: string;
    protocol: string;
    statusCode: number;
    reasonPhrase: string;
    noResponseReceived: boolean;
  };
}

interface APIResponse {
  results: {
    runs: [
      {
        tool: {
          driver: {
            rules: Rule[];
          };
        };
        results: ReportResult[];
      }
    ];
  };
}

const ProjectResultsPageDAST: React.FC = () => {
  const [data, setData] = useState<APIResponse | null>(null);
  const { uuid } = useParams<{ uuid: string }>();
  const { theme } = useTheme();
  const [viewDetails, setViewDetails] = useState(false);
  const [currentResult, setCurrentResult] = useState<ReportResult | null>(null);
  const [filterConfidence, setFilterConfidence] = useState<string | null>(null);



  useEffect(() => {
    axios.get(`${API_BASE_URL}/results-url/${uuid}/`)
      .then(response => setData(response.data))
      .catch(error => console.error("Failed to fetch data:", error));
  }, [uuid]);

  const groupByConfidence = (results: ReportResult[]) => {
    return results.reduce((acc, result) => {
      const rule = data?.results.runs[0].tool.driver.rules.find(r => r.id === result.ruleId);
      const confidence = rule?.properties?.confidence || 'unknown';
      acc[confidence] = (acc[confidence] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const groupByRuleDescription = (results: ReportResult[]): Record<string, ReportResult[]> => {
    return results.reduce<Record<string, ReportResult[]>>((acc, result) => {
      const rule = data?.results.runs[0].tool.driver.rules.find(r => r.id === result.ruleId);
      const ruleDescription = rule?.shortDescription?.text || 'unknown';

      if (!acc[ruleDescription]) {
        acc[ruleDescription] = [];
      }
      acc[ruleDescription].push(result);
      return acc;
    }, {});
  };

  let groupedResults: Record<string, ReportResult[]> = {};

  if (data?.results.runs[0].results) {
    groupedResults = groupByRuleDescription(data.results.runs[0].results);
  } else {
    console.warn("data?.results.runs[0].results is undefined");
  }


  const handleResultClick = (result: ReportResult) => {
    setCurrentResult(result);
    setViewDetails(true);
  };

  const handleBackClick = () => {
    setViewDetails(false);
    setCurrentResult(null);
  };

  const handleConfidenceFilter = (confidence: string | null) => {
    setFilterConfidence(confidence);
  };

  const confidenceCounts = groupByConfidence(data?.results.runs[0].results || []);

  function getConfidenceColor(confidence: string, opacity: number = 1): string {
    switch (confidence) {
      case 'high':
        return `rgba(255, 0, 0, ${opacity})`;
      case 'medium':
        return `rgba(255, 165, 0, ${opacity})`;
      case 'low':
        return `rgba(0, 128, 0, ${opacity})`;
      default:
        return `rgba(128, 128, 128, ${opacity})`;
    }
  }

  return (
    <div className={theme === 'dark' ? 'dark-theme' : ''}>
      <LayoutMenu>
        {!viewDetails ? (
          <>
            <Typography.Title level={2}>Test</Typography.Title>
            <Typography.Title level={3}>Общий обзор</Typography.Title>
            <Row gutter={[16, 16]}>
              {Object.entries(confidenceCounts).map(([confidence, count]) => (
                <Col span={6} key={confidence}>
                  <Card
                    hoverable
                    style={{ borderColor: getConfidenceColor(confidence), borderWidth: 2 }}
                    onClick={() => handleConfidenceFilter(confidence)}
                    title={confidence.charAt(0).toUpperCase() + confidence.slice(1)}
                    headStyle={{ backgroundColor: getConfidenceColor(confidence, 0.1), color: getConfidenceColor(confidence), fontWeight: 'bold' }}
                  >
                    <Typography.Text style={{ fontSize: 24, fontWeight: 'bold' }}>{count}</Typography.Text>
                  </Card>
                </Col>
              ))}
            </Row>
            <Typography.Title level={3}>Report Results:</Typography.Title>
            <Collapse>
              {Object.entries(groupedResults).filter(([_, results]) => {
                if (!filterConfidence) return true;
                const rule = data?.results.runs[0].tool.driver.rules.find(r => r.id === results[0].ruleId);
                return rule?.properties?.confidence === filterConfidence;
              }).map(([ruleDescription, results]) => {
                const rule = data?.results.runs[0].tool.driver.rules.find(r => r.id === results[0].ruleId);
                const confidence = rule?.properties?.confidence;

                return (
                  <Panel header={
                    <div>
                      <Typography.Text strong>{ruleDescription}</Typography.Text>
                      {confidence && (
                        <Badge
                          style={{ marginLeft: 16 }}
                          color={getConfidenceColor(confidence)}
                          text={confidence.charAt(0).toUpperCase() + confidence.slice(1)}
                        />
                      )}
                    </div>
                  } key={ruleDescription}>
                    <List
                      dataSource={results}
                      renderItem={result => {
                        const artifactUri = result.locations?.[0]?.physicalLocation.artifactLocation?.uri;
                        return (
                          <List.Item onClick={() => handleResultClick(result)}>
                            <List.Item.Meta
                              description={artifactUri}
                            />
                          </List.Item>
                        );
                      }}
                    />
                  </Panel>
                );
              })}
            </Collapse>
          </>
        ) : (
          <>
            <Space direction="vertical" style={{ padding: '20px', width: '100%' }}>

              <Button type="primary" onClick={handleBackClick} icon={<ArrowLeftOutlined />}>
                Назад
              </Button>

              <Typography.Title level={2}>
                {currentResult && data?.results.runs[0].tool.driver.rules.find(r => r.id === currentResult.ruleId)?.shortDescription.text}
              </Typography.Title>

              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Descriptions title="Artifact Location" bordered>
                    <Descriptions.Item>
                      <Typography.Text strong>{currentResult?.locations[0]?.physicalLocation.artifactLocation.uri}</Typography.Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Typography.Title level={4}>Level: {currentResult?.level}</Typography.Title>
                  <Typography.Paragraph>
                    <Typography.Text strong>Message:</Typography.Text> {currentResult?.message.text}
                  </Typography.Paragraph>
                </Col>
              </Row>

              <div style={{ padding: '20px' }}>
                <Tabs defaultActiveKey="request" type="card">
                  <TabPane tab="Web Request" key="request">
                    <Descriptions bordered column={1}>
                      <Descriptions.Item label="Method">
                        <Typography.Text strong>{currentResult?.webRequest.method}</Typography.Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="URI">
                        <Typography.Text strong>{currentResult?.webRequest.target}</Typography.Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Headers">
                        <pre>{JSON.stringify(currentResult?.webRequest.headers, null, 2)}</pre>
                      </Descriptions.Item>
                    </Descriptions>
                  </TabPane>
                  <TabPane tab="Web Response" key="response">
                    <Descriptions bordered column={1}>
                      <Descriptions.Item label="Status Code">
                        <Typography.Text strong>{currentResult?.webResponse.statusCode}</Typography.Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Reason">
                        <Typography.Text strong>{currentResult?.webResponse.reasonPhrase}</Typography.Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Headers">
                        <pre>{JSON.stringify(currentResult?.webResponse.headers, null, 2)}</pre>
                      </Descriptions.Item>
                    </Descriptions>
                  </TabPane>
                </Tabs>
              </div>
              
            </Space>
          </>
        )}
      </LayoutMenu>
    </div>
  );
}

export default ProjectResultsPageDAST;
