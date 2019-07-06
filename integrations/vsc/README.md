# Kodo: Visual Studio Code

## Developing 👩‍💻👨🏻‍💻

Once you load `kodo` into Visual Studio Code you can use the debugging tool inside VS Code to run the extension.

```shell
$ git clone git@github.com:imjacobclark/kodo.git && cd kodo
$ code .
```

## Building 👷‍♀️👷‍♂️

In order to produce a `.vsix` to install into Visual Studio Code manually, you'll need `vsce` and the `Kodo` local dependencies, once you have these you can compile and make the `.vsix`.

```shell
$ git clone git@github.com:imjacobclark/kodo.git && cd kodo
$ npm install -g vsce
$ npm install
$ npm compile
$ make
```