import Image from 'next/image';
import { BACKGROUND_PATH as backgroundImage } from '@/lib/utils/constants';
import { BackgroundProps } from '@/components/Background/Background.types';

import './Background.css';

export default function Background({ type, className = '' }: BackgroundProps) {
    switch (type) {
        case 'page':
            return (
                <div className={'background-wrapper'}>
                    <Image
                        className={className}
                        alt={'Yekaterinburg background'}
                        src={backgroundImage}
                        quality={100}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            );
        case 'footer':
            return (
                <div className={'background-wrapper'}>
                    <Image
                        className={className}
                        alt={'Yekaterinburg footer'}
                        src={backgroundImage}
                        quality={100}
                        style={{ objectFit: 'contain' }}
                    />
                </div>
            );
        default:
            return null;
    }
}
