#!/bin/sh
# 40-import-meta-env.sh is named like that to be executed 
# to follow order placed on /docker-entrypoint.d directory 
# https://iendeavor.github.io/import-meta-env/guide/getting-started/introduction.html

/app/import-meta-env-alpine -x /app/.env.example -o /app/index.html || exit 1
