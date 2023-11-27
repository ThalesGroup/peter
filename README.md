
# PETER - Product Evaluation for Ecodesign and Reporting

PETER is a tool to help engineering teams compute the ecological footprint of the solutions they develop.

To start estimating your carbon impact with PETER 

## Getting started

### Prerequisite

#### NPM

We use `npm` to manage dependencies, build, run tests etc...

You'll find installation guide depending on your `Operating System`: [install | npm Docs (npmjs.com)](https://docs.npmjs.com/cli/v9/configuring-npm/install)


### Installation

```shell
npm install
```

### Start in dev mode (hot reload)

```
npm run dev
```

### Tests

```
npm run test
```

If you want your tests to run again after a change (in case of TDD for example):

```
npm run testw
```

### Build for production

```
npm run build
```
### Update data
if you want to update data about list just add the data in the list located in the files that has a name that contained "Provider".
For the file sent to the team, it is the file "InMemoryEvaluationVersionProvider.ts"
