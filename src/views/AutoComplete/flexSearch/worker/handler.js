import Index from "../index.js";

export default function(data) {

    data = data["data"];

    /** @type Index */
    const index = self["_index"];
    const args = data["args"];
    const task = data["task"];

    switch(task){

        case "init":

            const options = data["options"] || {};
            const factory = data["factory"];
            const encode = options["encode"];

            options["cache"] = false;

            if(encode && (encode.indexOf("function") === 0)){

                options["encode"] = Function("return " + encode)();
            }

            if(factory){

                // export the FlexSearch global payload to "self"
                function workerFun() {
                    self && (self.onmessage = (e) => {
                        console.log(self.postMessage.toString());
                        self.postMessage && self.postMessage(e.data, 'abcdef');
                    })
                }

                console.log(Function("return " + workerFun.toString())()(self))
                
                Function("return " + workerFun.toString())()(self);


                /** @type Index */
                // self["_index"] = new self["FlexSearch"]["Index"](options);

                // destroy the exported payload
                // delete self["FlexSearch"];
            }
            else{

                self["_index"] = new Index(options);
            }

            break;

        default:

            const id = data["id"];
            const message = index[task].apply(index, args);
            postMessage(task === "search" ? { "id": id, "msg": message } : { "id": id });
    }
};
