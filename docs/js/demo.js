var Demo = (function (mathjs_1, require$$1) {
	'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var mathjs_1__default = /*#__PURE__*/_interopDefaultLegacy(mathjs_1);
	var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, basedir, module) {
		return module = {
			path: basedir,
			exports: {},
			require: function (path, base) {
				return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
			}
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var legacy = createCommonjsModule(function (module, exports) {
	/* eslint-disable no-console */
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ave = exports.symbolicEquals = exports.literalEquals = exports.textToMathText = exports.latexToText = void 0;
	/**
	 * This is the old implementation that we had in pie-lib.
	 * Used as a reference against new impl. Not to be worked on.
	 */
	const mathjs = __importStar(mathjs_1__default['default']);
	const math_expressions_1 = __importDefault(require$$1__default['default']);
	const decimalCommaRegex = /,/g;
	const decimalRegex = /\.|,/g;
	const decimalWithThousandSeparatorNumberRegex = /^(?!0+\.00)(?=.{1,9}(\.|$))(?!0(?!\.))\d{1,3}(,\d{3})*(\.\d+)?$/;
	const rationalizeAllPossibleSubNodes = (expression) => rationalize(mathjs.parse(expression));
	const rationalize = (tree) => {
	    const transformedTree = tree.transform((node) => {
	        try {
	            const rationalizedNode = mathjs.rationalize(node);
	            return rationalizedNode;
	        }
	        catch {
	            return node;
	        }
	    });
	    return transformedTree;
	};
	function prepareExpression(string, isLatex) {
	    let returnValue = string ? string.trim() : "";
	    returnValue = returnValue.replace(decimalCommaRegex, ".");
	    returnValue = isLatex
	        ? exports.latexToText(`${returnValue}`)
	        : exports.textToMathText(`${returnValue}`, {
	            unknownCommands: "passthrough",
	        }).toString();
	    // console.log("returnValue:", returnValue);
	    returnValue = returnValue.replace("=", "==");
	    return rationalizeAllPossibleSubNodes(returnValue);
	}
	const latexToAstOpts = {
	    missingFactor: (token, e) => {
	        console.warn("missing factor for: ", token.token_type);
	        if (token.token_type === "NUMBER") {
	            throw e;
	        }
	        return 0;
	    },
	    unknownCommandBehavior: "passthrough",
	};
	const astToTextOpts = {
	    unicode_operators: {
	        ne: function (operands) {
	            return operands.join(" != ");
	        },
	        "%": function (operands) {
	            return `percent(${operands[0]})`;
	        },
	    },
	};
	const latexToText = (latex, extraOtps = {}) => {
	    const la = new math_expressions_1.default.converters.latexToAstObj({
	        ...latexToAstOpts,
	        ...extraOtps,
	    });
	    const at = new math_expressions_1.default.converters.astToTextObj({ ...astToTextOpts, ...extraOtps });
	    const ast = la.convert(latex);
	    return at.convert(ast);
	};
	exports.latexToText = latexToText;
	const textToMathText = (latex, extraOtps = {}) => {
	    const la = new math_expressions_1.default.converters.textToAstObj({
	        ...latexToAstOpts,
	        ...extraOtps,
	    });
	    const at = new math_expressions_1.default.converters.astToTextObj({ ...astToTextOpts, ...extraOtps });
	    const ast = la.convert(latex);
	    return at.convert(ast);
	};
	exports.textToMathText = textToMathText;
	function shouldRationalizeEntireTree(tree) {
	    let shouldDoIt = true;
	    // we need to iterate the entire tree to check for some conditions that might make rationalization impossible
	    try {
	        tree.traverse((node) => {
	            // if we have a variable as an exponent for power operation, we should not rationalize
	            // try to see if there are power operations with variable exponents
	            if (node.type === "OperatorNode" && node.fn === "pow") {
	                const exponent = node.args[1];
	                // try to see if it can be compiled and evaluated - if it's a non-numerical value, it'll throw an error
	                exponent.compile().eval();
	            }
	            // we cannot have variables for unresolved function calls either
	            if (node.type === "FunctionNode") {
	                //try to see if the argument that the function is called with can be resolved as non-variable
	                const functionParameter = node.args[0];
	                // if it holds variables, this will throw an error
	                functionParameter.compile().eval();
	            }
	        });
	        mathjs.rationalize(tree);
	    }
	    catch {
	        shouldDoIt = false;
	    }
	    return shouldDoIt;
	}
	function containsDecimal(expression = "") {
	    return expression.match(decimalRegex);
	}
	const SIMPLIFY_RULES = [
	    { l: "n1^(1/n2)", r: "nthRoot(n1, n2)" },
	    { l: "sqrt(n1)", r: "nthRoot(n1, 2)" },
	];
	const simplify = (v) => mathjs.simplify(v, SIMPLIFY_RULES.concat(mathjs.simplify.rules)); //.concat(SIMPLIFY_RULES));
	// const log = debug('@pie-element:math-inline:controller');
	// const decimalRegex = /\.|,/g;
	// const decimalCommaRegex = /,/g;
	const textRegex = /\\text\{([^{}]+)\}/g;
	// const decimalWithThousandSeparatorNumberRegex = /^(?!0+\.00)(?=.{1,9}(\.|$))(?!0(?!\.))\d{1,3}(,\d{3})*(\.\d+)?$/;
	const stripTargets = [
	    /{/g,
	    /}/g,
	    /\[/g,
	    /]/g,
	    /\\ /g,
	    /\\/g,
	    /\\s/g,
	    /left/g,
	    /right/g,
	    / /g,
	];
	function stripForStringCompare(answer = "") {
	    let stripped = answer;
	    stripTargets.forEach((stripTarget) => {
	        return (stripped = stripped.replace(stripTarget, ""));
	    });
	    return stripped;
	}
	/**
	 * TODO:
	 *
	 * We have `stringCheck` which if true disabled 'literal' and 'symbolic' so really it should be a validation method. And if it is what's the difference between it and 'literal'?
	 *
	 * We should support a equivalence option per correct response like:
	 * responses: [ { answer: '..', validation: 'symbolic', alternates: [{ value: '..', validation: 'stringCompare'}, 'abc'] } ]
	 *
	 * if option is a string it is turned into an object w/ inherited opts.
	 *
	 * This would override any shared setting at the root.
	 */
	function processAnswerItem(answerItem = "", isLiteral) {
	    // looks confusing, but we're replacing U+002D and U+2212 (minus and hyphen) so we have the same symbol everywhere consistently
	    // further processing is to be added here if needed
	    let newAnswerItem = answerItem.replace("−", "-");
	    newAnswerItem = newAnswerItem.replace(/\\cdot/g, "\\times");
	    // also ignore text nodes, just swap out with empty string
	    newAnswerItem = newAnswerItem.replace(textRegex, "");
	    newAnswerItem = newAnswerItem.replace(/\\ /g, "").replace(/ /g, "");
	    // eslint-disable-next-line no-useless-escape
	    newAnswerItem = newAnswerItem.replace(/\\%/g, "").replace(/%/g, "");
	    return isLiteral ? stripForStringCompare(newAnswerItem) : newAnswerItem;
	}
	const literalEquals = (valueOne, valueTwo, opts) => {
	    let answerValueToUse = processAnswerItem(valueOne, true);
	    let acceptedValueToUse = processAnswerItem(valueTwo, true);
	    if (opts.allowThousandsSeparator) {
	        if (containsDecimal(answerValueToUse) &&
	            decimalWithThousandSeparatorNumberRegex.test(answerValueToUse)) {
	            answerValueToUse = answerValueToUse.replace(decimalCommaRegex, "");
	        }
	        if (containsDecimal(acceptedValueToUse) &&
	            decimalWithThousandSeparatorNumberRegex.test(acceptedValueToUse)) {
	            acceptedValueToUse = acceptedValueToUse.replace(decimalCommaRegex, "");
	        }
	    }
	    return acceptedValueToUse === answerValueToUse;
	};
	exports.literalEquals = literalEquals;
	const symbolicEquals = (valueOne, valueTwo, options = {}) => {
	    const { 
	    // if explicitly set to false, having a decimal value in either side will result in a false equality
	    // regardless of mathematical correctness
	    allowDecimals, isLatex, // if the passed in values are latex, they need to be escaped
	    inverse, // returns inverse for the comparison result
	     } = options;
	    let valueOneToUse = valueOne;
	    let valueTwoToUse = valueTwo;
	    if (allowDecimals === false) {
	        if (containsDecimal(valueOne) || containsDecimal(valueTwo)) {
	            return false;
	        }
	    }
	    else if (allowDecimals === true) {
	        if (containsDecimal(valueOne) &&
	            decimalWithThousandSeparatorNumberRegex.test(valueOne)) {
	            valueOneToUse = valueOne.replace(decimalCommaRegex, "");
	        }
	        if (containsDecimal(valueTwo) &&
	            decimalWithThousandSeparatorNumberRegex.test(valueTwo)) {
	            valueTwoToUse = valueTwo.replace(decimalCommaRegex, "");
	        }
	    }
	    const preparedValueOne = prepareExpression(valueOneToUse, isLatex);
	    const preparedValueTwo = prepareExpression(valueTwoToUse, isLatex);
	    let one = shouldRationalizeEntireTree(preparedValueOne)
	        ? mathjs.rationalize(preparedValueOne)
	        : preparedValueOne;
	    let two = shouldRationalizeEntireTree(preparedValueTwo)
	        ? mathjs.rationalize(preparedValueTwo)
	        : preparedValueTwo;
	    one = simplify(one);
	    two = simplify(two);
	    const equals = one.equals(two);
	    return inverse ? !equals : equals;
	};
	exports.symbolicEquals = symbolicEquals;
	const ave = (a, b) => {
	    const am = mathjs.parse(a);
	    const bm = mathjs.parse(b);
	    const arm = simplify(am);
	    const brm = simplify(bm);
	    return arm.equals(brm);
	};
	exports.ave = ave;

	});

	var error = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ParseError = void 0;
	function ParseError(message, location) {
	    this.name = "ParseError";
	    this.message = message || "Error parsing input";
	    this.stack = new Error().stack;
	    this.location = location;
	}
	exports.ParseError = ParseError;
	ParseError.prototype = Object.create(Error.prototype);
	ParseError.prototype.constructor = ParseError;

	});

	var global$1 = (typeof global !== "undefined" ? global :
	  typeof self !== "undefined" ? self :
	  typeof window !== "undefined" ? window : {});

	// shim for using process in browser
	// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	var cachedSetTimeout = defaultSetTimout;
	var cachedClearTimeout = defaultClearTimeout;
	if (typeof global$1.setTimeout === 'function') {
	    cachedSetTimeout = setTimeout;
	}
	if (typeof global$1.clearTimeout === 'function') {
	    cachedClearTimeout = clearTimeout;
	}

	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	function nextTick(fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	}
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	var title = 'browser';
	var platform = 'browser';
	var browser$1 = true;
	var env = {};
	var argv = [];
	var version = ''; // empty string to avoid regexp issues
	var versions = {};
	var release = {};
	var config = {};

	function noop() {}

	var on = noop;
	var addListener = noop;
	var once = noop;
	var off = noop;
	var removeListener = noop;
	var removeAllListeners = noop;
	var emit = noop;

	function binding(name) {
	    throw new Error('process.binding is not supported');
	}

	function cwd () { return '/' }
	function chdir (dir) {
	    throw new Error('process.chdir is not supported');
	}function umask() { return 0; }

	// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
	var performance = global$1.performance || {};
	var performanceNow =
	  performance.now        ||
	  performance.mozNow     ||
	  performance.msNow      ||
	  performance.oNow       ||
	  performance.webkitNow  ||
	  function(){ return (new Date()).getTime() };

	// generate timestamp or delta
	// see http://nodejs.org/api/process.html#process_process_hrtime
	function hrtime(previousTimestamp){
	  var clocktime = performanceNow.call(performance)*1e-3;
	  var seconds = Math.floor(clocktime);
	  var nanoseconds = Math.floor((clocktime%1)*1e9);
	  if (previousTimestamp) {
	    seconds = seconds - previousTimestamp[0];
	    nanoseconds = nanoseconds - previousTimestamp[1];
	    if (nanoseconds<0) {
	      seconds--;
	      nanoseconds += 1e9;
	    }
	  }
	  return [seconds,nanoseconds]
	}

	var startTime = new Date();
	function uptime() {
	  var currentTime = new Date();
	  var dif = currentTime - startTime;
	  return dif / 1000;
	}

	var browser$1$1 = {
	  nextTick: nextTick,
	  title: title,
	  browser: browser$1,
	  env: env,
	  argv: argv,
	  version: version,
	  versions: versions,
	  on: on,
	  addListener: addListener,
	  once: once,
	  off: off,
	  removeListener: removeListener,
	  removeAllListeners: removeAllListeners,
	  emit: emit,
	  binding: binding,
	  cwd: cwd,
	  chdir: chdir,
	  umask: umask,
	  hrtime: hrtime,
	  platform: platform,
	  release: release,
	  config: config,
	  uptime: uptime
	};

	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} [options]
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */

	var ms = function(val, options) {
	  options = options || {};
	  var type = typeof val;
	  if (type === 'string' && val.length > 0) {
	    return parse(val);
	  } else if (type === 'number' && isFinite(val)) {
	    return options.long ? fmtLong(val) : fmtShort(val);
	  }
	  throw new Error(
	    'val is not a non-empty string or a valid number. val=' +
	      JSON.stringify(val)
	  );
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = String(str);
	  if (str.length > 100) {
	    return;
	  }
	  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
	    str
	  );
	  if (!match) {
	    return;
	  }
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'weeks':
	    case 'week':
	    case 'w':
	      return n * w;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	    default:
	      return undefined;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtShort(ms) {
	  var msAbs = Math.abs(ms);
	  if (msAbs >= d) {
	    return Math.round(ms / d) + 'd';
	  }
	  if (msAbs >= h) {
	    return Math.round(ms / h) + 'h';
	  }
	  if (msAbs >= m) {
	    return Math.round(ms / m) + 'm';
	  }
	  if (msAbs >= s) {
	    return Math.round(ms / s) + 's';
	  }
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtLong(ms) {
	  var msAbs = Math.abs(ms);
	  if (msAbs >= d) {
	    return plural(ms, msAbs, d, 'day');
	  }
	  if (msAbs >= h) {
	    return plural(ms, msAbs, h, 'hour');
	  }
	  if (msAbs >= m) {
	    return plural(ms, msAbs, m, 'minute');
	  }
	  if (msAbs >= s) {
	    return plural(ms, msAbs, s, 'second');
	  }
	  return ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, msAbs, n, name) {
	  var isPlural = msAbs >= n * 1.5;
	  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
	}

	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 */

	function setup(env) {
		createDebug.debug = createDebug;
		createDebug.default = createDebug;
		createDebug.coerce = coerce;
		createDebug.disable = disable;
		createDebug.enable = enable;
		createDebug.enabled = enabled;
		createDebug.humanize = ms;
		createDebug.destroy = destroy;

		Object.keys(env).forEach(key => {
			createDebug[key] = env[key];
		});

		/**
		* The currently active debug mode names, and names to skip.
		*/

		createDebug.names = [];
		createDebug.skips = [];

		/**
		* Map of special "%n" handling functions, for the debug "format" argument.
		*
		* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
		*/
		createDebug.formatters = {};

		/**
		* Selects a color for a debug namespace
		* @param {String} namespace The namespace string for the for the debug instance to be colored
		* @return {Number|String} An ANSI color code for the given namespace
		* @api private
		*/
		function selectColor(namespace) {
			let hash = 0;

			for (let i = 0; i < namespace.length; i++) {
				hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
				hash |= 0; // Convert to 32bit integer
			}

			return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
		}
		createDebug.selectColor = selectColor;

		/**
		* Create a debugger with the given `namespace`.
		*
		* @param {String} namespace
		* @return {Function}
		* @api public
		*/
		function createDebug(namespace) {
			let prevTime;
			let enableOverride = null;

			function debug(...args) {
				// Disabled?
				if (!debug.enabled) {
					return;
				}

				const self = debug;

				// Set `diff` timestamp
				const curr = Number(new Date());
				const ms = curr - (prevTime || curr);
				self.diff = ms;
				self.prev = prevTime;
				self.curr = curr;
				prevTime = curr;

				args[0] = createDebug.coerce(args[0]);

				if (typeof args[0] !== 'string') {
					// Anything else let's inspect with %O
					args.unshift('%O');
				}

				// Apply any `formatters` transformations
				let index = 0;
				args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
					// If we encounter an escaped % then don't increase the array index
					if (match === '%%') {
						return '%';
					}
					index++;
					const formatter = createDebug.formatters[format];
					if (typeof formatter === 'function') {
						const val = args[index];
						match = formatter.call(self, val);

						// Now we need to remove `args[index]` since it's inlined in the `format`
						args.splice(index, 1);
						index--;
					}
					return match;
				});

				// Apply env-specific formatting (colors, etc.)
				createDebug.formatArgs.call(self, args);

				const logFn = self.log || createDebug.log;
				logFn.apply(self, args);
			}

			debug.namespace = namespace;
			debug.useColors = createDebug.useColors();
			debug.color = createDebug.selectColor(namespace);
			debug.extend = extend;
			debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

			Object.defineProperty(debug, 'enabled', {
				enumerable: true,
				configurable: false,
				get: () => enableOverride === null ? createDebug.enabled(namespace) : enableOverride,
				set: v => {
					enableOverride = v;
				}
			});

			// Env-specific initialization logic for debug instances
			if (typeof createDebug.init === 'function') {
				createDebug.init(debug);
			}

			return debug;
		}

		function extend(namespace, delimiter) {
			const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
			newDebug.log = this.log;
			return newDebug;
		}

		/**
		* Enables a debug mode by namespaces. This can include modes
		* separated by a colon and wildcards.
		*
		* @param {String} namespaces
		* @api public
		*/
		function enable(namespaces) {
			createDebug.save(namespaces);

			createDebug.names = [];
			createDebug.skips = [];

			let i;
			const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
			const len = split.length;

			for (i = 0; i < len; i++) {
				if (!split[i]) {
					// ignore empty strings
					continue;
				}

				namespaces = split[i].replace(/\*/g, '.*?');

				if (namespaces[0] === '-') {
					createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
				} else {
					createDebug.names.push(new RegExp('^' + namespaces + '$'));
				}
			}
		}

		/**
		* Disable debug output.
		*
		* @return {String} namespaces
		* @api public
		*/
		function disable() {
			const namespaces = [
				...createDebug.names.map(toNamespace),
				...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
			].join(',');
			createDebug.enable('');
			return namespaces;
		}

		/**
		* Returns true if the given mode name is enabled, false otherwise.
		*
		* @param {String} name
		* @return {Boolean}
		* @api public
		*/
		function enabled(name) {
			if (name[name.length - 1] === '*') {
				return true;
			}

			let i;
			let len;

			for (i = 0, len = createDebug.skips.length; i < len; i++) {
				if (createDebug.skips[i].test(name)) {
					return false;
				}
			}

			for (i = 0, len = createDebug.names.length; i < len; i++) {
				if (createDebug.names[i].test(name)) {
					return true;
				}
			}

			return false;
		}

		/**
		* Convert regexp to namespace
		*
		* @param {RegExp} regxep
		* @return {String} namespace
		* @api private
		*/
		function toNamespace(regexp) {
			return regexp.toString()
				.substring(2, regexp.toString().length - 2)
				.replace(/\.\*\?$/, '*');
		}

		/**
		* Coerce `val`.
		*
		* @param {Mixed} val
		* @return {Mixed}
		* @api private
		*/
		function coerce(val) {
			if (val instanceof Error) {
				return val.stack || val.message;
			}
			return val;
		}

		/**
		* XXX DO NOT USE. This is a temporary stub function.
		* XXX It WILL be removed in the next major release.
		*/
		function destroy() {
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}

		createDebug.enable(createDebug.load());

		return createDebug;
	}

	var common = setup;

	var browser = createCommonjsModule(function (module, exports) {
	/* eslint-env browser */

	/**
	 * This is the web browser implementation of `debug()`.
	 */

	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = localstorage();
	exports.destroy = (() => {
		let warned = false;

		return () => {
			if (!warned) {
				warned = true;
				console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
			}
		};
	})();

	/**
	 * Colors.
	 */

	exports.colors = [
		'#0000CC',
		'#0000FF',
		'#0033CC',
		'#0033FF',
		'#0066CC',
		'#0066FF',
		'#0099CC',
		'#0099FF',
		'#00CC00',
		'#00CC33',
		'#00CC66',
		'#00CC99',
		'#00CCCC',
		'#00CCFF',
		'#3300CC',
		'#3300FF',
		'#3333CC',
		'#3333FF',
		'#3366CC',
		'#3366FF',
		'#3399CC',
		'#3399FF',
		'#33CC00',
		'#33CC33',
		'#33CC66',
		'#33CC99',
		'#33CCCC',
		'#33CCFF',
		'#6600CC',
		'#6600FF',
		'#6633CC',
		'#6633FF',
		'#66CC00',
		'#66CC33',
		'#9900CC',
		'#9900FF',
		'#9933CC',
		'#9933FF',
		'#99CC00',
		'#99CC33',
		'#CC0000',
		'#CC0033',
		'#CC0066',
		'#CC0099',
		'#CC00CC',
		'#CC00FF',
		'#CC3300',
		'#CC3333',
		'#CC3366',
		'#CC3399',
		'#CC33CC',
		'#CC33FF',
		'#CC6600',
		'#CC6633',
		'#CC9900',
		'#CC9933',
		'#CCCC00',
		'#CCCC33',
		'#FF0000',
		'#FF0033',
		'#FF0066',
		'#FF0099',
		'#FF00CC',
		'#FF00FF',
		'#FF3300',
		'#FF3333',
		'#FF3366',
		'#FF3399',
		'#FF33CC',
		'#FF33FF',
		'#FF6600',
		'#FF6633',
		'#FF9900',
		'#FF9933',
		'#FFCC00',
		'#FFCC33'
	];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	// eslint-disable-next-line complexity
	function useColors() {
		// NB: In an Electron preload script, document will be defined but not fully
		// initialized. Since we know we're in Chrome, we'll just detect this case
		// explicitly
		if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
			return true;
		}

		// Internet Explorer and Edge do not support colors.
		if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
			return false;
		}

		// Is webkit? http://stackoverflow.com/a/16459606/376773
		// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
		return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
			// Is firebug? http://stackoverflow.com/a/398120/376773
			(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
			// Is firefox >= v31?
			// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
			(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
			// Double check webkit in userAgent just in case we are in a worker
			(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
	}

	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs(args) {
		args[0] = (this.useColors ? '%c' : '') +
			this.namespace +
			(this.useColors ? ' %c' : ' ') +
			args[0] +
			(this.useColors ? '%c ' : ' ') +
			'+' + module.exports.humanize(this.diff);

		if (!this.useColors) {
			return;
		}

		const c = 'color: ' + this.color;
		args.splice(1, 0, c, 'color: inherit');

		// The final "%c" is somewhat tricky, because there could be other
		// arguments passed either before or after the %c, so we need to
		// figure out the correct index to insert the CSS into
		let index = 0;
		let lastC = 0;
		args[0].replace(/%[a-zA-Z%]/g, match => {
			if (match === '%%') {
				return;
			}
			index++;
			if (match === '%c') {
				// We only are interested in the *last* %c
				// (the user may have provided their own)
				lastC = index;
			}
		});

		args.splice(lastC, 0, c);
	}

	/**
	 * Invokes `console.debug()` when available.
	 * No-op when `console.debug` is not a "function".
	 * If `console.debug` is not available, falls back
	 * to `console.log`.
	 *
	 * @api public
	 */
	exports.log = console.debug || console.log || (() => {});

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */
	function save(namespaces) {
		try {
			if (namespaces) {
				exports.storage.setItem('debug', namespaces);
			} else {
				exports.storage.removeItem('debug');
			}
		} catch (error) {
			// Swallow
			// XXX (@Qix-) should we be logging these?
		}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */
	function load() {
		let r;
		try {
			r = exports.storage.getItem('debug');
		} catch (error) {
			// Swallow
			// XXX (@Qix-) should we be logging these?
		}

		// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
		if (!r && typeof browser$1$1 !== 'undefined' && 'env' in browser$1$1) {
			r = browser$1$1.env.DEBUG;
		}

		return r;
	}

	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */

	function localstorage() {
		try {
			// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
			// The Browser also has localStorage in the global context.
			return localStorage;
		} catch (error) {
			// Swallow
			// XXX (@Qix-) should we be logging these?
		}
	}

	module.exports = common(exports);

	const {formatters} = module.exports;

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	formatters.j = function (v) {
		try {
			return JSON.stringify(v);
		} catch (error) {
			return '[UnexpectedJSONParseError]: ' + error.message;
		}
	};
	});

	var log = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.logger = void 0;
	const logger = (name) => {
	    if (process.env.NODE_ENV === "test") {
	        const debug = browser;
	        return debug(name);
	    }
	    else {
	        return () => { };
	    }
	};
	exports.logger = logger;

	});

	var lexer_1 = createCommonjsModule(function (module, exports) {
	// lexer class
	//
	// Processes input string to return tokens
	//
	// Token rules:
	// array of rules to identify tokens
	// Rules will be applied in order until a match is found.
	// Each rule is an array of two or three elements
	//   First element: a string to be converted into a regular expression
	//   Second element: the token type
	Object.defineProperty(exports, "__esModule", { value: true });
	//   Third element (optional): replacement for actual string matched

	const log$1 = log.logger("mv:lexer");
	class lexer {
	    constructor(rawRules, ws = "\\s") {
	        this.input = "";
	        this.location = 0;
	        // regular expression to identify whitespace at beginning
	        // this.initial_whitespace = new RegExp("^(" + whitespace + ")+");
	        this.whitespace = new RegExp(`^(${ws})+`);
	        this.rules = rawRules.map((r) => {
	            const [m, char, extra] = r;
	            /**
	             *   convert first element of each rule to a regular expression that
	             * starts at the beginning of the string
	             */
	            const matcher = new RegExp(`^${m}`);
	            const out = [matcher, char];
	            if (extra) {
	                out.push(extra);
	            }
	            return out;
	        });
	    }
	    set_input(input) {
	        if (typeof input !== "string")
	            throw new Error("Input must be a string");
	        this.input = input;
	        this.location = 0;
	    }
	    return_state() {
	        return { input: this.input, location: this.location };
	    }
	    set_state({ input = null, location = 0 } = {}) {
	        if (input !== null) {
	            this.input = input;
	            this.location = location;
	        }
	    }
	    advance({ remove_initial_space = true } = {}) {
	        log$1("[advance] input: ", this.input);
	        // Find next token at beginning of input and delete from input.
	        // Update location to be the position in original input corresponding
	        // to end of match.
	        // Return token, which is an array of token type and matched string
	        // if(this.input.(",")){}
	        let result = this.whitespace.exec(this.input);
	        const m = this.input.match(this.whitespace);
	        log$1("input:", this.input, "result:", result, m);
	        log$1("ws result:", result);
	        if (result) {
	            //first find any initial whitespace and adjust location
	            let n_whitespace = result[0].length;
	            this.input = this.input.slice(n_whitespace);
	            this.location += n_whitespace;
	            log$1("location:", this.location, "input now:", this.input);
	            // don't remove initial space, return it as next token
	            if (!remove_initial_space) {
	                return {
	                    token_type: "SPACE",
	                    token_text: result[0],
	                    original_text: result[0],
	                };
	            }
	            // otherwise ignore initial space and continue
	        }
	        // check for EOF
	        if (this.input.length === 0) {
	            return {
	                token_type: "EOF",
	                token_text: "",
	                original_text: "",
	            };
	        }
	        // search through each token rule in order, finding first match
	        result = null;
	        for (var rule of this.rules) {
	            result = rule[0].exec(this.input);
	            if (result) {
	                let n_characters = result[0].length;
	                this.input = this.input.slice(n_characters);
	                this.location += n_characters;
	                break;
	            }
	        }
	        // case that didn't find any matches
	        if (result === null) {
	            return {
	                token_type: "INVALID",
	                token_text: this.input[0],
	                original_text: this.input[0],
	            };
	        }
	        // log("rule:", rule);
	        // found a match, set token
	        if (rule.length > 2) {
	            // overwrite text by third element of rule
	            const out = {
	                token_type: rule[1],
	                token_text: rule[2],
	                original_text: result[0],
	            };
	            return out;
	        }
	        else {
	            // log("result: 0:", result[0]);
	            return {
	                token_type: rule[1],
	                token_text: result[0],
	                original_text: result[0],
	            };
	        }
	    }
	    unput(string) {
	        // add string to beginning of input and adjust location
	        if (typeof string !== "string")
	            throw new Error("Input must be a string");
	        this.location -= string.length;
	        this.input = string + this.input;
	    }
	}
	exports.default = lexer;

	});

	var util = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.get_tree = exports.subsets = void 0;
	const get_tree = function (expr_or_tree) {
	    if (expr_or_tree === undefined || expr_or_tree === null)
	        return undefined;
	    var tree;
	    if (expr_or_tree.tree !== undefined)
	        tree = expr_or_tree.tree;
	    else
	        tree = expr_or_tree;
	    return tree;
	};
	exports.get_tree = get_tree;
	function* subsets(arr, m) {
	    // returns an iterator over all subsets of array arr
	    // up to size m
	    var n = arr.length;
	    if (m === undefined)
	        m = n;
	    if (m === 0)
	        return;
	    for (let i = 0; i < n; i++) {
	        yield [arr[i]];
	    }
	    if (m === 1)
	        return;
	    for (let i = 0; i < n; i++) {
	        let sub = subsets(arr.slice(i + 1), m - 1);
	        for (let val of sub) {
	            yield [arr[i]].concat(val);
	        }
	    }
	}
	exports.subsets = subsets;

	});

	var flatten_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.allChildren = exports.unflattenLeft = exports.unflattenRight = exports.flatten = exports.is_associative = void 0;

	exports.is_associative = {
	    "+": true,
	    "*": true,
	    and: true,
	    or: true,
	    union: true,
	    intersect: true,
	};
	function flatten(expr) {
	    // flatten tree with all associative operators
	    var tree = util.get_tree(expr);
	    if (!Array.isArray(tree))
	        return tree;
	    var operator = tree[0];
	    var operands = tree.slice(1);
	    operands = operands.map(function (v, i) {
	        return flatten(v);
	    });
	    if (exports.is_associative[operator]) {
	        var result = [];
	        for (var i = 0; i < operands.length; i++) {
	            if (Array.isArray(operands[i]) && operands[i][0] === operator) {
	                result = result.concat(operands[i].slice(1));
	            }
	            else {
	                result.push(operands[i]);
	            }
	        }
	        operands = result;
	    }
	    return [operator].concat(operands);
	}
	exports.flatten = flatten;
	const unflattenRight = function (expr) {
	    // unflatten tree with associate operators
	    // into a right heavy tree;
	    var tree = util.get_tree(expr);
	    if (!Array.isArray(tree))
	        return tree;
	    var operator = tree[0];
	    var operands = tree.slice(1);
	    operands = operands.map(function (v, i) {
	        return exports.unflattenRight(v);
	    });
	    if (operands.length > 2 && exports.is_associative[operator]) {
	        var result = [operator, operands[0], undefined];
	        var next = result;
	        for (var i = 1; i < operands.length - 1; i++) {
	            next[2] = [operator, operands[i], undefined];
	            next = next[2];
	        }
	        next[2] = operands[operands.length - 1];
	        return result;
	    }
	    return [operator].concat(operands);
	};
	exports.unflattenRight = unflattenRight;
	const unflattenLeft = function (expr) {
	    // unflatten tree with associate operator op
	    // into a left heavy tree;
	    var tree = util.get_tree(expr);
	    if (!Array.isArray(tree))
	        return tree;
	    var operator = tree[0];
	    var operands = tree.slice(1);
	    operands = operands.map(function (v, i) {
	        return exports.unflattenLeft(v);
	    });
	    if (operands.length > 2 && exports.is_associative[operator]) {
	        var result = [operator, undefined, operands[operands.length - 1]];
	        var next = result;
	        for (var i = operands.length - 2; i > 0; i--) {
	            next[1] = [operator, undefined, operands[i]];
	            next = next[1];
	        }
	        next[1] = operands[0];
	        return result;
	    }
	    return [operator].concat(operands);
	};
	exports.unflattenLeft = unflattenLeft;
	const allChildren = function (tree) {
	    // find all children of operator of tree as though it had been flattened
	    if (!Array.isArray(tree))
	        return [];
	    var operator = tree[0];
	    var operands = tree.slice(1);
	    if (!exports.is_associative[operator])
	        return operands;
	    return operands.reduce(function (a, b) {
	        if (Array.isArray(b) && b[0] === operator) {
	            return a.concat(exports.allChildren(b));
	        }
	        else
	            return a.concat([b]);
	    }, []);
	};
	exports.allChildren = allChildren;

	});

	var latexToAst = createCommonjsModule(function (module, exports) {
	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.LatexToAst = exports.DEFAULT_OPTS = exports.latex_rules = exports.whitespace_rule = void 0;

	const lexer_1$1 = __importDefault(lexer_1);


	log.logger("mv:latex-to-ast");
	// UPDATETHIS: Delete or change to new license & package name
	/*
	 * recursive descent parser for math expressions
	 *
	 * Copyright 2014-2017 by
	 *  Jim Fowler <kisonecat@gmail.com>
	 *  Duane Nykamp <nykamp@umn.edu>
	 *
	 * This file is part of a math-expressions library
	 *
	 * math-expressions is free software: you can redistribute
	 * it and/or modify it under the terms of the GNU General Public
	 * License as published by the Free Software Foundation, either
	 * version 3 of the License, or at your option any later version.
	 *
	 * math-expressions is distributed in the hope that it
	 * will be useful, but WITHOUT ANY WARRANTY; without even the implied
	 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
	 * See the GNU General Public License for more details.
	 *
	 */
	// UPDATETHIS: Is this grammar still correct?
	/* Grammar:

	   statement_list =
	   statement_list ',' statement |
	   statement

	   statement =
	   '\\dots' |
	   statement_a '|' statement_a |
	   statement_a 'MID' statement_a |
	   statement_a ':' statement_a
	   **** statement_a '|' statement_a
	        used with turning off '|' statement '|' in baseFactor
	        tried only after parse error encountered

	   statement_a =
	   statement_a 'OR' statement_b |
	   statement_b

	   statement_b =
	   statement_b 'AND' relation |
	   relation

	   relation =
	   'NOT' relation |
	   relation '=' expression |
	   relation 'NE' expression |
	   relation '<' expression |
	   relation '>' expression |
	   relation 'LE' expression |
	   relation 'GE' expression |
	   relation 'IN' expression |
	   relation 'NOTIN' expression |
	   relation 'NI' expression |
	   relation 'NOTNI' expression |
	   relation 'SUBSET' expression |
	   relation 'NOTSUBSET' expression |
	   relation 'SUPERSET' expression |
	   relation 'NOTSUPERSET' expression |
	   expression

	   expression =
	   expression '+' term |
	   expression '-' term |
	   expression 'UNION' term |
	   expression 'INTERSECT' term |
	   '+' term |
	   term

	   term =
	   term '*' factor |
	   term nonMinusFactor |
	   term '/' factor |
	   factor

	   baseFactor =
	   '(' statement_list ')' |
	   '[' statement_list ']' |
	   '{' statement_list '}' |
	   'LBRACE' statement_list 'RBRACE' |
	   '(' statement ',' statement ']' |
	   '[' statement ',' statement ')' |
	   '|' statement '|' |
	   \frac{statement}{statement} |
	   number |
	   variable |
	   modified_function '(' statement_list ')' |
	   modified_applied_function '(' statement_list ')' |
	   modified_function '{' statement_list '}' |
	   modified_applied_function '{' statement_list '}' |
	   modified_function |
	   modified_applied_function factor |
	   sqrt '[' statement ']' '{' statement '}' |
	   baseFactor '_' baseFactor |
	   *** modified_applied_function factor
	       allowed only if allowSimplifiedFunctionApplication==true
	   *** '|' statement '|'
	       allowed only at beginning of factor or if not currently in absolute value

	   modified_function =
	   function |
	   function '_' baseFactor |
	   function '_' baseFactor '^' factor |
	   function '^' factor
	   function "'"
	   function '_' baseFactor "'"
	   function '_' baseFactor "'" '^' factor
	   function "'" '^' factor
	   *** where the "'" after the functions can be repeated

	   modified_applied_function =
	   applied_function |
	   applied_function '_' baseFactor |
	   applied_function '_' baseFactor '^' factor |
	   applied_function '^' factor
	   applied_function "'"
	   applied_function '_' baseFactor "'"
	   applied_function '_' baseFactor "'" '^' factor
	   applied_function "'" '^' factor
	   *** where the "'" after the applied_functions can be repeated

	   nonMinusFactor =
	   baseFactor |
	   baseFactor '^' factor |
	   baseFactor '!' and/or "'" |
	   baseFactor '!' and/or "'"  '^' factor|
	   *** where '!' and/or "'"  indicates arbitrary sequence of "!" and/or "'"

	   factor =
	   '-' factor |
	   nonMinusFactor

	*/
	// Some of the latex commands that lead to spacing
	exports.whitespace_rule = "\\s|\\\\,|\\\\!|\\\\ |\\\\>|\\\\;|\\\\:|\\\\quad\\b|\\\\qquad\\b|\\\\text{[a-zA-Z0-9\\s\\\\,\\\\.]+?}";
	// in order to parse as scientific notation, e.g., 3.2E-12 or .7E+3,
	// it must be at the end or followed a comma, &, |, \|, ), }, \}, ], \\, or \end
	const sci_notat_exp_regex = "(E[+\\-]?[0-9]+\\s*($|(?=\\,|&|\\||\\\\\\||\\)|\\}|\\\\}|\\]|\\\\\\\\|\\\\end)))?";
	// TO-DO: ADD all mathjs built-in units?
	const lengthUnit = "(mm|cm|km|ft|yd|mi|mmi|li|rd|angstrom|mil";
	const volumeUnit = "|mL|ml|L|m3|in3|ft3|pt|qt|gal|bbl)";
	const measurmentUnit = lengthUnit + volumeUnit + "{1}";
	// const latex_rules = [["\\\\neq(?![a-zA-Z])", "NE"]];
	exports.latex_rules = [
	    [measurmentUnit, "UNIT"],
	    ["[0-9]+\\s*\\\\frac(?![a-zA-Z])", "MIXED_NUMBER"],
	    ["[0-9|,]+(\\.[0-9]*)?" + sci_notat_exp_regex, "NUMBER"],
	    ["\\.[0-9|,]+" + sci_notat_exp_regex, "NUMBER"],
	    ["\\*", "*"],
	    ["\\×", "*"],
	    ["\\•", "*"],
	    ["\\·", "*"],
	    ["\\/", "/"],
	    ["\\÷", "/"],
	    ["%", "PERCENT"],
	    ["\\\\%", "PERCENT"],
	    ["-", "-"],
	    ["\\+", "+"],
	    ["\\^", "^"],
	    ["\\(", "("],
	    ["\\\\left\\s*\\(", "("],
	    ["\\\\bigl\\s*\\(", "("],
	    ["\\\\Bigl\\s*\\(", "("],
	    ["\\\\biggl\\s*\\(", "("],
	    ["\\\\Biggl\\s*\\(", "("],
	    ["\\)", ")"],
	    ["\\\\right\\s*\\)", ")"],
	    ["\\\\bigr\\s*\\)", ")"],
	    ["\\\\Bigr\\s*\\)", ")"],
	    ["\\\\biggr\\s*\\)", ")"],
	    ["\\\\Biggr\\s*\\)", ")"],
	    ["\\[", "["],
	    ["\\\\left\\s*\\[", "["],
	    ["\\\\bigl\\s*\\[", "["],
	    ["\\\\Bigl\\s*\\[", "["],
	    ["\\\\biggl\\s*\\[", "["],
	    ["\\\\Biggl\\s*\\[", "["],
	    ["\\]", "]"],
	    ["\\\\right\\s*\\]", "]"],
	    ["\\\\bigr\\s*\\]", "]"],
	    ["\\\\Bigr\\s*\\]", "]"],
	    ["\\\\biggr\\s*\\]", "]"],
	    ["\\\\Biggr\\s*\\]", "]"],
	    ["\\|", "|"],
	    ["\\\\left\\s*\\|", "|L"],
	    ["\\\\bigl\\s*\\|", "|L"],
	    ["\\\\Bigl\\s*\\|", "|L"],
	    ["\\\\biggl\\s*\\|", "|L"],
	    ["\\\\Biggl\\s*\\|", "|L"],
	    ["\\\\right\\s*\\|", "|"],
	    ["\\\\bigr\\s*\\|", "|"],
	    ["\\\\Bigr\\s*\\|", "|"],
	    ["\\\\biggr\\s*\\|", "|"],
	    ["\\\\Biggr\\s*\\|", "|"],
	    ["\\\\big\\s*\\|", "|"],
	    ["\\\\Big\\s*\\|", "|"],
	    ["\\\\bigg\\s*\\|", "|"],
	    ["\\\\Bigg\\s*\\|", "|"],
	    ["{", "{"],
	    ["}", "}"],
	    ["\\\\{", "LBRACE"],
	    ["\\\\left\\s*\\\\{", "LBRACE"],
	    ["\\\\bigl\\s*\\\\{", "LBRACE"],
	    ["\\\\Bigl\\s*\\\\{", "LBRACE"],
	    ["\\\\biggl\\s*\\\\{", "LBRACE"],
	    ["\\\\Biggl\\s*\\\\{", "LBRACE"],
	    ["\\\\}", "RBRACE"],
	    ["\\\\right\\s*\\\\}", "RBRACE"],
	    ["\\\\bigr\\s*\\\\}", "RBRACE"],
	    ["\\\\Bigr\\s*\\\\}", "RBRACE"],
	    ["\\\\biggr\\s*\\\\}", "RBRACE"],
	    ["\\\\Biggr\\s*\\\\}", "RBRACE"],
	    ["\\\\cdot(?![a-zA-Z])", "*"],
	    ["\\\\div(?![a-zA-Z])", "/"],
	    ["\\\\times(?![a-zA-Z])", "*"],
	    ["\\\\frac(?![a-zA-Z])", "FRAC"],
	    [",", ","],
	    [":", ":"],
	    ["\\\\mid", "MID"],
	    ["\\\\vartheta(?![a-zA-Z])", "LATEXCOMMAND", "\\theta"],
	    ["\\\\varepsilon(?![a-zA-Z])", "LATEXCOMMAND", "\\epsilon"],
	    ["\\\\varrho(?![a-zA-Z])", "LATEXCOMMAND", "\\rho"],
	    ["\\\\varphi(?![a-zA-Z])", "LATEXCOMMAND", "\\phi"],
	    ["\\\\infty(?![a-zA-Z])", "INFINITY"],
	    ["\\\\asin(?![a-zA-Z])", "LATEXCOMMAND", "\\arcsin"],
	    ["\\\\acos(?![a-zA-Z])", "LATEXCOMMAND", "\\arccos"],
	    ["\\\\atan(?![a-zA-Z])", "LATEXCOMMAND", "\\arctan"],
	    ["\\\\sqrt(?![a-zA-Z])", "SQRT"],
	    ["\\\\log(?![a-zA-Z])", "LOG"],
	    ["\\\\ln(?![a-zA-Z])", "LN"],
	    ["\\\\land(?![a-zA-Z])", "AND"],
	    ["\\\\wedge(?![a-zA-Z])", "AND"],
	    ["\\\\lor(?![a-zA-Z])", "OR"],
	    ["\\\\vee(?![a-zA-Z])", "OR"],
	    ["\\\\lnot(?![a-zA-Z])", "NOT"],
	    ["=", "="],
	    ["\\\\neq(?![a-zA-Z])", "NE"],
	    ["\\\\ne(?![a-zA-Z])", "NE"],
	    ["\\\\not\\s*=", "NE"],
	    ["\\\\leq(?![a-zA-Z])", "LE"],
	    ["\\\\le(?![a-zA-Z])", "LE"],
	    ["\\\\geq(?![a-zA-Z])", "GE"],
	    ["\\\\ge(?![a-zA-Z])", "GE"],
	    ["<", "<"],
	    ["≤", "LE"],
	    ["\\\\lt(?![a-zA-Z])", "<"],
	    [">", ">"],
	    ["≥", "GE"],
	    ["\\\\gt(?![a-zA-Z])", ">"],
	    ["\\\\in(?![a-zA-Z])", "IN"],
	    ["\\\\notin(?![a-zA-Z])", "NOTIN"],
	    ["\\\\not\\s*\\\\in(?![a-zA-Z])", "NOTIN"],
	    ["\\\\ni(?![a-zA-Z])", "NI"],
	    ["\\\\not\\s*\\\\ni(?![a-zA-Z])", "NOTNI"],
	    ["\\\\subset(?![a-zA-Z])", "SUBSET"],
	    ["\\\\not\\s*\\\\subset(?![a-zA-Z])", "NOTSUBSET"],
	    ["\\\\supset(?![a-zA-Z])", "SUPERSET"],
	    ["\\\\not\\s*\\\\supset(?![a-zA-Z])", "NOTSUPERSET"],
	    ["\\\\cup(?![a-zA-Z])", "UNION"],
	    ["\\\\cap(?![a-zA-Z])", "INTERSECT"],
	    ["!", "!"],
	    ["'", "'"],
	    ["_", "_"],
	    ["&", "&"],
	    ["\\\\ldots", "LDOTS"],
	    ["\\\\\\\\", "LINEBREAK"],
	    ["\\\\begin\\s*{\\s*[a-zA-Z0-9]+\\s*}", "BEGINENVIRONMENT"],
	    ["\\\\end\\s*{\\s*[a-zA-Z0-9]+\\s*}", "ENDENVIRONMENT"],
	    ["\\\\var\\s*{\\s*[a-zA-Z0-9]+\\s*}", "VARMULTICHAR"],
	    ["\\\\[a-zA-Z]+(?![a-zA-Z])", "LATEXCOMMAND"],
	    ["[a-zA-Z]", "VAR"],
	];
	// defaults for parsers if not overridden by context
	// if true, allowed applied functions to omit parentheses around argument
	// if false, omitting parentheses will lead to a Parse Error
	const allowSimplifiedFunctionApplicationDefault = true;
	// allowed multicharacter latex symbols
	// in addition to the below applied function symbols
	const allowedLatexSymbolsDefault = [
	    "alpha",
	    "beta",
	    "gamma",
	    "Gamma",
	    "delta",
	    "Delta",
	    "epsilon",
	    "zeta",
	    "eta",
	    "theta",
	    "Theta",
	    "iota",
	    "kappa",
	    "lambda",
	    "Lambda",
	    "mu",
	    "nu",
	    "xi",
	    "Xi",
	    "pi",
	    "Pi",
	    "rho",
	    "sigma",
	    "Sigma",
	    "tau",
	    "Tau",
	    "upsilon",
	    "Upsilon",
	    "phi",
	    "Phi",
	    "chi",
	    "psi",
	    "Psi",
	    "omega",
	    "Omega",
	    "partial",
	];
	// Applied functions must be given an argument so that
	// they are applied to the argument
	const appliedFunctionSymbolsDefault = [
	    "abs",
	    "exp",
	    "log",
	    "ln",
	    "log10",
	    "sign",
	    "sqrt",
	    "erf",
	    "acos",
	    "acosh",
	    "acot",
	    "acoth",
	    "acsc",
	    "acsch",
	    "asec",
	    "asech",
	    "asin",
	    "asinh",
	    "atan",
	    "atanh",
	    "cos",
	    "cosh",
	    "cot",
	    "coth",
	    "csc",
	    "csch",
	    "sec",
	    "sech",
	    "sin",
	    "sinh",
	    "tan",
	    "tanh",
	    "arcsin",
	    "arccos",
	    "arctan",
	    "arccsc",
	    "arcsec",
	    "arccot",
	    "cosec",
	    "arg",
	];
	const missingFactorDefaultBehavior = function (token, e) {
	    throw e;
	};
	exports.DEFAULT_OPTS = {
	    allowSimplifiedFunctionApplication: allowSimplifiedFunctionApplicationDefault,
	    allowedLatexSymbols: allowedLatexSymbolsDefault,
	    appliedFunctionSymbols: appliedFunctionSymbolsDefault,
	    /**
	     *  Functions could have an argument, in which case they are applied
	     * or, if they don't have an argument in parentheses, then they are treated
	     * like a variable, except that trailing ^ and ' have higher precedence
	     */
	    functionSymbols: ["f", "g"],
	    parseLeibnizNotation: true,
	    missingFactor: missingFactorDefaultBehavior,
	    unknownCommandBehavior: "error",
	};
	class LatexToAst {
	    constructor(opts) {
	        this.opts = { ...exports.DEFAULT_OPTS, ...opts };
	        if (this.opts.unknownCommandBehavior !== "error" &&
	            this.opts.unknownCommandBehavior !== "passthrough") {
	            throw new Error("Unknown behavior for unknown command: " +
	                this.opts.unknownCommandBehavior);
	        }
	        this.lexer = new lexer_1$1.default(exports.latex_rules, exports.whitespace_rule);
	    }
	    advance(params) {
	        this.token = this.lexer.advance(params);
	        if (this.token.token_type === "INVALID") {
	            throw new error.ParseError("Invalid symbol '" + this.token.original_text + "'", this.lexer.location);
	        }
	    }
	    return_state() {
	        return {
	            lexer_state: this.lexer.return_state(),
	            token: Object.assign({}, this.token),
	        };
	    }
	    set_state(state) {
	        this.lexer.set_state(state.lexer_state);
	        this.token = Object.assign({}, state.token);
	    }
	    convert(input, pars) {
	        this.lexer.set_input(input);
	        this.advance();
	        var result = this.statement_list(pars);
	        if (this.token.token_type !== "EOF") {
	            throw new error.ParseError("Invalid location of '" + this.token.original_text + "'", this.lexer.location);
	        }
	        return flatten_1.flatten(result);
	    }
	    statement_list(pars) {
	        var list = [this.statement(pars)];
	        while (this.token.token_type === ",") {
	            this.advance();
	            list.push(this.statement(pars));
	        }
	        if (list.length > 1)
	            list = ["list"].concat(list);
	        else
	            list = list[0];
	        return list;
	    }
	    statement(opts = {}) {
	        const { inside_absolute_value = 0, unknownCommands = "error" } = opts;
	        // \ldots can be a statement by itself
	        if (this.token.token_type === "LDOTS") {
	            this.advance();
	            return ["ldots"];
	        }
	        var original_state;
	        try {
	            original_state = this.return_state();
	            let lhs = this.statement_a({
	                inside_absolute_value: inside_absolute_value,
	                unknownCommands: unknownCommands,
	            });
	            //console.log("lhs:", lhs);
	            if (this.token.token_type !== ":" && this.token.token_type !== "MID")
	                return lhs;
	            let operator = this.token.token_type === ":" ? ":" : "|";
	            this.advance();
	            let rhs = this.statement_a({ unknownCommands: unknownCommands });
	            return [operator, lhs, rhs];
	        }
	        catch (e) {
	            try {
	                // if ran into problem parsing statement
	                // then try again with ignoring absolute value
	                // and then interpreting bar as a binary operator
	                // return state to what it was before attempting to parse statement
	                this.set_state(original_state);
	                let lhs = this.statement_a({ parse_absolute_value: false });
	                //console.log("lhs:", lhs);
	                if (this.token.token_type[0] !== "|") {
	                    throw e;
	                }
	                this.advance();
	                let rhs = this.statement_a({ parse_absolute_value: false });
	                return ["|", lhs, rhs];
	            }
	            catch (e2) {
	                throw e; // throw original error
	            }
	        }
	    }
	    statement_a(opts = {}) {
	        const { inside_absolute_value = 0, parse_absolute_value = true, unknownCommands, } = opts;
	        var lhs = this.statement_b({
	            inside_absolute_value: inside_absolute_value,
	            parse_absolute_value: parse_absolute_value,
	            unknownCommands: unknownCommands,
	        });
	        while (this.token.token_type === "OR") {
	            let operation = this.token.token_type.toLowerCase();
	            this.advance();
	            let rhs = this.statement_b({
	                inside_absolute_value: inside_absolute_value,
	                parse_absolute_value: parse_absolute_value,
	                unknownCommands: unknownCommands,
	            });
	            lhs = [operation, lhs, rhs];
	        }
	        return lhs;
	    }
	    statement_b(params) {
	        // split AND into second statement to give higher precedence than OR
	        var lhs = this.relation(params);
	        while (this.token.token_type === "AND") {
	            let operation = this.token.token_type.toLowerCase();
	            this.advance();
	            let rhs = this.relation(params);
	            lhs = [operation, lhs, rhs];
	        }
	        return lhs;
	    }
	    relation(params) {
	        if (this.token.token_type === "NOT" || this.token.token_type === "!") {
	            this.advance();
	            return ["not", this.relation(params)];
	        }
	        var lhs = this.expression(params);
	        let relationalToken = (token) => token === "<" || token === "LE" || token === ">" || token === "GE";
	        while (this.token.token_type === "=" ||
	            this.token.token_type === "NE" ||
	            this.token.token_type === "<" ||
	            this.token.token_type === ">" ||
	            this.token.token_type === "LE" ||
	            this.token.token_type === "GE" ||
	            this.token.token_type === "IN" ||
	            this.token.token_type === "NOTIN" ||
	            this.token.token_type === "NI" ||
	            this.token.token_type === "NOTNI" ||
	            this.token.token_type === "SUBSET" ||
	            this.token.token_type === "NOTSUBSET" ||
	            this.token.token_type === "SUPERSET" ||
	            this.token.token_type === "NOTSUPERSET") {
	            let operation = this.token.token_type.toLowerCase();
	            let inequality_sequence = relationalToken(this.token.token_type);
	            this.advance();
	            let rhs = this.expression(params);
	            const relationalOperator = (operatorSign) => {
	                switch (operatorSign) {
	                    case "<":
	                        return "smaller";
	                    case "LE" :
	                        return "smallerEq";
	                    case ">":
	                        return "larger";
	                    case "GE":
	                        return "largerEq";
	                    case "ge":
	                        return "largerEq";
	                }
	            };
	            if (inequality_sequence && relationalToken(this.token.token_type)) {
	                let strict = ["tuple"];
	                strict.push(relationalOperator(operation));
	                let args = ["tuple", lhs, rhs];
	                while (relationalOperator(this.token.token_type)) {
	                    strict.push(relationalOperator(this.token.token_type));
	                    this.advance();
	                    args.push(this.expression(params));
	                }
	                lhs = ["relational", args, strict];
	            }
	            else if (operation === "=") {
	                lhs = ["=", lhs, rhs];
	                // check for sequence of multiple =
	                while (this.token.token_type === "=") {
	                    this.advance();
	                    lhs.push(this.expression(params));
	                }
	            }
	            else {
	                lhs = [operation, lhs, rhs];
	            }
	        }
	        return lhs;
	    }
	    expression(params) {
	        if (this.token.token_type === "+")
	            this.advance();
	        let negative_begin = false;
	        if (this.token.token_type === "-") {
	            negative_begin = true;
	            this.advance();
	        }
	        var lhs = this.term(params);
	        if (negative_begin) {
	            lhs = ["-", lhs];
	        }
	        while (this.token.token_type === "+" ||
	            this.token.token_type === "-" ||
	            this.token.token_type === "UNION" ||
	            this.token.token_type === "INTERSECT") {
	            let operation = this.token.token_type.toLowerCase();
	            let negative = false;
	            if (this.token.token_type === "-") {
	                operation = "+";
	                negative = true;
	                this.advance();
	            }
	            else {
	                this.advance();
	                // @ts-ignore
	                if (operation === "+" && this.token.token_type === "-") {
	                    negative = true;
	                    this.advance();
	                }
	            }
	            let rhs = this.term(params);
	            if (negative) {
	                rhs = ["-", rhs];
	            }
	            lhs = [operation, lhs, rhs];
	        }
	        return lhs;
	    }
	    term(params) {
	        var lhs;
	        try {
	            lhs = this.factor(params);
	        }
	        catch (e) {
	            lhs = this.opts.missingFactor(this.token, e);
	            lhs = Number.isFinite(lhs) ? lhs : 0;
	        }
	        var keepGoing = false;
	        do {
	            keepGoing = false;
	            if (this.token.token_type === "PERCENT") {
	                this.advance();
	                lhs = ["%", lhs];
	                keepGoing = true;
	            }
	            else if (this.token.token_type === "*") {
	                this.advance();
	                lhs = ["*", lhs, this.factor(params)];
	                keepGoing = true;
	            }
	            else if (this.token.token_type === "/") {
	                this.advance();
	                lhs = ["/", lhs, this.factor(params)];
	                keepGoing = true;
	            }
	            else {
	                // this is the one case where a | could indicate a closing absolute value
	                let params2 = Object.assign({}, params);
	                params2.allow_absolute_value_closing = true;
	                let rhs = this.nonMinusFactor(params2);
	                if (rhs !== false) {
	                    lhs = ["*", lhs, rhs];
	                    keepGoing = true;
	                }
	            }
	        } while (keepGoing);
	        return lhs;
	    }
	    factor(params) {
	        // console.log("factor:", this.token);
	        // console.log("before: lexer state:", this.lexer.return_state());
	        if (this.token.token_type === "-") {
	            this.advance();
	            return ["-", this.factor(params)];
	        }
	        var result = this.nonMinusFactor(params);
	        // console.log("result", result);
	        if (result === false) {
	            if (this.token.token_type === "EOF") {
	                throw new error.ParseError("Unexpected end of input", this.lexer.location);
	            }
	            else {
	                //console.log("lexer state:", this.lexer.return_state());
	                throw new error.ParseError("Invalid location of '" + this.token.original_text + "'", this.lexer.location);
	            }
	        }
	        else {
	            return result;
	        }
	    }
	    nonMinusFactor(params) {
	        var result = this.baseFactor(params);
	        // allow arbitrary sequence of factorials
	        if (this.token.token_type === "!" || this.token.token_type === "'") {
	            if (result === false)
	                throw new error.ParseError("Invalid location of " + this.token.token_type, this.lexer.location);
	            while (this.token.token_type === "!" || this.token.token_type === "'") {
	                if (this.token.token_type === "!")
	                    result = ["apply", "factorial", result];
	                else
	                    result = ["prime", result];
	                this.advance();
	            }
	        }
	        if (this.token.token_type === "^") {
	            if (result === false) {
	                throw new error.ParseError("Invalid location of ^", this.lexer.location);
	            }
	            this.advance();
	            // do not allow absolute value closing here
	            let params2 = Object.assign({}, params);
	            delete params2.allow_absolute_value_closing;
	            delete params2.inside_absolute_value;
	            return ["^", result, this.factor(params2)];
	        }
	        return result;
	    }
	    fraction({ inside_absolute_value = 0, parse_absolute_value = true, allow_absolute_value_closing = false, unknownCommands = "error", }) {
	        this.advance();
	        if (this.token.token_type !== "{") {
	            throw new error.ParseError("Expecting {", this.lexer.location);
	        }
	        this.advance();
	        // determine if may be a derivative in Leibniz notation
	        if (this.opts.parseLeibnizNotation) {
	            let original_state = this.return_state();
	            let r = this.leibniz_notation();
	            if (r) {
	                // successfully parsed derivative in Leibniz notation, so return
	                return r;
	            }
	            else {
	                // didn't find a properly format Leibniz notation
	                // so reset state and continue
	                this.set_state(original_state);
	            }
	        }
	        let numerator = this.statement({
	            parse_absolute_value: parse_absolute_value,
	            unknownCommands: unknownCommands,
	        });
	        // @ts-ignore
	        if (this.token.token_type !== "}") {
	            throw new error.ParseError("Expecting }", this.lexer.location);
	        }
	        this.advance();
	        if (this.token.token_type !== "{") {
	            throw new error.ParseError("Expecting {", this.lexer.location);
	        }
	        this.advance();
	        let denominator = this.statement({
	            parse_absolute_value: parse_absolute_value,
	            unknownCommands: unknownCommands,
	        });
	        if (this.token.token_type !== "}") {
	            throw new error.ParseError("Expecting }", this.lexer.location);
	        }
	        this.advance();
	        return ["/", numerator, denominator];
	    }
	    baseFactor({ inside_absolute_value = 0, parse_absolute_value = true, allow_absolute_value_closing = false, unknownCommands = "error", } = {}) {
	        var result = false;
	        if (this.token.token_type === "MIXED_NUMBER") {
	            try {
	                const t = this.token.token_text.split("\\\\frac");
	                const numberString = t[0].trim();
	                const number = parseInt(numberString, 10);
	                const f = this.fraction({});
	                return ["+", number, f];
	            }
	            catch (e) {
	                throw new error.ParseError(`Mixed number parsing failed: ${e.message}`);
	            }
	        }
	        if (this.token.token_type === "FRAC") {
	            return this.fraction({});
	        }
	        if (this.token.token_type === "BEGINENVIRONMENT") {
	            let environment = /\\begin\s*{\s*([a-zA-Z0-9]+)\s*}/.exec(this.token.token_text)[1];
	            if (["matrix", "pmatrix", "bmatrix"].includes(environment)) {
	                let n_rows = 0;
	                let n_cols = 0;
	                let all_rows = [];
	                let row = [];
	                let n_this_row = 0;
	                let last_token = this.token.token_type;
	                this.advance();
	                //@ts-ignore
	                while (this.token.token_type !== "ENDENVIRONMENT") {
	                    //@ts-ignore
	                    if (this.token.token_type === "&") {
	                        if (last_token === "&" || last_token === "LINEBREAK") {
	                            // blank entry, let entry be zero
	                            row.push(0);
	                            n_this_row += 1;
	                        }
	                        last_token = this.token.token_type;
	                        this.advance();
	                        //@ts-ignore
	                    }
	                    else if (this.token.token_type === "LINEBREAK") {
	                        if (last_token === "&" || last_token === "LINEBREAK") {
	                            // blank entry, let entry be zero
	                            row.push(0);
	                            n_this_row += 1;
	                        }
	                        all_rows.push(row);
	                        if (n_this_row > n_cols)
	                            n_cols = n_this_row;
	                        n_rows += 1;
	                        n_this_row = 0;
	                        row = [];
	                        last_token = this.token.token_type;
	                        this.advance();
	                    }
	                    else {
	                        if (last_token === "&" ||
	                            last_token === "LINEBREAK" ||
	                            "BEGINENVIRONMENT") {
	                            row.push(this.statement({
	                                parse_absolute_value: parse_absolute_value,
	                                unknownCommands: unknownCommands,
	                            }));
	                            n_this_row += 1;
	                            last_token = " ";
	                        }
	                        else {
	                            throw new error.ParseError("Invalid location of " + this.token.original_text, this.lexer.location);
	                        }
	                    }
	                }
	                // token is ENDENVIRONMENT
	                let environment2 = /\\end\s*{\s*([a-zA-Z0-9]+)\s*}/.exec(this.token.token_text)[1];
	                if (environment2 !== environment) {
	                    throw new error.ParseError("Expecting \\end{" + environment + "}", this.lexer.location);
	                }
	                // add last row
	                if (last_token === "&") {
	                    // blank entry, let entry be zero
	                    row.push(0);
	                    n_this_row += 1;
	                }
	                all_rows.push(row);
	                if (n_this_row > n_cols)
	                    n_cols = n_this_row;
	                n_rows += 1;
	                this.advance();
	                // create matrix
	                // @ts-ignore
	                result = ["matrix", ["tuple", n_rows, n_cols]];
	                let body = ["tuple"];
	                for (let r of all_rows) {
	                    let new_row = ["tuple"].concat(r);
	                    //@ts-ignore
	                    for (let i = r.length; i < n_cols; i += 1)
	                        new_row.push(0);
	                    // @ts-ignore
	                    body.push(new_row);
	                }
	                // @ts-ignore
	                result.push(body);
	                return result;
	            }
	            else {
	                throw new error.ParseError("Unrecognized environment " + environment, this.lexer.location);
	            }
	        }
	        if (this.token.token_type === "NUMBER") {
	            /** TODO: this is a bit primitive, should try and parse commas in numbers correctly */
	            // @ts-ignore
	            result = this.token.token_text.replace(/,/g, "");
	            // @ts-ignore
	            const number = parseFloat(result);
	            /** trailing zero number ['tzn', number, countOfZeros] */
	            // @ts-ignore
	            if (result !== number.toString()) {
	                const p = number.toString();
	                // @ts-ignore
	                const sub = result
	                    // @ts-ignore
	                    .substring(p.length)
	                    .split("")
	                    .filter((c) => c === "0");
	                const noOfTrailingZeros = sub.length;
	                // @ts-ignore
	                result = ["tzn", number, noOfTrailingZeros];
	            }
	            else {
	                // @ts-ignore
	                result = number;
	            }
	            this.advance();
	        }
	        else if (this.token.token_type === "INFINITY") {
	            // @ts-ignore
	            result = Infinity;
	            this.advance();
	        }
	        else if (this.token.token_type === "UNIT") {
	            // @ts-ignore
	            result = ["unit", this.token.token_text];
	            this.advance();
	        }
	        else if (this.token.token_type === "SQRT") {
	            this.advance();
	            let root = 2;
	            let parameter;
	            // @ts-ignore
	            if (this.token.token_type === "[") {
	                this.advance();
	                parameter = this.statement({
	                    parse_absolute_value: parse_absolute_value,
	                    unknownCommands: unknownCommands,
	                });
	                if (this.token.token_type !== "]") {
	                    throw new error.ParseError("Expecting ]", this.lexer.location);
	                }
	                this.advance();
	                root = parameter;
	            }
	            // @ts-ignore
	            if (this.token.token_type == "{") {
	                this.advance();
	                parameter = this.statement({
	                    parse_absolute_value: parse_absolute_value,
	                    unknownCommands: unknownCommands,
	                });
	                // @ts-ignore
	                if (this.token.token_type !== "}") {
	                    throw new error.ParseError("Expecting }", this.lexer.location);
	                }
	                this.advance();
	            }
	            else {
	                parameter = this.statement({
	                    parse_absolute_value: parse_absolute_value,
	                    unknownCommands: unknownCommands,
	                });
	            }
	            // @ts-ignore
	            if (root === 2)
	                result = ["apply", "sqrt", parameter];
	            // @ts-ignore
	            else
	                result = ["^", parameter, ["/", 1, root]];
	        }
	        else if (this.token.token_type === "LOG" ||
	            this.token.token_type === "LN") {
	            let base = this.token.token_type === "LOG" ? 10 : "e";
	            let parameter;
	            this.advance();
	            // @ts-ignore
	            if (this.token.token_type === "_") {
	                this.advance();
	                // @ts-ignore
	                if (this.token.token_type === "{") {
	                    this.advance();
	                    parameter = this.statement({
	                        parse_absolute_value: parse_absolute_value,
	                        unknownCommands: unknownCommands,
	                    });
	                    if (this.token.token_type !== "}") {
	                        throw new error.ParseError("Expecting }", this.lexer.location);
	                    }
	                    this.advance();
	                    base = parameter;
	                }
	            }
	            // @ts-ignore
	            if (this.token.token_type == "(") {
	                this.advance();
	                parameter = this.statement({
	                    parse_absolute_value: parse_absolute_value,
	                    unknownCommands: unknownCommands,
	                });
	                if (this.token.token_type !== ")") {
	                    throw new error.ParseError("Expecting )", this.lexer.location);
	                }
	                this.advance();
	            }
	            else {
	                parameter = this.statement({
	                    parse_absolute_value: parse_absolute_value,
	                    unknownCommands: unknownCommands,
	                });
	            }
	            // @ts-ignore
	            if (base === 10)
	                result = ["apply", "log", ["tuple", parameter, base]];
	            // @ts-ignore
	            else if (base === "e")
	                result = ["apply", "log", parameter];
	            // @ts-ignore
	            else
	                result = ["apply", "log", ["tuple", parameter, base]];
	        }
	        else if (this.token.token_type === "VAR" ||
	            this.token.token_type === "LATEXCOMMAND" ||
	            this.token.token_type === "VARMULTICHAR") {
	            // @ts-ignore
	            result = this.token.token_text;
	            if (this.token.token_type === "LATEXCOMMAND") {
	                // @ts-ignore
	                result = result.slice(1);
	                const isKnownCommand = 
	                // @ts-ignore
	                this.opts.appliedFunctionSymbols.includes(result) ||
	                    // @ts-ignore
	                    this.opts.functionSymbols.includes(result) ||
	                    // @ts-ignore
	                    this.opts.allowedLatexSymbols.includes(result);
	                if (!isKnownCommand) {
	                    if (this.unknownCommandBehavior === "error") {
	                        throw new error.ParseError("Unrecognized latex command " + this.token.original_text, this.lexer.location);
	                    }
	                }
	            }
	            else if (this.token.token_type === "VARMULTICHAR") {
	                // strip out name of variable from \var command
	                // @ts-ignore
	                result = /\\var\s*\{\s*([a-zA-Z0-9]+)\s*\}/.exec(result)[1];
	            }
	            if (
	            // @ts-ignore
	            this.opts.appliedFunctionSymbols.includes(result) ||
	                // @ts-ignore
	                this.opts.functionSymbols.includes(result)) {
	                let must_apply = false;
	                // @ts-ignore
	                if (this.opts.appliedFunctionSymbols.includes(result))
	                    must_apply = true;
	                this.advance();
	                // @ts-ignore
	                if (this.token.token_type === "_") {
	                    this.advance();
	                    let subresult = this.baseFactor({
	                        parse_absolute_value: parse_absolute_value,
	                    });
	                    // since baseFactor could return false, must check
	                    if (subresult === false) {
	                        if (this.token.token_type === "EOF") {
	                            throw new error.ParseError("Unexpected end of input", this.lexer.location);
	                        }
	                        else {
	                            throw new error.ParseError("Invalid location of '" + this.token.original_text + "'", this.lexer.location);
	                        }
	                    }
	                    // @ts-ignore
	                    result = ["_", result, subresult];
	                }
	                // @ts-ignore
	                while (this.token.token_type === "'") {
	                    // @ts-ignore
	                    result = ["prime", result];
	                    this.advance();
	                }
	                // @ts-ignore
	                if (this.token.token_type === "^") {
	                    this.advance();
	                    // @ts-ignore
	                    result = [
	                        "^",
	                        result,
	                        this.factor({ parse_absolute_value: parse_absolute_value }),
	                    ];
	                }
	                // @ts-ignore
	                if (this.token.token_type === "{" || this.token.token_type === "(") {
	                    let expected_right;
	                    if (this.token.token_type === "{")
	                        expected_right = "}";
	                    else
	                        expected_right = ")";
	                    this.advance();
	                    let parameters = this.statement_list();
	                    if (this.token.token_type !== expected_right) {
	                        throw new error.ParseError("Expecting " + expected_right, this.lexer.location);
	                    }
	                    this.advance();
	                    if (parameters[0] === "list") {
	                        // rename from list to tuple
	                        parameters[0] = "tuple";
	                    }
	                    // @ts-ignore
	                    result = ["apply", result, parameters];
	                }
	                else {
	                    // if was an applied function symbol,
	                    // cannot omit argument
	                    if (must_apply) {
	                        // @ts-ignore
	                        if (!this.allowSimplifiedFunctionApplication)
	                            throw new error.ParseError("Expecting ( after function", this.lexer.location);
	                        // if allow simplied function application
	                        // let the argument be the next factor
	                        // @ts-ignore
	                        result = [
	                            "apply",
	                            result,
	                            this.factor({ parse_absolute_value: parse_absolute_value }),
	                        ];
	                    }
	                }
	            }
	            else {
	                this.advance();
	            }
	        }
	        else if (this.token.token_type === "(" ||
	            this.token.token_type === "[" ||
	            this.token.token_type === "{" ||
	            this.token.token_type === "LBRACE") {
	            let token_left = this.token.token_type;
	            let expected_right, other_right;
	            if (this.token.token_type === "(") {
	                expected_right = ")";
	                other_right = "]";
	            }
	            else if (this.token.token_type === "[") {
	                expected_right = "]";
	                other_right = ")";
	            }
	            else if (this.token.token_type === "{") {
	                expected_right = "}";
	                other_right = null;
	            }
	            else {
	                expected_right = "RBRACE";
	                other_right = null;
	            }
	            this.advance();
	            // @ts-ignore
	            result = this.statement_list();
	            let n_elements = 1;
	            if (result[0] === "list") {
	                // @ts-ignore
	                n_elements = result.length - 1;
	            }
	            if (this.token.token_type !== expected_right) {
	                if (n_elements !== 2 || other_right === null) {
	                    throw new error.ParseError("Expecting " + expected_right, this.lexer.location);
	                }
	                else if (this.token.token_type !== other_right) {
	                    throw new error.ParseError("Expecting ) or ]", this.lexer.location);
	                }
	                // half-open interval
	                result[0] = "tuple";
	                // @ts-ignore
	                result = ["interval", result];
	                let closed;
	                if (token_left === "(")
	                    closed = ["tuple", false, true];
	                else
	                    closed = ["tuple", true, false];
	                // @ts-ignore
	                result.push(closed);
	            }
	            else if (n_elements >= 2) {
	                if (token_left === "(" || token_left === "{") {
	                    result[0] = "tuple";
	                }
	                else if (token_left === "[") {
	                    result[0] = "array";
	                }
	                else {
	                    result[0] = "set";
	                }
	            }
	            else if (token_left === "LBRACE") {
	                if (result[0] === "|" || result[0] === ":") {
	                    // @ts-ignore
	                    result = ["set", result]; // set builder notation
	                }
	                else {
	                    // @ts-ignore
	                    result = ["set", result]; // singleton set
	                }
	            }
	            this.advance();
	        }
	        else if (this.token.token_type[0] === "|" &&
	            parse_absolute_value &&
	            (inside_absolute_value === 0 ||
	                !allow_absolute_value_closing ||
	                this.token.token_type[1] === "L")) {
	            // allow the opening of an absolute value here if either
	            // - we aren't already inside an absolute value (inside_absolute_value==0),
	            // - we don't allows an absolute value closing, or
	            // - the | was marked as a left
	            // otherwise, skip this token so that will drop out the factor (and entire statement)
	            // to where the absolute value will close
	            inside_absolute_value += 1;
	            this.advance();
	            result = this.statement({
	                inside_absolute_value: inside_absolute_value,
	                unknownCommands: unknownCommands,
	            });
	            // @ts-ignore
	            result = ["apply", "abs", result];
	            if (this.token.token_type !== "|") {
	                throw new error.ParseError("Expecting |", this.lexer.location);
	            }
	            this.advance();
	        }
	        if (this.token.token_type === "_") {
	            if (result === false) {
	                throw new error.ParseError("Invalid location of _", this.lexer.location);
	            }
	            this.advance();
	            let subresult = this.baseFactor({
	                parse_absolute_value: parse_absolute_value,
	            });
	            if (subresult === false) {
	                // @ts-ignore
	                if (this.token.token_type === "EOF") {
	                    throw new error.ParseError("Unexpected end of input", this.lexer.location);
	                }
	                else {
	                    throw new error.ParseError("Invalid location of '" + this.token.original_text + "'", this.lexer.location);
	                }
	            }
	            return ["_", result, subresult];
	        }
	        return result;
	    }
	    leibniz_notation() {
	        // attempt to find and return a derivative in Leibniz notation
	        // if unsuccessful, return false
	        var result = this.token.token_text;
	        let deriv_symbol = "";
	        let n_deriv = 1;
	        let var1 = "";
	        let var2s = [];
	        let var2_exponents = [];
	        if (this.token.token_type === "LATEXCOMMAND" &&
	            result.slice(1) === "partial")
	            deriv_symbol = "∂";
	        else if (this.token.token_type === "VAR" && result === "d")
	            deriv_symbol = "d";
	        else
	            return false;
	        // since have just a d or ∂
	        // one option is that have a ^ followed by an integer next possibly in {}
	        this.advance();
	        // @ts-ignore
	        if (this.token.token_type === "^") {
	            // so far have d or ∂ followed by ^
	            // must be followed by an integer
	            this.advance();
	            let in_braces = false;
	            if (this.token.token_type === "{") {
	                in_braces = true;
	                this.advance();
	            }
	            if (this.token.token_type !== "NUMBER") {
	                return false;
	            }
	            n_deriv = parseFloat(this.token.token_text);
	            if (!Number.isInteger(n_deriv)) {
	                return false;
	            }
	            // found integer,
	            // if in braces, require }
	            if (in_braces) {
	                this.advance();
	                if (this.token.token_type !== "}") {
	                    return false;
	                }
	            }
	            this.advance();
	        }
	        // since have a d or ∂, optionally followed by ^ and integer
	        // next we must have:
	        // a VAR, a VARMULTICHAR, or a LATEXCOMMAND that is in allowedLatexSymbols
	        if (this.token.token_type === "VAR")
	            var1 = this.token.token_text;
	        // @ts-ignore
	        else if (this.token.token_type === "VARMULTICHAR") {
	            // strip out name of variable from \var command
	            var1 = /\\var\s*\{\s*([a-zA-Z0-9]+)\s*\}/.exec(this.token.token_text)[1];
	        }
	        else if (this.token.token_type === "LATEXCOMMAND") {
	            result = this.token.token_text.slice(1);
	            // @ts-ignore
	            if (this.opts.allowedLatexSymbols.includes(result))
	                var1 = result;
	            else
	                return false;
	        }
	        // Finished numerator.
	        // Next need a } and {
	        this.advance();
	        // @ts-ignore
	        if (this.token.token_type !== "}") {
	            return false;
	        }
	        this.advance();
	        if (this.token.token_type !== "{") {
	            return false;
	        }
	        else {
	            this.advance();
	        }
	        // In denominator now
	        // find sequence of
	        // derivative symbol followed by
	        // - a VAR, a VARMULTICHAR, or a LATEXCOMMAND that is in allowedLatexSymbols
	        // optionally followed by a ^ and an integer
	        // End when sum of exponents meets or exceeds n_deriv
	        let exponent_sum = 0;
	        while (true) {
	            // next must be
	            // - a VAR equal to deriv_symbol="d" or \partial when deriv_symbol = "∂"
	            if (!((deriv_symbol === "d" &&
	                this.token.token_type === "VAR" &&
	                this.token.token_text === "d") ||
	                (deriv_symbol === "∂" &&
	                    this.token.token_type === "LATEXCOMMAND" &&
	                    this.token.token_text.slice(1) === "partial"))) {
	                return false;
	            }
	            // followed by
	            // - a VAR, a VARMULTICHAR, or a LATEXCOMMAND that is in allowedLatexSymbols
	            this.advance();
	            if (this.token.token_type === "VAR")
	                var2s.push(this.token.token_text);
	            else if (this.token.token_type === "VARMULTICHAR") {
	                // strip out name of variable from \var command
	                var2s.push(/\\var\s*\{\s*([a-zA-Z0-9]+)\s*\}/.exec(this.token.token_text)[1]);
	            }
	            else if (this.token.token_type === "LATEXCOMMAND") {
	                let r = this.token.token_text.slice(1);
	                // @ts-ignore
	                if (this.allowedLatexSymbols.includes(r))
	                    var2s.push(r);
	                else {
	                    return false;
	                }
	            }
	            else {
	                return false;
	            }
	            // have derivative and variable, now check for optional ^ followed by number
	            let this_exponent = 1;
	            this.advance();
	            if (this.token.token_type === "^") {
	                this.advance();
	                let in_braces = false;
	                if (this.token.token_type === "{") {
	                    in_braces = true;
	                    this.advance();
	                }
	                if (this.token.token_type !== "NUMBER") {
	                    return false;
	                }
	                this_exponent = parseFloat(this.token.token_text);
	                if (!Number.isInteger(this_exponent)) {
	                    return false;
	                }
	                // if in braces, require }
	                if (in_braces) {
	                    this.advance();
	                    if (this.token.token_type !== "}") {
	                        return false;
	                    }
	                }
	                this.advance();
	            }
	            var2_exponents.push(this_exponent);
	            exponent_sum += this_exponent;
	            if (exponent_sum > n_deriv) {
	                return false;
	            }
	            // possibly found derivative
	            if (exponent_sum === n_deriv) {
	                // next token must be a }
	                if (this.token.token_type !== "}") {
	                    return false;
	                }
	                // found derivative!
	                this.advance();
	                let result_name = "derivative_leibniz";
	                if (deriv_symbol === "∂")
	                    result_name = "partial_" + result_name;
	                // @ts-ignore
	                result = [result_name];
	                // @ts-ignore
	                if (n_deriv === 1)
	                    result.push(var1);
	                // @ts-ignore
	                else
	                    result.push(["tuple", var1, n_deriv]);
	                let r2 = [];
	                for (let i = 0; i < var2s.length; i += 1) {
	                    if (var2_exponents[i] === 1)
	                        r2.push(var2s[i]);
	                    else
	                        r2.push(["tuple", var2s[i], var2_exponents[i]]);
	                }
	                r2 = ["tuple"].concat(r2);
	                // @ts-ignore
	                result.push(r2);
	                return result;
	            }
	        }
	    }
	}
	exports.LatexToAst = LatexToAst;

	});

	var mathjs = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.replacer = exports.parse = exports.mathjs = void 0;

	exports.mathjs = mathjs_1__default['default'].create(mathjs_1__default['default'].all, { number: "Fraction" });
	exports.parse = exports.mathjs.parse;
	// @ts-ignore
	exports.replacer = exports.mathjs.replacer;

	});

	var astToMathjs = createCommonjsModule(function (module, exports) {
	/*
	 * convert AST to a expression tree from math.js
	 *
	 * Copyright 2014-2017 by
	 * Jim Fowler <kisonecat@gmail.com>
	 * Duane Nykamp <nykamp@umn.edu>
	 *
	 * This file is part of a math-expressions library
	 *
	 * math-expressions is free software: you can redistribute
	 * it and/or modify it under the terms of the GNU General Public
	 * License as published by the Free Software Foundation, either
	 * version 3 of the License, or at your option any later version.
	 *
	 * math-expressions is distributed in the hope that it
	 * will be useful, but WITHOUT ANY WARRANTY; without even the implied
	 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
	 * See the GNU General Public License for more details.
	 *
	 */
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AstToMathJs = void 0;


	const log$1 = log.logger("mv:ast-to-math");
	const m = mathjs.mathjs;
	const operators = {
	    "+": function (operands) {
	        return new m.OperatorNode("+", "add", operands);
	    },
	    "*": function (operands) {
	        if (operands[1] && operands[1].isUnit) {
	            return m.multiply(operands[0].value, operands[1]);
	        }
	        return new m.OperatorNode("*", "multiply", operands);
	    },
	    "/": function (operands) {
	        return new m.OperatorNode("/", "divide", operands);
	    },
	    "-": function (operands) {
	        return new m.OperatorNode("-", "unaryMinus", [operands[0]]);
	    },
	    "^": function (operands) {
	        return new m.OperatorNode("^", "pow", operands);
	    },
	    //"prime": function(operands) { return operands[0] + "'"; },
	    //"tuple": function(operands) { return '\\left( ' + operands.join( ', ' ) + ' \\right)';},
	    //"array": function(operands) { return '\\left[ ' + operands.join( ', ' ) + ' \\right]';},
	    //"set": function(operands) { return '\\left\\{ ' + operands.join( ', ' ) + ' \\right\\}';},
	    vector: function (operands) {
	        return new m.ArrayNode(operands);
	    },
	    //"interval": function(operands) { return '\\left( ' + operands.join( ', ' ) + ' \\right)';},
	    and: function (operands) {
	        return new m.OperatorNode("and", "and", operands);
	    },
	    or: function (operands) {
	        return new m.OperatorNode("or", "or", operands);
	    },
	    not: function (operands) {
	        return new m.OperatorNode("not", "not", [operands[0]]);
	    },
	    "<": function (operands) {
	        return new m.OperatorNode("<", "smaller", operands);
	    },
	    ">": function (operands) {
	        return new m.OperatorNode(">", "larger", operands);
	    },
	    le: function (operands) {
	        return new m.OperatorNode("<=", "smallerEq", operands);
	    },
	    ge: function (operands) {
	        return new m.OperatorNode(">=", "largerEq", operands);
	    },
	    ne: function (operands) {
	        return new m.OperatorNode("!=", "unequal", operands);
	    },
	    //"union": function (operands) { return operands.join(' \\cup '); },
	    //"intersect": function (operands) { return operands.join(' \\cap '); },
	    tzn: function (operands) {
	        return new m.FunctionNode("tzn", operands);
	    },
	};
	class AstToMathJs {
	    /**
	     * Note: we use fractions as the default number format.
	     * So by default AstToMathJs will generate fractions too.
	     */
	    constructor(opts = { number: "Fraction" }) {
	        this.opts = opts;
	    }
	    convert(tree) {
	        if (typeof tree === "number") {
	            if (Number.isFinite(tree)) {
	                if (this.opts.number === "Fraction") {
	                    const f = new m.Fraction([
	                        new m.ConstantNode(tree),
	                        new m.ConstantNode(1),
	                    ]);
	                    return new m.ConstantNode(f);
	                }
	                else {
	                    return new m.ConstantNode(tree);
	                }
	            }
	            if (Number.isNaN(tree))
	                return new m.SymbolNode("NaN");
	            if (tree < 0)
	                return operators["-"]([new m.SymbolNode("Infinity")]);
	            return new m.SymbolNode("Infinity");
	        }
	        if (typeof tree === "string") {
	            return new m.SymbolNode(tree);
	        }
	        if (typeof tree === "boolean")
	            throw Error("no support for boolean");
	        if (!Array.isArray(tree))
	            throw Error("Invalid ast");
	        const operator = tree[0];
	        const operands = tree.slice(1);
	        if (operator === "apply") {
	            log$1("operands:", operands);
	            log$1("0", operands[0]);
	            if (typeof operands[0] !== "string")
	                throw Error("Non string functions not implemented for conversion to mathjs");
	            if (operands[0] === "factorial")
	                return new m.OperatorNode("!", "factorial", [
	                    this.convert(operands[1]),
	                ]);
	            const f = new m.SymbolNode(operands[0]);
	            const args = operands[1];
	            let f_args;
	            if (args[0] === "tuple")
	                f_args = args.slice(1).map(function (v, i) {
	                    return this.convert(v);
	                }.bind(this));
	            else
	                f_args = [this.convert(args)];
	            return new m.FunctionNode(f, f_args);
	        }
	        if (operator === "unit") {
	            const unit = new m.Unit(1, operands[0]);
	            return unit;
	        }
	        if (operator === "relational") {
	            // if we have more than one comparison operators return a Relational Node
	            const params = operands[0];
	            const strict = operands[1];
	            if (params[0] !== "tuple" || strict[0] !== "tuple")
	                // something wrong if args or strict are not tuples
	                throw new Error("Badly formed ast");
	            params.splice(0, 1);
	            strict.splice(0, 1);
	            const arg_nodes = params.map(function (v, i) {
	                return this.convert(v);
	            }.bind(this));
	            let comparisons = [];
	            for (let i = 0; i < params.length - 1; i++) {
	                comparisons.push(strict[i]);
	            }
	            let result = new m.RelationalNode(comparisons, arg_nodes);
	            return result;
	        }
	        // if we have more than one equality operators return a Relational Node
	        if (operator === "=") {
	            let arg_nodes = operands.map(function (v, i) {
	                return this.convert(v);
	            }.bind(this));
	            let comparisons = [];
	            for (let i = 0; i < arg_nodes.length - 1; i++) {
	                comparisons.push("equal");
	            }
	            if (comparisons.length === 1)
	                return new m.OperatorNode("==", "equal", arg_nodes);
	            let result = new m.RelationalNode(comparisons, arg_nodes);
	            return result;
	        }
	        if (operator === "in" ||
	            operator === "notin" ||
	            operator === "ni" ||
	            operator === "notni") {
	            let x, interval;
	            if (operator === "in" || operator === "notin") {
	                x = operands[0];
	                interval = operands[1];
	            }
	            else {
	                x = operands[1];
	                interval = operands[0];
	            }
	            if (typeof x !== "number" && typeof x !== "string")
	                throw Error("Set membership non-string variables not implemented for conversion to mathjs");
	            x = this.convert(x);
	            if (interval[0] !== "interval")
	                throw Error("Set membership in non-intervals not implemented for conversion to mathjs");
	            let args = interval[1];
	            let closed = interval[2];
	            if (args[0] !== "tuple" || closed[0] !== "tuple")
	                throw new Error("Badly formed ast");
	            let a = this.convert(args[1]);
	            let b = this.convert(args[2]);
	            let comparisons = [];
	            if (closed[1])
	                comparisons.push(new m.OperatorNode(">=", "largerEq", [x, a]));
	            else
	                comparisons.push(new m.OperatorNode(">", "larger", [x, a]));
	            if (closed[2])
	                comparisons.push(new m.OperatorNode("<=", "smallerEq", [x, b]));
	            else
	                comparisons.push(new m.OperatorNode("<", "smaller", [x, b]));
	            let result = new m.OperatorNode("and", "and", comparisons);
	            if (operator === "notin" || operator === "notni")
	                result = new m.OperatorNode("not", "not", [result]);
	            return result;
	        }
	        if (operator === "subset" ||
	            operator === "notsubset" ||
	            operator === "superset" ||
	            operator === "notsuperset") {
	            let big, small;
	            if (operator === "subset" || operator === "notsubset") {
	                small = operands[0];
	                big = operands[1];
	            }
	            else {
	                small = operands[1];
	                big = operands[0];
	            }
	            if (small[0] !== "interval" || big[0] !== "interval")
	                throw Error("Set containment of non-intervals not implemented for conversion to mathjs");
	            let small_args = small[1];
	            let small_closed = small[2];
	            let big_args = big[1];
	            let big_closed = big[2];
	            if (small_args[0] !== "tuple" ||
	                small_closed[0] !== "tuple" ||
	                big_args[0] !== "tuple" ||
	                big_closed[0] !== "tuple")
	                throw Error("Badly formed ast");
	            let small_a = this.convert(small_args[1]);
	            let small_b = this.convert(small_args[2]);
	            let big_a = this.convert(big_args[1]);
	            let big_b = this.convert(big_args[2]);
	            let comparisons = [];
	            if (small_closed[1] && !big_closed[1])
	                comparisons.push(new m.OperatorNode(">", "larger", [small_a, big_a]));
	            else
	                comparisons.push(new m.OperatorNode(">=", "largerEq", [small_a, big_a]));
	            if (small_closed[2] && !big_closed[2])
	                comparisons.push(new m.OperatorNode("<", "smaller", [small_b, big_b]));
	            else
	                comparisons.push(new m.OperatorNode("<=", "smallerEq", [small_b, big_b]));
	            let result = new m.OperatorNode("and", "and", comparisons);
	            if (operator === "notsubset" || operator === "notsuperset")
	                result = new m.OperatorNode("not", "not", [result]);
	            return result;
	        }
	        if (operator === "matrix") {
	            // Convert matrices into nested array nodes
	            // Will become matrix on eval
	            let size = operands[0];
	            let nrows = size[1];
	            let ncols = size[2];
	            let entries = operands[1];
	            if (!Number.isInteger(nrows) || !Number.isInteger(ncols))
	                throw Error("Matrix must have integer dimensions");
	            let result = [];
	            for (let i = 1; i <= nrows; i++) {
	                let row = [];
	                for (let j = 1; j <= ncols; j++) {
	                    row.push(this.convert(entries[i][j]));
	                }
	                result.push(new m.ArrayNode(row));
	            }
	            return new m.ArrayNode(result);
	        }
	        if (operator == "%") {
	            const dividend = this.convert(operands[0]);
	            const divisor = new m.ConstantNode(100);
	            const result = new m.OperatorNode("/", "divide", [dividend, divisor]);
	            return result;
	        }
	        if (operator in operators) {
	            return operators[operator](operands.map(function (v, i) {
	                return this.convert(v);
	            }.bind(this)));
	        }
	        throw Error("Operator " + operator + " not implemented for conversion to mathjs");
	    }
	}
	exports.AstToMathJs = AstToMathJs;

	});

	var symbolic = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isMathEqual = void 0;


	const log$1 = log.logger("mv:symbolic");
	const { simplify: ms, rationalize } = mathjs.mathjs;
	const SIMPLIFY_RULES = [
	    { l: "n1^(1/n2)", r: "nthRoot(n1, n2)" },
	    { l: "sqrt(n1)", r: "nthRoot(n1, 2)" },
	    { l: "(n^2)/n", r: "n" },
	    { l: "(n^2) + n", r: "n * (n + 1)" },
	    { l: "((n^n1) + n)/n", r: "n^(n1-1)+1" },
	    { l: "(n^2) + 2n", r: "n * (n + 2)" },
	    // { l: "(n/n1) * n2", r: "t" },
	    // perfect square formula:
	    { l: "(n1 + n2) ^ 2", r: "(n1 ^ 2) + 2*n1*n2 + (n2 ^ 2)" },
	    // { l: "(n^2) + 4n + 4", r: "(n^2) + (2n * 2) + (2^2)" },
	];
	const simplify = (v) => {
	    const rules = SIMPLIFY_RULES.concat(ms.rules);
	    return ms(v, rules); //.concat(SIMPLIFY_RULES));
	};
	const normalize = (a) => {
	    let r = a;
	    try {
	        r = rationalize(a, {}, true).expression;
	    }
	    catch (e) {
	        // ok;
	    }
	    const s = simplify(r);
	    log$1("[normalize] input: ", a.toString(), "output: ", s.toString());
	    return s;
	};
	const isMathEqual = (a, b, opts) => {
	    const as = normalize(a);
	    const bs = normalize(b);
	    log$1("[isMathEqual]", as.toString(), "==?", bs.toString());
	    const firstTest = as.equals(bs);
	    if (firstTest) {
	        return true;
	    }
	    /**
	     * Note: this seems very dodgy that we have to try a 2nd round of normalization here.
	     * Why is this necessary and try and remove it.
	     */
	    const at = normalize(as);
	    const bt = normalize(bs);
	    return at.equals(bt);
	};
	exports.isMathEqual = isMathEqual;

	});

	var nodeSort = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.s = exports.sortRelationalNode = exports.flattenNode = void 0;


	const m = mathjs.mathjs;


	const log$1 = log.logger("mv:node-sort");
	//import { string } from "mathjs";
	/**
	 * The plan with node sort was to sort all the nodes in an expression where possible
	 * This means any commutative operators aka + and *.
	 *
	 * With symbols sorted - we shoud be able to call `node.equals(other)` and avoid having to call evaluate.
	 */
	new latexToAst.LatexToAst();
	new astToMathjs.AstToMathJs();
	const newCompare = (a, b) => {
	    // log(a.type);
	    log$1("[compareNodes]: a:", a.toString(), a.type);
	    log$1("[compareNodes]: b:", b.toString(), b.type);
	    if (a.isSymbolNode && b.isSymbolNode) {
	        // log(a.name, "> ", b.name);
	        return a.name.localeCompare(b.name);
	    }
	    // both constants - sort by value
	    if (a.isConstantNode && b.isConstantNode) {
	        log$1("a.value", a.value);
	        log$1("b.value", b.value);
	        return a.value - b.value; //(b.name);
	    }
	    // constants before any other node
	    if (a.isConstantNode && !b.isConstantNode) {
	        return -1;
	    }
	    if (b.isConstantNode && !a.isConstantNode) {
	        return 1;
	    }
	    // symbolNode before operatorNode
	    if (a.isSymbolNode && b.isOperatorNode) {
	        return -1;
	    }
	    if (b.isSymbolNode && a.isOperatorNode) {
	        return 1;
	    }
	    if (a.isOperatorNode && b.isOperatorNode) {
	        const localeCompareResult = a.args
	            .toString()
	            .localeCompare(b.args.toString());
	        return -localeCompareResult;
	    }
	};
	const applySort = (node) => {
	    // log("node: ", node.toString());
	    // log("path: ", path);
	    // log("parent: ", parent);
	    if (node.fn === "add" || node.fn === "multiply") {
	        node.args = node.args.sort(newCompare);
	        node.args = node.args.map(applySort);
	    }
	    return node;
	};
	const chainedSimilarOperators = (node) => {
	    let ok = false;
	    node.traverse((node, path, parent) => {
	        ok = ok || (parent && parent.fn === node.fn && !ok);
	    });
	    return ok;
	};
	const argsIsOperatorNode = (node) => {
	    let isOperator = false;
	    node.args.map((args) => {
	        if (args.isOperatorNode) {
	            isOperator = true;
	            return;
	        }
	    });
	    return isOperator;
	};
	const flattenNode = (node) => {
	    node = node.transform((node, path, parent) => {
	        while (node.isParenthesisNode && !parent && node.content) {
	            node = node.content;
	        }
	        if (node.isParenthesisNode &&
	            parent &&
	            (parent.op != "*" || (parent.op == "*" && node.content.op != "+"))) {
	            while (node.content.isParenthesisNode)
	                node = node.content;
	            node = node.content;
	        }
	        return node;
	    });
	    let resultNode = node;
	    const operator = resultNode.op;
	    const func = resultNode.fn;
	    const sameOperator = chainedSimilarOperators(resultNode);
	    if (resultNode.args && argsIsOperatorNode(resultNode) && sameOperator) {
	        let newNode = new m.OperatorNode(operator, func, []);
	        resultNode = resultNode.traverse((node, path, parent) => {
	            if ((parent &&
	                parent.fn &&
	                parent.fn == func &&
	                node.fn &&
	                node.fn !== func) ||
	                (node.isSymbolNode && parent.op == "*" && func == "multiply") ||
	                (node.isConstantNode && parent.op == "*" && func == "multiply") ||
	                (node.isSymbolNode && parent.op !== "*" && func !== "multiply") ||
	                (node.isConstantNode && parent.op !== "*" && func !== "multiply")) {
	                newNode.args.push(node);
	            }
	        });
	        return newNode;
	    }
	    return resultNode;
	};
	exports.flattenNode = flattenNode;
	const sortRelationalNode = (node) => {
	    log$1("THIS IS THE START ++++", JSON.stringify(node));
	    const smaller = ["smaller", "smallerEq"];
	    const bigger = ["larger", "largerEq"];
	    const resultNode = node.transform((node, path, parent) => {
	        let reverse = false;
	        if (node.conditionals) {
	            const smallerAndBigger = smaller.some((small) => node.conditionals.includes(small)) &&
	                bigger.some((big) => node.conditionals.includes(big));
	            if (node.conditionals.includes("equal")) {
	                node.params.sort(newCompare);
	            }
	            else if (smallerAndBigger && node.params) {
	                if (newCompare(node.params[0], node.params[node.params.length - 1]) > -1) {
	                    node.params.reverse();
	                }
	            }
	            else {
	                node.conditionals = node.conditionals.map((cond) => {
	                    if (cond === "smaller") {
	                        reverse = true;
	                        cond = "larger";
	                    }
	                    else if (cond === "smallerEq") {
	                        reverse = true;
	                        cond = "largerEq";
	                    }
	                    return cond;
	                });
	            }
	        }
	        if (node.params && reverse) {
	            node.conditionals.reverse();
	            node.params.reverse();
	        }
	        if (parent && parent.type === "RelationalNode" && node.args) {
	            node = exports.s(node);
	        }
	        return node;
	    });
	    log$1("THIS IS THE END ++++", JSON.stringify(node));
	    return resultNode;
	};
	exports.sortRelationalNode = sortRelationalNode;
	// export const test = (input) => {
	//   const latexConverted = lta.convert(input);
	//   console.log(latexConverted, "latexconverted");
	//   const mathNode = atm.convert(latexConverted);
	//   console.log(mathNode, "math node");
	//   const sorted = s(mathNode);
	//   console.log("sorted from test");
	//   return sorted;
	// };
	const s = (node) => {
	    let resultNode = node;
	    if (node.type === "RelationalNode") {
	        return exports.sortRelationalNode(node);
	    }
	    if (node.isOperatorNode && node.fn === "smaller") {
	        node.op = ">";
	        node.fn = "larger";
	        node.args = node.args.reverse();
	    }
	    if (node.isOperatorNode && node.fn === "smallerEq") {
	        node.op = ">=";
	        node.fn = "largerEq";
	        node.args = node.args.reverse();
	    }
	    if (node.isOperatorNode &&
	        (node.fn === "larger" || node.fn === "largerEq" || node.fn == "equal")) {
	        node.args = node.args.map(exports.s);
	        if (node.fn == "equal") {
	            node.args = node.args.sort(newCompare);
	        }
	    }
	    const flattened = exports.flattenNode(node);
	    resultNode = flattened.transform(applySort);
	    return resultNode;
	};
	exports.s = s;

	});

	var literal = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isMathEqual = void 0;



	const { simplify } = mathjs.mathjs;
	log.logger("mv:literal");
	const simplifyRule = { l: "tzn(n1, n2)", r: "n1" };
	const isMathEqual = (a, b, opts) => {
	    if (opts && opts.allowTrailingZeros) {
	        a = simplify(a, [simplifyRule]);
	        b = simplify(b, [simplifyRule]);
	    }
	    if (opts && opts.ignoreOrder) {
	        a = nodeSort.s(a);
	        //console.log("sorted a", JSON.stringify(a));
	        b = nodeSort.s(b);
	        //console.log("sorted b", JSON.stringify(b));
	    }
	    let equalTex;
	    // @ts-ignore
	    if (!a.isUnit) {
	        equalTex = a.toTex().trim() === b.toTex().trim();
	    }
	    return a.equals(b) || equalTex;
	};
	exports.isMathEqual = isMathEqual;

	});

	var latexEqual_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.latexEqual = void 0;




	const lta = new latexToAst.LatexToAst();
	const atm = new astToMathjs.AstToMathJs();
	const toMathNode = (latex) => {
	    const ast = lta.convert(latex);
	    return atm.convert(ast);
	    // return parse(latex);
	};
	const latexEqual = (a, b, opts) => {
	    if (!a || !b) {
	        return false;
	    }
	    if (a === b) {
	        return true;
	    }
	    /**
	     * TODO: apply a cutoff in difference in string size:
	     * say correctResponse is 1+1=2
	     * but user enters: 'arstasr arsoinerst9arsta8rstarsiotenarstoiarestaoristnarstoi'
	     * This string is way bigger than it needs to be.
	     * Say limit to 3 times the size of correct string?
	     */
	    // remove spaces, trailing zeros & left & right parenthesis before counting length
	    const aTrimmed = a.replace(/(\\left\()|(\\right\))|( )|([.](0+))/g, "").length;
	    const bTrimmed = b.replace(/(\\left\()|(\\right\))|( )|([.](0+))/g, "").length;
	    if (aTrimmed > bTrimmed * 5 || bTrimmed > aTrimmed * 5) {
	        return false;
	    }
	    const amo = toMathNode(a);
	    const bmo = toMathNode(b);
	    if (opts.mode === "literal") {
	        return literal.isMathEqual(amo, bmo, opts.literal);
	    }
	    else {
	        return symbolic.isMathEqual(amo, bmo, opts.symbolic);
	    }
	};
	exports.latexEqual = latexEqual;

	});

	var lib = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.latexEqual = void 0;


	/**
	 * For dev purposes allow legacy to be called for comparison.
	 * Eventually we'll remove this.
	 */
	const latexEqual = (a, b, opts) => {
	    if (opts.legacy) {
	        return opts.mode === "literal"
	            ? legacy.literalEquals(a, b, { ...opts, isLatex: true })
	            : legacy.symbolicEquals(a, b, { ...opts, isLatex: true });
	    }
	    else {
	        return latexEqual_1.latexEqual(a, b, opts);
	    }
	};
	exports.latexEqual = latexEqual;

	});

	var demo = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	function default_1() {
	    let opts = {};
	    let flags = "?";
	    const params = window.location.search;
	    const urlParams = new URLSearchParams(params);
	    let mode;
	    let allowTrailingZeros;
	    let ignoreOrder;
	    const getOptions = (mode, allowTrailingZeros, ignoreOrder) => {
	        if (mode == "literal" || mode == "symbolic") {
	            opts.mode = mode;
	        }
	        if (opts.mode == "literal") {
	            opts.literal = {
	                allowTrailingZeros: false,
	                ignoreOrder: false,
	            };
	            if (allowTrailingZeros) {
	                opts.literal.allowTrailingZeros = true;
	            }
	            if (ignoreOrder) {
	                opts.literal.ignoreOrder = true;
	            }
	        }
	    };
	    const showAndHideLiteralOptions = (mode) => {
	        const literalOptions = document.querySelector("#literal-options");
	        if (mode.value == "literal") {
	            literalOptions.classList.remove("d-none");
	        }
	        else {
	            literalOptions.classList.add("d-none");
	        }
	    };
	    const formSubmit = (submit, expression1, expression2, opts, validationType) => {
	        const response = document.getElementById("response");
	        const equalityResult = document.getElementById("equality-result");
	        let message;
	        let sign = "?";
	        let result;
	        if (submit === false) {
	            message = "Please complete all fields ";
	            sign = "!";
	            equalityResult.classList.remove("text-danger", "text-success", "alert-dark");
	            equalityResult.classList.add("text-warning");
	            response.classList.remove("alert-success", "alert-danger");
	            response.classList.add("alert-warning");
	        }
	        else {
	            try {
	                result = lib.latexEqual(expression1, expression2, opts);
	            }
	            catch (e) {
	                message = "something went wrong when parsing expressions";
	                response.classList.remove("alert-warning", "alert-success", "alert-danger");
	                response.classList.add("alert-dark");
	            }
	            if (result) {
	                message = `The entered expressions validate each other in ${validationType} mode`;
	                sign = "=";
	                equalityResult.classList.remove("text-warning", "text-danger", "alert-dark");
	                equalityResult.classList.add("text-success");
	                response.classList.remove("alert-warning", "alert-danger", "alert-dark");
	                response.classList.add("alert-success");
	            }
	            else if (!message) {
	                message = `The entered expressions does not validate each other in ${validationType} mode`;
	                sign = "≠";
	                equalityResult.classList.remove("text-success", "text-warning");
	                equalityResult.classList.add("text-danger");
	                response.classList.remove("alert-warning", "alert-success", "alert-dark");
	                response.classList.add("alert-danger");
	            }
	        }
	        equalityResult.innerHTML = sign;
	        response.innerHTML = message;
	    };
	    window.addEventListener("DOMContentLoaded", (event) => {
	        const form = document.getElementById("equality-form");
	        const response = document.getElementById("response");
	        response.innerHTML = "";
	        let submit = false;
	        const equalityResult = document.getElementById("equality-result");
	        let sign = "?";
	        equalityResult.classList.add("text-warning");
	        equalityResult.innerHTML = sign;
	        mode = document.getElementById("validation-type");
	        mode.value = urlParams.get("validation-type")
	            ? decodeURIComponent(urlParams.get("validation-type"))
	            : "";
	        if (mode.value) {
	            showAndHideLiteralOptions(mode);
	            submit = true;
	        }
	        // @ts-ignore
	        document.querySelector("#validation-type").onchange = (event) => {
	            showAndHideLiteralOptions(event.target);
	        };
	        allowTrailingZeros = document.getElementById("trailing-zeros");
	        // @ts-ignore
	        allowTrailingZeros.checked = urlParams.get("trailing-zeros")
	            ? decodeURIComponent(urlParams.get("trailing-zeros"))
	            : false;
	        ignoreOrder = document.getElementById("ignore-order");
	        // @ts-ignore
	        ignoreOrder.checked = urlParams.get("ignore-order")
	            ? decodeURIComponent(urlParams.get("ignore-order"))
	            : false;
	        const exppression1 = document.getElementById("math-expression1");
	        exppression1.value = urlParams.get("math-expression1")
	            ? decodeURIComponent(urlParams.get("math-expression1"))
	            : "";
	        const exppression2 = document.getElementById("math-expression2");
	        exppression2.value = urlParams.get("math-expression2")
	            ? decodeURIComponent(urlParams.get("math-expression2"))
	            : "";
	        if (exppression1.value === "" || exppression2.value === "") {
	            submit = false;
	        }
	        else {
	            getOptions(mode.value, allowTrailingZeros, ignoreOrder);
	        }
	        if (submit) {
	            formSubmit(submit, exppression1.value, exppression2.value, opts, mode.value);
	        }
	        form.addEventListener("submit", (e) => {
	            e.preventDefault();
	            let submitButton = false;
	            const validationType = document.getElementById("validation-type").value;
	            const trailingZeros = document.getElementById("trailing-zeros").checked;
	            const ignoreOrder = document.getElementById("ignore-order").checked;
	            if (validationType) {
	                getOptions(validationType, trailingZeros, ignoreOrder);
	                flags += "validation-type=" + encodeURIComponent(validationType);
	                submitButton = true;
	                if (trailingZeros) {
	                    flags +=
	                        "&trailing-zeros=" + encodeURIComponent(trailingZeros.toString());
	                }
	                if (ignoreOrder) {
	                    flags +=
	                        "&ignore-order=" + encodeURIComponent(ignoreOrder.toString());
	                }
	            }
	            const firstExpression = document.getElementById("math-expression1").value;
	            const secondExpression = document.getElementById("math-expression2").value;
	            if (!firstExpression || !secondExpression) {
	                submitButton = false;
	            }
	            else {
	                flags +=
	                    "&math-expression1=" +
	                        encodeURIComponent(firstExpression) +
	                        "&math-expression2=" +
	                        encodeURIComponent(secondExpression);
	            }
	            formSubmit(submitButton, firstExpression, secondExpression, opts, validationType);
	            window.history.replaceState(null, null, flags);
	            // reset flags
	            flags = "?";
	        });
	    });
	}
	exports.default = default_1;

	});

	var demo$1 = /*@__PURE__*/getDefaultExportFromCjs(demo);

	return demo$1;

}(mathjs_1, require$$1));
