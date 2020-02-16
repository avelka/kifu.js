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

/***/ "./src/board.service.ts":
/*!******************************!*\
  !*** ./src/board.service.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = __webpack_require__(/*! ./models */ "./src/models.ts");
var rule_service_1 = __webpack_require__(/*! ./rule.service */ "./src/rule.service.ts");
var BoardService = /** @class */ (function () {
    function BoardService() {
        var _this = this;
        this.board = [];
        this.ruleService = new rule_service_1.default();
        this.history = [];
        this.createPoint = function (x, y, state) {
            if (state === void 0) { state = null; }
            return ({ state: state, order: 0 });
        };
        this.line = function (s) { return Array(s).fill(''); };
        this.at = function (x, y) { return _this.board[x][y]; };
    }
    BoardService.prototype.init = function (size) {
        var _this = this;
        this.history = [];
        this.board = this.line(size).map(function (_, x) { return _this.line(size); }).map(function (_, x) { return _.map(function (_, y) { return _this.createPoint(x, y); }); });
        return this;
    };
    BoardService.prototype.play = function (x, y, order) {
        if (order === void 0) { order = this.history.length; }
        var validState = this.ruleService.validate(this.board, {
            state: order % 2 ? models_1.State.WHITE : models_1.State.BLACK,
            order: order,
            x: x,
            y: y
        });
        if (validState) {
            this.board = validState;
            this.history = this.history.concat([Object.assign({}, validState[x][y])]);
        }
        return this;
    };
    BoardService.prototype.libertiesAt = function (x, y) {
        var m = this.at(x, y);
        return m ? this.ruleService.liberties(this.board, m).length : 0;
    };
    BoardService.prototype.show = function () {
        // 
        console.log(this.board.map(function (l) { return l.map(function (p) { return p.state ? p.state : ''; }); }));
    };
    return BoardService;
}());
exports.default = BoardService;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var board_service_1 = __webpack_require__(/*! ./board.service */ "./src/board.service.ts");
var kifu_service_1 = __webpack_require__(/*! ./kifu.service */ "./src/kifu.service.ts");
var rule_service_1 = __webpack_require__(/*! ./rule.service */ "./src/rule.service.ts");
exports.default = { BoardService: board_service_1.default, KifuService: kifu_service_1.default, RuleService: rule_service_1.default };


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
var sgfgrove = __webpack_require__(/*! sgfgrove */ "./node_modules/sgfgrove/lib/sgfgrove.js");
var models_1 = __webpack_require__(/*! ./models */ "./src/models.ts");
var KifuService = /** @class */ (function () {
    function KifuService() {
    }
    KifuService.prototype.read = function (svg) {
        var _a = sgfgrove.parse(svg)[0][0], meta = _a[0], game = _a.slice(1);
        var PB = meta.PB, PW = meta.PW, BR = meta.BR, WR = meta.WR, SZ = meta.SZ, KM = meta.KM, RU = meta.RU, GN = meta.GN, CP = meta.CP, US = meta.US, AN = meta.AN, rest = __rest(meta, ["PB", "PW", "BR", "WR", "SZ", "KM", "RU", "GN", "CP", "US", "AN"]);
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
            rest: rest,
            game: game
        };
    };
    return KifuService;
}());
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


/***/ }),

/***/ "./src/rule.service.ts":
/*!*****************************!*\
  !*** ./src/rule.service.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = __webpack_require__(/*! ./models */ "./src/models.ts");
var RuleService = /** @class */ (function () {
    function RuleService() {
    }
    RuleService.prototype.validate = function (game, mv) {
        var _this = this;
        var nextState = game.slice().slice();
        var hasLiberties = function (m) { return _this.liberties(nextState, m).length; };
        var isCapturing = function (m) {
            var next = game.slice().slice();
            next[mv.x][mv.y] = mv;
            return _this.captured(next, m).length;
        };
        var isKoProtected = function (m) { return game[m.x][m.y].state === models_1.State.KO; };
        var isFree = function (m) { return !game[m.x][m.y].state; };
        var valid = function (m) { return isFree(m) && (isCapturing(m) || hasLiberties(m)) && !isKoProtected(m); };
        var isKoSituation = function (m) { return m.captured.length === 1 && !_this.liberties(nextState, m).length; };
        if (valid(mv)) {
            nextState = this.resetKo(nextState);
            nextState[mv.x][mv.y] = mv;
            var captured = this.captured(nextState, mv).reduce(function (c, i) { return c.concat(i); }, []);
            nextState[mv.x][mv.y].captured = captured.slice();
            if (isKoSituation(mv)) {
                nextState[captured[0].x][captured[0].y].state = models_1.State.KO;
            }
            return captured.reduce(function (p, c) {
                p[c.x][c.y].state = c.state === models_1.State.KO
                    ? models_1.State.KO : null;
                return p;
            }, nextState);
        }
        throw new Error(mv.x + ":" + mv.y + " was not a valid move (" + game[mv.x][mv.y].state + ")");
    };
    RuleService.prototype.resetKo = function (state) {
        return state.map(function (l) { return l.map(function (p) {
            p.state = p.state == models_1.State.KO ? null : p.state;
            return p;
        }); });
    };
    RuleService.prototype.adjacent = function (board, move) {
        var end = board.length;
        var start = 0;
        return [
            move.y > start ? board[move.x][move.y - 1] : null,
            move.y < end ? board[move.x][move.y + 1] : null,
            move.x > start ? board[move.x - 1][move.y] : null,
            move.x < end ? board[move.x + 1][move.y] : null
        ].filter(function (i) { return i; });
    };
    RuleService.prototype.group = function (board, point, queue, visited) {
        var _this = this;
        if (queue === void 0) { queue = []; }
        if (visited === void 0) { visited = new Set(); }
        visited.add(point.x + ":" + point.y);
        return Array.from(new Set([
            point
        ].concat(queue, this.adjacent(board, point)
            .filter(function (n) { return !visited.has(n.x + ":" + n.y) && n.state === point.state; })
            .map(function (n) { return _this.group(board, n, queue, visited); })
            .reduce(function (a, v) { return a.concat(v); }, []))));
    };
    RuleService.prototype.sliberties = function (board, move) {
        return this.adjacent(board, move).filter(function (i) { return !i.state; });
    };
    RuleService.prototype.liberties = function (board, move, cap) {
        var _this = this;
        return Array.from(new Set(this.group(board, move)
            .map(function (m) { return _this.sliberties(board, m); })
            .reduce(function (a, v) { return a.concat(v); }, [])
            .filter(function (l) { return l.x !== move.x || l.y !== move.y; })
            .filter(function (l) { return !cap || (l.x !== cap.x || l.y !== cap.y); })));
    };
    RuleService.prototype.captured = function (board, move) {
        var _this = this;
        return this.adjacent(board, move)
            .filter(function (m) { return m.state && m.state !== move.state; })
            .filter(function (o) { return !_this.liberties(board, o, move).length; })
            .map(function (c) { return _this.group(board, c); });
    };
    return RuleService;
}());
exports.default = RuleService;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NnZmdyb3ZlL2xpYi9zZ2Zncm92ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYm9hcmQuc2VydmljZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tpZnUuc2VydmljZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWxzLnRzIiwid2VicGFjazovLy8uL3NyYy9ydWxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FB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QUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQXBCLENBQW9CLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBQ0wsa0JBQUM7QUFBRCxDQUFDO0FBQ0Qsa0JBQWUsV0FBVyxDQUFDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFNHRkdyb3ZlID0ge307XG5cbiAgICBTR0ZHcm92ZS5VdGlsID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIFV0aWwgPSB7fTtcblxuICAgICAgICBVdGlsLmlzTnVtYmVyID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiICYmIGlzRmluaXRlKHZhbHVlKTtcbiAgICAgICAgfTtcblxuICAgICAgICBVdGlsLmlzSW50ZWdlciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIFV0aWwuaXNOdW1iZXIodmFsdWUpICYmIE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gVXRpbDtcbiAgICB9KCkpO1xuXG4gICAgU0dGR3JvdmUucGFyc2UgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc291cmNlLCBsYXN0SW5kZXgsIHJldml2ZXI7XG5cbiAgICAgICAgLy8gT3ZlcnJpZGUgUmVnRXhwJ3MgdGVzdCBhbmQgZXhlYyBtZXRob2RzIHRvIGxldCBeIGJlaGF2ZSBsaWtlXG4gICAgICAgIC8vIHRoZSBcXEcgYXNzZXJ0aW9uICgvXFxHLi4uL2djKS4gU2VlIGFsc286XG4gICAgICAgIC8vIGh0dHA6Ly9wZXJsZG9jLnBlcmwub3JnL3BlcmxvcC5odG1sI1JlZ2V4cC1RdW90ZS1MaWtlLU9wZXJhdG9yc1xuXG4gICAgICAgIHZhciBXaGl0ZXNwYWNlcyA9IC9eXFxzKi9nLFxuICAgICAgICAgICAgT3BlblBhcmVuICAgPSAvXlxcKFxccyovZyxcbiAgICAgICAgICAgIENsb3NlUGFyZW4gID0gL15cXClcXHMqL2csXG4gICAgICAgICAgICBTZW1pY29sb24gICA9IC9eO1xccyovZyxcbiAgICAgICAgICAgIFByb3BJZGVudCAgID0gL14oW2EtekEtWjAtOV0rKVxccyovZyxcbiAgICAgICAgICAgIFByb3BWYWx1ZSAgID0gL15cXFsoKD86XFxcXFtcXFNcXHNdfFteXFxdXFxcXF0rKSopXFxdXFxzKi9nO1xuXG4gICAgICAgIHZhciB0ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGJvb2wgPSB0aGlzLnRlc3Qoc291cmNlLnNsaWNlKGxhc3RJbmRleCkpO1xuICAgICAgICAgICAgbGFzdEluZGV4ICs9IHRoaXMubGFzdEluZGV4O1xuICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgcmV0dXJuIGJvb2w7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGV4ZWMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXJyYXkgPSB0aGlzLmV4ZWMoc291cmNlLnNsaWNlKGxhc3RJbmRleCkpO1xuICAgICAgICAgICAgbGFzdEluZGV4ICs9IHRoaXMubGFzdEluZGV4O1xuICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBwYXJzZUdhbWVUcmVlID0gZnVuY3Rpb24gKHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIHZhciBzZXF1ZW5jZSA9IFtdO1xuXG4gICAgICAgICAgICBpZiAoIXRlc3QuY2FsbChPcGVuUGFyZW4pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aGlsZSAodGVzdC5jYWxsKFNlbWljb2xvbikpIHtcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IHt9O1xuXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkZW50ID0gZXhlYy5jYWxsKFByb3BJZGVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZGVudCA9IGlkZW50WzFdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5oYXNPd25Qcm9wZXJ0eShpZGVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIlByb3BlcnR5IFwiK2lkZW50K1wiIGFscmVhZHkgZXhpc3RzXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlcyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdiA9IGV4ZWMuY2FsbChQcm9wVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYpIHsgdmFsdWVzLnB1c2godlsxXSk7IH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIlByb3BWYWx1ZSBvZiBcIitpZGVudCtcIiBpcyBtaXNzaW5nXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbm9kZVtpZGVudF0gPSB2YWx1ZXM7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgfHwgY3JlYXRlUHJvcGVydGllcyhub2RlKTtcbiAgICAgICAgICAgICAgICBub2RlID0gcGFyc2VQcm9wZXJ0aWVzKG5vZGUsIHByb3BlcnRpZXMpO1xuXG4gICAgICAgICAgICAgICAgc2VxdWVuY2UucHVzaChub2RlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFzZXF1ZW5jZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJHYW1lVHJlZSBkb2VzIG5vdCBjb250YWluIGFueSBOb2Rlc1wiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gW107XG5cbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gcGFyc2VHYW1lVHJlZShwcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQpIHsgY2hpbGRyZW4ucHVzaChjaGlsZCk7IH1cbiAgICAgICAgICAgICAgICAgICAgICBlbHNlIHsgYnJlYWs7IH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF0ZXN0LmNhbGwoQ2xvc2VQYXJlbikpIHsgLy8gZW5kIG9mIEdhbWVUcmVlXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiVW5leHBlY3RlZCB0b2tlbiBcIitzb3VyY2UuY2hhckF0KGxhc3RJbmRleCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyAoO2EoO2IpKSA9PiAoO2E7YilcbiAgICAgICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICBzZXF1ZW5jZSA9IHNlcXVlbmNlLmNvbmNhdChjaGlsZHJlblswXVswXSk7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBjaGlsZHJlblswXVsxXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFtzZXF1ZW5jZSwgY2hpbGRyZW5dO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBjcmVhdGVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHJvb3QpIHtcbiAgICAgICAgICAgIHZhciBTR0ZOdW1iZXIgPSBTR0ZHcm92ZS5maWxlRm9ybWF0KHsgRkY6IDQgfSkuVHlwZXMuTnVtYmVyO1xuXG4gICAgICAgICAgICB2YXIgZmlsZUZvcm1hdCA9IFNHRkdyb3ZlLmZpbGVGb3JtYXQoe1xuICAgICAgICAgICAgICAgIEZGIDogU0dGTnVtYmVyLnBhcnNlKHJvb3QuRkYgfHwgW10pIHx8IDEsXG4gICAgICAgICAgICAgICAgR00gOiBTR0ZOdW1iZXIucGFyc2Uocm9vdC5HTSB8fCBbXSkgfHwgMVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBmaWxlRm9ybWF0LnByb3BlcnRpZXMoKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgcGFyc2VQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKG5vZGUsIHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIHZhciBuID0ge307XG5cbiAgICAgICAgICAgIGZvciAodmFyIGlkZW50IGluIG5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5oYXNPd25Qcm9wZXJ0eShpZGVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3AgPSBwcm9wZXJ0aWVzLnBhcnNlKGlkZW50LCBub2RlW2lkZW50XSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJJbnZhbGlkIFByb3BJZGVudCBcIitpZGVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobi5oYXNPd25Qcm9wZXJ0eShwcm9wWzBdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiUHJvcGVydHkgXCIrcHJvcFswXStcIiBhbHJlYWR5IGV4aXN0c1wiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChwcm9wWzFdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdHIgPSBpZGVudCtcIltcIitub2RlW2lkZW50XS5qb2luKFwiXVtcIikrXCJdXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJJbnZhbGlkIFByb3BWYWx1ZSBcIitzdHIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbltwcm9wWzBdXSA9IHByb3BbMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgfTtcbiBcbiAgICAgICAgLy8gQ29waWVkIGFuZCByZWFycmFuZ2VkIGZyb20ganNvbjIuanMgc28gdGhhdCB3ZSBjYW4gcGFzcyB0aGUgc2FtZVxuICAgICAgICAvLyBjYWxsYmFjayB0byBib3RoIG9mIFNHRi5wYXJzZSBhbmQgSlNPTi5wYXJzZVxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZG91Z2xhc2Nyb2NrZm9yZC9KU09OLWpzL2Jsb2IvbWFzdGVyL2pzb24yLmpzXG4gICAgICAgIHZhciB3YWxrID0gZnVuY3Rpb24gKGhvbGRlciwga2V5KSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBob2xkZXJba2V5XTtcblxuICAgICAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGsgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdiA9IHdhbGsodmFsdWUsIGspO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlW2tdID0gdjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB2YWx1ZVtrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJldml2ZXIuY2FsbChob2xkZXIsIGtleSwgdmFsdWUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodGV4dCwgcmV2KSB7XG4gICAgICAgICAgICB2YXIgY29sbGVjdGlvbiA9IFtdO1xuXG4gICAgICAgICAgICBzb3VyY2UgPSBTdHJpbmcodGV4dCk7XG4gICAgICAgICAgICBsYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgcmV2aXZlciA9IHR5cGVvZiByZXYgPT09IFwiZnVuY3Rpb25cIiAmJiByZXY7XG5cbiAgICAgICAgICAgIHRlc3QuY2FsbChXaGl0ZXNwYWNlcyk7XG5cbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdhbWVUcmVlID0gcGFyc2VHYW1lVHJlZSgpO1xuICAgICAgICAgICAgICAgIGlmIChnYW1lVHJlZSkgeyBjb2xsZWN0aW9uLnB1c2goZ2FtZVRyZWUpOyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7IGJyZWFrOyB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChsYXN0SW5kZXggIT09IHNvdXJjZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJVbmV4cGVjdGVkIHRva2VuIFwiK3NvdXJjZS5jaGFyQXQobGFzdEluZGV4KSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXZpdmVyID8gd2Fsayh7IFwiXCI6IGNvbGxlY3Rpb24gfSwgXCJcIikgOiBjb2xsZWN0aW9uO1xuICAgICAgICB9O1xuICAgIH0oKSk7XG5cbiAgICBTR0ZHcm92ZS5zdHJpbmdpZnkgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG4gICAgICAgIHZhciByZXBsYWNlciwgc2VsZWN0ZWQsIGluZGVudCwgZ2FwO1xuXG4gICAgICAgIHZhciBjcmVhdGVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHJvb3QpIHtcbiAgICAgICAgICAgIHZhciBmaWxlRm9ybWF0ID0gU0dGR3JvdmUuZmlsZUZvcm1hdCh7XG4gICAgICAgICAgICAgICAgRkYgOiByb290Lmhhc093blByb3BlcnR5KFwiRkZcIikgPyByb290LkZGIDogMSxcbiAgICAgICAgICAgICAgICBHTSA6IHJvb3QuaGFzT3duUHJvcGVydHkoXCJHTVwiKSA/IHJvb3QuR00gOiAxXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmaWxlRm9ybWF0LnByb3BlcnRpZXMoKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZmluYWxpemUgPSBmdW5jdGlvbiAoa2V5LCBob2xkZXIpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGhvbGRlcltrZXldO1xuICAgICAgICAgICAgdmFyIGksIGssIHY7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgdmFsdWUudG9TR0YgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9TR0Yoa2V5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlcGxhY2VyKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSByZXBsYWNlci5jYWxsKGhvbGRlciwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdmFsdWUgfHwgdHlwZW9mIHZhbHVlICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgdiA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB2ID0gW107XG4gICAgICAgICAgICAgICAgZm9yICggaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgICAgICAgICAgdltpXSA9IGZpbmFsaXplKGksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2ID0ge307XG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBzZWxlY3RlZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdltzZWxlY3RlZFtpXV0gPSBmaW5hbGl6ZShzZWxlY3RlZFtpXSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGsgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZba10gPSBmaW5hbGl6ZShrLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB2O1xuICAgICAgICB9O1xuIFxuICAgICAgICB2YXIgc3RyaW5naWZ5R2FtZVRyZWUgPSBmdW5jdGlvbiAoZ2FtZVRyZWUsIHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIGdhbWVUcmVlID0gaXNBcnJheShnYW1lVHJlZSkgPyBnYW1lVHJlZSA6IFtdO1xuXG4gICAgICAgICAgICB2YXIgc2VxdWVuY2UgPSBpc0FycmF5KGdhbWVUcmVlWzBdKSA/IGdhbWVUcmVlWzBdIDogW10sXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBpc0FycmF5KGdhbWVUcmVlWzFdKSA/IGdhbWVUcmVlWzFdIDogW107XG5cbiAgICAgICAgICAgIC8vICg7YSg7YikpID0+ICg7YTtiKVxuICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHNlcXVlbmNlID0gc2VxdWVuY2UuY29uY2F0KGlzQXJyYXkoY2hpbGRyZW5bMF1bMF0pID8gY2hpbGRyZW5bMF1bMF0gOiBbXSk7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBpc0FycmF5KGNoaWxkcmVuWzBdWzFdKSA/IGNoaWxkcmVuWzBdWzFdIDogW107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB0ZXh0ID0gXCJcIixcbiAgICAgICAgICAgICAgICBsZiA9IGluZGVudCA/IFwiXFxuXCIgOiBcIlwiLFxuICAgICAgICAgICAgICAgIG1pbmQgPSBnYXA7XG5cbiAgICAgICAgICAgIGlmIChzZXF1ZW5jZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0ZXh0ICs9IGdhcCtcIihcIitsZjsgLy8gb3BlbiBHYW1lVHJlZVxuICAgICAgICAgICAgICAgIGdhcCArPSBpbmRlbnQ7XG5cbiAgICAgICAgICAgICAgICB2YXIgc2VtaWNvbG9uID0gZ2FwK1wiO1wiLFxuICAgICAgICAgICAgICAgICAgICBzcGFjZSA9IGdhcCsoaW5kZW50ID8gXCIgXCIgOiBcIlwiKTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VxdWVuY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBzZXF1ZW5jZVtpXSAmJiB0eXBlb2Ygc2VxdWVuY2VbaV0gPT09IFwib2JqZWN0XCIgPyBzZXF1ZW5jZVtpXSA6IHt9O1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGFydGlhbCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzIHx8IGNyZWF0ZVByb3BlcnRpZXMobm9kZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaWRlbnQgaW4gbm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuaGFzT3duUHJvcGVydHkoaWRlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlcyA9IHByb3BlcnRpZXMuc3RyaW5naWZ5KGlkZW50LCBub2RlW2lkZW50XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWFsLnB1c2goaWRlbnQrXCJbXCIrdmFsdWVzLmpvaW4oXCJdW1wiKStcIl1cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGV4dCArPSBzZW1pY29sb24rcGFydGlhbC5qb2luKGxmK3NwYWNlKStsZjsgLy8gYWRkIE5vZGVcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQgKz0gc3RyaW5naWZ5R2FtZVRyZWUoY2hpbGRyZW5bal0sIHByb3BlcnRpZXMpOyAvLyBhZGQgR2FtZVRyZWVcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0ZXh0ICs9IG1pbmQrXCIpXCIrbGY7IC8vIGNsb3NlIEdhbWVUcmVlXG4gICAgICAgICAgICAgICAgZ2FwID0gbWluZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChjb2xsZWN0aW9uLCByZXAsIHNwYWNlKSB7XG4gICAgICAgICAgICB2YXIgdGV4dCwgaTtcblxuICAgICAgICAgICAgcmVwbGFjZXIgPSBudWxsO1xuICAgICAgICAgICAgc2VsZWN0ZWQgPSBudWxsO1xuICAgICAgICAgICAgaW5kZW50ID0gXCJcIjtcbiAgICAgICAgICAgIGdhcCA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChpc0FycmF5KHJlcCkpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZCA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCByZXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXBbaV0gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkLnB1c2gocmVwW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiByZXAgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHJlcGxhY2VyID0gcmVwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAocmVwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicmVwbGFjZXIgbXVzdCBiZSBhcnJheSBvciBmdW5jdGlvblwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzcGFjZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBzcGFjZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGVudCArPSBcIiBcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2Ygc3BhY2UgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICBpbmRlbnQgPSBzcGFjZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29sbGVjdGlvbiA9IGZpbmFsaXplKFwiXCIsIHsgXCJcIjogY29sbGVjdGlvbiB9KTtcblxuICAgICAgICAgICAgaWYgKGlzQXJyYXkoY29sbGVjdGlvbikpIHtcbiAgICAgICAgICAgICAgICB0ZXh0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29sbGVjdGlvbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0ICs9IHN0cmluZ2lmeUdhbWVUcmVlKGNvbGxlY3Rpb25baV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH07XG4gICAgfSgpKTtcblxuICAgIFNHRkdyb3ZlLmZpbGVGb3JtYXQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaXNJbnRlZ2VyID0gU0dGR3JvdmUuVXRpbC5pc0ludGVnZXIsXG4gICAgICAgICAgICBGRiA9IHt9O1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodmVyc2lvbiwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHZlcnNpb24gPSB2ZXJzaW9uIHx8IHt9O1xuXG4gICAgICAgICAgICB2YXIgZmYgPSB2ZXJzaW9uLkZGLFxuICAgICAgICAgICAgICAgIGdtID0gdmVyc2lvbi5HTTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzSW50ZWdlcihmZikgJiYgZmYgPiAwICYmIEZGW2ZmXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNJbnRlZ2VyKGdtKSAmJiBnbSA+IDAgJiYgRkZbZmZdLkdNW2dtXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZGW2ZmXS5HTVtnbV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZGW2ZmXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIEZGO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZmlsZUZvcm1hdCA9IHt9O1xuICAgICAgICAgICAgICAgIGZpbGVGb3JtYXQgPSBjYWxsYmFjay5jYWxsKGZpbGVGb3JtYXQsIEZGKSB8fCBmaWxlRm9ybWF0O1xuXG4gICAgICAgICAgICBpZiAoZmYgJiYgZ20pIHtcbiAgICAgICAgICAgICAgICBGRltmZl0uR01bZ21dID0gZmlsZUZvcm1hdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGZmKSB7XG4gICAgICAgICAgICAgICAgZmlsZUZvcm1hdC5HTSA9IGZpbGVGb3JtYXQuR00gfHwge307XG4gICAgICAgICAgICAgICAgRkZbZmZdID0gZmlsZUZvcm1hdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIEZGID0gZmlsZUZvcm1hdDtcbiAgICAgICAgICAgIH1cbiBcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICB9KCkpO1xuXG4gICAgU0dGR3JvdmUuZmlsZUZvcm1hdCh7fSwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgVHlwZXMgPSB7fTtcblxuICAgICAgICBUeXBlcy5zY2FsYXIgPSBmdW5jdGlvbiAoYXJncykge1xuICAgICAgICAgICAgYXJncyA9IGFyZ3MgfHwge307XG5cbiAgICAgICAgICAgIHZhciB0aGF0ID0ge307XG5cbiAgICAgICAgICAgIHZhciBsaWtlID0gYXJncy5saWtlIHx8IHsgdGVzdDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJ1ZTsgfSB9O1xuICAgICAgICAgICAgdmFyIHBhcnNlID0gYXJncy5wYXJzZSB8fCBmdW5jdGlvbiAodikgeyByZXR1cm4gdjsgfTtcblxuICAgICAgICAgICAgdmFyIGlzYSA9IGFyZ3MuaXNhIHx8IGZ1bmN0aW9uICh2KSB7IHJldHVybiB0eXBlb2YgdiA9PT0gXCJzdHJpbmdcIiAmJiBsaWtlLnRlc3Qodik7IH07XG4gICAgICAgICAgICB2YXIgc3RyaW5naWZ5ID0gYXJncy5zdHJpbmdpZnkgfHwgU3RyaW5nO1xuXG4gICAgICAgICAgICB0aGF0LnBhcnNlID0gZnVuY3Rpb24gKHZhbHVlcykge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID09PSAxICYmIGxpa2UudGVzdCh2YWx1ZXNbMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZSh2YWx1ZXNbMF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoYXQuc3RyaW5naWZ5ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzYSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtzdHJpbmdpZnkodmFsdWUpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gdGhhdDtcbiAgICAgICAgfTtcblxuICAgICAgICBUeXBlcy5Vbmtub3duID0ge1xuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbaV0gPSB2YWx1ZXNbaV0ucmVwbGFjZSgvXFxcXFxcXS9nLCBcIl1cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZXNbaV0gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbaV0gPSB2YWx1ZXNbaV0ucmVwbGFjZSgvXFxdL2csIFwiXFxcXF1cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLlR5cGVzID0gVHlwZXM7XG5cbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHQsIGFyZ3MpIHtcbiAgICAgICAgICAgIHQgPSB0IHx8IFR5cGVzO1xuICAgICAgICAgICAgYXJncyA9IGFyZ3MgfHwge307XG5cbiAgICAgICAgICAgIHZhciB0aGF0ID0ge1xuICAgICAgICAgICAgICAgIHR5cGVPZiAgICAgIDogYXJncy50eXBlT2YgICAgICB8fCB7fSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0VHlwZSA6IGFyZ3MuZGVmYXVsdFR5cGUgfHwgdC5Vbmtub3duLFxuICAgICAgICAgICAgICAgIGlkZW50aWZpZXJzIDogYXJncy5pZGVudGlmaWVycyB8fCB7IHRlc3Q6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGZhbHNlOyB9IH0sXG4gICAgICAgICAgICAgICAgcmVwbGFjZXIgICAgOiBhcmdzLnJlcGxhY2VyXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGF0Lm1lcmdlID0gZnVuY3Rpb24gKG90aGVyKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaWRlbnQgaW4gb3RoZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG90aGVyLmhhc093blByb3BlcnR5KGlkZW50KSAmJiBvdGhlcltpZGVudF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHlwZU9mW2lkZW50XSA9IG90aGVyW2lkZW50XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoYXQucGFyc2UgPSBmdW5jdGlvbiAoaWRlbnQsIHZhbHVlcykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlcGxhY2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlkZW50ID0gdGhpcy5yZXBsYWNlci5jYWxsKG51bGwsIGlkZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaWRlbnRpZmllcnMudGVzdChpZGVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGUgPSB0aGlzLnR5cGVPZltpZGVudF0gfHwgdGhpcy5kZWZhdWx0VHlwZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtpZGVudCwgdHlwZS5wYXJzZSh2YWx1ZXMpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGF0LnN0cmluZ2lmeSA9IGZ1bmN0aW9uIChpZGVudCwgdmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaWRlbnRpZmllcnMudGVzdChpZGVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGUgPSB0aGlzLnR5cGVPZltpZGVudF0gfHwgdGhpcy5kZWZhdWx0VHlwZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHR5cGUuc3RyaW5naWZ5KHZhbHVlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoYXQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH0pO1xuXG4gICAgLy8gRmlsZSBGb3JtYXQgKDtGRls0XSlcbiAgICAvLyBodHRwOi8vd3d3LnJlZC1iZWFuLmNvbS9zZ2Yvc2dmNC5odG1sXG4gICAgLy8gaHR0cDovL3d3dy5yZWQtYmVhbi5jb20vc2dmL3Byb3BlcnRpZXMuaHRtbFxuICAgIFNHRkdyb3ZlLmZpbGVGb3JtYXQoeyBGRjogNCB9LCBmdW5jdGlvbiAoRkYpIHtcbiAgICAgICAgdmFyIFR5cGVzID0gT2JqZWN0LmNyZWF0ZShGRi5UeXBlcyk7XG4gICAgICAgIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxuICAgICAgICBUeXBlcy5jb21wb3NlID0gZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4gbGVmdCAmJiByaWdodCAmJiB7XG4gICAgICAgICAgICAgICAgZXNjYXBlOiBmdW5jdGlvbiAodikgeyByZXR1cm4gdi5yZXBsYWNlKC86L2csIFwiXFxcXDpcIik7IH0sXG4gICAgICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ID0gL14oKD86XFxcXFtcXFNcXHNdfFteOlxcXFxdKykqKTooKD86XFxcXFtcXFNcXHNdfFteOlxcXFxdKykqKSQvLmV4ZWModmFsdWVzWzBdKSB8fCB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbCA9IHYgJiYgbGVmdC5wYXJzZShbdlsxXV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHIgPSB2ICYmIHJpZ2h0LnBhcnNlKFt2WzJdXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobCAhPT0gdW5kZWZpbmVkICYmIHIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbbCwgcl07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsID0gbGVmdC5zdHJpbmdpZnkodmFsdWVbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHIgPSByaWdodC5zdHJpbmdpZnkodmFsdWVbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGwgJiYgciAmJiBbdGhpcy5lc2NhcGUobFswXSkrXCI6XCIrdGhpcy5lc2NhcGUoclswXSldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcblxuICAgICAgICBUeXBlcy5saXN0T2YgPSBmdW5jdGlvbiAoc2NhbGFyLCBhcmdzKSB7XG4gICAgICAgICAgICBhcmdzID0gYXJncyB8fCB7fTtcblxuICAgICAgICAgICAgcmV0dXJuIHNjYWxhciAmJiB7XG4gICAgICAgICAgICAgICAgY2FuQmVFbXB0eTogYXJncy5jYW5CZUVtcHR5LFxuICAgICAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCA9PT0gMSAmJiB2YWx1ZXNbMF0gPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbkJlRW1wdHkgPyByZXN1bHQgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2ldID0gc2NhbGFyLnBhcnNlKFt2YWx1ZXNbaV1dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHRbaV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0FycmF5KHZhbHVlcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghdmFsdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FuQmVFbXB0eSA/IFtcIlwiXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbaV0gPSBzY2FsYXIuc3RyaW5naWZ5KHZhbHVlc1tpXSlbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHJlc3VsdFtpXSA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0b0VsaXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvdGhlciA9IE9iamVjdC5jcmVhdGUodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIG90aGVyLmNhbkJlRW1wdHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3RoZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcblxuICAgICAgICBUeXBlcy5lbGlzdE9mID0gZnVuY3Rpb24gKHNjYWxhcikge1xuICAgICAgICAgICAgcmV0dXJuIFR5cGVzLmxpc3RPZihzY2FsYXIsIHtcbiAgICAgICAgICAgICAgICBjYW5CZUVtcHR5OiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBUeXBlcy5vciA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYSAmJiBiICYmIHtcbiAgICAgICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gYS5wYXJzZSh2YWx1ZXMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0ICE9PSB1bmRlZmluZWQgPyByZXN1bHQgOiBiLnBhcnNlKHZhbHVlcyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS5zdHJpbmdpZnkodmFsdWUpIHx8IGIuc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIE51bWJlciA9IFtcIitcInxcIi1cIl0gRGlnaXQge0RpZ2l0fVxuICAgICAgICBUeXBlcy5OdW1iZXIgPSBUeXBlcy5zY2FsYXIoe1xuICAgICAgICAgICAgbGlrZTogL15bKy1dP1xcZCskLyxcbiAgICAgICAgICAgIGlzYTogU0dGR3JvdmUuVXRpbC5pc0ludGVnZXIsXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHBhcnNlSW50KHYsIDEwKTsgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBOb25lID0gXCJcIlxuICAgICAgICBUeXBlcy5Ob25lID0gVHlwZXMuc2NhbGFyKHtcbiAgICAgICAgICAgIGxpa2U6IHsgdGVzdDogZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHYgPT09IFwiXCI7IH0gfSxcbiAgICAgICAgICAgIGlzYTogZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHYgPT09IG51bGw7IH0sXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKCkgeyByZXR1cm4gbnVsbDsgfSxcbiAgICAgICAgICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKCkgeyByZXR1cm4gXCJcIjsgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBSZWFsID0gTnVtYmVyIFtcIi5cIiBEaWdpdCB7IERpZ2l0IH1dXG4gICAgICAgIFR5cGVzLlJlYWwgPSBUeXBlcy5zY2FsYXIoe1xuICAgICAgICAgICAgbGlrZTogL15bKy1dP1xcZCsoPzpcXC5cXGQrKT8kLyxcbiAgICAgICAgICAgIGlzYTogU0dGR3JvdmUuVXRpbC5pc051bWJlcixcbiAgICAgICAgICAgIHBhcnNlOiBwYXJzZUZsb2F0XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIERvdWJsZSA9IChcIjFcIiB8IFwiMlwiKVxuICAgICAgICBUeXBlcy5Eb3VibGUgPSBUeXBlcy5zY2FsYXIoe1xuICAgICAgICAgICAgbGlrZTogL15bMTJdJC8sXG4gICAgICAgICAgICBpc2E6IGZ1bmN0aW9uICh2KSB7IHJldHVybiB2ID09PSAxIHx8IHYgPT09IDI7IH0sXG4gICAgICAgICAgICBwYXJzZTogcGFyc2VJbnRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQ29sb3IgPSAoXCJCXCIgfCBcIldcIilcbiAgICAgICAgVHlwZXMuQ29sb3IgPSBUeXBlcy5zY2FsYXIoe1xuICAgICAgICAgICAgbGlrZTogL15bQlddJC9cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVGV4dCA9IHsgYW55IGNoYXJhY3RlciB9XG4gICAgICAgIFR5cGVzLlRleHQgPSBUeXBlcy5zY2FsYXIoe1xuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5cbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHNvZnQgbGluZWJyZWFrc1xuICAgICAgICAgICAgICAgICAgICByZXBsYWNlKC9cXFxcKD86XFxuXFxyP3xcXHJcXG4/KS9nLCBcIlwiKS5cbiAgICAgICAgICAgICAgICAgICAgLy8gY29udmVydCB3aGl0ZSBzcGFjZXMgb3RoZXIgdGhhbiBsaW5lYnJlYWtzIHRvIHNwYWNlXG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2UoL1teXFxTXFxuXFxyXS9nLCBcIiBcIikuXG4gICAgICAgICAgICAgICAgICAgIC8vIGluc2VydCBlc2NhcGVkIGNoYXJzIHZlcmJhdGltXG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2UoL1xcXFwoW1xcU1xcc10pL2csIFwiJDFcIik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RyaW5naWZ5OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvKFtcXF1cXFxcXSkvZywgXCJcXFxcJDFcIik7IC8vIGVzY2FwZSBcIl1cIiBhbmQgXCJcXFwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFNpbXBsZVRleHQgPSB7IGFueSBjaGFyYWN0ZXIgfVxuICAgICAgICBUeXBlcy5TaW1wbGVUZXh0ID0gVHlwZXMuc2NhbGFyKHtcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBzb2Z0IGxpbmVicmVha3NcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZSgvXFxcXCg/Olxcblxccj98XFxyXFxuPykvZywgXCJcIikuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnZlcnQgd2hpdGUgc3BhY2VzIG90aGVyIHRoYW4gc3BhY2UgdG8gc3BhY2UgZXZlbiBpZiBpdCdzIGVzY2FwZWRcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZSgvXFxcXD9bXlxcUyBdL2csIFwiIFwiKS5cbiAgICAgICAgICAgICAgICAgICAgLy8gaW5zZXJ0IGVzY2FwZWQgY2hhcnMgdmVyYmF0aW1cbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZSgvXFxcXChbXFxTXFxzXSkvZywgXCIkMVwiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC8oW1xcXVxcXFxdKS9nLCBcIlxcXFwkMVwiKTsgLy8gZXNjYXBlIFwiXVwiIGFuZCBcIlxcXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5UeXBlcyA9IFR5cGVzO1xuXG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICB0ID0gdCB8fCBUeXBlcztcblxuICAgICAgICAgICAgcmV0dXJuIEZGLnByb3BlcnRpZXModCwge1xuICAgICAgICAgICAgICAgIGlkZW50aWZpZXJzOiAvXltBLVpdKyQvLFxuICAgICAgICAgICAgICAgIHR5cGVPZjoge1xuICAgICAgICAgICAgICAgICAgICAvLyBNb3ZlIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgQiAgOiB0Lk1vdmUsXG4gICAgICAgICAgICAgICAgICAgIEtPIDogdC5Ob25lLFxuICAgICAgICAgICAgICAgICAgICBNTiA6IHQuTnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBXICA6IHQuTW92ZSxcbiAgICAgICAgICAgICAgICAgICAgLy8gU2V0dXAgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICBBQiA6IHQubGlzdE9mU3RvbmUgfHwgdC5saXN0T2YodC5TdG9uZSksXG4gICAgICAgICAgICAgICAgICAgIEFFIDogdC5saXN0T2ZQb2ludCxcbiAgICAgICAgICAgICAgICAgICAgQVcgOiB0Lmxpc3RPZlN0b25lIHx8IHQubGlzdE9mKHQuU3RvbmUpLFxuICAgICAgICAgICAgICAgICAgICBQTCA6IHQuQ29sb3IsXG4gICAgICAgICAgICAgICAgICAgIC8vIE5vZGUgYW5ub3RhdGlvbiBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgIEMgIDogdC5UZXh0LFxuICAgICAgICAgICAgICAgICAgICBETSA6IHQuRG91YmxlLFxuICAgICAgICAgICAgICAgICAgICBHQiA6IHQuRG91YmxlLFxuICAgICAgICAgICAgICAgICAgICBHVyA6IHQuRG91YmxlLFxuICAgICAgICAgICAgICAgICAgICBITyA6IHQuRG91YmxlLFxuICAgICAgICAgICAgICAgICAgICBOICA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgVUMgOiB0LkRvdWJsZSxcbiAgICAgICAgICAgICAgICAgICAgViAgOiB0LlJlYWwsXG4gICAgICAgICAgICAgICAgICAgIC8vIE1vdmUgYW5ub3RhdGlvbiBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgIEJNIDogdC5Eb3VibGUsXG4gICAgICAgICAgICAgICAgICAgIERPIDogdC5Ob25lLFxuICAgICAgICAgICAgICAgICAgICBJVCA6IHQuTm9uZSxcbiAgICAgICAgICAgICAgICAgICAgVEUgOiB0LkRvdWJsZSxcbiAgICAgICAgICAgICAgICAgICAgLy8gTWFya3VwIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgQVIgOiB0Lmxpc3RPZih0LmNvbXBvc2UodC5Qb2ludCwgdC5Qb2ludCkpLFxuICAgICAgICAgICAgICAgICAgICBDUiA6IHQubGlzdE9mUG9pbnQsXG4gICAgICAgICAgICAgICAgICAgIEREIDogdC5lbGlzdE9mUG9pbnQsXG4gICAgICAgICAgICAgICAgICAgIExCIDogdC5saXN0T2YodC5jb21wb3NlKHQuUG9pbnQsIHQuU2ltcGxlVGV4dCkpLFxuICAgICAgICAgICAgICAgICAgICBMTiA6IHQubGlzdE9mKHQuY29tcG9zZSh0LlBvaW50LCB0LlBvaW50KSksXG4gICAgICAgICAgICAgICAgICAgIE1BIDogdC5saXN0T2ZQb2ludCxcbiAgICAgICAgICAgICAgICAgICAgU0wgOiB0Lmxpc3RPZlBvaW50LFxuICAgICAgICAgICAgICAgICAgICBTUSA6IHQubGlzdE9mUG9pbnQsXG4gICAgICAgICAgICAgICAgICAgIFRSIDogdC5saXN0T2ZQb2ludCxcbiAgICAgICAgICAgICAgICAgICAgLy8gUm9vdCBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgIEFQIDogdC5jb21wb3NlKHQuU2ltcGxlVGV4dCwgdC5TaW1wbGVUZXh0KSxcbiAgICAgICAgICAgICAgICAgICAgQ0EgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIEZGIDogdC5OdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIEdNIDogdC5OdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIFNUIDogdC5OdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIFNaIDogdC5vcih0Lk51bWJlciwgdC5jb21wb3NlKHQuTnVtYmVyLCB0Lk51bWJlcikpLFxuICAgICAgICAgICAgICAgICAgICAvLyBHYW1lIGluZm8gcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICBBTiA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgQlIgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIEJUIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBDUCA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgRFQgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIEVWIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBHTiA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgR0MgOiB0LlRleHQsXG4gICAgICAgICAgICAgICAgICAgIE9OIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBPVCA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgUEIgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIFBDIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBQVyA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgUkUgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIFJPIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBSVSA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgU08gOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIFRNIDogdC5SZWFsLFxuICAgICAgICAgICAgICAgICAgICBVUyA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgV1IgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIFdUIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICAvLyBUaW1pbmcgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICBCTCA6IHQuUmVhbCxcbiAgICAgICAgICAgICAgICAgICAgT0IgOiB0Lk51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgT1cgOiB0Lk51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgV0wgOiB0LlJlYWwsXG4gICAgICAgICAgICAgICAgICAgIC8vIE1pc2NlbGxhbmVvdXMgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICBGRyA6IHQub3IodC5Ob25lLCB0LmNvbXBvc2UodC5OdW1iZXIsIHQuU2ltcGxlVGV4dCkpLFxuICAgICAgICAgICAgICAgICAgICBQTSA6IHQuTnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBWTSA6IHQuZWxpc3RPZlBvaW50XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH0pO1xuXG4gICAgLy8gR28gKDtGRls0XUdNWzFdKSBzcGVjaWZpYyBwcm9wZXJ0aWVzXG4gICAgLy8gaHR0cDovL3d3dy5yZWQtYmVhbi5jb20vc2dmL2dvLmh0bWxcbiAgICBTR0ZHcm92ZS5maWxlRm9ybWF0KHsgRkY6IDQsIEdNOiAxIH0sIGZ1bmN0aW9uIChGRikge1xuICAgICAgICB2YXIgVHlwZXMgPSBPYmplY3QuY3JlYXRlKEZGWzRdLlR5cGVzKTtcblxuICAgICAgICB2YXIgZXhwYW5kUG9pbnRMaXN0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjb29yZCA9IFwiYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpcIjtcbiAgICAgICAgICAgICAgICBjb29yZCArPSBjb29yZC50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHAxLCBwMikge1xuICAgICAgICAgICAgICAgIHZhciB4MSA9IGNvb3JkLmluZGV4T2YocDEuY2hhckF0KDApKSxcbiAgICAgICAgICAgICAgICAgICAgeTEgPSBjb29yZC5pbmRleE9mKHAxLmNoYXJBdCgxKSksXG4gICAgICAgICAgICAgICAgICAgIHgyID0gY29vcmQuaW5kZXhPZihwMi5jaGFyQXQoMCkpLFxuICAgICAgICAgICAgICAgICAgICB5MiA9IGNvb3JkLmluZGV4T2YocDIuY2hhckF0KDEpKTtcblxuICAgICAgICAgICAgICAgIHZhciBoOyBcbiAgICAgICAgICAgICAgICBpZiAoeDEgPiB4Mikge1xuICAgICAgICAgICAgICAgICAgICBoID0geDE7IHgxID0geDI7IHgyID0gaDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHkxID4geTIpIHtcbiAgICAgICAgICAgICAgICAgICAgaCA9IHkxOyB5MSA9IHkyOyB5MiA9IGg7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHBvaW50cyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHkgPSB5MTsgeSA8PSB5MjsgeSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSB4MTsgeCA8PSB4MjsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjb29yZC5jaGFyQXQoeCkrY29vcmQuY2hhckF0KHkpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBwb2ludHM7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KCkpO1xuXG4gICAgICAgIFR5cGVzLlBvaW50ID0gVHlwZXMuc2NhbGFyKHtcbiAgICAgICAgICAgIGxpa2U6IC9eW2EtekEtWl17Mn0kL1xuICAgICAgICB9KTtcbiAgXG4gICAgICAgIFR5cGVzLlN0b25lID0gVHlwZXMuUG9pbnQ7XG4gICAgICAgIFR5cGVzLk1vdmUgID0gVHlwZXMub3IoVHlwZXMuTm9uZSwgVHlwZXMuUG9pbnQpO1xuXG4gICAgICAgIFR5cGVzLmxpc3RPZlBvaW50ID0gKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICB2YXIgbGlzdE9mUG9pbnQgPSB0Lmxpc3RPZih0Lm9yKFxuICAgICAgICAgICAgICAgIHQuUG9pbnQsXG4gICAgICAgICAgICAgICAgdC5zY2FsYXIoe1xuICAgICAgICAgICAgICAgICAgICBsaWtlOiAvXlthLXpBLVpdezJ9OlthLXpBLVpdezJ9JC8sXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWN0ID0gdmFsdWUuc3BsaXQoXCI6XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4cGFuZFBvaW50TGlzdChyZWN0WzBdLCByZWN0WzFdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApKTtcblxuICAgICAgICAgICAgdmFyIHBhcnNlID0gbGlzdE9mUG9pbnQucGFyc2U7XG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBbXTtcblxuICAgICAgICAgICAgbGlzdE9mUG9pbnQucGFyc2UgPSBmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHBhcnNlLmNhbGwodGhpcywgdmFsdWVzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0ICYmIGFycmF5LmNvbmNhdC5hcHBseShhcnJheSwgcmVzdWx0KTsgLy8gZmxhdHRlblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIGxpc3RPZlBvaW50O1xuICAgICAgICB9KFR5cGVzKSk7XG5cbiAgICAgICAgVHlwZXMuZWxpc3RPZlBvaW50ID0gVHlwZXMubGlzdE9mUG9pbnQudG9FbGlzdCgpO1xuXG4gICAgICAgIFR5cGVzLmxpc3RPZlN0b25lICA9IFR5cGVzLmxpc3RPZlBvaW50O1xuICAgICAgICBUeXBlcy5lbGlzdE9mU3RvbmUgPSBUeXBlcy5lbGlzdE9mUG9pbnQ7XG4gICAgXG4gICAgICAgIHRoaXMuVHlwZXMgPSBUeXBlcztcblxuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgdCA9IHQgfHwgVHlwZXM7XG5cbiAgICAgICAgICAgIHZhciB0aGF0ID0gRkZbNF0ucHJvcGVydGllcyh0KTtcblxuICAgICAgICAgICAgdGhhdC5tZXJnZSh7XG4gICAgICAgICAgICAgICAgSEEgOiB0Lk51bWJlcixcbiAgICAgICAgICAgICAgICBLTSA6IHQuUmVhbCxcbiAgICAgICAgICAgICAgICBUQiA6IHQuZWxpc3RPZlBvaW50LFxuICAgICAgICAgICAgICAgIFRXIDogdC5lbGlzdE9mUG9pbnRcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhhdDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm47XG4gICAgfSk7XG5cbiAgICBpZiAodHlwZW9mIGV4cG9ydHMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBTR0ZHcm92ZTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB3aW5kb3cuU0dGR3JvdmUgPSBTR0ZHcm92ZTtcbiAgICB9XG5cbn0oKSk7XG5cbiIsImltcG9ydCB7IFN0YXRlLCBNb3ZlIH0gZnJvbSBcIi4vbW9kZWxzXCI7XG5pbXBvcnQgUnVsZVNlcnZpY2UgZnJvbSBcIi4vcnVsZS5zZXJ2aWNlXCI7XG5cbmNsYXNzIEJvYXJkU2VydmljZSB7XG4gIGJvYXJkOiBhbnkgPSBbXTtcbiAgcnVsZVNlcnZpY2UgPSBuZXcgUnVsZVNlcnZpY2UoKTtcbiAgaGlzdG9yeTogYW55W10gPSBbXTtcbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgfVxuXG4gIGluaXQoc2l6ZSkge1xuICAgIHRoaXMuaGlzdG9yeSA9IFtdO1xuICAgIHRoaXMuYm9hcmQgPSB0aGlzLmxpbmUoc2l6ZSkubWFwKChfLCB4KSA9PiB0aGlzLmxpbmUoc2l6ZSkpLm1hcCgoXywgeCkgPT4gXy5tYXAoKF8sIHkpID0+IHRoaXMuY3JlYXRlUG9pbnQoeCwgeSkpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNyZWF0ZVBvaW50ID0gKHg6IG51bWJlciwgeTogbnVtYmVyLCBzdGF0ZSA9IG51bGwpID0+ICh7IHN0YXRlOiBzdGF0ZSwgb3JkZXI6IDAgfSk7XG5cbiAgbGluZSA9IChzOiBudW1iZXIpID0+IEFycmF5KHMpLmZpbGwoJycpO1xuICBhdCA9ICh4OiBudW1iZXIsIHk6IG51bWJlcik6IE1vdmUgPT4gdGhpcy5ib2FyZFt4XVt5XTtcblxuICBwbGF5KHg6IG51bWJlciwgeTogbnVtYmVyLCBvcmRlciA9IHRoaXMuaGlzdG9yeS5sZW5ndGgpIHtcbiAgICBjb25zdCB2YWxpZFN0YXRlID0gdGhpcy5ydWxlU2VydmljZS52YWxpZGF0ZSh0aGlzLmJvYXJkLCB7XG4gICAgICBzdGF0ZTogb3JkZXIgJSAyID8gU3RhdGUuV0hJVEUgOiBTdGF0ZS5CTEFDSyxcbiAgICAgIG9yZGVyOiBvcmRlcixcbiAgICAgIHg6IHgsXG4gICAgICB5OiB5XG4gICAgfSlcblxuICAgIGlmICh2YWxpZFN0YXRlKSB7XG4gICAgICB0aGlzLmJvYXJkID0gdmFsaWRTdGF0ZTtcbiAgICAgIHRoaXMuaGlzdG9yeSA9IFsuLi50aGlzLmhpc3RvcnksIE9iamVjdC5hc3NpZ24oe30sIHZhbGlkU3RhdGVbeF1beV0pXTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaWJlcnRpZXNBdCh4OiBudW1iZXIsIHk6IG51bWJlcik6IG51bWJlciB7XG4gICAgY29uc3QgbSA9IHRoaXMuYXQoeCwgeSk7XG4gICAgcmV0dXJuIG0gPyB0aGlzLnJ1bGVTZXJ2aWNlLmxpYmVydGllcyh0aGlzLmJvYXJkLCBtKS5sZW5ndGggOiAwO1xuICB9XG5cbiAgc2hvdygpIHtcbiAgICAvLyBcbiAgICBjb25zb2xlLmxvZyh0aGlzLmJvYXJkLm1hcChsID0+IGwubWFwKHAgPT4gcC5zdGF0ZSA/IHAuc3RhdGUgOiAnJykpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCb2FyZFNlcnZpY2U7IiwiaW1wb3J0IEJvYXJkU2VydmljZSBmcm9tIFwiLi9ib2FyZC5zZXJ2aWNlXCI7XG5pbXBvcnQgS2lmdVNlcnZpY2UgZnJvbSBcIi4va2lmdS5zZXJ2aWNlXCI7XG5pbXBvcnQgUnVsZVNlcnZpY2UgZnJvbSBcIi4vcnVsZS5zZXJ2aWNlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHsgQm9hcmRTZXJ2aWNlLCBLaWZ1U2VydmljZSwgUnVsZVNlcnZpY2UgfTtcbiIsImltcG9ydCAqIGFzIHNnZmdyb3ZlIGZyb20gJ3NnZmdyb3ZlJ1xuaW1wb3J0IHsgQkxBQ0ssIFdISVRFIH0gZnJvbSAnLi9tb2RlbHMnO1xuY2xhc3MgS2lmdVNlcnZpY2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgcmVhZChzdmcpIHtcbiAgICAgICAgY29uc3QgW1tbbWV0YSwgLi4uZ2FtZV1dXSA9IHNnZmdyb3ZlLnBhcnNlKHN2Zyk7XG4gICAgICAgIGNvbnN0IHsgUEIsIFBXLCBCUiwgV1IsIFNaLCBLTSwgUlUsIEdOLCBDUCwgVVMsIEFOLCAuLi5yZXN0IH0gPSBtZXRhO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGxheWVyczogW1xuICAgICAgICAgICAgICAgIHsgY29sb3I6IEJMQUNLLCBuYW1lOiBQQiwgbGV2ZWw6IEJSIH0sXG4gICAgICAgICAgICAgICAgeyBjb2xvcjogV0hJVEUsIG5hbWU6IFBXLCBsZXZlbDogV1IgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBpbmZvOiB7XG4gICAgICAgICAgICAgICAgc2l6ZTogU1osXG4gICAgICAgICAgICAgICAga29taTogS00sXG4gICAgICAgICAgICAgICAgcnVsZTogUlUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWV0YToge1xuICAgICAgICAgICAgICAgIG5hbWU6IEdOLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogQ1AsXG4gICAgICAgICAgICAgICAgc2NyaWJlOiBVUyxcbiAgICAgICAgICAgICAgICBjb21tZW50YXRvcjogQU5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN0LFxuICAgICAgICAgICAgZ2FtZVxuICAgICAgICB9O1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgS2lmdVNlcnZpY2U7IiwiZXhwb3J0IGNvbnN0IEFQUE5BTUUgPSBcInRlbmdlbi5qc1wiO1xuZXhwb3J0IGNvbnN0IFZFUiA9IFwiMC4xXCI7XG5cbmV4cG9ydCBjb25zdCBFTVBUWTogYW55ID0gbnVsbDtcbmV4cG9ydCBjb25zdCBCTEFDSyA9IFwiYmxhY2tcIjtcbmV4cG9ydCBjb25zdCBXSElURSA9IFwid2hpdGVcIjtcbmV4cG9ydCBjb25zdCBQQVNTID0gXCJwYXNzXCI7XG5leHBvcnQgY29uc3QgVU5ETyA9IFwidW5kb1wiO1xuZXhwb3J0IGNvbnN0IEFCQU5ET04gPSBcImFiYW5kb25cIjtcbmV4cG9ydCBjb25zdCBORVhUID0gXCJuZXh0XCI7XG5leHBvcnQgY29uc3QgUFJFViA9IFwicHJldlwiO1xuZXhwb3J0IGNvbnN0IEVORCA9IFwiZW5kX2dhbWVcIjtcbmV4cG9ydCBjb25zdCBTVEFSVCA9IFwic3RhcnRfZ2FtZVwiO1xuXG5leHBvcnQgZW51bSBTdGF0ZSB7XG4gIEJMQUNLID0gJ2JsYWNrJyxcbiAgV0hJVEUgPSAnd2hpdGUnLFxuICBLTyA9ICdrbycsXG59IFxuZXhwb3J0IGludGVyZmFjZSBNb3ZlIHtcbiAgc3RhdGU6IFN0YXRlIHwgbnVsbCxcbiAgdXBkYXRlZF9hdD86IERhdGUsXG4gIG9yZGVyOiBudW1iZXIsIFxuICB4Om51bWJlclxuICB5Om51bWJlcixcbiAgbG9nPzogTW92ZVtdLFxuICBjYXB0dXJlZD86IFtdXG59XG5cbi8qXG5leHBvcnQgY29uc3QgYWxwaGFiZXQgPSAocyA9IDI2KSA9PiB7XG4gIHJldHVybiBuZXcgQXJyYXkocykuZmlsbCgxKS5tYXAoKF86YW55LCBpOm51bWJlcikgPT4gU3RyaW5nLmZyb21DaGFyQ29kZSg5NyArIGkpKTtcbn07XG5cbmV4cG9ydCBjb25zdCBhMm4gPSAoYSA6IHN0cmluZykgPT4ge1xuICByZXR1cm4gYWxwaGFiZXQoKS5pbmRleE9mKGEpO1xufTtcbmV4cG9ydCBjb25zdCBuMmEgPSAobjogbnVtYmVyKSA9PiB7XG4gIHJldHVybiBhbHBoYWJldCgpW25dO1xufTtcblxuZXhwb3J0IGNvbnN0IHRvQ29vcmQgPSAobm9kZTogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9KSA9PiB7XG4gIGNvbnN0IHsgeCwgeSB9ID0gbm9kZTtcbiAgcmV0dXJuIG4yYSh4KSArIG4yYSh5KTtcbn07XG5leHBvcnQgY29uc3QgZnJvbVNHRkNvb3JkID0gKHNnZm5vZGU6IGFueSkgPT4ge1xuICBjb25zdCBtb3ZlID0gc2dmbm9kZS5CIHx8IHNnZm5vZGUuVztcbiAgaWYgKG1vdmUpIHtcbiAgICBjb25zdCBbeCwgeV0gPSBtb3ZlLnNwbGl0KFwiXCIpO1xuICAgIHJldHVybiB7IHg6IGEybih4KSwgeTogYTJuKHkpIH07XG4gIH1cbiAgcmV0dXJuIHsgeDogbnVsbCwgeTogbnVsbCB9O1xufTtcblxuZXhwb3J0IGludGVyZmFjZSBJdGVtIHtcbiAgaWQ/OiBhbnk7XG4gIGNyZWF0ZWRBdD86IERhdGUgfCBudWxsO1xuICB1cGRhdGVkQXQ/OiBEYXRlIHwgbnVsbDtcbiAgZGVsZXRlZEF0PzogRGF0ZSB8IG51bGw7XG4gIGF1dGhvcj86IFBsYXllcjtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQ29tbWVudCB7XG4gIG9yZGVyOiBudW1iZXI7XG4gIHRleHQ6IHN0cmluZztcbiAgdGltZT86IERhdGU7XG4gIG1vdmU/OiBhbnk7XG59XG5leHBvcnQgaW50ZXJmYWNlIEdhbWVTZXR0aW5ncyBleHRlbmRzIEl0ZW0ge1xuICB3aGl0ZTogUGxheWVyO1xuICBibGFjazogUGxheWVyO1xuICBzaXplOiBudW1iZXI7XG4gIHNjb3JlczogU2NvcmVCb2FyZDtcbiAgdGl0bGU/OiBzdHJpbmc7XG4gIGtvbWk/OiBudW1iZXI7XG4gIGNsb2NrPzogYW55O1xuICBib2FyZD86IGFueTtcbiAgZXZlbnQ/OiBzdHJpbmc7XG4gIHJvdW5kPzogbnVtYmVyO1xuICBkYXRlPzogRGF0ZTtcbiAgbG9jYXRpb24/OiBzdHJpbmc7XG4gIGNvbW1lbnRzPzogQ29tbWVudFtdO1xuICB0cmVlPzogYW55W107XG4gIG5lZWRDb25maXJtOiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdhbWVMaXN0SXRlbSB7XG4gIG5hbWU6IHN0cmluZztcbiAgdXBkYXRlZF9hdDogYW55O1xuICB0aW1lc3RhbXA6IG51bWJlcjtcbiAga2V5OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGxheWVyIGV4dGVuZHMgSXRlbSB7XG4gIG5hbWU6IHN0cmluZztcbiAgcmFuaz86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTY29yZUJvYXJkIGV4dGVuZHMgSXRlbSB7XG4gIGJsYWNrOiBTY29yZSB8IG51bGw7XG4gIHdoaXRlOiBTY29yZSB8IG51bGw7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2NvcmUgZXh0ZW5kcyBJdGVtIHtcbiAgY2FwdHVyZWQ/OiBudW1iZXI7XG4gIHRlcnJpdG9yeT86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNb3ZlIGV4dGVuZHMgSXRlbSB7XG4gIHg/OiBudW1iZXI7XG4gIHk/OiBudW1iZXI7XG4gIHBsYXllcjogYW55O1xuICBzdGF0ZTogYW55O1xuICBsZWFmcz86IE1vdmVbXTtcbiAgb3JkZXI/OiBudW1iZXI7XG4gIGluSGlzdG9yeT86IGJvb2xlYW47XG4gIGNhcHR1cmVkPzogTW92ZVtdO1xuICBwbGF5ZWQ6IGJvb2xlYW47XG4gIGNvbW1lbnRzPzogYW55W107XG4gIHRpbWU/OiBudW1iZXI7XG59XG4qLyIsImltcG9ydCB7IE1vdmUsIFN0YXRlIH0gZnJvbSBcIi4vbW9kZWxzXCI7XG5cbmNsYXNzIFJ1bGVTZXJ2aWNlIHtcbiAgICB2YWxpZGF0ZShnYW1lLCBtdjogTW92ZSkge1xuICAgICAgICBsZXQgbmV4dFN0YXRlID0gWy4uLmdhbWUuc2xpY2UoKV07XG4gICAgICAgIGNvbnN0IGhhc0xpYmVydGllcyA9IG0gPT4gdGhpcy5saWJlcnRpZXMobmV4dFN0YXRlLCBtKS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGlzQ2FwdHVyaW5nID0gbSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXh0ID0gWy4uLmdhbWUuc2xpY2UoKV07XG4gICAgICAgICAgICBuZXh0W212LnhdW212LnldID0gbXY7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYXB0dXJlZChuZXh0LCBtKS5sZW5ndGhcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgaXNLb1Byb3RlY3RlZCA9IG0gPT4gZ2FtZVttLnhdW20ueV0uc3RhdGUgPT09IFN0YXRlLktPXG4gICAgICAgIGNvbnN0IGlzRnJlZSA9IG0gPT4gIWdhbWVbbS54XVttLnldLnN0YXRlO1xuICAgICAgICBjb25zdCB2YWxpZCA9IG0gPT4gaXNGcmVlKG0pICYmIChpc0NhcHR1cmluZyhtKSB8fCBoYXNMaWJlcnRpZXMobSkpICYmICFpc0tvUHJvdGVjdGVkKG0pO1xuICAgICAgICBjb25zdCBpc0tvU2l0dWF0aW9uID0gbSA9PiBtLmNhcHR1cmVkLmxlbmd0aCA9PT0gMSAmJiAhdGhpcy5saWJlcnRpZXMobmV4dFN0YXRlLCBtKS5sZW5ndGg7XG5cbiAgICAgICAgaWYgKHZhbGlkKG12KSkge1xuICAgICAgICAgICAgbmV4dFN0YXRlID0gdGhpcy5yZXNldEtvKG5leHRTdGF0ZSk7XG4gICAgICAgICAgICBuZXh0U3RhdGVbbXYueF1bbXYueV0gPSBtdjtcbiAgICAgICAgICAgIGNvbnN0IGNhcHR1cmVkID0gdGhpcy5jYXB0dXJlZChuZXh0U3RhdGUsIG12KS5yZWR1Y2UoKGMsIGkpID0+IGMuY29uY2F0KGkpLCBbXSk7XG4gICAgICAgICAgICBuZXh0U3RhdGVbbXYueF1bbXYueV0uY2FwdHVyZWQgPSBjYXB0dXJlZC5zbGljZSgpO1xuXG4gICAgICAgICAgICBpZiAoaXNLb1NpdHVhdGlvbihtdikpIHtcbiAgICAgICAgICAgICAgICBuZXh0U3RhdGVbY2FwdHVyZWRbMF0ueF1bY2FwdHVyZWRbMF0ueV0uc3RhdGUgPSBTdGF0ZS5LTztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGNhcHR1cmVkLnJlZHVjZSgocCwgYykgPT4ge1xuICAgICAgICAgICAgICAgIHBbYy54XVtjLnldLnN0YXRlID0gYy5zdGF0ZSA9PT0gU3RhdGUuS09cbiAgICAgICAgICAgICAgICAgICAgPyBTdGF0ZS5LTyA6IG51bGw7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHA7XG4gICAgICAgICAgICB9LCBuZXh0U3RhdGUpO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHttdi54fToke212Lnl9IHdhcyBub3QgYSB2YWxpZCBtb3ZlICgke2dhbWVbbXYueF1bbXYueV0uc3RhdGV9KWApO1xuICAgIH1cblxuICAgIHJlc2V0S28oc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlLm1hcChsID0+IGwubWFwKHAgPT4ge1xuICAgICAgICAgICAgcC5zdGF0ZSA9IHAuc3RhdGUgPT0gU3RhdGUuS08gPyBudWxsIDogcC5zdGF0ZTtcbiAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICB9KSlcblxuICAgIH1cblxuICAgIGFkamFjZW50KGJvYXJkLCBtb3ZlKSB7XG4gICAgICAgIGNvbnN0IGVuZCA9IGJvYXJkLmxlbmd0aDtcbiAgICAgICAgY29uc3Qgc3RhcnQgPSAwO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgbW92ZS55ID4gc3RhcnQgPyBib2FyZFttb3ZlLnhdW21vdmUueSAtIDFdIDogbnVsbCxcbiAgICAgICAgICAgIG1vdmUueSA8IGVuZCA/IGJvYXJkW21vdmUueF1bbW92ZS55ICsgMV0gOiBudWxsLFxuICAgICAgICAgICAgbW92ZS54ID4gc3RhcnQgPyBib2FyZFttb3ZlLnggLSAxXVttb3ZlLnldIDogbnVsbCxcbiAgICAgICAgICAgIG1vdmUueCA8IGVuZCA/IGJvYXJkW21vdmUueCArIDFdW21vdmUueV0gOiBudWxsXG4gICAgICAgIF0uZmlsdGVyKGkgPT4gaSk7XG4gICAgfVxuXG4gICAgZ3JvdXAoYm9hcmQsIHBvaW50OiBNb3ZlLCBxdWV1ZTogTW92ZVtdID0gW10sIHZpc2l0ZWQgPSBuZXcgU2V0KCkpOiBNb3ZlW10ge1xuICAgICAgICB2aXNpdGVkLmFkZChgJHtwb2ludC54fToke3BvaW50Lnl9YCk7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKFxuICAgICAgICAgICAgbmV3IFNldChbXG4gICAgICAgICAgICAgICAgcG9pbnQsXG4gICAgICAgICAgICAgICAgLi4ucXVldWUsXG4gICAgICAgICAgICAgICAgLi4udGhpcy5hZGphY2VudChib2FyZCwgcG9pbnQpXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIobiA9PiAhdmlzaXRlZC5oYXMoYCR7bi54fToke24ueX1gKSAmJiBuLnN0YXRlID09PSBwb2ludC5zdGF0ZSlcbiAgICAgICAgICAgICAgICAgICAgLm1hcChuID0+IHRoaXMuZ3JvdXAoYm9hcmQsIG4sIHF1ZXVlLCB2aXNpdGVkKSlcbiAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgdikgPT4gYS5jb25jYXQodiksIFtdKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBzbGliZXJ0aWVzKGJvYXJkLCBtb3ZlOiBNb3ZlKTogTW92ZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRqYWNlbnQoYm9hcmQsIG1vdmUpLmZpbHRlcihpID0+ICFpLnN0YXRlKTtcbiAgICB9XG5cbiAgICBsaWJlcnRpZXMoYm9hcmQsIG1vdmU6IE1vdmUsIGNhcD86IE1vdmUpOiBNb3ZlW10ge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShcbiAgICAgICAgICAgIG5ldyBTZXQoXG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cChib2FyZCwgbW92ZSlcbiAgICAgICAgICAgICAgICAgICAgLm1hcChtID0+IHRoaXMuc2xpYmVydGllcyhib2FyZCwgbSkpXG4gICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIHYpID0+IGEuY29uY2F0KHYpLCBbXSlcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihsID0+IGwueCAhPT0gbW92ZS54IHx8IGwueSAhPT0gbW92ZS55KVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGwgPT4gIWNhcCB8fCAobC54ICE9PSBjYXAueCB8fCBsLnkgIT09IGNhcC55KSlcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBjYXB0dXJlZChib2FyZCwgbW92ZTogTW92ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGphY2VudChib2FyZCwgbW92ZSlcbiAgICAgICAgICAgIC5maWx0ZXIobSA9PiBtLnN0YXRlICYmIG0uc3RhdGUgIT09IG1vdmUuc3RhdGUpXG4gICAgICAgICAgICAuZmlsdGVyKG8gPT4gIXRoaXMubGliZXJ0aWVzKGJvYXJkLCBvLCBtb3ZlKS5sZW5ndGgpXG4gICAgICAgICAgICAubWFwKGMgPT4gdGhpcy5ncm91cChib2FyZCwgYykpO1xuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFJ1bGVTZXJ2aWNlOyJdLCJzb3VyY2VSb290IjoiIn0=