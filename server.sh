
# export $(grep -v '^#' .env | xargs)

# export NITRO_SSL_KEY="`cat ${SERVER_SSL_KEY_PATH}`"
# export NITRO_SSL_CERT="`cat ${SERVER_SSL_CRT_PATH}`"

exec node .output/server/index.mjs
