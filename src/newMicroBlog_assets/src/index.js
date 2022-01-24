import { newMicroBlog } from "../../declarations/newMicroBlog";

async function post() {
  let post_button = document.getElementById("post");
  let error = document.getElementById("error");
  error.innerText = "";
  post_button.disabled = true;
  let textarea = document.getElementById("message");
  let text = textarea.value;
  let otp = document.getElementById("otp").value;
  try {
    await newMicroBlog.post(otp, text);
    textarea.value = "";
  } catch (err) {
    console.log(err);
    error.innerText = "Post Failed!";
  }
  
  post_button.disabled = false;

}

async function followPost(follow) {
  let followPosts_section = document.getElementById("followPosts");
  try {
    let followPosts = await newMicroBlog.followPost(follow);
    for (var i = 0; i < followPosts.length; i ++) {
      let followPost = document.createElement("fp");
      followPost.innerHTML = "<div style='color:green'>Author:"+followPosts[i].author+"</div>  <div style='color:green'>Time:"+followPosts[i].time+"</div> <div style='color:green'>Content:"+followPosts[i].content+"</div>";
      followPosts_section.appendChild(followPost);
    }
    
  } catch (err) {
    console.log(err);
    error.innerText = "Post Failed!";
  }
  
}

var num_posts = 0;
async function load_posts() {
  let posts_section = document.getElementById("posts");
  let posts = await newMicroBlog.posts();
  if (num_posts == posts.length) return;
  posts_section.replaceChildren([]);
  num_posts = posts.length;
  for (let i = 0; i < posts.length; i ++){
    // let postAuthor = document.createElement("author");
    // let postTime = document.createElement("time");
    // let postContent = document.createElement("content");
    // postAuthor.innerText = "Author:" + posts[i].author;
    // postTime.innerText = "Time:" +posts[i].time;
    // postContent.innerText = "Content:" + posts[i].content;
    
    let post = document.createElement("p");
    post.innerHTML = "<div style='color:green'>Author:"+posts[i].author+"</div>  <div style='color:green'>Time:"+posts[i].time+"</div> <div style='color:green'>Content:"+posts[i].content+"</div>";
    // post.innerText = "Author:" + posts[i].author + "Time:" + posts[i].time + "Content:" + posts[i].content;
    posts_section.appendChild(post);

  }

}

var num_follows = 0;
async function load_follows() {
  let follows_section = document.getElementById("follows");
  let follows = await newMicroBlog.follows();
  if (num_follows == follows.length) return;
  follows_section.replaceChildren([]);
  num_follows = follows.length;
  for (let i = 0; i < follows.length; i ++){
    let follow = document.createElement("f");
    follow.onclick =function(){
      followPost(follows[i]);
    };
    follow.innerHTML = "<div>"+follows[i] + "</div>";

    follows_section.appendChild(follow);

  }

}

function load () {
  let post_button = document.getElementById("post");
  post_button.onclick = post;
  load_posts()
  load_follows()
  setInterval(load_posts,3000)
  setInterval(load_follows,3000)
}

window.onload = load