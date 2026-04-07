import { getUserByName, createUser, DeleteUsers, getUsers } from "../lib/db/queries/users"
import { readConfig, setUser } from "../config"


export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("login Cmd expects one argument")
    }
    let userName = args[0]
    const userbyName = await getUserByName(userName)
    //console.log({ userbyName })
    if (userbyName === undefined) {
        throw new Error("user Name: " + userName + "not exists")
    }
    setUser(userName)
    console.log("userName " + userName + " has been set");

}


export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("register Cmd expects one argument")
    }
    let userName = args[0]
    console.log({ userName })
    /*if (userName === "unknown") {
        throw new Error("unknown invalid user Name")
    }*/

    const userbyName = await getUserByName(userName)
    //console.log({ userbyName })
    if (userbyName !== undefined) {
        throw new Error("user Name: " + userName + "already exists")
    }
    const newUser = await createUser(userName)
    setUser(newUser.name)
    console.log("user Name: " + newUser.name + " has been created")
    console.log({ newUser })
}


export async function handleReset(cmdName: string, ...args: string[]) {
    if (args.length > 0) {
        throw new Error("reset Cmd expects No argument")
    }
    await DeleteUsers()
    console.log("All users has been deleted")


}


export async function handleUsersCmd(cmdName: string, ...args: string[]) {
    if (args.length > 0) {
        throw new Error("users Cmd expects No argument")
    }
    const userNames = await getUsers()
    const config = readConfig()
    const printNames = userNames.map(u => {
        let base = "* " + u.name
        if (u.name == config.currentUserName) {
            base += " (current)"
        }
        return base + "\n"
    })
    console.log(...printNames)

}
