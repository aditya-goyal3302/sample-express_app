const { json } = require("express");

var Limit = window.location.href.split("Limit=")[1].split("&")[0];

var userdata = []

function changeno(){ 
    // e.perventDefault();
    Page = document.getElementById('page');
    select = document.getElementById('select');
    

}
// console.log(document.getElementById('select').value)
document.getElementById('select').value = Limit;   

function render(){
    var table = document.getElementById('tbody');
    table.innerHTML = '';
    var html = '';
    userdata.forEach((user)=>{
        html += `
        <tr>
            <td>${user.name}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${user.city}</td>
            <td><a href="/admin/edituser/${user._id}?edit=true"><img src="/icons8-edit.gif"/></a></td>
            <td><form action="/admin/deleteuser" method="POST">
                    <input type="hidden" name="id" value="${user._id}">
                    <button type="submit"><img src="/delete-button-svgrepo-com.png"/></button>
                </form>
            </td>
        </tr>
        `
    })
    table.innerHTML = html;
}

async function next (){
    let pageno = Number(document.getElementById('page').value) + 1;
    let limit = Number(document.getElementById('select').value);
    await fetch('http://localhost:2984/admin/users-ajax',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            page:pageno,
            limit:limit
        })
    }).then(res=>{
        return res.json();
    })
    .then(data=>{
        console.log(data);
        userdata = data.users;
        console.log(userdata);
        render();
    })
    .catch(err=>{
        console.log(err);
    })
}

async function prev (){
    let pageno = Number(document.getElementById('page').value) - 1;
    let limit = Number(document.getElementById('select').value);
    await fetch('http://localhost:2984/admin/users-ajax',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            page:pageno,
            limit:limit
        })
    }).then(res=>{
        return res.json();
    })
    .then(data=>{
        console.log(data);
        userdata = data.users;
        console.log(userdata);
        render();
    })
    .catch(err=>{
        console.log(err);
    })
}