import React, { useState, ReactNode } from 'react'
import { Layout, Menu, theme, Input, Col, Row, Typography, Button, Popover } from 'antd';

const { Title, Paragraph, Text, Link } = Typography

interface Props {
    issue_text: string
    more_info: string
    children?: ReactNode
}

export default function PopoverCodeDetails({ children, ...props }: Props) {

    const [open, setOpen] = useState(false)

    const content = (
        <div>
            <p>{props.issue_text}</p>
            <p>More info: <a href={props.more_info}>{props.more_info}</a></p>
        </div>
    )

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    return (
        <Popover
            content={content}
            placement='right'
            title="Problem"
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
        >
            {children}
        </Popover>
    )
}
