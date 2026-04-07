import { url } from "node:inspector";
import { db } from "../index";
import { type Feed, feedFollows, feeds, users } from "../schema";
import { eq, sql } from "drizzle-orm";

export async function createFeed(name: string, url: string, userID: string) {
    const [result] = await db.insert(feeds).values({ name: name, url: url, userId: userID }).returning();
    return result;
}

export async function getFeeds() {
    const result = await db.select({
        name: feeds.name,
        url: feeds.url,
        userName: users.name
    }).from(feeds)
        .innerJoin(users, eq(feeds.userId, users.id))

    return result
}


export async function getFeedsByUrl(urlInput: string) {
    const [result] = await db.select()
        .from(feeds)
        .where(eq(feeds.url, urlInput))
    return result
}

export async function markFeedFetched(feedID: string) {
    const [result] = await db.update(feeds)
        .set({ lastFetchedAt: new Date() })
        .where(eq(feeds.id, feedID))
        .returning({ updatedId: feeds.id });

    return result

}

export async function getNextFeedToFetch() {
    /*const [result] = await db.execute(sql`select * from ${feeds} ORDER BY ${feeds.lastFetchedAt} ASC NULLS FIRST LIMIT 1`)
    return result*/
    const [result] = await db
        .select()
        .from(feeds)
        .orderBy(sql`${feeds.lastFetchedAt} asc nulls first`)
        .limit(1);
    return result
}