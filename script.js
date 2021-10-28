const date = new Date()
const events = [
    { start: new Date(2021, 8, 27), finish: new Date(2021, 8, 29), description: 'Big Sale Promotion' }
    , { start: new Date(2021, 8, 28), finish: new Date(2021, 8, 30), description: '30% OFF' }
    , { start: new Date(2021, 9, 1), finish: new Date(2021, 9, 3), description: 'Big Sale Promotion' }
    , { start: new Date(2021, 10, 23), finish: new Date(2021, 10, 26), description: '30% OFF' }
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

    const firstDayIndex = date.getDay() - 1

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
    let days ='', quantityDiv = 0
    for (let x = firstDayIndex; x > 0; x--, quantityDiv++) {
        const day = prevLastDay - x + 1
        days += `<div class='prev-date'>${day}</div>`
    }
   

    for (let i = 1; i <= lastDay; i++, quantityDiv++) {
        days += `<div>${i}</div>`
    }

    const nextDays = 42 - quantityDiv

    for (let i = 1; i <= nextDays; i++) {
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



function setEvents(){
    let $days = document.querySelectorAll('.days div')
    const firstDate = firstDateOnCalendar($days)
    const lastDate = lastDateOnCalendar($days)
    const events = filterEvents(firstDate, lastDate)
    if(events.length <= 0){
        return
    }
    const $calendar = document.querySelector('.calendar')
    const $events = document.createElement('div')
    $events.classList.add('events')
    $calendar.appendChild($events)
    events.forEach((e, i) => {
        const $event = document.createElement('div')
        $event.classList.add('event_' + i)
        $events.appendChild($event)


    })

    // let calendarDayRect = document.querySelectorAll('.days div')[0].getBoundingClientRect()
   
    
    
   

    
    // $event1.style.position = 'absolute'
    // $event1.style.top = calendarDayRect.top + 'px'
    // $event1.style.left = calendarDayRect.left + 'px'
    // $event1.style.width = calendarDayRect.width + 'px'
    // $event1.style.height = calendarDayRect.height + 'px'
    // $event1.style.backgroundColor = 'red'
    // $events.appendChild($event1)
}

function filterEvents(start, finish) {
    let eventsFind = []
    events.forEach(event => {
        if (event.start >= start && event.finish <= finish) {
            eventsFind.push(event)
        }
    })
    return eventsFind
}

function firstDateOnCalendar($calendar){
    const $node = $calendar[0]
    if($node.classList.contains('prev-date')){        
        return new Date(date.getFullYear(), date.getMonth() - 1, $node.innerHTML)
    } else{
        return new Date(date.getFullYear(), date.getMonth(), $node.innerHTML)
    }
}

function lastDateOnCalendar($calendar){
    const $node = $calendar[$calendar.length - 1]
    if($node.classList.contains('next-date')){        
        return new Date(date.getFullYear(), date.getMonth() + 1, $node.innerHTML)
    } else{
        return new Date(date.getFullYear(), date.getMonth(), $node.innerHTML)
    }
}












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




