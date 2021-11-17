# Tank Tactics discord bot <!-- omit in toc -->
- [User Requirements](#user-requirements)
  - [MVP](#mvp)
- [Questions](#questions)
- [TODO](#todo)
  - [Node server Todo](#node-server-todo)
  - [Testing](#testing)
  - [BUGS](#bugs)
- [Useful Links](#useful-links)
- [Post-MVP](#post-mvp)

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

## Post-MVP
- more settings
  - board_size, starting_health, starting_tokens, daily_token_count, starting_range