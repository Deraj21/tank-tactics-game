# Tank Tactics discord bot <!-- omit in toc -->
- [User Requirements](#user-requirements)
  - [MVP](#mvp)
  - [Post-mvp](#post-mvp)
- [Questions](#questions)
- [TODO](#todo)
  - [Node server Todo](#node-server-todo)
  - [Testing](#testing)
  - [BUGS](#bugs)
  - [post-mvp](#post-mvp-1)
- [Useful Links](#useful-links)

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
### Post-mvp
- give **admin** commands to edit game settings while players are joining; this could be coupled with another command to list all the settings and the appropriate values. (or maybe we maintain this in a pinned comment)
  - settings examples: board_size, starting_health, starting_tokens, daily_token_count, starting_range, etc.
  - `!game-setting <setting> <value>`
    - *example: `!game-setting starting_health 2`*

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
  - [ ] upgrade range
  - [ ] vote
  - [ ] test awarding daily tokens base on votes
- [ ] validate setting exists when updating game setting, and correct datatype
### Testing
  - [ ] get rachel to try a bunch of commands and rough test stuff out
  - [ ] ask her to try and break it
### BUGS
- ...
### post-mvp
- Admin
  - add new game settings
  - remove-player

---

## Useful Links
- [generate svg files with node.js](https://medium.com/@92sharmasaurabh/generate-svg-files-using-nodejs-d3-647d5b4f56eb)
- [sharp docs - toFile()](https://sharp.pixelplumbing.com/api-output#tofile)

