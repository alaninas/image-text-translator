#!/bin/sh

# See:
# https://cloud.google.com/functions/docs/tutorials/ocr

if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

# Process image
gcloud functions deploy ocr-extract \
--runtime nodejs12 \
--trigger-bucket $YOUR_IMAGE_BUCKET_NAME \
--entry-point processImage \
--set-env-vars "^:^GCP_PROJECT=$YOUR_PROJECT_ID:TRANSLATE_TOPIC=$YOUR_TRANSLATE_TOPIC_NAME:RESULT_TOPIC=$YOUR_RESULT_TOPIC_NAME:TO_LANG=$YOUR_LANGUAGES"

# Translate
gcloud functions deploy ocr-translate \
--runtime nodejs12 \
--trigger-topic $YOUR_TRANSLATE_TOPIC_NAME \
--entry-point translateText \
--set-env-vars "GCP_PROJECT=$YOUR_PROJECT_ID,RESULT_TOPIC=$YOUR_RESULT_TOPIC_NAME"

# Save to cloud storage
gcloud functions deploy ocr-save \
--runtime nodejs12 \
--trigger-topic $YOUR_RESULT_TOPIC_NAME \
--entry-point saveResult \
--set-env-vars "RESULT_BUCKET=$YOUR_RESULT_BUCKET_NAME"
