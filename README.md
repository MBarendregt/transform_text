## Case for Deloitte

Hello, here you find the code for the case.
Try to convert: 

`Amazon`, `Deloitte`, `Oracle`, `Google` or `Microsoft`.

It should be upper and lowercase agnostic. 

If invoked by postman:
"https://onuif9iroi.execute-api.eu-west-1.amazonaws.com/prod/transform"

set Authorization to NoAuth

Set in Headers: 
`KEY: authorizationToken`
`VALUE: Access_for_deloitte` 

or go to 
http://amplifyapp-20200115082834-hostingbucket-master.s3-website-eu-west-1.amazonaws.com/

In the folder python_scripts you will find the python files that are used in the lambda functions.
One is some custom authentication, the other is transforming the strings. 

The other folder amplifyapp is just there to create the frond-end with some customization. 
