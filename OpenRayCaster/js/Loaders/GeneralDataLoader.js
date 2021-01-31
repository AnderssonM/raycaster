/**
 *  A class for loading data through XMLHttpRequests
 * @author Martin Andersson, V.I.C, 2015. All rights reserved
 * @constructor
 * 
 */
export class GeneralDataLoader {

    id = "GeneralLoader";
    url = "";
    minimumResponseSize = 0;
    numRetries = 0;
    _failedRetries = 0;
    responseType = 'arraybuffer';
    asynchronous = true;
    constructor() {
        console.log('New General  Loader::');
    }

    /**
     * loadURL, loads data from url
     * @public
     * @param {string} url the URL to load
     * @param {lasttime} datetime check if updated since lastTime
     */
    loadURL(url, lastTime) {
        // create request object.
        this.request = new XMLHttpRequest();
        // set callback
        this.request.onreadystatechange = this.update.bind(this);
        // make request to get the file.
        this.url = url;
        this.request.open('GET', url, this.asynchronous);
        // specify the response type to 'arraybuffer'.
        if (this.asynchronous) {
            this.request.responseType = this.responseType;
        }
        // set 'last modified' time to UNIX time = '0'.
        this.request.setRequestHeader('Pragma', 'no-cache');
        this.request.setRequestHeader('Cache-Control', 'no-cache');
        //req.setRequestHeader("Expires", "Thu, 01 Jun 1970 00:00:00 GMT");

        if (lastTime === void 0) {
            this.request.setRequestHeader("If-Modified-Since", "Thu, 01 Jun 1970 00:00:00 GMT");
        } else {
            this.request.setRequestHeader("If-Modified-Since", lastTime.toGMTString());
        }

        // send the request.
        this.request.send();
    }
    /**
     * reload, reloads the data
     * @private 
     * @returns {undefined}
     */
    reload()
    {
        console.log("GeneralDataLoader:reload:" + this.url);
        this._failedRetries += 1;
        if (this._failedRetries <= this.numRetries) {
            this.loadURL(this.url, 0);
        } else {
            console.error("Load failed ( after  " + this._failedRetries + " retries).");
            this.onError();
        }
    }
    /**
     * update  Ready state change eventhandler 
     * @private
     *
     */
    update() {

        if (this.request.readyState === this.request.DONE) {
            if (this.request.status === 200 && this.request.response) {
                if (this.request.response.byteLength < this.minimumResponseSize || this.minimumResponseSize === 0) {
                    this.done(this.request.response);
                } else {
                    console.error("GeneralDataLoader: Request loaded, but response data size too small");
                }
            } else if (this.request.status === 304) {     // Not modified
                this.done(this.request.response);
            } else {
                console.error("GeneralDataLoader: ERROR", this.request.status);
                this.reload();
            }
        } else {
            //   console.log("GeneralDataLoader: STATUS", this.url);
        }
    }
    /**
     * done Callback for loadcomplete , override in caller to receive the request
     * response.
     * @callback GeneralDataLoader~done
     * @param {Object} r Request response
     **/
    done(r) {
        console.log("GenrealDataLoader: Request success for ", this.url);
    }
}