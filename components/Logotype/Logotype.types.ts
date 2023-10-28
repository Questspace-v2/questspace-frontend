import { CSSProperties } from 'react';

export interface LogotypeProps {
    className?: string;
    style?: CSSProperties;
    width: number;
    type: 'icon' | 'text';
}
