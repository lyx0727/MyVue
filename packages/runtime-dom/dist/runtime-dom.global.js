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
    Text: () => Text,
    createRenderer: () => createRenderer,
    createVnode: () => createVnode,
    h: () => h,
    isSameVnode: () => isSameVnode,
    isVnode: () => isVnode,
    render: () => render
  });

  // packages/shared/src/index.ts
  var isObject = (value) => {
    return value !== null && typeof value === "object";
  };
  var isString = (value) => {
    return typeof value === "string";
  };
  var isArray = Array.isArray;

  // packages/runtime-core/src/vnode.ts
  var Text = Symbol("Text");
  function isVnode(value) {
    return value && value.__v_isVnode;
  }
  function isSameVnode(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }
  function createVnode(type, props, children = null) {
    let shapeFlag = isString(type) ? 1 /* ELEMENT */ : 0;
    const vnode = {
      type,
      props,
      children,
      el: null,
      key: props == null ? void 0 : props["key"],
      __v_isVnode: true,
      shapeFlag
    };
    if (children) {
      let type2 = 0;
      if (isArray(children)) {
        type2 = 16 /* ARRAY_CHILDREN */;
      } else {
        children = String(children);
        type2 = 8 /* TEXT_CHILDREN */;
      }
      vnode.shapeFlag |= type2;
    }
    return vnode;
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
    const processElement = (n1, n2, container, anchor = null) => {
      if (n1 == null) {
        mountElement(n2, container, anchor);
      } else {
        patchElement(n1, n2, container);
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
    const patchElement = (n1, n2, container) => {
      const el = n2.el = n1.el;
      let oldProps = n1.props || {};
      let newProps = n2.props || {};
      patchProps(oldProps, newProps, el);
      patchChildren(n1, n2, el);
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
        default:
          if (shapeFlag & 1 /* ELEMENT */) {
            processElement(n1, n2, container, anchor);
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
