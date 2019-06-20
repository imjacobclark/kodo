# vs-odo

vs-odo is a Visual Studio Code extension that measures your activity across files within your workspace. It measures how long you've spent in each file/project/language and reports it back at regular intervals so you can quantify your coding activity.

vs-odo is built on serverless technologies using Amazon Web Services Serverless Application Model (AWS SAM), meaning you can easily depoy this to your own infrastructure if you fancy! 

## Developing 👩‍💻👨🏻‍💻

Once you load `vs-odo` into Visual Studio Code you can use the debugging tool inside VS Code to run the extension.

```shell
$ git clone git@github.com:imjacobclark/vs-odo.git && cd vs-odo
$ code .
```

## Building 👷‍♀️👷‍♂️

In order to produce a `.vsix` to install into Visual Studio Code manually, you'll need `vsce` and the `vs-odo` local dependencies, once you have these you can compile and make the `.vsix`.

```shell
$ git clone git@github.com:imjacobclark/vs-odo.git && cd vs-odo
$ npm install -g vsce
$ npm install
$ npm compile
$ make
```

## Deploying 🚀

vs-odo is made up of: `VS Code Extension -> API Gateway -> SQS -> Lambda -> DynamoDB`, you can deploy all of this into your own AWS account, you'll need `Python3`, `pip` and the `awscli`. Once you have these you can configure the awscli with your AWS client key and secret and deploy the stacks!

```shell
$ git clone git@github.com:imjacobclark/vs-odo.git && cd vs-odo
$ curl -O https://bootstrap.pypa.io/get-pip.py
$ python3 get-pip.py --user
$ pip3 install awscli --upgrade --user
$ aws configure
$ make package && make deploy
```

## Disclosure 

vs-odo captures the following data and ships it off to Amazon.

* Your username
* Your projects file names
* Your workspaces folder name
* Your elapsed time within these files/folders