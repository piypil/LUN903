import React, { useState } from 'react';
import { TableView } from '../components/TableView';
import ProjectTableView from '../components/ProjectTableView';
import LayoutMenu from '../layouts/LayoutMenu';

export function DashbordPage() {
  const [selectedTable, setSelectedTable] = useState<'SAST' | 'DAST'>('SAST');

  const handleSelectSAST = () => {
    setSelectedTable('SAST');
  };

  const handleSelectDAST = () => {
    setSelectedTable('DAST');
  };

  return (
    <div>
      <LayoutMenu>
        <div>
          <button onClick={handleSelectSAST}>SAST</button>
          <button onClick={handleSelectDAST}>DAST</button>
        </div>
        {selectedTable === 'SAST' ? <TableView /> : <ProjectTableView />}
      </LayoutMenu>
    </div>
  );
}
