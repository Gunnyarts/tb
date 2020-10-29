// ==UserScript==
// @name         Solutions Ticket Order
// @namespace    http://gunnyarts.com
// @version      1.0
// @description  Reorder ticket inboxes
// @author       Dennis Jensen
// @match        https://solutions.zitcom.dk/intercom/department/webshop/
// @updateURL    http://gunnyarts.github.io/tb/solutions/ticketorder.user.js
// @downloadURL  http://gunnyarts.github.io/tb/solutions/ticketorder.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
	/*
	.card
	add number to .card-header
	check amount of TDs in .card-body
	*/
	let interval = window.setInterval(function(){
		update()
	},100)

	function update(){
		let card = document.querySelectorAll(".card")
		for (let i=0;i<card.length;i++){
			if (card[i].querySelector(".card-header.bg-azure-lighter")){
				card[i].classList.add("current-user")
			}
			let title = card[i].querySelector(".card-title")
			if (title.textContent.includes("Retention")){
				card[i].classList.add("retention")
			} else if (title.textContent.includes("Migration")){
				card[i].classList.add("migration")
			} else if (title.textContent.includes("Bestillinger")){
				card[i].classList.add("bestillinger")
			}
		}
	}

	let styleEl = document.createElement("style")
	styleEl.innerHTML = "div#members{display:flex;flex-flow:column}div#members>.card{order:10}div#members>.card.current-user{order:1}div#members>.card.bestillinger{order:2}div#members>.card.migration{order:3}div#members>.card.retention{order:4}"
	document.body.appendChild(styleEl)

})();