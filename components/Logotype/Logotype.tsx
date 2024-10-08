import Image from 'next/image';
import { CSSProperties } from 'react';
import classNames from 'classnames';

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
                className={classNames(className, 'logotype_text')}
                alt={'Текстовый логотип Квестспейса'}
                src={'/Questspace-Text.svg'}
                width={width}
                height={width / aspectRatio}
                quality={100}
                draggable={false}
                unselectable={'on'}
                style={style && {height: 'auto', userSelect: 'none'}}
                loading={'eager'}
                priority
                aria-hidden
            />
        );
    }

    if (type === 'icon') {
            return (
                <Image
                    className={classNames(className, 'logotype_icon')}
                    alt={'Иконка-логотип Квестспейса'}
                    src={'/Questspace-Icon.svg'}
                    width={width}
                    height={width}
                    quality={100}
                    draggable={false}
                    unselectable={'on'}
                    style={style && {userSelect: 'none'}}
                    loading={'eager'}
                    priority
                />
            );
    }

    return null;
}
