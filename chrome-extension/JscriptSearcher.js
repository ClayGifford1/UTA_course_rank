/*
var alertShown = false;

if (!alertShown) {

	alert(`UTA Course Rank is now in use

The extension will display professor scores while you browse classes

No user data is ever collected`);

	alertShown = true;

};
*/

var notify = document.createElement('div');
notify.setAttribute('id', 'Active');

var node = document.createTextNode('UTA Course Rank extension is in use');
notify.appendChild(node);

var greenDot = document.createElement('div');
greenDot.setAttribute('id', 'On');
notify.appendChild(greenDot);

/*

var okayBtn = document.createElement('button');
okayBtn.setAttribute('id', 'Okay');
notify.appendChild(okayBtn);

var btnTxt = document.createTextNode('Hide')
okayBtn.appendChild(btnTxt);

okayBtn.onclick = function () {
	notify.style.display = 'none';
}

*/

document.body.appendChild(notify);

setTimeout( () => {
		var table1 = document.querySelector('[title="Class Options"]');
		var profNames = new Array();
		var txtValue = "";

			
		if (table1 != null) {
			var classOptions = document.querySelector('[title="Class Options"]').rows.length;
			console.log(classOptions);
			classOptions = classOptions - 1;
			for (let iterator = 0; iterator < classOptions; iterator++) {
				tr = table1.getElementsByTagName("tr");
				classNum = document.getElementById("SSR_CRSE_INFO_V_SSS_SUBJ_CATLG");
				for (let i = 0; i < tr.length; i++) {
					td = tr[i].getElementsByTagName("td")[6];
					if (td) {
						txtValue = td.textContent;
						profNames.push((td.textContent));
						//findLocation(td);
						newDiv = document.createElement("div");
						var score = Math.random() + 4;
						score = score.toFixed(2);
						score.toString();
						newContent = document.createTextNode(score);
						//newDiv.style.backgroundColor = "#FF0000";
						newDiv.style.fontWeight = "bold";
						newDiv.style.border = "solid";
						newDiv.style.borderColor = "red";
						newDiv.style.zIndex = 1000;
						newDiv.appendChild(newContent);
						td.append(newDiv);
						newDiv.addEventListener('click', Clicked());
						VerboseContent.nodeValue = "";
						VerboseDiv.style.display="none";
					}

					console.log(txtValue)
					console.log(classNum.textContent)
				}
			}
		}

	}, 2000);






function Clicked() {
	//stopPropagation();
	console.log("clicked!");

}
