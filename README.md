# slack-yelp

Add yelp command to your slack channel.

## Deployment

1. Install [Webtask](https://webtask.io/)
2. `wt init`
3. Put yelp token to `deploy.sh`
4. `./deploy.sh`
5. Add the webtask webhook to slack command

## Usage

`curl https://webtask.it.auth0.com/api/run/wt-zhuxuefeng1994-126_com-0/yelp?text=food%20in%20Chicago`

