import { Registration } from '@/lib/types';

export interface UserProfile extends Omit<Registration, 'user'> {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    permissions: string[];
    preferredEmail: string;
  };
}

export interface ScanType {
  name: string;
  isCheckIn: boolean;
  isPermanentScan: boolean;
  startTime: Date;
  endTime: Date;
  precedence?: number;
}

export interface NewScanForm {
  name: string;
  isCheckIn: boolean;
  isPermanentScan: boolean;
  startTime: Date;
  endTime: Date;
}
