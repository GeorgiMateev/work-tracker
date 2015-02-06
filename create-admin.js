db = db.getSiblingDB('work-tracker-dev');
db.users.update({'username': 'admin'},
    {'$push': {'roles': 'administrator'}});