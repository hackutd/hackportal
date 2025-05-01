import { PartialRegistration, Registration } from './types';

export const cleanData = (registrationData: PartialRegistration): Registration => {
  const cleanedValues: Partial<Registration> = {};
  const userValues: Partial<Registration['user']> = {};

  Object.entries(registrationData).forEach(([key, value]) => {
    if (key.startsWith('user.')) {
      userValues[key.replace('user.', '')] = value;
    } else {
      cleanedValues[key] = value;
    }
  });

  return {
    ...cleanedValues,
    user: {
      id: userValues.id || '',
      permissions: userValues.permissions || ['hacker'],
      firstName: userValues.firstName || '',
      lastName: userValues.lastName || '',
      preferredEmail: userValues.preferredEmail || '',
      group: userValues.group,
    },
    timestamp: Date.now(),
  } as Registration;
};
