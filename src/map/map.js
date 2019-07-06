//Data of maps
const map = {
    //list of maps
    maps : null,
    currMap : {
        mapName : null,
        mapImage : null,
        isDark : null,
        mapThumbnail : null,
        zones : null,
    },
};

//IIFE that fetches for map list
(()=>{
    fetch('./src/map/mapList.json')
    .then((res)=>{
        return res.json();
    }).then((bd)=>{
        map.maps = bd;
        console.log('done fetching maps!');
        console.log(`${Object.keys(map.maps).length} Maps Available`);
    })
    .catch((err)=>{
        console.error(err);
    })
})()

