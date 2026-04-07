import { isMarkedAsUntransferable } from "worker_threads";
import { db } from "../index";
import { feeds, posts, users, feedFollows } from "../schema";
import { eq, desc } from "drizzle-orm";

export async function createPost(title: string, url: string, feedId: string, description?: string, publishedAt?: Date) {
    const [result] = await db.insert(posts).values({
        title: title,
        url: url,
        feedId: feedId,
        description: description,
        publishedAt: publishedAt
    }).onConflictDoNothing()
        .returning();
    return result;
}

export async function getPostsForUser(userID: string, limit: number) {
    const result = await db.select({
        title: posts.title,
        url: posts.url,
        userName: users.name
    }).from(posts)
        .innerJoin(feedFollows, eq(feedFollows.feedId, posts.feedId))
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .where(eq(feedFollows.userId, userID))
        .orderBy(desc(posts.publishedAt))
        .limit(limit)

    return result

}