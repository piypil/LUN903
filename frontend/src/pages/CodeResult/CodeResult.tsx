import React, { useState } from 'react'
import { data } from './data'
import { code1 } from './code1'

import { Layout, Menu, theme, Input, Col, Row, Typography, Button, Popover, Space, Divider, Tag } from 'antd';
import './CodeResult.css'
import PopoverCodeDetails from './components/PopoverCodeDetails';
import CodeMirror from '@uiw/react-codemirror';
import { classname } from '@uiw/codemirror-extensions-classname';
import { EditorView } from '@codemirror/view';
import { langs } from '@uiw/codemirror-extensions-langs';

const { Title, Paragraph, Text, Link } = Typography

export default function CodeResult() {

  const getColor = (priority: String) => {
    switch (priority) {
      case 'LOW':
        return 'default'
      case 'MEDIUM':
        return 'orange'
      case 'HIGH':
        return 'red'
    }
  }

  const [code, setCode] = useState<string|undefined>()
  const [codeLine, setCodeLine] = useState<number|undefined>()

  const editor = CodeMirror

  const handleClickCodeTrouble = (code: string | undefined, line: number | undefined) => {
    setCode(code)
    setCodeLine(line)
  }

  const themeDemo = EditorView.baseTheme({
    '&dark .line-color': { backgroundColor: 'orange' },
    '&light .line-color': { backgroundColor: 'orange' },
  });

  const classnameExt = classname({
    add: (lineNumber: number) => {
      if (lineNumber == codeLine) {
        return 'line-color';
      }
    },
  });

  return (
    <Row style={{ height: '100%' }} gutter={32}>
      <Col span={12} style={{ height: '100%', overflow: 'auto' }}>
        {data.results.map((item, i) => {
          return <div key={i}>
            <Paragraph italic type='secondary'>
              {item.filename + ": " + item.line_number + " "}
              <Tag color={getColor(item.issue_confidence)}>
                {item.issue_confidence}
              </Tag>
            </Paragraph>
            <div className='codeBlock'>
            <PopoverCodeDetails issue_text={item.issue_text} more_info={item.more_info}>
                <div onClick={() => handleClickCodeTrouble(item.fullCode, item.line_number)}>
                  {item.code.split('\n').filter(el => el.trim() !== '').map((line, i) => {
                    return <Text code>{line} <br/></Text>
               
                  })}
                </div>
            </PopoverCodeDetails>
            </div>
            <Divider />
          </div>
        })}
      </Col>
      <Col span={12} style={{ height: '100%', overflow: 'auto' }}>
        <CodeMirror
          extensions={[themeDemo, classnameExt, langs.python()]}
          editable={false}
          value={code}
        />
      </Col>
    </Row>
  )
}
