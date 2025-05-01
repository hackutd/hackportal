import React from 'react';
import { QuestionTypes } from '@/hackportal.config';
import DisplayRegistrationQuestion from '@/components/register/DisplayRegistrationQuestion';

interface RegistrationSectionProps {
  title: string;
  questions: QuestionTypes[];
  values: any;
  errors: any;
  touched: any;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
}

const RegistrationSection: React.FC<RegistrationSectionProps> = ({
  title,
  questions,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
}) => {
  return (
    <section className="bg-white lg:w-3/5 md:w-3/4 w-full min-h-[35rem] mx-auto rounded-2xl md:py-10 py-6 px-8 mb-8 text-[#5D5A88]">
      <h2 className="sm:text-2xl text-xl poppins-bold sm:mb-3 mb-1 mt-2">{title}</h2>
      <div className="flex flex-col poppins-regular md:px-4">
        {questions.map((obj, idx) => (
          <DisplayRegistrationQuestion key={idx} obj={obj} />
        ))}
      </div>
    </section>
  );
};

export default RegistrationSection;
