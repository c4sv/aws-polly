require("dotenv").config();

var AWS = require("aws-sdk");
var Fs = require("fs");
var argv = require("minimist")(process.argv.slice(2));
var child_process = require("child_process");

console.log(
  process.env.accessKeyId,
  process.env.secretAccessKey,
  process.env.signatureVersion,
  process.env.region
);

const Polly = new AWS.Polly({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  signatureVersion: process.env.signatureVersion,
  region: process.env.region,
});

/*
LanguageCode:
Valid Values: arb | cmn-CN | cy-GB | da-DK | de-DE | en-AU | en-GB | en-GB-WLS | en-IN | en-US | es-ES | es-MX | es-US | fr-CA | fr-FR | is-IS | it-IT | ja-JP | hi-IN | ko-KR | nb-NO | nl-NL | pl-PL | pt-BR | pt-PT | ro-RO | ru-RU | sv-SE | tr-TR

Gender:
Valid Values: Female | Male

VoiceId:
Valid Values: Aditi | Amy | Astrid | Bianca | Brian | Camila | Carla | Carmen | Celine | Chantal | Conchita | Cristiano | Dora | Emma | Enrique | Ewa | Filiz | Geraint | Giorgio | Gwyneth | Hans | Ines | Ivy | Jacek | Jan | Joanna | Joey | Justin | Karl | Kendra | Kimberly | Lea | Liv | Lotte | Lucia | Lupe | Mads | Maja | Marlene | Mathieu | Matthew | Maxim | Mia | Miguel | Mizuki | Naja | Nicole | Penelope | Raveena | Ricardo | Ruben | Russell | Salli | Seoyeon | Takumi | Tatyana | Vicki | Vitoria | Zeina | Zhiyu

OutputFormat:
Valid Values: json | mp3 | ogg_vorbis | pcm

SampleRate:
Valid values: For pcm are "8000" and "16000" The default value is "16000"
Valid Values: For mp3 and ogg_vorbis are "8000", "16000", "22050", and "24000". The default value for standard voices is "22050". The default value for neural voices is "24000".
*/

let params = {
  Text: argv.text,
  OutputFormat: "mp3",
  SampleRate: "24000",
  VoiceId: "Camila",
  Engine: "neural",
  LanguageCode: "pt-BR",
};

Polly.synthesizeSpeech(params, (error, data) => {
  if (error) {
    console.log(error.code);
  } else if (data) {
    if (data.AudioStream instanceof Buffer) {
      Fs.writeFile(argv.audiofile + ".mp3", data.AudioStream, function (error) {
        if (error) {
          return console.log(error);
        }
        try {
          var output = child_process.execSync(
            "lame --decode " +
              argv.audiofile +
              ".mp3 -b 24000" +
              " " +
              argv.audiofile +
              ".wav; sox " +
              argv.audiofile +
              ".wav -t wav -r 8000 -c 1 " +
              argv.audiofile +
              "-converted.wav"
          );
          Fs.unlinkSync(argv.audiofile + ".wav");
        } catch (err) {
          console.log(err);
        }

        Fs.rename(
          argv.audiofile + "-converted.wav",
          argv.audiofile + ".wav",
          (error) => {
            Fs.unlinkSync(argv.audiofile + ".mp3");
            if (error) throw error;
          }
        );
      });
    }
  }
});
