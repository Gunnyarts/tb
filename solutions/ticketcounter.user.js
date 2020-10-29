// ==UserScript==
// @name         Solutions Ticket Counter
// @namespace    http://gunnyarts.com
// @version      1.0
// @description  Count tickets in inboxes
// @author       Dennis Jensen
// @match        https://solutions.zitcom.dk/intercom/department/webshop/
// @updateURL    http://gunnyarts.github.io/tb/solutions/ticketcounter.user.js
// @downloadURL  http://gunnyarts.github.io/tb/solutions/ticketcounter.user.js
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
			let amount = card[i].querySelectorAll('tbody > tr').length
			let title = card[i].querySelector(".card-title")
			let amountEl = document.createElement('span')
			amountEl.setAttribute('class', 'amount')
			amountEl.textContent = "( " + amount + " )"
			if (title.querySelector(".amount")){
				title.querySelector(".amount").textContent = "( "+amount+" )"
			} else {
				card[i].querySelector(".card-title").append(amountEl)
			}
		}
	}

	let styleEl = document.createElement("style")
	styleEl.innerHTML = ".card h4 {display:inline-block}"
	document.body.appendChild(styleEl)

})();