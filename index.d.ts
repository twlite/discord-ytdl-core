import ytdl, { downloadOptions } from "ytdl-core";
import prism from "prism-media";
interface CreateOpusStreamOptions extends downloadOptions {
    seek?: number;
    encoderArgs?: any[];
}
declare const DiscordYTDLCore: ((url: string, options: CreateOpusStreamOptions) => prism.opus.Encoder) & typeof ytdl;
export = DiscordYTDLCore;
