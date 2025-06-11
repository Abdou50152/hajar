import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from 'cookies-next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Admin credentials for testing:
  // Email: admin@example.com
  // Password: admin123

  const { email, password } = req.body;

  try {
    // Appel au backend (elegance) pour l'authentification
    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    // Convertir la réponse en JSON
    const responseData = await response.json();

    // Si l'authentification réussit, stocker le token
    if (responseData && responseData.token) {
      setCookie('token', responseData.token, { req, res, maxAge: 60 * 60 * 24 });
      return res.status(200).json({ success: true, user: responseData.user });
    }

    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la connexion'
    });
  }
}