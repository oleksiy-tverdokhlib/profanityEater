# profanityEater

> a server built with Flask + Python

## Installing server

Run `npm install` to install the dependencies.

 python -u "c:\Users\www\Desktop\serverFlask\app1.py"


```shell
$ python -u "\app1.py"
```

### Chrome Extension Developer Mode

  Running on http://127.0.0.1:5000


# app_extention

> a chrome extension tools built with Vite + React, and Manifest v3

## Installing

1. Check if your `Node.js` version is >= **14**.
2. Change or configurate the name of your extension on `src/manifest`.
3. Run `npm install` to install the dependencies.

## Developing

run the command

```shell
$ cd app_extention

$ npm run dev
```

### Chrome Extension Developer Mode

1. set your Chrome browser 'Developer mode' up
2. click 'Load unpacked', and select `my-crx-app/build` folder

### Nomal FrontEnd Developer Mode

1. access `http://0.0.0.0:3000/`
2. when debugging popup page, open `http://0.0.0.0:3000//popup.html`
3. when debugging options page, open `http://0.0.0.0:3000//options.html`

## Packing

After the development of your extension run the command

```shell
$ npm run build
```

Now, the content of `build` folder will be the extension ready to be submitted to the Chrome Web Store. Just take a look at the [official guide](https://developer.chrome.com/webstore/publish) to more infos about publishing.

---


