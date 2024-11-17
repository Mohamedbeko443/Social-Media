const baseUrl = "https://tarmeezacademy.com/api/v1";




function showAlert(message, type) {
    // Create a new alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} fade show`;
    alert.role = "alert";
    alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close " data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    
    const alertContainer = document.getElementById('alert-container');
    alertContainer.appendChild(alert);

    
    setTimeout(() => {
        alert.classList.remove('show');
        alert.classList.add('fade');
        setTimeout(() => alert.remove(), 500); 
    }, 3000);
}



function loginBtnClicked() {
    const username = document.getElementById("username-input").value;
    const password = document.getElementById("password-input").value;

    const params = {
        "username": username,
        "password": password
    }

    axios.post(`${baseUrl}/login`, params)
        .then((response) => {
            // console.log(response.data);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user))

            const modal = document.getElementById("exampleModal");
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();

            showAlert("logged in successfully" , "success");
            setupUI();

        }).catch((error)=>{
            let errorMessage = error.response.data.message;
            showAlert(errorMessage , "danger");
        })
}


function registerBtnClicked(){
    
    const name = document.getElementById("register-name-input").value;
    const username = document.getElementById("register-username-input").value;
    const password = document.getElementById("register-password-input").value;
    const profileImg = document.getElementById("register-profileImage-input").files[0]; 

    let formData = new FormData();
    formData.append("name" , name);
    formData.append("username" , username);
    formData.append("password" , password);
    formData.append("image" , profileImg);

    
    const headers = {
        "Content-Type" : "multipart/form-data",
    }


    axios.post(`${baseUrl}/register`, formData , {
        headers : headers
    })
        .then((response) => {
            console.log(response.data);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user))

            const modal = document.getElementById("exampleModal2");
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();

            showAlert("Registered successfully" , "success");
            setupUI();

        }).catch((error)=>{
            const errorMessage = error.response.data.message;
            showAlert(errorMessage , "danger");
        })
    
}


function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showAlert("logged out successfully" , "success");
    setupUI();
    //getPosts();
}


function getCurrentUser(){
    let user = null;
    const storageUser = localStorage.getItem("user");
    if(storageUser)
    {
        user = JSON.parse(storageUser);
    }

    return user;
}




function postClicked(postId){
    window.location.href = `../postDetails.html?postId=${postId}`;
}



function editPostBtnClicked(postString){
    document.getElementById("post-modal-title").innerHTML = "Edit Post";
    document.getElementById("post-btn").innerHTML = "Edit";


    let post = JSON.parse(postString);
    console.log(post);
    post_id = post.id;

    document.getElementById("post-title-input").value = post.title;
    document.getElementById("post-body-input").value = post.body;

    

    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"),{});
    postModal.toggle();
    
}


function deletePostBtnClicked(postString){
    let post = JSON.parse(postString);
    post_id = post.id;
    let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"),{});
    postModal.toggle();
}


function confirmPostDelete()
{
    const token = localStorage.getItem("token");
    const headers = {
        "authorization" : `Bearer ${token}`
    }
    axios.delete(`${baseUrl}/posts/${post_id}`, {
        headers : headers
    })
        .then((response) => {
            
            const modal = document.getElementById("delete-post-modal");
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();

            showAlert("Your Post Has Been Deleted Successfully" , "success");
            getPosts();
            setupUI();

        }).catch((error)=>{
            let errorMessage = error.response.data.message;
            showAlert(errorMessage , "danger");
        })
}


function createCommentClicked(){
    let commentBody = document.getElementById("comment-input").value;

    let params = {
        "body" : commentBody
    }

    let token = localStorage.getItem("token");
    let url = `${baseUrl}/posts/${id}/comments`;

    axios.post(url,params,{
        headers : {
            "authorization" : `Bearer ${token}`
        }
    })
    .then((response)=>{
        console.log(response.data);
        showAlert("the comment has been created successfully" , "success");
        getPost();
    })
    .catch((error)=>{
        const errorMessage = error.response.data.message;
        showAlert(errorMessage,"danger");
    })
}



function createNewPostClicked(){
    
    const title = document.getElementById("post-title-input").value;
    const body = document.getElementById("post-body-input").value;
    const image = document.getElementById("post-image-input").files[0]; 

    let formData = new FormData();
    formData.append("title" , title);
    formData.append("body" , body);
    formData.append("image" , image);

    

    const token = localStorage.getItem("token");
    
    

    const headers = {
        "Content-Type" : "multipart/form-data",
        "authorization" : `Bearer ${token}`,
    }

    let postBtn = document.getElementById("post-btn");

    if(postBtn.innerHTML === "Create")
    {
        console.log("create block");
        axios.post(`${baseUrl}/posts`, formData,{
            headers : headers
        })
            .then((response) => {
                const modal = document.getElementById("create-post-modal");
                const modalInstance = bootstrap.Modal.getInstance(modal);
                modalInstance.hide();
                
                showAlert("New Post Has been Created" , "success");
                getPosts();
            }).catch((error)=>{
                let errorMessage = error.response.data.message;
                showAlert(errorMessage , "danger");
            })
    }
    else
    {
        console.log("edit block");
        formData.append("_method" , "put");
        axios.post(`${baseUrl}/posts/${post_id}`, formData,{
            headers : headers
        })
            .then((response) => {
                const modal = document.getElementById("create-post-modal");
                const modalInstance = bootstrap.Modal.getInstance(modal);
                modalInstance.hide();
                
                showAlert("Your Post Has been Edited" , "success");
                document.getElementById("post-modal-title").innerHTML = "Create A New Post";
                document.getElementById("post-btn").innerHTML = "Create";
                getPosts();
            }).catch((error)=>{
                let errorMessage = error.response.data.message;
                showAlert(errorMessage , "danger");
            })
    }

}



function profileClicked()
{
    const user = getCurrentUser();
    const id = user.id;
    //alert(id);
    window.location.href = `profile.html?userId=${id}`;
}