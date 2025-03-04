import schools from './public/schools.json';
import majors from './public/majors.json';
import countries from './public/countries.json';

export const hackPortalConfig: HackPortalConfig = {
  //registration fields are separated by question topics (general, school, hackathon experience, etc. )
  //each question topic is separated by question types(textInput, numberInput, dropdown, etc. )
  //  which hold all the questions of that type
  //add extra questions types(even ones already used) to question topics and add more questions under each question type
  //questions are displayed on page in order
  groupNames: ['Duck', 'Corgi', 'Capybara', 'Frog'],
  registrationFields: {
    //Question Topic
    generalQuestions: [
      {
        textInputQuestions: [
          {
            //don't remove; for user account info
            question: 'First Name',
            id: 'firstName',
            name: 'firstName',
            required: true,
            initialValue: '',
          },
          {
            //don't remove; for user account info
            question: 'Last Name',
            id: 'lastName',
            name: 'lastName',
            required: true,
            initialValue: '',
          },
          {
            //don't remove; for user account info
            question: 'Email',
            id: 'email',
            name: 'preferredEmail',
            required: true,
            initialValue: '',
          },
          {
            question:
              "Phone number (make sure to add country code and '+' prefix if you do not use US phone number)",
            id: 'phoneNumber',
            name: 'phoneNumber',
            required: true,
            initialValue: '',
          },
        ],
      },
      {
        numberInputQuestions: [
          {
            //Age question
            question: 'Age',
            required: true,
            id: 'age',
            name: 'age',
            min: '1',
            max: '100',
            pattern: '[0-9]+',
            initialValue: null,
          },
        ],
      },
      {
        dropdownQuestions: [
          {
            //Country question
            question: 'Country of Residence',
            id: 'country',
            name: 'country',
            required: true,
            initialValue: '',
            options: countries.map(({ country }) => ({ title: country, value: country })),
          },
          {
            //Gender question
            question: 'Gender',
            required: true,
            id: 'gender',
            name: 'gender',
            initialValue: '',
            options: [
              {
                title: 'Female',
                value: 'Female',
              },
              {
                title: 'Male',
                value: 'Male',
              },
              {
                title: 'Other',
                value: 'Other',
              },
              {
                title: 'Prefer not to say',
                value: 'notSay',
              },
            ],
          },
          {
            //Race question
            question: 'Race',
            required: true,
            id: 'race',
            name: 'race',
            initialValue: '',
            options: [
              {
                title: 'Native American',
                value: 'Native American',
              },
              {
                title: 'Asian/Pacific Islander',
                value: 'Asian',
              },
              {
                title: 'Black or African American',
                value: 'Black',
              },
              {
                title: 'Hispanic',
                value: 'Hispanic',
              },
              {
                title: 'White/Caucasian',
                value: 'White',
              },
              {
                title: 'Multiple/Other',
                value: 'Other',
              },
              {
                title: 'Prefer not to answer',
                value: 'notSay',
              },
            ],
          },
          {
            //Ethnicity question
            question: 'Ethnicity',
            required: true,
            id: 'ethnicity',
            name: 'ethnicity',
            initialValue: '',
            options: [
              {
                title: 'Hispanic or Latino',
                value: 'hispanic',
              },
              {
                title: 'Not Hispanic or Latino',
                value: 'notHispanic',
              },
              {
                title: 'Prefer not to answer',
                value: 'notSay',
              },
            ],
          },
        ],
      },
    ],
    //Question Topic
    schoolQuestions: [
      {
        dropdownQuestions: [
          {
            //University question
            question:
              'This event is for college students worldwide. Which university do you attend?',
            id: 'university',
            name: 'university',
            required: true,
            options: [
              ...schools.map(({ university }) => ({
                title: university,
                value: university,
              })),
              { title: 'Other', value: 'Other' },
            ],
            initialValue: '',
          },
          {
            //Major question
            question: 'All majors are welcome at this event. What is your major?',
            id: 'major',
            name: 'major',
            required: true,
            options: [
              ...majors.map(({ major }) => ({
                title: major,
                value: major,
              })),
              { title: 'Other', value: 'Other' },
            ],
            initialValue: '',
          },
          {
            //Grade question
            question: 'Current level of study',
            required: true,
            id: 'studyLevel',
            name: 'studyLevel',
            initialValue: '',
            options: [
              {
                title: 'Freshman',
                value: 'freshman',
              },
              {
                title: 'Sophomore',
                value: 'sophomore',
              },
              {
                title: 'Junior',
                value: 'junior',
              },
              {
                title: 'Senior',
                value: 'senior',
              },
              {
                title: 'Graduate Student',
                value: 'grad',
              },
            ],
          },
        ],
      },
    ],
    //Question Topic
    hackathonExperienceQuestions: [
      {
        numberInputQuestions: [
          {
            //Hackathons attended question
            question: 'How many hackathons have you attended before?',
            required: true,
            id: 'hackathonExperience',
            name: 'hackathonExperience',
            min: '0',
            max: '100',
            pattern: '[0-9]+',
            initialValue: null,
          },
        ],
      },
      {
        dropdownQuestions: [
          {
            //Experience question
            question: 'Relative software-building experience',
            required: true,
            id: 'softwareExperience',
            name: 'softwareExperience',
            initialValue: '',
            options: [
              {
                title: 'Beginner',
                value: 'Beginner',
              },
              {
                title: 'Intermediate',
                value: 'Intermediate',
              },
              {
                title: 'Advanced',
                value: 'Advanced',
              },
              {
                title: 'Expert',
                value: 'Expert',
              },
            ],
          },
          {
            //Heard from question
            question: 'Where did you hear about HackPortal?',
            required: true,
            id: 'heardFrom',
            name: 'heardFrom',
            initialValue: '',
            options: [
              {
                title: 'Instagram',
                value: 'Instagram',
              },
              {
                title: 'Twitter',
                value: 'Twitter',
              },
              {
                title: 'Event Site',
                value: 'Event Site',
              },
              {
                title: 'Friend',
                value: 'Friend',
              },
              {
                title: 'TikTok',
                value: 'TikTok',
              },
              {
                title: 'Other',
                value: 'Other',
              },
            ],
          },
        ],
      },
    ],
    //Short answer questions
    shortAnswerQuestions: [
      {
        textAreaQuestions: [
          {
            //Why do you want to attend question
            question: 'Why do you want to attend HackPortal?',
            id: 'whyAttend',
            name: 'whyAttend',
            required: true,
            initialValue: '',
            placeholder: '',
          },
          {
            //How many hackathons submitted question
            question: 'How many hackathons have you submitted to and what did you learn from them?',
            id: 'hackathonNumber',
            name: 'hackathonNumber',
            required: true,
            initialValue: '',
            placeholder: '',
          },
          {
            //What do you hope to learn from HackPortal as a first timer question
            question:
              'If you haven’t been to a hackathon, what do you hope to learn from HackPortal?',
            id: 'hackathonFirstTimer',
            name: 'hackathonFirstTimer',
            required: true,
            initialValue: '',
            placeholder: '',
          },
          {
            //What are you looking forward to question
            question: 'What are you looking forward to do at HackPortal?',
            id: 'lookingForward',
            name: 'lookingForward',
            required: true,
            initialValue: '',
            placeholder: '',
          },
        ],
      },
    ],
    //Question Topic
    eventInfoQuestions: [
      {
        dropdownQuestions: [
          {
            //Shirt size question
            question: 'Shirt Size',
            required: true,
            id: 'size',
            name: 'size',
            initialValue: '',
            options: [
              {
                title: 'S',
                value: 's',
              },
              {
                title: 'M',
                value: 'm',
              },
              {
                title: 'L',
                value: 'l',
              },
              {
                title: 'XL',
                value: 'xl',
              },
            ],
          },
        ],
      },
      {
        checkboxQuestions: [
          {
            //Allergies question
            question: 'Allergies / Dietary Restrictions',
            required: false,
            id: 'dietary',
            name: 'dietary',
            initialValue: [],
            options: [
              {
                title: 'Vegan',
                value: 'Vegan',
              },
              {
                title: 'Vegetarian',
                value: 'Vegetarian',
              },
              {
                title: 'Halal',
                value: 'Halal',
              },
              {
                title: 'Nuts',
                value: 'Nuts',
              },
              {
                title: 'Fish',
                value: 'Fish',
              },
              {
                title: 'Wheat',
                value: 'Wheat',
              },
              {
                title: 'Dairy',
                value: 'Dairy',
              },
              {
                title: 'Eggs',
                value: 'Eggs',
              },
              {
                title: 'No Beef',
                value: 'NoBeef',
              },
              {
                title: 'No Pork',
                value: 'NoPork',
              },
            ],
          },
        ],
      },
      {
        textAreaQuestions: [
          {
            //Accomodations question
            question: 'Anything else we can do to better accommodate you at our hackathon?',
            id: 'accomodations',
            name: 'accomodations',
            required: false,
            initialValue: '',
            placeholder: 'List any accessibility concerns here',
          },
        ],
      },
    ],
    //Question Topic
    sponsorInfoQuestions: [
      {
        textInputQuestions: [
          {
            //Github question
            question: 'Github',
            id: 'github',
            name: 'github',
            required: false,
            initialValue: '',
          },
          {
            //LinkedIn question
            question: 'LinkedIn',
            id: 'linkedin',
            name: 'linkedin',
            required: false,
            initialValue: '',
          },
          {
            //Website question
            question: 'Personal Website',
            id: 'website',
            name: 'website',
            required: false,
            initialValue: '',
          },
        ],
      },
    ],
    teammateQuestions: [
      {
        textInputQuestions: [
          {
            id: 'teammate1',
            initialValue: '',
            question: 'Email of teammate #1 (if any)',
            name: 'teammate1',
            required: false,
          },
          {
            id: 'teammate2',
            initialValue: '',
            question: 'Email of teammate #2 (if any)',
            name: 'teammate2',
            required: false,
          },
          {
            id: 'teammate3',
            initialValue: '',
            question: 'Email of teammate #3 (if any)',
            name: 'teammate3',
            required: false,
          },
        ],
      },
      {
        checkboxQuestions: [
          {
            // Agree to terms
            question: 'Disclaimer',
            required: true,
            id: 'disclaimer',
            name: 'disclaimer',
            initialValue: [],
            options: [
              {
                title: 'I understand that this is an Application and does not guarantee admission.',
                value: 'Yes',
              },
            ],
          },
          {
            //Code of Conduct question
            question: 'Code of Conduct',
            required: true,
            id: 'codeOfConduct',
            name: 'codeOfConduct',
            initialValue: [],
            options: [
              {
                title: 'I have read and agree to the',
                value: 'Yes',
                link: 'https://static.mlh.io/docs/mlh-code-of-conduct.pdf',
                linkText: 'MLH Code of Conduct',
              },
            ],
          },
          {
            question: 'Privacy Policy',
            required: true,
            id: 'mlhPrivacyPolicy',
            name: 'mlhPrivacyPolicy',
            initialValue: [],
            options: [
              {
                title:
                  'I authorize you to share my application/registration information with Major League Hacking for event administration, ranking, and MLH administration in-line with the [MLH Privacy Policy](https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md). I further agree to the terms of both the [MLH Contest Terms and Conditions](https://github.com/MLH/mlh-policies/blob/main/contest-terms.md) and the [MLH Privacy Policy](https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md)',
                value: 'Yes',
              },
            ],
          },
          {
            question: 'Notifications',
            required: false,
            id: 'mlhNotifications',
            name: 'mlhNotifications',
            initialValue: [],
            options: [
              {
                title:
                  'I authorize MLH to send me occasional emails about relevant events, career opportunities, and community announcements.',
                value: 'Yes',
              },
            ],
          },
        ],
      },
    ],
  },
};

//add any question data that your org would like to see on the admin stats page
export type statRecordTypes = {
  //name: Record<string || number, number>
  age: Record<number, number>;
  companies: Record<string, number>;
  dietary: Record<string, number>;
  ethnicity: Record<string, number>;
  race: Record<string, number>;
  size: Record<string, number>;
  softwareExperience: Record<string, number>;
  studyLevel: Record<string, number>;
  university: Record<string, number>;
  gender: Record<string, number>;
  hackathonExperience: Record<number, number>;
  heardFrom: Record<string, number>;
  timestamp: Record<string, number>;
};

//add the title for each field that will be displayed as chart titles in admin stats page
export const fieldNames = {
  //name: title
  age: 'Age',
  ethnicity: 'Ethnicity',
  race: 'Race',
  size: 'Shirt Size',
  softwareExperience: 'Software Experience',
  studyLevel: 'Study Level',
  university: 'University',
  gender: 'Gender',
  hackathonExperience: 'Number of Hackathon attended',
  heardFrom: 'Heard of Hackathon from',
  scans: 'Swags', //not part of registration questions, used for scanner
  companies: 'Companies',
  dietary: 'Dietary',
  timestamp: 'Registration Time',
};

//name fields that are checkbox questions belong here
export const arrayField = ['companies', 'dietary', 'disclaimer', 'codeOfConduct'];
//any other fields belong here
export const singleField = [
  'age',
  'ethnicity',
  'race',
  'size',
  'softwareExperience',
  'studyLevel',
  'university',
  'gender',
  'hackathonExperience',
  'heardFrom',
];

//not to be edited ⬇︎ (unless there needs to be more question topics)
export interface HackPortalConfig {
  groupNames: string[];
  registrationFields: {
    generalQuestions: QuestionTypes[];
    schoolQuestions: QuestionTypes[];
    hackathonExperienceQuestions: QuestionTypes[];
    shortAnswerQuestions: QuestionTypes[];
    eventInfoQuestions: QuestionTypes[];
    sponsorInfoQuestions: QuestionTypes[];
    teammateQuestions: QuestionTypes[];
  };
}

export interface QuestionTypes {
  checkboxQuestions?: CheckboxQuestion[];
  dropdownQuestions?: DropdownQuestion[];
  textInputQuestions?: RegistrationQuestion[];
  numberInputQuestions?: NumberInputQuestion[];
  datalistQuestions?: datalistQuestion[];
  textAreaQuestions?: textAreaQuestion[];
}

interface RegistrationQuestion {
  question: string;
  id: string;
  name: string;
  required: boolean;
  initialValue: any; //value that will be first presented on the form
}

export interface CheckboxQuestion extends RegistrationQuestion {
  options: Array<{
    title: string;
    value: string;
    link?: string;
    linkText?: string;
  }>;
}

export interface DropdownQuestion extends RegistrationQuestion {
  options: Array<{
    title: string;
    value: string;
  }>;
}

export interface NumberInputQuestion extends RegistrationQuestion {
  min: string;
  max: string;
  pattern: string;
}

export interface datalistQuestion extends RegistrationQuestion {
  datalist: string;
  options: Array<{
    title: string;
    value: string;
  }>;
}

export interface textAreaQuestion extends RegistrationQuestion {
  placeholder: string;
}

//extracting initial values
export const generateInitialValues = (savedValues) => {
  let finalValues: any = {};
  for (let obj of hackPortalConfig.registrationFields.generalQuestions) {
    setInitialValues(obj, finalValues, savedValues);
  }
  for (let obj of hackPortalConfig.registrationFields.schoolQuestions) {
    setInitialValues(obj, finalValues, savedValues);
  }
  for (let obj of hackPortalConfig.registrationFields.hackathonExperienceQuestions) {
    setInitialValues(obj, finalValues, savedValues);
  }
  for (let obj of hackPortalConfig.registrationFields.shortAnswerQuestions) {
    setInitialValues(obj, finalValues, savedValues);
  }
  for (let obj of hackPortalConfig.registrationFields.eventInfoQuestions) {
    setInitialValues(obj, finalValues, savedValues);
  }
  for (let obj of hackPortalConfig.registrationFields.sponsorInfoQuestions) {
    setInitialValues(obj, finalValues, savedValues);
  }
  for (let obj of hackPortalConfig.registrationFields.teammateQuestions) {
    setInitialValues(obj, finalValues, savedValues);
  }
  return finalValues;
};
const setInitialValues = (obj, finalValues, savedValues) => {
  if (obj.textInputQuestions)
    for (let inputObj of obj.textInputQuestions) {
      finalValues[inputObj.name] = inputObj.initialValue;
      if (
        savedValues &&
        savedValues[inputObj.name] !== undefined &&
        savedValues[inputObj.name] !== null
      ) {
        finalValues[inputObj.name] = savedValues[inputObj.name];
      }
    }
  if (obj.numberInputQuestions)
    for (let inputObj of obj.numberInputQuestions) {
      finalValues[inputObj.name] = inputObj.initialValue;
      if (
        savedValues &&
        savedValues[inputObj.name] !== undefined &&
        savedValues[inputObj.name] !== null
      ) {
        finalValues[inputObj.name] = savedValues[inputObj.name];
      }
    }
  if (obj.dropdownQuestions)
    for (let inputObj of obj.dropdownQuestions) {
      finalValues[inputObj.name] = inputObj.initialValue;
      if (
        savedValues &&
        savedValues[inputObj.name] !== undefined &&
        savedValues[inputObj.name] !== null
      ) {
        finalValues[inputObj.name] = savedValues[inputObj.name];
      }
    }
  if (obj.checkboxQuestions)
    for (let inputObj of obj.checkboxQuestions) {
      finalValues[inputObj.name] = inputObj.initialValue;
      if (
        savedValues &&
        savedValues[inputObj.name] !== undefined &&
        savedValues[inputObj.name] !== null
      ) {
        finalValues[inputObj.name] = savedValues[inputObj.name];
      }
    }
  if (obj.datalistQuestions)
    for (let inputObj of obj.datalistQuestions) {
      finalValues[inputObj.name] = inputObj.initialValue;
      if (
        savedValues &&
        savedValues[inputObj.name] !== undefined &&
        savedValues[inputObj.name] !== null
      ) {
        finalValues[inputObj.name] = savedValues[inputObj.name];
      }
    }
  if (obj.textAreaQuestions)
    for (let inputObj of obj.textAreaQuestions) {
      finalValues[inputObj.name] = inputObj.initialValue;
      if (
        savedValues &&
        savedValues[inputObj.name] !== undefined &&
        savedValues[inputObj.name] !== null
      ) {
        finalValues[inputObj.name] = savedValues[inputObj.name];
      }
    }
};

// export const formInitialValues = getInitialValues();

export const config = {
  targetDate: '2024-11-15T18:00:00-11:00',
};

//extracting statRecords for general stats
const getStatRecords = () => {
  let records: any = {};
  for (const field in fieldNames) {
    records[field] = {};
  }
  return records;
};
export const statRecords: statRecordTypes = getStatRecords();
