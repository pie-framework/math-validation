# math-validation

- an api
- a large set of test data
- have a public website where you can add some math and check if it works - also the link should be shareable

## tests

```shell 
yarn jest
```

Runs all the tests

There is one test that runs fixture data located here: `src/fixtures/latex-equal/*.ts`. To filter the fixtures you run here you can use the `-t` flag:

```shell
yarn jest src/__tests__/latex-equal.spec.ts -t src/fixtures/latex-equal/7119.ts --reporters default
```

## Goals 

* we parse from latex -> ast -> mathjs, legacy was latex -> ast -> math_string -> mathjs (done)
* clean up symbolic evaluation (in progress)
* avoid the use of string manipulation/regex (in progress)
* more advanced literal validation (todo)
* block input that is clearly too large/unrelated (eg: a user can type in gobbledy-gook - we should just abort if we see that)

### things that'd be great (but we may have to park until we have more time)

* a faster latex parser
* faster math evaluation

## modes 

There are 2 modes - literal and symbolic

Literal: needs to more advanced than the legacy literal implementation which was essentially a string check.

Symbolic: 


### legacy tests comparison

We have the old math validation logic in the repo, so we can compare speed and results if needs be. To include them in the test run  set `LEGACY` env var to `true`. 


### Notes

* `@babel/runtime` is a devDependency if you ever need to link this repo to another package for testing

## TODO
* strip logs on compile
* set up api that is compatible w/ ui component options 
* start going through the tests, build up literal + symbolic a bit att the start
* derivatives kind of work and kind of not - how to use?

