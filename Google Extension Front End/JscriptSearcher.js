setTimeout(
	() => {
		var table1 = document.querySelector('[title="Class Options"]');
		var profNames = new Array();
		var txtValue = "";

		//boolean  assign false 
		document.createElement("button");

		let MyBtn = document.createElement("button");
		let VerboseContent = document.createTextNode("UTA course rank is an extension which displays professor's scores as you sign up for classes ");
		MyBtn.innerHTML = "On";
		MyBtn.style.fontWeight = "bold";
		MyBtn.style.border = "solid";
		MyBtn.style.width = "100px";
		MyBtn.style.borderColor = "red";
		MyBtn.style.zIndex = 1500;
		document.body.appendChild(MyBtn);
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
		VerboseDiv.appendChild(MyBtn);
		document.body.append(VerboseDiv);
		VerboseDiv.append(VerboseContent);
		//Btn.appendChild(newContent);
		//td.append(MyBtn);
		let bool = new Boolean(false);
		MyBtn.onclick = function () {
			alert("It can : \n Read and change all your data on all websites : \n Display Notifications : ");
			
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
		}
	}, 2000);






function Clicked() {
	//stopPropagation();
	console.log("clicked!");

}
