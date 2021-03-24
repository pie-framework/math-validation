# math-validation

- an api
- a large set of test data
- have a public website where you can add some math and check if it works - also the link should be shareable

## tests

```shell 
yarn jest
```

Runs all the tests

There is one test that runs fixture data located here: `src/__tests__fixtures/equal/*.ts`. To filter the fixtures you run here you can use the `-t` flag:

```shell
yarn jest src/__tests__/equal.spec.ts -t src/__tests__/fixtures/equal/a.ts
```

All the fixtures that george added are in the `fixtures` directory, we are in the process of converting them to typescript.


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

Literal needs to more advanced than the legacy literal implementation which was essentially a string check.

Symbolic 


### legacy tests comparison 

The equals test can to run the legacy tests.  Set `LEGACY` env var to `true`. 

### Notes

* `@babel/runtime` is a devDependency if you ever need to link this repo to another package for testing

## TODO
* strip logs on compile
* set up api that is compatible w/ ui component options 
* start going through the tests, build up literal + symbolic a bit att the start
* derivatives kind of work and kind of not how to use?
* sane input checking?


## explore
* is a different math evaluator faster than mathjs? eg in wasm?
* c/c++ evaluator as wasm? any better/faster?
* better latex parser than math-expressions?

## exprtk

* set up emscripten build to see if it works? then run node test case against it and mathjs?

## references

https://www.symbolab.com/solver/simplify-calculator - good math simplifier
https://mathjs.org/docs/expressions/algebra.html - mathjs docs



wip 

* use of derivitives for equality testing?
* look at at tests where we mention bad ast generation

http://maxima.sourceforge.net/documentation.html
http://derivative-calculator.net
https://mathnotepad.com/
https://www.symbolab.com/solver/partial-derivative-calculator/%5Cfrac%7B%5Cpartial%7D%7B%5Cpartial%20x%7D%5Cleft(x%5E%7B2%7D%20%2B%20y%5E%7B2%7D%5Cright)