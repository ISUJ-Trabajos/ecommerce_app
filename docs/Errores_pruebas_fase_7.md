Analiza y profundiza en el origen de los siguientes errores que se encuentran tras la ejecución de la aplicación, estos errores se encuentran y saltan a la terminal de expo y al navegador web.

La ejecución de las pruebas se realizó dentro del entorno web y local dentro del dispositivo físico (celular).

Los errores son los siguientes:

Consola terminal código (Al ejecutar en celular):

```
 WARN  Linking requires a build-time setting `scheme` in the project's Expo config (app.config.js or app.json) for production apps, if it's left blank, your app may crash. The scheme does not apply to development in the Expo client but you should add it as soon as you start working with Linking to avoid creating a broken build. Learn more: https://docs.expo.dev/guides/linking/
```

Consola web (Al ejecutar en navegador web):

```
Running application "main" with appParams:
 
Object { rootTag: "#root", hydrate: undefined }
 

Development-level warnings: ON.
Performance optimizations: OFF. index.js:71:15
Uncaught (in promise) TypeError: ExpoSecureStore.default.getValueWithKeyAsync is not a function
    getItemAsync \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\expo-secure-store\build\SecureStore.js:88
    checkSession \FILES\JP_DOCS\VS CODE\ecommerce_app\apps\mobile\store\auth.store.ts:51
    RootLayout \FILES\JP_DOCS\VS CODE\ecommerce_app\apps\mobile\app\_layout.tsx:33
    frame \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:23949
SecureStore.js:88:34
    checkSession \FILES\JP_DOCS\VS CODE\ecommerce_app\apps\mobile\store\auth.store.ts:51
    AsyncFunctionThrow self-hosted:784
    (Asíncrono: async)
    RootLayout \FILES\JP_DOCS\VS CODE\ecommerce_app\apps\mobile\app\_layout.tsx:33
    frame \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:23949
    runWithFiberInDEV \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:1522
    commitHookEffectListMount \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:11905
    commitHookPassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:12026
    reconnectPassiveEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:14004
    recursivelyTraverseReconnectPassiveEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13976
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13936
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13903
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13834
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13957
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
    commitPassiveMountOnFiber \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13844
    recursivelyTraversePassiveMountEffects \FILES\JP_DOCS\VS CODE\ecommerce_app\node_modules\react-dom\cjs\react-dom-client.development.js:13815
Disconnected from Metro (1006)
To reconnect:
- Ensure that Metro is running and available on the same network
- Reload this app (will trigger further help if Metro cannot be connected to) hmr.ts:284:15
```

Vista web:
```
Uncaught Error
ExpoSecureStore.default.getValueWithKeyAsync is not a function
Call Stack
getItemAsync
node_modules/expo-secure-store/build/SecureStore.js
checkSession
store/auth.store.ts
useEffect$argument_0
app/_layout.tsx
callCreate.reactStackBottomFrame
node_modules/react-dom/cjs/react-dom-client.development.js
runWithFiberInDEV
node_modules/react-dom/cjs/react-dom-client.development.js
commitHookEffectListMount
node_modules/react-dom/cjs/react-dom-client.development.js
commitHookPassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
reconnectPassiveEffects
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraverseReconnectPassiveEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
recursivelyTraversePassiveMountEffects
node_modules/react-dom/cjs/react-dom-client.development.js
commitPassiveMountOnFiber
node_modules/react-dom/cjs/react-dom-client.development.js
```

Contenido visualizable dentro de la página (único contenido que se cargó):

"K
KUMAR Store
El portal premium para tus compras en Quito"

Se visualiza el contenido en texto para la selección del inicio de sesión, resgistro o continuar como invitado.

No se visualiza el contenido de la página, solo el texto mencionado anteriormente.

Al dar click en "Continuar como invitado" se muestra el siguiente contenido:

```
Uncaught Error
ExpoSecureStore.default.deleteValueWithKeyAsync is not a function
Call Stack
<global>
node_modules/react-native-web/dist/exports/UIManager/index.js
FlatList#componentDidUpdate
node_modules/react-native-web/dist/vendor/react-native/FlatList/index.js
```