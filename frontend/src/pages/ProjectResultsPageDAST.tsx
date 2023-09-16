import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ResultCard from '../components/ResultCard';
import ResultDetails from '../components/ResultDetails';
import { ProjectData, Result, UrlDetail } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const ProjectResultsPageDAST: React.FC = () => {
  const { fileHash } = useParams<{ fileHash?: string }>();
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [selectedUrlDetail, setSelectedUrlDetail] = useState<UrlDetail | null>(null);

  const handleUrlClick = (urlDetail: UrlDetail) => {
    setSelectedUrlDetail(urlDetail);
  };

  const handleBackClick = () => {
    setSelectedUrlDetail(null);
  };

  useEffect(() => {
    if (fileHash) {
      axios
        .get(`${API_BASE_URL}/scanned-projects/`)
        .then((response) => {
          const filteredProject = response.data.find((project: ProjectData) => project.id === parseInt(fileHash));
          if (filteredProject) {
            const resultsArray = JSON.parse(filteredProject.results);
            setProjectData({ ...filteredProject, results: resultsArray });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [fileHash]);

  if (!projectData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '16px' }}>
        {selectedUrlDetail ? (
          <ResultDetails selectedUrlDetail={selectedUrlDetail} onBackClick={handleBackClick} />
        ) : (
          projectData.results ? (
            Array.isArray(projectData.results) ? (
              projectData.results.map((result: Result, index: number) => (
                <ResultCard key={index} result={result} onUrlClick={handleUrlClick} />
              ))
            ) : (
              (() => {
                try {
                  const resultsArray = JSON.parse(projectData.results);
                  if (Array.isArray(resultsArray) && resultsArray.length > 0) {
                    return resultsArray.map((result: Result, index: number) => (
                      <ResultCard key={index} result={result} onUrlClick={handleUrlClick} />
                    ));
                  } else {
                    return <div>No results data available.</div>;
                  }
                } catch (error) {
                  return <div>Results data is not in the correct format.</div>;
                }
              })()
            )
          ) : (
            <div>No results data available.</div>
          )
        )}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', paddingLeft: '16px' }}>
      </div>
    </div>
  );
};

export default ProjectResultsPageDAST;
