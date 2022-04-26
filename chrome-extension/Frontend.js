
// Creates an active light to show the extension is running.
var notify = document.createElement('div');
notify.setAttribute('id', 'Active');

var node = document.createTextNode('UTA Course Rank extension is in use');
notify.appendChild(node);

var greenDot = document.createElement('div');
greenDot.setAttribute('id', 'On');
notify.appendChild(greenDot);
document.body.appendChild(notify);

setTimeout(() => 
{
	// Instantiating Variables
		//Find Table w/ Teachers + Classes + Subject
	var table1 = document.querySelector('[title="Class Options"]');
	var scoreString;
	var profNames = new Array();
	var SplitNames = new Array();
	var profScores = new Array();
	var txtValue = "";
	var iterator = 0;
	var total = 0;
	document.createElement("button");
	// Creates Verbose Content

	if (table1 != null)
	{

		//Find the rows of the table.
		tr = table1.getElementsByTagName("tr");

		//Find what subject/class it is, EX: CSE 3311
		classNum = document.getElementById("SSR_CRSE_INFO_V_SSS_SUBJ_CATLG");

			// Loops for each class session that is offered.
			for (let i = 0; i < tr.length; i++)
			{
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
						profScores.push(response.Ovr_Score)
						profScores.push(response.Availability);
						profScores.push(response.Clarity);
						profScores.push(response.Communication);
						profScores.push(response.Encouragement);
						profScores.push(response.Preparedness);
					} );
				}
			}
			setTimeout( () => 
			{
				for (let i = 0; i < tr.length; i++)
				{
					td = tr[i].getElementsByTagName("td")[6];
					if (td)
					{
						//Create new Div && Fill it with Scores + " Topic "
						for (iterator = 0; iterator < 6; iterator++)
						{
								if(profScores[iterator+total] != "undefined")
								{
								var score = profScores[iterator+total]
								scoreString = score.toString()
								if( iterator == 0)
								{
									scoreString	 += " Ovr_Score "

								}
								else if ( iterator == 1)
								{
									scoreString	 += " Availability "

								}
								else if ( iterator == 2 )
								{
									scoreString	 += " Clarity "

								}
								else if ( iterator == 3 )
								{
									scoreString	 += " Communication "


								}
								else if ( iterator == 4 )
								{
									scoreString	 += " Encouragement "

								}
								else if ( iterator == 5 )
								{
									scoreString	 += " Preparedness "
								}
								//Creates New Div

								console.log(score);
								newContent = document.createTextNode(scoreString);
								newDiv = document.createElement("div");
								newDiv.setAttribute('id', 'Display');
								newDiv.appendChild(newContent);
								td.append(newDiv)
								}
						}
					}

					total += 6;
				}
			}, 2000);
	}
}, 2000);
