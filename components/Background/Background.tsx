import Image from 'next/image';
import { BackgroundProps } from '@/components/Background/Background.types';

export default function Background({ type, className = '' }: BackgroundProps) {
    switch (type) {
        case 'page':
            return (
                <div className={'background__wrapper'}>
                    <Image
                        className={className}
                        alt={'Красивая карта Екатеринбурга'}
                        src={'/Questspace-Background-Light.svg'}
                        quality={100}
                        fill
                        style={{objectFit: 'cover'}}
                        aria-disabled
                        loading={'eager'}
                        priority
                    />
                </div>
            );
        case 'footer':
            return (
                <div className={'background__wrapper background_footer'}>
                    <Image
                        className={className}
                        alt={'Красивая карта Екатеринбурга'}
                        src={'/Questspace-Background-Light.svg'}
                        width={1920}
                        height={1080}
                        style={{objectFit: 'cover', aspectRatio: 0}}
                        quality={100}
                        aria-disabled
                        loading={'eager'}
                        priority
                    />
                </div>
            );
        default:
            return null;
    }
}
