//const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
import { XMLParser } from "fast-xml-parser";


type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

type RSSItem = {
    title: string;
    link: string;
    description?: string;
    pubDate?: string;
};




export async function fetchFeed(feedURL: string) {
    const response = await fetch(feedURL, {
        headers: {
            "User-Agent": "gator",
        }
    })
    if (!response.ok) {
        throw new Error("fetch url: " + feedURL + "statusCode: " + response.status + " " + response.statusText)
    }
    const xmlText = await response.text()
    const parser = new XMLParser();
    const xmlObj = parser.parse(xmlText)
    //console.log(xmlObj)

    if (!xmlObj.rss.channel) {
        throw new Error("No Channel keys in url: " + feedURL + "response")
    }
    const resp = {} as RSSFeed
    const channel = xmlObj.rss.channel
    if (!channel.title || typeof channel.title !== "string") {
        throw new Error("Invalid type  in channel Obj url: " + feedURL)
    }
    if (!channel.link || typeof channel.link !== "string") {
        throw new Error("Invalid link in channel Obj url: " + feedURL)
    }
    if (!channel.description || typeof channel.description !== "string") {
        throw new Error("Invalid link in channel Obj url: " + feedURL)
    }


    const items: RSSItem[] = []

    if (channel.item && Array.isArray(channel.item)) {
        for (let itemVal of channel.item) {

            if (!itemVal.title || typeof itemVal.link !== "string") {
                continue
            }
            if (!itemVal.link || typeof itemVal.link !== "string") {
                continue
            }
            if (itemVal.description && typeof itemVal.description !== "string") {
                continue
            }
            if (!itemVal.pubDate && typeof itemVal.pubDate !== "string") {
                continue
            }
            items.push({
                title: itemVal.title,
                link: itemVal.link,
                description: itemVal.description,
                pubDate: itemVal.pubDate
            })


        }
    }
    resp.channel = {
        title: channel.title,
        link: channel.link,
        description: channel.description,
        item: items
    }
    return resp








}