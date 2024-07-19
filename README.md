### Docker Commands
- Zookeeper service : docker run -p 2181:2181 zookeepe

- Kafka service : docker run -p 9092:9092 -e KAFKA_ZOOKEEPER_CONNECT=192.168.0.108:2181 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.0.108:9092 -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 confluentinc/cp-kafka

### Doc References

- [AWS Multipart Upload](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpu-upload-object.html)
- [FFMPEG Config](https://www.npmjs.com/package/ffmpeg-static)
- [FFMPEG Module](https://www.npmjs.com/package/fluent-ffmpeg)
#### Things I didn't know about Multiupload

> Minimum chunk size should be >5MB, else you get EntityTooSmall Error
