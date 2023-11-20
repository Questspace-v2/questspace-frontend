import React from 'react';
import { ContentWrapperProps } from './ContentWrapper.types';

import './ContentWrapper.css';

export default function ContentWrapper({
    children,
    className = '',
}: ContentWrapperProps) {
    return <div className={`content__wrapper ${className}`}>{children}</div>;
}
