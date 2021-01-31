/**
 * This file contains highly experimental code for loading the webp format
 * in browsers without native support, using the WebPDecoder library
 * 
 * Not enabled  at the moment, because status is .... shaky ....
 * some day....  perhaps.
 * 
 * @author  Based on various chucks of JS from the 'lost and found' department of the internet.
 * 
 */
function convertBinaryToArray(binary) {
    var arr = new Array();
    var num = binary.length;
    var i;
    for (i = 0; i < num; ++i)
        arr.push(binary.charCodeAt(i));
    return arr;
}

WebPDecodeAndDraw = function (data) {
    console.log("WEBP:DECODE START");
    var start = new Date();

    ///--------- libwebpjs 0.2.0 decoder code start ---------------------------------------------
    var WebPImage = {width: {value: 0}, height: {value: 0}}
    var decoder = new WebPDecoder();

    data = convertBinaryToArray(data);//unkonvertierung in char

    //Config, you can set all arguments or what you need, nothing no objeect 
    var config = decoder.WebPDecoderConfig;
    var output_buffer = config.j;
    var bitstream = config.input;

    if (!decoder.WebPInitDecoderConfig(config)) {
        alert("Library version mismatch!\n");
        return -1;
    }

    var StatusCode = decoder.VP8StatusCode;

    status = decoder.WebPGetFeatures(data, data.length, bitstream);
    if (status != 0) {
        alert('error');
    }

    var mode = decoder.WEBP_CSP_MODE;
    output_buffer.J = 4;

    status = decoder.WebPDecode(data, data.length, config);

    ok = (status == 0);
    if (!ok) {
        alert("Decoding of %s failed.\n");
        //fprintf(stderr, "Status: %d (%s)\n", status, kStatusMessages[status]);
        return -1;
    }

    //alert("Decoded %s. Dimensions: "+output_buffer.width+" x "+output_buffer.height+""+(bitstream.has_alpha.value ? " (with alpha)" : "")+". Now saving...\n");
    var bitmap = output_buffer.c.RGBA.ma;
    //var bitmap = decoder.WebPDecodeARGB(data, data.length, WebPImage.width, WebPImage.height);

    ///--------- libwebpjs 0.2.0 decoder code end ---------------------------------------------

    var end = new Date();
    var bench_libwebp = (end - start);

    if (bitmap) {
        //Draw Image
        var start = new Date();
        var biHeight = output_buffer.height;
        var biWidth = output_buffer.width;

        canvas.height = biHeight;
        canvas.width = biWidth;

        var context = canvas.getContext('2d');
        var output = context.createImageData(canvas.width, canvas.height);
        var outputData = output.data;

        for (var h = 0; h < biHeight; h++) {
            for (var w = 0; w < biWidth; w++) {
                outputData[0 + w * 4 + (biWidth * 4) * h] = 255;//bitmap[1 + w * 4 + (biWidth * 4) * h];
                outputData[1 + w * 4 + (biWidth * 4) * h] = bitmap[2 + w * 4 + (biWidth * 4) * h];
                outputData[2 + w * 4 + (biWidth * 4) * h] = bitmap[3 + w * 4 + (biWidth * 4) * h];
                outputData[3 + w * 4 + (biWidth * 4) * h] = 255;//bitmap[0 + w * 4 + (biWidth * 4) * h];

            }
            ;
        }

        context.putImageData(output, 0, 0);
        var end = new Date();
        var bench_canvas = (end - start);

        //  decSpeedResult.innerHTML = 'Speed result:<br />libwebpjs: finish in ' + bench_libwebp + 'ms';
//        finishDecoding();
    }
    console.log("WEBP:DECODE STOP");
    instance._canvas.height = biHeight;
    instance._canvas.width = biWidth;
    
    instance.height = biHeight;
    instance.width = biWidth;
    instance.onSuccess(instance);
};

function createRequestObject() {
    var ro;
    var browser = navigator.appName;
    if (browser == "Microsoft Internet Explorer") {
        ro = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        ro = new XMLHttpRequest();
    }
    return ro;
}

var http = createRequestObject();

function convertResponseBodyToText(IEByteArray) {
    var ByteMapping = {};
    for (var i = 0; i < 256; i++) {
        for (var j = 0; j < 256; j++) {
            ByteMapping[ String.fromCharCode(i + j * 256) ] =
                    String.fromCharCode(i) + String.fromCharCode(j);
        }
    }
    var rawBytes = IEBinaryToArray_ByteStr(IEByteArray);
    var lastChr = IEBinaryToArray_ByteStr_Last(IEByteArray);
    return rawBytes.replace(/[\s\S]/g,
            function (match) {
                return ByteMapping[match];
            }) + lastChr;
}

var IEBinaryToArray_ByteStr_Script =
        "<!-- IEBinaryToArray_ByteStr -->\r\n" +
        "<script type='text/vbscript'>\r\n" +
        "Function IEBinaryToArray_ByteStr(Binary)\r\n" +
        "	IEBinaryToArray_ByteStr = CStr(Binary)\r\n" +
        "End Function\r\n" +
        "Function IEBinaryToArray_ByteStr_Last(Binary)\r\n" +
        "	Dim lastIndex\r\n" +
        "	lastIndex = LenB(Binary)\r\n" +
        "	if lastIndex mod 2 Then\r\n" +
        "		IEBinaryToArray_ByteStr_Last = Chr( AscB( MidB( Binary, lastIndex, 1 ) ) )\r\n" +
        "	Else\r\n" +
        "		IEBinaryToArray_ByteStr_Last = " + '""' + "\r\n" +
        "	End If\r\n" +
        "End Function\r\n" +
        "</script>\r\n";
document.write(IEBinaryToArray_ByteStr_Script);

function loadfile(filename, type) {

    http.open('get', filename);

    if (http.overrideMimeType)
        http.overrideMimeType('text/plain; charset=x-user-defined');
    else
        http.setRequestHeader('Accept-Charset', 'x-user-defined');

    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            if (typeof http.responseBody == 'undefined') {
                var response = http.responseText.split('').map(function (e) {
                    return String.fromCharCode(e.charCodeAt(0) & 0xff)
                }).join('');
            } else {
                var response = convertResponseBodyToText(http.responseBody);
            }

            WebPDecodeAndDraw(response);
        } //else alert('Cannot load file. Please, try again');
    };
    http.send(null);


}





