import React from 'react';
import { ContentWrapperProps } from '@/components/ContentWrapper/ContentWrapper.types';

import './ContentWrapper.css';

export default function ContentWrapper({
    children,
    className = '',
}: ContentWrapperProps) {
    return <div className={`content-wrapper ${className}`}>{children}</div>;
}
