var notify = document.createElement('div');
notify.setAttribute('id', 'Active');

var node = document.createTextNode('UTA Course Rank extension is in use');
notify.appendChild(node);

var greenDot = document.createElement('div');
greenDot.setAttribute('id', 'On');
notify.appendChild(greenDot);
document.body.appendChild(notify);

setTimeout(
	() => {
		var table1 = document.querySelector('[title="Class Options"]');
		var profNames = new Array();
		var SplitNames = new Array();
		var profScores = new Array();
		var txtValue = "";
		var bob = 0;
		//boolean  assign false
		document.createElement("button");

		let VerboseContent = document.createTextNode("UTA course rank is an extension which displays professor's scores as you sign up for classes ");
		let VerboseDiv = document.createElement("div");
		VerboseDiv.style.fontWeight = "bold";
		VerboseDiv.style.border = "solid";
		VerboseDiv.style.borderColor = "black";
		VerboseDiv.style.position = "fixed";
		VerboseDiv.style.right = "100px";
		VerboseDiv.style.width = "400px";
		VerboseDiv.style.top = "150px";
		//VerboseDiv.style.textAlign = "right";
		VerboseDiv.style.zIndex = 1500;
		document.body.append(VerboseDiv);
		VerboseDiv.append(VerboseContent);
		//Btn.appendChild(newContent);
		//td.append(MyBtn);

			if (table1 != null) {
				var classOptions = document.querySelector('[title="Class Options"]').rows.length;
				console.log(classOptions);
				classOptions = classOptions - 1;
					tr = table1.getElementsByTagName("tr");
					classNum = document.getElementById("SSR_CRSE_INFO_V_SSS_SUBJ_CATLG");

					for (let i = 0; i < tr.length; i++) {
						td = tr[i].getElementsByTagName("td")[6];
						if (td) {
							txtValue = td.textContent;
							SplitNames = txtValue.split(" ");
							if(SplitNames.length() == 3 )
							{
								txtValue = SplitNames[1] + " " + SplitNames[3];
							}

							profNames.push((txtValue));
							//findLocation(td);
							// Find score
							/*chrome.runtime.sendMessage({command: "fetch", data: {teachName: domain} }, (response)
							=> {

							}*/
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
							
							for (let iterator = 0; iterator < 5; iterator++)
							{

									var score = bob++;
									score.toString();
									newContent = document.createTextNode(score);
									//newDiv.style.backgroundColor = "#FF0000";
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






function Clicked() {
	//stopPropagation();
	console.log("clicked!");

}
