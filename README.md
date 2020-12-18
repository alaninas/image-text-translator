<img src="https://avatars2.githubusercontent.com/u/2810941?v=3&s=96" alt="Google Cloud Platform logo" title="Google Cloud Platform" align="right" height="96" width="96"/>

### Cloud Computing Course Project

# Image Text Translator App (ITT App)

Basic GCP App to upload pictures (containing text), read the text 
and translate it using Google Translator into French, English, Spanish and Japanese. 

Set of languages is modifiable: by changing ENV variable TO_LANG 
(see src/deploy-functions.sh)
and making sure translations are being saved to the appropriate bucket files 
(see $PROJECT_NAME-result-bucket filenames in services).

## Resources used to create the App
### 1. Getting Started with Node.js on Google Cloud Platform

This directory contains the code for deploying a basic Node.js app to Google Cloud Platform.

* [Getting started with Node.js](https://cloud.google.com/nodejs/getting-started)

### 2. Google Cloud Functions - OCR (Optical Character Recognition) sample

* [Cloud Functions OCR tutorial](https://cloud.google.com/functions/docs/tutorials/ocr)


## Google Cloud Services used in the ITT App

* App Engine
* Cloud Storage
* Firestore
* Firebase
* Cloud Functions
* Cloud Pub/Sub
* Cloud Translation API
* Cloud Vision API
* Google Cloud's operations suite

## Project build and deploy

Make sure environment variables and GCP setting are in accordance with the manuals 
([GCP Node.js](https://cloud.google.com/nodejs/getting-started), 
[OCR](https://cloud.google.com/functions/docs/tutorials/ocr)), 
before running the app locally.

* Run locally with npm: building the project for the first time 
  (need to deploy GCP functions)
```
cd src
npm install
npm run start:build
```
* Running locally after the initial build
```
npm run start
```

* Run in the browser via App Engine
```
https://ocr-2020-298906.uc.r.appspot.com
```
