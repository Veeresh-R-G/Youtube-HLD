import Ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";

Ffmpeg.setFfmpegPath(ffmpegStatic);

const convertToHLS = async () => {
  const resolutions = [
    {
      resolution: "320x180",
      videoBitrate: "500k",
      audioBitrate: "64k",
    },
    {
      resolution: "640x360",
      videoBitrate: "800k",
      audioBitrate: "128k",
    },
    {
      resolution: "1280x720",
      videoBitrate: "1200k",
      audioBitrate: "128k",
    },
    {
      resolution: "1920x1080",
      videoBitrate: "2000k",
      audioBitrate: "192k",
    },
  ];

  for (const { resolution, videoBitrate, audioBitrate } of resolutions) {
    await new Promise((resolve, reject) => {
      Ffmpeg("input.mp4")
        .videoCodec("libx264")
        .audioCodec("aac")
        .size(resolution)
        .videoBitrate(videoBitrate)
        .audioBitrate(audioBitrate)
        .outputOptions([
          "-hls_time 10",
          "-hls_list_size 0",
          "-hls_segment_filename output/360p_%03d.ts",
        ])
        .output("output/360p.m3u8")
        .on("end", resolve)
        .on("error", reject)
        .run();
    });
  }
};

module.exports = {
  convertToHLS,
};
