# Discord <!-- omit in toc -->
### Contents
- [Server Rules](#server-rules)
- [Game Rules & how to play](#game-rules--how-to-play)
  - [Disclaimer](#disclaimer)
  - [Setup](#setup)
  - [Playing the Game](#playing-the-game)
  - [Actions](#actions)
  - [Death & The Jury](#death--the-jury)
- [How to call out moves](#how-to-call-out-moves)
- [List of Commands](#list-of-commands)
  - [Admin Only](#admin-only)
  - [Admin post-MVP](#admin-post-mvp)
  - [All Players](#all-players)
  - [Jurer (dead player)](#jurer-dead-player)

### todo
- create game rules pinned comment
- create how to write commands pinned post

---

## Server Rules
1. Must be 18 years or older.
2. Respect everyone.
3. Do not post NSFW content.

---

## Game Rules & how to play
Tank tactics is a game about social manipulation. Creating plans, factions, truces, betraying others; that is the name of the game. Well, "Tank Tactics is", but you ge my point.

### Disclaimer
I did not come up with the idea for this game. It is a game concept that Halfbrick Games starting working on. They are best known for the mobile games, *Jetpack Joyride*, and *Fruit Ninja*. They ended up scrapping the project because of what happened in their offices when they had employees play-testing the concept.

It's actaully a really fascinating story, and inspired me to create a discord-bot way to play the game. If you want to learn more about it, here are som links:
- [Youtube video talking about what happened - 16 min](https://www.youtube.com/watch?v=aOYbR-Q_4Hs&t=615s&ab_channel=PeopleMakeGames)
- [GDC talk from one of the creators going more in-depth - 1 hr]()

### Setup
- Use the `$join` command to join the game. Once the game has started, players can no longer join.
- Each player plays as a tank on a board of squares
- At the start of the game, each player's tank is randomly placed on the board, and starts with the following:
  - 3 health
  - 1 action token
  - A range of 2
### Playing the Game
- To perform actions, a player needs to expend `action tokens`; they can be used to move, shoot, gift tokens, or upgrade a player's range.
- **Play is live**, meaning there are no turns; players take actions whenever they please. Players can also take as many actions as they want, so long as they have sufficient tokens.
- At the begining of each day, each player is given an additional action token.
- The last player standing wins the game.
### Actions
- Players can spend 1 action token to do one of the following:
  - **Move** one square adjacent or diagonal to their current position
  - **Shoot** another player within their range*; shot players take -1 to their health; players are not able to heal
  - **Gift** an **Action Token** to another player within their range*; no tokens are lost in this exchange, the giving player loses 1 token, while the recieving player gains 1.
  - **Upgrade** their **Range**; players range goes up by 1

\* if a player has a range of 2, another player is "within range" if they are 2 squares or less away, diagonally or adjacently
### Death & The Jury
- Players who are knocked down to 0 health are removed from the board, and can no longer take actions; their action points are lost
- However, as in the reality TV show [Survivor](https://en.wikipedia.org/wiki/Survivor_(American_TV_series)#Format_and_rules), dead players become part of the `Jury`, and are able to cast votes on other players
- Players that have 3 or more votes when the daily action tokens are given, receive an additional action token

## How to call out moves


## List of Commands
This is a list of command and what they do. All commands are typed in the `call-out-moves` channel, or in the case of voting, they can be DM-ed right to the bot as well. Every command is prefaced with the dollar symbol (`$`).
### Admin Only
- `$give-tokens`: give each living player a new action token, players with 3 or more votes from the jury get an extra token
- `$add-player <user_name>`: add player with `user_name` to the game
- `$start-game`: starts the game; board is displayed
- `$end-game`: ?(maybe) ends the current game; new game is ready to accept new players
- `$reset-game`: resets the game to default state where settings can be changed, and players can join
### Admin post-MVP
- `$game-setting <setting> <value>`: change game setting to given value.
    - **Settings**
        - board_height - integer
        - board_width - integer
        - starting_health - integer
        - starting_tokens - integer
        - daily_token_count - integer
        - starting_range - integer
- `$remove-player <username>`: removes player with user_name from the game
- `$get-players`: gets list of player usernames
- `$get-votes`: gets list of votes
### All Players
- `$move <cardinal_direction>`: move player 1 space in `cardinal_direction`
    - *examples: `$move NW` , `$move e`*
- `$shoot <coords>`: player shoots at `coords` (coords formatted as a single letter A-J followed by a digit 0-9)
    - *examples: `$shoot c4` , `$shoot H0`*
- `$upgrade-range`: player adds 1 to their range
- `$gift-action-token <coords>`: same as shooting, but player at `coords` gains an action token instead of taking damage
- `$join`: join the game before it starts
### Jurer (dead player)
- `$vote <user_name>`: casts vote for player with `user_name`; vote can be changed as many times as the jurer would like up until the `$add-tokens` command is used
