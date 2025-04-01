import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import authOptions from '@/app/api/auth/[...nextauth]/auth';
import { getTaskGroupsAdmin } from '@/app/api/api';
import { ITaskGroupsAdminResponse } from '@/app/types/quest-interfaces';
import ContextProvider from '@/components/Tasks/ContextProvider/ContextProvider';

export const dynamic = 'force-dynamic';


export default async function QuestAdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/auth');
  }

  const questData = await getTaskGroupsAdmin(params.id, session.accessToken) as ITaskGroupsAdminResponse;

  if (!questData) {
    notFound();
  }

  const isCreator = questData.quest.creator.id === session.user.id;

  if (!isCreator) {
    notFound();
  }

  return (
    <ContextProvider questData={questData}>
      {children}
    </ContextProvider>
  );
}