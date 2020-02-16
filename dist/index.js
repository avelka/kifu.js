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
const models_1 = __webpack_require__(/*! ./models */ "./src/models.ts");
const rule_service_1 = __webpack_require__(/*! ./rule.service */ "./src/rule.service.ts");
class BoardService {
    constructor() {
        this.board = [];
        this.ruleService = new rule_service_1.default();
        this.history = [];
        this.createPoint = (x, y, state = null) => ({ state: state, order: 0 });
        this.line = (s) => Array(s).fill('');
        this.at = (x, y) => this.board[x][y];
    }
    init(size) {
        this.history = [];
        this.board = this.line(size).map((_, x) => this.line(size)).map((_, x) => _.map((_, y) => this.createPoint(x, y)));
        return this;
    }
    play(x, y, order = this.history.length) {
        const validState = this.ruleService.validate(this.board, {
            state: order % 2 ? models_1.State.WHITE : models_1.State.BLACK,
            order: order,
            x: x,
            y: y
        });
        if (validState) {
            this.board = validState;
            this.history = [...this.history, Object.assign({}, validState[x][y])];
        }
        return this;
    }
    libertiesAt(x, y) {
        const m = this.at(x, y);
        return m ? this.ruleService.liberties(this.board, m).length : 0;
    }
    show() {
        // 
        console.log(this.board.map(l => l.map(p => p.state ? p.state : '')));
    }
}
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
const board_service_1 = __webpack_require__(/*! ./board.service */ "./src/board.service.ts");
exports.BoardService = board_service_1.default;
const kifu_service_1 = __webpack_require__(/*! ./kifu.service */ "./src/kifu.service.ts");
exports.KifuService = kifu_service_1.default;
const rule_service_1 = __webpack_require__(/*! ./rule.service */ "./src/rule.service.ts");
exports.RuleService = rule_service_1.default;


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


/***/ }),

/***/ "./src/rule.service.ts":
/*!*****************************!*\
  !*** ./src/rule.service.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __webpack_require__(/*! ./models */ "./src/models.ts");
class RuleService {
    validate(game, mv) {
        let nextState = [...game.slice()];
        const hasLiberties = m => this.liberties(nextState, m).length;
        const isCapturing = m => {
            const next = [...game.slice()];
            next[mv.x][mv.y] = mv;
            return this.captured(next, m).length;
        };
        const isKoProtected = m => game[m.x][m.y].state === models_1.State.KO;
        const isFree = m => !game[m.x][m.y].state;
        const valid = m => isFree(m) && (isCapturing(m) || hasLiberties(m)) && !isKoProtected(m);
        const isKoSituation = m => m.captured.length === 1 && !this.liberties(nextState, m).length;
        if (valid(mv)) {
            nextState = this.resetKo(nextState);
            nextState[mv.x][mv.y] = mv;
            const captured = this.captured(nextState, mv).reduce((c, i) => c.concat(i), []);
            nextState[mv.x][mv.y].captured = captured.slice();
            if (isKoSituation(mv)) {
                nextState[captured[0].x][captured[0].y].state = models_1.State.KO;
            }
            return captured.reduce((p, c) => {
                p[c.x][c.y].state = c.state === models_1.State.KO
                    ? models_1.State.KO : null;
                return p;
            }, nextState);
        }
        throw new Error(`${mv.x}:${mv.y} was not a valid move (${game[mv.x][mv.y].state})`);
    }
    resetKo(state) {
        return state.map(l => l.map(p => {
            p.state = p.state == models_1.State.KO ? null : p.state;
            return p;
        }));
    }
    adjacent(board, move) {
        const end = board.length;
        const start = 0;
        return [
            move.y > start ? board[move.x][move.y - 1] : null,
            move.y < end ? board[move.x][move.y + 1] : null,
            move.x > start ? board[move.x - 1][move.y] : null,
            move.x < end ? board[move.x + 1][move.y] : null
        ].filter(i => i);
    }
    group(board, point, queue = [], visited = new Set()) {
        visited.add(`${point.x}:${point.y}`);
        return Array.from(new Set([
            point,
            ...queue,
            ...this.adjacent(board, point)
                .filter(n => !visited.has(`${n.x}:${n.y}`) && n.state === point.state)
                .map(n => this.group(board, n, queue, visited))
                .reduce((a, v) => a.concat(v), [])
        ]));
    }
    sliberties(board, move) {
        return this.adjacent(board, move).filter(i => !i.state);
    }
    liberties(board, move, cap) {
        return Array.from(new Set(this.group(board, move)
            .map(m => this.sliberties(board, m))
            .reduce((a, v) => a.concat(v), [])
            .filter(l => l.x !== move.x || l.y !== move.y)
            .filter(l => !cap || (l.x !== cap.x || l.y !== cap.y))));
    }
    captured(board, move) {
        return this.adjacent(board, move)
            .filter(m => m.state && m.state !== move.state)
            .filter(o => !this.liberties(board, o, move).length)
            .map(c => this.group(board, c));
    }
}
exports.default = RuleService;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NnZmdyb3ZlL2xpYi9zZ2Zncm92ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYm9hcmQuc2VydmljZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tpZnUuc2VydmljZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWxzLnRzIiwid2VicGFjazovLy8uL3NyYy9ydWxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FB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QyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4QyxDQUFDO0NBQ0o7QUFDRCxrQkFBZSxXQUFXLENBQUMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgU0dGR3JvdmUgPSB7fTtcblxuICAgIFNHRkdyb3ZlLlV0aWwgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgVXRpbCA9IHt9O1xuXG4gICAgICAgIFV0aWwuaXNOdW1iZXIgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIgJiYgaXNGaW5pdGUodmFsdWUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIFV0aWwuaXNJbnRlZ2VyID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gVXRpbC5pc051bWJlcih2YWx1ZSkgJiYgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBVdGlsO1xuICAgIH0oKSk7XG5cbiAgICBTR0ZHcm92ZS5wYXJzZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzb3VyY2UsIGxhc3RJbmRleCwgcmV2aXZlcjtcblxuICAgICAgICAvLyBPdmVycmlkZSBSZWdFeHAncyB0ZXN0IGFuZCBleGVjIG1ldGhvZHMgdG8gbGV0IF4gYmVoYXZlIGxpa2VcbiAgICAgICAgLy8gdGhlIFxcRyBhc3NlcnRpb24gKC9cXEcuLi4vZ2MpLiBTZWUgYWxzbzpcbiAgICAgICAgLy8gaHR0cDovL3Blcmxkb2MucGVybC5vcmcvcGVybG9wLmh0bWwjUmVnZXhwLVF1b3RlLUxpa2UtT3BlcmF0b3JzXG5cbiAgICAgICAgdmFyIFdoaXRlc3BhY2VzID0gL15cXHMqL2csXG4gICAgICAgICAgICBPcGVuUGFyZW4gICA9IC9eXFwoXFxzKi9nLFxuICAgICAgICAgICAgQ2xvc2VQYXJlbiAgPSAvXlxcKVxccyovZyxcbiAgICAgICAgICAgIFNlbWljb2xvbiAgID0gL147XFxzKi9nLFxuICAgICAgICAgICAgUHJvcElkZW50ICAgPSAvXihbYS16QS1aMC05XSspXFxzKi9nLFxuICAgICAgICAgICAgUHJvcFZhbHVlICAgPSAvXlxcWygoPzpcXFxcW1xcU1xcc118W15cXF1cXFxcXSspKilcXF1cXHMqL2c7XG5cbiAgICAgICAgdmFyIHRlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYm9vbCA9IHRoaXMudGVzdChzb3VyY2Uuc2xpY2UobGFzdEluZGV4KSk7XG4gICAgICAgICAgICBsYXN0SW5kZXggKz0gdGhpcy5sYXN0SW5kZXg7XG4gICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICByZXR1cm4gYm9vbDtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZXhlYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcnJheSA9IHRoaXMuZXhlYyhzb3VyY2Uuc2xpY2UobGFzdEluZGV4KSk7XG4gICAgICAgICAgICBsYXN0SW5kZXggKz0gdGhpcy5sYXN0SW5kZXg7XG4gICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHBhcnNlR2FtZVRyZWUgPSBmdW5jdGlvbiAocHJvcGVydGllcykge1xuICAgICAgICAgICAgdmFyIHNlcXVlbmNlID0gW107XG5cbiAgICAgICAgICAgIGlmICghdGVzdC5jYWxsKE9wZW5QYXJlbikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdoaWxlICh0ZXN0LmNhbGwoU2VtaWNvbG9uKSkge1xuICAgICAgICAgICAgICAgIHZhciBub2RlID0ge307XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWRlbnQgPSBleGVjLmNhbGwoUHJvcElkZW50KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaWRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkZW50ID0gaWRlbnRbMV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLmhhc093blByb3BlcnR5KGlkZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiUHJvcGVydHkgXCIraWRlbnQrXCIgYWxyZWFkeSBleGlzdHNcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVzID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ID0gZXhlYy5jYWxsKFByb3BWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodikgeyB2YWx1ZXMucHVzaCh2WzFdKTsgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghdmFsdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiUHJvcFZhbHVlIG9mIFwiK2lkZW50K1wiIGlzIG1pc3NpbmdcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBub2RlW2lkZW50XSA9IHZhbHVlcztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyB8fCBjcmVhdGVQcm9wZXJ0aWVzKG5vZGUpO1xuICAgICAgICAgICAgICAgIG5vZGUgPSBwYXJzZVByb3BlcnRpZXMobm9kZSwgcHJvcGVydGllcyk7XG5cbiAgICAgICAgICAgICAgICBzZXF1ZW5jZS5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXNlcXVlbmNlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIkdhbWVUcmVlIGRvZXMgbm90IGNvbnRhaW4gYW55IE5vZGVzXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSBbXTtcblxuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBwYXJzZUdhbWVUcmVlKHByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZCkgeyBjaGlsZHJlbi5wdXNoKGNoaWxkKTsgfVxuICAgICAgICAgICAgICAgICAgICAgIGVsc2UgeyBicmVhazsgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRlc3QuY2FsbChDbG9zZVBhcmVuKSkgeyAvLyBlbmQgb2YgR2FtZVRyZWVcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJVbmV4cGVjdGVkIHRva2VuIFwiK3NvdXJjZS5jaGFyQXQobGFzdEluZGV4KSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vICg7YSg7YikpID0+ICg7YTtiKVxuICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHNlcXVlbmNlID0gc2VxdWVuY2UuY29uY2F0KGNoaWxkcmVuWzBdWzBdKTtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IGNoaWxkcmVuWzBdWzFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gW3NlcXVlbmNlLCBjaGlsZHJlbl07XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGNyZWF0ZVByb3BlcnRpZXMgPSBmdW5jdGlvbiAocm9vdCkge1xuICAgICAgICAgICAgdmFyIFNHRk51bWJlciA9IFNHRkdyb3ZlLmZpbGVGb3JtYXQoeyBGRjogNCB9KS5UeXBlcy5OdW1iZXI7XG5cbiAgICAgICAgICAgIHZhciBmaWxlRm9ybWF0ID0gU0dGR3JvdmUuZmlsZUZvcm1hdCh7XG4gICAgICAgICAgICAgICAgRkYgOiBTR0ZOdW1iZXIucGFyc2Uocm9vdC5GRiB8fCBbXSkgfHwgMSxcbiAgICAgICAgICAgICAgICBHTSA6IFNHRk51bWJlci5wYXJzZShyb290LkdNIHx8IFtdKSB8fCAxXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbGVGb3JtYXQucHJvcGVydGllcygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBwYXJzZVByb3BlcnRpZXMgPSBmdW5jdGlvbiAobm9kZSwgcHJvcGVydGllcykge1xuICAgICAgICAgICAgdmFyIG4gPSB7fTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaWRlbnQgaW4gbm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLmhhc093blByb3BlcnR5KGlkZW50KSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcCA9IHByb3BlcnRpZXMucGFyc2UoaWRlbnQsIG5vZGVbaWRlbnRdKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIkludmFsaWQgUHJvcElkZW50IFwiK2lkZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChuLmhhc093blByb3BlcnR5KHByb3BbMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJQcm9wZXJ0eSBcIitwcm9wWzBdK1wiIGFscmVhZHkgZXhpc3RzXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHByb3BbMV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0ciA9IGlkZW50K1wiW1wiK25vZGVbaWRlbnRdLmpvaW4oXCJdW1wiKStcIl1cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIkludmFsaWQgUHJvcFZhbHVlIFwiK3N0cik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBuW3Byb3BbMF1dID0gcHJvcFsxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBuO1xuICAgICAgICB9O1xuIFxuICAgICAgICAvLyBDb3BpZWQgYW5kIHJlYXJyYW5nZWQgZnJvbSBqc29uMi5qcyBzbyB0aGF0IHdlIGNhbiBwYXNzIHRoZSBzYW1lXG4gICAgICAgIC8vIGNhbGxiYWNrIHRvIGJvdGggb2YgU0dGLnBhcnNlIGFuZCBKU09OLnBhcnNlXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kb3VnbGFzY3JvY2tmb3JkL0pTT04tanMvYmxvYi9tYXN0ZXIvanNvbjIuanNcbiAgICAgICAgdmFyIHdhbGsgPSBmdW5jdGlvbiAoaG9sZGVyLCBrZXkpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGhvbGRlcltrZXldO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgayBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ID0gd2Fsayh2YWx1ZSwgayk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVba10gPSB2O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHZhbHVlW2tdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV2aXZlci5jYWxsKGhvbGRlciwga2V5LCB2YWx1ZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0ZXh0LCByZXYpIHtcbiAgICAgICAgICAgIHZhciBjb2xsZWN0aW9uID0gW107XG5cbiAgICAgICAgICAgIHNvdXJjZSA9IFN0cmluZyh0ZXh0KTtcbiAgICAgICAgICAgIGxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICByZXZpdmVyID0gdHlwZW9mIHJldiA9PT0gXCJmdW5jdGlvblwiICYmIHJldjtcblxuICAgICAgICAgICAgdGVzdC5jYWxsKFdoaXRlc3BhY2VzKTtcblxuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2FtZVRyZWUgPSBwYXJzZUdhbWVUcmVlKCk7XG4gICAgICAgICAgICAgICAgaWYgKGdhbWVUcmVlKSB7IGNvbGxlY3Rpb24ucHVzaChnYW1lVHJlZSk7IH1cbiAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHsgYnJlYWs7IH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGxhc3RJbmRleCAhPT0gc291cmNlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIlVuZXhwZWN0ZWQgdG9rZW4gXCIrc291cmNlLmNoYXJBdChsYXN0SW5kZXgpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJldml2ZXIgPyB3YWxrKHsgXCJcIjogY29sbGVjdGlvbiB9LCBcIlwiKSA6IGNvbGxlY3Rpb247XG4gICAgICAgIH07XG4gICAgfSgpKTtcblxuICAgIFNHRkdyb3ZlLnN0cmluZ2lmeSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbiAgICAgICAgdmFyIHJlcGxhY2VyLCBzZWxlY3RlZCwgaW5kZW50LCBnYXA7XG5cbiAgICAgICAgdmFyIGNyZWF0ZVByb3BlcnRpZXMgPSBmdW5jdGlvbiAocm9vdCkge1xuICAgICAgICAgICAgdmFyIGZpbGVGb3JtYXQgPSBTR0ZHcm92ZS5maWxlRm9ybWF0KHtcbiAgICAgICAgICAgICAgICBGRiA6IHJvb3QuaGFzT3duUHJvcGVydHkoXCJGRlwiKSA/IHJvb3QuRkYgOiAxLFxuICAgICAgICAgICAgICAgIEdNIDogcm9vdC5oYXNPd25Qcm9wZXJ0eShcIkdNXCIpID8gcm9vdC5HTSA6IDFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGZpbGVGb3JtYXQucHJvcGVydGllcygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBmaW5hbGl6ZSA9IGZ1bmN0aW9uIChrZXksIGhvbGRlcikge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gaG9sZGVyW2tleV07XG4gICAgICAgICAgICB2YXIgaSwgaywgdjtcblxuICAgICAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiB2YWx1ZS50b1NHRiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b1NHRihrZXkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmVwbGFjZXIpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHJlcGxhY2VyLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF2YWx1ZSB8fCB0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICB2ID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHYgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKCBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgICAgICAgICB2W2ldID0gZmluYWxpemUoaSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHYgPSB7fTtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHNlbGVjdGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2W3NlbGVjdGVkW2ldXSA9IGZpbmFsaXplKHNlbGVjdGVkW2ldLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoayBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdltrXSA9IGZpbmFsaXplKGssIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHY7XG4gICAgICAgIH07XG4gXG4gICAgICAgIHZhciBzdHJpbmdpZnlHYW1lVHJlZSA9IGZ1bmN0aW9uIChnYW1lVHJlZSwgcHJvcGVydGllcykge1xuICAgICAgICAgICAgZ2FtZVRyZWUgPSBpc0FycmF5KGdhbWVUcmVlKSA/IGdhbWVUcmVlIDogW107XG5cbiAgICAgICAgICAgIHZhciBzZXF1ZW5jZSA9IGlzQXJyYXkoZ2FtZVRyZWVbMF0pID8gZ2FtZVRyZWVbMF0gOiBbXSxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IGlzQXJyYXkoZ2FtZVRyZWVbMV0pID8gZ2FtZVRyZWVbMV0gOiBbXTtcblxuICAgICAgICAgICAgLy8gKDthKDtiKSkgPT4gKDthO2IpXG4gICAgICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgc2VxdWVuY2UgPSBzZXF1ZW5jZS5jb25jYXQoaXNBcnJheShjaGlsZHJlblswXVswXSkgPyBjaGlsZHJlblswXVswXSA6IFtdKTtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IGlzQXJyYXkoY2hpbGRyZW5bMF1bMV0pID8gY2hpbGRyZW5bMF1bMV0gOiBbXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHRleHQgPSBcIlwiLFxuICAgICAgICAgICAgICAgIGxmID0gaW5kZW50ID8gXCJcXG5cIiA6IFwiXCIsXG4gICAgICAgICAgICAgICAgbWluZCA9IGdhcDtcblxuICAgICAgICAgICAgaWYgKHNlcXVlbmNlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRleHQgKz0gZ2FwK1wiKFwiK2xmOyAvLyBvcGVuIEdhbWVUcmVlXG4gICAgICAgICAgICAgICAgZ2FwICs9IGluZGVudDtcblxuICAgICAgICAgICAgICAgIHZhciBzZW1pY29sb24gPSBnYXArXCI7XCIsXG4gICAgICAgICAgICAgICAgICAgIHNwYWNlID0gZ2FwKyhpbmRlbnQgPyBcIiBcIiA6IFwiXCIpO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZXF1ZW5jZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IHNlcXVlbmNlW2ldICYmIHR5cGVvZiBzZXF1ZW5jZVtpXSA9PT0gXCJvYmplY3RcIiA/IHNlcXVlbmNlW2ldIDoge307XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJ0aWFsID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgfHwgY3JlYXRlUHJvcGVydGllcyhub2RlKTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpZGVudCBpbiBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5oYXNPd25Qcm9wZXJ0eShpZGVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVzID0gcHJvcGVydGllcy5zdHJpbmdpZnkoaWRlbnQsIG5vZGVbaWRlbnRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpYWwucHVzaChpZGVudCtcIltcIit2YWx1ZXMuam9pbihcIl1bXCIpK1wiXVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0ZXh0ICs9IHNlbWljb2xvbitwYXJ0aWFsLmpvaW4obGYrc3BhY2UpK2xmOyAvLyBhZGQgTm9kZVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dCArPSBzdHJpbmdpZnlHYW1lVHJlZShjaGlsZHJlbltqXSwgcHJvcGVydGllcyk7IC8vIGFkZCBHYW1lVHJlZVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRleHQgKz0gbWluZCtcIilcIitsZjsgLy8gY2xvc2UgR2FtZVRyZWVcbiAgICAgICAgICAgICAgICBnYXAgPSBtaW5kO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHJlcCwgc3BhY2UpIHtcbiAgICAgICAgICAgIHZhciB0ZXh0LCBpO1xuXG4gICAgICAgICAgICByZXBsYWNlciA9IG51bGw7XG4gICAgICAgICAgICBzZWxlY3RlZCA9IG51bGw7XG4gICAgICAgICAgICBpbmRlbnQgPSBcIlwiO1xuICAgICAgICAgICAgZ2FwID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKGlzQXJyYXkocmVwKSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHJlcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlcFtpXSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQucHVzaChyZXBbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHJlcCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgcmVwbGFjZXIgPSByZXA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChyZXApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJyZXBsYWNlciBtdXN0IGJlIGFycmF5IG9yIGZ1bmN0aW9uXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHNwYWNlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHNwYWNlOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50ICs9IFwiIFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBzcGFjZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIGluZGVudCA9IHNwYWNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb2xsZWN0aW9uID0gZmluYWxpemUoXCJcIiwgeyBcIlwiOiBjb2xsZWN0aW9uIH0pO1xuXG4gICAgICAgICAgICBpZiAoaXNBcnJheShjb2xsZWN0aW9uKSkge1xuICAgICAgICAgICAgICAgIHRleHQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb2xsZWN0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQgKz0gc3RyaW5naWZ5R2FtZVRyZWUoY29sbGVjdGlvbltpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfTtcbiAgICB9KCkpO1xuXG4gICAgU0dGR3JvdmUuZmlsZUZvcm1hdCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpc0ludGVnZXIgPSBTR0ZHcm92ZS5VdGlsLmlzSW50ZWdlcixcbiAgICAgICAgICAgIEZGID0ge307XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2ZXJzaW9uLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgdmVyc2lvbiA9IHZlcnNpb24gfHwge307XG5cbiAgICAgICAgICAgIHZhciBmZiA9IHZlcnNpb24uRkYsXG4gICAgICAgICAgICAgICAgZ20gPSB2ZXJzaW9uLkdNO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNJbnRlZ2VyKGZmKSAmJiBmZiA+IDAgJiYgRkZbZmZdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0ludGVnZXIoZ20pICYmIGdtID4gMCAmJiBGRltmZl0uR01bZ21dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gRkZbZmZdLkdNW2dtXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRkZbZmZdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gRkY7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBmaWxlRm9ybWF0ID0ge307XG4gICAgICAgICAgICAgICAgZmlsZUZvcm1hdCA9IGNhbGxiYWNrLmNhbGwoZmlsZUZvcm1hdCwgRkYpIHx8IGZpbGVGb3JtYXQ7XG5cbiAgICAgICAgICAgIGlmIChmZiAmJiBnbSkge1xuICAgICAgICAgICAgICAgIEZGW2ZmXS5HTVtnbV0gPSBmaWxlRm9ybWF0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZmYpIHtcbiAgICAgICAgICAgICAgICBmaWxlRm9ybWF0LkdNID0gZmlsZUZvcm1hdC5HTSB8fCB7fTtcbiAgICAgICAgICAgICAgICBGRltmZl0gPSBmaWxlRm9ybWF0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgRkYgPSBmaWxlRm9ybWF0O1xuICAgICAgICAgICAgfVxuIFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgIH0oKSk7XG5cbiAgICBTR0ZHcm92ZS5maWxlRm9ybWF0KHt9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBUeXBlcyA9IHt9O1xuXG4gICAgICAgIFR5cGVzLnNjYWxhciA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICAgICAgICBhcmdzID0gYXJncyB8fCB7fTtcblxuICAgICAgICAgICAgdmFyIHRoYXQgPSB7fTtcblxuICAgICAgICAgICAgdmFyIGxpa2UgPSBhcmdzLmxpa2UgfHwgeyB0ZXN0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9IH07XG4gICAgICAgICAgICB2YXIgcGFyc2UgPSBhcmdzLnBhcnNlIHx8IGZ1bmN0aW9uICh2KSB7IHJldHVybiB2OyB9O1xuXG4gICAgICAgICAgICB2YXIgaXNhID0gYXJncy5pc2EgfHwgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHR5cGVvZiB2ID09PSBcInN0cmluZ1wiICYmIGxpa2UudGVzdCh2KTsgfTtcbiAgICAgICAgICAgIHZhciBzdHJpbmdpZnkgPSBhcmdzLnN0cmluZ2lmeSB8fCBTdHJpbmc7XG5cbiAgICAgICAgICAgIHRoYXQucGFyc2UgPSBmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDEgJiYgbGlrZS50ZXN0KHZhbHVlc1swXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlKHZhbHVlc1swXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhhdC5zdHJpbmdpZnkgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNhKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3N0cmluZ2lmeSh2YWx1ZSldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB0aGF0O1xuICAgICAgICB9O1xuXG4gICAgICAgIFR5cGVzLlVua25vd24gPSB7XG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHZhbHVlcykge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtpXSA9IHZhbHVlc1tpXS5yZXBsYWNlKC9cXFxcXFxdL2csIFwiXVwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHZhbHVlcykge1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlcykpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlc1tpXSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtpXSA9IHZhbHVlc1tpXS5yZXBsYWNlKC9cXF0vZywgXCJcXFxcXVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuVHlwZXMgPSBUeXBlcztcblxuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBmdW5jdGlvbiAodCwgYXJncykge1xuICAgICAgICAgICAgdCA9IHQgfHwgVHlwZXM7XG4gICAgICAgICAgICBhcmdzID0gYXJncyB8fCB7fTtcblxuICAgICAgICAgICAgdmFyIHRoYXQgPSB7XG4gICAgICAgICAgICAgICAgdHlwZU9mICAgICAgOiBhcmdzLnR5cGVPZiAgICAgIHx8IHt9LFxuICAgICAgICAgICAgICAgIGRlZmF1bHRUeXBlIDogYXJncy5kZWZhdWx0VHlwZSB8fCB0LlVua25vd24sXG4gICAgICAgICAgICAgICAgaWRlbnRpZmllcnMgOiBhcmdzLmlkZW50aWZpZXJzIHx8IHsgdGVzdDogZnVuY3Rpb24gKCkgeyByZXR1cm4gZmFsc2U7IH0gfSxcbiAgICAgICAgICAgICAgICByZXBsYWNlciAgICA6IGFyZ3MucmVwbGFjZXJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoYXQubWVyZ2UgPSBmdW5jdGlvbiAob3RoZXIpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpZGVudCBpbiBvdGhlcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAob3RoZXIuaGFzT3duUHJvcGVydHkoaWRlbnQpICYmIG90aGVyW2lkZW50XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50eXBlT2ZbaWRlbnRdID0gb3RoZXJbaWRlbnRdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhhdC5wYXJzZSA9IGZ1bmN0aW9uIChpZGVudCwgdmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVwbGFjZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWRlbnQgPSB0aGlzLnJlcGxhY2VyLmNhbGwobnVsbCwgaWRlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pZGVudGlmaWVycy50ZXN0KGlkZW50KSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdHlwZSA9IHRoaXMudHlwZU9mW2lkZW50XSB8fCB0aGlzLmRlZmF1bHRUeXBlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2lkZW50LCB0eXBlLnBhcnNlKHZhbHVlcyldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoYXQuc3RyaW5naWZ5ID0gZnVuY3Rpb24gKGlkZW50LCB2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pZGVudGlmaWVycy50ZXN0KGlkZW50KSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdHlwZSA9IHRoaXMudHlwZU9mW2lkZW50XSB8fCB0aGlzLmRlZmF1bHRUeXBlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHlwZS5zdHJpbmdpZnkodmFsdWVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gdGhhdDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm47XG4gICAgfSk7XG5cbiAgICAvLyBGaWxlIEZvcm1hdCAoO0ZGWzRdKVxuICAgIC8vIGh0dHA6Ly93d3cucmVkLWJlYW4uY29tL3NnZi9zZ2Y0Lmh0bWxcbiAgICAvLyBodHRwOi8vd3d3LnJlZC1iZWFuLmNvbS9zZ2YvcHJvcGVydGllcy5odG1sXG4gICAgU0dGR3JvdmUuZmlsZUZvcm1hdCh7IEZGOiA0IH0sIGZ1bmN0aW9uIChGRikge1xuICAgICAgICB2YXIgVHlwZXMgPSBPYmplY3QuY3JlYXRlKEZGLlR5cGVzKTtcbiAgICAgICAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG4gICAgICAgIFR5cGVzLmNvbXBvc2UgPSBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiBsZWZ0ICYmIHJpZ2h0ICYmIHtcbiAgICAgICAgICAgICAgICBlc2NhcGU6IGZ1bmN0aW9uICh2KSB7IHJldHVybiB2LnJlcGxhY2UoLzovZywgXCJcXFxcOlwiKTsgfSxcbiAgICAgICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHYgPSAvXigoPzpcXFxcW1xcU1xcc118W146XFxcXF0rKSopOigoPzpcXFxcW1xcU1xcc118W146XFxcXF0rKSopJC8uZXhlYyh2YWx1ZXNbMF0pIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsID0gdiAmJiBsZWZ0LnBhcnNlKFt2WzFdXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgciA9IHYgJiYgcmlnaHQucGFyc2UoW3ZbMl1dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsICE9PSB1bmRlZmluZWQgJiYgciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtsLCByXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3RyaW5naWZ5OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGwgPSBsZWZ0LnN0cmluZ2lmeSh2YWx1ZVswXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgciA9IHJpZ2h0LnN0cmluZ2lmeSh2YWx1ZVsxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbCAmJiByICYmIFt0aGlzLmVzY2FwZShsWzBdKStcIjpcIit0aGlzLmVzY2FwZShyWzBdKV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIFR5cGVzLmxpc3RPZiA9IGZ1bmN0aW9uIChzY2FsYXIsIGFyZ3MpIHtcbiAgICAgICAgICAgIGFyZ3MgPSBhcmdzIHx8IHt9O1xuXG4gICAgICAgICAgICByZXR1cm4gc2NhbGFyICYmIHtcbiAgICAgICAgICAgICAgICBjYW5CZUVtcHR5OiBhcmdzLmNhbkJlRW1wdHksXG4gICAgICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID09PSAxICYmIHZhbHVlc1swXSA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FuQmVFbXB0eSA/IHJlc3VsdCA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbaV0gPSBzY2FsYXIucGFyc2UoW3ZhbHVlc1tpXV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdFtpXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzQXJyYXkodmFsdWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCF2YWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jYW5CZUVtcHR5ID8gW1wiXCJdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtpXSA9IHNjYWxhci5zdHJpbmdpZnkodmFsdWVzW2ldKVswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggcmVzdWx0W2ldID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRvRWxpc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG90aGVyID0gT2JqZWN0LmNyZWF0ZSh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgb3RoZXIuY2FuQmVFbXB0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvdGhlcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIFR5cGVzLmVsaXN0T2YgPSBmdW5jdGlvbiAoc2NhbGFyKSB7XG4gICAgICAgICAgICByZXR1cm4gVHlwZXMubGlzdE9mKHNjYWxhciwge1xuICAgICAgICAgICAgICAgIGNhbkJlRW1wdHk6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIFR5cGVzLm9yID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhICYmIGIgJiYge1xuICAgICAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBhLnBhcnNlKHZhbHVlcyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgIT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGIucGFyc2UodmFsdWVzKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhLnN0cmluZ2lmeSh2YWx1ZSkgfHwgYi5zdHJpbmdpZnkodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gTnVtYmVyID0gW1wiK1wifFwiLVwiXSBEaWdpdCB7RGlnaXR9XG4gICAgICAgIFR5cGVzLk51bWJlciA9IFR5cGVzLnNjYWxhcih7XG4gICAgICAgICAgICBsaWtlOiAvXlsrLV0/XFxkKyQvLFxuICAgICAgICAgICAgaXNhOiBTR0ZHcm92ZS5VdGlsLmlzSW50ZWdlcixcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodikgeyByZXR1cm4gcGFyc2VJbnQodiwgMTApOyB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIE5vbmUgPSBcIlwiXG4gICAgICAgIFR5cGVzLk5vbmUgPSBUeXBlcy5zY2FsYXIoe1xuICAgICAgICAgICAgbGlrZTogeyB0ZXN0OiBmdW5jdGlvbiAodikgeyByZXR1cm4gdiA9PT0gXCJcIjsgfSB9LFxuICAgICAgICAgICAgaXNhOiBmdW5jdGlvbiAodikgeyByZXR1cm4gdiA9PT0gbnVsbDsgfSxcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAoKSB7IHJldHVybiBudWxsOyB9LFxuICAgICAgICAgICAgc3RyaW5naWZ5OiBmdW5jdGlvbiAoKSB7IHJldHVybiBcIlwiOyB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFJlYWwgPSBOdW1iZXIgW1wiLlwiIERpZ2l0IHsgRGlnaXQgfV1cbiAgICAgICAgVHlwZXMuUmVhbCA9IFR5cGVzLnNjYWxhcih7XG4gICAgICAgICAgICBsaWtlOiAvXlsrLV0/XFxkKyg/OlxcLlxcZCspPyQvLFxuICAgICAgICAgICAgaXNhOiBTR0ZHcm92ZS5VdGlsLmlzTnVtYmVyLFxuICAgICAgICAgICAgcGFyc2U6IHBhcnNlRmxvYXRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRG91YmxlID0gKFwiMVwiIHwgXCIyXCIpXG4gICAgICAgIFR5cGVzLkRvdWJsZSA9IFR5cGVzLnNjYWxhcih7XG4gICAgICAgICAgICBsaWtlOiAvXlsxMl0kLyxcbiAgICAgICAgICAgIGlzYTogZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHYgPT09IDEgfHwgdiA9PT0gMjsgfSxcbiAgICAgICAgICAgIHBhcnNlOiBwYXJzZUludFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBDb2xvciA9IChcIkJcIiB8IFwiV1wiKVxuICAgICAgICBUeXBlcy5Db2xvciA9IFR5cGVzLnNjYWxhcih7XG4gICAgICAgICAgICBsaWtlOiAvXltCV10kL1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUZXh0ID0geyBhbnkgY2hhcmFjdGVyIH1cbiAgICAgICAgVHlwZXMuVGV4dCA9IFR5cGVzLnNjYWxhcih7XG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLlxuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgc29mdCBsaW5lYnJlYWtzXG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2UoL1xcXFwoPzpcXG5cXHI/fFxcclxcbj8pL2csIFwiXCIpLlxuICAgICAgICAgICAgICAgICAgICAvLyBjb252ZXJ0IHdoaXRlIHNwYWNlcyBvdGhlciB0aGFuIGxpbmVicmVha3MgdG8gc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZSgvW15cXFNcXG5cXHJdL2csIFwiIFwiKS5cbiAgICAgICAgICAgICAgICAgICAgLy8gaW5zZXJ0IGVzY2FwZWQgY2hhcnMgdmVyYmF0aW1cbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZSgvXFxcXChbXFxTXFxzXSkvZywgXCIkMVwiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC8oW1xcXVxcXFxdKS9nLCBcIlxcXFwkMVwiKTsgLy8gZXNjYXBlIFwiXVwiIGFuZCBcIlxcXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gU2ltcGxlVGV4dCA9IHsgYW55IGNoYXJhY3RlciB9XG4gICAgICAgIFR5cGVzLlNpbXBsZVRleHQgPSBUeXBlcy5zY2FsYXIoe1xuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5cbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHNvZnQgbGluZWJyZWFrc1xuICAgICAgICAgICAgICAgICAgICByZXBsYWNlKC9cXFxcKD86XFxuXFxyP3xcXHJcXG4/KS9nLCBcIlwiKS5cbiAgICAgICAgICAgICAgICAgICAgLy8gY29udmVydCB3aGl0ZSBzcGFjZXMgb3RoZXIgdGhhbiBzcGFjZSB0byBzcGFjZSBldmVuIGlmIGl0J3MgZXNjYXBlZFxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlKC9cXFxcP1teXFxTIF0vZywgXCIgXCIpLlxuICAgICAgICAgICAgICAgICAgICAvLyBpbnNlcnQgZXNjYXBlZCBjaGFycyB2ZXJiYXRpbVxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlKC9cXFxcKFtcXFNcXHNdKS9nLCBcIiQxXCIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoLyhbXFxdXFxcXF0pL2csIFwiXFxcXCQxXCIpOyAvLyBlc2NhcGUgXCJdXCIgYW5kIFwiXFxcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLlR5cGVzID0gVHlwZXM7XG5cbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHQgPSB0IHx8IFR5cGVzO1xuXG4gICAgICAgICAgICByZXR1cm4gRkYucHJvcGVydGllcyh0LCB7XG4gICAgICAgICAgICAgICAgaWRlbnRpZmllcnM6IC9eW0EtWl0rJC8sXG4gICAgICAgICAgICAgICAgdHlwZU9mOiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1vdmUgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICBCICA6IHQuTW92ZSxcbiAgICAgICAgICAgICAgICAgICAgS08gOiB0Lk5vbmUsXG4gICAgICAgICAgICAgICAgICAgIE1OIDogdC5OdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIFcgIDogdC5Nb3ZlLFxuICAgICAgICAgICAgICAgICAgICAvLyBTZXR1cCBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgIEFCIDogdC5saXN0T2ZTdG9uZSB8fCB0Lmxpc3RPZih0LlN0b25lKSxcbiAgICAgICAgICAgICAgICAgICAgQUUgOiB0Lmxpc3RPZlBvaW50LFxuICAgICAgICAgICAgICAgICAgICBBVyA6IHQubGlzdE9mU3RvbmUgfHwgdC5saXN0T2YodC5TdG9uZSksXG4gICAgICAgICAgICAgICAgICAgIFBMIDogdC5Db2xvcixcbiAgICAgICAgICAgICAgICAgICAgLy8gTm9kZSBhbm5vdGF0aW9uIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgQyAgOiB0LlRleHQsXG4gICAgICAgICAgICAgICAgICAgIERNIDogdC5Eb3VibGUsXG4gICAgICAgICAgICAgICAgICAgIEdCIDogdC5Eb3VibGUsXG4gICAgICAgICAgICAgICAgICAgIEdXIDogdC5Eb3VibGUsXG4gICAgICAgICAgICAgICAgICAgIEhPIDogdC5Eb3VibGUsXG4gICAgICAgICAgICAgICAgICAgIE4gIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBVQyA6IHQuRG91YmxlLFxuICAgICAgICAgICAgICAgICAgICBWICA6IHQuUmVhbCxcbiAgICAgICAgICAgICAgICAgICAgLy8gTW92ZSBhbm5vdGF0aW9uIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgQk0gOiB0LkRvdWJsZSxcbiAgICAgICAgICAgICAgICAgICAgRE8gOiB0Lk5vbmUsXG4gICAgICAgICAgICAgICAgICAgIElUIDogdC5Ob25lLFxuICAgICAgICAgICAgICAgICAgICBURSA6IHQuRG91YmxlLFxuICAgICAgICAgICAgICAgICAgICAvLyBNYXJrdXAgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICBBUiA6IHQubGlzdE9mKHQuY29tcG9zZSh0LlBvaW50LCB0LlBvaW50KSksXG4gICAgICAgICAgICAgICAgICAgIENSIDogdC5saXN0T2ZQb2ludCxcbiAgICAgICAgICAgICAgICAgICAgREQgOiB0LmVsaXN0T2ZQb2ludCxcbiAgICAgICAgICAgICAgICAgICAgTEIgOiB0Lmxpc3RPZih0LmNvbXBvc2UodC5Qb2ludCwgdC5TaW1wbGVUZXh0KSksXG4gICAgICAgICAgICAgICAgICAgIExOIDogdC5saXN0T2YodC5jb21wb3NlKHQuUG9pbnQsIHQuUG9pbnQpKSxcbiAgICAgICAgICAgICAgICAgICAgTUEgOiB0Lmxpc3RPZlBvaW50LFxuICAgICAgICAgICAgICAgICAgICBTTCA6IHQubGlzdE9mUG9pbnQsXG4gICAgICAgICAgICAgICAgICAgIFNRIDogdC5saXN0T2ZQb2ludCxcbiAgICAgICAgICAgICAgICAgICAgVFIgOiB0Lmxpc3RPZlBvaW50LFxuICAgICAgICAgICAgICAgICAgICAvLyBSb290IHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgQVAgOiB0LmNvbXBvc2UodC5TaW1wbGVUZXh0LCB0LlNpbXBsZVRleHQpLFxuICAgICAgICAgICAgICAgICAgICBDQSA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgRkYgOiB0Lk51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgR00gOiB0Lk51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgU1QgOiB0Lk51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgU1ogOiB0Lm9yKHQuTnVtYmVyLCB0LmNvbXBvc2UodC5OdW1iZXIsIHQuTnVtYmVyKSksXG4gICAgICAgICAgICAgICAgICAgIC8vIEdhbWUgaW5mbyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgIEFOIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBCUiA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgQlQgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIENQIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBEVCA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgRVYgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIEdOIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBHQyA6IHQuVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgT04gOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIE9UIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBQQiA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgUEMgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIFBXIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBSRSA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgUk8gOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIFJVIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBTTyA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgVE0gOiB0LlJlYWwsXG4gICAgICAgICAgICAgICAgICAgIFVTIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBXUiA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgV1QgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIC8vIFRpbWluZyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgIEJMIDogdC5SZWFsLFxuICAgICAgICAgICAgICAgICAgICBPQiA6IHQuTnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBPVyA6IHQuTnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBXTCA6IHQuUmVhbCxcbiAgICAgICAgICAgICAgICAgICAgLy8gTWlzY2VsbGFuZW91cyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgIEZHIDogdC5vcih0Lk5vbmUsIHQuY29tcG9zZSh0Lk51bWJlciwgdC5TaW1wbGVUZXh0KSksXG4gICAgICAgICAgICAgICAgICAgIFBNIDogdC5OdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIFZNIDogdC5lbGlzdE9mUG9pbnRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm47XG4gICAgfSk7XG5cbiAgICAvLyBHbyAoO0ZGWzRdR01bMV0pIHNwZWNpZmljIHByb3BlcnRpZXNcbiAgICAvLyBodHRwOi8vd3d3LnJlZC1iZWFuLmNvbS9zZ2YvZ28uaHRtbFxuICAgIFNHRkdyb3ZlLmZpbGVGb3JtYXQoeyBGRjogNCwgR006IDEgfSwgZnVuY3Rpb24gKEZGKSB7XG4gICAgICAgIHZhciBUeXBlcyA9IE9iamVjdC5jcmVhdGUoRkZbNF0uVHlwZXMpO1xuXG4gICAgICAgIHZhciBleHBhbmRQb2ludExpc3QgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNvb3JkID0gXCJhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5elwiO1xuICAgICAgICAgICAgICAgIGNvb3JkICs9IGNvb3JkLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAocDEsIHAyKSB7XG4gICAgICAgICAgICAgICAgdmFyIHgxID0gY29vcmQuaW5kZXhPZihwMS5jaGFyQXQoMCkpLFxuICAgICAgICAgICAgICAgICAgICB5MSA9IGNvb3JkLmluZGV4T2YocDEuY2hhckF0KDEpKSxcbiAgICAgICAgICAgICAgICAgICAgeDIgPSBjb29yZC5pbmRleE9mKHAyLmNoYXJBdCgwKSksXG4gICAgICAgICAgICAgICAgICAgIHkyID0gY29vcmQuaW5kZXhPZihwMi5jaGFyQXQoMSkpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGg7IFxuICAgICAgICAgICAgICAgIGlmICh4MSA+IHgyKSB7XG4gICAgICAgICAgICAgICAgICAgIGggPSB4MTsgeDEgPSB4MjsgeDIgPSBoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoeTEgPiB5Mikge1xuICAgICAgICAgICAgICAgICAgICBoID0geTE7IHkxID0geTI7IHkyID0gaDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgcG9pbnRzID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeSA9IHkxOyB5IDw9IHkyOyB5KyspIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IHgxOyB4IDw9IHgyOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNvb3JkLmNoYXJBdCh4KStjb29yZC5jaGFyQXQoeSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvaW50cztcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0oKSk7XG5cbiAgICAgICAgVHlwZXMuUG9pbnQgPSBUeXBlcy5zY2FsYXIoe1xuICAgICAgICAgICAgbGlrZTogL15bYS16QS1aXXsyfSQvXG4gICAgICAgIH0pO1xuICBcbiAgICAgICAgVHlwZXMuU3RvbmUgPSBUeXBlcy5Qb2ludDtcbiAgICAgICAgVHlwZXMuTW92ZSAgPSBUeXBlcy5vcihUeXBlcy5Ob25lLCBUeXBlcy5Qb2ludCk7XG5cbiAgICAgICAgVHlwZXMubGlzdE9mUG9pbnQgPSAoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHZhciBsaXN0T2ZQb2ludCA9IHQubGlzdE9mKHQub3IoXG4gICAgICAgICAgICAgICAgdC5Qb2ludCxcbiAgICAgICAgICAgICAgICB0LnNjYWxhcih7XG4gICAgICAgICAgICAgICAgICAgIGxpa2U6IC9eW2EtekEtWl17Mn06W2EtekEtWl17Mn0kLyxcbiAgICAgICAgICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlY3QgPSB2YWx1ZS5zcGxpdChcIjpcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXhwYW5kUG9pbnRMaXN0KHJlY3RbMF0sIHJlY3RbMV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICkpO1xuXG4gICAgICAgICAgICB2YXIgcGFyc2UgPSBsaXN0T2ZQb2ludC5wYXJzZTtcbiAgICAgICAgICAgIHZhciBhcnJheSA9IFtdO1xuXG4gICAgICAgICAgICBsaXN0T2ZQb2ludC5wYXJzZSA9IGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gcGFyc2UuY2FsbCh0aGlzLCB2YWx1ZXMpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgJiYgYXJyYXkuY29uY2F0LmFwcGx5KGFycmF5LCByZXN1bHQpOyAvLyBmbGF0dGVuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gbGlzdE9mUG9pbnQ7XG4gICAgICAgIH0oVHlwZXMpKTtcblxuICAgICAgICBUeXBlcy5lbGlzdE9mUG9pbnQgPSBUeXBlcy5saXN0T2ZQb2ludC50b0VsaXN0KCk7XG5cbiAgICAgICAgVHlwZXMubGlzdE9mU3RvbmUgID0gVHlwZXMubGlzdE9mUG9pbnQ7XG4gICAgICAgIFR5cGVzLmVsaXN0T2ZTdG9uZSA9IFR5cGVzLmVsaXN0T2ZQb2ludDtcbiAgICBcbiAgICAgICAgdGhpcy5UeXBlcyA9IFR5cGVzO1xuXG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICB0ID0gdCB8fCBUeXBlcztcblxuICAgICAgICAgICAgdmFyIHRoYXQgPSBGRls0XS5wcm9wZXJ0aWVzKHQpO1xuXG4gICAgICAgICAgICB0aGF0Lm1lcmdlKHtcbiAgICAgICAgICAgICAgICBIQSA6IHQuTnVtYmVyLFxuICAgICAgICAgICAgICAgIEtNIDogdC5SZWFsLFxuICAgICAgICAgICAgICAgIFRCIDogdC5lbGlzdE9mUG9pbnQsXG4gICAgICAgICAgICAgICAgVFcgOiB0LmVsaXN0T2ZQb2ludFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGF0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybjtcbiAgICB9KTtcblxuICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IFNHRkdyb3ZlOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHdpbmRvdy5TR0ZHcm92ZSA9IFNHRkdyb3ZlO1xuICAgIH1cblxufSgpKTtcblxuIiwiaW1wb3J0IHsgU3RhdGUsIE1vdmUgfSBmcm9tIFwiLi9tb2RlbHNcIjtcbmltcG9ydCBSdWxlU2VydmljZSBmcm9tIFwiLi9ydWxlLnNlcnZpY2VcIjtcblxuY2xhc3MgQm9hcmRTZXJ2aWNlIHtcbiAgYm9hcmQ6IGFueSA9IFtdO1xuICBydWxlU2VydmljZSA9IG5ldyBSdWxlU2VydmljZSgpO1xuICBoaXN0b3J5OiBhbnlbXSA9IFtdO1xuICBjb25zdHJ1Y3RvcigpIHtcblxuICB9XG5cbiAgaW5pdChzaXplKSB7XG4gICAgdGhpcy5oaXN0b3J5ID0gW107XG4gICAgdGhpcy5ib2FyZCA9IHRoaXMubGluZShzaXplKS5tYXAoKF8sIHgpID0+IHRoaXMubGluZShzaXplKSkubWFwKChfLCB4KSA9PiBfLm1hcCgoXywgeSkgPT4gdGhpcy5jcmVhdGVQb2ludCh4LCB5KSkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgY3JlYXRlUG9pbnQgPSAoeDogbnVtYmVyLCB5OiBudW1iZXIsIHN0YXRlID0gbnVsbCkgPT4gKHsgc3RhdGU6IHN0YXRlLCBvcmRlcjogMCB9KTtcblxuICBsaW5lID0gKHM6IG51bWJlcikgPT4gQXJyYXkocykuZmlsbCgnJyk7XG4gIGF0ID0gKHg6IG51bWJlciwgeTogbnVtYmVyKTogTW92ZSA9PiB0aGlzLmJvYXJkW3hdW3ldO1xuXG4gIHBsYXkoeDogbnVtYmVyLCB5OiBudW1iZXIsIG9yZGVyID0gdGhpcy5oaXN0b3J5Lmxlbmd0aCkge1xuICAgIGNvbnN0IHZhbGlkU3RhdGUgPSB0aGlzLnJ1bGVTZXJ2aWNlLnZhbGlkYXRlKHRoaXMuYm9hcmQsIHtcbiAgICAgIHN0YXRlOiBvcmRlciAlIDIgPyBTdGF0ZS5XSElURSA6IFN0YXRlLkJMQUNLLFxuICAgICAgb3JkZXI6IG9yZGVyLFxuICAgICAgeDogeCxcbiAgICAgIHk6IHlcbiAgICB9KVxuXG4gICAgaWYgKHZhbGlkU3RhdGUpIHtcbiAgICAgIHRoaXMuYm9hcmQgPSB2YWxpZFN0YXRlO1xuICAgICAgdGhpcy5oaXN0b3J5ID0gWy4uLnRoaXMuaGlzdG9yeSwgT2JqZWN0LmFzc2lnbih7fSwgdmFsaWRTdGF0ZVt4XVt5XSldO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpYmVydGllc0F0KHg6IG51bWJlciwgeTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCBtID0gdGhpcy5hdCh4LCB5KTtcbiAgICByZXR1cm4gbSA/IHRoaXMucnVsZVNlcnZpY2UubGliZXJ0aWVzKHRoaXMuYm9hcmQsIG0pLmxlbmd0aCA6IDA7XG4gIH1cblxuICBzaG93KCkge1xuICAgIC8vIFxuICAgIGNvbnNvbGUubG9nKHRoaXMuYm9hcmQubWFwKGwgPT4gbC5tYXAocCA9PiBwLnN0YXRlID8gcC5zdGF0ZSA6ICcnKSkpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJvYXJkU2VydmljZTsiLCJpbXBvcnQgQm9hcmRTZXJ2aWNlIGZyb20gXCIuL2JvYXJkLnNlcnZpY2VcIjtcbmltcG9ydCBLaWZ1U2VydmljZSBmcm9tIFwiLi9raWZ1LnNlcnZpY2VcIjtcbmltcG9ydCBSdWxlU2VydmljZSBmcm9tIFwiLi9ydWxlLnNlcnZpY2VcIjtcblxuZXhwb3J0IHtcbiAgICBCb2FyZFNlcnZpY2UsXG4gICAgS2lmdVNlcnZpY2UsXG4gICAgUnVsZVNlcnZpY2Vcbn0iLCJpbXBvcnQgKiBhcyBzZ2Zncm92ZSBmcm9tICdzZ2Zncm92ZSdcbmltcG9ydCB7IEJMQUNLLCBXSElURSB9IGZyb20gJy4vbW9kZWxzJztcbmNsYXNzIEtpZnVTZXJ2aWNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIHJlYWQoc3ZnKSB7XG4gICAgICAgIGNvbnN0IFtbW21ldGEsIC4uLmdhbWVdXV0gPSBzZ2Zncm92ZS5wYXJzZShzdmcpO1xuICAgICAgICBjb25zdCB7IFBCLCBQVywgQlIsIFdSLCBTWiwgS00sIFJVLCBHTiwgQ1AsIFVTLCBBTiwgLi4ucmVzdCB9ID0gbWV0YTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBsYXllcnM6IFtcbiAgICAgICAgICAgICAgICB7IGNvbG9yOiBCTEFDSywgbmFtZTogUEIsIGxldmVsOiBCUiB9LFxuICAgICAgICAgICAgICAgIHsgY29sb3I6IFdISVRFLCBuYW1lOiBQVywgbGV2ZWw6IFdSIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgaW5mbzoge1xuICAgICAgICAgICAgICAgIHNpemU6IFNaLFxuICAgICAgICAgICAgICAgIGtvbWk6IEtNLFxuICAgICAgICAgICAgICAgIHJ1bGU6IFJVLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1ldGE6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBHTixcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IENQLFxuICAgICAgICAgICAgICAgIHNjcmliZTogVVMsXG4gICAgICAgICAgICAgICAgY29tbWVudGF0b3I6IEFOXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzdCxcbiAgICAgICAgICAgIGdhbWVcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEtpZnVTZXJ2aWNlOyIsImV4cG9ydCBjb25zdCBBUFBOQU1FID0gXCJ0ZW5nZW4uanNcIjtcbmV4cG9ydCBjb25zdCBWRVIgPSBcIjAuMVwiO1xuXG5leHBvcnQgY29uc3QgRU1QVFk6IGFueSA9IG51bGw7XG5leHBvcnQgY29uc3QgQkxBQ0sgPSBcImJsYWNrXCI7XG5leHBvcnQgY29uc3QgV0hJVEUgPSBcIndoaXRlXCI7XG5leHBvcnQgY29uc3QgUEFTUyA9IFwicGFzc1wiO1xuZXhwb3J0IGNvbnN0IFVORE8gPSBcInVuZG9cIjtcbmV4cG9ydCBjb25zdCBBQkFORE9OID0gXCJhYmFuZG9uXCI7XG5leHBvcnQgY29uc3QgTkVYVCA9IFwibmV4dFwiO1xuZXhwb3J0IGNvbnN0IFBSRVYgPSBcInByZXZcIjtcbmV4cG9ydCBjb25zdCBFTkQgPSBcImVuZF9nYW1lXCI7XG5leHBvcnQgY29uc3QgU1RBUlQgPSBcInN0YXJ0X2dhbWVcIjtcblxuZXhwb3J0IGVudW0gU3RhdGUge1xuICBCTEFDSyA9ICdibGFjaycsXG4gIFdISVRFID0gJ3doaXRlJyxcbiAgS08gPSAna28nLFxufSBcbmV4cG9ydCBpbnRlcmZhY2UgTW92ZSB7XG4gIHN0YXRlOiBTdGF0ZSB8IG51bGwsXG4gIHVwZGF0ZWRfYXQ/OiBEYXRlLFxuICBvcmRlcjogbnVtYmVyLCBcbiAgeDpudW1iZXJcbiAgeTpudW1iZXIsXG4gIGxvZz86IE1vdmVbXSxcbiAgY2FwdHVyZWQ/OiBbXVxufVxuXG4vKlxuZXhwb3J0IGNvbnN0IGFscGhhYmV0ID0gKHMgPSAyNikgPT4ge1xuICByZXR1cm4gbmV3IEFycmF5KHMpLmZpbGwoMSkubWFwKChfOmFueSwgaTpudW1iZXIpID0+IFN0cmluZy5mcm9tQ2hhckNvZGUoOTcgKyBpKSk7XG59O1xuXG5leHBvcnQgY29uc3QgYTJuID0gKGEgOiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIGFscGhhYmV0KCkuaW5kZXhPZihhKTtcbn07XG5leHBvcnQgY29uc3QgbjJhID0gKG46IG51bWJlcikgPT4ge1xuICByZXR1cm4gYWxwaGFiZXQoKVtuXTtcbn07XG5cbmV4cG9ydCBjb25zdCB0b0Nvb3JkID0gKG5vZGU6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSkgPT4ge1xuICBjb25zdCB7IHgsIHkgfSA9IG5vZGU7XG4gIHJldHVybiBuMmEoeCkgKyBuMmEoeSk7XG59O1xuZXhwb3J0IGNvbnN0IGZyb21TR0ZDb29yZCA9IChzZ2Zub2RlOiBhbnkpID0+IHtcbiAgY29uc3QgbW92ZSA9IHNnZm5vZGUuQiB8fCBzZ2Zub2RlLlc7XG4gIGlmIChtb3ZlKSB7XG4gICAgY29uc3QgW3gsIHldID0gbW92ZS5zcGxpdChcIlwiKTtcbiAgICByZXR1cm4geyB4OiBhMm4oeCksIHk6IGEybih5KSB9O1xuICB9XG4gIHJldHVybiB7IHg6IG51bGwsIHk6IG51bGwgfTtcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgSXRlbSB7XG4gIGlkPzogYW55O1xuICBjcmVhdGVkQXQ/OiBEYXRlIHwgbnVsbDtcbiAgdXBkYXRlZEF0PzogRGF0ZSB8IG51bGw7XG4gIGRlbGV0ZWRBdD86IERhdGUgfCBudWxsO1xuICBhdXRob3I/OiBQbGF5ZXI7XG59XG5leHBvcnQgaW50ZXJmYWNlIENvbW1lbnQge1xuICBvcmRlcjogbnVtYmVyO1xuICB0ZXh0OiBzdHJpbmc7XG4gIHRpbWU/OiBEYXRlO1xuICBtb3ZlPzogYW55O1xufVxuZXhwb3J0IGludGVyZmFjZSBHYW1lU2V0dGluZ3MgZXh0ZW5kcyBJdGVtIHtcbiAgd2hpdGU6IFBsYXllcjtcbiAgYmxhY2s6IFBsYXllcjtcbiAgc2l6ZTogbnVtYmVyO1xuICBzY29yZXM6IFNjb3JlQm9hcmQ7XG4gIHRpdGxlPzogc3RyaW5nO1xuICBrb21pPzogbnVtYmVyO1xuICBjbG9jaz86IGFueTtcbiAgYm9hcmQ/OiBhbnk7XG4gIGV2ZW50Pzogc3RyaW5nO1xuICByb3VuZD86IG51bWJlcjtcbiAgZGF0ZT86IERhdGU7XG4gIGxvY2F0aW9uPzogc3RyaW5nO1xuICBjb21tZW50cz86IENvbW1lbnRbXTtcbiAgdHJlZT86IGFueVtdO1xuICBuZWVkQ29uZmlybTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHYW1lTGlzdEl0ZW0ge1xuICBuYW1lOiBzdHJpbmc7XG4gIHVwZGF0ZWRfYXQ6IGFueTtcbiAgdGltZXN0YW1wOiBudW1iZXI7XG4gIGtleTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBsYXllciBleHRlbmRzIEl0ZW0ge1xuICBuYW1lOiBzdHJpbmc7XG4gIHJhbms/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2NvcmVCb2FyZCBleHRlbmRzIEl0ZW0ge1xuICBibGFjazogU2NvcmUgfCBudWxsO1xuICB3aGl0ZTogU2NvcmUgfCBudWxsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNjb3JlIGV4dGVuZHMgSXRlbSB7XG4gIGNhcHR1cmVkPzogbnVtYmVyO1xuICB0ZXJyaXRvcnk/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTW92ZSBleHRlbmRzIEl0ZW0ge1xuICB4PzogbnVtYmVyO1xuICB5PzogbnVtYmVyO1xuICBwbGF5ZXI6IGFueTtcbiAgc3RhdGU6IGFueTtcbiAgbGVhZnM/OiBNb3ZlW107XG4gIG9yZGVyPzogbnVtYmVyO1xuICBpbkhpc3Rvcnk/OiBib29sZWFuO1xuICBjYXB0dXJlZD86IE1vdmVbXTtcbiAgcGxheWVkOiBib29sZWFuO1xuICBjb21tZW50cz86IGFueVtdO1xuICB0aW1lPzogbnVtYmVyO1xufVxuKi8iLCJpbXBvcnQgeyBNb3ZlLCBTdGF0ZSB9IGZyb20gXCIuL21vZGVsc1wiO1xuXG5jbGFzcyBSdWxlU2VydmljZSB7XG4gICAgdmFsaWRhdGUoZ2FtZSwgbXY6IE1vdmUpIHtcbiAgICAgICAgbGV0IG5leHRTdGF0ZSA9IFsuLi5nYW1lLnNsaWNlKCldO1xuICAgICAgICBjb25zdCBoYXNMaWJlcnRpZXMgPSBtID0+IHRoaXMubGliZXJ0aWVzKG5leHRTdGF0ZSwgbSkubGVuZ3RoO1xuICAgICAgICBjb25zdCBpc0NhcHR1cmluZyA9IG0gPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV4dCA9IFsuLi5nYW1lLnNsaWNlKCldO1xuICAgICAgICAgICAgbmV4dFttdi54XVttdi55XSA9IG12O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FwdHVyZWQobmV4dCwgbSkubGVuZ3RoXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGlzS29Qcm90ZWN0ZWQgPSBtID0+IGdhbWVbbS54XVttLnldLnN0YXRlID09PSBTdGF0ZS5LT1xuICAgICAgICBjb25zdCBpc0ZyZWUgPSBtID0+ICFnYW1lW20ueF1bbS55XS5zdGF0ZTtcbiAgICAgICAgY29uc3QgdmFsaWQgPSBtID0+IGlzRnJlZShtKSAmJiAoaXNDYXB0dXJpbmcobSkgfHwgaGFzTGliZXJ0aWVzKG0pKSAmJiAhaXNLb1Byb3RlY3RlZChtKTtcbiAgICAgICAgY29uc3QgaXNLb1NpdHVhdGlvbiA9IG0gPT4gbS5jYXB0dXJlZC5sZW5ndGggPT09IDEgJiYgIXRoaXMubGliZXJ0aWVzKG5leHRTdGF0ZSwgbSkubGVuZ3RoO1xuXG4gICAgICAgIGlmICh2YWxpZChtdikpIHtcbiAgICAgICAgICAgIG5leHRTdGF0ZSA9IHRoaXMucmVzZXRLbyhuZXh0U3RhdGUpO1xuICAgICAgICAgICAgbmV4dFN0YXRlW212LnhdW212LnldID0gbXY7XG4gICAgICAgICAgICBjb25zdCBjYXB0dXJlZCA9IHRoaXMuY2FwdHVyZWQobmV4dFN0YXRlLCBtdikucmVkdWNlKChjLCBpKSA9PiBjLmNvbmNhdChpKSwgW10pO1xuICAgICAgICAgICAgbmV4dFN0YXRlW212LnhdW212LnldLmNhcHR1cmVkID0gY2FwdHVyZWQuc2xpY2UoKTtcblxuICAgICAgICAgICAgaWYgKGlzS29TaXR1YXRpb24obXYpKSB7XG4gICAgICAgICAgICAgICAgbmV4dFN0YXRlW2NhcHR1cmVkWzBdLnhdW2NhcHR1cmVkWzBdLnldLnN0YXRlID0gU3RhdGUuS087XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjYXB0dXJlZC5yZWR1Y2UoKHAsIGMpID0+IHtcbiAgICAgICAgICAgICAgICBwW2MueF1bYy55XS5zdGF0ZSA9IGMuc3RhdGUgPT09IFN0YXRlLktPXG4gICAgICAgICAgICAgICAgICAgID8gU3RhdGUuS08gOiBudWxsO1xuICAgICAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICAgICAgfSwgbmV4dFN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bXYueH06JHttdi55fSB3YXMgbm90IGEgdmFsaWQgbW92ZSAoJHtnYW1lW212LnhdW212LnldLnN0YXRlfSlgKTtcbiAgICB9XG5cbiAgICByZXNldEtvKHN0YXRlKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZS5tYXAobCA9PiBsLm1hcChwID0+IHtcbiAgICAgICAgICAgIHAuc3RhdGUgPSBwLnN0YXRlID09IFN0YXRlLktPID8gbnVsbCA6IHAuc3RhdGU7XG4gICAgICAgICAgICByZXR1cm4gcDtcbiAgICAgICAgfSkpXG5cbiAgICB9XG5cbiAgICBhZGphY2VudChib2FyZCwgbW92ZSkge1xuICAgICAgICBjb25zdCBlbmQgPSBib2FyZC5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gMDtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIG1vdmUueSA+IHN0YXJ0ID8gYm9hcmRbbW92ZS54XVttb3ZlLnkgLSAxXSA6IG51bGwsXG4gICAgICAgICAgICBtb3ZlLnkgPCBlbmQgPyBib2FyZFttb3ZlLnhdW21vdmUueSArIDFdIDogbnVsbCxcbiAgICAgICAgICAgIG1vdmUueCA+IHN0YXJ0ID8gYm9hcmRbbW92ZS54IC0gMV1bbW92ZS55XSA6IG51bGwsXG4gICAgICAgICAgICBtb3ZlLnggPCBlbmQgPyBib2FyZFttb3ZlLnggKyAxXVttb3ZlLnldIDogbnVsbFxuICAgICAgICBdLmZpbHRlcihpID0+IGkpO1xuICAgIH1cblxuICAgIGdyb3VwKGJvYXJkLCBwb2ludDogTW92ZSwgcXVldWU6IE1vdmVbXSA9IFtdLCB2aXNpdGVkID0gbmV3IFNldCgpKTogTW92ZVtdIHtcbiAgICAgICAgdmlzaXRlZC5hZGQoYCR7cG9pbnQueH06JHtwb2ludC55fWApO1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShcbiAgICAgICAgICAgIG5ldyBTZXQoW1xuICAgICAgICAgICAgICAgIHBvaW50LFxuICAgICAgICAgICAgICAgIC4uLnF1ZXVlLFxuICAgICAgICAgICAgICAgIC4uLnRoaXMuYWRqYWNlbnQoYm9hcmQsIHBvaW50KVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKG4gPT4gIXZpc2l0ZWQuaGFzKGAke24ueH06JHtuLnl9YCkgJiYgbi5zdGF0ZSA9PT0gcG9pbnQuc3RhdGUpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAobiA9PiB0aGlzLmdyb3VwKGJvYXJkLCBuLCBxdWV1ZSwgdmlzaXRlZCkpXG4gICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIHYpID0+IGEuY29uY2F0KHYpLCBbXSlcbiAgICAgICAgICAgIF0pXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgc2xpYmVydGllcyhib2FyZCwgbW92ZTogTW92ZSk6IE1vdmVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkamFjZW50KGJvYXJkLCBtb3ZlKS5maWx0ZXIoaSA9PiAhaS5zdGF0ZSk7XG4gICAgfVxuXG4gICAgbGliZXJ0aWVzKGJvYXJkLCBtb3ZlOiBNb3ZlLCBjYXA/OiBNb3ZlKTogTW92ZVtdIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oXG4gICAgICAgICAgICBuZXcgU2V0KFxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXAoYm9hcmQsIG1vdmUpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAobSA9PiB0aGlzLnNsaWJlcnRpZXMoYm9hcmQsIG0pKVxuICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhLCB2KSA9PiBhLmNvbmNhdCh2KSwgW10pXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIobCA9PiBsLnggIT09IG1vdmUueCB8fCBsLnkgIT09IG1vdmUueSlcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihsID0+ICFjYXAgfHwgKGwueCAhPT0gY2FwLnggfHwgbC55ICE9PSBjYXAueSkpXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgY2FwdHVyZWQoYm9hcmQsIG1vdmU6IE1vdmUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRqYWNlbnQoYm9hcmQsIG1vdmUpXG4gICAgICAgICAgICAuZmlsdGVyKG0gPT4gbS5zdGF0ZSAmJiBtLnN0YXRlICE9PSBtb3ZlLnN0YXRlKVxuICAgICAgICAgICAgLmZpbHRlcihvID0+ICF0aGlzLmxpYmVydGllcyhib2FyZCwgbywgbW92ZSkubGVuZ3RoKVxuICAgICAgICAgICAgLm1hcChjID0+IHRoaXMuZ3JvdXAoYm9hcmQsIGMpKTtcbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBSdWxlU2VydmljZTsiXSwic291cmNlUm9vdCI6IiJ9