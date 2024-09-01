import {MetadataRoute} from 'next';
import { FRONTEND_URL } from '@/app/api/client/constants';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: ['/', '/auth', '/quest/'],
            disallow: []
        },
        sitemap: `${FRONTEND_URL}/sitemap.xml`
    }
}
