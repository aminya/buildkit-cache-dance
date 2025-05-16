import { describe, it } from "vitest"
import { extractCaches } from "../src/extract-cache.js"
import { parseOpts } from "../src/opts.js"
import { beforeAll } from "vitest"
import { afterAll } from "vitest"
import { injectCaches } from "../src/inject-cache.js"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe("main", { timeout: 30000 }, () => {
    let cwd: string
    beforeAll(async () => {
        cwd = process.cwd()
        process.chdir("./tests/fixtures/hello")
    })

    afterAll(async () => {
        process.chdir(cwd)
    })

    it("should be able to extract cache from the default Dockerfile ", async () => {

        const opts = parseOpts(["--extract", "--context", "default"])
        await extractCaches(opts)
    })

    it("should inject cache", async () => {
        const opts = parseOpts(["--context", "default"])
        await injectCaches(opts)
    })

    it("should inject cache via dist import", async () => {
        await import("../dist/index.js")
    })
})

