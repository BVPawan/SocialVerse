import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'add_post' : ActorMethod<[string, string, [] | [string]], bigint>,
  'get_posts' : ActorMethod<
    [],
    Array<
      {
        'id' : bigint,
        'content' : string,
        'author' : string,
        'timestamp' : bigint,
        'image' : [] | [string],
      }
    >
  >,
  'greet' : ActorMethod<[string], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
