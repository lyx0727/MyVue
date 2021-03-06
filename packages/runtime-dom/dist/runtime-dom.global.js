"use strict";
var VueRuntimeDOM = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/runtime-dom/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    Fragment: () => Fragment,
    LifecycleHooks: () => LifecycleHooks,
    ReactiveEffect: () => ReactiveEffect,
    Text: () => Text,
    computed: () => computed,
    createComponentInstance: () => createComponentInstance,
    createElementBlock: () => createElementBlock,
    createElementVNode: () => createVnode,
    createRenderer: () => createRenderer,
    createTextVNode: () => createTextVNode,
    createVnode: () => createVnode,
    currentInstance: () => currentInstance,
    effect: () => effect,
    h: () => h,
    isRef: () => isRef,
    isSameVnode: () => isSameVnode,
    isVnode: () => isVnode,
    onBeforeMount: () => onBeforeMount,
    onBeforeUpdate: () => onBeforeUpdate,
    onMounted: () => onMounted,
    onUpdated: () => onUpdated,
    openBlock: () => openBlock,
    proxyRefs: () => proxyRefs,
    reactive: () => reactive,
    ref: () => ref,
    render: () => render,
    setCurrentInstance: () => setCurrentInstance,
    setupComponent: () => setupComponent,
    toDisplayString: () => toDisplayString,
    toRef: () => toRef,
    toRefs: () => toRefs,
    watch: () => watch
  });

  // packages/shared/src/index.ts
  var isObject = (value) => {
    return value !== null && typeof value === "object";
  };
  var isFunction = (value) => {
    return typeof value === "function";
  };
  var isString = (value) => {
    return typeof value === "string";
  };
  var isArray = Array.isArray;
  var invokeArrayFns = (fns) => {
    for (let i = 0; i < fns.length; i++) {
      fns[i]();
    }
  };
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var hasOwn = (value, key) => hasOwnProperty.call(value, key);

  // packages/reactivity/src/effect.ts
  var activeEffect = void 0;
  function cleanupEffects(effect2) {
    const { deps } = effect2;
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect2);
    }
    effect2.deps.length = 0;
  }
  var ReactiveEffect = class {
    constructor(fn, scheduler) {
      this.fn = fn;
      this.scheduler = scheduler;
      this.active = true;
      this.parent = null;
      this.deps = [];
    }
    run() {
      if (!this.active) {
        return this.fn();
      }
      try {
        this.parent = activeEffect;
        activeEffect = this;
        cleanupEffects(this);
        return this.fn();
      } finally {
        activeEffect = this.parent;
      }
    }
    stop() {
      if (this.active) {
        this.active = false;
        cleanupEffects(this);
      }
    }
  };
  function effect(fn, options = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
  }
  function trackEffects(dep) {
    if (activeEffect) {
      let shouldTrack = !dep.has(activeEffect);
      if (shouldTrack) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
      }
    }
  }
  var targetMap = /* @__PURE__ */ new WeakMap();
  function track(target, type, key) {
    if (!activeEffect)
      return;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = /* @__PURE__ */ new Set());
    }
    trackEffects(dep);
  }
  function triggerEffects(effects) {
    if (effects) {
      effects = new Set(effects);
      effects.forEach((effect2) => {
        if (effect2 !== activeEffect) {
          if (effect2.scheduler) {
            effect2.scheduler();
          } else {
            effect2.run();
          }
        }
      });
    }
  }
  function trigger(target, type, key, value, oldValue) {
    const depsMap = targetMap.get(target);
    if (!depsMap)
      return;
    let effects = depsMap.get(key);
    triggerEffects(effects);
  }

  // packages/reactivity/src/reactive.ts
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  function isReactive(target) {
    return target && target["__v_isReactive" /* IS_REACTIVE */];
  }
  function reactive(target) {
    if (!isObject(target)) {
      return target;
    }
    const exisitingProxy = reactiveMap.get(target);
    if (exisitingProxy) {
      return exisitingProxy;
    }
    if (isReactive(target)) {
      return target;
    }
    const proxy = new Proxy(target, {
      get(target2, key, receiver) {
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
          return true;
        }
        track(target2, "get", key);
        const res = Reflect.get(target2, key, receiver);
        if (isObject(res)) {
          return reactive(res);
        }
        return res;
      },
      set(target2, key, value, receiver) {
        let oldValue = target2[key];
        let result = Reflect.set(target2, key, value, receiver);
        if (oldValue !== value) {
          trigger(target2, "set", key, value, oldValue);
        }
        return result;
      }
    });
    reactiveMap.set(target, proxy);
    return proxy;
  }

  // packages/reactivity/src/computed.ts
  var ComputedRefImpl = class {
    constructor(getter, setter) {
      this.setter = setter;
      this.dep = /* @__PURE__ */ new Set();
      this._dirty = true;
      this.effect = new ReactiveEffect(getter, () => {
        if (!this._dirty) {
          this._dirty = true;
          triggerEffects(this.dep);
        }
      });
    }
    get value() {
      trackEffects(this.dep);
      if (this._dirty) {
        this._value = this.effect.run();
        this._dirty = false;
      }
      return this._value;
    }
    set value(newValue) {
      this._value = newValue;
      this._dirty = true;
    }
  };
  function computed(getterOrOptions) {
    let getter, setter;
    if (isFunction(getterOrOptions)) {
      getter = getterOrOptions;
      setter = () => {
        console.warn("no setter");
      };
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }
    return new ComputedRefImpl(getter, setter);
  }

  // packages/reactivity/src/watch.ts
  function traversal(value, set = /* @__PURE__ */ new Set()) {
    if (!isObject(value)) {
      return;
    }
    if (set.has(value)) {
      return;
    }
    set.add(value);
    for (const key in value) {
      traversal(value[key], set);
    }
  }
  function watch(source, cb) {
    let getter;
    if (isReactive(source)) {
      getter = () => traversal(source);
    } else if (isFunction(source)) {
      getter = source;
    } else {
      return;
    }
    let cleanup = void 0;
    const onCleanup = (fn) => {
      cleanup = fn;
    };
    let oldValue = void 0;
    const job = () => {
      if (cleanup) {
        cleanup();
      }
      let newValue = effect2.run();
      cb(newValue, oldValue, onCleanup);
      oldValue = newValue;
    };
    const effect2 = new ReactiveEffect(getter, job);
    oldValue = effect2.run();
  }

  // packages/reactivity/src/ref.ts
  function toReactive(value) {
    return isObject(value) ? reactive(value) : value;
  }
  function isRef(value) {
    return value && value["__v_isRef" /* IS_REF */];
  }
  var RefImpl = class {
    constructor(rawValue) {
      this.rawValue = rawValue;
      this.__v_isRef = true;
      this.dep = /* @__PURE__ */ new Set();
      this._value = toReactive(rawValue);
    }
    get value() {
      trackEffects(this.dep);
      return this._value;
    }
    set value(newValue) {
      if (newValue !== this.rawValue) {
        this._value = toReactive(newValue);
        this.rawValue = newValue;
        triggerEffects(this.dep);
      }
    }
  };
  function ref(value) {
    return new RefImpl(value);
  }
  var ObjectRefImpl = class {
    constructor(object, key) {
      this.object = object;
      this.key = key;
    }
    get value() {
      return this.object[this.key];
    }
    set value(newValue) {
      this.object[this.key] = newValue;
    }
  };
  function toRef(object, key) {
    return new ObjectRefImpl(object, key);
  }
  function toRefs(object) {
    let res = isArray(object) ? new Array(object.length) : {};
    for (const key in object) {
      res[key] = toRef(object, key);
    }
    return res;
  }
  function proxyRefs(object) {
    return new Proxy(object, {
      get(target, key, receiver) {
        const r = Reflect.get(target, key, receiver);
        return isRef(r) ? r.value : r;
      },
      set(target, key, value, receiver) {
        const oldValue = target[key];
        if (isRef(oldValue)) {
          oldValue.value = value;
          return true;
        } else {
          return Reflect.set(target, key, value, receiver);
        }
      }
    });
  }

  // packages/runtime-core/src/componentProps.ts
  function initProps(instance, rawProps) {
    const props = {};
    const attrs = {};
    const options = instance.propsOptions || {};
    if (rawProps) {
      for (let key in rawProps) {
        const value = rawProps[key];
        if (hasOwn(options, key)) {
          props[key] = value;
        } else {
          attrs[key] = value;
        }
      }
    }
    instance.props = reactive(props);
    instance.attrs = attrs;
  }
  var hasPropsChanged = (prevProps = {}, nextProps = {}) => {
    const nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps).length) {
      return true;
    }
    for (let i = 0; i < nextKeys.length; i++) {
      const key = nextKeys[i];
      if (nextProps[key] !== prevProps[key]) {
        return true;
      }
    }
    return false;
  };
  function updateProps(prevProps, nextProps) {
    if (hasPropsChanged(prevProps, nextProps)) {
      for (const key in nextProps) {
        prevProps[key] = nextProps[key];
      }
      for (const key in prevProps) {
        if (!hasOwn(nextProps, key)) {
          delete prevProps[key];
        }
      }
    }
  }

  // packages/runtime-core/src/component.ts
  var currentInstance = null;
  function setCurrentInstance(instance) {
    currentInstance = instance;
  }
  function createComponentInstance(vnode) {
    const instance = {
      data: null,
      vnode,
      subTree: null,
      isMounted: false,
      update: () => {
      },
      propsOptions: vnode.type.props,
      props: {},
      attrs: {},
      proxy: null,
      render: null,
      setupState: {},
      slots: {}
    };
    return instance;
  }
  var publicPropertyMap = {
    $slots: (i) => i.slots,
    $attrs: (i) => i.attrs
  };
  var publicInstanceProxy = {
    get(target, key) {
      const { data, props, setupState } = target;
      if (data && hasOwn(data, key)) {
        return data[key];
      } else if (props && hasOwn(props, key)) {
        return props[key];
      } else if (setupState && hasOwn(setupState, key)) {
        return setupState[key];
      }
      let getter = publicPropertyMap[key];
      if (getter) {
        return getter(target);
      }
    },
    set(target, key, value) {
      const { data, props, setupState } = target;
      if (data && hasOwn(data, key)) {
        data[key] = value;
      } else if (props && hasOwn(props, key)) {
        console.warn("attemping to mutate prop " + key);
        return false;
      } else if (setupState && hasOwn(setupState, key)) {
        setupState[key] = value;
      }
      return true;
    }
  };
  function initSlots(instance, children) {
    if (instance.vnode.shapeFlag & 32 /* SLOTS_CHILDREN */) {
      instance.slots = children;
    }
  }
  function setupComponent(instance) {
    let { props, type, children } = instance.vnode;
    initProps(instance, props);
    initSlots(instance, children);
    instance.proxy = new Proxy(instance, publicInstanceProxy);
    let data = type.data;
    if (data) {
      if (!isFunction(data)) {
        return console.warn("data option must be a function");
      }
      instance.data = reactive(data.call(instance.proxy));
    }
    let setup = type.setup;
    if (setup) {
      const setupContext = {
        emit: (event, ...args) => {
          const eventName = `on${event[0].toUpperCase() + event.slice(1)}`;
          const handler = instance.vnode.props[eventName];
          handler && handler(...args);
        },
        slots: instance.slots,
        attrs: instance.attrs
      };
      const setupResult = setup(instance.props, setupContext);
      if (isFunction(setupResult)) {
        instance.render = setupResult;
      } else if (isObject(setupResult)) {
        instance.setupState = proxyRefs(setupResult);
      }
    }
    if (!instance.render) {
      instance.render = type.render;
    }
  }

  // packages/runtime-core/src/scheduler.ts
  var queue = [];
  var isFlushing = false;
  var resolvePromise = Promise.resolve();
  function queueJob(job) {
    if (!queue.includes(job)) {
      queue.push(job);
    }
    if (!isFlushing) {
      isFlushing = true;
      resolvePromise.then(() => {
        isFlushing = false;
        let copy = queue.slice();
        queue.length = 0;
        for (let i = 0; i < copy.length; i++) {
          let job2 = copy[i];
          job2();
        }
        copy.length = 0;
      });
    }
  }

  // packages/runtime-core/src/vnode.ts
  var Text = Symbol("Text");
  var Fragment = Symbol("Fragment");
  function isVnode(value) {
    return value && value.__v_isVnode;
  }
  function isSameVnode(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }
  function createVnode(type, props, children = null, patchFlag = 0) {
    let shapeFlag = isString(type) ? 1 /* ELEMENT */ : isObject(type) ? 4 /* STATEFUL_COMPONENT */ : isFunction(type) ? 2 /* FUNCTIONAL_COMPONENT */ : 0;
    const vnode = {
      type,
      props,
      children,
      el: null,
      key: props == null ? void 0 : props["key"],
      __v_isVnode: true,
      shapeFlag,
      patchFlag
    };
    if (children) {
      let type2 = 0;
      if (isArray(children)) {
        type2 = 16 /* ARRAY_CHILDREN */;
      } else if (isObject(children)) {
        type2 = 32 /* SLOTS_CHILDREN */;
      } else {
        children = String(children);
        type2 = 8 /* TEXT_CHILDREN */;
      }
      vnode.shapeFlag |= type2;
    }
    if (currentBlock && vnode.patchFlag > 0) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  var currentBlock = null;
  function openBlock() {
    currentBlock = [];
  }
  function createElementBlock(type, props, children, patchFlag) {
    return setupBlock(createVnode(type, props, children, patchFlag));
  }
  function createTextVNode(text = " ", patchFlag = 0) {
    return createVnode(Text, null, text, patchFlag);
  }
  function setupBlock(vnode) {
    vnode.dynamicChildren = currentBlock;
    currentBlock = null;
    return vnode;
  }
  function toDisplayString(value) {
    return isString(value) ? value : value == null ? "" : isObject(value) ? JSON.stringify(value) : String(value);
  }

  // packages/runtime-core/src/renderer.ts
  function getSequence(arr) {
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j = result[result.length - 1];
        if (arr[j] < arrI) {
          p[i] = j;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          c = u + v >> 1;
          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p[i] = result[u - 1];
          }
          result[u] = i;
        }
      }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
      result[u] = v;
      v = p[v];
    }
    return result;
  }
  function createRenderer(renderOptions2) {
    const {
      insert: hostInsert,
      remove: hostRemove,
      setElementText: hostSetElementText,
      setText: hostSetText,
      patchProp: hostPatchProp,
      createElement: hostCreateElement,
      createText: hostCreateText
    } = renderOptions2;
    const normalize = (children, i) => {
      if (isString(children[i])) {
        const vnode = createVnode(Text, null, children[i]);
        children[i] = vnode;
      }
      return children[i];
    };
    const unmount = (vnode) => {
      hostRemove(vnode.el);
    };
    const mountChildren = (children, container) => {
      for (let i = 0; i < children.length; i++) {
        let child = normalize(children, i);
        patch(null, child, container);
      }
    };
    const mountElement = (vnode, container, anchor = null) => {
      let { type, props, children, shapeFlag } = vnode;
      let el = vnode.el = hostCreateElement(type);
      if (props) {
        for (let key in props) {
          hostPatchProp(el, key, null, props[key]);
        }
      }
      if (shapeFlag & 8 /* TEXT_CHILDREN */) {
        hostSetElementText(el, children);
      } else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
        mountChildren(children, el);
      }
      hostInsert(el, container, anchor);
    };
    const mountComponent = (vnode, container, anchor = null) => {
      const instance = vnode.component = createComponentInstance(vnode);
      setCurrentInstance(instance);
      setupComponent(instance);
      setCurrentInstance(null);
      setupRenderEffect(instance, container, anchor);
    };
    const updateComponentPreRender = (instance, next) => {
      instance.next = null;
      instance.vnode = next;
      updateProps(instance.props, next.props);
    };
    const setupRenderEffect = (instance, container, anchor) => {
      const componentUpdateFn = () => {
        const { render: render3 } = instance;
        if (!instance.isMounted) {
          const { bm, m } = instance;
          if (bm) {
            invokeArrayFns(bm);
          }
          const subTree = render3.call(instance.proxy, instance.proxy);
          patch(null, subTree, container, anchor);
          instance.subTree = subTree;
          instance.isMounted = true;
          if (m) {
            invokeArrayFns(m);
          }
        } else {
          let { next, bu, u } = instance;
          if (next) {
            updateComponentPreRender(instance, next);
          }
          if (bu) {
            invokeArrayFns(bu);
          }
          const subTree = render3.call(instance.proxy, instance.proxy);
          patch(instance.subTree, subTree, container, anchor);
          instance.subTree = subTree;
          if (u) {
            invokeArrayFns(u);
          }
        }
      };
      const effect2 = new ReactiveEffect(componentUpdateFn, () => {
        queueJob(instance.update);
      });
      const update = instance.update = effect2.run.bind(effect2);
      update();
    };
    const processText = (n1, n2, container) => {
      if (n1 == null) {
        hostInsert(n2.el = hostCreateText(n2.children), container);
      } else {
        const el = n2.el = n1.el;
        if (n1.children !== n2.children) {
          hostSetText(el, n2.children);
        }
      }
    };
    const processFragment = (n1, n2, container) => {
      if (n1 == null) {
        mountChildren(n2.children, container);
      } else {
        patchChildren(n1, n2, container);
      }
    };
    const processElement = (n1, n2, container, anchor = null) => {
      if (n1 == null) {
        mountElement(n2, container, anchor);
      } else {
        patchElement(n1, n2);
      }
    };
    const shouldUpdateComponent = (n1, n2) => {
      const { props: prevProps, children: prevChildren } = n1;
      const { props: nextProps, children: nextChildren } = n2;
      if (prevProps === nextProps) {
        return false;
      }
      if (prevChildren || nextChildren) {
        return true;
      }
      return hasPropsChanged(n1, n2);
    };
    const updateComponent = (n1, n2) => {
      const instance = n2.component = n1.component;
      if (shouldUpdateComponent(n1, n2)) {
        instance.next = n2;
        instance.update();
      }
    };
    const processComponent = (n1, n2, container, anchor = null) => {
      if (n1 == null) {
        mountComponent(n2, container, anchor);
      } else {
        updateComponent(n1, n2);
      }
    };
    const patchProps = (oldProps, newProps, el) => {
      for (let key in newProps) {
        hostPatchProp(el, key, oldProps[key], newProps[key]);
      }
      for (let key in oldProps) {
        if (newProps[key] == null) {
          hostPatchProp(el, key, oldProps[key], null);
        }
      }
    };
    const unmountChildren = (children) => {
      for (let i = 0; i < children.length; i++) {
        unmount(children[i]);
      }
    };
    const patchChildren = (n1, n2, el) => {
      const c1 = n1.children;
      const c2 = n2.children;
      const prevShapeFlag = n1.shapeFlag;
      const shapeFlag = n2.shapeFlag;
      if (shapeFlag & 8 /* TEXT_CHILDREN */) {
        if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
          unmountChildren(c1);
        }
        if (c1 !== c2) {
          hostSetElementText(el, c2);
        }
      } else {
        if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
          if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
            let i = 0;
            let e1 = c1.length - 1;
            let e2 = c2.length - 1;
            while (i <= e1 && i <= e2) {
              const n12 = c1[i];
              const n22 = c2[i];
              if (isSameVnode(n12, n22)) {
                patch(n12, n22, el);
              } else {
                break;
              }
              i++;
            }
            while (i <= e1 && i <= e2) {
              const n12 = c1[e1];
              const n22 = c2[e2];
              if (isSameVnode(n12, n22)) {
                patch(n12, n22, el);
              } else {
                break;
              }
              e1--;
              e2--;
            }
            if (i > e1) {
              if (i <= e2) {
                while (i <= e2) {
                  const nextPos = e2 + 1;
                  const anchor = nextPos < c2.length ? c2[nextPos].el : null;
                  patch(null, c2[i], el, anchor);
                  i++;
                }
              }
            } else if (i > e2) {
              if (i <= e1) {
                while (i <= e1) {
                  unmount(c1[i]);
                  i++;
                }
              }
            }
            const s1 = i;
            const s2 = i;
            const keyToNewIndexMap = /* @__PURE__ */ new Map();
            for (let i2 = s2; i2 <= e2; i2++) {
              keyToNewIndexMap.set(c2[i2].key, i2);
            }
            const toBePatched = e2 - s2 + 1;
            let newIndexToOldIndexMap = new Array(toBePatched).fill(0);
            for (let i2 = s1; i2 <= e1; i2++) {
              const oldChild = c1[i2];
              let newIndex = keyToNewIndexMap.get(oldChild.key);
              if (newIndex == null) {
                unmount(oldChild);
              } else {
                newIndexToOldIndexMap[newIndex - s2] = i2 + 1;
                patch(oldChild, c2[newIndex], el);
              }
            }
            const increasingNewIndexSequence = getSequence(newIndexToOldIndexMap);
            let j = increasingNewIndexSequence.length - 1;
            for (let i2 = toBePatched - 1; i2 >= 0; i2--) {
              let index = i2 + s2;
              let current = c2[index];
              let anchor = index + 1 < c2.length ? c2[index + 1].el : null;
              if (newIndexToOldIndexMap[i2] === 0) {
                patch(null, current, el, anchor);
              } else {
                if (j < 0 || i2 !== increasingNewIndexSequence[j]) {
                  hostInsert(current.el, el, anchor);
                } else {
                  j--;
                }
              }
            }
          } else {
            unmountChildren(c1);
          }
        } else {
          if (prevShapeFlag & 8 /* TEXT_CHILDREN */) {
            hostSetElementText(el, "");
          }
          if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
            mountChildren(c2, el);
          }
        }
      }
    };
    const patchBlockChildren = (n1, n2) => {
      for (let i = 0; i < n2.dynamicChildren.length; i++) {
        patchElement(n1.dynamicChildren[i], n2.dynamicChildren[i]);
      }
    };
    const patchElement = (n1, n2) => {
      const el = n2.el = n1.el;
      let oldProps = n1.props || {};
      let newProps = n2.props || {};
      patchProps(oldProps, newProps, el);
      if (n2.dynamicChildren) {
        patchBlockChildren(n1, n2);
      } else {
        patchChildren(n1, n2, el);
      }
    };
    const patch = (n1, n2, container, anchor = null) => {
      if (n1 === n2) {
        return;
      }
      if (n1 && !isSameVnode(n1, n2)) {
        unmount(n1);
        n1 = null;
      }
      const { type, shapeFlag } = n2;
      switch (type) {
        case Text:
          processText(n1, n2, container);
          break;
        case Fragment:
          processFragment(n1, n2, container);
          break;
        default:
          if (shapeFlag & 1 /* ELEMENT */) {
            processElement(n1, n2, container, anchor);
          } else if (shapeFlag & 6 /* COMPONENT */) {
            processComponent(n1, n2, container, anchor);
          }
      }
    };
    const render2 = (vnode, container) => {
      if (vnode === null) {
        if (container._vnode) {
          unmount(container._vnode);
        }
      } else {
        patch(container._vnode || null, vnode, container);
      }
      container._vnode = vnode;
    };
    return {
      render: render2
    };
  }

  // packages/runtime-core/src/h.ts
  function h(type, propsOrChildren, children) {
    const l = arguments.length;
    if (l === 2) {
      if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
        if (isVnode(propsOrChildren)) {
          return createVnode(type, null, [propsOrChildren]);
        }
        return createVnode(type, propsOrChildren);
      } else {
        return createVnode(type, null, propsOrChildren);
      }
    } else {
      if (l > 3) {
        children = Array.prototype.slice.call(arguments, 2);
      } else if (l === 3 && isVnode(children)) {
        children = [children];
      }
      return createVnode(type, propsOrChildren, children);
    }
  }

  // packages/runtime-core/src/apiLifecycle.ts
  var LifecycleHooks = /* @__PURE__ */ ((LifecycleHooks2) => {
    LifecycleHooks2["BEFORE_MOUNT"] = "bm";
    LifecycleHooks2["MOUNTED"] = "m";
    LifecycleHooks2["BEFORE_UPDATE"] = "bu";
    LifecycleHooks2["UPDATED"] = "u";
    return LifecycleHooks2;
  })(LifecycleHooks || {});
  function createHook(type) {
    return (hook, target = currentInstance) => {
      if (target) {
        const hooks = target[type] || (target[type] = []);
        const wrappedHook = () => {
          setCurrentInstance(target);
          hook();
          setCurrentInstance(null);
        };
        hooks.push(wrappedHook);
      }
    };
  }
  var onBeforeMount = createHook("bm" /* BEFORE_MOUNT */);
  var onMounted = createHook("m" /* MOUNTED */);
  var onBeforeUpdate = createHook("bu" /* BEFORE_UPDATE */);
  var onUpdated = createHook("u" /* UPDATED */);

  // packages/runtime-dom/src/nodeOps.ts
  var nodeOps = {
    insert(child, parent, anchor = null) {
      parent.insertBefore(child, anchor);
    },
    remove(child) {
      const parentNode = child.parentNode;
      if (parentNode) {
        parentNode.removeChild(child);
      }
    },
    setElementText(el, text) {
      el.textContent = text;
    },
    setText(node, text) {
      node.nodeValue = text;
    },
    querySelector(selector) {
      return document.querySelector(selector);
    },
    parentNode(node) {
      return node.parentNode;
    },
    nextSibling(node) {
      return node.nextSibling;
    },
    createElement(tagName) {
      return document.createElement(tagName);
    },
    createText(text) {
      return document.createTextNode(text);
    },
    setScopeId(el, id) {
      el.setAttribute(id, "");
    },
    cloneNode(el) {
      return el.cloneNode(true);
    }
  };

  // packages/runtime-dom/src/modules/attr.ts
  function patchAttr(el, key, nextValue) {
    if (nextValue) {
      el.setAttribute(key, nextValue);
    } else {
      el.removeAttribute(key);
    }
  }

  // packages/runtime-dom/src/modules/class.ts
  function patchClass(el, nextValue) {
    if (nextValue === null) {
      el.removeAttribute("class");
    } else {
      el.className = nextValue;
    }
  }

  // packages/runtime-dom/src/modules/event.ts
  function createInvoker(cb) {
    const invoker = (e) => invoker.value(e);
    invoker.value = cb;
    return invoker;
  }
  function patchEvent(el, eventName, nextValue) {
    let invokers = el._vei || (el._vei = {});
    let exist = invokers[eventName];
    if (exist && nextValue) {
      exist.value = nextValue;
    } else {
      let event = eventName.slice(2).toLowerCase();
      if (nextValue) {
        const invoker = invokers[eventName] = createInvoker(nextValue);
        el.addEventListener(event, invoker);
      } else if (exist) {
        el.removeEventListener(event, exist);
        invokers[eventName] = void 0;
      }
    }
  }

  // packages/runtime-dom/src/modules/style.ts
  function patchStyle(el, prevValue, nextValue) {
    for (let key in nextValue) {
      el.style[key] = nextValue[key];
    }
    if (prevValue) {
      for (let key in prevValue) {
        if (nextValue == null || nextValue[key] == null) {
          el.style[key] = null;
        }
      }
    }
  }

  // packages/runtime-dom/src/patchProp.ts
  function patchProp(el, key, prevValue, nextValue) {
    if (key === "class") {
      patchClass(el, nextValue);
    } else if (key === "style") {
      patchStyle(el, prevValue, nextValue);
    } else if (/^on[^a-z]/.test(key)) {
      patchEvent(el, key, nextValue);
    } else {
      patchAttr(el, key, nextValue);
    }
  }

  // packages/runtime-dom/src/index.ts
  var renderOptions = Object.assign(nodeOps, { patchProp });
  function render(vnode, container) {
    return createRenderer(renderOptions).render(vnode, container);
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=runtime-dom.global.js.map
