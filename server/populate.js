const chatHistory = require("../client/public/octoberLinks.js");
const { initialPopulate } = require("./database");

const messagesWithLinksInside = chatHistory.filter((message) => message.links);

const messagesWithGoodLinks = messagesWithLinksInside.filter(
    (message) =>
        message.links[0].indexOf("soundcloud") > 0 ||
        message.links[0].indexOf("mixcloud") > 0
);

messagesWithGoodLinks.length;

messagesWithGoodLinks.forEach((post) => {
    initialPopulate(
        `${post.date} ${post.time}`,
        post.message,
        post.links[0],
        post.hashtags
    )
        .then(() => "done")
        .catch((err) => err);
});
