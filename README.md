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

## TODO

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