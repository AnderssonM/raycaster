/**
 * Creates an instance of HistAxis
 * 
 * @author Martin Andersson, V.I.C. based on the work of Dr. Hosoya
 * @author Takaaki HOSOYA
 * @constructor
 * @this {HistAxis} 
 * 
 */
//! Constructor with decoding from raw data.
export class HistAxis {

    // Fields
    _name= ""; // Name of the axis.
    _numberOfPixels= 0; // Length of the axis (not the number of the elements).
    _minimum= 0;
    _maximum= 0;
    _numBins= 0;
    _binMinimums= [];
    _binWidths= [];
    /**
     * Deserialize the axis information from the byte array.
     * @param  buffer  Buffer array of the histogram axis.
     * @param  offset  buffer offset
     */
    deserialize(buffer, offset) {
        var dataView = new DataView(buffer, offset);
        this._name = arrayToStr(new Uint8Array(buffer, offset), 64);
        this._numberOfPixels = dataView.getUint32(64, true);
        this._minimum = dataView.getUint32(68, true);
        this._maximum = dataView.getUint32(72, true);
        this._numBins = dataView.getUint32(76, true);
        this._minBinCoordinate = dataView.getInt32(80, true);
        for (var b = 0; b < this._numBins; b++) {
            this._binMinimums.push(dataView.getInt32(80 + b * 8, true));
            this._binWidths.push(dataView.getUint32(84 + b * 8, true));
        }
        return (offset + 80 + (this._numBins * 8));
    }
    /**
     * Set axis information.
     * @param  name    Name of the axis.
     * @param  length  Length of the axis (not the number of the elements).
     * @param  start   Start value of the axis.
     * @param  step    Step width of the axis.
     */
    set(name,
            length,
            start,
            step) {
        this._name = name;
        this._length = length;
        this._start = start;
        this._step = step;
    }
    //! Returns the name of the axis.
    get name() {
        return this._name;
    }
    //! Returns the length of the axis (not number of the elements).
    get length() {
        return this._length;
    }
    //! Returns the start value of the axis.
    get start() {
        return this._start;
    }
    //! Returns the end value of the axis.
    get end() {
        return this._start + this._length;
    }
    //! Returns the step width of the axis.
    get step() {
        return this._step;
    }
    //! Returns the number of the elements.
    get numElems() {
        return this._length / this._step;
    }
    //! Returns index of the elements for the value.
    elemIndex(pos) {
        if (pos < this._start) {
            return 0;
        }
        else if (pos > this.end()) {
            return this.numElems;
        }
        return parseInt((pos - this._start) / this._step,10);
    }
}