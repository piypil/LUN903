import React, { useState } from 'react';
import { Tabs } from 'antd';
import { TableViewSAST } from '../components/TableViewSAST';
import TableViewDAST from '../components/TableViewDAST';
import LayoutMenu from '../layouts/LayoutMenu';

const { TabPane } = Tabs;

const DashbordPage = () => {
  const [selectedTable, setSelectedTable] = useState<'SAST/SCA' | 'DAST'>('SAST/SCA');

  const handleTabChange = (key: 'SAST/SCA' | 'DAST') => {
    setSelectedTable(key);
  };

  return (
    <div>
      <LayoutMenu>
        <Tabs  centered activeKey={selectedTable} onChange={(key) => handleTabChange(key as 'SAST/SCA' | 'DAST')}>
          <TabPane tab="SAST/SCA" key="SAST/SCA">
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
