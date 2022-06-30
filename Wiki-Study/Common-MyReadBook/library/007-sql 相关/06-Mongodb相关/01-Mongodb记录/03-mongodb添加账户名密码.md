# mongodb添加账户名密码


## windows 版本

mongodb命令：https://www.jianshu.com/p/0a7452d8843d

use admin;

db.createUser({user: "mongodb_root",pwd: "mongodb_root_!@#",roles: [ { role: "root", db: "admin" } ]});
db.createUser({ user: 'zlgcwz', pwd: 'zlgcwz', roles: [{ role: 'readWrite', db: 'gp-gcwz'}]})

use gp-gcwz
db.createUser({ user: 'zlgcwz', pwd: 'zlgcwz', roles: [{ role: 'readWrite', db: 'gp-gcwz'}]})



use admin
db.auth("mongodb_root","mongodb_root_!@#")
db.auth("zlgcwz","zlgcwz")

use gp-gcwz
db.auth("zlgcwz","zlgcwz")

use gp-xsn
db.createUser({ user: 'MNxsn2021.', pwd: 'MNxsn2021.', roles: [{ role: 'readWrite', db: 'gp-xsn'}]})
