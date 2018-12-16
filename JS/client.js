/* client.js
   Project 1 (ISTE 754)
   Created by Sankarsh Vittal
*/

var sel, val, div, para, paratxt, opt, txt, item, lastelem, radioInput;
var arr = new Array();
var local = false;

// Checks if localStorage is available and sets the local variable accordingly
  if( window.localStorage ){
    local= true;
  }

function createSel(dom) {

// Used to remove all the child from div
   removeAll('fdiv');
   removeAll('idiv');

    if ( typeof(dom) == 'string' ) {
        // Calls obj['init']
        var val = obj[dom];
        //For the first select drop-down
        var header = document.createElement('h1');
        var headertxt = document.createTextNode(val.header);
        header.setAttribute('id', 'head');
        header.appendChild(headertxt);
        var headin = document.createElement('hr');
        document.getElementsByTagName('body')[0].appendChild(header);
        document.getElementsByTagName('body')[0].appendChild(headin);
    } else {
        //Value assign for other drop-downs
        var val = obj[dom.value];
        //removes the image div when dropdown value changes
        if (document.getElementById('responseImg')) {
            document.getElementsByTagName('body')[0].removeChild(document.getElementById('imgDiv'));
        }
         if (document.getElementById('wrongImg')) {
            document.getElementsByTagName('body')[0].removeChild(document.getElementById('wrongDiv'));
        }

        //Used to remove all the siblings till it exists
        while (!(dom.nextSibling === null || dom.nextSibling === undefined)) {
            dom.parentNode.removeChild(dom.nextSibling);
        }
    }
    //Used to dynamically create all the dropdowns
    var level = parseInt(val.level);
    if (val.value.length !== 0) {
        var ldiv = document.getElementById('ldiv');
        para = document.createElement('p');
        //Picks question from data.js based on selected option
        paratxt = document.createTextNode(val.Question);
        para.appendChild(paratxt);
        ldiv.appendChild(para);
        sel = document.createElement('select');
        sel.setAttribute('name', dom.value);
        sel.setAttribute('id', 'styledSelect');
        opt = document.createElement('option');
        txt = document.createTextNode('select');
        opt.appendChild(txt);
        sel.appendChild(opt);
        for (item = 0, len = val.value.length; item < len; item++) {
            opt = document.createElement('option');
            opt.setAttribute('value', val.value[item]);
            txt = document.createTextNode(val.value[item]);
            opt.appendChild(txt);
            sel.appendChild(opt);
        }
        ldiv.appendChild(sel);
        ldiv.appendChild(document.createElement('br'));
        document.getElementsByTagName('body')[0].appendChild(ldiv);
        //This is used to store dom.value at a particular position in a array, which keeps track of the selected value
        arr[level] = dom.value;
    } else {
        //Calls function to generate form when the last node is reached
        arr[level] = dom.value;
        document.getElementById('fdiv').style.display = "block";//san
        generateForm(arr[arr.length - 1]);
    }
       //Calls createSel function with the selected object
        sel.setAttribute('onchange', 'createSel(this);');
}

//function to generate form based on the selected input
var newform, newform1;

function generateForm(lastelem) {

    newform = document.createElement('form');
    var formpara = document.createElement('p');
    var formparatxt = document.createTextNode("Yor sequence of seletion is as follows:");
    formpara.appendChild(formparatxt);
    newform.appendChild(formpara);
    formpara.appendChild(document.createElement('br'));
    // Displays all the selected options
    var order = document.createElement('ul');
    for (var i = 1, arrLen = arr.length; i < arrLen; i++) {
        var list = document.createElement('li');
        list.style.marginLeft = "20px";
        var txtNode = document.createTextNode(arr[i]);
        list.appendChild(txtNode);
        order.appendChild(list);
        newform.appendChild(list);
    }
    //Generates a quiz question based on the selected option
    var formpara1 = document.createElement('p');
    var formpara1txt = document.createTextNode("Guess the correct Destination ?   ");
    formpara1.appendChild(formpara1txt);
    newform.appendChild(formpara1);
    //Radio button options for the guess question
    if (radio_Obj[lastelem]) {
        for (var k = 0, lastElemLen = radio_Obj[lastelem].rad_val.length; k < lastElemLen; k++) {
            var lebel = document.createTextNode(radio_Obj[lastelem].rad_val[k]);
            radioInput = document.createElement('input');
            radioInput.setAttribute('type', 'radio');
            radioInput.setAttribute('name', 'qa_radio');
            radioInput.setAttribute('id', 'qa_radio');
            radioInput.setAttribute('value', radio_Obj[lastelem].rad_val[k]);
            newform.appendChild(radioInput);
            newform.appendChild(lebel);
            newform.appendChild(document.createElement('br'));
        }

    }

    //Button used to the check the answer
    newform.appendChild(document.createElement('br'));
    var sub = document.createElement('input');
    sub.setAttribute('type', 'button');
    sub.setAttribute('value', 'Check Your Guess');
    sub.setAttribute('onclick', 'ansCheck();');
    newform.appendChild(sub);
    document.getElementById('fdiv').appendChild(newform);
}

//Function to remove all child from form div
function removeAll(id) {
    var node = document.getElementById(id);
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
    document.getElementById('fdiv').style.display = "none";
    document.getElementById('idiv').style.display = "none";
}

// Function validates user's answer
var para, wrongAns, rightAns, radioVal, saveform, wrongDiv, imgDiv;
function ansCheck() {
    if(document.getElementById('pid')) {
        newform.removeChild(document.getElementById('pid'));
      if(document.getElementById('idiv').style.display === "block"){
         document.getElementById('idiv').removeChild(document.getElementById('form1'));
         document.getElementById('idiv').style.display = "none";
       }
    }
    if (document.getElementById('imgDiv')) {
     document.getElementsByTagName('body')[0].removeChild(document.getElementById('imgDiv'));
    }

    lastEle = arr[arr.length - 1];
    para = document.createElement('p');
    para.setAttribute('id', 'pid');
    wrongDiv = document.createElement('div');
    wrongDiv.setAttribute('id','wrongDiv');
       if (document.getElementById('wrongImg')) {
        document.getElementsByTagName('body')[0].removeChild(document.getElementById('wrongDiv'));
        }
    var radioCheck = getRadioCheckedValue('qa_radio');  //Function calls to find the selected answer option

    //In case of a radio option selection, checks for right or wrong answer
    if (!(radioCheck == null || radioCheck == undefined || radioCheck === '')) {
        radioVal = radioCheck;
        if (document.getElementById('saveform')) {
            document.getElementById('fdiv').removeChild(document.getElementById('saveform'));
        }

        //Message for wrong radio selection
        if (!(radioVal === radio_Obj[lastEle].corr_val)) {
            wrongAns = document.createTextNode("Ahh...its' a wrong answer...guess again");
            para.appendChild(wrongAns);
            newform.appendChild(para);
            wrongImg = document.createElement('img');
            wrongImg.style.width = "250px";
            wrongImg.style.height = "250px";
            wrongImg.setAttribute('src', '../Images/GIF/TryAgain1.gif');
            wrongImg.setAttribute('alt', 'Try Again');
            wrongImg.setAttribute('id', 'wrongImg');
            wrongDiv.appendChild(wrongImg);
            document.getElementsByTagName('body')[0].appendChild(wrongDiv);
        } else {
            //If correct radio option for the final destination  is correctly guessed, generates a form to save user input for future reference
            rightAns = document.createTextNode("Yeah it's a correct choice...!!!");
            para.appendChild(rightAns);
            newform.appendChild(para);
            saveform = document.createElement('form');
            saveform.setAttribute('id', 'saveform');
            var textLabel = document.createElement('label');
            var fname = document.createTextNode('First Name:');
            textLabel.appendChild(fname);
            saveform.appendChild(textLabel);
            var textbox = document.createElement('input');
            textbox.setAttribute('type', 'text');
            textbox.setAttribute('name', 'fname');
            textbox.setAttribute('id', 'fname');
            textbox.placeholder = "Type First name here..";
            saveform.appendChild(textbox);
            saveform.appendChild(document.createElement('br'));
            saveform.appendChild(document.createElement('br'));
            var textLabel1 = document.createElement('label');
            var lname = document.createTextNode('Last Name:');
            textLabel1.appendChild(lname);
            saveform.appendChild(textLabel1);
            var textbox1 = document.createElement('input');
            textbox1.setAttribute('type', 'text');
            textbox1.setAttribute('name', 'lname');
            textbox1.setAttribute('id', 'lname');
            textbox1.placeholder = "Type Last name here..";
            saveform.appendChild(textbox1);
            saveform.appendChild(document.createElement('br'));
            saveform.appendChild(document.createElement('br'));
            var sub = document.createElement('input');
            sub.setAttribute('type', 'button');
            sub.setAttribute('value', 'Save Your Response');
            sub.setAttribute('onclick', 'saveForm();');
            saveform.appendChild(sub);
            document.getElementById('fdiv').appendChild(saveform);

            // Creates a form displaying the selected correct destination's desciption
            newform1 = document.createElement('form');
            newform1.setAttribute('id', 'form1');
            var formpara = document.createElement('p');
            var formpara1 = document.createElement('h2');
            formpara.setAttribute('id', 'pid_2');
            var formparatxt = document.createTextNode(radio_Obj[lastEle].description);
            var formparatxt1 = document.createTextNode(radio_Obj[lastEle].corr_val);
            formpara.appendChild(formparatxt);
            formpara1.appendChild(formparatxt1);
            newform1.appendChild(formpara1);
            newform1.appendChild(formpara);
            formpara.appendChild(document.createElement('br'));
            imgDiv = document.createElement('div');
            imgDiv.setAttribute('id', 'imgDiv');
            var responseImg = document.createElement('img');
            responseImg.style.right = '-100px';
            responseImg.style.position = 'fixed';
            responseImg.style.width = "300px";
            responseImg.style.height = "400px";
            responseImg.setAttribute('src', '../Images/GIF/WellDone.gif');
            responseImg.setAttribute('id', 'responseImg');
            imgDiv.appendChild(responseImg);
            document.getElementsByTagName('body')[0].appendChild(imgDiv);
            document.getElementById('idiv').appendChild(newform1);
            document.getElementById('idiv').style.display = "block";
            slide(document.getElementById('responseImg'), 2);
        }
    } else {
        //Validation when answer selection is not done
        var lastText = document.createTextNode("Please select your answer....");
        para.appendChild(lastText);
        newform.appendChild(para);
    }
}

//Function saves user details(FirstName,LastName, and the final destination) in localstorage or cookies
var savePara, saveText, userName, existingUser, existingText, newDiv, newPara, newText, correctRes, imgDiv;
function saveForm() {
    correctRes = radioVal;
    if (!(document.getElementById('savePara_pid') === null)) {
        var item = document.getElementById('savePara_pid');
        item.parentNode.removeChild(item);
    }
    if (!(document.getElementById('existing_pid') === null)) {
        var item = document.getElementById('existing_pid');
        item.parentNode.removeChild(item);
    }
    if (!(document.getElementById('new_pid') === null)) {
        var item = document.getElementById('new_pid');
        item.parentNode.removeChild(item);
    }


    var firstName = document.getElementById('fname').value;
    var lastName = document.getElementById('lname').value;
    //Condition when both first name and last name exists
    if (!((firstName === "" || firstName === null) || (lastName === "" || lastName === null))) {

        userName = firstName.trim() + lastName.trim();

        var existingUser;
        newDiv = document.createElement('div');
        imgDiv = document.createElement('div');


        var responseImg = document.createElement('img');
        // checks if localstorage works
        if (local) {
            existingUser = localStorage.getItem(userName);
            newDiv = document.createElement('div');
            // if user is an existing user then function displays previously selected destination and saves the current destination
            if (!(existingUser === undefined || existingUser === null || existingUser === '')) {

                localStorage.setItem(userName, correctRes);
                existingPara = document.createElement('p');
                existingPara.setAttribute('id', 'existing_pid');
                existingText = document.createTextNode(firstName + " " + lastName + ", Your current response is saved successfully and ");
                existingPara.appendChild(existingText);
                existingText = document.createTextNode('Your previous choice was ' + existingUser);
                existingPara.appendChild(existingText);
                newDiv.appendChild(existingPara);
                saveform.appendChild(newDiv);
            } else {
                //if not the existing user then store the selected response
                localStorage.setItem(userName, correctRes);
                newPara = document.createElement('p');
                newPara.setAttribute('id', 'new_pid');
                newText = document.createTextNode(firstName + " " + lastName + ", Your current response is saved successfully..");
                newPara.appendChild(newText);
                newDiv.appendChild(newPara);
                saveform.appendChild(newDiv);
            }
        } else {
            //If localStorage dosent work, makes use of cookies
            existingUser = GetCookie(userName);
            if (!(existingUser === undefined || existingUser === null || existingUser === '')) {
                SetCookie(userName, correctRes);
                existingPara = document.createElement('p');
                existingPara.setAttribute('id', 'existing_pid');
                existingText = document.createTextNode(firstName + " " + lastName + ", Your current response is saved successfully and ");
                existingPara.appendChild(existingText);
                existingText = document.createTextNode('Your previous choice was ' + existingUser);
                existingPara.appendChild(existingText);
                newDiv.appendChild(existingPara);
                saveform.appendChild(newDiv);
            } else {
                SetCookie(userName, correctRes);
                newPara = document.createElement('p');
                newPara.setAttribute('id', 'new_pid');
                newText = document.createTextNode(firstName + " " + lastName + ", Your current response is saved successfully..");
                newPara.appendChild(newText);
                newDiv.appendChild(newPara);
                saveform.appendChild(newDiv);
            }
        }
    } else {
        //Save response form(first name and last name) validation
        savePara = document.createElement('p');
        savePara.setAttribute('id', 'savePara_pid');
        saveText = document.createTextNode("Both the first and last name are required.");
        savePara.appendChild(saveText);
        saveform.appendChild(savePara);
    }
}


//Function to get value from selected radio button
function getRadioCheckedValue(radio_name) {
    var objRadio = document.forms[0].elements[radio_name];

    for (var i = 0, objRadLen = objRadio.length; i < objRadLen; i++) {
        if (objRadio[i].checked) {
            return objRadio[i].value;
        }
    }

    return '';
}


//Function for get cookie
function GetCookie(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg) {
            return getCookieVal(j);
        }
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) break;
    }
    return null;
}

//Function for set cookie
function SetCookie(name, value, expires, path, domain, secure) {
    document.cookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires.toGMTString() : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
}

//Function to get value of the current cookie
function getCookieVal(offset) {
  var endstr = document.cookie.indexOf (";", offset);
  if (endstr == -1) { endstr = document.cookie.length; }
return unescape(document.cookie.substring(offset, endstr));
}

//Function to slide the 'well done' status
function slide(id, speed) {
    var hold = id;
    if (parseInt(hold.style.right) < 200) {
        hold.style.right = parseInt(hold.style.right) + speed + 'px';
        setTimeout(function() {
            slide(id, speed);
        }, 5);
    }
}
