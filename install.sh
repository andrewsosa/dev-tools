#!/bin/bash -e

# install base deps
echo "> Installing eslint & prettier"
npm install -D eslint prettier

# install eslint airbnb peerdeps
echo "> Adding eslint extras"
npm install -D eslint-config-airbnb-base eslint-plugin-import

# install compat for eslint + prettier
echo "> Setting up compatibility layer"
npm install -D eslint-config-prettier eslint-plugin-prettier

# check the security
echo "> Performing security checks"
npm audit fix
echo ""

# eslint config file
echo "> Creating config files"
cat > .eslintrc.js << EOL
module.exports = {
  "extends": ["airbnb-base", "prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": ["error"]
  },
}
EOL
echo "+ .eslintrc.js"

# prettier config file
cat > .prettierrc << EOL
{
  "endOfLine": "lf",
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5"
}
EOL
echo "+ .prettierrc"

# editorconfig
cat > .editorconfig << EOL
root = true

[*]
indent_style = space
indent_size = 4
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true


[Makefile]
indent_style = tab
indent_size = 4

[*.{js,json,yml}]
indent_size = 2
EOL
echo "+ .editorconfig"
