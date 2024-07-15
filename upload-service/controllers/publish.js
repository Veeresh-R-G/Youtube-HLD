const { KafkaConfig } = require("../kafka/kafka");

const publishToKafka = async (req, res) => {
  const kafkaProducer = new KafkaConfig();
  const message = "From the Publish Service";

  const msgs = [
    {
      partition: 1,
      key: "key1",
      value: JSON.stringify(message),
    },
  ];

  const result = await kafkaProducer.produce("transcode", msgs);

  res.status(200).send("Message Published to Kafka successfully");
};

module.exports = {
  publishToKafka,
};
