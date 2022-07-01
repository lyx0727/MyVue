const queue:any = [];
let isFlushing = false;

export function queueJob(job:any){
    if(!queue.includes(job)){
        queue.push(job);
    }
    if(!isFlushing){
        isFlushing = true;
    }
}
