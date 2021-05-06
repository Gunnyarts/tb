// ==UserScript==
// @name         Intralogger for SH
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Log calls from the intranet!
// @author       Dennis Jensen
// @match        https://intranet.zitcom.dk/*
// @updateURL    http://gunnyarts.github.io/tb/intranet/intralogger.sh.user.js
// @downloadURL  http://gunnyarts.github.io/tb/intranet/intralogger.sh.user.js
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    // Config
    const kaldreg_link = "https://supportmon.zitcom.dk/shkald/"
    const category_link = kaldreg_link + "include/get_categories.php"
    const submit_link = kaldreg_link + "include/get_response.php"

    // createContainer
    let menu = document.querySelector('.content-container > .menu')
    let container = document.createElement("div")
    container.id = "logFormContainer"
    menu.appendChild(container)
    let headline = document.createElement("h3")
    headline.textContent = "Kaldregistrering"
    container.appendChild(headline)

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", generateForm);
    oReq.open("GET", category_link);
    oReq.send();

    function generateForm(){
        // parse JSON from Supportmon
        let categorypairs = JSON.parse(oReq.responseText)
        let categoryarray = []
        categorypairs.forEach(function(x){categoryarray.push(x.category)})

        //create the form
        var loggingform = document.createElement("form");
        loggingform.setAttribute("action", "");
        loggingform.id = "kaldreg_form";
        loggingform.setAttribute("method", "post");
        loggingform.setAttribute("name", "kaldreg_form");
        loggingform.setAttribute("target", "hiddenFrame");

        let inputSolution = document.createElement("input")
        inputSolution.setAttribute("type", "text")
        inputSolution.className="form-control"
        inputSolution.id = "resellerId"
        inputSolution.setAttribute("name", "resellerId")
        inputSolution.setAttribute("placeholder", "ID (Skriv 0 hvis intet ID)")
        inputSolution.setAttribute("required", "required")

        let inputCategory = document.createElement("input")
        inputCategory.setAttribute("type", "text")
        inputCategory.className="form-control"
        inputCategory.id = "user_comment"
        inputCategory.setAttribute("name", "user_comment")
        inputCategory.setAttribute("list", "comment_choice")
        inputCategory.setAttribute("placeholder", "Kategori")
        inputCategory.setAttribute("required", "required")

        let inputDatalist = document.createElement("datalist")
        inputDatalist.id = "comment_choice"
        categoryarray.forEach(function(x){
            let option = document.createElement("option")
            option.value = x
            inputDatalist.appendChild(option)
        })
        let inputComment = document.createElement("input")
        inputComment.setAttribute("type", "text")
        inputComment.className="form-control"
        inputComment.id = "user_comment2"
        inputComment.setAttribute("name", "user_comment2")
        inputComment.setAttribute("placeholder", "Evt. kommentar")
        inputComment.style.display = "none"

        let inputCredentials = document.createElement("input")
        inputCredentials.setAttribute("type", "hidden")
        inputCredentials.id = "user_cred"
        inputCredentials.setAttribute("name", "user_cred")
        inputCredentials.value = currentUsername.toUpperCase()

        let inputSubmit = document.createElement("input")
        inputSubmit.setAttribute("type", "submit")
        inputSubmit.id = "kaldreg_submit"
        inputSubmit.value = "Registrer kald"
        inputSubmit.className = "form-control"

        loggingform.appendChild(inputSolution)
        loggingform.appendChild(inputCategory)
        loggingform.appendChild(inputDatalist)
        loggingform.appendChild(inputComment)
        loggingform.appendChild(inputCredentials)
        loggingform.appendChild(inputSubmit)

        inputCategory.addEventListener("keyup", function(){
            let val = this.value
            let input = document.getElementById("user_comment2")
            let a = categorypairs.filter(function(x){return x.category == val})
            if(a.length == 1 && a[0].needscomment == "true") {
                input.setAttribute("required", "required")
                input.style.display = "block"
            } else {
                input.value = ""
                input.removeAttribute("required")
                input.style.display = "none"
            }
        })

        loggingform.addEventListener("submit", function(e){
            e.preventDefault()
            let vals = []
            for (let [key, value] of new FormData(this)) {if (key == "user_comment" && !categoryarray.includes(value)){alert("Vælg en kategori fra listen.", 1000); return false} vals.push(key+"="+value) }
            let data = vals.join("&")
            data += "&js=true"
            var xhr = new XMLHttpRequest()
            xhr.open("POST", submit_link, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.responseType = "text"
            xhr.onload = function () {
                if (xhr.readyState === xhr.DONE) {
                    if (xhr.status === 200) {
                        if (xhr.responseText == ""){
                            logSubmitted("Kald registreret!", 750)
                        } else {
                            console.log(xhr.responseText)
                            logSubmitted(xhr.responseText, 2000)
                        }
                    } else {
                        logSubmitted("Der skete en fejl. Prøv igen eller kontakt support.", 2000)
                    }
                }
            };

            xhr.send(data);

        })

        let kaldregLink = document.createElement("a")
        kaldregLink.id = "kaldreg_link"
        kaldregLink.href = kaldreg_link
        kaldregLink.setAttribute("target", "_blank")
        kaldregLink.textContent = "Se den fulde kaldregistrering"

        loggingform.appendChild(kaldregLink)
        container.appendChild(loggingform);
    }

    function logSubmitted(message, timeout){
        container.innerHTML = "<p>"+message+"</p>"
        setTimeout(function(){
            container.innerHTML = ""
            generateForm()
        }, timeout)
    }
    function alert(message, timeout){
        let p = document.createElement("p")
        p.id = "kaldreg_alert"
        p.textContent = message
        container.appendChild(p)
        setTimeout(function(){
            container.removeChild(p)
        }, timeout)
    }

    let style = document.createElement("style")
    style.innerHTML = "#kaldreg_alert  #kaldreg_form > input[type=submit] {margin-top:5px;} #logFormContainer {padding: 5px; text-align: center} #logFormContainer > h3 {font-size: 1.2em} #kaldreg_form > a {color:#ccc;display:inline-block;margin-top:3px;font-size:0.8em}"
    document.body.appendChild(style)

})();
