import React from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface NavigationButtonsProps {
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
  isSaving: boolean;
  isDirty: boolean;
  resumeFileUpdated: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  onSave,
  isSaving,
  isDirty,
  resumeFileUpdated,
}) => {
  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
      }}
      className={`lg:block ${
        currentSection === 0
          ? 'justify-end'
          : currentSection >= totalSections - 1
          ? 'justify-start'
          : 'justify-between'
      } lg:pb-4 pb-8 lg:px-4 sm:px-8 px-6 text-primaryDark font-semibold text-primaryDark font-semibold text-md`}
    >
      {currentSection > 0 && (
        <div style={{ gridArea: '1 / 1 / 2 / 2' }} onClick={onPrevious}>
          <div
            style={{ width: 'fit-content' }}
            className="hidden md:inline-flex cursor-pointer select-none bg-white text-[#5D5A88] rounded-[30px] py-3 pl-2 pr-4 text-xs md:text-lg border-2 border-[#5D5A88]"
          >
            <ChevronLeftIcon className="text-[#5D5A88]" />
            prev page
          </div>
          <div
            style={{ width: 'fit-content' }}
            className="md:hidden cursor-pointer select-none bg-white text-[#5D5A88] rounded-[30px] py-3 pl-2 pr-4 text-xs md:text-lg border-2 border-[#5D5A88]"
          >
            <ChevronLeftIcon className="text-[#5D5A88]" />
            prev
          </div>
        </div>
      )}

      <div className="flex justify-center items-center" style={{ gridArea: '1 / 2 / 2 / 3' }}>
        {Array.from({ length: totalSections }).map((_, i) => (
          <div
            key={i}
            style={{ backgroundColor: currentSection === i ? '#4C4950' : '#9F9EA7' }}
            className="rounded-full w-3 h-3 mr-2 cursor-pointer"
          />
        ))}
      </div>

      {currentSection < totalSections - 1 && (
        <div className="flex justify-end" style={{ gridArea: '1 / 3 / 2 / 4' }} onClick={onNext}>
          <div
            style={{ width: 'fit-content' }}
            className="hidden md:inline-flex cursor-pointer select-none bg-white text-[#5D5A88] text-xs md:text-lg rounded-[30px] py-3 pr-2 pl-4 border-2 border-[#5D5A88]"
          >
            next page
            <ChevronRightIcon />
          </div>
          <div
            style={{ width: 'fit-content' }}
            className="md:hidden cursor-pointer select-none bg-white text-[#5D5A88] text-xs md:text-lg rounded-[30px] py-3 pr-2 pl-4 border-2 border-[#5D5A88]"
          >
            next
            <ChevronRightIcon />
          </div>
        </div>
      )}

      <div className="flex justify-end my-4">
        <button
          disabled={(!isDirty && !resumeFileUpdated) || isSaving}
          onClick={onSave}
          className="bg-[#5D5A88] rounded-lg p-3 text-white font-bold"
        >
          Save Profile
        </button>
      </div>
    </section>
  );
};

export default NavigationButtons;
