package: 
	sam package --output-template-file packaged.yaml --s3-bucket vs-odo-lambda
deploy: 
	sam deploy --template-file packaged.yaml --stack-name vs-odo --capabilities CAPABILITY_IAM --region eu-west-1