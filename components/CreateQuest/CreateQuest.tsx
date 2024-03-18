import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';

import './CreateQuest.css';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';


export default function CreateQuest() {
    return (
        <ContentWrapper className={'create-quest__content-wrapper'}>
            <div className={'create-quest__header__content'}>
                <Button className={'main-menu__button'} type={'link'} size={'middle'}><ArrowLeftOutlined />Вернуться на главную</Button>
                <h1 className={'roboto-flex-header responsive-header-h1'}>Создание квеста</h1>
            </div>
            <div className={'create-quest__body__content'}>

            </div>
        </ContentWrapper>
    );
}
