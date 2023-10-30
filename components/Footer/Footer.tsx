import Logotype from '@/components/Logotype/Logotype';
import Background from '@/components/Background/Background';

import './Footer.css';

export default function Footer() {
    return (
        <div className={'page-footer-wrapper'}>
            <Background className={'footer-background'} type={'footer'} />
            <div className={'page-footer'}>
                <div className={'page-footer__items'}>
                    <Logotype
                        className={'footer-logo'}
                        width={808}
                        type={'text'}
                    />
                    <h5 className={'footer-text'}>
                        from mathmech with ❤️
                        <br />
                        since 2020
                    </h5>
                </div>
            </div>
        </div>
    );
}
