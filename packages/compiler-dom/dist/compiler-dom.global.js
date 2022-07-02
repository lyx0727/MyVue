"use strict";
var VueCompilerDOM = (() => {
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

  // packages/compiler-dom/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    compile: () => compile
  });

  // packages/compiler-core/src/parse.ts
  function createParserContext(template) {
    return {
      line: 1,
      column: 1,
      offset: 0,
      source: template,
      originalSource: template
    };
  }
  function isEnd(context) {
    const source = context.source;
    return !source || source.startsWith("</");
  }
  function getCursor(context) {
    let { line, column, offset } = context;
    return { line, column, offset };
  }
  function advancePositionWithMutation(context, source, endIndex) {
    let linesCount = 0;
    let linePos = -1;
    for (let i = 0; i < endIndex; i++) {
      if (source.charCodeAt(i) === 10) {
        linesCount++;
        linePos = i;
      }
    }
    context.offset += endIndex;
    context.line += linesCount;
    context.column = linePos === -1 ? context.column + endIndex : endIndex - linePos;
  }
  function advanceBy(context, endIndex) {
    let source = context.source;
    advancePositionWithMutation(context, source, endIndex);
    context.source = source.slice(endIndex);
  }
  function advanceBySpaces(context) {
    const match = /^[ \t\r\n]+/.exec(context.source);
    if (match) {
      advanceBy(context, match[0].length);
    }
  }
  function getSelection(context, start, end) {
    end = end || getCursor(context);
    return {
      start,
      end,
      source: context.originalSource.slice(start.offset, end.offset)
    };
  }
  function baseParse(template) {
    const context = createParserContext(template);
    return parseChildren(context);
  }
  function parseChildren(context) {
    const nodes = [];
    while (!isEnd(context)) {
      let node = null;
      const source = context.source;
      if (source.startsWith("{{")) {
        node = parseInterpolation(context);
      } else if (source.startsWith("<")) {
        node = parseElement(context);
      }
      if (!node) {
        node = parseText(context);
      }
      nodes.push(node);
    }
    return nodes;
  }
  function parseTextData(context, endIndex) {
    const rawText = context.source.slice(0, endIndex);
    advanceBy(context, endIndex);
    return rawText;
  }
  function parseText(context) {
    const endTokens = ["<", "{{"];
    const source = context.source;
    let endIndex = source.length;
    for (let i = 0; i < endTokens.length; i++) {
      let index = source.indexOf(endTokens[i]);
      if (index !== -1 && endIndex > index) {
        endIndex = index;
      }
    }
    const start = getCursor(context);
    const content = parseTextData(context, endIndex);
    return {
      type: 2 /* TEXT */,
      content,
      loc: getSelection(context, start)
    };
  }
  function parseInterpolation(context) {
    const start = getCursor(context);
    const closeIndex = context.source.indexOf("}}", "{{".length);
    advanceBy(context, 2);
    const innerStart = getCursor(context);
    const innerEnd = getCursor(context);
    const rawContentLength = closeIndex - 2;
    let preCountent = parseTextData(context, rawContentLength);
    let content = preCountent.trim();
    const startOffset = preCountent.indexOf(content);
    if (startOffset > 0) {
      advancePositionWithMutation(innerStart, preCountent, startOffset);
    }
    let endOffset = startOffset + content.length;
    advancePositionWithMutation(context, preCountent, endOffset);
    advanceBy(context, 2);
    return {
      type: 5 /* INTERPOLATION */,
      content: {
        type: 4 /* SIMPLE_EXPRESSION */,
        content,
        loc: getSelection(context, innerStart, innerEnd)
      },
      loc: getSelection(context, start)
    };
  }
  function parseElement(context) {
    let ele = parseTag(context);
    const children = parseChildren(context);
    console.log(children);
    if (context.source.startsWith("</")) {
      parseTag(context);
    }
    ele.loc = getSelection(context, ele.loc.start);
    ele.children = children;
    return ele;
  }
  function parseTag(context) {
    const start = getCursor(context);
    const match = /^<\/?([a-z][^ \t\r\n/>]*)/.exec(context.source);
    const tag = match[1];
    advanceBy(context, match[0].length);
    advanceBySpaces(context);
    let isSelfClosing = context.source.startsWith("/>");
    advanceBy(context, isSelfClosing ? 2 : 1);
    return {
      type: 1 /* ELEMENT */,
      tag,
      isSelfClosing,
      children: [],
      loc: getSelection(context, start)
    };
  }

  // packages/compiler-core/src/compile.ts
  function baseCompile(template) {
    const ast = baseParse(template);
    return ast;
  }

  // packages/compiler-dom/src/index.ts
  function compile(template) {
    return baseCompile(template);
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=compiler-dom.global.js.map
