
- SELinux 有効無効の確認
```
$ getenforce
```
Enforcing → SELinux有効  
Disabled → SELinux無効


SELinux属性情報が間違っていて、ethの認識順を直せない時の対応
被疑箇所確認-事前確認
```
ls -la /etc/sysconfig/network-scripts/ifcfg-eth*
ls -lZ /etc/sysconfig/network-scripts/ifcfg-eth*
```
表示例)
-rw-r--r--. root root system_u    :object_r:file_t    :s0 ifcfg-eth0  ★修正対象は0側のtype箇所のみで、userの差異は影響無い想定
-rw-r--r--. root root unconfined_u:object_r:net_conf_t:s0 ifcfg-eth1

typeの変更
```
chcon -t net_conf_t /etc/sysconfig/network-scripts/ifcfg-eth0
```

被疑箇所確認-事後確認
```
ls -lZ /etc/sysconfig/network-scripts/ifcfg-eth*
```
表示例)
-rw-r--r--. root root system_u    :object_r:net_conf_t:s0 ifcfg-eth0
-rw-r--r--. root root unconfined_u:object_r:net_conf_t:s0 ifcfg-eth1

ls -la /etc/sysconfig/network-scripts/ifcfg-eth*

SELInuxが有効な状態で、fileの複製、追加時に、属性情報が間違っていると、
直さないといけなくなる可能性有
