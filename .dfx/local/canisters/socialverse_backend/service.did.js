export const idlFactory = ({ IDL }) => {
  const Profile = IDL.Record({
    'bio' : IDL.Text,
    'user_principal' : IDL.Principal,
    'username' : IDL.Text,
    'name' : IDL.Text,
    'avatar' : IDL.Opt(IDL.Text),
  });
  const Post = IDL.Record({
    'id' : IDL.Nat64,
    'content' : IDL.Text,
    'author' : IDL.Text,
    'likes' : IDL.Vec(IDL.Principal),
    'timestamp' : IDL.Nat64,
    'image' : IDL.Opt(IDL.Text),
    'comments' : IDL.Vec(
      IDL.Record({
        'user_principal' : IDL.Principal,
        'username' : IDL.Text,
        'text' : IDL.Text,
        'timestamp' : IDL.Nat64,
      })
    ),
  });
  return IDL.Service({
    'add_comment' : IDL.Func(
        [
          IDL.Nat64,
          IDL.Record({
            'user_principal' : IDL.Principal,
            'username' : IDL.Text,
            'text' : IDL.Text,
            'timestamp' : IDL.Nat64,
          }),
        ],
        [IDL.Bool],
        [],
      ),
    'add_or_update_profile' : IDL.Func([Profile], [], []),
    'add_post' : IDL.Func(
        [IDL.Text, IDL.Principal, IDL.Text, IDL.Opt(IDL.Text)],
        [IDL.Nat64],
        [],
      ),
    'follow_user' : IDL.Func([IDL.Principal, IDL.Principal], [IDL.Bool], []),
    'get_all_profiles' : IDL.Func([], [IDL.Vec(Profile)], ['query']),
    'get_comments' : IDL.Func(
        [IDL.Nat64],
        [
          IDL.Vec(
            IDL.Record({
              'user_principal' : IDL.Principal,
              'username' : IDL.Text,
              'text' : IDL.Text,
              'timestamp' : IDL.Nat64,
            })
          ),
        ],
        ['query'],
      ),
    'get_followers' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'get_following' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'get_posts' : IDL.Func([], [IDL.Vec(Post)], ['query']),
    'get_profile' : IDL.Func([IDL.Text], [IDL.Opt(Profile)], ['query']),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'like_post' : IDL.Func([IDL.Nat64, IDL.Principal], [IDL.Bool], []),
    'unfollow_user' : IDL.Func([IDL.Principal, IDL.Principal], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
