# pythonインストールではまった点



## 1回目エラー

```
$ pyenv install 3.6.5
Downloading Python-3.6.5.tar.xz...
-> https://www.python.org/ftp/python/3.6.5/Python-3.6.5.tar.xz
Installing Python-3.6.5...

BUILD FAILED (Ubuntu 16.04 using python-build 1.2.7-3-g5603eb5)

Inspect or clean up the working tree at /tmp/python-build.20180911134837.1147
Results logged to /tmp/python-build.20180911134837.1147.log

Last 10 log lines:
checking for --with-universal-archs... no
checking MACHDEP... linux
checking for --without-gcc... no
checking for --with-icc... no
checking for gcc... no
checking for cc... no
checking for cl.exe... no
configure: error: in `/tmp/python-build.20180911134837.1147/Python-3.6.5':
configure: error: no acceptable C compiler found in $PATH
See `config.log' for more details
```

↓対処

```
sudo apt install gcc
```

## 2回目エラー

```
$ pyenv install 3.6.6
Downloading Python-3.6.6.tar.xz...
-> https://www.python.org/ftp/python/3.6.6/Python-3.6.6.tar.xz
Installing Python-3.6.6...

BUILD FAILED (Ubuntu 16.04 using python-build 1.2.7-3-g5603eb5)

Inspect or clean up the working tree at /tmp/python-build.20180911135228.5445
Results logged to /tmp/python-build.20180911135228.5445.log

Last 10 log lines:
creating Modules/Setup
creating Modules/Setup.local
creating Makefile


If you want a release build with all stable optimizations active (PGO, etc),
please run ./configure --enable-optimizations


/home/ubuntu/.pyenv/plugins/python-build/bin/python-build: line 763: make: command not found
```

↓対処

```
sudo apt install make
```

## ３回目エラー

```
$ pyenv install 3.6.6
Downloading Python-3.6.6.tar.xz...
-> https://www.python.org/ftp/python/3.6.6/Python-3.6.6.tar.xz
Installing Python-3.6.6...

BUILD FAILED (Ubuntu 16.04 using python-build 1.2.7-3-g5603eb5)

Inspect or clean up the working tree at /tmp/python-build.20180911144241.21992
Results logged to /tmp/python-build.20180911144241.21992.log

Last 10 log lines:
    sys.exit(ensurepip._main())
  File "/tmp/python-build.20180911144241.21992/Python-3.6.6/Lib/ensurepip/__init__.py", line 204, in _main
    default_pip=args.default_pip,
  File "/tmp/python-build.20180911144241.21992/Python-3.6.6/Lib/ensurepip/__init__.py", line 117, in _bootstrap
    return _run_pip(args + [p[0] for p in _PROJECTS], additional_paths)
  File "/tmp/python-build.20180911144241.21992/Python-3.6.6/Lib/ensurepip/__init__.py", line 27, in _run_pip
    import pip._internal
zipimport.ZipImportError: can't decompress data; zlib not available
Makefile:1103: recipe for target 'install' failed
make: *** [install] Error 1
```

↓対処

```
sudo apt-get install zlib1g-dev
```

## 4回目エラー

```
$ pyenv install 3.6.6
Downloading Python-3.6.6.tar.xz...
-> https://www.python.org/ftp/python/3.6.6/Python-3.6.6.tar.xz
Installing Python-3.6.6...

WARNING: The Python bz2 extension was not compiled. Missing the bzip2 lib?
WARNING: The Python readline extension was not compiled. Missing the GNU readline lib?
ERROR: The Python ssl extension was not compiled. Missing the OpenSSL lib?

Please consult to the Wiki page to fix the problem.
https://github.com/pyenv/pyenv/wiki/Common-build-problems

BUILD FAILED (Ubuntu 16.04 using python-build 1.2.7-3-g5603eb5)

Inspect or clean up the working tree at /tmp/python-build.20180911145352.4690
Results logged to /tmp/python-build.20180911145352.4690.log

Last 10 log lines:
                install|*) ensurepip="" ;; \
        esac; \
         ./python -E -m ensurepip \
                $ensurepip --root=/ ; \
fi
Looking in links: /tmp/tmp9dka829a
Collecting setuptools
Collecting pip
Installing collected packages: setuptools, pip
Successfully installed pip-10.0.1 setuptools-39.0.1
```

↓対処

```
sudo apt-get install libssl-dev libbz2-dev libreadline-dev libsqlite3-dev
```


## まとめ
pythonの必要性ライブラリは以下でまとめてインストールできる

```
sudo apt-get install build-essential libncursesw5-dev libgdbm-dev libc6-dev zlib1g-dev libsqlite3-dev tk-dev libssl-dev openssl libbz2-dev libreadline-dev
```