let currentPage = 1;
let lastPage = 1;
let post_id = "";
let buttonContent = ``;
setupUI();
getPosts();

window.addEventListener("scroll" , ()=> {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    if(endOfPage && currentPage < lastPage)
    {
        currentPage++;
        getPosts(false , currentPage);
    }
})


function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showAlert("logged out successfully" , "success");
    setupUI();
    getPosts();
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
            getPosts();

        }).catch((error)=>{
            const errorMessage = error.response.data.message;
            showAlert(errorMessage , "danger");
        })
    
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
            getPosts();

        }).catch((error)=>{
            let errorMessage = error.response.data.message;
            showAlert(errorMessage , "danger");
        })
}


function getPosts(reload = true , page = 1){
    axios.get(`${baseUrl}/posts?limit=5&page=${page}`)
    .then((response) => {
        let posts = response.data.data;
        lastPage = response.data.meta.last_page;
        if(reload)
        {
            document.getElementById("posts").innerHTML = "";
        }
        const avatar = "./imgs/leo.jpg"
        let user = getCurrentUser();
        for (let post of posts) {
            const author = post.author;
            let authorImage = author.profile_image ? author.profile_image : avatar;
            
            let isMyPost = user && post.author.id == user.id;
            
                buttonContent = isMyPost ?  `<button  id="editBtn" onclick="editPostBtnClicked(this.dataset.post);" data-post='${JSON.stringify(post)}' class="btn btn-dark"  style="float: right; ">Edit</button>` : ``;
                deleteBtnContent = isMyPost ?  `<button id="deleteBtn" onclick="deletePostBtnClicked(this.dataset.post);" data-post='${JSON.stringify(post)}' class="btn btn-danger ms-2"  style="float: right; ">Delete</button>` : ``;
            
            let content = `
            <div class="card shadow my-3">
                        <div class="card-header">

                            <span  onclick="userClicked(${author.id})" style = "cursor : pointer">
                                <img class=" rounded-pill image" src="${authorImage}" alt="">
                                <b class="ms-2">${author.username}</b>
                            </span>

                            
                            
                            ${deleteBtnContent}
                            ${buttonContent}
                        </div>
                        <div class="card-body" style = "cursor : pointer" onclick = "postClicked(${post.id})">
                            <img class="w-100" src="${post.image}" alt="">
                            <h6 class="text-black-50 mt-2">${post.created_at}</h6>
                            <h5 class="card-title">${post.title}</h5>
                            <p>${post.body}</p>
                            <hr>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-pen" viewBox="0 0 16 16">
                                    <path
                                        d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                                </svg>
                                <span>(${post.comments_count}) Comments

                                <span class = "post-tags" id = "post-tags-${post.id}">
                                
                                
                                </span>

                                </span>
                            </div>
                        </div>
                    </div>
            `
            document.getElementById("posts").innerHTML += content;
            const currentPostTags = `post-tags-${post.id}`;
            document.getElementById(currentPostTags).innerHTML = ""
            for(let tag of post.tags)
            {
                let tagsContent = `
                <button class = "btn btn-sm rounded-5 " >${tag.name}</button>
                `
                document.getElementById(currentPostTags).innerHTML += tagsContent;
            }

        }
    })
}


// username : lionelMohamed
// pass :     123456


function userClicked (userId)
{
    window.location.href = `profile.html?userId=${userId}`;
}


function setupUI(){
    const token = localStorage.getItem("token");
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const createPostBtn = document.getElementById("add-btn");
    const userImg = document.getElementById("nav-userImg");
    const navUsername = document.getElementById("nav-username");
    const logoutBtn = document.getElementById("logout-btn");
    const profileLink = document.getElementById("profile-link");


    if(!token) // user is guest
    {
        loginBtn.style.display = "block";
        registerBtn.style.display = "block";
        createPostBtn.style.display = "none";
        userImg.style.display = "none";
        navUsername.style.display = "none";
        logoutBtn.style.display = "none";
        profileLink.style.display = "none";
    }
    else
    {
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        createPostBtn.style.display = "block";
        userImg.style.display = "block";
        navUsername.style.display = "block";
        logoutBtn.style.display = "block";
        profileLink.style.display = "block";

        const user = getCurrentUser();
        document.getElementById("nav-userImg").src = user.profile_image;
        document.getElementById("nav-username").innerHTML = user.username;
    }
}







function clearModal(){
    document.getElementById("post-modal-title").innerHTML = "Create A New Post";
    document.getElementById("post-btn").innerHTML = "Create";
    
    document.getElementById("post-title-input").value = "" ;
    document.getElementById("post-body-input").value = "" ;
    document.getElementById("post-image-input").files[0] = "";
}





// onclick='loanBtnClicked(this.dataset.book)' data-book='${JSON.stringify(book)}'