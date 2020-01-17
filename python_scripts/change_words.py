import json
from urllib import parse
import re
from operator import itemgetter


def find_whole_world(word, addflag=0):
    """
    Find an exact match of the word.

    Parameters
    ----------
    word : string
        word to find
    addflag : int, optional
        To find case (in)-sensitive words, by default 0

    Returns
    -------
    object
        compliler object
    """
    return re.compile(r'\b({0})\b'.format(word), flags=addflag)


def get_word_locations(string):
    """
    Find the index of the specific word in a string.

    Parameters
    ----------
    string : str
        Whole string that needs to be transformed.

    Returns
    -------
    list
        list of dictionaries with index locations of specific words.
    """
    tochange = ["oracle", "google", "microsoft", "amazon", "deloitte"]
    word_list = []
    for item in tochange:
        word_exists = find_whole_world(item, re.IGNORECASE).finditer(string)
        for word in word_exists:
            word_dict = {}
            word_dict["start"] = word.start()
            word_dict["value"] = word.group()
            word_list.append(word_dict)
    return word_list


def order_list(word_list):
    """
    Order this list based on keys in a dictionary. Order Asc.

    Parameters
    ----------
    word_list : list
        List of dictionaries (e.g. {"start": "15", "value": "Deloitte"})

    Returns
    -------
    list
        List of ordered dictionaries.
    """
    newlist = sorted(word_list, key=itemgetter('start'))
    return newlist


def change_word(string, start, word, count=0):
    """
    Change a specific word to something else

    Parameters
    ----------
    string : str
        The whole sentence
    start : int
        Where the first occurrence is of a word
    word : str
        New word
    count : int, optional
        strings are inmutable, therefore we need to account for the increase in length
        , by default 0

    Returns
    -------
    str
        A string with a changed word
    """
    end = (len(word) - 1)
    start = start + count
    newstring = f"{string[:start]}{word}{string[start+end:]}"
    return newstring


def change_words(string):
    """
    Orchestration function to change all words in a list that match
    a specific case.

    Parameters
    ----------
    string : str
        Sentence that needs to be changed

    Returns
    -------
    str
        New sentence
    """
    word_list = get_word_locations(string)
    ordered_word_list = order_list(word_list)
    count = 0
    for item in ordered_word_list:
        string = change_word(string, item["start"], "{}\u00A9".format(item["value"]), count)
        count += 1
    return string


def lambda_handler(event, context):
    """
    Lambda handler to handle incoming api call,
    change a specific sentence based on specific cases,
    returns new sentence.

    Parameters
    ----------
    event : dict
        Lambda event
    context : dict
        Lambda context

    Returns
    -------
    dict
        Api response
    """
    string_to_change = json.loads(event["body"])
    if isinstance(string_to_change, dict):
        string_to_change = string_to_change.get("description", "Default string")

    changed_string = change_words(string_to_change)
    return {
        'statusCode': 200,
        "headers": {
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(changed_string)
    }
