#!/bin/sh
    rm -f /tmp/ipv6.log
    sleep 15 #我这里需要延迟才能正常使用v6,否则能获取v6地址但不能访问网络
    cp -f /etc/config/ipv6/dhcp /etc/config/dhcp
    cp -f /etc/config/ipv6/network /etc/config/network
    echo set ipv6 ok! > /tmp/ipv6.log
    ifup wan3 >> /tmp/ipv6.log
