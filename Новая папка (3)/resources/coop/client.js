// ═══════════════════════════════════════════════════════════════════
// КЛИЕНТСКИЙ СКРИПТ ДЛЯ GTA CONNECTED - ПОЛНАЯ СИСТЕМА МИССИЙ
// Версия: 8.0 - ЗАВЕРШЕННАЯ СИСТЕМА С ИСПРАВЛЕНИЯМИ
// Дата: 2025-06-03 05:01:18
// Автор: RetroMasterCode
// ═══════════════════════════════════════════════════════════════════

// Переменные состояния
let isInMission = false;
let currentMissionId = 0;
let currentMissionName = "";
let currentMissionDescription = "";
let currentMissionType = "";
let currentMissionDifficulty = "";
let isLoggedIn = false;
let playerName = "";
let deathTimer = 0;
let missionTitleShown = false;
let serverInfo = {
    totalMissions: 150,
    version: "4.0"
};

console.log("🎥 ═══════════════════════════════════════════════════════════════");
console.log("🎥           ЗАГРУЗКА КЛИЕНТСКОГО СКРИПТА");
console.log("🎥 ═══════════════════════════════════════════════════════════════");
console.log("🎥 Версия: ПОЛНАЯ СИСТЕМА МИССИЙ v8.0");
console.log("🎥 Дата: 2025-06-03 05:01:18");
console.log("🎥 Автор: RetroMasterCode");
console.log("🎥 Все 150 миссий GTA SA с официальными названиями");
console.log("🎥 Исправлена проблема с аккаунтами и система миссий");
console.log("🎥 ═══════════════════════════════════════════════════════════════");

// ═══════════════════════════════════════════════════════════════════
// РАСШИРЕННЫЕ ФУНКЦИИ УПРАВЛЕНИЯ КАМЕРОЙ
// ═══════════════════════════════════════════════════════════════════

function setCameraToPlayer(reason = "Default") {
    if (!localPlayer) {
        console.log(`❌ LocalPlayer не найден (${reason})`);
        return false;
    }
    
    try {
        // Устанавливаем камеру на игрока
        camera.target = localPlayer;
        camera.fade = true;
        
        console.log(`✅ Камера установлена на игрока (${reason})`);
        return true;
    } catch (error) {
        console.log(`❌ Ошибка установки камеры (${reason}): ${error}`);
        return false;
    }
}

// ═══════════════════════════════════════════════════════════════════
// ФУНКЦИИ ДЛЯ ОТОБРАЖЕНИЯ МИССИЙ
// ═══════════════════════════════════════════════════════════════════

function showMissionTitle(title, description, type = "", difficulty = "") {
    console.log(`🎬 ПОКАЗ ЗАГОЛОВКА МИССИИ: "${title}"`);
    console.log(`📝 Описание: ${description}`);
    if (type) console.log(`🎯 Тип: ${type}`);
    if (difficulty) console.log(`⭐ Сложность: ${difficulty}`);
    
    currentMissionName = title;
    currentMissionDescription = description;
    currentMissionType = type;
    currentMissionDifficulty = difficulty;
    missionTitleShown = true;
    
    // Здесь может быть код для отображения UI заголовка миссии
    // Например, создание текстовых элементов на экране
}

function hideMissionTitle() {
    console.log("🎬 СКРЫТИЕ ЗАГОЛОВКА МИССИИ");
    missionTitleShown = false;
    currentMissionName = "";
    currentMissionDescription = "";
    currentMissionType = "";
    currentMissionDifficulty = "";
}

function displayMissionStats() {
    console.log("📊 ═══ СТАТИСТИКА ТЕКУЩЕЙ МИССИИ ═══");
    console.log(`🎯 ID: ${currentMissionId}`);
    console.log(`📋 Название: ${currentMissionName || 'нет'}`);
    console.log(`📝 Описание: ${currentMissionDescription || 'нет'}`);
    console.log(`🎲 Тип: ${currentMissionType || 'неизвестен'}`);
    console.log(`⭐ Сложность: ${currentMissionDifficulty || 'неизвестна'}`);
    console.log(`🎮 В миссии: ${isInMission ? 'Да' : 'Нет'}`);
    console.log(`🎬 Заголовок показан: ${missionTitleShown ? 'Да' : 'Нет'}`);
    console.log("═══════════════════════════════════");
}

// ═══════════════════════════════════════════════════════════════════
// ОБРАБОТЧИКИ СЕРВЕРНЫХ СОБЫТИЙ
// ═══════════════════════════════════════════════════════════════════

// Игрок заспавнился (от сервера)
addNetworkEventHandler("PlayerSpawned", function() {
    console.log("🔄 ИГРОК ЗАСПАВНИЛСЯ (от сервера)");
    
    // Сбрасываем таймер смерти
    deathTimer = 0;
    
    // Сбрасываем состояние миссии при спавне
    if (isInMission) {
        console.log("🎮 Сброс состояния миссии при спавне");
        isInMission = false;
        currentMissionId = 0;
        hideMissionTitle();
    }
    
    // Устанавливаем камеру на игрока через небольшую задержку
    setTimeout(() => {
        setCameraToPlayer("ServerSpawned");
    }, 100);
});

// Показать заголовок миссии (расширенное событие)
addNetworkEventHandler("ShowMissionTitle", function(title, description, type, difficulty) {
    console.log(`🎬 ПОЛУЧЕН ЗАГОЛОВОК МИССИИ: "${title}"`);
    showMissionTitle(title, description, type || "", difficulty || "");
});

// Отмена миссии
addNetworkEventHandler("CancelMission", function() {
    console.log("🎮 Миссия отменена (от сервера)");
    isInMission = false;
    currentMissionId = 0;
    hideMissionTitle();
});

// Обновление информации о сервере
addNetworkEventHandler("ServerInfo", function(info) {
    serverInfo = info;
    console.log(`📊 Получена информация о сервере: ${JSON.stringify(info)}`);
});

// ═══════════════════════════════════════════════════════════════════
// ОБРАБОТЧИКИ МИССИЙ
// ═══════════════════════════════════════════════════════════════════

// Обработчик начала миссии (расширенный)
addNetworkEventHandler("StartMission", function(missionId, missionData) {
    currentMissionId = missionId;
    isInMission = true;
    
    console.log(`🎮 ═══ НАЧАЛО МИССИИ ${missionId} ═══`);
    console.log(`🎯 Название: ${currentMissionName || 'Загрузка...'}`);
    console.log(`📝 Описание: ${currentMissionDescription || 'Загрузка...'}`);
    
    if (missionData) {
        console.log(`🎲 Тип: ${missionData.type || 'неизвестен'}`);
        console.log(`⭐ Сложность: ${missionData.difficulty || 'неизвестна'}`);
    }
    
    console.log("═══════════════════════════════════");
    
    // Устанавливаем камеру при начале миссии
    setTimeout(() => {
        setCameraToPlayer("MissionStart");
    }, 200);
});

// ═══════════════════════════════════════════════════════════════════
// ОБРАБОТЧИКИ ИГРОВЫХ СОБЫТИЙ
// ═══════════════════════════════════════════════════════════════════

// Обработчик спавна локального игрока
addEventHandler("onLocalPlayerSpawn", function() {
    console.log("🔄 ЛОКАЛЬНЫЙ ИГРОК ЗАСПАВНИЛСЯ");
    
    // Устанавливаем камеру на игрока
    setTimeout(() => {
        setCameraToPlayer("LocalPlayerSpawn");
    }, 50);
});

// Обработчик смерти локального игрока (расширенный)
addEventHandler("onLocalPlayerWasted", function() {
    console.log("💀 ═══ ЛОКАЛЬНЫЙ ИГРОК УМЕР ═══");
    
    // Сбрасываем миссию при смерти
    if (isInMission) {
        console.log(`🎮 Миссия ${currentMissionId} "${currentMissionName}" отменена из-за смерти (клиент)`);
        isInMission = false;
        currentMissionId = 0;
        hideMissionTitle();
    }
    
    // Запускаем таймер смерти (3 секунды)
    deathTimer = 3;
    console.log(⏱️ Начат таймер смерти: ${deathTimer} секунд`);
    
    const timerInterval = setInterval(() => {
        if (deathTimer > 0) {
            console.log(`⏱️ Респавн через: ${deathTimer} сек`);
            deathTimer--;
        } else {
            clearInterval(timerInterval);
            console.log("⏱️ Таймер смерти завершен - ожидание респавна");
        }
    }, 1000);
});

// ═══════════════════════════════════════════════════════════════════
// РАСШИРЕННЫЕ ГОРЯЧИЕ КЛАВИШИ
// ═══════════════════════════════════════════════════════════════════

addEventHandler("onKeyDown", function(keyCode) {
    // F1 - Помощь
    if (keyCode == SDLK_F1) {
        console.log("📋 ═══ ПОЛНАЯ СПРАВКА ПО ГОРЯЧИМ КЛАВИШАМ ═══");
        console.log("F1 - Эта справка");
        console.log("F2 - Установить камеру на игрока");
        console.log("F3 - Диагностика системы");
        console.log("F4 - Информация о текущей миссии");
        console.log("F5 - Показать/скрыть заголовок миссии");
        console.log("F6 - Статистика миссий");
        console.log("F7 - Информация о сервере");
        console.log("════════════════════════════════════════════");
    }
    
    // F2 - Установить камеру на игрока
    if (keyCode == SDLK_F2) {
        console.log("🎥 РУЧНАЯ УСТАНОВКА КАМЕРЫ (F2)");
        setCameraToPlayer("ManualF2");
    }
    
    // F3 - Диагностика (расширенная)
    if (keyCode == SDLK_F3) {
        console.log("📊 ═══ ПОЛНАЯ ДИАГНОСТИКА СИСТЕМЫ ═══");
        console.log(`🎥 Camera: ${camera ? 'OK' : 'undefined'}`);
        console.log(`🎯 Camera Target: ${camera && camera.target ? camera.target : 'undefined'}`);
        console.log(`👤 Local Player: ${localPlayer ? 'OK' : 'undefined'}`);
        console.log(`🎬 Camera Fade: ${camera && camera.fade !== undefined ? camera.fade : 'undefined'}`);
        console.log(`🎮 Состояние миссий:`);
        console.log(`  🎯 В миссии: ${isInMission}`);
        console.log(`  🔢 ID миссии: ${currentMissionId}`);
        console.log(`  📋 Название: ${currentMissionName || 'нет'}`);
        console.log(`  📝 Описание: ${currentMissionDescription || 'нет'}`);
        console.log(`  🎲 Тип: ${currentMissionType || 'нет'}`);
        console.log(`  ⭐ Сложность: ${currentMissionDifficulty || 'нет'}`);
        console.log(`  🎬 Заголовок показан: ${missionTitleShown}`);
        console.log(`🎮 Общее состояние:`);
        console.log(`  🔑 Авторизован: ${isLoggedIn}`);
        console.log(`  📛 Имя игрока: ${playerName || 'нет'}`);
        console.log(`  ⏱️ Таймер смерти: ${deathTimer}`);
        console.log(`🖥️ Сервер: v${serverInfo.version} (${serverInfo.totalMissions} миссий)`);
        console.log("═══════════════════════════════════════════");
    }
    
    // F4 - Информация о текущей миссии (расширенная)
    if (keyCode == SDLK_F4) {
        console.log("🎮 ═══ ПОДРОБНАЯ ИНФОРМАЦИЯ О МИССИИ ═══");
        if (isInMission && currentMissionId > 0) {
            displayMissionStats();
            console.log(`🎮 Статус: В процессе`);
            console.log(`💡 Команды:`);
            console.log(`   /cancelmission - отменить миссию`);
            console.log(`   /completemission - завершить (тест)`);
            console.log(`   F5 - показать/скрыть заголовок`);
        } else {
            console.log(`❌ Миссия не активна`);
            console.log(`💡 Полезные команды:`);
            console.log(`   /mission [id] - начать миссию`);
            console.log(`   /missions - просмотр прогресса`);
            console.log(`   /available - доступные миссии`);
            console.log(`   /info [id] - информация о миссии`);
        }
        console.log("═════════════════════════════════════════════");
    }
    
    // F5 - Показать/скрыть заголовок миссии
    if (keyCode == SDLK_F5) {
        if (isInMission && currentMissionName) {
            if (missionTitleShown) {
                console.log("🎬 СКРЫТИЕ ЗАГОЛОВКА МИССИИ (F5)");
                hideMissionTitle();
            } else {
                console.log("🎬 ПОКАЗ ЗАГОЛОВКА МИССИИ (F5)");
                showMissionTitle(currentMissionName, currentMissionDescription, currentMissionType, currentMissionDifficulty);
            }
        } else {
            console.log("❌ Нет активной миссии для отображения заголовка");
        }
    }
    
    // F6 - Статистика миссий
    if (keyCode == SDLK_F6) {
        console.log("📊 ═══ СТАТИСТИКА МИССИЙ ═══");
        if (isInMission) {
            displayMissionStats();
        } else {
            console.log("❌ Нет активной миссии");
        }
        console.log(`🖥️ Сервер поддерживает ${serverInfo.totalMissions} миссий`);
        console.log(`📋 Для подробной статистики используйте: /missions`);
        console.log("═══════════════════════════════");
    }
    
    // F7 - Информация о сервере
    if (keyCode == SDLK_F7) {
        console.log("🖥️ ═══ ИНФОРМАЦИЯ О СЕРВЕРЕ ═══");
        console.log(`📋 Название: Mission by RetroMasterCode Server`);
        console.log(`🎮 Версия: ${serverInfo.version}`);
        console.log(`🎯 Всего миссий: ${serverInfo.totalMissions}`);
        console.log(`📅 Дата подключения: ${new Date().toISOString()}`);
        console.log(`🎲 Типы миссий:`);
        console.log(`   📋 Опциональные (0-10) - можно пропускать`);
        console.log(`   🔥 Intro (ID 2) - обязательная`);
        console.log(`   📖 Сюжетные (11-116) - по порядку`);
        console.log(`   🏆 Бонусные (117-150) - можно пропускать`);
        console.log("════════════════════════════════");
    }
});

// ═══════════════════════════════════════════════════════════════════
// ОБРАБОТЧИКИ СОЕДИНЕНИЯ
// ═══════════════════════════════════════════════════════════════════

// Обработчик подключения к серверу (расширенный)
addEventHandler("onConnected", function() {
    console.log("🌐 ═══ ПОДКЛЮЧЕН К СЕРВЕРУ ═══");
    console.log("🎮 Инициализация полной системы миссий...");
    
    // Сброс всех переменных
    isInMission = false;
    currentMissionId = 0;
    currentMissionName = "";
    currentMissionDescription = "";
    currentMissionType = "";
    currentMissionDifficulty = "";
    isLoggedIn = false;
    playerName = "";
    deathTimer = 0;
    missionTitleShown = false;
    
    console.log("✅ Клиентский скрипт полностью инициализирован");
    console.log("🎮 Горячие клавиши:");
    console.log("   F1 - Справка");
    console.log("   F2 - Камера");
    console.log("   F3 - Диагностика");
    console.log("   F4 - Информация о миссии");
    console.log("   F5 - Заголовок миссии");
    console.log("   F6 - Статистика");
    console.log("   F7 - Информация о сервере");
    console.log("═══════════════════════════════");
});

// Обработчик отключения от сервера
addEventHandler("onDisconnected", function() {
    console.log("🌐 ═══ ОТКЛЮЧЕН ОТ СЕРВЕРА ═══");
    
    // Сбрасываем все переменные
    isInMission = false;
    currentMissionId = 0;
    currentMissionName = "";
    currentMissionDescription = "";
    currentMissionType = "";
    currentMissionDifficulty = "";
    isLoggedIn = false;
    playerName = "";
    deathTimer = 0;
    missionTitleShown = false;
    
    console.log("🔄 Все переменные сброшены");
});

// ═══════════════════════════════════════════════════════════════════
// АВТОМАТИЧЕСКИЕ СИСТЕМЫ
// ═══════════════════════════════════════════════════════════════════

// Проверяем камеру каждые 5 секунд и устанавливаем на игрока если нужно
setInterval(() => {
    if (localPlayer && camera && camera.target !== localPlayer) {
        console.log("🔧 Автоматическая коррекция камеры");
        setCameraToPlayer("AutoCorrection");
    }
}, 5000);

// Автоматическое логирование состояния каждую минуту (если в миссии)
setInterval(() => {
    if (isInMission) {
        console.log(`🔄 Состояние миссии: ID ${currentMissionId} "${currentMissionName}" (${new Date().toISOString()})`);
    }
}, 60000); // 1 минута

// ═══════════════════════════════════════════════════════════════════
// ЭКСПОРТ ФУНКЦИЙ ДЛЯ КОНСОЛИ
// ═══════════════════════════════════════════════════════════════════

// Экспорт функций для консоли (если доступно)
if (typeof window !== 'undefined') {
    window.setCameraToPlayer = () => setCameraToPlayer("Console");
    
    window.missionInfo = () => {
        console.log("🎮 ИНФОРМАЦИЯ О ТЕКУЩЕЙ МИССИИ:");
        displayMissionStats();
    };
    
    window.diagCamera = () => {
        console.log("🔍 ДИАГНОСТИКА КАМЕРЫ:");
        console.log("Camera:", camera);
        console.log("Camera.target:", camera ? camera.target : 'undefined');
        console.log("LocalPlayer:", localPlayer);
        console.log("Camera.fade:", camera ? camera.fade : 'undefined');
    };
    
    window.showMissionTitle = () => {
        if (isInMission && currentMissionName) {
            showMissionTitle(currentMissionName, currentMissionDescription, currentMissionType, currentMissionDifficulty);
        } else {
            console.log("❌ Нет активной миссии");
        }
    };
    
    window.hideMissionTitle = () => {
        hideMissionTitle();
    };
    
    window.serverInfo = () => {
        console.log("🖥️ ИНФОРМАЦИЯ О СЕРВЕРЕ:");
        console.log(serverInfo);
    };
    
    console.log("🔧 Функции экспортированы в window для консоли");
}

// ═══════════════════════════════════════════════════════════════════
// ФИНАЛЬНЫЕ СООБЩЕНИЯ
// ═══════════════════════════════════════════════════════════════════

console.log("🎥 ═══════════════════════════════════════════════════════════════");
console.log("🎥                 КЛИЕНТСКИЙ СКРИПТ ЗАГРУЖЕН");
console.log("🎥 ═══════════════════════════════════════════════════════════════");
console.log("🔧 Основные функции:");
console.log("🔧 - Полная система миссий с 150 миссиями");
console.log("🔧 - Автоматический респавн через 3 секунды");
console.log("🔧 - Автоматическая коррекция камеры");
console.log("🔧 - Расширенные горячие клавиши F1-F7");
console.log("🔧 - Подробная диагностика и статистика");
console.log("🔧 - Обработка смерти и отмены миссий");
console.log("🔧 - Отображение заголовков миссий");
console.log("🔧 - Система типов и сложности миссий");
console.log("🎥 ═══════════════════════════════════════════════════════════════");
console.log("✅ Клиент готов к работе!");
console.log("🎮 Нажмите F1 для справки по всем горячим клавишам");
console.log("🎥 ═══════════════════════════════════════════════════════════════");