#!/bin/bash
source /home/{{appName}}/.bashrc
/usr/pgsql-14/bin/postgresql-14-setup initdb
sed -E -i 's/local([[:space:]]+)all([[:space:]]+)all([[:space:]]+)peer/local\1all\2all\3trust/' /var/lib/pgsql/14/data/pg_hba.conf
sed -i 's/\(host  *all  *all  *127.0.0.1\/32  *\)ident/\1trust/' /var/lib/pgsql/14/data/pg_hba.conf
sed -i 's/\(host  *all  *all  *::1\/128  *\)ident/\1trust/' /var/lib/pgsql/14/data/pg_hba.conf
sed -i -e"s/^#listen_addresses =.*$/listen_addresses = '*'/" /var/lib/pgsql/14/data/postgresql.conf
sed -r -i "s/[#]*\s*max_connections\s*=.*/max_connections = 1024/" /var/lib/pgsql/14/data/postgresql.conf
echo "host    all    all    0.0.0.0/0    trust" >> /var/lib/pgsql/14/data/pg_hba.conf
systemctl enable postgresql-14
systemctl start postgresql-14
psql -U postgres -c "ALTER USER postgres password 'postgres';"
