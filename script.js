const date = new Date()
const events = [
    { start: new Date(2021, 6, 1), finish: new Date(2021, 6, 9), description: 'Big Sale Promotion' }
    ,{ start: new Date(2021, 6, 22), finish: new Date(2021, 6, 26), description: '30% OFF' }
    ,{ start: new Date(2021, 9, 1), finish: new Date(2021, 9, 3), description: 'Big Sale Promotion' }
     ,{ start: new Date(2021, 9, 23), finish: new Date(2021, 9, 26), description: '30% OFF' }
]

const renderCalendar = () => {
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

    let days = ''
    let quantityDiv = 0
    let indexEvent = 0
    for (let x = firstDayIndex; x > 0; x--, quantityDiv++) {
        const day = prevLastDay - x + 1
        const eventFlag = isEvent(date.getFullYear(), date.getMonth() - 1, day) 
        
        // /console.log(eventFlag);    
        const start = isStart(date.getFullYear(), date.getMonth() - 1, day)
        const finish = isFinish(date.getFullYear(), date.getMonth() - 1, day)
        days += `<div class='prev-date ${eventFlag ? `event event${indexEvent}` : ''} ${start?'event-start':''} ${finish?'event-finish':''}'>${day}</div>`
        if(finish){
            indexEvent++
        }
    }

    for (let i = 1; i <= lastDay; i++, quantityDiv++) {
        const eventFlag = isEvent(date.getFullYear(), date.getMonth(), i)
        const start = isStart(date.getFullYear(), date.getMonth(), i)
        const finish = isFinish(date.getFullYear(), date.getMonth(), i)
        console.log(events.indexOf(eventFlag));    
        days += `<div class='${eventFlag ? `event event${indexEvent}` : ''}${start?' event-start':''}${finish?' event-finish':''}'>${i}</div>`
        if(finish){
            indexEvent++
        }
    }

    const nextDays = 42 - quantityDiv

    for (let i = 1; i <= nextDays; i++) {
        const eventFlag = isEvent(date.getFullYear(), date.getMonth() + 1, i)
        const start = isStart(date.getFullYear(), date.getMonth() + 1, i)
        const finish = isFinish(date.getFullYear(), date.getMonth() + 1, i)

        days += `<div class='next-date ${eventFlag ? `event event${indexEvent}` : ''} ${start?'event-start':''} ${finish?'event-finish':''}'>${i}</div>`
        if(finish){
            indexEvent++
        }
    }
    monthDays.innerHTML = days

    today()

    events.filter(e => e.start <= date).forEach((e,i) =>{
        replaceNodesEvents(document.querySelectorAll(`.event${i}`))
    
        setDescription(document.querySelectorAll(`.event${i}`), e)
    })
}

function setDescription(nodes, event){
    if(nodes.length <= 0){
        return
    }
    debugger
    nodes[0].innerHTML = ''
    nodes[nodes.length - 1].innerHTML = ''
    nodes[0].innerHTML =  `<div class='start'><span>${event.start.getDate()}</span></div>` 
    nodes[nodes.length - 1].innerHTML +=  `<div class='finish'><span>${event.finish.getDate()}</span></div>`

    if(nodes.length >= 2){
        if(nodes[0].clientWidth > nodes[1].clientWidth){
            nodes[0].innerHTML += event.description
            if(nodes[0].clientWidth <= 150){
                nodes[0].classList.add('content-left')
            }
        } else{
            if(nodes[1].clientWidth <= 150){
                nodes[1].classList.add('content-left')
                nodes[1].innerHTML += `<span class='description'>${event.description}</span>`
            }else{
                nodes[1].innerHTML += event.description
            }
        }
    } else{
        nodes[0].innerHTML += `<span class='description'>${event.description}</span>` 
    }
}

function isStart(year, month, day) {
    const date = new Date(year, month, day)
    return events.filter(event => date.getTime() === event.start.getTime()).length > 0
}

function isFinish(year, month, day) {
    const date = new Date(year, month, day)
    return events.filter(event => date.getTime() === event.finish.getTime()).length > 0
}

function today() {
    document.querySelectorAll('.days div:not(.next-date, .prev-date)').forEach(n => {
        const day = +n.innerHTML

        if (day === new Date().getDate() && date.getMonth() === new Date().getMonth()) {

            n.classList.add('today')
        }
    })
}

function replaceNodesEvents(nodes) {
    let length = nodes.length
    nodes.forEach((n, i) => {
        const currentDate = getCurrentDate(n) 
        const beforeEndWeek = getQuantityDaysBeforeEndWeek(currentDate)
        if (n.classList.contains('event-start')) {
            n.style.width = `calc(44.2rem/7 * ${length > beforeEndWeek ? beforeEndWeek : length})`
            if(beforeEndWeek >= length){
                n.classList.add('event-finish')
                
            }
        } else {
            if (currentDate.getDay() === 1) {
                n.style.width = `calc(44.2rem/7 * ${length > beforeEndWeek ? beforeEndWeek : length})`
                if(beforeEndWeek >= length){
                    n.classList.add('event-finish')
                }
            } else {
                n.remove()               
            }
        }
        length--
    });
}



function getCurrentDate(node){
    if(node.classList.contains('prev-date')){
        return new Date(date.getFullYear(), date.getMonth() - 1, node.innerHTML)
    } else  if(node.classList.contains('next-date')){
        return new Date(date.getFullYear(), date.getMonth() + 1, node.innerHTML)
    }
    return new Date(date.getFullYear(), date.getMonth(), node.innerHTML)
}


function getQuantityDaysBeforeEndWeek(currentDate) {
    const dayOfWeek = currentDate.getDay() === 0? 7: currentDate.getDay()
    return 7 - dayOfWeek + 1
}

function isEvent(year, month, day) {
    const date = new Date(year, month, day)
    let indexInArray = -1
    return events.forEach((event, i) => {
        if(event.start <= date && event.finish >= date){
             indexInArray = i
        }
    })
}

document.querySelector('.prev').addEventListener('click', () => {
    date.setMonth(date.getMonth() - 1)
    renderCalendar()
})

document.querySelector('.next').addEventListener('click', () => {
    date.setMonth(date.getMonth() + 1)
    renderCalendar()
})

renderCalendar()