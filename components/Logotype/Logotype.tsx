import Image from 'next/image';
import {
    TEXT_LOGO_PATH as questspaceTextLogo,
    ICON_LOGO_PATH as questspaceIconLogo,
} from '@/lib/utils/constants';
import { CSSProperties } from 'react';

interface LogotypeProps {
    className?: string;
    style?: CSSProperties;
    width: number;
    type: 'icon' | 'text';
}
export default function Logotype(props: LogotypeProps) {
    const {width,
        type,
        style = {},
        className = ''} = props;

    if (type === 'text') {
        return (
            <Image
                className={className}
                alt={'questspace logotype'}
                src={questspaceTextLogo}
                width={width}
                quality={100}
                draggable={false}
                unselectable={'on'}
                style={style}
                loading={'eager'}
            />
        );
    }

    if (type === 'icon') {
            return (
                <Image
                    className={className}
                    alt={'questspace logotype'}
                    src={questspaceIconLogo}
                    width={width}
                    quality={100}
                    draggable={false}
                    unselectable={'on'}
                    style={style}
                />
            );
    }

    return null;
}
