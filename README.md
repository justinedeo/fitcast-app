## Comprehensive Steps for getting the app up and running

## 1. Setting up git

   # Prelude:

   Run the following command in a terminal:

   winget install --id Git.Git -e --source winget

   # Part 1: Get a token

   1. Log in to github

   2. Navigate to your Developer settings by clicking your profile picture in the top-right corner, selecting Settings, and then choosing Developer settings from the left sidebar

   3. Go to Personal access tokens and select Tokens (classic)

   4. Click the Generate new token button

   5. Give your token a descriptive name and set an expiration date

   6. Select the necessary scopes (permissions). For typical Git operations like pushing to repositories, you will need the repo scope (full control of private repositories)

   (I used these permissions: admin:enterprise, admin:gpg_key, admin:org, admin:org_hook, admin:public_key, admin:repo_hook, admin:ssh_signing_key, audit_log, codespace, copilot, delete:packages, delete_repo, gist, notifications, project, repo, user, workflow, write:discussion, write:network_configurations, write:packages)

   7. Click generate token

   8. Copy the token immediately. You will not be able to see it again after you leave the page, so store it securely. 

   # Part 2: Configure your terminal

   1. Run the login command in your terminal: git auth login

   2. Follow the steps in the login command


### Choose the folder you want to set the project up in

## 2. Open a terminal in that folder

For me this looks like:
 
## Downloading and Installing ##
   
   Start Menu Search - Powershell 

   Powershell opens

   cd ..

   cd /Desktop/fitcast/

   git clone https://github.com/justinedeo/fitcast-app

   cd fitcast-app

   npm install expo 

   npm install firebase

## 2. Getting your Keys Setup

   Go to this link: https://drive.google.com/drive/folders/1Sy8w283TwVkSW7WleJXlqGqILofH0i9Q?usp=sharing and download both the .env file and the firebaseConfig.ts

   the env file goes in the apps root folder /fitcast-app/

   the firebaseConfig.ts file goes in a new folder called services, the services folder goes in /fitcast-app/, it should look like /fitcast-app/services/

## 3. Creating a branch to work in

   Open vs studio code and open an integrated terminal in the root folder of the app, /fitcast-app/

   download the "firebase data connect" extension and enable it in vs studio code

   you will have to sign in with the account that is connected to the database already (caitlyncbeam@gmail.com, gpipes1@leomail.tamuc.edu, Morrow4242@gmail.com, justinefdeo@gmail.com)

   Run the following commands:

   git checkout main

   git pull origin main

   git checkout -b <Name of the branch you want to create here>

   git add .

   git stash

   git commit -m "EmptyCommit"

   git push -u origin <Your branch>

   firebase dataconnect:sdk:generate

