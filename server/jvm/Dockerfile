FROM centos:7.9.2009 as base

SHELL ["/bin/bash", "-c"]

RUN rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY* &&\
    yum -y install unzip \
    java-11-openjdk-devel \
    openssh-server \
    dos2unix
RUN if [ $(uname -m) = "x86_64" ] ; then (echo 'y' | yum install https://download.postgresql.org/pub/repos/yum/reporpms/EL-7-x86_64/pgdg-redhat-repo-latest.noarch.rpm) \
    ; else echo 'y' | yum install https://download.postgresql.org/pub/repos/yum/reporpms/EL-7-aarch64/pgdg-redhat-repo-latest.noarch.rpm ;  \
    yum -y install epel-release ;  \
    yum -y install lmdb ;  \
    ln -s /usr/lib64/liblmdb.so.0.0.0 /usr/lib64/liblmdb.so ; fi
RUN yum -y install --nogpgcheck postgresql14-server
RUN useradd {{appName}} &&\
    echo {{appName}}:{{appName}} | chpasswd &&\
    usermod -aG wheel {{appName}} &&\
    mkdir /home/{{appName}}/run &&\
    mv /usr/bin/systemctl /usr/bin/systemctl.old &&\
    curl https://raw.githubusercontent.com/gdraheim/docker-systemctl-replacement/master/files/docker/systemctl.py > /usr/bin/systemctl &&\
    chmod +x /usr/bin/systemctl &&\
    /usr/bin/ssh-keygen -A

FROM base as copy-distributions
WORKDIR /home/{{appName}}/run/
COPY ./build/dependencies/genesisproduct*.zip ./build/dependencies/genesis-distribution*.zip ./build/dependencies/{{appName}}-site-specific*.zip ./build/dependencies/auth-distribution-*.zip ./
RUN unzip \*.zip &&\
    rm *.zip

FROM base as unzipped-distributions
COPY --chown={{appName}}:{{appName}} --from=copy-distributions /home/{{appName}}/run /home/{{appName}}/run
RUN chown {{appName}}:{{appName}} /home/{{appName}}/run

FROM unzipped-distributions as setup-genesis
COPY docker-scripts/.bashrc /home/{{appName}}
COPY docker-scripts/*.sh /scripts/
RUN chmod +x /scripts/*.sh &&\
    dos2unix /scripts/docker-entrypoint.sh

FROM setup-genesis as configure-db
RUN /scripts/configureDB.sh

FROM configure-db as genesis-install
RUN /scripts/genesisInstall.sh

FROM genesis-install as remap
RUN /scripts/remap.sh

ENTRYPOINT ["/scripts/docker-entrypoint.sh"]
