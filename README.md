# fileshare-s3-ably
 
This project demonstrates how to upload a file to an AWS S3 bucket and then send a signed URL to the file over an Ably Realtime channel.

## Prerequisites

- Node.js installed (v14 or higher recommended)
- An AWS account with access to S3 services
- Ably account for Realtime messaging

## Environment Setup

1. Clone the repository.
2. Install the required Node.js packages by running `npm install` or `yarn` in the root directory of the project.
3. Create a `.env` file in the root directory and fill it with your configuration:

```env
ABLY_API_KEY=your-ably-api-key
AWS_REGION=your-aws-region
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_SESSION_TOKEN=your-aws-session-token # if you are using temporary credentials
AWS_BUCKET_NAME=your-s3-bucket-name
```

## Running the Project

1. Once the environment variables are set, run the project using `node index.js`.
2. The script will upload a sample file to your specified S3 bucket and then send a signed URL of that object over an Ably Realtime channel.

## How it Works

- The `uploadToS3` function uploads a file to your specified S3 bucket.
- After a successful upload, a signed URL is generated for that file using `getPresignedUrl`.
- This signed URL is then sent over an Ably Realtime channel using the `signalFileLink` function.

## Contributing

Feel free to fork the project and submit pull requests or issues. Feedback is more than welcome!
