# math-validation

- an api
- a large set of test data
- aims to determine if two mathematical expressions are equal, either having the same form or not
- have a public website where you can add some math and check if it works - also the link should be shareable


## demo

```shell
yarn demo
```

Then go to `http://localhost:$PORT/demo`


## tests

```shell
yarn jest
```

Runs all the tests

There is one test that runs fixture data located here: `src/fixtures/latex-equal/*.ts`. To filter the fixtures you run here you can use the `-t` flag:

```shell
yarn jest src/__tests__/latex-equal.spec.ts -t src/fixtures/latex-equal/7119.ts --reporters default
```


## Next Steps

* Check that api we expose will support what is needed.
* Do triage on the test failures, add a note to failing test so we can build a picture of the work needed


## Test failure triage

| theme                      | notes                                                                  |
|----------------------------|------------------------------------------------------------------------|
| latex parsing              | seems like we aren't able to parse all the inputs in the test cases    |
| math evaluation            | math.js is not seeing things as being equal - need more detail on that |
| incomplete literal support | we haven't really set up literal options support yet                   |
| incorrect test data        | sometimes the test data is not quite right                             |


## Goals

* we parse from latex -> ast -> mathjs
* clean up symbolic evaluation (in progress)
* avoid the use of string manipulation/regex (in progress)
* more advanced literal validation (todo)
* block input that is clearly too large/unrelated (eg: a user can type in gobbledy-gook - we should just abort if we see that)


## Capabilities

- comparing linear equations in one variable
- linear equations in two variables
- 2-way inequalities with one or two unknown variables
- compound inequalities in one variable
- trigonometric identities or functions
- inverse trigonometric functions
- it can also handle degrees, radians and gradians
- recognises similar notation for logarithms and based logarithms


### things that'd be great (but we may have to park until we have more time)

* a faster latex parser
* faster math evaluation


## modes

There are 2 modes - literal and symbolic

Literal: is at its most basic a tuned version of a string validation

By default - ignores spaces and parentheses as long as they do not change the meaning of operations (ex. “a+7 +b” will validate against “  ((a)    + (7))+b ”)
           - ignores leading zeros: “0.1” will validate against “.1”
           - accepts commas for decimal marks. For example “1,000” will be equivalent with 1000

Literal Validation offers two configuration options that can be used to validate some variety of forms for an expression:

Ignore trailing zeros option; allows the evaluation to accept zeros to the right of the decimal place “4.5” will validate against “4.50000000000000”
Ignore order option; makes validation indifferent to the variables order, as long as it does not change operations meaning. In this case “a+7 +b*c” will validate against “7 + a+bc”, but not against “ac+7+b”; without it “a+7 +b” will not validate against “7 + a+b”

Symbolic: attempts to decide if expressions are mathematically equivalent or not

By default, it offers all configurations presented for literal validation, exceeding it by quite a lot
In order to check equivalence between 2 expressions, we have to reduce both expressions to the simplest one. Then distribute all coefficients, combine any like terms on each side of the expression, and arrange them in the same order. 


### Notes

* `@babel/runtime` is a devDependency if you ever need to link this repo to another package for testing

## TODO
* set up api that is compatible w/ ui component options
* derivatives kind of work and kind of not - how to use?

### CI

We use circleci - see .circleci/config.yml

### debugging tests

#### vscode
add the following to `configurations` array in launch.json
```json
    {
      "name": "Attach",
      "port": 9229,
      "request": "attach",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "type": "pwa-node"
    }
```

```shell
node --inspect-brk ./node_modules/.bin/jest --runInBand #and any other flags you want
```
The launch debug using 'Attach' command above.

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
