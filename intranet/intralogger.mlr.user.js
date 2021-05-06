// ==UserScript==
// @name         Intralogger
// @namespace    http://tampermonkey.net/
// @version      1.3.6
// @description  Log calls from the intranet!
// @author       Mikkel Lysholt Robdrup
// @match        https://intranet.zitcom.dk/*
// @updateURL   https://supportmon.zitcom.dk/mlr/intralogger.user.js
// @downloadURL https://supportmon.zitcom.dk/mlr/intralogger.user.js
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
    //De forskellige kategorier og om de kræver en kommentar
    window.categorypairs = [
		{ "category":"Odin Migrering - Tekniske problemer", "needscomment":"false"},
		{ "category":"Odin Migrering - Opsætning", "needscomment":"false"},
		{ "category":"Ahsay(Remote/Online backup)", "needscomment":"false"},
		{ "category":"Basekit", "needscomment":"false"},
		{ "category":"Dedikerede Servere - VPS/VDS/VM", "needscomment":"false"},
		{ "category":"DNS", "needscomment":"false"},
		{ "category":"Domæne", "needscomment":"false"},
		{ "category":"Hosted Exchange", "needscomment":"false"},
		{ "category":"Hosted Spamfilter", "needscomment":"false"},
		{ "category":"Hostnordic", "needscomment":"false"},
		{ "category":"Kundecenter", "needscomment":"false"},
		{ "category":"Legacy", "needscomment":"false"},
		{ "category":"MailFactory", "needscomment":"false"},
		{ "category":"Migration", "needscomment":"false"},
		{ "category":"Office 365", "needscomment":"false"},
		{ "category":"Rentention", "needscomment":"false"},
		{ "category":"Servicedesk", "needscomment":"false"},
		{ "category":"SMS1919", "needscomment":"false"},
		{ "category":"SSL certifikat", "needscomment":"false"},
		{ "category":"TSM", "needscomment":"false"},
		{ "category":"Veeam", "needscomment":"false"},
		{ "category":"Viderestilling", "needscomment":"false"},
		{ "category":"VPN", "needscomment":"false"},
		{ "category":"Webhotel Linux", "needscomment":"false"},
		{ "category":"Webhotel Windows", "needscomment":"false"},
		{ "category":"Ahsay(Remote/Online backup) - Mersalg", "needscomment":"false"},
		{ "category":"Ahsay(Remote/Online backup) - Diverse", "needscomment":"true"},
		{ "category":"Ahsay(Remote/Online backup) - Generel fejlsøgning", "needscomment":"false"},
		{ "category":"Ahsay(Remote/Online backup) - Logfiler", "needscomment":"false"},
		{ "category":"Basekit - Demo", "needscomment":"false"},
		{ "category":"Basekit - Diverse", "needscomment":"true"},
		{ "category":"Basekit - Opgradering", "needscomment":"false"},
		{ "category":"Basekit - Spørgsmål til design", "needscomment":"false"},
		{ "category":"Basekit - Mersalg", "needscomment":"false"},
		{ "category":"Basekit - Spørgsmål til SEO", "needscomment":"false"},
		{ "category":"Basekit - Spørgsmål til SSL", "needscomment":"false"},
		{ "category":"Basekit - Spørgsmål til statistik", "needscomment":"false"},
		{ "category":"Dedikerede Servere - VPS/VDS/VM - Diverse", "needscomment":"true"},
		{ "category":"Dedikerede Servere - VPS/VDS/VM - Generel fejlsøgning", "needscomment":"false"},
		{ "category":"Dedikerede Servere - VPS/VDS/VM - Genstart af server", "needscomment":"false"},
		{ "category":"Dedikerede Servere - VPS/VDS/VM - Spørgsmål til Plesk", "needscomment":"false"},
		{ "category":"Dedikerede Servere - VPS/VDS/VM - Spørgsmål til RDP/SSH", "needscomment":"false"},
		{ "category":"Dedikerede Servere - VPS/VDS/VM - Windows Firewall", "needscomment":"false"},
		{ "category":"Diverse - Callback", "needscomment":"false"},
		{ "category":"Diverse - Ikke kunde hos os", "needscomment":"false"},
		{ "category":"Diverse - Opfølgning på tidligere problem", "needscomment":"false"},
		{ "category":"Diverse - Nyhedsbrev fra os", "needscomment":"false"},
		{ "category":"Diverse - Merak Migreringsproblemer", "needscomment":"false"},
		{ "category":"Diverse - Itadel Migration", "needscomment":"false"},
		{ "category":"Diverse - Phishing mail", "needscomment":"false"},
		{ "category":"Diverse - Lightmail", "needscomment":"false"},
		{ "category":"Diverse - Profibermail", "needscomment":"false"},
		{ "category":"Diverse - Driftsproblemer - nedbrud m.m", "needscomment":"false"},
		{ "category":"Diverse - Produkt ikke hos os", "needscomment":"false"},
		{ "category":"Diverse", "needscomment":"true"},
		{ "category":"Diverse - Ændring af abonnement", "needscomment":"false"},
		{ "category":"DNS - Diverse", "needscomment":"true"},
		{ "category":"DNS - DKIM", "needscomment":"false"},
		{ "category":"DNS - Generelle DNS ændringer", "needscomment":"false"},
		{ "category":"DNS - Spørgsmål til DNSSEC", "needscomment":"false"},
		{ "category":"DNS - Mersalg", "needscomment":"false"},
		{ "category":"DNS - Indsæt SPF", "needscomment":"false"},
		{ "category":"DNS - Mangler DNS login", "needscomment":"false"},
		{ "category":"Domæne - Deaktiveret", "needscomment":"false"},
		{ "category":"Domæne - Diverse", "needscomment":"true"},
		{ "category":"Domæne - Mersalg", "needscomment":"false"},
		{ "category":"Domæne - Oprettelse", "needscomment":"false"},
		{ "category":"Domæne - Overdragelse af domæne", "needscomment":"false"},
		{ "category":"Domæne - Spørgsmål til subdomæne", "needscomment":"false"},
		{ "category":"Domæne - Spørgsmål til flytning", "needscomment":"false"},
		{ "category":"Domæne - Starte redelegering", "needscomment":"false"},
		{ "category":"Domæne - Tilkøb af DNS", "needscomment":"false"},
		{ "category":"Domæne - Udlevering af EPP", "needscomment":"false"},
		{ "category":"Domæne - Ændring af Navneservere", "needscomment":"false"},
		{ "category":"Hosted Exchange - Generelle spørgsmål", "needscomment":"true"},
		{ "category":"Hosted Exchange - Generel fejlsøgning", "needscomment":"false"},
		{ "category":"Hosted Exchange - Mersalg", "needscomment":"false"},
		{ "category":"Hosted Exchange - Nulstilling af kodeord", "needscomment":"false"},
		{ "category":"Hosted Exchange - Oprettelse af brugere", "needscomment":"false"},
		{ "category":"Hosted Exchange - Opsætning på PC", "needscomment":"false"},
		{ "category":"Hosted Exchange - Opsætning på Mac", "needscomment":"false"},
		{ "category":"Hosted Exchange - Opsætning på iPhone", "needscomment":"false"},
		{ "category":"Hosted Exchange - Opsætning på Android", "needscomment":"false"},
		{ "category":"Hosted Exchange - SPAM", "needscomment":"false"},
		{ "category":"Hosted Exchange - Spørgsmål til Pakker", "needscomment":"false"},
		{ "category":"Hosted Exchange - Kalender", "needscomment":"false"},
		{ "category":"Hosted Exchange - Dadlnet", "needscomment":"false"},
		{ "category":"Hosted Exchange - Diverse", "needscomment":"true"},
		{ "category":"Hosted Spamfilter - Mersalg", "needscomment":"false"},
		{ "category":"Hosted Spamfilter - Oprettelse af produkt", "needscomment":"false"},
		{ "category":"Hosted Spamfilter - Opsætning af SMTP udsendelse", "needscomment":"false"},
		{ "category":"Hosted Spamfilter - Spørgsmål til opsætning", "needscomment":"false"},
		{ "category":"Hosted Spamfilter - Spørgsmål til brug af spamfilter", "needscomment":"false"},
		{ "category":"Kundecenter - Overdragelse af produkter", "needscomment":"false"},
		{ "category":"Kundecenter - Spørgsmål til faktura", "needscomment":"false"},
		{ "category":"Kundecenter - Spørgmål til kontrolpanel", "needscomment":"false"},
		{ "category":"Kundecenter - Mersalg", "needscomment":"false"},
		{ "category":"Kundecenter - Kontosammenlægning", "needscomment":"false"},
		{ "category":"Kundecenter - Ændring i kontooplysninger", "needscomment":"false"},
		{ "category":"Kundecenter - Spørgsmål til produkter", "needscomment":"false"},
		{ "category":"Kundecenter - Spørgsmål til resellerpanel/funktionalitet", "needscomment":"false"},
		{ "category":"Kundecenter - Slutkunde", "needscomment":"false"},
		{ "category":"Kundecenter - Nulstilling af kode", "needscomment":"false"},
		{ "category":"Kundecenter - Diverse", "needscomment":"true"},
		{ "category":"Legacy - Danhost", "needscomment":"false"},
		{ "category":"Legacy - Email Manager", "needscomment":"false"},
		{ "category":"Legacy - Hosting Manager", "needscomment":"false"},
		{ "category":"Legacy - Itadel", "needscomment":"false"},
		{ "category":"Legacy - Mailcloud", "needscomment":"false"},
		{ "category":"Legacy - Maillist", "needscomment":"false"},
		{ "category":"Legacy - Skyline/Elromail", "needscomment":"false"},
		{ "category":"Legacy - SMS gateway", "needscomment":"false"},
		{ "category":"Legacy - Smartweb mail", "needscomment":"false"},
		{ "category":"Lightmail - Nulstilling af kodeord", "needscomment":"false"},
		{ "category":"Lightmail - Opsætning", "needscomment":"false"},
		{ "category":"MailFactory - Generelle spørgsmål", "needscomment":"true"},
		{ "category":"MailFactory - Generel fejlsøgning", "needscomment":"false"},
		{ "category":"MailFactory - Mersalg", "needscomment":"false"},
		{ "category":"MailFactory - Opsætning på PC", "needscomment":"false"},
		{ "category":"MailFactory - Opsætning på Mac", "needscomment":"false"},
		{ "category":"MailFactory - Opsætning på iPhone", "needscomment":"false"},
		{ "category":"MailFactory - Opsætning på Android", "needscomment":"false"},
		{ "category":"MailFactory - Nulstilling af kodeord", "needscomment":"false"},
		{ "category":"MailFactory - SPAM", "needscomment":"false"},
		{ "category":"MailFactory - Oprettelse af brugere", "needscomment":"false"},
		{ "category":"MailFactory - Spamfilter", "needscomment":"false"},
		{ "category":"MailFactory - Diverse", "needscomment":"true"},
		{ "category":"MailFactory - Restore", "needscomment":"false"},
		{ "category":"MailFactory - Webmail", "needscomment":"false"},
		{ "category":"Migration - Itadel", "needscomment":"false"},
		{ "category":"Migration - Mail", "needscomment":"false"},
		{ "category":"Migration - Web", "needscomment":"false"},
		{ "category":"Office 365 - Backup", "needscomment":"false"},
		{ "category":"Office 365 - Exchange opsætning", "needscomment":"false"},
		{ "category":"Office 365 - Generel fejlsøgning", "needscomment":"false"},
		{ "category":"Office 365 - Generelle spørgsmål", "needscomment":"true"},
		{ "category":"Office 365 - Nulstilling af password", "needscomment":"false"},
		{ "category":"Office 365 - Officepakken", "needscomment":"false"},
		{ "category":"Office 365 - Mersalg", "needscomment":"false"},
		{ "category":"Office 365 - OneDrive/Sharepoint", "needscomment":"false"},
		{ "category":"Office 365 - Oprettelse af brugere", "needscomment":"false"},
		{ "category":"Office 365 - Oprettelse af delte postkasser", "needscomment":"false"},
		{ "category":"Office 365 - Opsætning af delt kalender", "needscomment":"false"},
		{ "category":"Office 365 - Opsætning af domæne", "needscomment":"false"},
		{ "category":"Office 365 - Skift af licens", "needscomment":"false"},
		{ "category":"Office 365 - Spørgsmål til licenser", "needscomment":"false"},
		{ "category":"Office 365 - Sikkermail", "needscomment":"false"},
		{ "category":"Office 365 - Spam", "needscomment":"false"},
		{ "category":"Office 365 - Spam blokering", "needscomment":"false"},
		{ "category":"Office 365 - Tilkøb af licens", "needscomment":"false"},
		{ "category":"Office 365 - Teams", "needscomment":"false"},
		{ "category":"Office 365 - Diverse", "needscomment":"true"},
		{ "category":"Retention - Retention", "needscomment":"false"},
		{ "category":"Retention - Opsigelse", "needscomment":"false"},
		{ "category":"Retention - Winback", "needscomment":"false"},
		{ "category":"SMS1919 - Diverse", "needscomment":"true"},
		{ "category":"SMS1919 - Generel fejlsøgning", "needscomment":"false"},
		{ "category":"SMS1919 - Generelle spørgsmål", "needscomment":"true"},
		{ "category":"SSL certifikat - Oprettelse af SSL", "needscomment":"false"},
		{ "category":"SSL certifikat - Generel fejlsøgning", "needscomment":"false"},
		{ "category":"SSL Certifikat - Mersalg", "needscomment":"false"},
		{ "category":"SSL certifikat - Diverse", "needscomment":"true"},
		{ "category":"TSM - Generel fejlsøgning", "needscomment":"false"},
		{ "category":"TSM - Generelle spørgsmål", "needscomment":"true"},
		{ "category":"TSM - Restore", "needscomment":"false"},
		{ "category":"TSM - Mersalg", "needscomment":"false"},
		{ "category":"TSM - Logfiler", "needscomment":"false"},
		{ "category":"TSM - Oprettelse af produkt", "needscomment":"false"},
		{ "category":"TSM - Diverse", "needscomment":"true"},
		{ "category":"Veeam - Diverse", "needscomment":"true"},
		{ "category":"Veeam - Logfiler", "needscomment":"false"},
		{ "category":"Veeam - Generel fejlsøgning", "needscomment":"false"},
		{ "category":"Veeam - Mersalg", "needscomment":"false"},
		{ "category":"Viderestilling til Bogholderi", "needscomment":"false"},
		{ "category":"Viderestilling til Solutions", "needscomment":"false"},
		{ "category":"Viderestilling til Salg", "needscomment":"false"},
		{ "category":"Viderestilling til Shop", "needscomment":"false"},
		{ "category":"Viderestilling til retention", "needscomment":"false"},
		{ "category":"VPN - Generel fejlsøgning", "needscomment":"false"},
		{ "category":"VPN - Mersalg", "needscomment":"false"},
		{ "category":"VPN - Oprettelse af produkt", "needscomment":"false"},
		{ "category":"VPN - Nulstilling af kodeord", "needscomment":"false"},
		{ "category":"VPN - Oprettelse af brugere", "needscomment":"false"},
		{ "category":"Webhotel Linux - Oprettelse", "needscomment":"false"},
		{ "category":"Webhotel Linux - Generel fejlsøgning", "needscomment":"false"},
		{ "category":"Webhotel Linux - Langsom loadtid", "needscomment":"false"},
		{ "category":"Webhotel Linux - Problemer med indhold på sitet", "needscomment":"false"},
		{ "category":"Webhotel Linux - FTP", "needscomment":"false"},
		{ "category":"Webhotel Linux - Mersalg", "needscomment":"false"},
		{ "category":"Webhotel Linux - MySQL", "needscomment":"false"},
		{ "category":"Webhotel Linux - Let's Encrypt", "needscomment":"false"},
		{ "category":"Webhotel Linux - Restore", "needscomment":"false"},
		{ "category":"Webhotel Linux - Statistik", "needscomment":"false"},
		{ "category":"Webhotel Linux - Legacy Migrering", "needscomment":"false"},
		{ "category":"Webhotel Linux - Diverse", "needscomment":"true"},
		{ "category":"Webhotel Linux - 503 error", "needscomment":"false"},
		{ "category":"Webhotel Linux - Kontaktformular", "needscomment":"false"},
		{ "category":"Webhotel Linux - Cronjob", "needscomment":"false"},
		{ "category":"Webhotel Windows - Oprettelse", "needscomment":"false"},
		{ "category":"Webhotel Windows - Generel fejlsøgning", "needscomment":"false"},
		{ "category":"Webhotel Windows - Genstart app. pool", "needscomment":"false"},
		{ "category":"Webhotel Windows - Langsom loadtid", "needscomment":"false"},
		{ "category":"Webhotel Windows - Mersalg", "needscomment":"false"},
		{ "category":"Webhotel Windows - Problemer med indhold på sitet", "needscomment":"false"},
		{ "category":"Webhotel Windows - FTP", "needscomment":"false"},
		{ "category":"Webhotel Windows - MSSQL/MySQL", "needscomment":"false"},
		{ "category":"Webhotel Windows - Let's Encrypt", "needscomment":"false"},
		{ "category":"Webhotel Windows - Statistik", "needscomment":"false"},
		{ "category":"Webhotel Windows - Diverse", "needscomment":"true"},
		{ "category":"Webhotel Windows - Cronjob", "needscomment":"false"},
		{ "category":"Webhotel Windows - Restore", "needscomment":"false"},
		{ "category":"Udvikling - Fejlet ordre", "needscomment":"false"}
    ];

    //tilføj hovedkategorierne til det array vi bruger til at sammenligne med den indtastede værdi i formularen.
    window.categoryarray = [];
    categorypairs.forEach(addtoarray);

    var formvalidate = `console.log(document.getElementById("user_comment").value);

		if(!categoryarray.includes(document.getElementById("user_comment").value)){
				alert("Indtastet kategori er ikke gyldig");
				return false;
			 };
		window.test = "false";
		categorypairs.forEach(testValue);

		console.log(test);

		if(test == "true" && !document.getElementById("user_comment2").value){
			alert("kræver kommentar");

			return false;
		}
		if(document.getElementById("user_comment").value.includes("Retention")){
					  window.location.href = "https://teambluegroup-my.sharepoint.com/:x:/g/personal/soeren_kristensen_team_blue/EROixwnSMXxMleePOi4pcJQB3BzpjxL9mXytCps04ciPWg?e=sNQVpI";
				   }
				   this.submit();
				   this.reset();
				   return false;
		`

    var loggingform = document.createElement("form");
    loggingform.setAttribute("action", "https://supportmon.zitcom.dk/shkald/include/get_response.php");
    loggingform.setAttribute("onsubmit", formvalidate);
	loggingform.setAttribute("id", "contact-form");
    loggingform.setAttribute("style", "float: right;");
    loggingform.setAttribute("method", "post");
    loggingform.setAttribute("name", "contact-form");
    loggingform.setAttribute("target", "hiddenFrame");

    //create the form
	var form = `<input type="text" class="form-control" id="resellerId" name="resellerId" pattern="(^[A-Za-z]{2}|^[A-Za-z]{3})+[0-9]{1,18}|0" placeholder="ID (Skriv 0 hvis intet ID)"  style="width: 250px;" required>
<input list="comment_choice" class="form-control" id="user_comment" name="user_comment" placeholder="Kategori" style="width: 250px;" required>
<datalist id="comment_choice">`;

   //add the categories to the form
   categoryarray.forEach(generateOptions);

   //add the end of the form
   form +=`</datalist><input type="text" class="form-control" id="user_comment2" name="user_comment2" value="" placeholder="Kommentar hvis diverse" style="width: 250px;">
<input type="hidden" id="user_cred" name="user_cred" value="` + currentUsername.toUpperCase() +`">
<input type="submit" style="visibility: hidden; width: 0px; padding: 0px;"/>`;


    loggingform.innerHTML = form;

    document.querySelector('.toolbar-user-profile').innerHTML = "";
    document.querySelector('.toolbar-user-profile').appendChild(loggingform);

    var myframe = document.createElement("iframe");
    myframe.setAttribute("name", "hiddenFrame");
    myframe.setAttribute("width", "200px");
    myframe.setAttribute("height", "400px");
    myframe.setAttribute("border", "0");
    myframe.setAttribute("frameBorder", "0");
    myframe.setAttribute("src", "https://supportmon.zitcom.dk/mlr/intraframe.php?agent=" + currentUsername.toUpperCase());

    document.querySelector('.menu').appendChild(myframe);

    //tilføj hovedkategorierne til det array vi bruger til at sammenligne med den indtastede værdi i formularen.
    function addtoarray(item, index){
        categoryarray.push(item.category);
    }

    //generer listen af muligheder i formularen
    function generateOptions(item, index) {
	   form += '<option value="'
	   form += item;
	   form += '">'
	   console.log(item);
	}

    //Tjek værdierne i formularen. kræver hovedkategorien kommentar?
    //der er allerede tjekket om hovedkategorien er gyldig
    window.testValue = function (item, index){
        if (item.category == document.getElementById("user_comment").value && item.needscomment == "true"){
            window.test = "true";
        }
    }

})();
