const socket  = io()

// elements
const $form = document.querySelector('form')
const $button = document.getElementById('btn')
const  $input = document.getElementById('msg')
const $buttonloc = document.getElementById('get-location')
const $message = document.getElementById('message')
const $scroll = document.getElementById('messageBody')
const $userlist = document.getElementById('userlist')


const scrollBottom = ()=>{

    $scroll.scrollTop = $scroll.scrollHeight
}

// templates

const $mymessageTemplate = document.getElementById('my-message-template').innerHTML
const $mylocationTemplate = document.getElementById('my-location-template').innerHTML
const $otherslocationTemplate = document.getElementById('others-location-template').innerHTML
const $listTemplate = document.getElementById('list-template').innerHTML
const $othersmessageTemplate = document.getElementById('others-message-template').innerHTML



socket.on('message',(message)=>{

    const html = Mustache.render($othersmessageTemplate,{
        username:message.username.toUpperCase(),
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a | MMM D')
    })
    $message.insertAdjacentHTML('beforeend',html)
    scrollBottom()
})

socket.on('roomlist',(message)=>{
    console.log(message.userlist)
    const html = Mustache.render($listTemplate,{
        room:message.room,
        users:message.userlist
    })
    $userlist.innerHTML=html

})
socket.on('messageLocation',(url)=>{

    const html = Mustache.render($otherslocationTemplate,{
        username:url.username.toUpperCase(),
        location:url.text,
        createdAt:moment(url.createdAt).format('h:mm a')
    })
    $message.insertAdjacentHTML('beforeend',html)
    scrollBottom()

})

$form.addEventListener('submit',(e)=>{
    e.preventDefault()//onSubmit browser goes to a refresh and all the values and elements are lost.
    // So we have to stop that 
    //Disable

    $button.setAttribute('disabled','disabled')
    if($input.value === '')
    {
        $button.removeAttribute('disabled')
        return
    }

    const html = Mustache.render($mymessageTemplate,{
        username:'ME',
        message:$input.value,
        createdAt:moment(message.createdAt).format('h:mm a | MMM D')
    })
    $message.insertAdjacentHTML('beforeend',html)
    scrollBottom()

    socket.emit('sendMessage',$input.value,(error)=>{
        $button.removeAttribute('disabled')
        $input.value=''
        $input.focus()
        if(error)
        {
            return alert(error)
        }
    })

})


$buttonloc.addEventListener('click',()=>{

    if(!navigator.geolocation)
    {
        return new alert('Location service not supported')
    }

    $buttonloc.setAttribute('disabled','disabled')

    const html = Mustache.render($mylocationTemplate,{
        username:'ME',
        message:$input.value,
        createdAt:moment(message.createdAt).format('h:mm a | MMM D')
    })
    $message.insertAdjacentHTML('beforeend',html)
    scrollBottom()


    navigator.geolocation.getCurrentPosition((location)=>{
        socket.emit('sendLocation',{
            'lat':location.coords.latitude,
            'lon':location.coords.longitude
        },()=>{
            console.log('Location shared!')
            $buttonloc.removeAttribute('disabled')
        })
    })
})

const {username ,roomname } = Qs.parse(location.search,{
    ignoreQueryPrefix:true})

socket.emit('join',{username,roomname},(error)=>{
    alert(error)
    location.replace('http://localhost:3000/')
})