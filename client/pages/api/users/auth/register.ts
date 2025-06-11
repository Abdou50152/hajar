import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from 'cookies-next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, password } = req.body;

  // Ici, vous devriez enregistrer l'utilisateur dans votre base de données
  // Ceci est un exemple simplifié
  setCookie('token', 'fake-jwt-token', { req, res, maxAge: 60 * 60 * 24 });
  return res.status(200).json({ success: true });
}