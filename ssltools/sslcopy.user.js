// ==UserScript==
// @name         SSL Copy
// @namespace    http://gunnyarts.com
// @version      1.0
// @description  I'm lazy. Copy all three SSL parts in one go - click button or press F2
// @author       Dennis Jensen
// @match        https://netadmin.zitcom.dk/ssl/*
// @updateURL    http://gunnyarts.github.io/tb/ssltools/sslcopy.user.js
// @downloadURL  http://gunnyarts.github.io/tb/ssltools/sslcopy.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

	let buttonRow = document.querySelector("span.ssl-cert > .row > .col")

	let button = document.createElement("a")
	button.setAttribute("href", "#")
	button.id = "copyCert"
	button.textContent = "Copy Cert"
	button.setAttribute("class", "btn btn-xs btn-info passwordButton")
	button.addEventListener("click", function(e){
		e.preventDefault()
		copyCert()

	})
	buttonRow.appendChild(button)

  function copyCert(){
    let certInfo = {}
    let certInfoHeaders = document.querySelectorAll("#replaceCert + .row > div:nth-of-type(2) > h5")
    for(let i=0;i<certInfoHeaders.length;i++){
      let h5 = certInfoHeaders[i]
      if (h5.textContent == "Private Key"){
        certInfo.private = h5.nextElementSibling.textContent
      }
      if (h5.textContent == "Certificate"){
        certInfo.certificate = h5.nextElementSibling.textContent
      }
      if (h5.textContent == "Intermediate Certificate(s)"){
        certInfo.intermediate = h5.nextElementSibling.textContent
      }
    }
    copy(JSON.stringify(certInfo))
  }

	function copy(str){
	  const el = document.createElement('textarea');
	  el.value = str;
	  el.setAttribute('readonly', '');
	  el.style.position = 'absolute';
	  el.style.left = '-9999px';
	  document.body.appendChild(el);
	  el.select();
	  document.execCommand('copy');
	  document.body.removeChild(el);
    notify("SSL info copied")
	}

  // F2 keyboard shortcut
  document.addEventListener('keyup', keypress)
  function keypress(e){
      if(e.which == 113) { //F2
          copyCert()
      }
  }

  function notify(str){
    let msg = document.createElement("div")
    msg.setAttribute("style", "position:absolute;top:20px;left:50%;transform:translateX(-50%);z-index:9999;padding:20px 40px;background-color:rgba(0,0,0,.7);color:#fff;border-radius:0")
    msg.textContent = str
    document.body.appendChild(msg)
    setTimeout(function(){
      document.body.removeChild(msg)
    }, 1000)
  }
