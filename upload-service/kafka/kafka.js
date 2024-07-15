import { Kafka } from "kafkajs";
import fs from "fs";
import path from "path";

class KafkaConfig {
  constructor() {
    this.kafka = new Kafka({
      clientId: "yt-uploader",
      brokers: ["192.168.0.108:9092"],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: "user - 1" });
  }

  async produce(topic, messages) {
    try {
      const result = await this.producer.connect();
      console.log(`Kafka Producer connected ...  ${result}`);

      await this.producer.send({
        topic: topic,
        messages: messages,
      });
    } catch (err) {
      console.log(`Error while producing : ${err}`);
    } finally {
      await this.producer.disconnect();
    }
  }

  async consume(topic, callback) {
    try {
      const result = await this.consumer.connect();
      console.log(`Consumer Connected : ${result}`);

      await this.consumer.subscribe({
        topics: [topic],
        fromBeginning: true,
      });

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = message.value.toString();
          callback(value);
        },
      });
    } catch (err) {
      console.log(`Error while consuming : ${err}`);
    } finally {
      this.consumer.disconnect();
    }
  }
}

export default KafkaConfig;
