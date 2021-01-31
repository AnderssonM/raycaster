import {GeneralDataLoader} from "../GeneralDataLoader.js";
import * as Zlib from '../../../lib.js/inflate.min.js';
import { HistHeader } from './HistHeader.js';
import {Histogram} from './Histogram3D.js';

export class HistogramLoader extends GeneralDataLoader {
    /**
     * Creates an instance of HistogramLoader
     * 
     * @author Martin Andersson, V.I.C. based on the work of Dr. Hosoya
     * @author Takaaki HOSOYA
     * @constructor
     * @this {HistHeader}
     * @param {Function} onSuccess Callback for onSuccess event
     * @param {Function} onError   Callback for onError event
     */
    constructor(onSuccess, onError) {
        //   console.log("histogramloader constructor",this);
        this.FAIL = 1;
        this.SUCESS = 0;
        this.onSuccess = onSuccess;
        this.onError = onError;
        this.minLength = 140;
        this.hists = new Array(4);
        this.header = new HistHeader();
    }

    loadFile(URL, lastTime) {
        this.loadURL(URL, lastTime);
    }
    done(buffer) {
        console.log("create hist");

        // data file is not modified
        if (buffer === null) {
            printMessage("Requested file is not modified: " + this.url.match(".+/(.+?)$")[1], "#00aa00");
            return this.SUCESS;
        }

        var offset = this.header.deserialize(buffer, 0);
        // Check buffer length (must be larger than the total size)
        if (buffer.byteLength < this.header.sizeTotal) {
            return this.FAIL;
        }
        console.log("header:compression format:" + this.header.compressionFormat);
        if (this.header.compressionFormat === 1) {
            console.log("header:compression format: 1 || true");
//            var histBuf = (new Zlib.Inflate(new Uint8Array(buffer, offset))).decompress().buffer;

            var compressed = (new Uint8Array(buffer, offset));
            var inflate = new Zlib.Inflate(compressed);
            var plain = inflate.decompress();
            var histBuf = plain.buffer;
            offset = 0;
        } else {
            var histBuf = buffer;
        }

// Read histograms
        this.hists = new Array(this.header.numHists);
        console.log("header.numHists:" + this.header.numHists);
        for (var i = 0; i < this.header.numHists; ++i) {
            var hist = new Histogram();
            offset = hist.deserialize(histBuf, offset);
            this.hists[i] = hist;
        }
        console.log("load success (+ " + this.numRetries + " retries).", "#00aa00");
        this.onSuccess("success event", this.header, this.hists);
        return this.SUCESS;
    }

}