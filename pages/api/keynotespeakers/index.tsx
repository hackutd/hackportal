import { firestore } from 'firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';
import initializeApi from '../../../lib/admin/init';
import { userIsAuthorized } from '@/lib/authorization/check-authorization';

initializeApi();
const db = firestore();

const KEYNOTE_SPEAKERS = '/keynotespeakers';
const SPEAKER = 'keySpeaker';

/**
 *
 * API endpoint to get data of keynote speakers from backend for the keynote speakers section in home page
 *
 * @param req HTTP request object
 * @param res HTTP response object
 *
 *
 */
async function getKeynoteSpeakers(req: NextApiRequest, res: NextApiResponse) {
  const snapshot = await db.collection(KEYNOTE_SPEAKERS).limit(1).get();
  if (snapshot.empty) {
    // Define default data
    const defaultData = {
      name: 'Default Speaker',
      title: 'Keynote Speaker',
      description: 'This is a placeholder bio for the keynote speaker.',
      img: '',
    };

    // Create a new document with default data
    const newDocRef = await db.collection(KEYNOTE_SPEAKERS).add(defaultData);
    const newDoc = await newDocRef.get();

    res.status(200).json(newDoc.data());
    return;
  }
  res.status(200).json(snapshot.docs[0].data());
}

async function UpdateKeynoteSpeaker(req: NextApiRequest, res: NextApiResponse) {
  const form = JSON.parse(req.body);
  const { headers } = req;
  const userToken = headers['authorization'];
  const isAuthorized = await userIsAuthorized(userToken, ['super_admin']);

  if (!isAuthorized) {
    return res.status(403).json({
      msg: 'Request is not authorized to perform admin functionality.',
    });
  }

  const snapshot = await db.collection(KEYNOTE_SPEAKERS).limit(1).get();

  const doc = snapshot.docs[0];
  await doc.ref.update(form);

  res.status(200).json({ msg: 'ok' });
}

function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  return getKeynoteSpeakers(req, res);
}

function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  return UpdateKeynoteSpeaker(req, res);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case 'GET': {
      return handleGetRequest(req, res);
    }
    case 'POST': {
      return handlePostRequest(req, res);
    }
    default: {
      return res.status(404).json({
        msg: 'Route not found',
      });
    }
  }
}
