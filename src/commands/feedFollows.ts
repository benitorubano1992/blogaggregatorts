import { getFeedsByUrl } from "src/lib/db/queries/feeds"
import { createFeedFollows, getFeedFollowForUser, removeFollowForUser } from "src/lib/db/queries/feedfollows"
import { User } from "src/lib/db/schema"


export async function handleFollowFeed(cmd: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error("follow Cmd expects 1 argumnet, url of the feed")
    }
    const [url] = args
    /*const cfg = readConfig()
    const userLogged = await getUserByName(cfg.currentUserName)
    if (userLogged === undefined) {
        throw new Error("user Name: " + cfg.currentUserName + "not registred")
    }
    console.log({ urlFeed: url })
    */
    const feed = await getFeedsByUrl(url)
    if (feed === undefined) {
        throw new Error("feed url:" + url + "not found in gator database")
    }
    console.log({ feedUrl: feed })

    //const feed = await createFeed(name, url, userLogged.id)
    const ffFollows = await createFeedFollows(user.id, feed.id)
    console.log({ ffFollows })
    console.log("Feed Follow created, feed url:" + ffFollows.url + " follow by user: " + ffFollows.userName)


}

export async function handleFollowingFeed(cmd: string, user: User, ...args: string[]) {
    if (args.length !== 0) {
        throw new Error("following Cmd expects 0 argumnet, got " + args.length + "argument")
    }

    /*const cfg = readConfig()
    const userLogged = await getUserByName(cfg.currentUserName)
    if (userLogged === undefined) {
        throw new Error("user Name: " + cfg.currentUserName + "not registred")
    }
    */
    const feedsFollowsByUser = await getFeedFollowForUser(user.id)
    if (feedsFollowsByUser.length === 0) {
        console.log("User name:" + user.name + " follows no feed")
        return

    }
    console.log("feed follows by user Name " + user.name)
    feedsFollowsByUser.forEach((ff, i) => {
        console.log("feed n:" + (i + 1), " name:" + ff.name + ",url:" + ff.url)
    })

}

export async function handleUnfollowCmd(cmd: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error("unfollow Cmd expects 1 argument, url of the feed")
    }
    const [url] = args
    const feed = await getFeedsByUrl(url)
    if (feed === undefined) {
        throw new Error("feed url:" + url + "not found in gator database")
    }
    await removeFollowForUser(user.id, feed.id)
    console.log("Unfollow Feed url:" + url + " for user " + user.name)

    /*const cfg = readConfig()
    const userLogged = await getUserByName(cfg.currentUserName)
    if (userLogged === undefined) {
        throw new Error("user Name: " + cfg.currentUserName + "not registred")
    }
    console.log({ urlFeed: url })
    */
    /*const feed = await getFeedsByUrl(url)
    if (feed === undefined) {
        throw new Error("feed url:" + url + "not found in gator database")
    }
    console.log({ feedUrl: feed })

    //const feed = await createFeed(name, url, userLogged.id)
    const ffFollows = await createFeedFollows(user.id, feed.id)
    console.log({ ffFollows })
    console.log("Feed Follow created, feed url:" + ffFollows.url + " follow by user: " + ffFollows.userName)
    */

}