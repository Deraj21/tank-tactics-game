# Discord <!-- omit in toc -->
### Contents
- [welcome-to-the-server](#welcome-to-the-server)
  - [> **--- Server Rules---**](#-----server-rules---)
  - [> **--- Channels ---**](#-----channels----)
  - [> **--- Disclaimer ---**](#-----disclaimer----)
- [what-is-tank-tactics](#what-is-tank-tactics)
  - [> **--- What is Tank Tactics? ---**](#-----what-is-tank-tactics----)
  - [> **--- Where did Tank Tactics come from? ---**](#-----where-did-tank-tactics-come-from----)
- [how-to-play](#how-to-play)
  - [> **--- Commands ---**](#-----commands----)
  - [> **--- Game Setup ---**](#-----game-setup----)
  - [> **--- Playing the Game ---**](#-----playing-the-game----)
  - [> **--- Actions ---**](#-----actions----)
  - [> **--- Death & The Jury ---**](#-----death--the-jury----)
  - [> **--- How to call out moves ---**](#-----how-to-call-out-moves----)
  - [> **--- List of Commands ---**](#-----list-of-commands----)
    - [**Admin Only**](#admin-only)
    - [**All Players**](#all-players)
    - [**Jurors (dead players)**](#jurors-dead-players)

---

# welcome-to-the-server

*Welcome to Tank Tactics! A game all about  ~~backstabbing~~  having fun with your friends!*

## > **--- Server Rules---**
1. Be kind and respectful to everyone. Even if they back-stab you.
2. No NSFW (not safe for work) content.
3. If you violate rule 1 or 2, I will not be afraid to escort you out.
4. Keep it lighthearted. Have fun.

## > **--- Channels ---**

**welcome-to-the-server**: (this channel). Since you are here, this seems a little redundant, but this is (hopefully) the first place a newcomer comes in order to find out where to go for what, and how the server works.

**what-is-tank-tactics**: This channel explains what *Tank Tactics* is and where it came from.

**how-to-play**: for learning the rules of the game, and how to call out moves

**game-discussion**: in this channel, we discuss anything about the game.

**call-out-moves**: this channel is where all actions are taken; only commands to the bot should be messaged to this channel. General discussion goes in *game-discussion*. A pinned comment can be also found here with a command cheat-sheet.

**report-bugs**: Pretty self-explanatory. Anything that you think is not working the way it should, report it here. Some "bugs" are actually gaps in features, and may be planned for the future. If this is the case, I as the developer will move the issue to the features channel, so it can be kept track of there.

**request-features**: If there is something that is not broken, but a feature that is non-existent that you would like, request it here!

## > **--- Disclaimer ---**
The Tank Tactics bot is still under construction, and thus a little bug-ridden. If you type a command in a way the bot doesn't understand, in most cases the bot will handle this by giving you an error message, and letting you try again. But if you totally throw it for a loop, it might not handle the error, and at that point, will just stop working. When this happens, the bot will say it is offline after a little bit, and commands will not work.
If this occurs, please let me know in the `report-bugs` channel, and I will get to fixing it right away.

---

# what-is-tank-tactics

## > **--- What is Tank Tactics? ---**
Tank Tactics is a game about social manipulation. Creating plans, forming factions and alliances, betraying those alliances for personal gain; that is the name of the game. Well, "Tank Tactics" is, but you get my point.

Because each player only has power to do one action a day, players need to form alliances and share actions to make any real changes. This means that the majority of the game is spent talking to each other, rather than in taking actions. Hence, playing the game in Discord makes a lot of sense.
.
## > **--- Where did Tank Tactics come from? ---**
I did not come up with the idea for this game. It is a game concept that Halfbrick Studios starting working on. They are best known for the mobile games, *Jetpack Joyride*, and *Fruit Ninja*, but this game, *Tank Tactics*, started its life as a physical play-test on a whiteboard amongst their staff. They ended up scrapping the project because of the situation it created at their workplace, being a game about manipulation and all.

It's actually a really fascinating story, and inspired me to create a discord-bot way to play the game. If you want to learn more about the game's development, and ultimate banning over at Halfbrick Studios, here are some links
.
- [The Game Prototype That Had to Be Banned by Its Own Studio](https://www.youtube.com/watch?v=aOYbR-Q_4Hs&t=615s&ab_channel=PeopleMakeGames) - YouTube video, **16 min**
- [The Prototype that was Banned from Halfbrick](https://www.gdcvault.com/play/1017744/The-Prototype-that-was-Banned) - GDC talk going more in depth, **1 hr**

---

# how-to-play

## > **--- Commands ---**
- This game is entirely played in Discord, with actions being completed using commands. Check out the [How to call out moves](#how-to-call-out-moves) section for more details.
.
.
## > **--- Game Setup ---**
- Use the `!join` command, with a 6-letter nickname, to join the game. Once the game has started, players can no longer join.
- Each player plays as a 'tank' on a board of squares
- At the start of the game, each player's tank is randomly placed on the board, and starts with the following:
  - 3 health
  - 1 action token
  - A range of 2
.
.
## > **--- Playing the Game ---**

- To perform actions, a player needs to expend `action tokens`; they can be used to move, shoot, or gift another player that token.
- **Play is live**, meaning there are no turns; players take actions whenever they please. Players can also take as many actions as they want, so long as they have sufficient tokens.
- At the beginning of each day, each player is given an additional action token.
- The last player standing wins the game.
.
## > **--- Actions ---**
- Players take actions using `commands` recognized by the `TankTacticsBot`. [more](#list-of-commands) on that below
- Players can spend 1 action token to do one of the following:
  - **Move** one square adjacent or diagonal to their current position
  - **Shoot** another player within their range*; shot players take -1 to their health; players are not able to heal
  - **Gift** an **Action Token** to another player within their range*; no tokens are lost in this exchange, the giving player loses 1 token, while the receiving player gains 1.
  <!-- - **Upgrade** their **Range**; players range goes up by 1 -->

\* _**range**: if a player has a range of 2, another player is "within range" if they are 2 squares or less away, diagonally or adjacently_
.
.
## > **--- Death & The Jury ---**
- Players who are knocked down to 0 health are removed from the board, and can no longer take actions; their action points are lost
- However, as in the reality TV show [Survivor](https://en.wikipedia.org/wiki/Survivor_(American_TV_series)#Format_and_rules), dead players become part of the `Jury`, and are able to cast votes on other players
- Players that have 3 or more votes when the daily action tokens are given, receive an additional action token
.
## > **--- How to call out moves ---**
All commands are typed in the `call-out-moves` channel.
<!-- , or in the case of voting, they can be DM-ed directly to the bot as well. -->

**Commands with Parameters.** Every command is prefaced with an exclamation point (`!`). Some commands need more information for the bot to know what to do. In the List of Commands below, these will have the name of the needed info inside `<` `>` symbols. You don't need to type the `<` or `>` when giving the info, nor do you need to worry about capitalization when typing most commands. The only exception is when using "`!vote`"

*Examples: "`!joiN`" , "`!Move Nw`" , "`!gift-action-token f7`" are all valid commands*
.
## > **--- List of Commands ---**

### **Admin Only**

- `!daily-tokens`: give each living player the amount of action tokens for the day. Players with a certain number\* of votes from the jury get bonus tokens. - *(number of daily tokens, votes needed, and bonus tokens are configurable in settings)*
- `!start-game`: starts the game; board is displayed
- `!reset-game`: resets the game to default state where settings can be changed, and players can join
- `!get-settings`: gets a list of the settings and their values
- `!change-setting <setting> <value>`: change game setting to given value. Settings cannot be changed after the game has started
  - *ex: "`!change-setting num_cols 12`"*
  - **Settings**
    - num_rows - integer; number of board rows
    - num_cols - integer; number of columns
    - daily_token_count - integer; number of tokens given each day (or period)
    - starting_health - integer; players start with this much health
    - starting_tokens - integer; players start with this many tokens
    - starting_range - integer; players start with this much range
    - votes_needed - integer; votes needed from the jury to earn the bonus tokens
    - bonus_tokens - integer; number of bonus tokens awarded to players with enough votes
- `!get-players`: gets list of players and their stats
- `!get-votes`: gets list of votes for each player
- `!get-board`: displays the board
- `!ping`: the bot responds with "pong!" (used for making sure the server is running)
.
### **All Players**

- `!join <6_letter_nickname>`: join the game using a 6-letter nickname. If left blank, the 1st 6 letters of your username will be used.
- `!move <cardinal_direction>`: move tank 1 space in `cardinal_direction`; 
  - *examples: "`!move nw`" , "`!move E`"*
- `!shoot <coordinates>`: player shoots at `coordinates` (coordinates formatted as a single letter A-J followed by a digit 0-9)
  - *examples: "`!shoot c4`" , "`!shoot H0`"*
- `!gift-token <coordinates> <number_of_tokens>`: same as shooting, but player at `coordinates` gains action token(s) instead of taking damage. `number_of_tokens` is optional
<!-- - `!upgrade-range`: player adds 1 to their range -->
.
### **Jurors (dead players)**
- `!vote <nickname>`: casts vote for player with `nickname`. The vote can be changed as many times as the juror would like; up until the daily action tokens are given out.
  - *example: "`!vote JaredT`"*
