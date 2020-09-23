// ==UserScript==
// @name         IntraLinks
// @version      0.1
// @description  Convenient links in the left side menu
// @author       Dennis Jensen
// @match        https://intranet.zitcom.dk/*
// @grant        none
// ==/UserScript==

(function() {
	function injectMenu () {
		let data = this.response
		let filter = [1, 13, 18, 22]
		let imgBaseURL = "https://supportmon.zitcom.dk/ws/"


		let quickBar = document.createElement('li'),
			quickUl = document.createElement("ul"),
			menuUl = document.querySelector(".content-container > .menu > ul")
		for ( let link of data){
			if (link.display_intranet == 1){
				let li = document.createElement("li"),
					a = document.createElement("a"),
					img = document.createElement('img')
				img.setAttribute('src', imgBaseURL + link.image_small)
				a.setAttribute("href", link.url)
				a.setAttribute("target", "_blank")
				a.setAttribute("title", link.title)
				a.appendChild(img)
				if (link.url == "postkasse"){
					a.addEventListener('click', pkModal)
				} else if (link.url == "quickwins"){
					a.addEventListener('click', qwModal)
				}
				li.appendChild(a)
				quickUl.appendChild(li)
			}
		}
		quickBar.appendChild(quickUl)
		quickBar.id = "quickBar"
		menuUl.appendChild(quickBar)

		function pkModal(e){
			e.preventDefault()
			let formContainer = document.querySelector('#pkFormContainer')
			if (formContainer == null) {
				let formContainer = document.createElement("div")
				formContainer.id = "pkFormContainer"
				formContainer.setAttribute('class', "ilFormContainer")
				let form =
	`
	<form id="pkForm" class="ilForm"  action method="post">
		<h3>Opret punkt i postkassen</h3>
		<input type="hidden" name="is_js" value="1">
		<input type="hidden" name="postkasse_team" value="2">
		<textarea name="postkasse_entry"></textarea>
		<input type="submit" value="Indsend">
		<div class="ilAlert" id="pkAlert"></div>
	</form>
	`
				formContainer.innerHTML = form
				formContainer.addEventListener("submit", pkFormSubmit)
				document.querySelector(".layout-flex > .toolbar").appendChild(formContainer)
			} else {
				formContainer.parentNode.removeChild(formContainer)
			}
		}

		function qwModal(e){
			e.preventDefault()
			let formContainer = document.querySelector('#qwFormContainer')
			if (formContainer == null) {
				let formContainer = document.createElement("div")
				formContainer.id = "qwFormContainer"
				formContainer.setAttribute('class', "ilFormContainer")
				let form =
	`
	<form id="qwForm" class="ilForm" action="" method="post">
		<h3>Opret QuickWin</h3>
		<input type="hidden" name="is_js" value="1">
		<input type="hidden" name="quickwin_team" value="2">
		<textarea name="quickwin_entry"></textarea>
		<input type="submit" value="Indsend">
		<div class="ilAlert" id="qwAlert"></div>
	</form>
	`
				formContainer.innerHTML = form
				formContainer.addEventListener("submit", qwFormSubmit)
				document.querySelector(".layout-flex > .toolbar").appendChild(formContainer)
			} else {
				formContainer.parentNode.removeChild(formContainer)
			}
		}


		function pkFormSubmit(e){
			e.preventDefault()
			let formData = new FormData(e.target)
			var req = new XMLHttpRequest()
			req.addEventListener("load", function(data){
				let msg = ""
				if(data.target.responseText == "true"){
					msg = "Punkt oprettet. Klik ikonet for postkassen igen for at lukke dette vindue."
				} else {
					msg =  data.target.responseText
				}
				let el = e.target.querySelector("#pkAlert")
				el.innerText = msg
			})
			req.open("POST", "https://supportmon.zitcom.dk/pkassets/submit.php")
			req.send(formData)
		}

		function qwFormSubmit(e){
			e.preventDefault()
			let formData = new FormData(e.target)
			var req = new XMLHttpRequest()
			req.addEventListener("load", function(data){
				let msg = ""
				console.log(data.target.responseText)
				if(data.target.responseText == "true"){
					msg = "QuickWin oprettet. Klik ikonet for QuickWin igen for at lukke dette vindue."
				} else {
					msg =  data.target.responseText
				}
				let el = e.target.querySelector("#qwAlert")
				el.innerText = msg
			})
			req.open("POST", "https://supportmon.zitcom.dk/qwassets/submit.php")
			req.send(formData)
		}

		let style = document.createElement("style")
		style.setAttribute('rel', "stylesheet")
		style.innerHTML = ""
		document.body.appendChild(style)

	}


	var req = new XMLHttpRequest()
	req.addEventListener("load", injectMenu)
	req.responseType = "json"
	req.open("GET", "https://supportmon.zitcom.dk/ws/app/dbfunctions.php?fn=get_nav")
	req.send()

  var style_content = `
  #quickBar {position:relative}
  #quickBar > ul {display: flex; padding: 5px; flex-flow:row wrap;}
  #quickBar > ul > li {display: flex; flex: 1 25%;}

  #quickBar li a {
    background-color: transparent;
    display: block;
    padding: 10px;
    border-radius: 5px;
  }
  #quickBar li a:hover {background-color: #000}

  #quickBar li a > img {
    max-width: 100%;
    height:auto;
  }


  .layout-flex .toolbar {position:relative;}
  .ilFormContainer {
    position:absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 100%);
    background-color: rgba(0,0,0,0.5);
    padding: 15px;
    width: 100%;
    max-width: 600px;
    text-align: center;
  }
  .ilForm {
    display: block;
  }
.ilForm > h3 {
    color: #fff;
    margin: 0 0 5px;
  }
  .ilForm textarea {
    display: block;
    width: 100%;
    min-height: 100px;
    padding: 15px;
    backgorund: #fff;
    color: #111;
  }
  .ilForm > input[type=submit] {
    margin-top: 15px;
    width: 100%;
    display: block;
    color: #000;
    line-height: 1em;
    font-size: 14px;
    padding: 1em;
    border-radius: 0;
  }
  .ilForm > input[type=submit]:focus {
    background: #eee;
    color: #000;
    outline: 0;
  }
  .ilAlert:not(:empty) {
    color: #fff;
    margin: 15px 0 0;
  }
  `
  let style = document.createElement("style")
  style.textContent = style_content
  document.body.appendChild(style)

})();