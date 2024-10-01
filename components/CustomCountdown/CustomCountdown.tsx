import Countdown from 'react-countdown';
import { ComponentProps } from 'react';

export default function CustomCountdown(props: ComponentProps<typeof Countdown>) {
    return <Countdown {...props} />
}
