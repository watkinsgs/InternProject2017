// these are some events that can fire once the document is "ready"..
$( document ).ready(function() {
 <!-- when the calendar button is clicked (or tapped) -->
 $( "#cal" ).click(function() {
   // make the date picker display..

   $("#cal-entry").datepicker();

   // show the calendar entry field that until now was hidden.
   $("#cal-entry").show();
 });

   setStoreNumber();

 // hides the spinner, because you don't want it spinning for no reason..
 $("#spinner").hide();

 // when the back button is clicked, go back appropriately..
 $( "#nav-back" ).click(function() {
   // none of the next two seem necessary...
  // var myBack = localStorage.getItem("backFlag");
   if (myBack == 0) {
console.log(myBack);
	location.reload();
     $("#cal").show();
     $("#thing").hide();
     $("#things").show();
     $("#invoice").hide();
     $("#hw-title3").hide();
     $("#hw-title2").hide();
     $("#hw-title").show();
     localStorage.setItem("backFlag", 0);

   } else if (myBack == 1) {
       	location.reload();
     $("#cal").hide();
     $("#thing").show();
     $("#things").hide();
     $("#invoice").hide();
     $("#hw-title3").hide();
     $("#hw-title2").show();
     $("#hw-title").hide();
     localStorage.setItem("backFlag", 1);
     myBack--;
	console.log(myBack);
   }
   else{
      location.reload();
     $("#cal").hide();
     $("#thing").hide();
     $("#things").hide();
     $("#invoice").show();
     $("#hw-title3").show();
     $("#hw-title2").hide();
     $("#hw-title").hide();
     localStorage.setItem("backFlag", 2);
     myBack--;
	console.log(myBack);


}
 });
});
var myBack = 0;
getThings();
// Ignore for now. This goes with the image viewer modal that we are not using..
function pickIt() {
 var pickItem = localStorage.getItem("pickItem");
 pickItem = pickItem * -1;
 localStorage.setItem("gblItemNumber", pickItem);

 var pickModel = localStorage.getItem("pickModel");
 localStorage.setItem("gblModelId", pickModel);

 var pickVbu = localStorage.getItem("pickVbu");
 localStorage.setItem("gblVendorNumber", pickVbu);

 window.location.assign("inventory.html");
}



// set the store number; in this case, we will hard code it..
function setStoreNumber() {
 if ( (localStorage.getItem("storenumber") == null) || (localStorage.getItem("storenumber") === undefined) )
 {
   // storeNbr = document.getElementById("storeNbr").value;
   storeNbr = 6901;    // hardcoded for now..

   localStorage.setItem("storenumber", storeNbr); // writes to local storage if not exists
 } else{
   storeNbr = localStorage.getItem("storenumber");
 }
 var setstoreNbr = document.getElementById("storenumber");
 setstoreNbr.innerHTML = storeNbr;
}



// This is the main work horse of this application.
// it makes an http request to get a json string,
// parses the json string and poplates the screen..
var myJson;
function getThings() {
 $("#cal-entry").hide();
 var storenumber = localStorage.getItem("storenumber");
 storenumber = localStorage.getItem("storenumber");

 var urllink = "https://isp1.6901.lowes.com/~s6901gw4/scaffoldClient/js/unlockRpt.json";
 var myDate = document.getElementById("cal-entry").value;
 var yourDate = myDate.substring(6,10) + "-" + myDate.substring(0,2) + "-" + myDate.substring(3,5);

 if (yourDate == "--"){
   yourDate = "2017-06-20";
   yourDate = "";
 }
 $("#spinner").show();
 var xhttp = new XMLHttpRequest();
 xhttp.onreadystatechange = function() {
   if (xhttp.readyState == 4 && xhttp.status == 200) {
     $("#spinner").hide();
     var response = JSON.parse(xhttp.responseText);
 myJson = response;
     if (response.rc === undefined) {
       showUnlockCategories(response);
     }else {
       document.getElementById("messagetab").className = "alert alert-danger";
       var element = document.getElementById("messagetab");
       element.innerHTML = "Error getting report list!";
     }

   }else{
     if(xhttp.readyState == 4){
       document.getElementById("errortab").className = "alert alert-danger";
       var element = document.getElementById("errortab");
       element.innerHTML = "Interal Server Error:"+ xhttp.status;
     }
   }

 };
 xhttp.open("GET", urllink, true);
 xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
 xhttp.send(null);



}

// This is the invoice table information
function showInvoice(number) {
	var urllink = "https://isp1.6901.lowes.com/~s6901gw4/scaffoldClient/js/unlockRpt.json";
	 xhttp = new XMLHttpRequest();
 	xhttp.onreadystatechange = function() {
   	if (xhttp.readyState == 4 && xhttp.status == 200) {
     		var response = JSON.parse(xhttp.responseText);
     		if (response.rc === undefined){
			var unlData = [];
			$.each(response.unlock_categories, function( key, details) {
                unlData.push(details.unlock_type);
                var unlockData = {};

                $.each(details.records, function(key, record) {
                                        unlockData.unlock_type = details.unlock_type;
                                        unlockData.salesid = record.salesid;
                                        unlockData.loginid = record.loginid;
                                        unlockData.firstName = record.name.first;
                                        unlockData.lastName = record.name.last;
                                        unlockData.avgUnlkDiff = record.avgUnlkDiff;
                            $.each(record.unlocks, function(key, unlock) {
                                        unlockData.invoice = unlock.invoice;
                                        unlockData.trans_type = unlock.trans_type;
                                        unlockData.unlock_lgn = unlock.unlock_lgn;
                                        unlockData.unlock_exception = unlock.unlock_exception;
                                        unlockData.qty = unlock.item.qty;
                                        unlockData.type = unlock.item.type;
                                        unlockData.description = unlock.item.description;
                                        unlockData.barcode = unlock.item.barcode;
                                        unlockData.default_price = unlock.item.default_price;
                                        unlockData.unlock_price = unlock.item.unlock_price;
                                        unlockData.unlock_margin = unlock.unlock_margin;
                                        unlockData.price_change_reason = unlock.price_change_reason;
                                         unlockData.total_diff = unlock.total_diff;
                        });
                                        unlockData.unlock_date = record.unlock_date;

			// if(unlockData.invoice == myJson.unlock_categories[number].records.unlocks.invoice) {
                        	let newRow = document.createElement("tr");
                        	let newCell = document.createElement("td");
                        	newCell.appendChild(document.createTextNode(unlockData.invoice));
                        	newRow.appendChild(newCell);
                         	let newCellA = document.createElement("td");
                        	newCellA.appendChild(document.createTextNode(unlockData.description));
                        	newRow.appendChild(newCellA);
                         	let newCellB = document.createElement("td");
                        	newCellB.appendChild(document.createTextNode(unlockData.qty));
                        	newRow.appendChild(newCellB);
                         	let newCellC = document.createElement("td");
                        	newCellC.appendChild(document.createTextNode(unlockData.type));
                        	newRow.appendChild(newCellC);
                         	let newCellD = document.createElement("td");
                        	newCellD.appendChild(document.createTextNode(unlockData.default_price));
                        	newRow.appendChild(newCellD);
				 let newCellE = document.createElement("td");
                                newCellE.appendChild(document.createTextNode(unlockData.unlock_price));
                                newRow.appendChild(newCellE);
				 let newCellF = document.createElement("td");
                                newCellF.appendChild(document.createTextNode(unlockData.total_diff));
                                newRow.appendChild(newCellF);
				 let newCellG = document.createElement("td");
                                newCellG.appendChild(document.createTextNode(unlockData.unlock_margin));
                                newRow.appendChild(newCellG);
				 let newCellH = document.createElement("td");
                                newCellH.appendChild(document.createTextNode(unlockData.price_change_reason));
                                newRow.appendChild(newCellH);
				 let newCellI = document.createElement("td");
                                newCellI.appendChild(document.createTextNode(unlockData.unlock_exception));
                                newRow.appendChild(newCellI);
				 let newCellJ = document.createElement("td");
                                newCellJ.appendChild(document.createTextNode(unlockData.unlock_lgn));
                                newRow.appendChild(newCellJ);




				document.getElementById("table_invoice").appendChild(newRow);

		//	}
		    });
		document.getElementById("hw-title3").innerHTML = "Details for Invoice: " + unlockData.invoice + "<br>" + "Store: " + myJson.store.store + " Date: " + myJson.store.business_Date;
+ myJson.store.business_date;

		});
			 $(document).ready(function() {
                       		$('#table_invoice').DataTable();
                	});

		}
	}

   }
 $("#thing").hide();
 $("#thing-name").hide();
 $("#things").hide();
 $("#thing").hide();
 $("#invoice").show();
 $("#hw-title").hide();
 $("#hw-title2").hide();
 $("#hw-title3").show();
 $("#cal").hide();
 localStorage.setItem("backFlag", 2);
 myBack = 2;
 console.log(urllink);
 xhttp.open("GET", urllink, true);
 xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
 xhttp.send(null);

}


// this shows the selected thing's information.
function showThing(number) {
 var urllink = "https://isp1.6901.lowes.com/~s6901gw4/scaffoldClient/js/unlockRpt.json";
 var htmlstring = "";
 xhttp = new XMLHttpRequest();
 xhttp.onreadystatechange = function() {
   if (xhttp.readyState == 4 && xhttp.status == 200) {
     var response = JSON.parse(xhttp.responseText);
     if (response.rc === undefined){
	var unlData = [];
	 $.each(response.unlock_categories, function( key, details) {
	 document.getElementById("hw-title2").innerHTML = myJson.unlock_categories[number].unlock_type + "<br>" + "Store: " + myJson.store.store + " Date: " + myJson.store.business_date;
		unlData.push(details.unlock_type);
		var unlockData = {};

		$.each(details.records, function(key, record) {
					unlockData.unlock_type = details.unlock_type;
					unlockData.salesid = record.salesid;
					unlockData.loginid = record.loginid;
					unlockData.firstName = record.name.first;
					unlockData.lastName = record.name.last;
					unlockData.avgUnlkDiff = record.avgUnlkDiff;
			    $.each(record.unlocks, function(key, unlock) {
					unlockData.invoice = unlock.invoice;
					unlockData.trans_type = unlock.trans_type;
					unlockData.unlock_lgn = unlock.unlock_lgn;
					unlockData.unlock_exception = unlock.unlock_exception;
					unlockData.qty = unlock.item.qty;
					unlockData.type = unlock.item.type;
					unlockData.description = unlock.item.description;
					unlockData.barcode = unlock.item.barcode;
					unlockData.default_price = unlock.item.default_price;
					unlockData.unlock_price = unlock.item.unlock_price;
					unlockData.unlock_margin = unlock.unlock_margin;
					unlockData.price_change_reason = unlock.price_change_reason;
					 unlockData.total_diff = unlock.total_diff;
			});
					unlockData.unlock_date = record.unlock_date;



		if(unlockData.unlock_type == myJson.unlock_categories[number].unlock_type) {
			let newRow = document.createElement("tr");
			let newCell = document.createElement("td");
			newCell.appendChild(document.createTextNode(unlockData.invoice));
			newRow.appendChild(newCell);
			newCell.addEventListener('click',  function(){
                                        if(event.target.id == 0){
                                        	showInvoice(0);
						myBack++;
                                        }
                                        else if(event.target.id == 1){
                                                showInvoice(1);
						myBack++;
                                        }
                                        else if(event.target.id == 2){
                                                showInvoice(2);
						myBack++;
                                        }
                                        else if(event.target.id == 3){
                                                showInvoice(3);
						myBack++;
                                        }
                                        else{
                                                alert("There is no data for this object");
                                        }
				})
			 let newCellA = document.createElement("td");
                        newCellA.appendChild(document.createTextNode(unlockData.salesid));
                        newRow.appendChild(newCellA);
			 let newCellB = document.createElement("td");
                        newCellB.appendChild(document.createTextNode(unlockData.loginid));
                        newRow.appendChild(newCellB);
			 let newCellC = document.createElement("td");
                        newCellC.appendChild(document.createTextNode(unlockData.firstName));
                        newRow.appendChild(newCellC);
			 let newCellD = document.createElement("td");
                        newCellD.appendChild(document.createTextNode(unlockData.lastName));
                        newRow.appendChild(newCellD);
			 document.getElementById("table_id").appendChild(newRow);
		}
		});

	});
                $(document).ready(function() {
                       $('#table_id').DataTable();
		});
	}
      }
   }

 $("#thing").show();
 $("#thing-name").show();
 $("#things").hide();
 $("#hw-title").hide();
 $("#hw-title2").show();
 $("#cal").hide();
 myBack = 1;
 localStorage.setItem("backFlag", 1);
 console.log(urllink);
 xhttp.open("GET", urllink, true);
 xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
 xhttp.send(null);


}


// populates the things div's table..
function showUnlockCategories(response) {
 var storenumber = localStorage.getItem("storenumber");
 localStorage.setItem("backFlag", 0);
 var reportListData = "";
 var typeID = 0;
$.each( response.summary, function( key, details ) {
	var thingCount = 0;
        let newRow = document.createElement("tr");
        let newCell = document.createElement("td");
	newCell.setAttribute("id", typeID);
	typeID ++;
        newCell.appendChild(document.createTextNode(details.unlType));
	let newCellA = document.createElement("td");
	newCellA.appendChild(document.createTextNode(details.total));
	let newCellB = document.createElement("td");
        newCellB.appendChild(document.createTextNode(details.unlock));
	let newCellC = document.createElement("td");
        newCellC.appendChild(document.createTextNode(details.unlockPercent));
        newRow.appendChild(newCell);
	newRow.appendChild(newCellA);
	newRow.appendChild(newCellB);
	newRow.appendChild(newCellC);
        document.getElementById("sumBod").appendChild(newRow);

});
var unlID = 0;
$.each( response.unlock_categories, function( key, details ) {
		let typeRow = document.createElement("tr");
		let typeCell = document.createElement("td");
		typeCell.setAttribute("id", unlID);
		unlID ++;
		 typeCell.addEventListener('click',  function(){
			if(event.target.id == 0){
                        showThing(0);
			myBack++;
                }
                else if(event.target.id == 1){
                        showThing(1);
			myBack++;
                }
                else if(event.target.id == 2){
                        showThing(2);
			myBack++;
                }
                else if(event.target.id == 3){
                        showThing(3);
			myBack++;
                }
                else{
                        alert("There is no data for this object");
                }

		})

		typeCell.appendChild(document.createTextNode(details.unlock_type));

		typeRow.appendChild(typeCell);
		document.getElementById("typeBod").appendChild(typeRow);
	});
document.getElementById("hw-title").innerHTML = "Unlock Report" + "<br>" + "Store: " + myJson.store.store + " Date: " + myJson.store.business_date;
myBack = 0;
}
function readJsonFile(filename){
 var xobj = new XMLHttpRequest();
 xobj.overrideMimeType("application/json");
 xobj.open('GET', filename, true);
 xobj.onreadystatechange = function() {
   if (xobj.readyState == 4 && xobj.status == "200") {
     // .open will NOT return a value but simply returns undefined in async mode so use a callback
     callback(xobj.responseText);
   }else{
     if(xobj.readyState == 4){
       // error reading file
     }
   }
 };
 xobj.send(null);
}


// ignore, but this is how you would show the modal if you were so inclined; assuming you had something to pass into the modal to populate its content..
function showImage(myString, desc, item, model, vbu) {
 var thisDesc = desc;
 var thisItem = item;
 var thisModel = model;
 var pickItem = item * -1;
 localStorage.setItem("pickItem", pickItem);
 localStorage.setItem("pickModel", thisModel);
 localStorage.setItem("pickVbu", vbu);

 $("#endeca-desc").html("<strong><font size=\"3\">&nbsp&nbsp&nbsp" + thisDesc + "</font></strong>");

 $("#endeca-item-model").html("<font size=\"2\" color=\"grey\"><strong>&nbsp&nbsp&nbsp&nbspItem # </strong>" + thisItem + "<strong> Model # </strong>" + thisModel
 + "</font>");

 $("#img-modal-img").html("<img src='" + myString + "' style=\"height:20em;\" >");

 $("#imgDisplay").modal("toggle");
}
