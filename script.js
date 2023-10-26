 let domainTableInstance;
 let originalDomainList = [];
 let apiDataLoaded = false;

 function getCurrentDate() {
   const now = new Date();
   now.setHours(now.getHours() - 12, now.getMinutes() - 30);
   const day = String(now.getDate()).padStart(2, '0');
   const month = String(now.getMonth() + 1).padStart(2, '0');
   const year = now.getFullYear();
   const hours = String(now.getHours()).padStart(2, '0');
   const minutes = String(now.getMinutes()).padStart(2, '0');
   const seconds = String(now.getSeconds()).padStart(2, '0');
   return `${day}.${month}.${year}`;
 }
 
 function populateTable(data) {
   domainTableInstance = $('#domainTable').DataTable({
	 data: data,
	 language: {
	   url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/tr.json"
	 },
	 columns: [
	   { data: null, defaultContent: '', orderable: false },
	   { data: "domain", title: "DOMAÄ°N ADI" },
	   {
		 data: "domain",
		 title: "Ä°SMÄ°",
		 render: function (data) {
		   const domainName = data.split(".")[0];
		   return domainName;
		 }
	   },
	   {
		 data: null,
		 title: "DÃœÅECEK",
		 render: function (data) {
		   return getCurrentDate();
		 }
	   }
	 ],
	 createdRow: function (row, data, dataIndex) {
	   $('td', row).eq(0).text(dataIndex + 1);
	 }
   });
 }
 
 function showLoadingMessage() {
   document.getElementById('loadingMessage').style.display = 'block';
 }
 
 function hideLoadingMessage() {
   document.getElementById('loadingMessage').style.display = 'none';
 }

 function loadDomains() {
   if (!apiDataLoaded) {
	 showLoadingMessage();
	setTimeout(function () {
	   $.ajax({
		  url: 'api?api_key=umit2023v1',
		  dataType: 'json',
		  success: function (data) {
			 hideLoadingMessage();
			 originalDomainList = data;
			 populateTable(data);
			 apiDataLoaded = true;
		  },
		  error: function (xhr, textStatus, error) {
			 hideLoadingMessage();
			 const domainTable = document.getElementById('domainTable');
			 domainTable.innerHTML = '<tr><th scope="row">SÄ±ra</th><th scope="row">Domain AdÄ±</th><th scope="row">Ä°smi</th><th scope="row">DÃ¼ÅŸeceÄŸi Tarih</th></tr>';

			 const row = domainTable.insertRow();
			 const cell = row.insertCell();
			 cell.colSpan = 4;
			 cell.style.textAlign = 'center';
			 cell.innerHTML = 'Veriler yÃ¼klenirken bir hata oluÅŸtu.';
		  }
	   });
	}, 7000);
   }
 }

 window.addEventListener('load', loadDomains);

 document.getElementById('extension').addEventListener('change', function () {
   applyFilters();
 });
 
 document.getElementById('lengthFilter').addEventListener('change', function () {
   applyFilters();
 });
 
 document.getElementById('hyphenFilter').addEventListener('change', function () {
   applyFilters();
 });
 
 document.getElementById('numberFilter').addEventListener('change', function () {
   applyFilters();
 });
 
 function applyFilters() {
   const selectedExtension = document.getElementById('extension').value;
   const lengthFilter = document.getElementById('lengthFilter').value;
   const hyphenFilter = document.getElementById('hyphenFilter').value;
   const numberFilter = document.getElementById('numberFilter').value;
 
   let filteredDomains = originalDomainList.filter(domain => {
	 const domainWithoutExtension = domain.domain.split(".")[0];
	 const domainLength = domainWithoutExtension.length;
	 const hasHyphen = domainWithoutExtension.includes('-');
	 const hasNumber = /\d/.test(domainWithoutExtension);
 
	 if ((lengthFilter === '3' && domainLength === 3) ||
	   (lengthFilter === '4' && domainLength === 4) ||
	   (lengthFilter === '5' && domainLength === 5) ||
	   lengthFilter === '') {
	   if (hyphenFilter === '' || hyphenFilter === 'true' && hasHyphen || hyphenFilter === 'false' && !hasHyphen) {
		 if (numberFilter === '' || numberFilter === 'true' && hasNumber || numberFilter === 'false' && !hasNumber) {
			 return true;
		 }
	   }
	 }
	 return false;
   });
 
   if (selectedExtension) {
	 filteredDomains = filteredDomains.filter(domain => domain.domain.endsWith(selectedExtension));
   }
 
   domainTableInstance.clear().rows.add(filteredDomains).draw();
 }
