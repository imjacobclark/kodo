# Kodo: Infrastructure

## Deploying 🚀

Kodo is split into many smaller, decoupled systems but they all loosley group into two high level systems.

### Heartbeat architecture:

An event driven flow that handles heartbeats coming in from clients, storing them and processing them into stats for future clients to read.

```Extension -> API Gateway (Kodo Api) -> SQS -> Lambda (Event Handler) -> DynamoDB (Event Store) -> DynamoDB Stream (Event Stream) -> Lambda (Calculation Handler) -> DynamoDB (Calculation Store)```

### Presentation architecture: 

A request driven flow that reads stats derived from earlier events.

```Web Browser -> API Gateway (Kodo Api) -> Lambda (Stats Handler) -> DynamoDB (Calculation Store)```

You can deploy all of this into your own AWS account, you'll need `Python3`, `pip` and the `awscli`. Once you have these you can configure the awscli with your AWS client key and secret and deploy the stacks!

You'll need to manually configure an IAM role called `kodo-apigateway` with a permissions policy of `AmazonAPIGatewayPushToCloudWatchLogs`, this will eventually make its way into CloudFormation, but for the mo, do manually create it otherwise all API requests will fail.

```shell
$ git clone git@github.com:imjacobclark/kodo.git && cd kodo
$ curl -O https://bootstrap.pypa.io/get-pip.py
$ python3 get-pip.py --user
$ pip3 install awscli --upgrade --user
$ aws configure
$ make package && make deploy
```