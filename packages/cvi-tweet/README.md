### https://cvi-tweet.cvi-team.com

Tweets the CVI index at 12pm every day.
Every so often, searches twitter for keywords and informs us via telegram of interesting tweets.

# Below is Bot informing us of important tweets

## Join the bot

https://t.me/CVIRelevantTweetsBot/start

### Bot username

CVIRelevantTweetsBot

### Bot Token

5983817417:AAH7PodnASqYoIQC9KuTzWyD_b1ocfB-NIo

### Get what's was written in the bot group

https://api.telegram.org/bot5983817417:AAH7PodnASqYoIQC9KuTzWyD_b1ocfB-NIo/getUpdates

### Sending a message to twitter people that Joined thg Bot (as explained above)

https://api.telegram.org/bot5983817417:AAH7PodnASqYoIQC9KuTzWyD_b1ocfB-NIo/sendMessage?chat_id=212818068&text=Hello%20from%20your%20new%20bot

### Sending a message to twitter group "CVI Volatility Tweets - Respond on Twitter"

https://api.telegram.org/bot5983817417:AAH7PodnASqYoIQC9KuTzWyD_b1ocfB-NIo/sendMessage?chat_id=-845614110&text=Hello%20from%20your%20new%20bot

### How to create a group for A list of People to get the Bot messages

1. Create a group in telegram, add the bot (https://t.me/CVIRelevantTweetsBot) and needed people

2. open https://web.telegram.org and see the new group and copy the group URL (something like https://web.telegram.org/k/#-845614110). Copy the number on the right-hand side

3. To send messages to the group use the number copied in (2) and go to url such as:


   https://api.telegram.org/bot5983817417:AAH7PodnASqYoIQC9KuTzWyD_b1ocfB-NIo/sendMessage?chat_id=-845614110&text=Hello%20from%20your%20new%20bot

4. Use the number of the newly created group and put it inside define-config.ts - "-845614110"
