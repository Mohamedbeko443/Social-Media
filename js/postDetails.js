setupUI();




function setupUI(){
    const token = localStorage.getItem("token");
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const userImg = document.getElementById("nav-userImg");
    const navUsername = document.getElementById("nav-username");
    const logoutBtn = document.getElementById("logout-btn");
    const commentInput = document.getElementById("comment-input");
    const sendBtn = document.getElementById("sendBtn");
    const profileLink = document.getElementById("profile-link");


    console.log(commentInput);
    console.log(sendBtn);

    

    if(!token) // user is guest
    {
        loginBtn.style.display = "block";
        registerBtn.style.display = "block";
        userImg.style.display = "none";
        navUsername.style.display = "none";
        logoutBtn.style.display = "none";
        // commentSection.style.display = "none";
        commentInput.style.display = "none";
        sendBtn.style.display= "none";
        profileLink.style.display= "none";
    }
    else
    {
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        userImg.style.display = "block";
        navUsername.style.display = "block";
        logoutBtn.style.display = "block";
       // commentSection.style.display = "block";
        commentInput.style.display = "inline-block";
        sendBtn.style.display= "block";
        profileLink.style.display= "block";
        
        const user = getCurrentUser();
        document.getElementById("nav-userImg").src = user.profile_image;
        document.getElementById("nav-username").innerHTML = user.username;
    }
}

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("postId");
getPost();


function getPost(){
    axios.get(`${baseUrl}/posts/${id}`)
    .then((response) => {
        const post = response.data.data;
        const comments = post.comments;
        const author = post.author;
        
        document.getElementById("username-span").innerHTML = author.username;
        
        let postTitle = "";
        if(postTitle)
        {
            postTitle = post.title;
        }

        let commentsContent = ``;
        for(let comment of comments)
        {
            commentsContent+= `
            <div class="p-3" style="background-color: rgb(206, 206, 206);">
                            <!-- profile pic + username -->
                            <div>
                                <img style="width: 40px; height: 40px;" class="rounded-circle " src="${comment.author.profile_image}"
                                    alt="">
                                <b>@${comment.author.username}</b>
                            </div>

                            <!-- comments body -->
                            <div>
                                ${comment.body};
                            </div>
                        </div>
            `
        }

        const postContent = `
        <div class="card shadow my-3">
                        <div class="card-header">
                            <img class=" rounded-pill image" src="${author.profile_image}" alt="">
                            <b  class="ms-2">@${author.username}</b>
                        </div>
                        <div class="card-body">
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
                                <span>(${post.comments_count}) Comments</span>
                            </div>
                        </div>
                        <div id="comments">
                            ${commentsContent}
                        </div>

                        <div class = "input-group mb-3" id="add-comment-div">
                        <input class = "form-control" id="comment-input" type = "text" placeholder = "Add your comment here.">
                        <button id="sendBtn" onclick="createCommentClicked()" class = "btn btn-outline-primary">send</button>
                        </div>

                    </div>
        `
        document.getElementById("post").innerHTML = postContent;
    })
}





// authentication => who 

