setTimeout(() => { 	var table1 = document.querySelector('[title="Class Selection"]');
    var profNames = new Array();
	var txtValue = "";
	if( table1 != null)
	{
		tr = table1.getElementsByTagName("tr");
		classNum = document.getElementById("SSR_CRSE_INFO_V_SSS_SUBJ_CATLG");
		for( let i = 0; i < tr.length; i++ )
		{
			td = tr[i].getElementsByTagName("td")[6];
			if(td){
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
				}

			console.log(txtValue)
			console.log(classNum.textContent)
		}
	}; }, 2000);


function Clicked( ) 
{
	//stopPropagation();
	console.log("clicked!");
	
}
