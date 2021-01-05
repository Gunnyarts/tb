// ==UserScript==
// @name         Solutions LinkFix
// @namespace    http://gunnyarts.com
// @version      1.0
// @description  Fixes missing links so all messages are clickable
// @author       Dennis Jensen
// @match        https://solutions.zitcom.dk/intercom/department/webshop/
// @updateURL    http://gunnyarts.github.io/tb/solutions/ticketlinkfix.user.js
// @downloadURL  http://gunnyarts.github.io/tb/solutions/ticketlinkfix.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let interval = window.setInterval(function(){
		let links = document.querySelectorAll("td > a:empty")
		for (let i=0;i<links.length;i++){
			links[i].textContent = "No Subject (Chat)"
		}
	}, 100)
})();