# vs-odo serverless

Deploys serverless AWS components to handle stat events.

# Architecture

VS Code Extension -> API Gateway -> SQS -> Lambda -> DynamoDB

# Deploying

```
$ aws configure
$ make package && make deploy
```