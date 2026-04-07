
import { fetchFeed } from "src/lib/rss/rss"
import { readConfig } from "src/config"
import { getUserByName } from "src/lib/db/queries/users"
import { createFeed, getFeeds } from "src/lib/db/queries/feeds"
import { createFeedFollows } from "src/lib/db/queries/feedfollows"
import { type User } from "src/lib/db/schema"
import { scrapeFeeds } from "../aggregate"


const defaultUrl = "https://www.wagslane.dev/index.xml"

function getDelayTime(durationStr: string) {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if (match === null) {
        throw new Error("invalid time_between_reqs got: " + durationStr + "valid options:1m|1ms|1h|1s")
    }
    const [validStr, numStr, typeDuration] = match
    const numDuration = Number.parseInt(numStr, 10)
    if (Number.isNaN(numDuration)) {
        throw new Error("Invalid duration length got:" + numStr + "expected a integer value")
    }
    if (typeDuration === "h") {
        return 60 * 60 * 1000 * numDuration
    }
    if (typeDuration === "m") {
        return 60 * 1000 * numDuration
    }
    if (typeDuration === "s") {
        return numDuration * 1000
    }
    return numDuration
}


function handleError(err: any) {
    let msg = "Err scraping feeds"
    if (err instanceof Error) {
        msg += " error:" + err.message
    }
    console.log(msg)
}


export async function handleAggCmd(cmdName: string, ...args: string[]) {
    if (args.length > 1) {
        throw new Error("agg Cmd expects 1 argumnet time_between_reqs")
    }
    const timeBetweenReqsStr = args[0]
    const delayT = getDelayTime(timeBetweenReqsStr)
    console.log("Collecting feeds every " + timeBetweenReqsStr)

    scrapeFeeds().catch(handleError);
    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, delayT);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
    /*const rssFeed = await fetchFeed(defaultUrl)
    console.log({ rssFeed })
    console.log({ items: rssFeed.channel.item })*/
}

export async function handleAddFeed(cmd: string, user: User, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error("add Cmd expects 2 argumnet, url and name of the feed")
    }
    const [name, url] = args

    const feed = await createFeed(name, url, user.id)
    const ffFollows = await createFeedFollows(user.id, feed.id)
    console.log("Feed name: " + ffFollows.name + ",url:" + ffFollows.url + " created by user: " + ffFollows.userName)


}


export async function handleFeedsCmd(cmd: string, ...args: string[]) {
    if (args.length > 0) {
        throw new Error("feeds Cmd expects no argumnet,got " + args.length + " args")

    }
    /*const cfg = readConfig()
    const userLogged = await getUserByName(cfg.currentUserName)
    if (userLogged === undefined) {
        throw new Error("user Name: " + cfg.currentUserName + "not registred")
    }*/
    const feedsAll = await getFeeds()
    if (feedsAll.length === 0) {
        console.log("No feeds created in gator database")
        return
    }
    feedsAll.forEach(f => {
        console.log("User name: " + f.userName + " feed name:" + f.name + ", urlFeed:" + f.url)
    })


}
