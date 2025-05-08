/**Interface describing entries */
interface UrlEntry {
    url: string;
    output: string;
}
/**Options for rendered
 * * Passed in initialization
 *
 * Options:
 * - `outputDir`: The output directory, where entries are saved
 * - `targetClass`: Used for scaling the pdf dimensions. By default is based on the size of documents body (whole page)
 */
interface RendererOptions {
    outputDir: string;
    targetClass: string;
}
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
export declare class RendererContext {
    #private;
    constructor(options?: RendererOptions);
    /** Initialized the `RendererContext`
     * * Should be disposed with `this.dispose()`
     */
    init: (args?: string[]) => Promise<void>;
    /** Renders every entry to corresponsing output
     * * See `RendererOptions` for options
     *
     * @param entries
     * @returns
     */
    renderUrl: (entries: UrlEntry[]) => Promise<string[]>;
    /** Disposes `RendererContext` */
    dispose: () => Promise<void>;
}
export {};
