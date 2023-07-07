import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { useParams } from 'react-router-dom';

interface Result {
  errors: []
  generated_at: string
  metrics: {}
  results:
      {
          code: string
          col_offset: number
          end_col_offset: number
          filename: string
          issue_confidence : string
          issue_cwe: {
              id: number
              link: string
          }
          issue_severity: string
          issue_text: string
          line_number: number
          line_range: number[]
          more_info: string
          test_id: string
          test_name: string
      }[]
}

const ProjectResultsPage: React.FC = () => {
  const { projectId } = useParams();
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/results/${projectId}/`)
      .then(response => response.json())
      .then(data => setResults(data))
      .catch(error => console.error(error));
  }, [projectId]);

  const columns = [
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Test Name', dataIndex: 'test_name', key: 'test_name' },
  ];

  return (
    <div>
      <h1>Результаты проекта {projectId}</h1>
      <Table dataSource={results} columns={columns} />
    </div>
  );
};

export default ProjectResultsPage;
