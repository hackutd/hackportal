import { getGroupId } from '@/components/admin/hacker-application/utils';
import { create } from 'zustand';

export type ApplicationEntry = {
  index: number;
  application: UserIdentifier[];
};

interface UserGroupState {
  groups: ApplicationEntry[];
  allUsers: ApplicationEntry[];
  currentUserGroup: string;
  setCurrentUsergroup: (s: string) => void;
  setUserGroup: (groups: ApplicationEntry[]) => void;
  setAllUserGroup: (allUsers: ApplicationEntry[]) => void;
  updateGroupVerdict: (groupId: string, newVerdict: string) => void;
}

export const useUserGroup = create<UserGroupState>((set) => ({
  groups: [],
  allUsers: [],
  currentUserGroup: '',
  setUserGroup: (groups) =>
    set(() => ({
      groups,
    })),
  setAllUserGroup: (allUsers) => set(() => ({ allUsers })),
  updateGroupVerdict: (groupId, newVerdict) =>
    set((state) => ({
      groups: state.groups.map((group) =>
        getGroupId(group.application) === groupId
          ? {
              ...group,
              application: group.application.map((member) => ({ ...member, status: newVerdict })),
            }
          : group,
      ),
    })),
  setCurrentUsergroup: (s) => set(() => ({ currentUserGroup: s })),
}));
