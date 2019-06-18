# vs-odo Architecture 

vs-odo is an asynchronous, serverless architecture. Events are fired into an API Gateway, placed on a queue, processed, stored, processed again, stored and can ultimately be read when required.

vs-odo is deployed onto Amazon Web Services and built using the Serverless Application Model (AWS SAM).

## Components used

* API Gateway
* SQS
* Lambda
* DynamoDB

## Architecture Overview

![Settings Window](https://raw.github.com/imjacobclark/vs-odo/master/architecture/Container Diagram.png)