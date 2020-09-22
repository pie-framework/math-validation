# math-validation

- an api
- a large set of test data
- have a public website where you can add some math and check if it works - also the link should be shareable

## tests

The tests use some fixture data

```shell
yarn jest
```

The fixture files are used as the describe name so you can filter using `-t`:

```shell
yarn jest -t fixtures/equal/percent-ch6456.cson
```

# TODO:

- https://github.com/kulshekhar/ts-jest/issues/436 - wrong error line in jest - cson-parser issue?


## explore

* c/c++ evaluator as wasm? any better/faster?
* sane input checking?
* better latex parser than math-expressions?