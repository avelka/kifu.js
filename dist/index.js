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
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BoardService; });
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models */ "./src/models.ts");
/* harmony import */ var _rule_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rule.service */ "./src/rule.service.ts");
/* harmony import */ var _kifu_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./kifu.service */ "./src/kifu.service.ts");



class BoardService {
    constructor() {
        this.board = [];
        this.ruleService = new _rule_service__WEBPACK_IMPORTED_MODULE_1__["default"]();
        this.kifuService = new _kifu_service__WEBPACK_IMPORTED_MODULE_2__["default"]();
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
            state: order % 2 ? _models__WEBPACK_IMPORTED_MODULE_0__["State"].WHITE : _models__WEBPACK_IMPORTED_MODULE_0__["State"].BLACK,
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
        console.log(this.board.map(l => l.map(p => p.state ? p.state : '')));
    }
}


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: default, BoardService, RuleService, KifuService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return test; });
/* harmony import */ var _board_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./board.service */ "./src/board.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BoardService", function() { return _board_service__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _rule_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rule.service */ "./src/rule.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RuleService", function() { return _rule_service__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _kifu_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./kifu.service */ "./src/kifu.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "KifuService", function() { return _kifu_service__WEBPACK_IMPORTED_MODULE_2__["default"]; });




function test() {
    return 'test 097098';
}



/***/ }),

/***/ "./src/kifu.service.ts":
/*!*****************************!*\
  !*** ./src/kifu.service.ts ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return KifuService; });
/* harmony import */ var sgfgrove__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sgfgrove */ "./node_modules/sgfgrove/lib/sgfgrove.js");
/* harmony import */ var sgfgrove__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sgfgrove__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./models */ "./src/models.ts");


class KifuService {
    constructor() {
    }
    read(svg) {
        const [[[meta, ...game]]] = sgfgrove__WEBPACK_IMPORTED_MODULE_0__["parse"](svg);
        const { PB, PW, BR, WR, SZ, KM, RU, GN, CP, US, AN, ...rest } = meta;
        return {
            players: [
                { color: _models__WEBPACK_IMPORTED_MODULE_1__["BLACK"], name: PB, level: BR },
                { color: _models__WEBPACK_IMPORTED_MODULE_1__["WHITE"], name: PW, level: WR },
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


/***/ }),

/***/ "./src/models.ts":
/*!***********************!*\
  !*** ./src/models.ts ***!
  \***********************/
/*! exports provided: APPNAME, VER, EMPTY, BLACK, WHITE, PASS, UNDO, ABANDON, NEXT, PREV, END, START, State */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "APPNAME", function() { return APPNAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VER", function() { return VER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EMPTY", function() { return EMPTY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BLACK", function() { return BLACK; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WHITE", function() { return WHITE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PASS", function() { return PASS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UNDO", function() { return UNDO; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ABANDON", function() { return ABANDON; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NEXT", function() { return NEXT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PREV", function() { return PREV; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "END", function() { return END; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "START", function() { return START; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "State", function() { return State; });
const APPNAME = "tengen.js";
const VER = "0.1";
const EMPTY = null;
const BLACK = "black";
const WHITE = "white";
const PASS = "pass";
const UNDO = "undo";
const ABANDON = "abandon";
const NEXT = "next";
const PREV = "prev";
const END = "end_game";
const START = "start_game";
var State;
(function (State) {
    State["BLACK"] = "black";
    State["WHITE"] = "white";
    State["KO"] = "ko";
})(State || (State = {}));


/***/ }),

/***/ "./src/rule.service.ts":
/*!*****************************!*\
  !*** ./src/rule.service.ts ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return RuleService; });
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models */ "./src/models.ts");

class RuleService {
    validate(game, mv) {
        let nextState = [...game.slice()];
        const hasLiberties = (m) => this.liberties(nextState, m).length;
        const isCapturing = (m) => {
            const next = [...game.slice()];
            next[mv.x][mv.y] = mv;
            return this.captured(next, m).length;
        };
        const isKoProtected = (m) => game[m.x][m.y].state === _models__WEBPACK_IMPORTED_MODULE_0__["State"].KO;
        const isFree = (m) => !game[m.x][m.y].state;
        const valid = (m) => isFree(m) && (isCapturing(m) || hasLiberties(m)) && !isKoProtected(m);
        const isKoSituation = (m) => m.captured.length === 1 && !this.liberties(nextState, m).length;
        if (valid(mv)) {
            nextState = this.resetKo(nextState);
            nextState[mv.x][mv.y] = mv;
            const captured = this.captured(nextState, mv).reduce((c, i) => c.concat(i), []);
            nextState[mv.x][mv.y].captured = captured.slice();
            if (isKoSituation(mv)) {
                nextState[captured[0].x][captured[0].y].state = _models__WEBPACK_IMPORTED_MODULE_0__["State"].KO;
            }
            return captured.reduce((p, c) => {
                p[c.x][c.y].state = c.state === _models__WEBPACK_IMPORTED_MODULE_0__["State"].KO
                    ? _models__WEBPACK_IMPORTED_MODULE_0__["State"].KO : null;
                return p;
            }, nextState);
        }
        throw new Error(`${mv.x}:${mv.y} was not a valid move (${game[mv.x][mv.y].state})`);
    }
    resetKo(state) {
        return state.map((l) => l.map((p) => {
            p.state = p.state == _models__WEBPACK_IMPORTED_MODULE_0__["State"].KO ? null : p.state;
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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NnZmdyb3ZlL2xpYi9zZ2Zncm92ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYm9hcmQuc2VydmljZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tpZnUuc2VydmljZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWxzLnRzIiwid2VicGFjazovLy8uL3NyYy9ydWxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxnQ0FBZ0MsbUJBQW1CO0FBQ25ELGdDQUFnQyxPQUFPO0FBQ3ZDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLDRCQUE0QixzQkFBc0I7QUFDbEQsNEJBQTRCLE9BQU87QUFDbkM7O0FBRUEseUNBQXlDO0FBQ3pDO0FBQ0E7O0FBRUEsaUJBQWlCLEdBQUcsU0FBUyxFQUFFO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxpREFBaUQsUUFBUTs7QUFFekQ7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsK0JBQStCLDJCQUEyQjtBQUMxRCwrQkFBK0IsT0FBTztBQUN0Qzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbUNBQW1DLGlCQUFpQjtBQUNwRDtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLGtCQUFrQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IscUJBQXFCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLEdBQUcsU0FBUyxFQUFFO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1DQUFtQztBQUNuQzs7QUFFQSxzQ0FBc0M7QUFDdEM7O0FBRUEsK0JBQStCLHFCQUFxQjtBQUNwRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZ0VBQWdFO0FBQ2hFOztBQUVBLCtCQUErQixxQkFBcUI7QUFDcEQsdUVBQXVFO0FBQ3ZFOztBQUVBLG9DQUFvQztBQUNwQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMkJBQTJCLGdCQUFnQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkJBQTJCLFdBQVc7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVDQUF1QyxpQkFBaUI7O0FBRXhEO0FBQ0E7QUFDQSwyQkFBMkIsdUJBQXVCO0FBQ2xEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLDBCQUEwQjtBQUMxQjs7QUFFQTtBQUNBOztBQUVBOztBQUVBLHFDQUFxQyxvQkFBb0IsYUFBYSxFQUFFO0FBQ3hFLG9EQUFvRCxVQUFVOztBQUU5RCxnREFBZ0QsOENBQThDO0FBQzlGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSwrQkFBK0IsbUJBQW1CO0FBQ2xEO0FBQ0E7O0FBRUE7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBLG1DQUFtQyxtQkFBbUI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0RBQW9EO0FBQ3BEO0FBQ0EsbURBQW1ELG9CQUFvQixjQUFjLEVBQUUsRUFBRTtBQUN6RjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTCxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLHlCQUF5QixRQUFRO0FBQ2pDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNDQUFzQywrQkFBK0IsRUFBRTtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLG1DQUFtQyxtQkFBbUI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsb0NBQW9DLG1CQUFtQjtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyx3QkFBd0I7QUFDekQsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsbUJBQW1CLHFCQUFxQixpQkFBaUIsRUFBRSxFQUFFO0FBQzdELCtCQUErQixtQkFBbUIsRUFBRTtBQUNwRCxnQ0FBZ0MsYUFBYSxFQUFFO0FBQy9DLG9DQUFvQyxXQUFXO0FBQy9DLFNBQVM7O0FBRVQscUNBQXFDLFFBQVE7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLCtCQUErQiwyQkFBMkIsRUFBRTtBQUM1RDtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVCxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsMERBQTBEO0FBQzFEO0FBQ0EsU0FBUzs7QUFFVCx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsMERBQTBEO0FBQzFEO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0EsS0FBSzs7QUFFTCxZQUFZO0FBQ1o7QUFDQSx5QkFBeUIsZUFBZTtBQUN4Qzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQjtBQUNBO0FBQ0EsMkJBQTJCLFNBQVM7QUFDcEM7QUFDQTtBQUNBLDJCQUEyQixTQUFTO0FBQ3BDOztBQUVBO0FBQ0EsZ0NBQWdDLFNBQVM7QUFDekMsb0NBQW9DLFNBQVM7QUFDN0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0EsNkJBQTZCLEVBQUU7QUFDL0IsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLEVBQUUsVUFBVSxFQUFFO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1FQUFtRTtBQUNuRTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMLFFBQVEsSUFBOEI7QUFDdEMsa0NBQWtDO0FBQ2xDO0FBQ0EsU0FBUyxFQUVKOztBQUVMLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDbjBCRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQXVDO0FBQ0U7QUFDQTtBQUUxQixNQUFNLFlBQVk7SUFLL0I7UUFKQSxVQUFLLEdBQVEsRUFBRSxDQUFDO1FBQ2hCLGdCQUFXLEdBQUcsSUFBSSxxREFBVyxFQUFFLENBQUM7UUFDaEMsZ0JBQVcsR0FBRyxJQUFJLHFEQUFXLEVBQUUsQ0FBQztRQUNoQyxZQUFPLEdBQVUsRUFBRSxDQUFDO1FBV3BCLGdCQUFXLEdBQUcsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLEtBQUssR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRW5GLFNBQUksR0FBRyxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4QyxPQUFFLEdBQUcsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBWHRELENBQUM7SUFFRCxJQUFJLENBQUMsSUFBWTtRQUNmLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuSCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFPRCxJQUFJLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNO1FBQ3BELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDdkQsS0FBSyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLDZDQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyw2Q0FBSyxDQUFDLEtBQUs7WUFDNUMsS0FBSyxFQUFFLEtBQUs7WUFDWixDQUFDLEVBQUUsQ0FBQztZQUNKLENBQUMsRUFBRSxDQUFDO1NBQ0wsQ0FBQztRQUVGLElBQUksVUFBVSxFQUFFO1lBQ2QsSUFBSSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUM7WUFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZFO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsV0FBVyxDQUFDLENBQVMsRUFBRSxDQUFTO1FBQzlCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRCxJQUFJO1FBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkUsQ0FBQztDQUNGOzs7Ozs7Ozs7Ozs7O0FDaEREO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBMkM7QUFDRjtBQUNBO0FBRTFCLFNBQVMsSUFBSTtJQUN4QixPQUFPLGFBQWEsQ0FBQztBQUN6QixDQUFDO0FBRWlEOzs7Ozs7Ozs7Ozs7O0FDUmxEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBb0M7QUFDSTtBQUN6QixNQUFNLFdBQVc7SUFDNUI7SUFFQSxDQUFDO0lBRUQsSUFBSSxDQUFDLEdBQVE7UUFDVCxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyw4Q0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ3JFLE9BQU87WUFDSCxPQUFPLEVBQUU7Z0JBQ0wsRUFBRSxLQUFLLEVBQUUsNkNBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUU7Z0JBQ3JDLEVBQUUsS0FBSyxFQUFFLDZDQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFO2FBQ3hDO1lBQ0QsSUFBSSxFQUFFO2dCQUNGLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxFQUFFO2FBQ1g7WUFDRCxJQUFJLEVBQUU7Z0JBQ0YsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsU0FBUyxFQUFFLEVBQUU7Z0JBQ2IsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsV0FBVyxFQUFFLEVBQUU7YUFDbEI7WUFDRCxJQUFJO1lBQ0osSUFBSTtTQUNQLENBQUM7SUFDTixDQUFDO0NBQ0o7Ozs7Ozs7Ozs7Ozs7QUM5QkQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFPLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQztBQUM1QixNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUM7QUFFbEIsTUFBTSxLQUFLLEdBQVEsSUFBSSxDQUFDO0FBQ3hCLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQztBQUN0QixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUM7QUFDdEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ3BCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQztBQUNwQixNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFDMUIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ3BCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQztBQUNwQixNQUFNLEdBQUcsR0FBRyxVQUFVLENBQUM7QUFDdkIsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDO0FBRWxDLElBQVksS0FJWDtBQUpELFdBQVksS0FBSztJQUNmLHdCQUFlO0lBQ2Ysd0JBQWU7SUFDZixrQkFBUztBQUNYLENBQUMsRUFKVyxLQUFLLEtBQUwsS0FBSyxRQUloQjs7Ozs7Ozs7Ozs7OztBQ2xCRDtBQUFBO0FBQUE7QUFBdUM7QUFFeEIsTUFBTSxXQUFXO0lBQzVCLFFBQVEsQ0FBQyxJQUFTLEVBQUUsRUFBUTtRQUN4QixJQUFJLFNBQVMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFPLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUN0RSxNQUFNLFdBQVcsR0FBRyxDQUFDLENBQU8sRUFBRSxFQUFFO1lBQzVCLE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDdEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNO1FBQ3hDLENBQUMsQ0FBQztRQUNGLE1BQU0sYUFBYSxHQUFHLENBQUMsQ0FBTyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssNkNBQUssQ0FBQyxFQUFFO1FBQ3BFLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNsRCxNQUFNLEtBQUssR0FBRyxDQUFDLENBQU8sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pHLE1BQU0sYUFBYSxHQUFHLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFFbEcsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDWCxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNwQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDM0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNoRixTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRWxELElBQUksYUFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUNuQixTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsNkNBQUssQ0FBQyxFQUFFLENBQUM7YUFDNUQ7WUFFRCxPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxLQUFLLDZDQUFLLENBQUMsRUFBRTtvQkFDcEMsQ0FBQyxDQUFDLDZDQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ3RCLE9BQU8sQ0FBQyxDQUFDO1lBQ2IsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQ2pCO1FBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsMEJBQTBCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDeEYsQ0FBQztJQUVELE9BQU8sQ0FBQyxLQUFZO1FBQ2hCLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFO1lBQzFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssSUFBSSw2Q0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQy9DLE9BQU8sQ0FBQyxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQVUsRUFBRSxJQUFTO1FBQzFCLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDekIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE9BQU87WUFDSCxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO1lBQ2pELElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7WUFDL0MsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtZQUNqRCxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO1NBQ2xELENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFVLEVBQUUsS0FBVyxFQUFFLFFBQWdCLEVBQUUsRUFBRSxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUU7UUFDbEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDckMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUNiLElBQUksR0FBRyxDQUFDO1lBQ0osS0FBSztZQUNMLEdBQUcsS0FBSztZQUNSLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDO2lCQUN6QixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLEtBQUssQ0FBQztpQkFDckUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztpQkFDOUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7U0FDekMsQ0FBQyxDQUNMLENBQUM7SUFDTixDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQVUsRUFBRSxJQUFVO1FBQzdCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVELFNBQVMsQ0FBQyxLQUFVLEVBQUUsSUFBVSxFQUFFLEdBQVU7UUFDeEMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUNiLElBQUksR0FBRyxDQUNILElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQzthQUNsQixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNuQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQzthQUNqQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQzdDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQzdELENBQ0osQ0FBQztJQUNOLENBQUM7SUFFRCxRQUFRLENBQUMsS0FBVSxFQUFFLElBQVU7UUFDM0IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7YUFDNUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDOUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDO2FBQ25ELEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEMsQ0FBQztDQUNKIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFNHRkdyb3ZlID0ge307XG5cbiAgICBTR0ZHcm92ZS5VdGlsID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIFV0aWwgPSB7fTtcblxuICAgICAgICBVdGlsLmlzTnVtYmVyID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiICYmIGlzRmluaXRlKHZhbHVlKTtcbiAgICAgICAgfTtcblxuICAgICAgICBVdGlsLmlzSW50ZWdlciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIFV0aWwuaXNOdW1iZXIodmFsdWUpICYmIE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gVXRpbDtcbiAgICB9KCkpO1xuXG4gICAgU0dGR3JvdmUucGFyc2UgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc291cmNlLCBsYXN0SW5kZXgsIHJldml2ZXI7XG5cbiAgICAgICAgLy8gT3ZlcnJpZGUgUmVnRXhwJ3MgdGVzdCBhbmQgZXhlYyBtZXRob2RzIHRvIGxldCBeIGJlaGF2ZSBsaWtlXG4gICAgICAgIC8vIHRoZSBcXEcgYXNzZXJ0aW9uICgvXFxHLi4uL2djKS4gU2VlIGFsc286XG4gICAgICAgIC8vIGh0dHA6Ly9wZXJsZG9jLnBlcmwub3JnL3BlcmxvcC5odG1sI1JlZ2V4cC1RdW90ZS1MaWtlLU9wZXJhdG9yc1xuXG4gICAgICAgIHZhciBXaGl0ZXNwYWNlcyA9IC9eXFxzKi9nLFxuICAgICAgICAgICAgT3BlblBhcmVuICAgPSAvXlxcKFxccyovZyxcbiAgICAgICAgICAgIENsb3NlUGFyZW4gID0gL15cXClcXHMqL2csXG4gICAgICAgICAgICBTZW1pY29sb24gICA9IC9eO1xccyovZyxcbiAgICAgICAgICAgIFByb3BJZGVudCAgID0gL14oW2EtekEtWjAtOV0rKVxccyovZyxcbiAgICAgICAgICAgIFByb3BWYWx1ZSAgID0gL15cXFsoKD86XFxcXFtcXFNcXHNdfFteXFxdXFxcXF0rKSopXFxdXFxzKi9nO1xuXG4gICAgICAgIHZhciB0ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGJvb2wgPSB0aGlzLnRlc3Qoc291cmNlLnNsaWNlKGxhc3RJbmRleCkpO1xuICAgICAgICAgICAgbGFzdEluZGV4ICs9IHRoaXMubGFzdEluZGV4O1xuICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgcmV0dXJuIGJvb2w7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGV4ZWMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXJyYXkgPSB0aGlzLmV4ZWMoc291cmNlLnNsaWNlKGxhc3RJbmRleCkpO1xuICAgICAgICAgICAgbGFzdEluZGV4ICs9IHRoaXMubGFzdEluZGV4O1xuICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBwYXJzZUdhbWVUcmVlID0gZnVuY3Rpb24gKHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIHZhciBzZXF1ZW5jZSA9IFtdO1xuXG4gICAgICAgICAgICBpZiAoIXRlc3QuY2FsbChPcGVuUGFyZW4pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aGlsZSAodGVzdC5jYWxsKFNlbWljb2xvbikpIHtcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IHt9O1xuXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkZW50ID0gZXhlYy5jYWxsKFByb3BJZGVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZGVudCA9IGlkZW50WzFdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5oYXNPd25Qcm9wZXJ0eShpZGVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIlByb3BlcnR5IFwiK2lkZW50K1wiIGFscmVhZHkgZXhpc3RzXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlcyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdiA9IGV4ZWMuY2FsbChQcm9wVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYpIHsgdmFsdWVzLnB1c2godlsxXSk7IH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIlByb3BWYWx1ZSBvZiBcIitpZGVudCtcIiBpcyBtaXNzaW5nXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbm9kZVtpZGVudF0gPSB2YWx1ZXM7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgfHwgY3JlYXRlUHJvcGVydGllcyhub2RlKTtcbiAgICAgICAgICAgICAgICBub2RlID0gcGFyc2VQcm9wZXJ0aWVzKG5vZGUsIHByb3BlcnRpZXMpO1xuXG4gICAgICAgICAgICAgICAgc2VxdWVuY2UucHVzaChub2RlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFzZXF1ZW5jZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJHYW1lVHJlZSBkb2VzIG5vdCBjb250YWluIGFueSBOb2Rlc1wiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gW107XG5cbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gcGFyc2VHYW1lVHJlZShwcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQpIHsgY2hpbGRyZW4ucHVzaChjaGlsZCk7IH1cbiAgICAgICAgICAgICAgICAgICAgICBlbHNlIHsgYnJlYWs7IH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF0ZXN0LmNhbGwoQ2xvc2VQYXJlbikpIHsgLy8gZW5kIG9mIEdhbWVUcmVlXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiVW5leHBlY3RlZCB0b2tlbiBcIitzb3VyY2UuY2hhckF0KGxhc3RJbmRleCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyAoO2EoO2IpKSA9PiAoO2E7YilcbiAgICAgICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICBzZXF1ZW5jZSA9IHNlcXVlbmNlLmNvbmNhdChjaGlsZHJlblswXVswXSk7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBjaGlsZHJlblswXVsxXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFtzZXF1ZW5jZSwgY2hpbGRyZW5dO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBjcmVhdGVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHJvb3QpIHtcbiAgICAgICAgICAgIHZhciBTR0ZOdW1iZXIgPSBTR0ZHcm92ZS5maWxlRm9ybWF0KHsgRkY6IDQgfSkuVHlwZXMuTnVtYmVyO1xuXG4gICAgICAgICAgICB2YXIgZmlsZUZvcm1hdCA9IFNHRkdyb3ZlLmZpbGVGb3JtYXQoe1xuICAgICAgICAgICAgICAgIEZGIDogU0dGTnVtYmVyLnBhcnNlKHJvb3QuRkYgfHwgW10pIHx8IDEsXG4gICAgICAgICAgICAgICAgR00gOiBTR0ZOdW1iZXIucGFyc2Uocm9vdC5HTSB8fCBbXSkgfHwgMVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBmaWxlRm9ybWF0LnByb3BlcnRpZXMoKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgcGFyc2VQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKG5vZGUsIHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIHZhciBuID0ge307XG5cbiAgICAgICAgICAgIGZvciAodmFyIGlkZW50IGluIG5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5oYXNPd25Qcm9wZXJ0eShpZGVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3AgPSBwcm9wZXJ0aWVzLnBhcnNlKGlkZW50LCBub2RlW2lkZW50XSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJJbnZhbGlkIFByb3BJZGVudCBcIitpZGVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobi5oYXNPd25Qcm9wZXJ0eShwcm9wWzBdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiUHJvcGVydHkgXCIrcHJvcFswXStcIiBhbHJlYWR5IGV4aXN0c1wiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChwcm9wWzFdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdHIgPSBpZGVudCtcIltcIitub2RlW2lkZW50XS5qb2luKFwiXVtcIikrXCJdXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJJbnZhbGlkIFByb3BWYWx1ZSBcIitzdHIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbltwcm9wWzBdXSA9IHByb3BbMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgfTtcbiBcbiAgICAgICAgLy8gQ29waWVkIGFuZCByZWFycmFuZ2VkIGZyb20ganNvbjIuanMgc28gdGhhdCB3ZSBjYW4gcGFzcyB0aGUgc2FtZVxuICAgICAgICAvLyBjYWxsYmFjayB0byBib3RoIG9mIFNHRi5wYXJzZSBhbmQgSlNPTi5wYXJzZVxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZG91Z2xhc2Nyb2NrZm9yZC9KU09OLWpzL2Jsb2IvbWFzdGVyL2pzb24yLmpzXG4gICAgICAgIHZhciB3YWxrID0gZnVuY3Rpb24gKGhvbGRlciwga2V5KSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBob2xkZXJba2V5XTtcblxuICAgICAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGsgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdiA9IHdhbGsodmFsdWUsIGspO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlW2tdID0gdjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB2YWx1ZVtrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJldml2ZXIuY2FsbChob2xkZXIsIGtleSwgdmFsdWUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodGV4dCwgcmV2KSB7XG4gICAgICAgICAgICB2YXIgY29sbGVjdGlvbiA9IFtdO1xuXG4gICAgICAgICAgICBzb3VyY2UgPSBTdHJpbmcodGV4dCk7XG4gICAgICAgICAgICBsYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgcmV2aXZlciA9IHR5cGVvZiByZXYgPT09IFwiZnVuY3Rpb25cIiAmJiByZXY7XG5cbiAgICAgICAgICAgIHRlc3QuY2FsbChXaGl0ZXNwYWNlcyk7XG5cbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdhbWVUcmVlID0gcGFyc2VHYW1lVHJlZSgpO1xuICAgICAgICAgICAgICAgIGlmIChnYW1lVHJlZSkgeyBjb2xsZWN0aW9uLnB1c2goZ2FtZVRyZWUpOyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7IGJyZWFrOyB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChsYXN0SW5kZXggIT09IHNvdXJjZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJVbmV4cGVjdGVkIHRva2VuIFwiK3NvdXJjZS5jaGFyQXQobGFzdEluZGV4KSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXZpdmVyID8gd2Fsayh7IFwiXCI6IGNvbGxlY3Rpb24gfSwgXCJcIikgOiBjb2xsZWN0aW9uO1xuICAgICAgICB9O1xuICAgIH0oKSk7XG5cbiAgICBTR0ZHcm92ZS5zdHJpbmdpZnkgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG4gICAgICAgIHZhciByZXBsYWNlciwgc2VsZWN0ZWQsIGluZGVudCwgZ2FwO1xuXG4gICAgICAgIHZhciBjcmVhdGVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHJvb3QpIHtcbiAgICAgICAgICAgIHZhciBmaWxlRm9ybWF0ID0gU0dGR3JvdmUuZmlsZUZvcm1hdCh7XG4gICAgICAgICAgICAgICAgRkYgOiByb290Lmhhc093blByb3BlcnR5KFwiRkZcIikgPyByb290LkZGIDogMSxcbiAgICAgICAgICAgICAgICBHTSA6IHJvb3QuaGFzT3duUHJvcGVydHkoXCJHTVwiKSA/IHJvb3QuR00gOiAxXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmaWxlRm9ybWF0LnByb3BlcnRpZXMoKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZmluYWxpemUgPSBmdW5jdGlvbiAoa2V5LCBob2xkZXIpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGhvbGRlcltrZXldO1xuICAgICAgICAgICAgdmFyIGksIGssIHY7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgdmFsdWUudG9TR0YgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9TR0Yoa2V5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlcGxhY2VyKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSByZXBsYWNlci5jYWxsKGhvbGRlciwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdmFsdWUgfHwgdHlwZW9mIHZhbHVlICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgdiA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB2ID0gW107XG4gICAgICAgICAgICAgICAgZm9yICggaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgICAgICAgICAgdltpXSA9IGZpbmFsaXplKGksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2ID0ge307XG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBzZWxlY3RlZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdltzZWxlY3RlZFtpXV0gPSBmaW5hbGl6ZShzZWxlY3RlZFtpXSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGsgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZba10gPSBmaW5hbGl6ZShrLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB2O1xuICAgICAgICB9O1xuIFxuICAgICAgICB2YXIgc3RyaW5naWZ5R2FtZVRyZWUgPSBmdW5jdGlvbiAoZ2FtZVRyZWUsIHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIGdhbWVUcmVlID0gaXNBcnJheShnYW1lVHJlZSkgPyBnYW1lVHJlZSA6IFtdO1xuXG4gICAgICAgICAgICB2YXIgc2VxdWVuY2UgPSBpc0FycmF5KGdhbWVUcmVlWzBdKSA/IGdhbWVUcmVlWzBdIDogW10sXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBpc0FycmF5KGdhbWVUcmVlWzFdKSA/IGdhbWVUcmVlWzFdIDogW107XG5cbiAgICAgICAgICAgIC8vICg7YSg7YikpID0+ICg7YTtiKVxuICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHNlcXVlbmNlID0gc2VxdWVuY2UuY29uY2F0KGlzQXJyYXkoY2hpbGRyZW5bMF1bMF0pID8gY2hpbGRyZW5bMF1bMF0gOiBbXSk7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBpc0FycmF5KGNoaWxkcmVuWzBdWzFdKSA/IGNoaWxkcmVuWzBdWzFdIDogW107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB0ZXh0ID0gXCJcIixcbiAgICAgICAgICAgICAgICBsZiA9IGluZGVudCA/IFwiXFxuXCIgOiBcIlwiLFxuICAgICAgICAgICAgICAgIG1pbmQgPSBnYXA7XG5cbiAgICAgICAgICAgIGlmIChzZXF1ZW5jZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0ZXh0ICs9IGdhcCtcIihcIitsZjsgLy8gb3BlbiBHYW1lVHJlZVxuICAgICAgICAgICAgICAgIGdhcCArPSBpbmRlbnQ7XG5cbiAgICAgICAgICAgICAgICB2YXIgc2VtaWNvbG9uID0gZ2FwK1wiO1wiLFxuICAgICAgICAgICAgICAgICAgICBzcGFjZSA9IGdhcCsoaW5kZW50ID8gXCIgXCIgOiBcIlwiKTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VxdWVuY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBzZXF1ZW5jZVtpXSAmJiB0eXBlb2Ygc2VxdWVuY2VbaV0gPT09IFwib2JqZWN0XCIgPyBzZXF1ZW5jZVtpXSA6IHt9O1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGFydGlhbCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzIHx8IGNyZWF0ZVByb3BlcnRpZXMobm9kZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaWRlbnQgaW4gbm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuaGFzT3duUHJvcGVydHkoaWRlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlcyA9IHByb3BlcnRpZXMuc3RyaW5naWZ5KGlkZW50LCBub2RlW2lkZW50XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWFsLnB1c2goaWRlbnQrXCJbXCIrdmFsdWVzLmpvaW4oXCJdW1wiKStcIl1cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGV4dCArPSBzZW1pY29sb24rcGFydGlhbC5qb2luKGxmK3NwYWNlKStsZjsgLy8gYWRkIE5vZGVcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQgKz0gc3RyaW5naWZ5R2FtZVRyZWUoY2hpbGRyZW5bal0sIHByb3BlcnRpZXMpOyAvLyBhZGQgR2FtZVRyZWVcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0ZXh0ICs9IG1pbmQrXCIpXCIrbGY7IC8vIGNsb3NlIEdhbWVUcmVlXG4gICAgICAgICAgICAgICAgZ2FwID0gbWluZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChjb2xsZWN0aW9uLCByZXAsIHNwYWNlKSB7XG4gICAgICAgICAgICB2YXIgdGV4dCwgaTtcblxuICAgICAgICAgICAgcmVwbGFjZXIgPSBudWxsO1xuICAgICAgICAgICAgc2VsZWN0ZWQgPSBudWxsO1xuICAgICAgICAgICAgaW5kZW50ID0gXCJcIjtcbiAgICAgICAgICAgIGdhcCA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChpc0FycmF5KHJlcCkpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZCA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCByZXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXBbaV0gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkLnB1c2gocmVwW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiByZXAgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHJlcGxhY2VyID0gcmVwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAocmVwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicmVwbGFjZXIgbXVzdCBiZSBhcnJheSBvciBmdW5jdGlvblwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzcGFjZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBzcGFjZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGVudCArPSBcIiBcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2Ygc3BhY2UgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICBpbmRlbnQgPSBzcGFjZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29sbGVjdGlvbiA9IGZpbmFsaXplKFwiXCIsIHsgXCJcIjogY29sbGVjdGlvbiB9KTtcblxuICAgICAgICAgICAgaWYgKGlzQXJyYXkoY29sbGVjdGlvbikpIHtcbiAgICAgICAgICAgICAgICB0ZXh0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29sbGVjdGlvbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0ICs9IHN0cmluZ2lmeUdhbWVUcmVlKGNvbGxlY3Rpb25baV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH07XG4gICAgfSgpKTtcblxuICAgIFNHRkdyb3ZlLmZpbGVGb3JtYXQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaXNJbnRlZ2VyID0gU0dGR3JvdmUuVXRpbC5pc0ludGVnZXIsXG4gICAgICAgICAgICBGRiA9IHt9O1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodmVyc2lvbiwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHZlcnNpb24gPSB2ZXJzaW9uIHx8IHt9O1xuXG4gICAgICAgICAgICB2YXIgZmYgPSB2ZXJzaW9uLkZGLFxuICAgICAgICAgICAgICAgIGdtID0gdmVyc2lvbi5HTTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzSW50ZWdlcihmZikgJiYgZmYgPiAwICYmIEZGW2ZmXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNJbnRlZ2VyKGdtKSAmJiBnbSA+IDAgJiYgRkZbZmZdLkdNW2dtXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZGW2ZmXS5HTVtnbV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZGW2ZmXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIEZGO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZmlsZUZvcm1hdCA9IHt9O1xuICAgICAgICAgICAgICAgIGZpbGVGb3JtYXQgPSBjYWxsYmFjay5jYWxsKGZpbGVGb3JtYXQsIEZGKSB8fCBmaWxlRm9ybWF0O1xuXG4gICAgICAgICAgICBpZiAoZmYgJiYgZ20pIHtcbiAgICAgICAgICAgICAgICBGRltmZl0uR01bZ21dID0gZmlsZUZvcm1hdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGZmKSB7XG4gICAgICAgICAgICAgICAgZmlsZUZvcm1hdC5HTSA9IGZpbGVGb3JtYXQuR00gfHwge307XG4gICAgICAgICAgICAgICAgRkZbZmZdID0gZmlsZUZvcm1hdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIEZGID0gZmlsZUZvcm1hdDtcbiAgICAgICAgICAgIH1cbiBcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICB9KCkpO1xuXG4gICAgU0dGR3JvdmUuZmlsZUZvcm1hdCh7fSwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgVHlwZXMgPSB7fTtcblxuICAgICAgICBUeXBlcy5zY2FsYXIgPSBmdW5jdGlvbiAoYXJncykge1xuICAgICAgICAgICAgYXJncyA9IGFyZ3MgfHwge307XG5cbiAgICAgICAgICAgIHZhciB0aGF0ID0ge307XG5cbiAgICAgICAgICAgIHZhciBsaWtlID0gYXJncy5saWtlIHx8IHsgdGVzdDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJ1ZTsgfSB9O1xuICAgICAgICAgICAgdmFyIHBhcnNlID0gYXJncy5wYXJzZSB8fCBmdW5jdGlvbiAodikgeyByZXR1cm4gdjsgfTtcblxuICAgICAgICAgICAgdmFyIGlzYSA9IGFyZ3MuaXNhIHx8IGZ1bmN0aW9uICh2KSB7IHJldHVybiB0eXBlb2YgdiA9PT0gXCJzdHJpbmdcIiAmJiBsaWtlLnRlc3Qodik7IH07XG4gICAgICAgICAgICB2YXIgc3RyaW5naWZ5ID0gYXJncy5zdHJpbmdpZnkgfHwgU3RyaW5nO1xuXG4gICAgICAgICAgICB0aGF0LnBhcnNlID0gZnVuY3Rpb24gKHZhbHVlcykge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID09PSAxICYmIGxpa2UudGVzdCh2YWx1ZXNbMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZSh2YWx1ZXNbMF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoYXQuc3RyaW5naWZ5ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzYSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtzdHJpbmdpZnkodmFsdWUpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gdGhhdDtcbiAgICAgICAgfTtcblxuICAgICAgICBUeXBlcy5Vbmtub3duID0ge1xuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbaV0gPSB2YWx1ZXNbaV0ucmVwbGFjZSgvXFxcXFxcXS9nLCBcIl1cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZXNbaV0gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbaV0gPSB2YWx1ZXNbaV0ucmVwbGFjZSgvXFxdL2csIFwiXFxcXF1cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLlR5cGVzID0gVHlwZXM7XG5cbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHQsIGFyZ3MpIHtcbiAgICAgICAgICAgIHQgPSB0IHx8IFR5cGVzO1xuICAgICAgICAgICAgYXJncyA9IGFyZ3MgfHwge307XG5cbiAgICAgICAgICAgIHZhciB0aGF0ID0ge1xuICAgICAgICAgICAgICAgIHR5cGVPZiAgICAgIDogYXJncy50eXBlT2YgICAgICB8fCB7fSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0VHlwZSA6IGFyZ3MuZGVmYXVsdFR5cGUgfHwgdC5Vbmtub3duLFxuICAgICAgICAgICAgICAgIGlkZW50aWZpZXJzIDogYXJncy5pZGVudGlmaWVycyB8fCB7IHRlc3Q6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGZhbHNlOyB9IH0sXG4gICAgICAgICAgICAgICAgcmVwbGFjZXIgICAgOiBhcmdzLnJlcGxhY2VyXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGF0Lm1lcmdlID0gZnVuY3Rpb24gKG90aGVyKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaWRlbnQgaW4gb3RoZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG90aGVyLmhhc093blByb3BlcnR5KGlkZW50KSAmJiBvdGhlcltpZGVudF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHlwZU9mW2lkZW50XSA9IG90aGVyW2lkZW50XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoYXQucGFyc2UgPSBmdW5jdGlvbiAoaWRlbnQsIHZhbHVlcykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlcGxhY2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlkZW50ID0gdGhpcy5yZXBsYWNlci5jYWxsKG51bGwsIGlkZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaWRlbnRpZmllcnMudGVzdChpZGVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGUgPSB0aGlzLnR5cGVPZltpZGVudF0gfHwgdGhpcy5kZWZhdWx0VHlwZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtpZGVudCwgdHlwZS5wYXJzZSh2YWx1ZXMpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGF0LnN0cmluZ2lmeSA9IGZ1bmN0aW9uIChpZGVudCwgdmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaWRlbnRpZmllcnMudGVzdChpZGVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGUgPSB0aGlzLnR5cGVPZltpZGVudF0gfHwgdGhpcy5kZWZhdWx0VHlwZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHR5cGUuc3RyaW5naWZ5KHZhbHVlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoYXQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH0pO1xuXG4gICAgLy8gRmlsZSBGb3JtYXQgKDtGRls0XSlcbiAgICAvLyBodHRwOi8vd3d3LnJlZC1iZWFuLmNvbS9zZ2Yvc2dmNC5odG1sXG4gICAgLy8gaHR0cDovL3d3dy5yZWQtYmVhbi5jb20vc2dmL3Byb3BlcnRpZXMuaHRtbFxuICAgIFNHRkdyb3ZlLmZpbGVGb3JtYXQoeyBGRjogNCB9LCBmdW5jdGlvbiAoRkYpIHtcbiAgICAgICAgdmFyIFR5cGVzID0gT2JqZWN0LmNyZWF0ZShGRi5UeXBlcyk7XG4gICAgICAgIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxuICAgICAgICBUeXBlcy5jb21wb3NlID0gZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4gbGVmdCAmJiByaWdodCAmJiB7XG4gICAgICAgICAgICAgICAgZXNjYXBlOiBmdW5jdGlvbiAodikgeyByZXR1cm4gdi5yZXBsYWNlKC86L2csIFwiXFxcXDpcIik7IH0sXG4gICAgICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ID0gL14oKD86XFxcXFtcXFNcXHNdfFteOlxcXFxdKykqKTooKD86XFxcXFtcXFNcXHNdfFteOlxcXFxdKykqKSQvLmV4ZWModmFsdWVzWzBdKSB8fCB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbCA9IHYgJiYgbGVmdC5wYXJzZShbdlsxXV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHIgPSB2ICYmIHJpZ2h0LnBhcnNlKFt2WzJdXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobCAhPT0gdW5kZWZpbmVkICYmIHIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbbCwgcl07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsID0gbGVmdC5zdHJpbmdpZnkodmFsdWVbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHIgPSByaWdodC5zdHJpbmdpZnkodmFsdWVbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGwgJiYgciAmJiBbdGhpcy5lc2NhcGUobFswXSkrXCI6XCIrdGhpcy5lc2NhcGUoclswXSldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcblxuICAgICAgICBUeXBlcy5saXN0T2YgPSBmdW5jdGlvbiAoc2NhbGFyLCBhcmdzKSB7XG4gICAgICAgICAgICBhcmdzID0gYXJncyB8fCB7fTtcblxuICAgICAgICAgICAgcmV0dXJuIHNjYWxhciAmJiB7XG4gICAgICAgICAgICAgICAgY2FuQmVFbXB0eTogYXJncy5jYW5CZUVtcHR5LFxuICAgICAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCA9PT0gMSAmJiB2YWx1ZXNbMF0gPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbkJlRW1wdHkgPyByZXN1bHQgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2ldID0gc2NhbGFyLnBhcnNlKFt2YWx1ZXNbaV1dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHRbaV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0FycmF5KHZhbHVlcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghdmFsdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FuQmVFbXB0eSA/IFtcIlwiXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbaV0gPSBzY2FsYXIuc3RyaW5naWZ5KHZhbHVlc1tpXSlbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHJlc3VsdFtpXSA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0b0VsaXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvdGhlciA9IE9iamVjdC5jcmVhdGUodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIG90aGVyLmNhbkJlRW1wdHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3RoZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcblxuICAgICAgICBUeXBlcy5lbGlzdE9mID0gZnVuY3Rpb24gKHNjYWxhcikge1xuICAgICAgICAgICAgcmV0dXJuIFR5cGVzLmxpc3RPZihzY2FsYXIsIHtcbiAgICAgICAgICAgICAgICBjYW5CZUVtcHR5OiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBUeXBlcy5vciA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYSAmJiBiICYmIHtcbiAgICAgICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gYS5wYXJzZSh2YWx1ZXMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0ICE9PSB1bmRlZmluZWQgPyByZXN1bHQgOiBiLnBhcnNlKHZhbHVlcyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS5zdHJpbmdpZnkodmFsdWUpIHx8IGIuc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIE51bWJlciA9IFtcIitcInxcIi1cIl0gRGlnaXQge0RpZ2l0fVxuICAgICAgICBUeXBlcy5OdW1iZXIgPSBUeXBlcy5zY2FsYXIoe1xuICAgICAgICAgICAgbGlrZTogL15bKy1dP1xcZCskLyxcbiAgICAgICAgICAgIGlzYTogU0dGR3JvdmUuVXRpbC5pc0ludGVnZXIsXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHBhcnNlSW50KHYsIDEwKTsgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBOb25lID0gXCJcIlxuICAgICAgICBUeXBlcy5Ob25lID0gVHlwZXMuc2NhbGFyKHtcbiAgICAgICAgICAgIGxpa2U6IHsgdGVzdDogZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHYgPT09IFwiXCI7IH0gfSxcbiAgICAgICAgICAgIGlzYTogZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHYgPT09IG51bGw7IH0sXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKCkgeyByZXR1cm4gbnVsbDsgfSxcbiAgICAgICAgICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKCkgeyByZXR1cm4gXCJcIjsgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBSZWFsID0gTnVtYmVyIFtcIi5cIiBEaWdpdCB7IERpZ2l0IH1dXG4gICAgICAgIFR5cGVzLlJlYWwgPSBUeXBlcy5zY2FsYXIoe1xuICAgICAgICAgICAgbGlrZTogL15bKy1dP1xcZCsoPzpcXC5cXGQrKT8kLyxcbiAgICAgICAgICAgIGlzYTogU0dGR3JvdmUuVXRpbC5pc051bWJlcixcbiAgICAgICAgICAgIHBhcnNlOiBwYXJzZUZsb2F0XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIERvdWJsZSA9IChcIjFcIiB8IFwiMlwiKVxuICAgICAgICBUeXBlcy5Eb3VibGUgPSBUeXBlcy5zY2FsYXIoe1xuICAgICAgICAgICAgbGlrZTogL15bMTJdJC8sXG4gICAgICAgICAgICBpc2E6IGZ1bmN0aW9uICh2KSB7IHJldHVybiB2ID09PSAxIHx8IHYgPT09IDI7IH0sXG4gICAgICAgICAgICBwYXJzZTogcGFyc2VJbnRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQ29sb3IgPSAoXCJCXCIgfCBcIldcIilcbiAgICAgICAgVHlwZXMuQ29sb3IgPSBUeXBlcy5zY2FsYXIoe1xuICAgICAgICAgICAgbGlrZTogL15bQlddJC9cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVGV4dCA9IHsgYW55IGNoYXJhY3RlciB9XG4gICAgICAgIFR5cGVzLlRleHQgPSBUeXBlcy5zY2FsYXIoe1xuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5cbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHNvZnQgbGluZWJyZWFrc1xuICAgICAgICAgICAgICAgICAgICByZXBsYWNlKC9cXFxcKD86XFxuXFxyP3xcXHJcXG4/KS9nLCBcIlwiKS5cbiAgICAgICAgICAgICAgICAgICAgLy8gY29udmVydCB3aGl0ZSBzcGFjZXMgb3RoZXIgdGhhbiBsaW5lYnJlYWtzIHRvIHNwYWNlXG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2UoL1teXFxTXFxuXFxyXS9nLCBcIiBcIikuXG4gICAgICAgICAgICAgICAgICAgIC8vIGluc2VydCBlc2NhcGVkIGNoYXJzIHZlcmJhdGltXG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2UoL1xcXFwoW1xcU1xcc10pL2csIFwiJDFcIik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RyaW5naWZ5OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvKFtcXF1cXFxcXSkvZywgXCJcXFxcJDFcIik7IC8vIGVzY2FwZSBcIl1cIiBhbmQgXCJcXFwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFNpbXBsZVRleHQgPSB7IGFueSBjaGFyYWN0ZXIgfVxuICAgICAgICBUeXBlcy5TaW1wbGVUZXh0ID0gVHlwZXMuc2NhbGFyKHtcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBzb2Z0IGxpbmVicmVha3NcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZSgvXFxcXCg/Olxcblxccj98XFxyXFxuPykvZywgXCJcIikuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnZlcnQgd2hpdGUgc3BhY2VzIG90aGVyIHRoYW4gc3BhY2UgdG8gc3BhY2UgZXZlbiBpZiBpdCdzIGVzY2FwZWRcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZSgvXFxcXD9bXlxcUyBdL2csIFwiIFwiKS5cbiAgICAgICAgICAgICAgICAgICAgLy8gaW5zZXJ0IGVzY2FwZWQgY2hhcnMgdmVyYmF0aW1cbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZSgvXFxcXChbXFxTXFxzXSkvZywgXCIkMVwiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC8oW1xcXVxcXFxdKS9nLCBcIlxcXFwkMVwiKTsgLy8gZXNjYXBlIFwiXVwiIGFuZCBcIlxcXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5UeXBlcyA9IFR5cGVzO1xuXG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICB0ID0gdCB8fCBUeXBlcztcblxuICAgICAgICAgICAgcmV0dXJuIEZGLnByb3BlcnRpZXModCwge1xuICAgICAgICAgICAgICAgIGlkZW50aWZpZXJzOiAvXltBLVpdKyQvLFxuICAgICAgICAgICAgICAgIHR5cGVPZjoge1xuICAgICAgICAgICAgICAgICAgICAvLyBNb3ZlIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgQiAgOiB0Lk1vdmUsXG4gICAgICAgICAgICAgICAgICAgIEtPIDogdC5Ob25lLFxuICAgICAgICAgICAgICAgICAgICBNTiA6IHQuTnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBXICA6IHQuTW92ZSxcbiAgICAgICAgICAgICAgICAgICAgLy8gU2V0dXAgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICBBQiA6IHQubGlzdE9mU3RvbmUgfHwgdC5saXN0T2YodC5TdG9uZSksXG4gICAgICAgICAgICAgICAgICAgIEFFIDogdC5saXN0T2ZQb2ludCxcbiAgICAgICAgICAgICAgICAgICAgQVcgOiB0Lmxpc3RPZlN0b25lIHx8IHQubGlzdE9mKHQuU3RvbmUpLFxuICAgICAgICAgICAgICAgICAgICBQTCA6IHQuQ29sb3IsXG4gICAgICAgICAgICAgICAgICAgIC8vIE5vZGUgYW5ub3RhdGlvbiBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgIEMgIDogdC5UZXh0LFxuICAgICAgICAgICAgICAgICAgICBETSA6IHQuRG91YmxlLFxuICAgICAgICAgICAgICAgICAgICBHQiA6IHQuRG91YmxlLFxuICAgICAgICAgICAgICAgICAgICBHVyA6IHQuRG91YmxlLFxuICAgICAgICAgICAgICAgICAgICBITyA6IHQuRG91YmxlLFxuICAgICAgICAgICAgICAgICAgICBOICA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgVUMgOiB0LkRvdWJsZSxcbiAgICAgICAgICAgICAgICAgICAgViAgOiB0LlJlYWwsXG4gICAgICAgICAgICAgICAgICAgIC8vIE1vdmUgYW5ub3RhdGlvbiBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgIEJNIDogdC5Eb3VibGUsXG4gICAgICAgICAgICAgICAgICAgIERPIDogdC5Ob25lLFxuICAgICAgICAgICAgICAgICAgICBJVCA6IHQuTm9uZSxcbiAgICAgICAgICAgICAgICAgICAgVEUgOiB0LkRvdWJsZSxcbiAgICAgICAgICAgICAgICAgICAgLy8gTWFya3VwIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgQVIgOiB0Lmxpc3RPZih0LmNvbXBvc2UodC5Qb2ludCwgdC5Qb2ludCkpLFxuICAgICAgICAgICAgICAgICAgICBDUiA6IHQubGlzdE9mUG9pbnQsXG4gICAgICAgICAgICAgICAgICAgIEREIDogdC5lbGlzdE9mUG9pbnQsXG4gICAgICAgICAgICAgICAgICAgIExCIDogdC5saXN0T2YodC5jb21wb3NlKHQuUG9pbnQsIHQuU2ltcGxlVGV4dCkpLFxuICAgICAgICAgICAgICAgICAgICBMTiA6IHQubGlzdE9mKHQuY29tcG9zZSh0LlBvaW50LCB0LlBvaW50KSksXG4gICAgICAgICAgICAgICAgICAgIE1BIDogdC5saXN0T2ZQb2ludCxcbiAgICAgICAgICAgICAgICAgICAgU0wgOiB0Lmxpc3RPZlBvaW50LFxuICAgICAgICAgICAgICAgICAgICBTUSA6IHQubGlzdE9mUG9pbnQsXG4gICAgICAgICAgICAgICAgICAgIFRSIDogdC5saXN0T2ZQb2ludCxcbiAgICAgICAgICAgICAgICAgICAgLy8gUm9vdCBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgIEFQIDogdC5jb21wb3NlKHQuU2ltcGxlVGV4dCwgdC5TaW1wbGVUZXh0KSxcbiAgICAgICAgICAgICAgICAgICAgQ0EgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIEZGIDogdC5OdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIEdNIDogdC5OdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIFNUIDogdC5OdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIFNaIDogdC5vcih0Lk51bWJlciwgdC5jb21wb3NlKHQuTnVtYmVyLCB0Lk51bWJlcikpLFxuICAgICAgICAgICAgICAgICAgICAvLyBHYW1lIGluZm8gcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICBBTiA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgQlIgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIEJUIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBDUCA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgRFQgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIEVWIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBHTiA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgR0MgOiB0LlRleHQsXG4gICAgICAgICAgICAgICAgICAgIE9OIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBPVCA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgUEIgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIFBDIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBQVyA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgUkUgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIFJPIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICBSVSA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgU08gOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIFRNIDogdC5SZWFsLFxuICAgICAgICAgICAgICAgICAgICBVUyA6IHQuU2ltcGxlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgV1IgOiB0LlNpbXBsZVRleHQsXG4gICAgICAgICAgICAgICAgICAgIFdUIDogdC5TaW1wbGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICAvLyBUaW1pbmcgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICBCTCA6IHQuUmVhbCxcbiAgICAgICAgICAgICAgICAgICAgT0IgOiB0Lk51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgT1cgOiB0Lk51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgV0wgOiB0LlJlYWwsXG4gICAgICAgICAgICAgICAgICAgIC8vIE1pc2NlbGxhbmVvdXMgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICBGRyA6IHQub3IodC5Ob25lLCB0LmNvbXBvc2UodC5OdW1iZXIsIHQuU2ltcGxlVGV4dCkpLFxuICAgICAgICAgICAgICAgICAgICBQTSA6IHQuTnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBWTSA6IHQuZWxpc3RPZlBvaW50XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH0pO1xuXG4gICAgLy8gR28gKDtGRls0XUdNWzFdKSBzcGVjaWZpYyBwcm9wZXJ0aWVzXG4gICAgLy8gaHR0cDovL3d3dy5yZWQtYmVhbi5jb20vc2dmL2dvLmh0bWxcbiAgICBTR0ZHcm92ZS5maWxlRm9ybWF0KHsgRkY6IDQsIEdNOiAxIH0sIGZ1bmN0aW9uIChGRikge1xuICAgICAgICB2YXIgVHlwZXMgPSBPYmplY3QuY3JlYXRlKEZGWzRdLlR5cGVzKTtcblxuICAgICAgICB2YXIgZXhwYW5kUG9pbnRMaXN0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjb29yZCA9IFwiYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpcIjtcbiAgICAgICAgICAgICAgICBjb29yZCArPSBjb29yZC50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHAxLCBwMikge1xuICAgICAgICAgICAgICAgIHZhciB4MSA9IGNvb3JkLmluZGV4T2YocDEuY2hhckF0KDApKSxcbiAgICAgICAgICAgICAgICAgICAgeTEgPSBjb29yZC5pbmRleE9mKHAxLmNoYXJBdCgxKSksXG4gICAgICAgICAgICAgICAgICAgIHgyID0gY29vcmQuaW5kZXhPZihwMi5jaGFyQXQoMCkpLFxuICAgICAgICAgICAgICAgICAgICB5MiA9IGNvb3JkLmluZGV4T2YocDIuY2hhckF0KDEpKTtcblxuICAgICAgICAgICAgICAgIHZhciBoOyBcbiAgICAgICAgICAgICAgICBpZiAoeDEgPiB4Mikge1xuICAgICAgICAgICAgICAgICAgICBoID0geDE7IHgxID0geDI7IHgyID0gaDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHkxID4geTIpIHtcbiAgICAgICAgICAgICAgICAgICAgaCA9IHkxOyB5MSA9IHkyOyB5MiA9IGg7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHBvaW50cyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHkgPSB5MTsgeSA8PSB5MjsgeSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSB4MTsgeCA8PSB4MjsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjb29yZC5jaGFyQXQoeCkrY29vcmQuY2hhckF0KHkpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBwb2ludHM7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KCkpO1xuXG4gICAgICAgIFR5cGVzLlBvaW50ID0gVHlwZXMuc2NhbGFyKHtcbiAgICAgICAgICAgIGxpa2U6IC9eW2EtekEtWl17Mn0kL1xuICAgICAgICB9KTtcbiAgXG4gICAgICAgIFR5cGVzLlN0b25lID0gVHlwZXMuUG9pbnQ7XG4gICAgICAgIFR5cGVzLk1vdmUgID0gVHlwZXMub3IoVHlwZXMuTm9uZSwgVHlwZXMuUG9pbnQpO1xuXG4gICAgICAgIFR5cGVzLmxpc3RPZlBvaW50ID0gKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICB2YXIgbGlzdE9mUG9pbnQgPSB0Lmxpc3RPZih0Lm9yKFxuICAgICAgICAgICAgICAgIHQuUG9pbnQsXG4gICAgICAgICAgICAgICAgdC5zY2FsYXIoe1xuICAgICAgICAgICAgICAgICAgICBsaWtlOiAvXlthLXpBLVpdezJ9OlthLXpBLVpdezJ9JC8sXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWN0ID0gdmFsdWUuc3BsaXQoXCI6XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4cGFuZFBvaW50TGlzdChyZWN0WzBdLCByZWN0WzFdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApKTtcblxuICAgICAgICAgICAgdmFyIHBhcnNlID0gbGlzdE9mUG9pbnQucGFyc2U7XG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBbXTtcblxuICAgICAgICAgICAgbGlzdE9mUG9pbnQucGFyc2UgPSBmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHBhcnNlLmNhbGwodGhpcywgdmFsdWVzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0ICYmIGFycmF5LmNvbmNhdC5hcHBseShhcnJheSwgcmVzdWx0KTsgLy8gZmxhdHRlblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIGxpc3RPZlBvaW50O1xuICAgICAgICB9KFR5cGVzKSk7XG5cbiAgICAgICAgVHlwZXMuZWxpc3RPZlBvaW50ID0gVHlwZXMubGlzdE9mUG9pbnQudG9FbGlzdCgpO1xuXG4gICAgICAgIFR5cGVzLmxpc3RPZlN0b25lICA9IFR5cGVzLmxpc3RPZlBvaW50O1xuICAgICAgICBUeXBlcy5lbGlzdE9mU3RvbmUgPSBUeXBlcy5lbGlzdE9mUG9pbnQ7XG4gICAgXG4gICAgICAgIHRoaXMuVHlwZXMgPSBUeXBlcztcblxuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgdCA9IHQgfHwgVHlwZXM7XG5cbiAgICAgICAgICAgIHZhciB0aGF0ID0gRkZbNF0ucHJvcGVydGllcyh0KTtcblxuICAgICAgICAgICAgdGhhdC5tZXJnZSh7XG4gICAgICAgICAgICAgICAgSEEgOiB0Lk51bWJlcixcbiAgICAgICAgICAgICAgICBLTSA6IHQuUmVhbCxcbiAgICAgICAgICAgICAgICBUQiA6IHQuZWxpc3RPZlBvaW50LFxuICAgICAgICAgICAgICAgIFRXIDogdC5lbGlzdE9mUG9pbnRcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhhdDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm47XG4gICAgfSk7XG5cbiAgICBpZiAodHlwZW9mIGV4cG9ydHMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBTR0ZHcm92ZTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB3aW5kb3cuU0dGR3JvdmUgPSBTR0ZHcm92ZTtcbiAgICB9XG5cbn0oKSk7XG5cbiIsImltcG9ydCB7IFN0YXRlLCBNb3ZlIH0gZnJvbSBcIi4vbW9kZWxzXCI7XG5pbXBvcnQgUnVsZVNlcnZpY2UgZnJvbSBcIi4vcnVsZS5zZXJ2aWNlXCI7XG5pbXBvcnQgS2lmdVNlcnZpY2UgZnJvbSBcIi4va2lmdS5zZXJ2aWNlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvYXJkU2VydmljZSB7XG4gIGJvYXJkOiBhbnkgPSBbXTtcbiAgcnVsZVNlcnZpY2UgPSBuZXcgUnVsZVNlcnZpY2UoKTtcbiAga2lmdVNlcnZpY2UgPSBuZXcgS2lmdVNlcnZpY2UoKTtcbiAgaGlzdG9yeTogYW55W10gPSBbXTtcbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgfVxuXG4gIGluaXQoc2l6ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5oaXN0b3J5ID0gW107XG4gICAgdGhpcy5ib2FyZCA9IHRoaXMubGluZShzaXplKS5tYXAoKF8sIHgpID0+IHRoaXMubGluZShzaXplKSkubWFwKChfLCB4KSA9PiBfLm1hcCgoXywgeSkgPT4gdGhpcy5jcmVhdGVQb2ludCh4LCB5KSkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgY3JlYXRlUG9pbnQgPSAoeDogbnVtYmVyLCB5OiBudW1iZXIsIHN0YXRlID0gbnVsbCkgPT4gKHsgc3RhdGU6IHN0YXRlLCBvcmRlcjogMCB9KTtcblxuICBsaW5lID0gKHM6IG51bWJlcikgPT4gQXJyYXkocykuZmlsbCgnJyk7XG4gIGF0ID0gKHg6IG51bWJlciwgeTogbnVtYmVyKTogTW92ZSA9PiB0aGlzLmJvYXJkW3hdW3ldO1xuXG4gIHBsYXkoeDogbnVtYmVyLCB5OiBudW1iZXIsIG9yZGVyID0gdGhpcy5oaXN0b3J5Lmxlbmd0aCkge1xuICAgIGNvbnN0IHZhbGlkU3RhdGUgPSB0aGlzLnJ1bGVTZXJ2aWNlLnZhbGlkYXRlKHRoaXMuYm9hcmQsIHtcbiAgICAgIHN0YXRlOiBvcmRlciAlIDIgPyBTdGF0ZS5XSElURSA6IFN0YXRlLkJMQUNLLFxuICAgICAgb3JkZXI6IG9yZGVyLFxuICAgICAgeDogeCxcbiAgICAgIHk6IHlcbiAgICB9KVxuXG4gICAgaWYgKHZhbGlkU3RhdGUpIHtcbiAgICAgIHRoaXMuYm9hcmQgPSB2YWxpZFN0YXRlO1xuICAgICAgdGhpcy5oaXN0b3J5ID0gWy4uLnRoaXMuaGlzdG9yeSwgT2JqZWN0LmFzc2lnbih7fSwgdmFsaWRTdGF0ZVt4XVt5XSldO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpYmVydGllc0F0KHg6IG51bWJlciwgeTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCBtID0gdGhpcy5hdCh4LCB5KTtcbiAgICByZXR1cm4gbSA/IHRoaXMucnVsZVNlcnZpY2UubGliZXJ0aWVzKHRoaXMuYm9hcmQsIG0pLmxlbmd0aCA6IDA7XG4gIH1cblxuICBzaG93KCkge1xuICAgIC8vIFxuICAgIGNvbnNvbGUubG9nKHRoaXMuYm9hcmQubWFwKGwgPT4gbC5tYXAocCA9PiBwLnN0YXRlID8gcC5zdGF0ZSA6ICcnKSkpO1xuICB9XG59IiwiaW1wb3J0IEJvYXJkU2VydmljZSBmcm9tIFwiLi9ib2FyZC5zZXJ2aWNlXCI7XG5pbXBvcnQgUnVsZVNlcnZpY2UgZnJvbSBcIi4vcnVsZS5zZXJ2aWNlXCI7XG5pbXBvcnQgS2lmdVNlcnZpY2UgZnJvbSBcIi4va2lmdS5zZXJ2aWNlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgcmV0dXJuICd0ZXN0IDA5NzA5OCc7XG59XG5cbmV4cG9ydCB7IEJvYXJkU2VydmljZSwgUnVsZVNlcnZpY2UsIEtpZnVTZXJ2aWNlIH07XG4iLCJpbXBvcnQgKiBhcyBzZ2Zncm92ZSBmcm9tICdzZ2Zncm92ZSdcbmltcG9ydCB7IEJMQUNLLCBXSElURSB9IGZyb20gJy4vbW9kZWxzJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEtpZnVTZXJ2aWNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIHJlYWQoc3ZnOiBhbnkpIHtcbiAgICAgICAgY29uc3QgW1tbbWV0YSwgLi4uZ2FtZV1dXSA9IHNnZmdyb3ZlLnBhcnNlKHN2Zyk7XG4gICAgICAgIGNvbnN0IHsgUEIsIFBXLCBCUiwgV1IsIFNaLCBLTSwgUlUsIEdOLCBDUCwgVVMsIEFOLCAuLi5yZXN0IH0gPSBtZXRhO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGxheWVyczogW1xuICAgICAgICAgICAgICAgIHsgY29sb3I6IEJMQUNLLCBuYW1lOiBQQiwgbGV2ZWw6IEJSIH0sXG4gICAgICAgICAgICAgICAgeyBjb2xvcjogV0hJVEUsIG5hbWU6IFBXLCBsZXZlbDogV1IgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBpbmZvOiB7XG4gICAgICAgICAgICAgICAgc2l6ZTogU1osXG4gICAgICAgICAgICAgICAga29taTogS00sXG4gICAgICAgICAgICAgICAgcnVsZTogUlUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWV0YToge1xuICAgICAgICAgICAgICAgIG5hbWU6IEdOLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogQ1AsXG4gICAgICAgICAgICAgICAgc2NyaWJlOiBVUyxcbiAgICAgICAgICAgICAgICBjb21tZW50YXRvcjogQU5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN0LFxuICAgICAgICAgICAgZ2FtZVxuICAgICAgICB9O1xuICAgIH1cbn0iLCJleHBvcnQgY29uc3QgQVBQTkFNRSA9IFwidGVuZ2VuLmpzXCI7XG5leHBvcnQgY29uc3QgVkVSID0gXCIwLjFcIjtcblxuZXhwb3J0IGNvbnN0IEVNUFRZOiBhbnkgPSBudWxsO1xuZXhwb3J0IGNvbnN0IEJMQUNLID0gXCJibGFja1wiO1xuZXhwb3J0IGNvbnN0IFdISVRFID0gXCJ3aGl0ZVwiO1xuZXhwb3J0IGNvbnN0IFBBU1MgPSBcInBhc3NcIjtcbmV4cG9ydCBjb25zdCBVTkRPID0gXCJ1bmRvXCI7XG5leHBvcnQgY29uc3QgQUJBTkRPTiA9IFwiYWJhbmRvblwiO1xuZXhwb3J0IGNvbnN0IE5FWFQgPSBcIm5leHRcIjtcbmV4cG9ydCBjb25zdCBQUkVWID0gXCJwcmV2XCI7XG5leHBvcnQgY29uc3QgRU5EID0gXCJlbmRfZ2FtZVwiO1xuZXhwb3J0IGNvbnN0IFNUQVJUID0gXCJzdGFydF9nYW1lXCI7XG5cbmV4cG9ydCBlbnVtIFN0YXRlIHtcbiAgQkxBQ0sgPSAnYmxhY2snLFxuICBXSElURSA9ICd3aGl0ZScsXG4gIEtPID0gJ2tvJyxcbn0gXG5leHBvcnQgaW50ZXJmYWNlIE1vdmUge1xuICBzdGF0ZTogU3RhdGUgfCBudWxsLFxuICB1cGRhdGVkX2F0PzogRGF0ZSxcbiAgb3JkZXI6IG51bWJlciwgXG4gIHg6bnVtYmVyXG4gIHk6bnVtYmVyLFxuICBsb2c/OiBNb3ZlW10sXG4gIGNhcHR1cmVkPzogW11cbn1cblxuLypcbmV4cG9ydCBjb25zdCBhbHBoYWJldCA9IChzID0gMjYpID0+IHtcbiAgcmV0dXJuIG5ldyBBcnJheShzKS5maWxsKDEpLm1hcCgoXzphbnksIGk6bnVtYmVyKSA9PiBTdHJpbmcuZnJvbUNoYXJDb2RlKDk3ICsgaSkpO1xufTtcblxuZXhwb3J0IGNvbnN0IGEybiA9IChhIDogc3RyaW5nKSA9PiB7XG4gIHJldHVybiBhbHBoYWJldCgpLmluZGV4T2YoYSk7XG59O1xuZXhwb3J0IGNvbnN0IG4yYSA9IChuOiBudW1iZXIpID0+IHtcbiAgcmV0dXJuIGFscGhhYmV0KClbbl07XG59O1xuXG5leHBvcnQgY29uc3QgdG9Db29yZCA9IChub2RlOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0pID0+IHtcbiAgY29uc3QgeyB4LCB5IH0gPSBub2RlO1xuICByZXR1cm4gbjJhKHgpICsgbjJhKHkpO1xufTtcbmV4cG9ydCBjb25zdCBmcm9tU0dGQ29vcmQgPSAoc2dmbm9kZTogYW55KSA9PiB7XG4gIGNvbnN0IG1vdmUgPSBzZ2Zub2RlLkIgfHwgc2dmbm9kZS5XO1xuICBpZiAobW92ZSkge1xuICAgIGNvbnN0IFt4LCB5XSA9IG1vdmUuc3BsaXQoXCJcIik7XG4gICAgcmV0dXJuIHsgeDogYTJuKHgpLCB5OiBhMm4oeSkgfTtcbiAgfVxuICByZXR1cm4geyB4OiBudWxsLCB5OiBudWxsIH07XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIEl0ZW0ge1xuICBpZD86IGFueTtcbiAgY3JlYXRlZEF0PzogRGF0ZSB8IG51bGw7XG4gIHVwZGF0ZWRBdD86IERhdGUgfCBudWxsO1xuICBkZWxldGVkQXQ/OiBEYXRlIHwgbnVsbDtcbiAgYXV0aG9yPzogUGxheWVyO1xufVxuZXhwb3J0IGludGVyZmFjZSBDb21tZW50IHtcbiAgb3JkZXI6IG51bWJlcjtcbiAgdGV4dDogc3RyaW5nO1xuICB0aW1lPzogRGF0ZTtcbiAgbW92ZT86IGFueTtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgR2FtZVNldHRpbmdzIGV4dGVuZHMgSXRlbSB7XG4gIHdoaXRlOiBQbGF5ZXI7XG4gIGJsYWNrOiBQbGF5ZXI7XG4gIHNpemU6IG51bWJlcjtcbiAgc2NvcmVzOiBTY29yZUJvYXJkO1xuICB0aXRsZT86IHN0cmluZztcbiAga29taT86IG51bWJlcjtcbiAgY2xvY2s/OiBhbnk7XG4gIGJvYXJkPzogYW55O1xuICBldmVudD86IHN0cmluZztcbiAgcm91bmQ/OiBudW1iZXI7XG4gIGRhdGU/OiBEYXRlO1xuICBsb2NhdGlvbj86IHN0cmluZztcbiAgY29tbWVudHM/OiBDb21tZW50W107XG4gIHRyZWU/OiBhbnlbXTtcbiAgbmVlZENvbmZpcm06IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2FtZUxpc3RJdGVtIHtcbiAgbmFtZTogc3RyaW5nO1xuICB1cGRhdGVkX2F0OiBhbnk7XG4gIHRpbWVzdGFtcDogbnVtYmVyO1xuICBrZXk6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQbGF5ZXIgZXh0ZW5kcyBJdGVtIHtcbiAgbmFtZTogc3RyaW5nO1xuICByYW5rPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNjb3JlQm9hcmQgZXh0ZW5kcyBJdGVtIHtcbiAgYmxhY2s6IFNjb3JlIHwgbnVsbDtcbiAgd2hpdGU6IFNjb3JlIHwgbnVsbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTY29yZSBleHRlbmRzIEl0ZW0ge1xuICBjYXB0dXJlZD86IG51bWJlcjtcbiAgdGVycml0b3J5PzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1vdmUgZXh0ZW5kcyBJdGVtIHtcbiAgeD86IG51bWJlcjtcbiAgeT86IG51bWJlcjtcbiAgcGxheWVyOiBhbnk7XG4gIHN0YXRlOiBhbnk7XG4gIGxlYWZzPzogTW92ZVtdO1xuICBvcmRlcj86IG51bWJlcjtcbiAgaW5IaXN0b3J5PzogYm9vbGVhbjtcbiAgY2FwdHVyZWQ/OiBNb3ZlW107XG4gIHBsYXllZDogYm9vbGVhbjtcbiAgY29tbWVudHM/OiBhbnlbXTtcbiAgdGltZT86IG51bWJlcjtcbn1cbiovIiwiaW1wb3J0IHsgTW92ZSwgU3RhdGUgfSBmcm9tIFwiLi9tb2RlbHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUnVsZVNlcnZpY2Uge1xuICAgIHZhbGlkYXRlKGdhbWU6IGFueSwgbXY6IE1vdmUpIHtcbiAgICAgICAgbGV0IG5leHRTdGF0ZSA9IFsuLi5nYW1lLnNsaWNlKCldO1xuICAgICAgICBjb25zdCBoYXNMaWJlcnRpZXMgPSAobTogTW92ZSkgPT4gdGhpcy5saWJlcnRpZXMobmV4dFN0YXRlLCBtKS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGlzQ2FwdHVyaW5nID0gKG06IE1vdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5leHQgPSBbLi4uZ2FtZS5zbGljZSgpXTtcbiAgICAgICAgICAgIG5leHRbbXYueF1bbXYueV0gPSBtdjtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhcHR1cmVkKG5leHQsIG0pLmxlbmd0aFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBpc0tvUHJvdGVjdGVkID0gKG06IE1vdmUpID0+IGdhbWVbbS54XVttLnldLnN0YXRlID09PSBTdGF0ZS5LT1xuICAgICAgICBjb25zdCBpc0ZyZWUgPSAobTogTW92ZSkgPT4gIWdhbWVbbS54XVttLnldLnN0YXRlO1xuICAgICAgICBjb25zdCB2YWxpZCA9IChtOiBNb3ZlKSA9PiBpc0ZyZWUobSkgJiYgKGlzQ2FwdHVyaW5nKG0pIHx8IGhhc0xpYmVydGllcyhtKSkgJiYgIWlzS29Qcm90ZWN0ZWQobSk7XG4gICAgICAgIGNvbnN0IGlzS29TaXR1YXRpb24gPSAobTogYW55KSA9PiBtLmNhcHR1cmVkLmxlbmd0aCA9PT0gMSAmJiAhdGhpcy5saWJlcnRpZXMobmV4dFN0YXRlLCBtKS5sZW5ndGg7XG5cbiAgICAgICAgaWYgKHZhbGlkKG12KSkge1xuICAgICAgICAgICAgbmV4dFN0YXRlID0gdGhpcy5yZXNldEtvKG5leHRTdGF0ZSk7XG4gICAgICAgICAgICBuZXh0U3RhdGVbbXYueF1bbXYueV0gPSBtdjtcbiAgICAgICAgICAgIGNvbnN0IGNhcHR1cmVkID0gdGhpcy5jYXB0dXJlZChuZXh0U3RhdGUsIG12KS5yZWR1Y2UoKGMsIGkpID0+IGMuY29uY2F0KGkpLCBbXSk7XG4gICAgICAgICAgICBuZXh0U3RhdGVbbXYueF1bbXYueV0uY2FwdHVyZWQgPSBjYXB0dXJlZC5zbGljZSgpO1xuXG4gICAgICAgICAgICBpZiAoaXNLb1NpdHVhdGlvbihtdikpIHtcbiAgICAgICAgICAgICAgICBuZXh0U3RhdGVbY2FwdHVyZWRbMF0ueF1bY2FwdHVyZWRbMF0ueV0uc3RhdGUgPSBTdGF0ZS5LTztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGNhcHR1cmVkLnJlZHVjZSgocCwgYykgPT4ge1xuICAgICAgICAgICAgICAgIHBbYy54XVtjLnldLnN0YXRlID0gYy5zdGF0ZSA9PT0gU3RhdGUuS09cbiAgICAgICAgICAgICAgICAgICAgPyBTdGF0ZS5LTyA6IG51bGw7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHA7XG4gICAgICAgICAgICB9LCBuZXh0U3RhdGUpO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHttdi54fToke212Lnl9IHdhcyBub3QgYSB2YWxpZCBtb3ZlICgke2dhbWVbbXYueF1bbXYueV0uc3RhdGV9KWApO1xuICAgIH1cblxuICAgIHJlc2V0S28oc3RhdGU6IGFueVtdKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZS5tYXAoKGw6IGFueSkgPT4gbC5tYXAoKHA6IGFueSkgPT4ge1xuICAgICAgICAgICAgcC5zdGF0ZSA9IHAuc3RhdGUgPT0gU3RhdGUuS08gPyBudWxsIDogcC5zdGF0ZTtcbiAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICB9KSlcblxuICAgIH1cblxuICAgIGFkamFjZW50KGJvYXJkOiBhbnksIG1vdmU6IGFueSkge1xuICAgICAgICBjb25zdCBlbmQgPSBib2FyZC5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gMDtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIG1vdmUueSA+IHN0YXJ0ID8gYm9hcmRbbW92ZS54XVttb3ZlLnkgLSAxXSA6IG51bGwsXG4gICAgICAgICAgICBtb3ZlLnkgPCBlbmQgPyBib2FyZFttb3ZlLnhdW21vdmUueSArIDFdIDogbnVsbCxcbiAgICAgICAgICAgIG1vdmUueCA+IHN0YXJ0ID8gYm9hcmRbbW92ZS54IC0gMV1bbW92ZS55XSA6IG51bGwsXG4gICAgICAgICAgICBtb3ZlLnggPCBlbmQgPyBib2FyZFttb3ZlLnggKyAxXVttb3ZlLnldIDogbnVsbFxuICAgICAgICBdLmZpbHRlcihpID0+IGkpO1xuICAgIH1cblxuICAgIGdyb3VwKGJvYXJkOiBhbnksIHBvaW50OiBNb3ZlLCBxdWV1ZTogTW92ZVtdID0gW10sIHZpc2l0ZWQgPSBuZXcgU2V0KCkpOiBNb3ZlW10ge1xuICAgICAgICB2aXNpdGVkLmFkZChgJHtwb2ludC54fToke3BvaW50Lnl9YCk7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKFxuICAgICAgICAgICAgbmV3IFNldChbXG4gICAgICAgICAgICAgICAgcG9pbnQsXG4gICAgICAgICAgICAgICAgLi4ucXVldWUsXG4gICAgICAgICAgICAgICAgLi4udGhpcy5hZGphY2VudChib2FyZCwgcG9pbnQpXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIobiA9PiAhdmlzaXRlZC5oYXMoYCR7bi54fToke24ueX1gKSAmJiBuLnN0YXRlID09PSBwb2ludC5zdGF0ZSlcbiAgICAgICAgICAgICAgICAgICAgLm1hcChuID0+IHRoaXMuZ3JvdXAoYm9hcmQsIG4sIHF1ZXVlLCB2aXNpdGVkKSlcbiAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgdikgPT4gYS5jb25jYXQodiksIFtdKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBzbGliZXJ0aWVzKGJvYXJkOiBhbnksIG1vdmU6IE1vdmUpOiBNb3ZlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGphY2VudChib2FyZCwgbW92ZSkuZmlsdGVyKGkgPT4gIWkuc3RhdGUpO1xuICAgIH1cblxuICAgIGxpYmVydGllcyhib2FyZDogYW55LCBtb3ZlOiBNb3ZlLCBjYXA/OiBNb3ZlKTogTW92ZVtdIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oXG4gICAgICAgICAgICBuZXcgU2V0KFxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXAoYm9hcmQsIG1vdmUpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAobSA9PiB0aGlzLnNsaWJlcnRpZXMoYm9hcmQsIG0pKVxuICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhLCB2KSA9PiBhLmNvbmNhdCh2KSwgW10pXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIobCA9PiBsLnggIT09IG1vdmUueCB8fCBsLnkgIT09IG1vdmUueSlcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihsID0+ICFjYXAgfHwgKGwueCAhPT0gY2FwLnggfHwgbC55ICE9PSBjYXAueSkpXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgY2FwdHVyZWQoYm9hcmQ6IGFueSwgbW92ZTogTW92ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGphY2VudChib2FyZCwgbW92ZSlcbiAgICAgICAgICAgIC5maWx0ZXIobSA9PiBtLnN0YXRlICYmIG0uc3RhdGUgIT09IG1vdmUuc3RhdGUpXG4gICAgICAgICAgICAuZmlsdGVyKG8gPT4gIXRoaXMubGliZXJ0aWVzKGJvYXJkLCBvLCBtb3ZlKS5sZW5ndGgpXG4gICAgICAgICAgICAubWFwKGMgPT4gdGhpcy5ncm91cChib2FyZCwgYykpO1xuICAgIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=