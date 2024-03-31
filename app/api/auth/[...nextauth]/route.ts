import NextAuth from 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next';
import authOptions from '@/app/api/auth/[...nextauth]/auth';

type CombineRequest = Request & NextApiRequest;
type CombineResponse = Response & NextApiResponse;

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const handler =  (req: CombineRequest, res: CombineResponse) => NextAuth(req, res, authOptions);

export {handler as GET, handler as POST};
