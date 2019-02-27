const request = require("request-promise-native"),
    {promisify} = require("util");

const endpoint = "http://localhost:8081/location=ro",
    nr_of_requests = 500,
    batch_size = 50;

async function send_batch(batch_size) {
    const batch = [];

    for (let idx = 0; idx < batch_size; ++idx) {
        batch.push(promisify(request.get)(endpoint));
    }
    try {
        await Promise.all(batch);
    }
    catch (err) {
        console.error(err);
    }
}

(async function start_tests(endpoint) {
    const now = Date.now();
    let average_ms = 0;

    console.log(`Sending ${nr_of_requests} requests with batch size ${batch_size}\n`);

    for (let idx = 0; idx < nr_of_requests/batch_size; ++idx) {
        const now = Date.now();
        try {
            await send_batch(batch_size);
        }
        catch (err) {
            console.error(err);
        }
        average_ms = (average_ms + Date.now() - now) / 2;
        console.log(`${(idx+1) * 100/(nr_of_requests/batch_size)}%`);
    }
    console.log(`Total time: ${Date.now() - now} ms`);
    console.log(`Average batch response time: ${average_ms}`)
})(endpoint);
