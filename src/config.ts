import fs from "fs"
import path from "path"
import os from "os"


const fileName = ".gatorconfig.json"

export type Config = {
    dbUrl: string,
    currentUserName: string
}

type ReadConfig = {
    db_url: string,
    current_user_name: string
}

export function setUser(currentUserName: string) {
    const cfg = readConfig()
    cfg.currentUserName = currentUserName
    writeConfig(cfg)
}

export function readConfig(): Config {
    const filePath = getConfigFilePath()
    let result: Config = {
        dbUrl: "",
        currentUserName: ""
    }
    try {
        const data = fs.readFileSync(filePath, { encoding: "utf-8" })
        const configData = JSON.parse(data)
        const resultConfig = validateConfig(configData)
        result = resultConfig
    }
    catch (error) {
        let msg = "Error reading file: " + filePath
        if (error instanceof Error) {
            msg += " errMsg: " + error.message
        }
        console.log(msg)
    }
    return result
}

function getConfigFilePath(): string {
    const homeDir = os.homedir()
    return path.join(homeDir, fileName)

}


function writeConfig(cfg: Config): void {
    const fileName = getConfigFilePath()

    const rConfig: ReadConfig = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName
    }
    try {
        const data = JSON.stringify(rConfig, null, 2);
        fs.writeFileSync(fileName, data, { encoding: "utf-8" })

    } catch (error) {
        let msg = "Error Writing to file: " + fileName
        if (error instanceof Error) {
            msg += " errMsg: " + error.message
        }
        console.log(msg)
    }

}

function validateConfig(rawConfig: any): Config {
    const result: Config = {
        dbUrl: "",
        currentUserName: ""
    }
    if (Array.isArray(rawConfig)) {
        return result
    }


    if (typeof rawConfig !== "object") {
        return result
    }
    if ("db_url" in rawConfig) {
        result.dbUrl = rawConfig.db_url
    }

    if ("current_user_name" in rawConfig) {
        result.currentUserName = rawConfig.current_user_name
    }

    return result




} 