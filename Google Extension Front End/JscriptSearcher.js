setTimeout(() => { 	var table1 = document.querySelector('[title="Class Selection"]');
	var txtValue = ""
	if( table1 != null)
	{
		tr = table1.getElementsByTagName("tr");

		for( let i = 0; i < tr.length; i++ )
		{
			td = tr[i].getElementsByTagName("td")[7];
			if(td){
				txtValue = td.textContent;
				}
			console.log(txtValue)
		}
	}; }, 2000);




