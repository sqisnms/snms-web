import { Consumer, EachMessagePayload, Kafka } from "kafkajs"

let kafkaConsumer: Consumer | null = null

/**
 * Kafka Consumer를 시작하는 함수
 * @param onMessage - 메시지를 처리할 콜백 함수
 */
export async function startKafkaConsumer(onMessage: (message: string) => void): Promise<void> {
  const kafka = new Kafka({
    clientId: "nextjs-app",
    brokers: ["localhost:9092"], // Kafka 브로커 주소
  })

  // Kafka Consumer 생성
  kafkaConsumer = kafka.consumer({ groupId: "nextjs-group" })
  await kafkaConsumer.connect()
  await kafkaConsumer.subscribe({ topic: "test-topic", fromBeginning: true })

  // 메시지를 처리하는 로직
  await kafkaConsumer.run({
    eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
      console.log(topic)
      console.log(partition)
      const msg = message.value?.toString() || "" // 메시지 값이 null일 경우 빈 문자열 처리
      console.log(`Received message: ${msg}`)
      if (onMessage) onMessage(msg) // 콜백 함수 호출
    },
  })
}
