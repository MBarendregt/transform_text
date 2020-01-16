import json
from urllib import parse
import re


def find_whole_world(w, addflag=0):
    return re.compile(r'\b({0})\b'.format(w), flags=addflag)


def change_words(string):
    tochange = ["oracle", "google", "microsoft", "amazon", "deloitte"]
    for item in tochange:
        word_exists = find_whole_world(item, re.IGNORECASE).findall(string)
        if len(word_exists) > 0:
            for word in word_exists:
                exact_match = find_whole_world(word).search(string)
                word_index = exact_match.span()
                string = string.replace(string[word_index[0]:word_index[1]], "{}\u00A9".format(string[word_index[0]:word_index[1]]), 1)
    return string


def lambda_handler(event, context):
    print(event)
    string_to_change = json.loads(event["body"])
    if isinstance(string_to_change, dict):
        string_to_change = string_to_change.get("description", "Default string")

    print(string_to_change)
    changed_string = change_words(string_to_change)
    return {
        'statusCode': 200,
        "headers": {
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(changed_string)
    }
