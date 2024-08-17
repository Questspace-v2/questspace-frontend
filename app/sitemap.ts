export default async function sitemap() {
    const baseUrl = process.env.NEXTAUTH_URL;

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/auth`,
            lastModified: new Date(),
        },
    ]
}
