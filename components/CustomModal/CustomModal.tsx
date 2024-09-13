import { Modal } from 'antd';
import { ComponentProps } from 'react';
import classNames from 'classnames';

const customModalClassname = 'custom-modal';

export default function CustomModal ({children, ...props}: ComponentProps<typeof Modal>) {
    return (
        <Modal
            className={classNames(customModalClassname)}
            {...props}
        >
            {children}
        </Modal>
    );
}
