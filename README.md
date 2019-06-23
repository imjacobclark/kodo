# Kodo

Kodo is a service that measures your coding activity. It measures how long you've spent in each file/project/language and reports it back at regular intervals so you can quantify your coding activity. 

Kodo requires installation in your IDE as an extension, this extension sends heartbeat stats back to an endpoint and stores them to be queried later. In theory, Kodo could support any software application that is able to send stats in a particular format, e.g Google Chrome.

Kodo is built on serverless technologies using Amazon Web Services Serverless Application Model (AWS SAM), meaning you can easily depoy this to your own infrastructure if you fancy!

## IDE Support 👌

- Visual Studio Code

## Features ✅

- Tracks activity across your: projects, files and programming languages.
- Automatically stores all tracked activity remotely.
- Automatically begins recording your coding activity.

## Coming soon 🛠 

- Sign in with Google, Facebook, Amazon or email.
- Generate and set your own API key. 
- View all coding activity as graphs/tables within your web browser.
- Export coding activity as JSON. 
- Delete your account and all associated data. 
- Leaderboards, teams and friends. 
- API to display your coding activity on the web.

## Develop, Build & Deploy

Each extension has its own README on how to to build and deploy, see the `extensions` directory for the full list of supported extensions.

Kodos infrastructure can be developed and deployed as a separate entity, see the `infrastructure` directory for full instructions.

## Disclosure 

Kodo captures the following data and ships it off to Amazon.

* Your username
* Your projects file names
* Your workspaces folder name
* Your elapsed time within these files/folders

## Data Handling

If you've built this extension locally and sent your data to our database and would like it deleting, please raise an issue against this repo and we will remove it.