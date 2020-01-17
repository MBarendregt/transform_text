import boto3
import json
import logging
from botocore.exceptions import ClientError
logger = logging.getLogger()
logger.setLevel(logging.INFO)

smclient = boto3.client('secretsmanager', region_name="eu-west-1")


def getSecretFromSecretManager():
    """
    Get authorization token from secretsmanager
    """
    try:
        secretvalue = smclient.get_secret_value(
            SecretId="deloitte-secret", VersionStage="AWSCURRENT")["SecretString"]
        return secretvalue
    except ClientError as e:
        raise Exception(e)


def generatePolicy(effect, methodArn):
    """
    Generate iam policy with allow or deny, based on who is calling the api
    """
    authResponse = {}

    if effect and methodArn:
        policyDocument = {
            'Version': '2012-10-17',
            'Statement': [
                {
                    'Sid': 'FirstStatement',
                    'Action': 'execute-api:Invoke',
                    'Effect': effect,
                    'Resource': methodArn
                }
            ]
        }

        authResponse['policyDocument'] = policyDocument
    return authResponse


def lambda_handler(event, context):
    """
    Check if the authorizationToken provided in the Header is the same as the one stored in secretsmanager
    Also allow s3 origin. 
    """
    authorizationtoken = event["headers"].get("authorizationtoken", event["headers"].get("authorizationToken", False))

    if authorizationtoken is not False or "http://amplifyapp-20200115082834-hostingbucket-master.s3-website-eu-west-1.amazonaws.com" in event["origin"]:
        apisecret = getSecretFromSecretManager()
        if authorizationtoken == apisecret:
            authResponse = generatePolicy('Allow', event['methodArn'])
        else:
            authResponse = generatePolicy('Deny', event['methodArn'])
        return authResponse
    else:
        return {
            "statusCode": 422,
            "body": "Something went wrong"
        }
