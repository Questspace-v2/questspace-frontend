import React from 'react';

export default function Body({ children }: React.PropsWithChildren) {
    return <section className={'page-body'}>{children}</section>;
}
