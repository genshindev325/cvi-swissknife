FROM nikolaik/python-nodejs:python3.9-nodejs16

WORKDIR /usr/cvi-swissknife

# install required python modules/packages needed for py-parabola-coefficients
COPY packages/py-parabola-coefficients/requirements.txt packages/py-parabola-coefficients/requirements.txt
RUN pip3 install -r packages/py-parabola-coefficients/requirements.txt

COPY packages/chatgpt-server/requirements.txt packages/chatgpt-server/requirements.txt
RUN pip3 install -r packages/chatgpt-server/requirements.txt


RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && ./aws/install

# install ngrok to debug a specific pod
RUN curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | tee /etc/apt/sources.list.d/ngrok.list && apt update && apt install ngrok && ngrok config add-authtoken 29LC0aJT1Kwl2Wpr8AodGUJvYpS_3eTs71fqCe5FJJdwQnqkd

RUN apt-get update && apt-get install -y chromium

# --start--
# copy only relevant files for installations - this is to make sure there is a cache on that
COPY yarn.lock package.json ./
COPY patches ./patches
COPY packages/il-admin-panel-ui/package.json packages/il-admin-panel-ui/package.json
COPY packages/api/package.json packages/api/package.json
COPY packages/auto-generated-code/package.json packages/auto-generated-code/package.json
COPY packages/backend-dockerfile/package.json packages/backend-dockerfile/package.json
COPY packages/beta-cvi-ui/package.json packages/beta-cvi-ui/package.json
COPY packages/common-be/package.json packages/common-be/package.json
COPY packages/cvi-arbitrage-bot/package.json packages/cvi-arbitrage-bot/package.json
COPY packages/cvi-monitoring-bot/package.json packages/cvi-monitoring-bot/package.json
COPY packages/data-feed/package.json packages/data-feed/package.json
COPY packages/cvi-tweet/package.json packages/cvi-tweet/package.json
COPY packages/docs/package.json packages/docs/package.json
COPY packages/hardhat-csm-ui/package.json packages/hardhat-csm-ui/package.json
COPY packages/contracts-cvi/package.json packages/contracts-cvi/package.json
COPY packages/contracts-il/package.json packages/contracts-il/package.json
COPY packages/contracts-deploy/package.json packages/contracts-deploy/package.json
COPY packages/contracts-staking/package.json packages/contracts-staking/package.json
COPY packages/helm-chart/package.json packages/helm-chart/package.json
COPY packages/il-backend/package.json packages/il-backend/package.json
COPY packages/il-cli-ui/package.json packages/il-cli-ui/package.json
COPY packages/il-formulas-ui/package.json packages/il-formulas-ui/package.json
COPY packages/il-monitor/package.json packages/il-monitor/package.json
COPY packages/lw-sdk/package.json packages/lw-sdk/package.json
COPY packages/py-parabola-coefficients/package.json packages/py-parabola-coefficients/package.json
COPY packages/chatgpt-server/package.json packages/chatgpt-server/package.json
COPY packages/scripts-cli/package.json packages/scripts-cli/package.json
COPY packages/tests-infra-be/package.json packages/tests-infra-be/package.json
COPY packages/traders-ui/package.json packages/traders-ui/package.json
# --end--

# we need access to install @coti-cvi/cvi-sdk so we inject the npm-token
ARG NPM_REGISTRY_ADDRESS
ARG NPM_TOKEN

# NPM_TOKEN will be injected later and it is to avoid printing the token in the logs and in .npmrc
RUN echo "//${NPM_REGISTRY_ADDRESS}/:_authToken=${NPM_TOKEN}" > ~/.npmrc

# install monorepo dependencies
RUN yarn install

ADD . ./

ARG IMAGE_VERSION
RUN echo "${IMAGE_VERSION}" > image_version