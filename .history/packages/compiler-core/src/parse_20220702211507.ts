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

export function baseParse(template:any){
    const context = createParserContext(template);

    const nodes = [];
    while(!isEnd(context)){
        let node = null;
        const source = context.source;
        // 
        if(source.startWith('{{')){

        }
        // tag
        else if(source.startWith('<')){

        }
        // text
        if(!node){
            node = parseText(context);
        }
        nodes.push(node);
    }
}

function parseTextData(context:any, endIndex:any){
    const rawText = context.source.slice(0);
    
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
}