$("#barCodeForm").submit(function (e) {
    e.preventDefault();
});

//define constraints
var GTINValidIdentifiers = ["00", "01", "02"];

function readBarCode() {
    var newCode = $("#submitCodeForm").val();
    $("#submitCodeForm").val("");
    $("#errorDivParent").empty();

    //make sure to validate input before creating the String object
    const barCode = new String(newCode);


    //some more validation maybe?!
    splitBarCode(barCode);

}

function splitBarCode(barCode) {
    var GTINField = barCode.slice(0, 2);
    var GTINVal = barCode.slice(2, 16);

    var MHDfield = barCode.slice(16, 18);
    var MHDVal = barCode.slice(18, 24);

    var BatchField = barCode.slice(24, 26);
    var BatchVal = barCode.slice(26, 37);

    console.log("")
    console.log(GTINField + " " + GTINVal);
    console.log(MHDfield + " " + MHDVal);
    console.log(BatchField + " " + BatchVal);

    $("#scannedCodeSpan").html(barCode)
        .css('color','lime');
    $("#GTINField").html(GTINField)
        .css('color','black');
    $("#GTINVal").html(GTINVal)
        .css('color','black');

    $("#MHDfield").html(MHDfield)
        .css('color','black');
    $("#MHDVal").html(MHDVal)
        .css('color','black');

    $("#BatchField").html(BatchField)
        .css('color','black');
    $("#BatchVal").html(BatchVal)
        .css('color','black');

    //dont forget to validate the untouched string before
    validateGTIN(GTINField, GTINVal);
    validateMHD(MHDfield, MHDVal);
    validateBatch(BatchField, BatchVal);

}

function validateGTIN(GTINField, GTINVal) {
    //first validation, not efficient, but hey...
    if (GTINValidIdentifiers.includes(String(GTINField))) {

        if (GTINVal.length === 14) {
            //Get 13 first letters of GTIN-14
            var GTIN = GTINVal.slice(0,13);
            //Get 14 letter - the checksum
            var GTINChecksum = GTINVal.slice(13,14);
            //compare check digit with GTINChecksum
            if(String(eanCheckDigit(GTIN)) === GTINChecksum) {
            } else {
                $("#GTINVal").css('color', 'red');
                throwError("GTIN Checksum")
            }
        } else {
            $("#GTINVal").css('color', 'red');
            throwError("GTIN value mismatch")
        }
    } else {
        $("#GTINField").css('color', 'red');
        throwError("GTIN Identifier mismatch");
    }
}

function validateMHD(MHDfield, MHDVal) {
    //first validation, not efficient, but hey...
    if (MHDfield === "15") {
        if (MHDVal.length === 6) {
            return true;
        } else {
            $("#MHDVal").css('color', 'red');
            throwError("MHD value mismatch");
        }
    } else {
        $("#MHDfield").css('color', 'red');
        throwError("MHD Identifier mismatch");
    }
}

function validateBatch(BatchField, BatchVal) {
    //first validation, not efficient, but hey...
    if (BatchField === "10") {
        if ((BatchVal.length >= 1) && (BatchVal.length <= 20)) {
            return true;
        } else {

            $("#BatchVal").css('color', 'red');
            throwError("Batch value mismatch");
        }
    } else {
        $("#BatchField").css('color', 'red');
        throwError("Batch Identifier mismatch");
    }
}


function throwError(error) {
    $("#scannedCodeSpan").css('color','red');
    if (typeof error == 'undefined') {
        console.log("Unknown Error");
        $("#errorDivParent").append("<h5 class='errorChild'>Unknown Error</h5>")
    } else {
        console.log("Error: " + error);
        $("#errorDivParent").append("<h5 class='errorChild'>Error: "+ error+ "</h5>")
    }
}


function throwSuccess(success) {
    if (typeof success == 'undefined') {
        console.log("Unknown Success");
    } else {
        console.log("Success: " + success);
    }
}


// String reverse
String.prototype.reverse =
    function()
    {
        splitext = this.split("");
        revertext = splitext.reverse();
        reversed = revertext.join("");
        return reversed;
    }

// function to calculate EAN / UPC checkdigit
function eanCheckDigit(s)
{
    var result = 0;
    var rs = s.reverse();
    for (counter = 0; counter < rs.length; counter++)
    {
        result = result + parseInt(rs.charAt(counter)) * Math.pow(3, ((counter+1) % 2));
    }
    return (10 - (result % 10)) % 10;
}