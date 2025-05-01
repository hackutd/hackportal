import React, { useRef } from 'react';
import Link from 'next/link';
import { getFileExtension } from '@/lib/util';

interface ResumeUploadProps {
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
  setResumeFileUpdated: (updated: boolean) => void;
  partialProfile?: {
    resume?: string;
  };
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({
  resumeFile,
  setResumeFile,
  setResumeFileUpdated,
  partialProfile,
}) => {
  const resumeFileRef = useRef<HTMLInputElement>(null);

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length !== 1) return alert('Must submit one file');

    const file = e.target.files[0];
    const fileExtension = getFileExtension(file.name);

    const acceptedFileExtensions = [
      '.pdf',
      '.doc',
      '.docx',
      '.png',
      '.jpg',
      '.jpeg',
      '.txt',
      '.tex',
      '.rtf',
    ];

    if (!acceptedFileExtensions.includes(fileExtension))
      return alert(`Accepted file types: ${acceptedFileExtensions.join(' ')}`);

    setResumeFile(file);
    setResumeFileUpdated(true);
  };

  return (
    <div className="mt-8 md:px-4 poppins-regular">
      <div className="flex items-center">
        Upload your resume <span className="text-gray-600 ml-2 text-[8px]">optional</span>
      </div>
      <br />
      <input
        onChange={handleResumeFileChange}
        ref={resumeFileRef}
        name="resume"
        type="file"
        formEncType="multipart/form-data"
        accept=".pdf, .doc, .docx, image/png, image/jpeg, .txt, .tex, .rtf"
        className="hidden"
      />
      <div className="flex items-center gap-x-3 poppins-regular w-full border border-[#5D5A88] rounded-md">
        <button
          className="md:p-2 p-1 bg-[#5D5A88] text-white h-full rounded-l-md border-none"
          onClick={(e) => {
            e.preventDefault();
            resumeFileRef.current?.click();
          }}
        >
          Upload new resume...
        </button>
        <p className="text-[#5D5A88]">{resumeFile ? resumeFile.name : 'No file selected.'}</p>
      </div>
      <p className="poppins-regular text-xs text-[#5D5A88]">
        Accepted file types: .pdf, .doc, .docx, .png, .jpeg, .txt, .tex, .rtf
      </p>
      {partialProfile?.resume && (
        <div className="my-4 w-fit">
          <Link href={partialProfile.resume} target="_blank">
            <div className="bg-[#5D5A88] md:p-2 p-1 text-white rounded-lg">
              Click to view your current resume
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
