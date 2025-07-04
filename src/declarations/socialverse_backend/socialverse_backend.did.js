export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'add_post' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Opt(IDL.Text)],
        [IDL.Nat64],
        [],
      ),
    'get_posts' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Nat64,
              'content' : IDL.Text,
              'author' : IDL.Text,
              'timestamp' : IDL.Nat64,
              'image' : IDL.Opt(IDL.Text),
            })
          ),
        ],
        [],
      ),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
