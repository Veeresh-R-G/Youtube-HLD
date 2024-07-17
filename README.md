Zookeeper service : docker run -p 2181:2181 zookeepe

Kafka service : docker run -p 9092:9092 -e KAFKA_ZOOKEEPER_CONNECT=192.168.0.108:2181 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.0.108:9092 -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 confluentinc/cp-kafka

### Doc References

1. [!https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpu-upload-object.html](AWS Multipart Upload)

#### Things I didn't know in Multiupload

> Minimum chunk size should be >5MB, else you get EntityTooSmall Error
