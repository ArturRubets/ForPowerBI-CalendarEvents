"use strict";

var events = [{
  start: new Date(2021, 9, 6),
  finish: new Date(2021, 10, 2),
  description: 'Big Sale Promotion'
}, {
  start: new Date(2021, 9, 6),
  finish: new Date(2021, 9, 8),
  description: '30% OFF'
}, {
  start: new Date(2021, 10, 6),
  finish: new Date(2021, 10, 18),
  description: '40% OFF'
}, {
  start: new Date(2021, 9, 15),
  finish: new Date(2021, 9, 21),
  description: '50% OFF'
}, {
  start: new Date(2021, 9, 18),
  finish: new Date(2021, 9, 23),
  description: '60% OFF'
}];

function randDarkColor() {
  var lum = -0.25;
  var hex = String('#' + Math.random().toString(16).slice(2, 8).toUpperCase()).replace(/[^0-9a-f]/gi, '');

  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  var rgb = "#",
      c,
      i;

  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }

  return rgb;
}

events.forEach(function (e) {
  var color = randDarkColor();
  e.colorStartAndFinish = color;
  e.colorDays = color;
});
var $calendar = "\n<div class=\"month-year\">\n    <div class=\"arrow-wrap prev\">\n       \n        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-arrow-left\" viewBox=\"0 0 16 16\">\n  <path fill-rule=\"evenodd\" d=\"M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z\"/>\n</svg>\n    </div>\n    <div class=\"month\">\n        <h1></h1>\n    </div>\n    <div class=\"year\">\n        <h1></h1>\n    </div>     \n    <div class=\"arrow-wrap next\">\n    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-arrow-right\" viewBox=\"0 0 16 16\">\n    <path fill-rule=\"evenodd\" d=\"M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z\"/>\n  </svg>\n    </div>           \n</div>\n<div class=\"weekdays\">\n    <div>M</div>\n    <div>T</div>\n    <div>W</div>\n    <div>T</div>\n    <div>F</div>\n    <div>S</div>\n    <div>S</div>\n</div>\n<div class=\"days\">\n</div>\n";

function quantityEventsOnStart(date) {
  var d = new Date(date);
  var e = events.filter(function (e) {
    return equalDate(e.start, d);
  });
  return e.length;
}

function quantityEventsOnFinish(date) {
  var d = new Date(date);
  var e = events.filter(function (e) {
    return equalDate(e.finish, d);
  });
  return e.length;
} //поиск дат для отрисовки описания события(ивента)


function getDatesForDescription(event, indexEvent, filterEvents, firstDateOnCalendar) {
  var dateCurrentEvent = event.start < firstDateOnCalendar ? new Date(firstDateOnCalendar) : new Date(event.start);
  var daysSuitable = [];

  do {
    var flag = false;

    if (equalDate(dateCurrentEvent, event.finish) || equalDate(dateCurrentEvent, event.start)) {
      // не рисуем описание события в дате начала и конца события, потому что там синий полукруг и день месяца
      flag = true;
    }

    if (equalDate(dateCurrentEvent, new Date(new Date().toDateString()))) {
      // не рисуем описание события при текущем дне, потому что там красный круг
      flag = true;
    }

    for (var i = 0; i < filterEvents.length; i++) {
      if (filterEvents[i] != event && (equalDate(dateCurrentEvent, filterEvents[i].start) || equalDate(dateCurrentEvent, filterEvents[i].finish))) {
        // не рисуем описание события в начале или конце событий
        flag = true;
      }
    }

    if (daysSuitable[daysSuitable.length - 1]) {
      var day1 = daysSuitable[daysSuitable.length - 1].getDay() === 0 ? 7 : daysSuitable[daysSuitable.length - 1].getDay();
      var day2 = dateCurrentEvent.getDay() === 0 ? 7 : dateCurrentEvent.getDay();

      if (!(day1 < day2)) {
        //Предыдущий добавленный элемент и текущий перебираемый находятся на одной недели, 
        flag = true;
      }
    }

    if (flag) {
      if (daysSuitable.length > 0) {
        //если даты для отрисовки уже есть, а флаг оказался true тогда конец поиска
        return daysSuitable;
      }

      dateCurrentEvent = addDay(dateCurrentEvent, 1);
      continue;
    } //если все условия прошли тогда добавить день как подходящий для расположения текста


    daysSuitable.push(new Date(dateCurrentEvent));
    dateCurrentEvent = addDay(dateCurrentEvent, 1);
  } while (dateCurrentEvent < event.finish);

  return daysSuitable;
}

function equalDate(date1, date2) {
  return date1.getTime() === date2.getTime();
}

function addDay(date, quantityDays) {
  var newObj = new Date(date); // Округление до даты  

  return new Date(new Date(newObj.setDate(newObj.getDate() + quantityDays)).toDateString());
}

function filterAndSortEvents(start, finish) {
  var eventsFind = [];
  events.forEach(function (event) {
    if (event.start <= finish && event.finish >= start) {
      eventsFind.push(event);
    }
  });
  return eventsFind.sort(function (a, b) {
    if (equalDate(a.start, b.start)) {
      return b.finish - a.finish;
    } else {
      return a.start - b.start;
    }
  });
}

function getNodeCalendar($days, findDate) {
  var shiftMonth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var $resultNode;

  if (shiftMonth <= -1) {
    $days.forEach(function (d) {
      if (d.classList.contains('prev-date')) {
        if (+d.innerHTML === findDate.getDate()) {
          $resultNode = d;
        }
      }
    });
  } else if (shiftMonth >= 1) {
    $days.forEach(function (d) {
      if (d.classList.contains('next-date')) {
        if (+d.innerHTML === findDate.getDate()) {
          $resultNode = d;
        }
      }
    });
  } else {
    $days.forEach(function (d) {
      if (!['next-date', 'prev-date'].some(function (className) {
        return d.classList.contains(className);
      })) {
        if (+d.innerHTML === findDate.getDate()) {
          $resultNode = d;
        }
      }
    });
  }

  if (!$resultNode) {
    return;
  }

  return $resultNode;
}

function getShift(currentDate) {
  if (currentDate.getMonth() === date.getMonth()) {
    return 0;
  } else if (+new Date(currentDate.getFullYear(), currentDate.getMonth()) > +new Date(date.getFullYear(), date.getMonth())) {
    return 1;
  } else return -1;
}

function firstDateOnCalendar($calendar) {
  var $node = $calendar[0];

  if ($node.classList.contains('prev-date')) {
    return new Date(date.getFullYear(), date.getMonth() - 1, $node.innerHTML);
  } else {
    return new Date(date.getFullYear(), date.getMonth(), $node.innerHTML);
  }
}

function lastDateOnCalendar($calendar) {
  var $node = $calendar[$calendar.length - 1];

  if ($node.classList.contains('next-date')) {
    return new Date(date.getFullYear(), date.getMonth() + 1, $node.innerHTML);
  } else {
    return new Date(date.getFullYear(), date.getMonth(), $node.innerHTML);
  }
}

function today($calendar, date) {
  $calendar.querySelectorAll(".days div:not(.next-date, .prev-date)").forEach(function ($n) {
    var day = +$n.innerHTML;

    if (equalDate(new Date(date.getFullYear(), date.getMonth(), day), new Date(new Date().toDateString()))) {
      var _$n$getBoundingClient = $n.getBoundingClientRect(),
          top = _$n$getBoundingClient.top,
          left = _$n$getBoundingClient.left,
          width = _$n$getBoundingClient.width,
          height = _$n$getBoundingClient.height;

      console.log($n.getBoundingClientRect());
      var $square = document.createElement('div');
      $square.classList.add('today');
      $square.style.top = top + 'px';
      $square.style.left = left + 'px';
      $square.style.width = width + 'px';
      $square.style.height = height + 'px';
      var $circle = document.createElement('div');
      $circle.innerHTML = $n.innerHTML;
      $circle.style.width = height / 1 + 'px';
      $circle.style.height = height / 1 + 'px';
      $square.appendChild($circle);
      $calendar.appendChild($square);
    }
  });
}

function setEvents(date, $main) {
  var $deleteContent = document.querySelector('.events');

  if ($deleteContent) {
    $deleteContent.remove();
  }

  var $calendar = $main;
  var $days = $calendar.querySelectorAll('.days div');
  var firstDate = firstDateOnCalendar($days);
  var lastDate = lastDateOnCalendar($days);
  var eventsFiltes = filterAndSortEvents(firstDate, lastDate);

  if (eventsFiltes.length <= 0) {
    return;
  }

  var $events = document.createElement('div');
  $events.classList.add('events');
  $calendar.appendChild($events); //рисую ивент

  eventsFiltes.forEach(function (e, i) {
    var $event = document.createElement('div');
    $events.appendChild($event);
    var finishCycle = e.finish <= lastDate ? e.finish : lastDate;
    var currentDate = e.start >= firstDate ? new Date(e.start) : firstDate;

    do {
      var shift = getShift(currentDate);
      var $dateCalendar = getNodeCalendar($days, new Date(currentDate), shift);

      var _$dateCalendar$getBou = $dateCalendar.getBoundingClientRect(),
          top = _$dateCalendar$getBou.top,
          left = _$dateCalendar$getBou.left,
          width = _$dateCalendar$getBou.width,
          height = _$dateCalendar$getBou.height;

      var $dateEvent = document.createElement('div');
      $event.appendChild($dateEvent);
      $dateEvent.style.top = top + 'px';
      $dateEvent.style.left = left + 'px';
      $dateEvent.style.width = width + 'px';
      $dateEvent.style.height = height + 'px';
      $dateEvent.setAttribute('data-date', currentDate.toDateString());

      if (currentDate.getTime() === e.start.getTime()) {
        $dateEvent.classList.add('event-start');

        if (quantityEventsOnFinish(currentDate) >= 1) {
          $dateEvent.classList.add('event-finish');
        }

        $dateEvent.innerHTML = "<span>".concat($dateCalendar.innerHTML, "</span>");
        $dateEvent.style.backgroundColor = e.colorStartAndFinish;
      }

      if (currentDate.getTime() === e.finish.getTime()) {
        $dateEvent.classList.add('event-finish');

        if (quantityEventsOnStart(currentDate) >= 1) {
          $dateEvent.classList.add('event-start');
        }

        $dateEvent.innerHTML = "<span>".concat($dateCalendar.innerHTML, "</span>");
        $dateEvent.style.backgroundColor = e.colorStartAndFinish;
      }

      if (eventsFiltes.filter(function (event, index) {
        return index < i;
      }).map(function (e) {
        return e.finish.getTime();
      }).includes(currentDate.getTime())) {
        //Делаем прозрачность текущему событию если предыдущее заканчивается в период текущего
        $dateEvent.style.opacity = 0;
      }

      if (currentDate.getTime() != e.finish.getTime() && currentDate.getTime() != e.start.getTime()) {
        $dateEvent.classList.add('event');
        $dateEvent.style.backgroundColor = e.colorDays;
      }

      currentDate = addDay(currentDate, 1);
    } while (currentDate <= finishCycle);
  }); //Пишу описание ивента

  eventsFiltes.forEach(function (e, i) {
    var $event = $calendar.querySelectorAll('.events > div')[i];
    var $eventsCalendar = $event.querySelectorAll('div');
    var daysSuitable = getDatesForDescription(e, i, eventsFiltes, firstDate);

    if (daysSuitable.length <= 0) {
      return;
    }

    var $startNodeForDescription,
        flag = true;
    $eventsCalendar.forEach(function (d) {
      if (daysSuitable.map(function (d) {
        return d.toDateString();
      }).includes(d.dataset.date)) {
        if (flag) {
          $startNodeForDescription = d;
          flag = false;
        }
      }
    });
    var $description = document.createElement('div');
    $description.classList.add('description');
    $event.appendChild($description);

    var _$startNodeForDescrip = $startNodeForDescription.getBoundingClientRect(),
        top = _$startNodeForDescrip.top,
        left = _$startNodeForDescrip.left,
        width = _$startNodeForDescrip.width,
        height = _$startNodeForDescrip.height;

    $description.style.position = 'absolute';
    $description.style.top = top + 'px';
    $description.style.left = left + 'px';
    $description.style.width = width * daysSuitable.length + 'px';
    $description.style.height = height + 'px';
    $description.innerHTML = e.description;

    if (daysSuitable.length === 1) {
      $description.setAttribute('data-size', 'small');
    }
  });
}

var renderCalendar = function renderCalendar(date, $main) {
  date.setDate(1);
  var monthDays = $main.querySelector('.days');
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  var prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  var firstDayIndex = (date.getDay() === 0 ? 7 : date.getDay()) - 1;
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  $main.querySelector('.month h1').innerHTML = months[date.getMonth()];
  $main.querySelector('.year h1').innerHTML = date.getFullYear();
  var days = '';

  for (var x = firstDayIndex; x > 0; x--) {
    var day = prevLastDay - x + 1;
    days += "<div class='prev-date'>".concat(day, "</div>");
  }

  for (var i = 1; i <= lastDay; i++) {
    days += "<div>".concat(i, "</div>");
  }

  var dayOfWeekEndMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
  var daysNextMonth = 7 - (dayOfWeekEndMonth === 0 ? 7 : dayOfWeekEndMonth);

  for (var _i = 1; _i <= daysNextMonth; _i++) {
    days += "<div class='next-date'>".concat(_i, "</div>");
  }

  monthDays.innerHTML = days;
  var $today = monthDays.parentNode.querySelector('.today');

  if ($today) {
    $today.remove();
  }

  today(monthDays.parentNode, date);
};

function flow(date, $main) {
  renderCalendar(date, $main);
  setEvents(date, $main);
}

var startUp = function startUp(date, param) {
  var $main = document.createElement('div');
  $main.classList.add('calendar');
  $main.innerHTML = $calendar;
  $main.style.left = param.left;
  $main.style.top = param.top;
  $main.style.height = param.height;
  $main.style.width = param.width;
  document.querySelector('.container').appendChild($main);
  flow(date, $main);
  $main.querySelector('.prev').addEventListener('click', function () {
    date.setMonth(date.getMonth() - 1);
    flow(date, $main);
  });
  $main.querySelector('.next').addEventListener('click', function () {
    date.setMonth(date.getMonth() + 1);
    flow(date, $main);
  });
};

var date = new Date();
var param = {
  left: '60%',
  top: '20%',
  height: '80%',
  width: '40%'
};
startUp(date, param);
var date2 = new Date();
var param2 = {
  left: '15%',
  top: '20%',
  height: '80%',
  width: '40%'
}; // startUp(date2, param2)