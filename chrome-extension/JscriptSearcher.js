
// Creates an active light to show the extension is running.
var notify = document.createElement('div');
notify.setAttribute('id', 'Active');

var node = document.createTextNode('UTA Course Rank extension is in use');
notify.appendChild(node);

var greenDot = document.createElement('div');
greenDot.setAttribute('id', 'On');
notify.appendChild(greenDot);
document.body.appendChild(notify);

document.createElement("button");
// Creates Verbose Content
let VerboseContent = document.createTextNode("UTA course rank is an extension which displays professor's scores as you sign up for classes ");
let VerboseDiv = document.createElement("div");
VerboseDiv.setAttribute("id", "Verbose");
VerboseDiv.append(VerboseContent);
document.body.append(VerboseDiv);

setTimeout(
	() => {
		// Instantiating Variables
			//Find Table w/ Teachers + Classes + Subject
		var table1 = document.querySelector('[title="Class Options"]');

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
						if (td) {
							//Makes sure no middle name is included in txtValue
							txtValue = td.textContent;
							SplitNames = txtValue.split(" ");
							if(SplitNames.length() == 3 )
							{
								txtValue = SplitNames[1] + " " + SplitNames[3];
							}

							profNames.push((txtValue));
							//findLocation(td);

							// Connects to database
							chrome.runtime.sendMessage({command: "fetch", data: txtValue },
							(response) =>
							{
								profScores.push(response.Availability)
								profScores.push(response.Clarity)
								profScores.push(response.Communication)
								profScores.push(response.Encouragement)
								profScores.push(response.Ovr_Score)
								profScores.push(response.Preparedness)
							} );
							//Create new Div && Fill it with Scores + " Topic "
							for (iterator = 0; iterator < 5; iterator++)
							{
									var score = profScores[iterator];
									score.toString();
									if( iterator == 0 )
									{

									}
									else if ( iterator == 1 )
									{

									}
									else if ( iterator == 2 )
									{

									}
									else if ( iterator == 3 )
									{

									}
									else if ( iterator == 4 )
									{

									}
									else if ( iterator == 5 )
									{

									}
									//Creates New Div
									newContent = document.createTextNode(score);
									newDiv = document.createElement("div");
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
						while(profScores.length > 0)
						{
    						profScores.pop();
						}
				}

						console.log(txtValue)
						console.log(classNum.textContent)
		}

	}
	}, 2000);

