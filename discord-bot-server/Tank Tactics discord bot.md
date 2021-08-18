# Tank Tactics discord bot <!-- omit in toc -->
- [User Requirements](#user-requirements)
- [List of Commands](#list-of-commands)
  - [Admins](#admins)
  - [Players](#players)
  - [Jurers (dead players)](#jurers-dead-players)
- [Replit Todo](#replit-todo)
  - [Create classes to handle logic](#create-classes-to-handle-logic)
  - [Create Node server events](#create-node-server-events)
  - [Create database](#create-database)
- [Discord Server Todo](#discord-server-todo)

---

## User Requirements
- I should get a new action token once per day
  - Maybe just a bot command that only the admin of the server can use called `$add-tokens`
- I need to call out moves in the call-out-moves channel
  - commands start with `$`. see [Commands](#commands) for details
- I need to see an up to date version of the board, with each player and their...
  - Name (identifier)
  - Location,
  - Health,
  - action tokens
- I need to see a history of actions
  - List of actions, or boards history?
- I should not be able to call out actions if I don't have any action tokens
- I need a way to join the game
  - admin command
- As a Jurer (dead player), I need to votte for a person to get an extra action token; I need this vote to be anonymous

---

## List of Commands
### Admins
- `$give-tokens`: give each living player a new action token, players with 3 or more votes from the jury get an extra token
- `$add-player <user_name>`: add player with `user_name` to the game
- `$start-game`: starts the game; board is displayed
- `$end-game`: ?(maybe) ends the current game; new game is ready to accept new players
### Players
*Note: when a player tries to use a command they don't have action tokens for, a message from the bot telling them how many tokens they have is displayed*
- `$move <cardinal_direction>`: move player 1 space in `cardinal_direction`
  - *examples: `move NW` , `$move e`*
- `$shoot <coords>`: player shoots at `coords` (coords formatted as a single letter A-J followed by a digit 0-9)
  - *examples: `$shoot c4` , `$shoot H0`*
- `$upgrade-range`: player adds 1 to their range
- `$gift-action-token <coords>`: same as shooting, but player at `coords` gains an action token instead of taking damage
### Jurers (dead players)
- `$vote <user_name>`: casts vote for player with `user_name`; vote can be changed as many times as the jurer would like up until the `$add-tokens` command is used

---

## Replit Todo
### Create classes to handle logic
- Game
  - `giveDailyTokens()`
  - `addPlayer(string username)`
  - `startGame()`
  - `endGame()`
- Player
  - `move(string direction)`
  - `shoot(coordinates)`
  - `upgradeRange()`
  - `giftActionToken(coordinates)`
  - `vote(username)` : can only be done if isDead = true
  - add more methods as needed
### Create Node server events
- basically just one: readMessage
  - if message contains `$<command_string>`, then parse the incoming variables
    - if variables can't be parse, respond with error message
    - else, call related function with parsed variables
  - else do nothing
### Create database
- up to this point, everything is done with dummy un-persisted data
- so, create db, and start writing data

---

## Discord Server Todo
- **create channels**
  - ~~general~~
  - ~~call-out-orders~~
  - game-rules
  - game-discussion
- **pinned comments**
  - create game rules pinned comment
  - create server rules pinned comment
    - "be nice to each other, it's just a game, etc."
  - create how to write commands pinned post

