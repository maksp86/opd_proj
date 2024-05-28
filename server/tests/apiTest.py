import requests
from dotenv import load_dotenv
import os

load_dotenv(os.path.abspath(os.path.join(
    os.path.dirname(__file__), os.pardir, ".env")))

NO_ERROR_STATUS = "no_error"

BASE_ADDRESS = f"http://localhost:{os.getenv('port')}/api/"

TEST_ACCOUNT = {"username": "admin", "password": "OYYBxPynhx4UBhDMsONR"}

AdminCookies = {}
UserCookies = {}
EditorCookies = {}


def makePostRequest(endpoint, cookies, data=None):
    req = requests.post(BASE_ADDRESS + endpoint, json=data,
                        headers={"Content-Type": "application/json"}, cookies=cookies)
    reqjson = req.json()
    print(endpoint, reqjson, end='')
    if (reqjson["status"] != NO_ERROR_STATUS or req.status_code not in [200, 201]):
        print(f"error on {endpoint}")
    if "connect.sid" in req.cookies.keys():
        Cookies["connect.sid"] = req.cookies.get("connect.sid")
    print("\tok")
    return reqjson


def makeGetRequest(endpoint, cookies, data=None):
    req = requests.get(BASE_ADDRESS + endpoint, data, cookies=cookies)
    reqjson = req.json()
    print(endpoint, reqjson, end='')
    if (reqjson["status"] != NO_ERROR_STATUS or req.status_code not in [200, 201]):
        print(f"error on {endpoint}")
    print("\tok")
    return reqjson


makeGetRequest("healthcheck")

makePostRequest("user/login", AdminCookies, TEST_ACCOUNT)

rolesToCreate = [{"name": "Test_Api_Role_Editor", "permissions": "474"}, {
    "name": "Test_Api_Role_User", "permissions": "440"}]
roles = makeGetRequest("admin/role/list")["value"]
created = False

for i in range(len(rolesToCreate)):
    foundRole = next((item for item in roles if item["name"] == rolesToCreate[i]
                     ["name"] and item["permissions"] == rolesToCreate[i]["permissions"]), None)
    if (not foundRole):
        createdRole = makePostRequest("admin/role/add", rolesToCreate[i])
        rolesToCreate[i]["_id"] = createdRole["value"]["_id"]
        created = True
    else:
        rolesToCreate[i]["_id"] = foundRole["_id"]

for role in rolesToCreate:
    makePostRequest("admin/role/edit",
                    {"id": role["_id"], "permissions": "000"})

for role in rolesToCreate:
    makePostRequest("admin/role/remove", {"id": role["_id"]})
