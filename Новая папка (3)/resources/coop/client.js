addNetworkHandler("StartMission", function (missionId) {
    gta.startMission(missionId);
});
addNetworkHandler("StartMission", function (bool) {
    gta.cancelMission(bool);
});
addNetworkHandler("RestoreCamera", function (bool) {
    gta.restoreCamera(bool);
});