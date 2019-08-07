const moment = require("moment")
const axios = require("axios")

// saving infromation about the requests
const allRequests = []

////////// FILL IN AND ADJUST BEFORE RUNNING
const account = {
  username: '',
  password: ''
}
const iterations = 120
const delay = 1.5
////////// FILL IN AND ADJUST BEFORE RUNNING
//////////
function wait(second) {
  return new Promise(resolve => {
    setTimeout(resolve, second * 1000)
  })
}

function makeRequest() {
  const today = moment()
    .utc()
    .startOf("day")
    .format()

  return {
    baseURL: "https://api.xsellco.com/v1",
    timeout: 55000,
    headers: {
      "Content-Type": "Application/json",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36"
    },
    auth: {
      username: account.username,
      password: account.password
    },
    params: {
      ordered_after: today,
      page: 1,
      page_limit: 10
    }
  }
}


async function sendReq(idx) {
  try {
    // wait at least one second to not go over 60 requests per minute rate limit
    const waitTime = idx * delay
    console.log(idx, ': will wait', waitTime)
    await wait(waitTime)
    console.log(idx, ': waited ', waitTime)

    allRequests.push({idx: idx, sentRequestAt: moment.utc().toISOString()})
    const res = await axios.get("/orders", makeRequest())
    console.log('The data length in response:', res.data.data.length)
  } catch (e) {
    console.log(allRequests)
    console.log(e)
  }
}

async function test() {
  try {
    let promises = []

    for (i = 0; i < iterations ; i++) {
      promises.push(sendReq(i))
    }

    await Promise.all(promises)

    console.log(allRequests)
    process.exit()
  } catch (e) {
    console.log(allRequests)
    console.log(e)
  }
}

test()
