FROM centos:centos7.9.2009 as base

RUN ["/bin/bash", "-c", "rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY*"]
RUN ["/bin/bash", "-c", "echo 'y' | yum install unzip"]
RUN ["/bin/bash", "-c", "echo 'y' | yum install java-11-openjdk-devel"]
RUN ["/bin/bash", "-c", "echo 'y' | yum install openssh-server"]
RUN if [ $(uname -m) = "x86_64" ] ; then (echo 'y' | yum install https://download.postgresql.org/pub/repos/yum/reporpms/EL-7-x86_64/pgdg-redhat-repo-latest.noarch.rpm) \
    ; else (echo 'y' | yum install https://download.postgresql.org/pub/repos/yum/reporpms/EL-7-aarch64/pgdg-redhat-repo-latest.noarch.rpm) ; fi
RUN ["/bin/bash", "-c", "echo 'y' | yum install -y --nogpgcheck postgresql14-server"]
RUN ["/bin/bash", "-c", "useradd {{appName}}"]
RUN ["/bin/bash", "-c", "echo {{appName}}:{{appName}} | chpasswd"]
RUN ["/bin/bash", "-c", "usermod -aG wheel {{appName}}"]
RUN ["/bin/bash", "-c", "mkdir /home/{{appName}}/run"]
RUN ["/bin/bash", "-c", "mv /usr/bin/systemctl /usr/bin/systemctl.old"]
RUN ["/bin/bash", "-c", "curl https://raw.githubusercontent.com/gdraheim/docker-systemctl-replacement/master/files/docker/systemctl.py > /usr/bin/systemctl"]
RUN ["/bin/bash", "-c", "chmod +x /usr/bin/systemctl"]
RUN ["/bin/bash", "-c", "/usr/bin/ssh-keygen -A"]

FROM base as copy-distributions

WORKDIR /home/{{appName}}/run/
COPY ./build/dependencies/genesisproduct*.zip .
COPY ./build/dependencies/genesis-distribution*.zip .
COPY ./build/dependencies/{{appName}}-site-specific*.zip .
COPY ./build/dependencies/auth-distribution-*.zip .

RUN unzip \*.zip
RUN rm *.zip
RUN ["/bin/bash", "-c", "chown -hR {{appName}}:{{appName}} ../run/"]

FROM copy-distributions as setup-genesis

RUN echo "GENESIS_HOME=/home/{{appName}}/run/" >> /home/{{appName}}/.bashrc
RUN echo "export GENESIS_HOME" >> /home/{{appName}}/.bashrc
RUN echo "source \$GENESIS_HOME/genesis/util/setup.sh" >> /home/{{appName}}/.bashrc

FROM setup-genesis as configure-db
COPY docker-scripts/configureDB.sh /scripts/configureDB.sh
RUN ["chmod", "+x", "/scripts/configureDB.sh"]
RUN ["/scripts/configureDB.sh"]

FROM configure-db as genesis-install
COPY docker-scripts/genesisInstall.sh /scripts/genesisInstall.sh
RUN ["chmod", "+x", "/scripts/genesisInstall.sh"]
RUN ["/scripts/genesisInstall.sh"]

FROM genesis-install as remap
COPY docker-scripts/remap.sh /scripts/remap.sh
RUN ["chmod", "+x", "/scripts/remap.sh"]
RUN ["/scripts/remap.sh"]

FROM remap as entryPoint
COPY docker-scripts/docker-entrypoint.sh /scripts/docker-entrypoint.sh
RUN chmod +x /scripts/docker-entrypoint.sh
ENTRYPOINT ["/scripts/docker-entrypoint.sh"]