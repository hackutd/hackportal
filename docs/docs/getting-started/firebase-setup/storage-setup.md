# Storage Setup

Create the following folders in Firebase Storage:  
`member_images/`  
`speaker_images/`  
`sponsor_images/`  
These folders will contain images of the team members, the keynote speakers, and the sponsor logos respectively. Upload the images to the folders and reference them in the database.  
For example, if there was a "default.png" in the `speaker_images/` folder, then the "fileName" field of the "members" collection needs to contain the string "default.png".
