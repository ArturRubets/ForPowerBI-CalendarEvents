const date = new Date()
const events = [
    { start: new Date(2020, 9, 2), finish: new Date(2021, 10, 2), description: 'Big Sale Promotion' }
    , { start: new Date(2021, 9, 6), finish: new Date(2021, 9, 8), description: '30% OFF' }
    , { start: new Date(2021, 10, 6), finish: new Date(2021, 10, 18), description: '40% OFF' }
    , { start: new Date(2021, 9, 15), finish: new Date(2021, 9, 21), description: '50% OFF' }
    , { start: new Date(2021, 9, 18), finish: new Date(2021, 9, 23), description: '60% OFF' }
]

function randDarkColor() {
    var lum = -0.25;
    var hex = String('#' + Math.random().toString(16).slice(2, 8).toUpperCase()).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    var rgb = "#",
        c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }
    return rgb;
}

events.forEach(e => {
    const color = randDarkColor()
    e.colorStartAndFinish = color
    e.colorDays = color
})

const renderCalendar = () => {
    function today($calendar) {
        document.querySelectorAll('.days div:not(.next-date, .prev-date)').forEach($n => {
            const day = +$n.innerHTML
            if (equalDate(new Date(date.getFullYear(), date.getMonth(), day), new Date(new Date().toDateString()))) {
                const { top, left, width, height } = $n.getBoundingClientRect()
                const $square = document.createElement('div')
                $square.classList.add('today')

                $square.style.top = top + 'px'
                $square.style.left = left + 'px'
                $square.style.width = width + 'px'
                $square.style.height = height + 'px'

                const $circle = document.createElement('div')
                $circle.innerHTML = $n.innerHTML
                $circle.style.width = height / 1 + 'px'
                $circle.style.height = height / 1 + 'px'
                $square.appendChild($circle)

                $calendar.appendChild($square)
            }
        })
    }

    date.setDate(1)

    const monthDays = document.querySelector('.days')

    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

    const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate()

    const firstDayIndex = (date.getDay() === 0 ? 7 : date.getDay()) - 1

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]

    document.querySelector('.month h1').innerHTML = months[date.getMonth()]
    document.querySelector('.year h1').innerHTML = date.getFullYear()
    let days = ''
    for (let x = firstDayIndex; x > 0; x--) {
        const day = prevLastDay - x + 1
        days += `<div class='prev-date'>${day}</div>`
    }


    for (let i = 1; i <= lastDay; i++) {
        days += `<div>${i}</div>`
    }

    const dayOfWeekEndMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay()
    const daysNextMonth = 7 - (dayOfWeekEndMonth === 0 ? 7 : dayOfWeekEndMonth)

    for (let i = 1; i <= daysNextMonth; i++) {
        days += `<div class='next-date'>${i}</div>`
    }
    monthDays.innerHTML = days

    const $today = monthDays.parentNode.querySelector('.today')
    if ($today) {
        $today.remove()
    }
    today(monthDays.parentNode)
}

const renderCalendarAndEvents = () => {
    renderCalendar()
    setEvents()
}

document.querySelector('.prev').addEventListener('click', () => {
    date.setMonth(date.getMonth() - 1)
    renderCalendarAndEvents()
})

document.querySelector('.next').addEventListener('click', () => {
    date.setMonth(date.getMonth() + 1)
    renderCalendarAndEvents()
})

renderCalendarAndEvents()

function setEvents() {
    const $deleteContent = document.querySelector('.events')
    if ($deleteContent) {
        $deleteContent.remove()
    }

    const $calendar = document.querySelector('.calendar')
    const $days = $calendar.querySelectorAll('.days div')

    const firstDate = firstDateOnCalendar($days)
    const lastDate = lastDateOnCalendar($days)

    const eventsFiltes = filterAndSortEvents(firstDate, lastDate)
    if (eventsFiltes.length <= 0) {
        return
    }

    const $events = document.createElement('div')
    $events.classList.add('events')
    $calendar.appendChild($events)
    //рисую ивент
    eventsFiltes.forEach((e, i) => {
        const $event = document.createElement('div')
        $events.appendChild($event)

        const finishCycle = e.finish <= lastDate ? e.finish : lastDate
        let currentDate = e.start >= firstDate ? new Date(e.start) : firstDate
debugger
        do {
            let shift = getShift(currentDate)
            const $dateCalendar = getNodeCalendar($days, new Date(currentDate), shift)
            const { top, left, width, height } = $dateCalendar.getBoundingClientRect()
            const $dateEvent = document.createElement('div')
            $event.appendChild($dateEvent)

            $dateEvent.style.position = 'absolute'
            $dateEvent.style.top = top + 'px'
            $dateEvent.style.left = left + 'px'
            $dateEvent.style.width = width + 'px'
            $dateEvent.style.height = height + 'px'

            $dateEvent.setAttribute('data-date', currentDate.toDateString())

            if (currentDate.getTime() === e.start.getTime()) {
                $dateEvent.classList.add('event-start')
                if (quantityEventsOnFinish(currentDate) >= 1) {
                    $dateEvent.classList.add('event-finish')
                }
                $dateEvent.innerHTML = `<span>${$dateCalendar.innerHTML}</span>`
                $dateEvent.style.backgroundColor = e.colorStartAndFinish
            }
            if (currentDate.getTime() === e.finish.getTime()) {
                $dateEvent.classList.add('event-finish')
                if (quantityEventsOnStart(currentDate) >= 1) {
                    $dateEvent.classList.add('event-start')
                }
                $dateEvent.innerHTML = `<span>${$dateCalendar.innerHTML}</span>`
                $dateEvent.style.backgroundColor = e.colorStartAndFinish
            }
            if (eventsFiltes.filter((event, index) => index < i).map(e => e.finish.getTime()).includes(currentDate.getTime())) {
                //Делаем прозрачность текущему событию если предыдущее заканчивается в период текущего
                $dateEvent.style.opacity = 0
            }

            if (currentDate.getTime() != e.finish.getTime() && currentDate.getTime() != e.start.getTime()) {
                $dateEvent.classList.add('event')
                $dateEvent.style.backgroundColor = e.colorDays
            }

            currentDate = addDay(currentDate, 1)
        } while (currentDate <= finishCycle)
    })

    //Пишу описание ивента
    eventsFiltes.forEach((e, i) => {
        const $event = $calendar.querySelectorAll('.events > div')[i]
        const $eventsCalendar = $event.querySelectorAll('div')

        const daysSuitable = getDatesForDescription(e, i, eventsFiltes, firstDate)
        if (daysSuitable.length <= 0) {
            return
        }

        let $startNodeForDescription, flag = true
        $eventsCalendar.forEach(d => {
            if (daysSuitable.map(d => d.toDateString()).includes(d.dataset.date)) {
                if (flag) {
                    $startNodeForDescription = d
                    flag = false
                }
            }
        })

        const $description = document.createElement('div')
        $description.classList.add('description')
        $event.appendChild($description)

        const { top, left, width, height } = $startNodeForDescription.getBoundingClientRect()

        $description.style.position = 'absolute'
        $description.style.top = top + 'px'
        $description.style.left = left + 'px'
        $description.style.width = width * daysSuitable.length + 'px'
        $description.style.height = height + 'px'
        $description.innerHTML = e.description
        if (daysSuitable.length === 1) {
            $description.setAttribute('data-size', 'small')
        }
    })
}

function quantityEventsOnStart(date) {
    const d = new Date(date)
    const e = events.filter(e => equalDate(e.start, d))
    return e.length
}

function quantityEventsOnFinish(date) {
    const d = new Date(date)
    const e = events.filter(e => equalDate(e.finish, d))
    return e.length
}

//поиск дат для отрисовки описания события(ивента)
function getDatesForDescription(event, indexEvent, filterEvents, firstDateOnCalendar) {
    let dateCurrentEvent = event.start < firstDateOnCalendar ? new Date(firstDateOnCalendar) : new Date(event.start)
    let daysSuitable = []

    do {
        let flag = false

        if (equalDate(dateCurrentEvent, event.finish) || equalDate(dateCurrentEvent, event.start)) {
            // не рисуем описание события в дате начала и конца события, потому что там синий полукруг и день месяца
            flag = true
        }

        if (equalDate(dateCurrentEvent, new Date(new Date().toDateString()))) {
            // не рисуем описание события при текущем дне, потому что там красный круг
            flag = true
        }

        for (let i = 0; i < filterEvents.length; i++) {
            if (filterEvents[i] != event && (equalDate(dateCurrentEvent, filterEvents[i].start) || equalDate(dateCurrentEvent, filterEvents[i].finish))) {
                // не рисуем описание события в начале или конце событий
                flag = true
            }
        }

        if (daysSuitable[daysSuitable.length - 1]) {
            const day1 = daysSuitable[daysSuitable.length - 1].getDay() === 0 ? 7 : daysSuitable[daysSuitable.length - 1].getDay()
            const day2 = dateCurrentEvent.getDay() === 0 ? 7 : dateCurrentEvent.getDay()
            if (!(day1 < day2)) {
                //Предыдущий добавленный элемент и текущий перебираемый находятся на одной недели, 
                flag = true
            }
        }

        if (flag) {
            if (daysSuitable.length > 0) {
                //если даты для отрисовки уже есть, а флаг оказался true тогда конец поиска
                return daysSuitable
            }
            dateCurrentEvent = addDay(dateCurrentEvent, 1)
            continue
        }

        //если все условия прошли тогда добавить день как подходящий для расположения текста
        daysSuitable.push(new Date(dateCurrentEvent))
        dateCurrentEvent = addDay(dateCurrentEvent, 1)
    } while (dateCurrentEvent < event.finish)

    return daysSuitable
}

function equalDate(date1, date2) {
    return date1.getTime() === date2.getTime()
}

function addDay(date, quantityDays) {
    const newObj = new Date(date)
    // Округление до даты  
    return new Date(new Date(newObj.setDate(newObj.getDate() + quantityDays)).toDateString())
}

function filterAndSortEvents(start, finish) {
    let eventsFind = []
    events.forEach(event => {
        if (event.start <= finish && event.finish >= start) {
            eventsFind.push(event)
        }
    })

    return eventsFind.sort((a, b) => {
        if (equalDate(a.start, b.start)) {
            return b.finish - a.finish
        } else {
            return a.start - b.start
        }
    })
}

function getNodeCalendar($days, findDate, shiftMonth = 0) {
    let $resultNode

    if (shiftMonth <= -1) {
        $days.forEach(d => {
            if (d.classList.contains('prev-date')) {
                if (+d.innerHTML === findDate.getDate()) {
                    $resultNode = d
                }
            }
        })
    } else if (shiftMonth >= 1) {
        $days.forEach(d => {
            if (d.classList.contains('next-date')) {
                if (+d.innerHTML === findDate.getDate()) {
                    $resultNode = d
                }
            }
        })
    } else {
        $days.forEach(d => {
            if (!['next-date', 'prev-date'].some(className => d.classList.contains(className))) {
                if (+d.innerHTML === findDate.getDate()) {
                    $resultNode = d
                }
            }
        })
    }
    if (!$resultNode) {
        return
    }
    return $resultNode
}

function getShift(currentDate) {
    if (currentDate.getMonth() === date.getMonth()) {
        return 0
    }
    else if (+new Date(currentDate.getFullYear(), currentDate.getMonth())
        >
        +new Date(date.getFullYear(), date.getMonth())) {
        return 1
    }
    else return -1
}

function firstDateOnCalendar($calendar) {
    const $node = $calendar[0]
    if ($node.classList.contains('prev-date')) {
        return new Date(date.getFullYear(), date.getMonth() - 1, $node.innerHTML)
    } else {
        return new Date(date.getFullYear(), date.getMonth(), $node.innerHTML)
    }
}

function lastDateOnCalendar($calendar) {
    const $node = $calendar[$calendar.length - 1]
    if ($node.classList.contains('next-date')) {
        return new Date(date.getFullYear(), date.getMonth() + 1, $node.innerHTML)
    } else {
        return new Date(date.getFullYear(), date.getMonth(), $node.innerHTML)
    }
}