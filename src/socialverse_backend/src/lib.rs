use ic_cdk::api::time;
use candid::Principal;

use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::HashMap;
use std::collections::HashSet;
use candid::CandidType;

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
pub struct Comment {
    pub user_principal: Principal,
    pub username: String,
    pub text: String,
    pub timestamp: u64,
}

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
pub struct Post {
    pub id: u64,
    pub author: String,
    pub author_principal: Principal,
    pub content: String,
    pub image: Option<String>,
    pub timestamp: u64,
    pub likes: Vec<Principal>,
    pub comments: Vec<Comment>,
}

#[derive(Clone, Debug, Serialize, Deserialize, candid::CandidType)]
pub struct Profile {
    pub user_principal: Principal,
    pub username: String,
    pub name: String,
    pub bio: String,
    pub avatar: Option<String>,
}

thread_local! {
    static POSTS: RefCell<Vec<Post>> = RefCell::new(Vec::new());
    static PROFILES: RefCell<HashMap<String, Profile>> = RefCell::new(HashMap::new());
    // Maps follower_principal -> set of followed_principals
    static FOLLOWING: RefCell<HashMap<Principal, HashSet<Principal>>> = RefCell::new(HashMap::new());
}

#[ic_cdk::update]
pub fn add_post(author: String, author_principal: Principal, content: String, image: Option<String>) -> u64 {
    let post = Post {
        id: time(),
        author,
        author_principal,
        content,
        image,
        timestamp: time(),
        likes: Vec::new(),
        comments: Vec::new(),
    };
    let id = post.id;
    POSTS.with(|posts| posts.borrow_mut().push(post));
    id
}

#[ic_cdk::query]
pub fn get_posts() -> Vec<Post> {
    POSTS.with(|posts| posts.borrow().clone())
}

#[ic_cdk::update]
pub fn add_or_update_profile(profile: Profile) {
    PROFILES.with(|profiles| {
        profiles.borrow_mut().insert(profile.user_principal.to_text(), profile);
    });
}

#[ic_cdk::query]
pub fn get_profile(principal: String) -> Option<Profile> {
    PROFILES.with(|profiles| profiles.borrow().get(&principal).cloned())
}

#[ic_cdk::query]
pub fn get_all_profiles() -> Vec<Profile> {
    PROFILES.with(|profiles| profiles.borrow().values().cloned().collect())
}

#[ic_cdk::query]
pub fn search_profiles(query: String) -> Vec<Profile> {
    let q = query.to_lowercase();
    PROFILES.with(|profiles| {
        profiles.borrow().values()
            .filter(|profile| {
                profile.username.to_lowercase().contains(&q) ||
                profile.name.to_lowercase().contains(&q)
            })
            .cloned()
            .collect()
    })
}

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[ic_cdk::update]
pub fn like_post(post_id: u64, user_principal: Principal) -> bool {
    POSTS.with(|posts| {
        let mut posts = posts.borrow_mut();
        if let Some(post) = posts.iter_mut().find(|p| p.id == post_id) {
            if !post.likes.contains(&user_principal) {
                post.likes.push(user_principal);
                return true;
            }
        }
        false
    })
}

#[ic_cdk::update]
pub fn add_comment(post_id: u64, comment: Comment) -> bool {
    POSTS.with(|posts| {
        let mut posts = posts.borrow_mut();
        if let Some(post) = posts.iter_mut().find(|p| p.id == post_id) {
            post.comments.push(comment);
            return true;
        }
        false
    })
}

#[ic_cdk::query]
pub fn get_comments(post_id: u64) -> Vec<Comment> {
    POSTS.with(|posts| {
        posts.borrow().iter().find(|p| p.id == post_id)
            .map(|p| p.comments.clone())
            .unwrap_or_default()
    })
}

/// Follow a user (follower follows followee). Returns true if successful, false if already following.
#[ic_cdk::update]
pub fn follow_user(follower: Principal, followee: Principal) -> bool {
    FOLLOWING.with(|following| {
        let mut map = following.borrow_mut();
        let entry = map.entry(follower).or_insert_with(HashSet::new);
        entry.insert(followee)
    })
}

/// Unfollow a user. Returns true if successful, false if not following.
#[ic_cdk::update]
pub fn unfollow_user(follower: Principal, followee: Principal) -> bool {
    FOLLOWING.with(|following| {
        let mut map = following.borrow_mut();
        if let Some(entry) = map.get_mut(&follower) {
            entry.remove(&followee)
        } else {
            false
        }
    })
}

/// Get the list of Principals this user is following.
#[ic_cdk::query]
pub fn get_following(follower: Principal) -> Vec<Principal> {
    FOLLOWING.with(|following| {
        following.borrow().get(&follower).map(|set| set.iter().cloned().collect()).unwrap_or_default()
    })
}

/// Get the list of Principals who follow this user.
#[ic_cdk::query]
pub fn get_followers(followee: Principal) -> Vec<Principal> {
    FOLLOWING.with(|following| {
        following.borrow().iter()
            .filter_map(|(follower, followees)| {
                if followees.contains(&followee) {
                    Some(*follower)
                } else {
                    None
                }
            })
            .collect()
    })
}
