import Image from 'next/image';
import {
    TEXT_LOGO_PATH as questspaceTextLogo,
    ICON_LOGO_PATH as questspaceIconLogo,
} from '@/lib/utils/constants';
import { LogotypeProps } from '@/components/Logotype/Logotype.types';

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
                    style={style}
                    loading={'eager'}
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
                    style={style}
                />
            );
        default:
            return null;
    }
}
