import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds"
import { createPost, getPostsForUser } from "src/lib/db/queries/posts"
import { fetchFeed } from "src/lib/rss/rss"
import { User } from "src/lib/db/schema"

function getValidRssString(publishedAt: string) {
    return new Date(publishedAt)
}

export async function scrapeFeeds() {
    const nextFeedToFetch = await getNextFeedToFetch()
    if (nextFeedToFetch === undefined) {
        throw new Error("query next feed to fetch return undefined")
    }
    const updateID = await markFeedFetched(nextFeedToFetch.id)
    if (updateID.updatedId !== nextFeedToFetch.id) {
        throw new Error("error update feed id")
    }
    const nextFeed = await fetchFeed(nextFeedToFetch.url)
    console.log("Feed Fetch title:" + nextFeed.channel.title, "url:" + nextFeed.channel.link)
    nextFeed.channel.item.forEach(async (it, i) => {
        let validDate: Date | undefined = undefined
        if (it.pubDate) {
            validDate = getValidRssString(it.pubDate)
        }
        const post = await createPost(it.title, it.link, updateID.updatedId, it.description, validDate)
        console.log("Create post title:" + post.title, ", url:" + post.url + " urlfeed:" + nextFeedToFetch.url)

        //console.log("item n:" + (i + 1) + " title:" + it.title + ", url:" + it.link)
    })
}

export async function handleBrowseCmd(cmd: string, user: User, ...args: string[]) {
    let limit = 2
    if (args.length > 1) {
        throw new Error("cmd Browse expect 1 optional parameter, got " + args.length + "args")
    }
    if (args.length === 1) {
        const limitParameter = args[0]
        const limitParamNum = Number.parseInt(limitParameter)
        if (Number.isNaN(limitParamNum)) {
            throw new Error("browse cmd expect 1 optional parameter limit number, got " + limitParameter)
        }
        if (limitParamNum < 0) {
            throw new Error("browse cmd expect 1 optional parameter limit number, got " + limitParameter + " not positive number")
        }
        limit = limitParamNum
    }
    const postsByUser = await getPostsForUser(user.id, limit)
    if (postsByUser.length === 0) {
        console.log("no post found for user " + user.name)
        return
    }
    console.log("user " + user.name + "has " + postsByUser.length + "posts")
    postsByUser.forEach((p, i) => {
        console.log("post n:" + (i + 1) + "title:" + p.title + ",url:" + p.url)
    })


}