/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra"

console.log('Script started successfully')

// Tours layers
const DB_SCHENKER_HQ = 'DB_Schenker_HQ'
const DB_CONNECT = 'DB_Connect'
const DB_SCHENKER_LOGISTICS = 'DB_Schenker_Logistics'
const BERLIN_MAIN_STATION = 'Berlin_Main_Station'
const BAHNTOWER = 'Bahntower'
const SILVER_TOWER = 'Silver_Tower'

let currentLevel = 0
let playerOnStairs = false

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready')
    console.log('Player tags: ',WA.player.tags)

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready')

        if (WA.state.currentMap === 'city') {
            listenTour(DB_SCHENKER_HQ)
            listenTour(DB_CONNECT)
            listenTour(DB_SCHENKER_LOGISTICS)
            listenTour(BERLIN_MAIN_STATION)
            listenTour(BAHNTOWER)
            listenTour(SILVER_TOWER)
        }
    
        if (WA.state.currentMap === 'station') {
            // for now, we have to disable WebRTC when players on different levels can be on the same 2D position.
            WA.room.onEnterLayer("webrtc").subscribe(() => {
                WA.controls.restorePlayerProximityMeeting()
            })
            WA.room.onLeaveLayer("webrtc").subscribe(() => {
                WA.controls.disablePlayerProximityMeeting()
            })

            // We are on level0 by default
            hideLevel(1)
            hideLevel(-1)
    
            listenStairs()
    
            // Switch levels
            listenLevel(1)
            listenLevel(0)
            listenLevel(-1)
    
            // Hide roofs when player walk below them
            WA.room.onEnterLayer(`level${currentLevel}/above/roof1`).subscribe(() => {
                hideMultipleLayers([
                    `level${currentLevel}/above/roof3`,
                    `level${currentLevel}/above/roof2`,
                    `level${currentLevel}/above/roof1`
                ])
            })
            WA.room.onLeaveLayer(`level${currentLevel}/above/roof1`).subscribe(() => {
                showMultipleLayers([
                    `level${currentLevel}/above/roof3`,
                    `level${currentLevel}/above/roof2`,
                    `level${currentLevel}/above/roof1`
                ])
            })
        }    
    }).catch(e => console.error(e))
}).catch(e => console.error(e))

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
        playerOnStairs = true
    })
    WA.room.area.onLeave('stairs').subscribe(() => {
        playerOnStairs = false
    })
}

const listenLevel = (level: number) => {
    WA.room.onEnterLayer(`level${level}/floor/floor1`).subscribe(() => {
        if (playerOnStairs) {
            // show the level we are on
            currentLevel = level
            showLevel(level)

            // hide all levels except the current one
            const levels: number[] = [-1, 0, 1]
            const levelsToHide = levels.filter(l => l !== level)
            console.log('levelsToHide',levelsToHide)
            for (let level of levelsToHide) {
                hideLevel(level)
            }
        }
    })
}

const showLevel = (level: number) => {
    showMultipleLayers([
        `level${level}/above/above3`,
        `level${level}/above/above2`,
        `level${level}/above/above1`,
        `level${level}/above/roof3`,
        `level${level}/above/roof2`,
        `level${level}/above/roof1`,
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
        `level${level}/collisions`,
        `level${level}/floor/floor1`,
        `level${level}/floor/floor2`,
        `level${level}/walls/walls1`,
        `level${level}/walls/walls2`,
        `level${level}/furniture/furniture1`,
        `level${level}/furniture/furniture2`,
        `level${level}/furniture/furniture3`,
        `level${level}/above/roof1`,
        `level${level}/above/roof2`,
        `level${level}/above/roof3`,
        `level${level}/above/above1`,
        `level${level}/above/above2`,
        `level${level}/above/above3`
    ])
}

const showMultipleLayers = (layers: string[]) => {
    console.log('-----------------------------')
    console.log('currentLevel',currentLevel)
    for(let layer of layers) {
        console.log("SHOW layer", layer)
        WA.room.showLayer(layer)
    }
}
const hideMultipleLayers = (layers: string[]) => {
    console.log('-----------------------------')
    console.log('currentLevel',currentLevel)
    for(let layer of layers) {
        console.log("HIDE layer", layer)
        WA.room.hideLayer(layer)
    }
}

export {}
