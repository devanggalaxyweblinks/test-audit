FROM node:18-alpine

# Install AWS CLI
RUN apk add --no-cache aws-cli

WORKDIR /app

# Copy package files
COPY package*.json ./

# Args for AWS credentials (only used during build)
ARG AWS_ACCESS_KEY_ID_GL
ARG AWS_SECRET_KEY_ID_GL

RUN AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID_GL \
    AWS_SECRET_ACCESS_KEY=$AWS_SECRET_KEY_ID_GL \
    aws codeartifact login --tool npm --repository node --domain demo --region us-east-1 && \
    if [ -f package-lock.json ]; then rm package-lock.json; fi && \
    npm install --no-cache && \
    unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY && \
    rm -rf /root/.aws && \
    rm -rf /root/.npm

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3006

# Start the application
CMD ["npx", "concurrently", "npm start", "npm run doc"]
