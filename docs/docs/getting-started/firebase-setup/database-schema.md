---
sidebar_position: 4
---

# Database Schema

### Challenges Collection

```
challenges/
├── [document-id]
    ├── title: string
    ├── description: string
    ├── organization: string
    ├── prizes: array<string>
    └── rank: number
```

### Dates Collection

```
dates/
├── [document-id]
    ├── endTime: number          // UNIX timestamp - hackathon end
    ├── startTime: number        // UNIX timestamp - hackathon start
    ├── year: number            // Year of hackathon
    ├── day1: number            // First day date
    ├── day2: number            // Second day date
    ├── day1Month: number       // Month of first day (0-indexed)
    └── day2Month: number       // Month of second day (0-indexed)
```

### FAQs Collection

```
faqs/
├── [document-id]
    ├── question: string
    └── answer: string
```

### Registration Collection

```
registrations/
├── [document-id]
    ├── id: string
    ├── timestamp: number        // UNIX timestamp of registration
    ├── user: {
    │   ├── id: string
    │   ├── permissions: array<string>
    │   ├── firstName: string
    │   ├── lastName: string
    │   ├── preferredEmail: string
    │   └── group?: string
    │   }
    ├── age: number
    ├── gender: string
    ├── race: string
    ├── ethnicity: string
    ├── university: string
    ├── major: string
    ├── studyLevel: string
    ├── hackathonExperience: number
    ├── softwareExperience: string
    ├── heardFrom: string
    ├── size: string
    ├── dietary: array<string>
    ├── accomodations: string
    ├── github?: string
    ├── linkedin?: string
    ├── website?: string
    ├── resume?: string
    ├── companies: array<Companies>
    ├── status: string
    ├── teammate1: string
    ├── teammate2: string
    ├── teammate3: string
    ├── phoneNumber: string
    ├── country: string
    ├── whyAttend: string
    ├── hackathonNumber: string
    ├── hackathonFirstTimer: string
    ├── lookingForward: string
    ├── updatedAt: string
    ├── createdAt: string
    ├── disclaimer: array<string>
    ├── codeOfConduct: array<string>
    ├── currentRegistrationPage?: number
    ├── majorManual?: string
    ├── universityManual?: string
    ├── heardFromManual?: string
    ├── scans?: array<string>     // References to scan-types
    └── waitListInfo?: {
        ├── waitlistNumber: number
        ├── notificationMethod: string
        └── contactInfo: string
        }
```

### Partial Registration Collection

```
partial-registrations/
├── [document-id]
    ├── id: string
    ├── timestamp: number
    ├── firstName: string
    ├── lastName: string
    ├── preferredEmail: string
    ├── age: number
    ├── gender: string
    ├── race: string
    ├── ethnicity: string
    ├── university: string
    ├── major: string
    ├── studyLevel: string
    ├── hackathonExperience: number
    ├── softwareExperience: string
    ├── heardFrom: string
    ├── size: string
    ├── dietary: array<string>
    ├── accomodations: string
    ├── github?: string
    ├── linkedin?: string
    ├── website?: string
    ├── resume?: string
    ├── companies: array<Companies>
    ├── status: string
    ├── teammate1: string
    ├── teammate2: string
    ├── teammate3: string
    ├── phoneNumber: string
    ├── country: string
    ├── whyAttend: string
    ├── hackathonNumber: string
    ├── hackathonFirstTimer: string
    ├── lookingForward: string
    ├── updatedAt: string
    ├── createdAt: string
    ├── disclaimer: array<string>
    ├── codeOfConduct: array<string>
    ├── currentRegistrationPage?: number
    ├── majorManual?: string
    ├── universityManual?: string
    ├── heardFromManual?: string
    └── permissions?: array<string>
```

### Scan-Types Collection

```
scan-types/
├── [document-id]
    ├── name: string
    └── isCheckIn: boolean
```

### Scheduled-Events Collection

```
schedule-events/
├── [document-id]
    ├── title: string
    ├── description: string
    ├── location: string
    ├── page: string
    ├── startDate: timestamp
    ├── endDate: timestamp
    ├── Event: number
    ├── speakers?: array<string>
    ├── type?: string
    └── track: string
```

### Scoring Collection

```
scoring/
├── [document-id]
    ├── adminId: string          // ID of reviewing admin
    ├── hackerId: string         // ID of user being reviewed
    ├── score: number           // Numeric score
    ├── note: string            // Review notes
    └── isSuperVote?: boolean   // Optional super admin vote flag
```

### Sponsor Collection

```
sponsors/
├── [document-id]
    ├── link: string            // Sponsor website URL
    ├── reference: string       // Image filename in Firebase Storage
    ├── alternativeReference?: string
    └── tier?: string
```

### Token Collection

```
tokens/
├── [document-id]
    └── token: string           // FCM push notification token
```
