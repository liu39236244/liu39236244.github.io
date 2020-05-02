# awk 零散总结

# 1-awk 零散命令

```Shell
awk  -F '|'  '{if($4!="106.5691696" && $5!="27.58886461") print $4","$5";" } ' gsh.txt >gsh1.txt

```
