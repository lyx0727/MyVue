import { NodeTypes } from "./ast";

function createParserContext(template:any){
    return {
        line: 1,
        column: 1,
        offset: 0,
        source: template,
        originalSource: template
    }
}

function isEnd(context:any){
    return !context.source;
}

function getCursor(context:any){
    let {line, column, offset} = context;
    return {line, column, offset};
}

function advancePositionWithMutation(context:any, source:any, endIndex:any){
    let linesCount = 0;
    let linePos = -1;
    for(let i = 0; i < endIndex; i++){
        // '\n'
        if(source.charCodeAt(i) === 10){
            linesCount++;
            linePos = i;
        }
    }
    context.offset += endIndex;
    context.line += linesCount;
    context.column = 
        linePos === -1
        ? context.column + endIndex 
        : endIndex - linePos;
}

function advanceBy(context:any, endIndex:any){
    let source = context.source;
    advancePositionWithMutation(context, source, endIndex);

    context.source = source.slice(endIndex);
}

function advanceBySpaces(context:any){
    const match = /^[ \t\r\n]+/.exec(context.source);
    if(match){
        advanceBy(context, match[0].length);
    }
}

function getSelection(context:any, start:any, end?:any){
    end = end || getCursor(context);
    return {
        start,
        end,
        source: context.originalSource.slice(start.offset, end.offset)
    }
}   

export function baseParse(template:any){
    const context = createParserContext(template);

    return parseChildren(context);
}

function parseChildren(context:any){
    const nodes:any = [];
    while(!isEnd(context)){
        let node = null;
        const source = context.source;
        // interpolation
        if(source.startsWith('{{')){
            node = parseInterpolation(context);
        }
        // element
        else if(source.startsWith('<')){
            node = parseElement(context);
        }
        // text
        if(!node){
            node = parseText(context);
        }
        nodes.push(node);
    }
    return nodes;
}

function parseTextData(context:any, endIndex:any){
    const rawText = context.source.slice(0, endIndex);
    advanceBy(context, endIndex);
    return rawText;
}

function parseText(context:any){
    const endTokens = ['<', '{{'];
    const source = context.source;
    let endIndex = source.length;

    // find first end token
    for(let i = 0; i < endTokens.length; i++){
        let index = source.indexOf(endTokens[i]);
        if(index !== -1 && endIndex > index){
            endIndex = index;
        }
    }

    const start = getCursor(context);
    const content = parseTextData(context, endIndex);

    return{
        type: NodeTypes.TEXT,
        content,
        loc:getSelection(context, start)
    }
}   

function parseInterpolation(context:any){
    const start = getCursor(context);
    const closeIndex = context.source.indexOf('}}', '{{'.length);

    // ignore '{{'
    advanceBy(context, 2);

    const innerStart = getCursor(context);
    const innerEnd = getCursor(context);

    const rawContentLength = closeIndex - 2;
    let preCountent = parseTextData(context, rawContentLength);
    let content = preCountent.trim();

    const startOffset = preCountent.indexOf(content);
    // {{    xxx}}
    if(startOffset > 0){
        advancePositionWithMutation(innerStart, preCountent, startOffset);
    }
    let endOffset = startOffset + content.length;
    advancePositionWithMutation(context, preCountent, endOffset);

    // ignore '}}'
    advanceBy(context, 2);

    return {
        type: NodeTypes.INTERPOLATION,
        content:{
            type: NodeTypes.SIMPLE_EXPRESSION,
            content,
            loc: getSelection(context, innerStart, innerEnd)
        },
        loc: getSelection(context, start)
    }
}

function parseElement(context:any){
    let ele = parseTag(context);
    const children = parseChildren(context);
    ele.children = children

    if(context.source.startsWith('</')){
        parseTag(context);
    }
    ele.loc = getSelection(context, ele.loc.start);
}

function parseTag(context:any){
    const start = getCursor(context);
    const match:any = /^<\/?([a-z][^ \t\r\n/>]*)/.exec(context.source);
    const tag = match[1];
    advanceBy(context, match[0].length);
    advanceBySpaces(context);
    // <div/>
    let isSelfClosing = context.source.startsWith('/>');
    advanceBy(context, isSelfClosing ? 2 : 1);
    return {
        type: NodeTypes.ELEMENT,
        tag,
        isSelfClosing,
        loc: getSelection(context, start)
    }
}