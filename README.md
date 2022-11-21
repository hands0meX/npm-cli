### CLI

[build 🔨](#build)

-   [fs 📃](#fs)

**Install**
npm i -g @car_han/cli

**🚀launch**

```js
Usage: thx-cli [options] [command]

CLI to handle some os things quickly.

Options:
  -V, --version        output the version number
  -h, --help           display help for command

Commands:
  build [options]      build fs and so on.
  help [command]       display help for command
```

#### build

##### fs (file system)

###### Usage
1. **build**
-   thx build --fs "F#foo>ts#test+(F#bar>ts#test) in ./"
-   thx build
    ```shell
    > Enter file system by emmet: F#foo>ts#test+(F#bar>ts#test)+(F#aaa>ts#test) in ./
    ```
    ```
    |--foo/
      |--test.ts
      |--bar/
        |--test.ts
      |--aaa/
        |--test.ts
    ```
    have to be aware of is:
-   use "#" to set the name of your file|folder
-   use ">" to set your sub file|folder
-   use "in" to set gen target root path, default is "./"

2. **parse**
- Parse the target folder
```shell
thx build --fsp ./foo
```
```js
return F#foo>(F#aaa>ts#test)+(F#bar>ts#test)+ts#test
```

 
**_Not finished yet, stay tuned._**
