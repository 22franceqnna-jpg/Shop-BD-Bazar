import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { db, verifyPassword } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'sbb-secure-shop-bd-bazar-secret-key-2026';

export function createToken(payload: { id: string; username: string; role: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  // Expires in 7 days
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): { id: string; username: string; role: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');
    if (expectedSig !== signature) return null;

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export interface AuthenticatedRequest extends Request {
  adminUser?: { id: string; username: string; role: string };
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin login required.' });
  }

  const token = authHeader.substring(7).trim();
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
  }

  req.adminUser = decoded;
  next();
}
