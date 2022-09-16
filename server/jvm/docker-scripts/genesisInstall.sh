#!/bin/bash
source /home/{{appName}}/.bashrc
systemctl start postgresql-14
su -c "source /home/{{appName}}/.bashrc ; genesisInstall" - "{{appName}}"
echo "genesisInstall done"