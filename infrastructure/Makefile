package: 
	sam package --output-template-file packaged.yaml --s3-bucket kodo-lambda
deploy: 
	sam deploy --template-file packaged.yaml --stack-name kodo --capabilities CAPABILITY_IAM --region eu-west-1