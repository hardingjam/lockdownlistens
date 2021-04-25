const chatHistory = require("../client/public/message-objects.js");
const { initialPopulate } = require("./database");

const messagesWithLinksInside = chatHistory.filter((message) => message.links);

const messagesWithGoodLinks = messagesWithLinksInside.filter(
    (message) =>
        message.links[0].indexOf("soundcloud") > 0 ||
        message.links[0].indexOf("mixcloud") > 0
);

console.log(messagesWithGoodLinks.length);

messagesWithGoodLinks.forEach((post) => {
    initialPopulate(
        `${post.date} ${post.time}`,
        post.message,
        post.links[0],
        post.hashtags
    )
        .then(() => console.log("done"))
        .catch((err) => console.log(err));
});
