# stemmlerjs-bot

## Layers

### Actuation Layer (Layer 0)
- ```/bot.js```
- This layer does all of the actions. It simply performs an action and logs the result of that action. 
  - Success or failure to do the action.
  - It is not concerned with timing or anything.

### Scheduling Layer (Layer 1)
- ```scheduler.js```
- This layer is responsible for scheduling the actions to be performed. 
- Actions to be performed come in through the decision layer.
- There is a max number of queued items that can possibly exist at one time (30).
- Actions can be cancelled, clearing that item from the queue and making room for a new action to be queued.
- This layer needs to be aware of the rate limits for events.
- It also needs to be pseudo-random with when it schedules the events to be actuated in the actuation layer.

### Decision Layer (Layer 2)
- ```decision.js```
- This layer decides whether or not the action should be performed or not.
- It looks into a collection of information to decide whether the action should be performed or not.
  - Following / Follow ratio
  - Interest keywords found in their bio or in their tweets.
- When it finds something that is particularly convincing such that we should follow this user, we will do a calculation and give points based on
what we find.
- It also filters all decisions that come in first. We don't want to follow any profiles that promote hateful content or porn.

### Search Layer (Layer 3)
- ```search.js```
- This layer actively searches for users to follow and tweets to like.
- There are a few different ways that we can begin to funnel content into this to search for.
  - Seed Accounts: These are accounts that we know are highly related to the content that we are seeking.
    - We will go through this user's list of followers and incrementally add them.
  - Twitter Feed: We will watch for new tweets that match our interests and patch an action to the decision layer to decide whether or
    not to follow that user.



