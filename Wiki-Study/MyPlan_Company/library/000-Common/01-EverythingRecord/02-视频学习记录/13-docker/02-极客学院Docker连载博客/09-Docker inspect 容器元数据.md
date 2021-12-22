
# 09-Docker inspect 容器元数据

容器元数据 就是指创建容器时，容器自带的信息

元数据
元数据 (meta data)——"data about data" 描述数据的数据，一般是结构化数据 ( 如存储在数据库里的数据，规定了字段的长度、类型等 )

元数据是指从信息资源中抽取出来的用于说明其特征、内容的结构化的数据(如题名,版本、出版数据、相关说明,包括检索点等)，用于组织、描述、检索、保存、管理信息和知识资源

docker inspect
Docker 中可以使用 docker inspect 命令来查看容器的元数据, 它会返回一个 JSON 文件记录着容器的配置和状态信息

`docker inspect <container_id>`

我们先使用 docker ps -a 命令看一下有哪些容器

```
[root@localhost ~]# docker ps -a
CONTAINER ID        ...
cf38bec0c26f        ...
e66458d65564        ...
b3b54da0        ...
e08201b591cd        ...

```

我们随便挑一个容器 id，比如 e08201b591cd 然后使用 docker inspect 命令看一下它的元数据

```sh
[root@localhost ~]# docker inspect e08201b591cd
[
    {
        "Id": "e08201b591cdccd198fa32c4eedbda4a9ca6c81ce2c066e885c592aede52a8a6",
        "Created": "2018-05-30T23:37:48.6125189Z",
        "Path": "/bin/bash",
        "Args": [],
        "State": {
            "Status": "exited",
            "Running": false,
            "Paused": false,
            "Restarting": false,
            "OOMKilled": false,
            "Dead": false,
            "Pid": 0,
            "ExitCode": 0,
            "Error": "",
            "StartedAt": "2018-05-30T23:37:49.3270577Z",
            "FinishedAt": "2018-05-30T23:37:51.1694816Z"
        },
        "Image": "sha256:e4422b8da209755dd5a8aa201ba79cef0c465003f46f6313f318a0e306e4fe05",
        "ResolvConfPath": "/var/lib/docker/containers/e08201b591cdccd198fa32c4eedbda4a9ca6c81ce2c066e885c592aede52a8a6/resolv.conf",
        "HostnamePath": "/var/lib/docker/containers/e08201b591cdccd198fa32c4eedbda4a9ca6c81ce2c066e885c592aede52a8a6/hostname",
        "HostsPath": "/var/lib/docker/containers/e08201b591cdccd198fa32c4eedbda4a9ca6c81ce2c066e885c592aede52a8a6/hosts",
        "LogPath": "/var/lib/docker/containers/e08201b591cdccd198fa32c4eedbda4a9ca6c81ce2c066e885c592aede52a8a6/e08201b591cdccd198fa32c4eedbda4a9ca6c81ce2c066e885c592aede52a8a6-json.log",
        "Name": "/hopeful_wing",
        "RestartCount": 0,
        "Driver": "overlay2",
        "Platform": "linux",
        "MountLabel": "",
        "ProcessLabel": "",
        "AppArmorProfile": "",
        "ExecIDs": null,
        "HostConfig": {
            "Binds": null,
            "ContainerIDFile": "",
            "LogConfig": {
                "Type": "json-file",
                "Config": {}
            },
            "NetworkMode": "default",
            "PortBindings": {},
            "RestartPolicy": {
                "Name": "no",
                "MaximumRetryCount": 0
            },
            "AutoRemove": false,
            "VolumeDriver": "",
            "VolumesFrom": null,
            "CapAdd": null,
            "CapDrop": null,
            "Dns": [],
            "DnsOptions": [],
            "DnsSearch": [],
            "ExtraHosts": null,
            "GroupAdd": null,
            "IpcMode": "shareable",
            "Cgroup": "",
            "Links": null,
            "OomScoreAdj": 0,
            "PidMode": "",
            "Privileged": false,
            "PublishAllPorts": false,
            "ReadonlyRootfs": false,
            "SecurityOpt": null,
            "UTSMode": "",
            "UsernsMode": "",
            "ShmSize": 67108864,
            "Runtime": "runc",
            "ConsoleSize": [
                0,
                0
            ],
            "Isolation": "",
            "CpuShares": 0,
            "Memory": 0,
            "NanoCpus": 0,
            "CgroupParent": "",
            "BlkioWeight": 0,
            "BlkioWeightDevice": [],
            "BlkioDeviceReadBps": null,
            "BlkioDeviceWriteBps": null,
            "BlkioDeviceReadIOps": null,
            "BlkioDeviceWriteIOps": null,
            "CpuPeriod": 0,
            "CpuQuota": 0,
            "CpuRealtimePeriod": 0,
            "CpuRealtimeRuntime": 0,
            "CpusetCpus": "",
            "CpusetMems": "",
            "Devices": [],
            "DeviceCgroupRules": null,
            "DiskQuota": 0,
            "KernelMemory": 0,
            "MemoryReservation": 0,
            "MemorySwap": 0,
            "MemorySwappiness": null,
            "OomKillDisable": false,
            "PidsLimit": 0,
            "Ulimits": null,
            "CpuCount": 0,
            "CpuPercent": 0,
            "IOMaximumIOps": 0,
            "IOMaximumBandwidth": 0
        },
        "GraphDriver": {
            "Data": {
                "LowerDir": "/var/lib/docker/overlay2/55a3fbb9340df768968751d5d7ce8079259f10b0d58366fab4cd3479ce2b3dbf-init/diff:/var/lib/docker/overlay2/6c44d4437a85ab8164585a836a9d2f374633d8456ba2817966d934be1d330175/diff:/var/lib/docker/overlay2/87315a6d9aa0ed5a2a7bbe021c2390c0a0de8b929a76790c9082982b374384ef/diff:/var/lib/docker/overlay2/9414cbf7af7e6db83f2c26a1c80dc3f1b1c2dffab7a8d7b47ff5c712cfff90c1/diff:/var/lib/docker/overlay2/4a54ef73e0fccd3c653bb00b6b4a57256c0043ab4c7c0e457cddbd9e3f7cb510/diff:/var/lib/docker/overlay2/a29ae73d46b6b549db1112c0f8fded4d3f70942ea5e8a2aa8afdaaf49fd54c4c/diff",
                "MergedDir": "/var/lib/docker/overlay2/55a3fbb9340df768968751d5d7ce8079259f10b0d58366fab4cd3479ce2b3dbf/merged",
                "UpperDir": "/var/lib/docker/overlay2/55a3fbb9340df768968751d5d7ce8079259f10b0d58366fab4cd3479ce2b3dbf/diff",
                "WorkDir": "/var/lib/docker/overlay2/55a3fbb9340df768968751d5d7ce8079259f10b0d58366fab4cd3479ce2b3dbf/work"
            },
            "Name": "overlay2"
        },
        "Mounts": [],
        "Config": {
            "Hostname": "e08201b591cd",
            "Domainname": "",
            "User": "",
            "AttachStdin": true,
            "AttachStdout": true,
            "AttachStderr": true,
            "Tty": true,
            "OpenStdin": true,
            "StdinOnce": true,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
            ],
            "Cmd": [
                "/bin/bash"
            ],
            "Image": "ubuntu:17.10",
            "Volumes": null,
            "WorkingDir": "",
            "Entrypoint": null,
            "OnBuild": null,
            "Labels": {}
        },
        "NetworkSettings": {
            "Bridge": "",
            "SandboxID": "affe418192894e1f2fe0a063cbbb33983b8d874436994629ce7244b54aafd57c",
            "HairpinMode": false,
            "LinkLocalIPv6Address": "",
            "LinkLocalIPv6PrefixLen": 0,
            "Ports": {},
            "SandboxKey": "/var/run/docker/netns/affe41819289",
            "SecondaryIPAddresses": null,
            "SecondaryIPv6Addresses": null,
            "EndpointID": "",
            "Gateway": "",
            "GlobalIPv6Address": "",
            "GlobalIPv6PrefixLen": 0,
            "IPAddress": "",
            "IPPrefixLen": 0,
            "IPv6Gateway": "",
            "MacAddress": "",
            "Networks": {
                "bridge": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": null,
                    "NetworkID": "d63a40b5f304c0db53f0956641b592dd19bf4486ce9ef17e0d7464ca930b4dfa",
                    "EndpointID": "",
                    "Gateway": "",
                    "IPAddress": "",
                    "IPPrefixLen": 0,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "MacAddress": "",
                    "DriverOpts": null
                }
            }
        }
    }
]
```

数据很长，如果不做统计用途，也没啥大作用，我们这里就不一一解释了

更多 docker inspect 命令使用方法，可以访问 docker inspect 命令