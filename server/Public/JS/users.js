// Purpose: To handle the user data and render it on the page.
var Limit =  localStorage.getItem("Limit") || 2;
var Page =  localStorage.getItem("Page") || 1;
var userdata =  JSON.parse(localStorage.getItem("userdata")) || []
var page_info = JSON.parse(localStorage.getItem("page_info")) || {}
var url = 'http://localhost:2984/admin';
var searchQuery = "";
var sort = "name";
var order = "asc";

const sort_ = async (sortby)=>{
    if (sortby == sort){
        order = order == 'asc'?'desc':'asc';
    }
    else{
        sort = sortby;
        order = 'asc';
    }
    await get_data(Page,Limit);
}

const set_local_data = ()=>{
    localStorage.setItem('userdata',JSON.stringify(userdata));
    localStorage.setItem('page_info',JSON.stringify(page_info));
    localStorage.setItem('Page',Page);
    localStorage.setItem('Limit',Limit);
}

const get_data = async (pageno,limit) => {
    await fetch(url+`/search?page=${pageno}&limit=${limit}&searchQuery=${searchQuery != ""?searchQuery:""}&sort=${sort == ""?null:sort}&order=${order == ""?null:order}`,{
        method:'GET',
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res=>{
        return res.json();
    })
    .then(data=>{
        console.log(data);
        userdata = data.users;
        Page = data.currentPage;
        Limit = data.limit;
        page_info = {
            hasNextPage: data.hasNextPage,
            hasPreviousPage: data.hasPreviousPage,
            nextPage: data.nextPage,
            previousPage: data.previousPage,
            t:data.t
        }
        set_local_data();
        render();
    })
    .catch(err=>{
        console.log(err);
    })
}
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('page').innerText = Page;
    document.getElementById('select').value = Limit;
    url = window.location.href.split('/users')[0]; 
     const loader = async ()=>{
        let pageno = Page ;
        let limit = Limit;
        await get_data(pageno,limit);
    }
    if(userdata.length > 0){
        render();
    }   
    else{
        loader();
    }
     
  });

function render(){
    document.getElementById('page').innerText = Page;
    document.getElementById('select').value = Limit;
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
            <td><button type="button" onClick="delete_('`+user._id+`');"><img src="/delete-button-svgrepo-com.png"/></button></td>
            </td>
        </tr>
        `
    })
    table.innerHTML = html;
    document.getElementById('item').innerText = (Limit*(Page-1)+1) +" - "+((Limit*Page)<page_info.t?(Limit*Page):page_info.t);	
    document.getElementById('prev_btn').disabled = !page_info.hasPreviousPage;
    document.getElementById('next_btn').disabled = !page_info.hasNextPage;
}

async function next (){
    let pageno = +Page + 1;
    let limit = Limit;
    await get_data(pageno,limit);

}

async function prev(){
    let pageno = Page - 1;
    let limit = Limit;
    await get_data(pageno,limit);
}

async function changeno(){
    let pageno = 1 ;
    let limit = document.getElementById('select').value;
    //console.log(pageno + " " + limit);
    await get_data(pageno,limit);
}

async function delete_(userid){
    await fetch(url+'/deleteuser',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            id:userid
        })
    })
    .then(res=>{
        return res.json();
    })
    .then(data=>{
        if(data.message){
            alert('User Deleted');
            get_data(Page,Limit);
        }
        else{
            alert('Error Occured User Not Deleted');
        }
    })
    .catch(err=>{
        console.log(err);
    })
}

const search_ = async ()=>{
    const page = 1;
    const limit = Limit;
    searchQuery = document.getElementById('search').value;
    await get_data(page,limit,searchQuery);
}
