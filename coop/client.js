// ════════════════════════════════════════════════════════════════
// GTA CONNECTED CLIENT - СИСТЕМА МИССИЙ v7.5 CLIENT
// Дата: 2025-06-04 06:02:09
// Автор: RetroMasterCode
// КЛИЕНТСКАЯ ЧАСТЬ для запуска миссий и розыска
// ════════════════════════════════════════════════════════════════

console.log("CLIENT: Инициализация клиентского скрипта миссий v7.5");

// ════════════════════════════════════════════════════════════════
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ КЛИЕНТА
// ════════════════════════════════════════════════════════════════

let clientMissionActive = false;
let clientWantedLevel = 0;
let debugMode = false;

// ════════════════════════════════════════════════════════════════
// КЛИЕНТСКИЕ ОБРАБОТЧИКИ МИССИЙ v7.5
// ════════════════════════════════════════════════════════════════

// Обработчик запуска миссии
addNetworkHandler("startMissionForClient", function(missionId) {
    console.log("CLIENT: Получен запрос на запуск миссии " + missionId);
    
    try {
        // Проверяем, не запущена ли уже миссия
        if (gta.onMission) {
            console.log("CLIENT: Отменяем текущую миссию перед запуском новой");
            gta.cancelMission();
            
            // Небольшая задержка перед запуском новой миссии
            setTimeout(function() {
                console.log("CLIENT: Запускаем миссию " + missionId + " через gta.startMission");
                gta.startMission(missionId);
                clientMissionActive = true;
                console.log("CLIENT: Миссия " + missionId + " запущена успешно");
                
                // Отправляем подтверждение на сервер
                triggerServerEvent("clientMissionStarted", missionId);
            }, 500);
        } else {
            console.log("CLIENT: Запускаем миссию " + missionId + " через gta.startMission");
            gta.startMission(missionId);
            clientMissionActive = true;
            console.log("CLIENT: Миссия " + missionId + " запущена успешно");
            
            // Отправляем подтверждение на сервер
            triggerServerEvent("clientMissionStarted", missionId);
        }
        
    } catch (error) {
        console.log("CLIENT: Ошибка запуска миссии " + missionId + ": " + error.message);
        triggerServerEvent("clientMissionError", "Ошибка запуска: " + error.message);
    }
});

// Обработчик отмены миссии
addNetworkHandler("cancelMissionForClient", function() {
    console.log("CLIENT: Получен запрос на отмену миссии");
    
    try {
        if (gta.onMission) {
            gta.cancelMission();
            clientMissionActive = false;
            console.log("CLIENT: Миссия отменена успешно");
            triggerServerEvent("clientMissionCancelled");
        } else {
            console.log("CLIENT: Миссия не была запущена");
            clientMissionActive = false;
        }
    } catch (error) {
        console.log("CLIENT: Ошибка отмены миссии: " + error.message);
        triggerServerEvent("clientMissionError", "Ошибка отмены: " + error.message);
    }
});

// ════════════════════════════════════════════════════════════════
// КЛИЕНТСКИЕ ОБРАБОТЧИКИ РОЗЫСКА v7.5
// ════════════════════════════════════════════════════════════════

// Обработчик установки уровня розыска
addNetworkHandler("setWantedLevelForClient", function(level) {
    console.log("CLIENT: Получен запрос на установку розыска " + level);
    
    try {
        // Получаем объект игрока
        const player = localPlayer;
        
        if (player) {
            console.log("CLIENT: Устанавливаем wantedLevel = " + level);
            player.wantedLevel = level;
            clientWantedLevel = level;
            console.log("CLIENT: Розыск установлен успешно: " + level);
            
            // Дополнительная проверка
            setTimeout(function() {
                const currentLevel = player.wantedLevel;
                console.log("CLIENT: Проверка установки розыска - текущий уровень: " + currentLevel);
                
                // Отправляем подтверждение на сервер
                triggerServerEvent("clientWantedLevelSet", currentLevel);
            }, 100);
            
        } else {
            console.log("CLIENT: Ошибка - localPlayer не найден");
            triggerServerEvent("clientWantedLevelError", "localPlayer не найден");
        }
        
    } catch (error) {
        console.log("CLIENT: Ошибка установки розыска: " + error.message);
        triggerServerEvent("clientWantedLevelError", error.message);
    }
});

// Обработчик получения текущего уровня розыска
addNetworkHandler("getWantedLevelForClient", function() {
    console.log("CLIENT: Получен запрос на получение уровня розыска");
    
    try {
        const player = localPlayer;
        
        if (player) {
            const currentLevel = player.wantedLevel;
            clientWantedLevel = currentLevel;
            console.log("CLIENT: Текущий уровень розыска: " + currentLevel);
            
            // Отправляем ответ на сервер
            triggerServerEvent("clientWantedLevelResponse", currentLevel);
        } else {
            console.log("CLIENT: Ошибка - localPlayer не найден");
            triggerServerEvent("clientWantedLevelResponse", 0);
        }
        
    } catch (error) {
        console.log("CLIENT: Ошибка получения розыска: " + error.message);
        triggerServerEvent("clientWantedLevelResponse", 0);
    }
});

// ════════════════════════════════════════════════════════════════
// ОБРАБОТЧИКИ СОБЫТИЙ МИССИЙ v7.5
// ════════════════════════════════════════════════════════════════

// Обработчик завершения миссии
addEventHandler("onMissionComplete", function(event, missionId) {
    console.log("CLIENT: Миссия " + missionId + " завершена");
    clientMissionActive = false;
    triggerServerEvent("clientMissionCompleted", missionId);
});

// Обработчик провала миссии
addEventHandler("onMissionFailed", function(event, missionId) {
    console.log("CLIENT: Миссия " + missionId + " провалена");
    clientMissionActive = false;
    triggerServerEvent("clientMissionFailed", missionId);
});

// Обработчик начала миссии
addEventHandler("onMissionStart", function(event, missionId) {
    console.log("CLIENT: Миссия " + missionId + " начата");
    clientMissionActive = true;
    triggerServerEvent("clientMissionActuallyStarted", missionId);
});

// ════════════════════════════════════════════════════════════════
// ОБРАБОТЧИКИ ОТЛАДКИ И ДИАГНОСТИКИ v7.5
// ════════════════════════════════════════════════════════════════

// Функция для отладки состояния клиента
function debugClientState() {
    try {
        const player = localPlayer;
        
        console.log("CLIENT DEBUG: ═══ СОСТОЯНИЕ КЛИЕНТА ═══");
        
        if (player) {
            console.log("CLIENT DEBUG: localPlayer найден");
            console.log("CLIENT DEBUG: wantedLevel = " + player.wantedLevel);
            console.log("CLIENT DEBUG: clientWantedLevel = " + clientWantedLevel);
        } else {
            console.log("CLIENT DEBUG: localPlayer НЕ найден!");
        }
        
        console.log("CLIENT DEBUG: gta.onMission = " + gta.onMission);
        console.log("CLIENT DEBUG: clientMissionActive = " + clientMissionActive);
        console.log("CLIENT DEBUG: debugMode = " + debugMode);
        console.log("CLIENT DEBUG: ═══════════════════════");
        
        return {
            playerFound: !!player,
            wantedLevel: player ? player.wantedLevel : -1,
            onMission: gta.onMission,
            clientMissionActive: clientMissionActive,
            clientWantedLevel: clientWantedLevel
        };
        
    } catch (error) {
        console.log("CLIENT DEBUG: Ошибка отладки: " + error.message);
        return { error: error.message };
    }
}

// Обработчик команды отладки клиента
addNetworkHandler("debugClientState", function() {
    const state = debugClientState();
    triggerServerEvent("clientDebugResponse", state);
});

// Обработчик включения режима отладки
addNetworkHandler("enableClientDebug", function(enabled) {
    debugMode = enabled;
    console.log("CLIENT: Режим отладки " + (enabled ? "включен" : "выключен"));
});

// ════════════════════════════════════════════════════════════════
// АВТОМАТИЧЕСКАЯ СИНХРОНИЗАЦИЯ СОСТОЯНИЯ v7.5
// ════════════════════════════════════════════════════════════════

// Функция автоматической синхронизации состояния с сервером
function syncClientState() {
    try {
        const player = localPlayer;
        
        if (player) {
            const currentWanted = player.wantedLevel;
            const currentMission = gta.onMission;
            
            // Проверяем изменения
            if (currentWanted !== clientWantedLevel) {
                console.log("CLIENT: Обнаружено изменение розыска: " + clientWantedLevel + " -> " + currentWanted);
                clientWantedLevel = currentWanted;
                triggerServerEvent("clientWantedLevelChanged", currentWanted);
            }
            
            if (currentMission !== clientMissionActive) {
                console.log("CLIENT: Обнаружено изменение статуса миссии: " + clientMissionActive + " -> " + currentMission);
                clientMissionActive = currentMission;
                triggerServerEvent("clientMissionStateChanged", currentMission);
            }
        }
        
    } catch (error) {
        if (debugMode) {
            console.log("CLIENT: Ошибка синхронизации: " + error.message);
        }
    }
}

// Запускаем синхронизацию каждые 5 секунд
setInterval(syncClientState, 5000);

// ════════════════════════════════════════════════════════════════
// ОБРАБОТЧИКИ СПЕЦИАЛЬНЫХ КОМАНД v7.5
// ════════════════════════════════════════════════════════════════

// Обработчик принудительного сброса состояния
addNetworkHandler("forceResetClientState", function() {
    console.log("CLIENT: Принудительный сброс состояния клиента");
    
    try {
        if (gta.onMission) {
            gta.cancelMission();
        }
        
        const player = localPlayer;
        if (player) {
            player.wantedLevel = 0;
        }
        
        clientMissionActive = false;
        clientWantedLevel = 0;
        
        console.log("CLIENT: Состояние клиента сброшено");
        triggerServerEvent("clientStateReset");
        
    } catch (error) {
        console.log("CLIENT: Ошибка сброса состояния: " + error.message);
        triggerServerEvent("clientStateResetError", error.message);
    }
});

// Обработчик тестирования функций
addNetworkHandler("testClientFunctions", function() {
    console.log("CLIENT: Запуск тестирования клиентских функций");
    
    const results = {
        gta_available: typeof gta !== 'undefined',
        localPlayer_available: typeof localPlayer !== 'undefined',
        startMission_available: typeof gta.startMission === 'function',
        cancelMission_available: typeof gta.cancelMission === 'function',
        onMission_available: typeof gta.onMission !== 'undefined'
    };
    
    console.log("CLIENT: Результаты тестирования:", JSON.stringify(results));
    triggerServerEvent("clientTestResults", results);
});

// ════════════════════════════════════════════════════════════════
// ОБРАБОТЧИКИ СОБЫТИЙ ИГРЫ v7.5
// ════════════════════════════════════════════════════════════════

// Обработчик респавна игрока
addEventHandler("onLocalPlayerSpawned", function(event) {
    console.log("CLIENT: Игрок заrespawn-ился");
    
    // Синхронизируем состояние после респавна
    setTimeout(function() {
        syncClientState();
        triggerServerEvent("clientPlayerRespawned");
    }, 1000);
});

// Обработчик смерти игрока
addEventHandler("onLocalPlayerWasted", function(event) {
    console.log("CLIENT: Игрок умер");
    
    // При смерти отменяем миссию если была активна
    if (clientMissionActive && gta.onMission) {
        try {
            gta.cancelMission();
            clientMissionActive = false;
            console.log("CLIENT: Миссия отменена из-за смерти игрока");
        } catch (error) {
            console.log("CLIENT: Ошибка отмены миссии при смерти: " + error.message);
        }
    }
    
    triggerServerEvent("clientPlayerDied");
});

// ════════════════════════════════════════════════════════════════
// ИНИЦИАЛИЗАЦИЯ И ФИНАЛИЗАЦИЯ v7.5
// ════════════════════════════════════════════════════════════════

// Функция инициализации клиента
function initializeClient() {
    console.log("CLIENT: Начинаем инициализацию клиента v7.5");
    
    try {
        // Проверяем доступность основных функций
        if (typeof gta === 'undefined') {
            console.log("CLIENT: ОШИБКА - объект gta недоступен!");
            return false;
        }
        
        if (typeof localPlayer === 'undefined') {
            console.log("CLIENT: ОШИБКА - объект localPlayer недоступен!");
            return false;
        }
        
        console.log("CLIENT: Основные объекты доступны");
        
        // Синхронизируем начальное состояние
        syncClientState();
        
        console.log("CLIENT: Инициализация завершена успешно");
        
        // Уведомляем сервер о готовности
        triggerServerEvent("clientInitialized");
        
        return true;
        
    } catch (error) {
        console.log("CLIENT: Ошибка инициализации: " + error.message);
        return false;
    }
}

// Обработчик команды инициализации с сервера
addNetworkHandler("initializeClient", function() {
    initializeClient();
});

// Автоматическая инициализация через 2 секунды после загрузки
setTimeout(function() {
    initializeClient();
}, 2000);

// ════════════════════════════════════════════════════════════════
// СИСТЕМА ЛОГИРОВАНИЯ v7.5
// ════════════════════════════════════════════════════════════════

function logClientMessage(level, message) {
    const timestamp = new Date().toISOString();
    const logMessage = "[" + timestamp + "] CLIENT-" + level + ": " + message;
    
    console.log(logMessage);
    
    // Отправляем важные логи на сервер
    if (level === "ERROR" || level === "CRITICAL" || debugMode) {
        triggerServerEvent("clientLogMessage", {
            level: level,
            message: message,
            timestamp: timestamp
        });
    }
}

// Переопределяем console.log для клиента
const originalConsoleLog = console.log;
console.log = function(message) {
    originalConsoleLog.call(console, message);
    
    // Если сообщение содержит CLIENT:, отправляем на сервер
    if (typeof message === 'string' && message.includes('CLIENT:')) {
        triggerServerEvent("clientConsoleLog", message);
    }
};

// ════════════════════════════════════════════════════════════════
// ФИНАЛЬНОЕ СООБЩЕНИЕ ГОТОВНОСТИ v7.5
// ════════════════════════════════════════════════════════════════

console.log("CLIENT: ═══════════════════════════════════════");
console.log("CLIENT: КЛИЕНТСКИЙ СКРИПТ v7.5 ЗАГРУЖЕН");
console.log("CLIENT: Дата: 2025-06-04 06:02:09");
console.log("CLIENT: Автор: RetroMasterCode");
console.log("CLIENT: ═══════════════════════════════════════");
console.log("CLIENT: ✅ Обработчики миссий: startMissionForClient, cancelMissionForClient");
console.log("CLIENT: ✅ Обработчики розыска: setWantedLevelForClient, getWantedLevelForClient");
console.log("CLIENT: ✅ События миссий: onMissionComplete, onMissionFailed, onMissionStart");
console.log("CLIENT: ✅ Отладка и диагностика: debugClientState, testClientFunctions");
console.log("CLIENT: ✅ Автосинхронизация состояния каждые 5 секунд");
console.log("CLIENT: ✅ Обработка смерти и респавна игрока");
console.log("CLIENT: ═══════════════════════════════════════");
console.log("CLIENT: 🚀 КЛИЕНТ ГОТОВ К РАБОТЕ!");
console.log("CLIENT: ═══════════════════════════════════════");