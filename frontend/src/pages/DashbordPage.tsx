import React from 'react'
import { TableView } from '../components/TableView';
import LayoutMenu from '../layouts/LayoutMenu'

export function DashbordPage() {
  return (
    <div>
      <LayoutMenu>
      <TableView/>
      </LayoutMenu>
    </div>
  )
}