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

### Sending stats to Kodo

Any application capable of sending HTTP GET requests at regular intervals is capable of sending stats to Kodo.

Kodo expects a well formed JSON object to be sent as a `base64` encoded string via a query parameter to our events API, this well formed object may vary depending on the type of stat you're sending to Kodo, for example, if you wish to send stats for an IDE (Integrated Development Environment, like Visual Studio Code or Vim), you'd send the following payload as a `base64` string.

```json
{
    "application": "vsc",
    "elapsed": 1000,
    "epoch": 1561497275711,
    "identifier": "Authorization.hs",
    "language": "haskell",
    "type": "ide",
    "workspace": "Recify"
}
```

This payload is what we call an event, it should be sent at a regular interval (ideally `1m` intervals, no less). 

Events are then processed in real time in order to translate and consoliate them down into higher level calculations, such as: all time, daily, weekly, monthly and yearly statistics to be presented back to the user. 

An all time stats calculation would look like the below object. This object sums up the statistics of an entire workspace, the items within it (in this instance workspace files) and how long has been spent within each item, plus additional metadata such as: the programming language, the type of application and the application identifier itself (`vsc` for Visual Studio Code).

```json
{
    "stats": {
        "Recify": {
            "items": [
                {
                    "application": "vsc",
                    "type": "ide",
                    "identifier": "Authorization.hs",
                    "elapsed": 1000,
                    "language": "Haskell"
                }
            ]
        }
    }
}
```

A daily stats caluclation would look like the below object (schema to be confirmed).

```json
{
    "stats": {
        "Recify": {
            "01-08-2019": {
                "items": [
                    {
                        "application": "vsc",
                        "type": "ide",
                        "identifier": "Main.hs",
                        "elapsed": 4578,
                        "language": "Haskell"
                    }
                ]
            },
            "02-08-2019": {
                "items": [
                    {
                        "application": "vsc",
                        "type": "ide",
                        "identifier": "Authorization.hs",
                        "elapsed": 1000,
                        "language": "Haskell"
                    }
                ]
            }
        }
    }
}
```