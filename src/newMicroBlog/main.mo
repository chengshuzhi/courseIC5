import List "mo:base/List";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Time "mo:base/Time";


actor {
    public type Message =  {
        content : Text;
        time : Time.Time;
        author: Text;
    };

    public type MicroBlog = actor {
        follow : shared(Principal) -> async ();
        follows : shared query () -> async [Principal];
        post : shared(Message) -> async ();
        postsByTime : shared query (Time.Time) -> async [Message];
        posts : shared query () -> async [Message];
        timeline : shared(Time.Time) -> async [Message]; 
    };

    private stable var author = "";

    stable var followed: List.List<Principal> = List.nil();

    public shared func follow(id: Principal) : async () {
        followed := List.push(id, followed);
    };

    public shared query func follows () : async [Principal] {
        List.toArray(followed);
    };

    stable var messages : List.List<Message> = List.nil();

    public shared(msg) func post (otp: Text, text: Text) : async () {
        // assert (Principal.toText(msg.caller) == "idboi-b5xwr-sqmib-et732-6xddj-bauzl-4cpjf-s3tin-updwk-c3l2v-fqe");
        assert (otp == "123456");
        let message : Message = {
            content = text;
            time = Time.now();
            author = author;
        };
        messages := List.push(message, messages);
    };

    public shared query func posts () : async [Message] {
        var posts : List.List<Message> = List.nil();
        for (message in Iter.fromList(messages)) {
            posts := List.push(message, posts);
        };
        List.toArray(posts);
    };

    public shared query func postsByTime (since: Time.Time) : async [Message] {
        var posts : List.List<Message> = List.nil();
        for (message in Iter.fromList(messages)) {
            if (message.time >= since) {
                posts := List.push(message, posts);
            };
        };
        List.toArray(posts);
    };

    public shared func timeline(since : Time.Time) : async [Message] {
        var all : List.List<Message> = List.nil();
        for (id in Iter.fromList(followed)) {
            let canister : MicroBlog = actor (Principal.toText(id));
            let msgs = await canister.postsByTime(since);
            for (msg in Iter.fromArray(msgs)) {
                all := List.push(msg, all);
            };
        };
        List.toArray(all);
    };

    public shared func followPost(follow : Principal) : async [Message] {
        var all : List.List<Message> = List.nil();
        let canister : MicroBlog = actor (Principal.toText(follow));
        let msgs = await canister.posts();
        for (msg in Iter.fromArray(msgs)) {
                all := List.push(msg, all);
        };
        List.toArray(all);
    };

    public shared func set_name (name: Text) : async () {
        author := name;
    };

    public shared func get_name() : async Text {
        return author;
    }

};
