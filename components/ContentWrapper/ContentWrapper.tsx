import React from 'react';

import './ContentWrapper.css';

export default function ContentWrapper({ children }: React.PropsWithChildren) {
    return <div className={'content-wrapper'}>{children}</div>;
}
