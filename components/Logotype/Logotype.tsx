import Image from 'next/image';
import {
    TEXT_LOGO_PATH as questspaceTextLogo,
    ICON_LOGO_PATH as questspaceIconLogo,
} from '@/lib/utils/constants';
import { LogotypeProps } from '@/components/Logotype/Logotype.types';
import { CSSProperties } from 'react';

const cssProperties: CSSProperties = {
    '-webkit-user-select': 'none',
    '-khtml-user-select': 'none',
    '-moz-user-select': 'none',
    '-o-user-select': 'none',
    'user-select': 'none',
};

export default function Logotype({
    width,
    type,
    style = {},
    className = '',
}: LogotypeProps) {
    switch (type) {
        case 'text':
            return (
                <Image
                    className={className}
                    alt={'questspace logotype'}
                    src={questspaceTextLogo}
                    width={width}
                    quality={100}
                    draggable={false}
                    unselectable={'on'}
                    style={cssProperties && style}
                />
            );
        case 'icon':
            return (
                <Image
                    className={className}
                    alt={'questspace logotype'}
                    src={questspaceIconLogo}
                    width={width}
                    quality={100}
                    draggable={false}
                    unselectable={'on'}
                    style={cssProperties && style}
                />
            );
        default:
            return null;
    }
}
