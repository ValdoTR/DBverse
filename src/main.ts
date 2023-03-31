/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

// Tours layers
const DB_SCHENKER_HQ = 'DB_Schenker_HQ'
const DB_CONNECT = 'DB_Connect'
const DB_SCHENKER_LOGISTICS = 'DB_Schenker_Logistics'
const BERLIN_MAIN_STATION = 'Berlin_Main_Station'
const BAHNTOWER = 'Bahntower'
const SILVER_TOWER = 'Silver_Tower'

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    listenTour(DB_SCHENKER_HQ)
    listenTour(DB_CONNECT)
    listenTour(DB_SCHENKER_LOGISTICS)
    listenTour(BERLIN_MAIN_STATION)
    listenTour(BAHNTOWER)
    listenTour(SILVER_TOWER)

    // We are on level0 by default
    hideLevel(1)
    hideLevel(-1)

    listenStairs()

    // Switch levels
    listenLevel(1)
    listenLevel(0)
    listenLevel(-1)

    // Walk below level0 roofs
    if (WA.state.currentLevel === 0) {
        WA.room.onEnterLayer("level0/above/roof1").subscribe(() => {
            hideMultipleLayers([
                "level0/above/roof3",
                "level0/above/roof2",
                "level0/above/roof1"
            ])
        })
        WA.room.onLeaveLayer("level0/above/roof1").subscribe(() => {
            showMultipleLayers([
                "level0/above/roof3",
                "level0/above/roof2",
                "level0/above/roof1"
            ])
        })
    }

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

const listenTour = (tour: string) => {
    WA.room.area.onEnter('Behind_' + tour).subscribe(() => {
        WA.room.hideLayer('above/' + tour)
    })
    WA.room.area.onLeave('Behind_' + tour).subscribe(() => {
        WA.room.showLayer('above/' + tour)
    })
}

const listenStairs = () => {
    WA.room.area.onEnter('stairs').subscribe(() => {
        WA.state.playerOnStairs = true
    })
    WA.room.area.onLeave('stairs').subscribe(() => {
        WA.state.playerOnStairs = false
    })
}

const listenLevel = (level: number) => {
    WA.room.onEnterLayer(`level${level}/floor/floor1`).subscribe(() => {
        if (WA.state.playerOnStairs) {
              // hide all levels except the current one
            const levels: number[] = [-1, 0, 1]
            const levelsToHide = levels.filter(l => l !== level)
            console.log('levelsToHide',levelsToHide)
            for (let level of levelsToHide) {
                hideLevel(level)
            }
          
            // then show the level we are on
            WA.state.currentLevel = level
            showLevel(level)
        }
    })
}

const showLevel = (level: number) => {
    showMultipleLayers([
        `level${level}/above/above3`,
        `level${level}/above/above2`,
        `level${level}/above/above1`,
        `level${level}/furniture/furniture3`,
        `level${level}/furniture/furniture2`,
        `level${level}/furniture/furniture1`,
        `level${level}/walls/walls2`,
        `level${level}/walls/walls1`,
        `level${level}/floor/floor2`,
        `level${level}/floor/floor1`,
        `level${level}/collisions`
    ])
}
const hideLevel = (level: number) => {
    hideMultipleLayers([
        `level${level}/above/above3`,
        `level${level}/above/above2`,
        `level${level}/above/above1`,
        `level${level}/furniture/furniture3`,
        `level${level}/furniture/furniture2`,
        `level${level}/furniture/furniture1`,
        `level${level}/walls/walls2`,
        `level${level}/walls/walls1`,
        `level${level}/floor/floor2`,
        `level${level}/floor/floor1`,
        `level${level}/collisions`
    ])
}

const showMultipleLayers = (layers: string[]) => {
    console.log('-----------------------------')
    console.log('WA.state.currentLevel',WA.state.currentLevel)
    for(let layer of layers) {
        console.log("SHOW layer", layer)
        WA.room.showLayer(layer)
    }
}
const hideMultipleLayers = (layers: string[]) => {
    console.log('-----------------------------')
    console.log('WA.state.currentLevel',WA.state.currentLevel)
    for(let layer of layers) {
        console.log("HIDE layer", layer)
        WA.room.hideLayer(layer)
    }
}

export {};
