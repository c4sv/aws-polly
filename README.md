# AWS Polly for Asterisk

## CentOS 6+

- yum install gcc-c++ libmad libmad-devel libid3tag libid3tag-devel lame lame-devel flac-devel libvorbis-devel sox

## Packages

- minimist, dotenv, fs, awk-sdk, child_process

## AWS

- Create Identity and Access Management (IAM) with AmazonPollyFullAccess
- Default Voice: Camila (pt-BR), neural engine, 24kHz converted to 8kHz

## Asterisk 11+

- e.g Supose you have this variables: TTSMSG="Ai dentro, mah." TTSSTATUS=1

```asterisk
exten => s,1,Macro()

[macro-tts]
exten => s,1,NoOp(${ARG1}) ;Reference for your treatment in some odbc function
...your code
same => n,ExecIf($[${TTSSTATUS}=1"${TTSMSG}">"0"]?Set(TTS_AUDIO=${MD5(${TTSMSG})}):MacroExit) ;
same => n,Set(EXISTFILE=${STAT(e,/var/lib/asterisk/sounds/br/tts/${TTS_AUDIO}.wav)})
same => n,ExecIf($[${EXISTFILE}=0]?System(node /opt/aws-polly/src/script.js --text='${TTSMSG}' --audiofile=/var/lib/asterisk/sounds/${TTS_AUDIO}))
same => n,Playback(${TTS_AUDIO},noanswer)
same => n,Wait(1) ;Breathing
same => n,MacroExit
```
