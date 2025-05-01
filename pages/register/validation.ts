import * as Yup from 'yup';

export const isValidUSPhoneNumber = (phoneNumber: string) => {
  return /^(1[ -]?)?\d{3}[ -]?\d{3}[ -]?\d{4}$/.test(phoneNumber);
};

export const isValidInternationalPhoneNumber = (phoneNumber: string) => {
  return /(\+|00)(297|93|244|1264|358|355|376|971|54|374|1684|1268|61|43|994|257|32|229|226|880|359|973|1242|387|590|375|501|1441|591|55|1246|673|975|267|236|1|61|41|56|86|225|237|243|242|682|57|269|238|506|53|5999|61|1345|357|420|49|253|1767|45|1809|1829|1849|213|593|20|291|212|34|372|251|358|679|500|33|298|691|241|44|995|44|233|350|224|590|220|245|240|30|1473|299|502|594|1671|592|852|504|385|509|36|62|44|91|246|353|98|964|354|972|39|1876|44|962|81|76|77|254|996|855|686|1869|82|383|965|856|961|231|218|1758|423|94|266|370|352|371|853|590|212|377|373|261|960|52|692|389|223|356|95|382|976|1670|258|222|1664|596|230|265|60|262|264|687|227|672|234|505|683|31|47|977|674|64|968|92|507|64|51|63|680|675|48|1787|1939|850|351|595|970|689|974|262|40|7|250|966|249|221|65|500|4779|677|232|503|378|252|508|381|211|239|597|421|386|46|268|1721|248|963|1649|235|228|66|992|690|993|670|676|1868|216|90|688|886|255|256|380|598|1|998|3906698|379|1784|58|1284|1340|84|678|681|685|967|27|260|263)(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{4,20}$/.test(
    phoneNumber.replaceAll(' ', ''),
  );
};

export const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  preferredEmail: Yup.string().email('Invalid email').required('Email is required'),
  university: Yup.string().required('University is required'),
  major: Yup.string().required('Major is required'),
  studyLevel: Yup.string().required('Study level is required'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .test('phone', 'Invalid phone number', (value) => {
      if (!value) return false;
      return isValidUSPhoneNumber(value) || isValidInternationalPhoneNumber(value);
    }),
  age: Yup.number().required('Age is required').min(13, 'Must be at least 13 years old'),
  gender: Yup.string().required('Gender is required'),
  race: Yup.string().required('Race is required'),
  ethnicity: Yup.string().required('Ethnicity is required'),
  hackathonExperience: Yup.number().required('Hackathon experience is required'),
  softwareExperience: Yup.string().required('Software experience is required'),
  heardFrom: Yup.string().required('How you heard about us is required'),
  size: Yup.string().required('T-shirt size is required'),
  dietary: Yup.array().of(Yup.string()),
  accomodations: Yup.string(),
  github: Yup.string().url('Invalid URL'),
  linkedin: Yup.string().url('Invalid URL'),
  website: Yup.string().url('Invalid URL'),
  resume: Yup.string(),
  companies: Yup.array().of(Yup.string()),
  status: Yup.string(),
  teammate1: Yup.string(),
  teammate2: Yup.string(),
  teammate3: Yup.string(),
  country: Yup.string().required('Country is required'),
  whyAttend: Yup.string().required('Please tell us why you want to attend'),
  hackathonNumber: Yup.string().required('Number of hackathons attended is required'),
  hackathonFirstTimer: Yup.string().required('Please indicate if this is your first hackathon'),
  lookingForward: Yup.string().required('Please tell us what you are looking forward to'),
  disclaimer: Yup.array().of(Yup.string()).required('Please accept the disclaimer'),
  codeOfConduct: Yup.array().of(Yup.string()).required('Please accept the code of conduct'),
});
