---
sidebar_position: 1
---

# Firebase Environment

**Important**

- Start your Cloud Storage and Firestore Database in **test mode**, not **production mode** if you are setting up for development.
- Copy all required environment variables _completely and correctly_.
- Ensure all environment variables are in double quotes and no spaces are present, ex:
  ```
  VARIABLE="<variable-content>"
  ```

To set up the environment, first go to the [Firebase Console](https://console.firebase.google.com).
Switch to your intended Google account before continuing.

Create a Firebase project or use an existing Firebase project.

- If creating a new project, create a new web application and take note of the
  configuration code provided. Copy that somewhere.
- If using an existing project, navigate to project settings and find the app's
  Firebase configuration.

![Firebase Settings](/img/set-up-1.png)

![App configuration](/img/set-up-2.png)

Copy the API Key, the Auth Domain, the Project ID, the Storage Bucket, the Messaging Sender ID, and the App ID into their corresponding environment variables in `.env.local`.

To configure the cloud messaging API, go to the “Cloud Mesaging” tab. To generate the vapid key, scroll down to the "Web Configuration" and generate a key pair. Copy the key pair generated and fill in the corresponding environment variable.

![Cloud Messaging](/img/set-up-3.png)
![Vapid key](/img/set-up-7.png)
