/// <reference types="node" />
import ytdl, { downloadOptions } from "ytdl-core";
import prism from "prism-media";
import { Readable, Duplex } from "stream";
/**
 * Stream Options
 * @param {Number} seek Time in seconds to seek
 * @param {Array} encoderArgs Args provided to transcoder
 * @param {String} fmt Output format.
 * @param {Boolean} opusEncoded It should return opus encoded stream?
 */
interface YTDLStreamOptions extends downloadOptions {
    seek?: number;
    encoderArgs?: any[];
    fmt?: string;
    opusEncoded?: boolean;
}
/**
 * Stream Options
 * @param {Number} seek Time in seconds to seek
 * @param {Array} encoderArgs Args provided to transcoder
 * @param {String} fmt Output format.
 * @param {Boolean} opusEncoded It should return opus encoded stream?
 */
interface StreamOptions {
    seek?: number;
    encoderArgs?: any[];
    fmt?: string;
    opusEncoded?: boolean;
}
declare const DiscordYTDLCore: {
    (url: string, options: YTDLStreamOptions): prism.opus.Encoder | prism.FFmpeg;
    arbitraryStream: (stream: string | Readable | Duplex, options: StreamOptions) => prism.opus.Encoder | prism.FFmpeg;
} & typeof ytdl;
export = DiscordYTDLCore;
