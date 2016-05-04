#!/bin/sh

# POSTGRES CONFIGURATION
export SEQUELIZE_URI="postgres://user:pass@localhost:5432/dbname"

grunt "$@"
