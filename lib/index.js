"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RendererContext = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const node_path_1 = __importDefault(require("node:path"));
/** Wrapper for `puppeteer.Browser`
 * Note that the Context should be either:
 * - Initialized at startup, and kept alive for the programes lifetime
 * - Initialized, used, and disposed for every render
 * In other words, multiple instances of RenderOptions should not exists at the same time
 *
 * Usage:
 * * Takes `RendererOptions` optionally at construction
 * * Initialized using `this.init()`
 * * Disposed using `this.dispose()`
 */
class RendererContext {
    #browser = null;
    #options;
    constructor(options = {
        outputDir: './',
        targetClass: 'body'
    }) {
        this.#options = options;
    }
    /** Initialized the `RendererContext`
     * * Should be disposed with `this.dispose()`
     */
    init = async (args) => {
        this.#browser = await puppeteer_1.default.launch({ args: args ?? [] });
    };
    /** Renders every entry to corresponsing output
     * * See `RendererOptions` for options
     *
     * @param entries
     * @returns
     */
    renderUrl = async (entries) => {
        return new Promise(async (resolve, reject) => {
            if (!this.#browser)
                return reject("context has not been initialized");
            const paths = [];
            for (const entry of entries) {
                const page = await this.#browser.newPage();
                await page.emulateMediaType('screen');
                await page.goto(entry.url, { waitUntil: 'domcontentloaded' });
                await page.waitForNavigation({
                    waitUntil: 'networkidle0',
                });
                const div = await page.$(this.#options.targetClass);
                if (!div)
                    return reject(`"missing ${this.#options.targetClass} from dom`);
                const boundingBox = await div.boundingBox();
                if (!boundingBox)
                    return reject("failed to resolve bounding-box size");
                const { height, width } = boundingBox;
                const fullPath = node_path_1.default.join(this.#options.outputDir, entry.output);
                paths.push(entry.output);
                await page.pdf({
                    path: fullPath,
                    margin: { top: '10px', left: '10px', bottom: '10px', right: '10px' },
                    printBackground: true,
                    width: `${width + 20}px`,
                    height: `${height + 20}px`,
                }).catch(err => {
                    return reject(err);
                });
                await page.close();
            }
            return resolve(paths);
        });
    };
    /** Disposes `RendererContext` */
    dispose = async () => {
        await this.#browser?.close();
    };
}
exports.RendererContext = RendererContext;
