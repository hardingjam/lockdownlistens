const cheerio = require("cheerio");
const util = require("util");
const request = require("request");
const requestPromise = util.promisify(request);

const detectUrls = function (str) {
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return str.match(urlRegex);
};

module.exports.scrape = function (data) {
    let url = detectUrls(data[1].post);
    console.log(url[0]);
    return requestPromise(url[0])
        .then((res) => {
            if (res.statusCode == 200) {
                const $ = cheerio.load(res.body);
                const img = $('meta[property="og:image"]').attr("content");
                const title = $('meta[property="og:title"]').attr("content");
                console.log({ img, title });
                return { ...data, preview: { img, title } };
            }
        })
        .catch((err) => console.log(err));
};

// scrape returns a promise and finally returns once each promise is resolved

// use promise.all which expects an array of promises
// an array of request calls. map over them
//promise.all urls map
// get the results and map them, do the cheerio on each
