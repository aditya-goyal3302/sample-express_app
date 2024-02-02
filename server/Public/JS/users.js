// Purpose: To handle the user data and render it on the page.
var Limit =2;
var Page = 1;
var userdata = []
var page_info = {}
var url = 'http://localhost:2984/admin';
var searchQuery = "";

const get_data = async (pageno,limit) => {
    await fetch(url+'/search',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            page:pageno,
            limit:limit,
            searchQuery:searchQuery
        })
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
        // console.log(userdata);        
        render();
    })
    .catch(err=>{
        console.log(err);
    })
}
document.addEventListener("DOMContentLoaded", () => {
    url = window.location.href.split('/users')[0]; 
    document.getElementById('page').innerText = Page;
    document.getElementById('select').value = Limit;
     const loader = async ()=>{
        let pageno = Page ;
        let limit = Limit;
        await get_data(pageno,limit);
    }
     loader();
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
    let pageno = Page + 1;
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
    // await fetch(url+'/search',{
    //     method:'POST',
    //     headers:{
    //         'Content-Type':'application/json'
    //     },
    //     body:JSON.stringify({
    //         pageno:page,
    //         limit:limit,
    //         searchQuery:searchQuery
    //     })
    // })
    // .then(res=>{
    //     return res.json();
    // })
    // .then(data1=>{
    //     console.log(data1);
    //     userdata = data1.users;
    //     Page = data1.currentPage;
    //     Limit = data1.limit;
    //     page_info = {
    //         hasNextPage: data1.hasNextPage,
    //         hasPreviousPage: data1.hasPreviousPage,
    //         nextPage: data1.nextPage,
    //         previousPage: data1.previousPage,
    //         t:data1.t
    //     }
    //     render();
    // })
}

 