# Kodo

Kodo is a service that measures your software usage. It can track how long you've spent browsing the web this month, how long you've spent coding today and even what your all time favourite song is.

Kodo is most often an extension or plugin that you'll need to install in the software you want to measure your usage in. The extension sends  stats back to Kodo and we store them so you can view them later. 

Kodo is able to support any software application that is able to send stats in a particular format. If you'd like to track usage in an application that isn't yet supported, please do contribute back!  

Whilst Kodo is a managed service, it is built on serverless technologies using Amazon Web Services Serverless Application Model (AWS SAM), meaning you can easily depoy this to your own infrastructure.

## Software Support 👌

- Visual Studio Code

## Features ✅

- Tracks activity across your: workspaces, projects and files.
- Automatically stores all tracked activity remotely.
- Automatically begins recording your activity.

## Coming soon 🛠 

- Sign in with Google, Facebook, Amazon or email.
- Generate and set your own API key. 
- View all activity as graphs/tables within your web browser.
- Export activity as JSON. 
- Delete your account and all associated data. 
- Leaderboards, teams and friends. 
- API to display your activity on the web.

## Develop, Build & Deploy

### Extensions

Each extension has its own README on how to to build and deploy, see the `extensions` directory for the full list of supported extensions.

### Infrastructure

Kodos infrastructure takes care of much of the business logic, it is fully event driven and fully serverless via AWS SAM. It can be developed and deployed as a separate entity, see the `infrastructure` directory for full instructions.

### Web

Kodas website is built and deployed independently of the rest of the infrastructure, it is AWS Amplify which takes care of all the heavy lifting. Web calls out to the infrastructure to gather data. See the `web` directory for full instructions.

## Disclosure 

Kodo captures the following data and ships it off to Amazon.

* Your username
* Your file names
* Your workspaces folder names
* Your elapsed time within these files/folders
* Your software usage

## Data Handling

If you've built this extension locally and sent your data to our database and would like it deleting, please raise an issue against this repo and we will remove it.