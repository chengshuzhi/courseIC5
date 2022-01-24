import type { Principal } from '@dfinity/principal';
export interface Message {
  'content' : string,
  'time' : Time,
  'author' : string,
}
export type Time = bigint;
export interface _SERVICE {
  'follow' : (arg_0: Principal) => Promise<undefined>,
  'followPost' : (arg_0: Principal) => Promise<Array<Message>>,
  'follows' : () => Promise<Array<Principal>>,
  'get_name' : () => Promise<string>,
  'post' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'posts' : () => Promise<Array<Message>>,
  'postsByTime' : (arg_0: Time) => Promise<Array<Message>>,
  'set_name' : (arg_0: string) => Promise<undefined>,
  'timeline' : (arg_0: Time) => Promise<Array<Message>>,
}
