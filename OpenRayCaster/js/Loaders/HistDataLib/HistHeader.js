/**
 * Creates an instance of HistHeader
 * 
 * @author Martin Andersson, V.I.C. based on the work of Dr. Hosoya
 * @author Takaaki HOSOYA
 * @constructor
 * @this {HistHeader}
 * 
 */
export class HistHeader{

//Header
    _sizeHeader= -1;
    _sizeSuppl= -1;
    _datataName= "NO DATA";
    _compressionFormat= -1;
    _runNumber= -1;
    _compType= -1;
    _numHists= -1;
    _totalSizeNonComp= -1;
    _totalSizeComp= -1;
    // Sub Header .HST
    _beamLineCode= "NO BL CODE"; //arrayToStr(new Uint8Array(buffer; 152); 4);//// Beamline code string 4
    _moduleId= -1;
    _detectorId= -1;
    _acquisitionStartTime= -1;
    // Sub Header .QMP
    _CPUDAQ= -1;
    /**
     *  Deserialize the header information from the byte array.
     *  @param  {ArrayBuffer} buffer  Buffer array of the header data.
     *  @param  {number} offset  buffer offset for header
     */

    deserialize(buffer, offset) {
        var dataView = new DataView(buffer, offset);
        this._sizeHeader = dataView.getUint32(0, true);
        this._sizeSuppl = dataView.getUint32(4, true); // size of subheader [bytes] UINT4
        this._dataName = arrayToStr(new Uint8Array(buffer, 8), 128); // Data  name string 128
        this._compressionFormat = dataView.getUint32(136, true); // compression format uint4
        this._numHists = dataView.getUint32(140, true); //// number of histogram blocks uint4 
        this._totalSizeNonComp = dataView.getUint32(144, true); //// total size of hist data block non compressed  Uint4 
        this._totalSizeComp = dataView.getUint32(148, true); // // total size of hist data block compressed Uint4 

        if (this._sizeSuppl === 20) {
            this._beamLineCode = arrayToStr(new Uint8Array(buffer, 152), 4); //// Beamline code string 4
            this._moduleId = dataView.getUint32(156, true); ////Readout module id uint 4
            this._detectorId = dataView.getUint32(160, true); ////detector id uint 4
            this._runNumber = dataView.getUint32(164, true); ////run number uint 4
            this._acquisitionStartTime = utimeToDate(dataView.getUint32(168, true)); ////acquisition starting time uint4

        }
        else {
            this._CPUDAQ = dataView.getUint32(152, true); ////Readout module id uint 4
            this._runNumber = dataView.getUint32(156, true); ////detector id uint 4
            this._acquisitionStartTime = utimeToDate(dataView.getUint32(160, true)); ////run number uint 4     
        }
        console.log("numHists" + this._numHists);
        console.log("acq Start Time:" + this._acquisitionStartTime);
        return (offset + this._sizeHeader + this._sizeSuppl);
    }
    //! Returns the size of the Header
    get zizeHeader() {
        return this._sizeHeader;
    }
    //! Returns the size of the Sub Header
    get sizeSuppl() {
        return this._sizeSuppl;
    }
    //! Returns the name of the Histogram data set
    get dataName() {
        return this._dataName;
    }
    //! Returns the compression format
    get compressionFormat() {
        return this._compressionFormat;
    }
    //! Returns the compression format in  string format
    get stringCompressionFormat() {
        return this._compressionFormat === 0 ? "Not Compressed" : "Deflate";
    }
    //! Returns the number of histograms in data set
    get numHists() {
        return this._numHists;
    }
              //! Returns the start value of the axis.
    get sizeHists() {
        return this._totalSizeNonComp;
    }
    get sizeHistCompressed() {
        return this._totalSizeComp;
    }
    get sizeTotal() {
        return this._totalSizeComp + this._sizeHeader;
    }
    get beamlineCode() {
        return this._beamLineCode;
    }
    get readoutModuleId() {
        return this._moduleId;
    }
    get detectorID() {
        return this._detectorId;
    }
    get runNumber() {
        return this._runNumber;
    }
    get startTime() {
        return this._acquisitionStartTime;
    }
    get daqID() {
        return this._CPUDAQ;
    }
//        this.__defineGetter__("sizeHistCompressed", function() {
//return _totalSizeComp;
//        });
//        this.__defineGetter__("sizeTotal", function() {
//return _totalSizeComp + _sizeHeader;
//        });
//        this.__defineGetter__("beamlineCode", function() {
//return _beamLineCode;
//        });
//        this.__defineGetter__("readoutModuleId", function() {
//return _moduleId;
//        });
//        this.__defineGetter__("detectorID", function() {
//return _detectorId;
//        });
//        this.__defineGetter__("runNumber", function() {
//return _runNumber;
//        });
//        this.__defineGetter__("startTime", function() {
//return _acquisitionStartTime;
//        });
//        this.__defineGetter__("daqID", function() {
//return _CPUDAQ;
//        });
};

