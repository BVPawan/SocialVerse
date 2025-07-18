import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Post {
  'id' : bigint,
  'content' : string,
  'author' : string,
  'likes' : Array<Principal>,
  'timestamp' : bigint,
  'image' : [] | [string],
  'comments' : Array<
    {
      'user_principal' : Principal,
      'username' : string,
      'text' : string,
      'timestamp' : bigint,
    }
  >,
}
export interface Profile {
  'bio' : string,
  'user_principal' : Principal,
  'username' : string,
  'name' : string,
  'avatar' : [] | [string],
}
export interface _SERVICE {
  'add_comment' : ActorMethod<
    [
      bigint,
      {
        'user_principal' : Principal,
        'username' : string,
        'text' : string,
        'timestamp' : bigint,
      },
    ],
    boolean
  >,
  'add_or_update_profile' : ActorMethod<[Profile], undefined>,
  'add_post' : ActorMethod<[string, Principal, string, [] | [string]], bigint>,
  'follow_user' : ActorMethod<[Principal, Principal], boolean>,
  'get_all_profiles' : ActorMethod<[], Array<Profile>>,
  'get_comments' : ActorMethod<
    [bigint],
    Array<
      {
        'user_principal' : Principal,
        'username' : string,
        'text' : string,
        'timestamp' : bigint,
      }
    >
  >,
  'get_followers' : ActorMethod<[Principal], Array<Principal>>,
  'get_following' : ActorMethod<[Principal], Array<Principal>>,
  'get_posts' : ActorMethod<[], Array<Post>>,
  'get_profile' : ActorMethod<[string], [] | [Profile]>,
  'greet' : ActorMethod<[string], string>,
  'like_post' : ActorMethod<[bigint, Principal], boolean>,
  'unfollow_user' : ActorMethod<[Principal, Principal], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
