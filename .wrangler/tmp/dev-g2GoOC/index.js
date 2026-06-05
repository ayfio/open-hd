var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_modules_watch_stub();
  }
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// node_modules/ajv/dist/compile/codegen/code.js
var require_code = __commonJS({
  "node_modules/ajv/dist/compile/codegen/code.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
    var _CodeOrName = class {
      static {
        __name(this, "_CodeOrName");
      }
    };
    exports._CodeOrName = _CodeOrName;
    exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    var Name = class extends _CodeOrName {
      static {
        __name(this, "Name");
      }
      constructor(s) {
        super();
        if (!exports.IDENTIFIER.test(s))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = s;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return false;
      }
      get names() {
        return { [this.str]: 1 };
      }
    };
    exports.Name = Name;
    var _Code = class extends _CodeOrName {
      static {
        __name(this, "_Code");
      }
      constructor(code) {
        super();
        this._items = typeof code === "string" ? [code] : code;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return false;
        const item = this._items[0];
        return item === "" || item === '""';
      }
      get str() {
        var _a3;
        return (_a3 = this._str) !== null && _a3 !== void 0 ? _a3 : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
      }
      get names() {
        var _a3;
        return (_a3 = this._names) !== null && _a3 !== void 0 ? _a3 : this._names = this._items.reduce((names, c) => {
          if (c instanceof Name)
            names[c.str] = (names[c.str] || 0) + 1;
          return names;
        }, {});
      }
    };
    exports._Code = _Code;
    exports.nil = new _Code("");
    function _(strs, ...args) {
      const code = [strs[0]];
      let i = 0;
      while (i < args.length) {
        addCodeArg(code, args[i]);
        code.push(strs[++i]);
      }
      return new _Code(code);
    }
    __name(_, "_");
    exports._ = _;
    var plus = new _Code("+");
    function str(strs, ...args) {
      const expr = [safeStringify(strs[0])];
      let i = 0;
      while (i < args.length) {
        expr.push(plus);
        addCodeArg(expr, args[i]);
        expr.push(plus, safeStringify(strs[++i]));
      }
      optimize(expr);
      return new _Code(expr);
    }
    __name(str, "str");
    exports.str = str;
    function addCodeArg(code, arg) {
      if (arg instanceof _Code)
        code.push(...arg._items);
      else if (arg instanceof Name)
        code.push(arg);
      else
        code.push(interpolate(arg));
    }
    __name(addCodeArg, "addCodeArg");
    exports.addCodeArg = addCodeArg;
    function optimize(expr) {
      let i = 1;
      while (i < expr.length - 1) {
        if (expr[i] === plus) {
          const res = mergeExprItems(expr[i - 1], expr[i + 1]);
          if (res !== void 0) {
            expr.splice(i - 1, 3, res);
            continue;
          }
          expr[i++] = "+";
        }
        i++;
      }
    }
    __name(optimize, "optimize");
    function mergeExprItems(a, b) {
      if (b === '""')
        return a;
      if (a === '""')
        return b;
      if (typeof a == "string") {
        if (b instanceof Name || a[a.length - 1] !== '"')
          return;
        if (typeof b != "string")
          return `${a.slice(0, -1)}${b}"`;
        if (b[0] === '"')
          return a.slice(0, -1) + b.slice(1);
        return;
      }
      if (typeof b == "string" && b[0] === '"' && !(a instanceof Name))
        return `"${a}${b.slice(1)}`;
      return;
    }
    __name(mergeExprItems, "mergeExprItems");
    function strConcat(c1, c2) {
      return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`;
    }
    __name(strConcat, "strConcat");
    exports.strConcat = strConcat;
    function interpolate(x) {
      return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
    }
    __name(interpolate, "interpolate");
    function stringify(x) {
      return new _Code(safeStringify(x));
    }
    __name(stringify, "stringify");
    exports.stringify = stringify;
    function safeStringify(x) {
      return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    __name(safeStringify, "safeStringify");
    exports.safeStringify = safeStringify;
    function getProperty(key) {
      return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
    }
    __name(getProperty, "getProperty");
    exports.getProperty = getProperty;
    function getEsmExportName(key) {
      if (typeof key == "string" && exports.IDENTIFIER.test(key)) {
        return new _Code(`${key}`);
      }
      throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
    }
    __name(getEsmExportName, "getEsmExportName");
    exports.getEsmExportName = getEsmExportName;
    function regexpCode(rx) {
      return new _Code(rx.toString());
    }
    __name(regexpCode, "regexpCode");
    exports.regexpCode = regexpCode;
  }
});

// node_modules/ajv/dist/compile/codegen/scope.js
var require_scope = __commonJS({
  "node_modules/ajv/dist/compile/codegen/scope.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
    var code_1 = require_code();
    var ValueError = class extends Error {
      static {
        __name(this, "ValueError");
      }
      constructor(name) {
        super(`CodeGen: "code" for ${name} not defined`);
        this.value = name.value;
      }
    };
    var UsedValueState;
    (function(UsedValueState2) {
      UsedValueState2[UsedValueState2["Started"] = 0] = "Started";
      UsedValueState2[UsedValueState2["Completed"] = 1] = "Completed";
    })(UsedValueState || (exports.UsedValueState = UsedValueState = {}));
    exports.varKinds = {
      const: new code_1.Name("const"),
      let: new code_1.Name("let"),
      var: new code_1.Name("var")
    };
    var Scope = class {
      static {
        __name(this, "Scope");
      }
      constructor({ prefixes, parent } = {}) {
        this._names = {};
        this._prefixes = prefixes;
        this._parent = parent;
      }
      toName(nameOrPrefix) {
        return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
      }
      name(prefix) {
        return new code_1.Name(this._newName(prefix));
      }
      _newName(prefix) {
        const ng = this._names[prefix] || this._nameGroup(prefix);
        return `${prefix}${ng.index++}`;
      }
      _nameGroup(prefix) {
        var _a3, _b;
        if (((_b = (_a3 = this._parent) === null || _a3 === void 0 ? void 0 : _a3._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || this._prefixes && !this._prefixes.has(prefix)) {
          throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
        }
        return this._names[prefix] = { prefix, index: 0 };
      }
    };
    exports.Scope = Scope;
    var ValueScopeName = class extends code_1.Name {
      static {
        __name(this, "ValueScopeName");
      }
      constructor(prefix, nameStr) {
        super(nameStr);
        this.prefix = prefix;
      }
      setValue(value, { property, itemIndex }) {
        this.value = value;
        this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
      }
    };
    exports.ValueScopeName = ValueScopeName;
    var line = (0, code_1._)`\n`;
    var ValueScope = class extends Scope {
      static {
        __name(this, "ValueScope");
      }
      constructor(opts) {
        super(opts);
        this._values = {};
        this._scope = opts.scope;
        this.opts = { ...opts, _n: opts.lines ? line : code_1.nil };
      }
      get() {
        return this._scope;
      }
      name(prefix) {
        return new ValueScopeName(prefix, this._newName(prefix));
      }
      value(nameOrPrefix, value) {
        var _a3;
        if (value.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const name = this.toName(nameOrPrefix);
        const { prefix } = name;
        const valueKey = (_a3 = value.key) !== null && _a3 !== void 0 ? _a3 : value.ref;
        let vs = this._values[prefix];
        if (vs) {
          const _name = vs.get(valueKey);
          if (_name)
            return _name;
        } else {
          vs = this._values[prefix] = /* @__PURE__ */ new Map();
        }
        vs.set(valueKey, name);
        const s = this._scope[prefix] || (this._scope[prefix] = []);
        const itemIndex = s.length;
        s[itemIndex] = value.ref;
        name.setValue(value, { property: prefix, itemIndex });
        return name;
      }
      getValue(prefix, keyOrRef) {
        const vs = this._values[prefix];
        if (!vs)
          return;
        return vs.get(keyOrRef);
      }
      scopeRefs(scopeName, values = this._values) {
        return this._reduceValues(values, (name) => {
          if (name.scopePath === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return (0, code_1._)`${scopeName}${name.scopePath}`;
        });
      }
      scopeCode(values = this._values, usedValues, getCode) {
        return this._reduceValues(values, (name) => {
          if (name.value === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return name.value.code;
        }, usedValues, getCode);
      }
      _reduceValues(values, valueCode, usedValues = {}, getCode) {
        let code = code_1.nil;
        for (const prefix in values) {
          const vs = values[prefix];
          if (!vs)
            continue;
          const nameSet = usedValues[prefix] = usedValues[prefix] || /* @__PURE__ */ new Map();
          vs.forEach((name) => {
            if (nameSet.has(name))
              return;
            nameSet.set(name, UsedValueState.Started);
            let c = valueCode(name);
            if (c) {
              const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
              code = (0, code_1._)`${code}${def} ${name} = ${c};${this.opts._n}`;
            } else if (c = getCode === null || getCode === void 0 ? void 0 : getCode(name)) {
              code = (0, code_1._)`${code}${c}${this.opts._n}`;
            } else {
              throw new ValueError(name);
            }
            nameSet.set(name, UsedValueState.Completed);
          });
        }
        return code;
      }
    };
    exports.ValueScope = ValueScope;
  }
});

// node_modules/ajv/dist/compile/codegen/index.js
var require_codegen = __commonJS({
  "node_modules/ajv/dist/compile/codegen/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
    var code_1 = require_code();
    var scope_1 = require_scope();
    var code_2 = require_code();
    Object.defineProperty(exports, "_", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return code_2._;
    }, "get") });
    Object.defineProperty(exports, "str", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return code_2.str;
    }, "get") });
    Object.defineProperty(exports, "strConcat", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return code_2.strConcat;
    }, "get") });
    Object.defineProperty(exports, "nil", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return code_2.nil;
    }, "get") });
    Object.defineProperty(exports, "getProperty", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return code_2.getProperty;
    }, "get") });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return code_2.stringify;
    }, "get") });
    Object.defineProperty(exports, "regexpCode", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return code_2.regexpCode;
    }, "get") });
    Object.defineProperty(exports, "Name", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return code_2.Name;
    }, "get") });
    var scope_2 = require_scope();
    Object.defineProperty(exports, "Scope", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return scope_2.Scope;
    }, "get") });
    Object.defineProperty(exports, "ValueScope", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return scope_2.ValueScope;
    }, "get") });
    Object.defineProperty(exports, "ValueScopeName", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return scope_2.ValueScopeName;
    }, "get") });
    Object.defineProperty(exports, "varKinds", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return scope_2.varKinds;
    }, "get") });
    exports.operators = {
      GT: new code_1._Code(">"),
      GTE: new code_1._Code(">="),
      LT: new code_1._Code("<"),
      LTE: new code_1._Code("<="),
      EQ: new code_1._Code("==="),
      NEQ: new code_1._Code("!=="),
      NOT: new code_1._Code("!"),
      OR: new code_1._Code("||"),
      AND: new code_1._Code("&&"),
      ADD: new code_1._Code("+")
    };
    var Node = class {
      static {
        __name(this, "Node");
      }
      optimizeNodes() {
        return this;
      }
      optimizeNames(_names, _constants) {
        return this;
      }
    };
    var Def = class extends Node {
      static {
        __name(this, "Def");
      }
      constructor(varKind, name, rhs) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.rhs = rhs;
      }
      render({ es5, _n }) {
        const varKind = es5 ? scope_1.varKinds.var : this.varKind;
        const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${varKind} ${this.name}${rhs};` + _n;
      }
      optimizeNames(names, constants) {
        if (!names[this.name.str])
          return;
        if (this.rhs)
          this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
      }
      get names() {
        return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
      }
    };
    var Assign = class extends Node {
      static {
        __name(this, "Assign");
      }
      constructor(lhs, rhs, sideEffects) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
        this.sideEffects = sideEffects;
      }
      render({ _n }) {
        return `${this.lhs} = ${this.rhs};` + _n;
      }
      optimizeNames(names, constants) {
        if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects)
          return;
        this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
      }
      get names() {
        const names = this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names };
        return addExprNames(names, this.rhs);
      }
    };
    var AssignOp = class extends Assign {
      static {
        __name(this, "AssignOp");
      }
      constructor(lhs, op, rhs, sideEffects) {
        super(lhs, rhs, sideEffects);
        this.op = op;
      }
      render({ _n }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
      }
    };
    var Label = class extends Node {
      static {
        __name(this, "Label");
      }
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        return `${this.label}:` + _n;
      }
    };
    var Break = class extends Node {
      static {
        __name(this, "Break");
      }
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        const label = this.label ? ` ${this.label}` : "";
        return `break${label};` + _n;
      }
    };
    var Throw = class extends Node {
      static {
        __name(this, "Throw");
      }
      constructor(error2) {
        super();
        this.error = error2;
      }
      render({ _n }) {
        return `throw ${this.error};` + _n;
      }
      get names() {
        return this.error.names;
      }
    };
    var AnyCode = class extends Node {
      static {
        __name(this, "AnyCode");
      }
      constructor(code) {
        super();
        this.code = code;
      }
      render({ _n }) {
        return `${this.code};` + _n;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(names, constants) {
        this.code = optimizeExpr(this.code, names, constants);
        return this;
      }
      get names() {
        return this.code instanceof code_1._CodeOrName ? this.code.names : {};
      }
    };
    var ParentNode = class extends Node {
      static {
        __name(this, "ParentNode");
      }
      constructor(nodes = []) {
        super();
        this.nodes = nodes;
      }
      render(opts) {
        return this.nodes.reduce((code, n) => code + n.render(opts), "");
      }
      optimizeNodes() {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i].optimizeNodes();
          if (Array.isArray(n))
            nodes.splice(i, 1, ...n);
          else if (n)
            nodes[i] = n;
          else
            nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      optimizeNames(names, constants) {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i];
          if (n.optimizeNames(names, constants))
            continue;
          subtractNames(names, n.names);
          nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((names, n) => addNames(names, n.names), {});
      }
    };
    var BlockNode = class extends ParentNode {
      static {
        __name(this, "BlockNode");
      }
      render(opts) {
        return "{" + opts._n + super.render(opts) + "}" + opts._n;
      }
    };
    var Root = class extends ParentNode {
      static {
        __name(this, "Root");
      }
    };
    var Else = class extends BlockNode {
      static {
        __name(this, "Else");
      }
    };
    Else.kind = "else";
    var If = class _If extends BlockNode {
      static {
        __name(this, "If");
      }
      constructor(condition, nodes) {
        super(nodes);
        this.condition = condition;
      }
      render(opts) {
        let code = `if(${this.condition})` + super.render(opts);
        if (this.else)
          code += "else " + this.else.render(opts);
        return code;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const cond = this.condition;
        if (cond === true)
          return this.nodes;
        let e = this.else;
        if (e) {
          const ns = e.optimizeNodes();
          e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
        }
        if (e) {
          if (cond === false)
            return e instanceof _If ? e : e.nodes;
          if (this.nodes.length)
            return this;
          return new _If(not(cond), e instanceof _If ? [e] : e.nodes);
        }
        if (cond === false || !this.nodes.length)
          return void 0;
        return this;
      }
      optimizeNames(names, constants) {
        var _a3;
        this.else = (_a3 = this.else) === null || _a3 === void 0 ? void 0 : _a3.optimizeNames(names, constants);
        if (!(super.optimizeNames(names, constants) || this.else))
          return;
        this.condition = optimizeExpr(this.condition, names, constants);
        return this;
      }
      get names() {
        const names = super.names;
        addExprNames(names, this.condition);
        if (this.else)
          addNames(names, this.else.names);
        return names;
      }
    };
    If.kind = "if";
    var For = class extends BlockNode {
      static {
        __name(this, "For");
      }
    };
    For.kind = "for";
    var ForLoop = class extends For {
      static {
        __name(this, "ForLoop");
      }
      constructor(iteration) {
        super();
        this.iteration = iteration;
      }
      render(opts) {
        return `for(${this.iteration})` + super.render(opts);
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants))
          return;
        this.iteration = optimizeExpr(this.iteration, names, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iteration.names);
      }
    };
    var ForRange = class extends For {
      static {
        __name(this, "ForRange");
      }
      constructor(varKind, name, from, to) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.from = from;
        this.to = to;
      }
      render(opts) {
        const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
        const { name, from, to } = this;
        return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
      }
      get names() {
        const names = addExprNames(super.names, this.from);
        return addExprNames(names, this.to);
      }
    };
    var ForIter = class extends For {
      static {
        __name(this, "ForIter");
      }
      constructor(loop, varKind, name, iterable) {
        super();
        this.loop = loop;
        this.varKind = varKind;
        this.name = name;
        this.iterable = iterable;
      }
      render(opts) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants))
          return;
        this.iterable = optimizeExpr(this.iterable, names, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iterable.names);
      }
    };
    var Func = class extends BlockNode {
      static {
        __name(this, "Func");
      }
      constructor(name, args, async) {
        super();
        this.name = name;
        this.args = args;
        this.async = async;
      }
      render(opts) {
        const _async = this.async ? "async " : "";
        return `${_async}function ${this.name}(${this.args})` + super.render(opts);
      }
    };
    Func.kind = "func";
    var Return = class extends ParentNode {
      static {
        __name(this, "Return");
      }
      render(opts) {
        return "return " + super.render(opts);
      }
    };
    Return.kind = "return";
    var Try = class extends BlockNode {
      static {
        __name(this, "Try");
      }
      render(opts) {
        let code = "try" + super.render(opts);
        if (this.catch)
          code += this.catch.render(opts);
        if (this.finally)
          code += this.finally.render(opts);
        return code;
      }
      optimizeNodes() {
        var _a3, _b;
        super.optimizeNodes();
        (_a3 = this.catch) === null || _a3 === void 0 ? void 0 : _a3.optimizeNodes();
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNodes();
        return this;
      }
      optimizeNames(names, constants) {
        var _a3, _b;
        super.optimizeNames(names, constants);
        (_a3 = this.catch) === null || _a3 === void 0 ? void 0 : _a3.optimizeNames(names, constants);
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNames(names, constants);
        return this;
      }
      get names() {
        const names = super.names;
        if (this.catch)
          addNames(names, this.catch.names);
        if (this.finally)
          addNames(names, this.finally.names);
        return names;
      }
    };
    var Catch = class extends BlockNode {
      static {
        __name(this, "Catch");
      }
      constructor(error2) {
        super();
        this.error = error2;
      }
      render(opts) {
        return `catch(${this.error})` + super.render(opts);
      }
    };
    Catch.kind = "catch";
    var Finally = class extends BlockNode {
      static {
        __name(this, "Finally");
      }
      render(opts) {
        return "finally" + super.render(opts);
      }
    };
    Finally.kind = "finally";
    var CodeGen = class {
      static {
        __name(this, "CodeGen");
      }
      constructor(extScope, opts = {}) {
        this._values = {};
        this._blockStarts = [];
        this._constants = {};
        this.opts = { ...opts, _n: opts.lines ? "\n" : "" };
        this._extScope = extScope;
        this._scope = new scope_1.Scope({ parent: extScope });
        this._nodes = [new Root()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(prefix) {
        return this._scope.name(prefix);
      }
      // reserves unique name in the external scope
      scopeName(prefix) {
        return this._extScope.name(prefix);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(prefixOrName, value) {
        const name = this._extScope.value(prefixOrName, value);
        const vs = this._values[name.prefix] || (this._values[name.prefix] = /* @__PURE__ */ new Set());
        vs.add(name);
        return name;
      }
      getScopeValue(prefix, keyOrRef) {
        return this._extScope.getValue(prefix, keyOrRef);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(scopeName) {
        return this._extScope.scopeRefs(scopeName, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(varKind, nameOrPrefix, rhs, constant) {
        const name = this._scope.toName(nameOrPrefix);
        if (rhs !== void 0 && constant)
          this._constants[name.str] = rhs;
        this._leafNode(new Def(varKind, name, rhs));
        return name;
      }
      // `const` declaration (`var` in es5 mode)
      const(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
      }
      // `var` declaration with optional assignment
      var(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
      }
      // assignment code
      assign(lhs, rhs, sideEffects) {
        return this._leafNode(new Assign(lhs, rhs, sideEffects));
      }
      // `+=` code
      add(lhs, rhs) {
        return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
      }
      // appends passed SafeExpr to code or executes Block
      code(c) {
        if (typeof c == "function")
          c();
        else if (c !== code_1.nil)
          this._leafNode(new AnyCode(c));
        return this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...keyValues) {
        const code = ["{"];
        for (const [key, value] of keyValues) {
          if (code.length > 1)
            code.push(",");
          code.push(key);
          if (key !== value || this.opts.es5) {
            code.push(":");
            (0, code_1.addCodeArg)(code, value);
          }
        }
        code.push("}");
        return new code_1._Code(code);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(condition, thenBody, elseBody) {
        this._blockNode(new If(condition));
        if (thenBody && elseBody) {
          this.code(thenBody).else().code(elseBody).endIf();
        } else if (thenBody) {
          this.code(thenBody).endIf();
        } else if (elseBody) {
          throw new Error('CodeGen: "else" body without "then" body');
        }
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(condition) {
        return this._elseNode(new If(condition));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new Else());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(If, Else);
      }
      _for(node, forBody) {
        this._blockNode(node);
        if (forBody)
          this.code(forBody).endFor();
        return this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(iteration, forBody) {
        return this._for(new ForLoop(iteration), forBody);
      }
      // `for` statement for a range of values
      forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
        const name = this._scope.toName(nameOrPrefix);
        if (this.opts.es5) {
          const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
          return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
            this.var(name, (0, code_1._)`${arr}[${i}]`);
            forBody(name);
          });
        }
        return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
        if (this.opts.ownProperties) {
          return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
        }
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(For);
      }
      // `label` statement
      label(label) {
        return this._leafNode(new Label(label));
      }
      // `break` statement
      break(label) {
        return this._leafNode(new Break(label));
      }
      // `return` statement
      return(value) {
        const node = new Return();
        this._blockNode(node);
        this.code(value);
        if (node.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(Return);
      }
      // `try` statement
      try(tryBody, catchCode, finallyCode) {
        if (!catchCode && !finallyCode)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const node = new Try();
        this._blockNode(node);
        this.code(tryBody);
        if (catchCode) {
          const error2 = this.name("e");
          this._currNode = node.catch = new Catch(error2);
          catchCode(error2);
        }
        if (finallyCode) {
          this._currNode = node.finally = new Finally();
          this.code(finallyCode);
        }
        return this._endBlockNode(Catch, Finally);
      }
      // `throw` statement
      throw(error2) {
        return this._leafNode(new Throw(error2));
      }
      // start self-balancing block
      block(body, nodeCount) {
        this._blockStarts.push(this._nodes.length);
        if (body)
          this.code(body).endBlock(nodeCount);
        return this;
      }
      // end the current self-balancing block
      endBlock(nodeCount) {
        const len = this._blockStarts.pop();
        if (len === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const toClose = this._nodes.length - len;
        if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) {
          throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
        }
        this._nodes.length = len;
        return this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(name, args = code_1.nil, async, funcBody) {
        this._blockNode(new Func(name, args, async));
        if (funcBody)
          this.code(funcBody).endFunc();
        return this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(Func);
      }
      optimize(n = 1) {
        while (n-- > 0) {
          this._root.optimizeNodes();
          this._root.optimizeNames(this._root.names, this._constants);
        }
      }
      _leafNode(node) {
        this._currNode.nodes.push(node);
        return this;
      }
      _blockNode(node) {
        this._currNode.nodes.push(node);
        this._nodes.push(node);
      }
      _endBlockNode(N1, N2) {
        const n = this._currNode;
        if (n instanceof N1 || N2 && n instanceof N2) {
          this._nodes.pop();
          return this;
        }
        throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
      }
      _elseNode(node) {
        const n = this._currNode;
        if (!(n instanceof If)) {
          throw new Error('CodeGen: "else" without "if"');
        }
        this._currNode = n.else = node;
        return this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const ns = this._nodes;
        return ns[ns.length - 1];
      }
      set _currNode(node) {
        const ns = this._nodes;
        ns[ns.length - 1] = node;
      }
    };
    exports.CodeGen = CodeGen;
    function addNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) + (from[n] || 0);
      return names;
    }
    __name(addNames, "addNames");
    function addExprNames(names, from) {
      return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
    }
    __name(addExprNames, "addExprNames");
    function optimizeExpr(expr, names, constants) {
      if (expr instanceof code_1.Name)
        return replaceName(expr);
      if (!canOptimize(expr))
        return expr;
      return new code_1._Code(expr._items.reduce((items, c) => {
        if (c instanceof code_1.Name)
          c = replaceName(c);
        if (c instanceof code_1._Code)
          items.push(...c._items);
        else
          items.push(c);
        return items;
      }, []));
      function replaceName(n) {
        const c = constants[n.str];
        if (c === void 0 || names[n.str] !== 1)
          return n;
        delete names[n.str];
        return c;
      }
      __name(replaceName, "replaceName");
      function canOptimize(e) {
        return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== void 0);
      }
      __name(canOptimize, "canOptimize");
    }
    __name(optimizeExpr, "optimizeExpr");
    function subtractNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) - (from[n] || 0);
    }
    __name(subtractNames, "subtractNames");
    function not(x) {
      return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
    }
    __name(not, "not");
    exports.not = not;
    var andCode = mappend(exports.operators.AND);
    function and(...args) {
      return args.reduce(andCode);
    }
    __name(and, "and");
    exports.and = and;
    var orCode = mappend(exports.operators.OR);
    function or(...args) {
      return args.reduce(orCode);
    }
    __name(or, "or");
    exports.or = or;
    function mappend(op) {
      return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
    }
    __name(mappend, "mappend");
    function par(x) {
      return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
    }
    __name(par, "par");
  }
});

// node_modules/ajv/dist/compile/util.js
var require_util = __commonJS({
  "node_modules/ajv/dist/compile/util.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
    var codegen_1 = require_codegen();
    var code_1 = require_code();
    function toHash(arr) {
      const hash = {};
      for (const item of arr)
        hash[item] = true;
      return hash;
    }
    __name(toHash, "toHash");
    exports.toHash = toHash;
    function alwaysValidSchema(it, schema) {
      if (typeof schema == "boolean")
        return schema;
      if (Object.keys(schema).length === 0)
        return true;
      checkUnknownRules(it, schema);
      return !schemaHasRules(schema, it.self.RULES.all);
    }
    __name(alwaysValidSchema, "alwaysValidSchema");
    exports.alwaysValidSchema = alwaysValidSchema;
    function checkUnknownRules(it, schema = it.schema) {
      const { opts, self } = it;
      if (!opts.strictSchema)
        return;
      if (typeof schema === "boolean")
        return;
      const rules = self.RULES.keywords;
      for (const key in schema) {
        if (!rules[key])
          checkStrictMode(it, `unknown keyword: "${key}"`);
      }
    }
    __name(checkUnknownRules, "checkUnknownRules");
    exports.checkUnknownRules = checkUnknownRules;
    function schemaHasRules(schema, rules) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (rules[key])
          return true;
      return false;
    }
    __name(schemaHasRules, "schemaHasRules");
    exports.schemaHasRules = schemaHasRules;
    function schemaHasRulesButRef(schema, RULES) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (key !== "$ref" && RULES.all[key])
          return true;
      return false;
    }
    __name(schemaHasRulesButRef, "schemaHasRulesButRef");
    exports.schemaHasRulesButRef = schemaHasRulesButRef;
    function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
      if (!$data) {
        if (typeof schema == "number" || typeof schema == "boolean")
          return schema;
        if (typeof schema == "string")
          return (0, codegen_1._)`${schema}`;
      }
      return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
    }
    __name(schemaRefOrVal, "schemaRefOrVal");
    exports.schemaRefOrVal = schemaRefOrVal;
    function unescapeFragment(str) {
      return unescapeJsonPointer(decodeURIComponent(str));
    }
    __name(unescapeFragment, "unescapeFragment");
    exports.unescapeFragment = unescapeFragment;
    function escapeFragment(str) {
      return encodeURIComponent(escapeJsonPointer(str));
    }
    __name(escapeFragment, "escapeFragment");
    exports.escapeFragment = escapeFragment;
    function escapeJsonPointer(str) {
      if (typeof str == "number")
        return `${str}`;
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
    __name(escapeJsonPointer, "escapeJsonPointer");
    exports.escapeJsonPointer = escapeJsonPointer;
    function unescapeJsonPointer(str) {
      return str.replace(/~1/g, "/").replace(/~0/g, "~");
    }
    __name(unescapeJsonPointer, "unescapeJsonPointer");
    exports.unescapeJsonPointer = unescapeJsonPointer;
    function eachItem(xs, f) {
      if (Array.isArray(xs)) {
        for (const x of xs)
          f(x);
      } else {
        f(xs);
      }
    }
    __name(eachItem, "eachItem");
    exports.eachItem = eachItem;
    function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues: mergeValues2, resultToName }) {
      return (gen, from, to, toName) => {
        const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues2(from, to);
        return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
      };
    }
    __name(makeMergeEvaluated, "makeMergeEvaluated");
    exports.mergeEvaluated = {
      props: makeMergeEvaluated({
        mergeNames: /* @__PURE__ */ __name((gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
          gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
        }), "mergeNames"),
        mergeToName: /* @__PURE__ */ __name((gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
          if (from === true) {
            gen.assign(to, true);
          } else {
            gen.assign(to, (0, codegen_1._)`${to} || {}`);
            setEvaluated(gen, to, from);
          }
        }), "mergeToName"),
        mergeValues: /* @__PURE__ */ __name((from, to) => from === true ? true : { ...from, ...to }, "mergeValues"),
        resultToName: evaluatedPropsToName
      }),
      items: makeMergeEvaluated({
        mergeNames: /* @__PURE__ */ __name((gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)), "mergeNames"),
        mergeToName: /* @__PURE__ */ __name((gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)), "mergeToName"),
        mergeValues: /* @__PURE__ */ __name((from, to) => from === true ? true : Math.max(from, to), "mergeValues"),
        resultToName: /* @__PURE__ */ __name((gen, items) => gen.var("items", items), "resultToName")
      })
    };
    function evaluatedPropsToName(gen, ps) {
      if (ps === true)
        return gen.var("props", true);
      const props = gen.var("props", (0, codegen_1._)`{}`);
      if (ps !== void 0)
        setEvaluated(gen, props, ps);
      return props;
    }
    __name(evaluatedPropsToName, "evaluatedPropsToName");
    exports.evaluatedPropsToName = evaluatedPropsToName;
    function setEvaluated(gen, props, ps) {
      Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
    }
    __name(setEvaluated, "setEvaluated");
    exports.setEvaluated = setEvaluated;
    var snippets = {};
    function useFunc(gen, f) {
      return gen.scopeValue("func", {
        ref: f,
        code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
      });
    }
    __name(useFunc, "useFunc");
    exports.useFunc = useFunc;
    var Type;
    (function(Type2) {
      Type2[Type2["Num"] = 0] = "Num";
      Type2[Type2["Str"] = 1] = "Str";
    })(Type || (exports.Type = Type = {}));
    function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
      if (dataProp instanceof codegen_1.Name) {
        const isNumber = dataPropType === Type.Num;
        return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
      }
      return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
    }
    __name(getErrorPath, "getErrorPath");
    exports.getErrorPath = getErrorPath;
    function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
      if (!mode)
        return;
      msg = `strict mode: ${msg}`;
      if (mode === true)
        throw new Error(msg);
      it.self.logger.warn(msg);
    }
    __name(checkStrictMode, "checkStrictMode");
    exports.checkStrictMode = checkStrictMode;
  }
});

// node_modules/ajv/dist/compile/names.js
var require_names = __commonJS({
  "node_modules/ajv/dist/compile/names.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var names = {
      // validation function arguments
      data: new codegen_1.Name("data"),
      // data passed to validation function
      // args passed from referencing schema
      valCxt: new codegen_1.Name("valCxt"),
      // validation/data context - should not be used directly, it is destructured to the names below
      instancePath: new codegen_1.Name("instancePath"),
      parentData: new codegen_1.Name("parentData"),
      parentDataProperty: new codegen_1.Name("parentDataProperty"),
      rootData: new codegen_1.Name("rootData"),
      // root data - same as the data passed to the first/top validation function
      dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
      // used to support recursiveRef and dynamicRef
      // function scoped variables
      vErrors: new codegen_1.Name("vErrors"),
      // null or array of validation errors
      errors: new codegen_1.Name("errors"),
      // counter of validation errors
      this: new codegen_1.Name("this"),
      // "globals"
      self: new codegen_1.Name("self"),
      scope: new codegen_1.Name("scope"),
      // JTD serialize/parse name for JSON string and position
      json: new codegen_1.Name("json"),
      jsonPos: new codegen_1.Name("jsonPos"),
      jsonLen: new codegen_1.Name("jsonLen"),
      jsonPart: new codegen_1.Name("jsonPart")
    };
    exports.default = names;
  }
});

// node_modules/ajv/dist/compile/errors.js
var require_errors = __commonJS({
  "node_modules/ajv/dist/compile/errors.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    exports.keywordError = {
      message: /* @__PURE__ */ __name(({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation`, "message")
    };
    exports.keyword$DataError = {
      message: /* @__PURE__ */ __name(({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)`, "message")
    };
    function reportError(cxt, error2 = exports.keywordError, errorPaths, overrideAllErrors) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error2, errorPaths);
      if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) {
        addError(gen, errObj);
      } else {
        returnErrors(it, (0, codegen_1._)`[${errObj}]`);
      }
    }
    __name(reportError, "reportError");
    exports.reportError = reportError;
    function reportExtraError(cxt, error2 = exports.keywordError, errorPaths) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error2, errorPaths);
      addError(gen, errObj);
      if (!(compositeRule || allErrors)) {
        returnErrors(it, names_1.default.vErrors);
      }
    }
    __name(reportExtraError, "reportExtraError");
    exports.reportExtraError = reportExtraError;
    function resetErrorsCount(gen, errsCount) {
      gen.assign(names_1.default.errors, errsCount);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
    }
    __name(resetErrorsCount, "resetErrorsCount");
    exports.resetErrorsCount = resetErrorsCount;
    function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
      if (errsCount === void 0)
        throw new Error("ajv implementation error");
      const err = gen.name("err");
      gen.forRange("i", errsCount, names_1.default.errors, (i) => {
        gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
        gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
        gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
        if (it.opts.verbose) {
          gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
          gen.assign((0, codegen_1._)`${err}.data`, data);
        }
      });
    }
    __name(extendErrors, "extendErrors");
    exports.extendErrors = extendErrors;
    function addError(gen, errObj) {
      const err = gen.const("err", errObj);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
      gen.code((0, codegen_1._)`${names_1.default.errors}++`);
    }
    __name(addError, "addError");
    function returnErrors(it, errs) {
      const { gen, validateName, schemaEnv } = it;
      if (schemaEnv.$async) {
        gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
        gen.return(false);
      }
    }
    __name(returnErrors, "returnErrors");
    var E = {
      keyword: new codegen_1.Name("keyword"),
      schemaPath: new codegen_1.Name("schemaPath"),
      // also used in JTD errors
      params: new codegen_1.Name("params"),
      propertyName: new codegen_1.Name("propertyName"),
      message: new codegen_1.Name("message"),
      schema: new codegen_1.Name("schema"),
      parentSchema: new codegen_1.Name("parentSchema")
    };
    function errorObjectCode(cxt, error2, errorPaths) {
      const { createErrors } = cxt.it;
      if (createErrors === false)
        return (0, codegen_1._)`{}`;
      return errorObject(cxt, error2, errorPaths);
    }
    __name(errorObjectCode, "errorObjectCode");
    function errorObject(cxt, error2, errorPaths = {}) {
      const { gen, it } = cxt;
      const keyValues = [
        errorInstancePath(it, errorPaths),
        errorSchemaPath(cxt, errorPaths)
      ];
      extraErrorProps(cxt, error2, keyValues);
      return gen.object(...keyValues);
    }
    __name(errorObject, "errorObject");
    function errorInstancePath({ errorPath }, { instancePath }) {
      const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
      return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
    }
    __name(errorInstancePath, "errorInstancePath");
    function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
      let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
      if (schemaPath) {
        schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
      }
      return [E.schemaPath, schPath];
    }
    __name(errorSchemaPath, "errorSchemaPath");
    function extraErrorProps(cxt, { params, message }, keyValues) {
      const { keyword, data, schemaValue, it } = cxt;
      const { opts, propertyName, topSchemaRef, schemaPath } = it;
      keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
      if (opts.messages) {
        keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
      }
      if (opts.verbose) {
        keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
      }
      if (propertyName)
        keyValues.push([E.propertyName, propertyName]);
    }
    __name(extraErrorProps, "extraErrorProps");
  }
});

// node_modules/ajv/dist/compile/validate/boolSchema.js
var require_boolSchema = __commonJS({
  "node_modules/ajv/dist/compile/validate/boolSchema.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var boolError = {
      message: "boolean schema is false"
    };
    function topBoolOrEmptySchema(it) {
      const { gen, schema, validateName } = it;
      if (schema === false) {
        falseSchemaError(it, false);
      } else if (typeof schema == "object" && schema.$async === true) {
        gen.return(names_1.default.data);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, null);
        gen.return(true);
      }
    }
    __name(topBoolOrEmptySchema, "topBoolOrEmptySchema");
    exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
    function boolOrEmptySchema(it, valid) {
      const { gen, schema } = it;
      if (schema === false) {
        gen.var(valid, false);
        falseSchemaError(it);
      } else {
        gen.var(valid, true);
      }
    }
    __name(boolOrEmptySchema, "boolOrEmptySchema");
    exports.boolOrEmptySchema = boolOrEmptySchema;
    function falseSchemaError(it, overrideAllErrors) {
      const { gen, data } = it;
      const cxt = {
        gen,
        keyword: "false schema",
        data,
        schema: false,
        schemaCode: false,
        schemaValue: false,
        params: {},
        it
      };
      (0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
    }
    __name(falseSchemaError, "falseSchemaError");
  }
});

// node_modules/ajv/dist/compile/rules.js
var require_rules = __commonJS({
  "node_modules/ajv/dist/compile/rules.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRules = exports.isJSONType = void 0;
    var _jsonTypes = ["string", "number", "integer", "boolean", "null", "object", "array"];
    var jsonTypes = new Set(_jsonTypes);
    function isJSONType(x) {
      return typeof x == "string" && jsonTypes.has(x);
    }
    __name(isJSONType, "isJSONType");
    exports.isJSONType = isJSONType;
    function getRules() {
      const groups = {
        number: { type: "number", rules: [] },
        string: { type: "string", rules: [] },
        array: { type: "array", rules: [] },
        object: { type: "object", rules: [] }
      };
      return {
        types: { ...groups, integer: true, boolean: true, null: true },
        rules: [{ rules: [] }, groups.number, groups.string, groups.array, groups.object],
        post: { rules: [] },
        all: {},
        keywords: {}
      };
    }
    __name(getRules, "getRules");
    exports.getRules = getRules;
  }
});

// node_modules/ajv/dist/compile/validate/applicability.js
var require_applicability = __commonJS({
  "node_modules/ajv/dist/compile/validate/applicability.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
    function schemaHasRulesForType({ schema, self }, type) {
      const group = self.RULES.types[type];
      return group && group !== true && shouldUseGroup(schema, group);
    }
    __name(schemaHasRulesForType, "schemaHasRulesForType");
    exports.schemaHasRulesForType = schemaHasRulesForType;
    function shouldUseGroup(schema, group) {
      return group.rules.some((rule) => shouldUseRule(schema, rule));
    }
    __name(shouldUseGroup, "shouldUseGroup");
    exports.shouldUseGroup = shouldUseGroup;
    function shouldUseRule(schema, rule) {
      var _a3;
      return schema[rule.keyword] !== void 0 || ((_a3 = rule.definition.implements) === null || _a3 === void 0 ? void 0 : _a3.some((kwd) => schema[kwd] !== void 0));
    }
    __name(shouldUseRule, "shouldUseRule");
    exports.shouldUseRule = shouldUseRule;
  }
});

// node_modules/ajv/dist/compile/validate/dataType.js
var require_dataType = __commonJS({
  "node_modules/ajv/dist/compile/validate/dataType.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
    var rules_1 = require_rules();
    var applicability_1 = require_applicability();
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var DataType;
    (function(DataType2) {
      DataType2[DataType2["Correct"] = 0] = "Correct";
      DataType2[DataType2["Wrong"] = 1] = "Wrong";
    })(DataType || (exports.DataType = DataType = {}));
    function getSchemaTypes(schema) {
      const types = getJSONTypes(schema.type);
      const hasNull = types.includes("null");
      if (hasNull) {
        if (schema.nullable === false)
          throw new Error("type: null contradicts nullable: false");
      } else {
        if (!types.length && schema.nullable !== void 0) {
          throw new Error('"nullable" cannot be used without "type"');
        }
        if (schema.nullable === true)
          types.push("null");
      }
      return types;
    }
    __name(getSchemaTypes, "getSchemaTypes");
    exports.getSchemaTypes = getSchemaTypes;
    function getJSONTypes(ts) {
      const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
      if (types.every(rules_1.isJSONType))
        return types;
      throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
    }
    __name(getJSONTypes, "getJSONTypes");
    exports.getJSONTypes = getJSONTypes;
    function coerceAndCheckDataType(it, types) {
      const { gen, data, opts } = it;
      const coerceTo = coerceToTypes(types, opts.coerceTypes);
      const checkTypes = types.length > 0 && !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
      if (checkTypes) {
        const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
        gen.if(wrongType, () => {
          if (coerceTo.length)
            coerceData(it, types, coerceTo);
          else
            reportTypeError(it);
        });
      }
      return checkTypes;
    }
    __name(coerceAndCheckDataType, "coerceAndCheckDataType");
    exports.coerceAndCheckDataType = coerceAndCheckDataType;
    var COERCIBLE = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
    function coerceToTypes(types, coerceTypes) {
      return coerceTypes ? types.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
    }
    __name(coerceToTypes, "coerceToTypes");
    function coerceData(it, types, coerceTo) {
      const { gen, data, opts } = it;
      const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
      const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
      if (opts.coerceTypes === "array") {
        gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
      }
      gen.if((0, codegen_1._)`${coerced} !== undefined`);
      for (const t of coerceTo) {
        if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") {
          coerceSpecificType(t);
        }
      }
      gen.else();
      reportTypeError(it);
      gen.endIf();
      gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
        gen.assign(data, coerced);
        assignParentData(it, coerced);
      });
      function coerceSpecificType(t) {
        switch (t) {
          case "string":
            gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
            return;
          case "number":
            gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "integer":
            gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "boolean":
            gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
            return;
          case "null":
            gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
            gen.assign(coerced, null);
            return;
          case "array":
            gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
        }
      }
      __name(coerceSpecificType, "coerceSpecificType");
    }
    __name(coerceData, "coerceData");
    function assignParentData({ gen, parentData, parentDataProperty }, expr) {
      gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
    }
    __name(assignParentData, "assignParentData");
    function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
      const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
      let cond;
      switch (dataType) {
        case "null":
          return (0, codegen_1._)`${data} ${EQ} null`;
        case "array":
          cond = (0, codegen_1._)`Array.isArray(${data})`;
          break;
        case "object":
          cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
          break;
        case "integer":
          cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
          break;
        case "number":
          cond = numCond();
          break;
        default:
          return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
      }
      return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
      function numCond(_cond = codegen_1.nil) {
        return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
      }
      __name(numCond, "numCond");
    }
    __name(checkDataType, "checkDataType");
    exports.checkDataType = checkDataType;
    function checkDataTypes(dataTypes, data, strictNums, correct) {
      if (dataTypes.length === 1) {
        return checkDataType(dataTypes[0], data, strictNums, correct);
      }
      let cond;
      const types = (0, util_1.toHash)(dataTypes);
      if (types.array && types.object) {
        const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
        cond = types.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
        delete types.null;
        delete types.array;
        delete types.object;
      } else {
        cond = codegen_1.nil;
      }
      if (types.number)
        delete types.integer;
      for (const t in types)
        cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
      return cond;
    }
    __name(checkDataTypes, "checkDataTypes");
    exports.checkDataTypes = checkDataTypes;
    var typeError = {
      message: /* @__PURE__ */ __name(({ schema }) => `must be ${schema}`, "message"),
      params: /* @__PURE__ */ __name(({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._)`{type: ${schema}}` : (0, codegen_1._)`{type: ${schemaValue}}`, "params")
    };
    function reportTypeError(it) {
      const cxt = getTypeErrorContext(it);
      (0, errors_1.reportError)(cxt, typeError);
    }
    __name(reportTypeError, "reportTypeError");
    exports.reportTypeError = reportTypeError;
    function getTypeErrorContext(it) {
      const { gen, data, schema } = it;
      const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
      return {
        gen,
        keyword: "type",
        data,
        schema: schema.type,
        schemaCode,
        schemaValue: schemaCode,
        parentSchema: schema,
        params: {},
        it
      };
    }
    __name(getTypeErrorContext, "getTypeErrorContext");
  }
});

// node_modules/ajv/dist/compile/validate/defaults.js
var require_defaults = __commonJS({
  "node_modules/ajv/dist/compile/validate/defaults.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assignDefaults = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function assignDefaults(it, ty) {
      const { properties, items } = it.schema;
      if (ty === "object" && properties) {
        for (const key in properties) {
          assignDefault(it, key, properties[key].default);
        }
      } else if (ty === "array" && Array.isArray(items)) {
        items.forEach((sch, i) => assignDefault(it, i, sch.default));
      }
    }
    __name(assignDefaults, "assignDefaults");
    exports.assignDefaults = assignDefaults;
    function assignDefault(it, prop, defaultValue) {
      const { gen, compositeRule, data, opts } = it;
      if (defaultValue === void 0)
        return;
      const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
      if (compositeRule) {
        (0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
        return;
      }
      let condition = (0, codegen_1._)`${childData} === undefined`;
      if (opts.useDefaults === "empty") {
        condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
      }
      gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
    }
    __name(assignDefault, "assignDefault");
  }
});

// node_modules/ajv/dist/vocabularies/code.js
var require_code2 = __commonJS({
  "node_modules/ajv/dist/vocabularies/code.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    var util_2 = require_util();
    function checkReportMissingProp(cxt, prop) {
      const { gen, data, it } = cxt;
      gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
        cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true);
        cxt.error();
      });
    }
    __name(checkReportMissingProp, "checkReportMissingProp");
    exports.checkReportMissingProp = checkReportMissingProp;
    function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
      return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
    }
    __name(checkMissingProp, "checkMissingProp");
    exports.checkMissingProp = checkMissingProp;
    function reportMissingProp(cxt, missing) {
      cxt.setParams({ missingProperty: missing }, true);
      cxt.error();
    }
    __name(reportMissingProp, "reportMissingProp");
    exports.reportMissingProp = reportMissingProp;
    function hasPropFunc(gen) {
      return gen.scopeValue("func", {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        ref: Object.prototype.hasOwnProperty,
        code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
      });
    }
    __name(hasPropFunc, "hasPropFunc");
    exports.hasPropFunc = hasPropFunc;
    function isOwnProperty(gen, data, property) {
      return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
    }
    __name(isOwnProperty, "isOwnProperty");
    exports.isOwnProperty = isOwnProperty;
    function propertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
      return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
    }
    __name(propertyInData, "propertyInData");
    exports.propertyInData = propertyInData;
    function noPropertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
      return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
    }
    __name(noPropertyInData, "noPropertyInData");
    exports.noPropertyInData = noPropertyInData;
    function allSchemaProperties(schemaMap) {
      return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
    }
    __name(allSchemaProperties, "allSchemaProperties");
    exports.allSchemaProperties = allSchemaProperties;
    function schemaProperties(it, schemaMap) {
      return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
    }
    __name(schemaProperties, "schemaProperties");
    exports.schemaProperties = schemaProperties;
    function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
      const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
      const valCxt = [
        [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
        [names_1.default.parentData, it.parentData],
        [names_1.default.parentDataProperty, it.parentDataProperty],
        [names_1.default.rootData, names_1.default.rootData]
      ];
      if (it.opts.dynamicRef)
        valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
      const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
      return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
    }
    __name(callValidateCode, "callValidateCode");
    exports.callValidateCode = callValidateCode;
    var newRegExp = (0, codegen_1._)`new RegExp`;
    function usePattern({ gen, it: { opts } }, pattern) {
      const u = opts.unicodeRegExp ? "u" : "";
      const { regExp } = opts.code;
      const rx = regExp(pattern, u);
      return gen.scopeValue("pattern", {
        key: rx.toString(),
        ref: rx,
        code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`
      });
    }
    __name(usePattern, "usePattern");
    exports.usePattern = usePattern;
    function validateArray(cxt) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      if (it.allErrors) {
        const validArr = gen.let("valid", true);
        validateItems(() => gen.assign(validArr, false));
        return validArr;
      }
      gen.var(valid, true);
      validateItems(() => gen.break());
      return valid;
      function validateItems(notValid) {
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        gen.forRange("i", 0, len, (i) => {
          cxt.subschema({
            keyword,
            dataProp: i,
            dataPropType: util_1.Type.Num
          }, valid);
          gen.if((0, codegen_1.not)(valid), notValid);
        });
      }
      __name(validateItems, "validateItems");
    }
    __name(validateArray, "validateArray");
    exports.validateArray = validateArray;
    function validateUnion(cxt) {
      const { gen, schema, keyword, it } = cxt;
      if (!Array.isArray(schema))
        throw new Error("ajv implementation error");
      const alwaysValid = schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch));
      if (alwaysValid && !it.opts.unevaluated)
        return;
      const valid = gen.let("valid", false);
      const schValid = gen.name("_valid");
      gen.block(() => schema.forEach((_sch, i) => {
        const schCxt = cxt.subschema({
          keyword,
          schemaProp: i,
          compositeRule: true
        }, schValid);
        gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
        const merged = cxt.mergeValidEvaluated(schCxt, schValid);
        if (!merged)
          gen.if((0, codegen_1.not)(valid));
      }));
      cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
    }
    __name(validateUnion, "validateUnion");
    exports.validateUnion = validateUnion;
  }
});

// node_modules/ajv/dist/compile/validate/keyword.js
var require_keyword = __commonJS({
  "node_modules/ajv/dist/compile/validate/keyword.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var code_1 = require_code2();
    var errors_1 = require_errors();
    function macroKeywordCode(cxt, def) {
      const { gen, keyword, schema, parentSchema, it } = cxt;
      const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
      const schemaRef = useKeyword(gen, keyword, macroSchema);
      if (it.opts.validateSchema !== false)
        it.self.validateSchema(macroSchema, true);
      const valid = gen.name("valid");
      cxt.subschema({
        schema: macroSchema,
        schemaPath: codegen_1.nil,
        errSchemaPath: `${it.errSchemaPath}/${keyword}`,
        topSchemaRef: schemaRef,
        compositeRule: true
      }, valid);
      cxt.pass(valid, () => cxt.error(true));
    }
    __name(macroKeywordCode, "macroKeywordCode");
    exports.macroKeywordCode = macroKeywordCode;
    function funcKeywordCode(cxt, def) {
      var _a3;
      const { gen, keyword, schema, parentSchema, $data, it } = cxt;
      checkAsyncKeyword(it, def);
      const validate = !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate;
      const validateRef = useKeyword(gen, keyword, validate);
      const valid = gen.let("valid");
      cxt.block$data(valid, validateKeyword);
      cxt.ok((_a3 = def.valid) !== null && _a3 !== void 0 ? _a3 : valid);
      function validateKeyword() {
        if (def.errors === false) {
          assignValid();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => cxt.error());
        } else {
          const ruleErrs = def.async ? validateAsync() : validateSync();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => addErrs(cxt, ruleErrs));
        }
      }
      __name(validateKeyword, "validateKeyword");
      function validateAsync() {
        const ruleErrs = gen.let("ruleErrs", null);
        gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
        return ruleErrs;
      }
      __name(validateAsync, "validateAsync");
      function validateSync() {
        const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
        gen.assign(validateErrs, null);
        assignValid(codegen_1.nil);
        return validateErrs;
      }
      __name(validateSync, "validateSync");
      function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
        const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
        const passSchema = !("compile" in def && !$data || def.schema === false);
        gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
      }
      __name(assignValid, "assignValid");
      function reportErrs(errors) {
        var _a4;
        gen.if((0, codegen_1.not)((_a4 = def.valid) !== null && _a4 !== void 0 ? _a4 : valid), errors);
      }
      __name(reportErrs, "reportErrs");
    }
    __name(funcKeywordCode, "funcKeywordCode");
    exports.funcKeywordCode = funcKeywordCode;
    function modifyData(cxt) {
      const { gen, data, it } = cxt;
      gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
    }
    __name(modifyData, "modifyData");
    function addErrs(cxt, errs) {
      const { gen } = cxt;
      gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
        (0, errors_1.extendErrors)(cxt);
      }, () => cxt.error());
    }
    __name(addErrs, "addErrs");
    function checkAsyncKeyword({ schemaEnv }, def) {
      if (def.async && !schemaEnv.$async)
        throw new Error("async keyword in sync schema");
    }
    __name(checkAsyncKeyword, "checkAsyncKeyword");
    function useKeyword(gen, keyword, result) {
      if (result === void 0)
        throw new Error(`keyword "${keyword}" failed to compile`);
      return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : { ref: result, code: (0, codegen_1.stringify)(result) });
    }
    __name(useKeyword, "useKeyword");
    function validSchemaType(schema, schemaType, allowUndefined = false) {
      return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema) : st === "object" ? schema && typeof schema == "object" && !Array.isArray(schema) : typeof schema == st || allowUndefined && typeof schema == "undefined");
    }
    __name(validSchemaType, "validSchemaType");
    exports.validSchemaType = validSchemaType;
    function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
      if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) {
        throw new Error("ajv implementation error");
      }
      const deps = def.dependencies;
      if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) {
        throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
      }
      if (def.validateSchema) {
        const valid = def.validateSchema(schema[keyword]);
        if (!valid) {
          const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self.errorsText(def.validateSchema.errors);
          if (opts.validateSchema === "log")
            self.logger.error(msg);
          else
            throw new Error(msg);
        }
      }
    }
    __name(validateKeywordUsage, "validateKeywordUsage");
    exports.validateKeywordUsage = validateKeywordUsage;
  }
});

// node_modules/ajv/dist/compile/validate/subschema.js
var require_subschema = __commonJS({
  "node_modules/ajv/dist/compile/validate/subschema.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
      if (keyword !== void 0 && schema !== void 0) {
        throw new Error('both "keyword" and "schema" passed, only one allowed');
      }
      if (keyword !== void 0) {
        const sch = it.schema[keyword];
        return schemaProp === void 0 ? {
          schema: sch,
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}`
        } : {
          schema: sch[schemaProp],
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
        };
      }
      if (schema !== void 0) {
        if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) {
          throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
        }
        return {
          schema,
          schemaPath,
          topSchemaRef,
          errSchemaPath
        };
      }
      throw new Error('either "keyword" or "schema" must be passed');
    }
    __name(getSubschema, "getSubschema");
    exports.getSubschema = getSubschema;
    function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
      if (data !== void 0 && dataProp !== void 0) {
        throw new Error('both "data" and "dataProp" passed, only one allowed');
      }
      const { gen } = it;
      if (dataProp !== void 0) {
        const { errorPath, dataPathArr, opts } = it;
        const nextData = gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true);
        dataContextProps(nextData);
        subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
        subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
        subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
      }
      if (data !== void 0) {
        const nextData = data instanceof codegen_1.Name ? data : gen.let("data", data, true);
        dataContextProps(nextData);
        if (propertyName !== void 0)
          subschema.propertyName = propertyName;
      }
      if (dataTypes)
        subschema.dataTypes = dataTypes;
      function dataContextProps(_nextData) {
        subschema.data = _nextData;
        subschema.dataLevel = it.dataLevel + 1;
        subschema.dataTypes = [];
        it.definedProperties = /* @__PURE__ */ new Set();
        subschema.parentData = it.data;
        subschema.dataNames = [...it.dataNames, _nextData];
      }
      __name(dataContextProps, "dataContextProps");
    }
    __name(extendSubschemaData, "extendSubschemaData");
    exports.extendSubschemaData = extendSubschemaData;
    function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
      if (compositeRule !== void 0)
        subschema.compositeRule = compositeRule;
      if (createErrors !== void 0)
        subschema.createErrors = createErrors;
      if (allErrors !== void 0)
        subschema.allErrors = allErrors;
      subschema.jtdDiscriminator = jtdDiscriminator;
      subschema.jtdMetadata = jtdMetadata;
    }
    __name(extendSubschemaMode, "extendSubschemaMode");
    exports.extendSubschemaMode = extendSubschemaMode;
  }
});

// node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  "node_modules/fast-deep-equal/index.js"(exports, module) {
    "use strict";
    init_modules_watch_stub();
    module.exports = /* @__PURE__ */ __name(function equal(a, b) {
      if (a === b) return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor) return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0; )
            if (!equal(a[i], b[i])) return false;
          return true;
        }
        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;
        for (i = length; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        for (i = length; i-- !== 0; ) {
          var key = keys[i];
          if (!equal(a[key], b[key])) return false;
        }
        return true;
      }
      return a !== a && b !== b;
    }, "equal");
  }
});

// node_modules/json-schema-traverse/index.js
var require_json_schema_traverse = __commonJS({
  "node_modules/json-schema-traverse/index.js"(exports, module) {
    "use strict";
    init_modules_watch_stub();
    var traverse = module.exports = function(schema, opts, cb) {
      if (typeof opts == "function") {
        cb = opts;
        opts = {};
      }
      cb = opts.cb || cb;
      var pre = typeof cb == "function" ? cb : cb.pre || function() {
      };
      var post = cb.post || function() {
      };
      _traverse(opts, pre, post, schema, "", schema);
    };
    traverse.keywords = {
      additionalItems: true,
      items: true,
      contains: true,
      additionalProperties: true,
      propertyNames: true,
      not: true,
      if: true,
      then: true,
      else: true
    };
    traverse.arrayKeywords = {
      items: true,
      allOf: true,
      anyOf: true,
      oneOf: true
    };
    traverse.propsKeywords = {
      $defs: true,
      definitions: true,
      properties: true,
      patternProperties: true,
      dependencies: true
    };
    traverse.skipKeywords = {
      default: true,
      enum: true,
      const: true,
      required: true,
      maximum: true,
      minimum: true,
      exclusiveMaximum: true,
      exclusiveMinimum: true,
      multipleOf: true,
      maxLength: true,
      minLength: true,
      pattern: true,
      format: true,
      maxItems: true,
      minItems: true,
      uniqueItems: true,
      maxProperties: true,
      minProperties: true
    };
    function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
      if (schema && typeof schema == "object" && !Array.isArray(schema)) {
        pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
        for (var key in schema) {
          var sch = schema[key];
          if (Array.isArray(sch)) {
            if (key in traverse.arrayKeywords) {
              for (var i = 0; i < sch.length; i++)
                _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema, i);
            }
          } else if (key in traverse.propsKeywords) {
            if (sch && typeof sch == "object") {
              for (var prop in sch)
                _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
            }
          } else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) {
            _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema);
          }
        }
        post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
      }
    }
    __name(_traverse, "_traverse");
    function escapeJsonPtr(str) {
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
    __name(escapeJsonPtr, "escapeJsonPtr");
  }
});

// node_modules/ajv/dist/compile/resolve.js
var require_resolve = __commonJS({
  "node_modules/ajv/dist/compile/resolve.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
    var util_1 = require_util();
    var equal = require_fast_deep_equal();
    var traverse = require_json_schema_traverse();
    var SIMPLE_INLINED = /* @__PURE__ */ new Set([
      "type",
      "format",
      "pattern",
      "maxLength",
      "minLength",
      "maxProperties",
      "minProperties",
      "maxItems",
      "minItems",
      "maximum",
      "minimum",
      "uniqueItems",
      "multipleOf",
      "required",
      "enum",
      "const"
    ]);
    function inlineRef(schema, limit = true) {
      if (typeof schema == "boolean")
        return true;
      if (limit === true)
        return !hasRef(schema);
      if (!limit)
        return false;
      return countKeys(schema) <= limit;
    }
    __name(inlineRef, "inlineRef");
    exports.inlineRef = inlineRef;
    var REF_KEYWORDS = /* @__PURE__ */ new Set([
      "$ref",
      "$recursiveRef",
      "$recursiveAnchor",
      "$dynamicRef",
      "$dynamicAnchor"
    ]);
    function hasRef(schema) {
      for (const key in schema) {
        if (REF_KEYWORDS.has(key))
          return true;
        const sch = schema[key];
        if (Array.isArray(sch) && sch.some(hasRef))
          return true;
        if (typeof sch == "object" && hasRef(sch))
          return true;
      }
      return false;
    }
    __name(hasRef, "hasRef");
    function countKeys(schema) {
      let count = 0;
      for (const key in schema) {
        if (key === "$ref")
          return Infinity;
        count++;
        if (SIMPLE_INLINED.has(key))
          continue;
        if (typeof schema[key] == "object") {
          (0, util_1.eachItem)(schema[key], (sch) => count += countKeys(sch));
        }
        if (count === Infinity)
          return Infinity;
      }
      return count;
    }
    __name(countKeys, "countKeys");
    function getFullPath(resolver, id = "", normalize) {
      if (normalize !== false)
        id = normalizeId(id);
      const p = resolver.parse(id);
      return _getFullPath(resolver, p);
    }
    __name(getFullPath, "getFullPath");
    exports.getFullPath = getFullPath;
    function _getFullPath(resolver, p) {
      const serialized = resolver.serialize(p);
      return serialized.split("#")[0] + "#";
    }
    __name(_getFullPath, "_getFullPath");
    exports._getFullPath = _getFullPath;
    var TRAILING_SLASH_HASH = /#\/?$/;
    function normalizeId(id) {
      return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
    }
    __name(normalizeId, "normalizeId");
    exports.normalizeId = normalizeId;
    function resolveUrl(resolver, baseId, id) {
      id = normalizeId(id);
      return resolver.resolve(baseId, id);
    }
    __name(resolveUrl, "resolveUrl");
    exports.resolveUrl = resolveUrl;
    var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
    function getSchemaRefs(schema, baseId) {
      if (typeof schema == "boolean")
        return {};
      const { schemaId, uriResolver } = this.opts;
      const schId = normalizeId(schema[schemaId] || baseId);
      const baseIds = { "": schId };
      const pathPrefix = getFullPath(uriResolver, schId, false);
      const localRefs = {};
      const schemaRefs = /* @__PURE__ */ new Set();
      traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
        if (parentJsonPtr === void 0)
          return;
        const fullPath = pathPrefix + jsonPtr;
        let innerBaseId = baseIds[parentJsonPtr];
        if (typeof sch[schemaId] == "string")
          innerBaseId = addRef.call(this, sch[schemaId]);
        addAnchor.call(this, sch.$anchor);
        addAnchor.call(this, sch.$dynamicAnchor);
        baseIds[jsonPtr] = innerBaseId;
        function addRef(ref) {
          const _resolve = this.opts.uriResolver.resolve;
          ref = normalizeId(innerBaseId ? _resolve(innerBaseId, ref) : ref);
          if (schemaRefs.has(ref))
            throw ambiguos(ref);
          schemaRefs.add(ref);
          let schOrRef = this.refs[ref];
          if (typeof schOrRef == "string")
            schOrRef = this.refs[schOrRef];
          if (typeof schOrRef == "object") {
            checkAmbiguosRef(sch, schOrRef.schema, ref);
          } else if (ref !== normalizeId(fullPath)) {
            if (ref[0] === "#") {
              checkAmbiguosRef(sch, localRefs[ref], ref);
              localRefs[ref] = sch;
            } else {
              this.refs[ref] = fullPath;
            }
          }
          return ref;
        }
        __name(addRef, "addRef");
        function addAnchor(anchor) {
          if (typeof anchor == "string") {
            if (!ANCHOR.test(anchor))
              throw new Error(`invalid anchor "${anchor}"`);
            addRef.call(this, `#${anchor}`);
          }
        }
        __name(addAnchor, "addAnchor");
      });
      return localRefs;
      function checkAmbiguosRef(sch1, sch2, ref) {
        if (sch2 !== void 0 && !equal(sch1, sch2))
          throw ambiguos(ref);
      }
      __name(checkAmbiguosRef, "checkAmbiguosRef");
      function ambiguos(ref) {
        return new Error(`reference "${ref}" resolves to more than one schema`);
      }
      __name(ambiguos, "ambiguos");
    }
    __name(getSchemaRefs, "getSchemaRefs");
    exports.getSchemaRefs = getSchemaRefs;
  }
});

// node_modules/ajv/dist/compile/validate/index.js
var require_validate = __commonJS({
  "node_modules/ajv/dist/compile/validate/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
    var boolSchema_1 = require_boolSchema();
    var dataType_1 = require_dataType();
    var applicability_1 = require_applicability();
    var dataType_2 = require_dataType();
    var defaults_1 = require_defaults();
    var keyword_1 = require_keyword();
    var subschema_1 = require_subschema();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var errors_1 = require_errors();
    function validateFunctionCode(it) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          topSchemaObjCode(it);
          return;
        }
      }
      validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
    }
    __name(validateFunctionCode, "validateFunctionCode");
    exports.validateFunctionCode = validateFunctionCode;
    function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
      if (opts.code.es5) {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
          gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`);
          destructureValCxtES5(gen, opts);
          gen.code(body);
        });
      } else {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
      }
    }
    __name(validateFunction, "validateFunction");
    function destructureValCxt(opts) {
      return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
    }
    __name(destructureValCxt, "destructureValCxt");
    function destructureValCxtES5(gen, opts) {
      gen.if(names_1.default.valCxt, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
        gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
      }, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.rootData, names_1.default.data);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
      });
    }
    __name(destructureValCxtES5, "destructureValCxtES5");
    function topSchemaObjCode(it) {
      const { schema, opts, gen } = it;
      validateFunction(it, () => {
        if (opts.$comment && schema.$comment)
          commentKeyword(it);
        checkNoDefault(it);
        gen.let(names_1.default.vErrors, null);
        gen.let(names_1.default.errors, 0);
        if (opts.unevaluated)
          resetEvaluated(it);
        typeAndKeywords(it);
        returnResults(it);
      });
      return;
    }
    __name(topSchemaObjCode, "topSchemaObjCode");
    function resetEvaluated(it) {
      const { gen, validateName } = it;
      it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
    }
    __name(resetEvaluated, "resetEvaluated");
    function funcSourceUrl(schema, opts) {
      const schId = typeof schema == "object" && schema[opts.schemaId];
      return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
    }
    __name(funcSourceUrl, "funcSourceUrl");
    function subschemaCode(it, valid) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          subSchemaObjCode(it, valid);
          return;
        }
      }
      (0, boolSchema_1.boolOrEmptySchema)(it, valid);
    }
    __name(subschemaCode, "subschemaCode");
    function schemaCxtHasRules({ schema, self }) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (self.RULES.all[key])
          return true;
      return false;
    }
    __name(schemaCxtHasRules, "schemaCxtHasRules");
    function isSchemaObj(it) {
      return typeof it.schema != "boolean";
    }
    __name(isSchemaObj, "isSchemaObj");
    function subSchemaObjCode(it, valid) {
      const { schema, gen, opts } = it;
      if (opts.$comment && schema.$comment)
        commentKeyword(it);
      updateContext(it);
      checkAsyncSchema(it);
      const errsCount = gen.const("_errs", names_1.default.errors);
      typeAndKeywords(it, errsCount);
      gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
    }
    __name(subSchemaObjCode, "subSchemaObjCode");
    function checkKeywords(it) {
      (0, util_1.checkUnknownRules)(it);
      checkRefsAndKeywords(it);
    }
    __name(checkKeywords, "checkKeywords");
    function typeAndKeywords(it, errsCount) {
      if (it.opts.jtd)
        return schemaKeywords(it, [], false, errsCount);
      const types = (0, dataType_1.getSchemaTypes)(it.schema);
      const checkedTypes = (0, dataType_1.coerceAndCheckDataType)(it, types);
      schemaKeywords(it, types, !checkedTypes, errsCount);
    }
    __name(typeAndKeywords, "typeAndKeywords");
    function checkRefsAndKeywords(it) {
      const { schema, errSchemaPath, opts, self } = it;
      if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self.RULES)) {
        self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
      }
    }
    __name(checkRefsAndKeywords, "checkRefsAndKeywords");
    function checkNoDefault(it) {
      const { schema, opts } = it;
      if (schema.default !== void 0 && opts.useDefaults && opts.strictSchema) {
        (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
      }
    }
    __name(checkNoDefault, "checkNoDefault");
    function updateContext(it) {
      const schId = it.schema[it.opts.schemaId];
      if (schId)
        it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
    }
    __name(updateContext, "updateContext");
    function checkAsyncSchema(it) {
      if (it.schema.$async && !it.schemaEnv.$async)
        throw new Error("async schema in sync schema");
    }
    __name(checkAsyncSchema, "checkAsyncSchema");
    function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
      const msg = schema.$comment;
      if (opts.$comment === true) {
        gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
      } else if (typeof opts.$comment == "function") {
        const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
        const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
        gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
      }
    }
    __name(commentKeyword, "commentKeyword");
    function returnResults(it) {
      const { gen, schemaEnv, validateName, ValidationError, opts } = it;
      if (schemaEnv.$async) {
        gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
        if (opts.unevaluated)
          assignEvaluated(it);
        gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
      }
    }
    __name(returnResults, "returnResults");
    function assignEvaluated({ gen, evaluated, props, items }) {
      if (props instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.props`, props);
      if (items instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.items`, items);
    }
    __name(assignEvaluated, "assignEvaluated");
    function schemaKeywords(it, types, typeErrors, errsCount) {
      const { gen, schema, data, allErrors, opts, self } = it;
      const { RULES } = self;
      if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
        gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
        return;
      }
      if (!opts.jtd)
        checkStrictTypes(it, types);
      gen.block(() => {
        for (const group of RULES.rules)
          groupKeywords(group);
        groupKeywords(RULES.post);
      });
      function groupKeywords(group) {
        if (!(0, applicability_1.shouldUseGroup)(schema, group))
          return;
        if (group.type) {
          gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
          iterateKeywords(it, group);
          if (types.length === 1 && types[0] === group.type && typeErrors) {
            gen.else();
            (0, dataType_2.reportTypeError)(it);
          }
          gen.endIf();
        } else {
          iterateKeywords(it, group);
        }
        if (!allErrors)
          gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
      }
      __name(groupKeywords, "groupKeywords");
    }
    __name(schemaKeywords, "schemaKeywords");
    function iterateKeywords(it, group) {
      const { gen, schema, opts: { useDefaults } } = it;
      if (useDefaults)
        (0, defaults_1.assignDefaults)(it, group.type);
      gen.block(() => {
        for (const rule of group.rules) {
          if ((0, applicability_1.shouldUseRule)(schema, rule)) {
            keywordCode(it, rule.keyword, rule.definition, group.type);
          }
        }
      });
    }
    __name(iterateKeywords, "iterateKeywords");
    function checkStrictTypes(it, types) {
      if (it.schemaEnv.meta || !it.opts.strictTypes)
        return;
      checkContextTypes(it, types);
      if (!it.opts.allowUnionTypes)
        checkMultipleTypes(it, types);
      checkKeywordTypes(it, it.dataTypes);
    }
    __name(checkStrictTypes, "checkStrictTypes");
    function checkContextTypes(it, types) {
      if (!types.length)
        return;
      if (!it.dataTypes.length) {
        it.dataTypes = types;
        return;
      }
      types.forEach((t) => {
        if (!includesType(it.dataTypes, t)) {
          strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
        }
      });
      narrowSchemaTypes(it, types);
    }
    __name(checkContextTypes, "checkContextTypes");
    function checkMultipleTypes(it, ts) {
      if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) {
        strictTypesError(it, "use allowUnionTypes to allow union type keyword");
      }
    }
    __name(checkMultipleTypes, "checkMultipleTypes");
    function checkKeywordTypes(it, ts) {
      const rules = it.self.RULES.all;
      for (const keyword in rules) {
        const rule = rules[keyword];
        if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
          const { type } = rule.definition;
          if (type.length && !type.some((t) => hasApplicableType(ts, t))) {
            strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
          }
        }
      }
    }
    __name(checkKeywordTypes, "checkKeywordTypes");
    function hasApplicableType(schTs, kwdT) {
      return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
    }
    __name(hasApplicableType, "hasApplicableType");
    function includesType(ts, t) {
      return ts.includes(t) || t === "integer" && ts.includes("number");
    }
    __name(includesType, "includesType");
    function narrowSchemaTypes(it, withTypes) {
      const ts = [];
      for (const t of it.dataTypes) {
        if (includesType(withTypes, t))
          ts.push(t);
        else if (withTypes.includes("integer") && t === "number")
          ts.push("integer");
      }
      it.dataTypes = ts;
    }
    __name(narrowSchemaTypes, "narrowSchemaTypes");
    function strictTypesError(it, msg) {
      const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
      msg += ` at "${schemaPath}" (strictTypes)`;
      (0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
    }
    __name(strictTypesError, "strictTypesError");
    var KeywordCxt = class {
      static {
        __name(this, "KeywordCxt");
      }
      constructor(it, def, keyword) {
        (0, keyword_1.validateKeywordUsage)(it, def, keyword);
        this.gen = it.gen;
        this.allErrors = it.allErrors;
        this.keyword = keyword;
        this.data = it.data;
        this.schema = it.schema[keyword];
        this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
        this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
        this.schemaType = def.schemaType;
        this.parentSchema = it.schema;
        this.params = {};
        this.it = it;
        this.def = def;
        if (this.$data) {
          this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
        } else {
          this.schemaCode = this.schemaValue;
          if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) {
            throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
          }
        }
        if ("code" in def ? def.trackErrors : def.errors !== false) {
          this.errsCount = it.gen.const("_errs", names_1.default.errors);
        }
      }
      result(condition, successAction, failAction) {
        this.failResult((0, codegen_1.not)(condition), successAction, failAction);
      }
      failResult(condition, successAction, failAction) {
        this.gen.if(condition);
        if (failAction)
          failAction();
        else
          this.error();
        if (successAction) {
          this.gen.else();
          successAction();
          if (this.allErrors)
            this.gen.endIf();
        } else {
          if (this.allErrors)
            this.gen.endIf();
          else
            this.gen.else();
        }
      }
      pass(condition, failAction) {
        this.failResult((0, codegen_1.not)(condition), void 0, failAction);
      }
      fail(condition) {
        if (condition === void 0) {
          this.error();
          if (!this.allErrors)
            this.gen.if(false);
          return;
        }
        this.gen.if(condition);
        this.error();
        if (this.allErrors)
          this.gen.endIf();
        else
          this.gen.else();
      }
      fail$data(condition) {
        if (!this.$data)
          return this.fail(condition);
        const { schemaCode } = this;
        this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
      }
      error(append, errorParams, errorPaths) {
        if (errorParams) {
          this.setParams(errorParams);
          this._error(append, errorPaths);
          this.setParams({});
          return;
        }
        this._error(append, errorPaths);
      }
      _error(append, errorPaths) {
        ;
        (append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
      }
      $dataError() {
        (0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
      }
      reset() {
        if (this.errsCount === void 0)
          throw new Error('add "trackErrors" to keyword definition');
        (0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
      }
      ok(cond) {
        if (!this.allErrors)
          this.gen.if(cond);
      }
      setParams(obj, assign) {
        if (assign)
          Object.assign(this.params, obj);
        else
          this.params = obj;
      }
      block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
        this.gen.block(() => {
          this.check$data(valid, $dataValid);
          codeBlock();
        });
      }
      check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
        if (!this.$data)
          return;
        const { gen, schemaCode, schemaType, def } = this;
        gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
        if (valid !== codegen_1.nil)
          gen.assign(valid, true);
        if (schemaType.length || def.validateSchema) {
          gen.elseIf(this.invalid$data());
          this.$dataError();
          if (valid !== codegen_1.nil)
            gen.assign(valid, false);
        }
        gen.else();
      }
      invalid$data() {
        const { gen, schemaCode, schemaType, def, it } = this;
        return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
        function wrong$DataType() {
          if (schemaType.length) {
            if (!(schemaCode instanceof codegen_1.Name))
              throw new Error("ajv implementation error");
            const st = Array.isArray(schemaType) ? schemaType : [schemaType];
            return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
          }
          return codegen_1.nil;
        }
        __name(wrong$DataType, "wrong$DataType");
        function invalid$DataSchema() {
          if (def.validateSchema) {
            const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
            return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
          }
          return codegen_1.nil;
        }
        __name(invalid$DataSchema, "invalid$DataSchema");
      }
      subschema(appl, valid) {
        const subschema = (0, subschema_1.getSubschema)(this.it, appl);
        (0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
        (0, subschema_1.extendSubschemaMode)(subschema, appl);
        const nextContext = { ...this.it, ...subschema, items: void 0, props: void 0 };
        subschemaCode(nextContext, valid);
        return nextContext;
      }
      mergeEvaluated(schemaCxt, toName) {
        const { it, gen } = this;
        if (!it.opts.unevaluated)
          return;
        if (it.props !== true && schemaCxt.props !== void 0) {
          it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
        }
        if (it.items !== true && schemaCxt.items !== void 0) {
          it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
        }
      }
      mergeValidEvaluated(schemaCxt, valid) {
        const { it, gen } = this;
        if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
          gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
          return true;
        }
      }
    };
    exports.KeywordCxt = KeywordCxt;
    function keywordCode(it, keyword, def, ruleType) {
      const cxt = new KeywordCxt(it, def, keyword);
      if ("code" in def) {
        def.code(cxt, ruleType);
      } else if (cxt.$data && def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      } else if ("macro" in def) {
        (0, keyword_1.macroKeywordCode)(cxt, def);
      } else if (def.compile || def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      }
    }
    __name(keywordCode, "keywordCode");
    var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
    var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
    function getData($data, { dataLevel, dataNames, dataPathArr }) {
      let jsonPointer;
      let data;
      if ($data === "")
        return names_1.default.rootData;
      if ($data[0] === "/") {
        if (!JSON_POINTER.test($data))
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        jsonPointer = $data;
        data = names_1.default.rootData;
      } else {
        const matches = RELATIVE_JSON_POINTER.exec($data);
        if (!matches)
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        const up = +matches[1];
        jsonPointer = matches[2];
        if (jsonPointer === "#") {
          if (up >= dataLevel)
            throw new Error(errorMsg("property/index", up));
          return dataPathArr[dataLevel - up];
        }
        if (up > dataLevel)
          throw new Error(errorMsg("data", up));
        data = dataNames[dataLevel - up];
        if (!jsonPointer)
          return data;
      }
      let expr = data;
      const segments = jsonPointer.split("/");
      for (const segment of segments) {
        if (segment) {
          data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
          expr = (0, codegen_1._)`${expr} && ${data}`;
        }
      }
      return expr;
      function errorMsg(pointerType, up) {
        return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
      }
      __name(errorMsg, "errorMsg");
    }
    __name(getData, "getData");
    exports.getData = getData;
  }
});

// node_modules/ajv/dist/runtime/validation_error.js
var require_validation_error = __commonJS({
  "node_modules/ajv/dist/runtime/validation_error.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValidationError = class extends Error {
      static {
        __name(this, "ValidationError");
      }
      constructor(errors) {
        super("validation failed");
        this.errors = errors;
        this.ajv = this.validation = true;
      }
    };
    exports.default = ValidationError;
  }
});

// node_modules/ajv/dist/compile/ref_error.js
var require_ref_error = __commonJS({
  "node_modules/ajv/dist/compile/ref_error.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var resolve_1 = require_resolve();
    var MissingRefError = class extends Error {
      static {
        __name(this, "MissingRefError");
      }
      constructor(resolver, baseId, ref, msg) {
        super(msg || `can't resolve reference ${ref} from id ${baseId}`);
        this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
        this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
      }
    };
    exports.default = MissingRefError;
  }
});

// node_modules/ajv/dist/compile/index.js
var require_compile = __commonJS({
  "node_modules/ajv/dist/compile/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
    var codegen_1 = require_codegen();
    var validation_error_1 = require_validation_error();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var validate_1 = require_validate();
    var SchemaEnv = class {
      static {
        __name(this, "SchemaEnv");
      }
      constructor(env) {
        var _a3;
        this.refs = {};
        this.dynamicAnchors = {};
        let schema;
        if (typeof env.schema == "object")
          schema = env.schema;
        this.schema = env.schema;
        this.schemaId = env.schemaId;
        this.root = env.root || this;
        this.baseId = (_a3 = env.baseId) !== null && _a3 !== void 0 ? _a3 : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
        this.schemaPath = env.schemaPath;
        this.localRefs = env.localRefs;
        this.meta = env.meta;
        this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
        this.refs = {};
      }
    };
    exports.SchemaEnv = SchemaEnv;
    function compileSchema(sch) {
      const _sch = getCompilingSchema.call(this, sch);
      if (_sch)
        return _sch;
      const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
      const { es5, lines } = this.opts.code;
      const { ownProperties } = this.opts;
      const gen = new codegen_1.CodeGen(this.scope, { es5, lines, ownProperties });
      let _ValidationError;
      if (sch.$async) {
        _ValidationError = gen.scopeValue("Error", {
          ref: validation_error_1.default,
          code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
        });
      }
      const validateName = gen.scopeName("validate");
      sch.validateName = validateName;
      const schemaCxt = {
        gen,
        allErrors: this.opts.allErrors,
        data: names_1.default.data,
        parentData: names_1.default.parentData,
        parentDataProperty: names_1.default.parentDataProperty,
        dataNames: [names_1.default.data],
        dataPathArr: [codegen_1.nil],
        // TODO can its length be used as dataLevel if nil is removed?
        dataLevel: 0,
        dataTypes: [],
        definedProperties: /* @__PURE__ */ new Set(),
        topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? { ref: sch.schema, code: (0, codegen_1.stringify)(sch.schema) } : { ref: sch.schema }),
        validateName,
        ValidationError: _ValidationError,
        schema: sch.schema,
        schemaEnv: sch,
        rootId,
        baseId: sch.baseId || rootId,
        schemaPath: codegen_1.nil,
        errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
        errorPath: (0, codegen_1._)`""`,
        opts: this.opts,
        self: this
      };
      let sourceCode;
      try {
        this._compilations.add(sch);
        (0, validate_1.validateFunctionCode)(schemaCxt);
        gen.optimize(this.opts.code.optimize);
        const validateCode = gen.toString();
        sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
        if (this.opts.code.process)
          sourceCode = this.opts.code.process(sourceCode, sch);
        const makeValidate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode);
        const validate = makeValidate(this, this.scope.get());
        this.scope.value(validateName, { ref: validate });
        validate.errors = null;
        validate.schema = sch.schema;
        validate.schemaEnv = sch;
        if (sch.$async)
          validate.$async = true;
        if (this.opts.code.source === true) {
          validate.source = { validateName, validateCode, scopeValues: gen._values };
        }
        if (this.opts.unevaluated) {
          const { props, items } = schemaCxt;
          validate.evaluated = {
            props: props instanceof codegen_1.Name ? void 0 : props,
            items: items instanceof codegen_1.Name ? void 0 : items,
            dynamicProps: props instanceof codegen_1.Name,
            dynamicItems: items instanceof codegen_1.Name
          };
          if (validate.source)
            validate.source.evaluated = (0, codegen_1.stringify)(validate.evaluated);
        }
        sch.validate = validate;
        return sch;
      } catch (e) {
        delete sch.validate;
        delete sch.validateName;
        if (sourceCode)
          this.logger.error("Error compiling schema, function code:", sourceCode);
        throw e;
      } finally {
        this._compilations.delete(sch);
      }
    }
    __name(compileSchema, "compileSchema");
    exports.compileSchema = compileSchema;
    function resolveRef(root, baseId, ref) {
      var _a3;
      ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
      const schOrFunc = root.refs[ref];
      if (schOrFunc)
        return schOrFunc;
      let _sch = resolve.call(this, root, ref);
      if (_sch === void 0) {
        const schema = (_a3 = root.localRefs) === null || _a3 === void 0 ? void 0 : _a3[ref];
        const { schemaId } = this.opts;
        if (schema)
          _sch = new SchemaEnv({ schema, schemaId, root, baseId });
      }
      if (_sch === void 0)
        return;
      return root.refs[ref] = inlineOrCompile.call(this, _sch);
    }
    __name(resolveRef, "resolveRef");
    exports.resolveRef = resolveRef;
    function inlineOrCompile(sch) {
      if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs))
        return sch.schema;
      return sch.validate ? sch : compileSchema.call(this, sch);
    }
    __name(inlineOrCompile, "inlineOrCompile");
    function getCompilingSchema(schEnv) {
      for (const sch of this._compilations) {
        if (sameSchemaEnv(sch, schEnv))
          return sch;
      }
    }
    __name(getCompilingSchema, "getCompilingSchema");
    exports.getCompilingSchema = getCompilingSchema;
    function sameSchemaEnv(s1, s2) {
      return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
    }
    __name(sameSchemaEnv, "sameSchemaEnv");
    function resolve(root, ref) {
      let sch;
      while (typeof (sch = this.refs[ref]) == "string")
        ref = sch;
      return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
    }
    __name(resolve, "resolve");
    function resolveSchema(root, ref) {
      const p = this.opts.uriResolver.parse(ref);
      const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
      let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, void 0);
      if (Object.keys(root.schema).length > 0 && refPath === baseId) {
        return getJsonPointer.call(this, p, root);
      }
      const id = (0, resolve_1.normalizeId)(refPath);
      const schOrRef = this.refs[id] || this.schemas[id];
      if (typeof schOrRef == "string") {
        const sch = resolveSchema.call(this, root, schOrRef);
        if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object")
          return;
        return getJsonPointer.call(this, p, sch);
      }
      if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object")
        return;
      if (!schOrRef.validate)
        compileSchema.call(this, schOrRef);
      if (id === (0, resolve_1.normalizeId)(ref)) {
        const { schema } = schOrRef;
        const { schemaId } = this.opts;
        const schId = schema[schemaId];
        if (schId)
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        return new SchemaEnv({ schema, schemaId, root, baseId });
      }
      return getJsonPointer.call(this, p, schOrRef);
    }
    __name(resolveSchema, "resolveSchema");
    exports.resolveSchema = resolveSchema;
    var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
      "properties",
      "patternProperties",
      "enum",
      "dependencies",
      "definitions"
    ]);
    function getJsonPointer(parsedRef, { baseId, schema, root }) {
      var _a3;
      if (((_a3 = parsedRef.fragment) === null || _a3 === void 0 ? void 0 : _a3[0]) !== "/")
        return;
      for (const part of parsedRef.fragment.slice(1).split("/")) {
        if (typeof schema === "boolean")
          return;
        const partSchema = schema[(0, util_1.unescapeFragment)(part)];
        if (partSchema === void 0)
          return;
        schema = partSchema;
        const schId = typeof schema === "object" && schema[this.opts.schemaId];
        if (!PREVENT_SCOPE_CHANGE.has(part) && schId) {
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        }
      }
      let env;
      if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
        const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
        env = resolveSchema.call(this, root, $ref);
      }
      const { schemaId } = this.opts;
      env = env || new SchemaEnv({ schema, schemaId, root, baseId });
      if (env.schema !== env.root.schema)
        return env;
      return void 0;
    }
    __name(getJsonPointer, "getJsonPointer");
  }
});

// node_modules/ajv/dist/refs/data.json
var require_data = __commonJS({
  "node_modules/ajv/dist/refs/data.json"(exports, module) {
    module.exports = {
      $id: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
      description: "Meta-schema for $data reference (JSON AnySchema extension proposal)",
      type: "object",
      required: ["$data"],
      properties: {
        $data: {
          type: "string",
          anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }]
        }
      },
      additionalProperties: false
    };
  }
});

// node_modules/fast-uri/lib/utils.js
var require_utils = __commonJS({
  "node_modules/fast-uri/lib/utils.js"(exports, module) {
    "use strict";
    init_modules_watch_stub();
    var isUUID = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu);
    var isIPv4 = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
    var isHexPair = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu);
    var isUnreserved = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu);
    var isPathCharacter = RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);
    function stringArrayToHexStripped(input) {
      let acc = "";
      let code = 0;
      let i = 0;
      for (i = 0; i < input.length; i++) {
        code = input[i].charCodeAt(0);
        if (code === 48) {
          continue;
        }
        if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
          return "";
        }
        acc += input[i];
        break;
      }
      for (i += 1; i < input.length; i++) {
        code = input[i].charCodeAt(0);
        if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
          return "";
        }
        acc += input[i];
      }
      return acc;
    }
    __name(stringArrayToHexStripped, "stringArrayToHexStripped");
    var nonSimpleDomain = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
    function consumeIsZone(buffer) {
      buffer.length = 0;
      return true;
    }
    __name(consumeIsZone, "consumeIsZone");
    function consumeHextets(buffer, address, output) {
      if (buffer.length) {
        const hex = stringArrayToHexStripped(buffer);
        if (hex !== "") {
          address.push(hex);
        } else {
          output.error = true;
          return false;
        }
        buffer.length = 0;
      }
      return true;
    }
    __name(consumeHextets, "consumeHextets");
    function getIPV6(input) {
      let tokenCount = 0;
      const output = { error: false, address: "", zone: "" };
      const address = [];
      const buffer = [];
      let endipv6Encountered = false;
      let endIpv6 = false;
      let consume = consumeHextets;
      for (let i = 0; i < input.length; i++) {
        const cursor = input[i];
        if (cursor === "[" || cursor === "]") {
          continue;
        }
        if (cursor === ":") {
          if (endipv6Encountered === true) {
            endIpv6 = true;
          }
          if (!consume(buffer, address, output)) {
            break;
          }
          if (++tokenCount > 7) {
            output.error = true;
            break;
          }
          if (i > 0 && input[i - 1] === ":") {
            endipv6Encountered = true;
          }
          address.push(":");
          continue;
        } else if (cursor === "%") {
          if (!consume(buffer, address, output)) {
            break;
          }
          consume = consumeIsZone;
        } else {
          buffer.push(cursor);
          continue;
        }
      }
      if (buffer.length) {
        if (consume === consumeIsZone) {
          output.zone = buffer.join("");
        } else if (endIpv6) {
          address.push(buffer.join(""));
        } else {
          address.push(stringArrayToHexStripped(buffer));
        }
      }
      output.address = address.join("");
      return output;
    }
    __name(getIPV6, "getIPV6");
    function normalizeIPv6(host) {
      if (findToken(host, ":") < 2) {
        return { host, isIPV6: false };
      }
      const ipv62 = getIPV6(host);
      if (!ipv62.error) {
        let newHost = ipv62.address;
        let escapedHost = ipv62.address;
        if (ipv62.zone) {
          newHost += "%" + ipv62.zone;
          escapedHost += "%25" + ipv62.zone;
        }
        return { host: newHost, isIPV6: true, escapedHost };
      } else {
        return { host, isIPV6: false };
      }
    }
    __name(normalizeIPv6, "normalizeIPv6");
    function findToken(str, token) {
      let ind = 0;
      for (let i = 0; i < str.length; i++) {
        if (str[i] === token) ind++;
      }
      return ind;
    }
    __name(findToken, "findToken");
    function removeDotSegments(path) {
      let input = path;
      const output = [];
      let nextSlash = -1;
      let len = 0;
      while (len = input.length) {
        if (len === 1) {
          if (input === ".") {
            break;
          } else if (input === "/") {
            output.push("/");
            break;
          } else {
            output.push(input);
            break;
          }
        } else if (len === 2) {
          if (input[0] === ".") {
            if (input[1] === ".") {
              break;
            } else if (input[1] === "/") {
              input = input.slice(2);
              continue;
            }
          } else if (input[0] === "/") {
            if (input[1] === "." || input[1] === "/") {
              output.push("/");
              break;
            }
          }
        } else if (len === 3) {
          if (input === "/..") {
            if (output.length !== 0) {
              output.pop();
            }
            output.push("/");
            break;
          }
        }
        if (input[0] === ".") {
          if (input[1] === ".") {
            if (input[2] === "/") {
              input = input.slice(3);
              continue;
            }
          } else if (input[1] === "/") {
            input = input.slice(2);
            continue;
          }
        } else if (input[0] === "/") {
          if (input[1] === ".") {
            if (input[2] === "/") {
              input = input.slice(2);
              continue;
            } else if (input[2] === ".") {
              if (input[3] === "/") {
                input = input.slice(3);
                if (output.length !== 0) {
                  output.pop();
                }
                continue;
              }
            }
          }
        }
        if ((nextSlash = input.indexOf("/", 1)) === -1) {
          output.push(input);
          break;
        } else {
          output.push(input.slice(0, nextSlash));
          input = input.slice(nextSlash);
        }
      }
      return output.join("");
    }
    __name(removeDotSegments, "removeDotSegments");
    var HOST_DELIMS = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" };
    var HOST_DELIM_RE = /[@/?#:]/g;
    var HOST_DELIM_NO_COLON_RE = /[@/?#]/g;
    function reescapeHostDelimiters(host, isIP) {
      const re = isIP ? HOST_DELIM_NO_COLON_RE : HOST_DELIM_RE;
      re.lastIndex = 0;
      return host.replace(re, (ch) => HOST_DELIMS[ch]);
    }
    __name(reescapeHostDelimiters, "reescapeHostDelimiters");
    function normalizePercentEncoding(input, decodeUnreserved = false) {
      if (input.indexOf("%") === -1) {
        return input;
      }
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (decodeUnreserved && isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        output += input[i];
      }
      return output;
    }
    __name(normalizePercentEncoding, "normalizePercentEncoding");
    function normalizePathEncoding(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (decoded !== "." && isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        if (isPathCharacter(input[i])) {
          output += input[i];
        } else {
          output += escape(input[i]);
        }
      }
      return output;
    }
    __name(normalizePathEncoding, "normalizePathEncoding");
    function escapePreservingEscapes(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        output += escape(input[i]);
      }
      return output;
    }
    __name(escapePreservingEscapes, "escapePreservingEscapes");
    function recomposeAuthority(component) {
      const uriTokens = [];
      if (component.userinfo !== void 0) {
        uriTokens.push(component.userinfo);
        uriTokens.push("@");
      }
      if (component.host !== void 0) {
        let host = unescape(component.host);
        if (!isIPv4(host)) {
          const ipV6res = normalizeIPv6(host);
          if (ipV6res.isIPV6 === true) {
            host = `[${ipV6res.escapedHost}]`;
          } else {
            host = reescapeHostDelimiters(host, false);
          }
        }
        uriTokens.push(host);
      }
      if (typeof component.port === "number" || typeof component.port === "string") {
        uriTokens.push(":");
        uriTokens.push(String(component.port));
      }
      return uriTokens.length ? uriTokens.join("") : void 0;
    }
    __name(recomposeAuthority, "recomposeAuthority");
    module.exports = {
      nonSimpleDomain,
      recomposeAuthority,
      reescapeHostDelimiters,
      normalizePercentEncoding,
      normalizePathEncoding,
      escapePreservingEscapes,
      removeDotSegments,
      isIPv4,
      isUUID,
      normalizeIPv6,
      stringArrayToHexStripped
    };
  }
});

// node_modules/fast-uri/lib/schemes.js
var require_schemes = __commonJS({
  "node_modules/fast-uri/lib/schemes.js"(exports, module) {
    "use strict";
    init_modules_watch_stub();
    var { isUUID } = require_utils();
    var URN_REG = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
    var supportedSchemeNames = (
      /** @type {const} */
      [
        "http",
        "https",
        "ws",
        "wss",
        "urn",
        "urn:uuid"
      ]
    );
    function isValidSchemeName(name) {
      return supportedSchemeNames.indexOf(
        /** @type {*} */
        name
      ) !== -1;
    }
    __name(isValidSchemeName, "isValidSchemeName");
    function wsIsSecure(wsComponent) {
      if (wsComponent.secure === true) {
        return true;
      } else if (wsComponent.secure === false) {
        return false;
      } else if (wsComponent.scheme) {
        return wsComponent.scheme.length === 3 && (wsComponent.scheme[0] === "w" || wsComponent.scheme[0] === "W") && (wsComponent.scheme[1] === "s" || wsComponent.scheme[1] === "S") && (wsComponent.scheme[2] === "s" || wsComponent.scheme[2] === "S");
      } else {
        return false;
      }
    }
    __name(wsIsSecure, "wsIsSecure");
    function httpParse(component) {
      if (!component.host) {
        component.error = component.error || "HTTP URIs must have a host.";
      }
      return component;
    }
    __name(httpParse, "httpParse");
    function httpSerialize(component) {
      const secure = String(component.scheme).toLowerCase() === "https";
      if (component.port === (secure ? 443 : 80) || component.port === "") {
        component.port = void 0;
      }
      if (!component.path) {
        component.path = "/";
      }
      return component;
    }
    __name(httpSerialize, "httpSerialize");
    function wsParse(wsComponent) {
      wsComponent.secure = wsIsSecure(wsComponent);
      wsComponent.resourceName = (wsComponent.path || "/") + (wsComponent.query ? "?" + wsComponent.query : "");
      wsComponent.path = void 0;
      wsComponent.query = void 0;
      return wsComponent;
    }
    __name(wsParse, "wsParse");
    function wsSerialize(wsComponent) {
      if (wsComponent.port === (wsIsSecure(wsComponent) ? 443 : 80) || wsComponent.port === "") {
        wsComponent.port = void 0;
      }
      if (typeof wsComponent.secure === "boolean") {
        wsComponent.scheme = wsComponent.secure ? "wss" : "ws";
        wsComponent.secure = void 0;
      }
      if (wsComponent.resourceName) {
        const [path, query] = wsComponent.resourceName.split("?");
        wsComponent.path = path && path !== "/" ? path : void 0;
        wsComponent.query = query;
        wsComponent.resourceName = void 0;
      }
      wsComponent.fragment = void 0;
      return wsComponent;
    }
    __name(wsSerialize, "wsSerialize");
    function urnParse(urnComponent, options) {
      if (!urnComponent.path) {
        urnComponent.error = "URN can not be parsed";
        return urnComponent;
      }
      const matches = urnComponent.path.match(URN_REG);
      if (matches) {
        const scheme = options.scheme || urnComponent.scheme || "urn";
        urnComponent.nid = matches[1].toLowerCase();
        urnComponent.nss = matches[2];
        const urnScheme = `${scheme}:${options.nid || urnComponent.nid}`;
        const schemeHandler = getSchemeHandler(urnScheme);
        urnComponent.path = void 0;
        if (schemeHandler) {
          urnComponent = schemeHandler.parse(urnComponent, options);
        }
      } else {
        urnComponent.error = urnComponent.error || "URN can not be parsed.";
      }
      return urnComponent;
    }
    __name(urnParse, "urnParse");
    function urnSerialize(urnComponent, options) {
      if (urnComponent.nid === void 0) {
        throw new Error("URN without nid cannot be serialized");
      }
      const scheme = options.scheme || urnComponent.scheme || "urn";
      const nid = urnComponent.nid.toLowerCase();
      const urnScheme = `${scheme}:${options.nid || nid}`;
      const schemeHandler = getSchemeHandler(urnScheme);
      if (schemeHandler) {
        urnComponent = schemeHandler.serialize(urnComponent, options);
      }
      const uriComponent = urnComponent;
      const nss = urnComponent.nss;
      uriComponent.path = `${nid || options.nid}:${nss}`;
      options.skipEscape = true;
      return uriComponent;
    }
    __name(urnSerialize, "urnSerialize");
    function urnuuidParse(urnComponent, options) {
      const uuidComponent = urnComponent;
      uuidComponent.uuid = uuidComponent.nss;
      uuidComponent.nss = void 0;
      if (!options.tolerant && (!uuidComponent.uuid || !isUUID(uuidComponent.uuid))) {
        uuidComponent.error = uuidComponent.error || "UUID is not valid.";
      }
      return uuidComponent;
    }
    __name(urnuuidParse, "urnuuidParse");
    function urnuuidSerialize(uuidComponent) {
      const urnComponent = uuidComponent;
      urnComponent.nss = (uuidComponent.uuid || "").toLowerCase();
      return urnComponent;
    }
    __name(urnuuidSerialize, "urnuuidSerialize");
    var http = (
      /** @type {SchemeHandler} */
      {
        scheme: "http",
        domainHost: true,
        parse: httpParse,
        serialize: httpSerialize
      }
    );
    var https = (
      /** @type {SchemeHandler} */
      {
        scheme: "https",
        domainHost: http.domainHost,
        parse: httpParse,
        serialize: httpSerialize
      }
    );
    var ws = (
      /** @type {SchemeHandler} */
      {
        scheme: "ws",
        domainHost: true,
        parse: wsParse,
        serialize: wsSerialize
      }
    );
    var wss = (
      /** @type {SchemeHandler} */
      {
        scheme: "wss",
        domainHost: ws.domainHost,
        parse: ws.parse,
        serialize: ws.serialize
      }
    );
    var urn = (
      /** @type {SchemeHandler} */
      {
        scheme: "urn",
        parse: urnParse,
        serialize: urnSerialize,
        skipNormalize: true
      }
    );
    var urnuuid = (
      /** @type {SchemeHandler} */
      {
        scheme: "urn:uuid",
        parse: urnuuidParse,
        serialize: urnuuidSerialize,
        skipNormalize: true
      }
    );
    var SCHEMES = (
      /** @type {Record<SchemeName, SchemeHandler>} */
      {
        http,
        https,
        ws,
        wss,
        urn,
        "urn:uuid": urnuuid
      }
    );
    Object.setPrototypeOf(SCHEMES, null);
    function getSchemeHandler(scheme) {
      return scheme && (SCHEMES[
        /** @type {SchemeName} */
        scheme
      ] || SCHEMES[
        /** @type {SchemeName} */
        scheme.toLowerCase()
      ]) || void 0;
    }
    __name(getSchemeHandler, "getSchemeHandler");
    module.exports = {
      wsIsSecure,
      SCHEMES,
      isValidSchemeName,
      getSchemeHandler
    };
  }
});

// node_modules/fast-uri/index.js
var require_fast_uri = __commonJS({
  "node_modules/fast-uri/index.js"(exports, module) {
    "use strict";
    init_modules_watch_stub();
    var { normalizeIPv6, removeDotSegments, recomposeAuthority, normalizePercentEncoding, normalizePathEncoding, escapePreservingEscapes, reescapeHostDelimiters, isIPv4, nonSimpleDomain } = require_utils();
    var { SCHEMES, getSchemeHandler } = require_schemes();
    function normalize(uri, options) {
      if (typeof uri === "string") {
        uri = /** @type {T} */
        normalizeString(uri, options);
      } else if (typeof uri === "object") {
        uri = /** @type {T} */
        parse3(serialize(uri, options), options);
      }
      return uri;
    }
    __name(normalize, "normalize");
    function resolve(baseURI, relativeURI, options) {
      const schemelessOptions = options ? Object.assign({ scheme: "null" }, options) : { scheme: "null" };
      const resolved = resolveComponent(parse3(baseURI, schemelessOptions), parse3(relativeURI, schemelessOptions), schemelessOptions, true);
      schemelessOptions.skipEscape = true;
      return serialize(resolved, schemelessOptions);
    }
    __name(resolve, "resolve");
    function resolveComponent(base, relative, options, skipNormalization) {
      const target = {};
      if (!skipNormalization) {
        base = parse3(serialize(base, options), options);
        relative = parse3(serialize(relative, options), options);
      }
      options = options || {};
      if (!options.tolerant && relative.scheme) {
        target.scheme = relative.scheme;
        target.userinfo = relative.userinfo;
        target.host = relative.host;
        target.port = relative.port;
        target.path = removeDotSegments(relative.path || "");
        target.query = relative.query;
      } else {
        if (relative.userinfo !== void 0 || relative.host !== void 0 || relative.port !== void 0) {
          target.userinfo = relative.userinfo;
          target.host = relative.host;
          target.port = relative.port;
          target.path = removeDotSegments(relative.path || "");
          target.query = relative.query;
        } else {
          if (!relative.path) {
            target.path = base.path;
            if (relative.query !== void 0) {
              target.query = relative.query;
            } else {
              target.query = base.query;
            }
          } else {
            if (relative.path[0] === "/") {
              target.path = removeDotSegments(relative.path);
            } else {
              if ((base.userinfo !== void 0 || base.host !== void 0 || base.port !== void 0) && !base.path) {
                target.path = "/" + relative.path;
              } else if (!base.path) {
                target.path = relative.path;
              } else {
                target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
              }
              target.path = removeDotSegments(target.path);
            }
            target.query = relative.query;
          }
          target.userinfo = base.userinfo;
          target.host = base.host;
          target.port = base.port;
        }
        target.scheme = base.scheme;
      }
      target.fragment = relative.fragment;
      return target;
    }
    __name(resolveComponent, "resolveComponent");
    function equal(uriA, uriB, options) {
      const normalizedA = normalizeComparableURI(uriA, options);
      const normalizedB = normalizeComparableURI(uriB, options);
      return normalizedA !== void 0 && normalizedB !== void 0 && normalizedA.toLowerCase() === normalizedB.toLowerCase();
    }
    __name(equal, "equal");
    function serialize(cmpts, opts) {
      const component = {
        host: cmpts.host,
        scheme: cmpts.scheme,
        userinfo: cmpts.userinfo,
        port: cmpts.port,
        path: cmpts.path,
        query: cmpts.query,
        nid: cmpts.nid,
        nss: cmpts.nss,
        uuid: cmpts.uuid,
        fragment: cmpts.fragment,
        reference: cmpts.reference,
        resourceName: cmpts.resourceName,
        secure: cmpts.secure,
        error: ""
      };
      const options = Object.assign({}, opts);
      const uriTokens = [];
      const schemeHandler = getSchemeHandler(options.scheme || component.scheme);
      if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(component, options);
      if (component.path !== void 0) {
        if (!options.skipEscape) {
          component.path = escapePreservingEscapes(component.path);
          if (component.scheme !== void 0) {
            component.path = component.path.split("%3A").join(":");
          }
        } else {
          component.path = normalizePercentEncoding(component.path);
        }
      }
      if (options.reference !== "suffix" && component.scheme) {
        uriTokens.push(component.scheme, ":");
      }
      const authority = recomposeAuthority(component);
      if (authority !== void 0) {
        if (options.reference !== "suffix") {
          uriTokens.push("//");
        }
        uriTokens.push(authority);
        if (component.path && component.path[0] !== "/") {
          uriTokens.push("/");
        }
      }
      if (component.path !== void 0) {
        let s = component.path;
        if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) {
          s = removeDotSegments(s);
        }
        if (authority === void 0 && s[0] === "/" && s[1] === "/") {
          s = "/%2F" + s.slice(2);
        }
        uriTokens.push(s);
      }
      if (component.query !== void 0) {
        uriTokens.push("?", component.query);
      }
      if (component.fragment !== void 0) {
        uriTokens.push("#", component.fragment);
      }
      return uriTokens.join("");
    }
    __name(serialize, "serialize");
    var URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
    function getParseError(parsed, matches) {
      if (matches[2] !== void 0 && parsed.path && parsed.path[0] !== "/") {
        return 'URI path must start with "/" when authority is present.';
      }
      if (typeof parsed.port === "number" && (parsed.port < 0 || parsed.port > 65535)) {
        return "URI port is malformed.";
      }
      return void 0;
    }
    __name(getParseError, "getParseError");
    function parseWithStatus(uri, opts) {
      const options = Object.assign({}, opts);
      const parsed = {
        scheme: void 0,
        userinfo: void 0,
        host: "",
        port: void 0,
        path: "",
        query: void 0,
        fragment: void 0
      };
      let malformedAuthorityOrPort = false;
      let isIP = false;
      if (options.reference === "suffix") {
        if (options.scheme) {
          uri = options.scheme + ":" + uri;
        } else {
          uri = "//" + uri;
        }
      }
      const matches = uri.match(URI_PARSE);
      if (matches) {
        parsed.scheme = matches[1];
        parsed.userinfo = matches[3];
        parsed.host = matches[4];
        parsed.port = parseInt(matches[5], 10);
        parsed.path = matches[6] || "";
        parsed.query = matches[7];
        parsed.fragment = matches[8];
        if (isNaN(parsed.port)) {
          parsed.port = matches[5];
        }
        const parseError = getParseError(parsed, matches);
        if (parseError !== void 0) {
          parsed.error = parsed.error || parseError;
          malformedAuthorityOrPort = true;
        }
        if (parsed.host) {
          const ipv4result = isIPv4(parsed.host);
          if (ipv4result === false) {
            const ipv6result = normalizeIPv6(parsed.host);
            parsed.host = ipv6result.host.toLowerCase();
            isIP = ipv6result.isIPV6;
          } else {
            isIP = true;
          }
        }
        if (parsed.scheme === void 0 && parsed.userinfo === void 0 && parsed.host === void 0 && parsed.port === void 0 && parsed.query === void 0 && !parsed.path) {
          parsed.reference = "same-document";
        } else if (parsed.scheme === void 0) {
          parsed.reference = "relative";
        } else if (parsed.fragment === void 0) {
          parsed.reference = "absolute";
        } else {
          parsed.reference = "uri";
        }
        if (options.reference && options.reference !== "suffix" && options.reference !== parsed.reference) {
          parsed.error = parsed.error || "URI is not a " + options.reference + " reference.";
        }
        const schemeHandler = getSchemeHandler(options.scheme || parsed.scheme);
        if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport)) {
          if (parsed.host && (options.domainHost || schemeHandler && schemeHandler.domainHost) && isIP === false && nonSimpleDomain(parsed.host)) {
            try {
              parsed.host = URL.domainToASCII(parsed.host.toLowerCase());
            } catch (e) {
              parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
            }
          }
        }
        if (!schemeHandler || schemeHandler && !schemeHandler.skipNormalize) {
          if (uri.indexOf("%") !== -1) {
            if (parsed.scheme !== void 0) {
              parsed.scheme = unescape(parsed.scheme);
            }
            if (parsed.host !== void 0) {
              parsed.host = reescapeHostDelimiters(unescape(parsed.host), isIP);
            }
          }
          if (parsed.path) {
            parsed.path = normalizePathEncoding(parsed.path);
          }
          if (parsed.fragment) {
            try {
              parsed.fragment = encodeURI(decodeURIComponent(parsed.fragment));
            } catch {
              parsed.error = parsed.error || "URI malformed";
            }
          }
        }
        if (schemeHandler && schemeHandler.parse) {
          schemeHandler.parse(parsed, options);
        }
      } else {
        parsed.error = parsed.error || "URI can not be parsed.";
      }
      return { parsed, malformedAuthorityOrPort };
    }
    __name(parseWithStatus, "parseWithStatus");
    function parse3(uri, opts) {
      return parseWithStatus(uri, opts).parsed;
    }
    __name(parse3, "parse");
    function normalizeString(uri, opts) {
      return normalizeStringWithStatus(uri, opts).normalized;
    }
    __name(normalizeString, "normalizeString");
    function normalizeStringWithStatus(uri, opts) {
      const { parsed, malformedAuthorityOrPort } = parseWithStatus(uri, opts);
      return {
        normalized: malformedAuthorityOrPort ? uri : serialize(parsed, opts),
        malformedAuthorityOrPort
      };
    }
    __name(normalizeStringWithStatus, "normalizeStringWithStatus");
    function normalizeComparableURI(uri, opts) {
      if (typeof uri === "string") {
        const { normalized, malformedAuthorityOrPort } = normalizeStringWithStatus(uri, opts);
        return malformedAuthorityOrPort ? void 0 : normalized;
      }
      if (typeof uri === "object") {
        return serialize(uri, opts);
      }
    }
    __name(normalizeComparableURI, "normalizeComparableURI");
    var fastUri = {
      SCHEMES,
      normalize,
      resolve,
      resolveComponent,
      equal,
      serialize,
      parse: parse3
    };
    module.exports = fastUri;
    module.exports.default = fastUri;
    module.exports.fastUri = fastUri;
  }
});

// node_modules/ajv/dist/runtime/uri.js
var require_uri = __commonJS({
  "node_modules/ajv/dist/runtime/uri.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var uri = require_fast_uri();
    uri.code = 'require("ajv/dist/runtime/uri").default';
    exports.default = uri;
  }
});

// node_modules/ajv/dist/core.js
var require_core = __commonJS({
  "node_modules/ajv/dist/core.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return validate_1.KeywordCxt;
    }, "get") });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return codegen_1._;
    }, "get") });
    Object.defineProperty(exports, "str", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return codegen_1.str;
    }, "get") });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return codegen_1.stringify;
    }, "get") });
    Object.defineProperty(exports, "nil", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return codegen_1.nil;
    }, "get") });
    Object.defineProperty(exports, "Name", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return codegen_1.Name;
    }, "get") });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return codegen_1.CodeGen;
    }, "get") });
    var validation_error_1 = require_validation_error();
    var ref_error_1 = require_ref_error();
    var rules_1 = require_rules();
    var compile_1 = require_compile();
    var codegen_2 = require_codegen();
    var resolve_1 = require_resolve();
    var dataType_1 = require_dataType();
    var util_1 = require_util();
    var $dataRefSchema = require_data();
    var uri_1 = require_uri();
    var defaultRegExp = /* @__PURE__ */ __name((str, flags) => new RegExp(str, flags), "defaultRegExp");
    defaultRegExp.code = "new RegExp";
    var META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
    var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]);
    var removedOptions = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    };
    var deprecatedOptions = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    };
    var MAX_EXPRESSION = 200;
    function requiredOptions(o) {
      var _a3, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
      const s = o.strict;
      const _optz = (_a3 = o.code) === null || _a3 === void 0 ? void 0 : _a3.optimize;
      const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
      const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
      const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
      return {
        strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
        strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
        strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
        strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
        strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
        code: o.code ? { ...o.code, optimize, regExp } : { optimize, regExp },
        loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
        loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
        meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
        messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
        inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
        schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
        addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
        validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
        validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
        unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
        int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
        uriResolver
      };
    }
    __name(requiredOptions, "requiredOptions");
    var Ajv2 = class {
      static {
        __name(this, "Ajv");
      }
      constructor(opts = {}) {
        this.schemas = {};
        this.refs = {};
        this.formats = /* @__PURE__ */ Object.create(null);
        this._compilations = /* @__PURE__ */ new Set();
        this._loading = {};
        this._cache = /* @__PURE__ */ new Map();
        opts = this.opts = { ...opts, ...requiredOptions(opts) };
        const { es5, lines } = this.opts.code;
        this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines });
        this.logger = getLogger(opts.logger);
        const formatOpt = opts.validateFormats;
        opts.validateFormats = false;
        this.RULES = (0, rules_1.getRules)();
        checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
        checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
        this._metaOpts = getMetaSchemaOptions.call(this);
        if (opts.formats)
          addInitialFormats.call(this);
        this._addVocabularies();
        this._addDefaultMetaSchema();
        if (opts.keywords)
          addInitialKeywords.call(this, opts.keywords);
        if (typeof opts.meta == "object")
          this.addMetaSchema(opts.meta);
        addInitialSchemas.call(this);
        opts.validateFormats = formatOpt;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data, meta: meta2, schemaId } = this.opts;
        let _dataRefSchema = $dataRefSchema;
        if (schemaId === "id") {
          _dataRefSchema = { ...$dataRefSchema };
          _dataRefSchema.id = _dataRefSchema.$id;
          delete _dataRefSchema.$id;
        }
        if (meta2 && $data)
          this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
      }
      defaultMeta() {
        const { meta: meta2, schemaId } = this.opts;
        return this.opts.defaultMeta = typeof meta2 == "object" ? meta2[schemaId] || meta2 : void 0;
      }
      validate(schemaKeyRef, data) {
        let v;
        if (typeof schemaKeyRef == "string") {
          v = this.getSchema(schemaKeyRef);
          if (!v)
            throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
        } else {
          v = this.compile(schemaKeyRef);
        }
        const valid = v(data);
        if (!("$async" in v))
          this.errors = v.errors;
        return valid;
      }
      compile(schema, _meta) {
        const sch = this._addSchema(schema, _meta);
        return sch.validate || this._compileSchemaEnv(sch);
      }
      compileAsync(schema, meta2) {
        if (typeof this.opts.loadSchema != "function") {
          throw new Error("options.loadSchema should be a function");
        }
        const { loadSchema } = this.opts;
        return runCompileAsync.call(this, schema, meta2);
        async function runCompileAsync(_schema, _meta) {
          await loadMetaSchema.call(this, _schema.$schema);
          const sch = this._addSchema(_schema, _meta);
          return sch.validate || _compileAsync.call(this, sch);
        }
        __name(runCompileAsync, "runCompileAsync");
        async function loadMetaSchema($ref) {
          if ($ref && !this.getSchema($ref)) {
            await runCompileAsync.call(this, { $ref }, true);
          }
        }
        __name(loadMetaSchema, "loadMetaSchema");
        async function _compileAsync(sch) {
          try {
            return this._compileSchemaEnv(sch);
          } catch (e) {
            if (!(e instanceof ref_error_1.default))
              throw e;
            checkLoaded.call(this, e);
            await loadMissingSchema.call(this, e.missingSchema);
            return _compileAsync.call(this, sch);
          }
        }
        __name(_compileAsync, "_compileAsync");
        function checkLoaded({ missingSchema: ref, missingRef }) {
          if (this.refs[ref]) {
            throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
          }
        }
        __name(checkLoaded, "checkLoaded");
        async function loadMissingSchema(ref) {
          const _schema = await _loadSchema.call(this, ref);
          if (!this.refs[ref])
            await loadMetaSchema.call(this, _schema.$schema);
          if (!this.refs[ref])
            this.addSchema(_schema, ref, meta2);
        }
        __name(loadMissingSchema, "loadMissingSchema");
        async function _loadSchema(ref) {
          const p = this._loading[ref];
          if (p)
            return p;
          try {
            return await (this._loading[ref] = loadSchema(ref));
          } finally {
            delete this._loading[ref];
          }
        }
        __name(_loadSchema, "_loadSchema");
      }
      // Adds schema to the instance
      addSchema(schema, key, _meta, _validateSchema = this.opts.validateSchema) {
        if (Array.isArray(schema)) {
          for (const sch of schema)
            this.addSchema(sch, void 0, _meta, _validateSchema);
          return this;
        }
        let id;
        if (typeof schema === "object") {
          const { schemaId } = this.opts;
          id = schema[schemaId];
          if (id !== void 0 && typeof id != "string") {
            throw new Error(`schema ${schemaId} must be string`);
          }
        }
        key = (0, resolve_1.normalizeId)(key || id);
        this._checkUnique(key);
        this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
        return this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
        this.addSchema(schema, key, true, _validateSchema);
        return this;
      }
      //  Validate schema against its meta-schema
      validateSchema(schema, throwOrLogError) {
        if (typeof schema == "boolean")
          return true;
        let $schema;
        $schema = schema.$schema;
        if ($schema !== void 0 && typeof $schema != "string") {
          throw new Error("$schema must be a string");
        }
        $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
        if (!$schema) {
          this.logger.warn("meta-schema not available");
          this.errors = null;
          return true;
        }
        const valid = this.validate($schema, schema);
        if (!valid && throwOrLogError) {
          const message = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(message);
          else
            throw new Error(message);
        }
        return valid;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(keyRef) {
        let sch;
        while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
          keyRef = sch;
        if (sch === void 0) {
          const { schemaId } = this.opts;
          const root = new compile_1.SchemaEnv({ schema: {}, schemaId });
          sch = compile_1.resolveSchema.call(this, root, keyRef);
          if (!sch)
            return;
          this.refs[keyRef] = sch;
        }
        return sch.validate || this._compileSchemaEnv(sch);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(schemaKeyRef) {
        if (schemaKeyRef instanceof RegExp) {
          this._removeAllSchemas(this.schemas, schemaKeyRef);
          this._removeAllSchemas(this.refs, schemaKeyRef);
          return this;
        }
        switch (typeof schemaKeyRef) {
          case "undefined":
            this._removeAllSchemas(this.schemas);
            this._removeAllSchemas(this.refs);
            this._cache.clear();
            return this;
          case "string": {
            const sch = getSchEnv.call(this, schemaKeyRef);
            if (typeof sch == "object")
              this._cache.delete(sch.schema);
            delete this.schemas[schemaKeyRef];
            delete this.refs[schemaKeyRef];
            return this;
          }
          case "object": {
            const cacheKey = schemaKeyRef;
            this._cache.delete(cacheKey);
            let id = schemaKeyRef[this.opts.schemaId];
            if (id) {
              id = (0, resolve_1.normalizeId)(id);
              delete this.schemas[id];
              delete this.refs[id];
            }
            return this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(definitions) {
        for (const def of definitions)
          this.addKeyword(def);
        return this;
      }
      addKeyword(kwdOrDef, def) {
        let keyword;
        if (typeof kwdOrDef == "string") {
          keyword = kwdOrDef;
          if (typeof def == "object") {
            this.logger.warn("these parameters are deprecated, see docs for addKeyword");
            def.keyword = keyword;
          }
        } else if (typeof kwdOrDef == "object" && def === void 0) {
          def = kwdOrDef;
          keyword = def.keyword;
          if (Array.isArray(keyword) && !keyword.length) {
            throw new Error("addKeywords: keyword must be string or non-empty array");
          }
        } else {
          throw new Error("invalid addKeywords parameters");
        }
        checkKeyword.call(this, keyword, def);
        if (!def) {
          (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
          return this;
        }
        keywordMetaschema.call(this, def);
        const definition = {
          ...def,
          type: (0, dataType_1.getJSONTypes)(def.type),
          schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
        };
        (0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
        return this;
      }
      getKeyword(keyword) {
        const rule = this.RULES.all[keyword];
        return typeof rule == "object" ? rule.definition : !!rule;
      }
      // Remove keyword
      removeKeyword(keyword) {
        const { RULES } = this;
        delete RULES.keywords[keyword];
        delete RULES.all[keyword];
        for (const group of RULES.rules) {
          const i = group.rules.findIndex((rule) => rule.keyword === keyword);
          if (i >= 0)
            group.rules.splice(i, 1);
        }
        return this;
      }
      // Add format
      addFormat(name, format) {
        if (typeof format == "string")
          format = new RegExp(format);
        this.formats[name] = format;
        return this;
      }
      errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
        if (!errors || errors.length === 0)
          return "No errors";
        return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text, msg) => text + separator + msg);
      }
      $dataMetaSchema(metaSchema, keywordsJsonPointers) {
        const rules = this.RULES.all;
        metaSchema = JSON.parse(JSON.stringify(metaSchema));
        for (const jsonPointer of keywordsJsonPointers) {
          const segments = jsonPointer.split("/").slice(1);
          let keywords = metaSchema;
          for (const seg of segments)
            keywords = keywords[seg];
          for (const key in rules) {
            const rule = rules[key];
            if (typeof rule != "object")
              continue;
            const { $data } = rule.definition;
            const schema = keywords[key];
            if ($data && schema)
              keywords[key] = schemaOrData(schema);
          }
        }
        return metaSchema;
      }
      _removeAllSchemas(schemas, regex) {
        for (const keyRef in schemas) {
          const sch = schemas[keyRef];
          if (!regex || regex.test(keyRef)) {
            if (typeof sch == "string") {
              delete schemas[keyRef];
            } else if (sch && !sch.meta) {
              this._cache.delete(sch.schema);
              delete schemas[keyRef];
            }
          }
        }
      }
      _addSchema(schema, meta2, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
        let id;
        const { schemaId } = this.opts;
        if (typeof schema == "object") {
          id = schema[schemaId];
        } else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          else if (typeof schema != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let sch = this._cache.get(schema);
        if (sch !== void 0)
          return sch;
        baseId = (0, resolve_1.normalizeId)(id || baseId);
        const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
        sch = new compile_1.SchemaEnv({ schema, schemaId, meta: meta2, baseId, localRefs });
        this._cache.set(sch.schema, sch);
        if (addSchema && !baseId.startsWith("#")) {
          if (baseId)
            this._checkUnique(baseId);
          this.refs[baseId] = sch;
        }
        if (validateSchema)
          this.validateSchema(schema, true);
        return sch;
      }
      _checkUnique(id) {
        if (this.schemas[id] || this.refs[id]) {
          throw new Error(`schema with key or id "${id}" already exists`);
        }
      }
      _compileSchemaEnv(sch) {
        if (sch.meta)
          this._compileMetaSchema(sch);
        else
          compile_1.compileSchema.call(this, sch);
        if (!sch.validate)
          throw new Error("ajv implementation error");
        return sch.validate;
      }
      _compileMetaSchema(sch) {
        const currentOpts = this.opts;
        this.opts = this._metaOpts;
        try {
          compile_1.compileSchema.call(this, sch);
        } finally {
          this.opts = currentOpts;
        }
      }
    };
    Ajv2.ValidationError = validation_error_1.default;
    Ajv2.MissingRefError = ref_error_1.default;
    exports.default = Ajv2;
    function checkOptions(checkOpts, options, msg, log = "error") {
      for (const key in checkOpts) {
        const opt = key;
        if (opt in options)
          this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
      }
    }
    __name(checkOptions, "checkOptions");
    function getSchEnv(keyRef) {
      keyRef = (0, resolve_1.normalizeId)(keyRef);
      return this.schemas[keyRef] || this.refs[keyRef];
    }
    __name(getSchEnv, "getSchEnv");
    function addInitialSchemas() {
      const optsSchemas = this.opts.schemas;
      if (!optsSchemas)
        return;
      if (Array.isArray(optsSchemas))
        this.addSchema(optsSchemas);
      else
        for (const key in optsSchemas)
          this.addSchema(optsSchemas[key], key);
    }
    __name(addInitialSchemas, "addInitialSchemas");
    function addInitialFormats() {
      for (const name in this.opts.formats) {
        const format = this.opts.formats[name];
        if (format)
          this.addFormat(name, format);
      }
    }
    __name(addInitialFormats, "addInitialFormats");
    function addInitialKeywords(defs) {
      if (Array.isArray(defs)) {
        this.addVocabulary(defs);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const keyword in defs) {
        const def = defs[keyword];
        if (!def.keyword)
          def.keyword = keyword;
        this.addKeyword(def);
      }
    }
    __name(addInitialKeywords, "addInitialKeywords");
    function getMetaSchemaOptions() {
      const metaOpts = { ...this.opts };
      for (const opt of META_IGNORE_OPTIONS)
        delete metaOpts[opt];
      return metaOpts;
    }
    __name(getMetaSchemaOptions, "getMetaSchemaOptions");
    var noLogs = { log() {
    }, warn() {
    }, error() {
    } };
    function getLogger(logger) {
      if (logger === false)
        return noLogs;
      if (logger === void 0)
        return console;
      if (logger.log && logger.warn && logger.error)
        return logger;
      throw new Error("logger must implement log, warn and error methods");
    }
    __name(getLogger, "getLogger");
    var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
    function checkKeyword(keyword, def) {
      const { RULES } = this;
      (0, util_1.eachItem)(keyword, (kwd) => {
        if (RULES.keywords[kwd])
          throw new Error(`Keyword ${kwd} is already defined`);
        if (!KEYWORD_NAME.test(kwd))
          throw new Error(`Keyword ${kwd} has invalid name`);
      });
      if (!def)
        return;
      if (def.$data && !("code" in def || "validate" in def)) {
        throw new Error('$data keyword must have "code" or "validate" function');
      }
    }
    __name(checkKeyword, "checkKeyword");
    function addRule(keyword, definition, dataType) {
      var _a3;
      const post = definition === null || definition === void 0 ? void 0 : definition.post;
      if (dataType && post)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES } = this;
      let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
      if (!ruleGroup) {
        ruleGroup = { type: dataType, rules: [] };
        RULES.rules.push(ruleGroup);
      }
      RULES.keywords[keyword] = true;
      if (!definition)
        return;
      const rule = {
        keyword,
        definition: {
          ...definition,
          type: (0, dataType_1.getJSONTypes)(definition.type),
          schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
        }
      };
      if (definition.before)
        addBeforeRule.call(this, ruleGroup, rule, definition.before);
      else
        ruleGroup.rules.push(rule);
      RULES.all[keyword] = rule;
      (_a3 = definition.implements) === null || _a3 === void 0 ? void 0 : _a3.forEach((kwd) => this.addKeyword(kwd));
    }
    __name(addRule, "addRule");
    function addBeforeRule(ruleGroup, rule, before) {
      const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
      if (i >= 0) {
        ruleGroup.rules.splice(i, 0, rule);
      } else {
        ruleGroup.rules.push(rule);
        this.logger.warn(`rule ${before} is not defined`);
      }
    }
    __name(addBeforeRule, "addBeforeRule");
    function keywordMetaschema(def) {
      let { metaSchema } = def;
      if (metaSchema === void 0)
        return;
      if (def.$data && this.opts.$data)
        metaSchema = schemaOrData(metaSchema);
      def.validateSchema = this.compile(metaSchema, true);
    }
    __name(keywordMetaschema, "keywordMetaschema");
    var $dataRef = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function schemaOrData(schema) {
      return { anyOf: [schema, $dataRef] };
    }
    __name(schemaOrData, "schemaOrData");
  }
});

// node_modules/ajv/dist/vocabularies/core/id.js
var require_id = __commonJS({
  "node_modules/ajv/dist/vocabularies/core/id.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var def = {
      keyword: "id",
      code() {
        throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/core/ref.js
var require_ref = __commonJS({
  "node_modules/ajv/dist/vocabularies/core/ref.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.callRef = exports.getValidate = void 0;
    var ref_error_1 = require_ref_error();
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var compile_1 = require_compile();
    var util_1 = require_util();
    var def = {
      keyword: "$ref",
      schemaType: "string",
      code(cxt) {
        const { gen, schema: $ref, it } = cxt;
        const { baseId, schemaEnv: env, validateName, opts, self } = it;
        const { root } = env;
        if (($ref === "#" || $ref === "#/") && baseId === root.baseId)
          return callRootRef();
        const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
        if (schOrEnv === void 0)
          throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
        if (schOrEnv instanceof compile_1.SchemaEnv)
          return callValidate(schOrEnv);
        return inlineRefSchema(schOrEnv);
        function callRootRef() {
          if (env === root)
            return callRef(cxt, validateName, env, env.$async);
          const rootName = gen.scopeValue("root", { ref: root });
          return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root, root.$async);
        }
        __name(callRootRef, "callRootRef");
        function callValidate(sch) {
          const v = getValidate(cxt, sch);
          callRef(cxt, v, sch, sch.$async);
        }
        __name(callValidate, "callValidate");
        function inlineRefSchema(sch) {
          const schName = gen.scopeValue("schema", opts.code.source === true ? { ref: sch, code: (0, codegen_1.stringify)(sch) } : { ref: sch });
          const valid = gen.name("valid");
          const schCxt = cxt.subschema({
            schema: sch,
            dataTypes: [],
            schemaPath: codegen_1.nil,
            topSchemaRef: schName,
            errSchemaPath: $ref
          }, valid);
          cxt.mergeEvaluated(schCxt);
          cxt.ok(valid);
        }
        __name(inlineRefSchema, "inlineRefSchema");
      }
    };
    function getValidate(cxt, sch) {
      const { gen } = cxt;
      return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
    }
    __name(getValidate, "getValidate");
    exports.getValidate = getValidate;
    function callRef(cxt, v, sch, $async) {
      const { gen, it } = cxt;
      const { allErrors, schemaEnv: env, opts } = it;
      const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
      if ($async)
        callAsyncRef();
      else
        callSyncRef();
      function callAsyncRef() {
        if (!env.$async)
          throw new Error("async schema referenced by sync schema");
        const valid = gen.let("valid");
        gen.try(() => {
          gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
          addEvaluatedFrom(v);
          if (!allErrors)
            gen.assign(valid, true);
        }, (e) => {
          gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
          addErrorsFrom(e);
          if (!allErrors)
            gen.assign(valid, false);
        });
        cxt.ok(valid);
      }
      __name(callAsyncRef, "callAsyncRef");
      function callSyncRef() {
        cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
      }
      __name(callSyncRef, "callSyncRef");
      function addErrorsFrom(source) {
        const errs = (0, codegen_1._)`${source}.errors`;
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
        gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
      }
      __name(addErrorsFrom, "addErrorsFrom");
      function addEvaluatedFrom(source) {
        var _a3;
        if (!it.opts.unevaluated)
          return;
        const schEvaluated = (_a3 = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a3 === void 0 ? void 0 : _a3.evaluated;
        if (it.props !== true) {
          if (schEvaluated && !schEvaluated.dynamicProps) {
            if (schEvaluated.props !== void 0) {
              it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
            }
          } else {
            const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
            it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
          }
        }
        if (it.items !== true) {
          if (schEvaluated && !schEvaluated.dynamicItems) {
            if (schEvaluated.items !== void 0) {
              it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
            }
          } else {
            const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
            it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
          }
        }
      }
      __name(addEvaluatedFrom, "addEvaluatedFrom");
    }
    __name(callRef, "callRef");
    exports.callRef = callRef;
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/core/index.js
var require_core2 = __commonJS({
  "node_modules/ajv/dist/vocabularies/core/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var id_1 = require_id();
    var ref_1 = require_ref();
    var core = [
      "$schema",
      "$id",
      "$defs",
      "$vocabulary",
      { keyword: "$comment" },
      "definitions",
      id_1.default,
      ref_1.default
    ];
    exports.default = core;
  }
});

// node_modules/ajv/dist/vocabularies/validation/limitNumber.js
var require_limitNumber = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/limitNumber.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var ops = codegen_1.operators;
    var KWDs = {
      maximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      minimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      exclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      exclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
    };
    var error2 = {
      message: /* @__PURE__ */ __name(({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`, "message"),
      params: /* @__PURE__ */ __name(({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`, "params")
    };
    var def = {
      keyword: Object.keys(KWDs),
      type: "number",
      schemaType: "number",
      $data: true,
      error: error2,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/multipleOf.js
var require_multipleOf = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/multipleOf.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error2 = {
      message: /* @__PURE__ */ __name(({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`, "message"),
      params: /* @__PURE__ */ __name(({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`, "params")
    };
    var def = {
      keyword: "multipleOf",
      type: "number",
      schemaType: "number",
      $data: true,
      error: error2,
      code(cxt) {
        const { gen, data, schemaCode, it } = cxt;
        const prec = it.opts.multipleOfPrecision;
        const res = gen.let("res");
        const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
        cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = __commonJS({
  "node_modules/ajv/dist/runtime/ucs2length.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    function ucs2length(str) {
      const len = str.length;
      let length = 0;
      let pos = 0;
      let value;
      while (pos < len) {
        length++;
        value = str.charCodeAt(pos++);
        if (value >= 55296 && value <= 56319 && pos < len) {
          value = str.charCodeAt(pos);
          if ((value & 64512) === 56320)
            pos++;
        }
      }
      return length;
    }
    __name(ucs2length, "ucs2length");
    exports.default = ucs2length;
    ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
  }
});

// node_modules/ajv/dist/vocabularies/validation/limitLength.js
var require_limitLength = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/limitLength.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var ucs2length_1 = require_ucs2length();
    var error2 = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxLength" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
      },
      params: /* @__PURE__ */ __name(({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`, "params")
    };
    var def = {
      keyword: ["maxLength", "minLength"],
      type: "string",
      schemaType: "number",
      $data: true,
      error: error2,
      code(cxt) {
        const { keyword, data, schemaCode, it } = cxt;
        const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
        const len = it.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
        cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/pattern.js
var require_pattern = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/pattern.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var util_1 = require_util();
    var codegen_1 = require_codegen();
    var error2 = {
      message: /* @__PURE__ */ __name(({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`, "message"),
      params: /* @__PURE__ */ __name(({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`, "params")
    };
    var def = {
      keyword: "pattern",
      type: "string",
      schemaType: "string",
      $data: true,
      error: error2,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const u = it.opts.unicodeRegExp ? "u" : "";
        if ($data) {
          const { regExp } = it.opts.code;
          const regExpCode = regExp.code === "new RegExp" ? (0, codegen_1._)`new RegExp` : (0, util_1.useFunc)(gen, regExp);
          const valid = gen.let("valid");
          gen.try(() => gen.assign(valid, (0, codegen_1._)`${regExpCode}(${schemaCode}, ${u}).test(${data})`), () => gen.assign(valid, false));
          cxt.fail$data((0, codegen_1._)`!${valid}`);
        } else {
          const regExp = (0, code_1.usePattern)(cxt, schema);
          cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/limitProperties.js
var require_limitProperties = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/limitProperties.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error2 = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxProperties" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`;
      },
      params: /* @__PURE__ */ __name(({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`, "params")
    };
    var def = {
      keyword: ["maxProperties", "minProperties"],
      type: "object",
      schemaType: "number",
      $data: true,
      error: error2,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/required.js
var require_required = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/required.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error2 = {
      message: /* @__PURE__ */ __name(({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`, "message"),
      params: /* @__PURE__ */ __name(({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`, "params")
    };
    var def = {
      keyword: "required",
      type: "object",
      schemaType: "array",
      $data: true,
      error: error2,
      code(cxt) {
        const { gen, schema, schemaCode, data, $data, it } = cxt;
        const { opts } = it;
        if (!$data && schema.length === 0)
          return;
        const useLoop = schema.length >= opts.loopRequired;
        if (it.allErrors)
          allErrorsMode();
        else
          exitOnErrorMode();
        if (opts.strictRequired) {
          const props = cxt.parentSchema.properties;
          const { definedProperties } = cxt.it;
          for (const requiredKey of schema) {
            if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
              const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
              const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
              (0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
            }
          }
        }
        function allErrorsMode() {
          if (useLoop || $data) {
            cxt.block$data(codegen_1.nil, loopAllRequired);
          } else {
            for (const prop of schema) {
              (0, code_1.checkReportMissingProp)(cxt, prop);
            }
          }
        }
        __name(allErrorsMode, "allErrorsMode");
        function exitOnErrorMode() {
          const missing = gen.let("missing");
          if (useLoop || $data) {
            const valid = gen.let("valid", true);
            cxt.block$data(valid, () => loopUntilMissing(missing, valid));
            cxt.ok(valid);
          } else {
            gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
            (0, code_1.reportMissingProp)(cxt, missing);
            gen.else();
          }
        }
        __name(exitOnErrorMode, "exitOnErrorMode");
        function loopAllRequired() {
          gen.forOf("prop", schemaCode, (prop) => {
            cxt.setParams({ missingProperty: prop });
            gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
          });
        }
        __name(loopAllRequired, "loopAllRequired");
        function loopUntilMissing(missing, valid) {
          cxt.setParams({ missingProperty: missing });
          gen.forOf(missing, schemaCode, () => {
            gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
            gen.if((0, codegen_1.not)(valid), () => {
              cxt.error();
              gen.break();
            });
          }, codegen_1.nil);
        }
        __name(loopUntilMissing, "loopUntilMissing");
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/limitItems.js
var require_limitItems = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/limitItems.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error2 = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxItems" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
      },
      params: /* @__PURE__ */ __name(({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`, "params")
    };
    var def = {
      keyword: ["maxItems", "minItems"],
      type: "array",
      schemaType: "number",
      $data: true,
      error: error2,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/runtime/equal.js
var require_equal = __commonJS({
  "node_modules/ajv/dist/runtime/equal.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var equal = require_fast_deep_equal();
    equal.code = 'require("ajv/dist/runtime/equal").default';
    exports.default = equal;
  }
});

// node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
var require_uniqueItems = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/uniqueItems.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var dataType_1 = require_dataType();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error2 = {
      message: /* @__PURE__ */ __name(({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`, "message"),
      params: /* @__PURE__ */ __name(({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`, "params")
    };
    var def = {
      keyword: "uniqueItems",
      type: "array",
      schemaType: "boolean",
      $data: true,
      error: error2,
      code(cxt) {
        const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
        if (!$data && !schema)
          return;
        const valid = gen.let("valid");
        const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
        cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
        cxt.ok(valid);
        function validateUniqueItems() {
          const i = gen.let("i", (0, codegen_1._)`${data}.length`);
          const j = gen.let("j");
          cxt.setParams({ i, j });
          gen.assign(valid, true);
          gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
        }
        __name(validateUniqueItems, "validateUniqueItems");
        function canOptimize() {
          return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
        }
        __name(canOptimize, "canOptimize");
        function loopN(i, j) {
          const item = gen.name("item");
          const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
          const indices = gen.const("indices", (0, codegen_1._)`{}`);
          gen.for((0, codegen_1._)`;${i}--;`, () => {
            gen.let(item, (0, codegen_1._)`${data}[${i}]`);
            gen.if(wrongType, (0, codegen_1._)`continue`);
            if (itemTypes.length > 1)
              gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
            gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
              gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
              cxt.error();
              gen.assign(valid, false).break();
            }).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
          });
        }
        __name(loopN, "loopN");
        function loopN2(i, j) {
          const eql = (0, util_1.useFunc)(gen, equal_1.default);
          const outer = gen.name("outer");
          gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`, () => {
            cxt.error();
            gen.assign(valid, false).break(outer);
          })));
        }
        __name(loopN2, "loopN2");
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/const.js
var require_const = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/const.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error2 = {
      message: "must be equal to constant",
      params: /* @__PURE__ */ __name(({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`, "params")
    };
    var def = {
      keyword: "const",
      $data: true,
      error: error2,
      code(cxt) {
        const { gen, data, $data, schemaCode, schema } = cxt;
        if ($data || schema && typeof schema == "object") {
          cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
        } else {
          cxt.fail((0, codegen_1._)`${schema} !== ${data}`);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/enum.js
var require_enum = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/enum.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error2 = {
      message: "must be equal to one of the allowed values",
      params: /* @__PURE__ */ __name(({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`, "params")
    };
    var def = {
      keyword: "enum",
      schemaType: "array",
      $data: true,
      error: error2,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        if (!$data && schema.length === 0)
          throw new Error("enum must have non-empty array");
        const useLoop = schema.length >= it.opts.loopEnum;
        let eql;
        const getEql = /* @__PURE__ */ __name(() => eql !== null && eql !== void 0 ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default), "getEql");
        let valid;
        if (useLoop || $data) {
          valid = gen.let("valid");
          cxt.block$data(valid, loopEnum);
        } else {
          if (!Array.isArray(schema))
            throw new Error("ajv implementation error");
          const vSchema = gen.const("vSchema", schemaCode);
          valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
        }
        cxt.pass(valid);
        function loopEnum() {
          gen.assign(valid, false);
          gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
        }
        __name(loopEnum, "loopEnum");
        function equalCode(vSchema, i) {
          const sch = schema[i];
          return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${getEql()}(${data}, ${vSchema}[${i}])` : (0, codegen_1._)`${data} === ${sch}`;
        }
        __name(equalCode, "equalCode");
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/index.js
var require_validation = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var limitNumber_1 = require_limitNumber();
    var multipleOf_1 = require_multipleOf();
    var limitLength_1 = require_limitLength();
    var pattern_1 = require_pattern();
    var limitProperties_1 = require_limitProperties();
    var required_1 = require_required();
    var limitItems_1 = require_limitItems();
    var uniqueItems_1 = require_uniqueItems();
    var const_1 = require_const();
    var enum_1 = require_enum();
    var validation = [
      // number
      limitNumber_1.default,
      multipleOf_1.default,
      // string
      limitLength_1.default,
      pattern_1.default,
      // object
      limitProperties_1.default,
      required_1.default,
      // array
      limitItems_1.default,
      uniqueItems_1.default,
      // any
      { keyword: "type", schemaType: ["string", "array"] },
      { keyword: "nullable", schemaType: "boolean" },
      const_1.default,
      enum_1.default
    ];
    exports.default = validation;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
var require_additionalItems = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/additionalItems.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateAdditionalItems = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error2 = {
      message: /* @__PURE__ */ __name(({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`, "message"),
      params: /* @__PURE__ */ __name(({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`, "params")
    };
    var def = {
      keyword: "additionalItems",
      type: "array",
      schemaType: ["boolean", "object"],
      before: "uniqueItems",
      error: error2,
      code(cxt) {
        const { parentSchema, it } = cxt;
        const { items } = parentSchema;
        if (!Array.isArray(items)) {
          (0, util_1.checkStrictMode)(it, '"additionalItems" is ignored when "items" is not an array of schemas');
          return;
        }
        validateAdditionalItems(cxt, items);
      }
    };
    function validateAdditionalItems(cxt, items) {
      const { gen, schema, data, keyword, it } = cxt;
      it.items = true;
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      if (schema === false) {
        cxt.setParams({ len: items.length });
        cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
      } else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
        const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
        gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
        cxt.ok(valid);
      }
      function validateItems(valid) {
        gen.forRange("i", items.length, len, (i) => {
          cxt.subschema({ keyword, dataProp: i, dataPropType: util_1.Type.Num }, valid);
          if (!it.allErrors)
            gen.if((0, codegen_1.not)(valid), () => gen.break());
        });
      }
      __name(validateItems, "validateItems");
    }
    __name(validateAdditionalItems, "validateAdditionalItems");
    exports.validateAdditionalItems = validateAdditionalItems;
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/items.js
var require_items = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/items.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateTuple = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "array", "boolean"],
      before: "uniqueItems",
      code(cxt) {
        const { schema, it } = cxt;
        if (Array.isArray(schema))
          return validateTuple(cxt, "additionalItems", schema);
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    function validateTuple(cxt, extraItems, schArr = cxt.schema) {
      const { gen, parentSchema, data, keyword, it } = cxt;
      checkStrictTuple(parentSchema);
      if (it.opts.unevaluated && schArr.length && it.items !== true) {
        it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
      }
      const valid = gen.name("valid");
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      schArr.forEach((sch, i) => {
        if ((0, util_1.alwaysValidSchema)(it, sch))
          return;
        gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
          keyword,
          schemaProp: i,
          dataProp: i
        }, valid));
        cxt.ok(valid);
      });
      function checkStrictTuple(sch) {
        const { opts, errSchemaPath } = it;
        const l = schArr.length;
        const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
        if (opts.strictTuples && !fullTuple) {
          const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
          (0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
        }
      }
      __name(checkStrictTuple, "checkStrictTuple");
    }
    __name(validateTuple, "validateTuple");
    exports.validateTuple = validateTuple;
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/prefixItems.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var items_1 = require_items();
    var def = {
      keyword: "prefixItems",
      type: "array",
      schemaType: ["array"],
      before: "uniqueItems",
      code: /* @__PURE__ */ __name((cxt) => (0, items_1.validateTuple)(cxt, "items"), "code")
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/items2020.js
var require_items2020 = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/items2020.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var additionalItems_1 = require_additionalItems();
    var error2 = {
      message: /* @__PURE__ */ __name(({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`, "message"),
      params: /* @__PURE__ */ __name(({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`, "params")
    };
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      error: error2,
      code(cxt) {
        const { schema, parentSchema, it } = cxt;
        const { prefixItems } = parentSchema;
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        if (prefixItems)
          (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
        else
          cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/contains.js
var require_contains = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/contains.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error2 = {
      message: /* @__PURE__ */ __name(({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`, "message"),
      params: /* @__PURE__ */ __name(({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`, "params")
    };
    var def = {
      keyword: "contains",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      trackErrors: true,
      error: error2,
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        let min;
        let max;
        const { minContains, maxContains } = parentSchema;
        if (it.opts.next) {
          min = minContains === void 0 ? 1 : minContains;
          max = maxContains;
        } else {
          min = 1;
        }
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        cxt.setParams({ min, max });
        if (max === void 0 && min === 0) {
          (0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
          return;
        }
        if (max !== void 0 && min > max) {
          (0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
          cxt.fail();
          return;
        }
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          let cond = (0, codegen_1._)`${len} >= ${min}`;
          if (max !== void 0)
            cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
          cxt.pass(cond);
          return;
        }
        it.items = true;
        const valid = gen.name("valid");
        if (max === void 0 && min === 1) {
          validateItems(valid, () => gen.if(valid, () => gen.break()));
        } else if (min === 0) {
          gen.let(valid, true);
          if (max !== void 0)
            gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount);
        } else {
          gen.let(valid, false);
          validateItemsWithCount();
        }
        cxt.result(valid, () => cxt.reset());
        function validateItemsWithCount() {
          const schValid = gen.name("_valid");
          const count = gen.let("count", 0);
          validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
        }
        __name(validateItemsWithCount, "validateItemsWithCount");
        function validateItems(_valid, block) {
          gen.forRange("i", 0, len, (i) => {
            cxt.subschema({
              keyword: "contains",
              dataProp: i,
              dataPropType: util_1.Type.Num,
              compositeRule: true
            }, _valid);
            block();
          });
        }
        __name(validateItems, "validateItems");
        function checkLimits(count) {
          gen.code((0, codegen_1._)`${count}++`);
          if (max === void 0) {
            gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
          } else {
            gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
            if (min === 1)
              gen.assign(valid, true);
            else
              gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
          }
        }
        __name(checkLimits, "checkLimits");
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/dependencies.js
var require_dependencies = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/dependencies.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    exports.error = {
      message: /* @__PURE__ */ __name(({ params: { property, depsCount, deps } }) => {
        const property_ies = depsCount === 1 ? "property" : "properties";
        return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
      }, "message"),
      params: /* @__PURE__ */ __name(({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`, "params")
      // TODO change to reference
    };
    var def = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: exports.error,
      code(cxt) {
        const [propDeps, schDeps] = splitDependencies(cxt);
        validatePropertyDeps(cxt, propDeps);
        validateSchemaDeps(cxt, schDeps);
      }
    };
    function splitDependencies({ schema }) {
      const propertyDeps = {};
      const schemaDeps = {};
      for (const key in schema) {
        if (key === "__proto__")
          continue;
        const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
        deps[key] = schema[key];
      }
      return [propertyDeps, schemaDeps];
    }
    __name(splitDependencies, "splitDependencies");
    function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
      const { gen, data, it } = cxt;
      if (Object.keys(propertyDeps).length === 0)
        return;
      const missing = gen.let("missing");
      for (const prop in propertyDeps) {
        const deps = propertyDeps[prop];
        if (deps.length === 0)
          continue;
        const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
        cxt.setParams({
          property: prop,
          depsCount: deps.length,
          deps: deps.join(", ")
        });
        if (it.allErrors) {
          gen.if(hasProperty, () => {
            for (const depProp of deps) {
              (0, code_1.checkReportMissingProp)(cxt, depProp);
            }
          });
        } else {
          gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
          (0, code_1.reportMissingProp)(cxt, missing);
          gen.else();
        }
      }
    }
    __name(validatePropertyDeps, "validatePropertyDeps");
    exports.validatePropertyDeps = validatePropertyDeps;
    function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      for (const prop in schemaDeps) {
        if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop]))
          continue;
        gen.if(
          (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties),
          () => {
            const schCxt = cxt.subschema({ keyword, schemaProp: prop }, valid);
            cxt.mergeValidEvaluated(schCxt, valid);
          },
          () => gen.var(valid, true)
          // TODO var
        );
        cxt.ok(valid);
      }
    }
    __name(validateSchemaDeps, "validateSchemaDeps");
    exports.validateSchemaDeps = validateSchemaDeps;
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
var require_propertyNames = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/propertyNames.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error2 = {
      message: "property name must be valid",
      params: /* @__PURE__ */ __name(({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`, "params")
    };
    var def = {
      keyword: "propertyNames",
      type: "object",
      schemaType: ["object", "boolean"],
      error: error2,
      code(cxt) {
        const { gen, schema, data, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        const valid = gen.name("valid");
        gen.forIn("key", data, (key) => {
          cxt.setParams({ propertyName: key });
          cxt.subschema({
            keyword: "propertyNames",
            data: key,
            dataTypes: ["string"],
            propertyName: key,
            compositeRule: true
          }, valid);
          gen.if((0, codegen_1.not)(valid), () => {
            cxt.error(true);
            if (!it.allErrors)
              gen.break();
          });
        });
        cxt.ok(valid);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
var require_additionalProperties = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var util_1 = require_util();
    var error2 = {
      message: "must NOT have additional properties",
      params: /* @__PURE__ */ __name(({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`, "params")
    };
    var def = {
      keyword: "additionalProperties",
      type: ["object"],
      schemaType: ["boolean", "object"],
      allowUndefined: true,
      trackErrors: true,
      error: error2,
      code(cxt) {
        const { gen, schema, parentSchema, data, errsCount, it } = cxt;
        if (!errsCount)
          throw new Error("ajv implementation error");
        const { allErrors, opts } = it;
        it.props = true;
        if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema))
          return;
        const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
        const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
        checkAdditionalProperties();
        cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
        function checkAdditionalProperties() {
          gen.forIn("key", data, (key) => {
            if (!props.length && !patProps.length)
              additionalPropertyCode(key);
            else
              gen.if(isAdditional(key), () => additionalPropertyCode(key));
          });
        }
        __name(checkAdditionalProperties, "checkAdditionalProperties");
        function isAdditional(key) {
          let definedProp;
          if (props.length > 8) {
            const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
            definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
          } else if (props.length) {
            definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
          } else {
            definedProp = codegen_1.nil;
          }
          if (patProps.length) {
            definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
          }
          return (0, codegen_1.not)(definedProp);
        }
        __name(isAdditional, "isAdditional");
        function deleteAdditional(key) {
          gen.code((0, codegen_1._)`delete ${data}[${key}]`);
        }
        __name(deleteAdditional, "deleteAdditional");
        function additionalPropertyCode(key) {
          if (opts.removeAdditional === "all" || opts.removeAdditional && schema === false) {
            deleteAdditional(key);
            return;
          }
          if (schema === false) {
            cxt.setParams({ additionalProperty: key });
            cxt.error();
            if (!allErrors)
              gen.break();
            return;
          }
          if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
            const valid = gen.name("valid");
            if (opts.removeAdditional === "failing") {
              applyAdditionalSchema(key, valid, false);
              gen.if((0, codegen_1.not)(valid), () => {
                cxt.reset();
                deleteAdditional(key);
              });
            } else {
              applyAdditionalSchema(key, valid);
              if (!allErrors)
                gen.if((0, codegen_1.not)(valid), () => gen.break());
            }
          }
        }
        __name(additionalPropertyCode, "additionalPropertyCode");
        function applyAdditionalSchema(key, valid, errors) {
          const subschema = {
            keyword: "additionalProperties",
            dataProp: key,
            dataPropType: util_1.Type.Str
          };
          if (errors === false) {
            Object.assign(subschema, {
              compositeRule: true,
              createErrors: false,
              allErrors: false
            });
          }
          cxt.subschema(subschema, valid);
        }
        __name(applyAdditionalSchema, "applyAdditionalSchema");
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/properties.js
var require_properties = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/properties.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var validate_1 = require_validate();
    var code_1 = require_code2();
    var util_1 = require_util();
    var additionalProperties_1 = require_additionalProperties();
    var def = {
      keyword: "properties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) {
          additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
        }
        const allProps = (0, code_1.allSchemaProperties)(schema);
        for (const prop of allProps) {
          it.definedProperties.add(prop);
        }
        if (it.opts.unevaluated && allProps.length && it.props !== true) {
          it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
        }
        const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
        if (properties.length === 0)
          return;
        const valid = gen.name("valid");
        for (const prop of properties) {
          if (hasDefault(prop)) {
            applyPropertySchema(prop);
          } else {
            gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
            applyPropertySchema(prop);
            if (!it.allErrors)
              gen.else().var(valid, true);
            gen.endIf();
          }
          cxt.it.definedProperties.add(prop);
          cxt.ok(valid);
        }
        function hasDefault(prop) {
          return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== void 0;
        }
        __name(hasDefault, "hasDefault");
        function applyPropertySchema(prop) {
          cxt.subschema({
            keyword: "properties",
            schemaProp: prop,
            dataProp: prop
          }, valid);
        }
        __name(applyPropertySchema, "applyPropertySchema");
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
var require_patternProperties = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/patternProperties.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var util_2 = require_util();
    var def = {
      keyword: "patternProperties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, data, parentSchema, it } = cxt;
        const { opts } = it;
        const patterns = (0, code_1.allSchemaProperties)(schema);
        const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
        if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) {
          return;
        }
        const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
        const valid = gen.name("valid");
        if (it.props !== true && !(it.props instanceof codegen_1.Name)) {
          it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
        }
        const { props } = it;
        validatePatternProperties();
        function validatePatternProperties() {
          for (const pat of patterns) {
            if (checkProperties)
              checkMatchingProperties(pat);
            if (it.allErrors) {
              validateProperties(pat);
            } else {
              gen.var(valid, true);
              validateProperties(pat);
              gen.if(valid);
            }
          }
        }
        __name(validatePatternProperties, "validatePatternProperties");
        function checkMatchingProperties(pat) {
          for (const prop in checkProperties) {
            if (new RegExp(pat).test(prop)) {
              (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
            }
          }
        }
        __name(checkMatchingProperties, "checkMatchingProperties");
        function validateProperties(pat) {
          gen.forIn("key", data, (key) => {
            gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
              const alwaysValid = alwaysValidPatterns.includes(pat);
              if (!alwaysValid) {
                cxt.subschema({
                  keyword: "patternProperties",
                  schemaProp: pat,
                  dataProp: key,
                  dataPropType: util_2.Type.Str
                }, valid);
              }
              if (it.opts.unevaluated && props !== true) {
                gen.assign((0, codegen_1._)`${props}[${key}]`, true);
              } else if (!alwaysValid && !it.allErrors) {
                gen.if((0, codegen_1.not)(valid), () => gen.break());
              }
            });
          });
        }
        __name(validateProperties, "validateProperties");
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/not.js
var require_not = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/not.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: "not",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      code(cxt) {
        const { gen, schema, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          cxt.fail();
          return;
        }
        const valid = gen.name("valid");
        cxt.subschema({
          keyword: "not",
          compositeRule: true,
          createErrors: false,
          allErrors: false
        }, valid);
        cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
      },
      error: { message: "must NOT be valid" }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/anyOf.js
var require_anyOf = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/anyOf.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var def = {
      keyword: "anyOf",
      schemaType: "array",
      trackErrors: true,
      code: code_1.validateUnion,
      error: { message: "must match a schema in anyOf" }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/oneOf.js
var require_oneOf = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/oneOf.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error2 = {
      message: "must match exactly one schema in oneOf",
      params: /* @__PURE__ */ __name(({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`, "params")
    };
    var def = {
      keyword: "oneOf",
      schemaType: "array",
      trackErrors: true,
      error: error2,
      code(cxt) {
        const { gen, schema, parentSchema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        if (it.opts.discriminator && parentSchema.discriminator)
          return;
        const schArr = schema;
        const valid = gen.let("valid", false);
        const passing = gen.let("passing", null);
        const schValid = gen.name("_valid");
        cxt.setParams({ passing });
        gen.block(validateOneOf);
        cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
        function validateOneOf() {
          schArr.forEach((sch, i) => {
            let schCxt;
            if ((0, util_1.alwaysValidSchema)(it, sch)) {
              gen.var(schValid, true);
            } else {
              schCxt = cxt.subschema({
                keyword: "oneOf",
                schemaProp: i,
                compositeRule: true
              }, schValid);
            }
            if (i > 0) {
              gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
            }
            gen.if(schValid, () => {
              gen.assign(valid, true);
              gen.assign(passing, i);
              if (schCxt)
                cxt.mergeEvaluated(schCxt, codegen_1.Name);
            });
          });
        }
        __name(validateOneOf, "validateOneOf");
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/allOf.js
var require_allOf = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/allOf.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: "allOf",
      schemaType: "array",
      code(cxt) {
        const { gen, schema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        const valid = gen.name("valid");
        schema.forEach((sch, i) => {
          if ((0, util_1.alwaysValidSchema)(it, sch))
            return;
          const schCxt = cxt.subschema({ keyword: "allOf", schemaProp: i }, valid);
          cxt.ok(valid);
          cxt.mergeEvaluated(schCxt);
        });
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/if.js
var require_if = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/if.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error2 = {
      message: /* @__PURE__ */ __name(({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`, "message"),
      params: /* @__PURE__ */ __name(({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`, "params")
    };
    var def = {
      keyword: "if",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      error: error2,
      code(cxt) {
        const { gen, parentSchema, it } = cxt;
        if (parentSchema.then === void 0 && parentSchema.else === void 0) {
          (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
        }
        const hasThen = hasSchema(it, "then");
        const hasElse = hasSchema(it, "else");
        if (!hasThen && !hasElse)
          return;
        const valid = gen.let("valid", true);
        const schValid = gen.name("_valid");
        validateIf();
        cxt.reset();
        if (hasThen && hasElse) {
          const ifClause = gen.let("ifClause");
          cxt.setParams({ ifClause });
          gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
        } else if (hasThen) {
          gen.if(schValid, validateClause("then"));
        } else {
          gen.if((0, codegen_1.not)(schValid), validateClause("else"));
        }
        cxt.pass(valid, () => cxt.error(true));
        function validateIf() {
          const schCxt = cxt.subschema({
            keyword: "if",
            compositeRule: true,
            createErrors: false,
            allErrors: false
          }, schValid);
          cxt.mergeEvaluated(schCxt);
        }
        __name(validateIf, "validateIf");
        function validateClause(keyword, ifClause) {
          return () => {
            const schCxt = cxt.subschema({ keyword }, schValid);
            gen.assign(valid, schValid);
            cxt.mergeValidEvaluated(schCxt, valid);
            if (ifClause)
              gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
            else
              cxt.setParams({ ifClause: keyword });
          };
        }
        __name(validateClause, "validateClause");
      }
    };
    function hasSchema(it, keyword) {
      const schema = it.schema[keyword];
      return schema !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema);
    }
    __name(hasSchema, "hasSchema");
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/thenElse.js
var require_thenElse = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/thenElse.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: ["then", "else"],
      schemaType: ["object", "boolean"],
      code({ keyword, parentSchema, it }) {
        if (parentSchema.if === void 0)
          (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/index.js
var require_applicator = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var additionalItems_1 = require_additionalItems();
    var prefixItems_1 = require_prefixItems();
    var items_1 = require_items();
    var items2020_1 = require_items2020();
    var contains_1 = require_contains();
    var dependencies_1 = require_dependencies();
    var propertyNames_1 = require_propertyNames();
    var additionalProperties_1 = require_additionalProperties();
    var properties_1 = require_properties();
    var patternProperties_1 = require_patternProperties();
    var not_1 = require_not();
    var anyOf_1 = require_anyOf();
    var oneOf_1 = require_oneOf();
    var allOf_1 = require_allOf();
    var if_1 = require_if();
    var thenElse_1 = require_thenElse();
    function getApplicator(draft2020 = false) {
      const applicator = [
        // any
        not_1.default,
        anyOf_1.default,
        oneOf_1.default,
        allOf_1.default,
        if_1.default,
        thenElse_1.default,
        // object
        propertyNames_1.default,
        additionalProperties_1.default,
        dependencies_1.default,
        properties_1.default,
        patternProperties_1.default
      ];
      if (draft2020)
        applicator.push(prefixItems_1.default, items2020_1.default);
      else
        applicator.push(additionalItems_1.default, items_1.default);
      applicator.push(contains_1.default);
      return applicator;
    }
    __name(getApplicator, "getApplicator");
    exports.default = getApplicator;
  }
});

// node_modules/ajv/dist/vocabularies/format/format.js
var require_format = __commonJS({
  "node_modules/ajv/dist/vocabularies/format/format.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error2 = {
      message: /* @__PURE__ */ __name(({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`, "message"),
      params: /* @__PURE__ */ __name(({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`, "params")
    };
    var def = {
      keyword: "format",
      type: ["number", "string"],
      schemaType: "string",
      $data: true,
      error: error2,
      code(cxt, ruleType) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const { opts, errSchemaPath, schemaEnv, self } = it;
        if (!opts.validateFormats)
          return;
        if ($data)
          validate$DataFormat();
        else
          validateFormat();
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self.formats,
            code: opts.code.formats
          });
          const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
          const fType = gen.let("fType");
          const format = gen.let("format");
          gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef));
          cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
          function unknownFmt() {
            if (opts.strictSchema === false)
              return codegen_1.nil;
            return (0, codegen_1._)`${schemaCode} && !${format}`;
          }
          __name(unknownFmt, "unknownFmt");
          function invalidFmt() {
            const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))` : (0, codegen_1._)`${format}(${data})`;
            const validData = (0, codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
            return (0, codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
          }
          __name(invalidFmt, "invalidFmt");
        }
        __name(validate$DataFormat, "validate$DataFormat");
        function validateFormat() {
          const formatDef = self.formats[schema];
          if (!formatDef) {
            unknownFormat();
            return;
          }
          if (formatDef === true)
            return;
          const [fmtType, format, fmtRef] = getFormat(formatDef);
          if (fmtType === ruleType)
            cxt.pass(validCondition());
          function unknownFormat() {
            if (opts.strictSchema === false) {
              self.logger.warn(unknownMsg());
              return;
            }
            throw new Error(unknownMsg());
            function unknownMsg() {
              return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
            }
            __name(unknownMsg, "unknownMsg");
          }
          __name(unknownFormat, "unknownFormat");
          function getFormat(fmtDef) {
            const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema)}` : void 0;
            const fmt = gen.scopeValue("formats", { key: schema, ref: fmtDef, code });
            if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) {
              return [fmtDef.type || "string", fmtDef.validate, (0, codegen_1._)`${fmt}.validate`];
            }
            return ["string", fmtDef, fmt];
          }
          __name(getFormat, "getFormat");
          function validCondition() {
            if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
              if (!schemaEnv.$async)
                throw new Error("async format in sync schema");
              return (0, codegen_1._)`await ${fmtRef}(${data})`;
            }
            return typeof format == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
          }
          __name(validCondition, "validCondition");
        }
        __name(validateFormat, "validateFormat");
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/format/index.js
var require_format2 = __commonJS({
  "node_modules/ajv/dist/vocabularies/format/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var format_1 = require_format();
    var format = [format_1.default];
    exports.default = format;
  }
});

// node_modules/ajv/dist/vocabularies/metadata.js
var require_metadata = __commonJS({
  "node_modules/ajv/dist/vocabularies/metadata.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.contentVocabulary = exports.metadataVocabulary = void 0;
    exports.metadataVocabulary = [
      "title",
      "description",
      "default",
      "deprecated",
      "readOnly",
      "writeOnly",
      "examples"
    ];
    exports.contentVocabulary = [
      "contentMediaType",
      "contentEncoding",
      "contentSchema"
    ];
  }
});

// node_modules/ajv/dist/vocabularies/draft7.js
var require_draft7 = __commonJS({
  "node_modules/ajv/dist/vocabularies/draft7.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require_core2();
    var validation_1 = require_validation();
    var applicator_1 = require_applicator();
    var format_1 = require_format2();
    var metadata_1 = require_metadata();
    var draft7Vocabularies = [
      core_1.default,
      validation_1.default,
      (0, applicator_1.default)(),
      format_1.default,
      metadata_1.metadataVocabulary,
      metadata_1.contentVocabulary
    ];
    exports.default = draft7Vocabularies;
  }
});

// node_modules/ajv/dist/vocabularies/discriminator/types.js
var require_types = __commonJS({
  "node_modules/ajv/dist/vocabularies/discriminator/types.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiscrError = void 0;
    var DiscrError;
    (function(DiscrError2) {
      DiscrError2["Tag"] = "tag";
      DiscrError2["Mapping"] = "mapping";
    })(DiscrError || (exports.DiscrError = DiscrError = {}));
  }
});

// node_modules/ajv/dist/vocabularies/discriminator/index.js
var require_discriminator = __commonJS({
  "node_modules/ajv/dist/vocabularies/discriminator/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var types_1 = require_types();
    var compile_1 = require_compile();
    var ref_error_1 = require_ref_error();
    var util_1 = require_util();
    var error2 = {
      message: /* @__PURE__ */ __name(({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`, "message"),
      params: /* @__PURE__ */ __name(({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`, "params")
    };
    var def = {
      keyword: "discriminator",
      type: "object",
      schemaType: "object",
      error: error2,
      code(cxt) {
        const { gen, data, schema, parentSchema, it } = cxt;
        const { oneOf } = parentSchema;
        if (!it.opts.discriminator) {
          throw new Error("discriminator: requires discriminator option");
        }
        const tagName = schema.propertyName;
        if (typeof tagName != "string")
          throw new Error("discriminator: requires propertyName");
        if (schema.mapping)
          throw new Error("discriminator: mapping is not supported");
        if (!oneOf)
          throw new Error("discriminator: requires oneOf keyword");
        const valid = gen.let("valid", false);
        const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`);
        gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, { discrError: types_1.DiscrError.Tag, tag, tagName }));
        cxt.ok(valid);
        function validateMapping() {
          const mapping = getMapping();
          gen.if(false);
          for (const tagValue in mapping) {
            gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
            gen.assign(valid, applyTagSchema(mapping[tagValue]));
          }
          gen.else();
          cxt.error(false, { discrError: types_1.DiscrError.Mapping, tag, tagName });
          gen.endIf();
        }
        __name(validateMapping, "validateMapping");
        function applyTagSchema(schemaProp) {
          const _valid = gen.name("valid");
          const schCxt = cxt.subschema({ keyword: "oneOf", schemaProp }, _valid);
          cxt.mergeEvaluated(schCxt, codegen_1.Name);
          return _valid;
        }
        __name(applyTagSchema, "applyTagSchema");
        function getMapping() {
          var _a3;
          const oneOfMapping = {};
          const topRequired = hasRequired(parentSchema);
          let tagRequired = true;
          for (let i = 0; i < oneOf.length; i++) {
            let sch = oneOf[i];
            if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
              const ref = sch.$ref;
              sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, ref);
              if (sch instanceof compile_1.SchemaEnv)
                sch = sch.schema;
              if (sch === void 0)
                throw new ref_error_1.default(it.opts.uriResolver, it.baseId, ref);
            }
            const propSch = (_a3 = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a3 === void 0 ? void 0 : _a3[tagName];
            if (typeof propSch != "object") {
              throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
            }
            tagRequired = tagRequired && (topRequired || hasRequired(sch));
            addMappings(propSch, i);
          }
          if (!tagRequired)
            throw new Error(`discriminator: "${tagName}" must be required`);
          return oneOfMapping;
          function hasRequired({ required: required2 }) {
            return Array.isArray(required2) && required2.includes(tagName);
          }
          __name(hasRequired, "hasRequired");
          function addMappings(sch, i) {
            if (sch.const) {
              addMapping(sch.const, i);
            } else if (sch.enum) {
              for (const tagValue of sch.enum) {
                addMapping(tagValue, i);
              }
            } else {
              throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
            }
          }
          __name(addMappings, "addMappings");
          function addMapping(tagValue, i) {
            if (typeof tagValue != "string" || tagValue in oneOfMapping) {
              throw new Error(`discriminator: "${tagName}" values must be unique strings`);
            }
            oneOfMapping[tagValue] = i;
          }
          __name(addMapping, "addMapping");
        }
        __name(getMapping, "getMapping");
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/refs/json-schema-draft-07.json
var require_json_schema_draft_07 = __commonJS({
  "node_modules/ajv/dist/refs/json-schema-draft-07.json"(exports, module) {
    module.exports = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://json-schema.org/draft-07/schema#",
      title: "Core schema meta-schema",
      definitions: {
        schemaArray: {
          type: "array",
          minItems: 1,
          items: { $ref: "#" }
        },
        nonNegativeInteger: {
          type: "integer",
          minimum: 0
        },
        nonNegativeIntegerDefault0: {
          allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }]
        },
        simpleTypes: {
          enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
        },
        stringArray: {
          type: "array",
          items: { type: "string" },
          uniqueItems: true,
          default: []
        }
      },
      type: ["object", "boolean"],
      properties: {
        $id: {
          type: "string",
          format: "uri-reference"
        },
        $schema: {
          type: "string",
          format: "uri"
        },
        $ref: {
          type: "string",
          format: "uri-reference"
        },
        $comment: {
          type: "string"
        },
        title: {
          type: "string"
        },
        description: {
          type: "string"
        },
        default: true,
        readOnly: {
          type: "boolean",
          default: false
        },
        examples: {
          type: "array",
          items: true
        },
        multipleOf: {
          type: "number",
          exclusiveMinimum: 0
        },
        maximum: {
          type: "number"
        },
        exclusiveMaximum: {
          type: "number"
        },
        minimum: {
          type: "number"
        },
        exclusiveMinimum: {
          type: "number"
        },
        maxLength: { $ref: "#/definitions/nonNegativeInteger" },
        minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        pattern: {
          type: "string",
          format: "regex"
        },
        additionalItems: { $ref: "#" },
        items: {
          anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }],
          default: true
        },
        maxItems: { $ref: "#/definitions/nonNegativeInteger" },
        minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        uniqueItems: {
          type: "boolean",
          default: false
        },
        contains: { $ref: "#" },
        maxProperties: { $ref: "#/definitions/nonNegativeInteger" },
        minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        required: { $ref: "#/definitions/stringArray" },
        additionalProperties: { $ref: "#" },
        definitions: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        properties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        patternProperties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          propertyNames: { format: "regex" },
          default: {}
        },
        dependencies: {
          type: "object",
          additionalProperties: {
            anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }]
          }
        },
        propertyNames: { $ref: "#" },
        const: true,
        enum: {
          type: "array",
          items: true,
          minItems: 1,
          uniqueItems: true
        },
        type: {
          anyOf: [
            { $ref: "#/definitions/simpleTypes" },
            {
              type: "array",
              items: { $ref: "#/definitions/simpleTypes" },
              minItems: 1,
              uniqueItems: true
            }
          ]
        },
        format: { type: "string" },
        contentMediaType: { type: "string" },
        contentEncoding: { type: "string" },
        if: { $ref: "#" },
        then: { $ref: "#" },
        else: { $ref: "#" },
        allOf: { $ref: "#/definitions/schemaArray" },
        anyOf: { $ref: "#/definitions/schemaArray" },
        oneOf: { $ref: "#/definitions/schemaArray" },
        not: { $ref: "#" }
      },
      default: true
    };
  }
});

// node_modules/ajv/dist/ajv.js
var require_ajv = __commonJS({
  "node_modules/ajv/dist/ajv.js"(exports, module) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv = void 0;
    var core_1 = require_core();
    var draft7_1 = require_draft7();
    var discriminator_1 = require_discriminator();
    var draft7MetaSchema = require_json_schema_draft_07();
    var META_SUPPORT_DATA = ["/properties"];
    var META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
    var Ajv2 = class extends core_1.default {
      static {
        __name(this, "Ajv");
      }
      _addVocabularies() {
        super._addVocabularies();
        draft7_1.default.forEach((v) => this.addVocabulary(v));
        if (this.opts.discriminator)
          this.addKeyword(discriminator_1.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        if (!this.opts.meta)
          return;
        const metaSchema = this.opts.$data ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA) : draft7MetaSchema;
        this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
        this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
      }
    };
    exports.Ajv = Ajv2;
    module.exports = exports = Ajv2;
    module.exports.Ajv = Ajv2;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Ajv2;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return validate_1.KeywordCxt;
    }, "get") });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return codegen_1._;
    }, "get") });
    Object.defineProperty(exports, "str", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return codegen_1.str;
    }, "get") });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return codegen_1.stringify;
    }, "get") });
    Object.defineProperty(exports, "nil", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return codegen_1.nil;
    }, "get") });
    Object.defineProperty(exports, "Name", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return codegen_1.Name;
    }, "get") });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return codegen_1.CodeGen;
    }, "get") });
    var validation_error_1 = require_validation_error();
    Object.defineProperty(exports, "ValidationError", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return validation_error_1.default;
    }, "get") });
    var ref_error_1 = require_ref_error();
    Object.defineProperty(exports, "MissingRefError", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return ref_error_1.default;
    }, "get") });
  }
});

// node_modules/ajv-formats/dist/formats.js
var require_formats = __commonJS({
  "node_modules/ajv-formats/dist/formats.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatNames = exports.fastFormats = exports.fullFormats = void 0;
    function fmtDef(validate, compare) {
      return { validate, compare };
    }
    __name(fmtDef, "fmtDef");
    exports.fullFormats = {
      // date: http://tools.ietf.org/html/rfc3339#section-5.6
      date: fmtDef(date3, compareDate),
      // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
      time: fmtDef(getTime(true), compareTime),
      "date-time": fmtDef(getDateTime(true), compareDateTime),
      "iso-time": fmtDef(getTime(), compareIsoTime),
      "iso-date-time": fmtDef(getDateTime(), compareIsoDateTime),
      // duration: https://tools.ietf.org/html/rfc3339#appendix-A
      duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
      uri,
      "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
      // uri-template: https://tools.ietf.org/html/rfc6570
      "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
      // For the source: https://gist.github.com/dperini/729294
      // For test cases: https://mathiasbynens.be/demo/url-regex
      url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
      email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
      hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
      // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
      ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
      ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
      regex,
      // uuid: http://tools.ietf.org/html/rfc4122
      uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
      // JSON-pointer: https://tools.ietf.org/html/rfc6901
      // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
      "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
      "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
      // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
      "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
      // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
      // byte: https://github.com/miguelmota/is-base64
      byte,
      // signed 32 bit integer
      int32: { type: "number", validate: validateInt32 },
      // signed 64 bit integer
      int64: { type: "number", validate: validateInt64 },
      // C-type float
      float: { type: "number", validate: validateNumber },
      // C-type double
      double: { type: "number", validate: validateNumber },
      // hint to the UI to hide input strings
      password: true,
      // unchecked string payload
      binary: true
    };
    exports.fastFormats = {
      ...exports.fullFormats,
      date: fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, compareDate),
      time: fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareTime),
      "date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareDateTime),
      "iso-time": fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoTime),
      "iso-date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoDateTime),
      // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
      uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
      "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
      // email (sources from jsen validator):
      // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
      // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
      email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
    };
    exports.formatNames = Object.keys(exports.fullFormats);
    function isLeapYear(year) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }
    __name(isLeapYear, "isLeapYear");
    var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
    var DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function date3(str) {
      const matches = DATE.exec(str);
      if (!matches)
        return false;
      const year = +matches[1];
      const month = +matches[2];
      const day = +matches[3];
      return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && isLeapYear(year) ? 29 : DAYS[month]);
    }
    __name(date3, "date");
    function compareDate(d1, d2) {
      if (!(d1 && d2))
        return void 0;
      if (d1 > d2)
        return 1;
      if (d1 < d2)
        return -1;
      return 0;
    }
    __name(compareDate, "compareDate");
    var TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
    function getTime(strictTimeZone) {
      return /* @__PURE__ */ __name(function time3(str) {
        const matches = TIME.exec(str);
        if (!matches)
          return false;
        const hr = +matches[1];
        const min = +matches[2];
        const sec = +matches[3];
        const tz = matches[4];
        const tzSign = matches[5] === "-" ? -1 : 1;
        const tzH = +(matches[6] || 0);
        const tzM = +(matches[7] || 0);
        if (tzH > 23 || tzM > 59 || strictTimeZone && !tz)
          return false;
        if (hr <= 23 && min <= 59 && sec < 60)
          return true;
        const utcMin = min - tzM * tzSign;
        const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0);
        return (utcHr === 23 || utcHr === -1) && (utcMin === 59 || utcMin === -1) && sec < 61;
      }, "time");
    }
    __name(getTime, "getTime");
    function compareTime(s1, s2) {
      if (!(s1 && s2))
        return void 0;
      const t1 = (/* @__PURE__ */ new Date("2020-01-01T" + s1)).valueOf();
      const t2 = (/* @__PURE__ */ new Date("2020-01-01T" + s2)).valueOf();
      if (!(t1 && t2))
        return void 0;
      return t1 - t2;
    }
    __name(compareTime, "compareTime");
    function compareIsoTime(t1, t2) {
      if (!(t1 && t2))
        return void 0;
      const a1 = TIME.exec(t1);
      const a2 = TIME.exec(t2);
      if (!(a1 && a2))
        return void 0;
      t1 = a1[1] + a1[2] + a1[3];
      t2 = a2[1] + a2[2] + a2[3];
      if (t1 > t2)
        return 1;
      if (t1 < t2)
        return -1;
      return 0;
    }
    __name(compareIsoTime, "compareIsoTime");
    var DATE_TIME_SEPARATOR = /t|\s/i;
    function getDateTime(strictTimeZone) {
      const time3 = getTime(strictTimeZone);
      return /* @__PURE__ */ __name(function date_time(str) {
        const dateTime = str.split(DATE_TIME_SEPARATOR);
        return dateTime.length === 2 && date3(dateTime[0]) && time3(dateTime[1]);
      }, "date_time");
    }
    __name(getDateTime, "getDateTime");
    function compareDateTime(dt1, dt2) {
      if (!(dt1 && dt2))
        return void 0;
      const d1 = new Date(dt1).valueOf();
      const d2 = new Date(dt2).valueOf();
      if (!(d1 && d2))
        return void 0;
      return d1 - d2;
    }
    __name(compareDateTime, "compareDateTime");
    function compareIsoDateTime(dt1, dt2) {
      if (!(dt1 && dt2))
        return void 0;
      const [d1, t1] = dt1.split(DATE_TIME_SEPARATOR);
      const [d2, t2] = dt2.split(DATE_TIME_SEPARATOR);
      const res = compareDate(d1, d2);
      if (res === void 0)
        return void 0;
      return res || compareTime(t1, t2);
    }
    __name(compareIsoDateTime, "compareIsoDateTime");
    var NOT_URI_FRAGMENT = /\/|:/;
    var URI = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
    function uri(str) {
      return NOT_URI_FRAGMENT.test(str) && URI.test(str);
    }
    __name(uri, "uri");
    var BYTE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
    function byte(str) {
      BYTE.lastIndex = 0;
      return BYTE.test(str);
    }
    __name(byte, "byte");
    var MIN_INT32 = -(2 ** 31);
    var MAX_INT32 = 2 ** 31 - 1;
    function validateInt32(value) {
      return Number.isInteger(value) && value <= MAX_INT32 && value >= MIN_INT32;
    }
    __name(validateInt32, "validateInt32");
    function validateInt64(value) {
      return Number.isInteger(value);
    }
    __name(validateInt64, "validateInt64");
    function validateNumber() {
      return true;
    }
    __name(validateNumber, "validateNumber");
    var Z_ANCHOR = /[^\\]\\Z/;
    function regex(str) {
      if (Z_ANCHOR.test(str))
        return false;
      try {
        new RegExp(str);
        return true;
      } catch (e) {
        return false;
      }
    }
    __name(regex, "regex");
  }
});

// node_modules/ajv-formats/dist/limit.js
var require_limit = __commonJS({
  "node_modules/ajv-formats/dist/limit.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatLimitDefinition = void 0;
    var ajv_1 = require_ajv();
    var codegen_1 = require_codegen();
    var ops = codegen_1.operators;
    var KWDs = {
      formatMaximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      formatMinimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      formatExclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      formatExclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
    };
    var error2 = {
      message: /* @__PURE__ */ __name(({ keyword, schemaCode }) => (0, codegen_1.str)`should be ${KWDs[keyword].okStr} ${schemaCode}`, "message"),
      params: /* @__PURE__ */ __name(({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`, "params")
    };
    exports.formatLimitDefinition = {
      keyword: Object.keys(KWDs),
      type: "string",
      schemaType: "string",
      $data: true,
      error: error2,
      code(cxt) {
        const { gen, data, schemaCode, keyword, it } = cxt;
        const { opts, self } = it;
        if (!opts.validateFormats)
          return;
        const fCxt = new ajv_1.KeywordCxt(it, self.RULES.all.format.definition, "format");
        if (fCxt.$data)
          validate$DataFormat();
        else
          validateFormat();
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self.formats,
            code: opts.code.formats
          });
          const fmt = gen.const("fmt", (0, codegen_1._)`${fmts}[${fCxt.schemaCode}]`);
          cxt.fail$data((0, codegen_1.or)((0, codegen_1._)`typeof ${fmt} != "object"`, (0, codegen_1._)`${fmt} instanceof RegExp`, (0, codegen_1._)`typeof ${fmt}.compare != "function"`, compareCode(fmt)));
        }
        __name(validate$DataFormat, "validate$DataFormat");
        function validateFormat() {
          const format = fCxt.schema;
          const fmtDef = self.formats[format];
          if (!fmtDef || fmtDef === true)
            return;
          if (typeof fmtDef != "object" || fmtDef instanceof RegExp || typeof fmtDef.compare != "function") {
            throw new Error(`"${keyword}": format "${format}" does not define "compare" function`);
          }
          const fmt = gen.scopeValue("formats", {
            key: format,
            ref: fmtDef,
            code: opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(format)}` : void 0
          });
          cxt.fail$data(compareCode(fmt));
        }
        __name(validateFormat, "validateFormat");
        function compareCode(fmt) {
          return (0, codegen_1._)`${fmt}.compare(${data}, ${schemaCode}) ${KWDs[keyword].fail} 0`;
        }
        __name(compareCode, "compareCode");
      },
      dependencies: ["format"]
    };
    var formatLimitPlugin = /* @__PURE__ */ __name((ajv) => {
      ajv.addKeyword(exports.formatLimitDefinition);
      return ajv;
    }, "formatLimitPlugin");
    exports.default = formatLimitPlugin;
  }
});

// node_modules/ajv-formats/dist/index.js
var require_dist = __commonJS({
  "node_modules/ajv-formats/dist/index.js"(exports, module) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var formats_1 = require_formats();
    var limit_1 = require_limit();
    var codegen_1 = require_codegen();
    var fullName = new codegen_1.Name("fullFormats");
    var fastName = new codegen_1.Name("fastFormats");
    var formatsPlugin = /* @__PURE__ */ __name((ajv, opts = { keywords: true }) => {
      if (Array.isArray(opts)) {
        addFormats(ajv, opts, formats_1.fullFormats, fullName);
        return ajv;
      }
      const [formats, exportName] = opts.mode === "fast" ? [formats_1.fastFormats, fastName] : [formats_1.fullFormats, fullName];
      const list = opts.formats || formats_1.formatNames;
      addFormats(ajv, list, formats, exportName);
      if (opts.keywords)
        (0, limit_1.default)(ajv);
      return ajv;
    }, "formatsPlugin");
    formatsPlugin.get = (name, mode = "full") => {
      const formats = mode === "fast" ? formats_1.fastFormats : formats_1.fullFormats;
      const f = formats[name];
      if (!f)
        throw new Error(`Unknown format "${name}"`);
      return f;
    };
    function addFormats(ajv, list, fs, exportName) {
      var _a3;
      var _b;
      (_a3 = (_b = ajv.opts.code).formats) !== null && _a3 !== void 0 ? _a3 : _b.formats = (0, codegen_1._)`require("ajv-formats/dist/formats").${exportName}`;
      for (const f of list)
        ajv.addFormat(f, fs[f]);
    }
    __name(addFormats, "addFormats");
    module.exports = exports = formatsPlugin;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = formatsPlugin;
  }
});

// .wrangler/tmp/bundle-EuOp2A/middleware-loader.entry.ts
init_modules_watch_stub();

// .wrangler/tmp/bundle-EuOp2A/middleware-insertion-facade.js
init_modules_watch_stub();

// worker/index.js
init_modules_watch_stub();

// worker/mcp.js
init_modules_watch_stub();

// node_modules/@modelcontextprotocol/sdk/dist/esm/server/index.js
init_modules_watch_stub();

// node_modules/@modelcontextprotocol/sdk/dist/esm/shared/protocol.js
init_modules_watch_stub();

// node_modules/@modelcontextprotocol/sdk/dist/esm/server/zod-compat.js
init_modules_watch_stub();

// node_modules/zod/v4/core/index.js
init_modules_watch_stub();

// node_modules/zod/v4/core/core.js
init_modules_watch_stub();
var _a;
// @__NO_SIDE_EFFECTS__
function $constructor(name, initializer3, params) {
  function init(inst, def) {
    if (!inst._zod) {
      Object.defineProperty(inst, "_zod", {
        value: {
          def,
          constr: _,
          traits: /* @__PURE__ */ new Set()
        },
        enumerable: false
      });
    }
    if (inst._zod.traits.has(name)) {
      return;
    }
    inst._zod.traits.add(name);
    initializer3(inst, def);
    const proto = _.prototype;
    const keys = Object.keys(proto);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (!(k in inst)) {
        inst[k] = proto[k].bind(inst);
      }
    }
  }
  __name(init, "init");
  const Parent = params?.Parent ?? Object;
  class Definition extends Parent {
    static {
      __name(this, "Definition");
    }
  }
  Object.defineProperty(Definition, "name", { value: name });
  function _(def) {
    var _a3;
    const inst = params?.Parent ? new Definition() : this;
    init(inst, def);
    (_a3 = inst._zod).deferred ?? (_a3.deferred = []);
    for (const fn of inst._zod.deferred) {
      fn();
    }
    return inst;
  }
  __name(_, "_");
  Object.defineProperty(_, "init", { value: init });
  Object.defineProperty(_, Symbol.hasInstance, {
    value: /* @__PURE__ */ __name((inst) => {
      if (params?.Parent && inst instanceof params.Parent)
        return true;
      return inst?._zod?.traits?.has(name);
    }, "value")
  });
  Object.defineProperty(_, "name", { value: name });
  return _;
}
__name($constructor, "$constructor");
var $ZodAsyncError = class extends Error {
  static {
    __name(this, "$ZodAsyncError");
  }
  constructor() {
    super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
  }
};
var $ZodEncodeError = class extends Error {
  static {
    __name(this, "$ZodEncodeError");
  }
  constructor(name) {
    super(`Encountered unidirectional transform during encode: ${name}`);
    this.name = "ZodEncodeError";
  }
};
(_a = globalThis).__zod_globalConfig ?? (_a.__zod_globalConfig = {});
var globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
  if (newConfig)
    Object.assign(globalConfig, newConfig);
  return globalConfig;
}
__name(config, "config");

// node_modules/zod/v4/core/parse.js
init_modules_watch_stub();

// node_modules/zod/v4/core/errors.js
init_modules_watch_stub();

// node_modules/zod/v4/core/util.js
var util_exports = {};
__export(util_exports, {
  BIGINT_FORMAT_RANGES: () => BIGINT_FORMAT_RANGES,
  Class: () => Class,
  NUMBER_FORMAT_RANGES: () => NUMBER_FORMAT_RANGES,
  aborted: () => aborted,
  allowsEval: () => allowsEval,
  assert: () => assert,
  assertEqual: () => assertEqual,
  assertIs: () => assertIs,
  assertNever: () => assertNever,
  assertNotEqual: () => assertNotEqual,
  assignProp: () => assignProp,
  base64ToUint8Array: () => base64ToUint8Array,
  base64urlToUint8Array: () => base64urlToUint8Array,
  cached: () => cached,
  captureStackTrace: () => captureStackTrace,
  cleanEnum: () => cleanEnum,
  cleanRegex: () => cleanRegex,
  clone: () => clone,
  cloneDef: () => cloneDef,
  createTransparentProxy: () => createTransparentProxy,
  defineLazy: () => defineLazy,
  esc: () => esc,
  escapeRegex: () => escapeRegex,
  explicitlyAborted: () => explicitlyAborted,
  extend: () => extend,
  finalizeIssue: () => finalizeIssue,
  floatSafeRemainder: () => floatSafeRemainder,
  getElementAtPath: () => getElementAtPath,
  getEnumValues: () => getEnumValues,
  getLengthableOrigin: () => getLengthableOrigin,
  getParsedType: () => getParsedType,
  getSizableOrigin: () => getSizableOrigin,
  hexToUint8Array: () => hexToUint8Array,
  isObject: () => isObject,
  isPlainObject: () => isPlainObject,
  issue: () => issue,
  joinValues: () => joinValues,
  jsonStringifyReplacer: () => jsonStringifyReplacer,
  merge: () => merge,
  mergeDefs: () => mergeDefs,
  normalizeParams: () => normalizeParams,
  nullish: () => nullish,
  numKeys: () => numKeys,
  objectClone: () => objectClone,
  omit: () => omit,
  optionalKeys: () => optionalKeys,
  parsedType: () => parsedType,
  partial: () => partial,
  pick: () => pick,
  prefixIssues: () => prefixIssues,
  primitiveTypes: () => primitiveTypes,
  promiseAllObject: () => promiseAllObject,
  propertyKeyTypes: () => propertyKeyTypes,
  randomString: () => randomString,
  required: () => required,
  safeExtend: () => safeExtend,
  shallowClone: () => shallowClone,
  slugify: () => slugify,
  stringifyPrimitive: () => stringifyPrimitive,
  uint8ArrayToBase64: () => uint8ArrayToBase64,
  uint8ArrayToBase64url: () => uint8ArrayToBase64url,
  uint8ArrayToHex: () => uint8ArrayToHex,
  unwrapMessage: () => unwrapMessage
});
init_modules_watch_stub();
function assertEqual(val) {
  return val;
}
__name(assertEqual, "assertEqual");
function assertNotEqual(val) {
  return val;
}
__name(assertNotEqual, "assertNotEqual");
function assertIs(_arg) {
}
__name(assertIs, "assertIs");
function assertNever(_x) {
  throw new Error("Unexpected value in exhaustive check");
}
__name(assertNever, "assertNever");
function assert(_) {
}
__name(assert, "assert");
function getEnumValues(entries) {
  const numericValues = Object.values(entries).filter((v) => typeof v === "number");
  const values = Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
  return values;
}
__name(getEnumValues, "getEnumValues");
function joinValues(array2, separator = "|") {
  return array2.map((val) => stringifyPrimitive(val)).join(separator);
}
__name(joinValues, "joinValues");
function jsonStringifyReplacer(_, value) {
  if (typeof value === "bigint")
    return value.toString();
  return value;
}
__name(jsonStringifyReplacer, "jsonStringifyReplacer");
function cached(getter) {
  const set = false;
  return {
    get value() {
      if (!set) {
        const value = getter();
        Object.defineProperty(this, "value", { value });
        return value;
      }
      throw new Error("cached value already set");
    }
  };
}
__name(cached, "cached");
function nullish(input) {
  return input === null || input === void 0;
}
__name(nullish, "nullish");
function cleanRegex(source) {
  const start = source.startsWith("^") ? 1 : 0;
  const end = source.endsWith("$") ? source.length - 1 : source.length;
  return source.slice(start, end);
}
__name(cleanRegex, "cleanRegex");
function floatSafeRemainder(val, step) {
  const ratio = val / step;
  const roundedRatio = Math.round(ratio);
  const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
  if (Math.abs(ratio - roundedRatio) < tolerance)
    return 0;
  return ratio - roundedRatio;
}
__name(floatSafeRemainder, "floatSafeRemainder");
var EVALUATING = /* @__PURE__ */ Symbol("evaluating");
function defineLazy(object3, key, getter) {
  let value = void 0;
  Object.defineProperty(object3, key, {
    get() {
      if (value === EVALUATING) {
        return void 0;
      }
      if (value === void 0) {
        value = EVALUATING;
        value = getter();
      }
      return value;
    },
    set(v) {
      Object.defineProperty(object3, key, {
        value: v
        // configurable: true,
      });
    },
    configurable: true
  });
}
__name(defineLazy, "defineLazy");
function objectClone(obj) {
  return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
}
__name(objectClone, "objectClone");
function assignProp(target, prop, value) {
  Object.defineProperty(target, prop, {
    value,
    writable: true,
    enumerable: true,
    configurable: true
  });
}
__name(assignProp, "assignProp");
function mergeDefs(...defs) {
  const mergedDescriptors = {};
  for (const def of defs) {
    const descriptors = Object.getOwnPropertyDescriptors(def);
    Object.assign(mergedDescriptors, descriptors);
  }
  return Object.defineProperties({}, mergedDescriptors);
}
__name(mergeDefs, "mergeDefs");
function cloneDef(schema) {
  return mergeDefs(schema._zod.def);
}
__name(cloneDef, "cloneDef");
function getElementAtPath(obj, path) {
  if (!path)
    return obj;
  return path.reduce((acc, key) => acc?.[key], obj);
}
__name(getElementAtPath, "getElementAtPath");
function promiseAllObject(promisesObj) {
  const keys = Object.keys(promisesObj);
  const promises = keys.map((key) => promisesObj[key]);
  return Promise.all(promises).then((results) => {
    const resolvedObj = {};
    for (let i = 0; i < keys.length; i++) {
      resolvedObj[keys[i]] = results[i];
    }
    return resolvedObj;
  });
}
__name(promiseAllObject, "promiseAllObject");
function randomString(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}
__name(randomString, "randomString");
function esc(str) {
  return JSON.stringify(str);
}
__name(esc, "esc");
function slugify(input) {
  return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
__name(slugify, "slugify");
var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {
};
function isObject(data) {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
__name(isObject, "isObject");
var allowsEval = /* @__PURE__ */ cached(() => {
  if (globalConfig.jitless) {
    return false;
  }
  if (typeof navigator !== "undefined" && "Cloudflare-Workers"?.includes("Cloudflare")) {
    return false;
  }
  try {
    const F = Function;
    new F("");
    return true;
  } catch (_) {
    return false;
  }
});
function isPlainObject(o) {
  if (isObject(o) === false)
    return false;
  const ctor = o.constructor;
  if (ctor === void 0)
    return true;
  if (typeof ctor !== "function")
    return true;
  const prot = ctor.prototype;
  if (isObject(prot) === false)
    return false;
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
    return false;
  }
  return true;
}
__name(isPlainObject, "isPlainObject");
function shallowClone(o) {
  if (isPlainObject(o))
    return { ...o };
  if (Array.isArray(o))
    return [...o];
  if (o instanceof Map)
    return new Map(o);
  if (o instanceof Set)
    return new Set(o);
  return o;
}
__name(shallowClone, "shallowClone");
function numKeys(data) {
  let keyCount = 0;
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      keyCount++;
    }
  }
  return keyCount;
}
__name(numKeys, "numKeys");
var getParsedType = /* @__PURE__ */ __name((data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return "undefined";
    case "string":
      return "string";
    case "number":
      return Number.isNaN(data) ? "nan" : "number";
    case "boolean":
      return "boolean";
    case "function":
      return "function";
    case "bigint":
      return "bigint";
    case "symbol":
      return "symbol";
    case "object":
      if (Array.isArray(data)) {
        return "array";
      }
      if (data === null) {
        return "null";
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return "promise";
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return "map";
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return "set";
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return "date";
      }
      if (typeof File !== "undefined" && data instanceof File) {
        return "file";
      }
      return "object";
    default:
      throw new Error(`Unknown data type: ${t}`);
  }
}, "getParsedType");
var propertyKeyTypes = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
var primitiveTypes = /* @__PURE__ */ new Set([
  "string",
  "number",
  "bigint",
  "boolean",
  "symbol",
  "undefined"
]);
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
__name(escapeRegex, "escapeRegex");
function clone(inst, def, params) {
  const cl = new inst._zod.constr(def ?? inst._zod.def);
  if (!def || params?.parent)
    cl._zod.parent = inst;
  return cl;
}
__name(clone, "clone");
function normalizeParams(_params) {
  const params = _params;
  if (!params)
    return {};
  if (typeof params === "string")
    return { error: /* @__PURE__ */ __name(() => params, "error") };
  if (params?.message !== void 0) {
    if (params?.error !== void 0)
      throw new Error("Cannot specify both `message` and `error` params");
    params.error = params.message;
  }
  delete params.message;
  if (typeof params.error === "string")
    return { ...params, error: /* @__PURE__ */ __name(() => params.error, "error") };
  return params;
}
__name(normalizeParams, "normalizeParams");
function createTransparentProxy(getter) {
  let target;
  return new Proxy({}, {
    get(_, prop, receiver) {
      target ?? (target = getter());
      return Reflect.get(target, prop, receiver);
    },
    set(_, prop, value, receiver) {
      target ?? (target = getter());
      return Reflect.set(target, prop, value, receiver);
    },
    has(_, prop) {
      target ?? (target = getter());
      return Reflect.has(target, prop);
    },
    deleteProperty(_, prop) {
      target ?? (target = getter());
      return Reflect.deleteProperty(target, prop);
    },
    ownKeys(_) {
      target ?? (target = getter());
      return Reflect.ownKeys(target);
    },
    getOwnPropertyDescriptor(_, prop) {
      target ?? (target = getter());
      return Reflect.getOwnPropertyDescriptor(target, prop);
    },
    defineProperty(_, prop, descriptor) {
      target ?? (target = getter());
      return Reflect.defineProperty(target, prop, descriptor);
    }
  });
}
__name(createTransparentProxy, "createTransparentProxy");
function stringifyPrimitive(value) {
  if (typeof value === "bigint")
    return value.toString() + "n";
  if (typeof value === "string")
    return `"${value}"`;
  return `${value}`;
}
__name(stringifyPrimitive, "stringifyPrimitive");
function optionalKeys(shape) {
  return Object.keys(shape).filter((k) => {
    return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
  });
}
__name(optionalKeys, "optionalKeys");
var NUMBER_FORMAT_RANGES = {
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-34028234663852886e22, 34028234663852886e22],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
var BIGINT_FORMAT_RANGES = {
  int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
  uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
};
function pick(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".pick() cannot be used on object schemas containing refinements");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const newShape = {};
      for (const key in mask) {
        if (!(key in currDef.shape)) {
          throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key])
          continue;
        newShape[key] = currDef.shape[key];
      }
      assignProp(this, "shape", newShape);
      return newShape;
    },
    checks: []
  });
  return clone(schema, def);
}
__name(pick, "pick");
function omit(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".omit() cannot be used on object schemas containing refinements");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const newShape = { ...schema._zod.def.shape };
      for (const key in mask) {
        if (!(key in currDef.shape)) {
          throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key])
          continue;
        delete newShape[key];
      }
      assignProp(this, "shape", newShape);
      return newShape;
    },
    checks: []
  });
  return clone(schema, def);
}
__name(omit, "omit");
function extend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to extend: expected a plain object");
  }
  const checks = schema._zod.def.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    const existingShape = schema._zod.def.shape;
    for (const key in shape) {
      if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) {
        throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
      }
    }
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const _shape = { ...schema._zod.def.shape, ...shape };
      assignProp(this, "shape", _shape);
      return _shape;
    }
  });
  return clone(schema, def);
}
__name(extend, "extend");
function safeExtend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to safeExtend: expected a plain object");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const _shape = { ...schema._zod.def.shape, ...shape };
      assignProp(this, "shape", _shape);
      return _shape;
    }
  });
  return clone(schema, def);
}
__name(safeExtend, "safeExtend");
function merge(a, b) {
  if (a._zod.def.checks?.length) {
    throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
  }
  const def = mergeDefs(a._zod.def, {
    get shape() {
      const _shape = { ...a._zod.def.shape, ...b._zod.def.shape };
      assignProp(this, "shape", _shape);
      return _shape;
    },
    get catchall() {
      return b._zod.def.catchall;
    },
    checks: b._zod.def.checks ?? []
  });
  return clone(a, def);
}
__name(merge, "merge");
function partial(Class2, schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".partial() cannot be used on object schemas containing refinements");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const oldShape = schema._zod.def.shape;
      const shape = { ...oldShape };
      if (mask) {
        for (const key in mask) {
          if (!(key in oldShape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key])
            continue;
          shape[key] = Class2 ? new Class2({
            type: "optional",
            innerType: oldShape[key]
          }) : oldShape[key];
        }
      } else {
        for (const key in oldShape) {
          shape[key] = Class2 ? new Class2({
            type: "optional",
            innerType: oldShape[key]
          }) : oldShape[key];
        }
      }
      assignProp(this, "shape", shape);
      return shape;
    },
    checks: []
  });
  return clone(schema, def);
}
__name(partial, "partial");
function required(Class2, schema, mask) {
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const oldShape = schema._zod.def.shape;
      const shape = { ...oldShape };
      if (mask) {
        for (const key in mask) {
          if (!(key in shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key])
            continue;
          shape[key] = new Class2({
            type: "nonoptional",
            innerType: oldShape[key]
          });
        }
      } else {
        for (const key in oldShape) {
          shape[key] = new Class2({
            type: "nonoptional",
            innerType: oldShape[key]
          });
        }
      }
      assignProp(this, "shape", shape);
      return shape;
    }
  });
  return clone(schema, def);
}
__name(required, "required");
function aborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex; i < x.issues.length; i++) {
    if (x.issues[i]?.continue !== true) {
      return true;
    }
  }
  return false;
}
__name(aborted, "aborted");
function explicitlyAborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex; i < x.issues.length; i++) {
    if (x.issues[i]?.continue === false) {
      return true;
    }
  }
  return false;
}
__name(explicitlyAborted, "explicitlyAborted");
function prefixIssues(path, issues) {
  return issues.map((iss) => {
    var _a3;
    (_a3 = iss).path ?? (_a3.path = []);
    iss.path.unshift(path);
    return iss;
  });
}
__name(prefixIssues, "prefixIssues");
function unwrapMessage(message) {
  return typeof message === "string" ? message : message?.message;
}
__name(unwrapMessage, "unwrapMessage");
function finalizeIssue(iss, ctx, config2) {
  const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config2.customError?.(iss)) ?? unwrapMessage(config2.localeError?.(iss)) ?? "Invalid input";
  const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
  rest.path ?? (rest.path = []);
  rest.message = message;
  if (ctx?.reportInput) {
    rest.input = _input;
  }
  return rest;
}
__name(finalizeIssue, "finalizeIssue");
function getSizableOrigin(input) {
  if (input instanceof Set)
    return "set";
  if (input instanceof Map)
    return "map";
  if (input instanceof File)
    return "file";
  return "unknown";
}
__name(getSizableOrigin, "getSizableOrigin");
function getLengthableOrigin(input) {
  if (Array.isArray(input))
    return "array";
  if (typeof input === "string")
    return "string";
  return "unknown";
}
__name(getLengthableOrigin, "getLengthableOrigin");
function parsedType(data) {
  const t = typeof data;
  switch (t) {
    case "number": {
      return Number.isNaN(data) ? "nan" : "number";
    }
    case "object": {
      if (data === null) {
        return "null";
      }
      if (Array.isArray(data)) {
        return "array";
      }
      const obj = data;
      if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) {
        return obj.constructor.name;
      }
    }
  }
  return t;
}
__name(parsedType, "parsedType");
function issue(...args) {
  const [iss, input, inst] = args;
  if (typeof iss === "string") {
    return {
      message: iss,
      code: "custom",
      input,
      inst
    };
  }
  return { ...iss };
}
__name(issue, "issue");
function cleanEnum(obj) {
  return Object.entries(obj).filter(([k, _]) => {
    return Number.isNaN(Number.parseInt(k, 10));
  }).map((el) => el[1]);
}
__name(cleanEnum, "cleanEnum");
function base64ToUint8Array(base642) {
  const binaryString = atob(base642);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
__name(base64ToUint8Array, "base64ToUint8Array");
function uint8ArrayToBase64(bytes) {
  let binaryString = "";
  for (let i = 0; i < bytes.length; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return btoa(binaryString);
}
__name(uint8ArrayToBase64, "uint8ArrayToBase64");
function base64urlToUint8Array(base64url2) {
  const base642 = base64url2.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - base642.length % 4) % 4);
  return base64ToUint8Array(base642 + padding);
}
__name(base64urlToUint8Array, "base64urlToUint8Array");
function uint8ArrayToBase64url(bytes) {
  return uint8ArrayToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
__name(uint8ArrayToBase64url, "uint8ArrayToBase64url");
function hexToUint8Array(hex) {
  const cleanHex = hex.replace(/^0x/, "");
  if (cleanHex.length % 2 !== 0) {
    throw new Error("Invalid hex string length");
  }
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(cleanHex.slice(i, i + 2), 16);
  }
  return bytes;
}
__name(hexToUint8Array, "hexToUint8Array");
function uint8ArrayToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(uint8ArrayToHex, "uint8ArrayToHex");
var Class = class {
  static {
    __name(this, "Class");
  }
  constructor(..._args) {
  }
};

// node_modules/zod/v4/core/errors.js
var initializer = /* @__PURE__ */ __name((inst, def) => {
  inst.name = "$ZodError";
  Object.defineProperty(inst, "_zod", {
    value: inst._zod,
    enumerable: false
  });
  Object.defineProperty(inst, "issues", {
    value: def,
    enumerable: false
  });
  inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
  Object.defineProperty(inst, "toString", {
    value: /* @__PURE__ */ __name(() => inst.message, "value"),
    enumerable: false
  });
}, "initializer");
var $ZodError = $constructor("$ZodError", initializer);
var $ZodRealError = $constructor("$ZodError", initializer, { Parent: Error });
function flattenError(error2, mapper = (issue2) => issue2.message) {
  const fieldErrors = {};
  const formErrors = [];
  for (const sub of error2.issues) {
    if (sub.path.length > 0) {
      fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
      fieldErrors[sub.path[0]].push(mapper(sub));
    } else {
      formErrors.push(mapper(sub));
    }
  }
  return { formErrors, fieldErrors };
}
__name(flattenError, "flattenError");
function formatError(error2, mapper = (issue2) => issue2.message) {
  const fieldErrors = { _errors: [] };
  const processError = /* @__PURE__ */ __name((error3, path = []) => {
    for (const issue2 of error3.issues) {
      if (issue2.code === "invalid_union" && issue2.errors.length) {
        issue2.errors.map((issues) => processError({ issues }, [...path, ...issue2.path]));
      } else if (issue2.code === "invalid_key") {
        processError({ issues: issue2.issues }, [...path, ...issue2.path]);
      } else if (issue2.code === "invalid_element") {
        processError({ issues: issue2.issues }, [...path, ...issue2.path]);
      } else {
        const fullpath = [...path, ...issue2.path];
        if (fullpath.length === 0) {
          fieldErrors._errors.push(mapper(issue2));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < fullpath.length) {
            const el = fullpath[i];
            const terminal = i === fullpath.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue2));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    }
  }, "processError");
  processError(error2);
  return fieldErrors;
}
__name(formatError, "formatError");

// node_modules/zod/v4/core/parse.js
var _parse = /* @__PURE__ */ __name((_Err) => (schema, value, _ctx, _params) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError();
  }
  if (result.issues.length) {
    const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e, _params?.callee);
    throw e;
  }
  return result.value;
}, "_parse");
var _parseAsync = /* @__PURE__ */ __name((_Err) => async (schema, value, _ctx, params) => {
  const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  if (result.issues.length) {
    const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e, params?.callee);
    throw e;
  }
  return result.value;
}, "_parseAsync");
var _safeParse = /* @__PURE__ */ __name((_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError();
  }
  return result.issues.length ? {
    success: false,
    error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: true, data: result.value };
}, "_safeParse");
var safeParse = /* @__PURE__ */ _safeParse($ZodRealError);
var _safeParseAsync = /* @__PURE__ */ __name((_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length ? {
    success: false,
    error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: true, data: result.value };
}, "_safeParseAsync");
var safeParseAsync = /* @__PURE__ */ _safeParseAsync($ZodRealError);
var _encode = /* @__PURE__ */ __name((_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _parse(_Err)(schema, value, ctx);
}, "_encode");
var _decode = /* @__PURE__ */ __name((_Err) => (schema, value, _ctx) => {
  return _parse(_Err)(schema, value, _ctx);
}, "_decode");
var _encodeAsync = /* @__PURE__ */ __name((_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _parseAsync(_Err)(schema, value, ctx);
}, "_encodeAsync");
var _decodeAsync = /* @__PURE__ */ __name((_Err) => async (schema, value, _ctx) => {
  return _parseAsync(_Err)(schema, value, _ctx);
}, "_decodeAsync");
var _safeEncode = /* @__PURE__ */ __name((_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParse(_Err)(schema, value, ctx);
}, "_safeEncode");
var _safeDecode = /* @__PURE__ */ __name((_Err) => (schema, value, _ctx) => {
  return _safeParse(_Err)(schema, value, _ctx);
}, "_safeDecode");
var _safeEncodeAsync = /* @__PURE__ */ __name((_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParseAsync(_Err)(schema, value, ctx);
}, "_safeEncodeAsync");
var _safeDecodeAsync = /* @__PURE__ */ __name((_Err) => async (schema, value, _ctx) => {
  return _safeParseAsync(_Err)(schema, value, _ctx);
}, "_safeDecodeAsync");

// node_modules/zod/v4/core/schemas.js
init_modules_watch_stub();

// node_modules/zod/v4/core/checks.js
init_modules_watch_stub();

// node_modules/zod/v4/core/regexes.js
init_modules_watch_stub();
var cuid = /^[cC][0-9a-z]{6,}$/;
var cuid2 = /^[0-9a-z]+$/;
var ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
var xid = /^[0-9a-vA-V]{20}$/;
var ksuid = /^[A-Za-z0-9]{27}$/;
var nanoid = /^[a-zA-Z0-9_-]{21}$/;
var duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
var guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
var uuid = /* @__PURE__ */ __name((version2) => {
  if (!version2)
    return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
  return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version2}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
}, "uuid");
var email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
var _emoji = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
function emoji() {
  return new RegExp(_emoji, "u");
}
__name(emoji, "emoji");
var ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
var cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
var cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
var base64url = /^[A-Za-z0-9_-]*$/;
var httpProtocol = /^https?$/;
var e164 = /^\+[1-9]\d{6,14}$/;
var dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
var date = /* @__PURE__ */ new RegExp(`^${dateSource}$`);
function timeSource(args) {
  const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
  const regex = typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
  return regex;
}
__name(timeSource, "timeSource");
function time(args) {
  return new RegExp(`^${timeSource(args)}$`);
}
__name(time, "time");
function datetime(args) {
  const time3 = timeSource({ precision: args.precision });
  const opts = ["Z"];
  if (args.local)
    opts.push("");
  if (args.offset)
    opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
  const timeRegex = `${time3}(?:${opts.join("|")})`;
  return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
__name(datetime, "datetime");
var string = /* @__PURE__ */ __name((params) => {
  const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
  return new RegExp(`^${regex}$`);
}, "string");
var integer = /^-?\d+$/;
var number = /^-?\d+(?:\.\d+)?$/;
var boolean = /^(?:true|false)$/i;
var _null = /^null$/i;
var lowercase = /^[^A-Z]*$/;
var uppercase = /^[^a-z]*$/;

// node_modules/zod/v4/core/checks.js
var $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
  var _a3;
  inst._zod ?? (inst._zod = {});
  inst._zod.def = def;
  (_a3 = inst._zod).onattach ?? (_a3.onattach = []);
});
var numericOriginMap = {
  number: "number",
  bigint: "bigint",
  object: "date"
};
var $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  const origin = numericOriginMap[typeof def.value];
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
    if (def.value < curr) {
      if (def.inclusive)
        bag.maximum = def.value;
      else
        bag.exclusiveMaximum = def.value;
    }
  });
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
      return;
    }
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  const origin = numericOriginMap[typeof def.value];
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
    if (def.value > curr) {
      if (def.inclusive)
        bag.minimum = def.value;
      else
        bag.exclusiveMinimum = def.value;
    }
  });
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
      return;
    }
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.onattach.push((inst2) => {
    var _a3;
    (_a3 = inst2._zod.bag).multipleOf ?? (_a3.multipleOf = def.value);
  });
  inst._zod.check = (payload) => {
    if (typeof payload.value !== typeof def.value)
      throw new Error("Cannot mix number and bigint in multiple_of check.");
    const isMultiple = typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0;
    if (isMultiple)
      return;
    payload.issues.push({
      origin: typeof payload.value,
      code: "not_multiple_of",
      divisor: def.value,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def) => {
  $ZodCheck.init(inst, def);
  def.format = def.format || "float64";
  const isInt = def.format?.includes("int");
  const origin = isInt ? "int" : "number";
  const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.format = def.format;
    bag.minimum = minimum;
    bag.maximum = maximum;
    if (isInt)
      bag.pattern = integer;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    if (isInt) {
      if (!Number.isInteger(input)) {
        payload.issues.push({
          expected: origin,
          format: def.format,
          code: "invalid_type",
          continue: false,
          input,
          inst
        });
        return;
      }
      if (!Number.isSafeInteger(input)) {
        if (input > 0) {
          payload.issues.push({
            input,
            code: "too_big",
            maximum: Number.MAX_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: true,
            continue: !def.abort
          });
        } else {
          payload.issues.push({
            input,
            code: "too_small",
            minimum: Number.MIN_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: true,
            continue: !def.abort
          });
        }
        return;
      }
    }
    if (input < minimum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_small",
        minimum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
    if (input > maximum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_big",
        maximum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
  var _a3;
  $ZodCheck.init(inst, def);
  (_a3 = inst._zod.def).when ?? (_a3.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== void 0;
  });
  inst._zod.onattach.push((inst2) => {
    const curr = inst2._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    if (def.maximum < curr)
      inst2._zod.bag.maximum = def.maximum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length <= def.maximum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: def.maximum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
  var _a3;
  $ZodCheck.init(inst, def);
  (_a3 = inst._zod.def).when ?? (_a3.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== void 0;
  });
  inst._zod.onattach.push((inst2) => {
    const curr = inst2._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    if (def.minimum > curr)
      inst2._zod.bag.minimum = def.minimum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length >= def.minimum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: def.minimum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
  var _a3;
  $ZodCheck.init(inst, def);
  (_a3 = inst._zod.def).when ?? (_a3.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== void 0;
  });
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.minimum = def.length;
    bag.maximum = def.length;
    bag.length = def.length;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length === def.length)
      return;
    const origin = getLengthableOrigin(input);
    const tooBig = length > def.length;
    payload.issues.push({
      origin,
      ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length },
      inclusive: true,
      exact: true,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
  var _a3, _b;
  $ZodCheck.init(inst, def);
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.format = def.format;
    if (def.pattern) {
      bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
      bag.patterns.add(def.pattern);
    }
  });
  if (def.pattern)
    (_a3 = inst._zod).check ?? (_a3.check = (payload) => {
      def.pattern.lastIndex = 0;
      if (def.pattern.test(payload.value))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: def.format,
        input: payload.value,
        ...def.pattern ? { pattern: def.pattern.toString() } : {},
        inst,
        continue: !def.abort
      });
    });
  else
    (_b = inst._zod).check ?? (_b.check = () => {
    });
});
var $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    def.pattern.lastIndex = 0;
    if (def.pattern.test(payload.value))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: payload.value,
      pattern: def.pattern.toString(),
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
  def.pattern ?? (def.pattern = lowercase);
  $ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
  def.pattern ?? (def.pattern = uppercase);
  $ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
  $ZodCheck.init(inst, def);
  const escapedRegex = escapeRegex(def.includes);
  const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
  def.pattern = pattern;
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.includes(def.includes, def.position))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: def.includes,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
  def.pattern ?? (def.pattern = pattern);
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.startsWith(def.prefix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: def.prefix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
  def.pattern ?? (def.pattern = pattern);
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.endsWith(def.suffix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: def.suffix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.check = (payload) => {
    payload.value = def.tx(payload.value);
  };
});

// node_modules/zod/v4/core/doc.js
init_modules_watch_stub();
var Doc = class {
  static {
    __name(this, "Doc");
  }
  constructor(args = []) {
    this.content = [];
    this.indent = 0;
    if (this)
      this.args = args;
  }
  indented(fn) {
    this.indent += 1;
    fn(this);
    this.indent -= 1;
  }
  write(arg) {
    if (typeof arg === "function") {
      arg(this, { execution: "sync" });
      arg(this, { execution: "async" });
      return;
    }
    const content = arg;
    const lines = content.split("\n").filter((x) => x);
    const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
    const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
    for (const line of dedented) {
      this.content.push(line);
    }
  }
  compile() {
    const F = Function;
    const args = this?.args;
    const content = this?.content ?? [``];
    const lines = [...content.map((x) => `  ${x}`)];
    return new F(...args, lines.join("\n"));
  }
};

// node_modules/zod/v4/core/versions.js
init_modules_watch_stub();
var version = {
  major: 4,
  minor: 4,
  patch: 3
};

// node_modules/zod/v4/core/schemas.js
var $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
  var _a3;
  inst ?? (inst = {});
  inst._zod.def = def;
  inst._zod.bag = inst._zod.bag || {};
  inst._zod.version = version;
  const checks = [...inst._zod.def.checks ?? []];
  if (inst._zod.traits.has("$ZodCheck")) {
    checks.unshift(inst);
  }
  for (const ch of checks) {
    for (const fn of ch._zod.onattach) {
      fn(inst);
    }
  }
  if (checks.length === 0) {
    (_a3 = inst._zod).deferred ?? (_a3.deferred = []);
    inst._zod.deferred?.push(() => {
      inst._zod.run = inst._zod.parse;
    });
  } else {
    const runChecks = /* @__PURE__ */ __name((payload, checks2, ctx) => {
      let isAborted = aborted(payload);
      let asyncResult;
      for (const ch of checks2) {
        if (ch._zod.def.when) {
          if (explicitlyAborted(payload))
            continue;
          const shouldRun = ch._zod.def.when(payload);
          if (!shouldRun)
            continue;
        } else if (isAborted) {
          continue;
        }
        const currLen = payload.issues.length;
        const _ = ch._zod.check(payload);
        if (_ instanceof Promise && ctx?.async === false) {
          throw new $ZodAsyncError();
        }
        if (asyncResult || _ instanceof Promise) {
          asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
            await _;
            const nextLen = payload.issues.length;
            if (nextLen === currLen)
              return;
            if (!isAborted)
              isAborted = aborted(payload, currLen);
          });
        } else {
          const nextLen = payload.issues.length;
          if (nextLen === currLen)
            continue;
          if (!isAborted)
            isAborted = aborted(payload, currLen);
        }
      }
      if (asyncResult) {
        return asyncResult.then(() => {
          return payload;
        });
      }
      return payload;
    }, "runChecks");
    const handleCanaryResult = /* @__PURE__ */ __name((canary, payload, ctx) => {
      if (aborted(canary)) {
        canary.aborted = true;
        return canary;
      }
      const checkResult = runChecks(payload, checks, ctx);
      if (checkResult instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError();
        return checkResult.then((checkResult2) => inst._zod.parse(checkResult2, ctx));
      }
      return inst._zod.parse(checkResult, ctx);
    }, "handleCanaryResult");
    inst._zod.run = (payload, ctx) => {
      if (ctx.skipChecks) {
        return inst._zod.parse(payload, ctx);
      }
      if (ctx.direction === "backward") {
        const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
        if (canary instanceof Promise) {
          return canary.then((canary2) => {
            return handleCanaryResult(canary2, payload, ctx);
          });
        }
        return handleCanaryResult(canary, payload, ctx);
      }
      const result = inst._zod.parse(payload, ctx);
      if (result instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError();
        return result.then((result2) => runChecks(result2, checks, ctx));
      }
      return runChecks(result, checks, ctx);
    };
  }
  defineLazy(inst, "~standard", () => ({
    validate: /* @__PURE__ */ __name((value) => {
      try {
        const r = safeParse(inst, value);
        return r.success ? { value: r.data } : { issues: r.error?.issues };
      } catch (_) {
        return safeParseAsync(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
      }
    }, "validate"),
    vendor: "zod",
    version: 1
  }));
});
var $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string(inst._zod.bag);
  inst._zod.parse = (payload, _) => {
    if (def.coerce)
      try {
        payload.value = String(payload.value);
      } catch (_2) {
      }
    if (typeof payload.value === "string")
      return payload;
    payload.issues.push({
      expected: "string",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
var $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  $ZodString.init(inst, def);
});
var $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
  def.pattern ?? (def.pattern = guid);
  $ZodStringFormat.init(inst, def);
});
var $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
  if (def.version) {
    const versionMap = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    };
    const v = versionMap[def.version];
    if (v === void 0)
      throw new Error(`Invalid UUID version: "${def.version}"`);
    def.pattern ?? (def.pattern = uuid(v));
  } else
    def.pattern ?? (def.pattern = uuid());
  $ZodStringFormat.init(inst, def);
});
var $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
  def.pattern ?? (def.pattern = email);
  $ZodStringFormat.init(inst, def);
});
var $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    try {
      const trimmed = payload.value.trim();
      if (!def.normalize && def.protocol?.source === httpProtocol.source) {
        if (!/^https?:\/\//i.test(trimmed)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid URL format",
            input: payload.value,
            inst,
            continue: !def.abort
          });
          return;
        }
      }
      const url = new URL(trimmed);
      if (def.hostname) {
        def.hostname.lastIndex = 0;
        if (!def.hostname.test(url.hostname)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid hostname",
            pattern: def.hostname.source,
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      }
      if (def.protocol) {
        def.protocol.lastIndex = 0;
        if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid protocol",
            pattern: def.protocol.source,
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      }
      if (def.normalize) {
        payload.value = url.href;
      } else {
        payload.value = trimmed;
      }
      return;
    } catch (_) {
      payload.issues.push({
        code: "invalid_format",
        format: "url",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
  def.pattern ?? (def.pattern = emoji());
  $ZodStringFormat.init(inst, def);
});
var $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
  def.pattern ?? (def.pattern = nanoid);
  $ZodStringFormat.init(inst, def);
});
var $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
  def.pattern ?? (def.pattern = cuid);
  $ZodStringFormat.init(inst, def);
});
var $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
  def.pattern ?? (def.pattern = cuid2);
  $ZodStringFormat.init(inst, def);
});
var $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
  def.pattern ?? (def.pattern = ulid);
  $ZodStringFormat.init(inst, def);
});
var $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
  def.pattern ?? (def.pattern = xid);
  $ZodStringFormat.init(inst, def);
});
var $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
  def.pattern ?? (def.pattern = ksuid);
  $ZodStringFormat.init(inst, def);
});
var $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
  def.pattern ?? (def.pattern = datetime(def));
  $ZodStringFormat.init(inst, def);
});
var $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
  def.pattern ?? (def.pattern = date);
  $ZodStringFormat.init(inst, def);
});
var $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
  def.pattern ?? (def.pattern = time(def));
  $ZodStringFormat.init(inst, def);
});
var $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
  def.pattern ?? (def.pattern = duration);
  $ZodStringFormat.init(inst, def);
});
var $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
  def.pattern ?? (def.pattern = ipv4);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.format = `ipv4`;
});
var $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
  def.pattern ?? (def.pattern = ipv6);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.format = `ipv6`;
  inst._zod.check = (payload) => {
    try {
      new URL(`http://[${payload.value}]`);
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv4);
  $ZodStringFormat.init(inst, def);
});
var $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv6);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    const parts = payload.value.split("/");
    try {
      if (parts.length !== 2)
        throw new Error();
      const [address, prefix] = parts;
      if (!prefix)
        throw new Error();
      const prefixNum = Number(prefix);
      if (`${prefixNum}` !== prefix)
        throw new Error();
      if (prefixNum < 0 || prefixNum > 128)
        throw new Error();
      new URL(`http://[${address}]`);
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
function isValidBase64(data) {
  if (data === "")
    return true;
  if (/\s/.test(data))
    return false;
  if (data.length % 4 !== 0)
    return false;
  try {
    atob(data);
    return true;
  } catch {
    return false;
  }
}
__name(isValidBase64, "isValidBase64");
var $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
  def.pattern ?? (def.pattern = base64);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.contentEncoding = "base64";
  inst._zod.check = (payload) => {
    if (isValidBase64(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
function isValidBase64URL(data) {
  if (!base64url.test(data))
    return false;
  const base642 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
  const padded = base642.padEnd(Math.ceil(base642.length / 4) * 4, "=");
  return isValidBase64(padded);
}
__name(isValidBase64URL, "isValidBase64URL");
var $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
  def.pattern ?? (def.pattern = base64url);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.contentEncoding = "base64url";
  inst._zod.check = (payload) => {
    if (isValidBase64URL(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
  def.pattern ?? (def.pattern = e164);
  $ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
  try {
    const tokensParts = token.split(".");
    if (tokensParts.length !== 3)
      return false;
    const [header] = tokensParts;
    if (!header)
      return false;
    const parsedHeader = JSON.parse(atob(header));
    if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
      return false;
    if (!parsedHeader.alg)
      return false;
    if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
      return false;
    return true;
  } catch {
    return false;
  }
}
__name(isValidJWT, "isValidJWT");
var $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (isValidJWT(payload.value, def.alg))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = inst._zod.bag.pattern ?? number;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Number(payload.value);
      } catch (_) {
      }
    const input = payload.value;
    if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
      return payload;
    }
    const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
    payload.issues.push({
      expected: "number",
      code: "invalid_type",
      input,
      inst,
      ...received ? { received } : {}
    });
    return payload;
  };
});
var $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumberFormat", (inst, def) => {
  $ZodCheckNumberFormat.init(inst, def);
  $ZodNumber.init(inst, def);
});
var $ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = boolean;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Boolean(payload.value);
      } catch (_) {
      }
    const input = payload.value;
    if (typeof input === "boolean")
      return payload;
    payload.issues.push({
      expected: "boolean",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodNull = /* @__PURE__ */ $constructor("$ZodNull", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = _null;
  inst._zod.values = /* @__PURE__ */ new Set([null]);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (input === null)
      return payload;
    payload.issues.push({
      expected: "null",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload) => payload;
});
var $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    payload.issues.push({
      expected: "never",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
function handleArrayResult(result, final, index) {
  if (result.issues.length) {
    final.issues.push(...prefixIssues(index, result.issues));
  }
  final.value[index] = result.value;
}
__name(handleArrayResult, "handleArrayResult");
var $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!Array.isArray(input)) {
      payload.issues.push({
        expected: "array",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = Array(input.length);
    const proms = [];
    for (let i = 0; i < input.length; i++) {
      const item = input[i];
      const result = def.element._zod.run({
        value: item,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        proms.push(result.then((result2) => handleArrayResult(result2, payload, i)));
      } else {
        handleArrayResult(result, payload, i);
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
  const isPresent = key in input;
  if (result.issues.length) {
    if (isOptionalIn && isOptionalOut && !isPresent) {
      return;
    }
    final.issues.push(...prefixIssues(key, result.issues));
  }
  if (!isPresent && !isOptionalIn) {
    if (!result.issues.length) {
      final.issues.push({
        code: "invalid_type",
        expected: "nonoptional",
        input: void 0,
        path: [key]
      });
    }
    return;
  }
  if (result.value === void 0) {
    if (isPresent) {
      final.value[key] = void 0;
    }
  } else {
    final.value[key] = result.value;
  }
}
__name(handlePropertyResult, "handlePropertyResult");
function normalizeDef(def) {
  const keys = Object.keys(def.shape);
  for (const k of keys) {
    if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) {
      throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
    }
  }
  const okeys = optionalKeys(def.shape);
  return {
    ...def,
    keys,
    keySet: new Set(keys),
    numKeys: keys.length,
    optionalKeys: new Set(okeys)
  };
}
__name(normalizeDef, "normalizeDef");
function handleCatchall(proms, input, payload, ctx, def, inst) {
  const unrecognized = [];
  const keySet = def.keySet;
  const _catchall = def.catchall._zod;
  const t = _catchall.def.type;
  const isOptionalIn = _catchall.optin === "optional";
  const isOptionalOut = _catchall.optout === "optional";
  for (const key in input) {
    if (key === "__proto__")
      continue;
    if (keySet.has(key))
      continue;
    if (t === "never") {
      unrecognized.push(key);
      continue;
    }
    const r = _catchall.run({ value: input[key], issues: [] }, ctx);
    if (r instanceof Promise) {
      proms.push(r.then((r2) => handlePropertyResult(r2, payload, key, input, isOptionalIn, isOptionalOut)));
    } else {
      handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
    }
  }
  if (unrecognized.length) {
    payload.issues.push({
      code: "unrecognized_keys",
      keys: unrecognized,
      input,
      inst
    });
  }
  if (!proms.length)
    return payload;
  return Promise.all(proms).then(() => {
    return payload;
  });
}
__name(handleCatchall, "handleCatchall");
var $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
  $ZodType.init(inst, def);
  const desc = Object.getOwnPropertyDescriptor(def, "shape");
  if (!desc?.get) {
    const sh = def.shape;
    Object.defineProperty(def, "shape", {
      get: /* @__PURE__ */ __name(() => {
        const newSh = { ...sh };
        Object.defineProperty(def, "shape", {
          value: newSh
        });
        return newSh;
      }, "get")
    });
  }
  const _normalized = cached(() => normalizeDef(def));
  defineLazy(inst._zod, "propValues", () => {
    const shape = def.shape;
    const propValues = {};
    for (const key in shape) {
      const field = shape[key]._zod;
      if (field.values) {
        propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
        for (const v of field.values)
          propValues[key].add(v);
      }
    }
    return propValues;
  });
  const isObject2 = isObject;
  const catchall = def.catchall;
  let value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject2(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = {};
    const proms = [];
    const shape = value.shape;
    for (const key of value.keys) {
      const el = shape[key];
      const isOptionalIn = el._zod.optin === "optional";
      const isOptionalOut = el._zod.optout === "optional";
      const r = el._zod.run({ value: input[key], issues: [] }, ctx);
      if (r instanceof Promise) {
        proms.push(r.then((r2) => handlePropertyResult(r2, payload, key, input, isOptionalIn, isOptionalOut)));
      } else {
        handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
      }
    }
    if (!catchall) {
      return proms.length ? Promise.all(proms).then(() => payload) : payload;
    }
    return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
  };
});
var $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
  $ZodObject.init(inst, def);
  const superParse = inst._zod.parse;
  const _normalized = cached(() => normalizeDef(def));
  const generateFastpass = /* @__PURE__ */ __name((shape) => {
    const doc = new Doc(["shape", "payload", "ctx"]);
    const normalized = _normalized.value;
    const parseStr = /* @__PURE__ */ __name((key) => {
      const k = esc(key);
      return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
    }, "parseStr");
    doc.write(`const input = payload.value;`);
    const ids = /* @__PURE__ */ Object.create(null);
    let counter = 0;
    for (const key of normalized.keys) {
      ids[key] = `key_${counter++}`;
    }
    doc.write(`const newResult = {};`);
    for (const key of normalized.keys) {
      const id = ids[key];
      const k = esc(key);
      const schema = shape[key];
      const isOptionalIn = schema?._zod?.optin === "optional";
      const isOptionalOut = schema?._zod?.optout === "optional";
      doc.write(`const ${id} = ${parseStr(key)};`);
      if (isOptionalIn && isOptionalOut) {
        doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
      } else if (!isOptionalIn) {
        doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
      } else {
        doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
      }
    }
    doc.write(`payload.value = newResult;`);
    doc.write(`return payload;`);
    const fn = doc.compile();
    return (payload, ctx) => fn(shape, payload, ctx);
  }, "generateFastpass");
  let fastpass;
  const isObject2 = isObject;
  const jit = !globalConfig.jitless;
  const allowsEval2 = allowsEval;
  const fastEnabled = jit && allowsEval2.value;
  const catchall = def.catchall;
  let value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject2(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
      if (!fastpass)
        fastpass = generateFastpass(def.shape);
      payload = fastpass(payload, ctx);
      if (!catchall)
        return payload;
      return handleCatchall([], input, payload, ctx, value, inst);
    }
    return superParse(payload, ctx);
  };
});
function handleUnionResults(results, final, inst, ctx) {
  for (const result of results) {
    if (result.issues.length === 0) {
      final.value = result.value;
      return final;
    }
  }
  const nonaborted = results.filter((r) => !aborted(r));
  if (nonaborted.length === 1) {
    final.value = nonaborted[0].value;
    return nonaborted[0];
  }
  final.issues.push({
    code: "invalid_union",
    input: final.value,
    inst,
    errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  });
  return final;
}
__name(handleUnionResults, "handleUnionResults");
var $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
  defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
  defineLazy(inst._zod, "values", () => {
    if (def.options.every((o) => o._zod.values)) {
      return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
    }
    return void 0;
  });
  defineLazy(inst._zod, "pattern", () => {
    if (def.options.every((o) => o._zod.pattern)) {
      const patterns = def.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
    }
    return void 0;
  });
  const first = def.options.length === 1 ? def.options[0]._zod.run : null;
  inst._zod.parse = (payload, ctx) => {
    if (first) {
      return first(payload, ctx);
    }
    let async = false;
    const results = [];
    for (const option of def.options) {
      const result = option._zod.run({
        value: payload.value,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        results.push(result);
        async = true;
      } else {
        if (result.issues.length === 0)
          return result;
        results.push(result);
      }
    }
    if (!async)
      return handleUnionResults(results, payload, inst, ctx);
    return Promise.all(results).then((results2) => {
      return handleUnionResults(results2, payload, inst, ctx);
    });
  };
});
var $ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("$ZodDiscriminatedUnion", (inst, def) => {
  def.inclusive = false;
  $ZodUnion.init(inst, def);
  const _super = inst._zod.parse;
  defineLazy(inst._zod, "propValues", () => {
    const propValues = {};
    for (const option of def.options) {
      const pv = option._zod.propValues;
      if (!pv || Object.keys(pv).length === 0)
        throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(option)}"`);
      for (const [k, v] of Object.entries(pv)) {
        if (!propValues[k])
          propValues[k] = /* @__PURE__ */ new Set();
        for (const val of v) {
          propValues[k].add(val);
        }
      }
    }
    return propValues;
  });
  const disc = cached(() => {
    const opts = def.options;
    const map = /* @__PURE__ */ new Map();
    for (const o of opts) {
      const values = o._zod.propValues?.[def.discriminator];
      if (!values || values.size === 0)
        throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(o)}"`);
      for (const v of values) {
        if (map.has(v)) {
          throw new Error(`Duplicate discriminator value "${String(v)}"`);
        }
        map.set(v, o);
      }
    }
    return map;
  });
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!isObject(input)) {
      payload.issues.push({
        code: "invalid_type",
        expected: "object",
        input,
        inst
      });
      return payload;
    }
    const opt = disc.value.get(input?.[def.discriminator]);
    if (opt) {
      return opt._zod.run(payload, ctx);
    }
    if (def.unionFallback || ctx.direction === "backward") {
      return _super(payload, ctx);
    }
    payload.issues.push({
      code: "invalid_union",
      errors: [],
      note: "No matching discriminator",
      discriminator: def.discriminator,
      options: Array.from(disc.value.keys()),
      input,
      path: [def.discriminator],
      inst
    });
    return payload;
  };
});
var $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    const left = def.left._zod.run({ value: input, issues: [] }, ctx);
    const right = def.right._zod.run({ value: input, issues: [] }, ctx);
    const async = left instanceof Promise || right instanceof Promise;
    if (async) {
      return Promise.all([left, right]).then(([left2, right2]) => {
        return handleIntersectionResults(payload, left2, right2);
      });
    }
    return handleIntersectionResults(payload, left, right);
  };
});
function mergeValues(a, b) {
  if (a === b) {
    return { valid: true, data: a };
  }
  if (a instanceof Date && b instanceof Date && +a === +b) {
    return { valid: true, data: a };
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const bKeys = Object.keys(b);
    const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
        };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return { valid: false, mergeErrorPath: [] };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
        };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  }
  return { valid: false, mergeErrorPath: [] };
}
__name(mergeValues, "mergeValues");
function handleIntersectionResults(result, left, right) {
  const unrecKeys = /* @__PURE__ */ new Map();
  let unrecIssue;
  for (const iss of left.issues) {
    if (iss.code === "unrecognized_keys") {
      unrecIssue ?? (unrecIssue = iss);
      for (const k of iss.keys) {
        if (!unrecKeys.has(k))
          unrecKeys.set(k, {});
        unrecKeys.get(k).l = true;
      }
    } else {
      result.issues.push(iss);
    }
  }
  for (const iss of right.issues) {
    if (iss.code === "unrecognized_keys") {
      for (const k of iss.keys) {
        if (!unrecKeys.has(k))
          unrecKeys.set(k, {});
        unrecKeys.get(k).r = true;
      }
    } else {
      result.issues.push(iss);
    }
  }
  const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
  if (bothKeys.length && unrecIssue) {
    result.issues.push({ ...unrecIssue, keys: bothKeys });
  }
  if (aborted(result))
    return result;
  const merged = mergeValues(left.value, right.value);
  if (!merged.valid) {
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
  }
  result.value = merged.data;
  return result;
}
__name(handleIntersectionResults, "handleIntersectionResults");
var $ZodRecord = /* @__PURE__ */ $constructor("$ZodRecord", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!isPlainObject(input)) {
      payload.issues.push({
        expected: "record",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    const proms = [];
    const values = def.keyType._zod.values;
    if (values) {
      payload.value = {};
      const recordKeys = /* @__PURE__ */ new Set();
      for (const key of values) {
        if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
          recordKeys.add(typeof key === "number" ? key.toString() : key);
          const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
          if (keyResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (keyResult.issues.length) {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
            continue;
          }
          const outKey = keyResult.value;
          const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
          if (result instanceof Promise) {
            proms.push(result.then((result2) => {
              if (result2.issues.length) {
                payload.issues.push(...prefixIssues(key, result2.issues));
              }
              payload.value[outKey] = result2.value;
            }));
          } else {
            if (result.issues.length) {
              payload.issues.push(...prefixIssues(key, result.issues));
            }
            payload.value[outKey] = result.value;
          }
        }
      }
      let unrecognized;
      for (const key in input) {
        if (!recordKeys.has(key)) {
          unrecognized = unrecognized ?? [];
          unrecognized.push(key);
        }
      }
      if (unrecognized && unrecognized.length > 0) {
        payload.issues.push({
          code: "unrecognized_keys",
          input,
          inst,
          keys: unrecognized
        });
      }
    } else {
      payload.value = {};
      for (const key of Reflect.ownKeys(input)) {
        if (key === "__proto__")
          continue;
        if (!Object.prototype.propertyIsEnumerable.call(input, key))
          continue;
        let keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
        if (keyResult instanceof Promise) {
          throw new Error("Async schemas not supported in object keys currently");
        }
        const checkNumericKey = typeof key === "string" && number.test(key) && keyResult.issues.length;
        if (checkNumericKey) {
          const retryResult = def.keyType._zod.run({ value: Number(key), issues: [] }, ctx);
          if (retryResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (retryResult.issues.length === 0) {
            keyResult = retryResult;
          }
        }
        if (keyResult.issues.length) {
          if (def.mode === "loose") {
            payload.value[key] = input[key];
          } else {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
          }
          continue;
        }
        const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
        if (result instanceof Promise) {
          proms.push(result.then((result2) => {
            if (result2.issues.length) {
              payload.issues.push(...prefixIssues(key, result2.issues));
            }
            payload.value[keyResult.value] = result2.value;
          }));
        } else {
          if (result.issues.length) {
            payload.issues.push(...prefixIssues(key, result.issues));
          }
          payload.value[keyResult.value] = result.value;
        }
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
var $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
  $ZodType.init(inst, def);
  const values = getEnumValues(def.entries);
  const valuesSet = new Set(values);
  inst._zod.values = valuesSet;
  inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (valuesSet.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values,
      input,
      inst
    });
    return payload;
  };
});
var $ZodLiteral = /* @__PURE__ */ $constructor("$ZodLiteral", (inst, def) => {
  $ZodType.init(inst, def);
  if (def.values.length === 0) {
    throw new Error("Cannot create literal schema with no valid values");
  }
  const values = new Set(def.values);
  inst._zod.values = values;
  inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$`);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (values.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values: def.values,
      input,
      inst
    });
    return payload;
  };
});
var $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    const _out = def.transform(payload.value, payload);
    if (ctx.async) {
      const output = _out instanceof Promise ? _out : Promise.resolve(_out);
      return output.then((output2) => {
        payload.value = output2;
        payload.fallback = true;
        return payload;
      });
    }
    if (_out instanceof Promise) {
      throw new $ZodAsyncError();
    }
    payload.value = _out;
    payload.fallback = true;
    return payload;
  };
});
function handleOptionalResult(result, input) {
  if (input === void 0 && (result.issues.length || result.fallback)) {
    return { issues: [], value: void 0 };
  }
  return result;
}
__name(handleOptionalResult, "handleOptionalResult");
var $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  inst._zod.optout = "optional";
  defineLazy(inst._zod, "values", () => {
    return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0;
  });
  defineLazy(inst._zod, "pattern", () => {
    const pattern = def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
  });
  inst._zod.parse = (payload, ctx) => {
    if (def.innerType._zod.optin === "optional") {
      const input = payload.value;
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise)
        return result.then((r) => handleOptionalResult(r, input));
      return handleOptionalResult(result, input);
    }
    if (payload.value === void 0) {
      return payload;
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
  inst._zod.parse = (payload, ctx) => {
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
  defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
  defineLazy(inst._zod, "pattern", () => {
    const pattern = def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
  });
  defineLazy(inst._zod, "values", () => {
    return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null]) : void 0;
  });
  inst._zod.parse = (payload, ctx) => {
    if (payload.value === null)
      return payload;
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === void 0) {
      payload.value = def.defaultValue;
      return payload;
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => handleDefaultResult(result2, def));
    }
    return handleDefaultResult(result, def);
  };
});
function handleDefaultResult(payload, def) {
  if (payload.value === void 0) {
    payload.value = def.defaultValue;
  }
  return payload;
}
__name(handleDefaultResult, "handleDefaultResult");
var $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === void 0) {
      payload.value = def.defaultValue;
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "values", () => {
    const v = def.innerType._zod.values;
    return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
  });
  inst._zod.parse = (payload, ctx) => {
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => handleNonOptionalResult(result2, inst));
    }
    return handleNonOptionalResult(result, inst);
  };
});
function handleNonOptionalResult(payload, inst) {
  if (!payload.issues.length && payload.value === void 0) {
    payload.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: payload.value,
      inst
    });
  }
  return payload;
}
__name(handleNonOptionalResult, "handleNonOptionalResult");
var $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => {
        payload.value = result2.value;
        if (result2.issues.length) {
          payload.value = def.catchValue({
            ...payload,
            error: {
              issues: result2.issues.map((iss) => finalizeIssue(iss, ctx, config()))
            },
            input: payload.value
          });
          payload.issues = [];
          payload.fallback = true;
        }
        return payload;
      });
    }
    payload.value = result.value;
    if (result.issues.length) {
      payload.value = def.catchValue({
        ...payload,
        error: {
          issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
        },
        input: payload.value
      });
      payload.issues = [];
      payload.fallback = true;
    }
    return payload;
  };
});
var $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "values", () => def.in._zod.values);
  defineLazy(inst._zod, "optin", () => def.in._zod.optin);
  defineLazy(inst._zod, "optout", () => def.out._zod.optout);
  defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      const right = def.out._zod.run(payload, ctx);
      if (right instanceof Promise) {
        return right.then((right2) => handlePipeResult(right2, def.in, ctx));
      }
      return handlePipeResult(right, def.in, ctx);
    }
    const left = def.in._zod.run(payload, ctx);
    if (left instanceof Promise) {
      return left.then((left2) => handlePipeResult(left2, def.out, ctx));
    }
    return handlePipeResult(left, def.out, ctx);
  };
});
function handlePipeResult(left, next, ctx) {
  if (left.issues.length) {
    left.aborted = true;
    return left;
  }
  return next._zod.run({ value: left.value, issues: left.issues, fallback: left.fallback }, ctx);
}
__name(handlePipeResult, "handlePipeResult");
var $ZodPreprocess = /* @__PURE__ */ $constructor("$ZodPreprocess", (inst, def) => {
  $ZodPipe.init(inst, def);
});
var $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
  defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then(handleReadonlyResult);
    }
    return handleReadonlyResult(result);
  };
});
function handleReadonlyResult(payload) {
  payload.value = Object.freeze(payload.value);
  return payload;
}
__name(handleReadonlyResult, "handleReadonlyResult");
var $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
  $ZodCheck.init(inst, def);
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _) => {
    return payload;
  };
  inst._zod.check = (payload) => {
    const input = payload.value;
    const r = def.fn(input);
    if (r instanceof Promise) {
      return r.then((r2) => handleRefineResult(r2, payload, input, inst));
    }
    handleRefineResult(r, payload, input, inst);
    return;
  };
});
function handleRefineResult(result, payload, input, inst) {
  if (!result) {
    const _iss = {
      code: "custom",
      input,
      inst,
      // incorporates params.error into issue reporting
      path: [...inst._zod.def.path ?? []],
      // incorporates params.error into issue reporting
      continue: !inst._zod.def.abort
      // params: inst._zod.def.params,
    };
    if (inst._zod.def.params)
      _iss.params = inst._zod.def.params;
    payload.issues.push(issue(_iss));
  }
}
__name(handleRefineResult, "handleRefineResult");

// node_modules/zod/v4/locales/en.js
init_modules_watch_stub();
var error = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "characters", verb: "to have" },
    file: { unit: "bytes", verb: "to have" },
    array: { unit: "items", verb: "to have" },
    set: { unit: "items", verb: "to have" },
    map: { unit: "entries", verb: "to have" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const FormatDictionary = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    mac: "MAC address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    // Compatibility: "nan" -> "NaN" for display
    nan: "NaN"
    // All other type names omitted - they fall back to raw values via ?? operator
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        return `Invalid input: expected ${expected}, received ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Invalid input: expected ${stringifyPrimitive(issue2.values[0])}`;
        return `Invalid option: expected one of ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Too big: expected ${issue2.origin ?? "value"} to have ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elements"}`;
        return `Too big: expected ${issue2.origin ?? "value"} to be ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Too small: expected ${issue2.origin} to have ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Too small: expected ${issue2.origin} to be ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Invalid string: must start with "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Invalid string: must end with "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Invalid string: must include "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Invalid string: must match pattern ${_issue.pattern}`;
        return `Invalid ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Invalid number: must be a multiple of ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Unrecognized key${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Invalid key in ${issue2.origin}`;
      case "invalid_union":
        if (issue2.options && Array.isArray(issue2.options) && issue2.options.length > 0) {
          const opts = issue2.options.map((o) => `'${o}'`).join(" | ");
          return `Invalid discriminator value. Expected ${opts}`;
        }
        return "Invalid input";
      case "invalid_element":
        return `Invalid value in ${issue2.origin}`;
      default:
        return `Invalid input`;
    }
  };
}, "error");
function en_default() {
  return {
    localeError: error()
  };
}
__name(en_default, "default");

// node_modules/zod/v4/core/registries.js
init_modules_watch_stub();
var _a2;
var $ZodRegistry = class {
  static {
    __name(this, "$ZodRegistry");
  }
  constructor() {
    this._map = /* @__PURE__ */ new WeakMap();
    this._idmap = /* @__PURE__ */ new Map();
  }
  add(schema, ..._meta) {
    const meta2 = _meta[0];
    this._map.set(schema, meta2);
    if (meta2 && typeof meta2 === "object" && "id" in meta2) {
      this._idmap.set(meta2.id, schema);
    }
    return this;
  }
  clear() {
    this._map = /* @__PURE__ */ new WeakMap();
    this._idmap = /* @__PURE__ */ new Map();
    return this;
  }
  remove(schema) {
    const meta2 = this._map.get(schema);
    if (meta2 && typeof meta2 === "object" && "id" in meta2) {
      this._idmap.delete(meta2.id);
    }
    this._map.delete(schema);
    return this;
  }
  get(schema) {
    const p = schema._zod.parent;
    if (p) {
      const pm = { ...this.get(p) ?? {} };
      delete pm.id;
      const f = { ...pm, ...this._map.get(schema) };
      return Object.keys(f).length ? f : void 0;
    }
    return this._map.get(schema);
  }
  has(schema) {
    return this._map.has(schema);
  }
};
function registry() {
  return new $ZodRegistry();
}
__name(registry, "registry");
(_a2 = globalThis).__zod_globalRegistry ?? (_a2.__zod_globalRegistry = registry());
var globalRegistry = globalThis.__zod_globalRegistry;

// node_modules/zod/v4/core/api.js
init_modules_watch_stub();
// @__NO_SIDE_EFFECTS__
function _string(Class2, params) {
  return new Class2({
    type: "string",
    ...normalizeParams(params)
  });
}
__name(_string, "_string");
// @__NO_SIDE_EFFECTS__
function _email(Class2, params) {
  return new Class2({
    type: "string",
    format: "email",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_email, "_email");
// @__NO_SIDE_EFFECTS__
function _guid(Class2, params) {
  return new Class2({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_guid, "_guid");
// @__NO_SIDE_EFFECTS__
function _uuid(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_uuid, "_uuid");
// @__NO_SIDE_EFFECTS__
function _uuidv4(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v4",
    ...normalizeParams(params)
  });
}
__name(_uuidv4, "_uuidv4");
// @__NO_SIDE_EFFECTS__
function _uuidv6(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v6",
    ...normalizeParams(params)
  });
}
__name(_uuidv6, "_uuidv6");
// @__NO_SIDE_EFFECTS__
function _uuidv7(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v7",
    ...normalizeParams(params)
  });
}
__name(_uuidv7, "_uuidv7");
// @__NO_SIDE_EFFECTS__
function _url(Class2, params) {
  return new Class2({
    type: "string",
    format: "url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_url, "_url");
// @__NO_SIDE_EFFECTS__
function _emoji2(Class2, params) {
  return new Class2({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_emoji2, "_emoji");
// @__NO_SIDE_EFFECTS__
function _nanoid(Class2, params) {
  return new Class2({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_nanoid, "_nanoid");
// @__NO_SIDE_EFFECTS__
function _cuid(Class2, params) {
  return new Class2({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_cuid, "_cuid");
// @__NO_SIDE_EFFECTS__
function _cuid2(Class2, params) {
  return new Class2({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_cuid2, "_cuid2");
// @__NO_SIDE_EFFECTS__
function _ulid(Class2, params) {
  return new Class2({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_ulid, "_ulid");
// @__NO_SIDE_EFFECTS__
function _xid(Class2, params) {
  return new Class2({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_xid, "_xid");
// @__NO_SIDE_EFFECTS__
function _ksuid(Class2, params) {
  return new Class2({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_ksuid, "_ksuid");
// @__NO_SIDE_EFFECTS__
function _ipv4(Class2, params) {
  return new Class2({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_ipv4, "_ipv4");
// @__NO_SIDE_EFFECTS__
function _ipv6(Class2, params) {
  return new Class2({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_ipv6, "_ipv6");
// @__NO_SIDE_EFFECTS__
function _cidrv4(Class2, params) {
  return new Class2({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_cidrv4, "_cidrv4");
// @__NO_SIDE_EFFECTS__
function _cidrv6(Class2, params) {
  return new Class2({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_cidrv6, "_cidrv6");
// @__NO_SIDE_EFFECTS__
function _base64(Class2, params) {
  return new Class2({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_base64, "_base64");
// @__NO_SIDE_EFFECTS__
function _base64url(Class2, params) {
  return new Class2({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_base64url, "_base64url");
// @__NO_SIDE_EFFECTS__
function _e164(Class2, params) {
  return new Class2({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_e164, "_e164");
// @__NO_SIDE_EFFECTS__
function _jwt(Class2, params) {
  return new Class2({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
__name(_jwt, "_jwt");
// @__NO_SIDE_EFFECTS__
function _isoDateTime(Class2, params) {
  return new Class2({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: false,
    local: false,
    precision: null,
    ...normalizeParams(params)
  });
}
__name(_isoDateTime, "_isoDateTime");
// @__NO_SIDE_EFFECTS__
function _isoDate(Class2, params) {
  return new Class2({
    type: "string",
    format: "date",
    check: "string_format",
    ...normalizeParams(params)
  });
}
__name(_isoDate, "_isoDate");
// @__NO_SIDE_EFFECTS__
function _isoTime(Class2, params) {
  return new Class2({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...normalizeParams(params)
  });
}
__name(_isoTime, "_isoTime");
// @__NO_SIDE_EFFECTS__
function _isoDuration(Class2, params) {
  return new Class2({
    type: "string",
    format: "duration",
    check: "string_format",
    ...normalizeParams(params)
  });
}
__name(_isoDuration, "_isoDuration");
// @__NO_SIDE_EFFECTS__
function _number(Class2, params) {
  return new Class2({
    type: "number",
    checks: [],
    ...normalizeParams(params)
  });
}
__name(_number, "_number");
// @__NO_SIDE_EFFECTS__
function _int(Class2, params) {
  return new Class2({
    type: "number",
    check: "number_format",
    abort: false,
    format: "safeint",
    ...normalizeParams(params)
  });
}
__name(_int, "_int");
// @__NO_SIDE_EFFECTS__
function _boolean(Class2, params) {
  return new Class2({
    type: "boolean",
    ...normalizeParams(params)
  });
}
__name(_boolean, "_boolean");
// @__NO_SIDE_EFFECTS__
function _null2(Class2, params) {
  return new Class2({
    type: "null",
    ...normalizeParams(params)
  });
}
__name(_null2, "_null");
// @__NO_SIDE_EFFECTS__
function _unknown(Class2) {
  return new Class2({
    type: "unknown"
  });
}
__name(_unknown, "_unknown");
// @__NO_SIDE_EFFECTS__
function _never(Class2, params) {
  return new Class2({
    type: "never",
    ...normalizeParams(params)
  });
}
__name(_never, "_never");
// @__NO_SIDE_EFFECTS__
function _lt(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
__name(_lt, "_lt");
// @__NO_SIDE_EFFECTS__
function _lte(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
__name(_lte, "_lte");
// @__NO_SIDE_EFFECTS__
function _gt(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
__name(_gt, "_gt");
// @__NO_SIDE_EFFECTS__
function _gte(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
__name(_gte, "_gte");
// @__NO_SIDE_EFFECTS__
function _multipleOf(value, params) {
  return new $ZodCheckMultipleOf({
    check: "multiple_of",
    ...normalizeParams(params),
    value
  });
}
__name(_multipleOf, "_multipleOf");
// @__NO_SIDE_EFFECTS__
function _maxLength(maximum, params) {
  const ch = new $ZodCheckMaxLength({
    check: "max_length",
    ...normalizeParams(params),
    maximum
  });
  return ch;
}
__name(_maxLength, "_maxLength");
// @__NO_SIDE_EFFECTS__
function _minLength(minimum, params) {
  return new $ZodCheckMinLength({
    check: "min_length",
    ...normalizeParams(params),
    minimum
  });
}
__name(_minLength, "_minLength");
// @__NO_SIDE_EFFECTS__
function _length(length, params) {
  return new $ZodCheckLengthEquals({
    check: "length_equals",
    ...normalizeParams(params),
    length
  });
}
__name(_length, "_length");
// @__NO_SIDE_EFFECTS__
function _regex(pattern, params) {
  return new $ZodCheckRegex({
    check: "string_format",
    format: "regex",
    ...normalizeParams(params),
    pattern
  });
}
__name(_regex, "_regex");
// @__NO_SIDE_EFFECTS__
function _lowercase(params) {
  return new $ZodCheckLowerCase({
    check: "string_format",
    format: "lowercase",
    ...normalizeParams(params)
  });
}
__name(_lowercase, "_lowercase");
// @__NO_SIDE_EFFECTS__
function _uppercase(params) {
  return new $ZodCheckUpperCase({
    check: "string_format",
    format: "uppercase",
    ...normalizeParams(params)
  });
}
__name(_uppercase, "_uppercase");
// @__NO_SIDE_EFFECTS__
function _includes(includes, params) {
  return new $ZodCheckIncludes({
    check: "string_format",
    format: "includes",
    ...normalizeParams(params),
    includes
  });
}
__name(_includes, "_includes");
// @__NO_SIDE_EFFECTS__
function _startsWith(prefix, params) {
  return new $ZodCheckStartsWith({
    check: "string_format",
    format: "starts_with",
    ...normalizeParams(params),
    prefix
  });
}
__name(_startsWith, "_startsWith");
// @__NO_SIDE_EFFECTS__
function _endsWith(suffix, params) {
  return new $ZodCheckEndsWith({
    check: "string_format",
    format: "ends_with",
    ...normalizeParams(params),
    suffix
  });
}
__name(_endsWith, "_endsWith");
// @__NO_SIDE_EFFECTS__
function _overwrite(tx) {
  return new $ZodCheckOverwrite({
    check: "overwrite",
    tx
  });
}
__name(_overwrite, "_overwrite");
// @__NO_SIDE_EFFECTS__
function _normalize(form) {
  return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
}
__name(_normalize, "_normalize");
// @__NO_SIDE_EFFECTS__
function _trim() {
  return /* @__PURE__ */ _overwrite((input) => input.trim());
}
__name(_trim, "_trim");
// @__NO_SIDE_EFFECTS__
function _toLowerCase() {
  return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
}
__name(_toLowerCase, "_toLowerCase");
// @__NO_SIDE_EFFECTS__
function _toUpperCase() {
  return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
}
__name(_toUpperCase, "_toUpperCase");
// @__NO_SIDE_EFFECTS__
function _slugify() {
  return /* @__PURE__ */ _overwrite((input) => slugify(input));
}
__name(_slugify, "_slugify");
// @__NO_SIDE_EFFECTS__
function _array(Class2, element, params) {
  return new Class2({
    type: "array",
    element,
    // get element() {
    //   return element;
    // },
    ...normalizeParams(params)
  });
}
__name(_array, "_array");
// @__NO_SIDE_EFFECTS__
function _custom(Class2, fn, _params) {
  const norm = normalizeParams(_params);
  norm.abort ?? (norm.abort = true);
  const schema = new Class2({
    type: "custom",
    check: "custom",
    fn,
    ...norm
  });
  return schema;
}
__name(_custom, "_custom");
// @__NO_SIDE_EFFECTS__
function _refine(Class2, fn, _params) {
  const schema = new Class2({
    type: "custom",
    check: "custom",
    fn,
    ...normalizeParams(_params)
  });
  return schema;
}
__name(_refine, "_refine");
// @__NO_SIDE_EFFECTS__
function _superRefine(fn, params) {
  const ch = /* @__PURE__ */ _check((payload) => {
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(issue(issue2, payload.value, ch._zod.def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        _issue.input ?? (_issue.input = payload.value);
        _issue.inst ?? (_issue.inst = ch);
        _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
        payload.issues.push(issue(_issue));
      }
    };
    return fn(payload.value, payload);
  }, params);
  return ch;
}
__name(_superRefine, "_superRefine");
// @__NO_SIDE_EFFECTS__
function _check(fn, params) {
  const ch = new $ZodCheck({
    check: "custom",
    ...normalizeParams(params)
  });
  ch._zod.check = fn;
  return ch;
}
__name(_check, "_check");

// node_modules/zod/v4/core/to-json-schema.js
init_modules_watch_stub();
function initializeContext(params) {
  let target = params?.target ?? "draft-2020-12";
  if (target === "draft-4")
    target = "draft-04";
  if (target === "draft-7")
    target = "draft-07";
  return {
    processors: params.processors ?? {},
    metadataRegistry: params?.metadata ?? globalRegistry,
    target,
    unrepresentable: params?.unrepresentable ?? "throw",
    override: params?.override ?? (() => {
    }),
    io: params?.io ?? "output",
    counter: 0,
    seen: /* @__PURE__ */ new Map(),
    cycles: params?.cycles ?? "ref",
    reused: params?.reused ?? "inline",
    external: params?.external ?? void 0
  };
}
__name(initializeContext, "initializeContext");
function process(schema, ctx, _params = { path: [], schemaPath: [] }) {
  var _a3;
  const def = schema._zod.def;
  const seen = ctx.seen.get(schema);
  if (seen) {
    seen.count++;
    const isCycle = _params.schemaPath.includes(schema);
    if (isCycle) {
      seen.cycle = _params.path;
    }
    return seen.schema;
  }
  const result = { schema: {}, count: 1, cycle: void 0, path: _params.path };
  ctx.seen.set(schema, result);
  const overrideSchema = schema._zod.toJSONSchema?.();
  if (overrideSchema) {
    result.schema = overrideSchema;
  } else {
    const params = {
      ..._params,
      schemaPath: [..._params.schemaPath, schema],
      path: _params.path
    };
    if (schema._zod.processJSONSchema) {
      schema._zod.processJSONSchema(ctx, result.schema, params);
    } else {
      const _json = result.schema;
      const processor = ctx.processors[def.type];
      if (!processor) {
        throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
      }
      processor(schema, ctx, _json, params);
    }
    const parent = schema._zod.parent;
    if (parent) {
      if (!result.ref)
        result.ref = parent;
      process(parent, ctx, params);
      ctx.seen.get(parent).isParent = true;
    }
  }
  const meta2 = ctx.metadataRegistry.get(schema);
  if (meta2)
    Object.assign(result.schema, meta2);
  if (ctx.io === "input" && isTransforming(schema)) {
    delete result.schema.examples;
    delete result.schema.default;
  }
  if (ctx.io === "input" && "_prefault" in result.schema)
    (_a3 = result.schema).default ?? (_a3.default = result.schema._prefault);
  delete result.schema._prefault;
  const _result = ctx.seen.get(schema);
  return _result.schema;
}
__name(process, "process");
function extractDefs(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const idToSchema = /* @__PURE__ */ new Map();
  for (const entry of ctx.seen.entries()) {
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      const existing = idToSchema.get(id);
      if (existing && existing !== entry[0]) {
        throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      }
      idToSchema.set(id, entry[0]);
    }
  }
  const makeURI = /* @__PURE__ */ __name((entry) => {
    const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
    if (ctx.external) {
      const externalId = ctx.external.registry.get(entry[0])?.id;
      const uriGenerator = ctx.external.uri ?? ((id2) => id2);
      if (externalId) {
        return { ref: uriGenerator(externalId) };
      }
      const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
      entry[1].defId = id;
      return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}` };
    }
    if (entry[1] === root) {
      return { ref: "#" };
    }
    const uriPrefix = `#`;
    const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
    const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
    return { defId, ref: defUriPrefix + defId };
  }, "makeURI");
  const extractToDef = /* @__PURE__ */ __name((entry) => {
    if (entry[1].schema.$ref) {
      return;
    }
    const seen = entry[1];
    const { ref, defId } = makeURI(entry);
    seen.def = { ...seen.schema };
    if (defId)
      seen.defId = defId;
    const schema2 = seen.schema;
    for (const key in schema2) {
      delete schema2[key];
    }
    schema2.$ref = ref;
  }, "extractToDef");
  if (ctx.cycles === "throw") {
    for (const entry of ctx.seen.entries()) {
      const seen = entry[1];
      if (seen.cycle) {
        throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
      }
    }
  }
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (schema === entry[0]) {
      extractToDef(entry);
      continue;
    }
    if (ctx.external) {
      const ext = ctx.external.registry.get(entry[0])?.id;
      if (schema !== entry[0] && ext) {
        extractToDef(entry);
        continue;
      }
    }
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      extractToDef(entry);
      continue;
    }
    if (seen.cycle) {
      extractToDef(entry);
      continue;
    }
    if (seen.count > 1) {
      if (ctx.reused === "ref") {
        extractToDef(entry);
        continue;
      }
    }
  }
}
__name(extractDefs, "extractDefs");
function finalize(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const flattenRef = /* @__PURE__ */ __name((zodSchema) => {
    const seen = ctx.seen.get(zodSchema);
    if (seen.ref === null)
      return;
    const schema2 = seen.def ?? seen.schema;
    const _cached = { ...schema2 };
    const ref = seen.ref;
    seen.ref = null;
    if (ref) {
      flattenRef(ref);
      const refSeen = ctx.seen.get(ref);
      const refSchema = refSeen.schema;
      if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
        schema2.allOf = schema2.allOf ?? [];
        schema2.allOf.push(refSchema);
      } else {
        Object.assign(schema2, refSchema);
      }
      Object.assign(schema2, _cached);
      const isParentRef = zodSchema._zod.parent === ref;
      if (isParentRef) {
        for (const key in schema2) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (!(key in _cached)) {
            delete schema2[key];
          }
        }
      }
      if (refSchema.$ref && refSeen.def) {
        for (const key in schema2) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (key in refSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(refSeen.def[key])) {
            delete schema2[key];
          }
        }
      }
    }
    const parent = zodSchema._zod.parent;
    if (parent && parent !== ref) {
      flattenRef(parent);
      const parentSeen = ctx.seen.get(parent);
      if (parentSeen?.schema.$ref) {
        schema2.$ref = parentSeen.schema.$ref;
        if (parentSeen.def) {
          for (const key in schema2) {
            if (key === "$ref" || key === "allOf")
              continue;
            if (key in parentSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(parentSeen.def[key])) {
              delete schema2[key];
            }
          }
        }
      }
    }
    ctx.override({
      zodSchema,
      jsonSchema: schema2,
      path: seen.path ?? []
    });
  }, "flattenRef");
  for (const entry of [...ctx.seen.entries()].reverse()) {
    flattenRef(entry[0]);
  }
  const result = {};
  if (ctx.target === "draft-2020-12") {
    result.$schema = "https://json-schema.org/draft/2020-12/schema";
  } else if (ctx.target === "draft-07") {
    result.$schema = "http://json-schema.org/draft-07/schema#";
  } else if (ctx.target === "draft-04") {
    result.$schema = "http://json-schema.org/draft-04/schema#";
  } else if (ctx.target === "openapi-3.0") {
  } else {
  }
  if (ctx.external?.uri) {
    const id = ctx.external.registry.get(schema)?.id;
    if (!id)
      throw new Error("Schema is missing an `id` property");
    result.$id = ctx.external.uri(id);
  }
  Object.assign(result, root.def ?? root.schema);
  const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
  if (rootMetaId !== void 0 && result.id === rootMetaId)
    delete result.id;
  const defs = ctx.external?.defs ?? {};
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (seen.def && seen.defId) {
      if (seen.def.id === seen.defId)
        delete seen.def.id;
      defs[seen.defId] = seen.def;
    }
  }
  if (ctx.external) {
  } else {
    if (Object.keys(defs).length > 0) {
      if (ctx.target === "draft-2020-12") {
        result.$defs = defs;
      } else {
        result.definitions = defs;
      }
    }
  }
  try {
    const finalized = JSON.parse(JSON.stringify(result));
    Object.defineProperty(finalized, "~standard", {
      value: {
        ...schema["~standard"],
        jsonSchema: {
          input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
          output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
        }
      },
      enumerable: false,
      writable: false
    });
    return finalized;
  } catch (_err) {
    throw new Error("Error converting schema to JSON.");
  }
}
__name(finalize, "finalize");
function isTransforming(_schema, _ctx) {
  const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
  if (ctx.seen.has(_schema))
    return false;
  ctx.seen.add(_schema);
  const def = _schema._zod.def;
  if (def.type === "transform")
    return true;
  if (def.type === "array")
    return isTransforming(def.element, ctx);
  if (def.type === "set")
    return isTransforming(def.valueType, ctx);
  if (def.type === "lazy")
    return isTransforming(def.getter(), ctx);
  if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") {
    return isTransforming(def.innerType, ctx);
  }
  if (def.type === "intersection") {
    return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
  }
  if (def.type === "record" || def.type === "map") {
    return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
  }
  if (def.type === "pipe") {
    if (_schema._zod.traits.has("$ZodCodec"))
      return true;
    return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
  }
  if (def.type === "object") {
    for (const key in def.shape) {
      if (isTransforming(def.shape[key], ctx))
        return true;
    }
    return false;
  }
  if (def.type === "union") {
    for (const option of def.options) {
      if (isTransforming(option, ctx))
        return true;
    }
    return false;
  }
  if (def.type === "tuple") {
    for (const item of def.items) {
      if (isTransforming(item, ctx))
        return true;
    }
    if (def.rest && isTransforming(def.rest, ctx))
      return true;
    return false;
  }
  return false;
}
__name(isTransforming, "isTransforming");
var createToJSONSchemaMethod = /* @__PURE__ */ __name((schema, processors = {}) => (params) => {
  const ctx = initializeContext({ ...params, processors });
  process(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
}, "createToJSONSchemaMethod");
var createStandardJSONSchemaMethod = /* @__PURE__ */ __name((schema, io, processors = {}) => (params) => {
  const { libraryOptions, target } = params ?? {};
  const ctx = initializeContext({ ...libraryOptions ?? {}, target, io, processors });
  process(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
}, "createStandardJSONSchemaMethod");

// node_modules/zod/v4/core/json-schema-processors.js
init_modules_watch_stub();
var formatMap = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
  // do not set
};
var stringProcessor = /* @__PURE__ */ __name((schema, ctx, _json, _params) => {
  const json2 = _json;
  json2.type = "string";
  const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
  if (typeof minimum === "number")
    json2.minLength = minimum;
  if (typeof maximum === "number")
    json2.maxLength = maximum;
  if (format) {
    json2.format = formatMap[format] ?? format;
    if (json2.format === "")
      delete json2.format;
    if (format === "time") {
      delete json2.format;
    }
  }
  if (contentEncoding)
    json2.contentEncoding = contentEncoding;
  if (patterns && patterns.size > 0) {
    const regexes = [...patterns];
    if (regexes.length === 1)
      json2.pattern = regexes[0].source;
    else if (regexes.length > 1) {
      json2.allOf = [
        ...regexes.map((regex) => ({
          ...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
          pattern: regex.source
        }))
      ];
    }
  }
}, "stringProcessor");
var numberProcessor = /* @__PURE__ */ __name((schema, ctx, _json, _params) => {
  const json2 = _json;
  const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
  if (typeof format === "string" && format.includes("int"))
    json2.type = "integer";
  else
    json2.type = "number";
  const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
  const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
  const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
  if (exMin) {
    if (legacy) {
      json2.minimum = exclusiveMinimum;
      json2.exclusiveMinimum = true;
    } else {
      json2.exclusiveMinimum = exclusiveMinimum;
    }
  } else if (typeof minimum === "number") {
    json2.minimum = minimum;
  }
  if (exMax) {
    if (legacy) {
      json2.maximum = exclusiveMaximum;
      json2.exclusiveMaximum = true;
    } else {
      json2.exclusiveMaximum = exclusiveMaximum;
    }
  } else if (typeof maximum === "number") {
    json2.maximum = maximum;
  }
  if (typeof multipleOf === "number")
    json2.multipleOf = multipleOf;
}, "numberProcessor");
var booleanProcessor = /* @__PURE__ */ __name((_schema, _ctx, json2, _params) => {
  json2.type = "boolean";
}, "booleanProcessor");
var nullProcessor = /* @__PURE__ */ __name((_schema, ctx, json2, _params) => {
  if (ctx.target === "openapi-3.0") {
    json2.type = "string";
    json2.nullable = true;
    json2.enum = [null];
  } else {
    json2.type = "null";
  }
}, "nullProcessor");
var neverProcessor = /* @__PURE__ */ __name((_schema, _ctx, json2, _params) => {
  json2.not = {};
}, "neverProcessor");
var unknownProcessor = /* @__PURE__ */ __name((_schema, _ctx, _json, _params) => {
}, "unknownProcessor");
var enumProcessor = /* @__PURE__ */ __name((schema, _ctx, json2, _params) => {
  const def = schema._zod.def;
  const values = getEnumValues(def.entries);
  if (values.every((v) => typeof v === "number"))
    json2.type = "number";
  if (values.every((v) => typeof v === "string"))
    json2.type = "string";
  json2.enum = values;
}, "enumProcessor");
var literalProcessor = /* @__PURE__ */ __name((schema, ctx, json2, _params) => {
  const def = schema._zod.def;
  const vals = [];
  for (const val of def.values) {
    if (val === void 0) {
      if (ctx.unrepresentable === "throw") {
        throw new Error("Literal `undefined` cannot be represented in JSON Schema");
      } else {
      }
    } else if (typeof val === "bigint") {
      if (ctx.unrepresentable === "throw") {
        throw new Error("BigInt literals cannot be represented in JSON Schema");
      } else {
        vals.push(Number(val));
      }
    } else {
      vals.push(val);
    }
  }
  if (vals.length === 0) {
  } else if (vals.length === 1) {
    const val = vals[0];
    json2.type = val === null ? "null" : typeof val;
    if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
      json2.enum = [val];
    } else {
      json2.const = val;
    }
  } else {
    if (vals.every((v) => typeof v === "number"))
      json2.type = "number";
    if (vals.every((v) => typeof v === "string"))
      json2.type = "string";
    if (vals.every((v) => typeof v === "boolean"))
      json2.type = "boolean";
    if (vals.every((v) => v === null))
      json2.type = "null";
    json2.enum = vals;
  }
}, "literalProcessor");
var customProcessor = /* @__PURE__ */ __name((_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Custom types cannot be represented in JSON Schema");
  }
}, "customProcessor");
var transformProcessor = /* @__PURE__ */ __name((_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Transforms cannot be represented in JSON Schema");
  }
}, "transformProcessor");
var arrayProcessor = /* @__PURE__ */ __name((schema, ctx, _json, params) => {
  const json2 = _json;
  const def = schema._zod.def;
  const { minimum, maximum } = schema._zod.bag;
  if (typeof minimum === "number")
    json2.minItems = minimum;
  if (typeof maximum === "number")
    json2.maxItems = maximum;
  json2.type = "array";
  json2.items = process(def.element, ctx, {
    ...params,
    path: [...params.path, "items"]
  });
}, "arrayProcessor");
var objectProcessor = /* @__PURE__ */ __name((schema, ctx, _json, params) => {
  const json2 = _json;
  const def = schema._zod.def;
  json2.type = "object";
  json2.properties = {};
  const shape = def.shape;
  for (const key in shape) {
    json2.properties[key] = process(shape[key], ctx, {
      ...params,
      path: [...params.path, "properties", key]
    });
  }
  const allKeys = new Set(Object.keys(shape));
  const requiredKeys = new Set([...allKeys].filter((key) => {
    const v = def.shape[key]._zod;
    if (ctx.io === "input") {
      return v.optin === void 0;
    } else {
      return v.optout === void 0;
    }
  }));
  if (requiredKeys.size > 0) {
    json2.required = Array.from(requiredKeys);
  }
  if (def.catchall?._zod.def.type === "never") {
    json2.additionalProperties = false;
  } else if (!def.catchall) {
    if (ctx.io === "output")
      json2.additionalProperties = false;
  } else if (def.catchall) {
    json2.additionalProperties = process(def.catchall, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
}, "objectProcessor");
var unionProcessor = /* @__PURE__ */ __name((schema, ctx, json2, params) => {
  const def = schema._zod.def;
  const isExclusive = def.inclusive === false;
  const options = def.options.map((x, i) => process(x, ctx, {
    ...params,
    path: [...params.path, isExclusive ? "oneOf" : "anyOf", i]
  }));
  if (isExclusive) {
    json2.oneOf = options;
  } else {
    json2.anyOf = options;
  }
}, "unionProcessor");
var intersectionProcessor = /* @__PURE__ */ __name((schema, ctx, json2, params) => {
  const def = schema._zod.def;
  const a = process(def.left, ctx, {
    ...params,
    path: [...params.path, "allOf", 0]
  });
  const b = process(def.right, ctx, {
    ...params,
    path: [...params.path, "allOf", 1]
  });
  const isSimpleIntersection = /* @__PURE__ */ __name((val) => "allOf" in val && Object.keys(val).length === 1, "isSimpleIntersection");
  const allOf = [
    ...isSimpleIntersection(a) ? a.allOf : [a],
    ...isSimpleIntersection(b) ? b.allOf : [b]
  ];
  json2.allOf = allOf;
}, "intersectionProcessor");
var recordProcessor = /* @__PURE__ */ __name((schema, ctx, _json, params) => {
  const json2 = _json;
  const def = schema._zod.def;
  json2.type = "object";
  const keyType = def.keyType;
  const keyBag = keyType._zod.bag;
  const patterns = keyBag?.patterns;
  if (def.mode === "loose" && patterns && patterns.size > 0) {
    const valueSchema = process(def.valueType, ctx, {
      ...params,
      path: [...params.path, "patternProperties", "*"]
    });
    json2.patternProperties = {};
    for (const pattern of patterns) {
      json2.patternProperties[pattern.source] = valueSchema;
    }
  } else {
    if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") {
      json2.propertyNames = process(def.keyType, ctx, {
        ...params,
        path: [...params.path, "propertyNames"]
      });
    }
    json2.additionalProperties = process(def.valueType, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
  const keyValues = keyType._zod.values;
  if (keyValues) {
    const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
    if (validKeyValues.length > 0) {
      json2.required = validKeyValues;
    }
  }
}, "recordProcessor");
var nullableProcessor = /* @__PURE__ */ __name((schema, ctx, json2, params) => {
  const def = schema._zod.def;
  const inner = process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  if (ctx.target === "openapi-3.0") {
    seen.ref = def.innerType;
    json2.nullable = true;
  } else {
    json2.anyOf = [inner, { type: "null" }];
  }
}, "nullableProcessor");
var nonoptionalProcessor = /* @__PURE__ */ __name((schema, ctx, _json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
}, "nonoptionalProcessor");
var defaultProcessor = /* @__PURE__ */ __name((schema, ctx, json2, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  json2.default = JSON.parse(JSON.stringify(def.defaultValue));
}, "defaultProcessor");
var prefaultProcessor = /* @__PURE__ */ __name((schema, ctx, json2, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  if (ctx.io === "input")
    json2._prefault = JSON.parse(JSON.stringify(def.defaultValue));
}, "prefaultProcessor");
var catchProcessor = /* @__PURE__ */ __name((schema, ctx, json2, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  let catchValue;
  try {
    catchValue = def.catchValue(void 0);
  } catch {
    throw new Error("Dynamic catch values are not supported in JSON Schema");
  }
  json2.default = catchValue;
}, "catchProcessor");
var pipeProcessor = /* @__PURE__ */ __name((schema, ctx, _json, params) => {
  const def = schema._zod.def;
  const inIsTransform = def.in._zod.traits.has("$ZodTransform");
  const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
  process(innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = innerType;
}, "pipeProcessor");
var readonlyProcessor = /* @__PURE__ */ __name((schema, ctx, json2, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  json2.readOnly = true;
}, "readonlyProcessor");
var optionalProcessor = /* @__PURE__ */ __name((schema, ctx, _json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
}, "optionalProcessor");

// node_modules/zod/v4/mini/parse.js
init_modules_watch_stub();

// node_modules/@modelcontextprotocol/sdk/dist/esm/server/zod-compat.js
function isZ4Schema(s) {
  const schema = s;
  return !!schema._zod;
}
__name(isZ4Schema, "isZ4Schema");
function safeParse2(schema, data) {
  if (isZ4Schema(schema)) {
    const result2 = safeParse(schema, data);
    return result2;
  }
  const v3Schema = schema;
  const result = v3Schema.safeParse(data);
  return result;
}
__name(safeParse2, "safeParse");
function getObjectShape(schema) {
  if (!schema)
    return void 0;
  let rawShape;
  if (isZ4Schema(schema)) {
    const v4Schema = schema;
    rawShape = v4Schema._zod?.def?.shape;
  } else {
    const v3Schema = schema;
    rawShape = v3Schema.shape;
  }
  if (!rawShape)
    return void 0;
  if (typeof rawShape === "function") {
    try {
      return rawShape();
    } catch {
      return void 0;
    }
  }
  return rawShape;
}
__name(getObjectShape, "getObjectShape");
function getLiteralValue(schema) {
  if (isZ4Schema(schema)) {
    const v4Schema = schema;
    const def2 = v4Schema._zod?.def;
    if (def2) {
      if (def2.value !== void 0)
        return def2.value;
      if (Array.isArray(def2.values) && def2.values.length > 0) {
        return def2.values[0];
      }
    }
  }
  const v3Schema = schema;
  const def = v3Schema._def;
  if (def) {
    if (def.value !== void 0)
      return def.value;
    if (Array.isArray(def.values) && def.values.length > 0) {
      return def.values[0];
    }
  }
  const directValue = schema.value;
  if (directValue !== void 0)
    return directValue;
  return void 0;
}
__name(getLiteralValue, "getLiteralValue");

// node_modules/@modelcontextprotocol/sdk/dist/esm/types.js
init_modules_watch_stub();

// node_modules/zod/v4/classic/external.js
init_modules_watch_stub();

// node_modules/zod/v4/classic/schemas.js
init_modules_watch_stub();

// node_modules/zod/v4/classic/checks.js
init_modules_watch_stub();

// node_modules/zod/v4/classic/iso.js
var iso_exports = {};
__export(iso_exports, {
  ZodISODate: () => ZodISODate,
  ZodISODateTime: () => ZodISODateTime,
  ZodISODuration: () => ZodISODuration,
  ZodISOTime: () => ZodISOTime,
  date: () => date2,
  datetime: () => datetime2,
  duration: () => duration2,
  time: () => time2
});
init_modules_watch_stub();
var ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
  $ZodISODateTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function datetime2(params) {
  return _isoDateTime(ZodISODateTime, params);
}
__name(datetime2, "datetime");
var ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
  $ZodISODate.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function date2(params) {
  return _isoDate(ZodISODate, params);
}
__name(date2, "date");
var ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
  $ZodISOTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function time2(params) {
  return _isoTime(ZodISOTime, params);
}
__name(time2, "time");
var ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
  $ZodISODuration.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function duration2(params) {
  return _isoDuration(ZodISODuration, params);
}
__name(duration2, "duration");

// node_modules/zod/v4/classic/parse.js
init_modules_watch_stub();

// node_modules/zod/v4/classic/errors.js
init_modules_watch_stub();
var initializer2 = /* @__PURE__ */ __name((inst, issues) => {
  $ZodError.init(inst, issues);
  inst.name = "ZodError";
  Object.defineProperties(inst, {
    format: {
      value: /* @__PURE__ */ __name((mapper) => formatError(inst, mapper), "value")
      // enumerable: false,
    },
    flatten: {
      value: /* @__PURE__ */ __name((mapper) => flattenError(inst, mapper), "value")
      // enumerable: false,
    },
    addIssue: {
      value: /* @__PURE__ */ __name((issue2) => {
        inst.issues.push(issue2);
        inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }, "value")
      // enumerable: false,
    },
    addIssues: {
      value: /* @__PURE__ */ __name((issues2) => {
        inst.issues.push(...issues2);
        inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }, "value")
      // enumerable: false,
    },
    isEmpty: {
      get() {
        return inst.issues.length === 0;
      }
      // enumerable: false,
    }
  });
}, "initializer");
var ZodRealError = /* @__PURE__ */ $constructor("ZodError", initializer2, {
  Parent: Error
});

// node_modules/zod/v4/classic/parse.js
var parse2 = /* @__PURE__ */ _parse(ZodRealError);
var parseAsync2 = /* @__PURE__ */ _parseAsync(ZodRealError);
var safeParse3 = /* @__PURE__ */ _safeParse(ZodRealError);
var safeParseAsync2 = /* @__PURE__ */ _safeParseAsync(ZodRealError);
var encode2 = /* @__PURE__ */ _encode(ZodRealError);
var decode2 = /* @__PURE__ */ _decode(ZodRealError);
var encodeAsync2 = /* @__PURE__ */ _encodeAsync(ZodRealError);
var decodeAsync2 = /* @__PURE__ */ _decodeAsync(ZodRealError);
var safeEncode2 = /* @__PURE__ */ _safeEncode(ZodRealError);
var safeDecode2 = /* @__PURE__ */ _safeDecode(ZodRealError);
var safeEncodeAsync2 = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
var safeDecodeAsync2 = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);

// node_modules/zod/v4/classic/schemas.js
var _installedGroups = /* @__PURE__ */ new WeakMap();
function _installLazyMethods(inst, group, methods) {
  const proto = Object.getPrototypeOf(inst);
  let installed = _installedGroups.get(proto);
  if (!installed) {
    installed = /* @__PURE__ */ new Set();
    _installedGroups.set(proto, installed);
  }
  if (installed.has(group))
    return;
  installed.add(group);
  for (const key in methods) {
    const fn = methods[key];
    Object.defineProperty(proto, key, {
      configurable: true,
      enumerable: false,
      get() {
        const bound = fn.bind(this);
        Object.defineProperty(this, key, {
          configurable: true,
          writable: true,
          enumerable: true,
          value: bound
        });
        return bound;
      },
      set(v) {
        Object.defineProperty(this, key, {
          configurable: true,
          writable: true,
          enumerable: true,
          value: v
        });
      }
    });
  }
}
__name(_installLazyMethods, "_installLazyMethods");
var ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
  $ZodType.init(inst, def);
  Object.assign(inst["~standard"], {
    jsonSchema: {
      input: createStandardJSONSchemaMethod(inst, "input"),
      output: createStandardJSONSchemaMethod(inst, "output")
    }
  });
  inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
  inst.def = def;
  inst.type = def.type;
  Object.defineProperty(inst, "_def", { value: def });
  inst.parse = (data, params) => parse2(inst, data, params, { callee: inst.parse });
  inst.safeParse = (data, params) => safeParse3(inst, data, params);
  inst.parseAsync = async (data, params) => parseAsync2(inst, data, params, { callee: inst.parseAsync });
  inst.safeParseAsync = async (data, params) => safeParseAsync2(inst, data, params);
  inst.spa = inst.safeParseAsync;
  inst.encode = (data, params) => encode2(inst, data, params);
  inst.decode = (data, params) => decode2(inst, data, params);
  inst.encodeAsync = async (data, params) => encodeAsync2(inst, data, params);
  inst.decodeAsync = async (data, params) => decodeAsync2(inst, data, params);
  inst.safeEncode = (data, params) => safeEncode2(inst, data, params);
  inst.safeDecode = (data, params) => safeDecode2(inst, data, params);
  inst.safeEncodeAsync = async (data, params) => safeEncodeAsync2(inst, data, params);
  inst.safeDecodeAsync = async (data, params) => safeDecodeAsync2(inst, data, params);
  _installLazyMethods(inst, "ZodType", {
    check(...chks) {
      const def2 = this.def;
      return this.clone(util_exports.mergeDefs(def2, {
        checks: [
          ...def2.checks ?? [],
          ...chks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
        ]
      }), { parent: true });
    },
    with(...chks) {
      return this.check(...chks);
    },
    clone(def2, params) {
      return clone(this, def2, params);
    },
    brand() {
      return this;
    },
    register(reg, meta2) {
      reg.add(this, meta2);
      return this;
    },
    refine(check, params) {
      return this.check(refine(check, params));
    },
    superRefine(refinement, params) {
      return this.check(superRefine(refinement, params));
    },
    overwrite(fn) {
      return this.check(_overwrite(fn));
    },
    optional() {
      return optional(this);
    },
    exactOptional() {
      return exactOptional(this);
    },
    nullable() {
      return nullable(this);
    },
    nullish() {
      return optional(nullable(this));
    },
    nonoptional(params) {
      return nonoptional(this, params);
    },
    array() {
      return array(this);
    },
    or(arg) {
      return union([this, arg]);
    },
    and(arg) {
      return intersection(this, arg);
    },
    transform(tx) {
      return pipe(this, transform(tx));
    },
    default(d) {
      return _default(this, d);
    },
    prefault(d) {
      return prefault(this, d);
    },
    catch(params) {
      return _catch(this, params);
    },
    pipe(target) {
      return pipe(this, target);
    },
    readonly() {
      return readonly(this);
    },
    describe(description) {
      const cl = this.clone();
      globalRegistry.add(cl, { description });
      return cl;
    },
    meta(...args) {
      if (args.length === 0)
        return globalRegistry.get(this);
      const cl = this.clone();
      globalRegistry.add(cl, args[0]);
      return cl;
    },
    isOptional() {
      return this.safeParse(void 0).success;
    },
    isNullable() {
      return this.safeParse(null).success;
    },
    apply(fn) {
      return fn(this);
    }
  });
  Object.defineProperty(inst, "description", {
    get() {
      return globalRegistry.get(inst)?.description;
    },
    configurable: true
  });
  return inst;
});
var _ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def) => {
  $ZodString.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => stringProcessor(inst, ctx, json2, params);
  const bag = inst._zod.bag;
  inst.format = bag.format ?? null;
  inst.minLength = bag.minimum ?? null;
  inst.maxLength = bag.maximum ?? null;
  _installLazyMethods(inst, "_ZodString", {
    regex(...args) {
      return this.check(_regex(...args));
    },
    includes(...args) {
      return this.check(_includes(...args));
    },
    startsWith(...args) {
      return this.check(_startsWith(...args));
    },
    endsWith(...args) {
      return this.check(_endsWith(...args));
    },
    min(...args) {
      return this.check(_minLength(...args));
    },
    max(...args) {
      return this.check(_maxLength(...args));
    },
    length(...args) {
      return this.check(_length(...args));
    },
    nonempty(...args) {
      return this.check(_minLength(1, ...args));
    },
    lowercase(params) {
      return this.check(_lowercase(params));
    },
    uppercase(params) {
      return this.check(_uppercase(params));
    },
    trim() {
      return this.check(_trim());
    },
    normalize(...args) {
      return this.check(_normalize(...args));
    },
    toLowerCase() {
      return this.check(_toLowerCase());
    },
    toUpperCase() {
      return this.check(_toUpperCase());
    },
    slugify() {
      return this.check(_slugify());
    }
  });
});
var ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
  $ZodString.init(inst, def);
  _ZodString.init(inst, def);
  inst.email = (params) => inst.check(_email(ZodEmail, params));
  inst.url = (params) => inst.check(_url(ZodURL, params));
  inst.jwt = (params) => inst.check(_jwt(ZodJWT, params));
  inst.emoji = (params) => inst.check(_emoji2(ZodEmoji, params));
  inst.guid = (params) => inst.check(_guid(ZodGUID, params));
  inst.uuid = (params) => inst.check(_uuid(ZodUUID, params));
  inst.uuidv4 = (params) => inst.check(_uuidv4(ZodUUID, params));
  inst.uuidv6 = (params) => inst.check(_uuidv6(ZodUUID, params));
  inst.uuidv7 = (params) => inst.check(_uuidv7(ZodUUID, params));
  inst.nanoid = (params) => inst.check(_nanoid(ZodNanoID, params));
  inst.guid = (params) => inst.check(_guid(ZodGUID, params));
  inst.cuid = (params) => inst.check(_cuid(ZodCUID, params));
  inst.cuid2 = (params) => inst.check(_cuid2(ZodCUID2, params));
  inst.ulid = (params) => inst.check(_ulid(ZodULID, params));
  inst.base64 = (params) => inst.check(_base64(ZodBase64, params));
  inst.base64url = (params) => inst.check(_base64url(ZodBase64URL, params));
  inst.xid = (params) => inst.check(_xid(ZodXID, params));
  inst.ksuid = (params) => inst.check(_ksuid(ZodKSUID, params));
  inst.ipv4 = (params) => inst.check(_ipv4(ZodIPv4, params));
  inst.ipv6 = (params) => inst.check(_ipv6(ZodIPv6, params));
  inst.cidrv4 = (params) => inst.check(_cidrv4(ZodCIDRv4, params));
  inst.cidrv6 = (params) => inst.check(_cidrv6(ZodCIDRv6, params));
  inst.e164 = (params) => inst.check(_e164(ZodE164, params));
  inst.datetime = (params) => inst.check(datetime2(params));
  inst.date = (params) => inst.check(date2(params));
  inst.time = (params) => inst.check(time2(params));
  inst.duration = (params) => inst.check(duration2(params));
});
function string2(params) {
  return _string(ZodString, params);
}
__name(string2, "string");
var ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  _ZodString.init(inst, def);
});
var ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
  $ZodEmail.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
  $ZodGUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
  $ZodUUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
  $ZodURL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
  $ZodEmoji.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
  $ZodNanoID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
  $ZodCUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
  $ZodCUID2.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
  $ZodULID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
  $ZodXID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
  $ZodKSUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
  $ZodIPv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
  $ZodIPv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
  $ZodCIDRv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
  $ZodCIDRv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
  $ZodBase64.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
  $ZodBase64URL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
  $ZodE164.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
  $ZodJWT.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodNumber = /* @__PURE__ */ $constructor("ZodNumber", (inst, def) => {
  $ZodNumber.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => numberProcessor(inst, ctx, json2, params);
  _installLazyMethods(inst, "ZodNumber", {
    gt(value, params) {
      return this.check(_gt(value, params));
    },
    gte(value, params) {
      return this.check(_gte(value, params));
    },
    min(value, params) {
      return this.check(_gte(value, params));
    },
    lt(value, params) {
      return this.check(_lt(value, params));
    },
    lte(value, params) {
      return this.check(_lte(value, params));
    },
    max(value, params) {
      return this.check(_lte(value, params));
    },
    int(params) {
      return this.check(int(params));
    },
    safe(params) {
      return this.check(int(params));
    },
    positive(params) {
      return this.check(_gt(0, params));
    },
    nonnegative(params) {
      return this.check(_gte(0, params));
    },
    negative(params) {
      return this.check(_lt(0, params));
    },
    nonpositive(params) {
      return this.check(_lte(0, params));
    },
    multipleOf(value, params) {
      return this.check(_multipleOf(value, params));
    },
    step(value, params) {
      return this.check(_multipleOf(value, params));
    },
    finite() {
      return this;
    }
  });
  const bag = inst._zod.bag;
  inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
  inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
  inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? 0.5);
  inst.isFinite = true;
  inst.format = bag.format ?? null;
});
function number2(params) {
  return _number(ZodNumber, params);
}
__name(number2, "number");
var ZodNumberFormat = /* @__PURE__ */ $constructor("ZodNumberFormat", (inst, def) => {
  $ZodNumberFormat.init(inst, def);
  ZodNumber.init(inst, def);
});
function int(params) {
  return _int(ZodNumberFormat, params);
}
__name(int, "int");
var ZodBoolean = /* @__PURE__ */ $constructor("ZodBoolean", (inst, def) => {
  $ZodBoolean.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => booleanProcessor(inst, ctx, json2, params);
});
function boolean2(params) {
  return _boolean(ZodBoolean, params);
}
__name(boolean2, "boolean");
var ZodNull = /* @__PURE__ */ $constructor("ZodNull", (inst, def) => {
  $ZodNull.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => nullProcessor(inst, ctx, json2, params);
});
function _null3(params) {
  return _null2(ZodNull, params);
}
__name(_null3, "_null");
var ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
  $ZodUnknown.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => unknownProcessor(inst, ctx, json2, params);
});
function unknown() {
  return _unknown(ZodUnknown);
}
__name(unknown, "unknown");
var ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
  $ZodNever.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => neverProcessor(inst, ctx, json2, params);
});
function never(params) {
  return _never(ZodNever, params);
}
__name(never, "never");
var ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
  $ZodArray.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => arrayProcessor(inst, ctx, json2, params);
  inst.element = def.element;
  _installLazyMethods(inst, "ZodArray", {
    min(n, params) {
      return this.check(_minLength(n, params));
    },
    nonempty(params) {
      return this.check(_minLength(1, params));
    },
    max(n, params) {
      return this.check(_maxLength(n, params));
    },
    length(n, params) {
      return this.check(_length(n, params));
    },
    unwrap() {
      return this.element;
    }
  });
});
function array(element, params) {
  return _array(ZodArray, element, params);
}
__name(array, "array");
var ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
  $ZodObjectJIT.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => objectProcessor(inst, ctx, json2, params);
  util_exports.defineLazy(inst, "shape", () => {
    return def.shape;
  });
  _installLazyMethods(inst, "ZodObject", {
    keyof() {
      return _enum(Object.keys(this._zod.def.shape));
    },
    catchall(catchall) {
      return this.clone({ ...this._zod.def, catchall });
    },
    passthrough() {
      return this.clone({ ...this._zod.def, catchall: unknown() });
    },
    loose() {
      return this.clone({ ...this._zod.def, catchall: unknown() });
    },
    strict() {
      return this.clone({ ...this._zod.def, catchall: never() });
    },
    strip() {
      return this.clone({ ...this._zod.def, catchall: void 0 });
    },
    extend(incoming) {
      return util_exports.extend(this, incoming);
    },
    safeExtend(incoming) {
      return util_exports.safeExtend(this, incoming);
    },
    merge(other) {
      return util_exports.merge(this, other);
    },
    pick(mask) {
      return util_exports.pick(this, mask);
    },
    omit(mask) {
      return util_exports.omit(this, mask);
    },
    partial(...args) {
      return util_exports.partial(ZodOptional, this, args[0]);
    },
    required(...args) {
      return util_exports.required(ZodNonOptional, this, args[0]);
    }
  });
});
function object2(shape, params) {
  const def = {
    type: "object",
    shape: shape ?? {},
    ...util_exports.normalizeParams(params)
  };
  return new ZodObject(def);
}
__name(object2, "object");
function looseObject(shape, params) {
  return new ZodObject({
    type: "object",
    shape,
    catchall: unknown(),
    ...util_exports.normalizeParams(params)
  });
}
__name(looseObject, "looseObject");
var ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
  $ZodUnion.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => unionProcessor(inst, ctx, json2, params);
  inst.options = def.options;
});
function union(options, params) {
  return new ZodUnion({
    type: "union",
    options,
    ...util_exports.normalizeParams(params)
  });
}
__name(union, "union");
var ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("ZodDiscriminatedUnion", (inst, def) => {
  ZodUnion.init(inst, def);
  $ZodDiscriminatedUnion.init(inst, def);
});
function discriminatedUnion(discriminator, options, params) {
  return new ZodDiscriminatedUnion({
    type: "union",
    options,
    discriminator,
    ...util_exports.normalizeParams(params)
  });
}
__name(discriminatedUnion, "discriminatedUnion");
var ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
  $ZodIntersection.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => intersectionProcessor(inst, ctx, json2, params);
});
function intersection(left, right) {
  return new ZodIntersection({
    type: "intersection",
    left,
    right
  });
}
__name(intersection, "intersection");
var ZodRecord = /* @__PURE__ */ $constructor("ZodRecord", (inst, def) => {
  $ZodRecord.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => recordProcessor(inst, ctx, json2, params);
  inst.keyType = def.keyType;
  inst.valueType = def.valueType;
});
function record(keyType, valueType, params) {
  if (!valueType || !valueType._zod) {
    return new ZodRecord({
      type: "record",
      keyType: string2(),
      valueType: keyType,
      ...util_exports.normalizeParams(valueType)
    });
  }
  return new ZodRecord({
    type: "record",
    keyType,
    valueType,
    ...util_exports.normalizeParams(params)
  });
}
__name(record, "record");
var ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
  $ZodEnum.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => enumProcessor(inst, ctx, json2, params);
  inst.enum = def.entries;
  inst.options = Object.values(def.entries);
  const keys = new Set(Object.keys(def.entries));
  inst.extract = (values, params) => {
    const newEntries = {};
    for (const value of values) {
      if (keys.has(value)) {
        newEntries[value] = def.entries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...util_exports.normalizeParams(params),
      entries: newEntries
    });
  };
  inst.exclude = (values, params) => {
    const newEntries = { ...def.entries };
    for (const value of values) {
      if (keys.has(value)) {
        delete newEntries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...util_exports.normalizeParams(params),
      entries: newEntries
    });
  };
});
function _enum(values, params) {
  const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
  return new ZodEnum({
    type: "enum",
    entries,
    ...util_exports.normalizeParams(params)
  });
}
__name(_enum, "_enum");
var ZodLiteral = /* @__PURE__ */ $constructor("ZodLiteral", (inst, def) => {
  $ZodLiteral.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => literalProcessor(inst, ctx, json2, params);
  inst.values = new Set(def.values);
  Object.defineProperty(inst, "value", {
    get() {
      if (def.values.length > 1) {
        throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
      }
      return def.values[0];
    }
  });
});
function literal(value, params) {
  return new ZodLiteral({
    type: "literal",
    values: Array.isArray(value) ? value : [value],
    ...util_exports.normalizeParams(params)
  });
}
__name(literal, "literal");
var ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
  $ZodTransform.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => transformProcessor(inst, ctx, json2, params);
  inst._zod.parse = (payload, _ctx) => {
    if (_ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(util_exports.issue(issue2, payload.value, def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        _issue.input ?? (_issue.input = payload.value);
        _issue.inst ?? (_issue.inst = inst);
        payload.issues.push(util_exports.issue(_issue));
      }
    };
    const output = def.transform(payload.value, payload);
    if (output instanceof Promise) {
      return output.then((output2) => {
        payload.value = output2;
        payload.fallback = true;
        return payload;
      });
    }
    payload.value = output;
    payload.fallback = true;
    return payload;
  };
});
function transform(fn) {
  return new ZodTransform({
    type: "transform",
    transform: fn
  });
}
__name(transform, "transform");
var ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => optionalProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
  return new ZodOptional({
    type: "optional",
    innerType
  });
}
__name(optional, "optional");
var ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
  $ZodExactOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => optionalProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
  return new ZodExactOptional({
    type: "optional",
    innerType
  });
}
__name(exactOptional, "exactOptional");
var ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
  $ZodNullable.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => nullableProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
  return new ZodNullable({
    type: "nullable",
    innerType
  });
}
__name(nullable, "nullable");
var ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
  $ZodDefault.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => defaultProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
  return new ZodDefault({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : util_exports.shallowClone(defaultValue);
    }
  });
}
__name(_default, "_default");
var ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
  $ZodPrefault.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => prefaultProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
  return new ZodPrefault({
    type: "prefault",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : util_exports.shallowClone(defaultValue);
    }
  });
}
__name(prefault, "prefault");
var ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
  $ZodNonOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => nonoptionalProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
  return new ZodNonOptional({
    type: "nonoptional",
    innerType,
    ...util_exports.normalizeParams(params)
  });
}
__name(nonoptional, "nonoptional");
var ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
  $ZodCatch.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => catchProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
  return new ZodCatch({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
  });
}
__name(_catch, "_catch");
var ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
  $ZodPipe.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => pipeProcessor(inst, ctx, json2, params);
  inst.in = def.in;
  inst.out = def.out;
});
function pipe(in_, out) {
  return new ZodPipe({
    type: "pipe",
    in: in_,
    out
    // ...util.normalizeParams(params),
  });
}
__name(pipe, "pipe");
var ZodPreprocess = /* @__PURE__ */ $constructor("ZodPreprocess", (inst, def) => {
  ZodPipe.init(inst, def);
  $ZodPreprocess.init(inst, def);
});
var ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
  $ZodReadonly.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => readonlyProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
  return new ZodReadonly({
    type: "readonly",
    innerType
  });
}
__name(readonly, "readonly");
var ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
  $ZodCustom.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => customProcessor(inst, ctx, json2, params);
});
function custom(fn, _params) {
  return _custom(ZodCustom, fn ?? (() => true), _params);
}
__name(custom, "custom");
function refine(fn, _params = {}) {
  return _refine(ZodCustom, fn, _params);
}
__name(refine, "refine");
function superRefine(fn, params) {
  return _superRefine(fn, params);
}
__name(superRefine, "superRefine");
function preprocess(fn, schema) {
  return new ZodPreprocess({
    type: "pipe",
    in: transform(fn),
    out: schema
  });
}
__name(preprocess, "preprocess");

// node_modules/zod/v4/classic/external.js
config(en_default());

// node_modules/@modelcontextprotocol/sdk/dist/esm/types.js
var LATEST_PROTOCOL_VERSION = "2025-11-25";
var DEFAULT_NEGOTIATED_PROTOCOL_VERSION = "2025-03-26";
var SUPPORTED_PROTOCOL_VERSIONS = [LATEST_PROTOCOL_VERSION, "2025-06-18", "2025-03-26", "2024-11-05", "2024-10-07"];
var RELATED_TASK_META_KEY = "io.modelcontextprotocol/related-task";
var JSONRPC_VERSION = "2.0";
var AssertObjectSchema = custom((v) => v !== null && (typeof v === "object" || typeof v === "function"));
var ProgressTokenSchema = union([string2(), number2().int()]);
var CursorSchema = string2();
var TaskCreationParamsSchema = looseObject({
  /**
   * Requested duration in milliseconds to retain task from creation.
   */
  ttl: number2().optional(),
  /**
   * Time in milliseconds to wait between task status requests.
   */
  pollInterval: number2().optional()
});
var TaskMetadataSchema = object2({
  ttl: number2().optional()
});
var RelatedTaskMetadataSchema = object2({
  taskId: string2()
});
var RequestMetaSchema = looseObject({
  /**
   * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
   */
  progressToken: ProgressTokenSchema.optional(),
  /**
   * If specified, this request is related to the provided task.
   */
  [RELATED_TASK_META_KEY]: RelatedTaskMetadataSchema.optional()
});
var BaseRequestParamsSchema = object2({
  /**
   * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
   */
  _meta: RequestMetaSchema.optional()
});
var TaskAugmentedRequestParamsSchema = BaseRequestParamsSchema.extend({
  /**
   * If specified, the caller is requesting task-augmented execution for this request.
   * The request will return a CreateTaskResult immediately, and the actual result can be
   * retrieved later via tasks/result.
   *
   * Task augmentation is subject to capability negotiation - receivers MUST declare support
   * for task augmentation of specific request types in their capabilities.
   */
  task: TaskMetadataSchema.optional()
});
var isTaskAugmentedRequestParams = /* @__PURE__ */ __name((value) => TaskAugmentedRequestParamsSchema.safeParse(value).success, "isTaskAugmentedRequestParams");
var RequestSchema = object2({
  method: string2(),
  params: BaseRequestParamsSchema.loose().optional()
});
var NotificationsParamsSchema = object2({
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: RequestMetaSchema.optional()
});
var NotificationSchema = object2({
  method: string2(),
  params: NotificationsParamsSchema.loose().optional()
});
var ResultSchema = looseObject({
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: RequestMetaSchema.optional()
});
var RequestIdSchema = union([string2(), number2().int()]);
var JSONRPCRequestSchema = object2({
  jsonrpc: literal(JSONRPC_VERSION),
  id: RequestIdSchema,
  ...RequestSchema.shape
}).strict();
var isJSONRPCRequest = /* @__PURE__ */ __name((value) => JSONRPCRequestSchema.safeParse(value).success, "isJSONRPCRequest");
var JSONRPCNotificationSchema = object2({
  jsonrpc: literal(JSONRPC_VERSION),
  ...NotificationSchema.shape
}).strict();
var isJSONRPCNotification = /* @__PURE__ */ __name((value) => JSONRPCNotificationSchema.safeParse(value).success, "isJSONRPCNotification");
var JSONRPCResultResponseSchema = object2({
  jsonrpc: literal(JSONRPC_VERSION),
  id: RequestIdSchema,
  result: ResultSchema
}).strict();
var isJSONRPCResultResponse = /* @__PURE__ */ __name((value) => JSONRPCResultResponseSchema.safeParse(value).success, "isJSONRPCResultResponse");
var ErrorCode;
(function(ErrorCode2) {
  ErrorCode2[ErrorCode2["ConnectionClosed"] = -32e3] = "ConnectionClosed";
  ErrorCode2[ErrorCode2["RequestTimeout"] = -32001] = "RequestTimeout";
  ErrorCode2[ErrorCode2["ParseError"] = -32700] = "ParseError";
  ErrorCode2[ErrorCode2["InvalidRequest"] = -32600] = "InvalidRequest";
  ErrorCode2[ErrorCode2["MethodNotFound"] = -32601] = "MethodNotFound";
  ErrorCode2[ErrorCode2["InvalidParams"] = -32602] = "InvalidParams";
  ErrorCode2[ErrorCode2["InternalError"] = -32603] = "InternalError";
  ErrorCode2[ErrorCode2["UrlElicitationRequired"] = -32042] = "UrlElicitationRequired";
})(ErrorCode || (ErrorCode = {}));
var JSONRPCErrorResponseSchema = object2({
  jsonrpc: literal(JSONRPC_VERSION),
  id: RequestIdSchema.optional(),
  error: object2({
    /**
     * The error type that occurred.
     */
    code: number2().int(),
    /**
     * A short description of the error. The message SHOULD be limited to a concise single sentence.
     */
    message: string2(),
    /**
     * Additional information about the error. The value of this member is defined by the sender (e.g. detailed error information, nested errors etc.).
     */
    data: unknown().optional()
  })
}).strict();
var isJSONRPCErrorResponse = /* @__PURE__ */ __name((value) => JSONRPCErrorResponseSchema.safeParse(value).success, "isJSONRPCErrorResponse");
var JSONRPCMessageSchema = union([
  JSONRPCRequestSchema,
  JSONRPCNotificationSchema,
  JSONRPCResultResponseSchema,
  JSONRPCErrorResponseSchema
]);
var JSONRPCResponseSchema = union([JSONRPCResultResponseSchema, JSONRPCErrorResponseSchema]);
var EmptyResultSchema = ResultSchema.strict();
var CancelledNotificationParamsSchema = NotificationsParamsSchema.extend({
  /**
   * The ID of the request to cancel.
   *
   * This MUST correspond to the ID of a request previously issued in the same direction.
   */
  requestId: RequestIdSchema.optional(),
  /**
   * An optional string describing the reason for the cancellation. This MAY be logged or presented to the user.
   */
  reason: string2().optional()
});
var CancelledNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/cancelled"),
  params: CancelledNotificationParamsSchema
});
var IconSchema = object2({
  /**
   * URL or data URI for the icon.
   */
  src: string2(),
  /**
   * Optional MIME type for the icon.
   */
  mimeType: string2().optional(),
  /**
   * Optional array of strings that specify sizes at which the icon can be used.
   * Each string should be in WxH format (e.g., `"48x48"`, `"96x96"`) or `"any"` for scalable formats like SVG.
   *
   * If not provided, the client should assume that the icon can be used at any size.
   */
  sizes: array(string2()).optional(),
  /**
   * Optional specifier for the theme this icon is designed for. `light` indicates
   * the icon is designed to be used with a light background, and `dark` indicates
   * the icon is designed to be used with a dark background.
   *
   * If not provided, the client should assume the icon can be used with any theme.
   */
  theme: _enum(["light", "dark"]).optional()
});
var IconsSchema = object2({
  /**
   * Optional set of sized icons that the client can display in a user interface.
   *
   * Clients that support rendering icons MUST support at least the following MIME types:
   * - `image/png` - PNG images (safe, universal compatibility)
   * - `image/jpeg` (and `image/jpg`) - JPEG images (safe, universal compatibility)
   *
   * Clients that support rendering icons SHOULD also support:
   * - `image/svg+xml` - SVG images (scalable but requires security precautions)
   * - `image/webp` - WebP images (modern, efficient format)
   */
  icons: array(IconSchema).optional()
});
var BaseMetadataSchema = object2({
  /** Intended for programmatic or logical use, but used as a display name in past specs or fallback */
  name: string2(),
  /**
   * Intended for UI and end-user contexts — optimized to be human-readable and easily understood,
   * even by those unfamiliar with domain-specific terminology.
   *
   * If not provided, the name should be used for display (except for Tool,
   * where `annotations.title` should be given precedence over using `name`,
   * if present).
   */
  title: string2().optional()
});
var ImplementationSchema = BaseMetadataSchema.extend({
  ...BaseMetadataSchema.shape,
  ...IconsSchema.shape,
  version: string2(),
  /**
   * An optional URL of the website for this implementation.
   */
  websiteUrl: string2().optional(),
  /**
   * An optional human-readable description of what this implementation does.
   *
   * This can be used by clients or servers to provide context about their purpose
   * and capabilities. For example, a server might describe the types of resources
   * or tools it provides, while a client might describe its intended use case.
   */
  description: string2().optional()
});
var FormElicitationCapabilitySchema = intersection(object2({
  applyDefaults: boolean2().optional()
}), record(string2(), unknown()));
var ElicitationCapabilitySchema = preprocess((value) => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    if (Object.keys(value).length === 0) {
      return { form: {} };
    }
  }
  return value;
}, intersection(object2({
  form: FormElicitationCapabilitySchema.optional(),
  url: AssertObjectSchema.optional()
}), record(string2(), unknown()).optional()));
var ClientTasksCapabilitySchema = looseObject({
  /**
   * Present if the client supports listing tasks.
   */
  list: AssertObjectSchema.optional(),
  /**
   * Present if the client supports cancelling tasks.
   */
  cancel: AssertObjectSchema.optional(),
  /**
   * Capabilities for task creation on specific request types.
   */
  requests: looseObject({
    /**
     * Task support for sampling requests.
     */
    sampling: looseObject({
      createMessage: AssertObjectSchema.optional()
    }).optional(),
    /**
     * Task support for elicitation requests.
     */
    elicitation: looseObject({
      create: AssertObjectSchema.optional()
    }).optional()
  }).optional()
});
var ServerTasksCapabilitySchema = looseObject({
  /**
   * Present if the server supports listing tasks.
   */
  list: AssertObjectSchema.optional(),
  /**
   * Present if the server supports cancelling tasks.
   */
  cancel: AssertObjectSchema.optional(),
  /**
   * Capabilities for task creation on specific request types.
   */
  requests: looseObject({
    /**
     * Task support for tool requests.
     */
    tools: looseObject({
      call: AssertObjectSchema.optional()
    }).optional()
  }).optional()
});
var ClientCapabilitiesSchema = object2({
  /**
   * Experimental, non-standard capabilities that the client supports.
   */
  experimental: record(string2(), AssertObjectSchema).optional(),
  /**
   * Present if the client supports sampling from an LLM.
   */
  sampling: object2({
    /**
     * Present if the client supports context inclusion via includeContext parameter.
     * If not declared, servers SHOULD only use `includeContext: "none"` (or omit it).
     */
    context: AssertObjectSchema.optional(),
    /**
     * Present if the client supports tool use via tools and toolChoice parameters.
     */
    tools: AssertObjectSchema.optional()
  }).optional(),
  /**
   * Present if the client supports eliciting user input.
   */
  elicitation: ElicitationCapabilitySchema.optional(),
  /**
   * Present if the client supports listing roots.
   */
  roots: object2({
    /**
     * Whether the client supports issuing notifications for changes to the roots list.
     */
    listChanged: boolean2().optional()
  }).optional(),
  /**
   * Present if the client supports task creation.
   */
  tasks: ClientTasksCapabilitySchema.optional(),
  /**
   * Extensions that the client supports. Keys are extension identifiers (vendor-prefix/extension-name).
   */
  extensions: record(string2(), AssertObjectSchema).optional()
});
var InitializeRequestParamsSchema = BaseRequestParamsSchema.extend({
  /**
   * The latest version of the Model Context Protocol that the client supports. The client MAY decide to support older versions as well.
   */
  protocolVersion: string2(),
  capabilities: ClientCapabilitiesSchema,
  clientInfo: ImplementationSchema
});
var InitializeRequestSchema = RequestSchema.extend({
  method: literal("initialize"),
  params: InitializeRequestParamsSchema
});
var isInitializeRequest = /* @__PURE__ */ __name((value) => InitializeRequestSchema.safeParse(value).success, "isInitializeRequest");
var ServerCapabilitiesSchema = object2({
  /**
   * Experimental, non-standard capabilities that the server supports.
   */
  experimental: record(string2(), AssertObjectSchema).optional(),
  /**
   * Present if the server supports sending log messages to the client.
   */
  logging: AssertObjectSchema.optional(),
  /**
   * Present if the server supports sending completions to the client.
   */
  completions: AssertObjectSchema.optional(),
  /**
   * Present if the server offers any prompt templates.
   */
  prompts: object2({
    /**
     * Whether this server supports issuing notifications for changes to the prompt list.
     */
    listChanged: boolean2().optional()
  }).optional(),
  /**
   * Present if the server offers any resources to read.
   */
  resources: object2({
    /**
     * Whether this server supports clients subscribing to resource updates.
     */
    subscribe: boolean2().optional(),
    /**
     * Whether this server supports issuing notifications for changes to the resource list.
     */
    listChanged: boolean2().optional()
  }).optional(),
  /**
   * Present if the server offers any tools to call.
   */
  tools: object2({
    /**
     * Whether this server supports issuing notifications for changes to the tool list.
     */
    listChanged: boolean2().optional()
  }).optional(),
  /**
   * Present if the server supports task creation.
   */
  tasks: ServerTasksCapabilitySchema.optional(),
  /**
   * Extensions that the server supports. Keys are extension identifiers (vendor-prefix/extension-name).
   */
  extensions: record(string2(), AssertObjectSchema).optional()
});
var InitializeResultSchema = ResultSchema.extend({
  /**
   * The version of the Model Context Protocol that the server wants to use. This may not match the version that the client requested. If the client cannot support this version, it MUST disconnect.
   */
  protocolVersion: string2(),
  capabilities: ServerCapabilitiesSchema,
  serverInfo: ImplementationSchema,
  /**
   * Instructions describing how to use the server and its features.
   *
   * This can be used by clients to improve the LLM's understanding of available tools, resources, etc. It can be thought of like a "hint" to the model. For example, this information MAY be added to the system prompt.
   */
  instructions: string2().optional()
});
var InitializedNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/initialized"),
  params: NotificationsParamsSchema.optional()
});
var PingRequestSchema = RequestSchema.extend({
  method: literal("ping"),
  params: BaseRequestParamsSchema.optional()
});
var ProgressSchema = object2({
  /**
   * The progress thus far. This should increase every time progress is made, even if the total is unknown.
   */
  progress: number2(),
  /**
   * Total number of items to process (or total progress required), if known.
   */
  total: optional(number2()),
  /**
   * An optional message describing the current progress.
   */
  message: optional(string2())
});
var ProgressNotificationParamsSchema = object2({
  ...NotificationsParamsSchema.shape,
  ...ProgressSchema.shape,
  /**
   * The progress token which was given in the initial request, used to associate this notification with the request that is proceeding.
   */
  progressToken: ProgressTokenSchema
});
var ProgressNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/progress"),
  params: ProgressNotificationParamsSchema
});
var PaginatedRequestParamsSchema = BaseRequestParamsSchema.extend({
  /**
   * An opaque token representing the current pagination position.
   * If provided, the server should return results starting after this cursor.
   */
  cursor: CursorSchema.optional()
});
var PaginatedRequestSchema = RequestSchema.extend({
  params: PaginatedRequestParamsSchema.optional()
});
var PaginatedResultSchema = ResultSchema.extend({
  /**
   * An opaque token representing the pagination position after the last returned result.
   * If present, there may be more results available.
   */
  nextCursor: CursorSchema.optional()
});
var TaskStatusSchema = _enum(["working", "input_required", "completed", "failed", "cancelled"]);
var TaskSchema = object2({
  taskId: string2(),
  status: TaskStatusSchema,
  /**
   * Time in milliseconds to keep task results available after completion.
   * If null, the task has unlimited lifetime until manually cleaned up.
   */
  ttl: union([number2(), _null3()]),
  /**
   * ISO 8601 timestamp when the task was created.
   */
  createdAt: string2(),
  /**
   * ISO 8601 timestamp when the task was last updated.
   */
  lastUpdatedAt: string2(),
  pollInterval: optional(number2()),
  /**
   * Optional diagnostic message for failed tasks or other status information.
   */
  statusMessage: optional(string2())
});
var CreateTaskResultSchema = ResultSchema.extend({
  task: TaskSchema
});
var TaskStatusNotificationParamsSchema = NotificationsParamsSchema.merge(TaskSchema);
var TaskStatusNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/tasks/status"),
  params: TaskStatusNotificationParamsSchema
});
var GetTaskRequestSchema = RequestSchema.extend({
  method: literal("tasks/get"),
  params: BaseRequestParamsSchema.extend({
    taskId: string2()
  })
});
var GetTaskResultSchema = ResultSchema.merge(TaskSchema);
var GetTaskPayloadRequestSchema = RequestSchema.extend({
  method: literal("tasks/result"),
  params: BaseRequestParamsSchema.extend({
    taskId: string2()
  })
});
var GetTaskPayloadResultSchema = ResultSchema.loose();
var ListTasksRequestSchema = PaginatedRequestSchema.extend({
  method: literal("tasks/list")
});
var ListTasksResultSchema = PaginatedResultSchema.extend({
  tasks: array(TaskSchema)
});
var CancelTaskRequestSchema = RequestSchema.extend({
  method: literal("tasks/cancel"),
  params: BaseRequestParamsSchema.extend({
    taskId: string2()
  })
});
var CancelTaskResultSchema = ResultSchema.merge(TaskSchema);
var ResourceContentsSchema = object2({
  /**
   * The URI of this resource.
   */
  uri: string2(),
  /**
   * The MIME type of this resource, if known.
   */
  mimeType: optional(string2()),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var TextResourceContentsSchema = ResourceContentsSchema.extend({
  /**
   * The text of the item. This must only be set if the item can actually be represented as text (not binary data).
   */
  text: string2()
});
var Base64Schema = string2().refine((val) => {
  try {
    atob(val);
    return true;
  } catch {
    return false;
  }
}, { message: "Invalid Base64 string" });
var BlobResourceContentsSchema = ResourceContentsSchema.extend({
  /**
   * A base64-encoded string representing the binary data of the item.
   */
  blob: Base64Schema
});
var RoleSchema = _enum(["user", "assistant"]);
var AnnotationsSchema = object2({
  /**
   * Intended audience(s) for the resource.
   */
  audience: array(RoleSchema).optional(),
  /**
   * Importance hint for the resource, from 0 (least) to 1 (most).
   */
  priority: number2().min(0).max(1).optional(),
  /**
   * ISO 8601 timestamp for the most recent modification.
   */
  lastModified: iso_exports.datetime({ offset: true }).optional()
});
var ResourceSchema = object2({
  ...BaseMetadataSchema.shape,
  ...IconsSchema.shape,
  /**
   * The URI of this resource.
   */
  uri: string2(),
  /**
   * A description of what this resource represents.
   *
   * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
   */
  description: optional(string2()),
  /**
   * The MIME type of this resource, if known.
   */
  mimeType: optional(string2()),
  /**
   * The size of the raw resource content, in bytes (i.e., before base64 encoding or any tokenization), if known.
   *
   * This can be used by Hosts to display file sizes and estimate context window usage.
   */
  size: optional(number2()),
  /**
   * Optional annotations for the client.
   */
  annotations: AnnotationsSchema.optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: optional(looseObject({}))
});
var ResourceTemplateSchema = object2({
  ...BaseMetadataSchema.shape,
  ...IconsSchema.shape,
  /**
   * A URI template (according to RFC 6570) that can be used to construct resource URIs.
   */
  uriTemplate: string2(),
  /**
   * A description of what this template is for.
   *
   * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
   */
  description: optional(string2()),
  /**
   * The MIME type for all resources that match this template. This should only be included if all resources matching this template have the same type.
   */
  mimeType: optional(string2()),
  /**
   * Optional annotations for the client.
   */
  annotations: AnnotationsSchema.optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: optional(looseObject({}))
});
var ListResourcesRequestSchema = PaginatedRequestSchema.extend({
  method: literal("resources/list")
});
var ListResourcesResultSchema = PaginatedResultSchema.extend({
  resources: array(ResourceSchema)
});
var ListResourceTemplatesRequestSchema = PaginatedRequestSchema.extend({
  method: literal("resources/templates/list")
});
var ListResourceTemplatesResultSchema = PaginatedResultSchema.extend({
  resourceTemplates: array(ResourceTemplateSchema)
});
var ResourceRequestParamsSchema = BaseRequestParamsSchema.extend({
  /**
   * The URI of the resource to read. The URI can use any protocol; it is up to the server how to interpret it.
   *
   * @format uri
   */
  uri: string2()
});
var ReadResourceRequestParamsSchema = ResourceRequestParamsSchema;
var ReadResourceRequestSchema = RequestSchema.extend({
  method: literal("resources/read"),
  params: ReadResourceRequestParamsSchema
});
var ReadResourceResultSchema = ResultSchema.extend({
  contents: array(union([TextResourceContentsSchema, BlobResourceContentsSchema]))
});
var ResourceListChangedNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/resources/list_changed"),
  params: NotificationsParamsSchema.optional()
});
var SubscribeRequestParamsSchema = ResourceRequestParamsSchema;
var SubscribeRequestSchema = RequestSchema.extend({
  method: literal("resources/subscribe"),
  params: SubscribeRequestParamsSchema
});
var UnsubscribeRequestParamsSchema = ResourceRequestParamsSchema;
var UnsubscribeRequestSchema = RequestSchema.extend({
  method: literal("resources/unsubscribe"),
  params: UnsubscribeRequestParamsSchema
});
var ResourceUpdatedNotificationParamsSchema = NotificationsParamsSchema.extend({
  /**
   * The URI of the resource that has been updated. This might be a sub-resource of the one that the client actually subscribed to.
   */
  uri: string2()
});
var ResourceUpdatedNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/resources/updated"),
  params: ResourceUpdatedNotificationParamsSchema
});
var PromptArgumentSchema = object2({
  /**
   * The name of the argument.
   */
  name: string2(),
  /**
   * A human-readable description of the argument.
   */
  description: optional(string2()),
  /**
   * Whether this argument must be provided.
   */
  required: optional(boolean2())
});
var PromptSchema = object2({
  ...BaseMetadataSchema.shape,
  ...IconsSchema.shape,
  /**
   * An optional description of what this prompt provides
   */
  description: optional(string2()),
  /**
   * A list of arguments to use for templating the prompt.
   */
  arguments: optional(array(PromptArgumentSchema)),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: optional(looseObject({}))
});
var ListPromptsRequestSchema = PaginatedRequestSchema.extend({
  method: literal("prompts/list")
});
var ListPromptsResultSchema = PaginatedResultSchema.extend({
  prompts: array(PromptSchema)
});
var GetPromptRequestParamsSchema = BaseRequestParamsSchema.extend({
  /**
   * The name of the prompt or prompt template.
   */
  name: string2(),
  /**
   * Arguments to use for templating the prompt.
   */
  arguments: record(string2(), string2()).optional()
});
var GetPromptRequestSchema = RequestSchema.extend({
  method: literal("prompts/get"),
  params: GetPromptRequestParamsSchema
});
var TextContentSchema = object2({
  type: literal("text"),
  /**
   * The text content of the message.
   */
  text: string2(),
  /**
   * Optional annotations for the client.
   */
  annotations: AnnotationsSchema.optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var ImageContentSchema = object2({
  type: literal("image"),
  /**
   * The base64-encoded image data.
   */
  data: Base64Schema,
  /**
   * The MIME type of the image. Different providers may support different image types.
   */
  mimeType: string2(),
  /**
   * Optional annotations for the client.
   */
  annotations: AnnotationsSchema.optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var AudioContentSchema = object2({
  type: literal("audio"),
  /**
   * The base64-encoded audio data.
   */
  data: Base64Schema,
  /**
   * The MIME type of the audio. Different providers may support different audio types.
   */
  mimeType: string2(),
  /**
   * Optional annotations for the client.
   */
  annotations: AnnotationsSchema.optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var ToolUseContentSchema = object2({
  type: literal("tool_use"),
  /**
   * The name of the tool to invoke.
   * Must match a tool name from the request's tools array.
   */
  name: string2(),
  /**
   * Unique identifier for this tool call.
   * Used to correlate with ToolResultContent in subsequent messages.
   */
  id: string2(),
  /**
   * Arguments to pass to the tool.
   * Must conform to the tool's inputSchema.
   */
  input: record(string2(), unknown()),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var EmbeddedResourceSchema = object2({
  type: literal("resource"),
  resource: union([TextResourceContentsSchema, BlobResourceContentsSchema]),
  /**
   * Optional annotations for the client.
   */
  annotations: AnnotationsSchema.optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var ResourceLinkSchema = ResourceSchema.extend({
  type: literal("resource_link")
});
var ContentBlockSchema = union([
  TextContentSchema,
  ImageContentSchema,
  AudioContentSchema,
  ResourceLinkSchema,
  EmbeddedResourceSchema
]);
var PromptMessageSchema = object2({
  role: RoleSchema,
  content: ContentBlockSchema
});
var GetPromptResultSchema = ResultSchema.extend({
  /**
   * An optional description for the prompt.
   */
  description: string2().optional(),
  messages: array(PromptMessageSchema)
});
var PromptListChangedNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/prompts/list_changed"),
  params: NotificationsParamsSchema.optional()
});
var ToolAnnotationsSchema = object2({
  /**
   * A human-readable title for the tool.
   */
  title: string2().optional(),
  /**
   * If true, the tool does not modify its environment.
   *
   * Default: false
   */
  readOnlyHint: boolean2().optional(),
  /**
   * If true, the tool may perform destructive updates to its environment.
   * If false, the tool performs only additive updates.
   *
   * (This property is meaningful only when `readOnlyHint == false`)
   *
   * Default: true
   */
  destructiveHint: boolean2().optional(),
  /**
   * If true, calling the tool repeatedly with the same arguments
   * will have no additional effect on the its environment.
   *
   * (This property is meaningful only when `readOnlyHint == false`)
   *
   * Default: false
   */
  idempotentHint: boolean2().optional(),
  /**
   * If true, this tool may interact with an "open world" of external
   * entities. If false, the tool's domain of interaction is closed.
   * For example, the world of a web search tool is open, whereas that
   * of a memory tool is not.
   *
   * Default: true
   */
  openWorldHint: boolean2().optional()
});
var ToolExecutionSchema = object2({
  /**
   * Indicates the tool's preference for task-augmented execution.
   * - "required": Clients MUST invoke the tool as a task
   * - "optional": Clients MAY invoke the tool as a task or normal request
   * - "forbidden": Clients MUST NOT attempt to invoke the tool as a task
   *
   * If not present, defaults to "forbidden".
   */
  taskSupport: _enum(["required", "optional", "forbidden"]).optional()
});
var ToolSchema = object2({
  ...BaseMetadataSchema.shape,
  ...IconsSchema.shape,
  /**
   * A human-readable description of the tool.
   */
  description: string2().optional(),
  /**
   * A JSON Schema 2020-12 object defining the expected parameters for the tool.
   * Must have type: 'object' at the root level per MCP spec.
   */
  inputSchema: object2({
    type: literal("object"),
    properties: record(string2(), AssertObjectSchema).optional(),
    required: array(string2()).optional()
  }).catchall(unknown()),
  /**
   * An optional JSON Schema 2020-12 object defining the structure of the tool's output
   * returned in the structuredContent field of a CallToolResult.
   * Must have type: 'object' at the root level per MCP spec.
   */
  outputSchema: object2({
    type: literal("object"),
    properties: record(string2(), AssertObjectSchema).optional(),
    required: array(string2()).optional()
  }).catchall(unknown()).optional(),
  /**
   * Optional additional tool information.
   */
  annotations: ToolAnnotationsSchema.optional(),
  /**
   * Execution-related properties for this tool.
   */
  execution: ToolExecutionSchema.optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var ListToolsRequestSchema = PaginatedRequestSchema.extend({
  method: literal("tools/list")
});
var ListToolsResultSchema = PaginatedResultSchema.extend({
  tools: array(ToolSchema)
});
var CallToolResultSchema = ResultSchema.extend({
  /**
   * A list of content objects that represent the result of the tool call.
   *
   * If the Tool does not define an outputSchema, this field MUST be present in the result.
   * For backwards compatibility, this field is always present, but it may be empty.
   */
  content: array(ContentBlockSchema).default([]),
  /**
   * An object containing structured tool output.
   *
   * If the Tool defines an outputSchema, this field MUST be present in the result, and contain a JSON object that matches the schema.
   */
  structuredContent: record(string2(), unknown()).optional(),
  /**
   * Whether the tool call ended in an error.
   *
   * If not set, this is assumed to be false (the call was successful).
   *
   * Any errors that originate from the tool SHOULD be reported inside the result
   * object, with `isError` set to true, _not_ as an MCP protocol-level error
   * response. Otherwise, the LLM would not be able to see that an error occurred
   * and self-correct.
   *
   * However, any errors in _finding_ the tool, an error indicating that the
   * server does not support tool calls, or any other exceptional conditions,
   * should be reported as an MCP error response.
   */
  isError: boolean2().optional()
});
var CompatibilityCallToolResultSchema = CallToolResultSchema.or(ResultSchema.extend({
  toolResult: unknown()
}));
var CallToolRequestParamsSchema = TaskAugmentedRequestParamsSchema.extend({
  /**
   * The name of the tool to call.
   */
  name: string2(),
  /**
   * Arguments to pass to the tool.
   */
  arguments: record(string2(), unknown()).optional()
});
var CallToolRequestSchema = RequestSchema.extend({
  method: literal("tools/call"),
  params: CallToolRequestParamsSchema
});
var ToolListChangedNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/tools/list_changed"),
  params: NotificationsParamsSchema.optional()
});
var ListChangedOptionsBaseSchema = object2({
  /**
   * If true, the list will be refreshed automatically when a list changed notification is received.
   * The callback will be called with the updated list.
   *
   * If false, the callback will be called with null items, allowing manual refresh.
   *
   * @default true
   */
  autoRefresh: boolean2().default(true),
  /**
   * Debounce time in milliseconds for list changed notification processing.
   *
   * Multiple notifications received within this timeframe will only trigger one refresh.
   * Set to 0 to disable debouncing.
   *
   * @default 300
   */
  debounceMs: number2().int().nonnegative().default(300)
});
var LoggingLevelSchema = _enum(["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]);
var SetLevelRequestParamsSchema = BaseRequestParamsSchema.extend({
  /**
   * The level of logging that the client wants to receive from the server. The server should send all logs at this level and higher (i.e., more severe) to the client as notifications/logging/message.
   */
  level: LoggingLevelSchema
});
var SetLevelRequestSchema = RequestSchema.extend({
  method: literal("logging/setLevel"),
  params: SetLevelRequestParamsSchema
});
var LoggingMessageNotificationParamsSchema = NotificationsParamsSchema.extend({
  /**
   * The severity of this log message.
   */
  level: LoggingLevelSchema,
  /**
   * An optional name of the logger issuing this message.
   */
  logger: string2().optional(),
  /**
   * The data to be logged, such as a string message or an object. Any JSON serializable type is allowed here.
   */
  data: unknown()
});
var LoggingMessageNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/message"),
  params: LoggingMessageNotificationParamsSchema
});
var ModelHintSchema = object2({
  /**
   * A hint for a model name.
   */
  name: string2().optional()
});
var ModelPreferencesSchema = object2({
  /**
   * Optional hints to use for model selection.
   */
  hints: array(ModelHintSchema).optional(),
  /**
   * How much to prioritize cost when selecting a model.
   */
  costPriority: number2().min(0).max(1).optional(),
  /**
   * How much to prioritize sampling speed (latency) when selecting a model.
   */
  speedPriority: number2().min(0).max(1).optional(),
  /**
   * How much to prioritize intelligence and capabilities when selecting a model.
   */
  intelligencePriority: number2().min(0).max(1).optional()
});
var ToolChoiceSchema = object2({
  /**
   * Controls when tools are used:
   * - "auto": Model decides whether to use tools (default)
   * - "required": Model MUST use at least one tool before completing
   * - "none": Model MUST NOT use any tools
   */
  mode: _enum(["auto", "required", "none"]).optional()
});
var ToolResultContentSchema = object2({
  type: literal("tool_result"),
  toolUseId: string2().describe("The unique identifier for the corresponding tool call."),
  content: array(ContentBlockSchema).default([]),
  structuredContent: object2({}).loose().optional(),
  isError: boolean2().optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var SamplingContentSchema = discriminatedUnion("type", [TextContentSchema, ImageContentSchema, AudioContentSchema]);
var SamplingMessageContentBlockSchema = discriminatedUnion("type", [
  TextContentSchema,
  ImageContentSchema,
  AudioContentSchema,
  ToolUseContentSchema,
  ToolResultContentSchema
]);
var SamplingMessageSchema = object2({
  role: RoleSchema,
  content: union([SamplingMessageContentBlockSchema, array(SamplingMessageContentBlockSchema)]),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var CreateMessageRequestParamsSchema = TaskAugmentedRequestParamsSchema.extend({
  messages: array(SamplingMessageSchema),
  /**
   * The server's preferences for which model to select. The client MAY modify or omit this request.
   */
  modelPreferences: ModelPreferencesSchema.optional(),
  /**
   * An optional system prompt the server wants to use for sampling. The client MAY modify or omit this prompt.
   */
  systemPrompt: string2().optional(),
  /**
   * A request to include context from one or more MCP servers (including the caller), to be attached to the prompt.
   * The client MAY ignore this request.
   *
   * Default is "none". Values "thisServer" and "allServers" are soft-deprecated. Servers SHOULD only use these values if the client
   * declares ClientCapabilities.sampling.context. These values may be removed in future spec releases.
   */
  includeContext: _enum(["none", "thisServer", "allServers"]).optional(),
  temperature: number2().optional(),
  /**
   * The requested maximum number of tokens to sample (to prevent runaway completions).
   *
   * The client MAY choose to sample fewer tokens than the requested maximum.
   */
  maxTokens: number2().int(),
  stopSequences: array(string2()).optional(),
  /**
   * Optional metadata to pass through to the LLM provider. The format of this metadata is provider-specific.
   */
  metadata: AssertObjectSchema.optional(),
  /**
   * Tools that the model may use during generation.
   * The client MUST return an error if this field is provided but ClientCapabilities.sampling.tools is not declared.
   */
  tools: array(ToolSchema).optional(),
  /**
   * Controls how the model uses tools.
   * The client MUST return an error if this field is provided but ClientCapabilities.sampling.tools is not declared.
   * Default is `{ mode: "auto" }`.
   */
  toolChoice: ToolChoiceSchema.optional()
});
var CreateMessageRequestSchema = RequestSchema.extend({
  method: literal("sampling/createMessage"),
  params: CreateMessageRequestParamsSchema
});
var CreateMessageResultSchema = ResultSchema.extend({
  /**
   * The name of the model that generated the message.
   */
  model: string2(),
  /**
   * The reason why sampling stopped, if known.
   *
   * Standard values:
   * - "endTurn": Natural end of the assistant's turn
   * - "stopSequence": A stop sequence was encountered
   * - "maxTokens": Maximum token limit was reached
   *
   * This field is an open string to allow for provider-specific stop reasons.
   */
  stopReason: optional(_enum(["endTurn", "stopSequence", "maxTokens"]).or(string2())),
  role: RoleSchema,
  /**
   * Response content. Single content block (text, image, or audio).
   */
  content: SamplingContentSchema
});
var CreateMessageResultWithToolsSchema = ResultSchema.extend({
  /**
   * The name of the model that generated the message.
   */
  model: string2(),
  /**
   * The reason why sampling stopped, if known.
   *
   * Standard values:
   * - "endTurn": Natural end of the assistant's turn
   * - "stopSequence": A stop sequence was encountered
   * - "maxTokens": Maximum token limit was reached
   * - "toolUse": The model wants to use one or more tools
   *
   * This field is an open string to allow for provider-specific stop reasons.
   */
  stopReason: optional(_enum(["endTurn", "stopSequence", "maxTokens", "toolUse"]).or(string2())),
  role: RoleSchema,
  /**
   * Response content. May be a single block or array. May include ToolUseContent if stopReason is "toolUse".
   */
  content: union([SamplingMessageContentBlockSchema, array(SamplingMessageContentBlockSchema)])
});
var BooleanSchemaSchema = object2({
  type: literal("boolean"),
  title: string2().optional(),
  description: string2().optional(),
  default: boolean2().optional()
});
var StringSchemaSchema = object2({
  type: literal("string"),
  title: string2().optional(),
  description: string2().optional(),
  minLength: number2().optional(),
  maxLength: number2().optional(),
  format: _enum(["email", "uri", "date", "date-time"]).optional(),
  default: string2().optional()
});
var NumberSchemaSchema = object2({
  type: _enum(["number", "integer"]),
  title: string2().optional(),
  description: string2().optional(),
  minimum: number2().optional(),
  maximum: number2().optional(),
  default: number2().optional()
});
var UntitledSingleSelectEnumSchemaSchema = object2({
  type: literal("string"),
  title: string2().optional(),
  description: string2().optional(),
  enum: array(string2()),
  default: string2().optional()
});
var TitledSingleSelectEnumSchemaSchema = object2({
  type: literal("string"),
  title: string2().optional(),
  description: string2().optional(),
  oneOf: array(object2({
    const: string2(),
    title: string2()
  })),
  default: string2().optional()
});
var LegacyTitledEnumSchemaSchema = object2({
  type: literal("string"),
  title: string2().optional(),
  description: string2().optional(),
  enum: array(string2()),
  enumNames: array(string2()).optional(),
  default: string2().optional()
});
var SingleSelectEnumSchemaSchema = union([UntitledSingleSelectEnumSchemaSchema, TitledSingleSelectEnumSchemaSchema]);
var UntitledMultiSelectEnumSchemaSchema = object2({
  type: literal("array"),
  title: string2().optional(),
  description: string2().optional(),
  minItems: number2().optional(),
  maxItems: number2().optional(),
  items: object2({
    type: literal("string"),
    enum: array(string2())
  }),
  default: array(string2()).optional()
});
var TitledMultiSelectEnumSchemaSchema = object2({
  type: literal("array"),
  title: string2().optional(),
  description: string2().optional(),
  minItems: number2().optional(),
  maxItems: number2().optional(),
  items: object2({
    anyOf: array(object2({
      const: string2(),
      title: string2()
    }))
  }),
  default: array(string2()).optional()
});
var MultiSelectEnumSchemaSchema = union([UntitledMultiSelectEnumSchemaSchema, TitledMultiSelectEnumSchemaSchema]);
var EnumSchemaSchema = union([LegacyTitledEnumSchemaSchema, SingleSelectEnumSchemaSchema, MultiSelectEnumSchemaSchema]);
var PrimitiveSchemaDefinitionSchema = union([EnumSchemaSchema, BooleanSchemaSchema, StringSchemaSchema, NumberSchemaSchema]);
var ElicitRequestFormParamsSchema = TaskAugmentedRequestParamsSchema.extend({
  /**
   * The elicitation mode.
   *
   * Optional for backward compatibility. Clients MUST treat missing mode as "form".
   */
  mode: literal("form").optional(),
  /**
   * The message to present to the user describing what information is being requested.
   */
  message: string2(),
  /**
   * A restricted subset of JSON Schema.
   * Only top-level properties are allowed, without nesting.
   */
  requestedSchema: object2({
    type: literal("object"),
    properties: record(string2(), PrimitiveSchemaDefinitionSchema),
    required: array(string2()).optional()
  })
});
var ElicitRequestURLParamsSchema = TaskAugmentedRequestParamsSchema.extend({
  /**
   * The elicitation mode.
   */
  mode: literal("url"),
  /**
   * The message to present to the user explaining why the interaction is needed.
   */
  message: string2(),
  /**
   * The ID of the elicitation, which must be unique within the context of the server.
   * The client MUST treat this ID as an opaque value.
   */
  elicitationId: string2(),
  /**
   * The URL that the user should navigate to.
   */
  url: string2().url()
});
var ElicitRequestParamsSchema = union([ElicitRequestFormParamsSchema, ElicitRequestURLParamsSchema]);
var ElicitRequestSchema = RequestSchema.extend({
  method: literal("elicitation/create"),
  params: ElicitRequestParamsSchema
});
var ElicitationCompleteNotificationParamsSchema = NotificationsParamsSchema.extend({
  /**
   * The ID of the elicitation that completed.
   */
  elicitationId: string2()
});
var ElicitationCompleteNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/elicitation/complete"),
  params: ElicitationCompleteNotificationParamsSchema
});
var ElicitResultSchema = ResultSchema.extend({
  /**
   * The user action in response to the elicitation.
   * - "accept": User submitted the form/confirmed the action
   * - "decline": User explicitly decline the action
   * - "cancel": User dismissed without making an explicit choice
   */
  action: _enum(["accept", "decline", "cancel"]),
  /**
   * The submitted form data, only present when action is "accept".
   * Contains values matching the requested schema.
   * Per MCP spec, content is "typically omitted" for decline/cancel actions.
   * We normalize null to undefined for leniency while maintaining type compatibility.
   */
  content: preprocess((val) => val === null ? void 0 : val, record(string2(), union([string2(), number2(), boolean2(), array(string2())])).optional())
});
var ResourceTemplateReferenceSchema = object2({
  type: literal("ref/resource"),
  /**
   * The URI or URI template of the resource.
   */
  uri: string2()
});
var PromptReferenceSchema = object2({
  type: literal("ref/prompt"),
  /**
   * The name of the prompt or prompt template
   */
  name: string2()
});
var CompleteRequestParamsSchema = BaseRequestParamsSchema.extend({
  ref: union([PromptReferenceSchema, ResourceTemplateReferenceSchema]),
  /**
   * The argument's information
   */
  argument: object2({
    /**
     * The name of the argument
     */
    name: string2(),
    /**
     * The value of the argument to use for completion matching.
     */
    value: string2()
  }),
  context: object2({
    /**
     * Previously-resolved variables in a URI template or prompt.
     */
    arguments: record(string2(), string2()).optional()
  }).optional()
});
var CompleteRequestSchema = RequestSchema.extend({
  method: literal("completion/complete"),
  params: CompleteRequestParamsSchema
});
var CompleteResultSchema = ResultSchema.extend({
  completion: looseObject({
    /**
     * An array of completion values. Must not exceed 100 items.
     */
    values: array(string2()).max(100),
    /**
     * The total number of completion options available. This can exceed the number of values actually sent in the response.
     */
    total: optional(number2().int()),
    /**
     * Indicates whether there are additional completion options beyond those provided in the current response, even if the exact total is unknown.
     */
    hasMore: optional(boolean2())
  })
});
var RootSchema = object2({
  /**
   * The URI identifying the root. This *must* start with file:// for now.
   */
  uri: string2().startsWith("file://"),
  /**
   * An optional name for the root.
   */
  name: string2().optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var ListRootsRequestSchema = RequestSchema.extend({
  method: literal("roots/list"),
  params: BaseRequestParamsSchema.optional()
});
var ListRootsResultSchema = ResultSchema.extend({
  roots: array(RootSchema)
});
var RootsListChangedNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/roots/list_changed"),
  params: NotificationsParamsSchema.optional()
});
var ClientRequestSchema = union([
  PingRequestSchema,
  InitializeRequestSchema,
  CompleteRequestSchema,
  SetLevelRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ReadResourceRequestSchema,
  SubscribeRequestSchema,
  UnsubscribeRequestSchema,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  GetTaskRequestSchema,
  GetTaskPayloadRequestSchema,
  ListTasksRequestSchema,
  CancelTaskRequestSchema
]);
var ClientNotificationSchema = union([
  CancelledNotificationSchema,
  ProgressNotificationSchema,
  InitializedNotificationSchema,
  RootsListChangedNotificationSchema,
  TaskStatusNotificationSchema
]);
var ClientResultSchema = union([
  EmptyResultSchema,
  CreateMessageResultSchema,
  CreateMessageResultWithToolsSchema,
  ElicitResultSchema,
  ListRootsResultSchema,
  GetTaskResultSchema,
  ListTasksResultSchema,
  CreateTaskResultSchema
]);
var ServerRequestSchema = union([
  PingRequestSchema,
  CreateMessageRequestSchema,
  ElicitRequestSchema,
  ListRootsRequestSchema,
  GetTaskRequestSchema,
  GetTaskPayloadRequestSchema,
  ListTasksRequestSchema,
  CancelTaskRequestSchema
]);
var ServerNotificationSchema = union([
  CancelledNotificationSchema,
  ProgressNotificationSchema,
  LoggingMessageNotificationSchema,
  ResourceUpdatedNotificationSchema,
  ResourceListChangedNotificationSchema,
  ToolListChangedNotificationSchema,
  PromptListChangedNotificationSchema,
  TaskStatusNotificationSchema,
  ElicitationCompleteNotificationSchema
]);
var ServerResultSchema = union([
  EmptyResultSchema,
  InitializeResultSchema,
  CompleteResultSchema,
  GetPromptResultSchema,
  ListPromptsResultSchema,
  ListResourcesResultSchema,
  ListResourceTemplatesResultSchema,
  ReadResourceResultSchema,
  CallToolResultSchema,
  ListToolsResultSchema,
  GetTaskResultSchema,
  ListTasksResultSchema,
  CreateTaskResultSchema
]);
var McpError = class _McpError extends Error {
  static {
    __name(this, "McpError");
  }
  constructor(code, message, data) {
    super(`MCP error ${code}: ${message}`);
    this.code = code;
    this.data = data;
    this.name = "McpError";
  }
  /**
   * Factory method to create the appropriate error type based on the error code and data
   */
  static fromError(code, message, data) {
    if (code === ErrorCode.UrlElicitationRequired && data) {
      const errorData = data;
      if (errorData.elicitations) {
        return new UrlElicitationRequiredError(errorData.elicitations, message);
      }
    }
    return new _McpError(code, message, data);
  }
};
var UrlElicitationRequiredError = class extends McpError {
  static {
    __name(this, "UrlElicitationRequiredError");
  }
  constructor(elicitations, message = `URL elicitation${elicitations.length > 1 ? "s" : ""} required`) {
    super(ErrorCode.UrlElicitationRequired, message, {
      elicitations
    });
  }
  get elicitations() {
    return this.data?.elicitations ?? [];
  }
};

// node_modules/@modelcontextprotocol/sdk/dist/esm/experimental/tasks/interfaces.js
init_modules_watch_stub();
function isTerminal(status) {
  return status === "completed" || status === "failed" || status === "cancelled";
}
__name(isTerminal, "isTerminal");

// node_modules/@modelcontextprotocol/sdk/dist/esm/server/zod-json-schema-compat.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/index.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/Options.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/Refs.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/errorMessages.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/getRelativePath.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parseDef.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/selectParser.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/any.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/array.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/bigint.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/boolean.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/branded.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/catch.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/date.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/default.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/effects.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/enum.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/intersection.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/literal.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/map.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/record.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/string.js
init_modules_watch_stub();
var ALPHA_NUMERIC = new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");

// node_modules/zod-to-json-schema/dist/esm/parsers/nativeEnum.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/never.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/null.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/nullable.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/union.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/number.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/object.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/optional.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/pipeline.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/promise.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/set.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/tuple.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/undefined.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/unknown.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parsers/readonly.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/parseTypes.js
init_modules_watch_stub();

// node_modules/zod-to-json-schema/dist/esm/zodToJsonSchema.js
init_modules_watch_stub();

// node_modules/@modelcontextprotocol/sdk/dist/esm/server/zod-json-schema-compat.js
function getMethodLiteral(schema) {
  const shape = getObjectShape(schema);
  const methodSchema = shape?.method;
  if (!methodSchema) {
    throw new Error("Schema is missing a method literal");
  }
  const value = getLiteralValue(methodSchema);
  if (typeof value !== "string") {
    throw new Error("Schema method literal must be a string");
  }
  return value;
}
__name(getMethodLiteral, "getMethodLiteral");
function parseWithCompat(schema, data) {
  const result = safeParse2(schema, data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
}
__name(parseWithCompat, "parseWithCompat");

// node_modules/@modelcontextprotocol/sdk/dist/esm/shared/protocol.js
var DEFAULT_REQUEST_TIMEOUT_MSEC = 6e4;
var Protocol = class {
  static {
    __name(this, "Protocol");
  }
  constructor(_options) {
    this._options = _options;
    this._requestMessageId = 0;
    this._requestHandlers = /* @__PURE__ */ new Map();
    this._requestHandlerAbortControllers = /* @__PURE__ */ new Map();
    this._notificationHandlers = /* @__PURE__ */ new Map();
    this._responseHandlers = /* @__PURE__ */ new Map();
    this._progressHandlers = /* @__PURE__ */ new Map();
    this._timeoutInfo = /* @__PURE__ */ new Map();
    this._pendingDebouncedNotifications = /* @__PURE__ */ new Set();
    this._taskProgressTokens = /* @__PURE__ */ new Map();
    this._requestResolvers = /* @__PURE__ */ new Map();
    this.setNotificationHandler(CancelledNotificationSchema, (notification) => {
      this._oncancel(notification);
    });
    this.setNotificationHandler(ProgressNotificationSchema, (notification) => {
      this._onprogress(notification);
    });
    this.setRequestHandler(
      PingRequestSchema,
      // Automatic pong by default.
      (_request) => ({})
    );
    this._taskStore = _options?.taskStore;
    this._taskMessageQueue = _options?.taskMessageQueue;
    if (this._taskStore) {
      this.setRequestHandler(GetTaskRequestSchema, async (request, extra) => {
        const task = await this._taskStore.getTask(request.params.taskId, extra.sessionId);
        if (!task) {
          throw new McpError(ErrorCode.InvalidParams, "Failed to retrieve task: Task not found");
        }
        return {
          ...task
        };
      });
      this.setRequestHandler(GetTaskPayloadRequestSchema, async (request, extra) => {
        const handleTaskResult = /* @__PURE__ */ __name(async () => {
          const taskId = request.params.taskId;
          if (this._taskMessageQueue) {
            let queuedMessage;
            while (queuedMessage = await this._taskMessageQueue.dequeue(taskId, extra.sessionId)) {
              if (queuedMessage.type === "response" || queuedMessage.type === "error") {
                const message = queuedMessage.message;
                const requestId = message.id;
                const resolver = this._requestResolvers.get(requestId);
                if (resolver) {
                  this._requestResolvers.delete(requestId);
                  if (queuedMessage.type === "response") {
                    resolver(message);
                  } else {
                    const errorMessage = message;
                    const error2 = new McpError(errorMessage.error.code, errorMessage.error.message, errorMessage.error.data);
                    resolver(error2);
                  }
                } else {
                  const messageType = queuedMessage.type === "response" ? "Response" : "Error";
                  this._onerror(new Error(`${messageType} handler missing for request ${requestId}`));
                }
                continue;
              }
              await this._transport?.send(queuedMessage.message, { relatedRequestId: extra.requestId });
            }
          }
          const task = await this._taskStore.getTask(taskId, extra.sessionId);
          if (!task) {
            throw new McpError(ErrorCode.InvalidParams, `Task not found: ${taskId}`);
          }
          if (!isTerminal(task.status)) {
            await this._waitForTaskUpdate(taskId, extra.signal);
            return await handleTaskResult();
          }
          if (isTerminal(task.status)) {
            const result = await this._taskStore.getTaskResult(taskId, extra.sessionId);
            this._clearTaskQueue(taskId);
            return {
              ...result,
              _meta: {
                ...result._meta,
                [RELATED_TASK_META_KEY]: {
                  taskId
                }
              }
            };
          }
          return await handleTaskResult();
        }, "handleTaskResult");
        return await handleTaskResult();
      });
      this.setRequestHandler(ListTasksRequestSchema, async (request, extra) => {
        try {
          const { tasks, nextCursor } = await this._taskStore.listTasks(request.params?.cursor, extra.sessionId);
          return {
            tasks,
            nextCursor,
            _meta: {}
          };
        } catch (error2) {
          throw new McpError(ErrorCode.InvalidParams, `Failed to list tasks: ${error2 instanceof Error ? error2.message : String(error2)}`);
        }
      });
      this.setRequestHandler(CancelTaskRequestSchema, async (request, extra) => {
        try {
          const task = await this._taskStore.getTask(request.params.taskId, extra.sessionId);
          if (!task) {
            throw new McpError(ErrorCode.InvalidParams, `Task not found: ${request.params.taskId}`);
          }
          if (isTerminal(task.status)) {
            throw new McpError(ErrorCode.InvalidParams, `Cannot cancel task in terminal status: ${task.status}`);
          }
          await this._taskStore.updateTaskStatus(request.params.taskId, "cancelled", "Client cancelled task execution.", extra.sessionId);
          this._clearTaskQueue(request.params.taskId);
          const cancelledTask = await this._taskStore.getTask(request.params.taskId, extra.sessionId);
          if (!cancelledTask) {
            throw new McpError(ErrorCode.InvalidParams, `Task not found after cancellation: ${request.params.taskId}`);
          }
          return {
            _meta: {},
            ...cancelledTask
          };
        } catch (error2) {
          if (error2 instanceof McpError) {
            throw error2;
          }
          throw new McpError(ErrorCode.InvalidRequest, `Failed to cancel task: ${error2 instanceof Error ? error2.message : String(error2)}`);
        }
      });
    }
  }
  async _oncancel(notification) {
    if (!notification.params.requestId) {
      return;
    }
    const controller = this._requestHandlerAbortControllers.get(notification.params.requestId);
    controller?.abort(notification.params.reason);
  }
  _setupTimeout(messageId, timeout, maxTotalTimeout, onTimeout, resetTimeoutOnProgress = false) {
    this._timeoutInfo.set(messageId, {
      timeoutId: setTimeout(onTimeout, timeout),
      startTime: Date.now(),
      timeout,
      maxTotalTimeout,
      resetTimeoutOnProgress,
      onTimeout
    });
  }
  _resetTimeout(messageId) {
    const info = this._timeoutInfo.get(messageId);
    if (!info)
      return false;
    const totalElapsed = Date.now() - info.startTime;
    if (info.maxTotalTimeout && totalElapsed >= info.maxTotalTimeout) {
      this._timeoutInfo.delete(messageId);
      throw McpError.fromError(ErrorCode.RequestTimeout, "Maximum total timeout exceeded", {
        maxTotalTimeout: info.maxTotalTimeout,
        totalElapsed
      });
    }
    clearTimeout(info.timeoutId);
    info.timeoutId = setTimeout(info.onTimeout, info.timeout);
    return true;
  }
  _cleanupTimeout(messageId) {
    const info = this._timeoutInfo.get(messageId);
    if (info) {
      clearTimeout(info.timeoutId);
      this._timeoutInfo.delete(messageId);
    }
  }
  /**
   * Attaches to the given transport, starts it, and starts listening for messages.
   *
   * The Protocol object assumes ownership of the Transport, replacing any callbacks that have already been set, and expects that it is the only user of the Transport instance going forward.
   */
  async connect(transport) {
    if (this._transport) {
      throw new Error("Already connected to a transport. Call close() before connecting to a new transport, or use a separate Protocol instance per connection.");
    }
    this._transport = transport;
    const _onclose = this.transport?.onclose;
    this._transport.onclose = () => {
      _onclose?.();
      this._onclose();
    };
    const _onerror = this.transport?.onerror;
    this._transport.onerror = (error2) => {
      _onerror?.(error2);
      this._onerror(error2);
    };
    const _onmessage = this._transport?.onmessage;
    this._transport.onmessage = (message, extra) => {
      _onmessage?.(message, extra);
      if (isJSONRPCResultResponse(message) || isJSONRPCErrorResponse(message)) {
        this._onresponse(message);
      } else if (isJSONRPCRequest(message)) {
        this._onrequest(message, extra);
      } else if (isJSONRPCNotification(message)) {
        this._onnotification(message);
      } else {
        this._onerror(new Error(`Unknown message type: ${JSON.stringify(message)}`));
      }
    };
    await this._transport.start();
  }
  _onclose() {
    const responseHandlers = this._responseHandlers;
    this._responseHandlers = /* @__PURE__ */ new Map();
    this._progressHandlers.clear();
    this._taskProgressTokens.clear();
    this._pendingDebouncedNotifications.clear();
    for (const info of this._timeoutInfo.values()) {
      clearTimeout(info.timeoutId);
    }
    this._timeoutInfo.clear();
    for (const controller of this._requestHandlerAbortControllers.values()) {
      controller.abort();
    }
    this._requestHandlerAbortControllers.clear();
    const error2 = McpError.fromError(ErrorCode.ConnectionClosed, "Connection closed");
    this._transport = void 0;
    this.onclose?.();
    for (const handler of responseHandlers.values()) {
      handler(error2);
    }
  }
  _onerror(error2) {
    this.onerror?.(error2);
  }
  _onnotification(notification) {
    const handler = this._notificationHandlers.get(notification.method) ?? this.fallbackNotificationHandler;
    if (handler === void 0) {
      return;
    }
    Promise.resolve().then(() => handler(notification)).catch((error2) => this._onerror(new Error(`Uncaught error in notification handler: ${error2}`)));
  }
  _onrequest(request, extra) {
    const handler = this._requestHandlers.get(request.method) ?? this.fallbackRequestHandler;
    const capturedTransport = this._transport;
    const relatedTaskId = request.params?._meta?.[RELATED_TASK_META_KEY]?.taskId;
    if (handler === void 0) {
      const errorResponse = {
        jsonrpc: "2.0",
        id: request.id,
        error: {
          code: ErrorCode.MethodNotFound,
          message: "Method not found"
        }
      };
      if (relatedTaskId && this._taskMessageQueue) {
        this._enqueueTaskMessage(relatedTaskId, {
          type: "error",
          message: errorResponse,
          timestamp: Date.now()
        }, capturedTransport?.sessionId).catch((error2) => this._onerror(new Error(`Failed to enqueue error response: ${error2}`)));
      } else {
        capturedTransport?.send(errorResponse).catch((error2) => this._onerror(new Error(`Failed to send an error response: ${error2}`)));
      }
      return;
    }
    const abortController = new AbortController();
    this._requestHandlerAbortControllers.set(request.id, abortController);
    const taskCreationParams = isTaskAugmentedRequestParams(request.params) ? request.params.task : void 0;
    const taskStore = this._taskStore ? this.requestTaskStore(request, capturedTransport?.sessionId) : void 0;
    const fullExtra = {
      signal: abortController.signal,
      sessionId: capturedTransport?.sessionId,
      _meta: request.params?._meta,
      sendNotification: /* @__PURE__ */ __name(async (notification) => {
        if (abortController.signal.aborted)
          return;
        const notificationOptions = { relatedRequestId: request.id };
        if (relatedTaskId) {
          notificationOptions.relatedTask = { taskId: relatedTaskId };
        }
        await this.notification(notification, notificationOptions);
      }, "sendNotification"),
      sendRequest: /* @__PURE__ */ __name(async (r, resultSchema, options) => {
        if (abortController.signal.aborted) {
          throw new McpError(ErrorCode.ConnectionClosed, "Request was cancelled");
        }
        const requestOptions = { ...options, relatedRequestId: request.id };
        if (relatedTaskId && !requestOptions.relatedTask) {
          requestOptions.relatedTask = { taskId: relatedTaskId };
        }
        const effectiveTaskId = requestOptions.relatedTask?.taskId ?? relatedTaskId;
        if (effectiveTaskId && taskStore) {
          await taskStore.updateTaskStatus(effectiveTaskId, "input_required");
        }
        return await this.request(r, resultSchema, requestOptions);
      }, "sendRequest"),
      authInfo: extra?.authInfo,
      requestId: request.id,
      requestInfo: extra?.requestInfo,
      taskId: relatedTaskId,
      taskStore,
      taskRequestedTtl: taskCreationParams?.ttl,
      closeSSEStream: extra?.closeSSEStream,
      closeStandaloneSSEStream: extra?.closeStandaloneSSEStream
    };
    Promise.resolve().then(() => {
      if (taskCreationParams) {
        this.assertTaskHandlerCapability(request.method);
      }
    }).then(() => handler(request, fullExtra)).then(async (result) => {
      if (abortController.signal.aborted) {
        return;
      }
      const response = {
        result,
        jsonrpc: "2.0",
        id: request.id
      };
      if (relatedTaskId && this._taskMessageQueue) {
        await this._enqueueTaskMessage(relatedTaskId, {
          type: "response",
          message: response,
          timestamp: Date.now()
        }, capturedTransport?.sessionId);
      } else {
        await capturedTransport?.send(response);
      }
    }, async (error2) => {
      if (abortController.signal.aborted) {
        return;
      }
      const errorResponse = {
        jsonrpc: "2.0",
        id: request.id,
        error: {
          code: Number.isSafeInteger(error2["code"]) ? error2["code"] : ErrorCode.InternalError,
          message: error2.message ?? "Internal error",
          ...error2["data"] !== void 0 && { data: error2["data"] }
        }
      };
      if (relatedTaskId && this._taskMessageQueue) {
        await this._enqueueTaskMessage(relatedTaskId, {
          type: "error",
          message: errorResponse,
          timestamp: Date.now()
        }, capturedTransport?.sessionId);
      } else {
        await capturedTransport?.send(errorResponse);
      }
    }).catch((error2) => this._onerror(new Error(`Failed to send response: ${error2}`))).finally(() => {
      if (this._requestHandlerAbortControllers.get(request.id) === abortController) {
        this._requestHandlerAbortControllers.delete(request.id);
      }
    });
  }
  _onprogress(notification) {
    const { progressToken, ...params } = notification.params;
    const messageId = Number(progressToken);
    const handler = this._progressHandlers.get(messageId);
    if (!handler) {
      this._onerror(new Error(`Received a progress notification for an unknown token: ${JSON.stringify(notification)}`));
      return;
    }
    const responseHandler = this._responseHandlers.get(messageId);
    const timeoutInfo = this._timeoutInfo.get(messageId);
    if (timeoutInfo && responseHandler && timeoutInfo.resetTimeoutOnProgress) {
      try {
        this._resetTimeout(messageId);
      } catch (error2) {
        this._responseHandlers.delete(messageId);
        this._progressHandlers.delete(messageId);
        this._cleanupTimeout(messageId);
        responseHandler(error2);
        return;
      }
    }
    handler(params);
  }
  _onresponse(response) {
    const messageId = Number(response.id);
    const resolver = this._requestResolvers.get(messageId);
    if (resolver) {
      this._requestResolvers.delete(messageId);
      if (isJSONRPCResultResponse(response)) {
        resolver(response);
      } else {
        const error2 = new McpError(response.error.code, response.error.message, response.error.data);
        resolver(error2);
      }
      return;
    }
    const handler = this._responseHandlers.get(messageId);
    if (handler === void 0) {
      this._onerror(new Error(`Received a response for an unknown message ID: ${JSON.stringify(response)}`));
      return;
    }
    this._responseHandlers.delete(messageId);
    this._cleanupTimeout(messageId);
    let isTaskResponse = false;
    if (isJSONRPCResultResponse(response) && response.result && typeof response.result === "object") {
      const result = response.result;
      if (result.task && typeof result.task === "object") {
        const task = result.task;
        if (typeof task.taskId === "string") {
          isTaskResponse = true;
          this._taskProgressTokens.set(task.taskId, messageId);
        }
      }
    }
    if (!isTaskResponse) {
      this._progressHandlers.delete(messageId);
    }
    if (isJSONRPCResultResponse(response)) {
      handler(response);
    } else {
      const error2 = McpError.fromError(response.error.code, response.error.message, response.error.data);
      handler(error2);
    }
  }
  get transport() {
    return this._transport;
  }
  /**
   * Closes the connection.
   */
  async close() {
    await this._transport?.close();
  }
  /**
   * Sends a request and returns an AsyncGenerator that yields response messages.
   * The generator is guaranteed to end with either a 'result' or 'error' message.
   *
   * @example
   * ```typescript
   * const stream = protocol.requestStream(request, resultSchema, options);
   * for await (const message of stream) {
   *   switch (message.type) {
   *     case 'taskCreated':
   *       console.log('Task created:', message.task.taskId);
   *       break;
   *     case 'taskStatus':
   *       console.log('Task status:', message.task.status);
   *       break;
   *     case 'result':
   *       console.log('Final result:', message.result);
   *       break;
   *     case 'error':
   *       console.error('Error:', message.error);
   *       break;
   *   }
   * }
   * ```
   *
   * @experimental Use `client.experimental.tasks.requestStream()` to access this method.
   */
  async *requestStream(request, resultSchema, options) {
    const { task } = options ?? {};
    if (!task) {
      try {
        const result = await this.request(request, resultSchema, options);
        yield { type: "result", result };
      } catch (error2) {
        yield {
          type: "error",
          error: error2 instanceof McpError ? error2 : new McpError(ErrorCode.InternalError, String(error2))
        };
      }
      return;
    }
    let taskId;
    try {
      const createResult = await this.request(request, CreateTaskResultSchema, options);
      if (createResult.task) {
        taskId = createResult.task.taskId;
        yield { type: "taskCreated", task: createResult.task };
      } else {
        throw new McpError(ErrorCode.InternalError, "Task creation did not return a task");
      }
      while (true) {
        const task2 = await this.getTask({ taskId }, options);
        yield { type: "taskStatus", task: task2 };
        if (isTerminal(task2.status)) {
          if (task2.status === "completed") {
            const result = await this.getTaskResult({ taskId }, resultSchema, options);
            yield { type: "result", result };
          } else if (task2.status === "failed") {
            yield {
              type: "error",
              error: new McpError(ErrorCode.InternalError, `Task ${taskId} failed`)
            };
          } else if (task2.status === "cancelled") {
            yield {
              type: "error",
              error: new McpError(ErrorCode.InternalError, `Task ${taskId} was cancelled`)
            };
          }
          return;
        }
        if (task2.status === "input_required") {
          const result = await this.getTaskResult({ taskId }, resultSchema, options);
          yield { type: "result", result };
          return;
        }
        const pollInterval = task2.pollInterval ?? this._options?.defaultTaskPollInterval ?? 1e3;
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
        options?.signal?.throwIfAborted();
      }
    } catch (error2) {
      yield {
        type: "error",
        error: error2 instanceof McpError ? error2 : new McpError(ErrorCode.InternalError, String(error2))
      };
    }
  }
  /**
   * Sends a request and waits for a response.
   *
   * Do not use this method to emit notifications! Use notification() instead.
   */
  request(request, resultSchema, options) {
    const { relatedRequestId, resumptionToken, onresumptiontoken, task, relatedTask } = options ?? {};
    return new Promise((resolve, reject) => {
      const earlyReject = /* @__PURE__ */ __name((error2) => {
        reject(error2);
      }, "earlyReject");
      if (!this._transport) {
        earlyReject(new Error("Not connected"));
        return;
      }
      if (this._options?.enforceStrictCapabilities === true) {
        try {
          this.assertCapabilityForMethod(request.method);
          if (task) {
            this.assertTaskCapability(request.method);
          }
        } catch (e) {
          earlyReject(e);
          return;
        }
      }
      options?.signal?.throwIfAborted();
      const messageId = this._requestMessageId++;
      const jsonrpcRequest = {
        ...request,
        jsonrpc: "2.0",
        id: messageId
      };
      if (options?.onprogress) {
        this._progressHandlers.set(messageId, options.onprogress);
        jsonrpcRequest.params = {
          ...request.params,
          _meta: {
            ...request.params?._meta || {},
            progressToken: messageId
          }
        };
      }
      if (task) {
        jsonrpcRequest.params = {
          ...jsonrpcRequest.params,
          task
        };
      }
      if (relatedTask) {
        jsonrpcRequest.params = {
          ...jsonrpcRequest.params,
          _meta: {
            ...jsonrpcRequest.params?._meta || {},
            [RELATED_TASK_META_KEY]: relatedTask
          }
        };
      }
      const cancel = /* @__PURE__ */ __name((reason) => {
        this._responseHandlers.delete(messageId);
        this._progressHandlers.delete(messageId);
        this._cleanupTimeout(messageId);
        this._transport?.send({
          jsonrpc: "2.0",
          method: "notifications/cancelled",
          params: {
            requestId: messageId,
            reason: String(reason)
          }
        }, { relatedRequestId, resumptionToken, onresumptiontoken }).catch((error3) => this._onerror(new Error(`Failed to send cancellation: ${error3}`)));
        const error2 = reason instanceof McpError ? reason : new McpError(ErrorCode.RequestTimeout, String(reason));
        reject(error2);
      }, "cancel");
      this._responseHandlers.set(messageId, (response) => {
        if (options?.signal?.aborted) {
          return;
        }
        if (response instanceof Error) {
          return reject(response);
        }
        try {
          const parseResult = safeParse2(resultSchema, response.result);
          if (!parseResult.success) {
            reject(parseResult.error);
          } else {
            resolve(parseResult.data);
          }
        } catch (error2) {
          reject(error2);
        }
      });
      options?.signal?.addEventListener("abort", () => {
        cancel(options?.signal?.reason);
      });
      const timeout = options?.timeout ?? DEFAULT_REQUEST_TIMEOUT_MSEC;
      const timeoutHandler = /* @__PURE__ */ __name(() => cancel(McpError.fromError(ErrorCode.RequestTimeout, "Request timed out", { timeout })), "timeoutHandler");
      this._setupTimeout(messageId, timeout, options?.maxTotalTimeout, timeoutHandler, options?.resetTimeoutOnProgress ?? false);
      const relatedTaskId = relatedTask?.taskId;
      if (relatedTaskId) {
        const responseResolver = /* @__PURE__ */ __name((response) => {
          const handler = this._responseHandlers.get(messageId);
          if (handler) {
            handler(response);
          } else {
            this._onerror(new Error(`Response handler missing for side-channeled request ${messageId}`));
          }
        }, "responseResolver");
        this._requestResolvers.set(messageId, responseResolver);
        this._enqueueTaskMessage(relatedTaskId, {
          type: "request",
          message: jsonrpcRequest,
          timestamp: Date.now()
        }).catch((error2) => {
          this._cleanupTimeout(messageId);
          reject(error2);
        });
      } else {
        this._transport.send(jsonrpcRequest, { relatedRequestId, resumptionToken, onresumptiontoken }).catch((error2) => {
          this._cleanupTimeout(messageId);
          reject(error2);
        });
      }
    });
  }
  /**
   * Gets the current status of a task.
   *
   * @experimental Use `client.experimental.tasks.getTask()` to access this method.
   */
  async getTask(params, options) {
    return this.request({ method: "tasks/get", params }, GetTaskResultSchema, options);
  }
  /**
   * Retrieves the result of a completed task.
   *
   * @experimental Use `client.experimental.tasks.getTaskResult()` to access this method.
   */
  async getTaskResult(params, resultSchema, options) {
    return this.request({ method: "tasks/result", params }, resultSchema, options);
  }
  /**
   * Lists tasks, optionally starting from a pagination cursor.
   *
   * @experimental Use `client.experimental.tasks.listTasks()` to access this method.
   */
  async listTasks(params, options) {
    return this.request({ method: "tasks/list", params }, ListTasksResultSchema, options);
  }
  /**
   * Cancels a specific task.
   *
   * @experimental Use `client.experimental.tasks.cancelTask()` to access this method.
   */
  async cancelTask(params, options) {
    return this.request({ method: "tasks/cancel", params }, CancelTaskResultSchema, options);
  }
  /**
   * Emits a notification, which is a one-way message that does not expect a response.
   */
  async notification(notification, options) {
    if (!this._transport) {
      throw new Error("Not connected");
    }
    this.assertNotificationCapability(notification.method);
    const relatedTaskId = options?.relatedTask?.taskId;
    if (relatedTaskId) {
      const jsonrpcNotification2 = {
        ...notification,
        jsonrpc: "2.0",
        params: {
          ...notification.params,
          _meta: {
            ...notification.params?._meta || {},
            [RELATED_TASK_META_KEY]: options.relatedTask
          }
        }
      };
      await this._enqueueTaskMessage(relatedTaskId, {
        type: "notification",
        message: jsonrpcNotification2,
        timestamp: Date.now()
      });
      return;
    }
    const debouncedMethods = this._options?.debouncedNotificationMethods ?? [];
    const canDebounce = debouncedMethods.includes(notification.method) && !notification.params && !options?.relatedRequestId && !options?.relatedTask;
    if (canDebounce) {
      if (this._pendingDebouncedNotifications.has(notification.method)) {
        return;
      }
      this._pendingDebouncedNotifications.add(notification.method);
      Promise.resolve().then(() => {
        this._pendingDebouncedNotifications.delete(notification.method);
        if (!this._transport) {
          return;
        }
        let jsonrpcNotification2 = {
          ...notification,
          jsonrpc: "2.0"
        };
        if (options?.relatedTask) {
          jsonrpcNotification2 = {
            ...jsonrpcNotification2,
            params: {
              ...jsonrpcNotification2.params,
              _meta: {
                ...jsonrpcNotification2.params?._meta || {},
                [RELATED_TASK_META_KEY]: options.relatedTask
              }
            }
          };
        }
        this._transport?.send(jsonrpcNotification2, options).catch((error2) => this._onerror(error2));
      });
      return;
    }
    let jsonrpcNotification = {
      ...notification,
      jsonrpc: "2.0"
    };
    if (options?.relatedTask) {
      jsonrpcNotification = {
        ...jsonrpcNotification,
        params: {
          ...jsonrpcNotification.params,
          _meta: {
            ...jsonrpcNotification.params?._meta || {},
            [RELATED_TASK_META_KEY]: options.relatedTask
          }
        }
      };
    }
    await this._transport.send(jsonrpcNotification, options);
  }
  /**
   * Registers a handler to invoke when this protocol object receives a request with the given method.
   *
   * Note that this will replace any previous request handler for the same method.
   */
  setRequestHandler(requestSchema, handler) {
    const method = getMethodLiteral(requestSchema);
    this.assertRequestHandlerCapability(method);
    this._requestHandlers.set(method, (request, extra) => {
      const parsed = parseWithCompat(requestSchema, request);
      return Promise.resolve(handler(parsed, extra));
    });
  }
  /**
   * Removes the request handler for the given method.
   */
  removeRequestHandler(method) {
    this._requestHandlers.delete(method);
  }
  /**
   * Asserts that a request handler has not already been set for the given method, in preparation for a new one being automatically installed.
   */
  assertCanSetRequestHandler(method) {
    if (this._requestHandlers.has(method)) {
      throw new Error(`A request handler for ${method} already exists, which would be overridden`);
    }
  }
  /**
   * Registers a handler to invoke when this protocol object receives a notification with the given method.
   *
   * Note that this will replace any previous notification handler for the same method.
   */
  setNotificationHandler(notificationSchema, handler) {
    const method = getMethodLiteral(notificationSchema);
    this._notificationHandlers.set(method, (notification) => {
      const parsed = parseWithCompat(notificationSchema, notification);
      return Promise.resolve(handler(parsed));
    });
  }
  /**
   * Removes the notification handler for the given method.
   */
  removeNotificationHandler(method) {
    this._notificationHandlers.delete(method);
  }
  /**
   * Cleans up the progress handler associated with a task.
   * This should be called when a task reaches a terminal status.
   */
  _cleanupTaskProgressHandler(taskId) {
    const progressToken = this._taskProgressTokens.get(taskId);
    if (progressToken !== void 0) {
      this._progressHandlers.delete(progressToken);
      this._taskProgressTokens.delete(taskId);
    }
  }
  /**
   * Enqueues a task-related message for side-channel delivery via tasks/result.
   * @param taskId The task ID to associate the message with
   * @param message The message to enqueue
   * @param sessionId Optional session ID for binding the operation to a specific session
   * @throws Error if taskStore is not configured or if enqueue fails (e.g., queue overflow)
   *
   * Note: If enqueue fails, it's the TaskMessageQueue implementation's responsibility to handle
   * the error appropriately (e.g., by failing the task, logging, etc.). The Protocol layer
   * simply propagates the error.
   */
  async _enqueueTaskMessage(taskId, message, sessionId) {
    if (!this._taskStore || !this._taskMessageQueue) {
      throw new Error("Cannot enqueue task message: taskStore and taskMessageQueue are not configured");
    }
    const maxQueueSize = this._options?.maxTaskQueueSize;
    await this._taskMessageQueue.enqueue(taskId, message, sessionId, maxQueueSize);
  }
  /**
   * Clears the message queue for a task and rejects any pending request resolvers.
   * @param taskId The task ID whose queue should be cleared
   * @param sessionId Optional session ID for binding the operation to a specific session
   */
  async _clearTaskQueue(taskId, sessionId) {
    if (this._taskMessageQueue) {
      const messages = await this._taskMessageQueue.dequeueAll(taskId, sessionId);
      for (const message of messages) {
        if (message.type === "request" && isJSONRPCRequest(message.message)) {
          const requestId = message.message.id;
          const resolver = this._requestResolvers.get(requestId);
          if (resolver) {
            resolver(new McpError(ErrorCode.InternalError, "Task cancelled or completed"));
            this._requestResolvers.delete(requestId);
          } else {
            this._onerror(new Error(`Resolver missing for request ${requestId} during task ${taskId} cleanup`));
          }
        }
      }
    }
  }
  /**
   * Waits for a task update (new messages or status change) with abort signal support.
   * Uses polling to check for updates at the task's configured poll interval.
   * @param taskId The task ID to wait for
   * @param signal Abort signal to cancel the wait
   * @returns Promise that resolves when an update occurs or rejects if aborted
   */
  async _waitForTaskUpdate(taskId, signal) {
    let interval = this._options?.defaultTaskPollInterval ?? 1e3;
    try {
      const task = await this._taskStore?.getTask(taskId);
      if (task?.pollInterval) {
        interval = task.pollInterval;
      }
    } catch {
    }
    return new Promise((resolve, reject) => {
      if (signal.aborted) {
        reject(new McpError(ErrorCode.InvalidRequest, "Request cancelled"));
        return;
      }
      const timeoutId = setTimeout(resolve, interval);
      signal.addEventListener("abort", () => {
        clearTimeout(timeoutId);
        reject(new McpError(ErrorCode.InvalidRequest, "Request cancelled"));
      }, { once: true });
    });
  }
  requestTaskStore(request, sessionId) {
    const taskStore = this._taskStore;
    if (!taskStore) {
      throw new Error("No task store configured");
    }
    return {
      createTask: /* @__PURE__ */ __name(async (taskParams) => {
        if (!request) {
          throw new Error("No request provided");
        }
        return await taskStore.createTask(taskParams, request.id, {
          method: request.method,
          params: request.params
        }, sessionId);
      }, "createTask"),
      getTask: /* @__PURE__ */ __name(async (taskId) => {
        const task = await taskStore.getTask(taskId, sessionId);
        if (!task) {
          throw new McpError(ErrorCode.InvalidParams, "Failed to retrieve task: Task not found");
        }
        return task;
      }, "getTask"),
      storeTaskResult: /* @__PURE__ */ __name(async (taskId, status, result) => {
        await taskStore.storeTaskResult(taskId, status, result, sessionId);
        const task = await taskStore.getTask(taskId, sessionId);
        if (task) {
          const notification = TaskStatusNotificationSchema.parse({
            method: "notifications/tasks/status",
            params: task
          });
          await this.notification(notification);
          if (isTerminal(task.status)) {
            this._cleanupTaskProgressHandler(taskId);
          }
        }
      }, "storeTaskResult"),
      getTaskResult: /* @__PURE__ */ __name((taskId) => {
        return taskStore.getTaskResult(taskId, sessionId);
      }, "getTaskResult"),
      updateTaskStatus: /* @__PURE__ */ __name(async (taskId, status, statusMessage) => {
        const task = await taskStore.getTask(taskId, sessionId);
        if (!task) {
          throw new McpError(ErrorCode.InvalidParams, `Task "${taskId}" not found - it may have been cleaned up`);
        }
        if (isTerminal(task.status)) {
          throw new McpError(ErrorCode.InvalidParams, `Cannot update task "${taskId}" from terminal status "${task.status}" to "${status}". Terminal states (completed, failed, cancelled) cannot transition to other states.`);
        }
        await taskStore.updateTaskStatus(taskId, status, statusMessage, sessionId);
        const updatedTask = await taskStore.getTask(taskId, sessionId);
        if (updatedTask) {
          const notification = TaskStatusNotificationSchema.parse({
            method: "notifications/tasks/status",
            params: updatedTask
          });
          await this.notification(notification);
          if (isTerminal(updatedTask.status)) {
            this._cleanupTaskProgressHandler(taskId);
          }
        }
      }, "updateTaskStatus"),
      listTasks: /* @__PURE__ */ __name((cursor) => {
        return taskStore.listTasks(cursor, sessionId);
      }, "listTasks")
    };
  }
};
function isPlainObject2(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
__name(isPlainObject2, "isPlainObject");
function mergeCapabilities(base, additional) {
  const result = { ...base };
  for (const key in additional) {
    const k = key;
    const addValue = additional[k];
    if (addValue === void 0)
      continue;
    const baseValue = result[k];
    if (isPlainObject2(baseValue) && isPlainObject2(addValue)) {
      result[k] = { ...baseValue, ...addValue };
    } else {
      result[k] = addValue;
    }
  }
  return result;
}
__name(mergeCapabilities, "mergeCapabilities");

// node_modules/@modelcontextprotocol/sdk/dist/esm/validation/ajv-provider.js
init_modules_watch_stub();
var import_ajv = __toESM(require_ajv(), 1);
var import_ajv_formats = __toESM(require_dist(), 1);
function createDefaultAjvInstance() {
  const ajv = new import_ajv.default({
    strict: false,
    validateFormats: true,
    validateSchema: false,
    allErrors: true
  });
  const addFormats = import_ajv_formats.default;
  addFormats(ajv);
  return ajv;
}
__name(createDefaultAjvInstance, "createDefaultAjvInstance");
var AjvJsonSchemaValidator = class {
  static {
    __name(this, "AjvJsonSchemaValidator");
  }
  /**
   * Create an AJV validator
   *
   * @param ajv - Optional pre-configured AJV instance. If not provided, a default instance will be created.
   *
   * @example
   * ```typescript
   * // Use default configuration (recommended for most cases)
   * import { AjvJsonSchemaValidator } from '@modelcontextprotocol/sdk/validation/ajv';
   * const validator = new AjvJsonSchemaValidator();
   *
   * // Or provide custom AJV instance for advanced configuration
   * import { Ajv } from 'ajv';
   * import addFormats from 'ajv-formats';
   *
   * const ajv = new Ajv({ validateFormats: true });
   * addFormats(ajv);
   * const validator = new AjvJsonSchemaValidator(ajv);
   * ```
   */
  constructor(ajv) {
    this._ajv = ajv ?? createDefaultAjvInstance();
  }
  /**
   * Create a validator for the given JSON Schema
   *
   * The validator is compiled once and can be reused multiple times.
   * If the schema has an $id, it will be cached by AJV automatically.
   *
   * @param schema - Standard JSON Schema object
   * @returns A validator function that validates input data
   */
  getValidator(schema) {
    const ajvValidator = "$id" in schema && typeof schema.$id === "string" ? this._ajv.getSchema(schema.$id) ?? this._ajv.compile(schema) : this._ajv.compile(schema);
    return (input) => {
      const valid = ajvValidator(input);
      if (valid) {
        return {
          valid: true,
          data: input,
          errorMessage: void 0
        };
      } else {
        return {
          valid: false,
          data: void 0,
          errorMessage: this._ajv.errorsText(ajvValidator.errors)
        };
      }
    };
  }
};

// node_modules/@modelcontextprotocol/sdk/dist/esm/experimental/tasks/server.js
init_modules_watch_stub();
var ExperimentalServerTasks = class {
  static {
    __name(this, "ExperimentalServerTasks");
  }
  constructor(_server) {
    this._server = _server;
  }
  /**
   * Sends a request and returns an AsyncGenerator that yields response messages.
   * The generator is guaranteed to end with either a 'result' or 'error' message.
   *
   * This method provides streaming access to request processing, allowing you to
   * observe intermediate task status updates for task-augmented requests.
   *
   * @param request - The request to send
   * @param resultSchema - Zod schema for validating the result
   * @param options - Optional request options (timeout, signal, task creation params, etc.)
   * @returns AsyncGenerator that yields ResponseMessage objects
   *
   * @experimental
   */
  requestStream(request, resultSchema, options) {
    return this._server.requestStream(request, resultSchema, options);
  }
  /**
   * Sends a sampling request and returns an AsyncGenerator that yields response messages.
   * The generator is guaranteed to end with either a 'result' or 'error' message.
   *
   * For task-augmented requests, yields 'taskCreated' and 'taskStatus' messages
   * before the final result.
   *
   * @example
   * ```typescript
   * const stream = server.experimental.tasks.createMessageStream({
   *     messages: [{ role: 'user', content: { type: 'text', text: 'Hello' } }],
   *     maxTokens: 100
   * }, {
   *     onprogress: (progress) => {
   *         // Handle streaming tokens via progress notifications
   *         console.log('Progress:', progress.message);
   *     }
   * });
   *
   * for await (const message of stream) {
   *     switch (message.type) {
   *         case 'taskCreated':
   *             console.log('Task created:', message.task.taskId);
   *             break;
   *         case 'taskStatus':
   *             console.log('Task status:', message.task.status);
   *             break;
   *         case 'result':
   *             console.log('Final result:', message.result);
   *             break;
   *         case 'error':
   *             console.error('Error:', message.error);
   *             break;
   *     }
   * }
   * ```
   *
   * @param params - The sampling request parameters
   * @param options - Optional request options (timeout, signal, task creation params, onprogress, etc.)
   * @returns AsyncGenerator that yields ResponseMessage objects
   *
   * @experimental
   */
  createMessageStream(params, options) {
    const clientCapabilities = this._server.getClientCapabilities();
    if ((params.tools || params.toolChoice) && !clientCapabilities?.sampling?.tools) {
      throw new Error("Client does not support sampling tools capability.");
    }
    if (params.messages.length > 0) {
      const lastMessage = params.messages[params.messages.length - 1];
      const lastContent = Array.isArray(lastMessage.content) ? lastMessage.content : [lastMessage.content];
      const hasToolResults = lastContent.some((c) => c.type === "tool_result");
      const previousMessage = params.messages.length > 1 ? params.messages[params.messages.length - 2] : void 0;
      const previousContent = previousMessage ? Array.isArray(previousMessage.content) ? previousMessage.content : [previousMessage.content] : [];
      const hasPreviousToolUse = previousContent.some((c) => c.type === "tool_use");
      if (hasToolResults) {
        if (lastContent.some((c) => c.type !== "tool_result")) {
          throw new Error("The last message must contain only tool_result content if any is present");
        }
        if (!hasPreviousToolUse) {
          throw new Error("tool_result blocks are not matching any tool_use from the previous message");
        }
      }
      if (hasPreviousToolUse) {
        const toolUseIds = new Set(previousContent.filter((c) => c.type === "tool_use").map((c) => c.id));
        const toolResultIds = new Set(lastContent.filter((c) => c.type === "tool_result").map((c) => c.toolUseId));
        if (toolUseIds.size !== toolResultIds.size || ![...toolUseIds].every((id) => toolResultIds.has(id))) {
          throw new Error("ids of tool_result blocks and tool_use blocks from previous message do not match");
        }
      }
    }
    return this.requestStream({
      method: "sampling/createMessage",
      params
    }, CreateMessageResultSchema, options);
  }
  /**
   * Sends an elicitation request and returns an AsyncGenerator that yields response messages.
   * The generator is guaranteed to end with either a 'result' or 'error' message.
   *
   * For task-augmented requests (especially URL-based elicitation), yields 'taskCreated'
   * and 'taskStatus' messages before the final result.
   *
   * @example
   * ```typescript
   * const stream = server.experimental.tasks.elicitInputStream({
   *     mode: 'url',
   *     message: 'Please authenticate',
   *     elicitationId: 'auth-123',
   *     url: 'https://example.com/auth'
   * }, {
   *     task: { ttl: 300000 } // Task-augmented for long-running auth flow
   * });
   *
   * for await (const message of stream) {
   *     switch (message.type) {
   *         case 'taskCreated':
   *             console.log('Task created:', message.task.taskId);
   *             break;
   *         case 'taskStatus':
   *             console.log('Task status:', message.task.status);
   *             break;
   *         case 'result':
   *             console.log('User action:', message.result.action);
   *             break;
   *         case 'error':
   *             console.error('Error:', message.error);
   *             break;
   *     }
   * }
   * ```
   *
   * @param params - The elicitation request parameters
   * @param options - Optional request options (timeout, signal, task creation params, etc.)
   * @returns AsyncGenerator that yields ResponseMessage objects
   *
   * @experimental
   */
  elicitInputStream(params, options) {
    const clientCapabilities = this._server.getClientCapabilities();
    const mode = params.mode ?? "form";
    switch (mode) {
      case "url": {
        if (!clientCapabilities?.elicitation?.url) {
          throw new Error("Client does not support url elicitation.");
        }
        break;
      }
      case "form": {
        if (!clientCapabilities?.elicitation?.form) {
          throw new Error("Client does not support form elicitation.");
        }
        break;
      }
    }
    const normalizedParams = mode === "form" && params.mode === void 0 ? { ...params, mode: "form" } : params;
    return this.requestStream({
      method: "elicitation/create",
      params: normalizedParams
    }, ElicitResultSchema, options);
  }
  /**
   * Gets the current status of a task.
   *
   * @param taskId - The task identifier
   * @param options - Optional request options
   * @returns The task status
   *
   * @experimental
   */
  async getTask(taskId, options) {
    return this._server.getTask({ taskId }, options);
  }
  /**
   * Retrieves the result of a completed task.
   *
   * @param taskId - The task identifier
   * @param resultSchema - Zod schema for validating the result
   * @param options - Optional request options
   * @returns The task result
   *
   * @experimental
   */
  async getTaskResult(taskId, resultSchema, options) {
    return this._server.getTaskResult({ taskId }, resultSchema, options);
  }
  /**
   * Lists tasks with optional pagination.
   *
   * @param cursor - Optional pagination cursor
   * @param options - Optional request options
   * @returns List of tasks with optional next cursor
   *
   * @experimental
   */
  async listTasks(cursor, options) {
    return this._server.listTasks(cursor ? { cursor } : void 0, options);
  }
  /**
   * Cancels a running task.
   *
   * @param taskId - The task identifier
   * @param options - Optional request options
   *
   * @experimental
   */
  async cancelTask(taskId, options) {
    return this._server.cancelTask({ taskId }, options);
  }
};

// node_modules/@modelcontextprotocol/sdk/dist/esm/experimental/tasks/helpers.js
init_modules_watch_stub();
function assertToolsCallTaskCapability(requests, method, entityName) {
  if (!requests) {
    throw new Error(`${entityName} does not support task creation (required for ${method})`);
  }
  switch (method) {
    case "tools/call":
      if (!requests.tools?.call) {
        throw new Error(`${entityName} does not support task creation for tools/call (required for ${method})`);
      }
      break;
    default:
      break;
  }
}
__name(assertToolsCallTaskCapability, "assertToolsCallTaskCapability");
function assertClientRequestTaskCapability(requests, method, entityName) {
  if (!requests) {
    throw new Error(`${entityName} does not support task creation (required for ${method})`);
  }
  switch (method) {
    case "sampling/createMessage":
      if (!requests.sampling?.createMessage) {
        throw new Error(`${entityName} does not support task creation for sampling/createMessage (required for ${method})`);
      }
      break;
    case "elicitation/create":
      if (!requests.elicitation?.create) {
        throw new Error(`${entityName} does not support task creation for elicitation/create (required for ${method})`);
      }
      break;
    default:
      break;
  }
}
__name(assertClientRequestTaskCapability, "assertClientRequestTaskCapability");

// node_modules/@modelcontextprotocol/sdk/dist/esm/server/index.js
var Server = class extends Protocol {
  static {
    __name(this, "Server");
  }
  /**
   * Initializes this server with the given name and version information.
   */
  constructor(_serverInfo, options) {
    super(options);
    this._serverInfo = _serverInfo;
    this._loggingLevels = /* @__PURE__ */ new Map();
    this.LOG_LEVEL_SEVERITY = new Map(LoggingLevelSchema.options.map((level, index) => [level, index]));
    this.isMessageIgnored = (level, sessionId) => {
      const currentLevel = this._loggingLevels.get(sessionId);
      return currentLevel ? this.LOG_LEVEL_SEVERITY.get(level) < this.LOG_LEVEL_SEVERITY.get(currentLevel) : false;
    };
    this._capabilities = options?.capabilities ?? {};
    this._instructions = options?.instructions;
    this._jsonSchemaValidator = options?.jsonSchemaValidator ?? new AjvJsonSchemaValidator();
    this.setRequestHandler(InitializeRequestSchema, (request) => this._oninitialize(request));
    this.setNotificationHandler(InitializedNotificationSchema, () => this.oninitialized?.());
    if (this._capabilities.logging) {
      this.setRequestHandler(SetLevelRequestSchema, async (request, extra) => {
        const transportSessionId = extra.sessionId || extra.requestInfo?.headers["mcp-session-id"] || void 0;
        const { level } = request.params;
        const parseResult = LoggingLevelSchema.safeParse(level);
        if (parseResult.success) {
          this._loggingLevels.set(transportSessionId, parseResult.data);
        }
        return {};
      });
    }
  }
  /**
   * Access experimental features.
   *
   * WARNING: These APIs are experimental and may change without notice.
   *
   * @experimental
   */
  get experimental() {
    if (!this._experimental) {
      this._experimental = {
        tasks: new ExperimentalServerTasks(this)
      };
    }
    return this._experimental;
  }
  /**
   * Registers new capabilities. This can only be called before connecting to a transport.
   *
   * The new capabilities will be merged with any existing capabilities previously given (e.g., at initialization).
   */
  registerCapabilities(capabilities) {
    if (this.transport) {
      throw new Error("Cannot register capabilities after connecting to transport");
    }
    this._capabilities = mergeCapabilities(this._capabilities, capabilities);
  }
  /**
   * Override request handler registration to enforce server-side validation for tools/call.
   */
  setRequestHandler(requestSchema, handler) {
    const shape = getObjectShape(requestSchema);
    const methodSchema = shape?.method;
    if (!methodSchema) {
      throw new Error("Schema is missing a method literal");
    }
    let methodValue;
    if (isZ4Schema(methodSchema)) {
      const v4Schema = methodSchema;
      const v4Def = v4Schema._zod?.def;
      methodValue = v4Def?.value ?? v4Schema.value;
    } else {
      const v3Schema = methodSchema;
      const legacyDef = v3Schema._def;
      methodValue = legacyDef?.value ?? v3Schema.value;
    }
    if (typeof methodValue !== "string") {
      throw new Error("Schema method literal must be a string");
    }
    const method = methodValue;
    if (method === "tools/call") {
      const wrappedHandler = /* @__PURE__ */ __name(async (request, extra) => {
        const validatedRequest = safeParse2(CallToolRequestSchema, request);
        if (!validatedRequest.success) {
          const errorMessage = validatedRequest.error instanceof Error ? validatedRequest.error.message : String(validatedRequest.error);
          throw new McpError(ErrorCode.InvalidParams, `Invalid tools/call request: ${errorMessage}`);
        }
        const { params } = validatedRequest.data;
        const result = await Promise.resolve(handler(request, extra));
        if (params.task) {
          const taskValidationResult = safeParse2(CreateTaskResultSchema, result);
          if (!taskValidationResult.success) {
            const errorMessage = taskValidationResult.error instanceof Error ? taskValidationResult.error.message : String(taskValidationResult.error);
            throw new McpError(ErrorCode.InvalidParams, `Invalid task creation result: ${errorMessage}`);
          }
          return taskValidationResult.data;
        }
        const validationResult = safeParse2(CallToolResultSchema, result);
        if (!validationResult.success) {
          const errorMessage = validationResult.error instanceof Error ? validationResult.error.message : String(validationResult.error);
          throw new McpError(ErrorCode.InvalidParams, `Invalid tools/call result: ${errorMessage}`);
        }
        return validationResult.data;
      }, "wrappedHandler");
      return super.setRequestHandler(requestSchema, wrappedHandler);
    }
    return super.setRequestHandler(requestSchema, handler);
  }
  assertCapabilityForMethod(method) {
    switch (method) {
      case "sampling/createMessage":
        if (!this._clientCapabilities?.sampling) {
          throw new Error(`Client does not support sampling (required for ${method})`);
        }
        break;
      case "elicitation/create":
        if (!this._clientCapabilities?.elicitation) {
          throw new Error(`Client does not support elicitation (required for ${method})`);
        }
        break;
      case "roots/list":
        if (!this._clientCapabilities?.roots) {
          throw new Error(`Client does not support listing roots (required for ${method})`);
        }
        break;
      case "ping":
        break;
    }
  }
  assertNotificationCapability(method) {
    switch (method) {
      case "notifications/message":
        if (!this._capabilities.logging) {
          throw new Error(`Server does not support logging (required for ${method})`);
        }
        break;
      case "notifications/resources/updated":
      case "notifications/resources/list_changed":
        if (!this._capabilities.resources) {
          throw new Error(`Server does not support notifying about resources (required for ${method})`);
        }
        break;
      case "notifications/tools/list_changed":
        if (!this._capabilities.tools) {
          throw new Error(`Server does not support notifying of tool list changes (required for ${method})`);
        }
        break;
      case "notifications/prompts/list_changed":
        if (!this._capabilities.prompts) {
          throw new Error(`Server does not support notifying of prompt list changes (required for ${method})`);
        }
        break;
      case "notifications/elicitation/complete":
        if (!this._clientCapabilities?.elicitation?.url) {
          throw new Error(`Client does not support URL elicitation (required for ${method})`);
        }
        break;
      case "notifications/cancelled":
        break;
      case "notifications/progress":
        break;
    }
  }
  assertRequestHandlerCapability(method) {
    if (!this._capabilities) {
      return;
    }
    switch (method) {
      case "completion/complete":
        if (!this._capabilities.completions) {
          throw new Error(`Server does not support completions (required for ${method})`);
        }
        break;
      case "logging/setLevel":
        if (!this._capabilities.logging) {
          throw new Error(`Server does not support logging (required for ${method})`);
        }
        break;
      case "prompts/get":
      case "prompts/list":
        if (!this._capabilities.prompts) {
          throw new Error(`Server does not support prompts (required for ${method})`);
        }
        break;
      case "resources/list":
      case "resources/templates/list":
      case "resources/read":
        if (!this._capabilities.resources) {
          throw new Error(`Server does not support resources (required for ${method})`);
        }
        break;
      case "tools/call":
      case "tools/list":
        if (!this._capabilities.tools) {
          throw new Error(`Server does not support tools (required for ${method})`);
        }
        break;
      case "tasks/get":
      case "tasks/list":
      case "tasks/result":
      case "tasks/cancel":
        if (!this._capabilities.tasks) {
          throw new Error(`Server does not support tasks capability (required for ${method})`);
        }
        break;
      case "ping":
      case "initialize":
        break;
    }
  }
  assertTaskCapability(method) {
    assertClientRequestTaskCapability(this._clientCapabilities?.tasks?.requests, method, "Client");
  }
  assertTaskHandlerCapability(method) {
    if (!this._capabilities) {
      return;
    }
    assertToolsCallTaskCapability(this._capabilities.tasks?.requests, method, "Server");
  }
  async _oninitialize(request) {
    const requestedVersion = request.params.protocolVersion;
    this._clientCapabilities = request.params.capabilities;
    this._clientVersion = request.params.clientInfo;
    const protocolVersion = SUPPORTED_PROTOCOL_VERSIONS.includes(requestedVersion) ? requestedVersion : LATEST_PROTOCOL_VERSION;
    return {
      protocolVersion,
      capabilities: this.getCapabilities(),
      serverInfo: this._serverInfo,
      ...this._instructions && { instructions: this._instructions }
    };
  }
  /**
   * After initialization has completed, this will be populated with the client's reported capabilities.
   */
  getClientCapabilities() {
    return this._clientCapabilities;
  }
  /**
   * After initialization has completed, this will be populated with information about the client's name and version.
   */
  getClientVersion() {
    return this._clientVersion;
  }
  getCapabilities() {
    return this._capabilities;
  }
  async ping() {
    return this.request({ method: "ping" }, EmptyResultSchema);
  }
  // Implementation
  async createMessage(params, options) {
    if (params.tools || params.toolChoice) {
      if (!this._clientCapabilities?.sampling?.tools) {
        throw new Error("Client does not support sampling tools capability.");
      }
    }
    if (params.messages.length > 0) {
      const lastMessage = params.messages[params.messages.length - 1];
      const lastContent = Array.isArray(lastMessage.content) ? lastMessage.content : [lastMessage.content];
      const hasToolResults = lastContent.some((c) => c.type === "tool_result");
      const previousMessage = params.messages.length > 1 ? params.messages[params.messages.length - 2] : void 0;
      const previousContent = previousMessage ? Array.isArray(previousMessage.content) ? previousMessage.content : [previousMessage.content] : [];
      const hasPreviousToolUse = previousContent.some((c) => c.type === "tool_use");
      if (hasToolResults) {
        if (lastContent.some((c) => c.type !== "tool_result")) {
          throw new Error("The last message must contain only tool_result content if any is present");
        }
        if (!hasPreviousToolUse) {
          throw new Error("tool_result blocks are not matching any tool_use from the previous message");
        }
      }
      if (hasPreviousToolUse) {
        const toolUseIds = new Set(previousContent.filter((c) => c.type === "tool_use").map((c) => c.id));
        const toolResultIds = new Set(lastContent.filter((c) => c.type === "tool_result").map((c) => c.toolUseId));
        if (toolUseIds.size !== toolResultIds.size || ![...toolUseIds].every((id) => toolResultIds.has(id))) {
          throw new Error("ids of tool_result blocks and tool_use blocks from previous message do not match");
        }
      }
    }
    if (params.tools) {
      return this.request({ method: "sampling/createMessage", params }, CreateMessageResultWithToolsSchema, options);
    }
    return this.request({ method: "sampling/createMessage", params }, CreateMessageResultSchema, options);
  }
  /**
   * Creates an elicitation request for the given parameters.
   * For backwards compatibility, `mode` may be omitted for form requests and will default to `'form'`.
   * @param params The parameters for the elicitation request.
   * @param options Optional request options.
   * @returns The result of the elicitation request.
   */
  async elicitInput(params, options) {
    const mode = params.mode ?? "form";
    switch (mode) {
      case "url": {
        if (!this._clientCapabilities?.elicitation?.url) {
          throw new Error("Client does not support url elicitation.");
        }
        const urlParams = params;
        return this.request({ method: "elicitation/create", params: urlParams }, ElicitResultSchema, options);
      }
      case "form": {
        if (!this._clientCapabilities?.elicitation?.form) {
          throw new Error("Client does not support form elicitation.");
        }
        const formParams = params.mode === "form" ? params : { ...params, mode: "form" };
        const result = await this.request({ method: "elicitation/create", params: formParams }, ElicitResultSchema, options);
        if (result.action === "accept" && result.content && formParams.requestedSchema) {
          try {
            const validator = this._jsonSchemaValidator.getValidator(formParams.requestedSchema);
            const validationResult = validator(result.content);
            if (!validationResult.valid) {
              throw new McpError(ErrorCode.InvalidParams, `Elicitation response content does not match requested schema: ${validationResult.errorMessage}`);
            }
          } catch (error2) {
            if (error2 instanceof McpError) {
              throw error2;
            }
            throw new McpError(ErrorCode.InternalError, `Error validating elicitation response: ${error2 instanceof Error ? error2.message : String(error2)}`);
          }
        }
        return result;
      }
    }
  }
  /**
   * Creates a reusable callback that, when invoked, will send a `notifications/elicitation/complete`
   * notification for the specified elicitation ID.
   *
   * @param elicitationId The ID of the elicitation to mark as complete.
   * @param options Optional notification options. Useful when the completion notification should be related to a prior request.
   * @returns A function that emits the completion notification when awaited.
   */
  createElicitationCompletionNotifier(elicitationId, options) {
    if (!this._clientCapabilities?.elicitation?.url) {
      throw new Error("Client does not support URL elicitation (required for notifications/elicitation/complete)");
    }
    return () => this.notification({
      method: "notifications/elicitation/complete",
      params: {
        elicitationId
      }
    }, options);
  }
  async listRoots(params, options) {
    return this.request({ method: "roots/list", params }, ListRootsResultSchema, options);
  }
  /**
   * Sends a logging message to the client, if connected.
   * Note: You only need to send the parameters object, not the entire JSON RPC message
   * @see LoggingMessageNotification
   * @param params
   * @param sessionId optional for stateless and backward compatibility
   */
  async sendLoggingMessage(params, sessionId) {
    if (this._capabilities.logging) {
      if (!this.isMessageIgnored(params.level, sessionId)) {
        return this.notification({ method: "notifications/message", params });
      }
    }
  }
  async sendResourceUpdated(params) {
    return this.notification({
      method: "notifications/resources/updated",
      params
    });
  }
  async sendResourceListChanged() {
    return this.notification({
      method: "notifications/resources/list_changed"
    });
  }
  async sendToolListChanged() {
    return this.notification({ method: "notifications/tools/list_changed" });
  }
  async sendPromptListChanged() {
    return this.notification({ method: "notifications/prompts/list_changed" });
  }
};

// node_modules/@modelcontextprotocol/sdk/dist/esm/server/webStandardStreamableHttp.js
init_modules_watch_stub();
var WebStandardStreamableHTTPServerTransport = class {
  static {
    __name(this, "WebStandardStreamableHTTPServerTransport");
  }
  constructor(options = {}) {
    this._started = false;
    this._hasHandledRequest = false;
    this._streamMapping = /* @__PURE__ */ new Map();
    this._requestToStreamMapping = /* @__PURE__ */ new Map();
    this._requestResponseMap = /* @__PURE__ */ new Map();
    this._initialized = false;
    this._enableJsonResponse = false;
    this._standaloneSseStreamId = "_GET_stream";
    this.sessionIdGenerator = options.sessionIdGenerator;
    this._enableJsonResponse = options.enableJsonResponse ?? false;
    this._eventStore = options.eventStore;
    this._onsessioninitialized = options.onsessioninitialized;
    this._onsessionclosed = options.onsessionclosed;
    this._allowedHosts = options.allowedHosts;
    this._allowedOrigins = options.allowedOrigins;
    this._enableDnsRebindingProtection = options.enableDnsRebindingProtection ?? false;
    this._retryInterval = options.retryInterval;
  }
  /**
   * Starts the transport. This is required by the Transport interface but is a no-op
   * for the Streamable HTTP transport as connections are managed per-request.
   */
  async start() {
    if (this._started) {
      throw new Error("Transport already started");
    }
    this._started = true;
  }
  /**
   * Helper to create a JSON error response
   */
  createJsonErrorResponse(status, code, message, options) {
    const error2 = { code, message };
    if (options?.data !== void 0) {
      error2.data = options.data;
    }
    return new Response(JSON.stringify({
      jsonrpc: "2.0",
      error: error2,
      id: null
    }), {
      status,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers
      }
    });
  }
  /**
   * Validates request headers for DNS rebinding protection.
   * @returns Error response if validation fails, undefined if validation passes.
   */
  validateRequestHeaders(req) {
    if (!this._enableDnsRebindingProtection) {
      return void 0;
    }
    if (this._allowedHosts && this._allowedHosts.length > 0) {
      const hostHeader = req.headers.get("host");
      if (!hostHeader || !this._allowedHosts.includes(hostHeader)) {
        const error2 = `Invalid Host header: ${hostHeader}`;
        this.onerror?.(new Error(error2));
        return this.createJsonErrorResponse(403, -32e3, error2);
      }
    }
    if (this._allowedOrigins && this._allowedOrigins.length > 0) {
      const originHeader = req.headers.get("origin");
      if (originHeader && !this._allowedOrigins.includes(originHeader)) {
        const error2 = `Invalid Origin header: ${originHeader}`;
        this.onerror?.(new Error(error2));
        return this.createJsonErrorResponse(403, -32e3, error2);
      }
    }
    return void 0;
  }
  /**
   * Handles an incoming HTTP request, whether GET, POST, or DELETE
   * Returns a Response object (Web Standard)
   */
  async handleRequest(req, options) {
    if (!this.sessionIdGenerator && this._hasHandledRequest) {
      throw new Error("Stateless transport cannot be reused across requests. Create a new transport per request.");
    }
    this._hasHandledRequest = true;
    const validationError = this.validateRequestHeaders(req);
    if (validationError) {
      return validationError;
    }
    switch (req.method) {
      case "POST":
        return this.handlePostRequest(req, options);
      case "GET":
        return this.handleGetRequest(req);
      case "DELETE":
        return this.handleDeleteRequest(req);
      default:
        return this.handleUnsupportedRequest();
    }
  }
  /**
   * Writes a priming event to establish resumption capability.
   * Only sends if eventStore is configured (opt-in for resumability) and
   * the client's protocol version supports empty SSE data (>= 2025-11-25).
   */
  async writePrimingEvent(controller, encoder, streamId, protocolVersion) {
    if (!this._eventStore) {
      return;
    }
    if (protocolVersion < "2025-11-25") {
      return;
    }
    const primingEventId = await this._eventStore.storeEvent(streamId, {});
    let primingEvent = `id: ${primingEventId}
data: 

`;
    if (this._retryInterval !== void 0) {
      primingEvent = `id: ${primingEventId}
retry: ${this._retryInterval}
data: 

`;
    }
    controller.enqueue(encoder.encode(primingEvent));
  }
  /**
   * Handles GET requests for SSE stream
   */
  async handleGetRequest(req) {
    const acceptHeader = req.headers.get("accept");
    if (!acceptHeader?.includes("text/event-stream")) {
      this.onerror?.(new Error("Not Acceptable: Client must accept text/event-stream"));
      return this.createJsonErrorResponse(406, -32e3, "Not Acceptable: Client must accept text/event-stream");
    }
    const sessionError = this.validateSession(req);
    if (sessionError) {
      return sessionError;
    }
    const protocolError = this.validateProtocolVersion(req);
    if (protocolError) {
      return protocolError;
    }
    if (this._eventStore) {
      const lastEventId = req.headers.get("last-event-id");
      if (lastEventId) {
        return this.replayEvents(lastEventId);
      }
    }
    if (this._streamMapping.get(this._standaloneSseStreamId) !== void 0) {
      this.onerror?.(new Error("Conflict: Only one SSE stream is allowed per session"));
      return this.createJsonErrorResponse(409, -32e3, "Conflict: Only one SSE stream is allowed per session");
    }
    const encoder = new TextEncoder();
    let streamController;
    const readable = new ReadableStream({
      start: /* @__PURE__ */ __name((controller) => {
        streamController = controller;
      }, "start"),
      cancel: /* @__PURE__ */ __name(() => {
        this._streamMapping.delete(this._standaloneSseStreamId);
      }, "cancel")
    });
    const headers = {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    };
    if (this.sessionId !== void 0) {
      headers["mcp-session-id"] = this.sessionId;
    }
    this._streamMapping.set(this._standaloneSseStreamId, {
      controller: streamController,
      encoder,
      cleanup: /* @__PURE__ */ __name(() => {
        this._streamMapping.delete(this._standaloneSseStreamId);
        try {
          streamController.close();
        } catch {
        }
      }, "cleanup")
    });
    return new Response(readable, { headers });
  }
  /**
   * Replays events that would have been sent after the specified event ID
   * Only used when resumability is enabled
   */
  async replayEvents(lastEventId) {
    if (!this._eventStore) {
      this.onerror?.(new Error("Event store not configured"));
      return this.createJsonErrorResponse(400, -32e3, "Event store not configured");
    }
    try {
      let streamId;
      if (this._eventStore.getStreamIdForEventId) {
        streamId = await this._eventStore.getStreamIdForEventId(lastEventId);
        if (!streamId) {
          this.onerror?.(new Error("Invalid event ID format"));
          return this.createJsonErrorResponse(400, -32e3, "Invalid event ID format");
        }
        if (this._streamMapping.get(streamId) !== void 0) {
          this.onerror?.(new Error("Conflict: Stream already has an active connection"));
          return this.createJsonErrorResponse(409, -32e3, "Conflict: Stream already has an active connection");
        }
      }
      const headers = {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive"
      };
      if (this.sessionId !== void 0) {
        headers["mcp-session-id"] = this.sessionId;
      }
      const encoder = new TextEncoder();
      let streamController;
      const readable = new ReadableStream({
        start: /* @__PURE__ */ __name((controller) => {
          streamController = controller;
        }, "start"),
        cancel: /* @__PURE__ */ __name(() => {
        }, "cancel")
      });
      const replayedStreamId = await this._eventStore.replayEventsAfter(lastEventId, {
        send: /* @__PURE__ */ __name(async (eventId, message) => {
          const success = this.writeSSEEvent(streamController, encoder, message, eventId);
          if (!success) {
            this.onerror?.(new Error("Failed replay events"));
            try {
              streamController.close();
            } catch {
            }
          }
        }, "send")
      });
      this._streamMapping.set(replayedStreamId, {
        controller: streamController,
        encoder,
        cleanup: /* @__PURE__ */ __name(() => {
          this._streamMapping.delete(replayedStreamId);
          try {
            streamController.close();
          } catch {
          }
        }, "cleanup")
      });
      return new Response(readable, { headers });
    } catch (error2) {
      this.onerror?.(error2);
      return this.createJsonErrorResponse(500, -32e3, "Error replaying events");
    }
  }
  /**
   * Writes an event to an SSE stream via controller with proper formatting
   */
  writeSSEEvent(controller, encoder, message, eventId) {
    try {
      let eventData = `event: message
`;
      if (eventId) {
        eventData += `id: ${eventId}
`;
      }
      eventData += `data: ${JSON.stringify(message)}

`;
      controller.enqueue(encoder.encode(eventData));
      return true;
    } catch (error2) {
      this.onerror?.(error2);
      return false;
    }
  }
  /**
   * Handles unsupported requests (PUT, PATCH, etc.)
   */
  handleUnsupportedRequest() {
    this.onerror?.(new Error("Method not allowed."));
    return new Response(JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32e3,
        message: "Method not allowed."
      },
      id: null
    }), {
      status: 405,
      headers: {
        Allow: "GET, POST, DELETE",
        "Content-Type": "application/json"
      }
    });
  }
  /**
   * Handles POST requests containing JSON-RPC messages
   */
  async handlePostRequest(req, options) {
    try {
      const acceptHeader = req.headers.get("accept");
      if (!acceptHeader?.includes("application/json") || !acceptHeader.includes("text/event-stream")) {
        this.onerror?.(new Error("Not Acceptable: Client must accept both application/json and text/event-stream"));
        return this.createJsonErrorResponse(406, -32e3, "Not Acceptable: Client must accept both application/json and text/event-stream");
      }
      const ct = req.headers.get("content-type");
      if (!ct || !ct.includes("application/json")) {
        this.onerror?.(new Error("Unsupported Media Type: Content-Type must be application/json"));
        return this.createJsonErrorResponse(415, -32e3, "Unsupported Media Type: Content-Type must be application/json");
      }
      const requestInfo = {
        headers: Object.fromEntries(req.headers.entries()),
        url: new URL(req.url)
      };
      let rawMessage;
      if (options?.parsedBody !== void 0) {
        rawMessage = options.parsedBody;
      } else {
        try {
          rawMessage = await req.json();
        } catch {
          this.onerror?.(new Error("Parse error: Invalid JSON"));
          return this.createJsonErrorResponse(400, -32700, "Parse error: Invalid JSON");
        }
      }
      let messages;
      try {
        if (Array.isArray(rawMessage)) {
          messages = rawMessage.map((msg) => JSONRPCMessageSchema.parse(msg));
        } else {
          messages = [JSONRPCMessageSchema.parse(rawMessage)];
        }
      } catch {
        this.onerror?.(new Error("Parse error: Invalid JSON-RPC message"));
        return this.createJsonErrorResponse(400, -32700, "Parse error: Invalid JSON-RPC message");
      }
      const isInitializationRequest = messages.some(isInitializeRequest);
      if (isInitializationRequest) {
        if (this._initialized && this.sessionId !== void 0) {
          this.onerror?.(new Error("Invalid Request: Server already initialized"));
          return this.createJsonErrorResponse(400, -32600, "Invalid Request: Server already initialized");
        }
        if (messages.length > 1) {
          this.onerror?.(new Error("Invalid Request: Only one initialization request is allowed"));
          return this.createJsonErrorResponse(400, -32600, "Invalid Request: Only one initialization request is allowed");
        }
        this.sessionId = this.sessionIdGenerator?.();
        this._initialized = true;
        if (this.sessionId && this._onsessioninitialized) {
          await Promise.resolve(this._onsessioninitialized(this.sessionId));
        }
      }
      if (!isInitializationRequest) {
        const sessionError = this.validateSession(req);
        if (sessionError) {
          return sessionError;
        }
        const protocolError = this.validateProtocolVersion(req);
        if (protocolError) {
          return protocolError;
        }
      }
      const hasRequests = messages.some(isJSONRPCRequest);
      if (!hasRequests) {
        for (const message of messages) {
          this.onmessage?.(message, { authInfo: options?.authInfo, requestInfo });
        }
        return new Response(null, { status: 202 });
      }
      const streamId = crypto.randomUUID();
      const initRequest = messages.find((m) => isInitializeRequest(m));
      const clientProtocolVersion = initRequest ? initRequest.params.protocolVersion : req.headers.get("mcp-protocol-version") ?? DEFAULT_NEGOTIATED_PROTOCOL_VERSION;
      if (this._enableJsonResponse) {
        return new Promise((resolve) => {
          this._streamMapping.set(streamId, {
            resolveJson: resolve,
            cleanup: /* @__PURE__ */ __name(() => {
              this._streamMapping.delete(streamId);
            }, "cleanup")
          });
          for (const message of messages) {
            if (isJSONRPCRequest(message)) {
              this._requestToStreamMapping.set(message.id, streamId);
            }
          }
          for (const message of messages) {
            this.onmessage?.(message, { authInfo: options?.authInfo, requestInfo });
          }
        });
      }
      const encoder = new TextEncoder();
      let streamController;
      const readable = new ReadableStream({
        start: /* @__PURE__ */ __name((controller) => {
          streamController = controller;
        }, "start"),
        cancel: /* @__PURE__ */ __name(() => {
          this._streamMapping.delete(streamId);
        }, "cancel")
      });
      const headers = {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
      };
      if (this.sessionId !== void 0) {
        headers["mcp-session-id"] = this.sessionId;
      }
      for (const message of messages) {
        if (isJSONRPCRequest(message)) {
          this._streamMapping.set(streamId, {
            controller: streamController,
            encoder,
            cleanup: /* @__PURE__ */ __name(() => {
              this._streamMapping.delete(streamId);
              try {
                streamController.close();
              } catch {
              }
            }, "cleanup")
          });
          this._requestToStreamMapping.set(message.id, streamId);
        }
      }
      await this.writePrimingEvent(streamController, encoder, streamId, clientProtocolVersion);
      for (const message of messages) {
        let closeSSEStream;
        let closeStandaloneSSEStream;
        if (isJSONRPCRequest(message) && this._eventStore && clientProtocolVersion >= "2025-11-25") {
          closeSSEStream = /* @__PURE__ */ __name(() => {
            this.closeSSEStream(message.id);
          }, "closeSSEStream");
          closeStandaloneSSEStream = /* @__PURE__ */ __name(() => {
            this.closeStandaloneSSEStream();
          }, "closeStandaloneSSEStream");
        }
        this.onmessage?.(message, { authInfo: options?.authInfo, requestInfo, closeSSEStream, closeStandaloneSSEStream });
      }
      return new Response(readable, { status: 200, headers });
    } catch (error2) {
      this.onerror?.(error2);
      return this.createJsonErrorResponse(400, -32700, "Parse error", { data: String(error2) });
    }
  }
  /**
   * Handles DELETE requests to terminate sessions
   */
  async handleDeleteRequest(req) {
    const sessionError = this.validateSession(req);
    if (sessionError) {
      return sessionError;
    }
    const protocolError = this.validateProtocolVersion(req);
    if (protocolError) {
      return protocolError;
    }
    await Promise.resolve(this._onsessionclosed?.(this.sessionId));
    await this.close();
    return new Response(null, { status: 200 });
  }
  /**
   * Validates session ID for non-initialization requests.
   * Returns Response error if invalid, undefined otherwise
   */
  validateSession(req) {
    if (this.sessionIdGenerator === void 0) {
      return void 0;
    }
    if (!this._initialized) {
      this.onerror?.(new Error("Bad Request: Server not initialized"));
      return this.createJsonErrorResponse(400, -32e3, "Bad Request: Server not initialized");
    }
    const sessionId = req.headers.get("mcp-session-id");
    if (!sessionId) {
      this.onerror?.(new Error("Bad Request: Mcp-Session-Id header is required"));
      return this.createJsonErrorResponse(400, -32e3, "Bad Request: Mcp-Session-Id header is required");
    }
    if (sessionId !== this.sessionId) {
      this.onerror?.(new Error("Session not found"));
      return this.createJsonErrorResponse(404, -32001, "Session not found");
    }
    return void 0;
  }
  /**
   * Validates the MCP-Protocol-Version header on incoming requests.
   *
   * For initialization: Version negotiation handles unknown versions gracefully
   * (server responds with its supported version).
   *
   * For subsequent requests with MCP-Protocol-Version header:
   * - Accept if in supported list
   * - 400 if unsupported
   *
   * For HTTP requests without the MCP-Protocol-Version header:
   * - Accept and default to the version negotiated at initialization
   */
  validateProtocolVersion(req) {
    const protocolVersion = req.headers.get("mcp-protocol-version");
    if (protocolVersion !== null && !SUPPORTED_PROTOCOL_VERSIONS.includes(protocolVersion)) {
      this.onerror?.(new Error(`Bad Request: Unsupported protocol version: ${protocolVersion} (supported versions: ${SUPPORTED_PROTOCOL_VERSIONS.join(", ")})`));
      return this.createJsonErrorResponse(400, -32e3, `Bad Request: Unsupported protocol version: ${protocolVersion} (supported versions: ${SUPPORTED_PROTOCOL_VERSIONS.join(", ")})`);
    }
    return void 0;
  }
  async close() {
    this._streamMapping.forEach(({ cleanup }) => {
      cleanup();
    });
    this._streamMapping.clear();
    this._requestResponseMap.clear();
    this.onclose?.();
  }
  /**
   * Close an SSE stream for a specific request, triggering client reconnection.
   * Use this to implement polling behavior during long-running operations -
   * client will reconnect after the retry interval specified in the priming event.
   */
  closeSSEStream(requestId) {
    const streamId = this._requestToStreamMapping.get(requestId);
    if (!streamId)
      return;
    const stream = this._streamMapping.get(streamId);
    if (stream) {
      stream.cleanup();
    }
  }
  /**
   * Close the standalone GET SSE stream, triggering client reconnection.
   * Use this to implement polling behavior for server-initiated notifications.
   */
  closeStandaloneSSEStream() {
    const stream = this._streamMapping.get(this._standaloneSseStreamId);
    if (stream) {
      stream.cleanup();
    }
  }
  async send(message, options) {
    let requestId = options?.relatedRequestId;
    if (isJSONRPCResultResponse(message) || isJSONRPCErrorResponse(message)) {
      requestId = message.id;
    }
    if (requestId === void 0) {
      if (isJSONRPCResultResponse(message) || isJSONRPCErrorResponse(message)) {
        throw new Error("Cannot send a response on a standalone SSE stream unless resuming a previous client request");
      }
      let eventId;
      if (this._eventStore) {
        eventId = await this._eventStore.storeEvent(this._standaloneSseStreamId, message);
      }
      const standaloneSse = this._streamMapping.get(this._standaloneSseStreamId);
      if (standaloneSse === void 0) {
        return;
      }
      if (standaloneSse.controller && standaloneSse.encoder) {
        this.writeSSEEvent(standaloneSse.controller, standaloneSse.encoder, message, eventId);
      }
      return;
    }
    const streamId = this._requestToStreamMapping.get(requestId);
    if (!streamId) {
      throw new Error(`No connection established for request ID: ${String(requestId)}`);
    }
    const stream = this._streamMapping.get(streamId);
    if (!this._enableJsonResponse && stream?.controller && stream?.encoder) {
      let eventId;
      if (this._eventStore) {
        eventId = await this._eventStore.storeEvent(streamId, message);
      }
      this.writeSSEEvent(stream.controller, stream.encoder, message, eventId);
    }
    if (isJSONRPCResultResponse(message) || isJSONRPCErrorResponse(message)) {
      this._requestResponseMap.set(requestId, message);
      const relatedIds = Array.from(this._requestToStreamMapping.entries()).filter(([_, sid]) => sid === streamId).map(([id]) => id);
      const allResponsesReady = relatedIds.every((id) => this._requestResponseMap.has(id));
      if (allResponsesReady) {
        if (!stream) {
          throw new Error(`No connection established for request ID: ${String(requestId)}`);
        }
        if (this._enableJsonResponse && stream.resolveJson) {
          const headers = {
            "Content-Type": "application/json"
          };
          if (this.sessionId !== void 0) {
            headers["mcp-session-id"] = this.sessionId;
          }
          const responses = relatedIds.map((id) => this._requestResponseMap.get(id));
          if (responses.length === 1) {
            stream.resolveJson(new Response(JSON.stringify(responses[0]), { status: 200, headers }));
          } else {
            stream.resolveJson(new Response(JSON.stringify(responses), { status: 200, headers }));
          }
        } else {
          stream.cleanup();
        }
        for (const id of relatedIds) {
          this._requestResponseMap.delete(id);
          this._requestToStreamMapping.delete(id);
        }
      }
    }
  }
};

// ../natal-engine/src/index.js
init_modules_watch_stub();

// ../natal-engine/src/calculators/astrology.js
init_modules_watch_stub();

// ../natal-engine/src/calculators/utils.js
init_modules_watch_stub();
function parseDateComponents(birthDate) {
  if (typeof birthDate === "string") {
    const parts = birthDate.split("-");
    return {
      year: parseInt(parts[0], 10),
      month: parseInt(parts[1], 10),
      day: parseInt(parts[2], 10)
    };
  }
  const date3 = new Date(birthDate);
  return {
    year: date3.getUTCFullYear(),
    month: date3.getUTCMonth() + 1,
    day: date3.getUTCDate()
  };
}
__name(parseDateComponents, "parseDateComponents");

// ../natal-engine/src/calculators/astronomy.js
init_modules_watch_stub();

// ../natal-engine/node_modules/astronomy-engine/esm/astronomy.js
init_modules_watch_stub();
var C_AUDAY = 173.1446326846693;
var KM_PER_AU = 14959787069098932e-8;
var DEG2RAD = 0.017453292519943295;
var RAD2DEG = 57.29577951308232;
var DAYS_PER_TROPICAL_YEAR = 365.24217;
var J2000 = /* @__PURE__ */ new Date("2000-01-01T12:00:00Z");
var PI2 = 2 * Math.PI;
var ARC = 3600 * (180 / Math.PI);
var ASEC2RAD = 484813681109536e-20;
var ASEC180 = 180 * 60 * 60;
var ASEC360 = 2 * ASEC180;
var AU_PER_PARSEC = ASEC180 / Math.PI;
var SUN_MAG_1AU = -0.17 - 5 * Math.log10(AU_PER_PARSEC);
var SECONDS_PER_DAY = 24 * 3600;
var MILLIS_PER_DAY = SECONDS_PER_DAY * 1e3;
var SUN_RADIUS_KM = 695700;
var SUN_RADIUS_AU = SUN_RADIUS_KM / KM_PER_AU;
var EARTH_FLATTENING = 0.996647180302104;
var EARTH_FLATTENING_SQUARED = EARTH_FLATTENING * EARTH_FLATTENING;
var EARTH_EQUATORIAL_RADIUS_KM = 6378.1366;
var EARTH_EQUATORIAL_RADIUS_AU = EARTH_EQUATORIAL_RADIUS_KM / KM_PER_AU;
var EARTH_POLAR_RADIUS_KM = EARTH_EQUATORIAL_RADIUS_KM * EARTH_FLATTENING;
var EARTH_MEAN_RADIUS_KM = 6371;
var EARTH_ATMOSPHERE_KM = 88;
var EARTH_ECLIPSE_RADIUS_KM = EARTH_MEAN_RADIUS_KM + EARTH_ATMOSPHERE_KM;
var MOON_EQUATORIAL_RADIUS_KM = 1738.1;
var MOON_EQUATORIAL_RADIUS_AU = MOON_EQUATORIAL_RADIUS_KM / KM_PER_AU;
var MOON_POLAR_RADIUS_KM = 1736;
var MOON_POLAR_RADIUS_AU = MOON_POLAR_RADIUS_KM / KM_PER_AU;
var REFRACTION_NEAR_HORIZON = 34 / 60;
var EARTH_MOON_MASS_RATIO = 81.30056;
var SUN_GM = 2959122082855911e-19;
var EARTH_GM = 8887692390113509e-25;
var JUPITER_GM = 2825345909524226e-22;
var SATURN_GM = 8459715185680659e-23;
var URANUS_GM = 1292024916781969e-23;
var NEPTUNE_GM = 1524358900784276e-23;
var MOON_GM = EARTH_GM / EARTH_MOON_MASS_RATIO;
function VerifyBoolean(b) {
  if (b !== true && b !== false) {
    console.trace();
    throw `Value is not boolean: ${b}`;
  }
  return b;
}
__name(VerifyBoolean, "VerifyBoolean");
function VerifyNumber(x) {
  if (!Number.isFinite(x)) {
    console.trace();
    throw `Value is not a finite number: ${x}`;
  }
  return x;
}
__name(VerifyNumber, "VerifyNumber");
function Frac(x) {
  return x - Math.floor(x);
}
__name(Frac, "Frac");
var Body;
(function(Body2) {
  Body2["Sun"] = "Sun";
  Body2["Moon"] = "Moon";
  Body2["Mercury"] = "Mercury";
  Body2["Venus"] = "Venus";
  Body2["Earth"] = "Earth";
  Body2["Mars"] = "Mars";
  Body2["Jupiter"] = "Jupiter";
  Body2["Saturn"] = "Saturn";
  Body2["Uranus"] = "Uranus";
  Body2["Neptune"] = "Neptune";
  Body2["Pluto"] = "Pluto";
  Body2["SSB"] = "SSB";
  Body2["EMB"] = "EMB";
  Body2["Star1"] = "Star1";
  Body2["Star2"] = "Star2";
  Body2["Star3"] = "Star3";
  Body2["Star4"] = "Star4";
  Body2["Star5"] = "Star5";
  Body2["Star6"] = "Star6";
  Body2["Star7"] = "Star7";
  Body2["Star8"] = "Star8";
})(Body || (Body = {}));
var StarList = [
  Body.Star1,
  Body.Star2,
  Body.Star3,
  Body.Star4,
  Body.Star5,
  Body.Star6,
  Body.Star7,
  Body.Star8
];
var StarTable = [
  { ra: 0, dec: 0, dist: 0 },
  { ra: 0, dec: 0, dist: 0 },
  { ra: 0, dec: 0, dist: 0 },
  { ra: 0, dec: 0, dist: 0 },
  { ra: 0, dec: 0, dist: 0 },
  { ra: 0, dec: 0, dist: 0 },
  { ra: 0, dec: 0, dist: 0 },
  { ra: 0, dec: 0, dist: 0 }
];
function GetStar(body) {
  const index = StarList.indexOf(body);
  return index >= 0 ? StarTable[index] : null;
}
__name(GetStar, "GetStar");
function UserDefinedStar(body) {
  const star = GetStar(body);
  return star && star.dist > 0 ? star : null;
}
__name(UserDefinedStar, "UserDefinedStar");
var PrecessDirection;
(function(PrecessDirection2) {
  PrecessDirection2[PrecessDirection2["From2000"] = 0] = "From2000";
  PrecessDirection2[PrecessDirection2["Into2000"] = 1] = "Into2000";
})(PrecessDirection || (PrecessDirection = {}));
var vsop = {
  Mercury: [
    [
      [
        [4.40250710144, 0, 0],
        [0.40989414977, 1.48302034195, 26087.9031415742],
        [0.050462942, 4.47785489551, 52175.8062831484],
        [0.00855346844, 1.16520322459, 78263.70942472259],
        [0.00165590362, 4.11969163423, 104351.61256629678],
        [34561897e-11, 0.77930768443, 130439.51570787099],
        [7583476e-11, 3.71348404924, 156527.41884944518]
      ],
      [
        [26087.90313685529, 0, 0],
        [0.01131199811, 6.21874197797, 26087.9031415742],
        [0.00292242298, 3.04449355541, 52175.8062831484],
        [75775081e-11, 6.08568821653, 78263.70942472259],
        [19676525e-11, 2.80965111777, 104351.61256629678]
      ]
    ],
    [
      [
        [0.11737528961, 1.98357498767, 26087.9031415742],
        [0.02388076996, 5.03738959686, 52175.8062831484],
        [0.01222839532, 3.14159265359, 0],
        [0.0054325181, 1.79644363964, 78263.70942472259],
        [0.0012977877, 4.83232503958, 104351.61256629678],
        [31866927e-11, 1.58088495658, 130439.51570787099],
        [7963301e-11, 4.60972126127, 156527.41884944518]
      ],
      [
        [0.00274646065, 3.95008450011, 26087.9031415742],
        [99737713e-11, 3.14159265359, 0]
      ]
    ],
    [
      [
        [0.39528271651, 0, 0],
        [0.07834131818, 6.19233722598, 26087.9031415742],
        [0.00795525558, 2.95989690104, 52175.8062831484],
        [0.00121281764, 6.01064153797, 78263.70942472259],
        [21921969e-11, 2.77820093972, 104351.61256629678],
        [4354065e-11, 5.82894543774, 130439.51570787099]
      ],
      [
        [0.0021734774, 4.65617158665, 26087.9031415742],
        [44141826e-11, 1.42385544001, 52175.8062831484]
      ]
    ]
  ],
  Venus: [
    [
      [
        [3.17614666774, 0, 0],
        [0.01353968419, 5.59313319619, 10213.285546211],
        [89891645e-11, 5.30650047764, 20426.571092422],
        [5477194e-11, 4.41630661466, 7860.4193924392],
        [3455741e-11, 2.6996444782, 11790.6290886588],
        [2372061e-11, 2.99377542079, 3930.2096962196],
        [1317168e-11, 5.18668228402, 26.2983197998],
        [1664146e-11, 4.25018630147, 1577.3435424478],
        [1438387e-11, 4.15745084182, 9683.5945811164],
        [1200521e-11, 6.15357116043, 30639.856638633]
      ],
      [
        [10213.28554621638, 0, 0],
        [95617813e-11, 2.4640651111, 10213.285546211],
        [7787201e-11, 0.6247848222, 20426.571092422]
      ]
    ],
    [
      [
        [0.05923638472, 0.26702775812, 10213.285546211],
        [40107978e-11, 1.14737178112, 20426.571092422],
        [32814918e-11, 3.14159265359, 0]
      ],
      [
        [0.00287821243, 1.88964962838, 10213.285546211]
      ]
    ],
    [
      [
        [0.72334820891, 0, 0],
        [0.00489824182, 4.02151831717, 10213.285546211],
        [1658058e-11, 4.90206728031, 20426.571092422],
        [1378043e-11, 1.12846591367, 11790.6290886588],
        [1632096e-11, 2.84548795207, 7860.4193924392],
        [498395e-11, 2.58682193892, 9683.5945811164],
        [221985e-11, 2.01346696541, 19367.1891622328],
        [237454e-11, 2.55136053886, 15720.8387848784]
      ],
      [
        [34551041e-11, 0.89198706276, 10213.285546211]
      ]
    ]
  ],
  Earth: [
    [
      [
        [1.75347045673, 0, 0],
        [0.03341656453, 4.66925680415, 6283.0758499914],
        [34894275e-11, 4.62610242189, 12566.1516999828],
        [3417572e-11, 2.82886579754, 3.523118349],
        [3497056e-11, 2.74411783405, 5753.3848848968],
        [3135899e-11, 3.62767041756, 77713.7714681205],
        [2676218e-11, 4.41808345438, 7860.4193924392],
        [2342691e-11, 6.13516214446, 3930.2096962196],
        [1273165e-11, 2.03709657878, 529.6909650946],
        [1324294e-11, 0.74246341673, 11506.7697697936],
        [901854e-11, 2.04505446477, 26.2983197998],
        [1199167e-11, 1.10962946234, 1577.3435424478],
        [857223e-11, 3.50849152283, 398.1490034082],
        [779786e-11, 1.17882681962, 5223.6939198022],
        [99025e-10, 5.23268072088, 5884.9268465832],
        [753141e-11, 2.53339052847, 5507.5532386674],
        [505267e-11, 4.58292599973, 18849.2275499742],
        [492392e-11, 4.20505711826, 775.522611324],
        [356672e-11, 2.91954114478, 0.0673103028],
        [284125e-11, 1.89869240932, 796.2980068164],
        [242879e-11, 0.34481445893, 5486.777843175],
        [317087e-11, 5.84901948512, 11790.6290886588],
        [271112e-11, 0.31486255375, 10977.078804699],
        [206217e-11, 4.80646631478, 2544.3144198834],
        [205478e-11, 1.86953770281, 5573.1428014331],
        [202318e-11, 2.45767790232, 6069.7767545534],
        [126225e-11, 1.08295459501, 20.7753954924],
        [155516e-11, 0.83306084617, 213.299095438]
      ],
      [
        [6283.0758499914, 0, 0],
        [0.00206058863, 2.67823455808, 6283.0758499914],
        [4303419e-11, 2.63512233481, 12566.1516999828]
      ],
      [
        [8721859e-11, 1.07253635559, 6283.0758499914]
      ]
    ],
    [
      [],
      [
        [0.00227777722, 3.4137662053, 6283.0758499914],
        [3805678e-11, 3.37063423795, 12566.1516999828]
      ]
    ],
    [
      [
        [1.00013988784, 0, 0],
        [0.01670699632, 3.09846350258, 6283.0758499914],
        [13956024e-11, 3.05524609456, 12566.1516999828],
        [308372e-10, 5.19846674381, 77713.7714681205],
        [1628463e-11, 1.17387558054, 5753.3848848968],
        [1575572e-11, 2.84685214877, 7860.4193924392],
        [924799e-11, 5.45292236722, 11506.7697697936],
        [542439e-11, 4.56409151453, 3930.2096962196],
        [47211e-10, 3.66100022149, 5884.9268465832],
        [85831e-11, 1.27079125277, 161000.6857376741],
        [57056e-11, 2.01374292245, 83996.84731811189],
        [55736e-11, 5.2415979917, 71430.69561812909],
        [174844e-11, 3.01193636733, 18849.2275499742],
        [243181e-11, 4.2734953079, 11790.6290886588]
      ],
      [
        [0.00103018607, 1.10748968172, 6283.0758499914],
        [1721238e-11, 1.06442300386, 12566.1516999828]
      ],
      [
        [4359385e-11, 5.78455133808, 6283.0758499914]
      ]
    ]
  ],
  Mars: [
    [
      [
        [6.20347711581, 0, 0],
        [0.18656368093, 5.0503710027, 3340.6124266998],
        [0.01108216816, 5.40099836344, 6681.2248533996],
        [91798406e-11, 5.75478744667, 10021.8372800994],
        [27744987e-11, 5.97049513147, 3.523118349],
        [10610235e-11, 2.93958560338, 2281.2304965106],
        [12315897e-11, 0.84956094002, 2810.9214616052],
        [8926784e-11, 4.15697846427, 0.0172536522],
        [8715691e-11, 6.11005153139, 13362.4497067992],
        [6797556e-11, 0.36462229657, 398.1490034082],
        [7774872e-11, 3.33968761376, 5621.8429232104],
        [3575078e-11, 1.6618650571, 2544.3144198834],
        [4161108e-11, 0.22814971327, 2942.4634232916],
        [3075252e-11, 0.85696614132, 191.4482661116],
        [2628117e-11, 0.64806124465, 3337.0893083508],
        [2937546e-11, 6.07893711402, 0.0673103028],
        [2389414e-11, 5.03896442664, 796.2980068164],
        [2579844e-11, 0.02996736156, 3344.1355450488],
        [1528141e-11, 1.14979301996, 6151.533888305],
        [1798806e-11, 0.65634057445, 529.6909650946],
        [1264357e-11, 3.62275122593, 5092.1519581158],
        [1286228e-11, 3.06796065034, 2146.1654164752],
        [1546404e-11, 2.91579701718, 1751.539531416],
        [1024902e-11, 3.69334099279, 8962.4553499102],
        [891566e-11, 0.18293837498, 16703.062133499],
        [858759e-11, 2.4009381194, 2914.0142358238],
        [832715e-11, 2.46418619474, 3340.5951730476],
        [83272e-10, 4.49495782139, 3340.629680352],
        [712902e-11, 3.66335473479, 1059.3819301892],
        [748723e-11, 3.82248614017, 155.4203994342],
        [723861e-11, 0.67497311481, 3738.761430108],
        [635548e-11, 2.92182225127, 8432.7643848156],
        [655162e-11, 0.48864064125, 3127.3133312618],
        [550474e-11, 3.81001042328, 0.9803210682],
        [55275e-10, 4.47479317037, 1748.016413067],
        [425966e-11, 0.55364317304, 6283.0758499914],
        [415131e-11, 0.49662285038, 213.299095438],
        [472167e-11, 3.62547124025, 1194.4470102246],
        [306551e-11, 0.38052848348, 6684.7479717486],
        [312141e-11, 0.99853944405, 6677.7017350506],
        [293198e-11, 4.22131299634, 20.7753954924],
        [302375e-11, 4.48618007156, 3532.0606928114],
        [274027e-11, 0.54222167059, 3340.545116397],
        [281079e-11, 5.88163521788, 1349.8674096588],
        [231183e-11, 1.28242156993, 3870.3033917944],
        [283602e-11, 5.7688543494, 3149.1641605882],
        [236117e-11, 5.75503217933, 3333.498879699],
        [274033e-11, 0.13372524985, 3340.6797370026],
        [299395e-11, 2.78323740866, 6254.6266625236]
      ],
      [
        [3340.61242700512, 0, 0],
        [0.01457554523, 3.60433733236, 3340.6124266998],
        [0.00168414711, 3.92318567804, 6681.2248533996],
        [20622975e-11, 4.26108844583, 10021.8372800994],
        [3452392e-11, 4.7321039319, 3.523118349],
        [2586332e-11, 4.60670058555, 13362.4497067992],
        [841535e-11, 4.45864030426, 2281.2304965106]
      ],
      [
        [58152577e-11, 2.04961712429, 3340.6124266998],
        [13459579e-11, 2.45738706163, 6681.2248533996]
      ]
    ],
    [
      [
        [0.03197134986, 3.76832042431, 3340.6124266998],
        [0.00298033234, 4.10616996305, 6681.2248533996],
        [0.00289104742, 0, 0],
        [31365539e-11, 4.4465105309, 10021.8372800994],
        [34841e-9, 4.7881254926, 13362.4497067992]
      ],
      [
        [0.00217310991, 6.04472194776, 3340.6124266998],
        [20976948e-11, 3.14159265359, 0],
        [12834709e-11, 1.60810667915, 6681.2248533996]
      ]
    ],
    [
      [
        [1.53033488271, 0, 0],
        [0.1418495316, 3.47971283528, 3340.6124266998],
        [0.00660776362, 3.81783443019, 6681.2248533996],
        [46179117e-11, 4.15595316782, 10021.8372800994],
        [8109733e-11, 5.55958416318, 2810.9214616052],
        [7485318e-11, 1.77239078402, 5621.8429232104],
        [5523191e-11, 1.3643630377, 2281.2304965106],
        [382516e-10, 4.49407183687, 13362.4497067992],
        [2306537e-11, 0.09081579001, 2544.3144198834],
        [1999396e-11, 5.36059617709, 3337.0893083508],
        [2484394e-11, 4.9254563992, 2942.4634232916],
        [1960195e-11, 4.74249437639, 3344.1355450488],
        [1167119e-11, 2.11260868341, 5092.1519581158],
        [1102816e-11, 5.00908403998, 398.1490034082],
        [899066e-11, 4.40791133207, 529.6909650946],
        [992252e-11, 5.83861961952, 6151.533888305],
        [807354e-11, 2.10217065501, 1059.3819301892],
        [797915e-11, 3.44839203899, 796.2980068164],
        [740975e-11, 1.49906336885, 2146.1654164752]
      ],
      [
        [0.01107433345, 2.03250524857, 3340.6124266998],
        [0.00103175887, 2.37071847807, 6681.2248533996],
        [128772e-9, 0, 0],
        [1081588e-10, 2.70888095665, 10021.8372800994]
      ],
      [
        [44242249e-11, 0.47930604954, 3340.6124266998],
        [8138042e-11, 0.86998389204, 6681.2248533996]
      ]
    ]
  ],
  Jupiter: [
    [
      [
        [0.59954691494, 0, 0],
        [0.09695898719, 5.06191793158, 529.6909650946],
        [0.00573610142, 1.44406205629, 7.1135470008],
        [0.00306389205, 5.41734730184, 1059.3819301892],
        [97178296e-11, 4.14264726552, 632.7837393132],
        [72903078e-11, 3.64042916389, 522.5774180938],
        [64263975e-11, 3.41145165351, 103.0927742186],
        [39806064e-11, 2.29376740788, 419.4846438752],
        [38857767e-11, 1.27231755835, 316.3918696566],
        [27964629e-11, 1.7845459182, 536.8045120954],
        [1358973e-10, 5.7748104079, 1589.0728952838],
        [8246349e-11, 3.5822792584, 206.1855484372],
        [8768704e-11, 3.63000308199, 949.1756089698],
        [7368042e-11, 5.0810119427, 735.8765135318],
        [626315e-10, 0.02497628807, 213.299095438],
        [6114062e-11, 4.51319998626, 1162.4747044078],
        [4905396e-11, 1.32084470588, 110.2063212194],
        [5305285e-11, 1.30671216791, 14.2270940016],
        [5305441e-11, 4.18625634012, 1052.2683831884],
        [4647248e-11, 4.69958103684, 3.9321532631],
        [3045023e-11, 4.31676431084, 426.598190876],
        [2609999e-11, 1.56667394063, 846.0828347512],
        [2028191e-11, 1.06376530715, 3.1813937377],
        [1764763e-11, 2.14148655117, 1066.49547719],
        [1722972e-11, 3.88036268267, 1265.5674786264],
        [1920945e-11, 0.97168196472, 639.897286314],
        [1633223e-11, 3.58201833555, 515.463871093],
        [1431999e-11, 4.29685556046, 625.6701923124],
        [973272e-11, 4.09764549134, 95.9792272178]
      ],
      [
        [529.69096508814, 0, 0],
        [0.00489503243, 4.2208293947, 529.6909650946],
        [0.00228917222, 6.02646855621, 7.1135470008],
        [30099479e-11, 4.54540782858, 1059.3819301892],
        [2072092e-10, 5.45943156902, 522.5774180938],
        [12103653e-11, 0.16994816098, 536.8045120954],
        [6067987e-11, 4.42422292017, 103.0927742186],
        [5433968e-11, 3.98480737746, 419.4846438752],
        [4237744e-11, 5.89008707199, 14.2270940016]
      ],
      [
        [47233601e-11, 4.32148536482, 7.1135470008],
        [30649436e-11, 2.929777887, 529.6909650946],
        [14837605e-11, 3.14159265359, 0]
      ]
    ],
    [
      [
        [0.02268615702, 3.55852606721, 529.6909650946],
        [0.00109971634, 3.90809347197, 1059.3819301892],
        [0.00110090358, 0, 0],
        [8101428e-11, 3.60509572885, 522.5774180938],
        [6043996e-11, 4.25883108339, 1589.0728952838],
        [6437782e-11, 0.30627119215, 536.8045120954]
      ],
      [
        [78203446e-11, 1.52377859742, 529.6909650946]
      ]
    ],
    [
      [
        [5.20887429326, 0, 0],
        [0.25209327119, 3.49108639871, 529.6909650946],
        [0.00610599976, 3.84115365948, 1059.3819301892],
        [0.00282029458, 2.57419881293, 632.7837393132],
        [0.00187647346, 2.07590383214, 522.5774180938],
        [86792905e-11, 0.71001145545, 419.4846438752],
        [72062974e-11, 0.21465724607, 536.8045120954],
        [65517248e-11, 5.9799588479, 316.3918696566],
        [29134542e-11, 1.67759379655, 103.0927742186],
        [30135335e-11, 2.16132003734, 949.1756089698],
        [23453271e-11, 3.54023522184, 735.8765135318],
        [22283743e-11, 4.19362594399, 1589.0728952838],
        [23947298e-11, 0.2745803748, 7.1135470008],
        [13032614e-11, 2.96042965363, 1162.4747044078],
        [970336e-10, 1.90669633585, 206.1855484372],
        [12749023e-11, 2.71550286592, 1052.2683831884],
        [7057931e-11, 2.18184839926, 1265.5674786264],
        [6137703e-11, 6.26418240033, 846.0828347512],
        [2616976e-11, 2.00994012876, 1581.959348283]
      ],
      [
        [0.0127180152, 2.64937512894, 529.6909650946],
        [61661816e-11, 3.00076460387, 1059.3819301892],
        [53443713e-11, 3.89717383175, 522.5774180938],
        [31185171e-11, 4.88276958012, 536.8045120954],
        [41390269e-11, 0, 0]
      ]
    ]
  ],
  Saturn: [
    [
      [
        [0.87401354025, 0, 0],
        [0.11107659762, 3.96205090159, 213.299095438],
        [0.01414150957, 4.58581516874, 7.1135470008],
        [0.00398379389, 0.52112032699, 206.1855484372],
        [0.00350769243, 3.30329907896, 426.598190876],
        [0.00206816305, 0.24658372002, 103.0927742186],
        [792713e-9, 3.84007056878, 220.4126424388],
        [23990355e-11, 4.66976924553, 110.2063212194],
        [16573588e-11, 0.43719228296, 419.4846438752],
        [14906995e-11, 5.76903183869, 316.3918696566],
        [1582029e-10, 0.93809155235, 632.7837393132],
        [14609559e-11, 1.56518472, 3.9321532631],
        [13160301e-11, 4.44891291899, 14.2270940016],
        [15053543e-11, 2.71669915667, 639.897286314],
        [13005299e-11, 5.98119023644, 11.0457002639],
        [10725067e-11, 3.12939523827, 202.2533951741],
        [5863206e-11, 0.23656938524, 529.6909650946],
        [5227757e-11, 4.20783365759, 3.1813937377],
        [6126317e-11, 1.76328667907, 277.0349937414],
        [5019687e-11, 3.17787728405, 433.7117378768],
        [459255e-10, 0.61977744975, 199.0720014364],
        [4005867e-11, 2.24479718502, 63.7358983034],
        [2953796e-11, 0.98280366998, 95.9792272178],
        [387367e-10, 3.22283226966, 138.5174968707],
        [2461186e-11, 2.03163875071, 735.8765135318],
        [3269484e-11, 0.77492638211, 949.1756089698],
        [1758145e-11, 3.2658010994, 522.5774180938],
        [1640172e-11, 5.5050445305, 846.0828347512],
        [1391327e-11, 4.02333150505, 323.5054166574],
        [1580648e-11, 4.37265307169, 309.2783226558],
        [1123498e-11, 2.83726798446, 415.5524906121],
        [1017275e-11, 3.71700135395, 227.5261894396],
        [848642e-11, 3.1915017083, 209.3669421749]
      ],
      [
        [213.2990952169, 0, 0],
        [0.01297370862, 1.82834923978, 213.299095438],
        [0.00564345393, 2.88499717272, 7.1135470008],
        [93734369e-11, 1.06311793502, 426.598190876],
        [0.00107674962, 2.27769131009, 206.1855484372],
        [40244455e-11, 2.04108104671, 220.4126424388],
        [19941774e-11, 1.2795439047, 103.0927742186],
        [10511678e-11, 2.7488034213, 14.2270940016],
        [6416106e-11, 0.38238295041, 639.897286314],
        [4848994e-11, 2.43037610229, 419.4846438752],
        [4056892e-11, 2.92133209468, 110.2063212194],
        [3768635e-11, 3.6496533078, 3.9321532631]
      ],
      [
        [0.0011644133, 1.17988132879, 7.1135470008],
        [91841837e-11, 0.0732519584, 213.299095438],
        [36661728e-11, 0, 0],
        [15274496e-11, 4.06493179167, 206.1855484372]
      ]
    ],
    [
      [
        [0.04330678039, 3.60284428399, 213.299095438],
        [0.00240348302, 2.85238489373, 426.598190876],
        [84745939e-11, 0, 0],
        [30863357e-11, 3.48441504555, 220.4126424388],
        [34116062e-11, 0.57297307557, 206.1855484372],
        [1473407e-10, 2.11846596715, 639.897286314],
        [9916667e-11, 5.79003188904, 419.4846438752],
        [6993564e-11, 4.7360468972, 7.1135470008],
        [4807588e-11, 5.43305312061, 316.3918696566]
      ],
      [
        [0.00198927992, 4.93901017903, 213.299095438],
        [36947916e-11, 3.14159265359, 0],
        [17966989e-11, 0.5197943111, 426.598190876]
      ]
    ],
    [
      [
        [9.55758135486, 0, 0],
        [0.52921382865, 2.39226219573, 213.299095438],
        [0.01873679867, 5.2354960466, 206.1855484372],
        [0.01464663929, 1.64763042902, 426.598190876],
        [0.00821891141, 5.93520042303, 316.3918696566],
        [0.00547506923, 5.0153261898, 103.0927742186],
        [0.0037168465, 2.27114821115, 220.4126424388],
        [0.00361778765, 3.13904301847, 7.1135470008],
        [0.00140617506, 5.70406606781, 632.7837393132],
        [0.00108974848, 3.29313390175, 110.2063212194],
        [69006962e-11, 5.94099540992, 419.4846438752],
        [61053367e-11, 0.94037691801, 639.897286314],
        [48913294e-11, 1.55733638681, 202.2533951741],
        [34143772e-11, 0.19519102597, 277.0349937414],
        [32401773e-11, 5.47084567016, 949.1756089698],
        [20936596e-11, 0.46349251129, 735.8765135318],
        [9796004e-11, 5.20477537945, 1265.5674786264],
        [11993338e-11, 5.98050967385, 846.0828347512],
        [208393e-9, 1.52102476129, 433.7117378768],
        [15298404e-11, 3.0594381494, 529.6909650946],
        [6465823e-11, 0.17732249942, 1052.2683831884],
        [11380257e-11, 1.7310542704, 522.5774180938],
        [3419618e-11, 4.94550542171, 1581.959348283]
      ],
      [
        [0.0618298134, 0.2584351148, 213.299095438],
        [0.00506577242, 0.71114625261, 206.1855484372],
        [0.00341394029, 5.79635741658, 426.598190876],
        [0.00188491195, 0.47215589652, 220.4126424388],
        [0.00186261486, 3.14159265359, 0],
        [0.00143891146, 1.40744822888, 7.1135470008]
      ],
      [
        [0.00436902572, 4.78671677509, 213.299095438]
      ]
    ]
  ],
  Uranus: [
    [
      [
        [5.48129294297, 0, 0],
        [0.09260408234, 0.89106421507, 74.7815985673],
        [0.01504247898, 3.6271926092, 1.4844727083],
        [0.00365981674, 1.89962179044, 73.297125859],
        [0.00272328168, 3.35823706307, 149.5631971346],
        [70328461e-11, 5.39254450063, 63.7358983034],
        [68892678e-11, 6.09292483287, 76.2660712756],
        [61998615e-11, 2.26952066061, 2.9689454166],
        [61950719e-11, 2.85098872691, 11.0457002639],
        [2646877e-10, 3.14152083966, 71.8126531507],
        [25710476e-11, 6.11379840493, 454.9093665273],
        [2107885e-10, 4.36059339067, 148.0787244263],
        [17818647e-11, 1.74436930289, 36.6485629295],
        [14613507e-11, 4.73732166022, 3.9321532631],
        [11162509e-11, 5.8268179635, 224.3447957019],
        [1099791e-10, 0.48865004018, 138.5174968707],
        [9527478e-11, 2.95516862826, 35.1640902212],
        [7545601e-11, 5.236265824, 109.9456887885],
        [4220241e-11, 3.23328220918, 70.8494453042],
        [40519e-9, 2.277550173, 151.0476698429],
        [3354596e-11, 1.0654900738, 4.4534181249],
        [2926718e-11, 4.62903718891, 9.5612275556],
        [349034e-10, 5.48306144511, 146.594251718],
        [3144069e-11, 4.75199570434, 77.7505439839],
        [2922333e-11, 5.35235361027, 85.8272988312],
        [2272788e-11, 4.36600400036, 70.3281804424],
        [2051219e-11, 1.51773566586, 0.1118745846],
        [2148602e-11, 0.60745949945, 38.1330356378],
        [1991643e-11, 4.92437588682, 277.0349937414],
        [1376226e-11, 2.04283539351, 65.2203710117],
        [1666902e-11, 3.62744066769, 380.12776796],
        [1284107e-11, 3.11347961505, 202.2533951741],
        [1150429e-11, 0.93343589092, 3.1813937377],
        [1533221e-11, 2.58594681212, 52.6901980395],
        [1281604e-11, 0.54271272721, 222.8603229936],
        [1372139e-11, 4.19641530878, 111.4301614968],
        [1221029e-11, 0.1990065003, 108.4612160802],
        [946181e-11, 1.19253165736, 127.4717966068],
        [1150989e-11, 4.17898916639, 33.6796175129]
      ],
      [
        [74.7815986091, 0, 0],
        [0.00154332863, 5.24158770553, 74.7815985673],
        [24456474e-11, 1.71260334156, 1.4844727083],
        [9258442e-11, 0.4282973235, 11.0457002639],
        [8265977e-11, 1.50218091379, 63.7358983034],
        [915016e-10, 1.41213765216, 149.5631971346]
      ]
    ],
    [
      [
        [0.01346277648, 2.61877810547, 74.7815985673],
        [623414e-9, 5.08111189648, 149.5631971346],
        [61601196e-11, 3.14159265359, 0],
        [9963722e-11, 1.61603805646, 76.2660712756],
        [992616e-10, 0.57630380333, 73.297125859]
      ],
      [
        [34101978e-11, 0.01321929936, 74.7815985673]
      ]
    ],
    [
      [
        [19.21264847206, 0, 0],
        [0.88784984413, 5.60377527014, 74.7815985673],
        [0.03440836062, 0.32836099706, 73.297125859],
        [0.0205565386, 1.7829515933, 149.5631971346],
        [0.0064932241, 4.52247285911, 76.2660712756],
        [0.00602247865, 3.86003823674, 63.7358983034],
        [0.00496404167, 1.40139935333, 454.9093665273],
        [0.00338525369, 1.58002770318, 138.5174968707],
        [0.00243509114, 1.57086606044, 71.8126531507],
        [0.00190522303, 1.99809394714, 1.4844727083],
        [0.00161858838, 2.79137786799, 148.0787244263],
        [0.00143706183, 1.38368544947, 11.0457002639],
        [93192405e-11, 0.17437220467, 36.6485629295],
        [71424548e-11, 4.24509236074, 224.3447957019],
        [89806014e-11, 3.66105364565, 109.9456887885],
        [39009723e-11, 1.66971401684, 70.8494453042],
        [46677296e-11, 1.39976401694, 35.1640902212],
        [39025624e-11, 3.36234773834, 277.0349937414],
        [36755274e-11, 3.88649278513, 146.594251718],
        [30348723e-11, 0.70100838798, 151.0476698429],
        [29156413e-11, 3.180563367, 77.7505439839],
        [22637073e-11, 0.72518687029, 529.6909650946],
        [11959076e-11, 1.7504339214, 984.6003316219],
        [25620756e-11, 5.25656086672, 380.12776796]
      ],
      [
        [0.01479896629, 3.67205697578, 74.7815985673]
      ]
    ]
  ],
  Neptune: [
    [
      [
        [5.31188633046, 0, 0],
        [0.0179847553, 2.9010127389, 38.1330356378],
        [0.01019727652, 0.48580922867, 1.4844727083],
        [0.00124531845, 4.83008090676, 36.6485629295],
        [42064466e-11, 5.41054993053, 2.9689454166],
        [37714584e-11, 6.09221808686, 35.1640902212],
        [33784738e-11, 1.24488874087, 76.2660712756],
        [16482741e-11, 7727998e-11, 491.5579294568],
        [9198584e-11, 4.93747051954, 39.6175083461],
        [899425e-10, 0.27462171806, 175.1660598002]
      ],
      [
        [38.13303563957, 0, 0],
        [16604172e-11, 4.86323329249, 1.4844727083],
        [15744045e-11, 2.27887427527, 38.1330356378]
      ]
    ],
    [
      [
        [0.03088622933, 1.44104372644, 38.1330356378],
        [27780087e-11, 5.91271884599, 76.2660712756],
        [27623609e-11, 0, 0],
        [15355489e-11, 2.52123799551, 36.6485629295],
        [15448133e-11, 3.50877079215, 39.6175083461]
      ]
    ],
    [
      [
        [30.07013205828, 0, 0],
        [0.27062259632, 1.32999459377, 38.1330356378],
        [0.01691764014, 3.25186135653, 36.6485629295],
        [0.00807830553, 5.18592878704, 1.4844727083],
        [0.0053776051, 4.52113935896, 35.1640902212],
        [0.00495725141, 1.5710564165, 491.5579294568],
        [0.00274571975, 1.84552258866, 175.1660598002],
        [1201232e-10, 1.92059384991, 1021.2488945514],
        [0.00121801746, 5.79754470298, 76.2660712756],
        [0.00100896068, 0.3770272493, 73.297125859],
        [0.00135134092, 3.37220609835, 39.6175083461],
        [7571796e-11, 1.07149207335, 388.4651552382]
      ]
    ]
  ]
};
function DeltaT_EspenakMeeus(ut) {
  var u, u2, u3, u4, u5, u6, u7;
  const y = 2e3 + (ut - 14) / DAYS_PER_TROPICAL_YEAR;
  if (y < -500) {
    u = (y - 1820) / 100;
    return -20 + 32 * u * u;
  }
  if (y < 500) {
    u = y / 100;
    u2 = u * u;
    u3 = u * u2;
    u4 = u2 * u2;
    u5 = u2 * u3;
    u6 = u3 * u3;
    return 10583.6 - 1014.41 * u + 33.78311 * u2 - 5.952053 * u3 - 0.1798452 * u4 + 0.022174192 * u5 + 0.0090316521 * u6;
  }
  if (y < 1600) {
    u = (y - 1e3) / 100;
    u2 = u * u;
    u3 = u * u2;
    u4 = u2 * u2;
    u5 = u2 * u3;
    u6 = u3 * u3;
    return 1574.2 - 556.01 * u + 71.23472 * u2 + 0.319781 * u3 - 0.8503463 * u4 - 5050998e-9 * u5 + 0.0083572073 * u6;
  }
  if (y < 1700) {
    u = y - 1600;
    u2 = u * u;
    u3 = u * u2;
    return 120 - 0.9808 * u - 0.01532 * u2 + u3 / 7129;
  }
  if (y < 1800) {
    u = y - 1700;
    u2 = u * u;
    u3 = u * u2;
    u4 = u2 * u2;
    return 8.83 + 0.1603 * u - 59285e-7 * u2 + 13336e-8 * u3 - u4 / 1174e3;
  }
  if (y < 1860) {
    u = y - 1800;
    u2 = u * u;
    u3 = u * u2;
    u4 = u2 * u2;
    u5 = u2 * u3;
    u6 = u3 * u3;
    u7 = u3 * u4;
    return 13.72 - 0.332447 * u + 68612e-7 * u2 + 41116e-7 * u3 - 37436e-8 * u4 + 121272e-10 * u5 - 1699e-10 * u6 + 875e-12 * u7;
  }
  if (y < 1900) {
    u = y - 1860;
    u2 = u * u;
    u3 = u * u2;
    u4 = u2 * u2;
    u5 = u2 * u3;
    return 7.62 + 0.5737 * u - 0.251754 * u2 + 0.01680668 * u3 - 4473624e-10 * u4 + u5 / 233174;
  }
  if (y < 1920) {
    u = y - 1900;
    u2 = u * u;
    u3 = u * u2;
    u4 = u2 * u2;
    return -2.79 + 1.494119 * u - 0.0598939 * u2 + 61966e-7 * u3 - 197e-6 * u4;
  }
  if (y < 1941) {
    u = y - 1920;
    u2 = u * u;
    u3 = u * u2;
    return 21.2 + 0.84493 * u - 0.0761 * u2 + 20936e-7 * u3;
  }
  if (y < 1961) {
    u = y - 1950;
    u2 = u * u;
    u3 = u * u2;
    return 29.07 + 0.407 * u - u2 / 233 + u3 / 2547;
  }
  if (y < 1986) {
    u = y - 1975;
    u2 = u * u;
    u3 = u * u2;
    return 45.45 + 1.067 * u - u2 / 260 - u3 / 718;
  }
  if (y < 2005) {
    u = y - 2e3;
    u2 = u * u;
    u3 = u * u2;
    u4 = u2 * u2;
    u5 = u2 * u3;
    return 63.86 + 0.3345 * u - 0.060374 * u2 + 17275e-7 * u3 + 651814e-9 * u4 + 2373599e-11 * u5;
  }
  if (y < 2050) {
    u = y - 2e3;
    return 62.92 + 0.32217 * u + 5589e-6 * u * u;
  }
  if (y < 2150) {
    u = (y - 1820) / 100;
    return -20 + 32 * u * u - 0.5628 * (2150 - y);
  }
  u = (y - 1820) / 100;
  return -20 + 32 * u * u;
}
__name(DeltaT_EspenakMeeus, "DeltaT_EspenakMeeus");
var DeltaT = DeltaT_EspenakMeeus;
function TerrestrialTime(ut) {
  return ut + DeltaT(ut) / 86400;
}
__name(TerrestrialTime, "TerrestrialTime");
var AstroTime = class _AstroTime {
  static {
    __name(this, "AstroTime");
  }
  /**
   * @param {FlexibleDateTime} date
   *      A JavaScript Date object, a numeric UTC value expressed in J2000 days, or another AstroTime object.
   */
  constructor(date3) {
    if (date3 instanceof _AstroTime) {
      this.date = date3.date;
      this.ut = date3.ut;
      this.tt = date3.tt;
      return;
    }
    const MillisPerDay = 1e3 * 3600 * 24;
    if (date3 instanceof Date && Number.isFinite(date3.getTime())) {
      this.date = date3;
      this.ut = (date3.getTime() - J2000.getTime()) / MillisPerDay;
      this.tt = TerrestrialTime(this.ut);
      return;
    }
    if (Number.isFinite(date3)) {
      this.date = new Date(J2000.getTime() + date3 * MillisPerDay);
      this.ut = date3;
      this.tt = TerrestrialTime(this.ut);
      return;
    }
    throw "Argument must be a Date object, an AstroTime object, or a numeric UTC Julian date.";
  }
  /**
   * @brief Creates an `AstroTime` value from a Terrestrial Time (TT) day value.
   *
   * This function can be used in rare cases where a time must be based
   * on Terrestrial Time (TT) rather than Universal Time (UT).
   * Most developers will want to invoke `new AstroTime(ut)` with a universal time
   * instead of this function, because usually time is based on civil time adjusted
   * by leap seconds to match the Earth's rotation, rather than the uniformly
   * flowing TT used to calculate solar system dynamics. In rare cases
   * where the caller already knows TT, this function is provided to create
   * an `AstroTime` value that can be passed to Astronomy Engine functions.
   *
   * @param {number} tt
   *      The number of days since the J2000 epoch as expressed in Terrestrial Time.
   *
   * @returns {AstroTime}
   *      An `AstroTime` object for the specified terrestrial time.
   */
  static FromTerrestrialTime(tt) {
    let time3 = new _AstroTime(tt);
    for (; ; ) {
      const err = tt - time3.tt;
      if (Math.abs(err) < 1e-12)
        return time3;
      time3 = time3.AddDays(err);
    }
  }
  /**
   * Formats an `AstroTime` object as an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)
   * date/time string in UTC, to millisecond resolution.
   * Example: `2018-08-17T17:22:04.050Z`
   * @returns {string}
   */
  toString() {
    return this.date.toISOString();
  }
  /**
   * Returns a new `AstroTime` object adjusted by the floating point number of days.
   * Does NOT modify the original `AstroTime` object.
   *
   * @param {number} days
   *      The floating point number of days by which to adjust the given date and time.
   *      Positive values adjust the date toward the future, and
   *      negative values adjust the date toward the past.
   *
   * @returns {AstroTime}
   */
  AddDays(days) {
    return new _AstroTime(this.ut + days);
  }
};
function MakeTime(date3) {
  if (date3 instanceof AstroTime) {
    return date3;
  }
  return new AstroTime(date3);
}
__name(MakeTime, "MakeTime");
function iau2000b(time3) {
  function mod(x) {
    return x % ASEC360 * ASEC2RAD;
  }
  __name(mod, "mod");
  const t = time3.tt / 36525;
  const elp = mod(128710479305e-5 + t * 1295965810481e-4);
  const f = mod(335779.526232 + t * 17395272628478e-4);
  const d = mod(107226070369e-5 + t * 1602961601209e-3);
  const om = mod(450160.398036 - t * 69628905431e-4);
  let sarg = Math.sin(om);
  let carg = Math.cos(om);
  let dp = (-172064161 - 174666 * t) * sarg + 33386 * carg;
  let de = (92052331 + 9086 * t) * carg + 15377 * sarg;
  let arg = 2 * (f - d + om);
  sarg = Math.sin(arg);
  carg = Math.cos(arg);
  dp += (-13170906 - 1675 * t) * sarg - 13696 * carg;
  de += (5730336 - 3015 * t) * carg - 4587 * sarg;
  arg = 2 * (f + om);
  sarg = Math.sin(arg);
  carg = Math.cos(arg);
  dp += (-2276413 - 234 * t) * sarg + 2796 * carg;
  de += (978459 - 485 * t) * carg + 1374 * sarg;
  arg = 2 * om;
  sarg = Math.sin(arg);
  carg = Math.cos(arg);
  dp += (2074554 + 207 * t) * sarg - 698 * carg;
  de += (-897492 + 470 * t) * carg - 291 * sarg;
  sarg = Math.sin(elp);
  carg = Math.cos(elp);
  dp += (1475877 - 3633 * t) * sarg + 11817 * carg;
  de += (73871 - 184 * t) * carg - 1924 * sarg;
  return {
    dpsi: -135e-6 + dp * 1e-7,
    deps: 388e-6 + de * 1e-7
  };
}
__name(iau2000b, "iau2000b");
function mean_obliq(time3) {
  var t = time3.tt / 36525;
  var asec = ((((-434e-10 * t - 576e-9) * t + 20034e-7) * t - 1831e-7) * t - 46.836769) * t + 84381.406;
  return asec / 3600;
}
__name(mean_obliq, "mean_obliq");
var cache_e_tilt;
function e_tilt(time3) {
  if (!cache_e_tilt || Math.abs(cache_e_tilt.tt - time3.tt) > 1e-6) {
    const nut = iau2000b(time3);
    const mean_ob = mean_obliq(time3);
    const true_ob = mean_ob + nut.deps / 3600;
    cache_e_tilt = {
      tt: time3.tt,
      dpsi: nut.dpsi,
      deps: nut.deps,
      ee: nut.dpsi * Math.cos(mean_ob * DEG2RAD) / 15,
      mobl: mean_ob,
      tobl: true_ob
    };
  }
  return cache_e_tilt;
}
__name(e_tilt, "e_tilt");
function obl_ecl2equ_vec(oblDegrees, pos) {
  const obl = oblDegrees * DEG2RAD;
  const cos_obl = Math.cos(obl);
  const sin_obl = Math.sin(obl);
  return [
    pos[0],
    pos[1] * cos_obl - pos[2] * sin_obl,
    pos[1] * sin_obl + pos[2] * cos_obl
  ];
}
__name(obl_ecl2equ_vec, "obl_ecl2equ_vec");
function ecl2equ_vec(time3, pos) {
  return obl_ecl2equ_vec(mean_obliq(time3), pos);
}
__name(ecl2equ_vec, "ecl2equ_vec");
var CalcMoonCount = 0;
function CalcMoon(time3) {
  ++CalcMoonCount;
  const T = time3.tt / 36525;
  function DeclareArray1(xmin, xmax) {
    const array2 = [];
    let i;
    for (i = 0; i <= xmax - xmin; ++i) {
      array2.push(0);
    }
    return { min: xmin, array: array2 };
  }
  __name(DeclareArray1, "DeclareArray1");
  function DeclareArray2(xmin, xmax, ymin, ymax) {
    const array2 = [];
    for (let i = 0; i <= xmax - xmin; ++i) {
      array2.push(DeclareArray1(ymin, ymax));
    }
    return { min: xmin, array: array2 };
  }
  __name(DeclareArray2, "DeclareArray2");
  function ArrayGet2(a, x, y) {
    const m = a.array[x - a.min];
    return m.array[y - m.min];
  }
  __name(ArrayGet2, "ArrayGet2");
  function ArraySet2(a, x, y, v) {
    const m = a.array[x - a.min];
    m.array[y - m.min] = v;
  }
  __name(ArraySet2, "ArraySet2");
  let S, MAX, ARG, FAC, I, J, T2, DGAM, DLAM, N, GAM1C, SINPI, L0, L, LS, F, D, DL0, DL, DLS, DF, DD, DS;
  let coArray = DeclareArray2(-6, 6, 1, 4);
  let siArray = DeclareArray2(-6, 6, 1, 4);
  function CO(x, y) {
    return ArrayGet2(coArray, x, y);
  }
  __name(CO, "CO");
  function SI(x, y) {
    return ArrayGet2(siArray, x, y);
  }
  __name(SI, "SI");
  function SetCO(x, y, v) {
    return ArraySet2(coArray, x, y, v);
  }
  __name(SetCO, "SetCO");
  function SetSI(x, y, v) {
    return ArraySet2(siArray, x, y, v);
  }
  __name(SetSI, "SetSI");
  function AddThe(c1, s1, c2, s2, func) {
    func(c1 * c2 - s1 * s2, s1 * c2 + c1 * s2);
  }
  __name(AddThe, "AddThe");
  function Sine(phi) {
    return Math.sin(PI2 * phi);
  }
  __name(Sine, "Sine");
  T2 = T * T;
  DLAM = 0;
  DS = 0;
  GAM1C = 0;
  SINPI = 3422.7;
  var S1 = Sine(0.19833 + 0.05611 * T);
  var S2 = Sine(0.27869 + 0.04508 * T);
  var S3 = Sine(0.16827 - 0.36903 * T);
  var S4 = Sine(0.34734 - 5.37261 * T);
  var S5 = Sine(0.10498 - 5.37899 * T);
  var S6 = Sine(0.42681 - 0.41855 * T);
  var S7 = Sine(0.14943 - 5.37511 * T);
  DL0 = 0.84 * S1 + 0.31 * S2 + 14.27 * S3 + 7.26 * S4 + 0.28 * S5 + 0.24 * S6;
  DL = 2.94 * S1 + 0.31 * S2 + 14.27 * S3 + 9.34 * S4 + 1.12 * S5 + 0.83 * S6;
  DLS = -6.4 * S1 - 1.89 * S6;
  DF = 0.21 * S1 + 0.31 * S2 + 14.27 * S3 - 88.7 * S4 - 15.3 * S5 + 0.24 * S6 - 1.86 * S7;
  DD = DL0 - DLS;
  DGAM = -3332e-9 * Sine(0.59734 - 5.37261 * T) - 539e-9 * Sine(0.35498 - 5.37899 * T) - 64e-9 * Sine(0.39943 - 5.37511 * T);
  L0 = PI2 * Frac(0.60643382 + 1336.85522467 * T - 313e-8 * T2) + DL0 / ARC;
  L = PI2 * Frac(0.37489701 + 1325.55240982 * T + 2565e-8 * T2) + DL / ARC;
  LS = PI2 * Frac(0.99312619 + 99.99735956 * T - 44e-8 * T2) + DLS / ARC;
  F = PI2 * Frac(0.25909118 + 1342.2278298 * T - 892e-8 * T2) + DF / ARC;
  D = PI2 * Frac(0.82736186 + 1236.85308708 * T - 397e-8 * T2) + DD / ARC;
  for (I = 1; I <= 4; ++I) {
    switch (I) {
      case 1:
        ARG = L;
        MAX = 4;
        FAC = 1.000002208;
        break;
      case 2:
        ARG = LS;
        MAX = 3;
        FAC = 0.997504612 - 2495388e-9 * T;
        break;
      case 3:
        ARG = F;
        MAX = 4;
        FAC = 1.000002708 + 139.978 * DGAM;
        break;
      case 4:
        ARG = D;
        MAX = 6;
        FAC = 1;
        break;
      default:
        throw `Internal error: I = ${I}`;
    }
    SetCO(0, I, 1);
    SetCO(1, I, Math.cos(ARG) * FAC);
    SetSI(0, I, 0);
    SetSI(1, I, Math.sin(ARG) * FAC);
    for (J = 2; J <= MAX; ++J) {
      AddThe(CO(J - 1, I), SI(J - 1, I), CO(1, I), SI(1, I), (c, s) => (SetCO(J, I, c), SetSI(J, I, s)));
    }
    for (J = 1; J <= MAX; ++J) {
      SetCO(-J, I, CO(J, I));
      SetSI(-J, I, -SI(J, I));
    }
  }
  function Term(p, q, r, s) {
    var result = { x: 1, y: 0 };
    var I2 = [0, p, q, r, s];
    for (var k = 1; k <= 4; ++k)
      if (I2[k] !== 0)
        AddThe(result.x, result.y, CO(I2[k], k), SI(I2[k], k), (c, s2) => (result.x = c, result.y = s2));
    return result;
  }
  __name(Term, "Term");
  function AddSol(coeffl, coeffs, coeffg, coeffp, p, q, r, s) {
    var result = Term(p, q, r, s);
    DLAM += coeffl * result.y;
    DS += coeffs * result.y;
    GAM1C += coeffg * result.x;
    SINPI += coeffp * result.x;
  }
  __name(AddSol, "AddSol");
  AddSol(13.902, 14.06, -1e-3, 0.2607, 0, 0, 0, 4);
  AddSol(0.403, -4.01, 0.394, 23e-4, 0, 0, 0, 3);
  AddSol(2369.912, 2373.36, 0.601, 28.2333, 0, 0, 0, 2);
  AddSol(-125.154, -112.79, -0.725, -0.9781, 0, 0, 0, 1);
  AddSol(1.979, 6.98, -0.445, 0.0433, 1, 0, 0, 4);
  AddSol(191.953, 192.72, 0.029, 3.0861, 1, 0, 0, 2);
  AddSol(-8.466, -13.51, 0.455, -0.1093, 1, 0, 0, 1);
  AddSol(22639.5, 22609.07, 0.079, 186.5398, 1, 0, 0, 0);
  AddSol(18.609, 3.59, -0.094, 0.0118, 1, 0, 0, -1);
  AddSol(-4586.465, -4578.13, -0.077, 34.3117, 1, 0, 0, -2);
  AddSol(3.215, 5.44, 0.192, -0.0386, 1, 0, 0, -3);
  AddSol(-38.428, -38.64, 1e-3, 0.6008, 1, 0, 0, -4);
  AddSol(-0.393, -1.43, -0.092, 86e-4, 1, 0, 0, -6);
  AddSol(-0.289, -1.59, 0.123, -53e-4, 0, 1, 0, 4);
  AddSol(-24.42, -25.1, 0.04, -0.3, 0, 1, 0, 2);
  AddSol(18.023, 17.93, 7e-3, 0.1494, 0, 1, 0, 1);
  AddSol(-668.146, -126.98, -1.302, -0.3997, 0, 1, 0, 0);
  AddSol(0.56, 0.32, -1e-3, -37e-4, 0, 1, 0, -1);
  AddSol(-165.145, -165.06, 0.054, 1.9178, 0, 1, 0, -2);
  AddSol(-1.877, -6.46, -0.416, 0.0339, 0, 1, 0, -4);
  AddSol(0.213, 1.02, -0.074, 54e-4, 2, 0, 0, 4);
  AddSol(14.387, 14.78, -0.017, 0.2833, 2, 0, 0, 2);
  AddSol(-0.586, -1.2, 0.054, -0.01, 2, 0, 0, 1);
  AddSol(769.016, 767.96, 0.107, 10.1657, 2, 0, 0, 0);
  AddSol(1.75, 2.01, -0.018, 0.0155, 2, 0, 0, -1);
  AddSol(-211.656, -152.53, 5.679, -0.3039, 2, 0, 0, -2);
  AddSol(1.225, 0.91, -0.03, -88e-4, 2, 0, 0, -3);
  AddSol(-30.773, -34.07, -0.308, 0.3722, 2, 0, 0, -4);
  AddSol(-0.57, -1.4, -0.074, 0.0109, 2, 0, 0, -6);
  AddSol(-2.921, -11.75, 0.787, -0.0484, 1, 1, 0, 2);
  AddSol(1.267, 1.52, -0.022, 0.0164, 1, 1, 0, 1);
  AddSol(-109.673, -115.18, 0.461, -0.949, 1, 1, 0, 0);
  AddSol(-205.962, -182.36, 2.056, 1.4437, 1, 1, 0, -2);
  AddSol(0.233, 0.36, 0.012, -25e-4, 1, 1, 0, -3);
  AddSol(-4.391, -9.66, -0.471, 0.0673, 1, 1, 0, -4);
  AddSol(0.283, 1.53, -0.111, 6e-3, 1, -1, 0, 4);
  AddSol(14.577, 31.7, -1.54, 0.2302, 1, -1, 0, 2);
  AddSol(147.687, 138.76, 0.679, 1.1528, 1, -1, 0, 0);
  AddSol(-1.089, 0.55, 0.021, 0, 1, -1, 0, -1);
  AddSol(28.475, 23.59, -0.443, -0.2257, 1, -1, 0, -2);
  AddSol(-0.276, -0.38, -6e-3, -36e-4, 1, -1, 0, -3);
  AddSol(0.636, 2.27, 0.146, -0.0102, 1, -1, 0, -4);
  AddSol(-0.189, -1.68, 0.131, -28e-4, 0, 2, 0, 2);
  AddSol(-7.486, -0.66, -0.037, -86e-4, 0, 2, 0, 0);
  AddSol(-8.096, -16.35, -0.74, 0.0918, 0, 2, 0, -2);
  AddSol(-5.741, -0.04, 0, -9e-4, 0, 0, 2, 2);
  AddSol(0.255, 0, 0, 0, 0, 0, 2, 1);
  AddSol(-411.608, -0.2, 0, -0.0124, 0, 0, 2, 0);
  AddSol(0.584, 0.84, 0, 71e-4, 0, 0, 2, -1);
  AddSol(-55.173, -52.14, 0, -0.1052, 0, 0, 2, -2);
  AddSol(0.254, 0.25, 0, -17e-4, 0, 0, 2, -3);
  AddSol(0.025, -1.67, 0, 31e-4, 0, 0, 2, -4);
  AddSol(1.06, 2.96, -0.166, 0.0243, 3, 0, 0, 2);
  AddSol(36.124, 50.64, -1.3, 0.6215, 3, 0, 0, 0);
  AddSol(-13.193, -16.4, 0.258, -0.1187, 3, 0, 0, -2);
  AddSol(-1.187, -0.74, 0.042, 74e-4, 3, 0, 0, -4);
  AddSol(-0.293, -0.31, -2e-3, 46e-4, 3, 0, 0, -6);
  AddSol(-0.29, -1.45, 0.116, -51e-4, 2, 1, 0, 2);
  AddSol(-7.649, -10.56, 0.259, -0.1038, 2, 1, 0, 0);
  AddSol(-8.627, -7.59, 0.078, -0.0192, 2, 1, 0, -2);
  AddSol(-2.74, -2.54, 0.022, 0.0324, 2, 1, 0, -4);
  AddSol(1.181, 3.32, -0.212, 0.0213, 2, -1, 0, 2);
  AddSol(9.703, 11.67, -0.151, 0.1268, 2, -1, 0, 0);
  AddSol(-0.352, -0.37, 1e-3, -28e-4, 2, -1, 0, -1);
  AddSol(-2.494, -1.17, -3e-3, -17e-4, 2, -1, 0, -2);
  AddSol(0.36, 0.2, -0.012, -43e-4, 2, -1, 0, -4);
  AddSol(-1.167, -1.25, 8e-3, -0.0106, 1, 2, 0, 0);
  AddSol(-7.412, -6.12, 0.117, 0.0484, 1, 2, 0, -2);
  AddSol(-0.311, -0.65, -0.032, 44e-4, 1, 2, 0, -4);
  AddSol(0.757, 1.82, -0.105, 0.0112, 1, -2, 0, 2);
  AddSol(2.58, 2.32, 0.027, 0.0196, 1, -2, 0, 0);
  AddSol(2.533, 2.4, -0.014, -0.0212, 1, -2, 0, -2);
  AddSol(-0.344, -0.57, -0.025, 36e-4, 0, 3, 0, -2);
  AddSol(-0.992, -0.02, 0, 0, 1, 0, 2, 2);
  AddSol(-45.099, -0.02, 0, -1e-3, 1, 0, 2, 0);
  AddSol(-0.179, -9.52, 0, -0.0833, 1, 0, 2, -2);
  AddSol(-0.301, -0.33, 0, 14e-4, 1, 0, 2, -4);
  AddSol(-6.382, -3.37, 0, -0.0481, 1, 0, -2, 2);
  AddSol(39.528, 85.13, 0, -0.7136, 1, 0, -2, 0);
  AddSol(9.366, 0.71, 0, -0.0112, 1, 0, -2, -2);
  AddSol(0.202, 0.02, 0, 0, 1, 0, -2, -4);
  AddSol(0.415, 0.1, 0, 13e-4, 0, 1, 2, 0);
  AddSol(-2.152, -2.26, 0, -66e-4, 0, 1, 2, -2);
  AddSol(-1.44, -1.3, 0, 14e-4, 0, 1, -2, 2);
  AddSol(0.384, -0.04, 0, 0, 0, 1, -2, -2);
  AddSol(1.938, 3.6, -0.145, 0.0401, 4, 0, 0, 0);
  AddSol(-0.952, -1.58, 0.052, -0.013, 4, 0, 0, -2);
  AddSol(-0.551, -0.94, 0.032, -97e-4, 3, 1, 0, 0);
  AddSol(-0.482, -0.57, 5e-3, -45e-4, 3, 1, 0, -2);
  AddSol(0.681, 0.96, -0.026, 0.0115, 3, -1, 0, 0);
  AddSol(-0.297, -0.27, 2e-3, -9e-4, 2, 2, 0, -2);
  AddSol(0.254, 0.21, -3e-3, 0, 2, -2, 0, -2);
  AddSol(-0.25, -0.22, 4e-3, 14e-4, 1, 3, 0, -2);
  AddSol(-3.996, 0, 0, 4e-4, 2, 0, 2, 0);
  AddSol(0.557, -0.75, 0, -9e-3, 2, 0, 2, -2);
  AddSol(-0.459, -0.38, 0, -53e-4, 2, 0, -2, 2);
  AddSol(-1.298, 0.74, 0, 4e-4, 2, 0, -2, 0);
  AddSol(0.538, 1.14, 0, -0.0141, 2, 0, -2, -2);
  AddSol(0.263, 0.02, 0, 0, 1, 1, 2, 0);
  AddSol(0.426, 0.07, 0, -6e-4, 1, 1, -2, -2);
  AddSol(-0.304, 0.03, 0, 3e-4, 1, -1, 2, 0);
  AddSol(-0.372, -0.19, 0, -27e-4, 1, -1, -2, 2);
  AddSol(0.418, 0, 0, 0, 0, 0, 4, 0);
  AddSol(-0.33, -0.04, 0, 0, 3, 0, 2, 0);
  function ADDN(coeffn, p, q, r, s) {
    return coeffn * Term(p, q, r, s).y;
  }
  __name(ADDN, "ADDN");
  N = 0;
  N += ADDN(-526.069, 0, 0, 1, -2);
  N += ADDN(-3.352, 0, 0, 1, -4);
  N += ADDN(44.297, 1, 0, 1, -2);
  N += ADDN(-6, 1, 0, 1, -4);
  N += ADDN(20.599, -1, 0, 1, 0);
  N += ADDN(-30.598, -1, 0, 1, -2);
  N += ADDN(-24.649, -2, 0, 1, 0);
  N += ADDN(-2, -2, 0, 1, -2);
  N += ADDN(-22.571, 0, 1, 1, -2);
  N += ADDN(10.985, 0, -1, 1, -2);
  DLAM += 0.82 * Sine(0.7736 - 62.5512 * T) + 0.31 * Sine(0.0466 - 125.1025 * T) + 0.35 * Sine(0.5785 - 25.1042 * T) + 0.66 * Sine(0.4591 + 1335.8075 * T) + 0.64 * Sine(0.313 - 91.568 * T) + 1.14 * Sine(0.148 + 1331.2898 * T) + 0.21 * Sine(0.5918 + 1056.5859 * T) + 0.44 * Sine(0.5784 + 1322.8595 * T) + 0.24 * Sine(0.2275 - 5.7374 * T) + 0.28 * Sine(0.2965 + 2.6929 * T) + 0.33 * Sine(0.3132 + 6.3368 * T);
  S = F + DS / ARC;
  let lat_seconds = (1.000002708 + 139.978 * DGAM) * (18518.511 + 1.189 + GAM1C) * Math.sin(S) - 6.24 * Math.sin(3 * S) + N;
  return {
    geo_eclip_lon: PI2 * Frac((L0 + DLAM / ARC) / PI2),
    geo_eclip_lat: Math.PI / (180 * 3600) * lat_seconds,
    distance_au: ARC * EARTH_EQUATORIAL_RADIUS_AU / (0.999953253 * SINPI)
  };
}
__name(CalcMoon, "CalcMoon");
function rotate(rot, vec) {
  return [
    rot.rot[0][0] * vec[0] + rot.rot[1][0] * vec[1] + rot.rot[2][0] * vec[2],
    rot.rot[0][1] * vec[0] + rot.rot[1][1] * vec[1] + rot.rot[2][1] * vec[2],
    rot.rot[0][2] * vec[0] + rot.rot[1][2] * vec[1] + rot.rot[2][2] * vec[2]
  ];
}
__name(rotate, "rotate");
function precession(pos, time3, dir) {
  const r = precession_rot(time3, dir);
  return rotate(r, pos);
}
__name(precession, "precession");
function precession_rot(time3, dir) {
  const t = time3.tt / 36525;
  let eps0 = 84381.406;
  let psia = ((((-951e-10 * t + 132851e-9) * t - 114045e-8) * t - 1.0790069) * t + 5038.481507) * t;
  let omegaa = ((((3337e-10 * t - 467e-9) * t - 772503e-8) * t + 0.0512623) * t - 0.025754) * t + eps0;
  let chia = ((((-56e-9 * t + 170663e-9) * t - 121197e-8) * t - 2.3814292) * t + 10.556403) * t;
  eps0 *= ASEC2RAD;
  psia *= ASEC2RAD;
  omegaa *= ASEC2RAD;
  chia *= ASEC2RAD;
  const sa = Math.sin(eps0);
  const ca = Math.cos(eps0);
  const sb = Math.sin(-psia);
  const cb = Math.cos(-psia);
  const sc = Math.sin(-omegaa);
  const cc = Math.cos(-omegaa);
  const sd = Math.sin(chia);
  const cd = Math.cos(chia);
  const xx = cd * cb - sb * sd * cc;
  const yx = cd * sb * ca + sd * cc * cb * ca - sa * sd * sc;
  const zx = cd * sb * sa + sd * cc * cb * sa + ca * sd * sc;
  const xy = -sd * cb - sb * cd * cc;
  const yy = -sd * sb * ca + cd * cc * cb * ca - sa * cd * sc;
  const zy = -sd * sb * sa + cd * cc * cb * sa + ca * cd * sc;
  const xz = sb * sc;
  const yz = -sc * cb * ca - sa * cc;
  const zz = -sc * cb * sa + cc * ca;
  if (dir === PrecessDirection.Into2000) {
    return new RotationMatrix([
      [xx, yx, zx],
      [xy, yy, zy],
      [xz, yz, zz]
    ]);
  }
  if (dir === PrecessDirection.From2000) {
    return new RotationMatrix([
      [xx, xy, xz],
      [yx, yy, yz],
      [zx, zy, zz]
    ]);
  }
  throw "Invalid precess direction";
}
__name(precession_rot, "precession_rot");
function nutation(pos, time3, dir) {
  const r = nutation_rot(time3, dir);
  return rotate(r, pos);
}
__name(nutation, "nutation");
function nutation_rot(time3, dir) {
  const tilt = e_tilt(time3);
  const oblm = tilt.mobl * DEG2RAD;
  const oblt = tilt.tobl * DEG2RAD;
  const psi = tilt.dpsi * ASEC2RAD;
  const cobm = Math.cos(oblm);
  const sobm = Math.sin(oblm);
  const cobt = Math.cos(oblt);
  const sobt = Math.sin(oblt);
  const cpsi = Math.cos(psi);
  const spsi = Math.sin(psi);
  const xx = cpsi;
  const yx = -spsi * cobm;
  const zx = -spsi * sobm;
  const xy = spsi * cobt;
  const yy = cpsi * cobm * cobt + sobm * sobt;
  const zy = cpsi * sobm * cobt - cobm * sobt;
  const xz = spsi * sobt;
  const yz = cpsi * cobm * sobt - sobm * cobt;
  const zz = cpsi * sobm * sobt + cobm * cobt;
  if (dir === PrecessDirection.From2000) {
    return new RotationMatrix([
      [xx, xy, xz],
      [yx, yy, yz],
      [zx, zy, zz]
    ]);
  }
  if (dir === PrecessDirection.Into2000) {
    return new RotationMatrix([
      [xx, yx, zx],
      [xy, yy, zy],
      [xz, yz, zz]
    ]);
  }
  throw "Invalid precess direction";
}
__name(nutation_rot, "nutation_rot");
var Vector = class {
  static {
    __name(this, "Vector");
  }
  constructor(x, y, z, t) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.t = t;
  }
  /**
   * Returns the length of the vector in astronomical units (AU).
   * @returns {number}
   */
  Length() {
    return Math.hypot(this.x, this.y, this.z);
  }
};
var StateVector = class {
  static {
    __name(this, "StateVector");
  }
  constructor(x, y, z, vx, vy, vz, t) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
    this.t = t;
  }
};
var Spherical = class {
  static {
    __name(this, "Spherical");
  }
  constructor(lat, lon, dist) {
    this.lat = VerifyNumber(lat);
    this.lon = VerifyNumber(lon);
    this.dist = VerifyNumber(dist);
  }
};
var RotationMatrix = class {
  static {
    __name(this, "RotationMatrix");
  }
  constructor(rot) {
    this.rot = rot;
  }
};
var EclipticCoordinates = class {
  static {
    __name(this, "EclipticCoordinates");
  }
  constructor(vec, elat, elon) {
    this.vec = vec;
    this.elat = VerifyNumber(elat);
    this.elon = VerifyNumber(elon);
  }
};
function RotateEquatorialToEcliptic(equ, cos_ob, sin_ob) {
  const ex = equ.x;
  const ey = equ.y * cos_ob + equ.z * sin_ob;
  const ez = -equ.y * sin_ob + equ.z * cos_ob;
  const xyproj = Math.hypot(ex, ey);
  let elon = 0;
  if (xyproj > 0) {
    elon = RAD2DEG * Math.atan2(ey, ex);
    if (elon < 0)
      elon += 360;
  }
  let elat = RAD2DEG * Math.atan2(ez, xyproj);
  let ecl = new Vector(ex, ey, ez, equ.t);
  return new EclipticCoordinates(ecl, elat, elon);
}
__name(RotateEquatorialToEcliptic, "RotateEquatorialToEcliptic");
function Ecliptic(eqj) {
  const et = e_tilt(eqj.t);
  const eqj_pos = [eqj.x, eqj.y, eqj.z];
  const mean_pos = precession(eqj_pos, eqj.t, PrecessDirection.From2000);
  const [x, y, z] = nutation(mean_pos, eqj.t, PrecessDirection.From2000);
  const eqd = new Vector(x, y, z, eqj.t);
  const tobl = et.tobl * DEG2RAD;
  return RotateEquatorialToEcliptic(eqd, Math.cos(tobl), Math.sin(tobl));
}
__name(Ecliptic, "Ecliptic");
function GeoMoon(date3) {
  const time3 = MakeTime(date3);
  const moon = CalcMoon(time3);
  const dist_cos_lat = moon.distance_au * Math.cos(moon.geo_eclip_lat);
  const gepos = [
    dist_cos_lat * Math.cos(moon.geo_eclip_lon),
    dist_cos_lat * Math.sin(moon.geo_eclip_lon),
    moon.distance_au * Math.sin(moon.geo_eclip_lat)
  ];
  const mpos1 = ecl2equ_vec(time3, gepos);
  const mpos2 = precession(mpos1, time3, PrecessDirection.Into2000);
  return new Vector(mpos2[0], mpos2[1], mpos2[2], time3);
}
__name(GeoMoon, "GeoMoon");
function GeoMoonState(date3) {
  const time3 = MakeTime(date3);
  const dt = 1e-5;
  const t1 = time3.AddDays(-dt);
  const t2 = time3.AddDays(+dt);
  const r1 = GeoMoon(t1);
  const r2 = GeoMoon(t2);
  return new StateVector((r1.x + r2.x) / 2, (r1.y + r2.y) / 2, (r1.z + r2.z) / 2, (r2.x - r1.x) / (2 * dt), (r2.y - r1.y) / (2 * dt), (r2.z - r1.z) / (2 * dt), time3);
}
__name(GeoMoonState, "GeoMoonState");
function GeoEmbState(date3) {
  const time3 = MakeTime(date3);
  const s = GeoMoonState(time3);
  const d = 1 + EARTH_MOON_MASS_RATIO;
  return new StateVector(s.x / d, s.y / d, s.z / d, s.vx / d, s.vy / d, s.vz / d, time3);
}
__name(GeoEmbState, "GeoEmbState");
function VsopFormula(formula, t, clamp_angle) {
  let tpower = 1;
  let coord = 0;
  for (let series of formula) {
    let sum = 0;
    for (let [ampl, phas, freq] of series)
      sum += ampl * Math.cos(phas + t * freq);
    let incr = tpower * sum;
    if (clamp_angle)
      incr %= PI2;
    coord += incr;
    tpower *= t;
  }
  return coord;
}
__name(VsopFormula, "VsopFormula");
function VsopDeriv(formula, t) {
  let tpower = 1;
  let dpower = 0;
  let deriv = 0;
  let s = 0;
  for (let series of formula) {
    let sin_sum = 0;
    let cos_sum = 0;
    for (let [ampl, phas, freq] of series) {
      let angle = phas + t * freq;
      sin_sum += ampl * freq * Math.sin(angle);
      if (s > 0)
        cos_sum += ampl * Math.cos(angle);
    }
    deriv += s * dpower * cos_sum - tpower * sin_sum;
    dpower = tpower;
    tpower *= t;
    ++s;
  }
  return deriv;
}
__name(VsopDeriv, "VsopDeriv");
var DAYS_PER_MILLENNIUM = 365250;
var LON_INDEX = 0;
var LAT_INDEX = 1;
var RAD_INDEX = 2;
function VsopRotate(eclip) {
  return new TerseVector(eclip[0] + 44036e-11 * eclip[1] - 190919e-12 * eclip[2], -479966e-12 * eclip[0] + 0.917482137087 * eclip[1] - 0.397776982902 * eclip[2], 0.397776982902 * eclip[1] + 0.917482137087 * eclip[2]);
}
__name(VsopRotate, "VsopRotate");
function VsopSphereToRect(lon, lat, radius) {
  const r_coslat = radius * Math.cos(lat);
  const coslon = Math.cos(lon);
  const sinlon = Math.sin(lon);
  return [
    r_coslat * coslon,
    r_coslat * sinlon,
    radius * Math.sin(lat)
  ];
}
__name(VsopSphereToRect, "VsopSphereToRect");
function CalcVsop(model, time3) {
  const t = time3.tt / DAYS_PER_MILLENNIUM;
  const lon = VsopFormula(model[LON_INDEX], t, true);
  const lat = VsopFormula(model[LAT_INDEX], t, false);
  const rad = VsopFormula(model[RAD_INDEX], t, false);
  const eclip = VsopSphereToRect(lon, lat, rad);
  return VsopRotate(eclip).ToAstroVector(time3);
}
__name(CalcVsop, "CalcVsop");
function CalcVsopPosVel(model, tt) {
  const t = tt / DAYS_PER_MILLENNIUM;
  const lon = VsopFormula(model[LON_INDEX], t, true);
  const lat = VsopFormula(model[LAT_INDEX], t, false);
  const rad = VsopFormula(model[RAD_INDEX], t, false);
  const dlon_dt = VsopDeriv(model[LON_INDEX], t);
  const dlat_dt = VsopDeriv(model[LAT_INDEX], t);
  const drad_dt = VsopDeriv(model[RAD_INDEX], t);
  const coslon = Math.cos(lon);
  const sinlon = Math.sin(lon);
  const coslat = Math.cos(lat);
  const sinlat = Math.sin(lat);
  const vx = +(drad_dt * coslat * coslon) - rad * sinlat * coslon * dlat_dt - rad * coslat * sinlon * dlon_dt;
  const vy = +(drad_dt * coslat * sinlon) - rad * sinlat * sinlon * dlat_dt + rad * coslat * coslon * dlon_dt;
  const vz = +(drad_dt * sinlat) + rad * coslat * dlat_dt;
  const eclip_pos = VsopSphereToRect(lon, lat, rad);
  const eclip_vel = [
    vx / DAYS_PER_MILLENNIUM,
    vy / DAYS_PER_MILLENNIUM,
    vz / DAYS_PER_MILLENNIUM
  ];
  const equ_pos = VsopRotate(eclip_pos);
  const equ_vel = VsopRotate(eclip_vel);
  return new body_state_t(tt, equ_pos, equ_vel);
}
__name(CalcVsopPosVel, "CalcVsopPosVel");
function AdjustBarycenter(ssb, time3, body, pmass) {
  const shift = pmass / (pmass + SUN_GM);
  const planet = CalcVsop(vsop[body], time3);
  ssb.x += shift * planet.x;
  ssb.y += shift * planet.y;
  ssb.z += shift * planet.z;
}
__name(AdjustBarycenter, "AdjustBarycenter");
function CalcSolarSystemBarycenter(time3) {
  const ssb = new Vector(0, 0, 0, time3);
  AdjustBarycenter(ssb, time3, Body.Jupiter, JUPITER_GM);
  AdjustBarycenter(ssb, time3, Body.Saturn, SATURN_GM);
  AdjustBarycenter(ssb, time3, Body.Uranus, URANUS_GM);
  AdjustBarycenter(ssb, time3, Body.Neptune, NEPTUNE_GM);
  return ssb;
}
__name(CalcSolarSystemBarycenter, "CalcSolarSystemBarycenter");
var PLUTO_NUM_STATES = 51;
var PLUTO_TIME_STEP = 29200;
var PLUTO_DT = 146;
var PLUTO_NSTEPS = 201;
var PlutoStateTable = [
  [-73e4, [-26.118207232108, -14.376168177825, 3.384402515299], [0.0016339372163656, -0.0027861699588508, -0.0013585880229445]],
  [-700800, [41.974905202127, -0.448502952929, -12.770351505989], [73458569351457e-17, 0.0022785014891658, 48619778602049e-17]],
  [-671600, [14.706930780744, 44.269110540027, 9.353698474772], [-0.00210001479998, 22295915939915e-17, 70143443551414e-17]],
  [-642400, [-29.441003929957, -6.43016153057, 6.858481011305], [84495803960544e-17, -0.0030783914758711, -0.0012106305981192]],
  [-613200, [39.444396946234, -6.557989760571, -13.913760296463], [0.0011480029005873, 0.0022400006880665, 35168075922288e-17]],
  [-584e3, [20.2303809507, 43.266966657189, 7.382966091923], [-0.0019754081700585, 53457141292226e-17, 75929169129793e-17]],
  [-554800, [-30.65832536462, 2.093818874552, 9.880531138071], [61010603013347e-18, -0.0031326500935382, -99346125151067e-17]],
  [-525600, [35.737703251673, -12.587706024764, -14.677847247563], [0.0015802939375649, 0.0021347678412429, 19074436384343e-17]],
  [-496400, [25.466295188546, 41.367478338417, 5.216476873382], [-0.0018054401046468, 8328308359951e-16, 80260156912107e-17]],
  [-467200, [-29.847174904071, 10.636426313081, 12.297904180106], [-63257063052907e-17, -0.0029969577578221, -74476074151596e-17]],
  [-438e3, [30.774692107687, -18.236637015304, -14.945535879896], [0.0020113162005465, 0.0019353827024189, -20937793168297e-19]],
  [-408800, [30.243153324028, 38.656267888503, 2.938501750218], [-0.0016052508674468, 0.0011183495337525, 83333973416824e-17]],
  [-379600, [-27.288984772533, 18.643162147874, 14.023633623329], [-0.0011856388898191, -0.0027170609282181, -49015526126399e-17]],
  [-350400, [24.519605196774, -23.245756064727, -14.626862367368], [0.0024322321483154, 0.0016062008146048, -23369181613312e-17]],
  [-321200, [34.505274805875, 35.125338586954, 0.557361475637], [-0.0013824391637782, 0.0013833397561817, 84823598806262e-17]],
  [-292e3, [-23.275363915119, 25.818514298769, 15.055381588598], [-0.0016062295460975, -0.0023395961498533, -24377362639479e-17]],
  [-262800, [17.050384798092, -27.180376290126, -13.608963321694], [0.0028175521080578, 0.0011358749093955, -49548725258825e-17]],
  [-233600, [38.093671910285, 30.880588383337, -1.843688067413], [-0.0011317697153459, 0.0016128814698472, 84177586176055e-17]],
  [-204400, [-18.197852930878, 31.932869934309, 15.438294826279], [-0.0019117272501813, -0.0019146495909842, -19657304369835e-18]],
  [-175200, [8.528924039997, -29.618422200048, -11.805400994258], [0.0031034370787005, 5139363329243e-16, -77293066202546e-17]],
  [-146e3, [40.94685725864, 25.904973592021, -4.256336240499], [-83652705194051e-17, 0.0018129497136404, 8156422827306e-16]],
  [-116800, [-12.326958895325, 36.881883446292, 15.217158258711], [-0.0021166103705038, -0.001481442003599, 17401209844705e-17]],
  [-87600, [-0.633258375909, -30.018759794709, -9.17193287495], [0.0032016994581737, -25279858672148e-17, -0.0010411088271861]],
  [-58400, [42.936048423883, 20.344685584452, -6.588027007912], [-50525450073192e-17, 0.0019910074335507, 77440196540269e-17]],
  [-29200, [-5.975910552974, 40.61180995846, 14.470131723673], [-0.0022184202156107, -0.0010562361130164, 33652250216211e-17]],
  [0, [-9.875369580774, -27.978926224737, -5.753711824704], [0.0030287533248818, -0.0011276087003636, -0.0012651326732361]],
  [29200, [43.958831986165, 14.214147973292, -8.808306227163], [-14717608981871e-17, 0.0021404187242141, 71486567806614e-17]],
  [58400, [0.67813676352, 43.094461639362, 13.243238780721], [-0.0022358226110718, -63233636090933e-17, 47664798895648e-17]],
  [87600, [-18.282602096834, -23.30503958666, -1.766620508028], [0.0025567245263557, -0.0019902940754171, -0.0013943491701082]],
  [116800, [43.873338744526, 7.700705617215, -10.814273666425], [23174803055677e-17, 0.0022402163127924, 62988756452032e-17]],
  [146e3, [7.392949027906, 44.382678951534, 11.629500214854], [-0.002193281545383, -21751799585364e-17, 59556516201114e-17]],
  [175200, [-24.981690229261, -16.204012851426, 2.466457544298], [0.001819398914958, -0.0026765419531201, -0.0013848283502247]],
  [204400, [42.530187039511, 0.845935508021, -12.554907527683], [65059779150669e-17, 0.0022725657282262, 51133743202822e-17]],
  [233600, [13.999526486822, 44.462363044894, 9.669418486465], [-0.0021079296569252, 17533423831993e-17, 69128485798076e-17]],
  [262800, [-29.184024803031, -7.371243995762, 6.493275957928], [93581363109681e-17, -0.0030610357109184, -0.0012364201089345]],
  [292e3, [39.831980671753, -6.078405766765, -13.909815358656], [0.0011117769689167, 0.0022362097830152, 36230548231153e-17]],
  [321200, [20.294955108476, 43.417190420251, 7.450091985932], [-0.0019742157451535, 53102050468554e-17, 75938408813008e-17]],
  [350400, [-30.66999230216, 2.318743558955, 9.973480913858], [45605107450676e-18, -0.0031308219926928, -99066533301924e-17]],
  [379600, [35.626122155983, -12.897647509224, -14.777586508444], [0.0016015684949743, 0.0021171931182284, 18002516202204e-17]],
  [408800, [26.133186148561, 41.232139187599, 5.00640132622], [-0.0017857704419579, 86046232702817e-17, 80614690298954e-17]],
  [438e3, [-29.57674022923, 11.863535943587, 12.631323039872], [-72292830060955e-17, -0.0029587820140709, -708242964503e-15]],
  [467200, [29.910805787391, -19.159019294, -15.013363865194], [0.0020871080437997, 0.0018848372554514, -38528655083926e-18]],
  [496400, [31.375957451819, 38.050372720763, 2.433138343754], [-0.0015546055556611, 0.0011699815465629, 83565439266001e-17]],
  [525600, [-26.360071336928, 20.662505904952, 14.414696258958], [-0.0013142373118349, -0.0026236647854842, -42542017598193e-17]],
  [554800, [22.599441488648, -24.508879898306, -14.484045731468], [0.0025454108304806, 0.0014917058755191, -30243665086079e-17]],
  [584e3, [35.877864013014, 33.894226366071, -0.224524636277], [-0.0012941245730845, 0.0014560427668319, 84762160640137e-17]],
  [613200, [-21.538149762417, 28.204068269761, 15.321973799534], [-0.001731211740901, -0.0021939631314577, -1631691327518e-16]],
  [642400, [13.971521374415, -28.339941764789, -13.083792871886], [0.0029334630526035, 91860931752944e-17, -59939422488627e-17]],
  [671600, [39.526942044143, 28.93989736011, -2.872799527539], [-0.0010068481658095, 0.001702113288809, 83578230511981e-17]],
  [700800, [-15.576200701394, 34.399412961275, 15.466033737854], [-0.0020098814612884, -0.0017191109825989, 70414782780416e-18]],
  [73e4, [4.24325283709, -30.118201690825, -10.707441231349], [0.0031725847067411, 1609846120227e-16, -90672150593868e-17]]
];
var TerseVector = class _TerseVector {
  static {
    __name(this, "TerseVector");
  }
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  clone() {
    return new _TerseVector(this.x, this.y, this.z);
  }
  ToAstroVector(t) {
    return new Vector(this.x, this.y, this.z, t);
  }
  static zero() {
    return new _TerseVector(0, 0, 0);
  }
  quadrature() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  add(other) {
    return new _TerseVector(this.x + other.x, this.y + other.y, this.z + other.z);
  }
  sub(other) {
    return new _TerseVector(this.x - other.x, this.y - other.y, this.z - other.z);
  }
  incr(other) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
  }
  decr(other) {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
  }
  mul(scalar) {
    return new _TerseVector(scalar * this.x, scalar * this.y, scalar * this.z);
  }
  div(scalar) {
    return new _TerseVector(this.x / scalar, this.y / scalar, this.z / scalar);
  }
  mean(other) {
    return new _TerseVector((this.x + other.x) / 2, (this.y + other.y) / 2, (this.z + other.z) / 2);
  }
  neg() {
    return new _TerseVector(-this.x, -this.y, -this.z);
  }
};
var body_state_t = class _body_state_t {
  static {
    __name(this, "body_state_t");
  }
  constructor(tt, r, v) {
    this.tt = tt;
    this.r = r;
    this.v = v;
  }
  clone() {
    return new _body_state_t(this.tt, this.r, this.v);
  }
  sub(other) {
    return new _body_state_t(this.tt, this.r.sub(other.r), this.v.sub(other.v));
  }
};
function BodyStateFromTable(entry) {
  let [tt, [rx, ry, rz], [vx, vy, vz]] = entry;
  return new body_state_t(tt, new TerseVector(rx, ry, rz), new TerseVector(vx, vy, vz));
}
__name(BodyStateFromTable, "BodyStateFromTable");
function AdjustBarycenterPosVel(ssb, tt, body, planet_gm) {
  const shift = planet_gm / (planet_gm + SUN_GM);
  const planet = CalcVsopPosVel(vsop[body], tt);
  ssb.r.incr(planet.r.mul(shift));
  ssb.v.incr(planet.v.mul(shift));
  return planet;
}
__name(AdjustBarycenterPosVel, "AdjustBarycenterPosVel");
function AccelerationIncrement(small_pos, gm, major_pos) {
  const delta = major_pos.sub(small_pos);
  const r2 = delta.quadrature();
  return delta.mul(gm / (r2 * Math.sqrt(r2)));
}
__name(AccelerationIncrement, "AccelerationIncrement");
var major_bodies_t = class {
  static {
    __name(this, "major_bodies_t");
  }
  constructor(tt) {
    let ssb = new body_state_t(tt, new TerseVector(0, 0, 0), new TerseVector(0, 0, 0));
    this.Jupiter = AdjustBarycenterPosVel(ssb, tt, Body.Jupiter, JUPITER_GM);
    this.Saturn = AdjustBarycenterPosVel(ssb, tt, Body.Saturn, SATURN_GM);
    this.Uranus = AdjustBarycenterPosVel(ssb, tt, Body.Uranus, URANUS_GM);
    this.Neptune = AdjustBarycenterPosVel(ssb, tt, Body.Neptune, NEPTUNE_GM);
    this.Jupiter.r.decr(ssb.r);
    this.Jupiter.v.decr(ssb.v);
    this.Saturn.r.decr(ssb.r);
    this.Saturn.v.decr(ssb.v);
    this.Uranus.r.decr(ssb.r);
    this.Uranus.v.decr(ssb.v);
    this.Neptune.r.decr(ssb.r);
    this.Neptune.v.decr(ssb.v);
    this.Sun = new body_state_t(tt, ssb.r.mul(-1), ssb.v.mul(-1));
  }
  Acceleration(pos) {
    let acc = AccelerationIncrement(pos, SUN_GM, this.Sun.r);
    acc.incr(AccelerationIncrement(pos, JUPITER_GM, this.Jupiter.r));
    acc.incr(AccelerationIncrement(pos, SATURN_GM, this.Saturn.r));
    acc.incr(AccelerationIncrement(pos, URANUS_GM, this.Uranus.r));
    acc.incr(AccelerationIncrement(pos, NEPTUNE_GM, this.Neptune.r));
    return acc;
  }
};
var body_grav_calc_t = class _body_grav_calc_t {
  static {
    __name(this, "body_grav_calc_t");
  }
  constructor(tt, r, v, a) {
    this.tt = tt;
    this.r = r;
    this.v = v;
    this.a = a;
  }
  clone() {
    return new _body_grav_calc_t(this.tt, this.r.clone(), this.v.clone(), this.a.clone());
  }
};
var grav_sim_t = class {
  static {
    __name(this, "grav_sim_t");
  }
  constructor(bary, grav) {
    this.bary = bary;
    this.grav = grav;
  }
};
function UpdatePosition(dt, r, v, a) {
  return new TerseVector(r.x + dt * (v.x + dt * a.x / 2), r.y + dt * (v.y + dt * a.y / 2), r.z + dt * (v.z + dt * a.z / 2));
}
__name(UpdatePosition, "UpdatePosition");
function UpdateVelocity(dt, v, a) {
  return new TerseVector(v.x + dt * a.x, v.y + dt * a.y, v.z + dt * a.z);
}
__name(UpdateVelocity, "UpdateVelocity");
function GravSim(tt2, calc1) {
  const dt = tt2 - calc1.tt;
  const bary2 = new major_bodies_t(tt2);
  const approx_pos = UpdatePosition(dt, calc1.r, calc1.v, calc1.a);
  const mean_acc = bary2.Acceleration(approx_pos).mean(calc1.a);
  const pos = UpdatePosition(dt, calc1.r, calc1.v, mean_acc);
  const vel = calc1.v.add(mean_acc.mul(dt));
  const acc = bary2.Acceleration(pos);
  const grav = new body_grav_calc_t(tt2, pos, vel, acc);
  return new grav_sim_t(bary2, grav);
}
__name(GravSim, "GravSim");
var pluto_cache = [];
function ClampIndex(frac, nsteps) {
  const index = Math.floor(frac);
  if (index < 0)
    return 0;
  if (index >= nsteps)
    return nsteps - 1;
  return index;
}
__name(ClampIndex, "ClampIndex");
function GravFromState(entry) {
  const state = BodyStateFromTable(entry);
  const bary = new major_bodies_t(state.tt);
  const r = state.r.add(bary.Sun.r);
  const v = state.v.add(bary.Sun.v);
  const a = bary.Acceleration(r);
  const grav = new body_grav_calc_t(state.tt, r, v, a);
  return new grav_sim_t(bary, grav);
}
__name(GravFromState, "GravFromState");
function GetSegment(cache, tt) {
  const t0 = PlutoStateTable[0][0];
  if (tt < t0 || tt > PlutoStateTable[PLUTO_NUM_STATES - 1][0]) {
    return null;
  }
  const seg_index = ClampIndex((tt - t0) / PLUTO_TIME_STEP, PLUTO_NUM_STATES - 1);
  if (!cache[seg_index]) {
    const seg = cache[seg_index] = [];
    seg[0] = GravFromState(PlutoStateTable[seg_index]).grav;
    seg[PLUTO_NSTEPS - 1] = GravFromState(PlutoStateTable[seg_index + 1]).grav;
    let i;
    let step_tt = seg[0].tt;
    for (i = 1; i < PLUTO_NSTEPS - 1; ++i)
      seg[i] = GravSim(step_tt += PLUTO_DT, seg[i - 1]).grav;
    step_tt = seg[PLUTO_NSTEPS - 1].tt;
    var reverse = [];
    reverse[PLUTO_NSTEPS - 1] = seg[PLUTO_NSTEPS - 1];
    for (i = PLUTO_NSTEPS - 2; i > 0; --i)
      reverse[i] = GravSim(step_tt -= PLUTO_DT, reverse[i + 1]).grav;
    for (i = PLUTO_NSTEPS - 2; i > 0; --i) {
      const ramp = i / (PLUTO_NSTEPS - 1);
      seg[i].r = seg[i].r.mul(1 - ramp).add(reverse[i].r.mul(ramp));
      seg[i].v = seg[i].v.mul(1 - ramp).add(reverse[i].v.mul(ramp));
      seg[i].a = seg[i].a.mul(1 - ramp).add(reverse[i].a.mul(ramp));
    }
  }
  return cache[seg_index];
}
__name(GetSegment, "GetSegment");
function CalcPlutoOneWay(entry, target_tt, dt) {
  let sim = GravFromState(entry);
  const n = Math.ceil((target_tt - sim.grav.tt) / dt);
  for (let i = 0; i < n; ++i)
    sim = GravSim(i + 1 === n ? target_tt : sim.grav.tt + dt, sim.grav);
  return sim;
}
__name(CalcPlutoOneWay, "CalcPlutoOneWay");
function CalcPluto(time3, helio) {
  let r, v, bary;
  const seg = GetSegment(pluto_cache, time3.tt);
  if (!seg) {
    let sim;
    if (time3.tt < PlutoStateTable[0][0])
      sim = CalcPlutoOneWay(PlutoStateTable[0], time3.tt, -PLUTO_DT);
    else
      sim = CalcPlutoOneWay(PlutoStateTable[PLUTO_NUM_STATES - 1], time3.tt, +PLUTO_DT);
    r = sim.grav.r;
    v = sim.grav.v;
    bary = sim.bary;
  } else {
    const left = ClampIndex((time3.tt - seg[0].tt) / PLUTO_DT, PLUTO_NSTEPS - 1);
    const s1 = seg[left];
    const s2 = seg[left + 1];
    const acc = s1.a.mean(s2.a);
    const ra = UpdatePosition(time3.tt - s1.tt, s1.r, s1.v, acc);
    const va = UpdateVelocity(time3.tt - s1.tt, s1.v, acc);
    const rb = UpdatePosition(time3.tt - s2.tt, s2.r, s2.v, acc);
    const vb = UpdateVelocity(time3.tt - s2.tt, s2.v, acc);
    const ramp = (time3.tt - s1.tt) / PLUTO_DT;
    r = ra.mul(1 - ramp).add(rb.mul(ramp));
    v = va.mul(1 - ramp).add(vb.mul(ramp));
  }
  if (helio) {
    if (!bary)
      bary = new major_bodies_t(time3.tt);
    r = r.sub(bary.Sun.r);
    v = v.sub(bary.Sun.v);
  }
  return new StateVector(r.x, r.y, r.z, v.x, v.y, v.z, time3);
}
__name(CalcPluto, "CalcPluto");
var Rotation_JUP_EQJ = new RotationMatrix([
  [0.999432765338654, -0.0336771074697641, 0],
  [0.0303959428906285, 0.902057912352809, 0.430543388542295],
  [-0.0144994559663353, -0.430299169409101, 0.902569881273754]
]);
function HelioVector(body, date3) {
  var time3 = MakeTime(date3);
  if (body in vsop)
    return CalcVsop(vsop[body], time3);
  if (body === Body.Pluto) {
    const p = CalcPluto(time3, true);
    return new Vector(p.x, p.y, p.z, time3);
  }
  if (body === Body.Sun)
    return new Vector(0, 0, 0, time3);
  if (body === Body.Moon) {
    var e = CalcVsop(vsop.Earth, time3);
    var m = GeoMoon(time3);
    return new Vector(e.x + m.x, e.y + m.y, e.z + m.z, time3);
  }
  if (body === Body.EMB) {
    const e2 = CalcVsop(vsop.Earth, time3);
    const m2 = GeoMoon(time3);
    const denom = 1 + EARTH_MOON_MASS_RATIO;
    return new Vector(e2.x + m2.x / denom, e2.y + m2.y / denom, e2.z + m2.z / denom, time3);
  }
  if (body === Body.SSB)
    return CalcSolarSystemBarycenter(time3);
  const star = UserDefinedStar(body);
  if (star) {
    const sphere = new Spherical(star.dec, 15 * star.ra, star.dist);
    return VectorFromSphere(sphere, time3);
  }
  throw `HelioVector: Unknown body "${body}"`;
}
__name(HelioVector, "HelioVector");
function CorrectLightTravel(func, time3) {
  let ltime = time3;
  let dt = 0;
  for (let iter = 0; iter < 10; ++iter) {
    const pos = func(ltime);
    const lt = pos.Length() / C_AUDAY;
    if (lt > 1)
      throw `Object is too distant for light-travel solver.`;
    const ltime2 = time3.AddDays(-lt);
    dt = Math.abs(ltime2.tt - ltime.tt);
    if (dt < 1e-9)
      return pos;
    ltime = ltime2;
  }
  throw `Light-travel time solver did not converge: dt = ${dt}`;
}
__name(CorrectLightTravel, "CorrectLightTravel");
var BodyPosition = class {
  static {
    __name(this, "BodyPosition");
  }
  constructor(observerBody, targetBody, aberration, observerPos) {
    this.observerBody = observerBody;
    this.targetBody = targetBody;
    this.aberration = aberration;
    this.observerPos = observerPos;
  }
  Position(time3) {
    if (this.aberration) {
      this.observerPos = HelioVector(this.observerBody, time3);
    } else {
    }
    const targetPos = HelioVector(this.targetBody, time3);
    return new Vector(targetPos.x - this.observerPos.x, targetPos.y - this.observerPos.y, targetPos.z - this.observerPos.z, time3);
  }
};
function BackdatePosition(date3, observerBody, targetBody, aberration) {
  VerifyBoolean(aberration);
  const time3 = MakeTime(date3);
  if (UserDefinedStar(targetBody)) {
    const tvec = HelioVector(targetBody, time3);
    if (aberration) {
      const ostate = HelioState(observerBody, time3);
      const rvec = new Vector(tvec.x - ostate.x, tvec.y - ostate.y, tvec.z - ostate.z, time3);
      const s = C_AUDAY / rvec.Length();
      return new Vector(rvec.x + ostate.vx / s, rvec.y + ostate.vy / s, rvec.z + ostate.vz / s, time3);
    }
    const ovec = HelioVector(observerBody, time3);
    return new Vector(tvec.x - ovec.x, tvec.y - ovec.y, tvec.z - ovec.z, time3);
  }
  let observerPos;
  if (aberration) {
    observerPos = new Vector(0, 0, 0, time3);
  } else {
    observerPos = HelioVector(observerBody, time3);
  }
  const bpos = new BodyPosition(observerBody, targetBody, aberration, observerPos);
  return CorrectLightTravel((t) => bpos.Position(t), time3);
}
__name(BackdatePosition, "BackdatePosition");
function GeoVector(body, date3, aberration) {
  VerifyBoolean(aberration);
  const time3 = MakeTime(date3);
  switch (body) {
    case Body.Earth:
      return new Vector(0, 0, 0, time3);
    case Body.Moon:
      return GeoMoon(time3);
    default:
      const vec = BackdatePosition(time3, Body.Earth, body, aberration);
      vec.t = time3;
      return vec;
  }
}
__name(GeoVector, "GeoVector");
function ExportState(terse, time3) {
  return new StateVector(terse.r.x, terse.r.y, terse.r.z, terse.v.x, terse.v.y, terse.v.z, time3);
}
__name(ExportState, "ExportState");
function HelioState(body, date3) {
  const time3 = MakeTime(date3);
  switch (body) {
    case Body.Sun:
      return new StateVector(0, 0, 0, 0, 0, 0, time3);
    case Body.SSB:
      const bary = new major_bodies_t(time3.tt);
      return new StateVector(-bary.Sun.r.x, -bary.Sun.r.y, -bary.Sun.r.z, -bary.Sun.v.x, -bary.Sun.v.y, -bary.Sun.v.z, time3);
    case Body.Mercury:
    case Body.Venus:
    case Body.Earth:
    case Body.Mars:
    case Body.Jupiter:
    case Body.Saturn:
    case Body.Uranus:
    case Body.Neptune:
      const planet = CalcVsopPosVel(vsop[body], time3.tt);
      return ExportState(planet, time3);
    case Body.Pluto:
      return CalcPluto(time3, true);
    case Body.Moon:
    case Body.EMB:
      const earth = CalcVsopPosVel(vsop.Earth, time3.tt);
      const state = body == Body.Moon ? GeoMoonState(time3) : GeoEmbState(time3);
      return new StateVector(state.x + earth.r.x, state.y + earth.r.y, state.z + earth.r.z, state.vx + earth.v.x, state.vy + earth.v.y, state.vz + earth.v.z, time3);
    default:
      if (UserDefinedStar(body)) {
        const vec = HelioVector(body, time3);
        return new StateVector(vec.x, vec.y, vec.z, 0, 0, 0, time3);
      }
      throw `HelioState: Unsupported body "${body}"`;
  }
}
__name(HelioState, "HelioState");
var ApsisKind;
(function(ApsisKind2) {
  ApsisKind2[ApsisKind2["Pericenter"] = 0] = "Pericenter";
  ApsisKind2[ApsisKind2["Apocenter"] = 1] = "Apocenter";
})(ApsisKind || (ApsisKind = {}));
function VectorFromSphere(sphere, time3) {
  time3 = MakeTime(time3);
  const radlat = sphere.lat * DEG2RAD;
  const radlon = sphere.lon * DEG2RAD;
  const rcoslat = sphere.dist * Math.cos(radlat);
  return new Vector(rcoslat * Math.cos(radlon), rcoslat * Math.sin(radlon), sphere.dist * Math.sin(radlat), time3);
}
__name(VectorFromSphere, "VectorFromSphere");
var EclipseKind;
(function(EclipseKind2) {
  EclipseKind2["Penumbral"] = "penumbral";
  EclipseKind2["Partial"] = "partial";
  EclipseKind2["Annular"] = "annular";
  EclipseKind2["Total"] = "total";
})(EclipseKind || (EclipseKind = {}));
var NodeEventKind;
(function(NodeEventKind2) {
  NodeEventKind2[NodeEventKind2["Invalid"] = 0] = "Invalid";
  NodeEventKind2[NodeEventKind2["Ascending"] = 1] = "Ascending";
  NodeEventKind2[NodeEventKind2["Descending"] = -1] = "Descending";
})(NodeEventKind || (NodeEventKind = {}));

// ../natal-engine/src/calculators/astronomy.js
var DEG_TO_RAD = Math.PI / 180;
var RAD_TO_DEG = 180 / Math.PI;
var OBLIQUITY = 23.4393;
function dateToJulianDay(year, month, day, hour = 0) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + hour / 24 + B - 1524.5;
  return JD;
}
__name(dateToJulianDay, "dateToJulianDay");
function julianCenturies(jd) {
  return (jd - 2451545) / 36525;
}
__name(julianCenturies, "julianCenturies");
function normalizeAngle(angle) {
  angle = angle % 360;
  if (angle < 0) angle += 360;
  return angle;
}
__name(normalizeAngle, "normalizeAngle");
function calculateGMST(jd) {
  const T = julianCenturies(jd);
  const T2 = T * T;
  const T3 = T2 * T;
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545) + 387933e-9 * T2 - T3 / 3871e4;
  return normalizeAngle(gmst);
}
__name(calculateGMST, "calculateGMST");
function calculateLST(jd, longitude) {
  const gmst = calculateGMST(jd);
  return normalizeAngle(gmst + longitude);
}
__name(calculateLST, "calculateLST");
function calculateAscendant(jd, latitude, longitude) {
  const RAMC = calculateLST(jd, longitude);
  const RAMC_rad = RAMC * DEG_TO_RAD;
  const latRad = latitude * DEG_TO_RAD;
  const oblRad = OBLIQUITY * DEG_TO_RAD;
  const y = Math.cos(RAMC_rad);
  const x = -(Math.sin(oblRad) * Math.tan(latRad) + Math.cos(oblRad) * Math.sin(RAMC_rad));
  let asc = Math.atan2(y, x) * RAD_TO_DEG;
  asc = normalizeAngle(asc);
  const mc = calculateMidheaven(jd, longitude);
  let diff = normalizeAngle(asc - mc);
  if (diff > 180) {
    asc = normalizeAngle(asc + 180);
  }
  return asc;
}
__name(calculateAscendant, "calculateAscendant");
function calculateMidheaven(jd, longitude) {
  const lst = calculateLST(jd, longitude);
  const lstRad = lst * DEG_TO_RAD;
  const oblRad = OBLIQUITY * DEG_TO_RAD;
  let mc = Math.atan2(Math.sin(lstRad), Math.cos(lstRad) * Math.cos(oblRad)) * RAD_TO_DEG;
  mc = normalizeAngle(mc);
  return mc;
}
__name(calculateMidheaven, "calculateMidheaven");
function getZodiacSign(longitude) {
  const signs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces"
  ];
  const index = Math.floor(longitude / 30) % 12;
  return signs[index];
}
__name(getZodiacSign, "getZodiacSign");
function formatDegree(longitude) {
  const withinSign = longitude % 30;
  const degrees = Math.floor(withinSign);
  const minutesFloat = (withinSign - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = Math.floor((minutesFloat - minutes) * 60);
  return `${degrees}\xB0${String(minutes).padStart(2, "0")}'${String(seconds).padStart(2, "0")}"`;
}
__name(formatDegree, "formatDegree");
function calculateBirthPositions(year, month, day, hour = 12, timezone = 0, latitude = null, longitude = null, options = {}) {
  const utHour = hour - timezone;
  let adjYear = year;
  let adjMonth = month;
  let adjDay = day;
  let adjHour = utHour;
  if (utHour < 0) {
    adjHour += 24;
    adjDay -= 1;
    if (adjDay < 1) {
      adjMonth -= 1;
      if (adjMonth < 1) {
        adjMonth = 12;
        adjYear -= 1;
      }
      adjDay = new Date(adjYear, adjMonth, 0).getDate();
    }
  } else if (utHour >= 24) {
    adjHour -= 24;
    adjDay += 1;
    const daysInMonth = new Date(adjYear, adjMonth, 0).getDate();
    if (adjDay > daysInMonth) {
      adjDay = 1;
      adjMonth += 1;
      if (adjMonth > 12) {
        adjMonth = 1;
        adjYear += 1;
      }
    }
  }
  const date3 = new Date(Date.UTC(adjYear, adjMonth - 1, adjDay, Math.floor(adjHour), adjHour % 1 * 60));
  const jd = dateToJulianDay(adjYear, adjMonth, adjDay, adjHour);
  const sunVec = GeoVector("Sun", date3, true);
  const sunEcl = Ecliptic(sunVec);
  const moonVec = GeoVector("Moon", date3, true);
  const moonEcl = Ecliptic(moonVec);
  const mercuryVec = GeoVector("Mercury", date3, true);
  const mercuryEcl = Ecliptic(mercuryVec);
  const venusVec = GeoVector("Venus", date3, true);
  const venusEcl = Ecliptic(venusVec);
  const marsVec = GeoVector("Mars", date3, true);
  const marsEcl = Ecliptic(marsVec);
  const jupiterVec = GeoVector("Jupiter", date3, true);
  const jupiterEcl = Ecliptic(jupiterVec);
  const saturnVec = GeoVector("Saturn", date3, true);
  const saturnEcl = Ecliptic(saturnVec);
  const uranusVec = GeoVector("Uranus", date3, true);
  const uranusEcl = Ecliptic(uranusVec);
  const neptuneVec = GeoVector("Neptune", date3, true);
  const neptuneEcl = Ecliptic(neptuneVec);
  const plutoVec = GeoVector("Pluto", date3, true);
  const plutoEcl = Ecliptic(plutoVec);
  const T = julianCenturies(jd);
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;
  const meanNode = normalizeAngle(125.0445479 - 1934.1362891 * T + 20754e-7 * T2 + T3 / 467441 - T4 / 60616e3);
  const D = normalizeAngle(297.8501921 + 445267.1114034 * T - 18819e-7 * T2 + T3 / 545868 - T4 / 113065e3);
  const M = normalizeAngle(357.5291092 + 35999.0502909 * T - 1536e-7 * T2 + T3 / 2449e4);
  const Mprime = normalizeAngle(134.9633964 + 477198.8675055 * T + 87414e-7 * T2 + T3 / 69699 - T4 / 14712e3);
  const F = normalizeAngle(93.272095 + 483202.0175233 * T - 36539e-7 * T2 - T3 / 3526e3 + T4 / 86331e4);
  const D_rad = D * DEG_TO_RAD;
  const M_rad = M * DEG_TO_RAD;
  const Mprime_rad = Mprime * DEG_TO_RAD;
  const F_rad = F * DEG_TO_RAD;
  let nodeCorrection = 0;
  nodeCorrection += -1.4979 * Math.sin(2 * (D_rad - F_rad));
  nodeCorrection += -0.15 * Math.sin(M_rad);
  nodeCorrection += -0.1226 * Math.sin(2 * D_rad);
  nodeCorrection += 0.1176 * Math.sin(2 * F_rad);
  nodeCorrection += -0.0801 * Math.sin(2 * (Mprime_rad - F_rad));
  const useMeanNode = options.nodeType === "mean";
  const northNodeLong = normalizeAngle(useMeanNode ? meanNode : meanNode + nodeCorrection);
  const southNodeLong = normalizeAngle(northNodeLong + 180);
  const earthLong = normalizeAngle(sunEcl.elon + 180);
  const result = {
    julianDay: jd,
    nodeType: useMeanNode ? "mean" : "true",
    sun: {
      longitude: sunEcl.elon,
      latitude: sunEcl.elat,
      sign: getZodiacSign(sunEcl.elon),
      degree: formatDegree(sunEcl.elon)
    },
    earth: {
      longitude: earthLong,
      sign: getZodiacSign(earthLong),
      degree: formatDegree(earthLong)
    },
    moon: {
      longitude: moonEcl.elon,
      latitude: moonEcl.elat,
      sign: getZodiacSign(moonEcl.elon),
      degree: formatDegree(moonEcl.elon)
    },
    mercury: {
      longitude: mercuryEcl.elon,
      sign: getZodiacSign(mercuryEcl.elon),
      degree: formatDegree(mercuryEcl.elon)
    },
    venus: {
      longitude: venusEcl.elon,
      sign: getZodiacSign(venusEcl.elon),
      degree: formatDegree(venusEcl.elon)
    },
    mars: {
      longitude: marsEcl.elon,
      sign: getZodiacSign(marsEcl.elon),
      degree: formatDegree(marsEcl.elon)
    },
    jupiter: {
      longitude: jupiterEcl.elon,
      sign: getZodiacSign(jupiterEcl.elon),
      degree: formatDegree(jupiterEcl.elon)
    },
    saturn: {
      longitude: saturnEcl.elon,
      sign: getZodiacSign(saturnEcl.elon),
      degree: formatDegree(saturnEcl.elon)
    },
    uranus: {
      longitude: uranusEcl.elon,
      sign: getZodiacSign(uranusEcl.elon),
      degree: formatDegree(uranusEcl.elon)
    },
    neptune: {
      longitude: neptuneEcl.elon,
      sign: getZodiacSign(neptuneEcl.elon),
      degree: formatDegree(neptuneEcl.elon)
    },
    pluto: {
      longitude: plutoEcl.elon,
      sign: getZodiacSign(plutoEcl.elon),
      degree: formatDegree(plutoEcl.elon)
    },
    northNode: {
      longitude: northNodeLong,
      sign: getZodiacSign(northNodeLong),
      degree: formatDegree(northNodeLong)
    },
    southNode: {
      longitude: southNodeLong,
      sign: getZodiacSign(southNodeLong),
      degree: formatDegree(southNodeLong)
    }
  };
  if (latitude !== null && longitude !== null) {
    const asc = calculateAscendant(jd, latitude, longitude);
    const mc = calculateMidheaven(jd, longitude);
    result.ascendant = {
      longitude: asc,
      sign: getZodiacSign(asc),
      degree: formatDegree(asc)
    };
    result.midheaven = {
      longitude: mc,
      sign: getZodiacSign(mc),
      degree: formatDegree(mc)
    };
  }
  return result;
}
__name(calculateBirthPositions, "calculateBirthPositions");

// ../natal-engine/src/calculators/astrology.js
var ZODIAC_SIGNS = [
  {
    name: "Aries",
    symbol: "\u2648",
    element: "Fire",
    modality: "Cardinal",
    ruler: "Mars",
    startMonth: 3,
    startDay: 21,
    endMonth: 4,
    endDay: 19,
    traits: "Bold, ambitious, pioneering, energetic",
    shadow: "Impatient, impulsive, aggressive"
  },
  {
    name: "Taurus",
    symbol: "\u2649",
    element: "Earth",
    modality: "Fixed",
    ruler: "Venus",
    startMonth: 4,
    startDay: 20,
    endMonth: 5,
    endDay: 20,
    traits: "Reliable, patient, practical, sensual",
    shadow: "Stubborn, possessive, materialistic"
  },
  {
    name: "Gemini",
    symbol: "\u264A",
    element: "Air",
    modality: "Mutable",
    ruler: "Mercury",
    startMonth: 5,
    startDay: 21,
    endMonth: 6,
    endDay: 20,
    traits: "Curious, adaptable, communicative, witty",
    shadow: "Scattered, superficial, inconsistent"
  },
  {
    name: "Cancer",
    symbol: "\u264B",
    element: "Water",
    modality: "Cardinal",
    ruler: "Moon",
    startMonth: 6,
    startDay: 21,
    endMonth: 7,
    endDay: 22,
    traits: "Nurturing, intuitive, protective, emotional",
    shadow: "Moody, clingy, oversensitive"
  },
  {
    name: "Leo",
    symbol: "\u264C",
    element: "Fire",
    modality: "Fixed",
    ruler: "Sun",
    startMonth: 7,
    startDay: 23,
    endMonth: 8,
    endDay: 22,
    traits: "Creative, generous, warm, confident",
    shadow: "Arrogant, dramatic, attention-seeking"
  },
  {
    name: "Virgo",
    symbol: "\u264D",
    element: "Earth",
    modality: "Mutable",
    ruler: "Mercury",
    startMonth: 8,
    startDay: 23,
    endMonth: 9,
    endDay: 22,
    traits: "Analytical, practical, helpful, precise",
    shadow: "Critical, anxious, perfectionist"
  },
  {
    name: "Libra",
    symbol: "\u264E",
    element: "Air",
    modality: "Cardinal",
    ruler: "Venus",
    startMonth: 9,
    startDay: 23,
    endMonth: 10,
    endDay: 22,
    traits: "Diplomatic, fair, harmonious, social",
    shadow: "Indecisive, people-pleasing, avoidant"
  },
  {
    name: "Scorpio",
    symbol: "\u264F",
    element: "Water",
    modality: "Fixed",
    ruler: "Pluto/Mars",
    startMonth: 10,
    startDay: 23,
    endMonth: 11,
    endDay: 21,
    traits: "Intense, passionate, transformative, perceptive",
    shadow: "Jealous, secretive, vengeful"
  },
  {
    name: "Sagittarius",
    symbol: "\u2650",
    element: "Fire",
    modality: "Mutable",
    ruler: "Jupiter",
    startMonth: 11,
    startDay: 22,
    endMonth: 12,
    endDay: 21,
    traits: "Adventurous, optimistic, philosophical, free",
    shadow: "Reckless, preachy, commitment-phobic"
  },
  {
    name: "Capricorn",
    symbol: "\u2651",
    element: "Earth",
    modality: "Cardinal",
    ruler: "Saturn",
    startMonth: 12,
    startDay: 22,
    endMonth: 1,
    endDay: 19,
    traits: "Ambitious, disciplined, responsible, patient",
    shadow: "Cold, rigid, workaholic"
  },
  {
    name: "Aquarius",
    symbol: "\u2652",
    element: "Air",
    modality: "Fixed",
    ruler: "Uranus/Saturn",
    startMonth: 1,
    startDay: 20,
    endMonth: 2,
    endDay: 18,
    traits: "Innovative, humanitarian, independent, original",
    shadow: "Detached, rebellious, aloof"
  },
  {
    name: "Pisces",
    symbol: "\u2653",
    element: "Water",
    modality: "Mutable",
    ruler: "Neptune/Jupiter",
    startMonth: 2,
    startDay: 19,
    endMonth: 3,
    endDay: 20,
    traits: "Intuitive, compassionate, artistic, dreamy",
    shadow: "Escapist, victim mentality, boundary issues"
  }
];
var ELEMENTS = {
  Fire: { signs: ["Aries", "Leo", "Sagittarius"], traits: "Passionate, dynamic, energetic, inspiring" },
  Earth: { signs: ["Taurus", "Virgo", "Capricorn"], traits: "Practical, grounded, reliable, sensual" },
  Air: { signs: ["Gemini", "Libra", "Aquarius"], traits: "Intellectual, communicative, social, ideas-oriented" },
  Water: { signs: ["Cancer", "Scorpio", "Pisces"], traits: "Emotional, intuitive, deep, nurturing" }
};
var MODALITIES = {
  Cardinal: { signs: ["Aries", "Cancer", "Libra", "Capricorn"], traits: "Initiating, leading, starting new things" },
  Fixed: { signs: ["Taurus", "Leo", "Scorpio", "Aquarius"], traits: "Stabilizing, persevering, determined" },
  Mutable: { signs: ["Gemini", "Virgo", "Sagittarius", "Pisces"], traits: "Adapting, flexible, changing" }
};
var ASPECTS = {
  conjunction: { angle: 0, orb: 8, symbol: "\u260C", nature: "major", meaning: "Fusion, intensity, focus" },
  sextile: { angle: 60, orb: 6, symbol: "\u26B9", nature: "major", meaning: "Opportunity, harmony, ease" },
  square: { angle: 90, orb: 8, symbol: "\u25A1", nature: "major", meaning: "Tension, challenge, action" },
  trine: { angle: 120, orb: 8, symbol: "\u25B3", nature: "major", meaning: "Flow, talent, ease" },
  opposition: { angle: 180, orb: 8, symbol: "\u260D", nature: "major", meaning: "Polarity, awareness, balance" },
  quincunx: { angle: 150, orb: 3, symbol: "\u26BB", nature: "minor", meaning: "Adjustment, irritation, growth" },
  semisextile: { angle: 30, orb: 2, symbol: "\u26BA", nature: "minor", meaning: "Subtle opportunity, mild tension" },
  semisquare: { angle: 45, orb: 2, symbol: "\u2220", nature: "minor", meaning: "Friction, minor tension" },
  sesquiquadrate: { angle: 135, orb: 2, symbol: "\u26BC", nature: "minor", meaning: "Agitation, persistent challenge" },
  quintile: { angle: 72, orb: 2, symbol: "Q", nature: "minor", meaning: "Creativity, talent, gifts" },
  biquintile: { angle: 144, orb: 2, symbol: "bQ", nature: "minor", meaning: "Creative expression, special ability" }
};
var PLANET_SYMBOLS = {
  sun: "\u2609",
  moon: "\u263D",
  mercury: "\u263F",
  venus: "\u2640",
  mars: "\u2642",
  jupiter: "\u2643",
  saturn: "\u2644",
  uranus: "\u26E2",
  neptune: "\u2646",
  pluto: "\u2647",
  northNode: "\u260A",
  southNode: "\u260B",
  ascendant: "Asc",
  midheaven: "MC"
};
function angularDifference(long1, long2) {
  let diff = Math.abs(long1 - long2);
  if (diff > 180) diff = 360 - diff;
  return diff;
}
__name(angularDifference, "angularDifference");
function findAspect(planet1Name, planet1Long, planet2Name, planet2Long, includeMinor = true) {
  const diff = angularDifference(planet1Long, planet2Long);
  for (const [aspectName, aspect] of Object.entries(ASPECTS)) {
    if (!includeMinor && aspect.nature === "minor") continue;
    const orb = Math.abs(diff - aspect.angle);
    if (orb <= aspect.orb) {
      const applying = planet1Long < planet2Long;
      return {
        planet1: planet1Name,
        planet2: planet2Name,
        aspect: aspectName,
        symbol: aspect.symbol,
        angle: aspect.angle,
        orb: Math.round(orb * 100) / 100,
        exactOrb: `${orb.toFixed(2)}\xB0`,
        nature: aspect.nature,
        meaning: aspect.meaning,
        applying
      };
    }
  }
  return null;
}
__name(findAspect, "findAspect");
function calculateAspects(positions, includeMinor = true) {
  const aspects = [];
  const points = [];
  const planetNames = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"];
  for (const name of planetNames) {
    if (positions[name]) {
      points.push({ name, longitude: positions[name].longitude, symbol: PLANET_SYMBOLS[name] });
    }
  }
  if (positions.northNode) {
    points.push({ name: "northNode", longitude: positions.northNode.longitude, symbol: PLANET_SYMBOLS.northNode });
  }
  if (positions.ascendant) {
    points.push({ name: "ascendant", longitude: positions.ascendant.longitude, symbol: PLANET_SYMBOLS.ascendant });
  }
  if (positions.midheaven) {
    points.push({ name: "midheaven", longitude: positions.midheaven.longitude, symbol: PLANET_SYMBOLS.midheaven });
  }
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const aspect = findAspect(
        points[i].name,
        points[i].longitude,
        points[j].name,
        points[j].longitude,
        includeMinor
      );
      if (aspect) {
        aspect.planet1Symbol = points[i].symbol;
        aspect.planet2Symbol = points[j].symbol;
        aspects.push(aspect);
      }
    }
  }
  aspects.sort((a, b) => a.orb - b.orb);
  return aspects;
}
__name(calculateAspects, "calculateAspects");
function calculateSunSign(birthDate) {
  const { month, day } = parseDateComponents(birthDate);
  for (const sign of ZODIAC_SIGNS) {
    if (sign.name === "Capricorn") {
      if (month === 12 && day >= 22 || month === 1 && day <= 19) {
        return sign;
      }
    } else {
      if (month === sign.startMonth && day >= sign.startDay || month === sign.endMonth && day <= sign.endDay) {
        return sign;
      }
    }
  }
  return ZODIAC_SIGNS[0];
}
__name(calculateSunSign, "calculateSunSign");
function approximateRisingSign(birthDate, birthHour, sunSign) {
  const sunriseHour = 6;
  const hoursFromSunrise = (birthHour - sunriseHour + 24) % 24;
  const signOffset = Math.floor(hoursFromSunrise / 2);
  const sunSignIndex = ZODIAC_SIGNS.findIndex((s) => s.name === sunSign.name);
  const risingIndex = (sunSignIndex + signOffset) % 12;
  return {
    sign: ZODIAC_SIGNS[risingIndex],
    note: "Approximate - for precise rising sign, birth location required"
  };
}
__name(approximateRisingSign, "approximateRisingSign");
function calculateBalance(sunSign, moonSign, risingSign) {
  const signs = [sunSign, moonSign?.sign, risingSign?.sign].filter(Boolean);
  const elementCount = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  const modalityCount = { Cardinal: 0, Fixed: 0, Mutable: 0 };
  for (const sign of signs) {
    elementCount[sign.element]++;
    modalityCount[sign.modality]++;
  }
  let dominantElement = "Fire";
  let dominantModality = "Cardinal";
  let maxElement = 0;
  let maxModality = 0;
  for (const [element, count] of Object.entries(elementCount)) {
    if (count > maxElement) {
      maxElement = count;
      dominantElement = element;
    }
  }
  for (const [modality, count] of Object.entries(modalityCount)) {
    if (count > maxModality) {
      maxModality = count;
      dominantModality = modality;
    }
  }
  return {
    elements: elementCount,
    modalities: modalityCount,
    dominantElement: { name: dominantElement, ...ELEMENTS[dominantElement] },
    dominantModality: { name: dominantModality, ...MODALITIES[dominantModality] }
  };
}
__name(calculateBalance, "calculateBalance");
function calculateAstrology(birthDate, birthHour = 12, timezone = 0, latitude = null, longitude = null) {
  const { year, month, day } = parseDateComponents(birthDate);
  const positions = calculateBirthPositions(year, month, day, birthHour, timezone, latitude, longitude);
  const getZodiacInfo = /* @__PURE__ */ __name((signName) => ZODIAC_SIGNS.find((s) => s.name === signName), "getZodiacInfo");
  const sunSign = getZodiacInfo(positions.sun.sign) || calculateSunSign(birthDate);
  const moonZodiac = getZodiacInfo(positions.moon.sign);
  const moonSign = {
    sign: moonZodiac,
    degree: positions.moon.degree,
    longitude: positions.moon.longitude,
    note: "Calculated using Meeus algorithms",
    warning: false
  };
  let risingSign;
  if (positions.ascendant) {
    const ascZodiac = getZodiacInfo(positions.ascendant.sign);
    risingSign = {
      sign: ascZodiac,
      degree: positions.ascendant.degree,
      longitude: positions.ascendant.longitude,
      note: "Calculated from sidereal time and birth location",
      accurate: true
    };
  } else {
    risingSign = approximateRisingSign(birthDate, birthHour, sunSign);
    risingSign.note = "Approximate - birth location needed for accuracy";
    risingSign.accurate = false;
  }
  const balance = calculateBalance(sunSign, moonSign.sign, risingSign.sign);
  const planets = {
    mercury: {
      sign: getZodiacInfo(positions.mercury.sign),
      degree: positions.mercury.degree,
      longitude: positions.mercury.longitude,
      meaning: "Communication, thinking, learning style"
    },
    venus: {
      sign: getZodiacInfo(positions.venus.sign),
      degree: positions.venus.degree,
      longitude: positions.venus.longitude,
      meaning: "Love, beauty, values, pleasure"
    },
    mars: {
      sign: getZodiacInfo(positions.mars.sign),
      degree: positions.mars.degree,
      longitude: positions.mars.longitude,
      meaning: "Action, drive, passion, energy"
    },
    jupiter: {
      sign: getZodiacInfo(positions.jupiter.sign),
      degree: positions.jupiter.degree,
      longitude: positions.jupiter.longitude,
      meaning: "Growth, expansion, luck, wisdom"
    },
    saturn: {
      sign: getZodiacInfo(positions.saturn.sign),
      degree: positions.saturn.degree,
      longitude: positions.saturn.longitude,
      meaning: "Discipline, structure, lessons, limits"
    },
    uranus: {
      sign: getZodiacInfo(positions.uranus.sign),
      degree: positions.uranus.degree,
      longitude: positions.uranus.longitude,
      meaning: "Innovation, rebellion, sudden change"
    },
    neptune: {
      sign: getZodiacInfo(positions.neptune.sign),
      degree: positions.neptune.degree,
      longitude: positions.neptune.longitude,
      meaning: "Dreams, intuition, spirituality, illusion"
    },
    pluto: {
      sign: getZodiacInfo(positions.pluto.sign),
      degree: positions.pluto.degree,
      longitude: positions.pluto.longitude,
      meaning: "Transformation, power, death/rebirth"
    }
  };
  const nodes = {
    north: {
      sign: getZodiacInfo(positions.northNode.sign),
      degree: positions.northNode.degree,
      longitude: positions.northNode.longitude,
      meaning: "Soul purpose, destiny, growth direction"
    },
    south: {
      sign: getZodiacInfo(positions.southNode.sign),
      degree: positions.southNode.degree,
      longitude: positions.southNode.longitude,
      meaning: "Past life gifts, comfort zone, release"
    }
  };
  let midheaven = null;
  if (positions.midheaven) {
    midheaven = {
      sign: getZodiacInfo(positions.midheaven.sign),
      degree: positions.midheaven.degree,
      longitude: positions.midheaven.longitude,
      meaning: "Career, public image, life direction"
    };
  }
  const aspects = calculateAspects(positions, true);
  const majorAspects = aspects.filter((a) => a.nature === "major");
  return {
    sun: {
      sign: sunSign,
      degree: positions.sun.degree,
      longitude: positions.sun.longitude,
      meaning: "Your core identity, ego, and life force"
    },
    moon: {
      ...moonSign,
      meaning: "Your emotional nature, instincts, and inner self"
    },
    rising: {
      ...risingSign,
      meaning: "Your outward persona, first impressions, and physical appearance"
    },
    planets,
    nodes,
    midheaven,
    aspects: majorAspects,
    allAspects: aspects,
    balance,
    bigThree: `${sunSign.symbol} ${sunSign.name} Sun, ${moonSign.sign.symbol} ${moonSign.sign.name} Moon, ${risingSign.sign.symbol} ${risingSign.sign.name} Rising`,
    summary: `You are a ${sunSign.name} with ${moonSign.sign.name} Moon and ${risingSign.sign.name} Rising`,
    useEphemeris: true,
    // We're using accurate calculations now
    julianDay: positions.julianDay,
    hasLocation: latitude !== null && longitude !== null,
    note: "Calculated using Meeus Astronomical Algorithms"
  };
}
__name(calculateAstrology, "calculateAstrology");
var astrology_default = calculateAstrology;

// ../natal-engine/src/calculators/humandesign.js
init_modules_watch_stub();

// ../natal-engine/src/data/incarnation-crosses.js
init_modules_watch_stub();
function getAngleFromProfile(profile) {
  const rightAngleProfiles = ["1/3", "1/4", "2/4", "2/5", "3/5", "3/6", "4/6"];
  const leftAngleProfiles = ["5/1", "5/2", "6/2", "6/3"];
  const juxtapositionProfile = "4/1";
  if (profile === juxtapositionProfile) return "juxtaposition";
  if (leftAngleProfiles.includes(profile)) return "left";
  if (rightAngleProfiles.includes(profile)) return "right";
  return "right";
}
__name(getAngleFromProfile, "getAngleFromProfile");
var INCARNATION_CROSSES = {
  1: ["The Sphinx", "Self-Expression", "Defiance"],
  2: ["The Sphinx", "The Driver", "Defiance"],
  3: ["Laws", "Mutation", "Wishes"],
  4: ["Explanation", "Formulization", "Revolution"],
  5: ["Consciousness", "Habits", "Separation"],
  6: ["Eden", "Conflict", "The Plane"],
  7: ["The Sphinx", "Interaction", "The Masks"],
  8: ["Contagion", "Contribution", "Uncertainty"],
  9: ["Planning", "Focus", "Identification"],
  10: ["The Vessel of Love", "Behavior", "Prevention"],
  11: ["Eden", "Ideas", "Education"],
  12: ["Eden", "Articulation", "Education"],
  13: ["The Sphinx", "Listening", "The Masks"],
  14: ["Contagion", "Empowering", "Uncertainty"],
  15: ["The Vessel of Love", "Extremes", "Prevention"],
  16: ["Planning", "Experimentation", "Identification"],
  17: ["Service", "Opinions", "Upheaval"],
  18: ["Service", "Correction", "Upheaval"],
  19: ["The Four Ways", "Need", "Refinement"],
  20: ["The Sleeping Phoenix", "The Now", "Duality"],
  21: ["Tension", "Control", "Endeavor"],
  22: ["Rulership", "Grace", "Informing"],
  23: ["Explanation", "Assimilation", "Dedication"],
  24: ["The Four Ways", "Rationalization", "Incarnation"],
  25: ["The Vessel of Love", "Innocence", "Healing"],
  26: ["Rulership", "The Trickster", "Confrontation"],
  27: ["The Unexpected", "Caring", "Alignment"],
  28: ["The Unexpected", "Risks", "Alignment"],
  29: ["Contagion", "Commitment", "Industry"],
  30: ["Contagion", "Fates", "Industry"],
  31: ["The Unexpected", "Influence", "The Alpha"],
  32: ["Maya", "Conservation", "Limitation"],
  33: ["The Four Ways", "Retreat", "Refinement"],
  34: ["The Sleeping Phoenix", "Power", "Duality"],
  35: ["Consciousness", "Experience", "Separation"],
  36: ["Eden", "Crisis", "The Plane"],
  37: ["Planning", "Bargains", "Migration"],
  38: ["Tension", "Opposition", "Individualism"],
  39: ["Tension", "Provocation", "Individualism"],
  40: ["Planning", "Denial", "Migration"],
  41: ["The Unexpected", "Fantasy", "The Alpha"],
  42: ["Maya", "Completion", "Limitation"],
  43: ["Explanation", "Insight", "Dedication"],
  44: ["The Four Ways", "Alertness", "Incarnation"],
  45: ["Rulership", "Possession", "Confrontation"],
  46: ["The Vessel of Love", "Serendipity", "Healing"],
  47: ["Rulership", "Oppression", "Informing"],
  48: ["Tension", "Depth", "Endeavor"],
  49: ["Explanation", "Principles", "Revolution"],
  50: ["Laws", "Values", "Wishes"],
  51: ["Penetration", "Shock", "The Clarion"],
  52: ["Service", "Stillness", "Demands"],
  53: ["Penetration", "Beginnings", "Cycles"],
  54: ["Penetration", "Ambition", "Cycles"],
  55: ["The Sleeping Phoenix", "Moods", "Spirit"],
  56: ["Laws", "Stimulation", "Distraction"],
  57: ["Penetration", "Intuition", "The Clarion"],
  58: ["Service", "Vitality", "Demands"],
  59: ["The Sleeping Phoenix", "Strategy", "Spirit"],
  60: ["Laws", "Limitation", "Distraction"],
  61: ["Maya", "Thinking", "Obscuration"],
  62: ["Maya", "Details", "Obscuration"],
  63: ["Consciousness", "Doubts", "Dominion"],
  64: ["Consciousness", "Confusion", "Dominion"]
};
function getIncarnationCross(personalitySunGate, profile, gates = null) {
  const angle = getAngleFromProfile(profile);
  const crossNames = INCARNATION_CROSSES[personalitySunGate];
  if (!crossNames) {
    return {
      angle,
      name: "Unknown Cross",
      fullName: "Unknown Incarnation Cross"
    };
  }
  let name;
  let prefix;
  switch (angle) {
    case "right":
      name = crossNames[0];
      prefix = "Right Angle Cross of";
      break;
    case "juxtaposition":
      name = crossNames[1];
      prefix = "Juxtaposition Cross of";
      break;
    case "left":
      name = crossNames[2];
      prefix = "Left Angle Cross of";
      break;
    default:
      name = crossNames[0];
      prefix = "Cross of";
  }
  const displayName = name.startsWith("The ") ? "the " + name.slice(4) : name;
  const quartet = gates && gates.length === 4 ? ` (${gates[0]}/${gates[1]} | ${gates[2]}/${gates[3]})` : "";
  return {
    angle,
    angleName: angle === "right" ? "Right Angle" : angle === "left" ? "Left Angle" : "Juxtaposition",
    name,
    fullName: `${prefix} ${displayName}${quartet}`
  };
}
__name(getIncarnationCross, "getIncarnationCross");

// ../natal-engine/src/calculators/humandesign.js
var CENTERS = {
  head: {
    name: "Head",
    theme: "Inspiration",
    biological: "Pineal gland",
    pressure: "Mental pressure to answer questions",
    motor: false,
    notSelfTheme: "Trying to answer everyone else's questions",
    notSelfQuestion: "Am I trying to answer questions that don't matter to me?",
    definedMeaning: "Consistent access to inspiration and mental pressure. You inspire others with your questions.",
    undefinedMeaning: "Amplify others' mental pressure. Can become overwhelmed by questions that aren't yours.",
    openMeaning: "Completely open to all forms of inspiration. Deeply impressionable by others' mental pressure."
  },
  ajna: {
    name: "Ajna",
    theme: "Conceptualization",
    biological: "Pituitary",
    pressure: "Mental awareness and processing",
    motor: false,
    notSelfTheme: "Pretending to be certain about things",
    notSelfQuestion: "Am I trying to convince everyone that I am certain?",
    definedMeaning: "Consistent way of processing and conceptualizing. You have a reliable mental framework.",
    undefinedMeaning: "Flexible thinker who can see all perspectives. May feel pressure to have fixed opinions.",
    openMeaning: "Completely open-minded. Can process information in any way but may struggle with mental certainty."
  },
  throat: {
    name: "Throat",
    theme: "Manifestation",
    biological: "Thyroid",
    pressure: "Communication and action",
    motor: false,
    notSelfTheme: "Trying to attract attention",
    notSelfQuestion: "Am I trying to attract attention or be heard?",
    definedMeaning: "Consistent voice and way of expressing. You can reliably communicate and manifest.",
    undefinedMeaning: "Flexible communicator. May feel pressure to speak or act to get noticed.",
    openMeaning: "Can channel any form of expression. Deeply sensitive to timing of speech and action."
  },
  g: {
    name: "G Center",
    theme: "Identity",
    biological: "Liver/Blood",
    pressure: "Love, direction, identity",
    motor: false,
    notSelfTheme: "Searching for love and direction",
    notSelfQuestion: "Am I trying to find love, identity, or direction?",
    definedMeaning: "Fixed sense of identity and direction. You know who you are and where you're going.",
    undefinedMeaning: "Chameleon identity that adapts to environment. Can become wise about love and direction.",
    openMeaning: "Completely open to all forms of identity. Place and people strongly determine your experience."
  },
  heart: {
    name: "Heart/Ego",
    theme: "Willpower",
    biological: "Heart/Stomach",
    pressure: "Material world, ego, willpower",
    motor: true,
    notSelfTheme: "Trying to prove your worth",
    notSelfQuestion: "Am I trying to prove myself or make promises I can't keep?",
    definedMeaning: "Consistent willpower and self-worth. Can make and keep promises reliably.",
    undefinedMeaning: "Amplify others' willpower. May over-commit trying to prove worth. Rest the heart.",
    openMeaning: "No fixed sense of material value. Can become wise about worth but must avoid proving anything."
  },
  sacral: {
    name: "Sacral",
    theme: "Life Force",
    biological: "Ovaries/Testes",
    pressure: "Vital energy, sexuality, work",
    motor: true,
    notSelfTheme: "Not knowing when enough is enough",
    notSelfQuestion: "Do I know when enough is enough?",
    definedMeaning: "Sustainable life force energy. Can work consistently when responding to what you love.",
    undefinedMeaning: "Amplify others' sacral energy. May overwork. Need to know when to stop and rest.",
    openMeaning: "No fixed life force. Deeply sensitive to others' energy. Must protect against burnout."
  },
  spleen: {
    name: "Spleen",
    theme: "Intuition",
    biological: "Spleen/Lymph",
    pressure: "Survival, health, intuition",
    motor: false,
    notSelfTheme: "Holding on to what isn't healthy",
    notSelfQuestion: "Am I holding on to things, people, or habits that aren't good for me?",
    definedMeaning: "Consistent intuitive awareness and immune system. You have reliable instincts.",
    undefinedMeaning: "Amplify others' fears and intuitions. May hold on to unhealthy situations out of fear.",
    openMeaning: "No fixed immune or intuitive pattern. Can become deeply wise about health and survival."
  },
  solar: {
    name: "Solar Plexus",
    theme: "Emotion",
    biological: "Kidneys/Pancreas",
    pressure: "Emotional wave, feelings",
    motor: true,
    notSelfTheme: "Avoiding truth and confrontation to keep the peace",
    notSelfQuestion: "Am I avoiding truth and confrontation?",
    definedMeaning: "Consistent emotional wave. You experience life through feelings that move in cycles.",
    undefinedMeaning: "Amplify others' emotions. May avoid conflict. Can become wise about emotional truth.",
    openMeaning: "No fixed emotional pattern. Deeply empathic. Must learn emotions felt are often not your own."
  },
  root: {
    name: "Root",
    theme: "Pressure",
    biological: "Adrenals",
    pressure: "Stress, adrenaline, drive",
    motor: true,
    notSelfTheme: "Being in a hurry to be free of pressure",
    notSelfQuestion: "Am I in a hurry to get things done just to relieve pressure?",
    definedMeaning: "Consistent adrenal pressure. You handle stress in your own reliable way.",
    undefinedMeaning: "Amplify others' pressure. May rush to complete tasks. Learn to manage pressure wisely.",
    openMeaning: "No fixed relationship to pressure. Can be deeply sensitive to stress from all sources."
  }
};
var GATES = {
  1: { center: "g", name: "The Creative", iching: "The Creative", theme: "Self-expression" },
  2: { center: "g", name: "The Receptive", iching: "The Receptive", theme: "Higher knowing" },
  3: { center: "sacral", name: "Ordering", iching: "Difficulty at the Beginning", theme: "Innovation" },
  4: { center: "ajna", name: "Formulization", iching: "Youthful Folly", theme: "Mental solutions" },
  5: { center: "sacral", name: "Fixed Rhythms", iching: "Waiting", theme: "Natural rhythms" },
  6: { center: "solar", name: "Friction", iching: "Conflict", theme: "Emotional clarity" },
  7: { center: "g", name: "The Role of Self", iching: "The Army", theme: "Leadership" },
  8: { center: "throat", name: "Contribution", iching: "Holding Together", theme: "Making a contribution" },
  9: { center: "sacral", name: "Focus", iching: "The Taming Power of the Small", theme: "Determination" },
  10: { center: "g", name: "Behavior of Self", iching: "Treading", theme: "Self-love" },
  11: { center: "ajna", name: "Ideas", iching: "Peace", theme: "New ideas" },
  12: { center: "throat", name: "Caution", iching: "Standstill", theme: "Social caution" },
  13: { center: "g", name: "The Listener", iching: "Fellowship with Men", theme: "Listening" },
  14: { center: "sacral", name: "Power Skills", iching: "Possession in Great Measure", theme: "Wealth" },
  15: { center: "g", name: "Extremes", iching: "Modesty", theme: "Humanity" },
  16: { center: "throat", name: "Skills", iching: "Enthusiasm", theme: "Mastery" },
  17: { center: "ajna", name: "Opinions", iching: "Following", theme: "Opinions" },
  18: { center: "spleen", name: "Correction", iching: "Work on What Has Been Spoiled", theme: "Correction" },
  19: { center: "root", name: "Wanting", iching: "Approach", theme: "Sensitivity" },
  20: { center: "throat", name: "The Now", iching: "Contemplation", theme: "Presence" },
  21: { center: "heart", name: "The Hunter", iching: "Biting Through", theme: "Control" },
  22: { center: "solar", name: "Openness", iching: "Grace", theme: "Social grace" },
  23: { center: "throat", name: "Assimilation", iching: "Splitting Apart", theme: "Expression" },
  24: { center: "ajna", name: "Rationalization", iching: "Return", theme: "Returning" },
  25: { center: "g", name: "Innocence", iching: "Innocence", theme: "Universal love" },
  26: { center: "heart", name: "The Trickster", iching: "The Taming Power of the Great", theme: "Influence" },
  27: { center: "sacral", name: "Caring", iching: "The Corners of the Mouth", theme: "Nourishment" },
  28: { center: "spleen", name: "The Player", iching: "Preponderance of the Great", theme: "Struggle" },
  29: { center: "sacral", name: "Perseverance", iching: "The Abysmal", theme: "Commitment" },
  30: { center: "solar", name: "Recognition of Feelings", iching: "The Clinging", theme: "Desire" },
  31: { center: "throat", name: "Leading", iching: "Influence", theme: "Leadership" },
  32: { center: "spleen", name: "Continuity", iching: "Duration", theme: "Endurance" },
  33: { center: "throat", name: "Privacy", iching: "Retreat", theme: "Remembering" },
  34: { center: "sacral", name: "Power", iching: "The Power of the Great", theme: "Pure power" },
  35: { center: "throat", name: "Change", iching: "Progress", theme: "Experience" },
  36: { center: "solar", name: "Crisis", iching: "Darkening of the Light", theme: "Exploration" },
  37: { center: "solar", name: "Friendship", iching: "The Family", theme: "Family" },
  38: { center: "root", name: "The Fighter", iching: "Opposition", theme: "Struggle" },
  39: { center: "root", name: "Provocation", iching: "Obstruction", theme: "Provocation" },
  40: { center: "heart", name: "Aloneness", iching: "Deliverance", theme: "Delivery" },
  41: { center: "root", name: "Contraction", iching: "Decrease", theme: "Fantasy" },
  42: { center: "sacral", name: "Growth", iching: "Increase", theme: "Completion" },
  43: { center: "ajna", name: "Insight", iching: "Break-through", theme: "Insight" },
  44: { center: "spleen", name: "Coming to Meet", iching: "Coming to Meet", theme: "Alertness" },
  45: { center: "throat", name: "Gathering", iching: "Gathering Together", theme: "Gathering" },
  46: { center: "g", name: "Love of Body", iching: "Pushing Upward", theme: "Serendipity" },
  47: { center: "ajna", name: "Realization", iching: "Oppression", theme: "Realization" },
  48: { center: "spleen", name: "Depth", iching: "The Well", theme: "Depth" },
  49: { center: "solar", name: "Principles", iching: "Revolution", theme: "Revolution" },
  50: { center: "spleen", name: "Values", iching: "The Cauldron", theme: "Values" },
  51: { center: "heart", name: "Shock", iching: "The Arousing", theme: "Initiation" },
  52: { center: "root", name: "Stillness", iching: "Keeping Still", theme: "Inaction" },
  53: { center: "root", name: "Beginnings", iching: "Development", theme: "Starting" },
  54: { center: "root", name: "Ambition", iching: "The Marrying Maiden", theme: "Ambition" },
  55: { center: "solar", name: "Spirit", iching: "Abundance", theme: "Abundance" },
  56: { center: "throat", name: "Stimulation", iching: "The Wanderer", theme: "Stimulation" },
  57: { center: "spleen", name: "Intuition", iching: "The Gentle", theme: "Intuitive clarity" },
  58: { center: "root", name: "Vitality", iching: "The Joyous", theme: "Vitality" },
  59: { center: "sacral", name: "Sexuality", iching: "Dispersion", theme: "Intimacy" },
  60: { center: "root", name: "Limitation", iching: "Limitation", theme: "Acceptance" },
  61: { center: "head", name: "Mystery", iching: "Inner Truth", theme: "Inner truth" },
  62: { center: "throat", name: "Details", iching: "Preponderance of the Small", theme: "Details" },
  63: { center: "head", name: "Doubt", iching: "After Completion", theme: "Doubt" },
  64: { center: "head", name: "Confusion", iching: "Before Completion", theme: "Confusion" }
};
var CIRCUIT_GROUPS = {
  individual: { name: "Individual", theme: "Empowerment, mutation, uniqueness", keywords: "Knowing, uniqueness, melancholy" },
  tribal: { name: "Tribal", theme: "Support, community, resources", keywords: "Loyalty, support, bargains" },
  collective: { name: "Collective", theme: "Sharing, humanity, evolution", keywords: "Sharing, logic, experience" },
  integration: { name: "Integration", theme: "Self-empowerment, survival", keywords: "Self, survival, attainment" }
};
var CHANNELS = [
  { gates: [1, 8], name: "Inspiration", centers: ["g", "throat"], theme: "Creative role model", circuit: "individual", subcircuit: "knowing" },
  { gates: [2, 14], name: "The Beat", centers: ["g", "sacral"], theme: "Keeper of keys", circuit: "individual", subcircuit: "knowing" },
  { gates: [3, 60], name: "Mutation", centers: ["sacral", "root"], theme: "Energy for mutation", circuit: "individual", subcircuit: "knowing" },
  { gates: [4, 63], name: "Logic", centers: ["ajna", "head"], theme: "Mental ease in doubt", circuit: "collective", subcircuit: "logic" },
  { gates: [5, 15], name: "Rhythm", centers: ["sacral", "g"], theme: "Being in flow", circuit: "collective", subcircuit: "logic" },
  { gates: [6, 59], name: "Intimacy", centers: ["solar", "sacral"], theme: "Focused on reproduction", circuit: "tribal", subcircuit: "defense" },
  { gates: [7, 31], name: "Alpha", centers: ["g", "throat"], theme: "Leadership", circuit: "collective", subcircuit: "logic" },
  { gates: [9, 52], name: "Concentration", centers: ["sacral", "root"], theme: "Focused determination", circuit: "collective", subcircuit: "logic" },
  { gates: [10, 20], name: "Awakening", centers: ["g", "throat"], theme: "Commitment to self", circuit: "integration", subcircuit: "integration" },
  { gates: [10, 34], name: "Exploration", centers: ["g", "sacral"], theme: "Following convictions", circuit: "integration", subcircuit: "integration" },
  { gates: [10, 57], name: "Perfected Form", centers: ["g", "spleen"], theme: "Survival", circuit: "integration", subcircuit: "integration" },
  { gates: [11, 56], name: "Curiosity", centers: ["ajna", "throat"], theme: "A searcher", circuit: "collective", subcircuit: "sensing" },
  { gates: [12, 22], name: "Openness", centers: ["throat", "solar"], theme: "Social being", circuit: "individual", subcircuit: "knowing" },
  { gates: [13, 33], name: "The Prodigal", centers: ["g", "throat"], theme: "A witness", circuit: "collective", subcircuit: "sensing" },
  { gates: [16, 48], name: "The Wavelength", centers: ["throat", "spleen"], theme: "Talent", circuit: "collective", subcircuit: "logic" },
  { gates: [17, 62], name: "Acceptance", centers: ["ajna", "throat"], theme: "An organizational being", circuit: "collective", subcircuit: "logic" },
  { gates: [18, 58], name: "Judgement", centers: ["spleen", "root"], theme: "Insatiability", circuit: "collective", subcircuit: "logic" },
  { gates: [19, 49], name: "Synthesis", centers: ["root", "solar"], theme: "Sensitivity", circuit: "tribal", subcircuit: "ego" },
  { gates: [20, 34], name: "Charisma", centers: ["throat", "sacral"], theme: "Busy-ness", circuit: "integration", subcircuit: "integration" },
  { gates: [20, 57], name: "The Brainwave", centers: ["throat", "spleen"], theme: "Penetrating awareness", circuit: "integration", subcircuit: "integration" },
  { gates: [21, 45], name: "Money", centers: ["heart", "throat"], theme: "A materialist", circuit: "tribal", subcircuit: "ego" },
  { gates: [23, 43], name: "Structuring", centers: ["throat", "ajna"], theme: "Individuality", circuit: "individual", subcircuit: "knowing" },
  { gates: [24, 61], name: "Awareness", centers: ["ajna", "head"], theme: "A thinker", circuit: "individual", subcircuit: "knowing" },
  { gates: [25, 51], name: "Initiation", centers: ["g", "heart"], theme: "Needing to be first", circuit: "individual", subcircuit: "centering" },
  { gates: [26, 44], name: "Surrender", centers: ["heart", "spleen"], theme: "A transmitter", circuit: "tribal", subcircuit: "ego" },
  { gates: [27, 50], name: "Preservation", centers: ["sacral", "spleen"], theme: "Custodianship", circuit: "tribal", subcircuit: "defense" },
  { gates: [28, 38], name: "Struggle", centers: ["spleen", "root"], theme: "Stubbornness", circuit: "individual", subcircuit: "knowing" },
  { gates: [29, 46], name: "Discovery", centers: ["sacral", "g"], theme: "Succeeding where others fail", circuit: "collective", subcircuit: "sensing" },
  { gates: [30, 41], name: "Recognition", centers: ["solar", "root"], theme: "Focused energy", circuit: "collective", subcircuit: "sensing" },
  { gates: [32, 54], name: "Transformation", centers: ["spleen", "root"], theme: "Being driven", circuit: "tribal", subcircuit: "ego" },
  { gates: [34, 57], name: "Power", centers: ["sacral", "spleen"], theme: "An archetype", circuit: "integration", subcircuit: "integration" },
  { gates: [35, 36], name: "Transitoriness", centers: ["throat", "solar"], theme: "A jack of all trades", circuit: "collective", subcircuit: "sensing" },
  { gates: [37, 40], name: "Community", centers: ["solar", "heart"], theme: "Part of a bargain", circuit: "tribal", subcircuit: "ego" },
  { gates: [39, 55], name: "Emoting", centers: ["root", "solar"], theme: "Moodiness", circuit: "individual", subcircuit: "knowing" },
  { gates: [42, 53], name: "Maturation", centers: ["sacral", "root"], theme: "Balanced development", circuit: "collective", subcircuit: "sensing" },
  { gates: [47, 64], name: "Abstraction", centers: ["ajna", "head"], theme: "Mental activity/clarity", circuit: "collective", subcircuit: "sensing" }
];
var TYPES = {
  manifestor: {
    name: "Manifestor",
    strategy: "Inform",
    notSelf: "Anger",
    signature: "Peace",
    description: "Independent initiators who can make things happen",
    percentage: "9%"
  },
  generator: {
    name: "Generator",
    strategy: "Wait to Respond",
    notSelf: "Frustration",
    signature: "Satisfaction",
    description: "Life force beings who respond to what life brings",
    percentage: "37%"
  },
  manifestingGenerator: {
    name: "Manifesting Generator",
    strategy: "Wait to Respond, then Inform",
    notSelf: "Frustration/Anger",
    signature: "Satisfaction",
    description: "Multi-passionate beings who can move quickly",
    percentage: "33%"
  },
  projector: {
    name: "Projector",
    strategy: "Wait for the Invitation",
    notSelf: "Bitterness",
    signature: "Success",
    description: "Guides and managers who see others deeply",
    percentage: "20%"
  },
  reflector: {
    name: "Reflector",
    strategy: "Wait a Lunar Cycle",
    notSelf: "Disappointment",
    signature: "Surprise",
    description: "Mirrors of community health and wisdom",
    percentage: "1%"
  }
};
var LINE_NAMES = {
  1: "Investigator",
  2: "Hermit",
  3: "Martyr",
  4: "Opportunist",
  5: "Heretic",
  6: "Role Model"
};
var PROFILES = {
  "1/3": { name: "Investigator/Martyr", theme: "Learning through trial and error" },
  "1/4": { name: "Investigator/Opportunist", theme: "Foundation through relationships" },
  "2/4": { name: "Hermit/Opportunist", theme: "Natural talent shared with others" },
  "2/5": { name: "Hermit/Heretic", theme: "Called out for natural gifts" },
  "3/5": { name: "Martyr/Heretic", theme: "Learning through experience to save others" },
  "3/6": { name: "Martyr/Role Model", theme: "Trial and error becoming wisdom" },
  "4/6": { name: "Opportunist/Role Model", theme: "Networking toward role modeling" },
  "4/1": { name: "Opportunist/Investigator", theme: "Influencing through research" },
  "5/1": { name: "Heretic/Investigator", theme: "Practical solutions from study" },
  "5/2": { name: "Heretic/Hermit", theme: "Called out but needs alone time" },
  "6/2": { name: "Role Model/Hermit", theme: "Wise but needs solitude" },
  "6/3": { name: "Role Model/Martyr", theme: "Wisdom from life experience" }
};
function getProfileInfo(line1, line2) {
  const key = `${line1}/${line2}`;
  if (PROFILES[key]) return PROFILES[key];
  const name1 = LINE_NAMES[line1] || `Line ${line1}`;
  const name2 = LINE_NAMES[line2] || `Line ${line2}`;
  return { name: `${name1}/${name2}`, theme: "Unique combination of energies" };
}
__name(getProfileInfo, "getProfileInfo");
var AUTHORITIES = {
  emotional: { name: "Emotional Authority", description: "Wait for emotional clarity over time" },
  sacral: { name: "Sacral Authority", description: "Listen to gut response sounds" },
  splenic: { name: "Splenic Authority", description: "Trust instant intuitive knowing" },
  ego: { name: "Ego/Heart Authority", description: "Follow what the heart wants" },
  self: { name: "Self-Projected Authority", description: "Hear truth in your own voice" },
  mental: { name: "Mental/Environment", description: "Process with trusted others" },
  lunar: { name: "Lunar Authority", description: "Wait 28 days for clarity" }
};
var GATE_WHEEL_OFFSET = 358.25;
var GATE_ORDER = [
  25,
  17,
  21,
  51,
  42,
  3,
  // Aries
  27,
  24,
  2,
  23,
  8,
  20,
  // Taurus
  16,
  35,
  45,
  12,
  15,
  52,
  // Gemini
  39,
  53,
  62,
  56,
  31,
  33,
  // Cancer/Leo
  7,
  4,
  29,
  59,
  40,
  64,
  // Leo/Virgo
  47,
  6,
  46,
  18,
  48,
  57,
  // Virgo/Libra
  32,
  50,
  28,
  44,
  1,
  43,
  // Libra/Scorpio
  14,
  34,
  9,
  5,
  26,
  11,
  // Sagittarius
  10,
  58,
  38,
  54,
  61,
  60,
  // Capricorn
  41,
  19,
  13,
  49,
  30,
  55,
  // Aquarius
  37,
  63,
  22,
  36
  // Pisces (then back to 25)
];
function longitudeToGate(longitude) {
  const normalizedLong = (longitude % 360 + 360) % 360;
  const adjustedLong = (normalizedLong - GATE_WHEEL_OFFSET + 360) % 360;
  const gateIndex = Math.floor(adjustedLong / 5.625);
  return GATE_ORDER[gateIndex % 64];
}
__name(longitudeToGate, "longitudeToGate");
function longitudeToLine(longitude) {
  const normalizedLong = (longitude % 360 + 360) % 360;
  const adjustedLong = (normalizedLong - GATE_WHEEL_OFFSET + 360) % 360;
  const withinGate = adjustedLong % 5.625;
  const line = Math.floor(withinGate / 0.9375) + 1;
  return Math.min(line, 6);
}
__name(longitudeToLine, "longitudeToLine");
function planetToGateActivation(planet, longitude) {
  if (!longitude && longitude !== 0) return null;
  const gate = longitudeToGate(longitude);
  const line = longitudeToLine(longitude);
  return {
    planet,
    gate,
    line,
    color: longitudeToColor(longitude),
    tone: longitudeToTone(longitude),
    base: longitudeToBase(longitude),
    longitude,
    ...GATES[gate]
  };
}
__name(planetToGateActivation, "planetToGateActivation");
function calculateHumanDesign(birthDate, birthHour = 12, timezone = 0, options = {}) {
  const { year, month, day } = parseDateComponents(birthDate);
  const personalityPos = calculateBirthPositions(year, month, day, birthHour, timezone, null, null, options);
  const personalitySunLong = personalityPos.sun.longitude;
  const designSunTarget = (personalitySunLong - 88 + 360) % 360;
  let designDate = new Date(year, month - 1, day - 89);
  let designYear = designDate.getFullYear();
  let designMonth = designDate.getMonth() + 1;
  let designDay = designDate.getDate();
  let designHour = birthHour;
  let designPos = null;
  for (let iteration = 0; iteration < 20; iteration++) {
    designPos = calculateBirthPositions(designYear, designMonth, designDay, 12, timezone, null, null, options);
    const currentSunLong = designPos.sun.longitude;
    let diff = currentSunLong - designSunTarget;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    if (Math.abs(diff) < 1) {
      break;
    }
    const daysToAdjust = -Math.round(diff / 0.9856);
    if (daysToAdjust === 0) {
      if (diff > 0) designDay -= 1;
      else designDay += 1;
    } else {
      designDay += daysToAdjust;
    }
    designDate = new Date(designYear, designMonth - 1, designDay);
    designYear = designDate.getFullYear();
    designMonth = designDate.getMonth() + 1;
    designDay = designDate.getDate();
  }
  const baseYear = designYear;
  const baseMonth = designMonth;
  const baseDay = designDay;
  let lowDayOffset = -1;
  let highDayOffset = 1;
  let bestOffset = 0;
  for (let iteration = 0; iteration < 30; iteration++) {
    const midDayOffset = (lowDayOffset + highDayOffset) / 2;
    const totalHoursFromBaseNoon = midDayOffset * 24;
    let searchDate = new Date(baseYear, baseMonth - 1, baseDay, 12);
    searchDate.setTime(searchDate.getTime() + totalHoursFromBaseNoon * 60 * 60 * 1e3);
    const searchYear = searchDate.getFullYear();
    const searchMonth = searchDate.getMonth() + 1;
    const searchDay = searchDate.getDate();
    const searchHour = searchDate.getHours() + searchDate.getMinutes() / 60;
    designPos = calculateBirthPositions(searchYear, searchMonth, searchDay, searchHour, timezone, null, null, options);
    const currentSunLong = designPos.sun.longitude;
    let diff = currentSunLong - designSunTarget;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    if (Math.abs(diff) < 1e-3) {
      designYear = searchYear;
      designMonth = searchMonth;
      designDay = searchDay;
      designHour = searchHour;
      break;
    }
    if (diff > 0) {
      highDayOffset = midDayOffset;
    } else {
      lowDayOffset = midDayOffset;
    }
    bestOffset = midDayOffset;
  }
  if (designYear === baseYear && designMonth === baseMonth && designDay === baseDay) {
    const totalHoursFromBaseNoon = bestOffset * 24;
    let finalDate = new Date(baseYear, baseMonth - 1, baseDay, 12);
    finalDate.setTime(finalDate.getTime() + totalHoursFromBaseNoon * 60 * 60 * 1e3);
    designYear = finalDate.getFullYear();
    designMonth = finalDate.getMonth() + 1;
    designDay = finalDate.getDate();
    designHour = finalDate.getHours() + finalDate.getMinutes() / 60;
  }
  designPos = calculateBirthPositions(designYear, designMonth, designDay, designHour, timezone, null, null, options);
  const personalityGates = {
    sun: planetToGateActivation("sun", personalityPos.sun.longitude),
    earth: planetToGateActivation("earth", (personalityPos.sun.longitude + 180) % 360),
    moon: planetToGateActivation("moon", personalityPos.moon.longitude),
    northNode: planetToGateActivation("northNode", personalityPos.northNode.longitude),
    southNode: planetToGateActivation("southNode", personalityPos.southNode.longitude),
    mercury: planetToGateActivation("mercury", personalityPos.mercury.longitude),
    venus: planetToGateActivation("venus", personalityPos.venus.longitude),
    mars: planetToGateActivation("mars", personalityPos.mars.longitude),
    jupiter: planetToGateActivation("jupiter", personalityPos.jupiter.longitude),
    saturn: planetToGateActivation("saturn", personalityPos.saturn.longitude),
    uranus: planetToGateActivation("uranus", personalityPos.uranus.longitude),
    neptune: planetToGateActivation("neptune", personalityPos.neptune.longitude),
    pluto: planetToGateActivation("pluto", personalityPos.pluto.longitude)
  };
  const designGates = {
    sun: planetToGateActivation("sun", designPos.sun.longitude),
    earth: planetToGateActivation("earth", (designPos.sun.longitude + 180) % 360),
    moon: planetToGateActivation("moon", designPos.moon.longitude),
    northNode: planetToGateActivation("northNode", designPos.northNode.longitude),
    southNode: planetToGateActivation("southNode", designPos.southNode.longitude),
    mercury: planetToGateActivation("mercury", designPos.mercury.longitude),
    venus: planetToGateActivation("venus", designPos.venus.longitude),
    mars: planetToGateActivation("mars", designPos.mars.longitude),
    jupiter: planetToGateActivation("jupiter", designPos.jupiter.longitude),
    saturn: planetToGateActivation("saturn", designPos.saturn.longitude),
    uranus: planetToGateActivation("uranus", designPos.uranus.longitude),
    neptune: planetToGateActivation("neptune", designPos.neptune.longitude),
    pluto: planetToGateActivation("pluto", designPos.pluto.longitude)
  };
  const activeGates = /* @__PURE__ */ new Set();
  Object.values(personalityGates).forEach((g) => {
    if (g) activeGates.add(g.gate);
  });
  Object.values(designGates).forEach((g) => {
    if (g) activeGates.add(g.gate);
  });
  const personalitySunLine = personalityGates.sun?.line || 1;
  const designSunLine = designGates.sun?.line || 1;
  const profile = `${personalitySunLine}/${designSunLine}`;
  const profileInfo = getProfileInfo(personalitySunLine, designSunLine);
  const activeChannels = CHANNELS.filter(
    (channel) => activeGates.has(channel.gates[0]) && activeGates.has(channel.gates[1])
  );
  const definedCenters = /* @__PURE__ */ new Set();
  activeChannels.forEach((channel) => {
    channel.centers.forEach((center) => definedCenters.add(center));
  });
  let type = "projector";
  const hasSacral = definedCenters.has("sacral");
  const hasMotorToThroat = checkMotorToThroat(activeChannels);
  if (!hasSacral && hasMotorToThroat) {
    type = "manifestor";
  } else if (hasSacral) {
    if (hasMotorToThroat) {
      type = "manifestingGenerator";
    } else {
      type = "generator";
    }
  } else if (definedCenters.size === 0) {
    type = "reflector";
  }
  const authority = determineAuthority(definedCenters, hasSacral);
  const personalitySunGate = personalityGates.sun?.gate;
  const personalityEarthGate = personalityGates.earth?.gate;
  const designSunGate = designGates.sun?.gate;
  const designEarthGate = designGates.earth?.gate;
  const crossGates = [personalitySunGate, personalityEarthGate, designSunGate, designEarthGate];
  const crossInfo = getIncarnationCross(personalitySunGate, profile, crossGates);
  const incarnationCross = {
    ...crossInfo,
    gates: crossGates,
    gateNames: [
      GATES[personalitySunGate]?.name,
      GATES[personalityEarthGate]?.name,
      GATES[designSunGate]?.name,
      GATES[designEarthGate]?.name
    ]
  };
  const definitionType = determineDefinitionType(activeChannels, definedCenters);
  const undefinedCenterDetails = Object.keys(CENTERS).filter((c) => !definedCenters.has(c)).map((c) => {
    const centerGates = Object.entries(GATES).filter(([, g]) => g.center === c).map(([num]) => parseInt(num));
    const hasGates = centerGates.some((g) => activeGates.has(g));
    return {
      ...CENTERS[c],
      key: c,
      status: hasGates ? "undefined" : "open",
      activatedGates: centerGates.filter((g) => activeGates.has(g))
    };
  });
  const circuitAnalysis = {
    individual: { channels: 0, names: [] },
    tribal: { channels: 0, names: [] },
    collective: { channels: 0, names: [] },
    integration: { channels: 0, names: [] }
  };
  activeChannels.forEach((ch) => {
    if (ch.circuit && circuitAnalysis[ch.circuit]) {
      circuitAnalysis[ch.circuit].channels++;
      circuitAnalysis[ch.circuit].names.push(ch.name);
    }
  });
  const dominantCircuit = Object.entries(circuitAnalysis).filter(([, v]) => v.channels > 0).sort((a, b) => b[1].channels - a[1].channels)[0];
  const variable = calculateVariable(personalityPos, designPos);
  return {
    type: TYPES[type],
    authority: AUTHORITIES[authority],
    profile: {
      numbers: profile,
      ...profileInfo
    },
    definition: definitionType,
    incarnationCross,
    centers: {
      defined: Array.from(definedCenters).map((c) => ({ ...CENTERS[c], key: c })),
      undefined: undefinedCenterDetails.filter((c) => c.status === "undefined"),
      open: undefinedCenterDetails.filter((c) => c.status === "open"),
      definedNames: Array.from(definedCenters),
      undefinedNames: undefinedCenterDetails.filter((c) => c.status === "undefined").map((c) => c.key),
      openNames: undefinedCenterDetails.filter((c) => c.status === "open").map((c) => c.key),
      allUndefinedNames: Object.keys(CENTERS).filter((c) => !definedCenters.has(c))
    },
    gates: {
      personality: personalityGates,
      design: designGates,
      all: Array.from(activeGates)
    },
    channels: activeChannels,
    circuitAnalysis: {
      ...circuitAnalysis,
      dominant: dominantCircuit ? {
        name: dominantCircuit[0],
        ...CIRCUIT_GROUPS[dominantCircuit[0]],
        channelCount: dominantCircuit[1].channels
      } : null
    },
    variable,
    // Reproducibility metadata — everything needed to re-derive or compare
    meta: {
      birthDate,
      birthHour,
      timezone,
      nodeType: personalityPos.nodeType || "true",
      ephemeris: "astronomy-engine (VSOP87)",
      designSolarArc: 88
    },
    // Raw planetary positions for advanced users
    positions: {
      personality: {
        date: birthDate,
        sun: personalityPos.sun,
        earth: personalityPos.earth,
        moon: personalityPos.moon,
        northNode: personalityPos.northNode,
        southNode: personalityPos.southNode,
        mercury: personalityPos.mercury,
        venus: personalityPos.venus,
        mars: personalityPos.mars,
        jupiter: personalityPos.jupiter,
        saturn: personalityPos.saturn,
        uranus: personalityPos.uranus,
        neptune: personalityPos.neptune,
        pluto: personalityPos.pluto
      },
      design: {
        date: `${designYear}-${String(designMonth).padStart(2, "0")}-${String(designDay).padStart(2, "0")}`,
        // Local time (birth timezone) of the exact 88°-solar-arc moment.
        // Round to whole minutes first so 59.7' carries into the hour
        // instead of printing ":60".
        dateTime: (() => {
          const totalMinutes = Math.round(designHour * 60);
          const hh = Math.floor(totalMinutes / 60) % 24;
          const mm = totalMinutes % 60;
          return `${designYear}-${String(designMonth).padStart(2, "0")}-${String(designDay).padStart(2, "0")}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
        })(),
        sun: designPos.sun,
        earth: designPos.earth,
        moon: designPos.moon,
        northNode: designPos.northNode,
        southNode: designPos.southNode,
        mercury: designPos.mercury,
        venus: designPos.venus,
        mars: designPos.mars,
        jupiter: designPos.jupiter,
        saturn: designPos.saturn,
        uranus: designPos.uranus,
        neptune: designPos.neptune,
        pluto: designPos.pluto
      }
    },
    useEphemeris: true,
    summary: `${TYPES[type].name} with ${AUTHORITIES[authority].name}, ${profileInfo.name} Profile`,
    note: "Calculated with astronomy-engine (VSOP87) \u2014 all 13 activation points, design at exactly 88\xB0 solar arc"
  };
}
__name(calculateHumanDesign, "calculateHumanDesign");
function determineDefinitionType(channels, definedCenters) {
  if (definedCenters.size === 0) return "No Definition";
  if (channels.length === 0) return "No Definition";
  const adj = /* @__PURE__ */ new Map();
  for (const c of definedCenters) adj.set(c, /* @__PURE__ */ new Set());
  channels.forEach((ch) => {
    const [c1, c2] = ch.centers;
    if (adj.has(c1) && adj.has(c2)) {
      adj.get(c1).add(c2);
      adj.get(c2).add(c1);
    }
  });
  const visited = /* @__PURE__ */ new Set();
  let components = 0;
  for (const center of definedCenters) {
    if (visited.has(center)) continue;
    components++;
    const queue = [center];
    visited.add(center);
    while (queue.length > 0) {
      const current = queue.shift();
      for (const neighbor of adj.get(current) || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
  }
  if (components === 1) return "Single Definition";
  if (components === 2) return "Split Definition";
  if (components === 3) return "Triple Split Definition";
  return "Quadruple Split Definition";
}
__name(determineDefinitionType, "determineDefinitionType");
var DETERMINATION_TYPES = {
  1: { name: "Appetite", description: "Eat simple, one thing at a time. Consecutive diet." },
  2: { name: "Taste", description: "Sensitive palate. Open or closed taste preferences." },
  3: { name: "Thirst", description: "Temperature sensitivity. Hot or cold food/drink." },
  4: { name: "Touch", description: "Environment affects digestion. Calm surroundings needed." },
  5: { name: "Sound", description: "Acoustic environment matters. Sound affects metabolism." },
  6: { name: "Light", description: "Light conditions affect eating. Direct or indirect light." }
};
var ENVIRONMENT_TYPES = {
  1: { name: "Caves", description: "Enclosed, protected, selective spaces. Privacy and shelter." },
  2: { name: "Markets", description: "Places of exchange and gathering. Commercial, busy spaces." },
  3: { name: "Kitchens", description: "Transformative spaces. Where things are heated and prepared." },
  4: { name: "Mountains", description: "Elevated spaces. Higher altitude, views, expansive." },
  5: { name: "Valleys", description: "Acoustically rich environments. Sounds and resonance." },
  6: { name: "Shores", description: "Transitional spaces. Edges, boundaries, thresholds." }
};
var PERSPECTIVE_TYPES = {
  1: { name: "Survival", description: "Awareness focused on security and self-preservation." },
  2: { name: "Possibility", description: "Open, optimistic view. Sees potential everywhere." },
  3: { name: "Power", description: "Focused on influence and impact. Sees dynamics of control." },
  4: { name: "Wanting", description: "Driven by desire. Sees what is needed or missing." },
  5: { name: "Probability", description: "Analytical, practical view. Calculates odds and outcomes." },
  6: { name: "Personal", description: "Introspective, self-reflective view. Deeply personal lens." }
};
var MOTIVATION_TYPES = {
  1: { name: "Fear", description: "Motivated to understand the unknown. Natural researcher and learner." },
  2: { name: "Hope", description: "Motivated by patience and trust. Waits and observes before acting." },
  3: { name: "Desire", description: "Motivated to move and organize. Initiates with purpose." },
  4: { name: "Need", description: "Motivated by service. Identifies what must be done for the collective." },
  5: { name: "Guilt", description: "Motivated by deep responsibility. Driven to fix and manage." },
  6: { name: "Innocence", description: "Motivated by non-doing. Shows up without agenda or expectation." }
};
var COGNITION_TYPES = {
  1: { name: "Smell", description: "Information processed through scent and atmospheric frequencies." },
  2: { name: "Taste", description: "Information processed through the mouth and palate." },
  3: { name: "Outer Vision", description: "Aesthetically oriented. Processes through what is seen externally." },
  4: { name: "Inner Vision", description: "Visualization and imagination. Sees beyond the physical." },
  5: { name: "Feeling", description: "Sensing vibes and subtle energies. Processes through touch and feel." },
  6: { name: "Touch", description: "Information through hands and physical contact. Tactile intelligence." }
};
function longitudeToColor(longitude) {
  const normalizedLong = (longitude % 360 + 360) % 360;
  const adjustedLong = (normalizedLong - GATE_WHEEL_OFFSET + 360) % 360;
  const withinGate = adjustedLong % 5.625;
  const withinLine = withinGate % 0.9375;
  const color = Math.floor(withinLine / 0.15625) + 1;
  return Math.min(color, 6);
}
__name(longitudeToColor, "longitudeToColor");
function longitudeToTone(longitude) {
  const normalizedLong = (longitude % 360 + 360) % 360;
  const adjustedLong = (normalizedLong - GATE_WHEEL_OFFSET + 360) % 360;
  const withinGate = adjustedLong % 5.625;
  const withinLine = withinGate % 0.9375;
  const withinColor = withinLine % 0.15625;
  const tone = Math.floor(withinColor / 0.026041667) + 1;
  return Math.min(tone, 6);
}
__name(longitudeToTone, "longitudeToTone");
function longitudeToBase(longitude) {
  const normalizedLong = (longitude % 360 + 360) % 360;
  const adjustedLong = (normalizedLong - GATE_WHEEL_OFFSET + 360) % 360;
  const withinGate = adjustedLong % 5.625;
  const withinLine = withinGate % 0.9375;
  const withinColor = withinLine % 0.15625;
  const withinTone = withinColor % 0.026041667;
  const base = Math.floor(withinTone / 5208333e-9) + 1;
  return Math.min(base, 5);
}
__name(longitudeToBase, "longitudeToBase");
function calculateVariable(personalityPos, designPos) {
  const personalitySunLong = personalityPos.sun.longitude;
  const designSunLong = designPos.sun.longitude;
  const personalityNodeLong = personalityPos.northNode.longitude;
  const designNodeLong = designPos.northNode.longitude;
  const determinationColor = longitudeToColor(designSunLong);
  const environmentColor = longitudeToColor(designNodeLong);
  const motivationColor = longitudeToColor(personalitySunLong);
  const perspectiveColor = longitudeToColor(personalityNodeLong);
  const determinationTone = longitudeToTone(designSunLong);
  const environmentTone = longitudeToTone(designNodeLong);
  const motivationTone = longitudeToTone(personalitySunLong);
  const perspectiveTone = longitudeToTone(personalityNodeLong);
  const isLeft = /* @__PURE__ */ __name((tone) => tone <= 3, "isLeft");
  const arrows = {
    determination: {
      arrow: isLeft(determinationTone) ? "left" : "right",
      color: determinationColor,
      tone: determinationTone,
      ...DETERMINATION_TYPES[determinationColor],
      cognition: COGNITION_TYPES[determinationTone]
    },
    environment: {
      arrow: isLeft(environmentTone) ? "left" : "right",
      color: environmentColor,
      tone: environmentTone,
      ...ENVIRONMENT_TYPES[environmentColor]
    },
    motivation: {
      arrow: isLeft(motivationTone) ? "left" : "right",
      color: motivationColor,
      tone: motivationTone,
      ...MOTIVATION_TYPES[motivationColor]
    },
    perspective: {
      arrow: isLeft(perspectiveTone) ? "left" : "right",
      color: perspectiveColor,
      tone: perspectiveTone,
      ...PERSPECTIVE_TYPES[perspectiveColor]
    }
  };
  const notation = `${arrows.determination.arrow[0].toUpperCase()}${arrows.environment.arrow[0].toUpperCase()} ${arrows.motivation.arrow[0].toUpperCase()}${arrows.perspective.arrow[0].toUpperCase()}`;
  return {
    ...arrows,
    notation,
    digestiveType: arrows.determination.name,
    environmentType: arrows.environment.name,
    perspectiveType: arrows.perspective.name,
    motivationType: arrows.motivation.name
  };
}
__name(calculateVariable, "calculateVariable");
function checkMotorToThroat(channels) {
  const motorCenters = ["sacral", "heart", "solar", "root"];
  const connections = /* @__PURE__ */ new Map();
  channels.forEach((channel) => {
    const [c1, c2] = channel.centers;
    if (!connections.has(c1)) connections.set(c1, /* @__PURE__ */ new Set());
    if (!connections.has(c2)) connections.set(c2, /* @__PURE__ */ new Set());
    connections.get(c1).add(c2);
    connections.get(c2).add(c1);
  });
  if (!connections.has("throat")) return false;
  const visited = /* @__PURE__ */ new Set(["throat"]);
  const queue = ["throat"];
  while (queue.length > 0) {
    const current = queue.shift();
    if (motorCenters.includes(current)) {
      return true;
    }
    const neighbors = connections.get(current) || /* @__PURE__ */ new Set();
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return false;
}
__name(checkMotorToThroat, "checkMotorToThroat");
function determineAuthority(definedCenters, hasSacral) {
  if (definedCenters.has("solar")) return "emotional";
  if (hasSacral) return "sacral";
  if (definedCenters.has("spleen")) return "splenic";
  if (definedCenters.has("heart")) return "ego";
  if (definedCenters.has("g")) return "self";
  if (definedCenters.size === 0) return "lunar";
  return "mental";
}
__name(determineAuthority, "determineAuthority");
var GENE_KEY_SPECTRUM = {
  1: ["Entropy", "Freshness", "Beauty"],
  2: ["Dislocation", "Orientation", "Unity"],
  3: ["Chaos", "Innovation", "Innocence"],
  4: ["Intolerance", "Understanding", "Forgiveness"],
  5: ["Impatience", "Patience", "Timelessness"],
  6: ["Conflict", "Diplomacy", "Peace"],
  7: ["Division", "Guidance", "Virtue"],
  8: ["Mediocrity", "Style", "Exquisiteness"],
  9: ["Inertia", "Determination", "Invincibility"],
  10: ["Self-Obsession", "Naturalness", "Being"],
  11: ["Obscurity", "Idealism", "Light"],
  12: ["Vanity", "Discrimination", "Purity"],
  13: ["Discord", "Discernment", "Empathy"],
  14: ["Compromise", "Competence", "Bounteousness"],
  15: ["Dullness", "Magnetism", "Florescence"],
  16: ["Indifference", "Versatility", "Mastery"],
  17: ["Opinion", "Far-Sightedness", "Omniscience"],
  18: ["Judgement", "Integrity", "Perfection"],
  19: ["Co-Dependence", "Sensitivity", "Sacrifice"],
  20: ["Superficiality", "Self-Assurance", "Presence"],
  21: ["Control", "Authority", "Valour"],
  22: ["Dishonour", "Graciousness", "Grace"],
  23: ["Complexity", "Simplicity", "Quintessence"],
  24: ["Addiction", "Invention", "Silence"],
  25: ["Constriction", "Acceptance", "Universal Love"],
  26: ["Pride", "Artfulness", "Invisibility"],
  27: ["Selfishness", "Altruism", "Selflessness"],
  28: ["Purposelessness", "Totality", "Immortality"],
  29: ["Half-Heartedness", "Commitment", "Devotion"],
  30: ["Desire", "Lightness", "Rapture"],
  31: ["Arrogance", "Leadership", "Humility"],
  32: ["Failure", "Preservation", "Veneration"],
  33: ["Forgetting", "Mindfulness", "Revelation"],
  34: ["Force", "Strength", "Majesty"],
  35: ["Hunger", "Adventure", "Boundlessness"],
  36: ["Turbulence", "Humanity", "Compassion"],
  37: ["Weakness", "Equality", "Tenderness"],
  38: ["Struggle", "Perseverance", "Honour"],
  39: ["Provocation", "Dynamism", "Liberation"],
  40: ["Exhaustion", "Resolve", "Divine Will"],
  41: ["Fantasy", "Anticipation", "Emanation"],
  42: ["Expectation", "Detachment", "Celebration"],
  43: ["Deafness", "Insight", "Epiphany"],
  44: ["Interference", "Teamwork", "Synarchy"],
  45: ["Dominance", "Synergy", "Communion"],
  46: ["Seriousness", "Delight", "Ecstasy"],
  47: ["Oppression", "Transmutation", "Transfiguration"],
  48: ["Inadequacy", "Resourcefulness", "Wisdom"],
  49: ["Reaction", "Revolution", "Rebirth"],
  50: ["Corruption", "Equilibrium", "Harmony"],
  51: ["Agitation", "Initiative", "Awakening"],
  52: ["Stress", "Restraint", "Stillness"],
  53: ["Immaturity", "Expansion", "Superabundance"],
  54: ["Greed", "Aspiration", "Ascension"],
  55: ["Victimisation", "Freedom", "Freedom"],
  56: ["Distraction", "Enrichment", "Intoxication"],
  57: ["Unease", "Intuition", "Clarity"],
  58: ["Dissatisfaction", "Vitality", "Bliss"],
  59: ["Dishonesty", "Intimacy", "Transparency"],
  60: ["Limitation", "Realism", "Justice"],
  61: ["Psychosis", "Inspiration", "Sanctity"],
  62: ["Intellect", "Precision", "Impeccability"],
  63: ["Doubt", "Inquiry", "Truth"],
  64: ["Confusion", "Imagination", "Illumination"]
};
function calculateGeneKeys(humanDesignResult) {
  const { personality, design } = humanDesignResult.gates;
  const createSphere = /* @__PURE__ */ __name((gateData, sphereName) => {
    const gate = gateData?.gate || gateData;
    const line = gateData?.line || null;
    return {
      key: gate,
      line,
      keyLine: line ? `${gate}.${line}` : String(gate),
      name: GATES[gate]?.name || `Gate ${gate}`,
      sphere: sphereName,
      shadow: GENE_KEY_SPECTRUM[gate]?.[0] || "Shadow",
      gift: GENE_KEY_SPECTRUM[gate]?.[1] || "Gift",
      siddhi: GENE_KEY_SPECTRUM[gate]?.[2] || "Siddhi",
      spectrum: GENE_KEY_SPECTRUM[gate] || ["Shadow", "Gift", "Siddhi"]
    };
  }, "createSphere");
  const activationSequence = {
    lifeWork: createSphere(personality.sun, "Life's Work"),
    evolution: createSphere(personality.earth, "Evolution"),
    radiance: createSphere(design.sun, "Radiance"),
    purpose: createSphere(design.earth, "Purpose")
  };
  const venusSequence = {
    attraction: createSphere(design.moon, "Attraction"),
    iq: createSphere(personality.venus, "IQ"),
    eq: createSphere(personality.mars, "EQ"),
    sq: createSphere(design.venus, "SQ")
  };
  const pearlSequence = {
    vocation: createSphere(design.mars, "Vocation"),
    culture: createSphere(design.jupiter, "Culture"),
    pearl: createSphere(personality.jupiter, "Pearl")
  };
  const pathways = {
    challenge: `${activationSequence.lifeWork.key} \u2192 ${activationSequence.evolution.key}`,
    breakthrough: `${activationSequence.evolution.key} \u2192 ${activationSequence.radiance.key}`,
    coreStability: `${activationSequence.radiance.key} \u2192 ${activationSequence.purpose.key}`
  };
  const core = createSphere(design.mars, "Core");
  const brand = createSphere(personality.sun, "Brand");
  const allKeys = [
    activationSequence.lifeWork,
    activationSequence.evolution,
    activationSequence.radiance,
    activationSequence.purpose,
    venusSequence.attraction,
    venusSequence.iq,
    venusSequence.eq,
    venusSequence.sq,
    pearlSequence.vocation,
    // Same as Core
    pearlSequence.culture,
    pearlSequence.pearl
  ];
  return {
    // Activation Sequence (primary)
    ...activationSequence,
    // Full sequences
    activationSequence,
    venusSequence,
    pearlSequence,
    // Shared spheres (same Gene Key, different lens)
    core,
    // Same as vocation
    brand,
    // Same as lifeWork
    // Pathways
    pathways,
    // All Gene Keys in profile
    allKeys,
    // Summary
    primeGifts: [
      activationSequence.lifeWork.gift,
      activationSequence.evolution.gift,
      activationSequence.radiance.gift,
      activationSequence.purpose.gift
    ],
    summary: `Life's Work: ${activationSequence.lifeWork.keyLine} (${activationSequence.lifeWork.gift}), Evolution: ${activationSequence.evolution.keyLine} (${activationSequence.evolution.gift}), Radiance: ${activationSequence.radiance.keyLine} (${activationSequence.radiance.gift}), Purpose: ${activationSequence.purpose.keyLine} (${activationSequence.purpose.gift})`,
    note: "Gene Keys profile calculated from Human Design planetary positions"
  };
}
__name(calculateGeneKeys, "calculateGeneKeys");
var humandesign_default = calculateHumanDesign;

// ../natal-engine/src/calculators/vedic.js
init_modules_watch_stub();

// ../natal-engine/src/calculators/astrocartography.js
init_modules_watch_stub();
var DEG_TO_RAD2 = Math.PI / 180;
var RAD_TO_DEG2 = 180 / Math.PI;

// ../natal-engine/src/calculators/compatibility/index.js
init_modules_watch_stub();

// ../natal-engine/src/calculators/compatibility/astrology.js
init_modules_watch_stub();

// ../natal-engine/src/calculators/compatibility/humandesign.js
init_modules_watch_stub();
var TYPE_DYNAMICS = {
  "generator-generator": {
    dynamic: "Powerful work partnership",
    gifts: "Sustainable energy, mutual response, deep satisfaction potential",
    challenges: "May get stuck in routines, need external stimulation",
    tips: "Take turns initiating topics to respond to"
  },
  "generator-manifestingGenerator": {
    dynamic: "High-energy partnership",
    gifts: "Combined stamina and speed, complementary work styles",
    challenges: "MG may move too fast for Generator",
    tips: "MG should inform before changing direction"
  },
  "generator-projector": {
    dynamic: "Classic guidance relationship",
    gifts: "Projector sees and guides Generator's energy, mutual recognition",
    challenges: "Projector may feel overlooked, Generator may feel managed",
    tips: "Generator invites Projector's guidance, Projector waits for invitation"
  },
  "generator-manifestor": {
    dynamic: "Initiator-sustainer dynamic",
    gifts: "Manifestor sparks, Generator builds and sustains",
    challenges: "Manifestor may feel slowed, Generator may feel pushed",
    tips: "Manifestor informs, Generator responds authentically"
  },
  "generator-reflector": {
    dynamic: "Energy source meets mirror",
    gifts: "Reflector samples Generator's healthy energy, provides wisdom",
    challenges: "Reflector needs space from constant energy",
    tips: "Reflector gives feedback after lunar cycle observation"
  },
  "manifestingGenerator-manifestingGenerator": {
    dynamic: "Multi-passionate duo",
    gifts: "Fast-paced, adaptable, exciting adventures together",
    challenges: "May skip steps together, scattered energy",
    tips: "Build in response time before major decisions"
  },
  "manifestingGenerator-projector": {
    dynamic: "Speed meets depth",
    gifts: "Projector helps MG focus energy efficiently",
    challenges: "MG may overwhelm Projector, Projector may slow MG down",
    tips: "MG invites guidance, Projector rests and observes"
  },
  "manifestingGenerator-manifestor": {
    dynamic: "Dual initiator energy",
    gifts: "Both can make things happen quickly",
    challenges: "Power struggles, competing for initiative",
    tips: "Define domains, inform each other before acting"
  },
  "manifestingGenerator-reflector": {
    dynamic: "Fast meets reflective",
    gifts: "MG brings action, Reflector brings perspective",
    challenges: "Very different rhythms, Reflector needs time",
    tips: "MG slows down, Reflector gets full lunar cycles"
  },
  "projector-projector": {
    dynamic: "Mutual recognition",
    gifts: "Deep seeing of each other, efficient together",
    challenges: "Both need outside energy, may over-guide each other",
    tips: "Take turns being guided, rest together"
  },
  "projector-manifestor": {
    dynamic: "Guide meets initiator",
    gifts: "Projector sees Manifestor's impact clearly",
    challenges: "Manifestor may not wait for guidance, Projector may feel bypassed",
    tips: "Manifestor invites Projector's input before initiating"
  },
  "projector-reflector": {
    dynamic: "Seer meets mirror",
    gifts: "Deep wisdom together, non-energy types understand each other",
    challenges: "Neither has sustained energy, need outside sources",
    tips: "Work in bursts, honor rest needs"
  },
  "manifestor-manifestor": {
    dynamic: "Double initiator",
    gifts: "Major creative power, can catalyze big changes",
    challenges: "Power struggles, both want to lead",
    tips: "Define separate domains, inform thoroughly"
  },
  "manifestor-reflector": {
    dynamic: "Impact meets reflection",
    gifts: "Reflector mirrors Manifestor's true impact",
    challenges: "Manifestor may overwhelm, Reflector needs processing time",
    tips: "Manifestor informs, Reflector gives lunar-cycle feedback"
  },
  "reflector-reflector": {
    dynamic: "Rare mirror connection",
    gifts: "Deep understanding of each other's openness",
    challenges: "Both highly sensitive to environment, may amplify issues",
    tips: "Create nurturing environment together, honor lunar rhythms"
  }
};
var PROFILE_HARMONY = {
  // Same line in personal (first) number tends to create understanding
  sameLine1: 0.7,
  // Complementary lines (1-4, 2-5, 3-6) create attraction
  complementary: 0.8,
  // Same profile = recognition but similar challenges
  sameProfile: 0.75,
  // Default moderate compatibility
  default: 0.6
};
function getTypeKey(type1, type2) {
  const order = ["generator", "manifestingGenerator", "projector", "manifestor", "reflector"];
  const key1 = type1.toLowerCase().replace(/\s+/g, "").replace("manifesting", "manifesting");
  const key2 = type2.toLowerCase().replace(/\s+/g, "").replace("manifesting", "manifesting");
  const normalize = /* @__PURE__ */ __name((t) => {
    if (t.includes("manifesting") && t.includes("generator")) return "manifestingGenerator";
    if (t === "generator") return "generator";
    if (t === "projector") return "projector";
    if (t === "manifestor") return "manifestor";
    if (t === "reflector") return "reflector";
    return t;
  }, "normalize");
  const t1 = normalize(key1);
  const t2 = normalize(key2);
  if (order.indexOf(t1) <= order.indexOf(t2)) {
    return `${t1}-${t2}`;
  }
  return `${t2}-${t1}`;
}
__name(getTypeKey, "getTypeKey");
function analyzeTypeInteraction(chartA, chartB) {
  const typeA = chartA.type?.name || "Generator";
  const typeB = chartB.type?.name || "Generator";
  const key = getTypeKey(typeA, typeB);
  const dynamic = TYPE_DYNAMICS[key] || {
    dynamic: "Unique combination",
    gifts: "Opportunity for growth and understanding",
    challenges: "Different operating styles",
    tips: "Honor each other's strategy"
  };
  return {
    typeA,
    typeB,
    ...dynamic
  };
}
__name(analyzeTypeInteraction, "analyzeTypeInteraction");
function analyzeAuthorityDynamic(chartA, chartB) {
  const authA = chartA.authority?.name || "Sacral Authority";
  const authB = chartB.authority?.name || "Sacral Authority";
  let timing = "Standard";
  let description = "";
  const emotional = "Emotional Authority";
  const lunar = "Lunar Authority";
  if (authA === emotional || authB === emotional) {
    timing = "Extended";
    description = "One or both need emotional wave clarity - allow time for decisions";
  } else if (authA === lunar || authB === lunar) {
    timing = "Lunar cycle";
    description = "Major decisions benefit from 28-day observation period";
  } else if (authA === authB) {
    timing = "Aligned";
    description = `Both use ${authA} - natural understanding of decision process`;
  } else {
    description = `Different decision styles: ${authA} meets ${authB}. Honor both processes.`;
  }
  return {
    authorityA: authA,
    authorityB: authB,
    timing,
    description
  };
}
__name(analyzeAuthorityDynamic, "analyzeAuthorityDynamic");
function analyzeProfileHarmony(chartA, chartB) {
  const profileA = chartA.profile?.numbers || "1/3";
  const profileB = chartB.profile?.numbers || "1/3";
  const [line1A, line2A] = profileA.split("/").map(Number);
  const [line1B, line2B] = profileB.split("/").map(Number);
  let harmony = PROFILE_HARMONY.default;
  let description = "";
  if (profileA === profileB) {
    harmony = PROFILE_HARMONY.sameProfile;
    description = `Both ${profileA} - deep mutual recognition but share similar challenges`;
  } else if (line1A === line1B) {
    harmony = PROFILE_HARMONY.sameLine1;
    description = `Both lead with Line ${line1A} energy - natural understanding of each other's approach`;
  } else if (line1A === 1 && line1B === 4 || line1A === 4 && line1B === 1 || line1A === 2 && line1B === 5 || line1A === 5 && line1B === 2 || line1A === 3 && line1B === 6 || line1A === 6 && line1B === 3) {
    harmony = PROFILE_HARMONY.complementary;
    description = `Lines ${line1A} and ${line1B} are complementary - attractive polarity`;
  } else {
    description = `${profileA} and ${profileB} bring different gifts - opportunity for growth`;
  }
  return {
    profileA,
    profileB,
    nameA: chartA.profile?.name || profileA,
    nameB: chartB.profile?.name || profileB,
    harmony,
    description
  };
}
__name(analyzeProfileHarmony, "analyzeProfileHarmony");
function findElectromagneticPairs(chartA, chartB) {
  const gatesA = new Set(chartA.gates?.all || []);
  const gatesB = new Set(chartB.gates?.all || []);
  const electromagnetic = [];
  for (const channel of CHANNELS) {
    const [gate1, gate2] = channel.gates;
    if (gatesA.has(gate1) && gatesB.has(gate2) && !gatesA.has(gate2) && !gatesB.has(gate1)) {
      electromagnetic.push({
        gateA: gate1,
        gateB: gate2,
        channel: channel.name,
        centers: channel.centers,
        theme: channel.theme,
        attraction: "A provides Gate " + gate1 + ", B provides Gate " + gate2
      });
    } else if (gatesA.has(gate2) && gatesB.has(gate1) && !gatesA.has(gate1) && !gatesB.has(gate2)) {
      electromagnetic.push({
        gateA: gate2,
        gateB: gate1,
        channel: channel.name,
        centers: channel.centers,
        theme: channel.theme,
        attraction: "A provides Gate " + gate2 + ", B provides Gate " + gate1
      });
    }
  }
  return electromagnetic;
}
__name(findElectromagneticPairs, "findElectromagneticPairs");
function findSharedGates(chartA, chartB) {
  const gatesA = new Set(chartA.gates?.all || []);
  const gatesB = new Set(chartB.gates?.all || []);
  const shared = [];
  for (const gate of gatesA) {
    if (gatesB.has(gate)) {
      shared.push({
        gate,
        name: GATES[gate]?.name || `Gate ${gate}`,
        center: GATES[gate]?.center,
        theme: GATES[gate]?.theme
      });
    }
  }
  return shared;
}
__name(findSharedGates, "findSharedGates");
function findSharedChannels(chartA, chartB) {
  const channelsA = chartA.channels || [];
  const channelsB = chartB.channels || [];
  const channelNamesA = new Set(channelsA.map((c) => c.name));
  return channelsB.filter((c) => channelNamesA.has(c.name));
}
__name(findSharedChannels, "findSharedChannels");
function analyzeCenterDynamics(chartA, chartB) {
  const definedA = new Set(chartA.centers?.definedNames || []);
  const definedB = new Set(chartB.centers?.definedNames || []);
  const dynamics = [];
  for (const centerName of Object.keys(CENTERS)) {
    const aHas = definedA.has(centerName);
    const bHas = definedB.has(centerName);
    let dynamic = "";
    let description = "";
    if (aHas && bHas) {
      dynamic = "Both Defined";
      description = `Both have defined ${CENTERS[centerName].name} - consistent but fixed expression`;
    } else if (!aHas && !bHas) {
      dynamic = "Both Open";
      description = `Both have open ${CENTERS[centerName].name} - amplified together from environment`;
    } else if (aHas && !bHas) {
      dynamic = "A Conditions B";
      description = `A's defined ${CENTERS[centerName].name} conditions B's open center`;
    } else {
      dynamic = "B Conditions A";
      description = `B's defined ${CENTERS[centerName].name} conditions A's open center`;
    }
    dynamics.push({
      center: centerName,
      centerName: CENTERS[centerName].name,
      theme: CENTERS[centerName].theme,
      personADefined: aHas,
      personBDefined: bHas,
      dynamic,
      description
    });
  }
  return dynamics;
}
__name(analyzeCenterDynamics, "analyzeCenterDynamics");
function analyzeBridging(chartA, chartB, electromagnetic) {
  const bridgedChannels = electromagnetic.map((e) => ({
    channel: e.channel,
    theme: e.theme
  }));
  let description = "";
  if (bridgedChannels.length === 0) {
    description = "No bridging channels - relationship has other forms of connection";
  } else if (bridgedChannels.length <= 2) {
    description = "Light bridging - some electromagnetic attraction through shared channels";
  } else if (bridgedChannels.length <= 5) {
    description = "Significant bridging - strong electromagnetic pull when together";
  } else {
    description = "Intense bridging - powerful connection with many completed channels together";
  }
  return {
    description,
    bridgedChannels,
    count: bridgedChannels.length
  };
}
__name(analyzeBridging, "analyzeBridging");
function analyzeConnectionChart(chartA, chartB) {
  const gatesA = new Set(chartA.gates?.all || []);
  const gatesB = new Set(chartB.gates?.all || []);
  const channelNamesA = new Set((chartA.channels || []).map((c) => c.name));
  const channelNamesB = new Set((chartB.channels || []).map((c) => c.name));
  const connections = {
    electromagnetic: [],
    companionship: [],
    compromise: [],
    dominance: []
  };
  for (const channel of CHANNELS) {
    const [gate1, gate2] = channel.gates;
    const aHas1 = gatesA.has(gate1), aHas2 = gatesA.has(gate2);
    const bHas1 = gatesB.has(gate1), bHas2 = gatesB.has(gate2);
    const aHasChannel = aHas1 && aHas2;
    const bHasChannel = bHas1 && bHas2;
    const info = {
      channel: channel.name,
      gates: channel.gates,
      centers: channel.centers,
      theme: channel.theme,
      circuit: channel.circuit
    };
    if (aHasChannel && bHasChannel) {
      connections.companionship.push({
        ...info,
        type: "companionship",
        description: `Both share the ${channel.name} channel \u2014 mutual understanding and ease in this energy.`
      });
    } else if (aHasChannel && !bHas1 && !bHas2) {
      connections.dominance.push({
        ...info,
        type: "dominance",
        dominant: "A",
        description: `A's ${channel.name} channel conditions B, who has no gates in this channel.`
      });
    } else if (bHasChannel && !aHas1 && !aHas2) {
      connections.dominance.push({
        ...info,
        type: "dominance",
        dominant: "B",
        description: `B's ${channel.name} channel conditions A, who has no gates in this channel.`
      });
    } else if (aHasChannel && (bHas1 || bHas2)) {
      const bGate = bHas1 ? gate1 : gate2;
      connections.compromise.push({
        ...info,
        type: "compromise",
        dominant: "A",
        partialGate: bGate,
        description: `A defines the ${channel.name} channel fully; B has Gate ${bGate} and gets pulled into A's frequency.`
      });
    } else if (bHasChannel && (aHas1 || aHas2)) {
      const aGate = aHas1 ? gate1 : gate2;
      connections.compromise.push({
        ...info,
        type: "compromise",
        dominant: "B",
        partialGate: aGate,
        description: `B defines the ${channel.name} channel fully; A has Gate ${aGate} and gets pulled into B's frequency.`
      });
    } else if (aHas1 && bHas2 && !aHas2 && !bHas1 || aHas2 && bHas1 && !aHas1 && !bHas2) {
      const gateA = aHas1 ? gate1 : gate2;
      const gateB = bHas1 ? gate1 : gate2;
      connections.electromagnetic.push({
        ...info,
        type: "electromagnetic",
        gateA,
        gateB,
        description: `A's Gate ${gateA} meets B's Gate ${gateB}, creating the ${channel.name} channel together \u2014 new energy neither has alone.`
      });
    }
  }
  const compositeGates = /* @__PURE__ */ new Set([...gatesA, ...gatesB]);
  const compositeChannels = CHANNELS.filter(
    (ch) => compositeGates.has(ch.gates[0]) && compositeGates.has(ch.gates[1])
  );
  const compositeCenters = /* @__PURE__ */ new Set();
  compositeChannels.forEach((ch) => ch.centers.forEach((c) => compositeCenters.add(c)));
  const hasSacral = compositeCenters.has("sacral");
  const compositeMotorToThroat = checkCompositeMotorToThroat(compositeChannels);
  let compositeType = "Projector";
  if (!hasSacral && compositeMotorToThroat) compositeType = "Manifestor";
  else if (hasSacral && compositeMotorToThroat) compositeType = "Manifesting Generator";
  else if (hasSacral) compositeType = "Generator";
  else if (compositeCenters.size === 0) compositeType = "Reflector";
  return {
    connections,
    compositeType,
    compositeChannelCount: compositeChannels.length,
    compositeCenters: Array.from(compositeCenters),
    summary: {
      electromagnetic: connections.electromagnetic.length,
      companionship: connections.companionship.length,
      compromise: connections.compromise.length,
      dominance: connections.dominance.length,
      total: connections.electromagnetic.length + connections.companionship.length + connections.compromise.length + connections.dominance.length
    }
  };
}
__name(analyzeConnectionChart, "analyzeConnectionChart");
function checkCompositeMotorToThroat(channels) {
  const motorCenters = ["sacral", "heart", "solar", "root"];
  const connections = /* @__PURE__ */ new Map();
  channels.forEach((ch) => {
    const [c1, c2] = ch.centers;
    if (!connections.has(c1)) connections.set(c1, /* @__PURE__ */ new Set());
    if (!connections.has(c2)) connections.set(c2, /* @__PURE__ */ new Set());
    connections.get(c1).add(c2);
    connections.get(c2).add(c1);
  });
  if (!connections.has("throat")) return false;
  const visited = /* @__PURE__ */ new Set(["throat"]);
  const queue = ["throat"];
  while (queue.length > 0) {
    const current = queue.shift();
    if (motorCenters.includes(current)) return true;
    for (const neighbor of connections.get(current) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return false;
}
__name(checkCompositeMotorToThroat, "checkCompositeMotorToThroat");
function generateSummary(typeInteraction, profileHarmony, electromagnetic, sharedGates, sharedChannels) {
  const parts = [];
  parts.push(`${typeInteraction.typeA} + ${typeInteraction.typeB}: ${typeInteraction.dynamic}.`);
  if (profileHarmony.harmony >= 0.75) {
    parts.push(`Profiles ${profileHarmony.profileA} and ${profileHarmony.profileB} have natural harmony.`);
  }
  if (electromagnetic.length > 0) {
    parts.push(`${electromagnetic.length} electromagnetic connection${electromagnetic.length > 1 ? "s" : ""} create attraction.`);
  }
  if (sharedChannels.length > 0) {
    parts.push(`${sharedChannels.length} shared channel${sharedChannels.length > 1 ? "s" : ""} create deep understanding.`);
  }
  return parts.join(" ");
}
__name(generateSummary, "generateSummary");
function compareHumanDesign(chartA, chartB) {
  const typeInteraction = analyzeTypeInteraction(chartA, chartB);
  const authorityDynamic = analyzeAuthorityDynamic(chartA, chartB);
  const profileHarmony = analyzeProfileHarmony(chartA, chartB);
  const electromagneticPairs = findElectromagneticPairs(chartA, chartB);
  const sharedGates = findSharedGates(chartA, chartB);
  const sharedChannels = findSharedChannels(chartA, chartB);
  const centerDynamics = analyzeCenterDynamics(chartA, chartB);
  const bridging = analyzeBridging(chartA, chartB, electromagneticPairs);
  const connectionChart = analyzeConnectionChart(chartA, chartB);
  const summary = generateSummary(typeInteraction, profileHarmony, electromagneticPairs, sharedGates, sharedChannels);
  return {
    typeInteraction,
    authorityDynamic,
    profileHarmony,
    electromagneticPairs,
    sharedGates,
    sharedChannels,
    centerDynamics,
    bridging,
    connectionChart,
    summary,
    // Quick stats
    stats: {
      electromagneticCount: electromagneticPairs.length,
      companionshipCount: connectionChart.summary.companionship,
      compromiseCount: connectionChart.summary.compromise,
      dominanceCount: connectionChart.summary.dominance,
      sharedGatesCount: sharedGates.length,
      sharedChannelsCount: sharedChannels.length,
      compositeType: connectionChart.compositeType,
      conditioningCenters: centerDynamics.filter(
        (d) => d.dynamic === "A Conditions B" || d.dynamic === "B Conditions A"
      ).length
    }
  };
}
__name(compareHumanDesign, "compareHumanDesign");

// ../natal-engine/src/calculators/compatibility/genekeys.js
init_modules_watch_stub();

// ../natal-engine/src/storage/profiles.js
init_modules_watch_stub();

// ../natal-engine/src/timezone.js
init_modules_watch_stub();
var GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
async function searchPlaces(query, count = 8) {
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(query)}&count=${count}&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const data = await res.json();
  return (data.results || []).map((r) => ({
    name: r.name,
    label: [r.name, r.admin1, r.country].filter(Boolean).join(", "),
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
    countryCode: r.country_code
  }));
}
__name(searchPlaces, "searchPlaces");
function wallTimeMs(utcMs, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(new Date(utcMs));
  const get = /* @__PURE__ */ __name((t) => parts.find((p) => p.type === t)?.value, "get");
  const hour = get("hour") === "24" ? "00" : get("hour");
  return Date.parse(`${get("year")}-${get("month")}-${get("day")}T${hour}:${get("minute")}:${get("second")}Z`);
}
__name(wallTimeMs, "wallTimeMs");
function resolveUtcOffset(dateStr, timeStr, timeZone) {
  const target = Date.parse(`${dateStr}T${timeStr}:00Z`);
  if (Number.isNaN(target)) throw new Error(`Invalid date/time: ${dateStr} ${timeStr}`);
  let utc = target;
  for (let i = 0; i < 3; i++) {
    utc += target - wallTimeMs(utc, timeZone);
  }
  return (target - utc) / 36e5;
}
__name(resolveUtcOffset, "resolveUtcOffset");

// ../natal-engine/src/calculators/hd-transits.js
init_modules_watch_stub();
function calculateTransitGates(transitDate, timezone = 0) {
  let year, month, day, hour;
  if (!transitDate) {
    const now = /* @__PURE__ */ new Date();
    year = now.getUTCFullYear();
    month = now.getUTCMonth() + 1;
    day = now.getUTCDate();
    hour = now.getUTCHours() + now.getUTCMinutes() / 60;
  } else if (transitDate instanceof Date) {
    year = transitDate.getFullYear();
    month = transitDate.getMonth() + 1;
    day = transitDate.getDate();
    hour = transitDate.getHours() + transitDate.getMinutes() / 60;
  } else {
    const [y, m, d] = transitDate.split("-").map(Number);
    year = y;
    month = m;
    day = d;
    hour = 12;
  }
  const positions = calculateBirthPositions(year, month, day, hour, timezone);
  const transitGates = {};
  const planets = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"];
  for (const planet of planets) {
    if (positions[planet]) {
      const longitude = positions[planet].longitude;
      const gate = longitudeToGate(longitude);
      const line = longitudeToLine(longitude);
      transitGates[planet] = {
        gate,
        line,
        longitude,
        gateName: GATES[gate]?.name || `Gate ${gate}`,
        center: GATES[gate]?.center
      };
    }
  }
  if (positions.sun) {
    const earthLong = (positions.sun.longitude + 180) % 360;
    transitGates.earth = {
      gate: longitudeToGate(earthLong),
      line: longitudeToLine(earthLong),
      longitude: earthLong,
      gateName: GATES[longitudeToGate(earthLong)]?.name,
      center: GATES[longitudeToGate(earthLong)]?.center
    };
  }
  if (positions.northNode) {
    transitGates.northNode = {
      gate: longitudeToGate(positions.northNode.longitude),
      line: longitudeToLine(positions.northNode.longitude),
      longitude: positions.northNode.longitude,
      gateName: GATES[longitudeToGate(positions.northNode.longitude)]?.name,
      center: GATES[longitudeToGate(positions.northNode.longitude)]?.center
    };
    const southLong = (positions.northNode.longitude + 180) % 360;
    transitGates.southNode = {
      gate: longitudeToGate(southLong),
      line: longitudeToLine(southLong),
      longitude: southLong,
      gateName: GATES[longitudeToGate(southLong)]?.name,
      center: GATES[longitudeToGate(southLong)]?.center
    };
  }
  const activeGates = new Set(Object.values(transitGates).map((t) => t.gate));
  return {
    date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    gates: transitGates,
    activeGates: Array.from(activeGates),
    activeGateCount: activeGates.size
  };
}
__name(calculateTransitGates, "calculateTransitGates");
function calculateHDTransits(natalChart, transitDate, timezone = 0) {
  const transits = calculateTransitGates(transitDate, timezone);
  const natalGates = new Set(natalChart.gates?.all || []);
  const natalChannels = new Set((natalChart.channels || []).map((c) => c.name));
  const natalDefinedCenters = new Set(natalChart.centers?.definedNames || []);
  const channelCompletions = [];
  const allGatesCombined = /* @__PURE__ */ new Set([...natalGates, ...transits.activeGates]);
  for (const channel of CHANNELS) {
    const [gate1, gate2] = channel.gates;
    const combinedHasChannel = allGatesCombined.has(gate1) && allGatesCombined.has(gate2);
    const natalHasChannel = natalGates.has(gate1) && natalGates.has(gate2);
    if (combinedHasChannel && !natalHasChannel) {
      const natalGate = natalGates.has(gate1) ? gate1 : natalGates.has(gate2) ? gate2 : null;
      const transitGate = !natalGates.has(gate1) && transits.activeGates.includes(gate1) ? gate1 : !natalGates.has(gate2) && transits.activeGates.includes(gate2) ? gate2 : null;
      const transitPlanet = Object.entries(transits.gates).find(([, g]) => g.gate === transitGate)?.[0];
      channelCompletions.push({
        channel: channel.name,
        gates: channel.gates,
        centers: channel.centers,
        theme: channel.theme,
        circuit: channel.circuit,
        natalGate,
        transitGate,
        transitPlanet,
        type: natalGate ? "hanging_gate_completion" : "pure_transit",
        significance: natalGate ? "high" : "moderate"
      });
    }
  }
  const combinedChannels = CHANNELS.filter(
    (ch) => allGatesCombined.has(ch.gates[0]) && allGatesCombined.has(ch.gates[1])
  );
  const combinedCenters = /* @__PURE__ */ new Set();
  combinedChannels.forEach((ch) => ch.centers.forEach((c) => combinedCenters.add(c)));
  const temporarilyDefinedCenters = [];
  for (const center of combinedCenters) {
    if (!natalDefinedCenters.has(center)) {
      temporarilyDefinedCenters.push({
        center,
        centerName: CENTERS[center]?.name,
        theme: CENTERS[center]?.theme,
        notSelfTheme: CENTERS[center]?.notSelfTheme
      });
    }
  }
  const reinforcedGates = [];
  for (const transitGate of transits.activeGates) {
    if (natalGates.has(transitGate)) {
      const transitPlanet = Object.entries(transits.gates).find(([, g]) => g.gate === transitGate)?.[0];
      reinforcedGates.push({
        gate: transitGate,
        gateName: GATES[transitGate]?.name,
        center: GATES[transitGate]?.center,
        transitPlanet,
        meaning: `Transit ${transitPlanet} reinforces your natal Gate ${transitGate} (${GATES[transitGate]?.name}) \u2014 this energy is amplified today.`
      });
    }
  }
  const sunGate = transits.gates.sun;
  const moonGate = transits.gates.moon;
  return {
    transitDate: transits.date,
    transitGates: transits.gates,
    channelCompletions,
    temporarilyDefinedCenters,
    reinforcedGates,
    highlights: {
      sun: {
        ...sunGate,
        completesChannel: channelCompletions.some((c) => c.transitGate === sunGate.gate),
        reinforcesNatal: natalGates.has(sunGate.gate)
      },
      moon: {
        ...moonGate,
        completesChannel: channelCompletions.some((c) => c.transitGate === moonGate.gate),
        reinforcesNatal: natalGates.has(moonGate.gate)
      }
    },
    stats: {
      channelCompletions: channelCompletions.length,
      hangingGateCompletions: channelCompletions.filter((c) => c.type === "hanging_gate_completion").length,
      temporarilyDefinedCenters: temporarilyDefinedCenters.length,
      reinforcedGates: reinforcedGates.length,
      totalTransitGates: transits.activeGateCount
    }
  };
}
__name(calculateHDTransits, "calculateHDTransits");

// ../natal-engine/src/calculators/penta.js
init_modules_watch_stub();
var CAREER_TYPES = {
  "Manifestor": "Initiator",
  "Generator": "Classic Builder",
  "Manifesting Generator": "Express Builder",
  "Projector": "Advisor",
  "Reflector": "Evaluator"
};
var PENTA_ROLES = {
  throat_defined: {
    role: "Communicator",
    description: "Brings voice and manifestation to the group. Can articulate and act on group decisions."
  },
  sacral_defined: {
    role: "Worker",
    description: "Provides sustainable life force energy for the group's work. The engine of productivity."
  },
  heart_defined: {
    role: "Director",
    description: "Provides willpower and material direction. Can make promises on behalf of the group."
  },
  g_defined: {
    role: "Guide",
    description: "Holds the group's identity and direction. Provides love and sense of purpose."
  },
  solar_defined: {
    role: "Emotional Navigator",
    description: "Brings emotional depth and awareness. Helps the group navigate feelings and timing."
  },
  spleen_defined: {
    role: "Health Monitor",
    description: "Provides intuitive awareness and survival instincts. Keeps the group healthy and safe."
  },
  head_defined: {
    role: "Inspirer",
    description: "Brings mental pressure and inspiration. Generates questions that drive the group forward."
  },
  ajna_defined: {
    role: "Conceptualizer",
    description: "Processes and conceptualizes ideas for the group. Provides mental frameworks."
  },
  root_defined: {
    role: "Driver",
    description: "Brings pressure and momentum. Keeps the group moving and under productive stress."
  }
};
function analyzePenta(charts, names = []) {
  if (charts.length < 2) {
    throw new Error("Penta analysis requires at least 2 charts (optimal: 3-5)");
  }
  if (charts.length > 9) {
    throw new Error("Penta analysis supports up to 9 charts (3-5 is optimal for Penta, 6-9 extends to WA dynamics)");
  }
  const memberCount = charts.length;
  const isPenta = memberCount >= 3 && memberCount <= 5;
  const members = charts.map((chart, i) => ({
    name: names[i] || `Person ${i + 1}`,
    type: chart.type?.name,
    careerType: CAREER_TYPES[chart.type?.name] || "Unknown",
    authority: chart.authority?.name,
    profile: chart.profile?.numbers,
    definedCenters: chart.centers?.definedNames || [],
    gates: new Set(chart.gates?.all || []),
    channels: chart.channels || [],
    definition: chart.definition
  }));
  const allGates = /* @__PURE__ */ new Set();
  const allDefinedCenters = /* @__PURE__ */ new Set();
  members.forEach((m) => {
    m.gates.forEach((g) => allGates.add(g));
    m.definedCenters.forEach((c) => allDefinedCenters.add(c));
  });
  const groupChannels = CHANNELS.filter(
    (ch) => allGates.has(ch.gates[0]) && allGates.has(ch.gates[1])
  );
  const groupCentersFromChannels = /* @__PURE__ */ new Set();
  groupChannels.forEach((ch) => ch.centers.forEach((c) => groupCentersFromChannels.add(c)));
  const hasSacral = groupCentersFromChannels.has("sacral");
  const hasMotorToThroat = checkGroupMotorToThroat(groupChannels);
  let groupType = "Projector";
  if (!hasSacral && hasMotorToThroat) groupType = "Manifestor";
  else if (hasSacral && hasMotorToThroat) groupType = "Manifesting Generator";
  else if (hasSacral) groupType = "Generator";
  else if (groupCentersFromChannels.size === 0) groupType = "Reflector";
  const roles = {};
  const filledRoles = [];
  const missingRoles = [];
  for (const [centerKey, roleInfo] of Object.entries(PENTA_ROLES)) {
    const center = centerKey.replace("_defined", "");
    const contributors = members.filter((m) => m.definedCenters.includes(center));
    if (contributors.length > 0) {
      filledRoles.push({
        center,
        ...roleInfo,
        contributors: contributors.map((c) => c.name),
        strength: contributors.length > 1 ? "strong" : "moderate"
      });
    } else {
      missingRoles.push({
        center,
        ...roleInfo,
        suggestion: `Consider adding someone with a defined ${CENTERS[center]?.name || center} to fill this role.`
      });
    }
    roles[center] = {
      ...roleInfo,
      filled: contributors.length > 0,
      contributors: contributors.map((c) => c.name),
      count: contributors.length
    };
  }
  const groupElectromagnetics = findGroupElectromagnetics(members);
  const circuitBalance = { individual: 0, tribal: 0, collective: 0, integration: 0 };
  groupChannels.forEach((ch) => {
    if (ch.circuit && circuitBalance[ch.circuit] !== void 0) {
      circuitBalance[ch.circuit]++;
    }
  });
  const careerTypeDistribution = {};
  members.forEach((m) => {
    careerTypeDistribution[m.careerType] = (careerTypeDistribution[m.careerType] || 0) + 1;
  });
  const gateFrequency = {};
  members.forEach((m) => {
    m.gates.forEach((g) => {
      gateFrequency[g] = (gateFrequency[g] || 0) + 1;
    });
  });
  const sharedGates = Object.entries(gateFrequency).filter(([, count]) => count > 1).map(([gate, count]) => ({
    gate: parseInt(gate),
    name: GATES[parseInt(gate)]?.name,
    center: GATES[parseInt(gate)]?.center,
    sharedBy: count,
    members: members.filter((m) => m.gates.has(parseInt(gate))).map((m) => m.name)
  })).sort((a, b) => b.sharedBy - a.sharedBy);
  const undefinedForAll = Object.keys(CENTERS).filter((c) => !allDefinedCenters.has(c));
  const recommendations = generateRecommendations(
    groupType,
    filledRoles,
    missingRoles,
    circuitBalance,
    careerTypeDistribution,
    undefinedForAll,
    memberCount
  );
  return {
    memberCount,
    isPenta,
    groupType,
    groupCareerType: CAREER_TYPES[groupType] || groupType,
    members: members.map((m) => ({
      name: m.name,
      type: m.type,
      careerType: m.careerType,
      authority: m.authority,
      profile: m.profile,
      definedCenters: m.definedCenters
    })),
    roles,
    filledRoles,
    missingRoles,
    groupChannels: groupChannels.map((ch) => ({
      name: ch.name,
      gates: ch.gates,
      theme: ch.theme,
      circuit: ch.circuit
    })),
    groupCenters: Array.from(groupCentersFromChannels),
    undefinedForAll,
    electromagnetics: groupElectromagnetics,
    circuitBalance,
    careerTypeDistribution,
    sharedGates,
    recommendations,
    stats: {
      totalChannels: groupChannels.length,
      totalDefinedCenters: groupCentersFromChannels.size,
      filledRoleCount: filledRoles.length,
      missingRoleCount: missingRoles.length,
      electromagneticCount: groupElectromagnetics.length,
      sharedGateCount: sharedGates.length
    }
  };
}
__name(analyzePenta, "analyzePenta");
function findGroupElectromagnetics(members) {
  const electromagnetics = [];
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const a = members[i];
      const b = members[j];
      for (const channel of CHANNELS) {
        const [gate1, gate2] = channel.gates;
        if (a.gates.has(gate1) && b.gates.has(gate2) && !a.gates.has(gate2) && !b.gates.has(gate1) || a.gates.has(gate2) && b.gates.has(gate1) && !a.gates.has(gate1) && !b.gates.has(gate2)) {
          electromagnetics.push({
            personA: a.name,
            personB: b.name,
            channel: channel.name,
            gates: channel.gates,
            theme: channel.theme
          });
        }
      }
    }
  }
  return electromagnetics;
}
__name(findGroupElectromagnetics, "findGroupElectromagnetics");
function checkGroupMotorToThroat(channels) {
  const motorCenters = ["sacral", "heart", "solar", "root"];
  const connections = /* @__PURE__ */ new Map();
  channels.forEach((ch) => {
    const [c1, c2] = ch.centers;
    if (!connections.has(c1)) connections.set(c1, /* @__PURE__ */ new Set());
    if (!connections.has(c2)) connections.set(c2, /* @__PURE__ */ new Set());
    connections.get(c1).add(c2);
    connections.get(c2).add(c1);
  });
  if (!connections.has("throat")) return false;
  const visited = /* @__PURE__ */ new Set(["throat"]);
  const queue = ["throat"];
  while (queue.length > 0) {
    const current = queue.shift();
    if (motorCenters.includes(current)) return true;
    for (const neighbor of connections.get(current) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return false;
}
__name(checkGroupMotorToThroat, "checkGroupMotorToThroat");
function generateRecommendations(groupType, filledRoles, missingRoles, circuitBalance, careerTypes, undefinedCenters, memberCount) {
  const recs = [];
  recs.push({
    category: "Group Energy",
    insight: `This group functions as a ${groupType}. ${groupType === "Generator" ? "The group has sustainable work energy but needs to respond to opportunities rather than initiate." : groupType === "Manifesting Generator" ? "The group can both initiate and sustain work, with quick adaptability." : groupType === "Manifestor" ? "The group has initiating power. It should inform stakeholders before taking action." : groupType === "Projector" ? "The group excels at guidance and management. It should wait for recognition and invitations." : "The group mirrors its environment. Major decisions benefit from a full lunar cycle of reflection."}`
  });
  if (missingRoles.length > 0) {
    const critical = missingRoles.filter(
      (r) => ["throat", "sacral", "g"].includes(r.center)
    );
    if (critical.length > 0) {
      recs.push({
        category: "Critical Gaps",
        insight: `Missing key roles: ${critical.map((r) => `${r.role} (${CENTERS[r.center]?.name})`).join(", ")}. These gaps may cause the group to struggle with ${critical.some((r) => r.center === "throat") ? "communication and manifestation" : critical.some((r) => r.center === "sacral") ? "sustained work energy" : "direction and identity"}.`
      });
    }
  }
  const totalCircuits = Object.values(circuitBalance).reduce((a, b) => a + b, 0);
  if (totalCircuits > 0) {
    const dominant = Object.entries(circuitBalance).sort((a, b) => b[1] - a[1])[0];
    if (dominant[1] > totalCircuits * 0.5) {
      recs.push({
        category: "Circuit Balance",
        insight: `The group energy is heavily ${dominant[0]} (${dominant[1]}/${totalCircuits} channels). ${dominant[0] === "individual" ? "Strong individual creativity but may struggle with teamwork norms." : dominant[0] === "tribal" ? "Strong loyalty and support but may resist outside perspectives." : dominant[0] === "collective" ? "Good at sharing and patterns but may lack individual initiative." : "Strong self-empowerment but may be internally focused."}`
      });
    }
  }
  const builders = (careerTypes["Classic Builder"] || 0) + (careerTypes["Express Builder"] || 0);
  const advisors = careerTypes["Advisor"] || 0;
  const initiators = careerTypes["Initiator"] || 0;
  if (builders === 0) {
    recs.push({
      category: "Team Composition",
      insight: "No Builders (Generators) in the group. The team may lack sustained work energy. Consider adding a Generator or Manifesting Generator."
    });
  }
  if (advisors === 0 && memberCount >= 3) {
    recs.push({
      category: "Team Composition",
      insight: "No Advisors (Projectors) in the group. The team may lack guidance and efficiency optimization. Consider adding a Projector."
    });
  }
  if (memberCount < 3) {
    recs.push({
      category: "Group Size",
      insight: "A true Penta requires 3-5 members. With fewer, the trans-auric form is incomplete. Consider adding members for fuller group dynamics."
    });
  } else if (memberCount > 5) {
    recs.push({
      category: "Group Size",
      insight: `With ${memberCount} members, this group extends beyond a single Penta. Consider organizing into sub-teams of 3-5 for optimal small-group dynamics.`
    });
  }
  return recs;
}
__name(generateRecommendations, "generateRecommendations");

// ../natal-engine/src/data/gate-descriptions.js
init_modules_watch_stub();
var GATE_DESCRIPTIONS = {
  1: {
    description: "The gate of self-expression and creative power. When activated, you have a deep drive to express your unique creative identity. This is the energy of the individual who must create, not for others, but because creation is their nature.",
    keynote: "The creative expression of the Self",
    harmonic: 8,
    quarter: "Mutation"
  },
  2: {
    description: "The gate of the direction of the Self. This is the magnetic monopole gate \u2014 the driver that holds your direction in life. It operates through receptivity, allowing direction to come to you rather than seeking it.",
    keynote: "Receptive knowing of direction",
    harmonic: 14,
    quarter: "Civilization"
  },
  3: {
    description: "The gate of ordering \u2014 the energy to bring something new into form. This is the fuel for innovation and mutation. It carries the pressure to begin new things but must wait for the right timing to avoid chaos.",
    keynote: "The energy to innovate and begin new things",
    harmonic: 60,
    quarter: "Mutation"
  },
  4: {
    description: "The gate of formulization \u2014 the mental pressure to find answers and solutions. This is the logical mind working to create formulas and mental models to understand life. It must wait for recognition before sharing answers.",
    keynote: "The pressure to find logical answers",
    harmonic: 63,
    quarter: "Duality"
  },
  5: {
    description: "The gate of fixed rhythms and universal patterns. This energy attunes you to natural timing and cycles. When aligned, life flows in a steady rhythm. Disrupted rhythms create frustration.",
    keynote: "Attunement to natural rhythms and timing",
    harmonic: 15,
    quarter: "Civilization"
  },
  6: {
    description: "The gate of friction and emotional depth. This is the gateway to intimacy \u2014 the emotional energy that governs when and with whom you open up. It operates through an emotional wave and requires patience for clarity.",
    keynote: "The emotional wave that opens and closes to intimacy",
    harmonic: 59,
    quarter: "Duality"
  },
  7: {
    description: "The gate of the role of the Self in interaction \u2014 the energy of democratic leadership. This is not about controlling but about pointing the way. Leadership through example and direction rather than force.",
    keynote: "The role of the Self in leading others",
    harmonic: 31,
    quarter: "Civilization"
  },
  8: {
    description: 'The gate of contribution \u2014 the voice that says "I know I can make a contribution." This is individual creative expression through the Throat, making a unique creative impact on the world.',
    keynote: "Making a unique creative contribution",
    harmonic: 1,
    quarter: "Mutation"
  },
  9: {
    description: "The gate of the taming power of the small \u2014 focused determination and attention to detail. This energy allows you to concentrate deeply and persistently on the small things that lead to mastery.",
    keynote: "Focused attention and determination",
    harmonic: 52,
    quarter: "Duality"
  },
  10: {
    description: "The gate of the behavior of the Self \u2014 the love of life and self-love. This is about being yourself authentically. When healthy, it expresses as natural empowerment and self-acceptance. It connects to three channels (20, 34, 57).",
    keynote: "Self-love and authentic behavior",
    harmonic: null,
    quarter: "Mutation"
  },
  11: {
    description: "The gate of ideas \u2014 a wealth of concepts and stimulating thoughts. This is a gate of peace that holds many ideas but is not designed to act on them all. The ideas are meant to be shared and stimulate others.",
    keynote: "A wealth of ideas meant to be shared",
    harmonic: 56,
    quarter: "Civilization"
  },
  12: {
    description: "The gate of caution \u2014 the voice of the individual expressed with social caution. This energy knows when to speak and when to remain silent. It carries deep emotional expression that can be profoundly moving when the timing is right.",
    keynote: "Cautious, emotional expression",
    harmonic: 22,
    quarter: "Mutation"
  },
  13: {
    description: "The gate of the listener \u2014 the one who holds space for others' secrets and stories. This is the keeper of collective memory, able to hear and hold what others share without judgment.",
    keynote: "Listening and holding others' stories",
    harmonic: 33,
    quarter: "Civilization"
  },
  14: {
    description: "The gate of power skills \u2014 the energy of abundance and material wealth. This is the fuel that powers your capacity to accumulate resources and manage wealth through skill and competence.",
    keynote: "Empowerment through material resources",
    harmonic: 2,
    quarter: "Civilization"
  },
  15: {
    description: "The gate of extremes \u2014 the love of humanity expressed through rhythm. This gate operates in extremes, swinging between different patterns and behaviors. It is deeply connected to the flow of collective human rhythms.",
    keynote: "Love of humanity through natural rhythms",
    harmonic: 5,
    quarter: "Civilization"
  },
  16: {
    description: "The gate of skills \u2014 enthusiasm and experimentation that leads to mastery. This is the energy of the dilettante who must try many things before discovering what to master. Depth comes through breadth of experience.",
    keynote: "Enthusiasm and experimentation toward mastery",
    harmonic: 48,
    quarter: "Civilization"
  },
  17: {
    description: "The gate of opinions \u2014 the logical mind that forms opinions and mental frameworks. This energy organizes data into patterns and shares opinions, but these opinions must be invited and tested before they become valuable.",
    keynote: "Logical opinions that organize understanding",
    harmonic: 62,
    quarter: "Duality"
  },
  18: {
    description: "The gate of correction \u2014 the intuitive drive to improve and perfect. This energy spots what needs fixing with splenic precision. It can see the flaw in any pattern but must be invited to correct.",
    keynote: "The intuitive drive to correct and perfect",
    harmonic: 58,
    quarter: "Duality"
  },
  19: {
    description: "The gate of wanting \u2014 deep sensitivity to the needs of others and the need to be needed. This tribal energy senses what the community requires and drives you to provide it, seeking belonging through service.",
    keynote: "Sensitivity to the needs of others",
    harmonic: 49,
    quarter: "Mutation"
  },
  20: {
    description: "The gate of the now \u2014 pure presence and awareness in the current moment. This existential gate speaks and acts from a place of immediate knowing. It connects to three channels (10, 34, 57) and is part of the Integration circuit.",
    keynote: "Existential awareness and presence",
    harmonic: null,
    quarter: "Civilization"
  },
  21: {
    description: "The gate of the hunter/huntress \u2014 the willpower to control your material world. This heart/ego energy needs to be in control of its own domain and resources. It is the energy of self-management and material authority.",
    keynote: "Willpower to control resources and environment",
    harmonic: 45,
    quarter: "Civilization"
  },
  22: {
    description: "The gate of openness and social grace. This emotional gate carries the capacity for graceful social interaction when the emotional wave is clear. It can be deeply charming and emotionally expressive in the right mood.",
    keynote: "Emotional grace in social interaction",
    harmonic: 12,
    quarter: "Mutation"
  },
  23: {
    description: "The gate of assimilation \u2014 the voice of genius that translates individual knowing into expression. This energy takes complex inner knowing and simplifies it for communication. Its insights can seem radical or heretical.",
    keynote: "Translating inner knowing into simple expression",
    harmonic: 43,
    quarter: "Mutation"
  },
  24: {
    description: "The gate of rationalization \u2014 the mental process of returning to examine ideas again and again. This is the auditing mind that revisits concepts until they are fully understood or transformed.",
    keynote: "The returning mind that revisits and rationalizes",
    harmonic: 61,
    quarter: "Mutation"
  },
  25: {
    description: "The gate of the spirit of the Self \u2014 universal love and innocence. This is the energy of unconditional love that flows through you naturally. It has nothing to prove and loves without conditions or expectations.",
    keynote: "Universal love and spiritual innocence",
    harmonic: 51,
    quarter: "Mutation"
  },
  26: {
    description: "The gate of the egoist \u2014 the trickster energy of the great salesman. This is tribal ego power used to influence and convince. At its best, it's the energy of great storytelling and marketing in service of the tribe.",
    keynote: "Ego power to influence and convince",
    harmonic: 44,
    quarter: "Civilization"
  },
  27: {
    description: "The gate of caring \u2014 the sacral energy to nurture and nourish. This is deep tribal caring that feeds and sustains the community. It is the energy of the caretaker who must also know when to stop giving.",
    keynote: "The sacral energy to care for and nourish others",
    harmonic: 50,
    quarter: "Civilization"
  },
  28: {
    description: "The gate of the game player \u2014 the drive to find purpose and meaning through struggle. This individual energy pushes you to take risks and fight for what matters, driven by the fear of a life without meaning.",
    keynote: "The struggle to find purpose and meaning",
    harmonic: 38,
    quarter: "Mutation"
  },
  29: {
    description: "The gate of perseverance \u2014 the sacral energy of saying yes and committing fully. This is the power of devotion and the ability to see things through. The key is being selective about what you commit to.",
    keynote: "The sacral power of commitment and devotion",
    harmonic: 46,
    quarter: "Duality"
  },
  30: {
    description: "The gate of recognition of feelings \u2014 the fire of desire and emotional longing. This energy yearns for new experiences and feelings. It is the fuel that drives you toward discovery but operates through an emotional wave.",
    keynote: "Emotional desire and longing for experience",
    harmonic: 41,
    quarter: "Duality"
  },
  31: {
    description: "The gate of influence \u2014 the voice of democratic leadership that speaks to guide the collective. This is leadership through influence rather than force. Your words carry natural authority when you wait to be recognized.",
    keynote: "Verbal influence and democratic leadership",
    harmonic: 7,
    quarter: "Civilization"
  },
  32: {
    description: "The gate of continuity \u2014 the splenic instinct for what will endure and succeed. This is the fear-based awareness that evaluates which transformations are worth pursuing and which ventures will last.",
    keynote: "Instinct for what will endure and succeed",
    harmonic: 54,
    quarter: "Civilization"
  },
  33: {
    description: "The gate of privacy \u2014 the energy of retreat and reflection. This gate steps back from experience to process and remember. It is the storyteller who retreats to gain perspective before sharing wisdom.",
    keynote: "Retreat, reflection, and remembering",
    harmonic: 13,
    quarter: "Civilization"
  },
  34: {
    description: "The gate of the power of the great \u2014 pure sacral power and strength. This is raw individual power that must be used in response. It is enormous energy for doing and being busy, connecting to three channels (10, 20, 57).",
    keynote: "Pure sacral power and existential strength",
    harmonic: null,
    quarter: "Civilization"
  },
  35: {
    description: "The gate of change \u2014 the hunger for all of life's experiences. This is the jack-of-all-trades energy that craves variety and change. Progress comes through embracing many different experiences.",
    keynote: "The hunger for new experiences and progress",
    harmonic: 36,
    quarter: "Duality"
  },
  36: {
    description: "The gate of crisis \u2014 emotional exploration through darkness. This energy is drawn to emotional depth and crisis as a path to growth. It must navigate through turbulence to find humanitarian compassion.",
    keynote: "Growth through emotional crisis and exploration",
    harmonic: 35,
    quarter: "Duality"
  },
  37: {
    description: "The gate of friendship and family \u2014 the emotional bonds that hold communities together. This is the energy of bargains and agreements within families and close groups. Loyalty and equality within the tribe.",
    keynote: "Emotional bonds of friendship and family",
    harmonic: 40,
    quarter: "Civilization"
  },
  38: {
    description: "The gate of the fighter \u2014 the individual spirit that struggles to find meaning and purpose. This root pressure drives you to fight for what matters to you personally, even against opposition.",
    keynote: "The individual drive to fight for purpose",
    harmonic: 28,
    quarter: "Mutation"
  },
  39: {
    description: "The gate of provocation \u2014 the root pressure that provokes emotional spirit in others. This energy tests and prods to find what is truly worth feeling passionate about. It provokes spirit through pressure.",
    keynote: "Provocative pressure that awakens spirit",
    harmonic: 55,
    quarter: "Mutation"
  },
  40: {
    description: "The gate of aloneness \u2014 the willpower to provide for the community while needing solitude. This ego energy makes bargains: I will provide for you, but I need my alone time. Balancing tribal responsibility with personal space.",
    keynote: "Willpower balanced between community and solitude",
    harmonic: 37,
    quarter: "Civilization"
  },
  41: {
    description: "The gate of contraction \u2014 the root pressure of fantasy and imagination. This is the start codon of human experience, the imagination that envisions new possibilities before they manifest. It dreams of future feelings.",
    keynote: "The pressure of imagination and future fantasy",
    harmonic: 30,
    quarter: "Duality"
  },
  42: {
    description: "The gate of growth \u2014 the sacral energy of completion and maturation. This energy is about finishing what you start and growing through the process. It finds fulfillment in seeing things through to completion.",
    keynote: "The energy of growth through completion",
    harmonic: 53,
    quarter: "Duality"
  },
  43: {
    description: "The gate of insight \u2014 the breakthrough mental knowing of the individual. This is inner hearing and unique mental perception. Its insights can be brilliant but may seem deaf to conventional thinking.",
    keynote: "Breakthrough inner knowing and insight",
    harmonic: 23,
    quarter: "Mutation"
  },
  44: {
    description: "The gate of coming to meet \u2014 the splenic alertness to patterns from the past. This tribal instinct recognizes what has worked before and can sense whether current conditions are favorable for material success.",
    keynote: "Instinctive alertness to successful patterns",
    harmonic: 26,
    quarter: "Civilization"
  },
  45: {
    description: 'The gate of the gatherer \u2014 the voice that says "I have." This is the king/queen energy of material gathering and distribution. It naturally draws resources and people together under its authority.',
    keynote: "The authority to gather and distribute resources",
    harmonic: 21,
    quarter: "Civilization"
  },
  46: {
    description: "The gate of the determination of the Self \u2014 the love of the body and physical serendipity. This energy is about being in the right place at the right time. Success comes through embodiment and physical presence.",
    keynote: "Serendipity through embodiment and physical presence",
    harmonic: 29,
    quarter: "Duality"
  },
  47: {
    description: "The gate of realization \u2014 the mental pressure to make sense of abstract experience. This is the ability to find meaning in the seemingly random. It processes past experiences into understanding and wisdom.",
    keynote: "Making meaning from abstract experience",
    harmonic: 64,
    quarter: "Duality"
  },
  48: {
    description: "The gate of depth \u2014 the intuitive awareness of having (or lacking) adequate depth. This is the fear of inadequacy driving you toward deeper understanding. A well of knowledge that fears it isn't deep enough.",
    keynote: "The depth of intuitive knowledge",
    harmonic: 16,
    quarter: "Civilization"
  },
  49: {
    description: "The gate of principles \u2014 the emotional power of revolution and rejection. This tribal gate holds principles that determine who is accepted and who is rejected. It is the energy of necessary revolution when values are violated.",
    keynote: "Emotional principles of acceptance and revolution",
    harmonic: 19,
    quarter: "Mutation"
  },
  50: {
    description: "The gate of values \u2014 the splenic awareness of responsibility and tribal law. This gate holds the values that protect and preserve the community. It carries the weight of responsibility for maintaining order.",
    keynote: "Custodianship of values and tribal responsibility",
    harmonic: 27,
    quarter: "Civilization"
  },
  51: {
    description: "The gate of shock \u2014 the competitive spirit that initiates through shock. This is the energy that can withstand and deliver shock. It is the warrior spirit that springs into action, testing its own courage.",
    keynote: "The competitive spirit of initiation through shock",
    harmonic: 25,
    quarter: "Mutation"
  },
  52: {
    description: "The gate of stillness \u2014 the root pressure to be still and concentrate. This energy brings focused stillness, the ability to sit with pressure without acting on it. It is meditation in action, finding peace within tension.",
    keynote: "Focused stillness and concentration under pressure",
    harmonic: 9,
    quarter: "Duality"
  },
  53: {
    description: "The gate of beginnings \u2014 the root pressure to start new cycles and experiences. This is the start codon of the Sensing circuit, the restless energy that always wants to begin something new. Maturation comes through completion.",
    keynote: "The pressure to begin new cycles",
    harmonic: 42,
    quarter: "Duality"
  },
  54: {
    description: "The gate of ambition \u2014 the root pressure to rise and transform through drive. This tribal energy fuels the ambition to climb, achieve, and be recognized. It seeks material and social advancement.",
    keynote: "Ambition and the drive to transform and rise",
    harmonic: 32,
    quarter: "Civilization"
  },
  55: {
    description: "The gate of spirit \u2014 emotional abundance and the depth of feeling. This is the gate that accesses profound emotional states, from melancholy to ecstasy. It carries the potential for a new form of emotional awareness.",
    keynote: "Emotional abundance and depth of spirit",
    harmonic: 39,
    quarter: "Mutation"
  },
  56: {
    description: 'The gate of stimulation \u2014 the voice of the storyteller and wanderer. This energy stimulates through stories and short bursts of ideas. It believes "I think I can," entertaining and engaging through belief.',
    keynote: "Stimulating expression through stories and belief",
    harmonic: 11,
    quarter: "Civilization"
  },
  57: {
    description: "The gate of intuitive clarity \u2014 the most powerful form of awareness in the now. This splenic gate provides instant, in-the-moment intuitive knowing about survival and health. It speaks only once and very softly.",
    keynote: "Penetrating intuitive clarity in the present moment",
    harmonic: null,
    quarter: "Civilization"
  },
  58: {
    description: "The gate of vitality \u2014 the joyful root pressure that fuels the love of life. This energy brings vitality and the drive to improve and perfect. It sees what can be better and has the energy to pursue improvement.",
    keynote: "Joyful vitality and the drive to improve",
    harmonic: 18,
    quarter: "Duality"
  },
  59: {
    description: "The gate of sexuality \u2014 the sacral power of genetic strategy and intimacy. This energy breaks down barriers to create intimate bonds. It is the creative, reproductive force that dissolves walls between people.",
    keynote: "The sacral force of intimacy and breaking barriers",
    harmonic: 6,
    quarter: "Duality"
  },
  60: {
    description: "The gate of limitation \u2014 the root pressure of accepting limitation as the basis for transcendence. Mutation happens within constraints. This energy pulses between constraint and release, carrying the potential for radical change.",
    keynote: "Transcendence through acceptance of limitation",
    harmonic: 3,
    quarter: "Mutation"
  },
  61: {
    description: "The gate of mystery \u2014 the mental pressure to know the unknowable. This head center gate drives you to understand the deepest mysteries of existence. It is the pressure of inner truth seeking answers to universal questions.",
    keynote: "The pressure to understand inner truth and mystery",
    harmonic: 24,
    quarter: "Mutation"
  },
  62: {
    description: 'The gate of details \u2014 the voice that expresses through precise detail and naming. This logical energy communicates by naming things precisely. "I think" \u2014 organizing understanding through accurate labeling and description.',
    keynote: "Precise expression through details and naming",
    harmonic: 17,
    quarter: "Duality"
  },
  63: {
    description: 'The gate of doubt \u2014 the logical pressure to question and test. This is the beginning of the logical process \u2014 healthy skepticism that demands proof. It asks "Did I figure it out?" driving logical investigation.',
    keynote: "Logical doubt that drives investigation",
    harmonic: 4,
    quarter: "Duality"
  },
  64: {
    description: "The gate of confusion \u2014 the mental pressure to make sense of the past. This is the abstract mind processing memories and experiences into meaning. Before completion there is confusion; the resolution comes through the whole channel.",
    keynote: "Mental processing of past experience into meaning",
    harmonic: 47,
    quarter: "Duality"
  }
};

// ../natal-engine/src/data/channel-descriptions.js
init_modules_watch_stub();
var CHANNEL_DESCRIPTIONS = {
  "1-8": {
    description: "The Channel of Inspiration connects the G Center to the Throat. It carries the energy of unique creative expression \u2014 a role model for individual creativity. When you live your design, your creative self-expression naturally inspires others.",
    energyType: "Projected",
    whenDefined: "You have a consistent connection between your identity and creative voice. You are here to be a creative role model, expressing your unique individual gifts."
  },
  "2-14": {
    description: "The Channel of the Beat connects the G Center to the Sacral. This is the keeper of the keys \u2014 the individual direction that holds the power of material resources. It generates energy aligned with your direction in life.",
    energyType: "Generated",
    whenDefined: "You have a natural attunement between your life direction and your energy for material success. Resources flow when you follow your inner compass."
  },
  "3-60": {
    description: "The Channel of Mutation connects the Sacral to the Root. This carries the pulse energy for bringing new forms into being. Innovation happens in bursts \u2014 periods of limitation followed by breakthroughs of creative mutation.",
    energyType: "Generated",
    whenDefined: "You carry the energy for genuine innovation. New things emerge through you in pulses \u2014 accept the limitations between creative breakthroughs."
  },
  "4-63": {
    description: "The Channel of Logic connects the Ajna to the Head. This is the foundation of the logical process \u2014 doubt that drives investigation until answers are found. Mental pressure to figure things out through systematic inquiry.",
    energyType: "Projected",
    whenDefined: "You have a consistent logical mind that doubts and investigates until it finds answers. Your mental formulas are reliable when given time to process."
  },
  "5-15": {
    description: "The Channel of Rhythm connects the Sacral to the G Center. This is the energy of being in flow with universal timing. Your life force is attuned to natural rhythms and cycles, connecting personal energy to humanity's patterns.",
    energyType: "Generated",
    whenDefined: "You have a natural flow between your life force and universal rhythms. When you honor your own timing, you magnetize others into the flow of collective rhythm."
  },
  "6-59": {
    description: "The Channel of Intimacy connects the Solar Plexus to the Sacral. This is the energy of emotional-sexual bonding and reproduction. It governs who you open to intimately and when, driven by an emotional wave of clarity.",
    energyType: "Generated",
    whenDefined: "You have powerful energy for creating intimate bonds. Your emotional wave governs who you let in. Waiting for clarity before committing is essential."
  },
  "7-31": {
    description: "The Channel of the Alpha connects the G Center to the Throat. This is democratic leadership \u2014 the ability to guide the collective through the power of your voice and identity. Leadership through influence, not force.",
    energyType: "Projected",
    whenDefined: "You are designed for leadership roles. Your voice naturally carries authority when you wait for recognition and invitation to lead."
  },
  "9-52": {
    description: "The Channel of Concentration connects the Sacral to the Root. This is focused determination \u2014 the sacral energy to sit still and concentrate deeply under pressure. Mastery through patient, sustained focus.",
    energyType: "Generated",
    whenDefined: "You have the energy for deep, sustained concentration. You can sit with pressure and focus intensely on details when the subject is correct for you."
  },
  "10-20": {
    description: "The Channel of Awakening connects the G Center to the Throat. Part of the Integration circuit, this is the awakened expression of self-love. Being present and authentic in each moment, expressing who you truly are.",
    energyType: "Projected",
    whenDefined: "You naturally express self-love and authenticity. Your presence awakens others to their own self-acceptance when you embody who you truly are."
  },
  "10-34": {
    description: "The Channel of Exploration connects the G Center to the Sacral. Part of the Integration circuit, this is the power to follow your own convictions. Responding to what empowers you, exploring life on your own terms.",
    energyType: "Generated",
    whenDefined: "You have powerful sacral energy aligned with self-direction. You are designed to explore life by following your convictions and responding to what resonates."
  },
  "10-57": {
    description: "The Channel of Perfected Form connects the G Center to the Spleen. Part of the Integration circuit, this is intuitive self-love \u2014 survival through authentic behavior. Your instincts guide you toward self-preservation.",
    energyType: "Projected",
    whenDefined: "You have an intuitive connection between identity and survival. Your instincts guide you to behave authentically for your own wellbeing."
  },
  "11-56": {
    description: "The Channel of Curiosity connects the Ajna to the Throat. This is the abstract mind sharing ideas and stories. A searcher who collects ideas and experiences, then shares them through stimulating stories and teachings.",
    energyType: "Projected",
    whenDefined: "You have a rich abstract mind that generates stories and ideas. You stimulate others through sharing your curious explorations of life."
  },
  "12-22": {
    description: "The Channel of Openness connects the Throat to the Solar Plexus. This is emotional social expression \u2014 the capacity for grace and beauty in social interaction when the emotional wave is clear. Individual creative expression with emotional depth.",
    energyType: "Manifested",
    whenDefined: "You have a deep capacity for social grace and emotional expression. When your emotional wave is clear, you can be profoundly moving and inspiring."
  },
  "13-33": {
    description: "The Channel of the Prodigal connects the G Center to the Throat. This is the energy of the witness \u2014 listening to experience and then reflecting it back as wisdom. Collecting and sharing the stories of human experience.",
    energyType: "Projected",
    whenDefined: "You are a natural witness to life. You collect experiences and stories, then reflect them back as wisdom when the time is right."
  },
  "16-48": {
    description: "The Channel of the Wavelength connects the Throat to the Spleen. This is talent expressed through the body \u2014 enthusiastic experimentation that leads to mastery. The depth of knowledge meeting the enthusiasm to share it.",
    energyType: "Projected",
    whenDefined: "You carry the potential for deep mastery. Your enthusiasm and experimentation, combined with splenic depth, create genuine talent over time."
  },
  "17-62": {
    description: "The Channel of Acceptance connects the Ajna to the Throat. This is the logical mind expressing its opinions and organizational frameworks. Detailed, structured thinking that names and categorizes understanding.",
    energyType: "Projected",
    whenDefined: "You have a consistent ability to organize information into logical frameworks. Your opinions and detailed analysis are valuable when invited."
  },
  "18-58": {
    description: "The Channel of Judgement connects the Spleen to the Root. This is the intuitive drive to correct and improve, fueled by the joy of vitality. A critical eye for what needs fixing, combined with the energy to pursue perfection.",
    energyType: "Projected",
    whenDefined: "You have a natural ability to spot what needs improvement and the joyful energy to pursue it. Your corrections are valuable when recognized."
  },
  "19-49": {
    description: "The Channel of Synthesis connects the Root to the Solar Plexus. This is tribal sensitivity \u2014 the emotional awareness of what the community needs. It governs acceptance and rejection based on principles of care.",
    energyType: "Generated",
    whenDefined: "You are deeply sensitive to the needs of your community. Your emotional principles determine who belongs and who doesn't, synthesizing needs with values."
  },
  "20-34": {
    description: "The Channel of Charisma connects the Throat to the Sacral. Part of the Integration circuit, this is pure individual power expressed through presence. A busy, doing energy that manifests through existential action in the now.",
    energyType: "Manifested",
    whenDefined: "You have charismatic power \u2014 the ability to transform thought into action through your sacral response. Your busyness is magnetic when authentic."
  },
  "20-57": {
    description: "The Channel of the Brainwave connects the Throat to the Spleen. Part of the Integration circuit, this is intuitive penetrating awareness expressed in the moment. Survival intelligence that speaks and acts from instinct.",
    energyType: "Projected",
    whenDefined: "You have penetrating intuitive awareness that can be expressed instantly. Your splenic knowing speaks through you in the present moment."
  },
  "21-45": {
    description: "The Channel of Money connects the Heart/Ego to the Throat. This is the tribal material channel \u2014 the willpower to gather and manage resources. A natural sense for material authority and the voice to command it.",
    energyType: "Manifested",
    whenDefined: "You have willpower connected to material expression. You can naturally gather resources and exercise material authority within your domain."
  },
  "23-43": {
    description: "The Channel of Structuring connects the Throat to the Ajna. This is individual genius \u2014 inner knowing expressed as unique insight. The ability to take complex individual awareness and communicate it simply.",
    energyType: "Projected",
    whenDefined: "You have a unique way of knowing and structuring reality. Your insights can be genius-level but may seem unconventional. Wait for recognition."
  },
  "24-61": {
    description: "The Channel of Awareness connects the Ajna to the Head. This is the individual thinker \u2014 a mind driven by the pressure to understand inner truth and mystery. A contemplative, knowing awareness that returns again and again.",
    energyType: "Projected",
    whenDefined: "You have a contemplative mind that is drawn to mystery and inner truth. Your mental process cycles through ideas until deeper awareness emerges."
  },
  "25-51": {
    description: "The Channel of Initiation connects the G Center to the Heart/Ego. This is individual willpower connected to universal love \u2014 the energy to initiate and compete, driven by spirit rather than ego. The warrior of love.",
    energyType: "Projected",
    whenDefined: "You carry the energy of spiritual initiation. Your willpower is connected to universal love, giving you the courage to compete and initiate from the heart."
  },
  "26-44": {
    description: "The Channel of Surrender connects the Heart/Ego to the Spleen. This is the tribal transmitter \u2014 ego willpower combined with instinctive pattern recognition. The ability to sell, influence, and manage tribal resources.",
    energyType: "Projected",
    whenDefined: "You have a natural ability to recognize patterns and transmit tribal values. Your instinctive awareness of what works makes you a natural manager or salesperson."
  },
  "27-50": {
    description: "The Channel of Preservation connects the Sacral to the Spleen. This is tribal custodianship \u2014 the sacral energy to care for and nourish, combined with the intuitive awareness of what preserves and protects the community.",
    energyType: "Generated",
    whenDefined: "You are a natural custodian of your community. You have the energy and instinct to nurture, protect, and maintain the wellbeing of those you care for."
  },
  "28-38": {
    description: "The Channel of Struggle connects the Spleen to the Root. This is the individual struggle for meaning \u2014 the intuitive fight for what matters. A deep drive to find purpose through persistent effort and perseverance.",
    energyType: "Projected",
    whenDefined: "You are designed to struggle for meaning. Your stubbornness in pursuing what matters is the pathway to finding your deepest purpose in life."
  },
  "29-46": {
    description: "The Channel of Discovery connects the Sacral to the G Center. This is commitment to body experience \u2014 the sacral energy that commits fully to experiences that lead to self-discovery. Success through total immersion.",
    energyType: "Generated",
    whenDefined: "You succeed where others fail through full commitment. Your sacral energy committed to physical experience creates serendipitous discovery."
  },
  "30-41": {
    description: "The Channel of Recognition connects the Solar Plexus to the Root. This is emotional desire driving new experiences \u2014 the imagination and longing that fuels the drive for new feelings. Fantasy that seeks recognition through experience.",
    energyType: "Generated",
    whenDefined: "You carry a powerful emotional drive for new experiences. Your desires and fantasies fuel your search for meaningful feelings and recognition."
  },
  "32-54": {
    description: "The Channel of Transformation connects the Spleen to the Root. This is tribal ambition \u2014 the instinctive drive to transform and rise through persistent effort. Material ambition guided by survival awareness.",
    energyType: "Projected",
    whenDefined: "You have the instinct and drive for material transformation. Your ambition is guided by intuitive awareness of what will endure and succeed."
  },
  "34-57": {
    description: "The Channel of Power connects the Sacral to the Spleen. Part of the Integration circuit, this is archetypal power \u2014 pure sacral life force combined with intuitive awareness. The most powerful energy for individual survival.",
    energyType: "Generated",
    whenDefined: "You carry archetypal power \u2014 intuitive sacral energy that responds instinctively in the moment. This is one of the most powerful life forces in Human Design."
  },
  "35-36": {
    description: "The Channel of Transitoriness connects the Throat to the Solar Plexus. This is the jack-of-all-trades \u2014 the drive to accumulate a wide range of experiences. Emotional energy that moves from crisis to experience to new beginnings.",
    energyType: "Manifested",
    whenDefined: "You are designed for a wide range of experiences. Your emotional energy drives you from one experience to another, accumulating wisdom through variety."
  },
  "37-40": {
    description: "The Channel of Community connects the Solar Plexus to the Heart/Ego. This is the tribal bargain \u2014 emotional bonds combined with willpower. Community is built through mutual agreements: I provide if you provide.",
    energyType: "Projected",
    whenDefined: "You have the emotional bonds and willpower for community building. Your relationships operate through bargains \u2014 clear agreements about giving and receiving."
  },
  "39-55": {
    description: "The Channel of Emoting connects the Root to the Solar Plexus. This is individual moodiness \u2014 the pulse of creative emotional energy. Provocation that stirs the spirit, moving between melancholy and ecstasy.",
    energyType: "Generated",
    whenDefined: "You carry a deep emotional pulse between provocation and spirit. Your moods are creative \u2014 both melancholy and ecstasy fuel your individual emotional depth."
  },
  "42-53": {
    description: "The Channel of Maturation connects the Sacral to the Root. This is the collective cycle of beginning and completion. The pressure to start new things meets the sacral energy to see them through to maturity.",
    energyType: "Generated",
    whenDefined: "You are designed for complete cycles \u2014 starting and finishing. Your growth comes through seeing processes through to their natural completion."
  },
  "47-64": {
    description: "The Channel of Abstraction connects the Ajna to the Head. This is the abstract mind processing confusion into realization. Mental pressure to make sense of the past, transforming memory and experience into understanding.",
    energyType: "Projected",
    whenDefined: "You have a powerful abstract mind that processes past experiences into meaning. Confusion resolves into realization through your natural mental processing."
  }
};

// worker/mcp.js
var BIRTH_INPUT_SCHEMA = {
  type: "object",
  properties: {
    birthDate: { type: "string", description: "YYYY-MM-DD (local date of birth)" },
    birthTime: { type: "string", description: "HH:MM 24h local. Omit if unknown (noon is used and noted \u2014 minutes matter in Human Design)." },
    place: { type: "string", description: 'Birth place, e.g. "Boulder, Colorado". Geocoded server-side; the historical UTC offset at the birth moment is resolved automatically (handles DST and timezone history). Preferred over utcOffset.' },
    lat: { type: "number", description: "Latitude \u2014 only needed if place is not given" },
    lon: { type: "number", description: "Longitude \u2014 only needed if place is not given" },
    utcOffset: { type: "number", description: "UTC offset in hours at the birth moment (e.g. -6, 5.5). Only use when place is unavailable \u2014 you must account for historical DST yourself." }
  },
  required: ["birthDate"]
};
async function geocodeFlexible(placeStr) {
  let places = await searchPlaces(placeStr, 5);
  if (places.length || !placeStr.includes(",")) return places;
  const [head, ...rest] = placeStr.split(",").map((s) => s.trim());
  places = await searchPlaces(head, 10);
  const qualifier = rest.join(" ").toLowerCase();
  if (!places.length || !qualifier) return places;
  const qualifierTokens = qualifier.split(/[\s,]+/).filter(Boolean);
  const matches = places.filter((p) => {
    const lbl = p.label.toLowerCase();
    return qualifierTokens.some((tok) => lbl.includes(tok));
  });
  return matches.length ? matches : places;
}
__name(geocodeFlexible, "geocodeFlexible");
async function resolveBirth(input, label = "birth") {
  if (!input || typeof input !== "object") throw new Error(`${label}: expected an object`);
  const { birthDate } = input;
  if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    throw new Error(`${label}.birthDate must be YYYY-MM-DD`);
  }
  const timeUnknown = !input.birthTime;
  const birthTime = input.birthTime && /^\d{1,2}:\d{2}$/.test(input.birthTime) ? input.birthTime : "12:00";
  let utcOffset = typeof input.utcOffset === "number" ? input.utcOffset : null;
  let placeNote = null;
  if (utcOffset === null && input.place) {
    const places = await geocodeFlexible(input.place);
    if (!places.length) throw new Error(`${label}.place: no match found for "${input.place}" \u2014 try a larger nearby city or pass utcOffset directly`);
    const top = places[0];
    utcOffset = resolveUtcOffset(birthDate, birthTime, top.timezone);
    placeNote = {
      resolved: top.label,
      ianaTimezone: top.timezone,
      utcOffsetAtBirth: utcOffset,
      lat: top.latitude,
      lon: top.longitude,
      ...places.length > 1 ? { otherCandidates: places.slice(1, 4).map((p) => p.label) } : {}
    };
  }
  if (utcOffset === null) {
    throw new Error(`${label}: provide either place (preferred) or utcOffset`);
  }
  const [h, m] = birthTime.split(":").map(Number);
  return {
    birthDate,
    birthTime,
    birthHour: h + (m || 0) / 60,
    timeUnknown,
    utcOffset,
    placeNote
  };
}
__name(resolveBirth, "resolveBirth");
var actMap = /* @__PURE__ */ __name((gates) => {
  const out = {};
  for (const [planet, g] of Object.entries(gates)) {
    if (g) out[planet] = `${g.gate}.${g.line}`;
  }
  return out;
}, "actMap");
function hdSummary(chart, detail = "summary") {
  const base = {
    type: chart.type.name,
    strategy: chart.type.strategy,
    signature: chart.type.signature,
    notSelfTheme: chart.type.notSelf,
    typeMeaning: chart.type.description,
    authority: chart.authority.name,
    authorityPractice: chart.authority.description,
    profile: `${chart.profile.numbers} ${chart.profile.name}`,
    profileTheme: chart.profile.theme,
    definition: chart.definition,
    incarnationCross: chart.incarnationCross?.fullName,
    variable: {
      notation: chart.variable?.notation,
      determination: chart.variable?.determination?.name,
      environment: chart.variable?.environment?.name,
      motivation: chart.variable?.motivation?.name,
      perspective: chart.variable?.perspective?.name,
      cognition: chart.variable?.determination?.cognition?.name
    },
    centers: {
      defined: chart.centers.definedNames,
      undefined: chart.centers.undefinedNames,
      open: chart.centers.openNames
    },
    channels: chart.channels.map((ch) => ({
      channel: `${ch.gates[0]}-${ch.gates[1]}`,
      name: ch.name,
      circuit: ch.circuit,
      keynote: CHANNEL_DESCRIPTIONS[`${ch.gates[0]}-${ch.gates[1]}`]?.whenDefined || ch.theme
    })),
    activations: {
      personality: actMap(chart.gates.personality),
      design: actMap(chart.gates.design)
    },
    designDate: chart.positions?.design?.date
  };
  if (detail === "full") {
    base.substructure = {
      personality: Object.fromEntries(Object.entries(chart.gates.personality).filter(([, g]) => g).map(([p, g]) => [p, { gate: g.gate, line: g.line, color: g.color, tone: g.tone, base: g.base }])),
      design: Object.fromEntries(Object.entries(chart.gates.design).filter(([, g]) => g).map(([p, g]) => [p, { gate: g.gate, line: g.line, color: g.color, tone: g.tone, base: g.base }]))
    };
    base.gateKeynotes = Object.fromEntries(chart.gates.all.map((g) => [g, GATE_DESCRIPTIONS[g]?.keynote || GATES[g]?.name]));
  }
  return base;
}
__name(hdSummary, "hdSummary");
function gkSummary(gk) {
  const sphere = /* @__PURE__ */ __name((s) => s ? { key: s.keyLine || s.key, shadow: s.shadow, gift: s.gift, siddhi: s.siddhi } : null, "sphere");
  return {
    activationSequence: {
      lifeWork: sphere(gk.activationSequence.lifeWork),
      evolution: sphere(gk.activationSequence.evolution),
      radiance: sphere(gk.activationSequence.radiance),
      purpose: sphere(gk.activationSequence.purpose)
    },
    venusSequence: {
      attraction: sphere(gk.venusSequence.attraction),
      iq: sphere(gk.venusSequence.iq),
      eq: sphere(gk.venusSequence.eq),
      sq: sphere(gk.venusSequence.sq)
    },
    pearlSequence: {
      vocation: sphere(gk.pearlSequence.vocation),
      culture: sphere(gk.pearlSequence.culture),
      pearl: sphere(gk.pearlSequence.pearl)
    }
  };
}
__name(gkSummary, "gkSummary");
function astroSummary(a) {
  return {
    sun: a.sun?.sign?.name || a.sun?.sign,
    moon: a.moon?.sign?.name || a.moon?.sign,
    rising: a.rising?.sign?.name || a.rising?.sign || "needs lat/lon",
    planets: Object.fromEntries(Object.entries(a.planets || {}).map(([p, v]) => [p, `${v.sign?.name || v.sign} ${v.degree || ""}`.trim()]))
  };
}
__name(astroSummary, "astroSummary");
var json = /* @__PURE__ */ __name((obj) => ({ content: [{ type: "text", text: JSON.stringify(obj, null, 1) }] }), "json");
var errText = /* @__PURE__ */ __name((msg) => ({ content: [{ type: "text", text: `Error: ${msg}` }], isError: true }), "errText");
function birthMeta(b) {
  return {
    input: { birthDate: b.birthDate, birthTime: b.timeUnknown ? "unknown (noon used \u2014 line-level details may be unreliable)" : b.birthTime, utcOffset: b.utcOffset },
    ...b.placeNote ? { place: b.placeNote } : {}
  };
}
__name(birthMeta, "birthMeta");
var TOOLS = [
  {
    name: "compute_chart",
    description: 'Compute a chart from birth data. Human Design by default; add "gene_keys" and/or "astrology" to systems for those views of the same birth moment. One call returns the complete picture including interpretive keynotes \u2014 prefer detail:"summary" unless line/color/tone/base substructure is needed.',
    inputSchema: {
      type: "object",
      properties: {
        birth: BIRTH_INPUT_SCHEMA,
        systems: {
          type: "array",
          items: { type: "string", enum: ["human_design", "gene_keys", "astrology"] },
          description: 'Default ["human_design"]'
        },
        detail: { type: "string", enum: ["summary", "full"], description: "full adds per-planet color/tone/base substructure and gate keynotes" }
      },
      required: ["birth"]
    },
    async handler({ birth, systems = ["human_design"], detail = "summary" }) {
      const b = await resolveBirth(birth);
      const hd = humandesign_default(b.birthDate, b.birthHour, b.utcOffset);
      const out = { ...birthMeta(b) };
      if (systems.includes("human_design")) out.humanDesign = hdSummary(hd, detail);
      if (systems.includes("gene_keys")) out.geneKeys = gkSummary(calculateGeneKeys(hd));
      if (systems.includes("astrology")) {
        const lat = birth.lat ?? b.placeNote?.lat ?? null;
        const lon = birth.lon ?? b.placeNote?.lon ?? null;
        out.astrology = astroSummary(astrology_default(b.birthDate, b.birthHour, b.utcOffset, lat, lon));
      }
      return json(out);
    }
  },
  {
    name: "compare_charts",
    description: "Human Design connection analysis between two people: electromagnetic (attraction \u2014 each has half a channel), companionship (both whole), compromise and dominance channels, composite type, and a relationship summary.",
    inputSchema: {
      type: "object",
      properties: {
        personA: BIRTH_INPUT_SCHEMA,
        personB: BIRTH_INPUT_SCHEMA
      },
      required: ["personA", "personB"]
    },
    async handler({ personA, personB }) {
      const [a, b] = await Promise.all([resolveBirth(personA, "personA"), resolveBirth(personB, "personB")]);
      const chartA = humandesign_default(a.birthDate, a.birthHour, a.utcOffset);
      const chartB = humandesign_default(b.birthDate, b.birthHour, b.utcOffset);
      const cmp = compareHumanDesign(chartA, chartB);
      const cc = cmp.connectionChart;
      const connList = /* @__PURE__ */ __name((items) => items.map((c) => ({ channel: `${c.channel} (${c.gates.join("-")})`, meaning: c.description })), "connList");
      return json({
        personA: { ...birthMeta(a), type: chartA.type.name, profile: chartA.profile.numbers, authority: chartA.authority.name },
        personB: { ...birthMeta(b), type: chartB.type.name, profile: chartB.profile.numbers, authority: chartB.authority.name },
        compositeType: cc.compositeType,
        typeDynamic: cmp.typeInteraction?.dynamic,
        electromagnetic: connList(cc.connections.electromagnetic),
        companionship: connList(cc.connections.companionship),
        compromise: connList(cc.connections.compromise),
        dominance: connList(cc.connections.dominance),
        summary: cmp.summary
      });
    }
  },
  {
    name: "get_transits",
    description: "How current (or any date's) planetary transits interact with a person's Human Design chart: channel completions (temporary definition), temporarily defined centers, reinforced gates.",
    inputSchema: {
      type: "object",
      properties: {
        birth: BIRTH_INPUT_SCHEMA,
        date: { type: "string", description: "YYYY-MM-DD, default today (UTC)" }
      },
      required: ["birth"]
    },
    async handler({ birth, date: date3 }) {
      const b = await resolveBirth(birth);
      const chart = humandesign_default(b.birthDate, b.birthHour, b.utcOffset);
      const d = date3 && /^\d{4}-\d{2}-\d{2}$/.test(date3) ? date3 : (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const t = calculateHDTransits(chart, d);
      return json({
        ...birthMeta(b),
        natalType: chart.type.name,
        transitDate: d,
        transitSun: `Gate ${t.highlights.sun.gate}.${t.highlights.sun.line} \u2014 ${t.highlights.sun.gateName}`,
        transitMoon: `Gate ${t.highlights.moon.gate}.${t.highlights.moon.line} \u2014 ${t.highlights.moon.gateName}`,
        channelCompletions: t.channelCompletions.map((c) => ({
          channel: `${c.channel} (${c.gates.join("-")})`,
          how: c.natalGate ? `natal Gate ${c.natalGate} completed by transit Gate ${c.transitGate} (${c.transitPlanet})` : "pure transit channel",
          significance: c.significance
        })),
        temporarilyDefinedCenters: t.temporarilyDefinedCenters.map((c) => ({ center: c.centerName, theme: c.theme })),
        reinforcedGates: t.reinforcedGates.slice(0, 8).map((g) => `Gate ${g.gate} \u2014 ${g.gateName}`)
      });
    }
  },
  {
    name: "analyze_team",
    description: "Human Design group/Penta analysis for 2-9 people: group type, filled and missing team roles, electromagnetic connections between members, recommendations.",
    inputSchema: {
      type: "object",
      properties: {
        members: {
          type: "array",
          minItems: 2,
          maxItems: 9,
          items: {
            type: "object",
            properties: { name: { type: "string" }, ...BIRTH_INPUT_SCHEMA.properties },
            required: ["birthDate"]
          }
        }
      },
      required: ["members"]
    },
    async handler({ members }) {
      if (!Array.isArray(members) || members.length < 2) throw new Error("members: need at least 2 people");
      const resolved = await Promise.all(members.map((m, i) => resolveBirth(m, m.name || `member ${i + 1}`)));
      const charts = resolved.map((b) => humandesign_default(b.birthDate, b.birthHour, b.utcOffset));
      const names = members.map((m, i) => m.name || `Person ${i + 1}`);
      const r = analyzePenta(charts, names);
      return json({
        members: names.map((n, i) => ({ name: n, type: charts[i].type.name, profile: charts[i].profile.numbers })),
        groupType: r.groupType,
        isPenta: r.isPenta,
        filledRoles: r.filledRoles.map((x) => ({ role: x.role, by: x.contributors, meaning: x.description })),
        missingRoles: r.missingRoles.map((x) => ({ role: x.role, suggestion: x.suggestion })),
        electromagnetics: r.electromagnetics.slice(0, 10).map((e) => ({ channel: e.channel, between: [e.personA, e.personB], theme: e.theme })),
        recommendations: r.recommendations.map((x) => x.insight)
      });
    }
  },
  {
    name: "get_descriptions",
    description: 'Interpretive reference text for Human Design elements \u2014 use for follow-up depth questions ("what does Gate 34 mean?") without recomputing a chart. Free (not metered).',
    inputSchema: {
      type: "object",
      properties: {
        gates: { type: "array", items: { type: "integer", minimum: 1, maximum: 64 }, description: "Gate numbers" },
        channels: { type: "array", items: { type: "string" }, description: 'Channel keys like "20-34"' },
        centers: { type: "array", items: { type: "string", enum: Object.keys(CENTERS) }, description: "Center keys" }
      }
    },
    async handler({ gates = [], channels = [], centers = [] }) {
      const out = {};
      if (gates.length) {
        out.gates = Object.fromEntries(gates.filter((g) => GATE_DESCRIPTIONS[g]).map((g) => [g, {
          name: GATES[g]?.name,
          keynote: GATE_DESCRIPTIONS[g].keynote,
          description: GATE_DESCRIPTIONS[g].description,
          harmonicGate: GATE_DESCRIPTIONS[g].harmonic,
          center: GATES[g]?.center
        }]));
      }
      if (channels.length) {
        out.channels = Object.fromEntries(channels.map((k) => [k, CHANNEL_DESCRIPTIONS[k] || CHANNEL_DESCRIPTIONS[k.split("-").reverse().join("-")]]).filter(([, v]) => v).map(([k, v]) => [k, { description: v.description, whenDefined: v.whenDefined }]));
      }
      if (centers.length) {
        out.centers = Object.fromEntries(centers.filter((c) => CENTERS[c]).map((c) => [c, {
          name: CENTERS[c].name,
          theme: CENTERS[c].theme,
          defined: CENTERS[c].definedMeaning,
          undefined: CENTERS[c].undefinedMeaning,
          notSelfQuestion: CENTERS[c].notSelfQuestion
        }]));
      }
      if (!Object.keys(out).length) throw new Error("pass at least one of gates, channels, centers");
      return json(out);
    }
  }
];
function buildServer() {
  const server = new Server(
    { name: "open-human-design", version: "0.3.0" },
    { capabilities: { tools: {} } }
  );
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema }))
  }));
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = TOOLS.find((t) => t.name === request.params.name);
    if (!tool) return errText(`Unknown tool: ${request.params.name}`);
    try {
      return await tool.handler(request.params.arguments || {});
    } catch (err) {
      return errText(err.message || String(err));
    }
  });
  return server;
}
__name(buildServer, "buildServer");
async function handleMcpRequest(request) {
  const server = buildServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: void 0,
    // stateless — fresh instance per request
    enableJsonResponse: true
  });
  await server.connect(transport);
  return transport.handleRequest(request);
}
__name(handleMcpRequest, "handleMcpRequest");

// worker/index.js
var CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version",
  "Access-Control-Expose-Headers": "Mcp-Session-Id"
};
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/mcp") {
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
      }
      const response = await handleMcpRequest(request);
      const headers = new Headers(response.headers);
      for (const [k, v] of Object.entries(CORS_HEADERS)) headers.set(k, v);
      return new Response(response.body, { status: response.status, headers });
    }
    return env.ASSETS.fetch(request);
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_modules_watch_stub();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error2 = reduceError(e);
    return Response.json(error2, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-EuOp2A/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-EuOp2A/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
/*! Bundled license information:

astronomy-engine/esm/astronomy.js:
  (**
      @preserve
  
      Astronomy library for JavaScript (browser and Node.js).
      https://github.com/cosinekitty/astronomy
  
      MIT License
  
      Copyright (c) 2019-2023 Don Cross <cosinekitty@gmail.com>
  
      Permission is hereby granted, free of charge, to any person obtaining a copy
      of this software and associated documentation files (the "Software"), to deal
      in the Software without restriction, including without limitation the rights
      to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
      copies of the Software, and to permit persons to whom the Software is
      furnished to do so, subject to the following conditions:
  
      The above copyright notice and this permission notice shall be included in all
      copies or substantial portions of the Software.
  
      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
      OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
      SOFTWARE.
  *)
  (**
   * @fileoverview Astronomy calculation library for browser scripting and Node.js.
   * @author Don Cross <cosinekitty@gmail.com>
   * @license MIT
   *)
*/
//# sourceMappingURL=index.js.map
