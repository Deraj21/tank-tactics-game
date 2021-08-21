# Discord <!-- omit in toc -->
### Contents
- [Server Rules](#server-rules)
- [Channels](#channels)
- [What is Tank Tactics?](#what-is-tank-tactics)
  - [Where did Tank Tactics come from?](#where-did-tank-tactics-come-from)
- [Game Rules & how to play](#game-rules--how-to-play)
  - [Setup](#setup)
  - [Playing the Game](#playing-the-game)
  - [Actions](#actions)
  - [Death & The Jury](#death--the-jury)
- [How to call out moves](#how-to-call-out-moves)
- [List of Commands](#list-of-commands)
  - [Admin Only](#admin-only)
  - [All Players](#all-players)
  - [Jurors (dead players)](#jurors-dead-players)

---

## Server Rules
1. Must be 18 years or older.
2. Respect everyone.
3. Do not post NSFW content.

---

## Channels
**how-to-play**: for learning the rules of the game, and how to call out moves

**game-discussion**: in this channel, we discuss anything about the game.

**call-out-moves**: this channel is where all actions are taken; only commands to the bot should be messaged to this channel. General discussion goes in *game-discussion*; A pinned comment can be also found here with a command cheat-sheet.


---

## What is Tank Tactics?
Tank Tactics is a game about social manipulation. Creating plans, forming factions and alliances, betraying those alliances for personal gain; that is the name of the game. Well, "Tank Tactics" is, but you get my point.

Because each player only has power to do one action a day, players need to form alliances and share actions to make any real changes. This means that the majority of the game is spent talking to each other, rather than in taking actions. Hence, playing the game in Discord makes a lot of sense.

### Where did Tank Tactics come from?
I did not come up with the idea for this game. It is a game concept that Halfbrick Studios starting working on. They are best known for the mobile games, *Jetpack Joyride*, and *Fruit Ninja*, but this game, *Tank Tactics*, started it's life as a physical playtest on a whiteboard amongst their staff. They ended up scrapping the project because of the situation it created at their workplace, being a game about manipulation and all.

It's actaully a really fascinating story, and inspired me to create a discord-bot way to play the game. If you want to learn more about the game's development, and ultimate banning over at Halfbrick Studios, here are some links:
- [The Game Prototype That Had to Be Banned by Its Own Studio](https://www.youtube.com/watch?v=aOYbR-Q_4Hs&t=615s&ab_channel=PeopleMakeGames) - Youtube video, *16 min*
- [The Prototype that was Banned from Halfbrick](https://www.gdcvault.com/play/1017744/The-Prototype-that-was-Banned) - GDC talk going more in depth, *1 hr*
- also, if you just [google "halfbrick studios banned game"](https://www.google.com/search?q=halfbrick+studios+banned+game&sxsrf=ALeKk02aFhg8daTwdT740_XwJbHPVU2YPw:1629498523194&source=lnms&sa=X&ved=2ahUKEwjP0ouF08DyAhULIDQIHVIHDFwQ_AUoAHoECAEQAg&biw=1920&bih=937&dpr=1), you'll get lots of results as well

---

## Game Rules & how to play
### Setup
- Use the `$join` command to join the game. Once the game has started, players can no longer join.
- Each player plays as a tank on a board of squares
- At the start of the game, each player's tank is randomly placed on the board, and starts with the following:
  - 3 health
  - 1 action token
  - A range of 2
### Playing the Game
- To perform actions, a player needs to expend `action tokens`; they can be used to move, shoot, or upgrade a player's range.
- **Play is live**, meaning there are no turns; players take actions whenever they please. Players can also take as many actions as they want, so long as they have sufficient tokens.
- At the begining of each day, each player is given an additional action token.
- The last player standing wins the game.
### Actions
- Players take actions using `commands` recognized by the `TankTacticsBot`. [more](#list-of-commands) on that below
- Players can spend 1 action token to do one of the following:
  - **Move** one square adjacent or diagonal to their current position
  - **Shoot** another player within their range*; shot players take -1 to their health; players are not able to heal
  - **Gift** an **Action Token** to another player within their range*; no tokens are lost in this exchange, the giving player loses 1 token, while the recieving player gains 1.
  - **Upgrade** their **Range**; players range goes up by 1

\* _**range**: if a player has a range of 2, another player is "within range" if they are 2 squares or less away, diagonally or adjacently_

### Death & The Jury
- Players who are knocked down to 0 health are removed from the board, and can no longer take actions; their action points are lost
- However, as in the reality TV show [Survivor](https://en.wikipedia.org/wiki/Survivor_(American_TV_series)#Format_and_rules), dead players become part of the `Jury`, and are able to cast votes on other players
- Players that have 3 or more votes when the daily action tokens are given, receive an additional action token

---

## How to call out moves
All commands are typed in the `call-out-moves` channel, or in the case of voting, they can be DM-ed directly to the bot as well.

Every command is prefaced with the dollar symbol (`$`). Some commands need more information for the bot to know what to do. In the List of Commands below, these will have the name of the needed info inside `<` `>` symbols. You don't need to type the `<` or `>` when giving the info, nor do you need to worry about capitalization when typing commands.

*Examples: "`$joiN`" , "`$Move Nw`" , "`$gift-action-token f7`" are all valid commnands*

---

## List of Commands
### Admin Only
- `$give-tokens`: give each living player a new action token, players with 3 or more votes from the jury get an extra token
<!-- - `$add-player <user_name>`: add player with `user_name` to the game -->
- `$start-game`: starts the game; board is displayed
<!-- - `$end-game`: ends the current game; new game is ready to accept new players -->
- `$reset-game`: resets the game to default state where settings can be changed, and players can join
<!-- ### Admin post-MVP
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
- `$get-votes`: gets list of votes -->
### All Players
- `$join <3_letter_abbr>`: join the game using a 3-letter abbreviation of your name; this name is only used when displaying your tank on the board. If left blank, the 1st 3 letters of your username will be used.
- `$move <cardinal_direction>`: move tank 1 space in `cardinal_direction`; 
    - *examples: "`$move nw`" , "`$move E`"*
- `$shoot <coordinates>`: player shoots at `coordinates` (coordinates formatted as a single letter A-J followed by a digit 0-9)
    - *examples: "`$shoot c4`" , "`$shoot H0`"*
- `$gift-action-token <coordinates>`: same as shooting, but player at `coordinates` gains 1 action token instead of taking damage
- `$upgrade-range`: player adds 1 to their range
### Jurors (dead players)
- `$vote <user_name>`: casts vote for player with `user_name`; vote can be changed as many times as the jurer would like up until the daily action tokens are given out
    - *example: "`$vote deraj21`"*
