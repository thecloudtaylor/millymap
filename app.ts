/// <reference path="node_modules/bingmaps/types/MicrosoftMaps/Microsoft.Maps.d.ts"/>
const loc = `{
    "locations": [
        {
            "mainName": "Colorado Springs, CO",
            "description": "607 N Foote Ave",
            "lat": "38.842028",
            "long": "-104.800073"
        },
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
        },
        {
            "mainName": "Jamica",
            "description": "address",
            "lat": "18.397274",
            "long": "-78.288136"
        }
    ]
}`

interface location {
    mainName: string
    description: string
    lat: Float32Array
    long: Float32Array
  }


class PushPinAndLocations {
    public PushPins:Microsoft.Maps.Pushpin[]
    public MapLocations:Microsoft.Maps.Location[]
    public length = 0;

    public Add(PushPin:Microsoft.Maps.Pushpin,  MapLocation:Microsoft.Maps.Location)
    {
        console.log("In PushPinAndLocations.Add()")
        
        this.PushPins.push(PushPin);
        this.MapLocations.push(MapLocation)
        this.length++;
    }

    constructor(){
        console.log("In PushPinAndLocations()")
        
        this.PushPins = new Array<Microsoft.Maps.Pushpin>();
        this.MapLocations = new Array<Microsoft.Maps.Location>();
    }
}

/**
 * CreatePinLIst
 */
function ParseLocationJson() {
    console.log("In ParseLocationJson()")

    let locations: { string: location[] }[] = JSON.parse(loc);
    console.log(locations)
    return locations.locations;    
}

function CreatePinArray()
{
    console.log("In CreatePinArray()")
    var locations:location[] = ParseLocationJson();

    var pushPinandLoc:PushPinAndLocations;

    pushPinandLoc = new PushPinAndLocations();


    if (locations != null)
    {
        console.log(locations)
        
        for (var index = 0; index < locations.length; index++)
        {
            var mapLoc = new Microsoft.Maps.Location(locations[index].lat, locations[index].long);

            var pin = new Microsoft.Maps.Pushpin(mapLoc, {
                title: locations[index].mainName,
                subTitle: locations[index].description,
                text: (index+1).toString()
            });
            console.log("test")
            pushPinandLoc.Add(pin, mapLoc);
            console.log("CreatePinArray() - Added ", locations[index].mainName, "to Map")

        }
    }
    return pushPinandLoc;
}

function CreateMap(){
    console.log("In GetMap()")

    var map:Microsoft.Maps.Map;

    map = new Microsoft.Maps.Map('#myMap', {
        center: new Microsoft.Maps.Location(38.842028, -104.800073)
    });

    var pushPinandLoc:PushPinAndLocations = CreatePinArray();

    AddPinsToMap(map, pushPinandLoc);

    var rect = Microsoft.Maps.LocationRect.fromLocations(pushPinandLoc.MapLocations);
    window.addEventListener("resize", handleResize);
    Microsoft.Maps.Events.addHandler(map, 'rightclick', (e) => { handleMapClick( e); });


    map.setView({ bounds: rect, padding: 80 }); 
    handleResize();
}

function AddPinsToMap(map:Microsoft.Maps.Map, pushPinandLoc:PushPinAndLocations){
    for (var index = 0; index < pushPinandLoc.length; index++)
    {
        //Add the pushpin to the map
        map.entities.push(pushPinandLoc.PushPins[index]);
    }
}

function handleResize() {
    var mapDiv = document.getElementById('myMap');
    mapDiv.style.width = (document.documentElement.scrollWidth *.9)  + 'px';
    mapDiv.style.height = (document.documentElement.scrollHeight *.9)+ 'px';
}

function handleMapClick(e: MouseEventArgs){
    console.log("In handleMapClick()")

    var map = new Microsoft.Maps.Map(
        document.getElementById('myMap'),
        {
            /* No need to set credentials if already passed in URL */
        }
    );

    var pin = new Microsoft.Maps.Pushpin(e.location, {
        title: "test",
        subTitle: "test",
        text: ("100").toString()
    });

    console.log(map.entities);

    var pushPinandLoc:PushPinAndLocations = CreatePinArray();

    pushPinandLoc.Add(pin, e.location);
    AddPinsToMap(map, pushPinandLoc);

    map.setView({
        center: e.location,
        zoom: 10
    });


    var infobox = new Microsoft.Maps.Infobox(e.location, { 
        title: 'New Location', 
        showCloseButton: true,
        description: 'Description: <input id="infoboxDescription" type="text" onclick="this.select();"/><br>' + 
            'Placed By: <input id="infoboxName" type="text" onclick="this.select();"/>',
        actions: [{
            label: 'Save',
            eventHandler: function () {
                alert('handleSave');
            }
        }, {
            label: 'Cancle',
            eventHandler: function () {
                alert('handleCancel');
            }
        }] 
    });
    infobox.setMap(map);    
}