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
        const aspectRatio = 809/104;
        return (
            <Image
                className={className}
                alt={'questspace logotype'}
                src={'/Questspace-Text.svg'}
                width={width}
                height={width / aspectRatio}
                quality={100}
                draggable={false}
                unselectable={'on'}
                style={style && {height: 'auto'}}
                loading={'eager'}
                placeholder={'empty'}
                blurDataURL={'/Questspace-Text.svg'}
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
                    height={width}
                    quality={100}
                    draggable={false}
                    unselectable={'on'}
                    style={style}
                    loading={'eager'}
                    placeholder={'empty'}
                    blurDataURL={'/Questspace-Text.svg'}
                />
            );
    }

    return null;
}
