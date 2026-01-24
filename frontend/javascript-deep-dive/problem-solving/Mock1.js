/**
 * Implement a concurrency-limited promise pool promisePool(tasks, limit)
 * where tasks is an array of functions returning promises;
 * ensure execution order doesn’t matter, max limit in-flight,
 * resolve when all settle, and handle rejections without short-circuiting.
 * 
 * 
 * Key constraints (Meta-level expectations)

Never exceed limit concurrent executions

Start next task immediately when one settles

No Promise.all short-circuiting

Preserve task index mapping despite out-of-order completion
 */

// type Status = 'fulfilled' | 'rejected';

// type SetteledResult = {status : Status, value?: any, reason?: any}

function promisePool(tasks, limit) {
    const n = tasks.length;
    const result = new Array(n);
    let inFlight = 0;
    let done = 0;
    let index = 0;


    return new Promise((resolve) => {
        const exec = () => {
            while (inFlight < limit && index < n) {
                const idx = index;
                index++;
                inFlight++;
                Promise.resolve()
                    .then(() => tasks[idx]())
                    .then(
                        (res) => result[idx] = {status: 'fulfilled', value: res},
                        (err) => result[idx] = {status: 'rejected', reason: err}
                    )
                    .finally(() => {
                        done++;
                        inFlight--;
                        if (done === n) resolve(result);
                        else exec();
                    });
            }
        }

        exec();
    });
}