import { db } from "../index";
import { feeds, users, feedFollows } from "../schema";
import { eq, and } from "drizzle-orm";

export async function createFeedFollows(userID: string, feedId: string) {
    const [fFollow] = await db.insert(feedFollows).values({ userId: userID, feedId: feedId }).returning();
    const [result] = await db.select({
        id: feedFollows.id,
        name: feeds.name,
        url: feeds.url,
        userName: users.name
    }).from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .where(
            eq(feedFollows.id, fFollow.id)
        )

    return result;
}

export async function getFeedFollowForUser(userID: string) {
    const result = await db.select({
        id: feedFollows.id,
        name: feeds.name,
        url: feeds.url
    }).from(feedFollows)
        .innerJoin(feeds, and(eq(feedFollows.feedId, feeds.id)))
        .where(
            eq(feedFollows.userId, userID)
        )

    return result;

}

export async function removeFollowForUser(userID: string, feedId: string) {
    await db.delete(feedFollows).where(and(eq(feedFollows.feedId, feedId), eq(feedFollows.userId, userID)))
}