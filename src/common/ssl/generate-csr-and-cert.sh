#!/bin/bash
rm -f *.crt
rm -f *.csr
rm -f *.key
rm -f *.p12

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
APP_NAME="rakida-auth"
K8S_NAMESPACE="rakia"

openssl genrsa -out $APP_NAME.key 2048

openssl req -new \
  -key $DIR/$APP_NAME.key \
  -out $DIR/$APP_NAME.csr \
  -config $DIR/openssl.cnf \
  -subj "/C=US/ST=PA/L=Pittsburgh/OU=UPMC Enterprises/O=UPMC/CN=$APP_NAME.$K8S_NAMESPACE.svc.k8s.local"

openssl x509 -req -days 3650 -in $DIR/$APP_NAME.csr -signkey $DIR/$APP_NAME.key -out $DIR/$APP_NAME.crt -extensions v3_req -extfile $DIR/openssl.cnf

openssl pkcs12 -export \
  -in $APP_NAME.crt \
  -passin pass:changeit \
  -passout pass:changeit \
  -inkey $APP_NAME.key \
  -out $APP_NAME.p12 -name $APP_NAME \
  -CAfile $APP_NAME.crt -caname root

rm *.csr
