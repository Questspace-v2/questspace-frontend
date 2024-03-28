'use client'

import React from 'react';
import { ContentWrapperProps } from './ContentWrapper.types';

import './ContentWrapper.css';

export default function ContentWrapper({
    children,
    className = '',
    style = {}
}: ContentWrapperProps) {
    return <div className={`content__wrapper ${className}`} style={style}>{children}</div>;
}
