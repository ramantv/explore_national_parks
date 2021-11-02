var burgerEl = document.querySelector(".burger");
var homeBtnEl = document.querySelector("#home-button");

var pageHeadingEl = document.querySelector("#page-heading");

var bodySectionEl = document.querySelector("#body-section");
var stateSectionEl = document.querySelector("#state-section");
var parkSelectorEl = document.querySelector("#park-selector");

var parks = []; // to hold the data returned from the NPS API call

function onStateSelectionChange() {
  var stateCode = $(this).val();
  var stateName = $(this).find("option:selected").text();
  pageHeadingEl.innerHTML = "Explore " + stateName;

  bodySectionEl.classList.toggle("is-hidden");
  stateSectionEl.classList.toggle("is-hidden");

  fetchNPsForState(stateCode)
    .then((parksInState) => {
      console.log(
        "Number of Parks in " + stateName + " " + parksInState.data.length
      );

      parks = parksInState;
      buildParksSelector(parksInState.data);
      parkSelectorEl.classList.toggle("is-hidden");
    })
    .catch((err) => {
      console.log("Error: ", err.message);
    });
}

function buildParksSelector(pd) {
  $("#national-park").empty();

  $("#national-park").append(
    $("<option>", {
      value: -1,
      text: "Select a Park...",
    })
  );

  $.each(pd, function (i, park) {
    $("#national-park").append(
      $("<option>", {
        value: i,
        text: park.fullName,
      })
    );
  });
}

function onParkSelectionChange() {
  var idx = $(this).val();
  var name = $(this).find("option:selected").text();
  console.log("Selected Park Index = " + idx);
  console.log("Selected Park Name = " + name);

  $("#park-name").html(parks.data[idx].fullName);

  $("#park-description").html(parks.data[idx].description);

  $("#park-pic").attr("src", parks.data[idx].images[0].url);

  $("#park-address").html(getParkAddress(parks.data[idx].addresses));

  var parkEmail = getParkEmail(parks.data[idx].contacts);
  $("#park-email").html(parkEmail);

  var parkMapUrl = getMapLink(
    parks.data[idx].latitude,
    parks.data[idx].longitude
  );
  $("#park-map-link").attr("href", parkMapUrl);

  $("#park-hours").html(getParkHours(parks.data[idx].operatingHours));

  var parkPhone = getParkPhone(parks.data[idx].contacts);
  $("#park-phone").html(parkPhone);
  $("#park-website-link").attr("href", parks.data[idx].url);

  var parkActivities = getParkActivities(parks.data[idx].activities);
  $("#park-activities").html(parkActivities);

  $("#park-designation").html(parks.data[idx].designation);
}

function getParkEmail(contacts) {
  var email = contacts.emailAddresses[0].emailAddress;
  return email;
}

function getParkPhone(contacts) {
  var phone = formatPhoneNumber(contacts.phoneNumbers[0].phoneNumber);
  if (contacts.phoneNumbers[0].extension) {
    phone += " x" + contacts.phoneNumbers[0].extension;
  }
  return phone;
}

function getParkHours(hours) {
  var hoursString = hours[0].description + "<br>";
  hoursString += "Standard Hours: <br>";
  hoursString += JSON.stringify(hours[0].standardHours) + "<br>";
  hoursString +=
    "For closures/exceptions visit National Park Website." + "<br>";
  return hoursString;
}

function getParkActivities(acts) {
  var parkActs = "";
  for (let i = 0; i < acts.length; i++) {
      parkActs += ((parkActs)?(", " + acts[i].name ):(acts[i].name ));
  }
  return parkActs;
}

function getParkAddress(addresses) {
  let i = 0;
  var addr = "";
  console.log(addresses);

  while (i < addresses.length) {
    if (addresses[i].type === "Physical") {
      addr += addresses[i].line1 + "<br>";
      if (addresses[i].line2) {
        addr += addresses[i].line2 + "<br>";
      }
      if (addresses[i].line3) {
        addr += addresses[i].line3 + "<br>";
      }
      addr +=
        addresses[i].city +
        " " +
        addresses[i].stateCode +
        " " +
        addresses[i].postalCode +
        "<br>";
      break;
    }
  }
  console.log(addr);
  return addr;
}

function getMapLink(lat, lon) {
  return encodeURI("http://maps.google.com/maps?q=" + lat + "," + lon + "&t=h");
}

function onTopMenuButtonClick() {
  window.location.reload();
}

$(document).ready(function () {
  var pageHeading = "Explore National Parks";
  pageHeadingEl.innerHTML = pageHeading;

  // Home button click handler.
  $("#home-button").on("click", onTopMenuButtonClick);

  // States dropdown handler
  $("#state").on("change", onStateSelectionChange);

  // States dropdown handler
  $("#national-park").on("change", onParkSelectionChange);
});

/*
http://maps.google.com/maps?q=38.44023613,-96.5670822&t=h

38.44023613
-96.5670822

*/
