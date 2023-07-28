import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Tag } from 'antd';
import axios from 'axios';

interface ProjectData {
  id: number;
  project_name: string;
  url: string;
  scan_date: string;
  results: Result[] | null;
}

interface Result {
  name: string;
  description: string;
  risk: string;
  confidence: string;
}

const ProjectResultsPageDAST: React.FC = () => {
  const { projectId } = useParams<{ projectId?: string }>();
  const [projectData, setProjectData] = useState<ProjectData | null>(null);

  useEffect(() => {
    if (projectId) {
      axios
        .get('http://localhost:8000/api/scanned-projects/')
        .then((response) => {
          const filteredProject = response.data.find((project: ProjectData) => project.id === parseInt(projectId));
          setProjectData(filteredProject);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [projectId]);

  if (!projectData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{projectData.project_name}</h2>
      <p>Scan Date: {projectData.scan_date}</p>
      {projectData.results ? (
        Array.isArray(projectData.results) ? (
          projectData.results.map((result: Result, index: number) => (
            <Card key={index} title={result.name} style={{ width: 500 }}>
              <p>{result.description}</p>
              <Tag color="orange">Риск: {result.risk}</Tag>
              <Tag color="blue">Уверенность: {result.confidence}</Tag>
            </Card>
          ))
        ) : (
          (() => {
            try {
              const resultsArray = JSON.parse(projectData.results);
              if (Array.isArray(resultsArray)) {
                return resultsArray.map((result: Result, index: number) => (
                  <Card key={index} title={result.name} style={{ width: 500 }}>
                    <p>{result.description}</p>
                    <Tag color="orange">Риск: {result.risk}</Tag>
                    <Tag color="blue">Уверенность: {result.confidence}</Tag>
                  </Card>
                ));
              } else {
                return <div>Results data is not in the correct format.</div>;
              }
            } catch (error) {
              return <div>Results data is not in the correct format.</div>;
            }
          })()
        )
      ) : (
        <div>No results data available.</div>
      )}
    </div>
  );
};

export default ProjectResultsPageDAST;
