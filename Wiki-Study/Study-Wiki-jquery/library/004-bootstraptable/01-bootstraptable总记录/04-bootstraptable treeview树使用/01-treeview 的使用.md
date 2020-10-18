# treeview 的使用

## 基础


## treeview 使用点

### 修改节点颜色
```js
if (stationResultRow.length > 0) {
              stationResultRow.map((station) => {
                _this.airStationTreeData.forEach((s) => {
                  if (s["name"] == station["siteName"]) {
                    s["online"] =
                      station["online"] == 1
                        ? "<span style='color:green'>在线</span>"
                        : "<span style='color:red'>离线</span>";
                    s["nameAndOnline"] = s["name"] + " - " + s["online"];
                    s["text"] = s["nameAndOnline"];
                  }
                });
              });
            }
```

