// ==UserScript==
// @name         WS8 SliderLinks
// @namespace    https://gunnyarts.github.io/tb/
// @version      1.0
// @description  Generate a list with downloadable links to all slider images in WS8
// @author       Dennis Jensen
// @match        */admin/modules/Slider/Slider.aspx
// @icon         https://www.google.com/s2/favicons?domain=webshop8.dk
// @grant        none
// @updateURL    https://gunnyarts.github.io/tb/migration/sliderlinks.user.js
// @downloadURL  https://gunnyarts.github.io/tb/migration/sliderlinks.user.js
// ==/UserScript==

(function() {
    function generateLinks(){
        let tds = document.querySelectorAll(".imageselector > div > div > table > tbody > tr > td:first-child");
        let links = [];
        let domain = location.origin;
        let imageContent = document.querySelector("#pnlImages_content");
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        let ul = document.createElement("ul");
        for(let i=0;i<tds.length;i++){
            let li = document.createElement("li");
            let a = document.createElement("a");
            let value = tds[i].querySelector("input").value;
            let imgTitle = value.split("/");
            imgTitle = imgTitle[imgTitle.length - 1];
            a.textContent = imgTitle;
            a.setAttribute("download", imgTitle);
            a.setAttribute("href", domain + value);
            li.appendChild(a);
            ul.appendChild(li);
        }
        td.appendChild(ul);
        tr.appendChild(td);
        imageContent.parentNode.insertBefore(tr, imageContent);
    }
    let menuUl = document.getElementById("menu")
    let firstMenuItem = menu.querySelector("li:first-child")
    let newMenuLi = document.createElement("li")
    let newMenuA = document.createElement("a")
    newMenuLi.id = "image_link_btn"
    newMenuA.textContent = "Generate image links"
    newMenuLi.addEventListener("click", generateLinks)
    newMenuLi.appendChild(newMenuA)
    menuUl.insertBefore(newMenuLi, firstMenuItem)

})();
