# Kodo Architecture 

Kodo is an asynchronous, serverless architecture. Events are fired into an API Gateway, placed on a queue, processed, stored, processed again, stored and can ultimately be read when required.

Kodo is deployed onto Amazon Web Services and built using the Serverless Application Model (AWS SAM).

## Components used

* API Gateway
* SQS
* Lambda
* DynamoDB

## Architecture Overview

![Architecture Container Diagram](https://github.com/imjacobclark/kodo/blob/master/architecture/Container%20Diagram.png)