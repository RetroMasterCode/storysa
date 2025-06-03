let mission_on = {};
let notcar = {};

addCommandHandler("armour", function (command, parameters, client) {
    client.player.armour = 100;
    messageClient('✔ Body armor on',client, COLOUR_LIME);
});
addCommandHandler("healme", function (command, parameters, client) {
    client.player.health = 100;
    messageClient('✔ Life is replenished',client, COLOUR_LIME);
});
addCommandHandler("setgun", function (command, parameters, client) {
    var number = parseInt(parameters);

    if (!number) {
        messageClient('/setgun [number]',client, COLOUR_LIME);
        messageClient('1 - Desert Eagle',client, COLOUR_LIME);
        messageClient('2 - Combat Shotgun',client, COLOUR_LIME);
        messageClient('3 - MP5',client, COLOUR_LIME);
        messageClient('4 - Silenced 9mm',client, COLOUR_LIME);
        messageClient('5 - Grenade',client, COLOUR_LIME);
        messageClient('6 - Knife',client, COLOUR_LIME);
        return;
    }
    const weapons = {
        1: 24, 
        2: 27,  
        3: 29, 
        4: 23, 
        5: 16,
        6: 4 
    };
    client.player.giveWeapon(weapons[number], 99999, true);
});
addCommandHandler("veh", function(command, parameters, client) {
    var model = parseInt(parameters);
    if(notcar[client.id].despawncar == true) { messageClient('You have already created a transport!',client, COLOUR_LIME);   }
    if (!model) {
        return messageClient('/veh [vehicle-id]',client, COLOUR_LIME);
    }
    if(notcar[client.id].despawncar == false)
    {
        var vehicle = gta.createVehicle(model, client.player.position);
        vehicle.engine = true;
        vehicle.colour1 = 0;
        vehicle.colour2 = 0;
        vehicle.colour3 = 0;
        vehicle.colour4 = 0;
        addToWorld(vehicle);
        notcar[client.id] = { despawncar: true };
    }
});
addCommandHandler("mission", function (command, parameters, client) {
    const mission = parseInt(parameters);
    if(mission_on[client.id].active == true) { messageClient('You have already started the mission!' ,client, COLOUR_LIME);  }
    if (!mission) {
        return messageClient('/mission [id]', client, COLOUR_LIME);
    }
    if (mission > 150) {
        return messageClient('Максимум 150!', client, COLOUR_LIME);
    }
    if(mission_on[client.id].active == false)
    {
        triggerNetworkEvent("StartMission", client, mission);
        mission_on[client.id] = { active: true };
    }
    else
    {
        triggerNetworkEvent("CancelMission", client, false);
        mission_on[client.id] = { active: false };
    }
});
addCommandHandler("spawn", function (command, parameters, client) {
	fadeCamera(client, true);
        triggerNetworkEvent("RestoreCamera", client, false);
        mission_on[client.id] = { active: false };
        notcar[client.id] = { despawncar: false };
        spawnPlayer(client, [-711, 957, 12.4], 0, 0);
});
addEventHandler("OnPlayerJoined", (event, client) => {
    if (server.game == GAME_GTA_SA) {
        messageClient('✨ Welcome to the server Mission by Jessie ✨',client, COLOUR_LIME);
        messageClient('▶Command server◀',client, COLOUR_LIME);
        messageClient('▶/mission [id], /veh [id]◀',client, COLOUR_LIME);
        messageClient('▶/setgun [num], /healme, /armour◀',client, COLOUR_LIME);
		fadeCamera(client, true);
        triggerNetworkEvent("RestoreCamera", client, false);
        mission_on[client.id] = { active: false };
        notcar[client.id] = { despawncar: false };
        spawnPlayer(client, [-711, 957, 12.4], 0, 0);
    }
});