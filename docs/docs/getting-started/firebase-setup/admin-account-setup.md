# Admin Setup

To set up your superadmin account, start the development server and use the sign-in button to create an account. Once the account has been created, navigate to the Firestore Database in Firebase and go to the "/registrations" collection. Find the document with your sign-in and under the "permissions" array in the "user" map, update the "hacker" role to "super_admin". You should now have full access to the Admin panel.
