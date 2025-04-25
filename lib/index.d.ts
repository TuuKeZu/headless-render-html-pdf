interface UrlEntry {
    url: string;
    output: string;
}
interface RendererOptions {
    outputDir: string;
    targetClass: string;
}
export declare class RendererContext {
    #private;
    constructor(options?: RendererOptions);
    init: () => Promise<void>;
    renderUrl: (entries: UrlEntry[]) => Promise<string[]>;
    dispose: () => Promise<void>;
}
export {};
