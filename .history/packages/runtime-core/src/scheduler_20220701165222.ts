const queue:any = [];
let isFlushing = false;
const resolvePromise = Promise.resolve();

export function queueJob(job:any){
    if(!queue.includes(job)){
        queue.push(job);
    }
    if(!isFlushing){
        isFlushing = true;
        resolvePromise.then(()=>{
            isFlushing = false;
            let copy = queue.slice();
        });
    }
}
