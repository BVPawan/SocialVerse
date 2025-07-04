use ic_cdk::api::time;
use ic_cdk::storage;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;

thread_local! {
    static POSTS: RefCell<Vec<Post>> = RefCell::new(Vec::new());
}

#[derive(Clone, Debug, Serialize, Deserialize, candid::CandidType, Default)]
pub struct Post {
    pub id: u64,
    pub author: String,
    pub content: String,
    pub image: Option<String>,
    pub timestamp: u64,
}

#[ic_cdk::update]
pub fn add_post(author: String, content: String, image: Option<String>) -> u64 {
    let post = Post {
        id: time(),
        author,
        content,
        image,
        timestamp: time(),
    };
    let id = post.id;
    POSTS.with(|posts| posts.borrow_mut().push(post));
    id
}

#[ic_cdk::query]
pub fn get_posts() -> Vec<Post> {
    POSTS.with(|posts| posts.borrow().clone())
}

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}
