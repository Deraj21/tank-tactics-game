const   NUM_COLS = 5,
        NUM_ROWS = 5,
        NUM_PLAYERS = 3,
        TANK_COLORS = ['LightCoral', 'Orange', 'Khaki', 'MediumPurple', 'PaleGreen', 'MediumAquamarine', 'LightSkyBlue', 'Silver', 'BurlyWood' ],
        TANK_NAMES = ['Sally', 'Randy', 'Jared', 'Tom', 'Sam', 'Bryan', 'Allen']

const board = new GameBoard('game-board', {
    numCols: NUM_COLS,
    numRows: NUM_ROWS,
    numPlayers: NUM_PLAYERS,
    tankColors: TANK_COLORS,
    tankNames: TANK_NAMES
})
