import ytdl, { downloadOptions } from "ytdl-core";
import prism from "prism-media";
interface CreateOpusStreamOptions extends downloadOptions {
    seek?: number;
    encoderArgs?: any[];
}
declare const _default: {
    createOpusStream: (url: string, options: CreateOpusStreamOptions) => prism.opus.Encoder;
    ytdl: typeof ytdl;
};
export = _default;
