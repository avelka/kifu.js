/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/sgfgrove/lib/sgfgrove.js":
/*!***********************************************!*\
  !*** ./node_modules/sgfgrove/lib/sgfgrove.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function () {
    "use strict";

    var SGFGrove = {};

    SGFGrove.Util = (function () {
        var Util = {};

        Util.isNumber = function (value) {
            return typeof value === "number" && isFinite(value);
        };

        Util.isInteger = function (value) {
            return Util.isNumber(value) && Math.floor(value) === value;
        };

        return Util;
    }());

    SGFGrove.parse = (function () {
        var source, lastIndex, reviver;

        // Override RegExp's test and exec methods to let ^ behave like
        // the \G assertion (/\G.../gc). See also:
        // http://perldoc.perl.org/perlop.html#Regexp-Quote-Like-Operators

        var Whitespaces = /^\s*/g,
            OpenParen   = /^\(\s*/g,
            CloseParen  = /^\)\s*/g,
            Semicolon   = /^;\s*/g,
            PropIdent   = /^([a-zA-Z0-9]+)\s*/g,
            PropValue   = /^\[((?:\\[\S\s]|[^\]\\]+)*)\]\s*/g;

        var test = function () {
            var bool = this.test(source.slice(lastIndex));
            lastIndex += this.lastIndex;
            this.lastIndex = 0;
            return bool;
        };

        var exec = function () {
            var array = this.exec(source.slice(lastIndex));
            lastIndex += this.lastIndex;
            this.lastIndex = 0;
            return array;
        };

        var parseGameTree = function (properties) {
            var sequence = [];

            if (!test.call(OpenParen)) {
                return;
            }

            while (test.call(Semicolon)) {
                var node = {};

                while (true) {
                    var ident = exec.call(PropIdent);

                    if (ident) {
                        ident = ident[1];
                    }
                    else {
                        break;
                    }

                    if (node.hasOwnProperty(ident)) {
                        throw new SyntaxError("Property "+ident+" already exists");
                    }

                    var values = [];

                    while (true) {
                        var v = exec.call(PropValue);
                        if (v) { values.push(v[1]); }
                          else { break; }
                    }

                    if (!values.length) {
                        throw new SyntaxError("PropValue of "+ident+" is missing");
                    }

                    node[ident] = values;
                }

                properties = properties || createProperties(node);
                node = parseProperties(node, properties);

                sequence.push(node);
            }

            if (!sequence.length) {
                throw new SyntaxError("GameTree does not contain any Nodes");
            }

            var children = [];

            while (true) {
                var child = parseGameTree(properties);
                if (child) { children.push(child); }
                      else { break; }
            }

            if (!test.call(CloseParen)) { // end of GameTree
                throw new SyntaxError("Unexpected token "+source.charAt(lastIndex));
            }

            // (;a(;b)) => (;a;b)
            if (children.length === 1) {
                sequence = sequence.concat(children[0][0]);
                children = children[0][1];
            }

            return [sequence, children];
        };

        var createProperties = function (root) {
            var SGFNumber = SGFGrove.fileFormat({ FF: 4 }).Types.Number;

            var fileFormat = SGFGrove.fileFormat({
                FF : SGFNumber.parse(root.FF || []) || 1,
                GM : SGFNumber.parse(root.GM || []) || 1
            });

            return fileFormat.properties();
        };

        var parseProperties = function (node, properties) {
            var n = {};

            for (var ident in node) {
                if (node.hasOwnProperty(ident)) {
                    var prop = properties.parse(ident, node[ident]);

                    if (!prop) {
                        throw new SyntaxError("Invalid PropIdent "+ident);
                    }
                    else if (n.hasOwnProperty(prop[0])) {
                        throw new SyntaxError("Property "+prop[0]+" already exists");
                    }
                    else if (prop[1] === undefined) {
                        var str = ident+"["+node[ident].join("][")+"]";
                        throw new SyntaxError("Invalid PropValue "+str);
                    }

                    n[prop[0]] = prop[1];
                }
            }

            return n;
        };
 
        // Copied and rearranged from json2.js so that we can pass the same
        // callback to both of SGF.parse and JSON.parse
        // https://github.com/douglascrockford/JSON-js/blob/master/json2.js
        var walk = function (holder, key) {
            var value = holder[key];

            if (value && typeof value === "object") {
                for (var k in value) {
                    if (value.hasOwnProperty(k)) {
                        var v = walk(value, k);
                        if (v !== undefined) {
                            value[k] = v;
                        }
                        else {
                            delete value[k];
                        }
                    }
                }
            }

            return reviver.call(holder, key, value);
        };

        return function (text, rev) {
            var collection = [];

            source = String(text);
            lastIndex = 0;
            reviver = typeof rev === "function" && rev;

            test.call(Whitespaces);

            while (true) {
                var gameTree = parseGameTree();
                if (gameTree) { collection.push(gameTree); }
                         else { break; }
            }

            if (lastIndex !== source.length) {
                throw new SyntaxError("Unexpected token "+source.charAt(lastIndex));
            }

            return reviver ? walk({ "": collection }, "") : collection;
        };
    }());

    SGFGrove.stringify = (function () {
        var isArray = Array.isArray;
        var replacer, selected, indent, gap;

        var createProperties = function (root) {
            var fileFormat = SGFGrove.fileFormat({
                FF : root.hasOwnProperty("FF") ? root.FF : 1,
                GM : root.hasOwnProperty("GM") ? root.GM : 1
            });
            return fileFormat.properties();
        };

        var finalize = function (key, holder) {
            var value = holder[key];
            var i, k, v;

            if (value && typeof value === "object" &&
                typeof value.toSGF === "function") {
                value = value.toSGF(key);
            }

            if (replacer) {
                value = replacer.call(holder, key, value);
            }

            if (!value || typeof value !== "object") {
                v = value;
            }
            else if (isArray(value)) {
                v = [];
                for ( i = 0; i < value.length; i++ ) {
                    v[i] = finalize(i, value);
                }
            }
            else {
                v = {};
                if (selected) {
                    for (i = 0; i < selected.length; i++) {
                        v[selected[i]] = finalize(selected[i], value);
                    }
                }
                else {
                    for (k in value) {
                        if (value.hasOwnProperty(k)) {
                            v[k] = finalize(k, value);
                        }
                    }
                }
            }

            return v;
        };
 
        var stringifyGameTree = function (gameTree, properties) {
            gameTree = isArray(gameTree) ? gameTree : [];

            var sequence = isArray(gameTree[0]) ? gameTree[0] : [],
                children = isArray(gameTree[1]) ? gameTree[1] : [];

            // (;a(;b)) => (;a;b)
            if (children.length === 1) {
                sequence = sequence.concat(isArray(children[0][0]) ? children[0][0] : []);
                children = isArray(children[0][1]) ? children[0][1] : [];
            }

            var text = "",
                lf = indent ? "\n" : "",
                mind = gap;

            if (sequence.length) {
                text += gap+"("+lf; // open GameTree
                gap += indent;

                var semicolon = gap+";",
                    space = gap+(indent ? " " : "");

                for (var i = 0; i < sequence.length; i++) {
                    var node = sequence[i] && typeof sequence[i] === "object" ? sequence[i] : {};
                    var partial = [];
                        
                    properties = properties || createProperties(node);

                    for (var ident in node) {
                        if (node.hasOwnProperty(ident)) {
                            var values = properties.stringify(ident, node[ident]);
                            if (values) {
                                partial.push(ident+"["+values.join("][")+"]");
                            }
                        }
                    }

                    text += semicolon+partial.join(lf+space)+lf; // add Node
                }

                for (var j = 0; j < children.length; j++) {
                    text += stringifyGameTree(children[j], properties); // add GameTree
                }

                text += mind+")"+lf; // close GameTree
                gap = mind;
            }

            return text;
        };

        return function (collection, rep, space) {
            var text, i;

            replacer = null;
            selected = null;
            indent = "";
            gap = "";

            if (isArray(rep)) {
                selected = [];
                for (i = 0; i < rep.length; i++) {
                    if (typeof rep[i] === "string") {
                        selected.push(rep[i]);
                    }
                }
            }
            else if (typeof rep === "function") {
                replacer = rep;
            }
            else if (rep) {
                throw new Error("replacer must be array or function");
            }

            if (typeof space === "number") {
                for (i = 0; i < space; i++) {
                    indent += " ";
                }
            }
            else if (typeof space === "string") {
                indent = space;
            }

            collection = finalize("", { "": collection });

            if (isArray(collection)) {
                text = "";
                for (i = 0; i < collection.length; i++) {
                    text += stringifyGameTree(collection[i]);
                }
            }

            return text;
        };
    }());

    SGFGrove.fileFormat = (function () {
        var isInteger = SGFGrove.Util.isInteger,
            FF = {};

        return function (version, callback) {
            version = version || {};

            var ff = version.FF,
                gm = version.GM;

            if (typeof callback !== "function") {
                if (isInteger(ff) && ff > 0 && FF[ff]) {
                    if (isInteger(gm) && gm > 0 && FF[ff].GM[gm]) {
                        return FF[ff].GM[gm];
                    }
                    return FF[ff];
                }
                return FF;
            }

            var fileFormat = {};
                fileFormat = callback.call(fileFormat, FF) || fileFormat;

            if (ff && gm) {
                FF[ff].GM[gm] = fileFormat;
            }
            else if (ff) {
                fileFormat.GM = fileFormat.GM || {};
                FF[ff] = fileFormat;
            }
            else {
                FF = fileFormat;
            }
 
            return;
        };
    }());

    SGFGrove.fileFormat({}, function () {
        var Types = {};

        Types.scalar = function (args) {
            args = args || {};

            var that = {};

            var like = args.like || { test: function () { return true; } };
            var parse = args.parse || function (v) { return v; };

            var isa = args.isa || function (v) { return typeof v === "string" && like.test(v); };
            var stringify = args.stringify || String;

            that.parse = function (values) {
                if (values.length === 1 && like.test(values[0])) {
                    return parse(values[0]);
                }
            };

            that.stringify = function (value) {
                if (isa(value)) {
                    return [stringify(value)];
                }
            };

            return that;
        };

        Types.Unknown = {
            parse: function (values) {
                var result = [];

                for (var i = 0; i < values.length; i++) {
                    result[i] = values[i].replace(/\\\]/g, "]");
                }

                return result;
            },
            stringify: function (values) {
                if (Array.isArray(values)) {
                    var result = [];

                    for (var i = 0; i < values.length; i++) {
                        if (typeof values[i] === "string") {
                            result[i] = values[i].replace(/\]/g, "\\]");
                        }
                        else {
                            return;
                        }
                    }

                    return result;
                }
            }
        };

        this.Types = Types;

        this.properties = function (t, args) {
            t = t || Types;
            args = args || {};

            var that = {
                typeOf      : args.typeOf      || {},
                defaultType : args.defaultType || t.Unknown,
                identifiers : args.identifiers || { test: function () { return false; } },
                replacer    : args.replacer
            };

            that.merge = function (other) {
                for (var ident in other) {
                    if (other.hasOwnProperty(ident) && other[ident]) {
                        this.typeOf[ident] = other[ident];
                    }
                }
                return this;
            };

            that.parse = function (ident, values) {
                if (this.replacer) {
                    ident = this.replacer.call(null, ident);
                }
                if (this.identifiers.test(ident)) {
                    var type = this.typeOf[ident] || this.defaultType;
                    return [ident, type.parse(values)];
                }
            };

            that.stringify = function (ident, values) {
                if (this.identifiers.test(ident)) {
                    var type = this.typeOf[ident] || this.defaultType;
                    return type.stringify(values);
                }
            };

            return that;
        };

        return;
    });

    // File Format (;FF[4])
    // http://www.red-bean.com/sgf/sgf4.html
    // http://www.red-bean.com/sgf/properties.html
    SGFGrove.fileFormat({ FF: 4 }, function (FF) {
        var Types = Object.create(FF.Types);
        var isArray = Array.isArray;

        Types.compose = function (left, right) {
            return left && right && {
                escape: function (v) { return v.replace(/:/g, "\\:"); },
                parse: function (values) {
                    if (values.length === 1) {
                        var v = /^((?:\\[\S\s]|[^:\\]+)*):((?:\\[\S\s]|[^:\\]+)*)$/.exec(values[0]) || undefined;
                        var l = v && left.parse([v[1]]);
                        var r = v && right.parse([v[2]]);
                        if (l !== undefined && r !== undefined) {
                            return [l, r];
                        }
                    }
                },
                stringify: function (value) {
                    if (isArray(value) && value.length === 2) {
                        var l = left.stringify(value[0]);
                        var r = right.stringify(value[1]);
                        return l && r && [this.escape(l[0])+":"+this.escape(r[0])];
                    }
                }
            };
        };

        Types.listOf = function (scalar, args) {
            args = args || {};

            return scalar && {
                canBeEmpty: args.canBeEmpty,
                parse: function (values) {
                    var result = [];

                    if (values.length === 1 && values[0] === "") {
                        return this.canBeEmpty ? result : undefined;
                    }

                    for (var i = 0; i < values.length; i++) {
                        result[i] = scalar.parse([values[i]]);
                        if (result[i] === undefined) {
                            return;
                        }
                    }

                    return result;
                },
                stringify: function (values) {
                    if (!isArray(values)) {
                        return;
                    }

                    if (!values.length) {
                        return this.canBeEmpty ? [""] : undefined;
                    }

                    var result = [];

                    for ( var i = 0; i < values.length; i++ ) {
                        result[i] = scalar.stringify(values[i])[0];
                        if ( result[i] === undefined ) {
                            return;
                        }
                    }

                    return result;
                },
                toElist: function () {
                    var other = Object.create(this);
                    other.canBeEmpty = true;
                    return other;
                }
            };
        };

        Types.elistOf = function (scalar) {
            return Types.listOf(scalar, {
                canBeEmpty: true
            });
        };

        Types.or = function (a, b) {
            return a && b && {
                parse: function (values) {
                    var result = a.parse(values);
                    return result !== undefined ? result : b.parse(values);
                },
                stringify: function (value) {
                    return a.stringify(value) || b.stringify(value);
                }
            };
        };

        // Number = ["+"|"-"] Digit {Digit}
        Types.Number = Types.scalar({
            like: /^[+-]?\d+$/,
            isa: SGFGrove.Util.isInteger,
            parse: function (v) { return parseInt(v, 10); }
        });

        // None = ""
        Types.None = Types.scalar({
            like: { test: function (v) { return v === ""; } },
            isa: function (v) { return v === null; },
            parse: function () { return null; },
            stringify: function () { return ""; }
        });

        // Real = Number ["." Digit { Digit }]
        Types.Real = Types.scalar({
            like: /^[+-]?\d+(?:\.\d+)?$/,
            isa: SGFGrove.Util.isNumber,
            parse: parseFloat
        });

        // Double = ("1" | "2")
        Types.Double = Types.scalar({
            like: /^[12]$/,
            isa: function (v) { return v === 1 || v === 2; },
            parse: parseInt
        });

        // Color = ("B" | "W")
        Types.Color = Types.scalar({
            like: /^[BW]$/
        });

        // Text = { any character }
        Types.Text = Types.scalar({
            parse: function (value) {
                return value.
                    // remove soft linebreaks
                    replace(/\\(?:\n\r?|\r\n?)/g, "").
                    // convert white spaces other than linebreaks to space
                    replace(/[^\S\n\r]/g, " ").
                    // insert escaped chars verbatim
                    replace(/\\([\S\s])/g, "$1");
            },
            stringify: function (value) {
                return value.replace(/([\]\\])/g, "\\$1"); // escape "]" and "\"
            }
        });

        // SimpleText = { any character }
        Types.SimpleText = Types.scalar({
            parse: function (value) {
                return value.
                    // remove soft linebreaks
                    replace(/\\(?:\n\r?|\r\n?)/g, "").
                    // convert white spaces other than space to space even if it's escaped
                    replace(/\\?[^\S ]/g, " ").
                    // insert escaped chars verbatim
                    replace(/\\([\S\s])/g, "$1");
            },
            stringify: function (value) {
                return value.replace(/([\]\\])/g, "\\$1"); // escape "]" and "\"
            }
        });

        this.Types = Types;

        this.properties = function (t) {
            t = t || Types;

            return FF.properties(t, {
                identifiers: /^[A-Z]+$/,
                typeOf: {
                    // Move properties
                    B  : t.Move,
                    KO : t.None,
                    MN : t.Number,
                    W  : t.Move,
                    // Setup properties
                    AB : t.listOfStone || t.listOf(t.Stone),
                    AE : t.listOfPoint,
                    AW : t.listOfStone || t.listOf(t.Stone),
                    PL : t.Color,
                    // Node annotation properties
                    C  : t.Text,
                    DM : t.Double,
                    GB : t.Double,
                    GW : t.Double,
                    HO : t.Double,
                    N  : t.SimpleText,
                    UC : t.Double,
                    V  : t.Real,
                    // Move annotation properties
                    BM : t.Double,
                    DO : t.None,
                    IT : t.None,
                    TE : t.Double,
                    // Markup properties
                    AR : t.listOf(t.compose(t.Point, t.Point)),
                    CR : t.listOfPoint,
                    DD : t.elistOfPoint,
                    LB : t.listOf(t.compose(t.Point, t.SimpleText)),
                    LN : t.listOf(t.compose(t.Point, t.Point)),
                    MA : t.listOfPoint,
                    SL : t.listOfPoint,
                    SQ : t.listOfPoint,
                    TR : t.listOfPoint,
                    // Root properties
                    AP : t.compose(t.SimpleText, t.SimpleText),
                    CA : t.SimpleText,
                    FF : t.Number,
                    GM : t.Number,
                    ST : t.Number,
                    SZ : t.or(t.Number, t.compose(t.Number, t.Number)),
                    // Game info properties
                    AN : t.SimpleText,
                    BR : t.SimpleText,
                    BT : t.SimpleText,
                    CP : t.SimpleText,
                    DT : t.SimpleText,
                    EV : t.SimpleText,
                    GN : t.SimpleText,
                    GC : t.Text,
                    ON : t.SimpleText,
                    OT : t.SimpleText,
                    PB : t.SimpleText,
                    PC : t.SimpleText,
                    PW : t.SimpleText,
                    RE : t.SimpleText,
                    RO : t.SimpleText,
                    RU : t.SimpleText,
                    SO : t.SimpleText,
                    TM : t.Real,
                    US : t.SimpleText,
                    WR : t.SimpleText,
                    WT : t.SimpleText,
                    // Timing properties
                    BL : t.Real,
                    OB : t.Number,
                    OW : t.Number,
                    WL : t.Real,
                    // Miscellaneous properties
                    FG : t.or(t.None, t.compose(t.Number, t.SimpleText)),
                    PM : t.Number,
                    VM : t.elistOfPoint
                }
            });
        };

        return;
    });

    // Go (;FF[4]GM[1]) specific properties
    // http://www.red-bean.com/sgf/go.html
    SGFGrove.fileFormat({ FF: 4, GM: 1 }, function (FF) {
        var Types = Object.create(FF[4].Types);

        var expandPointList = (function () {
            var coord = "abcdefghijklmnopqrstuvwxyz";
                coord += coord.toUpperCase();

            return function (p1, p2) {
                var x1 = coord.indexOf(p1.charAt(0)),
                    y1 = coord.indexOf(p1.charAt(1)),
                    x2 = coord.indexOf(p2.charAt(0)),
                    y2 = coord.indexOf(p2.charAt(1));

                var h; 
                if (x1 > x2) {
                    h = x1; x1 = x2; x2 = h;
                }
                if (y1 > y2) {
                    h = y1; y1 = y2; y2 = h;
                }

                var points = [];
                for (var y = y1; y <= y2; y++) {
                    for (var x = x1; x <= x2; x++) {
                        points.push(coord.charAt(x)+coord.charAt(y));
                    }
                }

                return points;
            };
        }());

        Types.Point = Types.scalar({
            like: /^[a-zA-Z]{2}$/
        });
  
        Types.Stone = Types.Point;
        Types.Move  = Types.or(Types.None, Types.Point);

        Types.listOfPoint = (function (t) {
            var listOfPoint = t.listOf(t.or(
                t.Point,
                t.scalar({
                    like: /^[a-zA-Z]{2}:[a-zA-Z]{2}$/,
                    parse: function (value) {
                        var rect = value.split(":");
                        return expandPointList(rect[0], rect[1]);
                    }
                })
            ));

            var parse = listOfPoint.parse;
            var array = [];

            listOfPoint.parse = function (values) {
                var result = parse.call(this, values);
                return result && array.concat.apply(array, result); // flatten
            };

            return listOfPoint;
        }(Types));

        Types.elistOfPoint = Types.listOfPoint.toElist();

        Types.listOfStone  = Types.listOfPoint;
        Types.elistOfStone = Types.elistOfPoint;
    
        this.Types = Types;

        this.properties = function (t) {
            t = t || Types;

            var that = FF[4].properties(t);

            that.merge({
                HA : t.Number,
                KM : t.Real,
                TB : t.elistOfPoint,
                TW : t.elistOfPoint
            });

            return that;
        };

        return;
    });

    if (true) {
        module.exports = SGFGrove; // jshint ignore:line
    }
    else {}

}());



/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const kifu_service_1 = __webpack_require__(/*! ./kifu.service */ "./src/kifu.service.ts");
exports.default = kifu_service_1.default;


/***/ }),

/***/ "./src/kifu.service.ts":
/*!*****************************!*\
  !*** ./src/kifu.service.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sgfgrove = __webpack_require__(/*! sgfgrove */ "./node_modules/sgfgrove/lib/sgfgrove.js");
const models_1 = __webpack_require__(/*! ./models */ "./src/models.ts");
class KifuService {
    constructor() {
    }
    read(svg) {
        const [[[meta, ...game]]] = sgfgrove.parse(svg);
        const { PB, PW, BR, WR, SZ, KM, RU, GN, CP, US, AN } = meta, rest = __rest(meta, ["PB", "PW", "BR", "WR", "SZ", "KM", "RU", "GN", "CP", "US", "AN"]);
        return {
            players: [
                { color: models_1.BLACK, name: PB, level: BR },
                { color: models_1.WHITE, name: PW, level: WR },
            ],
            info: {
                size: SZ,
                komi: KM,
                rule: RU,
            },
            meta: {
                name: GN,
                copyright: CP,
                scribe: US,
                commentator: AN
            },
            rest,
            game
        };
    }
}
exports.default = KifuService;


/***/ }),

/***/ "./src/models.ts":
/*!***********************!*\
  !*** ./src/models.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.APPNAME = "tengen.js";
exports.VER = "0.1";
exports.EMPTY = null;
exports.BLACK = "black";
exports.WHITE = "white";
exports.PASS = "pass";
exports.UNDO = "undo";
exports.ABANDON = "abandon";
exports.NEXT = "next";
exports.PREV = "prev";
exports.END = "end_game";
exports.START = "start_game";
var State;
(function (State) {
    State["BLACK"] = "black";
    State["WHITE"] = "white";
    State["KO"] = "ko";
})(State = exports.State || (exports.State = {}));
/*
export const alphabet = (s = 26) => {
  return new Array(s).fill(1).map((_:any, i:number) => String.fromCharCode(97 + i));
};

export const a2n = (a : string) => {
  return alphabet().indexOf(a);
};
export const n2a = (n: number) => {
  return alphabet()[n];
};

export const toCoord = (node: { x: number; y: number }) => {
  const { x, y } = node;
  return n2a(x) + n2a(y);
};
export const fromSGFCoord = (sgfnode: any) => {
  const move = sgfnode.B || sgfnode.W;
  if (move) {
    const [x, y] = move.split("");
    return { x: a2n(x), y: a2n(y) };
  }
  return { x: null, y: null };
};

export interface Item {
  id?: any;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  author?: Player;
}
export interface Comment {
  order: number;
  text: string;
  time?: Date;
  move?: any;
}
export interface GameSettings extends Item {
  white: Player;
  black: Player;
  size: number;
  scores: ScoreBoard;
  title?: string;
  komi?: number;
  clock?: any;
  board?: any;
  event?: string;
  round?: number;
  date?: Date;
  location?: string;
  comments?: Comment[];
  tree?: any[];
  needConfirm: boolean;
}

export interface GameListItem {
  name: string;
  updated_at: any;
  timestamp: number;
  key: string;
}

export interface Player extends Item {
  name: string;
  rank?: string;
}

export interface ScoreBoard extends Item {
  black: Score | null;
  white: Score | null;
}

export interface Score extends Item {
  captured?: number;
  territory?: number;
}

export interface Move extends Item {
  x?: number;
  y?: number;
  player: any;
  state: any;
  leafs?: Move[];
  order?: number;
  inHistory?: boolean;
  captured?: Move[];
  played: boolean;
  comments?: any[];
  time?: number;
}
*/ 


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NnZmdyb3ZlL2xpYi9zZ2Zncm92ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tpZnUuc2VydmljZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFD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LFlBQUksR0FBRyxNQUFNLENBQUM7QUFDZCxZQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ2QsZUFBTyxHQUFHLFNBQVMsQ0FBQztBQUNwQixZQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ2QsWUFBSSxHQUFHLE1BQU0sQ0FBQztBQUNkLFdBQUcsR0FBRyxVQUFVLENBQUM7QUFDakIsYUFBSyxHQUFHLFlBQVksQ0FBQztBQUVsQyxJQUFZLEtBSVg7QUFKRCxXQUFZLEtBQUs7SUFDZix3QkFBZTtJQUNmLHdCQUFlO0lBQ2Ysa0JBQVM7QUFDWCxDQUFDLEVBSlcsS0FBSyxHQUFMLGFBQUssS0FBTCxhQUFLLFFBSWhCO0FBV0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUEyRkUiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgU0dGR3JvdmUgPSB7fTtcblxuICAgIFNHRkdyb3ZlLlV0aWwgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgVXRpbCA9IHt9O1xuXG4gICAgICAgIFV0aWwuaXNOdW1iZXIgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIgJiYgaXNGaW5pdGUodmFsdWUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIFV0aWwuaXNJbnRlZ2VyID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gVXRpbC5pc051bWJlcih2YWx1ZSkgJiYgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBVdGlsO1xuICAgIH0oKSk7XG5cbiAgICBTR0ZHcm92ZS5wYXJzZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzb3VyY2UsIGxhc3RJbmRleCwgcmV2aXZlcjtcblxuICAgICAgICAvLyBPdmVycmlkZSBSZWdFeHAncyB0ZXN0IGFuZCBleGVjIG1ldGhvZHMgdG8gbGV0IF4gYmVoYXZlIGxpa2VcbiAgICAgICAgLy8gdGhlIFxcRyBhc3NlcnRpb24gKC9cXEcuLi4vZ2MpLiBTZWUgYWxzbzpcbiAgICAgICAgLy8gaHR0cDovL3Blcmxkb2MucGVybC5vcmcvcGVybG9wLmh0bWwjUmVnZXhwLVF1b3RlLUxpa2UtT3BlcmF0b3JzXG5cbiAgICAgICAgdmFyIFdoaXRlc3BhY2VzID0gL15cXHMqL2csXG4gICAgICAgICAgICBPcGVuUGFyZW4gICA9IC9eXFwoXFxzKi9nLFxuICAgICAgICAgICAgQ2xvc2VQYXJlbiAgPSAvXlxcKVxccyovZyxcbiAgICAgICAgICAgIFNlbWljb2xvbiAgID0gL147XFxzKi9nLFxuICAgICAgICAgICAgUHJvcElkZW50ICAgPSAvXihbYS16QS1aMC05XSspXFxzKi9nLFxuICAgICAgICAgICAgUHJvcFZhbHVlICAgPSAvXlxcWygoPzpcXFxcW1xcU1xcc118W15cXF1cXFxcXSspKilcXF1cXHMqL2c7XG5cbiAgICAgICAgdmFyIHRlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYm9vbCA9IHRoaXMudGVzdChzb3VyY2Uuc2xpY2UobGFzdEluZGV4KSk7XG4gICAgICAgICAgICBsYXN0SW5kZXggKz0gdGhpcy5sYXN0SW5kZXg7XG4gICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICByZXR1cm4gYm9vbDtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZXhlYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcnJheSA9IHRoaXMuZXhlYyhzb3VyY2Uuc2xpY2UobGFzdEluZGV4KSk7XG4gICAgICAgICAgICBsYXN0SW5kZXggKz0gdGhpcy5sYXN0SW5kZXg7XG4gICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHBhcnNlR2FtZVRyZWUgPSBmdW5jdGlvbiAocHJvcGVydGllcykge1xuICAgICAgICAgICAgdmFyIHNlcXVlbmNlID0gW107XG5cbiAgICAgICAgICAgIGlmICghdGVzdC5jYWxsKE9wZW5QYXJlbikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdoaWxlICh0ZXN0LmNhbGwoU2VtaWNvbG9uKSkge1xuICAgICAgICAgICAgICAgIHZhciBub2RlID0ge307XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWRlbnQgPSBleGVjLmNhbGwoUHJvcElkZW50KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaWRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkZW50ID0gaWRlbnRbMV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLmhhc093blByb3BlcnR5KGlkZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiUHJvcGVydHkgXCIraWRlbnQrXCIgYWxyZWFkeSBleGlzdHNcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVzID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ID0gZXhlYy5jYWxsKFByb3BWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodikgeyB2YWx1ZXMucHVzaCh2WzFdKTsgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghdmFsdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiUHJvcFZhbHVlIG9mIFwiK2lkZW50K1wiIGlzIG1pc3NpbmdcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBub2RlW2lkZW50XSA9IHZhbHVlcztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyB8fCBjcmVhdGVQcm9wZXJ0aWVzKG5vZGUpO1xuICAgICAgICAgICAgICAgIG5vZGUgPSBwYXJzZVByb3BlcnRpZXMobm9kZSwgcHJvcGVydGllcyk7XG5cbiAgICAgICAgICAgICAgICBzZXF1ZW5jZS5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXNlcXVlbmNlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIkdhbWVUcmVlIGRvZXMgbm90IGNvbnRhaW4gYW55IE5vZGVzXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSBbXTtcblxuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBwYXJzZUdhbWVUcmVlKHByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZCkgeyBjaGlsZHJlbi5wdXNoKGNoaWxkKTsgfVxuICAgICAgICAgICAgICAgICAgICAgIGVsc2UgeyBicmVhazsgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRlc3QuY2FsbChDbG9zZVBhcmVuKSkgeyAvLyBlbmQgb2YgR2FtZVRyZWVcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJVbmV4cGVjdGVkIHRva2VuIFwiK3NvdXJjZS5jaGFyQXQobGFzdEluZGV4KSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vICg7YSg7YikpID0+ICg7YTtiKVxuICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHNlcXVlbmNlID0gc2VxdWVuY2UuY29uY2F0KGNoaWxkcmVuWzBdWzBdKTtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IGNoaWxkcmVuWzBdWzFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gW3NlcXVlbmNlLCBjaGlsZHJlbl07XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGNyZWF0ZVByb3BlcnRpZXMgPSBmdW5jdGlvbiAocm9vdCkge1xuICAgICAgICAgICAgdmFyIFNHRk51bWJlciA9IFNHRkdyb3ZlLmZpbGVGb3JtYXQoeyBGRjogNCB9KS5UeXBlcy5OdW1iZXI7XG5cbiAgICAgICAgICAgIHZhciBmaWxlRm9ybWF0ID0gU0dGR3JvdmUuZmlsZUZvcm1hdCh7XG4gICAgICAgICAgICAgICAgRkYgOiBTR0ZOdW1iZXIucGFyc2Uocm9vdC5GRiB8fCBbXSkgfHwgMSxcbiAgICAgICAgICAgICAgICBHTSA6IFNHRk51bWJlci5wYXJzZShyb290LkdNIHx8IFtdKSB8fCAxXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbGVGb3JtYXQucHJvcGVydGllcygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBwYXJzZVByb3BlcnRpZXMgPSBmdW5jdGlvbiAobm9kZSwgcHJvcGVydGllcykge1xuICAgICAgICAgICAgdmFyIG4gPSB7fTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaWRlbnQgaW4gbm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLmhhc093blByb3BlcnR5KGlkZW50KSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcCA9IHByb3BlcnRpZXMucGFyc2UoaWRlbnQsIG5vZGVbaWRlbnRdKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIkludmFsaWQgUHJvcElkZW50IFwiK2lkZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChuLmhhc093blByb3BlcnR5KHByb3BbMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJQcm9wZXJ0eSBcIitwcm9wWzBdK1wiIGFscmVhZHkgZXhpc3RzXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHByb3BbMV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0ciA9IGlkZW50K1wiW1wiK25vZGVbaWRlbnRdLmpvaW4oXCJdW1wiKStcIl1cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIkludmFsaWQgUHJvcFZhbHVlIFwiK3N0cik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBuW3Byb3BbMF1dID0gcHJvcFsxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBuO1xuICAgICAgICB9O1xuIFxuICAgICAgICAvLyBDb3BpZWQgYW5kIHJlYXJyYW5nZWQgZnJvbSBqc29uMi5qcyBzbyB0aGF0IHdlIGNhbiBwYXNzIHRoZSBzYW1lXG4gICAgICAgIC8vIGNhbGxiYWNrIHRvIGJvdGggb2YgU0dGLnBhcnNlIGFuZCBKU09OLnBhcnNlXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kb3VnbGFzY3JvY2tmb3JkL0pTT04tanMvYmxvYi9tYXN0ZXIvanNvbjIuanNcbiAgICAgICAgdmFyIHdhbGsgPSBmdW5jdGlvbiAoaG9sZGVyLCBrZXkpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGhvbGRlcltrZXldO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgayBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ID0gd2Fsayh2YWx1ZSwgayk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVba10gPSB2O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHZhbHVlW2tdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV2aXZlci5jYWxsKGhvbGRlciwga2V5LCB2YWx1ZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0ZXh0LCByZXYpIHtcbiAgICAgICAgICAgIHZhciBjb2xsZWN0aW9uID0gW107XG5cbiAgICAgICAgICAgIHNvdXJjZSA9IFN0cmluZyh0ZXh0KTtcbiAgICAgICAgICAgIGxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICByZXZpdmVyID0gdHlwZW9mIHJldiA9PT0gXCJmdW5jdGlvblwiICYmIHJldjtcblxuICAgICAgICAgICAgdGVzdC5jYWxsKFdoaXRlc3BhY2VzKTtcblxuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2FtZVRyZWUgPSBwYXJzZUdhbWVUcmVlKCk7XG4gICAgICAgICAgICAgICAgaWYgKGdhbWVUcmVlKSB7IGNvbGxlY3Rpb24ucHVzaChnYW1lVHJlZSk7IH1cbiAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHsgYnJlYWs7IH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGxhc3RJbmRleCAhPT0gc291cmNlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIlVuZXhwZWN0ZWQgdG9rZW4gXCIrc291cmNlLmNoYXJBdChsYXN0SW5kZXgpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJldml2ZXIgPyB3YWxrKHsgXCJcIjogY29sbGVjdGlvbiB9LCBcIlwiKSA6IGNvbGxlY3Rpb247XG4gICAgICAgIH07XG4gICAgfSgpKTtcblxuICAgIFNHRkdyb3ZlLnN0cmluZ2lmeSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbiAgICAgICAgdmFyIHJlcGxhY2VyLCBzZWxlY3RlZCwgaW5kZW50LCBnYXA7XG5cbiAgICAgICAgdmFyIGNyZWF0ZVByb3BlcnRpZXMgPSBmdW5jdGlvbiAocm9vdCkge1xuICAgICAgICAgICAgdmFyIGZpbGVGb3JtYXQgPSBTR0ZHcm92ZS5maWxlRm9ybWF0KHtcbiAgICAgICAgICAgICAgICBGRiA6IHJvb3QuaGFzT3duUHJvcGVydHkoXCJGRlwiKSA/IHJvb3QuRkYgOiAxLFxuICAgICAgICAgICAgICAgIEdNIDogcm9vdC5oYXNPd25Qcm9wZXJ0eShcIkdNXCIpID8gcm9vdC5HTSA6IDFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGZpbGVGb3JtYXQucHJvcGVydGllcygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBmaW5hbGl6ZSA9IGZ1bmN0aW9uIChrZXksIGhvbGRlcikge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gaG9sZGVyW2tleV07XG4gICAgICAgICAgICB2YXIgaSwgaywgdjtcblxuICAgICAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiB2YWx1ZS50b1NHRiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b1NHRihrZXkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmVwbGFjZXIpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHJlcGxhY2VyLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF2YWx1ZSB8fCB0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICB2ID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHYgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKCBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgICAgICAgICB2W2ldID0gZmluYWxpemUoaSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHYgPSB7fTtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHNlbGVjdGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2W3NlbGVjdGVkW2ldXSA9IGZpbmFsaXplKHNlbGVjdGVkW2ldLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoayBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdltrXSA9IGZpbmFsaXplKGssIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHY7XG4gICAgICAgIH07XG4gXG4gICAgICAgIHZhciBzdHJpbmdpZnlHYW1lVHJlZSA9IGZ1bmN0aW9uIChnYW1lVHJlZSwgcHJvcGVydGllcykge1xuICAgICAgICAgICAgZ2FtZVRyZWUgPSBpc0FycmF5KGdhbWVUcmVlKSA/IGdhbWVUcmVlIDogW107XG5cbiAgICAgICAgICAgIHZhciBzZXF1ZW5jZSA9IGlzQXJyYXkoZ2FtZVRyZWVbMF0pID8gZ2FtZVRyZWVbMF0gOiBbXSxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IGlzQXJyYXkoZ2FtZVRyZWVbMV0pID8gZ2FtZVRyZWVbMV0gOiBbXTtcblxuICAgICAgICAgICAgLy8gKDthKDtiKSkgPT4gKDthO2IpXG4gICAgICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgc2VxdWVuY2UgPSBzZXF1ZW5jZS5jb25jYXQoaXNBcnJheShjaGlsZHJlblswXVswXSkgPyBjaGlsZHJlblswXVswXSA6IFtdKTtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IGlzQXJyYXkoY2hpbGRyZW5bMF1bMV0pID8gY2hpbGRyZW5bMF1bMV0gOiBbXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHRleHQgPSBcIlwiLFxuICAgICAgICAgICAgICAgIGxmID0gaW5kZW50ID8gXCJcXG5cIiA6IFwiXCIsXG4gICAgICAgICAgICAgICAgbWluZCA9IGdhcDtcblxuICAgICAgICAgICAgaWYgKHNlcXVlbmNlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRleHQgKz0gZ2FwK1wiKFwiK2xmOyAvLyBvcGVuIEdhbWVUcmVlXG4gICAgICAgICAgICAgICAgZ2FwICs9IGluZGVudDtcblxuICAgICAgICAgICAgICAgIHZhciBzZW1pY29sb24gPSBnYXArXCI7XCIsXG4gICAgICAgICAgICAgICAgICAgIHNwYWNlID0gZ2FwKyhpbmRlbnQgPyBcIiBcIiA6IFwiXCIpO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZXF1ZW5jZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IHNlcXVlbmNlW2ldICYmIHR5cGVvZiBzZXF1ZW5jZVtpXSA9PT0gXCJvYmplY3RcIiA/IHNlcXVlbmNlW2ldIDoge307XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJ0aWFsID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgfHwgY3JlYXRlUHJvcGVydGllcyhub2RlKTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpZGVudCBpbiBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5oYXNPd25Qcm9wZXJ0eShpZGVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVzID0gcHJvcGVydGllcy5zdHJpbmdpZnkoaWRlbnQsIG5vZGVbaWRlbnRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpYWwucHVzaChpZGVudCtcIltcIit2YWx1ZXMuam9pbihcIl1bXCIpK1wiXVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0ZXh0ICs9IHNlbWljb2xvbitwYXJ0aWFsLmpvaW4obGYrc3BhY2UpK2xmOyAvLyBhZGQgTm9kZVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dCArPSBzdHJpbmdpZnlHYW1lVHJlZShjaGlsZHJlbltqXSwgcHJvcGVydGllcyk7IC8vIGFkZCBHYW1lVHJlZVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRleHQgKz0gbWluZCtcIilcIitsZjsgLy8gY2xvc2UgR2FtZVRyZWVcbiAgICAgICAgICAgICAgICBnYXAgPSBtaW5kO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHJlcCwgc3BhY2UpIHtcbiAgICAgICAgICAgIHZhciB0ZXh0LCBpO1xuXG4gICAgICAgICAgICByZXBsYWNlciA9IG51bGw7XG4gICAgICAgICAgICBzZWxlY3RlZCA9IG51bGw7XG4gICAgICAgICAgICBpbmRlbnQgPSBcIlwiO1xuICAgICAgICAgICAgZ2FwID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKGlzQXJyYXkocmVwKSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHJlcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlcFtpXSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQucHVzaChyZXBbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHJlcCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgcmVwbGFjZXIgPSByZXA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChyZXApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJyZXBsYWNlciBtdXN0IGJlIGFycmF5IG9yIGZ1bmN0aW9uXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHNwYWNlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHNwYWNlOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50ICs9IFwiIFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBzcGFjZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIGluZGVudCA9IHNwYWNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb2xsZWN0aW9uID0gZmluYWxpemUoXCJcIiwgeyBcIlwiOiBjb2xsZWN0aW9uIH0pO1xuXG4gICAgICAgICAgICBpZiAoaXNBcnJheShjb2xsZWN0aW9uKSkge1xuICAgICAgICAgICAgICAgIHRleHQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb2xsZWN0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQgKz0gc3RyaW5naWZ5R2FtZVRyZWUoY29sbGVjdGlvbltpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfTtcbiAgICB9KCkpO1xuXG4gICAgU0dGR3JvdmUuZmlsZUZvcm1hdCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpc0ludGVnZXIgPSBTR0ZHcm92ZS5VdGlsLmlzSW50ZWdlcixcbiAgICAgICAgICAgIEZGID0ge307XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2ZXJzaW9uLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgdmVyc2lvbiA9IHZlcnNpb24gfHwge307XG5cbiAgICAgICAgICAgIHZhciBmZiA9IHZlcnNpb24uRkYsXG4gICAgICAgICAgICAgICAgZ20gPSB2ZXJzaW9uLkdNO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNJbnRlZ2VyKGZmKSAmJiBmZiA+IDAgJiYgRkZbZmZdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0ludGVnZXIoZ20pICYmIGdtID4gMCAmJiBGRltmZl0uR01bZ21dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gRkZbZmZdLkdNW2dtXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRkZbZmZdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gRkY7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBmaWxlRm9ybWF0ID0ge307XG4gICAgICAgICAgICAgICAgZmlsZUZvcm1hdCA9IGNhbGxiYWNrLmNhbGwoZmlsZUZvcm1hdCwgRkYpIHx8IGZpbGVGb3JtYXQ7XG5cbiAgICAgICAgICAgIGlmIChmZiAmJiBnbSkge1xuICAgICAgICAgICAgICAgIEZGW2ZmXS5HTVtnbV0gPSBmaWxlRm9ybWF0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZmYpIHtcbiAgICAgICAgICAgICAgICBmaWxlRm9ybWF0LkdNID0gZmlsZUZvcm1hdC5HTSB8fCB7fTtcbiAgICAgICAgICAgICAgICBGRltmZl0gPSBmaWxlRm9ybWF0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgRkYgPSBmaWxlRm9ybWF0O1xuICAgICAgICAgICAgfVxuIFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgIH0oKSk7XG5cbiAgICBTR0ZHcm92ZS5maWxlRm9ybWF0KHt9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBUeXBlcyA9IHt9O1xuXG4gICAgICAgIFR5cGVzLnNjYWxhciA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICAgICAgICBhcmdzID0gYXJncyB8fCB7fTtcblxuICAgICAgICAgICAgdmFyIHRoYXQgPSB7fTtcblxuICAgICAgICAgICAgdmFyIGxpa2UgPSBhcmdzLmxpa2UgfHwgeyB0ZXN0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9IH07XG4gICAgICAgICAgICB2YXIgcGFyc2UgPSBhcmdzLnBhcnNlIHx8IGZ1bmN0aW9uICh2KSB7IHJldHVybiB2OyB9O1xuXG4gICAgICAgICAgICB2YXIgaXNhID0gYXJncy5pc2EgfHwgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHR5cGVvZiB2ID09PSBcInN0cmluZ1wiICYmIGxpa2UudGVzdCh2KTsgfTtcbiAgICAgICAgICAgIHZhciBzdHJpbmdpZnkgPSBhcmdzLnN0cmluZ2lmeSB8fCBTdHJpbmc7XG5cbiAgICAgICAgICAgIHRoYXQucGFyc2UgPSBmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDEgJiYgbGlrZS50ZXN0KHZhbHVlc1swXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlKHZhbHVlc1swXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhhdC5zdHJpbmdpZnkgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNhKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3N0cmluZ2lmeSh2YWx1ZSldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB0aGF0O1xuICAgICAgICB9O1xuXG4gICAgICAgIFR5cGVzLlVua25vd24gPSB7XG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHZhbHVlcykge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtpXSA9IHZhbHVlc1tpXS5yZXBsYWNlKC9cXFxcXFxdL2csIFwiXVwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHZhbHVlcykge1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlcykpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlc1tpXSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtpXSA9IHZhbHVlc1tpXS5yZXBsYWNlKC9cXF0vZywgXCJcXFxcXVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuVHlwZXMgPSBUeXBlcztcblxuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBmdW5jdGlvbiAodCwgYXJncykge1xuICAgICAgICAgICAgdCA9IHQgfHwgVHlwZXM7XG4gICAgICAgICAgICBhcmdzID0gYXJncyB8fCB7fTtcblxuICAgICAgICAgICAgdmFyIHRoYXQgPSB7XG4gICAgICAgICAgICAgICAgdHlwZU9mICAgICAgOiBhcmdzLnR5cGVPZiAgICAgIHx8IHt9LFxuICAgICAgICAgICAgICAgIGRlZmF1bHRUeXBlIDogYXJncy5kZWZhdWx0VHlwZSB8fCB0LlVua25vd24sXG4gICAgICAgICAgICAgICAgaWRlbnRpZmllcnMgOiBhcmdzLmlkZW50aWZpZXJzIHx8IHsgdGVzdDogZnVuY3Rpb24gKCkgeyByZXR1cm4gZmFsc2U7IH0gfSxcbiAgICAgICAgICAgICAgICByZXBsYWNlciAgICA6IGFyZ3MucmVwbGFjZXJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoYXQubWVyZ2UgPSBmdW5jdGlvbiAob3RoZXIpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpZGVudCBpbiBvdGhlcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAob3RoZXIuaGFzT3duUHJvcGVydHkoaWRlbnQpICYmIG90aGVyW2lkZW50XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50eXBlT2ZbaWRlbnRdID0gb3RoZXJbaWRlbnRdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhhdC5wYXJzZSA9IGZ1bmN0aW9uIChpZGVudCwgdmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVwbGFjZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWRlbnQgPSB0aGlzLnJlcGxhY2VyLmNhbGwobnVsbCwgaWRlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pZGVudGlmaWVycy50ZXN0KGlkZW50KSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdHlwZSA9IHRoaXMudHlwZU9mW2lkZW50XSB8fCB0aGlzLmRlZmF1bHRUeXBlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2lkZW50LCB0eXBlLnBhcnNlKHZhbHVlcyldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoYXQuc3RyaW5naWZ5ID0gZnVuY3Rpb24gKGlkZW50LCB2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pZGVudGlmaWVycy50ZXN0KGlkZW50KSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdHlwZSA9IHRoaXMudHlwZU9mW2lkZW50XSB8fCB0aGlzLmRlZmF1bHRUeXBlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHlwZS5zdHJpbmdpZnkodmFsdWVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gdGhhdDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm47XG4gICAgfSk7XG5cbiAgICAvLyBGaWxlIEZvcm1hdCAoO0ZGWzRdKVxuICAgIC8vIGh0dHA6Ly93d3cucmVkLWJlYW4uY29tL3NnZi9zZ2Y0Lmh0bWxcbiAgICAvLyBodHRwOi8vd3d3LnJlZC1iZWFuLmNvbS9zZ2YvcHJvcGVydGllcy5odG1sXG4gICAgU0dGR3JvdmUuZmlsZUZvcm1hdCh7IEZGOiA0IH0sIGZ1bmN0aW9uIChGRikge1xuICAgICAgICB2YXIgVHlwZXMgPSBPYmplY3QuY3JlYXRlKEZGLlR5cGVzKTtcbiAgICAgICAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG4gICAgICAgIFR5cGVzLmNvbXBvc2UgPSBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiBsZWZ0ICYmIHJpZ2h0ICYmIHtcbiAgICAgICAgICAgICAgICBlc2NhcGU6IGZ1bmN0aW9uICh2KSB7IHJldHVybiB2LnJlcGxhY2UoLzovZywgXCJcXFxcOlwiKTsgfSxcbiAgICAgICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHYgPSAvXigoPzpcXFxcW1xcU1xcc118W146XFxcXF0rKSopOigoPzpcXFxcW1xcU1xcc118W146XFxcXF0rKSopJC8uZXhlYyh2YWx1ZXNbMF0pIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsID0gdiAmJiBsZWZ0LnBhcnNlKFt2WzFdXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgciA9IHYgJiYgcmlnaHQucGFyc2UoW3ZbMl1dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsICE9PSB1bmRlZmluZWQgJiYgciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtsLCByXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3RyaW5naWZ5OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGwgPSBsZWZ0LnN0cmluZ2lmeSh2YWx1ZVswXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgciA9IHJpZ2h0LnN0cmluZ2lmeSh2YWx1ZVsxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbCAmJiByICYmIFt0aGlzLmVzY2FwZShsWzBdKStcIjpcIit0aGlzLmVzY2FwZShyWzBdKV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIFR5cGVzLmxpc3RPZiA9IGZ1bmN0aW9uIChzY2FsYXIsIGFyZ3MpIHtcbiAgICAgICAgICAgIGFyZ3MgPSBhcmdzIHx8IHt9O1xuXG4gICAgICAgICAgICByZXR1cm4gc2NhbGFyICYmIHtcbiAgICAgICAgICAgICAgICBjYW5CZUVtcHR5OiBhcmdzLmNhbkJlRW1wdHksXG4gICAgICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID09PSAxICYmIHZhbHVlc1swXSA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FuQmVFbXB0eSA/IHJlc3VsdCA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbaV0gPSBzY2FsYXIucGFyc2UoW3ZhbHVlc1tpXV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdFtpXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzQXJyYXkodmFsdWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCF2YWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jYW5CZUVtcHR5ID8gW1wiXCJdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtpXSA9IHNjYWxhci5zdHJpbmdpZnkodmFsdWVzW2ldKVswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggcmVzdWx0W2ldID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRvRWxpc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG90aGVyID0gT2JqZWN0LmNyZWF0ZSh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgb3RoZXIuY2FuQmVFbXB0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvdGhlcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIFR5cGVzLmVsaXN0T2YgPSBmdW5jdGlvbiAoc2NhbGFyKSB7XG4gICAgICAgICAgICByZXR1cm4gVHlwZXMubGlzdE9mKHNjYWxhciwge1xuICAgICAgICAgICAgICAgIGNhbkJlRW1wdHk6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIFR5cGVzLm9yID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhICYmIGIgJiYge1xuICAgICAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBhLnBhcnNlKHZhbHVlcyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgIT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGIucGFyc2UodmFsdWVzKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhLnN0cmluZ2lmeSh2YWx1ZSkgfHwgYi5zdHJpbmdpZnkodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gTnVtYmVyID0gW1wiK1wifFwiLVwiXSBEaWdpdCB7RGlnaXR9XG4gICAgICAgIFR5cGVzLk51bWJlciA9IFR5cGVzLnNjYWxhcih7XG4gICAgICAgICAgICBsaWtlOiAvXlsrLV0/XFxkKyQvLFxuICAgICAgICAgICAgaXNhOiBTR0ZHcm92ZS5VdGlsLmlzSW50ZWdlcixcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodikgeyByZXR1cm4gcGFyc2VJbnQodiwgMTApOyB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIE5vbmUgPSBcIlwiXG4gICAgICAgIFR5cGVzLk5vbmUgPSBUeXBlcy5zY2FsYXIoe1xuICAgICAgICAgICAgbGlrZTogeyB0ZXN0OiBmdW5jdGlvbiAodikgeyByZXR1cm4gdiA9PT0gXCJcIjsgfSB9LFxuICAgICAgICAgICAgaXNhOiBmdW5jdGlvbiAodikgeyByZXR1cm4gdiA9PT0gbnVsbDsgfSxcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAoKSB7IHJldHVybiBudWxsOyB9LFxuICAgICAgICAgICAgc3RyaW5naWZ5OiBmdW5jdGlvbiAoKSB7IHJldHVybiBcIlwiOyB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFJlYWwgPSBOdW1iZXIgW1wiLlwiIERpZ2l0IHsgRGlnaXQgfV1cbiAgICAgICAgVHlwZXMuUmVhbCA9IFR5cGVzLnNjYWxhcih7XG4gICAgICAgICAgICBsaWtlOiAvXlsrLV0/XFxkKyg/OlxcLlxcZCspPyQvLFxuICAgICAgICAgICAgaXNhOiBTR0ZHcm92ZS5VdGlsLmlzTnVtYmVyLFxuICAgICAgICAgICAgcGFyc2U6IHBhcnNlRmxvYXRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRG91YmxlID0gKFwiMVwiIHwgXCIyXCIpXG4gICAgICAgIFR5cGVzLkRvdWJsZSA9IFR5cGVzLnNjYWxhcih7XG4gICAgICAgICAgICBsaWtlOiAvXlsxMl0kLyxcbiAgICAgICAgICAgIGlzYTogZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHYgPT09IDEgfHwgdiA9PT0gMjsgfSxcbiAgICAgICAgICAgIHBhcnNlOiBwYXJzZUludFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBDb2xvciA9IChcIkJcIiB8IFwiV1wiKVxuICAgICAgICBUeXBlcy5Db2xvciA9IFR5cGVzLnNjYWxhcih7XG4gICAgICAgICAgICBsaWtlOiAvXltCV10kL1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUZXh0ID0geyBhbnkgY2hhcmFjdGVyIH1cbiAgICAgICAgVHlwZXMuVGV4dCA9IFR5cGVzLnNjYWxhcih7XG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLlxuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgc29mdCBsaW5lYnJlYWtzXG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2UoL1xcXFwoPzpcXG5cXHI/fFxcclxcbj8pL2csIFwiXCIpLlxuICAgICAgICAgICAgICAgICAgICAvLyBjb252ZXJ0IHdoaXRlIHNwYWNlcyBvdGhlciB0aGFuIGxpbmVicmVha3MgdG8gc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZSgvW15cXFNcXG5cXHJdL2csIFwiIFwiKS5cbiAgICAgICAgICAgICAgICAgICAgLy8gaW5zZXJ0IGVzY2FwZWQgY2hhcnMgdmVyYmF0aW1cbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZSgvXFxcXChbXFxTXFxzXSkvZywgXCIkMVwiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC8oW1xcXVxcXFxdKS9nLCBcIlxcXFwkMVwiKTsgLy8gZXNjYXBlIFwiXVwiIGFuZCBcIlxcXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gU2ltcGxlVGV4dCA9IHsgYW55IGNoYXJhY3RlciB9XG4gICAgICAgIFR5cGVzLlNpbXBsZVRleHQgPSBUeXBlcy5zY2FsYXIoe1xuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5cbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHNvZnQgbGluZWJyZWFrc1xuICAgICAgICAgICAgICAgICAgICByZXBsYWNlKC9cXFxcKD86XFxuXFxyP3xcXHJcXG4/KS9nLCBcIlwiKS5cbiAgICAgICAgICAgICAgICAgICAgLy8gY29udmVydCB3aGl0ZSBzcGFjZXMgb3RoZXIgdGhhbiBzcGFjZSB0byBzcGFjZSBldmVuIGlmIGl0J3MgZXNjYXBlZFxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlKC9cXFxcP1teXFxTIF0vZywgXCIgXCIpLlxuICAgICAgICAgICAgICAgICAgICAvLyBpbnNlcnQgZXNjYXBlZCBjaGFycyB2ZXJiYXRpbVxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlKC9cXFxcKFtcXFNcXHNdKS9nLCBcIiQxXCIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoLyhbXFxdXFxcXF0pL2csIFwiXFxcXCQxXCIpOyAvLyBlc2NhcGUgXCJdXCIgYW5kIFwiXFxcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLlR5cGVzID0gVHlwZXM7XG5cbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHQgPSB0IHx8IFR5cGVzO1xuXG4gICAgICAgICAgICByZXR1cm4gRkYucHJvcGVydGllcyh0LCB7XG4gICAgICAgICAgICAgICAgaWRlbnRpZmllcnM6IC9eW0EtWl0rJC8sXG4gICAgICAgICAgICAgICAgdHlwZU9mOiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1vdmUgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICBCICA6IHQuTW92ZSxcbiAgICAgICAgICAgICAgICAgICAgS08gOiB0Lk5vbmUsXG4gICAgICAgICAgICAgICAgICAgIE1OIDogdC5OdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIFcgIDogdC5Nb3ZlLFxuICAgICAgICAgICAgICAgICAgICAvLyBTZXR1cCBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgIEFCIDogdC5saXN0T2ZTdG9uZSB8fCB0Lmxpc3RPZih0LlN0b25lKSxcbiAgICAgICAgICAgICAgICAgICAgQUUgOiB0Lmxpc3RPZlBvaW50LFxuICAgICAgICAgICAgICAgICAgICBBVyA6IHQubGlzdE9mU3RvbmUgfHwgdC5saXN0T2YodC5TdG9uZSksXG4gICAgICAgICAgICAgICAgICAgIFBMIDogdC5Db2xvcixcbiAgICAgICAgICAgICAgICAgICAgLy8gTm9kZSBhbm5vdGF0aW9uIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgQyAgOiB0LlRleHQsXG4gICAgICAgICAgICAgICAgICAgIERNIDogdC5Eb3VibGUsXG4gICAgICAgICAgICAgICAgICAgIEdCIDogdC5Eb3VibGUsXG4gICAgICAgICAgICAgICAgICAgIEdXIDogdC5Eb3VibGUsXG4gICAgICAgICAgICAgICAgICAgIEhPIDogdC5Eb3VibGUsXG4gICAgICAgICAgICAgICAgICAgIE4gIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBVQyA6IHQuRG91YmxlLFxuICAgICAgICAgICAgICAgICAgICBWICA6IHQuUmVhbCxcbiAgICAgICAgICAgICAgICAgICAgLy8gTW92ZSBhbm5vdGF0aW9uIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgQk0gOiB0LkRvdWJsZSxcbiAgICAgICAgICAgICAgICAgICAgRE8gOiB0Lk5vbmUsXG4gICAgICAgICAgICAgICAgICAgIElUIDogdC5Ob25lLFxuICAgICAgICAgICAgICAgICAgICBURSA6IHQuRG91YmxlLFxuICAgICAgICAgICAgICAgICAgICAvLyBNYXJrdXAgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICBBUiA6IHQubGlzdE9mKHQuY29tcG9zZSh0LlBvaW50LCB0LlBvaW50KSksXG4gICAgICAgICAgICAgICAgICAgIENSIDogdC5saXN0T2ZQb2ludCxcbiAgICAgICAgICAgICAgICAgICAgREQgOiB0LmVsaXN0T2ZQb2ludCxcbiAgICAgICAgICAgICAgICAgICAgTEIgOiB0Lmxpc3RPZih0LmNvbXBvc2UodC5Qb2ludCwgdC5TaW1wbGVUZXh0KSksXG4gICAgICAgICAgICAgICAgICAgIExOIDogdC5saXN0T2YodC5jb21wb3NlKHQuUG9pbnQsIHQuUG9pbnQpKSxcbiAgICAgICAgICAgICAgICAgICAgTUEgOiB0Lmxpc3RPZlBvaW50LFxuICAgICAgICAgICAgICAgICAgICBTTCA6IHQubGlzdE9mUG9pbnQsXG4gICAgICAgICAgICAgICAgICAgIFNRIDogdC5saXN0T2ZQb2ludCxcbiAgICAgICAgICAgICAgICAgICAgVFIgOiB0Lmxpc3RPZlBvaW50LFxuICAgICAgICAgICAgICAgICAgICAvLyBSb290IHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgQVAgOiB0LmNvbXBvc2UodC5TaW1wbGVUZXh0LCB0LlNpbXBsZVRleHQpLFxuICAgICAgICAgICAgICAgICAgICBDQSA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgRkYgOiB0Lk51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgR00gOiB0Lk51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgU1QgOiB0Lk51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgU1ogOiB0Lm9yKHQuTnVtYmVyLCB0LmNvbXBvc2UodC5OdW1iZXIsIHQuTnVtYmVyKSksXG4gICAgICAgICAgICAgICAgICAgIC8vIEdhbWUgaW5mbyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgIEFOIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBCUiA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgQlQgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIENQIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBEVCA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgRVYgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIEdOIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBHQyA6IHQuVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgT04gOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIE9UIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBQQiA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgUEMgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIFBXIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBSRSA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgUk8gOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIFJVIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBTTyA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgVE0gOiB0LlJlYWwsXG4gICAgICAgICAgICAgICAgICAgIFVTIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBXUiA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgV1QgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIC8vIFRpbWluZyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgIEJMIDogdC5SZWFsLFxuICAgICAgICAgICAgICAgICAgICBPQiA6IHQuTnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBPVyA6IHQuTnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBXTCA6IHQuUmVhbCxcbiAgICAgICAgICAgICAgICAgICAgLy8gTWlzY2VsbGFuZW91cyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgIEZHIDogdC5vcih0Lk5vbmUsIHQuY29tcG9zZSh0Lk51bWJlciwgdC5TaW1wbGVUZXh0KSksXG4gICAgICAgICAgICAgICAgICAgIFBNIDogdC5OdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIFZNIDogdC5lbGlzdE9mUG9pbnRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm47XG4gICAgfSk7XG5cbiAgICAvLyBHbyAoO0ZGWzRdR01bMV0pIHNwZWNpZmljIHByb3BlcnRpZXNcbiAgICAvLyBodHRwOi8vd3d3LnJlZC1iZWFuLmNvbS9zZ2YvZ28uaHRtbFxuICAgIFNHRkdyb3ZlLmZpbGVGb3JtYXQoeyBGRjogNCwgR006IDEgfSwgZnVuY3Rpb24gKEZGKSB7XG4gICAgICAgIHZhciBUeXBlcyA9IE9iamVjdC5jcmVhdGUoRkZbNF0uVHlwZXMpO1xuXG4gICAgICAgIHZhciBleHBhbmRQb2ludExpc3QgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNvb3JkID0gXCJhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5elwiO1xuICAgICAgICAgICAgICAgIGNvb3JkICs9IGNvb3JkLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAocDEsIHAyKSB7XG4gICAgICAgICAgICAgICAgdmFyIHgxID0gY29vcmQuaW5kZXhPZihwMS5jaGFyQXQoMCkpLFxuICAgICAgICAgICAgICAgICAgICB5MSA9IGNvb3JkLmluZGV4T2YocDEuY2hhckF0KDEpKSxcbiAgICAgICAgICAgICAgICAgICAgeDIgPSBjb29yZC5pbmRleE9mKHAyLmNoYXJBdCgwKSksXG4gICAgICAgICAgICAgICAgICAgIHkyID0gY29vcmQuaW5kZXhPZihwMi5jaGFyQXQoMSkpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGg7IFxuICAgICAgICAgICAgICAgIGlmICh4MSA+IHgyKSB7XG4gICAgICAgICAgICAgICAgICAgIGggPSB4MTsgeDEgPSB4MjsgeDIgPSBoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoeTEgPiB5Mikge1xuICAgICAgICAgICAgICAgICAgICBoID0geTE7IHkxID0geTI7IHkyID0gaDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgcG9pbnRzID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeSA9IHkxOyB5IDw9IHkyOyB5KyspIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IHgxOyB4IDw9IHgyOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNvb3JkLmNoYXJBdCh4KStjb29yZC5jaGFyQXQoeSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvaW50cztcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0oKSk7XG5cbiAgICAgICAgVHlwZXMuUG9pbnQgPSBUeXBlcy5zY2FsYXIoe1xuICAgICAgICAgICAgbGlrZTogL15bYS16QS1aXXsyfSQvXG4gICAgICAgIH0pO1xuICBcbiAgICAgICAgVHlwZXMuU3RvbmUgPSBUeXBlcy5Qb2ludDtcbiAgICAgICAgVHlwZXMuTW92ZSAgPSBUeXBlcy5vcihUeXBlcy5Ob25lLCBUeXBlcy5Qb2ludCk7XG5cbiAgICAgICAgVHlwZXMubGlzdE9mUG9pbnQgPSAoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHZhciBsaXN0T2ZQb2ludCA9IHQubGlzdE9mKHQub3IoXG4gICAgICAgICAgICAgICAgdC5Qb2ludCxcbiAgICAgICAgICAgICAgICB0LnNjYWxhcih7XG4gICAgICAgICAgICAgICAgICAgIGxpa2U6IC9eW2EtekEtWl17Mn06W2EtekEtWl17Mn0kLyxcbiAgICAgICAgICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlY3QgPSB2YWx1ZS5zcGxpdChcIjpcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXhwYW5kUG9pbnRMaXN0KHJlY3RbMF0sIHJlY3RbMV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICkpO1xuXG4gICAgICAgICAgICB2YXIgcGFyc2UgPSBsaXN0T2ZQb2ludC5wYXJzZTtcbiAgICAgICAgICAgIHZhciBhcnJheSA9IFtdO1xuXG4gICAgICAgICAgICBsaXN0T2ZQb2ludC5wYXJzZSA9IGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gcGFyc2UuY2FsbCh0aGlzLCB2YWx1ZXMpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgJiYgYXJyYXkuY29uY2F0LmFwcGx5KGFycmF5LCByZXN1bHQpOyAvLyBmbGF0dGVuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gbGlzdE9mUG9pbnQ7XG4gICAgICAgIH0oVHlwZXMpKTtcblxuICAgICAgICBUeXBlcy5lbGlzdE9mUG9pbnQgPSBUeXBlcy5saXN0T2ZQb2ludC50b0VsaXN0KCk7XG5cbiAgICAgICAgVHlwZXMubGlzdE9mU3RvbmUgID0gVHlwZXMubGlzdE9mUG9pbnQ7XG4gICAgICAgIFR5cGVzLmVsaXN0T2ZTdG9uZSA9IFR5cGVzLmVsaXN0T2ZQb2ludDtcbiAgICBcbiAgICAgICAgdGhpcy5UeXBlcyA9IFR5cGVzO1xuXG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICB0ID0gdCB8fCBUeXBlcztcblxuICAgICAgICAgICAgdmFyIHRoYXQgPSBGRls0XS5wcm9wZXJ0aWVzKHQpO1xuXG4gICAgICAgICAgICB0aGF0Lm1lcmdlKHtcbiAgICAgICAgICAgICAgICBIQSA6IHQuTnVtYmVyLFxuICAgICAgICAgICAgICAgIEtNIDogdC5SZWFsLFxuICAgICAgICAgICAgICAgIFRCIDogdC5lbGlzdE9mUG9pbnQsXG4gICAgICAgICAgICAgICAgVFcgOiB0LmVsaXN0T2ZQb2ludFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGF0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybjtcbiAgICB9KTtcblxuICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IFNHRkdyb3ZlOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHdpbmRvdy5TR0ZHcm92ZSA9IFNHRkdyb3ZlO1xuICAgIH1cblxufSgpKTtcblxuIiwiaW1wb3J0IEJvYXJkU2VydmljZSBmcm9tIFwiLi9ib2FyZC5zZXJ2aWNlXCI7XG5pbXBvcnQgS2lmdVNlcnZpY2UgZnJvbSBcIi4va2lmdS5zZXJ2aWNlXCI7XG5pbXBvcnQgUnVsZVNlcnZpY2UgZnJvbSBcIi4vcnVsZS5zZXJ2aWNlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IEtpZnVTZXJ2aWNlOyIsImltcG9ydCAqIGFzIHNnZmdyb3ZlIGZyb20gJ3NnZmdyb3ZlJ1xuaW1wb3J0IHsgQkxBQ0ssIFdISVRFIH0gZnJvbSAnLi9tb2RlbHMnO1xuY2xhc3MgS2lmdVNlcnZpY2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgcmVhZChzdmcpIHtcbiAgICAgICAgY29uc3QgW1tbbWV0YSwgLi4uZ2FtZV1dXSA9IHNnZmdyb3ZlLnBhcnNlKHN2Zyk7XG4gICAgICAgIGNvbnN0IHsgUEIsIFBXLCBCUiwgV1IsIFNaLCBLTSwgUlUsIEdOLCBDUCwgVVMsIEFOLCAuLi5yZXN0IH0gPSBtZXRhO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGxheWVyczogW1xuICAgICAgICAgICAgICAgIHsgY29sb3I6IEJMQUNLLCBuYW1lOiBQQiwgbGV2ZWw6IEJSIH0sXG4gICAgICAgICAgICAgICAgeyBjb2xvcjogV0hJVEUsIG5hbWU6IFBXLCBsZXZlbDogV1IgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBpbmZvOiB7XG4gICAgICAgICAgICAgICAgc2l6ZTogU1osXG4gICAgICAgICAgICAgICAga29taTogS00sXG4gICAgICAgICAgICAgICAgcnVsZTogUlUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWV0YToge1xuICAgICAgICAgICAgICAgIG5hbWU6IEdOLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogQ1AsXG4gICAgICAgICAgICAgICAgc2NyaWJlOiBVUyxcbiAgICAgICAgICAgICAgICBjb21tZW50YXRvcjogQU5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN0LFxuICAgICAgICAgICAgZ2FtZVxuICAgICAgICB9O1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgS2lmdVNlcnZpY2U7IiwiZXhwb3J0IGNvbnN0IEFQUE5BTUUgPSBcInRlbmdlbi5qc1wiO1xuZXhwb3J0IGNvbnN0IFZFUiA9IFwiMC4xXCI7XG5cbmV4cG9ydCBjb25zdCBFTVBUWTogYW55ID0gbnVsbDtcbmV4cG9ydCBjb25zdCBCTEFDSyA9IFwiYmxhY2tcIjtcbmV4cG9ydCBjb25zdCBXSElURSA9IFwid2hpdGVcIjtcbmV4cG9ydCBjb25zdCBQQVNTID0gXCJwYXNzXCI7XG5leHBvcnQgY29uc3QgVU5ETyA9IFwidW5kb1wiO1xuZXhwb3J0IGNvbnN0IEFCQU5ET04gPSBcImFiYW5kb25cIjtcbmV4cG9ydCBjb25zdCBORVhUID0gXCJuZXh0XCI7XG5leHBvcnQgY29uc3QgUFJFViA9IFwicHJldlwiO1xuZXhwb3J0IGNvbnN0IEVORCA9IFwiZW5kX2dhbWVcIjtcbmV4cG9ydCBjb25zdCBTVEFSVCA9IFwic3RhcnRfZ2FtZVwiO1xuXG5leHBvcnQgZW51bSBTdGF0ZSB7XG4gIEJMQUNLID0gJ2JsYWNrJyxcbiAgV0hJVEUgPSAnd2hpdGUnLFxuICBLTyA9ICdrbycsXG59IFxuZXhwb3J0IGludGVyZmFjZSBNb3ZlIHtcbiAgc3RhdGU6IFN0YXRlIHwgbnVsbCxcbiAgdXBkYXRlZF9hdD86IERhdGUsXG4gIG9yZGVyOiBudW1iZXIsIFxuICB4Om51bWJlclxuICB5Om51bWJlcixcbiAgbG9nPzogTW92ZVtdLFxuICBjYXB0dXJlZD86IFtdXG59XG5cbi8qXG5leHBvcnQgY29uc3QgYWxwaGFiZXQgPSAocyA9IDI2KSA9PiB7XG4gIHJldHVybiBuZXcgQXJyYXkocykuZmlsbCgxKS5tYXAoKF86YW55LCBpOm51bWJlcikgPT4gU3RyaW5nLmZyb21DaGFyQ29kZSg5NyArIGkpKTtcbn07XG5cbmV4cG9ydCBjb25zdCBhMm4gPSAoYSA6IHN0cmluZykgPT4ge1xuICByZXR1cm4gYWxwaGFiZXQoKS5pbmRleE9mKGEpO1xufTtcbmV4cG9ydCBjb25zdCBuMmEgPSAobjogbnVtYmVyKSA9PiB7XG4gIHJldHVybiBhbHBoYWJldCgpW25dO1xufTtcblxuZXhwb3J0IGNvbnN0IHRvQ29vcmQgPSAobm9kZTogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9KSA9PiB7XG4gIGNvbnN0IHsgeCwgeSB9ID0gbm9kZTtcbiAgcmV0dXJuIG4yYSh4KSArIG4yYSh5KTtcbn07XG5leHBvcnQgY29uc3QgZnJvbVNHRkNvb3JkID0gKHNnZm5vZGU6IGFueSkgPT4ge1xuICBjb25zdCBtb3ZlID0gc2dmbm9kZS5CIHx8IHNnZm5vZGUuVztcbiAgaWYgKG1vdmUpIHtcbiAgICBjb25zdCBbeCwgeV0gPSBtb3ZlLnNwbGl0KFwiXCIpO1xuICAgIHJldHVybiB7IHg6IGEybih4KSwgeTogYTJuKHkpIH07XG4gIH1cbiAgcmV0dXJuIHsgeDogbnVsbCwgeTogbnVsbCB9O1xufTtcblxuZXhwb3J0IGludGVyZmFjZSBJdGVtIHtcbiAgaWQ/OiBhbnk7XG4gIGNyZWF0ZWRBdD86IERhdGUgfCBudWxsO1xuICB1cGRhdGVkQXQ/OiBEYXRlIHwgbnVsbDtcbiAgZGVsZXRlZEF0PzogRGF0ZSB8IG51bGw7XG4gIGF1dGhvcj86IFBsYXllcjtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQ29tbWVudCB7XG4gIG9yZGVyOiBudW1iZXI7XG4gIHRleHQ6IHN0cmluZztcbiAgdGltZT86IERhdGU7XG4gIG1vdmU/OiBhbnk7XG59XG5leHBvcnQgaW50ZXJmYWNlIEdhbWVTZXR0aW5ncyBleHRlbmRzIEl0ZW0ge1xuICB3aGl0ZTogUGxheWVyO1xuICBibGFjazogUGxheWVyO1xuICBzaXplOiBudW1iZXI7XG4gIHNjb3JlczogU2NvcmVCb2FyZDtcbiAgdGl0bGU/OiBzdHJpbmc7XG4gIGtvbWk/OiBudW1iZXI7XG4gIGNsb2NrPzogYW55O1xuICBib2FyZD86IGFueTtcbiAgZXZlbnQ/OiBzdHJpbmc7XG4gIHJvdW5kPzogbnVtYmVyO1xuICBkYXRlPzogRGF0ZTtcbiAgbG9jYXRpb24/OiBzdHJpbmc7XG4gIGNvbW1lbnRzPzogQ29tbWVudFtdO1xuICB0cmVlPzogYW55W107XG4gIG5lZWRDb25maXJtOiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdhbWVMaXN0SXRlbSB7XG4gIG5hbWU6IHN0cmluZztcbiAgdXBkYXRlZF9hdDogYW55O1xuICB0aW1lc3RhbXA6IG51bWJlcjtcbiAga2V5OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGxheWVyIGV4dGVuZHMgSXRlbSB7XG4gIG5hbWU6IHN0cmluZztcbiAgcmFuaz86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTY29yZUJvYXJkIGV4dGVuZHMgSXRlbSB7XG4gIGJsYWNrOiBTY29yZSB8IG51bGw7XG4gIHdoaXRlOiBTY29yZSB8IG51bGw7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2NvcmUgZXh0ZW5kcyBJdGVtIHtcbiAgY2FwdHVyZWQ/OiBudW1iZXI7XG4gIHRlcnJpdG9yeT86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNb3ZlIGV4dGVuZHMgSXRlbSB7XG4gIHg/OiBudW1iZXI7XG4gIHk/OiBudW1iZXI7XG4gIHBsYXllcjogYW55O1xuICBzdGF0ZTogYW55O1xuICBsZWFmcz86IE1vdmVbXTtcbiAgb3JkZXI/OiBudW1iZXI7XG4gIGluSGlzdG9yeT86IGJvb2xlYW47XG4gIGNhcHR1cmVkPzogTW92ZVtdO1xuICBwbGF5ZWQ6IGJvb2xlYW47XG4gIGNvbW1lbnRzPzogYW55W107XG4gIHRpbWU/OiBudW1iZXI7XG59XG4qLyJdLCJzb3VyY2VSb290IjoiIn0=