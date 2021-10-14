const fs = require("fs");

function detectURLs(message) {
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return message.match(urlRegex);
}

function parseHashtags(str) {
    var hashtagRegex = /(^|\s)(#[a-z\d-]+)/g;
    const hashArr = str.match(hashtagRegex);
    const trimmedHash = [];
    if (hashArr) {
        hashArr.forEach((hashtag) => {
            trimmedHash.push(hashtag.trim());
        });
    }
    return trimmedHash;
}

fs.readFile("client/public/chat.json", (err, data) => {
    if (err) {
        console.log(err);
    }
    const chatJSON = JSON.parse(data);
    const msgWithURL = chatJSON.filter((msg) => detectURLs(msg));
    const soundOrMix = msgWithURL.filter(
        (msg) => msg.indexOf("soundcloud") > 0 || msg.indexOf("mixcloud") > 0
    );

    const msgArr = [];

    soundOrMix.forEach((message) => {
        const msgObj = {};
        const fullText = message.slice(20);
        msgObj.date = message.slice(1, 9);
        msgObj.time = message.slice(11, 16);
        msgObj.message = fullText
            .slice(fullText.indexOf(":") + 2)
            .replace(detectURLs(message), "")
            .trim();
        msgObj.links = detectURLs(message);
        msgObj.hashtags = parseHashtags(message);
        msgArr.push(msgObj);
    });

    fs.writeFileSync("client/public/octoberLinks.js", JSON.stringify(msgArr));
});
