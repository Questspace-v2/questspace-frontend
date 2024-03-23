import Image from 'next/image';
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
                src={'/Questspace-Text.svg'}
                width={width}
                height={100}
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
                    src={'/Questspace-Icon.svg'}
                    width={width}
                    height={100}
                    quality={100}
                    draggable={false}
                    unselectable={'on'}
                    style={style}
                    loading={'eager'}
                />
            );
    }

    return null;
}
