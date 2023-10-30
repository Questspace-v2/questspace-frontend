import React from 'react';

import './Body.css';

export default function Body({ children }: React.PropsWithChildren) {
    return <section className={'page-body'}>{children}</section>;
}
