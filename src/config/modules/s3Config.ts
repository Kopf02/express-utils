import { Schema } from 'convict';

export interface IS3Config {
  s3: {
    bucketName: string;
    endpoint: string;
    usePathStyle: boolean;
    accessKey: string;
    accessSecret: string;
  };
}

export const s3Config: Schema<IS3Config> = {
  s3: {
    bucketName: {
      doc: 'The name of the bucket to use',
      format: String,
      default: null,
      env: 'S3_BUCKET_NAME',
    },
    endpoint: {
      doc: 'The endpoint to use',
      format: String,
      default: null,
      env: 'S3_ENDPOINT',
    },
    usePathStyle: {
      doc: 'The Path Style to use (Force Path / Use Path)',
      format: Boolean,
      default: true,
      env: 'S3_USE_PATH_STYLE',
    },
    accessKey: {
      doc: 'The Access Key to use',
      format: String,
      default: null,
      env: 'S3_ACCESS_KEY',
    },
    accessSecret: {
      doc: 'The Access Secret to use',
      format: String,
      default: null,
      env: 'S3_ACCESS_SECRET',
    },
  },
};
