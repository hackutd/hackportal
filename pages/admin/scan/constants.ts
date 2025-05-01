export const allowedRoles = ['super_admin', 'admin', 'organizer'];

export const successStrings = {
  claimed: 'Scan claimed...',
  invalidUser: 'Invalid user...',
  alreadyClaimed: 'User has already claimed...',
  unexpectedError: 'Unexpected error...',
  notCheckedIn: "User hasn't checked in!",
  invalidFormat: 'Invalid hacker tag format...',
  lateCheckinIneligible: 'User is not eligible for late check-in...',
};

export const getSuccessColor = (success: string) => {
  if (success === successStrings.claimed) {
    return '#5fde05';
  }
  return '#ff0000';
};
