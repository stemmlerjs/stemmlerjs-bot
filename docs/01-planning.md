# 01 Planning Phase

The purpose of this project is to automate my Twitter presense as much as possible so that my profile grows organically.

I originally got the idea for this from [this medium article](https://medium.com/@karanjthakkar/how-i-grew-from-300-to-5k-followers-in-just-3-weeks-2436528da845).

## Plan of action
1. Choose a Niche interest for your Twitter profile
Niche:
    - javascript
    - react
    - music

2. Find people who post interesting tweets and are active everyday on social media. This ensures that people are active and are likely to engage with you.

3. Find people who have a Follower to Following ratio of 1 to 2. These people are more likely to follow you back.

## Growth Hacking with Buffer
Solution: I used Buffer to schedule those tweets and track their performance. Based on the performance of each tweet, their reach/engagement/time of post, I rescheduled some of those tweets multiple times throughout the week.

PRO TIP: Every time a new tweet is posted through Buffer, go to Twitter and Pin that particular tweet.

## Goals for frontend
- Scheduled events
  - cancel an event
  - perform it now

  Event Types
  - prune people not following
  - follow someone
    - after finding a strong match, follow all
    - random friend of follower, follow them

- see current number of followers/following
- see growth over last week/month

- scheduler
  - only 3 actions can be scheuled to be performed at a time
  - canceling one queues the next event

- We need to leave enough time to prune followers
  - or, everytime we follow someone, we unfollow someone who isn't following us (I like this).

- Vetting
  - there needs to be a way to vet who gets followed.
  - another layer
    - based on niches/interests
      - tweets containing these words (# of words)
      - 1 to 2 followers / following ratio

