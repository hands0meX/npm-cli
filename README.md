### CLI
[build  🔨](#build)
+ [fs 📃](#fs)


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
```shell
> Enter file system by emmet: F#foo>ts#test+(F#bar>ts#test)+(F#aaa>ts#test)
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
- use "#" to set the name of your file|folder
- use ">" to set your sub file|folder
***Not finished yet, stay tuned.***