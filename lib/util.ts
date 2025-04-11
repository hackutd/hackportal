export const getFileExtension = (filename: string) => {
  const seg = filename.split('.');
  return `.${seg[seg.length - 1]}`;
};

export enum RegistrationState {
  UNINITIALIZED = -1,
  OPEN = 1,
  CLOSED = 0,
}

export enum ApplicationViewState {
  REVIEWABLE = 0,
  ALL = 1,
}

export function checkUserPermission(user, allowedRoles): boolean {
  if (!user || !user.permissions) return false;

  // check if all user.permissions has one of the allowedRoles
  const hasAnyRole = user.permissions.some((role) => allowedRoles.includes(role));

  return hasAnyRole;
}
