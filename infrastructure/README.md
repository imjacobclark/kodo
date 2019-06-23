# Kodo: Infrastructure

## Deploying 🚀

Kodo is made up of: `Extension -> API Gateway -> SQS -> Lambda -> DynamoDB`, you can deploy all of this into your own AWS account, you'll need `Python3`, `pip` and the `awscli`. Once you have these you can configure the awscli with your AWS client key and secret and deploy the stacks!

```shell
$ git clone git@github.com:imjacobclark/kodo.git && cd kodo
$ curl -O https://bootstrap.pypa.io/get-pip.py
$ python3 get-pip.py --user
$ pip3 install awscli --upgrade --user
$ aws configure
$ make package && make deploy
```