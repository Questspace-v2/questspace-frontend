import { CSSProperties, ReactNode } from 'react';

export interface ContentWrapperProps {
    className?: string;
    children: ReactNode;
    style?: CSSProperties;
}
