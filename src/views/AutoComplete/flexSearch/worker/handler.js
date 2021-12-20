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
                Function("return " + factory)()(self);

                /** @type Index */
                // console.log(self["_index"]);
                self["_index"] = new self["FlexSearch"]["Index"](options);

                // destroy the exported payload
                delete self["FlexSearch"];
            }
            else{

                self["_index"] = new Index(options);
            }

            break;

        default:

            const id = data["id"];
            const message = index[task].apply(index, args);
            let sum = 0;
            for (let index = 0; index < 40000; index++) {
                sum ++
            }
            console.log(sum);
            postMessage(task === "search" ? { "id": id, "msg": message } : { "id": id });
    }
};
