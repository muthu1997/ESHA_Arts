export const getFunction = async(callback) => {
    fetch("https://bloodbankbackendmiet.herokuapp.com/getWorkoutData", {
        headers: {
            method: "GET",
            "ACCEPT": "application/json"
        }
    }).then(res => res.json())
    .then(res => {
        callback(res)
    })
    .catch(e => {
        callback("error")
    })
}