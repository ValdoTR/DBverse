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

export {};
