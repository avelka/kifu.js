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
var kifu_service_1 = __webpack_require__(/*! ./kifu.service */ "./src/kifu.service.ts");
var BoardService = /** @class */ (function () {
    function BoardService() {
        var _this = this;
        this.board = [];
        this.ruleService = new rule_service_1.default();
        this.kifuService = new kifu_service_1.default();
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

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./board.service */ "./src/board.service.ts"));


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NnZmdyb3ZlL2xpYi9zZ2Zncm92ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYm9hcmQuc2VydmljZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tpZnUuc2VydmljZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWxzLnRzIiwid2VicGFjazovLy8uL3NyYy9ydWxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FB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QyxFQUFwQixDQUFvQixDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUNMLGtCQUFDO0FBQUQsQ0FBQztBQUNELGtCQUFlLFdBQVcsQ0FBQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBTR0ZHcm92ZSA9IHt9O1xuXG4gICAgU0dGR3JvdmUuVXRpbCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBVdGlsID0ge307XG5cbiAgICAgICAgVXRpbC5pc051bWJlciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIiAmJiBpc0Zpbml0ZSh2YWx1ZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgVXRpbC5pc0ludGVnZXIgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBVdGlsLmlzTnVtYmVyKHZhbHVlKSAmJiBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIFV0aWw7XG4gICAgfSgpKTtcblxuICAgIFNHRkdyb3ZlLnBhcnNlID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNvdXJjZSwgbGFzdEluZGV4LCByZXZpdmVyO1xuXG4gICAgICAgIC8vIE92ZXJyaWRlIFJlZ0V4cCdzIHRlc3QgYW5kIGV4ZWMgbWV0aG9kcyB0byBsZXQgXiBiZWhhdmUgbGlrZVxuICAgICAgICAvLyB0aGUgXFxHIGFzc2VydGlvbiAoL1xcRy4uLi9nYykuIFNlZSBhbHNvOlxuICAgICAgICAvLyBodHRwOi8vcGVybGRvYy5wZXJsLm9yZy9wZXJsb3AuaHRtbCNSZWdleHAtUXVvdGUtTGlrZS1PcGVyYXRvcnNcblxuICAgICAgICB2YXIgV2hpdGVzcGFjZXMgPSAvXlxccyovZyxcbiAgICAgICAgICAgIE9wZW5QYXJlbiAgID0gL15cXChcXHMqL2csXG4gICAgICAgICAgICBDbG9zZVBhcmVuICA9IC9eXFwpXFxzKi9nLFxuICAgICAgICAgICAgU2VtaWNvbG9uICAgPSAvXjtcXHMqL2csXG4gICAgICAgICAgICBQcm9wSWRlbnQgICA9IC9eKFthLXpBLVowLTldKylcXHMqL2csXG4gICAgICAgICAgICBQcm9wVmFsdWUgICA9IC9eXFxbKCg/OlxcXFxbXFxTXFxzXXxbXlxcXVxcXFxdKykqKVxcXVxccyovZztcblxuICAgICAgICB2YXIgdGVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBib29sID0gdGhpcy50ZXN0KHNvdXJjZS5zbGljZShsYXN0SW5kZXgpKTtcbiAgICAgICAgICAgIGxhc3RJbmRleCArPSB0aGlzLmxhc3RJbmRleDtcbiAgICAgICAgICAgIHRoaXMubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgIHJldHVybiBib29sO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBleGVjID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGFycmF5ID0gdGhpcy5leGVjKHNvdXJjZS5zbGljZShsYXN0SW5kZXgpKTtcbiAgICAgICAgICAgIGxhc3RJbmRleCArPSB0aGlzLmxhc3RJbmRleDtcbiAgICAgICAgICAgIHRoaXMubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgIHJldHVybiBhcnJheTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgcGFyc2VHYW1lVHJlZSA9IGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICB2YXIgc2VxdWVuY2UgPSBbXTtcblxuICAgICAgICAgICAgaWYgKCF0ZXN0LmNhbGwoT3BlblBhcmVuKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2hpbGUgKHRlc3QuY2FsbChTZW1pY29sb24pKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSB7fTtcblxuICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpZGVudCA9IGV4ZWMuY2FsbChQcm9wSWRlbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpZGVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWRlbnQgPSBpZGVudFsxXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuaGFzT3duUHJvcGVydHkoaWRlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJQcm9wZXJ0eSBcIitpZGVudCtcIiBhbHJlYWR5IGV4aXN0c1wiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZXMgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHYgPSBleGVjLmNhbGwoUHJvcFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2KSB7IHZhbHVlcy5wdXNoKHZbMV0pOyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgeyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCF2YWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJQcm9wVmFsdWUgb2YgXCIraWRlbnQrXCIgaXMgbWlzc2luZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIG5vZGVbaWRlbnRdID0gdmFsdWVzO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzIHx8IGNyZWF0ZVByb3BlcnRpZXMobm9kZSk7XG4gICAgICAgICAgICAgICAgbm9kZSA9IHBhcnNlUHJvcGVydGllcyhub2RlLCBwcm9wZXJ0aWVzKTtcblxuICAgICAgICAgICAgICAgIHNlcXVlbmNlLnB1c2gobm9kZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghc2VxdWVuY2UubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiR2FtZVRyZWUgZG9lcyBub3QgY29udGFpbiBhbnkgTm9kZXNcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IFtdO1xuXG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IHBhcnNlR2FtZVRyZWUocHJvcGVydGllcyk7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkKSB7IGNoaWxkcmVuLnB1c2goY2hpbGQpOyB9XG4gICAgICAgICAgICAgICAgICAgICAgZWxzZSB7IGJyZWFrOyB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdGVzdC5jYWxsKENsb3NlUGFyZW4pKSB7IC8vIGVuZCBvZiBHYW1lVHJlZVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIlVuZXhwZWN0ZWQgdG9rZW4gXCIrc291cmNlLmNoYXJBdChsYXN0SW5kZXgpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gKDthKDtiKSkgPT4gKDthO2IpXG4gICAgICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgc2VxdWVuY2UgPSBzZXF1ZW5jZS5jb25jYXQoY2hpbGRyZW5bMF1bMF0pO1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gY2hpbGRyZW5bMF1bMV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBbc2VxdWVuY2UsIGNoaWxkcmVuXTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgY3JlYXRlUHJvcGVydGllcyA9IGZ1bmN0aW9uIChyb290KSB7XG4gICAgICAgICAgICB2YXIgU0dGTnVtYmVyID0gU0dGR3JvdmUuZmlsZUZvcm1hdCh7IEZGOiA0IH0pLlR5cGVzLk51bWJlcjtcblxuICAgICAgICAgICAgdmFyIGZpbGVGb3JtYXQgPSBTR0ZHcm92ZS5maWxlRm9ybWF0KHtcbiAgICAgICAgICAgICAgICBGRiA6IFNHRk51bWJlci5wYXJzZShyb290LkZGIHx8IFtdKSB8fCAxLFxuICAgICAgICAgICAgICAgIEdNIDogU0dGTnVtYmVyLnBhcnNlKHJvb3QuR00gfHwgW10pIHx8IDFcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZmlsZUZvcm1hdC5wcm9wZXJ0aWVzKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHBhcnNlUHJvcGVydGllcyA9IGZ1bmN0aW9uIChub2RlLCBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICB2YXIgbiA9IHt9O1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpZGVudCBpbiBub2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuaGFzT3duUHJvcGVydHkoaWRlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wID0gcHJvcGVydGllcy5wYXJzZShpZGVudCwgbm9kZVtpZGVudF0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghcHJvcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiSW52YWxpZCBQcm9wSWRlbnQgXCIraWRlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG4uaGFzT3duUHJvcGVydHkocHJvcFswXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIlByb3BlcnR5IFwiK3Byb3BbMF0rXCIgYWxyZWFkeSBleGlzdHNcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocHJvcFsxXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RyID0gaWRlbnQrXCJbXCIrbm9kZVtpZGVudF0uam9pbihcIl1bXCIpK1wiXVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiSW52YWxpZCBQcm9wVmFsdWUgXCIrc3RyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIG5bcHJvcFswXV0gPSBwcm9wWzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgIH07XG4gXG4gICAgICAgIC8vIENvcGllZCBhbmQgcmVhcnJhbmdlZCBmcm9tIGpzb24yLmpzIHNvIHRoYXQgd2UgY2FuIHBhc3MgdGhlIHNhbWVcbiAgICAgICAgLy8gY2FsbGJhY2sgdG8gYm90aCBvZiBTR0YucGFyc2UgYW5kIEpTT04ucGFyc2VcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2RvdWdsYXNjcm9ja2ZvcmQvSlNPTi1qcy9ibG9iL21hc3Rlci9qc29uMi5qc1xuICAgICAgICB2YXIgd2FsayA9IGZ1bmN0aW9uIChob2xkZXIsIGtleSkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gaG9sZGVyW2tleV07XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHYgPSB3YWxrKHZhbHVlLCBrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVtrXSA9IHY7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdmFsdWVba107XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXZpdmVyLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHRleHQsIHJldikge1xuICAgICAgICAgICAgdmFyIGNvbGxlY3Rpb24gPSBbXTtcblxuICAgICAgICAgICAgc291cmNlID0gU3RyaW5nKHRleHQpO1xuICAgICAgICAgICAgbGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgIHJldml2ZXIgPSB0eXBlb2YgcmV2ID09PSBcImZ1bmN0aW9uXCIgJiYgcmV2O1xuXG4gICAgICAgICAgICB0ZXN0LmNhbGwoV2hpdGVzcGFjZXMpO1xuXG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBnYW1lVHJlZSA9IHBhcnNlR2FtZVRyZWUoKTtcbiAgICAgICAgICAgICAgICBpZiAoZ2FtZVRyZWUpIHsgY29sbGVjdGlvbi5wdXNoKGdhbWVUcmVlKTsgfVxuICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgeyBicmVhazsgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobGFzdEluZGV4ICE9PSBzb3VyY2UubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiVW5leHBlY3RlZCB0b2tlbiBcIitzb3VyY2UuY2hhckF0KGxhc3RJbmRleCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV2aXZlciA/IHdhbGsoeyBcIlwiOiBjb2xsZWN0aW9uIH0sIFwiXCIpIDogY29sbGVjdGlvbjtcbiAgICAgICAgfTtcbiAgICB9KCkpO1xuXG4gICAgU0dGR3JvdmUuc3RyaW5naWZ5ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuICAgICAgICB2YXIgcmVwbGFjZXIsIHNlbGVjdGVkLCBpbmRlbnQsIGdhcDtcblxuICAgICAgICB2YXIgY3JlYXRlUHJvcGVydGllcyA9IGZ1bmN0aW9uIChyb290KSB7XG4gICAgICAgICAgICB2YXIgZmlsZUZvcm1hdCA9IFNHRkdyb3ZlLmZpbGVGb3JtYXQoe1xuICAgICAgICAgICAgICAgIEZGIDogcm9vdC5oYXNPd25Qcm9wZXJ0eShcIkZGXCIpID8gcm9vdC5GRiA6IDEsXG4gICAgICAgICAgICAgICAgR00gOiByb290Lmhhc093blByb3BlcnR5KFwiR01cIikgPyByb290LkdNIDogMVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZmlsZUZvcm1hdC5wcm9wZXJ0aWVzKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGZpbmFsaXplID0gZnVuY3Rpb24gKGtleSwgaG9sZGVyKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBob2xkZXJba2V5XTtcbiAgICAgICAgICAgIHZhciBpLCBrLCB2O1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIHZhbHVlLnRvU0dGID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvU0dGKGtleSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZXBsYWNlcikge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gcmVwbGFjZXIuY2FsbChob2xkZXIsIGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXZhbHVlIHx8IHR5cGVvZiB2YWx1ZSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgIHYgPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdiA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgICAgIHZbaV0gPSBmaW5hbGl6ZShpLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdiA9IHt9O1xuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc2VsZWN0ZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZbc2VsZWN0ZWRbaV1dID0gZmluYWxpemUoc2VsZWN0ZWRbaV0sIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChrIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2W2tdID0gZmluYWxpemUoaywgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdjtcbiAgICAgICAgfTtcbiBcbiAgICAgICAgdmFyIHN0cmluZ2lmeUdhbWVUcmVlID0gZnVuY3Rpb24gKGdhbWVUcmVlLCBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBnYW1lVHJlZSA9IGlzQXJyYXkoZ2FtZVRyZWUpID8gZ2FtZVRyZWUgOiBbXTtcblxuICAgICAgICAgICAgdmFyIHNlcXVlbmNlID0gaXNBcnJheShnYW1lVHJlZVswXSkgPyBnYW1lVHJlZVswXSA6IFtdLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gaXNBcnJheShnYW1lVHJlZVsxXSkgPyBnYW1lVHJlZVsxXSA6IFtdO1xuXG4gICAgICAgICAgICAvLyAoO2EoO2IpKSA9PiAoO2E7YilcbiAgICAgICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICBzZXF1ZW5jZSA9IHNlcXVlbmNlLmNvbmNhdChpc0FycmF5KGNoaWxkcmVuWzBdWzBdKSA/IGNoaWxkcmVuWzBdWzBdIDogW10pO1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gaXNBcnJheShjaGlsZHJlblswXVsxXSkgPyBjaGlsZHJlblswXVsxXSA6IFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdGV4dCA9IFwiXCIsXG4gICAgICAgICAgICAgICAgbGYgPSBpbmRlbnQgPyBcIlxcblwiIDogXCJcIixcbiAgICAgICAgICAgICAgICBtaW5kID0gZ2FwO1xuXG4gICAgICAgICAgICBpZiAoc2VxdWVuY2UubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGV4dCArPSBnYXArXCIoXCIrbGY7IC8vIG9wZW4gR2FtZVRyZWVcbiAgICAgICAgICAgICAgICBnYXAgKz0gaW5kZW50O1xuXG4gICAgICAgICAgICAgICAgdmFyIHNlbWljb2xvbiA9IGdhcCtcIjtcIixcbiAgICAgICAgICAgICAgICAgICAgc3BhY2UgPSBnYXArKGluZGVudCA/IFwiIFwiIDogXCJcIik7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlcXVlbmNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBub2RlID0gc2VxdWVuY2VbaV0gJiYgdHlwZW9mIHNlcXVlbmNlW2ldID09PSBcIm9iamVjdFwiID8gc2VxdWVuY2VbaV0gOiB7fTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhcnRpYWwgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyB8fCBjcmVhdGVQcm9wZXJ0aWVzKG5vZGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGlkZW50IGluIG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlLmhhc093blByb3BlcnR5KGlkZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZXMgPSBwcm9wZXJ0aWVzLnN0cmluZ2lmeShpZGVudCwgbm9kZVtpZGVudF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydGlhbC5wdXNoKGlkZW50K1wiW1wiK3ZhbHVlcy5qb2luKFwiXVtcIikrXCJdXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRleHQgKz0gc2VtaWNvbG9uK3BhcnRpYWwuam9pbihsZitzcGFjZSkrbGY7IC8vIGFkZCBOb2RlXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjaGlsZHJlbi5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0ICs9IHN0cmluZ2lmeUdhbWVUcmVlKGNoaWxkcmVuW2pdLCBwcm9wZXJ0aWVzKTsgLy8gYWRkIEdhbWVUcmVlXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGV4dCArPSBtaW5kK1wiKVwiK2xmOyAvLyBjbG9zZSBHYW1lVHJlZVxuICAgICAgICAgICAgICAgIGdhcCA9IG1pbmQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoY29sbGVjdGlvbiwgcmVwLCBzcGFjZSkge1xuICAgICAgICAgICAgdmFyIHRleHQsIGk7XG5cbiAgICAgICAgICAgIHJlcGxhY2VyID0gbnVsbDtcbiAgICAgICAgICAgIHNlbGVjdGVkID0gbnVsbDtcbiAgICAgICAgICAgIGluZGVudCA9IFwiXCI7XG4gICAgICAgICAgICBnYXAgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAoaXNBcnJheShyZXApKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcmVwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVwW2ldID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZC5wdXNoKHJlcFtpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgcmVwID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICByZXBsYWNlciA9IHJlcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHJlcCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInJlcGxhY2VyIG11c3QgYmUgYXJyYXkgb3IgZnVuY3Rpb25cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3BhY2UgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc3BhY2U7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpbmRlbnQgKz0gXCIgXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHNwYWNlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgaW5kZW50ID0gc3BhY2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbGxlY3Rpb24gPSBmaW5hbGl6ZShcIlwiLCB7IFwiXCI6IGNvbGxlY3Rpb24gfSk7XG5cbiAgICAgICAgICAgIGlmIChpc0FycmF5KGNvbGxlY3Rpb24pKSB7XG4gICAgICAgICAgICAgICAgdGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGNvbGxlY3Rpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dCArPSBzdHJpbmdpZnlHYW1lVHJlZShjb2xsZWN0aW9uW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9O1xuICAgIH0oKSk7XG5cbiAgICBTR0ZHcm92ZS5maWxlRm9ybWF0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlzSW50ZWdlciA9IFNHRkdyb3ZlLlV0aWwuaXNJbnRlZ2VyLFxuICAgICAgICAgICAgRkYgPSB7fTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZlcnNpb24sIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB2ZXJzaW9uID0gdmVyc2lvbiB8fCB7fTtcblxuICAgICAgICAgICAgdmFyIGZmID0gdmVyc2lvbi5GRixcbiAgICAgICAgICAgICAgICBnbSA9IHZlcnNpb24uR007XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIGlmIChpc0ludGVnZXIoZmYpICYmIGZmID4gMCAmJiBGRltmZl0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzSW50ZWdlcihnbSkgJiYgZ20gPiAwICYmIEZGW2ZmXS5HTVtnbV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBGRltmZl0uR01bZ21dO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGRltmZl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBGRjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGZpbGVGb3JtYXQgPSB7fTtcbiAgICAgICAgICAgICAgICBmaWxlRm9ybWF0ID0gY2FsbGJhY2suY2FsbChmaWxlRm9ybWF0LCBGRikgfHwgZmlsZUZvcm1hdDtcblxuICAgICAgICAgICAgaWYgKGZmICYmIGdtKSB7XG4gICAgICAgICAgICAgICAgRkZbZmZdLkdNW2dtXSA9IGZpbGVGb3JtYXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChmZikge1xuICAgICAgICAgICAgICAgIGZpbGVGb3JtYXQuR00gPSBmaWxlRm9ybWF0LkdNIHx8IHt9O1xuICAgICAgICAgICAgICAgIEZGW2ZmXSA9IGZpbGVGb3JtYXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBGRiA9IGZpbGVGb3JtYXQ7XG4gICAgICAgICAgICB9XG4gXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgfSgpKTtcblxuICAgIFNHRkdyb3ZlLmZpbGVGb3JtYXQoe30sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIFR5cGVzID0ge307XG5cbiAgICAgICAgVHlwZXMuc2NhbGFyID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICAgICAgICAgIGFyZ3MgPSBhcmdzIHx8IHt9O1xuXG4gICAgICAgICAgICB2YXIgdGhhdCA9IHt9O1xuXG4gICAgICAgICAgICB2YXIgbGlrZSA9IGFyZ3MubGlrZSB8fCB7IHRlc3Q6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH0gfTtcbiAgICAgICAgICAgIHZhciBwYXJzZSA9IGFyZ3MucGFyc2UgfHwgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHY7IH07XG5cbiAgICAgICAgICAgIHZhciBpc2EgPSBhcmdzLmlzYSB8fCBmdW5jdGlvbiAodikgeyByZXR1cm4gdHlwZW9mIHYgPT09IFwic3RyaW5nXCIgJiYgbGlrZS50ZXN0KHYpOyB9O1xuICAgICAgICAgICAgdmFyIHN0cmluZ2lmeSA9IGFyZ3Muc3RyaW5naWZ5IHx8IFN0cmluZztcblxuICAgICAgICAgICAgdGhhdC5wYXJzZSA9IGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCA9PT0gMSAmJiBsaWtlLnRlc3QodmFsdWVzWzBdKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2UodmFsdWVzWzBdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGF0LnN0cmluZ2lmeSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChpc2EodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbc3RyaW5naWZ5KHZhbHVlKV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoYXQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgVHlwZXMuVW5rbm93biA9IHtcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2ldID0gdmFsdWVzW2ldLnJlcGxhY2UoL1xcXFxcXF0vZywgXCJdXCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RyaW5naWZ5OiBmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWVzKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWVzW2ldID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2ldID0gdmFsdWVzW2ldLnJlcGxhY2UoL1xcXS9nLCBcIlxcXFxdXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5UeXBlcyA9IFR5cGVzO1xuXG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IGZ1bmN0aW9uICh0LCBhcmdzKSB7XG4gICAgICAgICAgICB0ID0gdCB8fCBUeXBlcztcbiAgICAgICAgICAgIGFyZ3MgPSBhcmdzIHx8IHt9O1xuXG4gICAgICAgICAgICB2YXIgdGhhdCA9IHtcbiAgICAgICAgICAgICAgICB0eXBlT2YgICAgICA6IGFyZ3MudHlwZU9mICAgICAgfHwge30sXG4gICAgICAgICAgICAgICAgZGVmYXVsdFR5cGUgOiBhcmdzLmRlZmF1bHRUeXBlIHx8IHQuVW5rbm93bixcbiAgICAgICAgICAgICAgICBpZGVudGlmaWVycyA6IGFyZ3MuaWRlbnRpZmllcnMgfHwgeyB0ZXN0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBmYWxzZTsgfSB9LFxuICAgICAgICAgICAgICAgIHJlcGxhY2VyICAgIDogYXJncy5yZXBsYWNlclxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhhdC5tZXJnZSA9IGZ1bmN0aW9uIChvdGhlcikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGlkZW50IGluIG90aGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvdGhlci5oYXNPd25Qcm9wZXJ0eShpZGVudCkgJiYgb3RoZXJbaWRlbnRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnR5cGVPZltpZGVudF0gPSBvdGhlcltpZGVudF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGF0LnBhcnNlID0gZnVuY3Rpb24gKGlkZW50LCB2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZXBsYWNlcikge1xuICAgICAgICAgICAgICAgICAgICBpZGVudCA9IHRoaXMucmVwbGFjZXIuY2FsbChudWxsLCBpZGVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlkZW50aWZpZXJzLnRlc3QoaWRlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0eXBlID0gdGhpcy50eXBlT2ZbaWRlbnRdIHx8IHRoaXMuZGVmYXVsdFR5cGU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbaWRlbnQsIHR5cGUucGFyc2UodmFsdWVzKV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhhdC5zdHJpbmdpZnkgPSBmdW5jdGlvbiAoaWRlbnQsIHZhbHVlcykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlkZW50aWZpZXJzLnRlc3QoaWRlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0eXBlID0gdGhpcy50eXBlT2ZbaWRlbnRdIHx8IHRoaXMuZGVmYXVsdFR5cGU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0eXBlLnN0cmluZ2lmeSh2YWx1ZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB0aGF0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybjtcbiAgICB9KTtcblxuICAgIC8vIEZpbGUgRm9ybWF0ICg7RkZbNF0pXG4gICAgLy8gaHR0cDovL3d3dy5yZWQtYmVhbi5jb20vc2dmL3NnZjQuaHRtbFxuICAgIC8vIGh0dHA6Ly93d3cucmVkLWJlYW4uY29tL3NnZi9wcm9wZXJ0aWVzLmh0bWxcbiAgICBTR0ZHcm92ZS5maWxlRm9ybWF0KHsgRkY6IDQgfSwgZnVuY3Rpb24gKEZGKSB7XG4gICAgICAgIHZhciBUeXBlcyA9IE9iamVjdC5jcmVhdGUoRkYuVHlwZXMpO1xuICAgICAgICB2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbiAgICAgICAgVHlwZXMuY29tcG9zZSA9IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIGxlZnQgJiYgcmlnaHQgJiYge1xuICAgICAgICAgICAgICAgIGVzY2FwZTogZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHYucmVwbGFjZSgvOi9nLCBcIlxcXFw6XCIpOyB9LFxuICAgICAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdiA9IC9eKCg/OlxcXFxbXFxTXFxzXXxbXjpcXFxcXSspKik6KCg/OlxcXFxbXFxTXFxzXXxbXjpcXFxcXSspKikkLy5leGVjKHZhbHVlc1swXSkgfHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGwgPSB2ICYmIGxlZnQucGFyc2UoW3ZbMV1dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByID0gdiAmJiByaWdodC5wYXJzZShbdlsyXV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGwgIT09IHVuZGVmaW5lZCAmJiByICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2wsIHJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbCA9IGxlZnQuc3RyaW5naWZ5KHZhbHVlWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByID0gcmlnaHQuc3RyaW5naWZ5KHZhbHVlWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsICYmIHIgJiYgW3RoaXMuZXNjYXBlKGxbMF0pK1wiOlwiK3RoaXMuZXNjYXBlKHJbMF0pXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgVHlwZXMubGlzdE9mID0gZnVuY3Rpb24gKHNjYWxhciwgYXJncykge1xuICAgICAgICAgICAgYXJncyA9IGFyZ3MgfHwge307XG5cbiAgICAgICAgICAgIHJldHVybiBzY2FsYXIgJiYge1xuICAgICAgICAgICAgICAgIGNhbkJlRW1wdHk6IGFyZ3MuY2FuQmVFbXB0eSxcbiAgICAgICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDEgJiYgdmFsdWVzWzBdID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jYW5CZUVtcHR5ID8gcmVzdWx0IDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtpXSA9IHNjYWxhci5wYXJzZShbdmFsdWVzW2ldXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0W2ldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3RyaW5naWZ5OiBmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNBcnJheSh2YWx1ZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbkJlRW1wdHkgPyBbXCJcIl0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2ldID0gc2NhbGFyLnN0cmluZ2lmeSh2YWx1ZXNbaV0pWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCByZXN1bHRbaV0gPT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdG9FbGlzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3RoZXIgPSBPYmplY3QuY3JlYXRlKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICBvdGhlci5jYW5CZUVtcHR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG90aGVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgVHlwZXMuZWxpc3RPZiA9IGZ1bmN0aW9uIChzY2FsYXIpIHtcbiAgICAgICAgICAgIHJldHVybiBUeXBlcy5saXN0T2Yoc2NhbGFyLCB7XG4gICAgICAgICAgICAgICAgY2FuQmVFbXB0eTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgVHlwZXMub3IgPSBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGEgJiYgYiAmJiB7XG4gICAgICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGEucGFyc2UodmFsdWVzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCAhPT0gdW5kZWZpbmVkID8gcmVzdWx0IDogYi5wYXJzZSh2YWx1ZXMpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3RyaW5naWZ5OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEuc3RyaW5naWZ5KHZhbHVlKSB8fCBiLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBOdW1iZXIgPSBbXCIrXCJ8XCItXCJdIERpZ2l0IHtEaWdpdH1cbiAgICAgICAgVHlwZXMuTnVtYmVyID0gVHlwZXMuc2NhbGFyKHtcbiAgICAgICAgICAgIGxpa2U6IC9eWystXT9cXGQrJC8sXG4gICAgICAgICAgICBpc2E6IFNHRkdyb3ZlLlV0aWwuaXNJbnRlZ2VyLFxuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh2KSB7IHJldHVybiBwYXJzZUludCh2LCAxMCk7IH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTm9uZSA9IFwiXCJcbiAgICAgICAgVHlwZXMuTm9uZSA9IFR5cGVzLnNjYWxhcih7XG4gICAgICAgICAgICBsaWtlOiB7IHRlc3Q6IGZ1bmN0aW9uICh2KSB7IHJldHVybiB2ID09PSBcIlwiOyB9IH0sXG4gICAgICAgICAgICBpc2E6IGZ1bmN0aW9uICh2KSB7IHJldHVybiB2ID09PSBudWxsOyB9LFxuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG51bGw7IH0sXG4gICAgICAgICAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFwiXCI7IH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUmVhbCA9IE51bWJlciBbXCIuXCIgRGlnaXQgeyBEaWdpdCB9XVxuICAgICAgICBUeXBlcy5SZWFsID0gVHlwZXMuc2NhbGFyKHtcbiAgICAgICAgICAgIGxpa2U6IC9eWystXT9cXGQrKD86XFwuXFxkKyk/JC8sXG4gICAgICAgICAgICBpc2E6IFNHRkdyb3ZlLlV0aWwuaXNOdW1iZXIsXG4gICAgICAgICAgICBwYXJzZTogcGFyc2VGbG9hdFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBEb3VibGUgPSAoXCIxXCIgfCBcIjJcIilcbiAgICAgICAgVHlwZXMuRG91YmxlID0gVHlwZXMuc2NhbGFyKHtcbiAgICAgICAgICAgIGxpa2U6IC9eWzEyXSQvLFxuICAgICAgICAgICAgaXNhOiBmdW5jdGlvbiAodikgeyByZXR1cm4gdiA9PT0gMSB8fCB2ID09PSAyOyB9LFxuICAgICAgICAgICAgcGFyc2U6IHBhcnNlSW50XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIENvbG9yID0gKFwiQlwiIHwgXCJXXCIpXG4gICAgICAgIFR5cGVzLkNvbG9yID0gVHlwZXMuc2NhbGFyKHtcbiAgICAgICAgICAgIGxpa2U6IC9eW0JXXSQvXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRleHQgPSB7IGFueSBjaGFyYWN0ZXIgfVxuICAgICAgICBUeXBlcy5UZXh0ID0gVHlwZXMuc2NhbGFyKHtcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBzb2Z0IGxpbmVicmVha3NcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZSgvXFxcXCg/Olxcblxccj98XFxyXFxuPykvZywgXCJcIikuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnZlcnQgd2hpdGUgc3BhY2VzIG90aGVyIHRoYW4gbGluZWJyZWFrcyB0byBzcGFjZVxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlKC9bXlxcU1xcblxccl0vZywgXCIgXCIpLlxuICAgICAgICAgICAgICAgICAgICAvLyBpbnNlcnQgZXNjYXBlZCBjaGFycyB2ZXJiYXRpbVxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlKC9cXFxcKFtcXFNcXHNdKS9nLCBcIiQxXCIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoLyhbXFxdXFxcXF0pL2csIFwiXFxcXCQxXCIpOyAvLyBlc2NhcGUgXCJdXCIgYW5kIFwiXFxcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBTaW1wbGVUZXh0ID0geyBhbnkgY2hhcmFjdGVyIH1cbiAgICAgICAgVHlwZXMuU2ltcGxlVGV4dCA9IFR5cGVzLnNjYWxhcih7XG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLlxuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgc29mdCBsaW5lYnJlYWtzXG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2UoL1xcXFwoPzpcXG5cXHI/fFxcclxcbj8pL2csIFwiXCIpLlxuICAgICAgICAgICAgICAgICAgICAvLyBjb252ZXJ0IHdoaXRlIHNwYWNlcyBvdGhlciB0aGFuIHNwYWNlIHRvIHNwYWNlIGV2ZW4gaWYgaXQncyBlc2NhcGVkXG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2UoL1xcXFw/W15cXFMgXS9nLCBcIiBcIikuXG4gICAgICAgICAgICAgICAgICAgIC8vIGluc2VydCBlc2NhcGVkIGNoYXJzIHZlcmJhdGltXG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2UoL1xcXFwoW1xcU1xcc10pL2csIFwiJDFcIik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RyaW5naWZ5OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvKFtcXF1cXFxcXSkvZywgXCJcXFxcJDFcIik7IC8vIGVzY2FwZSBcIl1cIiBhbmQgXCJcXFwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuVHlwZXMgPSBUeXBlcztcblxuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgdCA9IHQgfHwgVHlwZXM7XG5cbiAgICAgICAgICAgIHJldHVybiBGRi5wcm9wZXJ0aWVzKHQsIHtcbiAgICAgICAgICAgICAgICBpZGVudGlmaWVyczogL15bQS1aXSskLyxcbiAgICAgICAgICAgICAgICB0eXBlT2Y6IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTW92ZSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgIEIgIDogdC5Nb3ZlLFxuICAgICAgICAgICAgICAgICAgICBLTyA6IHQuTm9uZSxcbiAgICAgICAgICAgICAgICAgICAgTU4gOiB0Lk51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgVyAgOiB0Lk1vdmUsXG4gICAgICAgICAgICAgICAgICAgIC8vIFNldHVwIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgQUIgOiB0Lmxpc3RPZlN0b25lIHx8IHQubGlzdE9mKHQuU3RvbmUpLFxuICAgICAgICAgICAgICAgICAgICBBRSA6IHQubGlzdE9mUG9pbnQsXG4gICAgICAgICAgICAgICAgICAgIEFXIDogdC5saXN0T2ZTdG9uZSB8fCB0Lmxpc3RPZih0LlN0b25lKSxcbiAgICAgICAgICAgICAgICAgICAgUEwgOiB0LkNvbG9yLFxuICAgICAgICAgICAgICAgICAgICAvLyBOb2RlIGFubm90YXRpb24gcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICBDICA6IHQuVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgRE0gOiB0LkRvdWJsZSxcbiAgICAgICAgICAgICAgICAgICAgR0IgOiB0LkRvdWJsZSxcbiAgICAgICAgICAgICAgICAgICAgR1cgOiB0LkRvdWJsZSxcbiAgICAgICAgICAgICAgICAgICAgSE8gOiB0LkRvdWJsZSxcbiAgICAgICAgICAgICAgICAgICAgTiAgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIFVDIDogdC5Eb3VibGUsXG4gICAgICAgICAgICAgICAgICAgIFYgIDogdC5SZWFsLFxuICAgICAgICAgICAgICAgICAgICAvLyBNb3ZlIGFubm90YXRpb24gcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICBCTSA6IHQuRG91YmxlLFxuICAgICAgICAgICAgICAgICAgICBETyA6IHQuTm9uZSxcbiAgICAgICAgICAgICAgICAgICAgSVQgOiB0Lk5vbmUsXG4gICAgICAgICAgICAgICAgICAgIFRFIDogdC5Eb3VibGUsXG4gICAgICAgICAgICAgICAgICAgIC8vIE1hcmt1cCBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgIEFSIDogdC5saXN0T2YodC5jb21wb3NlKHQuUG9pbnQsIHQuUG9pbnQpKSxcbiAgICAgICAgICAgICAgICAgICAgQ1IgOiB0Lmxpc3RPZlBvaW50LFxuICAgICAgICAgICAgICAgICAgICBERCA6IHQuZWxpc3RPZlBvaW50LFxuICAgICAgICAgICAgICAgICAgICBMQiA6IHQubGlzdE9mKHQuY29tcG9zZSh0LlBvaW50LCB0LlNpbXBsZVRleHQpKSxcbiAgICAgICAgICAgICAgICAgICAgTE4gOiB0Lmxpc3RPZih0LmNvbXBvc2UodC5Qb2ludCwgdC5Qb2ludCkpLFxuICAgICAgICAgICAgICAgICAgICBNQSA6IHQubGlzdE9mUG9pbnQsXG4gICAgICAgICAgICAgICAgICAgIFNMIDogdC5saXN0T2ZQb2ludCxcbiAgICAgICAgICAgICAgICAgICAgU1EgOiB0Lmxpc3RPZlBvaW50LFxuICAgICAgICAgICAgICAgICAgICBUUiA6IHQubGlzdE9mUG9pbnQsXG4gICAgICAgICAgICAgICAgICAgIC8vIFJvb3QgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICBBUCA6IHQuY29tcG9zZSh0LlNpbXBsZVRleHQsIHQuU2ltcGxlVGV4dCksXG4gICAgICAgICAgICAgICAgICAgIENBIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBGRiA6IHQuTnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBHTSA6IHQuTnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBTVCA6IHQuTnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBTWiA6IHQub3IodC5OdW1iZXIsIHQuY29tcG9zZSh0Lk51bWJlciwgdC5OdW1iZXIpKSxcbiAgICAgICAgICAgICAgICAgICAgLy8gR2FtZSBpbmZvIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgQU4gOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIEJSIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBCVCA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgQ1AgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIERUIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBFViA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgR04gOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIEdDIDogdC5UZXh0LFxuICAgICAgICAgICAgICAgICAgICBPTiA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgT1QgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIFBCIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBQQyA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgUFcgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIFJFIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBSTyA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgUlUgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIFNPIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBUTSA6IHQuUmVhbCxcbiAgICAgICAgICAgICAgICAgICAgVVMgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIFdSIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBXVCA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgLy8gVGltaW5nIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgQkwgOiB0LlJlYWwsXG4gICAgICAgICAgICAgICAgICAgIE9CIDogdC5OdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIE9XIDogdC5OdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIFdMIDogdC5SZWFsLFxuICAgICAgICAgICAgICAgICAgICAvLyBNaXNjZWxsYW5lb3VzIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgRkcgOiB0Lm9yKHQuTm9uZSwgdC5jb21wb3NlKHQuTnVtYmVyLCB0LlNpbXBsZVRleHQpKSxcbiAgICAgICAgICAgICAgICAgICAgUE0gOiB0Lk51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgVk0gOiB0LmVsaXN0T2ZQb2ludFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybjtcbiAgICB9KTtcblxuICAgIC8vIEdvICg7RkZbNF1HTVsxXSkgc3BlY2lmaWMgcHJvcGVydGllc1xuICAgIC8vIGh0dHA6Ly93d3cucmVkLWJlYW4uY29tL3NnZi9nby5odG1sXG4gICAgU0dGR3JvdmUuZmlsZUZvcm1hdCh7IEZGOiA0LCBHTTogMSB9LCBmdW5jdGlvbiAoRkYpIHtcbiAgICAgICAgdmFyIFR5cGVzID0gT2JqZWN0LmNyZWF0ZShGRls0XS5UeXBlcyk7XG5cbiAgICAgICAgdmFyIGV4cGFuZFBvaW50TGlzdCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY29vcmQgPSBcImFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6XCI7XG4gICAgICAgICAgICAgICAgY29vcmQgKz0gY29vcmQudG9VcHBlckNhc2UoKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChwMSwgcDIpIHtcbiAgICAgICAgICAgICAgICB2YXIgeDEgPSBjb29yZC5pbmRleE9mKHAxLmNoYXJBdCgwKSksXG4gICAgICAgICAgICAgICAgICAgIHkxID0gY29vcmQuaW5kZXhPZihwMS5jaGFyQXQoMSkpLFxuICAgICAgICAgICAgICAgICAgICB4MiA9IGNvb3JkLmluZGV4T2YocDIuY2hhckF0KDApKSxcbiAgICAgICAgICAgICAgICAgICAgeTIgPSBjb29yZC5pbmRleE9mKHAyLmNoYXJBdCgxKSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgaDsgXG4gICAgICAgICAgICAgICAgaWYgKHgxID4geDIpIHtcbiAgICAgICAgICAgICAgICAgICAgaCA9IHgxOyB4MSA9IHgyOyB4MiA9IGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh5MSA+IHkyKSB7XG4gICAgICAgICAgICAgICAgICAgIGggPSB5MTsgeTEgPSB5MjsgeTIgPSBoO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBwb2ludHMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB5ID0geTE7IHkgPD0geTI7IHkrKykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0geDE7IHggPD0geDI7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY29vcmQuY2hhckF0KHgpK2Nvb3JkLmNoYXJBdCh5KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnRzO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSgpKTtcblxuICAgICAgICBUeXBlcy5Qb2ludCA9IFR5cGVzLnNjYWxhcih7XG4gICAgICAgICAgICBsaWtlOiAvXlthLXpBLVpdezJ9JC9cbiAgICAgICAgfSk7XG4gIFxuICAgICAgICBUeXBlcy5TdG9uZSA9IFR5cGVzLlBvaW50O1xuICAgICAgICBUeXBlcy5Nb3ZlICA9IFR5cGVzLm9yKFR5cGVzLk5vbmUsIFR5cGVzLlBvaW50KTtcblxuICAgICAgICBUeXBlcy5saXN0T2ZQb2ludCA9IChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgdmFyIGxpc3RPZlBvaW50ID0gdC5saXN0T2YodC5vcihcbiAgICAgICAgICAgICAgICB0LlBvaW50LFxuICAgICAgICAgICAgICAgIHQuc2NhbGFyKHtcbiAgICAgICAgICAgICAgICAgICAgbGlrZTogL15bYS16QS1aXXsyfTpbYS16QS1aXXsyfSQvLFxuICAgICAgICAgICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVjdCA9IHZhbHVlLnNwbGl0KFwiOlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBleHBhbmRQb2ludExpc3QocmVjdFswXSwgcmVjdFsxXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKSk7XG5cbiAgICAgICAgICAgIHZhciBwYXJzZSA9IGxpc3RPZlBvaW50LnBhcnNlO1xuICAgICAgICAgICAgdmFyIGFycmF5ID0gW107XG5cbiAgICAgICAgICAgIGxpc3RPZlBvaW50LnBhcnNlID0gZnVuY3Rpb24gKHZhbHVlcykge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBwYXJzZS5jYWxsKHRoaXMsIHZhbHVlcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCAmJiBhcnJheS5jb25jYXQuYXBwbHkoYXJyYXksIHJlc3VsdCk7IC8vIGZsYXR0ZW5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBsaXN0T2ZQb2ludDtcbiAgICAgICAgfShUeXBlcykpO1xuXG4gICAgICAgIFR5cGVzLmVsaXN0T2ZQb2ludCA9IFR5cGVzLmxpc3RPZlBvaW50LnRvRWxpc3QoKTtcblxuICAgICAgICBUeXBlcy5saXN0T2ZTdG9uZSAgPSBUeXBlcy5saXN0T2ZQb2ludDtcbiAgICAgICAgVHlwZXMuZWxpc3RPZlN0b25lID0gVHlwZXMuZWxpc3RPZlBvaW50O1xuICAgIFxuICAgICAgICB0aGlzLlR5cGVzID0gVHlwZXM7XG5cbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHQgPSB0IHx8IFR5cGVzO1xuXG4gICAgICAgICAgICB2YXIgdGhhdCA9IEZGWzRdLnByb3BlcnRpZXModCk7XG5cbiAgICAgICAgICAgIHRoYXQubWVyZ2Uoe1xuICAgICAgICAgICAgICAgIEhBIDogdC5OdW1iZXIsXG4gICAgICAgICAgICAgICAgS00gOiB0LlJlYWwsXG4gICAgICAgICAgICAgICAgVEIgOiB0LmVsaXN0T2ZQb2ludCxcbiAgICAgICAgICAgICAgICBUVyA6IHQuZWxpc3RPZlBvaW50XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoYXQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH0pO1xuXG4gICAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gU0dGR3JvdmU7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgd2luZG93LlNHRkdyb3ZlID0gU0dGR3JvdmU7XG4gICAgfVxuXG59KCkpO1xuXG4iLCJpbXBvcnQgeyBTdGF0ZSwgTW92ZSB9IGZyb20gXCIuL21vZGVsc1wiO1xuaW1wb3J0IFJ1bGVTZXJ2aWNlIGZyb20gXCIuL3J1bGUuc2VydmljZVwiO1xuaW1wb3J0IEtpZnVTZXJ2aWNlIGZyb20gXCIuL2tpZnUuc2VydmljZVwiO1xuXG5jbGFzcyBCb2FyZFNlcnZpY2Uge1xuICBib2FyZDogYW55ID0gW107XG4gIHJ1bGVTZXJ2aWNlID0gbmV3IFJ1bGVTZXJ2aWNlKCk7XG4gIGtpZnVTZXJ2aWNlID0gbmV3IEtpZnVTZXJ2aWNlKCk7XG4gIGhpc3Rvcnk6IGFueVtdID0gW107XG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gIH1cblxuICBpbml0KHNpemU6IG51bWJlcikge1xuICAgIHRoaXMuaGlzdG9yeSA9IFtdO1xuICAgIHRoaXMuYm9hcmQgPSB0aGlzLmxpbmUoc2l6ZSkubWFwKChfLCB4KSA9PiB0aGlzLmxpbmUoc2l6ZSkpLm1hcCgoXywgeCkgPT4gXy5tYXAoKF8sIHkpID0+IHRoaXMuY3JlYXRlUG9pbnQoeCwgeSkpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNyZWF0ZVBvaW50ID0gKHg6IG51bWJlciwgeTogbnVtYmVyLCBzdGF0ZSA9IG51bGwpID0+ICh7IHN0YXRlOiBzdGF0ZSwgb3JkZXI6IDAgfSk7XG5cbiAgbGluZSA9IChzOiBudW1iZXIpID0+IEFycmF5KHMpLmZpbGwoJycpO1xuICBhdCA9ICh4OiBudW1iZXIsIHk6IG51bWJlcik6IE1vdmUgPT4gdGhpcy5ib2FyZFt4XVt5XTtcblxuICBwbGF5KHg6IG51bWJlciwgeTogbnVtYmVyLCBvcmRlciA9IHRoaXMuaGlzdG9yeS5sZW5ndGgpIHtcbiAgICBjb25zdCB2YWxpZFN0YXRlID0gdGhpcy5ydWxlU2VydmljZS52YWxpZGF0ZSh0aGlzLmJvYXJkLCB7XG4gICAgICBzdGF0ZTogb3JkZXIgJSAyID8gU3RhdGUuV0hJVEUgOiBTdGF0ZS5CTEFDSyxcbiAgICAgIG9yZGVyOiBvcmRlcixcbiAgICAgIHg6IHgsXG4gICAgICB5OiB5XG4gICAgfSlcblxuICAgIGlmICh2YWxpZFN0YXRlKSB7XG4gICAgICB0aGlzLmJvYXJkID0gdmFsaWRTdGF0ZTtcbiAgICAgIHRoaXMuaGlzdG9yeSA9IFsuLi50aGlzLmhpc3RvcnksIE9iamVjdC5hc3NpZ24oe30sIHZhbGlkU3RhdGVbeF1beV0pXTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaWJlcnRpZXNBdCh4OiBudW1iZXIsIHk6IG51bWJlcik6IG51bWJlciB7XG4gICAgY29uc3QgbSA9IHRoaXMuYXQoeCwgeSk7XG4gICAgcmV0dXJuIG0gPyB0aGlzLnJ1bGVTZXJ2aWNlLmxpYmVydGllcyh0aGlzLmJvYXJkLCBtKS5sZW5ndGggOiAwO1xuICB9XG5cbiAgc2hvdygpIHtcbiAgICAvLyBcbiAgICBjb25zb2xlLmxvZyh0aGlzLmJvYXJkLm1hcChsID0+IGwubWFwKHAgPT4gcC5zdGF0ZSA/IHAuc3RhdGUgOiAnJykpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCb2FyZFNlcnZpY2U7IiwiZXhwb3J0ICogZnJvbSBcIi4vYm9hcmQuc2VydmljZVwiOyIsImltcG9ydCAqIGFzIHNnZmdyb3ZlIGZyb20gJ3NnZmdyb3ZlJ1xuaW1wb3J0IHsgQkxBQ0ssIFdISVRFIH0gZnJvbSAnLi9tb2RlbHMnO1xuY2xhc3MgS2lmdVNlcnZpY2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgcmVhZChzdmcpIHtcbiAgICAgICAgY29uc3QgW1tbbWV0YSwgLi4uZ2FtZV1dXSA9IHNnZmdyb3ZlLnBhcnNlKHN2Zyk7XG4gICAgICAgIGNvbnN0IHsgUEIsIFBXLCBCUiwgV1IsIFNaLCBLTSwgUlUsIEdOLCBDUCwgVVMsIEFOLCAuLi5yZXN0IH0gPSBtZXRhO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGxheWVyczogW1xuICAgICAgICAgICAgICAgIHsgY29sb3I6IEJMQUNLLCBuYW1lOiBQQiwgbGV2ZWw6IEJSIH0sXG4gICAgICAgICAgICAgICAgeyBjb2xvcjogV0hJVEUsIG5hbWU6IFBXLCBsZXZlbDogV1IgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBpbmZvOiB7XG4gICAgICAgICAgICAgICAgc2l6ZTogU1osXG4gICAgICAgICAgICAgICAga29taTogS00sXG4gICAgICAgICAgICAgICAgcnVsZTogUlUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWV0YToge1xuICAgICAgICAgICAgICAgIG5hbWU6IEdOLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogQ1AsXG4gICAgICAgICAgICAgICAgc2NyaWJlOiBVUyxcbiAgICAgICAgICAgICAgICBjb21tZW50YXRvcjogQU5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN0LFxuICAgICAgICAgICAgZ2FtZVxuICAgICAgICB9O1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgS2lmdVNlcnZpY2U7IiwiZXhwb3J0IGNvbnN0IEFQUE5BTUUgPSBcInRlbmdlbi5qc1wiO1xuZXhwb3J0IGNvbnN0IFZFUiA9IFwiMC4xXCI7XG5cbmV4cG9ydCBjb25zdCBFTVBUWTogYW55ID0gbnVsbDtcbmV4cG9ydCBjb25zdCBCTEFDSyA9IFwiYmxhY2tcIjtcbmV4cG9ydCBjb25zdCBXSElURSA9IFwid2hpdGVcIjtcbmV4cG9ydCBjb25zdCBQQVNTID0gXCJwYXNzXCI7XG5leHBvcnQgY29uc3QgVU5ETyA9IFwidW5kb1wiO1xuZXhwb3J0IGNvbnN0IEFCQU5ET04gPSBcImFiYW5kb25cIjtcbmV4cG9ydCBjb25zdCBORVhUID0gXCJuZXh0XCI7XG5leHBvcnQgY29uc3QgUFJFViA9IFwicHJldlwiO1xuZXhwb3J0IGNvbnN0IEVORCA9IFwiZW5kX2dhbWVcIjtcbmV4cG9ydCBjb25zdCBTVEFSVCA9IFwic3RhcnRfZ2FtZVwiO1xuXG5leHBvcnQgZW51bSBTdGF0ZSB7XG4gIEJMQUNLID0gJ2JsYWNrJyxcbiAgV0hJVEUgPSAnd2hpdGUnLFxuICBLTyA9ICdrbycsXG59IFxuZXhwb3J0IGludGVyZmFjZSBNb3ZlIHtcbiAgc3RhdGU6IFN0YXRlIHwgbnVsbCxcbiAgdXBkYXRlZF9hdD86IERhdGUsXG4gIG9yZGVyOiBudW1iZXIsIFxuICB4Om51bWJlclxuICB5Om51bWJlcixcbiAgbG9nPzogTW92ZVtdLFxuICBjYXB0dXJlZD86IFtdXG59XG5cbi8qXG5leHBvcnQgY29uc3QgYWxwaGFiZXQgPSAocyA9IDI2KSA9PiB7XG4gIHJldHVybiBuZXcgQXJyYXkocykuZmlsbCgxKS5tYXAoKF86YW55LCBpOm51bWJlcikgPT4gU3RyaW5nLmZyb21DaGFyQ29kZSg5NyArIGkpKTtcbn07XG5cbmV4cG9ydCBjb25zdCBhMm4gPSAoYSA6IHN0cmluZykgPT4ge1xuICByZXR1cm4gYWxwaGFiZXQoKS5pbmRleE9mKGEpO1xufTtcbmV4cG9ydCBjb25zdCBuMmEgPSAobjogbnVtYmVyKSA9PiB7XG4gIHJldHVybiBhbHBoYWJldCgpW25dO1xufTtcblxuZXhwb3J0IGNvbnN0IHRvQ29vcmQgPSAobm9kZTogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9KSA9PiB7XG4gIGNvbnN0IHsgeCwgeSB9ID0gbm9kZTtcbiAgcmV0dXJuIG4yYSh4KSArIG4yYSh5KTtcbn07XG5leHBvcnQgY29uc3QgZnJvbVNHRkNvb3JkID0gKHNnZm5vZGU6IGFueSkgPT4ge1xuICBjb25zdCBtb3ZlID0gc2dmbm9kZS5CIHx8IHNnZm5vZGUuVztcbiAgaWYgKG1vdmUpIHtcbiAgICBjb25zdCBbeCwgeV0gPSBtb3ZlLnNwbGl0KFwiXCIpO1xuICAgIHJldHVybiB7IHg6IGEybih4KSwgeTogYTJuKHkpIH07XG4gIH1cbiAgcmV0dXJuIHsgeDogbnVsbCwgeTogbnVsbCB9O1xufTtcblxuZXhwb3J0IGludGVyZmFjZSBJdGVtIHtcbiAgaWQ/OiBhbnk7XG4gIGNyZWF0ZWRBdD86IERhdGUgfCBudWxsO1xuICB1cGRhdGVkQXQ/OiBEYXRlIHwgbnVsbDtcbiAgZGVsZXRlZEF0PzogRGF0ZSB8IG51bGw7XG4gIGF1dGhvcj86IFBsYXllcjtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQ29tbWVudCB7XG4gIG9yZGVyOiBudW1iZXI7XG4gIHRleHQ6IHN0cmluZztcbiAgdGltZT86IERhdGU7XG4gIG1vdmU/OiBhbnk7XG59XG5leHBvcnQgaW50ZXJmYWNlIEdhbWVTZXR0aW5ncyBleHRlbmRzIEl0ZW0ge1xuICB3aGl0ZTogUGxheWVyO1xuICBibGFjazogUGxheWVyO1xuICBzaXplOiBudW1iZXI7XG4gIHNjb3JlczogU2NvcmVCb2FyZDtcbiAgdGl0bGU/OiBzdHJpbmc7XG4gIGtvbWk/OiBudW1iZXI7XG4gIGNsb2NrPzogYW55O1xuICBib2FyZD86IGFueTtcbiAgZXZlbnQ/OiBzdHJpbmc7XG4gIHJvdW5kPzogbnVtYmVyO1xuICBkYXRlPzogRGF0ZTtcbiAgbG9jYXRpb24/OiBzdHJpbmc7XG4gIGNvbW1lbnRzPzogQ29tbWVudFtdO1xuICB0cmVlPzogYW55W107XG4gIG5lZWRDb25maXJtOiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdhbWVMaXN0SXRlbSB7XG4gIG5hbWU6IHN0cmluZztcbiAgdXBkYXRlZF9hdDogYW55O1xuICB0aW1lc3RhbXA6IG51bWJlcjtcbiAga2V5OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGxheWVyIGV4dGVuZHMgSXRlbSB7XG4gIG5hbWU6IHN0cmluZztcbiAgcmFuaz86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTY29yZUJvYXJkIGV4dGVuZHMgSXRlbSB7XG4gIGJsYWNrOiBTY29yZSB8IG51bGw7XG4gIHdoaXRlOiBTY29yZSB8IG51bGw7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2NvcmUgZXh0ZW5kcyBJdGVtIHtcbiAgY2FwdHVyZWQ/OiBudW1iZXI7XG4gIHRlcnJpdG9yeT86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNb3ZlIGV4dGVuZHMgSXRlbSB7XG4gIHg/OiBudW1iZXI7XG4gIHk/OiBudW1iZXI7XG4gIHBsYXllcjogYW55O1xuICBzdGF0ZTogYW55O1xuICBsZWFmcz86IE1vdmVbXTtcbiAgb3JkZXI/OiBudW1iZXI7XG4gIGluSGlzdG9yeT86IGJvb2xlYW47XG4gIGNhcHR1cmVkPzogTW92ZVtdO1xuICBwbGF5ZWQ6IGJvb2xlYW47XG4gIGNvbW1lbnRzPzogYW55W107XG4gIHRpbWU/OiBudW1iZXI7XG59XG4qLyIsImltcG9ydCB7IE1vdmUsIFN0YXRlIH0gZnJvbSBcIi4vbW9kZWxzXCI7XG5cbmNsYXNzIFJ1bGVTZXJ2aWNlIHtcbiAgICB2YWxpZGF0ZShnYW1lLCBtdjogTW92ZSkge1xuICAgICAgICBsZXQgbmV4dFN0YXRlID0gWy4uLmdhbWUuc2xpY2UoKV07XG4gICAgICAgIGNvbnN0IGhhc0xpYmVydGllcyA9IG0gPT4gdGhpcy5saWJlcnRpZXMobmV4dFN0YXRlLCBtKS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGlzQ2FwdHVyaW5nID0gbSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXh0ID0gWy4uLmdhbWUuc2xpY2UoKV07XG4gICAgICAgICAgICBuZXh0W212LnhdW212LnldID0gbXY7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYXB0dXJlZChuZXh0LCBtKS5sZW5ndGhcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgaXNLb1Byb3RlY3RlZCA9IG0gPT4gZ2FtZVttLnhdW20ueV0uc3RhdGUgPT09IFN0YXRlLktPXG4gICAgICAgIGNvbnN0IGlzRnJlZSA9IG0gPT4gIWdhbWVbbS54XVttLnldLnN0YXRlO1xuICAgICAgICBjb25zdCB2YWxpZCA9IG0gPT4gaXNGcmVlKG0pICYmIChpc0NhcHR1cmluZyhtKSB8fCBoYXNMaWJlcnRpZXMobSkpICYmICFpc0tvUHJvdGVjdGVkKG0pO1xuICAgICAgICBjb25zdCBpc0tvU2l0dWF0aW9uID0gbSA9PiBtLmNhcHR1cmVkLmxlbmd0aCA9PT0gMSAmJiAhdGhpcy5saWJlcnRpZXMobmV4dFN0YXRlLCBtKS5sZW5ndGg7XG5cbiAgICAgICAgaWYgKHZhbGlkKG12KSkge1xuICAgICAgICAgICAgbmV4dFN0YXRlID0gdGhpcy5yZXNldEtvKG5leHRTdGF0ZSk7XG4gICAgICAgICAgICBuZXh0U3RhdGVbbXYueF1bbXYueV0gPSBtdjtcbiAgICAgICAgICAgIGNvbnN0IGNhcHR1cmVkID0gdGhpcy5jYXB0dXJlZChuZXh0U3RhdGUsIG12KS5yZWR1Y2UoKGMsIGkpID0+IGMuY29uY2F0KGkpLCBbXSk7XG4gICAgICAgICAgICBuZXh0U3RhdGVbbXYueF1bbXYueV0uY2FwdHVyZWQgPSBjYXB0dXJlZC5zbGljZSgpO1xuXG4gICAgICAgICAgICBpZiAoaXNLb1NpdHVhdGlvbihtdikpIHtcbiAgICAgICAgICAgICAgICBuZXh0U3RhdGVbY2FwdHVyZWRbMF0ueF1bY2FwdHVyZWRbMF0ueV0uc3RhdGUgPSBTdGF0ZS5LTztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGNhcHR1cmVkLnJlZHVjZSgocCwgYykgPT4ge1xuICAgICAgICAgICAgICAgIHBbYy54XVtjLnldLnN0YXRlID0gYy5zdGF0ZSA9PT0gU3RhdGUuS09cbiAgICAgICAgICAgICAgICAgICAgPyBTdGF0ZS5LTyA6IG51bGw7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHA7XG4gICAgICAgICAgICB9LCBuZXh0U3RhdGUpO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHttdi54fToke212Lnl9IHdhcyBub3QgYSB2YWxpZCBtb3ZlICgke2dhbWVbbXYueF1bbXYueV0uc3RhdGV9KWApO1xuICAgIH1cblxuICAgIHJlc2V0S28oc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlLm1hcChsID0+IGwubWFwKHAgPT4ge1xuICAgICAgICAgICAgcC5zdGF0ZSA9IHAuc3RhdGUgPT0gU3RhdGUuS08gPyBudWxsIDogcC5zdGF0ZTtcbiAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICB9KSlcblxuICAgIH1cblxuICAgIGFkamFjZW50KGJvYXJkLCBtb3ZlKSB7XG4gICAgICAgIGNvbnN0IGVuZCA9IGJvYXJkLmxlbmd0aDtcbiAgICAgICAgY29uc3Qgc3RhcnQgPSAwO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgbW92ZS55ID4gc3RhcnQgPyBib2FyZFttb3ZlLnhdW21vdmUueSAtIDFdIDogbnVsbCxcbiAgICAgICAgICAgIG1vdmUueSA8IGVuZCA/IGJvYXJkW21vdmUueF1bbW92ZS55ICsgMV0gOiBudWxsLFxuICAgICAgICAgICAgbW92ZS54ID4gc3RhcnQgPyBib2FyZFttb3ZlLnggLSAxXVttb3ZlLnldIDogbnVsbCxcbiAgICAgICAgICAgIG1vdmUueCA8IGVuZCA/IGJvYXJkW21vdmUueCArIDFdW21vdmUueV0gOiBudWxsXG4gICAgICAgIF0uZmlsdGVyKGkgPT4gaSk7XG4gICAgfVxuXG4gICAgZ3JvdXAoYm9hcmQsIHBvaW50OiBNb3ZlLCBxdWV1ZTogTW92ZVtdID0gW10sIHZpc2l0ZWQgPSBuZXcgU2V0KCkpOiBNb3ZlW10ge1xuICAgICAgICB2aXNpdGVkLmFkZChgJHtwb2ludC54fToke3BvaW50Lnl9YCk7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKFxuICAgICAgICAgICAgbmV3IFNldChbXG4gICAgICAgICAgICAgICAgcG9pbnQsXG4gICAgICAgICAgICAgICAgLi4ucXVldWUsXG4gICAgICAgICAgICAgICAgLi4udGhpcy5hZGphY2VudChib2FyZCwgcG9pbnQpXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIobiA9PiAhdmlzaXRlZC5oYXMoYCR7bi54fToke24ueX1gKSAmJiBuLnN0YXRlID09PSBwb2ludC5zdGF0ZSlcbiAgICAgICAgICAgICAgICAgICAgLm1hcChuID0+IHRoaXMuZ3JvdXAoYm9hcmQsIG4sIHF1ZXVlLCB2aXNpdGVkKSlcbiAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgdikgPT4gYS5jb25jYXQodiksIFtdKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBzbGliZXJ0aWVzKGJvYXJkLCBtb3ZlOiBNb3ZlKTogTW92ZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRqYWNlbnQoYm9hcmQsIG1vdmUpLmZpbHRlcihpID0+ICFpLnN0YXRlKTtcbiAgICB9XG5cbiAgICBsaWJlcnRpZXMoYm9hcmQsIG1vdmU6IE1vdmUsIGNhcD86IE1vdmUpOiBNb3ZlW10ge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShcbiAgICAgICAgICAgIG5ldyBTZXQoXG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cChib2FyZCwgbW92ZSlcbiAgICAgICAgICAgICAgICAgICAgLm1hcChtID0+IHRoaXMuc2xpYmVydGllcyhib2FyZCwgbSkpXG4gICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIHYpID0+IGEuY29uY2F0KHYpLCBbXSlcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihsID0+IGwueCAhPT0gbW92ZS54IHx8IGwueSAhPT0gbW92ZS55KVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGwgPT4gIWNhcCB8fCAobC54ICE9PSBjYXAueCB8fCBsLnkgIT09IGNhcC55KSlcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBjYXB0dXJlZChib2FyZCwgbW92ZTogTW92ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGphY2VudChib2FyZCwgbW92ZSlcbiAgICAgICAgICAgIC5maWx0ZXIobSA9PiBtLnN0YXRlICYmIG0uc3RhdGUgIT09IG1vdmUuc3RhdGUpXG4gICAgICAgICAgICAuZmlsdGVyKG8gPT4gIXRoaXMubGliZXJ0aWVzKGJvYXJkLCBvLCBtb3ZlKS5sZW5ndGgpXG4gICAgICAgICAgICAubWFwKGMgPT4gdGhpcy5ncm91cChib2FyZCwgYykpO1xuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFJ1bGVTZXJ2aWNlOyJdLCJzb3VyY2VSb290IjoiIn0=