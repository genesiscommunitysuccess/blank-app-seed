#!/bin/bash
systemctl start postgresql-14
systemctl enable sshd.service
systemctl start sshd.service
su -c "startServer" - "{{appName}}"
echo "Logged as {{appName}}, starting server"
tail -f /dev/null