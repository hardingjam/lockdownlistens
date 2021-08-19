module.exports.checkLinksFrom = (site, linksList) => {
    const links = [];
    for (let i = 0; i < linksList.length; i++) {
        let linkStr = linksList[i].toString();
        if (linkStr.indexOf(`${site}`) !== -1) {
            links.push(linksList[i]);
        }
    }
    // fs.writeFile(
    //     `./database/${site}links.JSON`,
    //     JSON.stringify(links),
    //     function (err) {
    //         if (err) {
    //             console.log("error, ", err);
    //         }
    //     }
    console.log(links);
};

module.exports.messagesWithLinks = function msgWithLink(arr) {
    console.log(arr.length);
    const msgWithLink = [];
    for (let i = 0; i < arr.length; i++) {
        let msgStr = arr[i].toString();
        if (msgStr.indexOf("http") !== -1) {
            msgWithLink.push(arr[i]);
        }
    }
    // fs.writeFile(
    //     `./database/link-messages.JSON`,
    //     JSON.stringify(msgWithLink),
    //     function (err) {
    //         if (err) {
    //             console.log(err);
    //         }
    //     }
    // );
    // console.log(msgWithLink);
    return msgWithLink;
};

function parseHashtags(str) {
    // if first item in string is hashtag, doesn't send it...
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

function detectURLs(message) {
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return message.match(urlRegex);
}

module.exports.msgLinkObj = function msgLinksObj(arr) {
    return new Promise((res, rej) => {
        console.log("making msglinkObj");
        const msgArr = [];
        // only parse hashtags from the message text, and allow spaces before.
        arr.forEach((message) => {
            const msgObj = {};
            const fullText = message.slice(20);
            msgObj.date = message.slice(0, 10);
            msgObj.time = message.slice(12, 17);
            msgObj.user = fullText.slice(0, fullText.indexOf(":"));
            msgObj.message = fullText
                .slice(fullText.indexOf(":") + 2)
                .replace(detectURLs(message), "")
                .trim();
            msgObj.links = detectURLs(message);
            msgObj.hashtags = parseHashtags(message);
            msgArr.push(msgObj);
        });
        // fs.writeFile(
        //     `./database/message-array-testuser.JSON`,
        //     JSON.stringify(msgArr),
        //     function (err) {
        //         if (err) {
        //             console.log("error, ", err);
        //         }
        //     }
        // );
        // console.log(msgArr);
        // returns a while array of all messages
        res(msgArr);
    });
};

module.exports.siteMessages = function siteMessages(arr, site) {
    const siteMsg = [];
    arr.forEach((obj) => {
        if (obj.links[0].indexOf(`${site}`) !== -1) {
            scMsg.push(obj);
        }
    });
    // fs.writeFile(
    //     `./database/${site}-messages.JSON`,
    //     JSON.stringify(scMsg),
    //     function (err) {
    //         if (err) {
    //             console.log("error, ", err);
    //         }
    //     }
    // );
    // console.log(siteMsg);
    return sitMsg;
};

const testObjects = [
    {
        date: "27/03/2020",
        time: "12:19",
        user: "Josh Hoppen",
        message: "#party #techno #princeofpersia #Ourmaninseoul",
        links: [
            "https://soundcloud.com/astralindustries/ario-dance-tunnel-260316",
        ],
    },
    {
        date: "27/03/2020",
        time: "13:16",
        user: "Alex Rennie",
        message: "#toasty",
        links: [
            "https://soundcloud.com/jogarde/jogarde-east-of-berlin-snippet-freilauf?in=jogarde/sets/freilauf",
        ],
    },
];

const testString =
    "04/12/2020, 11:04 - Jamie h?: https://open.spotify.com/album/6Y9i01k1rGe69qVjWsGWNM?si=D6YAi-4MRmaLOqwT9CcqSg #landscape #ambient #americana #durutti";
