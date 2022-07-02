function createParserContext(template:any){
    return {
        line: 1,
        column: 1,
        offset: 0,
        source: template,
        originalSource: template
    }
}

export function baseParse(template:any){
    const context = createParserContext(template);
}