const { Kafka } = require("kafkajs");

class KafkaConfig {
  constructor() {
    this.kafka = new Kafka({
      clientId: "yt-app",
      brokers: ["192.168.0.108:9092"],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: "group - 1" });
  }

  async produce(topic, messages) {
    const producer = this.kafka.producer();

    console.log("Producer Connecting");
    await producer.connect();
    console.log("Producer Connected");

    await producer.send({
      topic: topic,
      messages: [
        {
          partition: 1,
          key: "kafka-connect",
          value: JSON.stringify({ name: "hola", location: "SOUTH" }),
        },
      ],
    });

    console.log("TOPIC Message Sent !!!");

    await producer.disconnect();
  }

  async consume(topic, callback) {
    const consumer = this.kafka.consumer({ groupId: "user - 1" });

    const res = await consumer.connect();
    console.log("Consumer Initialised!!", res);

    await consumer.subscribe({
      topics: [topic],
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
        console.log(`[${topic}] ${partition} ${message.value.toString()}`);
      },
    });
  }

  async init(topic) {
    const admin = this.kafka.admin();
    console.log("Connecting to Admin");
    await admin.connect();
    console.log("Admin Connected !!");

    console.log("Creating topic [transcode]");
    await admin.createTopics({
      topics: [
        {
          topic: topic,
          numPartitions: 2,
        },
      ],
    });
    console.log("Topic [transcode] Created");

    await admin.disconnect();
    console.log("Disconnecting Admin !!");
  }
}

module.exports = {
  KafkaConfig,
};
