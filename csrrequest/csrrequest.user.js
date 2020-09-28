// ==UserScript==
// @name         SSL CSR Request
// @namespace    http://gunnyarts.com
// @version      1.0
// @description  I'm lazy. Insert domain and CSR is generated
// @author       Dennis Jensen
// @match        https://netadmin.zitcom.dk/ssl/create/
// @updateURL    http://gunnyarts.github.io/tb/csrrequest/csrrequest.user.js
// @downloadURL  http://gunnyarts.github.io/tb/csrrequest/csrrequest.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

  let domain = prompt("What is the domain?");
	document.getElementById('ssl_form_commonName').value = domain;
	document.getElementById('ssl_form_organisationName').value = domain;
	document.getElementById('ssl_form_state').value = "DK";
	document.getElementById('ssl_form_localityName').value = "DK";
	document.querySelector("form[name=ssl_form").submit();
})();