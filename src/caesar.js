let fs = require('fs');
let arg = process.argv;

function isInteger(num) {
    return (num ^ 0) == num;
}

function read(inFile) {
    try {
        inText = fs.readFileSync(inFile, "utf-8");
        return inText;
    }
    catch (e) {
        console.log("You file doesn't exist");
        return undefined;
    }
}

class Cipher {
    constructor(message, alphabit) {
        this.message = message;
        this.alphabit = alphabit;
    }

    get message() {
        return this._message;
    }

    set message(value) {
        this._message = value.toLowerCase();
    }

    get alphabit() {
        return this._alphabit;
    }

    set alphabit(value) {
        if (value == "en" || value == "ru")
            this._alphabit = value;
        else
            console.log("You can choose en or ru alphabit only.");
    }

    get enIdealArrayOfFrequency() {
        if (this._enIdealArrayOfFrequency == undefined)
            this._enIdealArrayOfFrequency = [
                0.0796, 0.016, 0.0284, 0.0401, 0.1286, 0.0262, 0.0199,
                0.0539, 0.0777, 0.0016, 0.0041, 0.0351, 0.0243, 0.0751,
                0.0662, 0.0181, 0.0017, 0.0683, 0.0662, 0.0972, 0.0248,
                0.0115, 0.0180, 0.0017, 0.0152, 0.0005
            ];
        return this._enIdealArrayOfFrequency;
    }

    get ruIdealArrayOfFrequency() {
        if (this._ruIdealArrayOfFrequency == undefined)
            this._ruIdealArrayOfFrequency = [
                0.0801, 0.0159, 0.0454, 0.017, 0.0298, 0.0845, 0.0094, 0.0165,
                0.0735, 0.0121, 0.0349, 0.044, 0.0321, 0.067, 0.01097, 0.0281,
                0.0473, 0.0547, 0.0626, 0.0262, 0.0026, 0.0097, 0.0048, 0.0144,
                0.0073, 0.0036, 0.0004, 0.019, 0.0174, 0.0032, 0.0064, 0.0201
            ];
        return this._ruIdealArrayOfFrequency;
    }

    makeArrayOfFrequency(inText, mode) {
        let len = inText.length;
        let lettersCount;
        let firstLetterCode;
        if (mode == "en") {
            lettersCount = 26;
            firstLetterCode = 97;
        }
        else {
            lettersCount = 32;
            firstLetterCode = 1072;
        }
        let arrayOfFrequency = new Array(lettersCount);
        for (let i = 0; i < lettersCount; i++) {
            arrayOfFrequency[i] = 0;
        }
        let symbolsCount = 0;
        for (let i = 0; i < len; i++) {
            if (arrayOfFrequency[inText.charCodeAt(i) - firstLetterCode] != undefined) {
                arrayOfFrequency[inText.charCodeAt(i) - firstLetterCode]++;
                symbolsCount++;
            }
        }
        
        for (let i = 0; i < lettersCount; i++) {
            arrayOfFrequency[i] = arrayOfFrequency[i] / symbolsCount;
        }

        return arrayOfFrequency;
    }

    get codedMessage() {
        if (this._codedMessage == undefined)
            this._codedMessage = this.code(this.message);
        return this._codedMessage;
    }

    get decodedMessage() {
        if (this._decodedMessage == undefined)
            this._decodedMessage = this.decode(this.message);
        return this._decodedMessage;
    }

    checkAllPropertiesDefined() {
        return (this.message != undefined && this.alphabit != undefined);
    }

    code(mes) {
        return undefined;
    }

    decode(mes) {
        return undefined;
    }
}

class Caesar extends Cipher {
    constructor(message, alphabit, shift = 0) {
        super(message, alphabit);
        this.shift = shift;
    }

    get shift() {
        return this._shift;
    }

    set shift(value) {
        value = Number(value);
        if (isInteger(value)) {
            if (value >= 0)
                this._shift = value;
            else if (this.alphabit == "en")
                this._shift = 26 + value % 26;
            else
                this._shift = 32 + value % 32;
        }
        else
            console.log("Shift must be an integer");
    }

    code(mes) {
        let len = mes.length;
        let res = "";
        let lettersCount;
        let firstLetterCode;
        if (this.alphabit == "en") {
            lettersCount = 26;
            firstLetterCode = 97;
        }
        else {
            lettersCount = 32;
            firstLetterCode = 1072;
        }
        for (let i = 0; i < len; i++) {
            if (mes.charCodeAt(i) >= firstLetterCode
                && mes.charCodeAt(i) <= firstLetterCode + lettersCount - 1)
                res += String.fromCharCode(firstLetterCode
                    + (mes.charCodeAt(i) + this.shift - firstLetterCode) % lettersCount);
            else
                res += mes.charAt(i);
        }
        return res;
    }

    decode(mes) {
        let idealArrayOfFrequency;
        let arrayOfFrequency = this.makeArrayOfFrequency(mes, this.alphabit);
        let sum = 0;
        let minSum = -1;
        let shift = -1;
        let lettersCount;
        let firstLetterCode;
        if (this.alphabit == "en") {
            lettersCount = 26;
            firstLetterCode = 97;
            idealArrayOfFrequency = this.enIdealArrayOfFrequency;
        }
        else {
            lettersCount = 32;
            firstLetterCode = 1072;
            idealArrayOfFrequency = this.ruIdealArrayOfFrequency;
        }
        for (let k = 0; k < lettersCount; k++) {
            for (let i = 0; i < lettersCount; i++) {
                sum += (idealArrayOfFrequency[i] - arrayOfFrequency[(i + k) % lettersCount]) *
                    (idealArrayOfFrequency[i] - arrayOfFrequency[(i + k) % lettersCount]);
            }
            if (sum < minSum || minSum == -1) {
                minSum = sum;
                shift = k;
            }
            sum = 0;
        }
        let len = mes.length;

        let res = "";
        for (let i = 0; i < len; i++) {
            if (mes.charCodeAt(i) >= firstLetterCode
                && mes.charCodeAt(i) <= firstLetterCode + lettersCount - 1)
                res += String.fromCharCode(firstLetterCode +
                    (mes.charCodeAt(i) + lettersCount - shift - firstLetterCode) % lettersCount);
            else
                res += mes.charAt(i);
        }
        this.shift = shift;
        return res;
    }
}

class Vigenere extends Cipher {
    constructor(message, alphabit, keyWord) {
        super(message, alphabit);
        this.keyWord = keyWord;
    }

    get keyWord() {
        return this._keyWord;
    }

    set keyWord(value) {
        if (value == "")
            console.log("You keyWord is empty");
        else
            this._keyWord = value;
    }

    code(mes) {
        let len = mes.length;
        let res = "";
        let lettersCount;
        let firstLetterCode;
        if (this.alphabit == "en") {
            lettersCount = 26;
            firstLetterCode = 97;
        }
        else {
            lettersCount = 32;
            firstLetterCode = 1072;
        }
        for (let i = 0; i < len; i++) {
            if (mes.charCodeAt(i) >= firstLetterCode
                && mes.charCodeAt(i) <= firstLetterCode + lettersCount - 1) {
                res += String.fromCharCode((mes.charCodeAt(i) - firstLetterCode
                    + (this.keyWord.charCodeAt(i % this.keyWord.length) - firstLetterCode) % lettersCount + lettersCount)
                    % lettersCount + firstLetterCode);
            }
            else
                res += mes.charAt(i);
        }
        return res;
    }

    decode(mes) {
        let idealArrayOfFrequency;
        let firstLetterCode;
        if (this.alphabit == "en") {
            idealArrayOfFrequency = this.enIdealArrayOfFrequency;
            firstLetterCode = 97;
        }
        else {
            idealArrayOfFrequency = this.ruIdealArrayOfFrequency;
            firstLetterCode = 1072;
        }  
        let idealIndex = 0;
        let idLen = idealArrayOfFrequency.length;
        for (let i = 0; i < idLen; i++) {
            idealIndex += idealArrayOfFrequency[i] * idealArrayOfFrequency[i];
        }
        let len = mes.length;
        let keyLength = 0;
        for (let keyLen = 0; keyLen < len; keyLen++) {
            let processedMes;
            if (keyLen == 0)
                processedMes = mes;
            else
                processedMes = this.makeMesDependOnKeyWordLength(mes, keyLen);
            let matchIndex = this.makeMatchIndex(processedMes);
            if (Math.abs(idealIndex - matchIndex) < 0.01 && this.alphabit == "en"
                || this.alphabit == "ru" && (idealIndex - matchIndex < 0 && idealIndex - matchIndex > -0.015
                || idealIndex - matchIndex > 0 && idealIndex - matchIndex < 0.003)) {
                keyLength = keyLen;
                break;
            }
        }
        let keyWordToPrint = "";
        let resArray = new Array(len);
        for (let pos = 0; pos < keyLength; pos++) {
            let processedMes = this.makeMesDependOnKeyWordLength(mes.substring(pos), keyLength);
            let caesar = new Caesar(processedMes, this.alphabit);
            let decLen = caesar.decodedMessage.length;
            let keyLetter = String.fromCharCode(caesar.shift + firstLetterCode);
            keyWordToPrint += keyLetter;
            let j = pos;
            for (let i = 0; i < decLen; i++) {
                resArray[j] = caesar.decodedMessage.charAt(i);
                j += keyLength;
            }
        }
        let res = "";
        for (let i = 0; i < len; i++) {
            res += resArray[i];
        }
        console.log(`The keyword was: ${keyWordToPrint}`);
        return res;
    }

    makeMatchIndex(mes) {
        let arrayOfFrequency = this.makeArrayOfFrequency(mes, this.alphabit);
        let len = arrayOfFrequency.length;
        let sum = 0;
        for (let i = 0; i < len; i++) {
            sum += arrayOfFrequency[i] * arrayOfFrequency[i];
        }
        return sum;
    }

    makeMesDependOnKeyWordLength(mes, keyLen) {
        let len = mes.length;
        let resMes = "";
        for (let i = 0; i < len; i += keyLen) {
            resMes += mes.charAt(i);
        }
        return resMes;
    }
}

let caesar;
let vigenere;
let mes = read(arg[3]);
if (mes != undefined) {
    if (arg[2] == "code") {
        if (arg[7] == "vigenere") {
            vigenere = new Vigenere(mes, arg[6], arg[5]);
            if (vigenere.checkAllPropertiesDefined())
                fs.writeFileSync(arg[4], vigenere.codedMessage);
        }
        else if (arg[7] == undefined) {
            caesar = new Caesar(mes, arg[6], arg[5]);
            if (caesar.checkAllPropertiesDefined())
                fs.writeFileSync(arg[4], caesar.codedMessage);
        }
        else
            console.log(`You should write vigenere not ${arg[7]}`);
    }
    else if (arg[2] == "decode") {
        if (arg[6] == "vigenere") {
            vigenere = new Vigenere(mes, arg[5]);
            if (vigenere.checkAllPropertiesDefined())
                fs.writeFileSync(arg[4], vigenere.decodedMessage);
        }
        else if (arg[6] == undefined) {
            caesar = new Caesar(mes, arg[5]);
            if (caesar.checkAllPropertiesDefined()) {
                fs.writeFileSync(arg[4], caesar.decodedMessage);
                console.log(`The shift was ${caesar.shift}`);
            }  
        }
        else
            console.log(`You should write vigenere not ${arg[6]}`);
    }
    else
        console.log("You should choose code or decode mode");
}