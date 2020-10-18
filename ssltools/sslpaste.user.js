// ==UserScript==
// @name         SSL Copy
// @namespace    http://gunnyarts.com
// @version      1.0
// @description  I'm lazy. Paste all three SSL parts in one go - click button or press F2
// @author       Dennis Jensen
// @match        https://superadmin.shopfactory.io/?ssl&solution=*&domain=*
// @updateURL    http://gunnyarts.github.io/tb/ssltools/sslpaste.user.js
// @downloadURL  http://gunnyarts.github.io/tb/ssltools/sslpaste.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
	let container, el = document.createElement("a")
	el.setAttribute("href", "#")
		el.setAttribute("id", "pasteCert")
		el.setAttribute("style", "display: block;background: #333;color: #fff;padding: 10px 20px;max-width: 332px;text-align: center;margin-top: 5px;")
		el.textContent = "Paste Certificate Info"

	if (container = document.querySelector("form[action^='?ssl&action=swap-ssl']") ) {
	} else {
		container = document.querySelector("form[action^='?ssl&action=add-ssl'] > #input-ssl")
	}
	container.append(el)
	el.addEventListener("click", function(e){
		e.preventDefault()
		pasteSSL(container)
	})

	// F2 keyboard shortcut
	document.addEventListener('keyup', keypress)
	function keypress(e){
		if(e.which == 113) { //F2
			pasteSSL(container)
		}
	}


	function pasteSSL(container){
		getClipboard(function(str){
			try {
				let certInfo = JSON.parse(str)
				if(certInfo.private != undefined && certInfo.certificate != undefined && certInfo.intermediate != undefined){
					container.querySelector("textarea[name=sslKey]").textContent = certInfo.private
					container.querySelector("textarea[name=sslCert]").textContent = certInfo.certificate
					container.querySelector("textarea[name=sslCa]").textContent = certInfo.intermediate
				} else {
					el.textContent = "Missing cert data. Please re-copy cert and try again"
				}
			} catch(e) {
				console.log(e)
				el.textContent = "Could not paste cert. Please copy again and retry"
			}
		})
	}

	function getClipboard(callback){
		setTimeout(async () => {
		  const text = await navigator.clipboard.readText();
		  callback(text);
		}, 10);
	}




})();