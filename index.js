const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[Password-length-val]");
const passwordDisplay = document.querySelector(".password-display");
const copyBtn = document.querySelector(".copy-btn");
const copyMsg = document.querySelector(".copy-message");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector("#generate_button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let passwordLength = 10;
let password = "";
let checkCount = 0;


function slider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}
slider();


inputSlider.addEventListener("input", (event) => {
    passwordLength = event.target.value;
    slider();
});

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber() {
    return getRandom(0, 10);
}

function getRandomLowerCase() {
    return String.fromCharCode(getRandom(97, 123)); 
}

function getRandomUpperCase() {
    return String.fromCharCode(getRandom(65, 91)); 
}

function getRandomSymbol() {
    let randNum = getRandom(0, symbols.length);
    return symbols.charAt(randNum);
}


function calcStrength() {
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNum = numbersCheck.checked;
    let hasSym = symbolsCheck.checked;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0"); 
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0"); 
    } else {
        setIndicator("#f00"); 
    }
}


async function copy() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied!";
        copyMsg.classList.add("active");
    } catch (e) {
        copyMsg.innerText = "Failed!";
        copyMsg.classList.add("active");
    }

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}


function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
}


function handleCheckBox() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        slider();
    }
}


allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBox);
});


copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value !== "PASSWORD") {
        copy();
    }
});


generateBtn.addEventListener("click", () => {
    if (checkCount === 0) return;

    password = "";

    let funcArr = [];

    if (uppercaseCheck.checked) funcArr.push(getRandomUpperCase);
    if (lowercaseCheck.checked) funcArr.push(getRandomLowerCase);
    if (numbersCheck.checked) funcArr.push(getRandomNumber);
    if (symbolsCheck.checked) funcArr.push(getRandomSymbol);

    
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRandom(0, funcArr.length);
        password += funcArr[randIndex]();
    }

  
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
});
