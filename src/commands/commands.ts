import { type User } from "src/lib/db/schema";
import { readConfig } from "src/config";
import { getUserByName } from "src/lib/db/queries/users";
type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
) => Promise<void>;

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async function (cmdName: string, ...args: string[]) {
        const cfg = readConfig()
        const userLogged = await getUserByName(cfg.currentUserName)
        if (userLogged === undefined) {
            throw new Error("user Name: " + cfg.currentUserName + "not registred")
        }
        await handler(cmdName, userLogged, ...args)
    }

}

export type CommandsRegistry = {
    [key: string]: CommandHandler;
}

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    console.log({ cmdName })
    console.log({ args })
    // console.log("run Command entry")
    const cmdHandler = registry[cmdName]
    //console.log("cmdRegistry keys: " + Object.keys(registry) + "command Name: " + cmdName + " " + cmdName === "login")
    if (cmdHandler === undefined) {
        console.log("cmd name: " + cmdName + " not registred")
        return
    }
    await cmdHandler(cmdName, ...args)


}


