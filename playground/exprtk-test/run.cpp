#include "exprtk/exprtk.hpp"
#include <stdio.h>
#include <limits>

int main(){
  printf("hello world!\n");

  typedef double T; // numeric type (float, double, mpfr etc...)

 typedef exprtk::symbol_table<T> symbol_table_t;
 typedef exprtk::expression<T>     expression_t;
 typedef exprtk::parser<T>             parser_t;

 std::string expression_string = "z := x - (3 * y)";

 T x = T(123.456);
 T y = T(98.98);
 T z = T(0.0);

 symbol_table_t symbol_table;
 symbol_table.add_variable("x",x);
 symbol_table.add_variable("y",y);
 symbol_table.add_variable("z",z);

 expression_t expression;
 expression.register_symbol_table(symbol_table);

 parser_t parser;

 if (!parser.compile(expression_string,expression))
 {
    printf("Compilation error...\n");
    return 1;
 }

 T result = expression.value();

  printf("value: %f\n", result);
// typedef std::numeric_limits< double > dbl;

// std::cout.precision(dbl::max_digits10);
// std::cout << "Pi: " << result << endl;


  return 0;
}