import React, { Fragment } from 'react';
// TODO: convert styles to tailwind
import styles from './DisplayQuestion.module.css';
import { QuestionTypes } from '@/hackportal.config';
import RegistrationQuestion from './RegistrationQuestion';

/**
 *Display registration questions Component
 */
function DisplayRegistrationQuestion(props: { obj: QuestionTypes }) {
  return (
    <Fragment>
      {/* Display text input questions */}
      <div
        className={styles.textInputQuestionsContainer}
        style={{
          gridTemplateColumns:
            (props.obj.textInputQuestions?.length || 0) === 1 ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)',
        }}
      >
        {props.obj.textInputQuestions?.map((inputObj) => (
          <RegistrationQuestion key={inputObj.id} type="text" question={inputObj} />
        ))}
      </div>
      {/* Display number input questions */}
      {props.obj.numberInputQuestions?.map((inputObj) => (
        <RegistrationQuestion key={inputObj.id} type="number" question={inputObj} />
      ))}
      {/* Display dropdown input questions */}
      {props.obj.dropdownQuestions?.map((inputObj) => (
        <RegistrationQuestion key={inputObj.id} type="dropdown" question={inputObj} />
      ))}
      {/* Display datalist input questions */}
      {props.obj.datalistQuestions?.map((inputObj) => (
        <RegistrationQuestion key={inputObj.id} type="datalist" question={inputObj} />
      ))}
      {/* Display checkbox input questions */}
      {props.obj.checkboxQuestions?.map((inputObj) => (
        <RegistrationQuestion key={inputObj.id} type="checkbox" question={inputObj} />
      ))}
      {/* Display text area input questions */}
      {props.obj.textAreaQuestions?.map((inputObj) => (
        <RegistrationQuestion key={inputObj.id} type="textArea" question={inputObj} />
      ))}
    </Fragment>
  );
}

export default DisplayRegistrationQuestion;
