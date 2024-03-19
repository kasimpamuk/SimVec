Installation:

1. brew install node
   brew install watchman

2. brew tap homebrew/cask-versions
   brew install --cask zulu17

# Get path to where cask was installed to double-click installer

brew info --cask zulu17

## Important:

get into simvec-mobil/simvecMobil folder and type:
"npm install" to terminal

3. Install Android Studio

4. Export path

Copy this into "@react-native/typescript-config/tsconfig.json":

{
"$schema": "https://json.schemastore.org/tsconfig",
"display": "React Native",
"compilerOptions": {
"target": "esnext",
"module": "es2015",
"types": ["react-native", "jest"],
"lib": [
"es2019",
"es2020.bigint",
"es2020.date",
"es2020.number",
"es2020.promise",
"es2020.string",
"es2020.symbol.wellknown",
"es2021.promise",
"es2021.string",
"es2021.weakref",
"es2022.array",
"es2022.object",
"es2022.string",
"DOM"
],
"allowJs": true,
"jsx": "react-native",
"noEmit": true,
"isolatedModules": true,
"strict": true,
"moduleResolution": "bundler",
"customConditions": ["react-native"],
"allowImportingTsExtensions": true,
"allowArbitraryExtensions": true,
"resolveJsonModule": true,
"resolvePackageJsonImports": false,
"allowSyntheticDefaultImports": true,
"esModuleInterop": true,
"skipLibCheck": true,
// Causes issues with package.json "exports"
"forceConsistentCasingInFileNames": false
},
"exclude": [
"node_modules",
"babel.config.js",
"metro.config.js",
"jest.config.js"
]
}
