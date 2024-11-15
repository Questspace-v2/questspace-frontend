import { Alert } from 'antd';
import { Dispatch, SetStateAction } from 'react';

interface InfoAlertProps {
    setIsInfoAlertHidden: Dispatch<SetStateAction<boolean>>;
}

export default function InfoAlert({ setIsInfoAlertHidden}: InfoAlertProps) {
    const handleClose = () => {
        setIsInfoAlertHidden(true);
    };

    return (
        <Alert
            type='info'
            description='Логи доступны во время квеста и в течение месяца после завершения'
            closable
            showIcon
            onClose={handleClose}
        />
    )
}