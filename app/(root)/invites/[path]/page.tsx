import { BACKEND_URL } from '@/app/api/client/constants';
import { IGetQuestResponse } from '@/app/types/quest-interfaces';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth';

export default async function InvitePage({params}: {params: {path: string}}) {
    const session = await getServerSession(authOptions);
    const resp = await fetch(`${BACKEND_URL}/teams/join/${params.path}/quest`);

    if (resp.status === 200) {
        const data= await resp.json() as IGetQuestResponse;
        const questId = data.quest?.id;

        const joinQuestResp = await fetch(`${BACKEND_URL}/teams/join/${params.path}`, {headers: {'Authorization': `Bearer ${session?.accessToken}`}});
        if (joinQuestResp.status === 200) {
            redirect(`/quest/${questId}`);
        } else {
            redirect(`/quest/${questId}?error=${joinQuestResp.statusText}`);
        }
    }

    return null;
}
