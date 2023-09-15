require('dotenv').config();
const mime = require('mime-types');
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const Ably = require('ably');

const ably = new Ably.Realtime(process.env.ABLY_API_KEY);
const channel = ably.channels.get('file-uploads');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN // if you are using temporary credentials
  },
});

const uploadToS3 = async (file, fileName) => {
  const contentType = mime.contentType(fileName);
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file,
    ContentDisposition: 'inline',
    ContentType: contentType,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    console.log("Upload Success");
    const signedUrl = await getPresignedUrl(fileName);
    signalFileLink(signedUrl);
  } catch (err) {
    console.log("Error", err);
  }
};

const getPresignedUrl = async (fileName) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // The URL will expire in 1 hour
    });
    return signedUrl;
  } catch (err) {
    console.log("Error getting pre-signed URL", err);
    return null;
  }
};

const signalFileLink = (link) => {
  channel.publish('file-link', { link: link }, (err) => {
    if (err) {
      console.log('Error publishing message', err);
    } else {
      console.log('Message published successfully');
    }
  });
};

// Replace this with your actual file content and file name
const sampleFile = Buffer.from('This is the file content');
const sampleFileName = 'sample.txt';

// Upload file to S3 and signal link over Ably
uploadToS3(sampleFile, sampleFileName);
