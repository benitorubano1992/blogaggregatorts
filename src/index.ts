import { type CommandsRegistry, registerCommand, runCommand, middlewareLoggedIn } from "./commands/commands"
import { handleReset, handlerLogin, handlerRegister, handleUsersCmd } from "./commands/users"
import { handleAddFeed, handleAggCmd, handleFeedsCmd } from "./commands/feeds/aggCmd"
import { argv, exit } from "node:process"
import { handleFollowFeed, handleFollowingFeed, handleUnfollowCmd } from "./commands/feedFollows"
import { handleBrowseCmd } from "./commands/aggregate"
//import { type Config, readConfig, setUser } from "./config";



async function main() {
    //console.log("Hello, world!");
    //const cfg = readConfig()
    //setUser(cfg, "Lane")
    const mapCmds: CommandsRegistry = {}
    registerCommand(mapCmds, "login", handlerLogin)
    registerCommand(mapCmds, "register", handlerRegister)
    registerCommand(mapCmds, "reset", handleReset)
    registerCommand(mapCmds, "users", handleUsersCmd)
    registerCommand(mapCmds, "agg", handleAggCmd)
    registerCommand(mapCmds, "addfeed", middlewareLoggedIn(handleAddFeed))
    registerCommand(mapCmds, "feeds", handleFeedsCmd)
    registerCommand(mapCmds, "follow", middlewareLoggedIn(handleFollowFeed))
    registerCommand(mapCmds, "following", middlewareLoggedIn(handleFollowingFeed))
    registerCommand(mapCmds, "unfollow", middlewareLoggedIn(handleUnfollowCmd))
    registerCommand(mapCmds, "browse", middlewareLoggedIn(handleBrowseCmd))
    //console.log(...Object.keys(mapCmds))

    const [nameProgram, otherName, ...args] = argv
    if (args.length < 1) {
        console.log("Program gator require at least 1 argument")
        exit(1)
    }
    //const cmdName = args[0]
    //console.log("nameProgram: " + nameProgram + " commandName: " + cmdName)
    try {
        await runCommand(mapCmds, args[0], ...args.slice(1))

    } catch (error) {
        let msg = "Error run Cmd: " + args[0]
        if (error instanceof Error) {
            msg += " " + error.message
        }
        console.log(msg)
        exit(1)
    }
    exit(0)
    //const newCfg = readConfig()
    //console.log("dbUrl:", newCfg.dbUrl)
    //console.log("currentUserName:", newCfg.currentUserName)


}
main()