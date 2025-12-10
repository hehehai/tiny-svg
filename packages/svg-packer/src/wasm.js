var Module = typeof Module != "undefined" ? Module : {};

let wasmMemory;
let ABORT = false;
let HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

function updateMemoryViews() {
  const b = wasmMemory.buffer;
  Module.HEAP8 = HEAP8 = new Int8Array(b);
  Module.HEAP16 = HEAP16 = new Int16Array(b);
  Module.HEAPU8 = HEAPU8 = new Uint8Array(b);
  Module.HEAPU16 = HEAPU16 = new Uint16Array(b);
  Module.HEAP32 = HEAP32 = new Int32Array(b);
  Module.HEAPU32 = HEAPU32 = new Uint32Array(b);
  Module.HEAPF32 = HEAPF32 = new Float32Array(b);
  Module.HEAPF64 = HEAPF64 = new Float64Array(b);
}

const __ATPRERUN__ = [];
const __ATINIT__ = [];
const __ATPOSTRUN__ = [];

function preRun() {
  if (Module.preRun) {
    if (typeof Module.preRun == "function") Module.preRun = [Module.preRun];
    while (Module.preRun.length) {
      addOnPreRun(Module.preRun.shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
  callRuntimeCallbacks(__ATINIT__);
}

function postRun() {
  if (Module.postRun) {
    if (typeof Module.postRun == "function") Module.postRun = [Module.postRun];
    while (Module.postRun.length) {
      addOnPostRun(Module.postRun.shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}

let runDependencies = 0;
let runDependencyWatcher = null;
let dependenciesFulfilled = null;

function addRunDependency(id) {
  runDependencies++;
  Module.monitorRunDependencies?.(runDependencies);
}

function removeRunDependency(id) {
  runDependencies--;
  Module.monitorRunDependencies?.(runDependencies);
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      const callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback();
    }
  }
}

function abort(what) {
  Module.onAbort?.(what);
  what = `Aborted(${what})`;
  err(what);
  ABORT = true;
  what += ". Build with -sASSERTIONS for more info.";
  const e = new WebAssembly.RuntimeError(what);
  throw e;
}

function getWasmImports() {
  return {
    env: wasmImports,
    wasi_snapshot_preview1: wasmImports,
    memory: new WebAssembly.Memory({ initial: 10, maximum: 100 }),
  };
}

let wasmUrl;
const wasmPromise = async () => {
  const url = wasmUrl?.default || wasmUrl;

  // For data URLs, convert to ArrayBuffer directly without fetch
  if (url && url.startsWith('data:')) {
    const base64 = url.split(',')[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  return fetch(url);
};

async function loadWasmModule(info) {
  if (Module.wasmExports) {
    return [Module.wasmExports, undefined];
  }
  try {
    const response = await wasmPromise();

    // Handle ArrayBuffer (from data URL)
    if (response instanceof ArrayBuffer) {
      const { instance, module } = await WebAssembly.instantiate(
        response,
        info
      );
      console.log("WebAssembly module successfully loaded and instantiated.");
      console.log("WASM Instance:", instance);
      return [instance, module];
    }

    // Handle Response (from fetch)
    if (!response) {
      throw new Error("no response when fetching WASM file");
    }

    if (!response.ok) {
      throw new Error(
        `error fetching WASM file: ${response.status} ${response.statusText}`
      );
    }
    const { instance, module } = await WebAssembly.instantiateStreaming(
      response,
      info
    );

    console.log("WebAssembly module successfully loaded and instantiated.");
    console.log("WASM Instance:", instance);
    return [instance, module];
  } catch (error) {
    console.error(
      "Error loading or instantiating the WebAssembly module:",
      error
    );
    throw error;
  }
}

async function createWasm() {
  const info = getWasmImports();

  function receiveInstance(instance, module) {
    wasmExports = instance.exports;
    wasmMemory = wasmExports.memory;
    updateMemoryViews();
    wasmTable = wasmExports.__indirect_function_table;
    addOnInit(wasmExports.__wasm_call_ctors);
    removeRunDependency("wasm-instantiate");
    return wasmExports;
  }

  addRunDependency("wasm-instantiate");
  const result = await loadWasmModule(info);
  return receiveInstance(result[0]);
}

var callRuntimeCallbacks = (callbacks) => {
  while (callbacks.length > 0) {
    callbacks.shift()(Module);
  }
};

function getValue(ptr, type = "i8") {
  if (type.endsWith("*")) type = "*";
  switch (type) {
    case "i1":
      return HEAP8[ptr];
    case "i8":
      return HEAP8[ptr];
    case "i16":
      return HEAP16[ptr >> 1];
    case "i32":
      return HEAP32[ptr >> 2];
    case "i64":
      abort("to do getValue(i64) use WASM_BIGINT");
    case "float":
      return HEAPF32[ptr >> 2];
    case "double":
      return HEAPF64[ptr >> 3];
    case "*":
      return HEAPU32[ptr >> 2];
    default:
      abort(`invalid type for getValue: ${type}`);
  }
}

const noExitRuntime = true;
const UTF8Decoder =
  typeof TextDecoder != "undefined" ? new TextDecoder() : undefined;

function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
  const endIdx = idx + maxBytesToRead;
  let endPtr = idx;
  while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
  if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
    return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
  }
  let str = "";
  while (idx < endPtr) {
    let u0 = heapOrArray[idx++];
    if (!(u0 & 128)) {
      str += String.fromCharCode(u0);
      continue;
    }
    const u1 = heapOrArray[idx++] & 63;
    if ((u0 & 224) == 192) {
      str += String.fromCharCode(((u0 & 31) << 6) | u1);
      continue;
    }
    const u2 = heapOrArray[idx++] & 63;
    if ((u0 & 240) == 224) {
      u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
    } else {
      u0 =
        ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
    }
    if (u0 < 65_536) {
      str += String.fromCharCode(u0);
    } else {
      const ch = u0 - 65_536;
      str += String.fromCharCode(55_296 | (ch >> 10), 56_320 | (ch & 1023));
    }
  }
  return str;
}

const UTF8ToString = (ptr, maxBytesToRead) =>
  ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";

function ___assert_fail(condition, filename, line, func) {
  abort(
    `Assertion failed: ${UTF8ToString(condition)}, at: ${[filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"]}`
  );
}

class ExceptionInfo {
  constructor(excPtr) {
    this.excPtr = excPtr;
    this.ptr = excPtr - 24;
  }

  set_type(type) {
    HEAPU32[(this.ptr + 4) >> 2] = type;
  }

  get_type() {
    return HEAPU32[(this.ptr + 4) >> 2];
  }

  set_destructor(destructor) {
    HEAPU32[(this.ptr + 8) >> 2] = destructor;
  }

  get_destructor() {
    return HEAPU32[(this.ptr + 8) >> 2];
  }

  set_caught(caught) {
    caught = caught ? 1 : 0;
    HEAP8[this.ptr + 12] = caught;
  }

  get_caught() {
    return HEAP8[this.ptr + 12] != 0;
  }

  set_rethrown(rethrown) {
    rethrown = rethrown ? 1 : 0;
    HEAP8[this.ptr + 13] = rethrown;
  }

  get_rethrown() {
    return HEAP8[this.ptr + 13] != 0;
  }

  init(type, destructor) {
    this.set_adjusted_ptr(0);
    this.set_type(type);
    this.set_destructor(destructor);
  }

  set_adjusted_ptr(adjustedPtr) {
    HEAPU32[(this.ptr + 16) >> 2] = adjustedPtr;
  }

  get_adjusted_ptr() {
    return HEAPU32[(this.ptr + 16) >> 2];
  }

  get_exception_ptr() {
    const isPointer = ___cxa_is_pointer_type(this.get_type());
    if (isPointer) {
      return HEAPU32[this.excPtr >> 2];
    }
    const adjusted = this.get_adjusted_ptr();
    if (adjusted !== 0) return adjusted;
    return this.excPtr;
  }
}

let exceptionLast = 0;
let uncaughtExceptionCount = 0;

function ___cxa_throw(ptr, type, destructor) {
  const info = new ExceptionInfo(ptr);
  info.init(type, destructor);
  exceptionLast = ptr;
  uncaughtExceptionCount++;
  throw exceptionLast;
}

function __abort_js() {
  abort("");
}

function __embind_register_bigint(
  primitiveType,
  name,
  size,
  minRange,
  maxRange
) {}

function embind_init_charCodes() {
  const codes = Array.from({ length: 256 });
  for (let i = 0; i < 256; ++i) {
    codes[i] = String.fromCharCode(i);
  }
  embind_charCodes = codes;
}

let embind_charCodes;

function readLatin1String(ptr) {
  let ret = "";
  let c = ptr;
  while (HEAPU8[c]) {
    ret += embind_charCodes[HEAPU8[c++]];
  }
  return ret;
}

const awaitingDependencies = {};
const registeredTypes = {};
const typeDependencies = {};
let BindingError;

function throwBindingError(message) {
  throw new BindingError(message);
}

let InternalError;

function throwInternalError(message) {
  throw new InternalError(message);
}

function whenDependentTypesAreResolved(
  myTypes,
  dependentTypes,
  getTypeConverters
) {
  myTypes.forEach((type) => {
    typeDependencies[type] = dependentTypes;
  });

  function onComplete(typeConverters) {
    const myTypeConverters = getTypeConverters(typeConverters);
    if (myTypeConverters.length !== myTypes.length) {
      throwInternalError("Mismatched type converter count");
    }
    for (let i = 0; i < myTypes.length; ++i) {
      registerType(myTypes[i], myTypeConverters[i]);
    }
  }

  const typeConverters = Array.from({ length: dependentTypes.length });
  const unregisteredTypes = [];
  let registered = 0;
  dependentTypes.forEach((dt, i) => {
    if (Object.hasOwn(registeredTypes, dt)) {
      typeConverters[i] = registeredTypes[dt];
    } else {
      unregisteredTypes.push(dt);
      if (!Object.hasOwn(awaitingDependencies, dt)) {
        awaitingDependencies[dt] = [];
      }
      awaitingDependencies[dt].push(() => {
        typeConverters[i] = registeredTypes[dt];
        ++registered;
        if (registered === unregisteredTypes.length) {
          onComplete(typeConverters);
        }
      });
    }
  });
  if (unregisteredTypes.length === 0) {
    onComplete(typeConverters);
  }
}

function sharedRegisterType(rawType, registeredInstance, options = {}) {
  const name = registeredInstance.name;
  if (!rawType) {
    throwBindingError(
      `type "${name}" must have a positive integer typeid pointer`
    );
  }
  if (Object.hasOwn(registeredTypes, rawType)) {
    if (options.ignoreDuplicateRegistrations) {
      return;
    }
    throwBindingError(`Cannot register type '${name}' twice`);
  }
  registeredTypes[rawType] = registeredInstance;
  delete typeDependencies[rawType];
  if (Object.hasOwn(awaitingDependencies, rawType)) {
    const callbacks = awaitingDependencies[rawType];
    delete awaitingDependencies[rawType];
    callbacks.forEach((cb) => cb());
  }
}

function registerType(rawType, registeredInstance, options = {}) {
  if (!("argPackAdvance" in registeredInstance)) {
    throw new TypeError(
      "registerType registeredInstance requires argPackAdvance"
    );
  }
  return sharedRegisterType(rawType, registeredInstance, options);
}

const GenericWireTypeSize = 8;

function __embind_register_bool(rawType, name, trueValue, falseValue) {
  name = readLatin1String(name);
  registerType(rawType, {
    name,
    fromWireType(wt) {
      return !!wt;
    },
    toWireType(destructors, o) {
      return o ? trueValue : falseValue;
    },
    argPackAdvance: GenericWireTypeSize,
    readValueFromPointer(pointer) {
      return this.fromWireType(HEAPU8[pointer]);
    },
    destructorFunction: null,
  });
}

const emval_freelist = [];
const emval_handles = [];

function __emval_decref(handle) {
  if (handle > 9 && --emval_handles[handle + 1] === 0) {
    emval_handles[handle] = undefined;
    emval_freelist.push(handle);
  }
}

const count_emval_handles = () =>
  emval_handles.length / 2 - 5 - emval_freelist.length;

function init_emval() {
  emval_handles.push(0, 1, undefined, 1, null, 1, true, 1, false, 1);
  Module.count_emval_handles = count_emval_handles;
}

const Emval = {
  toValue: (handle) => {
    if (!handle) {
      throwBindingError(`Cannot use deleted val. handle = ${handle}`);
    }
    return emval_handles[handle];
  },
  toHandle: (value) => {
    switch (value) {
      case undefined:
        return 2;
      case null:
        return 4;
      case true:
        return 6;
      case false:
        return 8;
      default: {
        const handle = emval_freelist.pop() || emval_handles.length;
        emval_handles[handle] = value;
        emval_handles[handle + 1] = 1;
        return handle;
      }
    }
  },
};

function readPointer(pointer) {
  return this.fromWireType(HEAPU32[pointer >> 2]);
}

const EmValType = {
  name: "emscripten::val",
  fromWireType: (handle) => {
    const rv = Emval.toValue(handle);
    __emval_decref(handle);
    return rv;
  },
  toWireType: (destructors, value) => Emval.toHandle(value),
  argPackAdvance: GenericWireTypeSize,
  readValueFromPointer: readPointer,
  destructorFunction: null,
};
const __embind_register_emval = (rawType) => registerType(rawType, EmValType);

function floatReadValueFromPointer(name, width) {
  switch (width) {
    case 4:
      return function (pointer) {
        return this.fromWireType(HEAPF32[pointer >> 2]);
      };
    case 8:
      return function (pointer) {
        return this.fromWireType(HEAPF64[pointer >> 3]);
      };
    default:
      throw new TypeError(`invalid float width (${width}): ${name}`);
  }
}

function __embind_register_float(rawType, name, size) {
  name = readLatin1String(name);
  registerType(rawType, {
    name,
    fromWireType: (value) => value,
    toWireType: (destructors, value) => value,
    argPackAdvance: GenericWireTypeSize,
    readValueFromPointer: floatReadValueFromPointer(name, size),
    destructorFunction: null,
  });
}

const createNamedFunction = (name, body) =>
  Object.defineProperty(body, "name", { value: name });

function runDestructors(destructors) {
  while (destructors.length) {
    const ptr = destructors.pop();
    const del = destructors.pop();
    del(ptr);
  }
}

function usesDestructorStack(argTypes) {
  for (let i = 1; i < argTypes.length; ++i) {
    if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) {
      return true;
    }
  }
  return false;
}

function newFunc(constructor, argumentList) {
  if (!(typeof constructor === "function")) {
    throw new TypeError(
      `new_ called with constructor type ${typeof constructor} which is not a function`
    );
  }
  const dummy = createNamedFunction(
    constructor.name || "unknownFunctionName",
    () => {}
  );
  dummy.prototype = constructor.prototype;
  const obj = new dummy();
  const r = constructor.apply(obj, argumentList);
  return r instanceof Object ? r : obj;
}

function createJsInvoker(argTypes, isClassMethodFunc, returns, isAsync) {
  const needsDestructorStack = usesDestructorStack(argTypes);
  const argCount = argTypes.length;
  let argsList = "";
  let argsListWired = "";
  for (var i = 0; i < argCount - 2; ++i) {
    argsList += `${i !== 0 ? ", " : ""}arg${i}`;
    argsListWired += `${i !== 0 ? ", " : ""}arg${i}Wired`;
  }
  let invokerFnBody = `\n        return function (${argsList}) {\n        if (arguments.length !== ${argCount - 2}) {\n          throwBindingError('function ' + humanName + ' called with ' + arguments.length + ' arguments, expected ${argCount - 2}');\n        }`;
  if (needsDestructorStack) {
    invokerFnBody += "var destructors = [];\n";
  }
  const dtorStack = needsDestructorStack ? "destructors" : "null";
  const args1 = [
    "humanName",
    "throwBindingError",
    "invoker",
    "fn",
    "runDestructors",
    "retType",
    "classParam",
  ];
  if (isClassMethodFunc) {
    invokerFnBody += `var thisWired = classParam['toWireType'](${dtorStack}, this);\n`;
  }
  for (var i = 0; i < argCount - 2; ++i) {
    invokerFnBody += `var arg${i}Wired = argType${i}['toWireType'](${dtorStack}, arg${i});\n`;
    args1.push(`argType${i}`);
  }
  if (isClassMethodFunc) {
    argsListWired = `thisWired${argsListWired.length > 0 ? ", " : ""}${argsListWired}`;
  }
  invokerFnBody += `${returns || isAsync ? "var rv = " : ""}invoker(fn${argsListWired.length > 0 ? ", " : ""}${argsListWired});\n`;
  if (needsDestructorStack) {
    invokerFnBody += "runDestructors(destructors);\n";
  } else {
    for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
      const paramName = i === 1 ? "thisWired" : `arg${i - 2}Wired`;
      if (argTypes[i].destructorFunction !== null) {
        invokerFnBody += `${paramName}_dtor(${paramName});\n`;
        args1.push(`${paramName}_dtor`);
      }
    }
  }
  if (returns) {
    invokerFnBody += "var ret = retType['fromWireType'](rv);\nreturn ret;\n";
  } else {
  }
  invokerFnBody += "}\n";
  return [args1, invokerFnBody];
}

function craftInvokerFunction(
  humanName,
  argTypes,
  classType,
  cppInvokerFunc,
  cppTargetFunc,
  isAsync
) {
  const argCount = argTypes.length;
  if (argCount < 2) {
    throwBindingError(
      "argTypes array size mismatch! Must at least get return value and 'this' types!"
    );
  }
  const isClassMethodFunc = argTypes[1] !== null && classType !== null;
  const needsDestructorStack = usesDestructorStack(argTypes);
  const returns = argTypes[0].name !== "void";
  const closureArgs = [
    humanName,
    throwBindingError,
    cppInvokerFunc,
    cppTargetFunc,
    runDestructors,
    argTypes[0],
    argTypes[1],
  ];
  for (var i = 0; i < argCount - 2; ++i) {
    closureArgs.push(argTypes[i + 2]);
  }
  if (!needsDestructorStack) {
    for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
      if (argTypes[i].destructorFunction !== null) {
        closureArgs.push(argTypes[i].destructorFunction);
      }
    }
  }
  const [args, invokerFnBody] = createJsInvoker(
    argTypes,
    isClassMethodFunc,
    returns,
    isAsync
  );
  args.push(invokerFnBody);
  const invokerFn = newFunc(Function, args)(...closureArgs);
  return createNamedFunction(humanName, invokerFn);
}

function ensureOverloadTable(proto, methodName, humanName) {
  if (undefined === proto[methodName].overloadTable) {
    const prevFunc = proto[methodName];
    proto[methodName] = function (...args) {
      if (!Object.hasOwn(proto[methodName].overloadTable, args.length)) {
        throwBindingError(
          `Function '${humanName}' called with an invalid number of arguments (${args.length}) - expects one of (${proto[methodName].overloadTable})!`
        );
      }
      return proto[methodName].overloadTable[args.length].apply(this, args);
    };
    proto[methodName].overloadTable = [];
    proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
  }
}

function exposePublicSymbol(name, value, numArguments) {
  if (Object.hasOwn(Module, name)) {
    if (
      undefined === numArguments ||
      (undefined !== Module[name].overloadTable &&
        undefined !== Module[name].overloadTable[numArguments])
    ) {
      throwBindingError(`Cannot register public name '${name}' twice`);
    }
    ensureOverloadTable(Module, name, name);
    if (Object.hasOwn(Module, numArguments)) {
      throwBindingError(
        `Cannot register multiple overloads of a function with the same number of arguments (${numArguments})!`
      );
    }
    Module[name].overloadTable[numArguments] = value;
  } else {
    Module[name] = value;
    if (undefined !== numArguments) {
      Module[name].numArguments = numArguments;
    }
  }
}

function heap32VectorToArray(count, firstElement) {
  const array = [];
  for (let i = 0; i < count; i++) {
    array.push(HEAPU32[(firstElement + i * 4) >> 2]);
  }
  return array;
}

function replacePublicSymbol(name, value, numArguments) {
  if (!Object.hasOwn(Module, name)) {
    throwInternalError("Replacing nonexistent public symbol");
  }
  if (undefined !== Module[name].overloadTable && undefined !== numArguments) {
    Module[name].overloadTable[numArguments] = value;
  } else {
    Module[name] = value;
    Module[name].argCount = numArguments;
  }
}

function dynCallLegacy(sig, ptr, args) {
  sig = sig.replace(/p/g, "i");
  const f = Module[`dynCall_${sig}`];
  return f(ptr, ...args);
}

const wasmTableMirror = [];
let wasmTable;

function getWasmTableEntry(funcPtr) {
  let func = wasmTableMirror[funcPtr];
  if (!func) {
    if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
    wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
  }
  return func;
}

function dynCall(sig, ptr, args = []) {
  if (sig.includes("j")) {
    return dynCallLegacy(sig, ptr, args);
  }
  const rtn = getWasmTableEntry(ptr)(...args);
  return rtn;
}

const getDynCaller =
  (sig, ptr) =>
  (...args) =>
    dynCall(sig, ptr, args);

function embind__requireFunction(signature, rawFunction) {
  signature = readLatin1String(signature);

  function makeDynCaller() {
    if (signature.includes("j")) {
      return getDynCaller(signature, rawFunction);
    }
    return getWasmTableEntry(rawFunction);
  }

  const fp = makeDynCaller();
  if (typeof fp != "function") {
    throwBindingError(
      `unknown function pointer with signature ${signature}: ${rawFunction}`
    );
  }
  return fp;
}

function extendError(baseErrorType, errorName) {
  const errorClass = createNamedFunction(errorName, function (message) {
    this.name = errorName;
    this.message = message;
    const stack = new Error(message).stack;
    if (stack !== undefined) {
      this.stack = `${this.toString()}\n${stack.replace(/^Error(:[^\n]*)?\n/, "")}`;
    }
  });
  errorClass.prototype = Object.create(baseErrorType.prototype);
  errorClass.prototype.constructor = errorClass;
  errorClass.prototype.toString = function () {
    if (this.message === undefined) {
      return this.name;
    }
    return `${this.name}: ${this.message}`;
  };
  return errorClass;
}

let UnboundTypeError;

function getTypeName(type) {
  const ptr = ___getTypeName(type);
  const rv = readLatin1String(ptr);
  _free(ptr);
  return rv;
}

function throwUnboundTypeError(message, types) {
  const unboundTypes = [];
  const seen = {};

  function visit(type) {
    if (seen[type]) {
      return;
    }
    if (registeredTypes[type]) {
      return;
    }
    if (typeDependencies[type]) {
      typeDependencies[type].forEach(visit);
      return;
    }
    unboundTypes.push(type);
    seen[type] = true;
  }

  types.forEach(visit);
  throw new UnboundTypeError(
    `${message}: ${unboundTypes.map(getTypeName).join([", "])}`
  );
}

function getFunctionName(signature) {
  signature = signature.trim();
  const argsIndex = signature.indexOf("(");
  if (argsIndex !== -1) {
    return signature.substr(0, argsIndex);
  }
  return signature;
}

function __embind_register_function(
  name,
  argCount,
  rawArgTypesAddr,
  signature,
  rawInvoker,
  fn,
  isAsync
) {
  const argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
  name = readLatin1String(name);
  name = getFunctionName(name);
  rawInvoker = embind__requireFunction(signature, rawInvoker);
  exposePublicSymbol(
    name,
    () => {
      throwUnboundTypeError(
        `Cannot call ${name} due to unbound types`,
        argTypes
      );
    },
    argCount - 1
  );
  whenDependentTypesAreResolved([], argTypes, (argTypes) => {
    const invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
    replacePublicSymbol(
      name,
      craftInvokerFunction(
        name,
        invokerArgsArray,
        null,
        rawInvoker,
        fn,
        isAsync
      ),
      argCount - 1
    );
    return [];
  });
}

function integerReadValueFromPointer(name, width, signed) {
  switch (width) {
    case 1:
      return signed
        ? (pointer) => HEAP8[pointer]
        : (pointer) => HEAPU8[pointer];
    case 2:
      return signed
        ? (pointer) => HEAP16[pointer >> 1]
        : (pointer) => HEAPU16[pointer >> 1];
    case 4:
      return signed
        ? (pointer) => HEAP32[pointer >> 2]
        : (pointer) => HEAPU32[pointer >> 2];
    default:
      throw new TypeError(`invalid integer width (${width}): ${name}`);
  }
}

function __embind_register_integer(
  primitiveType,
  name,
  size,
  minRange,
  maxRange
) {
  name = readLatin1String(name);
  if (maxRange === -1) {
    maxRange = 4_294_967_295;
  }
  let fromWireType = (value) => value;
  if (minRange === 0) {
    const bitshift = 32 - 8 * size;
    fromWireType = (value) => (value << bitshift) >>> bitshift;
  }
  const isUnsignedType = name.includes("unsigned");
  const checkAssertions = (value, toTypeName) => {};
  let toWireType;
  if (isUnsignedType) {
    toWireType = function (destructors, value) {
      checkAssertions(value, this.name);
      return value >>> 0;
    };
  } else {
    toWireType = function (destructors, value) {
      checkAssertions(value, this.name);
      return value;
    };
  }
  registerType(primitiveType, {
    name,
    fromWireType,
    toWireType,
    argPackAdvance: GenericWireTypeSize,
    readValueFromPointer: integerReadValueFromPointer(
      name,
      size,
      minRange !== 0
    ),
    destructorFunction: null,
  });
}

function __embind_register_memory_view(rawType, dataTypeIndex, name) {
  const typeMapping = [
    Int8Array,
    Uint8Array,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
  ];
  const TA = typeMapping[dataTypeIndex];

  function decodeMemoryView(handle) {
    const size = HEAPU32[handle >> 2];
    const data = HEAPU32[(handle + 4) >> 2];
    return new TA(HEAP8.buffer, data, size);
  }

  name = readLatin1String(name);
  registerType(
    rawType,
    {
      name,
      fromWireType: decodeMemoryView,
      argPackAdvance: GenericWireTypeSize,
      readValueFromPointer: decodeMemoryView,
    },
    { ignoreDuplicateRegistrations: true }
  );
}

function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
  if (!(maxBytesToWrite > 0)) return 0;
  const startIdx = outIdx;
  const endIdx = outIdx + maxBytesToWrite - 1;
  for (let i = 0; i < str.length; ++i) {
    let u = str.charCodeAt(i);
    if (u >= 55_296 && u <= 57_343) {
      const u1 = str.charCodeAt(++i);
      u = (65_536 + ((u & 1023) << 10)) | (u1 & 1023);
    }
    if (u <= 127) {
      if (outIdx >= endIdx) break;
      heap[outIdx++] = u;
    } else if (u <= 2047) {
      if (outIdx + 1 >= endIdx) break;
      heap[outIdx++] = 192 | (u >> 6);
      heap[outIdx++] = 128 | (u & 63);
    } else if (u <= 65_535) {
      if (outIdx + 2 >= endIdx) break;
      heap[outIdx++] = 224 | (u >> 12);
      heap[outIdx++] = 128 | ((u >> 6) & 63);
      heap[outIdx++] = 128 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      heap[outIdx++] = 240 | (u >> 18);
      heap[outIdx++] = 128 | ((u >> 12) & 63);
      heap[outIdx++] = 128 | ((u >> 6) & 63);
      heap[outIdx++] = 128 | (u & 63);
    }
  }
  heap[outIdx] = 0;
  return outIdx - startIdx;
}

const stringToUTF8 = (str, outPtr, maxBytesToWrite) =>
  stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);

function lengthBytesUTF8(str) {
  let len = 0;
  for (let i = 0; i < str.length; ++i) {
    const c = str.charCodeAt(i);
    if (c <= 127) {
      len++;
    } else if (c <= 2047) {
      len += 2;
    } else if (c >= 55_296 && c <= 57_343) {
      len += 4;
      ++i;
    } else {
      len += 3;
    }
  }
  return len;
}

function __embind_register_std_string(rawType, name) {
  name = readLatin1String(name);
  const stdStringIsUTF8 = name === "std::string";
  registerType(rawType, {
    name,
    fromWireType(value) {
      const length = HEAPU32[value >> 2];
      const payload = value + 4;
      let str;
      if (stdStringIsUTF8) {
        let decodeStartPtr = payload;
        for (var i = 0; i <= length; ++i) {
          const currentBytePtr = payload + i;
          if (i == length || HEAPU8[currentBytePtr] == 0) {
            const maxRead = currentBytePtr - decodeStartPtr;
            const stringSegment = UTF8ToString(decodeStartPtr, maxRead);
            if (str === undefined) {
              str = stringSegment;
            } else {
              str += String.fromCharCode(0);
              str += stringSegment;
            }
            decodeStartPtr = currentBytePtr + 1;
          }
        }
      } else {
        const a = new Array(length);
        for (var i = 0; i < length; ++i) {
          a[i] = String.fromCharCode(HEAPU8[payload + i]);
        }
        str = a.join("");
      }
      _free(value);
      return str;
    },
    toWireType(destructors, value) {
      if (value instanceof ArrayBuffer) {
        value = new Uint8Array(value);
      }
      let length;
      const valueIsOfTypeString = typeof value == "string";
      if (
        !(
          valueIsOfTypeString ||
          value instanceof Uint8Array ||
          value instanceof Uint8ClampedArray ||
          value instanceof Int8Array
        )
      ) {
        throwBindingError("Cannot pass non-string to std::string");
      }
      if (stdStringIsUTF8 && valueIsOfTypeString) {
        length = lengthBytesUTF8(value);
      } else {
        length = value.length;
      }
      const base = _malloc(4 + length + 1);
      const ptr = base + 4;
      HEAPU32[base >> 2] = length;
      if (stdStringIsUTF8 && valueIsOfTypeString) {
        stringToUTF8(value, ptr, length + 1);
      } else if (valueIsOfTypeString) {
        for (var i = 0; i < length; ++i) {
          const charCode = value.charCodeAt(i);
          if (charCode > 255) {
            _free(ptr);
            throwBindingError(
              "String has UTF-16 code units that do not fit in 8 bits"
            );
          }
          HEAPU8[ptr + i] = charCode;
        }
      } else {
        for (var i = 0; i < length; ++i) {
          HEAPU8[ptr + i] = value[i];
        }
      }
      if (destructors !== null) {
        destructors.push(_free, base);
      }
      return base;
    },
    argPackAdvance: GenericWireTypeSize,
    readValueFromPointer: readPointer,
    destructorFunction(ptr) {
      _free(ptr);
    },
  });
}

const UTF16Decoder =
  typeof TextDecoder != "undefined" ? new TextDecoder("utf-16le") : undefined;

function UTF16ToString(ptr, maxBytesToRead) {
  let endPtr = ptr;
  let idx = endPtr >> 1;
  const maxIdx = idx + maxBytesToRead / 2;
  while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
  endPtr = idx << 1;
  if (endPtr - ptr > 32 && UTF16Decoder)
    return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
  let str = "";
  for (let i = 0; !(i >= maxBytesToRead / 2); ++i) {
    const codeUnit = HEAP16[(ptr + i * 2) >> 1];
    if (codeUnit == 0) break;
    str += String.fromCharCode(codeUnit);
  }
  return str;
}

function stringToUTF16(str, outPtr, maxBytesToWrite) {
  maxBytesToWrite ??= 2_147_483_647;
  if (maxBytesToWrite < 2) return 0;
  maxBytesToWrite -= 2;
  const startPtr = outPtr;
  const numCharsToWrite =
    maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
  for (let i = 0; i < numCharsToWrite; ++i) {
    const codeUnit = str.charCodeAt(i);
    HEAP16[outPtr >> 1] = codeUnit;
    outPtr += 2;
  }
  HEAP16[outPtr >> 1] = 0;
  return outPtr - startPtr;
}

const lengthBytesUTF16 = (str) => str.length * 2;

function UTF32ToString(ptr, maxBytesToRead) {
  let i = 0;
  let str = "";
  while (!(i >= maxBytesToRead / 4)) {
    const utf32 = HEAP32[(ptr + i * 4) >> 2];
    if (utf32 == 0) break;
    ++i;
    if (utf32 >= 65_536) {
      const ch = utf32 - 65_536;
      str += String.fromCharCode(55_296 | (ch >> 10), 56_320 | (ch & 1023));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
  return str;
}

function stringToUTF32(str, outPtr, maxBytesToWrite) {
  maxBytesToWrite ??= 2_147_483_647;
  if (maxBytesToWrite < 4) return 0;
  const startPtr = outPtr;
  const endPtr = startPtr + maxBytesToWrite - 4;
  for (let i = 0; i < str.length; ++i) {
    let codeUnit = str.charCodeAt(i);
    if (codeUnit >= 55_296 && codeUnit <= 57_343) {
      const trailSurrogate = str.charCodeAt(++i);
      codeUnit = (65_536 + ((codeUnit & 1023) << 10)) | (trailSurrogate & 1023);
    }
    HEAP32[outPtr >> 2] = codeUnit;
    outPtr += 4;
    if (outPtr + 4 > endPtr) break;
  }
  HEAP32[outPtr >> 2] = 0;
  return outPtr - startPtr;
}

function lengthBytesUTF32(str) {
  let len = 0;
  for (let i = 0; i < str.length; ++i) {
    const codeUnit = str.charCodeAt(i);
    if (codeUnit >= 55_296 && codeUnit <= 57_343) ++i;
    len += 4;
  }
  return len;
}

function __embind_register_std_wstring(rawType, charSize, name) {
  name = readLatin1String(name);
  let decodeString, encodeString, readCharAt, lengthBytesUTF;
  if (charSize === 2) {
    decodeString = UTF16ToString;
    encodeString = stringToUTF16;
    lengthBytesUTF = lengthBytesUTF16;
    readCharAt = (pointer) => HEAPU16[pointer >> 1];
  } else if (charSize === 4) {
    decodeString = UTF32ToString;
    encodeString = stringToUTF32;
    lengthBytesUTF = lengthBytesUTF32;
    readCharAt = (pointer) => HEAPU32[pointer >> 2];
  }
  registerType(rawType, {
    name,
    fromWireType: (value) => {
      const length = HEAPU32[value >> 2];
      let str;
      let decodeStartPtr = value + 4;
      for (let i = 0; i <= length; ++i) {
        const currentBytePtr = value + 4 + i * charSize;
        if (i == length || readCharAt(currentBytePtr) == 0) {
          const maxReadBytes = currentBytePtr - decodeStartPtr;
          const stringSegment = decodeString(decodeStartPtr, maxReadBytes);
          if (str === undefined) {
            str = stringSegment;
          } else {
            str += String.fromCharCode(0);
            str += stringSegment;
          }
          decodeStartPtr = currentBytePtr + charSize;
        }
      }
      _free(value);
      return str;
    },
    toWireType: (destructors, value) => {
      if (!(typeof value == "string")) {
        throwBindingError(`Cannot pass non-string to C++ string type ${name}`);
      }
      const length = lengthBytesUTF(value);
      const ptr = _malloc(4 + length + charSize);
      HEAPU32[ptr >> 2] = length / charSize;
      encodeString(value, ptr + 4, length + charSize);
      if (destructors !== null) {
        destructors.push(_free, ptr);
      }
      return ptr;
    },
    argPackAdvance: GenericWireTypeSize,
    readValueFromPointer: readPointer,
    destructorFunction(ptr) {
      _free(ptr);
    },
  });
}

function __embind_register_void(rawType, name) {
  name = readLatin1String(name);
  registerType(rawType, {
    isVoid: true,
    name,
    argPackAdvance: 0,
    fromWireType: () => {},
    toWireType: (destructors, o) => {},
  });
}

const __emscripten_memcpy_js = (dest, src, num) =>
  HEAPU8.copyWithin(dest, src, src + num);
const getHeapMax = () => 2_147_483_648;

function growMemory(size) {
  const b = wasmMemory.buffer;
  const pages = (size - b.byteLength + 65_535) / 65_536;
  try {
    wasmMemory.grow(pages);
    updateMemoryViews();
    return 1;
  } catch (e) {}
}

function _emscripten_resize_heap(requestedSize) {
  const oldSize = HEAPU8.length;
  requestedSize >>>= 0;
  const maxHeapSize = getHeapMax();
  if (requestedSize > maxHeapSize) {
    return false;
  }
  const alignUp = (x, multiple) => x + ((multiple - (x % multiple)) % multiple);
  for (let cutDown = 1; cutDown <= 4; cutDown *= 2) {
    let overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
    overGrownHeapSize = Math.min(
      overGrownHeapSize,
      requestedSize + 100_663_296
    );
    const newSize = Math.min(
      maxHeapSize,
      alignUp(Math.max(requestedSize, overGrownHeapSize), 65_536)
    );
    const replacement = growMemory(newSize);
    if (replacement) {
      return true;
    }
  }
  return false;
}

const _fd_close = (fd) => 52;
const convertI32PairToI53Checked = (lo, hi) =>
  (hi + 2_097_152) >>> 0 < 4_194_305 - !!lo
    ? (lo >>> 0) + hi * 4_294_967_296
    : Number.NaN;

function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
  const offset = convertI32PairToI53Checked(offset_low, offset_high);
  return 70;
}

const printCharBuffers = [null, [], []];

function printChar(stream, curr) {
  const buffer = printCharBuffers[stream];
  if (curr === 0 || curr === 10) {
    (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
    buffer.length = 0;
  } else {
    buffer.push(curr);
  }
}

function _fd_write(fd, iov, iovcnt, pnum) {
  let num = 0;
  for (let i = 0; i < iovcnt; i++) {
    const ptr = HEAPU32[iov >> 2];
    const len = HEAPU32[(iov + 4) >> 2];
    iov += 8;
    for (let j = 0; j < len; j++) {
      printChar(fd, HEAPU8[ptr + j]);
    }
    num += len;
  }
  HEAPU32[pnum >> 2] = num;
  return 0;
}

function writeArrayToMemory(array, buffer) {
  HEAP8.set(array, buffer);
}

embind_init_charCodes();
BindingError = Module.BindingError = class BindingError extends Error {
  constructor(message) {
    super(message);
    this.name = "BindingError";
  }
};
InternalError = Module.InternalError = class InternalError extends Error {
  constructor(message) {
    super(message);
    this.name = "InternalError";
  }
};
init_emval();
UnboundTypeError = Module.UnboundTypeError = extendError(
  Error,
  "UnboundTypeError"
);
var wasmImports = {
  __assert_fail: ___assert_fail,
  __cxa_throw: ___cxa_throw,
  _abort_js: __abort_js,
  _embind_register_bigint: __embind_register_bigint,
  _embind_register_bool: __embind_register_bool,
  _embind_register_emval: __embind_register_emval,
  _embind_register_float: __embind_register_float,
  _embind_register_function: __embind_register_function,
  _embind_register_integer: __embind_register_integer,
  _embind_register_memory_view: __embind_register_memory_view,
  _embind_register_std_string: __embind_register_std_string,
  _embind_register_std_wstring: __embind_register_std_wstring,
  _embind_register_void: __embind_register_void,
  _emscripten_memcpy_js: __emscripten_memcpy_js,
  emscripten_resize_heap: _emscripten_resize_heap,
  fd_close: _fd_close,
  fd_seek: _fd_seek,
  fd_write: _fd_write,
};

var wasmExports;
var ___wasm_call_ctors;
var ___getTypeName;
var _free;
var _malloc;
var __emscripten_stack_restore;
var __emscripten_stack_alloc;
var _emscripten_stack_get_current;
var ___cxa_is_pointer_type;
var dynCall_jiji;

Module.getValue = getValue;
Module.writeArrayToMemory = writeArrayToMemory;

let calledRun;

async function run() {
  wasmExports = await createWasm();
  ___wasm_call_ctors = wasmExports.__wasm_call_ctors;
  ___getTypeName = wasmExports.__getTypeName;
  _free = wasmExports.free;
  _malloc = Module._malloc = wasmExports.malloc;
  __emscripten_stack_restore = wasmExports._emscripten_stack_restore;
  __emscripten_stack_alloc = wasmExports._emscripten_stack_alloc;
  _emscripten_stack_get_current = wasmExports.emscripten_stack_get_current;
  ___cxa_is_pointer_type = wasmExports.__cxa_is_pointer_type;
  dynCall_jiji = Module.dynCall_jiji = wasmExports.dynCall_jiji;
  if (runDependencies > 0) {
    return;
  }
  preRun();

  if (runDependencies > 0) {
    return;
  }

  function doRun() {
    if (calledRun) return;
    calledRun = true;
    Module.calledRun = true;
    if (ABORT) return;
    initRuntime();
    postRun();
  }

  doRun();
}

Module.inspect = () => "[Module]";

export async function initWasmBrowser(url) {
  wasmUrl = url;
  await run();
}

export function ttf2woff2(inputContent) {
  // Prepare input
  const inputBuffer = Module._malloc(inputContent.length + 1);
  const outputSizePtr = Module._malloc(4);
  let outputBufferPtr;
  let outputSize;
  let outputContent;

  Module.writeArrayToMemory(inputContent, inputBuffer);

  // Run
  outputBufferPtr = Module.convert(
    inputBuffer,
    inputContent.length,
    outputSizePtr
  );

  // Retrieve output
  outputSize = Module.getValue(outputSizePtr, "i32");
  outputContent = Buffer.alloc(outputSize);

  for (let i = 0; i < outputSize; i++) {
    outputContent[i] = Module.getValue(outputBufferPtr + i, "i8");
  }

  Module.freePtrs(outputBufferPtr, outputSizePtr);

  return outputContent;
}
