import { FRONTEND_URL } from '@/app/api/client/constants';


export default function sitemap() {
    return [
        {
            url: FRONTEND_URL,
            lastModified: new Date(),
        },
        {
            url: `${FRONTEND_URL}/auth`,
            lastModified: new Date(),
        },
    ]
}
