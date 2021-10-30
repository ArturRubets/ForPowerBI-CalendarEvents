const date = new Date()
const events = [
    { start: new Date(2021, 8, 7), finish: new Date(2021, 9, 10), description: 'Big Sale Promotion' }
    , { start: new Date(2021, 9, 5), finish: new Date(2021, 9, 20), description: '30% OFF' }
]

const renderCalendar = () => {
    function today() {
        document.querySelectorAll('.days div:not(.next-date, .prev-date)').forEach(n => {
            const day = +n.innerHTML
            if (day === new Date().getDate() && date.getMonth() === new Date().getMonth()) {
                n.classList.add('today')
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
    let days = '' //, quantityDiv = 0
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

    today()
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

    const eventsFiltes = filterEvents(firstDate, lastDate)

    if (eventsFiltes.length <= 0) {
        return
    }

    const $events = document.createElement('div')
    $events.classList.add('events')
    $calendar.appendChild($events)
    eventsFiltes.forEach((e, i) => {
        const $event = document.createElement('div')
        $events.appendChild($event)

        const finishCycle = e.finish <= lastDate ? e.finish : lastDate
        let currentDate = e.start >= firstDate ? new Date(e.start) : firstDate
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


            if (currentDate.getTime() === e.start.getTime()) {
                $dateEvent.classList.add('event-start')
                $dateEvent.innerHTML = `<span>${$dateCalendar.innerHTML}</span>`
            }
            if (currentDate.getTime() === e.finish.getTime()) {
                $dateEvent.classList.add('event-finish')
                $dateEvent.innerHTML = `<span>${$dateCalendar.innerHTML}</span>`
            }
            if (currentDate.getTime() != e.finish.getTime() && currentDate.getTime() != e.start.getTime()) {
                $dateEvent.classList.add('event')
            }

            currentDate = addDay(currentDate, 1)
        } while (currentDate <= finishCycle)
    })

    eventsFiltes.forEach((e, i) => {
        const $eventsCalendar = $calendar.querySelectorAll('.events > div')[i].querySelectorAll('div')

        const daysSuitable = getDatesForDescription(e, i, eventsFiltes, firstDate)
        console.log(daysSuitable);
        //const $suitableNodes = getNodesSuitableForDescription($eventsCalendar, i, firstDate, lastDate)

    })
}

function getDatesForDescription(event, indexEvent, filterEvents, firstDateOnCalendar) {
    let dateCurrentEvent = event.start < firstDateOnCalendar ? new Date(firstDateOnCalendar) : new Date(event.start)
    let daysSuitable = []

    do {

        if (equalDate(dateCurrentEvent, event.finish) || equalDate(dateCurrentEvent, event.start)) {
            dateCurrentEvent = addDay(dateCurrentEvent, 1)
            continue
        }

        //Текущая перебираемая дата  входит в период другого события 
        for (let i = indexEvent + 1; i < filterEvents.length; i++) {
            if (dateCurrentEvent >= filterEvents[i].start && dateCurrentEvent <= filterEvents[i].finish) {
                return daysSuitable
            }
        }

        //Предыдущий добавленный элемент и текущий перебираемый находятся на одной недели
        if (daysSuitable[daysSuitable.length - 1]) {
            const day1 = daysSuitable[daysSuitable.length - 1].getDay() === 0 ? 7 : daysSuitable[daysSuitable.length - 1].getDay()
            const day2 = dateCurrentEvent.getDay() === 0 ? 7 : dateCurrentEvent.getDay()
            if (!(day1 < day2)) {
                return daysSuitable
            }
        }

        //если все условия прошли тогда добавить день как подходящий для расположения текста
        daysSuitable.push(new Date(dateCurrentEvent))
        dateCurrentEvent = addDay(dateCurrentEvent, 1)
    } while (dateCurrentEvent < event.finish)

    return daysSuitable
}

function equalDate(date1, date2){
    return date1.getTime() === date2.getTime()
}

// function getNodesSuitableForDescription($eventsCalendar, indexEvent, firstDate, lastDate){
//     console.log($eventsCalendar);
//     const curEvent = events[indexEvent]
//     let curDate = curEvent.start >= firstDate ? new Date(curEvent.start) : firstDate 
//     const finishCycle = curEvent.finish <= lastDate ? curEvent.finish : lastDate

//     do{

//     }while(currentDate <= finishCycle)

// }

function addDay(date, quantityDays) {
    const newObj = new Date(date)
    return new Date(newObj.setDate(newObj.getDate() + quantityDays))
}

function filterEvents(start, finish) {
    let eventsFind = []
    events.forEach(event => {
        if (event.start <= finish && event.finish >= start) {
            eventsFind.push(event)
        }
    })
    return eventsFind.sort((a, b) => a.start - b.start)
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






// function setEvents() {
//     const $calendar = document.querySelector('.calendar')
//     const $days = $calendar.querySelectorAll('.days div')

//     const firstDate = firstDateOnCalendar($days)
//     const lastDate = lastDateOnCalendar($days)
//     debugger
//     const eventsFiltes = filterEvents(firstDate, lastDate)

//     if (eventsFiltes.length <= 0) {
//         return
//     }

//     const $events = document.createElement('div')
//     $events.classList.add('events')
//     $calendar.appendChild($events)
//     eventsFiltes.forEach((e, i) => {
//         const $event = document.createElement('div')
//         $events.appendChild($event)
//         $event.classList.add('event' + (i + 1))
//     debugger
//         let currentDate = new Date(e.start)        
//         let classList = e.start >= firstDate ? ['event-start'] : [];
//         const finishCycle = e.finish < lastDate? e.finish : lastDate
//         do {           
//             let shift = getShift(currentDate)
//             let $currentDate = getNodeCalendar($days, new Date(currentDate), shift)

//             if(!$currentDate){
//                 currentDate = new Date(firstDate)
//                 shift = getShift(currentDate)
//                 $currentDate = getNodeCalendar($days, new Date(currentDate), shift)
//             }

//             const paramRect = $currentDate.getBoundingClientRect()
//             if (endWeek(new Date(currentDate)) < e.finish) {
//                 const quantityDays = (1 + untilEndWeek(new Date(currentDate)))
//                 drawDiv(paramRect.top,
//                     paramRect.left,
//                     paramRect.width * quantityDays,
//                     paramRect.height,
//                     $event,
//                     classList
//                 )
//                 currentDate.setDate(currentDate.getDate() + quantityDays)
//                 classList = []
//             } else {
//                 const quantityDays = (differenceInDays(new Date(e.finish), new Date(currentDate)) + 1)
//                 drawDiv(paramRect.top,
//                     paramRect.left,
//                     paramRect.width * quantityDays,
//                     paramRect.height,
//                     $event,
//                     [...classList, 'event-finish']
//                 )
//                 currentDate.setDate(currentDate.getDate() + quantityDays)
//             }
//         } while (currentDate <= finishCycle)
//         return $events
//     })
// }



// function drawDiv(top, left, width, height, $event, classList) {
//     const $div = document.createElement('div')
//     $event.appendChild($div)
//     $div.style.position = 'absolute'
//     $div.style.top = top + 'px'
//     $div.style.left = left + 'px'
//     $div.style.width = width + 'px'
//     $div.style.height = height + 'px'
//     $div.style.backgroundColor = 'red'
//     $div.style.opacity = '0.5'
//     $div.classList.add(...classList)
// }



// function endWeek(date) {
//     const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay()
//     return new Date(date.setDate(date.getDate() - dayOfWeek + 7))
// }

// function differenceInDays(dateFinish, dateStart) {
//     return (dateFinish.getTime() - dateStart.getTime()) / (1000 * 3600 * 24)
// }

// function untilEndWeek(date) {
//     return differenceInDays(endWeek(new Date(date)), new Date(date))
// }

// // function duration(event) {
// //     return new Date(event.finish.getTime() - event.start.getTime()).getDate()
// // }
















// function setDescription(nodes, event) {
//     if (nodes.length <= 0) {
//         return
//     }
//     debugger
//     nodes[0].innerHTML = ''
//     nodes[nodes.length - 1].innerHTML = ''
//     nodes[0].innerHTML = `<div class='start'><span>${event.start.getDate()}</span></div>`
//     nodes[nodes.length - 1].innerHTML += `<div class='finish'><span>${event.finish.getDate()}</span></div>`

//     if (nodes.length >= 2) {
//         if (nodes[0].clientWidth > nodes[1].clientWidth) {
//             nodes[0].innerHTML += event.description
//             if (nodes[0].clientWidth <= 150) {
//                 nodes[0].classList.add('content-left')
//             }
//         } else {
//             if (nodes[1].clientWidth <= 150) {
//                 nodes[1].classList.add('content-left')
//                 nodes[1].innerHTML += `<span class='description'>${event.description}</span>`
//             } else {
//                 nodes[1].innerHTML += event.description
//             }
//         }
//     } else {
//         nodes[0].innerHTML += `<span class='description'>${event.description}</span>`
//     }
// }

// function isStart(year, month, day) {
//     const date = new Date(year, month, day)
//     return events.filter(event => date.getTime() === event.start.getTime()).length > 0
// }

// function isFinish(year, month, day) {
//     const date = new Date(year, month, day)
//     return events.filter(event => date.getTime() === event.finish.getTime()).length > 0
// }



// function replaceNodesEvents(nodes) {
//     let length = nodes.length
//     nodes.forEach((n, i) => {
//         const currentDate = getCurrentDate(n)
//         const beforeEndWeek = getQuantityDaysBeforeEndWeek(currentDate)
//         if (n.classList.contains('event-start')) {
//             n.style.width = `calc(44.2rem/7 * ${length > beforeEndWeek ? beforeEndWeek : length})`
//             if (beforeEndWeek >= length) {
//                 n.classList.add('event-finish')

//             }
//         } else {
//             if (currentDate.getDay() === 1) {
//                 n.style.width = `calc(44.2rem/7 * ${length > beforeEndWeek ? beforeEndWeek : length})`
//                 if (beforeEndWeek >= length) {
//                     n.classList.add('event-finish')
//                 }
//             } else {
//                 n.remove()
//             }
//         }
//         length--
//     });
// }

// function getCurrentDate(node) {
//     if (node.classList.contains('prev-date')) {
//         return new Date(date.getFullYear(), date.getMonth() - 1, node.innerHTML)
//     } else if (node.classList.contains('next-date')) {
//         return new Date(date.getFullYear(), date.getMonth() + 1, node.innerHTML)
//     }
//     return new Date(date.getFullYear(), date.getMonth(), node.innerHTML)
// }


// function getQuantityDaysBeforeEndWeek(currentDate) {
//     const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay()
//     return 7 - dayOfWeek + 1
// }




