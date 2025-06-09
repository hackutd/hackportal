import clsx from 'clsx';
import { Tab } from '@headlessui/react';
import { SearchIcon } from '@heroicons/react/solid';
import {
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import { Box } from '@mui/system';

import { useAuthContext } from '@/lib/user/AuthContext';
import { ApplicationViewState, RegistrationState } from '@/lib/util';
import { ApplicationEntry } from '@/lib/admin/group';

import HackerApplicationDataTable, {
  HACKER_APPLICATION_DATATABLE_INFINITE_SCROLL_TARGET,
} from './HackerApplicationDataTable';

interface Props {
  userGroups: ApplicationEntry[];
  searchQuery: string;
  registrationState: RegistrationState;
  appViewState: ApplicationViewState;
  onUpdateRegistrationState: (newState: RegistrationState) => void;
  onUpdateAppViewState: (newState: ApplicationViewState) => void;
  onUserGroupClick: (id: string) => void;
  onSearchQueryUpdate: (searchQuery: string) => void;
  filterParamsList: string[];
  handleParamListChange: (e: any) => void;
}

export default function HackerApplications({
  userGroups,
  onUserGroupClick,
  searchQuery,
  onSearchQueryUpdate,
  registrationState,
  onUpdateRegistrationState,
  appViewState,
  handleParamListChange,
  filterParamsList,
}: Props) {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const { user } = useAuthContext();

  const filterParams = [
    'hacker',
    'admin',
    'super_admin',
    'Accepted',
    'Rejected',
    'In Review',
    'Maybe Yes',
    'Maybe No',
  ];

  return (
    <div className={`h-full px-4 md:px-14 text-sm md:text-base`}>
      {/* Top Bar with Status, Search, and Filters */}
      <div className="flex flex-row justify-between">
        <div className="flex flex-col lg:flex-row  justify-between items-center w-full">
          {/* Search User */}
          <div className="relative icon flex flex-row justify-center items-center w-full lg:w-1/2">
            <input
              type="text"
              className={`
                rounded-lg
                bg-[#F2F3FF] text-[#5D5A88] placeholder:text-[#5D5A88]
                w-full border-none
              `}
              placeholder="Search Users"
              value={searchQuery}
              onChange={(e) => {
                onSearchQueryUpdate(e.target.value);
              }}
            />
            <div className="absolute right-4">
              <SearchIcon className="w-6 h-6 text-[rgb(9,45,122)]" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center w-full mt-8 lg:mt-0">
            {user.permissions.includes('super_admin') && (
              <Tab.Group
                selectedIndex={registrationState === RegistrationState.OPEN ? 1 : 0}
                // manual
                onChange={(idx) => {
                  onUpdateRegistrationState(
                    idx === 0 ? RegistrationState.CLOSED : RegistrationState.OPEN,
                  );
                }}
              >
                <Tab.List className="flex flex-row justify-center items-center w-full">
                  <div className="bg-[#F1F8FC] rounded-full">
                    <Tab
                      className={`rounded-full font-bold ${
                        registrationState === RegistrationState.CLOSED
                          ? 'bg-[#5D5A88] text-[#F1F8FC]'
                          : 'bg-[#F2F3FF] text-[#5D5A88]'
                      } py-2 px-4`}
                    >
                      Close Registration
                    </Tab>
                    <Tab
                      className={`rounded-full font-bold ${
                        registrationState === RegistrationState.OPEN
                          ? 'bg-[#5D5A88] text-[#F1F8FC]'
                          : 'bg-[#F2F3FF] text-[#5D5A88]'
                      } py-2 px-4`}
                    >
                      Live Registration
                    </Tab>
                  </div>
                </Tab.List>
              </Tab.Group>
            )}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div>
        <FormControl fullWidth={true} sx={{ m: 1 }}>
          <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={filterParamsList}
            onChange={handleParamListChange}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {filterParams.map((filterParam) => (
              <MenuItem key={filterParam} value={filterParam}>
                <Checkbox checked={filterParamsList.includes(filterParam)} />
                <ListItemText primary={filterParam} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* User Table List */}
      <div
        id={HACKER_APPLICATION_DATATABLE_INFINITE_SCROLL_TARGET}
        className={`
          overflow-auto
          mt-5 mb-10
          border-2 border-gray rounded-lg
        `}
        style={{ height: 'calc(100% - 100px)' }}
      >
        <div
          className={`
            min-w-[1024px]
            ${userGroups.length === 0 ? 'bg-[rgba(255,255,255,0.6)]' : ''}
            backdrop-blur
          `}
        >
          {/* Header */}
          <div
            className={clsx(
              `flex flex-row border-b-2 px-6 py-3 justify-between sticky z-10 top-0`,
              `text-[#F2F3FF] bg-[#5D5A88]`,
            )}
          >
            <div className="w-2/12 flex items-center justify-center">Status</div>
            {user.permissions.includes('super_admin') && (
              <div className="w-2/12 flex items-center justify-center">Name</div>
            )}
            <div
              className={`${
                user.permissions.includes('super_admin') ? 'w-2/12' : 'w-4/12'
              } flex items-center justify-center`}
            >
              University
            </div>
            <div className="w-2/12 flex items-center justify-center">Major</div>
            <div className="w-2/12 flex items-center justify-center">Year</div>
          </div>

          {/* User List */}
          <HackerApplicationDataTable
            appViewState={appViewState}
            userGroups={userGroups}
            onUserGroupClick={(id) => onUserGroupClick(id)}
          />
        </div>
      </div>
    </div>
  );
}
