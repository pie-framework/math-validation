## [1.4.3](https://github.com/pie-framework/math-validation/compare/v1.4.2...v1.4.3) (2026-11-04)


### Bug Fixes

* **conversion:** use Math.PI for degree and gradian conversion (PIE-905) ([d23b08c](https://github.com/pie-framework/math-validation/commit/d23b08c77ea55cda70633312407c070d8d6c8045))
* **symbolic:** accept inequalities multiplied by an even power of a variable (PIE-1419) ([7f6fd77](https://github.com/pie-framework/math-validation/commit/7f6fd77ca4aa35eaef39e12f8c0689061bc061f8))
* **symbolic:** compare two-variable inequalities by region instead of at x = 1 (PIE-1419) ([be10199](https://github.com/pie-framework/math-validation/commit/be10199f1bc894497fd87248715bb74e7fd22ef4))
* **symbolic:** match only exact multiples of 90° and keep exact values next to replaced zeros (PIE-1418) ([a98b4c0](https://github.com/pie-framework/math-validation/commit/a98b4c060c313d95d791677edc0951fa63b09f3d))
* **symbolic:** only snap exact multiples of 90° and give division by zero no sign (PIE-1418) ([254b284](https://github.com/pie-framework/math-validation/commit/254b28462bf642fa740c0f009cf2ee627826d3f4))
* **symbolic:** sample distinct non-integer values per variable in numeric checks (PIE-443) ([89ae164](https://github.com/pie-framework/math-validation/commit/89ae1647a055fb6c4af926c902fa92fdf946ae57))
* **symbolic:** sample negative values and compare numerators in numeric equation checks (PIE-443) ([5d17d47](https://github.com/pie-framework/math-validation/commit/5d17d47ae9e31cc1ca982e5f8ca893968ff83d1b))
* **symbolic:** skip the numerator comparison for high powers and long expressions (PIE-443) ([a7ca8e1](https://github.com/pie-framework/math-validation/commit/a7ca8e13cefc84ec93ffdc682aa70895e252368a))
* **symbolic:** stop rounding numeric constants to 4 decimals (PIE-905) ([cf5a580](https://github.com/pie-framework/math-validation/commit/cf5a580ac26ddd36fb5c785e007c1e852ab97602))
* **symbolic:** stop scoring unsolvable two-variable equations as equivalent (PIE-443) ([8a7c141](https://github.com/pie-framework/math-validation/commit/8a7c141cc802d5cad39a6382e5c783ee9238ab3f))
* **symbolic:** stop treating large numbers as infinity (PIE-1418) ([2e507b4](https://github.com/pie-framework/math-validation/commit/2e507b4882292de85f07d486d6863861161a3f19))
* **symbolic:** use a relative tolerance with a small floor for numeric comparisons (PIE-905) ([d6b61a9](https://github.com/pie-framework/math-validation/commit/d6b61a9957b1e673fb7617f0e52c6fccccd1967e))
