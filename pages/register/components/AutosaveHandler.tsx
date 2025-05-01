import React, { useContext, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { useRouter } from 'next/router';
import { NavbarCallbackRegistryContext } from '@/lib/context/navbar';
import { useAuthContext } from '@/lib/user/AuthContext';
import { getFileExtension } from '@/lib/util';
import { RequestHelper } from '@/lib/request-helper';
import { PartialRegistration } from '../types';

interface AutosaveHandlerProps {
  currentPage: number;
  updatePartialProfile: (p: PartialRegistration) => void;
  resumeFile: File | null;
  defaultResumeUrl: string;
}

const AutosaveHandler: React.FC<AutosaveHandlerProps> = ({
  currentPage,
  updatePartialProfile,
  resumeFile,
  defaultResumeUrl,
}) => {
  const { values, dirty, resetForm } = useFormikContext<PartialRegistration>();
  const { setCallback, removeCallback } = useContext(NavbarCallbackRegistryContext);
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (dirty || resumeFile) {
      setCallback(router.pathname, async () => {
        let resumeUrl = defaultResumeUrl;
        if (resumeFile) {
          const formData = new FormData();
          formData.append('resume', resumeFile);
          formData.append('fileName', `${user.id}${getFileExtension(resumeFile.name)}`);
          formData.append('studyLevel', values['studyLevel']);
          formData.append('major', values['major']);
          formData.append('isPartialProfile', 'true');

          const res = await fetch('/api/resume/upload', {
            method: 'post',
            body: formData,
          });
          resumeUrl = (await res.json()).url;
        }
        return RequestHelper.put<any, { msg: string; registrationData: PartialRegistration }>(
          '/api/applications/save',
          {},
          {
            ...values,
            id: values.id || user.id,
            currentRegistrationPage: currentPage,
            resume: resumeUrl,
          },
        )
          .then(({ data }) => {
            resetForm({ values });
            updatePartialProfile(data.registrationData);
          })
          .catch((err) => {
            console.error(err);
          });
      });
    } else {
      removeCallback(router.pathname);
    }
    return () => {
      removeCallback(router.pathname);
    };
  }, [dirty, values, resumeFile]);

  return null;
};

export default AutosaveHandler;
