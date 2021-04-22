const cheerio = require("cheerio");
const util = require("util");
const request = require("request");
const requestPromise = util.promisify(request);

module.exports.scrape = async function (data) {
    let promisesArr = [];
    data.forEach((item) => {
        promisesArr.push(requestPromise(item.link));
    });
    return (
        Promise.all(promisesArr)
            // by returning the promise, it becomes avaiable to wherever the function is called
            .then((res) => {
                // here i have a set of items in the same order as I put the promises in
                res.forEach((item, i) => {
                    if (item.statusCode == 200) {
                        const $ = cheerio.load(item.body);
                        const img = $('meta[property="og:image"]').attr(
                            "content"
                        );
                        const title = $('meta[property="og:title"]').attr(
                            "content"
                        );
                        const url = $('meta[property="og:url"]').attr(
                            "content"
                        );
                        const description = $(
                            'meta[property="og:description"]'
                        ).attr("content");

                        data[i].preview = { img, title, url, description };
                        // assign each data object a new preview object
                    }
                });
                return data;
                // the promise returned by scrape is going to return this.
                // if there are chained thens, the last chained callback will be returned.
                // to keep the data when you're calling from somewhere else, return things all the way through.
            })
            .catch((err) => console.log(err))
    );
};

// scrape returns a promise and finally returns once each promise is resolved

// return your promises all the time, as a general rule.
// the parralel requests are triggering,
// returning Promise.all means that the place where your function is called, is WAITING for the results of that call.
// return return return
