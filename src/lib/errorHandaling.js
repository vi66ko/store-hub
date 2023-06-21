


function handleError(fn) {
    return function (...params) {
        return fn(...prams).catch(function (error) {
            // log the error to the database
        });
    }
}


// let test = handleError(myfunction)

// 1. It will return the fist function in the scope & assign it to the test variable

// test(1, 2, 3)

// 2. It will run the first returned function with the 1,2,3 


function doublet(callback, ...args) {
    try {
        const result = callback(...args);

        if (result instanceof Promise) {
            return result
                .then(data => { return { error: null, data } })
                .catch(error => { return { error, data: null } })
        }

        return { error: null, data: result }
    } catch (error) {
        return { error, data: null }


    }

}

function promiseTest(toReject) {

    return new Promise((resolve, reject) => {

        throw new Error("some mesagee");

        setTimeout(() => {

            if (toReject) {
                return reject('rejected')
            }


            return resolve(`Ok let's go`)

        }, 1)
    })
}


(async () => {
    console.log("#### START ####")
    // let letSee = await doublet(promiseTest, false)
    const mixMach = await promiseTest(true).catch(error => error)
    console.log(mixMach)
    // if(error){

    // }
    // console.log(data)
    // console.log(letSee.error.message)
    // console.log(letSee.error.code)
    // console.log(letSee.error.message)

})();