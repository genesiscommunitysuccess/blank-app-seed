#!/bin/bash
source /home/{{appName}}/.bashrc
systemctl start postgresql-14
su -c "source /home/{{appName}}/.bashrc ; yes | remap --commit" - "{{appName}}"
su -c "JvmRun global.genesis.environment.scripts.SendTable -t USER -f /home/{{appName}}/run/site-specific/data/user.csv" - "{{appName}}"
echo "remap done"
