import { Registration as BaseRegistration, Companies } from '@/lib/types';
import { QuestionTypes } from '@/hackportal.config';

export interface PartialRegistration {
  id: string;
  firstName: string;
  lastName: string;
  preferredEmail: string;
  age: number;
  gender: string;
  race: string;
  ethnicity: string;
  university: string;
  major: string;
  studyLevel: string;
  hackathonExperience: number;
  softwareExperience: string;
  heardFrom: string;
  size: string;
  dietary: string[];
  accomodations: string;
  github?: string;
  linkedin?: string;
  website?: string;
  resume?: string;
  companies: Companies[];
  status: string;
  teammate1: string;
  teammate2: string;
  teammate3: string;
  phoneNumber: string;
  country: string;
  whyAttend: string;
  hackathonNumber: string;
  hackathonFirstTimer: string;
  lookingForward: string;
  updatedAt: string;
  createdAt: string;
  disclaimer: string[];
  codeOfConduct: string[];
  currentRegistrationPage?: number;
  majorManual?: string;
  universityManual?: string;
  heardFromManual?: string;
  permissions?: string[];
  user?: {
    id: string;
    permissions: string[];
    firstName: string;
    lastName: string;
    preferredEmail: string;
    group?: string;
  };
  timestamp: number;
}

export type Registration = BaseRegistration;

export interface RegistrationSection {
  title: string;
  questions: QuestionTypes[];
}

export interface RegistrationQuestion {
  textInputQuestions?: {
    id: string;
    name: string;
    question: string;
    required: boolean;
    initialValue: string;
  }[];
  numberInputQuestions?: {
    id: string;
    name: string;
    question: string;
    required: boolean;
    initialValue: number;
  }[];
  dropdownQuestions?: {
    id: string;
    name: string;
    question: string;
    required: boolean;
    options: { title: string; value: string }[];
    initialValue: string;
  }[];
  checkboxQuestions?: {
    id: string;
    name: string;
    question: string;
    required: boolean;
    options: { title: string; value: string; link?: string; linkText?: string }[];
    initialValue: string[];
  }[];
  datalistQuestions?: {
    id: string;
    name: string;
    question: string;
    required: boolean;
    options: { title: string; value: string }[];
    initialValue: string;
  }[];
  textAreaQuestions?: {
    id: string;
    name: string;
    question: string;
    required: boolean;
    initialValue: string;
  }[];
}
