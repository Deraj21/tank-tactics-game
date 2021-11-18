# Tank Tactics discord bot <!-- omit in toc -->
- [User Requirements](#user-requirements)
  - [MVP](#mvp)
- [Questions](#questions)
- [TODO](#todo)
  - [Node server Todo](#node-server-todo)
  - [Testing](#testing)
  - [BUGS](#bugs)
- [Useful Links](#useful-links)
- [Post-MVP Ideas](#post-mvp-ideas)

---

## User Requirements
### MVP
- I should get a new action token once per day
  - Maybe just a bot command that only the admin of the server can use called `!add-tokens`
- I need to call out moves in the call-out-moves channel
  - commands start with `!`. see [Commands](#commands) for details
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

## Questions
- How do I visualize the board: **Discord bot creates and posts images**
  - PROS: I can make it very pretty & readable; not need to leave Discord to view board
  - CONS: *not* low effort; I'm not even sure if it's possible with the tools I have
- How do I properly test this game?

---

## TODO
### Node server Todo
- [ ] convert code to use database
  - [ ] vote
  - [ ] test awarding daily tokens base on votes
- [ ] validate setting exists when updating game setting, and correct datatype
### Testing
  - [ ] get rachel to try a bunch of commands and rough test stuff out
  - [ ] ask her to try and break it
### BUGS
- ...

---

## Useful Links
- [generate svg files with node.js](https://medium.com/@92sharmasaurabh/generate-svg-files-using-nodejs-d3-647d5b4f56eb)

---

## Post-MVP Ideas
- ~~remove player from game~~
  - this seems to be not needed. if a player is being abusive, kick them from the server. If a player just doesn't want to play the game anymore, their tank can just sit there and not play
- players can upgrade their range
  - should this be permanant or temporary?
  - what should the cost be?
- dead player's tokens are left on the board
- players can only see as far as their range allows
  - this potentially could add another dimension, making information a commodity to be traded, lied about, etc.
  - however, this is a pretty big ask
    - this means that players will each need to see their own personal board
    - either DMed individually, or maybe building the actual HTML app that reads the replit database, and generates the board based on a key you give it.
  - what if players text each other screen-shots of their board? is that just part of the game?
    - if the understanding is that we don't send board screenshots, then the game is more about "do I trust the info given me?"
    - but if that is allowed, then bargaining with a screenshot of your board could be interesting in its own right
- daily tokens automated
  - another semi-big ask; where do I get timed events? is there a js library I can use? is there something built into the discord bot api?
- create a mongoDB database te replace replit database
- Tons of settings
  - 'daily' token interval (minutes, hours, days)
  - first token givout time
  - max number of players
  - allow cease fires
  - cease fire interval
  - allow range upgrades
  - movement cost
  - shooting cost
  - starting range
- allow for quick plays (1 token meted every 3 minutes or similar)
- cease fire command
  - given to admin as a way to 'pause' the game during vacations or something
  - given as a setting to have set times every day while game is in play. ex: cease fire every night from 9pm to 9am
  - given to player at a token cost as another tool
- terrain that costs extra movement or can't be moved through or shot through?
- make votes anonymous
  - [stack overflow - how to recieve](https://stackoverflow.com/questions/48729041/checking-if-a-message-is-a-dm-discord-js-and-discord-js-commando/51390434)
  - [stack overflow - how to send](https://stackoverflow.com/questions/41745070/sending-private-messages-to-user)
- 
