import { firestore } from 'firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';
import { fieldNames, statRecordTypes } from '../../hackportal.config';
import initializeApi from '../../lib/admin/init';
import { userIsAuthorized } from '../../lib/authorization/check-authorization';
import { arrayFields, singleFields } from '../../lib/stats/field';

initializeApi();
const db = firestore();

const USERS_COLLECTION = '/registrations';
const SCANTYPES_COLLECTION = '/scan-types';

async function getCheckInEventName() {
  const snapshot = await db.collection(SCANTYPES_COLLECTION).where('isCheckIn', '==', true).get();
  let checkInEventName = '';
  snapshot.forEach((doc) => {
    checkInEventName = doc.data().name;
  });
  return checkInEventName;
}

async function getStatsData() {
  const checkInEventName = await getCheckInEventName();
  // const swagData: Record<string, number> = {};
  const statRecords: any = {};
  for (const field in fieldNames) {
    statRecords[field] = {};
  }

  const generalStats: GeneralStats & statRecordTypes = {
    superAdminCount: 0,
    checkedInCount: 0,
    hackerCount: 0,
    adminCount: 0,
    scans: {},
    timestamp: {},
    codeOfConduct: {},
    disclaimer: {},
    ...statRecords,
  };
  const scoreData = await db.collection('/scoring').get();
  const userScoreMapping = new Map<string, number>();
  scoreData.forEach((doc) => {
    const currentUserScore = userScoreMapping.has(doc.data().hackerId)
      ? userScoreMapping.get(doc.data().hackerId)
      : 0;
    const currentDelta =
      (doc.data().score === 4 ? 1 : doc.data().score === 1 ? -1 : 0) *
      (!!doc.data().isSuperVote ? 50 : 1);
    userScoreMapping.set(doc.data().hackerId, currentUserScore + currentDelta);
  });
  const snapshot = await db.collection(USERS_COLLECTION).get();
  snapshot.forEach((doc) => {
    const userData = doc.data();
    const date = doc.createTime.toDate();
    const stringDate = `${date.getMonth() + 1}-${date.getDate()}`;
    if (userData['scans']) {
      if ((userData['scans'] as any[]).find((obj) => obj.name === checkInEventName) !== undefined) {
        generalStats.checkedInCount++;
      }
    }
    if (!userScoreMapping.has(userData.id) || userScoreMapping.get(userData.id) < 0) {
      return;
    }

    if (!generalStats.timestamp.hasOwnProperty(stringDate)) {
      generalStats.timestamp[stringDate] = 0;
    }
    generalStats.timestamp[stringDate]++;

    for (let arrayField of arrayFields) {
      if (!userData[arrayField]) continue;
      userData[arrayField].forEach((data: string) => {
        if (arrayField === 'scans' && data === checkInEventName) generalStats.checkedInCount++;
        else {
          if (!generalStats[arrayField].hasOwnProperty(data)) generalStats[arrayField][data] = 0;
          generalStats[arrayField][data]++;
        }
      });
    }

    for (let singleField of singleFields) {
      if (!userData[singleField] || userData[singleField] === '') continue;
      if (!generalStats[singleField].hasOwnProperty(userData[singleField])) {
        generalStats[singleField][userData[singleField]] = 0;
      }
      generalStats[singleField][userData[singleField]]++;
    }

    const userPermission = userData.user.permissions[0];

    switch (userPermission) {
      case 'super_admin': {
        generalStats.superAdminCount++;
        break;
      }
      case 'admin': {
        generalStats.adminCount++;
        break;
      }
      case 'hacker': {
        generalStats.hackerCount++;
        break;
      }
    }
  });

  return generalStats;
}

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const { headers } = req;
  const userToken = headers['authorization'];
  const isAuthorized = await userIsAuthorized(userToken, ['super_admin']);

  if (!isAuthorized) {
    return res.status(403).json({
      msg: 'Request is not authorized to perform super admin functionality',
    });
  }

  // Start getting data here
  const statsData = await getStatsData();
  return res.json(statsData);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case 'GET': {
      return handleGetRequest(req, res);
    }
    default: {
      return res.status(404).json({
        msg: 'Route not found',
      });
    }
  }
}
