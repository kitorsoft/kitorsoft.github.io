// ==UserScript==
// @name           Fritzbox
// @namespace      torabli.eu
// @description    FB
// @include        http*://fritz.box/*
// @grant		   none
// @version        1.0
// @encoding       UTF-8
// ==/UserScript==

window.onload = function() { init(); }

function init()
{
	console.log("init()");
	
	// select the target node
	var target = document.querySelector('#uiPageTitleBox');
	if(target == null)
	{
		console.log("nothing to observe");
		return;
	}
	 
	// create an observer instance
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			console.log(mutation.type);
			doIt();
		});
	});
 
	// configuration of the observer:
	//var config = { attributes: true, childList: true, characterData: true }
	var config = { childList: true }
	 
	// pass in the target node, as well as the observer options
	observer.observe(target, config);
	 
	// later, you can stop observing
	//observer.disconnect();
}

function doIt()
{
	var tab = document.querySelector('#dialLi.tab.selected');
	if(tab == null)
	{
		console.log("No dialLi");
		return;
	}
	/*
	<a href=" " onclick="return onDial('4989945118272');">4989945118272 (4991132689280)</a>
	*/
	var as = Array.from(document.getElementsByTagName("a"))
		.filter(a => a.getAttribute("onclick") != null &&
		             a.getAttribute("onclick").startsWith("return onDial('") &&
					 "01234567890".indexOf(a.innerHTML.charAt(0)) >= 0
				);
	
	console.log("as: " + as.length);
	for(i = 0; i < as.length; i++)
	{
		var parent = as[i].parentNode;
		
		if(parent.querySelector("a.telefonbuch") == null)
		{
			var a = document.createElement("A");
			a.classList.add("telefonbuch");
			var img = document.createElement("IMG");
			img.src = "http://www.dastelefonbuch.de/favicon.ico";
			a.appendChild(img);
			a.addEventListener("click", rueckwaertsSuche);
			var nr = as[i].getAttribute("onclick").replace("return onDial('", "").replace("');", "");
			a.setAttribute("nummer", nr);
			a.style.padding = "10px";
			a.style.float = "right";
			parent.appendChild(a);
			//console.log("Child created");
		}
		//else{ console.log("Child already exists"); }
	}
}

function rueckwaertsSuche()
{
		var nr = this.getAttribute("nummer");
		window.open("https://www.dastelefonbuch.de/Suche/" + nr, "dastelefonbuch");
}
