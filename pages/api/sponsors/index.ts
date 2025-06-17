import { firestore } from 'firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';
import initializeApi from '../../../lib/admin/init';
import { userIsAuthorized } from '@/lib/authorization/check-authorization';

initializeApi();
const db = firestore();

const SPONSORS = '/sponsors';

/**
 *
 * API endpoint to get data of keynote speakers from backend for the keynote speakers section in home page
 *
 * @param req HTTP request object
 * @param res HTTP response object
 *
 *
 */
async function getSponsors(req: NextApiRequest, res: NextApiResponse) {
  const snapshot = await db.collection(SPONSORS).get();
  let data = [];
  snapshot.forEach((doc) => {
    data.push(doc.data());
  });
  res.json(data);
}

async function updateSponsor(req: NextApiRequest, res: NextApiResponse) {
  const sponsorData = JSON.parse(req.body);
  const { originalName, ...updatedSponsorData } = sponsorData;

  const userToken = req.headers['authorization'] as string;
  const isAuthorized = await userIsAuthorized(userToken, ['super_admin']);
  if (!isAuthorized) {
    return res.status(403).json({
      statusCode: 403,
      msg: 'Request is not authorized to perform admin functionality',
    });
  }

  // handles case when a sponsor's name is being changed
  const searchName = originalName || updatedSponsorData.name;

  const sponsorSnapshot = await db.collection(SPONSORS).where('name', '==', searchName).get();
  if (sponsorSnapshot.empty) {
    await db.collection(SPONSORS).add(updatedSponsorData);
    return res.status(201).json({
      msg: 'Sponsor created',
    });
  }

  const updatePromises = sponsorSnapshot.docs.map((doc) =>
    db.collection(SPONSORS).doc(doc.id).update(updatedSponsorData),
  );
  await Promise.all(updatePromises);

  return res.status(200).json({
    msg: 'Sponsor updated',
  });
}

async function deleteSponsor(req: NextApiRequest, res: NextApiResponse) {
  const sponsorData = JSON.parse(req.body);
  const userToken = req.headers['authorization'] as string;
  const isAuthorized = await userIsAuthorized(userToken, ['super_admin']);
  if (!isAuthorized) {
    return res.status(403).json({
      statusCode: 403,
      msg: 'Request is not authorized to perform admin functionality',
    });
  }

  const sponsorSnapshot = await db.collection(SPONSORS).where('name', '==', sponsorData.name).get();
  if (sponsorSnapshot.empty) {
    return res.status(404).json({
      msg: 'Sponsor not found',
    });
  }

  const deletePromises = sponsorSnapshot.docs.map((doc) =>
    db.collection(SPONSORS).doc(doc.id).delete(),
  );
  await Promise.all(deletePromises);

  return res.status(200).json({
    msg: 'Sponsor deleted',
  });
}

function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  return getSponsors(req, res);
}

function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  return updateSponsor(req, res);
}

function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  return deleteSponsor(req, res);
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
    case 'DELETE': {
      return handleDeleteRequest(req, res);
    }
    default: {
      return res.status(404).json({
        msg: 'Route not found',
      });
    }
  }
}
