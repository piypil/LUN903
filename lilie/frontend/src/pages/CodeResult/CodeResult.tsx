import React, { useState } from 'react'
import { data } from './data'
import { Layout, Menu, theme, Input, Col, Row, Typography, Button, Popover, Space } from 'antd';
import './CodeResult.css'
import PopoverCodeDetails from './components/PopoverCodeDetails';

const { Title, Paragraph, Text, Link } = Typography

export default function CodeResult() {

  const getColor = (priority: String) => {
    switch (priority) {
      case 'LOW':
        return 'warning'
      case 'MEDIUM':
        return 'warning'
      case 'HIGH':
        return 'danger'
    }
  }

  return (

    <Space direction='vertical'>
      {data.results.map((item, i) => {
        return <Space key={i} direction='vertical'>
          <Text italic type='secondary'>{item.filename}</Text>
          <PopoverCodeDetails issue_text={item.issue_text} more_info={item.more_info}>
            <div>
              <Text type='secondary' style={{ marginRight: 10 }}>{item.line_number}</Text>
              <div style={{ display: 'inline-block', cursor: 'pointer' }} className='codeBlock'>
                {item.code.split('\n').filter(el => el.trim() !== '').map((line, i) => {
                  return <div style={{ whiteSpace: 'pre-wrap' }} key={i}>
                    <Text code type={getColor(item.issue_confidence)}>{line}</Text><br />
                  </div>
                })}
              </div>
            </div>
          </PopoverCodeDetails>
          <br />
        </Space>
      })}
    </Space>
  )
}
