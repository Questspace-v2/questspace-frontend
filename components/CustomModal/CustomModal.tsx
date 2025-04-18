import { Modal } from 'antd';
import { ComponentProps, useMemo } from 'react';
import classNames from 'classnames';
import { getCenter } from '@/lib/utils/utils';

export const customModalClassname = 'custom-modal';

export default function CustomModal ({children, ...props}: ComponentProps<typeof Modal>) {
    const { clientWidth, clientHeight } = typeof document !== "undefined" ? document.body : { clientWidth: 0, clientHeight: 0 };
    const centerPosition = useMemo(() => getCenter(clientWidth, clientHeight), [clientWidth, clientHeight]);
    return (
        <Modal
            className={classNames(customModalClassname)}
            mousePosition={centerPosition}
            {...props}
        >
            {children}
        </Modal>
    );
}
