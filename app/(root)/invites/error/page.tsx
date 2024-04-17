import Background from '@/components/Background/Background';
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import { Button } from 'antd';
import Link from 'next/link';

export default function InviteErrorPage() {
    return (
        <>
            <Background type={'page'} />
            <section className={'page__invites-error'}>
                <ContentWrapper className={'invites-error__content-wrapper'}>
                    <h1 className={'roboto-flex-header'} style={{color: 'var(--primary-color)'}}>Упс...</h1>
                    <p>Кажется, в этой команде закончились места 😢</p>
                    <Link href={'/'}>
                        <Button type={'primary'}>Вернуться на главную</Button>
                    </Link>
                </ContentWrapper>
            </section>
        </>
    );
}