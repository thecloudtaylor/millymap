const loc = `{
    "locations": [
        {
            "mainName": "Redmond, OR",
            "description": "address",
            "lat": "44.241206",
            "long": "-121.203432"
        },
        {
            "mainName": "Yuma, AZ",
            "description": "address",
            "lat": "32.660249",
            "long": "-114.449449"
        }
    ]
}`



interface location {
    mainName: string
    description: string
    lat: Float32Array
    long: Float32Array
  }

/**
 * CreatePinLIst
 */
function CreatePinList() {
    let locations: { string: location[] } = JSON.parse(loc.toString());
    console.log(locations)
    return locations.locations
}