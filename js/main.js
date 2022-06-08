'use strict';

// Render the cinema (7x15 with middle path)
// implement the Seat selection flow
// Popup shows the seat identier - e.g.: 3-5 or 7-15
// Popup should contain seat price (for now 4$ to all)
// Allow booking the seat ('S', 'X', 'B')
// Uplift your model - each seat should have its own price...
// In seat details, show available seats around

var gElSelectedSeat = null;
var gCinema = createCinema();
renderCinema();

function createCinema() {
  var cinema = [];
  for (var i = 0; i < 7; i++) {
    cinema[i] = [];
    for (var j = 0; j < 15; j++) {
      var cell = {
        type: j === 7 ? 'EMPTY' : 'SEAT',
      };
      if (cell.type === 'SEAT') {
        (cell.price = 2 + i), (cell.isBooked = false);
      }

      cinema[i][j] = cell;
    }
  }
  cinema[3][3].isBooked = true;
  return cinema;
}
function renderCinema() {
  var strHTML = '';
  for (var i = 0; i < gCinema.length; i++) {
    strHTML += `<tr class="cinema-row" >\n`;
    for (var j = 0; j < gCinema[0].length; j++) {
      var cell = gCinema[i][j];

      // For cell of type SEAT add seat class
      var className = cell.type === 'SEAT' ? 'seat' : '';
      if (cell.isBooked) className += ' booked';
      // Add a seat title
      var title = cell.type === 'SEAT' ? `Seat: ${i}, ${j}` : '';

      // For cell that is booked add booked class

      strHTML += `\t<td class="cell ${className}" title="${title}"
                            onclick="cellClicked(this, ${i}, ${j})" >
                         </td>\n`;
    }
    strHTML += `</tr>\n`;
  }

  var elSeats = document.querySelector('.cinema-seats');
  elSeats.innerHTML = strHTML;
}
function cellClicked(elCell, i, j) {
  var cell = gCinema[i][j];

  // Ignore none seats and booked
  if (cell.type !== 'SEAT' || cell.isBooked) return;
  console.log('Cell clicked: ', elCell, i, j);
  elCell.classList.toggle('selected');

  if (gElSelectedSeat) {
    gElSelectedSeat.classList.remove('selected');
  }
  // Only a single seat should be selected
  // Support Unselecting a seat
  gElSelectedSeat = gElSelectedSeat !== elCell ? elCell : null;
  // When seat is selected a popup is shown
  if (gElSelectedSeat) showSeatDetails({ i: i, j: j });
  else hideSeatDetails();
}

function showSeatDetails(pos) {
  const seat = gCinema[pos.i][pos.j];
  const elPopup = document.querySelector('.popup');
  elPopup.querySelector('h2 span').innerText = `${pos.i} - ${pos.j}`;
  elPopup.querySelector('h3 span').innerText = `$${seat.price}`;
  elPopup.querySelector('h4 span').innerText = getSeatsAroundCount(pos);
  const elBtn = elPopup.querySelector('button');
  elBtn.dataset.i = pos.i;
  elBtn.dataset.j = pos.j;
  elPopup.hidden = false;
}
function hideSeatDetails() {
  document.querySelector('.popup').hidden = true;
}

function getSeatsAroundCount(pos) {
  var availableSeats = 0;
  for (let i = pos.i - 1; i < pos.i + 2; i++) {
    for (let j = pos.j - 1; j < pos.j + 2; j++) {
      if (
        i < 0 ||
        i >= gCinema.length ||
        j < 0 ||
        j >= gCinema[i].length ||
        (i === pos.i && j === pos.j)
      )
        continue;
      console.log(gCinema[i][j]);
      if (gCinema[i][j].type === 'SEAT' && !gCinema[i][j].isBooked)
        availableSeats++;
    }
  }
  return availableSeats;
}

function bookSeat(elBtn) {
  console.log('Booking seat, button: ', elBtn);
  var i = +elBtn.dataset.i;
  var j = +elBtn.dataset.j;

  // book the seat
  gCinema[i][j].isBooked = true;
  renderCinema();
  unSelectSeat();
}

function unSelectSeat() {
  gElSelectedSeat.classList.remove('selected');
  hideSeatDetails();
}
