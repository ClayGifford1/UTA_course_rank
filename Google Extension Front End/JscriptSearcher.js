setTimeout(() => { 	var table1 = document.querySelector('[title="Class Selection"]');
    var profNames = new Array();
	var txtValue = "";
	if( table1 != null)
	{
		tr = table1.getElementsByTagName("tr");
		classNum = document.getElementById("SSR_CRSE_INFO_V_SSS_SUBJ_CATLG");
		for( let i = 0; i < tr.length; i++ )
		{
			td = tr[i].getElementsByTagName("td")[7];
			if(td){
				txtValue = td.textContent;
				profNames.push((td.textContent));
				findLocation(td);
				newDiv = document.createElement("div");
				newContent = document.createTextNode("NEW TEXT HERE!");
				newDiv.appendChild(newContent);
				td.append(newDiv);
				}

			console.log(txtValue)
			console.log(classNum.textContent)
		}
	}; }, 2000);


function findLocation( teachName ) 
{
    var _x = 0;
    var _y = 0;
    while( teachName && !isNaN( teachName.offsetLeft ) && !isNaN( teachName.offsetTop ) ) {
          _x += teachName.offsetLeft - teachName.scrollLeft;
          _y += teachName.offsetTop - teachName.scrollTop;
          teachName = teachName.offsetParent;
    }
	console.log( _x);
	console.log( _y);
    return { top: _y, left: _x };
}
