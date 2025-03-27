// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import sendgrid from '@sendgrid/mail';
import qr from 'qrcode';
import { auth, firestore } from 'firebase-admin';
import initializeApi from '../../lib/admin/init';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? '');

initializeApi();

const REGISTRATION_COLLECTION = '/registrations';
const db = firestore();

async function countReg(req: NextApiRequest, res: NextApiResponse) {
  // Count which scans are done

  const snapshot = await db.collection(REGISTRATION_COLLECTION).get();
  const scanCount = new Map<string, number>();
  snapshot.forEach((doc) => {
    const scanRef = doc.get('scans');
    if (scanRef === undefined) return;
    scanRef.forEach((scan) => {
      scanCount.set(scan, (scanCount.get(scan) ?? 0) + 1);
    });
  });
  res.status(200).json({ scans: Object.fromEntries(scanCount) });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await countReg(req, res);
  } else {
    res.status(405).json({});
  }
}
