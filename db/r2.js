import "dotenv/config";

import {
    S3Client
} from "@aws-sdk/client-s3";

const r2 = new S3Client({

    region: process.env.B2_REGION,

    endpoint: process.env.B2_ENDPOINT,

    credentials: {

        accessKeyId: process.env.B2_APPLICATION_KEY_ID,

        secretAccessKey: process.env.B2_APPLICATION_KEY

    }

});

export default r2;