const fs = require("fs");
const { msgLinkObj } = require("./parsingmsgs");

// msgLinkObj requires an array, I get this from messages that contain URLs.

const messageArray = fs
    .readFileSync("client/public/_chat.txt")
    .toString()
    .split("[");

console.log(messageArray.length);
console.log(messageArray[443]);

function objWithUrl(arr) {
    return new Promise((res, rej) => {
        const messages = msgLinkObj(chatHistory);
        const linksInMessages = [];
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].links !== null) {
                linksInMessages.push(messages[i]);
            }
        }
        res(linksInMessages);
    });
}

// function objWithoutUrl(arr) {
//     return new Promise((res, rej) => {
//         const messages = msgLinkObj(chatHistory);
//         const msgsWIthoutLinks = [];
//         for (let i = 0; i < messages.length; i++) {
//             if (messages[i].links.length == 0) {
//                 msgsWIthoutLinks.push(messages[i]);
//             }
//         }
//         res(msgsWIthoutLinks);
//     });
// }

// objWithoutUrl(chatHistory).then((data) => {
//     console.log(data);
//     var counts = {};
//     for (let i = 0; i < data.length; i++) {
//         var user = data[i].user.toString();
//         counts[user] = counts[user] ? counts[user] + 1 : 1;
//     }
//     console.log(counts);
// });

// msgLinkObj(chatHistory).then((data) => {
//     var tagsCount = {};
//     var sortable = [];
//     for (let i = 0; i < data.length; i++) {
//         var hashtag = data[i].hashtags;
//         hashtag.forEach((tag) => {
//             tagsCount[tag] = tagsCount[tag] ? tagsCount[tag] + 1 : 1;
//         });
//     }
//     for (let tag in tagsCount) {
//         sortable.push([tag, tagsCount[tag]]);
//     }

//     sortable.sort(function (a, b) {
//         return a[1] - b[1];
//     });

//     const sortedTags = {};
//     sortable.forEach(function (item) {
//         sortedTags[item[0]] = item[1];
//     });
//     console.log(sortedTags);
// });

// search links.JSON for soundcloud links
