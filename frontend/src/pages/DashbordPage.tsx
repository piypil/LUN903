import React, { useState } from 'react';
import { Tabs } from 'antd';
import { TableViewSAST } from '../components/TableViewSAST';
import TableViewDAST from '../components/TableViewDAST';
import LayoutMenu from '../layouts/LayoutMenu';

const { TabPane } = Tabs;

const DashbordPage = () => {
  const [selectedTable, setSelectedTable] = useState<'SAST' | 'DAST'>('SAST');

  const handleTabChange = (key: 'SAST' | 'DAST') => {
    setSelectedTable(key);
  };

  return (
    <div>
      <LayoutMenu>
        <Tabs  centered activeKey={selectedTable} onChange={(key) => handleTabChange(key as 'SAST' | 'DAST')}>
          <TabPane tab="SAST" key="SAST">
            <TableViewSAST />
          </TabPane>
          <TabPane tab="DAST" key="DAST">
            <TableViewDAST />
          </TabPane>
        </Tabs>
      </LayoutMenu>
    </div>
  );
};

export default DashbordPage;
