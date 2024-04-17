import { IGetQuestResponse } from '@/app/types/quest-interfaces';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import { getQuestByTeamInvite, joinTeam } from '@/app/api/api';
import { ITeam } from '@/app/types/user-interfaces';

export default async function InvitePage({params}: {params: {path: string}}) {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
        const [id] = params.path.split('/');
        const redirectParams = new URLSearchParams({route: 'invites', id});
        redirect(`/auth?${redirectParams.toString()}`);
    }

    const data = await getQuestByTeamInvite(params.path, session?.accessToken) as IGetQuestResponse;
    if (data) {
        const questId = data.quest?.id;
        const team = await joinTeam(params.path, session.accessToken) as ITeam;
        if (team) {
            redirect(`/quest/${questId}`);
        } else {
            redirect('/invites/error');
        }
    } else {
        notFound();
    }
}
