// getData(endpointNPR)
// .then(prData => {
//     // console.log('all Park & ride data:', prData);

// })

const endpointNPR = 'http://gist.github.com/NathanNeelis/b28e16c0433b12da6bc716b276901ae9'

getData(endpointNPR);
async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
}