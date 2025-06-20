import { useState } from 'react';
import { RequestHelper } from '../../../lib/request-helper';
import { useAuthContext } from '../../../lib/user/AuthContext';
import { LockClosedIcon, LockOpenIcon, XIcon } from '@heroicons/react/solid';
import MaybeVerdictDialog from './MaybeVerdictDialog';
import { ApplicationViewState } from '@/lib/util';

interface Props {
  userIndex: number;
  groupLength: number;
  currentApplicant: UserIdentifier;
  onNoteUpdate: (note: string) => void;
  currentNote: string;
  onScoreSubmit: (groupScore: number) => Promise<void>;
  appViewState: ApplicationViewState;
}

interface BasicInfoProps {
  k: string;
  v: string;
  locked?: boolean;
  canUnlock?: boolean;
}

const scoreState = ['No', 'Maybe No', 'Maybe Yes', 'Yes'];

function BasicInfo({ k, v, locked, canUnlock }: BasicInfoProps) {
  const [lock, setLock] = useState<boolean>(locked);
  const lockOnClick = () => {
    if (canUnlock) setLock(!lock);
  };
  const lockClassName = 'ml-1 w-5 h-5 hover:scale-125 transition cursor-pointer';
  return (
    <div className="flex flex-col my-4">
      <p className="flex flex-row items-center font-bold text-black">
        {k}
        {locked ? (
          lock ? (
            <LockClosedIcon onClick={lockOnClick} className={lockClassName} />
          ) : (
            <LockOpenIcon onClick={lockOnClick} className={lockClassName} />
          )
        ) : (
          <span />
        )}
      </p>
      <p className="text-black">{lock ? '' : v}</p>
    </div>
  );
}

function FRQInfo({ k, v }: BasicInfoProps) {
  return (
    <div className="flex flex-col my-4">
      <p className="text-2xl font-bold text-black mb-2">{k}</p>
      <p className=" text-black">{v}</p>
    </div>
  );
}

export default function ViewHackerApplication({
  currentApplicant,
  groupLength,
  onNoteUpdate,
  currentNote,
  onScoreSubmit,
  userIndex,
  appViewState,
}: Props) {
  const { user } = useAuthContext();

  // Pagination
  const [newRole, setNewRole] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [showMaybeDialog, setShowMaybeDialog] = useState(false);
  // Contains info of the user who is viewing the data
  const { user: organizer } = useAuthContext();

  const updateRole = async () => {
    if (!organizer.permissions.includes('super_admin')) {
      alert('You do not have permission to perform this functionality');
      return;
    }

    try {
      const { status, data } = await RequestHelper.post<
        {
          userId: string;
          newRole: string;
        },
        any
      >(
        '/api/users/roles',
        {
          headers: {
            Authorization: organizer.token,
          },
        },
        {
          userId: currentApplicant.id,
          newRole,
        },
      );
      if (!status || data.statusCode >= 400) {
        setErrors([...errors, data.msg]);
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.error(error);
      setErrors((prev) => [...prev, 'Unexpected error. Please try again later']);
    }
  };

  // 208 px
  return (
    <div className="p-5 sm:p-10 text-complementary bg-[rgba(255,255,255,0.4)] mb-4">
      {/* Application Status */}
      <MaybeVerdictDialog
        isOpen={showMaybeDialog}
        closeModal={() => setShowMaybeDialog(false)}
        onMaybeYes={async () => {
          try {
            await onScoreSubmit(3);
          } catch (err) {
            console.error(err);
          } finally {
            console.log('done');
            setShowMaybeDialog(false);
          }
        }}
        onMaybeNo={async () => {
          try {
            await onScoreSubmit(2);
          } catch (err) {
            console.error(err);
          } finally {
            setShowMaybeDialog(false);
          }
        }}
      />
      <h1 className="text-3xl my-3 text-black font-bold">
        Team member {userIndex}/{groupLength}
      </h1>
      <div className="flex-wrap gap-y-2 flex flex-row justify-between items-center">
        <p
          className={`
                font-bold py-1 px-6 rounded-full
                ${
                  currentApplicant.status === 'Accepted'
                    ? 'bg-[rgb(242,253,226)] text-[rgb(27,111,19)]'
                    : ''
                }
                ${
                  currentApplicant.status === 'Rejected'
                    ? 'bg-[rgb(255,233,218)] text-[rgb(122,15,39)]'
                    : ''
                }
                ${
                  currentApplicant.status === 'In Review'
                    ? 'bg-[rgb(213,244,255)] text-[rgb(9,45,122)]'
                    : ''
                }
                ${
                  currentApplicant.status.startsWith('Maybe')
                    ? 'bg-yellow-200 text-[rgb(9,45,122)]'
                    : ''
                }
              `}
        >
          {currentApplicant.status}
        </p>

        <div className="text-sm flex-wrap gap-y-2 flex flex-row justify-between items-start gap-x-3">
          <button
            className="rounded-full bg-transparent text-[#5D5A88] border-2 border-solid border-[#5D5A88] font-bold py-2 px-8 hover:border-red-500 hover:text-white hover:bg-red-500 transition"
            // Score of 1 means strong NO
            onClick={() => onScoreSubmit(1)}
          >
            REJECT
          </button>
          <button
            className="rounded-full bg-transparent text-[#5D5A88] border-2 border-solid border-[#5D5A88] font-bold py-2 px-8 hover:border-yellow-500 hover:text-white hover:bg-yellow-500 transition"
            onClick={() => {
              setShowMaybeDialog(true);
            }}
          >
            MAYBE
          </button>
          <button
            className="rounded-full bg-[#5D5A88] text-white border-2 border-solid border-[#5D5A88] font-bold py-2 px-8 hover:border-green-500 hover:bg-green-500 transition"
            // Score of 4 means strong YES
            onClick={() => onScoreSubmit(4)}
          >
            ACCEPT
          </button>
        </div>
      </div>

      <div className="my-6 w-full border-2 border-gray-200 rounded-md" />

      {/* Basic Information */}
      <div className="flex flex-col-reverse sm:flex-row gap-2">
        {/* Name, School, etc... */}
        <div className="flex flex-row gap-6 sm:w-3/5">
          <div className="flex flex-col basis-0 flex-grow">
            <BasicInfo
              k="Name"
              v={currentApplicant.user.firstName + ' ' + currentApplicant.user.lastName}
              locked={appViewState === ApplicationViewState.REVIEWABLE}
              canUnlock={appViewState === ApplicationViewState.ALL}
            />
            <BasicInfo k="Major" v={currentApplicant.major} />
            <BasicInfo k="Level of Study" v={currentApplicant.studyLevel} />
            <BasicInfo
              k="Role"
              v={currentApplicant.user.permissions[0]}
              locked={appViewState === ApplicationViewState.REVIEWABLE}
              canUnlock={appViewState === ApplicationViewState.ALL}
            />
          </div>

          <div className="flex flex-col basis-0 flex-grow">
            <BasicInfo
              k="School"
              v={currentApplicant.university ?? currentApplicant.universityManual}
              locked={appViewState === ApplicationViewState.REVIEWABLE}
              canUnlock={appViewState === ApplicationViewState.ALL}
            />
            <BasicInfo k="Software Experience" v={currentApplicant.softwareExperience} />
            {/* this should PROBABLY be currentUser.hackathonNumber, but I think the registration interface is populated incorrectly */}
            <BasicInfo k="Hackathons Attended" v={`${currentApplicant.hackathonExperience}`} />
            <BasicInfo
              k="Email"
              v={currentApplicant.user.preferredEmail}
              locked={appViewState === ApplicationViewState.REVIEWABLE}
              canUnlock={appViewState === ApplicationViewState.ALL}
            />
          </div>
        </div>

        {/* Application Score */}
        <div className="flex flex-col items-center sm:w-2/5 text-black">
          {currentApplicant.scoring && (
            <>
              <p className="font-bold text-xl text-black">Application Score</p>

              <p className="text-8xl font-dmSans">
                {currentApplicant.scoring.reduce((acc: number, curr) => {
                  const scoreMultiplier = !!curr.isSuperVote ? 50 : 1;
                  return curr.score === 4
                    ? acc + scoreMultiplier
                    : curr.score === 1
                    ? acc - scoreMultiplier
                    : acc;
                }, 0)}
              </p>

              <p className="italic text-gray-600">
                <span className="text-green-500">
                  {currentApplicant.scoring.filter((score) => score.score === 4).length} accepted
                </span>{' '}
                /{' '}
                <span className="text-red-500">
                  {currentApplicant.scoring.filter((score) => score.score === 1).length} rejected
                </span>{' '}
                /{' '}
                <span className="text-yellow-500">
                  {
                    currentApplicant.scoring.filter(
                      (score) => score.score === 2 || score.score === 3,
                    ).length
                  }{' '}
                  maybe
                </span>
              </p>
            </>
          )}
          {user.permissions.includes('super_admin') && (
            <div className="flex-wrap flex flex-row gap-2 p-3 w-full">
              <select
                value={newRole}
                onChange={(e) => {
                  setNewRole(e.target.value);
                }}
                name="new_role"
                className="flex-1 border-2 rounded-xl p-2"
              >
                <option value="">Choose a role</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="hacker">Hacker</option>
              </select>

              {newRole !== '' && (
                <button
                  onClick={() => {
                    updateRole();
                  }}
                  className="flex-1 font-bold bg-[rgba(66,184,187,1)] text-white p-2 rounded-xl"
                >
                  Update Role
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <textarea
          className="w-full h-52 border-gray-300 border-2 rounded-md text-black bg-gray-300/20"
          value={currentNote}
          onChange={(e) => {
            e.preventDefault();
            onNoteUpdate(e.target.value);
          }}
        ></textarea>
      </div>
      <div className="my-6 w-full border-2 border-gray-200 rounded-md" />
      {/* FRQ */}
      <div className="flex flex-col w-full">
        <FRQInfo
          k={'Why do you want to attend HackUTD Ripple Effect?'}
          v={currentApplicant.whyAttend}
        />
        <FRQInfo
          k={'How many hackathons have you submitted to and what did you learn from them?'}
          v={currentApplicant.hackathonNumber}
        />
        <FRQInfo
          k={
            "If you haven't been to a hackathon, what do you hope to learn from HackUTD Ripple Effect?"
          }
          v={currentApplicant.hackathonFirstTimer}
        />
        <FRQInfo
          k={'What are you looking forward to at HackUTD Ripple Effect?'}
          v={currentApplicant.lookingForward}
        />
      </div>
      {currentApplicant.scoring && (
        <>
          <div className="my-6 w-full border-2 border-gray-200 rounded-md" />
          <h1 className="text-4xl text-black mb-4">Reviews for this app</h1>
          {currentApplicant.scoring.map((score, idx) => (
            <div
              key={idx}
              className="p-3 border-2 border-gray-400 rounded-xl flex flex-col gap-y-4 my-4"
            >
              {/* <p className="text-black text-lg">{score.score}</p> */}
              <div className="flex gap-x-3 items-center">
                <span
                  className={`
                  w-fit py-1 px-6 rounded-full 
                  ${score.score === 4 ? 'bg-[rgb(242,253,226)] text-[rgb(27,111,19)]' : ''}
                  ${score.score === 1 ? 'bg-[rgb(255,233,218)] text-[rgb(122,15,39)]' : ''}
                  ${score.score > 1 && score.score < 4 ? 'bg-yellow-200 text-[rgb(9,45,122)]' : ''}
                  `}
                >
                  {scoreState[score.score - 1]}
                </span>
                <span className="text-black">{score.reviewer}</span>
              </div>
              {score.note !== '' && <p className="text-black text-lg">{score.note}</p>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
