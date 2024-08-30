import { ALLOWED_USERS_ID } from '@/app/api/client/constants';
import { usePathname } from 'next/navigation';

export const getClassnames = (...classes: string[]) : string => classes.join(' ').trim();

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

export const getCenter = (clientWidth: number, clientHeight: number) => {
    const centerY = clientHeight / 2;
    const centerX = clientWidth / 2;
    return {x: centerX, y: centerY};
}

export const parseToMarkdown = (str?: string): string => str?.replaceAll('\\n', '\n') ?? '';

export const isAllowedUser = (userId: string) : boolean => ALLOWED_USERS_ID.includes(userId);

export const getRedirectParams = () => {
    const location = usePathname();
    const splitParams = location.split('/').slice(1);

    return new URLSearchParams({route: splitParams[0], id: splitParams[1]});
}
