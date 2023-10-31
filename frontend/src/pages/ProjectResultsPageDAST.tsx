import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Descriptions, Tag, Collapse, Badge } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LayoutMenu from '../layouts/LayoutMenu';
import { useTheme } from '../components/ThemeContext';

const { Title } = Typography;
const { Panel } = Collapse;

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
  properties: {
    solution?: {
      text: string;
    };
    confidence?: string;
    references?: string[];
  };
}

interface ReportResult {
  level: string;
  ruleId: string;
  message: {
    text: string;
  };
  locations: {
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
    }[];
  };
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

  useEffect(() => {
    axios.get(`${API_BASE_URL}/results-url/${uuid}/`)
      .then(response => setData(response.data))
      .catch(error => console.error("Failed to fetch data:", error));
  }, [uuid]);

  return (
    <div className={theme === 'dark' ? 'dark-theme' : ''}>
      <LayoutMenu>
        <Title level={2}>Test</Title>
        <Descriptions title="Общий обзор" bordered>
          <Descriptions.Item label="Проект">TEST</Descriptions.Item>
          <Descriptions.Item label="Дата сканирования">Дата сканирования</Descriptions.Item>
          <Descriptions.Item label="Всего уязвимостей">Всего уязвимостей</Descriptions.Item>
          <Descriptions.Item label="Критических">
            <Badge count={12} style={{ backgroundColor: 'red' }} />
          </Descriptions.Item>
        </Descriptions>
        <Title level={3}>Report Results:</Title>
        {data?.results.runs[0].results && (
          <Collapse>
            {data.results.runs[0].results.map((result, index) => (
              <Panel header={`Rule ID: ${result.ruleId}`} key={index}>
                <Title level={4}>Level: {result.level}</Title>
                <p>Message: {result.message.text}</p>
                <div>
                  <Title level={5}>Web Request:</Title>
                  <Descriptions column={1}>
                    <Descriptions.Item label="Method">{result.webRequest.method}</Descriptions.Item>
                    <Descriptions.Item label="URI">{result.webRequest.target}</Descriptions.Item>
                    <Descriptions.Item label="Headers">
                      <pre>{JSON.stringify(result.webRequest.headers, null, 2)}</pre>
                    </Descriptions.Item>
                  </Descriptions>
                </div>
                <div>
                  <Title level={5}>Web Response:</Title>
                  <Descriptions column={1}>
                    <Descriptions.Item label="Status Code">{result.webResponse.statusCode}</Descriptions.Item>
                    <Descriptions.Item label="Reason">{result.webResponse.reasonPhrase}</Descriptions.Item>
                    <Descriptions.Item label="Headers">
                      <pre>{JSON.stringify(result.webResponse.headers, null, 2)}</pre>
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </Panel>
            ))}
          </Collapse>
        )}

      </LayoutMenu>
    </div>
  );
};


export default ProjectResultsPageDAST;
