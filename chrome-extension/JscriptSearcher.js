
// Creates an active light to show the extension is running.
var notify = document.createElement('div');
notify.setAttribute('id', 'Active');

var node = document.createTextNode('UTA Course Rank extension is in use');
notify.appendChild(node);

var greenDot = document.createElement('div');
greenDot.setAttribute('id', 'On');
notify.appendChild(greenDot);
document.body.appendChild(notify);

function createDiv(score, profScores) {
	//Creates New Div
	if (typeof(profScores[0]) != "undefined") {
		scoreString = score.toString();
	}

	console.log(score);
	newContent = document.createTextNode(scoreString);
	newDiv = document.createElement("div");
	newDiv.style.fontWeight = "bold";
	newDiv.style.border = "solid";
	newDiv.style.borderColor = "red";
	newDiv.style.zIndex = 1000;
	newDiv.appendChild(newContent);
	td.append(newDiv);
	//newDiv.addEventListener('click', Clicked());
}

setTimeout(
	() => {
		// Instantiating Variables
			//Find Table w/ Teachers + Classes + Subject
		var table1 = document.querySelector('[title="Class Options"]');
		var scoreString;
		var profNames = new Array();
		var SplitNames = new Array();
		var profScores = new Array();
		var txtValue = "";
		var iterator = 0;

			if (table1 != null)
			{

				//Find the rows of the table.
				tr = table1.getElementsByTagName("tr");

				//Find what subject/class it is, EX: CSE 3311
				classNum = document.getElementById("SSR_CRSE_INFO_V_SSS_SUBJ_CATLG");

					// Loops for each class session that is offered.
					for (let i = 0; i < tr.length; i++) {
						td = tr[i].getElementsByTagName("td")[6];
						if (td)
						{
							//Makes sure no middle name is included in txtValue
							txtValue = td.textContent;
							SplitNames = txtValue.split(" ");
							if(SplitNames.length == 3 )
							{
								txtValue = SplitNames[0] + " " + SplitNames[2];
							}
							txtValue = txtValue.trimLeft().trimRight();
							profNames.push((txtValue));
							//findLocation(td);

							// Connects to database
							chrome.runtime.sendMessage({command: "fetch", data: txtValue },
							(response) =>
							{
								console.log(response.Availability);
								console.log(response.Clarity);
							  	profScores.push(response.Availability);
								profScores.push(response.Clarity);
								profScores.push(response.Communication);
								profScores.push(response.Encouragement);
								profScores.push(response.Ovr_Score);
								profScores.push(response.Preparedness);
								console.log(profScores[0]);
								console.log("^^^");
							});

							createDiv(score, profScores);

						}
						while(profScores.length > 0)
						{
    						profScores.pop();
						}
				}

						console.log(txtValue);
						console.log(classNum.textContent);
		}

	}, 2000);
