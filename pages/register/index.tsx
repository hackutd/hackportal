import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useRef, useEffect } from 'react';
import { Formik, Form } from 'formik';
import Link from 'next/link';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { GetServerSideProps } from 'next';
import { Snackbar } from '@mui/material';
import { useSession } from 'next-auth/react';

import { useAuthContext } from '@/lib/user/AuthContext';
import { getFileExtension } from '@/lib/util';
import { RequestHelper } from '@/lib/request-helper';
import { generateInitialValues, hackPortalConfig, QuestionTypes } from '@/hackportal.config';

import Loading from '@/components/icon/Loading';
import RegistrationSection from './components/RegistrationSection';
import ResumeUpload from './components/ResumeUpload';
import NavigationButtons from './components/NavigationButtons';
import AutosaveHandler from './components/AutosaveHandler';
import {
  PartialRegistration,
  Registration,
  RegistrationSection as RegistrationSectionType,
} from './types';
import { validationSchema } from './validation';
import { cleanData } from './utils';

interface Props {
  allowedRegistrations: boolean;
}

export default function Register({ allowedRegistrations }: Props) {
  const router = useRouter();
  const {
    registrationFields: {
      generalQuestions,
      schoolQuestions,
      hackathonExperienceQuestions,
      shortAnswerQuestions,
      eventInfoQuestions,
      sponsorInfoQuestions,
      teammateQuestions,
    },
  } = hackPortalConfig;

  const { user, profile, partialProfile, hasProfile, updateProfile, updatePartialProfile } =
    useAuthContext();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSavingApplication, setIsSavingApplication] = useState(false);
  const [resumeFileUpdated, setResumeFileUpdated] = useState(false);
  const resumeFileRef = useRef(null);
  const [displayProfileSavedToaster, setDisplayProfileSavedToaster] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registrationSection, setRegistrationSection] = useState(
    partialProfile?.currentRegistrationPage || 0,
  );
  const [error, setError] = useState<string | null>(null);

  const checkRedirect = async () => {
    if (!allowedRegistrations) return;
    if (hasProfile) router.push('/profile');
    if (user) setLoading(false);
  };

  useEffect(() => {
    checkRedirect();
  }, [user]);

  const handleSubmit = async (values: PartialRegistration) => {
    try {
      const cleanedData = cleanData(values);
      const formData = new FormData();

      if (resumeFile) {
        formData.append('resume', resumeFile);
        const uploadResponse = await fetch('/api/resume/upload', {
          method: 'POST',
          body: formData,
        });
        const { url } = await uploadResponse.json();
        cleanedData.resume = url;
      }

      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
      setError('Failed to submit application. Please try again.');
    }
  };

  const handleSaveProfile = async (
    registrationData: PartialRegistration,
    nextPage: number,
    resetForm: (param: { values: any }) => void,
  ) => {
    try {
      let resumeUrl = partialProfile?.resume || '';

      if (resumeFile && resumeFileUpdated) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('fileName', `${user.id}${getFileExtension(resumeFile.name)}`);
        formData.append('studyLevel', registrationData['studyLevel']);
        formData.append('major', registrationData['major']);
        formData.append('isPartialProfile', 'true');

        const res = await fetch('/api/resume/upload', {
          method: 'post',
          body: formData,
        });
        resumeUrl = (await res.json()).url;
      }

      const { data } = await RequestHelper.put<
        any,
        { msg: string; registrationData: PartialRegistration }
      >(
        '/api/applications/save',
        {},
        {
          ...registrationData,
          id: registrationData.id || user.id,
          currentRegistrationPage: nextPage,
          resume: resumeUrl,
        },
      );

      setDisplayProfileSavedToaster(true);
      resetForm({ values: registrationData });
      setResumeFileUpdated(false);
      updatePartialProfile(data.registrationData);
    } catch (err) {
      console.error(err);
      alert('Something went wrong while saving your profile');
    }
  };

  if (!allowedRegistrations) {
    return (
      <h1 className="mx-auto text-2xl mt-4 font-bold">
        Registrations is closed and no longer allowed
      </h1>
    );
  }

  if (!user) {
    router.push('/auth');
  }

  if (loading) {
    return <Loading width={200} height={200} />;
  }

  const sections: RegistrationSectionType[] = [
    {
      title: 'Personal Information',
      questions: generalQuestions as QuestionTypes[],
    },
    {
      title: 'School Information',
      questions: schoolQuestions as QuestionTypes[],
    },
    {
      title: 'Hackathon Experience',
      questions: hackathonExperienceQuestions as QuestionTypes[],
    },
    {
      title: 'Short Answer Questions',
      questions: shortAnswerQuestions as QuestionTypes[],
    },
    {
      title: 'Event Information',
      questions: eventInfoQuestions as QuestionTypes[],
    },
    {
      title: 'Sponsor Information',
      questions: sponsorInfoQuestions as QuestionTypes[],
    },
    {
      title: 'Teammate Information',
      questions: teammateQuestions as QuestionTypes[],
    },
  ];

  return (
    <div className="flex flex-col flex-grow mt-28 md:mt-0 mb-10">
      <Head>
        <title>Hacker Application</title>
        <meta name="description" content="Register for HackPortal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Formik
        initialValues={{
          ...generateInitialValues(partialProfile),
          id: partialProfile?.id || '',
          firstName: partialProfile?.firstName || '',
          lastName: partialProfile?.lastName || '',
          preferredEmail: partialProfile?.preferredEmail || user?.preferredEmail || '',
          majorManual: partialProfile?.majorManual || '',
          universityManual: partialProfile?.universityManual || '',
          heardFromManual: partialProfile?.heardFromManual || '',
          resume: partialProfile?.resume || '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isValid, isSubmitting, dirty, resetForm }) => (
          <>
            <section className="pl-4 relative mb-4 z-[9999] hidden md:flex">
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  if (dirty) await handleSaveProfile(values, registrationSection, resetForm);
                  await router.push('/');
                }}
              >
                <div className="mt-2 cursor-pointer items-center inline-flex text-white font-bold bg-[#5D5A88] rounded-[30px] pr-4 pl-1 py-2 border-2 border-white">
                  <ChevronLeftIcon className="text-white" fontSize={'large'} />
                  Home
                </div>
              </button>
            </section>
            <section className="relative">
              <Form className="registrationForm px-4 md:px-24 w-full sm:text-base text-sm">
                {sections.map((section, idx) => (
                  <React.Fragment key={idx}>
                    {registrationSection === idx && (
                      <RegistrationSection
                        title={section.title}
                        questions={section.questions}
                        values={values}
                        errors={{}}
                        touched={{}}
                        handleChange={() => {}}
                        handleBlur={() => {}}
                      />
                    )}
                    {registrationSection === 5 && (
                      <ResumeUpload
                        resumeFile={resumeFile}
                        setResumeFile={setResumeFile}
                        setResumeFileUpdated={setResumeFileUpdated}
                        partialProfile={partialProfile}
                      />
                    )}
                  </React.Fragment>
                ))}
              </Form>

              <NavigationButtons
                currentSection={registrationSection}
                totalSections={sections.length}
                onPrevious={() => setRegistrationSection(registrationSection - 1)}
                onNext={() => setRegistrationSection(registrationSection + 1)}
                onSave={() => handleSaveProfile(values, registrationSection, resetForm)}
                isSaving={isSavingApplication}
                isDirty={dirty}
                resumeFileUpdated={resumeFileUpdated}
              />
            </section>
            <Snackbar
              open={displayProfileSavedToaster}
              autoHideDuration={5000}
              onClose={() => setDisplayProfileSavedToaster(false)}
              message="Profile saved"
            />
            <AutosaveHandler
              currentPage={registrationSection}
              defaultResumeUrl={partialProfile?.resume || ''}
              resumeFile={resumeFileUpdated ? resumeFile : null}
              updatePartialProfile={updatePartialProfile}
            />
          </>
        )}
      </Formik>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const protocol = context.req.headers.referer?.split('://')[0] || 'http';
  const { data } = await RequestHelper.get<{ allowRegistrations: boolean }>(
    `${protocol}://${context.req.headers.host}/api/registrations/status`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return {
    props: {
      allowedRegistrations: data.allowRegistrations,
    },
  };
};
